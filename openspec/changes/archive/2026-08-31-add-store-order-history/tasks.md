## 1. Shared UI blocks (grade10-spec)

- [x] 1.1 Make `shared-ui-store-order-history-SC-06` and `shared-ui-store-order-history-SC-08` pass: export `OrderHistoryStatus` for the five Status-set variants with consumer-supplied labels
- [x] 1.2 Make `shared-ui-store-order-history-SC-09` pass: export `OrderHistoryLineItem` with embedded product thumbnail, product text, and line total
- [x] 1.3 Make `shared-ui-store-order-history-SC-03` and `shared-ui-store-order-history-SC-10` pass: export `OrderHistoryCardHeader` with optional Track Order and View Details callbacks
- [x] 1.4 Make `shared-ui-store-order-history-SC-04` pass: export `OrderHistoryCard` with header and horizontally scrollable line-item slot using scroll-fade
- [x] 1.5 Make `shared-ui-store-order-history-SC-01`, `shared-ui-store-order-history-SC-02`, and `shared-ui-store-order-history-SC-05` pass: export `OrderHistory` with Active/Past omission and empty state
- [x] 1.6 Make `shared-ui-store-order-history-SC-07` pass: barrel-export the named surface from `@grade10/ui` with colocated stories, `.figma.ts` templates, and `audit.json`
- [x] 1.7 Verify with `pnpm run lint`, `pnpm run typecheck`, and `pnpm run test:stories` for the new block stories

## 2. Preview page assembly (grade10-spec)

Depends on group 1 landing in the same change.

- [x] 2.1 Assemble filled and empty Order History page stories in `apps/preview` composing `Nav`, `OrderHistory`, and `Footer`
- [x] 2.2 Verify with `pnpm run test:stories:app` for the new page stories
