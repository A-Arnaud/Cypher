// Separate local test artifact: inspector access is never enabled in release builds.
const {spawnSync}=require('node:child_process');const path=require('node:path');
const build=spawnSync(process.execPath,[path.resolve('node_modules/vite/bin/vite.js'),'build'],{stdio:'inherit',windowsHide:true});if(build.status)process.exit(build.status);
const main=spawnSync(process.execPath,['scripts/build.cjs'],{stdio:'inherit',windowsHide:true,env:{...process.env,CYPHER_BUILD_TEST:'1'}});if(main.status)process.exit(main.status);
const packaged=spawnSync(process.execPath,[path.resolve('node_modules/electron-builder/out/cli/cli.js'),'--publish','never','--dir','--win','--x64','--config.directories.output=.local-builds/electron-test','--config.electronFuses.enableNodeCliInspectArguments=true'],{stdio:'inherit',windowsHide:true});if(packaged.error)throw packaged.error;process.exit(packaged.status??1);
