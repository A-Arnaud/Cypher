# Widget and system indicator

[Download Cypher](downloads.md) · [Mac setup](../MACOS.md) · [Connection methods](connection-methods.md)

## Desktop widget

Pin the profiles you need, reorder them by dragging a handle or using the keyboard, and switch between compact rows and detailed cards. **Details** shows quota windows, API balances, points and reset times when the provider exposes them.

Settings controls opacity, always-on-top behavior, language, keyboard shortcut and refresh interval. The default interval is **60 seconds after a collection completes**; errors use exponential backoff up to 15 minutes. **Pause** suspends collection, **Refresh** starts a read immediately, and **Quit** stops the application.

The labelled button below the header places Cypher in the Windows taskbar or Mac menu bar and minimizes the window. Its hint explains where to find the indicator. Once placed, the button reads **Minimize to taskbar/menu bar**; **Remove** turns off the quota display and brings the window back. The base Cypher menu icon remains accessible.

Clicking the close button or closing the native window asks whether to **minimize into the bar**, **quit Cypher**, or **cancel**. Minimizing keeps collection running; quitting stops the app. Cancel or Escape leaves the window open. If the indicator cannot start, Cypher remains visible with an error. Explicit **Quit** from the indicator menu exits directly.

The default show/hide shortcut is **Ctrl+Alt+Q** on Windows, **Control+Option+Q** on Mac.

## Windows taskbar

**Windows 10:** **Move to taskbar** reserves a small area on the horizontal primary taskbar, at the bottom of the screen. It shows up to three pinned profiles and a `+N` count. Click the indicator to open the full window.

**Windows 11:** **Move to taskbar** uses the native **notification area** at the bottom right, near the clock. Quotas appear in its tooltip and menu; Windows may put the icon under the hidden-icons arrow. Open the desktop widget for permanently visible numbers. It does not embed text into the Windows 11 taskbar or modify Explorer.

Enable **Settings → Start with Windows** if you want automatic startup. At Windows sign-in, Cypher starts directly in the taskbar without showing its window, regardless of the last saved window/indicator mode. Moving into or out of the bar does not change this optional setting. Disable the switch to stop automatic startup. The installed or stable extracted Windows app supports this; the portable executable does not.

## Mac menu bar

On **Intel and Apple Silicon**, **Move to menu bar** places the native indicator **at the top right**. It shows up to three pinned profile readings and an additional-profile count. Open its menu to show/hide the widget, refresh, pause or quit.

Cypher is a menu bar agent on Mac: no running-app icon in the Dock or Command-Tab, including while its window or Settings are open. Use the top menu's **Show / Hide**, **Control+Option+Q**, or reopen Cypher from Applications to restore its window. Quit remains explicit in that menu or in the closing dialog. If an old Dock favorite remains, remove that manually pinned favorite once through **Options → Remove from Dock**.

macOS controls available menu bar space, including around camera notches and in full-screen apps. Move Cypher into **Applications**, then enable **Settings → Open at login** in Cypher. It uses macOS's native login-item registration. If approval is required, Cypher displays that status and directs you to **System Settings → General → Login Items**. At sign-in, it starts directly in the top menu bar without showing its window. The registered service is checked again when you return to the app, so disabling it in macOS is reflected in Cypher.

Opening Cypher yourself still opens its window. If the bar cannot initialize during automatic startup, Cypher shows its window and an error so you can recover. These startup rules also apply when the native Mac login item launches without command-line arguments.

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
