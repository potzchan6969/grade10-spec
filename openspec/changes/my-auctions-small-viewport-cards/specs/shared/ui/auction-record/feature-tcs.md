## shared-ui-auction-record-US1: The record surface exports

**As an** application composing My Auctions,
**I want** the shared auction-record blocks to present bookmarked lots,
**so that** collectors can act on every lot without losing facts on a small
viewport.

### shared-ui-auction-record-US1-TC20-1: Below md each lot is a card without sideways scroll

**Trace:** shared-ui-auction-record-SC-17

| | |
| --- | --- |
| Level | Feature |
| Priority | Must |
| Type | Functional |

**Preconditions**

* Storybook or preview renders `AuctionRecord` with at least one bidding lot
  and one watching lot at a viewport below `md`.

**Steps**

1. Open My Auctions below `md`.
2. Read each lot's identity, current bid, and Status without panning sideways.
3. Reach Email alerts and Unwatch or View order on a lot that supplies them.

**Expected**

* Each lot is a stacked card with identity, inline current bid, Status badge
  when labelled, and a footer for alerts / Unwatch / View order when supplied.
* Those facts and actions are reachable without horizontal scroll of the page
  content.
* The table column header row is not shown.

### shared-ui-auction-record-US1-TC21-1: From md the five-column table remains

**Trace:** shared-ui-auction-record-SC-18

| | |
| --- | --- |
| Level | Feature |
| Priority | Must |
| Type | Functional |

**Preconditions**

* Storybook or preview renders `AuctionRecord` with at least one bidding lot
  and one watching lot at a viewport from `md` up.

**Steps**

1. Open My Auctions from `md` up.
2. Read the column header row and the table body.

**Expected**

* Lots appear in one five-column table with the column header row.

### shared-ui-auction-record-US1-TC22-1: Below md the whole card opens the lot or order

**Trace:** shared-ui-auction-record-SC-19

| | |
| --- | --- |
| Level | Feature |
| Priority | Must |
| Type | Functional |

**Preconditions**

* Storybook or preview renders `AuctionRecord` below `md` with a won lot whose
  `href` opens Winner Order and a watching lot with Unwatch and Email alerts.

**Steps**

1. Activate the won lot's card body (not Unwatch or Email alerts).
2. On a watching card, mute Email alerts and Unwatch without activating the
   card body.

**Expected**

* The won card body opens the supplied Winner Order `href`.
* Email alerts and Unwatch still change only that lot; they do not open the
  card's `href`.

## Reconciliation

| Blind outcome | Resolution |
| --- | --- |
| Below md each lot is a card without sideways scroll | Folded as covered by `shared-ui-auction-record-SC-17` / `shared-ui-auction-record-US1-TC20-1` |
| From md the five-column table remains | Folded as covered by `shared-ui-auction-record-SC-18` / `shared-ui-auction-record-US1-TC21-1` |
| Below md the whole card opens the lot or order | Folded as covered by `shared-ui-auction-record-SC-19` / `shared-ui-auction-record-US1-TC22-1` |
