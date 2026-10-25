# Capabilities and limitations — initial release

## Windows distribution — 0.4.5

The distributed executables target Windows x64. The application runtime is included: Node.js is not required to open Cypher. Each user must install the CLIs for the services they want to connect, then authorize their own profiles in Connections. No developer account is included in the distribution.

Detection skips broken npm launchers and continues searching for a valid installation. Claude Desktop is not treated as the Claude Code CLI. Ollama and LM Studio servers can be authorized even without a CLI installed on the PC, at their predefined loopback addresses.

After building, `npm run test:clean-machine` launches the executable with an empty user profile and a PATH without Node or CLIs. It checks startup, the absence of inherited accounts/consent, installation links, and the offered access to local servers. It simulates a first launch on this Windows installation; it does not certify another PC, Windows 11, enterprise proxies, or every antivirus product.

Codex quotas are implemented. Poe, DeepSeek API, OpenRouter, and fal.ai support API-key reads of points/balance/budget. Together AI reads spending for finalized days of the month. OpenAI API and Anthropic API support organization spending reads with an admin key. These explicitly entered keys are encrypted using Windows DPAPI. The API connectors were tested with simulated responses; validation with their real accounts remains outstanding.

Claude and Gemini quotas and connections for services marked “Planned” remain to be developed. An available connection does not mean the service's quota is accessible. See the [full catalog matrix](docs/catalog-coverage.md) for the 36 services, their access requirements, and remaining work.

No provider is presented as universally connected. The sources below are implemented; accounts on this PC are not queried before consent in Connections.

| Service | Detection | Account / plan | Quota |
|---|---|---|---|
| Codex CLI | PATH, npm, VS Code extension | `codex app-server`, `account/read`, after consent | `account/rateLimits/read`, server windows when a ChatGPT subscription and response are available |
| Claude Code | PATH, npm, VS Code extension | `claude auth status --json`, after consent | Not accessible through an implemented public API; open Claude Usage |
| Gemini CLI | PATH, npm; profiles through home/.gemini | Official terminal login; server-side account verification not implemented | Not implemented; do not confuse AI Studio with a Gemini subscription |
| OpenCode / Aider / Continue | Installation/configuration depends on the tool | Upstream provider | No separate quota or double counting |
| Ollama / LM Studio | CLI and known paths | No cloud account | Local inventory through loopback API after consent; no fabricated quota |
| llama.cpp / vLLM | Local server on default port | No cloud account | Local inventory through loopback API after consent |
| Poe / DeepSeek API / OpenRouter | No CLI required | Explicit API key | Poe points, DeepSeek balance, OpenRouter key budget and monthly spending |
| OpenAI API / Anthropic API | No CLI required | Explicit admin key | Organization spending since the start of the UTC month, separate from a subscription quota |
| fal.ai / Together AI | No CLI required | API key with appropriate billing permissions | fal balance; Together costs for finalized days of the UTC month |
| Cursor / Windsurf / Copilot | CLI/app/extension depending on the product | Not implemented | Not implemented |
| Other catalog entries | Catalog only | Planned | Planned |

The Codex protocol source was checked against the installed CLI using `codex app-server generate-ts`, including RateLimitWindow, RateLimitSnapshot, GetAccountRateLimitsResponse, and Account. The protocol is experimental: changes may require an update. No generation request is made. No cloud cookies or private endpoints are used.
Background reads launch known Node entry points without a shell. On-demand connection opens a Windows terminal through a script with fixed commands and validated/escaped paths. No arbitrary command text is accepted from the renderer. Unknown npm launchers are rejected. A configuration file alone never establishes an installation or subscription.
Conversational ChatGPT quotas are not Codex quotas. Local activity figures do not replace server quotas. Billed APIs remain separate from chat subscriptions.

FR/EN are available. Multiple Codex/Claude/Gemini profiles are supported with independent permissions. Discovery is bounded to standard and suffixed Codex/Claude directories, environment overrides, and the manual registry. Gemini uses a home containing .gemini; custom locations can be added manually. Profiles managed by the widget are rediscovered through registry.json. Adding an account creates a new folder without copying credentials from another profile. No login occurs without a click; the official flow remains under human control. Claude/Gemini quota limitations do not change merely because login is accessible.

For final verification and machine-specific limitations, see VERIFICATION.md generated at delivery.
