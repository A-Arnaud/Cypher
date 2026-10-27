const {requireSigningEnvironment,signedMacConfig}=require('./scripts/mac-signing.cjs');
requireSigningEnvironment(process.env);
module.exports=signedMacConfig(require('./package.json').build);
