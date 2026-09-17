---
title: Auction Listing
order: 11
---

The catalogue lists every lot a collector can see as a card, and opens each
lot at its own address.

## Catalogue Order

🚧 **Resting order** — the catalogue reads in this order, and a collector may
ask for another order the catalogue can answer

| Lot status | Ordered by |
| --- | --- |
| **Active** | Soonest close first |
| **Upcoming** | Soonest start first |
| **Ended** | Most recent close first |

- 🚧 **Paging** — reading the catalogue a page at a time lists the lots in the
  same order as reading it whole, never twice and never skipping one
- ❓ **Sort index** — what the operator's sort index on a listing does to the
  resting order; Product confirms against [Listing
  Management](/p/grade10-admin/auction/listing)

## The Card

- **Picture** — the first item of the lot's
  [gallery](/p/grade10-site/auction/listing-media), at card size; a lot with
  no image still appears, with no placeholder
- **Title and price** — the lot's title and its current price
- **Watch** — the watch control, while the lot is open and the collector has
  no bid on it — [Watchlist](/p/grade10-site/auction/watchlist)
- **Category** — lots are grouped or identifiable by category, and no Buy Now
  listing appears — [Bidding Rules](/p/grade10-site/auction/auction)
- **Hidden lots** — which lots the catalogue never lists, and what a bidder on
  a called-off lot still sees — [Lot Status · Hidden
  Lots](/p/grade10-site/auction/lot-status#hidden-lots)
- ❓ **Listing facts** — which product facts the card carries — grade,
  certificate, set, language — once the inventory unit and its attributes
  reach the listing; Product confirms against [Listing
  Management](/p/grade10-admin/auction/listing)

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Its own capability | ❓ Open | The catalogue's order is a requirement of [Bidding Rules](/p/grade10-site/auction/auction)'s spec and its card ships as a shared block; no capability states the rest of the browse surface. Product confirms whether the catalogue is specified on its own or under [Listing Page Blocks](/p/shared/ui/auction-listing). | Product |
:::
