# Polish 6 — cumulative adversarial repair map

Candidate repaired: `6f3827d645fab812fff2dbdd7c1cb455f0bf9596`, based on review commit `1bf51e685d57e847b97b97166b4dd6163ba218f1`.

Production URL: <https://color-signal-lens.sociobot.in>

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Demo state is route-derived, paid controls stay hidden, and demo operations cannot read or write license, preset, or release-cache data. | `@claim:demo-isolation`, `@claim:demo-reset`; `.factory/evidence/polish-6-live/demo-reset-390.png`; live `audit.json` reports `realStorageUnchanged: true`. |
| F-1-2 | The phone demo puts the banner, active cue, and full transformed sample before secondary controls. | `390px demo shows the sample result and active cue before scrolling`; `.factory/evidence/polish-6-live/demo-reset-390.png`; live canvas bottom 619 px in an 844 px viewport. |
| F-1-3 | Same-page and cross-route How it works navigation scrolls, focuses, announces, and restores focus on Back. | Both How-it-works regression tests; live `audit.json` records target top 0 and the focused/announced heading. |
| F-1-4 | Demo claims enter through the actual landing CTA and cover a delayed non-empty release response, Reset, and exit. | `@claim:sample-lens`, `@claim:demo-isolation`; live one-click flow in `audit.json`. |
| F-1-5 | Privacy coverage visits every public route, exercises file, paste, and selected-region capture, and checks request and script origins. | `@claim:local-screenshots`, `@claim:capture-consent`; live request origins in `audit.json` contain only the product and GitHub release API. |
| F-1-6 | Phone detection precedes desktop selection; each desktop platform gets an explicit installer while phones get desktop requirements. | `@claim:desktop-download-platforms`, `@claim:desktop-release`, `@claim:installer-checksums`, `@claim:macos-shell-installer-architecture`; `.factory/evidence/polish-6-live/screenshot-mobile.png`. |
| F-1-7 | Payment, merchant, refund, and entitlement statements have contract fixtures and behavioral tests. | `@claim:lens-plus-price`, `@claim:merchant-of-record`, `@claim:refund-revocation`, `@claim:license-entitlement`. |
| F-1-8 | Section headings and limits use concrete screenshot, display, and processing language. | `@claim:privacy-limits`; `.factory/evidence/polish-6-local/home-1440.png`; live `/privacy`. |
| F-1-9 | Visitor language consistently uses screenshot, status color, overlay, label, pattern, blue-orange colors, preset, demo, and app. | Copy-audit tests and `@claim:reading-cues`; live route copy in `audit.json`. |
| F-1-10 | Restore and download actions name their results. | `@claim:license-restore`, `@claim:release-fallback`; `.factory/evidence/polish-6-live/screenshot-mobile.png`. |
| F-1-11 | Paste and keyboard color entry each have an observable claim test. | `@claim:paste-input`, `@claim:keyboard-color-input`; live `/demo`. |
| F-1-12 | Three original, captioned desktop workflow frames remain responsive and lazy-loaded. | Route/accessibility suite; live `/#how`; `.factory/evidence/polish-6-local/home-1440.png`. |
| F-1-13 | Every route has its own title, description, canonical, Open Graph/Twitter data, landmarks, and legal links. | `every route has its own title, metadata, landmarks, and legal links`; 12 live route/viewport checks in `audit.json`. |
| F-1-14 | Unknown paths return HTTP 404 with the paper-cut shell, recovery action, metadata, and legal links. | `the app 404 has plain recovery copy, metadata, and the shared legal footer`; live `/missing-polish-6-route` checks in `audit.json`. |
| F-1-15 | README and download fallback wording are concrete and observable. | Copy-audit tests and `@claim:release-fallback`; live landing fallback. |
| F-2-1 | The sample claim asserts a changed image pixel and byte-for-byte preservation of all non-demo storage through entry, Reset, and exit. | `@claim:sample-lens`; live `realStorageUnchanged: true` in `audit.json`. |
| F-2-2 | Privacy, installed-app offline use, and exact one-time price remain above the first phone fold. | `@claim:local-screenshots`, `@claim:offline-reader`, `@claim:lens-plus-price`; `.factory/evidence/polish-6-local/home-390.png`. |
| F-2-3 | README links directly to `/demo` and names the realistic checkout-diff sample and storage separation. | `@claim:sample-lens`, `@claim:demo-isolation`; live `/demo` returned 200. |
| F-2-4 | The copy audit has current counts plus executable row-count and README-completeness checks. | `copy audit records mechanically correct whitespace word counts` and `copy audit contains every README heading and prose unit`. |
| F-3-1 | Keyboard and mouse hash navigation focus and announce the destination, including Back restoration. | Both How-it-works regression tests; live focus history in `audit.json`. |
| F-4-1 | Landing hydration is abortable and route-guarded; tests use a delayed response that ignores abort. | `@claim:sample-lens`; live one-click storage snapshots in `audit.json`. |
| F-4-2 | The fallback directs visitors to Releases without claiming that an installer is already published. | `@claim:release-fallback`; live fallback copy and link. |
| F-5-1 | Merchant and refund behavior has fixture-backed claims; a revoked verdict removes the token and locks presets without deleting saved data. | `@claim:merchant-of-record`, `@claim:refund-revocation`; live `/terms`. |
| F-5-2 | The current audit includes every landing and README prose unit, with mechanically verified counts and claim-tag integrity. | All three tests in `tests/copy-audit.test.ts`; `.factory/copy-audit.md`. |
| F-5-3 | Purchase copy says “Buy Lens Plus opens Sociobot's payment page.” | `@claim:sociobot-checkout-path`; live `/terms`. |
| F-5-4 | Privacy copy says the app “loads no code from other websites.” | `@claim:local-screenshots`; live script/request-origin audit. |
| F-5-5 | The README uses the plain heading **Use Color Signal Lens**. | `copy audit contains every README heading and prose unit`; `README.md`. |
| F-6-1 | Removed the unused demo-start marker and added one prefix-based cleanup path. Reset now clears every present and future `demo:color-signal-lens:*` key, restores the shipped image and default cue, and leaves real storage untouched. | Strengthened `@claim:demo-reset` seeds current and future demo keys and a real preset, then proves zero demo keys and unchanged real data; `.factory/evidence/polish-6-live/demo-reset-390.png`; live `audit.json` records `demoKeys: []` after Reset and exit. |

## Verification summary

- Fresh clone at `afcd9aabd454f62a8900bb660aca5a505185491f`: `npm ci` found zero vulnerabilities; all 27 exact `.factory/claims.json` commands passed independently.
- `CI=1 npm test`: 10 unit/contract tests and 58 Playwright tests passed.
- `npm run check`, `npm run build`, and `cargo test --manifest-path src-tauri/Cargo.toml` passed; Rust ran two native bridge tests.
- Site output: 33.64 KB raw / 11.24 KB gzip JavaScript and 13.97 KB raw / 3.92 KB gzip CSS.
- Azure Static Web Apps deployment `17951525-809e-4dd0-bc7d-9cd03fbc5f81` serves byte-identical HTML, JavaScript, and CSS at the production URL.
- Factory verifier: HTTP 200, 1,093 ms load, correct title/lang/main/h1/alt/button labels, and no console errors.
- Live Playwright/Axe audit: 12 route/viewport checks, no failed checks, no horizontal overflow, and no serious or critical Axe violations.
- Mobile Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.8 s, CLS 0, TBT 0 ms.
- Release workflow: tag `v0.1.12`; all five jobs passed and 11 assets were published. The downloaded DEB matched `SHA256SUMS`, `latest.json` matched the tag and commit, and each live platform button resolved to a 200 asset. See `.factory/evidence/polish-6-live/release.json`.
