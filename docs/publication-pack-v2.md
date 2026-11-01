# Publication Pack v2

Publication Pack v2 is an additive, versioned successor to [v1](publication-pack-v1.md). Existing v1 issues remain valid and render without migration. A v2 pack is selected only by `schema_version: 2`; it is not a reinterpretation of v1.

## Status and activation boundary

The Website and Risks In Sync Studio prepare and validate v2, but the live RiS Scout automation remains pinned to v1 until a separately approved activation change updates its read-only contract preflight, generation prompt and observed-run checks. Do not change a v1 pack in place or emit v2 from Scout before that decision.

The canonical machine-readable artifacts are:

- [`schemas/publication-pack-v2.schema.json`](../schemas/publication-pack-v2.schema.json) for frontmatter.
- [`schemas/review-definition-v2.json`](../schemas/review-definition-v2.json) for the Cascade Risk Review structure.

## Deliberate changes from v1

- `assets.cover` is required. It is the issue-owned cover used in the article masthead.
- `assets.homepage_vignette` is required. It is the current homepage illustration and carries the same compact `label` and `caption` rules as v1's homepage image.
- `images` remains available only for optional `hero`, `inline` and `social` media. It cannot declare `cover` or `homepage`.
- `editorial_modules` is an ordered registry of at most one each of `editorial_note`, `operator_checklist` and `decision_log`. Its values are structured plain text, not arbitrary Markdown or HTML.

The cover, vignette and optional images are all pack assets: paths stay under `assets/`, are unique by filename, must exist in the hand-off, and follow the existing rights, accessibility, size and ready-for-PR verification rules. A cover and vignette must be cleared before `ready_for_pr`.

## Body and rendering

The article body retains the v1 required sections, markers and `SOURCES` generation behavior. V2 rejects undeclared `##` Markdown sections so new editorial UI is declared through `editorial_modules`, rendered in the order supplied, rather than hidden in free-form article structure.

The Website normalizes v2's two explicit assets into its internal image representation only after validation. This is an implementation detail; packs must keep them in `assets.cover` and `assets.homepage_vignette`.

## Verification

Run the ordinary Website checks plus Studio's v2 import validation. Cross-repository preflight remains a v1-only operational safeguard until Scout activation is intentionally changed.
