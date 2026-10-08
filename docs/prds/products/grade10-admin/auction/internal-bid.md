---
title: Internal Bid
spec: grade10-admin/auction/internal-bid
audience: operator
order: 2
---

A house maximum an admin puts on a lot to protect its final price. Collectors
cannot see it; Grade10 commits it at a time the admin sets and then bids it as
any maximum - [Bidding · Auto-Bidding](/p/grade10-site/auction/bidding#auto-bidding).

## Rules

| Rule | Value |
| --- | --- |
| Per listing | **One**, on a created or published listing |
| Amount | Whole major units, from the starting price to the currency's ceiling |
| Commit time | Required; from the start to the scheduled close, both included |
| Who | `auction:reserve` only |
| Collectors see | A listing pseudonym, as for any bidder |
| Other operators see | Its bids as **House** once it has bid, each with its own time; never its amount or its commit time before it bids |

## Internal Bid

- 🚧 **Before its time** - the amount and the time can change or be removed;
  the house is not in the bidding
- 🚧 **At its time** - Grade10 commits it once; an amount short of the minimum
  next bid, or a listing still created, leaves it Not placed; once the lot
  takes bids, saving it at or above the minimum next bid places it
- 🚧 **After it bids** - the time is fixed; the amount goes up until the close,
  or down only where the leader and the current bid stay the same and never
  below a bid already placed for the house
- 🚧 **Listing edits** - a window, starting-price or currency change on a
  created listing that leaves it outside its limits clears it, and only a
  reserve holder sees that
- 🚧 **Bought in** - a lot the house wins reads sold to collectors and Bought
  in to operators, with no order and its stock released -
  [Auction Management · Listings](/p/grade10-admin/auction/management#listings)
- 🚧 **Audit** - each set, change and removal is recorded without the amount
  or the time

:::detail{title="Product decisions" for="pm"}
The house protects a consigned card without a high starting price that puts
early bidders off. The decisions behind it, and the options dropped, are in
the change's `decisions.md`.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Undisclosed | 🚧 In flight | The house bids under a listing pseudonym and nothing tells collectors it may bid; Legal confirms the terms before release. Disclosure was ruled out because it tells a collector when to stop. | Product (@htonyl) |
| Set time | 🚧 In flight | Committed at a time the admin sets, not from the start, so early bids meet no floor. | Product (@htonyl) |
| Staff see House | 🚧 In flight | Other operators read its bids as House once it bids, never its amount or time. A placeholder account was ruled out because it shows staff a made-up account. | Product (@htonyl) |
:::
