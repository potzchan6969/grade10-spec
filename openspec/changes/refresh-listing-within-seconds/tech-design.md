# Tech design

## Context

See `proposal.md` — Why. The requirements are the delta beside it; the
mechanism is [the design note](../../docs/references/store-catalogue-index.md).

What runs today, on PR 387 of the application repository:

- **The copy is built per location.** `services/catalog/projection.ts` walks
  the catalogue at 250 a page, holds the result in isolate memory and the
  location's cache, serves it past 5 minutes and rebuilds behind the response;
  a location holding nothing walks on the request.
- **Cards are read separately.** A page's ids are read whole by `nodes(ids:)`
  and kept 5 minutes, so the sort key and the price a card shows age apart.
- **The shop already reports changes.** `routes/webhooks.ts` verifies
  `products/*` and `inventory_levels/*` deliveries and purges the response
  cache tags; nothing refreshes the copy.
- **The cron runs every 5 minutes** through `CRON_PASSES`; every pass runs on
  every tick.
- **Workers Cache is a response cache** in front of the entrypoint, purged
  globally, and cannot be read from inside a request; the Cache API is per
  location; KV reads lag a write by its 30 s edge TTL. None of the three can
  tell an isolate that a copy moved within seconds — only asking a single
  writer can.

## Goals / Non-Goals

**Goals:**

- One copy per shop, one writer, every location following it within seconds
- No listing view reads the shop; no location waits on a walk
- Fewer tiers than today: memory and the keeper, nothing in between

**Non-Goals:**

- Rows in Postgres and SQL listings — the step after, `proposal.md`
- A copy faster than the shop's own report
- Changing what a query narrows, orders or counts; `browse.ts` is untouched

## Decisions

### The keeper is a Durable Object, one per shop

The spec governs what the listing shows and how soon. The implementation:
`services/catalog/keeper.ts` exports `CatalogKeeper`, a Durable Object named
by the shop domain, bound as `CATALOG_KEEPER` in both store workers.

- **Why an object.** It is the one writer: events from any location land in
  one place, in order, and a burst is coalesced there. Every location reads
  the same version number from it, so nothing eventually consistent sits on
  the path.
- **Rejected — a cron writing KV.** A KV read lags a write by its edge TTL, 30 s at the floor, and no event can shorten it.
- **Rejected — each location rebuilding on the event.** A delivery reaches one location; the others learn nothing, and a bulk edit is a walk per delivery.
- **Rejected — Postgres as the shared copy.** A read to one region per check, on the pool checkout shares.
- **Rejected — `BaseDO` from `packages/durable`.** Its migrations, managers and task scheduler serve a queue; the keeper needs three tables and one alarm. A plain `DurableObject` with `ctx.storage.sql` is the whole of it.
- **Placement.** Created with the location hint of the store's region (`apac` for both brands today), so the common check is a same-region hop.

### An event is applied from a read-back, never from its payload

`apply(event)` records the product id and the report's `updated_at` in
`pending` and arms the alarm; the alarm reads each pending product back with
`product(id:)` and upserts the row.

- **Why read back.** The payload carries no metafields, and the facets are metafield references; Storefront answers what the channel publishes, so "not found" is the one honest signal that a product left the store.
- **The guard.** A read whose `updatedAt` is older than the report is not written; the product stays pending and the alarm retries at 1, 2, 4 and 8 seconds, then gives up loudly (`store.catalog.keeper.readback` `outcome:stale`) and leaves it to the walk. A duplicate or out-of-order delivery upserts the same truth or an older one the guard refuses.
- **Stock.** `inventory_levels/update` names an inventory item, not a product. Until the dev shop shows that `products/update` fires on a tracked count change, the event arms a walk instead of a read-back — coalesced on the same alarm, so a till selling ten units in a second costs one walk. Open Questions carries the check.

### One publish per burst, numbered by content

The alarm reads back everything pending, walks if a walk was asked for, and
then publishes once: the body (entries with cards, the taxonomy) is
serialised, its hash is the version, and both are kept in the object's memory
and in `meta`. An unchanged body publishes nothing.

- **Why a hash.** A location compares one string; an event that changed nothing visible moves no location.
- **Coalescing.** The alarm is set 1 second after the first event of a burst and never moved earlier, so 300 saves in a minute publish a handful of times.

### The walk is the net, on the 5-minute tick

`walk()` reads the whole catalogue with the existing `buildProjection` walk
and replaces every row in one transaction, then publishes if the hash moved.
`CRON_PASSES` gains a `catalog` pass that calls it every tick, so a lost
report, a renamed facet or a product the guard gave up on shows within
5 minutes.

- **Ceiling.** Storefront pagination stops at 25,000; a walk that reaches page 100 refuses (`outgrown`), the pass throws like every pass, and the last copy stays. `CATALOG_MAX_OFFSET` keeps bounding the cursor at 10,000 and no longer sizes the walk.

### A listing view follows the keeper from memory

The request path holds `{ projection, version, checkedAt }` per isolate.

1. If the last check is under 5 seconds old, answer from memory.
2. Otherwise call `sync(version)` and wait: the keeper answers the current
   version, and the body only when it differs. Swap, stamp `checkedAt`,
   answer.
3. If the keeper cannot answer and memory holds a copy, answer from it, stamp
   `checkedAt` so the next try is 5 seconds away, count
   `store.catalog.sync` `outcome:failed`.
4. If nothing is held at all — a fresh environment before its first tick, or
   the keeper down on a cold isolate — walk the shop into memory with the
   existing build, never publishing it.

- **Why wait rather than refresh behind.** The first request after a quiet gap is the one a collector on a quiet location sends; serving the old copy there is the day-old copy in miniature. The wait is one same-region hop.
- **Rejected — a version marker in the Cache API purged on change.** Workers Cache purge does not reach Cache API entries, and a zone purge needs a token the worker does not hold.
- **What goes.** The projection's cache tier, its 24-hour keep, the 5-minute age, the build cooldown, `hydrate`, the product memory and cache tiers, `getProducts`, its query, codecs, mappers and fixtures.

### Cards ride in the copy

The walk and the read-back select the card's fields beside the entry's:
`handle`, `images(first: 1)`, `variants(first: 10)` with id, title, price,
compare-at, availability and count. `CatalogCard` in
`packages/shopify/contracts` is `{ id, handle, title, images, variants }`,
`Product` extends it, and `productsPageSchema` pages cards.

- **Why the array.** Three admin surfaces read every variant, and `sellableVariant` picks the first for sale; a single flattened variant would truncate both.
- **Frontend cost.** Type-only: `CatalogCard` beside `Product` in the store frontend's domain, `sellableVariant` and `pricedVariant` widened to it, `ProductPage` over cards, the listing page's tile and walk typed by it; the admin frontends' catalogue repositories the same. Excess keys are stripped on decode, so an old worker's whole products decode as cards during rollout.

## Database Schema

The keeper's own SQLite, created on first construction with
`CREATE TABLE IF NOT EXISTS`; nothing in Postgres.

| Table | Columns | Holds |
| --- | --- | --- |
| `products` | `id TEXT PRIMARY KEY`, `updated_at TEXT NOT NULL`, `entry TEXT NOT NULL` | One row per product the channel publishes; `entry` is the projection entry with its card, as JSON |
| `pending` | `id TEXT PRIMARY KEY`, `reported_at TEXT NOT NULL`, `attempts INTEGER NOT NULL DEFAULT 0` | Products reported changed and not yet read back |
| `meta` | `key TEXT PRIMARY KEY`, `value TEXT NOT NULL` | `taxonomy` (JSON), `version` (hash), `published_at`, `walked_at`, `walk_wanted` |

Every row is derived from a Storefront read; the walk may rewrite all of them.

## Service Interfaces

`CatalogKeeper`, reached through the stub by RPC:

| Method | Input | Output | Notes |
| --- | --- | --- | --- |
| `apply(event)` | `{ topic, productId?, updatedAt? }` | `{ pending: number }` | Upserts `pending` or sets `walk_wanted`; arms the alarm. A throw reaches the webhook route, which answers 500 so Shopify retries |
| `walk()` | none | `{ outcome: "ok" \| "outgrown" \| failure, entries?, version? }` | Whole read, one transaction, publish if moved. Called by the cron pass |
| `sync(known)` | `string \| null` | `{ version }` or `{ version, projection }` | The body only when `known` differs |
| `alarm()` | — | — | Read back `pending`, walk if wanted, publish once |

Example, a price change on product `gid://shopify/Product/95066`:

1. Webhook `products/update`, `updated_at: 2026-09-14T09:00:00Z` →
   `apply` → `pending` row, alarm at +1 s.
2. Alarm: `product(id:)` answers `updatedAt: 2026-09-14T09:00:01Z` ≥ report →
   `products` row replaced, `pending` row deleted, body hashed →
   `meta.version = "5f1c…"`, `published_at` stamped.
3. A Frankfurt isolate whose `checkedAt` is 7 s old calls `sync("2ab9…")` →
   `{ version: "5f1c…", projection }` → memory swapped → the grid answers
   with the new price and the price order places the card by it.

The webhook route hands `products/*` and `inventory_levels/*` deliveries to
`apply` after the existing verification and keeps the tag purge for the
collection and product response tier. The cron pass `catalog` calls `walk()`
and throws on anything but `ok`.

## Risks / Trade-offs

- [The keeper is unreachable] → the listing answers from memory and counts `sync` failures; a cold isolate walks the shop into memory; nothing publishes from a request
- [Shopify answers the read-back before it caught up] → the `updatedAt` guard and the retry ladder; the walk is the net
- [A burst of reports] → one alarm per burst; the read-backs run in one alarm, 20 at a time; `pending` bounds nothing but is emptied every alarm
- [A large body over RPC] → 110 KB today, 3.8 MB at 10,000 products; measured against the RPC limit on staging before the release, with `stub.fetch` streaming as the fallback
- [Both cron and events publish] → one object, one alarm: `walk()` from the cron and the alarm's publish serialise on the object's own input gate
- [The report never arrives] → the 5-minute walk; `store.shopify_webhook.received` flat while the shop edits is the deleted-subscription signal

## Migration Plan

1. Deploy both store workers with the `CATALOG_KEEPER` binding and the
   `new_sqlite_classes` migration; the first 5-minute tick fills the keeper,
   and until then a cold isolate walks into memory as today.
2. Replay a `products/update` through `/dev/webhooks/shopify` on staging and
   read the listing back from two locations; record seconds-to-listing.
3. Rollback: redeploy the previous build; the object stays, unused, and can
   be deleted with its migration later.

## Open Questions

- Whether `products/update` fires on a tracked count change on the dev shop.
  Yes: `inventory_levels/update` stops arming a walk. No: it stays. Either
  answer keeps the design and the tasks.
