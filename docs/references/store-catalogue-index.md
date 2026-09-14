# Store Catalogue Index

Engineering's design note, 2026-09-14, for how the store answers a product
listing: what runs, where it stops scaling, and the index that replaces it.
The decisions it leads to are recorded on
[Commerce](../prds/products/grade10-site/commerce/commerce.md) and
[Product Listing](../prds/products/grade10-site/store/product-listing.md); no
change carries them yet. Read this as the shape engineering proposes, not as
a requirement.

## What Runs

Every listing read is a tRPC query — `catalog.products`, `catalog.filters`,
`catalog.collections` — that the store backend answers by calling Shopify's
Storefront API on the request. Nothing caches the answer: the response is
`private, no-store`, the public GET routes that once sat behind the edge
cache are gone, and the tags the product webhook still purges are tags no
response publishes.

| Query | Engine | Shopify round trips | Bounded by |
| --- | --- | --- | --- |
| No narrowing, no order | One Storefront page on Shopify's cursor | 1 | The page |
| Worlds or types, a price order | Shopify `search` with the filters the shop configured in Search & Discovery | 2 in sequence — the taxonomy, then the page | Offset N costs N + page rows; 50 pages, then a refusal |
| Free text | The walk — every product, matched on the folded title in the worker | 1 per 100 products, in sequence | 5,000 products, then a refusal |
| Latest order | The walk, ordered in the worker | 1 per 100 products | 5,000 products |
| A facet the shop never configured | The walk — Shopify answers the whole catalogue as if filtered, so a filter is trusted only when Shopify advertises it back | 1 per 100 products | 5,000 products |
| The sidebar counts | Shopify's advertised counts, or the walk under free text | 2 in sequence — the taxonomy again, then one search | As the page |
| A collection's count | A walk of the collection's ids, 250 a page | 1 per 250 | 20 pages, then a refusal |

- **One narrowed view is five calls** — the products and the filters
  procedures each read the taxonomy, so a batched view waits on two
  sequential round trips, with the collections read beside them; every
  round trip is the worker to Shopify and back
- **A product is a heavy row** — every list or search page carries each
  product's metafields with their references, ten images and a hundred
  variants, so a walk moves the whole catalogue through the worker on every
  request that walks
- **Every distinct query walks again** — nothing sits between two
  collectors typing the same word, or between one collector's second page
  and third: an offset cursor re-reads the filtered set from its start
- **Correctness forces the walk** — Shopify's counts under a text query
  describe a relevance-narrowed subset (4 advertised against 195 returned
  for `pokemon`, measured 2026-09-10), and `search` cannot order by
  recency, so text and latest have no native path
- **One shared address** — the client sends no buyer address with its
  private token, so every listing read reaches Shopify from one place ❓
  whether Shopify throttles that address as one buyer is unmeasured —
  Engineering, before launch traffic

## Where It Stops Scaling

- **Latency is Shopify's, twice** — a narrowed view waits on two sequential
  round trips before its first card, and nothing local answers a repeat
- **The walk is on the default path** — `default-listing-sort-to-latest`
  makes latest the resting order, so every listing open walks the whole
  catalogue once it lands: three heavy pages a view at 286 products (the
  development shop, 2026-09-10), thirty at 3,000
- **Cost is products × views** — each walking view reads the catalogue
  whole, so Shopify calls grow with the catalogue and the traffic
  multiplied, and the ceiling is a refusal at 5,000 products rather than a
  slow degrade
- **Two engines have to agree** — the grid, its count and the sidebar can
  come from different engines and state different sets; the code holds
  them together by rule, and every new shape — a collection with facets, a
  text query with counts — has to be proved on both

## The Index

The store keeps its own copy of what the shop publishes, in its own
Postgres — the `store` schema of that brand's Neon project
([Account Data](../prds/platform/account-data.md)) — and answers every
listing read from it in one round trip. Shopify is read when a product
changes and by a sweep, never on a listing view.

| Table | One row per | Holds |
| --- | --- | --- |
| `catalog_products` | Product the shop publishes to the store's channel | The product as the contract shapes it (`payload`), and the columns a query narrows, orders or counts on: `product_id`, `handle`, `title_folded`, `created_at` (Shopify's), `price_min_minor`, `available`, `worlds[]`, `types[]`, `languages[]`, `collections[]`, `synced_at` |
| `catalog_collections` | Collection the shop publishes | `handle`, title, description, image, `synced_at` |
| `catalog_facets` | Choice of a facet — one metaobject | `facet`, `handle`, `metaobject_gid`, label, position, `synced_at` |

- **Derived, never authored** — every row is what a Storefront read
  answered; nothing is edited by hand, and a walk may rewrite any of it, so
  the tables can be dropped and rebuilt without loss
- **Facet values are handles** — the metaobject handles the address already
  carries, so a narrowing needs no taxonomy read to translate; the GID stays
  on `catalog_facets` for the sweep
- **Indexes** — a GIN on each array column for `&&` and `@>`;
  `(created_at DESC, product_id)` and `(price_min_minor, product_id)` under
  the two orders and their keysets; a `pg_trgm` GIN on `title_folded` for
  the word match, every word as `ILIKE '%word%'` — Neon ships `pg_trgm` and
  `unaccent`
- **Size** — a product row is tens of kilobytes with its payload, so 5,000
  products is on the order of 100 MB, and a count over indexed arrays at
  that size is milliseconds ❓ measured on staging once the index is filled
  — Engineering
- **One index per brand** — each store worker fills its own, in its own
  database

## The Feed

Webhooks accelerate and the sweep repairs — the rule the orders already
follow ([Commerce](../prds/products/grade10-site/commerce/commerce.md)).

1. *Shopify* — **A product changes** — `products/create`,
   `products/update` or `products/delete` reaches `/api/webhooks/shopify`,
   verified as every delivery is; the body names the product, and the row
   is built from a fresh read rather than from the body
2. *Store* — **Reads the product back** — one Storefront product read by
   its GID; Storefront answers only what the channel publishes, so
   *not found* means unpublished or deleted
3. *Store* — **Upserts or deletes the row** — keyed on the product id; the
   read is the current state whatever order deliveries arrive in, so a late
   delivery rewrites the row with the same state; the webhook answers 200
   once the row is written and 500 when it is not, so Shopify's retry is
   the repair
4. *Store* — **The sweep walks** — `catalogSync` in `CRON_PASSES`, every 5
   minutes, reads the Storefront `products` connection 100 at a time from
   the cursor kept in `sweep_cursors`, a bounded number of pages a tick,
   upserting each and stamping `synced_at`; a completed walk deletes the
   rows it did not see, rewrites `catalog_facets` from the metaobjects and
   `catalog_collections` from the `collections` connection, and records its
   end
5. *Store* — **Stock moves** — `inventory_levels/update` names an inventory
   item and no product, so the next pass catches it ❓ whether a stock
   change alone raises `products/update`, which would make it immediate —
   Engineering, on the development shop; the cart's review stays the
   authority on what can be bought
   ([Product Status](../prds/products/grade10-site/commerce/product-status.md))

- **First fill** — the feed ships before the reads; until one walk has
  completed the listing is refused (`catalog_unavailable`), never answered
  from an empty index — a wrong answer nobody can see is worse than an
  outage everybody can
- **Freshness** — a product edit reaches the listing on the webhook's own
  round trip; anything a webhook missed, within one full walk: three pages
  a tick walks 5,000 products in about 85 minutes ❓ the pages a tick, from
  the walk timed on staging — Engineering
- **No network call inside a transaction** — the Storefront read completes
  before the row's transaction opens, on both paths

## The Reads

- **The page** — one query: an array predicate per selected facet (OR
  inside a facet, AND across them), `title_folded ILIKE` every word, the
  order with its keyset, `LIMIT` the page; the count is `count(*)` over the
  same predicate, in the same round trip
- **The sidebar** — per facet, one grouped count over the query with that
  facet's own selection removed, merged onto `catalog_facets` with zero
  where absent — the own-selection-excluded rule the listing already states,
  computed the same way for every query shape, text included
- **The collection listing** — a collection is `collections @> {handle}` on
  the same table, so its count, its order and its page are one query like
  any narrowing; its title and image come from `catalog_collections`
- **The product page** — `catalog.product` keeps reading Shopify live by
  handle: one call, the freshest price and stock ❓ or the index, one fewer
  dependency on a view — Engineering
- **Cursor** — a keyset on the order's column and the product id, opaque on
  the wire as today's offset is, so the store contract and the address do
  not change; a page names the row it stopped on and cannot skip or repeat
  one when the shop edits between pages
- **Canonical spelling stays** — `services/catalog/query.ts` still decides
  the one spelling a query is answered on; the walk, the offset cursor, the
  Search & Discovery fallback and the taxonomy translation go with the
  Shopify reads

## Cutover

1. **Feed first** — the migration, the repositories, the sweep pass and the
   webhook branch; the purge branch, which purges nothing, retires with it;
   staging runs a full walk and its row count is checked against Shopify's
   own `search` total
2. **Reads second** — `catalog.products`, `catalog.filters`,
   `catalog.collections` and `catalog.collection` on the index; the products
   and filters procedures stop reading the taxonomy from Shopify
3. **Then the ceilings go** — `WALK_MAX_PAGES`, the offset bound and the
   `unconfigured` outcome have nothing left to bound

## What to Watch

- `store.catalog.index.age_seconds` — time since the last completed walk,
  emitted every pass. **Alert past two walks' worth**: a stale index is the
  one failure a collector cannot see
- `store.catalog.index.rows` — products the index holds, beside Shopify's
  `search` total read on the same pass; a gap that outlives a walk is a
  product the channel and the index disagree on
- `store.catalog.index.walk_failed` — a pass that could not read Shopify.
  Dashboard; the index keeps answering from its last walk
- `store.catalog.unavailable` — exists today; **alert on any** once the
  index serves, because the only cause left is an index that never filled
- `store.shopify_webhook.received` by `topic:products/*` — flat while the
  shop edits is the deleted-subscription signal; the sweep covers it,
  slower

## What Does Not Change

- **Checkout prices live** — the cart's review and every charge read
  Shopify; no price and no stock anyone pays on comes from the index
- **Shopify owns the catalogue** — the shop edits in Shopify; the index is
  a copy the shop overwrites at will
- **The contracts** — `productsPageSchema`, `catalogFiltersSchema`, the
  collection schemas and the address grammar stay as they are; the
  frontend does not change
- **The edge cache rule** — tRPC stays on its own lane; with the index
  answering in one local round trip, the listing no longer needs the edge
  cache it lost

## Open Items

| Item | Question | Owner |
| --- | --- | --- |
| Free text | The title only, as the walk matches today, or title, description, tags and vendor as Shopify's own search read | Product |
| Collection with facets | The one-narrowing-at-a-time rule rests on the walk; on the index a collection is one more predicate — offer both together, or keep the rule | Product |
| Product page | A live Shopify read, or the index | Engineering |
| Stock on a card | Whether a stock change alone raises `products/update` | Engineering |
| Shopify throttling | Whether the feed's reads from one address are throttled as one buyer | Engineering |
| Walk pace | Pages a tick, from the walk timed on staging | Engineering |
