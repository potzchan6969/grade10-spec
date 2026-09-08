## 1. Shared order presentation (grade10-spec) (owner: @kinisworking)

- [x] 1.1 Make Order Details summary, payment, and individual money rows optional; omit each absent group and the empty sidebar while preserving complete existing consumers so `shared-ui-store-order-detail-SC-03`, `shared-ui-store-order-detail-SC-04`, and `shared-ui-store-order-detail-SC-07` through `shared-ui-store-order-detail-SC-10` pass in component tests and stories.
- [x] 1.2 Prove every public Order Details export and standalone part remains available, and prove tracking reports only through its supplied callback, so `shared-ui-store-order-detail-SC-01`, `shared-ui-store-order-detail-SC-02`, `shared-ui-store-order-detail-SC-05`, and `shared-ui-store-order-detail-SC-06` pass; verify with the focused UI tests, Storybook tests, typecheck, and build.
- [x] 1.3 Add Your Orders, Order Details, pending-total, query-state, money-row, fulfilment, tracking, and empty-state copy to the Grade10 `en`, `zh-Hant`, and `zh-Hans` catalogs; make catalog resolution and type tests pass for every supported Grade10 locale.
- [ ] 1.4 Update the order-history, order-detail, and shared Order Details product records for the shipped surfaces, then at archive carry each delta's Feature set and User journeys into its durable capability without changing issued ids; verify with `pnpm check:manual` and the archive preflight.

## 2. Customer order projections (grade10) (owner: @kinisworking)

This group uses the landed `grade10-spec` component and catalog contract, but
tests against typed fixtures rather than a running backend.

- [x] 2.1 Advance `external/grade10-spec` to the landed change while preserving unrelated nested work, and make `pnpm run check:submodules` pass.
- [x] 2.2 Extend the frontend `Order` model and mapper with the typed fulfilment status, fulfilments, estimate, and tracking fields already carried by `StoreOrder`; add fixture coverage that fails on a contract mismatch.
- [x] 2.3 Add pure history and detail projections that consume the customer-status badge, keep quoted, paid, and refunded amounts distinct, calculate line totals in minor units, and omit unsupported facts so `grade10-site-store-order-history-SC-03` through `grade10-site-store-order-history-SC-05` and `grade10-site-store-order-detail-SC-04` through `grade10-site-store-order-detail-SC-08` pass in unit tests.
- [x] 2.4 Add the safe tracking-target helper and route-effect tests so `grade10-site-store-order-history-SC-07`, `grade10-site-store-order-history-SC-08`, `grade10-site-store-order-detail-SC-09`, and `grade10-site-store-order-detail-SC-10` pass for valid, absent, relative, credential-bearing, and non-HTTPS targets.

## 3. Customer order pages (grade10) (owner: @kinisworking)

- [x] 3.1 Register `/profile/orders` and `/profile/orders/:orderId` as session surfaces, add route modules through `SessionDecided`, and make `grade10-site-store-order-history-SC-01`, `grade10-site-store-order-history-SC-02`, `grade10-site-store-order-detail-SC-01`, and `grade10-site-store-order-detail-SC-03` pass in route tests.
- [x] 3.2 Compose the Your Orders page from `useOrders` and `OrderHistory`, including Active/Past grouping, newest-first summaries, View Details, tracking, loading, retry, and empty states; make `grade10-site-store-order-history-SC-03` through `grade10-site-store-order-history-SC-11` pass in focused page tests.
- [x] 3.3 Compose the owner-only Order Details page from `useOrder` and `OrderDetails`, keeping null, error, loading, web, point-of-sale, partial-refund, optional-section, fulfilment, and tracking states distinct; make `grade10-site-store-order-detail-SC-02` and `grade10-site-store-order-detail-SC-04` through `grade10-site-store-order-detail-SC-12` pass in focused page tests.
- [x] 3.4 Add profile-to-orders and history-to-detail navigation, update the checkout-domain return-link reference, add surface identity, localized-address coverage, and the derived customer-order browser cases; verify the affected app with focused unit and browser tests, `pnpm run typecheck`, `pnpm run lint`, and `pnpm run build`.

## 4. Partial address and payment presentation (grade10-spec) (owner: @kinisworking)

- [ ] 4.1 Make `OrderDetailsAddress.name` optional and let `OrderDetailsPayment` accept an optional recognized brand, text label, and masked number; omit all-empty payment data while preserving existing consumers so `shared-ui-store-order-detail-SC-11` through `shared-ui-store-order-detail-SC-13` pass in component tests and stories.
- [ ] 4.2 Add Discount, Shipping, and Tax labels to each supported Grade10 `orderDetail` catalog, and update the `orderHistory` and `orderDetail` order-label templates so a supplied shop number keeps its own prefix; make catalog resolution and type tests pass for `en`, `zh-Hant`, and `zh-Hans`.
- [ ] 4.3 Verify the widened shared contract and catalog additions with `pnpm --filter @grade10/ui run test:stories`, `pnpm --filter @grade10/ui run typecheck`, `pnpm --filter @grade10/i18n run test`, `pnpm --filter @grade10/i18n run typecheck`, and `pnpm run lint`.

## 5. Rich customer order facts (grade10)

This group uses the landed group 4 component and catalog contract and the
existing typed buyer reads. It adds no Store backend, database, provider,
webhook, reconciliation, deployment, or order-status rule.

- [ ] 5.1 Advance `external/grade10-spec` to the landed group 4 change while preserving unrelated nested work, and make `pnpm run check:submodules` pass.
- [ ] 5.2 Align the frontend `Order` model with `orderName`, `discountAppliedMinor`, `shippingMinor`, `taxMinor`, `shippingAddress`, and `paymentInstrument` from `StoreOrder`; keep the repository's direct decoded return and make typed fixture coverage fail on contract drift.
- [ ] 5.3 Extend the pure history and detail projections with the shop-number fallback, supplied settlement rows, partial shipping address, and truthful known, unknown, and wallet payment presentation so `grade10-site-store-order-history-SC-12`, `grade10-site-store-order-history-SC-13`, and `grade10-site-store-order-detail-SC-13` through `grade10-site-store-order-detail-SC-16` pass in unit tests.
- [ ] 5.4 Pass the new projections and localized copy through the existing owner pages, add or update the derived browser cases without exposing address or payment data outside detail, and verify the affected app with focused unit and browser tests, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`, `pnpm run check:libs`, and `pnpm run check:submodules`.
