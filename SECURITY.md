# Security

Cypher is a local application for Windows and macOS. It has no central server, application telemetry, or account-upload mechanism. “Local” does not mean “offline”: after authorization, quota reads contact the relevant provider. The external browser can also be opened on demand for login or a dashboard. Destinations and stored data are described in [PRIVACY.md](PRIVACY.md).

## Implemented protections

- Sandboxed renderer, context isolation, and Node disabled. No file, shell, decryption, or arbitrary IPC API is exposed to the interface.
- The production interface loads its local files. Its CSP blocks network connections, forms, subframes, workers, and plugins. A second rule in the Electron session blocks external requests and file access outside the packaged interface. The interface's Chromium session is held in memory.
- Navigation, new windows, webviews, and permissions are denied. Every IPC command checks the sender, its window, its frame, and its arguments. Links opened by the main process come from fixed lists.
- API keys are entered explicitly and encrypted using Electron safeStorage: Windows DPAPI or the macOS Keychain. No plaintext storage fallback. The encrypted envelope binds each key to its provider to reject reuse of ciphertext moved to another connector. Keys are never returned in public state or the console.
- API collectors make GET requests to predefined URLs without following redirects. Local reads are limited to fixed loopback addresses. JSON bodies are bounded during receipt, and requests have a timeout.
- CLIs use fixed commands without generation prompts. Their environment does not inherit API keys, tokens, other profiles' variables, or Node injection options from the parent process. Reads run in a neutral folder; documented telemetry settings are disabled in Codex and Claude readers without changing the user's saved configuration.
- The distribution disables the Electron RunAsNode, NodeOptions, and NodeCliInspect fuses, and enables cookie encryption, ASAR integrity, and loading only from ASAR. The test build is separate and is not intended for distribution.
- The list of packaged files is explicit. Source, Git history, and archive scans must find no recognized account files or secrets before publication.

## Known limitations

These measures do not guarantee the absence of vulnerabilities. DPAPI protects data at rest against other Windows accounts; it does not protect against malware or an administrator running in the same session, a compromised Windows installation, screenshots, or memory reads. The key temporarily exists in memory to be sent to its provider. Entering an admin key grants access to the organization data that key authorizes: prefer the narrowest available read permissions.

CLIs and their configurations belong to the user. They may perform their own network operations; Cypher is not a firewall for a compromised executable or third-party configuration. Proxies and certificate authorities explicitly supplied by the system environment remain a trust boundary. Cypher does not disable TLS validation.

Current executables are not Authenticode-signed. ASAR integrity is not a publisher signature: it does not by itself prove the origin of a download. Compare the published SHA-256 hashes from a trusted repository. Do not run an unknown build with administrator privileges.

The current macOS download uses an ad-hoc signature without Apple Developer ID or notarization. Its hardened runtime is disabled for this build; Gatekeeper may block the first launch. Keychain encryption is not a guarantee against malicious software in the same user session. See [the Mac guide](MACOS.md) for first-launch instructions and manual login items. Mac CI checks the final application signature and launch on both architectures; this is not Apple approval or physical-device certification.

A separate manual [Developer ID/notarization workflow](docs/macos-signing.md) is prepared for future releases. It requires Apple credentials, enables hardened runtime and fails if signature, notarization-ticket or Gatekeeper checks fail. These checks have not been exercised with real Apple credentials and do not change the status of the current preview.

Hardening may require re-entering API keys saved in an older version whose envelope was not bound to the provider. CLI profiles are not modified. Embedded browser login modes are not implemented; personal browser cookies are not collected.

## Pre-publication checks

For macOS, follow [Mac build and verification](MACOS.md#verification-and-builds) and the [macOS workflow](.github/workflows/macos.yml). Windows-specific packaging commands below do not build Mac downloads.

On Windows x64 with Node.js installed for development:

```powershell
npm ci
npm run typecheck
npm test
npm run test:ui
npm run security:scan
npm run security:secrets
npm audit --audit-level=moderate
npm run build:test
npm run test:clean-machine
npm run dist
npm run security:release
```

The first-launch test uses only empty profiles and synthetic API responses. Do not publish `test-results`, `.local-builds`, `.security-tools`, diagnostic reports, preferences, the profile registry, or a user-data folder. Publish verified sources with Git and, if desired, the installers/portable executables from `release` with their hashes. Windows CI runs these checks with a read-only GitHub token and sends no secrets to the application.

A pattern or dependency scan does not cover every type of secret or vulnerability. Independent review and testing on other machines remain necessary before claiming an external audit or general compatibility.

## Reporting a vulnerability

Open [Cypher's security policy](https://github.com/A-Arnaud/Cypher/security/policy), then use **Security → Advisories → Report a vulnerability** when GitHub private reporting is enabled. Submit a minimal description, affected version, impact and reproduction using synthetic data. Do not disclose vulnerability details in ordinary issues or pull requests. No reporting email address or response-time guarantee is advertised.

If the private-reporting button is unavailable, ask the maintainer to enable GitHub private vulnerability reporting without posting exploit details or account data. GitHub provides this feature for public repositories; changing visibility is a separate owner decision.

Do not attach keys, tokens, login codes, auth.json files, CLI credentials, cookies, memory dumps, or screenshots containing an account, even to a private report. If a secret has been published, revoke it at its provider; removing it from the latest commit is not enough to remove it from history and existing copies.

References: [Electron security](https://www.electronjs.org/docs/latest/tutorial/security), [safeStorage limitations](https://www.electronjs.org/docs/latest/api/safe-storage).

### Checking a separate release output folder

Set the PowerShell environment variable CYPHER_RELEASE_ROOT to the unpacked application folder (for example, release/github-v0.4.8/win-unpacked) before running the release-security and production-security checks. Without this variable, they check release/win-unpacked. This allows packaging without replacing a portable executable that is currently open.
