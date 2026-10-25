<div align="center">
  <img src="docs/brand/wordmark.svg" alt="Cypher" width="230">
  <p><strong>Your AI usage, always in view.</strong><br>
  A small Windows companion for AI quotas, API balances and local models.<br>
  On your desktop. In your taskbar. Under your control.</p>
  <p><strong><a href="https://github.com/A-Arnaud/Cypher/releases/latest">Download Cypher for Windows</a></strong></p>
  <p>
    <a href="https://github.com/A-Arnaud/Cypher/releases/latest"><img src="https://img.shields.io/badge/release-v0.4.8-ed8fae" alt="Release 0.4.8"></a>
    <img src="https://img.shields.io/badge/Windows_10-x64-292d35?logo=windows&amp;logoColor=white" alt="Windows 10 x64">
    <a href="PRIVACY.md"><img src="https://img.shields.io/badge/local-first-91cbb2" alt="Local first"></a>
    <a href="https://github.com/A-Arnaud/Cypher/actions/workflows/security.yml"><img src="https://img.shields.io/badge/validation-Windows-91cbb2?logo=githubactions&amp;logoColor=white" alt="Security and Windows validation"></a>
  </p>
  <p><a href="#get-started">Get started</a> · <a href="#what-works-today">Supported providers</a> · <a href="SECURITY.md">Security</a> · <a href="CHANGELOG.md">Changelog</a> · <a href="SUPPORT.md">Help</a></p>
</div>

<a href="https://github.com/A-Arnaud/Cypher/releases/latest"><img src="docs/brand/hero.png" alt="Cypher: your AI usage, always in view. Product preview with synthetic quota values." width="100%"></a>

## Choose your view

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

1. Open the [latest release](https://github.com/A-Arnaud/Cypher/releases/latest).
2. Download **`Cypher-Setup-0.4.8-win-x64.exe`** for installation and Windows startup, or **`Cypher-0.4.8-win-x64.exe`** for portable use.
3. Open **Connections** and choose a supported provider. Existing CLI profiles require your permission before account reads; API connections require a key you enter explicitly.
4. Pin your profiles. Use **Widget** for compact rows or **Put in taskbar** for the Windows indicator.

**Requirements:** Windows 10 x64. End users do not need Node.js. CLI connections need the relevant official CLI; API and local-server connections do not. Fresh installs open in English; French remains available in Settings.

The executables are **not Authenticode-signed**, so Windows may display a warning. Check the release's SHA-256 file before running a download. No administrator rights are required. The portable app extracts Electron at launch and does not support automatic Windows startup.

## Desktop widget

Keep only the profiles you need in a compact, draggable window. Reorder by dragging a handle or using the keyboard. Open **Details** for quota windows, balances, points and reset times when the provider exposes them.

Change opacity, always-on-top behavior, the keyboard shortcut and refresh interval in Settings. The default interval is **60 seconds after a collection completes**; errors use exponential backoff up to 15 minutes. Pause suspends collection. Refresh starts a new read immediately.

**Ctrl+Alt+Q** shows or hides Cypher. Closing or hiding the window keeps collection running; **Quit** stops the application.

## Windows taskbar

Use **Put in taskbar** to reserve a small area next to your existing taskbar content. It shows up to three pinned profiles and a `+N` count. Click the indicator to open the full window.

The installed or extracted app can launch with Windows. Startup is independently configurable in Settings. Leaving taskbar mode keeps your startup preference.

**Verified target:** Windows 10 x64 with a horizontal primary taskbar. Windows 11, vertical or secondary taskbars and untested DPI configurations are not certified. See [verification notes](VERIFICATION.md) for the actual test scope.

## Connections

CLI profiles stay independent. Cypher does not overwrite another account to add a new one. Shared quotas are flagged only when a reliable provider identity confirms the same account.

Unknown data stays unknown. A dash is unavailable data, never a fabricated zero. Stale values are marked, subscription quotas are not added together, and API billing remains separate from chat subscriptions.

### What works today

| Connection | Available today | Boundary |
| --- | --- | --- |
| **Codex** | Account and provider quota windows through the installed CLI | Requires a signed-in, authorized profile; fields depend on the provider |
| **Claude Code** | Account status through the installed CLI | Quota collection is not implemented |
| **Gemini CLI** | Tool detection and profile sign-in flow | Account plan and quota collection are not implemented |
| **OpenRouter, DeepSeek, Poe** | Key budget/usage, available balance or points exposed by each provider | Values and units are provider-specific |
| **fal.ai** | Available credit balance and currency | Requires billing usage read permission; not a chat subscription quota |
| **OpenAI, Anthropic, Together AI APIs** | Supported organization usage/cost endpoints | Key permissions vary; Together reports finalized days through yesterday; organization usage is not a chat subscription quota or guaranteed prepaid balance |
| **Ollama, LM Studio, llama.cpp, vLLM** | Model lists from fixed loopback endpoints | Local models have no cloud quota |
| **Other catalog entries** | Discovery, upstream-provider guidance or planned status | Being listed or installed does not imply a working quota connector |

See the [full coverage matrix](docs/catalog-coverage.md) and [privacy policy](PRIVACY.md).

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
- API keys entered in Connections are encrypted locally with Windows DPAPI and removable in the app.
- The renderer is sandboxed with context isolation, validated IPC and a restrictive production content security policy.
- Profiles, keys, preferences, diagnostics and build outputs are excluded from Git. Publication checks scan sources, Git history and the packaged archive.

DPAPI does not protect against malicious software running as your Windows user. Provider requests still reach the selected provider. These safeguards and scans are not an independent security certification. Read [Security](SECURITY.md) and [Privacy](PRIVACY.md) before connecting an account.

## Development

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
