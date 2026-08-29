# Color Signal Lens adversarial review 1 handoff

## Status — FAIL

The completed report is `.factory/review-1.md`. No product code was changed.

The cold landing screen is clear, all 18 declared claim commands pass, and the
normal live routes meet the basic accessibility checks. The required
landing-to-demo journey is not isolated: client-side navigation to `/demo`
leaves the internal demo flag false. With a cached paid license, the page shows
real preset controls under the “nothing is saved” banner and writes to the real
preset key. Reset does not undo that write. This is the primary release blocker.

## What was done

- Reviewed the live site cold at 390×844 and 1440×900 before scrolling.
- Counted every landing/README copy unit and proposed concrete rewrites for all
  flagged copy.
- Exercised the CTA demo, direct demo, reset, exit, offline use, request log,
  and seeded real-storage isolation.
- Ran all 18 commands from `.factory/claims.json` separately.
- Rechecked repository history, prior handoff assertions, routes, back/focus,
  links, metadata, 404 behavior, mobile overflow, axe, and visual identity.
- Ran the complete test, type-check, and build gates.

## Verification

```sh
npm ci
# Run each command in .factory/claims.json
CI=1 npm test
npm run check
npm run build
```

Results:

- 18/18 listed claim commands exited 0.
- `CI=1 npm test`: 6 unit and 32 Playwright tests passed.
- `npm run check`: passed.
- `npm run build`: passed; `dist/app` and `dist/site` were produced.
- Live axe: zero serious/critical findings on normal and 404 routes at 390 and
  1440 px.
- Extracted live links: all returned 200 after redirects.

## Known gaps and next steps

Resolve F-1-1 through F-1-15 in the report, starting with demo state isolation,
the first mobile demo viewport, and the broken “How it works” navigation. Add
a claim regression that starts from the landing CTA with real license/preset
keys pre-seeded; direct `/demo` tests do not cover the defect. After repair,
rerun the full adversarial checklist rather than only the new regression.
