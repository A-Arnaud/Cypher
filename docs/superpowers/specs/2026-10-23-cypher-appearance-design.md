# Cypher — appearance and unobtrusive collection

Explicit requests: preserve the layout, name the software Cypher, use exactly D:/Projets/icon.svg as the new logo and icon, make opacity adjustable and eliminate refresh consoles. Implementation choice: overall widget opacity from 30 to 100%, with 100% as the default; immediate control, persisted preference, and a minimum that does not make the widget invisible. The terminal remains visible only following a login action.

Keep the historical Quota Glass data directory when it exists, without moving/copying profile credentials; otherwise create Cypher. New portable filename: Cypher-0.2.0-win-x64.exe in release/. Change the internal identifier and title; retain the repository folder for continuity.

Confirmed diagnosis: the Codex npm launcher itself launches a native binary using spawn without windowsHide. The parent's windowsHide does not cover this boundary. Resolve the distributed native binary directly when possible; for Node CLIs that are still necessary, preload a guard limited to read workers to force windowsHide on Node subprocesses. Do not apply this guard to login terminals.

Also incorporate the two important issues from the multi-profile review: transport Unicode paths through the native UTF-16 environment, while keeping the batch file ASCII and starting it with an ASCII filename from its own directory; ensure rescanning occurs after a registry mutation, even if a previous collection is still running. Keep a CLI replacement action accessible even when an old launcher is detected.

Verification: RED→GREEN unit regressions, native Unicode and punctuation test, observation of the actual Windows creation options for the CLI grandchild in an unfixed control followed by the fixed version, complete login test with a synthetic CLI, opacity IPC and persistence, actual interface screenshots and portable build/test. Tests do not connect any real accounts; provider limitations remain in place.
