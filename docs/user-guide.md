# Widget and system indicator

[Download Cypher](downloads.md) · [Mac setup](../MACOS.md) · [Connection methods](connection-methods.md)

## Desktop widget

Pin the profiles you need, reorder them by dragging a handle or using the keyboard, and switch between compact rows and detailed cards. **Details** shows quota windows, API balances, points and reset times when the provider exposes them.

Settings controls opacity, always-on-top behavior, language, keyboard shortcut and refresh interval. The default interval is **60 seconds after a collection completes**; errors use exponential backoff up to 15 minutes. **Pause** suspends collection, **Refresh** starts a read immediately, and **Quit** stops the application. Closing or hiding the window keeps collection running.

The default show/hide shortcut is **Ctrl+Alt+Q** on Windows, **Control+Option+Q** on Mac.

## Windows taskbar

**Windows 10:** **Put in taskbar** reserves a small area on the horizontal primary taskbar. It shows up to three pinned profiles and a `+N` count. Click the indicator to open the full window.

**Windows 11:** Cypher uses the native **notification area**. Quotas appear in its tooltip and menu; Windows may put the icon under the hidden-icons arrow. Open the desktop widget for permanently visible numbers. It does not embed text into the Windows 11 taskbar or modify Explorer.

The installed or extracted Windows app can launch at login. Leaving taskbar mode keeps your startup preference. The portable executable does not support automatic Windows startup.

## Mac menu bar

On **Intel and Apple Silicon**, **Show quotas in menu bar** places the native indicator **at the top right**. It shows up to three pinned profile readings and an additional-profile count. Open its menu to show/hide the widget, refresh, pause or quit.

macOS controls available menu bar space, including around camera notches and in full-screen apps. If needed, add Cypher manually to **System Settings → General → Login Items**.

## Understanding the readings

Compact system indicators show available remaining **percentages**. A dash means no percentage is available; it does not mean zero. Balances, spending, points and local model counts remain in the widget/details. API billing is separate from chat subscriptions, and quotas shared by a confirmed account are not added together.

Profiles require read permission. Missing or stale data stays marked; a detected tool or profile alone does not establish a working connection or subscription. [Provider coverage](catalog-coverage.md).

## Compatibility and verification

| Environment | Presentation | Evidence |
| --- | --- | --- |
| Windows 10 x64 | Widget + horizontal-primary-taskbar indicator | Local native checks and Windows CI |
| Windows 11 x64 | Widget + native notification-area tooltip/menu | OS-selection, native tray and fixture checks; Windows Server CI does not establish Windows 11 physical-device certification |
| macOS 13+ Intel | Widget + top menu bar | Maintainer-confirmed working use; macOS 15 Intel build/launch checks |
| macOS 13+ Apple Silicon | Widget + top menu bar | macOS 15 Apple Silicon build/launch checks |

See [verification records](../VERIFICATION.md) for exact test evidence, provider validation and advanced display configurations. Mac availability is confirmed; the absence of Apple notarization is a separate signing limitation, described in [installation help](downloads.md#first-launch).
