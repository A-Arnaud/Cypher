# Keep downloads easy to find

The repository's **Latest** release is the common download page for **Windows 10/11, Mac Intel and Mac Apple Silicon**. README buttons and installation links use `/releases/latest/download/...` so users do not need to search version history.

Before promoting a release to Latest:

1. Include the current Windows installer and portable EXE, both Mac DMGs, both Mac ZIPs and their checksum manifests. Keep their original filenames.
2. If Windows has not changed, copy its existing published binaries and manifest unchanged. Verify against the original release digests; do not relabel them as a newer Windows build.
3. Verify every uploaded asset's SHA-256. State the actual Windows and Mac package versions in the release notes, even if they differ.
4. Put the three recommended downloads at the top of the release body: **Windows 10 / 11**, **Mac Intel**, **Mac Apple Silicon**. Put portable/ZIP/checksum alternatives below.
5. Update the filenames in README, `docs/downloads.md` and `MACOS.md` when a platform version changes. Verify every `/latest/download/` link against the candidate release assets before making it Latest.
6. Promote the user-ready download page out of Pre-release and mark it Latest. Keep historical releases and their original assets available.

Platform availability and signing are separate. Mac is supported and confirmed working; do not label it uncertain merely because Apple notarization is absent. Continue to describe the actual signature/notarization status in first-launch guidance. Only claim Apple notarization after the real [Developer ID checks](macos-signing.md) pass.

The current common release contains **Cypher 0.5.4 for Windows and macOS**, with the labelled bar placement button and close/minimize/quit choices on both platforms.
