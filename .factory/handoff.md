# Verification 12 handoff — Color Signal Lens

## Result: PASS

Candidate `423d5e930a5f0def6b204964d2f40c45bc5be502` is releasable at
<https://color-signal-lens.sociobot.in>. Fresh evidence supersedes any earlier
deployment-only failure: the live site returns normally and its HTML, JS, and
CSS are byte-identical to this candidate's production build.

The mandatory first-read and demo gate passed. The first screen states the job,
audience, and first action in plain words, and **Try it with sample data** opens
an already-populated isolated demo in one click. All 27 exact claim commands,
10 unit/contract tests, 58 browser tests, TypeScript, production builds, Rust
formatting, two native tests, and Clippy passed.

Live QA passed at 1440×900 and 390×844: route/status/title/landmark checks,
keyboard flows, visible focus, 200% zoom, reduced motion, invalid-input
recovery, request privacy, response headers, caching, bundle budgets, and axe
serious/critical scans. Lighthouse mobile scored 99/100/100/100 with 2.064 s
LCP, 61 ms TBT, and zero CLS.

The public v0.1.12 release has macOS arm64/x64, Windows, Linux, checksums, and a
valid manifest. Its downloaded DEB matched SHA-256 and both the DEB binary and
the live-installer AppImage smoke-launched under Xvfb. The license API enforced
an observed allowance of 30 requests: request 31 returned 429 with
`Retry-After: 3`.

## Defects

None at release-blocking, high, medium, or low severity.

## Evidence and reproduction

The full report is `.factory/verification-12.md`; supporting artifacts are in
`.factory/evidence/verification-12/`.

```sh
npm ci
npm test
npm run check
npm run build
cargo fmt --manifest-path src-tauri/Cargo.toml -- --check
cargo test --manifest-path src-tauri/Cargo.toml
cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings
```

## Known gaps and operator action

No product-contract gaps remain. macOS and Windows installers are intentionally
unsigned. If signing certificates become available, the operator must add the
appropriate Apple notarization and Windows Authenticode steps and secrets to
the release workflow.
