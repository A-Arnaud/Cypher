// Raster assets for native menu/tray images; no renderer, account data or runtime SVG engine.
const fs=require('node:fs'),path=require('node:path'),{Resvg}=require('@resvg/resvg-js');
const out='dist/assets/indicator';fs.mkdirSync(out,{recursive:true});
for(const name of fs.readdirSync('assets/providers').filter(n=>/\.(svg|png)$/.test(n))){const input=path.join('assets/providers',name),target=path.join(out,path.parse(name).name+'.png');if(name.endsWith('.png'))fs.copyFileSync(input,target);else fs.writeFileSync(target,new Resvg(fs.readFileSync(input,'utf8').replaceAll('currentColor','#fff'),{fitTo:{mode:'width',value:32}}).render().asPng())}
for(const name of fs.readdirSync('assets/providers').filter(n=>n.startsWith('LICENSE')))fs.copyFileSync(path.join('assets/providers',name),path.join(out,name));
for(const percent of [true,false]){
 const rows=Array.from({length:102},(_,i)=>`<text x="${percent?29:19}" y="${i*11+9}" text-anchor="end" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="10" font-weight="600" fill="white">${i===101?'—':i+(percent?'%':'')}</text>`).join('');
 fs.writeFileSync(path.join(out,percent?'percent.png':'number.png'),new Resvg(`<svg xmlns="http://www.w3.org/2000/svg" width="${percent?30:20}" height="1122">${rows}</svg>`,{fitTo:{mode:'zoom',value:2}}).render().asPng());
}
