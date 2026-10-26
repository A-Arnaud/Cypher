# Cypher 0.4.9 implementation plan

**Goal:** complete contributor/public presentation improvements and propagate the supplied logo into a verified Windows release.

**Spec:** ../specs/2026-10-26-branding-presentation-release-design.md

**Approach:** deterministic logo conversion using existing SVG/PNG tooling, existing Electron/native build pipeline, existing Cypher presentation generators, docs-only onboarding additions, and authenticated GitHub release publication.

- [x] Inspect GitHub visibility, published version, working-tree changes and supplied logo.
- [x] Store the supplied source and make icon generation self-contained; update native helper icon, wordmark generation and version to 0.4.9.
- [x] Complete README/contributor issue forms, support/security entry points and launch checklist; keep provider status accurate.
- [x] Regenerate and inspect current presentation art/screenshots.
- [x] Validate links/forms, logo rendering and actual Windows icon resources; run release tests/scans.
- [x] Build isolated test and production packages, verify security and checksum intended artifacts.
- [ ] Commit/tag/publish 0.4.9, verify downloads and record publication evidence.
