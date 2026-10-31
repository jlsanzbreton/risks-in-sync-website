# Publication Pack v1

Publication Pack v1 is the complete, reviewable hand-off from Risks In Sync Studio to the website. It contains one `review.md` plus the image files declared by that Markdown file. Merging a valid pack is the publication action; `published` is deliberately not an editorial status.

## Repository layout

```text
src/content/reviews/<slug>/review.md
public/review/<slug>/assets/<image files>
```

Paths inside Markdown and frontmatter remain relative to the pack, for example `assets/hero.webp`. A new issue must not require a React, Vite, JSON, TypeScript or HTML file maintained by hand.

The canonical machine-readable frontmatter contract is [`schemas/publication-pack-v1.schema.json`](../schemas/publication-pack-v1.schema.json). Unknown fields are rejected. Semantic and editorial rules that JSON Schema cannot express are enforced by `scripts/reviews.ts`.

The canonical body structure is [`schemas/review-definition-v1.json`](../schemas/review-definition-v1.json). For the current system, `schema_version: 1` selects Publication Pack schema v1 and Cascade Risk Review Definition v1. The definition records the existing introduction, section IDs, headings, order, required state, slots and generated `SOURCES` behavior; it does not replace application-specific parsing, rendering or editorial logic.

## Delivery formats and assets

The three Studio import choices represent the same Publication Pack contract:

- **ZIP:** preferred Scout hand-off for a complete pack because the Markdown and assets travel as one file.
- **Folder:** the unpacked equivalent, useful while inspecting or adjusting files locally.
- **Standalone `review.md`:** suitable when `images: []`, or when the editor will add the declared assets later in Studio. Declared but absent assets are blocking errors.

ZIP and folder imports may have one harmless outer directory. After that directory is removed, `review.md` must be at the pack root and every other file must remain under `assets/`:

```text
year-1-nr-2/
├── review.md
└── assets/
    ├── homepage.webp
    └── cascade-map.png
```

Use lowercase ASCII filenames with hyphens and make the frontmatter path match exactly, for example `assets/homepage.webp`. Studio recognises AVIF, GIF, JPEG, PNG and WebP image assets. WebP is the default recommendation; JPEG remains useful for photographs and PNG for line art that does not compress cleanly.

For a homepage illustration, prepare a 16:9 source such as 1600 × 900 px. The website renders it at 16:9 with `object-fit: cover`, so a different ratio may be cropped. Keep essential text and visual meaning away from the outer edges.

The Studio publication bridge enforces these transport limits before a PR can be created:

- 3 MB maximum for any single asset.
- 4 MB maximum for the complete unencoded `review.md` plus all assets.
- 50 assets maximum.

For a single homepage illustration, aim below 1 MB so the complete pack remains comfortably inside the bridge limit.

## Required frontmatter

The fields and shape are those in the canonical schema. Important rules:

- `schema_version` is exactly `1`.
- `slug` is `year-<positive integer>-nr-<positive integer>` and agrees with both the containing directory and `issue.year`/`issue.number`.
- `status` is `draft` or `ready_for_pr`. Validation can inspect either; only `ready_for_pr` enters the generated site.
- All dates are real calendar dates written as `YYYY-MM-DD`.
- Source URLs and image `source_url` values are absolute HTTPS URLs.
- Ready sources are verified. Ready images are cleared and include credit, source URL and rights basis.
- Image paths start with `assets/`, remain under that directory after decoding, exist in `public/review/<slug>/`, and are unique by filename.
- Non-decorative images have meaningful alt text. Every Markdown image is declared; every declared inline image is used.
- Image roles are `homepage`, `hero`, `inline` and `social`. At most one image may use each of `homepage`, `hero` and `social`.
- A `homepage` image replaces the current editorial illustration while that issue is the latest publication. It requires a short `label` (48 characters maximum) and `caption` (140 characters and at most two explicit lines). The website visually clamps the caption to two lines.
- `images: []` is valid when an issue has no issue-specific imagery. The website then keeps the current homepage illustration, uses its site-wide social fallback and omits the article hero.
- `cascade.outcome_status` is neutral about success: `contained`, `partially_propagated`, `fully_propagated`, `ongoing`, or `uncertain`.
- `cascade.observed_outcome` records what actually happened. `cascade.counterfactual_outcome` is nullable and records a plausible alternative or prevented consequence only when it adds supported editorial value.

The status describes propagation, not whether the story ended well: `contained` means the disturbance was arrested or absorbed; `partially_propagated` means it crossed at least one boundary but remained limited; `fully_propagated` means it reached the consequential extent described by the case; `ongoing` means the outcome is still evolving; and `uncertain` means the evidence does not justify a firmer classification.

No validator or build step repairs, invents or defaults editorial fields. A cascade is never assumed to have stopped or ended well.

## Required Markdown body

The following tokens occur exactly once and in this order:

```markdown
## The event
## The cascade
<!-- CASCADE_DIAGRAM -->
## What worked
## What didn't — or we don't know
## Gray Zones
## Risks In Sync
## What this case changes
## Evidence status
### REPORTED
### OBSERVED
### INFERRED
### UNKNOWN
<!-- PRIVATE_FEEDBACK -->
## SOURCES
```

Every editorial section and evidence subsection contains substantive text. Placeholder language is rejected. `## SOURCES` is intentionally empty in the Markdown source: its substantive content is the validated `frontmatter.sources` array, rendered by the site so sources are not duplicated.

Arbitrary raw HTML is not trusted. Generated Markdown HTML is sanitized, and only the two exact editorial comments above are accepted as component insertion markers.

## Validation and publication

```sh
npm run check:reviews
npm test
npm run build
```

When the sibling Studio checkout is available at `../risks-in-sync-studio`, run the complete cross-repository verification with:

```sh
npm run verify:publication-flow
```

This compares the canonical and vendored schemas byte for byte, imports and edits the complete `Year 1 · Nr. 2` fixture through Studio, checks approval invalidation and backup ZIP export, transforms the exported files into a temporary Website copy, runs the Website validation/tests/build, exercises the negative contract matrix, and verifies the simulated GitHub branch/PR transaction. Pass `-- --keep` to retain the temporary Website copy for browser inspection.

The live Scout automation runs a smaller read-only gate before research, reservation or generation:

```sh
npm run preflight:scout-contracts -- --website-root /Users/sanzb/dev/risks-in-sync-website --studio-root /Users/sanzb/dev/risks-in-sync-studio
```

This verifies both canonical JSON artifacts, their version relationship, byte identity with Studio's vendored copies and Review Definition checksum provenance. Failure returns a nonzero exit and `SCOUT BLOCKED` before Scout may change sequence state or exports. The controlled live-path smoke test passed on 19 September 2026 with no state, export or reservation changes.

The generator discovers `src/content/reviews/*/review.md`; directories beginning with `_` are ignored for publication. A human reviews the preview and merges the PR. There is no automatic publishing state or repair step.

## Migration decision for Year 1 · Nr. 1

The repository explicitly records no issue-specific image for Year 1 · Nr. 1 (`images: []`). The earlier repository notes say the available screenshot was not published because it was not a traceable incident asset. Keeping the existing site-wide social fallback preserves the published presentation without inventing creator, licence or rights data.
