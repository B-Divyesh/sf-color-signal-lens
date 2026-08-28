# Color Signal Lens repair handoff

## Repair status: deployed

This repair resolves the independent verifier's release-blocking macOS
installer defect from `.factory/verification-3.md`.

macOS browser user-agent strings do not reliably identify the physical CPU:
Apple-Silicon browsers may report an Intel-compatible Mac user agent. The
landing page therefore no longer chooses the first DMG or promises a guessed
match. When a release contains both artifacts it presents two explicit,
truthful choices:

- **Download for Intel Mac** → the `_x64.dmg` artifact
- **Download for Apple Silicon** → the `_aarch64.dmg` artifact

Windows and Linux continue to select their OS-specific installer exactly as
before. If release metadata is unavailable or incomplete, the existing calm
release-page fallback remains in place.

## Regression coverage

Added claim `macos-installer-architecture` to `.factory/claims.json` and the
tagged Playwright regression in `tests/claims.spec.ts`. It uses independent
Intel and Apple-Silicon macOS browser contexts with a release fixture that
contains both DMGs, then asserts the labelled Intel link targets `_x64.dmg`
and the Apple-Silicon link targets `_aarch64.dmg`. This guards against the
original first-DMG selection bug and avoids a false architecture prediction.

README install guidance and the copy audit now describe the explicit Mac chip
choice.

## Verification

Run from a clean dependency install on 2026-08-28:

```sh
npm ci
npm test
npm run check
npm run build
cargo test --manifest-path src-tauri/Cargo.toml
CI=1 npm run tauri build
```

Results:

- `npm test`: pass — 5 unit tests and 19 Playwright tests, including desktop,
  390px mobile, keyboard, offline-after-load, privacy/network, capture,
  reduced-motion, console, and serious/critical Axe coverage.
- Every command in `.factory/claims.json` passed verbatim (11 claims).
- `npm run check`: pass.
- `npm run build`: pass. The production site bundle is 24.36 KB JS (8.59 KB
  gzip) and 11.72 KB CSS (3.47 KB gzip).
- `cargo test`: pass (0 Rust tests).
- Native production build: pass after installing the standard Tauri Linux
  prerequisites (`libglib2.0-dev`, `libwebkit2gtk-4.1-dev`,
  `libayatana-appindicator3-dev`, `librsvg2-dev`, `patchelf`). It produced
  `Color Signal Lens_0.1.5_amd64.deb` (3,732,608 bytes) and
  `Color Signal Lens-0.1.5-1.x86_64.rpm` (3,734,971 bytes).
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/` against the production
  site build passed: HTTP 200, no console errors, title/lang/one h1/main,
  and no missing image alt or unlabeled buttons. Playwright's Axe integration
  passed at desktop and 390px; the standalone Axe CLI could not run because
  it does not locate the preinstalled Playwright Chromium binary.
- Live GitHub release identity check confirmed v0.1.5 contains both
  `Color.Signal.Lens_0.1.5_x64.dmg` and
  `Color.Signal.Lens_0.1.5_aarch64.dmg`, alongside Windows, Linux,
  `SHA256SUMS`, and `latest.json`.

## Deployment and known gaps

Deployed `dist/site` to `sf-color-signal-lens` on 2026-08-28 with deployment
ID `164b482a-e4c7-4e26-8f89-9143b6c8474c`.
`https://color-signal-lens.sociobot.in/` returned HTTP 200 with the expected
CSP, HSTS, strict referrer policy, and `nosniff`. The live desktop browser
check had no console errors and reported title, `lang=en`, one h1, a main
landmark, no missing image alt text, and no unlabeled buttons. Fresh live
Intel- and Apple-Silicon-macOS browser contexts both exposed the accurate x64
and aarch64 installer links from v0.1.5.

The application remains a Tauri 2 desktop app with a static landing site.
The desktop installers are unsigned; macOS users may need right-click → Open
and Windows users may need to confirm the app. No telemetry or automatic
updater is included. Optional signing still requires `APPLE_CERTIFICATE` and
`WINDOWS_CERT_PFX` in the release workflow environment; no signing secret is
stored in this repository.
