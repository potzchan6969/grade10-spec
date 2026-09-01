## Context

See [the capability spec](specs/grade10-auction/bid-payment-method/spec.md).
Auction already persists a `payment_holds` row per provider PaymentIntent and
offers manual-capture create, update, cancellation, webhook, and reconciliation
paths. The storefront bid dialog currently stops at a `NOT_REGISTERED` result;
the Stripe frontend package intentionally has no browser widget yet.

## Goals / Non-Goals

**Goals:**

- Complete the first-bid payment-method flow without exposing card data to
  Grade10.
- Make the per-listing method and manual-capture authorization durable,
  idempotent, and reconcilable.
- Reuse the selected card for later maximum raises on that listing.

**Non-Goals:**

- Capture or any post-sale payment workflow.
- A cross-listing default card or payment-method-management page.
- Changing automatic-bidding, listing locks, or its price-selection algorithm.

## Decisions

### One first-bid payment-method session per listing

The storefront starts a Stripe client-secret session only after the collector
has selected a valid maximum in `PlaceBidDialog`. The Stripe Payment Element
runs inside the dialog and returns only Stripe identifiers to the storefront.
The Auction service binds the confirmed method to the bidder/listing pair; a
later bid supplies no method and can only use that binding.

Creating a global saved-card chooser outside the bid flow is rejected: it does
not establish which card backs a particular listing. Asking again for every
raise is rejected because it defeats the committed-card rule and adds needless
authentication friction.

### Manual-capture PaymentIntent is the authorization record

The existing `auction.payment_holds` record remains the durable authorization
projection. It has `id text NOT NULL` as the primary key, `bid_id text NOT
NULL`, `seq integer NOT NULL`, `storefront text NOT NULL`, `purpose text NOT
NULL`, `state text NOT NULL DEFAULT 'creating'`, `payment_intent_id text NULL`,
`expires_at timestamp NULL`, `attempts integer NOT NULL DEFAULT 0`,
`next_attempt_at timestamp NOT NULL DEFAULT now()`, and created/updated
timestamps. Its unique `(bid_id, seq)` and unique non-null payment-intent id
make retrying create safe.

Add a per-bidder/listing payment-method binding rather than storing a card on a
bid: `storefront text NOT NULL`, `user_id text NOT NULL`, `listing_id text NOT
NULL`, `payment_method_id text NOT NULL`, `created_at timestamp NOT NULL
DEFAULT now()`, and `updated_at timestamp NOT NULL DEFAULT now()`, unique on
`(storefront, user_id, listing_id)`. It stores a Stripe opaque identifier only;
no card data or client secret reaches the database. The PaymentIntent id stays
on `payment_holds`, which already records every creation and cancellation
attempt.

Use a manual-capture PaymentIntent whose amount is the bidder's maximum. An
existing bid raise updates that intent before the listing decision accepts the
raised maximum. If an update cannot complete, the old commitment remains and
the raise is refused. Creating a new intent for every raise is rejected because
it produces overlapping holds. A SetupIntent-only design is rejected because
it saves a card but does not hold the bid amount.

### Separate provider confirmation from bid acceptance

The Store Worker obtains the client secret for the dialog and routes only the
confirmed opaque payment-method id to Auction. Auction serializes the existing
listing decision and persists the pending hold before it calls Stripe. A
confirmed `requires_capture` outcome transitions the hold to held and permits
the bid result; `requires_action`, declined, cancelled, or a provider failure
leaves no accepted bid. Webhooks and reconciliation remain the authority for a
lost or delayed provider response.

Trusting the browser's success callback is rejected because it can be replayed
or interrupted. Holding first and accepting later is rejected because a
visible accepted bid would not yet be funded.

### Cancellation is a provider operation, capture is not

The existing outbid transition queues cancellation of the active PaymentIntent
and persists its terminal outcome. The release worker and provider webhooks
retry and reconcile that operation idempotently. This change does not invoke
the existing capture path or add a winner settlement transition.

Leaving an outbid hold to expire is rejected because it keeps the collector's
funds unavailable. Capturing on close is rejected because final payable amount
and post-sale consent are outside this change.

## Risks / Trade-offs

- [A card authorization expires before the listing closes] → retain the
  existing expiry/reconciliation data and surface a refusal rather than accept
  an uncovered raise.
- [A provider confirmation is delayed or repeated] → retain one durable hold
  and use listing serialization, provider idempotency keys, webhooks, and
  reconciliation.
- [Stripe.js fails to load or the iframe is blocked] → keep the dialog open,
  name the unavailable payment capability, and create neither bid nor hold.

## Migration Plan

1. Add the opaque bidder/listing payment-method binding and its uniqueness
   constraint through an expand-only migration.
2. Deploy contracts, Stripe client adapter, and Auction/Store support before
   enabling the dialog.
3. Enable the dialog for first bids, then observe authorization creation,
   update, cancellation, and reconciliation outcomes.
4. Roll back by disabling dialog entry; existing hold cancellation and
   reconciliation continue, and the new binding is retained for safety.
