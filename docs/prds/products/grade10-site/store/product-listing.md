---
title: Product Listing
spec: grade10-site/store/product-listing
order: 2
---

The product listing is where a collector browses the catalogue and opens a
product.

- **Every product** — a card that opens its Product Details Page
- **Stock is a ceiling** — a card's cart control stops where the shop's count
  stops, and the card says how many are left when the shop is nearly out or the
  collector has asked for the last one; a shop that counts nothing stops nothing
- **Filter** — the sidebar narrows by the world a card comes from and the kind
  of collectible it is, each choice with the catalogue's count beside it;
  worlds show five and an invitation to the rest, types show whole
- **Search and sort** — both describe the whole catalogue, never the cards
  already on screen; the menu offers latest, lowest price and highest price,
  and nothing is in force until the collector picks one
- **A collection is a way in, not a filter** — the front door's tiles open the
  listing already inside one, named above the grid and dismissible; filtering,
  searching or sorting leaves it behind, because the catalogue narrows by a
  collection or by a query and never by both
- **URL** — the narrowing is in it, so a listing can be linked and shared, and
  Back undoes it
  1. `grade10.com/store/collections` — the whole catalogue
  2. `grade10.com/store/collections?collection=<handle>` — one collection
  3. `grade10.com/store/collections?worlds=<a>,<b>&types=<c>&q=<words>&sort=<order>`
     — the catalogue narrowed
  4. `grade10.com/store/products/<handle>` — a product's details page

## Designs

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4288-13952" title="Filter panel"}

::story{id="pages-product-list-page--default" title="The listing, whole"}

::story{id="store-product-listing-productbrowse--no-match" title="A narrowing nothing matches"}

::story{id="store-product-listing-productbrowse--empty-catalog" title="A catalogue with nothing in it"}

:::detail{title="Product decisions" for="pm"}
A collector arrives knowing what they collect — a world, a kind of card — and
the shop's collections are a merchandiser's grouping rather than that. The
catalogue counts every choice itself, over the whole narrowed set, so the
sidebar can say how many cards sit behind a choice before it is picked.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector who collects one world | Opens the listing cold | Narrows to their world and sees how much is there before picking. |
| Collector following a front-door tile | Arrives inside a collection | Sees which collection they are in, and can step out of it. |
| Collector hunting a price | Sorts by lowest price | Is shown the cheapest card in the shop, not the cheapest already loaded. |
| Collector sharing what they found | Pastes the address | The receiver opens the same narrowing. |

**Not in scope.** Combining a collection with a facet in one query. A
popularity ordering — nothing computes one. Ordering or searching inside a
collection. The front door's collection grid, which is unchanged.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Narrowed sessions | Share of listing visits that apply any narrowing. Unmeasured; the first delivery sets the baseline. | Product |
| Time to first narrowed result | From listing open to the first narrowed grid. Unmeasured. | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Facets, not collections | Decided | The sidebar filters by world and collectible type. A collection is a merchandiser's grouping and stays a way in. | Design |
| One narrowing at a time | Decided | The catalogue narrows by a collection or by a query, never both, so applying either leaves the other behind. The alternative — a collection dimension on the query — cannot be served natively and would walk the whole catalogue for every scoped narrowing. | Engineering |
| The address is the state | Decided | Facets, search and order all live in the address, each a history entry, so a narrowing links and Back widens. | Product |
| Counts are the catalogue's | Decided | Counted over the whole narrowed set with the facet's own selection excluded, so ticking one world leaves the others showing what picking them instead would find. | Engineering |
| Worlds cap at five | Decided | A shop grows worlds without bound; the types are a taxonomy the platform closes and are shown whole. | Design |
| No popularity order | Decided | Nothing ranks products by popularity, so the menu does not claim to. At rest the catalogue's own order stands. | Product |
| A starved facet is still offered | Decided | Once a query is in force, nothing behind a choice is the query's doing rather than the shop's. Hiding the group would strand the collector, and a selection nobody can undo is a trap. | Design |
| No facets, no panel | Decided | A shop that has configured none gets no facet group and no message in its place; search and sort stay. It is not a fault the collector is told about. | Product |
| Utility row | Decided | Help, Shipping and Orders & Returns are drawn now, each against the placeholder the site already gives a link it owes, and become real addresses as the pages land. | Product |
| Cap is advisory | Decided | The shop's count is stale the moment it is read, so a control bounded by it is honest rather than correct. The cart's review stays the only authority, and goes on putting a line back down to what the shop can honour. | Engineering |
| One threshold everywhere | Decided | Nearly out is the same count on the listing, the product page and the cart. A second definition would leave the shop unable to say which of them is right. | Product |
| A count is news, not pressure | Decided | A card says how many are left where the collector learns something — the shop is nearly out, or they have just asked for the last one. A count on every card is a shop hurrying everybody. | Product |
| Links the site owes | ❓ Open | Drawing a placeholder departs from `grade10-site/site/page-shell`, which says a link appears only where the site answers it. The footer already departs the same way. Settling it belongs to page-shell. | Product |
:::
