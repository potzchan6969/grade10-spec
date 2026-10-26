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
| Store commission | a share of the sale price, by price band; the band prefills each item, and staff may change it per item at intake |
| Auction commission | a share of the hammer price, prefilled per item the same way; the buyer's premium stays the house's |
| Minimum commission | per item; none |
| Fees | listing, return and early take-back; none, and never taken from the payout; the vault's early take-out fee takes the take-back fee's place |
| Contract period | **90** days per consignment, from signing |
| Return window | **14** days after a store sale is delivered; **7** days after an auction lot is delivered or collected |
| When proceeds are credited | to the consignor's balance, after the return window |
| A refund after the window | debited from the consignor's balance |
| Statements | one settlement statement and one commission invoice per consignor each month |
| Identity before signing | not asked; an ID is sighted at the counter |
| Ending soon | **7** days before the term ends |
| Currency | the brand's; HKD for Grade10 |
| Auction rate | the HKD to one USD an admin sets exactly; the auction sells in USD |

- **Unset refuses** - an agreement is not prepared while a figure it prints
  is unset
- 🚧 **Set per item** - each item carries its own commission share and
  minimum, prefilled from the settings and changed by staff at intake; the
  consignment carries one contract period
- 🚧 **The rate is pinned** - an auction item carries the admin's rate from
  the moment it goes to auction; its USD start is the floor at that rate,
  rounded up, or a higher start staff type, and the hammer comes back to
  HKD at the same rate
- ❓ Product - **Delivery never reported** - when the return window of an
  online sale starts if its delivery is never reported; until the owner
  decides, it waits for a reported delivery or staff recording one
- ❓ Product - **The commission figures** - the intended consignment fee is
  **10–12%** of the sale price at sale; the bands are unset
- ❓ Product - **The term's figure** - the running default is **90**
  days; **30** or **60** are asked for; the figure is unset

## One Consignment

:::flow{title="One consignment" case="In the shop"}
## *Consignor* - **Asks**
At the counter or an event with staff, naming the items and the price they hope for.

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

## *Consignor* - **Is paid**
After the return window, the listed price less commission reaches their balance, which they cash out - [Balance](/p/grade10-site/account/balance#cash-out).
:::

:::flow{title="One consignment" case="At auction"}
## *Consignor* - **Asks**
At the counter or an event with staff, naming the items.

## *Staff* - **Receives the items**
As in the shop; an item in a vault case is taken once its case is released.

## *Staff and consignor* - **Agree the terms**
A floor for each item, which sets the lot's USD start at the pinned rate and which the auction cannot go below; the commission prefilled from the schedule; and whether the consignor may be named. The lot has no reserve.

## *Consignor* - **Signs**
The consignment agreement.

## *Staff* - **Lists the lot**
The lot comes to auction admin as a draft made from the item, its photographs and facts; staff place it in a campaign or alone - [Auction Management](/p/grade10-admin/auction/management#listings).

## *Winner* - **Pays**
The winner's order runs as for any lot; the winner may collect at a shop instead, then keep the card in a vault case of their own.

## *Consignor* - **Is paid**
Once the lot is delivered or collected and the window has passed, the hammer price less commission, back in HKD at the pinned rate, reaches their balance.
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
- 🚧 **Held in the vault** - every consigned item is held in a storage vault
  case of its owner's, opened when the agreement is signed and closed when
  the item leaves to its buyer or goes back; consignment sells it and the
  vault keeps it - [Yield](/p/grade10-site/vault/yield#consigned-items)
- 🚧 **Yield, not an incentive** - an admin picks at intake whether each
  item earns the vault's yield while it waits to sell; consignment pays no
  incentive of its own
- 🚧 **A card already in the vault** - consigned from its storage vault case
  without a release; a card securing a loan is refused until the loan is
  repaid
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
- 🚧 **Anything is taken** - a raw card, a graded slab with its grader,
  grade and cert, or a sealed box or pack, one record each; a card names its
  set, number and language where staff know them - decided by the owner,
  2026-10-26
- 🚧 **Shown while it sells** - each item names its channel - the shop,
  the online store or the auction - its agreed list price, the commission
  rate and the consignor's estimated net payout, and counts down the days
  left on its term
- ❓ **Asking online, not built** - only staff open a consignment; the site
  has no request page until its form and rules are designed

## Price

- **List price and floor** - agreed for each item at signing
- 🚧 **A price names its evidence** - the floor, the list price and every
  later price carry a reference link staff found the price at, such as
  PriceCharting or SNKRDUNK, and each change shows on the item's audit trail
  with its link and who made it - decided by the owner, 2026-10-26
- **Within the floor** - staff change the price without asking, and the
  consignor is told
- 🚧 **Below the floor** - staff may set it with its reference link, and it
  applies only once the consignor confirms it from a link sent to them -
  decided by the owner, 2026-10-26
- **At auction** - the auction sells in USD; the floor at the pinned rate is
  the lot's lowest start, and the auction cannot go below it; no reserve, as
  on every listing - [Bidding](/p/grade10-site/auction/bidding)
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
- 🚧 **The account's balance** - every consignment pays into the
  consignor's one balance, which the vault's yield reaches too and which can
  only be withdrawn, never spent - [Balance](/p/grade10-site/account/balance)
- 🚧 **What reaches the balance** - each sale's listed price, or hammer
  price, less commission once its return window closes; a refund or
  chargeback after the window comes off it
- 🚧 **Cash-out and debts** - asked for, approved and paid, and a balance
  below zero cleared, on the balance's own rules -
  [Balance](/p/grade10-site/account/balance#cash-out)
- **What is paid** - the listed price less commission; at auction, the
  hammer price less commission, the buyer's premium being the house's
- 🚧 **The month's paper** - each month a consignor with movement gets one
  settlement statement, a line per item, and one commission invoice marked
  settled by deduction; a refund after the invoice issues a credit note
- **A return before the window closes** - reverses the sale; an item that
  comes back goes on sale for the rest of its term
- **A refund where the buyer keeps the card** - the house's; the sale stands

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
| Credit date set | the buyer has the item: the proceeds and the day they reach the balance |
| Credited | the sale's proceeds reached the balance |
| Ending soon | seven days before the term ends, with the choices |
| Ended unsold | the term ended, with the choices |
| Returned | the item was collected or delivered back |

- **By email** - in the consignor's language, from the brand's catalogue
- **Payouts and debts** - told by the balance -
  [Balance](/p/grade10-site/account/balance#what-the-holder-hears)

## When It Ends

- ❓ Product - **What an unsold item does** - unset; the proposed actions
  a consignor may take at term's end: reduce the listed price, keep it in
  its vault case, or book an appointment to collect it at the shop
- **Taken back early** - the consignor may take an item back before it
  sells, for the early take-back fee where an admin set one; a lot live at
  auction only once the auction calls it off or it closes
- 🚧 **Inside the yield's minimum term** - an item earning the vault's yield
  that is taken back inside its minimum term owes the vault's early take-out
  fee - [Yield](/p/grade10-site/vault/yield#taking-it-out)
- 🚧 **A return is tracked and signed for** - an item going back to the
  consignor travels under its tracking, and the return closes on a signed
  return receipt
- ❓ Legal - **Nobody collects** - reminders, then a written notice and what
  follows it, as grading's ladder runs, is proposed

## Identity

- 🚧 **Sighted at the counter** - staff look at the consignor's photo ID at
  intake and record its type and last four characters; the agreement does
  not wait for an online check
- 🚧 **Verified before the first payout** - on the balance's rule: the
  identity check the vault binds, or a counter check; a company also passes
  its business check - [Balance](/p/grade10-site/account/balance#identity-and-details)
- ❓ Legal - **Identity at payout, not at signing** - that a sighted ID at
  intake and a verified check before payout meet the house's obligations
- **Other choices** - an admin may still ask for the check before signing,
  above a sale price; a payout always goes to an account in the consignor's
  name
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
- 🚧 **Signed electronically** - the agreement is signed on the documents
  service by the consignor and by staff for the house, the packet naming
  where the consignment was taken, the consignor's information and the
  linked account; there is no paper signing - decided by the owner,
  2026-10-26
- 🚧 **One consignor per account** - a consignor is one Grade10 account,
  holding their facts and identity once for every consignment, with the
  payout account and balance the account's own; a walk-in with no account
  is given a light one and an invite, and an admin opens a company account
  for a partner

## Documents

| Paper | When | The consignor |
| --- | --- | --- |
| Consignment agreement | at intake, one per batch | signs; staff sign for the house |
| Custody receipt | the items are received | confirms |
| Settlement statement | each month | receives |
| Commission invoice | with each statement | receives |
| Credit note | a refund reverses an invoiced commission | receives |
| Return receipt | an item is handed back | signs |

- 🚧 **Confirm is a tap** - a receipt is confirmed with one tap on the
  counter's iPad, or from a link with a one-time code sent to the
  consignor's own contact
- 🚧 **Numbered, never edited** - the statement, the invoice and the credit
  note each carry the next number of their series; a correction issues a new
  version, and nothing is deleted
- 🚧 **Sensitive details** - ID numbers are stored encrypted, shown masked
  to everyone, and revealed one at a time to finance, each reveal recorded;
  they are kept seven years after the consignor's last transaction, and an
  erasure request in that time restricts them instead; payout account
  numbers are the balance's
- ❓ Finance - **The wording** - the statement, invoice, credit note and
  debit note wording, the house's business registration details, and the
  bank's bulk-payment file
- ❓ Product - **Early return and renewal papers** - the renewal addendum,
  the withdrawal note and the collector's authorisation come with the exit
  phase

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
| Flexible, with a default | Decided | Identity and when proceeds are credited are settings; identity is now sighted at intake and verified before the first payout, proceeds are credited after the return window - decided by the owner, 2026-10-08, revised 2026-10-26 | Product |
| Instant incentive | Decided | None: the vault's yield on a consigned item replaces the **5%** incentive once credited at signing, which is withdrawn - decided by the owner, 2026-10-26 | Owner |
| The channel at intake | Decided | staff record the store or the auction for the consignment when it is taken - decided under the owner's delegation, 2026-10-16 | Product |
| Taken at an event | Decided | staff receive a consignment at the shop's counter or at an event such as a card show, recording where it was taken - decided under the owner's delegation, 2026-10-16 | Product |
| Registered on the form | Decided | each item is registered with its market value and the consignment rates applying to it, and logged in Shopify when the consignment form is completed - decided under the owner's delegation, 2026-10-16 | Product |
| A company consigns | Decided | a consignor may be a company, registering its own facts - its registered office address among them - where an individual registers theirs - decided under the owner's delegation, 2026-10-16 | Product |
| The account link | Decided | intake records whether the consignor has a Grade10 account and links it, so their consignments show on their signed-in page - decided under the owner's delegation, 2026-10-16 | Product |
| The sale's paper | Decided | a sale issues the consignor a settlement statement and a commission invoice, with the contact details for payment - decided under the owner's delegation, 2026-10-16 | Product |
| A tracked return | Decided | an item going back travels under its tracking, and the return closes on a signed return receipt - decided under the owner's delegation, 2026-10-16 | Product |
| Checked before it lists | Decided | an item passes intake inspection and photography before it is published - decided under the owner's delegation, 2026-10-16 | Product |
| Shown while it sells | Decided | each item names its channel - the shop, the online store or the auction - its agreed list price, the commission rate and the consignor's estimated net payout, and counts down the days left on its term - decided under the owner's delegation, 2026-10-16 | Product |
| Anything taken | Decided | Raw cards, graded slabs and sealed product are all taken, one record each - decided by the owner, 2026-10-26 | Product |
| A balance | Decided | Proceeds reach the consignor's balance and payouts are asked for against it; a negative balance is a debt that blocks payouts - decided by the owner, 2026-10-26. The balance is the account's, shared with the vault's yield, not consignment's - on the owner's direction, 2026-10-26 | Product |
| One consignor per account | Decided | The consignor's facts and identity live once on their Grade10 account, not on each consignment - decided by the owner, 2026-10-26; the payout account and the balance are the account's - 2026-10-26 | Product |
| A partner's account | Decided | An admin opens a company account for a partner, so its consignments, balance and vault cases hang on an account as anyone's do - decided by the owner, 2026-10-26 | Owner |
| Identity before payout | Decided | An ID is sighted at intake; a verified check is required before the first payout, not before signing - decided by the owner, 2026-10-26, Legal to confirm | Product |
| Prices with evidence | Decided | Every price carries a reference link and an audit trail; below the floor needs the link and the consignor's confirmation - decided by the owner, 2026-10-26 | Product |
| Online and auction | Decided | A consigned item sells in the shop and online, or at auction - decided by the owner, 2026-10-26 | Product |
| E-sign only | Decided | Agreements are signed only through the documents service; the paper fallback goes - decided by the owner, 2026-10-26 | Product |
| Per item commercials | Decided | Commission share and minimum are set per item, prefilled from the settings; one contract period per consignment - decided by the owner, 2026-10-26 | Product |
| Fees off the payout | Decided | Listing, return and take-back fees stay settings at none and are never taken from the payout - decided by the owner, 2026-10-26 | Product |
| The auction's rate | Decided | The auction sells in USD; an admin sets the HKD per USD rate exactly, pinned on an item when it goes to auction - decided by the owner, 2026-10-26 | Product |
| Sensitive details | Decided | ID and bank numbers encrypted, masked, revealed to finance one at a time on the record, kept seven years after the last transaction - decided by the owner, 2026-10-26; bank numbers are kept by the balance | Product |
| The commission figures | ❓ Open | Proposed: a consignment fee of **10–12%** of the sale price at sale; the bands are unset | Product |
| A consignor's own page | ❓ Open | The service answers a signed-in consignor with each consignment, its items - an auction-bound one showing once checked in, before its lot lists - their prices, sales and payouts, the terms pinned to it, the payouts made, its documents and the emails sent; the screen itself is still to be drawn, and a buyer's seller line waits for a store product that names its item - owner, 2026-10-12, brief 2026-10-16. The designer proposes it under a Consignments and Sales section - one of three signed-in sections by what the items mean, with vault pages for held assets and submissions for items in service - designer, 2026-10-16 | Product |
| Nobody collects | ❓ Open | Reminders, then a written notice, as grading's ladder runs | Legal |
| Delivery never reported | ❓ Open | When an online sale's return window starts if its delivery is never reported; until decided, it waits for a reported delivery or staff recording one | Product |
| Held in the vault | Decided | Every consigned item is held in a storage vault case, so consignment sells and the vault keeps; a card already in a storage case is consigned without a release, the sale closes the consignor's case, and a buyer who keeps the card opens a case of their own - on the owner's direction, 2026-10-26 | Product |
| Yield is the vault's | Decided | An admin picks at intake whether a consigned item earns the vault's yield; consignment never pays it - on the owner's direction, 2026-10-26 | Product |
| Two early fees | Decided | The vault's early take-out fee supersedes consignment's early take-back fee, which stays at none; the setting is kept for a later change - decided by the owner, 2026-10-26 | Owner |
| Points and discounts | ❓ Open | Whether points, coupons and the shop's discounts reach a consigned card; the consignor is paid on the listed price either way | Product |
| The term's figure | ❓ Open | The running default is **90** days; **30** or **60** are asked for; the figure is unset | Product |
| An unsold item at term's end | ❓ Open | Proposed actions a consignor may take: reduce the listed price, save it to the vault for long-term custody, or book an appointment to collect it at the shop | Product |
:::
