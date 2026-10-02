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

- **Resting order** — the order above, and a collector may ask for another
  order the catalogue can answer
- **Paging** — a page at a time lists the lots in the same order as reading
  the catalogue whole, never twice and never skipping one
- ❓ **Sort index** — what the operator's sort index does to the resting
  order; Product confirms
- **The card** — the first gallery item, the title, the status, the close,
  the current price and the watch control; a closed lot shows no watch
  control; no Buy Now listing ever appears
- **Hidden lots** — a draft or called-off lot is never listed; a called-off
  lot's canonical address remains directly accessible —
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
| Address | A slug, unique among every listing: lower-case title words followed by the lower-case listing code when an operator keeps the generated value | `/auction/listings/<slug>` |
| 🚧 Listing code | A stable opaque 5-character code, always leading with 2 letters, allocated on the first saved draft and permanently reserved, including after deletion — [Auction Management · Listings](/p/grade10-admin/auction/management#listings) | Its lower-case form is visible only as the canonical address suffix, never as a labelled page field or a route on its own. Fresh metadata omits the separate code. A cached preview may remain stale without a purge guarantee. The code becomes the winner's payment reference once an order exists — [Post-Bidding · The Invoice](/p/grade10-site/auction/post-bidding#the-invoice) |
| **Cert ID** | One graded unit of the product, or none | The configured Cert ID when the product's displayed fields include it |

- ❓ **Listing facts** — grade, certificate, set and language on the card,
  once the unit's attributes reach the listing; Product confirms against
  [Auction Management](/p/grade10-admin/auction/management#listings)
- ❓ **Cached shared-link previews** — whether an already cached preview
  refreshes when the listing changes; until Product confirms, an old preview
  may remain stale without a purge or regeneration guarantee

## Catalogue

The Auction nav item opens `/auction`. That address, with no category query, is
the one a search engine keeps.

| Rule | Value |
| --- | --- |
| Featured | At most **3** operator-curated slides. Absent when none are set. Active and Upcoming lots only |
| Live | Active and Upcoming. Ended lots stay in All auctions and fill no Featured slot |

- **Featured** — a full-width carousel when at least one slide is set. Each
  slide is an operator-picked listing with one **front page image** uploaded
  for that slot (banner and slab as that single asset; not a gallery pick for
  upload). The site loads Featured from its own public read, separate from All
  auctions. The slide shows that image, the lot title, its status (LIVE BIDDING
  with a live dot when Active; UPCOMING with no dot when Upcoming), a client
  countdown from the served close or open as relative **Ends in** / **Opens in**
  in the same short form as All auctions cards, the current bid when Active
  (rolls when the amount increases after first paint; Upcoming shows no money
  until the lot opens), and Bid Now when Active or View Auction otherwise —
  either opens that lot's details page. A long lot title truncates to **four
  lines** on a small viewport and **three** from tablet.
  Extended bidding keeps LIVE BIDDING and
  Ends in to the recorded close — no Extended label — and that close moves with
  the same freshness as the live current bid. Progress dots advance the slides
  when more than one is set; on a small viewport, previous/next on the stage and
  a horizontal swipe also advance. The section is headed Featured auctions —
  [Auction Management · Featured](/p/grade10-admin/auction/management#featured)
- 🚧 **No category section** — category tiles and the busy filter stay off this
  page until a later change; quiet layout is the only layout
- **All auctions** — every lot a collector can see, including those in Featured,
  in the resting order, below Featured when Featured is present. Each card
  follows the store product card: the image well, the title, then a countdown.
  An active lot shows the current bid and counts down to its close. An upcoming
  lot counts down to its open and shows no money until it is Active. A closed
  lot names when it ended. Watch sits at the bottom right of the image, and a
  closed lot shows none — the same watch as the lot page and My Auctions —
  [Watchlist](/p/grade10-site/auction/bidding#my-auctions-watchlist-and-notifications).
  More lots load as the collector scrolls; Boneyard skeleton cards show while
  the next batch settles — no pagination
- **Headings** — one `h1`, Auctions, which is not shown. `h2` for Featured
  auctions and All auctions, and only for a section that is on the page. A lot
  title is an `h3` in the list
- **The document** — title and description belong to this page. Canonical and
  the share address are `/auction`. An ItemList names the lots, their
  addresses, images and current bids. A closed lot's offer stays on the lot
  page

::story{id="pages-auction-list--default" title="Auction list"}

::story{id="auction-list-featured-auctions--carousel-banner" title="Featured carousel"}

::story{id="auction-list-all-auctions--default" title="All auctions"}

::story{id="auction-list-all-auctions--empty" title="No auctions"}

::story{id="auction-list-all-auctions-lot-card--active" title="Active"}

::story{id="auction-list-all-auctions-lot-card--upcoming" title="Upcoming"}

::story{id="auction-list-all-auctions-lot-card--ended" title="Closed"}

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
- **Hidden from browse/search** — a draft or called-off lot is absent from
  catalogue and search. A called-off lot remains directly accessible at its
  canonical address; a draft has no public address.
- **After scripts load** — nothing on screen is replaced by a placeholder,
  and a value that follows the clock continues from what was served
- **Watching** — a signed-in collector watches or unwatches the lot from its
  page — [Watchlist](/p/grade10-site/auction/bidding#my-auctions-watchlist-and-notifications)
- **With a bid** — while their bid stands the control reads Watching,
  disabled: a bid bookmarks the lot
- **After the close** — a closed lot shows no watch control
- **Announced** — watching says email alerts are on, with View My
  Auctions; unwatching says the lot left My Auctions, with Undo
- **A first bid** — announces that email alerts are on, once per lot per
  collector
- **Title on a small screen** — under the breadcrumb, the lot title uses the
  smaller title size; from tablet it uses the larger title size

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
- **The strip** — one image shows no thumbnail strip; 🚧 several show a left
  rail when the gallery is wide enough for it beside the main frame, and
  otherwise step with previous/next and progress only
- **Made from the original** — a larger image is transformed to the size
  asked for and a smaller one answered as it is, never upscaled; videos keep
  their original path
- **Until the close** — an operator adds, replaces, removes or re-captions an
  item while the listing is draft, created or published, never after it
  closes — [Auction Management · Listings](/p/grade10-admin/auction/management#listings)

::changes{spec="grade10-site/auction/listing-media"}

### Lot Status

Every lot a collector can see shows one status. It describes the lot,
never the collector's bid or order, and every page reads the same value.

| Collectors see | Meaning | Internal lot status |
| --- | --- | --- |
| **Upcoming** | Published; bidding has not started | Scheduled |
| **Active** | Bidding is open, extended bidding included | Live |
| **Ended** | Bidding is over, with or without a winner, whatever the order's state | Unsold, and every order status from Awaiting Setup to Refunded |
| Hidden | Never published | Draft |
| Removed from browse/search | Called off before close; canonical address remains direct | Called off |

- **Hidden lots** — drafts have no public address. Called-off lots are not in
  the catalogue, search or filters but remain directly accessible at their
  canonical address; My Auctions shows a called-off lot to a collector who bid
  on it, saying their card was not charged
- **Between the close and the result** — once a lot's close passes, every
  page shows it Closed with no result yet; Won or Unsold appears when the
  close is recorded, normally within about a second and at worst at the next
  sweep. No fourth status shows
- **One clock** — every page counts down on the auction service's clock,
  not the device's, and rounds up, so the last second never reads 0
- **Live without a reload** — an open lot page, the catalogue and Featured
  show each recorded bid, extension and close as it happens

::changes{spec="grade10-site/auction/lot-status"}

## Admin Panel

An operator drafts a lot, fills it, prices and schedules it, holds its stock
and publishes it; from the close on, the sale is worked in Orders
— [Auction Management](/p/grade10-admin/auction/management).

::image{src="assets/diagrams/auction-listing-status.svg" alt="A listing from Draft to Created, Published, Closed and Settled, with Canceled beneath, reached by calling off a created or published listing"}

| The operator | Collectors see |
| --- | --- |
| Saves a draft | Nothing; a draft has no address |
| Creates it — a title, a slug, a price, a window, one media item, the stock held | Nothing yet |
| Publishes it, now or at Publish at | The lot as **Upcoming**, then **Active** from its start |
| Calls it off, any time before the close | The lot leaves browse and search, but its canonical address remains directly accessible |
| Lets the close pass | **Ended**; the winner's order opens — [Post-Bidding](/p/grade10-site/auction/post-bidding) |
| Reads Watchers on the Listings table | Nothing; a watch is private |

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
| Bidder | Bid on a lot that was called off | Still sees the lot, and that their card was not charged. |

**Not in scope.** The winner's order status, which Ended never describes. The
Active and Completed filters in bidding history.

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| The catalogue page | Decided | `/auction` is this page: an operator-curated Featured carousel (at most 3 slides, each a listing plus one front page image, loaded from a dedicated Featured read, with live rolling bid and a client countdown), then All auctions. Category tiles and the busy filter stay off until a later change. The list card stays the one the catalogue already shows. | Design |
| Three statuses | Decided | Upcoming, Active, Ended; extended bidding reads Active, and Unsold reads Ended. The "Extended bidding: ON" label is the operator queue's alone. | Product |
| Between the close and the result | Decided | Three statuses stay. Past the close and before the result is recorded, pages show the existing Closed state with no result, and Won or Unsold when the close commits. A fourth status, Closing, with its own copy was ruled out: a new state in four languages for a gap normally under a second. | Product |
| Draft and Called off | Decided | Draft has no public address. A called-off lot is removed from browse and search but remains directly accessible at its canonical address. Explicit hard deletion is outside this capability, so its page accessibility is unspecified. A collector who bid on a called-off lot still sees it in My Auctions, saying their card was not charged. | Product |
| Where the status shows | Decided | The designer decides where and how each page shows it. | Design |
| Watching a lot | Decided | Watching from the lot page is its own part of the capability's map, and the watchlist owns what a watch means. | Product |
| Watching while a bid stands | Decided | A bid keeps the lot watched: the control reads Watching and is disabled until the lot closes, and a closed lot shows no control. | Product |
:::
