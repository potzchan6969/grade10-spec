---
title: Consignment Console
spec: grade10-admin/consignment/console
audience: operator
order: 1
---

The Consignment section of the admin console: a queue of consignments cut by
what each one waits for, one consignment's page, the treasurer's payouts and
the settings the schedule runs on.

## Queue

| View | What it lists |
| --- | --- |
| New | requests not yet received |
| To price | items received with no agreed terms |
| To sign | terms agreed and the agreement not yet signed |
| To list | signed and not yet on sale |
| On sale | in the shop or at auction; ending soon badged |
| Sold | sold and inside the return window |
| Ended unsold | the term ended and the consignor has not chosen |
| Returning | going back to the consignor |
| Closed | paid out, or back with the consignor |

- **Rows** - the consignor, each item with its label code, the channel, the
  price, days on sale and a badge naming why it waits
- **Counts** - each view carries its count, and every view adds up to all
- 🚧 **Payouts are the balance's** - payout requests, consignors before
  payout and debts are queued on the balance -
  [Balance Console](/p/grade10-site/account/balance-console#queue)

## One Consignment

| Part | Shows |
| --- | --- |
| Header | the consignor, by name under the identity grant; the channel; the term's end; whether the consignor is named on the store |
| Items | each item, its list price and floor, its listing in the shop or at auction, and a link to its item page |
| Channel | each item's store product or lot, whether it carries the latest terms, and every flag on it |
| Terms | the commission and fees pinned to the agreement, and the term |
| Documents | the agreement, each receipt, each statement and the commission invoice |
| Money | the sale, commission, fees and the payout, each with who recorded it |
| Timeline | every act and every message sent |

- **Acts** - receive, set terms, prepare the agreement, list, change the
  price, take off sale, return, extend, move to the other channel or the
  vault - [Services and Hand-offs](/p/grade10-admin/inventory/services#hand-offs)
- 🚧 **At intake** - the receive act records where the consignment was
  taken - the shop or an event - and its channel, the store or the
  auction, and registers each item's market value and the consignment
  rates applying to it
- **Before the act** - a dialog states the rule first: the floor, the
  schedule, the term
- **Withheld in words** - an act not offered yet says why
- **Live at auction** - take back, move and price change are withheld while
  the lot is published, until the auction calls it off or it closes
- **Retry** - sends the item again to a channel that refused it or stopped
  answering
- **Dismiss** - clears a flag staff have dealt with; a changed fact raises it
  again
- **Record by hand** - a sale, a delivery or a refund, only when the store or
  the auction did not report it

| Flag | Means | Dismissed under |
| --- | --- | --- |
| Sold twice | a second sale of the item; the flag names the order to refund | `consignment:operate` |
| Out of step | the store product differs from the consignment; the store puts it back | `consignment:operate` |
| Cannot apply | the channel reported a fact the consignment cannot take | `consignment:operate` |
| Price moved | the item sold at a price other than the listed one | `consignment:operate` |
| Amount differs | a sale recorded by hand differs from the one the channel reported | `consignment:approve` |
| Refund in part | the store refunded part of a sale | `consignment:approve` |

## Consignors

- 🚧 **One page per consignor** - their account facts, approved-partner
  flag, identity and ID sighted, what is pending in return windows, their
  documents and their consignments, with a link to their balance
- 🚧 **Reveal** - finance reveals one masked ID or registration number at a
  time, and each reveal is recorded with who and when

## Statements

- 🚧 **Payouts are the balance's** - requests, approval, batches and the
  bank's file are worked from the balance's own desk -
  [Balance Console](/p/grade10-site/account/balance-console#acts)
- 🚧 **Statements** - each month's settlement statements and commission
  invoices, numbered in their series
- **Export** - a CSV of a period's sales, commission and credits to the
  balance, on the audit chain

## Settings

An admin changes every setting here; each starts on its default and is
pinned to a consignment when its agreement is prepared.

| Setting | Default | Choices |
| --- | --- | --- |
| Commission, for each channel and price band | unset; intended **10–12%** | a share of the price |
| Incentive, on the estimated value | **5%**, credited at signing | a share of the estimated value |
| Incentive paid as | a credit to the consignor's balance | on the spot, by cash or FPS |
| Minimum commission | none | an amount per item |
| Fees: listing, return, early take-back | none | an amount each |
| Contract period | **90** days | any number of days |
| Return window | **14** days after a store sale is delivered; **7** after an auction lot is delivered or collected | any number of days, per channel |
| When proceeds are credited | after the return window | at the sale |
| Statement period | monthly | monthly |
| Identity before signing | never; verified before the first payout | above a sale price; always |
| Auction rate | unset | the HKD to one USD, exactly |
| Ending soon | **7** days before the term ends | any number of days |

- ❓ Product - **The intended figures** - the consignment fee is intended
  at **10–12%** of the price at sale and the incentive at **5%** of the
  estimated value; the exact figures are unset
- **Pinned to the agreement** - a change reaches the next agreement
  prepared; one waiting for a signature keeps the schedule it was prepared on
- **Unset refuses** - an agreement is not prepared while a figure it prints
  is unset
- **Who** - `consignment:settings`, held by admins; every change on the
  audit chain with the old and new value

## Grants

| Grant | Roles | Opens |
| --- | --- | --- |
| `consignment:read` | staff, treasurer, admin | the queue and every consignment |
| `consignment:operate` | staff, admin | receive, terms within the schedule, the agreement, list, a price with its evidence link - below the floor on the consignor's signed yes - take off sale, return, retry a channel, dismiss a flag |
| `consignment:approve` | staff, admin | a commission outside the schedule, an item's own commission, minimum or incentive; dismiss an amount that differs or a refund in part |
| `consignment:finance` | treasurer, admin | statements and invoices, the export, reveal a masked ID or registration number |
| `consignment:display` | admin | name a consignor on the store and the lot, where they agreed |
| `consignment:settings` | admin | change a setting |

- **Two people for money** - staff and treasurer share no money grant; a
  payout is the balance's, approved by someone other than whoever asked -
  [Balance Console](/p/grade10-site/account/balance-console#grants)
- 🚧 **Who set the rate never pays it** - whoever set a consignor's
  commission outside the schedule does not approve that consignor's payouts
  on the balance
- **Second factor and audit** - as the vault's: required in production, and
  every act filed under its consignment -
  [Operator Console](/p/grade10-site/vault/operator-console#permissions)
- **Staff hear nothing** - the queue's badges and counts are the signal

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Queue by wait | Decided | A shop asks what a consignment waits for, as it does of a vault case and a grading submission - decided under the owner's delegation, 2026-10-08 | Product |
| Payouts on the vault's rule | Decided | Recorded after the bank transfer by a treasurer; a correction takes a second holder of the grant - decided under the owner's delegation, 2026-10-08 | Finance |
| Seller display is an admin act | Decided | The owner names the admin as the one who sets it - decided by the owner, 2026-10-08 | Product |
| Every figure a setting | Decided | The schedule, the term, the windows, fees, identity and when a consignor is paid are settings admins change in the console, each starting on the recommended default - decided by the owner, 2026-10-08 | Product |
| A balance, not a payout per consignment | Decided | Proceeds reach one balance per consignor and payouts are asked for against it - decided by the owner, 2026-10-26. The balance and its payout desk are the account's, shared with the vault's yield - on the owner's direction, 2026-10-26 | Finance |
| Who set the rate never pays it | Decided | Whoever set a commission outside the schedule is refused when approving a payout from that consignor's balance, since the balance pools every consignment - decided by Product, 2026-10-26 | Finance |
| A paid payout sent back | Decided | Not reopened in the console for now; finance handles a bank's return of a paid payout by hand - decided by Product, 2026-10-26 | Finance |
| A schedule version per save | ❓ Open | Proposed: each settings save that moves a figure is the next schedule version, the one an agreement prepared after it pins | Product |
| The channel and the details at intake | Decided | the receive act records where the consignment was taken, its channel - the store or the auction - and each item's market value and the consignment rates applying to it - decided under the owner's delegation, 2026-10-16 | Product |
:::
