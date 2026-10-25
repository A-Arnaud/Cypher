// Reports rule names and locations only. Never prints secret values.
const fs=require('node:fs');const path=require('node:path');const {execFileSync}=require('node:child_process');
const git=args=>execFileSync('git',args,{encoding:'utf8',maxBuffer:64*1024*1024,windowsHide:true});
const patterns=[
 ['private-key',/-----BEGIN (?:RSA |EC |OPENSSH |DSA |ENCRYPTED )?PRIVATE KEY-----/g],
 ['openai-style-key',/\bsk-(?:proj-|svcacct-|ant-(?:api\d+-|admin\d+-))?[A-Za-z0-9_-]{24,}/g],
 ['openrouter-key',/\bsk-or-v1-[a-f0-9]{32,}/g],
 ['github-token',/\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})/g],
 ['google-api-key',/\bAIza[A-Za-z0-9_-]{35}\b/g],
 ['aws-access-key',/\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g],
 ['jwt',/\beyJ[A-Za-z0-9_-]{15,}\.eyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{16,}\b/g]
];
const findings=[];const seen=new Set();
function scan(buffer,label){if(buffer.includes(0))return;const text=buffer.toString('utf8');for(const [rule,pattern] of patterns){pattern.lastIndex=0;for(const match of text.matchAll(pattern)){const line=text.slice(0,match.index).split('\n').length;const location=label+':'+line;const key=rule+':'+location;if(!seen.has(key)){seen.add(key);findings.push({rule,location})}}}}
const files=git(['ls-files','--cached','--others','--exclude-standard','-z']).split('\0').filter(Boolean);
for(const name of files){if(!fs.existsSync(name))continue;if(fs.lstatSync(name).isSymbolicLink()){findings.push({rule:'symlink-requires-review',location:name});continue}if(!fs.statSync(name).isFile())continue;
 if(/(^|\/)(?:\.env(?:\..*)?|auth\.json|\.credentials\.json|oauth_creds\.json|credentials\.enc\.json.*|registry\.json|settings\.json)$/.test(name)&&!name.endsWith('.env.example'))findings.push({rule:'private-runtime-file',location:name});
 if(/\.(?:pem|key|p12|pfx|dmp)$/i.test(name))findings.push({rule:'private-key-or-dump-file',location:name});
 if(fs.statSync(name).size<=5*1024*1024)scan(fs.readFileSync(name),name);
}
const objects=git(['rev-list','--objects','--all']).trim().split('\n').filter(Boolean).map(line=>{const space=line.indexOf(' ');return {id:space<0?line:line.slice(0,space),name:space<0?'':line.slice(space+1)}}).filter(x=>x.name);
let historyBlobs=0;
const details=execFileSync('git',['cat-file','--batch-check=%(objectname) %(objecttype) %(objectsize)'],{input:objects.map(x=>x.id).join('\n')+'\n',encoding:'utf8',maxBuffer:16*1024*1024,windowsHide:true}).trim().split('\n');
const wanted=new Map(details.map((line,i)=>{const [id,type,size]=line.split(' ');return type==='blob'&&Number(size)<=5*1024*1024?[id,objects[i].name]:null}).filter(Boolean));
if(wanted.size){const packed=execFileSync('git',['cat-file','--batch'],{input:[...wanted.keys()].join('\n')+'\n',maxBuffer:128*1024*1024,windowsHide:true});let offset=0;while(offset<packed.length){const newline=packed.indexOf(10,offset);if(newline<0)break;const [id,type,sizeText]=packed.subarray(offset,newline).toString().split(' ');const size=Number(sizeText);if(type!=='blob'||!Number.isInteger(size))throw Error('Unexpected Git object');offset=newline+1;scan(packed.subarray(offset,offset+size),'history/'+id.slice(0,10)+'/'+wanted.get(id));historyBlobs++;offset+=size+1;}}
if(process.argv.includes('--artifacts')){
 const asar=require('@electron/asar');const archive=path.resolve('release/win-unpacked/resources/app.asar');
 if(!fs.existsSync(archive))throw Error('Build the production archive before scanning artifacts');
 for(const name of asar.listPackage(archive)){const clean=name.replace(/^[/\\]/,'');const stat=asar.statFile(archive,clean);if(!('size' in stat))continue;
  if(/(?:^|[/\\])(?:auth\.json|credentials\.enc\.json|registry\.json|settings\.json|\.env|\.credentials\.json|oauth_creds\.json)(?:$|\.)/i.test(clean))findings.push({rule:'private-runtime-file-in-artifact',location:clean});
  if(stat.size<=5*1024*1024)scan(asar.extractFile(archive,clean),'artifact/'+clean);
 }
}
console.log(JSON.stringify({files:files.length,historyBlobs,findings,limitations:'Pattern scan only; review screenshots and generated artifacts as well.'},null,2));if(findings.length)process.exitCode=1;
