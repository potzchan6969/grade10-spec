## 1. Grade10 Cart Drawer UI copy (grade10-spec) (owner: @kinisworking)

- [x] 1.1 Add and register a Grade10 brand `store` catalog overlay for `en`, `zh-Hant`, and `zh-Hans` with the `CartDrawerCopy` header, item, footer, and cleanup vocabulary, while reusing the existing shared `chrome.cartLabel` for navigation.
- [x] 1.2 Make catalog resolution prove the Cart Drawer vocabulary for every supported Grade10 locale, including existing shared fallback behavior; verify with the affected `@grade10/i18n` tests, typecheck, and build.

## 2. Cart Drawer UI and existing Store integration (grade10) (owner: @kinisworking)

This group depends on the landed catalog commit and integrates the UI with the
existing typed Store cart/review backend boundary. It makes no backend changes
and tests against typed fixtures rather than a running backend.

- [x] 2.1 Advance `external/grade10-spec` to the landed catalog commit while preserving unrelated nested work, and make `pnpm run check:submodules` pass.
- [x] 2.2 Add backwards-compatible `enabled` and `removeUnavailable` options to `useCartReview`; when the drawer disables removal, preserve unavailable lines for `CartDrawer`, while checkout defaults remain unchanged. Make `grade10-site-store-cart-drawer-SC-04` through `grade10-site-store-cart-drawer-SC-08` pass in focused hook tests without changing the `grade10-site/store/cart-validation` meaning of an open-time read.
- [x] 2.3 Add one root host for the signed-in member drawer with `Nav.onCartClick`, one `Toast`, the current member cart, controlled live-review loading, and one localized failure toast per open. Make `grade10-site-store-cart-drawer-SC-01`, `SC-02`, and `SC-04` through `SC-08` pass in focused shell tests. Cart availability cases `grade10-site-site-page-shell-SC-09` and `SC-16` belong to durable `grade10-site/site/page-shell`.
- [x] 2.4 Map reviewed lines and the minor-unit subtotal into the existing drawer contract (after `cart-drawer-empty-state`), omit images and unsupported calculation fields, render shipping as localized `Calculated at checkout`, use subtotal as estimated total, supply `emptyTitle` / `emptyDescription`, and supply no points state or promo callbacks. Let `CartDrawer` own unavailable cleanup and its one toast so `grade10-site-store-cart-drawer-SC-09`, `grade10-site-store-cart-drawer-SC-10`, `grade10-site-store-cart-drawer-SC-12`, `shared-ui-store-cart-SC-10`, and `shared-ui-store-cart-SC-11` pass without duplicate writes.
- [x] 2.5 Wire quantity and removal actions to the scoped cart, product line activation to existing Store product addresses, and Checkout to `/checkout`. Make `grade10-site-store-cart-drawer-SC-11`, `grade10-site-store-cart-drawer-SC-13`, and `grade10-site-store-cart-drawer-SC-15` pass without changing cart persistence, backend contracts, or checkout creation.
- [x] 2.6 Verify the affected Grade10 app with focused cart, shell, route, and locale tests, `pnpm run typecheck`, `pnpm run lint`, and `pnpm run build`; do not run `pnpm run test:backend` because this change has no backend files.

## 3. Cart Drawer product record (grade10-spec) (owner: @kinisworking)

This group was appended to preserve the claimed group and task ids above. Land
it before publishing the final Grade10 gitlink.

- [x] 3.1 Publish the Cart Drawer manual page and update the page-shell and cart-validation records to match `grade10-site-store-cart-drawer-SC-01` through `grade10-site-store-cart-drawer-SC-13`, `grade10-site-store-cart-drawer-SC-15` through `grade10-site-store-cart-drawer-SC-19`, `grade10-site-site-page-shell-SC-09`, and `grade10-site-site-page-shell-SC-16`; make `pnpm check:manual` pass.
- [ ] 3.2 Add the Cart Drawer acceptance shelf once its spec is durable, so the approved suite is reachable from the page.
- [ ] 3.3 Re-verify `openspec validate add-store-cart-drawer-ui --strict` and
  `pnpm run tcs:validate` after the Cart Drawer feature suite represents the
  new US-04 journey; the current suite predates that journey.

## 4. Cart Drawer read-only tender context (grade10) (owner: @kinisworking)

This group consumes the existing Checkout read hooks and shared Cart Drawer
props. It does not add a combined quote, mutate a promo or points balance, or
change checkout creation. If the shared component renders a mutation control
when its callback is absent, stop and raise that as a separate shared UI
contract change rather than hiding it in the application adapter.

- [x] 4.1 Add an optional `enabled` condition to `useSpendableCoupons` and `usePointsTender` with their current enabled behavior preserved for Checkout; gate the drawer reads to an open, signed-in, non-empty cart whose current review is successful and ready, so `grade10-site-store-cart-drawer-SC-18` cannot trigger member-only reads while the review is unresolved. Signed-out access is covered by `require-sign-in-from-nav-cart`.
- [x] 4.2 In `CartDrawerHost`, key both reads from `review.items`, map successful coupon answers to held promo-code display data with localized value/expiry text and refusal reasons, map a quoted points answer to the existing collapsed points state plus a localized balance/ceiling label while reusing the existing rate copy, and pass `selectedHeldPromoId={null}` with no apply/select callbacks; make `grade10-site-store-cart-drawer-SC-16` and `grade10-site-store-cart-drawer-SC-17` pass while subtotal and estimated total remain the reviewed subtotal.
- [x] 4.3 Reset disclosure state and suppress prior read results on close, scope changes, cart edits, review refetches, and optional-read failures; prove that only the latest successful reviewed basket supplies tender context for `grade10-site-store-cart-drawer-SC-18` and `grade10-site-store-cart-drawer-SC-19` in focused hook and shell tests.
- [x] 4.4 Verify the affected Grade10 frontend with the focused Cart Drawer and checkout-hook tests, `pnpm run typecheck`, `pnpm run lint`, and `pnpm run build`; do not run `pnpm run test:backend` because this group adds no backend files.

## 5. Interactive Cart Drawer points (grade10) (owner: @kinisworking)

This user-approved increment supersedes Group 4's read-only points behavior.
Group 5 depends on Group 7 landing and its shared package being available.
Preserve completed task ids and existing promo editing; this points increment
neither adds nor removes promo callbacks. Existing Group 3.2
waits for archive and is outside this implementation increment.

- [x] 5.1 Make `grade10-site-store-cart-drawer-SC-20`, `grade10-site-store-cart-drawer-SC-23`, and `grade10-site-store-cart-drawer-SC-24` pass by exposing accepted completion, pending and failure from `useCartTender`, preserving existing callers and coupon choice. Include focused hook tests.
- [x] 5.2 Make `grade10-site-store-cart-drawer-SC-17` and `grade10-site-store-cart-drawer-SC-20` through `grade10-site-store-cart-drawer-SC-26` pass in the host with Apply, Use max, Remove, current quotes, persisted choice, pending guards and stale-result rejection. Pass Group 7's `tenderPending` across quote and persistence for points and existing promo actions. Include focused integration tests and supported-locale copy checks.
- [x] 5.3 Make `grade10-site-store-cart-drawer-SC-27` pass through reload and checkout handoff; preserve the selected code, re-quote and submit accepted spendPoints. Include checkout integration tests.
- [x] 5.4 Verify focused affected tests, repository typecheck, lint, test and build; compare the integrated drawer against the Default story at narrow and desktop widths with keyboard and locale checks. Record unavailable browser verification separately from passing local checks.

## 6. Interactive points product record (grade10-spec) (owner: @kinisworking)

Follows Group 5 delivery; Group 7 is the shared prerequisite, not a later phase.

- [x] 6.1 Keep the Cart Points and Checkout product record aligned with Group 5 delivery; validate the change, feature suite and manual. Preserve construction marks until deployment acceptance; do not archive as part of this increment.

## 7. Shared pending tender contract (grade10-spec) (owner: @kinisworking)

Prerequisite for Group 5; appended to preserve existing task ids.

- [x] 7.1 Make `shared-ui-store-cart-SC-37` through `shared-ui-store-cart-SC-39` pass with optional `tenderPending` on `CartDrawerProps` and `CartDrawerFooterProps`, forwarding it through the compound and disabling existing tender inputs/actions and Checkout, including an open promo sheet. Preserve callback absence guards and existing appearance; add focused component tests and pending stories in `cart-drawer.stories.tsx` and `cart-drawer-footer.stories.tsx`.
- [x] 7.2 Verify the affected shared component tests, typecheck and UI Storybook build; keep the shared Tender Actions product record aligned and validate this change and its suites before Group 5 consumes the shared package.

## 8. Checkout creation in the drawer (grade10) (owner: @sean)

Folded in from `move-checkout-into-cart-drawer` (2026-09-29): `grade10-site/
store/cart-drawer` has no durable spec yet, so that change's requirements
landed here rather than under a second owner. Supersedes Group 2's task 2.5
routing of Checkout to `/checkout` — `2.5` is left as the historical record
of what shipped then; this group replaces that wiring, not that task's text.
Independent of Groups 5–7 (points/promo editing is unaffected by this scope).

- [x] 8.1 In `CartDrawerHost`, replace `handleCheckout`'s navigation to
  `ROUTES.checkout` with a call to `useCreateCheckout` carrying the drawer's
  current reviewed `items`, accepted `quoted` tender (coupon, points) and
  `deviceId`. On success, show the shared component's `checkoutRedirecting`
  state and hand off to the returned hosted URL; the drawer performs no
  second live re-read of its own. Make `grade10-site-store-cart-drawer-SC-15`
  pass.
- [x] 8.2 Handle a checkout-creation refusal: when a line is named, show it
  in the drawer and offer retry with no order created; when no line is
  named, restore Checkout and show `checkoutFailed`. Make
  `grade10-site-store-cart-drawer-SC-28` and
  `grade10-site-store-cart-drawer-SC-29` pass.
- [x] 8.3 Add the verification-bar gate: when the reviewed basket's goods
  value meets or exceeds the bar (12000000 HKD minor units) and the member's
  standing is not verified, replace the Checkout action's area with the same
  threshold-and-link presentation `CheckoutPage`'s `VerifyPanel` renders
  today (linking to `addressOf("profile")` when `config.gates.profile` is
  set); a verified member or a basket under the bar proceeds without the
  gate. Start no identity check from the drawer itself. Make
  `grade10-site-store-cart-drawer-SC-30` through
  `grade10-site-store-cart-drawer-SC-33` pass.
- [x] 8.4 Remove `src/routes/checkout.tsx`, `src/pages/checkout/
  CheckoutPage.tsx`, the `/checkout` route and surface entry from
  `src/surfaces.ts` and `src/routes.ts`, and `e2e/tests/store/
  checkout.spec.ts`, folding its coverage into cart-drawer tests. Confirm no
  remaining reference to `addressOf("checkout")` or the `checkout` surface.
- [x] 8.5 Verify the affected Grade10 frontend with focused cart-drawer,
  route and e2e tests, `pnpm run typecheck`, `pnpm run lint`, and
  `pnpm run build`; do not run `pnpm run test:backend` because this group
  adds no backend files.

## 9. Checkout product record (grade10-spec)

- [x] 9.1 Mark the Cart Drawer and Checkout PRDs for direct checkout
  creation from the drawer — `docs/prds/products/grade10-site/store/cart.md`
  (`Carried to checkout` rule, `Checkout` section, `Checkout creation`
  decision row) and `docs/prds/products/grade10-site/store/checkout.md`
  (`Integration readiness`) — and validate with `pnpm check:manual`.

## 10. Shared cart picture coverage (grade10-spec)

This extension uses existing image props and presentation. Land shared
coverage upstream before Group 13 selects the application dependency; Groups
11-12 can proceed independently. Historical Groups 1-9 retain their addresses.

- [ ] 10.1 Add controlled-asset browser regressions, in their own commit before fixture/story implementation and ticked last, for supplied picture and alt text, omitted/empty alt, omitted/empty source and sold-out treatment (`shared-ui-store-cart-SC-64`, `shared-ui-store-cart-SC-65`, `shared-ui-store-cart-SC-66`). Assert image bytes load with positive natural width inside the matching item, including the existing aria-hidden thumbnail; cover the standalone item and composition through body/drawer.
- [ ] 10.2 Add shared Storybook picture fixtures/states and served deterministic assets using the existing `CartItemSummary` props, renderer, layout and callbacks so `shared-ui-store-cart-SC-64`, `shared-ui-store-cart-SC-65`, and `shared-ui-store-cart-SC-66` pass; keep shared product-picture PRD and design-state links aligned.
- [ ] 10.3 Verify: focused shared browser stories, `pnpm run test:stories:ui`, shared typecheck, UI Storybook build and planning/manual validation; record the upstream PR and verified merge result through the shared implementation publication workflow before application consumption.

## 11. Reviewed picture contracts and catalogue adapter (grade10)

Independent of shared story delivery. This group owns the runtime contracts
and first-picture batched catalogue read; no database migration is needed.

- [ ] 11.1 Add tests in their own commit before code and ticked last for first-image query/production decoding, normalized variants, empty images, nullable/empty alt and fixture parity (`grade10-site-store-cart-drawer-SC-34`, `grade10-site-store-cart-drawer-SC-35`, `grade10-site-store-cart-drawer-SC-41`); cover both production response decoders on legacy/enriched reviewed lines and refuse invalid supplied types (`grade10-site-store-cart-drawer-SC-39`, `grade10-site-store-cart-drawer-SC-40`). Preserve null, non-variant and malformed-identity behavior.
- [ ] 11.2 Extend the Shopify batched variant query, codec, normalized product image type and mapper with the first current product image, preserving catalogue URLs and one batch; update `FixtureCatalog` and hand-built/raw variant fixtures so `grade10-site-store-cart-drawer-SC-34`, `grade10-site-store-cart-drawer-SC-35`, and `grade10-site-store-cart-drawer-SC-41` pass.
- [ ] 11.3 Add optional reviewed-line image source and alt fields with legacy/enriched compatibility and invalid-type refusal so `grade10-site-store-cart-drawer-SC-39` and `grade10-site-store-cart-drawer-SC-40` pass; regenerate affected API references with the existing generator, without adding image fields to stored cart or write-input contracts.
- [ ] 11.4 Verify: focused Shopify adapter/fixture and Store contract suites, typecheck the changed contracts and consumers, inspect generated API-reference changes, and `git diff --check`.

## 12. Live review picture enrichment (grade10)

Depends on Group 11's runtime contracts and catalogue adapter. No shared UI
or running frontend is required for this group.

- [ ] 12.1 Add tests in their own commit before code and ticked last across real member/guest review serialization, quote/checkout reviewed-line responses, first image, empty/null alt, no image, unavailable variant and catalogue failure (`grade10-site-store-cart-drawer-SC-34`, `grade10-site-store-cart-drawer-SC-35`, `grade10-site-store-cart-drawer-SC-38`, `grade10-site-store-cart-drawer-SC-39`, `grade10-site-store-cart-drawer-SC-41`). Prove one catalogue batch and image-free cart intent/write inputs separately with runtime assertions (`grade10-site-store-cart-drawer-SC-37`); guest tests remain transport compatibility only.
- [ ] 12.2 Enrich each already-classified reviewed line from its matching live variant's first product picture and preserve optional fields through existing serializers so `grade10-site-store-cart-drawer-SC-34`, `grade10-site-store-cart-drawer-SC-35`, `grade10-site-store-cart-drawer-SC-38`, `grade10-site-store-cart-drawer-SC-39`, and `grade10-site-store-cart-drawer-SC-41` pass. Keep pricing/status/readiness classification and existing failure outcomes unchanged.
- [ ] 12.3 Preserve image-free persistence and mutation inputs through review and quantity changes so `grade10-site-store-cart-drawer-SC-37` passes; verify quote and checkout consumers retain existing amounts and outcomes.
- [ ] 12.4 Verify: focused cart-review, guest/member transport, quote and checkout suites with production decoders, the changed backend typechecks, and `pnpm run test:backend`; review the diff for extra catalogue requests, picture persistence or money/readiness changes.

## 13. Reviewed pictures in the application drawer (grade10)

Depends on Group 11's contracts and Group 10's merged upstream work before
the application selects its published main SHA. Frontend tests use decoded
fixtures; they do not depend on a running backend or Group 12's landing.

- [ ] 13.1 Add tests in their own commit before code and ticked last through production decoding, reordered ID joins, removed/unmatched/unreviewed lines and existing quantity/scope guards (`grade10-site-store-cart-drawer-SC-36`, `grade10-site-store-cart-drawer-SC-39`); prove presentation prop forwarding and alt fallback/no-picture cases (`grade10-site-store-cart-drawer-SC-34`, `grade10-site-store-cart-drawer-SC-35`, `grade10-site-store-cart-drawer-SC-41`), image-free intent restoration (`grade10-site-store-cart-drawer-SC-37`) and failed-review feedback (`grade10-site-store-cart-drawer-SC-38`).
- [ ] 13.2 Extend only the reviewed display model, explicitly copy image fields from the confirmed matching review line and forward them to the existing shared item props; align frontend transport fixtures so `grade10-site-store-cart-drawer-SC-34` through `grade10-site-store-cart-drawer-SC-39` and `grade10-site-store-cart-drawer-SC-41` pass. Preserve image-free stored intent and all existing counts, money and readiness guards.
- [ ] 13.3 Select the published grade10-spec main SHA containing Group 10's verified upstream merge, update only the application gitlink through the supported workflow while preserving unrelated nested work, and record the upstream PR/merge/SHA; make `pnpm run check:submodules` pass.
- [ ] 13.4 Verify: focused cart model, mapper, hook/fixture and app-host suites, affected typechecks, `pnpm check:quick`, application build and diff review after the pin moves; no new product query or image cache in the host or shared renderer.

## 14. The walk - Cart product pictures (grade10)

Uses the extension's draft suite as planning input once QA2 has reconciled it;
Groups 10-13 and the selected shared dependency are landed. This walk extends
the existing journeys without repeating older implementation phases.

- [ ] 14.1 Extend the existing isolated Store E2E suite for signed-in member cart open/edit/product continuation (`grade10-site-store-cart-drawer-US-01`, `grade10-site-store-cart-drawer-US-02`, `grade10-site-store-cart-drawer-US-03`) with seeded image-bearing and image-free products. Assert each matching thumbnail URL, `complete === true` and `naturalWidth > 0` at narrow and wide widths; cover restored image-free intent after reload, quantity change/reopen, sold-out picture, alt fallback and failed review (`grade10-site-store-cart-drawer-SC-34` through `grade10-site-store-cart-drawer-SC-39`, `grade10-site-store-cart-drawer-SC-41`). Exercise existing tender/checkout journeys (`grade10-site-store-cart-drawer-US-04`, `grade10-site-store-cart-drawer-US-05`, `grade10-site-store-cart-drawer-US-06`) to confirm image enrichment leaves their current amounts and guards intact.
- [ ] 14.2 Record browser evidence for the 2 reported products when their catalogue records exist, plus stable seeded regression evidence; missing products or local prerequisites are limitations, never skipped passing assertions. Keep batch-count, invalid-type and persistence proofs in runtime tests; browser evidence proves loaded image bytes. In the walk commit, mark only the draft cases its assertions decide automated with `pnpm run tcs:automated <case...> --decided-by grade10:<walk-path>`; name remaining manual cases in the suite and walk's rounds row for downstream human QA.
- [ ] 14.3 Cover the independently reconciled routes: retained sold-out picture (`grade10-site-store-cart-drawer-SC-42`), unavailable variant field omission and cleanup in review/drawer runtime tests (`grade10-site-store-cart-drawer-SC-43`), image-free persistence and write inputs (`grade10-site-store-cart-drawer-SC-44`), and browser picture-resource failure after accepted review (`grade10-site-store-cart-drawer-SC-45`). Keep these distinct from catalogue-review failure; require no new broken-image fallback presentation.
- [ ] 14.4 Verify: the focused isolated browser walk, the application validation gate and build after integration, shared dependency SHA, `git diff --check`, and the signed-out drawer on the cart this browser holds. Record actual commands, results, browser evidence and checks not run; this task grants no deployment or production-data operation.

## 15. Shared pending operation contract (grade10-spec)

Appended after completed groups to preserve their addresses. This shared
contract lands before Group 16 and the checkout pending integration consumes it.

- [ ] 15.1 Add failing shared interaction tests in their own commit before 15.2; tick this box last. Exercise compound and standalone body, item, footer and exported promo sheet. Prove every item/tender/disclosure/navigation action callback blocked by pointer, keyboard and input change; preserve scrolling and dismissal callbacks, including the sheet's collapsed-state proposal. Verify clearing under other guards, omitted/false inputs, legacy tender compatibility and a delayed removal crossing pending: `g10.shared-store-cart.SC64`, `g10.shared-store-cart.SC65`, `g10.shared-store-cart.SC66`, `g10.shared-store-cart.SC67`, `g10.shared-store-cart.SC68`, `g10.shared-store-cart.SC69`.
- [ ] 15.2 Make those tests pass with optional `interactionPending` on existing `CartDrawerProps`, `CartDrawerBodyProps`, `CartItemProps`, `CartDrawerFooterProps` and `CartPromoSheetProps`; forward it through the compound and public parts. Guard action callbacks and local edits, cancel an undispatched user-removal animation and check current pending at timer dispatch without replay. Preserve `tenderPending`, loading presentation, dismissal's collapsed-state proposal and close callbacks, and the existing read-driven unavailable cleanup: `g10.shared-store-cart.SC64`, `g10.shared-store-cart.SC65`, `g10.shared-store-cart.SC66`, `g10.shared-store-cart.SC67`, `g10.shared-store-cart.SC68`, `g10.shared-store-cart.SC69`.
- [ ] 15.3 Add pending compound/body/item/footer and exported open-sheet stories using existing controls and values; keep the Shared Pending Operations, Tender Actions and Cart Drawer product records aligned with the delivered contract under `docs/prds/`. Preserve construction marks until verified delivery.
- [ ] 15.4 Verify focused shared tests and story interactions, UI typecheck and Storybook build; validate this change and the manual before the consumer gitlink advances.

## 16. Drawer operation integration (grade10)

Depends on Group 15's landed shared contract and gitlink. Checkout request
and answer handling remain owned by `add-shopify-checkout-integration`; this
group maps its existing checkout mutation lifetime into the common guard.

- [ ] 16.1 Add failing host/hook tests in their own commit before 16.2-16.3; tick this box last. Delay current cart/review, saved tender and combined quote reads (held-code eligibility and points/ceiling included), cart writes, tender steps and checkout creation. Cover overlapping completion, terminal errors, disabled queries, same-turn actions, unrelated fetches, open-sheet callbacks and dismissal/reopen: `grade10-site-store-cart-drawer-SC-23`, `g10.store-cart-drawer.SC34`, `g10.store-cart-drawer.SC35`, `g10.store-cart-drawer.SC36`, `g10.store-cart-drawer.SC37`, `g10.store-cart-drawer.SC38`, `g10.store-cart-drawer.SC39`, `g10.store-cart-drawer.SC40`.
- [ ] 16.2 Advance the shared gitlink and expose additive actual `isFetching` in cart review, saved tender and basket quote hooks. Map all actual drawer reads/writes, tender proposal/persistence/confirmation and checkout creation into `interactionPending`, separate from skeletons and failed/current-data guards; retain same-member outstanding work on close/reopen without starting duplicate eligibility reads: `g10.store-cart-drawer.SC34`, `g10.store-cart-drawer.SC35`, `g10.store-cart-drawer.SC36`, `g10.store-cart-drawer.SC37`, `g10.store-cart-drawer.SC38`, `g10.store-cart-drawer.SC39`, `g10.store-cart-drawer.SC40`.
- [ ] 16.3 Guard host item, tender, disclosure and navigation callbacks before side effects, including synchronous duplicate activation. Retain accepted figures/values and tender-view scope/open-generation protections; checkout navigation uses its current-request guard under Q22. Release each operation on terminal completion and keep Retry and existing data guards after failure; replay no action: `grade10-site-store-cart-drawer-SC-23`, `g10.store-cart-drawer.SC35`, `g10.store-cart-drawer.SC36`, `g10.store-cart-drawer.SC38`, `g10.store-cart-drawer.SC39`, `g10.store-cart-drawer.SC40`.
- [ ] 16.4 Verify focused host and affected hook tests, Grade10/ZZZ compatibility typechecks and frontend change-sensitive validation from `docs/conventions/validation.md`; record unavailable browser gates separately.

## 17. The walk - pending drawer operations (grade10)

Uses draft `feature-tcs.md` as planning input after Groups 15-16 land, and
the checkout pending integration for its request-specific walk. Existing
journeys remain covered; the increment adds pending, recovery and dismissal.

- [ ] 17.1 Keep an end-to-end walk for every journey of cart-drawer and shared store-cart, including their existing durable journeys. Exercise current reads, line writes, tender changes, checkout creation, overlap/failure and pending dismissal at narrow and desktop widths: `grade10-site-store-cart-drawer-US-01` through `grade10-site-store-cart-drawer-US-06`, `g10.store-cart-drawer.US7`, `g10.store-cart-drawer.US8`, `g10.store-cart-drawer.US9`, `shared.ui-store-cart.US19`, `shared.ui-store-cart.US20`; preserve shared dismissal and the durable order-discount journey.
- [ ] 17.2 In the walks' own commit, mark only decided cases with `pnpm run tcs:automated <case…> --decided-by grade10:<walk-path>`; leave remaining manual cases draft and name them in the suite and the walk's `rounds.md` row.
- [ ] 17.3 Verify the focused Playwright walks, keyboard dismissal and locale coverage; record actual commands/results and any unrun external-provider checks separately from local fixtures.
