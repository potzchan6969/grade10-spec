---
title: Listing Page Blocks
spec: shared/ui/auction-listing
order: 6
---

Three blocks make an auction lot page: the media gallery, the bid panel, and
the details section. Every label and accessible name comes from the
application; what a bid does, and what it must clear, belongs to [Bidding
Rules](/p/grade10-site/auction/bidding#auction-logic).

## Values

| Rule | Value |
| --- | --- |
| Buyer fee on the panel | 🚧 **20%** on top of the winning bid, always on, never behind a tooltip |
| Quick bids | 🚧 Three chips at **1×**, **2×** and **4×** the listing increment |
| Custom maximum | 🚧 Whole major units only, up to **9,999,999,999** |
| A leader's typed raise | 🚧 Starts at their maximum plus **100 minor units** |

## Gallery

- **Own sources** — each image may name its own thumbnail, main-frame and
  zoom source, and falls back to the main source when a thumb or a zoom is
  not given, so one image can be a small file in the strip and a large one
  under the magnifier
- **The strip** — one item shows no thumbnail strip; several do; no items
  render nothing and offer no previous or next
- **On its own** — the gallery renders without the bid panel, so a lot can
  be shown before it can be bid on

## Bid History

- **Accepted instants** — each row keeps the accepted time as data
- **Localized** — recent activity reads in relative form and older activity
  in the stated local time zone; the application supplies the locale, the
  time zone and the activity copy, and a non-timestamp state may supply its
  own display text; collector deadline lines use the same locale and zone

## Personal Bidding

The bid card may carry a personal-bidding accessory beside the public
recent-bids label, for the signed-in owner only.

- **Your bidding** — the link and dialog title cover both maximum history and
  bids Grade10 placed
- **Two tabs** — **Bid placed**, then **Your maximums**, each with its own
  scrollable table; not one merged table and not two stacked full tables
- **Default tab** — **Bid placed** whenever the dialog opens, with an empty
  bids state when that list has no rows
- **Maximum rows** — amount and time only; no **Set** / **Raised** status on
  the row
- **No dialog maximum summary** — the live private maximum stays on the bid
  panel; this block is tabs and lists only
- **Copy from the application** — every label, description, empty state and
  column header arrives through props; the block supplies none of its own
- **Hidden when idle** — with no maximum rows and no bid-sequence rows, the
  link and dialog are absent

## Bid Enrollment

The bid card reads one enrollment signal and shows standing, or disables what
a collector cannot yet do — [Bid Panel
Enrollment](/p/grade10-site/auction/bidding#auction-panel).

| Signal | The card |
| --- | --- |
| **signed-out** | The primary action carries the sign-in label; no place bid, no link a card, no standing banner, no fee line |
| **needs-card** | Quick bids and the custom field are disabled; the primary action opens setup |
| **ready** | Everything enabled; a maximum commits through the card |

- **Setup blocks** — the enrollment setup blocks are named exports;
  continuing waits on a card and an attestation, and says which is missing

## Custom Maximum

Under Set your private maximum, an always-on line says that Grade10 bids only
as needed up to the maximum and that it can be raised but never lowered or
cancelled; when holds are on it also says the hold matches the maximum.

- 🚧 **Whole units only** — a typed decimal mark is refused, and a pasted
  fraction keeps its whole major units with no rounding
- 🚧 **Ceiling** — a maximum above 9,999,999,999 whole major units cannot be
  typed or pasted; the previous valid draft stays, nothing is clamped
- 🚧 **Quick bids** — three chips at 1×, 2× and 4× the listing increment:
  from the current bid when the collector does not lead, from their committed
  maximum when they do
- 🚧 **A leader's typed raise** — starts at the greater of the listing's next
  minimum and their maximum plus 100 minor units; that floor is not the first
  chip
- **A moved floor** — Place Bid is the commitment, and a floor that moved
  meanwhile uses the panel's stale-floor recovery

## Bid Panel Fee

- 🚧 **Buyer fee on the panel** — under the bid action, always-on secondary
  copy states that a 20% buyer fee is added on top of the winning bid; the
  rate is not behind a tooltip, and the line is omitted with the bid action
  when the viewer is signed out

## Lost Standing

- **No release banner on the lot card** — when the viewer lost, the bid card
  shows Did not win without card-authorization-release banner copy; hold
  release copy on My Auctions stays with that capability when a hold exists

## Extended Bidding Copy

- 🚧 **Time left tooltip** — names the listing's extension duration only:
  after the scheduled close, each bid restarts that timer, until it runs out
  with no new bid, up to the listing cap; it does not name an extension
  window, and while the lot is in extended bidding the Time left label reads
  **Time left (extended)**

::story{id="auction-listing-listinggallery--distinct-sources" title="One image with separate thumb, main and zoom sources"}

::story{id="auction-listing-listinggallery--single-image" title="A single-image gallery, with no strip"}

::story{id="auction-listing-listingauctionbidcard--outbid" title="The bid panel after being outbid"}

::story{id="auction-listing-listingauctionbidcard--custom-maximum-ceiling" title="Custom maximum ceiling"}

::story{id="auction-listing-listingdetails--default" title="The details section"}

:::detail{title="Code map" for="engineer"}
- **Blocks** — `ListingGallery`, `ListingAuctionBidCard`, `ListingDetails`,
  `ListingUserBidHistory`, `ListingBidHistoryList`, `EnrollmentSetupSheet`,
  `PaymentMethodRow` and `PaymentMethodEmptyState`, in `packages/ui`
- **Signal** — `bidEnrollment`: `signed-out`, `needs-card` or `ready`
:::

:::detail{title="Product decisions" for="pm"}
No auction block is mapped to a Figma node — no frame, no audit table, no
code mapping — so these stories are the reference until frames are produced.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Bid enrollment | Decided | Its own part of the feature set: the setup blocks, their gates, and the signal the bid card reads. | Product |
:::
