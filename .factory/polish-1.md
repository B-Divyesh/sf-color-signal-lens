# Polish 1 — adversarial review repair map

Candidate repaired: `c941b08` (based on review `95ce59`).

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Demo state is derived on every route render before storage access. Demo uses only `demo:` keys; paid presets are unavailable; Reset deletes demo keys; Start for real opens `/lens`. | `@claim:demo-isolation`, `@claim:demo-reset`; `/demo` and `/?demo=1` |
| F-1-2 | Demo now puts its sample canvas and active-cue text before secondary import controls; redundant sample button is removed. | `390px demo shows the sample result and active cue before scrolling`; `public/walkthrough-open.png` |
| F-1-3 | Same-page anchors use native navigation; cross-route anchors render then scroll and focus their section. | `How it works reaches its section through mouse, keyboard, back, and a direct hash link`; `/#how` |
| F-1-4 | The sample claim begins at `/`, clicks the actual CTA, and isolation seeds real license and preset keys. | `@claim:sample-lens`, `@claim:demo-isolation` |
| F-1-5 | Privacy copy names screenshot processing precisely. The privacy claim covers public routes, local file input, script origins, and request logging; capture is fixture-tested separately. | `@claim:local-screenshots`, `@claim:capture-consent`; `/privacy` |
| F-1-6 | Unsupported generic platform and signing claims were removed. The release, checksum, macOS choice, shell choice, and fallback promises retain exact tests. | `@claim:desktop-release`, `@claim:installer-checksums`, `@claim:macos-installer-architecture`, `@claim:macos-shell-installer-architecture`, `@claim:release-fallback` |
| F-1-7 | Removed unprovable checkout-return/refund statements and added a tested merchant disclosure. | `@claim:sociobot-checkout-path`, `@claim:merchant-disclosure`; `/terms` |
| F-1-8 | Rewrote headings and limits copy in plain words with concrete screenshot/display limits. | `@claim:privacy-limits`; `/.factory/copy-audit.md` |
| F-1-9 | Standardized user-facing vocabulary on screenshot, status color, overlay, label, pattern, and blue-orange colors. | `@claim:reading-cues`; `.factory/copy-audit.md` |
| F-1-10 | Replaced question and vague download actions with Restore license and Open release downloads. | `@claim:license-restore`, `@claim:release-fallback`; `/` |
| F-1-11 | Added real paste-image and keyboard-color claim tests. | `@claim:paste-input`, `@claim:keyboard-color-input` |
| F-1-12 | Added three original, captioned app workflow frames. | `public/walkthrough-open.png`, `public/walkthrough-select.png`, `public/walkthrough-remap.png`; provenance in `.factory/design.md` |
| F-1-13 | Route render now updates title, description, canonical, OG, and Twitter fields. Added 1200×630 social card and `/lens` sitemap entry. | Playwright route suite; `public/social-card.png`, `public/sitemap.xml` |
| F-1-14 | Rebuilt the host-served 404 with the standard header, footer, legal links, metadata, favicon, and plain wording. | `static deployment maps known routes and leaves unknown paths to a real 404`; `/missing-review-route` |
| F-1-15 | Replaced subjective demo and release-fallback wording with observable descriptions. | `.factory/copy-audit.md`; `@claim:release-fallback` |

## Verification

- Clean-clone `npm ci`, every command in `.factory/claims.json`, full `CI=1 npm test`, `npm run check`, and `npm run build` passed.
- `cargo test --manifest-path src-tauri/Cargo.toml` passed after installing the normal Linux Tauri development libraries.
- The release-mode Debian bundle build and live deploy check are recorded in the handoff after completion.
