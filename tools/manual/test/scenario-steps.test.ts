import { describe, expect, it } from "vitest";
import { parseSteps } from "../src/blocks/scenario-view";

const step = (text: string) => parseSteps(text)[0];

describe("gherkin steps", () => {
  it("lifts the keyword out of a marked line", () => {
    expect(step("- **WHEN** the till opens")).toMatchObject({
      keyword: "WHEN",
      text: "the till opens",
    });
  });

  it("lifts a run of keywords, which the store writes as often", () => {
    expect(step("- **AND THEN** the session ends")).toMatchObject({
      keyword: "AND THEN",
      text: "the session ends",
    });
  });

  it("reads the bare form too, and stops at the first non-keyword", () => {
    expect(step("THEN SOME thing happens")).toMatchObject({
      keyword: "THEN",
      text: "SOME thing happens",
    });
  });

  it("leaves prose that only looks like a keyword alone", () => {
    const line = step("IFRAME embeds are blocked");
    expect(line.keyword).toBeUndefined();
    expect(line.text).toBe("IFRAME embeds are blocked");
  });

  it("keeps the rest of the line for the inline renderer", () => {
    expect(step("- **THEN** an operator holds `user:set-role`")).toMatchObject({
      keyword: "THEN",
      text: "an operator holds `user:set-role`",
    });
  });

  it("drops blank lines and keys each step apart", () => {
    const steps = parseSteps("- **GIVEN** a\n\n- **WHEN** b\n- **THEN** c\n");
    expect(steps.map((one) => one.keyword)).toEqual(["GIVEN", "WHEN", "THEN"]);
    expect(new Set(steps.map((one) => one.key)).size).toBe(3);
  });
});
