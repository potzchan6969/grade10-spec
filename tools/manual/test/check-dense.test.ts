import { describe, expect, it } from "vitest";
import { runChecks } from "../check/check-manual.mjs";
import { LEAD_CEILING, PROSE_CEILING } from "../check/dense.mjs";
import { NO_GIT } from "../src/store/git.mts";
import { writeStore } from "./tmp-store";

/**
 * A page is the essence a reader expands from. The `dense` rule warns where
 * it has become the expansion: prose past the ceiling, a section opening on
 * an essay, an engineer block written as a design note, a 🚧 buried in a
 * flow step or mid-line. Every finding is a warning.
 */
const PAGE = "docs/prds/products/demo/alpha.md";

async function denseLines(body: string, path = PAGE) {
  const root = writeStore({ [path]: `---\ntitle: Alpha\n---\n\n${body}\n` });
  const { findings } = await runChecks(root, NO_GIT);
  return findings
    .filter((one: { rule: string }) => one.rule === "dense")
    .map((one: { level: string; reason: string }) => [one.level, one.reason]);
}

const sentences = (count: number) =>
  Array.from({ length: count }, (_, i) => `Sentence number ${i + 1}.`).join(
    " ",
  );

describe("a page written the way the style asks", () => {
  const page = [
    "## Ladder",
    "",
    "| Tier | Earns |",
    "| --- | --- |",
    "| Silver | 1× |",
    "| Gold | 🚧 1.2× |",
    "",
    "## Keeping a Tier",
    "",
    "A tier is held for 12 months. What the member earns inside decides it.",
    "",
    "- **≥ 500 points** — the period extends",
    "- 🚧 **Taken back** — an operator removes it on the record",
    "- **Values** — $1.2 a point, e.g. on 2026/01/03, and U.S. rules apply",
    "",
    ':::detail{title="Code map" for="engineer"}',
    "- **Config** — `GRADE10_LOYALTY_PROGRAM` in `packages/app-env`",
    "- **Design record** — [loyalty architecture](https://example.test/loyalty.md)",
    ":::",
  ].join("\n");

  it("raises nothing", async () => {
    expect(await denseLines(page)).toEqual([]);
  });

  it("reads only product pages", async () => {
    const heavy = Array.from({ length: PROSE_CEILING + 1 }, () => "A line.");
    expect(
      await denseLines(heavy.join("\n"), "docs/prds/platform/topic.md"),
    ).toEqual([]);
  });
});

describe("prose past the ceiling", () => {
  it("counts lines outside examples and details, flows and callouts included", async () => {
    const line = "One more line of prose.";
    const inFlow = Array.from({ length: 10 }, () => line).join("\n");
    // The step's heading is a prose line too, so ten lines and a heading
    // inside the flow make eleven.
    const outside = Array.from({ length: PROSE_CEILING - 10 }, () => line);
    const page = [
      ...outside,
      "",
      ':::flow{title="Checkout"}',
      "## The cart is priced",
      inFlow,
      ":::",
      "",
      ':::example{title="Refund" tier="Gold"}',
      "- Gengar single $139",
      "",
      "| Step | Event | Points | Balance |",
      "| --- | --- | --- | --- |",
      "| Earns | 13 pts | +13 | 13 |",
      ":::",
    ].join("\n");
    expect(await denseLines(page)).toEqual([
      [
        "warn",
        `${PROSE_CEILING + 1} lines of prose outside its examples and details — the style's ceiling is ${PROSE_CEILING}`,
      ],
    ]);
  });

  it("says nothing at the ceiling", async () => {
    const page = Array.from({ length: PROSE_CEILING }, () => "A line.");
    expect(await denseLines(page.join("\n"))).toEqual([]);
  });
});

describe("a section that opens on an essay", () => {
  it("counts the sentences before the first item", async () => {
    const page = [
      "## Holds",
      "",
      sentences(LEAD_CEILING + 1),
      "",
      "- **Item** — after the lead",
      "",
      sentences(LEAD_CEILING + 1),
    ].join("\n");
    expect(await denseLines(page)).toEqual([
      [
        "warn",
        `\`Holds\` opens on ${LEAD_CEILING + 1} sentences before its items — two is the style's limit`,
      ],
    ]);
  });

  it("does not split on an abbreviation, a decimal or a date", async () => {
    const lead =
      "Points pay $1.2 each, e.g. on 2026/01/03. The rate holds. It is fixed. Nobody moves it. A deploy does. Six here.";
    expect(await denseLines(`## Rate\n\n${lead}`)).toEqual([]);
  });

  it("allows the ceiling exactly", async () => {
    expect(await denseLines(`## Rate\n\n${sentences(LEAD_CEILING)}`)).toEqual(
      [],
    );
  });
});

describe("an engineer block written as a design note", () => {
  const block = (body: string) =>
    `:::detail{title="Service design" for="engineer"}\n${body}\n:::`;

  it("counts its paragraphs", async () => {
    const body = [
      "The service is deployed once per brand and holds the record.",
      "",
      "- **Config** — `KYC_SERVICE`",
      "",
      "Capture keys are content-addressed, so no folder scheme exists.",
      "Two mechanisms move bytes out.",
    ].join("\n");
    expect(await denseLines(block(body))).toEqual([
      [
        "warn",
        "engineer block `Service design` holds 2 paragraphs — a code map is names and links",
      ],
    ]);
  });

  it("names one paragraph as one", async () => {
    expect(await denseLines(block("One sentence of prose."))).toEqual([
      [
        "warn",
        "engineer block `Service design` holds a paragraph — a code map is names and links",
      ],
    ]);
  });

  it("leaves another audience's block alone", async () => {
    const pm = `:::detail{title="Product decisions" for="pm"}\nA paragraph of rationale.\n:::`;
    expect(await denseLines(pm)).toEqual([]);
  });
});

describe("a 🚧 buried where the delta belongs", () => {
  it("names a mark inside a flow step", async () => {
    const page = [
      ':::flow{title="At the till"}',
      "## *Shopkeeper* — **Takes payment**",
      "🚧 The member can also open a coupon on their own phone.",
      ":::",
    ].join("\n");
    expect(await denseLines(page)).toEqual([
      [
        "warn",
        "🚧 `The member can also open a coupon on their own phone.` sits inside the flow `At the till` — a step is a scenario's home; the outcome's line is its section's",
      ],
    ]);
  });

  it("names a mark mid-line, and one mid-cell", async () => {
    const page = [
      "- **Staff choose** — points and coupons. 🚧 The member can also scan.",
      "",
      "| Row | What it holds |",
      "| --- | --- |",
      "| Your coupons | Every coupon the member holds, 🚧 and the store's own |",
    ].join("\n");
    expect(await denseLines(page)).toEqual([
      [
        "warn",
        "🚧 mid-line in `Staff choose — points and coupons. 🚧 The member can also sc…` — a mark starts an outcome's line, or the line is the delta's",
      ],
      [
        "warn",
        "🚧 mid-line in `| Your coupons | Every coupon the member holds, 🚧 and the s…` — a mark starts an outcome's line, or the line is the delta's",
      ],
    ]);
  });
});
