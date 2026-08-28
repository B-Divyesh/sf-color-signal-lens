# Independent verification 4 — FAIL

**Candidate:** `84a672c0fd7cb0e499ed6fe34482545b703b72f3`  
**Live URL:** https://color-signal-lens.sociobot.in  
**Verified:** 2026-08-28 from a clean checkout

## Verdict

**FAIL — release-blocking installer defect.** The live web picker correctly
offers separate Intel and Apple-Silicon downloads, but the advertised macOS
one-line installer still selects the first `.dmg` without using the detected
CPU. v0.1.5 lists the Apple-Silicon artifact first, so an Intel Mac running the
documented `install.sh` would download the wrong build.

## First read and demo

A cold live load plainly says the tool **makes status colors distinct**, for
**people who cannot rely on red and green during code reviews, charts, or
status screens**. The first primary action is **Try it with sample data**, and
the adjacent text says it opens a diff lens with nothing saved. It passes the
plain-words first-read requirement and the action opens `/demo` in one click.

## Mandatory claims gate

After `npm ci`, every exact command in `.factory/claims.json` passed from the
demo-capable clean checkout:

| Claim | Result |
| --- | --- |
| `sample-lens` | PASS |
| `local-screenshots` | PASS |
| `reading-cues` | PASS |
| `demo-reset` | PASS |
| `screenshot-input` | PASS |
| `capture-consent` | PASS |
| `named-presets` | PASS |
| `lens-plus-price` | PASS |
| `installer-checksums` | PASS |
| `desktop-release` | PASS |
| `macos-installer-architecture` | PASS |

The browser claims were rerun with `CI=1` to ensure isolated production-style
web-server lifecycles. The unit claim commands also passed verbatim.

## Passing evidence

- `CI=1 npm test`: PASS — 5 unit tests and 19 Playwright tests.
- `npm run check`: PASS.
- `npm run build`: PASS. Site JS is 24,362 bytes (8.59 KB gzip) and CSS is
  11,717 bytes (3.47 KB gzip), within the static budget.
- `cargo test --manifest-path src-tauri/Cargo.toml`: PASS after installing the
  standard Linux Tauri development prerequisites in this disposable container.
- Live candidate parity: locally built `index-Bfd88mPv.js` and
  `style-JtR872QB.css` byte-match the served files by SHA-256
  (`f064174d033a35…` and `49fdf5caeb5d…`).
- Live `/demo` desktop and 390px checks passed: patterns, labels, and blue or
  orange remapping change the lens; an invalid PNG announces the corrective
  error while retaining the prior image; reset restores isolated sample data;
  Start for real reaches the empty, reloadable `/lens` workspace.
- Keyboard checks passed: skip link reaches `main`; Enter on the canvas moves
  to the colour input; radios operate with ArrowDown; the live focus outline is
  a visible 3px white outline. Reduced-motion CSS removes transforms.
- Live Axe checks: 0 serious/critical findings on desktop `/demo`, 390px
  `/demo`, and landing. The demo has one minor `aria-allowed-role` finding.
  No console or page errors occurred in checked flows.
- Privacy/network: during lens use the live demo made only same-origin
  document, JS, CSS, and a local `blob:` request. No screenshot or analytics
  request left the origin. Landing additionally makes the expected GitHub
  release-metadata request. Response headers include HSTS, `nosniff`, strict
  referrer policy, and CSP; hashed assets are immutable for one year.
- Product-unlock rate limit: 30 sequential invalid verification requests from
  one client returned 200; request 31 and later returned **429** with
  `Retry-After: 0` and `x-ratelimit-after: 0`. Observed allowance: 30 requests
  per client window.
- Public release `v0.1.5` includes both macOS architectures, Windows, Linux,
  `SHA256SUMS`, and `latest.json`. Downloaded
  `Color.Signal.Lens_0.1.5_amd64.deb` verifies successfully against
  `SHA256SUMS`.

## Defects

### High — documented macOS installer gives Intel Macs Apple-Silicon build

`README.md` advertises:

```sh
curl -fsSL https://color-signal-lens.sociobot.in/install.sh | sh
```

`public/install.sh` obtains `arch=$(uname -m)` but never references `$arch`.
Its selection is:

```sh
grep -Ei "$match" | head -n 1
```

For the public v0.1.5 release, the first matching DMG is
`Color.Signal.Lens_0.1.5_aarch64.dmg`; the correct Intel artifact is
`Color.Signal.Lens_0.1.5_x64.dmg`. Therefore the supported Intel-macOS path
downloads an incompatible installer despite the landing-page repair. The
existing `macos-installer-architecture` claim only exercises browser links,
not this public installer command.

**Retest condition:** make `install.sh` select `_x64.dmg` for `x86_64` / `i386`
and `_aarch64.dmg` for `arm64` / `aarch64`, fail clearly on an unknown Mac CPU,
and add an observable claim-level fixture test for both paths. Publish the
changed script and rerun the release checksum and Intel-macOS installer checks.

### Low — unknown paths return HTTP 200

`/not-a-real-page` renders the designed in-app “This paper layer is missing”
screen, but the live server responds `200 text/html` because the navigation
fallback serves `index.html`. This is not a functional navigation failure, but
it is not a true HTTP 404 for crawlers.

## Native build status

After installing the normal Linux Tauri prerequisites, `cargo test
--manifest-path src-tauri/Cargo.toml` passed. The exact `CI=1 npm run tauri
build` completed its release compilation and produced `.deb` (3,732,606 bytes)
and `.rpm` (3,734,971 bytes) outputs in this container, but did not emit an
`.AppImage`. The public release does contain an AppImage; this local
Ubuntu-24.04 AppImage-packaging result should be reproduced on the workflow's
Ubuntu 22.04 runner when repairing the blocking installer defect.
