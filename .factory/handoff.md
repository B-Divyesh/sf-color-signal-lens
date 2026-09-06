# Review 8 handoff — Color Signal Lens

## Result

**FAIL.** Independent review 8 found two issues. The live demo still has the
minor `aria-allowed-role` defect previously noted in verification 4. The README
also omits the Linux Tauri prerequisites needed by its native test command.

The full report is `.factory/review-8.md`. No product code was modified.

## Candidate

- Implementation: `afcd9aabd454f62a8900bb660aca5a505185491f`
- Documentation before this review: `c506b05b6a64797dbc73ab1e7713611ad963cfd8`
- Live URL: <https://color-signal-lens.sociobot.in>

The live HTML, JavaScript, and CSS match a fresh implementation build. Public
release `v0.1.12` also records the implementation commit.

## Verification

- All 27 declared claim commands passed separately; untested claim count is 0.
- `CI=1 npm test` passed: 10 unit tests and 58 Playwright tests.
- `npm run check`, `npm run build`, Rust formatting, native tests, and Clippy
  passed after installing the missing Linux Tauri packages.
- Before that manual installation, the README's `cargo test` command failed
  because `glib-2.0.pc` was unavailable.
- Live phone and desktop checks covered first read, one-click sample,
  persistent demo label, reset, real-data isolation, normal/invalid/boundary
  paths, keyboard and focus, reduced motion, 200% zoom, privacy requests,
  links, route titles, legal pages, and the designed HTTP 404.
- Full Axe scans reproduce one minor `aria-allowed-role` violation on `/demo`.
- Mobile Lighthouse: 100 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.21 s, TBT 0 ms, CLS 0.
- The hosted installer verified and installed the v0.1.12 AppImage in an
  isolated directory. It stayed running under Xvfb for 12 seconds.
- License verification rate limiting returned 429 on request 31 with
  `Retry-After: 3`.

## Required next steps

1. Remove the invalid `role="status"` from the interactive demo banner, or
   move live status text into a valid non-interactive live region. Make the Axe
   suite fail on minor violations too.
2. Document Node/Rust versions, Linux Tauri system packages, and the native
   desktop development command. Test those instructions in a clean Linux
   environment.
3. Rerun every declared claim command and the full live phone/desktop audit.

## Evidence

Review evidence is in `.factory/evidence/review-8/`.
