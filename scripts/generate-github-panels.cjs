// Compose renderer screenshots into a documentation panel; no invented app UI.
const fs=require('node:fs');const {Resvg}=require('@resvg/resvg-js');const {version}=require('../package.json');
const png=file=>'data:image/png;base64,'+fs.readFileSync(file).toString('base64');
const panels=[
 {x:48,title:'Windows',tag:'BOTTOM TASKBAR',file:'settings.png',line1:'The indicator appears at launch.',line2:'Startup remains your choice.'},
 {x:565,title:'macOS',tag:'TOP MENU BAR',file:'settings-macos.png',line1:'Quota readings at the top.',line2:'No running-app icon in the Dock.'},
 {x:1082,title:'Quick actions',tag:'CTRL+K / COMMAND+K',file:'quick-actions-synthetic.png',line1:'Find a profile, service or action.',line2:'One search, from either view.'}
];
const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1600" height="1130" viewBox="0 0 1600 1130">
<defs><radialGradient id="glow"><stop stop-color="#5e3449" stop-opacity=".45"/><stop offset="1" stop-color="#0b0d11" stop-opacity="0"/></radialGradient><filter id="shadow" x="-20%" y="-15%" width="140%" height="145%"><feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000" flood-opacity=".4"/></filter></defs>
<rect width="1600" height="1130" rx="28" fill="#0b0d11"/><ellipse cx="800" cy="180" rx="850" ry="500" fill="url(#glow)"/>
<rect x="1" y="1" width="1598" height="1128" rx="27" fill="none" stroke="#ffffff19"/>
<g font-family="Segoe UI,Arial,sans-serif">
<image x="62" y="48" width="54" height="54" xlink:href="${png('assets/icon.png')}"/>
<text x="132" y="81" fill="#ed93af" font-size="17" font-weight="600" letter-spacing="3">CYPHER ${version}</text>
<text x="64" y="159" fill="#f4f2f6" font-size="57" font-weight="600" letter-spacing="-2">Ready when you open it.</text>
<text x="67" y="203" fill="#a2a7b4" font-size="24">Automatic indicator. A saved preference. Your window, when you need it.</text>
${panels.map(p=>`<rect x="${p.x}" y="249" width="470" height="818" rx="22" fill="#ffffff03" stroke="#ffffff12"/>
<text x="${p.x+28}" y="286" fill="#acb2bf" font-size="11" letter-spacing="2.4">${p.tag}</text>
<text x="${p.x+27}" y="329" fill="#f1eef3" font-size="31" font-weight="600">${p.title}</text>
<image x="${p.x+49}" y="355" width="372" height="609" filter="url(#shadow)" xlink:href="${png('docs/screenshots/'+p.file)}"/>
<text x="${p.x+28}" y="1005" fill="#c6c9d2" font-size="18">${p.line1}</text>
<text x="${p.x+28}" y="1034" fill="#9097a5" font-size="18">${p.line2}</text>`).join('')}
<text x="65" y="1104" fill="#737b8a" font-size="14">Actual Cypher interface · Demonstration accounts and readings · macOS layout preview</text>
</g></svg>`;
fs.mkdirSync('docs/brand',{recursive:true});fs.writeFileSync('docs/brand/whats-new.svg',svg);fs.writeFileSync('docs/brand/whats-new.png',new Resvg(svg,{font:{loadSystemFonts:true}}).render().asPng());
console.log('Generated the release feature panel from current UI screenshots.');
