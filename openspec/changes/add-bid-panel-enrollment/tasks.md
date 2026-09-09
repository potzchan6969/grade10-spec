## 1. Shared UI contract and store records (grade10-spec)

- [ ] 1.1 Make `shared-ui-auction-listing-SC-15` through `SC-23` pass by keeping the enrollment blocks at the `@grade10/ui` public entry and adding a provider-neutral `paymentField` render slot with controlled provider/card-ready, authorizing, refused, and continue inputs; shared UI receives no card details and production code does not use simulated provider completion. Reconcile the slot's public prop names with the current `requiresIframeLink` / `iframeLinkedPayment` wording before implementation; ❓ do not silently diverge from the durable shared-ui requirement
- [ ] 1.2 Add Storybook and preview fixtures for signed-out, unenrolled, setup-first, setup-change, authorizing, refused, editable-card, and locked-card states, including provider mount-ready versus confirmed-method-id behavior
- [ ] 1.3 Update the `grade10-site/auction/bid-panel-enrollment` and `shared/ui/auction-listing` capability pages under `docs/prds/` to describe the shipped collector surface and shared block decision without duplicating requirements
- [ ] 1.4 Carry each delta's `## Feature set`, the `grade10-site/auction/bid-panel-enrollment/user-journeys.md`, and the reviewed `test-cases.md` into their durable capability locations when the change archives so the feature map, journey ids, and QA evidence survive the fold
- [ ] 1.5 Verify: `openspec validate add-bid-panel-enrollment --strict`, `pnpm run check:manual`, `pnpm run tcs:validate`, and `pnpm run test:stories:ui`

## 2. Durable enrollment, backend procedures, and contracts (grade10)

- [ ] 2.1 Evolve `bidder_listing_payment_methods` or document a reviewed replacement record with an editable/locked lifecycle, safe masked-card projection, lock metadata, and a unique storefront/user/listing key; migrate legacy rows created by the current bid path as locked when an existing bid proves the binding, and fail closed for ambiguous rows
- [ ] 2.2 Choose and implement one authoritative account/bidder owner for once-per-account age attestation, with an authenticated read/write contract; do not duplicate attestation as a public listing field or a competing per-listing source of truth
- [ ] 2.3 Add authenticated enrollment read and upsert/change procedures returning typed `unenrolled`, `editable`, and `locked` projections plus explicit attestation-required, locked, provider-not-ready/refused, bidder-unavailable, and idempotency-conflict refusals; accept only opaque provider method references and idempotency keys
- [ ] 2.4 Reconcile `registerBidder`, browser provider confirmation, and webhook persistence so setup-session creation, provider confirmation, and safe display projection are retryable and idempotent; keep provider SDK objects, client secrets, and card data outside shared UI
- [ ] 2.5 Update `placeBid` and the listing/enrollment transaction so the first accepted bid means the accepted maximum creates its pending bid and atomically locks the editable enrollment before commit; reject replacement after that lock, preserve the existing asynchronous hold confirmation, and reuse the locked method for later maximums
- [ ] 2.6 Verify: `pnpm --filter @grade10/auction-backend run test`, `pnpm --filter @grade10/auction-backend run typecheck`, `pnpm --filter @grade10/auction-contracts run test`, `pnpm --filter @grade10/auction-contracts run typecheck`, and migration/schema checks for the affected database package

## 3. Enrollment state and frontend contracts (grade10)

- [ ] 3.1 Make `grade10-site-auction-bid-panel-enrollment-SC-01` through `SC-11` pass by implementing the explicit consumer state machine: `signed-out`, `unenrolled`, `setup-first`, `setup-change`, `authorizing`, `authorization-refused`, `enrolled-editable`, and `enrolled-locked`
- [ ] 3.2 Add the authenticated enrollment read to the listing composition and keep it separate from the public listing response; hydrate/refetch after enrollment upsert, replacement, and bid outcomes, and pass only safe masked-card data, attestation status, editability, and callbacks to `@grade10/ui`
- [ ] 3.3 Connect the application-owned `PaymentMethodField` through the provider-neutral setup slot. Keep provider mount readiness distinct from confirmed opaque method id, disable the adapter during authorization, map provider refusal to the refused state, and retain the setup/bid draft for correction and retry
- [ ] 3.4 Make `shared-ui-auction-listing-SC-18` through `SC-21` pass at the auction frontend seam by mapping consumer-owned card summaries, `onChange` eligibility, standing content, and the signed-out enrollment signal without adding fetches or product state to `@grade10/ui`
- [ ] 3.5 Verify: `pnpm --filter @grade10/auction-frontend run typecheck`, `pnpm --filter @grade10/auction-frontend run test`, the affected listing stories, and package import/module tests

## 4. Listing enrollment flow and cross-layer acceptance (grade10)

- [ ] 4.1 Make `grade10-site-auction-bid-panel-enrollment-SC-01`–`SC-06` pass: sign-in while signed out, setup instead of place bid for an unenrolled collector, card-and-attestation gating, dismissal with no durable write, idempotent completion, and linked-card projection after refetch
- [ ] 4.2 Make `grade10-site-auction-bid-panel-enrollment-SC-07`–`SC-09` pass: change before the first bid, prior masked card from the authenticated read, reusable setup copy, and pre-checked account attestation that can still be unchecked
- [ ] 4.3 Make `shared-ui-auction-listing-SC-22` and `SC-23` pass: provider pending/refusal enters the setup state, locks controls only while authorizing, retains the draft, and leaves correction controls available after refusal
- [ ] 4.4 Make `grade10-site-auction-bid-panel-enrollment-SC-10` and `SC-11` pass: lock Change at the first accepted bid transaction, keep the committed card visible, and route later maximums through `grade10-site/auction/auto-bidding` and `grade10-site/auction/bid-payment-method` without reopening setup
- [ ] 4.5 Extend the targeted E2E flow to cover setup-without-bid, dismissal, reload-safe enrollment, replacement before lock, lock after the accepted bid/pending-bid transition, provider refusal and retry, and opaque-method-id-only transport; do not reuse the old one-dialog setup-and-place-bid assertion as the only proof
- [ ] 4.6 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, affected listing view stories/tests, and `pnpm --dir apps/frontend/grade10 run e2e -- e2e/tests/auction-bid-enrollment.spec.ts`
