# Color Signal Lens — repair handoff

## Result

Repaired verification-8 release blockers on version `0.1.9`.

## Fixed

1. Portrait-image clicks now translate through the exact `object-fit: contain`
   image rectangle. Letterbox space is ignored instead of being treated as
   bitmap pixels.
2. Paste handling is permanent for the active workspace. Unsupported clipboard
   data does not consume the listener, and pasting in a text field is left to
   that field.
3. The built desktop reader now has its own Buy Lens Plus and Restore license
   controls. Restore verifies and stores the pasted token in the desktop webview.
   The narrow desktop restore row no longer extends beyond its cut-paper hit area.
4. Lens Plus and Terms state that Sociobot/Dodo is merchant of record, refunds
   are handled by Sociobot/Dodo, and a refund revokes the license automatically.
5. `latest.json` will record `GITHUB_SHA`, so every public desktop release
   explicitly identifies the exact tagged source commit that built it.

## Regression coverage

- `@claim:portrait-color-pick` pastes the verifier's 100×400 red-strip/green
  image and clicks the visible red strip at 1440×900 and 390×844.
- `@claim:paste-input` pastes text first, then an image, and verifies recovery.
- `@claim:desktop-paid-flow` builds `dist/app`, serves that artifact, checks the
  registered checkout URL, and restores a verified fixture license.
- Unit coverage proves the numerical contained-image conversion. The existing
  Lens Plus price claim now asserts merchant and refund terms. The desktop
  release claim asserts the manifest commit field.

## Verification

Run from a clean checkout:

```sh
npm ci
npm test
npm run check
npm run build
cargo test --manifest-path src-tauri/Cargo.toml
npm run tauri -- build --bundles deb,rpm,appimage
```

Completed locally on 2026-08-29 UTC:

- `npm ci`: 29 packages, 0 vulnerabilities.
- `npm test`: 7 unit tests and 54 Playwright tests passed, including keyboard,
  Axe serious/critical checks, desktop and 390px flows, offline reader,
  privacy request assertions, and all claim tags.
- `npm run check`, `npm run build`, and Cargo tests passed.
- Tauri Linux packages built and launched under Xvfb (the expected timeout
  confirms the desktop process stayed open):
  - AppImage SHA-256 `db9cd57a6ba85f20f175f4a984985a180479c6cd3f1e238257b9b58b8755c320`
  - DEB SHA-256 `482c82ee707bcf6eb3b1606080574a8bc76ebf7bb20bb9ed4e346af67ba16616`
  - RPM SHA-256 `382b85818002aef8202272ab0c141d54bf79808095c6b911298e7507bbd79b44`

## Release and deployment

The repaired commit is tagged `v0.1.9`. The GitHub Actions release workflow
builds macOS arm64/x64, Windows, and Linux from that tag, keeps the release a
draft until every required installer exists, uploads SHA256SUMS and latest.json
(including the tag commit), then publishes it. The static deployment root is
`dist/site`; deployment is triggered from `main` by the factory static work
order.

## Known gaps / operator action

The generated macOS and Windows installers are unsigned. Signing would require
the owner to provide `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` as GitHub
secrets. No analytics, raw AI keys, payment-provider code, or screenshots are
added by this repair.
