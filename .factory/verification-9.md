# Independent verification 9 — FAIL

**Candidate:** `010c3a259cbb8b865f33009b6e2f837cc37ec054`  
**Live URL:** https://color-signal-lens.sociobot.in  
**Release:** `v0.1.9`  
**Verified:** 2026-08-29 07:40 UTC  
**Verdict:** **FAIL — do not release this candidate.**

The candidate repairs the portrait-image picker, paste recovery, legal copy,
and release identity failures from verification 8. The public site and core
free reader work. The paid desktop flow is still not functional in the real
Tauri runtime, however, and the default desktop layout also violates the
minimum target-size contract.

## Release-blocking findings

### High — the desktop app cannot verify or restore a license

I installed the published Linux AppImage through the hosted `install.sh`,
opened **Restore license**, entered a real invalid test token, and submitted it.
The app reported:

> The license could not be checked. Connect to the internet and try again.

The same result occurred in an independently built AppImage from this commit.
At the same time, a direct request from the host returned HTTP 200 with
`{"expires_at":null,"reason":"invalid","valid":false}`. The failure is the
desktop origin policy:

- `Origin: https://color-signal-lens.sociobot.in` receives
  `Access-Control-Allow-Origin: https://color-signal-lens.sociobot.in`.
- `Origin: tauri://localhost`, `http://tauri.localhost`, and
  `https://tauri.localhost` receive no `Access-Control-Allow-Origin` header.

The application uses webview `fetch` and has no native HTTP bridge. Therefore
the production Tauri origins cannot read the verification response. A website
purchase also cannot make the browser's stored license available to the
desktop app. The advertised paid feature cannot be activated in the shipped
desktop product.

`@claim:desktop-paid-flow` does not catch this. It serves `dist/app` at
`http://127.0.0.1:4174` and intercepts the verification URL with a Playwright
fixture, bypassing both the Tauri origin and real API CORS.

Required repair: allow the exact production Tauri origins at the Sociobot
endpoint or proxy verification through a narrowly scoped Tauri command, then
exercise a real desktop-origin request in the release test.

### Medium — Restore license input is only 34.61 px wide

At the configured default desktop size, 1180×810, opening **Restore license**
produces these measured bounds:

- restore row: 226×48.34 px;
- license input: **34.61×48.34 px**;
- Restore license button: 183.39×48.34 px.

The field accepts a pasted token, but its pointer target is below the required
44 px width and shows only about two characters. This is the real built
desktop layout, also visible in the installed AppImage. The existing desktop
test proves only that Playwright can call `fill()` on the field.

### Medium — “How it works” is a dead link in the desktop app

The desktop header links to `/#how`, but desktop mode renders the reader at
`/` and contains no element with `id="how"`. From a loaded sample, activating
the link changed the URL to `/#how`, left the same reader visible, left focus on
the link, and found `#how` count 0. This violates the no-dead-links routing
contract.

### Low — the required copy audit is stale

`.factory/copy-audit.md` still records footer version `v0.1.8` and omits the
merchant/refund and other copy added in `v0.1.9`. The visitor copy itself is
plain and within the stated limits, but the mandatory audit is no longer a
complete extraction of shipped copy.

## Mandatory first-read gate — PASS

In fresh 1440×900 and 390×844 browser contexts, the first screen answers all
three questions in plain words:

- what: **Make status colors distinct.**
- who: people who cannot rely on red and green during code reviews, charts, or
  status screens;
- first action: **Try it with sample data**, beside “See a sample screenshot
  with an overlay. Nothing is saved.”

At 390 px, the action and all three facts are visible by y=667 in the 844 px
viewport. One click opens `/demo`, shows the transformed checkout screenshot,
and keeps the persistent **Demo — sample data, nothing is saved** banner with
Reset demo and Start for real.

## Mandatory claims gate — PASS after clean install

The initial command could not launch before dependencies were installed
(`tsx: not found`). After the required clean `npm ci` (29 packages, zero
reported vulnerabilities), every exact command in `.factory/claims.json`
passed independently:

`sample-lens`, `demo-isolation`, `local-screenshots`, `reading-cues`,
`demo-reset`, `screenshot-input`, `paste-input`, `portrait-color-pick`,
`keyboard-color-input`, `capture-consent`, `clear-overlay`, `privacy-limits`,
`named-presets`, `license-entitlement`, `lens-plus-price`, `license-restore`,
`desktop-paid-flow`, `sociobot-checkout-path`, `license-daily-cache`,
`desktop-release`, `installer-checksums`, `desktop-download-platforms`,
`macos-shell-installer-architecture`, `release-fallback`, and
`offline-reader`.

These are fixture tests. Their passing result does not override the real
desktop-origin failure above.

## Local build and package evidence

- `npm ci`: PASS — 29 packages, 0 vulnerabilities.
- `npm test`: PASS — 7 Node/unit tests and 54 Playwright tests.
- `npm run check`: PASS.
- `npm run build`: PASS — produced `dist/app` and `dist/site`.
- `cargo test --manifest-path src-tauri/Cargo.toml`: PASS — 0 Rust tests.
- `APPIMAGE_EXTRACT_AND_RUN=1 npm run tauri -- build --bundles deb,rpm,appimage`:
  PASS — produced all three Linux bundles.
- Locally built hashes: AppImage
  `f98d79d545a368fc114c8b3de56dd547a27150cf745caa0d22f3f12e87e4f8fe`,
  DEB `70c1f54309760d47498d658e432f2df50b3d95c7544edb52deb87f197fb5711b`,
  RPM `0549b1198500ca1e68bbd844a403dced17e6560f04209042b730dc4f42b8e29e`.

The Tauri test/build needed the same Linux GUI development packages installed
by the release workflow. The pre-install Cargo failure for missing
`glib-2.0.pc` was environmental and passed after that dependency set was
installed.

## Deployment and release identity — PASS

The live production files match the candidate build byte-for-byte:

| File | SHA-256 |
| --- | --- |
| `index.html` | `e27fa4bf6fa344a68247594e1de031f5d5030480dee3ee51eae4545608851f08` |
| `assets/index-DWMVRZWR.js` | `6d15e3049db08d6525feec670fea0843c00a0d8936896771ab499f8d3436792e` |
| `assets/style-hQHUlZ3M.css` | `9409558da0d658c9bb06436d1689c40fa11dcb2e351e52d2e3a1fd2426ade888` |

The latest public release is `v0.1.9`; its release target, tag dereference, and
`latest.json.commit` all resolve to the candidate. It contains macOS arm64/x64,
Windows EXE/MSI, Linux AppImage/DEB/RPM, `SHA256SUMS`, and `latest.json`.

The hosted installer downloaded the 83,499,512-byte AppImage to an isolated
directory, verified
`6c4737c767fea76df55a3fc1a1433e9090328beee9fffac8b5d2f9c82c976456`,
made it executable, and launched it at 1180×810. The installed app loaded its
bundled sample and displayed Buy and Restore controls.

## Core behavior and recovery — PASS except findings above

Fresh live flows passed on desktop and 390 px mobile:

- sample green pixel `22,113,74` remapped to blue `7,90,134` and orange
  `169,73,0`; Clear overlay restored `22,113,74`;
- boundary colors `#000000` and `#FFFFFF` were accepted;
- a corrupt PNG produced a specific recovery message and preserved the last
  valid image;
- text clipboard data followed by an image paste recovered correctly;
- a 100×400 red-strip/green portrait selected `#9C2D20` from the visible red
  strip at both 1440 px and 390 px;
- capture was not requested before the explicit button, then a selected
  60×80 region was added and the source track stopped;
- Reset demo and Start for real left all non-demo keys byte-for-byte unchanged
  and removed the demo namespace.

All crawled links returned 200, except that the desktop-only in-app hash link
described above has no target. The hosted checkout returned 200 and displayed
Color Signal Lens Plus, `$12.00`, and one-time billing.

## Accessibility, responsive behavior, and console — PASS with noted defects

At 1440×900 and 390×844, `/`, `/demo`, `/lens`, `/privacy`, `/terms`, and the
real 404 had the expected title, `lang="en"`, one h1, one main landmark, alt
text, and no horizontal overflow. Axe reported zero serious or critical
findings on all 12 combinations. The intentional 404 navigation produced only
the browser's expected failed-resource console line; all successful routes and
flows had no console or page errors.

Keyboard traversal reached the skip link, navigation, demo controls, canvas,
color input, cue controls, file input, capture, and legal links without a trap.
Focus used a 3 px black outline with a white halo. Enter on the canvas moved
focus to the keyboard color field. Reduced motion produced 0.01 ms animation
and transition durations, removed decorative transforms, and used automatic
scrolling. The 200% zoom smoke test had no horizontal overflow.

The restore-field target and dead desktop link remain the exceptions described
above. `/opt/fleet/lib/verify-url.sh` otherwise passed with zero errors.

## Privacy, headers, caching, and allowance — PASS

The Playwright request log for the complete screenshot flow contained
same-origin assets, local `blob:` image reads, and the documented GitHub
release lookup only. Opening, pasting, remapping, clearing, and capturing a
screenshot caused no upload, analytics, third-party font, or third-party script
request. License traffic occurs only after a token is present or Restore is
submitted.

Browser-observed live responses include HSTS, `nosniff`, strict-origin
referrer policy, and the declared CSP. HTML uses
`public, must-revalidate, max-age=30`; hashed JS/CSS use
`public, max-age=31536000, immutable`. All sitemap routes return 200 and an
unknown route returns a real 404.

From one client, license verification requests 1–30 returned 200; request 31
returned 429 with `Retry-After: 3`. Observed allowance: **30 requests per
window**.

There is no sign-in, product-owned backend, service worker/PWA, library, or CLI,
so their specialized checks are not applicable.

## Performance — PASS

Production budgets are met: site JS is 33,251 bytes raw / 11,050 bytes gzip;
CSS is 13,691 bytes raw / 3,862 bytes gzip; there is no webfont; hero WebP is
50,718 bytes. Lighthouse mobile scored 99 performance, 100 accessibility, 100
best practices, and 100 SEO, with FCP 1.1 s, LCP 2.0 s, TBT 60 ms, and CLS 0.
Twelve live cue interactions reached the second animation frame in at most
34.6 ms (median 33.3 ms).

## Retest requirements

Make real license verification work from every Tauri production origin, then
prove it without intercepting the request in a browser-hosted fixture. Give the
license input at least a 44×44 px target at 1180×810, remove or implement the
desktop **How it works** destination, and regenerate the copy audit from the
shipped `v0.1.9` copy. Retest the actual published desktop artifact.
