import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { buildIndex } from "../src/api/derive";
import type { ChangeEntry, Delta, Snapshot } from "../src/api/types";
import {
  changeEntry,
  pageEntry,
  snapshotOf,
  specEntry,
} from "./manual-fixture";

/** The board a weekly review runs from: four lanes, and cards that answer who
 * owns it, what it waits on, which box is open and what the delta will say. */

const SPEC = "demo-product/alpha";
const delta = (requirements: Delta["requirements"] = []): Delta => ({
  spec: SPEC,
  kinds: ["MODIFIED"],
  requirements,
});

const held = vi.hoisted(() => ({
  index: undefined as unknown,
  session: { store: null as unknown },
  archive: { status: "loading" } as unknown,
}));

vi.mock("../src/api/use-manual-index", () => ({
  useManualIndex: () => held.index,
}));
vi.mock("../src/editor/session", () => ({
  useEditorSession: () => held.session,
}));
vi.mock("../src/api/use-archive", () => ({
  useArchive: () => held.archive,
}));

const { InFlightPage } = await import("../src/pages/in-flight-page");

const alpha = specEntry(SPEC, ["Points expire"]);
alpha.requirements[0].text = "Points last a year.";
alpha.requirements[0].scenarios = [
  { id: "alpha-SC-01", name: "A year passes", text: "- **THEN** they expire" },
];

function snapshot(changes: ChangeEntry[]): Snapshot {
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
    changes,
  });
}

function render(changes: ChangeEntry[], archived: ChangeEntry[] = []): string {
  held.index = buildIndex(snapshot(changes));
  held.session = { store: {} };
  held.archive =
    archived.length > 0
      ? {
          status: "ready",
          archive: {
            generatedAt: "",
            storeHead: "",
            changes: archived,
          },
        }
      : { status: "loading" };
  return renderToStaticMarkup(
    <MemoryRouter>
      <InFlightPage />
    </MemoryRouter>,
  );
}

describe("the four lanes", () => {
  const idea = changeEntry("an-idea", [], { title: "Only a reason" });
  const specified = changeEntry("written-up", [delta()], {
    title: "Deltas, no plan",
  });
  const working = changeEntry("under-way", [delta()], {
    title: "Half built",
    taskGroups: [
      { title: "Contracts", repo: "grade10-spec", done: 1, total: 2 },
    ],
  });
  const done = changeEntry("finished", [delta()], {
    title: "Waiting on the archive",
    taskGroups: [
      { title: "Contracts", repo: "grade10-spec", done: 3, total: 3 },
    ],
  });

  it("names each lane and puts every change in exactly one", () => {
    const html = render([idea, specified, working, done]);

    for (const [lane, title] of [
      [">Proposed<", "Only a reason"],
      [">Specified<", "Deltas, no plan"],
      [">In progress<", "Half built"],
      [">Complete<", "Waiting on the archive"],
    ]) {
      expect(html).toContain(lane);
      expect(html).toContain(title);
    }
    expect(html.indexOf("Only a reason")).toBeLessThan(
      html.indexOf("Deltas, no plan"),
    );
  });

  /** Three changes have been fully checked off for months and wore the same
   * "in flight" badge as a 0/45 one. */
  it("says the complete lane is waiting on the archive", () => {
    expect(render([done])).toContain("waiting on the archive");
  });

  it("shows no lane it has nothing for", () => {
    const html = render([working]);

    expect(html).not.toContain(">Proposed<");
    expect(html).not.toContain(">Complete<");
  });
});

describe("what a card tells a review", () => {
  const blocked = changeEntry("pos", [delta()], {
    title: "Point of sale",
    owners: [],
    author: "echo",
    target: "2026-09-30",
    dependsOn: ["loyalty-rules", "shipped-already", "never-written"],
    taskGroups: [
      {
        title: "Contracts",
        repo: "grade10-spec",
        done: 1,
        total: 3,
        tasks: [
          { text: "2.3 Write the delta", done: true },
          { text: "2.4 Wire the till", done: false, owner: "sam" },
          { text: "2.5 Ship it", done: false },
        ],
      },
    ],
  });
  const blocker = changeEntry("loyalty-rules", [delta()], {
    title: "Loyalty rules",
  });
  const shipped = changeEntry("shipped-already", [], { status: "archived" });

  const html = render([blocked, blocker], [shipped]);

  it("says unclaimed out loud when nobody has picked it up", () => {
    expect(html).toContain("unclaimed");
    expect(html).toContain("@echo");
  });

  it("carries the target date", () => {
    expect(html).toContain("Blocked by");
    expect(html).toMatch(/Sep(tember)? 30, 2026/);
  });

  it("separates a blocking dependency from a shipped one, and names a lie", () => {
    expect(html).toContain("loyalty-rules");
    expect(html).toContain("in flight");
    expect(html).toContain("shipped");
    expect(html).toContain("never-written — names no change");
  });

  /** "1 of 3" is a number nobody can act on; 2.4 is the work. */
  it("shows the open task lines without being asked, and their owner", () => {
    expect(html).toContain("2.4 Wire the till");
    expect(html).toContain("2.5 Ship it");
    expect(html).toContain("@sam");
    expect(html).toContain("Show all 3");
  });
});

/** The loop's continuation used to live nowhere: its first casualty guessed a
 * skill name off a badge. Every lane but in-progress names its next action. */
describe("the loop's continuation on the card", () => {
  it("hands a proposed change to /planning-pm for its deltas", () => {
    const html = render([changeEntry("an-idea", [], {})]);
    expect(html).toContain("/planning-pm an-idea");
  });

  it("hands a specified change to /planning-dev for its delivery plan", () => {
    const html = render([changeEntry("written-up", [delta()], {})]);
    expect(html).toContain("/planning-dev written-up");
    expect(html).toContain("writes the delivery plan");
  });

  it("hands a complete change to /archive-change", () => {
    const html = render([
      changeEntry("finished", [delta()], {
        taskGroups: [
          { title: "Contracts", repo: "grade10-spec", done: 3, total: 3 },
        ],
      }),
    ]);
    expect(html).toContain("/archive-change finished");
  });

  it("offers /tcs-review while a suite holds drafts", () => {
    const html = render([
      changeEntry("specced", [delta()], {
        suites: [
          {
            spec: SPEC,
            status: "pending-review",
            cases: { draft: 3, actual: 1, deprecated: 0, total: 4 },
          },
        ],
      }),
    ]);
    expect(html).toContain("/tcs-review specced");
    expect(html).toContain("3 draft");
    expect(html).toContain("1 reviewed");
  });
});

/** The terminal board always printed this; the browser hiding it left three of
 * four "Complete" cards silently unarchivable. */
describe("where the change stands against the store's main", () => {
  it("says a complete change cannot archive off main", () => {
    const html = render([
      changeEntry("finished", [delta()], {
        taskGroups: [
          { title: "Contracts", repo: "grade10-spec", done: 3, total: 3 },
        ],
        mainState: { state: "unmerged", ref: "origin/main" },
      }),
    ]);
    expect(html).toContain("not on origin/main");
    expect(html).toContain("cannot be archived");
  });

  it("counts the artifacts a diverged change is ahead by", () => {
    const html = render([
      changeEntry("written-up", [delta()], {
        mainState: { state: "diverged", ref: "origin/main", files: 2 },
      }),
    ]);
    expect(html).toContain("2 artifact(s) ahead of origin/main");
  });
});

/** A promoted card that still read "unclaimed · proposed by" told its author
 * nothing had happened. */
describe("who promoted it", () => {
  it("names the promoter beside the proposer", () => {
    const html = render([
      changeEntry("written-up", [delta()], {
        author: "priya",
        promotedBy: "devon",
      }),
    ]);
    expect(html).toContain("@priya");
    expect(html).toContain("planned by");
    expect(html).toContain("@devon");
  });
});

describe("what a card says the change will change", () => {
  const modified = changeEntry("rewrite", [
    {
      spec: SPEC,
      kinds: ["MODIFIED"],
      requirements: [
        {
          name: "Points expire",
          kind: "modified",
          text: "### Requirement: Points expire\n\nPoints last two years.",
        },
      ],
    },
  ]);

  const added = changeEntry("introduce", [
    {
      spec: SPEC,
      kinds: ["ADDED"],
      requirements: [
        {
          name: "A gift card earns nothing",
          kind: "added",
          text: "### Requirement: A gift card earns nothing\n\nBuying a gift card SHALL earn no points.",
        },
      ],
    },
  ]);

  it("names every requirement row a delta touches, with its kind", () => {
    const html = render([modified, added]);

    expect(html).toContain("A gift card earns nothing");
    expect(html).toContain(">added<");
    expect(html).toContain(">modified<");
  });

  /** A specified change is the queue a lead promotes; what makes it promotable
   * is the delta, so a small one is open on arrival. */
  it("opens a specified change's delta and reads the ADDED text", () => {
    expect(render([added])).toContain(
      "Buying a gift card SHALL earn no points.",
    );
  });

  it("diffs a MODIFIED block against the durable requirement", () => {
    const html = render([modified]);

    expect(html).toContain("Points last two years.");
    expect(html).toContain("Points last a year.");
    expect(html).toContain("against the durable");
  });
});
