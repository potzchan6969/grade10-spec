import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
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
import { type GitIndex, NO_GIT } from "../src/store/git.mts";
import { readChanges } from "../src/store/read-changes.mts";
import { schemaArtifacts } from "../src/store/read-schema.mts";
import { upstreamOf } from "../src/store/upstream.mts";
import { writeStore } from "./tmp-store";

/**
 * What is before an artifact, and whether the artifact is behind it.
 *
 * The store reads the upstream: the page sections the change links, in link
 * order, then each artifact the schema names, and the content id of the lot.
 * The comparison is pure and reads that reading back — the recorded id
 * against the one on `main`, or, with no record line, the commit dates on
 * either side.
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
): ChangeEntry {
  const [entry] = readChanges(root, git, null);
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

/** The one text the reader draws from the page, read the same way here. */
function sectionText(): string {
  const text = sectionTextOf({ ast: parsePage(RULES) }, "points");
  if (text === undefined) throw new Error("the fixture page has no `Points`");
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
  it("is fresh where the read record matches the tree", () => {
    const root = store();
    const fresh = read(root);

    expect(
      behindOf({ ...fresh, reviewed: reviewedOf(fresh) }, artifacts(root)),
    ).toEqual([]);
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

  it("is unmoved by a page section the change does not link", () => {
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

  it("reads the artifact as behind where something before it is newer", () => {
    const root = store();
    const entry = read(root, dating(DATES), pageOf(RULES, "2026-09-10"));

    // The page landed after every artifact was drawn.
    expect(behindOf(entry, artifacts(root))).toEqual([
      { artifact: "proposal", changed: [`${PAGE}#points`] },
      { artifact: "decisions", changed: [`${PAGE}#points`] },
      { artifact: "ui-design", changed: [`${PAGE}#points`] },
      { artifact: "specs", changed: [`${PAGE}#points`] },
    ]);
  });

  it("names only what is newer than the artifact itself", () => {
    const root = store();
    const entry = read(
      root,
      dating({ ...DATES, [`${CHANGE}/decisions.md`]: "2026-09-09T00:00:00Z" }),
      pageOf(RULES, "2026-09-05"),
    );

    // The decisions are newer than everything before them, so they are the
    // one artifact the dates leave alone.
    expect(behindOf(entry, artifacts(root))).toEqual([
      { artifact: "proposal", changed: [`${PAGE}#points`] },
      {
        artifact: "ui-design",
        changed: [`${PAGE}#points`, "decisions"],
      },
      { artifact: "specs", changed: [`${PAGE}#points`, "decisions"] },
    ]);
  });

  it("says nothing where no commit dates the artifact", () => {
    const root = store();
    const entry = read(root, dating({}), pageOf(RULES, "2026-09-10"));

    expect(entry.upstream?.["ui-design"]?.newer).toBeUndefined();
    expect(behindOf(entry, artifacts(root))).toEqual([]);
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
