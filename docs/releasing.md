# Keep downloads easy to find

The repository's **Latest** release is the common download page for **Windows 10/11, Mac Intel and Mac Apple Silicon**. README buttons and installation links use `/releases/latest/download/...` so users do not need to search version history.

Before promoting a release to Latest:

1. Include the current Windows installer and portable EXE, **`latest.yml`**, both Mac DMGs, both Mac ZIPs and their checksum manifests: ten assets for 0.9.0. Run `node scripts/check-update-metadata.cjs` against the built installer before publication. Keep original filenames.
2. If Windows has not changed, copy its existing published binaries, `latest.yml` and checksum manifest unchanged as one set. Verify against the original release digests; do not relabel them as a newer Windows build. The updater compares the package version for each platform, including mixed-version common releases.
3. Verify every uploaded asset's SHA-256. State the actual Windows and Mac package versions in the release notes, even if they differ.
4. Put the three recommended downloads at the top of the release body: **Windows 10 / 11**, **Mac Intel**, **Mac Apple Silicon**. Put portable/ZIP/checksum alternatives below.
5. Update filenames/version references in README, `docs/downloads.md`, `MACOS.md`, `docs/demarrage-fr.md`, current FAQ/coverage and the issue-form examples. Update `docs/releases/README.md`, add the versioned notes and keep the Latest release body aligned with the current behavior. Verify every `/latest/download/` link against the candidate release assets before making it Latest.
6. Promote the user-ready download page out of Pre-release and mark it Latest. Add an older-version notice linking to Latest on historical release pages; keep their original assets, tags, checksums and dated behavior intact. For documentation-only cleanup, retain the current validated binaries and version.

Platform availability and signing are separate. Mac is supported and confirmed working; do not label it uncertain merely because Apple notarization is absent. Continue to describe the actual signature/notarization status in first-launch guidance. Only claim Apple notarization after the real [Developer ID checks](macos-signing.md) pass.

The current common release contains **Cypher 0.9.0 for Windows and macOS**, including discreet update proposals, automatic installation after approval for installed Windows, manual browser downloads on current Mac/portable builds, and the existing bar/connection/startup behavior. Users of 0.5.x need to install the current version manually once to acquire the checker; installed Windows 0.6.0 can propose 0.9.0. Mac update instructions must tell users to quit the old process before replacing and reopening the application.

## WinGet catalog updates

The proposed package ID is `AArnaud.Cypher`; initial submission is [Microsoft #462651](https://github.com/microsoft/winget-pkgs/pull/462651). After publishing a Windows version, add its versioned manifest set under `distribution/winget`, retain the package ID/product code, update the exact installer URL/SHA-256 and AppsAndFeaturesEntries, then validate/test and submit that version upstream. The dedicated workflow derives the selected version from the manifest and tests only on disposable hosted runners. Track Microsoft review and public `winget show` availability before advertising an active install command. [Procedure and current status](winget.md).
