# Store Catalogue Index

Engineering's design note, 2026-09-14, for how the store answers a product
listing: the Shopify reads it ran on, their limits, the cheaper steps weighed
before an index, the catalogue projection that shipped and what it measured,
and the index that follows when a catalogue outgrows one worker. The
decisions it leads to are recorded on
[Commerce](../prds/products/grade10-site/commerce/commerce.md) and
[Product Listing](../prds/products/grade10-site/store/product-listing.md);
no change carries them yet. Read this as engineering's record, not as a
requirement.

## Shopify Reads

Until 2026-09-14 every listing read — `catalog.products`, `catalog.filters`,
`catalog.collections` — called Shopify's Storefront API on the request, and
nothing cached the answer. Why the edge-cached routes went is not on record
❓ — Engineering.

| Query | Engine | Shopify round trips | Bounded by |
| --- | --- | --- | --- |
| No narrowing, no order | One Storefront page on Shopify's cursor | 1 | The page |
| Worlds or types, a price order | Shopify `search` with the filters the shop configured in Search & Discovery | 2 in sequence — the taxonomy, then the page | Offset N costs N + page rows; 50 pages, then a refusal |
| Free text | The walk — every product, matched on the folded title in the worker | 1 per 100 products, in sequence | 5,000 products, then a refusal |
| Latest order | The walk, ordered in the worker — though the `products` connection sorts by `CREATED_AT` natively and the client never asks it to | 1 per 100 products | 5,000 products |
| A facet the shop never configured | The walk — Shopify answers the whole catalogue as if filtered, so a filter is trusted only when Shopify advertises it back | 1 per 100 products | 5,000 products |
| The sidebar counts | Shopify's advertised counts, or the walk under free text | 2 in sequence — the taxonomy again, then one search | As the page |
| A collection's count | A walk of the collection's ids, 250 a page | 1 per 250 | 20 pages, then a refusal |

- **The product node is heavy** — every list or search page carries each
  product's metafields with their references, ten images and a hundred
  variants, when a narrowing needs an id, a title, a date, a price and three
  lists of handles; and the walk read 100 a page where Storefront serves 250
- **Every distinct query walks again** — nothing sits between two
  collectors typing the same word, or between one collector's second page
  and third: an offset cursor re-reads the filtered set from its start
- **Shopify answers some shapes wrong** — its counts under a text query
  describe a relevance-narrowed subset (4 advertised against 195 returned
  for `pokemon`, measured 2026-09-10); `search` cannot order by recency; and
  a filter on a facet the shop has not configured in Search & Discovery is a
  silent no-op that answers the whole catalogue, so a filtered answer can
  only be trusted when Shopify advertises the facet back
- **One shared address** — the client sends no buyer address with its
  private token, though Shopify documents `Shopify-Storefront-Buyer-IP` for
  exactly this, so every listing read reaches Shopify as one buyer

## Limits

- **The default order walks** — `default-listing-sort-to-latest` makes
  latest the resting order; as the client stood, every listing open then
  walked the whole catalogue, three heavy pages a view at 286 products
- **Cost is products × views** — each walking view reads the catalogue
  whole, so Shopify calls grow with the catalogue and the traffic
  multiplied, and the ceiling is a refusal at 5,000 products rather than a
  slow degrade
- **Two engines have to agree** — the grid, its count and the sidebar can
  come from different engines and state different sets; holding them
  together by rule has to be proved for every new shape

## Cheaper Steps

Each was a day's change, measured on staging before the next was taken.
The projection absorbed the slim walk, the single taxonomy read and the
recency order; what is left is not taken.

- **Native latest** — `products(sortKey: CREATED_AT, reverse: true)` as a
  second engine for the resting order while a colo holds no projection.
  Shipped and removed the same day: under request batching the sidebar
  waits for the projection anyway, and two engines paging one set gave the
  offset cursor two spellings
- **The cache tier** — `middlewares.cache(ttl)` from `@grade10/worker`,
  the tier [Account Data](../prds/platform/account-data.md) names for hot
  session-free reads; a collection, one collection and a product's page
  ride it at 60 s, the listing reads do not, because the projection
  answers them in memory
- **Buyer-IP** — the collector's address forwarded as
  `Shopify-Storefront-Buyer-IP`, so Shopify throttles a collector rather
  than the worker; the client sends no buyer address today
- ❓ **An all-products collection** — `collection.products(filters:,
  sortKey: CREATED)` answers facets, latest and counts natively, given a
  collection the shop keeps that holds every product; per-shop admin
  state, trusted the way the Search & Discovery filters are — Product and
  the shopkeeper

What no step answers: a collection combined with facets, and ranked
suggestions.

## Catalogue Projection

Pull request 387 on the application repository, deployed to staging on
2026-09-14; the mechanism is
[commerce architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/commerce.md).
The **catalogue projection** is the catalogue cut to its entries — id,
date, cheapest price, facet handles, the folded title — walked at 250 a
page and held in the worker: the isolate's memory first, then the colo's
cache. Every listing shape narrows, orders and counts over it in one memory
pass, so the grid, its count and the sidebar always come from one set, and
it is the only engine: a colo holding none builds one on the request that
needs it.

- **Rebuilt by age** — a projection older than 5 minutes is served as it
  is and rebuilt behind the response; the colo keeps a copy a day, so a
  colo nobody has asked in that long serves a day-old copy once rather
  than making that request wait on the walk
- **Budget** — 40 pages of 250, refused from the first page's count; a
  build that fails is answered from memory for a minute, never walked
  again per request
- **Hydration** — a page reads the products it lists by id in one `nodes`
  call and keeps them 5 minutes, in memory and in the colo's cache
- **Cursors** — unchanged on the wire, one spelling; the offset ceiling is
  the budget's 10,000 products, in place of the walk's 5,000
- **Nothing durable** — no database on the public path, no migration, no
  new binding; every copy is derived and the next request rebuilds it
- **A cold colo waits** — the first request at a colo holding no copy
  waits on the build: about 0.3 s a page of 250 plus the taxonomy, so 1 s
  at 286 products, 4 s at 3,000 and 12 s at 10,000. With a copy kept a day
  that is a handful of requests a day across the colos that carry traffic;
  the step that removes it is below

| Query, staging | Before | Cold colo | Warm |
| --- | --- | --- | --- |
| Narrowed by two types — products, filters and collections in one batch | 1.6–3.5 s | 2.4–2.5 s | 0.26–0.32 s |
| Latest order, nothing narrowed | 0.55–1.7 s | 1.1 s | 0.23–0.35 s |
| Free text `pokemon` — products and filters | 1.0–3.1 s | 1.0 s | 0.27–0.30 s |

Time to first byte from one Linux host, 2026-09-14 06:20 UTC, against the
staging shop's catalogue that day — 286 products, two pages. Warm figures
are the network round trip; the worker's own share is under it ❓ the p95
from real traffic, once the release carries it — Engineering.

## Built Once, Read Everywhere

The projection is built per colo: every colo with traffic walks the
catalogue on its own schedule, and a cold colo's first request waits on
the walk. The step after it, before any index, is one build read
everywhere: a cron pass in the store worker walks the catalogue every
5 minutes and writes the projection to a KV namespace, and every colo
reads it from there — one walk per interval instead of one per colo, no
cold build on a request, the same memory pass over the same shape. The
cost is a binding per brand per environment and a read that lags the
write by up to a minute, which the projection already tolerates.

Taken when either fires: `store.catalog.projection.build_ms` p95 over
5 seconds, or `store.catalog.projection.entries` over 3,500 — the point at
which a cold colo's wait is what a collector notices.

## Queryable Index

The projection above holds a catalogue in one worker; past tens of
thousands of products, or for a shape a memory pass cannot rank, the same
projection lands in the store's own Postgres — the `store` schema of that
brand's Neon project — and answers every listing read from it in one round
trip. Shopify is read when a product changes and by a sweep, never on a
listing view. Nothing below is built; it is the step after a measured
ceiling.

| Table | One row per | Holds |
| --- | --- | --- |
| `catalog_products` | Product the shop publishes to the store's channel | The columns a query narrows, orders or counts on, and what a card draws: `product_id`, `handle`, `title`, `title_folded`, `created_at` (Shopify's), `shop_updated_at`, `price_min_minor`, `available`, the first image, `worlds[]`, `types[]`, `languages[]`, `dirty_at`, `synced_at` |
| `catalog_collections` | Collection the shop publishes | `handle`, title, description, image, `dirty_at`, `synced_at` |
| `catalog_collection_products` | Product inside a collection | `collection_handle`, `product_id`, `position` — the merchant's own order, which an array of handles on the product cannot hold |
| `catalog_facets` | Choice of a facet — one metaobject | `facet`, `handle`, `metaobject_gid`, label, position, `synced_at` |
| `catalog_sync` | The store | The walk's Storefront cursor as text, when it started, when it last completed, attempts — the state row a cron re-reads, since `sweep_cursors` holds a timestamp for the order sweep and nothing else |

- **Derived, never authored** — every row is what a Storefront read
  answered; nothing is edited by hand, and a walk may rewrite any of it, so
  the tables can be dropped and rebuilt without loss
- **Slim rows** — a few hundred bytes each, so 5,000 products is a few
  megabytes; the page answers from the row ❓ whether the products contract
  can carry a card's shape rather than the whole product, or a page
  hydrates its 24 ids from Shopify in one call — Engineering
- **Sort keys never null** — a product nobody can price carries a sentinel
  above every price, so a price keyset never drops it; the resting order is
  the product id, Shopify's own `products` order
- **Indexes** — one B-tree per order, with the id as the tiebreak; a GIN on
  an array column only once a measured query needs one; no `pg_trgm` and
  no `unaccent` — the worker's fold already strips accents into
  `title_folded`, and a scan of 5,000 folded titles is sub-millisecond, so
  the test lane loads no extension
- **Search is decided before the schema** — title only as `ILIKE` on the
  folded column, or `tsvector` with a rank for suggestions and a wider
  match; the column and its index follow the decision ❓ Product, on the
  open item below
- **One index per brand** — each store worker fills its own, in its own
  database

## Feed

Webhooks accelerate and the sweep repairs — the rule the orders already
follow ([Commerce](../prds/products/grade10-site/commerce/commerce.md)).

1. *Shopify* — **A product or a collection changes** — `products/create`,
   `products/update`, `products/delete` and `collections/update` reach
   `/api/webhooks/shopify`, verified as every delivery is. `products/update`
   fires on every order and every variant change too, so its volume is the
   order volume; a smart collection's rule and a manual collection's order
   fire only `collections/update` ❓ whether publishing to the channel
   raises `products/update` — Engineering, on the development shop
2. *Store* — **Marks the row dirty** — the webhook writes `dirty_at` on the
   row it names, answers 200, and defers the drain on a connection of its
   own, as the order-event drain is deferred; no Storefront read on the
   webhook's round trip, so a thousand deliveries in a minute are a thousand
   cheap writes coalesced onto the rows they name
3. *Store* — **The drain reads back** — one Storefront read per dirty
   product (`product(id:)`), written only when its `updatedAt` is not older
   than the row's and its hash differs, so two isolates cannot land an older
   read over a newer one and an unchanged product costs no write; *not
   found* deletes the row, since Storefront answers only what the channel
   publishes; a dirty collection re-reads its `products` connection with
   positions
4. *Store* — **The walk** — `catalogSync` in `CRON_PASSES`: a whole walk in
   one invocation, 250 slim rows a page, its cursor on `catalog_sync`; a
   completed walk deletes what it did not see and rewrites the facets and
   the collections. The walk is the net for what no webhook names — a
   publication change, a rule a smart collection re-evaluates
5. *Store* — **Stock** — `products/update` carries it; the card's ceiling
   stays advisory and the cart's review the authority
   ([Product Status](../prds/products/grade10-site/commerce/product-status.md))

- **First fill on demand** — the walk runs whole at deploy, from an admin
  procedure or the first cron tick; a development machine on fixtures
  fills from the fixture catalogue the same way
- **Never refused for a copy** — while the index is empty, or its last
  completed walk is older than two walks, the listing answers from the
  projection and counts it, so a fresh environment, a rehearsal branch and
  a crawler all see a listing
- **Freshness** — a product edit reaches the listing on the drain's round
  trip, seconds after its webhook; anything a webhook missed, within one
  walk
- **No network call inside a transaction** — the Storefront read completes
  before the row's transaction opens, on every path

## Reads

- **The page** — one query: an array predicate per selected facet (OR
  inside a facet, AND across them), the text match, the order with its
  keyset, `LIMIT` the page; the count is `count(*)` over the same
  predicate, in the same round trip
- **The sidebar** — per facet, one grouped count over the query with that
  facet's own selection removed, merged onto `catalog_facets` with zero
  where absent — the own-selection-excluded rule the listing already states,
  computed the same way for every query shape, text included
- **The collection listing** — the products of `catalog_collection_products`
  in their `position`, the merchant's own order; a collection combined with
  facets is one more predicate on the same rows, if Product asks for it
- **The product page** — `catalog.product` reads Shopify by handle behind
  the 60 s cache tier, so a card and its page can disagree for the seconds a
  drain takes; the cap is advisory already ❓ or the index, one fewer
  dependency on a view — Engineering
- **Cursor** — a keyset on the order's column and the product id, opaque on
  the wire as today's offset is, so the store contract and the address do
  not change; the shared helper is keyed on a date, so a price order adds
  an integer-keyed variant; on the public catalogue a cursor the route did
  not mint answers the first page, as today — a collector mid-scroll across
  the cutover holds an offset cursor, and a refusal would have the listing
  re-ask the same page forever
- **The database on the public path** — today the catalogue opens no
  connection; on the index every view opens one, on the pool the checkout
  and the webhooks share, to a single-region Neon whose first query after
  idle costs seconds. So: a second Hyperdrive binding for the index with
  query caching on, which
  [Account Data](../prds/platform/account-data.md) permits for a read-only,
  staleness-tolerant read, so a repeated listing query never reaches Neon;
  and the answer time measured before and after against the Storefront's
  own, which is not single-region ❓ the number decides whether the
  index is faster — Engineering
- **Sitemap and crawlers** — walk the same procedure, so they read the
  index or its fallback, never a refusal
- **The query's bounds stay** — `services/catalog/query.ts` still dedupes,
  caps and folds what a query asks and reads one offset spelling; the
  projection's walk and its offset cursor go with it

## Cutover

1. **The projection, measured** — shipped; the number after it, and the
   copy built once and read everywhere, decide whether the rest is ever
   built
2. **The feed** — the migration, the repositories, the dirty rows, the
   drain and the walk; staging runs a walk whole and its row count is
   checked against Shopify's own `search` total
3. **The reads, with the fallback** — the four procedures on the index,
   the Shopify path behind them while the index is empty or stale; the
   purge branch, which purges nothing, retires here
4. **Then the ceilings go** — the offset bound and the projection's budget
   retire once a release has served without a fallback count

## Metrics

- `store.catalog.projection.build_ms` p95 and
  `store.catalog.projection.entries` — the projection's own watch; either
  past the trigger above is the signal for the copy built once
- The listing answer time, p95 at the edge — ❓ nothing emits it; add the
  metric with the first release, and measure against the staging figures
  above — Engineering
- `store.catalog.index.age_seconds` — time since the last completed walk,
  emitted every pass. **Alert past two walks' worth**: a stale index is the
  one failure a collector cannot see
- `store.catalog.index.fallback` — a view answered from Shopify because the
  index was empty or stale. **Alert on any** once the index has filled
- `store.catalog.index.rows` — products the index holds, beside Shopify's
  `search` total read on the same pass; a gap that outlives a walk is a
  product the channel and the index disagree on
- `store.catalog.index.dirty` — rows waiting on the drain, emitted every
  pass; rising with `store.shopify_webhook.received` by `topic:products/*`
  is a burst the drain is absorbing, rising alone is a drain that stopped
- `store.catalog.index.walk_failed` — a pass that could not read Shopify.
  Dashboard; the index keeps answering from its last walk
- `store.shopify_webhook.received` by `topic:products/*` — flat while the
  shop edits is the deleted-subscription signal; the walk covers it, slower

## Unchanged

- **Checkout prices live** — the cart's review, the coupons' variant reads
  and every charge read Shopify (`getVariants`, `getProductByHandle`); no
  price and no stock anyone pays on comes from the index
- **Shopify owns the catalogue** — the shop edits in Shopify; the index is
  a copy the shop overwrites at will
- **The contracts** — `productsPageSchema`, `catalogFiltersSchema`, the
  collection schemas and the address grammar stay as they are; the
  frontend does not change
- **The edge cache rule** — tRPC stays on its own lane; the cache tier is
  the lane's own

## Open Items

| Item | Question | Owner |
| --- | --- | --- |
| Why the GET routes went | The edge-cached catalogue routes were removed and the reason is not on record; if it was one tRPC contract, the cache tier keeps it | Engineering |
| Free text | The title only, as the walk matches today, or title, description, tags and vendor as Shopify's own search read; ranked, for suggestions, or not | Product |
| Collection with facets | Nothing in the catalogue's own reads prevents it; offer both together, or keep the rule | Product |
| An all-products collection | Whether the shop keeps one, so facets, latest and counts answer natively without an index | Product, shopkeeper |
| The row's shape | Whether the products contract can carry a card's shape, or a page hydrates from Shopify | Engineering |
| Product page | A live Shopify read, or the index | Engineering |
| Publication | Whether publishing to the channel raises `products/update` | Engineering |
| The number | The listing answer time from real traffic once the projection is released, p95, against the staging figures above | Engineering |
