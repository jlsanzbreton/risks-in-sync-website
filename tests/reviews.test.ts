import assert from "node:assert/strict";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { afterEach } from "node:test";
import { generateReviews } from "../scripts/generate-reviews";
import { DEFAULT_REPO_ROOT, loadReviews, parseReviewFile } from "../scripts/reviews";

const tempRoots: string[] = [];

afterEach(() => {
  while (tempRoots.length) rmSync(tempRoots.pop()!, { recursive: true, force: true });
});

function makeRepo(): string {
  const root = mkdtempSync(join(tmpdir(), "risks-in-sync-reviews-"));
  tempRoots.push(root);
  mkdirSync(join(root, "schemas"), { recursive: true });
  copyFileSync(join(DEFAULT_REPO_ROOT, "schemas/publication-pack-v1.schema.json"), join(root, "schemas/publication-pack-v1.schema.json"));
  return root;
}

function body(): string {
  return `Opening context with real editorial detail.

## The event

The event account contains verified, substantive detail.

## The cascade

<!-- CASCADE_DIAGRAM -->

The cascade analysis explains propagation and containment.

## What worked

The system contained the consequence for documented reasons.

## What didn't — or we don't know

Important mechanisms remain unresolved in public evidence.

## Gray Zones

Ownership and uncertainty cross organisational boundaries.

## Risks In Sync

The method follows the disturbance across connected systems.

## What this case changes

The case supports a modest and evidence-bounded refinement.

## Evidence status

### REPORTED

The operator reported the initiating event.

### OBSERVED

The public outcome was directly observable.

### INFERRED

Containment mechanisms are analytical inferences.

### UNKNOWN

The detailed protection sequence remains unknown.

<!-- PRIVATE_FEEDBACK -->

## SOURCES
`;
}

interface PackOptions {
  slug?: string;
  id?: string;
  year?: number;
  number?: number;
  publicationDate?: string;
  status?: "draft" | "ready_for_pr";
  imagesYaml?: string;
  markdownBody?: string;
  sourceUrl?: string;
  sourceVerification?: "verified" | "unverified";
  title?: string;
}

function pack(options: PackOptions = {}): string {
  const slug = options.slug ?? "year-1-nr-1";
  const year = options.year ?? 1;
  const number = options.number ?? 1;
  return `---
schema_version: 1
id: ${JSON.stringify(options.id ?? `crr-y${year}-n${number}`)}
slug: ${slug}
status: ${options.status ?? "ready_for_pr"}
issue:
  year: ${year}
  number: ${number}
  label: ${JSON.stringify(`Year ${year} · Nr. ${number}`)}
review_period:
  start: 2026-09-01
  end: 2026-09-07
publication_date: ${options.publicationDate ?? "2026-09-08"}
title: ${JSON.stringify(options.title ?? "A complete test review")}
dek: "A substantive editorial standfirst for this review."
summary: "A concise description for the archive and social metadata."
author: "Jose Luis Sanz"
language: en
method_version: risks-in-sync-v1
editorial: null
cascade:
  title: "Propagation path"
  subtitle: "How the disturbance propagated"
  steps:
    - "Initial disturbance"
    - "Affected subsystem"
    - "Containment"
  outcome_status: contained
  observed_outcome: "The disturbance was contained at the shared boundary."
  counterfactual_outcome: "Wider failure"
  evidence_status: INFERRED
  note: "A bounded analytical model based on public evidence."
sources:
  - id: source-1
    title: "Source title"
    publisher: "Publisher"
    url: ${JSON.stringify(options.sourceUrl ?? "https://example.com/source")}
    published_date: 2026-09-02
    accessed_date: 2026-09-07
    kind: primary
    verification: ${options.sourceVerification ?? "verified"}
    note: "This source supports the event account."
${options.imagesYaml ?? "images: []"}
---

${options.markdownBody ?? body()}`;
}

function writePack(root: string, options: PackOptions = {}, assets: string[] = []): string {
  const slug = options.slug ?? "year-1-nr-1";
  const contentDirectory = join(root, "src", "content", "reviews", slug);
  mkdirSync(contentDirectory, { recursive: true });
  const file = join(contentDirectory, "review.md");
  writeFileSync(file, pack(options));
  for (const asset of assets) {
    const assetFile = join(root, "public", "review", slug, asset);
    mkdirSync(join(assetFile, ".."), { recursive: true });
    writeFileSync(assetFile, "image fixture");
  }
  return file;
}

function expectInvalid(run: () => unknown, pattern: RegExp): void {
  assert.throws(run, pattern);
}

test("accepts a valid publication pack", () => {
  const root = makeRepo();
  const parsed = parseReviewFile(writePack(root), root);
  assert.equal(parsed.frontmatter.slug, "year-1-nr-1");
  assert.match(parsed.review.html.beforeCascade, /The event/);
});

test("supports contained, harmful, ongoing and uncertain cascade outcomes without assuming success", async (t) => {
  for (const status of ["contained", "partially_propagated", "fully_propagated", "ongoing", "uncertain"]) {
    await t.test(status, () => {
      const root = makeRepo();
      const file = writePack(root);
      writeFileSync(file, pack().replace("outcome_status: contained", `outcome_status: ${status}`).replace('counterfactual_outcome: "Wider failure"', "counterfactual_outcome: null"));
      assert.equal(parseReviewFile(file, root).frontmatter.cascade.outcome_status, status);
    });
  }
});

test("requires an observed outcome and rejects an unknown outcome status", async (t) => {
  await t.test("missing observed outcome", () => {
    const root = makeRepo();
    const file = writePack(root);
    writeFileSync(file, pack().replace('  observed_outcome: "The disturbance was contained at the shared boundary."\n', ""));
    expectInvalid(() => parseReviewFile(file, root), /missing required field 'observed_outcome'/);
  });
  await t.test("unknown status", () => {
    const root = makeRepo();
    const file = writePack(root);
    writeFileSync(file, pack().replace("outcome_status: contained", "outcome_status: successful"));
    expectInvalid(() => parseReviewFile(file, root), /outcome_status/);
  });
});

test("validates drafts but excludes them from the published manifest", () => {
  const root = makeRepo();
  writePack(root, { status: "draft", sourceVerification: "unverified" });
  const result = loadReviews(root);
  assert.equal(result.published.length, 0);
  assert.equal(result.drafts.length, 1);
});

test("rejects malformed YAML frontmatter", () => {
  const root = makeRepo();
  const file = writePack(root);
  writeFileSync(file, pack().replace("id: \"crr-y1-n1\"", "id: [broken"));
  expectInvalid(() => parseReviewFile(file, root), /frontmatter/);
});

test("rejects missing required and unknown frontmatter fields", async (t) => {
  await t.test("missing", () => {
    const root = makeRepo();
    const file = writePack(root);
    writeFileSync(file, pack().replace('author: "Jose Luis Sanz"\n', ""));
    expectInvalid(() => parseReviewFile(file, root), /missing required field 'author'/);
  });
  await t.test("unknown", () => {
    const root = makeRepo();
    const file = writePack(root);
    writeFileSync(file, pack().replace("schema_version: 1\n", "schema_version: 1\nunexpected_field: true\n"));
    expectInvalid(() => parseReviewFile(file, root), /unknown field 'unexpected_field'/);
  });
});

test("rejects an inconsistent slug and issue number", () => {
  const root = makeRepo();
  const file = writePack(root, { number: 2, id: "other-id" });
  expectInvalid(() => parseReviewFile(file, root), /do not agree with slug/);
});

test("rejects impossible calendar dates", () => {
  const root = makeRepo();
  const file = writePack(root, { publicationDate: "2026-02-30" });
  expectInvalid(() => parseReviewFile(file, root), /not a real YYYY-MM-DD calendar date/);
});

test("rejects missing, empty, duplicate and disordered editorial sections", async (t) => {
  const cases: Array<[string, string, RegExp]> = [
    ["missing", body().replace("## What worked\n", ""), /'## What worked' is missing/],
    ["empty", body().replace("The system contained the consequence for documented reasons.", ""), /section '## What worked' is empty/],
    ["duplicate", body().replace("## What worked", "## What worked\n\nExtra text.\n\n## What worked"), /appears 2 times/],
    ["disordered", body().replace("## The event", "## What worked").replace("## What worked\n\nThe system", "## The event\n\nThe system"), /out of order/],
  ];
  for (const [name, markdownBody, pattern] of cases) {
    await t.test(name, () => {
      const root = makeRepo();
      const file = writePack(root, { markdownBody });
      expectInvalid(() => parseReviewFile(file, root), pattern);
    });
  }
});

test("requires every evidence status exactly once and with text", async (t) => {
  for (const status of ["REPORTED", "OBSERVED", "INFERRED", "UNKNOWN"]) {
    await t.test(status, () => {
      const root = makeRepo();
      const markdownBody = body().replace(`### ${status}\n`, "");
      const file = writePack(root, { markdownBody });
      expectInvalid(() => parseReviewFile(file, root), new RegExp(`### ${status}.*missing`));
    });
  }
});

test("rejects insecure, malformed and unverified sources", async (t) => {
  const cases: Array<[string, PackOptions, RegExp]> = [
    ["http", { sourceUrl: "http://example.com/source" }, /absolute HTTPS URL/],
    ["malformed", { sourceUrl: "https://" }, /syntactically valid/],
    ["unverified", { sourceVerification: "unverified" }, /must be 'verified'/],
  ];
  for (const [name, options, pattern] of cases) {
    await t.test(name, () => {
      const root = makeRepo();
      const file = writePack(root, options);
      expectInvalid(() => parseReviewFile(file, root), pattern);
    });
  }
});

const heroImage = (overrides = "") => `images:
  - id: hero
    path: assets/hero.webp
    role: hero
    alt: "Meaningful alternative text"
    decorative: false
    caption: "Visible caption"
    credit: "Editorial source"
    source_url: "https://example.com/original"
    rights_basis: "Documented editorial-use basis"
    verification: cleared
${overrides}`;

const homepageImage = (overrides = "") => `images:
  - id: homepage
    path: assets/homepage.webp
    role: homepage
    alt: "A satirical editorial illustration"
    decorative: false
    label: "Gray Zones · Signal"
    caption: "A visible warning becomes familiar enough to be treated as background noise."
    credit: "Editorial source"
    source_url: "https://example.com/original"
    rights_basis: "Documented editorial-use basis"
    verification: cleared
${overrides}`;

test("enforces image existence, declaration, alt, rights and path safety", async (t) => {
  await t.test("missing file", () => {
    const root = makeRepo();
    const file = writePack(root, { imagesYaml: heroImage() });
    expectInvalid(() => parseReviewFile(file, root), /does not exist/);
  });
  await t.test("undeclared Markdown image", () => {
    const root = makeRepo();
    const file = writePack(root, { markdownBody: body().replace("The event account", "![Asset](assets/extra.webp)\n\nThe event account") }, ["assets/extra.webp"]);
    expectInvalid(() => parseReviewFile(file, root), /not declared/);
  });
  await t.test("undeclared asset file", () => {
    const root = makeRepo();
    const file = writePack(root, {}, ["assets/unused.webp"]);
    expectInvalid(() => parseReviewFile(file, root), /asset file 'assets\/unused.webp' is not declared/);
  });
  await t.test("missing alt", () => {
    const root = makeRepo();
    const file = writePack(root, { imagesYaml: heroImage().replace('alt: "Meaningful alternative text"', 'alt: ""') }, ["assets/hero.webp"]);
    expectInvalid(() => parseReviewFile(file, root), /alt is required/);
  });
  await t.test("missing rights", () => {
    const root = makeRepo();
    const file = writePack(root, { imagesYaml: heroImage().replace('rights_basis: "Documented editorial-use basis"', "rights_basis: null") }, ["assets/hero.webp"]);
    expectInvalid(() => parseReviewFile(file, root), /rights_basis is required/);
  });
  await t.test("path traversal", () => {
    const root = makeRepo();
    const file = writePack(root, { imagesYaml: heroImage().replace("assets/hero.webp", "assets/%2e%2e/hero.webp") });
    expectInvalid(() => parseReviewFile(file, root), /encoded path traversal/);
  });
});

test("validates a homepage illustration and its compact editorial caption", async (t) => {
  await t.test("accepts one complete homepage illustration", () => {
    const root = makeRepo();
    const file = writePack(root, { imagesYaml: homepageImage() }, ["assets/homepage.webp"]);
    assert.equal(parseReviewFile(file, root).frontmatter.images[0].role, "homepage");
  });
  await t.test("requires its label", () => {
    const root = makeRepo();
    const file = writePack(root, { imagesYaml: homepageImage().replace('label: "Gray Zones · Signal"', "label: null") }, ["assets/homepage.webp"]);
    expectInvalid(() => parseReviewFile(file, root), /label is required/);
  });
  await t.test("limits the caption to two explicit lines", () => {
    const root = makeRepo();
    const file = writePack(root, { imagesYaml: homepageImage().replace('caption: "A visible warning becomes familiar enough to be treated as background noise."', 'caption: "Line one\\nLine two\\nLine three"') }, ["assets/homepage.webp"]);
    expectInvalid(() => parseReviewFile(file, root), /at most two lines/);
  });
});

test("rejects editorial placeholders", () => {
  const root = makeRepo();
  const file = writePack(root, { markdownBody: body().replace("The event account", "TODO: The event account") });
  expectInvalid(() => parseReviewFile(file, root), /editorial placeholder/);
});

test("sorts the archive and latest review by publication date with deterministic issue tie-breaks", () => {
  const root = makeRepo();
  writePack(root, { slug: "year-1-nr-1", id: "one", year: 1, number: 1, publicationDate: "2026-09-08" });
  writePack(root, { slug: "year-1-nr-2", id: "two", year: 1, number: 2, publicationDate: "2026-09-15" });
  writePack(root, { slug: "year-2-nr-1", id: "three", year: 2, number: 1, publicationDate: "2026-09-15" });
  const { published } = loadReviews(root);
  assert.deepEqual(published.map((item) => item.frontmatter.slug), ["year-2-nr-1", "year-1-nr-2", "year-1-nr-1"]);
});

test("sanitizes arbitrary Markdown HTML while preserving rendered editorial content", () => {
  const root = makeRepo();
  const file = writePack(root, { markdownBody: body().replace("Opening context", '<script>alert("x")</script>\n\nOpening context') });
  const parsed = parseReviewFile(file, root);
  assert.doesNotMatch(parsed.review.html.beforeCascade, /<script|alert\(/);
  assert.match(parsed.review.html.beforeCascade, /Opening context/);
});

test("generates escaped issue HTML, metadata and a slug-specific Netlify form", () => {
  const root = makeRepo();
  writePack(root, { title: 'A review with "quotes" & signals' });
  generateReviews(root);
  const html = readFileSync(join(root, "review", "year-1-nr-1", "index.html"), "utf8");
  assert.match(html, /<title>A review with &quot;quotes&quot; &amp; signals \| Cascade Risk Review<\/title>/);
  assert.match(html, /name="description" content="A concise description for the archive and social metadata\."/);
  assert.match(html, /<link rel="canonical" href="https:\/\/risksinsync.com\/review\/year-1-nr-1\/"/);
  assert.match(html, /property="og:type" content="article"/);
  assert.match(html, /property="og:url" content="https:\/\/risksinsync.com\/review\/year-1-nr-1\/"/);
  assert.match(html, /property="og:image:alt" content="Risks In Sync"/);
  assert.match(html, /article:published_time" content="2026-09-08"/);
  assert.match(html, /property="article:author" content="Jose Luis Sanz"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /name="twitter:description" content="A concise description for the archive and social metadata\."/);
  assert.match(html, /A review with &quot;quotes&quot; &amp; signals/);
  assert.match(html, /private-feedback-year-1-nr-1/);
  assert.match(html, /risksinsync-og\.png/);
});

test("keeps the direct Year 1 Nr. 1 route and generates two issues without per-issue code or HTML", () => {
  const root = makeRepo();
  writePack(root, { slug: "year-1-nr-1", id: "one", year: 1, number: 1, publicationDate: "2026-09-08" });
  writePack(root, { slug: "year-1-nr-2", id: "two", year: 1, number: 2, publicationDate: "2026-09-15" });
  const result = generateReviews(root);
  assert.deepEqual(result.slugs, ["year-1-nr-2", "year-1-nr-1"]);
  const entries = JSON.parse(readFileSync(join(root, "review", ".generated-entries.json"), "utf8"));
  assert.equal(entries["review-year-1-nr-1"], "review/year-1-nr-1/index.html");
  assert.equal(entries["review-year-1-nr-2"], "review/year-1-nr-2/index.html");
  const manifest = readFileSync(join(root, "src", "generated", "reviews.ts"), "utf8");
  assert.match(manifest, /year-1-nr-1/);
  assert.match(manifest, /year-1-nr-2/);
});
