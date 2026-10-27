param([string]$Manifest)
$ErrorActionPreference = 'Stop'
if ($env:GITHUB_ACTIONS -ne 'true' -or $env:RUNNER_ENVIRONMENT -ne 'github-hosted') {
  throw 'Installation test is restricted to disposable GitHub-hosted runners.'
}
if (-not $Manifest) {
  $packageVersion = (Get-Content -LiteralPath 'package.json' -Raw | ConvertFrom-Json).version
  if ($packageVersion -notmatch '^\d+\.\d+\.\d+$') { throw 'Invalid package version' }
  $Manifest = Join-Path 'distribution/winget/manifests/a/AArnaud/Cypher' $packageVersion
}
$versionFile = Join-Path $Manifest 'AArnaud.Cypher.yaml'
if ((Get-Content -LiteralPath $versionFile -Raw) -notmatch '(?m)^PackageVersion: (?<Version>\d+\.\d+\.\d+)\s*$') {
  throw 'Invalid manifest version'
}
$manifestVersion = $Matches.Version
$diagnosticRoot = Join-Path $env:RUNNER_TEMP 'cypher-winget-diagnostics'
New-Item -ItemType Directory -Path $diagnosticRoot -Force | Out-Null
function Invoke-TestWinGet {
  param([string[]]$Arguments, [int]$TimeoutSeconds = 180)
  $start = [Diagnostics.ProcessStartInfo]::new((Get-Command winget).Source)
  $start.UseShellExecute = $false
  $start.CreateNoWindow = $true
  $start.RedirectStandardOutput = $true
  $start.RedirectStandardError = $true
  foreach ($argument in $Arguments) { $start.ArgumentList.Add($argument) }
  $process = [Diagnostics.Process]::Start($start)
  $stdout = $process.StandardOutput.ReadToEndAsync()
  $stderr = $process.StandardError.ReadToEndAsync()
  if (-not $process.WaitForExit($TimeoutSeconds * 1000)) {
    Get-CimInstance Win32_Process | Where-Object { $_.Name -match 'Cypher|winget|setup|installer' } |
      Select-Object ProcessId, ParentProcessId, Name, CommandLine |
      ConvertTo-Json | Set-Content (Join-Path $diagnosticRoot 'processes.json')
    Get-Process | Where-Object { $_.ProcessName -match 'Cypher|winget|setup|installer' } |
      Select-Object Id, ProcessName, MainWindowTitle, CPU |
      ConvertTo-Json | Set-Content (Join-Path $diagnosticRoot 'windows.json')
    try {
      Add-Type -AssemblyName System.Windows.Forms
      Add-Type -AssemblyName System.Drawing
      $bounds = [Windows.Forms.SystemInformation]::VirtualScreen
      $bitmap = [Drawing.Bitmap]::new($bounds.Width, $bounds.Height)
      $graphics = [Drawing.Graphics]::FromImage($bitmap)
      $graphics.CopyFromScreen($bounds.Left, $bounds.Top, 0, 0, $bounds.Size)
      $bitmap.Save((Join-Path $diagnosticRoot 'desktop.png'))
      $graphics.Dispose(); $bitmap.Dispose()
    } catch { Write-Output 'Screenshot unavailable' }
    $process.Kill($true)
    $process.WaitForExit()
    $stdout.GetAwaiter().GetResult() | Set-Content (Join-Path $diagnosticRoot 'stdout.txt')
    $stderr.GetAwaiter().GetResult() | Set-Content (Join-Path $diagnosticRoot 'stderr.txt')
    throw 'WinGet operation timed out; isolated runner diagnostics captured'
  }
  $process.WaitForExit()
  Write-Output $stdout.GetAwaiter().GetResult()
  Write-Output $stderr.GetAwaiter().GetResult()
  if ($process.ExitCode -ne 0) { throw "WinGet failed with exit code $($process.ExitCode)" }
}
$productCode = '9d10fd83-a3eb-5c67-9fe1-e052446dd9ec'
$uninstallKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\$productCode"
$installKey = "HKCU:\Software\$productCode"
if ((Test-Path -LiteralPath $uninstallKey) -or (Test-Path -LiteralPath $installKey)) {
  throw 'Refusing to modify an existing Cypher installation.'
}
winget validate --manifest $Manifest --disable-interactivity
if ($LASTEXITCODE -ne 0) { throw 'Manifest validation failed' }
winget settings --enable LocalManifestFiles --disable-interactivity
if ($LASTEXITCODE -ne 0) { throw 'Could not enable local manifests on test runner' }
try {
  Invoke-TestWinGet -Arguments @('install', '--manifest', (Resolve-Path -LiteralPath $Manifest).Path, '--silent', '--accept-package-agreements', '--accept-source-agreements', '--disable-interactivity')
  $entry = Get-ItemProperty -LiteralPath $uninstallKey
  if ($entry.DisplayName -ne 'Cypher' -or $entry.Publisher -ne 'Cypher' -or $entry.DisplayVersion -ne $manifestVersion) {
    throw 'Installed registration differs from manifest metadata'
  }
  $installedRoot = [IO.Path]::GetFullPath((Get-ItemProperty -LiteralPath $installKey).InstallLocation)
  $programRoot = [IO.Path]::GetFullPath((Join-Path $env:LOCALAPPDATA 'Programs')) + '\'
  if (-not $installedRoot.StartsWith($programRoot, [StringComparison]::OrdinalIgnoreCase)) {
    throw 'Unexpected installation directory'
  }
  $installedExe = Join-Path $installedRoot 'Cypher.exe'
  if ((Get-Item -LiteralPath $installedExe).VersionInfo.ProductVersion -ne $manifestVersion) { throw 'Wrong installed application version' }
  Write-Output "Cypher $manifestVersion installed silently; publisher, version, executable and per-user registration match."
  Invoke-TestWinGet -Arguments @('uninstall', '--product-code', $productCode, '--silent', '--accept-source-agreements', '--disable-interactivity')
  if (Test-Path -LiteralPath $uninstallKey) { throw 'Uninstall registration remains' }
  if (Test-Path -LiteralPath $installedExe) { throw 'Application executable remains after uninstall' }
  Write-Output 'WinGet uninstall passed; test performed only on a disposable runner.'
} finally {
  winget settings --disable LocalManifestFiles --disable-interactivity
}
