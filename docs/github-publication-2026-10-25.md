# Pre-publication GitHub verification — October 25, 2026

Scope: Cypher 0.4.8 project sources and local Git history. Publication requested in a private GitHub repository; no installer or user-data file is published.

## Checks performed

- Local publication scan: 191 publishable files and 172 historical blobs checked before adding this report; no recognized secret match.
- Official Gitleaks 8.30.1: the 16 existing commits and publishable files pass without recognized secrets. Redacted reports retained only in `.security-tools/`, excluded from Git.
- Visual inspection of the 14 images: nine historical screenshots and five current screenshots. No real account identifier visible; balances in API screenshots are synthetic.
- File-list verification: account configurations, CLI profiles, keys, preferences, logs, diagnostics, dependencies, and local artifacts excluded by `.gitignore`.
- Existing history: authors use a generic local address. The publication commit uses the GitHub noreply address without exposing the locally configured email address.
- `npm run typecheck`: passed.
- `npm test`: 107 tests passed, 22 files.
- `npm run build`: passed, including native helper compilation.
- `npm run test:ui`: 14 tests passed.
- `npm audit --audit-level=moderate`: no vulnerabilities reported.

## Limitations

These checks do not guarantee the absence of every secret or vulnerability. The private repository restricts source access. Local account data must never be added, even encrypted. Test and example values are not evidence of connection to real accounts.

This verification covers source publication. No new installer or real-account connection test was produced for this publication. Older reports retain their dates and scope; they do not constitute a new run on GitHub Actions.

For the subsequent English Windows release, see [release verification](release-verification-2026-10-25.md). This document describes the earlier source-only publication.
