import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
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
  mergeFeatureSet,
  mergeSuite,
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

// A page link resolves on the id the manual renders the heading with, so a
// link `pnpm check:manual` accepts is one acceptance can scope.
test("a page anchor resolves on the manual's heading id", () => {
  const { root, files } = sandbox();
  const proposal = join(root, "openspec/changes/build-alpha/proposal.md");
  writeFileSync(
    proposal,
    files["openspec/changes/build-alpha/proposal.md"].replace(
      "alpha.md#product-decisions",
      "alpha.md#a-card-s-outcome",
    ),
  );
  writeFileSync(
    join(root, "docs/prds/products/site/alpha.md"),
    "# Alpha\n\n## A Card's Outcome\n\n❓ Whether a card is kept.\n",
  );
  assert.throws(
    () => prepareAcceptance(root, CHANGE),
    /alpha\.md#a-card-s-outcome still carries an unresolved TBC or ❓ decision/,
  );
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

function writeDurable(root, name, content) {
  const target = join(root, "openspec/specs/site/search", name);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
}

function git(root, ...args) {
  execFileSync("git", args, { cwd: root, stdio: "pipe" });
}

function commitAll(root, message) {
  git(root, "add", "-A");
  git(
    root,
    "-c",
    "user.name=t",
    "-c",
    "user.email=t@t",
    "commit",
    "-qm",
    message,
  );
}

const SEARCH_DELTA = "openspec/changes/build-alpha/specs/site/search";

test("an added journey that reuses a durable journey id is refused", () => {
  const { root } = sandbox();
  writeDurable(
    root,
    "user-journeys.md",
    "# Search journeys\n\n## User journeys\n\n### site-search-US-02: Reader uses existing search\n\nExisting journey.\n",
  );
  writeFileSync(
    join(root, SEARCH_DELTA, "user-journeys.md"),
    "## ADDED User journeys\n\n### site-search-US-02: Reader saves a search\n\nNew journey.\n",
  );
  assert.throws(
    () => prepareAcceptance(root, CHANGE),
    /added journey site-search-US-02 already exists.*renumber/,
  );
});

test("a test case id already held by another durable journey is refused", () => {
  const { root } = sandbox();
  writeDurable(
    root,
    "feature-tcs.md",
    "# Search cases\n\n## site-search-US-02\n\n### site-search-TC02-01: Existing case\n\nExisting coverage.\n\n## Reconciliation\n\nExisting reconciliation.\n",
  );
  writeFileSync(
    join(root, SEARCH_DELTA, "feature-tcs.md"),
    "# Search cases\n\n## site-search-US-03\n\n### site-search-TC02-01: New case\n\nNew coverage.\n\n## Reconciliation\n\nThe cases reconcile.\n",
  );
  assert.throws(
    () => prepareAcceptance(root, CHANGE),
    /test case site-search-TC02 appears more than once in the merged suite; give the new case the next unused TC number/,
  );
});

test("a retitled journey group and case replace their durable copies by id", () => {
  const { root } = sandbox();
  writeDurable(
    root,
    "feature-tcs.md",
    "# Search cases\n\n## site-search-US2: Reader uses search\n\n### site-search-US2-TC1-1: Old case title\n\nOld coverage.\n\n### site-search-US2-TC2-1: Kept case\n\nKept coverage.\n\n## Reconciliation\n\nExisting reconciliation.\n",
  );
  writeFileSync(
    join(root, SEARCH_DELTA, "feature-tcs.md"),
    "# Search cases\n\n## site-search-US2: Reader searches and saves\n\n### site-search-US2-TC1-1: New case title\n\nNew coverage.\n\n## Reconciliation\n\nThe cases reconcile.\n",
  );
  const suite = prepareAcceptance(root, CHANGE).outputs.get(
    "openspec/specs/site/search/feature-tcs.md",
  );
  assert.match(suite, /## site-search-US2: Reader searches and saves/);
  assert.doesNotMatch(suite, /Reader uses search|Old case title/);
  assert.match(suite, /site-search-US2-TC1-1: New case title/);
  assert.match(suite, /site-search-US2-TC2-1: Kept case/);
});

test("a first acceptance refuses a Purpose written before the durable Purpose last changed", () => {
  const { root } = sandbox();
  writeDurable(
    root,
    "spec.md",
    "# Search\n\n## Purpose\n\nReaders search.\n\n## Requirements\n\n### Requirement: Existing search\n\nThe system SHALL preserve existing search.\n",
  );
  git(root, "init", "-q");
  commitAll(root, "delta written");
  writeDurable(
    root,
    "spec.md",
    "# Search\n\n## Purpose\n\nReaders search and save searches.\n\n## Requirements\n\n### Requirement: Existing search\n\nThe system SHALL preserve existing search.\n",
  );
  commitAll(root, "another change archives");
  assert.throws(
    () => prepareAcceptance(root, CHANGE),
    /site\/search: accepted Purpose changed since this delta's Purpose was written; fold the durable Purpose's changes into this delta's Purpose and commit it/,
  );

  const deltaPath = join(root, SEARCH_DELTA, "spec.md");
  writeFileSync(
    deltaPath,
    readFileSync(deltaPath, "utf8").replace(
      "Readers find items.",
      "Readers find, search and save items.",
    ),
  );
  commitAll(root, "delta rebased");
  assert.doesNotThrow(() => prepareAcceptance(root, CHANGE));
});

test("a fold that drops a durable scenario's trace marker is refused unless its requirement is removed", () => {
  const { root } = sandbox();
  const durable =
    "# Search\n\n## Purpose\n\nReaders find items.\n\n## Requirements\n\n### Requirement: Search results\n\nThe system SHALL return items.\n\n<!-- trace:scenario id=g10.site-search.SC-a1b rev=1 -->\n#### Scenario: site-search-SC-01 - Results match\n\n- **WHEN** a reader searches\n- **THEN** items appear\n";
  writeDurable(root, "spec.md", durable);
  const deltaPath = join(root, SEARCH_DELTA, "spec.md");
  const original = readFileSync(deltaPath, "utf8");
  writeFileSync(
    deltaPath,
    original.replace("## ADDED Requirements", "## MODIFIED Requirements"),
  );
  assert.throws(
    () => prepareAcceptance(root, CHANGE),
    /site\/search: the fold drops trace marker g10\.site-search\.SC-a1b/,
  );

  writeFileSync(
    deltaPath,
    original
      .replace("## ADDED Requirements", "## MODIFIED Requirements")
      .replace(
        "#### Scenario: site-search-SC-01",
        "<!-- trace:scenario id=g10.site-search.SC-a1b rev=1 -->\n#### Scenario: site-search-SC-01",
      ),
  );
  assert.doesNotThrow(() => prepareAcceptance(root, CHANGE));

  writeFileSync(
    deltaPath,
    original.replace(
      /## ADDED Requirements[\s\S]*$/,
      "## REMOVED Requirements\n\n### Requirement: Search results\n\n**Reason**: Retired.\n",
    ),
  );
  assert.doesNotThrow(() => prepareAcceptance(root, CHANGE));
});

test("a MODIFIED requirement may delete a scenario together with its marker", () => {
  const { root } = sandbox();
  writeDurable(
    root,
    "spec.md",
    "# Search\n\n## Purpose\n\nReaders find items.\n\n## Requirements\n\n### Requirement: Search results\n\nThe system SHALL return items.\n\n<!-- trace:scenario id=g10.site-search.SC-a1b rev=1 -->\n#### Scenario: site-search-SC-01 - Results match\n\n- **WHEN** a reader searches\n- **THEN** items appear\n\n<!-- trace:scenario id=g10.site-search.SC-c2d rev=1 -->\n#### Scenario: site-search-SC-02 - Empty query\n\n- **WHEN** a reader searches nothing\n- **THEN** nothing appears\n",
  );
  const deltaPath = join(root, SEARCH_DELTA, "spec.md");
  writeFileSync(
    deltaPath,
    readFileSync(deltaPath, "utf8")
      .replace("## ADDED Requirements", "## MODIFIED Requirements")
      .replace(
        "#### Scenario: site-search-SC-01",
        "<!-- trace:scenario id=g10.site-search.SC-a1b rev=1 -->\n#### Scenario: site-search-SC-01",
      ),
  );
  assert.doesNotThrow(() => prepareAcceptance(root, CHANGE));
});

test("a first acceptance refuses a Purpose written before another change created the durable spec", () => {
  const { root } = sandbox();
  git(root, "init", "-q");
  commitAll(root, "delta written");
  writeDurable(
    root,
    "spec.md",
    "# Search\n\n## Purpose\n\nReaders search.\n\n## Requirements\n\n### Requirement: Existing search\n\nThe system SHALL preserve existing search.\n",
  );
  commitAll(root, "another change archives first");
  assert.throws(
    () => prepareAcceptance(root, CHANGE),
    /site\/search: accepted Purpose changed since this delta's Purpose was written/,
  );
});

test("a skipped Purpose drift check says why", (t) => {
  const { root } = sandbox();
  git(root, "init", "-q");
  commitAll(root, "delta written");
  const deltaPath = join(root, SEARCH_DELTA, "spec.md");
  writeFileSync(
    deltaPath,
    readFileSync(deltaPath, "utf8").replace(
      "Readers find items.",
      "Readers find more items.",
    ),
  );
  const warn = t.mock.method(console, "warn", () => {});
  prepareAcceptance(root, CHANGE);
  assert.match(
    warn.mock.calls.map((call) => call.arguments.join(" ")).join("\n"),
    /site\/search\/spec\.md: Purpose drift not checked - its Purpose has uncommitted edits/,
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
  assert.equal(commands.length, 4);
  assert.equal(commands[0], `run validate:changes ${CHANGE}`);
  assert.match(
    commands[1],
    /^run tcs:validate --root \S+folded-store-\S+ --require-suites$/,
  );
  assert.deepEqual(commands.slice(2), [
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
          return calls === 3
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
  assert.deepEqual(calls, 3);
});

test("spec:accept validates the folded store in a copy and writes nothing when it fails", () => {
  const { root } = sandbox();
  const before = prepareAcceptance(root, CHANGE);
  let folded = null;
  assert.throws(
    () =>
      acceptChange(root, CHANGE, {
        reviewedBy: "@pm",
        expectedBaseline: before.baselineFingerprint,
        runCommand(args) {
          if (args[1] !== "tcs:validate") return { status: 0 };
          const tree = args[3];
          folded = readFileSync(
            join(tree, "openspec/specs/site/search/feature-tcs.md"),
            "utf8",
          );
          return { status: 1, stdout: "TC1 appears more than once" };
        },
      }),
    /tcs:validate refused the folded store:\nTC1 appears more than once/,
  );
  assert.equal(
    folded,
    before.outputs.get("openspec/specs/site/search/feature-tcs.md"),
  );
  for (const [path] of before.outputs)
    assert.equal(existsSync(join(root, path)), false);
});

test("spec:accept refuses a folded file whose trace marker is out of place", () => {
  const { root } = sandbox();
  writeFileSync(
    join(root, SEARCH_DELTA, "feature-tcs.md"),
    "# Search test cases\n\n## site-search-US1: Journey 1\n\n### site-search-US1-TC1-1: A case\n\n* **Status:** draft\n\n<!-- trace:case id=g.search.TC-z1 rev=1 covers=g.search.SC-z1 -->\n\n## Reconciliation\n\nThe blind reading agreed with the feature set.\n",
  );
  const before = prepareAcceptance(root, CHANGE);
  assert.throws(
    () =>
      acceptChange(root, CHANGE, {
        reviewedBy: "@pm",
        expectedBaseline: before.baselineFingerprint,
        runCommand: () => ({ status: 0 }),
      }),
    /trace markers in the folded files sit away from their headings:\n- openspec\/specs\/site\/search\/feature-tcs\.md:\d+ \[marker-adjacency\]/,
  );
  for (const [path] of before.outputs)
    assert.equal(existsSync(join(root, path)), false);
});

const caseBlock = (id, status = "draft") =>
  `### ${id}: A case\n\n**Classification:**\n\n* **Status:** ${status}\n\nBody of ${id}.`;
const suiteOf = (...parts) =>
  `# site/search Test Cases\n\n**Status:** pending-review\n\n${parts.join("\n\n")}\n`;
const group = (n, ...cases) =>
  [`## site-search-US${n}: Journey ${n}`, ...cases].join("\n\n");
const merge = (current, delta) =>
  mergeSuite(current, delta, "site/search", "2026-10-02");
const reviewed = (text) =>
  text.replace(
    "**Status:** pending-review",
    "**Status:** approved\n**Reviewed:** 2026-09-29, tcs-rules r4",
  );

test("suite fold puts a revised case where its earlier revision stood", () => {
  const merged = merge(
    suiteOf(
      group(
        1,
        caseBlock("site-search-US1-TC1-1", "actual"),
        "<!-- trace:case id=g.search.TC-a1 rev=1 covers=g.search.SC-a1 -->",
        caseBlock("site-search-US1-TC2-1", "actual"),
        caseBlock("site-search-US1-TC3-1", "actual"),
      ),
    ),
    suiteOf(
      group(
        1,
        caseBlock("site-search-US1-TC2-2"),
        caseBlock("site-search-US1-TC4-1"),
      ),
    ),
  );
  const order = [...merged.matchAll(/^### (\S+):/gm)].map((one) => one[1]);
  assert.deepEqual(order, [
    "site-search-US1-TC1-1",
    "site-search-US1-TC2-2",
    "site-search-US1-TC3-1",
    "site-search-US1-TC4-1",
  ]);
  assert.match(
    merged,
    /<!-- trace:case id=g\.search\.TC-a1 rev=2 [^\n]*-->\n### site-search-US1-TC2-2:/,
  );
});

test("suite fold keeps the marker above a journey's first case when the change rewrites the journey", () => {
  const marker =
    "<!-- trace:case id=g.search.TC-b1 rev=1 covers=g.search.SC-b1 -->";
  const merged = merge(
    suiteOf(
      `## site-search-US1: Journey 1\n\nThe durable story.\n\n${marker}\n${caseBlock("site-search-US1-TC1-1", "actual")}`,
    ),
    suiteOf(group(1, caseBlock("site-search-US1-TC2-1"))),
  );
  assert.match(
    merged,
    /## site-search-US1: Journey 1\n\n<!-- trace:case id=g\.search\.TC-b1 rev=1 [^\n]*-->\n### site-search-US1-TC1-1:/,
  );
});

test("suite fold refuses a journey child it cannot place", () => {
  assert.throws(
    () =>
      merge(
        suiteOf(
          group(
            1,
            caseBlock("site-search-US1-TC1-1"),
            "### Notes\n\nKept by hand.",
          ),
        ),
        suiteOf(group(1, caseBlock("site-search-US1-TC2-1"))),
      ),
    /`### Notes` under `## site-search-US1: Journey 1` is not a test case the fold can place/,
  );
});

test("suite fold refuses a durable suite that already repeats a TC number", () => {
  assert.throws(
    () =>
      merge(
        suiteOf(
          group(
            1,
            caseBlock("site-search-US1-TC1-1"),
            caseBlock("site-search-US1-TC1-2"),
          ),
        ),
        suiteOf(group(2, caseBlock("site-search-US2-TC1-1"))),
      ),
    /site-search-US1-TC1 appears more than once in the durable suite; repair the durable suite first/,
  );
});

test("suite fold needs its date", () => {
  assert.throws(
    () =>
      mergeSuite(
        suiteOf(group(1, caseBlock("site-search-US1-TC1-1"))),
        suiteOf(group(2, caseBlock("site-search-US2-TC1-1"))),
        "site/search",
      ),
    /site\/search: a suite fold needs its date/,
  );
});

test("suite fold drops a None. placeholder once the other side lists items", () => {
  const merged = merge(
    suiteOf(
      group(1, caseBlock("site-search-US1-TC1-1")),
      "## Settled\n\n- Kept.",
    ),
    suiteOf(
      group(2, caseBlock("site-search-US2-TC1-1")),
      "## Settled\n\nNone.",
    ),
  );
  assert.match(merged, /## Settled\n\n- Kept\.\n$/);
});

test("suite fold refuses a case older than the durable revision", () => {
  assert.throws(
    () =>
      merge(
        suiteOf(group(1, caseBlock("site-search-US1-TC2-2"))),
        suiteOf(group(1, caseBlock("site-search-US1-TC2-1"))),
      ),
    /site-search-US1-TC2-1 is an older revision than the durable suite's site-search-US1-TC2-2/,
  );
});

test("suite fold refuses a TC number the change's suite holds twice", () => {
  assert.throws(
    () =>
      merge(
        suiteOf(group(1, caseBlock("site-search-US1-TC1-1"))),
        suiteOf(
          group(
            1,
            caseBlock("site-search-US1-TC2-1"),
            caseBlock("site-search-US1-TC2-2"),
          ),
        ),
      ),
    /test case site-search-US1-TC2 appears more than once in the change's suite/,
  );
});

test("suite fold lapses the Reviewed line of an approved suite it adds a draft to", () => {
  const merged = merge(
    reviewed(suiteOf(group(1, caseBlock("site-search-US1-TC1-1", "actual")))),
    suiteOf(group(2, caseBlock("site-search-US2-TC1-1"))),
  );
  assert.match(merged, /^\*\*Status:\*\* reopened$/m);
  assert.match(
    merged,
    /^\*\*Reviewed:\*\* 2026-09-29, tcs-rules r4, lapsed 2026-10-02$/m,
  );
  assert.equal(
    merge(merged, suiteOf(group(2, caseBlock("site-search-US2-TC1-1")))),
    merged,
  );
});

test("suite fold keeps the Reviewed line of a suite that stays approved", () => {
  const merged = merge(
    reviewed(suiteOf(group(1, caseBlock("site-search-US1-TC1-1", "actual")))),
    suiteOf(group(2, caseBlock("site-search-US2-TC1-1", "actual"))),
  );
  assert.match(merged, /^\*\*Status:\*\* approved$/m);
  assert.match(merged, /^\*\*Reviewed:\*\* 2026-09-29, tcs-rules r4$/m);
});

test("suite fold keeps a journey's added cases inside its rules", () => {
  const merged = merge(
    suiteOf(
      group(1, caseBlock("site-search-US1-TC1-1"), "---"),
      group(2, caseBlock("site-search-US2-TC1-1")),
    ),
    suiteOf(group(1, caseBlock("site-search-US1-TC2-1"))),
  );
  assert.match(
    merged,
    /Body of site-search-US1-TC1-1\.\n\n### site-search-US1-TC2-1[\s\S]*Body of site-search-US1-TC2-1\.\n\n---\n\n## site-search-US2/,
  );
});

test("suite fold renders the delta's Background before the first journey", () => {
  const merged = merge(
    suiteOf(group(1, caseBlock("site-search-US1-TC1-1"))),
    suiteOf(
      "## Background\n\nEvery case signs in.",
      group(2, caseBlock("site-search-US2-TC1-1")),
    ),
  );
  assert.match(
    merged,
    /\*\*Status:\*\* pending-review\n\n## Background\n\nEvery case signs in\.\n\n## site-search-US1/,
  );
});

test("suite fold appends Background paragraphs the durable lacks, once", () => {
  const merged = merge(
    suiteOf(
      "## Background\n\nShared seed.",
      group(1, caseBlock("site-search-US1-TC1-1")),
    ),
    suiteOf(
      "## Background\n\nShared seed.\n\nGrading seed.",
      group(2, caseBlock("site-search-US2-TC1-1")),
    ),
  );
  assert.match(
    merged,
    /## Background\n\nShared seed\.\n\nGrading seed\.\n\n## site-search-US1/,
  );
  assert.equal(merged.match(/Shared seed/g).length, 1);
});

test("suite fold drops the Settled placeholder once a real item exists", () => {
  const placeholder = "## Settled\n\n*None yet — suite pending review.*";
  const real = "## Settled\n\n- An unset window reads undecided.";
  const durable = (settled) =>
    suiteOf(group(1, caseBlock("site-search-US1-TC1-1")), settled);
  const delta = (settled) =>
    suiteOf(group(2, caseBlock("site-search-US2-TC1-1")), settled);
  for (const [current, next] of [
    [real, placeholder],
    [placeholder, real],
  ]) {
    const merged = merge(durable(current), delta(next));
    assert.match(
      merged,
      /## Settled\n\n- An unset window reads undecided\.\n$/,
    );
    assert.doesNotMatch(merged, /None yet/);
  }
  assert.equal(
    merge(durable(placeholder), delta(placeholder)).match(/None yet/g).length,
    1,
  );
});

test("suite fold keeps each reconciliation run whole under one Manual table", () => {
  const recon = (run, row) =>
    `## Reconciliation\n\n${run}\n\n| Case | Disposition |\n| --- | --- |\n| ${row} | Covered |\n\n### Manual\n\n| Manual | Why |\n| --- | --- |\n| ${row} | A person reads it |`;
  const merged = merge(
    suiteOf(
      group(1, caseBlock("site-search-US1-TC1-1")),
      recon("**Run:** first.", "`site-search-US1-TC1-1`"),
    ),
    suiteOf(
      group(2, caseBlock("site-search-US2-TC1-1")),
      recon("Run: second.", "`site-search-US2-TC1-1`"),
    ),
  );
  const reconciliation = merged.slice(merged.indexOf("## Reconciliation"));
  assert.equal(
    reconciliation,
    "## Reconciliation\n\n**Run:** first.\n\n| Case | Disposition |\n| --- | --- |\n| `site-search-US1-TC1-1` | Covered |\n\nRun: second.\n\n| Case | Disposition |\n| --- | --- |\n| `site-search-US2-TC1-1` | Covered |\n\n### Manual\n\n| Manual | Why |\n| --- | --- |\n| `site-search-US1-TC1-1` | A person reads it |\n| `site-search-US2-TC1-1` | A person reads it |\n",
  );
});

test("suite fold is idempotent over its own output", () => {
  const delta = readFileSync(
    new URL("./fixtures/fold-suite/delta.md", import.meta.url),
    "utf8",
  );
  const durable = readFileSync(
    new URL("./fixtures/fold-suite/durable.md", import.meta.url),
    "utf8",
  );
  const merged = merge(durable, delta);
  assert.equal(merge(merged, delta), merged);
});

test("suite fold refuses a level-2 section it does not know", () => {
  assert.throws(
    () =>
      merge(
        suiteOf(group(1, caseBlock("site-search-US1-TC1-1"))),
        suiteOf(
          group(2, caseBlock("site-search-US2-TC1-1")),
          "## Notes\n\nStray.",
        ),
      ),
    /site\/search: test-case suite section `## Notes` has no fold rule/,
  );
});

test("suite fold orders journey groups by US number", () => {
  const merged = merge(
    suiteOf(
      group(1, caseBlock("site-search-US1-TC1-1")),
      group(3, caseBlock("site-search-US3-TC1-1")),
      group(5, caseBlock("site-search-US5-TC1-1")),
    ),
    suiteOf(group(4, caseBlock("site-search-US4-TC1-1"))),
  );
  const order = [...merged.matchAll(/^## site-search-US(\d+)/gm)].map(
    (one) => one[1],
  );
  assert.deepEqual(order, ["1", "3", "4", "5"]);
});

test("suite fold derives the file Status from the merged cases", () => {
  const merged = merge(
    suiteOf(group(1, caseBlock("site-search-US1-TC1-1"))),
    suiteOf(group(2, caseBlock("site-search-US2-TC1-1", "actual"))).replace(
      "pending-review",
      "approved",
    ),
  );
  assert.match(merged, /^\*\*Status:\*\* in-review$/m);
});

test("suite fold keeps the later dated header line and the rule closing the journeys", () => {
  const styled = (date) =>
    `**Status:** pending-review\n**Drafts styled:** ${date}, tcs-rules r3`;
  const current = suiteOf(
    group(1, caseBlock("site-search-US1-TC1-1"), "---"),
    "## Settled\n\n- Kept.",
  ).replace("**Status:** pending-review", styled("2026-09-29"));
  const delta = suiteOf(group(2, caseBlock("site-search-US2-TC1-1"))).replace(
    "**Status:** pending-review",
    styled("2026-09-22"),
  );
  const merged = merge(current, delta);
  assert.match(merged, /^\*\*Drafts styled:\*\* 2026-09-29/m);
  assert.match(
    merged,
    /Body of site-search-US1-TC1-1\.\n\n---\n\n## site-search-US2[\s\S]*Body of site-search-US2-TC1-1\.\n\n---\n\n## Settled/,
  );
});

test("suite fold takes the delta's header line unless it is dated earlier", () => {
  const withLine = (text, line) =>
    text.replace(
      "**Status:** pending-review",
      `**Status:** pending-review\n${line}`,
    );
  const durable = suiteOf(group(1, caseBlock("site-search-US1-TC1-1")));
  const delta = suiteOf(group(2, caseBlock("site-search-US2-TC1-1")));
  for (const [current, next, kept] of [
    [
      "**Drafts styled:** 2026-09-29, tcs-rules r3",
      "**Drafts styled:** 2026-09-29, tcs-rules r4",
      "r4",
    ],
    [
      "**Drafts styled:** 2026-09-29, tcs-rules r3",
      "**Drafts styled:** 2026-09-22, tcs-rules r4",
      "r3",
    ],
    ["**Note:** durable", "**Note:** delta", "delta"],
  ]) {
    const merged = merge(withLine(durable, current), withLine(delta, next));
    assert.ok(merged.includes(kept), `${next} over ${current} keeps ${kept}`);
  }
});

test("suite fold replaces a Manual row by its case id, backticks or not", () => {
  const recon = (cell, why) =>
    `## Reconciliation\n\nRun: one.\n\n### Manual\n\n| Manual | Why |\n| --- | --- |\n| ${cell} | ${why} |\n| \`site-search-US9-TC1-1\` | Untouched |`;
  for (const cell of ["`site-search-US1-TC1-1`", "site-search-US1-TC1-1"]) {
    const merged = merge(
      suiteOf(
        group(1, caseBlock("site-search-US1-TC1-1")),
        recon("`site-search-US1-TC1-1`", "Old reason"),
      ),
      suiteOf(
        group(2, caseBlock("site-search-US2-TC1-1")),
        recon(cell, "New reason"),
      ),
    );
    assert.match(
      merged,
      /\| Manual \| Why \|\n\| --- \| --- \|\n\| \S+ \| New reason \|\n\| `site-search-US9-TC1-1` \| Untouched \|\n$/,
    );
    assert.doesNotMatch(merged, /Old reason/);
  }
});

test("suite fold reads CRLF input as LF", () => {
  const durable = suiteOf(
    group(1, caseBlock("site-search-US1-TC1-1")),
    "## Settled\n\n- Kept.",
  );
  const delta = suiteOf(
    group(2, caseBlock("site-search-US2-TC1-1")),
    "## Settled\n\n- Added.",
  );
  const crlf = (text) => text.replace(/\n/g, "\r\n");
  assert.equal(merge(crlf(durable), crlf(delta)), merge(durable, delta));
  assert.doesNotMatch(merge(crlf(durable), crlf(delta)), /\r/);
});

test("suite fold keeps the durable reconciliation when the delta has none, and adds Manual to one without", () => {
  const durable = suiteOf(
    group(1, caseBlock("site-search-US1-TC1-1")),
    "## Reconciliation\n\nRun: one.",
  );
  assert.match(
    merge(durable, suiteOf(group(2, caseBlock("site-search-US2-TC1-1")))),
    /## Reconciliation\n\nRun: one\.\n$/,
  );
  assert.match(
    merge(
      durable,
      suiteOf(
        group(2, caseBlock("site-search-US2-TC1-1")),
        "## Reconciliation\n\nRun: two.\n\n### Manual\n\n| Manual | Why |\n| --- | --- |\n| `site-search-US2-TC1-1` | Read |",
      ),
    ),
    /## Reconciliation\n\nRun: one\.\n\nRun: two\.\n\n### Manual\n\n\| Manual \| Why \|\n\| --- \| --- \|\n\| `site-search-US2-TC1-1` \| Read \|\n$/,
  );
});

test("suite fold drops the Raised placeholder and keeps reworded text beside the old", () => {
  const merged = merge(
    suiteOf(
      "## Background\n\nSeed one.",
      group(1, caseBlock("site-search-US1-TC1-1")),
      "## Raised\n\n*None yet — suite pending review.*\n\n## Settled\n\n- Old wording.",
    ),
    suiteOf(
      "## Background\n\nSeed one, reworded.",
      group(2, caseBlock("site-search-US2-TC1-1")),
      "## Raised\n\n- A question.\n\n## Settled\n\n- New wording.",
    ),
  );
  assert.match(merged, /## Background\n\nSeed one\.\n\nSeed one, reworded\.\n/);
  assert.match(
    merged,
    /## Raised\n\n- A question\.\n\n## Settled\n\n- Old wording\.\n- New wording\.\n$/,
  );
});

test("suite fold of the vault erasure suite with grading's delta keeps every section whole", () => {
  const read = (name) =>
    readFileSync(
      new URL(`./fixtures/fold-suite/${name}`, import.meta.url),
      "utf8",
    );
  const merged = merge(read("durable.md"), read("delta.md"));
  const headings = [...merged.matchAll(/^##? (\S+?)(?::|$)/gm)].map((one) =>
    one[1].replace(/^grade10-site-vault-retention-and-erasure-/, ""),
  );
  assert.ok(
    merged.startsWith(
      "# grade10-site/vault/retention-and-erasure Test Cases\n\n**Status:** in-review\n**Drafts styled:** 2026-09-29, tcs-rules r4\n\n## Background",
    ),
  );
  assert.deepEqual(headings, [
    "Background",
    "US1",
    "US2",
    "US3",
    "US4",
    "US5",
    "Settled",
    "Reconciliation",
  ]);
  assert.match(merged, /^\*\*Status:\*\* in-review$/m);
  assert.doesNotMatch(merged, /None yet/);
  assert.equal(merged.match(/^Run: 2026-09-22/gm).length, 2);
  assert.match(merged, /walked here and given cases\.\n\n\| Case or scenario/);
  assert.match(
    merged,
    /reads the history keeping its entries and losing the person \|\n\nRun: 2026-09-22/,
  );
  assert.equal(merged.match(/^### Manual$/gm).length, 1);
  assert.equal(merged.match(/^\| Manual \| Why \|$/gm).length, 1);
  const manual = merged.slice(merged.indexOf("### Manual"));
  assert.doesNotMatch(manual, /\| Covered/);
  assert.equal(manual.match(/^\| `/gm).length, 12);
  assert.match(
    merged,
    /\n\n---\n\n## grade10-site-vault-retention-and-erasure-US5/,
  );
});

const featureSpec = (body) =>
  `# Roles\n\n## Purpose\n\nRoles grant.\n\n## Feature set\n\n${body}\n## Requirements\n\n### Requirement: Roles\n\nThe system SHALL grant.\n`;
const foldFeatures = (durable, delta) =>
  mergeFeatureSet(
    featureSpec(durable),
    `# Roles\n\n## Feature set\n\n${delta}\n## MODIFIED Requirements\n`,
    "shared/auth/roles",
    null,
  );

test("feature set fold replaces the durable line carrying the delta line's label, in place", () => {
  const merged = foldFeatures(
    "- Closed role set\n  - Named roles: user, admin\n  - Unknown: dropped\n- **Grants**\n  - **Refund** — separate from settlement,\n    and audited\n  - Stacking: roles stack\n",
    "- Closed role set\n  - Named roles: user, staff, admin\n- **Grants**\n  - **Refund** — separate from settlement\n",
  );
  assert.match(
    merged,
    /## Feature set\n\n- Closed role set\n {2}- Named roles: user, staff, admin\n {2}- Unknown: dropped\n- \*\*Grants\*\*\n {2}- \*\*Refund\*\* — separate from settlement\n {2}- Stacking: roles stack\n\n## Requirements/,
  );
  assert.doesNotMatch(merged, /user, admin|and audited/);
});

test("feature set fold adds an unlabelled line and a new label beside the durable ones", () => {
  const merged = foldFeatures(
    "- Closed role set\n  - Named roles: user, admin\n  - roles never widen\n",
    "- Closed role set\n  - roles never widen\n  - roles are closed\n  - Unknown: dropped\n",
  );
  assert.match(
    merged,
    /- Closed role set\n {2}- Named roles: user, admin\n {2}- roles never widen\n {2}- roles are closed\n {2}- Unknown: dropped\n/,
  );
});

test("feature set fold is idempotent over its own output", () => {
  const delta =
    "- Closed role set\n  - Named roles: user, staff, admin\n- New group\n  - Fresh: line\n";
  const once = foldFeatures(
    "- Closed role set\n  - Named roles: user, admin\n",
    delta,
  );
  const twice = mergeFeatureSet(
    once,
    `# Roles\n\n## Feature set\n\n${delta}`,
    "shared/auth/roles",
    null,
  );
  assert.equal(twice, once);
});

test("feature set fold refuses a label the durable group holds twice", () => {
  assert.throws(
    () =>
      foldFeatures(
        "- Closed role set\n  - Named roles: user\n  - Named roles: admin\n",
        "- Closed role set\n  - Named roles: user, admin\n",
      ),
    /shared\/auth\/roles: Feature set group "- Closed role set" holds label "Named roles" more than once in the durable spec/,
  );
});

test("feature set fold refuses a label the delta group carries twice", () => {
  assert.throws(
    () =>
      foldFeatures(
        "- Closed role set\n  - Named roles: user\n",
        "- Closed role set\n  - Named roles: user, staff\n  - Named roles: admin\n",
      ),
    /holds label "Named roles" more than once in the delta spec/,
  );
});

test("feature set fold reads only a colon followed by a space as a label", () => {
  const merged = foldFeatures(
    "- Links\n  - See https://a.example\n  - Create with `user:create`\n  - **Opens:** 09:00 daily\n",
    "- Links\n  - See https://b.example\n  - Create with `user:delete`\n  - **Opens:** 10:00 daily\n",
  );
  assert.match(
    merged,
    /- Links\n {2}- See https:\/\/a\.example\n {2}- Create with `user:create`\n {2}- \*\*Opens:\*\* 10:00 daily\n {2}- See https:\/\/b\.example\n {2}- Create with `user:delete`\n/,
  );
});
