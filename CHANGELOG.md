# Cypher 0.5.0 — October 26, 2026

- Added an OS-selected native notification-area backend for Windows 11 and unknown Windows shells. Pinned quota summaries are exposed through the tray tooltip and menu; the desktop widget remains available. This is not an embedded Windows 11 taskbar text indicator.
- Preserved the existing Windows 10 horizontal-primary-taskbar integration. Legacy Explorer manipulation is blocked on unsupported Windows versions, without blocking the independent startup registry query.
- Adapted the dock controls and explanations in English and French while preserving the graphite firefly identity, saved preferences and provider permissions.
- Updated electron-builder to 26.18.0 and pinned checkout/setup-node Actions to verified v7 revisions. CI records its actual Windows Server host, builds without publishing and retains validated executables plus checksums.
- One Windows x64 installer and one portable build serve both Windows 10/11. Windows 11 physical-device acceptance remains pending; test evidence and limitations are recorded separately in [VERIFICATION.md](VERIFICATION.md).
- Provider coverage is unchanged. No real account or quota verification is implied by synthetic tests.

# Cypher 0.4.9 — October 26, 2026

- Replaced the Cypher identity with the supplied graphite firefly logo in the application, tray, Windows executable/installer and native helper, plus current README wordmark, presentation art and screenshots. Provider logos remain unchanged.
- Icon generation now uses the checked-in logo source instead of a developer-machine path. Windows icon resources are verified against the generated ICO, including in CI.
- Added a concise product/status/navigation flow, contributor onboarding, bug/feature/provider issue forms, a support FAQ, security-reporting entry point and a practical launch checklist. No provider capabilities have been added.
- English remains the fresh-profile default; saved language preferences, account profiles and permissions remain compatible.

# Cypher 0.4.8 — October 25, 2026

- GitHub presentation and documentation are now in English, with original Cypher artwork and account-free English screenshots. The repository is now `A-Arnaud/Cypher`.
- Fresh installations and browser previews start in English. Saved language preferences remain unchanged; French is still available in Settings.
- The first GitHub release includes rebuilt Windows x64 installer and portable executables, with SHA-256 checksums.
- Detailed cards display balances, currencies, spending, and points, including zero values. The small widget and cards use the same number and quota-duration formats.
- The last-read time reflects metrics from pinned profiles. Catalog entries and failed reads no longer advance it artificially.
- A temporary error preserves the last values and its precise reason. A rejected session or different identity clears old metrics. Replacing an API key clears the previous account's balance before the new collection.
- An occupied shortcut is rejected without losing the active shortcut or saving the unavailable combination. Repeated modifiers are rejected; the form explains the format and accepts Enter.
- A loading error offers a retry. A delayed initial response can no longer replace newer state.
- A corrupt preference field no longer resets other valid settings. Invalid permissions remain disabled, and IPC validation remains strict.
- Search tolerates whitespace and case differences; navigation and filters have accessible indicators, focus is visible, and the layout adapts better to small screens.
- Browser tests choose an available port on Windows. The displayed version and test installer follow the project version.

Provider capabilities and limitations remain detailed in [SUPPORT.md](SUPPORT.md). Validation for this release is recorded in [VERIFICATION.md](VERIFICATION.md).
