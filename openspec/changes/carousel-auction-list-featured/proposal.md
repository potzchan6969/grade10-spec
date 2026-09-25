**Author:** @tangconst - 2026-09-25

Product context: [Auction Display · Catalogue](../../../docs/prds/products/grade10-site/auction/display.md#catalogue)
and [Auction Management · Featured](../../../docs/prds/products/grade10-admin/auction/management.md#featured).

## Why

`/auction` still leads with an auto Top-N scrolling row and, when busy,
category tiles and a filter. Operators cannot choose which lots lead the
catalogue, or which image sells them. Collectors miss a live bid roll on that
lead band. Category browsing is not ready to ship with this rewrite.

**Metric:** Featured slide opens (Bid Now and progress advances) and watch
toggles from All auctions cards among catalogue sessions; unmeasured until
instrumented.

## What Changes

- **Operator-curated Featured** — at most three ordered slots; each binds one
  published Active or Upcoming lot and one hero image the operator uploads for
  that slot.
- **Carousel banner on `/auction`** — when at least one slot is set: full-width
  slide with that hero as banner and slab, title, status, client countdown from
  the served close or open, current bid with a rolling number when it changes,
  Bid Now to the lot, and progress dots.
- **Quiet catalogue only** — Featured (when present) then All auctions; no
  category tiles and no busy filter in this change.
- **Watch from All auctions** — the same watch as the lot page and My Auctions;
  no list-local watch rules.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-admin/auction/featured` — ordered Featured slots (≤3), each a
  published Active or Upcoming lot plus one hero image asset; who may curate
  them.

### Modified Capabilities

- `grade10-site/auction/auction` — catalogue presentation: Featured carousel
  rules, quiet layout (no category section), All auctions list unchanged in
  resting order.

## Impact

- Admin gains a Featured curation surface (upload + lot pick + order) under
  auction management; grants ride with existing auction catalogue operators
  unless the tech design names otherwise.
- `grade10-site` `/auction` serves the curated slides and drops busy/quiet
  category chrome for this layout.
- Preview already drafts `FeaturedAuctionsBanner` and
  `AuctionCataloguePage` under `apps/preview/src/pages/`; promoting a public
  `@grade10/ui` block is flagged in `ui-design.md` if this change owns the
  export contract.
- Watch behaviour leans on `grade10-site/auction/watchlist` with no delta.

## Follow-on changes

- Category tiles and the busy filter/sidebar on `/auction`.
- Upcoming and Ended lot-card chrome beyond what Active already shows.
- Real-time lot-status push on the Featured banner beyond countdown and live
  bid.

## References

- [Auction Display · Catalogue](../../../docs/prds/products/grade10-site/auction/display.md#catalogue)
- [Auction Management · Featured](../../../docs/prds/products/grade10-admin/auction/management.md#featured)
- [Watchlist](../../../docs/prds/products/grade10-site/auction/bidding.md#my-auctions-watchlist-and-notifications)
