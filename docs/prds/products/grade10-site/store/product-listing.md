---
title: Product Listing
spec: grade10-site/store/product-listing
order: 2
reviewed: 2026-09-11
---

The product listing is where a collector browses the catalogue and opens a
product.

- **Every product** — a card that opens its Product Details Page
- **One list that lengthens** — reaching the end of the cards adds the next
  ones below them, so the catalogue is read by scrolling; nothing offers a page
  number, a next control or a load-more button, and a new narrowing starts
  again at its own first page
- **A count of the whole set** — above the grid, how many cards the narrowed
  catalogue holds, never how many are on screen; it moves when the narrowing
  moves and stays still while the collector reads on
- **Stock is a ceiling** — a card's cart control stops where the shop's count
  stops, and the card says how many are left when the shop is nearly out or the
  collector has asked for the last one; a shop that counts nothing stops nothing
- **Filter** — the sidebar narrows by the world a card comes from and the kind
  of collectible it is, each choice with the catalogue's count beside it;
  worlds show five and an invitation to the rest, types show whole
- 🚧 **Filter on a small screen** — a Filter control opens a left drawer for
  worlds and types; the catalogue search field stays on the listing outside
  that drawer
- 🚧 **Worlds and Types as tabs on a small screen** — inside the filter drawer
  the two facet groups sit as tabs so expanding worlds does not push types
  down the scroll; the wide sidebar still stacks them
- 🚧 **Cart on a small screen** — where a tile sells, the cart control stays
  visible without hover on a narrow viewport and on touch
- **Search and sort** — both describe the whole catalogue, never the cards
  already on screen; the menu offers latest, lowest price and highest price
- 🚧 **Latest at rest** — the listing opens ordered by latest product and the
  sort control names that order; a link made at rest carries no order and
  opens on latest product just the same
- 🚧 **A listing can lag the shop** — which products it holds and the counts
  beside the facets by up to 5 minutes, or up to a day where nobody has opened
  the listing at that location in as long; a card's price and stock by up to
  5 minutes; a product's own page by up to a minute —
  [Commerce](/p/grade10-site/commerce/commerce)
- **A collection is a way in, not a filter** — the front door's tiles open the
  listing already inside one, named above the grid and dismissible; filtering
  or searching leaves it behind, because the catalogue narrows by a collection
  or by a query and never by both
- 🚧 **Ordering a collection** — a collection opens on latest product too, and
  choosing another order lists that collection in it rather than leaving it
- **URL** — the narrowing is in it, so a listing can be linked and shared, and
  Back undoes it; how far a collector has read is not, so an address opens at
  the first page of its narrowing
  1. `grade10.com/store/collections` — the whole catalogue
  2. `grade10.com/store/collections?collection=<handle>` — one collection
  3. `grade10.com/store/collections?worlds=<a>,<b>&types=<c>&q=<words>&sort=<order>`
     — the catalogue narrowed
  4. `grade10.com/store/products/<handle>` — a product's details page

:::detail{title="Code map" for="engineer"}
- **Reads** — `catalog.products`, `catalog.filters`, `catalog.collections`, `catalog.collection` and `catalog.product` in `packages/grade10-store/backend/src/trpc/routers/catalog.ts`, mounted ahead of the session tier by `trpc/publicCatalog.ts`
- **The copy** — `services/catalog/projection.ts`; narrowing, ordering and the counts — `services/catalog/browse.ts`; the query's bounds — `services/catalog/query.ts`
- **Shopify client** — `packages/shopify/backend/src/catalog/`
- **Frontend** — `packages/grade10-store/frontend/src/features/products/catalog/`
- **Design note** — [the catalogue index](/references/store-catalogue-index)
- **Commerce architecture** — [docs/architecture/commerce.md](https://github.com/9gag/grade10/blob/main/docs/architecture/commerce.md)
:::

## Product Tile

🚧 **Name opens the product** — the product name on a listing card opens
Product Details the same way the photo does; a sold-out card’s name stays
inert.

## Adaptive Filter

🚧 **Narrow pills** — below the wide breakpoint the listing shows the result
count and pills for sort and each facet group (Worlds, Types). Sort opens a
bottom drawer and applies on choose. A facet pill opens a bottom drawer for
that group; Show Results applies the draft; Clear empties that group’s draft.
Pill labels show the group name, a single option name, or a compact name with
count. No listing search, Filter icon, left drawer, or chip row on that
viewport. On a wide viewport the sidebar still stacks search and groups, and
the header still shows chips.

## Search

The listing search field lives with the filters. Typing drafts locally;
Enter or a suggestion selection is what acts.

- 🚧 **Suggestions while typing** — matching products and matching world or
  type filters, at most five of each, over the whole catalogue even when
  facets are already on; store hits only
- 🚧 **Empty and waiting** — no match shows that nothing matched; while hits
  are still resolving the field shows it is searching; Enter still commits
  the typed words either way
- 🚧 **Commit and pick** — Enter puts free text in force as a dismissible
  chip with the other applied filters and clears the field; picking a product
  opens that product and clears the field; picking a filter applies that
  facet, clears the field, and does not put free text in force

## Designs

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4288-13952" title="Filter panel"}

::story{id="pages-product-list-page--default" title="The listing, whole"}

::story{id="store-product-listing-productbrowse-states--no-match" title="A narrowing nothing matches"}

::story{id="store-product-listing-productbrowse-states--empty-catalog" title="A catalogue with nothing in it"}

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
popularity ordering — nothing computes one. Searching inside a collection. The front door's collection grid, which is unchanged.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Narrowed sessions | Share of listing visits that apply any narrowing. Unmeasured; the first delivery sets the baseline. | Product |
| Time to first narrowed result | From listing open to the first narrowed grid. Unmeasured. | Product |
| Search commit or suggestion | Share of listing sessions that commit free text or take a suggestion, and time from first keystroke to a product open or narrowed grid. Unmeasured; first delivery sets the baseline. | Product |
| Listing answer time | From a narrowing to its first grid, p95, measured at the edge. ❓ Unmeasured — nothing emits it; the staging figures are in [the design note](/references/store-catalogue-index). | Engineering |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Facets, not collections | Decided | The sidebar filters by world and collectible type. A collection is a merchandiser's grouping and stays a way in. | Design |
| One narrowing at a time | Decided | The catalogue narrows by a collection or by a query, never both, so applying either leaves the other behind. The alternative — a collection dimension on the query — cannot be served natively and would walk the whole catalogue for every scoped narrowing. An order is not a narrowing: it orders whatever set is in force, so choosing one inside a collection keeps the collection. | Engineering |
| Catalogue projection | Decided | The listing answers from a copy of the catalogue the worker holds and rebuilds from the shop by age, so the public catalogue opens no database connection and checkout still prices live. The price is staleness and a catalogue ceiling — [Commerce](/p/grade10-site/commerce/commerce); the step past one worker is [the design note](/references/store-catalogue-index)'s. | Engineering |
| Collection with facets | ❓ Open | Whether a collection and a facet can be applied together; nothing in the catalogue's own reads prevents it. | Product |
| Free text matches | ❓ Open | The title only, as today, or title, description, tags and vendor as Shopify's own search read. | Product |
| Price order | Decided | Sorts on the product's price: the catalogue carries one variant per product, so the price a card shows is the price it sorts on. A product with several variants would sort on its cheapest, sold out or not, as Shopify's own price sort does. | Product |
| The address is the state | Decided | Facets, search and order all live in the address, each a history entry, so a narrowing links and Back widens. | Product |
| Counts are the catalogue's | Decided | Counted over the whole narrowed set with the facet's own selection excluded, so ticking one world leaves the others showing what picking them instead would find. | Engineering |
| The count above the grid is the same count | Decided | The number over the listing is the catalogue's own over the whole narrowed set, the rule the facet counts already follow, so a choice's count is the size of the listing choosing it opens. Counting the cards on screen instead read the page size back as the shop's size and grew as the collector read on, leaving the one question a count answers — whether it is worth going on — the one it could not. A narrowing whose first page has not arrived says nothing, because `0 products` is a claim the catalogue never made. | Engineering |
| Scroll depth is not restored | Decided | An address opens a narrowing, never a place in it, so returning from a product page starts at the top of the listing. Keeping a collector's place is worth its own evidence, and an address that carried depth would no longer be the narrowing it is shared as. | Product |
| Worlds cap at five | Decided | A shop grows worlds without bound; the types are a taxonomy the platform closes and are shown whole. | Design |
| No popularity order | Decided | Nothing ranks products by popularity, so the menu does not claim to. At rest the listing is ordered by latest product instead — an order the catalogue can answer, so a collector arrives on one the control can name. | Product |
| A starved facet is still offered | Decided | Once a query is in force, nothing behind a choice is the query's doing rather than the shop's. Hiding the group would strand the collector, and a selection nobody can undo is a trap. | Design |
| No facets, no panel | Decided | A shop that has configured none gets no facet group and no message in its place; search and sort stay. It is not a fault the collector is told about. | Product |
| Utility row | Decided | Help, Shipping and Orders & Returns are drawn now, each against the placeholder the site already gives a link it owes, and become real addresses as the pages land. | Product |
| Cap is advisory | Decided | The shop's count is stale the moment it is read, so a control bounded by it is honest rather than correct. The cart's review stays the only authority, and goes on putting a line back down to what the shop can honour. | Engineering |
| One threshold everywhere | Decided | Nearly out is the same count on the listing, the product page and the cart. A second definition would leave the shop unable to say which of them is right. | Product |
| A count is news, not pressure | Decided | A card says how many are left where the collector learns something — the shop is nearly out, or they have just asked for the last one. A count on every card is a shop hurrying everybody. | Product |
| Links the site owes | ❓ Open | Drawing a placeholder departs from `grade10-site/site/page-shell`, which says a link appears only where the site answers it. The footer already departs the same way. Settling it belongs to page-shell. | Product |
| Search stays on the listing | Decided | The field lives with the listing filters, not in the site header. Auction has no search surface yet, and a nav search would read as site-wide find. | Design |
| Small screen: search outside the drawer | Decided | On a narrow viewport, Filter opens a left drawer for facets only. Catalogue search stays on the listing so typing does not require opening Filter. | Design |
| Worlds and Types as tabs on small screens | Decided | Inside the filter drawer the two facet groups are tabs so expanding worlds does not push types down the scroll. The wide sidebar still stacks them. Nested drill-down was ruled out for a closed pair of groups. | Design |
| Typing suggests; Enter commits | Decided | Suggestions are products and matching world or type filters. Enter commits free text as a chip with the other applied filters. Picking a product opens it; picking a filter applies that facet. The field clears after commit or pick. | Design |
| Suggestions cover the whole catalogue | Decided | Product hits are catalogue-wide even when facets are already on, matching free-text search. | Product |
| Five hits per group | Decided | Products and Filters each show at most five matches. More noise does not help a jump. | Design |
| When to ask for hits | Decided | The application chooses when to supply suggestion groups — character threshold, debounce, and pending. The shared field only shows what it is given. | Engineering |
| Filter row names the value | Decided | A filter suggestion shows the facet value as the row label and the facet kind (World or Type) as trailing chrome, not a single "World · value" string. | Design |
| Empty panel, still commit | Decided | No match shows that nothing matched. Enter still commits the typed words. | Design |
:::
