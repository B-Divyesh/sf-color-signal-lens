# Color Signal Lens visual thesis

## Direction: paper-cut diorama

Color Signal Lens is a close-up work tool, not a screen-wide colour filter. The
interface is a small desk stage made from layered cut paper: a dark ink base,
warm paper panels, and overlapping swatches that lift status signals above the
source image. The physical layers make the product's promise visible: the
original screen stays beneath a removable, task-specific reading layer.

## Tokens

| Purpose | Token | Value |
| --- | --- | --- |
| Ink background | `--ink` | `#17232E` |
| Paper | `--paper` | `#FFF8E8` |
| Soft paper | `--paper-soft` | `#F2E7CE` |
| Ink text | `--ink-text` | `#17232E` |
| Quiet ink | `--muted` | `#4A5965` |
| Orange status | `--orange` | `#A94900` |
| Blue status | `--blue` | `#075A86` |
| Lemon note | `--lemon` | `#F4C846` |
| Focus rings | — | `#000000` inner, `#FFFFFF` outer |

The default is deliberately light-on-paper, with an ink stage surrounding the
working canvas. It keeps the original screenshot readable while blue/orange and
patterns provide redundant status signals. Contrast-bearing copy uses ink on
paper or white on ink; status always also has a label or pattern.

## Type and spacing

The UI uses a self-hosted-free system stack: `Georgia` for cut-paper headings
and `ui-sans-serif` for controls and body text. This avoids a font download,
keeps the utility fast, and gives the paper scene an editorial voice. The
spacing scale is 4, 8, 12, 16, 24, 32, 48, and 72px. Controls are at least
44px tall.

## Shape, interaction, motion

Panels have uneven, hand-cut polygon edges, thin ink outlines, and offset
paper shadows. Pattern chips are recognisable by shape as well as colour.
Selection is direct: open an image or use the shipped sample, click a colour
signal, then choose labels, patterns, or blue/orange remapping. The only motion
is a 180ms paper-layer lift on state changes. With reduced motion enabled it
becomes an instant opacity change.

Keyboard focus uses a black inner outline and white outer halo. One edge
therefore keeps at least 3:1 contrast on ink, paper, lemon, and orange layers.

## Asset plan and provenance

`src/assets/paper-cut-lens.webp` is an original, generated hero illustration.
It depicts a desktop status panel through a removable paper lens, with no text
or logos. It is used as visual context only; controls remain HTML. Prompt:

> Editorial paper-cut diorama of a desktop software status panel viewed through a circular removable lens, layered cream paper, deep navy ink shadows, clear blue and burnt orange signal marks, tactile cut edges, overhead studio light, modern accessibility utility, no people, no words, no letters, no logos, no watermark, no gradients

Generated with the factory image deployment on 2026-08-28. It is original
product artwork; no third-party asset is included. The source PNG is retained
with its prompt sidecar in `src/assets/`; the shipped WebP is resized and kept
below 300 KB.

## Walkthrough and social assets

`public/walkthrough-open.png`, `walkthrough-select.png`, and
`walkthrough-remap.png` are original Playwright screenshots of the shipped
sample workflow, captured on 2026-08-29. They show opening the sample, selecting
a status color, and applying blue-orange colors. `public/social-card.png` is a
1200×630 crop of the original generated paper-cut illustration. No third-party
assets or fonts are used.
