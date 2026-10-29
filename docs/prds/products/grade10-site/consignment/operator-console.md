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
| Payout due | past the window and not yet paid |
| Ended unsold | the term ended and the consignor has not chosen |
| Returning | going back to the consignor |
| Closed | paid out, or back with the consignor |

- **Rows** - the consignor, each item with its label code, the channel, the
  price, days on sale and a badge naming why it waits
- **Counts** - each view carries its count, and every view adds up to all

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

## Payouts

- **Due list** - every payout past its window, oldest first, with what it is
  made of
- **Record a payout** - the amount, the bank reference and the day the money
  left; the statement goes to the consignor
- **A correction** - taken back with a reason by a second holder of the
  payout grant, never the one who recorded it
- **Export** - a CSV of a period's payouts, on the audit chain

## Settings

An admin changes every setting here; each starts on its default and is
pinned to a consignment when its agreement is prepared.

| Setting | Default | Choices |
| --- | --- | --- |
| Commission, for each channel and price band | unset; intended **10–12%** | a share of the price |
| Incentive, on the estimated value | intended **5%**, paid at consignment | a share of the estimated value |
| Minimum commission | none | an amount per item |
| Fees: listing, return, early take-back | none | an amount each |
| Term on sale | **90** days | any number of days |
| Return window | **14** days after a store sale is delivered; **7** after an auction lot is delivered or collected | any number of days, per channel |
| When a consignor is paid | after the return window | at the sale; one monthly statement |
| A refund after payout | set against the next payout | asked back from the consignor |
| Identity before signing | always verified | above a sale price; never |
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
| `consignment:operate` | staff, admin | receive, terms within the schedule, the agreement, list, price within the floor, take off sale, return, retry a channel, dismiss a flag |
| `consignment:approve` | staff, admin | a commission outside the schedule; a price below the floor on the consignor's yes; dismiss an amount that differs or a refund in part |
| `consignment:payout` | treasurer, admin | record a payout, correct one, the due list and the export |
| `consignment:display` | admin | name a consignor on the store and the lot, where they agreed |
| `consignment:settings` | admin | change a setting |

- **Two people for money** - staff and treasurer share no money grant; the
  person who set a commission outside the schedule does not pay it out
- **Second factor and audit** - as the vault's: required in production, and
  every act filed under its consignment -
  [Operator Console](/p/grade10-site/finance/operator-console#permissions)
- **Staff hear nothing** - the queue's badges and counts are the signal

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Queue by wait | Decided | A shop asks what a consignment waits for, as it does of a vault case and a grading submission - decided under the owner's delegation, 2026-10-08 | Product |
| Payouts on the vault's rule | Decided | Recorded after the bank transfer by a treasurer; a correction takes a second holder of the grant - decided under the owner's delegation, 2026-10-08 | Finance |
| Seller display is an admin act | Decided | The owner names the admin as the one who sets it - decided by the owner, 2026-10-08 | Product |
| Every figure a setting | Decided | The schedule, the term, the windows, fees, identity and when a consignor is paid are settings admins change in the console, each starting on the recommended default - decided by the owner, 2026-10-08 | Product |
| One payout per consignment | ❓ Open | Proposed: every sale of a consignment past its window is paid as one payout, and a sale still inside its window waits for its own day | Finance |
| A schedule version per save | ❓ Open | Proposed: each settings save that moves a figure is the next schedule version, the one an agreement prepared after it pins | Product |
| The channel and the details at intake | Decided | the receive act records where the consignment was taken, its channel - the store or the auction - and each item's market value and the consignment rates applying to it - decided under the owner's delegation, 2026-10-16 | Product |
:::
