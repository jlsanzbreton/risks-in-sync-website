import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_WEBSITE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_STUDIO_ROOT = resolve(DEFAULT_WEBSITE_ROOT, "../risks-in-sync-studio");

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function readRequired(path, label) {
  assert.ok(existsSync(path), `${label} does not exist: ${path}`);
  return readFileSync(path);
}

function parseJson(bytes, label) {
  try {
    return JSON.parse(bytes.toString("utf8"));
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function validateReviewDefinition(definition, schemaFilename, schemaVersion) {
  assert.equal(definition?.definition_id, "cascade-risk-review", "Review Definition has an unexpected definition_id");
  assert.equal(definition?.definition_version, 1, "Review Definition has an unexpected definition_version");
  assert.equal(
    definition?.publication_pack_schema_version,
    schemaVersion,
    "Review Definition and Publication Pack schema versions differ",
  );
  assert.equal(definition?.frontmatter_schema, schemaFilename, "Review Definition references an unexpected frontmatter schema");
  assert.deepEqual(
    definition?.body?.introduction,
    { id: "introduction", required: false, content: "markdown" },
    "Review Definition introduction is invalid",
  );
  assert.ok(Array.isArray(definition?.body?.sequence) && definition.body.sequence.length > 0, "Review Definition body sequence is empty");

  const ids = [definition.body.introduction.id];
  const tokens = [];
  for (const block of definition.body.sequence) {
    assert.equal(typeof block?.id, "string", "Review Definition block is missing an id");
    assert.equal(block.required, true, `Review Definition block '${block.id}' must be required in v1`);
    ids.push(block.id);

    if (block.kind === "section") {
      assert.match(block.heading, /^##\s+\S/, `Section '${block.id}' has an invalid heading`);
      assert.equal(block.content, "substantive_markdown", `Section '${block.id}' has invalid content semantics`);
      tokens.push(block.heading);
      for (const slot of block.slots ?? []) {
        assert.equal(typeof slot.id, "string", `Section '${block.id}' has a slot without an id`);
        assert.match(slot.marker, /^<!--[\s\S]+-->$/, `Slot '${slot.id}' has an invalid marker`);
        assert.equal(slot.required, true, `Slot '${slot.id}' must be required in v1`);
        ids.push(slot.id);
        tokens.push(slot.marker);
      }
    } else if (block.kind === "section_group") {
      assert.match(block.heading, /^##\s+\S/, `Section group '${block.id}' has an invalid heading`);
      assert.equal(block.content, "container", `Section group '${block.id}' has invalid content semantics`);
      assert.ok(Array.isArray(block.sections) && block.sections.length > 0, `Section group '${block.id}' is empty`);
      tokens.push(block.heading);
      for (const section of block.sections) {
        assert.equal(typeof section.id, "string", `Section group '${block.id}' contains a section without an id`);
        assert.match(section.heading, /^###\s+\S/, `Section '${section.id}' has an invalid heading`);
        assert.equal(section.required, true, `Section '${section.id}' must be required in v1`);
        assert.equal(section.content, "substantive_markdown", `Section '${section.id}' has invalid content semantics`);
        ids.push(section.id);
        tokens.push(section.heading);
      }
    } else if (block.kind === "slot") {
      assert.match(block.marker, /^<!--[\s\S]+-->$/, `Slot '${block.id}' has an invalid marker`);
      tokens.push(block.marker);
    } else if (block.kind === "generated_section") {
      assert.match(block.heading, /^##\s+\S/, `Generated section '${block.id}' has an invalid heading`);
      assert.equal(block.content, "generated", `Generated section '${block.id}' has invalid content semantics`);
      assert.equal(block.source_path, "frontmatter.sources", `Generated section '${block.id}' has an unexpected source path`);
      assert.equal(block.source_body, "empty", `Generated section '${block.id}' has an unexpected source body`);
      tokens.push(block.heading);
    } else {
      assert.fail(`Review Definition block '${block.id}' has an unsupported kind`);
    }
  }

  assert.equal(new Set(ids).size, ids.length, "Review Definition IDs are not unique");
  assert.equal(new Set(tokens).size, tokens.length, "Review Definition headings and markers are not unique");
}

export function verifyScoutContracts({ websiteRoot = DEFAULT_WEBSITE_ROOT, studioRoot = DEFAULT_STUDIO_ROOT } = {}) {
  const schemaFilename = "publication-pack-v1.schema.json";
  const definitionFilename = "review-definition-v1.json";
  const websiteSchemaPath = join(websiteRoot, "schemas", schemaFilename);
  const websiteDefinitionPath = join(websiteRoot, "schemas", definitionFilename);
  const studioSchemaPath = join(studioRoot, "schemas/vendor", schemaFilename);
  const studioDefinitionPath = join(studioRoot, "schemas/vendor", definitionFilename);

  const websiteSchemaBytes = readRequired(websiteSchemaPath, "Website Publication Pack v1 schema");
  const websiteDefinitionBytes = readRequired(websiteDefinitionPath, "Website Review Definition v1");
  const studioSchemaBytes = readRequired(studioSchemaPath, "Studio vendored Publication Pack v1 schema");
  const studioDefinitionBytes = readRequired(studioDefinitionPath, "Studio vendored Review Definition v1");

  const schema = parseJson(websiteSchemaBytes, "Website Publication Pack v1 schema");
  const definition = parseJson(websiteDefinitionBytes, "Website Review Definition v1");
  const schemaVersion = schema?.properties?.schema_version?.const;
  assert.equal(schemaVersion, 1, "Website Publication Pack schema does not declare schema_version 1");
  validateReviewDefinition(definition, schemaFilename, schemaVersion);

  assert.deepEqual(studioSchemaBytes, websiteSchemaBytes, "Studio Publication Pack schema differs byte-for-byte from Website");
  assert.deepEqual(studioDefinitionBytes, websiteDefinitionBytes, "Studio Review Definition differs byte-for-byte from Website");

  const schemaSha256 = sha256(websiteSchemaBytes);
  const definitionSha256 = sha256(websiteDefinitionBytes);
  const provenancePath = join(studioRoot, "docs/publication-pack-v1-vendor.md");
  const provenance = readRequired(provenancePath, "Studio contract provenance").toString("utf8");
  assert.ok(provenance.includes(`SHA-256: ${definitionSha256}`), "Studio provenance does not contain the canonical Review Definition checksum");

  return {
    ok: true,
    websiteRoot,
    studioRoot,
    schema: { path: websiteSchemaPath, sha256: schemaSha256, studioByteIdentical: true },
    reviewDefinition: {
      path: websiteDefinitionPath,
      definitionId: definition.definition_id,
      definitionVersion: definition.definition_version,
      sha256: definitionSha256,
      studioByteIdentical: true,
      provenanceMatches: true,
    },
  };
}

function cliArgument(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = verifyScoutContracts({
      websiteRoot: resolve(cliArgument("--website-root") ?? DEFAULT_WEBSITE_ROOT),
      studioRoot: resolve(cliArgument("--studio-root") ?? DEFAULT_STUDIO_ROOT),
    });
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`SCOUT BLOCKED: contract preflight failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}
