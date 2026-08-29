# Independent verification 12 — PASS

**Candidate:** `423d5e930a5f0def6b204964d2f40c45bc5be502`  
**Live URL:** <https://color-signal-lens.sociobot.in>  
**Verified:** 2026-08-29 UTC  
**Verdict:** **PASS — releasable.**

## Mandatory first-read and demo gate

In a cold 1440×900 browser, the first screen says **“Make status colors
distinct.”** It identifies the audience as people who cannot rely on red and
green in code reviews, charts, or status screens. The clear first action is
**Try it with sample data**, and the adjacent copy says it opens a sample
screenshot with an overlay and saves nothing. Activating it with Enter opened
`/demo` in one click, already showing the transformed checkout diff and the
persistent **Demo — sample data, nothing is saved** banner with Reset demo and
Start for real. The same complete first-read path is visible at 390×844. This
passes the mandatory plain-words and one-click-demo gate.

## Claims gate

The checkout was clean at the candidate commit. `.factory/claims.json` exists
and contains 27 claims. After `npm ci` (29 packages, zero vulnerabilities), I
ran every listed `test` command separately and exactly as recorded. The result
was 27 passes and zero failures.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `sample-lens` | PASS | One-click sample opened with a transformed pixel and no real-storage change. |
| `demo-isolation` | PASS | Seeded real license/preset keys stayed byte-for-byte unchanged. |
| `local-screenshots` | PASS | File, paste, capture fixture, route, request, and script-origin assertions passed. |
| `reading-cues` | PASS | Labels, patterns, and blue-orange remapping passed at 1440px and 390px. |
| `demo-reset` | PASS | Reset removed every demo-prefixed key and preserved real settings. |
| `screenshot-input` | PASS | Bundled PNG opened in a fresh workspace. |
| `paste-input` | PASS | Recovery from unsupported clipboard data and image paste passed. |
| `portrait-color-pick` | PASS | A visible portrait-image pixel was selected at desktop and mobile widths. |
| `keyboard-color-input` | PASS | Keyboard color entry and application passed. |
| `capture-consent` | PASS | No capture before the action; only the selected fixture region was retained. |
| `clear-overlay` | PASS | The original RGB pixel was restored. |
| `privacy-limits` | PASS | Source data stayed unchanged and capture was not requested early. |
| `named-presets` | PASS | Save, list, apply, rename, and delete passed with an active fixture license. |
| `license-entitlement` | PASS | Invalid entitlement removed the token and kept controls locked. |
| `lens-plus-price` | PASS | UI and recorded checkout contract both report USD 12.00 once. |
| `merchant-of-record` | PASS | UI, README, and contract fixture agree on Sociobot/Dodo and refunds. |
| `refund-revocation` | PASS | Revoked fixture removed the token and paid controls. |
| `license-restore` | PASS | Pasted fixture license was stored and verified. |
| `desktop-paid-flow` | PASS | Built desktop artifact exposes Buy/Restore and its native verification bridge. |
| `sociobot-checkout-path` | PASS | Purchase link uses the registered Sociobot controller path. |
| `license-daily-cache` | PASS | Fresh cached verdict caused no verification request. |
| `desktop-release` | PASS | Workflow platform/manifest/publication gates passed. |
| `installer-checksums` | PASS | Installer fixture verified SHA-256 and produced an executable AppImage. |
| `desktop-download-platforms` | PASS | Desktop and mobile user-agent states passed. |
| `macos-shell-installer-architecture` | PASS | x64 and aarch64 DMG selection passed. |
| `release-fallback` | PASS | Blocked GitHub metadata retained the direct Releases link. |
| `offline-reader` | PASS | Loaded sample continued changing reading cues offline. |

Landing-page and README claim-like statements map to these entries; I found no
unlisted claim.

## Clean local gates

- `npm test`: PASS — 10 unit/contract tests and 58 Playwright tests.
- `npm run check`: PASS.
- `npm run build`: PASS — produced `dist/app` and `dist/site`.
- `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check`: PASS.
- `cargo test --manifest-path src-tauri/Cargo.toml`: PASS — two native tests.
- `cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings`: PASS.
- Site bundle: 33,642-byte raw / 11,201-byte gzip JS; 13,965-byte raw /
  3,920-byte gzip CSS; 50,718-byte hero WebP. All are within contract budgets.

The clean container initially lacked the standard Linux Tauri development
headers. After installing GTK/WebKit/GLib prerequisites, native tests and
Clippy passed. That is runner setup, not a product failure.

## End-to-end, accessibility, privacy, and resilience

The shipped sample demonstrated the smallest useful flow: select the supplied
status screenshot, pick its status color, switch among label/pattern/
blue-orange cues, and clear the overlay. Boundary color values `#000000` and
`#FFFFFF` applied successfully. A corrupt `broken.png` produced the actionable
message “Could not open broken.png. Choose a valid PNG, JPEG, or WebP image”
and preserved the prior empty state. Automated recovery tests also passed for
unsupported paste data, denied/failed capture, and invalid licenses.

Fresh live checks covered `/`, `/demo`, `/lens`, `/privacy`, `/terms`, and an
unknown route at 1440×900 and 390×844. Known routes returned 200 and the
unknown route returned the designed 404. Every page had the correct title,
`lang=en`, exactly one h1 and main landmark, complete image alternatives, no
horizontal overflow, and no serious or critical axe findings. Expected browser
logging of the deliberately requested 404 was the only 404-route console item;
all normal routes and flows had zero console, page, or failed-request errors.
The factory `verify-url.sh` passed in 977 ms with zero errors.

Keyboard tests passed for the skip link, canvas-to-color-field handoff, capture
control order, CTA activation, and route focus restoration. The live CTA focus
ring computed to a 3px black outline plus a 6px white halo. Controls met 44px
targets. At 200% zoom the mobile demo retained its h1 and controls without
horizontal overflow. Reduced motion computed to `0.00001s` for animation and
transition duration.

A fresh direct `/demo` made only first-party HTML/JS/CSS requests. A separate
live `/lens` flow opened a private PNG and pasted another image; its request log
contained only first-party resources and same-origin blob URLs. All scripts
were first-party. The landing page's sole external fetch was the declared
GitHub Releases API. There were no screenshot uploads, analytics, CDN scripts,
or external fonts.

Live response headers include HSTS, `nosniff`, strict-origin referrer policy,
and a restrictive CSP with `frame-ancestors 'none'`. HTML uses 30-second
revalidation; hashed assets use one-year immutable caching. The direct 404 has
HTTP 404 rather than a soft-404 response.

Fresh mobile Lighthouse scores were **99 performance, 100 accessibility, 100
best practices, and 100 SEO**. LCP was 2,064 ms, TBT 61 ms, and CLS 0.

## Deployment, desktop release, and server allowance

A fresh candidate build and the live deployment are byte-identical:

| Resource | SHA-256 |
| --- | --- |
| `index.html` | `1d93e9cca0a4772305a04253b0ec4786efa61a38857ac8ca6a71a6e0cd0ebc73` |
| `index-BF2K8dES.js` | `2c7f5f1a77df8933481a7f96d3f08b990f0241e17a95fe3b0adbaee5b7bf903f` |
| `style-BWgV3-lU.css` | `853729eb2ca10ede0899cbd72862b3aa3f7efe08b64c44f62773a2c62b7e5bd5` |

The current public release is v0.1.12 at product commit
`afcd9aabd454f62a8900bb660aca5a505185491f`. The candidate's only later changes
are factory evidence and handoff documents, so both the live site and desktop
release contain the candidate product code. The release includes macOS arm64
and x64, Windows EXE and MSI, Linux AppImage/DEB/RPM, `SHA256SUMS`, and valid
`latest.json`.

The downloaded amd64 DEB matched the published checksum
`c484759c98a84e179cd060afe71a3c42124bab05ddb373082e3eb98eeb31049e` and
reported package `color-signal-lens`, version `0.1.12`, architecture `amd64`.
The live one-line Linux installer independently downloaded the AppImage,
verified its published checksum, installed it executable in an isolated temp
directory, and printed the unsigned-build notice. Both the DEB binary and that
AppImage stayed running for 12 seconds under Xvfb; only expected headless DRI3
software-rendering warnings appeared.

The live platform picker resolved Linux and Windows to real v0.1.12 assets,
offered both Intel and Apple-Silicon Mac downloads, and sent iPhone visitors to
the Releases page rather than offering a mobile binary. Internal links returned
200, the release asset redirected to a valid download, and the registered Buy
link returned 303 to hosted Dodo checkout.

The only product server endpoint is the Sociobot license/checkout integration.
From one client, license-verification requests 1–30 returned 200; request 31
returned **429** with **`Retry-After: 3`**. Observed allowance: 30 requests per
window. No sign-in, service worker/PWA, product backend, or AI feature applies.

## Defects

No release-blocking, high, medium, or low product defects were found. macOS and
Windows builds remain intentionally unsigned and say so; signing is an operator
consideration, not a candidate regression.

Evidence is in `.factory/evidence/verification-12/`, including the live audit,
factory verifier output, Lighthouse JSON, release metadata, and desktop/mobile
screenshots.
