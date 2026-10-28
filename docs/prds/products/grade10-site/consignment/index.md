---
title: Consignment
icon: storefront
---

Consignment is the house selling an item a collector or a partner owns, in
the shop or at auction, for a commission bound to the consignment.

## Values

Every figure is a setting an admin changes in the console, never a constant;
the value below is the default it starts on -
[Consignment Console](/p/grade10-site/consignment/operator-console#settings).

| Setting | Default |
| --- | --- |
| Channels | the store, in the shop, online or both; the auction |
| Store commission | a share of the sale price, by price band; unset until an admin sets it |
| Auction commission | a share of the hammer price, unset until an admin sets it; the buyer's premium stays the house's |
| Minimum commission | per item; none |
| Fees | listing, return and early take-back; none |
| Incentive | **0**; a card from the vault earns the vault's daily incentive instead |
| Where a person's proceeds go | a bank account named at the counter that joins the consignor's list; a partner always by bank |
| Term on sale | intended **90** days |
| Return window | **14** days after a store sale is delivered; **7** days after an auction lot is delivered or collected |
| When a consignor is paid | after the return window |
| A refund after payout | set against the consignor's next payout |
| Identity before signing | always verified |
| Ending soon | **7** days before the term ends |
| Currency | the brand's; HKD for Grade10 |

- **Unset refuses** - an agreement is not prepared while a figure it prints
  is unset
- ❓ Product - **Delivery never reported** - when the return window of an
  online sale starts if its delivery is never reported; until the owner
  decides, it waits for a reported delivery or staff recording one
- ❓ Product - **The figures** - the intended consignment fee is **10–12%**
  of the sale price at sale; the exact figures are unset
- ❓ Product - **The term's figure** - the running default is **90**
  days; **30** or **60** are asked for; the figure is unset
- ❓ Product - **Graded only** - intake is proposed to take graded
  collectables only at launch, there being no grading service on day 1;
  whether ungraded is ever taken is unsettled

## One Consignment

:::flow{title="One consignment" case="In the shop"}
## *Consignor* - **Asks**
Online, or at the counter with staff, naming the items and the price they hope for.

## *Staff* - **Receives the items**
Each item identified, checked, photographed, labelled and put away - [Intake and Release](/p/grade10-admin/inventory/intake#receiving-an-item).

## *Staff and consignor* - **Agree the terms**
A list price and a floor for each item, the commission and the term from the schedule, and whether the consignor may be named.

## *Consignor* - **Signs**
The consignment agreement, on the shop's iPad or their own phone.

## *Staff* - **Puts it on sale**
The item is listed in the shop and online and goes to a display case; the consignor is told.

## *Buyer* - **Buys it**
At the till or online; the item comes off sale everywhere at once.

## *Treasurer* - **Pays the consignor**
After the return window, the listed price less commission and fees, by bank transfer, with a statement.
:::

:::flow{title="One consignment" case="At auction"}
## *Consignor* - **Asks**
Online, or at the counter with staff, naming the items.

## *Staff* - **Receives the items**
As in the shop; an item in a vault case is taken once its case is released.

## *Staff and consignor* - **Agree the terms**
A floor for each item, which is the lot's start price and which the auction cannot change; the commission from the schedule; and whether the consignor may be named. The lot has no reserve.

## *Consignor* - **Signs**
The consignment agreement.

## *Staff* - **Lists the lot**
The lot comes to auction admin as a draft made from the item, its photographs and facts; staff place it in a campaign or alone - [Auction Management](/p/grade10-admin/auction/management#listings).

## *Winner* - **Pays**
The winner's order runs as for any lot; the winner may collect at a shop instead, then keep the card in a vault case of their own.

## *Treasurer* - **Pays the consignor**
Once the lot is delivered or collected and the window has passed, the hammer price less commission and fees.
:::

- **One item, one channel** - an item is on sale in the shop or at auction,
  never both - [Services and Hand-offs](/p/grade10-admin/inventory/services#marks-that-share-an-item)
- **The consignor's until sold** - the owner moves to the buyer only when the
  item is delivered to them or they collect it
- **Listed for you** - each item becomes one store product, or a draft lot
  that staff place
- **Sales come back on their own** - the store and the auction report each
  sale, delivery and refund; staff record one by hand only when a channel
  did not report it
- **The first sale wins** - a second sale of the same item is refunded
- 🚧 **In the shop, online or both** - staff list a store item in the shop
  only, online only, or both
- 🚧 **One buyer at a time** - an open order holds the card, refusing every
  other buyer until it is paid, expires or is cancelled
- 🚧 **Sold twice** - a till sale of a card an online buyer paid for at the
  same moment stands; the online buyer is refunded and staff alerted
- ❓ Owner - **Who wins the counter** - the first hold, the shop reserving
  the card for an online checkout, or the till, cancelling an unpaid online
  checkout; built on the first
- 🚧 **Sold from the vault** - a storage card is consigned where it sits, a
  store listing moving it to the counter and back; a financed card waits
- 🚧 **Released to its buyer** - on delivery, under the consignment agreement;
  no release paper, no early withdrawal fee, and the card's vault incentive
  is kept - [Earnings](/p/grade10-site/vault/earnings#the-balance)
- 🚧 **The vault hears each fact** - the sale, a reversed sale, the delivery,
  the settlement and a refund after payout reach the vault once each, which
  decides when the card stops earning
- ❓ Owner - **The release clause** - its exact words; a draft prints
  until they are confirmed
- 🚧 **Recorded at intake** - where the consignment was taken - the shop's
  counter or an event such as a card show - and its channel, the store or
  the auction
- 🚧 **Registered on the form** - each item is registered with its market
  value and the consignment rates applying to it, and logged in Shopify
  when the consignment form is completed
- 🚧 **Seen before it lists** - an item bound for auction shows on the
  consignor's signed-in page once it is checked in, before its lot is
  listed
- 🚧 **Checked before it lists** - an item passes intake inspection and
  photography before it is published
- 🚧 **Shown while it sells** - each item names its channel - the shop,
  the online store or the auction - its agreed list price, the commission
  rate and the consignor's estimated net payout, and counts down the days
  left on its term
- ❓ **Asking online, not built** - only staff open a consignment; the site
  has no request page until its form and rules are designed

## Price

- **List price and floor** - agreed for each item at signing
- **Within the floor** - staff change the price without asking, and the
  consignor is told
- **Below the floor** - only on the consignor's written yes, kept on the
  consignment
- **At auction** - the floor is the lot's start price, and the auction
  cannot change it; no reserve, as on every listing -
  [Bidding](/p/grade10-site/auction/bidding)
- 🚧 **An HKD floor at a dollar auction** - converted at US$1 = HK$7.85,
  rounded up, the rate kept on the lot; the sale comes back in HKD
- **Paid on the listed price** - a cut the buyer gets at checkout is the
  house's
- ❓ Product - **Points and discounts** - whether points, coupons and the
  shop's discounts reach a consigned card

## Commission and Payout

- **Bound to the consignment** - the commission and fees in force when the
  agreement is prepared are pinned to it; a later schedule reaches only the
  next agreement prepared, never one waiting for a signature or signed
- **Outside the schedule** - a commission a partner negotiates is set by
  someone who may approve it -
  [Consignment Console](/p/grade10-site/consignment/operator-console#grants)
- 🚧 **No incentive by default** - it starts at 0 and the agreement leaves
  its line out - [Earnings](/p/grade10-site/vault/earnings)
- **What is paid** - the listed price less commission and fees; at auction, the
  hammer price less commission and fees, the buyer's premium being the
  house's
- 🚧 **The sale's paper** - a sale issues the consignor a settlement
  statement and a commission invoice, with the contact details for payment
- **How** - a bank transfer a treasurer records with its reference; a
  correction takes a second holder of the payout grant
- 🚧 **Where the proceeds go** - one setting for the brand picks the flow,
  and the agreement pins it when it seals; a partner is always paid by bank
  - **A bank account for the consignment** - the counter names the account
    with the terms, before the agreement is prepared, and the agreement
    prints it; it pays that consignment alone and stays off the consignor's
    list
  - **A bank account kept on their list** - the same, and the account joins
    the consignor's list for the counter to pick on the next consignment
  - **Into the vault balance** - a person's proceeds go to their vault
    balance as each sale is credited, and need no bank details on file; a
    refund after that takes them back off the balance. An incentive credited
    at signing goes there too, unless the counter pays it on the spot
- ❓ Owner - **Where proceeds go by default** - recommended the vault
  balance; built as a bank account kept on the consignor's list until the
  owner decides
- 🚧 **A refund after a balance payout** - is a negative entry on the
  balance; a balance below zero is a debt that blocks cash-out and that new
  credits pay down first
- **When** - after the return window by default; an admin may switch a
  channel to paying at the sale, the refund then set against later payouts,
  or to one monthly statement
- **A return before payout** - reverses the sale; an item that comes back
  goes on sale for the rest of its term
- **A refund where the buyer keeps the card** - the house's; the sale stands
- **A return after payout** - the item comes back to the consignor with the
  choices, and the refund is set against their next payout, by default
- ❓ Product - **Nothing to set against** - when a refund after payout is
  asked back from the consignor if no later payout comes

## Seller Display

- **Off by default** - the store and the lot name no consignor
- **An admin turns it on** - for one consignment, and only where the
  consignor agreed to be named on its agreement
- **Their display name** - the name the consignor gave to be shown, never
  their legal name
- **Agreement withdrawn** - the name comes off the store and the lot at once

## What the Consignor Hears

| Message | When |
| --- | --- |
| Received | the items are checked in, with the receipt |
| Agreement signed | the sealed agreement, with its terms |
| On sale | the item is listed in the shop or at auction, with its link |
| Price changed | staff changed the price within the floor |
| Sold | the sale price, and the payout day once the buyer has the item |
| Payout date set | the buyer has the item: the payout and its day |
| Paid | the payout, with its statement |
| Ending soon | seven days before the term ends, with the choices |
| Ended unsold | the term ended, with the choices |
| Returned | the item was collected or delivered back |

- **By email** - in the consignor's language, from the brand's catalogue

## When It Ends

- ❓ Product - **What an unsold item does** - unset; the proposed actions
  a consignor may take at term's end: reduce the listed price, save it to
  the vault for long-term custody, or book an appointment to collect it
  at the shop
- **Taken back early** - the consignor may take an item back before it
  sells, for the early take-back fee where an admin set one; a lot live at
  auction only once the auction calls it off or it closes
- 🚧 **A contract with dates** - set when it is sealed; an item ends on its
  latest signed renewal, and a lot already placed runs to its close
- 🚧 **Renewal is signed** - extending or repricing prepares a renewal the
  consignor signs, linked to the one it renews
- ❓ Owner - **Running out** - a card from the vault goes back to the vault
  on its own; built this way until the owner confirms it
- 🚧 **A return is tracked and signed for** - an item going back to the
  consignor travels under its tracking, and the return closes on a signed
  return receipt
- ❓ Legal - **Nobody collects** - reminders, then a written notice and what
  follows it, as grading's ladder runs, is proposed

## Identity

- **Verified before signing** - by default the identity check the vault
  binds, so the agreement names a verified person and the payout goes to
  them
- **Other choices** - an admin may ask for the check only above a sale
  price, or not at all; a payout always goes to an account in the
  consignor's name
- **Every paper follows it** - the receipt, the agreement and a return
  receipt each ask for the check only where the setting does; a check on
  file is printed on the certificate either way - decided by the owner,
  2026-10-12
- 🚧 **A person or a company** - the consignor is an individual or a
  company; a company registers its own facts - its registered office
  address among them - where an individual registers theirs
- 🚧 **The Grade10 account** - intake records whether the consignor has a
  Grade10 account and links it, so their consignments show on their
  signed-in page
- 🚧 **Signed electronically** - the agreement and the receipts are signed
  on the documents service, the packet naming where the consignment was
  taken, the consignor's information and the linked account

:::detail{title="Product decisions" for="pm"}
A collector who wants to sell a card through Grade10 has no way to: the
store sells only what the house owns, and the auction lists only house
stock. The owner asks for store consignment first, with the auction beside
it, the commission bound to each consignment, messages as the item moves,
and the seller named only where an admin sets it. The design is
[Inventory and Services Design](/references/inventory-and-services-design).

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Wants to sell a card without running the sale | Agrees a price and a commission once, hears when it goes on sale and when it sells, and is paid on a known day |
| Partner | A dealer with a box of cards to sell | Consigns in bulk under one deal and reads one statement |
| Shop staff | A consignor at the counter | Receives, prices, signs and lists in one visit |
| Treasurer | A consigned item sold | Knows what is owed to whom and when, and records it once |
| Buyer | Buying a consigned card | Buys it as any other card, in the shop or online |

**Not in scope.** Payouts by card; consignments in a
currency other than the brand's; a consignor setting a price below the floor
themselves.

**Measurement.** Items consigned; share sold within the term; days on sale;
payouts made on their due day.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| One service, two channels | Decided | One consignment service serves the store and the auction; the consignor, the agreement, the commission and the payout are the same, and only the sale differs - decided under the owner's delegation, 2026-10-08 | Product |
| Commission bound to the consignment | Decided | Pinned when the agreement is prepared, as grading pins its fee sheet; an agreement waiting for a signature keeps its schedule, and a change reaches the next agreement prepared - decided by the owner, 2026-10-08 | Product |
| The shop and online | 🚧 | One store product per consigned item; staff list it in the shop, online or both - decided by the owner, 2026-10-27, reversing no shop-only listing of 2026-10-11 | Product |
| No reserve | Decided | A consigned lot is absolute like every auction listing; the consignor's protection is the floor and the choice of channel - decided by the owner, 2026-10-11 | Product |
| List price and floor | Decided | Staff change the price within the floor; below it only on the consignor's written yes - decided under the owner's delegation, 2026-10-08 | Product |
| Floor is the start price | Decided | An item for auction needs a floor at signing, 0 allowed; the lot opens at it and the auction cannot change it - decided under the owner's delegation, 2026-10-11 | Product |
| Paid on the listed price | Decided | The consignor is paid on the listed price; a cut the buyer gets is the house's, and a refund where the buyer keeps the card is the house's too - decided under the owner's delegation, 2026-10-11 | Product |
| Window from delivery | Decided | The return window counts from delivery: 14 days for a store sale, 7 for an auction lot delivered or collected - decided by the owner, 2026-10-11 | Product |
| Seller display | Decided | Optional and set by an admin - decided by the owner, 2026-10-08. Only where the consignor agreed, under their display name - decided under the owner's delegation, 2026-10-08 | Product |
| Messages | Decided | The consignment service sends its own, by email, as the vault and grading do - decided under the owner's delegation, 2026-10-08 | Product |
| Every figure is a setting | Decided | Commission, the minimum, fees, the term and the windows are settings admins change in the console, each pinned to a consignment when its agreement is prepared - decided by the owner, 2026-10-08 | Product |
| Flexible, with a default | Decided | Identity, when a consignor is paid and a refund after payout are settings too; the recommendation is the default: always verified, paid after the return window, a refund set against the next payout - decided by the owner, 2026-10-08 | Product |
| Instant incentive | 🚧 | The consignor is paid an incentive on the item's estimated value instantly when the consignment is taken - decided under the owner's delegation, 2026-10-16; it defaults to 0 now that a vault card earns daily, and stays a setting - 2026-10-27 | Owner |
| The channel at intake | Decided | staff record the store or the auction for the consignment when it is taken - decided under the owner's delegation, 2026-10-16 | Product |
| Taken at an event | Decided | staff receive a consignment at the shop's counter or at an event such as a card show, recording where it was taken - decided under the owner's delegation, 2026-10-16 | Product |
| Registered on the form | Decided | each item is registered with its market value and the consignment rates applying to it, and logged in Shopify when the consignment form is completed - decided under the owner's delegation, 2026-10-16 | Product |
| A company consigns | Decided | a consignor may be a company, registering its own facts - its registered office address among them - where an individual registers theirs - decided under the owner's delegation, 2026-10-16 | Product |
| The account link | Decided | intake records whether the consignor has a Grade10 account and links it, so their consignments show on their signed-in page - decided under the owner's delegation, 2026-10-16 | Product |
| The sale's paper | Decided | a sale issues the consignor a settlement statement and a commission invoice, with the contact details for payment - decided under the owner's delegation, 2026-10-16 | Product |
| A tracked return | Decided | an item going back travels under its tracking, and the return closes on a signed return receipt - decided under the owner's delegation, 2026-10-16 | Product |
| Checked before it lists | Decided | an item passes intake inspection and photography before it is published - decided under the owner's delegation, 2026-10-16 | Product |
| Shown while it sells | Decided | each item names its channel - the shop, the online store or the auction - its agreed list price, the commission rate and the consignor's estimated net payout, and counts down the days left on its term - decided under the owner's delegation, 2026-10-16 | Product |
| A consignor's own page | ❓ Open | The service answers a signed-in consignor with each consignment, its items - an auction-bound one showing once checked in, before its lot lists - their prices, sales and payouts, the terms pinned to it, the payouts made, its documents and the emails sent; the screen itself is still to be drawn, and a buyer's seller line waits for a store product that names its item - owner, 2026-10-12, brief 2026-10-16. The designer proposes it under a Consignments and Sales section - one of three signed-in sections by what the items mean, with vault pages for held assets and submissions for items in service - designer, 2026-10-16 | Product |
| Nobody collects | ❓ Open | Reminders, then a written notice, as grading's ladder runs | Legal |
| Delivery never reported | ❓ Open | When an online sale's return window starts if its delivery is never reported; until decided, it waits for a reported delivery or staff recording one | Product |
| Selling from the vault | Decided | A storage card is consigned where it sits and released to its buyer on delivery under the consignment agreement; the exact clause is confirmed later - owner, 2026-10-27 | Owner |
| Points and discounts | ❓ Open | Whether points, coupons and the shop's discounts reach a consigned card; the consignor is paid on the listed price either way | Product |
| Nothing to set against | ❓ Open | When a refund after payout is asked back from the consignor if no later payout comes | Product |
| Graded only | ❓ Open | Proposed: intake takes graded collectables only at launch, there being no grading service on day 1; whether ungraded is ever taken | Product |
| The figures | ❓ Open | Proposed: a consignment fee of **10–12%** of the sale price at sale; the exact figures, and whether a paid incentive is set against the payout | Product |
| The term's figure | ❓ Open | The running default is **90** days; **30** or **60** are asked for; the figure is unset | Product |
| An unsold item at term's end | ❓ Open | Proposed actions a consignor may take: reduce the listed price, save it to the vault for long-term custody, or book an appointment to collect it at the shop | Product |
| The payout flow | ❓ Open | One brand setting, pinned at sealing: a bank account named for the consignment alone, the same account kept on the consignor's list, or the person's vault balance; a partner is always paid by bank. Which is the default is open - owner, 2026-10-27; built as the account kept on the consignor's list until the owner decides, 2026-10-29 | Owner |
:::
