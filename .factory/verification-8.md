# Independent verification 8 — FAIL

**Candidate:** `d315dfcfbb5beaa0713324684f124b46593c13e3`  
**Live URL:** https://color-signal-lens.sociobot.in  
**Verified:** 2026-08-29 UTC  
**Verdict:** **FAIL — do not release this candidate.**

The live web build passes the first-read, claims, accessibility, privacy, and
performance gates. The desktop-app candidate still fails its core job on tall
images, cannot expose its paid purchase/restore flow in the desktop artifact,
and is not the code contained in the public desktop release.

## Cold first read — PASS

In a fresh 1440×900 browser context, the first screen says **Make status colors
distinct.** It names people who cannot rely on red and green during code
reviews, charts, or status screens. The first action is **Try it with sample
data**, next to “See a sample screenshot with an overlay. Nothing is saved.”
One click opened `/demo`, already showing the sample lens and the persistent
“Demo — sample data, nothing is saved” banner with Reset demo and Start for
real. The three privacy/offline/price facts were visible on the first screen.

## Release-blocking defects

### Critical — the published desktop artifacts are not this candidate

GitHub's current public release is `v0.1.8`. Its tag and release target resolve
to `060a7eceda5f066bbac42e102a20a9eccfaec4ed`, while this verification target is
`d315dfcfbb5beaa0713324684f124b46593c13e3`, ten commits later. The intervening
diff changes both `index.html` and `src/main.ts`, including accessibility and
demo-isolation repairs. The downloadable desktop app therefore does not match
the candidate under review. The live static HTML, JavaScript, and CSS do match
the candidate exactly, so this is specifically a desktop release-identity
failure, not a stale website observation.

The release otherwise contains the expected macOS, Windows, and Linux assets,
`SHA256SUMS`, and valid `latest.json`. That completeness cannot substitute for
publishing the tested commit.

### High — clicking a visible color selects the wrong pixel on tall images

The canvas uses `object-fit: contain`, but click coordinates are scaled over
the full element rectangle without subtracting the resulting letterbox inset
(`src/main.ts:153-157`). A generated 100×400 PNG contained a red left strip
(20% width, `#9C2D20`) and green remainder (`#16714A`). Clicking the visible
center of the red strip selected `#16714A` instead.

- Desktop 1440×900: canvas box 927.765625×558; rendered image width 139.5;
  clicking local x=408.0828125 inside the visible red strip selected green.
- Mobile 390×844: canvas box 314×523.265625; rendered image width 130.816;
  clicking local x=104.6734375 inside the visible red strip selected green.

This breaks the central color-picker job for portrait screenshots and narrow
captured regions on both required viewport sizes.

### High — Lens Plus cannot be purchased or restored in the desktop app

The desktop build routes `/` and `/lens` directly to `renderLens`
(`src/main.ts:576`). Its locked premium panel contains only a **Lens Plus** link
back to `/`; the Buy and Restore controls exist on the website landing route,
which is unreachable in the desktop build. In the built desktop UI, clicking
Lens Plus remained on `/` and revealed zero purchase or restore controls.
Website checkout does work, but the browser-origin license storage does not
make the desktop app's otherwise unreachable flow usable. The sole paid
feature, saved named presets, therefore has no working desktop purchase or
restore path.

## Other defects

### Medium — one non-image paste disables image paste until reload

The paste listener is registered with `{ once: true }` (`src/main.ts:172`). In
the live `/lens` route, a `text/plain` paste followed by a valid image paste
left the status at “No screenshot loaded.” Reloading and pasting the same image
first succeeded with “Pasted screenshot.” Invalid input does not preserve a
working recovery path.

### Medium — required merchant and refund terms are absent

The paid-unlock contract requires the paid copy/legal pages to state that
Sociobot/Dodo is merchant of record and that refunds are handled there. The
landing page, README, and `/terms` state the $12 one-time price and Sociobot
checkout, but contain no merchant-of-record or refund explanation.

## Mandatory claims gate

A direct pre-install attempt could not launch the repository's `tsx` runner.
After the required clean `npm ci` (29 packages, zero reported vulnerabilities),
all 23 exact commands listed in `.factory/claims.json` passed independently:

`sample-lens`, `demo-isolation`, `local-screenshots`, `reading-cues`,
`demo-reset`, `screenshot-input`, `paste-input`, `keyboard-color-input`,
`capture-consent`, `clear-overlay`, `privacy-limits`, `named-presets`,
`license-entitlement`, `lens-plus-price`, `license-restore`,
`sociobot-checkout-path`, `license-daily-cache`, `desktop-release`,
`installer-checksums`, `desktop-download-platforms`,
`macos-shell-installer-architecture`, `release-fallback`, and
`offline-reader`.

The manifest tests therefore pass after normal installation. They do not cover
the portrait-image coordinate mapping, paste-after-invalid recovery, desktop
purchase reachability, or candidate-to-release identity defects above.

## Local build and package evidence

- `CI=1 npm test`: PASS — 6 unit/release tests and 52 Playwright tests.
- `npm run check`: PASS.
- `npm run build`: PASS — produced `dist/app` and `dist/site`.
- `cargo test --manifest-path src-tauri/Cargo.toml`: PASS (0 Rust tests) after
  installing the Linux packages used by the release workflow.
- Native Tauri DEB, RPM, and AppImage builds: PASS. AppImage required the
  container's missing `file` utility and `APPIMAGE_EXTRACT_AND_RUN=1` because
  FUSE is unavailable here.
- Locally built SHA-256 values: AppImage
  `ccbfc983e4ae5eeff1d3efc5562f9b270022d11e57aea79dedf8be7b7a4c8004`;
  DEB `a9f6e8e1e6b297691060fb2e1d4b723814ddf75b9f9da4d43d439271266734f1`;
  RPM `d53038b9eb972b82311e186c4137a5c2a86b1bf603a1b9b57e7552f7ccf7ce61`.
- The built native candidate opened at its configured 1180×810 size under
  Xvfb. Screen capture could not connect to a desktop portal in this headless
  container and showed a useful permission/open-screenshot recovery message.
- The hosted `v0.1.8` AppImage installed to an isolated directory through the
  real `install.sh`, matched public `SHA256SUMS`
  (`7ae13ad16fdbe8f84aeb2ad6ba0669a62c5f56c60a94e68e78221c1402594dc4`),
  was executable, and opened under Xvfb.

## Live web identity, end-to-end behavior, and accessibility

Local and live production files matched byte-for-byte:

| File | SHA-256 |
| --- | --- |
| `index.html` | `976b3fbc3fceee01f8759738c5ba864b365c205a4e48f146b286877adc98fec7` |
| `assets/index-BDCOqMlU.js` | `600e63ecc7e830b37776e8b912895e956e0ce1789bc5efa849cc096e07d729e4` |
| `assets/style-DFEaZTTp.css` | `696517ce3e513c3f34be056ef4547257ba0bbcc69d4d3df66e5be9c176dc6cff` |

The standard sample flow worked: blue remap rendered RGB `7,90,134`, orange
remap rendered `169,73,0`, and Clear restored the source pixel `22,113,74`.
Boundary colors `#000000` and `#FFFFFF` were accepted. A corrupt image produced
a specific valid-format recovery message, and a subsequent valid file loaded.
Screen capture was not requested before the explicit action; a mocked failure
gave a useful recovery message.

At 1440×900 and 390×844, `/`, `/demo`, `/lens`, `/privacy`, `/terms`, and a real
404 had the expected status, title, language, one h1, main landmark, alt text,
and no horizontal overflow. Axe found zero serious or critical issues. There
were no product console/page errors. Keyboard-only traversal reached every
workspace control with a designed 3px outline and contrasting halo, with no
trap. The skip link, route focus, 200% zoom, mobile demo layout, 44px visible
targets, and reduced-motion override worked.

`verify-url.sh` passed the live site. Mobile Lighthouse scored 100 performance,
100 accessibility, 100 best practices, and 100 SEO; FCP was 1.0 s, LCP 1.5 s,
TBT 80 ms, and CLS 0. Production bundle sizes were 31.95 KB raw / 10.74 KB
gzip JavaScript, 13.61 KB raw / 3.84 KB gzip CSS, and 50,718 bytes for the hero
WebP.

## Privacy, headers, caching, and API allowance

The full fresh demo flow made same-origin requests only. The landing page also
used only the documented GitHub Releases API. No analytics, screen upload,
third-party font, or third-party script request occurred. License traffic was
only triggered by a token or explicit restore action.

Live responses include HSTS, `nosniff`, strict-origin referrer policy, and a
CSP limited to self plus the documented GitHub and Sociobot endpoints. HTML is
cached with `public, must-revalidate, max-age=30`; hashed JS/CSS use one-year
`immutable` caching. The five sitemap routes return 200 and an unknown route
returns 404.

The hosted checkout returned 200 and showed Color Signal Lens Plus at $12 as a
one-time purchase. The invalid-license endpoint returned the expected invalid
verdict. From one client, verification requests 1–30 returned 200 and request
31 returned 429 with `Retry-After: 4`; observed allowance: **30 requests per
window**.

There is no service worker/PWA, sign-in flow, product-owned backend, library,
or CLI, so their specialized checks are not applicable.

## Retest requirements

Publish release artifacts built from the exact repaired candidate, correctly
map clicks through `object-fit: contain` letterboxing at desktop and mobile,
make Buy/Restore reachable and functional inside the desktop app, keep paste
listening after unsupported clipboard data, and add the required paid legal
copy. Add regression claims/tests for each observable promise before another
release decision.
