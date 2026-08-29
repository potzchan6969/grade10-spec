---
title: The auction lot blocks
summary: The gallery, bid panel and details section every auction storefront composes into a lot page.
spec: shared-ui/auction-listing
order: 6
---

Three blocks make an auction lot page: the media gallery, the bid panel, and the
details section. The gallery works without the bid panel, so a lot can be shown
before it can be bid on.

Each gallery image may name its own thumbnail, main-frame and zoom source, and
falls back to the main source when a thumb or a zoom is not given — one image
can therefore be a small file in the strip and a large one under the magnifier.
With a single item the gallery shows no thumbnail strip; with several it does.

::spec{id="shared-ui/auction-listing" requirement="A control has no copy of its own"}

Every accessible name and every label comes from the application. What a bid
does, and what it must clear, belongs to [the auction](/p/grade10-auction).

::story{id="auction-listing-listinggallery--distinct-sources" title="One image with separate thumb, main and zoom sources"}

::story{id="auction-listing-listinggallery--single-image" title="A single-image gallery, with no strip"}

::story{id="auction-listing-listingbidpanel--outbid" title="The bid panel after being outbid"}

::story{id="auction-listing-listingdetails--default" title="The details section"}

:::callout{kind="note"}
No auction block is mapped to a Figma node — no frame, no audit table, no code
mapping. The lot page is the largest surface in the system with no design
counterpart, so these stories are its reference until frames are produced.
:::

:::callout{kind="note"}
This spec's purpose still opens "This change records…", language left over from
the change it was folded in from. It describes a durable contract, not a change.
:::

## The contract

::spec{id="shared-ui/auction-listing"}
