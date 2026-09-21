## Context

- **The card's page reads the shop live** — `catalog.product` answers behind
  the 60 s cache tier; the listing reads the store's mirror of the catalogue
  ([the catalogue index](../../../docs/references/store-catalogue-index.md))
- **The mirror holds every product whole** — the shop's own JSON per product,
  its facets as lists of handles read from metafield references and tags
  (`world:`, `type:`, `language:`), its variants with availability; every
  isolate holds a copy and follows one keeper per shop from memory
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
— read as **one more field on the `catalog.product` Storefront query**: the
metafield's `value`, a JSON list of product ids in the order stored.

- **A field, not a round trip** — the list rides the query the page already
  makes, so it cannot fail on its own and the one-read goal holds; a shop
  whose product carries no such field answers `null`, which is "no picks"
- **`value`, not `references`** — every pick is resolved against the mirror,
  so only the ids are wanted; a `references` connection would pull nested
  product nodes the read throws away
- **Rejected: `productRecommendations`** — mixes the shop's ranking in when
  the list is short, in the shop's order
- **Rejected: a custom metafield of handles** — a second definition the
  stock keeper fills beside the one the app already draws a picker for
- **Rejected: carrying the list in the mirror** — one source and one failure
  mode, at the cost of the picks following the mirror's read-back and
  re-read on top of the page's minute, and a list in every row of the body the
  1 MB alert watches; the live field costs nothing the page does not pay today

### The rail is one pure function over the card, its picks and the mirror's entries

The spec governs the rule (world, then language, then type; newest first; not
the card itself; not sold out). One function owns it:

`relatedRail(card, pickIds, entries, limit)` in `services/catalog/related.ts`
beside `browse.ts`, returning the rail's cards in final order:

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
  from metafield references and tags alike; the page's badges today read the
  tag prefixes alone, so a card whose world is set by reference and not by
  tag can be similar by world and wear no world badge — the badge path reads
  the same handles, as a follow-up outside this change
- **The date the listing already calls newest** — the entry's created date,
  the listing's "latest" order; never the shop's `updatedAt`, on which any
  price edit would reshuffle every rail
- **Rejected: a precompute per publish** — stale inside the window the
  mirror already closes, and a table the mirror would have to invalidate
- **Rejected: the shop's `search` by tag** — one Shopify round trip per card
  view, and a filter the shop never advertises answers the whole catalogue

### The card's read composes the rail from the copy it holds, and never waits on the mirror

`catalog.product` gains `related: ProductSummary[]` — the listing's own
product summary, the shape the listing tile already takes (handle, name, first
image with its alt, price, compare-at, availability) — in final order; nothing
on the wire says which half a card came from, and nothing of the mirror's
internal cut reaches the wire.

- **Memory only** — the read takes the projection the isolate already holds
  through `storeKeeper(env)`'s held copy, the one path the store reads the
  mirror by; it never calls `sync` inside the
  request and never reaches `catalog_unavailable`, which the listing's path
  raises for a reader holding nothing. Holding nothing, the read composes the
  picks it can (none, since resolution needs entries) and answers the card
  with no rail, counted `no_mirror`, and asks for the fill behind the response
  through `waitUntil` as the listing does
- **Same response, same cache** — a rail composed over a held copy is cached
  with the card under the 60 s tier, so a pick edit reaches the page within
  the page's own minute and the page never moves on arrival; a `no_mirror`
  answer is served with no cache header, so the next request tries again
  rather than pinning an empty rail for a minute
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

## API Contracts

| Procedure | Change | Consumer |
| --- | --- | --- |
| `catalog.product` | Additive: `related: ProductSummary[]`, the listing's product summary, in rail order; empty where there is nothing to show | The card's page in `grade10`, which hands it to the rail block as tiles |

| Half | Where it lands |
| --- | --- |
| The rule and the read | `packages/grade10-store/backend`: `services/catalog/related.ts`, `trpc/routers/catalog.ts` |
| The block | This store, `packages/ui/src/blocks/store-product/store-product-related-rail.tsx`, and the heading in `packages/i18n/messages/shared/<locale>/product.json` |
| The page | `apps/frontend/grade10/src/pages/store`, composing the block from `@grade10/ui` with the heading from `@grade10/i18n` |

## Metrics

| Metric | Labels | Meaning |
| --- | --- | --- |
| `store.catalog.related` | `outcome`: `ok`, `empty`, `no_mirror`, `picks_absent`, `pick_unresolved` | One per card read that composes a rail; `picks_absent` is a product with no complementary field at all, told apart from an empty list, and alerts when it rises on a shop that has the app |
| `store.catalog.related_ms` | — | The compose, memory to cards |

## Failure

| Case | The rail | The record |
| --- | --- | --- |
| The isolate holds no projection | No rail; the card answers; the fill is asked for behind the response; not cached | `outcome:no_mirror` |
| The product carries no complementary field | Similar cards alone | `outcome:picks_absent`, alerted |
| A pick the mirror has no entry for | Left out; the rest of the rail stands | `outcome:pick_unresolved` |
| Nothing shared, no picks | No rail — the ordinary answer | `outcome:empty` |

## Risks / Trade-offs

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

## Migration Plan

- **Nothing to migrate** — no schema, no flag; the rail shows where the read
  answers cards and stays absent where it answers none
- **Rollback** — revert the read; the page renders without `related`

## Open Questions

- The complementary list's metafield namespace and key on the Storefront API,
  confirmed against the API reference before group 1 is built; it changes no
  requirement
