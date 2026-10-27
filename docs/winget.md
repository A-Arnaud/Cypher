# Install Cypher with WinGet

**Catalog registration is being prepared. The public command is not available yet.** Until Microsoft accepts the package and publishes it to the WinGet source, use the [Windows installer](https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-Setup-0.7.0-win-x64.exe).

After catalog publication, the Windows command will be:

```powershell
winget install --id AArnaud.Cypher --exact --source winget
```

The shorter `winget install AArnaud.Cypher` selects the same package once available. The explicit ID/source avoids similarly named applications. WinGet is a Windows installer; Mac downloads remain on the [common Latest release](https://github.com/A-Arnaud/Cypher/releases/latest).

The package references the official versioned Windows x64 NSIS installer, with its SHA-256, per-user installation and native uninstall product code. It installs Cypher itself; Node.js and a separate Codex CLI are not required to run the app. The application remains named Cypher in Windows.

To find or update a published entry:

```powershell
winget show --id AArnaud.Cypher --exact --source winget
winget upgrade --id AArnaud.Cypher --exact --source winget
```

## Maintainer procedure

The proposed manifest set is in [distribution/winget](../distribution/winget/manifests/a/AArnaud/Cypher/0.7.0). It contains version, installer and English/French locale files using Microsoft's recommended 1.12 schema. The installer publisher/name/version must match the actual Add/Remove Programs entry, not just a marketing title.

Run the schema check locally without installing the application:

```powershell
winget validate --manifest distribution/winget/manifests/a/AArnaud/Cypher/0.7.0
```

The [dedicated workflow](../.github/workflows/winget.yml) prepares Microsoft's WinGet client, validates the manifests, verifies the published installer SHA-256, runs that NSIS installer silently, checks its registration/executable version and uninstalls through WinGet by product code. The script refuses to run outside disposable GitHub-hosted runners or over an existing Cypher installation. Application binaries are neither rebuilt nor replaced by a catalog submission.

An attempted local-manifest installation downloaded/verified the package but stopped at SmartScreen before NSIS ran. Local manifests are not a trusted catalog source. The independent installer test does not prove acceptance or installation from Microsoft's public catalog; Microsoft's scans/review and a real public-source check are still required. No customer instruction disables SmartScreen or skips hash validation.

For a future release, add a new versioned manifest directory, retain stable package ID/product code, use the exact published installer URL, recompute/verify its SHA-256 and test before submitting one version per PR to `microsoft/winget-pkgs`. Submit only the manifest files upstream. Repository merge and public catalog availability are distinct; mark the command available only after a real `winget show` from the public source succeeds.

The application currently declares no project-wide open-source license. Manifest metadata therefore uses `Proprietary` rather than inventing an open-source grant; it does not add or change a software license. Microsoft may require contributor agreement or review actions from the GitHub account owner.

[Microsoft submission procedure](https://learn.microsoft.com/en-us/windows/package-manager/package/repository) · [First contribution checklist](https://github.com/microsoft/winget-pkgs/blob/master/doc/FirstContribution.md)
