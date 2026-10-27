const fs=require('node:fs/promises');const path=require('node:path');const os=require('node:os');const {execFileSync}=require('node:child_process');const {createRequire}=require('node:module');
const {requireSigningEnvironment,requireDeveloperIdSignature}=require('./mac-signing.cjs');
function run(file,args){return execFileSync(file,args,{encoding:'utf8',stdio:['ignore','pipe','pipe'],timeout:120000})}
function verifyApp(app){
 run('/usr/bin/codesign',['--verify','--deep','--strict',app]);
 // codesign prints display information on stderr, even on success.
 const {spawnSync}=require('node:child_process');const result=spawnSync('/usr/bin/codesign',['--display','--verbose=4',app],{encoding:'utf8',timeout:30000});
 if(result.status!==0)throw Error('Unable to inspect Developer ID signature');
 requireDeveloperIdSignature(result.stderr);
 run('/usr/bin/xcrun',['stapler','validate',app]);
 run('/usr/sbin/spctl',['--assess','--type','execute','--verbose=2',app]);
}
(async()=>{
 if(process.platform!=='darwin')throw Error('A macOS host is required');
 requireSigningEnvironment(process.env);const arch=process.env.CYPHER_MAC_ARCH;
 if(!['x64','arm64'].includes(arch))throw Error('CYPHER_MAC_ARCH must be x64 or arm64');
 const {version}=require('../package.json');const app=path.resolve('release',arch==='arm64'?'mac-arm64':'mac','Cypher.app');
 verifyApp(app);
 const stem=path.resolve('release',`Cypher-${version}-mac-${arch}`);const dmg=stem+'.dmg';
 const builderRequire=createRequire(require.resolve('app-builder-lib/package.json'));const {notarize}=builderRequire('@electron/notarize');
 // The app was notarized by electron-builder. Also notarize and staple the outer DMG.
 await notarize({appPath:dmg,appleId:process.env.APPLE_ID,appleIdPassword:process.env.APPLE_APP_SPECIFIC_PASSWORD,teamId:process.env.APPLE_TEAM_ID});
 run('/usr/bin/codesign',['--verify','--strict',dmg]);run('/usr/bin/xcrun',['stapler','validate',dmg]);
 run('/usr/sbin/spctl',['--assess','--type','open','--context','context:primary-signature','--verbose=2',dmg]);
 const scratch=await fs.mkdtemp(path.join(os.tmpdir(),'cypher-notarized-'));const mount=path.join(scratch,'mounted');let mounted=false;
 try{
  const unpacked=path.join(scratch,'zip');await fs.mkdir(unpacked);run('/usr/bin/ditto',['-x','-k',stem+'.zip',unpacked]);verifyApp(path.join(unpacked,'Cypher.app'));
  await fs.mkdir(mount);run('/usr/bin/hdiutil',['attach','-readonly','-nobrowse','-mountpoint',mount,dmg]);mounted=true;verifyApp(path.join(mount,'Cypher.app'));
 }finally{if(mounted)run('/usr/bin/hdiutil',['detach',mount]);await fs.rm(scratch,{recursive:true,force:true})}
 console.log('Developer ID, hardened runtime, notarization tickets and Gatekeeper checks passed for app, ZIP and DMG.');
})().catch(()=>{console.error('Signed macOS verification failed. No signed release artifacts may be published. Check Apple signing/notarization and Gatekeeper results.');process.exitCode=1});
