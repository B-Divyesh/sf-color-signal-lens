# Color Signal Lens — independent verification 9 handoff

## Result: FAIL

Candidate `010c3a259cbb8b865f33009b6e2f837cc37ec054` at
https://color-signal-lens.sociobot.in is **not release-ready**.

The live site, free reader, first-read demo, accessibility checks, privacy
flow, performance budgets, build, and release identity pass. The shipped
desktop paid flow does not: the Sociobot verification endpoint does not allow
Tauri production origins, so the installed app reports that every uncached
license cannot be checked. See `.factory/verification-9.md` for full evidence.

## Release blockers

1. **High:** real desktop license verification/restore is blocked by CORS.
   `https://color-signal-lens.sociobot.in` receives an allow-origin header;
   `tauri://localhost` and `http(s)://tauri.localhost` do not. Both the public
   and locally built AppImages reproduced the unavailable-license state while
   the API returned HTTP 200 from the host.
2. **Medium:** the license input measures 34.61×48.34 px at the app's default
   1180×810 size, below the required 44 px target width.
3. **Medium:** desktop **How it works** points to `/#how`, but desktop mode has
   no `#how` destination.
4. **Low:** `.factory/copy-audit.md` still records `v0.1.8` and omits new
   `v0.1.9` copy.

## Verification completed

- All 25 exact claim commands pass after `npm ci`.
- `npm test`: 7 Node/unit and 54 Playwright tests pass.
- `npm run check` and `npm run build` pass.
- Cargo tests pass (0 Rust tests).
- Tauri DEB, RPM, and AppImage production bundles build successfully.
- Live HTML/JS/CSS match the candidate build byte-for-byte.
- Public `v0.1.9`, its `latest.json`, and tag identify the candidate commit.
- Hosted `install.sh` verifies and installs the current AppImage; its published
  SHA-256 is
  `6c4737c767fea76df55a3fc1a1433e9090328beee9fffac8b5d2f9c82c976456`.
- Desktop/mobile core flows, portrait selection, paste recovery, capture
  consent/cropping, demo isolation, keyboard, reduced motion, Axe, headers,
  request privacy, and link/status checks were exercised.
- Lighthouse mobile: 99 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 2.0 s, TBT 60 ms, CLS 0.
- Unlock API allowance: 30 successful requests; request 31 returned 429 with
  `Retry-After: 3`.

## How to reproduce the primary failure

1. Install and open the current Linux AppImage.
2. Scroll to Lens Plus and choose **Restore license**.
3. Paste any uncached invalid token and choose **Restore license**.
4. Observe “The license could not be checked,” although the endpoint itself
   returns an invalid verdict with HTTP 200.
5. Compare response headers with these origins:

```sh
curl -sS -D - -o /dev/null \
  -H 'Origin: https://color-signal-lens.sociobot.in' \
  'https://api.sociobot.in/api/v1/products/color-signal-lens/verify?license=test'

curl -sS -D - -o /dev/null \
  -H 'Origin: tauri://localhost' \
  'https://api.sociobot.in/api/v1/products/color-signal-lens/verify?license=test'
```

The first response has `Access-Control-Allow-Origin`; the second does not.

## Next steps

- Use a tightly scoped native Tauri request command or explicitly support all
  real Tauri origins at the verification endpoint.
- Add a release test that uses the production desktop origin and does not mock
  the verification request.
- Stack or wrap the restore controls so the input remains at least 44 px wide.
- Remove the desktop **How it works** link or provide a real destination.
- Regenerate `.factory/copy-audit.md`, then publish a new version and retest its
  actual installer.

No product code was modified during verification. macOS and Windows installers
remain unsigned and require the operator's signing certificates.
