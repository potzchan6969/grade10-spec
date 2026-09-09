**Author:** @seankcw - 2026-09-09

## Why

A collector narrows the listing to one world and is told `10 products`. They
scroll, and the shop says `20 products`. Nothing about the shop changed — the
number counts what they have scrolled past, not what their narrowing found.
The one question a count answers, *is it worth going on*, is the one question
it cannot answer, and a collector deciding whether to keep looking has to
reach the end of the catalogue to find out how big it was.

The design the surface was built from says the whole set: the listing page in
the workbench holds a hundred cards, lists ten, and says `100 Products` from
the first paint to the last. The shipped listing is the only place that
number counts differently.

Beneath that sits a gap. Nothing in `grade10-site/store/product-listing` says
how the listing pages. The shared block forbids pagination and reads the next
cards as a shopper approaches the end, and the site's own listing does exactly
that — but an engineer building the site listing from its spec alone would be
free to put page numbers under it, and the two would only disagree at review.

Metric: collectors who narrow the listing and leave without reading past the
first page. Unmeasured today, and a count that describes the reader rather
than the shop gives them no reason to go on.

## What Changes

- **The count is the whole narrowing** — how many cards the narrowed
  catalogue holds, not how many have been read; it moves when the narrowing
  moves and stays still while the collector scrolls
- **Scrolling is how the listing pages, on the record** — reaching the end of
  what is shown adds the next cards below it, and no page number, next
  control or load-more button is offered anywhere on the surface
- **A walk belongs to its narrowing** — a new facet, word, order or
  collection lists its own first page, with no card of the last one under it
- **Depth is not the address** — a shared or bookmarked address opens the
  narrowing, never the reader's place in it, and Back undoes a narrowing
  rather than a page
- **A page that fails costs nothing already read** — the cards standing stay
  standing, and reaching the end again asks for that page once more

## Non-Goals

- **The shared block's paging** — `shared/ui/store-product-listing` already
  requires the next cards on approach and already forbids pagination. Neither
  its behaviour nor its props move; this change records the site's half of the
  same contract
- **Keeping a collector's place** — an address opens a narrowing, not a
  position in it, so returning from a product page starts at the top of the
  listing. Restoring depth is worth its own evidence
- **A page size the collector picks** — the catalogue's own is the only one
- **The facet counts** — their rule is settled and does not move: counted over
  the whole narrowed set with the facet's own selection excluded
- **The auction listing** — it pages on its own terms and is not held to this

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `grade10-site/store/product-listing`: the listing lengthens as the collector
  scrolls, and its count describes the whole narrowed set

## Impact

- **Grade10 site** — the listing already reads the next page on approach and
  already starts its walk again on a new narrowing. What moves is the number
  it renders above the grid, today the count of cards read
- **The catalogue read** — a page answers whether more follow and a cursor,
  and no total. Shopify's own search carries one for every narrowed, searched
  and ordered path; a collection's products connection carries none, so a
  collection's total is counted by walking, as the `latest` ordering already
  walks
- **`@grade10/ui`** — unchanged. The count is a string the consumer supplies
  and the list header renders, and the header is already forbidden to derive
  it from the cards on the page
- **The manual** — `docs/prds/products/grade10-site/store/product-listing.md`
  gains how the listing pages and what its count means
- **ZZZ** — no store surface
