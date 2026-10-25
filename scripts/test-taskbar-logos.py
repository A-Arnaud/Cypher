"""Compare actual native taskbar icon pixels against bundled provider artwork."""
import ctypes as c,json,os,pathlib,queue,subprocess,sys,threading,time
from ctypes import wintypes as w
from PIL import Image,ImageGrab,ImageChops,ImageStat
root=pathlib.Path(__file__).resolve().parent.parent
exe=pathlib.Path(sys.argv[1]).resolve() if len(sys.argv)>1 else root/'dist/native/Cypher.Taskbar.exe'
logos=exe.parent/'logos'
for provider in ['codex','claude','gemini']:
 assert (logos/(provider+'.png')).is_file(),f'bundled logo missing: {provider}'
p=subprocess.Popen([str(exe)],stdin=subprocess.PIPE,stdout=subprocess.PIPE,text=True,encoding='utf-8')
assert p.stdin is not None and p.stdout is not None
q=queue.Queue()
def reader():
 for line in p.stdout:q.put(json.loads(line.lstrip('\ufeff')))
threading.Thread(target=reader,daemon=True).start()
u=c.WinDLL('user32');u.GetWindowRect.argtypes=[w.HWND,c.POINTER(w.RECT)]
g=c.WinDLL('gdi32');u.GetDC.argtypes=[w.HWND];u.GetDC.restype=w.HDC;u.ReleaseDC.argtypes=[w.HWND,w.HDC];u.PrintWindow.argtypes=[w.HWND,w.HDC,w.UINT]
for name,args,restype in [('CreateCompatibleDC',[w.HDC],w.HDC),('CreateCompatibleBitmap',[w.HDC,c.c_int,c.c_int],w.HBITMAP),('SelectObject',[w.HDC,w.HANDLE],w.HANDLE),('DeleteObject',[w.HANDLE],w.BOOL),('DeleteDC',[w.HDC],w.BOOL)]:
 f=getattr(g,name);f.argtypes=args;f.restype=restype
def capture_window(hwnd,width,height):
 # WM_PRINT paints the real WinForms surface even while Windows auto-hides its parent.
 dc=u.GetDC(hwnd);memory=g.CreateCompatibleDC(dc);bitmap=g.CreateCompatibleBitmap(dc,width,height);old=g.SelectObject(memory,bitmap)
 try:
  assert u.PrintWindow(hwnd,memory,2),'native PrintWindow failed'
  header=c.create_string_buffer(40);import struct
  header.raw=struct.pack('<IiiHHIIiiII',40,width,-height,1,32,0,width*height*4,0,0,0,0)
  pixels=c.create_string_buffer(width*height*4);g.GetDIBits.argtypes=[w.HDC,w.HBITMAP,w.UINT,w.UINT,c.c_void_p,c.c_void_p,w.UINT]
  assert g.GetDIBits(memory,bitmap,0,height,pixels,header,0)==height
  return Image.frombytes('RGB',(width,height),pixels.raw,'raw','BGRX')
 finally:g.SelectObject(memory,old);g.DeleteObject(bitmap);g.DeleteDC(memory);u.ReleaseDC(hwnd,dc)
checks=[]
try:
 ready=q.get(timeout=10);assert ready['type']=='ready',ready
 box=w.RECT();assert u.GetWindowRect(ready['hwnd'],c.byref(box));scale=ready['dpi']/96;size=round(16*scale);padding=round(4*scale);y=round((box.bottom-box.top-size)/2)
 for provider in ['codex','claude','gemini']:
  p.stdin.write(json.dumps({'type':'render','items':[{'id':provider,'providerId':provider,'label':'SYNTHETIC '+provider,'text':'75%','stale':False}],'extraCount':0,'language':'fr'})+'\n');p.stdin.flush();time.sleep(.35)
  surface=capture_window(ready['hwnd'],box.right-box.left,box.bottom-box.top);actual=surface.crop((padding,y,padding+size,y+size))
  reference=Image.open(logos/(provider+'.png')).convert('RGBA').resize((size,size),Image.Resampling.LANCZOS)
  expected=Image.new('RGBA',(size,size),(30,30,30,255));expected.alpha_composite(reference)
  error=sum(ImageStat.Stat(ImageChops.difference(actual,expected.convert('RGB'))).mean)/3
  if error>=22:
   folder=pathlib.Path(os.environ['LOCALAPPDATA'])/'hermes/cache/scratch';actual.save(folder/'cypher-logo-actual.png');expected.save(folder/'cypher-logo-expected.png');surface.save(folder/'cypher-logo-diagnostic.png')
  assert error<22,(provider,'native pixels do not show the actual logo',error)
  checks.append({'provider':provider,'meanPixelError':round(error,2)})
 p.stdin.write(json.dumps({'type':'render','items':[{'id':s,'providerId':s,'label':'SYNTHETIC '+s,'text':v,'stale':False} for s,v in [('codex','75%'),('claude','24%'),('gemini','—')]],'extraCount':2,'language':'fr'})+'\n');p.stdin.flush();time.sleep(.35)
 capture=pathlib.Path(os.environ['LOCALAPPDATA'])/'hermes/cache/scratch/cypher-taskbar-logos.png';surface=capture_window(ready['hwnd'],box.right-box.left,box.bottom-box.top);surface.save(capture)
 print(json.dumps({'passed':True,'checks':checks,'screenshot':str(capture),'syntheticQuotas':True},indent=2))
finally:
 if p.poll() is None:p.stdin.write('{"type":"quit"}\n');p.stdin.flush();p.wait(timeout=5)
