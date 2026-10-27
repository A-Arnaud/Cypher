# Download and install Cypher

**[Open all current downloads](https://github.com/A-Arnaud/Cypher/releases/latest)** — one release page for Windows 10, Windows 11 and Mac.

## Choose your computer

| Computer | Recommended download |
| --- | --- |
| Windows 10 x64 | [Windows installer](https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-Setup-0.5.0-win-x64.exe) |
| Windows 11 x64 | [Windows installer](https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-Setup-0.5.0-win-x64.exe) — the same file works on Windows 10 and 11 |
| Mac Intel | [Mac Intel DMG](https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-0.5.1-mac.2-mac-x64.dmg) |
| Mac with Apple Silicon | [Mac Apple Silicon DMG](https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-0.5.1-mac.2-mac-arm64.dmg) |

Mac requires **macOS 13 Ventura or later**. To choose the correct Mac file, open ** → About This Mac**: **Intel** means Mac Intel; **Apple M…** means Apple Silicon. Windows downloads target x64, not Windows ARM64.

## Install

### Windows 10 / 11

1. Download and run the installer above. No administrator rights or Node.js installation are required.
2. Open **Cypher**, then **Connections** to authorize an existing profile or add a supported API key.
3. Pin your profiles. Use the widget, **Put in taskbar** on Windows 10, or the notification-area option on Windows 11.

Windows may put the notification icon under the hidden-icons arrow. The portable alternative below does not support automatic Windows startup.

### Mac

1. Open the DMG and drag **Cypher.app** into **Applications**.
2. Open Cypher from Applications. Authorize a detected profile, or expand **More ways to connect** for Codex browser sign-in, CLI sign-in or an API alternative.
3. Choose **Show quotas in menu bar** to place the indicator **at the top right**.

No separate Node.js, Codex CLI or Codex desktop app is needed for Mac Codex browser sign-in. API billing and subscription quotas remain distinct. [Mac guide](../MACOS.md) · [Connection methods](connection-methods.md).

## First launch

**Windows:** these executables are not Authenticode-signed, so SmartScreen may show a warning. Verify the checksum and that the download came from this repository before deciding to run it.

**Mac:** the app works on Mac, but it is not notarized by Apple. If macOS says Apple could not verify it, close the alert, open **System Settings → Privacy & Security**, find Cypher, choose **Open Anyway**, then confirm **Open**. This creates an exception for Cypher; it does not require disabling Gatekeeper globally. [Apple's instructions](https://support.apple.com/en-us/102445).

Platform compatibility and Apple notarization are separate. An Apple Developer ID/notarization pipeline is prepared for a future signed build; the current downloads retain their existing signatures. Automatic Mac startup can be configured manually in macOS Login Items.

## Other downloads

| Option | Download |
| --- | --- |
| Windows portable, without installation | [Portable EXE](https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-0.5.0-win-x64.exe) |
| Mac Intel ZIP | [Intel ZIP](https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-0.5.1-mac.2-mac-x64.zip) |
| Mac Apple Silicon ZIP | [Apple Silicon ZIP](https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-0.5.1-mac.2-mac-arm64.zip) |
| Windows checksums | [SHA-256 manifest](https://github.com/A-Arnaud/Cypher/releases/latest/download/SHA256SUMS-0.5.0.txt) |
| Mac Intel checksums | [SHA-256 manifest](https://github.com/A-Arnaud/Cypher/releases/latest/download/SHA256SUMS-mac-x64.txt) |
| Mac Apple Silicon checksums | [SHA-256 manifest](https://github.com/A-Arnaud/Cypher/releases/latest/download/SHA256SUMS-mac-arm64.txt) |

The common release page contains **Windows 0.5.0** and **macOS 0.5.1-mac.2**. The Windows installer and portable EXE are unchanged copies of the existing Windows release. Their original checksums remain valid. All files are also retained in their original versioned releases.

## Check a download

Compare the result with the matching SHA-256 manifest above.

```powershell
# Windows PowerShell: substitute the filename you downloaded.
Get-FileHash .\Cypher-Setup-0.5.0-win-x64.exe -Algorithm SHA256
```

```sh
# Mac Terminal: substitute your Intel or Apple Silicon filename.
shasum -a 256 ~/Downloads/Cypher-0.5.1-mac.2-mac-x64.dmg
```

For a problem, check the [FAQ](../SUPPORT.md#faq), then [report it](https://github.com/A-Arnaud/Cypher/issues/new/choose) with your OS version, processor and filename. Do not attach account files or credentials.
