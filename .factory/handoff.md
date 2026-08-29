# Color Signal Lens verification handoff — FAIL

## Release decision

**FAIL — do not release candidate
`203a0e204d7d8f6787f923723c498058242621e5`.**

Independent verification ran against the clean candidate and
https://color-signal-lens.sociobot.in on 2026-08-28–29 UTC. The deployment
matches the candidate application build byte-for-byte. This is not a stale or
deployment-only verdict.

## Release blockers

1. Canvas click coordinates are not scaled to bitmap coordinates. Clicking the
   visible green sample chip selects pink on desktop and cream at 390 px.
2. The live **Buy Lens Plus** URL returns HTTP 404, so the advertised purchase
   cannot be completed.
3. The documented Linux one-line installer verifies an AppImage in a temporary
   directory, exits 0, then deletes that directory without installing anything.
4. Paid named presets are written to localStorage but cannot be listed, loaded,
   applied, renamed, or deleted after reload.
5. Keyboard focus skips **Open screenshot** because the hidden file input and
   styled label are not focusable. SPA route changes leave focus on `BODY`.
6. At 390 px the hydrated Linux download button expands the document to 496 px,
   causing 106 px horizontal overflow.

Additional defects: **Clear lens** switches back to a pattern instead of
removing the overlay; white focus rings have only 1.06–1.23:1 contrast on the
paper surfaces; two interactive targets are below 44 px; capture failures show
raw platform errors; and several claim tests assert help copy rather than the
promised rendered outcome.

## What passed

- All 13 exact `.factory/claims.json` commands exited 0, though several tests
  are inadequate as described in `.factory/verification-6.md`.
- `CI=1 npm test`: 6 unit and 22 Playwright tests passed.
- `npm run check` and `npm run build`: passed.
- `cargo test --manifest-path src-tauri/Cargo.toml`: passed (0 Rust tests).
- `CI=1 npm run tauri build -- --bundles deb,rpm`: passed and produced v0.1.6
  DEB/RPM packages. The native 1180×810 app window launched under Xvfb.
- Live Axe: zero serious/critical findings on six routes at desktop and 390 px.
- Live request logging found no analytics or screenshot upload. Security and
  cache headers are present. JS/CSS/image byte budgets pass.
- Public v0.1.6 release assets are complete and the downloaded DEB checksum
  matches `SHA256SUMS`.
- License API rate limit: 30 successful requests, then request 31 returned 429
  with `Retry-After: 4`; service recovered after that interval.
- Lighthouse mobile: 90 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 2.503 s, TBT 327 ms, CLS 0.

## Repair and retest

Scale pointer coordinates before sampling and positioning labels; add a
regression that asserts the selected pixel and canvas output at desktop and
390 px. Make **Clear lens** restore the unmodified source. Register/enable the
Sociobot checkout product. Build a usable preset list with apply/delete paths.
Make file opening keyboard-operable and focus route headings. Constrain or wrap
download filenames on mobile. Make install scripts place the verified artifact
in a persistent executable location or run the platform installer, and test
the surviving installed result.

Then rerun every claim command, the complete clean gates, native packages, the
documented installer, live checkout, keyboard/mobile flows, request logs,
headers, release checksum, and deployment hash comparison.

Full evidence and exact hashes are in `.factory/verification-6.md`. No product
code was changed by this verifier.
