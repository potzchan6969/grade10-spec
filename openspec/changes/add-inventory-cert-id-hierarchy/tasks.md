## 1. Shared contracts and planning record (grade10-spec)

- [ ] 1.1 Update the inventory and Auction capability deltas, journeys, feature suites, and PRD marks for the IP + Category + Item hierarchy, optional Cert IDs, explicit `No Cert ID`, reservation unit selection, and displayed Cert ID scenarios (grade10-admin-inventory-catalog-SC-93 through SC-83; grade10-admin-auction-listing-SC-70 through SC-80)
- [ ] 1.2 Publish the tagged displayed-field contract and the inventory/Auction certificate boundary without adding a fake product attribute key (grade10-admin-inventory-catalog-SC-101, grade10-admin-inventory-catalog-SC-102)
- [ ] 1.3 Verify the planning artifacts with `openspec validate add-inventory-cert-id-hierarchy --strict` and `pnpm run tcs:validate`

## 2. Data migration and inventory contracts (grade10)

- [ ] 2.1 Add optional inventory-owned Cert ID records and remove Collectible type and product metadata from product contracts and persisted rows (grade10-admin-inventory-catalog-SC-93 through SC-73)
- [ ] 2.2 Extend intake, inventory detail, changelog snapshots, Auction eligibility, and reservation contracts with atomic optional Cert ID handling and an explicit `Cert ID` or `No Cert ID` choice (grade10-admin-inventory-catalog-SC-98 through SC-76, SC-81 through SC-83)
- [ ] 2.3 Migrate displayed attribute order entries and add the special Cert ID field while preserving existing typed attribute order (grade10-admin-inventory-catalog-SC-101 through SC-80)
- [ ] 2.4 Add the append-only database migrations and verify with `pnpm run db:drizzle:generate && pnpm run check:migrations`

## 3. Inventory backend and binding (grade10)

- [ ] 3.1 Make intake validate, insert, and audit Cert IDs atomically with stock and expose product-scoped reads (grade10-admin-inventory-catalog-SC-95 through SC-76)
- [ ] 3.2 Make numbered inventory reservations exclusive and pass the selected unit through Auction display reads while preserving No Cert ID aggregate holds (grade10-admin-inventory-catalog-SC-105 through SC-83; grade10-admin-auction-listing-SC-73 through SC-75)
- [ ] 3.3 Verify Inventory behavior with `pnpm run test:backend -- packages/inventory/backend/test/intake.test.ts packages/inventory/backend/test/eligible-products.test.ts packages/inventory/backend/test/product-schema-service.test.ts`

## 4. Inventory admin surface (grade10)

- [ ] 4.1 Remove the Collectible type and metadata editor, keeping IP + Category + Item and typed attributes as the product form (grade10-admin-inventory-catalog-SC-93, grade10-admin-inventory-catalog-SC-94)
- [ ] 4.2 Add optional Cert ID intake, inventory Cert ID visibility, and refusal/empty states to the product page (grade10-admin-inventory-catalog-SC-95 through SC-76)
- [ ] 4.3 Add Cert ID to the Displayed Attributes panel as an always-available special field that admins can include, hide, and reorder (grade10-admin-inventory-catalog-SC-101, grade10-admin-inventory-catalog-SC-102)
- [ ] 4.4 Verify with `pnpm run test -- packages/inventory/admin-frontend/src/features/catalog/products/presentation/views/productsViews.test.tsx apps/admin/grade10/src/pages/inventory/ProductSchemasPage.test.tsx && pnpm run typecheck`

## 5. Auction listing backend and admin surface (grade10)

- [ ] 5.1 Persist and validate the selected inventory Cert ID or explicit No Cert ID choice through listing save and create (grade10-admin-auction-listing-SC-70 through SC-78)
- [ ] 5.2 Add the product-scoped Cert ID picker, reset-on-product-change behavior, own-hold retention, and create refusal feedback (grade10-admin-auction-listing-SC-70 through SC-78)
- [ ] 5.3 Resolve selected Cert ID through the configured public product display and remove product metadata fallback (grade10-admin-auction-listing-SC-79, grade10-admin-auction-listing-SC-80)
- [ ] 5.4 Verify with `pnpm run test:backend -- packages/grade10-auction/backend/test/services/inventory.test.ts packages/grade10-auction/backend/test/services/listings/standalone.test.ts && pnpm run test -- packages/grade10-auction/admin-frontend/src/features/catalog/listings/presentation/views/ListingsPanel.test.tsx && pnpm run build`
