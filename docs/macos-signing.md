# Developer ID signing and Apple notarization

The current public Mac release is **not notarized**. The signing pipeline described here is prepared but cannot run successfully until Apple credentials are configured. It does not change the downloads already published or remove their warning retroactively.

To remove the unverified-developer/malware-check warning from a new download, the app needs a **Developer ID Application** certificate, **hardened runtime**, Apple notarization and a stapled ticket. A free Apple developer account or an ad-hoc signature does not provide these distribution credentials. The usual first-download confirmation can still appear after notarization.

Apple requires an active [Apple Developer Program membership](https://developer.apple.com/programs/enroll/), normally USD 99 per membership year or local equivalent. Enrollment, payment and accepting Apple's agreements are owner actions. No membership or certificate has been purchased or created by this project.

## Set up Apple access

1. Enroll with Apple and create a **Developer ID Application** certificate with its private key. Export it as a password-protected `.p12`; a Mac App Distribution certificate is not a substitute.
2. Create an app-specific password for notarization. Do not use the Apple account's normal password.
3. In GitHub, open **Settings > Environments > macos-signing** and add these secrets. Restrict the environment to `main` and optionally require a reviewer before exposing the credentials.

| Secret | Value |
| --- | --- |
| `MAC_CSC_LINK` | Base64-encoded `.p12` certificate, including its private key |
| `MAC_CSC_KEY_PASSWORD` | Password protecting that `.p12` |
| `APPLE_ID` | Apple account email for notarization |
| `APPLE_APP_SPECIFIC_PASSWORD` | App-specific password |
| `APPLE_TEAM_ID` | Apple Developer team ID |

Do not send these values in chat, issues, pull requests or committed files. `.p12`, `.pfx`, `.p8`, `.pem` and `.key` files are excluded from Git.

## Build and verify

Run **Actions > macOS Developer ID signing and notarization > Run workflow** on `main`. The manual workflow builds Intel and Apple Silicon independently; it never runs on pull requests and supplies signing credentials only to the preflight and signing steps.

The signed configuration removes the ad-hoc identity, requires real code signing, enables hardened runtime and notarization, and explicitly signs the DMG. Missing credentials stop the process rather than silently producing an unsigned release.

After electron-builder notarizes and staples the app, the finalization script also notarizes/staples the outer DMG. It checks Developer ID and hardened runtime, `codesign`, `stapler` and Gatekeeper's `spctl` assessment. It extracts the ZIP and mounts the DMG read-only to verify the app inside each download. The workflow then runs the final application smoke and archive scan and computes checksums from the final files.

Successful builds are retained as `cypher-developer-id-*` artifacts. The workflow has a read-only GitHub token and **does not replace or publish releases automatically**. Publish a new Mac version from the verified artifacts and update its checksums and download links together; keep the existing Windows release. Never label the existing ad-hoc release as notarized.

Real Apple signing, notarization and Gatekeeper acceptance cannot be tested until valid credentials exist. Current unit coverage verifies missing-secret rejection, rejection of PR signing, removal of ad-hoc signing from the production config, and rejection of ad-hoc/non-hardened signature results.

References: [Apple notarization requirements](https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution), [electron-builder v26 notarization](https://www.electron.build/v26/docs/notarization/).
