**Author:** @jeffffej0909 - 2026-09-15

## Why

A winner's invoice carries a buyer's premium, but no rule says how much it is.
`revise-auction-winner-invoicing` shipped the line with "the applicable fee"
and no rate, so Grade10 cannot compute a final amount without an operator
guessing, and two winners of the same price can be charged differently.

**Metric:** invoices sent with no operator correction to the buyer's premium,
over invoices sent. It should be 100% from the first release.

## What Changes

- **Buyer's premium is 20% of the winning bid.** Grade10 computes it in the
  lot's currency, rounded half up to the nearest minor unit. Shipping,
  insurance and tax are never part of its base.
- **A minimum charge per currency.** The premium is the larger of the 20%
  figure and the lot currency's minimum. A minimum of 0 means no minimum.
  USD, HKD and JPY launch at 0.
- **Grade10 owns the rate and the minimums.** No operator enters, waives or
  changes the premium, on any lot. Engineering changes a minimum on request.
- **Sent invoices keep their amounts.** A new rate or minimum applies to
  invoices sent or reissued after it takes effect.

## Non-Goals

- A rate that varies by price band, lot, sale or collector.
- An admin screen for the minimums.
- Tax on the premium; tax stays with its separate change.
- Telling a collector about the premium before they bid.

## Open Questions

- **Minimum values** — launch at 0 in all three currencies until Product and
  finance set the real amounts.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/winner-order` — adds the requirement that computes the
  buyer's premium.

## Impact

- **Consumer apps:** grade10-site (invoice and receipt show the computed
  premium), grade10-admin (invoice preparation reads it and offers no input).
- **Component exports:** none named or changed.
- **Sequencing:** archives after `revise-auction-winner-invoicing`, which
  owns the Invoice fields requirement this one refines.

## References

- [Winner Order · Invoice and Settlement](../../../docs/prds/products/grade10-site/auction/winner-order.md#invoice-and-settlement)

## Follow-on changes

- Correct the Invoice fields row that says the capability fixes no rate, once
  the invoicing change is archived.
- Pre-bid premium disclosure is owned by `disclose-buyer-premium-on-bid-panel`.
