**Author:** @htonyl - 2026-09-10

## Why

A collector who raises a maximum after the first card hold can receive a Stripe `payment_intent_unexpected_state` error because the existing manual-capture intent is already in `requires_capture`; the failed request can leave the attempted bid pending, so the next action says that a pending bid is still confirming. The change should make every terminal provider refusal resolve to a visible auction outcome while preserving the prior accepted maximum and its authorization.

**Measurement:**

- **Terminal raise resolution** — 100% of provider refusal responses leave the attempted raise in a terminal state after the request completes.
- **Stale pending raises** — zero subsequent bid attempts blocked by a pending row created by a completed provider refusal.

## What Changes

- **Existing authorization raises** — use the provider's incremental-authorization operation to raise one existing hold to the new maximum, rather than treating a captured-state PaymentIntent as an ordinary amount update or creating a second hold.
- **Eligible authorization windows** — request incremental authorization and an extended authorization window when the provider and card support them; record and follow the provider's returned authorization deadline.
- **Controlled refusal** — convert an unsupported or unexpected provider authorization state into the existing card-refused auction outcome; keep the prior maximum and active authorization unchanged, and resolve the attempted raise instead of leaving it pending.
- **Idempotency** — preserve one provider payment reference and one active authorization per bidder and listing across retries and repeated provider outcomes.

## Non-Goals

- **Cancel-and-recreate raises** — do not cancel a usable existing authorization and create a new one for an ordinary maximum raise.
- **Fourteen-day guarantee** — `if_available` extended authorization is a provider-eligibility request, not a guarantee that every card remains authorized for fourteen days after scheduled close; the provider's returned deadline remains authoritative.
- **Post-close settlement redesign** — do not retain the live bid hold after auction close or replace the existing winner-invoice settlement path with capture of the bid-time authorization.
- **New payment setup** — do not add a card-selection or confirmation modal to the raise flow.
- **New UI component** — reuse the existing bid refusal and pending states; this change fixes their state transitions rather than adding a visual surface.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/bid-payment-method`: raise an existing authorization through incremental authorization, request an eligible extended window, and resolve terminal provider refusals without stale pending bids.

## Impact

- **Shared Stripe contracts** — add the provider outcome and operation needed for incremental authorization, plus optional creation requests for incremental and extended authorization.
- **Auction backend** — adapt hold creation and raise handling, map unexpected provider state to a controlled refusal, and preserve the existing bid and hold state machine.
- **Auction UI state** — consume the existing refusal and pending outcomes; no new component or copy contract is required.
- **Persistence** — no schema migration; existing bid and payment-hold states remain authoritative.
- **Validation** — update provider adapter, fake-provider, auction state-machine, and full auction database-lane tests.

No domain impact: the existing auction domain suite already covers the composed
first-bid, maximum-raise, outbid, and payment-refusal paths; this change adds
provider-state resolution within the bid-payment-method capability and does
not introduce a new cross-capability path.
