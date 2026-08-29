# Independent verification 10 — PASS

**Candidate:** `e7ca1311f2dafd6e16f87c55e02a60c6809c0a8d`  
**Live URL:** https://color-signal-lens.sociobot.in  
**Release:** `v0.1.10` (`18c99915af10fcc93735b8db6a3ccbf0b76eccd6`)  
**Verified:** 2026-08-29 UTC  
**Verdict:** **PASS — candidate is releasable.**

`e7ca131` is a documentation-only child of the v0.1.10 tag: its sole product-tree
difference is `.factory/handoff.md`. The deployed website's `index.html`, hashed JS,
and hashed CSS match a fresh build of this candidate byte-for-byte, so the live
product is the candidate's product code. The tagged desktop binary is built from its
direct parent, which contains the same product code.

## Mandatory first-read and demo gate — PASS

In a new cold browser context, the first screen says **“Make status colors distinct.”**
It names people who cannot rely on red and green in code reviews, charts, or status
screens, and its leading action is **“Try it with sample data”**, accompanied by what
will happen: a sample screenshot with an overlay and no saved data. One click opened
`/demo`, a transformed checkout screenshot, and the persistent **“Demo — sample data,
nothing is saved”** banner with Reset demo and Start for real.

## Claims gate — PASS

After clean `npm ci` (29 packages, 0 vulnerabilities), I executed every exact command
in `.factory/claims.json` independently, using the declared demo/browser sandbox.
All 25 passed; Playwright's final `.last-run.json` is `{"status":"passed","failedTests":[]}`.

This includes sample loading and namespace isolation, local screenshot handling and
outgoing-request privacy, all three reading cues, device/paste/capture input,
portrait picking, keyboard colour input, overlay clearing, paid entitlement/restore
fixtures, checkout/price, daily cache, release assets/installers, platform downloads,
release fallback, and offline reader behavior.

## Clean-checkout quality gates — PASS

- `npm test`: PASS — 7 unit tests and 56 Playwright tests.
- `npm run check`: PASS.
- `npm run build`: PASS — `dist/app` and `dist/site` produced.
- `cargo test --manifest-path src-tauri/Cargo.toml`: PASS — 2 native tests,
  including real production native license verification, plus empty main/doc targets.
- `npm run tauri -- build`: production Tauri build was exercised locally after
  installing the normal Linux Tauri prerequisites; it compiled the release binary
  and generated Linux DEB/RPM bundle outputs. The public GitHub Actions v0.1.10
  release additionally supplies the checked AppImage and all other platform files.

The first Rust invocation could not start in the clean base image because its standard
Tauri system dependency `glib-2.0` was missing. After installing the standard Linux
Tauri development packages, the same untouched checkout compiled and all Rust tests
passed. This was verifier-environment setup, not a product defect.

The built site budget is 33,672 bytes raw / 11,170 bytes gzip JS and 13,965 bytes raw
/ 3,918 bytes gzip CSS; both are under the static-product budgets.

## Live behavior, accessibility, and privacy — PASS

Fresh live checks at 1440×900 and 390×844 covered `/`, `/demo`, `/lens`, `/privacy`,
`/terms`, and an unknown route. Every normal route returned 200; the unknown route
returned a real 404. Each route had one h1 and one main landmark, the expected
route-specific title, no horizontal overflow, and no axe serious or critical finding.

The live demo successfully selected a status colour, remapped a known green pixel to
blue (`7,90,134`), accepted boundary `#000000` and `#FFFFFF` values, and restored the
original pixel (`22,113,74`) after Clear overlay. A fresh ten-run clear-overlay probe
passed all ten times. Keyboard-only checks reached the skip link, main, canvas, colour
field, controls, file picker, capture action, and legal links without a trap; keyboard
focus had the designed 3 px black ring and white halo. At 390 px, reduced motion
reduced animations/transitions to `0.00001s`; no overflow occurred.

`/opt/fleet/lib/verify-url.sh` passed against the live root: HTTP 200, no page or
console errors, title, `lang=en`, one h1, main, and complete image alt text. The live
request log for the normal screenshot/demo flow contained only the product origin and
the documented GitHub release lookup; there were no screenshot uploads, analytics,
third-party scripts, or third-party fonts. Browser headers include HSTS, nosniff,
strict-origin referrer policy, and a restrictive CSP. HTML uses 30-second
must-revalidate caching; hashed assets use one-year immutable caching.

Mobile Lighthouse on the live landing page scored **100 performance, 100 accessibility,
100 best practices, 100 SEO** (LCP 1.3 s, TBT 70 ms, CLS 0).

## Server allowance and release evidence — PASS

There is no sign-in and no service worker/PWA or separate product backend. The paid
license verification endpoint is rate-limited: from one client, requests 1–30 returned
200 and request 31 returned **429** with `Retry-After: 4`. Observed allowance: **30
requests per window**.

The live HTML, `assets/index-275Slz2Q.js`, and `assets/style-BWgV3-lU.css` each had
the same SHA-256 as the fresh candidate build. GitHub's public v0.1.10 release has
macOS arm64/x64, Windows EXE/MSI, Linux AppImage/DEB/RPM, `SHA256SUMS`, and
`latest.json`. The downloaded `Color.Signal.Lens_0.1.10_amd64.deb` verified against
the published checksum and identifies itself as package `color-signal-lens`, version
0.1.10, architecture amd64. The downloaded AppImage also verified and stayed running
for a 12-second Xvfb smoke launch; only software-rendering DRI3 warnings appeared.

## Findings

No release-blocking, high, medium, or low product defects were found in this candidate.
The macOS and Windows release files remain unsigned, as documented in the existing
handoff; that is known operator work rather than a regression in this candidate.
