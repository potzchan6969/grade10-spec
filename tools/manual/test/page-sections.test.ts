import { describe, expect, it } from "vitest";
import {
  activeSection,
  navSections,
  type PageSection,
} from "../src/shell/page-sections";

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

const h2 = (id: string): PageSection => ({ id, title: id, level: 2 });
const h3 = (id: string): PageSection => ({ id, title: id, level: 3 });

describe("the sections the nav lists", () => {
  it("keeps the H2s in the order the page wrote them", () => {
    expect(
      navSections([h2("shape"), h3("edge"), h2("decisions"), h2("history")]),
    ).toEqual([h2("shape"), h2("decisions"), h2("history")]);
  });

  it("lists none where an H3 is what makes up the count", () => {
    expect(navSections([h2("shape"), h3("edge"), h2("decisions")])).toEqual([]);
  });

  it("lists none for a page with too few sections to be a level", () => {
    expect(navSections([h2("shape"), h2("decisions")])).toEqual([]);
    expect(navSections([])).toEqual([]);
  });

  it("lists all three the moment there are three", () => {
    expect(navSections([h2("a"), h2("b"), h2("c")])).toHaveLength(3);
  });
});
