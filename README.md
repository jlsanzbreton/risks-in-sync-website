# Risks In Sync

The static editorial website for Risks In Sync and Cascade Risk Review.

## Local development

```sh
npm install
npm run dev
```

## Publishing a review

Review content lives in `src/content/`. Add the issue data there, create its matching static HTML entry, and register that entry in `vite.config.ts`. This keeps each public route deployable as a real static page without a database, CMS, server or redirect rule.

Publishing flow:

```text
local content file → npm run build → push to main → Netlify deploy
```

## Production build

```sh
npm run build
```

Netlify uses `netlify.toml` to publish the generated `dist/` directory.
