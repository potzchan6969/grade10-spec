**Author:** @ecchochan - 2026-09-14

## Why

A collector who searches for a card should land on the page that sells it. The
site has no rule saying which address that is: nothing stops one item from
answering in two channels, nothing decides whether a subcategory or a seller is
a path or a query, and nothing says what a replaced address does. Today the
site happens to hold the line — the store and the auction each answer an item
once, every narrowing rides the query, and the shop's old `/products/` and
`/collections/` addresses redirect permanently — but it holds by construction
rather than by a rule, so the first channel or seller page added takes it away
without anybody noticing.

The auction's own catalogue already shows the cost of an unwritten rule. Its
resting order sorts ended lots ahead of live ones, and the site only looks
right because the page re-sorts everything it fetched; a crawler reading the
catalogue a page at a time is shown ended lots first, and two lots that tie
change places between reads.

Addresses a search engine holds per item is unmeasured; the first delivery sets
the baseline, and the number that should move is how many of them it holds for
one thing.

## What Changes

- **One item, one address** — the channel an item sells in is fixed at first
  publication, and no other channel's address answers with that item
- **A channel's paths stop at its top-level category** — a subcategory, a
  publisher, a brand, a theme, a grade, a year, an order or a seller's items
  narrows a channel through its query; the canonical address is the channel's
  own, without the narrowing
- **One identity address** — a seller or a shop the site names answers at one
  address, shared by every channel
- **A replaced address redirects permanently** — and is named in no link, no
  canonical tag and no sitemap entry
- **The auction catalogue's resting order is total** — lots open for bidding by
  soonest close, then lots not yet started by soonest start, then ended lots by
  most recent close, ties settled on the lot record, the same order whole or a
  page at a time

## Non-Goals

- **Which channels the site sells through** — the rules bind any channel; they
  add none
- **A seller page, or a marketplace channel** — neither is built or designed
- **The store listing's resting order** — `default-listing-sort-to-latest`
  owns it
- **Ranking** — nothing here is about where a page places in a result list

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `grade10-site/site/crawlable-pages`: one address per item, narrowing in the
  query, one shared identity address, and a permanent redirect from a replaced
  address
- `grade10-site/auction/auction`: the catalogue's resting order is total and
  holds under paging

## Impact

- **Grade10 site** — the auction catalogue's read supplies the resting order
  rather than the page re-sorting what it fetched; the serving half already
  answers the addressing rules and gains the tests that hold it there
- **Grade10 admin** — publishing an item names the channel once; a second
  channel for the same item is refused
- **ZZZ** — unchanged; the same rules bind its channels when it answers any
- **Scenario ids** — crawlable-pages SC-16 to SC-24 added; auction SC-19 to
  SC-22 added
- **Depends on** — `add-collector-lot-status` for Upcoming, Active and Ended,
  the statuses the auction order groups by

## Follow-on changes

- A seller's own page, once what it holds is decided — the one address every
  channel links to
- A marketplace channel, arriving bound by these rules rather than needing them
  written again

## References

- [Crawlable Pages · One Address Per Thing](../../../docs/prds/products/grade10-site/site/crawlable-pages.md#one-address-per-thing)
- [Auction Display · Auction Listing](../../../docs/prds/products/grade10-site/auction/display.md#auction-listing)
