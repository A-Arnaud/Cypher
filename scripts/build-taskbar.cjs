const {spawnSync}=require('node:child_process');const fs=require('node:fs');const path=require('node:path');
const output=path.resolve('dist/native');fs.mkdirSync(output,{recursive:true});
const {Resvg}=require('@resvg/resvg-js');const logos=path.join(output,'logos');fs.mkdirSync(logos,{recursive:true});
const resources=[];
for(const asset of fs.readdirSync('assets/providers').filter(name=>/\.(svg|png)$/.test(name))){const name=path.parse(asset).name;const file=path.join(logos,name+'.png');if(asset.endsWith('.svg')){const svg=fs.readFileSync(path.join('assets/providers',asset),'utf8').replaceAll('currentColor','#f5f5f5');fs.writeFileSync(file,new Resvg(svg,{fitTo:{mode:'width',value:64}}).render().asPng())}else fs.copyFileSync(path.join('assets/providers',asset),file);resources.push('/resource:'+file+',Cypher.Logos.'+name+'.png')}
fs.copyFileSync('assets/icon.png',path.join(logos,'default.png'));resources.push('/resource:'+path.join(logos,'default.png')+',Cypher.Logos.default.png');fs.copyFileSync('assets/providers/LICENSE.txt',path.join(output,'LOGOS-LICENSE.txt'));
const compiler=path.join(process.env.WINDIR||'C:/Windows','Microsoft.NET/Framework64/v4.0.30319/csc.exe');
const result=spawnSync(compiler,['/nologo','/target:exe','/platform:x64','/optimize+','/win32icon:'+path.resolve('assets/icon.ico'),'/reference:System.Windows.Forms.dll','/reference:System.Drawing.dll','/reference:System.Web.Extensions.dll','/out:'+path.join(output,'Cypher.Taskbar.exe'),...resources,path.resolve('native/taskbar/Program.cs')],{stdio:'inherit',windowsHide:true});
if(result.error)throw result.error;if(result.status!==0)process.exit(result.status||1);
