# Risks In Sync

Public website for **Risks In Sync** and **Cascade Risk Review**. The publication asks what makes a disturbance become — or not become — a catastrophe as it moves through connected physical, digital and human systems.

> Editorial principle: **evidence is not interpretation**. Reviews distinguish **REPORTED**, **OBSERVED**, **INFERRED** and **UNKNOWN**.

## Production

MVP launched 8 September 2026.

The data-driven Publication Pack pipeline reached production on 14 September 2026 through website PR #3 (`305837d`). The live site can now publish a new review from only its validated `review.md` and declared assets; the homepage, archive, issue route, metadata, sitemap, feed and static HTML are generated without per-issue React or HTML edits.

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
- `/review/year-1-nr-2/` — second official issue
- `/about/` — method, Gray Zones and AI experiment
- `/privacy/` — privacy notice for private reader feedback
- `/robots.txt` — public crawler policy and sitemap pointer
- `/sitemap.xml` — canonical indexable URLs generated from published content
- `/feed.xml` — Atom feed generated from published reviews

The two published issues live in `src/content/reviews/year-1-nr-1/review.md` and `src/content/reviews/year-1-nr-2/review.md`. Each complete review supplies the article, cascade model, evidence status, sources, issue metadata and AI-assisted/human-edited disclosure used by every generated surface.

This is intentionally static: no CMS, custom database, authentication, application backend, runtime AI calls or automatic publishing. Private reader feedback is handled by Netlify Forms and reviewed manually. Google Search Console is configured for search discovery and performance reporting. Consent-gated GA4 support exists in the codebase but remains inactive while `VITE_GA_MEASUREMENT_ID` is absent.

The feedback launch decision, legitimate-interest assessment, retention rule and operating checklist are in `docs/private-feedback-runbook.md`.

Operational documentation:

- [Publication Pack v1 contract](docs/publication-pack-v1.md)
- [Private feedback runbook](docs/private-feedback-runbook.md)
- [Search Console and consent-ready GA4 setup](docs/search-console-and-analytics-setup.md)
- [Cascade Risk Review B+ distribution experiment and handoff](docs/cascade-risk-review-traffic-experiment.md)
- [Homepage and dynamic-pack design QA](design-qa.md)

Editorial working documents:

- [RiS Scout editorial agent prompt](docs/ris-scout-editorial-agent-prompt.md)
- [Owned-publication video rundown](docs/video-01-owned-publication-rundown.md)
- [Owned-publication technical guide draft](docs/freebie-publicacion-propia-guia-tecnica.md)

## Architecture

```text
Publication Pack v1 (`review.md` + declared assets)
→ shared parser, schema and editorial validator (`scripts/reviews.ts`)
→ generated typed manifest + issue entries + discovery artifacts
→ shared React route renderer (`src/main.tsx` + `src/server.tsx`)
→ Vite client and SSR builds
→ build-time prerender with hydrated interactivity
→ `dist/`
→ Netlify
```

- `src/main.tsx` — layouts and generic manifest-driven renderer
- `src/styles.css` — visual system and responsive design
- `src/content/reviews/<slug>/review.md` — complete editorial source of truth per issue
- `public/review/<slug>/assets/` — rights-documented images declared by the issue
- `schemas/publication-pack-v1.schema.json` — canonical versioned frontmatter schema
- `scripts/reviews.ts` — the one parser/validator used by loading, checks, generation and tests
- `scripts/generate-reviews.ts` — generates review entries, route metadata, sitemap, feed and crawler policy from published content
- `scripts/prerender.mjs` — renders meaningful route HTML at build time without duplicating the React page implementation
- `scripts/verify-build.mjs` — verifies static content, metadata, structured data, discovery files and 404 output
- `src/generated/reviews.ts` — ignored, generated typed manifest
- `review/<slug>/index.html` and `review/.generated-entries.json` — ignored, generated route metadata and Vite inputs
- `src/analytics.ts` — production-host-only, consent-gated GA4 loader and typed event boundary; inert without a valid measurement ID
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

When the sibling Studio checkout is available, also run `npm run verify:publication-flow` to exercise the cross-repository handoff.

Release only after human editorial approval:

```sh
git push origin dev
```

Open a GitHub PR from `dev` to `main`, wait for the checks and Deploy Preview, and merge it manually. Then update the local production branch:

```sh
git switch main
git pull --ff-only origin main
git switch dev
```

Never force-push. If branches diverge, inspect them instead of forcing a merge. Roll back production with a normal Git revert commit.

## Publish a review

The hand-off from Risks In Sync Studio is a Publication Pack containing `review.md` and an optional `assets/` directory. See [`docs/publication-pack-v1.md`](docs/publication-pack-v1.md) and start from `src/content/reviews/_template/review.md`.

Scout should normally deliver the complete pack as one ZIP. An unpacked folder is equivalent and convenient during local inspection; standalone `review.md` is intended for reviews with no assets or when assets will be added later in Studio. A pack with images uses this shape:

```text
year-1-nr-2/
├── review.md
└── assets/
    └── homepage.webp
```

Normal Studio flow:

1. Import and edit the pack in Review Desk, resolve validation issues and complete the five confirmations.
2. Download the immutable backup and create `studio/<slug>` plus its PR directly to Website `main`.
3. Review the Netlify Deploy Preview on mobile and desktop. Confirm `/`, `/review/`, `/review/<slug>/`, claims, evidence labels, sources, imagery, rights and metadata.
4. Merge manually in GitHub. Wait for production, then refresh Studio until the record becomes Published.

Manual recovery flow, used only if the Studio bridge is unavailable:

1. Work on `dev` and receive the reviewed Publication Pack.
2. Copy `review.md` to `src/content/reviews/<slug>/review.md`.
3. Copy every declared image to `public/review/<slug>/assets/`, preserving the `assets/<filename>` paths used in Markdown.
4. Run `npm run check:reviews`, `npm test` and `npm run build`. Fix editorial data at its source; the validator never repairs or defaults it.
5. Run `npm run preview` and inspect the same routes and editorial checks as above.
6. Open a PR from `dev` to `main`. Publication occurs only when a human approves and merges it.

Do not edit `src/main.tsx`, `vite.config.ts`, generated HTML, the generated manifest, the homepage or the archive for a new issue. Directories under `src/content/reviews/` whose names begin with `_` are templates or supporting material and are not published.

Publishing flow:

```text
Scout pack → Studio validation and human approval → studio/<slug>
→ PR to main → Netlify Deploy Preview → manual merge → production
```

## Editorial distribution direction

The approved primary strategy is the bounded **B+ distribution experiment**: use four consecutive reviews to test whether the publication creates useful professional conversations, strengthens the method and earns invitations to briefings, workshops or technical roundtables.

Each issue should yield one canonical review, one defensible discovery statement, one shareable case map, one transferable question, one horizontal Editor's Take of up to three minutes, and five relevant expert or practitioner conversations. Risks In Sync remains the canonical evidence base; LinkedIn and YouTube are distribution surfaces. The review also acts as a professional calling card and a concrete object around which specialists can disagree, correct the interpretation and improve the method.

The complete audience, video, workshop, visual identity, measurement and decision-gate handoff is in [`docs/cascade-risk-review-traffic-experiment.md`](docs/cascade-risk-review-traffic-experiment.md).

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
- The site has no accounts, active browser audience analytics, advertising trackers or marketing cookies. Search Console operates outside the browser. GA4 remains inactive unless a valid production-only `VITE_GA_MEASUREMENT_ID` is deliberately configured and the reader explicitly accepts analytics. Optional private feedback is processed as described on `/privacy/` and in `docs/private-feedback-runbook.md`.

## Launch record

On 8 September 2026 we built the MVP, published Cascade Risk Review Year 1 · Nr. 1, connected GitHub to Netlify, retained DNS at Porkbun, connected apex and `www`, and verified HTTPS. `main` is the production snapshot; future work starts from `dev`.

On 14 September 2026 we deployed the generic Publication Pack renderer and validator, optional issue-controlled homepage illustration and compact caption, neutral cascade outcome model, and the Studio-to-Website review-PR boundary. The GitHub App is installed only on this repository with Metadata read-only, Contents read/write and Pull requests read/write. Studio cannot merge or write directly to `main`.

On 15 September 2026 Year 1 · Nr. 2 completed the real Scout-to-Studio-to-Website publication path and was merged through the human-reviewed PR boundary.

On 18 September 2026 the discoverability release put complete route content into the initial HTML, added stable canonical metadata and JSON-LD, generated `robots.txt`, `sitemap.xml` and `feed.xml`, introduced a real 404, and added consent-ready GA4 support that is disabled by default. The `risksinsync.com` Domain property was verified in Google Search Console through Porkbun DNS, the sitemap was accepted with six discovered URLs, and indexing was requested for the homepage, Review archive and both published issues. Google was still processing the initial page-indexing data at handoff.
