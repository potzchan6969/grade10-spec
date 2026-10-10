import assert from "node:assert/strict";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { buildReviewScope } from "./review-scope.mjs";

function fixture({ overlap = false, frontmatter = true } = {}) {
  const root = mkdtempSync(join(tmpdir(), "review-scope-"));
  const files = {
    "openspec/changes/build-alpha/.openspec.yaml": "schema: grade10-planning\n",
    "openspec/changes/build-alpha/proposal.md":
      "# Build alpha\n\n[Product decisions](docs/prds/products/site/alpha.md#product-decisions)\n",
    "openspec/changes/build-alpha/decisions.md": "## Decisions\n",
    "openspec/changes/build-alpha/tech-design.md": "# Technical design\n",
    "openspec/changes/build-alpha/tasks.md": "## 1. Build\n",
    "openspec/changes/build-alpha/specs/site/search/spec.md":
      "# Search\n\n## Purpose\n\nReaders find items.\n\n## Feature set\n\n- Search\n\n## ADDED Requirements\n\n### Requirement: Search results\n\nThe system SHALL return matching items.\n\n<!-- trace:scenario id=site-search-SC-01 rev=1 -->\n#### Scenario: site-search-SC-01 - Results match\n\n- **WHEN** the reader searches\n- **THEN** matching items appear\n",
    "openspec/changes/build-alpha/specs/site/search/user-journeys.md":
      "# Search journeys\n\n**Walked by:** nobody on their own - the feature set routes its anchors.\n",
    "openspec/changes/build-alpha/specs/site/search/feature-tcs.md":
      "# Search cases\n\n## Reconciliation\n\n| Case | Disposition |\n| --- | --- |\n| none | folded |\n",
    "docs/prds/products/site/alpha.md":
      "# Alpha\n\n## Product decisions\n\nSearch stays local.\n",
  };
  if (frontmatter)
    files["docs/prds/products/site/search.md"] =
      "---\ntitle: Search\nspec: site/search\n---\n\n# Search\n";
  if (overlap)
    files["openspec/changes/build-beta/specs/site/search/spec.md"] =
      "# Search\n\n## MODIFIED Requirements\n\n### Requirement: Search results\n\nThe system SHALL return updated items.\n";
  for (const [path, text] of Object.entries(files)) {
    const target = join(root, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, text);
  }
  return root;
}

test("scope indexes PRD pages named by capability frontmatter", () => {
  const root = fixture({ frontmatter: false });
  const page = join(root, "docs/prds/products/site/search.md");
  mkdirSync(dirname(page), { recursive: true });
  writeFileSync(
    page,
    "---\ntitle: Search\nspec: site/search\n---\n\n# Search\n",
  );
  const scope = buildReviewScope(root, "build-alpha");
  assert.deepEqual(scope.pageLines, [
    {
      anchor: "product-decisions",
      file: "docs/prds/products/site/alpha.md",
      line: 3,
    },
    {
      anchor: null,
      file: "docs/prds/products/site/search.md",
      line: 3,
    },
  ]);
  assert.equal(scope.expandToFullSources, false);
});

test("missing capability PRD expands verified linked pages without inventing a path", () => {
  const root = fixture({ frontmatter: false });
  const scope = buildReviewScope(root, "build-alpha");
  assert.equal(scope.expandToFullSources, true);
  assert.deepEqual(
    scope.sourceExpansions.filter((one) => one.capability),
    [
      {
        scope: "capability",
        capability: "site/search",
        paths: ["docs/prds/products/site/alpha.md"],
        reason:
          "no PRD frontmatter page was indexed for capability: site/search",
      },
    ],
  );
  assert.equal(
    scope.sourceExpansions.some((one) => one.scope === "global"),
    false,
  );
  assert.equal(
    existsSync(join(root, "docs/prds/products/site/search.md")),
    false,
  );
  for (const item of scope.sourceExpansions)
    for (const path of item.paths ?? [])
      assert.ok(existsSync(join(root, path)));
  assert.match(
    scope.expansionReasons.join("\n"),
    /no PRD frontmatter page was indexed for capability: site\/search/,
  );
});

test("global PRD index failure is explicitly marked for full fallback", () => {
  const root = fixture({ frontmatter: false });
  const prds = join(root, "docs", "prds");
  rmSync(prds, { recursive: true, force: true });
  const scope = buildReviewScope(root, "build-alpha");
  assert.equal(scope.expandToFullSources, true);
  assert.ok(
    scope.sourceExpansions.some(
      (one) =>
        one.scope === "global" &&
        one.reason === "PRD frontmatter coverage could not be established",
    ),
  );
});

test("scope indexes requirements, linked page lines, and folded Purpose target", () => {
  const scope = buildReviewScope(fixture(), "build-alpha");
  assert.deepEqual(scope.changedRequirements, [
    {
      capability: "site/search",
      kind: "ADDED",
      name: "Search results",
      path: "openspec/changes/build-alpha/specs/site/search/spec.md",
      line: 13,
    },
  ]);
  assert.deepEqual(scope.pageLines, [
    {
      anchor: "product-decisions",
      file: "docs/prds/products/site/alpha.md",
      line: 3,
    },
    {
      anchor: null,
      file: "docs/prds/products/site/search.md",
      line: 3,
    },
  ]);
  assert.deepEqual(scope.durableTargets, [
    { path: "openspec/specs/site/search/feature-tcs.md", anchors: [] },
    {
      path: "openspec/specs/site/search/spec.md",
      anchors: ["Feature set", "Purpose", "Requirement: Search results"],
    },
    { path: "openspec/specs/site/search/user-journeys.md", anchors: [] },
  ]);
  assert.equal(scope.expandToFullSources, false);
});

test("an active overlap produces an explicit overlap-scoped expansion", () => {
  const scope = buildReviewScope(fixture({ overlap: true }), "build-alpha");
  assert.equal(scope.overlaps.length, 1);
  assert.equal(scope.overlaps[0].other[0].change, "build-beta");
  assert.equal(scope.expandToFullSources, true);
  assert.deepEqual(scope.sourceExpansions.at(-1), {
    scope: "overlap",
    capability: "site/search",
    paths: [
      "openspec/changes/build-alpha/specs/site/search/spec.md",
      "openspec/changes/build-beta/specs/site/search/spec.md",
    ],
    reason: "overlapping active deltas require both sources",
  });
  assert.match(scope.expansionReasons.join("\n"), /overlapping active deltas/);
});

test("source identity changes when a source input changes", () => {
  const root = fixture();
  const first = buildReviewScope(root, "build-alpha").sourceIdentity;
  writeFileSync(
    join(root, "openspec/changes/build-alpha/tasks.md"),
    "## 2. Build\n",
  );
  const second = buildReviewScope(root, "build-alpha").sourceIdentity;
  assert.notEqual(first.digest, second.digest);
  assert.equal(first.algorithm, "sha256");
  assert.equal(first.purpose, "review-scope-inputs");
  assert.ok(first.inputCount > 1);
});

test("source identity includes current change metadata and store config", () => {
  const root = fixture();
  const before = buildReviewScope(root, "build-alpha").sourceIdentity.digest;
  writeFileSync(
    join(root, "openspec/changes/build-alpha/.openspec.yaml"),
    "schema: grade10-planning\ndesign_waived: approved\n",
  );
  const afterMetadata = buildReviewScope(root, "build-alpha").sourceIdentity
    .digest;
  assert.notEqual(before, afterMetadata);

  writeFileSync(join(root, "openspec/config.yaml"), "schema: grade10\n");
  const afterConfig = buildReviewScope(root, "build-alpha").sourceIdentity
    .digest;
  assert.notEqual(afterMetadata, afterConfig);
});

test("source identity includes metadata for overlapping active changes", () => {
  const root = fixture({ overlap: true });
  const before = buildReviewScope(root, "build-alpha").sourceIdentity.digest;
  const metadata = join(root, "openspec/changes/build-beta/.openspec.yaml");
  mkdirSync(dirname(metadata), { recursive: true });
  writeFileSync(metadata, "schema: grade10-planning\n");
  const after = buildReviewScope(root, "build-alpha").sourceIdentity.digest;
  assert.notEqual(before, after);
});
