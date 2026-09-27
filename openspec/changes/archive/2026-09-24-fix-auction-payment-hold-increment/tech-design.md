## Context

The [bid-payment-method delta](specs/grade10-site/auction/bid-payment-method/spec.md)
changes the raise path for an existing manual-capture authorization. The
current auction service creates a replacement pending bid before it calls the
payment provider; the prior hold remains the live authorization until the
provider confirms the higher amount. An ordinary PaymentIntent amount update
cannot change an intent already in requires_capture, so the shared Stripe
client needs a separate incremental-authorization operation.

The auction already stores the provider payment reference and the provider's
returned capture deadline on the hold. No new database fact is needed. Close
continues to release live bid holds and the winner remains settled through the
invoice flow.

## Goals / Non-Goals

**Goals:**

- Keep one provider payment reference and one active authorization per bidder
  and listing.
- Make a supported raise use the provider's incremental-authorization
  operation with the new total amount.
- Resolve the exact unexpected-state refusal as a normal auction decline while
  preserving the prior hold and maximum.
- Keep the provider's returned capture deadline authoritative for reauthorization
  and expiry.
- Preserve deterministic retries through the existing idempotency-key and hold
  locking seams.

**Non-Goals:**

- Do not fall back to cancel-and-create for a raise.
- Do not force issuer eligibility or promise a fourteen-day authorization
  window when the provider returns a shorter deadline.
- Do not retain the winner's bid hold after close or capture it for invoice
  settlement.
- Do not add a UI component, payment modal, or new copy key.

## Decisions

### Use a dedicated provider operation

- **Decision** — Add an additive shared Stripe-client operation whose amount is
  the new authorization total, then adapt it through the auction Stripe port.
- **Why** — Stripe treats an already-authorized manual-capture intent as a
  different state from an ordinary pre-confirmation amount update. Keeping the
  distinction in the shared contract prevents callers from retrying the wrong
  endpoint.
- **Rejected alternative** — Continue calling the ordinary amount-update
  operation. It reproduces the requires_capture failure.
- **Rejected alternative** — Cancel the old intent and create a new hold. It
  risks a gap or two live authorizations and violates the one-hold invariant.

### Treat one provider error as a refusal

- **Decision** — Map only payment_intent_unexpected_state from the increment
  operation to the auction's existing declined outcome. Preserve the prior
  provider reference; the replacement hold is marked failed by the service.
- **Why** — This error says the requested state transition is not available,
  not that a new hold was created. The auction can safely refuse the attempted
  raise and leave the accepted bid live.
- **Rejected alternative** — Convert every Stripe error into a refusal. A
  timeout or unknown provider fault may leave the provider outcome unknown and
  must remain recoverable by the reconciliation sweep.

### Keep the replacement-row transaction boundary

- **Decision** — The bid entrypoint continues to create the replacement bid and
  hold as pending/creating before the provider call. On increment success, the
  service adopts the replacement rows under the existing hold lock and records
  the provider outcome. On a controlled refusal, one transaction marks the
  replacement hold failed and its bid lost_hold; the prior bid and hold remain
  top/held.
- **Why** — The pending row makes an in-flight request visible and gives retries
  a durable identity. Resolving it on every terminal provider refusal prevents
  the next request from being blocked by a stale pending guard.
- **Rejected alternative** — Delete the pending row. Deletion loses the
  attempted maximum and weakens the audit trail and idempotent retry behavior.

### Request, then trust the provider deadline

- **Decision** — Hold creation asks for incremental and extended authorization
  when available. The expanded provider charge supplies capture_before, and
  the existing hold lifecycle records that value; sweeps continue to select by
  the recorded deadline.
- **Why** — The provider and issuer decide eligibility. A request can support a
  fourteen-day post-close window but cannot guarantee it for every card.
- **Rejected alternative** — Invent a fixed fourteen-day deadline in the
  database. That could keep an expired provider authorization looking live.

## Service Interfaces

### Shared Stripe client

- **Input** — paymentIntentId, integer amountMinor representing the new total,
  and a stable idempotencyKey.
- **Success** — The updated PaymentIntent and its expanded charge.
- **Refusals** — declined, notFound, or stripeError with the provider error
  detail; a 404 is not treated as a new authorization.
- **Idempotency** — Forward the raise key unchanged to the provider.
- **Fault boundary** — Decode successful responses at the shared Stripe
  boundary; do not let the auction service construct provider requests.

### Auction Stripe port

- **Input** — storefront, mode, existing paymentIntentId, new maximumMinor,
  and the raise idempotency key.
- **Success** — capturable with the provider capture deadline or processing
  with the existing provider reference.
- **Refusal** — declined with the existing provider reference when the
  provider cannot increment the intent.
- **Fault boundary** — Translate the exact unexpected-state error to declined;
  throw other provider faults so reconciliation can repair the creating row.

### Auction hold raise processor

- **Input** — replacement holdId and prior holdId.
- **Success** — capturable, processing, or declined; skipped remains the
  stale-race result.
- **Transaction ownership** — The processor owns the state transition through
  the existing hold-lock helper. It reads both hold contexts, verifies the
  same listing/storefront/bidder and the prior held state, then calls the
  provider outside the database transaction before adopting or declining rows.
- **Mutation order**:
  1. Read and validate the prior live hold and replacement creating hold.
  2. Call incremental authorization with the stable raise key.
  3. On success, lock and adopt the replacement bid/hold, then record the
     provider amount and deadline on the prior hold.
  4. On controlled refusal, atomically mark the replacement hold failed and
     the replacement bid lost_hold; leave the prior hold and bid unchanged.
- **Concrete refusal result** — prior bid maximum=10000, state=top, prior hold
  state=held, paymentIntentId=pi_1; replacement bid maximum=10500, state=pending
  becomes lost_hold; replacement hold state=creating becomes failed with no
  copied provider reference.

## Risks / Trade-offs

- **[Provider eligibility varies by card]** → Request both capabilities with
  if_available, record Stripe's actual capture_before, and let the existing
  reauthorization sweep use that deadline.
- **[A provider timeout can leave the outcome unknown]** → Only the exact
  unexpected-state error becomes a refusal; other faults throw and remain in
  the existing reconciliation path.
- **[A retry could duplicate a raise]** → Derive the key from the replacement
  bid and hold sequence, forward it unchanged, and preserve the existing row
  locks and metadata lookup.
- **[A delta amount could be sent accidentally]** → Name the shared input
  amountMinor as the new total and pin the request body in the client test.
- **[A live authorization may not reach fourteen days after close]** → Do not
  synthesize a deadline or claim a guarantee; the product keeps the existing
  release-at-close and invoice settlement boundary.

## Migration Plan

- Deploy the additive shared Stripe contract and client support with the
  auction adapter and hold-state change in the same application release.
- No database migration is required; existing bid, hold, provider-reference,
  and deadline columns remain valid.
- Existing in-flight holds continue through their current lifecycle. New holds
  request the additional provider capabilities, while the returned deadline
  remains the source of truth.
- If rollback is required, revert the auction worker and shared client
  together. Do not alter existing provider intents or rewrite stored hold
  deadlines during rollback.
