## 1. Shared contracts and planning record (grade10-spec) (owner: @htonyl)

- [x] 1.1 Update the inventory and Auction capability deltas, journeys, feature suites, and PRD marks for the IP + Category + Item hierarchy, optional Cert IDs, explicit `No Cert ID`, reservation unit selection, and displayed Cert ID scenarios (grade10-admin-inventory-catalog-SC-93 through SC-83; grade10-admin-auction-listing-SC-71 through SC-80 and SC-84)
- [x] 1.2 Publish the tagged displayed-field contract and the inventory/Auction certificate boundary without adding a fake product attribute key (grade10-admin-inventory-catalog-SC-101, grade10-admin-inventory-catalog-SC-102)
- [x] 1.3 Verify the planning artifacts with `openspec validate add-inventory-cert-id-hierarchy --strict` and `pnpm run tcs:validate`

## 2. Data migration and inventory contracts (grade10) (owner: @htonyl)

- [x] 2.1 Add optional inventory-owned Cert ID records and remove Collectible type and product metadata from product contracts and persisted rows (grade10-admin-inventory-catalog-SC-93 through SC-73)
- [x] 2.2 Extend intake, inventory detail, changelog snapshots, Auction eligibility, and reservation contracts with atomic optional Cert ID handling and an explicit `Cert ID` or `No Cert ID` choice (grade10-admin-inventory-catalog-SC-98 through SC-76, SC-81 through SC-83)
- [x] 2.3 Migrate displayed attribute order entries and add the special Cert ID field while preserving existing typed attribute order (grade10-admin-inventory-catalog-SC-101 through SC-80)
- [x] 2.4 Add the append-only database migrations and verify with `pnpm run db:drizzle:generate && pnpm run check:migrations`

## 3. Inventory backend and binding (grade10) (owner: @htonyl)

- [x] 3.1 Make intake validate, insert, and audit Cert IDs atomically with stock and expose product-scoped reads (grade10-admin-inventory-catalog-SC-95 through SC-76)
- [x] 3.2 Make numbered inventory reservations exclusive and pass the selected unit through Auction display reads while preserving No Cert ID aggregate holds (grade10-admin-inventory-catalog-SC-105 through SC-83; grade10-admin-auction-listing-SC-73 through SC-75)
- [x] 3.3 Verify Inventory behavior with `pnpm run test:backend -- packages/inventory/backend/test/intake.test.ts packages/inventory/backend/test/eligible-products.test.ts packages/inventory/backend/test/product-schema-service.test.ts`

## 4. Inventory admin surface (grade10) (owner: @htonyl)

- [x] 4.1 Remove the Collectible type and metadata editor, keeping IP + Category + Item and typed attributes as the product form (grade10-admin-inventory-catalog-SC-93, grade10-admin-inventory-catalog-SC-94)
- [x] 4.2 Add optional Cert ID intake, inventory Cert ID visibility, and refusal/empty states to the product page (grade10-admin-inventory-catalog-SC-95 through SC-76)
- [x] 4.3 Add Cert ID to the Displayed Attributes panel as an always-available special field that admins can include, hide, and reorder (grade10-admin-inventory-catalog-SC-101, grade10-admin-inventory-catalog-SC-102)
- [x] 4.4 Verify with `pnpm run test -- packages/inventory/admin-frontend/src/features/catalog/products/presentation/views/productsViews.test.tsx apps/admin/grade10/src/pages/inventory/ProductSchemasPage.test.tsx && pnpm run typecheck`

## 5. Auction listing backend and admin surface (grade10) (owner: @htonyl)

- [x] 5.1 Persist and validate the selected inventory Cert ID or explicit No Cert ID choice through listing save and create (grade10-admin-auction-listing-SC-71 through SC-78 and SC-84)
- [x] 5.2 Add the product-scoped Cert ID picker, reset-on-product-change behavior, own-hold retention, and create refusal feedback (grade10-admin-auction-listing-SC-71 through SC-78 and SC-84)
- [x] 5.2a Allow separate live listings for distinct Cert IDs of one product while keeping one active listing per Cert ID and one aggregate `No Cert ID` listing (grade10-admin-auction-listing-SC-85)
- [x] 5.3 Resolve selected Cert ID through the configured public product display and remove product metadata fallback (grade10-admin-auction-listing-SC-79, grade10-admin-auction-listing-SC-80)
- [x] 5.4 Verify with `pnpm run test:backend -- packages/grade10-auction/backend/test/services/inventory.test.ts packages/grade10-auction/backend/test/services/listings/standalone.test.ts && pnpm run test -- packages/grade10-auction/admin-frontend/src/features/catalog/listings/presentation/views/ListingsPanel.test.tsx && pnpm run build`

## 6. Catalog import contracts and persistence (grade10) (owner: @htonyl)

- [x] 6.1 Define schema-manifest, product-entry, and inventory preview/commit contracts with source coordinates, normalized values, row findings, mapping decisions, and atomic result payloads (grade10-admin-inventory-catalog-SC-108 through SC-122)
- [x] 6.2 Add catalog import sessions and staged rows with actor, kind, payload hash, expiry, selected mappings, row decisions, and idempotent commit results (grade10-admin-inventory-catalog-SC-110 through SC-120)
- [x] 6.3 Verify the migration and contract packages with `pnpm run db:drizzle:generate && pnpm run check:migrations` and the inventory contract tests

## 7. Catalog import services (grade10) (owner: @htonyl)

- [x] 7.1 Implement schema-manifest preview and atomic draft-revision commit using existing schema validation and explicit mappings to existing tag tuples (grade10-admin-inventory-catalog-SC-108 through SC-111)
- [x] 7.2 Implement product-entry preview and commit using normalized product identity and schema values, deduplicating repeated rows while keeping distinct same-name identities separate (grade10-admin-inventory-catalog-SC-112 through SC-115)
- [x] 7.3 Implement inventory preview and commit against exactly one existing created product, with per-row decisions, copy facts, Cert ID rules, duplicate checks, stock updates, and history in one transaction (grade10-admin-inventory-catalog-SC-116 through SC-122)
- [x] 7.4 Verify Inventory and Auction services with their focused typecheck and test suites

## 8. Catalog import admin surfaces (grade10) (owner: @htonyl)

- [x] 8.1 Add shared CSV/XLSX decoding, source mapping review, row previews, and explicit confirmation without modifying the uploaded workbook (grade10-admin-inventory-catalog-SC-109 through SC-122)
- [x] 8.2 Add schema-manifest and product-entry actions to Product Schemas and Products, preserving draft review and the existing product status flow (grade10-admin-inventory-catalog-SC-108 through SC-115)
- [x] 8.3 Add inventory-unit review with exact product matches, copy facts, blank-status decisions, and Cert ID validation (grade10-admin-inventory-catalog-SC-116 through SC-122)
- [x] 8.4 Verify the touched admin frontends, app typecheck, tests, and deployment bundles

## 9. Integrated verification (grade10)

- [ ] 9.1 Verify migrations, backend behavior, admin integration, and deployment bundles with `pnpm run test:backend && pnpm run typecheck && pnpm run test && pnpm run build && pnpm run check:admin-bundle && pnpm run check:submodules`
