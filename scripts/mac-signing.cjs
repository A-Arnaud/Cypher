const requiredSigningVariables=['CSC_LINK','CSC_KEY_PASSWORD','APPLE_ID','APPLE_APP_SPECIFIC_PASSWORD','APPLE_TEAM_ID'];
function requireSigningEnvironment(env){
 if(['pull_request','pull_request_target'].includes(env.GITHUB_EVENT_NAME))throw Error('Developer ID builds must not run on pull requests');
 const missing=requiredSigningVariables.filter(name=>typeof env[name]!=='string'||!env[name].trim());
 if(missing.length)throw Error('Missing Apple signing configuration: '+missing.join(', '));
}
function signedMacConfig(base){
 const {identity,...mac}=base.mac;
 return {...base,forceCodeSigning:true,dmg:{...base.dmg,sign:true},mac:{...mac,type:'distribution',hardenedRuntime:true,notarize:true,entitlements:'native/entitlements.mac.plist',entitlementsInherit:'native/entitlements.mac.plist'}};
}
function requireDeveloperIdSignature(details){
 if(!/^Authority=Developer ID Application:/m.test(details))throw Error('A Developer ID Application signature is required; ad-hoc signing is not accepted');
 if(!/\bflags=[^\r\n]*\bruntime\b/.test(details))throw Error('The signed application must enable hardened runtime');
}
module.exports={requireSigningEnvironment,signedMacConfig,requireDeveloperIdSignature,requiredSigningVariables};
if(require.main===module){try{requireSigningEnvironment(process.env);console.log('Apple signing configuration is present.')}catch(error){console.error(error.message);process.exitCode=1}}
