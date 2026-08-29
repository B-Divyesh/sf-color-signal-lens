# Polish 4 — cumulative adversarial repair map

Candidate repaired: `e5b7942484fa7b7ad8435ec8df131db1ccf8db0a` (base review commit `d84474af582cb39e4601c219e2393f67d8014811`).

Production URL: <https://color-signal-lens.sociobot.in>

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Demo mode is route-derived, persists only `demo:` keys, hides paid controls, and exits without changing real settings. The landing lookup is now also cancelled before demo opens. | `@claim:demo-isolation`, `@claim:demo-reset`, `@claim:sample-lens`; `.factory/evidence/polish-4-local/demo-390.png`; live `/` → `/demo` → `/lens` check. |
| F-1-2 | The demo keeps the banner, active cue, and transformed sample ahead of secondary source actions on a phone. | `390px demo shows the sample result and active cue before scrolling`; `.factory/evidence/polish-4-local/demo-390.png`; live `/demo` at 390 × 844. |
| F-1-3 | Same-page and cross-route `#how` navigation scrolls, focuses the destination heading, announces it, and restores home-heading focus on Back. | `How it works reaches and announces its section through keyboard, Back, and a direct hash link`; live `/#how`. |
| F-1-4 | The sample claim starts at the real landing CTA and proves transformed output plus storage isolation. | `@claim:sample-lens`; live landing CTA. |
| F-1-5 | Privacy coverage exercises public routes, file input, paste, selected-region capture, request origins, and runtime script origins. | `@claim:local-screenshots`, `@claim:capture-consent`; live `/privacy` and `/demo`. |
| F-1-6 | Phones receive desktop requirements; desktop user agents receive their matching installer state. | `@claim:desktop-download-platforms`; live phone landing check. |
| F-1-7 | The $12 one-time price is backed by the recorded checkout contract, while unprovable merchant/refund wording remains absent. | `@claim:lens-plus-price`, `@claim:sociobot-checkout-path`; live landing/terms check. |
| F-1-8 | Headings and limits copy use concrete screenshot, display, and processing language. | `@claim:privacy-limits`; `.factory/copy-audit.md`; live landing and `/privacy`. |
| F-1-9 | Visitor copy consistently uses screenshot, status color, overlay, label, pattern, blue-orange colors, preset, demo, and app. | `.factory/copy-audit.md`; `@claim:reading-cues`; live landing and workspace. |
| F-1-10 | Restore and release actions name their outcome. | `@claim:license-restore`, `@claim:release-fallback`; live landing. |
| F-1-11 | Paste and keyboard color input are observable, tagged core-workflow claims. | `@claim:paste-input`, `@claim:keyboard-color-input`; live `/demo`. |
| F-1-12 | The landing retains three captioned, original desktop workflow frames with documented provenance. | Route/accessibility suite; `public/walkthrough-open.png`, `walkthrough-select.png`, `walkthrough-remap.png`; live `/#how`. |
| F-1-13 | Per-route metadata, titles, canonical URLs, social image, sitemap entries, landmarks, and legal footer links remain asserted. | `every route has its own title, metadata, landmarks, and legal links`; live `/`, `/demo`, `/lens`, `/privacy`, `/terms`. |
| F-1-14 | The in-app and host-served 404 use the shared shell, legal links, plain recovery copy, metadata, and a real 404 response. | `the app 404 has plain recovery copy, metadata, and the shared legal footer`; live `/missing-review-route`. |
| F-1-15 | README and fallback wording are concrete. The unsupported publishing-status sentence was removed. | `.factory/copy-audit.md`; `@claim:release-fallback`; live landing fallback. |
| F-2-1 | The sample test checks a transformed canvas pixel and all non-demo storage through entry, reset, and exit. | `@claim:sample-lens`; delayed-response sandbox in `tests/claims.spec.ts`. |
| F-2-2 | The first screen retains tested screenshot privacy, installed-app offline use, and exact price facts. | `@claim:local-screenshots`, `@claim:offline-reader`, `@claim:lens-plus-price`; `.factory/evidence/polish-4-local/home-390.png`; live landing. |
| F-2-3 | README links directly to the production demo and explains the concrete sample and separation. | `README.md`; `@claim:sample-lens`, `@claim:demo-isolation`; live `/demo`. |
| F-2-4 | The copy audit covers catalog, metadata, landing conditional states, workspace, legal routes, README, word counts, and the terminology table. | `.factory/copy-audit.md`; local and live first-screen audit. |
| F-3-1 | Keyboard and mouse hash navigation explicitly focus and announce the destination. | Both How-it-works regression tests; live `/#how` focus and announcement check. |
| F-4-1 | Landing release hydration now owns an `AbortController`, cancels on any demo navigation, and checks the active route/controller before cache writes or DOM changes. The claim replaces the old empty-response mask with a delayed non-empty response that ignores abort, then proves all non-demo keys remain byte-for-byte unchanged through Reset and Start for real. | `@claim:sample-lens`; `.factory/claims.json`; `.factory/evidence/polish-4-local/demo-390.png`; live storage audit after landing CTA. |
| F-4-2 | Replaced “Downloads are being published.” with “Choose a download from the Releases page.” and retained the explicit **Open release downloads** link. | `@claim:release-fallback`; `landing release lookup handles an empty release list without a console error`; live landing fallback check. |

## Local verification before deploy

- Fresh clone: `/tmp/color-signal-lens-polish4-clean-E0q7ek` at `e5b7942`; `npm ci` succeeded without vulnerabilities.
- Every one of the 23 commands in `.factory/claims.json` passed independently from that clone, including the delayed non-empty release-response storage test.
- `CI=1 npm test` passed: 6 unit/release checks and 52 Playwright tests, including route-wide axe serious/critical scans at 390 × 844 and 1440 × 900, privacy request coverage, offline behavior, mobile layout, routing, and 404 checks.
- `npm run check`, `npm run build`, and `cargo test --manifest-path src-tauri/Cargo.toml` passed. The site output is 31.95 KB raw / 10.74 KB gzip JavaScript and 13.61 KB raw / 3.84 KB gzip CSS.
- Local visual evidence: `.factory/evidence/polish-4-local/home-390.png`, `home-1440.png`, and `demo-390.png`.

## Live verification

- Deployed `dist/site` with `/opt/fleet/lib/deploy-static.sh color-signal-lens /work/repo/dist/site`; Azure deployment id `d67e0a80-11f0-4baa-a20f-d5823742f751` completed successfully. Both the custom domain and Azure host serve `assets/index-BDCOqMlU.js`.
- Factory verifier: `https://color-signal-lens.sociobot.in` returned 200 in 772 ms with title **Color Signal Lens — Make status colors distinct**, `lang=en`, one h1, one main, no missing image alt text, no unlabeled buttons, and no console/page errors. Evidence: `.factory/evidence/polish-4-live/verify.json`, `index.html`, `screenshot-desktop.png`, and `screenshot-mobile.png`.
- The live Playwright/Axe audit covers `/`, `/demo`, `/lens`, `/privacy`, `/terms`, and `/missing-review-route` at 390 × 844 and 1440 × 900. It found zero serious/critical violations, no horizontal overflow, no normal-route errors, 200 on product routes, and a real 404 on the missing route. The expected main-document 404 console line is recorded but excluded from normal-route error results. Evidence: `.factory/evidence/polish-4-live/audit.json`.
- The deployed delayed-response storage audit starts from the landing CTA, releases a non-empty response after the demo banner is shown, and records `{}` before entry, after entry, after Reset demo, and after Start for real. It also records the live fallback copy/link and `/#how` focus/announcement. Evidence: `.factory/evidence/polish-4-live/audit.json` and `demo-390.png`.
- Mobile Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.871 s, CLS 0, TBT 4 ms. Evidence: `.factory/evidence/polish-4-live/lighthouse.json`.
