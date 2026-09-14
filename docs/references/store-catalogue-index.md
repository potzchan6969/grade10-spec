# Store Catalogue Index

Engineering's design note, 2026-09-14, for how the store answers a product
listing: what ran, where it stopped scaling, the cheaper rungs that came
first, what shipped to staging that day and what it measured, and the index
that follows when a catalogue outgrows one worker. The decisions it leads to
are recorded on [Commerce](../prds/products/grade10-site/commerce/commerce.md)
and [Product Listing](../prds/products/grade10-site/store/product-listing.md);
no change carries them yet. Read this as engineering's record, not as a
requirement.

## What Ran

Until 2026-09-14 every listing read was a tRPC query — `catalog.products`,
`catalog.filters`, `catalog.collections` — that the store backend answered
by calling Shopify's Storefront API on the request. Nothing cached the answer: the response was
`private, no-store`, the public GET routes that once sat behind the edge
cache are gone, and the tags the product webhook still purges are tags no
response publishes. Why the routes went is not on record ❓ — Engineering.

| Query | Engine | Shopify round trips | Bounded by |
| --- | --- | --- | --- |
| No narrowing, no order | One Storefront page on Shopify's cursor | 1 | The page |
| Worlds or types, a price order | Shopify `search` with the filters the shop configured in Search & Discovery | 2 in sequence — the taxonomy, then the page | Offset N costs N + page rows; 50 pages, then a refusal |
| Free text | The walk — every product, matched on the folded title in the worker | 1 per 100 products, in sequence | 5,000 products, then a refusal |
| Latest order | The walk, ordered in the worker — though the `products` connection sorts by `CREATED_AT` natively and the client never asks it to | 1 per 100 products | 5,000 products |
| A facet the shop never configured | The walk — Shopify answers the whole catalogue as if filtered, so a filter is trusted only when Shopify advertises it back | 1 per 100 products | 5,000 products |
| The sidebar counts | Shopify's advertised counts, or the walk under free text | 2 in sequence — the taxonomy again, then one search | As the page |
| A collection's count | A walk of the collection's ids, 250 a page | 1 per 250 | 20 pages, then a refusal |

- **One narrowed view is five calls** — the products and the filters
  procedures each read the taxonomy, so a batched view waits on two
  sequential round trips, with the collections read beside them; every
  round trip is the worker to Shopify and back
- **A product is a heavy row by choice** — every list or search page
  carries each product's metafields with their references, ten images and
  a hundred variants, when the walk needs an id, a handle, a title, a date,
  a price, availability and three lists of handles; and the walk reads 100
  a page where Storefront serves 250
- **Every distinct query walks again** — nothing sits between two
  collectors typing the same word, or between one collector's second page
  and third: an offset cursor re-reads the filtered set from its start
- **Correctness forces the walk under text** — Shopify's counts under a
  text query describe a relevance-narrowed subset (4 advertised against
  195 returned for `pokemon`, measured 2026-09-10), and `search` cannot
  order by recency
- **One shared address** — the client sends no buyer address with its
  private token, though Shopify documents `Shopify-Storefront-Buyer-IP` for
  exactly this, so every listing read reaches Shopify as one buyer
- **Unmeasured** — the listing answer time the PRD records has no number
  yet; every rung below is measured against it before the next is taken

## Where It Stops Scaling

- **Latency is Shopify's, twice** — a narrowed view waits on two sequential
  round trips before its first card, and nothing local answers a repeat
- **The walk is one argument from the default path** —
  `default-listing-sort-to-latest` makes latest the resting order; as the
  client stands, every listing open then walks the whole catalogue, three
  heavy pages a view at 286 products (the development shop, 2026-09-10)
- **Cost is products × views** — each walking view reads the catalogue
  whole, so Shopify calls grow with the catalogue and the traffic
  multiplied, and the ceiling is a refusal at 5,000 products rather than a
  slow degrade
- **Two engines have to agree** — the grid, its count and the sidebar can
  come from different engines and state different sets; the code holds
  them together by rule, and every new shape — a collection with facets, a
  text query with counts — has to be proved on both

## Rungs Before an Index

Each is a day's change, measured on staging against the PRD's listing
answer time before the next is taken. The index is built when a measured
ceiling survives them, or when Product asks for a shape no rung answers.
Rungs 1 and 4 shipped together on 2026-09-14 as the projection below; rung
2 shipped for the reads the projection does not answer; rung 3 has nothing
left to do, since the projection carries the taxonomy.

1. **Native latest** — `sortKey: CREATED_AT, reverse: true` on the
   `products` connection, so the resting order never walks: one Shopify
   page, as the unordered listing is today
2. **The cache tier** — `middlewares.cache(ttl)` from `@grade10/worker` on
   `catalog.filters`, `catalog.collections` and the unnarrowed
   `catalog.products`, 60 s; the tier
   [Account Data](../prds/platform/account-data.md) names for hot
   session-free reads; and the collector's address forwarded as
   `Shopify-Storefront-Buyer-IP`, so Shopify throttles a collector rather
   than the worker
3. **One taxonomy read a view** — the filters procedure's read serves the
   products procedure's translation, through the same tier
4. **A slim walk** — id, handle, title, created, the cheapest price,
   availability and the facet handles, 250 a page, kept per shop in the
   worker's cache and refreshed in the background past its age; a page
   then hydrates its 24 ids in one `nodes` call. Text and a narrowed latest
   answer from it in memory. It is still a walk, and its ceiling is where
   the set no longer refreshes inside one invocation
5. ❓ **An all-products collection** — `collection.products(filters:,
   sortKey: CREATED)` answers facets, latest and counts natively, given a
   collection the shop keeps that holds every product; per-shop admin
   state, trusted the way the Search & Discovery filters are — Product and
   the shopkeeper

What no rung answers: a collection combined with facets and ranked
suggestions. A count under free text and free text without a walk are the
projection's, since it holds the whole set in memory.

## What Shipped

Pull request 387 on the application repository, deployed to staging on
2026-09-14. The **catalogue projection** (`services/catalog/projection.ts`)
is the catalogue cut to its entries — id, handle, title, date, cheapest
price, availability, facet handles — walked at 250 a page and held in the
worker: the isolate's memory first, then the colo's cache. Every listing
shape narrows, orders and counts over it in one memory pass, so the grid,
its count and the sidebar always come from one set. The index below stays
the step after it.

- **Age, not a feed** — a projection older than 5 minutes is served as it
  is and rebuilt behind the response; nothing feeds it row by row, so no
  webhook, no sweep and no table
- **Cold isolate** — a facet, a price order or an unnarrowed latest answers
  from Shopify while the build runs, the latest order natively off
  `products(sortKey: CREATED_AT)`; free text and a narrowed latest wait for
  the build, a slim walk cheaper than the whole-product walk it replaced
- **Hydration** — a page reads the products it lists by id in one `nodes`
  call and keeps them 5 minutes, in memory and in the colo's cache
- **Cache tier** — a collection, one collection and a product's page ride
  the worker's cached procedure tier for 60 s
- **Cursors** — unchanged on the wire; the offset ceiling is the
  projection's, 50,000 products, in place of the walk's 5,000
- **Nothing durable** — no database on the public path, no migration, no
  new binding; every copy is derived and the next request rebuilds it

| Query, staging | Before | Cold isolate | Warm |
| --- | --- | --- | --- |
| Narrowed by two types — products, filters and collections in one batch | 1.6–3.5 s | 2.4 s | 0.22–0.41 s |
| Latest order, nothing narrowed | 0.55–1.7 s | 1.5–1.6 s | 0.21–0.26 s |
| Free text `pokemon` — products and filters | 1.0–3.1 s | 1.0 s | 0.18–0.21 s |

Time to first byte from one Linux host, three runs each, 2026-09-14 04:13
UTC, the shop as staging carried it that day. Warm figures are the network
round trip; the worker's own share is under it ❓ the p95 from real
traffic, once the release carries it — Engineering.

## The Index, When One Worker Is Outgrown

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

Five tables, said out loud: the collection's order is the fourth and the
walk's state the fifth.

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

## The Feed

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
  Shopify path as it does today and counts it; a source of truth that is
  reachable is never refused in favour of a copy that is not, and a fresh
  environment, a rehearsal branch and a crawler all see a listing
- **Freshness** — a product edit reaches the listing on the drain's round
  trip, seconds after its webhook; anything a webhook missed, within one
  walk
- **No network call inside a transaction** — the Storefront read completes
  before the row's transaction opens, on every path

## The Reads

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
- **The product page** — `catalog.product` keeps reading Shopify live by
  handle, so a card and its page can disagree for the seconds a drain takes;
  the cap is advisory already ❓ or the index, one fewer dependency on a
  view — Engineering
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
- **Canonical spelling stays** — `services/catalog/query.ts` still decides
  the one spelling a query is answered on; the walk, the offset cursor, the
  Search & Discovery fallback and the taxonomy translation go with the
  Shopify reads

## Cutover

1. **The rungs, measured** — shipped and measured above; the number after
   the projection is what decides whether the rest is ever built
2. **The feed** — the migration, the repositories, the dirty rows, the
   drain and the walk; staging runs a walk whole and its row count is
   checked against Shopify's own `search` total
3. **The reads, with the fallback** — the four procedures on the index,
   the Shopify path behind them while the index is empty or stale; the
   purge branch, which purges nothing, retires here
4. **Then the ceilings go** — `WALK_MAX_PAGES`, the offset bound and the
   `unconfigured` outcome retire once a release has served without a
   fallback count

## What to Watch

- `store.catalog.answer_ms` — the listing answer time, p95, before the
  first rung and after every one; the PRD's own row
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

## What Does Not Change

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
| Collection with facets | The one-narrowing-at-a-time rule rests on the walk; on the index a collection is one more predicate — offer both together, or keep the rule | Product |
| An all-products collection | Whether the shop keeps one, so facets, latest and counts answer natively without an index | Product, shopkeeper |
| The row's shape | Whether the products contract can carry a card's shape, or a page hydrates from Shopify | Engineering |
| Product page | A live Shopify read, or the index | Engineering |
| Publication | Whether publishing to the channel raises `products/update` | Engineering |
| The number | The listing answer time from real traffic once the projection is released, p95, against the staging figures above | Engineering |
