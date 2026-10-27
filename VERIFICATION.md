# Current download availability - October 27, 2026

- The maintainer confirms Cypher works on Mac. Current documentation presents macOS as available on Intel and Apple Silicon, with the existing native/CI evidence below. This confirmation does not claim Apple notarization or universal live-provider quota coverage.
- GitHub Latest now groups Windows 10/11, Mac Intel and Mac Apple Silicon on one download page. It contains Windows 0.5.0 and macOS 0.5.1-mac.2, with their actual package versions stated explicitly.
- All nine common-release assets match the original Windows and Mac release SHA-256 digests. Original Windows release asset IDs and digests are retained; its executables have not been rebuilt or replaced. Mac executables are unchanged.
- The home page has direct download buttons for the three choices, with alternative formats and detailed instructions in docs/downloads.md. GitHub-rendered Markdown, 18 download references and 49 local file/anchor links were checked during publication. Historical test records retain their dates and scope below.

# Cypher 0.5.1-mac.2 - connection options verification on October 27, 2026

- Published [Mac preview 0.5.1-mac.2](https://github.com/A-Arnaud/Cypher/releases/tag/v0.5.1-mac.2), with DMG/ZIP downloads and SHA-256 manifests for Intel and Apple Silicon. Existing Windows 0.5.0 binaries remain the stable release.
- Source 0febe05: [Mac CI](https://github.com/A-Arnaud/Cypher/actions/runs/40430285400) passed on both architectures, with 79 unit/subprocess tests each (one Windows-only test skipped), an actual native Codex app-server probe in an empty file-only auth profile, Electron docking/restore, final application and connector version launches, signature and archive scans.
- [Windows CI](https://github.com/A-Arnaud/Cypher/actions/runs/40430285361) passed 149 unit/subprocess tests, 17 browser UI scenarios, packaged first-run checks without external CLI/Node, native-window checks, production security, executable icons, packaging and artifact scans.
- Browser authentication tests use real subprocesses with synthetic responses. They cover exact trusted URL hosts, profile isolation and canonical paths/junctions, success-only read authorization, cancellation, rejected/mismatched completion, secret filtering and first-account indicator placement. No real account login or quota result is claimed.
- All four Mac downloads matched the CI checksum manifests after download; GitHub's digests for all six uploaded files also matched local SHA-256. The packaged Codex Mach-O deployment targets are macOS 10.12 on Intel and 11 on ARM, below the application's overall macOS 13 minimum.
- Existing Intel launch was confirmed by the user for the previous preview; the new browser login still needs user-account validation. The new preview remains ad-hoc signed without Apple notarization; the prepared Developer ID workflow has no configured Apple credentials.

# Cypher 0.5.1-mac.1 - macOS preview verification on October 27, 2026

- [Separate Mac release](https://github.com/A-Arnaud/Cypher/releases/tag/v0.5.1-mac.1): DMG and ZIP downloads for Apple Silicon and Intel, plus a SHA-256 manifest per architecture. Windows 0.5.0 remains the stable release.
- [Validated Mac build](https://github.com/A-Arnaud/Cypher/actions/runs/40421949738), source d8e7161: macOS 15 Apple Silicon and Intel each passed TypeScript, 65 unit/subprocess tests (one Windows-only test skipped), source/history publication scans, native Electron menu bar docking/hide/restore in English and French, final packaged-app signature/launch checks and archive scans.
- [Windows regression build for the same application source](https://github.com/A-Arnaud/Cypher/actions/runs/40421949785): full Windows CI passed, including UI, native notification-area checks, clean-machine startup, corners, executable icons, packaging and production security checks. This is Windows Server automation, not Windows 11 device certification.
- Downloaded Mac artifacts were checked against their CI SHA-256 manifests before publication. Both releases retain their own files and checksums; the Windows executables were not rebuilt or replaced for the Mac release.
- The Mac preview is ad-hoc signed without Apple Developer ID, notarization or hardened runtime. Physical-device, notch/full-screen, live-account and manual login-item behavior remain unverified. See [MACOS.md](MACOS.md).
- Subsequent integration changes adjust PR ad-hoc signing and wait for native macOS activation in the smoke test. Application source and published binaries remain those of the validated release commit above.

# Cypher 0.5.0 — Windows 10/11 verification on October 26, 2026

Current evidence and exact limitations: [Windows 10/11 verification record](docs/windows-10-11-verification-2026-10-26.md).

- Local Windows 10 x64: 132 unit tests / 26 files, 16 Edge UI scenarios, TypeScript and the real Electron notification-area smoke passed. Separate packaged first-run (12 checks), native-window corners (4 checks), production security, artifact/secret scans, executable icons and x64 packaging passed.
- Windows 11 selects the native notification-area backend rather than legacy Explorer embedding. OS-selection and UI fixtures are tested; **a real Windows 11 device remains untested**. CI Windows Server is not Windows 11 desktop validation.
- No real provider account, Windows restart, user-installation replacement or live-user taskbar manipulation was performed. Executables are unsigned. Historical records below retain their original dates and scope.

# Cypher 0.4.8 — verification on October 25, 2026

- `npm run typecheck`: passed. `npm test`: 107 tests passed across 22 files. `npm run test:ui`: 14 Edge flows passed, including recovery from a loading error, delayed initial response, amounts and currencies, actual quota durations, and keyboard shortcut editing.
- `npm run build:test`: separate test executable built. `npm run test:clean-machine`: 12 checks passed through packaged Electron, with an empty home, real IPC, and Windows DPAPI encryption. Seven connectors use exclusively synthetic HTTP responses. Replacing a key with a 429 error retains no balance from the previous account. An occupied shortcut is rejected without losing the active combination or saved preference.
- `npm run test:corners`: four checks passed for the Windows region, transparent corner pixels, opaque interior, and view/opacity transitions.
- `npm audit --json`: zero vulnerabilities reported at the time of the check. `npm run security:secrets`: Gitleaks finds no secrets in public files or the 16 commits examined.
- `npm run dist`: 0.4.8 installer and portable created. `npm run security:release`: Electron protections, CSP, archive, and publication scan passed. `node scripts/smoke-production-security.cjs`: the real production binary starts in an empty profile, rejects Node injection, and opens no debugging port.
- Native screenshots inspected: [API cards](docs/screenshots/api-details-synthetic.png) and [small widget](docs/screenshots/api-widget-synthetic.png). Balances and points in these images are synthetic data. Latest local test directory: `C:/Users/Administrator/AppData/Local/Temp/cypher-clean-machine-6OeD2O`.
- Deliverables: `release/Cypher-Setup-0.4.8-win-x64.exe`, `release/Cypher-0.4.8-win-x64.exe`. SHA256 hashes in `release/SHA256SUMS-0.4.8.txt`.

These tests ran on Windows 10 x64. No user account was authorized, no real remote quota was verified, and the installed application currently in use was not replaced. Connector limitations remain those in [SUPPORT.md](SUPPORT.md). Executables remain unsigned; Windows 11, an actual Windows restart, and special taskbar configurations were not revalidated here.

# Security review 0.4.6

Current protections and results are described in [the October 24, 2026 review](docs/security-review-2026-10-24.md), [SECURITY.md](SECURITY.md), and [PRIVACY.md](PRIVACY.md). The paragraphs below preserve the history of previous versions.

# Real-world verification — 2026-10-24

## Cypher 0.4.1 — taskbar logos

- The O/C/G initials are replaced with Codex/Claude/Gemini logos, local images embedded in the native helper. LobeHub artwork under MIT, license distributed; no network loading at runtime. Same 216px reservation and click actions. Percentage, unknown dash, and +N counter retained.
- RED test: logos absent from build. GREEN: pixel comparison of the real WinForms rendering with reference images, three providers recognized (mean errors 10.07/17.97/20.69 below threshold 22). Synthetic 216x40 screenshot cypher-taskbar-logos.png inspected; logos/percentages/+2 legible. Screenshot taken through PrintWindow of the native surface; a desktop screenshot could show the background when the taskbar was hidden/covered, which was not a product rendering failure.
- npm test 75/75, typecheck, 6 UI tests, and npm run dist passed. Packaged smoke: 7 checks green, C:/Users/Administrator/AppData/Local/hermes/cache/scratch/cypher-taskbar-smoke-SDOoi9/report.json. Click, helper recovery, and retained mode unchanged. No new actual reboot test.
- Old portable instance exited through its Quit button, then portable version 0.4.1 relaunched normally with its existing settings. Active new helper verified by SHA256 comparison with the compiled 0.4.1 helper, not merely by process presence. No account settings or consent changed by this operation.
- Installer release/Cypher-Setup-0.4.1-win-x64.exe: 114577536 bytes, SHA256 b67784364cb0ddbb0b65cc98d77f023b44005f651edb3f9117b224cf61aef1b6.
- Portable release/Cypher-0.4.1-win-x64.exe: 114388907 bytes, SHA256 d323732019d036e0dcce4008c9f935adbe96537071cd57973bcc954d12273ba2.

## Cypher 0.4.0 — Windows taskbar

- 75 unit/subprocess tests and typecheck passed; 6 Edge UI flows passed. Per-user NSIS installer and portable 0.4.0 built unsigned; npm audit reported zero vulnerabilities when the lockfile was updated.
- Real Windows 10 evidence: the indicator's GetParent belongs to Shell_TrayWnd; ReBarWindow32 and MSTaskSwWClass reduced; weather/notifications unchanged; width <=220 logical pixels; helper DPI context equals Explorer's after SetParent. Win32 click received; Explorer layout recalculation; geometry restored on normal exit, forced termination, and EOF. Report C:/Users/Administrator/AppData/Local/hermes/cache/scratch/cypher-taskbar-native-report.json. Synthetic screenshot cypher-taskbar-native.png inspected: 75%/24%/dash/+2 are test data, not user quotas.
- Real installed smoke: 9 checks passed, report C:/Users/Administrator/AppData/Local/hermes/cache/scratch/cypher-taskbar-smoke-jd6v9c/report.json. First detailed opening; docking button; preferences file; native click opens details; hiding retains indicator; helper killed -> fallback window then reattachment; relaunch with --cypher-startup without main window; removal; independent startup disabled. Test without authorized accounts, with the Windows test entry removed afterward and its absence read back.
- Test installation path: C:/Users/Administrator/AppData/Local/hermes/cache/scratch/cypher-taskbar-installed. Startup was verified through the exact HKCU Run command and approved Windows entry. On this Electron 45, getLoginItemSettings returns args=[] and openAtLogin=false despite the correct Run value; this assumption was reproduced. Product verification therefore reads only the Cypher command through the native helper and cross-checks the path and enabled returned by Electron. Unit regression RED→GREEN.
- The helper must be outside ASAR: an initial packaged smoke failed; asarUnpack and the explicit path were corrected, and a new packaged smoke passed. The UI test used a Windows-reserved port (5173), replaced with configurable port 15173 and relative URLs. Electron waits use wait-state.cjs; async browser predicates are unreliable in this environment.
- Real fallback test passed: helper absent at launch with saved docked mode -> details visible and error; non-boolean taskbar IPC rejected. Scratch report cypher-taskbar-failure-KmyNT1.
- Pre-existing packaged regressions: 18 smoke checks green, including drag/order, opacity/alpha255, and twenty entries without scrolling (quota-glass-smoke-1792847436116/report.json). Packaged synthetic CLI login green: qg-native-login-fixture-yk9YwC, no real account connected.
- Limitations: no actual PC reboot or forced Explorer shutdown; no global DPI, theme, auto-hide, or full-screen change tested; secondary/vertical taskbars and Windows 11 not certified. Inheriting the Windows parent's visibility is not a manual test of all these configurations. No user server quota verified. Final independent review performed: two important defects reproduced, then fixed with RED→GREEN tests. Helper loss during configuration/save/shutdown: transaction invalidated, previous state restored, never a false ready/hide; permanent recovery failure leaves details visible. NSIS reinstallation: preserve Run during --updated, remove only on actual uninstallation. Real installed test initially red (Run command deleted), then green after rebuilding; new full installation also green across 9 checks. Final reinstallation test: cypher-update-data-nT9Fj7; actual uninstallation verified and test entry absent afterward. No second reviewer: fixes verified by regressions and full suite 75/75, typecheck, 6 UI tests.

- Final installer: release/Cypher-Setup-0.4.0-win-x64.exe, 114514398 bytes, SHA256 dc22e98f1b995e460887e8cd3bcead1ac4808fdf9e940388c400b87790a76bfe.
- Final portable: release/Cypher-0.4.0-win-x64.exe, 114325778 bytes, SHA256 8efbba5b8cbf4ae4e47275c9c8acd396e8bc4b505ce9a4a2b5828b2c51cc3e35.
- Scratch installations and their startup entries were removed after testing; no user autostart left active. The user must install the final deliverable to enable it. The repository remains uncommitted on feat/quota-glass.

## Cypher 0.3.0 — summary, free ordering, and full opacity

- 49 unit/subprocess tests, 4 Edge UI flows, and typecheck passed; portable build passed; npm audit reported zero vulnerabilities.
- Summary by default, pointer-capture drag handles, HTML5 row bodies, and up/down keyboard controls; order shared with detailed cards. IPC moves are serialized from the current order.
- Native smoke on compiled code, then two consecutive successful runs on the packaged binary: 18 checks each. Order actually moved to Claude, Gemini, Codex and read back from isolated preferences. Small 380 × 264 window for three profiles; expanded details and return verified. Twenty selected catalog entries fit without scrolling in the adaptive native layout, screenshot inspected; this test does not claim twenty connected accounts.
- At 100%, native opacity 1 and interior alpha of transparent-background PNG equal to 255; opaque CSS background and native material none. 55% preview, 68% preference, and rejection of 0% retained.
- Packaged reports: C:/Users/Administrator/AppData/Local/hermes/cache/scratch/quota-glass-smoke-1792791818281/report.json and quota-glass-smoke-1792791822811/report.json. Screenshots widget.png, summary-many.png, settings.png, connections.png in these directories.
- Packaged connection button retested with synthetic CLIs and identities only: correct profile terminal, individual consent, synthetic collection, deduplication, and independent revocation passed. Directory qg-native-login-fixture-UctWeZ. Separate WindowsHide and Unicode transport tests also passed.
- A packaged native HTML5 drag was intermittent; the handle now uses pointer events with capture, verified in both packaged runs. A pause assertion read before asynchronous saving: the smoke now waits for real IPC state without repeating the click.
- Portable release/Cypher-0.3.0-win-x64.exe: 102434775 bytes; SHA256 b5f57c8b6e8b625710d63c250b9f522653d8a47f8e207990fef64da2ca77b8dd. Unsigned. No real user account quota verified; provider limitations unchanged. Final focused review completed without a demonstrated important bug; 12 additional targeted tests passed. Report read: C:/Users/Administrator/AppData/Local/hermes/cache/scratch/cypher-compact-review.md. Previous native tests remain those performed by the parent; the reviewer did not reproduce them.

## Cypher 0.2.0 — name, logo, opacity, and unobtrusive workers

- 44 unit/subprocess tests, 2 Edge UI tests, and typecheck passed; npm audit reported zero vulnerabilities.
- Original SVG D:/Projets/icon.svg preserved byte for byte (SHA256 comparison passed), PNG and multi-resolution ICO generated; Cypher name and logo inspected in a real screenshot.
- Native opacity: 55% preview without saving, 68% save, rejection of invisible 0%, and persistence checked through the actual packaged BrowserWindow. Keyboard UI slider tested, FR/EN retained.
- Codex npm launches a native child without windowsHide: installed source checked. The product now resolves this native binary directly and preloads a guard only for the remaining Node reader CLIs.
- Test of an actual native ChildProcess for a synthetic CLI grandchild: control windowsHide=false; corrected worker windowsHide=true, environment and options retained. No fabricated quota result used as user data. This verifies effective Windows options, not an exhaustive observation of every third-party CLI.
- Explicit login separated: Windows terminal through start /wait; all paths pass through the native Unicode environment and the batch remains ASCII. Native test passed with profil-équipe-日本 & 50%! and a neutral Unicode workspace. No real login.
- Previous review I1 Unicode fixed by this transport (the chcp attempt did not work with the console-less starter). I2 fixed by RescanQueue and a fresh request after registry mutations; in-flight collection regression covered. CLI replacement action accessible after detection (previous minor M1).
- Packaged Cypher smoke: 13 checks passed, report C:/Users/Administrator/AppData/Local/hermes/cache/scratch/quota-glass-smoke-1792787656189/report.json. Full synthetic packaged IPC login also passed, directory qg-native-login-fixture-Tc9mG7.
- Executable release/Cypher-0.2.0-win-x64.exe: 102433204 bytes; SHA256 acd097c006d409deb7f5278aac5a26c88121b69b963ec5c96df9b09957cf7d42. Unsigned.
- Historical preferences and profiles remain in place; folder selection helper tested. No real server quota or human session verified through automation. Claude/Gemini retain their documented limitations.
- Final focused review completed: no critical or important issue demonstrated. The reviewer reran 44 tests, 2 UI tests, typecheck/build, and Unicode/concurrency probes successfully, without a real account. Report: C:/Users/Administrator/AppData/Local/hermes/cache/scratch/cypher-final-review.md. That report's M1 reservation rejected after verification: Connections.tsx:18 does offer Choose / replace CLI when executable is present; the UI test checks this case. No code change needed on this point. Real quota verification limitations remain unchanged.

## Multi-profile and terminal login update

- 38 unit/subprocess tests passed; typecheck passed; 2 Edge UI flows passed; npm audit reported zero vulnerabilities.
- Real Windows discovery: default Codex profiles, .codex-compte1, and .codex-compte2 recognized with distinct IDs. Configuration presence only: no real account queried.
- Packaged native smoke: 12 checks passed, report C:/Users/Administrator/AppData/Local/hermes/cache/scratch/quota-glass-smoke-1792785673554/report.json. Separate test shortcut to avoid taking another instance's shortcut.
- Login button tested through real IPC and Windows terminal in the packaged application, with a synthetic CLI and test folders only: selected profile passed through, permission for that profile only, synthetic metrics read, identity deduplication, and independent revocation verified. Test scripts/test-native-login.cjs, directory C:/Users/Administrator/AppData/Local/hermes/cache/scratch/qg-native-login-fixture-lA8k5M. These metrics are not user quotas.
- Separate Windows console test: spaces, &, %, and ! in paths preserved. No AI prompt or real login during checks.
- In the Playwright installed here, waitForFunction(async()=>false) resolved prematurely (Edge reproduction). Native waits now use Node polling of actually resolved IPC; checks rerun with this mechanism.
- Initial packaging blocked by the old running application. Old widget process closed, terminals/accounts unchanged; rebuild passed.
- Executable updated at the same location: release/Quota-Glass-0.1.0-win-x64.exe, 102362381 bytes, SHA256 f74b6ddb3784d10d062b20329753026d6801457b2d2541cacdca2cc823f966c2.
- No real server quota or user OAuth login verified. Claude and Gemini retain their quota-reading limitations. Independent review of the extension in progress before closure.

## Initial delivery history

- Windows 10 x64, Node 24.19.0, Electron 45.0.0.
- `npm test`: 28 unit and subprocess tests, all passed.
- `npm run typecheck`: passed.
- `npm run test:ui`: 1 real Microsoft Edge scenario passed, honest empty state, persisted language, and planned provider unavailable for connection.
- `npm audit` and `npm audit --omit=dev`: zero vulnerabilities reported at the time of the check.
- `npm run dist`: unsigned portable executable built, dedicated icon applied.
- Native development and packaged executable smoke: 10 checks passed (local discovery, sandbox, registered shortcut, pause, FR/EN language, invalid IPC rejected, connections without enabling consent, hide-on-close/reopen, actual shutdown, and persistence).
- Latest packaged native report: C:/Users/Administrator/AppData/Local/hermes/cache/scratch/quota-glass-smoke-1792782484361/report.json.
- Real detection on this machine: Codex, Claude Code, Gemini CLI, OpenCode, Aider, LM Studio. No premium account inferred from this detection.
- Final portable executable launched normally and captured through the Windows interface. The Hide button made the window invisible (IsWindowVisible false). Ctrl+Alt+Q sent to the system made it visible (IsWindowVisible true). This was more than a theoretical shortcut registration.
- The self-extracting portable launcher cannot be controlled directly by the Playwright debugger: attempt timed out. Verified alternative: automated tests on win-unpacked + normal portable launch + native capture/interaction. This timeout is not a successful test.
- Packaged application screenshots in docs/screenshots/: widget.png, settings.png, connections.png. Smoked-glass reference and Windows 10 fallback visually inspected; content scrolls when it exceeds the window.

## Limitations that must not be mistaken for successes

No authenticated account access enabled by tests. No real server quota verified. The Codex subprocess test uses a synthetic account only in tests/cli.test.ts; it verifies initialize/account/read/account/rateLimits/read exchanges, not the user's subscription.
Codex: quota connector implemented, to be authorized then verified with the user's account. Claude: account/plan only; Gemini and most of the catalog: no operational quota. Local engine inventory not verified against a running server.
Notification icon created without error; tray menu click not automated on the portable. Threshold notifications tested in logic, but no real notification triggered to avoid inventing a quota.
Windows startup disabled, one active identity per CLI, no API key input, no code signature.

Independent review performed. Three important regressions reproduced, then fixed with RED→GREEN tests: out-of-range quota dates, permission restored by concurrent updates, and stale values lost when recreating the poller. Final suite: 28 tests passed and packaged smoke passed. Minor items deferred: restart required to discover a tool installed after launch; individual read time on cards; clarification of the Quit cross versus native hide-on-close. VERIFICATION.md, absent from the reviewed commit, is now tracked. No real server quota verified.

# Addendum — distribution 0.4.5

TypeScript checking and 88 unit tests pass. All nine browser tests pass, including masked key input, removal from the form after submission, points display without a fabricated percentage, and disconnection. API tests use synthetic responses without real account keys.

`npm run test:clean-machine` checks the packaged executable with an empty home containing spaces, no CLIs or Node in PATH, and no inherited permissions. It exercises seven API connectors with simulated HTTP responses, real IPC, real Windows DPAPI encryption, and key deletion. This test does not certify other machines, Windows 11, proxies, or these providers' accounts.

The goal of covering all 36 services remains in progress: see [the catalog matrix](docs/catalog-coverage.md). Services without a connector are not advertised as connected and have a link to their official dashboard. The delivered version targets Windows x64.

# Window corners — 0.4.7

The Windows window region uses the same rounding as the interface: 26 px in the large view and 18 px in the small widget. The implicit dark canvas background and outer CSS shadow are removed in the native application. All nine interface tests pass. The `npm run test:corners` test checks the Windows region, four transparent corner pixels, opaque interior, and transitions between large view/small widget/65% opacity. Verified here on Windows 10 x64.
