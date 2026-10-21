## Context

The [proposal](proposal.md) holds the scope. What grade10 runs today:

- **Scanner** - `apps/backend/grade10/tcg-ar`, served at the site's `/scan`,
  deployed to staging and production. Projects keep items in D1 through the
  platform API (`worker/platform/routes.ts`) or keylessly through the
  `ScannerPlatform` service binding (`worker/platform/rpc.ts`). No project row
  exists on either environment, and a bound call for a project with no row is
  `401` (`worker/platform/auth.ts:115-127`)
- **Every upsert writes** - `upsertItem` (`routes.ts:453-509`) rewrites the
  row and touches the collection on every call, so an unchanged item bumps the
  collection's version and rebuilds its files on the next scanner read.
  `POST /items/batch` touches the collection once per item (`routes.ts:608-627`)
- **Delete is not idempotent** - `DELETE /items/:id` answers `404` for an
  unknown id (`routes.ts:663-683`), and `ScannerError`'s status does not
  survive the binding: a thrown error crosses RPC as its message alone
- **Model drift** - the photo run checks out `main`; the scanner keeps
  an embedding only from its own model and drops any other silently
  (`routes.ts:934`), so the photo stays `need: embed` and is processed again
  at every run, up to the processor's 2,000-job cap
- **Failed photos stay failed** - a photo the processor could not read is
  `failed` for good; the queue never serves it again (`routes.ts:1039-1074`)
- **Photos on staging only** - `tcg-ar-ops.yml`'s `photos` job runs hourly at
  `:17` against staging (`.github/workflows/tcg-ar-ops.yml:24,171`)
- **One photo match, no pick** - `ItemIndex.resolve` answers one item for a
  collection photo match, `{ how: "photo", item }`, beside `cert`, `card` and
  `catalogue` (`src/app/hosted/client.ts:117-122,210-230`). The matcher's
  `alternatives` are not turned into items, so two store products of one art
  name the closest alone
- **Open scanner** - `HostedApp.tsx` loads its collections once
  (`HostedApp.tsx:233-261`) and again only after an enrolled photo
- **Catalogue first** - the scanner ranks a collection's photo hit and a
  shared-catalogue hit on raw score, so a catalogue card can win over a store
  product of the same art (`docs/PLATFORM.md` § How a scan works)
- **Store** - the catalogue keeper (`durables/CatalogKeeper/`) publishes the
  store's copy of the shop's published catalogue with a version;
  `CRON_PASSES` run side by side every 5 minutes
  (`packages/grade10-store/backend/src/entrypoint.ts:71-82`,
  `apps/backend/grade10/store/wrangler.jsonc:20`), the catalogue walk among
  them
- **Slab facts** - inventory items hold grader, grade, cert and the house
  label code (`packages/inventory/backend/src/db/schema/items.ts`). The store
  knows a consigned product's item through `consigned_products.itemId`; it
  binds inventory only for item photos (`StoreItemPhotos`), and a house-stock
  product names no item at all
- **Graders** - inventory registers PSA, BGS, CGC, SGC, TAG, PCGS, NGC and PMG
  with certs up to 64 characters; the scanner takes PSA, BGS, CGC, SGC and TAG
  and a cert of 4-24 letters, digits or `-`, refusing the whole item otherwise
  (`routes.ts:412-451`)
- **Price and one item** - the product page prices `pricedVariant` (first
  variant for sale, else first listed) and lowers it by `siteSaleOf`; both
  live in `store-frontend`
  (`features/products/product/domain/models/Product.ts:146-155`,
  `features/products/catalog/domain/models/SiteDiscount.ts:52-80`), where no
  backend can import them
- **Which lanes carry the store** - the gate table sits in the site app
  (`apps/frontend/grade10/src/surfaces.ts:390-451`), which no package may
  import

## Goals / Non-Goals

**Goals:**

- One stateless pass in the store that makes the scanner's `store`
  collection equal to the keeper's copy, writing only what moved
- A scanner that treats an unchanged item as no write, so the pass can send
  every product every tick
- Slab facts read fresh from inventory each pass, with no copy kept in the
  store
- Photos every two hours on both environments, processed with the scanner's own model

**Non-Goals:**

- A live-details endpoint (`settings.live`); the copy carries price and
  availability
- A store table for scanner state; the scanner's own rows are the record
- The box detector, enrol-from-the-link and ZZZ (decisions Non-Goals)

## Decisions

[Shelf Scanning](specs/grade10-site/store/shelf-scanning/spec.md) governs
what the scanner holds and shows. This section records where each part lands.

### Store pass

- **One more cron pass** - `shelfScan` in `CRON_PASSES`, run beside the
  others so a scanner outage never holds the reconcile or the walk. Silent
  (`undefined`) where `SCANNER` is unbound: zzz, staging-2, UAT and dev.
  Rejected: running inside the catalogue walk, which ties a scanner fault to
  the listing's net
- **Follows the copy, not the walk** - reads `storeKeeper(env).sync(null)`.
  Both bounds run from the shop's save (Q35): a tick every 5 minutes, the
  report's seconds into the copy, and a pass held to its 60-second budget.
  A reported change waits at most one tick and one pass (≤ 6 minutes); a
  change only the walk finds waits for the walk's tick, then the next tick
  and pass (≤ 11 minutes). An open scanner's 2-minute refresh adds 2 (≤ 8
  and ≤ 13, Q26); a discount that starts or ends waits one tick and pass
  (≤ 6)
- **Version 0 writes nothing** - a keeper that has never walked answers an
  empty copy; the pass returns `{ skipped: "unwalked" }` rather than delete
  every item
- **Stateless diff** - the pass sends every held product each tick and lets
  the scanner skip unchanged ones (below); it lists the collection's ids and
  deletes those the copy no longer holds. No store row records what was sent.
  Rejected: a store-side record of what was sent, a second copy of the
  scanner's rows
- **Discounts move every item** - a discount that starts or ends changes no
  product, but the pass prices every product on every tick, so the new price
  and badge reach the scanner at the next pass. The pass reads the shop's
  discounts fresh, past the listing's 60-second memo (`readSiteDiscounts`
  with `{ fresh: true }`, `services/catalog/siteDiscounts.ts`), so a discount
  made just before a tick is not a minute late. A shop that does not answer
  fails the pass before it writes, as inventory does, rather than pricing
  every item without its discount
- **Budget** - items go 100 per `putItems` call, each call under a 15-second
  deadline, the pass under 60 seconds (`beforeDeadline`). Upserts run before
  deletes. Work left at the budget is done at the next tick, and the pass
  reports `partial`
- **Inventory first** - the pass reads slab facts before it writes, in calls
  of at most 500 item ids and label codes together, inside the pass's budget.
  An inventory fault on any call fails the pass with nothing written, so a
  slab never loses its cert for one tick and regains it the next

### Product to item

| Item field | Value |
| --- | --- |
| id | `shopify-<numeric product id>` (`numericIdOf`) |
| collection | `store` |
| kind | `comic` for Collectible Type `graded-magazine`, `graded-manga`; `slab` for any other graded product (below); `sealed` for `sealed-*`, `blister-pack`; `other` otherwise |
| title | the product's title as the keeper holds it: the store's default language |
| data.price | the one item's price lowered by `siteSaleOf`: what the shopper pays |
| data.badges | `["Sale"]` while `siteSaleOf` lowers the price, else absent |
| data.stock | `Available` when any variant is for sale, else `Sold out` |
| data.url | the store page, only where the store gate is open and the URL is `https` |
| data.grade | the unit's grade as inventory holds it, only for a slab with a known unit |
| grader, cert | only for a slab with a known unit |
| images | the product's image URLs, first 8, in the shop's order |

- **Held** - every product in the copy except `isGiftCard`
- **Graded** - consigned (a row in `consigned_products`): its item is one
  `slabsOf` answers, which it does only for a live item with a grader;
  inventory decides, whatever the Collectible Type (Q38). Any other consigned
  product is a raw card: held by its photos, no reason counted. House stock:
  Collectible Type `graded-*`. The consigned push sets no collectible type,
  so a consigned slab is `slab` through its item alone
- **Shared pricing** - `sellableVariant`, `pricedVariant` and `siteSaleOf`
  move from `store-frontend` into `@grade10/store-contracts`, beside
  `strikeableCompareAt`; the product page and the pass call the same code.
  Discounts are read with `readSiteDiscounts`, as the listing reads them
- **Store gate** - `GATES` and `gatesFor` move from
  `apps/frontend/grade10/src/surfaces.ts` into `@grade10/app-env`
  (`siteGates`); `surfaces.ts` imports them. Opening the store stays one
  line, and the pass reads `siteGates(deployEnv).store`. Rejected: a store
  config flag, a second line to change at launch
- **Store page** - `consignedProductUrl` becomes `storeProductUrl` and serves
  both callers

### Slab facts

- **Which item** - consigned: `consigned_products.itemId` by product id.
  House stock: a new product metafield `custom.slab_label_code`
  (`single_line_text_field`, validated `^[2-9A-HJKMNP-Z]{6}$`, the label
  alphabet in `@grade10/utils/reference`), added to the catalogue query's
  identifiers. It must be `PUBLIC_READ`, because the keeper reads the
  storefront API. `CATALOG_BODY_SHAPE` goes to 2, so every keeper rewrites
  its copy with the field on first read
- **One query per call** - a new inventory entrypoint, `StoreItemSlabs`,
  bound to the store as `INVENTORY_SLABS`, answers
  `slabsOf({ itemIds, labelCodes })` for live items with a grader in one
  query, at most 500 together; the pass splits larger reads. It returns label facts only: no owner, no price.
  Rejected: adding the slab to the consigned push, which leaves an inventory
  correction behind and covers no house stock
- **No known unit** - the product is held with its photos and no
  grader or cert, and counted by reason:

| Reason | When |
| --- | --- |
| `no_item` | house stock, graded, and names no label code, or one inventory does not hold live |
| `grader` | the item's grader is PCGS, NGC or PMG |
| `duplicate` | two products name one item, or one grader and cert |
| `cert` | the grader is read, and the cert is not 4-24 letters, digits or `-` (Q37) |

### Scanner

- **No-op upsert** - `upsertItem` reads only `seq, collection_id` of the
  stored row today (`worker/platform/routes.ts:470-474`); its `SELECT` widens
  to `kind, title, data, card_id, grader, cert`, and `setImageUrls` already
  reads the stored photo sources. It compares the incoming item with
  them - collection, kind, title, `data` as canonical JSON (sorted keys),
  card, grader, cert, and the set of image URLs - and writes nothing when
  all are equal. The batch route collects the collections it changed and
  touches each once. `PUT /items/:id` runs the same path. Rejected: a stored
  hash column, a second record of fields the row already holds
- **Answers as values** - the binding's methods answer
  `{ outcome: "ok", … } | { outcome: "refused", status, reason }`;
  `ScannerError` goes. A fault (a `5xx`, a missing project prop) still throws
- **Idempotent delete** - deleting an unknown id answers `200` with
  `existed: false`, over HTTP and the binding
- **Contracts** - `packages/tcg-ar/contracts` (`@grade10/tcg-ar-contracts`)
  holds `ItemInput`, `ItemData`, `ItemKind`, `GRADERS`, the result union,
  `ScannerPlatformApi` and `scannerService(binding)`, which answers
  `undefined` for an unbound environment. `ScannerPlatform` `implements` the
  API; the app's `src/shared/platform.ts` imports these rather than declaring
  them
- **The pick** - a photo match whose `alternatives` hold other items of the
  store's collection within the scanner's alternative-print window
  (`alternativePrints`, `MATCH.altWindow` and `altRel`, `src/recog/match.ts`)
  resolves to every such item, slabs among them, closest first: `resolve`
  gains `{ how: "photos", items }`, and one close item stays
  `{ how: "photo", item }`. Each alternative maps to its item through
  `bySeq`, as the top hit does. The hosted page draws the `<n> matches` chip
  and the pick sheet in `ui-design.md`. A label read stays `how: "cert"`, one
  slab, never a pick
- **Grade and cert on a label read only** - the hosted label shows the
  item's `<grader> <grade>` and `Cert <cert>` only when the match came from the
  label (`how: "cert"`). A photo match names the product without them, so a
  raw copy of a card sold only as one slab names the slab's product bare, and
  a pick that holds a slab shows it bare too
- **Store first** - in the identify step, after `routeByLanguage`
  (`src/app/engine/recog.worker.ts:577`), a collection hit that clears the
  scanner's accept threshold (`MATCH`, `src/recog/match.ts`) ranks above
  every catalogue hit. A weaker collection hit keeps its score order
- **Open scanner** - `HostedApp` calls `refresh()` every 2 minutes while the
  page is visible and on `visibilitychange` to visible. A collection whose
  files' version has not moved is not downloaded again
- **Project** - migration `0005` inserts `grade10` into `projects` with
  `INSERT OR IGNORE`, its games and brand set, no keys. The binding needs no
  key; the operator mints the link's public key with
  `POST /v1/admin/projects/grade10/keys`
- **Photo retry** - the queue also serves a `failed` photo whose
  `updated_at` is 24 hours old as `need: process`; a new failure stamps it
  again
- **Model guard** - `POST /admin/queue/:seq/:n` answers `409` for an
  embedding from another model rather than dropping it, and the processor
  exits non-zero, naming both models, when the queue's `model` differs from
  its own. Rejected: running the processor at the commit `/health` reports,
  an extra resolve and checkout that hides a mismatch rather than reporting it

### Operations

- **Every two hours on both** - the `photos` job's schedule runs a matrix over
  `staging` and `production`; a dispatch runs the one chosen. An empty probe
  stops before install. Between a model release on `main` and its deploy the
  run fails loudly and learns nothing
- **Secrets** - production's GitHub environment gains `TCG_AR_ADMIN_TOKEN`,
  the plaintext of production's `ADMIN_TOKEN_SHA256`
- **Access** - a Bypass for `/scan/*` on `grade10-stg.com` and on the
  production site host, replacing today's `/scan/v1/*`
- **The link** - `<scannerUrl>/hosted#key=<pk>&collections=store`, one per
  environment. Rotation mints a key and revokes the old
  (`DELETE /v1/admin/keys/:id`)

### Observability

| Metric | Type | Tags | Answers |
| --- | --- | --- | --- |
| `store.shelf_scan.pass` | count | `outcome:ok\|partial\|failed` | the pass runs, and how often it fails |
| `store.shelf_scan.products` | gauge | `state:in_step\|refused\|pending` | the share of held products in step: the PRD's measurement |
| `store.shelf_scan.unit_missing` | gauge | `reason:no_item\|grader\|duplicate\|cert` | slabs held without a unit |

- **Monitors** - `unit_missing > 0` for 30 minutes alerts Operations; no
  `outcome:ok` for 30 minutes, or `refused > 0`, alerts the store's owners.
  Committed under `docs/observability/datadog/monitors/`
- **Log line** - the cron's summary carries the pass's counts; each product
  without a unit or refused is logged once per pass with its id and reason
- **Photos** - a failed run is the workflow's own failure

## Service Interfaces

### Store: `runShelfScan(env, runtime)`

| | Shape |
| --- | --- |
| Input | the env; `SCANNER`, `CATALOG_KEEPER`, `INVENTORY_SLABS`, the store DB |
| Success | `{ products, written, unchanged, deleted, refused, unitMissing, outcome: "ok" \| "partial" }` |
| Skip | `undefined` unbound; `{ skipped: "unwalked" }` |
| Fault | throws: inventory unreachable or refusing, keeper unreachable, a scanner fault |

Order, each step reading what the last returned:

1. `keeper.sync(null)` → the copy
2. `consigned_products` rows for the copy's product ids → item ids
3. `INVENTORY_SLABS.slabsOf` per 500 item ids and label codes → facts by
   item id and label code
4. `readSiteDiscounts({ fresh: true })` → the shop's automatics
5. `shelfItemsOf(copy, refs, facts, discounts, storePage)` - pure, in
   `services/shelfScan/items.ts` → items and units missing
6. `SCANNER.putCollection("store")`, then `putItems` per 100
7. `SCANNER.listItems({ collection: "store" })` per 500 → ids
8. `SCANNER.deleteItem` for each id not in the copy

No store write; nothing to make atomic. Example:

```json
// copy: one consigned slab, one sold-out booster box, one gift card
{ "id": "gid://shopify/Product/8812", "title": "Pikachu Illustrator", "isGiftCard": false,
  "variants": [{ "availableForSale": true, "price": { "amountMinor": 120000, "currencyCode": "HKD" } }] }
{ "id": "gid://shopify/Product/9001", "title": "Scarlet & Violet 151 Booster Box",
  "variants": [{ "availableForSale": false, "price": { "amountMinor": 98000, "currencyCode": "HKD" } }] }
{ "id": "gid://shopify/Product/9100", "isGiftCard": true }
// consigned_products: 8812 → item it_7Q; slabsOf: it_7Q → PSA, "10", "126956765"
// 8812 carries no collectible type: slabsOf answering it_7Q makes it a slab
// putItems:
[{ "id": "shopify-8812", "collection": "store", "title": "Pikachu Illustrator", "kind": "slab",
   "grader": "PSA", "cert": "126956765", "images": ["https://cdn.shopify.com/…/front.jpg?v=1"],
   "data": { "price": { "amountMinor": 120000, "currencyCode": "HKD" }, "stock": "Available",
             "grade": "10",
             "url": "https://grade10-stg.com/store/products/pikachu-illustrator" } },
 { "id": "shopify-9001", "collection": "store", "title": "Scarlet & Violet 151 Booster Box",
   "kind": "sealed", "images": ["https://cdn.shopify.com/…/box.jpg?v=3"],
   "data": { "price": { "amountMinor": 98000, "currencyCode": "HKD" }, "stock": "Sold out",
             "url": "https://grade10-stg.com/store/products/sv-151-booster-box" } }]
// answer, second tick with nothing moved:
{ "outcome": "ok", "upserted": 0, "unchanged": 2, "errors": [] }
```

### Inventory: `StoreItemSlabs.slabsOf`

| | Shape |
| --- | --- |
| Input | `{ itemIds: string[]; labelCodes: string[] }`, at most 500 together |
| Success | `{ items: { itemId, labelCode, grader, grade, cert }[] }` for live items with a slab |
| Refusal | `{ outcome: "refused", reason: "too_many" }` |

One `SELECT` over `items` where `retired_at IS NULL AND grader IS NOT NULL`
and the id or label code matches. Read-only.

### Scanner: `ScannerPlatform`

| Method | Success | Refusal |
| --- | --- | --- |
| `putItems(items)` | `{ outcome: "ok", upserted, unchanged, errors: { id, error }[] }` | `{ outcome: "refused", status: 400, reason }` for a malformed batch |
| `listItems({ collection, after, limit })` | `{ outcome: "ok", items, next }` | - |
| `deleteItem(id)` | `{ outcome: "ok", existed }` | - |
| `putCollection(id, name)` | `{ outcome: "ok", id, name }` | `{ outcome: "refused", status: 400, reason }` |

`putItems` mutation order, per item: the existing reads of its row and photo
sources; when anything differs, the existing upsert and image statements;
then, per batch, one touch per changed collection.
An item's own write is the atomic unit, as today; a batch that stops part-way
leaves written items written, and the next tick sends the rest.

### Photo processor

| Step | Answer |
| --- | --- |
| `GET /v1/admin/queue` | `{ model, jobs: [{ seq, n, kind, need, src \| file \| crop }] }`, `failed` photos 24 hours old included |
| `model` ≠ processor's | exit 1, nothing posted |
| `POST /v1/admin/queue/:seq/:n` with another model's embedding | `409 { error: "model <n>: the scanner runs <m>" }` |
| A photo with no card-shaped find (a box, comic or merch shot) | learned from the whole photo, as today (`scripts/process-photos.ts:143,272`); never failed for it |

## API Contracts

- **Binding results** - every `ScannerPlatform` method answers the result
  union above instead of throwing `ScannerError`. No caller exists yet
- **`putItems` answer** - gains `unchanged`
- **`DELETE /v1/items/:id`** - an unknown id is `200 { deleted, existed: false }`
- **`POST /v1/admin/queue/:seq/:n`** - `409` for a mismatched model
- **`StoreItemSlabs`** - new entrypoint; its types in
  `@grade10/inventory-contracts/items`, with `getStoreSlabsService()`

## Database Schema

Scanner D1 only; no Postgres change.

| Table | Change |
| --- | --- |
| `projects` | row `grade10`, inserted if absent, settings `{"games":["pokemon","pokemon-jp","onepiece","lorcana","weiss"],"brand":{"name":"grade10"}}` |

No column changes: `item_images` keeps its columns, and a retry reads
`state` and `updated_at`.

## Risks / Trade-offs

- [A product replaces a photo] → the old photo's vectors go at once and the
  new one is learned at the next photo run; the item is recognised by its other
  photos, or its cert, meanwhile
- [The shop does not answer the discount read] → the pass fails before it
  writes, so every shelf change waits, availability included, until the shop
  answers; the pass monitor alerts. Rejected: writing without discounts, which
  shows a sale item at its full price as fact
- [The keeper's copy is empty after a fault] → version 0 writes nothing; a
  walk that fails keeps the last copy
- [A bulk import of hundreds of products] → 100 per call under the 60-second
  budget, the rest at the next tick, reported `partial`
- [A house label code is public on the storefront] → it names an item only
  through the store's inventory binding; it carries no grade, cert or owner
- [Inventory down] → the pass fails before writing, the monitor alerts, and
  the scanner keeps its last state
- [Two store deploys bind one scanner project] → only staging and production
  bind, one store each
- [A shared catalogue card scores above a store photo] → the store product
  wins only when its own hit clears the accept threshold, so a weak store
  photo never takes a name from the catalogue

## Migration Plan

1. **Scanner** - contracts package, migration `0005` (the project), no-op
   upsert, results, delete, ranking, refresh, queue retry and model guard.
   Deploy staging, migrate, then production after its D1 Time Travel bookmark
2. **Inventory** - `StoreItemSlabs` entrypoint; deploy staging, production
3. **Store** - shared pricing and gates moves, `custom.slab_label_code`
   definition pushed with `pnpm run shopify:custom-data`, query and shape bump,
   the pass, `SCANNER` and `INVENTORY_SLABS` bindings on staging and
   production. The scanner and inventory entrypoints must exist first
4. **Operations** - Access Bypass `/scan/*`, production
   `TCG_AR_ADMIN_TOKEN`, the photos matrix, monitors, then the public key and
   the printed link
5. **Docs** - `docs/architecture/commerce.md` and `multi-product.md` name the
   two bindings; `apps/backend/grade10/tcg-ar/docs/PLATFORM.md` moves the sync
   to the store and drops "not created yet"

Rollback: remove the store's `SCANNER` binding and redeploy; the pass is
silent and the scanner keeps its last items. The migration's column and row
stay.

The pass builds on code already on grade10's `main`, not on another open
change: the keeper's webhook path (`routes/webhooks.ts`, `handToKeeper`) and
its 5-minute walk (`services/catalog/pass.ts`, `runCatalogWalk` in
`sweeps/cron.ts`); the one-item rule (`sellableVariant`, `pricedVariant`,
`productSummary` in `store-frontend`'s `features/products/product`); and the
shop's automatics (`readSiteDiscounts`, `readSitePricing`,
`services/catalog/siteDiscounts.ts`).
