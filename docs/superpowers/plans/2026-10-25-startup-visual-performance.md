# Startup, visual clarity and idle performance

**Goal:** Make Windows startup controllable in the running extracted application,
improve the existing dark interface, and reduce unnecessary background work.

**Approach:** Keep Electron/React and the native taskbar helper. Use the existing
Windows Run registration with verified readback for stable packaged executables.
Reject temporary extraction/development paths. During deployment, replace the
previous manually-created Startup shortcut with that registration so the switch
controls the only startup source. Preserve the user's enabled preference.

Alternative: keep controlling a separate Startup shortcut; rejected because that
duplicates the existing startup adapter and Windows-disabled-entry handling.
Visual direction: retain dark styling, improve hierarchy/contrast, group settings,
prioritize startup and collection frequency. No new UI library or animation.

## Tasks

- [ ] Startup: test stable extracted eligibility, reject dev/portable/temp paths;
  expose the existing switch and retain write/readback/rollback checks.
- [ ] Performance: test that static/unapproved providers do not repeat on timers,
  and batch state publications while skipping hidden renderer updates. Keep manual
  refresh, retry backoff, consent, alerts and native taskbar updates functional.
- [ ] Visual: separate SettingsPanel and ProviderCard (stable React component type),
  group startup/collection/appearance controls, improve contrast and quota hierarchy,
  remove expensive texture layer; keep responsive summary layout and bilingual copy.
- [ ] Verify unit/types/build/UI, visually inspect screenshots, obtain fresh review.
- [ ] Package, close the running version, update the stable application, verify
  startup off/on against Windows, remove only the verified legacy startup shortcut,
  restore enabled startup, and observe real quotas and idle resource use.

## Constraints / review focus

- No automatic login, invented quotas, production debugging endpoint or credentials
  in reports. Preserve four consents, pinned entries, polling interval and taskbar.
- Switch must not optimistically claim success when Windows registration fails.
- Hidden window must receive latest state when shown; no timers after shutdown.
- Static provider metadata must remain discoverable and manually refreshable.
- Existing uncommitted work stays intact; no Git reset, commit or publication.

## Execution record

Initial inspection: startup option is gated on an uninstaller file, excluding the
stable extracted copy; app's Run adapter already supports readback and rollback.
All catalog providers currently receive repeating timers, even planned/unapproved
entries. Every result publishes the entire state to the hidden renderer. Card is
declared inside App and is remounted on every App update. These are the concrete
performance targets for this change.
