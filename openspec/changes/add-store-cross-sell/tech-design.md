## Context

- **The card's page reads the shop live** — `catalog.product` answers behind
  the 60 s cache tier; the listing reads the store's mirror of the catalogue
  ([the catalogue index](../../../docs/references/store-catalogue-index.md))
- **The mirror holds every product whole** — the shop's own JSON per product,
  its facets as lists of handles read from the custom-data metafields'
  metaobject references ([Q45](decisions.md#decisions)), its variants with
  availability; every isolate holds a copy and follows one keeper per shop
  from memory
- **The picks live in Shopify** — [Q1](decisions.md#decisions): chosen on the
  card by the stock keeper; which Shopify field holds them is this file's
- **The rail is cross-sell's own** — its place on the page is a requirement of
  `grade10-site/store/cross-sell` ([Q10](decisions.md#decisions)); nothing is
  folded into `grade10-site/store/product-page`, so the redesign's delta and
  this change never touch one block

## Goals / Non-Goals

**Goals**

- **One read, one rail** — the card's page answers with its rail in the same
  response as the card, from the one Storefront read the page already makes
- **The stock keeper's order kept** — the picks arrive in the order the shop
  holds them, never re-ranked
- **The same rail for the same catalogue** — one card, one projection
  version, one list of six; two reads over the same version never differ

**Non-Goals**

- **A second store of picks** — nothing is written outside Shopify
- **Ranking by the shop** — Shopify's own recommendation ranking is not read
  for the similar cards ([non-goals](decisions.md#non-goals))
- **A precomputed rail** — no nightly job, no table of related cards
- **The block** — the rail block, its props and its words are
  [`ui-design.md`](ui-design.md)'s and the spec's export requirement; it
  lands in this store and owes no design here

## Decisions

### The picks are the card's complementary-products list, one field on the read the page makes

The spec governs what the rail holds and in what order. The picks are the
product's **complementary products** list — the standard metafield Shopify's
Search & Discovery app writes when a stock keeper picks products on the card
— read as **one more field on the card page's Storefront query**: the
metafield's `value`, a JSON list of product gids in the order stored.

- **A field, not a round trip** — the list rides the query that reads the
  card, so it cannot fail on its own and the one-read goal holds; a shop
  whose product carries no such field answers `null`, which is "no picks"
- **A query of its own** — `GET_PRODUCT_WITH_PICKS` is the product fragment
  plus the field, aliased `picks`, behind `getProductWithPicks(handle)` on
  the `ShopifyCatalog` port; the shared fragment and `getProductByHandle`
  stay as they were, so no other read, and not the mirror's body, carries
  the list
- **`value`, not `references`** — every pick is resolved against the mirror,
  so only the ids are wanted; a value that is not a list of product gids is
  unreadable, and the card still answers
- **Rejected: `productRecommendations`** — mixes the shop's ranking in when
  the list is short, in the shop's order
- **Rejected: a custom metafield of handles** — a second definition the
  stock keeper fills beside the one the app already draws a picker for
- **Rejected: carrying the list in the mirror** — one source and one failure
  mode, at the cost of the picks following the mirror's read-back and
  re-read on top of the page's minute, and a list in every row of the body the
  1 MB alert watches; the live field costs nothing the page does not pay today.
  Whether a metafield edit fires `products/update` is unverified — the index
  carries two open items of that shape — so picks in the mirror would wait on
  the 5-minute walk whenever it does not, and the stock keeper's own edit is
  the one thing in this rail that must not

### The rail is one pure function over the card, its picks and the mirror's entries

The spec governs the rule (world, then language, then type; newest first; not
the card itself; not sold out). One function owns it:

`relatedRail({ cardId, pickIds, entries, limit })` in
`services/catalog/related.ts` beside `browse.ts`, `limit` defaulting to the
rail's six (Q35), returning the rail's cards in final order:

1. **The picks** — each id resolved to the mirror's entry, in the stored
   order; an id no entry answers is left out and counted
2. **The similar cards** — every other entry that shares one of the three
   facts, sorted on the ordered triple *(shares a world, shares a language,
   shares a type)* — each true or false, a fact shared by any of its handles
   counting once — then the entry's created date newest first, then the
   product id as text; never the card itself, never a card already among the
   picks, never a card with no variant for sale
3. **The cut** — the picks, then similar cards, to `limit` (6)

- **The triple, not weights** — a sort on the triple is the rule as the spec
  states it; a fourth fact slots into the order rather than forcing new
  weights
- **One facet source** — the rule reads the mirror's facet handles, drawn
  from the custom-data metafields alone (`custom.ip_worlds`,
  `custom.collectible_type`, `custom.collectible_language`), the ones the
  listing filters on; the page's badges today read the native product type and
  the `world:` and `language:` tags, so a card can be similar by world and
  wear no world badge — the badges move onto the same fields as a follow-up
  outside this change ([Q45](decisions.md#decisions))
- **The date the listing already calls newest** — the entry's created date,
  the listing's "latest" order; never the shop's `updatedAt`, on which any
  price edit would reshuffle every rail
- **Rejected: a precompute per publish** — stale inside the window the
  mirror already closes, and a table the mirror would have to invalidate
- **Rejected: the shop's `search` by tag** — one Shopify round trip per card
  view, and a filter the shop never advertises answers the whole catalogue

### The card's read composes the rail from the copy it holds, and never waits on the mirror

`catalog.product` gains an optional `related` input, set by the card's page
alone, and where it is set, `related` on the answer: the per-tile shape
`catalog.products` already answers (its contract sits in
`packages/grade10-store/contracts`, as the redesign's Impact names it; cited
from that proposal, not read here), in final order; nothing on the wire says
which half a card came from, and nothing of the mirror's internal cut reaches
the wire. The page maps each entry to the block's prop type, `ProductSummary`
in `@grade10/ui`, with the formatter the listing already uses —
`ProductSummary` is display-ready React props, never a wire shape.

- **A held-copy read, new to this procedure** — the rail reads the copy the
  isolate holds through `storeKeeper(env)` and nothing else: no `sync` inside
  the request, nothing thrown. The listing's read path — wait on `sync` under
  the 5 s budget, `catalog_unavailable` when nothing is held, `waitUntil` on
  the ≤ 500 ms check — is not called from this procedure. Holding nothing,
  the read answers the card with no rail, counted `no_mirror`, and schedules
  the fill so the next request holds a copy
- **The card's own facts come from the copy** — its world, language and type
  handles are read from its own entry in the held projection, found by id;
  never from the live product node, whose badges read tag prefixes alone. A
  card the copy does not hold yet gets its picks and no similar cards, counted
  `card_unresolved`
- **Same response, same cache** — the rail is cached with the card under the
  60 s tier (`middlewares.cache(60)` from `@grade10/worker`, per route), so a
  pick edit reaches the page within the page's own minute and the page never
  moves on arrival. A `no_mirror` answer is cached with it: the cold isolate
  is the request that creates the colo's entry, and a per-response opt-out is
  work in the worker package; an empty rail for a minute at one colo is
  accepted and counted
- **Rejected: a second procedure the page calls after load** — a rail that
  arrives after the card moves the page and is not in the response
- **Rejected: `source` on each card** — a field no tile may draw and no case
  can assert; the split is counted where it is computed

### What each window carries

- **A pick's presence** — the list is on the live read: within the page's
  minute, as [Q8](decisions.md#decisions) promises
- **A pick's tile and the similar set** — from the mirror's copy: within the
  mirror's own window on a report, 5 minutes at worst on the re-read, and the
  page's minute on top; a pick the mirror has not heard of yet is left out
  until it has

### The rail has one off switch, in the brand's store config

`CROSS_SELL` in the application's `packages/app-env`, a
`Record<Brand, Record<DeployEnv, boolean>>` beside `POINTS_TENDER`, is on
wherever the store runs. `deps.ts` reads it beside the brand's other config,
and both catalog contexts carry it as `crossSell`. The card's read,
`readCard` in `services/catalog/related.ts`, holds the whole decision, so the
catalog router only maps its outcome. Asked for the rail with the switch off,
the read never asks the shop for the picks, composes nothing and counts
nothing, and answers the card with an empty rail, which the page reads as no
rail (`grade10-site-store-cross-sell-SC-34`, Q55). It never leans on the
contract's decoding default, which goes with 3.2's deploy (Q40).

- **Deployed as code** — a switch that changes on a deploy holds no state to
  repair; a database switch would still wait out the read's cached minute
- **The page needs no switch of its own** — it already draws nothing for an
  empty rail, so the one read that composes the rail is the one place it turns
  off

## Service Interfaces

| Function | Input | Output |
| --- | --- | --- |
| `relatedRail({ cardId, pickIds, entries, limit? })` — `services/catalog/related.ts` | the card's id; the pick ids in the entry id's form, in the stock keeper's order, empty where absent or unreadable; the held projection's entries, each saying whether it has a variant for sale; the limit, six by default | the rail's entries in final order: resolved picks in stored order, then similar cards on the triple, the date, the id; never the card, never a pick twice, never sold out among similar; at most the limit; with the unresolved pick ids and whether the copy holds the card, for the counter |
| `composeRelated({ product, picks, projection })` — `services/catalog/related.ts` | the product as the shop answered it; its picks as the read found them — `ids`, `absent` or `unreadable` with the reason; the copy the isolate holds now, or null | whole cards in rail order, each its entry's own product, the outcome and the picks let go; counted, timed and logged with the copy's version; never a throw |
| `getProductWithPicks(handle)` — `ShopifyCatalog`, `@grade10/shopify-backend` | the card's handle | the product and its picks from `GET_PRODUCT_WITH_PICKS`, one Storefront query; `notFound` and the shop's failures as `getProductByHandle` answers them |
| `projectionEntryOf(product)` — `services/catalog/projection.ts` | one product of the keeper's body | its `ProjectionEntry`, carrying `forSale` — any variant for sale — and the `product` itself, the one object the listing and the rail answer |
| `catalog.product` — `trpc/routers/catalog.ts` | `{ handle, related? }` | the product as today; with `related: true`, plus `related` in the wire shape above |

- **The boundary** — entrypoint (`catalog.product` asked for `related`, which
  reads the copy the isolate holds through `ctx.projection.held()`, as the
  listing's procedures read `projectionOf(ctx)`) → service (the rail's
  compose, pure over the product and the held copy, calling `relatedRail`) →
  keeper (the held copy alone; no `sync` in the request; past the interval a
  check behind the response). No table, no write, no transaction: every value
  is derived on the read

## API Contracts

| Procedure | Change | Consumer |
| --- | --- | --- |
| `catalog.product` | Additive: an optional `related` input; set, the answer gains `related`, the per-tile shape `catalog.products` answers today, in rail order, empty where there is nothing to show; unset, the answer is today's | The card's page in `grade10`, the one caller that sets it |
| `ProductSummary` (`@grade10/ui`) | Additive: an optional `href`, the product's address, which `ProductList` and the rail pass to `ProductCard`'s own optional `href`, so a tile that opens is a link (Q52); the page builds one per `related` entry with the listing's formatter and the card's address | The rail block; `ProductList`, whose consumers give none yet |

| Half | Where it lands |
| --- | --- |
| The rule and the read | `packages/grade10-store/backend`: `services/catalog/related.ts`, `trpc/routers/catalog.ts` |
| The block | This store, `packages/ui/src/blocks/store-product/store-product-related-rail.tsx`, and the heading in `packages/i18n/messages/shared/<locale>/product.json` |
| The page | `apps/frontend/grade10/src/pages/store`, composing the block from `@grade10/ui` with the heading from `@grade10/i18n`, and owning the map from the wire shape to `ProductSummary` |

## Metrics

| Metric | Labels | Meaning |
| --- | --- | --- |
| `store.catalog.related` | `outcome`: `ok`, `empty`, `no_mirror`, `card_unresolved`, `pick_unresolved`, `picks_absent`, `picks_unreadable` | One per card read that composes a rail, told apart most-specific first in that order; `picks_absent` is a product with no complementary field at all — or one the token cannot read — told apart from an empty list, and alerts when it rises on a shop that has the app |
| `store.catalog.related_ms` | — | The compose, memory to cards |

## Failure

| Case | The rail | The record |
| --- | --- | --- |
| The isolate holds no projection | No rail; the card answers; the fill is scheduled; cached with the card for the minute | `outcome:no_mirror` |
| The copy does not hold the card yet | Its picks, no similar cards | `outcome:card_unresolved` |
| The product carries no complementary field | Similar cards alone | `outcome:picks_absent`, alerted |
| A pick the mirror has no entry for | Left out; the rest of the rail stands; the ids on the log line | `outcome:pick_unresolved` |
| The complementary list cannot be read, or holds anything but product gids | Similar cards alone, as for a card nobody chose for | `outcome:picks_unreadable`, the reason logged |
| Nothing shared, no picks | No rail — the ordinary answer | `outcome:empty` |
| The rail switched off (`CROSS_SELL`) | No rail; the card is read alone and no picks are asked for | None: nothing is composed |

## Risks / Trade-offs

- [The complementary list's namespace and key on the Storefront API, and
  whether the shop's private token exposes it] → settled by
  [Q45](decisions.md#decisions): the Search & Discovery app's
  `shopify--discovery--product_recommendation.complementary_products` field,
  read as stored; a token that cannot read it answers `picks_absent`, which
  alerts
- [A shop that never installed Search & Discovery] → every product reads
  `picks_absent`; the similar rule fills the rail; the run sheet checks the
  field on the staging shop, and the alert catches a production shop losing it
- [The product page joins the mirror's followers] → an isolate serving cards
  and no listing now holds a copy and asks for fills; the index bounds the
  keeper at about 155 isolates a window at 3,000 products, computed for
  listing isolates alone, so the count of isolates that hold a copy is what to
  watch on `store.catalog.sync`
- [Two locations, two projection versions] → two collectors on one card can
  see two rails inside one minute; the rule is deterministic per version and
  the version is logged with the compose
- [A card unpublished or sold out inside another card's cached rail] → stays
  in that rail for up to 60 s, and an unpublished one's tile opens the site's
  not-found page; accepted over purging by every rail card's tag, which needs
  the table of related cards this design refuses
- [The projection cut to cards past 1 MB] → the facets and the created date
  the rule reads stay in the cut, as the listing's facets do
- [A transient miss cached for a minute] → one cold isolate answers an empty
  rail to every collector on that card at that colo for 60 s, counted
  `no_mirror`; accepted over a cache opt-out that is work in the worker

## Migration Plan

- **Nothing to migrate** — no schema; the one switch, `CROSS_SELL`, is code
  and on; the rail is on the card's page, which the site's `store` gate keeps out of every production
  build until the shop opens
  ([Where It Is Open](../../../docs/prds/products/grade10-site/store/index.md#where-it-is-open)),
  and `related` rides a read only that page asks for, as the listing's does.
  Where the page is carried, the rail shows where the read answers cards and
  stays absent where it answers none
- **Rollback** — revert the read; the page renders without `related`
