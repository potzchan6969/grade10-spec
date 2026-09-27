## Context

`/auction` today renders `CatalogueView` in `@grade10/auction-frontend`
(`packages/grade10-auction/frontend/.../CatalogueView.tsx`): public listings
via `useAllListings`, plus status/IP filter and sort chrome the quiet layout
must drop. There is no Featured slot store, no public Featured read, and no
admin curator. The Listings tab toolbar already has **Create listing**
(`ListingsPanel` `IconButton` with Plus). Preview drafts
`FeaturedAuctionsBanner` under Storybook `pages-auction-list--carousel-banner`.
Listing gallery media stays on `auction_listing_media`; Featured needs its own
image.

Specs: [site auction](specs/grade10-site/auction/auction/spec.md),
[admin featured](specs/grade10-admin/auction/featured/spec.md). Screens:
[ui-design.md](ui-design.md).

## Goals / Non-Goals

**Goals:**

- Persist at most three ordered Featured slots (listing + front page image)
- Admin curation as a **Manage Featured** sub-page of the Listings tab
- Dedicated public Featured endpoint for `/auction` (slide facts + front page
  image URL), separate from the All auctions catalogue page
- Quiet catalogue: Featured (when any complete slide) then All auctions

**Non-Goals:**

- Category tiles, busy filter, lot-status websockets, Upcoming/Ended card
  redesign (see [decisions](decisions.md#non-goals))
- Picking a gallery or campaign cover image as the carousel image
- Auto Top-N derivation

## Decisions

The deltas own eligibility, cap, quiet layout, and slide facts. This file
picks persistence, grants, admin surface, and wire seams.

### Manage Featured under Listings

Open Featured curation from the Listings tab: a **Manage Featured** control
beside **Create listing** (same toolbar row). That control opens a sub-page
that lists the up-to-three ordered slots, lets the operator pick a published
Active or Upcoming listing, upload or replace the **front page image**,
reorder, and clear. Reject a Campaigns sibling tab and reject editing Featured
only from a listing detail dialog.

### Front page image is slot-owned, never gallery

Each slot holds one **front page image** object key (R2), uploaded through the
same media pipeline shape as listing media (type, size, dimensions) but stored
under a Featured prefix and referenced only by the slot. The listing gallery
is unchanged and MUST NOT be offered as a picker for this image. Reject
campaign covers and gallery position 1 as substitutes.

### Dedicated public Featured endpoint

`/auction` loads Featured through a standalone public procedure
(`featured.publicList`), not nested inside the All auctions page payload.
The answer carries ordered complete slides: listing identity and display
facts needed for the banner (title, status, countdown target, current bid)
plus the front page image URL. Empty Featured is an empty list. All auctions
keeps `listPublicListingsPage`.

### Fixed three-slot table

Store Featured as `auction.featured_slots` with positions `1..3`, not a flag
on listings and not campaign rows. Unique `listing_id` where not null.

### Public read filters live eligibility

Admin may still show a slot whose listing later Ended. The public endpoint
returns only complete slots whose listing is published Active or Upcoming at
read time. Incomplete slots (missing listing or front page image) never
appear. No cascade-clear on close.

### Grants follow catalogue write

Gate Featured admin procedures with `auction:write`. Reject a new
`auction:featured` grant.

### Quiet catalogue composition

Replace busy `CatalogueView` chrome on `/auction` with Featured + All
auctions. Promote `FeaturedAuctionsBanner` into `@grade10/ui` when the export
contract lands. Watch stays the existing watchlist control on cards.

### Live bid and clock on the banner

Reuse public listing summary bid facts and
`ListingRollingMoneyDisplay` / countdown on the same refetch cadence as
catalogue cards; no banner websocket. On Active, roll the current bid only
when the served amount **increases** after first paint. Relative **Ends in** /
**Opens in** uses the list-card short remaining form (not the lot-page rolling
digit countdown). Extended bidding keeps LIVE BIDDING and Ends in — no Extended
label — and the recorded close moves with the same freshness as the live bid.
Active slides offer **Bid Now**; Upcoming slides offer **View Auction**. Either
opens that lot's details page.

### Front page image display fallback

Upload and storage stay slot-owned (never a gallery picker). If the front page
image URL fails to load in the banner, fall back to the lot’s first gallery
image, else the stage’s default background colour — no broken-image chrome.

## Database Schema

**New:** `auction.featured_slots`

| Column | Type | Null | Notes |
| --- | --- | --- | --- |
| `position` | `smallint` | no | PK; check `1..3` |
| `listing_id` | `text` | yes | FK → `auction.listings.id`; null = empty |
| `front_page_image_object_key` | `text` | yes | R2 key; null = empty |
| `front_page_image_content_type` | `text` | yes | With object key |
| `front_page_image_width` / `front_page_image_height` | `integer` | yes | As listing media |
| `updated_at` | timestamptz | no | |

Seed positions 1–3 empty. Unique on `listing_id` where not null.
Authoritative: slot row. Derived at public read: title, status, bid,
close/open from the listing summary join.

```
featured_slots (1..3) ──listing_id──> listings
                 └──front_page_image_object_key──> object store
```

## Service Interfaces

**Admin (auction worker, `auction:write`):**

| Procedure | Input | Success / refuse |
| --- | --- | --- |
| `featured.list` | — | Three slots with listing label and front page image preview URLs |
| `featured.setSlot` | `{ position, listingId, frontPageImage }` | Slot filled; refuse Ended/unpublished/invalid position/duplicate listing |
| `featured.clearSlot` | `{ position }` | Slot emptied (listing and front page image cleared) |
| `featured.reorder` | `{ positions: [p1,p2,p3] }` permutation | Rows swapped |

Front page image upload: accept body → store object → bind key on `setSlot`
with the listing bind, or replace and delete the prior object after commit.

**Public:**

| Procedure | Input | Success |
| --- | --- | --- |
| `featured.publicList` | — | Ordered complete Active/Upcoming slides: banner facts + front page image URL |

## API Contracts

- New admin router namespace `featured.*` as above
- New public `featured.publicList` — required dedicated endpoint; do not fold
  into the catalogue listings page response
- No change to listing gallery or watchlist procedures

## Risks / Trade-offs

- **Listing ends while featured** → Public endpoint drops it; admin slot stays
  until clear/replace
- **Orphan R2 front page images** → Delete prior object after replace/clear
  commit; rare orphan on crash, sweep later
- **Duplicate listing in two slots** → Unique partial index; refuse on `setSlot`
- **Operators pick a gallery image by habit** → UI offers upload only; no
  gallery picker on the Manage Featured sub-page
- **Banner bid feels stale** → Same summary refetch as catalogue cards

## Migration Plan

1. Migration: create `featured_slots`, seed positions 1–3 empty
2. Ship admin `featured.*` + Manage Featured sub-page from Listings
3. Ship `featured.publicList` + quiet `/auction` composition
4. Rollback: hide Featured band and Manage Featured; table may remain empty

## Open Questions

None that change the approach — admin Figma for Manage Featured may refine
layout without moving the Listings entry point or the front page image rule.
