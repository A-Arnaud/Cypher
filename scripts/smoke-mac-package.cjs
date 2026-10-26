// Validate that the final app starts after fuses and ad-hoc signing are applied.
const fs=require('node:fs/promises');const os=require('node:os');const path=require('node:path');const {spawn,execFileSync}=require('node:child_process');
(async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'cypher-package-'));let child;
 try{
  const app=path.resolve(process.env.CYPHER_MAC_APP);execFileSync('/usr/bin/codesign',['--verify','--deep','--strict',app],{stdio:'inherit'});
  const env={...process.env,CYPHER_DATA_DIR:path.join(root,'state'),HOME:root};delete env.ELECTRON_RUN_AS_NODE;
  child=spawn(path.join(app,'Contents/MacOS/Cypher'),[],{env,stdio:'ignore'});let exited=false;child.once('exit',()=>{exited=true});
  await new Promise((resolve,reject)=>{child.once('error',reject);setTimeout(resolve,10000)});
  if(exited)throw Error('Packaged macOS app exited before startup smoke completed');
  const settings=JSON.parse(await fs.readFile(path.join(root,'state/settings.json'),'utf8'));
  if(settings.language!=='en')throw Error('Packaged app did not initialize isolated settings');
  console.log('Final macOS application signature and launch smoke passed.');
 }finally{if(child&&child.exitCode===null){child.kill('SIGTERM');await new Promise(resolve=>child.once('exit',resolve))}await fs.rm(root,{recursive:true,force:true})}
})().catch(error=>{console.error(error);process.exitCode=1});
