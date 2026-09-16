# Tech design

## Context

See `proposal.md` — Why. The requirements are the delta beside it.

Two of the five scenarios are cover over what already ships; three are new, and
one of the three reaches a read path that takes no order today:

| Scenario | Today |
| --- | --- |
| `SC-13` An order covers the whole catalogue | Ships — the catalogue orders the narrowed set, never the cards loaded |
| `SC-15` The menu offers only answerable orders | Ships — `CATALOG_SORTS` is `price_asc`, `price_desc`, `latest`, and the site's menu is those three. Popularity is not a `CatalogSort` and the site never offered it |
| `SC-29` At rest the order is latest | **New** — an address naming no order leaves `CatalogQuery.sort` null, the catalogue answers in its own order, and the trigger reads `Sort by` with no option marked |
| `SC-39` A collection opens on the resting order | **New** — `catalog.collection` takes a handle and a cursor, and no order |
| `SC-40` An order holds the collection it was chosen in | **New** — choosing an order leaves the collection behind, the rule this delta modifies |

What the surfaces and the catalogue hold today:

- **The address is the state.** The listing holds none of the facets, the words
  or the order: `listingAddressFrom` reads all three off the address and
  `addressFor` writes them back. A resting order decided anywhere else can
  disagree with what the request asked for.
- **The sort trigger is one sentence the site supplies.** `ProductListHeader`
  renders the string it is given and marks the option whose id it is given, so
  the trigger, the mark and the request are one decision made in the page.
- **`SearchSortKeys` is `[PRICE, RELEVANCE]`.** Shopify's search cannot answer
  recency, so `latest` already leaves the native path and walks the catalogue
  in memory — `nativeAnswers` in `browse.ts`. Resting on latest makes the walk
  the resting path.
- **`latest` is `createdAt` descending, ties broken by product id**, so a page
  boundary lands in the same place every time.
- **A collection's products are their own connection.**
  `collection.products` accepts `ProductCollectionSortKeys` — `CREATED` and
  `PRICE` among them, `COLLECTION_DEFAULT` being what it answers now — so an
  order inside a collection is a variable on the query the worker already
  sends, not a second read and not a walk.

## Goals / Non-Goals

**Goals:**

- One name for the resting order, read by the trigger, the menu mark and the
  request alike
- A collection ordered by the same three options as the catalogue, in the one
  round trip it already costs
- An address that spells only what departs from rest

**Non-Goals:**

- Computing a popularity signal — `proposal.md`, Non-Goals
- A fourth order, or a resting order a shop can set
- Changing what a count answers: a count describes the set, not its order

## Decisions

### The resting order is decided where the address is read

`listingAddressFrom` resolves an address naming no order to `RESTING_SORT`,
and `addressFor` leaves that order out again. Every reader downstream — the
trigger copy, the menu mark, the catalogue read, the walk key — sees the one
order, so none of them can name a different one.

- **Why the address layer.** It is the only place all four readers pass through. A default held in the page would have to be applied again in the copy, the mark and the query, and the three would drift apart on the first change.
- **Why not a default in `EMPTY_CATALOG_QUERY` or `catalogQueryFrom`.** That pair is the catalogue's own vocabulary, shared by every consumer of `@grade10/store-frontend`: `EMPTY_CATALOG_QUERY` is also the value that clears every narrowing, and `catalogQueryFrom` is the codec a second site reads addresses with. A resting order is one site's choice about its own surface, and the domain would lose the ability to say "no order", which the catalogue still answers for a caller that asks for none.
- **Why not a default in the worker**, with `order()` reading null as latest. The surface has to name the order in the trigger, and it would then be naming one it never asked for. It would also take every other caller of the browse route off the native search and onto the walk without asking.
- **Rejected — writing `sort=latest` into the address on arrival.** A redirect nobody asked for, a history entry the collector did not make, and every link then spells a default that is the site's to change.
- **Rejected — marking the first option in `ProductListHeader` when no value is supplied.** The menu would say latest while the request asked for no order, and the block would be deciding a product rule from the shape of its own props.

### An order rides the collection read

`catalog.collection` takes an optional `sort`, the same `CatalogSort` the
products route reads, and the Shopify port maps it onto the products connection
of the collection it is already fetching:

| Order | `ProductCollectionSortKeys` | `reverse` |
| --- | --- | --- |
| `latest` | `CREATED` | `true` |
| `price_asc` | `PRICE` | `false` |
| `price_desc` | `PRICE` | `true` |
| none asked | `COLLECTION_DEFAULT` | `false` |

The site always asks for one, so `COLLECTION_DEFAULT` is what a caller gets by
saying nothing rather than a state the listing can reach.

- **Why the collection keeps its order rather than widening.** A collector who arrives through a front-door tile and orders the cards is asking to read that collection newest first, not to leave it. An order is not one of the ways the catalogue narrows — it orders whatever set is in force — so it is the one act on the listing that does not have to choose between a collection and a query.
- **Why the connection and not the walk.** The collection answers all three orders natively. Walking a collection in memory would buy the id tie-break and pay the ceiling `browse.ts` already names as the reason a projection will replace the walk.
- **Rejected — narrowing `search` to a collection so one engine answers both.** No product filter names a collection; that is why counting a collection walks its pages for ids.
- **Rejected — leaving the collection unordered and marking nothing in its trigger.** Honest, and it leaves the change's own promise — a collector arrives on an order the trigger names — untrue on every address the front door links to.

### The walk restarts because the key already carries the order

The cursors walked through a narrowing are held under
`listingKeyOf({ query, collection })`, whose query half is
`productsSearch(query)` — which spells the order. A new order is a new key, so
the walk is dropped and the first page of the new order is read, inside a
collection as much as outside it. Nothing new is needed for `SC-24` to keep
holding.

## API Contracts

`catalog.collection` gains `sort`, optional, one of `CATALOG_SORTS`. Additive:
a caller that omits it still gets the collection's merchandised order, and no
other catalog procedure changes.

## Risks / Trade-offs

- **[Every resting listing walks the catalogue]** → `latest` cannot be answered by Shopify's search, so the unnarrowed listing walks once per cold cache entry rather than taking the native path. That is the ceiling `browse.ts` already documents and accepts at today's size, and `WALK_MAX_PAGES` is where it refuses rather than degrades quietly. It is the resting path now, so the projection that replaces the walk becomes the change worth making sooner, not a different change.
- **[One order name, two tie-breaks]** → The catalogue's walk breaks a `latest` tie by product id; Shopify breaks `CREATED` its own way inside a collection. Each is stable within its own path, which is what cursor paging needs, and no surface reads a collection's page against the catalogue's.
- **[The address no longer spells the resting order]** → A link made at rest carries no `sort`, so changing the resting order later changes what an old link opens. Taken deliberately over a default written into every link and a history entry on arrival.
- **[A collection address gains a second meaning]** → `?collection=<handle>&sort=price_asc` renders a collection that today's code drops. The address is read and written in one module, so a hand-written address and a click resolve the same way; the two scenarios that said an order drops the collection are modified by this delta rather than left to disagree.
- **[A shop that merchandised a collection by hand loses that order on arrival]** → The collection opens by latest product, not in the merchandiser's arrangement. The merchandised order stays reachable through the port for any caller that asks for none, and whether a collection should open the way it was arranged is a product question this delta answers as latest.

## Open Questions

None.
