import { describe, expect, it } from "vitest";
import { buildIndex } from "../src/api/derive";
import { pageEntry, snapshotOf, specEntry } from "./manual-fixture";

/** Operator pages leave their product's own branch and regroup under one
 * Admin group, keyed by `audience: operator` in the page's frontmatter —
 * the store's taxonomy stays put, only the rail regroups. */

const config = {
  storybookBase: "",
  groups: [
    { title: "Shop", products: ["demo-product"] },
    { title: "Admin", products: ["back-office"] },
  ],
  platform: [],
  guides: [],
};

const pages = [
  pageEntry("docs/prds/products/demo-product/index.md", { title: "Demo" }),
  pageEntry("docs/prds/products/demo-product/loyalty.md", {
    title: "Loyalty",
    spec: "demo-product/loyalty",
    order: 1,
  }),
  pageEntry("docs/prds/products/demo-product/queue.md", {
    title: "The queue",
    spec: "demo-product/queue",
    audience: "operator",
    order: 2,
  }),
  pageEntry("docs/prds/products/back-office/index.md", {
    title: "Back office",
  }),
  pageEntry("docs/prds/products/back-office/ledger.md", {
    title: "Ledger",
    audience: "operator",
    order: 1,
  }),
];

const specs = [
  specEntry("demo-product/loyalty", ["A rule"]),
  specEntry("demo-product/queue", ["A rule"]),
];

const index = buildIndex(
  snapshotOf({
    config,
    taxonomy: { products: ["demo-product", "back-office"], topics: [] },
    pages,
    specs,
  }),
);

describe("the derived Admin group", () => {
  const admin = index.groups.find((group) => group.title === "Admin");

  it("keeps operator pages out of the product's own branch", () => {
    const shop = index.groups.find((group) => group.title === "Shop");
    expect(
      shop?.products[0].capabilities.map((capability) => capability.id),
    ).toEqual(["loyalty"]);
  });

  it("regroups them under Admin by the product they operate", () => {
    expect(admin?.products.map((product) => product.id)).toEqual([
      "back-office",
      "demo-product",
    ]);
    const branch = admin?.products.find((one) => one.id === "demo-product");
    expect(branch?.capabilities.map((capability) => capability.id)).toEqual([
      "queue",
    ]);
    // The product's own branch already wears the count and the incubating
    // entries; the derived branch carries neither.
    expect(branch?.changeCount).toBe(0);
    expect(branch?.incubating).toEqual([]);
  });

  it("keeps every capability of a product listed under Admin itself", () => {
    expect(
      admin?.products[0].capabilities.map((capability) => capability.id),
    ).toEqual(["ledger"]);
  });

  it("creates the Admin group when manual.yaml has none", () => {
    const bare = buildIndex(
      snapshotOf({
        config: { ...config, groups: [config.groups[0]] },
        taxonomy: { products: ["demo-product"], topics: [] },
        pages,
        specs,
      }),
    );
    const created = bare.groups.find((group) => group.title === "Admin");
    expect(created?.products.map((product) => product.id)).toEqual([
      "demo-product",
    ]);
  });
});
