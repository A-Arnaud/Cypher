# Startup and idle performance correction

## Findings

- Focusing the window after five seconds called the full discovery/refresh path,
  stopped the current poller, and restarted CLI reads even when data was fresh.
- Each approved Codex/Claude profile could launch a CLI concurrently.
- Initial collection waited for renderer loading and taskbar attachment (the latter
  has an eight-second timeout).
- The native taskbar timer moved and invalidated the surface every 200 ms, even
  with unchanged geometry. Repeated state publications also resent identical renders.

## Changes

- Focus joins in-flight collection and only refreshes due entries, respecting
  retry backoff. Explicit refresh still performs discovery.
- CLI collections share a cancellable serial queue across poller replacements;
  pinned profiles are scheduled first. Other provider requests remain independent.
- Collection starts before loading the renderer and restoring the taskbar.
- Native geometry polling remains active for Explorer changes, but movement and
  repaint are requested only for changed geometry. Identical render messages are
  suppressed per helper session; restarting the helper sends the first render again.

## Verification

- `npm test`: 97 tests passed across 20 files, including queued cancellation,
  recovery after failure, focus deduplication/backoff, and helper render deduplication.
- `npm run typecheck`: passed.
- `npm run build`: passed, including native C# helper compilation.
- `node scripts/smoke.cjs`: passed 18 Electron checks with isolated settings and
  no account consent. This verifies discovery, rendering, IPC and window lifecycle,
  not live quota service latency.
- A portable build is generated separately under `release/performance`.

## Live follow-up (user authorized replacement)

- Closed the original portable application through its Quit control and confirmed
  its processes exited.
- `uv run --no-project --with pillow python scripts/test-taskbar-native.py` passed
  all three exit scenarios (quit, kill, EOF), including embedding, click delivery,
  Explorer relayout and geometry restoration.
- Launched the corrected portable and confirmed live Codex quota display. Its
  self-extraction still added startup work: the portable launcher had consumed
  5.578 CPU seconds at one sample before the application was ready.
- Copied the packaged, already extracted application into
  `%LOCALAPPDATA%/Programs/Cypher-Optimise` and created `Cypher optimise.lnk` on the
  Desktop. Verified the executable hash matches the packaged source and the
  shortcut points to that existing executable. This avoids extraction on each launch.
- Closed the portable, launched the stable copy, and observed the first real Codex
  quota through the accessibility tree within **3.35 seconds** of launch. This is
  an upper bound including UI automation overhead from one warm-machine run, not
  a controlled cold-start benchmark. The second pinned account subsequently showed
  its provider quota too.
- Left the stable copy running, responsive, with the details window hidden and the
  native taskbar widget present. Preserved the actual user's 900-second refresh,
  four consents, four pinned entries and enabled taskbar mode.

Short idle samples across the six app/helper processes (excluding unrelated CLI
sessions and the portable extraction launcher):

| Sample | Duration | CPU seconds | Summed working set | Private bytes |
| --- | --- | --- | --- | --- |
| Previous portable, hidden | 10.17 s | 0.046875 | 398.6 MiB | 307.4 MiB |
| Corrected stable copy, hidden | 10.18 s | 0 at sampling resolution | 379.8 MiB | 304.8 MiB |

These short observations do not establish a durable percentage improvement or
capture collection-time peaks. Electron's baseline memory footprint remains.
Local launch/idle evidence is in `.local-builds/performance-live.json` and
`.local-builds/performance-idle.json` (not intended for publication).
