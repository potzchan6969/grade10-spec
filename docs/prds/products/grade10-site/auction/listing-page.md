---
title: Auction Details
spec: grade10-site/auction/listing-page
order: 12
---

Every lot has an address of its own, and that address answers with the whole
lot before any script runs.

## The Address

- **Served whole** — the lot's name, description, sale and bidding standing
  are in the first response, so a slow phone reads the lot at once and a
  crawler sees what a collector sees
- **One lot per address** — two addresses answer with their own lot, title,
  description and canonical address
- **From the catalogue** — a card opens the lot's address without a page load
- **Not in the sitemap** — which lots are published is unknown when the site
  is built, so no sitemap entry is a lot address; everything else about the
  page as a public surface is [the site's crawlable-pages
  contract](/p/grade10-site/site/crawlable-pages), applied per lot

## Sharing a Link

A shared link unfurls as that lot — its own title, description and canonical
address, never the catalogue's.

## Unknown and Hidden Lots

- **Asked of the catalogue** — whether an id names a published lot is asked at
  the moment the address is requested
- **Not found** — an address naming no lot answers an honest 404 with the
  site's not-found surface, never an empty lot page
- 🚧 **Hidden lots** — the same 404 meets a lot that was published but is now
  Draft or Called off, even at the address it once answered from — [Lot
  Status](/p/grade10-site/auction/lot-status)

## Watching

- **The control** — a signed-in collector watches or unwatches the lot from
  its page and sees whether they watch it; nothing else on the page moves —
  [Watchlist](/p/grade10-site/auction/watchlist)
- 🚧 **With a bid** — while their bid stands on an open lot the control reads
  Watching, disabled: a bid bookmarks the lot
- 🚧 **After the close** — a closed lot shows no watch control
- 🚧 **Watching announced** — watching says email alerts are on for the lot,
  with View My Auctions
- 🚧 **Unwatching announced** — unwatching says the lot left My Auctions, with
  Undo, which restores the watch without finding the lot again
- 🚧 **A first bid** — a bid on the lot announces that email alerts are on,
  once per lot per collector; later visits stay quiet

## After Scripts Load

- **Nothing blanks** — scripts take over the page already served; nothing on
  screen is replaced by a loading placeholder
- **The clock carries on** — a value that follows the clock, the countdown or
  the standing, continues from what was served rather than contradicting it

::story{id="auction-listing-listing-product--default" title="A live lot page, gallery and bid panel assembled"}

::cases{id="grade10-site/auction/listing-page"}

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Watching a lot | Decided | Watching from the lot page is its own part of the capability's map, and [Watchlist](/p/grade10-site/auction/watchlist) owns what a watch means. | Product |
| Watching while a bid stands | 🚧 In flight | A bid keeps the lot watched: the control reads Watching and is disabled until the lot closes, and a closed lot shows no control. | Product |
:::
