// Validate that the final app starts after fuses and ad-hoc signing are applied.
const fs=require('node:fs/promises');const os=require('node:os');const path=require('node:path');const {spawn,execFileSync}=require('node:child_process');
(async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'cypher-package-'));let child;
 try{
  const app=path.resolve(process.env.CYPHER_MAC_APP);execFileSync('/usr/bin/codesign',['--verify','--deep','--strict',app],{stdio:'inherit'});
  const agent=execFileSync('/usr/libexec/PlistBuddy',['-c','Print :LSUIElement',path.join(app,'Contents/Info.plist')],{encoding:'utf8'}).trim();if(agent!=='true')throw Error('Final Mac app must declare LSUIElement=true');
  const connector=path.join(app,'Contents/Resources/app.asar.unpacked/dist/native/codex/bin/codex');
  const connectorVersion=execFileSync(connector,['--version'],{encoding:'utf8',timeout:15000});
  if(connectorVersion.trim()!=='codex-cli '+require('@openai/codex/package.json').version)throw Error('Bundled Codex connector version mismatch');
  const env={...process.env,CYPHER_DATA_DIR:path.join(root,'state'),HOME:root};delete env.ELECTRON_RUN_AS_NODE;
  child=spawn(path.join(app,'Contents/MacOS/Cypher'),[],{env,stdio:'ignore'});let exited=false;child.once('exit',()=>{exited=true});
  await new Promise((resolve,reject)=>{child.once('error',reject);setTimeout(resolve,10000)});
  if(exited)throw Error('Packaged macOS app exited before startup smoke completed');
  if(!(await fs.stat(path.join(root,'state'))).isDirectory())throw Error('Packaged app did not initialize isolated storage');
  const policy=execFileSync('/usr/bin/osascript',['-l','JavaScript','-e',`ObjC.import('AppKit'); $.NSRunningApplication.runningApplicationWithProcessIdentifier(${child.pid}).activationPolicy;`],{encoding:'utf8',timeout:15000}).trim();if(policy!=='1')throw Error('Final Mac app must stay an accessory application, policy='+policy);
  console.log('Final macOS application signature, agent plist, native accessory policy and launch smoke passed.');
 }finally{if(child&&child.exitCode===null){child.kill('SIGTERM');await new Promise(resolve=>child.once('exit',resolve))}await fs.rm(root,{recursive:true,force:true})}
})().catch(error=>{console.error(error);process.exitCode=1});
