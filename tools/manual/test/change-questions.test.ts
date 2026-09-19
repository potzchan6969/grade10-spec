import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { ParsedPage } from "../src/api/derive";
import { questionsOf } from "../src/api/derive";
import { parsePage } from "../src/content/grammar";
import { NO_GIT } from "../src/store/git.mts";
import { readChanges } from "../src/store/read-changes.mts";
import { writeStore } from "./tmp-store";

/**
 * What a change still has open, and who it is addressed to: a decisions row
 * nobody has settled, and a ❓ line the page still carries under a section the
 * proposal links. Both are read, never stored twice — the row is the change's
 * own file, the line is the page's.
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
].join("\n");

const source = readFileSync(
  fileURLToPath(new URL("./fixtures/sections/rules.md", import.meta.url)),
  "utf8",
);
const page: ParsedPage = {
  path: PAGE,
  entry: { path: PAGE, source },
  ast: parsePage(source),
  error: null,
  route: "/p/demo-product/rules",
};

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

  it("counts every open row against the decisions", () => {
    const entry = changeWith("");

    expect(
      entry.questions?.filter((one) => one.artifact === "decisions"),
    ).toHaveLength(2);
  });
});

describe("a question the page still carries", () => {
  it("is listed against the proposal, naming its section", () => {
    const entry = changeWith(["hands:", "  pm: ecchochan", ""].join("\n"));
    const asked = questionsOf(entry, [page]).filter(
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
    const asked = questionsOf(changeWith(""), [page]);

    expect(asked.some((one) => one.text.includes("What a refund does"))).toBe(
      false,
    );
  });

  it("leaves a section the proposal does not link alone", () => {
    const asked = questionsOf(changeWith(""), [page]);

    expect(asked.some((one) => one.section === "tiers")).toBe(false);
  });

  it("carries the decisions rows beside the page's lines", () => {
    expect(questionsOf(changeWith(""), [page])).toHaveLength(6);
  });

  it("asks nothing of a page the snapshot does not hold", () => {
    expect(questionsOf(changeWith(""), [])).toHaveLength(2);
  });
});
