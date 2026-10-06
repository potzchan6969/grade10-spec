import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

export function sandbox() {
  const root = mkdtempSync(join(tmpdir(), "spec-accept-"));
  const files = {
    "openspec/changes/build-alpha/.openspec.yaml": "schema: grade10-planning\n",
    "openspec/changes/build-alpha/proposal.md":
      "# Build alpha\n\n## Why\n\nLet a reader search.\n\n## References\n\n- [Scope](../../../docs/prds/products/site/alpha.md#scope)\n",
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
      "---\ntitle: Alpha\n---\n\n## Scope\n\nSearch results stay within the selected capability.\n\n## Measurement\n\nCount successful searches.\n",
  };
  for (const [path, content] of Object.entries(files)) {
    const target = join(root, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
  }
  return { root, files };
}
