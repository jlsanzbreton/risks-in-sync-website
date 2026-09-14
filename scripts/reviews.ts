import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, posix, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv, { type ErrorObject } from "ajv";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { parseDocument } from "yaml";
import type { ReviewFrontmatter, ReviewIssue } from "../src/content/review-types";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_REPO_ROOT = resolve(SCRIPT_DIR, "..");

const REQUIRED_TOKENS = [
  "## The event",
  "## The cascade",
  "<!-- CASCADE_DIAGRAM -->",
  "## What worked",
  "## What didn't — or we don't know",
  "## Gray Zones",
  "## Risks In Sync",
  "## What this case changes",
  "## Evidence status",
  "### REPORTED",
  "### OBSERVED",
  "### INFERRED",
  "### UNKNOWN",
  "<!-- PRIVATE_FEEDBACK -->",
  "## SOURCES",
] as const;

const SECTION_HEADINGS = REQUIRED_TOKENS.filter((token) => token.startsWith("## "));
const EVIDENCE_HEADINGS = REQUIRED_TOKENS.filter((token) => token.startsWith("### "));
const PLACEHOLDER_PATTERNS = [
  /\bTODO\b/i,
  /\bTBD\b/i,
  /lorem ipsum/i,
  /\bcoming soon\b/i,
  /\bplaceholder\b/i,
  /_?No [^\n]{0,80} yet_?/i,
];

export class ReviewValidationError extends Error {
  readonly issues: string[];

  constructor(file: string, issues: string[]) {
    const normalized = issues.map((issue) => `${file}: ${issue}`);
    super(normalized.join("\n"));
    this.name = "ReviewValidationError";
    this.issues = normalized;
  }
}

export interface ParsedReview {
  file: string;
  frontmatter: ReviewFrontmatter;
  body: string;
  review: ReviewIssue;
}

export interface LoadReviewsResult {
  published: ParsedReview[];
  drafts: ParsedReview[];
}

function schemaValidator(repoRoot: string) {
  const schemaPath = join(repoRoot, "schemas/publication-pack-v1.schema.json");
  const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
  return new Ajv({ allErrors: true, strict: true }).compile<ReviewFrontmatter>(schema);
}

function formatAjvError(error: ErrorObject): string {
  const path = error.instancePath || "frontmatter";
  if (error.keyword === "additionalProperties") {
    return `${path}: unknown field '${String(error.params.additionalProperty)}'`;
  }
  if (error.keyword === "required") {
    return `${path}: missing required field '${String(error.params.missingProperty)}'`;
  }
  return `${path}: ${error.message ?? "is invalid"}`;
}

function isRealDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatReviewPeriod(start: string, end: string): string {
  const first = new Date(`${start}T00:00:00Z`);
  const last = new Date(`${end}T00:00:00Z`);
  if (first.getUTCFullYear() === last.getUTCFullYear() && first.getUTCMonth() === last.getUTCMonth()) {
    const monthYear = new Intl.DateTimeFormat("en-GB", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(last);
    return `${first.getUTCDate()}–${last.getUTCDate()} ${monthYear}`;
  }
  if (first.getUTCFullYear() === last.getUTCFullYear()) {
    const firstPart = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", timeZone: "UTC" }).format(first);
    return `${firstPart}–${formatDate(end)}`;
  }
  return `${formatDate(start)}–${formatDate(end)}`;
}

function countLine(body: string, token: string): number {
  return body.split(/\r?\n/).filter((line) => line.trim() === token).length;
}

function tokenIndex(body: string, token: string): number {
  const linePattern = new RegExp(`^${escapeRegExp(token)}\\s*$`, "m");
  return body.search(linePattern);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function substantiveText(markdown: string): string {
  return markdown
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/^#{1,6}\s+.*$/gm, " ")
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/```[^\n]*|```/g, " "))
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>#|\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function validateStructure(body: string, issues: string[]): { cascade: number; feedback: number; sources: number } {
  for (const token of REQUIRED_TOKENS) {
    const count = countLine(body, token);
    if (count === 0) issues.push(`section/marker '${token}' is missing`);
    if (count > 1) issues.push(`section/marker '${token}' appears ${count} times; expected once`);
  }

  const positions = REQUIRED_TOKENS.map((token) => tokenIndex(body, token));
  if (positions.every((position) => position >= 0)) {
    for (let index = 1; index < positions.length; index += 1) {
      if (positions[index] <= positions[index - 1]) {
        issues.push(`section/marker '${REQUIRED_TOKENS[index]}' is out of order`);
      }
    }
  }

  const h2Matches = [...body.matchAll(/^##\s+(.+)\s*$/gm)];
  for (const heading of SECTION_HEADINGS) {
    if (countLine(body, heading) !== 1) continue;
    const match = h2Matches.find((candidate) => candidate[0].trim() === heading);
    if (match?.index === undefined) continue;
    if (heading === "## SOURCES" || heading === "## Evidence status") continue;
    const next = h2Matches.find((candidate) => (candidate.index ?? 0) > (match.index ?? 0));
    const sectionBody = body.slice((match.index ?? 0) + match[0].length, next?.index ?? body.length);
    if (!substantiveText(sectionBody)) issues.push(`section '${heading}' is empty`);
  }

  const h3Matches = [...body.matchAll(/^###\s+(.+)\s*$/gm)];
  for (const heading of EVIDENCE_HEADINGS) {
    if (countLine(body, heading) !== 1) continue;
    const match = h3Matches.find((candidate) => candidate[0].trim() === heading);
    if (match?.index === undefined) continue;
    const nextH3 = h3Matches.find((candidate) => (candidate.index ?? 0) > (match.index ?? 0));
    const feedback = tokenIndex(body, "<!-- PRIVATE_FEEDBACK -->");
    const end = Math.min(nextH3?.index ?? body.length, feedback >= 0 && feedback > (match.index ?? 0) ? feedback : body.length);
    const sectionBody = body.slice((match.index ?? 0) + match[0].length, end);
    if (!substantiveText(sectionBody)) issues.push(`evidence subsection '${heading}' is empty`);
  }

  const sources = tokenIndex(body, "## SOURCES");
  if (sources >= 0) {
    const sourceBody = body.slice(sources + "## SOURCES".length);
    if (substantiveText(sourceBody)) issues.push("section '## SOURCES' must not duplicate frontmatter.sources");
  }

  for (const pattern of PLACEHOLDER_PATTERNS) {
    const match = body.match(pattern);
    if (match) issues.push(`editorial placeholder '${match[0]}' is not allowed`);
  }

  return {
    cascade: tokenIndex(body, "<!-- CASCADE_DIAGRAM -->"),
    feedback: tokenIndex(body, "<!-- PRIVATE_FEEDBACK -->"),
    sources,
  };
}

function validateHttps(value: string, field: string, issues: string[]): void {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !url.hostname) issues.push(`${field} must be an absolute HTTPS URL`);
  } catch {
    issues.push(`${field} must be a syntactically valid absolute HTTPS URL`);
  }
}

function requireText(value: string, field: string, issues: string[]): void {
  if (!value.trim()) issues.push(`${field} must contain non-whitespace text`);
}

function validateAssetPath(assetPath: string, field: string, issues: string[]): string | null {
  if (assetPath.startsWith("/") || assetPath.includes("\\")) {
    issues.push(`${field} must be a relative path under assets/`);
    return null;
  }

  let decoded = assetPath;
  try {
    for (let depth = 0; depth < 4; depth += 1) {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    }
  } catch {
    issues.push(`${field} contains invalid percent encoding`);
    return null;
  }

  if (decoded !== assetPath && (decoded.split("/").includes("..") || decoded.startsWith("/") || decoded.includes("\\"))) {
    issues.push(`${field} contains encoded path traversal`);
    return null;
  }
  const segments = decoded.split("/");
  if (segments[0] !== "assets" || segments.length < 2 || segments.some((segment) => !segment || segment === "." || segment === "..")) {
    issues.push(`${field} must be a safe relative path under assets/`);
    return null;
  }
  if (posix.normalize(decoded) !== decoded) {
    issues.push(`${field} is not a normalized safe asset path`);
    return null;
  }
  return decoded;
}

function markdownImagePaths(body: string): string[] {
  return [...body.matchAll(/!\[[^\]]*\]\(\s*<?([^\s)>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g)].map((match) => match[1]);
}

function assetFiles(directory: string, prefix = "assets"): string[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const diskPath = join(directory, entry.name);
    const assetPath = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) return assetFiles(diskPath, assetPath);
    return entry.isFile() ? [assetPath] : [];
  });
}

function replaceMarkdownAssetPaths(body: string, slug: string): string {
  return body.replace(
    /(!\[[^\]]*\]\(\s*<?)(assets\/[^\s)>]+)(>?)(?=(?:\s+["'][^"']*["'])?\s*\))/g,
    `$1/review/${slug}/$2$3`,
  );
}

function renderSafeMarkdown(markdown: string, slug: string): string {
  const html = marked.parse(replaceMarkdownAssetPaths(markdown, slug), { async: false }) as string;
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "h2", "h3", "h4", "strong", "em", "a", "ul", "ol", "li", "blockquote", "code", "pre", "hr", "img", "figure", "figcaption", "br",
    ],
    allowedAttributes: {
      a: ["href", "title", "rel"],
      img: ["src", "alt", "title"],
      code: ["class"],
    },
    allowedSchemes: ["https"],
    allowedSchemesByTag: { img: ["https"] },
    allowProtocolRelative: false,
    transformTags: {
      a: (_tagName, attribs) => ({ tagName: "a", attribs: { ...attribs, rel: "noopener noreferrer" } }),
    },
  })
    .replace(/<h3>(REPORTED|OBSERVED|INFERRED|UNKNOWN)<\/h3>/g, '<h3 class="evidence-heading">$1</h3>');
}

export function parseReviewFile(file: string, repoRoot = DEFAULT_REPO_ROOT): ParsedReview {
  const displayFile = relative(repoRoot, file) || file;
  const issues: string[] = [];
  const input = readFileSync(file, "utf8");
  const frontmatterMatch = input.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!frontmatterMatch) throw new ReviewValidationError(displayFile, ["missing or malformed YAML frontmatter delimiters"]);

  const document = parseDocument(frontmatterMatch[1], { uniqueKeys: true });
  if (document.errors.length) {
    throw new ReviewValidationError(displayFile, document.errors.map((error) => `frontmatter: ${error.message}`));
  }
  const value = document.toJS();
  const validate = schemaValidator(repoRoot);
  if (!validate(value)) issues.push(...(validate.errors ?? []).map(formatAjvError));
  if (issues.length) throw new ReviewValidationError(displayFile, issues);

  const frontmatter = value as ReviewFrontmatter;
  const body = frontmatterMatch[2].trimEnd() + "\n";
  const inspectEditorialStrings = (candidate: unknown, field: string): void => {
    if (typeof candidate === "string") {
      for (const pattern of PLACEHOLDER_PATTERNS) {
        const match = candidate.match(pattern);
        if (match) issues.push(`${field}: editorial placeholder '${match[0]}' is not allowed`);
      }
      return;
    }
    if (Array.isArray(candidate)) candidate.forEach((item, index) => inspectEditorialStrings(item, `${field}[${index}]`));
    else if (candidate && typeof candidate === "object") {
      Object.entries(candidate).forEach(([key, item]) => inspectEditorialStrings(item, `${field}.${key}`));
    }
  };
  inspectEditorialStrings(frontmatter, "frontmatter");
  requireText(frontmatter.id, "id", issues);
  requireText(frontmatter.issue.label, "issue.label", issues);
  requireText(frontmatter.title, "title", issues);
  requireText(frontmatter.dek, "dek", issues);
  requireText(frontmatter.summary, "summary", issues);
  requireText(frontmatter.author, "author", issues);
  requireText(frontmatter.method_version, "method_version", issues);
  if (frontmatter.editorial !== null) requireText(frontmatter.editorial, "editorial", issues);
  requireText(frontmatter.cascade.title, "cascade.title", issues);
  requireText(frontmatter.cascade.subtitle, "cascade.subtitle", issues);
  requireText(frontmatter.cascade.observed_outcome, "cascade.observed_outcome", issues);
  if (frontmatter.cascade.counterfactual_outcome !== null) requireText(frontmatter.cascade.counterfactual_outcome, "cascade.counterfactual_outcome", issues);
  requireText(frontmatter.cascade.note, "cascade.note", issues);
  frontmatter.cascade.steps.forEach((step, index) => requireText(step, `cascade.steps[${index}]`, issues));
  const directorySlug = basename(dirname(file));
  if (directorySlug !== frontmatter.slug) issues.push(`slug '${frontmatter.slug}' does not match directory '${directorySlug}'`);
  const slugMatch = frontmatter.slug.match(/^year-([1-9]\d*)-nr-([1-9]\d*)$/);
  if (slugMatch && (Number(slugMatch[1]) !== frontmatter.issue.year || Number(slugMatch[2]) !== frontmatter.issue.number)) {
    issues.push(`issue.year/issue.number do not agree with slug '${frontmatter.slug}'`);
  }

  for (const [field, date] of [
    ["review_period.start", frontmatter.review_period.start],
    ["review_period.end", frontmatter.review_period.end],
    ["publication_date", frontmatter.publication_date],
  ] as const) {
    if (!isRealDate(date)) issues.push(`${field} is not a real YYYY-MM-DD calendar date`);
  }
  if (isRealDate(frontmatter.review_period.start) && isRealDate(frontmatter.review_period.end) && frontmatter.review_period.start > frontmatter.review_period.end) {
    issues.push("review_period.start must not be after review_period.end");
  }

  const sourceIds = new Set<string>();
  frontmatter.sources.forEach((source, index) => {
    const field = `sources[${index}]`;
    requireText(source.id, `${field}.id`, issues);
    requireText(source.title, `${field}.title`, issues);
    requireText(source.publisher, `${field}.publisher`, issues);
    requireText(source.note, `${field}.note`, issues);
    if (sourceIds.has(source.id)) issues.push(`${field}.id '${source.id}' is duplicated`);
    sourceIds.add(source.id);
    validateHttps(source.url, `${field}.url`, issues);
    if (!isRealDate(source.published_date)) issues.push(`${field}.published_date is not a real YYYY-MM-DD calendar date`);
    if (!isRealDate(source.accessed_date)) issues.push(`${field}.accessed_date is not a real YYYY-MM-DD calendar date`);
    if (frontmatter.status === "ready_for_pr" && source.verification !== "verified") issues.push(`${field}.verification must be 'verified' for ready_for_pr`);
  });

  const imageIds = new Set<string>();
  const imagePaths = new Set<string>();
  const imageFilenames = new Set<string>();
  const canonicalImagePaths = new Map<string, string>();
  const roles = new Map<string, number>();
  frontmatter.images.forEach((image, index) => {
    const field = `images[${index}]`;
    requireText(image.id, `${field}.id`, issues);
    if (imageIds.has(image.id)) issues.push(`${field}.id '${image.id}' is duplicated`);
    imageIds.add(image.id);
    const safePath = validateAssetPath(image.path, `${field}.path`, issues);
    if (safePath) {
      canonicalImagePaths.set(image.path, safePath);
      const filename = posix.basename(safePath).toLowerCase();
      if (imagePaths.has(safePath)) issues.push(`${field}.path '${safePath}' is declared more than once`);
      if (imageFilenames.has(filename)) issues.push(`${field}.path duplicates filename '${filename}'`);
      imagePaths.add(safePath);
      imageFilenames.add(filename);
      const diskPath = join(repoRoot, "public", "review", frontmatter.slug, ...safePath.split("/"));
      if (!existsSync(diskPath) || !statSync(diskPath).isFile()) issues.push(`${field}.path '${safePath}' does not exist at ${relative(repoRoot, diskPath)}`);
    }
    if (!image.decorative && !image.alt.trim()) issues.push(`${field}.alt is required for non-decorative images`);
    roles.set(image.role, (roles.get(image.role) ?? 0) + 1);
    if ((image.role === "homepage" || image.role === "hero" || image.role === "social") && (roles.get(image.role) ?? 0) > 1) issues.push(`only one '${image.role}' image may be declared`);
    if (image.role === "homepage") {
      if (!image.label?.trim()) issues.push(`${field}.label is required for a homepage image`);
      else if (image.label.length > 48) issues.push(`${field}.label must be 48 characters or fewer`);
      if (!image.caption?.trim()) issues.push(`${field}.caption is required for a homepage image`);
      else {
        if (image.caption.length > 140) issues.push(`${field}.caption must be 140 characters or fewer`);
        if (image.caption.split(/\r?\n/).length > 2) issues.push(`${field}.caption must use at most two lines`);
      }
    }
    if (frontmatter.status === "ready_for_pr") {
      if (!image.credit?.trim()) issues.push(`${field}.credit is required for ready_for_pr`);
      if (!image.source_url?.trim()) issues.push(`${field}.source_url is required for ready_for_pr`);
      else validateHttps(image.source_url, `${field}.source_url`, issues);
      if (!image.rights_basis?.trim()) issues.push(`${field}.rights_basis is required for ready_for_pr`);
      if (image.verification !== "cleared") issues.push(`${field}.verification must be 'cleared' for ready_for_pr`);
    }
  });

  const assetsDirectory = join(repoRoot, "public", "review", frontmatter.slug, "assets");
  for (const assetPath of assetFiles(assetsDirectory)) {
    if (!imagePaths.has(assetPath)) issues.push(`asset file '${assetPath}' is not declared in frontmatter.images`);
  }

  const referencedImages = markdownImagePaths(body);
  const referenceCounts = new Map<string, number>();
  referencedImages.forEach((assetPath, index) => {
    const safePath = validateAssetPath(assetPath, `Markdown image ${index + 1}`, issues);
    if (!safePath) return;
    referenceCounts.set(safePath, (referenceCounts.get(safePath) ?? 0) + 1);
    if (!imagePaths.has(safePath)) issues.push(`Markdown image '${safePath}' is not declared in frontmatter.images`);
  });
  for (const image of frontmatter.images) {
    const canonicalPath = canonicalImagePaths.get(image.path) ?? image.path;
    if (image.role === "inline" && !referenceCounts.has(canonicalPath)) issues.push(`inline image '${image.path}' is declared but not used in Markdown`);
    if ((referenceCounts.get(canonicalPath) ?? 0) > 1) issues.push(`Markdown image '${image.path}' is used more than once`);
  }

  const markers = validateStructure(body, issues);
  if (issues.length) throw new ReviewValidationError(displayFile, issues);

  const cascadeEnd = markers.cascade + "<!-- CASCADE_DIAGRAM -->".length;
  const feedbackEnd = markers.feedback + "<!-- PRIVATE_FEEDBACK -->".length;
  const review: ReviewIssue = {
    ...frontmatter,
    path: `/review/${frontmatter.slug}/`,
    reviewPeriodLabel: formatReviewPeriod(frontmatter.review_period.start, frontmatter.review_period.end),
    publicationDateLabel: formatDate(frontmatter.publication_date),
    html: {
      beforeCascade: renderSafeMarkdown(body.slice(0, markers.cascade), frontmatter.slug),
      afterCascade: renderSafeMarkdown(body.slice(cascadeEnd, markers.feedback), frontmatter.slug),
      afterFeedback: renderSafeMarkdown(body.slice(feedbackEnd, markers.sources), frontmatter.slug),
    },
  };
  return { file, frontmatter, body, review };
}

export function discoverReviewFiles(repoRoot = DEFAULT_REPO_ROOT): string[] {
  const contentRoot = join(repoRoot, "src", "content", "reviews");
  if (!existsSync(contentRoot)) return [];
  return readdirSync(contentRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => join(contentRoot, entry.name, "review.md"))
    .filter(existsSync)
    .sort();
}

export function sortReviews<T extends { frontmatter: ReviewFrontmatter }>(reviews: T[]): T[] {
  return [...reviews].sort((a, b) =>
    b.frontmatter.publication_date.localeCompare(a.frontmatter.publication_date)
      || b.frontmatter.issue.year - a.frontmatter.issue.year
      || b.frontmatter.issue.number - a.frontmatter.issue.number
      || a.frontmatter.slug.localeCompare(b.frontmatter.slug),
  );
}

export function loadReviews(repoRoot = DEFAULT_REPO_ROOT): LoadReviewsResult {
  const parsed = discoverReviewFiles(repoRoot).map((file) => parseReviewFile(file, repoRoot));
  const issues: string[] = [];
  const ids = new Map<string, string>();
  const slugs = new Map<string, string>();
  for (const review of parsed) {
    const displayFile = relative(repoRoot, review.file);
    const duplicateId = ids.get(review.frontmatter.id);
    if (duplicateId) issues.push(`${displayFile}: id '${review.frontmatter.id}' duplicates ${duplicateId}`);
    else ids.set(review.frontmatter.id, displayFile);
    const duplicateSlug = slugs.get(review.frontmatter.slug);
    if (duplicateSlug) issues.push(`${displayFile}: slug '${review.frontmatter.slug}' duplicates ${duplicateSlug}`);
    else slugs.set(review.frontmatter.slug, displayFile);
  }
  if (issues.length) throw new ReviewValidationError("review collection", issues);

  return {
    published: sortReviews(parsed.filter((review) => review.frontmatter.status === "ready_for_pr")),
    drafts: sortReviews(parsed.filter((review) => review.frontmatter.status === "draft")),
  };
}
