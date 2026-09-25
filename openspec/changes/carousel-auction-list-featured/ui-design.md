## Screens

### Auction List (`/auction`)

Storybook workbench: [Pages/Auction List → Carousel banner](http://localhost:6008/?path=/story/pages-auction-list--carousel-banner)
(`pages-auction-list--carousel-banner`). Layout source until a Figma frame is
linked here: that story — Featured carousel then All auctions, no category
section.

Admin Featured curation frame: awaited — slot list, lot picker, hero upload,
order and clear. Until it lands, the admin surface is named only by the
journeys and the management page marks.

## Components

| Export | Package | Exists | Composes |
| --- | --- | --- | --- |
| `FeaturedAuctionsBanner` | Preview today (`apps/preview/src/pages/auction-catalogue-card.tsx`); promote to `@grade10/ui` if this change owns the public block — **new work in this store when promoted** | Partly — page draft only | Full-width carousel: hero background and slab, title, status, countdown, rolling current bid, Bid Now, `CarouselProgress` dots |
| `AuctionCataloguePage` | Preview (`apps/preview/src/pages/auction-catalogue-page.tsx`) | Partly — page composition, not a package export | Featured (when set) then All auctions grid; no category chrome in the carousel-banner layout |
| `AuctionCard` | `@grade10/ui`, `src/blocks/auction-listing/` | Yes | All auctions list tile: image, title, bid, countdown, watch |
| `WatchButton` | `@grade10/ui`, `src/blocks/auction-record/` | Yes | Watch on/off on an All auctions card (same control as lot page / My Auctions) |
| `ListingRollingMoneyDisplay` | `@grade10/ui`, `src/blocks/auction-listing/` | Yes | Rolling current bid on the Featured slide |
| `ListingCountdownDisplay` | `@grade10/ui`, `src/blocks/auction-listing/` | Yes | Client countdown on the Featured slide and on list cards |
| `CarouselProgress`, `CarouselProgressItem` | `@grade10/design-system` | Yes | Featured slide progress / advance |
| Admin Featured curator | `grade10-admin` application surface | No — new work outside this store's package blocks | Ordered slots ≤3: lot pick, hero upload, reorder, clear |

**Copy.** Catalogue section words and Bid Now / CURRENT BID / LIVE BIDDING on
the banner are draft strings in the preview page today. Promoting the banner
into `@grade10/ui` needs shared-layer keys answered in every language the
shared layer speaks (`en`, `ko`, `zh-Hans`, `zh-Hant`) — flag for `tasks.md`
when the export lands. Admin curator labels are application copy.

## States

### Auction List (`/auction`)

| State | Shows | Anchor |
| --- | --- | --- |
| Empty Featured | No Featured band; All auctions only | `grade10-site-auction-auction-US-05` |
| One Featured slide | Carousel with one slide; progress may be absent or a single item; Bid Now | `grade10-site-auction-auction-US-06` |
| Two or three Featured slides | Carousel; progress dots; advancing changes the visible lot | `grade10-site-auction-auction-US-07` |
| Live bid roll | Current bid amount animates when the served bid changes | `grade10-site-auction-auction-US-06` |
| Countdown | Client countdown from served close (Active) or open (Upcoming) | `grade10-site-auction-auction-US-06` |
| Bid Now | Link or control opens the featured lot's page | `grade10-site-auction-auction-US-08` |
| Loading catalogue | Page shell while lots are not yet shown — as the page story treats enter | `grade10-site-auction-auction-US-05` |
| Empty All auctions | Message that there are no auctions; Featured still shows if slots are set | `grade10-site-auction-auction-US-05` |
| Watch on | All auctions card shows watched state after toggle | `grade10-site-auction-auction-US-09` |
| Watch off | All auctions card shows unwatched state; closed lots show no watch | `grade10-site-auction-auction-US-09` |
| No category section | No Categories heading, tiles, or filter chrome | `grade10-site-auction-auction-US-05` |

### Admin Featured curation

| State | Shows | Anchor |
| --- | --- | --- |
| Empty slots | Up to three empty ordered slots ready to fill | `grade10-admin-auction-featured-US-01` |
| Slot filled | Lot title (or id) and hero preview on that slot | `grade10-admin-auction-featured-US-01` |
| Reordered | Slots in the new order; site Featured follows | `grade10-admin-auction-featured-US-02` |
| Cleared slot | Slot empty; that slide leaves `/auction` Featured | `grade10-admin-auction-featured-US-02` |
| Cap reached | Third slot filled; no fourth slot offered | `grade10-admin-auction-featured-US-01` |
