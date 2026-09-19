import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { buildIndex } from "../src/api/derive";
import type {
  ChangeArtifact,
  ChangeDocument,
  ChangeEntry,
  Delta,
  SchemaArtifact,
  Snapshot,
} from "../src/api/types";
import type { ContentStore } from "../src/editor/store";
import { findStoreRoot } from "../src/store/disk.mts";
import { schemaArtifacts } from "../src/store/read-schema.mts";
import {
  changeEntry,
  pageEntry,
  snapshotOf,
  specEntry,
} from "./manual-fixture";

/**
 * The change page, state by state: the stepper and its one line below `sm`,
 * the Your turn card, the hands, the artifacts with their freshness, their
 * open questions and who landed each, then delivery and the handoff. One case
 * per `## States` bullet `ui-design.md` lists for the change page, named after
 * the bullet.
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

/** When each artifact landed, as the document carries it: the proposal, the
 * decisions and the journeys on one day, the designer's first word three days
 * later, and the rest after that. */
const LANDED: Record<string, string> = {
  proposal: "2026-09-01T02:00:00.000Z",
  decisions: "2026-09-01T03:00:00.000Z",
  "user-journeys": "2026-09-01T04:00:00.000Z",
  "ui-design": "2026-09-04T02:00:00.000Z",
  "tech-design": "2026-09-05T02:00:00.000Z",
  specs: "2026-09-06T02:00:00.000Z",
  "test-cases": "2026-09-06T03:00:00.000Z",
  tasks: "2026-09-08T02:00:00.000Z",
};

function change(extra: Partial<ChangeEntry> = {}): ChangeEntry {
  return changeEntry("pos", [delta], {
    stage: "building",
    title: "Point of sale",
    hands: { ...HANDS },
    written: WRITTEN,
    landedBy: { decisions: "robin", "ui-design": "dana" },
    taskGroups: [
      { num: "1", title: "Contracts", repo: "grade10-spec", done: 1, total: 3 },
    ],
    promotedBy: "sam",
    ...extra,
  });
}

/** The document the page fetches: one artifact row per schema artifact, each
 * dated where the change has written it. */
function documentOf(entry: ChangeEntry): ChangeDocument {
  const artifacts: ChangeArtifact[] = ARTIFACTS.map((artifact) => ({
    name: artifact.id,
    kind: artifact.generates.startsWith("specs/") ? "specs" : "doc",
    path: `openspec/changes/pos/${artifact.generates}`,
    present: entry.written.includes(artifact.id),
    ...(LANDED[artifact.id] && entry.written.includes(artifact.id)
      ? {
          lastCommit: {
            sha: "0".repeat(40),
            date: LANDED[artifact.id],
            subject: `land ${artifact.id}`,
          },
        }
      : {}),
  }));
  return {
    id: "pos",
    dir: "openspec/changes/pos",
    schema: "grade10-planning",
    schemaKnown: true,
    artifacts,
    deltas: [],
  };
}

const held = vi.hoisted(() => ({
  index: undefined as unknown,
  document: { status: "loading" } as unknown,
  // Read-only by default — a Your turn card asks for it only on the one
  // group of cases about the locally run manual.
  editor: { status: "ready", store: null } as unknown,
}));

vi.mock("../src/api/use-manual-index", () => ({
  useManualIndex: () => held.index,
}));
vi.mock("../src/editor/session", () => ({
  useEditorSession: () => held.editor,
}));
vi.mock("../src/api/use-archive", () => ({
  useArchive: () => ({ status: "loading" }),
}));
vi.mock("../src/api/use-change-document", () => ({
  useChangeDocument: () => held.document,
}));

const { ChangePage } = await import("../src/pages/change-page");

function snapshot(entry: ChangeEntry): Snapshot {
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
    changes: [entry],
  });
}

function render(
  entry: ChangeEntry = change(),
  store: ContentStore | null = null,
): string {
  held.index = buildIndex(snapshot(entry));
  held.document = { status: "ready", document: documentOf(entry) };
  held.editor = { status: "ready", store };
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={["/in-flight/pos"]}>
      <Routes>
        <Route element={<ChangePage />} path="in-flight/:change" />
      </Routes>
    </MemoryRouter>,
  );
}

/** One artifact's row, from its label to the next row. */
function row(html: string, artifact: string): string {
  const at = html.indexOf(`data-artifact="${artifact}"`);
  if (at === -1) return "";
  const next = html.indexOf("data-artifact=", at + 1);
  return html.slice(at, next === -1 ? undefined : next);
}

/** The markup around one marker, for a fact carried by the tag that holds it
 * rather than by its text. */
function around(html: string, mark: string, span = 240): string {
  const at = html.indexOf(mark);
  if (at === -1) return "";
  return html.slice(Math.max(0, at - span), at + span);
}

describe("the stepper", () => {
  const html = render();

  it("shows all eight stages and marks the one the change is in", () => {
    for (const label of [
      "Proposed",
      "Designed",
      "Specified",
      "Planned",
      "Building",
      "On staging",
      "Released",
      "Archived",
    ]) {
      expect(html, label).toContain(`>${label}<`);
    }
    expect(html).toContain('data-stage="building"');
    expect(around(html, 'data-stage="building"', 400)).toContain(
      'data-state="progress"',
    );
    expect(around(html, 'data-stage="archived"', 400)).toContain(
      'data-state="upcoming"',
    );
    expect(around(html, 'data-stage="proposed"', 400)).toContain(
      'data-state="completed"',
    );
  });

  it("A lane heading and a stepper step with the agent mark and the hand's move", () => {
    expect(html).toContain("agent drafts the plan");
    expect(html).toContain("agent drafts each group, test first");
    expect(html).toContain("read each landing");
    expect(html).not.toMatch(
      /data-stage="on-staging"[\s\S]{0,400}agent drafts/,
    );
  });

  it("The change page's stepper below `sm`, on one line", () => {
    const line = html.slice(html.indexOf('data-stepper="one-line"'));

    expect(line).toContain("Step 5 of 8");
    expect(line).toContain("Building");
    expect(line).toContain("agent drafts each group, test first");
    // Both readings render; which one shows at a given width is the walk's
    // own case (8.3), not a unit test's — this only asserts both exist.
    expect(html).toContain('data-stepper="one-line"');
    expect(html).toContain('data-stepper="steps"');
  });

  it("names the stage in the page's eyebrow", () => {
    expect(html).toContain("In Flight");
    expect(html).toContain(">Building<");
    expect(html).not.toContain(">in progress<");
  });

  it("names what the ladder's walk stopped at, under the change's own step", () => {
    const held = render(
      change({ stage: "proposed", written: ["proposal"], heldBy: "decisions" }),
    );

    const step = held.slice(
      held.indexOf('data-stage="proposed"'),
      held.indexOf('data-stage="designed"'),
    );
    expect(step).toContain("held by");
    expect(step).toContain("Decisions");
    // The other stages carry no such note.
    const next = held.slice(
      held.indexOf('data-stage="designed"'),
      held.indexOf('data-stage="specified"'),
    );
    expect(next).not.toContain("held by");
  });
});

describe("the Your turn card", () => {
  it("The Your turn card names the hand, the thread and the command", () => {
    const html = render(change({ thread: "C0123ABC/1758170000.001200" }));
    const card = html.slice(html.indexOf("Your turn"));

    expect(card).toContain("@sam");
    expect(card).toContain("engineer");
    expect(card).toContain("C0123ABC");
    expect(card).toContain("/build pos");
  });

  it("falls back to the change page's own link where no thread is recorded", () => {
    const html = render();
    const card = html.slice(html.indexOf("Your turn"));

    expect(card).toContain("/in-flight/pos");
    expect(card).toContain("no thread");
  });

  it("The change page's Your turn card on the hosted manual, with Assign shown as read-only", () => {
    const html = render();
    const card = html.slice(html.indexOf("Your turn"));

    const label = card.indexOf(">Assign<");
    const button = card.slice(card.lastIndexOf("<", label), label);
    expect(button).toContain('disabled=""');
    expect(card).toContain("read-only on the hosted manual");
    expect(html).toContain("Hands");
  });

  it("Assign on the locally run manual offers a role and a handle to write", () => {
    const store = {} as unknown as ContentStore;
    const html = render(change(), store);
    const card = html.slice(html.indexOf("Your turn"));

    const label = card.indexOf(">Assign<");
    const button = card.slice(card.lastIndexOf("<", label), label);
    expect(button).not.toContain('disabled=""');
    expect(card).not.toContain("read-only");
    // The six roles are offered, and a handle can be typed.
    for (const role of [
      "Product manager",
      "Designer",
      "Tech PIC",
      "Engineer",
      "QA",
      "Release hand",
    ]) {
      expect(card).toContain(role);
    }
    expect(card).toContain("Handle");
  });

  it("The change page for a change waiting on a stage whose hand is unnamed", () => {
    const html = render(change({ hands: { pm: "robin" } }));
    const card = html.slice(html.indexOf("Your turn"));

    expect(card).toContain("engineer");
    expect(card).toContain("channel");
    const hands = html.slice(html.indexOf(">Hands<"));
    expect(hands).toContain(">open<");
  });

  it("shared-planning-change-stages-SC-17, shared-planning-change-stages-SC-58 - every role is a row, open, on a change naming nobody", () => {
    const html = render(change({ hands: undefined }));
    const hands = html.slice(html.indexOf(">Hands<"));

    expect(hands).not.toContain("No hands named");
    for (const label of [
      "Product manager",
      "Designer",
      "Tech PIC",
      "Engineer",
      "QA",
      "Release hand",
    ]) {
      expect(hands).toContain(label);
    }
    expect(hands.split(">open<").length - 1).toBe(6);
  });

  it("offers the archive command on the three stages DRAFTED lacks, and only once on the page", () => {
    const html = render(change({ stage: "on-staging" }));
    const card = html.slice(html.indexOf("Your turn"), html.indexOf(">Hands<"));

    expect(card).toContain("/archive-change pos");
    expect(card).toContain("confirm it deployed");
    // The command is on the card alone: the page's own "Next" row, which used
    // to repeat it, is gone.
    expect(html).not.toContain(">Next<");
    // One CopyableCommand control, not the same command offered twice.
    expect(html.match(/Copy \/archive-change pos/g)).toHaveLength(1);
  });

  it("offers no command on Archived — the fold is already done", () => {
    const html = render(change({ stage: "archived", status: "archived" }));
    const card = html.slice(html.indexOf("Your turn"), html.indexOf(">Hands<"));

    expect(card).not.toContain("/archive-change");
    expect(card).toContain("waits on no hand");
  });
});

describe("the hands", () => {
  it("shows one row per role with its handle, and open for a role nobody has taken", () => {
    const html = render(change({ hands: { pm: "robin", dev: "sam" } }));
    const hands = html.slice(
      html.indexOf(">Hands<"),
      html.indexOf(">Artifacts<"),
    );

    for (const label of [
      "Product manager",
      "Designer",
      "Tech PIC",
      "Engineer",
      "QA",
      "Release hand",
    ]) {
      expect(hands, label).toContain(label);
    }
    expect(hands).toContain("@robin");
    expect(hands).toContain("@sam");
    expect(hands.match(/>open</g)).toHaveLength(4);
  });
});

describe("the artifacts", () => {
  it("An artifact with open questions, counted, and one landed, with the handle", () => {
    const html = render(
      change({
        questions: [
          {
            id: "Q1",
            artifact: "decisions",
            role: "pm",
            hand: "robin",
            text: "Which day does the shelf start on?",
          },
          {
            id: "Q2",
            artifact: "decisions",
            role: "pm",
            hand: "robin",
            text: "Who answers a wait?",
          },
        ],
      }),
    );

    expect(row(html, "decisions")).toContain("2 open questions");
    expect(row(html, "ui-design")).toContain("@dana");
    expect(row(html, "tasks")).not.toContain("landed by");
  });

  it("shows an open question's id on the artifact row it was raised against", () => {
    const html = render(
      change({
        rounds: [
          {
            round: 1,
            artifact: "ui-design",
            perspectives: "design, simpler",
            stood: "the empty state named no control",
            asked: "Q9",
            tests: "-",
          },
        ],
        questions: [
          {
            id: "Q9",
            // `readQuestions` always names the file a decisions row lives
            // in, `decisions` — never the draft the round was reading. The
            // row above is what says this one was ui-design's.
            artifact: "decisions",
            role: "design",
            hand: "dana",
            text: "What does the empty state say?",
          },
        ],
      }),
    );

    expect(row(html, "ui-design")).toContain("Q9");
    expect(row(html, "decisions")).not.toContain("Q9");
  });

  it("counts a question the page still carries against the proposal", () => {
    const html = render(
      change({
        questions: [
          {
            page: "docs/prds/products/demo-product/alpha.md",
            section: "surfaces",
            artifact: "proposal",
            role: "pm",
            hand: "robin",
            text: "Whether the shelf is a page of its own",
          },
        ],
      }),
    );

    expect(row(html, "proposal")).toContain("1 open question");
  });

  it("The change page for a change with `ui_waived`, showing the design as not owed and fresh", () => {
    const written = WRITTEN.filter((one) => one !== "ui-design");
    const html = render(
      change({ written, uiWaived: "nothing a reader sees moves" }),
    );
    const design = row(html, "ui-design");

    expect(design).toContain("not owed");
    expect(design).toContain("fresh");
    expect(design).toContain("nothing a reader sees moves");
  });

  it("shows a design with neither a file nor a line as still owed", () => {
    const written = WRITTEN.filter((one) => one !== "tech-design");
    const html = render(change({ written, stage: "proposed" }));

    expect(row(html, "tech-design")).toContain("not yet written");
  });

  it("An artifact behind, with the chip naming what changed before it", () => {
    const html = render(
      change({
        reviewed: { "ui-design": "aaaaaaaa" },
        upstream: {
          "ui-design": {
            id: "bbbbbbbb",
            items: ["docs/prds/products/demo-product/alpha.md#surfaces"],
          },
        },
      }),
    );

    const design = row(html, "ui-design");
    expect(design).toContain("behind");
    expect(design).toContain("alpha.md#surfaces");
    expect(row(html, "specs")).toContain("fresh");
  });

  it("shows the later handle alone where a second landing replaced the first", () => {
    const html = render(change({ landedBy: { "ui-design": "kim" } }));

    expect(row(html, "ui-design")).toContain("@kim");
    expect(row(html, "ui-design")).not.toContain("@dana");
  });
});

describe("the overlay row carries the whole dependency and suite reading", () => {
  it("names one chip per dependency, saying the lie an id names no change, and no second Blocked by list", () => {
    const html = render(change({ dependsOn: ["never-written"] }));
    const beside = html.slice(html.indexOf(">Beside the stage<"));

    expect(beside).toContain("never-written — names no change");
    expect(html).not.toContain(">Blocked by<");
  });

  it("carries the suite's counts on its own chip, and no second Test cases list", () => {
    const html = render(
      change({
        suites: [
          {
            spec: SPEC,
            status: "pending-review",
            cases: { draft: 2, actual: 1, deprecated: 0, total: 3 },
          },
        ],
      }),
    );
    const beside = html.slice(html.indexOf(">Beside the stage<"));

    expect(beside).toContain(">Suite<");
    expect(beside).toContain("3 cases");
    expect(beside).toContain("2 draft");
    expect(beside).toContain("1 reviewed");
    expect(html).not.toContain(">Test cases<");
  });
});

describe("the Rounds row", () => {
  it("The change page's Rounds row with one line per round, and a group with no round row shown as such", () => {
    const html = render(
      change({
        taskGroups: [
          {
            num: "1",
            title: "Contracts",
            repo: "grade10-spec",
            done: 3,
            total: 3,
          },
          {
            num: "2",
            title: "Surfaces",
            repo: "grade10-spec",
            done: 2,
            total: 2,
          },
        ],
        rounds: [
          {
            round: 1,
            artifact: "proposal",
            perspectives: "product, qa",
            stood: "the goal named two goals",
            asked: "-",
            tests: "-",
          },
          {
            round: 2,
            artifact: "decisions",
            perspectives: "simpler",
            stood: "nothing stood",
            asked: "-",
            tests: "-",
          },
          {
            round: 3,
            artifact: "1",
            perspectives: "qa, simpler",
            stood: "the group missed a test",
            asked: "Q3",
            tests: "demo-SC-01: test/one.test.ts",
          },
        ],
      }),
    );
    const rounds = html.slice(html.indexOf(">Rounds<"));

    expect(rounds).toContain("Round 1");
    expect(rounds).toContain("product, qa");
    expect(rounds).toContain("the goal named two goals");
    // A round whose readers found nothing still names its own perspectives.
    expect(rounds).toContain("Round 2");
    expect(rounds).toContain("nothing stood");
    expect(rounds).toContain("Q3");
    // Group 1 landed a round; Group 2 is ticked and carries none.
    expect(rounds).toContain("Group 2");
    expect(rounds).toContain("no round");
    expect(rounds).not.toMatch(/Group 1[\s\S]{0,80}no round/);
  });

  it("carries no Rounds row before the first round lands", () => {
    const html = render(change({ taskGroups: [] }));
    expect(html).not.toContain(">Rounds<");
  });
});

describe("delivery and the handoff", () => {
  it("names main, staging and the release that carried the change", () => {
    const html = render(
      change({ deployedEnv: "staging", releasedIn: "v2026.09.1" }),
    );
    const delivery = html.slice(html.indexOf(">Delivery<"));

    expect(delivery).toContain("main");
    expect(delivery).toContain("staging");
    expect(delivery).toContain("v2026.09.1");
  });

  it("shows the suite's automated count against its total on the Delivery row", () => {
    const html = render(
      change({
        suites: [
          {
            spec: SPEC,
            status: "in-review",
            cases: {
              draft: 1,
              actual: 2,
              deprecated: 0,
              total: 3,
              automated: 2,
            },
          },
        ],
      }),
    );
    const delivery = html.slice(html.indexOf(">Delivery<"));

    expect(delivery).toContain("2/3");
  });

  it("shows the days from a stage landing to the next hand's first word", () => {
    const html = render();
    const handoff = html.slice(html.indexOf(">Handoff<"));

    expect(handoff).toContain("Proposed");
    expect(handoff).toContain("3 days");
    expect(handoff).toContain("@dana");
  });

  it("says what nothing dates, rather than reading it as none", () => {
    const html = render();
    const handoff = html.slice(html.indexOf(">Handoff<"));

    // Nothing lands after the plan, so the engineer's first word on Planned
    // has no date: the days are counted to today and the row says so.
    expect(handoff).toContain("Planned");
    expect(handoff).toContain("so far");
  });
});

describe("the questions a change still carries", () => {
  it("lists them whatever stage the change has reached", () => {
    const html = render(
      change({
        stage: "building",
        questions: [
          {
            id: "Q7",
            artifact: "decisions",
            role: "design",
            hand: "dana",
            text: "Whether the shelf is a page of its own",
          },
        ],
      }),
    );

    expect(html).toContain("Whether the shelf is a page of its own");
    expect(html).toContain("Q7");
    expect(html).toContain(">Building<");
  });

  it("names the role's own label for a question the change names no hand for", () => {
    const html = render(
      change({
        questions: [
          {
            id: "Q8",
            artifact: "decisions",
            role: "design",
            hand: "design",
            text: "Whether the shelf is a page of its own",
          },
        ],
      }),
    );

    expect(html).toContain("designer — open");
    expect(html).not.toContain("design — open");
  });
});
