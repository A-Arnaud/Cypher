# Two quota windows, less space

Cypher 0.9.0 follows the compact bar and continuous panel structure studied in [OpenTokenUsage](https://github.com/PowerUserZ/OpenTokenUsage) and its [panel/strip examples](https://opentokenusage.app/). This is original code in Cypher's existing Electron/React/C# architecture.

## Native indicators

The previous indicator reduced all known percentages to their minimum. The new presentation keeps the short/session and weekly limits separate: short above, weekly below. Actual durations such as `5h` and `7d` are retained. Missing values stay `—`, real zero stays zero, and stale values stay marked. A lone weekly quota stays in the bottom row. Generic session labels are not invented as a five-hour duration.

- Windows 10: a provider logo and two labelled rows per pinned account. Width adapts to the account count (80 logical pixels for one, 152 for two, 224 for three, plus 24 for an extra-account count). Existing shell reservation, DPI handling and restoration remain in use.
- macOS: one variable-width template image with provider logos and two percentage rows; 56 logical pixels per account. This replaces the long service-name title. The additional-account count and update arrow remain short text. Native menu actions and accessory/Dock behavior remain unchanged.
- Windows 11: numeric two-row notification icons for up to three pinned accounts. The first uses the existing Cypher tray item; additional icons are removed when no longer needed or disabled. Tooltips identify services and actual durations; all icons keep the same action menu. Windows controls order and hidden-icon placement. This is not an embedded Windows 11 strip.

Native menu/tooltip text contains public service names, safe quota labels and percentages, not profile labels, email addresses or credentials. API amounts and local model counts are not converted into percentages. The main panel still provides the fuller readings.

## Main panel

A narrow rail keeps the labelled Quotas, Accounts and Settings actions available and adds direct service filters. Flat reading sections replace nested cards. Account labels, small plan badges, remaining amounts and reset countdowns have separate roles. Opening a profile through search clears the service filter so it can be revealed. No provider connection or read permission changes when filtering.

The Settings indicator guide uses the actual selected readings. An empty installation gets an explicitly labelled example. Light/dark/system themes, keyboard navigation, advanced controls, closing choices, startup behavior and approved updates remain available.

## Public examples

Renderer screenshots use isolated demonstration data and block external requests. Native indicator examples are produced by the actual C# painter and Electron bitmap compositor with synthetic readings, without attaching a helper to Explorer or reading real accounts. The Mac example is a layout/compositor preview; automated Mac packaging and native menu checks are recorded separately in [verification](../VERIFICATION.md).
