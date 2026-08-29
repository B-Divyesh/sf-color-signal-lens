# Independent verification 7 — PASS

**Candidate:** `d8061572cc97e1b54eb75bdc9baebbcd78b70629`  
**Live URL:** https://color-signal-lens.sociobot.in  
**Verified:** 2026-08-29 UTC  
**Verdict:** **PASS — ready to release.**

## Cold first read and demo

On a fresh 1440×900 visit, the first screen says “Make status colors distinct.”
It says this is for people who cannot rely on red and green in code reviews,
charts, or status screens, and its first action is **Try it with sample data**
with the immediate outcome “See a diff lens open with nothing saved.” One click
opens `/demo`, with `checkout-totals.diff.png` and the persistent “Demo —
sample data, nothing is saved” banner, Reset demo, and Start for real. This
meets the plain-words and one-click demo gates.

## Mandatory claims gate

After clean `npm ci` (29 packages; 0 vulnerabilities), every exact command in
`.factory/claims.json` passed separately. All 18 declared claims passed:

`sample-lens`, `local-screenshots`, `reading-cues`, `demo-reset`,
`screenshot-input`, `capture-consent`, `named-presets`, `license-entitlement`,
`lens-plus-price`, `installer-checksums`, `desktop-release`,
`macos-installer-architecture`, `macos-shell-installer-architecture`,
`clear-lens`, `license-daily-cache`, `license-restore`, `release-fallback`,
and `sociobot-checkout-path`.

## Local quality gates

- `CI=1 npm test`: PASS — 6 unit tests and 32 Playwright tests.
- `npm run check`: PASS.
- `npm run build`: PASS — emitted `dist/app` and `dist/site`.
- `cargo test --manifest-path src-tauri/Cargo.toml`: PASS (0 Rust tests).
  The clean container initially lacked normal Tauri GTK build prerequisites;
  after installing those OS packages, the project compiled and passed.
- `CI=1 npm run tauri build -- --bundles deb`: PASS. It produced
  `Color Signal Lens_0.1.7_amd64.deb` (3,735,222 bytes; SHA-256
  `ee2560a3e7ddab583f687fb7f4ebc2bf2c811d39879bca43b8d29ac975f5a740`).
  Its metadata is `color-signal-lens` / `0.1.7` / `amd64`; the contained
  native executable remained open under Xvfb for an eight-second smoke test.
- Production site bundle: JS 28,225 bytes (9.85 KB gzip), CSS 12,890 bytes
  (3.70 KB gzip), and hero WebP 50,718 bytes. These are within the stated
  budgets.

## Live deployment identity, behavior, and accessibility

The live HTML and hashed JS/CSS exactly equal the clean candidate build:

| File | SHA-256 |
| --- | --- |
| `index.html` | `5e5b29bc2e9be78adc5c72f9985fa917ddeebfe37aeb1692c0eaa735523f3f1e` |
| `assets/index-vjqVa6Gb.js` | `b3e4d76e9ea46c1ea5b26e8a5191e6f143c1f6407d0eb6cc37358ebc8a79c131` |
| `assets/style-xkVBdfaE.css` | `68c25cebc9030a0ce5474521c0220dc99ef0a9cb5672e07e686cb43f931b8636` |

Fresh desktop and 390×844 live flows clicked the green sample signal and
selected `#16714A`; blue remap rendered `7,90,134`; Clear lens restored
`22,113,74`. Both widths had `scrollWidth === innerWidth`, no console/page
errors, and reduced motion reported `scroll-behavior: auto`. Invalid image
input preserved the existing image and capture failure gave the useful
screen-sharing/open-screenshot recovery message. Keyboard Tab reaches Open
screenshot, its focused input has a 3px black outline, and SPA navigation and
Back put focus on the destination `h1`.

`verify-url.sh https://color-signal-lens.sociobot.in/demo` passed: HTTP 200,
710 ms network-idle, title/lang, one h1, main landmark, image alt text, named
buttons, and no console errors. Axe found zero serious or critical findings on
`/`, `/demo`, `/lens`, `/privacy`, `/terms`, and `/missing-route` at desktop
and 390px. The first five routes return 200; the unknown route returns 404.

## Privacy, headers, release, and allowance

- During a fresh demo lens flow, outgoing requests were same-origin only;
  there was no analytics or screenshot upload. Landing plus invalid-license
  recovery additionally contacted only the documented GitHub release API and
  Sociobot verification API. No third-party runtime scripts are loaded.
- Live headers include HSTS, `X-Content-Type-Options: nosniff`, strict-origin
  referrer policy, and a CSP limited to self plus the documented GitHub and
  Sociobot endpoints. HTML is `max-age=30`; hashed assets are one-year
  `immutable`.
- The live Sociobot checkout URL returned HTTP 200 and showed the $12
  Color Signal Lens Plus checkout. An invalid restored license returned the
  user to the locked state and removed its local token.
- One client received 200 for 30 consecutive verification requests; request
  31 returned 429 with `Retry-After: 3`. A request after four seconds returned
  200. Observed allowance: **30 requests per window**.
- GitHub release `v0.1.7` is public and has both macOS DMGs, Windows EXE/MSI,
  Linux AppImage/DEB/RPM, `SHA256SUMS`, and valid `latest.json`. The real
  hosted `install.sh` downloaded the 77.5 MiB AppImage, verified SHA-256
  `89dd07eda3dc7bd661170202d528dbdde1aba453747dc620f63ad82c6cef036e`, and
  left an executable in an isolated install directory.

There is no PWA/service worker, sign-in flow, product-owned backend, library,
or CLI; the associated checks are not applicable.

## Defects

None found. The prior verifier's pixel-picking, clear-lens, preset CRUD,
keyboard, mobile-overflow, installer, checkout, capture-recovery, and 404
findings were independently retested and are fixed.
