# Contributing to Cypher

Start with [README.md](README.md) for setup and [implementation notes](docs/IMPLEMENTATION-NOTES.md) for architecture. Keep changes focused and describe what a person can actually do after the change.

## Local checks

Use Node.js 24 on Windows and Microsoft Edge for browser tests.

```powershell
npm ci
npm run typecheck
npm test
npm run test:ui
npm run build
npm run security:scan
npm run security:secrets
```

Changes to packaging or security also require the packaged checks in [SECURITY.md](SECURITY.md). Native taskbar tests must run sequentially because they change the same Explorer surface.

## Provider changes

Use synthetic fixtures. Never commit real credentials, account profiles, browser cookies, diagnostic captures or personal settings. Keep missing, stale and zero-valued data distinct. Do not infer a paid plan from tool installation or present simulated responses as live-provider verification.

Preserve saved language and legacy data-location compatibility. English is the default for new profiles; French remains an optional localization.

## Reviews and reports

Explain the behavior change and include the checks actually run. Keep historical verification notes dated and scoped. Report security concerns as described in [SECURITY.md](SECURITY.md); do not include secrets in issues or pull requests.
