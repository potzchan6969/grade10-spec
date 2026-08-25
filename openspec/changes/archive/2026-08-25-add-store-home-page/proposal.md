# A store front door

**Author:** @seankcw - 2026-08-25

## Why

`/store` is a filter panel and a grid. A collector arriving from a card
someone linked them, or from the nav, meets the whole catalogue at once and
nothing that says what this store sells or what is worth looking at — no
hero, no way in by collection, nothing merchandised. The one surface that
does sell is the marketing page at `/`, and it is a placeholder built from
three cards.

The design exists and so do the parts. Figma frame `Store`
([`4171:9023`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9023))
draws the front door, and
[`add-store-home-blocks`](../archive/2026-08-25-add-store-home-blocks/proposal.md)
shipped every block it needs — `StoreHomeHero`, `StoreSectionHeader`,
`StoreCollectionGrid`, `StoreCollectionTile` — plus a preview page story that
assembles the whole frame. Nothing consumes them. The blocks have been
rendering only in Storybook since they landed.

**Metric:** ways into the catalogue from `/store` goes from one — a filter
checkbox — to nine: seven collection tiles and two merchandised rows. **Acceptance
signal:** `/store` fetched with no script running carries the hero's headline
and copy, and its title differs from the listing's.

## What Changes

- **`/store` becomes the front door.** A hero, a bento of collections, and one
  merchandised product row, matching `4171:9023`. It is written by the build
  like the surfaces beside it, so it answers whole before any script runs; the
  collections and the products arrive by script, the way the store's listings
  already do.
- **The browse listing moves to `/store/collections`.** The same surface,
  unchanged in what it does, at an address of its own beneath the store. The
  hero's Shop button, both browse-all links, the collection tiles, and the
  footer's ALL COLLECTIONS all reach it. `/store` keeps answering, so no link
  anyone holds breaks — it answers with the front door instead of the grid.
- **An address can scope the listing to one collection.** A collection tile
  opens the listing already narrowed to that collection, which is what makes
  the bento a way in rather than decoration. Today that narrowing is page
  state a collector can only reach by clicking a checkbox, and cannot link to.
- **Which collections are on the front door is settled in the application.**
  Which seven, in what order, and which one takes the large cell is a layout
  fact the catalogue does not carry — the tiles need an icon and a rank that no
  collection has. The catalogue stays the source of every collection's name and
  whether it exists.
- **The product row is one collection's first page.** Its name is the section
  title, so what is merchandised on the front door changes in the shop, not in
  a deploy.

## Non-Goals

- **Sale pricing.** Every card in the frame carries a SALE badge and a struck
  original price. Nothing in the store's data carries a compare-at price — that
  is a change through the contracts, the store worker and the Shopify adapter,
  and it lands on the listing and the product page at the same time, not just
  here. Cards ship undiscounted; the tile already renders that way.
- **A page per collection.** A collection scopes the listing through its
  address; it does not get a surface with its own title, description and
  sitemap entry. That wants a rendered surface and a read per handle, the way
  a card got one.
- **The marketing page.** `/` is untouched and stays the placeholder it is.
- **GRADE and STORE LOCATOR.** The frame's nav draws two destinations this site
  has no page behind. They stay out of the chrome until they do.
- **Mobile.** No mobile frame exists for the home page. The surface must not
  break at narrow widths; matching a phone layout is design's work, not this
  change's.
- **ZZZ.** That brand's store gains no front door here.

## Capabilities

### New Capabilities

- `grade10-store/home`: what the store's own address serves — the hero it
  answers with before scripts run, the collections it offers as ways in, the
  merchandised row, and what each of them reaches.
- `grade10-store/product-listing`: the browse listing's own address beneath
  the store, and an address that scopes it to one collection.

## Impact

- **grade10 SPA (`apps/frontend/grade10`)** — one surface added to the table
  and one moved, a page for the front door, the table of which collections it
  offers, and the hero's image as an asset the build hashes. The listing page
  moves address and learns to read a collection out of one.
- **`@grade10/i18n`** — a `storeHome` namespace for what the front door says,
  and a head entry for the listing's new address. Every brand answers every
  key, so the brand-stated half of it lands for zzz as well as grade10.
- **`@grade10/ui`** — nothing new. Every block this composes is already
  exported and already has stories.
- **Backend services** — none touched. Collections and products come from
  reads the storefront already makes.
- **Crawlers** — the sitemap gains the listing's address in each language;
  `/store` keeps its entry and changes what it says it is.
