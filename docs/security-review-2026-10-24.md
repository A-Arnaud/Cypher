# Local security review — October 24, 2026

Version reviewed and built: 0.4.6. Target: this machine's Windows 10 x64 installation. This code review and these tests do not constitute an independent audit or certification that vulnerabilities are absent.

## Changes made

| Surface | Result |
|---|---|
| Electron interface | Sandbox, isolation, and absence of Node and webviews retained; in-memory session; permissions and navigation denied |
| Renderer network | Production CSP connect-src none and form-action none; separate request control in the session; no file access outside the packaged renderer |
| CLI subprocesses | Filtered environment without ambient keys/tokens, Node options, or other profiles' overrides; neutral working folder |
| Electron execution and debugging | RunAsNode, NodeOptions, and NodeCliInspect disabled in the distribution; Chromium debugging switches removed |
| Application integrity | ASAR integrity and ASAR-only loading enabled; explicit distributed file list, without node_modules or diagnostics |
| API keys | DPAPI encryption without a weak fallback backend; encrypted envelope bound to the provider; no key values in public state |
| Provider/local server responses | Size limited during download; redirects prohibited; bounded timeouts and pagination |
| Documentation | Screenshots regenerated without accounts or CLIs; SECURITY.md and PRIVACY.md added; limitations and destinations documented |
| GitHub | Windows workflow, secret scans, npm audit, tests, and artifact verification; actions pinned by SHA, contents:read permissions; Dependabot tracking |

## Checks performed

- TypeScript: passed.
- Unit tests: 92 passed, including environment filtering, rejection of ciphertext transferred between providers, weak encryption backend, and interruption of an oversized HTTP body.
- Interface tests: 9 passed.
- Separate test executable: first launch without Node/CLIs in PATH and without an account; real IPC, real DPAPI, seven simulated APIs; no plaintext key in storage or public state; disconnection verified.
- Renderer escape attempts: fetch and image requests to a local witness server denied, zero requests received.
- Production executable: startup with an empty profile; attempts through ELECTRON_RUN_AS_NODE and NODE_OPTIONS did not execute injected code; no debugging port opened.
- Fuses and CSP verified in the production executable and archive.
- npm audit: zero known vulnerabilities reported at the time of verification.
- Official Gitleaks 8.30.1, archive verified by SHA-256: no recognized secrets in publishable files or the 16 commits in history.
- Additional local scan: no secret patterns or account files in sources, the 172 historical blobs checked, or the produced archive.
- Documentation screenshot inspection: no real account identity displayed; new screenshots come from the preview without accounts.

Raw Gitleaks results, even redacted, and test artifacts remain in local folders excluded from Git. Hashes of the two distribution executables are in release/SHA256SUMS-0.4.6.txt. No GitHub repository was created, modified, or published during this review. CI is prepared but has not yet run on GitHub servers.

## Limitations and follow-up

DPAPI does not protect against a malicious process running as the same Windows user. Keys exist in memory during authentication. Providers necessarily receive the key intended for them and the client's IP address. Third-party CLIs and their configurations are not confined by a Cypher firewall. No personal cookies are collected, and no embedded login browser is shipped.

Old key records that are not bound to the provider require re-entry in Connections; CLI credentials are not rewritten. Executables remain without Authenticode signatures. Independent review, testing on other PCs/Windows versions, and validation of connectors with their real accounts remain outstanding. Automated scans detect neither every possible secret nor every vulnerability.

References: [Electron recommendations](https://www.electronjs.org/docs/latest/tutorial/security), [safeStorage and the DPAPI boundary](https://www.electronjs.org/docs/latest/api/safe-storage), [official Gitleaks](https://github.com/gitleaks/gitleaks/releases/tag/v8.30.1).
