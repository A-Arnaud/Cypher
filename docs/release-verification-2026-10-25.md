# Cypher 0.4.8 release verification — October 25, 2026

This is a new verification for the English GitHub release. Earlier reports retain their original dates, versions and scope. Repository: `A-Arnaud/Cypher`, private.

## Scope and evidence

- English first launch for fresh desktop profiles and browser previews; tests preserve saved French preferences. Legacy data paths and IPC identifiers are unchanged.
- Current and historical project documentation translated into English. English screenshots regenerated from account-free preview/synthetic fixtures. Cypher wordmark, hero and three feature cards generated and visually inspected; no Cua artwork reused.
- `npm run typecheck` passed. `npm test`: 108 tests across 22 files passed. `npm run test:ui`: 15 passed.
- `npm run build:test`, `npm run test:clean-machine` and `npm run test:corners` passed. The clean-machine check uses synthetic provider responses and a separate test executable; it does not authorize a real account.
- Production frontend/main/native build completed. Default packaging reached the portable target but its existing file was locked by a running app. The builder alone was stopped; packaging was rerun successfully with `node_modules/.bin/electron-builder.cmd --win nsis portable --x64 --config.directories.output=release/github-v0.4.8`. The running user application was not stopped by this work.
- Security checks targeted the actual release package using `CYPHER_RELEASE_ROOT=release/github-v0.4.8/win-unpacked`: `npm run security:release` and `node scripts/smoke-production-security.cjs` passed. Production fuses, restrictive CSP, archive contents, blocked injected Node code and absent remote debugger were checked.
- Source/history Gitleaks scan and complementary publication scan reported no recognized secrets. Dependency audit reported zero known vulnerabilities. README local links resolved; GitHub's Markdown renderer accepted the README.
- Requirement/code review found a misleading fal.ai table entry; corrected to available credit balance, separated from organization-spending connectors. No important code or privacy regression was identified by that review.

## Intended release assets

Only these three files under `release/github-v0.4.8` are intended for GitHub Releases. They are excluded from source Git; test builds, diagnostics, account files and signing material are not release assets.

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `Cypher-Setup-0.4.8-win-x64.exe` | 112411082 | `aed842e39eb012834546d4cc7c8742c9115780d9ce9d34893cbddb2c82ea35e3` |
| `Cypher-0.4.8-win-x64.exe` | 112222341 | `0f5dc995a393474edbba447d18a1a092022206f8ce2f52bd854b5f0748093198` |
| `SHA256SUMS-0.4.8.txt` | 190 | Contains the two executable checksums above |

## Limits

Executables remain unsigned. Verified native target remains Windows 10 x64 with a horizontal primary taskbar. Tests with synthetic data do not certify live provider connectivity or every supported Windows configuration. Scans do not guarantee the absence of every secret or vulnerability. The private repository's access restrictions still apply to its release downloads.

The release tag, remote source commit and uploaded asset checksums are verified as the final publication step; local build evidence above is not a claim about a future GitHub Actions run.

## Remote publication verification

- Published release: https://github.com/A-Arnaud/Cypher/releases/tag/v0.4.8 (not draft, not prerelease).
- Release source tag `v0.4.8` points to `70d09d87d4a1bed5a0beedb29b09cb5a4533d542`. The subsequent publication-record commit changes documentation only.
- Repository visibility was verified private and its default branch is `main`.
- All three uploaded assets were downloaded through authenticated GitHub access and independently hashed; each SHA-256 matched its local source file. GitHub asset digests also match.
- Latest-source GitHub Actions runs were in progress at publication; this report does not claim a completed CI result for them.
