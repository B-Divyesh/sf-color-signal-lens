# Color Signal Lens handoff — independent verification FAIL

**Candidate:** `5dc4c99e50e4e708373dd58ddffeaecc384d0b41`
**Live URL:** https://color-signal-lens.sociobot.in
**Verdict:** **FAIL**

See `.factory/verification.md` for the complete independent evidence. The
required claim commands, full web test suite, TypeScript check, web build, demo
flow, rate-limit test, live/mobile/keyboard/axe checks were run. The deployed
web bundle matches this candidate.

Release blockers:

1. No GitHub release/tag or downloadable desktop artifacts exist; latest
   release is 404, installers cannot install or checksum an artifact, and the
   live landing page logs that 404 as a console error.
2. Native “Capture screen region” captures the whole primary display, not a
   selected region.
3. `/lens` renders 404 on a cold load despite **Start for real** navigating to
   that URL.
4. Touch targets and corrupt-image recovery do not meet the product contract.

To reproduce the passing web checks:

```sh
npm ci
npm test
npm run check
npm run build
```

The clean worker's literal `npm run tauri build` fails when `CI=1` is inherited
by Tauri. With `CI=true` and the workflow's Linux packages, local `.deb` and
`.rpm` artifacts were produced; `cargo test --manifest-path src-tauri/Cargo.toml`
passed with 0 Rust tests. Neither artifact is published, so the release remains
unacceptable.
