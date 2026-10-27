# Keep downloads easy to find

The repository's **Latest** release is the common download page for **Windows 10/11, Mac Intel and Mac Apple Silicon**. README buttons and installation links use `/releases/latest/download/...` so users do not need to search version history.

Before promoting a release to Latest:

1. Include the current Windows installer and portable EXE, both Mac DMGs, both Mac ZIPs and their checksum manifests. Keep their original filenames.
2. If Windows has not changed, copy its existing published binaries and manifest unchanged. Verify against the original release digests; do not relabel them as a newer Windows build.
3. Verify every uploaded asset's SHA-256. State the actual Windows and Mac package versions in the release notes, even if they differ.
4. Put the three recommended downloads at the top of the release body: **Windows 10 / 11**, **Mac Intel**, **Mac Apple Silicon**. Put portable/ZIP/checksum alternatives below.
5. Update filenames/version references in README, `docs/downloads.md`, `MACOS.md`, `docs/demarrage-fr.md`, current FAQ/coverage and the issue-form examples. Update `docs/releases/README.md`, add the versioned notes and keep the Latest release body aligned with the current behavior. Verify every `/latest/download/` link against the candidate release assets before making it Latest.
6. Promote the user-ready download page out of Pre-release and mark it Latest. Add an older-version notice linking to Latest on historical release pages; keep their original assets, tags, checksums and dated behavior intact. For documentation-only cleanup, retain the current validated binaries and version.

Platform availability and signing are separate. Mac is supported and confirmed working; do not label it uncertain merely because Apple notarization is absent. Continue to describe the actual signature/notarization status in first-launch guidance. Only claim Apple notarization after the real [Developer ID checks](macos-signing.md) pass.

The current common release contains **Cypher 0.5.4 for Windows and macOS**, including discreet Mac agent behavior without a Dock entry, optional login startup, and the labelled bar placement/closing choices. Mac update instructions must tell users to quit the old process before replacing and reopening the application.
