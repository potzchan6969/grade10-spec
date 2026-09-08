import { describe, expect, it } from "vitest";
import { buildIndex } from "../src/api/derive";
import {
  changeEntry,
  pageEntry,
  snapshotOf,
  specEntry,
} from "./manual-fixture";
import { realStore } from "./real-store";

/** A capability that exists only as an in-flight delta — no durable spec, no
 * page — would otherwise be invisible: the only way to learn one is being
 * built was to already know the change by name. */

const index = buildIndex(
  snapshotOf({
    config: {
      storybookBase: "",
      groups: [{ title: "Products", products: ["demo-product"] }],
      platform: [],
      guides: [],
    },
    taxonomy: { products: ["demo-product"], topics: [] },
    pages: [
      pageEntry("docs/prds/products/demo-product/index.md", { title: "Demo" }),
      pageEntry("docs/prds/products/demo-product/alpha.md", {
        title: "Alpha",
        spec: "demo-product/alpha",
      }),
    ],
    specs: [specEntry("demo-product/alpha", ["It works"])],
    changes: [
      changeEntry("add-membership", [
        {
          spec: "demo-product/membership",
          kinds: ["ADDED"],
          requirements: [],
        },
      ]),
      changeEntry("revise-alpha", [
        { spec: "demo-product/alpha", kinds: ["MODIFIED"], requirements: [] },
      ]),
      changeEntry("add-catalog", [
        { spec: "nowhere/catalog", kinds: ["ADDED"], requirements: [] },
      ]),
    ],
  }),
);

describe("the capabilities that exist only as a delta", () => {
  const product = index.groups[0].products[0];

  it("hangs one under the product it belongs to, pointing at its change", () => {
    expect(product.incubating).toHaveLength(1);
    expect(product.incubating[0].specId).toBe("demo-product/membership");
    expect(product.incubating[0].title).toBe("Membership");
    expect(product.incubating[0].change.id).toBe("add-membership");
  });

  it("leaves out a capability that already has a page", () => {
    expect(product.incubating.map((one) => one.specId)).not.toContain(
      "demo-product/alpha",
    );
  });

  /** A product nothing documents has no branch to sit under, and that is the
   * easiest capability in the store to lose entirely. */
  it("keeps the ones whose product has no branch at all", () => {
    expect(index.incubating.map((one) => one.specId)).toEqual([
      "nowhere/catalog",
    ]);
  });
});

describe("the real store", () => {
  /** The store now keeps a page for every delta-introduced capability, so the
   * delta-only set is usually empty — but whatever slips back to delta-only
   * must still show, and nothing shown may be stale. */
  it("gives every delta-only capability a way in", () => {
    const live = buildIndex(realStore.snapshot);
    const deltaOnly = [...live.changesBySpec.keys()].filter(
      (id) => !live.specById.has(id) && !live.routeBySpec.has(id),
    );
    const shown = [
      ...live.groups.flatMap((group) =>
        group.products.flatMap((product) => product.incubating),
      ),
      ...live.incubating,
    ].map((one) => one.specId);

    expect([...shown].sort()).toEqual([...deltaOnly].sort());
  });
});
