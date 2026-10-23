# Quota Glass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a working Windows desktop quota monitor with honest automatic discovery, real read-only collection where available and FR/EN glass UI.

**Architecture:** Electron main process owns discovery, provider adapters, settings and polling. Sandboxed React renderer receives sanitized snapshots through a narrow preload bridge. No remote service or credential harvesting.

**Tech Stack:** Electron, TypeScript, React, Vite, Vitest, Playwright, electron-builder; resolve maintained versions at install time.

**Spec:** C:/Users/Administrator/AppData/Local/hermes/knowledge/ai-quota-widget/2026-10-23-design.md

## Global Constraints
- Windows 10/11 x64, per-user portable distribution, no administrator required.
- French default; English selectable and persisted.
- nodeIntegration false, contextIsolation true, sandbox, CSP; no renderer secrets.
- No fake production metrics, billed inference, private undocumented endpoint by default or automatic credential transmission.
- Detecting installation does not establish authentication, plan or quota.
- Default poll 60 s, Ctrl+Alt+Q shortcut, startup disabled by default, alert remaining 20% and 5%.
- No publication; no edits to existing tool settings; planned connectors labeled planned.

## Review Focus
- Stale configuration must not become confirmed installation: task 1 discovery test.
- Missing/expired/malformed data must not become zero remaining: task 2 metric tests.
- Slow providers must not overlap refresh or outlive shutdown: task 3 scheduler tests.
- Corrupted preferences and offscreen saved bounds must remain recoverable: task 4 persistence tests.
- Rendered links/IPC must not permit arbitrary commands or credential exposure: task 4 bridge and task 6 security checks.

## Files and boundaries
- src/shared/model.ts: sanitized public types; src/shared/catalog.ts: support catalog; src/shared/i18n.ts: copy/localization.
- src/main/discovery.ts: filesystem/PATH evidence, no file contents containing secrets.
- src/main/providers.ts: explicitly supported read-only local usage sources and local engines.
- src/main/poller.ts: scheduling, freshness, per-provider backoff and alerts.
- src/main/settings.ts: validated preferences and atomic persistence.
- src/main/index.ts: Electron lifecycle, tray, shortcuts, windows and validated IPC.
- src/preload/index.ts: typed isolated bridge only.
- src/renderer/App.tsx, styles.css: widget/settings/connections and visual system.
- tests/*.test.ts: unit coverage; tests/ui.spec.ts: browser smoke, without pretending browser validates native integration.
- scripts/smoke.cjs: packaged app integration harness if feasible, no production demo dataset.
- README.md, SUPPORT.md: run/build instructions and verified capabilities.

### Task 1: Typed catalog and real discovery
Interfaces: discoverTools(env: DiscoveryEnv): Promise<Detection[]>; Detection {id, installed:boolean, configPresent:boolean, executable?:string, evidence:string[]}; CatalogEntry {id,name,kind,support,usageUrl?}. Registry distinguishes a product surface from its billing provider.
- [ ] Write tests: stale .ollama directory yields configPresent true but installed false; executable evidence confirms installation; missing paths do not throw; registry IDs unique; catalog has all design providers.
- [ ] Run `npm test -- discovery` expecting missing implementation failure.
- [ ] Add package/tooling and implement catalog/discovery with injectable roots and command resolution, Windows app locations and known IDE extension roots. Never execute inferred shell text.
- [ ] Run tests and `npm run typecheck`; expect passing; commit task files locally if repository initialized.

### Task 2: Provider capability and usage adapters
Interfaces: Metric {id,label,used?:number,limit?:number,remainingPercent?:number,unit,resetAt?,source,observedAt}; ProviderSnapshot {id,account?,plan?,auth,metrics:Metric[],state,message?,observedAt}; collectProvider(id, context, signal): Promise<ProviderSnapshot>. Context has detections and explicit consent IDs, never renderer credentials.
- [ ] Investigate current Codex/Claude/Gemini documented local read-only protocols/CLI status and usage artifacts without exposing secrets. Record exact supported sources in SUPPORT.md before implementing claims. Prefer Codex app-server account/rate-limit protocol if verified; require consent before authenticated calls. Local session logs yield activity only, never remaining subscription quota.
- [ ] Tests: absent quota stays absent; malformed/expired data yields unavailable/stale; percentages clamped only after validating units; OpenCode/Aider don't duplicate billed quota; authentication unknown not connected.
- [ ] Run targeted tests to confirm failure, implement adapters and explicit unsupported reasons. Local Ollama/LM Studio read-only loopback inventory requests only to fixed default addresses with short timeouts; never infer cloud subscription from installation.
- [ ] Verify tests passing; exercise at least one real local discovery or collection and record redacted result, not fixtures as live proof; commit.

### Task 3: Collection service
Interfaces: Poller.refresh(id?:string): Promise<ProviderSnapshot[]>; Poller.subscribe(listener): unsubscribe; Poller.stop(): void. Per-provider refresh serialized, no provider runs shell queries without timeout. Default 60000 ms, backoff bounded to 15 minutes; keep last good metrics stale on errors.
- [ ] Fake-clock tests: no overlapping refresh; abort stop; backoff/Retry-After respected; retained stale values; 20%/5% alerts once per reset window; no alerts on activity or unknown capacity.
- [ ] Run red, implement scheduler and alerts, rerun green; commit.

### Task 4: Safe desktop shell and persistence
Interfaces: Settings {language:'fr'|'en',pinned:string[],alwaysOnTop:boolean,startAtLogin:boolean,paused:boolean,pollSeconds:number,shortcut:string,bounds?,consents:string[]}; readSettings(path): Settings; updateSettings(patch): Settings. window.quota exposes getState, refresh, updateSettings, openProvider, toggleVisibility, quit and subscribe via fixed IPC.
- [ ] Tests: corrupt settings recover defaults; update rejects unknown fields/invalid intervals/IDs; consent opt-in default empty; offscreen bounds clamped; non-allowlisted external URL rejected; IPC payloads cannot supply commands or filesystem paths.
- [ ] Run red, implement atomic preference writes, lifecycle and sanitized bridge. Tray generated locally, close hides, quit stops poller and exits. Shortcut conflict visible; single-instance lock. Auto-start opt-in and disabled for portable environments if unsafe; report limitation.
- [ ] Native development smoke: launch, tray, show/hide, shortcut, clean quit; record actual checks separately from automated unit tests; commit.

### Task 5: Glass UI and bilingual settings
Interfaces consume only shared snapshot/settings types and typed bridge. Browser preview uses clearly labeled disconnected runtime, no simulated production quotas.
- [ ] UI tests: empty metrics display dash, unknown premium not inferred; catalog planned rows have no connect action; language persists; pause/pin and manual refresh dispatch correct bridge method; stale and auth-needed states visible.
- [ ] Run red, implement compact glass widget with provider accents, refresh/pause/settings/connections, usable scroll, keyboard focus, reduced-motion and no permanent fake chart. Settings expose language, shortcut, poll interval, startup, topmost, per-provider read-only consent. Handle available quota windows independently with reset times localized using Intl.
- [ ] Run UI tests and screenshot real rendering. Review against four image references: dark smoked glass, fine border, soft glow, uncluttered layout. Verify fallback readability on Windows 10.
- [ ] Commit UI.

### Task 6: Distribution and end-to-end verification
- [ ] Add scripts dev, build, typecheck, test, test:ui, dist using electron-builder portable Windows x64; lock dependencies. README FR with concise English section and support matrix recording operational/partial/planned and auth prerequisites.
- [ ] Run unit suite, typecheck, production build, UI tests, dependency audit; fix introduced material vulnerabilities or report upstream limitations, not silently waive.
- [ ] Build portable executable and launch it on this Windows host. Verify process starts, actual window screenshot where interactive desktop available, tray hide/reopen, poll pause and exit. If any check unavailable report explicitly, do not mark passed.
- [ ] Security check source/bundle for disabled sandbox, arbitrary external navigation, broad IPC and accidental secret logging. Real snapshots contain no tokens/cookies. No sessions/cookies copied into repository.
- [ ] Final review from fresh reviewer, fix important issues and rerun affected checks. Deliver absolute exe/source paths, exact test results, connected vs unverified quotas, and remaining limitations. Update durable journal.

## Self-review
Coverage: discovery task 1; source truth and quota distinction task 2; scheduling/alerts task 3; Windows lifecycle/security/persistence task 4; design/accessibility/FR-EN task 5; packaging/native validation/docs task 6. All cross-task types defined in shared/model.ts; bridge typed once. Broad catalog is not acceptance evidence for functioning quota adapters. Design approval received; user requested execution with 'go'.
