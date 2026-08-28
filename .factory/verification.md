# Independent verification — FAIL

**Candidate:** `5dc4c99e50e4e708373dd58ddffeaecc384d0b41`
**Live URL:** https://color-signal-lens.sociobot.in
**Verified:** 2026-08-28, from a clean `npm ci` checkout

## First read

Cold-loading the live home page makes the product, audience, and first action
plain: it is a screenshot lens that makes status colours distinct, for people
who cannot rely on red and green in code reviews, charts, or status screens;
click **Try it with sample data** to open a diff lens with nothing saved. This
first-read and one-click-demo requirement passes.

The cold load did, however, emit a browser console error: `Failed to load
resource: the server responded with a status of 404` for
`https://api.github.com/repos/B-Divyesh/sf-color-signal-lens/releases/latest`.

## Required claim tests (run first)

All commands in `.factory/claims.json` were run verbatim after `npm ci`. Each
passed (each command also reruns the three unit tests).

| Claim | Exact command | Result |
| --- | --- | --- |
| sample-lens | `npm test -- --grep @claim:sample-lens` | PASS — 1 Playwright test |
| local-screenshots | `npm test -- --grep @claim:local-screenshots` | PASS — 1 Playwright test |
| reading-cues | `npm test -- --grep @claim:reading-cues` | PASS — 1 Playwright test |
| demo-reset | `npm test -- --grep @claim:demo-reset` | PASS — 1 Playwright test |

Independent browser confirmation also showed demo reset preserves a seeded
`color-signal-lens:presets` real-storage marker and recreates only
`demo:color-signal-lens:started`.

## Checks performed

- `npm ci`: PASS (0 reported vulnerabilities).
- `npm test`: PASS — 3 unit tests and 5 Playwright tests, including axe.
- `npm run check`: PASS.
- `npm run build`: PASS. Site initial JS is 20,225 bytes / 7.14 KB gzip; CSS is
  10,062 bytes / 3.13 KB gzip; hero WebP is 50,718 bytes.
- The standard `npm run tauri build` fails in this clean worker because its
  `CI=1` is passed to Tauri 2.11.4 as an invalid boolean (`invalid value '1'
  for '--ci'`). Retrying with `CI=true` and the Linux packages used by the
  release workflow was started; native compilation was still in progress at
  report-writing time, so no native artifact is claimed as verified.
- Live deployment matches the candidate web build: the live home page serves
  `assets/index-BLeucTCv.js`, exactly the filename and 20,225-byte content size
  emitted by `npm run build:site` at this commit.
- Desktop and 390px mobile `/demo`: normal sample, labels, patterns, blue and
  orange remapping, reset, and browser capture recovery exercised. No
  horizontal overflow. Keyboard tab sequence reaches all controls and uses a
  visible solid focus outline. `prefers-reduced-motion: reduce` has no active
  animations.
- axe-core Playwright scans on live desktop and 390px demo: 0 serious/critical
  findings. This does not exempt the manual target-size failure below.
- A corrupt nominal PNG has no error state: the UI reports `corrupt.png` while
  retaining the prior sample canvas. Loading the sample manually recovers.
- Privacy/network: the demo made no cross-origin screenshot requests; its only
  image is an in-memory data URL. The paid license verification endpoint
  returned `200 {"valid":false,"reason":"invalid"}` for an invalid token.
  A 50-request concurrent invalid-token burst yielded 30 × 200 and 20 × 429,
  with `Retry-After: 4`; limiting started at approximately request 31.
- Response policy: live HTTPS sends HSTS, `nosniff`, strict referrer policy,
  and a restrictive CSP matching the GitHub and Sociobot connections. Routes
  `/`, `/demo`, `/privacy`, `/terms`, robots and sitemap return 200. Hashed JS
  and CSS are cached only `public, must-revalidate, max-age=30`, not immutable
  long-term assets.
- No PWA/service worker applies. There is no product backend or sign-in flow.

## Release-blocking defects

### Critical — no installable desktop release

The product is contracted as a desktop app. The GitHub latest-release API is
404, `git ls-remote --tags origin 'v*'` returned no tag, and the live page
shows “Downloads are being published.” There are no macOS, Windows, or Linux
artifacts, no `SHA256SUMS`, and no `latest.json` to download and verify. The
one-line installer consequently exits with “A matching download is not
published yet.” This fails the desktop release acceptance requirement and is
also the cause of the live console error.

### High — capture scope contradicts the product and privacy contract

The only native capture command is `capture_primary_screen`, implemented with
`screenshots::Screen::all().first().capture()`. It captures the entire primary
display, not a user-selected region, despite the button saying “Capture screen
region.” The brief requires a selected-region lens and transparent, on-demand
screen permission. A whole-display capture is materially broader than the
advertised/required scope.

### High — “Start for real” URL cannot be reloaded

Clicking **Start for real** changes history to `/lens` and shows the workspace
only in the existing SPA session. A cold navigation or reload of
`https://color-signal-lens.sociobot.in/lens` renders “This paper layer is
missing.” This violates real-URL/deep-link behavior and makes the real
workspace non-resumable.

### High — production home page has a console error

Every fresh live landing-page load fetches the nonexistent GitHub latest
release and logs its 404 as a console error. The fallback text is calm, but it
does not satisfy the no-console-errors requirement.

### Medium — mobile/touch targets do not meet the 44px contract

At 390px, header links are 39×19, 88×19, and 50×19 px; the demo banner buttons
are 103×32 and 113×32 px; radio controls are 13×13 px; several footer/inline
links are 15–16px high. The visual thesis says controls are at least 44px;
the acceptance accessibility requirement requires 44px touch targets.

### Medium — invalid screenshot input gives a false success state

The supplied file chooser accepts a corrupt `image/png` with no `Image.onerror`
handling. Source status changes to `corrupt.png`, no error is announced, and
the old sample remains displayed. This is an invalid-input recovery failure.

### Low — hashed assets are not immutably cached

Live hashed JS and CSS carry `max-age=30` rather than the required long-lived
immutable cache policy for hashed assets.

## Verdict

**FAIL.** The web demo and all listed claim tests pass, and the deployed web
bundle matches the candidate, but an installable desktop product is not
published, the landing page logs an error, native capture exceeds the selected
region scope, and the real-workspace URL is broken on reload.
