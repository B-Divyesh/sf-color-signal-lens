# Color Signal Lens

Make screenshot status colors distinct. It is for people who cannot rely on red
and green in software diffs, charts, or status panels.

Try the sample at <https://color-signal-lens.sociobot.in/demo>. It opens a
checkout diff with added and removed totals. Demo changes stay separate and
never change your settings.

## Use Color Signal Lens

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
purchase and saves named presets on this device. Buy Lens Plus opens Sociobot's
payment page. Buy and restore a license inside the desktop app or on the
landing page. Sociobot/Dodo is the merchant of record. It processes the payment
and handles refunds. A refund removes access to saved presets.

The free screenshot reader works offline after the installed desktop app has
loaded. The browser sample is for trying the app before installation.

## Privacy and terms

Read <https://color-signal-lens.sociobot.in/privacy> for screenshot processing,
local storage, and screen permission details. Read
<https://color-signal-lens.sociobot.in/terms> for product limits and purchase
terms. The app has no analytics and loads no code from other websites.

## License

MIT. See [LICENSE](LICENSE).
