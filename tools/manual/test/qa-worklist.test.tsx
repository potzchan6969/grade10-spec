import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { buildIndex, changeSuiteRows, qaRows } from "../src/api/derive";
import type { SpecEntry, TestCase } from "../src/api/types";
import { changeEntry, pageEntry, snapshotOf } from "./manual-fixture";

/** The reviewer's worklist. A reviewer's only way to find work was knowing
 * which capability page to open; this is one derivation over the snapshot, and
 * its order is the whole point — hardest review first. */

const held = vi.hoisted(() => ({ index: undefined as unknown }));
vi.mock("../src/api/use-manual-index", () => ({
  useManualIndex: () => held.index,
}));

const { QaPage } = await import("../src/pages/qa-page");

const testCase = (
  id: string,
  status: TestCase["status"],
  traces: string[],
): TestCase => ({ id, title: `Case ${id}`, traces, status });

function spec(id: string, parts: Partial<SpecEntry> = {}): SpecEntry {
  const capability = id.split("/")[1];
  return {
    id,
    title: id,
    purpose: "",
    requirements: [
      {
        name: "It works",
        text: "",
        scenarios: [1, 2, 3].map((n) => ({
          id: `${capability}-SC-0${n}`,
          name: `Case ${n}`,
          text: "",
        })),
      },
    ],
    ...parts,
  };
}

const drafty = spec("demo/drafty", {
  testCasesStatus: "pending-review",
  testCases: [
    testCase("drafty-TC-01", "draft", ["drafty-SC-01"]),
    testCase("drafty-TC-02", "draft", ["drafty-SC-02"]),
  ],
});

const holey = spec("demo/holey", {
  journeys: [
    { id: "holey-US-01", title: "Somebody does it", text: "" },
  ],
  testCasesStatus: "approved",
  testCases: [testCase("holey-TC-01", "actual", ["holey-SC-01"])],
});

const settled = spec("demo/settled", {
  testCasesStatus: "approved",
  testCases: [1, 2, 3].map((n) =>
    testCase(`settled-TC-0${n}`, "actual", [`settled-SC-0${n}`]),
  ),
});

const journeysOnly = spec("demo/journeys-only", {
  journeys: [
    { id: "journeys-only-US-01", title: "Unproven", text: "" },
  ],
});

const quiet = spec("demo/quiet");

const index = buildIndex(
  snapshotOf({
    pages: [
      pageEntry("docs/prds/products/demo/holey.md", {
        title: "Holey",
        spec: "demo/holey",
      }),
    ],
    specs: [settled, holey, drafty, journeysOnly, quiet],
  }),
);
held.index = index;

describe("what the worklist is a list of", () => {
  const rows = qaRows(index);

  it("leaves out a capability that has claimed no acceptance at all", () => {
    expect(rows.map((row) => row.spec.id)).not.toContain("demo/quiet");
  });

  it("keeps a capability with journeys and no suite — that is the hole", () => {
    const row = rows.find((one) => one.spec.id === "demo/journeys-only");

    expect(row?.cases.total).toBe(0);
    expect(row?.suiteStatus).toBeUndefined();
    expect(row?.journeys).toBe(1);
  });

  /** Drafts are somebody standing behind nothing; after them, the biggest
   * hole. A capability with journeys and no suite at all is the biggest hole
   * there is. */
  it("puts the drafts first, then the widest hole, then what is settled", () => {
    expect(rows.map((row) => row.spec.id)).toEqual([
      "demo/drafty",
      "demo/journeys-only",
      "demo/holey",
      "demo/settled",
    ]);
  });

  it("counts cases by the status a reviewer acts on", () => {
    const row = rows[0];

    expect(row.cases).toEqual({
      draft: 2,
      actual: 0,
      deprecated: 0,
      total: 2,
    });
  });

  it("names the untraced ids rather than only counting them", () => {
    const row = rows.find((one) => one.spec.id === "demo/holey");

    expect(row?.untraced).toEqual(["holey-SC-02", "holey-SC-03"]);
    expect(row?.covered).toBe(1);
    expect(row?.countable).toBe(3);
  });

  /** A scenario the suite says it will not cover is not a hole; counting it as
   * one is how a coverage number stops being a task list. */
  it("subtracts what the suite deliberately leaves uncovered", () => {
    const exempt = buildIndex(
      snapshotOf({
        specs: [
          {
            ...holey,
            outOfSuite: ["holey-SC-02", "holey-SC-03"],
          },
        ],
      }),
    );
    const row = qaRows(exempt)[0];

    expect(row.untraced).toEqual([]);
    expect(row.countable).toBe(1);
    expect(row.outOfSuite).toHaveLength(2);
  });

  it("puts a suite nobody can read above every other kind of work", () => {
    const broken = buildIndex(
      snapshotOf({
        specs: [
          drafty,
          {
            ...settled,
            testCases: undefined,
            testCasesError: {
              file: "openspec/specs/demo/settled/feature-tcs.md",
              message: "a test-case file states `**Status:**`",
            },
          },
        ],
      }),
    );

    expect(qaRows(broken)[0].spec.id).toBe("demo/settled");
  });
});

/** A retired case's traces are history, not coverage — the number has to be
 * able to go down when a scenario loses its last living case. */
describe("coverage after a retirement", () => {
  it("stops counting a deprecated case's traces", () => {
    const retired = buildIndex(
      snapshotOf({
        specs: [
          spec("demo/holey", {
            testCasesStatus: "pending-review",
            testCases: [testCase("holey-TC-01", "deprecated", ["holey-SC-01"])],
          }),
        ],
      }),
    );
    const row = qaRows(retired)[0];

    expect(row.covered).toBe(0);
    expect(row.untraced).toContain("holey-SC-01");
  });
});

/** The suite riding an in-flight change was invisible on every QA surface —
 * the one place a PM explicitly asks for a review had no worklist entry. */
describe("suites riding in-flight changes", () => {
  const carrying = changeEntry("add-storage-plans", [], {
    title: "Paid storage plans",
    suites: [
      {
        spec: "vault/storage-billing",
        status: "pending-review",
        cases: { draft: 14, actual: 5, deprecated: 0, total: 19 },
      },
    ],
  });
  const withChange = buildIndex(
    snapshotOf({ specs: [settled], changes: [carrying] }),
  );

  it("lists each change suite with its counts, drafts first", () => {
    const rows = changeSuiteRows(withChange);

    expect(rows).toHaveLength(1);
    expect(rows[0].suite.spec).toBe("vault/storage-billing");
    expect(rows[0].change.id).toBe("add-storage-plans");
  });

  it("renders them on the page, linked to the change, with the review command", () => {
    held.index = withChange;
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <QaPage />
      </MemoryRouter>,
    );
    held.index = index;

    expect(html).toContain("In flight");
    expect(html).toContain('href="/in-flight/add-storage-plans"');
    expect(html).toContain("14 draft");
    expect(html).toContain("5 actual");
    expect(html).toContain("/tcs-review add-storage-plans");
  });
});

describe("the page it becomes", () => {
  const html = renderToStaticMarkup(
    <MemoryRouter>
      <QaPage />
    </MemoryRouter>,
  );

  it("names every capability with acceptance, and its counts", () => {
    expect(html).toContain("demo/drafty");
    expect(html).toContain("2 draft");
    expect(html).toContain("no suite");
    expect(html).toContain("pending-review");
  });

  it("links a row to its own page's shelf", () => {
    expect(html).toContain('href="/p/demo/holey#holey-TC-01"');
  });

  it("sends a capability with no page to where its id says it lives", () => {
    expect(html).toContain('href="/p/demo/drafty#drafty-TC-01"');
  });
});
