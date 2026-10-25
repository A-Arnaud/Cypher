// Checks the hardened release itself, without granting any account access.
const fs=require('node:fs/promises');const path=require('node:path');const os=require('node:os');const net=require('node:net');const {spawn,spawnSync}=require('node:child_process');const assert=require('node:assert/strict');
(async()=>{const root=await fs.mkdtemp(path.join(os.tmpdir(),'cypher-production-security-'));let child;
try{
 const home=path.join(root,'home'),roaming=path.join(home,'AppData','Roaming'),local=path.join(home,'AppData','Local');await fs.mkdir(roaming,{recursive:true});await fs.mkdir(local,{recursive:true});
 const marker=path.join(root,'injected-marker'),probe=path.join(root,'injected.cjs');await fs.writeFile(probe,"require('node:fs').writeFileSync(process.env.CYPHER_SECURITY_MARKER,'injected')");
 const listener=net.createServer();await new Promise(resolve=>listener.listen(0,'127.0.0.1',resolve));const port=listener.address().port;await new Promise(resolve=>listener.close(resolve));
 const env={...process.env,USERPROFILE:home,HOME:home,APPDATA:roaming,LOCALAPPDATA:local,QG_DATA_DIR:path.join(root,'preferences'),PATH:path.join(process.env.SystemRoot,'System32'),ELECTRON_RUN_AS_NODE:'1',NODE_OPTIONS:'--require "'+probe+'"',CYPHER_SECURITY_MARKER:marker};for(const key of ['CODEX_HOME','CLAUDE_CONFIG_DIR','GEMINI_CLI_HOME','CYPHER_DATA_DIR','QG_DEV_URL'])delete env[key];
 child=spawn(path.resolve('release/win-unpacked/Cypher.exe'),['-e',"require('node:fs').writeFileSync(process.env.CYPHER_SECURITY_MARKER,'injected')",'--remote-debugging-port='+port],{env,windowsHide:true,stdio:'ignore'});
 const ready=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-Command','$p=Get-Process -Id $env:CYPHER_PROBE_PID -ErrorAction Stop; for($i=0;$i -lt 100;$i++){ $p.Refresh(); if($p.HasExited){exit 2}; if($p.MainWindowHandle -ne 0){exit 0}; Start-Sleep -Milliseconds 100 }; exit 3'],{env:{...process.env,CYPHER_PROBE_PID:String(child.pid)},windowsHide:true,stdio:'ignore',timeout:15000});assert.equal(ready.status,0,'production release did not open normally');
 await assert.rejects(fs.access(marker));
 const debugging=await new Promise(resolve=>{const socket=net.connect({host:'127.0.0.1',port});socket.setTimeout(1000);socket.once('connect',()=>{socket.destroy();resolve(true)});socket.once('error',()=>resolve(false));socket.once('timeout',()=>{socket.destroy();resolve(false)})});assert.equal(debugging,false,'production remote debugger must not listen');
 console.log(JSON.stringify({passed:true,checks:['hardened production app starts with an empty user profile','ELECTRON_RUN_AS_NODE and NODE_OPTIONS did not execute injected code','remote debugging port did not open','no account access granted']},null,2));
}finally{
 if(child?.pid)spawnSync('taskkill.exe',['/PID',String(child.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});
 const target=path.resolve(root);if(path.dirname(target)!==path.resolve(os.tmpdir())||!path.basename(target).startsWith('cypher-production-security-'))throw Error('Unsafe cleanup path');await fs.rm(target,{recursive:true,force:true,maxRetries:5,retryDelay:100});
}})().catch(e=>{console.error(e.message);process.exitCode=1});
