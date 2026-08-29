# Adversarial first-read review 5 — Color Signal Lens

Date: 2026-08-29

Live site: <https://color-signal-lens.sociobot.in>

Reviewed commit: `aa8437fc43f20e2a265a58b207671f808720199d`

Viewports: 390×844 with an iPhone user agent, and 1440×900

## Verdict: FAIL

The cold first screen, demo, sandbox, core workflow, routing, accessibility,
visual identity, and all 25 declared claim commands pass. The paid copy has
regressed, however: the landing page and README now make merchant and automatic
refund-revocation promises that have no entries in `.factory/claims.json` and no
behavioral tests. This reopens earlier finding F-1-7 and is blocking under the
claims contract.

There are five findings: two blocking and three low-severity copy findings. A
PASS requires zero findings and no untested claim.

## 1. Cold first read before scrolling

### 390×844 phone

- **What it does:** makes red and green status colors in screenshots easier to
  tell apart.
- **For whom:** people reading code reviews, charts, or status screens who
  cannot rely on red and green.
- **What to click first:** **Try it with sample data**. The adjacent text says a
  sample screenshot with an overlay opens and nothing is saved.

The exact first-screen copy is “Make status colors distinct.”, “For people who
cannot rely on red and green during code reviews, charts, or status screens.”,
“Try it with sample data”, and “See a sample screenshot with an overlay. Nothing
is saved.” All three answers, plus the privacy/offline/price facts, are visible
before y=667 in the 844px viewport.

### 1440×900 desktop

The same three answers and three facts are visible without scrolling. No
first-screen clarity blocker was found.

## 2. Findings

### Blocking

#### F-5-1 / F-1-7 reopened — merchant and refund promises are unlisted and unproved

- **Exact quotes/locations:** landing Lens Plus section and `/terms`:
  “Sociobot/Dodo is the merchant of record. Refunds are handled by
  Sociobot/Dodo. A refund revokes the license automatically.” README Lens Plus:
  “Sociobot/Dodo is the merchant of record. Refunds are handled by
  Sociobot/Dodo, and a refund revokes the license automatically.” The desktop
  workspace repeats the same promises.
- **Claim inventory:** `.factory/claims.json` has a `lens-plus-price` entry for
  the $12 one-time price and a `sociobot-checkout-path` entry for the purchase
  URL. It has no merchant-of-record, refund-handler, or refund-revocation claim.
- **Test gap:** `@claim:lens-plus-price` checks a recorded fixture containing
  only product, amount, currency, and billing mode. It then asserts that the
  merchant/refund sentences are printed. The fixture has no merchant or refund
  fields, and no test changes a fixture purchase to refunded and observes the
  license becoming invalid.
- **Why this blocks:** these statements affect a purchase and access after a
  refund. A visitor can rely on them, but the sandbox cannot prove them. This is
  the same defect described by F-1-7 in review 1, reintroduced after the claim
  was previously removed.
- **Concrete fix:** add separate `merchant-of-record` and `refund-revocation`
  entries to `.factory/claims.json`. Record authoritative checkout/refund
  fixtures with merchant and entitlement fields. Test that the checkout names
  the merchant and that a refunded fixture makes the license verification
  invalid and locks presets. If those contracts cannot be observed, delete the
  sentences. Replace the legal jargon with “Sociobot/Dodo processes the payment
  and handles refunds” only if that exact statement is tested.

#### F-5-2 / F-2-4 reopened — the repository copy audit is inaccurate and stale

- **Exact location:** `.factory/copy-audit.md` lines 12, 14, 15, 76, 93, 97,
  101, 107, 109, 122, 126, 132–134, 138, 148–149, 153–154, 159, and 173–174.
- **Exact examples:** “Demo — Color Signal Lens” is recorded as 4 words but
  has 5; “See the sample status colors.” is recorded as 6 but has 5; and “The
  free screenshot reader works offline after the installed desktop app has
  loaded.” is recorded as 12 but has 13.
- **Completeness gap:** the current README sentence “Buy and restore a license
  inside the desktop app or on the landing page.” is absent. The audit instead
  retains obsolete copy, “Restore a purchase by pasting its license on the
  landing page.” It also omits README headings such as “Use it”.
- **Why this blocks:** the audit says counts split on spaces and that it is the
  required proof of copy simplicity. Its counts do not follow its stated rule,
  so it cannot be trusted to detect a 22-word cap regression. Review 2 reported
  the same class of bad-count defect as F-2-4; it has regressed.
- **Concrete fix:** regenerate every count mechanically from the current copy,
  split on whitespace as documented, and add a test that parses every audit
  row and compares the recorded number to the computed count.

### Low

#### F-5-3 — README uses the unexplained phrase “checkout path”

- **Exact quote/location:** README, Lens Plus: “The purchase action uses the
  Sociobot checkout path.”
- **Why this fails:** “checkout path” is implementation jargon and does not tell
  a reader what happens after buying.
- **Concrete fix:** “Buy Lens Plus opens Sociobot’s payment page.” Keep the
  existing `sociobot-checkout-path` test against the registered URL.

#### F-5-4 — README describes privacy with developer jargon

- **Exact quote/location:** README, Privacy and terms: “The app has no analytics
  and loads no third-party runtime scripts.”
- **Why this fails:** “third-party runtime scripts” is not plain language for a
  visitor checking privacy.
- **Concrete fix:** “The app has no analytics and loads no code from other
  websites.” Keep the request/script-origin assertion in
  `@claim:local-screenshots`.

#### F-5-5 — the README heading “Use it” does not name its section out of context

- **Exact quote/location:** README heading `## Use it`.
- **Why this fails:** a screen-reader heading list does not say what “it” refers
  to.
- **Concrete fix:** rename it to `## Use Color Signal Lens`.

## 3. Copy audit

Counts split on whitespace. Hyphenated terms, URLs, paths, filenames, and
versions count as one word. Commands are excluded. No sentence exceeds 22
words, and no banned marketing adjective appears.

### Landing page sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Make status colors distinct. | 4 | Pass |
| For people who cannot rely on red and green during code reviews, charts, or status screens. | 16 | Pass |
| See a sample screenshot with an overlay. | 7 | Pass |
| Nothing is saved. | 3 | Pass; `sample-lens` and `demo-isolation` |
| A paper-cut software panel viewed through a large circular lens with blue and orange status marks. | 16 | Pass; meaningful image alt |
| Preview the screenshot changes. | 4 | Pass |
| Open a screenshot, choose a status color, then add a label, pattern, or blue-orange colors. | 15 | Pass |
| Open a file, paste an image, or capture a screen region when you choose. | 14 | Pass |
| Color Signal Lens with a sample checkout screenshot open. | 9 | Pass; walkthrough alt |
| Click the color that is hard to tell apart. | 9 | Pass |
| A green status color selected in the sample checkout screenshot. | 10 | Pass; walkthrough alt |
| Add a label, a pattern, or blue-orange colors over that status color. | 12 | Pass |
| The selected green status color shown in blue with a pattern cue. | 12 | Pass; walkthrough alt |
| It changes neither the screenshot nor your display. | 8 | Pass; `privacy-limits` |
| It processes only the image you open. | 7 | Pass; `local-screenshots` and `privacy-limits` |
| It does not filter your whole display. | 7 | Pass; `privacy-limits` |
| Save named presets for $12 once. | 6 | Pass; price and preset claims |
| The free app includes screenshot reading, labels, patterns, and blue-orange colors. | 11 | Pass; `reading-cues` |
| Lens Plus saves named presets. | 5 | Pass; `named-presets` |
| Sociobot/Dodo is the merchant of record. | 6 | **F-5-1: jargon and unlisted claim** |
| Refunds are handled by Sociobot/Dodo. | 5 | **F-5-1: unlisted claim** |
| A refund revokes the license automatically. | 6 | **F-5-1: unlisted, behaviorally untested claim** |
| Install Color Signal Lens. | 4 | Pass |
| Choose a download from the Releases page. | 7 | Pass fallback; `release-fallback` |
| Downloads require macOS, Windows, or Linux. | 6 | Pass phone state; `desktop-download-platforms` |
| Download the Windows installer. | 4 | Pass conditional state |
| Download the Linux installer. | 4 | Pass conditional state |
| Choose the macOS installer that matches your chip. | 8 | Pass conditional state |
| Checking the license. | 3 | Pass conditional state |
| License is active. | 3 | Pass conditional state |
| This license is no longer active. | 6 | Pass conditional state |
| You can buy Lens Plus again. | 6 | Pass conditional recovery |
| License check is offline. | 4 | Pass conditional error |
| The last active check is in use. | 7 | Pass conditional fallback |
| The license could not be checked. | 6 | Pass conditional error |
| Connect to the internet and try again. | 7 | Pass conditional recovery |
| Color Signal Lens makes screenshot status colors easier to read. | 10 | Pass |

### Landing headings, facts, and actions

| Copy | Words | Result |
| --- | ---: | --- |
| Color Signal Lens | 3 | Pass |
| Skip to main content | 4 | Pass keyboard action |
| Demo | 1 | Pass navigation label |
| How it works | 3 | Pass navigation label and working destination |
| Privacy | 1 | Pass navigation label |
| Private desktop utility | 3 | Pass product-class label |
| Try it with sample data | 5 | Pass result-naming action |
| Screenshots are not uploaded | 4 | Pass; `local-screenshots` |
| Free reader works offline after install | 6 | Pass; `offline-reader` |
| Lens Plus: $12 once | 4 | Pass; `lens-plus-price` |
| Screenshot preview | 2 | Pass section label |
| Open the sample screenshot → | 5 | Pass result-naming action |
| Removed | 1 | Pass preview label |
| Added | 1 | Pass preview label |
| How Color Signal Lens works | 5 | Pass section heading |
| Open a screenshot | 3 | Pass step heading |
| Choose a status color | 4 | Pass step heading |
| Choose a reading cue | 4 | Pass step heading |
| Privacy and limits | 3 | Pass section label |
| Read privacy details | 3 | Pass result-naming action |
| Lens Plus | 2 | Pass section label |
| Buy Lens Plus | 3 | Pass result-naming action |
| Restore license | 2 | Pass result-naming action |
| Paste your license | 3 | Pass form label |
| Desktop app | 2 | Pass section label |
| Open release downloads | 3 | Pass fallback action |
| Open desktop downloads | 3 | Pass phone action |
| Download for Windows | 3 | Pass conditional action |
| Download for Linux | 3 | Pass conditional action |
| Download for Intel Mac | 4 | Pass conditional action |
| Download for Apple Silicon | 4 | Pass conditional action |
| Built by Param Factory | 4 | Pass footer attribution |
| v0.1.10 | 1 | Pass footer version |

### README headings and sentences

| Copy | Words | Result |
| --- | ---: | --- |
| Color Signal Lens | 3 | Pass title |
| Make screenshot status colors distinct. | 5 | Pass |
| It is for people who cannot rely on red and green in software diffs, charts, or status panels. | 18 | Pass |
| Try the sample at https://color-signal-lens.sociobot.in/demo. | 5 | Pass; direct production URL |
| It opens a checkout diff with added and removed totals. | 10 | Pass; `sample-lens` |
| Demo changes stay separate and never change your settings. | 9 | Pass; `demo-isolation` |
| Use it | 2 | **F-5-5: heading is unclear out of context** |
| Open a screenshot, paste an image, or capture a screen region. | 11 | Pass |
| Click a status color, or set a color with the keyboard color field. | 13 | Pass |
| Add a label, a pattern, or blue-orange colors. | 8 | Pass |
| Clear overlay restores the original screenshot. | 6 | Pass |
| Screen capture is requested only after you press Capture screen region. | 11 | Pass |
| Only the region you select is added. | 7 | Pass |
| Screenshot data stays in the app. | 6 | Pass |
| Develop | 1 | Pass developer heading |
| The static deploy root is dist/site. | 6 | Pass developer instruction |
| The Tauri 2 configuration is in src-tauri/. | 7 | Pass developer instruction |
| Install and releases | 3 | Pass heading |
| Tags trigger .github/workflows/release.yml, which checks for macOS, Windows, Linux, SHA256SUMS, and latest.json assets before publishing a release. | 17 | Pass developer instruction; `desktop-release` |
| The Linux script verifies SHA-256 and installs the AppImage as ~/.local/bin/color-signal-lens. | 11 | Pass; `installer-checksums` |
| If GitHub metadata cannot be reached, the landing page links to the Releases page. | 14 | Pass; `release-fallback` |
| Lens Plus | 2 | Pass heading |
| The free app includes all reading controls. | 7 | Pass |
| Lens Plus costs $12 as a one-time purchase and saves named presets on this device. | 15 | Pass; price and preset claims |
| The purchase action uses the Sociobot checkout path. | 8 | **F-5-3: jargon** |
| Buy and restore a license inside the desktop app or on the landing page. | 14 | Pass; `desktop-paid-flow` and `license-restore` |
| Sociobot/Dodo is the merchant of record. | 6 | **F-5-1: jargon and unlisted claim** |
| Refunds are handled by Sociobot/Dodo, and a refund revokes the license automatically. | 12 | **F-5-1: two unlisted claims** |
| The free screenshot reader works offline after the installed desktop app has loaded. | 13 | Pass; `offline-reader` |
| The browser sample is for trying the app before installation. | 10 | Pass |
| Privacy and terms | 3 | Pass heading |
| Read https://color-signal-lens.sociobot.in/privacy for screenshot processing, local storage, and screen permission details. | 11 | Pass |
| Read https://color-signal-lens.sociobot.in/terms for product limits and purchase terms. | 8 | Pass |
| The app has no analytics and loads no third-party runtime scripts. | 11 | **F-5-4: jargon** |
| License | 1 | Pass heading |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

Visitor terminology is otherwise consistent: **screenshot**, **status color**,
**overlay**, **label**, **pattern**, **blue-orange colors**, **preset**, **demo**,
and **app**.

## 4. Demo and sandbox

- The landing action reaches `/demo` in one click at both viewports.
- The first 390×844 demo viewport contains the persistent banner, active cue,
  and complete 330×198 transformed checkout screenshot. The cue ends at y=391
  and the canvas ends at y=619.
- The banner says “Demo — sample data, nothing is saved” and contains **Reset
  demo** and **Start for real**.
- Reset restores `checkout-totals.diff.png`, the removed-color pattern, and the
  `demo:` namespace. Start for real deletes demo keys, opens `/lens`, and shows
  “No screenshot loaded.”
- A live delayed-response reproduction of F-4-1 recorded `{}` for every
  non-demo storage key before entry, after the delayed release response, after
  Reset, and after Start for real. The landing release response cannot write
  after demo navigation.
- With seeded real license and preset values, the listed isolation tests leave
  both values byte-for-byte unchanged and hide paid controls in demo.
- The privacy test exercises public routes, file input, paste, and selected
  region capture. Its request log allows only the product origin and the
  documented GitHub release lookup; all runtime scripts are same-origin and no
  screenshot request is sent.
- The loaded demo remains usable after Playwright sets the context offline. A
  separate check of the built desktop webview bundle also loaded the bundled
  sample and changed its cue while offline.

The demo and sandbox pass.

## 5. Claims gate

Fresh clone: `/tmp/color-signal-lens-review5.x7pbqg` at
`aa8437fc43f20e2a265a58b207671f808720199d`, followed by `npm ci` with 29
packages and zero reported vulnerabilities. Every exact command was executed
independently.

| Claim | Exact command | Result |
| --- | --- | --- |
| `sample-lens` | `npm test -- --grep @claim:sample-lens` | PASS |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | PASS |
| `local-screenshots` | `npm test -- --grep @claim:local-screenshots` | PASS |
| `reading-cues` | `npm test -- --grep @claim:reading-cues` | PASS |
| `demo-reset` | `npm test -- --grep @claim:demo-reset` | PASS |
| `screenshot-input` | `npm test -- --grep @claim:screenshot-input` | PASS |
| `paste-input` | `npm test -- --grep @claim:paste-input` | PASS |
| `portrait-color-pick` | `npm test -- --grep @claim:portrait-color-pick` | PASS |
| `keyboard-color-input` | `npm test -- --grep @claim:keyboard-color-input` | PASS |
| `capture-consent` | `npm test -- --grep @claim:capture-consent` | PASS |
| `clear-overlay` | `npm test -- --grep @claim:clear-overlay` | PASS |
| `privacy-limits` | `npm test -- --grep @claim:privacy-limits` | PASS |
| `named-presets` | `npm test -- --grep @claim:named-presets` | PASS |
| `license-entitlement` | `npm test -- --grep @claim:license-entitlement` | PASS |
| `lens-plus-price` | `npm test -- --grep @claim:lens-plus-price` | PASS for its listed price claim; does not cover F-5-1 |
| `license-restore` | `npm test -- --grep @claim:license-restore` | PASS |
| `desktop-paid-flow` | `npm test -- --grep @claim:desktop-paid-flow` | PASS |
| `sociobot-checkout-path` | `npm test -- --grep @claim:sociobot-checkout-path` | PASS |
| `license-daily-cache` | `npm test -- --grep @claim:license-daily-cache` | PASS |
| `desktop-release` | `npm run test:unit -- --test-name-pattern=@claim:desktop-release` | PASS |
| `installer-checksums` | `npm run test:unit -- --test-name-pattern=@claim:installer-checksums` | PASS |
| `desktop-download-platforms` | `npm test -- --grep @claim:desktop-download-platforms` | PASS |
| `macos-shell-installer-architecture` | `npm run test:unit -- --test-name-pattern=@claim:macos-shell-installer-architecture` | PASS |
| `release-fallback` | `npm test -- --grep @claim:release-fallback` | PASS |
| `offline-reader` | `npm test -- --grep @claim:offline-reader` | PASS |

No listed command failed. F-5-1 is an unlisted-claim failure, not a failure of
one of these 25 commands.

## 6. History audit

Every earlier `.factory/review-*.md`, `.factory/polish-*.md`, and the incoming
handoff was read. Each earlier finding was checked against live behavior and
current source.

| Earlier finding | Round 5 result |
| --- | --- |
| F-1-1 demo writes paid data to real storage | Fixed: demo state is route-derived, paid controls are absent, and real license/preset values remain unchanged. |
| F-1-2 mobile demo hides the useful result | Fixed: cue and full sample canvas are above the first 844px fold. |
| F-1-3 How it works routing is broken | Fixed: same-route, cross-route, direct hash, and Back behavior scroll, focus, and announce correctly. |
| F-1-4 claim tests bypass landing demo entry | Fixed: `sample-lens` and `demo-isolation` start from the landing action. |
| F-1-5 privacy test is too narrow | Fixed: routes, scripts, file, paste, capture, and request origins are covered. |
| F-1-6 phone/download claims are wrong | Fixed: iPhone receives desktop requirements and no installer action; desktop platforms receive matching choices. |
| F-1-7 purchase/refund behavior lacks claim coverage | **Regressed and reopened as F-5-1:** merchant and refund claims were reintroduced without inventory entries or behavioral tests. |
| F-1-8 metaphorical or contradictory headings | Fixed: headings name screenshot preview, workflow, privacy/limits, presets, and installation. |
| F-1-9 inconsistent product terms | Fixed: the documented visitor vocabulary is used consistently. |
| F-1-10 actions do not name results | Fixed on the landing page; all product actions name an outcome. |
| F-1-11 paste and keyboard input are unlisted | Fixed: both have listed observable tests. |
| F-1-12 screenshot walkthrough is absent | Fixed: three original 1280×820 frames load with specific alt text and captions. |
| F-1-13 route metadata/discovery is incomplete | Fixed: route titles, descriptions, canonicals, OG/Twitter fields, social card, sitemap, and icons are present. |
| F-1-14 deployed 404 lacks the shell | Fixed: unknown URLs return HTTP 404 with the shared header/footer, legal links, metadata, and recovery action. |
| F-1-15 README uses subjective adjectives | Fixed: the sample and fallback wording is concrete. |
| F-2-1 sample test does not prove transformation/storage | Fixed: it asserts a transformed pixel and all non-demo storage through reset and exit. |
| F-2-2 hero omits offline behavior | Fixed: the offline fact appears above the mobile fold and has a tagged test. |
| F-2-3 README demo is jargon-heavy/non-clickable | Fixed: it links the production demo and names the checkout-diff result. |
| F-2-4 repository copy audit is incomplete or miscounted | **Regressed and reopened as F-5-2:** 22 rows are miscounted, current README copy is missing, and obsolete copy remains. |
| F-3-1 How it works does not focus its destination | Fixed: live heading focus and polite announcement both pass, including Back. |
| F-4-1 delayed landing lookup writes during demo | Fixed: the live delayed non-empty response leaves every non-demo key unchanged. |
| F-4-2 fallback claims downloads are being published | Fixed: fallback says “Choose a download from the Releases page.” |

## 7. Structure, accessibility, links, and identity

- `/`, `/demo`, `/lens`, `/privacy`, and `/terms` return 200. The unknown route
  returns 404. Each has `lang=en`, one h1, one main, its own plain title,
  description, canonical, OG/Twitter metadata, favicon, and consistent
  header/footer with Privacy and Terms.
- Live cross-route **How it works** navigation reaches `/#how`, places the
  section at the viewport top, focuses its h2, and announces its name. Back
  returns to `/privacy` and focuses that route’s h1.
- Crawled product routes, `robots.txt`, `sitemap.xml`, icons, 1200×630 social
  card, GitHub Releases page, current AppImage, and Sociobot checkout all
  resolved successfully. The checkout redirected to a live Dodo session; no
  purchase was submitted.
- `npm test` passed 7 unit tests and 56 Playwright tests, including axe scans at
  390 and 1440px with zero serious/critical violations. The live verifier found
  no console/page errors, missing alt text, or unlabeled buttons.
- No horizontal overflow was found. Focus rings, 44px targets, reduced motion,
  skip navigation, keyboard operation, and mobile platform handling are
  covered by the passing suite.
- The ink, cream, burnt-orange, blue, and lemon paper-cut diorama, irregular
  edges, editorial/system type pairing, generated lens art, and captioned
  workflow frames match `.factory/design.md`. The result is product-specific,
  not a generic SaaS template.
- `npm run check` passed. `npm run build` produced `dist/app` and `dist/site`;
  site JS is 33.67 KB raw / 11.23 KB gzip and CSS is 13.97 KB raw / 3.92 KB
  gzip. The native Rust test could not start in the base container because the
  standard Tauri system library `glib-2.0` is absent; verification 10 records
  the same clean-base prerequisite and a pass after installing it.

## 8. Missed leverage

No AI, sync, or export step is obviously required by the brief. The core job is
a deterministic, private, temporary reading overlay for one screenshot. File,
paste, selected-region capture, three cue modes, clear/reset, and optional local
presets cover the implied workflow. Adding AI would create disclosure and
network costs without improving status-color recognition.

## What would make this perfect

Remove the three merchant/refund sentences or inventory and behaviorally test
them with authoritative checkout/refund fixtures. Regenerate and mechanically
validate the repository copy audit. Then replace “checkout path” and
“third-party runtime scripts” with the proposed plain wording, rename the
README heading to “Use Color Signal Lens”, and repeat the full review. Nothing
else remains from this round.
