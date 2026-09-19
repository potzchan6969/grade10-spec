import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { ParsedPage } from "../src/api/derive";
import { openMarksOfPage } from "../src/api/open-marks.ts";
import { parsePage } from "../src/content/grammar";
import { sectionTextOf } from "../src/content/sections";

/**
 * A proposal links a page section, so the readers that answer for a change
 * have to say what that section is: the text it is drawn from, and the
 * questions still open under it. A titled block is the page's own — a
 * `Product decisions` table carries the rows the page keeps against every
 * change, and reading them as one change's would make every change on the
 * page carry every question anybody ever left there.
 */

/** One fixture page, parsed the way the snapshot parses a page of the store. */
function pageOf(name: string): ParsedPage {
  const source = readFileSync(
    fileURLToPath(new URL(`./fixtures/sections/${name}`, import.meta.url)),
    "utf8",
  );
  const path = `docs/prds/products/demo-product/${name}`;
  return {
    path,
    entry: { path, source },
    ast: parsePage(source),
    error: null,
    route: `/p/demo-product/${name.replace(/\.md$/, "")}`,
  };
}

const page = pageOf("rules.md");

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

/**
 * One boundary, drawn once. A section runs to the next `## ` heading of the
 * page's own prose — a heading inside a fence is text, and a heading inside a
 * callout or a flow is that block's own — so the text a section is hashed
 * from and the questions counted under it are the same lines.
 */

const boundaries = pageOf("boundaries.md");

describe("the boundary both readers draw", () => {
  it("reads a fenced heading as text, not as a section", () => {
    expect(sectionTextOf(boundaries, "beta")).toBeUndefined();

    const alpha = sectionTextOf(boundaries, "alpha") ?? "";
    expect(alpha).toContain("## Beta");
    expect(alpha).toContain("A heading nobody wrote as one.");
  });

  it("holds a callout's and a flow's body inside the section", () => {
    const alpha = sectionTextOf(boundaries, "alpha") ?? "";

    expect(alpha).toContain("The callout's own line.");
    expect(alpha).toContain("The flow's step");
    // The flow's steps are headings of the flow, never of the page.
    expect(alpha).not.toContain("## Gamma");
    expect(alpha).not.toContain("The section after it.");
  });

  it("leaves a titled block's rows to the page", () => {
    const alpha = sectionTextOf(boundaries, "alpha") ?? "";

    expect(alpha).not.toContain("What the block holds");
  });

  it("counts a callout's and a flow's questions under the section", () => {
    const asked = openMarksOfPage(boundaries).filter(
      (one) => one.where?.anchor === "alpha",
    );

    expect(asked.map((one) => one.text)).toEqual([
      "❓ Whether the callout's line is Alpha's",
      "❓ Whether the flow's line is Alpha's",
    ]);
  });

  it("leaves a titled block's row out of the section", () => {
    const rows = openMarksOfPage(boundaries).filter((one) =>
      one.text.includes("What the block holds"),
    );

    expect(rows).toHaveLength(1);
    expect(rows[0].where?.anchor).toBe("detail-product-decisions");
  });
});
