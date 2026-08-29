# Color Signal Lens

Make screenshot status colors distinct. It is for people who cannot rely on red
and green in software diffs, charts, or status panels.

Try the isolated browser demo at `/demo` or `/?demo=1`. It opens a sample
checkout diff with added and removed totals. Demo data uses separate browser
keys and never changes real settings.

## Use it

1. Open a screenshot, paste an image, or capture a screen region.
2. Click a status color, or set a color with the keyboard color field.
3. Add a label, a pattern, or blue-orange colors. Clear overlay restores the
   original screenshot.

Screen capture is requested only after you press Capture screen region. Only
the region you select is added. Screenshot data stays in the app.

## Develop

```sh
npm ci
npm run dev
npm run dev:desktop
npm test
npm run build
cargo test --manifest-path src-tauri/Cargo.toml
```

The static deploy root is `dist/site`. The Tauri 2 configuration is in
`src-tauri/`.

## Install and releases

Tags trigger `.github/workflows/release.yml`, which checks for macOS, Windows,
Linux, `SHA256SUMS`, and `latest.json` assets before publishing a release.

```sh
curl -fsSL https://color-signal-lens.sociobot.in/install.sh | sh
```

```powershell
irm https://color-signal-lens.sociobot.in/install.ps1 | iex
```

The Linux script verifies SHA-256 and installs the AppImage as
`~/.local/bin/color-signal-lens`. If GitHub metadata cannot be reached, the
landing page links to the Releases page.

## Lens Plus

The free app includes all reading controls. Lens Plus costs $12 as a one-time
purchase and saves named presets on this device. The purchase action uses the
Sociobot checkout path. Restore a purchase by pasting its license on the
landing page.

## Privacy and terms

Read `/privacy` for screenshot processing, local storage, and screen permission
details. Read `/terms` for product limits and purchase terms. The app has no
analytics and loads no third-party runtime scripts.

## License

MIT. See [LICENSE](LICENSE).
