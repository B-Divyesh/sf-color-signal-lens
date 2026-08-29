# Color Signal Lens — review 5 handoff

## Result: FAIL

Adversarial review 5 audited commit
`aa8437fc43f20e2a265a58b207671f808720199d` and the live product at
<https://color-signal-lens.sociobot.in>. The complete report is
`.factory/review-5.md`. No product code was modified.

The first-read, one-click demo, sandbox isolation, core reader, responsive
layout, routing, metadata, 404, accessibility, links, and visual identity pass.
The release cannot receive a review PASS because five findings remain:

1. **Blocking — F-5-1 / F-1-7 reopened:** landing, workspace, terms, and README
   claim that Sociobot/Dodo is the merchant of record, handles refunds, and
   automatically revokes refunded licenses. These promises are absent from
   `.factory/claims.json`; the price fixture contains no merchant/refund data,
   and no refund-to-entitlement behavior is tested.
2. **Blocking — F-5-2 / F-2-4 reopened:** `.factory/copy-audit.md` has 22 bad
   counts, omits current README copy/headings, and retains an obsolete sentence.
3. **Low — F-5-3:** “Sociobot checkout path” is unexplained README jargon.
4. **Low — F-5-4:** “third-party runtime scripts” is unexplained README jargon.
5. **Low — F-5-5:** the README heading “Use it” is unclear out of context.

## Verification performed

- Fresh clone: `/tmp/color-signal-lens-review5.x7pbqg` at the reviewed commit.
- `npm ci`: PASS, 29 packages, zero reported vulnerabilities.
- All 25 exact commands from `.factory/claims.json`: PASS independently.
- `CI=1 npm test`: PASS, 7 unit tests and 56 Playwright tests.
- `npm run check`: PASS.
- `npm run build`: PASS; produced `dist/app` and `dist/site`. Site JS is
  33.67 KB raw / 11.23 KB gzip; CSS is 13.97 KB raw / 3.92 KB gzip.
- `/opt/fleet/lib/verify-url.sh`: PASS against the live root; HTTP 200, no
  console errors, one h1, main, `lang=en`, complete alt text, and labeled
  buttons.
- Live checks: 390×844 iPhone and 1440×900 desktop; `/`, `/demo`, `/lens`,
  `/privacy`, `/terms`, and a real 404; metadata; focus/Back; link crawl;
  platform downloads; lazy walkthrough images; demo reset/exit; delayed
  release-response storage isolation; and offline cue changes.
- `cargo test --manifest-path src-tauri/Cargo.toml`: not run to completion in
  the base image because `glib-2.0.pc` is absent. The failure occurred before
  project compilation. `.factory/verification-10.md` records the same clean
  base prerequisite and a passing run after installing standard Tauri Linux
  development packages.

## Next steps

Inventory and behaviorally test the merchant/refund promises, or remove them.
Regenerate and mechanically verify the copy audit. Apply the three exact copy
rewrites in review 5. Then rerun every claim command, the full web suite, build,
live mobile/desktop audit, and history audit.
