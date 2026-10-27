// Isolated native bitmap/Tray checks. No main entry point, Explorer attachment, accounts or registry.
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawnSync}=require('node:child_process'),assert=require('node:assert/strict'),{buildSync}=require('esbuild');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'cypher-indicator-')),out=path.resolve('.local-builds/indicator-validation');fs.mkdirSync(out,{recursive:true});
try{
 const entry=path.join(root,'native.cjs');
 buildSync({stdin:{resolveDir:process.cwd(),sourcefile:'indicator-native.ts',loader:'ts',contents:`
 import {app,Tray,Menu,nativeImage} from 'electron';import fs from 'node:fs';import assert from 'node:assert/strict';
 import {indicatorImage,indicatorRows} from './src/main/indicator-image';import {NativeIndicators} from './src/main/native-indicators';
 app.setPath('userData',${JSON.stringify(path.join(root,'profile'))});app.disableHardwareAcceleration();
 app.whenReady().then(()=>{let base,host;try{
 const item={providerId:'codex',text:'0%',stale:false,quotas:[{label:'5h',text:'0%'},{label:'7d',text:'62%'}]};
 const mac=indicatorImage([item,{...item,stale:true,quotas:[{label:'5h',text:'75%'},{label:'7d',text:'37%'}]}],true);
 assert.deepEqual(mac.getSize(),{width:112,height:22});assert(!mac.isEmpty());fs.writeFileSync(${JSON.stringify(path.join(out,'mac-menu-bar.png'))},mac.toPNG());
 const weekly={...item,quotas:[{label:'7d',text:'24%'}]};assert.equal(indicatorRows(weekly)[0],undefined);assert.equal(indicatorRows(weekly)[1].text,'24%');
 const windows=indicatorImage([item],false);assert.deepEqual(windows.getSize(),{width:22,height:22});fs.writeFileSync(${JSON.stringify(path.join(out,'windows-notification.png'))},windows.toPNG());
 const pixels=windows.toBitmap();assert(pixels.some(n=>n!==0));
 const original=nativeImage.createFromPath(${JSON.stringify(path.resolve('assets/icon.png'))}).resize({width:20,height:20});base=new Tray(original);host=new NativeIndicators(base,original,false,true,()=>{});const menu=Menu.buildFromTemplate([{label:'Fixture only'}]);
 const presentation={tooltip:'Fixture',lines:['Codex 0 / 62','Codex 75 / 37','Codex 75 / 37'],items:[item,item,item]};
 host.render(presentation,menu);assert.equal(host.extra.length,2);const extra=[...host.extra];assert(extra.every(t=>!t.isDestroyed()));host.render(undefined,menu);assert(extra.every(t=>t.isDestroyed()));assert.equal(host.extra.length,0);host.render(presentation,menu);host.destroy();assert.equal(host.extra.length,0);
 console.log(JSON.stringify({passed:true,checks:['two quota rows including real zero','weekly-only does not move into the short-window row','compact macOS variable-width image','Windows numeric tray images','additional native Tray lifecycle and cleanup'],platform:process.platform}));
 }finally{host?.destroy();base?.destroy()}app.exit(0)}).catch(e=>{console.error(e);app.exit(1)});
 `},bundle:true,platform:'node',format:'cjs',external:['electron'],define:{__dirname:JSON.stringify(path.resolve('dist/main'))},outfile:entry});
 const env={...process.env};delete env.ELECTRON_RUN_AS_NODE;delete env.NODE_OPTIONS;
 const run=spawnSync(require('electron'),[entry],{env,stdio:'inherit',windowsHide:true,timeout:30000});assert.equal(run.status,0,'native indicator compositor/tray checks');
 if(process.platform==='win32'){
  const source=path.join(root,'Paint.cs'),exe=path.join(root,'Paint.exe');
  fs.writeFileSync(source,`using System;using System.Drawing;using System.Reflection;using System.Windows.Forms;class PaintTest{[STAThread]static int Main(){using(var form=new Surface(IntPtr.Zero)){form.ClientSize=new Size(152,40);var json="${JSON.stringify({language:'en',items:[{providerId:'codex',text:'0%',label:'Codex demo',stale:false,quotas:[{label:'5h',text:'0%'},{label:'7d',text:'62%'}]},{providerId:'codex',text:'37%',label:'Codex demo',stale:true,quotas:[{label:'5h',text:'75%'},{label:'7d',text:'37%'}]}],extraCount:0}).replace(/"/g,'\\"')}";typeof(Surface).GetMethod("Render",BindingFlags.Instance|BindingFlags.NonPublic).Invoke(form,new object[]{Program.Json.Deserialize<System.Collections.Generic.Dictionary<string,object>>(json)});var width=(int)typeof(Surface).GetMethod("ReservedWidth",BindingFlags.Instance|BindingFlags.NonPublic).Invoke(form,new object[]{(uint)96});if(width!=152)return 2;using(var image=new Bitmap(152,40)){form.DrawToBitmap(image,new Rectangle(0,0,152,40));image.Save(@"${path.join(out,'windows-taskbar.png').replace(/"/g,'""')}");}Console.WriteLine("Native Windows paint: 2 accounts / 152px, two quota rows, stale mark; no shell attachment");}return 0;}}`);
  const compiler=path.join(process.env.WINDIR,'Microsoft.NET/Framework64/v4.0.30319/csc.exe');
  const result=spawnSync(compiler,['/nologo','/target:exe','/main:PaintTest','/out:'+exe,'/r:System.Windows.Forms.dll','/r:System.Drawing.dll','/r:System.Web.Extensions.dll','/resource:'+path.resolve('assets/icon.png')+',Cypher.Logos.default.png','/resource:'+path.resolve('dist/assets/indicator/codex.png')+',Cypher.Logos.codex.png',path.resolve('native/taskbar/Program.cs'),source],{stdio:'inherit',windowsHide:true});assert.equal(result.status,0,'compile native painter');assert.equal(spawnSync(exe,[],{stdio:'inherit',windowsHide:true,timeout:10000}).status,0,'native painter');
 }
}finally{assert(path.resolve(root).startsWith(path.resolve(os.tmpdir())+path.sep)&&path.basename(root).startsWith('cypher-indicator-'));fs.rmSync(root,{recursive:true,force:true})}
