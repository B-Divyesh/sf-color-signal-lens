# Color Signal Lens repair 6 handoff

## Status

Candidate `203a0e204d7d8f6787f923723c498058242621e5` was reproduced from verifier
report commit `0d2c13b09ba46b55ed81ab140a0d9b5eb9354351`. Version 0.1.7 repairs every
repository-owned finding while preserving the researched desktop-app scope and
the Sociobot purchase URL.

Before repair, the green sample chip selected `#9C2D20` at 1440 px and 390 px,
Clear lens selected `patterns`, the hydrated 390 px page measured 496 px wide,
saved presets vanished from the UI after reload, Open screenshot was absent
from the Tab sequence, and the Linux installer deleted its verified AppImage
when its temporary directory closed.

## Repairs

- Canvas pointer coordinates now scale from the CSS box to bitmap coordinates.
  The claim test clicks bitmap point `(983,503)` at 1440×900 and 390×844,
  verifies `#16714A`, then inspects rendered pixels for patterns, labels, and
  blue remapping.
- The Linux installer now selects the AppImage, verifies its published SHA-256,
  moves it to `${XDG_BIN_HOME:-$HOME/.local/bin}/color-signal-lens`, and marks
  it executable. macOS saves and opens its verified chip-specific DMG. Windows
  verifies and starts MSI/EXE installers.
- Lens Plus now provides persistent list, apply, rename, and delete operations
  in addition to save. Existing 0.1.6 preset records are migrated with stable
  fallback IDs.
- The real file input remains visually integrated but is focusable. SPA links,
  Back, and Start for real focus the destination `<h1>` and announce its title.
- Long hydrated filenames wrap inside the download area. Desktop and 390 px
  pages have no horizontal overflow.
- Clear lens now uses a real no-overlay state and redraws the source image.
- Focus uses a black inner ring and white outer ring; one edge exceeds 3:1 on
  every product surface. The wordmark and colour input are at least 44×44 px.
- Capture failures now explain screen-sharing recovery and point to Open
  screenshot instead of exposing raw platform errors.
- Known SPA routes are explicit static rewrites. Unknown paths fall through to
  the configured real HTTP 404 response.
- Copy-only claim checks were replaced with outcome checks for rendered canvas
  pixels, real/demo storage isolation, selected-region crop pixels, persisted
  preset CRUD, and a surviving executable installer.

## Purchase controller identity

The purchase action remains exactly:

`https://api.sociobot.in/api/v1/products/color-signal-lens/checkout`

That is the required Sociobot controller registration path. No payment-provider
URL or local substitute was introduced. A 2026-08-29 pre-deploy probe still
returned HTTP 404 `{"error":"enabled factory product","status":404}`. Product
registration is external factory/controller state; this worker has no billing
registration command or credential. The controller must enable the existing
`color-signal-lens` record without changing the URL.

## Verification evidence

- Clean `npm ci`: 29 packages, 0 vulnerabilities.
- Every command in `.factory/claims.json`: 18/18 passed separately.
- `CI=1 npm test`: 6 unit and 32 Playwright tests passed.
- `npm run check`: passed.
- `npm run build`: passed; `dist/app` and `dist/site` produced.
- Site output: JavaScript 28.23 KB (9.85 KB gzip), CSS 12.89 KB (3.70 KB
  gzip), hero WebP 50.72 KB.
- Playwright covered desktop and 390×844, keyboard, route focus, no overflow,
  44 px targets, two-tone focus, reduced motion, offline-after-load, privacy
  requests, error recovery, and Axe serious/critical findings (zero).
- Local `verify-url.sh /demo`: HTTP 200, 524 ms network-idle, no console errors,
  `lang=en`, one h1, main landmark, complete alt text, and named buttons.
- Local Lighthouse mobile: performance 100, accessibility 100, best practices
  100, SEO 100; FCP 0.9 s, LCP 1.9 s, TBT 10 ms, CLS 0, transfer 69 KiB.
- `cargo test --manifest-path src-tauri/Cargo.toml`: passed (0 Rust tests).
- `CI=1 npm run tauri build -- --bundles deb,rpm`: passed. DEB is 3,735,224
  bytes, SHA-256 `a587c5b2b4bf0ed8eab400fa13b8f70374c57a7a807c64d045c58cc82ab54e6f`.
  RPM is 3,737,443 bytes, SHA-256
  `4536185172da880a8cb5b53fd489bac35c4aa1c6d6eee61d3206bea1292d4629`.
  DEB metadata reports package `color-signal-lens`, version 0.1.7, amd64.
- The release binary remained open for an 8-second Xvfb native smoke test.

## Release and deployment

- Repair commit `1f4ed985e0ce6223a437a60eefb8d06b6f9ce443` was pushed to
  `origin/main` and tagged `v0.1.7`.
- GitHub Actions run `33224531111` completed successfully. Both macOS
  architectures, Windows, Linux, and the release-manifest gate passed.
- Public release `v0.1.7` is non-draft and includes x64/aarch64 DMGs, EXE, MSI,
  AppImage, DEB, RPM, `SHA256SUMS`, and valid `latest.json`.
- The public v0.1.7 DEB passed `sha256sum --check`. The exact live one-line
  installer downloaded and verified the 81,287,672-byte AppImage, then left an
  executable at the requested persistent install directory. Its SHA-256 is
  `89dd07eda3dc7bd661170202d528dbdde1aba453747dc620f63ad82c6cef036e`.
- `dist/site` was deployed to the existing Static Web App. Azure deployment ID:
  `abcc7606-9f58-4569-903c-d003970d41a2`; default host:
  `nice-pebble-0ccaf2710.7.azurestaticapps.net`.
- Live `/demo` passed `verify-url.sh` in 746 ms with no console errors. Axe found
  zero serious/critical findings across six routes at desktop and 390 px.
- Fresh live desktop and 390 px flows selected `#16714A`, rendered remap pixel
  `7,90,134`, restored source pixel `22,113,74`, and had viewport-equal document
  widths. Demo network traffic stayed same-origin. Fresh landing hydration chose
  the v0.1.7 AppImage at 390 px with no overflow or console error.
- Live Lighthouse mobile: performance 100, accessibility 100, best practices
  100, SEO 100; FCP 0.9 s, LCP 1.2 s, TBT 0 ms, CLS 0, transfer 68 KiB.
- Live and local SHA-256 match: HTML
  `5e5b29bc2e9be78adc5c72f9985fa917ddeebfe37aeb1692c0eaa735523f3f1e`, JS
  `b3e4d76e9ea46c1ea5b26e8a5191e6f143c1f6407d0eb6cc37358ebc8a79c131`, CSS
  `68c25cebc9030a0ce5474521c0220dc99ef0a9cb5672e07e686cb43f931b8636`, and
  `install.sh` `d67ff6e1f123d27678b6158c3adccb04ad97cd9c184ebc91b956209e72701dbe`.
- Live routes `/`, `/demo`, `/lens`, `/privacy`, and `/terms` return 200;
  `/missing-route` returns 404. HTML has HSTS, `nosniff`, strict referrer policy,
  and the expected CSP. Hashed assets are one-year immutable.
- An invalid live license returned 200 with `valid:false`. A 35-request follow-up
  produced 29×200 and 6×429 with `Retry-After: 2`; the service recovered to 200
  after three seconds.

## Operator action

- Enable the `color-signal-lens` product in the Sociobot billing controller so
  the preserved checkout URL resolves.
- Installers remain unsigned. macOS notarization needs `APPLE_CERTIFICATE`;
  Windows Authenticode needs `WINDOWS_CERT_PFX`. No secrets are stored here.
