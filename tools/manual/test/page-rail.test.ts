import { describe, expect, it } from "vitest";
import { activeSection } from "../src/shell/page-rail";

describe("the section the rail marks", () => {
  it("is the first one while the page is above every heading", () => {
    expect(activeSection([300, 900, 1500], 120)).toBe(0);
  });

  it("is the last heading that has passed the line", () => {
    expect(activeSection([-400, -10, 600], 120)).toBe(1);
  });

  it("takes a heading sitting exactly on the line", () => {
    expect(activeSection([-400, 120, 900], 120)).toBe(1);
  });

  it("is the last one once the page is past them all", () => {
    expect(activeSection([-900, -600, -100], 120)).toBe(2);
  });

  it("answers 0 for a page with no headings, so nothing is marked", () => {
    expect(activeSection([], 120)).toBe(0);
  });
});
