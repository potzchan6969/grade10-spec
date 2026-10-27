import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { CommitInfo, PageEntry } from "../../manual/src/api/types.ts";
import { type PageAst, parsePage } from "../../manual/src/content/grammar.ts";
import { sectionTextOf } from "../../manual/src/content/sections.ts";
import { findStoreRoot } from "../../manual/src/store/disk.mts";
import {
  type GitIndex,
  NO_GIT,
  readGitIndex,
} from "../../manual/src/store/git.mts";
import { contentIdOf } from "../src/content-id.mts";
import type { StoreMain } from "../src/main.mts";
import { readChanges } from "../src/read-changes.mts";
import { schemaArtifacts } from "../src/read-schema.mts";
import { behindOf } from "../src/stages.ts";
import type { ChangeEntry, SchemaArtifact } from "../src/types.ts";
import { upstreamOf } from "../src/upstream.mts";
import { gitStore } from "./git-store";
import { writeStore } from "./tmp-store";

/**
 * What is before an artifact, and whether the artifact is behind it.
 *
 * The store reads the upstream: the page sections the change links, in
 * `<page>#<slug>` order, then each artifact the schema names, and the content
 * id of the lot. The comparison is pure and reads that reading back — the
 * recorded id against the one on `main`, or, with no record line, the commit
 * dates of the change's own artifacts on either side.
 */

const ID = "behind-probe";
const CHANGE = `openspec/changes/${ID}`;
const PAGE = "docs/prds/products/demo-product/rules.md";
const RULES = readFileSync(
  fileURLToPath(new URL("./fixtures/sections/rules.md", import.meta.url)),
  "utf8",
);

/** The store's own planning schema, so the order, the `requires` and the
 * `upstream:` sets these cases read are the ones every change reads. A
 * fixture schema of its own would read as the real one until the day somebody
 * moved an artifact. */
const SCHEMA = readFileSync(
  join(
    findStoreRoot(fileURLToPath(new URL(".", import.meta.url))),
    "openspec/schemas/grade10-planning/schema.yaml",
  ),
  "utf8",
);

const PROPOSAL = [
  "# Behind probe",
  "",
  "## Why",
  "",
  "So an artifact can fall behind what it was drawn from.",
  "",
  "## References",
  "",
  `- [Rules · Points](../../../${PAGE}#points)`,
  "",
].join("\n");

/** The same proposal, linking `Tiers` before `Points`, so the reading's order
 * is the one it sorts to and not the one the links are in. */
const LINKED_BACKWARDS = PROPOSAL.replace(
  `- [Rules · Points](../../../${PAGE}#points)`,
  [
    `- [Rules · Tiers](../../../${PAGE}#tiers)`,
    `- [Rules · Points](../../../${PAGE}#points)`,
  ].join("\n"),
);

const DECISIONS = "## Goals\n\n- One outcome.\n";
const UI_DESIGN = "## Screens\n\n### Board\n\nEight lanes.\n";
const SPEC_DELTA = [
  "## ADDED Requirements",
  "",
  "### Requirement: A lane names its stage",
  "",
  "#### Scenario: demo-SC-01 - it names it",
  "",
  "**WHEN** read **THEN** it names it",
  "",
].join("\n");

const SPEC_FILE = `${CHANGE}/specs/demo-product/alpha/spec.md`;
const UI_FILE = `${CHANGE}/ui-design.md`;
const JOURNEYS_FILE = `${CHANGE}/specs/demo-product/alpha/user-journeys.md`;
const TECH_FILE = `${CHANGE}/tech-design.md`;
const JOURNEYS =
  "**Walked by:** nobody on their own - a policy nobody reaches\n";
const TECH_DESIGN = "## Context\n\nOne reader of the capabilities.\n";

/** The store the cases read: the schema, the change, and the fixture page the
 * proposal links a section of. */
function filesOf(record = ""): Record<string, string> {
  return {
    "openspec/schemas/grade10-planning/schema.yaml": SCHEMA,
    [PAGE]: RULES,
    [`${CHANGE}/.openspec.yaml`]: `schema: grade10-planning\ncreated: 2026-09-18\n${record}`,
    [`${CHANGE}/proposal.md`]: PROPOSAL,
    [`${CHANGE}/decisions.md`]: DECISIONS,
    [UI_FILE]: UI_DESIGN,
    [SPEC_FILE]: SPEC_DELTA,
  };
}

const store = (record = "") => writeStore(filesOf(record));

const artifacts = (root: string): SchemaArtifact[] =>
  schemaArtifacts(root, "grade10-planning") ?? [];

const commit = (date: string): CommitInfo => ({
  sha: date.slice(0, 10).replace(/-/g, ""),
  date,
  subject: "a commit",
});

/** A git index that dates exactly the paths the case names, as
 * `git-merge.test.ts` injects one. */
const dating = (dates: Record<string, string>): GitIndex => ({
  ...NO_GIT,
  commitOf: (path) => (dates[path] ? commit(dates[path]) : undefined),
});

function pageOf(
  source = RULES,
  date?: string,
): { pages: PageEntry[]; asts: Map<string, PageAst> } {
  const entry: PageEntry = { path: PAGE, source };
  if (date) entry.lastCommit = commit(date);
  return { pages: [entry], asts: new Map([[PAGE, parsePage(source)]]) };
}

/** The change as the store reads it, with the upstream reading over it. */
function read(
  root: string,
  git: GitIndex = NO_GIT,
  page = pageOf(),
  main: StoreMain | null = null,
): ChangeEntry {
  const [entry] = readChanges(root, git, main);
  const upstream = upstreamOf(
    root,
    entry,
    artifacts(root),
    page.pages,
    page.asts,
    git,
  );
  if (upstream) entry.upstream = upstream;
  return entry;
}

/** Every artifact read again against exactly what is on `main` now. */
const reviewedOf = (entry: ChangeEntry): Record<string, string> =>
  Object.fromEntries(
    Object.entries(entry.upstream ?? {}).map(([id, one]) => [id, one.id]),
  );

/** One text the reader draws from the page, read the same way here. */
function sectionText(slug = "points", source = RULES): string {
  const text = sectionTextOf({ ast: parsePage(source) }, slug);
  if (text === undefined) throw new Error(`the fixture page has no ${slug}`);
  return text;
}

describe("what the store reads as before an artifact", () => {
  it("is the linked page sections, then the artifacts the schema names", () => {
    const entry = read(store());

    expect(entry.upstream?.proposal?.items).toEqual([`${PAGE}#points`]);
    expect(entry.upstream?.decisions?.items).toEqual([
      `${PAGE}#points`,
      "proposal",
    ]);
    expect(entry.upstream?.["ui-design"]?.items).toEqual([
      `${PAGE}#points`,
      "proposal",
      "decisions",
    ]);
  });

  it("hashes exactly those texts, in that order", () => {
    const entry = read(store());

    expect(entry.upstream?.["ui-design"]?.id).toBe(
      contentIdOf([sectionText(), PROPOSAL, DECISIONS]),
    );
    expect(entry.upstream?.specs?.id).toBe(
      contentIdOf([sectionText(), PROPOSAL, DECISIONS, UI_DESIGN]),
    );
  });

  it("never reads the record as upstream", () => {
    const before = read(store()).upstream;
    const after = read(
      store(
        [
          "hands:",
          "  pm: robin",
          "awaiting:",
          "  specs: the vendor has not answered",
          "",
        ].join("\n"),
      ),
    ).upstream;

    expect(after).toEqual(before);
  });

  it("skips a waived artifact and never asks whether it is behind", () => {
    const files = filesOf("ui_waived: nothing a reader sees moves\n");
    delete files[UI_FILE];
    const root = writeStore(files);
    const entry = read(root);

    expect(entry.upstream?.["ui-design"]).toBeUndefined();
    // The artifacts after it are read against the linked section, not it.
    expect(entry.upstream?.specs?.items).toEqual([
      `${PAGE}#points`,
      "proposal",
      "decisions",
    ]);
    expect(
      behindOf(
        {
          ...entry,
          reviewed: { ...reviewedOf(entry), "ui-design": "00000000" },
        },
        artifacts(root),
      ),
    ).toEqual([]);
  });

  it("reads the linked sections in `<page>#<slug>` order, not link order", () => {
    const files = filesOf();
    files[`${CHANGE}/proposal.md`] = LINKED_BACKWARDS;
    const entry = read(writeStore(files));

    expect(entry.upstream?.proposal?.items).toEqual([
      `${PAGE}#points`,
      `${PAGE}#tiers`,
    ]);
    expect(entry.upstream?.proposal?.id).toBe(
      contentIdOf([sectionText(), sectionText("tiers")]),
    );
  });

  it("leaves out an artifact `main` proves and this checkout does not hold", () => {
    // `tasks.md` is proven on `main`, which a shallow or partial checkout may
    // not have written out: hashing the absent file as "" would read the plan
    // as empty rather than as unread.
    const root = store();
    const main: StoreMain = {
      ref: "origin/main",
      commit: "0".repeat(40),
      changes: new Set([ID]),
      tasks: new Map([[ID, "## 1. Contracts\n\n- [ ] 1.1 Do it\n"]]),
      differing: new Map(),
    };
    const entry = read(root, NO_GIT, pageOf(), main);

    expect(entry.written).toContain("tasks");
    expect(entry.upstream?.tasks).toBeUndefined();
  });

  it("shared-planning-change-stages-SC-15, shared-planning-change-stages-SC-28 - hashes a journeys-only capability's own file, so an outline landing beside it moves nothing", () => {
    // The order the workflow documents: the journeys land, and the outline
    // comes later. A capability holding only its journeys is still one
    // capability, so the journeys artifact is read as the file that is there
    // — not as the empty text a reading through the change's deltas gave it,
    // which moved every id drawn from it the day `spec.md` landed.
    const files = filesOf();
    delete files[SPEC_FILE];
    files[JOURNEYS_FILE] = JOURNEYS;
    files[TECH_FILE] = TECH_DESIGN;
    const before = read(writeStore(files));

    expect(before.written).toContain("user-journeys");
    expect(before.upstream?.["tech-design"]?.items).toEqual([
      `${PAGE}#points`,
      "proposal",
      "decisions",
      "user-journeys",
    ]);
    expect(before.upstream?.["tech-design"]?.id).toBe(
      contentIdOf([sectionText(), PROPOSAL, DECISIONS, JOURNEYS]),
    );

    // The outline lands beside journeys nobody touched: the tech design is
    // drawn from the journeys and not from the requirements, so what is
    // before it is the same text and the same id.
    files[SPEC_FILE] = SPEC_DELTA;
    const after = read(writeStore(files));

    expect(after.upstream?.["tech-design"]?.id).toBe(
      before.upstream?.["tech-design"]?.id,
    );
  });

  it("reads nothing for an artifact the change has not written", () => {
    const root = writeStore({
      "openspec/schemas/grade10-planning/schema.yaml": SCHEMA,
      [PAGE]: RULES,
      [`${CHANGE}/.openspec.yaml`]: "schema: grade10-planning\n",
      [`${CHANGE}/proposal.md`]: PROPOSAL,
    });

    expect(Object.keys(read(root).upstream ?? {})).toEqual(["proposal"]);
  });
});

/** What `behindOf` gives where what moved could not be recovered: the whole
 * of what is before the artifact, each item a major move. */
const wholeOf = (artifact: string, changed: string[], since?: string) => ({
  artifact,
  changed,
  whole: true,
  moved: changed.map((item) => ({ item, key: item, major: true })),
  holds: true,
  ...(since ? { since } : {}),
});

describe("whether an artifact is behind", () => {
  it("shared-planning-change-stages-SC-27 - is fresh where the read record matches the tree", () => {
    const root = store();
    // Hand-computed rather than read back off the entry: the record is
    // written by the round, and a case that copies the reading it compares
    // against would pass however the reading was hashed.
    const reviewed = {
      proposal: contentIdOf([sectionText()]),
      decisions: contentIdOf([sectionText(), PROPOSAL]),
      "ui-design": contentIdOf([sectionText(), PROPOSAL, DECISIONS]),
      specs: contentIdOf([sectionText(), PROPOSAL, DECISIONS, UI_DESIGN]),
    };

    expect(behindOf({ ...read(root), reviewed }, artifacts(root))).toEqual([]);
  });

  it("is behind the whole of what is before it where the before cannot be recovered", () => {
    const root = store();
    const reviewed = reviewedOf(read(root));
    // The page's `Points` section gains a clause after every artifact was
    // read again against it, and no history holds what the lines were read
    // against.
    const moved = RULES.replace(
      "A point is earned per dollar spent.",
      "A point is earned per dollar spent, and a refund takes it back.",
    );
    const after = read(root, NO_GIT, pageOf(moved));

    expect(behindOf({ ...after, reviewed }, artifacts(root))).toEqual([
      wholeOf("proposal", [`${PAGE}#points`]),
      wholeOf("decisions", [`${PAGE}#points`, "proposal"]),
      wholeOf("ui-design", [`${PAGE}#points`, "proposal", "decisions"]),
      wholeOf("specs", [
        `${PAGE}#points`,
        "proposal",
        "decisions",
        "ui-design",
      ]),
    ]);
  });

  it("shared-planning-change-stages-SC-49 - a stale `reviewed:` id still carries `since`, the newest of what changed", () => {
    const root = store();
    const entry = read(
      root,
      dating({
        [`${CHANGE}/proposal.md`]: "2026-09-01T00:00:00Z",
        [`${CHANGE}/decisions.md`]: "2026-09-05T00:00:00Z",
        [UI_FILE]: "2026-09-02T00:00:00Z",
        [SPEC_FILE]: "2026-09-06T00:00:00Z",
      }),
      pageOf(RULES, "2026-09-05"),
    );

    // Every other artifact reads fresh against its own actual id; only the
    // spec delta's own line is wrong.
    const reviewed = { ...reviewedOf(entry), specs: "00000000" };

    expect(behindOf({ ...entry, reviewed }, artifacts(root))).toEqual([
      wholeOf(
        "specs",
        [`${PAGE}#points`, "proposal", "decisions", "ui-design"],
        "2026-09-05T00:00:00Z",
      ),
    ]);
  });

  it("shared-planning-agent-rounds-SC-34 - is unmoved by a page section the change does not link", () => {
    const root = store();
    const before = read(root).upstream;
    const after = read(
      root,
      NO_GIT,
      pageOf(RULES.replace("Three tiers", "Four tiers")),
    ).upstream;

    expect(after).toEqual(before);
  });

  it("reads an artifact no record line names as behind everything before it, whole and major", () => {
    const root = store();

    expect(
      behindOf(read(root), artifacts(root)).map((one) => [
        one.artifact,
        one.whole,
        one.holds,
      ]),
    ).toEqual([
      ["proposal", true, true],
      ["decisions", true, true],
      ["ui-design", true, true],
      ["specs", true, true],
    ]);
  });

  it("is never made fresh, nor behind, by a commit date", () => {
    const root = store();
    const dates = dating({
      [`${CHANGE}/proposal.md`]: "2026-09-01T00:00:00Z",
      [`${CHANGE}/decisions.md`]: "2026-09-09T00:00:00Z",
      [UI_FILE]: "2026-09-03T00:00:00Z",
      [SPEC_FILE]: "2026-09-04T00:00:00Z",
    });
    const entry = read(root, dates, pageOf(RULES, "2026-09-10"));

    // The decisions are newer than the UI design and the delta, and the
    // lines say both were read against what stands: nothing is behind.
    expect(
      behindOf({ ...entry, reviewed: reviewedOf(entry) }, artifacts(root)),
    ).toEqual([]);
  });
});

describe("over a real history", () => {
  /** The change and the page it draws from, in one repository, with each
   * artifact's `reviewed:` line written by a commit of its own record — the
   * commit the store reads the before at. */
  async function history() {
    const { root, write, commit } = gitStore("manual-behind-");
    for (const [path, text] of Object.entries(filesOf())) write(path, text);
    commit("the change and the page it is drawn from", 5);
    const at = async () => {
      const git = await readGitIndex(root, ["openspec", "docs/prds"]);
      const source = readFileSync(join(root, PAGE), "utf8");
      const page: PageEntry = { path: PAGE, source };
      const last = git.commitOf(PAGE);
      if (last) page.lastCommit = last;
      return read(root, git, {
        pages: [page],
        asts: new Map([[PAGE, parsePage(source)]]),
      });
    };
    const reviewed = reviewedOf(await at());
    write(
      `${CHANGE}/.openspec.yaml`,
      `schema: grade10-planning\ncreated: 2026-09-18\nreviewed:\n${Object.entries(
        reviewed,
      )
        .map(([id, content]) => `  ${id}: "${content}"\n`)
        .join("")}`,
    );
    commit("every artifact read again", 4);
    return { root, write, commit, at };
  }

  it("is unmoved by a commit on a section the change does not link", async () => {
    const { root, write, commit, at } = await history();

    write(PAGE, RULES.replace("Three tiers", "Four tiers"));
    commit("a section the change links nowhere", 3);

    expect(behindOf(await at(), artifacts(root))).toEqual([]);
  });

  it("shared-planning-agent-rounds-US-17 - quotes the linked section before and after, a major move every artifact after it holds on", async () => {
    const { root, write, commit, at } = await history();

    write(
      PAGE,
      RULES.replace(
        "A point is earned per dollar spent.",
        "A point is earned per dollar spent, and a refund takes it back.",
      ),
    );
    commit("the linked section moves", 3);
    const behind = behindOf(await at(), artifacts(root));

    expect(behind.map(({ artifact }) => artifact)).toEqual([
      "proposal",
      "decisions",
      "ui-design",
      "specs",
    ]);
    const [proposal] = behind;
    expect(proposal.holds).toBe(true);
    expect(proposal.whole).toBeUndefined();
    expect(proposal.moved).toHaveLength(1);
    expect(proposal.moved[0]).toMatchObject({
      item: `${PAGE}#points`,
      major: true,
    });
    expect(proposal.moved[0].before).toContain(
      "A point is earned per dollar spent.",
    );
    expect(proposal.moved[0].after).toContain("a refund takes it back");
  });

  it("shared-planning-agent-rounds-US-18 - a reworded Why is a small move that holds nothing", async () => {
    const { root, write, commit, at } = await history();

    write(
      `${CHANGE}/proposal.md`,
      PROPOSAL.replace(
        "So an artifact can fall behind what it was drawn from.",
        "So an artifact can fall behind what it is drawn from.",
      ),
    );
    commit("the Why reworded", 3);
    const behind = behindOf(await at(), artifacts(root));

    expect(behind.map(({ artifact }) => artifact)).toEqual([
      "decisions",
      "ui-design",
      "specs",
    ]);
    for (const one of behind) {
      expect(one.holds).toBe(false);
      expect(one.moved).toEqual([
        expect.objectContaining({ item: "proposal", key: "## Why" }),
      ]);
    }
  });

  it("shared-planning-agent-rounds-US-19 - an answer that takes the recommendation moves nothing, and one that overturns it holds", async () => {
    const { root, write, commit, at } = await history();
    const asked = (decided: string) =>
      `${DECISIONS}\n## Decisions\n\n| Q | Asked | Decided | Instead of |\n| --- | --- | --- | --- |\n| Q1 | Who is told? | ${decided} | One hand |\n`;
    write(`${CHANGE}/decisions.md`, asked("❓ pm - recommended: Every hand"));
    commit("a question held", 3);
    const held = await at();
    write(
      `${CHANGE}/.openspec.yaml`,
      `schema: grade10-planning\ncreated: 2026-09-18\nreviewed:\n${Object.entries(
        reviewedOf(held),
      )
        .map(([id, content]) => `  ${id}: "${content}"\n`)
        .join("")}`,
    );
    commit("read again against the held row", 2);

    write(`${CHANGE}/decisions.md`, asked("Every hand - the owner's word"));
    commit("the recommendation taken", 1);
    expect(behindOf(await at(), artifacts(root))).toEqual([]);

    write(`${CHANGE}/decisions.md`, asked("One hand - the owner's word"));
    commit("the recommendation overturned", 0);
    const behind = behindOf(await at(), artifacts(root));
    expect(behind.map(({ artifact }) => artifact)).toEqual([
      "ui-design",
      "specs",
    ]);
    expect(behind[0].holds).toBe(true);
    expect(behind[0].moved).toEqual([
      {
        item: "decisions",
        key: "Q1",
        before: "❓ pm - recommended: Every hand",
        after: "One hand - the owner's word",
        major: true,
      },
    ]);
  });
});

describe("behind holds no tick, claim or wait", () => {
  // shared-planning-change-stages-SC-30: a hand keeps working while the
  // artifact waits to be read again — nothing here reads `behindOf` before
  // reading a task list's ticks and claims or the record's own waits.
  const TASKS = [
    "## 1. Contracts (grade10-spec) (owner: @tester)",
    "",
    "- [x] 1.1 Ship it",
    "- [ ] 1.2 Ship the rest",
    "",
  ].join("\n");

  it("shared-planning-agent-rounds-SC-38, shared-planning-change-stages-SC-30 - still ticks, claims and waits while the requirements are behind", () => {
    const files = filesOf("awaiting:\n  tech-design: waiting on the vendor\n");
    files[`${CHANGE}/tasks.md`] = TASKS;
    const root = writeStore(files);
    const entry = read(root);

    // The tick and the claim.
    expect(entry.taskGroups[0]).toMatchObject({
      owner: "tester",
      done: 1,
      total: 2,
    });
    expect(entry.owners).toContain("tester");
    // The wait.
    expect(entry.awaiting).toEqual([
      { artifact: "tech-design", why: "waiting on the vendor" },
    ]);
    // The change is still behind: no line says anything was read again.
    expect(behindOf(entry, artifacts(root)).length).toBeGreaterThan(0);
  });
});
