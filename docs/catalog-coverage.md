# Catalog coverage — Cypher 0.7.0

Goal: cover every service in the catalog. This goal has not yet been reached.

“Implemented” describes the code and tests performed; it does not guarantee a real account at every provider. Current distributions cover Windows 10/11 x64 and macOS Intel/Apple Silicon. API connector checks use synthetic responses and real Electron IPC. Earlier authorized Codex readings are recorded in [verification history](../VERIFICATION.md); they do not establish live validation for every current account or platform.

| Service | Status in this release | Remaining work or access |
|---|---|---|
| Codex | Account, plan, server quotas and browser sign-in with the included component on Windows/Mac | Live browser completion, other CLI versions and accounts need validation |
| Claude Code | Detection, login, and account status | Subscription quota connector to develop |
| Gemini CLI | Detection, profiles, and official login | Account verification and quotas to develop |
| OpenCode | Detection; billing identified as belonging to the upstream provider | Upstream account association to develop |
| Aider | Detection; billing identified as belonging to the upstream provider | Upstream account association to develop |
| Continue | Extension detection, upstream provider | Upstream account association to develop |
| Ollama | Local inventory after authorization, port 11434 | Custom and authenticated configurations to add |
| LM Studio | Local inventory after authorization, port 1234 | Custom and authenticated configurations to add |
| llama.cpp | Local inventory after authorization, port 8080 | Custom and authenticated configurations to add |
| vLLM | Local inventory after authorization, port 8000 | Custom and authenticated configurations to add |
| Cursor | Detection | Account and usage to develop; distinguish individual accounts from team admin access |
| Windsurf | Detection | Account and usage to develop |
| GitHub Copilot | Extension detection | GitHub authentication and usage for individual/organization accounts to develop |
| ChatGPT | Provider link | No verified conversational quota connector; Codex quotas do not replace these |
| Perplexity | Provider link | Chat subscription and API usage to study separately |
| Poe | Available points through API key | Validation with a real account |
| Le Chat | Provider link | Subscription connector to develop |
| DeepSeek Chat | Provider link | Chat connector to develop; the DeepSeek API balance is not a chat quota |
| Grok | Provider link | Subscription connector to develop; distinguish xAI API billing |
| OpenAI API | Organization spending since the start of the UTC month, admin key | Validation with a real account; not a balance or ChatGPT quota |
| Anthropic API | Organization spending since the start of the UTC month, admin key | Validation with a real account; not a Claude Code quota |
| Google AI Studio | Provider link | Google authentication, project, and usage connector to develop |
| OpenRouter | Key budget and monthly API spending | Validation with a real account; a key budget is not the account balance |
| Mistral API | Provider link | Enterprise Admin API, access is not self-service; connector to develop |
| DeepSeek API | Balance and currency through API key | Validation with a real account |
| Groq | Provider link | Account/limits connector to develop |
| Together AI | Monthly spending for finalized days, API key | Validation with a real account; the current day is not included |
| Fireworks AI | Provider link | Account/usage connector to develop |
| xAI API | Provider link | Management key, team, and billing connector to develop |
| Cohere | Provider link | Account/usage connector to develop |
| Hugging Face | Provider link | Account/usage connector to develop |
| Replicate | Provider link | Account/usage connector to develop |
| fal.ai | Balance and currency, key with billing:usage:read permission | Validation with a real account |
| Azure OpenAI | Provider link | Azure authentication, subscription, resources, and billing read roles to integrate |
| AWS Bedrock | Provider link | AWS authentication and Cost Explorer/CloudWatch access to integrate |
| Vertex AI | Provider link | Google Cloud authentication, project, and read roles to integrate |

## Connector sources and verified restrictions

- [Codex App Server](https://learn.chatgpt.com/docs/app-server): account reads and ChatGPT limits used by Codex.
- [OpenRouter — current key](https://openrouter.ai/docs/api/api-reference/api-keys/get-current-api-key): `limit`, `limit_remaining`, `usage_monthly`.
- [DeepSeek — balance](https://api-docs.deepseek.com/api/get-user-balance/): API balance amounts and currency.
- [Poe — Usage API](https://creator.poe.com/docs/resources/usage-api): available points, including plan points and added points.
- [OpenAI — Costs](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage/methods/costs): cost amounts in dollars.
- [Anthropic — Usage and Cost API](https://platform.claude.com/docs/en/manage-claude/usage-cost-api): admin access and amounts in cents, separate from Claude subscriptions.
- [fal — Account Billing](https://fal.ai/docs/platform-apis/v1/account/billing): balance, currency, and billing:usage:read permission.
- [Together — Billing usage](https://docs.together.ai/reference/billing-usage): costs for finalized days and pagination; no balance inferred from spending.
- [Mistral — Admin API](https://docs.mistral.ai/admin/admin-api/overview): Enterprise; access must be requested from the provider.
- [xAI — Management API](https://docs.x.ai/developers/rest-api-reference/management): separate management key and team access.

## Distribution validation

Windows x64, Mac Intel and Mac Apple Silicon are delivered together. Windows first-launch tests use an empty home containing spaces, a PATH without Node/CLIs, and isolated preferences. They check consent isolation, seven APIs with synthetic responses and DPAPI storage. Both Mac architectures have separate native, bundled-component and final-package checks. These checks do not certify every live provider account, Windows 11 physical device, proxy or display configuration. [Exact release evidence](../VERIFICATION.md).

Keys are entered explicitly in Connections. They are stored through Electron safeStorage using Windows DPAPI or macOS Keychain protection, and are never exposed by getState. Personal browser cookies are not imported; browser-created sessions stay in independent app-managed CLI profiles. Disconnecting an API key deletes the stored key and removes consent. Requests from API collectors are GETs to predefined hosts, with redirects prohibited; no AI content is generated to measure a balance.
