---
title: Listing Details Page
spec: grade10-site/auction/listing-page
order: 12
---

Every lot has an address of its own, and that address does the work before any
script runs: the lot's name, description, sale and bidding standing are all in
the first response. A collector on a slow phone can read the lot immediately,
and a crawler sees the same thing they do.

Sharing the link unfurls as that lot — its own title, description and canonical
address, never the catalogue's. It carries no picture: a lot's images are the
auction's own, and the sizing a store card's preview picture rests on is the
shop CDN's. Whether an id names a published lot is asked of the catalogue at
the moment the address is requested, so an address naming no lot answers an
honest 404 with the site's not-found surface rather than an empty lot page.
🚧 The same 404 meets a lot that was published but is now hidden — Draft or
Called off, per [Lot Status](/p/grade10-site/auction/lot-status) — even at the
address it once answered from.

When scripts do load, they take over the page that was already served. Nothing
on screen is replaced by a loading placeholder, and a value that follows the
clock — the countdown, the standing — carries on from what was served instead
of contradicting it.

Lot addresses are absent from the sitemap on purpose: which lots the auction
publishes is unknown when the site is built. Everything else about this page
as a public surface — its title, description, share metadata and status codes —
is [the site's crawlable-pages contract](/p/grade10-site/site/crawlable-pages),
applied per lot.

::story{id="auction-listing-listing-product--default" title="A live lot page, gallery and bid panel assembled"}

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Watching a lot | Open | The page has offered a watch control for some time and the feature set never said so, while two changes in flight build on it. Named as its own part of the map. Confirm, or fold it where it belongs. | Product |
:::
