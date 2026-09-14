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

One Durable Object per shop, `CatalogKeeper` in
`services/catalog/keeper.ts`, bound as `CATALOG_KEEPER` in both store
workers and placed with the store's region as its location hint. It is the
one writer of the copy; every location follows it.

| Rule | Value |
| --- | --- |
| Publish after a report | ≤ 10 s: delivery, one read-back, a 1 s burst window |
| A location's check | Every 5 s while the listing is in use; the first request after a longer gap waits on one hop |
| The re-read | Every 5 minutes, on the store's cron tick |
| Read-back retries | 1, 2, 4, 8 s, then the walk |
| Walk ceiling | 100 pages of 250 — Shopify's own 25,000 |
| Cursor ceiling | 10,000, unchanged |

- **What it holds** — its own SQLite: `products` (one row per product the channel publishes: id, the shop's `updatedAt`, the entry with its card), `pending` (products reported and not yet read back, with attempts), `meta` (the taxonomy, the version, when it published, when it walked, whether a walk is wanted). Every row is a Storefront answer; the walk may rewrite all of them
- **Apply** — the webhook route, after verification, hands every `products/*` delivery to `apply`, which records the product and the report's `updated_at` in `pending` and arms the alarm 1 s out; `inventory_levels/update` names an inventory item and no product, so it sets `walk_wanted` instead ❓ whether `products/update` fires on a tracked count change, checked on the dev shop; yes retires the walk on stock events — Engineering
- **Read back** — the alarm reads each pending product with `product(id:)`: not found deletes the row, an answer older than the report leaves it pending for the next retry, anything else replaces the row. The payload is never trusted: it carries no metafields, and the facets are metafield references
- **Publish** — after the read-backs and any wanted walk, once: the body is serialised, its hash is the version, both stay in the object's memory and `meta`; an unchanged body publishes nothing
- **Walk** — `walk()` reads the whole catalogue with the existing walk and replaces every row in one transaction; the `catalog` cron pass calls it every tick and throws on anything but `ok`, like every pass, so the cron fails loudly while the last copy keeps serving
- **Sync** — `sync(known)` answers the version, and the body only when `known` differs

![A change reaches the listing](../prds/assets/diagrams/store-catalogue-change.svg)

The flow is walked on [Commerce](../prds/products/grade10-site/commerce/commerce.md#catalog).

## Reads

- **Memory** — each isolate holds `{ projection, version, checkedAt }`; a request whose last check is under 5 s old answers from it, and the memory pass is unchanged
- **Sync** — past 5 s the request calls `sync(version)` and waits: one same-region hop, the body only when it moved. A quiet location's first collector after a gap pays that hop rather than the old copy
- **Keeper unreachable** — memory answers, `checkedAt` is stamped so the next try is 5 s away, `store.catalog.sync` counts `outcome:failed`
- **Nothing held** — a fresh environment before its first tick, or a cold isolate with the keeper down: the isolate walks the shop into its own memory with the existing build and never publishes
- **The product page** — `catalog.product` reads Shopify by handle behind the 60 s cache tier, as today
- **Cursors** — `off-N`, one spelling, bounded at 10,000; a page is answered against the copy the isolate holds, so a copy that moved between two pages can repeat or skip one product on "load more", as today's per-location rebuilds could

## Failure

| Case | The listing | The record |
| --- | --- | --- |
| Shopify down | Answers from the copy, cards included; the copy stops moving | The cron pass fails every tick; read-backs retry then give up loudly |
| Keeper down | Memory answers; a cold isolate walks into memory | `store.catalog.sync` `outcome:failed` |
| A report lost | Shows within 5 minutes | `store.shopify_webhook.received` flat while the shop edits |
| A report out of order or twice | The guard refuses the older read; the same truth is written once | — |
| A burst of reports | One publish per burst | `store.catalog.keeper.publish` with the pending count |
| The shop's read lags its report | Pending until the read catches up, 15 s at most | `store.catalog.keeper.readback` `outcome:stale` |
| Past 25,000 products | The last copy keeps serving | The cron pass throws `outgrown` every tick |

## Numbers

- **Seconds after save** — Shopify's delivery (1–5 s) + the burst window (1 s) + one read-back (0.3 s) + a location's check (≤ 5 s): about 3–10 s at any location
- **Shopify reads** — one `product(id:)` per reported product; 288 walks a day of 2 pages and the taxonomy at 286 products (864 requests), 41 pages at 10,000 (11,808); the Storefront API states no request limit for a private token
- **The keeper's load** — one `sync` per active isolate per 5 s, microseconds each; one body per isolate per publish
- **Bytes** — the table above; 3.8 MB of cards at 10,000 products is the figure to measure against the RPC limit before that size

## Metrics

- `store.catalog.keeper.apply` by `topic` — reports the keeper accepted
- `store.catalog.keeper.readback` by `outcome` (`ok`, `gone`, `stale`, `failed`) — every read-back; `stale` rising is Shopify's own lag
- `store.catalog.keeper.publish` with the pending count drained — one per burst; `store.catalog.keeper.publish_age_ms`, first report to publish
- `store.catalog.keeper.walk` by `outcome`, `store.catalog.keeper.walk_ms` — the net
- `store.catalog.sync` by `outcome` (`same`, `moved`, `failed`) — every location check; `store.catalog.projection.age_ms`, time since the copy an isolate answered from was published. **Alert past 10 minutes**: a copy that stopped moving is the one failure a collector cannot see
- `store.shopify_webhook.received` by `topic:products/*` — flat while the shop edits is the deleted-subscription signal

## Unchanged

- **Checkout prices live** — the cart's review, the coupons' variant reads and every charge read Shopify; no price and no stock anyone pays on comes from the copy
- **Shopify owns the catalogue** — the shop edits in Shopify; the copy is what the shop last answered
- **The query's bounds** — `services/catalog/query.ts` dedupes, caps and folds what a query asks and reads one offset spelling
- **The edge cache rule** — tRPC stays on its own lane; collections and the product page keep the 60 s tier and the tag purge

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
| Stock reports | Whether `products/update` fires on a tracked count change; yes retires the walk on `inventory_levels/update` | Engineering, on the dev shop |
| Free text | The title only, as today, or title, description, tags and vendor as Shopify's own search read; ranked, for suggestions, or not | Product |
| Collection with facets | Nothing in the copy prevents it; offer both together, or keep the rule | Product |
| An all-products collection | Whether the shop keeps one, so facets, latest and counts could answer natively | Product, shopkeeper |
| The numbers | Seconds-to-listing and the answer times from real traffic once the release carries them | Engineering |
