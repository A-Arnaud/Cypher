# 0.9.0 — two quota windows in a compact bar

- Keep short/session and weekly quota percentages separate in compact native indicators.
- Size the Windows 10 strip for its account count; combine logos and both rows in the Mac menu bar.
- Show two-row numeric notification icons on Windows 11 with service/duration tooltips and native menus.
- Replace nested quota cards with flat sections and a labelled navigation rail with service filters.
- Add an indicator reading guide; retain real zero, unknown/stale values, privacy, startup and update behavior.

# 0.8.0 — simpler account setup and a clearer interface

- Add a guided first-run view, service picker and immediately visible Codex browser sign-in; keep explicit permission for existing profiles.
- Compact quota cards with remaining amounts, relative reset countdowns, actionable errors and expandable source details. Preserve real zeros, stale readings and provider limits.
- Add saved light/dark/system themes and theme-aware monochrome logos. Move advanced collection, opacity, shortcut and diagnostic controls into a disclosure.
- Keep empty default service placeholders out of account and indicator summaries; retain user profile permissions and pin preferences.
- Move the bar/minimize control to a quiet footer. Preserve native closing choices, optional startup, Mac menu-only behavior and approved update flows.

# 0.7.1 — automatic indicator at launch

- Show the quota indicator by default at each manual/login launch on Windows and Mac, before the renderer opens.
- Add an English/French Settings switch that persists explicit removal, including at login. Enabling it keeps Settings visible.
- Use the main bar button to minimize; remove the separate removal button outside Settings.
- Migrate untouched legacy defaults while retaining explicit removals, account permissions and startup preferences.
- Verify first launch, migration, manual/login modes, opt-out, native Settings IPC, visibility and failure handling.

# 0.7.0 — quick actions, actionable status and private diagnostics

- Add a searchable mouse/keyboard action picker in both views: Ctrl+K on Windows, Command+K on Mac, arrows/Enter/Escape, focus restoration and explicit disabled actions. Find pinned profiles and connection options without starting logins from search.
- Show a compact All / Needs attention filter, last successful reading age/source, and distinct current/waiting/limited/paused/duplicate states. Age old readings without requiring a new provider event; preserve real zeros and provider-specific support limits.
- Add local versioned diagnostics built from an explicit allowlist. View/copy only on request; no account/profile names, emails, paths, keys, quota amounts, raw errors/logs or automatic uploads. Trusted-window IPC controls report generation and clipboard writes.
- Verify the shared health model, privacy boundaries, keyboard/focus/compact layout and real Electron IPC on Windows and both Mac architectures. Retain existing connections, startup, menu-only Mac behavior and approved update flow.

# 0.6.0 — discreet release proposals and approved Windows updates

- Check stable GitHub releases after startup and every six hours, with small footer/native-menu indicators. No unsolicited window, Dock bounce or OS notification. Automatic checks can be disabled; Later defers an offer for 24 hours.
- Require explicit user approval before download/install. Installed Windows copies use the NSIS update engine, bounded/version-pinned metadata, manifest SHA-512 and independent GitHub SHA-256 validation, orderly shutdown and restart in the bar. Ordinary Quit never installs a cached update.
- Keep current Mac and portable/extracted Windows downloads manual, with clear platform-specific instructions. Mac native installation remains blocked by the unavailable stable Apple signing identity/integration; no Gatekeeper bypass is introduced.
- Publish and verify Windows `latest.yml` with the release. No persistent staged-rollout identifier or provider credentials are transmitted by the updater. Include bundled dependency license notices.
- Earlier 0.5.x binaries need one manual installation of 0.6.0 to acquire the checker. Existing startup, menu-only Mac behavior, closing choices and account/profile isolation remain.

# 0.5.4 — discreet Mac menu bar app

- Declare the packaged Mac app as an agent (`LSUIElement=true`) and retain accessory activation for manual launches, login launches and reopened windows. Opening Settings or restoring the widget no longer promotes Cypher to a normal Dock application.
- Keep the top menu bar icon, Show / Hide, keyboard shortcut and explicit Quit available. Windows presentation and optional startup settings retain their behavior.
- Verify actual native Dock visibility through menu restoration, Settings input, pause/resume, hiding, reopening and quitting on both Mac architectures. Check the final app's plist and native process activation policy after packaging/signing.
- Explain how to reopen the app and remove a previously pinned Dock favorite in the Mac guide and FAQ.

# 0.5.3 — optional startup directly in the bar

- Start automatically only when the user enables it in Settings. Moving into the bar or minimizing no longer registers automatic startup implicitly.
- At login, always restore the Windows taskbar / Mac menu bar without showing the window, even if the indicator was previously removed. Manual opening remains visible; a failed indicator startup opens the window with an error.
- Enable native macOS login-item registration for the packaged app in Applications. Detect macOS login launches without Windows arguments, verify the registered service, show pending OS approval separately and reflect changes made in system settings.
- Add English/French startup guidance and native Electron login-launch scenarios for both platforms. Existing Windows portable restrictions and Apple signing limitations remain.

# 0.5.2 — clear bar controls and closing choices

- Replace the ambiguous header icons with a labelled **Move to taskbar** button on Windows and **Move to menu bar** on Mac. Explain the indicator's position directly below it in English and French.
- Keep the same visible action in compact and detailed views. Once enabled, it minimizes directly; a separate **Remove** action disables the indicator.
- Closing the window now offers **Minimize**, **Quit Cypher**, and **Cancel**, with the destination and effect explained. A failed indicator startup keeps the window visible; repeated close requests share one dialog.
- Publish one 0.5.2 release for Windows 10/11, Mac Intel and Mac Apple Silicon. Windows also receives the previously Mac-published browser connection options and bundled Codex authentication component.
- Add native Electron close/IPC checks on Windows and both Mac architectures, plus localized UI and cancellation/failure tests.

# 0.5.1-mac.2 - connection options

- Keep automatic profile detection first and group browser, installed CLI, profile import and API-key alternatives under More ways to connect.
- Include the pinned official Codex authentication/account executable for browser sign-in without a separately installed CLI, app or Node runtime.
- Isolate new accounts, grant read access only on successful login, validate authorization URLs and support cancellation/timeouts without exposing tokens.
- Keep Claude/Gemini CLI methods and provider quota limitations explicit. Preserve Windows 0.5.0 as the stable download and the existing Mac menu bar behavior.

# 0.5.1-mac.1 — macOS preview

- Add a native top-right macOS menu bar indicator, visible quota title and template icon, while preserving Windows backends.
- Support macOS executable CLI discovery/selection, profile-isolated Terminal sign-in, and Keychain-backed API key storage.
- Add Apple Silicon/Intel DMG and ZIP builds, macOS CI tests, native Electron and packaged-app launch checks.
- Document ad-hoc signing, Gatekeeper, manual login items and remaining physical-device validation in `MACOS.md`.

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
