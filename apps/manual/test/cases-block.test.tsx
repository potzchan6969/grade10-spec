import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { buildIndex } from "../src/api/derive";
import type { SpecEntry, TestCase, TestSuiteStatus } from "../src/api/types";
import { BlockScopeProvider } from "../src/blocks/block-scope";
import { CasesBlockView } from "../src/blocks/cases-block";
import { snapshotOf } from "./manual-fixture";

const SPEC = "demo-product/alpha";

const spec = (
  testCases: TestCase[],
  testCasesStatus?: TestSuiteStatus,
): SpecEntry => ({
  id: SPEC,
  title: SPEC,
  purpose: "",
  requirements: [
    {
      name: "Alpha does things",
      text: "",
      scenarios: [{ id: "alpha-SC-01", name: "The thing happens", text: "" }],
    },
  ],
  testCases,
  ...(testCasesStatus ? { testCasesStatus } : {}),
});

const testCase = (id: string, status: TestCase["status"]): TestCase => ({
  id,
  title: `Case ${id}`,
  traces: ["alpha-SC-01"],
  status,
});

function render(entry: SpecEntry): string {
  const index = buildIndex(snapshotOf({ specs: [entry] }));
  return renderToStaticMarkup(
    <MemoryRouter>
      <BlockScopeProvider
        value={{ index, pagePath: "manual/products/demo-product/alpha.md" }}
      >
        <CasesBlockView block={{ type: "cases", id: SPEC }} />
      </BlockScopeProvider>
    </MemoryRouter>,
  );
}

describe("what a suite says about its own review state", () => {
  it("shows a pending-review file in the warning colour, never the approved one", () => {
    const html = render(
      spec([testCase("alpha-TC-01", "draft")], "pending-review"),
    );

    expect(html).toContain("pending-review");
    expect(html).toContain("bg-warning");
    expect(html).not.toContain("bg-success");
  });

  it("shows an approved file as approved", () => {
    const html = render(spec([testCase("alpha-TC-01", "actual")], "approved"));

    expect(html).toContain("approved");
    expect(html).toContain("bg-success");
  });
});

describe("what a case says about itself", () => {
  it("marks a draft unreviewed rather than leaving it bare", () => {
    const html = render(
      spec([testCase("alpha-TC-01", "draft")], "pending-review"),
    );

    expect(html).toContain(">draft<");
    expect(html).toContain("bg-warning");
  });

  it("strikes a deprecated case out and mutes its title", () => {
    const html = render(
      spec([testCase("alpha-TC-01", "deprecated")], "approved"),
    );

    expect(html).toContain(">deprecated<");
    expect(html).toContain("line-through");
  });

  it("gives every case its own chip", () => {
    const html = render(
      spec(
        [
          testCase("alpha-TC-01", "draft"),
          testCase("alpha-TC-02", "actual"),
          testCase("alpha-TC-03", "deprecated"),
        ],
        "pending-review",
      ),
    );

    for (const status of ["draft", "actual", "deprecated"]) {
      expect(html).toContain(`>${status}<`);
    }
  });
});
