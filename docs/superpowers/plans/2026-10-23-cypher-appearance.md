# Cypher Appearance Implementation Plan

> Agentic workers: use superpowers:executing-plans; user provided exact changes, no new layout exploration required.

Goal: Cypher branding, saved opacity and non-disruptive background refresh.
Spec: docs/superpowers/specs/2026-10-23-cypher-appearance-design.md.

- [ ] Write/run failing settings opacity, native Codex resolver, worker-child hidden-option and forced-rescan tests. Reproduce Unicode corruption in native fixture.
- [ ] Resolve vendor Codex directly, guard only background Node subprocesses, include guard in bundle. Preserve visible interactive login.
- [ ] Fix UTF-8 batch transport and queued fresh rescans; keep replace-CLI control accessible.
- [ ] Convert supplied SVG to PNG and multi-resolution ICO; use same SVG in React. Rename UI/window/tray/executable Cypher, retain old data path via tested helper.
- [ ] Implement typed 30..100 opacity settings validation; native preview/update; slider with immediate preview and debounced persistence; FR/EN labels and unit/UI/native tests.
- [ ] Run full suite, UI, native login/hidden-refresh/opacity checks, audit, final review, build portable and rerun packaged checks. Report actual executable path and remaining provider limitations.

Review focus: invisible window recovery; no credential relocation; child CLI console hiding not just parent option; fresh discovery after registry mutation; Unicode and cmd metacharacters; only deliberate login opens a terminal.
