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
