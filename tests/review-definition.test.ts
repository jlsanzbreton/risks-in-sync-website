import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { DEFAULT_REPO_ROOT, loadReviews } from "../scripts/reviews";

interface DefinitionSlot {
  id: string;
  marker: string;
  required: true;
  position?: "before_content";
}

interface DefinitionSection {
  kind: "section";
  id: string;
  heading: string;
  required: true;
  content: "substantive_markdown";
  slots?: DefinitionSlot[];
}

interface DefinitionSectionGroup {
  kind: "section_group";
  id: string;
  heading: string;
  required: true;
  content: "container";
  sections: Array<Omit<DefinitionSection, "kind" | "slots">>;
}

interface DefinitionGeneratedSection {
  kind: "generated_section";
  id: string;
  heading: string;
  required: true;
  content: "generated";
  source_path: "frontmatter.sources";
  source_body: "empty";
}

interface DefinitionStandaloneSlot extends Omit<DefinitionSlot, "position"> {
  kind: "slot";
}

type DefinitionBlock = DefinitionSection | DefinitionSectionGroup | DefinitionGeneratedSection | DefinitionStandaloneSlot;

interface ReviewDefinition {
  definition_id: "cascade-risk-review";
  definition_version: 1;
  publication_pack_schema_version: 1;
  frontmatter_schema: string;
  body: {
    introduction: { id: "introduction"; required: false; content: "markdown" };
    sequence: DefinitionBlock[];
  };
}

const definitionPath = join(DEFAULT_REPO_ROOT, "schemas/review-definition-v1.json");
const definition = JSON.parse(readFileSync(definitionPath, "utf8")) as ReviewDefinition;

function flattenTokens(reviewDefinition: ReviewDefinition): string[] {
  return reviewDefinition.body.sequence.flatMap((block) => {
    if (block.kind === "slot") return [block.marker];
    if (block.kind === "section_group") return [block.heading, ...block.sections.map((section) => section.heading)];
    if (block.kind === "section") return [block.heading, ...(block.slots ?? []).map((slot) => slot.marker)];
    return [block.heading];
  });
}

function currentValidatorTokens(): string[] {
  const source = readFileSync(join(DEFAULT_REPO_ROOT, "scripts/reviews.ts"), "utf8");
  const match = source.match(/const REQUIRED_TOKENS = \[([\s\S]*?)\] as const;/);
  assert.ok(match, "Website validator must continue to declare REQUIRED_TOKENS");
  return [...match[1].matchAll(/^\s*("(?:\\.|[^"])*"),?\s*$/gm)].map((item) => JSON.parse(item[1]) as string);
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

function validateBodyAgainstDefinition(body: string, reviewDefinition: ReviewDefinition): void {
  const lines = body.split(/\r?\n/);
  const tokens = flattenTokens(reviewDefinition);
  const indexes = tokens.map((token) => {
    const matches = lines.flatMap((line, index) => line.trim() === token ? [index] : []);
    assert.equal(matches.length, 1, `${token} must occur exactly once`);
    return matches[0];
  });

  indexes.forEach((index, tokenIndex) => {
    if (tokenIndex > 0) assert.ok(index > indexes[tokenIndex - 1], `${tokens[tokenIndex]} must remain in definition order`);
  });

  const tokenIndex = new Map(tokens.map((token, index) => [token, indexes[index]]));
  const nextTokenLine = (token: string): number => {
    const index = tokens.indexOf(token);
    return index === tokens.length - 1 ? lines.length : indexes[index + 1];
  };
  const assertSubstantive = (id: string, startToken: string, endLine = nextTokenLine(startToken)): void => {
    const startLine = tokenIndex.get(startToken);
    assert.notEqual(startLine, undefined);
    assert.ok(substantiveText(lines.slice(startLine! + 1, endLine).join("\n")), `${id} must contain substantive Markdown`);
  };

  for (const block of reviewDefinition.body.sequence) {
    if (block.kind === "section") {
      const leadingSlot = block.slots?.find((slot) => slot.position === "before_content");
      assertSubstantive(block.id, leadingSlot?.marker ?? block.heading);
    } else if (block.kind === "section_group") {
      for (const section of block.sections) assertSubstantive(section.id, section.heading);
    } else if (block.kind === "generated_section" && block.source_body === "empty") {
      const startLine = tokenIndex.get(block.heading);
      assert.notEqual(startLine, undefined);
      assert.equal(substantiveText(lines.slice(startLine! + 1).join("\n")), "", `${block.id} source body must remain empty`);
    }
  }
}

test("Review Definition v1 faithfully describes the current Website contract", () => {
  assert.deepEqual(Object.keys(definition), [
    "definition_id",
    "definition_version",
    "publication_pack_schema_version",
    "frontmatter_schema",
    "body",
  ]);
  assert.equal(definition.definition_id, "cascade-risk-review");
  assert.equal(definition.definition_version, 1);
  assert.equal(definition.publication_pack_schema_version, 1);
  assert.deepEqual(definition.body.introduction, { id: "introduction", required: false, content: "markdown" });

  const schemaPath = join(DEFAULT_REPO_ROOT, "schemas", definition.frontmatter_schema);
  assert.ok(existsSync(schemaPath), `Referenced frontmatter schema must exist: ${definition.frontmatter_schema}`);
  const schema = JSON.parse(readFileSync(schemaPath, "utf8")) as { properties?: { schema_version?: { const?: number } } };
  assert.equal(schema.properties?.schema_version?.const, definition.publication_pack_schema_version);

  const ids = [
    definition.body.introduction.id,
    ...definition.body.sequence.flatMap((block) => {
      if (block.kind === "section_group") return [block.id, ...block.sections.map((section) => section.id)];
      if (block.kind === "section") return [block.id, ...(block.slots ?? []).map((slot) => slot.id)];
      return [block.id];
    }),
  ];
  assert.equal(new Set(ids).size, ids.length, "Definition IDs must be unique");

  const definitionTokens = flattenTokens(definition);
  assert.equal(new Set(definitionTokens).size, definitionTokens.length, "Definition headings and markers must be unique");
  assert.deepEqual(definitionTokens, currentValidatorTokens());
});

test("all published schema_version 1 Reviews conform to Review Definition v1", () => {
  const { published } = loadReviews(DEFAULT_REPO_ROOT);
  assert.ok(published.length > 0, "At least one published Review is required for compatibility coverage");
  for (const review of published) {
    assert.equal(review.frontmatter.schema_version, definition.publication_pack_schema_version, review.frontmatter.slug);
    validateBodyAgainstDefinition(review.body, definition);
  }
});
