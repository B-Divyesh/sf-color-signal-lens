# Polish 5 — cumulative adversarial repair map

Candidate repaired: `44ce5acd420dbeb59022c5000fe8aea350a0277f`, based on review commit `18a9f08e8271620bc8367a46a220d7e9c41a0d1b`.

Production URL: <https://color-signal-lens.sociobot.in>

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Demo state remains route-derived. Demo storage uses only `demo:` keys, paid controls stay hidden, and Reset/exit never mutate real license, preset, or release-cache values. | `@claim:demo-isolation`, `@claim:demo-reset`; `.factory/evidence/polish-5-live/demo-390.png`; live `/` → `/demo` → `/lens` storage snapshots in `audit.json` are all `{}`. |
| F-1-2 | The banner, active cue, and full transformed sample remain ahead of secondary controls on a 390×844 screen. | `390px demo shows the sample result and active cue before scrolling`; `.factory/evidence/polish-5-live/demo-390.png`; live cue bottom 391 px and canvas bottom 619 px. |
| F-1-3 | Same-page and cross-route How it works navigation scrolls, focuses, announces, and restores route focus on Back. | Both How-it-works regression tests; `.factory/evidence/polish-5-live/screenshot-mobile.png`; live `/#how` target top 0.05 px, focused and announced. |
| F-1-4 | The sample and isolation claims begin at the landing CTA and exercise the delayed real release response, Reset, and exit. | `@claim:sample-lens`, `@claim:demo-isolation`; `.factory/evidence/polish-5-live/demo-390.png`; live one-click path retained every non-demo snapshot byte-for-byte. |
| F-1-5 | Privacy coverage now visits the landing and every public route, exercises file, paste, and selected-region capture, and checks request/script origins. | `@claim:local-screenshots`, `@claim:capture-consent`; `.factory/evidence/polish-5-live/screenshot-mobile.png`; live routes have no console errors or third-party scripts. |
| F-1-6 | Phone detection runs before desktop selection; phones receive desktop requirements while macOS, Windows, and Linux receive explicit choices. | `@claim:desktop-download-platforms`, installer/release claim tests; `.factory/evidence/polish-5-live/screenshot-mobile.png`; live iPhone state says downloads require macOS, Windows, or Linux and exposes no installer choice. |
| F-1-7 | Payment, merchant, refund, and entitlement statements now have separate contract fixtures and behavioral claim tests. | `@claim:lens-plus-price`, `@claim:merchant-of-record`, `@claim:refund-revocation`; `.factory/evidence/polish-5-local/terms-390.png`; live `/terms` copy and revoked-license lockout pass. |
| F-1-8 | Section headings and limits use concrete screenshot, display, and processing language. | `@claim:privacy-limits`; `.factory/evidence/polish-5-live/screenshot-mobile.png`; live `/` and `/privacy` copy checked. |
| F-1-9 | Visitor language remains limited to screenshot, status color, overlay, label, pattern, blue-orange colors, preset, demo, and app. | Copy-audit unit tests and `@claim:reading-cues`; `.factory/evidence/polish-5-live/screenshot-mobile.png`; live landing, workspace, and legal copy checked. |
| F-1-10 | Restore and download actions continue to name their results. | `@claim:license-restore`, `@claim:release-fallback`; `.factory/evidence/polish-5-live/screenshot-mobile.png`; live **Restore license** and download actions checked. |
| F-1-11 | Paste and keyboard color input retain their own observable claim tests. | `@claim:paste-input`, `@claim:keyboard-color-input`; `.factory/evidence/polish-5-live/demo-390.png`; live `/demo` controls checked. |
| F-1-12 | Three original captioned desktop workflow frames remain responsive and lazy-loaded. | Route/accessibility suite; `.factory/evidence/polish-5-live/screenshot-mobile.png`; live `/#how` displays all three frames with specific alt text. |
| F-1-13 | Titles, descriptions, canonicals, Open Graph/Twitter fields, route discovery, landmarks, and legal links remain route-specific. | `every route has its own title, metadata, landmarks, and legal links`; `.factory/evidence/polish-5-live/screenshot-desktop.png`; live metadata matrix in `audit.json`. |
| F-1-14 | The deployed 404 retains the shared paper-cut shell, plain recovery wording, metadata, and legal links with HTTP 404. | 404 regression and static deployment tests; `.factory/evidence/polish-5-live/screenshot-mobile.png`; live `/missing-polish-5-route` returned 404 with **Page not found**. |
| F-1-15 | README and fallback wording remain concrete and observable. | Copy-audit tests and `@claim:release-fallback`; `.factory/evidence/polish-5-live/screenshot-mobile.png`; live fallback sends visitors to Releases. |
| F-2-1 | The sample claim asserts a transformed pixel and all non-demo storage through entry, Reset, and exit. | `@claim:sample-lens`; `.factory/evidence/polish-5-live/demo-390.png`; live delayed-response snapshots all matched. |
| F-2-2 | Privacy, installed-app offline use, and exact price remain visible above the first mobile fold. | `@claim:local-screenshots`, `@claim:offline-reader`, `@claim:lens-plus-price`; `.factory/evidence/polish-5-live/screenshot-mobile.png`; live facts bottom 667 px in an 844 px viewport. |
| F-2-3 | README keeps the clickable production demo URL and names its checkout-diff sample and data separation. | `@claim:sample-lens`, `@claim:demo-isolation`; `.factory/evidence/polish-5-local/home-390.png`; live `/demo` returned 200. |
| F-2-4 | The audit was regenerated from current copy and now has automated row-count and README-completeness checks. | `copy audit records mechanically correct whitespace word counts` and `copy audit contains every README heading and prose unit`; `.factory/evidence/polish-5-local/home-390.png`; live copy cross-checked at 390 and 1440 px. |
| F-3-1 | Keyboard and mouse hash navigation continue to focus and announce the destination, including Back restoration. | Both How-it-works regression tests; `.factory/evidence/polish-5-live/screenshot-mobile.png`; live `/#how` focused and announced **How Color Signal Lens works**. |
| F-4-1 | Landing hydration remains abortable and guarded by active route/controller checks; the claim uses a delayed non-empty response that ignores abort. | `@claim:sample-lens`; `.factory/evidence/polish-5-live/demo-390.png`; live before/entry/Reset/exit non-demo snapshots are all `{}`. |
| F-4-2 | The fallback continues to say “Choose a download from the Releases page” without guessing release status. | `@claim:release-fallback`; `.factory/evidence/polish-5-local/home-390.png`; live fallback link and GitHub Releases destination checked. |
| F-5-1 | Added `merchant-of-record` and `refund-revocation` claims, authoritative work-order contract fixtures, and a revoked-verdict flow that removes the token and locks preset controls without deleting saved data. Copy now explains the merchant term. | `@claim:merchant-of-record`, `@claim:refund-revocation`; `.factory/evidence/polish-5-local/terms-390.png`; live `/terms`, `/lens`, and refund simulation recorded in `audit.json`. |
| F-5-2 | Rebuilt the audit to 189 current rows, corrected every count, removed obsolete copy, added every README heading/sentence, and made count/completeness/claim-tag integrity executable tests. | Three tests in `tests/copy-audit.test.ts`; `.factory/evidence/polish-5-local/home-1440.png`; live root and README were cross-checked against `.factory/copy-audit.md`. |
| F-5-3 | Replaced “checkout path” with “Buy Lens Plus opens Sociobot's payment page.” | `@claim:sociobot-checkout-path`; `.factory/evidence/polish-5-local/terms-390.png`; live Buy link remains the registered Sociobot URL. |
| F-5-4 | Replaced “third-party runtime scripts” with “loads no code from other websites.” | `@claim:local-screenshots`; `.factory/evidence/polish-5-live/screenshot-mobile.png`; live request/script-origin and console checks pass. |
| F-5-5 | Renamed the README heading to **Use Color Signal Lens**. | `copy audit contains every README heading and prose unit`; `.factory/evidence/polish-5-local/home-390.png`; deployed product instructions and README terminology match. |

## Verification summary

- Clean clone: `/tmp/color-signal-lens-polish5-clean.zzoVJH` at `44ce5acd420dbeb59022c5000fe8aea350a0277f`; `npm ci` found zero vulnerabilities.
- Every one of the 27 exact `.factory/claims.json` commands passed independently.
- `CI=1 npm test`: 10 unit/contract tests and 58 Playwright tests passed.
- `npm run check`, `npm run build`, and `cargo test --manifest-path src-tauri/Cargo.toml` passed. Rust ran two native bridge tests.
- Site output: 33.69 KB raw / 11.22 KB gzip JavaScript and 13.97 KB raw / 3.92 KB gzip CSS.
- Azure Static Web Apps deployment `7c22ac76-ddd8-4094-8fa7-3f30d9b64a93` serves `assets/index-6rblTqQC.js` from both hosts.
- Factory URL verifier: HTTP 200, 893 ms load, correct title/lang/main/h1/alt/button labels, and no console errors.
- Live Playwright/Axe audit: 10 route/viewport combinations, zero serious/critical violations, zero normal-route errors, and zero horizontal overflow.
- Mobile Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.2 s, CLS 0, TBT 0 ms.
