---
title: Listing Page Blocks
spec: shared/ui/auction-listing
order: 6
reviewed: 2026-09-14
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

## Personal Bidding

The bid card may carry a personal-bidding accessory beside the public
recent-bids label. That block is for the signed-in owner only. When the
consumer supplies accepted-bid rows, a link opens a dialog of amount and
time with a same-price priority note and no bid-type column; empty rows
hide the link. Every label arrives through props.

- 🚧 **Your bidding** — the link and dialog title cover both maximum history
  and bids Grade10 placed
- 🚧 **Two tabs** — **Bid placed**, then **Your maximums**, each with its
  own scrollable table; not one merged table and not two stacked full tables
- 🚧 **Default tab** — **Bid placed** whenever the dialog opens (empty bids
  state when that list has no rows)
- 🚧 **Maximum rows** — amount and time only; no **Set** / **Raised** status
  on the row
- 🚧 **No dialog maximum summary** — the live private maximum stays on the
  bid panel; this block is tabs and lists only
- 🚧 **Copy from the application** — every label, description, empty state,
  and column header arrives through props; the block supplies none of its own
- 🚧 **Hidden when idle** — with no maximum rows and no bid-sequence rows,
  the link and dialog are absent


## Bid Panel Fee

🚧 **Buyer fee on the panel** — under the bid action, always-on secondary copy
states that a 20% buyer fee is added on top of the winning bid. The rate is not
behind a tooltip.

## Lost Standing

**No release banner on the lot card** — when the viewer lost, the bid card
shows Did not win without card-authorization-release banner copy. Hold release
copy on My Auctions stays with that capability when a hold exists.

## Extended Bidding Copy

🚧 **Time left tooltip** — names the listing's extension duration only: after
the scheduled close, each bid restarts that timer, until it runs out with no
new bid, up to the listing cap. It does not name an extension window. When the
lot is in extended bidding, the Time left label reads **Time left (extended)**.

::story{id="auction-listing-listinggallery--distinct-sources" title="One image with separate thumb, main and zoom sources"}

::story{id="auction-listing-listinggallery--single-image" title="A single-image gallery, with no strip"}

::story{id="auction-listing-listingauctionbidcard--outbid" title="The bid panel after being outbid"}

::story{id="auction-listing-listingdetails--default" title="The details section"}

:::callout{kind="note"}
No auction block is mapped to a Figma node — no frame, no audit table, no code
mapping. The listing details page is the largest surface in the system with no design
counterpart, so these stories are its reference until frames are produced.
:::

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Bid enrollment | Open | Twelve scenarios cover the enrollment setup blocks, their gates, and the signal the bid card reads — a feature the size of the gallery — and no part of the feature set named it. Named as its own part of the map. Confirm, or fold it into the bid panel's part. | Product |
:::
