import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { buildIndex } from "../src/api/derive";
import type {
  ChangeEntry,
  Delta,
  SchemaArtifact,
  Snapshot,
  Stage,
} from "../src/api/types";
import { STORAGE } from "../src/editor/config";
import { findStoreRoot } from "../src/store/disk.mts";
import { schemaArtifacts } from "../src/store/read-schema.mts";
import {
  changeEntry,
  pageEntry,
  snapshotOf,
  specEntry,
} from "./manual-fixture";

/**
 * The board, state by state: the eight lanes, the mark and the move on the
 * five the agent drafts, the card's hand and its overlays, the filters and the
 * shelf. One case per `## States` bullet `ui-design.md` lists for the board,
 * named after the bullet, asserting the text the scenario it cites names.
 *
 * The schema is read from the store rather than restated: the artifact ids the
 * ladder and the card's behind chip are read against are the schema's, and a
 * second list here would drift from it inside a week.
 */

const storeRoot = findStoreRoot(fileURLToPath(new URL(".", import.meta.url)));
const ARTIFACTS: SchemaArtifact[] =
  schemaArtifacts(storeRoot, "grade10-planning") ?? [];

const SPEC = "demo-product/alpha";
const delta: Delta = { spec: SPEC, kinds: ["MODIFIED"], requirements: [] };

const HANDS = {
  pm: "robin",
  design: "dana",
  tech: "kim",
  dev: "sam",
  qa: "ari",
  release: "lee",
};

const WRITTEN = [
  "proposal",
  "decisions",
  "user-journeys",
  "ui-design",
  "tech-design",
  "specs",
  "test-cases",
  "tasks",
];

const group = (done: number, total: number) => ({
  title: "Contracts",
  repo: "grade10-spec",
  done,
  total,
});

/** Days ago as an instant, for the overlays that count days. */
function daysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

/** A change sitting in one stage, with every hand named and something ticked.
 * Its id follows its title, so two changes in one stage are two changes. */
function at(stage: Stage, extra: Partial<ChangeEntry> = {}): ChangeEntry {
  const title = extra.title ?? `The ${stage} change`;
  return changeEntry(title.toLowerCase().replace(/[^a-z0-9]+/g, "-"), [delta], {
    stage,
    hands: { ...HANDS },
    written: WRITTEN,
    taskGroups: [group(1, 3)],
    lastLanded: daysAgo(1),
    ...extra,
    title,
  });
}

const held = vi.hoisted(() => ({
  index: undefined as unknown,
  archive: { status: "loading" } as unknown,
  // A real `KeyStore`, the same one `useHandle` reads: setting a key here is
  // what a browser remembering a handle looks like, rather than mocking the
  // hook that reads it.
  store: new Map<string, string>(),
}));

vi.mock("../src/api/use-manual-index", () => ({
  useManualIndex: () => held.index,
}));
vi.mock("../src/editor/session", () => ({
  useEditorSession: () => ({ status: "ready", store: null }),
  browserKeyStore: {
    get: (key: string) => held.store.get(key) ?? null,
    set: (key: string, value: string) => {
      held.store.set(key, value);
    },
    remove: (key: string) => {
      held.store.delete(key);
    },
  },
}));
vi.mock("../src/api/use-archive", () => ({
  useArchive: () => held.archive,
}));

const { InFlightPage } = await import("../src/pages/in-flight-page");

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
    specs: [specEntry(SPEC, ["Points expire"])],
    schemas: { "grade10-planning": ARTIFACTS },
    changes,
  });
}

function render(
  changes: ChangeEntry[],
  options: { url?: string; archived?: ChangeEntry[]; handle?: string } = {},
): string {
  held.index = buildIndex(snapshot(changes));
  held.store.clear();
  if (options.handle !== undefined)
    held.store.set(STORAGE.handle, options.handle);
  held.archive =
    options.archived === undefined
      ? { status: "loading" }
      : {
          status: "ready",
          archive: {
            generatedAt: "",
            storeHead: "",
            changes: options.archived,
          },
        };
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[options.url ?? "/in-flight"]}>
      <InFlightPage />
    </MemoryRouter>,
  );
}

/** The chips one card wears, in the order the overlay table lists them. */
function overlaysOn(html: string): string[] {
  return [...html.matchAll(/data-overlay="([a-z]+)"/g)].map(
    (match) => match[1],
  );
}

/** Whether one lane arrived open, read off its own `aria-expanded` — the
 * tag `data-lane` sits on, found by its own boundaries rather than by
 * guessing which element name carries it. */
function laneOpen(html: string, stage: Stage): string | undefined {
  const at = html.indexOf(`data-lane="${stage}"`);
  if (at === -1) return undefined;
  const tag = html.slice(html.lastIndexOf("<", at), html.indexOf(">", at));
  return /aria-expanded="true"/.test(tag) ? "open" : "shut";
}

/** One lane's own markup, heading to the next lane. */
function lane(html: string, stage: Stage, next: Stage): string {
  return html.slice(
    html.indexOf(`data-lane="${stage}"`),
    html.indexOf(`data-lane="${next}"`),
  );
}

describe("the lanes", () => {
  it("shows eight lanes in stage order, the Archived one a heading naming the archive's count", () => {
    const html = render([at("planned")], {
      archived: [
        changeEntry("folded-in", [], {
          status: "archived",
          title: "Folded in",
        }),
        changeEntry("folded-in-2", [], {
          status: "archived",
          title: "Folded in too",
        }),
      ],
    });

    let last = -1;
    for (const stage of [
      "proposed",
      "designed",
      "specified",
      "planned",
      "building",
      "on-staging",
      "released",
      "archived",
    ] as Stage[]) {
      const found = html.indexOf(`data-lane="${stage}"`);
      expect(found, stage).toBeGreaterThan(last);
      last = found;
    }
    expect(html).toContain(">On staging<");

    // The Archived lane's own rows are the in-flight changes, always none;
    // its heading carries the archive's whole count and links to the
    // archive's own section rather than listing a card for each.
    const archivedLane = html.slice(
      html.indexOf('data-lane="archived"'),
      html.indexOf("</section>", html.indexOf('data-lane="archived"')),
    );
    expect(archivedLane).toContain(">Archived<");
    expect(archivedLane).toContain(">2<");
    expect(archivedLane).toContain('href="/in-flight#archive"');
    expect(archivedLane).not.toContain("Folded in");

    // The archive's own timeline, further down the page, still carries it.
    expect(html.indexOf("Folded in")).toBeGreaterThan(
      html.indexOf('data-lane="archived"'),
    );
  });

  it("Board with no change in flight", () => {
    const html = render([]);

    expect(html).toContain("Nothing in flight");
    expect(html).not.toContain('data-lane="proposed"');
    expect(html).not.toContain("could not be read");
  });

  it("A lane with no change in it, collapsed to its heading", () => {
    const html = render([at("planned")]);
    const staging = lane(html, "on-staging", "released");

    expect(staging).toContain(">0<");
    expect(staging).toContain("QA");
    expect(staging).toContain("release hand");
    expect(laneOpen(html, "released")).toBe("shut");
  });

  it("A lane whose stage names nobody, collapsed while a lane on a hand is open", () => {
    const html = render([at("proposed"), at("designed"), at("planned")]);

    expect(laneOpen(html, "designed")).toBe("shut");
    expect(laneOpen(html, "released")).toBe("shut");
    expect(laneOpen(html, "archived")).toBe("shut");
    expect(laneOpen(html, "proposed")).toBe("open");
    expect(laneOpen(html, "planned")).toBe("open");
    // A lane with nothing in it collapses whichever it is.
    expect(laneOpen(html, "specified")).toBe("shut");
  });

  it("A lane heading and a stepper step with the agent mark and the hand's move", () => {
    const html = render([at("proposed"), at("building")]);

    expect(html).toContain(
      "agent drafts the marks and the three files, from what the hand asks",
    );
    expect(html).toContain(">answer<");
    expect(html).toContain("agent drafts each group, test first");
    expect(html).toContain(">read each landing<");
    expect(lane(html, "on-staging", "released")).not.toContain("agent drafts");
    expect(lane(html, "released", "archived")).not.toContain("agent drafts");
  });

  it("gives two changes in one stage the same pair", () => {
    const html = render([
      at("planned", { title: "First planned" }),
      at("planned", { title: "Second planned" }),
    ]);

    expect(html).toContain("First planned");
    expect(html).toContain("Second planned");
    // One pair per drafted lane, and five lanes carry one.
    expect(html.match(/agent drafts/g)).toHaveLength(5);
  });
});

describe("the card", () => {
  it("A card in Proposed on the product manager, and one on the designer once the decisions and the journeys are in", () => {
    const early = changeEntry("fresh-idea", [], {
      stage: "proposed",
      written: ["proposal"],
      hands: { pm: "robin" },
      title: "Only a reason",
    });
    const whole = changeEntry("interviewed", [], {
      stage: "proposed",
      written: ["proposal", "decisions", "user-journeys"],
      hands: { ...HANDS },
      title: "The interview closed",
    });

    const first = render([early]);
    expect(first).toContain("@robin");
    expect(first).toContain("product manager");

    const second = render([whole]);
    expect(second).toContain("@dana");
    expect(second).toContain("designer");
    expect(second).toContain("@kim");
    expect(second).toContain("tech PIC");
    expect(second).toContain(">Proposed<");
  });

  it("A card whose hand is unnamed, showing the hand as open", () => {
    const html = render([
      at("planned", { hands: { pm: "robin" }, title: "Nobody on it" }),
    ]);

    expect(html).toContain("engineer");
    expect(html).toContain(">open<");
  });

  it("A card waiting, with the line and its date", () => {
    const html = render([
      at("planned", {
        awaiting: [
          {
            artifact: "tech-design",
            why: "2026-09-01 the queue is not settled",
          },
          { artifact: "ui-design", why: "the empty state is undrawn" },
        ],
      }),
    ]);

    expect(html).toContain("2026-09-01 the queue is not settled");
    expect(html).toContain("the empty state is undrawn");
    expect(html).toContain("@kim");
    expect(html).toContain("@dana");
    expect(overlaysOn(html).filter((kind) => kind === "waiting")).toHaveLength(
      2,
    );
  });

  it("A card blocked, naming the change it waits for", () => {
    const html = render([at("planned", { dependsOn: ["loyalty-rules"] })]);

    expect(overlaysOn(html)).toContain("blocked");
    expect(html).toContain("loyalty-rules");
  });

  it("A card idle 7 days, with the day count", () => {
    const html = render([
      at("planned", { lastLanded: daysAgo(7), title: "Stopped moving" }),
      at("building", { lastLanded: daysAgo(6), title: "Still moving" }),
    ]);

    expect(html).toContain("idle 7 days");
    expect(overlaysOn(html).filter((kind) => kind === "idle")).toHaveLength(1);
  });

  it("A card idle 30 days, on the shelf", () => {
    const html = render([
      at("building", { lastLanded: daysAgo(30), title: "Set aside" }),
      at("planned", { title: "Still on the board" }),
    ]);

    const shelf = html.indexOf('id="shelf"');
    expect(shelf).toBeGreaterThan(-1);
    expect(html.match(/Set aside/g)).toHaveLength(1);
    expect(html.indexOf("Set aside")).toBeGreaterThan(shelf);
    expect(html.slice(shelf)).toContain("Building");
    expect(html.slice(shelf)).toContain("30 days");
    expect(html.indexOf("Still on the board")).toBeLessThan(shelf);
  });

  it("A card wearing Behind, naming the earliest behind artifact and its hand", () => {
    const html = render([
      at("planned", {
        reviewed: { decisions: "aaaaaaaa", specs: "bbbbbbbb" },
        upstream: {
          decisions: {
            id: "11111111",
            items: ["docs/prds/products/demo-product/alpha.md#surfaces"],
          },
          specs: { id: "22222222", items: ["decisions"] },
        },
      }),
    ]);

    expect(overlaysOn(html)).toContain("behind");
    expect(html).toContain("Decisions");
    expect(html).toContain("@robin");
  });

  it("A card whose suite is a draft, and one whose suite is approved", () => {
    const suite = (status: "pending-review" | "approved") => ({
      spec: SPEC,
      status,
      cases: {
        draft: status === "approved" ? 0 : 2,
        actual: 1,
        deprecated: 0,
        total: 3,
      },
    });
    const drafting = render([
      at("planned", { suites: [suite("pending-review")] }),
    ]);
    const approved = render([at("planned", { suites: [suite("approved")] })]);

    expect(drafting).toContain(">draft<");
    expect(overlaysOn(drafting)).toContain("suite");
    expect(approved).toContain(">approved<");
    expect(drafting).toContain(">Planned<");
    expect(approved).toContain(">Planned<");
  });

  it("shows nothing outside the five overlays", () => {
    const html = render([
      at("planned", {
        awaiting: [{ artifact: "tasks", why: "2026-09-02 the plan is thin" }],
        dependsOn: ["loyalty-rules"],
        lastLanded: daysAgo(9),
        reviewed: { decisions: "aaaaaaaa" },
        upstream: {
          decisions: {
            id: "11111111",
            items: ["docs/prds/products/demo-product/alpha.md#surfaces"],
          },
        },
        suites: [
          {
            spec: SPEC,
            status: "pending-review",
            cases: { draft: 1, actual: 0, deprecated: 0, total: 1 },
          },
        ],
      }),
    ]);

    expect(overlaysOn(html)).toEqual([
      "waiting",
      "blocked",
      "idle",
      "behind",
      "suite",
    ]);
  });

  it("carries the hand, the age, the overlays and the task bar", () => {
    const html = render([at("building", { lastLanded: daysAgo(8) })]);

    expect(html).toContain("@sam");
    expect(html).toContain("idle 8 days");
    expect(html).toContain('aria-label="1 of 3 tasks done"');
  });
});

describe("the filters and the shelf", () => {
  it("The Mine filter with no handle chosen", () => {
    const html = render([at("planned"), at("building")], {
      url: "/in-flight?filter=mine",
    });

    expect(html).toContain("Choose a handle");
    expect(html).toContain("Your handle");
    expect(html).toContain(">Remember me<");
    expect(html).toContain("The planned change");
    expect(html).toContain("The building change");
  });

  it("narrows the board to what one overlay marks, and Mine to the reader's changes", () => {
    const stuck = at("planned", {
      title: "Waiting on the tech design",
      awaiting: [{ artifact: "tech-design", why: "2026-09-01 not settled" }],
    });
    const moving = at("building", { title: "Moving along" });

    const waiting = render([stuck, moving], {
      url: "/in-flight?filter=waiting",
    });
    expect(waiting).toContain("Waiting on the tech design");
    expect(waiting).not.toContain("Moving along");

    const mine = render(
      [
        at("planned", { title: "Sam takes this" }),
        at("building", { title: "Nobody of mine", hands: { pm: "robin" } }),
      ],
      { url: "/in-flight?filter=mine", handle: "sam" },
    );
    expect(mine).toContain("Sam takes this");
    expect(mine).not.toContain("Nobody of mine");
  });

  it("links the filter row's Shelf badge to the section, with its count — not a second way to show it", () => {
    const html = render([
      at("planned", { title: "Left in Planned", lastLanded: daysAgo(31) }),
      at("building", { title: "Left in Building", lastLanded: daysAgo(44) }),
      at("building", { title: "Still moving" }),
    ]);

    const filters = html.slice(html.indexOf('aria-label="Filters"'));
    const shelfLink = filters.slice(0, filters.indexOf("</nav>"));
    expect(shelfLink).toContain('href="/in-flight#shelf"');
    expect(shelfLink).toContain(">Shelf<");
    expect(shelfLink).toContain(">2<");
    // The lanes and the shelf both render on the one page — Shelf is a jump
    // down it, not a param that swaps one view for the other.
    expect(html).toContain("Still moving");
    expect(html.indexOf("Still moving")).toBeLessThan(
      html.indexOf('id="shelf"'),
    );
    expect(html.indexOf("Left in Planned")).toBeGreaterThan(
      html.indexOf('id="shelf"'),
    );
  });
});
