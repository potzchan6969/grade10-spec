**Author:** @jeffffej0909 - 2026-09-14

## Why

When an account is suspended today, Grade10 withdraws every maximum it has on open lots and works each lot out again. Other bidders see the price and the leader change on lots the missed payment has nothing to do with, and a new line appears in bid history they already relied on. A placed bid is binding everywhere else on the auction ([Account Record](../../../docs/prds/products/grade10-site/auction/account-record.md)). Suspension should stop what the account does next, not undo what it already did.

An operator also has no way to stop a bidder for a reason other than an unpaid invoice — fraud, abuse, a dispute. The only tool on the Users page is the platform ban, which also stops the person shopping and signing in. The auction service already keeps its own bidder flag behind `auction:moderate`, but no product surface or spec describes it.

**Metrics:** open lots whose price or leader changes because of a suspension — expected to drop to zero; platform bans issued for an auction-only problem — expected to drop.

## What Changes

- **BREAKING** A suspension no longer withdraws the account's maximums on open lots. Each one stays in force, keeps bidding up to its cap, and can win.
- A suspension adds, edits and removes nothing in any lot's bid history. The `bid_retracted_suspension` event is gone.
- A suspended account still cannot place a new bid or raise a maximum. That rule is unchanged, and this change restates it with its own scenario.
- A lot a suspended account wins through a standing maximum is won normally and gets its own invoice and payment deadline.
- An operator holding `auction:moderate` suspends an account from auctions from its panel on the admin Users page, with a required reason, and reinstates it from the same place.
- An operator's suspension is the same suspension a missed deadline causes, with a different cause. The collector is told they can no longer bid and how to contact Grade10; the operator's reason is not shown to them.
- `UserAccountPanel` offers suspend and reinstate only when the console supplies a handler for each, and confirms them in `UserModerationDialog`. No export is added or renamed.
- Scenarios `suspension-SC-05`, `-SC-07` and `-SC-08` retire with the withdrawal requirement. `suspension-SC-06` (a lot already won stays won) retires too, and its rule is restated under the new requirement as `suspension-SC-16`.

## Non-Goals

- **Suspending from the Bidders section of the auction admin, or in bulk.** The Users panel is the one place, one account at a time.
- **A suspension that ends on a date.** It lasts until an operator reinstates it.
- **Changing the role map.** `auction:moderate` stays admin-only.
- **Payment and the scope outside auctions.** These are unchanged.
- **Withdrawing a maximum by hand.** No operator or collector control to cancel a standing maximum is added.
- **Showing other bidders that a leader is suspended.** Nothing about the suspension shows on the lot.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/bidder-suspension`: the scope table no longer lists standing bids as withdrawn; the withdrawal requirement is replaced by one that keeps standing maximums and bid history as they are and refuses new bids; an operator can suspend with a reason; reinstatement names its grant and place.
- `grade10-admin/console/user-directory`: the account panel suspends and reinstates an account's bidding.
- `shared/console/user-directory`: the panel offers auction suspend and reinstate only with a handler.

**Depends on** `focus-the-user-directory-on-access`, which creates `grade10-admin/console/user-directory` and `UserAccountPanel`. This change archives after it. Its ids start at `grade10-admin-console-user-directory-SC-16` / `-US-03` and `shared-console-user-directory-SC-30`.

## Impact

- **Auction bidding service:** the suspension no longer triggers a withdrawal or a new resolution on open lots. The check that refuses a bid or a raise from a suspended account stays.
- **Bid history:** no suspension event is written.
- **Admin console:** the Users page's account panel, and the server check on `auction:moderate` for suspend and reinstate.
- **Notifications:** a new notice for an operator suspension.
- **Component exports:** no export added or renamed; `UserAccountPanel` (not built yet, from `focus-the-user-directory-on-access`) gains two handler-gated moves.
- **Consumer apps:** `grade10-site` (bidding and suspension handling); `grade10-admin` (Users page); `zzz-admin` needs no change — it supplies no handler.

## Open Questions

- **Is the auction admin's Bidders ban this same suspension?** The auction service already keeps a bidder `banned` flag behind `auction:moderate`, and the Bidders section sets it. The recommendation is one flag. Engineering settles it when delivery is planned.

## References

- [Bidder Suspension · Operator Suspension](../../../docs/prds/products/grade10-site/auction/bidder-suspension.md#operator-suspension)
- [User Directory · Auction Suspension](../../../docs/prds/products/shared/console/user-directory.md#auction-suspension)

- [Bidder Suspension · Standing Bids](../../../docs/prds/products/grade10-site/auction/bidder-suspension.md#standing-bids)
