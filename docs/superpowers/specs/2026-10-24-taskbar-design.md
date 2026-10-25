# Cypher — quotas in the Windows taskbar

## User agreement

Approach 1 explicitly selected: actual taskbar integration, rather than an overlaid window. First launch opens the large interface; a button docks Cypher in the taskbar; compact quotas remain visible; clicking opens the large interface; the choice is retained and the application starts after Windows restarts. Weather remains intact.

## Goal and scope

Verified delivery target: Windows 10 x64, primary horizontal taskbar matching the user's screenshot. No promise of Windows 11 compatibility without separate testing. Preserve existing accounts, consents, FR/EN languages, collection and preferences. Do not install third-party software in Explorer, inject DLLs or restart Windows automatically.

First launch of a new installation: detailed interface rather than summary. Existing installations retain their summary preference until an explicit action. A “Dock in taskbar” button is accessible from both interfaces. Once enabled, the indicator remains present even while the detailed window is open. Closing that window hides it; Quit also terminates the indicator. Clicking the indicator shows and focuses details without disabling docking.

## Approaches

1. Native taskbar integration: selected by the user. A small Windows helper renders the indicator as a child of the taskbar and reserves space in the application area. Explorer geometry operations must be reversible and verified on the host; this is not a stable public API. Native evidence is a prerequisite for product integration.
2. Overlaid mini-window: rejected because it can obscure weather and icons.
3. Notification icon alone: insufficient because quotas would not remain readable.

## Proposed implementation choices

Keep Electron/React/TypeScript. A C# Windows Forms helper using Win32 calls, compiled through the .NET Framework compiler present at C:/Windows/Microsoft.NET/Framework64/v4.0.30319/csc.exe. No new native npm dependency. Separate process, JSON exchange over stdin/stdout; no network or profile paths in the protocol. The helper is not a component loaded into Explorer.

Display: up to three pinned profiles in their existing order, an identifiable provider initial and the most restrictive remaining percentage among that profile's percentage metrics. Maximum target width of 220 logical pixels at 100% DPI, adjusted to Windows DPI; no scrolling. For additional profiles, a +N counter, with details on click. No known quota: dash, never an invented 0%. Stale data: visual indication and tooltip. The tooltip distinguishes profiles and explains that the displayed percentage is the minimum across known quota windows. These density rules are implementation choices that can change following user feedback.

The helper must report confirmed attachment before the window hides. Unsupported taskbar, insufficient space, launch error or lost helper: keep/show the window and report the problem without pretending to be docked. Restore reserved space on exit and recover the taskbar recreated by Explorer without reusing old handles. Do not move or disable weather. A vertical taskbar or other untested configuration must be rejected cleanly rather than covered.

## Startup and stable location

The current portable build extracts Electron into a temporary directory; never register that path for Windows startup. Provide a per-user installer without elevation, preserving the existing appId and data location. Retain a portable version but explain there that automatic startup requires a stable installation. Enabling docking in the installed version enables startup at Windows login; a settings option can disable it independently.

Login startup with docking saved: attempt the indicator without opening details, then open the window if attachment fails. Manual launch/subsequent instance: open details. Verify Windows startup by actually reading the registration; a real PC reboot remains a user test if no permission to restart has been given.

## Validation and non-goals

Unit tests: quota selection, settings validation/migration, docking states, errors and startup. UI tests: first launch, button, opening details, FR/EN options. Native tests: parent HWND belongs to the taskbar, reserved space does not intersect weather/notification area, real click, close/reopen, restoration after exit, DPI/geometry changes in available configurations. Packaged test and launch using the arguments actually registered for startup in an isolated data directory.

No forced restart, synthetic quotas presented as real, automatic login to new accounts, replacement of weather, or commit/push without a request. Integration that cannot be verified is a blocker to report, rather than a reason to deliver the rejected overlay.

## Clarifications after feasibility review

SetParent attachment does not demonstrate space reservation. An AppBar reserves part of the desktop and is not an acceptable substitute. Evidence must cover Explorer layout recalculations and the effective DPI context after cross-process attachment; feasibility remains unproven at this stage.

Recovery tests must distinguish normal exit, killed process, logout and recreated Explorer. Restore only reservations still owned on valid handles; never blindly restore initial geometry. A supervision strategy must make abrupt termination reversible, rather than relying only on a finally block.

Proposed implementation choices: follow Windows auto-hide and fullscreen behavior without forcing the indicator above a fullscreen application; its visibility follows the taskbar's. If the primary taskbar becomes vertical or unavailable, cleanly remove the reservation and show Cypher with a warning. Secondary taskbars are outside this delivery's scope.

Add “Undock from taskbar.” This action does not change automatic startup, which is configured independently. Only the first activation offers/enables startup; reactivations respect a later disablement, including one made in Windows. Determine stale state from the existing collection's state='stale' marker without inventing a second expiration threshold.

The installer is a proposed distribution choice to confirm: a portable application could also register its stable external launcher, but never the temporarily extracted executable. Installation simplifies update and uninstall stability; it does not imply that portable autostart is universally impossible.
