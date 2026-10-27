# Implementation notes — Cypher 0.8.0

Current behavior is described in the [user guide](user-guide.md), [connection methods](connection-methods.md) and [provider matrix](catalog-coverage.md). Dated plans and verification records describe the version tested at that time; they are not the current feature specification.

## Indicator lifecycle

Indicator preference defaults to enabled. Legacy false values without the completed-activation marker migrate to true; explicit removals are preserved. Native initialization precedes renderer loading. Manual opening still shows the window, while login opening stays hidden. Login never overwrites a saved opt-out. Settings uses the same trusted boolean-validated lifecycle IPC with minimize=false; only explicit minimize actions hide after readiness. Startup registration remains independent.

## Processes and data

Quick actions are renderer-local navigation over fixed callbacks; search never executes an arbitrary command or launches a login. The shared `health.ts` model derives actionable status from successful metric times, actual auth/consent/errors, connector support and configured quota thresholds. A visible-window clock ages readings without network polling; paused, missing and limited readings stay distinct. The same model feeds the overview filter and diagnostics.

`diagnosticReport` uses an explicit field allowlist and the `cypher.diagnostics/v1` schema. Trusted-sender IPC returns a local report or generates/copies a fresh one only on request. It never exports raw state, profile/account identifiers, paths, keys, quota amounts, errors or logs. Native IPC tests intercept the clipboard and reject a second window. [User guide](navigation-and-diagnostics.md).

| Area | Responsibility |
| --- | --- |
| [Main process](../src/main/index.ts) | Application lifecycle, native window/menu integration, IPC verification and service coordination |
| [Renderer](../src/renderer/App.tsx) | React compact/detailed views, explicit connection consent, settings and labelled bar controls |
| [Preload](../src/preload/index.ts) | Narrow typed IPC bridge; no arbitrary filesystem, shell or credential access |
| [Accounts](../src/main/accounts.ts) | Independent CLI/browser profiles, discovery, login and read authorization |
| [Credentials](../src/main/credentials.ts) | Explicit API keys encrypted with safeStorage and bound to a provider |
| [Poller](../src/main/poller.ts) | Collection scheduling, pause, refresh, backoff and alert state |

Preferences, registry and account profiles live outside the application archive. Existing `Quota Glass` / `quota-glass` user-data directories are retained. New profiles default to English; saved language, consent and profile order are preserved. API keys use Windows DPAPI or macOS Keychain protection. See [Privacy](../PRIVACY.md) for exact local data and destinations.

## Platform presentation

- **Windows 10:** the [native helper](../native/taskbar/Program.cs) embeds the quota indicator in a supported horizontal primary taskbar. Unsupported shells use the independent notification-area backend.
- **Windows 11:** the [tray host](../src/main/tray-host.ts) supplies native tooltip/menu readings. It does not embed text in the Windows 11 taskbar or modify Explorer.
- **Mac:** the packaged app declares `LSUIElement=true` and retains accessory activation. A top-right menu icon remains available while its window is open or hidden. Reopening the window does not promote the app back to the Dock.

The [docking controller](../src/main/docking.ts) confirms the indicator is ready before hiding the window and reveals the window on failure. It does not register automatic startup. The [close controller](../src/main/window-close.ts) serializes native/renderer close requests and offers Minimize, Quit and Cancel. Explicit menu Quit exits directly.

## Optional startup

The [startup adapters](../src/main/startup.ts) register only after a user's Settings change. Windows verifies the stable executable, exact `--cypher-startup` command and OS-enabled state; portable extraction paths are ineligible. Mac uses native `mainAppService` registration for the app in Applications and distinguishes pending OS approval from enabled startup.

Login launches restore the indicator without showing the window, including when the saved indicator mode was off. Mac login detection also uses native `wasOpenedAtLogin` without Windows arguments. Manual opening restores the window. The current Mac build remains ad-hoc signed; registration failures and approval requirements are surfaced rather than silently treated as enabled startup.

## Connections and provider boundaries

Automatic profile detection comes first. Codex browser sign-in uses an included, pinned official authentication/account component on Windows and Mac, with a profile-specific environment and external system browser. A separately installed Codex CLI is optional. Completion alone grants the new profile's read permission; cancellation/failure does not fabricate a connected account.

Existing CLI login, independent accounts, executable selection, profile import and supported API-key alternatives remain available. Claude/Gemini CLI sign-in does not establish implemented subscription quota reads. API spending/balances and chat subscriptions remain distinct. Readers send no generation prompts; missing metrics remain unknown.

## Build and verification

The [update controller](../src/main/update-controller.ts) schedules quiet stable-release checks, coalesces requests, requires native user consent and persists only short deferrals. The [release reader](../src/main/update-release.ts) bounds metadata and validates fixed HTTPS hosts, package names, architecture, monotonic package versions and GitHub digests. The [Windows adapter](../src/main/update-windows.ts) uses pinned electron-updater 6.8.12 NSIS downloads with a fixed accepted asset, full SHA-512/SHA-256 verification, no staged-rollout identifier and no install-on-quit hook. Main lifecycle cleanup runs before its explicit installer handoff. Mac/portable/extracted-copy download paths remain manual. [Update guide](updates.md).

The build bundles renderer/main/preload separately, copies only allowlisted assets and the matching native Codex component, and compiles the Windows helper only on Windows. Mac Intel and Apple Silicon packaging run on separate matching hosts; cross-architecture components are rejected.

The [Windows workflow](../.github/workflows/security.yml) and [Mac workflow](../.github/workflows/macos.yml) cover unit/native lifecycle checks, isolated account-free component probes, final packages and publication scans. Mac checks include Dock visibility through menu restoration and Settings input, plus the final plist and native process activation policy. Windows checks include sandbox/IPC, DPAPI, icons and production protections.

Tests use isolated profiles and synthetic provider responses. They do not constitute real-account login validation, a physical reboot or Windows 11 device certification. Native Windows taskbar manipulation must not run against an uncoordinated user session. [Exact release evidence](../VERIFICATION.md) · [Contributor commands](../CONTRIBUTING.md) · [Security](../SECURITY.md).
