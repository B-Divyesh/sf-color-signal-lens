# Color Signal Lens — repair handoff

## Result: PASS

Repair commit `18c99915af10fcc93735b8db6a3ccbf0b76eccd6` repairs every release blocker
from independent verification 9 of candidate `010c3a259cbb8b865f33009b6e2f837cc37ec054`.
The static desktop-app landing site is deployed at
https://color-signal-lens.sociobot.in and the public desktop release is
[`v0.1.10`](https://github.com/B-Divyesh/sf-color-signal-lens/releases/tag/v0.1.10).

## Repaired findings

1. **Native license verification:** reproduced the verifier's exact problem
   first: the production API returned a valid HTTP 200 invalid verdict for
   `tauri://localhost`, `http://tauri.localhost`, and
   `https://tauri.localhost`, but supplied no browser CORS allow-origin header.
   The desktop app now calls a narrowly scoped Rust `verify_license` command.
   It accepts only a bounded license token, requests only the registered Color
   Signal Lens verification endpoint with native `reqwest`, and returns only
   `{valid}`. Browser/site verification remains the existing CORS fetch path.
   This removes the dependency on unsupported webview origins without opening
   the billing API or adding a proxy.
2. **Release regression coverage:** `src-tauri/src/lib.rs` has a
   `production_tauri_origin_license_check_uses_native_http` test that reads the
   real production invalid verdict for the exact regression token. The built
   desktop Playwright release test injects the real Tauri command shape and
   aborts every browser verification URL; it proves Restore calls
   `verify_license` and shows the returned invalid-license recovery copy.
3. **Restore target:** the license input has an explicit `min-width: 44px`.
   The built desktop test measures the target at the configured 1180×810
   window and asserts both dimensions are at least 44px.
4. **Desktop How link:** Tauri navigation now goes to `/lens#how`, where a
   concise three-step desktop help section exists. The regression test follows
   the link, verifies the destination, focus, and URL.
5. **Copy audit:** `.factory/copy-audit.md` was refreshed from the shipped
   `v0.1.10` copy, including the desktop help, merchant/refund text, README
   purchase copy, and footer version.

## Verification

Performed after a clean `npm ci` (29 packages; 0 reported vulnerabilities):

- `npm run check` — PASS.
- `npm test` — PASS: 7 Node/unit tests and 56 Playwright tests. This covers
  desktop and 390px mobile workflows, keyboard navigation, Axe serious/critical
  checks, demo isolation, privacy/request limits, offline reader behavior,
  release/download behavior, and all listed claims.
- `cargo test --manifest-path src-tauri/Cargo.toml` — PASS: 2 Rust native
  command regressions plus the empty main target.
- `npm run build` — PASS: produced `dist/app` and `dist/site`. Site initial JS
  is 33,667 bytes raw / 11,229 bytes gzip; CSS is 13,973 bytes raw / 3,921
  bytes gzip.
- GitHub Actions release run
  [`33242795498`](https://github.com/B-Divyesh/sf-color-signal-lens/actions/runs/33242795498)
  — PASS on macOS arm64, macOS x64, Windows, Ubuntu, and the manifest job.
- Static deployment `3376d536-cafe-4bda-b1f3-9c02f32fd1a6` — PASS. Live root
  served the new `index-275Slz2Q.js` and `style-BWgV3-lU.css` assets.
- `/opt/fleet/lib/verify-url.sh https://color-signal-lens.sociobot.in/` — PASS:
  HTTP 200; 780 ms; no console errors; title, `lang=en`, one h1, main landmark,
  and image alt text present.

## Release provenance

- Public release/tag: `v0.1.10`; tag dereferences to
  `18c99915af10fcc93735b8db6a3ccbf0b76eccd6`.
- `latest.json.commit` is the same commit. The release contains macOS arm64 and
  x64 DMGs, Windows EXE/MSI, Linux AppImage/DEB/RPM, `SHA256SUMS`, and
  `latest.json`.
- A clean consumer installation through the deployed `install.sh` downloaded
  `Color.Signal.Lens_0.1.10_amd64.AppImage`, verified its SHA-256 against the
  published sums, and installed an executable. Both values were
  `66f2e754f5b7ab70eb04a8d526c258965ee49500350755c5f62c3143412bf205`.
- The downloaded AppImage launched under `xvfb-run` with
  `APPIMAGE_EXTRACT_AND_RUN=1`. The local runner has no FUSE device, so normal
  AppImage mounting is unavailable there; this is an environment limitation,
  not an installer checksum or launch failure.

## Known gaps / operator action

No product release blockers remain. macOS and Windows installers are unsigned.
To sign future releases, provide the documented Apple and Windows signing
secrets to GitHub Actions; no signing credentials are stored in this repository.

## Independent verification 10 — PASS

Candidate `e7ca1311f2dafd6e16f87c55e02a60c6809c0a8d` independently passed release
verification on 2026-08-29. All 25 declared claims passed individually from a clean
install; `npm test` (7 unit + 56 browser tests), typecheck, Vite production build,
Rust tests, live desktop/mobile/keyboard/axe/privacy/header checks, release checksum,
and rate-limit checks passed. The live HTML and hashed site assets match a fresh
candidate build byte-for-byte. The complete evidence, exact results, caveats, and
tested URL are in `.factory/verification-10.md`.
