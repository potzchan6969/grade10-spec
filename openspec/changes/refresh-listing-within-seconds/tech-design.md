# Tech design

## Context

See `proposal.md` — Why. The requirements are the delta beside it; the
mechanism is [the design note](../../docs/references/store-catalogue-index.md).

What runs today, on PR 387 of the application repository:

- **The copy is built per location.** `services/catalog/projection.ts` walks
  the catalogue at 250 a page, holds entries in isolate memory and the
  location's cache, serves them past 5 minutes and rebuilds behind the
  response; a location holding nothing walks on the request.
- **Cards are read separately.** A page's ids are read whole by `nodes(ids:)`
  and kept 5 minutes, so the sort key and the price a card shows age apart.
- **The shop already reports changes.** `routes/webhooks.ts` verifies
  `products/*` and `inventory_levels/*` deliveries and purges response cache
  tags; nothing refreshes the copy.
- **The cron runs every 5 minutes** through `CRON_PASSES`; every pass runs on
  every tick and says nothing on a brand that wired none of what it needs.

What the platforms hold, verified against their documentation:

- **Cloudflare.** KV reads lag a write by a 30 s edge TTL; Workers Cache is
  purged globally but cannot be read from inside a request; the Cache API is
  per location. A Durable Object is one writer, but its input gate opens
  across every `fetch()` it awaits; it holds one alarm, run at-least-once,
  retried 6 times and then silent, and consumed before its handler runs;
  `waitUntil` does nothing inside it. Its
  SQLite takes 2 MB a row, 100 KB a statement, 100 bound parameters, and
  bills every row written. An RPC value may be 32 MiB. A version upload
  cannot carry a Durable Object class lifecycle change; only `wrangler
  deploy` applies one.
- **Shopify.** Nothing documents a cache on Storefront reads; one staff
  statement from 2023 says a read can answer the old value for 5–30 s after a
  save. An unpublished product answers nothing through a private token. A
  webhook that fails is retried 8 times over 4 hours, then its subscription
  is deleted. `products/update` fires when a product is edited or ordered; no
  topic this custom app can subscribe to reports a publication change on the
  store's channel.

## Goals / Non-Goals

**Goals:**

- One copy per shop, one writer, every location following it within seconds
  of the shop's read answering a change
- No listing view reads the shop; no location waits on a walk
- Fewer tiers than today: memory and the keeper, nothing in between

**Non-Goals:**

- Rows in Postgres and SQL listings — the step after, `proposal.md`
- A copy faster than the shop's own report and reads
- Cards cut from products in the copy — the step at a 1 MB body
- A listing narrowed to a collection — stays on the shop's own read
- Changing what a query narrows, orders or counts; `browse.ts` is untouched

## Decisions

### The keeper is a Durable Object, one per shop

`packages/grade10-store/backend/src/durables/CatalogKeeper/` holds the class,
its RPC interface, the manager that carries every rule below over a storage
port, and the SQLite adapter behind that port. The class leaves the package
through `./worker/catalog-keeper`, a subpath of its own because it imports
`cloudflare:workers`, which the node lane cannot resolve; each app exports it
by name, and both store workers bind it as `CATALOG_KEEPER`.

- **Why an object.** It is the one writer: events from any location land in one place, and a burst is coalesced there. Every location reads one version number from it, so nothing eventually consistent sits on the path. No cache or store on the platform tells an isolate that a copy moved within seconds; asking one writer does.
- **Against the convention, on record.** `docs/conventions/backend.md` says no deployed worker binds a Durable Object and that scheduled work is a row a cron re-reads. This is the one exception: a row nobody can read within seconds from every location is not a copy every location can follow. The convention is updated to name the exception and its reason.
- **Rejected — a cron writing KV.** A read lags a write by 30 s at the floor, and no event can shorten it.
- **Rejected — each location rebuilding on the event.** A delivery reaches one location; the others learn nothing.
- **Rejected — Postgres as the shared copy.** A cross-region read per check, on the pool the orders share.
- **Rejected — `BaseDO`.** Its scheduler owns the single alarm and schedules through `waitUntil`, which has no effect in a Durable Object; its migrations serve a queue. A plain `DurableObject` over `ctx.storage.sql` is the whole of it.
- **The manager, not the class.** The rules live in `keeper.ts` over a `KeeperStore` port; the store in memory is the package's test surface, and the class holds the SQLite implementation, the RPC methods and the alarm handler, proved in the worker lane. The folder holds the class, its interface, the rules and the store — none of the drizzle schema, migrations or managers a `BaseDO` folder carries, since the tables are created by the class and dropped and refilled by the next walk when their version moves.
- **Fixtures wherever local.** The object builds its catalogue from the runtime env, which no request can override, so a local environment — development, testing, e2e — with no storefront token runs on the fixture shop throughout, the worker lane included.
- **Placement.** One accessor, `storeKeeper(env)` in `deps.ts` over `catalogKeeperOf`, names the object `<shop>/v1` with the location hint `apac`; only the first `get()` of an object respects a hint, so no other call site may build a stub.
- **Three versions, each its own.** The object's name carries `v1`: moving it starts a fresh object, for a copy that must be rebuilt from nothing. The wrangler migration tag `v1` is the class's lifecycle, never reused. `meta.schema` is the tables' own version: a mismatch drops and recreates them, carrying only the version counter across, so no isolate is left holding a number the rebuilt keeper never passes.

### Nothing serialises across a read of the shop

The input gate opens on every `fetch()`, so `apply`, `sync`, the alarm and a
walk interleave. Six rules keep the copy right whatever the order:

- **No write lowers a row's `updated_at`.** Every write is an upsert guarded by it, from a read-back or a walk alike.
- **A read-back lands only on the row it was read for.** The alarm reads `pending`, reads the shop, then writes each answer only where the pending row is still present with the same `reported_at`; a delete or a newer report that arrived meanwhile wins.
- **A delete stands over any page read before it.** `products/delete` leaves a tombstone, its own row, for one deadline, 60 s: a walk whose pages were read before the delete, or a listing lagging it as it lags a change, cannot write the product back. A report on the deleted product is read back as any other, and a read the shop answers clears the tombstone — the shop's word that the product is there outranks the delete. Ids are never reused, so nothing else waits on it.
- **One walk at a time.** The manager holds one in-flight walk promise; the cron, a wanted walk and a `sync` on an empty keeper share it.
- **The walk writes what moved.** Every page is read first; then one synchronous transaction, a row a statement, upserts rows whose text or position differs and deletes rows it did not see that were written before the walk began — on the keeper's own clock, since the shop's stamp says when the shop changed a product, not when the copy took it. An ask for a walk made while the walk was reading — the walk's first millisecond included, as a row written then is kept — stands, told by the newest ask's time against the walk's start, and is timed 30 s from the walk it stood over: its pages may not carry that change. A walk that fails backs the standing ask off 30 s whichever walk it stood over.
- **The version is a counter.** `meta.version` is bumped only when a row changed, with `published_at` beside it; an isolate swaps only for a higher number. A hash can say "different", never "older".

### An event is applied from a read-back, never from its payload

`apply(event)` records the product id and the report's `updated_at`, parsed
to epoch milliseconds, in `pending` and arms the alarm; the alarm reads every
pending product back in one `getProducts(ids)` and upserts each row.

- **Why read back.** The payload carries the price and the count but no metafields, and the facets are metafield references; Storefront answers what the channel publishes, so an answer of nothing is the channel's own word that a product left the store.
- **Why Storefront, not Admin.** Admin is not behind the read cache and can say whether a product is published to a named channel, but it needs a second product codec, the channel's publication id and a points budget. The lag is unmeasured; `store.catalog.keeper.readback_lag_ms` measures it, and Admin is the recorded step if its p95 passes 10 s.
- **The guard and the deadline.** A read older than the report leaves the row pending and the alarm re-arms 2 s out, timed from the shop's answer, for up to 60 s from the report. The deadline is applied by the alarm before it reads, so a read that keeps failing ends there too: the row is left as it is, counted `stale` or `absent` by what the shop last answered, and the walk is the net. A changed product the shop answers nothing for twice in a row, at least a burst window and a retry after its report, has left the channel and leaves the copy — every read counts, and the span keeps the two reads apart however many other reports carried the row along early, so a busy shop can neither starve the row of a counted read nor hurry it out; a created one the shop cannot answer yet waits to the deadline, then is left to the walk.
- **A redelivery changes nothing.** The deadline and the count of misses stand while the report is the same; a newer report restarts both. A read in flight is told apart by the report it was made for, so a delete or a newer report that lands during it wins.
- **A delete is applied at once.** `products/delete` removes the row and any pending read, publishes with no read-back — the payload carries only an id — and leaves the tombstone above.
- **Stock.** `inventory_levels/update` names an inventory item, not a product. It arms a walk, at most one every 30 s, so a till selling all day costs 2 pages every 30 s at today's size. Open Questions carries the check that retires it.
- **Idempotent.** Nothing dedupes catalog deliveries, so a redelivery upserts the same pending row and the same truth.

### One publish per burst, from the alarm

The alarm always points at the earliest due work: the earliest pending
`next_at`, or a wanted walk's `walk_due`. The handler catches everything and
re-arms; the platform's own retry is not a net.

- **Order.** Once any report is due, everything pending is read in one call, the soonest due first and 250 at a time — a burst spread across its window is still one read, and a burst past a page is read a page an alarm — then a publish if a row changed, then a due walk, then a publish again if the walk moved a row. A read that throws is counted and does not hold the walk, which is its net. The version moves in the same transaction as the rows.
- **The body.** Rows `ORDER BY position, id`, the taxonomy, the shape, the version and `published_at`, assembled once into the object's memory; `sync` answers from memory and never waits on storage.
- **A throw holds the alarm off one retry** rather than firing it again at once. The alarm as last armed is remembered, so a burst writes it once rather than once per report, and forgotten when the platform fires it: the handler always arms the next, whatever it recomputes.
- **Nothing before the first walk.** No publish until `meta.walked_at` exists; an event on an unwalked keeper asks for a walk instead, so a burst never publishes a copy of one product.
- **The shape.** A constant stamped in `meta` and the body; a keeper whose stored shape differs from its code's treats itself as unwalked, so a deploy that changes the shape rewrites the copy on its first read.

### The walk is the net, on the 5-minute tick

`walk()` reads the whole catalogue with `listProducts` at 250 a page and the
taxonomy with `listFilters`, then writes what moved. `CRON_PASSES` gains a
`catalog` pass that calls it every tick.

- **The pass says nothing** where no keeper is bound, as every pass does on a brand that wired none of what it needs; it throws on `outgrown` and on a keeper error, and counts and logs a Shopify failure without throwing — `store.catalog.projection.age_ms` past 10 minutes is the alert for a copy that stopped moving.
- **Ceiling.** The first page's count past `CATALOG_MAX_OFFSET` refuses (`outgrown`) in one round trip; the last copy keeps serving.
- **Position.** The walk writes each product's position in the shop's own order, so the unsorted grid keeps the order it has today and an offset cursor stays stable; a product a read-back adds appends until the next walk.

### A listing view follows the keeper from memory

The request path holds `{ projection, checkedAt }` per isolate and derives
entries from the whole products it receives.

1. If the last check is under 3 seconds old, answer from memory.
2. Otherwise stamp `checkedAt` and call `sync(version)`: the check is stamped
   as it starts, so readers arriving meanwhile answer from memory — the
   runtime refuses I/O on behalf of another request, so no promise is shared
   across requests — and it swaps the body in when it moved, answering the
   keeper's failure rather than rejecting.
3. A reader holding a copy waits on its check 500 ms at most, then answers
   from memory, counted `store.catalog.sync` `outcome:timeout`; the check is
   handed to the request's `waitUntil` and lands behind the response. A
   keeper that fails, or publishes a body of another shape or one this build
   cannot read, leaves memory answering, counted by outcome.
4. A reader holding nothing waits on the keeper, as every such reader does:
   an empty keeper walks itself once, under its one walk latch, and answers
   everyone. A keeper that cannot answer with nothing held fails loudly
   through `catalog_unavailable`; the isolate never walks the shop.

- **Why wait rather than refresh behind.** The first request after a quiet gap is the one a collector on a quiet location sends; serving the old copy there is the day-old copy in miniature. Refreshing behind would gate on the held copy's age, which is not staleness. The hop is same-region from Asia and up to 250 ms from Europe.
- **Why 3 seconds.** Delivery up to 5 s, a 1 s burst window, one read-back, the check and the hop: 9.5 s worst case against the 10 s bound; at 5 s the bound is missed.
- **The purge beside it.** The webhook route runs the tag purge and the hand-over together; a purge the API refuses is logged and answered `purge_unavailable`, as a purge with no cache is, so Shopify retries the delivery.
- **Whole products.** 2,031 B a product measured: 581 KB at 286, one RPC value, a few MB of heap. `store.catalog.keeper.publish_bytes` alerts at 1 MB, the point at which the copy is cut to what a card draws.
- **What goes.** The projection's cache tier, its 24-hour keep, the 5-minute age, the build cooldown, `hydrate`, the product memory and cache tiers.

### The webhook route hands the event over, then answers 200

`shopifyCatalogPurge` awaits `apply` beside the tag purge it keeps, the two
together, under a 2 s deadline well inside Shopify's 5 s for the delivery. A
keeper that cannot take the event in time is counted
(`store.catalog.keeper.apply` `outcome:failed`) and logged, and Shopify is
answered 200: eight failed deliveries delete the subscription, and the walk
repairs within 5 minutes what a retry would.

### The first deploy ships whole

`scripts/deploy/ship.mjs` uploads a version for every existing worker and
flips it; a version cannot carry a class lifecycle change. The script gains a
third reason a version cannot be uploaded yet, `lifecycle` — the three live in
`refusals.mjs`, tested, since the script runs on import — and ships that
worker whole with its own `wrangler deploy` in the flip, as it does a worker
that does not exist. The legacy `migrations` array is used, never the
declarative `exports` field, which refuses every later version upload. A run
that rolls back leaves that worker on the new build, since no version before
it carries the class, and its summary names the worker `shipped`.

## Database Schema

The keeper's own SQLite, created on first construction with
`CREATE TABLE IF NOT EXISTS`; nothing in Postgres.

| Table | Columns | Holds |
| --- | --- | --- |
| `products` | `id TEXT PRIMARY KEY`, `position INTEGER NOT NULL`, `updated_at INTEGER NOT NULL`, `written_at INTEGER NOT NULL`, `product TEXT NOT NULL` | One row per product the channel publishes: its place in the shop's order, the shop's `updatedAt` in epoch milliseconds, when the keeper wrote it, the whole product as JSON |
| `pending` | `id TEXT PRIMARY KEY`, `kind TEXT NOT NULL`, `reported_at INTEGER NOT NULL`, `since INTEGER NOT NULL`, `next_at INTEGER NOT NULL`, `misses INTEGER NOT NULL` | Products reported and not yet read back: created or changed, the report's stamp, when the store first heard a report this new, when to read next, reads in a row the shop answered nothing to |
| `tombstones` | `id TEXT PRIMARY KEY`, `at INTEGER NOT NULL` | Products reported deleted and when: no walk writes one back within 60 s of the delete; a read-back the shop answers removes it |
| `meta` | `key TEXT PRIMARY KEY`, `value TEXT NOT NULL` | `schema`, `taxonomy` (JSON), `version`, `published_at`, `walked_at`, `walk_due`, `walk_asked`, `shape` |

Every row is a Storefront answer; the walk may rewrite any of them.

## Service Interfaces

`CatalogKeeper`, reached through the one accessor's stub by RPC:

| Method | Input | Output | Notes |
| --- | --- | --- | --- |
| `apply(event)` | `{ topic, productId, updatedAt? }` | `{ outcome: "pending" \| "removed" \| "walk" \| "ignored" }` | Upserts `pending`, removes a deleted product, or asks for a walk; arms the alarm at the earliest due work. `ignored` is a topic it does not follow, or a delete naming nothing |
| `walk()` | none | `{ outcome: "ok" \| "outgrown" \| failure, products, version }` | Whole read, writes what moved, publishes if a row changed. Called by the cron pass, and by `sync` on an empty keeper |
| `sync(known)` | `number \| null` | `{ version, shape }` or `{ version, shape, body }` | From memory; the body only when `known` is older |

The alarm handler: read back, publish, walk if due, publish, re-arm.

The worker takes the keeper through a port, `CatalogKeeperPort`
(`sync`, `apply`, `walk`), with an in-memory implementation in
`@grade10/store-service/testing` for the node lanes.

Example, a price change on product `gid://shopify/Product/95066`:

1. Webhook `products/update`, `updated_at: 2026-09-14T17:00:00+08:00` →
   `apply` → `pending` row with `reported_at` 1789405200000, alarm at +1 s.
2. Alarm: `getProducts` answers `updatedAt: 2026-09-14T09:00:01Z` ≥ the report
   → the row is replaced, `pending` emptied, a row changed → `version` 41 → 42,
   `published_at` stamped, the body rebuilt in memory.
3. A Frankfurt isolate whose `checkedAt` is 4 s old calls `sync(41)` →
   `{ version: 42, shape: 1, body }` → memory swapped → the grid answers with
   the new price, and the price order places the card by it.

## Risks / Trade-offs

- [The keeper is unreachable] → the listing answers from memory and counts; with nothing held it fails loudly; nothing publishes from a request
- [The shop's reads lag its report] → the guard, the 2 s re-read to 60 s, `readback_lag_ms`; the walk is the net; Admin is the recorded next step
- [A burst of reports] → one alarm per burst; one `getProducts` of up to 250 ids per read-back
- [A body over 1 MB] → `publish_bytes` alerts; the cut to cards is the recorded step
- [The alarm goes silent after its retries] → the handler catches and re-arms; the cron walk lives outside the object
- [The report never arrives] → the 5-minute walk; `store.shopify_webhook.received` flat while the shop edits is the deleted-subscription signal
- [A quiet location off-region] → one hop of up to 250 ms on the first request after a 3 s gap, accepted over serving an old copy

## Migration Plan

1. Land the contract: `updatedAt` on the product read and the walk, `updated_at` on the product webhook.
2. Land the keeper with its tests, then the wiring: webhook, cron pass, request path, bindings and the deploy path.
3. Deploy to staging through the ordinary dispatch; the store worker ships whole once, applying the `v1` migration. The first listing read fills the keeper.
4. Measure on staging: cold and warm answer times from two locations, and — with a product edited in the staging shop's admin, which no script or secret here can do — seconds from the shop's read to the listing.
5. Rollback: redeploy the previous build; the object and its rows stay, unused. A rollback cannot remove the class; its deletion is a later migration, and the ship script's own rollback leaves the worker that shipped whole where it is.

## Open Questions

- Whether a manual stock adjustment fires `products/update` on the dev shop. Yes retires the walk on `inventory_levels/update`; no keeps it at its 30 s floor.
- Whether a bulk publish or unpublish fires `products/update`. No leaves those changes to the walk, and the page says so.
- How long the shop's reads lag its report on staging, at p95. Past 10 s the read-back moves to the Admin API, with the channel's publication id resolved once.
