import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
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

test("scope expands when no capability frontmatter page can be indexed", () => {
  const scope = buildReviewScope(
    fixture({ frontmatter: false }),
    "build-alpha",
  );
  assert.equal(scope.expandToFullSources, true);
  assert.match(
    scope.expansionReasons.join("\n"),
    /no PRD frontmatter page was indexed for capability: site\/search/,
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

test("an active overlap is visible and forces full-source expansion", () => {
  const scope = buildReviewScope(fixture({ overlap: true }), "build-alpha");
  assert.equal(scope.overlaps.length, 1);
  assert.equal(scope.overlaps[0].other[0].change, "build-beta");
  assert.equal(scope.expandToFullSources, true);
  assert.match(scope.expansionReasons.join("\n"), /overlapping active deltas/);
});
