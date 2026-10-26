# Cypher 0.4.9 verification — October 26, 2026

Scope: current repository presentation/contributor onboarding and propagation of the supplied graphite firefly logo into the Windows release. Historical release assets and dated reports are preserved.

## Identity and documentation

- `assets/logo-source.png` is byte-identical to the supplied 1024×1024 PNG. SHA-256: `fd86d2d3a8f90ca2e2e40a6c7b856c5e7c1b9b57a8dc0c0ca62170b3a85b7c2b`. No image synthesis, redraw, background removal or artwork replacement was performed.
- The icon generator derives the SVG raster wrapper, application PNG and seven-resolution Windows ICO from the checked-in source. Current wordmark, hero/cards and five screenshots were regenerated and visually inspected. They use English and synthetic/account-free views. Provider logos retain their meaning and licensing.
- README includes concise product/download navigation, Why Cypher, explicit implemented/partial/planned/discovery-only statuses and contribution/support links. Contributor guide, three issue forms, issue chooser, PR template, support FAQ, security reporting and launch checklist complete the focused onboarding pass.
- Three issue forms and the chooser parse with the installed YAML parser. Required Windows/Cypher context, distinct form IDs and privacy confirmation checkboxes were checked. All checked local documentation targets/anchors and npm script references resolve. No community address, social proof, provider support or license grant was invented.
- GitHub was observed public before this update; this work did not change visibility. Private vulnerability reporting was enabled and reread as enabled. Topics were expanded with React, TypeScript and local-first. This is separate from the unchecked, reusable launch guidance document.

## Executed checks

- `npm run typecheck`: passed.
- `npm test`: 108 tests passed, 22 files.
- `npm run test:ui`: 15 passed.
- `npm run build:test`, `npm run test:clean-machine`, `npm run test:corners`: passed. Real Electron IPC/DPAPI checks use isolated profiles and synthetic provider responses, not real account authorization.
- `npm run build`, followed by `electron-builder --win nsis portable --x64 --config.directories.output=release/github-v0.4.9`: passed.
- `scripts/check-windows-icons.ps1` extracted the actual 32px Windows icons from the main executable, native helper, portable launcher and installer; each matched the intended ICO pixel-for-pixel. The checker uses the Windows loader for PNG-backed ICOs rather than .NET's faulty direct ICO conversion.
- The production ASAR's frontend SVG and tray/fallback PNG match the current source assets by SHA-256.
- With `CYPHER_RELEASE_ROOT=release/github-v0.4.9/win-unpacked`, `npm run security:release` and `node scripts/smoke-production-security.cjs` passed. These checked fuses, CSP, archive contents, normal isolated startup, rejected injected Node code and absent remote debugging.
- Gitleaks history/current-file scans and the complementary publication scan reported no recognized secrets. `npm audit --audit-level=moderate` reported no known vulnerabilities. These are automated checks, not an independent security audit.

## Intended release assets

Only these files in `release/github-v0.4.9` are intended for release publication. Local user data, test packages, raw reports and signing material are excluded.

| Asset | Bytes | SHA-256 |
| --- | ---: | --- |
| `Cypher-Setup-0.4.9-win-x64.exe` | 113248854 | `5eab63d8df0f431b0d01ae84befc172d6e1dbad965c023af5ef2f49e6988e910` |
| `Cypher-0.4.9-win-x64.exe` | 112991838 | `2c877c24fe7e62ba8067b305cc4f4796147a905edf4d98a9859c8f2c23b4fd3e` |
| `SHA256SUMS-0.4.9.txt` | 190 | Contains both executable hashes above |

## Boundaries

Unsigned executables; verified native target Windows 10 x64 with a horizontal primary taskbar. Existing provider limitations, consent boundaries and saved-profile compatibility remain. Automated fixtures do not certify every real account or Windows environment. Public release/download verification is recorded separately after publication.

## Publication and local update

- Published https://github.com/A-Arnaud/Cypher/releases/tag/v0.4.9 (not draft or prerelease), from source tag `v0.4.9` at `72e75fd13a6fdc9d2eb89fa18a746cbfefc074d1`.
- Installer, portable executable and SHA-256 manifest were downloaded from GitHub and each matched its local original. GitHub asset digests match as well.
- GitHub's current hero image blob matches the local regenerated hero. Issue forms, PR template, topics and enabled private vulnerability reporting were reread from GitHub.
- Updated the existing extracted local copy and its desktop shortcut, then replaced the running old portable process with the extracted 0.4.9 application. Executable hashes match the verified production package; runtime remained running. Saved consent/profile order, refresh interval and language were compared before/after and preserved. Account data was not copied into the application or repository.
- The tag-triggered CI built the Windows artifacts but failed because electron-builder implicitly tried to publish without a GitHub token. The follow-up workflow correction explicitly passes `--publish never`, preserving read-only validation and separate release publication. The failed tag job is not represented as a successful CI result.

## Final verification

- The corrected GitHub Windows workflow completed successfully at commit `50b8c59d93b1fc95ecb98641eeab9e5d40e3fb29`: https://github.com/A-Arnaud/Cypher/actions/runs/40250418579 . All build, test, icon-resource and production-security steps passed. The release tag remains tied to its original runtime source; subsequent changes are the CI-only correction and verification records.
- Updated the existing per-user Windows installation through the verified 0.4.9 installer and launched that installed executable. Its binary matches the release package, and its main/uninstaller icon resources match the new ICO. The extracted copy is also updated to 0.4.9.
- Updated four relevant existing Desktop/Start Menu shortcuts with versioned icon paths; the unrelated Orca shortcut was left unchanged. Saved profile/consent order, refresh interval, language and the existing Windows startup registration were compared before/after the installed update and preserved.
