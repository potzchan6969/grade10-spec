## 1. Shared order presentation (grade10-spec) (owner: @kinisworking)

- [x] 1.1 Make Order Details summary, payment, and individual money rows optional; omit each absent group and the empty sidebar while preserving complete existing consumers so `shared-ui-store-order-detail-SC-03`, `shared-ui-store-order-detail-SC-04`, and `shared-ui-store-order-detail-SC-07` through `shared-ui-store-order-detail-SC-10` pass in component tests and stories.
- [x] 1.2 Prove every public Order Details export and standalone part remains available, and prove tracking reports only through its supplied callback, so `shared-ui-store-order-detail-SC-01`, `shared-ui-store-order-detail-SC-02`, `shared-ui-store-order-detail-SC-05`, and `shared-ui-store-order-detail-SC-06` pass; verify with the focused UI tests, Storybook tests, typecheck, and build.
- [x] 1.3 Add Your Orders, Order Details, pending-total, query-state, money-row, fulfilment, tracking, and empty-state copy to the Grade10 `en`, `zh-Hant`, and `zh-Hans` catalogs; make catalog resolution and type tests pass for every supported Grade10 locale.
- [ ] 1.4 Update the order-history, order-detail, and shared Order Details product records for the shipped surfaces, then at archive carry each delta's Feature set and User journeys into its durable capability without changing issued ids; verify with `pnpm check:manual` and the archive preflight.

## 2. Customer order projections (grade10)

This group uses the landed `grade10-spec` component and catalog contract, but
tests against typed fixtures rather than a running backend.

- [ ] 2.1 Advance `external/grade10-spec` to the landed change while preserving unrelated nested work, and make `pnpm run check:submodules` pass.
- [ ] 2.2 Extend the frontend `Order` model and mapper with the typed fulfilment status, fulfilments, estimate, and tracking fields already carried by `StoreOrder`; add fixture coverage that fails on a contract mismatch.
- [ ] 2.3 Add pure history and detail projections that consume the customer-status badge, keep quoted, paid, and refunded amounts distinct, calculate line totals in minor units, and omit unsupported facts so `grade10-site-store-order-history-SC-03` through `grade10-site-store-order-history-SC-05` and `grade10-site-store-order-detail-SC-04` through `grade10-site-store-order-detail-SC-08` pass in unit tests.
- [ ] 2.4 Add the safe tracking-target helper and route-effect tests so `grade10-site-store-order-history-SC-07`, `grade10-site-store-order-history-SC-08`, `grade10-site-store-order-detail-SC-09`, and `grade10-site-store-order-detail-SC-10` pass for valid, absent, relative, credential-bearing, and non-HTTPS targets.

## 3. Customer order pages (grade10)

- [ ] 3.1 Register `/profile/orders` and `/profile/orders/:orderId` as session surfaces, add route modules through `SessionDecided`, and make `grade10-site-store-order-history-SC-01`, `grade10-site-store-order-history-SC-02`, `grade10-site-store-order-detail-SC-01`, and `grade10-site-store-order-detail-SC-03` pass in route tests.
- [ ] 3.2 Compose the Your Orders page from `useOrders` and `OrderHistory`, including Active/Past grouping, newest-first summaries, View Details, tracking, loading, retry, and empty states; make `grade10-site-store-order-history-SC-03` through `grade10-site-store-order-history-SC-11` pass in focused page tests.
- [ ] 3.3 Compose the owner-only Order Details page from `useOrder` and `OrderDetails`, keeping null, error, loading, web, point-of-sale, partial-refund, optional-section, fulfilment, and tracking states distinct; make `grade10-site-store-order-detail-SC-02` and `grade10-site-store-order-detail-SC-04` through `grade10-site-store-order-detail-SC-12` pass in focused page tests.
- [ ] 3.4 Add profile-to-orders and history-to-detail navigation, update the checkout-domain return-link reference, add surface identity, localized-address coverage, and the derived customer-order browser cases; verify the affected app with focused unit and browser tests, `pnpm run typecheck`, `pnpm run lint`, and `pnpm run build`.
