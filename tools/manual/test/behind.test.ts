import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { createContext, createReport } from "../check/context.mjs";
import { checkAwaiting } from "../check/record.mjs";
import { behindLabelOf } from "../src/api/stage-view.ts";
import { behindOf } from "../src/api/stages.ts";
import type {
  ChangeEntry,
  CommitInfo,
  PageEntry,
  SchemaArtifact,
} from "../src/api/types";
import { type PageAst, parsePage } from "../src/content/grammar";
import { sectionTextOf } from "../src/content/sections";
import { contentIdOf } from "../src/store/content-id.mts";
import { findStoreRoot } from "../src/store/disk.mts";
import {
  type GitIndex,
  NO_GIT,
  readGitIndex,
  type StoreMain,
} from "../src/store/git.mts";
import { readChanges } from "../src/store/read-changes.mts";
import { schemaArtifacts } from "../src/store/read-schema.mts";
import { rootsOf } from "../src/store/roots.mts";
import { upstreamOf } from "../src/store/upstream.mts";
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
        { ...entry, reviewed: { "ui-design": "00000000" } },
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

  it("is behind where a linked section changed after it was read again", () => {
    const root = store();
    const reviewed = reviewedOf(read(root));
    // The page's `Points` section gains a clause after every artifact was
    // read again against it.
    const moved = RULES.replace(
      "A point is earned per dollar spent.",
      "A point is earned per dollar spent, and a refund takes it back.",
    );
    const after = read(root, NO_GIT, pageOf(moved));

    // The recorded id says each artifact's upstream moved and cannot say
    // which part of it, so each row names what is before it.
    expect(behindOf({ ...after, reviewed }, artifacts(root))).toEqual([
      { artifact: "proposal", before: [`${PAGE}#points`] },
      { artifact: "decisions", before: [`${PAGE}#points`, "proposal"] },
      {
        artifact: "ui-design",
        before: [`${PAGE}#points`, "proposal", "decisions"],
      },
      {
        artifact: "specs",
        before: [`${PAGE}#points`, "proposal", "decisions", "ui-design"],
      },
    ]);
  });

  it("shared-planning-change-stages-SC-49 - a stale `reviewed:` id still carries `since`, the newest of what changed", () => {
    const root = store();
    // The spec delta is reformatted (a commit that changes no content) after
    // the decisions moved, so its own commit outdates what actually changed
    // before it — the reading a `reviewed:` id compares against has to be the
    // newest of what is before the artifact, not filtered by the artifact's
    // own commit, or this case would carry no date at all.
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
      {
        artifact: "specs",
        before: [`${PAGE}#points`, "proposal", "decisions", "ui-design"],
        since: "2026-09-05T00:00:00Z",
      },
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

  it("says nothing about an artifact no record line names", () => {
    const root = store();

    expect(behindOf(read(root), artifacts(root))).toEqual([]);
  });
});

describe("with no read record at all", () => {
  const DATES = {
    [`${CHANGE}/proposal.md`]: "2026-09-01T00:00:00Z",
    [`${CHANGE}/decisions.md`]: "2026-09-02T00:00:00Z",
    [UI_FILE]: "2026-09-03T00:00:00Z",
    [SPEC_FILE]: "2026-09-04T00:00:00Z",
  };

  it("reads a linked page section as putting nothing behind", () => {
    const root = store();
    const entry = read(root, dating(DATES), pageOf(RULES, "2026-09-10"));

    // The page landed after every artifact was drawn, and no record line
    // dates the edit: a commit on the page dates every section of it, so the
    // date alone cannot say the linked one moved.
    expect(behindOf(entry, artifacts(root))).toEqual([]);
  });

  it("reads the artifact as behind where an artifact before it is newer", () => {
    const root = store();
    const entry = read(
      root,
      dating({ ...DATES, [`${CHANGE}/decisions.md`]: "2026-09-09T00:00:00Z" }),
      pageOf(RULES, "2026-09-05"),
    );

    // The decisions are newer than everything before them, so they are the
    // one artifact the dates leave alone. `since` is decisions' own commit
    // date — the newest of what changed — which is what the digest counts its
    // seven days from.
    expect(behindOf(entry, artifacts(root))).toEqual([
      {
        artifact: "ui-design",
        changed: ["decisions"],
        since: "2026-09-09T00:00:00Z",
      },
      {
        artifact: "specs",
        changed: ["decisions"],
        since: "2026-09-09T00:00:00Z",
      },
    ]);
  });

  it("says nothing where no commit dates the artifact", () => {
    const root = store();
    const entry = read(
      root,
      dating({ [`${CHANGE}/decisions.md`]: "2026-09-09T00:00:00Z" }),
      pageOf(RULES, "2026-09-10"),
    );

    expect(entry.upstream?.["ui-design"]?.newer).toBeUndefined();
    expect(behindOf(entry, artifacts(root))).toEqual([]);
  });

  it("omits `newer` where nothing before it is newer", () => {
    const root = store();
    const entry = read(root, dating(DATES), pageOf(RULES, "2026-09-10"));

    expect(entry.upstream?.["ui-design"]).not.toHaveProperty("newer");
  });

  it("says nothing where no commit dates what is before it", () => {
    const root = store();
    const entry = read(root, dating(DATES), pageOf(RULES));

    expect(behindOf(entry, artifacts(root))).toEqual([]);
  });

  it("says nothing where no commit dates anything at all", () => {
    const root = store();

    expect(behindOf(read(root), artifacts(root))).toEqual([]);
  });
});

describe("what the row names", () => {
  it("names what changed where the commit dates single items out", () => {
    expect(
      behindLabelOf({ artifact: "specs", changed: [`${PAGE}#points`] }),
    ).toBe(`${PAGE}#points changed`);
  });

  it("names what is before it where the recorded id dates no edit", () => {
    expect(
      behindLabelOf({
        artifact: "specs",
        before: [`${PAGE}#points`, "decisions"],
      }),
    ).toBe(`read again against ${PAGE}#points, decisions`);
  });
});

describe("over a real history", () => {
  /** The change and the page it draws from, in one repository whose commits
   * carry the day they were made — the dates the fallback reads are git's
   * here, not an injected index's. */
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
    return { root, write, commit, at };
  }

  it("is unmoved by a commit on a section the change does not link", async () => {
    const { root, write, commit, at } = await history();
    const reviewed = reviewedOf(await at());

    write(PAGE, RULES.replace("Three tiers", "Four tiers"));
    commit("a section the change links nowhere", 3);
    const after = await at();

    expect(behindOf({ ...after, reviewed }, artifacts(root))).toEqual([]);
  });

  it("is behind where a commit moves a linked section, once a record line dates the read", async () => {
    const { root, write, commit, at } = await history();
    const reviewed = reviewedOf(await at());

    write(
      PAGE,
      RULES.replace(
        "A point is earned per dollar spent.",
        "A point is earned per dollar spent, and a refund takes it back.",
      ),
    );
    commit("the linked section moves", 3);
    const after = await at();

    expect(
      behindOf({ ...after, reviewed }, artifacts(root)).map(
        ({ artifact }) => artifact,
      ),
    ).toEqual(["proposal", "decisions", "ui-design", "specs"]);
    // The same commit, read with no record line at all: the page's date says
    // the page moved and nothing says the linked section did.
    expect(behindOf(after, artifacts(root))).toEqual([]);
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
    const entry = read(
      root,
      dating({
        [`${CHANGE}/proposal.md`]: "2026-09-01T00:00:00Z",
        [`${CHANGE}/decisions.md`]: "2026-09-10T00:00:00Z",
        [UI_FILE]: "2026-09-03T00:00:00Z",
        [SPEC_FILE]: "2026-09-04T00:00:00Z",
      }),
      pageOf(RULES, "2026-09-05"),
    );

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
    // The change is still behind: the decisions are newer than what is
    // drawn from them.
    expect(behindOf(entry, artifacts(root))).toEqual([
      {
        artifact: "ui-design",
        changed: ["decisions"],
        since: expect.any(String),
      },
      { artifact: "specs", changed: ["decisions"], since: expect.any(String) },
    ]);
  });

  it("accepts the wait itself: the record's own rule raises nothing on it", () => {
    // The wait is accepted rather than refused, over the same behind store —
    // `checkAwaiting`, not the whole of `runChecks`, since this is the one
    // rule the wait could trip.
    const files = filesOf("awaiting:\n  tech-design: waiting on the vendor\n");
    files[`${CHANGE}/tasks.md`] = TASKS;
    const root = writeStore(files);
    const entry = read(
      root,
      dating({
        [`${CHANGE}/proposal.md`]: "2026-09-01T00:00:00Z",
        [`${CHANGE}/decisions.md`]: "2026-09-10T00:00:00Z",
        [UI_FILE]: "2026-09-03T00:00:00Z",
        [SPEC_FILE]: "2026-09-04T00:00:00Z",
      }),
      pageOf(RULES, "2026-09-05"),
    );

    const report = createReport();
    const ctx = createContext(rootsOf(root), report, {
      specs: new Map(),
      changes: [entry],
      stories: null,
    });
    checkAwaiting(ctx, [entry]);

    expect(report.findings.filter((one) => one.rule === "awaiting")).toEqual(
      [],
    );
  });
});
