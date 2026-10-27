<div align="center">
  <img src="docs/brand/wordmark.png" alt="Cypher" width="230">
  <h1>Cypher — AI Quota Monitor</h1>
  <p><strong>Track your AI quotas on Windows and macOS.</strong><br>Codex subscription quotas, supported API balances and local model availability.</p>
  <p>
    <a href="https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-Setup-0.7.0-win-x64.exe"><img src="https://img.shields.io/badge/Download-Windows_10_%2F_11-2f6feb?style=for-the-badge" alt="Download Cypher for Windows 10 or Windows 11"></a>
    <a href="https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-0.7.0-mac-x64.dmg"><img src="https://img.shields.io/badge/Download-Mac_Intel-414956?style=for-the-badge" alt="Download Cypher for Mac Intel"></a>
    <a href="https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-0.7.0-mac-arm64.dmg"><img src="https://img.shields.io/badge/Download-Mac_Apple_Silicon-c06b8d?style=for-the-badge" alt="Download Cypher for Mac Apple Silicon"></a>
  </p>
  <p><a href="#download">Downloads</a> · <a href="#get-started">Quick start</a> · <a href="#what-works-today">Supported services</a> · <a href="SUPPORT.md">Help</a> · <a href="docs/demarrage-fr.md">Français</a></p>
</div>

## Download

**Current release: 0.7.0 for Windows and Mac. Choose your computer to download the app directly.**

| Your computer | Download | Requirements |
| --- | --- | --- |
| **Windows 10 or Windows 11** | **[Download for Windows](https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-Setup-0.7.0-win-x64.exe)** | Windows x64 · same installer for both versions |
| **Mac with an Intel processor** | **[Download for Mac Intel](https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-0.7.0-mac-x64.dmg)** | macOS 13 Ventura or later |
| **Mac with an Apple chip (M1, M2, M3…)** | **[Download for Mac Apple Silicon](https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-0.7.0-mac-arm64.dmg)** | macOS 13 Ventura or later |

**Which Mac do I have?** Open **Apple menu → About This Mac**. If it says **Intel**, choose Mac Intel. If it says **Chip: Apple M…**, choose Apple Silicon.

[Portable Windows, Mac ZIP and checksums](docs/downloads.md#other-downloads) · [All downloads and release notes](https://github.com/A-Arnaud/Cypher/releases/latest)

**Windows command line:** WinGet registration is in progress for `AArnaud.Cypher`. [Command and publication status](docs/winget.md). Use the downloads above until the package is available in Microsoft's catalog.

## Get started

1. **Install.** On Windows, run the installer. On Mac, open the DMG and drag **Cypher.app** into **Applications**.
2. **Connect.** Open **Connections**. Cypher detects existing profiles first; authorize the ones you want to read. **More ways to connect** also offers Codex browser sign-in without installing a CLI, plus CLI and API-key alternatives.
3. **Keep it visible.** Pin your accounts, then click **Move to taskbar** on Windows (bottom of the screen) or **Move to menu bar** on Mac (top right). The button is labelled in both the widget and detailed view.

You do not need Node.js to run Cypher. English and French are available in Settings.

**Updating an existing installation?** Quit Cypher completely, replace or update the app, then reopen it. On Mac, this stops the previous version's Dock behavior. [Update instructions](docs/downloads.md#update-cypher).

**Start automatically, stay in the bar.** In **Settings**, enable **Start with Windows** or **Open at login** on Mac. At sign-in, Cypher opens directly in the bottom Windows taskbar or top Mac menu bar without showing its window, even if you previously removed the indicator. This is optional; moving Cypher into the bar never enables automatic startup by itself. On Mac, move the app into Applications first and approve it in Login Items if macOS requests it.

**First-launch security prompts:** Windows may show a SmartScreen warning; Mac may require **Privacy & Security → Open Anyway**. These builds are not publisher-signed/notarized. [Installation help](docs/downloads.md#first-launch).

<a href="#download"><img src="docs/brand/hero.png" alt="Cypher desktop widget and detailed view, using synthetic example values" width="100%"></a>

## Why Cypher

- **See usage beside your work.** Compact widget, detailed cards and a system indicator.
- **Choose what to connect.** Independent profiles, explicit read permission and supported API-key connections.
- **Keep data local.** No telemetry, browser-cookie collection or AI messages. Missing readings stay unknown; API billing stays separate from subscriptions.

<a id="desktop-widget"></a>
<a id="windows-taskbar"></a>
<a id="windows-compatibility"></a>

## Windows and Mac

| Platform | Where Cypher appears |
| --- | --- |
| **Windows 10** | Desktop widget + embedded indicator on the primary horizontal taskbar |
| **Windows 11** | Desktop widget + notification-area icon, tooltip and menu; the icon may be under hidden icons |
| **macOS** | Desktop widget + native menu bar indicator **at the top right**, on Intel and Apple Silicon. No running-app icon in the Dock or Command-Tab |

**Mac works:** Intel use has been confirmed by the maintainer, and Intel / Apple Silicon builds pass automated checks. See the [Mac guide](MACOS.md) for setup and [verification record](VERIFICATION.md) for tested environments.

**Discreet on Mac:** Cypher stays in the top menu bar even when you open its window or Settings. Click its menu bar icon and choose **Show / Hide** to open the window, or use **Control+Option+Q**. Choose **Quit** in that menu to stop Cypher completely.

Closing the window asks you to **minimize into the bar**, **quit Cypher**, or **cancel**. Minimizing keeps collection running and checks that the indicator is available before hiding the window. The default show/hide shortcut is **Ctrl+Alt+Q** on Windows and **Control+Option+Q** on Mac. [Widget and indicator guide](docs/user-guide.md).

## Discreet update proposals

**On 0.5.x? Install the current version once** to enable update checking. Cypher 0.6.0 and later already contain the checker. Cypher then checks GitHub's stable releases after startup and every six hours, showing a small footer/menu action. It asks before downloading; **Later** hides the notice for 24 hours. Controls are in **Settings → Updates**.

On **installed Windows**, approval downloads, verifies, installs and restarts Cypher in the bar. **Current Mac builds and Windows portable/extracted copies** open the official download for manual replacement. Mac native automatic installation still requires the Apple signing setup. [Update behavior and limits](docs/updates.md).

## Recent updates

| Version | Included changes |
| --- | --- |
| **0.7.0 — current** | Quick actions with Ctrl+K / ⌘K, actionable profile status, reading ages and private diagnostic reports |
| **0.6.0** | Discreet update proposals, approved Windows installer updates and Mac/portable download guidance |
| **0.5.4** | Discreet Mac menu bar app: no running-app icon in the Dock or Command-Tab, including after reopening Settings |
| **0.5.3** | Optional startup from Cypher Settings; login launches go directly into the bar without opening the window |
| **0.5.2** | Visible bar-placement button, Minimize / Quit / Cancel closing choices, and Codex browser sign-in on both Windows and Mac |

[Current release notes](docs/releases/0.7.0.md) · [Release history](docs/releases/README.md) · [Full changelog](CHANGELOG.md)

## Connections

**Find anything quickly.** Click **Quick actions**, or press **Ctrl+K** on Windows / **⌘K** on Mac, to find a pinned profile, connection or action. **Needs attention** filters profiles requiring action; each card shows the age/source of its last reading. **Settings → Diagnostics** offers a private JSON report for troubleshooting. [Navigation and status guide](docs/navigation-and-diagnostics.md).

Existing profiles come first. Additional methods depend on the provider and downloaded version: [connection options](docs/connection-methods.md).

### What works today

| Connection | What Cypher can show |
| --- | --- |
| **Codex** | Account and provider-reported quota windows; browser sign-in without a separate CLI on **Windows and Mac** |
| **Claude Code / Gemini CLI** | CLI detection and sign-in; Claude account status. Subscription quota reads are not implemented |
| **OpenRouter, DeepSeek, Poe, fal.ai** | Supported key budgets, API balances or points |
| **OpenAI, Anthropic, Together AI APIs** | Organization spending, with provider-specific key permissions; separate from chat subscriptions |
| **Ollama, LM Studio, llama.cpp, vLLM** | Local model availability after authorization |
| **Other catalog entries** | Some offer discovery or provider links only; a listed service does not imply a working quota connector |

[Full provider coverage](docs/catalog-coverage.md) · [Privacy](PRIVACY.md) · [Security](SECURITY.md)

## Screenshots

<details>
<summary>Compact widget and detailed cards</summary>

<p align="center">
  <img src="docs/screenshots/api-widget-synthetic.png" alt="Compact widget with synthetic balances and points" width="350">
  <img src="docs/screenshots/api-details-synthetic.png" alt="Detailed provider cards with synthetic values" width="350">
</p>

Screenshots use synthetic data, not a developer's account.

</details>

## Development

Use **Node.js 24** and npm. [Contributing](CONTRIBUTING.md) covers Windows setup; the [Mac guide](MACOS.md#verification-and-builds) covers macOS.

```sh
npm ci
npm run dev
```

[Windows checks](https://github.com/A-Arnaud/Cypher/actions/workflows/security.yml) · [Mac checks](https://github.com/A-Arnaud/Cypher/actions/workflows/macos.yml) · [Changelog](CHANGELOG.md)

## Help and feedback

[Installation help](docs/downloads.md) · [FAQ](SUPPORT.md#faq) · [Report a bug or request a provider](https://github.com/A-Arnaud/Cypher/issues/new/choose) · [Website](https://cypher-os.me/)

Never attach API keys, login codes, CLI credentials, cookies or private account data to an issue. Report vulnerabilities through [Security](SECURITY.md#reporting-a-vulnerability).
