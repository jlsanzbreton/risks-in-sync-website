import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const server = await import(pathToFileURL(join(root, ".prerender/server.js")).href);
const reviews = server.publicationData();
const SITE_URL = "https://risksinsync.com";
const publicRoutes = ["/", "/review/", ...reviews.map((review) => review.path), "/about/", "/privacy/"];

function escapeXml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

function htmlFile(route) {
  return route === "/" ? join(dist, "index.html") : join(dist, route, "index.html");
}

function safeJson(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

for (const route of publicRoutes) {
  const file = htmlFile(route);
  const pathname = route.replace(/\/+$/, "") || "/";
  const rendered = server.render(pathname);
  const jsonLd = server.structuredData(pathname);
  let html = readFileSync(file, "utf8");
  html = html.replace('<div id="root"></div>', `<div id="root">${rendered}</div>`);
  if (!html.includes('rel="alternate" type="application/atom+xml"')) {
    html = html.replace("</head>", `    <link rel="alternate" type="application/atom+xml" title="Cascade Risk Review" href="/feed.xml" />\n  </head>`);
  }
  if ((Array.isArray(jsonLd) && jsonLd.length) || (!Array.isArray(jsonLd) && Object.keys(jsonLd).length)) {
    html = html.replace("</head>", `    <script type="application/ld+json">${safeJson(jsonLd)}</script>\n  </head>`);
  }
  writeFileSync(file, html);
}

const latestDate = reviews[0]?.publication_date;
const sitemapEntries = [
  { path: "/", lastmod: latestDate },
  { path: "/review/", lastmod: latestDate },
  ...reviews.map((review) => ({ path: review.path, lastmod: review.publication_date })),
  { path: "/about/" },
  { path: "/privacy/", lastmod: "2026-09-17" },
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.map(({ path, lastmod }) => `  <url><loc>${SITE_URL}${path}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`).join("\n")}
</urlset>
`;
writeFileSync(join(dist, "sitemap.xml"), sitemap);

const robots = `# OAI-SearchBot supports OpenAI search discovery and is allowed explicitly.
# GPTBot may be used for model-training collection. No GPTBot-specific policy is set here;
# it therefore follows the public wildcard rule. Review that policy separately before changing it.
User-agent: OAI-SearchBot
Allow: /

User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
writeFileSync(join(dist, "robots.txt"), robots);

function imageFor(review) {
  const image = review.images.find((candidate) => candidate.role === "social")
    ?? review.images.find((candidate) => candidate.role === "hero")
    ?? review.images.find((candidate) => candidate.role === "homepage");
  return image ? `${SITE_URL}/review/${review.slug}/${image.path}` : null;
}

const updated = latestDate ? `${latestDate}T00:00:00Z` : "2026-09-17T00:00:00Z";
const feed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Cascade Risk Review</title>
  <subtitle>Real incidents examined through propagation, amplification, barriers and containment.</subtitle>
  <id>${SITE_URL}/review/</id>
  <link href="${SITE_URL}/review/" />
  <link href="${SITE_URL}/feed.xml" rel="self" type="application/atom+xml" />
  <updated>${updated}</updated>
  <author><name>Jose Luis Sanz</name><uri>${SITE_URL}/about/</uri></author>
${reviews.map((review) => {
  const image = imageFor(review);
  return `  <entry>
    <title>${escapeXml(review.title)}</title>
    <id>${SITE_URL}${review.path}</id>
    <link href="${SITE_URL}${review.path}" />${image ? `\n    <link href="${escapeXml(image)}" rel="enclosure" />` : ""}
    <published>${review.publication_date}T00:00:00Z</published>
    <updated>${review.publication_date}T00:00:00Z</updated>
    <author><name>${escapeXml(review.author)}</name></author>
    <summary>${escapeXml(review.summary)}</summary>
  </entry>`;
}).join("\n")}
</feed>
`;
writeFileSync(join(dist, "feed.xml"), feed);

const notFoundSource = join(root, "404.html");
if (readFileSync(notFoundSource, "utf8")) {
  const target = join(dist, "404.html");
  mkdirSync(dirname(target), { recursive: true });
  let html = readFileSync(target, "utf8");
  html = html.replace('<div id="root"></div>', `<div id="root">${server.render("/404")}</div>`);
  writeFileSync(target, html);
}

console.log(`Prerendered ${publicRoutes.length} public routes and generated robots.txt, sitemap.xml and feed.xml.`);
