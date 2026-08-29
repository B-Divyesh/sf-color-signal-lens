# Polish 6 handoff — Color Signal Lens

## Result: PASS

The cumulative adversarial repair is complete at code commit
`afcd9aabd454f62a8900bb660aca5a505185491f`. Version `0.1.12` is live at
<https://color-signal-lens.sociobot.in> and tagged as `v0.1.12` for the desktop
release.

The final review defect is fixed: **Reset demo** now removes every key with the
`demo:color-signal-lens:` prefix and no longer recreates a demo-start marker.
It also restores the shipped sample and default cue while preserving real
licenses, entitlement caches, presets, and release metadata byte-for-byte. The
claim test now seeds both current and unknown future demo keys and proves that
none remain after Reset.

The first screen, isolated one-click sample, mobile composition, real routes,
route titles and metadata, focus restoration, 404 response, legal links, copy,
claim inventory, desktop installers, and the paper-cut visual system were
rechecked against every finding from rounds 1–6. The complete finding map is
in `.factory/polish-6.md`.

## Deployment and release

- Production URL: <https://color-signal-lens.sociobot.in>
- Azure Static Web Apps deployment: `17951525-809e-4dd0-bc7d-9cd03fbc5f81`
- Release workflow: <https://github.com/B-Divyesh/sf-color-signal-lens/actions/runs/33252969696>
- Release tag: `v0.1.12`
- Release page: <https://github.com/B-Divyesh/sf-color-signal-lens/releases/tag/v0.1.12>
- Published assets: macOS arm64/x64 DMGs and app archives; Windows MSI and EXE; Linux AppImage, DEB, and RPM; `SHA256SUMS`; `latest.json`.
- Local and live SHA-256 values match for the deployed HTML, JavaScript, and CSS. The HTML digest is `1d93e9cca0a4772305a04253b0ec4786efa61a38857ac8ca6a71a6e0cd0ebc73`.

## Exact verification

- Fresh clone at `afcd9aabd454f62a8900bb660aca5a505185491f`: `npm ci` completed with zero vulnerabilities.
- Every one of the 27 exact commands in `.factory/claims.json` passed independently from that clone.
- `CI=1 npm test`: 10 unit/contract tests and 58 Playwright tests passed.
- `npm run check`: passed.
- `npm run build`: passed and produced both `dist/app` and `dist/site`.
- `cargo test --manifest-path src-tauri/Cargo.toml`: two native bridge tests passed.
- Production factory verifier: HTTP 200 in 1,093 ms; correct title, `lang`, one h1, main landmark, image alternatives, button names, and zero console errors.
- Live Playwright/Axe audit: 12 route/viewport checks at 390×844 and 1440×900; expected 200/404 statuses, no overflow, no unexpected console errors, and no serious or critical Axe violations.
- Live demo audit: one-click landing entry, visible banner/sample/cue, zero demo keys after Reset and exit, no paid controls, unchanged real storage, and only the product origin plus the declared GitHub release API request.
- Live history audit: `/#how` reaches, focuses, and announces its section; Back restores `/privacy` and its h1 focus.
- Lighthouse mobile: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.8 s, CLS 0, TBT 0 ms.
- Site bundle: JavaScript 33.64 KB raw / 11.24 KB gzip; CSS 13.97 KB raw / 3.92 KB gzip.
- Release workflow completed successfully on Ubuntu, Windows, macOS arm64, and macOS x64. The downloaded DEB matched its published `SHA256SUMS` digest, `c484759c98a84e179cd060afe71a3c42124bab05ddb373082e3eb98eeb31049e`, and `latest.json` names the tag, commit, and three platform downloads.
- Cold live contexts resolved the Linux, Windows, Intel Mac, and Apple Silicon buttons to `v0.1.12` assets; each download returned 200 without console errors.

Evidence is stored under `.factory/evidence/polish-6-local/` and
`.factory/evidence/polish-6-live/`, including the mobile demo reset screenshot,
route audit, factory verifier output, and Lighthouse JSON.

## Run and verify

```sh
npm ci
npm run check
CI=1 npm test
npm run build
cargo test --manifest-path src-tauri/Cargo.toml
```

Run any individual product claim with the exact command recorded for it in
`.factory/claims.json`.

## Known gaps

None in the product contract or reviewed scope.

## Needs operator action

The desktop artifacts are intentionally unsigned. The current workflow does
not consume signing secrets. If certificates become available, the operator
must first add signing steps and their Apple and Windows secret names. Signing
is not needed for the tested local-first product behavior.
