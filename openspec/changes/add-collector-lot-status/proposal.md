**Author:** @jeffffej0909 - 2026-09-11

Product context: [Lot Status](../../../docs/prds/products/grade10-site/auction/lot-status.md).

## Why

Collector pages use seven different labels for three lot statuses:

- **Lot pages and catalogue** — Upcoming, Live, Extended, Closed
- **My Auctions** — Scheduled, Open, Ended, Closed

No spec says which label to use. The only status list in the specs is the
internal lot status, and it changes for operator needs. In the past two weeks,
Ending soon and Expired were removed, and Canceled became Called off. Collector
pages built on that list change every time it does.

Collectors also see lots that nobody can buy. A closed lot's page still opens.
The watchlist shows called-off lots. My Auctions shows unsold lots while they
stay published.

**Metric:** number of different lot status labels on collector pages. 7 today,
3 after this change.

## What Changes

- **External lot status** — a new status for collectors, with three values:
  - **Upcoming** — published, bidding has not started
  - **Active** — bidding is open, including extended bidding
  - **Ended** — bidding is over and the lot has a winner, whatever the state of
    the winner's order
- **Mapping** — each internal lot status maps to one external lot status, or
  is hidden:

  | Internal lot status | External lot status |
  | --- | --- |
  | Draft | Hidden |
  | Scheduled | Upcoming |
  | Live | Active |
  | Unsold | Hidden |
  | Called off | Hidden |
  | Awaiting Address | Ended |
  | Preparing Invoice | Ended |
  | Pending Payment | Ended |
  | Processing | Ended |
  | Shipped | Ended |
  | Delivered | Ended |
  | Cancelled | Ended |
  | Refunded | Ended |

- **Worked out, not saved** — the external lot status comes from the lot's
  internal status and times, so the two always agree
- **Hidden lots** — collectors never see a lot that is Draft, Unsold or Called
  off. It is not in the catalogue or on the watchlist, and its address shows
  the Page not found screen
- **Bidder exception** — a collector who bid on a called-off lot still sees it
  in My Auctions, with the note that their card hold was released
- **Listing data** — the public listing data includes the external lot status,
  so every page uses the same value
- **Display** — the designer decides which pages show the status, and how

**BREAKING:** unsold and called-off lots no longer open at their own address,
and are removed from the watchlist.

## Non-Goals

- **Internal lot status** — the operator queue keeps its own list, unchanged
- **Order status** — the winner's order status, such as Pending Payment or
  Shipped, is shown separately on their own record
- **Display and labels** — how pages show the status, and replacing today's
  labels, are design work
- **Bidding history filters** — Active and Completed filter the collector's own
  bids, not the lot status
- **Ending soon filter and one-hour reminder** — neither is a lot status

## Capabilities

### New Capabilities

- `grade10-site/auction/lot-status`: the external lot status, how it maps from
  the internal lot status, which lots collectors never see, and the status in
  the public listing data.

### Modified Capabilities

- `grade10-site/auction/listing-page`: the address of a hidden lot shows Page
  not found, the same as an address with no published lot.

## Impact

- **Auction service** — works out the external lot status, and leaves hidden
  lots out of collector data and the watchlist
- **Public listing data** — adds the external lot status
- **Grade10 site** — the catalogue, lot page, watchlist and My Auctions use the
  new status and stop showing hidden lots. The designer decides which of them
  display it
- **Component exports** — none added or changed

This change overrides these rules for hidden lots:

| Change or spec | Says today | Needs to say |
| --- | --- | --- |
| `add-auction-watchlist` SC-16, SC-17, and the watchlist page's "Survives close" decision | Closed and called-off lots stay on the watchlist | Unsold and called-off lots are removed |
| `redesign-my-auctions-table` SC-10, SC-40 | Closed lots stay on My Auctions while published, including unsold and called-off lots | Unsold and called-off lots are removed, except for collectors who bid |
| `grade10-admin/auction/listing` SC-22 | A closed lot's address still opens the lot | Only for a lot with a winner |
| `revise-auction-extended-bidding` | — | No change. A lot in extended bidding is Active |

## Follow-on changes

- The designer decides which collector pages show the external lot status, and
  how.
- Today's mixed labels are replaced with the three external lot statuses.
