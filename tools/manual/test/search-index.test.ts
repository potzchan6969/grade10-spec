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
    const index = buildIndex(snapshot);
    const engine = buildSearchIndex(index);
    const { hits, partial } = runSearch(engine, "gift card");
    const where = hits.map((one) => hit(one).to);

    expect(partial).toBe(false);
    expect(where.slice(0, 2)).toEqual([
      "/in-flight/revise-loyalty-programme-rules",
      "/in-flight/add-shopify-membership-pos",
    ]);

    // The whole point: not eighteen pages that merely say "card". Stated as
    // the property rather than a count, because a count is a fact about how
    // much of this store is about gift cards today — it was under six, it is
    // seven now, and a number that moves with the content cannot say whether
    // what moved was the content or the search. Every document that comes
    // back has to hold the rarer word; anything matching "card" alone is the
    // failure, however many of them there are.
    const byId = new Map(buildDocs(index).map((doc) => [doc.id, doc]));
    const missing = hits
      .map((one) => byId.get(String(one.id)))
      .filter(
        (doc) => !/gift/i.test(`${doc?.title} ${doc?.subtitle} ${doc?.body}`),
      );
    expect(missing).toEqual([]);
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

/**
 * The rule behind that guard, pinned to a fixture so it holds whatever the
 * store grows into. Every pair here is two real words of this vocabulary one
 * edit apart, which is what made a short fuzzy match a wrong answer rather
 * than a forgiving one.
 */
describe("a short word is not a near miss for a different one", () => {
  const page = (path: string, title: string, prose: string) => {
    const entry = pageEntry(path, { title });
    entry.source = `---\ntitle: ${title}\n---\n\n${prose}\n`;
    return entry;
  };

  const engine = buildSearchIndex(
    buildIndex(
      snapshotOf({
        pages: [
          page(
            "docs/prds/guides/how-this-manual-works.md",
            "How this manual works",
            "Every edit lands in git, because git is the only state this app has.",
          ),
          page(
            "docs/prds/platform/commerce.md",
            "Commerce",
            "A gift card is bought at a listed denomination.",
          ),
          page(
            "docs/prds/products/demo-product/cart.md",
            "Cart",
            "The cart holds one line item per distinct product.",
          ),
        ],
      }),
    ),
  );

  const titles = (query: string) =>
    runSearch(engine, query).hits.map((one) => hit(one).title);

  it("does not answer gift with git", () => {
    expect(titles("gift")).toEqual(["Commerce"]);
  });

  it("does not answer card with cart", () => {
    expect(titles("card")).toEqual(["Commerce"]);
  });

  it("does not answer cart with card", () => {
    expect(titles("cart")).toEqual(["Cart"]);
  });

  /** The tolerance the floor is there to keep: a word long enough that a
   * fifth of it really is one character. */
  it("still forgives a typo in a word long enough to have one", () => {
    expect(titles("denominaton")).toEqual(["Commerce"]);
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

  const page = pageEntry("docs/prds/products/demo-product/alpha.md", {
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
          schema: "grade10-planning",
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
    expect(found?.to).toBe("/in-flight/add-gift-cards");
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
