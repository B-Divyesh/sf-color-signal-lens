# Adversarial first-read review 3 — Color Signal Lens

Date: 2026-08-29  
Live site: <https://color-signal-lens.sociobot.in>  
Candidate: `35bf8b06b1146c3a9e70dd33a5c629410073a8c5`

## Verdict: FAIL

One blocking finding remains. The site is clear on first read, the sample is
one click and isolated, and all declared claims pass. The historical How it
works routing repair is partial: it scrolls but does not focus its target.
A PASS requires zero findings.

## Cold first read

### 390 × 844, before scrolling

- **What it does:** makes screenshot status colors distinct without relying on
  red and green.
- **For whom:** people reading code reviews, charts, or status screens who
  cannot rely on red and green.
- **First click:** **Try it with sample data**; a sample screenshot with an
  overlay opens and nothing is saved.

The exact supporting copy is “Make status colors distinct.”, “For people who
cannot rely on red and green during code reviews, charts, or status screens.”,
“Try it with sample data”, and “See a sample screenshot with an overlay.
Nothing is saved.” All is visible in the first screen. The same answers are
visible at 1440 × 900. Both widths had `scrollWidth === innerWidth` and no
console or page errors.

## Findings

### Blocking

#### F-3-1 — Reopens F-1-3: How it works does not focus its destination

- **Quote/location:** header link “How it works” (`/#how`).
- **Observed:** at 390 px, activation changed the URL to `/#how` and scrolled
  to the section (`scrollY: 1455`), but `document.activeElement` was `BODY`.
  The target got neither focus nor a route announcement. Back correctly
  returned to `/` and focused the home `<h1>`.
- **Code confirmation:** `src/main.ts:511` returns immediately for a
  same-path hash (`target.pathname === location.pathname && target.hash`). Its
  focus branch is consequently skipped for this header action.
- **Why this blocks:** the earlier finding required both scroll and focus.
  A keyboard or screen-reader visitor sees the page move but retains no reading
  cursor or announced context at the named section. This is half-fixed history
  and is blocking again under the review instruction.
- **Concrete fix:** explicitly handle same-document anchors: prevent default,
  scroll `#how` into view, set a temporary `tabindex="-1"`, focus its section
  or heading, and announce “How Color Signal Lens works”. Add a keyboard test
  asserting hash, target visibility, destination focus, announcement, and
  home-heading focus after Back.

## Copy audit

Word counts split on spaces; URLs and hyphenated words count as one word. I
checked headings/actions for plain words and every grammatical landing/README
sentence for length, jargon, terms, claims, and usefulness. No sentence is
over 22 words. No banned marketing adjective, mood/metaphor heading,
inconsistent visitor term, or non-result-naming button was found.

### Landing: sentences, headings, and actions

| Copy | Words | Result |
| --- | ---: | --- |
| Private desktop utility | 3 | Pass |
| Make status colors distinct. | 4 | Pass |
| For people who cannot rely on red and green during code reviews, charts, or status screens. | 16 | Pass |
| Try it with sample data | 5 | Pass |
| See a sample screenshot with an overlay. | 7 | Pass |
| Nothing is saved. | 3 | Pass |
| Screenshots are not uploaded | 4 | Pass; `local-screenshots` |
| Free reader works offline after install | 6 | Pass; `offline-reader` |
| Lens Plus: $12 once | 4 | Pass; `lens-plus-price` |
| A paper-cut software panel viewed through a large circular lens with blue and orange status marks. | 16 | Pass meaningful image alt |
| Screenshot preview | 2 | Pass |
| Preview the screenshot changes. | 4 | Pass |
| Open a screenshot, choose a status color, then add a label, pattern, or blue-orange colors. | 15 | Pass |
| Open the sample screenshot | 4 | Pass |
| How Color Signal Lens works | 5 | Pass copy; behavior F-3-1 |
| Open a screenshot | 3 | Pass |
| Open a file, paste an image, or capture a screen region when you choose. | 14 | Pass; tagged input claims |
| Choose a status color | 4 | Pass |
| Click the color that is hard to tell apart. | 9 | Pass |
| Choose a reading cue | 4 | Pass |
| Add a label, a pattern, or blue-orange colors over that status color. | 12 | Pass; `reading-cues` |
| Privacy and limits | 3 | Pass |
| It changes neither the screenshot nor your display. | 8 | Pass; `privacy-limits` |
| It processes only the image you open. | 7 | Pass; `privacy-limits` |
| It does not filter your whole display. | 7 | Pass; `privacy-limits` |
| Read privacy details | 3 | Pass |
| Save named presets for $12 once. | 6 | Pass; `lens-plus-price` |
| The free app includes screenshot reading, labels, patterns, and blue-orange colors. | 11 | Pass |
| Lens Plus saves named presets. | 5 | Pass; `named-presets` |
| Buy Lens Plus | 3 | Pass |
| Restore license | 2 | Pass |
| Desktop app | 2 | Pass |
| Install Color Signal Lens. | 4 | Pass |
| Download the Linux installer. | 4 | Pass; `desktop-download-platforms` |
| Download for Linux | 3 | Pass |
| Color Signal Lens makes screenshot status colors easier to read. | 10 | Pass |

Conditional landing copy: “Downloads are being published.” (4), “Open the
release downloads” (4), “Downloads require macOS, Windows, or Linux.” (6),
“Open desktop downloads” (3), “Download the Windows installer.” (4),
“Download for Windows” (3), “Choose the macOS installer that matches your
chip.” (8), “Download for Intel Mac” (4), “Download for Apple Silicon” (4),
“Paste your license” (3), “Checking the license.” (3), “License is active.”
(3), “This license is no longer active. You can buy Lens Plus again.” (11),
“License check is offline. The last active check is in use.” (11), and “The
license could not be checked. Connect to the internet and try again.” (13).
All are under the cap, concrete, and have a matching test where they claim a
behavior.

### README: every sentence and heading

| Copy | Words | Result |
| --- | ---: | --- |
| Color Signal Lens | 3 | Pass |
| Make screenshot status colors distinct. | 5 | Pass |
| It is for people who cannot rely on red and green in software diffs, charts, or status panels. | 18 | Pass |
| Try the sample at https://color-signal-lens.sociobot.in/demo. | 5 | Pass |
| It opens a checkout diff with added and removed totals. | 10 | Pass; `sample-lens` |
| Demo changes stay separate and never change your settings. | 9 | Pass; `demo-isolation` |
| Use it | 2 | Pass |
| Open a screenshot, paste an image, or capture a screen region. | 11 | Pass; tagged input claims |
| Click a status color, or set a color with the keyboard color field. | 13 | Pass; `keyboard-color-input` |
| Add a label, a pattern, or blue-orange colors. | 8 | Pass; `reading-cues` |
| Clear overlay restores the original screenshot. | 6 | Pass; `clear-overlay` |
| Screen capture is requested only after you press Capture screen region. | 11 | Pass; `capture-consent` |
| Only the region you select is added. | 7 | Pass; `capture-consent` |
| Screenshot data stays in the app. | 6 | Pass; `local-screenshots` |
| Develop | 1 | Pass |
| The static deploy root is `dist/site`. | 6 | Pass developer instruction |
| The Tauri 2 configuration is in `src-tauri/`. | 7 | Pass developer instruction |
| Install and releases | 3 | Pass |
| Tags trigger `.github/workflows/release.yml`, which checks for macOS, Windows, Linux, `SHA256SUMS`, and `latest.json` assets before publishing a release. | 17 | Pass; `desktop-release` |
| The Linux script verifies SHA-256 and installs the AppImage as `~/.local/bin/color-signal-lens`. | 11 | Pass; `installer-checksums` |
| If GitHub metadata cannot be reached, the landing page links to the Releases page. | 14 | Pass; `release-fallback` |
| Lens Plus | 2 | Pass |
| The free app includes all reading controls. | 7 | Pass |
| Lens Plus costs $12 as a one-time purchase and saves named presets on this device. | 15 | Pass; tagged price/preset claims |
| The purchase action uses the Sociobot checkout path. | 8 | Pass; `sociobot-checkout-path` |
| Restore a purchase by pasting its license on the landing page. | 11 | Pass; `license-restore` |
| The free screenshot reader works offline after the installed desktop app has loaded. | 12 | Pass; `offline-reader` |
| The browser sample is for trying the app before installation. | 10 | Pass |
| Privacy and terms | 3 | Pass |
| Read <https://color-signal-lens.sociobot.in/privacy> for screenshot processing, local storage, and screen permission details. | 8 | Pass |
| Read <https://color-signal-lens.sociobot.in/terms> for product limits and purchase terms. | 7 | Pass |
| The app has no analytics and loads no third-party runtime scripts. | 11 | Pass; `local-screenshots` |
| License | 1 | Pass |
| MIT. | 1 | Pass |
| See [LICENSE](LICENSE). | 2 | Pass |

Visitor terms are consistent: **screenshot**, **status color**, **overlay**,
**label**, **pattern**, **blue-orange colors**, **preset**, **demo**, and
**app**. I found no unlisted claim-like landing or README sentence; every
observable promise maps to one of the 23 `.factory/claims.json` entries.

## Demo, sandbox, and privacy

- The landing action reached `/demo` in one click at phone and desktop widths.
- The initial 390 × 844 demo viewport had the persistent banner, active
  pattern cue, and complete 330 × 198 transformed checkout-diff canvas above
  secondary source controls.
- The banner said “Demo — sample data, nothing is saved” and included **Reset
  demo** and **Start for real**.
- With seeded real preset/license keys, demo entry, cue changes, and Reset left
  both keys unchanged; paid preset controls were absent. Start for real removed
  all `demo:` keys, opened `/lens`, and focused its `<h1>`.
- A direct-demo paste flow recorded only same-origin requests and a local blob;
  no screenshot payload was uploaded. Landing also made the documented GET to
  `api.github.com` for release metadata, not a screenshot transfer or script.

## Claims gate

From clean clone `/tmp/color-signal-lens-review3.pqn8ZN`, `npm ci` completed
with no vulnerabilities. I executed every declared command separately. All 23
passed: `sample-lens`, `demo-isolation`, `local-screenshots`, `reading-cues`,
`demo-reset`, `screenshot-input`, `paste-input`, `keyboard-color-input`,
`capture-consent`, `clear-overlay`, `privacy-limits`, `named-presets`,
`license-entitlement`, `lens-plus-price`, `license-restore`,
`sociobot-checkout-path`, `license-daily-cache`, `desktop-release`,
`installer-checksums`, `desktop-download-platforms`,
`macos-shell-installer-architecture`, `release-fallback`, and
`offline-reader`.

`npm test` passed (6 unit/install-release checks and 39 Playwright tests), as
did `npm run check` and `npm run build`. The site build produced `dist/site`
with 31.08 KB raw / 10.45 KB gzip JavaScript.

## History audit

Every earlier finding in `review-1.md`, `review-2.md`, `polish-1.md`,
`polish-2.md`, and the prior handoff was checked live and in source.

| Earlier finding(s) | Result |
| --- | --- |
| F-1-1 | Fixed: real keys survive demo entry, Reset, and exit; demo hides paid controls. |
| F-1-2 | Fixed: transformed sample and cue are visible in the initial phone viewport. |
| F-1-3 | **Half-fixed; reopened as F-3-1.** Scroll works; target focus does not. |
| F-1-4 | Fixed: sample/isolation tests use the landing CTA. |
| F-1-5 | Fixed: routes, file/paste, scripts, request origins, and capture are covered. |
| F-1-6 | Fixed: phones get desktop requirements; desktop platforms get matching actions. |
| F-1-7 | Fixed: price has a checkout-contract fixture; merchant claim was removed. |
| F-1-8 | Fixed: headings name sections; limits are concrete. |
| F-1-9 | Fixed: documented visitor vocabulary is consistent. |
| F-1-10 | Fixed: restore/download actions name their results. |
| F-1-11 | Fixed: paste and keyboard input have observable claim tests. |
| F-1-12 | Fixed: three captioned original workflow frames are present. |
| F-1-13 | Fixed: per-route metadata, social fields, card, and sitemap entries exist. |
| F-1-14 | Fixed: unknown route is a 404 with shell, legal links, metadata, recovery. |
| F-1-15 | Fixed: sample/fallback copy is concrete. |
| F-2-1 | Fixed: sample test checks transformed pixel and real-storage snapshot. |
| F-2-2 | Fixed: hero contains tested offline fact. |
| F-2-3 | Fixed: README has clickable demo URL and plain outcome. |
| F-2-4 | Fixed: repository audit covers rendered states, README, and terminology. |

## Structure, accessibility, links, and identity

- `/`, `/demo`, `/lens`, `/privacy`, and `/terms` returned 200; unknown route
  returned 404. Each had a route-specific title, one `<h1>`, one `<main>`,
  `lang="en"`, description, canonical, OG/Twitter tags, favicon, and shared
  header/footer with Privacy and Terms.
- Axe reported zero serious/critical violations on those routes plus the 404 at
  390 px. There was no horizontal overflow; reduced motion, skip link, visible
  focus, and 44 px controls were present.
- Unique public links crawled successfully: product routes, Sociobot checkout,
  GitHub release page, and current Linux AppImage ended at 200.
- CSP, `X-Content-Type-Options: nosniff`, and strict-origin referrer policy
  were served. The paper-cut artwork, ink/paper palette, cut edges, editorial
  type, and workflow images are product-specific rather than generic SaaS UI.

## Missed leverage

No AI, sync, or export feature is implied by the brief. The useful job is a
private, temporary, deterministic reading treatment for one screenshot; an AI
step would add disclosure without improving it. File, paste, and
selected-region capture already cover the expected inputs.

## What would make this perfect

Implement the focus and announcement behavior in F-3-1, add its keyboard
regression, then repeat the full review. That would remove the only finding.
