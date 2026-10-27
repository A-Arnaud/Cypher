<div align="center">
  <a href="https://cypher-os.me/"><img src="docs/brand/wordmark.png" alt="Cypher" width="230"></a>
  <p><strong>Your AI usage, always in view.</strong><br>
  Monitor provider-reported quotas, API balances and local model availability<br>
  from a desktop widget, the Windows taskbar or the macOS menu bar.</p>
  <p><a href="https://cypher-os.me/"><img src="docs/brand/website.png" alt="Visit the Cypher website at cypher-os.me" width="340"></a></p>
  <p><strong><a href="https://github.com/A-Arnaud/Cypher/releases/tag/v0.5.0">Download for Windows</a> · <a href="https://github.com/A-Arnaud/Cypher/releases/tag/v0.5.1-mac.1">Download for macOS (preview)</a></strong></p>
  <p><a href="https://github.com/A-Arnaud/Cypher/releases/download/v0.5.0/Cypher-Setup-0.5.0-win-x64.exe">Installer · 0.5.0</a> · <a href="https://github.com/A-Arnaud/Cypher/releases/download/v0.5.0/Cypher-0.5.0-win-x64.exe">Portable</a> · <a href="https://github.com/A-Arnaud/Cypher/releases/download/v0.5.0/SHA256SUMS-0.5.0.txt">SHA-256</a></p>
  <p>
    <a href="https://github.com/A-Arnaud/Cypher/releases/latest"><img src="https://img.shields.io/badge/release-v0.5.0-ed8fae" alt="Release 0.5.0"></a>
    <img src="https://img.shields.io/badge/Windows_10_%2F_11-x64-292d35?logo=windows&amp;logoColor=white" alt="Windows 10 / 11 x64">
    <a href="PRIVACY.md"><img src="https://img.shields.io/badge/local-first-91cbb2" alt="Local first"></a>
    <a href="https://github.com/A-Arnaud/Cypher/actions/workflows/security.yml"><img src="https://github.com/A-Arnaud/Cypher/actions/workflows/security.yml/badge.svg?branch=main" alt="Security and Windows Server validation on main (not Windows 11 device certification)"></a>
    <a href="https://github.com/A-Arnaud/Cypher/actions/workflows/macos.yml"><img src="https://github.com/A-Arnaud/Cypher/actions/workflows/macos.yml/badge.svg?branch=main" alt="macOS Apple Silicon and Intel validation on main"></a>
  </p>
  <p><a href="https://cypher-os.me/">Website</a> &middot; <a href="#get-started">Get started</a> · <a href="#what-works-today">Provider status</a> · <a href="#screenshots">Screenshots</a> · <a href="SECURITY.md">Security</a> · <a href="PRIVACY.md">Privacy</a> · <a href="SUPPORT.md">Support</a> · <a href="CONTRIBUTING.md">Contribute</a> · <a href="https://github.com/A-Arnaud/Cypher/issues">Issues</a></p>
</div>

| Platform | Download | System indicator |
| --- | --- | --- |
| Windows 10 / 11 x64 · **0.5.0 stable** | [Installer](https://github.com/A-Arnaud/Cypher/releases/download/v0.5.0/Cypher-Setup-0.5.0-win-x64.exe) · [Portable](https://github.com/A-Arnaud/Cypher/releases/download/v0.5.0/Cypher-0.5.0-win-x64.exe) · [SHA-256](https://github.com/A-Arnaud/Cypher/releases/download/v0.5.0/SHA256SUMS-0.5.0.txt) | Windows taskbar / notification area |
| Mac Apple Silicon · **0.5.1-mac.1 preview** | [DMG](https://github.com/A-Arnaud/Cypher/releases/download/v0.5.1-mac.1/Cypher-0.5.1-mac.1-mac-arm64.dmg) · [ZIP](https://github.com/A-Arnaud/Cypher/releases/download/v0.5.1-mac.1/Cypher-0.5.1-mac.1-mac-arm64.zip) · [SHA-256](https://github.com/A-Arnaud/Cypher/releases/download/v0.5.1-mac.1/SHA256SUMS-mac-arm64.txt) | macOS menu bar, **top right** |
| Mac Intel · **0.5.1-mac.1 preview** | [DMG](https://github.com/A-Arnaud/Cypher/releases/download/v0.5.1-mac.1/Cypher-0.5.1-mac.1-mac-x64.dmg) · [ZIP](https://github.com/A-Arnaud/Cypher/releases/download/v0.5.1-mac.1/Cypher-0.5.1-mac.1-mac-x64.zip) · [SHA-256](https://github.com/A-Arnaud/Cypher/releases/download/v0.5.1-mac.1/SHA256SUMS-mac-x64.txt) | macOS menu bar, **top right** |

The [macOS installation guide](MACOS.md) covers choosing your processor, first launch and Terminal connections. **Both Mac downloads require macOS 13 Ventura or later**; Intel uses `x64`, Apple Silicon uses `arm64`. The Mac preview has an ad-hoc signature and is not Apple-notarized. macOS 15 Apple Silicon and Intel automation passed; hands-on device and live-account validation remain outstanding. Windows remains the stable release.

One Windows x64 download, with a desktop widget for Windows 10 and 11. Windows 10 keeps the embedded taskbar indicator; Windows 11 uses the notification area instead. **Windows 11 device validation is still pending** — see the [compatibility matrix](#windows-compatibility) and [verification notes](VERIFICATION.md).

<a href="https://github.com/A-Arnaud/Cypher/releases/latest"><img src="docs/brand/hero.png" alt="Cypher: your AI usage, always in view. Product preview with synthetic quota values." width="100%"></a>

## Why Cypher

- **Keep usage beside your work.** Switch between compact rows, detailed cards and a native taskbar indicator.
- **Read only what you authorize.** Grant access per CLI profile or enter a supported API key explicitly. No telemetry or browser-cookie collection.
- **See the limits of the data.** Missing and stale readings are marked. API spending, balances and subscription quotas keep their own meaning.

## Choose your path

**Try it:** [Windows setup](#get-started) · [Mac setup](MACOS.md) · **Check compatibility:** [provider status](#what-works-today) · **Need help:** [FAQ](SUPPORT.md#faq) or [report an issue](https://github.com/A-Arnaud/Cypher/issues/new/choose) · **Build with us:** [contributor guide](CONTRIBUTING.md).

<table>
  <tr>
    <td width="33%" align="center"><a href="#desktop-widget"><img src="docs/brand/card-widget.png" alt="Desktop widget: the essentials in one small window" width="100%"></a></td>
    <td width="33%" align="center"><a href="#windows-taskbar"><img src="docs/brand/card-taskbar.png" alt="Windows taskbar: keep quotas beside your work" width="100%"></a></td>
    <td width="33%" align="center"><a href="#connections"><img src="docs/brand/card-connections.png" alt="Connections: choose exactly what Cypher can read" width="100%"></a></td>
  </tr>
</table>

- **Desktop widget:** pin your profiles, reorder them, and switch between compact rows and detailed cards.
- **Windows taskbar:** keep a small quota indicator visible and click it to open the full window.
- **Connections:** grant read access to individual CLI profiles, add a supported API key, or check a local model server.

---

## Get started

For **macOS**, use the separate [Mac downloads and installation guide](MACOS.md). The steps below cover **Windows**.

1. Open the [latest release](https://github.com/A-Arnaud/Cypher/releases/latest).
2. Download **`Cypher-Setup-0.5.0-win-x64.exe`** for installation and Windows startup, or **`Cypher-0.5.0-win-x64.exe`** for portable use.
3. Open **Connections** and choose a supported provider. Existing CLI profiles require your permission before account reads; API connections require a key you enter explicitly.
4. Pin your profiles. Use **Widget** for compact rows or **Put in taskbar** for the Windows indicator.

**Requirements:** Windows 10 or Windows 11 x64. End users do not need Node.js. CLI connections need the relevant official CLI; API and local-server connections do not. Fresh installs open in English; French remains available in Settings.

The executables are **not Authenticode-signed**, so Windows may display a warning. Check the release's SHA-256 file before running a download. No administrator rights are required. The portable app extracts Electron at launch and does not support automatic Windows startup.

## Desktop widget

Keep only the profiles you need in a compact, draggable window. Reorder by dragging a handle or using the keyboard. Open **Details** for quota windows, balances, points and reset times when the provider exposes them.

Change opacity, always-on-top behavior, the keyboard shortcut and refresh interval in Settings. The default interval is **60 seconds after a collection completes**; errors use exponential backoff up to 15 minutes. Pause suspends collection. Refresh starts a new read immediately.

**Ctrl+Alt+Q** shows or hides Cypher. Closing or hiding the window keeps collection running; **Quit** stops the application.

## Windows taskbar

On Windows 10, use **Put in taskbar** to reserve a small area next to your existing taskbar content. It shows up to three pinned profiles and a `+N` count. Click the indicator to open the full window.

On Windows 11, Cypher uses the native **notification area (system tray)** instead of modifying Explorer. Quotas are available in the icon tooltip and menu; open the desktop widget when you want the numbers permanently visible. Windows may put the icon under the hidden-icons arrow. This is not an embedded text indicator in the Windows 11 taskbar. Both compact indicators show available remaining percentages only; balances, spending, points and model counts remain available in the widget/details, not in the indicator.

The installed or extracted app can launch with Windows. Startup is independently configurable in Settings. Leaving taskbar mode keeps your startup preference.

### Windows compatibility

| Environment | Presentation | Verification boundary |
| --- | --- | --- |
| Windows 10 x64 | Desktop widget + embedded indicator on a horizontal primary taskbar | Local native checks; other taskbar/DPI configurations remain unverified |
| Windows 11 x64 | Desktop widget + native notification-area quota tooltip/menu | OS-selection and fixture tests; real Windows 11 device validation pending |
| Unknown/newer Windows shell | Conservative notification-area path; no legacy Explorer manipulation | Not certified |

The installer and portable executable are shared across Windows 10/11 x64; ARM64 is not a native target. Hosted GitHub Windows Server checks are build/automation coverage, not Windows 11 desktop certification. See [verification notes](VERIFICATION.md) for exact evidence and remaining checks.

## Connections

CLI profiles stay independent. Cypher does not overwrite another account to add a new one. Shared quotas are flagged only when a reliable provider identity confirms the same account.

Unknown data stays unknown. A dash is unavailable data, never a fabricated zero. Stale values are marked, subscription quotas are not added together, and API billing remains separate from chat subscriptions.

### What works today

| Status | Connection | Available today / boundary |
| --- | --- | --- |
| Implemented | **Codex** | Account and provider quota windows through an authorized, signed-in CLI profile; fields depend on the provider |
| Partial | **Claude Code** | CLI login and account status; subscription quotas are not implemented |
| Partial | **Gemini CLI** | Detection and profile sign-in flow; account plan and quota reads are not implemented |
| Implemented | **OpenRouter, DeepSeek, Poe** | Key budget/monthly spending, available API balance or points respectively; provider-specific units and permissions |
| Implemented | **fal.ai** | Available credit balance/currency with billing usage read permission; not a chat subscription quota |
| Implemented | **OpenAI, Anthropic, Together AI APIs** | Organization spending; key permissions vary and Together excludes the current day. Not a remaining quota or guaranteed prepaid balance |
| Implemented | **Ollama, LM Studio, llama.cpp, vLLM** | Model lists from fixed loopback endpoints after authorization; no cloud quota |
| Discovery only | **Cursor, Windsurf, Copilot, OpenCode, Aider, Continue** | Installation/configuration discovery or upstream billing guidance; no account/quota connector |
| Planned | **ChatGPT, Perplexity and other planned catalog entries** | Provider links only; no implemented account/quota read |

**Implemented** means connector code exists, not universal live-account validation. API collectors have synthetic-response test coverage; real-account validation remains outstanding. **Partial**, **discovery only** and **planned** do not imply quota support. See the [full coverage matrix](docs/catalog-coverage.md), [verification evidence](VERIFICATION.md) and [privacy policy](PRIVACY.md).

## Screenshots

<details>
<summary><strong>See the interface</strong></summary>

<p align="center">
  <img src="docs/screenshots/api-widget-synthetic.png" alt="Compact widget with synthetic API balances and points" width="350">
  <img src="docs/screenshots/api-details-synthetic.png" alt="Detailed provider cards with synthetic API values" width="350">
</p>

Screenshots use account-free previews and synthetic values. They do not display a developer's account or prove live provider availability.

</details>

---

## Privacy and security

- No telemetry, browser-cookie collection or AI messages.
- CLI account reads require permission for the selected profile.
- API keys entered in Connections are encrypted locally with Windows DPAPI or the macOS Keychain and removable in the app.
- The renderer is sandboxed with context isolation, validated IPC and a restrictive production content security policy.
- Profiles, keys, preferences, diagnostics and build outputs are excluded from Git. Publication checks scan sources, Git history and the packaged archive.

Local encryption does not protect against malicious software running as your user. Provider requests still reach the selected provider. These safeguards and scans are not an independent security certification. Read [Security](SECURITY.md) and [Privacy](PRIVACY.md) before connecting an account.

## Development

Mac contributors: use the [macOS build and test commands](MACOS.md#verification-and-builds). The following commands and native helper requirements cover Windows.

Use **Node.js 24** and npm on Windows. The native taskbar helper also uses the Windows .NET Framework 4.x C# compiler. Browser tests use Microsoft Edge.

```powershell
npm ci
npm run dev
```

```powershell
npm run typecheck
npm test
npm run test:ui
npm run security:scan
npm run security:secrets
npm run dist
npm run security:release
```

`npm run build:test` creates a separate test package for isolated Electron checks, never a release artifact. Production executables disable the inspection facilities used by these tests. See [Contributing](CONTRIBUTING.md), [implementation notes](docs/IMPLEMENTATION-NOTES.md) and [verification](VERIFICATION.md).

## Help improve Cypher

[Report a bug, suggest a feature or request a provider](https://github.com/A-Arnaud/Cypher/issues/new/choose). Small documentation improvements, reproducible Windows reports and synthetic provider fixtures are useful starting points; see [Contributing](CONTRIBUTING.md) before changing code. Read [Security](SECURITY.md#reporting-a-vulnerability) for vulnerability reports instead of opening a normal issue.

No API keys, CLI credentials, cookies or private account data belong in an issue, pull request, log or screenshot. See the [changelog](CHANGELOG.md) for shipped changes and the [launch checklist](docs/launch-checklist.md) for release and discovery preparation.
