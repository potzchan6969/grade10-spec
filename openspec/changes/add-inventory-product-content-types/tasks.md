## 1. Contracts and Manual (grade10-spec)

- [ ] 1.1 Update the inventory catalog manual with the shipped CMS, required English base values, locale fallback, and Auction-only presentation rules for grade10-admin-inventory-catalog-SC-69 through SC-84
- [ ] 1.2 Verify the manual with `pnpm check:manual`

## 2. Shared Contracts (grade10)

- [ ] 2.1 Add typed inventory contracts for localized field definitions, option keys, content-type revisions, typed product values, validation violations, and translation warnings for grade10-admin-inventory-catalog-SC-69 through SC-79
- [ ] 2.2 Add locale-aware ordered Auction product-content and dynamic filter contracts, replacing the hard-coded metadata shape for grade10-admin-inventory-catalog-SC-80 through SC-84
- [ ] 2.3 Verify contracts and fixtures with `pnpm run typecheck`, `pnpm run lint`, and the affected inventory and Auction contract tests

## 3. Data Migration (grade10)

- [ ] 3.1 Add the append-only inventory migration and Drizzle schema for reusable fields, locale labels/options, exact-tuple content types and draft/published revisions, Auction display selection, and typed product values for grade10-admin-inventory-catalog-SC-69 through SC-73
- [ ] 3.2 Preserve `products.metadata` as legacy unstructured data and add the keys, checks, and typed-value indexes needed for grade10-admin-inventory-catalog-SC-75 through SC-82
- [ ] 3.3 Verify generated migration artifacts with `pnpm run db:drizzle:generate`, `pnpm run check:migrations`, and `pnpm run db:status`

## 4. Inventory Backend and API (grade10)

- [ ] 4.1 Implement inventory-owned reusable-field and content-type draft/publish services with exact IP + Item + Category lookup, English-base checks, missing-locale warnings, and transactional affected-product validation for grade10-admin-inventory-catalog-SC-69 through SC-73
- [ ] 4.2 Implement typed product-value writes and the created-state validator so drafts may be incomplete but all supplied values validate and missing required canonical values block creation for grade10-admin-inventory-catalog-SC-74 through SC-79
- [ ] 4.3 Implement indexed Auction content reads and filters that localize only presentation, exclude absent optional values from matching, and exclude Auction-only fields from criteria for grade10-admin-inventory-catalog-SC-80 through SC-82
- [ ] 4.4 Route the authorized admin procedures and Inventory RPC binding through the services, then update Auction listing enrichment to consume ordered structured fields for grade10-admin-inventory-catalog-SC-83 and SC-84
- [ ] 4.5 Verify backend behavior with `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`, and focused inventory/Auction contract and service tests

## 5. Admin and Auction Frontends (grade10)

- [ ] 5.1 Add the inventory-admin content-types feature slice for reusable fields, localized labels/options, draft review, translation warnings, and publish refusals for grade10-admin-inventory-catalog-SC-69 through SC-73
- [ ] 5.2 Replace the product editor's free-form structured-fact entry with the published content-type form, typed controls, locale text values, field-level errors, and draft/created validation feedback for grade10-admin-inventory-catalog-SC-74 through SC-79
- [ ] 5.3 Render Auction's configured ordered labels and locale-resolved values, and build controls from allowed universal/content filters without Auction-only fields for grade10-admin-inventory-catalog-SC-80 through SC-84
- [ ] 5.4 Verify frontend behavior against contract fixtures with `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run build`
