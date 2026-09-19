import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { ChangeEntry, PageEntry } from "../src/api/types";
import { type PageAst, parsePage } from "../src/content/grammar";
import { NO_GIT } from "../src/store/git.mts";
import { markQuestions } from "../src/store/questions.mts";
import { readChanges } from "../src/store/read-changes.mts";
import { writeStore } from "./tmp-store";

/**
 * What a change still has open, and who it is addressed to: a decisions row
 * nobody has settled, and a ❓ line the page still carries under a section the
 * proposal links. Both are read, never stored twice — the row is the change's
 * own file, the line is the page's — and merged onto one field, `questions`,
 * by `markQuestions`, the way the manual and the scripts both read it.
 */

const CHANGE = "key-probe";
const DIR = `openspec/changes/${CHANGE}`;
const PAGE = "docs/prds/products/demo-product/rules.md";

const SCHEMA = [
  "name: demo-planning",
  "version: 1",
  "artifacts:",
  "  - id: proposal",
  "    teammate: product-manager",
  "    required: true",
  "    generates: proposal.md",
  "    requires: []",
  "    upstream: []",
  "  - id: decisions",
  "    teammate: product-manager",
  "    required: true",
  "    generates: decisions.md",
  "    requires:",
  "      - proposal",
  "    upstream:",
  "      - proposal",
  "",
].join("\n");

const PROPOSAL = [
  "# Key probe",
  "",
  "## Why",
  "",
  "So the reader has a record to read.",
  "",
  "## References",
  "",
  `- [Rules · Points](../../../${PAGE}#points)`,
  "",
].join("\n");

const DECISIONS = [
  "## Goals",
  "",
  "- One reading of what is open",
  "",
  "## Decisions",
  "",
  "| Q | Asked | Decided | Instead of |",
  "| --- | --- | --- | --- |",
  "| Q1 | Is the stage derived? | Derived from the files on `main` | A key set by hand |",
  "| Q2 | Where are the bounds? | ❓ pm - recommended: seven days | The UTC date |",
  "| Q3 | Who runs the export? | ❓ ops - nobody has said | A cron nobody owns |",
  "| Q4 | What does a refund do? | ❓ nobody has said yet | Saying nothing |",
  "",
  "## Raised",
  "",
  "| Capability | Raised | Landed |",
  "| --- | --- | --- |",
  "| demo-product/alpha | Does a refund take the point back? | Q2 |",
  "| demo-product/alpha | Which day is a tier judged on? |  |",
  "| <!-- capability --> | <!-- what the blind pass asked --> |  |",
  "",
].join("\n");

const source = readFileSync(
  fileURLToPath(new URL("./fixtures/sections/rules.md", import.meta.url)),
  "utf8",
);
const page: PageEntry = { path: PAGE, source };
const asts = new Map<string, PageAst>([[PAGE, parsePage(source)]]);

/** `markQuestions` mutates the entry it is handed, the way the store marks
 * it when the snapshot is read; this reads the field back. */
function withPages(entry: ChangeEntry, pages: PageEntry[]): ChangeEntry {
  markQuestions([entry], pages, asts);
  return entry;
}

function changeWith(record: string) {
  const root = writeStore({
    "openspec/schemas/demo-planning/schema.yaml": SCHEMA,
    [`${DIR}/.openspec.yaml`]: `schema: demo-planning\ncreated: 2026-09-18\n${record}`,
    [`${DIR}/proposal.md`]: PROPOSAL,
    [`${DIR}/decisions.md`]: DECISIONS,
  });
  const [entry] = readChanges(root, NO_GIT, null);
  return entry;
}

describe("a decisions row nobody has settled", () => {
  it("is listed with its number and addressed to the role's handle", () => {
    const entry = changeWith(["hands:", "  pm: ecchochan", ""].join("\n"));

    expect(entry.questions).toEqual([
      {
        id: "Q2",
        artifact: "decisions",
        role: "pm",
        hand: "ecchochan",
        text: "Where are the bounds?",
        recommended: "recommended: seven days",
      },
      {
        id: "Q3",
        artifact: "decisions",
        role: "ops",
        hand: "ops",
        text: "Who runs the export?",
        recommended: "nobody has said",
      },
    ]);
  });

  it("leaves a cell that names no role to its author", () => {
    // `❓ <role> - ` is the grammar: without the separator the first word of
    // the sentence is not a role, and reading it as one addressed Q4 to
    // "nobody".
    const entry = changeWith("");

    expect(entry.questions?.some((one) => one.id === "Q4")).toBe(false);
  });

  it("is addressed to the role itself where the change names no hand", () => {
    const entry = changeWith("");
    const asked = entry.questions?.find((one) => one.id === "Q2");

    expect(asked?.role).toBe("pm");
    expect(asked?.hand).toBe("pm");
  });

  it("leaves a settled row alone", () => {
    const entry = changeWith("");

    expect(entry.questions?.some((one) => one.id === "Q1")).toBe(false);
  });

  it("counts the raised rows that landed nowhere", () => {
    // What a `Landed` cell says is the `raised` rule's to judge; an empty one
    // is what is read here. The header, the rule under it and the template's
    // own commented placeholders are not rows anybody asked.
    expect(changeWith("").raisedOpen).toBe(1);
  });

  it("counts every open row against the decisions", () => {
    const entry = changeWith("");

    expect(
      entry.questions?.filter((one) => one.artifact === "decisions"),
    ).toHaveLength(2);
  });
});

describe("a question the page still carries", () => {
  it("is listed against the proposal, naming its section", () => {
    const entry = withPages(
      changeWith(["hands:", "  pm: ecchochan", ""].join("\n")),
      [page],
    );
    const asked = (entry.questions ?? []).filter(
      (one) => one.artifact === "proposal",
    );

    // The hand is the role the line names its confirmer as, and the product
    // manager where it names none - Q41.
    expect(asked).toEqual([
      {
        artifact: "proposal",
        page: PAGE,
        section: "points",
        role: "pm",
        hand: "ecchochan",
        text: "Whether a refund takes the point back",
      },
      {
        artifact: "proposal",
        page: PAGE,
        section: "points",
        role: "pm",
        hand: "ecchochan",
        text: "**Who sets the rate** — the shop or the product; the product manager confirms",
      },
      {
        artifact: "proposal",
        page: PAGE,
        section: "points",
        role: "ops",
        hand: "ops",
        text: "**Where a point is spent** — in the shop or the app; Operations confirms",
      },
      {
        artifact: "proposal",
        page: PAGE,
        section: "points",
        role: "qa",
        hand: "qa",
        text: "whether a downgrade is walked",
      },
    ]);
  });

  it("leaves a titled block's row to the page", () => {
    const asked = withPages(changeWith(""), [page]).questions ?? [];

    expect(asked.some((one) => one.text.includes("What a refund does"))).toBe(
      false,
    );
  });

  it("leaves a section the proposal does not link alone", () => {
    const asked = withPages(changeWith(""), [page]).questions ?? [];

    expect(asked.some((one) => one.section === "tiers")).toBe(false);
  });

  it("carries the decisions rows beside the page's lines", () => {
    expect(withPages(changeWith(""), [page]).questions).toHaveLength(6);
  });

  it("asks nothing of a page the snapshot does not hold", () => {
    expect(withPages(changeWith(""), []).questions).toHaveLength(2);
  });
});
