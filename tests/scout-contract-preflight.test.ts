import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { DEFAULT_REPO_ROOT } from "../scripts/reviews";
import { verifyScoutContracts } from "../scripts/preflight-scout-contracts.mjs";

const STUDIO_ROOT = join(DEFAULT_REPO_ROOT, "../risks-in-sync-studio");

function copyContracts() {
  const root = mkdtempSync(join(tmpdir(), "ris-scout-contract-preflight-"));
  const websiteRoot = join(root, "website");
  const studioRoot = join(root, "studio");
  cpSync(join(DEFAULT_REPO_ROOT, "schemas"), join(websiteRoot, "schemas"), { recursive: true });
  cpSync(join(STUDIO_ROOT, "schemas/vendor"), join(studioRoot, "schemas/vendor"), { recursive: true });
  cpSync(
    join(STUDIO_ROOT, "docs/publication-pack-v1-vendor.md"),
    join(studioRoot, "docs/publication-pack-v1-vendor.md"),
    { recursive: true },
  );
  return { websiteRoot, studioRoot };
}

test("Scout contract preflight accepts the current Website and Studio contracts", () => {
  const result = verifyScoutContracts({ websiteRoot: DEFAULT_REPO_ROOT, studioRoot: STUDIO_ROOT });
  assert.equal(result.ok, true);
  assert.equal(result.reviewDefinition.definitionId, "cascade-risk-review");
  assert.equal(result.reviewDefinition.definitionVersion, 1);
  assert.equal(result.schema.studioByteIdentical, true);
  assert.equal(result.reviewDefinition.studioByteIdentical, true);
  assert.equal(result.reviewDefinition.provenanceMatches, true);
});

test("Scout contract preflight fails on invalid canonical Review Definition JSON", () => {
  const roots = copyContracts();
  writeFileSync(join(roots.websiteRoot, "schemas/review-definition-v1.json"), "{ invalid json\n");
  assert.throws(() => verifyScoutContracts(roots), /Review Definition v1 is not valid JSON/);
});

test("Scout contract preflight fails when the canonical Publication Pack schema is missing", () => {
  const roots = copyContracts();
  rmSync(join(roots.websiteRoot, "schemas/publication-pack-v1.schema.json"));
  assert.throws(() => verifyScoutContracts(roots), /Website Publication Pack v1 schema does not exist/);
});

test("Scout contract preflight fails on Studio Publication Pack schema drift", () => {
  const roots = copyContracts();
  const studioSchemaPath = join(roots.studioRoot, "schemas/vendor/publication-pack-v1.schema.json");
  writeFileSync(studioSchemaPath, `${readFileSync(studioSchemaPath, "utf8")}\n`);
  assert.throws(() => verifyScoutContracts(roots), /Studio Publication Pack schema differs byte-for-byte from Website/);
});

test("Scout contract preflight fails on Studio contract drift", () => {
  const roots = copyContracts();
  const studioDefinitionPath = join(roots.studioRoot, "schemas/vendor/review-definition-v1.json");
  const definition = readFileSync(studioDefinitionPath, "utf8").replace('"definition_version": 1', '"definition_version": 2');
  writeFileSync(studioDefinitionPath, definition);
  assert.throws(() => verifyScoutContracts(roots), /Studio Review Definition differs byte-for-byte from Website/);
});

test("Scout contract preflight fails when Studio provenance has the wrong Review Definition checksum", () => {
  const roots = copyContracts();
  const provenancePath = join(roots.studioRoot, "docs/publication-pack-v1-vendor.md");
  writeFileSync(provenancePath, readFileSync(provenancePath, "utf8").replace(/SHA-256: 2000b9[a-f0-9]+/, "SHA-256: invalid"));
  assert.throws(() => verifyScoutContracts(roots), /provenance does not contain the canonical Review Definition checksum/);
});

test("Scout contract preflight CLI emits SCOUT BLOCKED and exits nonzero on drift", () => {
  const roots = copyContracts();
  const studioDefinitionPath = join(roots.studioRoot, "schemas/vendor/review-definition-v1.json");
  writeFileSync(studioDefinitionPath, `${readFileSync(studioDefinitionPath, "utf8")}\n`);
  const result = spawnSync(
    process.execPath,
    [
      join(DEFAULT_REPO_ROOT, "scripts/preflight-scout-contracts.mjs"),
      "--website-root",
      roots.websiteRoot,
      "--studio-root",
      roots.studioRoot,
    ],
    { encoding: "utf8" },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /^SCOUT BLOCKED: contract preflight failed:/);
  assert.equal(result.stdout, "");
});
