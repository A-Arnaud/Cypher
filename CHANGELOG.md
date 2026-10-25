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
