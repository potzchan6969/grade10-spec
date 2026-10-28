---
title: Product Listing
spec: grade10-site/store/product-listing
order: 2
---

Where collectors browse the store, narrow it to what they collect, and open a product.

## Products Display

- **Product Count** — number of products given the filters
- **Product Grid** — product cards; more load when scrolling to the bottom
  - **Product Link** — the photo or the name; a sold-out card doesn't open
  - **Sale Price** — the original price struck through beside it — [Discounts](/p/grade10-site/store/discounts#where-each-shows)
  - 🚧 **Stock** — available or out of stock only: no count left, no cap on quantity; the cart explains a short fill
  - **Cart Button** — adds the product to the cart
    - **Small Screens** — always visible on small screens and touch
    - **Signed Out** — the cart is kept in the browser and joins the member's cart on sign-in — [Cart Drawer](/p/grade10-site/store/cart#reviewing-the-cart)

:::callout{kind="note"}
- ❓ **Draft and unpublished products** — left out of the cards, the counts and search. Product confirms
- ❓ **Offers with no single price** — spend $100, buy 3, buy one get one: named on the product page, not yet on the card. Design confirms
:::

::story{id="store-product-listing-screens-product-list--default" title="The listing"}

## Filters

- **Filter Groups** — lists of options to tick
  - **Worlds** — such as Pokémon and One Piece; the top five, then a link to the rest
  - **Types** — such as Graded Card and Booster Box; always listed in full
- **Several Options** — options ticked in one group widen the results; options in different groups narrow them
  - Pokémon + One Piece shows both worlds; adding Graded Cards keeps only the graded cards from either
- **Option Count** — number of products picking the option would give, with the other filters
  - **Empty Option** — hidden when the store has nothing for it; shown at 0 when the current filters rule it out

::story{id="store-product-listing-blocks-filterpanel--default" title="Filter panel"}

## Small Screens

- **Pills** — the count, Sort, Worlds and Types, each opening a drawer from the bottom
  - **Sort** — applies on pick
  - **Worlds and Types** — apply on confirm

:::callout{kind="note"}
- ❓ **Sort drawer** — whether it closes on pick. Design confirms
:::

::story{id="store-product-listing-blocks-productbrowse--narrow" title="Small screen" height="720" width="375"}

## Search

- **Search Box** — wide screens only, at the top of the filter sidebar
  - **Suggestions** — up to five products and five worlds or types, from the whole store
    - **Chosen Suggestion** — a product opens it; a world or type applies that filter
  - **Enter** — searches the typed words, shown as a removable chip

:::callout{kind="note"}
- ❓ **What matches** — titles only, as today, or descriptions, tags and vendor too. Product confirms
:::

::story{id="store-product-listing-blocks-productbrowse-search--suggestions-and-commit" title="Search"}

## Sort

- **Sort Options** — Latest (default), lowest price, highest price
  - **Scope** — the whole store
  - **Sold Out** — last, whichever the sort
  - **Price** — a product's cheapest variant, which can differ from its card's price

## Collection Page

- **Entry** — a home page tile opens the listing as its collection's page: only the products the shop groups together in Shopify, the collection named above the grid, with a way out to the whole store
- **Exit** — a filter or a search leaves the collection; a sort keeps it

## Links and Back

- **Address** — holds the collection, filters, search and sort, so a link opens the same view and Back undoes the last change
  - **Scroll Position** — a link, or Back from a product, starts at the top

1. `grade10.com/store/collections` — everything
2. `grade10.com/store/collections?collection=<handle>` — one collection
3. `grade10.com/store/collections?worlds=<a>,<b>&types=<c>&q=<words>&sort=<order>` — filtered, searched or sorted
4. `grade10.com/store/products/<handle>` — a product page

:::detail{title="Code map" for="engineer"}
- **Reads** — `catalog.products`, `catalog.filters`, `catalog.collections`, `catalog.collection` and `catalog.product` in `packages/grade10-store/backend/src/trpc/routers/catalog.ts`, mounted ahead of the session tier by `trpc/publicCatalog.ts`
- **The mirror** — one Durable Object a shop, `durables/CatalogKeeper/`; the entries it publishes — `services/catalog/projection.ts`; narrowing, ordering and the counts — `services/catalog/browse.ts`; the query's bounds — `services/catalog/query.ts`
- **Shopify client** — `packages/shopify/backend/src/catalog/`
- **Frontend page** — [ProductListingPage](https://github.com/9gag/grade10/blob/main/apps/frontend/grade10/src/pages/store/ProductListingPage.tsx); catalogue reads and product mapping live in `packages/grade10-store/frontend/src/features/products/catalog/`
- **Design note** — [the catalogue index](/references/store-catalogue-index)
- **Commerce architecture** — [docs/architecture/commerce.md](https://github.com/9gag/grade10/blob/main/docs/architecture/commerce.md)
:::

## Product Data

| Rule | Value |
| --- | --- |
| A change Shopify tells the store about | On every listing within 10 s |
| A change Shopify never mentions | Within 5 minutes |
| How often each server checks for a newer copy | Every 3 s, while the listing is in use |

- **Source** — the store's own copy of the catalogue, so browsing works while Shopify is down
  - **Waits for Shopify** — opening a product, reviewing the cart
  - **Up to a Minute Behind** — a product page, a collection's listing; the cart checks Shopify live and has the final word on price and stock — [Commerce](/p/grade10-site/commerce/commerce)
- How it stays current is in [the design note](/references/store-catalogue-index)

:::detail{title="Product decisions" for="pm"}
Collectors arrive knowing what they collect, usually a world or a kind of
card. The shop's collections are a merchandiser's groupings, which don't match
how collectors think, so the listing filters by world and type and lets
collections stay a way in from the home page. Every option shows a count so a
collector can see how much is there before picking.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector who collects one world | Opens the listing cold | Narrows to their world and sees how much is there before picking. |
| Collector following a home page tile | Arrives inside a collection | Sees which collection they are in, and can step out of it. |
| Collector hunting a price | Sorts by lowest price | Sees the cheapest product for sale in the whole store, not the cheapest already loaded. |
| Collector sharing what they found | Pastes the address | The receiver opens the same view. |

**Not in scope.** Filtering inside a collection. Searching inside a
collection. Sorting by popularity, since nothing measures it. The home page's
collection grid.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Filtered sessions | Share of listing visits that apply any filter, search or collection. No baseline yet; the first release sets it. | Product |
| Time to first filtered result | From opening the listing to the first filtered grid. Not measured yet. | Product |
| Search use | Share of listing visits that search or pick a suggestion, and the time from first keystroke to a product or results. No baseline yet. | Product |
| Product opens from the listing | Share of listing visits that open a product, read as Product Viewed with Source `Listing` or `Search` - [Mixpanel Events](/p/grade10-site/analytics/mixpanel-events). | Product |
| Listing response time | From a filter change to its first grid, p95, at the edge. ❓ Nothing records it yet; staging figures are in [the design note](/references/store-catalogue-index). | Engineering |
| Shop change to listing | From Shopify returning a change to every server having it, p95. ❓ Not measured until the release records it. | Engineering |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Filter by world and type, not collection | Decided | Collections are a merchandiser's grouping and stay a way in. | Design |
| A collection or filters, not both | Decided | Shopify can't filter within a collection natively; doing it ourselves would scan the whole catalogue for every request. Sort is not a filter, so it keeps the collection. | Engineering |
| Our own copy of the catalogue | Decided | The listing reads one copy the store keeps per shop, so Shopify's load doesn't grow with traffic and browsing survives a Shopify outage. Checkout still prices live — [Commerce](/p/grade10-site/commerce/commerce). | Engineering |
| Seconds, not minutes | Decided | A change should reach the listing in seconds. Shopify's own speed is the floor; the 5-minute refresh catches what it never reports. | Product |
| For sale first; price sorts on the cheapest variant | Decided | Sorting on the card's own price instead would mean backend changes and a collection would still sort Shopify's way. Product may reopen it. | Product |
| The address holds the view | Decided | Filters, search and sort are each a history entry, so a view can be shared and Back widens it. | Product |
| The count is the store's total | Decided | Counting loaded cards read the page size back as the store's size and grew as the collector scrolled, so it couldn't answer the one question a count is for: is it worth going on. Before the first results arrive the count shows nothing rather than `0 products`. | Engineering |
| Scroll position isn't kept | Decided | An address that carried scroll depth would no longer be the view people share. Keeping a collector's place needs its own evidence. | Product |
| Worlds show five | Decided | A shop can add worlds without limit; types are a closed list. | Design |
| No popularity sort | Decided | Nothing ranks products by popularity, so the menu doesn't pretend to. Latest is the default because the store can answer it. | Product |
| Keep an option at 0 | Decided | Hiding an option that a filter or search ruled out would leave the collector unable to undo it. | Design |
| Search on the listing, wide screens only | Decided | A search box in the site header would read as site-wide search, and the auction has none. Small screens use the filter pills instead. | Design |
| Signed-out cart | Decided | A signed-out collector adds to a cart kept in the browser and can check out from it. Replaces sign-in to add. | Product |
| No stock on browse | Decided | No remaining count, scarcity cue or quantity cap on the listing or product page. The cart is the only authority on quantity. | Product |
| Discounts on the card | Decided | The shop's automatic discounts are read from Shopify every minute and shown as [Discounts](/p/grade10-site/store/discounts#where-each-shows) describes. A discount that depends on the basket is the cart's to price; one an app computes can't be read, so it isn't shown. | Product |
| Filtering inside a collection | ❓ Open | Whether a collection and a filter can apply together; Shopify's reads don't prevent it. | Product |
| What search matches | ❓ Open | Titles only, as today, or titles, descriptions, tags and vendor as Shopify's own search does. | Product |
| Footer links | ❓ Open | The footer still shows destinations the site doesn't answer yet; [Page Shell](/p/grade10-site/site/page-shell) owns it. | Product |
:::
