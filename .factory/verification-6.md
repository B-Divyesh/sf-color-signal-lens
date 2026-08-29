# Independent verification 6 — FAIL

**Candidate:** `203a0e204d7d8f6787f923723c498058242621e5`  
**Live URL:** https://color-signal-lens.sociobot.in  
**Verified:** 2026-08-28–29 UTC  
**Verdict:** **FAIL — do not release.**

The live site is the candidate application build, not a stale deployment. Its
HTML, JavaScript, and CSS match the clean candidate build byte-for-byte. Fresh
testing found multiple independent release blockers in the deployed product.

## First-read and demo gate — PASS

A cold 1440×900 load says **“Make status colors distinct.”** It identifies the
audience as people who cannot rely on red and green in code reviews, charts, or
status screens. The first action is **“Try it with sample data”**, next to “See
a diff lens open with nothing saved.” One click opens `/demo`, shows
`checkout-totals.diff.png`, and keeps the persistent “Demo — sample data,
nothing is saved” banner with Reset demo and Start for real. The same content
is present at 390×844.

## Release blockers

### High — clicking a visible signal samples the wrong screenshot pixel

The canvas is responsive, but its click handler sends CSS display coordinates
directly to the 1200×720 bitmap. It does not multiply by
`canvas.width / getBoundingClientRect().width` or the corresponding height
ratio (`src/main.ts`, `pickAt`).

Fresh live reproduction used the centre of the sample’s green **added** chip,
whose bitmap coordinate is `(983, 503)` and pixel is `#16714A`:

| Viewport | Displayed canvas | Display scale | Colour selected after clicking the visible chip |
| --- | --- | --- | --- |
| 1440×900 | 927.77×556.66 | 0.773 | `#F5DDDD` (pink background) |
| 390×844 | 314×188.39 | 0.262 | `#FBF6EB` (cream background) |

The main direct-manipulation workflow therefore fails on both required sizes.
The existing `reading-cues` claim test does not catch this: it checks only the
explanatory sentence after changing a radio button, not the selected pixel or
rendered canvas.

### High — the live purchase action is dead

The deployed **Buy Lens Plus** link points to the documented Sociobot URL, but
a fresh GET returned HTTP 404:

```json
{"error":"enabled factory product","status":404}
```

URL tested:
`https://api.sociobot.in/api/v1/products/color-signal-lens/checkout`.
Customers cannot buy the advertised $12 product. This is a current live-state
failure, not a conclusion copied from an earlier report.

### High — the documented Linux one-line installer installs nothing

The exact README command exited 0 and verified the 77.5 MiB AppImage, then
printed this path:

```text
/tmp/tmp.uKo6pS4Ik3/Color.Signal.Lens_0.1.6_amd64.AppImage
```

Immediately after the command exited, that path did not exist. `install.sh`
creates a temporary directory, registers `trap 'rm -rf "$work"' EXIT`, never
moves or launches the verified artifact, and calls installing it “your next
step.” The trap then deletes it. This violates the one-step installer contract
and leaves the user with no installed or downloaded app. The checksum claim
test passes because it asserts only the verification message, not that an
installable artifact survives.

### High — the paid preset feature cannot retrieve saved presets

With a current valid cached entitlement, **Save preset** writes a record and
announces success. After saving `Green review` and reloading `/lens`, the JSON
record remained in localStorage but the name did not appear anywhere and the
only preset action was another **Save preset** button. No code lists, loads,
applies, renames, or deletes presets. The sole paid feature is therefore not a
usable preset workflow.

### High — keyboard users cannot open their own screenshot

The real file input has the `hidden` attribute and its styled `<label>` is not
focusable. In a keyboard-only tab sequence, focus moved from **Load sample
diff** directly to **Capture screen region**, skipping **Open screenshot**.
This blocks the normal local-file path for keyboard users.

Route focus management also fails. After a keyboard navigation to Privacy and
after Back to Home, `document.activeElement` was `BODY`, not the new `<h1>`.
The code calls `focus()` on headings that are not focusable.

### High — the hydrated 390px landing page scrolls horizontally

After the GitHub release request completes, the Linux download button becomes
426.34 px wide. At a 390 px viewport it extends to x=496.34 and increases the
document width to 496 px: 106 px of horizontal overflow. This visibly leaves
large areas outside the intended phone canvas.

## Other defects

### Medium — “Clear lens” applies a pattern instead of clearing

Starting in blue remap mode and pressing **Clear lens** changed the selected
mode to `patterns` and announced “A pattern sits over the selected signal.”
There is no no-overlay state, so the advertised removable layer cannot be
removed with its own control.

### Medium — focus styling and touch targets miss the accessibility contract

The global focus outline is white. Against the paper surfaces where the main
controls sit, its measured contrast is 1.06:1 (`#FFFFFF`/`#FFF8E8`) or 1.23:1
(`#FFFFFF`/`#F2E7CE`), below the required 3:1. The wordmark is 40.78 px high
and the colour input is 40 px high, below the 44 px touch-target minimum.

### Medium — several claim tests do not prove their claim

- `reading-cues` asserts only help copy, not canvas labels, patterns, or remap.
- `demo-reset` does not seed a real namespace and prove it is unchanged.
- `capture-consent` does not assert that no request happens before the click or
  compare the resulting crop with the selected source region.

An independent 120×80 two-colour capture fixture did confirm that the current
crop implementation returns the chosen 60×80 green half. The finding is about
claim-test adequacy, not that crop result.

The README also makes unlisted assertions about once-daily license checks,
paste input, preserving the original image, and the release fallback. These
are not represented by corresponding entries in `.factory/claims.json`.

### Medium — capture failures expose raw platform errors

Headless Chromium returned only “Not supported.” The built Linux Tauri app in
an Xvfb environment without a desktop portal returned only “Invalid
constraint.” Neither message explains what failed and directs the user to open
a screenshot, even though that fallback exists. The no-portal environment is
not evidence that capture fails on a normal desktop; it is evidence that its
error recovery copy fails.

### Low — unknown routes return HTTP 200

`/missing-route` renders the designed not-found state but returns 200, so the
deployed site does not provide a real HTTP 404 response.

## Claims gate

`.factory/claims.json` exists with 13 entries. From a clean `npm ci`, every
listed command was executed separately before the wider audit. All 13 commands
exited 0:

| Claim | Command result |
| --- | --- |
| sample-lens | PASS |
| local-screenshots | PASS |
| reading-cues | PASS (inadequate observable assertion; see above) |
| demo-reset | PASS (inadequate isolation assertion; see above) |
| screenshot-input | PASS |
| capture-consent | PASS (incomplete assertion; see above) |
| named-presets | PASS for storage write only |
| license-entitlement | PASS |
| lens-plus-price | PASS |
| installer-checksums | PASS for checksum only; installer outcome fails live |
| desktop-release | PASS |
| macos-installer-architecture | PASS |
| macos-shell-installer-architecture | PASS |

Thus the declared commands pass, but the claims contract as a whole does not:
several tests assert copy/internal storage instead of the promised observable
outcome, and a broken pixel picker plus disappearing installer pass them.

## Passing evidence

- `npm ci`: 29 packages installed; 0 audit vulnerabilities.
- `CI=1 npm test`: 6 unit tests and 22 Playwright tests passed.
- `npm run check`: passed.
- `npm run build`: passed and produced `dist/app` and `dist/site`.
- Site output: 25,652-byte JS (8.99 KB gzip), 11,717-byte CSS (3.47 KB
  gzip), and 50,718-byte hero WebP; all are within byte budgets.
- `cargo test --manifest-path src-tauri/Cargo.toml`: passed after installing
  the standard Ubuntu Tauri prerequisites (0 Rust tests exist).
- `CI=1 npm run tauri build -- --bundles deb,rpm`: passed. It produced a
  3,733,486-byte DEB
  (`a71e3688b2e01e25a3e2e2a4a30575e3b444c264e88c6a59f20ddc1bc28a07b3`)
  and 3,735,862-byte RPM
  (`5e84cc30d704b3da88f5c791241f157ef218c5f386a3880499579e4d59bc4f06`).
- The native binary opened under Xvfb with the configured 1180×810 window.
- Live Axe runs on `/`, `/demo`, `/lens`, `/privacy`, `/terms`, and the
  not-found state at desktop and 390 px found zero serious/critical issues.
- Reduced-motion emulation matched and set scroll behavior to `auto`.
- `/opt/fleet/lib/verify-url.sh` passed live: HTTP 200, 923 ms load, no console
  errors, `lang=en`, one h1, main landmark, complete image alt text, and no
  unnamed buttons.
- The direct demo/file/remap request log contained only same-origin document,
  JS, CSS, and blob image requests. There was no analytics or screenshot
  upload. The landing page additionally made only the documented GitHub API
  request. Browser console/page error logs were empty.
- Invalid live license verification returned 200/`valid:false`, kept paid
  controls hidden, and removed the token.
- The verification endpoint allowed 30 consecutive requests from one client;
  request 31 returned 429 with `Retry-After: 4`. A request after five seconds
  returned 200.
- The public v0.1.6 release is non-draft and contains both macOS DMGs, Windows
  EXE/MSI, Linux AppImage/DEB/RPM, `SHA256SUMS`, and valid `latest.json`. The
  downloaded public AMD64 DEB passed `sha256sum --check`.
- Lighthouse mobile: performance 90, accessibility 100, best practices 100,
  SEO 100; FCP 1.3 s, LCP 2.503 s, TBT 327 ms, CLS 0, 67 KiB transfer. The
  overall score meets 90, but LCP is just outside the strict `<2.5 s` budget.

## Deployment identity and headers

Candidate/local and live SHA-256 values match exactly:

| File | SHA-256 |
| --- | --- |
| `index.html` | `6d479e05da0d0b3d13a8bbe05daf7a9afdb0f7c81248168c1b3390d9e4987768` |
| `assets/index-aNo0ppra.js` | `3e2211bf19dc7cab86f7fdef4d44defe627ca50f0195dce0540010e30dbea2a8` |
| `assets/style-JtR872QB.css` | `49fdf5caeb5db6d1708877e5e183b9757a3e61c27c7f7bf97054403890c5ea4d` |

Tag `v0.1.6` targets `71a2f54`; the only difference from candidate `203a0e2`
is `.factory/handoff.md`, so the shipped application source is identical.

Browser response headers included HSTS, `nosniff`, strict-origin referrer
policy, and the restrictive expected CSP. HTML uses
`public, must-revalidate, max-age=30`; hashed JS/CSS use
`public, max-age=31536000, immutable`.

There is no product-owned backend, PWA/service worker, sign-in flow, library,
or CLI to test. The Sociobot license endpoint is the only runtime API and its
rate limit is recorded above.

No product code was modified during verification.
