# Tasks: Inventory product assets in Auction listings

## 1. Planning records (grade10-spec)

- [ ] 1.1 Verify the Product Assets and Auction Listings PRDs, QA suites, and delivery plan with `pnpm check:manual`, `pnpm run tcs:validate`, and `openspec validate inventory-auction-media --strict`.

## 2. Inventory source media (grade10)

- [ ] 2.1 Make `grade10-admin-inventory-catalog-SC-123` through `SC-127` pass: add ordered product-media persistence, private object storage, validation, authorization, and the typed Auction source-read contract.
- [ ] 2.2 Add the Inventory migration, Worker binding, generated types, API documentation, and focused backend coverage.

## 3. Auction snapshot gallery (grade10)

- [ ] 3.1 Make `grade10-admin-auction-listing-SC-87` through `SC-92` pass: select assets only from the listing product, preserve one mixed order, materialize selected assets on Save, and retain snapshot stability.
- [ ] 3.2 Extend the existing Auction media dialog and fixtures; preserve direct upload, reorder, and status behavior under `SC-46` through `SC-55`.

## 4. Integrated validation (grade10)

- [ ] 4.1 Add the Inventory-admin to Auction-operator mixed-media E2E walk, including source edit/removal after Save.
- [ ] 4.2 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`, `pnpm run build`, `pnpm run check:migrations`, and `pnpm --dir packages/api-docs run generate`.
