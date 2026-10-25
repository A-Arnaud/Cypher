// Pinned official scanner; reports are redacted and stay outside published sources.
const fs=require('node:fs/promises');const path=require('node:path');const os=require('node:os');const crypto=require('node:crypto');const {execFileSync,spawnSync}=require('node:child_process');
const version='8.30.1',expected='d29144deff3a68aa93ced33dddf84b7fdc26070add4aa0f4513094c8332afc4e';
(async()=>{
 if(process.platform!=='win32'||process.arch!=='x64')throw Error('This pinned scanner command targets Windows x64');
 const folder=path.resolve('.security-tools');await fs.mkdir(folder,{recursive:true});const zip=path.join(folder,'gitleaks.zip');
 let data;try{data=await fs.readFile(zip)}catch{}
 if(!data||crypto.createHash('sha256').update(data).digest('hex')!==expected){const r=await fetch('https://github.com/gitleaks/gitleaks/releases/download/v'+version+'/gitleaks_'+version+'_windows_x64.zip');if(!r.ok)throw Error('Scanner download failed');data=Buffer.from(await r.arrayBuffer());if(crypto.createHash('sha256').update(data).digest('hex')!==expected)throw Error('Scanner checksum mismatch');await fs.writeFile(zip,data)}
 const extract=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-Command','Expand-Archive -LiteralPath $env:CYPHER_SCAN_ZIP -DestinationPath $env:CYPHER_SCAN_DIR -Force'],{stdio:'inherit',windowsHide:true,env:{...process.env,CYPHER_SCAN_ZIP:zip,CYPHER_SCAN_DIR:folder}});if(extract.error||extract.status)throw Error('Scanner extraction failed');
 const exe=path.join(folder,'gitleaks.exe');const history=spawnSync(exe,['git','.','--log-opts=--all','--redact','--no-banner','--report-format','json','--report-path',path.join(folder,'history.json')],{stdio:'inherit',windowsHide:true});if(history.error||history.status)throw Error('History secret scan did not pass');
 const snapshot=await fs.mkdtemp(path.join(os.tmpdir(),'cypher-public-files-'));try{
  const files=execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{encoding:'utf8',windowsHide:true}).split('\0').filter(Boolean);
  for(const name of files){let stat;try{stat=await fs.lstat(name)}catch{continue}if(!stat.isFile()||stat.isSymbolicLink())continue;const target=path.join(snapshot,name);await fs.mkdir(path.dirname(target),{recursive:true});await fs.copyFile(name,target)}
  const worktree=spawnSync(exe,['dir',snapshot,'--redact','--no-banner','--report-format','json','--report-path',path.join(folder,'worktree.json')],{stdio:'inherit',windowsHide:true});if(worktree.error||worktree.status)throw Error('Public file secret scan did not pass');
 }finally{const target=path.resolve(snapshot),parent=path.resolve(os.tmpdir());if(path.dirname(target)!==parent||!path.basename(target).startsWith('cypher-public-files-'))throw Error('Unsafe temporary cleanup path');await fs.rm(target,{recursive:true,force:true})}
 console.log('Pinned Gitleaks checks passed for Git history and public files; redacted reports remain local.');
})().catch(e=>{console.error(e.message);process.exitCode=1});
