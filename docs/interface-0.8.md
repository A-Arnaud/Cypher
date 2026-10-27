# A simpler Cypher interface

Cypher 0.8.0 focuses on three tasks: connect an account, see what remains, and keep the indicator close while working.

## The first connection

Open **Accounts**, choose your service, then use an existing sign-in or connect an account. Codex offers **Sign in with your browser** immediately, using the included official component. **Other ways to connect** contains the installed CLI, profile import and API alternatives. Existing profiles still require explicit permission before a read; finding a sign-in never grants access automatically.

Only relevant accounts appear in the quota view. Unused default placeholders stay out of the account list and native indicator, while saved permissions and pin preferences remain intact. A connected Claude account is shown as connected, with a plain explanation when subscription quotas are unavailable.

## Reading the panel

Each card groups remaining quota, its progress bar and the provider's reset countdown. A zero remains zero. An old reading stays visibly old and offers a retry. Authentication and permission problems offer the appropriate connection action. **View details** reveals the source and longer explanation.

The minimize button is at the bottom. Windows keeps its bottom taskbar/notification-area behavior; Mac keeps the top menu bar and no running Dock icon. The indicator preference, closing choices and optional login startup retain their existing behavior.

## Personalization

**Settings → Appearance** offers light, dark and system themes. Language, indicator visibility, optional startup and update controls remain in the main settings view. **Advanced options** contains refresh frequency, alerts, opacity, always-on-top, compact detail preferences, the global shortcut and private diagnostics. Quick actions can still open diagnostics directly.

## Reference study

The review of [OpenTokenUsage](https://github.com/PowerUserZ/OpenTokenUsage), its [public panel](https://opentokenusage.app/) and provider-card structure informed the compact reading layout, nearby reset times, contextual fixes and quieter navigation. Cypher implements these interaction ideas in its existing Electron/React architecture. This update does not add the reference project's provider plugins, undocumented Claude quota reader, pace predictions, local HTTP server or Windows 11 taskbar strip. Provider coverage remains documented in the [catalog matrix](catalog-coverage.md).

Account secrets remain in the main process. Screenshots use the current renderer with deterministic demonstration data, block external requests and never load the native bridge. macOS images are labelled layout previews.
