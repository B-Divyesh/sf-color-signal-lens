# Color Signal Lens

Make status colors distinct in screenshots. This desktop utility is for people
who cannot rely on red and green while reading software diffs, charts, or
status panels. It adds a label, a pattern, or blue-orange remapping to one
selected colour without changing the rest of the screen.

Try the isolated browser demo at `/demo`. It opens a realistic code-diff
screenshot. Nothing in demo mode is saved with real settings.

## Use it

1. Open a screenshot, paste an image, or choose Capture screen region in the
   installed desktop app, then select the region to add.
2. Click a difficult colour signal, or set its colour with the keyboard field.
3. Choose Label, Pattern, or Remap. The source image remains underneath.
   Clear lens restores the source image without an overlay.

Screen capture is requested only after the Capture button is pressed. Only the
region you select is added to the lens. Opened images stay on the device.

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

Release builds run on tags such as `v0.1.7` through
`.github/workflows/release.yml`. The workflow creates unsigned macOS, Windows,
and Linux artifacts plus checksums. The landing site uses the GitHub API for
release links, offers both Mac chip choices, and shows a calm release-page
fallback offline.

```sh
curl -fsSL https://color-signal-lens.sociobot.in/install.sh | sh
```

```powershell
irm https://color-signal-lens.sociobot.in/install.ps1 | iex
```

The Linux script verifies the AppImage and installs it as
`~/.local/bin/color-signal-lens`. The macOS script chooses the matching Intel
or Apple-Silicon DMG, saves it in Downloads, and opens it. The Windows script
verifies and starts the installer.
Unsigned apps may require a right-click → Open confirmation on macOS or a
Windows confirmation.

## Lens Plus

The free app includes the core reading controls. Lens Plus costs $12 once.
It adds named presets you can save, apply, rename, and delete. The hosted
Sociobot checkout returns a license token. It is stored locally and checked
no more than once per day when online. Restore a purchase by pasting the
license on the landing page.

## Privacy and terms

Read `/privacy` for local storage and screen-permission details. Read `/terms`
for the product limits and purchase terms. No analytics or third-party runtime
scripts are used.

## License

MIT. See [LICENSE](LICENSE).
