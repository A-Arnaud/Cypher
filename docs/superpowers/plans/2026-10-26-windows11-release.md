# Cypher Windows 10/11 Release Implementation Plan

> For agentic workers: use superpowers:executing-plans for parent integration and a scoped implementation worker for task 1. User requested autonomous maximum progress without a Windows 11 test machine.

**Goal:** ship a tested common Windows x64 build with safe Windows 11 behavior and accurate GitHub documentation.
**Architecture:** preserve Windows 10 embedded native taskbar helper; use Electron native notification-area integration on Windows 11 rather than manipulating unsupported Explorer internals. Both use the existing transactional Docking lifecycle, and the desktop widget remains available. Never claim real Windows 11 validation.
**Tech Stack:** Electron 45, React 19, TypeScript, C# WinForms helper, Vitest, Playwright, electron-builder/NSIS.
**Spec:** user request and design below; no website/mobile work.

## Design / approaches
- Chosen autonomously after 'fait le maximum': one installer for Windows 10/11 x64, Windows 10 taskbar unchanged, Windows 11 system tray quota tooltip/menu and widget fallback. Safer than an untested taskbar overlay that steals taskbar space.
- Rejected: merely change badges while leaving taskbar failure loops; pretend GitHub Server runners prove Windows 11 UI; separate installers with identical app code.
- Preserve visual identity, provider semantics, credentials and consent. No real provider calls or account login tests. Do not replace running user app.
- Next version 0.5.0 for Windows 11 behavior. Package supported dependency upgrades only after inspecting existing PRs and registry, retain lockfile.

## Global Constraints
- Worktree only: .local-builds/windows11-release, branch feat/windows11-release from 7a6f4fb.
- No mobile or Lovable changes, no real user-data mutation.
- Win10 native helper must not be launched as taskbar strategy for Win11/unknown Windows shells.
- Native tray is not an embedded text quota indicator: UI/docs state the difference honestly.
- Build unsigned installer + portable with --publish never, SHA256 manifest, security and production smoke checks.
- Existing PRs are read/reviewed before use; do not merge unrelated/WIP changes.
- External publication requires real build/security evidence; Windows 11 remains untested on device, not falsely certified.

## Review Focus
- Persisted taskbarMode on Win11: usable tray ready, not repeated native helper failure/hide loop.
- No quota, stale/unknown or duplicate snapshots: same semantics; no token/account data in tray.
- Tray teardown/re-enable and app close: no hidden inaccessible app; show/quit actions retained.
- Dependency/build updates: no accidental upload through electron-builder; artifacts and tag match source version.
- Documentation must distinguish real Win10 tests, simulated Win11 strategy tests, Server CI, and missing physical Win11 acceptance.

## Task 1: Safe Windows strategy and tray indicator
Files: src/main/index.ts, new src/main/windows-platform.ts (+ unit test), new tray indicator host module (+ unit test), shared/model.ts, renderer App/SummaryWidget and i18n as needed, UI tests.
- [ ] Write failing classification tests for win32 release10.0.19045 vs10.0.22000/22631/26100, invalid/unrecognized release and nonwin32. Prefer tray for unknown Windows rather than injecting legacy shell.
- [ ] Write failing host lifecycle tests for start/ready/render/stop and bounded quota tooltip/menu (unknown/stale/extra count), preserving show/quit and polling actions.
- [ ] Implement OS-dependent strategy using real os.release() outside tests. Never allow renderer to select OS or native helper path.
- [ ] Wire optional taskbar presentation capability into AppState and localized labels; default preview/test fixtures keep current Win10 UI unless capability specified.
- [ ] Preserve Docking transactions and startup semantics. Adapt tray menu only while tray quota mode active; use existing safe TaskbarItem output.
- [ ] Run targeted tests then complete npm test/typecheck/test:ui. Add browser UI scenario for Win11 label and safe fallback.

## Task 2: Dependencies, CI, and documentation
Files: package.json/package-lock.json, .github/workflows/security.yml, README.md, SUPPORT.md, CHANGELOG.md, VERIFICATION.md, relevant contribution/release docs.
- [ ] Inspect PR1-5, current main and npm outdated/audit. Apply only justified supported upgrades and pin Actions revisions verified upstream.
- [ ] Version0.5.0. Improve compatibility table/install instructions/troubleshooting without replacing brand assets.
- [ ] Clearly label hosted runner OS and never represent Windows Server as Win11 desktop testing.
- [ ] Update GitHub project metadata if needed; no deletion or wholesale rewrite of issues/PRs.

## Task 3: Verify and deliver
- [ ] Run npm test, typecheck, test:ui, audit, security scan and secrets scan with real outputs.
- [ ] Build test binary; run isolated clean-machine/corners/Win11 strategy integration and Win10 taskbar tests without altering live user settings. If existing app owns native mutex, report or use isolated noninterfering tests; do not terminate it without authorization.
- [ ] npm run dist -- --publish never, production security smoke, artifact publication checks and icons.
- [ ] Compute SHA256 from final executables. Record exact commands/results and unresolved issues in VERIFICATION.md. Rebuild when packaged source changed.
- [ ] Independent whole-diff review, fix important issues with regressions, rerun affected full checks.
- [ ] Commit/push branch and create PR with evidence. Prepare GitHub prerelease/draft with installer+portable+hashes: disclose Windows11 device unverified. Do not call stable Win11 certified.

## Ledger
- Baseline7a6f4fb; original checkout clean. Worktree isolated; npm ci complete; baseline108tests/22files passed.
- Ruling: no Win11 device -> ship safe native notification-area path and label device validation pending; cost: no persistent inline quota text on Win11.
