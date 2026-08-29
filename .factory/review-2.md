# Adversarial first-read review 2 — Color Signal Lens

Date: 2026-08-29

Live site: <https://color-signal-lens.sociobot.in>

Candidate reviewed: `f81025ac9fca0161cf294a4202ac9f0db4518e3d`

Viewports: 390×844 and 1440×900, plus Pixel 7 and iPhone 13 user agents

## Verdict: FAIL

The first screen and one-click demo are now clear and usable. All 23 listed
claim commands pass, the demo is isolated, the public routes are structured,
and the visual identity is distinct. The product still has three blocking
regressions from review 1: phone visitors are offered incompatible desktop
downloads, the paid-price and merchant tests only repeat the claims, and the
copy still uses three names for presets and status colors. Four additional
findings remain. A PASS requires zero findings and no untested claim.

## 1. Cold first read, before scrolling

### 390×844

- What it does: makes red/green status colors in screenshots easier to tell
  apart.
- For whom: people reading code reviews, charts, or status screens who cannot
  rely on red and green.
- What to click first: **Try it with sample data**. The adjacent text says a
  sample screenshot with an overlay will open and nothing will be saved.

All three answers are visible without scrolling. The exact supporting copy is
“Make status colors distinct.”, “For people who cannot rely on red and green
during code reviews, charts, or status screens.”, “Try it with sample data”,
and “See a sample screenshot with an overlay. Nothing is saved.”

### 1440×900

The same three answers are visible without scrolling. No first-screen clarity
blocker was found.

## 2. Findings

### Blocking

#### F-1-6 — Reopened: phone visitors receive incompatible desktop downloads

- **Quote/location:** landing desktop-app section: “Download the installer for
  this computer.”
- **Observed:** with a Pixel 7 user agent, the live page offers
  `Color.Signal.Lens_0.1.7_amd64.AppImage`. With an iPhone 13 user agent, it
  says “Choose the macOS installer that matches your chip” and offers Intel and
  Apple-Silicon DMGs. Neither download runs on the phone being used.
- **Code confirmation:** `hydrateDownload()` treats every user agent without
  `Mac` or `Windows` as Linux. An iPhone user agent contains `Mac`, so it is
  treated as desktop macOS. No mobile branch exists. `claims.json` covers Mac
  architecture labels but not the generic “this computer” selection claim or
  mobile behavior.
- **Why this blocks:** this is the primary review context: a new visitor on a
  phone. The page makes a false compatibility claim and directs that visitor
  to an unusable 81 MB desktop file. This is a regression of the platform
  claim recorded in review 1.
- **Concrete fix:** detect mobile first and say “Downloads require macOS,
  Windows, or Linux” with an **Open desktop downloads** action. On desktop,
  name the actual platform in the sentence and button. Add a listed claim test
  for Android, iPhone, Windows, Intel Mac, Apple-Silicon Mac, and Linux user
  agents.

#### F-1-7 — Reopened: paid claims are checked by repeating their copy

- **Quote/location:** “Lens Plus: $12 once”; “Lens Plus costs $12 as a one-time
  purchase.”; “Sociobot and Dodo are the merchant of record.”
- **Observed:** `@claim:lens-plus-price` only asserts that `$12` appears on the
  landing and terms pages. `@claim:merchant-disclosure` only asserts that the
  merchant sentence appears. Neither test observes checkout data or merchant
  configuration. The tests therefore prove that the claims are printed, not
  that they are true.
- **Live check:** the checkout currently redirects to
  `checkout.dodopayments.com` and displays “Color Signal Lens Plus” at `$12.00`.
  This confirms the current price manually, but it is outside the repeatable
  clean-sandbox claim test and does not by itself establish the legal
  merchant-of-record statement.
- **Why this blocks:** review 1 required observable coverage for payment and
  merchant behavior. The repair retained the claims but replaced the missing
  coverage with tautological DOM assertions, so the earlier finding is only
  half-fixed.
- **Concrete fix:** make the checkout endpoint available as a recorded fixture
  or contract response and assert the product, one-time `$12.00` total, and
  merchant fields. If merchant status cannot be verified, remove that claim
  from product copy and `claims.json`.

#### F-1-9 — Reopened: preset and color terminology is still inconsistent

- **Quotes/locations:** landing: “Save custom lenses for $12 once.”, “The free
  lens includes…”, “Plus saves named presets”, and footer “screenshot status
  signals”. README: “The free app…” and “screenshot status colors”.
- **Why this blocks:** the copy asks a first-time visitor to infer that a
  “custom lens” is a “named preset”, that a “free lens” is the app, and that a
  “status signal” is a status color. The repository terminology table itself
  specifies `status color`, `overlay`, and `preset`. Review 1 required one word
  per concept; the repair is incomplete.
- **Concrete fix:** write “Save named presets for $12 once.”, “The free app
  includes…”, and “Color Signal Lens makes screenshot status colors easier to
  read.” Use `lens` only in the product name and tier name.

### High

#### F-2-1 — The sample claim's own test does not prove its compound promise

- **Quote/location:** `claims.json` `sample-lens`: “Try it with sample data
  opens a sample screenshot with an overlay and nothing saved.”
- **Observed:** `@claim:sample-lens` checks the URL, banner, sample filename,
  and that a canvas is visible. It does not assert a transformed sample pixel
  or inspect storage. Those behaviors happen to be covered by differently
  tagged tests, but the claims contract requires the one test tagged for this
  claim to prove its observable result.
- **Why this matters:** the command can remain green if the canvas becomes an
  unchanged screenshot or if the entry action begins writing data, which are
  the two substantive parts of its wording.
- **Concrete fix:** either narrow the claim to “opens the sample screenshot” or
  make `@claim:sample-lens` assert the initial patterned pixel and a complete
  before/after storage snapshot.

### Medium

#### F-2-2 — The mandatory first-screen facts omit offline behavior

- **Quote/location:** hero facts: “Works from a screenshot”, “Runs on your
  device”, and “Lens Plus: $12 once”.
- **Why this matters:** the required first-screen fact set is privacy, offline,
  and price. Input type occupies one slot, “Runs on your device” is vague, and
  no offline scope is stated or listed in `claims.json`.
- **Concrete fix:** use “Screenshots are not uploaded”, “Free reader works
  offline after install”, and “Lens Plus: $12 once”, then add a clean installed
  app offline claim test. Do not claim offline browser reload unless a service
  worker makes it true.

#### F-2-3 — README demo instructions are jargon-heavy and not one-click

- **Quotes/location:** README: “Try the isolated browser demo at `/demo` or
  `/?demo=1`.” and “Demo data uses separate browser keys…”
- **Why this matters:** `isolated` and `browser keys` describe implementation,
  not what a visitor can do. The backticked relative paths are not clickable
  from the repository page, despite the demo contract requiring the README to
  expose the verifier/demo URL.
- **Concrete fix:** write “Try the sample at
  <https://color-signal-lens.sociobot.in/demo>. It opens a checkout diff with
  added and removed totals. Demo changes stay separate and never change your
  settings.”

### Low

#### F-2-4 — The repository copy audit is incomplete and contains a bad count

- **Location:** `.factory/copy-audit.md`.
- **Observed:** it says landing, demo, legal, and README copy were checked but
  lists only 14 lines. It omits most landing and README sentences, headings,
  actions, and conditional states. It counts “Preview the screenshot changes.”
  as five words; it has four.
- **Why this matters:** the required proof cannot detect regressions such as
  F-1-9 or F-2-3 when most copy is absent.
- **Concrete fix:** regenerate the audit from every rendered copy state and the
  README, include buttons and headings, and flag terminology as well as length.

## 3. Copy audit

Counts split on spaces; hyphenated terms, paths, versions, and filenames count
as one word. Code blocks are commands, not sentences. No landing or README
sentence exceeds 22 words, and no banned marketing adjective appears.

### Landing page: every visible copy unit

This includes headings, actions, facts, meaningful alt text, and conditional
download/license states because buttons and headings are part of the audit.

| Copy | Words | Result |
| --- | ---: | --- |
| Color Signal Lens | 3 | Pass |
| Demo | 1 | Pass |
| How it works | 3 | Pass |
| Privacy | 1 | Pass |
| PRIVATE DESKTOP UTILITY | 3 | Pass |
| Make status colors distinct. | 4 | Pass |
| For people who cannot rely on red and green during code reviews, charts, or status screens. | 16 | Pass |
| Try it with sample data | 5 | Pass |
| See a sample screenshot with an overlay. | 7 | Pass |
| Nothing is saved. | 3 | Pass; verified in the demo sandbox |
| Works from a screenshot | 4 | F-2-2: input fact replaces the required offline fact |
| Runs on your device | 4 | F-2-2: vague privacy wording |
| Lens Plus: $12 once | 4 | F-1-7: claim test is tautological |
| A paper-cut software panel viewed through a large circular lens with blue and orange status marks. | 16 | Pass |
| SCREENSHOT PREVIEW | 2 | Pass |
| Preview the screenshot changes. | 4 | Pass |
| Open a screenshot, choose a status color, then add a label, pattern, or blue-orange colors. | 15 | Pass |
| Open the sample screenshot | 4 | Pass |
| Removed | 1 | Pass |
| Added | 1 | Pass |
| HOW IT WORKS | 3 | Pass |
| How Color Signal Lens works | 5 | Pass |
| Open a screenshot | 3 | Pass |
| Open a file, paste an image, or capture a screen region when you choose. | 14 | Pass |
| Choose a status color | 4 | Pass |
| Click the color that is hard to tell apart. | 9 | Pass |
| Choose a reading cue | 4 | Pass |
| Add a label, a pattern, or blue-orange colors over that status color. | 12 | Pass |
| PRIVACY AND LIMITS | 3 | Pass |
| It changes neither the screenshot nor your display. | 8 | Pass |
| It processes only the image you open. | 7 | Pass |
| It does not filter your whole display. | 7 | Pass |
| Read privacy details | 3 | Pass |
| LENS PLUS | 2 | Pass |
| Save custom lenses for $12 once. | 6 | F-1-9 and F-1-7 |
| The free lens includes screenshot reading, labels, patterns, and blue-orange colors. | 11 | F-1-9 |
| Plus saves named presets. | 4 | Pass alone; conflicts with “custom lenses” |
| Buy Lens Plus | 3 | Pass |
| Restore license | 2 | Pass |
| DESKTOP APP | 2 | Pass |
| Install Color Signal Lens. | 4 | Pass |
| Download the installer for this computer. | 6 | F-1-6 |
| Download Color.Signal.Lens_0.1.7_amd64.AppImage | 2 | F-1-6 on a phone |
| Color Signal Lens makes screenshot status signals easier to read. | 10 | F-1-9 |
| Privacy | 1 | Pass |
| Terms | 1 | Pass |
| Built by Param Factory | 4 | Pass |
| v0.1.7 | 1 | Pass |

Conditional landing states:

| Copy | Words | Result |
| --- | ---: | --- |
| Downloads are being published. | 4 | Pass |
| Open the release downloads. | 4 | Pass |
| Open release downloads | 3 | Pass |
| Choose the macOS installer that matches your chip. | 8 | F-1-6 on iPhone |
| Download for Intel Mac | 4 | F-1-6 on iPhone |
| Download for Apple Silicon | 4 | F-1-6 on iPhone |
| Paste your license | 3 | Pass |
| Checking the license. | 3 | Pass |
| License is active. | 3 | Pass |
| This license is no longer active. | 6 | Pass |
| You can buy Lens Plus again. | 6 | Pass |
| License check is offline. | 4 | Pass |
| The last active check is in use. | 7 | Pass |
| The license could not be checked. | 6 | Pass |
| Connect to the internet and try again. | 7 | Pass |

### README: every heading and sentence

| Copy | Words | Result |
| --- | ---: | --- |
| Color Signal Lens | 3 | Pass |
| Make screenshot status colors distinct. | 5 | Pass |
| It is for people who cannot rely on red and green in software diffs, charts, or status panels. | 18 | Pass |
| Try the isolated browser demo at `/demo` or `/?demo=1`. | 9 | F-2-3 |
| It opens a sample checkout diff with added and removed totals. | 11 | Pass |
| Demo data uses separate browser keys and never changes real settings. | 11 | F-2-3 |
| Use it | 2 | Pass |
| Open a screenshot, paste an image, or capture a screen region. | 11 | Pass |
| Click a status color, or set a color with the keyboard color field. | 13 | Pass |
| Add a label, a pattern, or blue-orange colors. | 8 | Pass |
| Clear overlay restores the original screenshot. | 6 | Pass |
| Screen capture is requested only after you press Capture screen region. | 11 | Pass |
| Only the region you select is added. | 7 | Pass |
| Screenshot data stays in the app. | 6 | Pass |
| Develop | 1 | Pass |
| The static deploy root is `dist/site`. | 6 | Pass developer documentation |
| The Tauri 2 configuration is in `src-tauri/`. | 7 | Pass developer documentation |
| Install and releases | 3 | Pass |
| Tags trigger `.github/workflows/release.yml`, which checks for macOS, Windows, Linux, `SHA256SUMS`, and `latest.json` assets before publishing a release. | 17 | Pass under `desktop-release` |
| The Linux script verifies SHA-256 and installs the AppImage as `~/.local/bin/color-signal-lens`. | 11 | Pass |
| If GitHub metadata cannot be reached, the landing page links to the Releases page. | 14 | Pass |
| Lens Plus | 2 | Pass |
| The free app includes all reading controls. | 7 | Pass |
| Lens Plus costs $12 as a one-time purchase and saves named presets on this device. | 15 | F-1-7 for price coverage; preset behavior passes |
| The purchase action uses the Sociobot checkout path. | 8 | Pass |
| Restore a purchase by pasting its license on the landing page. | 11 | Pass |
| Privacy and terms | 3 | Pass |
| Read `/privacy` for screenshot processing, local storage, and screen permission details. | 11 | Pass |
| Read `/terms` for product limits and purchase terms. | 8 | Pass |
| The app has no analytics and loads no third-party runtime scripts. | 11 | Pass |
| License | 1 | Pass |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

## 4. Demo and sandbox

- The landing action reaches `/demo` in one click.
- The first mobile demo viewport contains the banner, active cue, and entire
  330×198 transformed sample canvas. The controls begin below it.
- The sample is a specific checkout diff with removed and added totals.
- Reset restores the initial pattern and sample. Start for real removes every
  `demo:` key, opens `/lens`, and shows “No screenshot loaded.”
- A pre-seeded real license and preset remained byte-for-byte unchanged after
  changing the cue and resetting. Paid preset controls were absent in demo.
- A live request log covering direct demo load, cue changes, local file input,
  paste, and offline use recorded only same-origin GETs. No screenshot body was
  sent. The loaded sample remained usable after `context.setOffline(true)`.
- Landing makes one cross-origin GET to the GitHub releases API for download
  metadata. No third-party runtime script loads.

The demo itself passes. F-2-1 concerns the strength of its declared claim test,
not the behavior observed in this run.

## 5. Claims gate

Every command was run independently after `npm ci` in a fresh local clone at
`/tmp/color-signal-lens-review2.bLoPzV`.

| Claim | Listed command result | Coverage result |
| --- | --- | --- |
| `sample-lens` | PASS | Incomplete: F-2-1 |
| `demo-isolation` | PASS | Adequate |
| `local-screenshots` | PASS | Adequate with separate capture test |
| `reading-cues` | PASS | Adequate |
| `demo-reset` | PASS | Adequate |
| `screenshot-input` | PASS | Adequate |
| `paste-input` | PASS | Adequate |
| `keyboard-color-input` | PASS | Adequate |
| `capture-consent` | PASS | Adequate |
| `clear-overlay` | PASS | Adequate |
| `privacy-limits` | PASS | Adequate |
| `named-presets` | PASS | Adequate |
| `license-entitlement` | PASS | Adequate with positive regression test |
| `lens-plus-price` | PASS | Tautological: F-1-7 |
| `merchant-disclosure` | PASS | Tautological: F-1-7 |
| `license-restore` | PASS | Adequate |
| `sociobot-checkout-path` | PASS | Adequate for the path only |
| `license-daily-cache` | PASS | Adequate |
| `desktop-release` | PASS | Adequate workflow gate; current release also has all listed assets |
| `installer-checksums` | PASS | Adequate |
| `macos-installer-architecture` | PASS | Incomplete platform scope: F-1-6 |
| `macos-shell-installer-architecture` | PASS | Adequate |
| `release-fallback` | PASS | Adequate |

No listed command failed. “Download the installer for this computer” is an
unlisted claim. The price, merchant, and sample claims have listed but
insufficient tests as described above.

## 6. History audit

Every finding in `review-1.md`, the corresponding `polish-1.md` repair, and the
existing handoff were checked against both live behavior and current code.

| Earlier finding | Result in round 2 |
| --- | --- |
| F-1-1 demo writes real storage | Fixed: landing entry, reset, and exit preserve seeded real keys; demo has no paid controls. |
| F-1-2 sample result below mobile fold | Fixed: banner, active cue, and full sample canvas fit within 844 px. |
| F-1-3 How it works link does not scroll | Fixed: after navigation the section top is 0.17 px; back restores `/`. |
| F-1-4 tests bypass landing demo path | Fixed: sample and isolation tests begin at `/` and click the CTA. |
| F-1-5 privacy scope is too narrow | Fixed: route, file, paste, script-origin, request-log, and separate capture coverage exists. |
| F-1-6 platform claims are unlisted/partial | **Reopened, blocking:** false phone selection and an unlisted generic compatibility claim remain. |
| F-1-7 purchase and merchant coverage | **Reopened, blocking:** removed claims stay removed, but retained price/merchant tests only read copy. |
| F-1-8 metaphorical/contradictory headings | Fixed: headings now name preview, workflow, privacy, and limits. |
| F-1-9 inconsistent terminology | **Reopened, blocking:** `custom lenses`, `free lens`, `named presets`, and `status signals` remain mixed. |
| F-1-10 vague actions | Fixed: Restore license and Open release downloads name results. |
| F-1-11 paste/keyboard claims unlisted | Fixed: both have tagged observable tests. |
| F-1-12 no desktop walkthrough | Fixed: three captioned, original workflow screenshots are present with provenance. |
| F-1-13 route metadata incomplete | Fixed: titles, descriptions, canonicals, OG/Twitter tags, 1200×630 image, and sitemap routes are present. |
| F-1-14 deployed 404 incomplete | Fixed: live unknown route returns HTTP 404 with the shared shell, legal links, metadata, and plain heading. |
| F-1-15 subjective README adjectives | Fixed: the sample and fallback descriptions are observable. |

## 7. Structure, accessibility, links, and identity

Confirmed:

- `/`, `/demo`, `/lens`, `/privacy`, and `/terms` return 200. An unknown path
  returns 404. Each has one `<h1>`, one `<main>`, a consistent header/footer,
  route-specific title, description, canonical, OG/Twitter metadata, and
  favicon.
- Titles follow the required product/action or route/product pattern.
- Direct links, reload, Privacy navigation, back navigation, and heading focus
  pass. `/#how` scrolls to the named section; back returns home.
- Every live site link resolves successfully, including the Sociobot checkout
  redirect and current AppImage asset.
- Live axe scans found zero serious or critical violations on all five routes
  at both 390 and 1440 widths. There was no horizontal overflow or normal-route
  console error. Reduced-motion CSS is present.
- The initial site JavaScript is 30.74 KB (10.37 KB gzip), below the limit.
- The paper-cut diorama, ink/paper palette, uneven cut edges, editorial type,
  original art, and screenshot walkthrough are recognizably product-specific,
  not a generic SaaS template.

The missing offline fact is F-2-2. The mobile download behavior is F-1-6.

## 8. Missed leverage

No AI feature is justified. Color selection and deterministic overlays are
more private and reliable without model inference. The app already supports
file open, paste, selected-region capture, and a temporary readable overlay.
Sync would conflict with its local-first scope, and export is not clearly
implied because the product explicitly leaves the source screenshot unchanged.

## 9. Verification summary

- Every listed claim command: 23/23 exited 0.
- `CI=1 npm test`: 6 unit tests and 39 Playwright tests passed.
- `npm run check`: passed.
- `npm run build`: passed; emitted `dist/app` and `dist/site`.
- Live axe: 0 serious/critical findings on 10 route/viewport combinations.
- Live link crawl: all internal routes, legal links, release page, current
  AppImage, and checkout redirect reached 200 final responses.

## What would make this perfect

Stop offering desktop installers to phones and test every user-agent branch.
Replace the price and merchant copy checks with a checkout contract test.
Use `preset`, `app`, and `status color` consistently. Make the sample claim's
test prove its full wording, put a tested offline fact in the hero, replace the
README's implementation jargon with a clickable demo URL, and regenerate the
copy audit from every rendered state. Then rerun the full review; there should
be no remaining finding to waive.
