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
| Per listing | 🚧 One on a Created or Published listing, with one required internal bidder; the profile must be Active when chosen or changed |
| Internal bidders | Profiles kept in auction admin: a name, a unique email label and a billing address with a neutral recipient, no site account |
| 🚧 Amount | Whole major units in USD, above 0, at least the USD starting price and no more than the USD ceiling |
| Commit time | Required; from the scheduled start to the scheduled close, both included; when set or changed, later than Save |
| Who | `auction:reserve` only |
| Collectors see | A listing pseudonym, as for any bidder; no notice that the bidder is the house |
| Other operators see | Public bids as House with each amount and Accepted At; no account, profile or maximum. No row or commit time before the first house bid |

## Internal Bid

- 🚧 **Internal bidders** - an admin adds, renames and retires the profiles an
  internal bid can bid as, and picks one for each listing. Admins set a neutral
  recipient in each billing address, never the profile's name
- 🚧 **Kept by a bid** - a Placed or Not placed bid keeps its profile and
  commit time, even if the profile is retired
- 🚧 **Before its time** - the amount and the time can change or be removed;
  the house is not in the bidding
- 🚧 **At its time** - Grade10 commits it once; an amount short of the minimum
  next bid, or a listing still Created, leaves it Not placed. Publishing a
  Created listing later does not place it. Once the lot takes bids, saving at
  or above the minimum next bid places it
- 🚧 **After it bids** - the time is fixed; the amount goes up whenever the
  lot takes a bid, or down only where the leader and the current bid stay the
  same and never below a bid already placed for the house
- 🚧 **Listing edits** - a window or starting-price change on a Created
  listing that leaves it outside its limits clears it, and only a reserve
  holder sees that. A non-USD currency change is refused and leaves the bid
  intact
- 🚧 **Internal bidder win** - the lot reads sold to collectors; its order
  opens as Preparing Invoice, flagged Internal, with HKD settlement and bank
  transfer on FPS set at close. The profile's billing address is both delivery
  and billing address. Other operators read its buyer as House; only a reserve
  holder sees the internal bidder and the listing's win flag. There is no
  winner setup or invoice at close. The operator sends the invoice, lets it
  expire after 7 days and cancels the order by hand; no order letter is sent to
  any recipient
- 🚧 **Audit** - each set, change and removal is recorded without the amount
  or the time

:::detail{title="Test cases" for="qa"}
::cases{id="grade10-admin/auction/internal-bid"}
:::

:::detail{title="Product decisions" for="pm"}
The house protects a consigned card without a high starting price that puts
early bidders off. The decisions behind it, and the options dropped, are in
the change's `decisions.md`.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Undisclosed | 🚧 In flight | The house bids under a listing pseudonym and nothing tells collectors it may bid; Legal confirms the terms before release. Disclosure was ruled out because it tells a collector when to stop. | Product (@htonyl) |
| Set time | 🚧 In flight | Committed at a time the admin sets, not from the start, so early bids meet no floor. | Product (@htonyl) |
| Staff see House | 🚧 In flight | Other operators read public house bids as House, with each placed amount and Accepted At; they see no account, profile or maximum, and no row or commit time before the first house bid. A placeholder account was ruled out because it shows staff a made-up account. | Product (@htonyl) |
:::
