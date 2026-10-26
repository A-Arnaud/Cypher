// Reproducible Cypher app/Windows icons from the checked-in, user-supplied PNG.
const fs=require('node:fs');const {Resvg}=require('@resvg/resvg-js');
const source=fs.readFileSync('assets/logo-source.png');
if(source.toString('hex',0,8)!=='89504e470d0a1a0a')throw Error('Expected a PNG logo source');
const width=source.readUInt32BE(16),height=source.readUInt32BE(20);
if(width!==height||width<256)throw Error('Expected a square logo at least 256 pixels wide');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Cypher graphite firefly logo"><image width="${width}" height="${height}" xlink:href="data:image/png;base64,${source.toString('base64')}"/></svg>`;
fs.writeFileSync('assets/icon.svg',svg);
const sizes=[16,24,32,48,64,128,256];const pngs=sizes.map(value=>new Resvg(svg,{fitTo:{mode:'width',value}}).render().asPng());
fs.writeFileSync('assets/icon.png',pngs.at(-1));
const header=Buffer.alloc(6+16*sizes.length);header.writeUInt16LE(1,2);header.writeUInt16LE(sizes.length,4);let offset=header.length;
sizes.forEach((size,i)=>{const at=6+16*i;header[at]=size===256?0:size;header[at+1]=size===256?0:size;header.writeUInt16LE(1,at+4);header.writeUInt16LE(32,at+6);header.writeUInt32LE(pngs[i].length,at+8);header.writeUInt32LE(offset,at+12);offset+=pngs[i].length});
fs.writeFileSync('assets/icon.ico',Buffer.concat([header,...pngs]));
console.log('Generated Cypher SVG wrapper, 256px PNG and seven-size Windows ICO from the supplied logo.');
