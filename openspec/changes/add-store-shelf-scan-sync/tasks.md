## 1. Shelf scanning manual (grade10-spec)

- [ ] 1.1 Update `docs/prds/products/grade10-site/store/shelf-scanning.md`'s code map: the store's pass (`packages/grade10-store/backend/src/services/shelfScan/`), the scanner's contracts (`packages/tcg-ar/contracts`), inventory's `StoreItemSlabs`; and `docs/prds/products/grade10-site/site/carried-surfaces.md`'s code map for the lane table's move to `@grade10/app-env`. `add-store-locator` also edits the carried-surfaces page: land this code-map line after it, or rebase onto it
- [ ] 1.2 Verify: `pnpm check:manual`

## 2. Scanner platform (grade10) (owner: @ecchochan)

- [ ] 2.1 Tests, in their own commit before the code: an upsert whose fields, `data` and image URLs equal the stored ones writes nothing and touches no collection, a changed one writes once, a batch touches each collection once, an unknown delete answers `existed: false`, binding methods answer refusals as values, a failed photo returns to the queue after 24 hours, a mismatched model's result is `409`, replaced and dropped image URLs (`g10.store-shelf-scanning.SC7`, `g10.store-shelf-scanning.SC22`, `g10.store-shelf-scanning.SC23`, `g10.store-shelf-scanning.SC24`)
- [ ] 2.2 Add `packages/tcg-ar/contracts` (`@grade10/tcg-ar-contracts`): `ItemInput`, `ItemData`, `ItemKind`, `GRADERS`, the result union, `ScannerPlatformApi`, `scannerService`; `src/shared/platform.ts` imports them and `ScannerPlatform` implements the API
- [ ] 2.3 Migration `0005`: the `grade10` project inserted if absent
- [ ] 2.4 Widen `upsertItem`'s `SELECT` to the stored row's fields, compare the incoming item with them and the stored photo sources, and skip an equal one; touch each collection once per batch, answer `unchanged`; make delete idempotent; return binding results as values and remove `ScannerError` (`g10.store-shelf-scanning.SC7`)
- [ ] 2.5 Serve `failed` photos 24 hours old as `need: process`; answer `409` for an embedding from another model; stop the processor when the queue's model differs from its own (`g10.store-shelf-scanning.SC22`, `g10.store-shelf-scanning.SC23`, `g10.store-shelf-scanning.SC24`)
- [ ] 2.6 Verify: `pnpm --dir apps/backend/grade10/tcg-ar test`, the contracts package's typecheck, `pnpm run check:libs`

## 3. Scanner on the shelf (grade10) (owner: @ecchochan)

- [ ] 3.1 Tests, in their own commit before the code: a collection hit clearing the accept threshold ranks above a stronger catalogue hit and a weaker one does not; close store matches resolve to every item closest first, slabs included, one match to one, a label read to its one slab for each grader in `GRADERS`; the pick sheet lists, picks and dismisses, keeps its content when the item leaves view, and an embedded page gets every match; grade and cert chips show only on a label read; the hosted page reads its catalogue again after 2 minutes in view and on return; a public key cannot add a photo; a revoked key's link reports it has expired; an unrecognised sealed box shows "Not recognised yet — hold steady" (`g10.store-shelf-scanning.SC17`, `g10.store-shelf-scanning.SC19`, `g10.store-shelf-scanning.SC29`, `g10.store-shelf-scanning.SC31`, `g10.store-shelf-scanning.SC32`, `g10.store-shelf-scanning.SC35`, `g10.store-shelf-scanning.SC36`, `g10.store-shelf-scanning.SC37`, `g10.store-shelf-scanning.SC38`, `g10.store-shelf-scanning.SC39`, `g10.store-shelf-scanning.SC41`, `g10.store-shelf-scanning.SC42`, `g10.store-shelf-scanning.SC43`, `g10.store-shelf-scanning.SC46`)
- [ ] 3.2 Rank an accepted collection hit first after `routeByLanguage` (`g10.store-shelf-scanning.SC17`)
- [ ] 3.3 Refresh the hosted page's collections every 2 minutes while visible and on returning to it, downloading only files whose version moved, so an open scanner shows a change within 8 or 13 minutes of the save (`g10.store-shelf-scanning.SC29`, `g10.store-shelf-scanning.SC8`, `g10.store-shelf-scanning.SC9`)
- [ ] 3.4 Resolve a photo match with close store alternatives to every such item, slab or not, closest first, and draw the `<n> matches` chip and the pick sheet in `ui-design.md` (`g10.store-shelf-scanning.SC35`, `g10.store-shelf-scanning.SC36`, `g10.store-shelf-scanning.SC37`, `g10.store-shelf-scanning.SC38`, `g10.store-shelf-scanning.SC41`, `g10.store-shelf-scanning.SC42`)
- [ ] 3.5 Show an item's grade and cert chips only on a label read, from `grader`, `data.grade` and `cert` (`g10.store-shelf-scanning.SC39`, `g10.store-shelf-scanning.SC43`)
- [ ] 3.6 Verify: `pnpm --dir apps/backend/grade10/tcg-ar test` and `test:e2e`

## 4. Inventory slab facts (grade10)

- [ ] 4.1 Tests, in their own commit before the code: `slabsOf` answers live slabs by item id and by label code, leaves out retired and slab-less items and unknown ids, refuses more than 500, and returns no owner or price
- [ ] 4.2 Add `StoreItemSlabs` and its types and `getStoreSlabsService()` to `@grade10/inventory-contracts/items`; export the entrypoint from `apps/backend/grade10/inventory`
- [ ] 4.3 Verify: the inventory backend's tests and typecheck

## 5. Shared store pricing and lanes (grade10)

- [ ] 5.1 Tests, in their own commit before the code: the moved `pricedVariant`, `sellableVariant` and `siteSaleOf` answer as before from `@grade10/store-contracts`; `readSiteDiscounts({ fresh: true })` reads the shop past the memo and answers a failed read as a failure; `siteGates` answers each lane's table from `@grade10/app-env`
- [ ] 5.2 Move `sellableVariant`, `pricedVariant` and `siteSaleOf` into `@grade10/store-contracts`; `store-frontend` imports them
- [ ] 5.3 Give `readSiteDiscounts` a `fresh` option that skips the memo and answers a read the shop did not answer as a failure (`g10.store-shelf-scanning.SC33`)
- [ ] 5.4 Move the lane table and `gatesFor` into `@grade10/app-env` as `siteGates`; `apps/frontend/grade10/src/surfaces.ts` imports it
- [ ] 5.5 Verify: store-frontend and grade10 site tests, `pnpm --dir apps/frontend/grade10 run typecheck`

## 6. Store shelf pass (grade10)

Needs groups 2, 4 and 5 landed.

- [ ] 6.1 Tests, in their own commit before the code: the mapping from a copy to items, gift cards, sold out, dropped and archived products, the title in the store's default language, one item and its store page through a changed handle, store page by lane and scheme, site price on the one item, no count and no field the store keeps private, consigned and label-code units, a consigned raw card held as a raw card with no reason counted, `kind: slab` for a consigned item `slabsOf` answers, a changed label code, a corrected grade, each grader the scanner reads, each no-unit reason with a label code no item carries among them, duplicate units, the `unit_missing` gauge back at 0 once none is held, every kind held; the pass against a fake scanner for unwalked copies, budgets, slab facts read per 500, a discount read the shop does not answer failing the pass before any write, put-back and deletes; the `Sale` badge, a discount that starts or ends, a cert the scanner cannot read, the first 8 photos; the cron list holding `shelfScan` (`g10.store-shelf-scanning.SC33`, `g10.store-shelf-scanning.SC34`, `g10.store-shelf-scanning.SC40`, `g10.store-shelf-scanning.SC1`, `g10.store-shelf-scanning.SC2`, `g10.store-shelf-scanning.SC3`, `g10.store-shelf-scanning.SC4`, `g10.store-shelf-scanning.SC5`, `g10.store-shelf-scanning.SC6`, `g10.store-shelf-scanning.SC8`, `g10.store-shelf-scanning.SC9`, `g10.store-shelf-scanning.SC10`, `g10.store-shelf-scanning.SC11`, `g10.store-shelf-scanning.SC12`, `g10.store-shelf-scanning.SC13`, `g10.store-shelf-scanning.SC14`, `g10.store-shelf-scanning.SC51`, `g10.store-shelf-scanning.SC15`, `g10.store-shelf-scanning.SC16`, `g10.store-shelf-scanning.SC18`, `g10.store-shelf-scanning.SC25`, `g10.store-shelf-scanning.SC26`, `g10.store-shelf-scanning.SC27`, `g10.store-shelf-scanning.SC28`, `g10.store-shelf-scanning.SC44`, `g10.store-shelf-scanning.SC45`, `g10.store-shelf-scanning.SC46`, `g10.store-shelf-scanning.SC47`, `g10.store-shelf-scanning.SC48`, `g10.store-shelf-scanning.SC49`, `g10.store-shelf-scanning.SC50`)
- [ ] 6.2 Add the `custom.slab_label_code` product metafield to `packages/grade10-store/custom-data/grade10/metafields/product.json`, regenerate, add it to the catalogue query, and raise `CATALOG_BODY_SHAPE` to 2 (`g10.store-shelf-scanning.SC12`)
- [ ] 6.3 Write `shelfItemsOf` in `services/shelfScan/items.ts`: products to items, the graded rule (consigned: its item `slabsOf` answers, whatever its type; house stock: a graded collectible type) and `kind` from it, units from consigned rows and label codes, no-unit reasons, `Sale` badge, `data.grade`, first 8 photos (`g10.store-shelf-scanning.SC33`, `g10.store-shelf-scanning.SC34`, `g10.store-shelf-scanning.SC40`, `g10.store-shelf-scanning.SC1`, `g10.store-shelf-scanning.SC2`, `g10.store-shelf-scanning.SC3`, `g10.store-shelf-scanning.SC10`, `g10.store-shelf-scanning.SC11`, `g10.store-shelf-scanning.SC12`, `g10.store-shelf-scanning.SC13`, `g10.store-shelf-scanning.SC14`, `g10.store-shelf-scanning.SC51`, `g10.store-shelf-scanning.SC15`, `g10.store-shelf-scanning.SC16`, `g10.store-shelf-scanning.SC18`, `g10.store-shelf-scanning.SC25`, `g10.store-shelf-scanning.SC26`, `g10.store-shelf-scanning.SC27`, `g10.store-shelf-scanning.SC28`, `g10.store-shelf-scanning.SC44`, `g10.store-shelf-scanning.SC45`, `g10.store-shelf-scanning.SC46`, `g10.store-shelf-scanning.SC47`, `g10.store-shelf-scanning.SC48`, `g10.store-shelf-scanning.SC50`)
- [ ] 6.4 Write `runShelfScan` in `services/shelfScan/pass.ts` and add `shelfScan` to `CRON_PASSES`: copy, slab facts per 500, a fresh discount read, upserts per 100, then deletes, inside its 60-second budget so a reported change lands within 6 minutes of the save and one only the walk finds within 11; its metrics and log lines (`g10.store-shelf-scanning.SC4`, `g10.store-shelf-scanning.SC5`, `g10.store-shelf-scanning.SC6`, `g10.store-shelf-scanning.SC8`, `g10.store-shelf-scanning.SC9`)
- [ ] 6.5 Bind `SCANNER` (`grade10-tcg-ar-<env>`, `ScannerPlatform`, `props.project: "grade10"`) and `INVENTORY_SLABS` (`StoreItemSlabs`) on staging and production in `apps/backend/grade10/store/wrangler.jsonc`; rename `consignedProductUrl` to `storeProductUrl`
- [ ] 6.6 Verify: the store backend's node and workers tests, `pnpm --filter @grade10/store-service typecheck`, `pnpm run check:libs`

## 7. Operations (grade10)

Needs groups 2 and 6 deployed to the environment it acts on.

- [ ] 7.1 Tests, in their own commit before the code: `tcg-ar-ops.yml`'s photos schedule runs staging and production, and stops after an empty probe (`g10.store-shelf-scanning.SC20`, `g10.store-shelf-scanning.SC21`)
- [ ] 7.2 Make the photos job's schedule a matrix over staging and production (`g10.store-shelf-scanning.SC20`, `g10.store-shelf-scanning.SC21`)
- [ ] 7.3 Add monitors for `store.shelf_scan.unit_missing`, `store.shelf_scan.pass` and refused products under `docs/observability/datadog/monitors/`, and list them in `docs/operations.md`; `unit_missing` clears once a pass reports none held (`g10.store-shelf-scanning.SC49`)
- [ ] 7.4 Update `docs/architecture/commerce.md`, `docs/architecture/multi-product.md`, `docs/deployment.md` (Bypass `/scan/*`) and `apps/backend/grade10/tcg-ar/docs/PLATFORM.md` (the sync is the store's; the project is seeded)
- [ ] 7.5 On staging, then production: apply migration `0005`, set the Access Bypass for `/scan/*`, set production's `TCG_AR_ADMIN_TOKEN`, mint the public key, and record the shop's link
- [ ] 7.6 Verify: the ops workflow test, the monitors applied with `/datadog-monitors`, a dispatched photos run on each environment

## 8. The walk (grade10)

Uses draft `feature-tcs.md` as its planning input, and groups 2 to 7 landed and deployed to staging.

- [ ] 8.1 Walk each journey on staging through the shop's link on a phone outside Access, kept as the change's end-to-end suite: a product published in the staging shop reaches the scanner, its photo is learned by the hourly run, and a scan shows its title, price, availability and store page; a sold-out product reads Sold out; two listings of one card are both shown and one is picked; a discounted product shows its Sale badge; a consigned slab and a house-stock slab with its label code are each named as their own product by cert, with grade and cert; a rotated key retires the link (`g10.store-shelf-scanning.SC30`, `g10.store-shelf-scanning.US1`, `g10.store-shelf-scanning.US2`, `g10.store-shelf-scanning.US3`, `g10.store-shelf-scanning.US4`, `g10.store-shelf-scanning.US6`, `g10.store-shelf-scanning.US7`)
- [ ] 8.2 Extend the scanner's `e2e/` with the store's item shape, seeded through the binding's API: a product photo learned by the processor is named with its title and price, and a slab clip resolves its unit by cert, as the routine guardrail
- [ ] 8.3 Flip the cases the walks decide with `pnpm run tcs:automated <case…> --decided-by grade10:<walk path>`, in the walks' own commit; the ones that stay manual are named in the suite and in the walk's `rounds.md` row
- [ ] 8.4 Verify: `pnpm --dir apps/backend/grade10/tcg-ar run test:e2e`, the staging walk's record
