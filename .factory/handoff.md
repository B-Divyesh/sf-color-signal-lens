# Color Signal Lens adversarial review 2 handoff

## Result

Verdict: **FAIL**.

The complete report is in `.factory/review-2.md`. No product code was changed.
The review reopens F-1-6, F-1-7, and F-1-9 as blocking findings and records four
new findings (F-2-1 through F-2-4).

## What was checked

- Cold live first read at 390×844 and 1440×900.
- Pixel 7 and iPhone 13 download behavior.
- One-click demo, reset, exit, real-key isolation, request logging, and loaded
  offline behavior.
- Every earlier review/polish finding against live behavior and current code.
- Landing and README copy, including conditional download/license states.
- Claims inventory and every listed command from a fresh clone.
- Titles, metadata, routes, 404, history, links, accessibility, bundle size,
  and visual identity.

## Verification

From fresh clone `/tmp/color-signal-lens-review2.bLoPzV`:

```sh
npm ci
# Each command in .factory/claims.json was run independently: 23/23 passed.
CI=1 npm test
npm run check
npm run build
```

Results:

- Full suite: 6 unit tests and 39 Playwright tests passed.
- Type check passed.
- Build passed and emitted `dist/app` and `dist/site`.
- Live axe scans: zero serious/critical violations across `/`, `/demo`,
  `/lens`, `/privacy`, and `/terms` at 390 and 1440 widths.
- Live link crawl reached 200 final responses for all site links.

## Remaining work

See the report for exact evidence and rewrites. The blocking work is to prevent
phone-to-desktop download mismatch, replace tautological paid-claim tests with
checkout contract assertions, and finish terminology normalization.
