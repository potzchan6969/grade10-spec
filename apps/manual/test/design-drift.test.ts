import { describe, expect, it } from "vitest";
import type { DesignSyncReport } from "../src/api/types";
import { designSyncOf, isDrifting } from "../src/blocks/design-drift";

/** Keys as the design-sync checker names them: the Figma component-set name,
 * sometimes under a library folder. */
const report = (sets: DesignSyncReport["sets"]): DesignSyncReport => ({
  generatedAt: "2026-08-30T01:00:00.000Z",
  sets,
});

describe("the set a story card belongs to", () => {
  it("joins a real story id to the set its component name answers to", () => {
    expect(
      designSyncOf(
        report({ "Cart Drawer": "warn" }),
        "store-cart-cartdrawer--default",
      ),
    ).toBe("warn");
  });

  it("joins a one-word set the same way", () => {
    expect(
      designSyncOf(report({ Nav: "fail" }), "components-nav--narrow"),
    ).toBe("fail");
  });

  it("reads a library folder off the name, as the checker does", () => {
    expect(
      designSyncOf(
        report({ "Product / Product Card": "warn" }),
        "store-product-listing-productcard--sold-out",
      ),
    ).toBe("warn");
  });

  it("reaches a set whose name spans more of the story's title path", () => {
    expect(
      designSyncOf(
        report({ "Listing Gallery": "ok" }),
        "auction-listing-listing-gallery--default",
      ),
    ).toBe("ok");
  });

  it("answers nothing for a story no set in the report names", () => {
    expect(
      designSyncOf(report({ Badge: "fail" }), "store-cart-cartdrawer--default"),
    ).toBeUndefined();
  });

  it("answers nothing at all when no report was built", () => {
    expect(designSyncOf(undefined, "components-nav--default")).toBeUndefined();
  });

  it("takes the worse verdict when two set names normalize alike", () => {
    expect(
      designSyncOf(
        report({ "Cart Drawer": "ok", "Cart / Cart Drawer": "fail" }),
        "store-cart-cartdrawer--default",
      ),
    ).toBe("fail");
  });
});

describe("what earns a badge", () => {
  it("badges only a disagreement", () => {
    expect([
      isDrifting("fail"),
      isDrifting("warn"),
      isDrifting("skipped"),
      isDrifting("ok"),
      isDrifting(undefined),
    ]).toEqual([true, true, false, false, false]);
  });
});
