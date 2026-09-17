# UI: watching a listing

**Terminology.** Surfaces may say **lot** in copy — that word labels a
**listing** (`listingLabel` / `lotLabel`). There is no separate lot entity;
stories and states below are listing surfaces.

**Watch vs email alerts.** Watching is list membership. Email alerts are a
separate per-lot preference (default on when watching). Unwatch removes the
lot from Watching and turns alerts off. Mute is not Unwatch. Account →
Notifications holds the global **Auction email alerts** master; when it is
off, per-lot toggles show off or disabled with explanation.

## Screens

This change designs in code and Storybook, not Figma. Listing and catalogue
watch controls are already filled in the application; My Auctions is composed
from `@grade10/ui` `AuctionRecord` and previewed under
**Auction Record / AuctionRecord**.

| Screen | Storybook | What is new on it |
| --- | --- | --- |
| Auction listing page — header | Application / `ListingLotHeader` | Watch control (design-system `Button` + Bell) |
| Auction catalogue — listing tile | Application surface | Watch control on the tile |
| My Auctions | `Filled`, `Bidding only`, `Watching only`, `Empty`, `Closed and called off`, `Unavailable`, `Bid-on mark`, `Unwatch`, `Email alerts muted`, `Email alerts pending`, `Email alerts master off` | Account page: breadcrumbs, title, **Bidding** then **Watching** sections; per-row **Email alerts** toggle + **Unwatch** on Watching; **Email alerts** on Bidding; lot key image; state badge; bid-on mark |

**Placement.** My Auctions in the account area. Entrance copy names **lots** /
auction so the list is not read as a store watchlist. No header-only
destination in this change. Bidding and Watching are **sections**, not tabs.
Do not put the account master only as a matrix on My Auctions.

**Section order.** **Bidding first, Watching second** — a lot holding the
collector's money outranks one they are only following. Each heading carries
its row count. Watchlist domain order is Watched At descending inside
Watching.

**Row anatomy.** Key image, lot title, then facts in their own labelled cells
— **Current bid** as the weighted amount, **Closes** as the time. Facts are
never joined by a middle dot; the row's grammar is cells, not a sentence.
State is a design-system `Badge` toned by state (open success, ending soon
warning, outbid error, closed neutral), not grey body text. Actions sit right
of the facts: state badge, bid-on mark, Email alerts, Unwatch.

**Unavailable listings.** A watch whose listing is no longer published stays
until unwatch. The row shows an honest unavailable label, keeps unwatch and
email alerts, and does not open a listing URL. Watchlist SC-13 vs listing-page
404 needs a product/spec reconcile when folding.

**Watch control.** List unwatch uses the same `WatchButton` treatment as
`ListingLotHeader` on the lot details page (outline `Button`, Bell /
BellSlash).

**Email alerts control.** Design-system `Switch` in a bell-marked pill beside
Unwatch. Label, aria copy, the master-off reason, and the toast wording are
application-owned. Bidding rows carry the same toggle without Unwatch. One
row's toggle changes that row only.

**Feedback.** Muting or unmuting a lot toasts once the application confirms
the new value — a design-system `Toast` the application mounts at its root,
worded per lot ("It stays on Watching" for a watched lot, "Your bid stands"
for one they bid on). While a change is in flight the switch is busy and
locked. Unwatch keeps its own toast with Undo.

## Components

| Export | Change |
| --- | --- |
| `AuctionRecord` | **New.** Page body: breadcrumbs slot, `h1`, Bidding / Watching sections with counts, or one `EmptyState` |
| `ListingLotHeader` | **No change.** Reference for watch control. |
| `AuctionRecordRow` | Key image; state `Badge`; labelled `currentBid` / `closesAt` cells; Email alerts pill with confirmed-change toast; Unwatch; bid-on mark; unavailable without listing navigation |
| `WatchButton` | Design-system `Button` + Bell, aligned with lot details |
| `AuctionRecordEmpty` | Design-system `EmptyState` + `Button` |
| `AuctionRecordTabs` | Transitional only; new assemblies use `AuctionRecord` |

Toast + Undo after unwatch stay application-owned; toast copy notes that
email alerts stop too when they were on.

## States

| State | Scenario | Storybook |
| --- | --- | --- |
| Not watching | `grade10-site-auction-watchlist-SC-02` | `Watch control` |
| Watching | `grade10-site-auction-watchlist-SC-01` | Lot details application surface |
| Watched list, populated | `grade10-site-auction-watchlist-SC-11` / SC-15 | `Filled` / `Watching only` / `Bidding only` |
| Watched list, empty | `grade10-site-auction-watchlist-SC-12` | `Empty` |
| Watched entry, closed | `grade10-site-auction-watchlist-SC-16` | `Closed and called off` |
| Watched entry, called off | `grade10-site-auction-watchlist-SC-17` | `Closed and called off` |
| Watched entry, unavailable | account-record SC-07 | `Unavailable` |
| Bid-on mark → Bidding | account-record SC-12 | `Bid-on mark` |
| Unwatch from the list | `grade10-site-auction-watchlist-SC-18` | `Unwatch` |
| Watching + alerts muted | `grade10-site-auction-watchlist-SC-19` | `Email alerts muted` |
| Alerts change in flight | `grade10-site-auction-watchlist-SC-19` | `Email alerts pending` |
| Account master off | notifications account master | `Email alerts master off` |
