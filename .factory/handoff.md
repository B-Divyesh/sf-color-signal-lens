# Color Signal Lens polish 3 handoff

## Result

Perfection-loop round 3 is complete. Every finding in `review-1.md`, `review-2.md`, and `review-3.md` is resolved and mapped in `.factory/polish-3.md`. The production site is <https://color-signal-lens.sociobot.in>.

The blocking F-3-1 repair makes **How it works** a complete accessible navigation action. Same-page, cross-route, direct-hash, keyboard, mouse, and Back paths now scroll to the section, focus its heading, and announce “How Color Signal Lens works”. The skip link also transfers focus explicitly.

Additional cumulative hardening in this round:

- `/?demo=1` now publishes the Demo title and `/demo` canonical.
- Static fallback metadata uses the same screenshot/status-color vocabulary as the rendered product.
- The demo-isolation claim now proves reset, direct query entry, exit cleanup, and unchanged real keys.
- The screenshot-privacy claim now covers file, paste, and selected-region capture while recording every request and script origin.
- Route metadata, legal links, 404 recovery, mobile overflow, and axe coverage now run across every public route at desktop and phone widths.
- `.factory/catalog-description.txt` is verb-first and 84 characters.

The existing paper-cut visual system, Tauri 2 desktop artifact, and static deployment class were preserved. No AI feature was added because deterministic, local screenshot treatment remains the useful and private solution described by the brief.

## Commits and deployment

- `16e2c73` — accessible section navigation and skip-link focus
- `5503801` — cumulative route, metadata, accessibility, and visual evidence tests
- `dc0f7ca` — exact claim coverage and deployed evidence
- Static deployment ID: `9f075d3d-eaaa-44e9-a464-cb16bba7d17e`
- Live asset: `assets/index-BwsUZcwm.js`
- Deployment command: `/opt/fleet/lib/deploy-static.sh color-signal-lens dist/site`

The desktop binary did not change, so the complete public `v0.1.8` release remains current. It contains both macOS DMGs, Windows EXE/MSI, Linux AppImage/DEB/RPM, `SHA256SUMS`, and `latest.json`.

## Clean-clone verification

Final clone: `/tmp/color-signal-lens-polish3-handoff.R3aDfU`

```sh
npm ci
# Every command in .factory/claims.json, run separately
CI=1 npm test
npm run check
npm run build
```

All 23 claim commands passed independently: `sample-lens`, `demo-isolation`, `local-screenshots`, `reading-cues`, `demo-reset`, `screenshot-input`, `paste-input`, `keyboard-color-input`, `capture-consent`, `clear-overlay`, `privacy-limits`, `named-presets`, `license-entitlement`, `lens-plus-price`, `license-restore`, `sociobot-checkout-path`, `license-daily-cache`, `desktop-release`, `installer-checksums`, `desktop-download-platforms`, `macos-shell-installer-architecture`, `release-fallback`, and `offline-reader`.

Aggregate results:

- Unit/install/release: 6 passed.
- Playwright integration/browser/accessibility/privacy/offline: 52 passed.
- TypeScript: passed.
- App and site builds: passed; both `dist/app` and `dist/site` produced.
- Site JavaScript: 31.68 KB raw / 10.62 KB gzip.
- Site CSS: 13.61 KB raw / 3.84 KB gzip.
- `cargo test --manifest-path src-tauri/Cargo.toml`: passed from `/tmp/color-signal-lens-polish3-final.q2Mbnv` after installing the release workflow's standard Linux Tauri packages.

## Production verification

- `/opt/fleet/lib/verify-url.sh` passed: title present, `lang=en`, one h1, main landmark, all images have alt text, no unlabeled buttons, and no console/page errors.
- `/`, `/demo`, `/?demo=1`, `/lens`, `/privacy`, and `/terms` return 200 with their exact route title, canonical, one h1, main landmark, and Privacy/Terms footer links.
- `/missing-review-route` returns a real 404 with the shared shell, legal links, recovery action, and 404 metadata.
- At 390 × 844 every route has `scrollWidth === innerWidth`. The first-screen job, audience, action, and three facts are above the fold.
- The live demo banner, active cue, and transformed canvas are above the fold; canvas bottom is 619 px. Seeded real license/preset keys were unchanged after cue changes, Reset, and exit.
- Live keyboard navigation reached `/#how`, placed the section at 67 px, focused its heading, and populated the polite announcer. Back focused the home h1.
- Axe found 0 serious/critical violations on `/`, `/demo`, `/lens`, `/privacy`, `/terms`, and the 404 at both 390 × 844 and 1440 × 900.
- Reduced-motion mode computes `scroll-behavior: auto`.
- Every extracted product, legal, checkout, release, and installer link resolved. The Sociobot buy link reached the hosted checkout with a 200 final response.
- Public `v0.1.8` release is non-draft and non-prerelease. `latest.json` validates; the downloaded AppImage passed its published `SHA256SUMS` entry.
- Lighthouse mobile: performance 99, accessibility 100, best practices 100, SEO 100; LCP 2.0 s, CLS 0, TBT 0 ms.

Evidence is stored in `.factory/evidence/polish-3-live/`, including `audit.json`, `lighthouse.json`, desktop/mobile captures, the live demo, and focused How it works screenshots.

## Run locally

```sh
npm ci
npm test
npm run check
npm run build
cargo test --manifest-path src-tauri/Cargo.toml
```

Linux Cargo builds require `libwebkit2gtk-4.1-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`, and `patchelf`.

## Needs operator action

None for this work order. The current installers are unsigned by design. A future signing change would require workflow support and operator-provided `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` secrets.

## Known gaps

None.
