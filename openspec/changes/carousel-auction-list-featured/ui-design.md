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
| `FeaturedAuctionsBanner` | Preview today (`apps/preview/src/pages/auction-catalogue-card.tsx`); promote to `@grade10/ui` if this change owns the public block — **new work in this store when promoted** | Partly — page draft only | Full-width carousel: front page image background and slab, title, status, countdown, rolling current bid, Bid Now or View Auction by status, `CarouselProgress` dots |
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
| Empty Featured | No Featured band; All auctions only | `grade10-site-auction-auction-SC-30` |
| One Featured slide | Carousel with one slide; progress may be absent or a single item; Bid Now when Active | `grade10-site-auction-auction-SC-36` |
| Two or three Featured slides | Carousel; progress dots; advancing changes the visible lot; mixed Active and Upcoming allowed | `grade10-site-auction-auction-SC-35` |
| Live bid roll | Current bid animates when the served amount **increases** after first paint (Active only); same freshness updates Ends in when the recorded close moves | `grade10-site-auction-auction-SC-32` |
| Countdown | Relative **Ends in** / **Opens in** with list-card short remaining; neutral colour; at zero shows now until refresh; extended bidding still Ends in with no Extended cue | `grade10-site-auction-auction-SC-31` |
| Bid Now | Active slide: Bid Now opens the lot details page | `grade10-site-auction-auction-SC-34` |
| View Auction | Upcoming slide: View Auction opens the lot details page; UPCOMING has no live status dot | `grade10-site-auction-auction-SC-58` |
| Upcoming Featured | UPCOMING (no live status dot), STARTING BID, View Auction, Opens in … | `grade10-site-auction-auction-SC-33` |
| Bid roll while paused | Hover/focus pause stops auto-advance only; Active bid may still roll | `grade10-site-auction-auction-SC-32` |
| Front page image load failure | Fall back to lot gallery first item, else container default background | `grade10-site-auction-auction-SC-31` |
| Loading catalogue | Page shell while lots are not yet shown — as the page story treats enter; no separate Featured skeleton | **Out of suite:** presentation; page story enter |
| Empty All auctions | Message that there are no auctions; Featured still shows if slots are set | `grade10-site-auction-auction-SC-41` |
| Watch on | All auctions card shows watched state after toggle | `grade10-site-auction-auction-SC-38` |
| Watch off | All auctions card shows unwatched state; closed lots show no watch | `grade10-site-auction-auction-SC-39` |
| No category section | No Categories heading, tiles, or filter chrome | `grade10-site-auction-auction-SC-37` |

### Admin Featured curation

| State | Shows | Anchor |
| --- | --- | --- |
| Empty slots | Up to three empty ordered slots ready to fill | `grade10-admin-auction-featured-SC-01` |
| Manage Featured entry | Manage Featured beside Create listing opens the sub-page | `grade10-admin-auction-featured-SC-11` |
| Slot filled | Listing title (or id) and front page image preview on that slot | `grade10-admin-auction-featured-SC-04` |
| Front page image upload | Upload control; no listing gallery picker | `grade10-admin-auction-featured-SC-12` |
| Reordered | Slots in the new order; site Featured follows | `grade10-admin-auction-featured-SC-07` |
| Cleared slot | Slot empty; that slide leaves `/auction` Featured | `grade10-admin-auction-featured-SC-08` |
| Cap reached | Third slot filled; no fourth slot offered | `grade10-admin-auction-featured-SC-01` |
