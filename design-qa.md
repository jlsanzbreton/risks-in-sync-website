# Design QA — homepage editorial illustration

## Evidence

- Source visual truth: `/Users/sanzb/.codex/visualizations/2026/09/10/01a08c1e-d053-7e00-98ca-eee9ebe8b924/home-illustration-mockup-desktop-v2.png` and `/Users/sanzb/.codex/visualizations/2026/09/10/01a08c1e-d053-7e00-98ca-eee9ebe8b924/home-illustration-mockup-mobile-v3.png`.
- Implementation captures: `/Users/sanzb/.codex/visualizations/2026/09/10/01a08c1e-d053-7e00-98ca-eee9ebe8b924/home-integration-desktop.png` and `/Users/sanzb/.codex/visualizations/2026/09/10/01a08c1e-d053-7e00-98ca-eee9ebe8b924/home-integration-mobile.png`.
- Combined comparison: `/Users/sanzb/.codex/visualizations/2026/09/10/01a08c1e-d053-7e00-98ca-eee9ebe8b924/design-comparison.png`.
- Desktop viewport: 1440 × 1600 CSS px at device scale 1. Source image: 1440 × 1987 px; implementation capture: 1440 × 1600 px. The comparison uses the top 1600 px of each page.
- Mobile viewport: 390 × 844 CSS px at device scale 1. Source image: 390 × 2101 px; implementation capture: 390 × 3572 px. The comparison uses the top 1100 px of each page.
- State: homepage, initial load, no hover or focus state.
- Browser verification: Codex in-app browser at 1440 px and 390 px. No console warnings or errors. Primary navigation and review links remained present and accessible.

## Findings

- No actionable P0, P1 or P2 differences were found in the implemented illustration section.
- Fonts and typography: the existing IBM Plex Sans system, weights and hierarchy are unchanged. The caption matches the selected mockup's uppercase label and subdued explanatory copy.
- Spacing and layout rhythm: the illustration sits between the hero and publication section with the approved full-width desktop treatment and edge-to-edge mobile image. The caption returns to the mobile content gutter.
- Colors and visual tokens: the image's warm paper, charcoal and restrained ochre align with the site's existing paper, ink and amber tokens. Borders use the existing line and ink tokens.
- Image quality and asset fidelity: the approved corrected illustration is used directly, without recreation or cropping. Desktop loads the 1680 px WebP and mobile loads the 960 px WebP. The mobile page has no horizontal overflow.
- Copy and content: the label and explanatory sentence match the selected mockup. The image alternative text communicates the sign and both lines of dialogue.
- The issue title differs between the temporary mockup and the implementation because the mockup contained earlier placeholder copy; the implementation correctly preserves the current site content. This is expected and outside the illustration change.

## Focused comparison

The combined comparison includes readable desktop and mobile views of the full illustration, embedded text, caption rule, label, explanatory copy and surrounding hero spacing. No additional crop was needed.

## Comparison history

- Initial comparison: no P0/P1/P2 issue in the illustration integration, so no visual correction loop was required.

## Follow-up polish

- None required for this change.

final result: passed

## Compact editorial hero and review-title system — 2026-10-31

### Evidence

- Source visual truth: the user-provided homepage capture at `/var/folders/4_/zl1flq913yn47gfspz7bqfmm0000gp/T/codex-clipboard-7343fa9b-6274-4473-a369-18472b2e89ed.png`, the supplied Y1·N2 cover at `/Users/sanzb/Library/CloudStorage/Dropbox/VEILIGHEID/Trabajo & Proyectos/Proyectos/Cascade Risk Review/CascadeRiskReview_Cover01.png`, and the project-bound Y1·N8 edition at `public/cascade-risk-review-cover-y1-n8.png`.
- Implementation capture: rendered in the Codex in-app browser at `http://127.0.0.1:4173/` (homepage) and `http://127.0.0.1:4173/review/year-1-nr-8/` (review); the screenshots are retained in this run's browser evidence.
- Viewports and state: homepage at 1440 × 900 CSS px, review at 1440 × 900 and 390 × 844 CSS px; initial-load state, then the cover card link.
- Intentional design difference: this is a user-directed redesign, not a pixel-for-pixel clone of the initial homepage screenshot. The comparison checks the stated outcome: headline, vignette and review access in one desktop viewport.

### Findings

- No actionable P0, P1 or P2 issues found.
- Typography: the homepage statement and review H1 use the same responsive scale, optical weight and compact line-height. On 390 px, the long review title remains readable without clipping or horizontal overflow.
- Layout rhythm: at 1440 × 900, the complete hero is visible before the following dark section: brand label, statement, vignette with caption, explanatory copy and the cover link. The vignette occupies the primary two-thirds column; the review rail occupies the remaining column.
- Colors and assets: the supplied cover is used directly and retains its black, ochre and signal-red language. It is paired only with existing paper, ink, line and amber tokens.
- Cover integrity: the cover says Year 1 · Nr. 8 and links to that exact issue. A cover-to-issue map prevents a later issue from being silently mislabelled; adding a future cover means adding its corresponding image and map entry.
- Interaction: the cover card navigated to `/review/year-1-nr-8/` and the article loaded with the intended headline. Production build, review validation and all 66 automated tests passed.

### Comparison history

- First desktop pass: compact hero content fit in the 1440 × 900 viewport; no correction needed.
- Review-title pass: article H1 was reduced from the older oversized scale and aligned to the homepage scale. Rechecked on desktop and 390 px mobile; no P0/P1/P2 issue remained.

### Follow-up polish

- For each new issue, commission or select a matching cover and add it to the cover map. The current Y1·N8 asset is a non-destructive edit of the supplied Y1·N2 cover; future covers should preserve the collection system while introducing one case-specific variation.

final result: passed

## Dynamic Publication Pack verification — 2026-09-14

- Source visual truth: the user-provided homepage captures at `/var/folders/4_/zl1flq913yn47gfspz7bqfmm0000gp/T/TemporaryItems/NSIRD_screencaptureui_63ZfMS/Captura de pantalla 2026-09-13 a las 23.27.16.png` and the earlier approved desktop/mobile mockups listed above.
- Implementation evidence: the generated fixture homepage at `http://127.0.0.1:4173/` and the Studio Review Desk preview at `http://127.0.0.1:4174/`, captured in the Codex in-app browser during this review. The persistent implementation captures and combined comparison listed above remain representative because the generated issue deliberately reuses the same approved artwork and layout.
- Website desktop viewport: 1180 px wide. Document width matched the viewport; the generated `homepage` asset, label and caption rendered without clipping. Caption content measured one rendered line within its 733 px column.
- Website mobile viewport: 390 × 844 CSS px. Document width matched the viewport and the editorial caption remained within two lines.
- Studio mobile viewport: 390 × 844 CSS px. Document width matched the viewport after the table containment fix. Each table retained an internal 1050 px scroll surface inside a 316 px viewport without widening the page.
- Functional state: a Publication Pack image was changed to role `homepage`, given a compact label and explanatory comment, and shown immediately in Studio's sanitized local preview. The generated Website used those same fields for the latest issue.
- Fallback state: when the latest issue has no `homepage` image, the existing wildebeest/crocodile illustration and its current caption remain unchanged.
- Console verification: no Website or Studio application errors were observed during the final browser pass.

final result: passed
