import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { buildIndex } from "../src/api/derive";
import type { ChangeDocument, ChangeEntry, Snapshot } from "../src/api/types";
import {
  changeEntry,
  pageEntry,
  snapshotOf,
  specEntry,
} from "./manual-fixture";

/**
 * One change as a page: one tab per artifact its schema asks for, the written
 * ones open, and the delta read as the contract it proposes. What used to be
 * a board card thirty screens into `/in-flight`.
 */

const SPEC = "demo-product/alpha";

const held = vi.hoisted(() => ({
  index: undefined as unknown,
  document: { status: "loading" } as unknown,
}));

vi.mock("../src/api/use-manual-index", () => ({
  useManualIndex: () => held.index,
}));
vi.mock("../src/editor/session", () => ({
  useEditorSession: () => ({ store: null }),
}));
vi.mock("../src/api/use-archive", () => ({
  useArchive: () => ({ status: "loading" }),
}));
vi.mock("../src/api/use-change-document", () => ({
  useChangeDocument: () => held.document,
}));

const { ChangePage } = await import("../src/pages/change-page");

const alpha = specEntry(SPEC, ["Points expire"]);
alpha.requirements[0].text = "Points last a year.";
alpha.requirements[0].scenarios = [
  { id: "alpha-SC-01", name: "A year passes", text: "- **THEN** they expire" },
];

const change: ChangeEntry = changeEntry(
  "pos",
  [
    {
      spec: SPEC,
      kinds: ["ADDED", "MODIFIED"],
      requirements: [
        { name: "A gift card earns nothing", kind: "added" },
        { name: "Points expire", kind: "modified" },
      ],
    },
  ],
  {
    schema: "grade10-planning",
    title: "Point of sale",
    why: "Collectors who buy in the shop are anonymous guests.",
    author: "echo",
    taskGroups: [
      {
        title: "Contracts",
        repo: "grade10-spec",
        done: 1,
        total: 2,
        tasks: [
          { text: "1.1 Write the delta", done: true },
          { text: "1.2 Wire the till", done: false, owner: "sam" },
        ],
      },
    ],
  },
);

const document: ChangeDocument = {
  id: "pos",
  dir: "openspec/changes/pos",
  schema: "grade10-planning",
  schemaKnown: true,
  artifacts: [
    {
      name: "proposal",
      kind: "doc",
      path: "openspec/changes/pos/proposal.md",
      present: true,
      text: "# Point of sale\n\n## Why\n\nCollectors who buy in the shop are anonymous guests.\n\n## What Changes\n\n- **Staff spend points** on a member's behalf.\n",
    },
    { name: "specs", kind: "specs", present: true },
    { name: "user-journeys", kind: "journeys", present: true },
    { name: "test-cases", kind: "cases", present: false },
    {
      name: "ui-design",
      kind: "doc",
      path: "openspec/changes/pos/ui-design.md",
      present: false,
    },
    {
      name: "tech-design",
      kind: "doc",
      path: "openspec/changes/pos/tech-design.md",
      present: true,
      text: "# Design\n\n## Decisions\n\nThe till never blocks a sale.\n",
    },
    {
      name: "tasks",
      kind: "tasks",
      path: "openspec/changes/pos/tasks.md",
      present: true,
    },
  ],
  deltas: [
    {
      spec: SPEC,
      path: "openspec/changes/pos/specs/demo-product/alpha/spec.md",
      text: "# Alpha — delta\n\n## Purpose\n\nThe redemption mechanics the shop needs.\n",
      title: "Alpha — delta",
      purpose: "The redemption mechanics the shop needs.",
      featureSet: "- Per-unit rewards",
      journeys: [
        {
          id: "alpha-US-06",
          title: "Member redeems a per-unit reward",
          text: "**As a** member, **I want** one debit.",
          acceptedBy: ["alpha-SC-65"],
        },
      ],
      sections: [
        {
          kind: "added",
          requirements: [
            {
              name: "A gift card earns nothing",
              text: "Buying a gift card SHALL earn no points.",
              scenarios: [
                {
                  id: "alpha-SC-65",
                  name: "One redemption, one debit",
                  text: "- **WHEN** redeemed\n- **THEN** one debit",
                },
              ],
            },
          ],
        },
        {
          kind: "modified",
          requirements: [
            {
              name: "Points expire",
              text: "Points last two years.",
              scenarios: [],
            },
          ],
        },
      ],
    },
  ],
};

function snapshot(): Snapshot {
  return snapshotOf({
    config: {
      storybookBase: "",
      groups: [{ title: "Products", products: ["demo-product"] }],
      platform: [],
      guides: [],
    },
    taxonomy: { products: ["demo-product"], topics: [] },
    pages: [
      pageEntry("docs/prds/products/demo-product/index.md", {
        title: "Demo product",
      }),
      pageEntry("docs/prds/products/demo-product/alpha.md", {
        title: "Alpha",
        spec: SPEC,
      }),
    ],
    specs: [alpha],
    changes: [change],
  });
}

function render(
  url: string,
  state: unknown = { status: "ready", document },
): string {
  held.index = buildIndex(snapshot());
  held.document = state;
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route element={<ChangePage />} path="in-flight/:change" />
      </Routes>
    </MemoryRouter>,
  );
}

describe("the page's head", () => {
  const html = render("/in-flight/pos");

  it("wears the change's title, id, and lane", () => {
    expect(html).toContain("Point of sale");
    expect(html).toContain("openspec/changes/pos");
    expect(html).toContain(">in progress<");
  });

  it("keeps the board's facts and leaves the why to the Product tab", () => {
    expect(html).toContain("@echo");
    expect(html.match(/Collectors who buy in the shop/g)).toHaveLength(1);
    expect(html.indexOf("Collectors who buy in the shop")).toBeGreaterThan(
      html.indexOf('aria-label="Artifacts of this change"'),
    );
  });
});

describe("the artifacts row", () => {
  const html = render("/in-flight/pos");
  const tabs = [
    ...html.matchAll(/role="tab"[^>]*>(?:<svg.*?<\/svg>)?([^<]+)/g),
  ].map((match) => match[1]);

  it("names every artifact the schema asks for, in writing order", () => {
    expect(html).toContain('aria-label="Artifacts of this change"');
    expect(tabs).toEqual([
      "Product",
      "Requirements",
      "Journeys",
      "Test Cases",
      "UI",
      "Tech Design",
      "Tasks",
    ]);
  });

  it("keeps the missing one in its place, disabled and marked", () => {
    expect(html).toMatch(
      /aria-disabled="true"[^>]*role="tab"[^>]*>(?:<svg.*?<\/svg>)?UI<span[^>]*>missing/,
    );
    expect(html).toContain("ui-design.md is still to write");
    expect(html).toContain("Still to write: feature-tcs.md, ui-design.md");
  });

  it("counts what the requirements and the plan carry", () => {
    expect(html).toMatch(/Requirements<span[^>]*>1</);
    expect(html).toMatch(/Tasks<span[^>]*>1\/2</);
  });

  it("wears the schema the change was created under", () => {
    expect(html).toContain(">grade10-planning<");
  });

  it("says when the schema cannot say what is missing", () => {
    const loose = render("/in-flight/pos", {
      status: "ready",
      document: { ...document, schema: "spec-driven", schemaKnown: false },
    });
    expect(loose).toContain("not one this store defines");
    expect(loose).not.toContain("Still to write");
  });
});

describe("one tab per file the change has", () => {
  it("opens on the proposal, without its own title, and names the others", () => {
    const html = render("/in-flight/pos");

    expect(html).toContain("Staff spend points");
    expect(html).not.toContain('id="proposal-point-of-sale"');
    expect(html).toContain('id="proposal-why"');
    expect(html).toContain(">Product<");
    expect(html).toContain(">Requirements<");
    expect(html).toContain(">Journeys<");
    expect(html).toContain(">Tech Design<");
    expect(html).toContain(">Tasks<");
    expect(html).toContain("PM-driven proposal");
  });

  it("opens the tab the URL names", () => {
    const html = render("/in-flight/pos?tab=tech-design");

    expect(html).toContain("The till never blocks a sale.");
    expect(html).not.toContain("Staff spend points");
    expect(html).toContain("high-level design");
  });

  it("falls back to the first tab for one the change lacks", () => {
    expect(render("/in-flight/pos?tab=ui-design")).toContain(
      "Staff spend points",
    );
  });

  it("shows the plan group by group, open lines first", () => {
    const html = render("/in-flight/pos?tab=tasks");

    expect(html).toContain("Contracts · grade10-spec");
    expect(html).toContain("1.2 Wire the till");
    expect(html).toContain("@sam");
    expect(html).toContain("agent-driven implementation");
  });
});

describe("the delta as the contract it proposes", () => {
  const html = render("/in-flight/pos?tab=specs");

  it("reads purpose and feature set under the delta's title", () => {
    expect(html).toContain("Alpha — delta");
    expect(html).toContain("The redemption mechanics the shop needs.");
    expect(html).toContain("Per-unit rewards");
  });

  it("leaves the stories to the journeys tab", () => {
    expect(html).not.toContain("Member redeems a per-unit reward");
    const stories = render("/in-flight/pos?tab=user-journeys");
    expect(stories).toContain("alpha-US-06");
    expect(stories).toContain("Member redeems a per-unit reward");
    expect(stories).toContain("One redemption, one debit");
  });

  it("lists each section's rows with their kind", () => {
    expect(html).toContain("ADDED Requirements");
    expect(html).toContain("MODIFIED Requirements");
    expect(html).toContain("A gift card earns nothing");
    expect(html).toContain(">added<");
    expect(html).toContain(">modified<");
  });

  it("offers the two readings", () => {
    expect(html).toContain(">Contract<");
    expect(html).toContain(">Full<");
  });

  it("counts what the delta carries", () => {
    expect(html).toContain("2 requirements · 1 scenario");
  });
});

describe("a deep link into a delta", () => {
  it("opens the requirements whatever tab the link was copied from", () => {
    const html = render("/in-flight/pos?tab=proposal#alpha-SC-65");

    expect(html).toContain("ADDED Requirements");
    expect(html).not.toContain("Staff spend points");
  });
});

describe("while the files are not in hand", () => {
  it("still shows the board's facts and says it is loading", () => {
    const html = render("/in-flight/pos", { status: "loading" });

    expect(html).toContain("Point of sale");
    expect(html).toContain('aria-busy="true"');
    expect(html).not.toContain("Artifacts");
  });

  it("says when they could not be read, and still reads the why", () => {
    const html = render("/in-flight/pos", {
      status: "unavailable",
      reason: "/api/change/pos answered 404 Not Found",
    });

    expect(html).toContain("Files unavailable");
    expect(html).toContain("answered 404");
    expect(html).toContain("Collectors who buy in the shop");
  });
});

describe("a change that is not in flight", () => {
  it("says so rather than rendering an empty page", () => {
    const html = render("/in-flight/never");

    expect(html).toContain("No such change");
    expect(html).toContain("never");
  });
});
