# Compact Widget Implementation Plan

> Use superpowers:executing-plans with test-driven changes.

Goal: ordered compact summary by default, details on demand, truly opaque at 100%.
Spec: docs/superpowers/specs/2026-10-23-compact-widget-design.md.

- [ ] Red tests for immutable reordering, bounded adaptive dimensions and summary setting validation.
- [ ] Implement shared order/layout helpers and serialized move-profile IPC, preserve profile identity and permissions.
- [ ] Red UI tests: summary, DnD, keyboard reorder, Details/Back, six-profile no-scroll, opaque interior; implement focused SummaryWidget and styling without changing data adapters.
- [ ] Apply native geometry on mode/pin changes, disable acrylic and use an opaque shell below native opacity.
- [ ] Run unit/UI/native checks including persistence, layout and alpha at 100%; independent targeted review, fix important issues and rebuild Cypher0.3.0 portable.
- [ ] Document paths and scope, save task state; quota access limitations unchanged.
