// Copy only the unmodified official auth/account executable, not inference tools.
const fs=require('node:fs');const path=require('node:path');
const targets={win32:{x64:'x86_64-pc-windows-msvc',arm64:'aarch64-pc-windows-msvc'},darwin:{x64:'x86_64-apple-darwin',arm64:'aarch64-apple-darwin'},linux:{x64:'x86_64-unknown-linux-musl',arm64:'aarch64-unknown-linux-musl'}};
const target=targets[process.platform]?.[process.arch];if(!target)throw Error('Unsupported Codex connector target');
const packageRoot=path.dirname(require.resolve(`@openai/codex-${process.platform}-${process.arch}/package.json`));
const upstream=path.join(packageRoot,'vendor',target);const out=path.resolve('dist/native/codex');const binary=process.platform==='win32'?'codex.exe':'codex';
fs.mkdirSync(path.join(out,'bin'),{recursive:true});fs.copyFileSync(path.join(upstream,'bin',binary),path.join(out,'bin',binary));if(process.platform!=='win32')fs.chmodSync(path.join(out,'bin',binary),0o755);
fs.copyFileSync(path.join(upstream,'codex-package.json'),path.join(out,'codex-package.json'));
for(const name of ['CODEX-LICENSE.txt','CODEX-NOTICE.txt'])fs.copyFileSync(path.join('assets/licenses',name),path.join(out,name));
fs.writeFileSync(path.join(out,'target.json'),JSON.stringify({platform:process.platform,arch:process.arch,version:require('@openai/codex/package.json').version})+'\n');
