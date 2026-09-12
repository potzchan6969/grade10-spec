**Author:** @tangconst - 2026-09-10

Product context: [My Auctions](../../../docs/prds/products/grade10-site/auction/account-record.md).
UI source: Figma `Auction Watchlist` (`6507:5463`) in Grade10-DS-2026 — the
table block only; page title stays on the existing `AuctionRecord` shell.

## Why

A collector who both watches and bids today meets two sections on My Auctions
— Bidding then Watching — and a lot that is both appears twice with a mark
to jump between them. Standing, mute, and unwatch live in different clusters,
so "what am I following?" and "where do I stand?" are two scans rather than
one. The approved table presents every bookmarked lot once.

**Metric:** record-page reach and outbid recovery rate on
[My Auctions](../../../docs/prds/products/grade10-site/auction/account-record.md)
(existing signals). **Acceptance signal:** a collector with watch-only and
bid lots sees one table, bid lots first, `--` where they have not bid, and a
count beside **My Auctions** that matches the rows.

## What Changes

- **One My Auctions table** replaces the Bidding and Watching sections. Every
  bookmarked lot is one row.
- **A bid bookmarks the lot.** Placing a bid enrolls the listing on My
  Auctions with no separate Watch. Watching remains available before a bid.
- **Row order:** lots with a bid first, then watch-only; within each band,
  soonest close first, closed after open.
- **Your Standing:** bid standing while open (Leading, Outbid, Bid submitted,
  Bid not accepted); after close, Won / Didn't win with the
  `order-status` vocabulary on Won (Pending Payment, Expired, Processing,
  Shipped, Delivered, Cancelled, Refunded) and hold projections on Didn't
  win. Watch-only shows `--`. Scheduled, Live, Ending soon, and Active are
  not standing values (close stays under the title).
- **Title badge:** count of rows (= every watched / bookmarked lot).
- **Unwatch** only on rows with no bid — same job as today's watch control.
  A bid row offers Email alerts only; unwatching never applies while a bid
  stands on that listing.
- **Email alerts** remain per row for every lot on the table.
- **A row leaves** when Grade10 unpublishes or removes the listing (including
  an unsold lot taken down). Closed Won / Didn't win rows that stay published
  remain.
- **BREAKING (shared UI):** `AuctionRecord` is the page body with title,
  watching-count badge, and one table (or one empty state). `AuctionRecordRow`
  is a table row. `WatchingList` and `BiddingList` leave the required export
  set. `AuctionRecordTabs` stays transitional. New export names (if any) are
  confirmed when delivery is planned — none are required beyond reshaping the
  existing surface.
- Supersedes the "two sections / two pages" presentation decision on My
  Auctions; detailed Bidding History remains its own capability.

## Non-Goals

- Clearing or archiving bid history from this page.
- Filters, search, or sort controls beyond the fixed bid-first / soonest-close
  order.
- Changing mail kinds, mute semantics, or the account email-alerts master —
  those stay on notifications / watchlist work.
- A full-page Figma frame; title and badge compose on the existing shell.
- ZZZ account auction surface.
- Reworking Bidding History's index, filters, or Active / Completed groups.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/account-record`: one-table My Auctions, bid enrolls
  bookmark, standing column, unwatch-only-without-bid, badge count, drop
  section landing and bid-on mark, row removal when unpublished / removed.
- `shared/ui/auction-record`: export and presentation contract for the table
  page body and row (Figma `Auction Watchlist`). `WatchButton`'s own
  behaviour — locked Watching, toast copy — is `lot-page-watch-alerts`'
  block on the surface's reporting requirement, so the two changes do not
  both fold it.

## Impact

- `packages/ui` auction-record blocks and stories; `packages/i18n`
  `auctionRecord` copy (column labels, `--`, drop section headings).
- Grade10 site My Auctions composition and any host that still passes
  separate bidding / watching lists.
- Overlaps in-flight `add-auction-watchlist` and `add-account-notifications`
  My Auctions mute UI — those changes' section-based copy must follow this
  table once it lands.
- A won row's Your Standing carries whatever the winner's payment and
  shipment requirement states; `revise-auction-winner-invoicing` folds that
  requirement, so this change does not restate it and the two account-record
  deltas do not fight at archive.
- Manual pages: [My Auctions](../../../docs/prds/products/grade10-site/auction/account-record.md)
  and [Auction Record Blocks](../../../docs/prds/products/shared/ui/auction-record.md).

## Follow-on changes

- Align the in-flight watchlist and notifications My Auctions mute copy with
  the single table once this change archives.
- Archive after `add-auction-winner-journey` (or drop that change's
  account-record winner delta) so the shared winner-standing requirement is
  not reverted by a second fold.
