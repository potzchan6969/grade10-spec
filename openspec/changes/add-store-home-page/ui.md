# UI: A store front door

## Screens

### The front door — `/store`

Figma frame `Store`
([`4171:9023`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9023)),
top to bottom:

| Section | Frame |
| --- | --- |
| Hero | [`4171:9051`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9051) |
| Collections header | [`4195:1048`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4195-1048) |
| Collection bento | [`4195:1050`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4195-1050) |
| Merchandised row | [`4171:11875`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-11875) |

`Nav` ([`4171:10031`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-10031))
and `Footer` ([`4171:9654`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9654))
are the site chrome the page already renders inside. The frame draws a promo
bar, a utility row, GRADE and STORE LOCATOR in the nav, and help, legal and
social columns in the footer that the chrome does not carry — all of it out of
scope here, and all of it already noted in the application's own chrome table.

**The reference assembly is
`apps/preview/src/pages/store-home-page.stories.tsx` in grade10-spec** — the
same blocks, the same order, the same spacing, with fixtures where this page
has reads. Build against it; where the page and the story disagree about
layout, the story is what a designer reviews.

The frame draws a SALE badge and a struck original price on every card. The
store carries no compare-at price — cards render undiscounted, which
`ProductCard` handles by omission. See proposal.md — Non-Goals.

### The browse listing — `/store/collections`

Unchanged. Figma frame `Product List`, as
[`sync-product-list-page`](../archive/2026-08-23-sync-product-list-page/ui.md)
left it. This change moves its address and lets an address preselect one
collection in the filter panel it already renders; nothing about how it looks
changes.

## Components

Every export below already exists. Nothing here is work in grade10-spec.

From `@grade10/ui`:

- `StoreHomeHero`, with `StoreHomeHeroCopy` — the hero. Takes `title`,
  `description`, `imageSrc`, and `onShopClick` / `onAuctionClick`; omitting a
  callback omits that button.
- `StoreSectionHeader`, with `StoreSectionHeaderCopy` — both section headings
  and their browse-all links.
- `StoreCollectionGrid` over `StoreCollectionSummary` — the bento, one summary
  per collection the catalogue lists. `featured` marks the first, which takes
  the large cell. The `icon` slot takes the collection's own image; a
  collection carrying none is identified by its name instead
  (design.md — *The front door is the shop's collections, artwork and all*).
- `StoreCollectionTile` — used only through the grid here.
- `ProductCard`, with `ProductCardCopy` — the merchandised row's cards,
  mapped over a five-column grid rather than through `ProductList`
  (design.md — *The merchandised row uses `ProductCard` directly*).

From `@grade10/design-system`: `VStack` for the page's stacking, and the
`Nav` / `Footer` the site shell already renders.

Prices are formatted through `@grade10/utils/money` from minor units and a
currency code, the way the listing formats them. `ProductSummary.price` is a
formatted string; the block never sees a number.

The hero's image is exported from `4171:9051` and ships in the application, not
in `@grade10/ui` (design.md — *The hero's image ships with the application*).

## States

### The front door

- **Hero** — always. `The hero does not wait`. No loading state: its copy and
  its image are the build's, not a read's.
- **Collections loading** — `A section says it is loading`. The section header
  renders; the grid does not render empty.
- **Collections failed** — `A failed read can be retried`. The section says so
  and offers to try again.
- **A tile without artwork** — `A collection with no artwork`. The tile
  renders and names the collection; the icon well carries its initial rather
  than a gap.
- **No collections at all** — `Nothing to offer`. Heading and grid both
  absent, the way the row goes when there is nothing to merchandise.
- **Merchandised row loading / failed** — same two scenarios as the
  collections section.
- **No row at all** — `Nothing to merchandise`. Heading and grid both absent;
  the surface renders without them.

### The browse listing

- **Opened narrowed** — `An address opens the listing narrowed`. The filter
  panel shows that collection checked and the applied-filter chip is present,
  exactly as it does when a collector checks it themselves.
- **Narrowed to a collection the catalogue has nothing for** —
  `A collection the catalogue has nothing for`. The unscoped listing, no
  error, no not-found.

Every other listing state — loading, empty, error, load-more — is unchanged.
