---
title: Listing Page Blocks
spec: shared/ui/auction-listing
order: 6
---

Three blocks make an auction lot page: the media gallery, the bid panel, and the
details section. The gallery works without the bid panel, so a lot can be shown
before it can be bid on.

Each gallery image may name its own thumbnail, main-frame and zoom source, and
falls back to the main source when a thumb or a zoom is not given — one image
can therefore be a small file in the strip and a large one under the magnifier.
With a single item the gallery shows no thumbnail strip; with several it does.

The bid history keeps each accepted instant as data and lets the collector read
recent activity in relative form and older activity in the stated local time
zone. The application supplies the locale, time zone, and activity copy; a
non-timestamp state may supply its own display text. Collector deadline lines
use the same locale and stated time zone.

Every accessible name and every label comes from the application. What a bid
does, and what it must clear, belongs to [the auction](/p/grade10-site/auction).

::story{id="auction-listing-listinggallery--distinct-sources" title="One image with separate thumb, main and zoom sources"}

::story{id="auction-listing-listinggallery--single-image" title="A single-image gallery, with no strip"}

::story{id="auction-listing-listingauctionbidcard--outbid" title="The bid panel after being outbid"}

::story{id="auction-listing-listingdetails--default" title="The details section"}

:::callout{kind="note"}
No auction block is mapped to a Figma node — no frame, no audit table, no code
mapping. The listing details page is the largest surface in the system with no design
counterpart, so these stories are its reference until frames are produced.
:::
