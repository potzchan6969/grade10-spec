import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { ParsedPage } from "../src/api/derive";
import {
  marksUnder,
  openMarksOfPage,
  sectionTextOf,
} from "../src/api/open-marks.ts";
import { parsePage } from "../src/content/grammar";

/**
 * A proposal links a page section, so the readers that answer for a change
 * have to say what that section is: the text it is drawn from, and the
 * questions still open under it. A titled block is the page's own — a
 * `Product decisions` table carries the rows the page keeps against every
 * change, and reading them as one change's would make every change on the
 * page carry every question anybody ever left there.
 */

const FIXTURE = fileURLToPath(
  new URL("./fixtures/sections/rules.md", import.meta.url),
);

const source = readFileSync(FIXTURE, "utf8");
const page: ParsedPage = {
  path: "docs/prds/products/demo-product/rules.md",
  entry: { path: "docs/prds/products/demo-product/rules.md", source },
  ast: parsePage(source),
  error: null,
  route: "/p/demo-product/rules",
};

describe("the text one section is drawn from", () => {
  it("is the heading and the prose under it, to the next level-two heading", () => {
    const text = sectionTextOf(page, "points") ?? "";

    expect(text).toContain("## Points");
    expect(text).toContain("A point is earned per dollar spent.");
    expect(text).toContain("one point per dollar");
    // The `###` under it is inside the section: the next `## ` ends it.
    expect(text).toContain("### Rounding");
    expect(text).toContain("Fractions round down.");
  });

  it("stops at the next level-two heading", () => {
    const text = sectionTextOf(page, "points") ?? "";

    expect(text).not.toContain("## Tiers");
    expect(text).not.toContain("Three tiers");
  });

  it("leaves a titled block's rows to the page", () => {
    const text = sectionTextOf(page, "points") ?? "";

    expect(text).not.toContain("What a refund does");
    expect(text).not.toContain("Product decisions");
  });

  it("holds the last section to the end of the page", () => {
    const text = sectionTextOf(page, "tiers") ?? "";

    expect(text).toContain("## Tiers");
    expect(text).toContain("Which day a tier is judged on");
    expect(text).not.toContain("## Points");
  });

  it("says nothing about a section the page does not carry", () => {
    expect(sectionTextOf(page, "expiry")).toBeUndefined();
  });

  it("says nothing about a page it could not parse", () => {
    expect(sectionTextOf({ ...page, ast: null }, "points")).toBeUndefined();
  });
});

describe("the open marks under one section", () => {
  it("lists the section's own lines", () => {
    expect(marksUnder(page, "points").map((one) => one.text)).toEqual([
      "❓ Whether a refund takes the point back",
    ]);
    expect(marksUnder(page, "tiers").map((one) => one.text)).toEqual([
      "❓ Which day a tier is judged on",
    ]);
  });

  it("leaves a titled block's row to the page", () => {
    const rows = openMarksOfPage(page).map((one) => one.text);

    // The page carries all three; the section carries one of them.
    expect(rows).toHaveLength(3);
    expect(rows.some((text) => text.includes("What a refund does"))).toBe(true);
    expect(
      marksUnder(page, "points").some((one) =>
        one.text.includes("What a refund does"),
      ),
    ).toBe(false);
  });

  it("lists nothing under a section the page does not carry", () => {
    expect(marksUnder(page, "expiry")).toEqual([]);
  });
});
