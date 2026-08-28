# Color Signal Lens handoff — repair v0.1.3

**Base verified:** `5dc4c99e50e4e708373dd58ddffeaecc384d0b41`
**Repair scope:** every release-blocking finding in verifier report
`19114a4f9351f96381acb4a8cec16130feee8c4d`.

## Repaired

1. Desktop release workflow now waits for every platform build before creating
   `SHA256SUMS` and `latest.json`, including per-platform download URLs. The
   repair is released as tag `v0.1.3`.
2. Landing download discovery calls the GitHub releases collection endpoint,
   which returns `200 []` before a release exists, rather than requesting the
   404-producing `releases/latest` endpoint. The calm fallback remains.
3. Screen capture no longer invokes a Rust whole-primary-display command. The
   user explicitly opens the platform picker, then selects a crop in an
   accessible modal before any region is added to the lens. The native capture
   dependencies and command were removed.
4. `/lens` is a real SPA route in the static build and reloads directly. Leaving
   demo discards its sample image before opening that workspace.
5. Header, demo, radio-row, and inline-link targets have 44px hit areas at
   390px. Desktop and 390px axe scans pass. Keyboard skip-link and canvas to
   colour-input movement are covered.
6. File and paste image input now decodes before replacing the active image;
   corrupt input preserves the last valid image and announces a corrective
   error.
7. Hashed `/assets/*` responses are configured for immutable one-year caching.
   The Tauri launcher also converts inherited `CI=1` to Tauri's required
   `CI=true` so `npm run tauri build` works in the clean worker.

## Verification evidence

Run from a clean install:

```sh
npm ci
npm test
npm run check
npm run build
CI=1 npm run tauri build
cargo test --manifest-path src-tauri/Cargo.toml
```

Results on 2026-08-28:

- `npm ci`: pass, 0 reported vulnerabilities.
- `npm test`: pass — 3 unit tests and 11 Playwright tests (14 total), including
  claim tests, desktop and 390px axe scans, keyboard flow, deep-link reload,
  corrupt-image recovery, capture-region selection, API fallback, touch-target
  sizing, and immutable-cache configuration.
- `npm run check`: pass.
- `npm run build`: pass. Site JS is 23,960 bytes / 8.44 KB gzip; CSS is 11,660
  bytes / 3.46 KB gzip.
- `CI=1 npm run tauri build`: pass after the launcher normalization. Local
  Linux v0.1.1 artifacts include `.deb` (3,051,978 bytes) and `.rpm`
  (3,053,888 bytes). `cargo test` passes (0 Rust tests).
- Browser checks cover desktop and 390px demo, keyboard focus, reduced-motion
  styling, and no serious or critical axe findings. Claim tests retain the
  original sample, local-only screenshot, cues, and demo reset behavior.

## Deployment and operator notes

The repaired `dist/site` was deployed to the existing static site at
https://color-signal-lens.sociobot.in. Pushing `v0.1.3` runs
`.github/workflows/release.yml`, which builds
unsigned macOS arm64/x86_64, Windows, and Linux release assets and publishes
checksums and `latest.json`. The site then resolves its platform button from
that published release.

The desktop installers are unsigned. macOS users may need right-click → Open;
Windows users may need to confirm the app. Optional signing requires owner
secrets `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX`; no signing secret is stored
in this repository. No telemetry, analytics, or screenshot upload was added.
