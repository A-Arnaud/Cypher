"""Inspect/click only the Cypher child window, without moving the user's cursor."""
import ctypes as c,json,sys,pathlib,os
from ctypes import wintypes as w
u=c.WinDLL('user32',use_last_error=True)
u.FindWindowW.argtypes=[w.LPCWSTR,w.LPCWSTR];u.FindWindowW.restype=w.HWND
u.FindWindowExW.argtypes=[w.HWND,w.HWND,w.LPCWSTR,w.LPCWSTR];u.FindWindowExW.restype=w.HWND
u.GetWindowRect.argtypes=[w.HWND,c.POINTER(w.RECT)]
u.PostMessageW.argtypes=[w.HWND,w.UINT,w.WPARAM,w.LPARAM]
s=u.FindWindowW('Shell_TrayWnd',None);h=u.FindWindowExW(s,None,None,'Cypher Taskbar')
assert h,'Cypher child taskbar window missing'
r=w.RECT();assert u.GetWindowRect(h,c.byref(r))
if len(sys.argv)>1 and sys.argv[1]=='click':
 u.PostMessageW(h,0x201,1,10|(10<<16));u.PostMessageW(h,0x202,0,10|(10<<16))
if len(sys.argv)>1 and sys.argv[1]=='kill':
 import subprocess
 pid=w.DWORD();u.GetWindowThreadProcessId.argtypes=[w.HWND,c.POINTER(w.DWORD)];u.GetWindowThreadProcessId(h,c.byref(pid));subprocess.run(['taskkill.exe','/PID',str(pid.value),'/F'],check=True,stdout=subprocess.DEVNULL,creationflags=0x08000000)
if len(sys.argv)>1 and sys.argv[1]=='screenshot':
 from PIL import ImageGrab
 b=w.RECT();u.GetWindowRect(s,c.byref(b));ImageGrab.grab(bbox=(b.left,b.top,b.right,b.bottom)).save(pathlib.Path(os.environ['LOCALAPPDATA'])/'hermes/cache/scratch/cypher-taskbar-integrated.png')
print(json.dumps({'hwnd':int(h),'rect':[r.left,r.top,r.right,r.bottom]}))
