# Download and install Cypher

**[Open all current downloads](https://github.com/A-Arnaud/Cypher/releases/latest)** — one release page for Windows 10, Windows 11 and Mac.

## Choose your computer

| Computer | Recommended download |
| --- | --- |
| Windows 10 x64 | [Windows installer](https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-Setup-0.9.0-win-x64.exe) |
| Windows 11 x64 | [Windows installer](https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-Setup-0.9.0-win-x64.exe) — the same file works on Windows 10 and 11 |
| Mac Intel | [Mac Intel DMG](https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-0.9.0-mac-x64.dmg) |
| Mac with Apple Silicon | [Mac Apple Silicon DMG](https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-0.9.0-mac-arm64.dmg) |

Mac requires **macOS 13 Ventura or later**. To choose the correct Mac file, open **Apple menu → About This Mac**: **Intel** means Mac Intel; **Apple M…** means Apple Silicon. Windows downloads target x64, not Windows ARM64.

[See Cypher beside the Windows clock](showcase/windows-location.png) · [Windows 11 notification area](showcase/windows11-notification-guide.png) · [Mac top menu bar](showcase/macos-location.png) · [Full visual guide](screenshots/README.md).

## Install

### Windows 10 / 11

WinGet registration for `AArnaud.Cypher` has been [submitted to Microsoft](https://github.com/microsoft/winget-pkgs/pull/462651). The public command is pending catalog publication; use the installer below in the meantime. [Command and status](winget.md).

1. Download and run the installer above. No administrator rights or Node.js installation are required.
2. Open **Cypher**, then **Accounts** to authorize an existing profile or add a supported API key.
3. Pin your profiles. The indicator appears automatically; **Minimize to taskbar** hides the window while keeping it in the bottom bar: the embedded indicator on Windows 10, or the notification area near the clock on Windows 11.

Windows may put the notification icon under the hidden-icons arrow. The portable alternative below does not support automatic Windows startup.

### Mac

1. Open the DMG and drag **Cypher.app** into **Applications**.
2. Open Cypher from Applications. Authorize a detected profile, or expand **Other ways to connect** for Codex browser sign-in, CLI sign-in or an API alternative.
3. The indicator appears automatically. Choose **Minimize to menu bar** to hide the window and keep the indicator **at the top right**.

No separate Node.js, Codex CLI or Codex desktop app is needed for Codex browser sign-in on Windows or Mac. API billing and subscription quotas remain distinct. [Mac guide](../MACOS.md) · [Connection methods](connection-methods.md).

## Update Cypher

On **0.5.x**, install **0.9.0 once** using the downloads above to get update proposals. Installed Windows 0.6.0 can already propose this update through Settings. The installed Windows app can then download/verify/install after your approval. Current Mac and portable/extracted Windows copies use the official browser download and manual replacement. Earlier 0.5.x versions do not check for releases. [Automatic update behavior](updates.md).

1. **Quit the running version completely.** Choose **Quit / Quitter** from the Cypher bar menu, or **Quit Cypher / Quitter Cypher** in the closing dialog. Minimizing leaves the old process running.
2. **Windows:** run the current installer. For the portable version, close the old executable, replace it with the new download and reopen it.
3. **Mac:** open the correct Intel or Apple Silicon DMG, replace **Cypher.app** in **Applications**, then reopen it. The previous process keeps its old Dock behavior until it is quit. If you had pinned its icon to the Dock, remove that favorite once through **Options → Remove from Dock**.
4. Open **Settings / Réglages** to choose language and optional startup. At sign-in, startup opens directly in the bar. On Mac, approve the login item in system settings if requested.

Preferences and profiles live separately from the application files. Replace the application without deleting its user-data folder. Existing account permissions and provider limitations still apply.

## First launch

**Windows:** these executables are not Authenticode-signed, so SmartScreen may show a warning. Verify the checksum and that the download came from this repository before deciding to run it.

**Mac:** the app works on Mac, but it is not notarized by Apple. If macOS says Apple could not verify it, close the alert, open **System Settings → Privacy & Security**, find Cypher, choose **Open Anyway**, then confirm **Open**. This creates an exception for Cypher; it does not require disabling Gatekeeper globally. [Apple's instructions](https://support.apple.com/en-us/102445).

Platform compatibility and Apple notarization are separate. An Apple Developer ID/notarization pipeline is prepared for a future signed build; the current downloads retain their existing signatures. For optional automatic startup, enable the startup switch in Cypher Settings. Mac requires moving the app into Applications and may require approval in macOS Login Items. At sign-in, Cypher opens directly in the bar without showing its window.

## Other downloads

| Option | Download |
| --- | --- |
| Windows portable, without installation | [Portable EXE](https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-0.9.0-win-x64.exe) |
| Mac Intel ZIP | [Intel ZIP](https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-0.9.0-mac-x64.zip) |
| Mac Apple Silicon ZIP | [Apple Silicon ZIP](https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-0.9.0-mac-arm64.zip) |
| Windows checksums | [SHA-256 manifest](https://github.com/A-Arnaud/Cypher/releases/latest/download/SHA256SUMS-0.9.0.txt) |
| Mac Intel checksums | [SHA-256 manifest](https://github.com/A-Arnaud/Cypher/releases/latest/download/SHA256SUMS-mac-x64.txt) |
| Mac Apple Silicon checksums | [SHA-256 manifest](https://github.com/A-Arnaud/Cypher/releases/latest/download/SHA256SUMS-mac-arm64.txt) |

The common release page contains **Cypher 0.9.0 for Windows and macOS**. Historical releases remain available with their original files and checksums.

## Check a download

Compare the result with the matching SHA-256 manifest above.

```powershell
# Windows PowerShell: substitute the filename you downloaded.
Get-FileHash .\Cypher-Setup-0.9.0-win-x64.exe -Algorithm SHA256
```

```sh
# Mac Terminal: substitute your Intel or Apple Silicon filename.
shasum -a 256 ~/Downloads/Cypher-0.9.0-mac-x64.dmg
```

For a problem, check the [FAQ](../SUPPORT.md#faq), then [report it](https://github.com/A-Arnaud/Cypher/issues/new/choose) with your OS version, processor and filename. Do not attach account files or credentials.
