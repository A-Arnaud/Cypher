// Code-native annotation/composition. Screens are current React/native renderer captures.
const fs=require('node:fs'),path=require('node:path'),{Resvg}=require('@resvg/resvg-js'),{version}=require('../package.json');
const out='docs/showcase';fs.mkdirSync(out,{recursive:true});
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const png=name=>'data:image/png;base64,'+fs.readFileSync('docs/screenshots/'+name).toString('base64');
const text=(x,y,s,size=22,color='#e9edf4',weight=400)=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}">${escape(s)}</text>`;
const rect=(x,y,w,h,color='#191d25',radius=14,stroke='#303644')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${color}" stroke="${stroke}"/>`;
const picture=(name,x,y,w,h)=>`<image x="${x}" y="${y}" width="${w}" height="${h}" xlink:href="${png(name)}"/>`;
const arrow=(d,color='#a2f0cf')=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#arrow)"/>`;
const badge=(x,y,n)=>`<circle cx="${x}" cy="${y}" r="18" fill="#a2f0cf"/>${text(x-5,y+6,n,17,'#14251f',650)}`;
const start=(w,h,kicker,title,subtitle)=>`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}"><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0 0L8 4L0 8" fill="none" stroke="#a2f0cf" stroke-width="1.5"/></marker></defs><rect width="${w}" height="${h}" rx="22" fill="#10131a"/><g font-family="Segoe UI,Arial,sans-serif">${text(48,46,'CYPHER '+version+'  /  '+kicker,13,'#a2f0cf',600)}${text(48,106,title,43,'#f3f5fa',650)}${text(50,146,subtitle,20,'#a2adbd')}`;
const finish=(h,caption)=>text(50,h-24,caption,13,'#8d98a9')+'</g></svg>';
const write=(name,svg)=>{fs.writeFileSync(path.join(out,name+'.svg'),svg);fs.writeFileSync(path.join(out,name+'.png'),new Resvg(svg,{font:{loadSystemFonts:true}}).render().asPng());};
const staged='Staged Windows 10 desktop · actual Cypher panel/native indicator · demonstration readings';
const geometry=JSON.parse(fs.readFileSync('.local-builds/windows-showcase/geometry.json','utf8'));
const minimize=JSON.parse(fs.readFileSync('.local-builds/capture-geometry/widget.png.json','utf8')).controls.minimize;

// Full Windows context: the clock and indicator stay visible at the bottom right.
for(const fr of [false,true]){
 let svg=start(1696,1310,fr?'WINDOWS 10 · GUIDE VISUEL':'WINDOWS 10 · DESKTOP CONTEXT',fr?'Vos quotas, juste à côté de l’horloge.':'Your quotas, right beside the clock.',fr?'Ouvrez le panneau pour les détails. Gardez l’indicateur en bas pour travailler.':'Open the panel for details. Keep the indicator below while you work.');
 svg+=picture(fr?'windows-scene-fr.png':'windows-scene-open.png',48,178,1600,1000);
 const ix=48+geometry.indicator.x,iy=178+geometry.indicator.y;
 svg+=`<rect x="${ix-5}" y="${iy-5}" width="162" height="50" rx="7" fill="none" stroke="#a2f0cf" stroke-width="3"/>`;
 svg+=rect(86,210,700,112,'#132337',12,'#6685a0')+badge(116,246,'1')+text(148,251,fr?'Le panneau Cypher':'The Cypher panel',23,'#fff',600)+text(148,286,fr?'Vos comptes, quotas et temps de réinitialisation.':'Accounts, remaining quotas and reset countdowns.',18,'#ced9e8');
 svg+=badge(75,1220,'2')+text(105,1227,fr?'Réduisez la fenêtre : les quotas restent près de l’horloge.':'Minimize the window: quotas stay beside the clock.',23,'#e9edf4',600);
 svg+=arrow(`M1140 1220 H1390 V${iy+47}`);
 svg+=finish(1310,fr?'Bureau Windows 10 de démonstration · véritable interface et rendu natif Cypher · valeurs fictives':staged);
 write(fr?'windows-location-fr':'windows-location',svg);
}

// Window hidden, bar still present: a separate everyday-use scene.
let svg=start(1696,1310,'WINDOWS 10 · BACKGROUND MODE','Window hidden. Quotas still visible.','Use Minimize to taskbar to keep readings available while you work.');
svg+=picture('windows-scene-background.png',48,178,1600,1000);
svg+=`<rect x="1311" y="1129" width="162" height="50" rx="7" fill="none" stroke="#a2f0cf" stroke-width="3"/>`;
svg+=badge(78,1222,'1')+text(110,1229,'Click this indicator to reopen Cypher.',24,'#e9edf4',600)+arrow('M1000 1220 H1390 V1180');
svg+=finish(1310,staged);write('windows-background',svg);

// Readable clock-area zoom and an exact callout to the real minimize button.
svg=start(1500,900,'WINDOWS 10 · TWO QUOTA WINDOWS','Two rows. Two useful limits.','The short/session limit is above. The weekly limit is below.');
svg+=rect(48,202,1404,284,'#121820',16);
svg+=`<defs><clipPath id="clockCrop"><rect x="80" y="236" width="1320" height="224" rx="8"/></clipPath></defs><g clip-path="url(#clockCrop)"><image x="${80-1128*2.8}" y="${236-920*2.8}" width="4480" height="2800" xlink:href="${png('windows-scene-background.png')}"/></g>`;
svg+=rect(48,535,437,234)+badge(80,575,'1')+text(112,583,'5h · session',25,'#f3f5fa',600)+text(76,630,'Remaining quota in the short window.',19,'#aab5c5')+text(76,667,'75% and 48% in this example.',19,'#aab5c5');
svg+=rect(531,535,437,234)+badge(563,575,'2')+text(595,583,'7d · week',25,'#f3f5fa',600)+text(559,630,'Remaining quota in the weekly window.',19,'#aab5c5')+text(559,667,'62% and 37% in this example.',19,'#aab5c5');
svg+=rect(1014,535,438,234)+badge(1046,575,'3')+text(1078,583,'Beside the clock',25,'#f3f5fa',600)+text(1042,630,'A logo identifies each service.',19,'#aab5c5')+text(1042,667,'Click to reopen the full panel.',19,'#aab5c5');
svg+=text(50,823,'Percentages show what remains. Missing readings stay —. Actual window durations depend on the provider.',18,'#aab5c5');
svg+=finish(900,'Enlarged crop of the staged Windows scene · actual native Cypher renderer · demonstration values');write('read-the-bar',svg);

// Three actual UI steps, no invented login form or hidden CLI prerequisite.
svg=start(1360,960,'GET CONNECTED','Connect once. Keep an eye on your quotas.','Codex browser sign-in is included. Choose the account you want to show.');
const steps=[['services-picker.png','Choose your service','Open Accounts and select Codex.'],['connect-codex.png','Sign in in your browser','Use the recommended sign-in button.'],['accounts-connected.png','Choose what appears','Keep the account visible in your quotas.']];
steps.forEach(([file,title,caption],i)=>{const x=48+i*444;svg+=badge(x+18,198,String(i+1))+text(x+47,204,title,22,'#edf2fa',600)+picture(file,x+24,230,370,606)+text(x+10,880,caption,17,'#aab5c5')});
svg+=finish(960,'Actual Cypher renderer · demonstration accounts · no provider login performed for these images');write('connect-guide',svg);

function compare(name,kicker,title,subtitle,left,right,labels,caption){let s=start(1120,1000,kicker,title,subtitle);[left,right].forEach((file,i)=>{const x=84+i*520;s+=text(x,196,labels[i],19,'#a2f0cf',600)+picture(file,x,220,430,704)});s+=finish(1000,caption);write(name,s)}
compare('appearance','APPEARANCE','A clear view, day or night.','Choose light, dark or follow your system in Settings.','widget.png','quotas-dark.png',['LIGHT','DARK'],'Actual Cypher renderer · same demonstration accounts and readings in both themes');
compare('existing-accounts','YOUR EXISTING SIGN-IN','Use the account already on your computer.','Grant read access, then choose whether the account appears in your quotas.','existing-permission.png','accounts-connected.png',['ALLOW A READ','CHOOSE WHAT TO SHOW'],'Actual Cypher renderer · isolated demonstration profiles · no credentials shown');
compare('startup-and-updates','EVERYDAY SETTINGS','Start quietly. Update with your approval.','Optional startup opens Cypher in the bar without showing its window.','startup-enabled.png','updates.png',['OPTIONAL STARTUP','UPDATE CONTROLS'],'Actual Cypher renderer · demonstration settings · Windows automatic installation requires approval');
compare('navigate-and-details','FIND WHAT YOU NEED','Fewer clicks to the right reading.','Filter a service on the left. Expand a reading when you want its source.','service-filter.png','quota-details.png',['FILTER A SERVICE','OPEN READING DETAILS'],'Actual Cypher renderer · demonstration accounts and values');

// Use actual screenshot geometry for the minimize callout.
svg=start(1120,1020,'WINDOW CONTROLS','Keep Cypher in the bar.','The labelled control at the bottom minimizes the window.');
svg+=picture('widget.png',70,202,430,704);
const bx=70+minimize.x,by=202+minimize.y;
svg+=`<rect x="${bx-3}" y="${by-3}" width="${minimize.width+6}" height="${minimize.height+6}" rx="9" fill="none" stroke="#a2f0cf" stroke-width="3"/>`;
svg+=badge(574,310,'1')+text(608,318,'Minimize to taskbar',25,'#edf2fa',600)+text(574,362,'Hide the window and keep collecting.',19,'#aab5c5')+arrow(`M573 389 H540 V${by+minimize.height/2} H${bx+minimize.width+10}`);
svg+=badge(574,535,'2')+text(608,543,'Reopen beside the clock',25,'#edf2fa',600)+text(574,587,'Click the native indicator to return.',19,'#aab5c5');
svg+=picture('showcase-native-strip.png',589,633,304,80)+text(574,765,'Closing the window offers Minimize, Quit',18,'#aab5c5')+text(574,797,'or Cancel. Optional startup stays separate.',18,'#aab5c5');
svg+=finish(1020,'Actual Cypher panel and native indicator · demonstration readings · enlarged indicator example');write('minimize-guide',svg);

// Windows 11 deliberately has a different layout; never show a Windows 10 strip as Windows 11.
svg=start(1500,760,'WINDOWS 11 · LAYOUT PREVIEW','Numbers in the notification area.','Up to three compact two-row account icons near the clock.');
svg+=rect(48,213,1404,190,'#20232b',14,'#414653');
svg+=text(82,269,'WINDOWS 11 TASKBAR',13,'#a8b1c1',600);
for(let i=0;i<4;i++)svg+=`<rect x="${530+(i%2)*12}" y="${310+Math.floor(i/2)*12}" width="10" height="10" fill="#72b7ff"/>`;
svg+=`<path d="M1070 333l7-7 7 7" stroke="#c1c9d5" fill="none" stroke-width="2"/>`+picture('showcase-windows-tray-1.png',1120,310,44,44)+picture('showcase-windows-tray-2.png',1184,310,44,44);
svg+=text(1320,325,'12:00',19,'#e9edf4')+text(1284,353,'27/10/2026',16,'#b3bdcd');
svg+=`<rect x="1106" y="296" width="136" height="72" rx="9" fill="none" stroke="#a2f0cf" stroke-width="3"/>`;
svg+=badge(78,485,'1')+text(110,493,'Top: session. Bottom: week.',26,'#edf2fa',600)+badge(78,568,'2')+text(110,576,'Hover for the service name and actual durations.',24,'#edf2fa',600);
svg+=text(50,665,'Windows controls icon order and may put them under hidden icons. The native menu remains available.',19,'#aab5c5');
svg+=finish(760,'Windows 11 staged layout preview · actual native numeric icons · demonstration values · no embedded Windows 11 strip');write('windows11-notification-guide',svg);

// Mac is explicitly a layout preview, with the actual native compositor output.
svg=start(1500,900,'MAC · LAYOUT PREVIEW','On Mac, look at the top right.','The same two quota rows fit into one compact menu bar image.');
svg+=rect(48,204,1404,602,'#1b2b3b',15,'#3a4b60')+rect(49,205,1402,40,'#18202b',0,'#18202b');
svg+=text(70,231,'Finder    File    Edit    View    Window    Help',15,'#e2e8f2')+picture('showcase-macos-indicator.png',1100,214,112,22)+text(1268,231,'Tue 12:00',15,'#e2e8f2');
svg+=`<rect x="1089" y="207" width="134" height="35" rx="6" fill="none" stroke="#a2f0cf" stroke-width="2"/>`;
svg+=picture('macos-panel-dark.png',929,263,320,524);
svg+=badge(98,400,'1')+text(130,408,'Quotas stay in the top menu bar.',26,'#edf2fa',600)+text(98,456,'Session above. Week below. Remaining percentages.',19,'#aab5c5');
svg+=badge(98,558,'2')+text(130,566,'Open the menu to show or hide Cypher.',25,'#edf2fa',600)+text(98,614,'Cypher stays out of the running-app Dock.',19,'#aab5c5');
svg+=finish(900,'Mac layout preview · actual Cypher panel/native compositor · demonstration accounts · no physical Mac desktop capture');write('macos-location',svg);

const guides=fs.readdirSync(out).filter(name=>name.endsWith('.png')).map(name=>({file:name,bytes:fs.statSync(path.join(out,name)).size}));
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify({version,rendererCaptureCount:25,windowsContext:'native WinForms staged desktop; no Explorer attachment or user desktop capture',guides},null,2)+'\n');
console.log('Generated '+guides.length+' annotated guides with current renderer/native captures.');
