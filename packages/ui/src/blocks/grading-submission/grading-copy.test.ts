import { describe, expect, it } from "vitest";
import { fillGradingCopy } from "./grading-copy";

/**
 * The catalogs word a whole sentence in one key, so a block fills that key
 * rather than taking the sentence in pieces. A placeholder nobody answered is
 * a copy bug: it stops the render by name instead of printing a gap.
 */
describe("fillGradingCopy", () => {
  it("fills every placeholder from the values it is given", () => {
    expect(
      fillGradingCopy("{set} · {number} · matched in the catalogue", {
        set: "Base Set",
        number: "4/102",
      }),
    ).toBe("Base Set · 4/102 · matched in the catalogue");
  });

  it("fills the same placeholder wherever it reads", () => {
    expect(fillGradingCopy("{grade} or above, at {grade}", { grade: "PSA 9" })).toBe(
      "PSA 9 or above, at PSA 9",
    );
  });

  it("leaves a message with no placeholder as it was written", () => {
    expect(fillGradingCopy("Kept as you typed it · no reference", {})).toBe(
      "Kept as you typed it · no reference",
    );
  });

  it("refuses a placeholder nobody answered, by name", () => {
    expect(() =>
      fillGradingCopy("Only encapsulate at {grade} or above", {}),
    ).toThrow(/\{grade\}/);
  });
});
