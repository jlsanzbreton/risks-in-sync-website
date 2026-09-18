import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const WEBSITE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const STUDIO_ROOT = resolve(WEBSITE_ROOT, "../risks-in-sync-studio");
const FIXTURE_ROOT = join(WEBSITE_ROOT, "tests/fixtures/publication-pack-v1/year-1-nr-2");
const SLUG = "year-1-nr-2";
const keepTemporaryCopy = process.argv.includes("--keep");

const studioPublication = await import(pathToFileURL(join(STUDIO_ROOT, "src/review/publicationPack.ts")).href);
const studioWorkflow = await import(pathToFileURL(join(STUDIO_ROOT, "src/review/workflow.ts")).href);
const studioTypes = await import(pathToFileURL(join(STUDIO_ROOT, "src/review/types.ts")).href);
const studioGithub = await import(pathToFileURL(join(STUDIO_ROOT, "netlify/functions/_shared/github.ts")).href);
const websiteReviews = await import(pathToFileURL(join(WEBSITE_ROOT, "scripts/reviews.ts")).href);
const studioRequire = createRequire(join(STUDIO_ROOT, "package.json"));
const { unzipSync, strFromU8 } = studioRequire("fflate");

function bytes(buffer) {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function assertIncludes(value, expected, label) {
  assert.ok(value.includes(expected), `${label} is missing '${expected}'.`);
}

function transformExtractedPack(repoRoot, slug, archiveFiles) {
  const contentTarget = join(repoRoot, "src/content/reviews", slug, "review.md");
  const assetRoot = join(repoRoot, "public/review", slug);
  if (existsSync(contentTarget)) throw new Error(`Duplicate slug: ${slug} already exists in the Website repository.`);
  mkdirSync(dirname(contentTarget), { recursive: true });
  writeFileSync(contentTarget, archiveFiles["review.md"]);
  for (const [path, value] of Object.entries(archiveFiles)) {
    if (path === "review.md") continue;
    const assetTarget = join(assetRoot, ...path.split("/"));
    mkdirSync(dirname(assetTarget), { recursive: true });
    writeFileSync(assetTarget, value);
  }
  return { contentTarget, assetRoot };
}

function fixtureFiles(markdown = readFileSync(join(FIXTURE_ROOT, "review.md"), "utf8"), includeAsset = true) {
  const files = [{ path: "review.md", bytes: bytes(Buffer.from(markdown)), mimeType: "text/markdown" }];
  if (includeAsset) {
    files.push({ path: "assets/hero.webp", bytes: bytes(readFileSync(join(FIXTURE_ROOT, "assets/hero.webp"))), mimeType: "image/webp" });
  }
  return files;
}

function approveAll(record, timestamp) {
  for (const key of Object.keys(studioTypes.approvalLabels)) {
    record.approvalChecklist = studioWorkflow.setApproval(record.approvalChecklist, key, true, timestamp);
  }
  return record;
}

function editRecord(record) {
  let draft = structuredClone(record.editableDraft);
  draft.frontmatter.title = "The verified handoff that contained the cascade";
  draft.frontmatter.dek = "A fully edited fixture proving the complete Publication Pack workflow.";
  record = studioWorkflow.applyEditorialChange(record, draft, "metadata", "2026-09-11T10:01:00.000Z");

  draft = structuredClone(record.editableDraft);
  draft.body.evidence.INFERRED = "The sequence supports a bounded inference that the confirmed handoff shortened exposure near the operating threshold.";
  record = studioWorkflow.applyEditorialChange(record, draft, "evidence", "2026-09-11T10:02:00.000Z");

  draft = structuredClone(record.editableDraft);
  draft.frontmatter.cascade.outcome_status = "partially_propagated";
  draft.frontmatter.cascade.observed_outcome = "The disruption crossed the shared boundary, but the verified handoff limited its operational reach.";
  draft.frontmatter.cascade.counterfactual_outcome = "Without the handoff, the same path could have affected the dependent service.";
  record = studioWorkflow.applyEditorialChange(record, draft, "evidence", "2026-09-11T10:02:30.000Z");

  draft = structuredClone(record.editableDraft);
  draft.frontmatter.sources[0].note = "Provides the reported transfer time, threshold values and the reviewed isolation timestamp.";
  record = studioWorkflow.applyEditorialChange(record, draft, "sources", "2026-09-11T10:03:00.000Z");

  draft = structuredClone(record.editableDraft);
  draft.frontmatter.images[0].alt = "Amber operational field narrowing toward a dark shared boundary";
  draft.frontmatter.images[0].label = "Gray Zones · Handoff";
  draft.frontmatter.images[0].caption = "A confirmed handoff keeps a narrowing buffer from becoming background noise.";
  return studioWorkflow.applyEditorialChange(record, draft, "images", "2026-09-11T10:04:00.000Z");
}

class FakeGithub {
  constructor({ tree = [], failTree = false } = {}) {
    this.refs = new Map([["main", "main-sha"]]);
    this.tree = tree;
    this.failTree = failTree;
    this.events = [];
    this.pr = null;
    this.nextPr = 14;
  }

  async getRef(branch) { this.events.push(`getRef:${branch}`); return this.refs.get(branch) ?? null; }
  async createRef(branch, sha) { this.events.push(`createRef:${branch}`); this.refs.set(branch, sha); }
  async deleteRef(branch) { this.events.push(`deleteRef:${branch}`); this.refs.delete(branch); }
  async getCommit(sha) { this.events.push(`getCommit:${sha}`); return { treeSha: `tree-${sha}` }; }
  async listTree() { this.events.push("listTree"); return this.tree; }
  async createBlob() { this.events.push("createBlob"); return `blob-${this.events.length}`; }
  async createTree() { this.events.push("createTree"); if (this.failTree) throw new Error("simulated tree failure"); return `tree-${this.events.length}`; }
  async createCommit() { this.events.push("createCommit"); return `commit-${this.events.length}`; }
  async updateRef(branch, sha) { this.events.push(`updateRef:${branch}`); this.refs.set(branch, sha); }
  async createPullRequest(input) {
    this.events.push("createPullRequest");
    this.pr = { number: this.nextPr, htmlUrl: `https://example.invalid/pull/${this.nextPr}`, state: "open", merged: false, body: input.body, headRef: input.head, headSha: this.refs.get(input.head) };
    return this.pr;
  }
  async updatePullRequest(number, input) { this.events.push(`updatePullRequest:${number}`); this.pr = { ...this.pr, body: input.body, headSha: this.refs.get(this.pr.headRef) }; return this.pr; }
  async getPullRequest(number) { this.events.push(`getPullRequest:${number}`); assert.equal(number, this.pr.number); return this.pr; }
}

const config = {
  owner: "jlsanzbreton",
  repo: "risks-in-sync-website",
  baseBranch: "main",
  netlifySiteName: "risks-in-sync",
  websiteOrigin: "https://risksinsync.com",
};

const websiteSchema = readFileSync(join(WEBSITE_ROOT, "schemas/publication-pack-v1.schema.json"));
const studioSchema = readFileSync(join(STUDIO_ROOT, "schemas/vendor/publication-pack-v1.schema.json"));
assert.deepEqual(studioSchema, websiteSchema, "Publication Pack schemas differ byte-for-byte.");
const schemaSha256 = sha256(websiteSchema);
const websiteDefinition = readFileSync(join(WEBSITE_ROOT, "schemas/review-definition-v1.json"));
const studioDefinition = readFileSync(join(STUDIO_ROOT, "schemas/vendor/review-definition-v1.json"));
assert.deepEqual(studioDefinition, websiteDefinition, "Review Definition v1 differs byte-for-byte.");
const definitionSha256 = sha256(websiteDefinition);
const studioProvenance = readFileSync(join(STUDIO_ROOT, "docs/publication-pack-v1-vendor.md"), "utf8");
assertIncludes(studioProvenance, "Source path: schemas/review-definition-v1.json", "Review Definition provenance");
assertIncludes(studioProvenance, `SHA-256: ${definitionSha256}`, "Review Definition provenance");

let record = await studioPublication.importPublicationFiles(fixtureFiles());
assert.equal(record.validationResult.valid, true, JSON.stringify(record.validationResult.issues, null, 2));
approveAll(record, "2026-09-11T10:00:00.000Z");
assert.equal(studioTypes.isChecklistComplete(record.approvalChecklist), true);

record = editRecord(record);
for (const key of Object.keys(studioTypes.approvalLabels)) assert.equal(record.approvalChecklist[key].confirmed, false, `${key} remained approved after an affected edit.`);
assert.equal(record.validationResult.valid, true, JSON.stringify(record.validationResult.issues, null, 2));
approveAll(record, "2026-09-11T10:05:00.000Z");
assert.equal(studioTypes.isChecklistComplete(record.approvalChecklist), true);

const backup = await studioPublication.createPublicationBackup(record.editableDraft, "2026-09-11T10:06:00.000Z");
const extracted = unzipSync(new Uint8Array(backup.zipBytes));
assert.deepEqual(Object.keys(extracted).sort(), ["assets/hero.webp", "review.md"]);
assert.equal(strFromU8(extracted["review.md"]), backup.reviewMarkdown);

const tempRoot = mkdtempSync(join(tmpdir(), "ris-publication-flow-"));
const repoCopy = join(tempRoot, "risks-in-sync-website");
cpSync(WEBSITE_ROOT, repoCopy, {
  recursive: true,
  filter: (source) => ![".git", "node_modules", "dist"].includes(source.split("/").at(-1)),
});
symlinkSync(join(WEBSITE_ROOT, "node_modules"), join(repoCopy, "node_modules"), "dir");

// The fixture is now also a real published issue. Remove it only from the disposable
// baseline copy so this test continues to exercise a genuinely new publication.
rmSync(join(repoCopy, "src/content/reviews", SLUG), { recursive: true, force: true });
rmSync(join(repoCopy, "public/review", SLUG), { recursive: true, force: true });

const sourceSnapshots = ["src/main.tsx", "vite.config.ts", "index.html", "review/index.html"]
  .map((path) => [path, sha256(readFileSync(join(repoCopy, path)))]);
const transformed = transformExtractedPack(repoCopy, SLUG, extracted);

const commandResults = {};
for (const [name, args] of [
  ["check:reviews", ["run", "check:reviews"]],
  ["test", ["test"]],
  ["build", ["run", "build"]],
]) {
  commandResults[name] = execFileSync("npm", args, { cwd: repoCopy, encoding: "utf8", env: process.env });
}

for (const [path, digest] of sourceSnapshots) assert.equal(sha256(readFileSync(join(repoCopy, path))), digest, `${path} required a manual edit.`);
const builtIssue = join(repoCopy, "dist/review", SLUG, "index.html");
const firstIssue = join(repoCopy, "dist/review/year-1-nr-1/index.html");
assert.equal(existsSync(builtIssue), true);
assert.equal(existsSync(firstIssue), true);
const issueHtml = readFileSync(builtIssue, "utf8");
for (const [expected, label] of [
  [`<link rel="canonical" href="https://risksinsync.com/review/${SLUG}/"`, "canonical"],
  ["property=\"og:type\" content=\"article\"", "Open Graph type"],
  [`property="og:image" content="https://risksinsync.com/review/${SLUG}/assets/hero.webp"`, "Open Graph image"],
  ['property="og:image:width" content="1672"', "Open Graph image width"],
  ['property="og:image:height" content="941"', "Open Graph image height"],
  ["name=\"twitter:card\" content=\"summary_large_image\"", "Twitter card"],
  [`name="twitter:image" content="https://risksinsync.com/review/${SLUG}/assets/hero.webp"`, "Twitter image"],
  ["article:published_time\" content=\"2026-09-11", "publication date"],
  ["article:author\" content=\"Jose Luis Sanz Breton", "author"],
  [`private-feedback-${SLUG}`, "slug-specific feedback form"],
]) assertIncludes(issueHtml, expected, label);
const generatedManifest = readFileSync(join(repoCopy, "src/generated/reviews.ts"), "utf8");
assert.ok(generatedManifest.indexOf(SLUG) < generatedManifest.indexOf("year-1-nr-1"), "Nr. 2 is not the latest generated issue.");
assertIncludes(generatedManifest, '"role": "homepage"', "homepage image role");
assertIncludes(generatedManifest, "Gray Zones · Handoff", "homepage image label");
assertIncludes(generatedManifest, '"intrinsic_width": 1672', "generated image width");
assertIncludes(generatedManifest, '"intrinsic_height": 941', "generated image height");

async function studioValidity(markdown, includeAsset = true) {
  try {
    const candidate = await studioPublication.importPublicationFiles(fixtureFiles(markdown, includeAsset));
    return { accepted: candidate.validationResult.valid, issues: candidate.validationResult.issues.map((issue) => issue.code) };
  } catch (error) {
    return { accepted: false, issues: error.issues?.map((issue) => issue.code) ?? [error.message] };
  }
}

function websiteValidity(markdown, includeAsset = true) {
  const root = mkdtempSync(join(tmpdir(), "ris-publication-negative-"));
  try {
    mkdirSync(join(root, "schemas"), { recursive: true });
    writeFileSync(join(root, "schemas/publication-pack-v1.schema.json"), websiteSchema);
    const reviewPath = join(root, "src/content/reviews", SLUG, "review.md");
    mkdirSync(dirname(reviewPath), { recursive: true });
    writeFileSync(reviewPath, markdown);
    if (includeAsset) {
      const target = join(root, "public/review", SLUG, "assets/hero.webp");
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, extracted["assets/hero.webp"]);
    }
    try {
      const parsed = websiteReviews.parseReviewFile(reviewPath, root);
      const collection = websiteReviews.loadReviews(root);
      return { accepted: true, status: parsed.frontmatter.status, published: collection.published.length, drafts: collection.drafts.length, issues: [] };
    } catch (error) {
      return { accepted: false, issues: error.issues ?? [error.message] };
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

const finalMarkdown = backup.reviewMarkdown;
const inferredText = record.editableDraft.body.evidence.INFERRED;
const cases = [
  ["missing section", finalMarkdown.replace("## What worked", "## Work removed")],
  ["empty evidence state", finalMarkdown.replace(inferredText, "")],
  ["unverified source", finalMarkdown.replace("verification: verified", "verification: unverified")],
  ["path traversal", finalMarkdown.replace("path: assets/hero.webp", "path: assets/%2e%2e/hero.webp")],
  ["image without alt", finalMarkdown.replace(/alt: .*\n/, "alt: \"\"\n")],
  ["image without rights", finalMarkdown.replace(/rights_basis: .*\n/, "rights_basis: null\n")],
  ["unknown frontmatter field", finalMarkdown.replace("schema_version: 1\n", "schema_version: 1\nunexpected_field: blocked\n")],
];
const negativeResults = {};
for (const [name, markdown] of cases) {
  const studio = await studioValidity(markdown);
  const website = websiteValidity(markdown);
  assert.equal(studio.accepted, false, `Studio accepted negative fixture: ${name}.`);
  assert.equal(website.accepted, false, `Website accepted negative fixture: ${name}.`);
  negativeResults[name] = { studio: studio.issues, website: website.issues };
}
const missingAssetStudio = await studioValidity(finalMarkdown, false);
const missingAssetWebsite = websiteValidity(finalMarkdown, false);
assert.equal(missingAssetStudio.accepted, false);
assert.equal(missingAssetWebsite.accepted, false);
negativeResults["missing asset"] = { studio: missingAssetStudio.issues, website: missingAssetWebsite.issues };

const draftMarkdown = finalMarkdown.replace("status: ready_for_pr", "status: draft").replace("verification: verified", "verification: unverified");
const draftStudio = await studioValidity(draftMarkdown);
const draftWebsite = websiteValidity(draftMarkdown);
assert.equal(draftStudio.accepted, true, "Studio should validate a draft with warnings.");
assert.equal(draftWebsite.accepted, true, "Website should validate a draft.");
assert.deepEqual({ published: draftWebsite.published, drafts: draftWebsite.drafts }, { published: 0, drafts: 1 });
negativeResults["status draft"] = { studio: draftStudio.issues, website: ["accepted and excluded from publication"] };

const remoteInput = { recordId: record.id, slug: record.slug, backup, frontmatter: record.editableDraft.frontmatter };
const github = new FakeGithub();
const firstRemote = await studioGithub.writePublicationPr(github, config, remoteInput);
const secondRemote = await studioGithub.writePublicationPr(github, config, {
  ...remoteInput,
  existingBinding: { branch: firstRemote.branch, prNumber: firstRemote.prNumber },
});
assert.equal(secondRemote.prNumber, firstRemote.prNumber);
assert.equal(github.events.filter((event) => event === "createPullRequest").length, 1);
assert.equal(github.events.filter((event) => event === `updatePullRequest:${firstRemote.prNumber}`).length, 1);
assert.equal(github.events.some((event) => event === "updateRef:main" || /merge/i.test(event)), false);

const failedGithub = new FakeGithub({ failTree: true });
await assert.rejects(studioGithub.writePublicationPr(failedGithub, config, remoteInput), /simulated tree failure/);
assert.equal(failedGithub.refs.has(`studio/${SLUG}`), false, "Failed publication left a branch reference behind.");
assert.equal(failedGithub.pr, null);
assert.equal(failedGithub.events.some((event) => event === "updateRef:main" || /merge/i.test(event)), false);

const duplicateGithub = new FakeGithub({ tree: [{ path: `src/content/reviews/${SLUG}/review.md`, type: "blob" }] });
await assert.rejects(studioGithub.writePublicationPr(duplicateGithub, config, remoteInput), /Duplicate slug/);
assert.equal(duplicateGithub.refs.has(`studio/${SLUG}`), false);
assert.throws(() => transformExtractedPack(repoCopy, SLUG, extracted), /Duplicate slug/);
negativeResults["duplicate slug"] = { studio: ["rejected before branch creation"], website: ["target review path already exists"] };

const summary = {
  schema: { equalBytes: true, sha256: schemaSha256 },
  reviewDefinition: { equalBytes: true, sha256: definitionSha256, provenance: true },
  fixture: {
    slug: SLUG,
    imported: true,
    editedFields: ["title", "dek", "evidence.INFERRED", "cascade.outcome_status", "cascade.observed_outcome", "cascade.counterfactual_outcome", "sources[0].note", "images[0].alt", "images[0].label", "images[0].caption"],
    checklistInvalidated: true,
    reapproved: true,
    backupChecksum: backup.checksum,
    zipEntries: Object.keys(extracted).sort(),
  },
  website: {
    commands: Object.fromEntries(Object.entries(commandResults).map(([name, output]) => [name, output.trim().split("\n").slice(-8)])),
    builtIssue,
    firstIssue,
    latest: SLUG,
    transformedContent: transformed.contentTarget,
    sourceFilesUnchanged: sourceSnapshots.map(([path]) => path),
  },
  negatives: negativeResults,
  github: {
    branch: firstRemote.branch,
    prNumber: firstRemote.prNumber,
    createdOnce: true,
    updatedSamePr: true,
    failedBeforeRefCreationLeavesNoBranch: true,
    writesMainOrMerge: false,
  },
  temporaryWebsiteCopy: keepTemporaryCopy ? repoCopy : "removed after verification",
};

console.log(JSON.stringify(summary, null, 2));
if (!keepTemporaryCopy) rmSync(tempRoot, { recursive: true, force: true });
