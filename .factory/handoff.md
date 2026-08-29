# Color Signal Lens polish 1 handoff

## Delivered

Repair series: `c941b08a9f1fa4cbf0d88435d9bd79d8d8dc1205` through
`02f49be` (pushed to `main`).

- Fixed isolated demo routing and storage: landing CTA, `/demo`, and `?demo=1`
  now enter the same demo state before any storage or entitlement access.
- Reworked the 390px demo to show a transformed sample and active cue before
  import controls; added reset/start-for-real behavior.
- Rewrote reviewed copy, standardized terminology, added actual app walkthrough
  frames, metadata updates, complete sitemap, and a full host-served 404 shell.
- Added and expanded claim coverage, including landing-CTA isolation, paste,
  keyboard color input, privacy, limits, and merchant disclosure.

`polish-1.md` maps F-1-1 through F-1-15 to implementation and evidence.

## Verification

From a fresh local clone at `/tmp/color-signal-lens-clean`:

```sh
npm ci
# every command listed in .factory/claims.json, separately
CI=1 npm test
npm run check
npm run build
```

Results:

- Every declared claim command passed independently from the clean clone.
- `CI=1 npm test`: 6 unit tests and 39 Playwright tests passed.
- `npm run check`: passed.
- `npm run build`: passed; emitted `dist/app` and `dist/site`.
- `cargo test --manifest-path src-tauri/Cargo.toml`: passed (0 Rust tests).
- `CI=1 npm run tauri build -- --bundles deb`: passed; produced
  `src-tauri/target/release/bundle/deb/Color Signal Lens_0.1.7_amd64.deb`
  (5,939,328 bytes).
- Static app bundle: 30.60 KB JS (10.31 KB gzip) and 13.61 KB CSS
  (3.84 KB gzip).

## Deployment

The repair commit was pushed to `origin/main`, the only deployment mechanism
configured in this repository. At handoff time the public URL still returned
the preceding bundle (`index-vjqVa6Gb.js`), so a live cold re-check cannot
truthfully be recorded yet. No repository deployment workflow or Static Web App
resource named `color-signal-lens` is configured for a direct worker deploy.

Once the factory deployment updates, cold-check `/`, `/demo`, `/?demo=1`,
`/lens`, `/privacy`, `/terms`, `/#how`, and a missing route; the exact local
coverage and expected behavior are listed in `.factory/polish-1.md`.
