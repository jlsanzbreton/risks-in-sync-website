# Risks In Sync

Public website for **Risks In Sync** and **Cascade Risk Review**. It studies how disturbances propagate through connected physical, digital and human systems.

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

Year 1 · Nr. 1 is complete in `src/content/year-1-nr-1.md`: full article, cascade diagram, required analysis, evidence status, six real source URLs and AI-assisted/human-edited disclosure. No source placeholders remain.

This is intentionally static: no CMS, database, authentication, functions, analytics, AI calls or automatic publishing.

## Architecture

```text
HTML entry points + local Markdown/TypeScript content
→ React page renderer (`src/main.tsx`)
→ Vite static build
→ `dist/`
→ Netlify
```

- `src/main.tsx` — layouts, route selection and renderer
- `src/styles.css` — visual system and responsive design
- `src/content/` — issue body and metadata
- `review/**/index.html` — static route metadata
- `vite.config.ts` — build entry points
- `public/risksinsync-icon.png` — favicon/touch icon
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
npm run build
git diff --check
```

There are currently no test or lint scripts. Preview with `npm run preview`.

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

## Publish the next issue today

For `year-1-nr-2`:

1. Work on `dev`.
2. Copy the current `.md` and `.ts` content files to the new slug; preserve required sections and `<!-- CASCADE_DIAGRAM -->`.
3. Create `review/<slug>/index.html` with correct SEO/Open Graph metadata.
4. Register its HTML entry in `vite.config.ts`.
5. Import and route it in `src/main.tsx`; update latest issue and retain older issues in the archive.
6. Verify every source, claim, evidence label, date and image licence manually.
7. Build and preview home, archive, issue and about pages on iPhone 13 and desktop.
8. Push `dev`; merge to `main` only when approved.

## Semi-automated publishing path

Build this next, without adding a CMS or backend:

1. Make one Markdown file per issue the source of truth, with validated front matter for slug, dates, title, dek, evidence, sources, optional image rights and method version.
2. Add `npm run new:review -- <slug>` to create a complete issue from a committed template.
3. Discover content at build time so routes, archive, latest issue and metadata are generated automatically.
4. Add `npm run check:reviews` to reject missing sections, duplicate slugs, placeholders, malformed sources, missing evidence categories and undocumented image rights.
5. Add route smoke tests, source-link reporting and iPhone 13/desktop screenshots.
6. RiS Scout may generate a conforming draft Markdown file, but human review must control evidence status and publication.

Target workflow:

```text
Scout/editor draft → one validated Markdown file → local preview
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
- Issue one has no hero image because reuse rights were not established.
- The PNG icon is large and can be optimised later while retaining the source asset.
- Sources currently appear in both Markdown and TypeScript; the content automation should remove this duplication.
- The launch site collects no user data.

## Launch record

On 8 September 2026 we built the MVP, published Cascade Risk Review Year 1 · Nr. 1, connected GitHub to Netlify, retained DNS at Porkbun, connected apex and `www`, and verified HTTPS. `main` is the production snapshot; future work starts from `dev`.
