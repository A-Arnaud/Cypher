# Multi-profile Login Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans task-by-task. Steps use checkbox syntax.

**Goal:** Discover multiple CLI profiles and provide safe visible terminal login without overwriting other accounts.
**Architecture:** Main-only registry owns canonical profile roots and executable overrides. Public profile IDs join sanitized snapshots, settings and React cards. CLI children receive scoped environment overrides; login uses a generated fixed-command wrapper, not renderer shell strings.
**Tech Stack:** Existing Electron/TypeScript/React/Vitest/Playwright stack.
**Spec:** docs/superpowers/specs/2026-10-23-multi-profile-login-design.md

## Global Constraints
Windows 10/11, FR/EN, no credential copying or browser cookies, no account login in automated verification, no generated inference prompts, no global environment mutations. Existing CLI sessions and profiles untouched unless user explicitly logs into that selected profile. Legacy consent applies to default profile only.

## Review Focus
- Two profiles must have distinct IDs and CODEX_HOME scoped per child: tests/profiles.test.ts and tests/cli.test.ts.
- A directory is not a verified account: discovery tests and UI unknown labels.
- Paths with &, %, ! or spaces cannot inject shell commands: tests/login.test.ts and synthetic native console check.
- Revocation must not expose prior snapshot or propagate to another account: settings/provider snapshot tests.
- Gemini override is a home containing .gemini, not the config folder: profile tests.

### Task 1: Profile registry and persistence
Files src/main/profiles.ts, src/shared/model.ts, src/main/settings.ts, tests/profiles.test.ts.
Interfaces Profile {id,providerId,label,configPresent,authFilePresent}; ProfileRecord additionally root/directory/env, never exposed. discoverProfiles(env,registered): Promise<ProfileRecord[]>; publicProfiles(records):Profile[]. Store native-selected roots/executable overrides under registry.json in app data, validate on load. No secret file content reads.
- [ ] Write failing filesystem tests for arbitrary profile suffixes, canonical dedup, env override, default profile without auth and Gemini home semantics. Run red.
- [ ] Implement registry with bounded direct-child scan, stable hashed IDs and no discovery-time mkdir. Settings allow only known-safe ID format, no path from IPC. Run green and existing suite.

### Task 2: Isolated collectors and identity
Files src/main/cli.ts, providers.ts, shared/model.ts, tests/cli.test.ts, providers.test.ts.
Interfaces codexStatus(executable,signal,profileEnv?) and claudeStatus equivalent. collectProfile(ProfileRecord,Context,signal) returns snapshot whose id is profile ID and providerId is catalog ID. Context optional records for compatibility. dedupeSnapshots marks duplicateOf only for matching hashed server identity.
- [ ] Failing tests synthetic CLI sees selected root in child environment; parent env unchanged; non-default consent never inherited; known account ID duplicate identity recognized without matching email alone.
- [ ] Implement environment allowlist and profile-aware dispatch; no login starts during collection. Run full suite green.

### Task 3: Safe login launcher
Files src/main/login.ts, tests/login.test.ts.
Interfaces buildLoginScript({file,args,profileEnv,cwd}):string for approved CLI plans; launchLogin(providerId,profile,executable,cwd,scriptDir):Promise<ChildProcess>. CLI entry resolver includes verified Gemini entry. Wrapper disables delayed expansion and escapes batch % characters; rejects quotes/newlines in filesystem paths. Commands and login flags originate from allowlisted provider IDs only.
- [ ] Write/run failing tests for quoting paths with ampersand/percent, argument injection rejection, approved Codex/Claude/Gemini commands and Gemini no prompt. Implement and run green.
- [ ] Synthetic native console test with temporary Node CLI emits only a test marker and selected home to file. Verify marker and isolated env, terminate only its console PID. Never run real login in tests.

### Task 4: Main integration and UI
Files src/main/index.ts, preload/index.ts, renderer/App.tsx, renderer/preview.ts, shared/i18n.ts and tests/ui.spec.ts/scripts/smoke.cjs.
IPC login accepts registry profile ID only; native add-profile and select-executable accept provider ID from fixed supported list. No renderer file paths or arbitrary commands. getState includes public profiles; snapshots keyed by profile ID. Rescan on manual refresh, login exit and app focus (debounced); preserve authorized stale values, remove revoked metrics. Persist changes serially.
- [ ] UI failing tests two profiles -> two rows, Add account/login/locate controls call narrow bridge, planned connectors have no login action. Old preview stays non-connected.
- [ ] Implement separate profile rows and pinned cards, login/add/import/locate buttons and FR/EN labels with busy/error feedback. Login explicitly grants only its selected profile read permission. Registry lookup authoritative. Run tests green.

### Task 5: Package and verify
- [ ] Run full unit suite, typecheck, UI suite, production build, audit and native smoke with real non-sensitive detection. Test profile isolation, consent defaults, control UI without authenticating real accounts. Independent read-only code review and regression fixes.
- [ ] Rebuild release/Quota-Glass-0.1.0-win-x64.exe. Verify packaged smoke and actual file, report exact test totals and remaining server-quota verification limits. Update README/SUPPORT/VERIFICATION and task journal. No publish.

## Self-review
All changes preserve catalog IDs separate from profile IDs; main remains path authority. Multi-account authentication verification is explicitly pending human login. Shared types travel through bridge; no real credentials reach tests. Existing feature branch is isolated new product repository, no main branch modification.
