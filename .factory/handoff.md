# Color Signal Lens — polish 4 handoff

## Result

Repaired and deployed the review-4 release candidate. The blocking landing-to-demo storage leak and the misleading download fallback are fixed. There are no known open findings.

Repair commits:

- `cc65aec` — cancels and guards landing release hydration when demo mode opens; updates fallback copy, claims, demo documentation, copy audit, and catalog description.
- `e5b7942` — makes the sample claim prove the delayed non-empty release-response path, including Reset demo and Start for real.

## What changed

- Release metadata lookup now has an `AbortController`; any demo navigation cancels it. A second active-route/controller check runs before it can write `color-signal-lens:release` or change download UI.
- `@claim:sample-lens` now delays a non-empty release response that deliberately ignores abort, clicks the actual landing CTA, and proves every non-demo local-storage key is unchanged through entry, reset, and exit.
- The fallback now says **Choose a download from the Releases page.** and retains **Open release downloads**; it no longer asserts an unavailable publishing state.
- Updated `.factory/claims.json`, `.factory/demo.md`, `.factory/copy-audit.md`, and the verb-first catalog sentence. `.factory/polish-4.md` maps every cumulative finding to its repair and evidence.

## Verification

### Clean clone

From fresh clone `/tmp/color-signal-lens-polish4-clean-E0q7ek` at `e5b7942484fa7b7ad8435ec8df131db1ccf8db0a`:

- `npm ci` passed with zero reported vulnerabilities.
- Every one of the 23 commands declared in `.factory/claims.json` passed independently. This includes `@claim:sample-lens`, the release fallback, privacy request coverage, demo isolation/reset, inputs, license behavior, installers, platform selection, and offline reader.
- `CI=1 npm test` passed: 6 unit/release checks and 52 Playwright tests. The suite includes axe serious/critical scans for all routes at 390 × 844 and 1440 × 900, routing/focus/404, keyboard/touch targets, privacy, offline, and mobile layout checks.
- `npm run check` and `npm run build` passed. Site output: 31.95 KB raw / 10.74 KB gzip JavaScript; 13.61 KB raw / 3.84 KB gzip CSS.
- `cargo test --manifest-path src-tauri/Cargo.toml` passed after installing the standard Linux Tauri build prerequisites: `libwebkit2gtk-4.1-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`, and `patchelf`.

### Deployment and live re-check

Deployed static output with `/opt/fleet/lib/deploy-static.sh color-signal-lens /work/repo/dist/site`. Azure deployment `d67e0a80-11f0-4baa-a20f-d5823742f751` succeeded. Cold custom-domain checks confirm production serves `assets/index-BDCOqMlU.js`.

- `/opt/fleet/lib/verify-url.sh https://color-signal-lens.sociobot.in .factory/evidence/polish-4-live` passed: HTTP 200, correct title/language, one h1, main landmark, complete image alt coverage, labeled buttons, and no console/page errors.
- Live Playwright/Axe check passed on `/`, `/demo`, `/lens`, `/privacy`, `/terms`, and the real 404 at both 390 × 844 and 1440 × 900: zero serious/critical issues, no normal-route errors, no overflow, expected statuses, and all metadata/landmark basics present. See `.factory/evidence/polish-4-live/audit.json`.
- Live delayed-response demo audit confirmed non-demo storage remained `{}` before entry, after entry, after Reset demo, and after Start for real. It also verified the exact fallback sentence/link and `/#how` focus/announcement. See `audit.json` and `demo-390.png`.
- Live mobile Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.871 s, CLS 0, TBT 4 ms. See `lighthouse.json`.

## Evidence

- Local: `.factory/evidence/polish-4-local/home-390.png`, `home-1440.png`, and `demo-390.png`.
- Live: `.factory/evidence/polish-4-live/verify.json`, `audit.json`, `lighthouse.json`, `screenshot-desktop.png`, `screenshot-mobile.png`, and `demo-390.png`.

## Known gaps and next steps

None. The existing desktop release workflow remains unchanged; this work order deployed the repaired static site as configured.
