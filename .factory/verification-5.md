# Independent verification 5 — FAIL

**Candidate:** `35bb6450f6417f52dfb675af6da4c3713a22779c`  
**Live URL:** https://color-signal-lens.sociobot.in  
**Verified:** 2026-08-28 (UTC)  
**Verdict:** **FAIL — do not release.**

## First-read result

Cold-opening the live page on desktop gave a clear answer within the first
screen: it makes red/green status colours distinct; it is for people who
cannot rely on those colours while reading code reviews, charts, or status
screens; and the first action is **“Try it with sample data”**, with the
adjacent explanation “See a diff lens open with nothing saved.” The link opens
`/demo` in one click. This requirement passes.

## Release-blocking defect

### High — Lens Plus can be unlocked with an arbitrary local value

The paid feature is not gated on a valid Sociobot license on a direct
workspace navigation. In a fresh live Chromium context I set only
`localStorage['sb_license:color-signal-lens'] = 'definitely-invalid'` before
navigating to `/lens`. The **Lens Plus preset name** and **Save preset** UI
were present (`#preset-name` count: 1), while the outgoing request log
contained only the live page and same-origin assets: no
`/api/v1/products/color-signal-lens/verify` request was made.

This reproduces because `premiumPanel()` treats the existence of the local
string as entitlement, while `/lens` does not call `acceptLicense()` or
`verifyLicense()`. It violates the paid-unlock contract: verification must
occur on first unlock, an invalid license must lock paid features, and cached
validity—not a bare token—may support offline optimistic unlock. A user can
therefore obtain the paid named-preset feature without buying it.

Required repair: render paid controls only for a valid cached verdict (or a
short-lived optimistic state while an initial verification is in flight), run
verification on every route that can render Lens Plus, remove invalid tokens,
and add a tagged regression test for an invalid direct `/lens` entry. Retest
the real verification response and its failure path after repair.

## Claims gate — PASS

`.factory/claims.json` exists and contains 12 claims. From a clean `npm ci`
install, every declared command was run against the product demo entry point;
all passed. The full `CI=1 npm test` independently passed **6 unit tests and
19 Playwright tests**.

| Claim | Result |
| --- | --- |
| sample-lens | PASS |
| local-screenshots | PASS |
| reading-cues | PASS |
| demo-reset | PASS |
| screenshot-input | PASS |
| capture-consent | PASS |
| named-presets | PASS (only with a fixture marked valid) |
| lens-plus-price | PASS |
| installer-checksums | PASS |
| desktop-release | PASS |
| macos-installer-architecture | PASS |
| macos-shell-installer-architecture | PASS |

The passing named-presets fixture is not evidence of entitlement security: it
preloads both a token and a `valid: true` cache, and it does not exercise an
invalid direct workspace visit.

## Functional and quality checks — PASS except for the defect above

- Normal demo flow worked at 1440×900 and 390×844: label, pattern, and
  blue/orange remap all changed the observable reading cue. The demo displays
  `Demo — sample data, nothing is saved`, supports reset, and starts from the
  realistic diff sample.
- The shipped regression suite covers corrupt-image recovery, reloadable
  direct workspace links, screen-capture consent and selected-region flow,
  offline use after a loaded demo, mobile touch targets, keyboard skip/focus,
  and the release fallback. All 19 Playwright tests passed.
- Live Axe scans at desktop and 390px had **zero serious or critical**
  violations. Keyboard-only evidence from the suite passed: Tab reaches the
  skip link, Enter moves focus to `main`, and Enter on the canvas moves focus
  to the colour input. Reduced-motion coverage also passed in the suite.
- `/opt/fleet/lib/verify-url.sh` passed live root verification: HTTP 200,
  title, `lang=en`, exactly one h1, main landmark, no missing image alt text,
  no unlabeled buttons, and no console errors. Its live network-idle load
  measurement was 983 ms.
- `npm run check` passed. `npm run build` passed and created `dist/app` and
  `dist/site`; the site output is 24.36 KB JS (8.59 KB gzip) and 11.72 KB CSS
  (3.47 KB gzip), within budget.
- After installing standard Tauri Linux build prerequisites in the disposable
  environment, `cargo test --manifest-path src-tauri/Cargo.toml` passed and
  `CI=1 npm run tauri build -- --bundles deb,rpm` passed. It produced unsigned
  Linux packages: `Color Signal Lens_0.1.5_amd64.deb` (3,732,776 bytes) and
  `Color Signal Lens-0.1.5-1.x86_64.rpm` (3,735,134 bytes).

## Privacy, network, headers, and deployment identity — PASS

- A cold live landing load made same-origin document/asset/image requests plus
  the documented GitHub releases API request. It made no analytics or screen
  content request and logged no browser errors. Demo cue use at both tested
  viewport sizes made only same-origin requests.
- The live response has HSTS, `X-Content-Type-Options: nosniff`, strict origin
  referrer policy, and a restrictive CSP with only self plus the documented
  GitHub and Sociobot connect origins. Hashed JS uses
  `Cache-Control: public, max-age=31536000, immutable`; HTML uses a short
  30-second must-revalidate cache.
- `/`, `/demo`, `/lens`, `/privacy`, `/terms`, `/robots.txt`, `/sitemap.xml`,
  `/staticwebapp.config.json`, and `/404.html` returned HTTP 200. Unknown
  routes returned the SPA’s designed 404 state.
- Candidate/local production build matches deployment byte-for-byte:
  `index.html` SHA-256 `f3ecd7ec872177b81eb88cda934d85ba62c14840ae6ec0ecb57349e7643ba433`,
  JS SHA-256 `f064174d033a35cac16e0b36e36db048a1df901ac732b8d867477dc1affe953e`,
  CSS SHA-256 `49fdf5caeb5db6d1708877e5e183b9757a3e61c27c7f7bf97054403890c5ea4d`.
- Public GitHub release `v0.1.5` is public and contains macOS x64/aarch64,
  Windows EXE/MSI, Linux AppImage/DEB/RPM, `SHA256SUMS`, and `latest.json`.
  The downloaded AMD64 DEB verified `OK` against its published checksum.

No product-owned server endpoint is present to rate-limit. The only optional
server interaction is Sociobot checkout/license verification; its documented
rate allowance cannot be assessed here without a valid product license and is
not the source of the finding.

## Commands/evidence

```sh
npm ci
# every exact test command in .factory/claims.json
CI=1 npm test
npm run check
npm run build
cargo test --manifest-path src-tauri/Cargo.toml
VERIFY_NODE_MODULES=/work/repo/node_modules \
  /opt/fleet/lib/verify-url.sh https://color-signal-lens.sociobot.in/ /tmp/csl-verify
```

No product code was modified during this verification.
