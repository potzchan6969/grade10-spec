import { describe, expect, it } from "vitest";
import { buildIndex, splitProductRoute } from "../src/api/derive";
import { snapshotOf } from "./manual-fixture";

function indexWith(products: string[]) {
  return buildIndex(snapshotOf({ taxonomy: { products, topics: [] } }));
}

describe("where a /p/ route splits into product and capability", () => {
  it("reads a two-segment product the store groups by application", () => {
    const index = indexWith(["grade10-site/store"]);

    expect(splitProductRoute(index, ["grade10-site", "store"])).toEqual({
      product: "grade10-site/store",
      capability: undefined,
    });
    expect(splitProductRoute(index, ["grade10-site", "store", "cart"])).toEqual(
      { product: "grade10-site/store", capability: "cart" },
    );
  });

  it("reads a flat product's capability where no grouped product claims it", () => {
    const index = indexWith(["vault"]);

    expect(splitProductRoute(index, ["vault"])).toEqual({
      product: "vault",
      capability: undefined,
    });
    expect(splitProductRoute(index, ["vault", "custody"])).toEqual({
      product: "vault",
      capability: "custody",
    });
  });

  it("prefers the longest product the store names", () => {
    const index = indexWith(["grade10-site", "grade10-site/store"]);

    expect(splitProductRoute(index, ["grade10-site", "store"])).toEqual({
      product: "grade10-site/store",
      capability: undefined,
    });
  });

  it("reads an unknown route the flat way, and refuses one too deep", () => {
    const index = indexWith([]);

    expect(splitProductRoute(index, ["nowhere", "thing"])).toEqual({
      product: "nowhere",
      capability: "thing",
    });
    expect(splitProductRoute(index, ["a", "b", "c", "d"])).toBeNull();
    expect(splitProductRoute(index, ["a", "b", "c"])).toBeNull();
  });
});
