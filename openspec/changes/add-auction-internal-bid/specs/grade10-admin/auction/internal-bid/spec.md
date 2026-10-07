# grade10-admin/auction/internal-bid Specification

## Purpose

Lets an auction admin protect a lot's final price with a house maximum that
collectors cannot see, committed at a time the admin chooses and then bid like
any collector's maximum - [Auction Management · Listings](/p/grade10-admin/auction/management#listings).

## Feature set

- Setting an internal bid
  - Amount and time: one house maximum per listing, with a required commit time from the start to the scheduled close
  - Before its time: amount and time change or are removed freely, and the house is not in the bidding
- Committing at the set time
  - Commit: at its time Grade10 commits the amount as a maximum, resolved once like any commitment
  - Too late: an amount already short of the minimum next bid is not placed, and the admin sees that
- Changing a committed internal bid
  - Raise: any time the lot takes a bid, as a new commitment
  - Lower: only when the leader and the current bid stay the same, never below a bid already placed for the house
  - Fixed time: the commit time no longer changes
- Bought in
  - House win: a lot the house leads at the close closes Bought in, with no order, stock released and Relist offered
- Access
  - Secret floor: only `auction:reserve` sets, reads or learns of an internal bid, and the audit trail records that one was set, never its amount
