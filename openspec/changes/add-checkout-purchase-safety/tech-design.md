## Context

The [proposal](proposal.md) holds the motivation. The published requirement
"A checkout intent is safe to repeat" names five guarantees; before this change
the store backend returned a standing invoice for an unchanged cart before any
live review, kept the newest payable invoice by a second supersede pass, and
retired invoices after a member edit on a best-effort basis only.

## Goals / Non-Goals

- **Goal** - One order and one payable invoice per purchase across repeated
  Pay, a second tab, a reload, a lost answer and a stopped worker, with no
  extra request field and no browser-held identity
  ([Q29](../add-shopify-checkout-integration/decisions.md)).
- **Non-goal** - A purchase identity for guests or email checkouts, which hold
  no server cart; an operator screen for checkouts under review.

## Decisions

### The intent names the order

- **Intent** - `checkoutIntent(userId, cart, tender)` in
  `services/orders/intent.ts`: the member, the active cart's id and version,
  and the tender (points, wallet coupon, sorted codes). A member edit or a
  shop review that moved a line bumps the version, so it names a new intent.
- **Order id** - `intentOrderId(intent, attempt)` is a SHA-256-derived UUID
  (version 8). Two requests for one intent compute one id; the orders primary
  key admits one row. A concurrent loser's insert hits the key, finds the row
  and answers it (`intentTaken`), keeping the reward reservation both requests
  shared under that id.
- **Attempts** - Attempt `n + 1` is tried only when attempt `n` closed unpaid
  (failed, canceled, expired), so a deliberate Pay after a refusal is a new
  checkout, and a paid or open attempt is the answer to every press.

| Rejected | Why |
| --- | --- |
| A client purchase key in `sessionStorage` | Q25/Q29 removed it; the cart already identifies the purchase server-side |
| An intent column with a unique index | The primary key already gives uniqueness once the id is derived |
| Replaying failed, canceled or expired orders forever | Strands an unchanged cart until the member edits it; nothing payable stands behind such an order |

### Answering a standing order

`answerStanding` in `services/checkout.ts`:

| Order | Answer |
| --- | --- |
| Paid or refunded | `terminal` with the order link |
| Open, invoice recorded | Live `priceCheckoutItems` first; a moved line answers as the review does, otherwise the invoice (`created`, `reused`) |
| Open, `dispatched`, no ref | The recovery ladder (`resolveOrderPayment`); a payable invoice found is recorded and returned, otherwise settling |
| Open, `ready` past the 60 s dispatch lease | Closed `failed` (no provider object exists) and the next attempt proceeds |
| Open, `manual_review` | `recoveryRequired` |

- **Paid cart replay** - A request whose lines match no active cart but match
  the member's latest converted cart computes that cart's intent and returns
  `terminal` for its paid attempt: the tab left open on a cart its payment
  closed.

### Dispatch

- **Column** - `orders.checkout_dispatch` (`ready` | `dispatched` |
  `manual_review`), migration `0059_checkout_dispatch` (nullable, no default,
  metadata-only).
- **Claim** - After the mint and before the provider call,
  `claimCheckoutDispatch` moves `ready` to `dispatched`; only the winner calls
  the provider.
- **Provider read** - Drafts carry the tag `store-order-<orderId>`;
  `shopifyProvider.findByOrderId` looks it up with `draftOrders(query: tag:…)`.
  One draft is found, none is not found, two or more answer `ambiguous_draft`.
- **Manual review** - At the reconcile give-up, a dispatched order with no ref
  enters `manual_review` instead of expiring; the member's next Pay answers
  `recoveryRequired`. `admin.orders.settleDispatch` binds the draft an operator
  found or cancels the order.

### Durable retirement

- **Due row** - `setCartLine`, `mergeCart` and `setCartTender` call
  `dueMovedPastCheckouts` in the edit's transaction: every open order of that
  cart made at an older edited version is due now.
- **Retire** - The reconcile pass retires a due order its cart moved past
  (`retiredMovedPast`) before resolving it; collected or unretirable orders
  settle through the ordinary ladder. The best-effort discard after the edit
  stays as the fast path.

### Contract

- `checkoutResultSchema` (and the email variant) gain `terminal`
  (`orderId`, `status: paid | refunded`, `orderLink`) and `recoveryRequired`
  (`orderId`, `orderLink`).
- The storefront resolves both to `showOrder` and opens the order, the same
  move as a settling answer.

## Risks / Trade-offs

- **[Risk] A slow request past the 60 s lease** → The repeated Pay closes its
  order first; the slow request then loses its claim and calls no provider.
- **[Risk] Orders written before this change** → They carry random ids and no
  dispatch state; the first Pay after deploy writes a new intent order and
  the supersede pass retires the old one.
- **[Risk] Drafts made before the tag** → Not found by the provider read; they
  follow the old ladder.

## Migration Plan

1. Apply `0059_checkout_dispatch` (adds one nullable column).
2. Deploy the store worker and the storefront together; the storefront
   handles the two new answers.
