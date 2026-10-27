// Actual renderer/native-painter examples composed for the README. Synthetic data only.
const fs=require('node:fs'),{Resvg}=require('@resvg/resvg-js'),{version}=require('../package.json');
const png=file=>'data:image/png;base64,'+fs.readFileSync(file).toString('base64');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1400" height="1000"><rect width="1400" height="1000" rx="24" fill="#101114"/><g font-family="Segoe UI,Arial,sans-serif">
<image x="55" y="44" width="46" height="46" xlink:href="${png('assets/icon.png')}"/><text x="119" y="75" fill="#c6cad5" font-size="17" letter-spacing="2">CYPHER ${version}</text>
<text x="55" y="156" fill="#f4f4f6" font-size="54" font-weight="600" letter-spacing="-1.5">Two limits. One glance.</text><text x="58" y="201" fill="#a5aab5" font-size="24">Session above. Week below. Know what remains.</text>
<rect x="48" y="244" width="770" height="316" rx="18" fill="#ffffff04" stroke="#ffffff12"/>
<text x="76" y="285" fill="#a5aab5" font-size="13" letter-spacing="2">WINDOWS 10 TASKBAR</text><text x="76" y="326" fill="#f4f4f6" font-size="28" font-weight="600">A logo. Two readings. Less space.</text>
<image x="100" y="369" width="608" height="160" xlink:href="${png('docs/screenshots/native-windows-taskbar.png')}"/>
<rect x="48" y="582" width="770" height="330" rx="18" fill="#ffffff04" stroke="#ffffff12"/>
<text x="76" y="627" fill="#a5aab5" font-size="13" letter-spacing="2">MAC MENU BAR</text><text x="76" y="672" fill="#f4f4f6" font-size="28" font-weight="600">Keep both windows at the top.</text>
<image x="100" y="720" width="448" height="88" xlink:href="${png('docs/screenshots/native-mac-menu-bar.png')}"/>
<text x="76" y="867" fill="#9a9faa" font-size="18">Windows 11 uses small two-row notification icons.</text>
<image x="867" y="244" width="418" height="684" xlink:href="${png('docs/screenshots/widget.png')}"/>
<text x="56" y="964" fill="#7c8290" font-size="14">Native painter/compositor and actual panel - demonstration readings - enlarged bar examples - Mac layout preview</text></g></svg>`;
fs.mkdirSync('docs/brand',{recursive:true});fs.writeFileSync('docs/brand/whats-new.svg',svg);fs.writeFileSync('docs/brand/whats-new.png',new Resvg(svg,{font:{loadSystemFonts:true}}).render().asPng());console.log('Generated dual-quota presentation from actual native/renderer examples.');
