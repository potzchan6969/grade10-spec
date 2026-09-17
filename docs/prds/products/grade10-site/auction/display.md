---
title: Auction Display
spec: grade10-site/auction/listing-page
order: 2
---

Where a collector meets a lot: the catalogue card, the lot's own page with its
gallery and status, and the admin panel an operator makes the lot in.

## Auction Listing

The catalogue lists every lot a collector can see as a card, and a card opens
the lot at its own address without a page load.

| Lot status | Cards read in this order |
| --- | --- |
| **Active** | Soonest close first |
| **Upcoming** | Soonest start first |
| **Ended** | Most recent close first |

- 🚧 **Resting order** — the order above, and a collector may ask for another
  order the catalogue can answer
- 🚧 **Paging** — a page at a time lists the lots in the same order as reading
  the catalogue whole, never twice and never skipping one
- ❓ **Sort index** — what the operator's sort index does to the resting
  order; Product confirms
- **The card** — the first gallery item, the title, the current price and the
  watch control; no Buy Now listing ever appears
- **Hidden lots** — a draft or called-off lot is never listed —
  [Lot Status](#auction-details)

### Listing Schema

What a listing carries, from the operator's form to the card.

| Fact | Set by the operator | Collectors see |
| --- | --- | --- |
| Title | Required, **1 to 200** characters | The card and the lot page |
| Description | Optional, at most **4,000** characters | The lot page |
| Gallery | **1 to 8** images and videos, in order | The first item on the card, all of them on the lot page |
| Currency and starting price | **USD**, **HKD** or **JPY**, and a whole amount | The current price, in that currency |
| Bidding window | A start, a close and the extension rule — [Bidding](/p/grade10-site/auction/bidding#auction-logic) | The close and the time left |
| Category | One per taxonomy | Cards grouped or found by category |
| Campaign | Optional, the cover a set of lots sells under | The campaign's title and copy |
| Address | A slug, unique among every listing | `/auction/listings/<slug>` |
| 🚧 Cert ID | One graded unit of the product, or none | Nothing yet |

- ❓ **Listing facts** — grade, certificate, set and language on the card,
  once the unit's attributes reach the listing; Product confirms against
  [Auction Management](/p/grade10-admin/auction/management#listings)

## Auction Details

Every lot has an address of its own, and that address answers with the whole
lot before any script runs.

- **Served whole** — name, description, sale and bidding standing are in the
  first response, so a slow phone reads the lot at once and a crawler sees
  what a collector sees
- **One lot per address** — a shared link unfurls as that lot, with its own
  title, description and canonical address, never the catalogue's
- **Not in the sitemap** — which lots are published is unknown when the site
  is built — [Crawlable Pages](/p/grade10-site/site/crawlable-pages)
- **Not found** — an address naming no lot answers an honest 404 with the
  site's not-found surface, never an empty lot page
- 🚧 **Hidden** — the same 404 meets a lot that is now Draft or Called off,
  even at the address it once answered from
- **After scripts load** — nothing on screen is replaced by a placeholder,
  and a value that follows the clock continues from what was served
- **Watching** — a signed-in collector watches or unwatches the lot from its
  page — [Watchlist](/p/grade10-site/auction/bidding#my-auctions-watchlist-and-notifications)
- 🚧 **With a bid** — while their bid stands the control reads Watching,
  disabled: a bid bookmarks the lot
- 🚧 **After the close** — a closed lot shows no watch control
- 🚧 **Announced** — watching says email alerts are on, with View My
  Auctions; unwatching says the lot left My Auctions, with Undo
- 🚧 **A first bid** — announces that email alerts are on, once per lot per
  collector

::story{id="auction-listing-listing-product--default" title="A live lot page, gallery and bid panel assembled"}

### Media Gallery

| Rule | Value |
| --- | --- |
| Items | **1 to 8** images and videos, in the order collectors see them; only a draft may hold none |
| Image types | **JPEG, PNG, WebP, AVIF**, at most **100 MiB** each |
| Alt text | Optional, at most **200** characters; the listing title stands in |
| Sizes | **card** on the catalogue, **thumb** on the strip, **detail** in the main frame, **zoom** under the magnifier — images only |

- **One gallery** — no front and back slots; the first item is the card's
  picture, and a lot whose first item is a video still appears, with no
  placeholder
- **The strip** — one image shows no thumbnail strip; several do
- **Made from the original** — a larger image is transformed to the size
  asked for and a smaller one answered as it is, never upscaled; videos keep
  their original path
- **Until the close** — an operator adds, replaces, removes or re-captions an
  item while the listing is draft, created or published, never after it
  closes — [Auction Management · Listings](/p/grade10-admin/auction/management#listings)

::story{id="auction-listing-listinggallery--mixed-media" title="A gallery holding both images and video"}

### Lot Status

🚧 Every lot a collector can see shows one status. It describes the lot,
never the collector's bid or order, and every page reads the same value.

| Collectors see | Meaning | Internal lot status |
| --- | --- | --- |
| **Upcoming** | Published; bidding has not started | Scheduled |
| **Active** | Bidding is open, extended bidding included | Live |
| **Ended** | Bidding is over, with or without a winner, whatever the order's state | Unsold, and every order status from Awaiting Address to Refunded |
| Hidden | Never published, or withdrawn before a sale | Draft, Called off |

- 🚧 **Hidden lots** — not in the catalogue, search or filters; the lot page
  is not found; the lot leaves the watched list; My Auctions shows it only to
  a collector who bid on it, saying the card hold was released when there
  was one

::changes{spec="grade10-site/auction/lot-status"}

## Admin Panel

An operator drafts a lot, fills it, prices and schedules it, holds its stock
and publishes it; from the close on, the sale is worked in the post-sale queue
— [Auction Management](/p/grade10-admin/auction/management).

::image{src="assets/diagrams/auction-listing-status.svg" alt="A listing from Draft to Created, Published, Closed and Settled, with Canceled beneath, reached by calling off a created or published listing"}

| The operator | Collectors see |
| --- | --- |
| Saves a draft | Nothing; a draft has no address |
| Creates it — a title, a slug, a price, a window, one media item, the stock held | Nothing yet |
| Publishes it, now or at Publish at | The lot as **Upcoming**, then **Active** from its start |
| Calls it off, any time before the close | The lot disappears, and its address is not found |
| Lets the close pass | **Ended**; the winner's order opens — [Post-Bidding](/p/grade10-site/auction/post-bidding) |
| 🚧 Reads Watchers on the Listings table | Nothing; a watch is private |

:::detail{title="Code map" for="engineer"}
- **Blocks** — `ListingGallery`, `ListingDetails` and the lot page assembly, in `packages/ui` — [Listing Page Blocks](/p/shared/ui/auction-listing)
- **Public address** — [Crawlable Pages](/p/grade10-site/site/crawlable-pages), applied per lot
- **Service** — [Auction Service](/platform/auction-service)
:::

:::detail{title="Test cases" for="qa"}
::cases{id="grade10-site/auction/listing-page"}

::cases{id="grade10-site/auction/listing-media"}
:::

:::detail{title="Product decisions" for="pm"}
Collectors read three lot statuses wherever a lot is shown and never see a
draft or called-off lot; the internal status changes for operator needs, the
external one does not.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Browsing or watching lots | Sees at a glance whether a lot can still be bid on. |
| Bidder | Bid on a lot that was called off | Still sees the lot, and that their card hold was released. |

**Not in scope.** The winner's order status, which Ended never describes. The
Active and Completed filters in bidding history.

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| The catalogue's own capability | ❓ Open | Its order is a requirement of Bidding's spec and its card ships as a shared block; no capability states the rest of the browse surface. Product confirms whether it is specified on its own or under [Listing Page Blocks](/p/shared/ui/auction-listing). | Product |
| Three statuses | Decided | Upcoming, Active, Ended; extended bidding reads Active, and Unsold reads Ended. The "Extended bidding: ON" label is the operator queue's alone. | Product |
| Draft and Called off | Decided | Hidden on every collector page; the lot's address shows Page not found. A collector who bid on a called-off lot still sees it in My Auctions, with the hold note when the bid held one. | Product |
| Where the status shows | Decided | The designer decides where and how each page shows it. | Design |
| Watching a lot | Decided | Watching from the lot page is its own part of the capability's map, and the watchlist owns what a watch means. | Product |
| Watching while a bid stands | 🚧 In flight | A bid keeps the lot watched: the control reads Watching and is disabled until the lot closes, and a closed lot shows no control. | Product |
:::
