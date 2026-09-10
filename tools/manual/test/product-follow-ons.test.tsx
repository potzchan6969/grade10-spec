import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { buildIndex, followOnsForProduct } from "../src/api/derive";
import type { ChangeEntry } from "../src/api/types";
import type { ArchiveState } from "../src/api/use-archive";
import { ProductFollowOns } from "../src/pages/product-follow-ons";
import {
  changeEntry,
  pageEntry,
  snapshotOf,
  specEntry,
} from "./manual-fixture";

/** The archive rides its own fetch; the section is under test, not the fetch. */
const archive = vi.hoisted(() => ({
  current: { status: "loading" } as ArchiveState,
}));
vi.mock("../src/api/use-archive", () => ({
  useArchive: () => archive.current,
}));

/** A domain page pools what its capability pages each show alone: one reader
 * arriving at the auction has not chosen a capability yet, so the domain owes
 * them every follow-on named under it — and the capability each was about. */

const PRODUCT = "demo-admin/auction";
const LISTING = `${PRODUCT}/listing`;
const POST_SALE = `${PRODUCT}/post-sale`;

const changes: ChangeEntry[] = [
  changeEntry("expire-holds", [{ spec: POST_SALE, kinds: ["MODIFIED"] }], {
    title: "Holds should expire",
    created: "2026-03-01",
    lastMoved: "2026-03-04",
    followOns: ["A reminder before the expiry."],
  }),
  changeEntry(
    "one-gallery",
    [
      { spec: LISTING, kinds: ["ADDED"] },
      { spec: POST_SALE, kinds: ["MODIFIED"] },
    ],
    {
      title: "One gallery for both halves",
      created: "2026-02-01",
      lastMoved: "2026-02-02",
      followOns: ["A shared gallery block."],
    },
  ),
  changeEntry("quiet-one", [{ spec: LISTING, kinds: ["ADDED"] }], {
    title: "Named nothing next",
    lastMoved: "2026-04-01",
  }),
];

const index = () =>
  buildIndex(
    snapshotOf({
      taxonomy: { products: [PRODUCT], topics: [] },
      specs: [
        specEntry(LISTING, ["A listing is drafted"]),
        specEntry(POST_SALE, ["An order is worked"]),
      ],
      pages: [
        pageEntry(`docs/prds/products/${PRODUCT}/listing.md`, {
          title: "Listing",
          spec: LISTING,
        }),
        pageEntry(`docs/prds/products/${PRODUCT}/post-sale.md`, {
          title: "Post-Sale Queue",
          spec: POST_SALE,
        }),
      ],
      changes,
    }),
  );

const shipped = (
  id: string,
  spec: string,
  shippedOn: string,
  extra: Partial<ChangeEntry> = {},
): ChangeEntry =>
  changeEntry(id, [{ spec, kinds: ["ADDED"] }], {
    status: "archived",
    shippedOn,
    title: `Change ${id}`,
    ...extra,
  });

describe("gathering a domain's follow-ons", () => {
  it("pools every capability under the domain", () => {
    const found = followOnsForProduct(index(), PRODUCT);

    expect(found.map((one) => one.change.id)).toEqual([
      "expire-holds",
      "one-gallery",
    ]);
  });

  it("names a change once, with every capability it was about", () => {
    const found = followOnsForProduct(index(), PRODUCT);

    expect(found[1].specs).toEqual([LISTING, POST_SALE]);
    expect(found[1].items).toEqual(["A shared gallery block."]);
  });

  it("puts live intent first, then the shipped changes newest first", () => {
    const found = followOnsForProduct(index(), PRODUCT, [
      shipped("older", LISTING, "2026-01-02", { followOns: ["Older."] }),
      shipped("newer", POST_SALE, "2026-02-02", { followOns: ["Newer."] }),
    ]);

    expect(found.map((one) => one.change.id)).toEqual([
      "expire-holds",
      "one-gallery",
      "newer",
      "older",
    ]);
  });

  it("leaves another domain's capabilities where they are", () => {
    expect(followOnsForProduct(index(), "demo-site/auction")).toEqual([]);
  });
});

function render(state: ArchiveState) {
  archive.current = state;
  return renderToStaticMarkup(
    <MemoryRouter>
      <ProductFollowOns id={PRODUCT} index={index()} />
    </MemoryRouter>,
  );
}

const ready = (entries: ChangeEntry[]): ArchiveState => ({
  status: "ready",
  archive: { generatedAt: "", storeHead: "", changes: entries },
});

describe("the section on the domain page", () => {
  it("says who named each bullet, and which capability it was about", () => {
    const html = render(ready([]));

    expect(html).toContain("A reminder before the expiry.");
    expect(html).toContain("Holds should expire");
    expect(html).toContain("Post-Sale Queue");
    expect(html).toContain("/p/demo-admin/auction/post-sale");
  });

  it("draws nothing where no change named one", () => {
    archive.current = ready([]);
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <ProductFollowOns
          id={PRODUCT}
          index={buildIndex(
            snapshotOf({ taxonomy: { products: [PRODUCT], topics: [] } }),
          )}
        />
      </MemoryRouter>,
    );

    expect(html).toBe("");
  });

  it("still shows the in-flight bullets when the archive will not load", () => {
    const html = render({ status: "unavailable", reason: "404" });

    expect(html).toContain("A reminder before the expiry.");
    expect(html).toContain("archive unavailable");
  });
});
