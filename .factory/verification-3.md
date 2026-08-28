# Independent verification 3 — FAIL

**Candidate:** `a18e29517ca36d460b5c6d54fa62aa4fa6d05605`  
**Live URL:** https://color-signal-lens.sociobot.in  
**Verified:** 2026-08-28 from a clean checkout

## Verdict

**FAIL.** The repaired release is complete and most product checks pass, but
the live installer picker gives Intel Mac users the Apple-Silicon installer
while saying it matches their computer. That is a false, release-blocking
installation promise for a supported desktop platform.

## First read

Cold-loading the live home page says it **makes status colors distinct**, for
**people who cannot rely on red and green during code reviews, charts, or
status screens**. The first action is **Try it with sample data** and its
adjacent explanation says it opens a diff lens with nothing saved. It passes
the plain-words first-read and one-click demo requirements.

## Mandatory claims gate

After `npm ci`, I ran every command in `.factory/claims.json` verbatim from
the demo-capable clean checkout. All passed.

| Claim | Result |
| --- | --- |
| `sample-lens` | PASS — `npm test -- --grep @claim:sample-lens` |
| `local-screenshots` | PASS — `npm test -- --grep @claim:local-screenshots` |
| `reading-cues` | PASS — `npm test -- --grep @claim:reading-cues` |
| `demo-reset` | PASS — `npm test -- --grep @claim:demo-reset` |
| `screenshot-input` | PASS — `npm test -- --grep @claim:screenshot-input` |
| `capture-consent` | PASS — `npm test -- --grep @claim:capture-consent` |
| `named-presets` | PASS — `npm test -- --grep @claim:named-presets` |
| `lens-plus-price` | PASS — `npm test -- --grep @claim:lens-plus-price` |
| `installer-checksums` | PASS — `npm run test:unit -- --test-name-pattern=@claim:installer-checksums` |
| `desktop-release` | PASS — `npm run test:unit -- --test-name-pattern=@claim:desktop-release` |

## Passing evidence

- `npm test`: PASS — 5 unit tests and 18 Playwright tests.
- `npm run check`: PASS.
- `npm run build`: PASS. Site JS is 23,805 bytes (8.39 KB gzip); CSS is
  11,660 bytes (3.46 KB gzip).
- `cargo test --manifest-path src-tauri/Cargo.toml`: PASS (no Rust tests).
  The initial clean-container attempt correctly reported absent Tauri Linux
  development libraries; after installing the standard workflow prerequisites
  (`libwebkit2gtk-4.1-dev`, `libayatana-appindicator3-dev`,
  `librsvg2-dev`, and `patchelf`) the Rust test completed.
- Exact native production build `CI=1 npm run tauri build`: PASS after those
  prerequisites. It produced Linux AppImage (78,264,824 bytes), `.deb`
  (3,732,362 bytes), and `.rpm` (3,734,708 bytes) bundles under
  `src-tauri/target/release/bundle/`.
- Live candidate parity: local `dist/site/assets/index-CE0a18VH.js` and
  `style-Buj8zMM7.css` exactly match the live files by SHA-256:
  `ff156715…55830b5` and `d42e4bc3…2304f4a`. The candidate's post-release
  commit is documentation only; the live product bundle is the candidate
  bundle.
- Live desktop and 390px `/demo`: no horizontal overflow; labels, patterns,
  and remapping visibly change the canvas. A corrupt PNG retains the valid
  image and announces the corrective error. A mocked display picker required
  a selected region, produced `Selected screen region`, and stopped its track.
- Keyboard: the skip link focuses `#main`; Enter on the focused canvas moves
  to the colour input. Focus indicators are visible. Reduced motion is active
  with `prefers-reduced-motion: reduce`.
- Axe on live desktop and live 390px demo: 0 serious/critical findings.
  No console or page errors occurred in the checked flows.
- Privacy/network: the live demo requested only the same-origin document,
  script, and CSS; no screenshot or analytics request left the origin. The
  landing page made only its expected GitHub release-metadata request in
  addition to same-origin assets. HTTPS supplies HSTS, `nosniff`, strict
  referrer policy, and a CSP with only `api.github.com` and
  `api.sociobot.in` as connect exceptions. Hashed assets use
  `Cache-Control: public, max-age=31536000, immutable`.
- License verification allowance: 40 simultaneous invalid verification calls
  resulted in 30 × `200` followed by 10 × `429` with `Retry-After: 4`.
  Observed allowance: 30 requests per client window.
- The public `v0.1.5` release has macOS, Windows, Linux, `SHA256SUMS`, and
  `latest.json`. Downloaded
  `Color.Signal.Lens_0.1.5_amd64.deb` SHA-256 was
  `5fea50b650fae2c58dbe3b84686cd730d56bf35f469a6745dc9a1e79c33fa30b`,
  exactly matching `SHA256SUMS`; its package metadata reports version 0.1.5
  and architecture amd64.

## Defects

### High — Intel Mac download is the wrong CPU architecture

The landing page promises, **“The current download matches your computer.”**
Using an Intel macOS user agent
(`Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) …`), it instead selected:

`Color.Signal.Lens_0.1.5_aarch64.dmg`

The same release contains the correct Intel artifact,
`Color.Signal.Lens_0.1.5_x64.dmg`, but `hydrateDownload()` uses the first
`.dmg` it sees and does not distinguish macOS architectures. The selected
Apple-Silicon app does not match the stated Intel computer. Linux selected its
AppImage and Windows selected its x64 setup executable correctly.

This also has no dedicated entry and observable tagged test in
`.factory/claims.json`, despite the user-reliant “matches your computer”
claim. Add architecture-aware macOS selection (or clearly offer both choices)
and a claim-level browser test for Intel and Apple-Silicon paths before
release.

## Retest condition

Publish a bundle that selects the x64 DMG for Intel Macs and the aarch64 DMG
for Apple-Silicon Macs (or exposes an explicit, truthful choice); add and run
the corresponding claim test. Then rerun the live installer-selection check
alongside the existing release checksum verification.
