# Adversarial first-read review 4 — Color Signal Lens

Date: 2026-08-29  
Live site: <https://color-signal-lens.sociobot.in>  
Reviewed commit: `defdea6a639689693ac196f475c4bfe24a852ca3`

## Verdict: FAIL

The cold first screen is clear at 390 × 844 and 1440 × 900. The one-click sample visibly opens with a transformed checkout screenshot, an active cue, and the required demo banner. All 23 declared claim commands passed from a clean clone, as did the complete 52-test suite, type check, and build.

Two findings remain. One is blocking: the live landing-to-demo journey writes a non-demo local-storage key after the banner promises that nothing is saved. The claim test masks that request, so it does not prove the production journey. The second is an unlisted, misleading fallback claim.

## 1. Cold first read before scrolling

### 390 × 844

- **What it does:** marks screenshot status colors with patterns, labels, or blue-orange colors so red and green are distinguishable.
- **For whom:** people who cannot rely on red and green while reading code reviews, charts, or status screens.
- **First click:** **Try it with sample data**. The adjacent copy says that a sample screenshot with an overlay will open and nothing will be saved.

The supporting first-screen copy is: “Make status colors distinct.”, “For people who cannot rely on red and green during code reviews, charts, or status screens.”, “Try it with sample data”, and “See a sample screenshot with an overlay. Nothing is saved.” The three privacy/offline/price facts are also visible before scrolling. The same answers are visible at 1440 × 900.

## 2. Findings

### Blocking

#### F-4-1 — The live one-click demo writes non-demo local storage

- **Quote/location:** landing action **Try it with sample data** and demo banner “Demo — sample data, nothing is saved”.
- **Observed:** In a fresh 390px browser context, I delayed the live GitHub release response, opened `/`, clicked the primary action, then released the response while `/demo` and its banner were visible. Before the click, `localStorage` was `{}`. Afterwards it contained both `demo:color-signal-lens:started` and the non-demo key `color-signal-lens:release`. Reset demo does not remove that real key. The live request trace includes `https://api.github.com/repos/B-Divyesh/sf-color-signal-lens/releases?per_page=1`.
- **Code confirmation:** `renderLanding()` starts `hydrateDownload()` in `src/main.ts`; `hydrateDownload()` writes the unprefixed `color-signal-lens:release` key at lines 483–497. Its in-flight request is not cancelled or namespaced when navigation reaches `renderDemo()`. `@claim:sample-lens` routes that request to an empty fixture before taking its storage baseline, so it cannot expose the production write.
- **Why this blocks:** Demo mode must not persist anything to real storage. The exact first action ends on a banner that says “nothing is saved”, but a real namespace is written after the visitor has entered demo mode. The existing sandbox test passes by avoiding the live response, not by proving isolation.
- **Concrete fix:** Do not fetch or write release metadata while entering demo; abort the landing lookup on navigation and/or keep its cache in a `demo:` namespace until the visitor starts for real. Update `@claim:sample-lens` or add a dedicated tagged demo-isolation test that delays a non-empty release response, clicks the real landing CTA, then asserts every non-`demo:` key remains byte-for-byte unchanged through reset and exit.

### Medium

#### F-4-2 — The release fallback makes an unlisted availability claim

- **Quote/location:** landing install section fallback: “Downloads are being published.”
- **Observed:** This text is the shipped initial/failure state. It remains when `hydrateDownload()` cannot retrieve GitHub metadata, while its link still points to the Releases page. No entry in `.factory/claims.json` claims or tests that downloads are currently being published.
- **Why this matters:** It tells a visitor a specific release state that the app has not established. In the failure case the Releases page can already contain a usable installer, so the sentence can delay the real next step.
- **Concrete fix:** Replace it with “Choose a download from the Releases page.” and retain the **Open release downloads** action; alternatively add a listed, observable release-availability claim and test it against the release metadata contract.

## 3. Copy audit

Counts split on spaces. Commands are excluded. I checked the deployed landing copy and README against the plain-words rules, then cross-checked the source and `.factory/copy-audit.md`. No listed sentence exceeds 22 words. I found no banned marketing adjective, metaphor/mood heading, inconsistent visitor term, or non-result-naming action. The one claim-coverage exception is F-4-2.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Private desktop utility | 3 | Clear context label |
| Make status colors distinct. | 4 | Clear job headline |
| For people who cannot rely on red and green during code reviews, charts, or status screens. | 16 | Clear audience |
| Try it with sample data | 5 | Result-naming action |
| See a sample screenshot with an overlay. | 7 | `sample-lens` |
| Nothing is saved. | 3 | F-4-1 |
| Screenshots are not uploaded | 4 | `local-screenshots` |
| Free reader works offline after install | 6 | `offline-reader` |
| Lens Plus: $12 once | 4 | `lens-plus-price` |
| Preview the screenshot changes. | 4 | Clear section heading |
| Open a screenshot, choose a status color, then add a label, pattern, or blue-orange colors. | 15 | Input and `reading-cues` claims |
| Open the sample screenshot | 4 | Result-naming action |
| How Color Signal Lens works | 5 | Clear section heading |
| Open a screenshot | 3 | Clear step heading |
| Open a file, paste an image, or capture a screen region when you choose. | 14 | Input claims |
| Choose a status color | 4 | Clear step heading |
| Click the color that is hard to tell apart. | 9 | Clear instruction |
| Choose a reading cue | 4 | Clear step heading |
| Add a label, a pattern, or blue-orange colors over that status color. | 12 | `reading-cues` |
| It changes neither the screenshot nor your display. | 8 | `privacy-limits` |
| It processes only the image you open. | 7 | `privacy-limits` |
| It does not filter your whole display. | 7 | `privacy-limits` |
| Read privacy details | 3 | Result-naming action |
| Save named presets for $12 once. | 6 | Price/preset claims |
| The free app includes screenshot reading, labels, patterns, and blue-orange colors. | 11 | Product scope |
| Lens Plus saves named presets. | 5 | `named-presets` |
| Buy Lens Plus | 3 | Result-naming action |
| Restore license | 2 | Result-naming action |
| Install Color Signal Lens. | 3 | Clear section heading |
| Downloads are being published. | 4 | F-4-2 |
| Open the release downloads | 4 | Result-naming action |
| Download the Linux installer. | 4 | `desktop-download-platforms` |
| Download for Linux | 3 | Result-naming action |
| Color Signal Lens makes screenshot status colors easier to read. | 10 | Clear footer description |

Conditional landing copy was also checked: “Downloads require macOS, Windows, or Linux.” (6), “Open desktop downloads” (3), “Download the Windows installer.” (4), “Download for Windows” (3), “Choose the macOS installer that matches your chip.” (8), “Download for Intel Mac” (4), “Download for Apple Silicon” (4), “Paste your license” (3), “Checking the license.” (3), “License is active.” (3), “This license is no longer active. You can buy Lens Plus again.” (11), “License check is offline. The last active check is in use.” (11), and “The license could not be checked. Connect to the internet and try again.” (13). They are within the cap, use consistent terms, and map to the existing platform or license claims.

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Make screenshot status colors distinct. | 5 | Clear job |
| It is for people who cannot rely on red and green in software diffs, charts, or status panels. | 18 | Clear audience |
| Try the sample at https://color-signal-lens.sociobot.in/demo. | 5 | Direct demo URL |
| It opens a checkout diff with added and removed totals. | 10 | `sample-lens` |
| Demo changes stay separate and never change your settings. | 9 | `demo-isolation`; F-4-1 exposes incomplete isolation |
| Open a screenshot, paste an image, or capture a screen region. | 11 | Input claims |
| Click a status color, or set a color with the keyboard color field. | 13 | `keyboard-color-input` |
| Add a label, a pattern, or blue-orange colors. | 8 | `reading-cues` |
| Clear overlay restores the original screenshot. | 6 | `clear-overlay` |
| Screen capture is requested only after you press Capture screen region. | 11 | `capture-consent` |
| Only the region you select is added. | 7 | `capture-consent` |
| Screenshot data stays in the app. | 6 | `local-screenshots` |
| The static deploy root is `dist/site`. | 6 | Developer documentation |
| The Tauri 2 configuration is in `src-tauri/`. | 7 | Developer documentation |
| Tags trigger `.github/workflows/release.yml`, which checks for macOS, Windows, Linux, `SHA256SUMS`, and `latest.json` assets before publishing a release. | 17 | `desktop-release` |
| The Linux script verifies SHA-256 and installs the AppImage as `~/.local/bin/color-signal-lens`. | 11 | `installer-checksums` |
| If GitHub metadata cannot be reached, the landing page links to the Releases page. | 14 | `release-fallback` |
| The free app includes all reading controls. | 7 | Product scope |
| Lens Plus costs $12 as a one-time purchase and saves named presets on this device. | 15 | Price/preset claims |
| The purchase action uses the Sociobot checkout path. | 8 | `sociobot-checkout-path` |
| Restore a purchase by pasting its license on the landing page. | 11 | `license-restore` |
| The free screenshot reader works offline after the installed desktop app has loaded. | 12 | `offline-reader` |
| The browser sample is for trying the app before installation. | 10 | Clear scope |
| Read <https://color-signal-lens.sociobot.in/privacy> for screenshot processing, local storage, and screen permission details. | 8 | Result-naming route |
| Read <https://color-signal-lens.sociobot.in/terms> for product limits and purchase terms. | 7 | Result-naming route |
| The app has no analytics and loads no third-party runtime scripts. | 11 | `local-screenshots` |
| MIT. See [LICENSE](LICENSE). | 3 | Clear license |

Visitor terms are consistent: **screenshot**, **status color**, **overlay**, **label**, **pattern**, **blue-orange colors**, **preset**, **demo**, and **app**.

## 4. Demo, claims, privacy, and history

- The live CTA reaches `/demo` in one click at both tested viewports. The initial screen contains the banner, an active cue, and the transformed checkout screenshot (canvas bottom: 619px in an 844px mobile viewport). Reset restores the sample and Start for real opens `/lens` with no sample. F-4-1 prevents this from satisfying the storage-isolation contract.
- Direct `/demo` uses `demo:` keys; direct sample changes, reset, and exit do not alter the real license or preset namespace. This confirms that the earlier paid-preset leak (F-1-1) is fixed, but does not excuse F-4-1.
- In a clean clone at `/tmp/color-signal-lens-review4.EI3utw`, `npm ci` and every command in `.factory/claims.json` passed separately (23/23). `CI=1 npm test` passed (6 unit + 52 Playwright), as did `npm run check` and `npm run build`. The site bundle is 31.68 kB raw / 10.62 kB gzip.
- The privacy request test allows the declared GitHub release lookup and found no screenshot upload, third-party runtime script, analytics request, or unexpected external request during file, paste, and selected-region capture. The live trace for F-4-1 is the exception relevant to demo storage, not an upload.
- Earlier findings F-1-1 through F-1-15, F-2-1 through F-2-4, and F-3-1 were rechecked on the live site and in source. The mobile demo result is above the fold; paid controls stay hidden in demo; platform downloads exclude phones; price uses the recorded contract fixture; terms are consistent; walkthrough frames are present; metadata, legal routes, 404, and release fallback work; and **How it works** now focuses and announces “How Color Signal Lens works” after navigation. None of those earlier findings reopens.

## 5. Structure and visual checks

- `/`, `/demo`, `/lens`, `/privacy`, and `/terms` return 200 with their own plain title, description, canonical URL, social image, one h1, one main, and no console/page error. The deployed 404 returns HTTP 404 with the shared shell and recovery link. The expected browser console message for that 404 main-document response is not an application error.
- `/robots.txt`, `/sitemap.xml`, favicon, Apple touch icon, social card, all same-origin navigation links, the hosted Sociobot checkout, and the current Linux release asset resolved successfully. Header/footer, skip link, back/forward focus, and `/#how` focus/announcement work.
- The paper-cut diorama has a distinct product identity and matches `.factory/design.md`; it is not a generic SaaS hero. Reduced-motion CSS, 44px targets, focus treatment, and the existing desktop/mobile axe scans passed. No AI step is missing: the brief calls for deterministic local image treatment, and an AI feature would not improve the core job.

## What would make this perfect

Remove the real release-cache write from the demo entry journey, prove that exact delayed-response path in the claim suite, and replace the unverified download-publishing fallback sentence. After that, rerun the clean-clone claim commands and the full browser suite against the deployed behavior.

