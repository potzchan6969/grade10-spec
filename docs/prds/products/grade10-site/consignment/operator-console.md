---
title: Consignment Console
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
| Terms | the commission and fees pinned to the agreement, and the term |
| Documents | the agreement, the receipt and each statement |
| Money | the sale, commission, fees and the payout, each with who recorded it |
| Timeline | every act and every message sent |

- **Acts** - receive, set terms, prepare the agreement, list, change the
  price, take off sale, return, extend, move to the other channel or the
  vault - [Services and Hand-offs](/p/grade10-admin/inventory/services#hand-offs)
- **Before the act** - a dialog states the rule first: the floor, the
  schedule, the term
- **Withheld in words** - an act not offered yet says why

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
| Commission, for each channel and price band | unset | a share of the price |
| Minimum commission | none | an amount per item |
| Fees: listing, return, early take-back | none | an amount each |
| Term on sale | **90** days | any number of days |
| Return window | **14** days after a store sale; **7** after an auction lot is delivered or kept in the vault | any number of days, per channel |
| When a consignor is paid | after the return window | at the sale; one monthly statement |
| A refund after payout | set against the next payout | asked back from the consignor |
| Identity before signing | always verified | above a sale price; never |
| Ending soon | **7** days before the term ends | any number of days |

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
| `consignment:operate` | staff, admin | receive, terms within the schedule, the agreement, list, price within the floor, take off sale, return |
| `consignment:approve` | staff, admin | a commission outside the schedule; a price below the floor on the consignor's yes |
| `consignment:payout` | treasurer, admin | record a payout, correct one, the due list and the export |
| `consignment:display` | admin | name a consignor on the store and the lot, where they agreed |
| `consignment:settings` | admin | change a setting |

- **Two people for money** - staff and treasurer share no money grant; the
  person who set a commission outside the schedule does not pay it out
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
:::
