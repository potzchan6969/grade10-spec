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
  published Active or Upcoming lot and one **front page image** the operator
  uploads for that slot (banner background and slab as that single asset). A
  failed load falls back to the lot’s first gallery image, else the stage’s
  default background colour.
- **Carousel banner on `/auction`** — when at least one slot is set: full-width
  slide with that front page image, title, status (LIVE BIDDING + live dot when
  Active; UPCOMING with no dot when Upcoming), relative Ends in / Opens in
  (list-card short form; no Extended label; close moves with live bid
  freshness), money on Active only (rolls on increase after first paint;
  Upcoming shows no money until open), Bid Now or View Auction by status, and
  progress dots when more than one slide (on a small viewport, stage previous/next
  and swipe also advance).
- **Quiet catalogue only** — Featured (when present) then All auctions; no
  category tiles and no busy filter in this change.
- **Watch from All auctions** — the same watch as the lot page and My Auctions;
  no list-local watch rules. List cards do not live-roll the bid in this change.
- **All auctions paging** — infinite scroll appends the next batch; Boneyard
  skeleton cards while that batch settles; no pagination controls.
- **Upcoming money withheld** — Featured slides and All auctions cards show no
  starting bid (and no other money) until the lot is Active.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-admin/auction/featured` — ordered Featured slots (≤3), each a
  published Active or Upcoming lot plus one front page image asset; who may curate
  them.

### Modified Capabilities

- `grade10-site/auction/auction` — catalogue presentation: Featured carousel
  rules, quiet layout (no category section), All auctions resting order,
  infinite-scroll load-more, and Upcoming money withheld until open.

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
- Ended lot-card chrome beyond what Active already shows (Upcoming money
  withheld is in this change).
- Real-time lot-status push on the Featured banner beyond countdown and live
  bid.

## References

- [Auction Display · Catalogue](../../../docs/prds/products/grade10-site/auction/display.md#catalogue)
- [Auction Management · Featured](../../../docs/prds/products/grade10-admin/auction/management.md#featured)
