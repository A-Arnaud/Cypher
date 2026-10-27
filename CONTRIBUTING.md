# Contributing to Cypher

Start with [README.md](README.md) for product behavior and [implementation notes](docs/IMPLEMENTATION-NOTES.md) for architecture. Keep changes focused and describe what a person can actually do after the change. Use English for issues and pull requests where possible.

## Set up a checkout

For **macOS**, use Node.js 24, npm and Git, then follow the [Mac development commands](MACOS.md#verification-and-builds). Use `npm run test:mac` for the portable core and Mac subprocess tests, and `npm run dist:mac` on a Mac for DMG/ZIP builds. The native Windows helper is skipped on macOS. The Windows fixture suite uses Windows paths and launchers and should run on Windows.

Use Windows x64, Node.js 24 with npm, Git, and Microsoft Edge for browser tests. Building the native taskbar helper requires the Windows .NET Framework 4.x C# compiler at `%WINDIR%\Microsoft.NET\Framework64\v4.0.30319\csc.exe`. The build invokes it automatically.

To run a checkout in PowerShell:

```powershell
git clone https://github.com/A-Arnaud/Cypher.git
cd Cypher
npm ci
npm run dev
```

Stop the development process with Ctrl+C. Use synthetic profiles and responses while developing; real provider access is not needed for the fixture-based tests.

For a contribution, fork the repository and clone your fork instead. Create a branch with `git switch -c describe-your-change`, make one focused change, then open a pull request against `A-Arnaud/Cypher`'s `main` branch. Documentation fixes, reproducible Windows reports and synthetic provider fixtures are useful starting points. A provider request is a request for research, not a support commitment.

## Check your change

Run these from the repository root:

```powershell
npm run typecheck
npm test
npm run test:ui
npm run build
npm run security:scan
npm run security:secrets
```

`test:ui` uses installed Microsoft Edge. `security:secrets` downloads a pinned Gitleaks scanner on first use and scans Git history and publishable files; its reports stay local. Changes to packaging or security also require the packaged checks in [SECURITY.md](SECURITY.md), including `npm run build:test`, `npm run test:clean-machine`, `npm run dist -- --publish never` and `npm run security:release`. For updater changes, also run `node scripts/test-update-download.cjs` (isolated synthetic HTTP downloads; never executes an installer) and `node scripts/check-update-metadata.cjs` after building the Windows installer. Keep the limitations in [the update guide](docs/updates.md) accurate. The test build is not a release artifact. Native taskbar tests must run sequentially because they change the same Explorer surface. Never run them against a user session without coordinating first. Do not terminate a running user instance to make a test pass.

### Windows 10 / Windows 11 verification

The release has one x64 package and selects an embedded Windows 10 taskbar backend or a Windows 11 notification-area backend at runtime. Test the platform policy with injected release strings, the notification-area host lifecycle with synthetic summaries and the FR/EN controls in both widget views. Also test restoring saved taskbar mode after an upgrade. Keep the startup registry-query helper available even when legacy taskbar embedding is unsupported.

GitHub Actions uses `windows-2025` (Windows Server), records the actual host version and retains validated executables/checksums as short-lived artifacts. Those checks are not Windows 11 Explorer testing. Device acceptance on Windows 11 must separately verify launch, minimize/restore, tray tooltip/menu, display scaling, startup and cleanup; record build numbers and untested cases. Never relabel mocked Windows versions as real device validation.

### Mac verification

After `npm run build`, run `node scripts/smoke-mac.cjs`, `node scripts/test-mac-menu-only.cjs`, `node scripts/test-window-close.cjs` and `node scripts/test-startup-launch.cjs` on a Mac. These use isolated data, check the actual Dock/menu/window lifecycle and forbid startup registration in the launch scenarios. Browser UI tests use installed Microsoft Edge; `test:mac` does not require it.

The Mac workflow builds on separate Intel and Apple Silicon runners. It checks the final signed bundle's `LSUIElement` flag and native accessory activation policy as well as launch, connector architecture and publication scans. Keep startup optional in Settings, surface native approval/readback failures, and never restore regular Dock activation merely to reopen a window. Mac notarization and live login-session validation remain separate checks.

## Provider changes

Use synthetic fixtures. Never commit real credentials, account profiles, browser cookies, diagnostic captures or personal settings. Keep missing, stale and zero-valued data distinct. Do not infer a paid plan from tool installation or present simulated responses as live-provider verification.

Preserve saved language and legacy data-location compatibility. English is the default for new profiles; French remains an optional localization.

## Reviews and reports

Check existing issues before opening a bug, feature or provider request through the [issue chooser](https://github.com/A-Arnaud/Cypher/issues/new/choose). See [SUPPORT.md](SUPPORT.md) for help and [SECURITY.md](SECURITY.md) for security concerns.

For a pull request, explain the problem, the resulting behavior, and the checks actually run (with any skipped checks and their reason). Include sanitized before/after screenshots for visible changes when useful. Keep historical verification notes dated and scoped. A provider catalog entry is not proof of working quota support: distinguish implemented, partial, planned and discovery-only behavior using the [coverage matrix](docs/catalog-coverage.md).

**Never attach API keys, CLI credentials, cookies or private account data** to issues or pull requests. Review logs and screenshots before sharing them; do not upload account files, personal settings or raw diagnostic captures. Report security concerns as described in [SECURITY.md](SECURITY.md).
