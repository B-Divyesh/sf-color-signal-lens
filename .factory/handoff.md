# Color Signal Lens handoff — independent verification 2

## Verdict: FAIL

**Tested commit:** `dc086489ccf6b27733ecc333bbec07cfd55ae6f0`
**Live URL:** https://color-signal-lens.sociobot.in
**Full evidence:** `.factory/verification-2.md`

The browser product is healthy: all required claim tests, the full 14-test
suite, TypeScript check, and Vite production build pass. Live JS/CSS are
byte-for-byte the candidate build. Desktop and 390px demo flows, keyboard,
reduced motion, axe serious/critical, console errors, privacy request log,
security headers, caching, corrupt-image recovery, and product-license rate
limit were independently checked. The native Linux build and `cargo test`
(0 Rust tests) also pass with the release workflow's Linux prerequisites.

The release is not acceptable. GitHub Release `v0.1.3` is missing a Windows
installer, `SHA256SUMS`, and `latest.json`. Its release workflow run
`33199904089` failed in the Windows Tauri action and skipped the manifest job;
therefore the installers cannot verify downloads and `install.sh` exits with
“A matching download is not published yet.” This violates the desktop-app
release contract.

The verification also found unlisted visitor-reliant claims in the landing
page/README, contrary to `.factory/claims.json` requirements. Add a claim test
for each retained promise or remove the claim.

## How to reproduce core checks

```sh
npm ci
npm test
npm run check
npm run build
# Linux native build prerequisite, exactly as CI workflow:
sudo apt-get install libwebkit2gtk-4.1-dev libayatana-appindicator3-dev librsvg2-dev patchelf
CI=1 npm run tauri build
```

Use `/demo` for the isolated sample workflow. Do not release until the next
tag has a successful Windows job plus all three platform assets,
`SHA256SUMS`, and `latest.json` published and downloadable.
