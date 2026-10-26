# Cypher 0.5.0 — Windows 10/11 release verification

Date: October 26, 2026. Local host: Windows 10 Pro x64, build 19045. Source work starts at `7a6f4fb`; runtime changes are in `c39b349`, native-tray smoke correction in `4c32fa6`.

## What changed

One Windows x64 package selects an embedded taskbar backend on the known Windows 10 build family and a native Electron notification-area backend on Windows 11/newer or unrecognized systems. The tray backend reuses the existing Cypher icon and exposes public provider names plus bounded quota summaries in its tooltip/menu, not account labels. The widget, provider collection and saved settings remain available. The native helper rejects unsupported shell versions before its surface/watch/mutex path; its independent `--startup-query` read remains available.

The Windows 11 path is NOT embedded quota text inside Explorer. Windows may put its icon under hidden icons. Use the widget for permanently visible numbers.

## Executed locally

| Check | Actual result |
| --- | --- |
| `npm run typecheck` | Passed |
| `npm test` | 132 passed, 26 test files |
| `npm run test:ui` | 16 Edge scenarios passed, including FR/EN notification-area controls in both views |
| `node scripts/test-tray-native.cjs` | Passed with real Electron Tray/Menu and an isolated temporary BrowserWindow on Windows 10 |
| `npm run build:test` | Separate test package created with Electron 45.0.0 / electron-builder 26.18.0 |
| `npm run test:clean-machine` | 12 checks passed through packaged IPC with an empty profile, no inherited account/consent and synthetic API responses |
| `npm run test:corners` | 4 native-window region/transparency/view-transition checks passed |
| `npm run dist -- --publish never` | Installer and portable 0.5.0 built locally without publication |
| `npm run security:release` | Production fuses/CSP, outside-ASAR helper, private-file and source/history/archive pattern scans passed |
| `node scripts/smoke-production-security.cjs` | Hardened production executable opened an empty profile; Node injection did not execute and debug port did not open |
| `scripts/check-windows-icons.ps1` | Actual icon resources matched the supplied logo in app, helper, installer and portable |
| `npm audit --audit-level=moderate` | No known vulnerabilities reported at check time |
| `npm outdated --json` | No outdated direct dependencies after the scoped builder update |
| `npm run security:secrets` | Pinned Gitleaks history and public-file scans passed |

The native tray smoke covers saved taskbar-mode restoration, no native-helper construction or registry writes, stale/unknown/+N values, tooltip length at most 127, no account-label leakage, show/hide, refresh, pause/resume, disable/re-enable and shutdown. It checks actual Menu objects and arguments submitted to Electron's Tray setters; it does not visually read Explorer's tooltip.

The first native smoke failed because the GUI fixture was launched with the hidden Windows startup flag and no loaded content. The fixture now loads a minimal isolated page and uses normal GUI launch semantics; the same show/hide assertion and subsequent full smoke passed. No user-application behavior was weakened to satisfy the test.

The native-version unit harness compiles the real C# helper and exercises its pure version policy and real `RtlGetVersion` without calling `Program.Main`, creating a surface/mutex or moving Explorer windows. Injected version strings and bridge fixtures are simulated Windows 11 coverage, not a Windows 11 desktop test.

## Publication and presentation

README, support, contribution guidance, bug-report environment fields and changelog describe the two presentations separately. Existing graphite/firefly artwork is retained; documentation screenshots are regenerated from account-free browser fixtures, with synthetic metrics explicitly identified. Screenshots were visually checked. CI pins verified Action revisions, logs the actual Windows Server host, builds with `--publish never` and retains only the executables and checksums as short-lived build artifacts. CI success must be checked separately; a workflow definition is not a run result.

## Local artifact checksums

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `Cypher-Setup-0.5.0-win-x64.exe` | 122359753 | `2a8ea317d6550bbf897017615e6217e68cc9468ab0f2c804f66ac57b03974c52` |
| `Cypher-0.5.0-win-x64.exe` | 111259520 | `e26bb9f2808ed25c86d1d5f3094e8323dd5662a24928359876ce85ae26eae511` |

Computed from the final local production executables using Python `hashlib.file_digest`. Both entries are in `SHA256SUMS-0.5.0.txt`. Downloaded GitHub assets must be compared with this manifest after upload.

## Independent review

A fresh read-only whole-diff review found no critical security or lifecycle issue and identified one documentation mismatch: the tray was described as preserving balance/model-count units although it inherits the percentage-only compact summary. README and support now explicitly restrict the compact indicator to available percentages and direct other units to the widget/details. A regression verifies that known balances and model counts remain intact in application state and never become fabricated percentages. The full suite was rerun after this clarification: 132 unit tests, 16 UI scenarios, types, native tray smoke and release/secret scans passed. This was a documentation correction, not an expansion of provider coverage.

## Explicit limits

- **No Windows 11 device was available.** Real Windows 11 tray placement, display scaling, shell behavior, install/startup and restore are pending acceptance. The implementation is not Windows 11 certification.
- Hosted `windows-2025` is Windows Server build/automation coverage, not Windows 11 Explorer.
- The installed user's Cypher and its helper remained running; this run did not replace it or change its account permissions/startup/settings. Live Win10 Explorer reservation tests were not rerun because they would contend with that user's taskbar surface. Existing native evidence is historical; the new native guard was tested through the non-shell harness.
- No real PC reboot, physical second machine, all DPI/taskbar layouts, ARM64 build, Authenticode signing or antivirus certification.
- No live provider quota or account login was exercised. Synthetic collectors do not establish real provider support; Claude/Gemini quota limitations are unchanged.
- Executables remain unsigned. Security scans do not prove the absence of every secret or vulnerability.
