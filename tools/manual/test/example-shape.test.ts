import { describe, expect, it } from "vitest";
import {
  balances,
  elapsed,
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
    "| 3 Jan 2026 | earns 13 pts × 1.2 | +15 | 15 |",
    "| | the same day, redeems | −5 | 10 |",
    "| 20 Nov 2026 | redeems again | −5 | 5 |",
    "| 20 Nov 2027 | lapses | −5 | 0 |",
  ].join("\n");

  it("reads days, a blank day sharing the one above", () => {
    const read = readExample(example(TIMELINE));
    if ("problem" in read) throw new Error(read.problem);
    expect(read.ledger.kind).toBe("timeline");
    expect(read.ledger.rows.map((row) => row.label)).toEqual([
      "3 Jan 2026",
      "",
      "20 Nov 2026",
      "20 Nov 2027",
    ]);
    const days = read.ledger.rows.map((row) => row.day ?? Number.NaN);
    expect(days[1]).toBe(days[0]);
    expect((days[2] - days[0]) / 86_400_000).toBe(321);
  });

  it("refuses a day that reads wrong, a first row with none, and time running back", () => {
    expect(problemOf(TIMELINE.replace("20 Nov 2026", "Nov 2026"))).toMatch(
      /row 3: a day reads/,
    );
    expect(problemOf(TIMELINE.replace("| 3 Jan 2026 |", "| |"))).toMatch(
      /row 1: a day reads/,
    );
    expect(problemOf(TIMELINE.replace("20 Nov 2027", "1 Jan 2026"))).toMatch(
      /row 4 runs back in time/,
    );
  });
});

describe("elapsed", () => {
  const day = (iso: string) => Date.parse(`${iso}T00:00:00Z`);

  it("counts calendar months, then the days left over", () => {
    expect(elapsed(day("2026-01-03"), day("2026-06-01"))).toEqual({
      months: 4,
      days: 29,
    });
    expect(elapsed(day("2026-01-03"), day("2027-01-03"))).toEqual({
      months: 12,
      days: 0,
    });
    expect(elapsed(day("2026-03-08"), day("2026-04-10"))).toEqual({
      months: 1,
      days: 2,
    });
    expect(elapsed(day("2026-01-03"), day("2026-01-20"))).toEqual({
      months: 0,
      days: 17,
    });
  });

  it("clamps the day of month the way the programme does", () => {
    expect(elapsed(day("2026-01-31"), day("2026-02-28"))).toEqual({
      months: 1,
      days: 0,
    });
    expect(elapsed(day("2024-02-29"), day("2025-02-28"))).toEqual({
      months: 12,
      days: 0,
    });
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
