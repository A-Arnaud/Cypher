module.exports=async context=>{
 const path=require('node:path');const fs=require('node:fs');const target=JSON.parse(fs.readFileSync(path.join(context.packager.projectDir,'dist/native/codex/target.json'),'utf8'));
 const arch=require('builder-util').Arch[context.arch];
 if(target.platform!==context.electronPlatformName||target.arch!==arch)throw Error('Build the Codex connector separately on a host matching the package platform and architecture');
};
