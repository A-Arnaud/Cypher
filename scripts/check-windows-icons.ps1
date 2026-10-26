param([Parameter(Mandatory=$true)][string[]]$ExecutablePaths)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type @'
using System;
using System.Drawing;
using System.Runtime.InteropServices;
public static class CypherExecutableIcon {
 [DllImport("shell32.dll", CharSet=CharSet.Unicode)] static extern uint ExtractIconEx(string file, int index, IntPtr[] large, IntPtr[] small, uint count);
 [DllImport("user32.dll")] static extern bool DestroyIcon(IntPtr icon);
 public static Bitmap Load(string file) {
  var large=new IntPtr[1];var small=new IntPtr[1];
  if(ExtractIconEx(file,0,large,small,1)==0 || large[0]==IntPtr.Zero)throw new Exception("No Windows icon resource: "+file);
  try {return Icon.FromHandle(large[0]).ToBitmap();}
  finally {if(large[0]!=IntPtr.Zero)DestroyIcon(large[0]);if(small[0]!=IntPtr.Zero)DestroyIcon(small[0]);}
 }
}
'@ -ReferencedAssemblies System.Drawing
$cypherRoot = Split-Path $PSScriptRoot -Parent
# Use the Windows loader for both sides: .NET Icon.ToBitmap misreads some PNG ICOs.
$cypherExpected = [CypherExecutableIcon]::Load((Join-Path $cypherRoot 'assets/icon.ico'))
try {
 foreach ($cypherExe in $ExecutablePaths) {
  $cypherPath = (Resolve-Path -LiteralPath $cypherExe).Path
  $cypherActual = [CypherExecutableIcon]::Load($cypherPath)
  try {
   if ($cypherActual.Width -ne 32 -or $cypherActual.Height -ne 32) { throw "Unexpected icon size: $cypherPath" }
   $cypherDifferent=0
   for ($y=0;$y -lt 32;$y++) { for ($x=0;$x -lt 32;$x++) {
    $a=$cypherActual.GetPixel($x,$y);$e=$cypherExpected.GetPixel($x,$y)
    if ($a.A -ne $e.A -or ($a.A -gt 0 -and ($a.R -ne $e.R -or $a.G -ne $e.G -or $a.B -ne $e.B))) {$cypherDifferent++}
   }}
   if ($cypherDifferent -gt 0) {throw "Executable has a different logo ($cypherDifferent pixels): $cypherPath"}
   Write-Output "Verified embedded logo: $cypherPath"
  } finally { $cypherActual.Dispose() }
 }
} finally { $cypherExpected.Dispose() }
