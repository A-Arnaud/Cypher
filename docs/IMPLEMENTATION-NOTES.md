# Implementation decisions

Approved design is retained in the active Hermes knowledge directory; implementation plan is in docs/superpowers/plans/2026-10-23-quota-glass.md.

- New standalone repository and feature branch, not a nested worktree: no existing product or main branch to protect.
- Continuous inline execution chosen on user go. Verification uses tests plus a fresh final reviewer.
- Initial scope is a usable desktop core with capability-honest adapters, not fully operational integrations for the whole roadmap catalog.
- English/French selected in Settings. Fresh profiles default to English as of the October 25, 2026 GitHub release; existing saved language preferences are preserved. The initial implementation defaulted to French.
- No credentials stored in this release: installed CLI sessions are delegated after explicit UI consent. DPAPI key storage is unnecessary until direct API-key connectors exist.
- Portable autostart is intentionally disabled to avoid registering transient extraction paths. Startup support remains an explicit limitation rather than a silent unsafe default.
- One active identity per CLI; no account switching or browser login implemented.
- Window drag uses the title bar. Native blur is best effort; actual Windows 10 rendering has a legible smoked translucent fallback.
- Native smoke exercises the real process and real discovery with isolated preferences. Account access is never enabled by automation. Synthetic subprocess responses test the Codex protocol but do not verify a real subscription quota.
- Scratch is explicitly resolved under LOCALAPPDATA/hermes/cache/scratch: this host overrides TMPDIR to system Temp for native Node children.
- Tests observed failing before implementation: discovery, consent/metrics/settings, scheduling, URL/IPC validation, UI missing features. Additional regressions caught expired quota windows, protocol parameters and duplicate alerts after poller recreation.
