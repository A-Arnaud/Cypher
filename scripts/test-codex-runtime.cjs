// Probe the real bundled protocol in an empty, file-only auth profile.
// No login, model generation, account quota request, or user credential read.
const fs=require('node:fs/promises');const path=require('node:path');const os=require('node:os');const {spawn}=require('node:child_process');const {createInterface}=require('node:readline');
(async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'cypher-codex-empty-'));let child;
 try{
  const env={PATH:process.env.PATH,SystemRoot:process.env.SystemRoot,WINDIR:process.env.WINDIR,HOME:root,USERPROFILE:root,APPDATA:root,LOCALAPPDATA:root,CODEX_HOME:root,TMPDIR:root,TMP:root,TEMP:root};
  const executable=path.resolve('dist/native/codex/bin',process.platform==='win32'?'codex.exe':'codex');
  child=spawn(executable,['-c','cli_auth_credentials_store="file"','-c','analytics.enabled=false','-c','feedback.enabled=false','-c','otel.exporter="none"','-c','otel.trace_exporter="none"','-c','otel.metrics_exporter="none"','app-server','--listen','stdio://'],{cwd:root,env,windowsHide:true,stdio:['pipe','pipe','pipe']});
  await new Promise((resolve,reject)=>{
   let done=false,total=0;const lines=createInterface({input:child.stdout});const finish=error=>{if(done)return;done=true;clearTimeout(timer);lines.close();error?reject(error):resolve()};const timer=setTimeout(()=>finish(Error('Empty-profile protocol probe timed out')),20000);
   child.on('error',()=>finish(Error('Bundled Codex could not start')));child.on('exit',()=>{if(!done)finish(Error('Bundled Codex exited before responding'))});child.stdin.on('error',()=>finish(Error('Bundled Codex input closed')));child.stderr.on('data',()=>{});
   lines.on('line',line=>{total+=line.length;if(total>2_000_000){finish(Error('Protocol output limit'));return}let message;try{message=JSON.parse(line)}catch{return}if(message.id===1){if(message.error){finish(Error('Bundled initialization rejected'));return}child.stdin.write(JSON.stringify({method:'initialized'})+'\n');child.stdin.write(JSON.stringify({id:2,method:'account/read',params:{refreshToken:false}})+'\n')}if(message.id===2){if(message.error||message.result?.account!==null)finish(Error('Expected an empty authenticated account in isolated profile'));else finish()}});
   child.stdin.write(JSON.stringify({id:1,method:'initialize',params:{clientInfo:{name:'cypher',title:'Cypher',version:'0.5.1'},capabilities:null}})+'\n');
  });
  console.log('Bundled Codex native protocol starts and reports no account in an empty isolated profile.');
 }finally{if(child&&child.exitCode===null){const exited=new Promise(resolve=>child.once('exit',resolve));child.stdin.end();child.kill();await exited}await fs.rm(root,{recursive:true,force:true,maxRetries:10,retryDelay:200})}
})().catch(error=>{console.error(error.message);process.exitCode=1});
