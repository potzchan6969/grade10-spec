**Author:** @htonyl - 2026-09-16

## Why

The auction already has a buyer-premium line in its invoice model, but the
premium is not calculated in the real winner flow and the bid surface does not
tell a collector what rate will apply. Operators also have no Auction-owned
place to keep the minimum buyer premium for each currency.

**Measurement:** the share of accepted auction bids whose bid panel exposes the
20% premium rate, expected 100%; and the share of new invoices whose premium is
below the configured currency minimum, expected 0%.

## What Changes

- **Buyer premium** — calculate 20% of the winning bid in integer minor units
  when an invoice is created, while showing only “20%” on the bid panel.
- **Minimum charges** — add settlement-scoped Payment settings under `/auction`
  for USD, HKD, and JPY, with values stored in minor units and initialized to
  zero.
- **Premium minimum** — use the larger of the rounded 20% premium and the
  configured currency minimum when a new invoice or reissue is created.

## Non-Goals

- **A variable premium rate** — 20% is the policy for this change; operators do
  not edit it.
- **Premium disclosure on the invoice rate** — the invoice shows the calculated
  amount, while the numerical rate is disclosed on the bid panel only.
- **Currency conversion or new currencies** — the existing USD, HKD, and JPY
  auction allowlist remains closed.
- **Per-listing or per-order minimum overrides** — one current mapping serves
  the auction payment path.
- **Changing bid authorization amounts** — bid-time holds continue to cover the
  committed maximum, not the later invoice premium.

## Capabilities

### New Capabilities

- `grade10-admin/auction/payment-settings`: settlement operators manage the
  minimum buyer-premium mapping under `/auction`.

### Modified Capabilities

- `grade10-site/auction/bid-payment-method`: the bid panel discloses the 20%
  buyer-premium rate without showing a premium amount.
- `grade10-site/auction/winner-order`: the invoice stores and shows the 20%
  premium amount or the configured currency minimum, whichever is larger.

## Impact

| Consumer | Change |
| --- | --- |
| `packages/grade10-auction/contracts` | Add premium disclosure and payment-settings wire contracts. |
| `packages/grade10-auction/backend` | Persist settings, calculate invoice premiums, and expose settlement-scoped procedures. |
| `packages/grade10-auction/admin-frontend` | Add the Payment settings feature and Auction tab. |
| `packages/grade10-auction/frontend`, `apps/frontend/grade10` | Show the 20% rate on the bid panel only; keep the amount off the bidding surface. |
| `apps/admin/grade10` | Register the Payment settings tab under `/auction`. |

## Assumptions

- The 20% premium is rounded to the nearest minor unit with `Math.round`, as
  the existing fixture does.
- Minimums launch at zero in all three currencies until Product and finance
  configure a policy value in the admin surface.

## References

- [Auction](../../../docs/prds/products/grade10-site/auction/index.md)
- [Payment Method](../../../docs/prds/products/grade10-site/auction/bid-payment-method.md)
- [Winner Order · Invoice and Settlement](../../../docs/prds/products/grade10-site/auction/winner-order.md#invoice-and-settlement)
- [Auction operations](../../../docs/prds/products/grade10-admin/auction/index.md)
- [Payment settings](../../../docs/prds/products/grade10-admin/auction/payment-settings.md)
- [Stripe supported currencies](https://docs.stripe.com/currencies)
