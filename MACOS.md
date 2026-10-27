# Cypher for macOS

The macOS preview is a separate release from Windows: [download v0.5.1-mac.2](https://github.com/A-Arnaud/Cypher/releases/tag/v0.5.1-mac.2).

**Requires macOS 13 Ventura or later**, on either processor. This is the minimum declared by the packaged application and its Electron runtime; the automated tests run on macOS 15. macOS 12 Monterey and earlier cannot run this release. On Intel, download the file ending in **`mac-x64.dmg`** or **`mac-x64.zip`**, never `arm64`.

- **Apple Silicon:** choose the `mac-arm64.dmg` or `mac-arm64.zip` download.
- **Intel:** choose `mac-x64.dmg` or `mac-x64.zip`.
- Open the DMG and drag **Cypher.app** to **Applications**, or extract the ZIP and move the app to Applications.
- Open Cypher, authorize the profiles or API connections you want, then choose **Show quotas in menu bar**. The indicator appears **at the top right of the screen**. Its menu opens or hides the widget, refreshes data, pauses collection or quits.
- Up to three pinned profiles show their remaining percentages alongside the menu bar icon. A dash means unavailable; balances and model counts remain in the widget. macOS controls available menu bar space, including on displays with a camera notch.
- The default show/hide shortcut remains **Control+Option+Q** (the Mac name for `Control+Alt+Q`).

## First launch

To remove this warning in a future release, the maintainer must configure [Developer ID signing and Apple notarization](docs/macos-signing.md). The prepared workflow requires an active Apple Developer membership and credentials; it has not notarized the current preview.

This preview has an **ad-hoc signature**, without an Apple Developer ID certificate or notarization. macOS Gatekeeper may block the first launch. After checking the release SHA-256 checksum, use **System Settings → Privacy & Security → Open Anyway** if macOS offers it. Do not disable Gatekeeper globally.

Automatic login registration is unavailable in this preview. If desired, add the installed app manually in **System Settings → General → Login Items**. API keys use Electron safeStorage backed by the macOS Keychain. Windows credentials cannot be copied over and decrypted on a Mac.

## Connection methods

Connections keeps **Automatic detection** first. Expand **More ways to connect** for browser sign-in, an installed CLI, profile-folder import or the supported API-key alternative. See [connection methods and provider limits](docs/connection-methods.md).

**Codex browser sign-in** uses an official component included in Cypher: no separate Codex CLI, Codex app or Node installation is required. A new browser connection creates its own Cypher profile and does not replace an existing account. Claude and Gemini currently retain their CLI sign-in methods.

### Existing CLI connections

Cypher discovers executable CLI commands on `PATH`, in `~/.local/bin`, `/opt/homebrew/bin`, `/usr/local/bin` and `~/.npm-global/bin`. Use **Already installed?** to choose a CLI manually if your Node version manager puts it elsewhere. Node-based launchers need Node available alongside the launcher or on `PATH`.

Sign-in opens a separate **Terminal** instance using the official CLI and the selected profile only. Return to Cypher and refresh after completing sign-in. Existing provider limitations still apply: Claude and Gemini detection/sign-in do not imply implemented subscription quotas. See the [provider matrix](README.md#what-works-today).

## Verification and builds

GitHub Actions builds and tests separately on **macOS 15 Apple Silicon and Intel**. It runs portable unit tests, real synthetic CLI subprocess tests, an Electron menu bar docking/restore smoke test, a final packaged app launch and signature check, and source/archive publication scans. These automated checks do not establish live-account compatibility, Gatekeeper approval, or physical-device/notch/full-screen validation. A hands-on Mac check remains necessary.

```sh
npm ci
npm run dev
npm run typecheck
npm run test:mac
npm run dist:mac
```

Build on macOS using Node.js 24. Local `dist:mac` builds for the host architecture; GitHub's separate Intel and Apple Silicon runners build each target with its matching Codex component. Cross-architecture packaging is rejected rather than silently shipping the wrong executable. The Windows C# taskbar helper is built only on Windows; it is never launched by the Mac backend. Windows retains its existing taskbar/notification-area behavior.

References: [Apple menu bar](https://support.apple.com/en-gb/guide/mac-help/mchlp1446/mac), [Electron Tray](https://www.electronjs.org/docs/latest/api/tray), [Electron login items](https://www.electronjs.org/docs/latest/api/app#appsetloginitemsettingssettings).
