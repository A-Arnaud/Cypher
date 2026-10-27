# Data and network

Cypher keeps its data on your computer. No Cypher backend, analytics service, log upload, or crash reporter is configured. No cookies from the personal browser, conversations, or message history are imported.

## Local data

Preferences live in the application's user-data folder (`%APPDATA%/Quota Glass` for existing installations, otherwise `%APPDATA%/Cypher`). A custom location can be selected at launch for testing.

On macOS, the default location is `~/Library/Application Support/Cypher`; an existing `Quota Glass` or `quota-glass` folder in Application Support is retained for compatibility. API keys use Electron safeStorage backed by the macOS Keychain, while Windows uses DPAPI. Encrypted Windows keys cannot be migrated by copying their file to a Mac; enter the keys again in Connections.

Codex browser connections use an official authentication component included in Cypher. It stores the new session in an independent, app-managed CLI profile after opening the provider's sign-in page in your normal browser. These session credentials are managed by Codex, not stored in Cypher's API-key envelope. Signing in successfully authorizes read access to that profile; merely detecting it does not. See [connection methods](docs/connection-methods.md).

| File/folder | Contents |
|---|---|
| settings.json | Language, display, order, authorized profiles, and settings; no API keys |
| app-update-state.json | Deferred update version and expiration; no account information |
| registry.json | Paths to manually added CLIs and profiles; not their authentication contents |
| credentials.enc.json | Keys entered in Cypher, encrypted with Windows DPAPI or macOS Keychain-backed safeStorage and bound to the provider |
| profiles/ | Profiles created on demand; credentials there are managed by the official CLI |
| login-scripts/ | Temporary fixed launch commands, without keys or tokens |
| login-workspaces/ | Neutral folders for requested logins |

Quota data and masked accounts remain in memory and are not cached in preferences. Official CLIs may manage their own authentication files, caches, and logs in their profiles. Profile names and email domains displayed locally may constitute personal information: check any screenshot before sharing it.

“Disconnect and delete key” deletes the key from Cypher storage and removes read permission. It does not revoke the key at its provider or guarantee forensic erasure from disk backups. Removing a profile's permission stops its collection without signing out the CLI or deleting its account. Pause stops collectors; Quit terminates the application and its readers.

Uninstallation preserves the user-data folder so that profiles survive reinstallation. Delete keys from Connections before handing over a PC, and manage CLI sign-out separately. Do not copy this folder into the GitHub repository or a distribution archive.

## Application update traffic

Application update checks are separate from provider read permission. In packaged 0.6.0+, the default optional checker contacts `api.github.com/repos/A-Arnaud/Cypher/releases/latest` after startup and every six hours. Disable it in Settings to stop automatic checks; manual checking remains available. It sends ordinary connection metadata and a fixed Cypher user agent, without provider credentials or account information. No persistent installation/staged-rollout identifier is generated for these checks/downloads.

On an approved installed-Windows update, metadata and binaries are retrieved from the project's GitHub releases and GitHub asset hosts, with hash checks before installation. Mac/portable download actions open the official download in the system browser; that browser follows its normal download/privacy behavior. The local deferral is stored in `app-update-state.json`; Windows download cache is separate from account profiles. [Update details](docs/updates.md).

## Provider destinations contacted after authorization

| Connector | Destination | Data transmitted |
|---|---|---|
| OpenRouter | openrouter.ai/api/v1/key | OpenRouter key and request to read that key's budget |
| DeepSeek API | api.deepseek.com/user/balance | DeepSeek key and balance read |
| Poe | api.poe.com/usage/current_balance | Poe key and points read |
| OpenAI API | api.openai.com/v1/organization/costs | Admin key and cost period for the UTC month |
| Anthropic API | api.anthropic.com/v1/organizations/cost_report | Admin key and cost period for the UTC month |
| fal.ai | api.fal.ai/v1/account/billing | Key with billing:usage:read permission and balance request |
| Together AI | api.together.ai/v1/billing/usage | API key, UTC month, granularity, and pagination cursors |
| Codex | Included official authentication/account component or explicitly selected CLI | Authorized profile path and account/quota requests; the component contacts its provider. Browser sign-in opens the official external page on request |
| Claude Code | Installed official CLI | Authorized profile path and auth status command; the CLI follows its official behavior |
| Gemini | Official CLI, only when Connect is clicked | Selected profile home; no automatic quota collection implemented |
| Ollama | 127.0.0.1:11434/api/tags | Model list read, without a cloud key |
| LM Studio | 127.0.0.1:1234/v1/models | Model list read, without a cloud key |
| llama.cpp | 127.0.0.1:8080/v1/models | Model list read, without a cloud key |
| vLLM | 127.0.0.1:8000/v1/models | Model list read, without a cloud key |

Keys must be sent to their provider for authentication, over HTTPS. The provider also sees normal connection metadata, including the IP address. Readers send no generation prompts. Installation, key-creation, login, and dashboard links open in the external browser only on user action.

Cypher does not anonymize traffic from configured services, third-party CLIs, or the external browser. System proxy variables and enterprise certificates may affect this traffic. Do not share raw diagnostics from these tools without reviewing them.

## Optional diagnostics and clipboard

Settings → Diagnostics offers an explicit local `cypher.diagnostics/v1` JSON report. It contains application/OS/architecture, collection counts/settings, indicator/startup/update states and anonymous connector/profile health reasons/reading ages. It excludes account/profile names, emails, filesystem paths, keys, quota amounts, raw errors and logs. Viewing or copying uses current in-memory state; it does not run another reader or make a network request.

Copy writes a fresh report to the system clipboard only after that action. Clipboard managers and other applications may access it. No diagnostic file is saved or uploaded automatically. Review the report before sharing it. Quick-action searches remain in renderer memory and are not logged, persisted or sent to a service.

## GitHub sources and screenshots

Screenshots provided in docs/screenshots are generated from the browser preview without access to the machine's CLIs or accounts. User data, private environments, signing keys, dumps, and test reports are excluded from the repository. Executables use an explicit file allowlist and a separate check of the produced archive.
