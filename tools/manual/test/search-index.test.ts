import { fileURLToPath } from "node:url";
import type { SearchResult } from "minisearch";
import { describe, expect, it } from "vitest";
import { buildIndex } from "../src/api/derive";
import {
  buildDocs,
  buildSearchIndex,
  runSearch,
  type SearchDoc,
} from "../src/api/search";
import { findStoreRoot } from "../src/store/disk.mts";
import { rootsOf } from "../src/store/roots.mts";
import { readStore } from "../src/store/snapshot.mts";
import { pageEntry, snapshotOf, specEntry } from "./manual-fixture";

/** Search over the store as it stands. The PM's probe was `gift card`: it came
 * back with eighteen confident results, not one of them about gift cards,
 * while two in-flight changes had already specified them. */

const hit = (result: SearchResult) =>
  result as unknown as SearchDoc & { score: number };

describe("the query that found nothing it was about", () => {
  const root = findStoreRoot(fileURLToPath(new URL(".", import.meta.url)));

  it("surfaces the changes that issue the gift-card scenarios, and little else", async () => {
    const { snapshot } = await readStore(rootsOf(root));
    const engine = buildSearchIndex(buildIndex(snapshot));
    const { hits, partial } = runSearch(engine, "gift card");
    const where = hits.map((one) => hit(one).to);

    expect(partial).toBe(false);
    expect(where.slice(0, 2)).toEqual([
      "/planning/revise-loyalty-programme-rules",
      "/planning/add-shopify-membership-pos",
    ]);
    // The whole point: not eighteen pages that merely say "card".
    expect(hits.length).toBeLessThan(6);
  });

  /** One common word must not carry a two-word query. */
  it("refuses to answer both words with either one of them", async () => {
    const { snapshot } = await readStore(rootsOf(root));
    const engine = buildSearchIndex(buildIndex(snapshot));

    const card = runSearch(engine, "card").hits.length;
    const both = runSearch(engine, "gift card").hits.length;

    expect(card).toBeGreaterThan(10);
    expect(both).toBeLessThan(card);
  });

  /** Nothing matching every word is worth saying out loud, but it is not worth
   * showing an empty screen over. */
  it("says so when it falls back to the words it could match", async () => {
    const { snapshot } = await readStore(rootsOf(root));
    const engine = buildSearchIndex(buildIndex(snapshot));

    expect(runSearch(engine, "gift zzzzznotaword").partial).toBe(true);
  });
});

describe("what the index now holds", () => {
  const spec = specEntry("demo-product/alpha", ["It works"]);
  spec.testCases = [
    {
      id: "alpha-TC-04",
      title: "A collector redeems a voucher",
      traces: ["alpha-SC-01"],
      status: "draft",
    },
  ];

  const page = pageEntry("manual/products/demo-product/alpha.md", {
    title: "Alpha",
    spec: "demo-product/alpha",
  });
  page.source = [
    "---",
    "title: Alpha",
    "spec: demo-product/alpha",
    "---",
    "",
    '::figma{url="https://figma.com/design/abc/x?node-id=1-2" title="Order history, empty"}',
    "",
    '::story{id="blocks-store-cart--default" title="Cart drawer"}',
    "",
    '::image{src="assets/shot.svg" alt="The bid panel after being outbid"}',
    "",
  ].join("\n");

  const index = buildIndex(
    snapshotOf({
      specs: [spec],
      pages: [page],
      changes: [
        {
          id: "add-gift-cards",
          schema: "pm-planning",
          status: "in-flight",
          owners: [],
          created: "2026-01-01",
          title: "Gift cards",
          why: "People ask for them.",
          taskGroups: [],
          deltas: [
            {
              spec: "demo-product/alpha",
              kinds: ["ADDED"],
              requirements: [
                {
                  name: "A gift card is bought at a listed denomination",
                  kind: "added",
                  text: "### Requirement: A gift card is bought at a listed denomination\n\nThe shop SHALL sell gift cards at 100, 500 and 1000.",
                },
              ],
            },
          ],
        },
      ],
    }),
  );
  const docs = buildDocs(index);
  const engine = buildSearchIndex(index);

  it("indexes a delta requirement as its own hit into the board", () => {
    const found = docs.find(
      (doc) => doc.title === "A gift card is bought at a listed denomination",
    );

    expect(found?.kind).toBe("change");
    expect(found?.to).toBe("/planning/add-gift-cards");
    expect(found?.body).toContain("500 and 1000");
  });

  it("finds a test case by its id and by its words, on the page's shelf", () => {
    for (const query of ["alpha-TC-04", "redeems a voucher"]) {
      const found = runSearch(engine, query).hits.map(hit);
      expect(found[0].kind).toBe("case");
      expect(found[0].to).toBe("/p/demo-product/alpha#alpha-TC-04");
    }
  });

  /** Every frame title a designer wrote, and every story id, was invisible to
   * Cmd-K — the words are on the page, and the page is the answer. */
  it("finds a page by the title on a figma frame, a story or an image", () => {
    for (const query of [
      "Order history, empty",
      "store-cart-cartdrawer",
      "outbid",
    ]) {
      const found = runSearch(engine, query).hits.map(hit);
      expect(found[0]?.to).toBe("/p/demo-product/alpha");
    }
  });
});
