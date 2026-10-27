# Capabilities and limitations

## FAQ

**Why is Cypher absent from the Mac Dock? How do I reopen or quit it?** Cypher 0.5.4 stays in the **top menu bar**, like other discreet Mac utilities. Click its icon and choose **Show / Hide** to open the window or **Quit** to stop it. **Control+Option+Q** and reopening Cypher from Applications also restore its window. If you pinned an older version to the Dock, remove that favorite once using **Options → Remove from Dock**. [Mac guide](MACOS.md#a-discreet-menu-bar-app).

**How do I keep Cypher in the bar or close it?** Use the labelled **Move to taskbar** button on Windows (bottom of the screen) or **Move to menu bar** on Mac (top right). Closing the window offers **Minimize**, **Quit Cypher** and **Cancel**. Minimize keeps collection running; Quit stops Cypher. If the indicator cannot start, the window stays open. [Widget guide](docs/user-guide.md).

**Where do I download Cypher?** Open [the latest download page](https://github.com/A-Arnaud/Cypher/releases/latest). It contains Windows 10/11, Mac Intel and Mac Apple Silicon on one page. Use the [download guide](docs/downloads.md) if you are unsure which file to choose.

**Where are the quotas on Mac?** Choose **Move to menu bar**. The indicator appears in the macOS menu bar at the top right, with up to three pinned percentage readings. Its menu can show/hide the widget, refresh, pause or quit. A dash means unavailable percentage data; balances and model counts remain in the widget. On a display with a camera notch or many menu bar items, macOS may limit available space. See [the Mac guide](MACOS.md).

**Why is the Mac application grayed out or marked incompatible?** First check your macOS version and downloaded architecture. This release requires **macOS 13 Ventura or later**. Intel Macs need the `mac-x64` download; `mac-arm64` is for Apple Silicon. A security exception does not make an unsupported OS or architecture compatible. If both requirements are met, report the exact Finder message and filename so the failure can be diagnosed.

**Why does macOS block the first launch?** The current Mac download has no Apple Developer ID or notarization. Follow the [first-launch instructions](MACOS.md#first-launch) after checking the checksum. For optional automatic startup, move Cypher into Applications and enable **Settings → Open at login**. Cypher shows any pending macOS approval or registration error. At sign-in, it opens directly in the menu bar.

**Why is my quota missing although the tool is installed?** Detection does not establish a signed-in account, permission or a working quota connector. Check [provider status](README.md#what-works-today), then authorize the intended profile in Connections. Claude Code and Gemini quota reads are not implemented. Missing data is not zero usage.

**Does Cypher need my chat password or browser cookies?** No. Use the official CLI login flow for CLI profiles or enter a supported API key in Connections. Do not share that key or any CLI credentials in an issue. See [Privacy](PRIVACY.md).

**Do I have to install a CLI to connect?** For Codex browser sign-in in 0.5.4, no. Expand **More ways to connect** and choose **Sign in with your browser**. The official authentication component is included and keeps the account separate in Cypher. Existing profiles still appear under Automatic detection. Claude and Gemini currently require their CLI for subscription-account sign-in; API-key connections do not require a CLI and read separate API billing data. See [connection methods](docs/connection-methods.md).

**Is Windows 11 supported?** Cypher 0.5.0 adds an OS-selected notification-area mode for Windows 11 while retaining the desktop widget. It does not modify the Windows 11 taskbar or embed text inside it. The same x64 installer/portable build serves Windows 10 and 11. Runtime behavior on a real Windows 11 device remains unverified; OS-selection, tray lifecycle and UI fixture tests are not device certification. Windows 10 retains its existing embedded indicator on a horizontal primary taskbar. Include the exact Windows build (`winver`) and chosen mode when reporting a problem.

**Where are the quotas on Windows 11?** Look for the Cypher firefly in the notification area, possibly under the hidden-icons arrow. Hover over it for a compact quota summary or open its menu. **The notification-area summary currently shows only available remaining percentages**, just like the Windows 10 embedded indicator; API balances, spending, points and local model counts require the desktop widget or detailed view. A dash in the notification area means no percentage is available, even when another unit is known in the widget. This release does not add Claude/Gemini quota connectors.

**Where can I get help or request a provider?** Check existing [issues](https://github.com/A-Arnaud/Cypher/issues), then use the [bug, feature or provider request form](https://github.com/A-Arnaud/Cypher/issues/new/choose). Include the Cypher version, Windows build (`winver`) or macOS version, processor architecture, install type and minimal reproduction steps. Logs and screenshots are optional and must be sanitized. Never attach API keys, CLI credentials, cookies or private account data. Use [the security policy](SECURITY.md#reporting-a-vulnerability) for vulnerability reports.

## Windows distribution — connector scope introduced in 0.4.5

The distributed executables target Windows x64. The application runtime is included: Node.js is not required to open Cypher. CLI connections require the relevant installed CLI and permission for the intended profile in Connections; API and local-server connections do not require a CLI. No developer account is included in the distribution.

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
