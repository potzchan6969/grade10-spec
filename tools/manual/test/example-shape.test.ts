import { describe, expect, it } from "vitest";
import {
  balances,
  formatMoney,
  orderTotal,
  readExample,
  readMoney,
} from "../src/blocks/example-shape";
import type { ExampleBlock } from "../src/content/grammar";

const example = (
  markdown: string,
  attrs: Partial<ExampleBlock> = {},
): ExampleBlock => ({
  type: "example",
  title: "Refund in two parts",
  body: [{ type: "prose", markdown }],
  ...attrs,
});

const LEDGER = [
  "| Step | Event | Points | Balance |",
  "| --- | --- | --- | --- |",
  "| Earns | 13 pts × 1.2 | +15 | 15 |",
  "| Refunds | $100 of the single | −10 | 5 |",
  "| Refunds | $39 more | -5 | 0 |",
].join("\n");

const CART = "- Gengar single $139\n- Gift card $1,000\n\n";

const problemOf = (markdown: string, attrs: Partial<ExampleBlock> = {}) => {
  const read = readExample(example(markdown, attrs));
  return "problem" in read ? read.problem : null;
};

describe("reading an example", () => {
  it("reads the cart, the rows, signed points and the note", () => {
    const read = readExample(
      example(`${CART}${LEDGER}\n\nPriced apart they take 14.`, {
        tier: "Gold",
        shipping: "$30",
      }),
    );
    if ("problem" in read) throw new Error(read.problem);

    const order = {
      items: [
        { name: "Gengar single", price: 139 },
        { name: "Gift card", price: 1000 },
      ],
      shipping: 30,
      tier: "Gold",
    };
    expect(read.ledger.order).toEqual(order);
    expect(orderTotal(order)).toBe(1169);
    expect(read.ledger.rows.map((row) => row.points)).toEqual([15, -10, -5]);
    expect(balances(read.ledger.rows)).toEqual([15, 5, 0]);
    expect(read.ledger.note).toEqual([
      { type: "prose", markdown: "Priced apart they take 14." },
    ]);
  });

  it("reads a ledger with no cart, opening mid-story", () => {
    const read = readExample(
      example(
        "| Step | Event | Points | Balance |\n| --- | --- | --- | --- |\n| Holds | 500 points | | 500 |\n| Refunds | nothing reached | 0 | |\n| Earns | more | +5 | 505 |",
      ),
    );
    if ("problem" in read) throw new Error(read.problem);
    expect(read.ledger.order).toBeNull();
    expect(balances(read.ledger.rows)).toEqual([500, 500, 505]);
  });

  it("refuses a cart line without a price, and a cart described by attrs alone", () => {
    expect(problemOf(`- Gengar single\n\n${LEDGER}`)).toMatch(/cart line 1/);
    expect(problemOf(`- Gengar single HKD 139\n\n${LEDGER}`)).toMatch(
      /cart line 1/,
    );
    expect(problemOf(LEDGER, { tier: "Gold" })).toMatch(/list what is bought/);
    expect(problemOf(`${CART}${LEDGER}`, { shipping: "30" })).toMatch(
      /shipping is a price/,
    );
  });

  it("refuses a balance the points do not reach, and a run below zero", () => {
    expect(problemOf(LEDGER.replace("| 5 |", "| 6 |"))).toMatch(
      /row 2 states a balance of 6, but the points reach 5/,
    );
    expect(problemOf(LEDGER.replace("-5", "-6"))).toMatch(/row 3 drives/);
  });

  it("refuses unsigned points, other columns, and a body with no table", () => {
    expect(problemOf(LEDGER.replace("+15", "15"))).toMatch(/signed/);
    expect(problemOf(LEDGER.replace("Balance", "After"))).toMatch(/columns/);
    expect(problemOf("Just prose.")).toMatch(/columns/);
    expect(
      readExample({ type: "example", title: "x", body: [] }),
    ).toMatchObject({ problem: expect.stringMatching(/opens with/) });
  });
});

describe("a timeline", () => {
  const TIMELINE = [
    "| When | Event | Points | Balance |",
    "| --- | --- | --- | --- |",
    "| 2026/01/03 | earns 13 pts × 1.2 | +15 | 15 |",
    "| | the same day, redeems | −5 | 10 |",
    "| 2026/11/20 | redeems again | −5 | 5 |",
    "| 2027/11/20 | lapses | −5 | 0 |",
  ].join("\n");

  it("reads days, a blank day sharing the one above", () => {
    const read = readExample(example(TIMELINE));
    if ("problem" in read) throw new Error(read.problem);
    expect(read.ledger.kind).toBe("timeline");
    expect(read.ledger.rows.map((row) => row.label)).toEqual([
      "2026/01/03",
      "",
      "2026/11/20",
      "2027/11/20",
    ]);
    const days = read.ledger.rows.map((row) => row.day ?? Number.NaN);
    expect(days[1]).toBe(days[0]);
    expect((days[2] - days[0]) / 86_400_000).toBe(321);
  });

  it("refuses a day that reads wrong, a first row with none, and time running back", () => {
    expect(problemOf(TIMELINE.replace("2026/11/20", "Nov 2026"))).toMatch(
      /row 3: a day reads/,
    );
    expect(problemOf(TIMELINE.replace("| 2026/01/03 |", "| |"))).toMatch(
      /row 1: a day reads/,
    );
    expect(problemOf(TIMELINE.replace("2027/11/20", "2026/01/01"))).toMatch(
      /row 4 runs back in time/,
    );
  });
});

describe("money", () => {
  it("reads and writes dollars with thousands and cents", () => {
    expect(readMoney("$6,000")).toBe(6000);
    expect(readMoney("$12.50")).toBe(12.5);
    expect(readMoney("HKD 30")).toBeUndefined();
    expect(readMoney("$1,00")).toBeUndefined();
    expect(formatMoney(6000)).toBe("$6,000");
    expect(formatMoney(12.5)).toBe("$12.50");
  });
});

/** A period marks what was running while the rows happened — named once, then
 * left blank for as long as it runs. */
describe("a ledger that marks its periods", () => {
  const PERIODS = [
    "| When | Event | Points | Balance | Period |",
    "| --- | --- | --- | --- | --- |",
    "| 2026/01/03 | earns | +300 | 300 | Silver |",
    "| 2026/03/01 | earns | +250 | 550 | Gold |",
    "| 2026/03/05 | redeems | −500 | 50 | |",
  ].join("\n");

  it("carries each row's period, a blank one sharing the span above", () => {
    const read = readExample(example(PERIODS));
    if ("problem" in read) throw new Error(read.problem);
    expect(read.ledger.rows.map((row) => row.period)).toEqual([
      "Silver",
      "Gold",
      "Gold",
    ]);
  });

  it("leaves a ledger without the column unmarked", () => {
    const read = readExample(example(LEDGER));
    if ("problem" in read) throw new Error(read.problem);
    expect(read.ledger.rows.every((row) => row.period === "")).toBe(true);
  });

  it("refuses a period on a steps ledger, which has no span of days", () => {
    const steps = PERIODS.replace("| When |", "| Step |")
      .replace(/\| \d+ \w+ \d{4} \|/g, "| Earns |")
      .replace("| Earns | redeems", "| Refunds | redeems");
    expect(problemOf(steps)).toBe(
      "`Period` marks a span of days, which a steps ledger has none of — write it as a timeline, or put the span in the step",
    );
  });

  it("counts the period column when a row is short", () => {
    const short = `${PERIODS}\n| 2026/03/09 | earns | +10 | 60 |`;
    expect(problemOf(short)).toBe("row 4 has 4 cells, not 5");
  });
});

/** A second running figure the rows state: what a window holds while the
 * balance goes its own way. */
describe("a ledger that keeps a progress column", () => {
  const PROGRESS = [
    "| When | Event | Points | Balance | Progress |",
    "| --- | --- | --- | --- | --- |",
    "| 2026/01/03 | earns | +300 | 300 | 300 |",
    "| 2026/03/05 | redeems | −500 | 50 | |",
    "| 2027/01/03 | the earn ages out | | 50 | 0 |",
  ].join("\n");

  it("carries a stated figure until the next one, unmoved by the points", () => {
    const read = readExample(
      example(`| When | Event | Points | Balance | Progress |
| --- | --- | --- | --- | --- |
| 2026/01/03 | earns | +300 | 300 | 300 |
| 2026/03/05 | redeems | −250 | 50 | |
| 2027/01/03 | the earn ages out | | 50 | 0 |`),
    );
    if ("problem" in read) throw new Error(read.problem);
    expect(read.ledger.progress).toBe(true);
    expect(read.ledger.rows.map((row) => row.progress)).toEqual([300, 300, 0]);
  });

  it("leaves a ledger without the column keeping none", () => {
    const read = readExample(example(LEDGER));
    if ("problem" in read) throw new Error(read.problem);
    expect(read.ledger.progress).toBe(false);
    expect(read.ledger.rows.every((row) => row.progress === null)).toBe(true);
  });

  it("refuses a progress that is not a whole number", () => {
    expect(problemOf(PROGRESS.replace("| 300 | 300 |", "| 300 | +300 |"))).toBe(
      "row 1: progress is a whole number, or blank to hold the one above",
    );
  });

  it("takes progress before the period, and reads both", () => {
    const both = [
      "| When | Event | Points | Balance | Progress | Period |",
      "| --- | --- | --- | --- | --- | --- |",
      "| 2026/01/03 | earns | +300 | 300 | 300 | Silver |",
      "| 2026/03/01 | earns | +250 | 550 | 550 | Gold · to 2027/03/01 |",
    ].join("\n");
    const read = readExample(example(both));
    if ("problem" in read) throw new Error(read.problem);
    expect(read.ledger.rows.map((row) => [row.progress, row.period])).toEqual([
      [300, "Silver"],
      [550, "Gold · to 2027/03/01"],
    ]);
  });
});

/** The rail's colour tells one period from the next; a period named none runs
 * blank, which is how a span inside nothing looks. */
describe("colouring the periods", () => {
  const PERIODS = [
    "| When | Event | Points | Balance | Period |",
    "| --- | --- | --- | --- | --- |",
    "| 2026/01/03 | earns | +300 | 300 | Silver |",
    "| 2026/03/01 | earns | +250 | 550 | Gold · to 2027/03/01 |",
    "| 2026/03/05 | redeems | −500 | 50 | |",
  ].join("\n");

  it("keys a colour on the name before the dot, so two terms share it", () => {
    const read = readExample(example(PERIODS, { periods: "Gold=gold" }));
    if ("problem" in read) throw new Error(read.problem);
    expect(read.ledger.tones).toEqual({ Gold: "gold" });
  });

  it("refuses a colour it does not have", () => {
    expect(problemOf(PERIODS, { periods: "Gold=amber" })).toBe(
      "`amber` is not one of the colours: orange, gold, blue, green, red, ink",
    );
  });

  it("refuses a period no row is inside", () => {
    expect(problemOf(PERIODS, { periods: "Black=ink" })).toBe(
      "no row is inside `Black`",
    );
  });

  it("refuses colours on a ledger that marks no periods", () => {
    expect(problemOf(LEDGER, { periods: "Gold=gold" })).toBe(
      "`periods` colours the spans a `Period` column marks, and this ledger marks none",
    );
  });

  it("closes a period on an em dash, leaving the rows after it inside nothing", () => {
    const closed = `${PERIODS}\n| 2026/03/09 | earns | +10 | 60 | — |`;
    const read = readExample(example(closed));
    if ("problem" in read) throw new Error(read.problem);
    expect(read.ledger.rows.at(-1)?.period).toBe("");
  });
});
