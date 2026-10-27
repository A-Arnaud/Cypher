// Original, code-native Cypher artwork; no external brand assets or account data.
const fs=require('node:fs');const {Resvg}=require('@resvg/resvg-js');
const out='docs/brand';fs.mkdirSync(out,{recursive:true});
const png=name=>'data:image/png;base64,'+fs.readFileSync(name).toString('base64');
const icon=png('assets/icon.png');
const details=png('docs/screenshots/widget.png');
const widget=png('docs/screenshots/widget-windows.png');
const head=(w,h)=>`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><radialGradient id="glow"><stop stop-color="#c35b80" stop-opacity=".22"/><stop offset="1" stop-color="#0b0c10" stop-opacity="0"/></radialGradient><linearGradient id="edge" x2="1" y2="1"><stop stop-color="#ed93af" stop-opacity=".5"/><stop offset="1" stop-color="#727c92" stop-opacity=".1"/></linearGradient><pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse"><path d="M44 0H0V44" fill="none" stroke="#ffffff" stroke-opacity=".035"/></pattern><filter id="shadow" x="-30%" y="-30%" width="170%" height="180%"><feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#000" flood-opacity=".5"/></filter></defs><rect width="100%" height="100%" rx="24" fill="#0b0c10"/><rect width="100%" height="100%" rx="24" fill="url(#grid)"/><ellipse cx="${w*.82}" cy="${h*.35}" rx="${w*.6}" ry="${h*.8}" fill="url(#glow)"/><rect x="1" y="1" width="${w-2}" height="${h-2}" rx="23" fill="none" stroke="url(#edge)"/><g font-family="Segoe UI,Arial,sans-serif">`;
const write=(name,svg)=>{fs.writeFileSync(`${out}/${name}.svg`,svg);fs.writeFileSync(`${out}/${name}.png`,new Resvg(svg,{font:{loadSystemFonts:true}}).render().asPng())};
write('wordmark',`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="400" height="112" viewBox="0 0 400 112" role="img" aria-label="Cypher"><image x="0" y="6" width="100" height="100" xlink:href="${icon}"/><text x="122" y="79" font-family="Segoe UI,Arial,sans-serif" font-size="66" font-weight="600" letter-spacing="-3" fill="#d47294">Cypher</text></svg>`);
write('website',head(720,160)+`
 <image x="26" y="30" width="100" height="100" xlink:href="${icon}"/>
 <text x="153" y="71" fill="#f4f2f5" font-size="31" font-weight="600" letter-spacing="-1">Visit Cypher</text>
 <text x="154" y="109" fill="#ed93af" font-size="23">cypher-os.me</text>
 <circle cx="651" cy="80" r="29" fill="#ed93af" fill-opacity=".12" stroke="#ed93af" stroke-opacity=".35"/>
 <path d="M641 90l20-20m-17 0h17v17" fill="none" stroke="#ed93af" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
 </g></svg>`);
write('hero',head(1600,720)+`
 <image x="80" y="66" width="64" height="64" xlink:href="${icon}"/>
 <text x="163" y="110" fill="#faf7fa" font-size="39" font-weight="600" letter-spacing="-1">Cypher</text>
 <rect x="80" y="184" width="328" height="34" rx="17" fill="#ed93af" fill-opacity=".09" stroke="#ed93af" stroke-opacity=".2"/>
 <circle cx="100" cy="201" r="4" fill="#a9d7bd"/><text x="116" y="207" font-size="13" fill="#edb4c8" letter-spacing="2">WINDOWS + MAC · LOCAL FIRST</text>
 <text x="76" y="316" fill="#f4f2f5" font-size="82" font-weight="600" letter-spacing="-4">Your AI usage.</text>
 <text x="76" y="410" fill="#ed93af" font-size="82" font-weight="600" letter-spacing="-4">Always in view.</text>
 <text x="81" y="477" fill="#a7a6b1" font-size="25">In the bar, from the first launch.</text>
 <text x="81" y="515" fill="#a7a6b1" font-size="25">Quotas, profiles and quick actions.</text>
 <rect x="80" y="567" width="280" height="48" rx="13" fill="#ed93af"/>
 <text x="108" y="598" fill="#24151c" font-size="18" font-weight="600">Windows &amp; Mac downloads</text>
 <text x="80" y="671" fill="#666673" font-size="13">Windows + macOS · synthetic example values</text>
 <g filter="url(#shadow)"><image x="1125" y="75" width="354" height="580" xlink:href="${details}"/><image x="830" y="320" width="445" height="349" xlink:href="${widget}"/></g>
 </g></svg>`);
write('card-widget',head(600,470)+`
 <text x="38" y="57" fill="#ed93af" font-size="12" letter-spacing="3">01 / YOUR DESKTOP</text>
 <text x="36" y="110" fill="#f1eff4" font-size="35" font-weight="600" letter-spacing="-1">Small window. Clear view.</text>
 <text x="38" y="147" fill="#9594a2" font-size="19">Keep the essentials close.</text>
 <image x="79" y="182" width="442" height="274" preserveAspectRatio="xMidYMin slice" xlink:href="${widget}"/>
 </g></svg>`);
write('card-taskbar',head(600,470)+`
 <text x="38" y="57" fill="#ed93af" font-size="12" letter-spacing="3">02 / YOUR TASKBAR</text>
 <text x="36" y="110" fill="#f1eff4" font-size="35" font-weight="600" letter-spacing="-1">There when you need it.</text>
 <text x="38" y="147" fill="#9594a2" font-size="19">A glance. Then back to your work.</text>
 <rect x="40" y="205" width="520" height="210" rx="14" fill="#12131a" stroke="#353540"/>
 <path d="M40 363h520" stroke="#353540"/>
 <rect x="62" y="230" width="130" height="9" rx="4" fill="#272832"/><rect x="62" y="251" width="233" height="7" rx="3" fill="#22232b"/>
 <rect x="62" y="268" width="192" height="7" rx="3" fill="#22232b"/>
 <rect x="58" y="378" width="22" height="22" rx="4" fill="#58586b"/><rect x="90" y="378" width="22" height="22" rx="4" fill="#3e4052"/><rect x="122" y="378" width="22" height="22" rx="4" fill="#3e4052"/>
 <rect x="267" y="370" width="203" height="38" rx="9" fill="#ed93af" fill-opacity=".08" stroke="#ed93af" stroke-opacity=".4"/>
 <circle cx="285" cy="389" r="5" fill="#a9d7bd"/><text x="297" y="395" fill="#e4e3e9" font-size="15">75%</text><circle cx="354" cy="389" r="5" fill="#ed93af"/><text x="366" y="395" fill="#e4e3e9" font-size="15">24%</text><text x="425" y="395" fill="#92929f" font-size="15">+2</text>
 <text x="493" y="395" fill="#9999a7" font-size="13">12:00</text>
 <text x="40" y="445" fill="#626270" font-size="11">Illustrated taskbar · synthetic values · Windows 10</text>
 </g></svg>`);
write('card-connections',head(600,470)+`
 <text x="38" y="57" fill="#ed93af" font-size="12" letter-spacing="3">03 / YOUR CONNECTIONS</text>
 <text x="36" y="110" fill="#f1eff4" font-size="35" font-weight="600" letter-spacing="-1">Your tools. Your choice.</text>
 <text x="38" y="147" fill="#9594a2" font-size="19">Connect only what you want to read.</text>
 <circle cx="300" cy="306" r="94" fill="none" stroke="#ed93af" stroke-opacity=".12"/>
 <path d="M166 252L272 292M434 252L328 292M300 336v49" stroke="#656573" stroke-width="2"/>
 <rect x="94" y="219" width="137" height="60" rx="15" fill="#191a22" stroke="#3a3a47"/><text x="125" y="256" fill="#dddce4" font-size="18">CLI profiles</text>
 <rect x="369" y="219" width="137" height="60" rx="15" fill="#191a22" stroke="#3a3a47"/><text x="401" y="256" fill="#dddce4" font-size="18">API keys</text>
 <image x="266" y="275" width="68" height="68" xlink:href="${icon}"/>
 <rect x="228" y="378" width="144" height="54" rx="15" fill="#191a22" stroke="#3a3a47"/><text x="250" y="411" fill="#dddce4" font-size="18">Local models</text>
 </g></svg>`);
console.log('Generated Cypher wordmark, website card, hero and three feature cards.');
