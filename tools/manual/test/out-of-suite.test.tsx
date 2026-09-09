import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { buildIndex } from "../src/api/derive";
import type { SpecEntry } from "../src/api/types";
import { BlockScopeProvider } from "../src/blocks/block-scope";
import { CasesBlockView } from "../src/blocks/cases-block";
import { NO_GIT } from "../src/store/git.mts";
import { readSpecs } from "../src/store/read-specs.mts";
import { snapshotOf } from "./manual-fixture";
import { writeStore } from "./tmp-store";

/** `**Out of suite:**` is how a hole is closed deliberately. The reader parsed
 * it and dropped it on the floor, so every screen counted a decision as a gap
 * and the number stopped being a task list. */

const SPEC = "demo-product/alpha";

const spec = [
  "# Alpha Specification",
  "",
  "## Purpose",
  "",
  "Alpha does things.",
  "",
  "## Requirements",
  "",
  "### Requirement: It works",
  "",
  "It SHALL work.",
  "",
  "#### Scenario: alpha-SC-01 - The thing happens",
  "",
  "- **THEN** it happens",
  "",
  "#### Scenario: alpha-SC-02 - The rare thing happens",
  "",
  "- **THEN** it happens rarely",
  "",
  "#### Scenario: alpha-SC-03 - The impossible thing",
  "",
  "- **THEN** nobody can stage it",
  "",
].join("\n");

const cases = [
  "# Alpha Test Cases",
  "",
  "**Status:** pending-review",
  "",
  "**Out of suite:** alpha-SC-03",
  "",
  "## alpha-US-01: Someone does the thing",
  "",
  "### alpha-TC-01: It does the thing",
  "",
  "**Properties:**",
  "",
  "- **Status:** draft",
  "- **Trace:** alpha-SC-01",
  "",
].join("\n");

function readAlpha(): SpecEntry {
  const root = writeStore({
    "openspec/specs/demo-product/alpha/spec.md": spec,
    "openspec/specs/demo-product/alpha/feature-tcs.md": cases,
  });
  return readSpecs(root, NO_GIT)[0];
}

describe("what the reader does with the list", () => {
  it("carries it onto the entry, where every screen can subtract it", () => {
    expect(readAlpha().outOfSuite).toEqual(["alpha-SC-03"]);
  });

  it("says nothing at all when a suite lists none", () => {
    const root = writeStore({
      "openspec/specs/demo-product/alpha/spec.md": spec,
      "openspec/specs/demo-product/alpha/feature-tcs.md": cases.replace(
        "**Out of suite:** alpha-SC-03\n\n",
        "",
      ),
    });

    expect(readSpecs(root, NO_GIT)[0].outOfSuite).toBeUndefined();
  });
});

describe("what the cases block says about it", () => {
  const html = renderToStaticMarkup(
    <MemoryRouter>
      <BlockScopeProvider
        value={{
          index: buildIndex(snapshotOf({ specs: [readAlpha()] })),
          pagePath: "docs/prds/products/demo-product/alpha.md",
        }}
      >
        <CasesBlockView block={{ type: "cases", id: SPEC }} />
      </BlockScopeProvider>
    </MemoryRouter>,
  );

  it("counts the deliberate hole as its own thing, never as untraced", () => {
    expect(html).toContain("1 scenarios traced");
    expect(html).toContain("1 untraced");
    expect(html).toContain("1 out of suite");
  });

  it("names the ids behind the number rather than only counting them", () => {
    expect(html).toContain(
      "Scenarios the suite deliberately leaves uncovered: alpha-SC-03",
    );
    expect(html).toContain('aria-expanded="false"');
  });
});
