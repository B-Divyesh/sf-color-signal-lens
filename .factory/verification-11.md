# Independent verification 11 — PASS

**Candidate:** `6f3827d645fab812fff2dbdd7c1cb455f0bf9596`  
**Live URL:** https://color-signal-lens.sociobot.in  
**Verified:** 2026-08-29 UTC  
**Verdict:** **PASS — releasable.**

## Mandatory first-read and demo gate

A cold, empty browser context loaded the live landing page successfully. It says “Make status colors distinct,” identifies people who cannot rely on red and green in code reviews, charts, or status screens, and presents exactly one clear first action: **Try it with sample data**. The adjacent sentence explains that it will open a sample screenshot with an overlay and save nothing. Activating that link with Enter opened `/demo`, showed the transformed sample and the persistent **Demo — sample data, nothing is saved** banner with Reset demo and Start for real. This passes the plain-words and one-click-demo gates.

## Claims gate

Clean install: `npm ci` completed (29 packages, 0 vulnerabilities). I then ran each of the 28 exact commands in `.factory/claims.json`, separately, from this clean checkout. All passed, including the sample/demo-isolation/privacy/input/capture/cue/clear-overlay claims, the paid license and checkout fixture claims, and the release, installer, platform-download, fallback, and offline-reader claims. The final Playwright result was `passed` with no failed tests.

## Local quality gates

- `npm test`: PASS — 10 unit tests and 58 Playwright tests.
- `npm run check`: PASS.
- `npm run build`: PASS; both `dist/app` and `dist/site` were produced.
- `cargo test --manifest-path src-tauri/Cargo.toml --quiet`: PASS — 2 native tests, including the production native license-verification path.
- The public v0.1.11 DEB was extracted and smoke-launched under Xvfb for 12
  seconds. It remained running (the timeout ended it); only expected headless
  DRI3 software-rendering warnings appeared.
- The base container initially lacked standard Linux Tauri development headers (`glib-2.0`). After installing the normal Tauri prerequisites, native tests compiled and passed; this is environment setup, not a product defect.
- Fresh site bundles are 33,688 bytes raw / 11,223 bytes gzip JS and 13,965 bytes raw / 3,918 bytes gzip CSS, inside the stated budgets.

## Live product, accessibility, privacy, and performance

At both 1440×900 and 390×844, `/`, `/demo`, `/lens`, `/privacy`, and `/terms` returned 200 with route-specific titles, exactly one h1, one main landmark, no horizontal overflow, and no axe serious or critical violations. The unknown URL returned a real 404 page. `verify-url.sh` also passed against the landing page: HTTP 200, no console/page errors, `lang=en`, title, h1/main, and complete image alt text.

Keyboard activation of the first CTA worked. Its focus style was a visible 3px black outline with 3px offset. In the live demo I changed the cue to blue-orange, used the keyboard color input with the boundary values `#000000` and `#FFFFFF`, and cleared the overlay; it returned to “No reading cue.” Reduced motion computed to `0.00001s` duration rather than animating.

A fresh direct `/demo` run made requests only to the product origin (HTML, JS, and CSS) while changing cues and resetting. Its normal landing path makes only the documented GitHub Releases API request in addition to first-party assets; there were no screenshot uploads, analytics, third-party scripts, or CDN fonts. Response headers include HSTS, `nosniff`, strict-origin referrer policy, and a restrictive CSP. HTML is cached for 30 seconds with revalidation; hashed JS is one-year immutable.

Fresh mobile Lighthouse: **95 performance, 100 accessibility, 100 best practices, 100 SEO**; LCP 2,393 ms, TBT 38 ms, CLS 0.

## Deployment and release evidence

The live `index.html`, `assets/index-6rblTqQC.js`, and `assets/style-BWgV3-lU.css` had the exact same SHA-256 values as a fresh `npm run build` from this candidate. The public v0.1.11 release targets `44ce5acd420dbeb59022c5000fe8aea350a0277f`; the candidate's changes after that commit are verification evidence and handoff documentation only, so the release contains the candidate product code.

The release supplies macOS arm64/x64, Windows EXE/MSI, Linux AppImage/DEB/RPM, `SHA256SUMS`, and valid `latest.json`. I downloaded the amd64 DEB, verified its SHA-256 (`84888339e776822b23d51e8f692d32323e4f1b7e9af27281ccf6a027c0f6c85a`) against `SHA256SUMS`, and verified its metadata: `color-signal-lens`, version `0.1.11`, architecture `amd64`.

No sign-in or service worker applies. The product unlock verification endpoint was independently rate-limit tested: requests 1–30 from one client returned normally; request 31 returned **429** with `Retry-After: 4`. Observed allowance: 30 requests per window.

## Defects

No release-blocking, high, medium, or low product defects were found. Existing unsigned macOS and Windows artifacts remain an operator-signing consideration, not a candidate regression.

## Environment-only note

`npm run build`, the repository's defined production build, passes. I also
attempted the optional local all-target Tauri bundle. It built the release
binary plus DEB and RPM, then failed only at the AppImage packaging stage because
the disposable container has no `libfuse.so.2` and no `/dev/fuse`; Tauri's cached
`linuxdeploy` AppImage cannot mount there. This is not a candidate product or
deployment failure: the public GitHub Actions v0.1.11 release includes the
checksum-verified AppImage, and the public DEB smoke launch passed.
