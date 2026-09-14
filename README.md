# Risks In Sync

Public website for **Risks In Sync** and **Cascade Risk Review**. The publication follows how disturbances propagate through connected physical, digital and human systems, including cascades that are contained and cascades that become catastrophes.

> Editorial principle: **evidence is not interpretation**. Reviews distinguish **REPORTED**, **OBSERVED**, **INFERRED** and **UNKNOWN**.

## Production

MVP launched 8 September 2026.

| Item | Value |
| --- | --- |
| Website | https://risksinsync.com |
| `www` | redirects to https://risksinsync.com |
| Netlify URL | https://risks-in-sync.netlify.app |
| Repository | https://github.com/jlsanzbreton/risks-in-sync-website |
| Production branch | `main` |
| Working branch | `dev` |
| Deploy | push to `main` → Netlify build → `dist/` |

Netlify manages HTTPS. The domain and DNS remain at Porkbun. Production DNS:

| Type | Host | Value |
| --- | --- | --- |
| `ALIAS` | apex / `risksinsync.com` | `apex-loadbalancer.netlify.com` |
| `CNAME` | `www` | `risks-in-sync.netlify.app` |

Keep the existing Porkbun MX/SPF records. Do not select “Set up Netlify DNS” without planning a DNS migration. DNS is not configured from this repository.

## Current product

Routes:

- `/` — homepage and latest issue
- `/review/` — archive
- `/review/year-1-nr-1/` — first official issue
- `/about/` — method, Gray Zones and AI experiment
- `/privacy/` — privacy notice for private reader feedback

Year 1 · Nr. 1 is complete in `src/content/reviews/year-1-nr-1/review.md`: full article, cascade diagram, required analysis, evidence status, six real source URLs and AI-assisted/human-edited disclosure. No source placeholders remain.

This is intentionally static: no CMS, custom database, authentication, functions, analytics, AI calls or automatic publishing. Private reader feedback is handled by Netlify Forms and reviewed manually.

The feedback launch decision, legitimate-interest assessment, retention rule and operating checklist are in `docs/private-feedback-runbook.md`.

## Architecture

```text
Publication Pack v1 (`review.md` + declared assets)
→ shared parser, schema and editorial validator (`scripts/reviews.ts`)
→ generated typed manifest + issue HTML/Vite entries
→ generic React page renderer (`src/main.tsx`)
→ Vite static build
→ `dist/`
→ Netlify
```

- `src/main.tsx` — layouts and generic manifest-driven renderer
- `src/styles.css` — visual system and responsive design
- `src/content/reviews/<slug>/review.md` — complete editorial source of truth per issue
- `public/review/<slug>/assets/` — rights-documented images declared by the issue
- `schemas/publication-pack-v1.schema.json` — canonical versioned frontmatter schema
- `scripts/reviews.ts` — the one parser/validator used by loading, checks, generation and tests
- `src/generated/reviews.ts` — ignored, generated typed manifest
- `review/<slug>/index.html` and `review/.generated-entries.json` — ignored, generated route metadata and Vite inputs
- `vite.config.ts` — consumes generated entries without per-issue edits
- `public/risksinsync-icon.png` — master site icon
- `public/favicon*`, `apple-touch-icon.png`, `icon-*` — browser, Apple and manifest icon variants
- `public/risksinsync-og.png` — static Open Graph/Twitter preview image
- `netlify.toml` — build command and publish directory

## Development and releases

Always start on `dev`; `main` is live production.

```sh
git switch dev
git pull --ff-only origin dev
npm install
npm run dev
```

Before committing:

```sh
npm run check:reviews
npm test
npm run build
git diff --check
```

`dev` and `build` validate and generate review content first. Preview the production output with `npm run preview`.

Release only after human editorial approval:

```sh
git push origin dev
git switch main
git pull --ff-only origin main
git merge --ff-only dev
git push origin main
git switch dev
```

Never force-push. If branches diverge, inspect them instead of forcing a merge. Roll back production with a normal Git revert commit.

## Publish a review

The hand-off from Risks In Sync Studio is a Publication Pack containing `review.md` and an optional `assets/` directory. See [`docs/publication-pack-v1.md`](docs/publication-pack-v1.md) and start from `src/content/reviews/_template/review.md`.

1. Work on `dev` and receive the reviewed Publication Pack.
2. Copy `review.md` to `src/content/reviews/<slug>/review.md`.
3. Copy every declared image to `public/review/<slug>/assets/`, preserving the `assets/<filename>` paths used in Markdown.
4. Run `npm run check:reviews`. Fix editorial data at its source; the validator never repairs or defaults it.
5. Run `npm test` and `npm run build`.
6. Run `npm run preview` and review `/`, `/review/` and `/review/<slug>/` on mobile and desktop. Confirm claims, evidence labels, sources, image rights and metadata.
7. Open a PR from `dev`. Publication occurs only when a human approves and merges it to `main`.

Do not edit `src/main.tsx`, `vite.config.ts`, generated HTML, the generated manifest, the homepage or the archive for a new issue. Directories under `src/content/reviews/` whose names begin with `_` are templates or supporting material and are not published.

Publishing flow:

```text
Studio/editor pack → validated Markdown + assets → local preview
→ human evidence approval → dev → main → Netlify
```

## UX/UI plan

Preserve the text-led technical-journal identity: warm ivory, anthracite, restrained ochre/red, whitespace and minimal components.

1. **Mobile hero:** the launch iPhone screenshot shows an oversized headline and forced line breaks pushing the CTA too far down. Reduce the narrow-screen size/spacing, make breaks responsive and test at 390×844, 320 px width and large text.
2. **Article reading:** tune article typography independently, add a simple contents list, improve source tap targets and place evidence labels nearer relevant claims.
3. **Publishing UI:** make archive/latest issue content-driven and generate metadata from content. Support optional rights-documented hero/social images.
4. **Quality:** test overflow, keyboard order, headings, contrast, zoom and reduced motion. Consider a licensed self-hosted font only if performance remains good.

Avoid gradients, dashboards, animations, excessive cards or startup-style feature clutter.

## Publication checklist

- All routes load directly and navigation works.
- No horizontal scroll at iPhone 13 or desktop sizes.
- Headline, diagram, evidence and sources are readable.
- Sources support nearby claims; unknowns remain unknown.
- AI disclosure, metadata, favicon and touch icon are present.
- `npm run build` and `git diff --check` pass.
- No `.env`, secrets, `dist/` or unrelated files are staged.
- After deployment, apex returns `200` and `www` redirects to apex.

## Known constraints

- Interface/content are English.
- Routing is deliberately minimal (`window.location.pathname`).
- Issue one remains text-led. The supplied screenshot appears to derive from Amprion's Dortmund headquarters press image, which Amprion permits for editorial use with attribution. It was not published because it depicts the company headquarters rather than the incident site, and the screenshot itself is not a traceable source asset. Its pack therefore declares `images: []` and retains the site-wide social fallback; this decision is documented in the Publication Pack v1 guide.
- The PNG icon is large and can be optimised later while retaining the source asset.
- Sources and cascade metadata live only in each review's frontmatter. The Markdown body retains the `## SOURCES` insertion point but never duplicates the list.
- The site has no accounts, audience analytics, advertising trackers or marketing cookies. Optional private feedback is processed as described on `/privacy/` and in `docs/private-feedback-runbook.md`.

## Launch record

On 8 September 2026 we built the MVP, published Cascade Risk Review Year 1 · Nr. 1, connected GitHub to Netlify, retained DNS at Porkbun, connected apex and `www`, and verified HTTPS. `main` is the production snapshot; future work starts from `dev`.
