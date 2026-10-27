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
  winget install --manifest $Manifest --silent --accept-package-agreements --accept-source-agreements --disable-interactivity
  if ($LASTEXITCODE -ne 0) { throw 'WinGet installation failed' }
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
  winget uninstall --product-code $productCode --silent --accept-source-agreements --disable-interactivity
  if ($LASTEXITCODE -ne 0) { throw 'WinGet uninstall failed' }
  if (Test-Path -LiteralPath $uninstallKey) { throw 'Uninstall registration remains' }
  if (Test-Path -LiteralPath $installedExe) { throw 'Application executable remains after uninstall' }
  Write-Output 'WinGet uninstall passed; test performed only on a disposable runner.'
} finally {
  winget settings --disable LocalManifestFiles --disable-interactivity
}
