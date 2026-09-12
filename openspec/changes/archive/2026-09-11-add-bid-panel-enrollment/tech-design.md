## Context

- **Current surface** — `@grade10/auction-frontend/listings` renders the lot page and owns the bid-panel state passed to `@grade10/ui`; the Grade10 app supplies session state, copy, and the provider-owned `PaymentMethodField`
- **Existing payment boundary** — `registerBidder` creates the provider setup session, the browser-owned field confirms it and returns only an opaque provider method reference, and `placeBid` owns the listing lock, bid, hold record, and idempotent bid outcome
- **Existing persistence gap** — `bidder_listing_payment_methods` is currently written inside `placeBid`; it has no editable-before-first-bid lifecycle, safe display projection, account-attestation ownership, or explicit lock marker
- **Public/authenticated split** — the public listing response remains cacheable and contains no collector payment state; an authenticated enrollment read supplies the signed-in collector's safe card projection and lot-specific lock state
- **Shared exports** — `EnrollmentSetupSheet`, `PaymentMethodRow`, and `PaymentMethodEmptyState` already exist in the spec store's `@grade10/ui` package, and `ListingAuctionBidCard` already accepts the `signed-out` / `ready` enrollment signal
- **Sources of truth** — [bid-panel enrollment spec](specs/grade10-site/auction/bid-panel-enrollment/spec.md), [shared listing UI contract](specs/shared/ui/auction-listing/spec.md), and [UI design map](ui-design.md)

## Goals / Non-Goals

**Goals:**

- **Durable enrollment** — persist one collector's opaque payment-method reference and safe display projection per listing, allow replacement while editable, and retain a locked record after the first accepted bid
- **Account attestation** — persist the once-per-account age-attestation fact as a nullable `age_attested_at` timestamp on the authenticated bidder/account record
- **Authenticated projection** — provide an authenticated listing-enrollment read with `unenrolled`, `editable`, and `locked` outcomes without adding payment data to public listing state or browser caches shared with anonymous readers
- **Controlled composition** — keep session, enrollment completion, provider integration, and the opaque method reference in the consumer while passing only display data, lifecycle flags, and callbacks to shared blocks
- **Stable bid path** — preserve the existing authenticated auction procedure and its opaque payment-method boundary after enrollment completes; later maximums use the locked listing enrollment
- **Atomic lock** — make the first accepted bid and the transition from editable to locked one transactionally ordered listing operation, with an explicit rejection for replacement after lock
- **Testable transitions** — make dismissal, completion, card change, persistence after reload, first-bid locking, provider pending, and provider refusal observable at the service and component boundaries

**Non-Goals:**

- **Payment model** — no new authorization, hold, provider, or card-persistence model beyond the changes needed to attach an editable/locked enrollment lifecycle to the existing auction payment boundary
- **Account payment manager** — no cross-listing saved-card management surface; the account-level change is limited to the authoritative attestation fact and the provider's existing bidder record
- **Visual variants** — no new design-system token, primitive variant, or local styling; the existing shared exports and Storybook/preview states remain the visual source
- **Public listing expansion** — no card brand, last digits, enrollment status, or attestation field in `PublicListingState` or another anonymous/cacheable listing response

## Decisions

### Backend-owned durable enrollment, consumer-owned render fold

- **Decision** — the auction backend owns the authoritative per-listing enrollment record in `bidder_listing_payment_methods`. Add the editable/locked lifecycle, opaque provider method reference, safe masked-card projection or server-owned lookup, and lock metadata such as `lockedAt` and the first accepted bid id; test data may be pruned while the schema is introduced because the app is not launched
- **Decision** — the authenticated enrollment read returns only the safe projection needed by the listing: `unenrolled`, `editable`, or `locked`, masked brand/last digits when enrolled, whether account attestation is already recorded, and no provider secret or card details
- **Decision** — `ListingView` owns the render fold over session, authenticated enrollment read, listing standing, setup mode, provider lifecycle, and mutation outcomes. Shared UI receives the resulting posture and callbacks; it never fetches or persists product state
- **Alternative rejected** — treating `paymentMethodLinked` as a local display seed or adding enrollment to the public listing response would lose state on reload and leak collector-specific payment information across anonymous caches

### Account attestation has one authoritative owner

- **Decision** — the first successful enrollment writes the once-per-account age-attestation fact through the authenticated bidder/account boundary. Later enrollment reads use that fact to pre-check setup; unchecking it makes the current enrollment attempt ineligible even when the account was previously attested
- **Field** — the bidder/account record stores nullable `age_attested_at`. A successful enrollment upsert sets it when the attestation control is checked, and the authenticated enrollment read returns whether it is non-null so later setup can pre-check the control
- **Invariant** — no listing row copies the attestation as its own source of truth; an enrollment record may record audit timestamps, but the account-level fact remains authoritative

### Provider integration stays behind a provider-neutral composition seam

- **Decision** — retain the application-owned `PaymentMethodField` adapter. It receives the existing setup session and reports provider mount readiness, pending/refused lifecycle, and an opaque method id through callbacks. Card details, provider SDK objects, client secrets, and card data never enter `@grade10/ui`
- **Shared contract required by implementation** — `EnrollmentSetupSheet` needs a provider-neutral `paymentField` render slot plus controlled `cardReady`/provider lifecycle inputs, `authorizing`, `authorizationRefused`, and `onContinue`/`onOpenChange` callbacks. These existing component inputs render the `authorization-in-progress` and `authorization-failed` consumer states; the shared sheet gates Continue on `cardReady` and attestation but does not own or simulate provider completion
- **Compatibility note** — the active shared-ui requirement names `requiresIframeLink` and `iframeLinkedPayment`, while the current production adapter exposes `onSubmitReady` and provider state. The implementation must reconcile those names with the provider-neutral slot before coding. This is a ❓ requirement-contract TBC, not a permission to pass card details through shared UI
- **Authorization handling** — provider pending maps to `authorization-in-progress`; provider or enrollment-write refusal maps to `authorization-failed`; the collector's lot, maximum, and setup draft remain available for correction and retry
- **Alternative rejected** — putting Stripe or another provider in `@grade10/ui`, or keeping a simulated iframe as the production completion path, would make the shared package provider-specific and would not mount the real adapter

### Enrollment state machine

The UI fold distinguishes provider mount readiness, an opaque confirmed method id, persisted enrollment, and bid lock. A confirmed method id is transient consumer state; only the authenticated enrollment write creates or replaces durable enrollment.

| State | Source of truth | Allowed event and transition | Side effect | Dismissal / retry |
| --- | --- | --- | --- | --- |
| `signed-out` | Session boundary | Sign in → `setup-first` after authenticated read | Call the app sign-in flow; keep setup closed | No enrollment mutation |
| `setup-first` | Authenticated enrollment read returns no row | Primary bid or empty link → `setup-in-progress` | Keep setup closed until the collector starts first-link setup; do not call `placeBid` | No enrollment mutation |
| `setup-in-progress` | Consumer first-link setup mode plus provider slot and attestation control | Provider mount ready → remain setup; provider confirms opaque id and attestation is checked → `authorization-in-progress` | Keep method id in consumer memory; submit idempotent enrollment upsert | Close → `setup-first`; refusal → `authorization-failed` |
| `setup-editable` | Consumer change-card setup mode for an editable enrollment | Provider mount ready → remain setup; provider confirms replacement id and attestation is checked → `authorization-in-progress` | Show prior masked card; submit replacement upsert with idempotency key | Close → `authorization-editable`; refusal → `authorization-failed` |
| `authorization-in-progress` | Enrollment mutation or provider confirmation in flight | Success → `authorization-editable`; refusal or timeout → `authorization-failed` | Disable provider field and attestation; preserve draft and refetch authenticated projection on success | No dismissal while the mutation is in flight; retry from the matching setup mode after failure |
| `authorization-failed` | Consumer mutation outcome, not durable enrollment | Correct provider/attestation or retry → `setup-in-progress`/`setup-editable` | Show inline failure; leave controls interactive and do not overwrite the last durable row | Close → prior durable state (`setup-first` or `authorization-editable`) |
| `authorization-editable` | Authenticated enrollment read returns an editable row | Primary bid → existing bid flow; Change → `setup-editable`; first accepted bid → `enrolled` | Use the persisted opaque method id; do not reopen setup for a normal maximum | Refresh/read after enrollment, change, or bid outcome |
| `enrolled` | Authenticated enrollment read returns a locked row or bid-lock mutation | Later maximum → existing auto-bidding/bid-payment-method flow | Hide Change; reuse the committed method; never replace the row | Refresh/read only; no card-change retry on this listing |

Provider mount readiness (`mounting`, `ready`, `refused`) is separate from a confirmed opaque method id. The provider adapter may report `ready` before confirmation; that event alone never creates enrollment or enables Continue unless the shared sheet's controlled `cardReady` contract defines it as sufficient for the current provider flow.

### Lock ownership and transaction boundary

- **Decision** — lock the enrollment at the first accepted bid submission: the transaction holding the listing lock verifies an editable enrollment, creates the accepted bid's pending record, and marks that listing enrollment locked before commit. In this design, “accepted” means the auction procedure accepted the maximum and created the pending bid; external provider confirmation of the hold remains asynchronous and does not reopen card choice
- **Existing procedure correction** — `placeBid` currently inserts `bidder_listing_payment_methods` before `insertBid`. The implementation must move to an explicit enrollment lifecycle: enrollment upsert can replace an editable row; the bid transaction locks the row and rejects a replacement after the first accepted bid. The existing hold/reconcile behavior remains outside the network confirmation boundary
- **Concurrency** — serialize enrollment change and first bid through the listing/enrollment row lock. A change racing the first bid either commits before the bid and is the method used, or receives the locked refusal; it must never produce two active methods
- **Outcome union** — the enrollment procedures and bid procedure must expose typed success/refusal outcomes for backend projections `unenrolled`, `editable`, and `locked`, `ATTESTATION_REQUIRED`, `ENROLLMENT_LOCKED`, provider-not-ready/refused, bidder-unavailable, and idempotency conflict. Exact discriminant names should follow existing auction contract conventions and are ❓ TBC until the contract task is reviewed

## Service Interfaces

The change adds enrollment boundaries around the existing bidder and auction procedures. None of these interfaces sends card details to Grade10.

| Boundary | Input | Success / refusal | Responsibility |
| --- | --- | --- | --- |
| Grade10 app → `registerBidder` | Authenticated bidder identity and sandbox/live mode | Existing setup-session result or bidder-unavailable refusal | Upsert bidder identity and create the provider setup session; no listing enrollment is written |
| Browser `PaymentMethodField` → provider | Setup-session data, hosted field input | Provider mount-ready, pending, refused, or opaque method id | Provider-owned confirmation; the browser returns only the opaque method id to the consumer |
| Provider webhook → bidder reconciliation | Provider event id and setup/payment-method event | Idempotent acknowledgement or retryable refusal | Persist provider-authoritative bidder payment state and safe display projection; webhook retries must not duplicate records |
| Authenticated listing → enrollment read | Session, storefront, user, listing id | `unenrolled`, `editable`, `locked`, or authenticated refusal | Read the safe per-listing projection; never read from the public listing payload |
| Authenticated listing → enrollment upsert/change | Session, listing id, opaque method id, attestation assertion, idempotency key | Editable enrollment projection or `ATTESTATION_REQUIRED`, `ENROLLMENT_LOCKED`, provider-not-ready/refused, bidder-unavailable, or idempotency refusal | Create or replace the editable per-listing row, update the account attestation through its authoritative owner, and return safe display data |
| `placeBid` → listing/enrollment transaction | Listing id, maximum, authenticated bidder, existing enrollment reference | Existing `PlaceBidOutcome`, plus typed enrollment/lock refusal where applicable | Under the listing lock, require an enrollment, create the pending accepted bid, and mark the enrollment locked atomically; create the hold record without waiting on provider network confirmation |
| Later maximum → auto-bidding / bid-payment-method | Existing locked listing enrollment and maximum | Existing maximum/hold outcome | Reuse the committed opaque method; never reopen setup or accept a replacement method |

The browser refetches the authenticated enrollment projection after enrollment upsert, replacement, and bid outcomes. Provider confirmation and the enrollment upsert are the enrollment commit boundary; webhook reconciliation is asynchronous and does not gate the UI. The UI enters `authorization-editable` only after the upsert returns the safe projection, and otherwise remains `authorization-in-progress` during the request or enters `authorization-failed` without claiming a durable linked card.

## Risks / Trade-offs

- **Provider field and shared sheet can drift** → complete the provider-neutral slot contract before implementation, keep the adapter behind `PaymentMethodField`, and exercise mount, confirmation, pending, refusal, and retry states in shared stories and the provider test adapter
- **Webhook reconciliation can finish after enrollment** → treat provider confirmation plus the enrollment upsert as the UI commit, reconcile webhook events asynchronously and idempotently, refetch the safe projection after enrollment mutations or later reads, and never fabricate masked-card data
- **A stale public listing or standing could expose private state** → keep enrollment reads separate from `PublicListingState`, key client caches by authenticated identity, and derive editability from the latest enrollment read plus first-bid state
- **Concurrent change and bid could split the method used for the hold** → hold the listing/enrollment row in one transaction and make the lock transition the only authority for replacement rejection
- **Local setup state is lost on reload** → durable enrollment is read from the authenticated procedure on every listing composition; only an in-flight provider method id and unsaved draft are intentionally local
- **No Figma frame exists for the surface** → review the named Storybook and preview stories in `ui-design.md` and keep any visual change in the design-system/spec-store lane

## Migration Plan

1. **Data and contract migration** — add the editable/locked lifecycle and safe projection to `bidder_listing_payment_methods`, add nullable `age_attested_at` to the bidder/account record, add authenticated enrollment read/upsert outcomes, and add idempotency plus lock checks. Apply the migration to a clean test database; test data may be pruned because the app is not launched. Do not add enrollment fields to public listing state
2. **Provider reconciliation** — connect the existing `registerBidder` setup session, browser-owned provider confirmation, and webhook reconciliation to the enrollment write without moving provider details into shared UI
3. **Bid lock integration** — update `placeBid` so the listing lock, enrollment lock, pending accepted bid, and hold-record creation have the defined ordering; preserve asynchronous external hold confirmation and existing later maximum behavior
4. **Application wiring** — implement the state machine in the auction frontend, hydrate/refetch authenticated enrollment data, mount the provider-neutral setup slot, and route setup completion through enrollment upsert rather than placing a bid
5. **Verification** — apply migrations to a clean test database and run OpenSpec/manual checks, backend migration and contract tests, auction frontend unit tests, shared UI story tests, typecheck/lint, and targeted E2E cases for setup-without-bid, dismissal, reload persistence, replacement before lock, lock after first accepted bid, provider refusal/retry, and opaque-ID-only transport
6. **Rollback** — disable the new setup entry point and use the repository's normal migration rollback procedure
