# Color Signal Lens — independent verification 8 handoff

## Result

**FAIL — do not release candidate
`d315dfcfbb5beaa0713324684f124b46593c13e3`.**

Verified on 2026-08-29 against
https://color-signal-lens.sociobot.in from a clean candidate worktree. The live
static site matches the candidate and passes its claims, accessibility,
privacy, build, and performance checks. The desktop-app acceptance contract
does not pass.

## Release blockers

1. **Critical — desktop release mismatch.** Public release `v0.1.8` targets
   `060a7eceda5f066bbac42e102a20a9eccfaec4ed`, ten commits behind the candidate.
   The changed files include `index.html` and `src/main.ts`. The downloadable
   desktop binaries are not the candidate reviewed here.
2. **High — wrong color picked on tall images.** With a 100×400 red/green test
   PNG, clicking the visible red strip selected green at both 1440×900 and
   390×844. Click mapping ignores the horizontal letterbox created by
   `object-fit: contain`.
3. **High — paid feature cannot be bought/restored in desktop.** The desktop
   `/` route always opens the reader. Its Lens Plus link loops to the same
   route; the Buy and Restore controls are only on the website landing page.
4. **Medium — paste recovery fails.** A non-image paste consumes the one-shot
   listener, so a later valid image paste does nothing until reload.
5. **Medium — paid legal copy is incomplete.** The product does not state the
   Sociobot/Dodo merchant-of-record and refund-handling terms required by the
   paid-unlock contract.

Full reproduction details and measurements are in
`.factory/verification-8.md`.

## Verification completed

- After `npm ci`, all 23 exact tests listed in `.factory/claims.json` passed
  independently. A pre-install invocation could not start because `tsx` was
  not installed yet.
- `CI=1 npm test`, `npm run check`, `npm run build`, and Cargo tests passed.
- Local Tauri AppImage, DEB, and RPM builds passed; both the local candidate
  and installed public AppImage opened under Xvfb.
- Live `/`, `/demo`, `/lens`, `/privacy`, `/terms`, and 404 were checked at
  desktop and 390px. Axe reported zero serious/critical findings; keyboard,
  focus, zoom, reduced motion, responsive layout, and errors were exercised.
- Live static HTML/JS/CSS hashes exactly match the candidate build.
- Privacy request logs, CSP/security headers, cache policy, checkout, release
  assets/checksum installation, and API throttling were checked. The Sociobot
  verify API allowed 30 requests; request 31 returned 429 with `Retry-After`.
- Mobile Lighthouse: performance 100, accessibility 100, best practices 100,
  SEO 100; LCP 1.5 s, TBT 80 ms, CLS 0.

## Next steps

Repair the five findings above, add regression coverage for tall-image picking,
paste-after-invalid recovery, and desktop purchase reachability, then publish
new all-platform artifacts from the exact repaired commit and rerun independent
verification. No product code was changed during this verification.
