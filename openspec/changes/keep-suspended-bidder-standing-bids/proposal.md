**Author:** @jeffffej0909 - 2026-09-14

## Why

When an account is suspended today, Grade10 withdraws every maximum it has on open lots and works each lot out again. Other bidders see the price and the leader change on lots the missed payment has nothing to do with, and a new line appears in bid history they already relied on. A placed bid is binding everywhere else on the auction ([Account Record](../../../docs/prds/products/grade10-site/auction/account-record.md)). Suspension should stop what the account does next, not undo what it already did.

**Metric:** open lots whose price or leader changes because of a suspension — expected to drop to zero.

## What Changes

- **BREAKING** A suspension no longer withdraws the account's maximums on open lots. Each one stays in force, keeps bidding up to its cap, and can win.
- A suspension adds, edits and removes nothing in any lot's bid history. The `bid_retracted_suspension` event is gone.
- A suspended account still cannot place a new bid or raise a maximum. That rule is unchanged, and this change restates it with its own scenario.
- A lot a suspended account wins through a standing maximum is won normally and gets its own invoice and payment deadline.
- Scenarios `suspension-SC-05`, `-SC-07` and `-SC-08` retire with the withdrawal requirement. `suspension-SC-06` (a lot already won stays won) retires too, and its rule is restated under the new requirement as `suspension-SC-16`.

## Non-Goals

- **What suspends an account.** An unpaid invoice past its deadline is still the only trigger.
- **Reinstatement, payment, and the scope outside auctions.** These are unchanged.
- **Withdrawing a maximum by hand.** No operator or collector control to cancel a standing maximum is added.
- **Showing other bidders that a leader is suspended.** Nothing about the suspension shows on the lot.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/bidder-suspension`: the scope table no longer lists standing bids as withdrawn; the withdrawal requirement is replaced by one that keeps standing maximums and bid history as they are and refuses new bids.

## Impact

- **Auction bidding service:** the suspension no longer triggers a withdrawal or a new resolution on open lots. The check that refuses a bid or a raise from a suspended account stays.
- **Bid history:** no suspension event is written.
- **Component exports:** none affected.
- **Consumer apps:** `grade10-site` (bidding and suspension handling); `grade10-admin` is unaffected.

## References

- [Bidder Suspension · Standing Bids](../../../docs/prds/products/grade10-site/auction/bidder-suspension.md#standing-bids)
