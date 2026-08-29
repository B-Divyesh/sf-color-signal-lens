# Color Signal Lens — verification 11 handoff

## Result: PASS

**Independent verification verdict (2026-08-29 UTC): PASS.** Candidate
`6f3827d645fab812fff2dbdd7c1cb455f0bf9596` is deployed at
https://color-signal-lens.sociobot.in and is releasable. Full fresh evidence is
in `.factory/verification-11.md`.

All 28 declared claim commands passed, as did clean `npm ci`, `npm test`,
TypeScript checking, production web build, native Rust tests, live
desktop/mobile flows, keyboard/focus/reduced-motion behavior, axe, privacy
request logs, headers/caching, rate limiting, bundle budgets, Lighthouse, and
the public desktop release/checksum. No product defects were found.

To reproduce: `npm ci && npm test && npm run check && npm run build`; then
`cargo test --manifest-path src-tauri/Cargo.toml`. Native Linux checks require
the normal Tauri development packages. See the README for app and installer
usage. The remaining operator consideration is unsigned macOS and Windows
artifacts.

The repository's `npm run build` passes. An optional local Tauri all-target
bundle reached the release binary, DEB, and RPM but cannot make an AppImage in
this disposable container because its `linuxdeploy` helper needs FUSE
(`libfuse.so.2` and `/dev/fuse` are unavailable). The public GitHub Actions
release does include the checksum-verified AppImage; the public DEB also
smoke-launched under Xvfb for 12 seconds.

---

# Previous builder handoff

## Result: PASS

All findings from reviews 1–5 are resolved. The repaired product is live at
<https://color-signal-lens.sociobot.in>, and the public desktop release is
<https://github.com/B-Divyesh/sf-color-signal-lens/releases/tag/v0.1.11>.

Release commit: `44ce5acd420dbeb59022c5000fe8aea350a0277f`
Static deployment id: `7c22ac76-ddd8-4094-8fa7-3f30d9b64a93`

## What changed

- Added separate `merchant-of-record` and `refund-revocation` claims backed by
  recorded work-order billing fixtures. The refund test sends a revoked verdict
  through the real verification path and proves saved preset controls lock.
- Rewrote payment and privacy copy in plain words and renamed the README section
  to **Use Color Signal Lens**.
- Regenerated `.factory/copy-audit.md` with 189 current rows. New unit tests
  verify every recorded count, every README heading/prose unit, unique claim
  ids, and exactly one tagged test per claim.
- Strengthened cumulative coverage: the privacy claim now visits the landing
  route, and the mobile demo regression requires the full canvas—not only its
  top edge—to fit inside the first 844 px.
- Updated the catalog sentence and advanced the desktop/site version to 0.1.11.
- Preserved the paper-cut diorama design, palette, type, shape, and motion
  policy. No third-party visual asset, font, analytics, or runtime script was
  added.

The complete finding-by-finding evidence map is `.factory/polish-5.md`.

## Verification

Fresh clone: `/tmp/color-signal-lens-polish5-clean.zzoVJH` at the release
commit.

- `npm ci`: passed; 29 packages, zero reported vulnerabilities.
- Every exact command in `.factory/claims.json`: 27/27 passed independently.
- `CI=1 npm test`: passed; 10 unit/contract tests and 58 Playwright tests.
- `npm run check`: passed.
- `npm run build`: passed; produced `dist/app` and `dist/site`.
- `cargo test --manifest-path src-tauri/Cargo.toml`: passed; two native license
  bridge tests. The clean base first needed the same WebKit/GLib development
  packages installed by the release workflow.
- Static site payload: JavaScript 33.69 KB raw / 11.22 KB gzip; CSS 13.97 KB
  raw / 3.92 KB gzip.
- Factory URL verifier: HTTP 200, 893 ms load, correct title/lang/h1/main/alt and
  button labels, with no console errors. See
  `.factory/evidence/polish-5-live/verify.json`.
- Live Playwright/Axe: `/`, `/demo`, `/lens`, `/privacy`, and `/terms` at
  390×844 and 1440×900 had zero serious/critical findings, console errors, or
  horizontal overflow. The unknown route returned HTTP 404 with the shared
  shell. See `.factory/evidence/polish-5-live/audit.json`.
- Live mobile demo: active cue bottom 391 px; transformed canvas bottom 619 px;
  non-demo storage was `{}` before entry, after a delayed non-empty release
  response, after Reset, and after Start for real.
- Live routing: `/#how` landed at 0.05 px, focused and announced the section;
  Back restored `/privacy` and its h1 focus.
- Live offline check: the loaded demo changed to a text-label cue with the
  browser context offline.
- Mobile Lighthouse: performance 100, accessibility 100, best practices 100,
  SEO 100; LCP 1.2 s, CLS 0, TBT 0 ms. See
  `.factory/evidence/polish-5-live/lighthouse.json`.
- Link crawl: every rendered internal/external link returned 200 after
  redirects, including the Sociobot checkout and installer download.
- GitHub Actions run `33247166399`: passed for macOS arm64/x64, Windows, and
  Linux. Release v0.1.11 is public with DMG, MSI/EXE, AppImage/DEB/RPM,
  `SHA256SUMS`, and `latest.json`.
- Download verification: `latest.json` names release commit `44ce5ac`; the
  downloaded `Color.Signal.Lens_0.1.11_amd64.AppImage` passed its published
  SHA-256 entry. A cold live landing page links to that v0.1.11 AppImage.

## Run and verify

```sh
npm ci
CI=1 npm test
npm run check
npm run build
cargo test --manifest-path src-tauri/Cargo.toml
```

The static deployment root is `dist/site`. The desktop source and configuration
are under `src-tauri/`.

## Known gaps

None in the reviewed scope.

## Needs operator action

The v0.1.11 installers are intentionally unsigned. Future signed releases need
the owner's `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` GitHub secrets plus their
associated passwords; no signing secret is stored in this repository.
