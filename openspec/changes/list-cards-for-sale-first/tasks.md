## 1. The requirement (grade10-spec)

- [x] 1.1 Write the MODIFIED `Order and free text describe the whole catalogue` delta: a card for sale lists before a sold-out one in every order, at rest and inside a collection, the order asked for holding within each group; a price order sorts on a card's cheapest variant; SC-13 reads the lowest-priced card for sale; new SC-57 and SC-58
- [x] 1.2 Record Q2 as decided on the basis that runs, with no backend change

## 2. The proof (grade10)

The order already runs (`packages/grade10-store/backend/src/services/catalog/browse.ts`, `collection.ts`, `projection.ts`); this group points its tests at the scenarios.

- [x] 2.1 `test/services/catalog/browse.test.ts` "placing what is for sale first" and `test/services/catalog/collection.test.ts`'s for-sale grouping cite `grade10-site-store-product-listing-SC-57`; "sorts on a product's cheapest variant, sold out or not" cites `grade10-site-store-product-listing-SC-58`
- [x] 2.2 Verify: `pnpm --dir packages/grade10-store/backend exec vitest run test/services/catalog`

## 3. The walk (grade10)

- [ ] 3.1 Order the listing by each order on the isolated stack's fixture catalogue with one card sold out, and read the cards for sale first - blocked: the isolated e2e stack needs Docker, which this environment does not have; the blind feature suite for `grade10-site/store/product-listing` is owed by the planning pass, not written here - waived 2026-10-26 by @htonyl: CI checks are no longer needed; left unchecked and waived at archive by tasks_waived
