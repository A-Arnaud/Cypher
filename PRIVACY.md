# Data and network

Cypher keeps its data on the PC. No Cypher backend, analytics service, log upload, or crash reporter is configured. No cookies from the personal browser, conversations, or message history are imported.

## Local data

Preferences live in the application's user-data folder (`%APPDATA%/Quota Glass` for existing installations, otherwise `%APPDATA%/Cypher`). A custom location can be selected at launch for testing.

| File/folder | Contents |
|---|---|
| settings.json | Language, display, order, authorized profiles, and settings; no API keys |
| registry.json | Paths to manually added CLIs and profiles; not their authentication contents |
| credentials.enc.json | Keys entered in Cypher, encrypted with Windows DPAPI and bound to the provider |
| profiles/ | Profiles created on demand; credentials there are managed by the official CLI |
| login-scripts/ | Temporary fixed launch commands, without keys or tokens |
| login-workspaces/ | Neutral folders for requested logins |

Quota data and masked accounts remain in memory and are not cached in preferences. Official CLIs may manage their own authentication files, caches, and logs in their profiles. Profile names and email domains displayed locally may constitute personal information: check any screenshot before sharing it.

“Disconnect and delete key” deletes the key from Cypher storage and removes read permission. It does not revoke the key at its provider or guarantee forensic erasure from disk backups. Removing a profile's permission stops its collection without signing out the CLI or deleting its account. Pause stops collectors; Quit terminates the application and its readers.

Uninstallation preserves the user-data folder so that profiles survive reinstallation. Delete keys from Connections before handing over a PC, and manage CLI sign-out separately. Do not copy this folder into the GitHub repository or a distribution archive.

## Destinations contacted after authorization

| Connector | Destination | Data transmitted |
|---|---|---|
| OpenRouter | openrouter.ai/api/v1/key | OpenRouter key and request to read that key's budget |
| DeepSeek API | api.deepseek.com/user/balance | DeepSeek key and balance read |
| Poe | api.poe.com/usage/current_balance | Poe key and points read |
| OpenAI API | api.openai.com/v1/organization/costs | Admin key and cost period for the UTC month |
| Anthropic API | api.anthropic.com/v1/organizations/cost_report | Admin key and cost period for the UTC month |
| fal.ai | api.fal.ai/v1/account/billing | Key with billing:usage:read permission and balance request |
| Together AI | api.together.ai/v1/billing/usage | API key, UTC month, granularity, and pagination cursors |
| Codex | Installed official CLI | Authorized profile path and account/quota requests; the CLI contacts its provider |
| Claude Code | Installed official CLI | Authorized profile path and auth status command; the CLI follows its official behavior |
| Gemini | Official CLI, only when Connect is clicked | Selected profile home; no automatic quota collection implemented |
| Ollama | 127.0.0.1:11434/api/tags | Model list read, without a cloud key |
| LM Studio | 127.0.0.1:1234/v1/models | Model list read, without a cloud key |
| llama.cpp | 127.0.0.1:8080/v1/models | Model list read, without a cloud key |
| vLLM | 127.0.0.1:8000/v1/models | Model list read, without a cloud key |

Keys must be sent to their provider for authentication, over HTTPS. The provider also sees normal connection metadata, including the IP address. Readers send no generation prompts. Installation, key-creation, login, and dashboard links open in the external browser only on user action.

Cypher does not anonymize traffic from configured services, third-party CLIs, or the external browser. System proxy variables and enterprise certificates may affect this traffic. Do not share raw diagnostics from these tools without reviewing them.

## GitHub sources and screenshots

Screenshots provided in docs/screenshots are generated from the browser preview without access to the machine's CLIs or accounts. User data, private environments, signing keys, dumps, and test reports are excluded from the repository. Executables use an explicit file allowlist and a separate check of the produced archive.
