# Color Signal Lens handoff

## Delivered

- A Tauri 2 desktop shell and a static landing site in `dist/site`.
- A screenshot lens that loads files, pastes screenshots, samples a chosen
  colour, and applies labels, patterns, or blue/orange remapping.
- A native, on-demand primary-screen capture command for the installed app.
- `/demo` with a realistic diff sample, isolated `demo:` browser storage,
  reset control, and Start for real path.
- `/privacy`, `/terms`, a designed 404 route, metadata, robots, sitemap,
  security headers, keyboard controls, and a 390px mobile layout.
- A $12 Lens Plus checkout link, local license restore and daily background
  verification, plus locally saved named presets.
- Original paper-cut hero artwork at `src/assets/paper-cut-lens.webp` (50 KB),
  with prompt/provenance in `.factory/design.md`.
- GitHub release workflow for `.dmg`, Windows, `.AppImage`, and `.deb` builds,
  checksums, and `latest.json`; browser download resolution uses the GitHub API.

## Verify

```sh
npm install
npm run check
npm test
npm run build
cargo test --manifest-path src-tauri/Cargo.toml
```

Verified on 2026-08-28:

- `npm run check` passed.
- `npm test` passed: 3 unit tests, 4 Playwright claim tests, and one axe scan.
- `npm run build` passed. `dist/site/index.html` exists.
- `cargo test --manifest-path src-tauri/Cargo.toml` passed.
- Browser screenshots checked desktop and 390px demo layouts.
- Initial site JS: 7.14 KB gzip. CSS: 3.13 KB gzip. Hero WebP: 50 KB.

The claim tests named in `.factory/claims.json` prove the sample lens, local
demo request boundary, all reading cues, and demo reset.

## Known gaps / operator action

- The repository has no published GitHub release yet, so the landing page
  correctly shows its release-page fallback. Tag `v0.1.0` and push it to run
  the included workflow. A live release could not be created from this worker.
- Builds are intentionally unsigned. To sign future platform builds, configure
  `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` for the release workflow and add
  the matching Tauri signing configuration.
- The capture command takes the primary screen. A future update can add a
  draggable region selector after capture; users can already open a cropped
  screenshot for precise inspection.

## Next steps

1. Register the paid product with Sociobot and set its return URL.
2. Push tag `v0.1.0`, confirm release artifacts and SHA256SUMS, then publish
   the static `dist/site` directory.
3. Run a participant diff-identification study against the stated 25-point
   success measure.
