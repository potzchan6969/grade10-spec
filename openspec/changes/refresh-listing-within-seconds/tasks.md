# Tasks

Group 1 is the manual, in **grade10-spec**. Group 2 is the contract every
other group reads. Groups 3 and 4 need group 2; group 4 needs group 3's port
and stands in for its object with the fake until it lands. Group 5 needs all
of them; group 6 needs group 5's numbers.

How the keeper applies, publishes and is followed:
[`tech-design.md`](tech-design.md) — Decisions.

## 1. The manual (grade10-spec)

- [x] 1.1 Say on `docs/prds/products/grade10-site/store/product-listing.md` that the listing follows the shop within seconds, answers at a quiet location and keeps answering while the shop is unreachable, with the flow and its chart; link it from `docs/prds/products/grade10-site/commerce/commerce.md`; record the mechanism on `docs/references/store-catalogue-index.md`
- [x] 1.2 Verify: `pnpm check:manual`, `pnpm run tcs:validate`, `pnpm run diagrams:check`, `pnpm run lint`

## 2. The contract (grade10)

- [ ] 2.1 Carry `updatedAt` on the product read and the walk in `packages/shopify/backend` and on `Product` in `packages/shopify/contracts`, with the fixtures, so a read can be told older than a report (`SC-46`)
- [ ] 2.2 Carry the report's `updated_at` out of `parseProductWebhook` as epoch milliseconds, absent on a delete
- [ ] 2.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 3. The keeper (grade10)

Needs group 2.

- [ ] 3.1 Add the keeper's manager over a `KeeperStore` port under `packages/grade10-store/backend/src/durables/CatalogKeeper/`, with an in-memory store for the node lane: `apply` recording a report or removing a deleted product, the read-back in one `getProducts` landing only on the pending row it was read for, the 2 s re-read to the 60 s deadline, and one publish per burst numbered by a counter, so *A read older than the report is not published* (`SC-46`) holds
- [ ] 3.2 Add the walk: every page first, then one transaction writing rows whose text or position moved and deleting what it did not see, refusing past the cursor ceiling, sharing one in-flight walk, and publishing nothing before the first walk, so *A change the shop never reported is caught by the re-read* (`SC-45`) holds
- [ ] 3.3 Add `sync(known)` from memory, answering the version and shape, and the body only when `known` is older; an empty keeper walks itself first (`SC-48`)
- [ ] 3.4 Add the Durable Object class: the SQLite store behind the port, the RPC methods, the alarm handler that catches, re-arms at the earliest due work and never throws, and the one accessor naming `<shop>/v1` with the `apac` hint; export it through `@grade10/store-service/worker`
- [ ] 3.5 Add `CatalogKeeperPort` with its in-memory implementation in `@grade10/store-service/testing`, so the request path and the cron pass are proved without an object
- [ ] 3.6 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend` — the class, its binding, its migration and the alarm run in `apps/backend/grade10/store/test/worker/`, driven by `runDurableObjectAlarm` and `runInDurableObject` from `cloudflare:test`, never by wall-clock time; the rules run in the store package's node lane over the in-memory store

## 4. The worker (grade10)

Needs group 2 and group 3's port.

- [ ] 4.1 Hand `products/*` and `inventory_levels/*` deliveries to `apply` from `shopifyCatalogPurge`, awaited beside the tag purge, answering 200 and counting when the keeper cannot take the event, so *A published product is listed within seconds* (`SC-42`), *A product taken down leaves within seconds* (`SC-43`) and *A card follows the shop's price and stock* (`SC-44`) are reached by the shop's own report
- [ ] 4.2 Add the `catalog` cron pass: silent where no keeper is bound, throwing on `outgrown` and a keeper error, counting a Shopify failure (`SC-45`); move `apps/backend/grade10/store/test/db/cron.spec.ts` from `4 of 7` to `4 of 8`
- [ ] 4.3 Make the listing reads follow the keeper from isolate memory — check every 3 s, `sync` with a 500 ms deadline, memory when the keeper cannot answer, `catalog_unavailable` with nothing held — deriving entries from the whole products it receives, and delete the projection's cache tier, its age and cooldown, hydration and the product tiers, so *The listing lists while the shop is down* (`SC-47`) and *A location holding no copy answers from the one the store keeps* (`SC-48`) hold
- [ ] 4.4 Declare `durable_objects.bindings` in the top-level, `staging` and `production` blocks of both brands' store `wrangler.jsonc`, the `v1` `new_sqlite_classes` migration at the top level, and export the class by name from each app's `src/index.ts`; run `pnpm run cf-typegen` and commit both apps' `worker-configuration.d.ts`
- [ ] 4.5 Teach `scripts/deploy/ship.mjs` the `lifecycle` reason a version cannot be uploaded, shipping that worker whole in the flip as it ships one that does not exist
- [ ] 4.6 Rewrite the catalogue section of `docs/architecture/commerce.md` and the layer table of `docs/architecture/edge-cache.md` for the keeper, and record on `docs/conventions/backend.md` the one Durable Object a deployed worker binds and why
- [ ] 4.7 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`

## 5. Staging proof and the guardrail (grade10)

Needs every group above.

- [ ] 5.1 Deploy to staging through the ordinary dispatch, read the listing from two locations cold and warm, and record the answer times on the pull request (`SC-48`); with a product edited in the staging shop's admin, record seconds from the shop's read to the listing (`SC-42`, `SC-44`)
- [ ] 5.2 Add `apps/frontend/grade10/e2e/tests/catalog-keeper.spec.ts`: replay `products/delete` for a fixture product through `POST /dev/webhooks/shopify` and assert the product leaves the listing within 10 s, then replay `products/update` for it and assert it returns; runs under `pnpm run test:e2e`
- [ ] 5.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`, `pnpm run test:e2e`

## 6. The measured numbers (grade10-spec)

Needs group 5.

- [ ] 6.1 Write the staging figures into `docs/references/store-catalogue-index.md` and clear the ❓ measurement rows there and on `docs/prds/products/grade10-site/store/product-listing.md`
- [ ] 6.2 Verify: `pnpm check:manual`
