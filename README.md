# Color Signal Lens

Make status colors distinct in screenshots. This desktop utility is for people
who cannot rely on red and green while reading software diffs, charts, or
status panels. It adds a label, a pattern, or blue-orange remapping to one
selected colour without changing the rest of the screen.

Try the isolated browser demo at `/demo`. It opens a realistic code-diff
screenshot. Nothing in demo mode is saved with real settings.

## Use it

1. Open a screenshot, paste an image, or choose Capture screen region in the
   installed desktop app.
2. Click a difficult colour signal, or set its colour with the keyboard field.
3. Choose Label, Pattern, or Remap. The source image remains underneath.

Screen capture is requested only after the Capture button is pressed. Opened
images stay on the device. Color Signal Lens does not diagnose or correct
colour vision, and it does not modify another app's data.

## Develop

```sh
npm install
npm run dev
npm run dev:desktop
npm test
npm run build
cargo test --manifest-path src-tauri/Cargo.toml
```

The static deploy root is `dist/site`; its entry point is `dist/site/index.html`.
The desktop app uses Tauri 2 and its configuration is in `src-tauri/`.

## Install and releases

Release builds run on tags such as `v0.1.0` through
`.github/workflows/release.yml`. The workflow creates unsigned macOS, Windows,
and Linux artifacts plus checksums. The landing site chooses a matching release
asset through the GitHub API and shows a calm release-page fallback offline.

```sh
curl -fsSL https://color-signal-lens.sociobot.in/install.sh | sh
```

```powershell
irm https://color-signal-lens.sociobot.in/install.ps1 | iex
```

Both scripts verify SHA-256 before handing off to the platform installer.
Unsigned apps may require a right-click → Open confirmation on macOS or a
Windows confirmation.

## Lens Plus

The free app includes the core reading controls. Lens Plus is a $12 one-time
purchase for saved named presets. The hosted Sociobot checkout returns a
license token. It is stored locally and checked no more than once per day when
online. Restore a purchase by pasting the license on the landing page.

## Privacy and terms

Read `/privacy` for local storage and screen-permission details. Read `/terms`
for the product limits and purchase terms. No analytics or third-party runtime
scripts are used.

## License

MIT. See [LICENSE](LICENSE).
