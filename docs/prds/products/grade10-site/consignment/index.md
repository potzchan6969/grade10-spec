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
| Channels | the store, in the shop and online; the auction |
| Store commission | a share of the sale price, by price band; unset until an admin sets it |
| Auction commission | a share of the hammer price, unset until an admin sets it; the buyer's premium stays the house's |
| Minimum commission | per item; none |
| Fees | listing, return and early take-back; none |
| Term on sale | **90** days |
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
- **A card in a vault case** - refused until its vault case is released;
  the item can be consigned in the same visit
- ❓ Product - **Selling from the vault** - whether the consignor releases
  the vault case first, or the case passes to the buyer -
  [Services and Hand-offs](/p/grade10-admin/inventory/services#marks-that-share-an-item)
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
- **What is paid** - the listed price less commission and fees; at auction, the
  hammer price less commission and fees, the buyer's premium being the
  house's
- **How** - a bank transfer a treasurer records with its reference; a
  correction takes a second holder of the payout grant
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

- **Ended unsold** - the consignor picks: extend the term, change the price,
  the other channel, the vault, or collect or ship it back
- **Unsold at auction** - relist, the store, the vault, or collect or ship it
  back
- **Taken back early** - the consignor may take an item back before it
  sells, for the early take-back fee where an admin set one; a lot live at
  auction only once the auction calls it off or it closes
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

**Not in scope.** Payouts by card or into a wallet; consignments in a
currency other than the brand's; a consignor setting a price below the floor
themselves.

**Measurement.** Items consigned; share sold within the term; days on sale;
payouts made on their due day.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| One service, two channels | Decided | One consignment service serves the store and the auction; the consignor, the agreement, the commission and the payout are the same, and only the sale differs - decided under the owner's delegation, 2026-10-08 | Product |
| Commission bound to the consignment | Decided | Pinned when the agreement is prepared, as grading pins its fee sheet; an agreement waiting for a signature keeps its schedule, and a change reaches the next agreement prepared - decided by the owner, 2026-10-08 | Product |
| The shop and online | Decided | One store product per consigned item sells in the shop and online, wherever the store sells - decided under the owner's delegation, 2026-10-08; no shop-only listing - decided by the owner, 2026-10-11 | Product |
| No reserve | Decided | A consigned lot is absolute like every auction listing; the consignor's protection is the floor and the choice of channel - decided by the owner, 2026-10-11 | Product |
| List price and floor | Decided | Staff change the price within the floor; below it only on the consignor's written yes - decided under the owner's delegation, 2026-10-08 | Product |
| Floor is the start price | Decided | An item for auction needs a floor at signing, 0 allowed; the lot opens at it and the auction cannot change it - decided under the owner's delegation, 2026-10-11 | Product |
| Paid on the listed price | Decided | The consignor is paid on the listed price; a cut the buyer gets is the house's, and a refund where the buyer keeps the card is the house's too - decided under the owner's delegation, 2026-10-11 | Product |
| Window from delivery | Decided | The return window counts from delivery: 14 days for a store sale, 7 for an auction lot delivered or collected - decided by the owner, 2026-10-11 | Product |
| Seller display | Decided | Optional and set by an admin - decided by the owner, 2026-10-08. Only where the consignor agreed, under their display name - decided under the owner's delegation, 2026-10-08 | Product |
| Messages | Decided | The consignment service sends its own, by email, as the vault and grading do - decided under the owner's delegation, 2026-10-08 | Product |
| Every figure is a setting | Decided | Commission, the minimum, fees, the term and the windows are settings admins change in the console, each pinned to a consignment when its agreement is prepared - decided by the owner, 2026-10-08 | Product |
| Flexible, with a default | Decided | Identity, when a consignor is paid and a refund after payout are settings too; the recommendation is the default: always verified, paid after the return window, a refund set against the next payout - decided by the owner, 2026-10-08 | Product |
| A consignor's own page | ❓ Open | The site has no screen for it yet; the designers draw it. The service already answers a signed-in consignor with each consignment, its items' prices, sales and payouts, the terms pinned to it, the payouts made, its documents and the emails sent; a buyer's seller line waits for a store product that names its item - owner, 2026-10-12 | Product |
| Nobody collects | ❓ Open | Reminders, then a written notice, as grading's ladder runs | Legal |
| Delivery never reported | ❓ Open | When an online sale's return window starts if its delivery is never reported; until decided, it waits for a reported delivery or staff recording one | Product |
| Selling from the vault | ❓ Open | Whether the consignor releases the vault case first, or the case passes to the buyer; until decided, a card in a vault case is refused until it is released | Product |
| Points and discounts | ❓ Open | Whether points, coupons and the shop's discounts reach a consigned card; the consignor is paid on the listed price either way | Product |
| Nothing to set against | ❓ Open | When a refund after payout is asked back from the consignor if no later payout comes | Product |
:::
