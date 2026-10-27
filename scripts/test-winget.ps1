param([string]$Manifest)
$ErrorActionPreference = 'Stop'
if ($env:GITHUB_ACTIONS -ne 'true' -or $env:RUNNER_ENVIRONMENT -ne 'github-hosted') {
  throw 'Installation test is restricted to disposable GitHub-hosted runners.'
}
if (-not $Manifest) {
  # A new app build can precede its published, hashed catalog manifest.
  # Test the newest manifest actually present rather than a not-yet-published app.
  $catalogVersion = Get-ChildItem -LiteralPath 'distribution/winget/manifests/a/AArnaud/Cypher' -Directory |
    Where-Object { $_.Name -match '^\d+\.\d+\.\d+$' } |
    Sort-Object { [version]$_.Name } -Descending | Select-Object -First 1
  if (-not $catalogVersion) { throw 'No versioned WinGet manifest found' }
  $Manifest = $catalogVersion.FullName
}
Write-Host "Validating published installer manifest: $Manifest"
$versionFile = Join-Path $Manifest 'AArnaud.Cypher.yaml'
if ((Get-Content -LiteralPath $versionFile -Raw) -notmatch '(?m)^PackageVersion: (?<Version>\d+\.\d+\.\d+)\s*$') {
  throw 'Invalid manifest version'
}
$manifestVersion = $Matches.Version
$diagnosticRoot = Join-Path $env:RUNNER_TEMP 'cypher-winget-diagnostics'
New-Item -ItemType Directory -Path $diagnosticRoot -Force | Out-Null
function Invoke-TestProcess {
  param([string]$FilePath = (Get-Command winget).Source, [string[]]$Arguments, [int]$TimeoutSeconds = 180)
  $start = [Diagnostics.ProcessStartInfo]::new($FilePath)
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
    throw 'Installation operation timed out; isolated runner diagnostics captured'
  }
  $process.WaitForExit()
  Write-Output $stdout.GetAwaiter().GetResult()
  Write-Output $stderr.GetAwaiter().GetResult()
  if ($process.ExitCode -ne 0) { throw "Installation operation failed with exit code $($process.ExitCode)" }
}
$productCode = '9d10fd83-a3eb-5c67-9fe1-e052446dd9ec'
$uninstallKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\$productCode"
$installKey = "HKCU:\Software\$productCode"
if ((Test-Path -LiteralPath $uninstallKey) -or (Test-Path -LiteralPath $installKey)) {
  throw 'Refusing to modify an existing Cypher installation.'
}
winget validate --manifest $Manifest --disable-interactivity
if ($LASTEXITCODE -ne 0) { throw 'Manifest validation failed' }
  # A local manifest is not a scanned/trusted catalog source: SmartScreen can
  # stop it before NSIS runs. Test the exact published bytes independently.
  # Full trusted-catalog installation is validated by Microsoft's pipeline.
  $installerManifest = Get-Content -LiteralPath (Join-Path $Manifest 'AArnaud.Cypher.installer.yaml') -Raw
  if ($installerManifest -notmatch '(?m)^\s+InstallerSha256: (?<Hash>[A-Fa-f0-9]{64})\s*$') { throw 'Missing installer SHA-256' }
  $expectedHash = $Matches.Hash
  $installerUrl = "https://github.com/A-Arnaud/Cypher/releases/download/v$manifestVersion/Cypher-Setup-$manifestVersion-win-x64.exe"
  if (-not $installerManifest.Contains("InstallerUrl: $installerUrl")) { throw 'Unexpected installer URL' }
  $installerPath = Join-Path $env:RUNNER_TEMP "Cypher-Setup-$manifestVersion-win-x64.exe"
  Invoke-WebRequest -Uri $installerUrl -OutFile $installerPath
  if ((Get-FileHash -LiteralPath $installerPath -Algorithm SHA256).Hash -ne $expectedHash) { throw 'Installer hash mismatch' }
  Invoke-TestProcess -FilePath $installerPath -Arguments @('/S')
  $entry = Get-ItemProperty -LiteralPath $uninstallKey
  $entry | Select-Object DisplayName, Publisher, DisplayVersion | ConvertTo-Json | Write-Output
  if ($entry.DisplayName -ne "Cypher $manifestVersion" -or $entry.Publisher -ne 'Cypher' -or $entry.DisplayVersion -ne $manifestVersion) {
    throw 'Installed registration differs from manifest metadata'
  }
  $installedRoot = [IO.Path]::GetFullPath((Get-ItemProperty -LiteralPath $installKey).InstallLocation)
  $programRoot = [IO.Path]::GetFullPath((Join-Path $env:LOCALAPPDATA 'Programs')) + '\'
  if (-not $installedRoot.StartsWith($programRoot, [StringComparison]::OrdinalIgnoreCase)) {
    throw 'Unexpected installation directory'
  }
  $installedExe = Join-Path $installedRoot 'Cypher.exe'
  $actualVersion = (Get-Item -LiteralPath $installedExe).VersionInfo.ProductVersion
  if ($actualVersion -notin @($manifestVersion, "$manifestVersion.0")) { throw "Wrong installed application version: $actualVersion" }
  Write-Output "Cypher $manifestVersion installed silently; publisher, version, executable and per-user registration match."
  Invoke-TestProcess -Arguments @('uninstall', '--product-code', $productCode, '--silent', '--accept-source-agreements', '--disable-interactivity')
  # NSIS can hand off to a temporary uninstaller after WinGet's launcher exits.
  $cleanupWait = [Diagnostics.Stopwatch]::StartNew()
  while ($cleanupWait.Elapsed.TotalSeconds -lt 30 -and ((Test-Path -LiteralPath $uninstallKey) -or (Test-Path -LiteralPath $installedExe))) {
    Start-Sleep -Milliseconds 250
  }
  if (Test-Path -LiteralPath $uninstallKey) { throw 'Uninstall registration remains' }
  if (Test-Path -LiteralPath $installedExe) { throw 'Application executable remains after uninstall' }
  Write-Output 'WinGet uninstall passed; test performed only on a disposable runner.'
