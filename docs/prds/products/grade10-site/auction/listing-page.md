---
title: Listing Details Page
spec: grade10-site/auction/listing-page
order: 2
---

Every lot has an address of its own, and that address does the work before any
script runs: the lot's name, description, sale and bidding standing are all in
the first response. A collector on a slow phone can read the lot immediately,
and a crawler sees the same thing they do.

Sharing the link unfurls as that lot — its own title, description and canonical
address, never the catalogue's. Whether an id names a published lot is asked of
the catalogue at the moment the address is requested, so an address naming no
lot answers an honest 404 with the site's not-found surface rather than an
empty lot page.

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

## What a collector does

::journeys{id="grade10-site/auction/listing-page"}
