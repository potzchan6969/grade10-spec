import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import {
  acceptChange,
  acceptanceReadiness,
  prepareAcceptance,
  verifyAcceptance,
  writeAcceptance,
} from "./lib/acceptance.mjs";

const CHANGE = "build-alpha";
const hash = (text) => createHash("sha256").update(text).digest("hex");

function sandbox() {
  const root = mkdtempSync(join(tmpdir(), "spec-accept-"));
  const files = {
    "openspec/changes/build-alpha/.openspec.yaml": "schema: grade10-planning\n",
    "openspec/changes/build-alpha/proposal.md": "# Build alpha\n\n## Why\n\nLet a reader search.\n\n[Product decisions](docs/prds/products/site/alpha.md#product-decisions)\n",
    "openspec/changes/build-alpha/decisions.md": "## Decisions\n\n| Q | Decided |\n| --- | --- |\n| Q1 | Search stays local to the capability. |\n\n## Raised\n\n| Capability | Raised | Landed |\n| --- | --- | --- |\n",
    "openspec/changes/build-alpha/tech-design.md": "# Technical design\n\nThe store owns the contract.\n",
    "openspec/changes/build-alpha/tasks.md": "## 1. Store contract (grade10-spec)\n\n- [ ] 1.1 Add search\n- [ ] 1.2 Verify output\n",
    "openspec/changes/build-alpha/specs/site/search/spec.md": "# Search\n\n## Purpose\n\nReaders find items.\n\n## Feature set\n\n### Search\n\nThe reader enters a query.\n\n## ADDED Requirements\n\n### Requirement: Search results\n\nThe system SHALL return matching items.\n\n#### Scenario: site-search-SC-01 - Results match\n\n- **WHEN** a reader searches\n- **THEN** matching items appear\n",
    "openspec/changes/build-alpha/specs/site/search/user-journeys.md": "# Search journeys\n\n**Walked by:** nobody on their own - the feature set routes its anchors.\n",
    "openspec/changes/build-alpha/specs/site/search/feature-tcs.md": "# Search test cases\n\n## Settled\n\nThe query is case insensitive.\n\n## Reconciliation\n\nThe blind reading agreed with the feature set.\n",
    "docs/prds/products/site/alpha.md": "# Alpha\n\n## Product decisions\n\nSearch results stay within the selected capability.\n\n## Measurement\n\nCount successful searches.\n",
  };
  for (const [path, content] of Object.entries(files)) {
    const target = join(root, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
  }
  return { root, files };
}

function applyOutputs(root, prepared) {
  for (const [path, content] of prepared.outputs) {
    const target = join(root, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
  }
}

test("acceptance fingerprint is deterministic and binds the folded durable scope", () => {
  const { root } = sandbox();
  const first = prepareAcceptance(root, CHANGE);
  const second = prepareAcceptance(root, CHANGE);
  assert.equal(first.fingerprint, second.fingerprint);
  assert.match(first.fingerprint, /^[a-f0-9]{64}$/);
  const durable = first.outputs.get("openspec/specs/site/search/spec.md");
  assert.match(durable, /## Purpose[\s\S]*Readers find items/);
  assert.match(durable, /## Feature set[\s\S]*The reader enters a query/);
  assert.match(durable, /Requirement: Search results/);
  assert.equal(first.outputs.get("openspec/specs/site/search/feature-tcs.md"), readFileSync(join(root, "openspec/changes/build-alpha/specs/site/search/feature-tcs.md"), "utf8"));
});

test("acceptance merges subset journeys and test cases without deleting the durable capability", () => {
  const { root } = sandbox();
  const delta = join(root, "openspec/changes/build-alpha/specs/site/search");
  mkdirSync(join(root, "openspec/specs/site/search"), { recursive: true });
  writeFileSync(join(root, "openspec/specs/site/search/spec.md"), "# Search\n\n## Purpose\n\nReaders search.\n\n## Feature set\n\n- Existing behaviour\n  - Legacy result: remains available.\n\n## Requirements\n\n### Requirement: Existing search\n\nThe system SHALL preserve existing search.\n");
  writeFileSync(join(root, "openspec/specs/site/search/user-journeys.md"), "# Search journeys\n\n## User journeys\n\n### site-search-US-02: Reader uses existing search\n\nExisting journey.\n");
  writeFileSync(join(root, "openspec/specs/site/search/feature-tcs.md"), "# Search cases\n\n## site-search-US-02\n\n### site-search-TC02-01: Existing case\n\nExisting coverage.\n\n## Reconciliation\n\nExisting reconciliation.\n");
  writeFileSync(join(delta, "spec.md"), readFileSync(join(delta, "spec.md"), "utf8").replace("### Search\n\nThe reader enters a query.", "- New behaviour\n  - Query: The reader enters a query."));
  writeFileSync(join(delta, "user-journeys.md"), "## ADDED User journeys\n\n### site-search-US-03: Reader sees a new result\n\nNew journey.\n\n## MODIFIED User journeys\n\n## REMOVED User journeys\n");
  writeFileSync(join(delta, "feature-tcs.md"), "# Search cases\n\n## site-search-US-03\n\n### site-search-TC03-01: New case\n\nNew coverage.\n\n## Reconciliation\n\nThe cases reconcile.\n");
  const prepared = prepareAcceptance(root, CHANGE);
  const spec = prepared.outputs.get("openspec/specs/site/search/spec.md");
  const journeys = prepared.outputs.get("openspec/specs/site/search/user-journeys.md");
  const suite = prepared.outputs.get("openspec/specs/site/search/feature-tcs.md");
  assert.match(spec, /Legacy result: remains available/);
  assert.match(spec, /Query: The reader enters a query/);
  assert.match(journeys, /site-search-US-02/);
  assert.match(journeys, /site-search-US-03/);
  assert.match(suite, /site-search-TC02-01/);
  assert.match(suite, /site-search-TC03-01/);
});

test("acceptance rejects incomplete rename instructions and unresolved visible clarifications", () => {
  const { root } = sandbox();
  const spec = join(root, "openspec/changes/build-alpha/specs/site/search/spec.md");
  writeFileSync(spec, readFileSync(spec, "utf8").replace(/## ADDED Requirements[\s\S]*/, "## RENAMED Requirements\n\n- FROM: `### Requirement: Search results`\n"));
  assert.throws(() => prepareAcceptance(root, CHANGE), /complete FROM\/TO pair/);

  const unresolved = sandbox();
  writeFileSync(join(unresolved.root, "openspec/changes/build-alpha/tech-design.md"), "# Technical design\n\nOne detail is TBC before acceptance.\n");
  assert.match(acceptanceReadiness(unresolved.root, CHANGE).join("\n"), /unresolved TBC/);
});

test("a later acceptance preserves history and rebases an amendment only when its contract is unchanged", () => {
  const { root } = sandbox();
  const first = prepareAcceptance(root, CHANGE);
  applyOutputs(root, first);
  const accepted = writeAcceptance(root, first, { reviewedBy: "@pm" });
  assert.equal(verifyAcceptance(root, CHANGE).ok, true);

  const deltaPath = join(root, "openspec/changes/build-alpha/specs/site/search/spec.md");
  const original = readFileSync(deltaPath, "utf8");
  writeFileSync(deltaPath, original.replace("return matching items", "return ranked matching items"));
  const amended = prepareAcceptance(root, CHANGE);
  assert.notEqual(amended.fingerprint, accepted.fingerprint);
  applyOutputs(root, amended);
  writeAcceptance(root, amended, { reviewedBy: "@pm", supersedes: accepted.fingerprint });
  const check = verifyAcceptance(root, CHANGE);
  assert.equal(check.ok, true, check.errors.join("\n"));
  assert.equal(check.acceptance.supersedes, accepted.fingerprint);
  assert.match(readFileSync(join(root, `openspec/changes/${CHANGE}/acceptance/${accepted.fingerprint}.json`), "utf8"), /"reviewedBy": "@pm"/);

  const independent = prepareAcceptance(root, CHANGE);
  assert.throws(() => writeAcceptance(root, independent, { reviewedBy: "@pm" }), /already accepted/);
});

test("concurrent edits to the accepted requirement cause an explicit amendment conflict", () => {
  const { root } = sandbox();
  const first = prepareAcceptance(root, CHANGE);
  applyOutputs(root, first);
  const accepted = writeAcceptance(root, first, { reviewedBy: "@pm" });
  const durable = join(root, "openspec/specs/site/search/spec.md");
  writeFileSync(durable, readFileSync(durable, "utf8").replace("matching items", "ranked items"));
  const delta = join(root, "openspec/changes/build-alpha/specs/site/search/spec.md");
  writeFileSync(delta, readFileSync(delta, "utf8").replace("return matching items", "return ranked matching items"));
  assert.throws(() => prepareAcceptance(root, CHANGE), /changed since this amendment began|changed since the accepted baseline/);
  assert.equal(verifyAcceptance(root, CHANGE).ok, false);
  assert.equal(accepted.fingerprint.length, 64);
});

test("verifier accepts QA disposition and automation metadata changes but rejects contract tampering", () => {
  const { root } = sandbox();
  const prepared = prepareAcceptance(root, CHANGE);
  applyOutputs(root, prepared);
  const acceptance = writeAcceptance(root, prepared, { reviewedBy: "@qa" });
  const suite = join(root, "openspec/changes/build-alpha/specs/site/search/feature-tcs.md");
  writeFileSync(suite, readFileSync(suite, "utf8").replace("## Reconciliation", "**Status:** approved\n\n## Reconciliation"));
  const meta = verifyAcceptance(root, CHANGE);
  assert.equal(meta.ok, true, meta.errors.join("\n"));
  writeFileSync(suite, readFileSync(suite, "utf8").replace("blind reading agreed", "QA observed a changed result"));
  const tampered = verifyAcceptance(root, CHANGE);
  assert.equal(tampered.ok, false);
  assert.match(tampered.errors.join("\n"), /accepted input changed/);
  assert.equal(acceptance.fingerprint.length, 64);
});

test("archive requires a full implementation attestation for the current fingerprint", () => {
  const { root } = sandbox();
  const prepared = prepareAcceptance(root, CHANGE);
  applyOutputs(root, prepared);
  const acceptance = writeAcceptance(root, prepared, { reviewedBy: "@pm" });
  assert.equal(verifyAcceptance(root, CHANGE, { requireImplementation: true }).ok, false);
  writeFileSync(join(root, `openspec/changes/${CHANGE}/implementation.json`), JSON.stringify({
    version: 1,
    fingerprint: acceptance.fingerprint,
    repositories: [{ repository: "grade10-site", commit: "a".repeat(40), components: ["web"] }],
  }));
  const check = verifyAcceptance(root, CHANGE, { requireImplementation: true });
  assert.equal(check.ok, true, check.errors.join("\n"));
  const code = readFileSync(join(root, `openspec/changes/${CHANGE}/implementation.json`), "utf8").replace(acceptance.fingerprint, hash("stale"));
  writeFileSync(join(root, `openspec/changes/${CHANGE}/implementation.json`), code);
  assert.equal(verifyAcceptance(root, CHANGE, { requireImplementation: true }).ok, false);
});

test("a store-only implementation attestation explains why it has no runtime components", () => {
  const { root } = sandbox();
  const prepared = prepareAcceptance(root, CHANGE);
  applyOutputs(root, prepared);
  const acceptance = writeAcceptance(root, prepared, { reviewedBy: "@pm" });
  const record = join(root, `openspec/changes/${CHANGE}/implementation.json`);
  writeFileSync(record, JSON.stringify({
    version: 1,
    fingerprint: acceptance.fingerprint,
    repositories: [{ repository: "9gag/grade10-spec", commit: "c".repeat(40), components: [] }],
  }));
  assert.equal(verifyAcceptance(root, CHANGE, { requireImplementation: true }).ok, false);
  writeFileSync(record, JSON.stringify({
    version: 1,
    fingerprint: acceptance.fingerprint,
    repositories: [{
      repository: "9gag/grade10-spec",
      commit: "c".repeat(40),
      components: [],
      scope: "no-runtime",
      reason: "This repository publishes the contract and has no serving component.",
    }],
  }));
  const check = verifyAcceptance(root, CHANGE, { requireImplementation: true });
  assert.equal(check.ok, true, check.errors.join("\n"));
});

test("later durable advances do not invalidate the accepted snapshot, including after archive move", () => {
  const { root } = sandbox();
  const prepared = prepareAcceptance(root, CHANGE);
  applyOutputs(root, prepared);
  const acceptance = writeAcceptance(root, prepared, { reviewedBy: "@pm" });
  writeFileSync(join(root, `openspec/changes/${CHANGE}/implementation.json`), JSON.stringify({
    version: 1,
    fingerprint: acceptance.fingerprint,
    repositories: [{ repository: "grade10-site", commit: "b".repeat(40), components: ["web"] }],
  }));
  const durable = join(root, "openspec/specs/site/search/spec.md");
  writeFileSync(durable, `${readFileSync(durable, "utf8")}\n### Requirement: A later unrelated contract\n\nIt advances after this acceptance.\n`);
  assert.equal(verifyAcceptance(root, CHANGE, { requireImplementation: true }).ok, true);

  const archived = join(root, "openspec/changes/archive/2026-09-25-build-alpha");
  mkdirSync(dirname(archived), { recursive: true });
  renameSync(join(root, `openspec/changes/${CHANGE}`), archived);
  const check = verifyAcceptance(root, CHANGE, { requireImplementation: true });
  assert.equal(check.ok, true, check.errors.join("\n"));
});

test("spec:accept commits folded files and acceptance only after both validators pass", () => {
  const { root } = sandbox();
  const preview = prepareAcceptance(root, CHANGE);
  const commands = [];
  const accepted = acceptChange(root, CHANGE, {
    reviewedBy: "@pm",
    expectedBaseline: preview.baselineFingerprint,
    runCommand(args) {
      commands.push(args.join(" "));
      return { status: 0, stdout: "", stderr: "" };
    },
  });
  assert.deepEqual(commands, [
    `run validate:changes ${CHANGE}`,
    "check:manual",
    `run validate:changes ${CHANGE}`,
  ]);
  assert.equal(verifyAcceptance(root, CHANGE).ok, true);
  assert.match(readFileSync(join(root, "openspec/specs/site/search/spec.md"), "utf8"), /Requirement: Search results/);
  const reread = prepareAcceptance(root, CHANGE);
  assert.equal(reread.outputs.get("openspec/specs/site/search/spec.md"), preview.outputs.get("openspec/specs/site/search/spec.md"), `${reread.outputs.get("openspec/specs/site/search/spec.md")}\n---EXPECTED---\n${preview.outputs.get("openspec/specs/site/search/spec.md")}`);
  assert.equal(accepted.fingerprint, reread.fingerprint, JSON.stringify({ first: preview.artifacts, second: reread.artifacts }, null, 2));
});

test("spec:accept rolls back every durable and acceptance file when validation refuses", () => {
  const { root } = sandbox();
  const before = prepareAcceptance(root, CHANGE);
  let calls = 0;
  assert.throws(() => acceptChange(root, CHANGE, {
    reviewedBy: "@pm",
    expectedBaseline: before.baselineFingerprint,
    runCommand() {
      calls += 1;
      return calls === 2
        ? { status: 1, stdout: "manual refusal", stderr: "" }
        : { status: 0, stdout: "", stderr: "" };
    },
  }), /check:manual after fold refused acceptance/);
  for (const [path] of before.outputs) {
    assert.equal(existsSync(join(root, path)), false);
  }
  assert.equal(verifyAcceptance(root, CHANGE).ok, false);
  assert.deepEqual(calls, 2);
});
