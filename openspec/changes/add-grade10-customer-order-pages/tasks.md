## 1. Shared order presentation (grade10-spec) (owner: @kinisworking)

- [x] 1.1 Make Order Details summary, payment, and individual money rows optional; omit each absent group and the empty sidebar while preserving complete existing consumers so `shared-ui-store-order-detail-SC-03`, `shared-ui-store-order-detail-SC-04`, and `shared-ui-store-order-detail-SC-07` through `shared-ui-store-order-detail-SC-10` pass in component tests and stories.
- [x] 1.2 Prove every public Order Details export and standalone part remains available, and prove tracking reports only through its supplied callback, so `shared-ui-store-order-detail-SC-01`, `shared-ui-store-order-detail-SC-02`, `shared-ui-store-order-detail-SC-05`, and `shared-ui-store-order-detail-SC-06` pass; verify with the focused UI tests, Storybook tests, typecheck, and build.
- [x] 1.3 Add Your Orders, Order Details, pending-total, query-state, money-row, fulfilment, tracking, and empty-state copy to the Grade10 `en`, `zh-Hant`, and `zh-Hans` catalogs; make catalog resolution and type tests pass for every supported Grade10 locale.
- [x] 1.4 Update the order-history, order-detail, and shared Order Details product records for the shipped surfaces, then at archive carry each delta's Feature set and User journeys into its durable capability without changing issued ids; verify with `pnpm check:manual` and the archive preflight. — the fold into the durable capabilities runs with the archive (`archive-change`), not here

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

- [x] 4.1 Make `OrderDetailsAddress.name` optional and let `OrderDetailsPayment` accept an optional recognized brand, text label, and masked number; omit all-empty payment data while preserving existing consumers so `shared-ui-store-order-detail-SC-11` through `shared-ui-store-order-detail-SC-13` pass in component tests and stories.
- [x] 4.2 Add Discount, Shipping, and Tax labels to each supported Grade10 `orderDetail` catalog, and update the `orderHistory` and `orderDetail` order-label templates so a supplied shop number keeps its own prefix; make catalog resolution and type tests pass for `en`, `zh-Hant`, and `zh-Hans`.
- [x] 4.3 Verify the widened shared contract and catalog additions with `pnpm --filter @grade10/ui run test:stories`, `pnpm --filter @grade10/ui run typecheck`, `pnpm --filter @grade10/i18n run test`, `pnpm --filter @grade10/i18n run typecheck`, and `pnpm run lint`.
- [x] 4.4 Add an optional `points` summary row on `OrderDetailsSummary` after Discount, matching the cart drawer's Points credit label and success treatment; cover with and without points in Storybook so `shared-ui-store-order-detail-SC-14`, `shared-ui-store-order-detail-SC-15`, and `grade10-site-store-order-detail-SC-17` pass.

## 5. Rich customer order facts (grade10) (owner: @kinisworking)

This group uses the landed group 4 component and catalog contract and the
existing typed buyer reads. It adds no Store backend, database, provider,
webhook, reconciliation, deployment, or order-status rule.

- [x] 5.1 Advance `external/grade10-spec` to the landed group 4 shared contract while preserving unrelated nested work, and make `pnpm run check:submodules` pass.
- [x] 5.2 Align the frontend `Order` model with `orderName`, `discountAppliedMinor`, `shippingMinor`, `taxMinor`, `shippingAddress`, and `paymentInstrument` from `StoreOrder`; keep the repository's direct decoded return and make typed fixture coverage fail on contract drift.
- [x] 5.3 Extend the pure history and detail projections with the shop-number fallback, supplied settlement rows, partial shipping address, and truthful known, unknown, and wallet payment presentation so `grade10-site-store-order-history-SC-12`, `grade10-site-store-order-history-SC-13`, and `grade10-site-store-order-detail-SC-13` through `grade10-site-store-order-detail-SC-16` pass in unit tests.
- [x] 5.4 Pass the new projections and localized copy through the existing owner pages, add or update the derived browser cases without exposing address or payment data outside detail, and verify the affected app with focused unit and browser tests, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`, `pnpm run check:libs`, and `pnpm run check:submodules`.
- [x] 5.5 Reconcile the Grade10 detail projection with the published `OrderDetails` stories: map only typed Store facts, keep story-only image, line coupon, line issue, order promo code, pickup address, and earned-loyalty values absent when the read omits them, and record a parity review for `ItemCoupon`, `OrderDiscount`, `WithPointsCredit`, `Pickup`, `InStore`, `NoOptionalGroups`, and `PaidTotalWithoutSubtotal`.
- [x] 5.6 Resolve the points-credit data boundary before claiming `grade10-site-store-order-detail-SC-17`: extend the typed Store order read in approved contract work and make the scenario pass, or mark the change awaiting that dependency rather than claiming completion; never derive the credit or deducted count from discount, eligible goods, or refund. Verify with contract fixtures and page projection tests.
- [x] 5.7 Correct the application payment projection to preserve an unrecognized provider label and supplied mask without a guessed logo, then make `grade10-site-store-order-detail-SC-16` pass in application tests.

## 6. Settlement row localization (grade10) (owner: @kinisworking)

Uses the landed group 4 catalogs and completes the frontend copy boundary on the existing order pages. Page acceptance remains a separate owner-scheduled verification pass.

- [x] 6.1 Replace the literal Discount, Shipping and Tax summary labels in `OrderDetailsPage` with the existing `orderDetail.money` catalog keys, preserving zero and absent rows from `grade10-site-store-order-detail-SC-14`; cover `en`, `zh-Hant`, and `zh-Hans` with typed fixtures
- [x] 6.2 Verify focused order projection, page and locale tests, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`, and `pnpm run check:submodules`

## 7. Product picture records (grade10-spec) (owner: @kinisworking)

This documentation group adds no component behavior. It uses existing checks;
new application tests belong to groups 8-10.

- [x] 7.1 Run focused strict change and product-record link checks before reconciling the picture handoff; confirm the existing shared line props already accept optional pictures and no component change is owed.
- [x] 7.2 Reconcile `docs/prds/products/grade10-site/store/order-history.md` and `docs/prds/products/grade10-site/store/order-detail.md` with the selected current-picture policy, earlier purchases, readable fallback and retained private-link restrictions. Keep the in-flight marks until archive.
- [x] 7.3 Verify the two product-record links and focused strict change validation; record any unrelated manual baseline failures separately.

## 8. Optional order picture contracts (grade10) (owner: @kinisworking)

This group establishes the wire and domain item shapes. Groups 9 and 10 depend
on it, and can then be claimed independently against fixtures.

- [x] 8.1 Add failing production-schema and client-decoder tests for image-free legacy and enriched member, list, private-link and admin responses; assert optional strings survive decoding and malformed picture fields fail, supporting `g10.store-order-history.SC6` and `g10.store-order-detail.SC6`. Land these tests in their own commit before code and tick this task last.
- [x] 8.2 Add optional `imageSrc` and `imageAlt` strings to `orderItemSchema` and the frontend `OrderItem`, preserving the direct decoded repository return, so `g10.store-order-history.SC6` and `g10.store-order-detail.SC6` pass. Keep current input schemas and persistence image-free; prove enriched responses remain readable by the saved previous production schema.
- [x] 8.3 Verify focused contract/client compatibility tests and affected contract/frontend/admin typechecks. Check member, list, private-link and admin-card output schemas retain the same fields.

## 9. Current order picture reads (grade10) (owner: @kinisworking)

Uses the landed group 8 contract. No frontend implementation or running browser
is needed to prove this service boundary.

- [x] 9.1 Add failing service and router tests for `g10.store-order-history.SC1`, `g10.store-order-history.SC2`, `g10.store-order-history.SC3`, `g10.store-order-history.SC5`, `g10.store-order-detail.SC1`, `g10.store-order-detail.SC2`, `g10.store-order-detail.SC3`, `g10.store-order-detail.SC5`, `g10.store-order-detail.SC7` and `g10.store-order-detail.SC8`. Assert matching first pictures, rereads, unchanged purchase facts, empty and malformed identities, valid POS variant identity without product identity, reordered/null catalogue nodes, repeated variants across orders, more than 250 distinct variants, bounded wait, partial batch failure and structured diagnostics. Land tests in their own commit before code and tick this task last.
- [x] 9.2 Add one image-only order enrichment beside `readOrder.ts`: deduplicate valid variant IDs across the complete order result, skip empty lookups, use batches of at most 250 with the existing chunk/deadline utilities, join returned IDs, and copy only the first current product picture. Preserve completed results on failures, log safe diagnostics and perform no network lookup inside a database transaction, making `g10.store-order-history.SC1`, `g10.store-order-history.SC2`, `g10.store-order-history.SC3`, `g10.store-order-history.SC5`, `g10.store-order-detail.SC1`, `g10.store-order-detail.SC2`, `g10.store-order-detail.SC3` and `g10.store-order-detail.SC5` pass.
- [x] 9.3 Invoke enrichment once after the existing buyer/list projections and after the private-link non-member projection. Keep the current member/link checks, legacy guest compatibility, admin grants, Audit behavior and admin-card omissions. Prove rejected reads do no image lookup and private links acquire no member-only points facts, making `g10.store-order-detail.SC7` and `g10.store-order-detail.SC8` pass; verify admin detail/card previews receive the same image fields through their existing reader.
- [x] 9.4 Verify focused order service/router tests, the saved decoder compatibility tests, affected backend/contract typechecks and backend lint. Compare image-enriched and image-free purchase facts without adding database migrations, cache, metrics or dependencies.

## 10. Customer order picture projections (grade10) (owner: @kinisworking)

Uses the landed group 8 types. This group uses typed procedure fixtures and
controlled image assets; group 9's running backend is not a dependency.

- [x] 10.1 Add failing projection and rendered-page tests for `g10.store-order-history.SC1`, `g10.store-order-history.SC3`, `g10.store-order-history.SC4`, `g10.store-order-history.SC6`, `g10.store-order-history.SC7`, `g10.store-order-detail.SC1`, `g10.store-order-detail.SC3`, `g10.store-order-detail.SC4`, `g10.store-order-detail.SC6`, `g10.store-order-detail.SC7` and `g10.store-order-detail.SC9`, including absent, empty and whitespace-only alt text, meaningful alt text and repeated variants with different recorded titles. Land tests in their own commit before code and tick this task last.
- [x] 10.2 Forward optional image props through `toOrderHistorySummary` and `toOrderDetailsProjection`; use each recorded item title for blank alt text and preserve meaningful supplied alt text and URLs. Keep placeholder behavior and existing facts unchanged so `g10.store-order-history.SC1`, `g10.store-order-history.SC3`, `g10.store-order-history.SC4`, `g10.store-order-history.SC6`, `g10.store-order-detail.SC1`, `g10.store-order-detail.SC3`, `g10.store-order-detail.SC4` and `g10.store-order-detail.SC6` pass.
- [x] 10.3 Exercise the existing member pages, private-link page and admin customer preview through the shared customer components. Preserve link account-data restrictions and usable facts/actions on image-resource failure, making `g10.store-order-history.SC7`, `g10.store-order-detail.SC7` and `g10.store-order-detail.SC9` pass without shared block redesign or new copy.
- [x] 10.4 Verify focused production-decoder, projection, member/private-link page and admin-preview tests; run affected frontend/admin typechecks and lint, then affected application builds. Preserve unrelated nested work if the accepted-contract handoff advances the shared submodule pin, and run `pnpm run check:submodules` when it does.

## 11. The walk - order pictures (grade10) (owner: @seankcw)

Uses draft `feature-tcs.md` as its planning input and groups 8-10 landed.
Existing groups 1-6 remain the delivered baseline. Walk every journey of every
capability in this change through its actor's interface, retaining the
existing order-facts and optional-section regression coverage.

- [x] 11.1 Keep the member history/sign-in/empty-account, owned-detail/sign-in and shared-detail journeys as end-to-end tests; add controlled loaded-picture walks for `g10.store-order-history.US5`, `g10.store-order-detail.US7` and `g10.store-order-detail.US8`. Include earlier purchases, two matching products, a changed first image on reread, absent pictures, blank alt text, picture lookup failure, legacy responses, rejected access and a failed image resource. Assert loaded dimensions for successful image assets and unchanged purchase facts and actions.
- [x] 11.2 Verify the existing admin customer detail/card preview against the same controlled item fixture and projection, preserving grants and Audit behavior; retain this as preview parity evidence rather than a new admin journey. Check the existing item frames at narrow and wide widths.
- [x] 11.3 In the walks' own commit, mark only the draft cases the walks decide automated with `pnpm run tcs:automated <case…> --decided-by grade10:<walk-path>`. Name remaining manual cases in the suite and the walk's `rounds.md` row; human execution follows deployment.
- [ ] 11.4 Verify the derived browser suite and focused contract/backend/frontend regressions, then the repository's change-sensitive validation gate. Record loaded-image evidence separately from any unperformed live-provider or deployment acceptance. - waived 2026-10-26 by @htonyl: CI checks are no longer needed; left unchecked and waived at archive by tasks_waived
