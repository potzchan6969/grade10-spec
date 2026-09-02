import { describe, expect, it } from "vitest";
import { buildIndex, capabilityStatus, isProductDir } from "../src/api/derive";
import type { Snapshot } from "../src/api/types";
import {
  changeEntry,
  pageEntry,
  snapshotOf,
  specEntry,
} from "./manual-fixture";

const DURABLE = "demo-product/loyalty";
const DELTA_ONLY = "demo-product/gift-cards";

function indexOf(parts: Partial<Snapshot>) {
  return buildIndex(snapshotOf(parts));
}

describe("the status a capability is in", () => {
  it("is stable when its spec is durable and nothing is in flight", () => {
    const index = indexOf({ specs: [specEntry(DURABLE, ["A rule"])] });

    expect(capabilityStatus(index, DURABLE)).toBe("stable");
  });

  it("is changing when a change in flight touches its spec", () => {
    const index = indexOf({
      specs: [specEntry(DURABLE, ["A rule"])],
      changes: [
        changeEntry("revise-loyalty", [
          { spec: DURABLE, kinds: ["MODIFIED"], requirements: [] },
        ]),
      ],
    });

    expect(capabilityStatus(index, DURABLE)).toBe("changing");
  });

  it("is incubating while the spec lives only as a delta", () => {
    const index = indexOf({
      specs: [specEntry(DURABLE, ["A rule"])],
      changes: [
        changeEntry("add-gift-cards", [
          { spec: DELTA_ONLY, kinds: ["ADDED"], requirements: [] },
        ]),
      ],
    });

    expect(capabilityStatus(index, DELTA_ONLY)).toBe("incubating");
  });

  it("is planned for a page that names no spec at all", () => {
    const index = indexOf({ specs: [specEntry(DURABLE, ["A rule"])] });

    expect(capabilityStatus(index, undefined)).toBe("planned");
  });

  it("is planned when nothing durable or in flight carries the spec", () => {
    const index = indexOf({ specs: [specEntry(DURABLE, ["A rule"])] });

    expect(capabilityStatus(index, "demo-product/refunds")).toBe("planned");
  });
});

describe("where the status is carried", () => {
  const index = indexOf({
    config: {
      storybookBase: "",
      groups: [{ title: "Shop", products: ["demo-product"] }],
      platform: [],
      guides: ["writing-the-manual"],
    },
    taxonomy: { products: ["demo-product"], topics: [] },
    pages: [
      pageEntry("docs/prds/products/demo-product/index.md", { title: "Demo" }),
      pageEntry("docs/prds/products/demo-product/loyalty.md", {
        title: "Loyalty",
        spec: DURABLE,
        order: 1,
      }),
      pageEntry("docs/prds/products/demo-product/gift-cards.md", {
        title: "Gift cards",
        order: 2,
      }),
      pageEntry("docs/prds/guides/writing-the-manual.md", { title: "Writing" }),
    ],
    specs: [specEntry(DURABLE, ["A rule"])],
    changes: [
      changeEntry("revise-loyalty", [
        { spec: DURABLE, kinds: ["MODIFIED"], requirements: [] },
      ]),
    ],
  });

  it("marks each capability in the nav", () => {
    expect(
      index.groups[0].products[0].capabilities.map((item) => [
        item.id,
        item.status,
      ]),
    ).toEqual([
      ["loyalty", "changing"],
      ["gift-cards", "planned"],
    ]);
  });

  it("leaves guides unmarked — they document no spec", () => {
    expect(index.guides.map((item) => item.status)).toEqual([undefined]);
  });

  it("counts only a product's own children as capabilities", () => {
    const under = (dir: string) => isProductDir("docs/prds", dir);
    expect(under("docs/prds/products/demo-product")).toBe(true);
    expect(under("docs/prds/guides")).toBe(false);
    expect(under("docs/prds/products")).toBe(false);
    expect(under("docs/prds/products/demo-product/deeper")).toBe(false);
  });
});
