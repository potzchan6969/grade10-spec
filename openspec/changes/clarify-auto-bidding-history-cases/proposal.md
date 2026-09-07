**Author:** @htonyl - 2026-09-07

## Why

Collectors cannot reliably read what happened when an automatic maximum is
challenged: the existing bidding-history contract does not say whether the
challenger's action appears before an automatic response, how ties are shown,
or why an outbid bidder can receive a notification without a new bid row. The
eight boundary cases around a 400 current bid, a 100 increment, and a 1000
maximum expose this gap.

**Metric:** the proportion of automatic-bidding disputes resolved from the
listing history without support intervention increases after the history shows
the accepted maximum action, the automatic response, and the stable order for
each case.

## What Changes

- **Maximum-only bidding history** — treats every bidder submission as an
  automatic maximum configuration or raise; manual bid events are not part of
  this history contract
- **Ordered accepted records** — records a challenger's accepted maximum
  action before the automatic response when the existing leader remains ahead
- **Boundary outcomes** — defines refused minimums, equal maxima, maxima just
  above the leader, exact increment boundaries, and maxima beyond the amount
  needed to lead
- **Outbid meaning** — keeps notifications separate from bid records when a
  bidder is outbid without submitting a new maximum
- **Private audit facts** — keeps submitted maximums and refusals in the
  bidder's private history while preserving the existing public privacy rules

## Non-Goals

- **Automatic-bidding settlement** — no change to the existing two-maximum
  price rule, tie ownership, one-resolution rule, or prohibition on an
  intermediate bid ladder
- **Manual bidding** — no support for accepting or recording manual bids
- **Notifications** — no new delivery channel, template, preference, or
  timing policy for outbid notifications
- **Account index** — no change to listing grouping, filters, paging, or the
  `/bids` route beyond the history rows it displays
- **Operator history** — no change to the operator's view of every committed
  maximum

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/bidding-history`: define maximum-only submissions,
  accepted maximum-action rows, automatic response ordering, tie behavior, and
  the eight resolved outcomes in the listing history

## Impact

- **Listing history** — the public chronology gains explicit, stable ordering
  for a maximum-setting record and an automatic response created together
- **Collector history** — the private event vocabulary removes manual-bid
  events and records refused or accepted maximum submissions
- **Auction-to-history contract** — the history must distinguish a submitted
  maximum action from a bid Grade10 places automatically without exposing a
  still-hidden maximum
- **Existing consumers** — current privacy, identity, pagination, and
  notification behavior remains compatible
