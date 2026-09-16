## Context

The auction contracts already model integer minor-unit money and the winner
invoice flow already has a single order-money read used by invoice creation
and reissue. The current invoice projection leaves buyer premium at zero even
though auction fixtures exercise a 20% premium. The admin auction page already
uses permission-filtered tabs and authenticated procedure clients.

The capability deltas are in
[`grade10-site/auction/bid-payment-method`](../../specs/grade10-site/auction/bid-payment-method/spec.md),
[`grade10-site/auction/winner-order`](../../specs/grade10-site/auction/winner-order/spec.md),
and [`grade10-admin/auction/payment-settings`](../../specs/grade10-admin/auction/payment-settings/spec.md).

## Goals / Non-Goals

**Goals:**

- Keep buyer-premium arithmetic in one shared, deterministic minor-unit policy.
- Make invoice creation, reissue, and receipts consume the same authoritative
  order-money projection.
- Persist a complete currency-minimum mapping and expose it through the existing
  settlement-authorized auction admin boundary.
- Let the bidder surface disclose only the fixed rate.

**Non-Goals:**

- Editing the buyer-premium rate, converting currencies, or adding currencies.
- Per-listing or per-operator premium minimums.
- Changing provider account configuration or manual settlement behavior that
  does not create a provider charge.

## Decisions

The specs govern the visible rate, invoice calculation, premium minimum, and
operator behavior. The implementation keeps those rules behind existing
auction domain seams rather than adding page-specific calculations.

- Add a shared auction-charge policy module in the auction contracts package.
  It exports the fixed 20% rate, the supported currency set, default minimums,
  and a pure function for premium calculation. The backend and both frontends
  consume these exports; no UI code reimplements the arithmetic.
  arithmetic.
- Extend the existing auction invoice money projection so its premium is
  derived from the winning bid at read time. Invoice creation and reissue keep
  using that projection, so receipts and final totals inherit the same value.
  The bid panel receives the rate constant only and never receives a derived
  premium amount.
- Add authenticated `paymentSettings.get` and `paymentSettings.save`
  procedures to the auction admin API. Both use the existing settlement
  permission and procedure/audit boundary. Save validates the entire mapping
  before entering a transaction, then upserts all three rows in one atomic
  transaction with the operator identity and timestamp.
- Read the current currency minimum in the invoice money projection whenever a
  new invoice or reissue is created. Sent invoices keep their stored premium;
  provider payment behavior remains unchanged.
- Add a Payment settings panel to the existing `/auction` tab registry. It is
  hidden unless the settlement permission is present and uses the existing
  authenticated procedure client, form primitives, and error handling.
- Use the existing translation catalog path for the bidder disclosure and
  settings labels. No new design-system component or Figma contract is needed;
  `design_waived` records that the change composes existing primitives.

The rejected alternative is storing a calculated premium on bids: it would
duplicate a policy-derived fact and could drift when an invoice is reissued.
Invoice rows remain the historical record of the amount that was actually
sent, while new reissues recalculate from the current setting.

## Database Schema

The auction database owns one global mapping because the current auction
settlement service owns the supported-currency policy. Add
`auction_payment_settings`:

| Column | PostgreSQL type | Nullability / default | Purpose |
| --- | --- | --- | --- |
| `currency` | `text` | `NOT NULL` | Primary key; constrained to `USD`, `HKD`, `JPY`. |
| `minimum_charge_minor` | `bigint` | `NOT NULL` | Non-negative buyer-premium minimum in minor units. |
| `updated_by` | `text` | `NOT NULL` | Authenticated operator identity from the procedure context. |
| `updated_at` | `timestamptz` | `NOT NULL DEFAULT now()` | Last successful complete-mapping save. |

The primary key is `currency`. Add checks for the supported currency set and
`minimum_charge_minor >= 0`; no secondary index is needed. The migration seeds
`USD=0`, `HKD=0`, and `JPY=0` with the migration actor. These rows are the
authoritative minimum mapping; buyer premium remains derived from the winning
bid and current setting and is stored on each invoice.

```text
winning_bid + currency_minimum ──derives──> invoice_money ──> provider_charge

auction_payment_settings(currency, minimum_charge_minor)
             └──────────────read by invoice projection─────────┘
```

## Service Interfaces

The entrypoint authenticates the request and supplies the actor identity. The
service validates a fixed input shape, the repository owns reads/writes, and
the database transaction owns the complete save boundary.

- `getAuctionPaymentSettings({ actor })`
  - Success: `{ USD: 0, HKD: 0, JPY: 0 }` (minor units).
  - Refusal: the existing permission refusal when `actor` lacks settlement
    permission.
- `saveAuctionPaymentSettings({ actor, minimumCharges })`
  - Input: `{ USD: 100, HKD: 500, JPY: 100 }`.
  - Success: the same complete mapping plus `{ updatedBy, updatedAt }`.
  - Refusal: validation or permission refusal; no row is changed.
  - Validate keys, integer non-negativity, and currency set before the transaction.
    Within the transaction, upsert USD, HKD, and JPY in stable order and commit
    only after all three writes succeed. A transaction failure rolls back all
    rows.
- `calculateAuctionBuyerPremium({ winningBidMinor })`
  - Success: the larger of the rounded percentage premium and the current
    currency minimum. It is pure and has no persistence or provider side effects.

Invoice creation and reissue call the same order-money reader, which reads the
winning bid and current minimum and enriches the invoice projection with the
derived premium. Provider idempotency remains owned by the existing payment
service, and sent invoice amounts are never recalculated on read.

## API Contracts

Add the authenticated admin read and complete-map save contracts:

- `paymentSettings.get` returns the three supported currency keys and their
  non-negative integer minor-unit values, plus the existing procedure envelope.
- `paymentSettings.save` accepts exactly the three supported currency keys and
  returns the saved mapping with audit metadata. Validation and authorization
  errors use the existing typed procedure error envelope.

## Risks / Trade-offs

- [Risk] A settings write could partially update currencies. → Validate the
  complete map before a transaction and commit all three upserts together.
- [Risk] A reissue could retain a stale premium. → Re-read the winning bid and
  current currency minimum for each new invoice, while preserving stored sent
  invoices.
- [Risk] UI and invoice arithmetic could drift. → Export one pure policy module
  and use it from invoice projection and bidder copy/tests.
- [Risk] Existing historical invoices could change when re-read. → Scope the
  derived premium to invoice creation/reissue input and preserve stored invoice
  line amounts once an invoice exists.

## Migration Plan

1. Apply the additive table migration and seed the three default rows.
2. Deploy contracts, backend/API, and admin/frontend changes together so the
   new tab and procedures are available only with their server support.
3. Verify the initial mapping, save audit metadata, invoice premium, minimum
   replacement, and sent-invoice immutability in the focused suites.
4. Roll back application code if needed while retaining the additive table;
   restore the previous behavior only after disabling callers of the new
   procedures. Do not delete the table during rollback because it contains
   operator state and is recoverable for a forward fix.

## Open Questions

None.
