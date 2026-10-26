# Cypher launch and publishing checklist

This is guidance for a release or public launch, not a record of completed checks. Keep dated evidence in a release-verification document. Current public presentation targets Windows x64; do not claim universal Windows or provider support.

## Repository and discovery

- [ ] Confirm that public visibility is intentional and review the complete source tree and Git history for credentials, personal data and diagnostic captures before changing visibility. A private release is not publicly discoverable.
- [ ] Review the license decision before describing Cypher as open source; do not assume a public repository grants reuse rights. Retain provider-logo license notices.
- [ ] Check the About description, release link and topics. Suggested topics: `windows`, `electron`, `react`, `typescript`, `desktop-widget`, `quota-monitor`, `ai`, `codex`, `local-first`. In GitHub, use the About gear to edit them; documentation alone does not change repository settings.
- [ ] Keep the README's first screen focused on the product and Windows download. Verify the installer, portable and SHA-256 links against the actual release assets.
- [ ] Keep implemented, partial, planned and discovery-only support distinct. Cross-check the provider table against code and the coverage matrix; synthetic tests do not prove every live account works.
- [ ] Verify the issue chooser, contributor guide, support FAQ and security-policy links. Do not advertise a community server, sponsorship, adoption count or response time that does not exist.
- [ ] For a public repository, enable GitHub private vulnerability reporting and check that Security → Advisories offers **Report a vulnerability**. Keep public issues free of vulnerability details and secrets.

## Build and release

- [ ] Choose a new version and update `package.json`, `package-lock.json`, current README download links, changelog and release notes. Preserve old release notes as historical evidence.
- [ ] Run `node scripts/make-icon.cjs` after changing `assets/logo-source.png`. Rebuild application, tray, Windows executable, installer and native-helper icons; verify the resulting executable icons rather than only the source PNG.
- [ ] Regenerate account-free English screenshots with `node scripts/capture-public-screenshots.cjs` and `node scripts/capture-showcase.cjs`, then regenerate presentation art with `node scripts/generate-brand-assets.cjs`. Inspect every image for private data and stale branding; label synthetic values.
- [ ] Run typecheck, unit/UI tests, build and relevant isolated Windows/package checks. Record commands, results and untested environments without turning old results into new claims.
- [ ] Run `npm run security:scan`, `npm run security:secrets` and `npm audit --audit-level=moderate`. Scan the actual production archive with `npm run security:release`; use `CYPHER_RELEASE_ROOT` for a separate output folder.
- [ ] Confirm production fuses/CSP, unsigned Authenticode status and actual Windows support boundaries. Do not describe an unsigned executable as signed or audited.
- [ ] Upload only the intended Windows x64 installer, portable executable and SHA-256 manifest. Exclude test executables, profiles, preferences, account files, raw diagnostics and signing material.
- [ ] Match the release tag to the source used for the build. Publish clear release notes, then download the assets from GitHub and compare their hashes with the local originals and manifest.

## First-user feedback

- [ ] Ask testers to report Windows version/build, Cypher version and installation type, display scaling, taskbar layout and minimal reproduction steps through the issue forms.
- [ ] Request only sanitized logs/screenshots when useful. Never request API keys, CLI credentials, cookies, complete account folders or private account data.
- [ ] Separate startup/interface reports, fixture-only tests and real-provider verification. Record what failed as well as what worked.
- [ ] Turn reproducible reports into scoped issues; avoid promising provider access, release dates, performance numbers or support commitments before they are established.
