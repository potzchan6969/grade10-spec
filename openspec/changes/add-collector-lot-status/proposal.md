**Author:** @jeffffej0909 - 2026-09-11

Product context: [Lot Status](../../../docs/prds/products/grade10-site/auction/lot-status.md).

## Why

A collector reading a lot meets whichever status label the screen in front of
them happened to pick. The site's copy carries seven labels for three situations —
**Upcoming**, **Live**, **Extended** and **Closed** on the lot surfaces;
**Scheduled**, **Open** and **Ended** on My Auctions — and no spec says which
one a collector should read. The operator's outcome list, the only status
vocabulary specified, keeps moving for operator reasons: Ending soon and
Expired have left it and Canceled became Called off within one fortnight.
Collector screens built on it inherit every rename.

Lots that did not sell also stay in front of collectors. A closed lot's page
keeps answering; the watched list shows a called-off lot as called off; My
Auctions keeps an unsold lot while it stays published. A collector meets lots
they can do nothing with.

**Metric:** distinct lot-status labels on collector surfaces — seven today, three
when this ships.

## What Changes

- **Three collector statuses.** **Upcoming** — published, bidding not open.
  **Active** — bidding open, extended bidding included. **Ended** — bidding over
  with a winner, whatever the state of the winner's order.
- **Derived, never stored.** The status is read from the lot's outcome and
  times, so it cannot disagree with them.
- **Hidden lots.** A lot that is Draft, ended Unsold, or Called off appears on no
  collector surface: not in the catalogue, not at its own address — which
  answers not found — and not on the watched list.
- **One exception.** A collector who bid on a called-off lot still reads it in
  My Auctions, with what happened to their card hold.
- **The public listing read carries the collector status**, so every surface
  uses the same status.
- **Display is the designer's.** This change fixes the statuses and the mapping;
  whether and where a screen shows them is decided in design.

**BREAKING:** unsold and called-off lots stop answering at their own address,
and leave the watched list.

## Non-Goals

- **Operator outcomes.** The queue keeps its own list, unchanged.
- **Order statuses.** A winner's order — Pending Payment, Shipped and the rest —
  stays a separate fact on their own record.
- **How any screen shows the status**, or retiring today's mixed copy. Both are
  design's.
- **Bidding history's Active and Completed filters.** They filter a collector's
  own bids, not a lot's status.
- **The catalogue's Ending soon filter and the one-hour reminder.** Neither is a
  lot status.

## Capabilities

### New Capabilities

- `grade10-site/auction/lot-status`: the three collector statuses, their
  mapping from a lot's outcome, which lots no collector surface shows, and the
  status in the public listing read.

### Modified Capabilities

- `grade10-site/auction/listing-page`: an address naming a hidden lot answers
  not found, like one naming no published lot.

## Impact

- **Auction service** — derives the collector status; drops hidden lots from
  collector reads and from the watched list.
- **Public listing read** — adds the collector status.
- **Grade10 site** — catalogue, lot page, watched list and My Auctions read the
  new status and stop showing hidden lots. Which of them display the status is
  design's.
- **Component exports** — none added or changed here.

Changes whose rules this one overrides for hidden lots:

| Change or spec | Says today | Needs |
| --- | --- | --- |
| `add-auction-watchlist` SC-16, SC-17 and the watchlist page's "Survives close" decision | A closed or called-off lot stays on the list | An unsold or called-off lot leaves it |
| `redesign-my-auctions-table` SC-10, SC-40 | A closed, published lot stays on My Auctions, unsold and called off included | Unsold and called-off lots leave it, except for their bidders |
| `grade10-admin/auction/listing` SC-22 | A closed listing's address still returns it | True for a won lot only |
| `revise-auction-extended-bidding` | — | Nothing. A lot in extended bidding is Active |

## Follow-on changes

- Design decides which collector surfaces show the status, and how.
- Today's mixed status copy is retired in favour of the three statuses.
