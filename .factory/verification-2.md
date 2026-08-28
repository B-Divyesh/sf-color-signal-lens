# Independent verification 2 — FAIL

**Candidate:** `dc086489ccf6b27733ecc333bbec07cfd55ae6f0`
**Live URL:** https://color-signal-lens.sociobot.in
**Verified:** 2026-08-28 from a clean checkout

## First read

Cold-loading the live home page answers the required questions in plain words:
it makes status colours distinct, for people who cannot rely on red and green
in code reviews, charts, or status screens; the first action is **Try it with
sample data**, which says it opens a diff lens with nothing saved. This passes
the first-read and one-click demo requirement.

## Required claim tests — run first

After `npm ci`, every command listed in `.factory/claims.json` passed verbatim.
Each command also reran the three unit tests.

| Claim | Command | Result |
| --- | --- | --- |
| sample-lens | `npm test -- --grep @claim:sample-lens` | PASS — 1 Playwright test |
| local-screenshots | `npm test -- --grep @claim:local-screenshots` | PASS — 1 Playwright test |
| reading-cues | `npm test -- --grep @claim:reading-cues` | PASS — 1 Playwright test |
| demo-reset | `npm test -- --grep @claim:demo-reset` | PASS — 1 Playwright test |

## Passed checks

- `npm test`: PASS — 3 unit tests and 14 Playwright tests.
- `npm run check`: PASS.
- `npm run build`: PASS. Site initial JS is 23,960 bytes / 8.44 KB gzip and
  CSS is 11,660 bytes / 3.46 KB gzip.
- With the four Linux development packages named in the release workflow,
  `CI=1 npm run tauri build` produced unsigned Linux `.deb` and `.rpm`
  bundles. The first attempt on the bare container correctly exposed missing
  `glib-2.0` development metadata; this is an environment prerequisite, not
  a source error.
- `cargo test --manifest-path src-tauri/Cargo.toml`: PASS (0 Rust unit tests,
  0 doc tests).
- Live site parity: local `dist/site/assets/index-ByWc_1dB.js` and
  `style-Buj8zMM7.css` have exactly the same SHA-256 as the live files
  (`b58ffa3c…be631` and `d42e4bc3…04f4a`).
- Live `/demo` works at desktop and 390px: label, pattern, and blue/orange
  remapping visibly change the canvas; corrupt PNG recovery retains the prior
  valid screenshot and announces the corrective error; no horizontal overflow.
- Keyboard: Skip link focuses `#main`; Enter on the focused canvas moves to
  the colour input; **Start for real** opens `/lens`, which reloads correctly.
  Visible focus styling is present. Reduced motion is respected.
- Axe on live desktop and 390px demo: 0 serious/critical findings. No console
  errors or page errors occurred in either flow.
- Privacy/network: the live demo requested only its document, same-origin JS
  and CSS, and a browser-local `blob:` image URL. It made no cross-origin
  screenshot request. Landing makes the expected GitHub release-metadata
  request and no analytics request. HTTPS returns HSTS, `nosniff`, strict
  referrer policy, and a CSP matching the allowed origins. Hashed assets are
  cached `public, max-age=31536000, immutable`.
- Product-license endpoint rate limiting is enforced: 40 concurrent invalid
  verification calls yielded 30 × `200` and 10 × `429`; `429` included
  `Retry-After: 4`. The observed allowance is 30 requests for this client.

## Release-blocking defects

### Critical — no complete, verifiable desktop release

The candidate is a desktop app, yet the public `v0.1.3` release is incomplete.
It contains macOS and Linux assets but **no Windows `.msi`, `.exe`, or zip**,
and both required `SHA256SUMS` and `latest.json` return HTTP 404. The public
workflow run `33199904089` is `failure`: all macOS/Linux matrix jobs succeeded,
the Windows job failed at `tauri-apps/tauri-action@v0`, and the manifest job
was skipped. A downloaded Linux `.deb` hashed to
`a4cd2e6f3e58a46ed99de66e337463ce433fb4ae3ac7b08eb9446ea4c95dd7f1`,
but there is no published checksum with which to verify it.

Consequently `public/install.sh` exits `A matching download is not published
yet.` The release requirement for all three platforms, `SHA256SUMS`, and a
valid `latest.json` is not met.

### Medium — claim inventory is incomplete

The strict claims contract requires every visitor-reliant claim in the landing
page and README to have one tagged observable test. `.factory/claims.json`
only covers four demo claims, leaving statements such as **“Runs on your
device,” “Works from a screenshot,” “The free lens includes screenshot
reading,” “Plus saves named presets,”** and README claims about device-local
storage/capture and installer checksum verification without matching claim
entries/tests. The current unverified installer-checksum claim is particularly
contradicted by the missing `SHA256SUMS`. This is a release-blocking unlisted-
claim finding under the supplied claims contract.

## Verdict

**FAIL.** The web product, demo, privacy behavior, accessibility checks, and
candidate-to-live web parity are good. The desktop product cannot be accepted
until the failing Windows release is repaired and a successful release
publishes all platform assets, `SHA256SUMS`, and `latest.json`; then add claim
tests for the remaining product promises (or remove unsupported copy).
