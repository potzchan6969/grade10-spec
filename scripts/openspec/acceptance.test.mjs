import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import {
  acceptanceReadiness,
  acceptChange,
  contractTargetDiffs,
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
    "openspec/changes/build-alpha/proposal.md":
      "# Build alpha\n\n## Why\n\nLet a reader search.\n\n[Product decisions](docs/prds/products/site/alpha.md#product-decisions)\n",
    "openspec/changes/build-alpha/decisions.md":
      "## Decisions\n\n| Q | Decided |\n| --- | --- |\n| Q1 | Search stays local to the capability. |\n\n## Raised\n\n| Capability | Raised | Landed |\n| --- | --- | --- |\n",
    "openspec/changes/build-alpha/tech-design.md":
      "# Technical design\n\nThe store owns the contract.\n",
    "openspec/changes/build-alpha/tasks.md":
      "## 1. Store contract (grade10-spec)\n\n- [ ] 1.1 Add search\n- [ ] 1.2 Verify output\n",
    "openspec/changes/build-alpha/specs/site/search/spec.md":
      "# Search\n\n## Purpose\n\nReaders find items.\n\n## Feature set\n\n### Search\n\nThe reader enters a query.\n\n## ADDED Requirements\n\n### Requirement: Search results\n\nThe system SHALL return matching items.\n\n#### Scenario: site-search-SC-01 - Results match\n\n- **WHEN** a reader searches\n- **THEN** matching items appear\n",
    "openspec/changes/build-alpha/specs/site/search/user-journeys.md":
      "# Search journeys\n\n**Walked by:** nobody on their own - the feature set routes its anchors.\n",
    "openspec/changes/build-alpha/specs/site/search/feature-tcs.md":
      "# Search test cases\n\n## Settled\n\nThe query is case insensitive.\n\n## Reconciliation\n\nThe blind reading agreed with the feature set.\n",
    "docs/prds/products/site/alpha.md":
      "# Alpha\n\n## Product decisions\n\nSearch results stay within the selected capability.\n\n## Measurement\n\nCount successful searches.\n",
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
  assert.equal(
    first.outputs.get("openspec/specs/site/search/feature-tcs.md"),
    readFileSync(
      join(
        root,
        "openspec/changes/build-alpha/specs/site/search/feature-tcs.md",
      ),
      "utf8",
    ),
  );
  assert.deepEqual(first.contractTargets, [
    { path: "openspec/specs/site/search/feature-tcs.md", anchors: [] },
    {
      path: "openspec/specs/site/search/spec.md",
      anchors: ["Feature set", "Purpose", "Requirement: Search results"],
    },
    { path: "openspec/specs/site/search/user-journeys.md", anchors: [] },
  ]);
});

// The suites above a capability travel with it: a domain suite one level up
// and a product suite two levels up publish beside the durable specs, once
// however many capabilities reach them, every case under its id and status.
test("acceptance publishes the domain and product suites above a capability", () => {
  const { root } = sandbox();
  const change = join(root, "openspec/changes/build-alpha/specs");
  const cart = join(change, "site/store/cart");
  const list = join(change, "site/store/list");
  const specOf = (name, sc) =>
    `# ${name}\n\n## Purpose\n\nReaders ${name}.\n\n## Feature set\n\n### ${name}\n\nThe reader acts.\n\n## ADDED Requirements\n\n### Requirement: ${name} works\n\nThe system SHALL work.\n\n#### Scenario: ${sc} - It works\n\n- **WHEN** a reader acts\n- **THEN** it works\n`;
  for (const [dir, name, sc] of [
    [cart, "Cart", "site-store-cart-SC-01"],
    [list, "List", "site-store-list-SC-01"],
  ]) {
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "spec.md"), specOf(name, sc));
    writeFileSync(
      join(dir, "user-journeys.md"),
      `# ${name} journeys\n\n**Walked by:** nobody on their own - the feature set routes its anchors.\n`,
    );
    writeFileSync(
      join(dir, "feature-tcs.md"),
      `# ${name} test cases\n\n## Reconciliation\n\nThe blind reading agreed.\n`,
    );
  }
  const suite = (prefix) =>
    `# Cases\n\n## ${prefix}-US1: Reader walks\n\n### ${prefix}-US1-TC1-1: Walk ends\n\n* **Status:** actual\n\nCovered.\n\n### ${prefix}-US1-TC2-1: Walk refused\n\n* **Status:** draft\n\nCovered.\n`;
  writeFileSync(
    join(change, "site/store/domain-tcs.md"),
    suite("site-store-e2e"),
  );
  writeFileSync(join(change, "site/product-tcs.md"), suite("site-e2e"));
  mkdirSync(join(root, "openspec/specs/site/store"), { recursive: true });
  writeFileSync(
    join(root, "openspec/specs/site/store/domain-tcs.md"),
    "# Cases\n\n## site-store-e2e-US0: Reader browses\n\n### site-store-e2e-US0-TC1-1: Browse ends\n\n* **Status:** actual\n\nCovered.\n",
  );

  const prepared = prepareAcceptance(root, CHANGE);
  const domain = prepared.outputs.get(
    "openspec/specs/site/store/domain-tcs.md",
  );
  const product = prepared.outputs.get("openspec/specs/site/product-tcs.md");
  assert.match(domain, /site-store-e2e-US0-TC1-1/);
  assert.match(
    domain,
    /site-store-e2e-US1-TC1-1: Walk ends\n\n\* \*\*Status:\*\* actual/,
  );
  assert.match(
    domain,
    /site-store-e2e-US1-TC2-1: Walk refused\n\n\* \*\*Status:\*\* draft/,
  );
  assert.match(product, /site-e2e-US1-TC1-1[\s\S]*site-e2e-US1-TC2-1/);
  const paths = prepared.contractTargets.map((one) => one.path);
  assert.equal(
    paths.filter((path) => path === "openspec/specs/site/store/domain-tcs.md")
      .length,
    1,
  );
  assert.ok(paths.includes("openspec/specs/site/product-tcs.md"));
});

test("acceptance merges subset journeys and test cases without deleting the durable capability", () => {
  const { root } = sandbox();
  const delta = join(root, "openspec/changes/build-alpha/specs/site/search");
  mkdirSync(join(root, "openspec/specs/site/search"), { recursive: true });
  writeFileSync(
    join(root, "openspec/specs/site/search/spec.md"),
    "# Search\n\n## Purpose\n\nReaders search.\n\n## Feature set\n\n- Existing behaviour\n  - Legacy result: remains available.\n\n## Requirements\n\n### Requirement: Existing search\n\nThe system SHALL preserve existing search.\n",
  );
  writeFileSync(
    join(root, "openspec/specs/site/search/user-journeys.md"),
    "# Search journeys\n\n## User journeys\n\n### site-search-US-02: Reader uses existing search\n\nExisting journey.\n",
  );
  writeFileSync(
    join(root, "openspec/specs/site/search/feature-tcs.md"),
    "# Search cases\n\n## site-search-US-02\n\n### site-search-TC02-01: Existing case\n\nExisting coverage.\n\n## Reconciliation\n\nExisting reconciliation.\n",
  );
  writeFileSync(
    join(delta, "spec.md"),
    readFileSync(join(delta, "spec.md"), "utf8").replace(
      "### Search\n\nThe reader enters a query.",
      "- New behaviour\n  - Query: The reader enters a query.",
    ),
  );
  writeFileSync(
    join(delta, "user-journeys.md"),
    "## ADDED User journeys\n\n### site-search-US-03: Reader sees a new result\n\nNew journey.\n\n## MODIFIED User journeys\n\n## REMOVED User journeys\n",
  );
  writeFileSync(
    join(delta, "feature-tcs.md"),
    "# Search cases\n\n## site-search-US-03\n\n### site-search-TC03-01: New case\n\nNew coverage.\n\n## Reconciliation\n\nThe cases reconcile.\n",
  );
  const prepared = prepareAcceptance(root, CHANGE);
  const spec = prepared.outputs.get("openspec/specs/site/search/spec.md");
  const journeys = prepared.outputs.get(
    "openspec/specs/site/search/user-journeys.md",
  );
  const suite = prepared.outputs.get(
    "openspec/specs/site/search/feature-tcs.md",
  );
  assert.match(spec, /Legacy result: remains available/);
  assert.match(spec, /Query: The reader enters a query/);
  assert.match(spec, /The reader enters a query\.\n\n## Requirements/);
  assert.match(journeys, /site-search-US-02/);
  assert.match(journeys, /site-search-US-03/);
  assert.match(suite, /site-search-TC02-01/);
  assert.match(suite, /site-search-TC03-01/);
});

test("acceptance keeps the durable journeys of a file with no title", () => {
  const { root } = sandbox();
  const delta = join(root, "openspec/changes/build-alpha/specs/site/search");
  mkdirSync(join(root, "openspec/specs/site/search"), { recursive: true });
  writeFileSync(
    join(root, "openspec/specs/site/search/spec.md"),
    "# Search\n\n## Purpose\n\nReaders search.\n\n## Feature set\n\n- Existing behaviour\n  - Legacy result: remains available.\n\n## Requirements\n\n### Requirement: Existing search\n\nThe system SHALL preserve existing search.\n",
  );
  writeFileSync(
    join(root, "openspec/specs/site/search/user-journeys.md"),
    "## User journeys\n\n### site-search-US-01: Reader opens search\n\nFirst journey.\n\n### site-search-US-02: Reader uses existing search\n\nExisting journey.\n",
  );
  writeFileSync(
    join(delta, "spec.md"),
    readFileSync(join(delta, "spec.md"), "utf8").replace(
      "### Search\n\nThe reader enters a query.",
      "- New behaviour\n  - Query: The reader enters a query.",
    ),
  );
  writeFileSync(
    join(delta, "user-journeys.md"),
    "## Context user journeys\n\n### site-search-US-02: Reader uses existing search\n\nExisting journey.\n\n## ADDED User journeys\n\n### site-search-US-03: Reader sees a new result\n\nNew journey.\n\n## MODIFIED User journeys\n\n## REMOVED User journeys\n",
  );
  const journeys = prepareAcceptance(root, CHANGE).outputs.get(
    "openspec/specs/site/search/user-journeys.md",
  );
  assert.match(journeys, /^## User journeys\n/);
  assert.match(journeys, /site-search-US-01: Reader opens search/);
  assert.match(journeys, /site-search-US-02/);
  assert.match(journeys, /site-search-US-03/);
  assert.ok(
    journeys.indexOf("site-search-US-01") <
      journeys.indexOf("site-search-US-03"),
  );
});

test("acceptance records ui-design as a whole-file claim target", () => {
  const { root } = sandbox();
  writeFileSync(
    join(root, `openspec/changes/${CHANGE}/ui-design.md`),
    "# Search\n\n## Screens\n\nThe reader sees a query.\n",
  );
  const prepared = prepareAcceptance(root, CHANGE);
  assert.deepEqual(
    prepared.contractTargets.find((target) =>
      target.path.endsWith("/ui-design.md"),
    ),
    {
      path: `openspec/changes/${CHANGE}/ui-design.md`,
      anchors: [],
    },
  );
});

test("acceptance rejects incomplete rename instructions and unresolved visible clarifications", () => {
  const { root } = sandbox();
  const spec = join(
    root,
    "openspec/changes/build-alpha/specs/site/search/spec.md",
  );
  writeFileSync(
    spec,
    readFileSync(spec, "utf8").replace(
      /## ADDED Requirements[\s\S]*/,
      "## RENAMED Requirements\n\n- FROM: `### Requirement: Search results`\n",
    ),
  );
  assert.throws(
    () => prepareAcceptance(root, CHANGE),
    /complete FROM\/TO pair/,
  );

  const unresolved = sandbox();
  writeFileSync(
    join(unresolved.root, "openspec/changes/build-alpha/tech-design.md"),
    "# Technical design\n\nOne detail is TBC before acceptance.\n",
  );
  assert.match(
    acceptanceReadiness(unresolved.root, CHANGE).join("\n"),
    /unresolved TBC/,
  );
});

test("a skip_specs change accepts an empty contract target scope", () => {
  const { root } = sandbox();
  rmSync(join(root, `openspec/changes/${CHANGE}/specs`), { recursive: true });
  writeFileSync(
    join(root, `openspec/changes/${CHANGE}/.openspec.yaml`),
    "schema: grade10-planning\nskip_specs: true\nskip_specs_why: The delivery changes no product behaviour.\n",
  );
  const prepared = prepareAcceptance(root, CHANGE);
  assert.equal(prepared.outputs.size, 0);
  assert.deepEqual(prepared.contractTargets, []);
  writeAcceptance(root, prepared, { reviewedBy: "@pm" });
  assert.equal(verifyAcceptance(root, CHANGE).ok, true);
});

test("a later acceptance preserves history and rebases an amendment only when its contract is unchanged", () => {
  const { root } = sandbox();
  const first = prepareAcceptance(root, CHANGE);
  applyOutputs(root, first);
  const accepted = writeAcceptance(root, first, { reviewedBy: "@pm" });
  assert.equal(verifyAcceptance(root, CHANGE).ok, true);

  const deltaPath = join(
    root,
    "openspec/changes/build-alpha/specs/site/search/spec.md",
  );
  const original = readFileSync(deltaPath, "utf8");
  writeFileSync(
    deltaPath,
    original.replace("return matching items", "return ranked matching items"),
  );
  const amended = prepareAcceptance(root, CHANGE);
  assert.notEqual(amended.fingerprint, accepted.fingerprint);
  applyOutputs(root, amended);
  writeAcceptance(root, amended, {
    reviewedBy: "@pm",
    supersedes: accepted.fingerprint,
  });
  const check = verifyAcceptance(root, CHANGE);
  assert.equal(check.ok, true, check.errors.join("\n"));
  assert.equal(check.acceptance.supersedes, accepted.fingerprint);
  assert.match(
    readFileSync(
      join(
        root,
        `openspec/changes/${CHANGE}/acceptance/${accepted.fingerprint}.json`,
      ),
      "utf8",
    ),
    /"reviewedBy": "@pm"/,
  );

  const independent = prepareAcceptance(root, CHANGE);
  assert.throws(
    () => writeAcceptance(root, independent, { reviewedBy: "@pm" }),
    /already accepted/,
  );
});

test("concurrent edits to the accepted requirement cause an explicit amendment conflict", () => {
  const { root } = sandbox();
  const first = prepareAcceptance(root, CHANGE);
  applyOutputs(root, first);
  const accepted = writeAcceptance(root, first, { reviewedBy: "@pm" });
  const durable = join(root, "openspec/specs/site/search/spec.md");
  writeFileSync(
    durable,
    readFileSync(durable, "utf8").replace("matching items", "ranked items"),
  );
  const delta = join(
    root,
    "openspec/changes/build-alpha/specs/site/search/spec.md",
  );
  writeFileSync(
    delta,
    readFileSync(delta, "utf8").replace(
      "return matching items",
      "return ranked matching items",
    ),
  );
  assert.throws(
    () => prepareAcceptance(root, CHANGE),
    /changed since this amendment began|changed since the accepted baseline/,
  );
  assert.equal(verifyAcceptance(root, CHANGE).ok, true);
  assert.equal(accepted.fingerprint.length, 64);
});

test("v2 snapshots preserve planning provenance without locking later working-artifact edits", () => {
  const { root } = sandbox();
  const prepared = prepareAcceptance(root, CHANGE);
  applyOutputs(root, prepared);
  const acceptance = writeAcceptance(root, prepared, { reviewedBy: "@qa" });
  const suite = join(
    root,
    "openspec/changes/build-alpha/specs/site/search/feature-tcs.md",
  );
  writeFileSync(
    suite,
    readFileSync(suite, "utf8").replace(
      "## Reconciliation",
      "**Status:** approved\n\n## Reconciliation",
    ),
  );
  const meta = verifyAcceptance(root, CHANGE);
  assert.equal(meta.ok, true, meta.errors.join("\n"));
  writeFileSync(
    suite,
    readFileSync(suite, "utf8").replace(
      "blind reading agreed",
      "QA observed a changed result",
    ),
  );
  const changed = verifyAcceptance(root, CHANGE);
  assert.equal(changed.ok, true, changed.errors.join("\n"));
  assert.equal(acceptance.fingerprint.length, 64);
});

test("v2 implementation attestation carries the claim baseline and exact accepted target scope", () => {
  const { root } = sandbox();
  const prepared = prepareAcceptance(root, CHANGE);
  applyOutputs(root, prepared);
  const acceptance = writeAcceptance(root, prepared, { reviewedBy: "@pm" });
  const record = join(root, `openspec/changes/${CHANGE}/implementation.json`);
  writeFileSync(
    record,
    JSON.stringify({
      version: 2,
      acceptance: { fingerprint: acceptance.fingerprint },
      contractBaseline: {
        repository: "9gag/grade10-spec",
        commit: "d".repeat(40),
        capturedAt: "2026-09-25T01:00:00.000Z",
        targets: acceptance.contractTargets,
      },
      repositories: [
        {
          repository: "grade10-site",
          commit: "a".repeat(40),
          components: ["web"],
        },
      ],
    }),
  );
  assert.equal(
    verifyAcceptance(root, CHANGE, { requireImplementation: true }).ok,
    true,
  );
  const malformed = JSON.parse(readFileSync(record, "utf8"));
  malformed.contractBaseline.targets[0].anchors = ["not accepted"];
  writeFileSync(record, JSON.stringify(malformed));
  assert.match(
    verifyAcceptance(root, CHANGE, { requireImplementation: true }).errors.join(
      "\n",
    ),
    /claimed contract baseline/,
  );
});

test("v2 implementation continues to attest its historical acceptance after a later amendment", () => {
  const { root } = sandbox();
  const firstPrepared = prepareAcceptance(root, CHANGE);
  applyOutputs(root, firstPrepared);
  const first = writeAcceptance(root, firstPrepared, { reviewedBy: "@pm" });
  writeFileSync(
    join(root, `openspec/changes/${CHANGE}/implementation.json`),
    JSON.stringify({
      version: 2,
      acceptance: { fingerprint: first.fingerprint },
      contractBaseline: {
        repository: "9gag/grade10-spec",
        commit: "e".repeat(40),
        capturedAt: "2026-09-25T01:00:00.000Z",
        targets: first.contractTargets,
      },
      repositories: [
        {
          repository: "grade10-site",
          commit: "a".repeat(40),
          components: ["web"],
        },
      ],
    }),
  );
  const delta = join(
    root,
    "openspec/changes/build-alpha/specs/site/search/spec.md",
  );
  writeFileSync(
    delta,
    `${readFileSync(delta, "utf8").trim()}\n\n### Requirement: Result count\n\nThe system SHALL return a count.\n`,
  );
  const amended = prepareAcceptance(root, CHANGE);
  applyOutputs(root, amended);
  writeAcceptance(root, amended, {
    reviewedBy: "@pm",
    supersedes: first.fingerprint,
  });
  const check = verifyAcceptance(root, CHANGE, { requireImplementation: true });
  assert.equal(check.ok, true, check.errors.join("\n"));
  assert.equal(check.implementationAcceptance.fingerprint, first.fingerprint);
});

test("contract target comparison ignores a sibling requirement but reports the selected requirement", () => {
  const targets = [
    {
      path: "openspec/specs/site/search/spec.md",
      anchors: ["Requirement: Search results"],
    },
  ];
  const baseline =
    "# Search\n\n## Requirements\n\n### Requirement: Search results\n\nThe system SHALL return matching items.\n\n### Requirement: Other\n\nOther text.\n";
  const siblingAdvance = baseline.replace(
    "Other text.",
    "A sibling change advances it.",
  );
  assert.deepEqual(
    contractTargetDiffs(
      targets,
      () => baseline,
      () => siblingAdvance,
    ),
    [],
  );
  const selectedAdvance = baseline.replace(
    "matching items.",
    "ranked matching items.",
  );
  assert.deepEqual(
    contractTargetDiffs(
      targets,
      () => baseline,
      () => selectedAdvance,
    ),
    targets,
  );
});

test("archive requires a full implementation attestation for an accepted fingerprint", () => {
  const { root } = sandbox();
  const prepared = prepareAcceptance(root, CHANGE);
  applyOutputs(root, prepared);
  const acceptance = writeAcceptance(root, prepared, { reviewedBy: "@pm" });
  assert.equal(
    verifyAcceptance(root, CHANGE, { requireImplementation: true }).ok,
    false,
  );
  writeFileSync(
    join(root, `openspec/changes/${CHANGE}/implementation.json`),
    JSON.stringify({
      version: 1,
      fingerprint: acceptance.fingerprint,
      repositories: [
        {
          repository: "grade10-site",
          commit: "a".repeat(40),
          components: ["web"],
        },
      ],
    }),
  );
  const check = verifyAcceptance(root, CHANGE, { requireImplementation: true });
  assert.equal(check.ok, true, check.errors.join("\n"));
  const code = readFileSync(
    join(root, `openspec/changes/${CHANGE}/implementation.json`),
    "utf8",
  ).replace(acceptance.fingerprint, hash("stale"));
  writeFileSync(
    join(root, `openspec/changes/${CHANGE}/implementation.json`),
    code,
  );
  assert.equal(
    verifyAcceptance(root, CHANGE, { requireImplementation: true }).ok,
    false,
  );
});

test("a store-only implementation attestation explains why it has no runtime components", () => {
  const { root } = sandbox();
  const prepared = prepareAcceptance(root, CHANGE);
  applyOutputs(root, prepared);
  const acceptance = writeAcceptance(root, prepared, { reviewedBy: "@pm" });
  const record = join(root, `openspec/changes/${CHANGE}/implementation.json`);
  writeFileSync(
    record,
    JSON.stringify({
      version: 1,
      fingerprint: acceptance.fingerprint,
      repositories: [
        {
          repository: "9gag/grade10-spec",
          commit: "c".repeat(40),
          components: [],
        },
      ],
    }),
  );
  assert.equal(
    verifyAcceptance(root, CHANGE, { requireImplementation: true }).ok,
    false,
  );
  writeFileSync(
    record,
    JSON.stringify({
      version: 1,
      fingerprint: acceptance.fingerprint,
      repositories: [
        {
          repository: "9gag/grade10-spec",
          commit: "c".repeat(40),
          components: [],
          scope: "no-runtime",
          reason:
            "This repository publishes the contract and has no serving component.",
        },
      ],
    }),
  );
  const check = verifyAcceptance(root, CHANGE, { requireImplementation: true });
  assert.equal(check.ok, true, check.errors.join("\n"));
});

test("later durable advances do not invalidate the accepted snapshot, including after archive move", () => {
  const { root } = sandbox();
  const prepared = prepareAcceptance(root, CHANGE);
  applyOutputs(root, prepared);
  const acceptance = writeAcceptance(root, prepared, { reviewedBy: "@pm" });
  writeFileSync(
    join(root, `openspec/changes/${CHANGE}/implementation.json`),
    JSON.stringify({
      version: 1,
      fingerprint: acceptance.fingerprint,
      repositories: [
        {
          repository: "grade10-site",
          commit: "b".repeat(40),
          components: ["web"],
        },
      ],
    }),
  );
  const durable = join(root, "openspec/specs/site/search/spec.md");
  writeFileSync(
    durable,
    `${readFileSync(durable, "utf8")}\n### Requirement: A later unrelated contract\n\nIt advances after this acceptance.\n`,
  );
  assert.equal(
    verifyAcceptance(root, CHANGE, { requireImplementation: true }).ok,
    true,
  );

  const archived = join(
    root,
    "openspec/changes/archive/2026-09-25-build-alpha",
  );
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
  assert.match(
    readFileSync(join(root, "openspec/specs/site/search/spec.md"), "utf8"),
    /Requirement: Search results/,
  );
  const reread = prepareAcceptance(root, CHANGE);
  assert.equal(
    reread.outputs.get("openspec/specs/site/search/spec.md"),
    preview.outputs.get("openspec/specs/site/search/spec.md"),
    `${reread.outputs.get("openspec/specs/site/search/spec.md")}\n---EXPECTED---\n${preview.outputs.get("openspec/specs/site/search/spec.md")}`,
  );
  assert.equal(
    accepted.fingerprint,
    reread.fingerprint,
    JSON.stringify(
      { first: preview.artifacts, second: reread.artifacts },
      null,
      2,
    ),
  );
});

test("spec:accept rolls back every durable and acceptance file when validation refuses", () => {
  const { root } = sandbox();
  const before = prepareAcceptance(root, CHANGE);
  let calls = 0;
  assert.throws(
    () =>
      acceptChange(root, CHANGE, {
        reviewedBy: "@pm",
        expectedBaseline: before.baselineFingerprint,
        runCommand() {
          calls += 1;
          return calls === 2
            ? { status: 1, stdout: "manual refusal", stderr: "" }
            : { status: 0, stdout: "", stderr: "" };
        },
      }),
    /check:manual after fold refused acceptance/,
  );
  for (const [path] of before.outputs) {
    assert.equal(existsSync(join(root, path)), false);
  }
  assert.equal(verifyAcceptance(root, CHANGE).ok, false);
  assert.deepEqual(calls, 2);
});
