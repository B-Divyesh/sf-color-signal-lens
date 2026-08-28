# Color Signal Lens repair handoff — repaired

## Repair status (2026-08-28 UTC)

Work order `color-signal-lens-repair-5` repairs the release blocker in
independent verification 5. The direct `/lens` route no longer treats a stored
token as entitlement. Lens Plus controls require a cached valid verdict for
that exact token. An uncached token stays locked while Sociobot verification
runs. An invalid response removes the token and leaves the free controls
available. A stale matching valid verdict supports offline use and is checked
when the daily verification is due. Preset saving repeats the entitlement
check instead of relying only on hidden controls.

The demo does not read or expose the real Lens Plus state. Exact regression
coverage now rejects an invalid token on a cold direct `/lens` visit, rejects
a valid cache belonging to another token, and proves that an uncached active
fixture unlocks only after verification. The existing named-preset fixture now
uses the token-bound cache format. `.factory/claims.json` contains 13 claims.

## Verification evidence for this repair

- `npm ci`: 29 packages installed, 0 vulnerabilities.
- All 13 exact commands in `.factory/claims.json`: passed.
- Final `CI=1 npm test`: 6 unit and 22 Playwright tests passed.
- `npm run check` and `npm run build`: passed; `dist/app` and `dist/site`
  produced.
- Site output: JS 25.65 KB (8.99 KB gzip), CSS 11.72 KB (3.47 KB gzip), hero
  WebP 50.72 KB.
- Browser coverage passed at desktop and 390×844: keyboard skip/focus, touch
  targets, reduced motion, offline-after-load, demo isolation/reset, corrupt
  image recovery, selected-region capture, privacy request logging, route
  reload, release fallback, and console checks.
- Playwright Axe found zero serious or critical issues on desktop and 390px.
  The standalone Axe CLI was also invoked, but this container has no Selenium
  `chromedriver`; the pinned Playwright/Axe checks used the preinstalled
  Chromium successfully.
- Local `verify-url.sh`: HTTP 200, 1,037 ms network-idle load, no console
  errors, `lang=en`, one h1, main landmark, all image alt text, and no unnamed
  buttons.
- Lighthouse mobile: performance 100, accessibility 100, best practices 100,
  SEO 100; LCP 1.5 s, CLS 0, total blocking time 0 ms.
- `cargo test --manifest-path src-tauri/Cargo.toml`: passed.
- `CI=1 npm run tauri build -- --bundles deb,rpm`: passed. DEB is 3,733,064
  bytes (`960c03eaed64fffe729bb89fca02816c8fcfc68c3f9737166d8731012add95c1`);
  RPM is 3,735,342 bytes
  (`9d1706a7fcffdc995faf78634347011033ba892a223559fe359b1f3e408291ec`).
- Live Sociobot verification returned HTTP 200 with `valid:false` and
  `reason:"invalid"` for the invalid test value.
- Public release `v0.1.5` still contains macOS x64/aarch64, Windows EXE/MSI,
  Linux AppImage/DEB/RPM, `SHA256SUMS`, and valid `latest.json`; its downloaded
  AMD64 DEB passed `sha256sum --check`.
- Repair commit `320b489c543ceff0b3d6ee93516516272cd50d50` was pushed to
  `origin/main`.
- `dist/site` was deployed to the existing `sf-color-signal-lens` Static Web
  App. Azure deployment ID:
  `4e85a08c-977e-4d4b-ac3e-8fc276ca10d4`; default host:
  `nice-pebble-0ccaf2710.7.azurestaticapps.net`.
- Live `verify-url.sh` passed with a 1,097 ms network-idle load and no console
  errors. The live JavaScript SHA-256 is
  `a91cbe048991337e410d0dabd397301d41bb8504c024d8be56fb1f64969a3903`;
  CSS is
  `49fdf5caeb5db6d1708877e5e183b9757a3e61c27c7f7bf97054403890c5ea4d`.
  Both match `dist/site` byte-for-byte and use one-year immutable caching.
- Fresh live Chromium contexts at 1440×900 and 390×844 set only the verifier's
  `definitely-invalid` token, opened `/lens`, made exactly one Sociobot verify
  request each, rendered zero preset-name controls, removed the token, and
  logged zero console/page errors.

Run the clean gates with:

```sh
npm ci
CI=1 npm test
npm run check
npm run build
cargo test --manifest-path src-tauri/Cargo.toml
CI=1 npm run tauri build -- --bundles deb,rpm
```

Known operator action is unchanged: installers are unsigned. macOS signing
requires `APPLE_CERTIFICATE`; Windows Authenticode requires
`WINDOWS_CERT_PFX`. No secrets are stored here. A real valid customer license
was unavailable; valid and invalid client behavior uses deterministic
fixtures, and the live invalid response was checked directly.

---

# Independent verification history — FAIL before this repair

## Independent verification 5 (2026-08-28 UTC)

**Candidate:** `35bb6450f6417f52dfb675af6da4c3713a22779c`  
**Live URL:** https://color-signal-lens.sociobot.in  
**Status:** **FAIL — release blocked.**

The live root, JavaScript, and CSS are byte-for-byte identical to this
candidate. All 12 declared claim tests, the complete 6-unit/19-Playwright
suite, TypeScript check, web build, live Axe scans at desktop and 390px,
keyboard/reduced-motion coverage, privacy request checks, response headers,
and release checksum checks passed. See `.factory/verification-5.md` for the
complete evidence.

### Release blocker: invalid local license unlocks Lens Plus

In a fresh live browser context, setting only
`localStorage['sb_license:color-signal-lens'] = 'definitely-invalid'` and
opening `/lens` exposes the `Lens Plus preset name` field and `Save preset`
control. No Sociobot `/verify` request occurs. An arbitrary string therefore
unlocks paid saved presets without a purchase. Repair entitlement gating and
add a direct-`/lens`, invalid-license regression test before any release.

The verifier installed standard Linux Tauri build prerequisites in the
disposable container to run the native checks; no product source code was
changed. `cargo test --manifest-path src-tauri/Cargo.toml` and
`CI=1 npm run tauri build -- --bundles deb,rpm` both passed, producing unsigned
DEB and RPM packages. This does not waive the entitlement blocker.

---

# Previous Color Signal Lens repair handoff — deployed

## Current repair status (2026-08-28)

Repair commit `96255a168101de9513fe3b8345aa819246a71a45` resolves the
release-blocking `install.sh` defect reported in `.factory/verification-4.md`
for candidate `84a672c0fd7cb0e499ed6fe34482545b703b72f3`.

Before the implementation change, the new fixture listed `_aarch64.dmg`
first and mocked Intel `uname -m` as `x86_64`; the installer reproduced the
defect by verifying `Color.Signal.Lens_0.1.6_aarch64.dmg`. The repaired script
selects `_x64.dmg` for `x86_64` and `i386`, selects `_aarch64.dmg` for
`arm64` and `aarch64`, and fails clearly for an unknown Mac CPU. The explicit
browser Mac chip choices, Windows/Linux behavior, and checksum verification
remain unchanged.

Added the declared `macos-shell-installer-architecture` claim. Its exact
command, run successfully after the repair, is:

```sh
npm run test:unit -- --test-name-pattern=@claim:macos-shell-installer-architecture
```

It supplies valid SHA-256 sums, observes all four supported `uname -m` aliases
with the Apple-Silicon artifact first, and checks the unknown-CPU error. All
12 commands in `.factory/claims.json` were run verbatim and passed. `CI=1 npm
test` passed 6 unit tests and 19 Playwright tests; `npm run check`, `npm run
build`, and `cargo test --manifest-path src-tauri/Cargo.toml` also passed.
The targeted desktop/390px Playwright accessibility/regression suite passed
11 tests covering serious/critical Axe checks, keyboard, reduced motion,
offline-after-load, privacy/network, touch targets, and release fallback.

`npm run build` produced `dist/app` and `dist/site`; the site bundle is
24.36 KB JavaScript (8.59 KB gzip) and 11.72 KB CSS (3.47 KB gzip). After the
standard Tauri Linux prerequisites were installed, `CI=1 npm run tauri build -- --bundles deb,rpm`
produced the unsigned Linux packages. The full local
AppImage attempt still hits Ubuntu 24.04's recorded `linuxdeploy` issue; the
public v0.1.5 release was checked to contain its AppImage plus both macOS
DMGs, Windows installers, SHA256SUMS, and latest.json. The downloaded public
AMD64 DEB verifies against SHA256SUMS.

`dist/site` was deployed to production; Azure returned
`https://nice-pebble-0ccaf2710.7.azurestaticapps.net`. The custom URL
https://color-signal-lens.sociobot.in now serves an `install.sh` byte-matching
the repaired source. Live root verification passed: HTTP 200, no console
errors, title/lang/one h1/main, no missing alt text, and no unlabeled buttons.
`/demo`, `/privacy`, and `/terms` return HTTP 200 with HSTS, `nosniff`, strict
referrer policy, and the expected restrictive CSP.

---

# Previous builder repair handoff

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
