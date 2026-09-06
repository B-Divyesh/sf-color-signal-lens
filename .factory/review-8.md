# Review 8 — Make screenshot status colors distinct

Date: 2026-09-06 UTC  
Live URL: <https://color-signal-lens.sociobot.in>  
Implementation reviewed: `afcd9aabd454f62a8900bb660aca5a505185491f` (`v0.1.12`)  
Documentation reviewed: `c506b05b6a64797dbc73ab1e7713611ad963cfd8`

## Verdict: FAIL

There are **2 findings**: 1 minor accessibility defect and 1 low documentation
defect. There are **0 untested claims**. All 27 declared claim commands passed,
but a successful test run is not a product PASS.

The live site and release still contain the implementation at `afcd9aa`. The
three later commits contain only reports, handoff text, and evidence.

## First screen before scrolling

Fresh 1440 × 900 and 390 × 844 browser contexts gave the same clear answers:

- **Job:** Make status colors distinct in screenshots.
- **Audience:** People who cannot rely on red and green in code reviews,
  charts, or status screens.
- **First action:** **Try it with sample data**. The next line says that it
  opens a sample screenshot with an overlay and saves nothing.

On the phone, the action ends at y=496 px, its result text ends at y=554 px,
and the three privacy, offline, and price facts end at y=667 px. All are
visible before scrolling.

## Findings

### Minor — F-8-1: The demo banner uses an invalid ARIA role

Fresh Axe 4.13 scans of live `/demo` at both 390 px and 1440 px report
`aria-allowed-role` on this element:

```html
<aside class="demo-banner" role="status">…buttons…</aside>
```

`status` is not an allowed role for `aside`, and the live region contains the
interactive **Reset demo** and **Start for real** buttons. This is the same
minor issue noted in `verification-4.md`; it was never removed. The current
test at `tests/accessibility.spec.ts:4` deliberately filters out minor Axe
results, so the full suite passes without detecting it.

Remove `role="status"` from the banner. If announcement is needed, put the
non-interactive status text in its own valid polite live region. Then make the
test fail on every Axe violation.

### Low — F-8-2: The clean Linux development instructions omit prerequisites

README lines 20–29 tell a contributor to run the native test but give no Node,
Rust, WebKit, GTK, or GLib prerequisites. After the documented `npm ci`, this
command failed in the clean worker:

```sh
cargo test --manifest-path src-tauri/Cargo.toml
```

The first failure was `glib-sys`: `glib-2.0.pc` was not installed. After
manually installing the normal Tauri Linux packages, the same command passed
both native tests and Clippy passed with warnings denied. The README also does
not give a command that starts the native Tauri shell; `npm run dev:desktop`
starts only Vite in desktop mode.

Document supported Node and Rust versions, the Linux Tauri packages, and the
native development command. Verify those instructions in a clean Linux
environment.

## Sample, normal, invalid, boundary, and recovery paths

The one-click sample is otherwise complete. It opens `/demo` with the
realistic checkout diff already transformed. The persistent banner says
**Demo — sample data, nothing is saved** and includes Reset demo and Start for
real.

In a fresh live phone context, I seeded a real license key, a real preset, and
an unrelated real key after the landing page loaded. I changed the demo cue,
reset the demo, and left through Start for real. All real values remained
byte-for-byte unchanged. Reset removed every `demo:color-signal-lens:*` key,
kept the banner visible, and restored the patterned sample. Start for real
removed the sample and opened the empty, reloadable `/lens` workspace.

The normal sample flow changed labels, patterns, and blue-orange colors.
`#000000` and `#FFFFFF` both applied. Clear overlay restored the no-cue state.
A corrupt PNG produced “Could not open broken.png. Choose a valid PNG, JPEG,
or WebP image” and kept the prior state. Tests also passed for unsupported
paste recovery, portrait-image color picking, denied capture, invalid and
revoked licenses, preset actions, and offline cue changes.

## Claims

From the clean checkout, `npm ci` installed 29 packages with zero reported
vulnerabilities. Every command in `.factory/claims.json` then ran separately
and exactly as written.

| Claim | Result |
| --- | --- |
| `sample-lens` | PASS |
| `demo-isolation` | PASS |
| `local-screenshots` | PASS |
| `reading-cues` | PASS |
| `demo-reset` | PASS |
| `screenshot-input` | PASS |
| `paste-input` | PASS |
| `portrait-color-pick` | PASS |
| `keyboard-color-input` | PASS |
| `capture-consent` | PASS |
| `clear-overlay` | PASS |
| `privacy-limits` | PASS |
| `named-presets` | PASS |
| `license-entitlement` | PASS |
| `lens-plus-price` | PASS |
| `merchant-of-record` | PASS |
| `refund-revocation` | PASS |
| `license-restore` | PASS |
| `desktop-paid-flow` | PASS |
| `sociobot-checkout-path` | PASS |
| `license-daily-cache` | PASS |
| `desktop-release` | PASS |
| `installer-checksums` | PASS |
| `desktop-download-platforms` | PASS |
| `macos-shell-installer-architecture` | PASS |
| `release-fallback` | PASS |
| `offline-reader` | PASS |

Landing and README statements still map to these 27 entries. I found no
unlisted product claim. Untested claim count: **0**.

## Local quality gates

- `CI=1 npm test`: PASS — 10 unit/contract tests and 58 Playwright tests.
- `npm run check`: PASS.
- `npm run build`: PASS — `dist/app` and `dist/site` produced.
- `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check`: PASS.
- Native test before manual package installation: FAIL — undocumented
  `glib-2.0` development prerequisite; finding F-8-2.
- Native test after installing Tauri Linux prerequisites: PASS — 2 tests.
- `cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings`:
  PASS.
- Site JavaScript: 33.64 KB raw / 11.24 KB gzip. CSS: 13.97 KB raw /
  3.92 KB gzip.

## Live structure, accessibility, privacy, and performance

`/`, `/demo`, `/lens`, `/privacy`, and `/terms` return 200. A deliberate
missing path returns HTTP 404 with the product header, footer, one h1, one main
landmark, route metadata, legal links, and Return home. Chromium's failed
main-document message on that deliberate 404 is expected and is not a defect.
Normal routes and flows had no console, page, or failed-request errors.

All checked routes have `lang=en`, one h1, one main landmark, complete image
alternatives, distinct titles, and no horizontal overflow at 390 px. The
factory URL verifier passed in 715 ms. Full Axe scans found no violation on
five normal routes and the designed 404; `/demo` has F-8-1. Keyboard checks
passed for the skip link, canvas-to-color-field handoff, file and capture
controls, cue radios, route focus, section focus, and Back restoration. The
focus treatment is a 3 px black outline with a 6 px white halo. Controls meet
44 px targets. At 200% zoom the phone workspace remains usable without
horizontal overflow. Reduced motion computes to 0.01 ms transitions and
animations.

The live demo itself makes only first-party requests. The landing page also
fetches the declared GitHub release API. File, paste, capture fixture, routes,
and scripts produced no screenshot upload, analytics, CDN script, or external
font request. Privacy and terms pages load and describe local screenshot
handling, on-demand screen permission, local license storage, the $12 price,
merchant, refunds, and limits. No updater is promised or configured. The
installed-app offline claim passed in its isolated browser context.

Fresh mobile Lighthouse scores were 100 performance, 100 accessibility, 100
best practices, and 100 SEO. LCP was 1,209 ms, TBT was 0 ms, and CLS was 0.
Lighthouse audits the landing page and therefore does not cancel the separate
demo ARIA finding.

Response headers include HSTS, `nosniff`, strict-origin referrer policy, and a
restrictive CSP with `frame-ancestors 'none'`. Hashed assets have one-year
immutable caching. The site has no product backend, account tenant, server
state, or restart-persistence promise. The product-specific license endpoint
returned 429 on request 31 with `Retry-After: 3`; the observed allowance is 30
requests per window.

## Desktop release

Public release `v0.1.12` is not a draft or prerelease. Its `latest.json`
records implementation commit `afcd9aabd454f62a8900bb660aca5a505185491f`.
It contains Intel and Apple-Silicon macOS builds, Windows EXE and MSI, Linux
AppImage, DEB and RPM, `SHA256SUMS`, and `latest.json`.

The live Linux installer downloaded the AppImage into an isolated temporary
consumer directory, verified SHA-256
`c5aef9fcd99094ba99e298483cf52db7e729ca2dba89a3868e25bd4653030c0c`,
and left an executable `color-signal-lens`. The installed app stayed running
under Xvfb for 12 seconds; only expected headless DRI3 software-rendering
warnings appeared. The checkout action returns 303 to the hosted payment page.

Fresh build and live deployment hashes are identical:

| Resource | SHA-256 |
| --- | --- |
| `index.html` | `1d93e9cca0a4772305a04253b0ec4786efa61a38857ac8ca6a71a6e0cd0ebc73` |
| `index-BF2K8dES.js` | `2c7f5f1a77df8933481a7f96d3f08b990f0241e17a95fe3b0adbaee5b7bf903f` |
| `style-BWgV3-lU.css` | `853729eb2ca10ede0899cbd72862b3aa3f7efe08b64c44f62773a2c62b7e5bd5` |

## Earlier finding disposition

I read every earlier review, verification, polish, and handoff report. This
table groups repeated reports of the same defect and records fresh evidence.

| Earlier finding | Current disposition |
| --- | --- |
| Missing, incomplete, or stale desktop releases; missing Windows, checksums, or manifest | Fixed. `v0.1.12` is complete, public, checksummed, installable, and tied to `afcd9aa`. |
| Wrong Intel Mac download in the page or shell installer | Fixed. Both architectures are published; platform and shell claim tests pass. |
| Installer verified then deleted its AppImage | Fixed. The hosted installer leaves an executable whose checksum matches. |
| Whole-screen capture, wrong scaled pixel, and portrait letterboxing errors | Fixed. Selected-region, transformed-pixel, and portrait tests pass. |
| Broken `/lens`, soft 404, landing console error, short asset caching | Fixed live. Deep links work, missing paths return 404, normal routes are clean, and hashed assets are immutable. |
| Corrupt image, unsupported paste, capture error, and Clear overlay recovery | Fixed. Each recovery path passed with actionable text and preserved state. |
| Keyboard file input, focus, touch targets, horizontal overflow, and dead How it works link | Fixed in fresh phone and desktop checks. |
| Bare-token paid unlock, dead checkout, unusable presets, missing merchant/refund terms | Fixed. Entitlement, purchase, preset, contract, and revocation tests pass; checkout redirects live. |
| Desktop license CORS failure, narrow restore field, and missing desktop How it works target | Fixed by the native bridge and layout/route repairs; desktop tests pass. |
| Demo storage leak, hidden phone result, incomplete sample assertions, and leftover demo-start key | Fixed. Live seeded real storage is unchanged and reset leaves no demo key. |
| Missing or tautological claims, stale copy audit, unclear and inconsistent copy | Fixed. All 27 tagged tests and copy-audit integrity checks pass; no unlisted product claim was found. |
| Missing walkthrough, route metadata, discovery files, legal pages, and designed 404 | Fixed and present live. |
| Minor `aria-allowed-role` noted in verification 4 | **Open as F-8-1.** Fresh full Axe scans reproduce it on both viewports. |

All review findings `F-1-1` through `F-6-1` remain fixed except that the
separately noted verification-4 ARIA issue was never part of those numbered
review tables and remains open. F-8-2 is new.

## Evidence

Fresh screenshots, the route audit, factory verifier output, and Lighthouse
JSON are in `.factory/evidence/review-8/`.
