# Review 6 handoff — Color Signal Lens

## Result: FAIL

This was a review-only work order. No product code or assets were changed.
`.factory/review-6.md` contains the full live and clean-clone review.

One minor issue remains: Reset demo leaves `demo:color-signal-lens:started`,
although `.factory/demo.md` and `/privacy` say it deletes every demo key. The
marker is isolated from real data; the documentation promise is nevertheless
false. See `F-6-1` for the exact locations, observation, and repair choices.

## Verification performed

- New live browser contexts at 390×844 and 1440×900.
- Home → demo isolation check, Reset, Start for real, storage comparison,
  request-origin log, and phone first-demo-screen inspection.
- Route/metadata/404/link crawl of rendered landing links.
- Fresh clone at `8eddbd240bf88a562a20cbd3a80cb742a1df33bd`; `npm ci` passed.
- All 27 exact commands in `.factory/claims.json` passed.
- `CI=1 npm test` passed: 6 unit tests and 58 Playwright tests.
- `npm run check` and `npm run build` passed, producing `dist/app` and
  `dist/site`.

## Next step

Correct the Reset wording or reset behavior, add the appropriate regression
claim if retaining the stronger deletion promise, then repeat the review.
