## Screens

### Auction List (`/auction`)

Storybook workbench: [Pages/Auction List → Carousel banner](http://localhost:6008/?path=/story/pages-auction-list--carousel-banner)
(`pages-auction-list--carousel-banner`). Layout source until a Figma frame is
linked here: that story — Featured carousel then All auctions, no category
section.

### Manage Featured (Listings sub-page)

Entry: **Manage Featured** beside **Create listing** on the Listings tab
toolbar. Sub-page: ordered slots (≤3), listing pick, front page image upload
(no gallery picker), reorder and clear. Figma frame: awaited — until it lands,
this layout and the management page marks are the source.

## Components

| Export | Package | Exists | Composes |
| --- | --- | --- | --- |
| `FeaturedAuctionsBanner` | Preview today (`apps/preview/src/pages/auction-catalogue-card.tsx`); promote to `@grade10/ui` if this change owns the public block — **new work in this store when promoted** | Partly — page draft only | Full-width carousel: front page image background and slab, title, status, countdown, rolling current bid, Bid Now, `CarouselProgress` dots |
| `AuctionCataloguePage` | Preview (`apps/preview/src/pages/auction-catalogue-page.tsx`) | Partly — page composition, not a package export | Featured (when set) then All auctions grid; no category chrome in the carousel-banner layout |
| `AuctionCard` | `@grade10/ui`, `src/blocks/auction-listing/` | Yes | All auctions list tile: image, title, bid, countdown, watch |
| `WatchButton` | `@grade10/ui`, `src/blocks/auction-record/` | Yes | Watch on/off on an All auctions card (same control as lot page / My Auctions) |
| `ListingRollingMoneyDisplay` | `@grade10/ui`, `src/blocks/auction-listing/` | Yes | Rolling current bid on the Featured slide |
| `ListingCountdownDisplay` | `@grade10/ui`, `src/blocks/auction-listing/` | Yes | Client countdown on the Featured slide and on list cards |
| `CarouselProgress`, `CarouselProgressItem` | `@grade10/design-system` | Yes | Featured slide progress / advance |
| Admin Manage Featured | `grade10-admin` Listings sub-page | No — new work outside this store's package blocks | Ordered slots ≤3: listing pick, front page image upload (not gallery), reorder, clear |

**Copy.** Catalogue section words and Bid Now / CURRENT BID / LIVE BIDDING on
the banner are draft strings in the preview page today. Promoting the banner
into `@grade10/ui` needs shared-layer keys answered in every language the
shared layer speaks (`en`, `ko`, `zh-Hans`, `zh-Hant`) — flag for `tasks.md`
when the export lands. Admin curator labels are application copy.

## States

### Auction List (`/auction`)

| State | Shows | Anchor |
| --- | --- | --- |
| Empty Featured | No Featured band; All auctions only | **Out of suite:** closes on Featured scenarios when requirements land |
| One Featured slide | Carousel with one slide; progress may be absent or a single item; Bid Now | **Out of suite:** closes on Featured scenarios when requirements land |
| Two or three Featured slides | Carousel; progress dots; advancing changes the visible lot | **Out of suite:** closes on Featured scenarios when requirements land |
| Live bid roll | Current bid amount animates when the served bid changes | **Out of suite:** closes on Featured scenarios when requirements land |
| Countdown | Client countdown from served close (Active) or open (Upcoming) | **Out of suite:** closes on Featured scenarios when requirements land |
| Bid Now | Link or control opens the featured lot's page | **Out of suite:** closes on Featured scenarios when requirements land |
| Loading catalogue | Page shell while lots are not yet shown — as the page story treats enter | **Out of suite:** presentation; page story enter |
| Empty All auctions | Message that there are no auctions; Featured still shows if slots are set | **Out of suite:** closes on Featured scenarios when requirements land |
| Watch on | All auctions card shows watched state after toggle | **Out of suite:** closes on Featured scenarios when requirements land |
| Watch off | All auctions card shows unwatched state; closed lots show no watch | **Out of suite:** closes on Featured scenarios when requirements land |
| No category section | No Categories heading, tiles, or filter chrome | **Out of suite:** closes on Featured scenarios when requirements land |

### Admin Featured curation

| State | Shows | Anchor |
| --- | --- | --- |
| Empty slots | Up to three empty ordered slots ready to fill | **Out of suite:** closes on Featured scenarios when requirements land |
| Manage Featured entry | Manage Featured beside Create listing opens the sub-page | **Out of suite:** closes on Featured scenarios when requirements land |
| Slot filled | Listing title (or id) and front page image preview on that slot | **Out of suite:** closes on Featured scenarios when requirements land |
| Front page image upload | Upload control; no listing gallery picker | **Out of suite:** closes on Featured scenarios when requirements land |
| Reordered | Slots in the new order; site Featured follows | **Out of suite:** closes on Featured scenarios when requirements land |
| Cleared slot | Slot empty; that slide leaves `/auction` Featured | **Out of suite:** closes on Featured scenarios when requirements land |
| Cap reached | Third slot filled; no fourth slot offered | **Out of suite:** closes on Featured scenarios when requirements land |
