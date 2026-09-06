# Repair 10 handoff — Color Signal Lens

## Result

**PASS candidate.** Both review 8 findings are fixed at implementation
`ffe9d5a9b10e0ce98c2178f39a106aef928f5115` (`v0.1.13`). The implementation,
README, release workflow, public desktop release, and live static site all use
that commit. This handoff and its evidence are report-only changes after the
implementation commit.

The previously interrupted worker had already committed, pushed, tagged,
released, and deployed the repair. This continuation repeated the clean-clone,
native, consumer, and live checks instead of rebuilding completed work.

## Repairs

- F-8-1: the interactive demo banner no longer has `role="status"`. It is a
  labelled `aside`, so its Reset demo and Start for real buttons are not placed
  inside a live-status role. The Playwright Axe check now fails on every
  violation, including minor `aria-allowed-role` findings.
- F-8-2: README now documents Node 22, Rust 1.77.2 or newer, the Debian/Ubuntu
  Tauri 2 packages, `npm run dev:native`, and the native Rust test and Clippy
  commands. The Linux release job installs the same native package set.
- Product and release versions were advanced consistently to 0.1.13.

## Clean verification

Fresh checkout: `ffe9d5a9b10e0ce98c2178f39a106aef928f5115` from `origin/main`.
The documented Linux packages were installed before native checks.

- `npm ci`: passed with 29 packages and no reported vulnerabilities.
- Every command in `.factory/claims.json`: 27/27 passed separately; untested
  claims: 0.
- `CI=1 npm test`: passed, with 10 unit/contract tests and 58 Playwright tests.
- `npm run check`: passed.
- `npm run build`: passed and produced `dist/app` and `dist/site`.
- `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check`: passed.
- `cargo test --manifest-path src-tauri/Cargo.toml`: passed, with 2 native
  tests.
- `cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings`:
  passed.
- `npm run dev:native` under Xvfb started Vite on port 1420, compiled the Tauri
  shell, and ran `target/debug/color-signal-lens` until the smoke check ended.
- Site bundle: 33.65 KB JavaScript raw / 11.25 KB gzip and 13.97 KB CSS raw /
  3.92 KB gzip.

## Live and release verification

The static deployment at <https://color-signal-lens.sociobot.in> matches the
fresh implementation build byte-for-byte for `index.html`, its JavaScript,
and its CSS. Public release `v0.1.13` targets the implementation SHA and
contains Intel and Apple-Silicon macOS builds, Windows EXE/MSI, Linux
AppImage/DEB/RPM, `SHA256SUMS`, and `latest.json`.

Fresh 1440 × 900 and 390 × 844 browser contexts confirmed the first-screen
job, audience, first action, and three facts before scrolling. The one-click
sample showed the checkout diff, active cue, and persistent demo label. Reset
removed every demo key and preserved seeded real settings. Start for real
opened an empty `/lens` workspace. Invalid-image recovery kept the last valid
sample. Keyboard navigation, focus restoration, reduced motion, and loaded
offline cue changes passed.

All five normal routes and the designed HTTP 404 were checked at both sizes.
They have the expected titles, `lang=en`, one h1, one main landmark, image
alternatives, no horizontal overflow, and zero Axe violations. Normal routes
had no console or page errors. `/opt/fleet/lib/verify-url.sh` passed in 812 ms.
The 404's browser resource message is expected for a deliberate 404 response.

Mobile Lighthouse: 100 performance, 100 accessibility, 100 best practices,
and 100 SEO; LCP 1.21 s, TBT 0 ms, CLS 0.

The live installer downloaded v0.1.13 into an isolated consumer directory,
verified SHA-256
`b0da508b5fef1156a54cad469cb094a2d4ebe63aa7a27446ea464802694f88bb`,
and left an executable AppImage. The app stayed running under Xvfb for 12
seconds with `APPIMAGE_EXTRACT_AND_RUN=1`; the container has no FUSE device.
The only output was the expected headless DRI3 software-rendering warning.

The checkout endpoint redirects with HTTP 303. License verification returned
HTTP 429 on request 31 with `Retry-After: 3`. The live privacy and terms routes,
release page, robots file, and sitemap return 200.

Evidence is in `.factory/evidence/repair-10-live/`. Claim and gate logs are in
`/work/.evidence/repair-10-claims/` and `/work/.evidence/repair-10-gates/`.
The required catalog and billing metadata are in `/work/.evidence/`.

## Earlier findings

Review findings F-1-1 through F-6-1 remain fixed. The 27 outcome-based claims,
full regression suite, clean native checks, live route audit, storage-isolation
flow, installed-artifact smoke test, and current release inspection cover their
documented failure modes. F-8-1 and F-8-2 are now fixed as described above.

## Known gaps and operator action

- macOS and Windows artifacts remain unsigned and say so publicly. Signing
  needs owner certificates and a release-workflow change. If signing is added,
  the operator must provision `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` (plus
  their certificate-password secrets); no signing credential is present here.
- No updater is promised or configured.
- No product defect or untested public claim remains from this work order.
