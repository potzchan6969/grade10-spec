---
title: Consignment
icon: storefront
---

Consignment is the house selling an item a collector or a partner owns, in
the shop or at auction, for a commission bound to the consignment.

## Values

| Rule | Value |
| --- | --- |
| Channels | the store, in the shop and online; the auction |
| Store commission | ❓ Commercial: a share of the sale price, by price band |
| Auction commission | ❓ Commercial: a share of the hammer price; the buyer's premium stays the house's |
| Minimum commission | ❓ Commercial: per item |
| Term on sale | ❓ Commercial: **90** days proposed |
| Payout | ❓ Commercial: **14** days after a store sale, **7** days after an auction lot is delivered or kept in the vault, proposed |
| Ending soon | **7** days before the term ends |
| Currency | the brand's; HKD for Grade10 |

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
After the return window, the sale price less commission and fees, by bank transfer, with a statement.
:::

:::flow{title="One consignment" case="At auction"}
## *Consignor* - **Asks**
Online, or at the counter with staff, naming the items.

## *Staff* - **Receives the items**
As in the shop; an item already in the vault stays there.

## *Staff and consignor* - **Agree the terms**
The reserve where the consignor sets one, the commission from the schedule, and whether the consignor may be named.

## *Consignor* - **Signs**
The consignment agreement.

## *Staff* - **Lists the lot**
A lot made from the item, its photographs and facts, in a campaign or alone - [Auction Management](/p/grade10-admin/auction/management#listings).

## *Winner* - **Pays**
The winner's order runs as for any lot; the winner may also collect at a shop or keep the item in the vault.

## *Treasurer* - **Pays the consignor**
Once the lot is delivered or kept in the vault and the window has passed, the hammer price less commission and fees.
:::

- **One item, one channel** - an item is on sale in the shop or at auction,
  never both - [Services and Hand-offs](/p/grade10-admin/inventory/services#marks-that-share-an-item)
- **The consignor's until sold** - the owner moves to the buyer only when the
  item leaves to them or is kept in the vault for them

## Price

- **List price and floor** - agreed for each item at signing
- **Within the floor** - staff change the price without asking, and the
  consignor is told
- **Below the floor** - only on the consignor's written yes, kept on the
  consignment
- **At auction** - the consignor's reserve, where they set one

## Commission and Payout

- **Bound to the consignment** - the commission and fees in force at signing
  are pinned to it; a later schedule never reaches a signed consignment
- **Outside the schedule** - a commission a partner negotiates is set by
  someone who may approve it -
  [Consignment Console](/p/grade10-site/consignment/operator-console#grants)
- **What is paid** - the sale price less commission and fees; at auction, the
  hammer price less commission and fees, the buyer's premium being the
  house's
- **How** - a bank transfer a treasurer records with its reference; a
  correction takes a second holder of the payout grant
- **A refund before payout** - reverses the sale; an item that comes back
  goes on sale for the rest of its term
- ❓ Commercial - **A refund after payout** - set against the consignor's
  next payout is proposed

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
| On sale | the item is listed in the shop or at auction |
| Price changed | staff changed the price within the floor |
| Sold | the sale price, and the day the payout is due |
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
- **Taken back early** - the consignor may take an item back before it sells
- ❓ Commercial - **A fee for taking it back** - whether one applies
- ❓ Legal - **Nobody collects** - reminders, then a written notice and what
  follows it, as grading's ladder runs, is proposed

## Identity

- ❓ Legal - **Verified before signing** - the identity check the vault
  binds, so the agreement names a verified person and the payout goes to
  them, is recommended

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

**Not in scope.** A consignor's own page listing their consignments, which
waits for a collector's page of their items; payouts by card or into a
wallet; consignments in a currency other than the brand's; a consignor
setting a price below the floor themselves.

**Measurement.** Items consigned; share sold within the term; days on sale;
payouts made on their due day.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| One service, two channels | Decided | One consignment service serves the store and the auction; the consignor, the agreement, the commission and the payout are the same, and only the sale differs - decided under the owner's delegation, 2026-10-08 | Product |
| Commission bound to the consignment | Decided | Pinned at signing, as grading pins its fee sheet; a schedule change reaches only consignments not yet signed - decided by the owner, 2026-10-08 | Product |
| The shop and online | Decided | One store product per consigned item sells in the shop and online; staff may limit it to the shop - decided under the owner's delegation, 2026-10-08 | Product |
| List price and floor | Decided | Staff change the price within the floor; below it only on the consignor's written yes - decided under the owner's delegation, 2026-10-08 | Product |
| Seller display | Decided | Optional and set by an admin - decided by the owner, 2026-10-08. Only where the consignor agreed, under their display name - decided under the owner's delegation, 2026-10-08 | Product |
| Messages | Decided | The consignment service sends its own, by email, as the vault and grading do - decided under the owner's delegation, 2026-10-08 | Product |
| Verified identity before signing | ❓ Open | Recommended | Legal |
| When a consignor is paid | ❓ Open | After the return window, by bank transfer a treasurer records | Commercial |
| The figures | ❓ Open | Commission for each channel, the minimum, the term and fees | Commercial |
| Nobody collects | ❓ Open | Reminders, then a written notice, as grading's ladder runs | Legal |
:::
