---
title: Consignment Console
spec: grade10-admin/consignment/console
audience: operator
order: 4
---

::phase{id="internal-consignment" priority="P0"}

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
| Sold | sold, waiting 3 business days after the buyer pays |
| Payout due | past the window and not yet paid |
| Ended unsold | the term ended and the consignor has not chosen |
| Returning | going back to the consignor |
| Closed | paid out, or back with the consignor |

- **Rows** - the consignor, each item with its label code, the channel, the
  price, days on sale and a badge naming why it waits
- **Counts** - each view carries its count, and every view adds up to all

- 🚧 **Pending Approval** — a consignment signed at the counter, or submitted by the collector from the vault, waits here from its signing; it replaces New, To price and To sign - [Consigning](/p/grade10-site/consignment/consigning#listing-approval)
  - **Ready or Waiting** — each card says whether it waits for the Vault Terms to seal or for authentication
  - **Approval Clock** — approve today, within so many days, or late by so many, against the approval target
- 🚧 **Views** — Needs You, Signing, Pending Approval, On Sale, Sold, Ended, Held, Closed and All, each named beside the collector's words for it - [Consignment States](/p/grade10-site/consignment/consigning#consignment-states)
- 🚧 **Sold** — waits 3 business days after the buyer pays, not the return window
- 🚧 **Ended Unsold** — the card goes back to the vault and keeps earning; nothing waits on the collector's choice

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
  price, take off sale, return, extend, or hand it off to the vault or to a
  new consignment in the other channel -
  [Services and Hand-offs](/p/grade10-admin/inventory/services#hand-offs)
- 🚧 **Approve or Reject** — approve sets the list or starting price, never below the lowest acceptable price and price-checked again; reject ends the mandate with a reason, and the card stays in the vault, earning; receiving, the terms and the signing are taken at the counter, which ends at signing - [Consignment Counter](/p/grade10-site/consignment/counter)
- **Before the act** - a dialog states the rule first: the floor, the
  schedule, the term
- **Withheld in words** - an act not offered yet says why
- **Live at auction** - take back, hand-off and price change are withheld while
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

- 🚧 **Cash-Out Requests** — payouts come from the collector's cash-out requests on the earnings wallet - [Earnings Wallet](/p/grade10-site/account/earnings-wallet#payouts)

## Settings

An admin changes every setting here; each starts on its default and is
pinned to a consignment when its agreement is prepared.

| Setting | Default | Choices |
| --- | --- | --- |
| Commission, for each channel | unset; entered at launch as **12%** for the store and **10%** at auction | a share of the price |
| Minimum commission, for each channel | none | an amount per card |
| Fee for ending early | **US$0**, charged only once an auction lot is prepared | an amount |
| Term on sale | **1** year | any number of days |
| Return window | **14** days after a store sale is delivered; **7** after an auction lot is delivered or collected | any number of days, per channel |
| When a consignor is paid | **3** business days after the buyer pays, into the wallet | any number of business days |

- 🚧 **Vault-First Schedule** — the figures above; a refund after payout is reversed from the wallet; a partner keeps its own bank settlement. No incentive, identity or payout-destination setting is left - [Incentive](/p/grade10-site/vault/incentive#settings)
- 🚧 **A Version per Save** — each save that changes a figure an agreement prints is the next version; an agreement keeps the version it was prepared on
- 🚧 **Operations Settings** — figures for staff work that no agreement prints, so a change never makes a new version: the price check's **20%** below and **50%** above, ending soon at **7** days, the contact limit at **30** days, the approval target at **2** business days, slow cards at **45** days and unconsigned cards flagged at **90** - [Dashboard](/p/grade10-site/consignment/dashboard)
  - **Saved Apart** — with their own save, a reason, and their own change log
  - **Not Read Yet** — the contact limit, slow cards and unconsigned flags are marked as read by nothing until the dashboard uses them
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
| One payout per consignment | Decided | Overtaken: each sale is credited to the wallet on its own day, and a cash-out is the only batch; a partner keeps its bank payouts - the counter review, round 3, 2026-11-02 | Finance |
| A schedule version per save | Decided | Built: a save that changes a figure an agreement prints is the next version; staff-work figures sit apart, in operations settings - the counter review, round 3, 2026-11-02 | Product |
| The commission figures | Decided | One rate per channel, 12% for the store and 10% at auction, entered at launch for Finance to confirm; the incentive left consignment - the counter review, round 3, 2026-11-02 | Finance |
| The channel and the details at intake | Decided | the receive act records where the consignment was taken, its channel - the store or the auction - and each item's market value and the consignment rates applying to it - decided under the owner's delegation, 2026-10-16; replaced by the counter review, 2026-11-02: where it was taken is the items' first inventory location, the channel is set per item at Terms, and the market price is the SNKRDUNK median | Product |
| A light counter | 🚧 | The counter asks for the consignor's ID number and an 18-or-over tick, never an identity check, a list price, price links, an incentive, a payout account, last-sold figures or a declared value; items follow the inventory catalogue, go into a vault case that earns the daily incentive, and keep their photos per item - the counter review, 2026-11-02 | Product |
| One intake form | 🚧 | The counter is the vault's intake form with cards set to Consign: one card per vault case, received before its terms, the Consignment Agreement signed with the Vault Terms, and Pending Approval from the signing; the consignment keeps only its sale terms, never a copy of the card - the counter review, round 2, 2026-11-02 | Product |
:::
