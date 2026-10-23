// Only preloaded in read-only background CLI workers. Never used for login terminals.
const cp=require('node:child_process');const {syncBuiltinESMExports}=require('node:module');
for(const method of ['spawn','spawnSync','fork']){const original=cp[method];cp[method]=function(file,args,options){if(Array.isArray(args))return original.call(this,file,args,{...options,windowsHide:true});return original.call(this,file,{...(options??args),windowsHide:true})}}
for(const method of ['execFile','execFileSync']){const original=cp[method];cp[method]=function(file,...rest){const args=Array.isArray(rest[0])?rest.shift():[];const options=rest[0]&&typeof rest[0]==='object'?rest.shift():{};return original.call(this,file,args,{...options,windowsHide:true},...rest)}}
for(const method of ['exec','execSync']){const original=cp[method];cp[method]=function(command,options,...rest){if(typeof options==='function')return original.call(this,command,{windowsHide:true},options,...rest);return original.call(this,command,{...options,windowsHide:true},...rest)}}
syncBuiltinESMExports();
