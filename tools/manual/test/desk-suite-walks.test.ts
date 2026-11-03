import { describe, expect, it } from "vitest";
import { runSpecFromSuites } from "../src/desk/suite-run";
import { CART_SUITE, cartSuite } from "./desk-fixture";

describe("a run's walks", () => {
  it("are named by their suite's path, so two suites' walks never share an id", () => {
    const cart = cartSuite();
    const twin = { ...cart, path: CART_SUITE.replace("/store/", "/vault/") };
    const spec = runSpecFromSuites([cart, twin], {
      name: "two suites",
      env: "staging-1",
      selection: "two suites",
      source: "0123456789abcdef",
    });
    const ids = spec.walks.map((walk) => walk.id);
    expect(ids.length).toBeGreaterThan(1);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids[0].startsWith(`${CART_SUITE}#walk-`)).toBe(true);
  });
});
