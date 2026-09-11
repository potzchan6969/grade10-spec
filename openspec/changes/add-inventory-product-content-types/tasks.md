## 1. Contracts and Manual (grade10-spec)

- [ ] 1.1 Update the inventory catalog manual with product schemas, product attributes, English-base values, flexible listing JSONB, and published-listing snapshots for grade10-admin-inventory-catalog-SC-69 through SC-90
- [ ] 1.2 Verify the manual with `pnpm check:manual`

## 2. Shared Contracts (grade10)

- [ ] 2.1 Add typed inventory contracts for localized product attributes, option keys, product-schema revisions, typed product values, validation violations, and translation warnings for grade10-admin-inventory-catalog-SC-69 through SC-79
- [ ] 2.2 Add Inventory product-snapshot and Auction opaque-listing-attribute contracts, locale-aware snapshot display, and dynamic filter contracts, replacing the hard-coded metadata shape for grade10-admin-inventory-catalog-SC-80 through SC-90
- [ ] 2.3 Verify contracts and fixtures with `pnpm run typecheck`, `pnpm run lint`, and the affected inventory and Auction contract tests

## 3. Data Migration (grade10)

- [ ] 3.1 Add append-only Inventory and Auction migrations for product attributes, exact-tuple product schemas and draft/published revisions, `auction_display_attribute_keys`, and `auction.listings` JSONB snapshots and listing attributes for grade10-admin-inventory-catalog-SC-69 through SC-90
- [ ] 3.2 Preserve `products.metadata` as legacy unstructured data and add keys, checks, and typed-value indexes only for product attributes; listing attributes stay opaque JSONB
- [ ] 3.3 Verify generated migration artifacts with `pnpm run db:drizzle:generate`, `pnpm run check:migrations`, and `pnpm run db:status`

## 4. Inventory Backend and API (grade10)

- [ ] 4.1 Implement inventory-owned product-attribute and product-schema draft/publish services with exact IP + Item + Category lookup, English-base checks, missing-locale warnings, and transactional affected-product validation for grade10-admin-inventory-catalog-SC-69 through SC-73
- [ ] 4.2 Implement typed product-attribute writes and the created-state validator so drafts may be incomplete but all supplied values validate and missing required canonical values block creation for grade10-admin-inventory-catalog-SC-74 through SC-79
- [ ] 4.3 Implement indexed Auction product-attribute reads and filters that localize only presentation and exclude absent optional values from matching for grade10-admin-inventory-catalog-SC-80 and SC-81
- [ ] 4.4 Implement opaque listing-attribute JSONB writes and the Inventory product-display snapshot contract, then publish and render Auction listings from saved snapshots for grade10-admin-inventory-catalog-SC-82 through SC-84 and SC-88 through SC-90
- [ ] 4.5 Verify backend behavior with `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`, and focused inventory/Auction contract and service tests

## 5. Admin and Auction Frontends (grade10)

- [ ] 5.1 Add the inventory-admin product-schemas feature slice for reusable product attributes, localized labels/options, draft review, translation warnings, and publish refusals for grade10-admin-inventory-catalog-SC-69 through SC-73
- [ ] 5.2 Replace the product editor's free-form structured-fact entry with the published product-schema form, typed controls, locale text values, field-level errors, and draft/created validation feedback for grade10-admin-inventory-catalog-SC-74 through SC-79
- [ ] 5.3 Add Auction listing editing for flexible JSONB attributes, then render saved product snapshots and localized listing items while limiting filters to universal tags and product attributes for grade10-admin-inventory-catalog-SC-80 through SC-84 and SC-88 through SC-90
- [ ] 5.4 Verify frontend behavior against contract fixtures with `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run build`
