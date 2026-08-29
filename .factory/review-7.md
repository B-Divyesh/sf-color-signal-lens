# Adversarial first-read review 7 — Color Signal Lens

Date: 2026-08-29  
Live site: <https://color-signal-lens.sociobot.in>  
Candidate: `4c42eef4f76cb42ba462ac999ac3223916c0f162`

## Verdict: PASS

There are zero findings. The product is clear and tryable from a cold 390 px
phone visit, and the deployed JavaScript and CSS SHA-256 values exactly match
the fresh candidate build. All 27 listed claim commands passed independently
from a fresh clone. `npm test`, `npm run check`, and `npm run build` also
passed.

## Cold first read (before scrolling)

### 390 × 844

- **What it does:** Makes red/green status colors in screenshots distinct with
  labels, patterns, or blue-orange colors.
- **For whom:** People reading code reviews, charts, or status screens who
  cannot rely on red and green.
- **What to click first:** **Try it with sample data**. The adjacent result
  copy says: “See a sample screenshot with an overlay. Nothing is saved.”

All three answers are visible in the first viewport. The primary action bounds
were 448–496 px and its result copy was 510–554 px. Desktop at 1440 × 900
communicates the same information without scrolling. The 390 px first screen
uses a product-specific paper-cut desk visual, rather than a generic SaaS
template.

## Copy audit

The following is the requested landing-page and README sentence inventory.
Counts use whitespace-delimited words. No sentence exceeds 22 words; no
plain-words banned adjective, unexplained metaphor, inconsistent core term, or
non-result-naming button was found. Section headings name their sections.

### Landing page

| Sentence | Words | Result |
| --- | ---: | --- |
| Make status colors distinct. | 4 | Pass |
| For people who cannot rely on red and green during code reviews, charts, or status screens. | 16 | Pass |
| See a sample screenshot with an overlay. | 7 | Pass |
| Nothing is saved. | 3 | Pass |
| Screenshots are not uploaded. | 4 | Listed: `local-screenshots` |
| Free reader works offline after install. | 6 | Listed: `offline-reader` |
| Lens Plus: $12 once. | 4 | Listed: `lens-plus-price` |
| Preview the screenshot changes. | 4 | Pass |
| Open a screenshot, choose a status color, then add a label, pattern, or blue-orange colors. | 15 | Listed: input and `reading-cues` claims |
| Open a file, paste an image, or capture a screen region when you choose. | 14 | Listed: `screenshot-input`, `paste-input`, `capture-consent` |
| Click the color that is hard to tell apart. | 9 | Pass |
| Add a label, a pattern, or blue-orange colors over that status color. | 12 | Listed: `reading-cues` |
| It changes neither the screenshot nor your display. | 8 | Listed: `privacy-limits` |
| It processes only the image you open. | 7 | Listed: `local-screenshots` |
| It does not filter your whole display. | 7 | Listed: `privacy-limits` |
| Save named presets for $12 once. | 6 | Listed: `lens-plus-price`, `named-presets` |
| The free app includes screenshot reading, labels, patterns, and blue-orange colors. | 10 | Listed: `reading-cues` |
| Lens Plus saves named presets. | 6 | Listed: `named-presets` |
| Sociobot/Dodo is the merchant of record. | 6 | Listed: `merchant-of-record` |
| It processes the payment and handles refunds. | 7 | Listed: `merchant-of-record` |
| A refund removes access to saved presets. | 7 | Listed: `refund-revocation` |
| Install Color Signal Lens. | 4 | Pass |
| Choose a download from the Releases page. | 7 | Listed: `release-fallback` |
| Color Signal Lens makes screenshot status colors easier to read. | 10 | Pass |

Headings and actions checked: **Private desktop utility**, **Screenshot
preview**, **How Color Signal Lens works**, **Privacy and limits**, **Lens
Plus**, **Desktop app**; **Try it with sample data**, **Open the sample
screenshot**, **Read privacy details**, **Buy Lens Plus**, **Restore license**,
and **Open release downloads**. They are concrete labels or result-naming
actions.

### README

| Sentence | Words | Result |
| --- | ---: | --- |
| Make screenshot status colors distinct. | 5 | Pass |
| It is for people who cannot rely on red and green in software diffs, charts, or status panels. | 18 | Pass |
| Try the sample at https://color-signal-lens.sociobot.in/demo. | 5 | Pass |
| It opens a checkout diff with added and removed totals. | 10 | Listed: `sample-lens` |
| Demo changes stay separate and never change your settings. | 9 | Listed: `demo-isolation` |
| Open a screenshot, paste an image, or capture a screen region. | 11 | Listed: input claims |
| Click a status color, or set a color with the keyboard color field. | 13 | Listed: `keyboard-color-input` |
| Add a label, a pattern, or blue-orange colors. | 8 | Listed: `reading-cues` |
| Clear overlay restores the original screenshot. | 6 | Listed: `clear-overlay` |
| Screen capture is requested only after you press Capture screen region. | 11 | Listed: `capture-consent` |
| Only the region you select is added. | 7 | Listed: `capture-consent` |
| Screenshot data stays in the app. | 6 | Listed: `local-screenshots` |
| The static deploy root is `dist/site`. | 6 | Pass; developer documentation |
| The Tauri 2 configuration is in `src-tauri/`. | 7 | Pass; developer documentation |
| Tags trigger `.github/workflows/release.yml`, which checks for macOS, Windows, Linux, `SHA256SUMS`, and `latest.json` assets before publishing a release. | 17 | Listed: `desktop-release` |
| The Linux script verifies SHA-256 and installs the AppImage as `~/.local/bin/color-signal-lens`. | 11 | Listed: `installer-checksums` |
| If GitHub metadata cannot be reached, the landing page links to the Releases page. | 14 | Listed: `release-fallback` |
| The free app includes all reading controls. | 7 | Listed: `reading-cues` |
| Lens Plus costs $12 as a one-time purchase and saves named presets on this device. | 15 | Listed: `lens-plus-price`, `named-presets` |
| Buy Lens Plus opens Sociobot's payment page. | 7 | Listed: `sociobot-checkout-path` |
| Buy and restore a license inside the desktop app or on the landing page. | 14 | Listed: `desktop-paid-flow`, `license-restore` |
| Sociobot/Dodo is the merchant of record. | 6 | Listed: `merchant-of-record` |
| It processes the payment and handles refunds. | 7 | Listed: `merchant-of-record` |
| A refund removes access to saved presets. | 7 | Listed: `refund-revocation` |
| The free screenshot reader works offline after the installed desktop app has loaded. | 13 | Listed: `offline-reader` |
| The browser sample is for trying the app before installation. | 10 | Pass |
| Read https://color-signal-lens.sociobot.in/privacy for screenshot processing, local storage, and screen permission details. | 11 | Pass; route instruction |
| Read https://color-signal-lens.sociobot.in/terms for product limits and purchase terms. | 8 | Pass; route instruction |
| The app has no analytics and loads no code from other websites. | 12 | Listed: `local-screenshots` |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

README headings (**Use Color Signal Lens**, **Develop**, **Install and
releases**, **Lens Plus**, **Privacy and terms**, **License**) are descriptive.
The version-controlled `.factory/copy-audit.md` also passed its count and
README-completeness tests.

## Demo and sandbox

The landing CTA took one click to `/demo`. At 390 px, the persistent
“Demo — sample data, nothing is saved” banner, active pattern cue, and the
transformed sample canvas (421–619 px) were all visible before scroll.
**Reset demo** restored the shipped sample and **Start for real** opened the
empty real workspace.

In a fresh live browser context, the non-demo storage snapshot before the CTA,
after changing a cue in demo, after reset, and after exit was unchanged. Demo
did not create any non-demo key. The only storage observed was the pre-existing
landing release cache; this was present before demo entry and did not change in
demo. The declared isolation and reset tests additionally seed real license,
preset, and future `demo:` keys and passed.

The request log contained the product origin plus `api.github.com` for the
optional release lookup. It contained no screenshot upload or analytics request.
The local-screenshot claim test exercises file, paste, selected-region capture,
all public routes, and script origins; it passed. No AI feature is implied by
the brief, so no AI addition is expected.

## Claims and clean-clone verification

Fresh clone: `/tmp/color-signal-lens-review7.YgXdFn` at the candidate commit;
`npm ci` reported zero vulnerabilities. Every command named by all 27 entries
in `.factory/claims.json` exited 0, including demo isolation/reset, privacy,
every reader input/cue, paid entitlement/refund, desktop release/installers,
platform selection, fallback, and offline reader. The three unit-command
claims each reported 10 passing subtests; the remaining browser commands each
reported one passing tagged test.

Additional clean-clone checks:

- `npm test`: 10 unit tests and 58 Playwright tests passed.
- `npm run check`: passed.
- `npm run build`: passed; site JS is 11.24 KB gzip.

Live/current-build SHA-256 comparison:

| Asset | Result |
| --- | --- |
| `index-BF2K8dES.js` | identical (`2c7f5f…bf903f`) |
| `style-BWgV3-lU.css` | identical (`853729…e5bd5`) |

## Structure, routing, and links

`/`, `/demo`, `/lens`, `/privacy`, and `/terms` returned 200. A deliberately
missing URL returned a real 404 with the shared header, footer, legal links,
plain recovery action, metadata, and one `<h1>`. Each route has exactly one
`<main>` and `<h1>`, its specified title, description, canonical, OG/Twitter
image, and no horizontal overflow at 390 px. The 404 main document naturally
produces Chromium's expected “Failed to load resource: 404” console entry; no
normal route produced a console error.

Keyboard activation of **How it works** moved to `/#how`, put the target at
0.05 px, focused **How Color Signal Lens works**, and updated the polite
announcement. Back returned to `/` and focused the landing `<h1>`. Every
crawled product and external action link returned 200 after redirects; phone
iPhone and Android user agents correctly showed “Downloads require macOS,
Windows, or Linux” and **Open desktop downloads**, not an incompatible binary.

`robots.txt`, `sitemap.xml`, favicon, apple-touch icon, social card, and CSP
are present. The CSP permits only the actual product and declared GitHub/
Sociobot connections, and sends `frame-ancestors` as a response header.

## History confirmation

Every earlier report and polish/handoff was reviewed. The following table
records a fresh live-and-code confirmation for each historical finding, rather
than accepting a prior “fixed” label.

| Earlier id | Fresh confirmation |
| --- | --- |
| F-1-1 | Landing CTA/direct demo remains route-derived, hides paid controls, uses isolated demo storage, and preserves real storage through reset/exit. |
| F-1-2 | Phone demo shows banner, cue, and transformed canvas before scroll. |
| F-1-3 / F-3-1 | Hash navigation, destination focus, announcement, and Back focus work live. |
| F-1-4 / F-2-1 / F-4-1 | The sample claim starts from the CTA and passed delayed-response and non-demo-storage assertions. |
| F-1-5 | Privacy test covers routes, file, paste, capture, request, and script origins. |
| F-1-6 | Live Android/iPhone state gives desktop requirements; desktop-platform claim passed. |
| F-1-7 / F-5-1 | Price, merchant, refund, entitlement, and checkout claims have fixtures plus behavioural tests, all passing. |
| F-1-8 | Landing limits copy is concrete and the privacy-limit claim passed. |
| F-1-9 | Current visitor copy uses the audited status-color/overlay/preset terminology. |
| F-1-10 | Restore/download controls name their results. |
| F-1-11 | Paste and keyboard color entry each have a passing observable claim. |
| F-1-12 | The landing retains three captioned original workflow frames; provenance is in `design.md`. |
| F-1-13 | Live per-route metadata, discovery, landmarks, social card, and legal links passed. |
| F-1-14 | Live host 404 is styled, plain, complete, and returns HTTP 404. |
| F-1-15 | README and release-fallback wording remain concrete. |
| F-2-2 | Privacy, offline, and exact price facts are in the first phone screen and listed claims passed. |
| F-2-3 | README links directly to `/demo` and describes the checkout-diff sample and separation. |
| F-2-4 / F-5-2 | Copy-audit count, completeness, and claim-tag tests passed against current files. |
| F-4-2 | Fallback wording names the Releases-page next step without asserting availability. |
| F-5-3 | README says “payment page,” not “checkout path.” |
| F-5-4 | Privacy wording says “loads no code from other websites”; request/script audit passed. |
| F-5-5 | README heading is “Use Color Signal Lens.” |
| F-6-1 | Reset removes current and future demo-prefixed keys while leaving real keys unchanged. |

## What would make this perfect

No product change is required for this review. Keep the claim fixtures,
one-click sample flow, route tests, and copy-audit completeness checks current
when changing copy, payment terms, installer behavior, or storage.
