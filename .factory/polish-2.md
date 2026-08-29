# Polish 2 — cumulative adversarial repair map

Candidate repaired: `ed0e21d` (based on `f81025a` and reviews `95ce59`, `c062156`).

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Demo remains route-derived, uses only `demo:` storage, hides preset controls, and reset/exit preserve real settings. | `@claim:demo-isolation`, `@claim:demo-reset`; `/demo`, `/?demo=1` |
| F-1-2 | The transformed sample and active cue stay above secondary controls on a 390px screen. | `390px demo shows the sample result and active cue before scrolling`; `public/walkthrough-open.png` |
| F-1-3 | Header and direct hash navigation scroll and focus the How it works section. | `How it works reaches its section through mouse, keyboard, back, and a direct hash link`; `/#how` |
| F-1-4 | Sample and demo-isolation tests start at the landing CTA instead of bypassing it. | `@claim:sample-lens`, `@claim:demo-isolation` |
| F-1-5 | Privacy coverage records routes, file/paste input, scripts, and request origins; capture is separately fixture-tested. | `@claim:local-screenshots`, `@claim:capture-consent`; `/privacy` |
| F-1-6 | Mobile detection runs before desktop platform detection; Android/iPhone see desktop requirements, while macOS/Windows/Linux get platform-specific actions. | `@claim:desktop-download-platforms`; 390px screenshot and live `/` check |
| F-1-7 | Removed the unprovable merchant-of-record statement; price is asserted against a recorded checkout contract fixture and matching visitor copy. | `@claim:lens-plus-price`, `@claim:sociobot-checkout-path`; `/terms` |
| F-1-8 | Plain headings and concrete screenshot/display limits remain in place. | `@claim:privacy-limits`; `/privacy` |
| F-1-9 | Normalized visitor language to screenshot, status color, overlay, label, pattern, blue-orange colors, preset, and app. | `.factory/copy-audit.md`; `@claim:reading-cues` |
| F-1-10 | Restore and release actions name their result. | `@claim:license-restore`, `@claim:release-fallback` |
| F-1-11 | Paste and keyboard color entry have observable claim tests. | `@claim:paste-input`, `@claim:keyboard-color-input` |
| F-1-12 | Three original captioned workflow frames remain on the landing page. | `public/walkthrough-open.png`, `public/walkthrough-select.png`, `public/walkthrough-remap.png` |
| F-1-13 | Per-route titles, metadata, canonical URLs, social image, and sitemap entries remain present. | Browser route suite; `/demo`, `/lens`, `/privacy`, `/terms` |
| F-1-14 | The host-served 404 retains the shared shell, legal links, metadata, and plain recovery copy. | `static deployment maps known routes and leaves unknown paths to a real 404`; `/missing-review-route` |
| F-1-15 | README uses concrete sample and fallback wording. | `.factory/copy-audit.md`; `@claim:release-fallback` |
| F-2-1 | The sample claim now checks the patterned pixel and a before/after non-demo storage snapshot. | `@claim:sample-lens` |
| F-2-2 | Hero facts now state screenshot privacy, installed-app offline use, and exact price; offline use has a tagged test. | `@claim:local-screenshots`, `@claim:offline-reader`; `/` |
| F-2-3 | README now gives a clickable live demo URL and plain explanation of the sample and separation. | `README.md`; `https://color-signal-lens.sociobot.in/demo` |
| F-2-4 | Rebuilt the copy audit with landing, conditional, workspace, legal, and README strings plus a terminology table. | `.factory/copy-audit.md` |

## Verification evidence

- Full local suite: `npm test` — 6 unit/install-release tests and 39 browser tests passed.
- Type/build: `npm run check` and `npm run build` passed. Site JS is 31.08 KB raw / 10.45 KB gzip and CSS is 13.61 KB raw / 3.84 KB gzip.
- Clean-clone claim gate: all 23 commands in `.factory/claims.json` passed independently from `/tmp/color-signal-lens-clean-MzxeOh` after `npm ci`.
- Accessibility: the full browser suite includes desktop and 390px axe serious/critical scans, keyboard/focus tests, touch-target tests, reduced-motion coverage, routing, and 404 checks.
- Screenshots: `.factory/evidence/polish-2-home-390.png`, `.factory/evidence/polish-2-demo-390.png`, and `.factory/evidence/polish-2-home-1440.png` show the repaired local first screen, one-click demo, and desktop landing state. `.factory/evidence/polish-2-live-home-iphone.png` and `.factory/evidence/polish-2-live-demo-390.png` record the deployed mobile landing and demo.
- Live URL re-check: deployment served `index-NuQYYCs_.js`; `/`, `/demo`, `/lens`, `/privacy`, and `/terms` returned 200 with their expected runtime title, one h1, main landmark, and `lang=en`; `/missing-review-route` returned 404. An iPhone user agent saw “Downloads require macOS, Windows, or Linux.” and “Open desktop downloads”. Console errors: none. Live axe: 0 serious/critical violations across six routes at 390px and 1440px.
