# Store Catalogue Index

Engineering's design note, 2026-09-14, for how the store answers a product
listing: the Shopify reads it ran on, their limits, the cheaper steps weighed
before an index, the catalogue projection that shipped and what it measured,
and the index that follows when a catalogue outgrows one worker. The
decisions it leads to are recorded on
[Product Listing](../prds/products/grade10-site/store/product-listing.md) and
[Commerce](../prds/products/grade10-site/commerce/commerce.md), and the
change `refresh-listing-within-seconds` carries them. Read this as
engineering's record, not as a requirement.

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

Pull request 387 on the application repository shipped the copy; this change
moves it to one keeper per shop. The **catalogue projection** is the
catalogue cut to its entries — id, date, lowest price, facet handles, the
folded title, and the card: handle, first image, the variants with price,
compare-at, availability and count — plus the facet taxonomy. Every listing
shape narrows, orders and counts over it in one memory pass
(`services/catalog/browse.ts`), so the grid, its count, the sidebar and the
cards always come from one set, and no listing view reads the shop.

| Shape, bytes of JSON per product, staging 2026-09-14 | Per product | ×286 | ×3,000 | ×10,000 | ×25,000 |
| --- | --- | --- | --- | --- | --- |
| Whole product, as a product page reads it | 2,031 B | 567 KB | 5.9 MB | 19.8 MB | 49.6 MB |
| Entry with its card, as the copy holds it | ~600 B | ~170 KB | ~1.8 MB | ~5.8 MB | ~14.6 MB |
| Entry alone, as PR 387 held it | 206 B | 57 KB | 0.6 MB | 2.0 MB | 5.0 MB |

| Query, staging, PR 387 | Before | Cold location | Warm |
| --- | --- | --- | --- |
| Narrowed by two types — products, filters and collections in one batch | 1.6–3.5 s | 2.4–2.5 s | 0.26–0.32 s |
| Latest order, nothing narrowed | 0.55–1.7 s | 1.1 s | 0.23–0.35 s |
| Free text `pokemon` — products and filters | 1.0–3.1 s | 1.0 s | 0.27–0.30 s |

Time to first byte from one Linux host, 2026-09-14 06:20 UTC, 286 products.
The cold column is the walk a location paid for its own copy; the keeper
below removes it. ❓ The same table after the keeper's release — Engineering.

## Catalogue Keeper

One Durable Object per shop, `CatalogKeeper` under
`packages/grade10-store/backend/src/durables/CatalogKeeper/`, bound as
`CATALOG_KEEPER` in both store workers, named `<shop>/v1` and placed with the
`apac` location hint through one accessor. It is the one writer of the copy;
every location follows it. The rules live in a manager over a storage port,
tested in the node lane; the class holds the SQLite store, the RPC surface
and the alarm, tested in the app's worker lane. It is the one Durable Object
a deployed worker binds; `docs/conventions/backend.md` records why.

| Rule | Value |
| --- | --- |
| Read-back | On the report, then every 2 s while the shop answers older or nothing, for 60 s |
| Burst window | 1 s from the first report; one publish per burst |
| A location's check | Every 3 s while the listing is in use; the first request after a longer gap waits on one hop, 500 ms at most when a copy is held |
| The re-read | Every 5 minutes, on the store's cron tick |
| A walk on a stock report | At most one every 30 s |
| Walk ceiling | `CATALOG_MAX_OFFSET` products, refused from the first page's count |
| Cut to cards | When a published body passes 1 MB |
| Location | Created with the `apac` hint on its first `get()`; it never moves |

- **What it holds** — its own SQLite: `products` (one row per product the channel publishes: its position in the shop's order, the shop's `updatedAt` in epoch milliseconds, when the keeper wrote it, the whole product as JSON), `pending` (products reported and not yet read back: created or changed, the report's stamp, when the store first heard a report this new, when to read next, reads in a row the shop answered nothing to), `tombstones` (products reported deleted, and when), `meta` (the tables' version, the taxonomy, the version counter, when it published, when it walked, when a walk is due, the shape). Tables of another version are dropped and refilled by the next walk, the version counter alone carried across. Every row is a Storefront answer; the walk may rewrite any of them. A whole projection as one value is impossible past 2 MB, which is Cloudflare's row limit; per-product rows are also what lets a write touch only what moved
- **Apply** — the webhook route, after verification, awaits `apply` beside the tag purge for every `products/*` and `inventory_levels/*` delivery, under a 2 s deadline. `products/create` and `products/update` upsert a `pending` row with the report's `updated_at` parsed to epoch milliseconds — the shop stamps it in its own offset, Storefront answers UTC, and only instants compare. `products/delete` removes the row at once, with no read-back, and leaves a tombstone for 60 s: no walk writes the product back from a page read before the delete, or from a listing lagging it; a report on it is read back as any other, and a read the shop answers clears the tombstone. `inventory_levels/update` names an inventory item and no product, so it asks for a walk, due at most 30 s after the last. A keeper that cannot take the event is counted and logged and Shopify is still answered 200: eight failed deliveries delete the subscription, and the walk repairs within 5 minutes what a retry would
- **Read back** — once any report is due, the alarm reads everything pending in one `getProducts(ids)`, the soonest due first and 250 at a time, so a burst spread across its window is one read. An answer with `updatedAt` at or past the report replaces the row and clears the pending row; one older leaves the row pending and the alarm re-arms 2 s out, timed from the shop's answer. At 60 s from the report the alarm leaves the row before reading, counted `stale` or `absent` by what the shop last answered, so a read that keeps failing ends there too. A changed product the shop answers nothing for twice in a row, at least 3 s after its report, has left the channel and leaves the copy — every read counts, and the span keeps the two apart however many other reports carried the row along early; a created one the shop cannot answer yet waits to the deadline, then is left to the walk. A redelivery changes nothing: the deadline and the misses stand while the report is the same. An answer lands only where its pending row still carries the report it was read for, so a delete or a newer report that arrived during the read wins; an answer of another length than the ids asked is refused. The payload is never trusted: it carries the price and the count but no metafields, and the facets are metafield references
- **Publish** — after the read-backs, and again after a walk, once each and only when a row changed: `meta.version` is bumped in the same transaction as the rows, and the body — rows in position order, the taxonomy, the shape, the version and `published_at` — is assembled into the object's memory. A counter, not a hash: an isolate must be able to tell an older copy from a different one. Nothing publishes before the first walk
- **Walk** — `walk()` reads every page of `listProducts` and the taxonomy first, then one synchronous transaction, a row a statement, upserts rows whose text or position moved — never lowering a row's `updated_at` — and deletes rows it did not see that were written before the walk began, on the keeper's own clock. An ask for a walk made while it was reading — the in-flight walk promise says so — stands, timed 30 s from when it was made; a walk settles every ask due before it began, and one that fails backs any standing ask off 30 s. One walk runs at a time: the cron, a wanted walk and a `sync` on an empty keeper share the in-flight promise. The `catalog` cron pass calls it every tick: silent where no keeper is bound, throwing on `outgrown` and on a keeper error, counting a Shopify failure without throwing
- **The alarm** — one per object, always at the earliest due work: the earliest pending `next_at` or the walk's due time, written on every re-arm from the tables. The handler catches everything and re-arms, held off one retry after a throw; a handler that throws is retried six times by the platform and then goes silent, so the cron outside the object is the net. `getAlarm()` answers nothing inside a running handler, so the next time is computed from the tables, never read back
- **Sync** — `sync(known)` answers from memory: the version and the shape, and the body only when `known` is older. An empty keeper walks itself first, under the one walk latch, so a fresh environment fills on its first listing read rather than on its first tick
- **The shape** — a constant stamped in `meta` and the body; a keeper whose stored shape differs from its code's treats itself as unwalked. The rows survive a deploy and a rollback, so the guard is needed in both directions
- **Nothing serialises across a read of the shop** — the object's input gate opens on every `fetch()` it awaits, so `apply`, `sync`, the alarm and a walk interleave; the six rules above — never lower `updated_at`, land a read-back on its own pending row, a delete stands over any page read before it, one walk at a time, write what moved, a counter for the version — are what keep the copy right in any order

![A change reaches the listing](../prds/assets/diagrams/store-catalogue-change.svg)

The flow is walked on [Product Listing](../prds/products/grade10-site/store/product-listing.md#following-the-shop).

## Reads

- **Memory** — each isolate holds `{ projection, checkedAt }` and derives entries from the whole products it receives; a request whose last check is under 3 s old answers from it, and the memory pass is unchanged
- **Sync** — past 3 s the request calls `sync(version)`, stamping the check as it starts so readers arriving meanwhile answer from memory — the runtime refuses I/O on behalf of another request, so no promise is shared across them; a reader holding a copy waits 500 ms at most and answers from memory, the check kept alive through `waitUntil` to land behind the response: one hop, same-region from Asia and up to 250 ms from Europe, the body only when it moved. A quiet location's first collector after a gap pays that hop rather than the old copy; refreshing behind the response would gate on the held copy's age, which is not staleness
- **Keeper slow or unreachable** — memory answers, `checkedAt` is stamped so the next try is 3 s away, `store.catalog.sync` counts `outcome:timeout` or `failed`; a body of another shape, or one this build cannot read, leaves memory answering the same way
- **Nothing held** — the request waits on `sync` without the short deadline; an empty keeper walks once for everyone. A keeper that cannot answer with nothing held fails loudly through `catalog_unavailable`: the isolate never walks the shop, so a keeper outage can never become every cold isolate walking Shopify at once
- **Whole products** — 2,031 B a product measured: 581 KB at 286 products, 4.1 MB at 2,000, 20 MB at 10,000. One RPC value up to 32 MiB, a few MB of isolate heap at today's size; `store.catalog.keeper.publish_bytes` alerts at 1 MB, about 500 products, the point at which the copy is cut to what a card draws
- **The product page and a collection** — `catalog.product` and `catalog.collection` read Shopify behind the 60 s cache tier, as today
- **Cursors** — `off-N`, one spelling, bounded at 10,000, over rows in the shop's own order; a copy that moved between two pages can repeat or skip one product on "load more", as today's per-location rebuilds could

## Failure

| Case | The listing | The record |
| --- | --- | --- |
| Shopify down | Answers from the copy, cards included; the copy stops moving | `walk outcome:failed` every tick; `projection.age_ms` past 10 minutes alerts |
| Keeper down | Memory answers; a cold isolate fails loudly | `store.catalog.sync` `outcome:failed`; `store.catalog.unavailable` |
| A report lost | Shows within 5 minutes | `store.shopify_webhook.received` flat while the shop edits |
| A report out of order or twice | The guard refuses the older read; the same truth is written once | — |
| A burst of reports | One publish per burst | `store.catalog.keeper.publish` with the pending count |
| The shop's read lags its report | Pending until the read catches up, 60 s at most, then the walk | `readback outcome:older`, `readback_lag_ms` |
| The shop answers nothing for a product it reported changed | Removed after the second read answering nothing; the walk restores it if the shop lists it again | `readback outcome:removed` |
| The shop answers nothing for a product it reported created | Left to the walk after 60 s | `readback outcome:absent` |
| Past the walk ceiling | The last copy keeps serving | The cron pass throws `outgrown` every tick |
| A body past 1 MB | Keeps serving | `publish_bytes` alerts; the cut to cards is the step |

## Numbers

- **Seconds after save** — Shopify's delivery (1–5 s) + the burst window (1 s) + one read-back (0.3 s) + a location's check (≤ 3 s) + the hop: under 10 s at any location once the shop's read answers the change; how long that read lags the report is unmeasured — a 2023 statement by Shopify staff says 5–30 s, nothing documents it, and `readback_lag_ms` records it
- **Shopify reads** — one `getProducts` per burst; 288 walks a day of 2 pages and the taxonomy at 286 products (864 requests), 41 pages at 10,000; the Storefront API states no request limit for a private token
- **The keeper's load** — one `sync` per active isolate per 3 s, answered from memory; one body per isolate per publish; row writes only for what moved
- **Cost** — requests and duration a few dollars a month for both brands at today's size; each `setAlarm` and each delete is a billed row write, and a whole-table rewrite every 5 minutes at 10,000 products would have cost ~$120 a brand a month, which writing only what moved removes

## Metrics

- `store.catalog.keeper.apply` by `outcome` (`pending`, `removed`, `walk`, `ignored`, `failed`) — every delivery handed over; `failed` is the 200-and-count case
- `store.catalog.keeper.readback` by `outcome` (`fresh`, `older`, `absent`, `removed`, `stale`, `failed`) and `store.catalog.keeper.readback_lag_ms`, report to fresh answer — the shop's own lag, measured; `store.catalog.keeper.alarm` `outcome:failed` — a handler that threw
- `store.catalog.keeper.publish` by `outcome` (`moved`, `same`), `store.catalog.keeper.publish_bytes` — **alert at 1 MB** — and `store.catalog.keeper.publish_age_ms`, oldest report in the burst to publish
- `store.catalog.keeper.pending` and `store.catalog.keeper.pending_oldest_ms` on every alarm — a product stuck on the guard shows before the age alert
- `store.catalog.keeper.walk` by `outcome` (`ok`, `outgrown`, `failed`) and `kind` on a failure, `store.catalog.keeper.walk_ms` — the net
- `store.catalog.sync` by `outcome` (`same`, `moved`, `filled`, `empty`, `shape`, `unreadable`, `timeout`, `failed`) and `store.catalog.sync_ms` — every location check; `store.catalog.projection.age_ms`, time since the copy an isolate answered from was published. **Alert past 10 minutes**: a copy that stopped moving is the one failure a collector cannot see
- `store.shopify_webhook.received` by `topic:products/*` — flat while the shop edits is the deleted-subscription signal

## Deploy

- **The first deploy ships whole** — a version upload cannot carry a Durable Object class lifecycle change; `scripts/deploy/ship.mjs` reads that refusal as the `lifecycle` reason and ships the worker whole with `wrangler deploy` in the flip, as it ships a worker that does not exist. The legacy `migrations` array is used: the declarative `exports` field refuses every later version upload
- **Declared six times** — `durable_objects.bindings` in the top-level, `staging` and `production` blocks of both brands' store configs; `migrations` once at the top level, which environments inherit; the class exported by name from each app; `pnpm run cf-typegen` regenerates both apps' `Env`
- **zzz** — declares the keeper and cannot ship while its hyperdrive ids read `TODO`
- **Rollback** — the previous build; the object and its rows stay unused; the class cannot be removed by a rollback, so the ship script's own rollback leaves a worker that shipped whole on the new build and names it `shipped`

## Unchanged

- **Checkout prices live** — the cart's review, the coupons' variant reads and every charge read Shopify; no price and no stock anyone pays on comes from the copy
- **Shopify owns the catalogue** — the shop edits in Shopify; the copy is what the shop last answered
- **The query's bounds** — `services/catalog/query.ts` dedupes, caps and folds what a query asks and reads one offset spelling
- **The edge cache rule** — tRPC stays on its own lane; collections and the product page keep the 60 s tier and the tag purge
- **The contracts** — the listing returns whole products, as today

## Queryable Index

Past tens of thousands of products, or for a shape a memory pass cannot rank,
the keeper's rows land in the store's own Postgres and every listing read is
one SQL round trip: one row per product with the columns a query narrows,
orders or counts on, a keyset cursor, a grouped count per facet, the walk and
the read-back writing rows instead of the object's table. Nothing of it is
built; the keeper keeps the same feed, so the index is a change of store, not
of mechanism.

## Open Items

| Item | Question | Owner |
| --- | --- | --- |
| Stock reports | Whether a manual stock adjustment fires `products/update`; an order does. Yes retires the walk on `inventory_levels/update` | Engineering, on the dev shop |
| Publication in bulk | Whether a bulk publish or unpublish fires `products/update`; no topic this app can subscribe to reports a channel's publication change, so no leaves it to the walk | Engineering, on the dev shop |
| The shop's read lag | How long Storefront answers the old value after a save, at p95 on staging; past 10 s the read-back moves to the Admin API, with the channel's publication id resolved once | Engineering |
| A collection in the copy | Whether the walk carries each product's collection handles, so a listing narrowed to a collection follows the shop too | Product, Engineering |
| Free text | The title only, as today, or title, description, tags and vendor as Shopify's own search read; ranked, for suggestions, or not | Product |
| Collection with facets | Nothing in the copy prevents it; offer both together, or keep the rule | Product |
| The numbers | Seconds-to-listing and the answer times from staging once the release carries them | Engineering |
