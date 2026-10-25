"""Do not let installer acceptance replace a user's existing Cypher installation."""
import os,sys,winreg
allowed=os.path.normcase(os.path.abspath(sys.argv[1]))
for hive in [winreg.HKEY_CURRENT_USER,winreg.HKEY_LOCAL_MACHINE]:
 for view in [winreg.KEY_WOW64_64KEY,winreg.KEY_WOW64_32KEY]:
  try:
   with winreg.OpenKey(hive,r'Software\Microsoft\Windows\CurrentVersion\Uninstall',0,winreg.KEY_READ|view) as root:
    for i in range(winreg.QueryInfoKey(root)[0]):
     try:
      with winreg.OpenKey(root,winreg.EnumKey(root,i)) as key:
       name=str(winreg.QueryValueEx(key,'DisplayName')[0])
       if name.lower().startswith('cypher'):
        location=str(winreg.QueryValueEx(key,'InstallLocation')[0])
        if os.path.normcase(os.path.abspath(location))!=allowed:
         print('Existing Cypher installation outside isolated test destination: test refused.');sys.exit(2)
     except OSError:pass
  except OSError:pass
print('No conflicting Cypher installation; isolated installer test can proceed.')
