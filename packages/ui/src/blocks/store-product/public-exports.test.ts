import { describe, expect, it } from "vitest";
import type {
  StoreProductRelatedRailCopy,
  StoreProductRelatedRailProps,
} from "../../index";
import * as publicEntry from "../../index";
import { StoreProductRelatedRail } from "../../index";

type PublicRailTypes = [
  StoreProductRelatedRailCopy,
  StoreProductRelatedRailProps,
];

const publicRailTypes: PublicRailTypes | undefined = undefined;
void publicRailTypes;

// grade10-site-store-cross-sell-SC-25: the rail's exports resolve from the
// package's public entry, and nothing else is exported for the surface.
describe("store product related rail public entry", () => {
  it("exports the rail block", () => {
    expect(StoreProductRelatedRail).toEqual(expect.any(Function));
  });

  it("exports no other component for the rail", () => {
    const railExports = Object.keys(publicEntry).filter((name) =>
      name.startsWith("StoreProductRelatedRail"),
    );
    expect(railExports).toEqual(["StoreProductRelatedRail"]);
  });
});
