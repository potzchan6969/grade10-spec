## Context

The auction worker already has an authorization-hold switch and the standard
deployment sets it to disabled. The worker boundary passes that value into the
bid service, but the environment resolver and the service fallback currently
treat an absent value as enabled. Direct callers and tests therefore exercise
the hold path unless they opt out explicitly.

This change makes the disabled path the safe default at every auction entry
point, while keeping the existing hold state machine available for an explicit
rollout. A bid-time hold is an optional payment concern; winner invoice payment
remains a separate concern.

## Goals / Non-Goals

**Goals:**

- Make a missing or unknown hold flag resolve to disabled; only an explicit
  enable value selects the hold path.
- Accept ordinary bids and maximum commitments without creating or waiting for
  a bid-time authorization when the feature is disabled.
- Keep the existing one-hold lifecycle, provider refusals, release sweeps and
  winner settlement unchanged when the feature is enabled.
- Keep the existing bid-panel states and authorized handling while making the
  backend-selected no-hold path ready for the existing bid flow.
- Make tests state their payment mode explicitly so hold-specific coverage does
  not rely on a default that has changed.

**Non-Goals:**

- Do not remove the authorization-hold flag or the enabled hold path.
- Do not remove linked-card enrollment, age attestation, or the winner invoice
  payment flow.
- Do not add a database column, rewrite existing hold rows, or change the
  public bid input and result contracts.
- Do not redesign Stripe authorization, incremental authorization, or
  reconciliation behavior owned by the related changes.

## Decisions

### Use explicit opt-in semantics for the flag

- **Decision** — The effective flag is enabled only for the explicit enabled
  value (`"1"`). Missing, disabled (`"0"`) and unknown values all resolve to
  disabled.
- **Why** — A configuration omission must not make a money-moving provider
  call. The standard deployment already supplies `"0"`; treating only `"1"`
  as enabled also makes direct service and test callers safe by default.
- **Rejected alternative** — Keep the current `value !== "0"` resolver. It
  makes an unset production or test environment take the hold path and leaves
  future features coupled to an optional payment operation.

### Resolve the mode once and pass it through the bid service

- **Decision** — The worker resolves the flag once at the RPC boundary. The
  bid service fallback is `false`, and callers that intentionally exercise the
  optional hold path pass `true` explicitly.
- **Why** — One boolean controls first bids, maximum raises and automatic bid
  responses. Existing hold and no-hold branches remain in one service so the
  database transaction and cache purge rules cannot drift between modes.
- **Rejected alternative** — Infer the mode from card enrollment or Stripe
  capability. A linked card is still required for the current enrollment
  product and does not mean a bid-time hold is enabled.

### Keep hold rows as internal audit records in the disabled path

- **Decision** — The no-hold path keeps the existing bid/hold transition used
  to resolve a bid, but never creates a provider PaymentIntent. It returns the
  normal accepted-bid result and leaves the hold lifecycle, close and invoice
  code conditional on an actual provider authorization.
- **Why** — This preserves idempotency, cache invalidation and existing row
  boundaries without inventing a second bid contract or a destructive data
  migration.
- **Rejected alternative** — Delete hold rows or create a second bid model for
  hold-free bids. Both split the state machine and make related close,
  outbid and reconciliation behavior harder to reason about.

### Keep the bid-panel state machine

- **Decision** — Keep the current panel state set and visual groups. A
  successful card link enables the existing pre-bid controls immediately, and
  the first accepted bid moves directly to the existing `enrolled` state. The
  backend response determines whether an enabled provider authorization is
  pending or failed; the client does not add a no-hold state or infer the flag.
- **Why** — Card enrollment and bid authorization are separate backend
  decisions. Reusing the current state machine preserves the existing pending,
  refusal, retry and card-lock behavior.
- **Rejected alternative** — Add a client-side hold flag or a new no-hold
  panel state. That would duplicate backend configuration and make the panel
  capable of showing a state the bid service did not return.

## Service Interfaces

### Auction environment

- `AUCTION_AUTHORIZATION_HOLD_ENABLED` remains an optional string variable.
- The resolver returns a boolean with explicit opt-in semantics and is the only
  worker-to-service configuration seam.

### Bid service

- `authorizationHoldEnabled` remains an optional internal dependency field.
- Omitted means `false`; `true` is used only by the worker or an explicit
  hold-path test.
- `PlaceBidArgs`, procedure inputs and accepted-bid results remain unchanged.

### Listing composition and panel state

- `ListingViewCopy` remains the existing brand-owned composition boundary.
- Existing copy and authorized handling remain available to the composition.
- No new panel state, client-side hold flag, or public capability field is
  added.

## Code Map

- Auction flag and worker boundary — `packages/grade10-auction/backend/src/env.ts`, `packages/grade10-auction/backend/src/rpc/AuctionService.ts`, `apps/backend/grade10/auction/wrangler.jsonc`
- Bid mode and hold-free acceptance — `packages/grade10-auction/backend/src/services/bidding/placeBidAndConfirm.ts`, `packages/grade10-auction/backend/src/services/auctions/storefront.ts`
- Bid-panel state integration — `packages/grade10-auction/frontend/src/features/listings/presentation/views/ListingView.tsx`, `packages/grade10-auction/frontend/src/features/listings/presentation/views/ListingView.test.tsx`
- Behaviour coverage — `apps/backend/grade10/auction/test/db/bidding/`, `apps/backend/grade10/auction/test/db/stripe/registerHoldCapture.spec.ts`, `packages/grade10-auction/frontend/src/features/listings/presentation/views/ListingView.test.tsx`

## Risks / Trade-offs

- **Existing hold tests may rely on the old default** — Audit shared test
  helpers and pass `authorizationHoldEnabled: true` in hold-specific cases;
  keep the no-hold cases omitted or explicitly false.
- **An unknown flag value now disables holds** — This is a deliberate fail-safe;
  deployment validation should use `"1"` or `"0"` and the resolver tests pin
  both values and the missing-value case.
- **Client and backend state can drift** — Keep authorization selection in the
  backend response and reuse the existing panel states; do not introduce a
  second client-side capability signal.
- **Existing holds outlive the rollout switch** — Close, release and invoice
  paths continue to inspect actual persisted hold/provider state, so disabling
  new holds does not rewrite or strand an existing authorization.

## Migration Plan

- Ship the resolver, service fallback, panel-state verification and focused
  tests together.
- No database migration is required. Existing hold rows and provider
  references continue through their current lifecycle.
- Rollback can restore the previous resolver without changing stored bids or
  Stripe objects; any hold already created remains managed by the
  existing release and settlement workers.
