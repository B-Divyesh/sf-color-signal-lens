# Color Signal Lens review 4 handoff

## Result

Completed the requested adversarial, read-only production review. Product code was not modified. The review is a **FAIL** with two findings in `review-4.md`, including blocking F-4-1: the live landing-to-demo journey can write `color-signal-lens:release` outside the `demo:` namespace after the demo banner appears.

## Verification

- Opened the production URL in fresh 390 × 844 and 1440 × 900 Chromium contexts; captured cold landing and demo screens.
- Used a delayed live-release response to reproduce the non-demo storage write after clicking the real landing CTA.
- Read the brief, design, claims, every prior review/polish report, and the previous handoff. Rechecked each historical finding on live behavior and source.
- Created `/tmp/color-signal-lens-review4.EI3utw`, ran `npm ci`, then every one of the 23 commands from `.factory/claims.json` separately: all passed.
- Ran `CI=1 npm test` (6 unit and 52 Playwright tests), `npm run check`, and `npm run build`: all passed.
- Checked production route metadata, deep links, focus/announcement, 404, headers, link resolution, request logs, demo reset/exit behavior, and the visual/accessibility system.

## Remaining work

Fix F-4-1 and F-4-2 exactly as specified in `.factory/review-4.md`, then repeat the clean-clone claim gate and deployment verification. No deployment or external state was changed by this review.
