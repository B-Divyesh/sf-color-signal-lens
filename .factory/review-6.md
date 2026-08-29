# Adversarial first-read review 6 — Color Signal Lens

Date: 2026-08-29  
Live site: <https://color-signal-lens.sociobot.in>  
Reviewed repository commit: `8eddbd240bf88a562a20cbd3a80cb742a1df33bd`

## Verdict: FAIL

There is one minor finding, so this is not a PASS. The live app is clear and
tryable, all 27 declared claim commands pass from a clean clone, and the demo
does not alter real settings. Its sandbox documentation and Privacy page make
an exact reset promise that the current code does not meet: Reset leaves the
`demo:color-signal-lens:started` key in browser storage. The key is harmless
to real data, but “every key” / “those keys” is false and untested.

## 1. Cold first read

I used new browser contexts at 390×844 (iPhone UA) and 1440×900, without
scrolling.

| Question | Answer from first screen |
| --- | --- |
| What does it do? | It makes red and green status colors in a screenshot distinct with labels, patterns, or blue-orange colors. |
| For whom? | People reading code reviews, charts, or status screens who cannot rely on red and green. |
| What should I click first? | **Try it with sample data**, which says it will open a sample screenshot with an overlay and save nothing. |

The supplying text is “Make status colors distinct.”, “For people who cannot
rely on red and green during code reviews, charts, or status screens.”, and
“Try it with sample data / See a sample screenshot with an overlay. Nothing
is saved.” All are visible above the phone fold, along with the three facts:
screenshots are not uploaded, the reader works offline after installation, and
Lens Plus is $12 once. No first-screen clarity blocker was found.

## 2. Finding

### Minor

#### F-6-1 — Reset documentation says it deletes every demo key, but it leaves the demo-start key

- **Exact quote/location:** `.factory/demo.md`: “**Reset demo** restores the
  sample and removes every `demo:color-signal-lens:*` key.” Live `/privacy`:
  “Reset demo deletes those keys.”
- **Observed:** from a fresh phone context, the demo stores
  `demo:color-signal-lens:started`. Pressing **Reset demo** leaves that key.
  The handler at `src/main.ts:173` removes it, then calls `renderDemo()`, which
  immediately recreates it at `src/main.ts:95`.
- **Why this matters:** a visitor or verifier checking the stated storage
  boundary receives a literal, untrue guarantee. The marker does not touch
  real storage, so this is not a demo-isolation failure; it is a false reset
  and documentation claim with no matching claim test.
- **Concrete fix:** change both sentences to “Reset demo restores the shipped
  sample and clears saved demo settings,” or change Reset so no `demo:` key
  remains. If the stronger deletion promise remains, add a claim test that
  asserts no `demo:color-signal-lens:*` key after Reset.

## 3. Copy audit

Counts split on whitespace. The table lists each prose sentence visible on the
landing page and each README sentence; headings, labels, alt text, and actions
are checked separately below. No listed sentence exceeds 22 words. No landing
or README prose finding was found.

### Landing-page sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Make status colors distinct. | 4 | Pass |
| For people who cannot rely on red and green during code reviews, charts, or status screens. | 16 | Pass |
| See a sample screenshot with an overlay. | 7 | Pass |
| Nothing is saved. | 3 | Pass; `sample-lens`, `demo-isolation` |
| Preview the screenshot changes. | 4 | Pass |
| Open a screenshot, choose a status color, then add a label, pattern, or blue-orange colors. | 15 | Pass |
| Open a file, paste an image, or capture a screen region when you choose. | 14 | Pass |
| Click the color that is hard to tell apart. | 9 | Pass |
| Add a label, a pattern, or blue-orange colors over that status color. | 12 | Pass |
| It changes neither the screenshot nor your display. | 8 | Pass; `privacy-limits` |
| It processes only the image you open. | 7 | Pass; `local-screenshots` |
| It does not filter your whole display. | 7 | Pass; `privacy-limits` |
| Save named presets for $12 once. | 6 | Pass; `lens-plus-price` |
| The free app includes screenshot reading, labels, patterns, and blue-orange colors. | 11 | Pass; `reading-cues` |
| Lens Plus saves named presets. | 5 | Pass; `named-presets` |
| Sociobot/Dodo is the merchant of record. | 6 | Pass; `merchant-of-record` |
| It processes the payment and handles refunds. | 7 | Pass; `merchant-of-record` |
| A refund removes access to saved presets. | 7 | Pass; `refund-revocation` |
| Install Color Signal Lens. | 4 | Pass |
| Download the Linux installer. | 4 | Pass; `desktop-download-platforms` |
| Color Signal Lens makes screenshot status colors easier to read. | 10 | Pass |

### README sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Make screenshot status colors distinct. | 5 | Pass |
| It is for people who cannot rely on red and green in software diffs, charts, or status panels. | 18 | Pass |
| Try the sample at https://color-signal-lens.sociobot.in/demo. | 5 | Pass |
| It opens a checkout diff with added and removed totals. | 10 | Pass; `sample-lens` |
| Demo changes stay separate and never change your settings. | 9 | Pass; `demo-isolation` |
| Open a screenshot, paste an image, or capture a screen region. | 11 | Pass |
| Click a status color, or set a color with the keyboard color field. | 13 | Pass; `keyboard-color-input` |
| Add a label, a pattern, or blue-orange colors. | 8 | Pass; `reading-cues` |
| Clear overlay restores the original screenshot. | 6 | Pass; `clear-overlay` |
| Screen capture is requested only after you press Capture screen region. | 11 | Pass; `capture-consent` |
| Only the region you select is added. | 7 | Pass; `capture-consent` |
| Screenshot data stays in the app. | 6 | Pass; `local-screenshots` |
| The static deploy root is dist/site. | 6 | Pass |
| The Tauri 2 configuration is in src-tauri/. | 7 | Pass |
| Tags trigger .github/workflows/release.yml, which checks for macOS, Windows, Linux, SHA256SUMS, and latest.json assets before publishing a release. | 17 | Pass; `desktop-release` |
| The Linux script verifies SHA-256 and installs the AppImage as ~/.local/bin/color-signal-lens. | 11 | Pass; `installer-checksums` |
| If GitHub metadata cannot be reached, the landing page links to the Releases page. | 14 | Pass; `release-fallback` |
| The free app includes all reading controls. | 7 | Pass |
| Lens Plus costs $12 as a one-time purchase and saves named presets on this device. | 15 | Pass; price and presets claims |
| Buy Lens Plus opens Sociobot's payment page. | 7 | Pass; `sociobot-checkout-path` |
| Buy and restore a license inside the desktop app or on the landing page. | 14 | Pass; desktop and restore claims |
| Sociobot/Dodo is the merchant of record. | 6 | Pass; `merchant-of-record` |
| It processes the payment and handles refunds. | 7 | Pass; `merchant-of-record` |
| A refund removes access to saved presets. | 7 | Pass; `refund-revocation` |
| The free screenshot reader works offline after the installed desktop app has loaded. | 13 | Pass; `offline-reader` |
| The browser sample is for trying the app before installation. | 10 | Pass |
| Read https://color-signal-lens.sociobot.in/privacy for screenshot processing, local storage, and screen permission details. | 11 | Pass |
| Read https://color-signal-lens.sociobot.in/terms for product limits and purchase terms. | 8 | Pass |
| The app has no analytics and loads no code from other websites. | 12 | Pass; `local-screenshots` |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

Headings such as **How Color Signal Lens works**, **Privacy and limits**,
**Lens Plus**, **Use Color Signal Lens**, and **Install and releases** name
their sections. Result-naming actions include **Try it with sample data**,
**Open screenshot**, **Capture screen region**, **Clear overlay**, **Buy Lens
Plus**, **Restore license**, and platform download actions. The 189-row
repository audit is current and mechanically tested. No jargon, marketing
adjective, metaphor heading, inconsistent term, or overlong sentence finding
was found in landing or README copy.

## 4. Demo, isolation, privacy, and claims

- The home CTA enters `/demo` in one click. At 390×844 the persistent banner,
  “Active cue: Pattern for the removed status color.”, and the full 330×198
  transformed canvas (y=421–619) are visible before scrolling.
- The banner is present and offers **Reset demo** and **Start for real**. Reset
  restores the shipped checkout-diff sample. Start for real reaches `/lens`
  with no screenshot loaded.
- A live storage comparison showed the pre-existing real release cache exactly
  unchanged after entry, Reset, and Start for real. Demo operations use the
  separate `demo:` namespace; paid controls are absent in demo. F-6-1 is the
  only observed exception to the stated *complete demo-key deletion* wording.
- The live request log for home → demo contained only the product origin and
  `https://api.github.com` (the declared installer-release lookup). The
  sandbox request test additionally exercises public routes, file input,
  paste, and capture; it passed, confirming no screenshot upload, analytics,
  or third-party runtime code.
- `.factory/claims.json` contains 27 claims. From a new clone at the reviewed
  commit, `npm ci` succeeded and every exact declared command passed:
  24 Playwright claim commands plus the three unit commands for desktop
  release, installer checksum, and macOS architecture. `CI=1 npm test` also
  passed (6 unit tests and 58 Playwright tests). `npm run check` and
  `npm run build` passed; the build produced `dist/app` and `dist/site`.
- Every claim-like landing and README sentence maps to the inventory. The
  newly added merchant, refund, and revoked-license claims have their own
  fixture-backed behavioral tests.

## 5. History audit

I read every `review-*.md`, `polish-*.md`, and handoff. The following checks
were made against the live deployment and present source, not the prior status
labels.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | Fixed: route-derived demo state, `demo:` persistence, hidden paid controls, and isolation claims pass. |
| F-1-2 | Fixed: banner, active cue, and full canvas are above the phone fold. |
| F-1-3 / F-3-1 | Fixed: `/#how` scrolls, focuses, announces, and Back restores focus; covered by regressions. |
| F-1-4 / F-2-1 / F-4-1 | Fixed: landing CTA test proves transformed sample and real-storage equality through delayed lookup, Reset, and exit. |
| F-1-5 | Fixed: request-origin/privacy test covers routes, scripts, file, paste, and capture. |
| F-1-6 / F-2-2 | Fixed: phone receives desktop requirements, matching desktop installers are selected, and offline fact is above fold. |
| F-1-7 / F-5-1 | Fixed: merchant, refund handling, and revoked access now have separate declared behavioral claims. |
| F-1-8 | Fixed: headings name screenshot preview, workflow, privacy/limits, presets, and installation. |
| F-1-9 | Fixed: screenshot, status color, overlay, label, pattern, blue-orange colors, preset, demo, and app are consistent. |
| F-1-10 | Fixed: visitor actions state their result. |
| F-1-11 | Fixed: paste and keyboard color setting are declared, observable claims. |
| F-1-12 | Fixed: three captioned, original workflow screenshots remain on the landing page. |
| F-1-13 | Fixed: all reviewed routes have route titles, description, canonical, OG/Twitter data, favicon, and shared shell. |
| F-1-14 | Fixed: an unknown live path returned HTTP 404 with the designed shared header, footer, legal links, and recovery action. |
| F-1-15 | Fixed: README sample and release-fallback wording is concrete. |
| F-2-3 | Fixed: README links directly to `/demo` and describes the realistic checkout-diff sample. |
| F-2-4 / F-5-2 | Fixed: the current audit has correct counts and automated completeness/count tests. |
| F-4-2 | Fixed: fallback directs to Releases without claiming an unpublished download is available. |
| F-5-3 | Fixed: “Buy Lens Plus opens Sociobot's payment page” replaced implementation jargon. |
| F-5-4 | Fixed: README says “loads no code from other websites.” |
| F-5-5 | Fixed: README heading is **Use Color Signal Lens**. |

No historical finding is reopened. F-6-1 is new and narrower: it concerns the
remaining demo-start marker and the inaccurate promise about deleting *every*
demo key.

## 6. Structure, accessibility, links, and identity

- `/`, `/demo`, `/lens`, `/privacy`, and `/terms` returned 200; an unknown
  route returned 404. Each route has exactly one h1 and main, `lang=en`, a
  route-specific title/description/canonical, OG image, favicon, and the
  consistent header/footer with Privacy and Terms.
- The rendered landing links (including demo, privacy, terms, checkout, and
  the Linux installer) all returned 200 after redirects. `robots.txt` and
  `sitemap.xml` are shipped. No console errors occurred during reviewed flows.
- The test suite covers keyboard operation, skip link, focus management,
  reduced motion, target sizes, phone layout, and axe serious/critical checks.
  The live phone and desktop review found no overflow or console errors.
- The paper-cut diorama has an original generated hero asset, ink/cream/orange/
  blue palette, editorial display type, irregular cut edges, and motion policy
  documented in `.factory/design.md`. It is product-specific rather than a
  generic SaaS template.

## 7. Missed leverage

No missing AI, import/export, or sync feature is implied by the brief. The
brief calls for a private, deterministic per-screenshot reading lens. The app
already accepts files, paste, and a selected screen region, then provides
labels, patterns, blue-orange remapping, clear/reset, and optional local
presets. Adding an AI action would add disclosure and network cost without
improving the stated task.

## What would make this perfect

Resolve F-6-1 by making Reset's text match its retained demo-start marker, or
by deleting that marker and adding a regression test for the stronger promise.
Then rerun the 27 claim commands and the complete review. Nothing else was
found in this round.
