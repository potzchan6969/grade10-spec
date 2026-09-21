## Context

- **The card's page reads the shop live** — `catalog.product` answers behind
  the 60 s cache tier; the listing reads the store's mirror of the catalogue
  ([the catalogue index](../../../docs/references/store-catalogue-index.md))
- **The mirror holds every product whole** — the shop's own JSON per product,
  its facets read from metafield references and tags (`world:`, `type:`,
  `language:`), its variants with availability; every location follows one
  keeper per shop
- **The picks live in Shopify** — [Q1](decisions.md#decisions): chosen on the
  card by the stock keeper; which Shopify field holds them is this file's
- **Two deltas on one page** — `redesign-store-product-detail-page` modifies
  the card's own requirements; this change adds one requirement for the rail's
  place, so the two fold without touching the same block

## Goals / Non-Goals

**Goals**

- **One read, one rail** — the card's page answers with its rail in the same
  response as the card, from one read
- **The stock keeper's order kept** — the picks arrive in the order the shop
  holds them, never re-ranked
- **A similar set anyone can recompute** — the same catalogue gives the same
  six cards, at every location and on every read

**Non-Goals**

- **A second store of picks** — nothing is written outside Shopify
- **Ranking by the shop** — Shopify's own recommendation ranking is not read
  for the similar cards ([non-goals](decisions.md#non-goals))
- **A precomputed rail** — no nightly job, no table of related cards

## Decisions

### The picks are the card's complementary-products list, read as a metafield

The spec governs what the rail holds and in what order. The picks are read
from the product's own **complementary products** list — the standard
metafield Shopify's Search & Discovery app writes when a stock keeper picks
products on the card — as a list of product references, in the order stored.

- **Read as a metafield, not through recommendations** — Storefront's
  `productRecommendations` mixes the shop's ranking in when the list is short,
  and its order is the shop's; the metafield answers the stock keeper's list
  and nothing else
- ❓ **The field's namespace and key** — Engineering confirms against the
  Storefront API reference before the read is written; the reference the
  design leans on is Shopify's *Search & Discovery* product recommendations
  metafield, and a shop that has never installed the app holds no such field
  and answers no picks
- **Rejected: a custom metafield of handles** — a second definition the
  stock keeper fills beside the one the app already draws a picker for
- **Rejected: Search & Discovery's related-products list** — that is the
  app's *similar* list, which the store computes itself; reading it would
  hand the similar rule to the shop

### The similar cards are computed from the mirror on the card's read

The spec governs the rule (world, then language, then type; newest first; not
the card itself; not sold out). The store computes it in the worker, on the
card's read, over the mirror's current entries.

- **Where** — `services/catalog/related.ts` beside `browse.ts`: a pure
  function over the projection's entries and the card, returning the similar
  cards in order; the page's read composes picks then similar and cuts to six
- **The score** — world shared 4, language shared 2, type shared 1; summed,
  then the shop's newest first, then the product id, so two reads never
  disagree on a tie
- **What is left out** — the card itself, every card already among the picks,
  a card with no variant for sale, and a card sharing none of the three
- **Rejected: a precompute per publish** — stale inside the window the
  mirror already closes, and a table the mirror would have to invalidate
- **Rejected: the shop's `search` by tag** — one Shopify round trip per card
  view, and a filter the shop never advertises answers the whole catalogue

### The rail rides the card's read and its cache

`catalog.product` gains `related`: the cards in final order, each cut to what
a tile draws — handle, name, first image, price, compare-at, sold out — and a
`source` per card (`pick` or `similar`) for the record, never for the tile.

- **Same response, same cache** — the rail is computed inside the product
  read and cached with it under the 60 s tier, so a pick or a tag edit reaches
  the page within the page's own minute and the page never moves on arrival
- **Picks resolved through the mirror** — a pick's reference is resolved
  against the mirror's entries, so a pick the channel no longer publishes is
  left out without a second read of the shop; a pick the mirror has not yet
  heard of waits for the mirror
- **Rejected: a second procedure the page calls after load** — a rail that
  arrives after the card moves the page and is not in the response

### Failure leaves the page whole

- **Mirror unreachable** — the similar set is empty and the picks unresolved;
  the read answers the card with no rail and counts it
- **The metafield read fails** — no picks; similar cards still answer
- **Nothing shared** — an empty rail is the ordinary answer, not a failure

## Service Interfaces

| Function | Input | Output |
| --- | --- | --- |
| `relatedCards(card, entries, limit)` | the card's entry, the projection's entries, `6` | ordered cards: picks first as resolved, then similar by score; never the card, never sold out among similar; at most `limit` |
| `catalog.product` (tRPC) | `{ handle }` | the product as today, plus `related: Card[]` |

No table, no write, no transaction: every value is derived on the read.

## Risks / Trade-offs

- [A shop without the Search & Discovery field] → the read answers no picks
  and the similar rule fills the rail; the run sheet checks the field exists
  on the staging shop
- [A pick chosen but not yet in the mirror] → left out until the mirror reads
  it back, within the mirror's own window; counted as `pick_unresolved`
- [Similar cards change under a collector between two reads] → the rail is
  cached with the card for 60 s, so a page holds still for a minute; a
  different rail after that is the catalogue moving, as the listing does
- [The projection cut to cards past 1 MB] → the facets a card draws stay in
  the cut, so the rule keeps its inputs

## Migration Plan

- **Nothing to migrate** — no schema, no flag; the rail shows where the read
  answers cards and stays absent where it answers none
- **Rollback** — revert the read; the page renders without `related`

## Open Questions

- Which metafield namespace and key the Storefront API answers the
  complementary list under — resolved before group 1 is built, and it changes
  no requirement
