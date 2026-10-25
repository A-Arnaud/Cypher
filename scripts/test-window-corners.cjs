const {_electron:electron}=require('playwright');const fs=require('node:fs/promises');const path=require('node:path');const os=require('node:os');const {execFileSync}=require('node:child_process');const assert=require('node:assert/strict');
const probe=String.raw`
Add-Type @'
using System;using System.Runtime.InteropServices;
public class Corners {
 [DllImport("gdi32.dll")] public static extern IntPtr CreateRectRgn(int l,int t,int r,int b);
 [DllImport("gdi32.dll")] public static extern bool PtInRegion(IntPtr r,int x,int y);
 [DllImport("gdi32.dll")] public static extern bool DeleteObject(IntPtr r);
 [DllImport("user32.dll")] public static extern int GetWindowRgn(IntPtr h,IntPtr r);
 [DllImport("user32.dll")] public static extern bool GetClientRect(IntPtr h,out Rect r);
 public struct Rect{public int L,T,R,B;}
}
'@
$h=[IntPtr]::new([Int64]::Parse($env:CYPHER_CORNER_HWND));$r=[Corners]::CreateRectRgn(0,0,0,0);$box=New-Object Corners+Rect
[Corners]::GetClientRect($h,[ref]$box)|Out-Null
$kind=[Corners]::GetWindowRgn($h,$r);$w=$box.R;$height=$box.B;$scale=$w/[double]$env:CYPHER_CORNER_WIDTH
$points=@(@(0,0),@(($w-1),0),@(0,($height-1)),@(($w-1),($height-1)))
$outside=@($points|ForEach-Object { -not [Corners]::PtInRegion($r,$_[0],$_[1]) })
$inside=[Corners]::PtInRegion($r,[int]($w/2),[int]($height/2));$edge=[Corners]::PtInRegion($r,[int]($w/2),0)
$curve=[Corners]::PtInRegion($r,[int](4*$scale),[int](10*$scale))
[Corners]::DeleteObject($r)|Out-Null
@{kind=$kind;cornersOutside=$outside;centerInside=$inside;edgeInside=$edge;curveInside=$curve}|ConvertTo-Json -Compress
`;
(async()=>{const root=await fs.mkdtemp(path.join(os.tmpdir(),'cypher-corners-'));const home=path.join(root,'home'),roaming=path.join(home,'AppData','Roaming'),local=path.join(home,'AppData','Local');await fs.mkdir(roaming,{recursive:true});await fs.mkdir(local,{recursive:true});const env={...process.env,USERPROFILE:home,HOME:home,APPDATA:roaming,LOCALAPPDATA:local,QG_DATA_DIR:path.join(root,'data'),PATH:path.join(process.env.SystemRoot,'System32')};for(const k of ['ELECTRON_RUN_AS_NODE','CODEX_HOME','CLAUDE_CONFIG_DIR','GEMINI_CLI_HOME','CYPHER_DATA_DIR'])delete env[k];
const app=await electron.launch({executablePath:path.resolve('.local-builds/electron-test/win-unpacked/Cypher.exe'),env});
try{const page=await app.firstWindow();await page.locator('.cards').waitFor();
 async function check(summary){
  const info=await app.evaluate(({BrowserWindow})=>{const w=BrowserWindow.getAllWindows()[0];return {handle:w.getNativeWindowHandle().readBigUInt64LE().toString(),width:w.getSize()[0]}});
  const shape=JSON.parse(execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',probe],{encoding:'utf8',windowsHide:true,env:{...process.env,CYPHER_CORNER_HWND:info.handle,CYPHER_CORNER_WIDTH:String(info.width)}}));
  assert.equal(shape.kind,3,'native outline must be a rounded region');assert(shape.cornersOutside.every(Boolean));assert(shape.centerInside&&shape.edgeInside);assert.equal(shape.curveInside,summary,'native outline must follow the active CSS radius');
  const png=await page.screenshot({omitBackground:true,path:path.join(root,summary?'summary.png':'details.png')});
  const alpha=await app.evaluate(({nativeImage},bytes)=>{const img=nativeImage.createFromBuffer(Buffer.from(bytes)),{width,height}=img.getSize(),b=img.toBitmap();return {corners:[0,width-1,(height-1)*width,height*width-1].map(i=>b[i*4+3]),interior:b[(Math.floor(height/2)*width+Math.floor(width/2))*4+3]}},Array.from(png));assert(alpha.corners.every(a=>a===0),'renderer corners must be transparent');assert.equal(alpha.interior,255,'interior remains fully opaque');
 }
 await check(false);await page.getByRole('button',{name:'Back to widget',exact:true}).click();await page.locator('.summary-shell').waitFor();await check(true);await page.evaluate(()=>window.quota.updateSettings({opacity:65}));await check(true);await page.getByRole('button',{name:'Details',exact:true}).click();await page.locator('.cards').waitFor();await check(false);console.log(JSON.stringify({passed:true,checks:['native corners excluded from drawing and hit testing','26px details and 18px summary radii','transparent corner pixels and opaque interior','outline follows view and opacity changes'],root},null,2));
}finally{await app.close()}})().catch(e=>{console.error(e);process.exitCode=1});
