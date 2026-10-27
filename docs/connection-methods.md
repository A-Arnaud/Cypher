# Connection methods

These choices are available in **Cypher 0.6.0 for Windows and macOS**. Earlier Windows 0.5.0 packages retain their earlier CLI/API connection interface.

Connections starts with **Automatic detection**. Existing profiles remain separate and require explicit permission before Cypher reads them. Detecting a profile does not authorize it, sign it in or prove its subscription.

**More ways to connect** offers methods supported by the selected provider:

| Provider | Browser sign-in without external CLI | Installed CLI/profile | API alternative |
| --- | --- | --- | --- |
| Codex | Included official Codex account/auth component; opens the system browser | Existing CLI login, add independent account, choose executable or import folder | OpenAI organization API spending; separate billing and credentials |
| Claude Code | Not implemented | Existing official CLI login and independent profiles | Anthropic organization API spending; separate billing and credentials |
| Gemini CLI | Not implemented | Existing official CLI login and profile import | No Gemini API billing collector implemented |
| Other API connectors | Provider key creation/dashboard link, not subscription OAuth | Not required | Existing API-key collectors |

## Codex browser login

The build includes the unmodified, pinned official `@openai/codex` 0.164.0 native executable for the target OS/architecture, plus its Apache license and notice. It does not install a global CLI, Node runtime, system startup entry or provider desktop application. Package-lock integrity controls the build dependency. The packaging hook rejects a runtime built for a different target architecture.

Cypher starts the helper through stdio with a profile-specific `CODEX_HOME`, filtered environment, fixed authentication commands and no generation prompts. The official helper manages the browser callback and token storage. The new account lives in its own Cypher profile; existing account files are not copied or overwritten.

The app accepts only HTTPS authorization URLs on exact official OpenAI hosts and opens them in the system browser. No passwords, OAuth tokens or authorization URL are exposed through renderer IPC or logs. Completion must match the current login ID; only success grants read access and pins the new profile. Cancel, timeout or failure closes the app-owned helper, clears pending state and never fabricates a connected account. Profiles from cancelled attempts can be reconnected later.

When no external Codex CLI exists, the included helper can also read an explicitly authorized existing Codex profile. Its presence is marked as a built-in connector, not an externally installed app. Claude/Gemini behavior and quota limitations are unchanged.

Provider sign-in and quota availability are separate. Tests use synthetic subprocess responses and empty profiles; live account completion remains a manual validation step. The current Mac release remains unnotarized until Apple credentials are supplied.

References: [official Codex app-server](https://learn.chatgpt.com/docs/app-server), [bundled license](../assets/licenses/CODEX-LICENSE.txt), [upstream notice](../assets/licenses/CODEX-NOTICE.txt).
