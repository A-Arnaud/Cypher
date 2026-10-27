// Public native-renderer examples. Fixtures only; never capture the user's desktop.
const fs=require('node:fs'),{execFileSync}=require('node:child_process');
execFileSync(process.execPath,['scripts/test-indicator-native.cjs'],{stdio:'inherit'});
fs.mkdirSync('docs/screenshots',{recursive:true});
for(const name of ['windows-taskbar','mac-menu-bar','windows-notification']){
 const source='.local-builds/indicator-validation/'+name+'.png';
 if(fs.existsSync(source))fs.copyFileSync(source,'docs/screenshots/native-'+name+'.png');
}
