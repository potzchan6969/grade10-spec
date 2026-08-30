import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { buildIndex } from "../src/api/derive";
import { findStoreRoot } from "../src/store/disk.mts";
import { readStore } from "../src/store/snapshot.mts";
import {
  changeEntry,
  pageEntry,
  snapshotOf,
  specEntry,
} from "./manual-fixture";

/** Eighteen capabilities exist only as an in-flight delta: no durable spec, no
 * page, and nothing in the nav. The only way to learn one is being built was to
 * already know the change by name. */

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
      pageEntry("manual/products/demo-product/index.md", { title: "Demo" }),
      pageEntry("manual/products/demo-product/alpha.md", {
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
  it("gives every delta-only capability a way in", async () => {
    const root = findStoreRoot(fileURLToPath(new URL(".", import.meta.url)));
    const live = buildIndex((await readStore(root)).snapshot);
    const deltaOnly = [...live.changesBySpec.keys()].filter(
      (id) => !live.specById.has(id) && !live.routeBySpec.has(id),
    );
    const shown = [
      ...live.groups.flatMap((group) =>
        group.products.flatMap((product) => product.incubating),
      ),
      ...live.incubating,
    ].map((one) => one.specId);

    expect(deltaOnly.length).toBeGreaterThan(0);
    expect([...shown].sort()).toEqual([...deltaOnly].sort());
  });
});
