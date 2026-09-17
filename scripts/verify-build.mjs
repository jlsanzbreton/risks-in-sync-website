import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const server = await import(pathToFileURL(join(root, ".prerender/server.js")).href);
const reviews = server.publicationData();
const routes = ["/", "/review/", ...reviews.map((review) => review.path), "/about/", "/privacy/"];

function fileFor(route) {
  return route === "/" ? join(dist, "index.html") : join(dist, route, "index.html");
}

function assertWellFormedXml(xml, label) {
  const stack = [];
  const tokens = xml.replace(/<!--[\s\S]*?-->/g, "").match(/<[^>]+>/g) ?? [];
  for (const token of tokens) {
    if (/^<\?|^<!|^<\//.test(token)) {
      if (token.startsWith("</")) {
        const name = token.slice(2, -1).trim();
        assert.equal(stack.pop(), name, `${label}: mismatched closing tag ${name}`);
      }
      continue;
    }
    if (token.endsWith("/>") || token.startsWith("<?")) continue;
    const name = token.slice(1).split(/[\s>]/, 1)[0];
    stack.push(name);
  }
  assert.deepEqual(stack, [], `${label}: unclosed XML tags`);
}

for (const route of routes) {
  const html = readFileSync(fileFor(route), "utf8");
  assert.doesNotMatch(html, /<div id="root"><\/div>/, `${route} has an empty app root`);
  assert.match(html, /<main id="main">/, `${route} has no meaningful main content`);
  assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1, `${route} must have one canonical`);
  assert.match(html, /rel="alternate" type="application\/atom\+xml"/, `${route} has no feed discovery link`);
  assert.doesNotMatch(html, /<script[^>]+(?:google-analytics|googletagmanager)/, `${route} loads Google before consent`);
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
}

for (const review of reviews) {
  const html = readFileSync(fileFor(review.path), "utf8");
  const bodySample = review.html.beforeCascade.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
  assert.ok(bodySample.length > 30 && html.includes(bodySample), `${review.slug} does not contain its article body`);
  assert.match(html, new RegExp(`private-feedback-${review.slug}`), `${review.slug} lost its Netlify form`);
  assert.match(html, /"@type":"Article"/, `${review.slug} has no Article JSON-LD`);
}

const robots = readFileSync(join(dist, "robots.txt"), "utf8");
assert.match(robots, /User-agent: OAI-SearchBot[\s\S]*Allow: \//);
assert.match(robots, /Sitemap: https:\/\/risksinsync\.com\/sitemap\.xml/);

const sitemap = readFileSync(join(dist, "sitemap.xml"), "utf8");
assertWellFormedXml(sitemap, "sitemap.xml");
for (const route of routes) assert.ok(sitemap.includes(`<loc>https://risksinsync.com${route}</loc>`), `sitemap missing ${route}`);

const feed = readFileSync(join(dist, "feed.xml"), "utf8");
assertWellFormedXml(feed, "feed.xml");
assert.equal((feed.match(/<entry>/g) ?? []).length, reviews.length, "feed entry count differs from published reviews");
for (const review of reviews) assert.ok(feed.includes(`<id>https://risksinsync.com${review.path}</id>`), `feed missing ${review.slug}`);

assert.equal(existsSync(join(dist, "404.html")), true, "404.html is missing");
const notFound = readFileSync(join(dist, "404.html"), "utf8");
assert.match(notFound, /name="robots" content="noindex,follow"/);
assert.doesNotMatch(notFound, /rel="canonical"/);
assert.match(notFound, /Page not found/);

console.log(`Verified ${routes.length} prerendered routes, ${reviews.length} reviews, discovery files, metadata, JSON-LD, feed, forms and 404 output.`);
