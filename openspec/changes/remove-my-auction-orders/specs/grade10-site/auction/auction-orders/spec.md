# grade10-site/auction/auction-orders Specification

## Purpose

Retired - there is no separate auction orders list. My Auctions lists the
collector's won lots and each Won row opens that lot's Winner Order; this
capability remains only to hold that no such page is served.

## Feature set

- **Order list**
  - Rows: retired with the page
  - Ordering: retired with the page
  - Entry points: retired with the page - a Won row on My Auctions opens its
    own order, per `grade10-site/auction/account-record`
- **Row actions**
  - View lot: retired with the page
  - Next action: retired with the page
- **Honest reads**
  - Owner only: retired with the page
  - Empty and failed: retired with the page

## ADDED Requirements

### Requirement: No separate auction orders page is served

The site SHALL NOT serve a list of the collector's auction orders apart from
My Auctions. Each won order SHALL be opened from its Won row on My Auctions,
per `grade10-site/auction/account-record`.

<!-- trace:scenario id=g10.auction-auction-orders.SC-ha6 rev=1 -->
#### Scenario: grade10-site-auction-auction-orders-SC-12 - No orders list beside My Auctions
**Serves:** `Order list` - the retired page answers nothing on its own address

- **WHEN** the site's surfaces are listed
- **THEN** none of them is a My Auction Orders list

## REMOVED Requirements

### Requirement: The list holds one row per won order

**Reason:** There is no My Auction Orders page. The list duplicated the Won
rows My Auctions already renders, and nothing on the site reached it.

**Migration:** The collector's won lots stay listed on My Auctions, per
`grade10-site/auction/account-record`; each Won row opens its order per
`grade10-site/auction/winner-order`. Its scenarios retire with it.

### Requirement: Each row offers View lot and the action its status needs

**Reason:** There is no My Auction Orders page to carry the rows.

**Migration:** A Won row's entry point to its order is
`grade10-site/auction/account-record`'s, and the order's actions are
`grade10-site/auction/winner-order`'s. Its scenarios retire with it.

### Requirement: Empty and failed reads

**Reason:** There is no My Auction Orders page to read.

**Migration:** My Auctions' own empty and failed reads are
`grade10-site/auction/account-record`'s. Its scenarios retire with it.
