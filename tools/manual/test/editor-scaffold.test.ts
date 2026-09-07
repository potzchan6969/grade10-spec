import { describe, expect, it } from "vitest";
import { parsePage, serializePage } from "../src/content/grammar";
import { newPageSource } from "../src/editor/scaffold";

/** A scaffold is text the store will accept, or it is not a scaffold: it has
 * to be canonical before anyone has typed a word into it. */

describe("newPageSource", () => {
  it("lays a capability page out in shelf order", () => {
    const source = newPageSource({
      title: "Loyalty",
      capability: true,
      spec: "grade10-store/loyalty",
    });
    const ast = parsePage(source);

    expect(ast.frontmatter).toEqual({
      title: "Loyalty",
      spec: "grade10-store/loyalty",
    });
    expect(ast.blocks.map((block) => block.type)).toEqual([
      "prose",
      "spec",
      "cases",
    ]);
    // The ribbon and the timeline come from the frontmatter, never a block.
    expect(source).not.toContain("::changes");
  });

  it("round-trips through the grammar", () => {
    for (const source of [
      newPageSource({ title: "Loyalty", capability: true, spec: "store/loy" }),
      newPageSource({ title: "Loyalty", capability: true }),
      newPageSource({ title: "A guide" }),
    ]) {
      expect(serializePage(parsePage(source))).toBe(source);
    }
  });

  it("leaves the contract blocks out for a spec the store does not have", () => {
    const source = newPageSource({ title: "Vault", capability: true });

    expect(parsePage(source).blocks.map((block) => block.type)).toEqual([
      "prose",
    ]);
    expect(parsePage(source).frontmatter.spec).toBeUndefined();
  });

  it("starts every other kind of page empty", () => {
    expect(parsePage(newPageSource({ title: "A guide" })).blocks).toEqual([]);
  });
});
