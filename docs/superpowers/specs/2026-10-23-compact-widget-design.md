# Cypher — compact overview, custom ordering and true opacity

Explicit request: freely choose the order of Codex/Claude/etc. profiles, display pinned profiles in a small widget without scrolling, reserve the current interface for details, and make 100% truly opaque.

Decision: summary by default, one row per pinned profile with its name, profile label and available quotas; no invented gauges. Drag handle and keyboard movement, with the order saved and shared with the detailed view. Pinning/unpinning stays in Connections. A Details button opens the existing large interface; Settings is directly accessible; a back button returns to the widget. Window height adapts to the row count and screen, with a second column when necessary. No system can display an unlimited number of readable profiles on a small screen: a safety scrolling fallback remains allowed only beyond physical capacity; the usual sets of 3/6/12 profiles must fit without scrolling on a standard screen.

Summary mode is retained in preferences and is the default even for old preferences without this field. Order changes run in the main-process queue from the current list, rather than from an outdated renderer array. Dimensions are derived in main; IPC accepts no arbitrary size.

Cause of transparency: shell CSS has alpha and the acrylic material remains active, even with setOpacity(1). Replace acrylic with none and add an opaque interior background; only the native control adjusts overall transparency. Rounded outer corners remain transparent, but content at 100% does not. Preserve the logo, accounts, consents and absence of collection consoles.

Verification: immutable and exact ordering, screen-bounded layout, DnD/keyboard/return from details, no scrolling with usual profile counts, CSS opacity and interior alpha at 100%, native application of dimensions, actual persistence and tested portable build.
