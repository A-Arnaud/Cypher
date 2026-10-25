"""Native acceptance: fails if the child is only an overlay or steals weather space."""
import ctypes as c,json,subprocess,time,threading,queue,os,pathlib,sys
from ctypes import wintypes as w
from PIL import ImageGrab
u=c.WinDLL('user32',use_last_error=True)
for name,args,ret in [('FindWindowW',[w.LPCWSTR,w.LPCWSTR],w.HWND),('FindWindowExW',[w.HWND,w.HWND,w.LPCWSTR,w.LPCWSTR],w.HWND),('GetParent',[w.HWND],w.HWND),('GetWindowRect',[w.HWND,c.POINTER(w.RECT)],w.BOOL),('PostMessageW',[w.HWND,w.UINT,w.WPARAM,w.LPARAM],w.BOOL)]:
 f=getattr(u,name);f.argtypes=args;f.restype=ret
def rect(h):
 r=w.RECT();assert u.GetWindowRect(h,c.byref(r));return [r.left,r.top,r.right,r.bottom]
def shell():
 s=u.FindWindowW('Shell_TrayWnd',None);r=u.FindWindowExW(s,None,'ReBarWindow32',None);t=u.FindWindowExW(r,None,'MSTaskSwWClass',None);v=u.FindWindowExW(s,None,'DynamicContent2',None);n=u.FindWindowExW(s,None,'TrayNotifyWnd',None)
 return {'shell':int(s),'rebar':int(r),'tasks':int(t),'weather':int(v or 0),'notify':int(n)}
def snapshot(handles):return {k:rect(v) for k,v in handles.items() if v}
def wait_for(fn,seconds=8):
 end=time.monotonic()+seconds
 while time.monotonic()<end:
  v=fn()
  if v:return v
  time.sleep(.05)
 raise AssertionError('timed out waiting for native effect')
exe=pathlib.Path(sys.argv[1] if len(sys.argv)>1 else 'dist/native/Cypher.Taskbar.exe').resolve()
assert exe.is_file(),f'native helper missing: {exe}'
h=shell();before=snapshot(h);checks=[]
for mode in ['quit','kill','eof']:
 p=subprocess.Popen([str(exe)],stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True,encoding='utf-8')
 assert p.stdin is not None and p.stdout is not None
 q=queue.Queue()
 def read():
  for line in p.stdout:
   try:q.put(json.loads(line))
   except ValueError:q.put({'type':'invalid','line':line})
 threading.Thread(target=read,daemon=True).start()
 try:
  ready=q.get(timeout=10);assert ready['type']=='ready',ready
  hwnd=int(ready['hwnd']);assert u.GetParent(hwnd)==h['shell'];assert ready['dpiContextMatches'] is True
  during=snapshot(h);ours=rect(hwnd)
  assert during['rebar'][2]<=before['rebar'][2]-100,(before,during,ours)
  assert during['tasks'][2]<=ours[0],(during,ours)
  assert 0<ours[2]-ours[0]<=220*ready['dpi']/96+2
  for key in ['weather','notify']:
   if key in before:assert during[key]==before[key],(key,before,during)
  assert ours[2]<=min(before.get('weather',before['notify'])[0],before['notify'][0])
  p.stdin.write(json.dumps({'type':'render','language':'fr','items':[{'id':'codex','providerId':'codex','label':'TEST Codex','text':'75%','stale':False},{'id':'claude','providerId':'claude','label':'TEST Claude','text':'24%','stale':False},{'id':'gemini','providerId':'gemini','label':'TEST Gemini','text':'—','stale':False}],'extraCount':2})+'\n');p.stdin.flush()
  time.sleep(.3)
  if mode=='quit':
   folder=pathlib.Path(os.environ['LOCALAPPDATA'])/'hermes/cache/scratch';folder.mkdir(parents=True,exist_ok=True)
   ImageGrab.grab(bbox=(before['shell'][0],before['shell'][1],before['shell'][2],before['shell'][3])).save(folder/'cypher-taskbar-native.png')
  # Real native mouse message delivery, not a protocol open command.
  u.PostMessageW(hwnd,0x201,1,10|(10<<16));u.PostMessageW(hwnd,0x202,0,10|(10<<16))
  assert q.get(timeout=4)['type']=='open'
  # Force the shell to recalculate its geometry; reservation must recover.
  u.PostMessageW(h['shell'],5,0,0)
  time.sleep(.7)
  assert rect(h['tasks'])[2]<=rect(hwnd)[0]
  if mode=='quit':p.stdin.write('{"type":"quit"}\n');p.stdin.flush()
  elif mode=='eof':p.stdin.close()
  else:p.kill()
  p.wait(timeout=8)
  wait_for(lambda:rect(h['rebar'])==before['rebar'])
  assert snapshot(h)==before,(mode,before,snapshot(h))
  checks.append(mode+': embedded, reserved, click, shell relayout, restoration')
 finally:
  if p.poll() is None:p.kill();p.wait()
  u.PostMessageW(h['shell'],5,0,0)
report={'checks':checks,'before':before,'actualServerQuotaVerified':False,'pcRebootTested':False}
out=pathlib.Path(os.environ['LOCALAPPDATA'])/'hermes/cache/scratch/cypher-taskbar-native-report.json';out.write_text(json.dumps(report,indent=2))
print(json.dumps({'report':str(out),**report},indent=2))
