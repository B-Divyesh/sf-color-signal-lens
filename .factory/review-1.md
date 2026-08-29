# Adversarial first-read review 1 — Color Signal Lens

Date: 2026-08-29

Live site: <https://color-signal-lens.sociobot.in>

Candidate reviewed: `a1fa66b57df708e12ea6204319c4dae705226251`

Viewport priority: 390×844, with a 1440×900 comparison

## Verdict: FAIL

The cold first screen is clear, the direct `/demo` URL is useful, all 18 listed
claim commands pass, and the visual identity is distinct. The required
landing-page demo path is not an isolated demo, however. It can expose paid
controls and write a preset into the real storage namespace while its banner
says that nothing is saved. The mobile demo also postpones the useful result
until the bottom of the first viewport, and the header's “How it works” link
does not move to that section. These are blocking findings.

This is not a PASS-adjacent review. There are 15 findings: 3 blocking, 4 high,
7 medium, and 1 low.

## 1. Cold first read, before scrolling

### 390×844

- What it does: changes color-coded statuses into distinctions that do not
  depend on red and green, using a screenshot as input.
- For whom: people who cannot rely on red and green in code reviews, charts,
  or status screens.
- What to click first: **Try it with sample data**. The adjacent line says a
  diff lens will open and nothing will be saved.

### 1440×900

The same three answers are available without scrolling.

The exact copy that supplied the answers was “Make status colors distinct.”,
“For people who cannot rely on red and green during code reviews, charts, or
status screens.”, “Try it with sample data”, “See a diff lens open with
nothing saved.”, and “Works from a screenshot”. There is no blocking
first-screen copy finding.

## Findings

### Blocking

#### F-1-1 — The one-click demo can write paid data to real storage

- **Quote/location:** landing CTA “Try it with sample data”; `/demo` banner
  “Demo — sample data, nothing is saved”; Reset demo.
- **Observed:** in a fresh live context pre-seeded with a valid cached license
  and an empty real `color-signal-lens:presets` value, opening `/` and clicking
  the CTA produced `/demo` with the banner visible but also showed the real
  **Saved presets** UI. Saving `WROTE FROM DEMO` wrote that record to
  `color-signal-lens:presets`. Reset demo left it there. Pressing **Load sample
  diff** then removed the demo banner and changed the title to the real-workspace
  title while the address bar still said `/demo`.
- **Code confirmation:** `demo` is initialized only once at
  `src/main.ts:20`. The `/demo` branch at `src/main.ts:474` calls
  `renderDemo()` without setting `demo = true`. `premiumContent()` therefore
  reads real entitlement/preset state, and `writePresets()` writes the real key.
  `loadSample()` uses the stale false flag and renders the real workspace.
- **Why this fails:** the first action promises an isolated sandbox. The
  banner is materially false, Reset does not restore real data, and the exact
  route required by the demo contract is unsafe.
- **Fix:** derive demo state on every route render, set it before any demo UI
  or storage access, and make every demo persistence adapter accept only
  `demo:` keys. Add a claim test that starts at `/`, pre-seeds a valid license
  and real preset, clicks the CTA, exercises save/load/reset, and proves the
  real keys are byte-for-byte unchanged and the banner remains present.

#### F-1-2 — The 390px demo first screen does not yet show the result

- **Quote/location:** first viewport after clicking “Try it with sample data”.
- **Observed:** the 390×844 screen is consumed by the banner, heading,
  instructions, three source buttons, file name, and permission copy. Only the
  top edge of the sample canvas appears at the bottom; the selected cue and
  controls are below the fold. **Load sample diff** is also shown even though
  the sample is already loaded.
- **Why this fails:** a phone visitor cannot see what changed or understand the
  value without scrolling. The attached demo contract requires the first
  post-click screen to already look like the product being used.
- **Fix:** put a compact transformed sample and its active cue immediately
  under the banner, remove the redundant load button in demo mode, and move
  secondary import/capture controls below it. Add a 390×844 assertion that the
  sample output and active cue are both inside the initial viewport.

#### F-1-3 — “How it works” changes the URL but leaves the visitor at the hero

- **Quote/location:** header link “How it works” (`/#how`).
- **Observed:** clicking it on the live landing page changed the URL to
  `/#how`, left `scrollY` at 0, left the section 1,678.67 px below the viewport,
  and focused the home `<h1>`. A cold address-bar visit to `/#how` did scroll,
  so only the client-side route is broken.
- **Code confirmation:** `wireNavigation()` intercepts every internal link,
  calls `renderRoute()`, and focuses the new `<h1>`; it has no hash-target
  branch (`src/main.ts:473`).
- **Why this fails:** this is a primary header link whose named destination is
  not reached. Broken routing is blocking under the supplied structure rules.
- **Fix:** allow same-document anchors to use native navigation, or explicitly
  scroll and focus `#how` without rebuilding the page. Test mouse, keyboard,
  back, and direct-load behavior at both viewports.

### High

#### F-1-4 — The passing claim tests bypass the unsafe demo entry path

- **Quote/location:** claims `sample-lens`, `local-screenshots`, and
  `demo-reset`; `tests/claims.spec.ts:4-18` and `:102-110`.
- **Observed:** all three tests call `page.goto('/demo')`. A cold `/demo`
  initializes the flag correctly and therefore cannot reproduce F-1-1. The
  visitor-facing claim says “Try it with sample data opens a diff lens with
  nothing saved,” which names the landing action, not a direct URL.
- **Why this fails:** green tests give false assurance for the exact journey
  named in the claim. The live first action falsifies the intended sandbox
  guarantee even though the command exits 0.
- **Fix:** make the claim test click the real CTA from `/`, seed both licensed
  and unlicensed real namespaces, exercise all demo mutations, and assert the
  request log and every real key. Keep a separate direct-deep-link regression.

#### F-1-5 — Privacy claims are broader than their observable test

- **Quote/location:** privacy page: “It does not upload screenshots, record
  your screen, or use analytics.” README: “No analytics or third-party runtime
  scripts are used.”
- **Observed:** `@claim:local-screenshots` opens only direct `/demo`, clicks the
  bundled canvas, and checks cross-origin requests. It does not open or paste a
  user image, exercise capture, visit the landing/legal routes, inspect loaded
  scripts, or cover the packaged desktop app. The broader README sentence has
  no matching claim entry.
- **Why this fails:** a privacy promise must be proved over the paths and
  surfaces it names. The present test proves only one narrow demo interaction.
- **Fix:** either narrow the copy to the tested demo behavior or add tagged
  tests covering file, paste, capture, all public routes, loaded script origins,
  and the native application boundary.

#### F-1-6 — Platform/download claims are unlisted or only partly tested

- **Quotes/locations:** landing: “The current download matches your computer.”,
  “Installers are unsigned.”, “Your computer may ask you to confirm the app.”
  README: “Release builds run on tags such as v0.1.7…”, “The workflow creates
  unsigned macOS, Windows, and Linux artifacts plus checksums.”, “The macOS
  script … saves it in Downloads, and opens it.”, and “The Windows script
  verifies and starts the installer.”
- **Observed:** `claims.json` covers Mac architecture choice, Linux checksum
  installation, and release asset gates. It does not list the generic
  computer-match claim, unsigned state, tag trigger, Mac save/open behavior, or
  executable Windows installer behavior. The Linux/Windows selection code also
  does not establish that one generic download “matches” every computer.
- **Why this fails:** these are user-reliant installation claims with no exact
  claim entry and observable sandbox test.
- **Fix:** use explicit actions such as “Download AppImage for Linux” instead of
  “matches your computer”; add separate signing, workflow-trigger, Mac
  save/open, and Windows verification/launch claims and tests, or remove those
  statements.

#### F-1-7 — Purchase and refund behavior is asserted without claim coverage

- **Quotes/locations:** README: “The hosted Sociobot checkout returns a license
  token.” Terms: “Sociobot and Dodo are the merchant of record.” and “A refunded
  purchase may lose access to saved presets.”
- **Observed:** `@claim:sociobot-checkout-path` asserts only the checkout link's
  href. It does not complete a fixture checkout, observe a returned token,
  confirm merchant disclosure, or verify refund-driven entitlement removal.
- **Why this fails:** visitors can rely on all three statements when deciding
  whether to pay, but none has the required observable test.
- **Fix:** add fixture-backed claim entries for checkout return, merchant
  disclosure, and refunded entitlement behavior, or narrow the copy to what the
  link test proves.

### Medium

#### F-1-8 — Section headings use metaphor, jargon, and a contradiction

- **Quotes/location:** “A SMALL, LOCAL LAYER”; “Pick one signal. Make it
  readable.”; “Read the signal, not a global filter.”; and the “WHAT IT DOES NOT
  DO” section followed by “It adds cues…” and “It adds a temporary layer…”.
- **Why this fails:** “signal”, “layer”, and “global filter” require product
  context, while the limits section never names a limitation and contradicts
  its own heading.
- **Fix:** use “Preview the screenshot changes”, “How Color Signal Lens works”,
  and “Privacy and limits”. Replace the limits copy with concrete negatives,
  for example: “It does not change the original screenshot or filter your whole
  display. It processes only the image you open.” Add claims for those promises.

#### F-1-9 — The same concepts use inconsistent words and spelling

- **Quotes/location:** hero “status colors”; body and controls “colour”; and
  “signal”, “cue”, “lens”, “layer”, and “remap” for overlapping concepts.
  README also switches among “colour signal”, “source image”, “lens”, and
  “overlay”.
- **Why this fails:** a first-time visitor has to infer the product vocabulary,
  and the US/UK spelling switches within one page.
- **Fix:** choose one spelling and a small terminology table. A plain set would
  be `screenshot`, `status color`, `label`, `pattern`, `blue-orange colors`, and
  `overlay`; use it on the landing page, workspace, privacy page, and README.

#### F-1-10 — Several actions do not name their result

- **Quotes/location:** landing button “Have a license?” and conditional link
  “See downloads”.
- **Why this fails:** the first is a question rather than an action; the second
  does not say where the visitor goes.
- **Fix:** use “Restore license” and “Open release downloads”.

#### F-1-11 — Paste and keyboard input claims are not listed claims

- **Quotes/location:** “Open a screenshot, paste an image, or choose Capture
  screen region…” and “Click a difficult colour signal, or set its colour with
  the keyboard field.”
- **Observed:** the screenshot claim tests file input; the capture claim tests
  the region flow. No claim entry or tagged test covers paste input or the
  keyboard color-selection promise.
- **Why this fails:** these are concrete ways to do the core job, but the claims
  inventory does not prove them.
- **Fix:** add `paste-input` and `keyboard-colour-input` entries with observable
  tests, or remove those methods from the README.

#### F-1-12 — The desktop landing page lacks the required screenshot walkthrough

- **Quote/location:** landing “HOW IT WORKS” section.
- **Observed:** it contains three text columns and no captioned application
  screenshots. The single hero illustration is conceptual artwork, not a
  three-to-five-frame walkthrough of the desktop workflow.
- **Why this fails:** the attached desktop demo contract requires a short
  captioned screenshot walkthrough so a visitor can understand the installed
  experience before downloading.
- **Fix:** add three original, captioned frames showing open/capture, select a
  status color, and apply/clear a cue. Record their provenance and responsive
  alt text.

#### F-1-13 — Route metadata and discovery files are incomplete

- **Location:** `index.html` and `public/sitemap.xml`.
- **Observed:** `/demo`, `/lens`, `/privacy`, and `/terms` all publish the home
  canonical URL and home description/OG copy. There are no `twitter:title`,
  `twitter:description`, or `twitter:image` tags. The declared OG image is
  1200×800 rather than 1200×630. `/lens` is absent from the sitemap.
- **Why this fails:** non-home pages identify themselves as the home page, the
  required social-card metadata is incomplete, and a real route is omitted
  from discovery.
- **Fix:** update canonical, description, and social metadata per route; add
  all Twitter fields; ship a 1200×630 derivative of the original art; add
  `/lens` to the sitemap.

#### F-1-14 — The deployed 404 drops the site skeleton and uses a metaphor

- **Quote/location:** `/missing-review-route`: “This paper layer is missing.”
- **Observed:** the route correctly returns 404 and has one `<h1>`, but the
  static page has no shared header, footer, Privacy/Terms links, meta
  description, canonical, favicon, or social metadata. The in-app 404 in
  `src/main.ts` is not the page served by the host.
- **Why this fails:** the error route is inconsistent and its headline does not
  plainly say what happened.
- **Fix:** make the deployed 404 use the standard skeleton and metadata. Use
  `<h1>Page not found</h1>` and “Return to Color Signal Lens to open a
  screenshot.”

### Low

#### F-1-15 — README uses subjective adjectives instead of observable detail

- **Quotes/location:** “It opens a realistic code-diff screenshot.” and “shows
  a calm release-page fallback offline.”
- **Why this fails:** “realistic” and “calm” are judgments, not useful facts.
- **Fix:** write “It opens a sample checkout diff with added and removed totals.”
  and “If GitHub cannot be reached, the page links to the Releases page.”

## 2. Copy audit

Word counts treat hyphenated terms, paths, and versions as one word. No landing
or README sentence exceeds 22 words, and the average is below 14. The result
column links every non-length copy issue to a finding above.

### Landing page: every visible copy unit

This table includes navigation, headings, actions, facts, footer fragments, and
the meaningful image alt, in addition to grammatical sentences.

| Copy | Words | Result |
| --- | ---: | --- |
| Color Signal Lens | 3 | Pass |
| Demo | 1 | Pass |
| How it works | 3 | Pass copy; behavior fails F-1-3 |
| Privacy | 1 | Pass |
| PRIVATE DESKTOP UTILITY | 3 | Pass |
| Make status colors distinct. | 4 | Pass |
| For people who cannot rely on red and green during code reviews, charts, or status screens. | 16 | Pass |
| Try it with sample data | 5 | Pass copy; behavior fails F-1-1/F-1-2 |
| See a diff lens open with nothing saved. | 8 | F-1-1 |
| Works from a screenshot | 4 | Pass |
| Runs on your device | 4 | F-1-5: privacy scope is not fully tested |
| Lens Plus: $12 once | 4 | Pass |
| A paper-cut software panel viewed through a large circular lens with blue and orange status marks. | 16 | Pass |
| A SMALL, LOCAL LAYER | 4 | F-1-8 |
| Pick one signal. | 3 | F-1-8/F-1-9 |
| Make it readable. | 3 | F-1-8 |
| Open a screenshot, click a colour, then add labels, patterns, or a blue-orange remap. | 14 | F-1-9 |
| Open the sample diff | 4 | Pass |
| Removed | 1 | Pass |
| Added | 1 | Pass |
| HOW IT WORKS | 3 | Pass |
| Read the signal, not a global filter. | 7 | F-1-8/F-1-9 |
| Open a screenshot | 3 | Pass |
| Use a file, paste an image, or capture a screen only when you choose. | 14 | F-1-11 |
| Choose a colour | 3 | F-1-9 |
| Click the signal that is hard to read. | 8 | F-1-9 |
| The original image stays in place. | 6 | Pass |
| Add another cue | 3 | F-1-9 |
| Show a plain label, a pattern, or a blue-orange remap over that signal. | 13 | F-1-9 |
| WHAT IT DOES NOT DO | 5 | F-1-8 |
| It adds cues to the image you choose. | 8 | F-1-8 |
| It adds a temporary layer while you inspect one image. | 10 | F-1-8 |
| Read privacy details | 3 | Pass |
| LENS PLUS | 2 | Pass |
| Save custom lenses for $12 once. | 6 | Pass |
| The free lens includes screenshot reading, labels, patterns, and remapping. | 10 | Pass |
| Plus saves named presets. | 4 | Pass |
| Buy Lens Plus | 3 | Pass |
| Have a license? | 3 | F-1-10 |
| DESKTOP APP | 2 | Pass |
| Install the lens on your computer. | 6 | Pass |
| The current download matches your computer. | 6 | F-1-6 |
| Download Color.Signal.Lens_0.1.7_amd64.AppImage | 2 | Pass |
| Installers are unsigned. | 3 | F-1-6 |
| Your computer may ask you to confirm the app. | 9 | F-1-6 |
| Color Signal Lens makes screenshot status signals easier to read. | 10 | Pass |
| Privacy | 1 | Pass |
| Terms | 1 | Pass |
| Built by Param Factory | 4 | Pass |
| v0.1.7 | 1 | Pass |

Conditional landing states were also audited:

| Copy | Words | Result |
| --- | ---: | --- |
| Downloads are being published. | 4 | Pass |
| Open the release page. | 4 | Pass |
| See downloads | 2 | F-1-10 |
| Choose the macOS installer that matches your chip. | 8 | Pass |
| Download for Intel Mac | 4 | Pass |
| Download for Apple Silicon | 4 | Pass |
| Paste your license | 3 | Pass |
| Restore license | 2 | Pass |

### README: every heading and sentence

Code blocks contain commands rather than sentences and are not counted.

| Copy | Words | Result |
| --- | ---: | --- |
| Color Signal Lens | 3 | Pass |
| Make status colors distinct in screenshots. | 6 | Pass |
| This desktop utility is for people who cannot rely on red and green while reading software diffs, charts, or status panels. | 21 | Pass |
| It adds a label, a pattern, or blue-orange remapping to one selected colour without changing the rest of the screen. | 20 | F-1-9 |
| Try the isolated browser demo at `/demo`. | 7 | Pass for a cold direct URL |
| It opens a realistic code-diff screenshot. | 6 | F-1-15 |
| Nothing in demo mode is saved with real settings. | 9 | F-1-1 |
| Use it | 2 | Pass |
| Open a screenshot, paste an image, or choose Capture screen region in the installed desktop app, then select the region to add. | 22 | F-1-11 |
| Click a difficult colour signal, or set its colour with the keyboard field. | 13 | F-1-9/F-1-11 |
| Choose Label, Pattern, or Remap. | 5 | F-1-9 |
| The source image remains underneath. | 5 | F-1-9 |
| Clear lens restores the source image without an overlay. | 9 | Pass |
| Screen capture is requested only after the Capture button is pressed. | 11 | Pass |
| Only the region you select is added to the lens. | 10 | Pass |
| Opened images stay on the device. | 6 | F-1-5: test scope is narrow |
| Develop | 1 | Pass |
| The static deploy root is `dist/site`; its entry point is `dist/site/index.html`. | 11 | Pass |
| The desktop app uses Tauri 2 and its configuration is in `src-tauri/`. | 12 | Pass for developer documentation |
| Install and releases | 3 | Pass |
| Release builds run on tags such as `v0.1.7` through `.github/workflows/release.yml`. | 10 | F-1-6 |
| The workflow creates unsigned macOS, Windows, and Linux artifacts plus checksums. | 11 | F-1-6 |
| The landing site uses the GitHub API for release links, offers both Mac chip choices, and shows a calm release-page fallback offline. | 22 | F-1-15 |
| The Linux script verifies the AppImage and installs it as `~/.local/bin/color-signal-lens`. | 11 | Pass |
| The macOS script chooses the matching Intel or Apple-Silicon DMG, saves it in Downloads, and opens it. | 17 | F-1-6 |
| The Windows script verifies and starts the installer. | 8 | F-1-6 |
| Unsigned apps may require a right-click → Open confirmation on macOS or a Windows confirmation. | 15 | F-1-6 |
| Lens Plus | 2 | Pass |
| The free app includes the core reading controls. | 8 | Pass |
| Lens Plus costs $12 once. | 5 | Pass |
| It adds named presets you can save, apply, rename, and delete. | 11 | Pass |
| The hosted Sociobot checkout returns a license token. | 8 | F-1-7 |
| It is stored locally and checked no more than once per day when online. | 14 | Pass |
| Restore a purchase by pasting the license on the landing page. | 11 | Pass |
| Privacy and terms | 3 | Pass |
| Read `/privacy` for local storage and screen-permission details. | 8 | Pass |
| Read `/terms` for the product limits and purchase terms. | 9 | Pass |
| No analytics or third-party runtime scripts are used. | 8 | F-1-5 |
| License | 1 | Pass |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

## 3. Demo and sandbox evidence

The direct cold `/demo` route passes its narrow checks: it immediately loads
`checkout-totals.diff.png` at 1200×720, shows the demo banner, displays a
working pattern, Reset restores the sample, direct-demo requests are
same-origin, and changing cues continues to work after the context is set
offline. A seeded real preset value remains unchanged on this direct route.

The required one-click route fails F-1-1 and F-1-2. This distinction explains
why the current suite is green.

## 4. Claims gate

I ran every command exactly as listed in `.factory/claims.json` after
`npm ci`, from the supplied clean candidate. All commands exited 0:

| Claim id | Listed command | Result |
| --- | --- | --- |
| `sample-lens` | `npm test -- --grep @claim:sample-lens` | PASS |
| `local-screenshots` | `npm test -- --grep @claim:local-screenshots` | PASS |
| `reading-cues` | `npm test -- --grep @claim:reading-cues` | PASS |
| `demo-reset` | `npm test -- --grep @claim:demo-reset` | PASS |
| `screenshot-input` | `npm test -- --grep @claim:screenshot-input` | PASS |
| `capture-consent` | `npm test -- --grep @claim:capture-consent` | PASS |
| `named-presets` | `npm test -- --grep @claim:named-presets` | PASS |
| `license-entitlement` | `npm test -- --grep @claim:license-entitlement` | PASS |
| `lens-plus-price` | `npm test -- --grep @claim:lens-plus-price` | PASS |
| `installer-checksums` | `npm run test:unit -- --test-name-pattern=@claim:installer-checksums` | PASS |
| `desktop-release` | `npm run test:unit -- --test-name-pattern=@claim:desktop-release` | PASS |
| `macos-installer-architecture` | `npm test -- --grep @claim:macos-installer-architecture` | PASS |
| `macos-shell-installer-architecture` | `npm run test:unit -- --test-name-pattern=@claim:macos-shell-installer-architecture` | PASS |
| `clear-lens` | `npm test -- --grep @claim:clear-lens` | PASS |
| `license-daily-cache` | `npm test -- --grep @claim:license-daily-cache` | PASS |
| `license-restore` | `npm test -- --grep @claim:license-restore` | PASS |
| `release-fallback` | `npm test -- --grep @claim:release-fallback` | PASS |
| `sociobot-checkout-path` | `npm test -- --grep @claim:sociobot-checkout-path` | PASS |

No listed command fails. F-1-4 identifies a listed test whose setup does not
exercise its quoted journey. F-1-5, F-1-6, F-1-7, and F-1-11 identify
claim-like copy that lacks complete claim inventory/test coverage.

## 5. History audit

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files.
The existing `.factory/handoff.md` says “one click enters a real isolated
sample demo”; that statement is contradicted by F-1-1 and must not remain a
PASS assertion.

For additional regression safety, I also checked the defects recorded in the
repository's earlier verification files. The prior release completeness,
selected-region capture, `/lens` deep link, landing console, touch size,
invalid-image recovery, immutable asset caching, Mac architecture choice,
HTTP 404 status, license entitlement, pixel selection, checkout, installer,
preset CRUD, keyboard file input, mobile overflow, Clear lens, focus styling,
capture error, and claim-test-strength repairs remain fixed. Evidence includes
the full green suite, live route/console/overflow/axe checks, a 200 checkout,
the complete `v0.1.7` asset list, and immutable live hashed assets.

## 6. Structure, accessibility, links, and identity

Passing checks:

- `/`, `/demo`, `/lens`, `/privacy`, and `/terms` return 200 and have one
  `<h1>`, a route-specific title, header, main, and footer.
- `/missing-review-route` returns a real HTTP 404.
- All extracted internal and external links returned 200 after redirects.
- Mobile and desktop had zero horizontal overflow and no normal-route console
  errors.
- Axe found zero serious or critical issues on every tested route at 390 and
  1440 px. Reduced-motion CSS is present.
- The paper-cut palette, uneven edges, editorial type, original illustration,
  and blue/orange status vocabulary form a distinct product identity rather
  than a generic SaaS template.
- `robots.txt`, favicon, apple-touch icon, security headers, and live immutable
  hashed-asset caching are present.

The structural failures are recorded above as F-1-3, F-1-13, and F-1-14.

## 7. Missed leverage

No additional AI, sync, or import feature is justified. The brief calls for a
small local screenshot-reading utility; model inference would add privacy,
network, and cost without improving deterministic color selection. The app
already supports file open, paste, and selected-region capture. Export is not
an obvious omission because the product explicitly presents a temporary
inspection layer rather than an editor. F-1-12 is the missed explanatory
leverage implied by the desktop artifact class.

## What would make this perfect

Fix the one-click demo state boundary and add a regression that begins at the
real CTA. Put the transformed sample and active cue in the first mobile
viewport. Repair the hash navigation. Replace metaphor and mixed terminology
with concrete section names, complete the claim inventory, add the desktop
screenshot walkthrough, and finish route-specific metadata plus the shared
404 skeleton. Then rerun this entire review from a fresh context; no finding
can be waived by the currently green suite.
