import { describe, expect, it } from "vitest";
import type { DesignSyncReport } from "../src/api/types";
import {
  designSyncOf,
  designSyncOfFrame,
  fileKeyOf,
  isDrifting,
  nodeIdOf,
  setsReached,
} from "../src/blocks/design-drift";

/** Keys as the design-sync checker names them: the Figma component-set name,
 * sometimes under a library folder. */
const report = (
  sets: DesignSyncReport["sets"],
  rest: Partial<DesignSyncReport> = {},
): DesignSyncReport => ({
  generatedAt: "2026-08-30T01:00:00.000Z",
  sets,
  ...rest,
});

const classOf = (r: DesignSyncReport, id: string) => designSyncOf(r, id)?.class;

const FILE = "https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS";

describe("the set a story card belongs to", () => {
  it("joins a real story id to the set its component name answers to", () => {
    expect(
      classOf(report({ "Cart Drawer": "warn" }), "store-cart-cartdrawer--x"),
    ).toBe("warn");
  });

  it("joins a one-word set to a card one step away from it", () => {
    expect(classOf(report({ Nav: "fail" }), "components-nav--narrow")).toBe(
      "fail",
    );
  });

  it("reads a library folder off the name, as the checker does", () => {
    expect(
      classOf(
        report({ "Product / Product Card": "warn" }),
        "store-product-listing-productcard--sold-out",
      ),
    ).toBe("warn");
  });

  it("reaches a set whose name spans more of the story's title path", () => {
    expect(
      classOf(
        report({ "Listing Gallery": "ok" }),
        "auction-listing-listing-gallery--default",
      ),
    ).toBe("ok");
  });

  /** The finding this matcher exists for: a Figma set called `Page` put a drift
   * badge on three unrelated whole-page cards, and most design systems have one
   * called `Page`, `Card` or `List`. */
  it("refuses a one-word set reaching across a path it says nothing about", () => {
    const generic = report({ Page: "warn", Card: "fail", List: "fail" });

    for (const id of [
      "pages-store-home-page--default",
      "pages-order-history-page--filled",
      "pages-product-list-page--default",
    ]) {
      expect(classOf(generic, id)).toBeUndefined();
    }
  });

  it("still badges the whole-page card whose own name is two words", () => {
    expect(
      classOf(
        report({ "Home Page": "fail" }),
        "pages-store-home-page--default",
      ),
    ).toBe("fail");
  });

  it("does not let a set reach a longer component name", () => {
    expect(
      classOf(
        report({ "Product Card": "fail" }),
        "store-product-listing-productcardimage--sold-out",
      ),
    ).toBeUndefined();
  });

  it("answers nothing for a story no set in the report names", () => {
    expect(
      classOf(report({ Badge: "fail" }), "store-cart-cartdrawer--default"),
    ).toBeUndefined();
  });

  it("answers nothing at all when no report was built", () => {
    expect(designSyncOf(undefined, "components-nav--default")).toBeUndefined();
  });

  it("takes the worse verdict when two set names normalize alike", () => {
    expect(
      classOf(
        report({ "Cart Drawer": "ok", "Cart / Cart Drawer": "fail" }),
        "store-cart-cartdrawer--default",
      ),
    ).toBe("fail");
  });

  it("carries what the run said, and when it said it", () => {
    const verdict = designSyncOf(
      report(
        { "Cart Drawer": "warn" },
        { messages: { "Cart Drawer": ["radius: code 16px, Figma 24px"] } },
      ),
      "store-cart-cartdrawer--default",
    );

    expect(verdict).toEqual({
      class: "warn",
      set: "Cart Drawer",
      messages: ["radius: code 16px, Figma 24px"],
      generatedAt: "2026-08-30T01:00:00.000Z",
    });
  });
});

describe("reading a figma url", () => {
  it("takes the node id in either of the two forms Figma writes", () => {
    expect(nodeIdOf(`${FILE}?node-id=4735-6493`)).toBe("4735-6493");
    expect(nodeIdOf(`${FILE}?node-id=4735%3A6493`)).toBe("4735-6493");
    expect(nodeIdOf(FILE)).toBeUndefined();
    expect(nodeIdOf("not a url")).toBeUndefined();
  });

  it("takes the file key off a design or file link", () => {
    expect(fileKeyOf(FILE)).toBe("GW2WL6JcWok5ypUrUFi9bU");
    expect(fileKeyOf("https://www.figma.com/design/abc/Store")).toBe("abc");
    expect(fileKeyOf("https://www.figma.com/")).toBeUndefined();
  });
});

describe("the set a figma frame belongs to", () => {
  const nodes = {
    "4735-6493": "Cart Drawer",
    "4765-2301": "Product / Cart / Cart Item",
    "4171-9023": "Store",
  };
  const full = report(
    { "Cart Drawer": "fail", "Product / Cart / Cart Item": "ok" },
    { file: "GW2WL6JcWok5ypUrUFi9bU", nodes },
  );

  it("badges a frame by the node id in its url", () => {
    expect(
      designSyncOfFrame(full, { url: `${FILE}?node-id=4735-6493` })?.class,
    ).toBe("fail");
  });

  it("reads a variant's own node id as its component set", () => {
    expect(
      designSyncOfFrame(full, { url: `${FILE}?node-id=4765-2301` })?.set,
    ).toBe("Product / Cart / Cart Item");
  });

  /** The commonest designer-side drift there is, and nothing anywhere noticed
   * it before the report carried the node map. */
  it("calls a node the file no longer holds missing", () => {
    expect(
      designSyncOfFrame(full, { url: `${FILE}?node-id=9999-1` })?.class,
    ).toBe("missing");
  });

  it("says nothing about a frame that is there but is not a checked set", () => {
    expect(
      designSyncOfFrame(full, { url: `${FILE}?node-id=4171-9023` }),
    ).toBeUndefined();
  });

  it("says nothing about a link into some other Figma file", () => {
    expect(
      designSyncOfFrame(full, {
        url: "https://www.figma.com/design/abc/Store?node-id=9999-1",
      }),
    ).toBeUndefined();
  });

  it("says nothing when the report carries no node map", () => {
    expect(
      designSyncOfFrame(report({ "Cart Drawer": "fail" }), {
        url: `${FILE}?node-id=4735-6493`,
      }),
    ).toBeUndefined();
  });

  it("takes a hand-named set over the node id", () => {
    expect(
      designSyncOfFrame(full, {
        url: `${FILE}?node-id=4171-9023`,
        set: "Cart Drawer",
      })?.class,
    ).toBe("fail");
  });

  /** A hint, never a loss. `check:manual` says the name is wrong; the card goes
   * on saying whatever the node id can say. */
  it("falls back to the node id when a hand-named set is not in the report", () => {
    expect(
      designSyncOfFrame(full, {
        url: `${FILE}?node-id=4735-6493`,
        set: "Ghost",
      })?.set,
    ).toBe("Cart Drawer");
    expect(
      designSyncOfFrame(full, {
        url: `${FILE}?node-id=4171-9023`,
        set: "Ghost",
      }),
    ).toBeUndefined();
  });
});

describe("what the report checks that no card shows", () => {
  it("names every set a card reaches, and only those", () => {
    const built = report(
      { "Cart Drawer": "warn", Nav: "ok", Ghost: "fail" },
      { file: "GW2WL6JcWok5ypUrUFi9bU", nodes: { "4735-6493": "Cart Drawer" } },
    );

    expect(
      setsReached(
        built,
        ["components-nav--narrow"],
        [{ url: `${FILE}?node-id=4735-6493` }],
      ),
    ).toEqual(new Set(["Nav", "Cart Drawer"]));
  });
});

describe("what earns a loud badge", () => {
  it("badges a disagreement and a frame that is gone", () => {
    expect([
      isDrifting("fail"),
      isDrifting("warn"),
      isDrifting("missing"),
      isDrifting("skipped"),
      isDrifting("ok"),
      isDrifting(undefined),
    ]).toEqual([true, true, true, false, false, false]);
  });
});
