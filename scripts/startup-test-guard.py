"""Refuse installed acceptance testing if it would overwrite user startup state."""
import winreg,sys
try:
 with winreg.OpenKey(winreg.HKEY_CURRENT_USER,r'Software\Microsoft\Windows\CurrentVersion\Run') as key:
  winreg.QueryValueEx(key,'Cypher')
 print('Existing Cypher startup registration: installed smoke refused without changing it.');sys.exit(2)
except FileNotFoundError:print('Cypher startup registration absent; isolated test can proceed.')
