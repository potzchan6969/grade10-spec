---
title: Product Listing
spec: grade10-site/store/product-listing
order: 2
---

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
- **Combining Options** — options ticked in one group widen the results; options in different groups narrow them
  - Pokémon + One Piece shows both worlds; adding Graded Cards keeps only the graded cards from either
- **Option Count** — number of products picking the option would give, with the other filters
  - **Empty Option** — hidden when the store has nothing for it; shown at 0 when the current filters rule it out
- **Narrowings in Force** — each ticked option, the search words and the collection, named above the grid; dismissing one widens the listing
  - ❓ **Clearing Every Filter** — one control above the grid drops them all, offered where nothing matches. Product confirms
- **Small Screens** — the count, Worlds and Types as pills above the grid, each opening a drawer from the bottom; a drawer applies on confirm

::story{id="store-product-listing-blocks-filterpanel--default" title="Filter panel"}

::story{id="store-product-listing-blocks-productbrowse--narrow" title="Small screen" height="720" width="375"}

## Sort

- **Sort Options** — Latest (default), lowest price, highest price
  - **Scope** — the whole store
  - **Sold Out** — last, whichever the sort
  - **Price** — a product's cheapest variant, which can differ from its card's price
- **Small Screens** — a Sort pill beside the filter pills, opening a drawer from the bottom; applies on pick

:::callout{kind="note"}
- ❓ **Sort drawer** — whether it closes on pick. Design confirms
:::

## Search

- **Search Box** — wide screens only, at the top of the filter sidebar
  - **Suggestions** — up to five products and five worlds or types, from the whole store
    - **Picking a Suggestion** — a product opens it; a world or type applies that filter
  - **Enter** — searches the typed words, shown as a removable chip

:::callout{kind="note"}
- ❓ **What matches** — titles only, as today, or descriptions, tags and vendor too. Product confirms
:::

::story{id="store-product-listing-blocks-productbrowse-search--suggestions-and-commit" title="Search"}

## Collection Page

- **Entry** — a home page tile opens the listing as its collection's page: only the products the shop groups together in Shopify, the collection named above the grid, with a way out to the whole store
- **Leaving** — a filter or a search leaves the collection; a sort keeps it

## Links and Back Button

- **Address** — holds the collection, filters, search and sort, so a link opens the same view and Back undoes the last change
  - **Scroll Position** — a link, or Back from a product, starts at the top

1. `grade10.com/store/collections` — everything
2. `grade10.com/store/collections?collection=<handle>` — one collection
3. `grade10.com/store/collections?worlds=<a>,<b>&types=<c>&q=<words>&sort=<order>` — filtered, searched or sorted
4. `grade10.com/store/products/<handle>` — a product page

## Catalogue Source

- **Source** — the store's own copy of the catalogue, so browsing works while Shopify is down
  - **Product changes** — a change Shopify reports by webhook is on every
    listing within 10 s
  - **Stock changes** — at the next full read, at most 30 s after the last one
  - **Lost changes** — a change whose webhook was lost is on every listing
    within 5 minutes
- **Read from Shopify** — what never reads the mirror
  - **Waits for Shopify** — opening a product, reviewing the cart
  - **Up to a Minute Behind** — a product page, a collection's listing, behind a 60 s cache; the cart checks Shopify live and has the final word on price and stock — [Commerce](/p/grade10-site/commerce/commerce)

:::detail{title="Catalogue mirror" for="engineer"}
- **Catalogue Mirror** — every product the sales channel publishes, held in one Cloudflare Durable Object per shop; the listing, its filters and its counts read only this copy
- **Shopify Webhook** — `products/create` and `products/update` mark the product pending; the mirror then reads it back from the Storefront API, never from the webhook's payload, which carries no metafields and so no worlds or types
  - **Burst** — webhooks within 1 s of the first are read back together and published once
  - **Read-Back** — retried every 2 s until Shopify answers the new version, for 60 s at most, then left to the full read
- **Deleted Product** — `products/delete` takes it off at once
- **Stock Change** — `inventory_levels/update` names a stock item, not a product, so it starts a full read, at most one every 30 s
- **Full Read** — every product read from Shopify every 5 minutes on the store's cron, which catches a change whose webhook never arrived
- **Worker Copy** — each worker holds the copy in memory and asks the mirror for a newer version every 3 s while the listing is in use, waiting 500 ms at most before answering from what it holds

::image{src="assets/diagrams/store-catalogue-change.svg" alt="A product saved in Shopify reaches the listing: the webhook marks it pending in the catalogue mirror, the mirror reads it back from the Storefront API and publishes a new version, and each worker picks it up on its next 3-second check"}

- **Measurements and failure cases** — [the design note](/references/store-catalogue-index)
- **Commerce architecture** — [docs/architecture/commerce.md](https://github.com/9gag/grade10/blob/main/docs/architecture/commerce.md)
:::

:::detail{title="Product decisions" for="pm"}
Collectors arrive knowing their world or kind of card; the shop's collections
are a merchandiser's groupings, so the listing filters by world and type and
collections stay a way in from the home page.

- **A collection or filters, not both** — Shopify can't filter within a collection, and doing it ourselves scans the whole catalogue per request. Sort isn't a filter, so it keeps the collection
- **Our own copy of the catalogue** — Shopify's load doesn't grow with traffic, and browsing survives its outage; checkout still prices live — [Commerce](/p/grade10-site/commerce/commerce)
- **Price sorts on the cheapest variant** — the card's own price needs backend changes, and a collection would still sort Shopify's way. Product may reopen it
- **The count is the store's total** — counting loaded cards grew with the scroll, so it couldn't say whether going on is worth it
- **Scroll position isn't kept** — an address carrying scroll depth stops being the view people share
- **Keep an option at 0** — hiding one a filter ruled out leaves no way to undo it
- **Search on the listing, not the header** — a header box reads as site-wide search, and the auction has none
- **No popularity sort** — nothing measures popularity
- **Not in scope** — filtering or searching inside a collection; the home page's collection grid
- **Measured by** — product opens from the listing, as Product Viewed from `Listing` or `Search` — [Mixpanel Events](/p/grade10-site/analytics/mixpanel-events)
  - ❓ **Unmeasured** — filtered sessions, time to a filtered result, search use, listing response time and shop-change lag; nothing records them yet. Product and Engineering confirm
:::
