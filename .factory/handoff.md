# Color Signal Lens handoff — repair v0.1.5

**Repair commits:** `0efdeb4d5bb737777f6f5c351b61f801a05d4529`,
`326dc9904e9a3ec70f700b3fe076dc06d184abe8`
**Release:** [v0.1.5](https://github.com/B-Divyesh/sf-color-signal-lens/releases/tag/v0.1.5)
**Release run:** `33205150041` — all macOS, Windows, Linux, and manifest jobs passed.
**Production:** https://color-signal-lens.sociobot.in

## Repaired

1. Reproduced the Windows failure from run `33199904089`: Tauri required
   `src-tauri/icons/icon.ico` to generate the Windows resource file. Generated
   and committed the complete native icon set, including `.ico` and `.icns`.
2. The release now stays draft during its matrix build. It refuses publication
   unless macOS, Windows, and Linux installers exist, then attaches
   `SHA256SUMS` and `latest.json` before making the release public.
3. Reproduced and fixed the manifest job's no-checkout failure. Every GitHub
   CLI release command now passes `--repo "$GITHUB_REPOSITORY"` explicitly.
4. Completed `.factory/claims.json` for screenshot input, capture consent,
   local preset saving, Lens Plus price, installer checksums, and complete
   desktop release assets. Added exact browser and unit regressions.

## Verification

From a clean dependency install:

```sh
npm ci
npm test                 # 5 unit + 18 Playwright tests pass
npm run check            # pass
npm run build            # pass; site JS 23.81 KB (8.39 KB gzip), CSS 11.66 KB (3.46 KB gzip)
sudo apt-get install libwebkit2gtk-4.1-dev libayatana-appindicator3-dev librsvg2-dev patchelf
CI=1 npm run tauri build # pass; Linux .deb and .rpm produced
cargo test --manifest-path src-tauri/Cargo.toml # pass (0 Rust tests)
```

All ten claim commands in `.factory/claims.json` pass. The suite checks the
desktop and 390px demo, keyboard flow, reduced motion, corrupt-image recovery,
offline-after-load interaction, explicit capture selection, no screenshot
upload in demo, and serious/critical axe findings.

Production was deployed from `dist/site` to `sf-color-signal-lens`. Live
desktop and 390px `/demo` checks report one `<h1>` and `<main>`, no horizontal
overflow, zero serious/critical axe violations, and zero console/page errors.
The custom domain serves the v0.1.5 bundle and expected CSP, HSTS,
`Referrer-Policy`, and `nosniff` headers.

Release verification downloaded `Color.Signal.Lens_0.1.5_amd64.deb`; its
SHA-256 matched the published `SHA256SUMS` entry. `latest.json` is valid and
contains working macOS, Windows, and Linux download URLs. The shipped Linux
`install.sh` also downloaded the v0.1.5 AppImage and verified its checksum.

## Operator notes

Desktop installers are unsigned. macOS users may need right-click → Open and
Windows users may need to confirm the app. Optional signing requires
`APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX`; no signing secret is stored here.
The app has no automatic updater or telemetry.
