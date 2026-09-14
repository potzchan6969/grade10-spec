# Tasks

Group 1 is the manual, in **grade10-spec**. Group 2 is the contract every
other group reads. Groups 3, 4 and 5 need group 2 and are otherwise parallel;
group 6 needs all of them.

How the keeper applies, publishes and is followed:
[`tech-design.md`](tech-design.md) — Decisions.

## 1. The manual (grade10-spec)

- [ ] 1.1 Say on `docs/prds/products/grade10-site/store/product-listing.md` and `docs/prds/products/grade10-site/commerce/commerce.md` that the listing follows the shop within seconds and answers while the shop is unreachable, with the flow and its chart on Commerce, and the mechanism on `docs/references/store-catalogue-index.md`
- [ ] 1.2 Verify: `pnpm check:manual`, `pnpm run tcs:validate`, `pnpm run diagrams:check`, `pnpm run lint`

## 2. The card contract and the Shopify port (grade10)

- [ ] 2.1 Add `CatalogCard` to `packages/shopify/contracts` with `Product` extending it, and page cards in the store contracts' `productsPageSchema`, so a card carries what the listing draws and nothing more (`SC-44`)
- [ ] 2.2 Carry the card's fields on the catalogue walk and read one product back by id in `packages/shopify/backend`; drop the read of products by ids with its query, codecs, mappers and fixture, and give the fixture catalogue the read by id
- [ ] 2.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 3. The keeper (grade10)

Needs group 2's contract.

- [ ] 3.1 Add the keeper object with its three tables, `apply`, the alarm's read-back with the freshness guard and its retry ladder, and one publish per burst numbered by content, so *A read older than the report is not published* (`SC-46`) holds and a burst publishes once
- [ ] 3.2 Add `walk()` replacing every row from the whole read in one transaction, refusing past Shopify's page limit, so *A change the shop never reported is caught by the re-read* (`SC-45`) holds
- [ ] 3.3 Add `sync(known)` answering the version, and the body only when it differs
- [ ] 3.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`

## 4. The worker (grade10)

Needs group 2's contract; the fixture catalogue stands in for group 3.

- [ ] 4.1 Hand `products/*` and `inventory_levels/*` deliveries to the keeper from the webhook route after verification, answering Shopify with the keeper's outcome, so *A published product is listed within seconds* (`SC-42`), *A product taken down leaves within seconds* (`SC-43`) and *A card follows the shop's price and stock* (`SC-44`) are reached by the shop's own report
- [ ] 4.2 Add the `catalog` cron pass calling `walk()` every tick and throwing on anything but `ok` (`SC-45`)
- [ ] 4.3 Make the listing reads follow the keeper from isolate memory — sync when the last check is 5 seconds old, answer from memory when the keeper cannot answer, walk into memory only when nothing is held — and delete the projection's cache tier, its age and cooldown, hydration and the product tiers, so *The listing lists while the shop is down* (`SC-47`) holds
- [ ] 4.4 Declare the keeper in both store workers' `wrangler.jsonc` with its migration and the location hint, and export it from each app's worker
- [ ] 4.5 Rewrite the catalogue section of `docs/architecture/commerce.md` and the layer table of `docs/architecture/edge-cache.md` for the keeper
- [ ] 4.6 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`

## 5. The frontends (grade10)

Needs group 2's contract.

- [ ] 5.1 Narrow the listing item to the card in the store frontend's domain and the listing page, and in the admin frontends' catalogue repositories, with no behaviour change
- [ ] 5.2 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 6. Staging proof and the guardrail (grade10)

Needs every group above.

- [ ] 6.1 Deploy to staging, replay a `products/update` through `/dev/webhooks/shopify`, and read the listing back within 10 seconds from two locations; record seconds-to-listing and the cold and warm answer times on the pull request (`SC-42`, `SC-44`)
- [ ] 6.2 Add an end-to-end test that replays a product event against a running store and asserts the listing within the bound, in the lane the store's end-to-end tests run in
- [ ] 6.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`
