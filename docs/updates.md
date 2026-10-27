# Update Cypher

## Install the update-aware version once

**Install Cypher 0.6.0 manually once** from [Latest](https://github.com/A-Arnaud/Cypher/releases/latest). Earlier 0.5.x applications do not contain the update checker and cannot gain it merely because a new release was published. Quit the old process before replacing the application.

## A discreet proposal

The installed app checks GitHub's latest stable release about **30 seconds after startup**, then **every six hours** while running. Drafts, prereleases and downgrades are excluded. It selects the package version for your OS/processor, including when a common release retains unchanged files for another platform.

A small **Update / Mise à jour** action appears in the compact/detailed footer and native menu. Mac adds a small upward arrow beside the menu bar title. Cypher does not open its window, bounce its Dock icon or send an OS notification when an update is found.

Click the action to see the version, download size and installation behavior. **Update now** or **Download update** confirms the action; **Later** hides the notice for 24 hours. A manual check remains available in **Settings → Updates**. Automatic checks can be disabled there without disabling manual checks.

## Installation behavior

| Application | After approval |
| --- | --- |
| **Installed Windows x64 app** | Download, SHA-512 and GitHub SHA-256 verification, native indicator/reader cleanup, then silent NSIS installation and restart directly in the bar |
| **Windows portable or uninstalled extracted copy** | Open the correct official download in the system browser; replacement remains manual |
| **Current Mac Intel / Apple Silicon app** | Open the correct official DMG download in the system browser; quit the old version and replace Cypher.app in Applications manually |

Windows automatic installation requires a complete release with valid `latest.yml` metadata. If it is absent, Cypher offers the official manual download. A failed check is quiet in the background; Settings shows explicit failures for requested checks or downloads. Cancelling a download never stages installation, and ordinary app Quit does not install an unapproved cached update.

Mac native automatic updating requires a stable code-signing identity. Current Mac builds are ad-hoc signed without Apple Developer ID/notarization, so Cypher does **not** attempt automatic app replacement or bypass Gatekeeper. A future signed release also needs the native Mac updater integration before that installation mode can be enabled. [Electron signing requirements](https://www.electronjs.org/docs/latest/tutorial/code-signing) · [Apple signing setup](macos-signing.md).

## What is verified

The checker contacts the fixed public GitHub repository, validates release/asset names, architecture, version, state, size and HTTPS locations, and exposes only status/version/progress to the renderer. Windows metadata is checked against its GitHub asset digest; installer content is checked with the manifest SHA-512 and independent GitHub SHA-256 before installation handoff. These checks trust the repository/release publisher and HTTPS; they are not an Authenticode publisher signature.

No provider credentials, account identifiers or persistent staged-rollout ID are sent. Preferences and profiles stay outside the application files. Downloaded updates use the updater's cache; the 24-hour deferral is stored in `app-update-state.json` in Cypher's data directory. [Privacy](../PRIVACY.md) · [Security](../SECURITY.md) · [Verification records](../VERIFICATION.md).

## Publishing a future release

Build Windows with its configured GitHub publish provider and **`--publish never`** in validation. Run `node scripts/check-update-metadata.cjs`, then publish the validated installer, portable EXE, **`latest.yml`**, Windows checksum manifest and both Mac download/checksum sets. The current common release contains **ten assets**. Full downloads are used; block maps are not required by the client.

If retaining an unchanged Windows build in a newer common release, retain its original installer filename, `latest.yml` and hashes together. The client compares the platform package version, not merely the common release tag. Never relabel old binaries as a new package version. [Release procedure](releasing.md).
