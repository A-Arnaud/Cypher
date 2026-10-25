# Cypher English GitHub and release implementation plan

**Goal:** publish the latest verified Cypher version with English project presentation and Windows downloads.

**Architecture:** retain Electron and optional French localization. Change fresh-profile defaults, translate documentation, add original presentation assets, then rebuild the existing untagged version 0.4.8.

**Tech stack:** Electron, React, TypeScript, SVG/PNG, Markdown, GitHub CLI.

**Spec:** ../specs/2026-10-25-english-github-release-design.md

- [x] Inspect the Cua reference, current repository, version and publication controls.
- [x] Rename repository to Cypher, update origin and About metadata; retain private visibility.
- [x] Translate current and historical documentation in independent file groups.
- [x] Verify English fresh-profile/browser defaults and saved-language compatibility with tests.
- [x] Create centered README, original wordmark/feature art and English synthetic screenshots.
- [x] Run typecheck, unit/UI tests, secret scans, dependency audit and Windows packaging.
- [x] Verify production archive/fuses and run isolated packaged security checks.
- [x] Review requirements and code quality; commit and tag final source, upload intended artifacts and checksums.
- [x] Verify private visibility, remote commit/tag and release assets.

## Decisions

- The user explicitly authorized repository editing and release publication.
- Keep French as an optional localization to preserve a working saved preference.
- Translation is parallelized by file ownership; release, branding and Git mutations remain with the primary agent.
- Reference: https://github.com/trycua/cua/blob/main/README.md (layout inspiration only).

## Publication result

Published https://github.com/A-Arnaud/Cypher/releases/tag/v0.4.8 from source commit `70d09d87d4a1bed5a0beedb29b09cb5a4533d542`. Installer, portable executable and checksum manifest were downloaded from GitHub and matched the local SHA-256 hashes. Repository remains private. GitHub Actions runs for this source were still in progress at publication; the recorded local checks passed.
