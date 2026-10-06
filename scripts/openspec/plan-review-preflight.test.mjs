import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { runPreflight } from "./plan-review-preflight.mjs";

function rootWithSpec(spec, { overlap = false } = {}) {
  const root = mkdtempSync(join(tmpdir(), "plan-review-preflight-"));
  const files = {
    "openspec/changes/build-alpha/proposal.md": "# Build alpha\n",
    "openspec/changes/build-alpha/decisions.md": "## Decisions\n",
    "openspec/changes/build-alpha/tech-design.md": "# Technical design\n",
    "openspec/changes/build-alpha/tasks.md": "## 1. Build\n",
    "openspec/changes/build-alpha/specs/site/search/spec.md": spec,
  };
  if (overlap)
    files["openspec/changes/build-beta/specs/site/search/spec.md"] = spec;
  for (const [path, text] of Object.entries(files)) {
    const target = join(root, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, text);
  }
  return root;
}

const valid = `# Search

## Purpose

Readers find items.

## Feature set

- Search

## MODIFIED Requirements

### Requirement: Search results

The system SHALL return matching items.

<!-- trace:scenario id=site-search-SC-01 rev=1 -->
#### Scenario: site-search-SC-01 - Results match

- **WHEN** the reader searches
- **THEN** matching items appear
`;

test("preflight passes a valid Dev draft when the strict validator passes", () => {
  const result = runPreflight(rootWithSpec(valid), "build-alpha", {
    validate: () => ({ status: 0, output: "" }),
  });
  assert.equal(result.status, "ready");
  assert.deepEqual(result.blockers, []);
});

test("preflight catches a missing adjacent trace marker before QA2", () => {
  const result = runPreflight(
    rootWithSpec(
      valid.replace("<!-- trace:scenario id=site-search-SC-01 rev=1 -->\n", ""),
    ),
    "build-alpha",
    { validate: () => ({ status: 0, output: "" }) },
  );
  assert.equal(result.status, "blocked");
  assert.equal(result.expandToFullSources, true);
  assert.match(result.blockers.join("\n"), /missing its adjacent trace marker/);
});

test("preflight keeps an agreeing active overlap as review scope", () => {
  const result = runPreflight(
    rootWithSpec(valid, { overlap: true }),
    "build-alpha",
    {
      validate: () => ({ status: 0, output: "" }),
    },
  );
  assert.equal(result.status, "ready");
  assert.deepEqual(result.blockers, []);
  assert.equal(result.overlaps.length, 1);
  assert.equal(result.expandToFullSources, true);
  assert.match(result.expansionReasons.join("\n"), /overlapping active deltas/);
});
