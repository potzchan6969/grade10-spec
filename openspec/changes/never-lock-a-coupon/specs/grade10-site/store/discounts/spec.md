# Discounts — delta

## Feature set

- One discount code or coupon per order
  - Transport: a typed discount code, an order coupon, a product coupon and a
    loyalty reward's own coupon each ride as one Shopify Discount code; a gift
    does too online, and at the till is its own line discounted to nothing
  - At most one applies per order; a checkout eligible for more than one has
    the collector pick
  - A site discount the shop applies in place of the code keeps the sale;
    the coupon returns to the wallet and the member is told
- An ephemeral code, minted once
  - An unpaid sale's code: an online order that expires keeps its code and
    its claim until the code can no longer be collected; a counter sale that
    runs out its hour, or that a newer promise retires, has its code
    deactivated and keeps its cart
  - A sale that collects a deactivated code is settled from what the shop
    says it carried, and reported
- Two channels
  - A counter sale a reward was cleared off takes no reward again, and points
    still go on; one a newer promise retired takes no new plan

## REMOVED Feature set

- One discount-code slot

## MODIFIED Requirements

### Requirement: A coupon reaches the order as its own ephemeral Shopify Discount code

A product coupon, a gift, and a loyalty reward's own coupon SHALL each reach
the order as their own single-use Shopify Discount code. Grade10 SHALL NOT
weld a custom discount onto the draft order's lines for any of them.

At the POS till, a gift SHALL instead reach the sale as its own line,
discounted to nothing, and SHALL carry no code: a code as well would ask the
shop for the same benefit twice and spend the order's one discount-code slot
on a line already at nothing. Settlement SHALL read a till gift by that line,
as it reads a code.

Every such code SHALL be minted when an order claims the coupon, and SHALL be
scoped to the member's paired Shopify customer. A member with no paired
Shopify customer SHALL be refused rather than issued an unscoped code, since a
code that is not scoped to its member is a bearer string anyone may spend.

<!-- trace:scenario id=g10.store-discounts.SC-d4g rev=1 -->
#### Scenario: grade10-site-store-discounts-SC-01 - A product coupon settles by its own Shopify Discount code
**Serves:** grade10-site-store-discounts-US-01 - Collector redeems a coupon at checkout

- **GIVEN** a member holding a product coupon whose basket qualifies
- **WHEN** the checkout is submitted
- **THEN** the draft order carries the coupon's own single-use Shopify Discount code, not a welded line discount

<!-- trace:scenario id=g10.store-discounts.SC-o8t rev=1 -->
#### Scenario: grade10-site-store-discounts-SC-02 - A gift settles by its own Shopify Discount code
**Serves:** grade10-site-store-discounts-US-01 - Collector redeems a coupon at checkout

- **GIVEN** a member holding a gift whose basket clears its threshold
- **WHEN** the checkout is submitted
- **THEN** the draft order carries the gift product at a full cut through the gift's own single-use Shopify Discount code
- **AND** the gift's line carries no discount of its own, so the benefit is taken exactly once

<!-- trace:scenario id=g10.store-discounts.SC-s75 rev=1 -->
#### Scenario: grade10-site-store-discounts-SC-08 - A reward coupon settles by its own Shopify Discount code
**Serves:** grade10-site-store-discounts-US-01 - Collector redeems a coupon at checkout

- **GIVEN** a member redeeming a reward coupon against an order
- **WHEN** the order claims the reward coupon
- **THEN** the order carries the reward coupon's own single-use, customer-scoped Shopify Discount code
- **AND** the order later settles reporting that code, not a welded line discount

<!-- trace:scenario id=g10.store-discounts.SC-fc9 rev=1 -->
#### Scenario: grade10-site-store-discounts-SC-28 - A gift at the till is its own line and carries no code
**Serves:** One discount code or coupon per order - at the till a gift is its own line discounted to nothing

- **GIVEN** a member's gift reward whose basket clears its threshold at a till
- **WHEN** staff apply it and the sale is paid
- **THEN** the gift reaches the sale as its own line discounted to nothing, and no code is minted for it
- **AND** the sale settles the gift by that line

<!-- trace:scenario id=g10.store-discounts.SC-2qg rev=1 -->
#### Scenario: grade10-site-store-discounts-SC-12 - A member with no paired Shopify customer is refused
**Serves:** grade10-site-store-discounts-US-03 - Collector keeps the coupon when a checkout cannot take it

- **GIVEN** a member whose Shopify customer pairing has not converged
- **WHEN** they apply a coupon to a checkout
- **THEN** the coupon is refused, naming the pairing as the reason
- **AND** no unscoped discount code is minted

### Requirement: A live cart price previews locally, and mints nothing until an order claims the coupon

A cart's live price, shown as the collector edits the basket, SHALL be
estimated without minting a Shopify Discount. A coupon's code SHALL be minted
only once an order claims it.

A mint the shop refuses SHALL refuse the checkout, naming the coupon, and
SHALL leave no order behind and the coupon still spendable. A code minted
against an order that is then canceled or fails SHALL be deactivated, and the
coupon returned to the member.

An online order that merely expires SHALL keep its claim and its code until
the code can no longer be collected; the programme's clock then releases the
claim. A counter sale that runs out its hour, or that a newer promise
retires, SHALL give its coupon back: its code SHALL be deactivated, and the
sale SHALL keep its cart. A claim on the coupon from another sale SHALL
deactivate the code of the sale that held it and take the cut off that sale,
unless that sale is an online checkout the provider reports collected or will
not close, where the claim is refused by name —
`grade10-site/loyalty/programme`'s own requirement.

The shop goes on honouring a code a cart already carries, so a counter sale
paid with a reward's code its order had given up — or, for a gift, with the
gift's line — SHALL be settled against what it carried: it SHALL spend the
coupon where no other sale claims it and the coupon is still unspent, and
SHALL spend nothing otherwise. Either way it SHALL be reported to an operator
with the order on it.

<!-- trace:scenario id=g10.store-discounts.SC-gtt rev=1 -->
#### Scenario: grade10-site-store-discounts-SC-05 - Editing the cart does not mint a coupon's code
**Serves:** grade10-site-store-discounts-US-01 - Collector redeems a coupon at checkout

- **GIVEN** a basket that qualifies for a product coupon
- **WHEN** the collector adds or removes a line and the cart price re-previews
- **THEN** no Shopify Discount code is minted for that coupon

<!-- trace:scenario id=g10.store-discounts.SC-pl1 rev=1 -->
#### Scenario: grade10-site-store-discounts-SC-06 - An order claiming the coupon mints its code
**Serves:** grade10-site-store-discounts-US-01 - Collector redeems a coupon at checkout

- **GIVEN** a basket that qualifies for a product coupon
- **WHEN** the collector submits the checkout
- **THEN** the coupon's Shopify Discount code is minted and carried on the draft order

<!-- trace:scenario id=g10.store-discounts.SC-v2s rev=1 -->
#### Scenario: grade10-site-store-discounts-SC-11 - A refused mint refuses the checkout and keeps the coupon
**Serves:** grade10-site-store-discounts-US-03 - Collector keeps the coupon when a checkout cannot take it

- **GIVEN** a basket that qualifies for a coupon
- **WHEN** the shop refuses the mint
- **THEN** the checkout is refused naming that coupon
- **AND** no order is left behind, and the coupon is still spendable

<!-- trace:scenario id=g10.store-discounts.SC-vsw rev=1 -->
#### Scenario: grade10-site-store-discounts-SC-13 - A dead order's unspent code is deactivated
**Serves:** grade10-site-store-discounts-US-03 - Collector keeps the coupon when a checkout cannot take it

- **GIVEN** an order carrying a minted, unspent discount code
- **WHEN** that order is canceled or fails
- **THEN** the code is deactivated and the coupon returns to the member

<!-- trace:scenario id=g10.store-discounts.SC-cvt rev=1 -->
#### Scenario: grade10-site-store-discounts-SC-19 - A counter sale that runs out its hour loses its code
**Serves:** grade10-site-store-discounts-US-03 - Collector keeps the coupon when a checkout cannot take it

- **GIVEN** a counter sale carrying a code for the member's coupon, never tendered
- **WHEN** an hour passes since the sale's last plan
- **THEN** the code is deactivated and the coupon is spendable again
- **AND** the sale is not cancelled and keeps its cart

<!-- trace:scenario id=g10.store-discounts.SC-82q rev=1 -->
#### Scenario: grade10-site-store-discounts-SC-26 - An expired online order keeps its code while its checkout can collect
**Serves:** grade10-site-store-discounts-US-03 - Collector keeps the coupon when a checkout cannot take it

- **GIVEN** an online order carrying a coupon's code, never paid, whose checkout the store could not close
- **WHEN** the order expires
- **THEN** the order is not cancelled and its code is still live
- **AND** the order still claims the coupon

<!-- trace:scenario id=g10.store-discounts.SC-evl rev=1 -->
#### Scenario: grade10-site-store-discounts-SC-23 - A sale paid with a code it gave up spends the coupon nobody else claims
**Serves:** An ephemeral code, minted once - a sale that collects a deactivated code is settled from what it carried

- **GIVEN** a counter sale that ran out its hour while its cart still carried the reward's code, and no other sale claiming that coupon
- **WHEN** the sale is paid carrying the code
- **THEN** the coupon is used by that sale
- **AND** the sale is reported to an operator with the order on it

<!-- trace:scenario id=g10.store-discounts.SC-it9 rev=1 -->
#### Scenario: grade10-site-store-discounts-SC-21 - A sale that collects a code another sale claims spends nothing
**Serves:** grade10-site-store-discounts-US-04 - Shop staff spends a member's product coupon at the till

- **GIVEN** a counter sale whose coupon the member claimed at another sale, while its cart still carried the old code
- **WHEN** the first sale is paid carrying that code
- **THEN** it spends nothing, and the coupon stays with the sale that claims it
- **AND** the first sale is reported to an operator with the order on it

<!-- trace:scenario id=g10.store-discounts.SC-l2h rev=1 -->
#### Scenario: grade10-site-store-discounts-SC-25 - A gift line a sale gave up is read like its code
**Serves:** An ephemeral code, minted once - a sale that collects a deactivated code is settled from what it carried

- **GIVEN** a counter sale whose gift reward ran out its hour while the gift's line stayed on the cart, and no other sale claiming that coupon
- **WHEN** the sale is paid showing the gift's line
- **THEN** the coupon is used by that sale, and the sale is reported to an operator

### Requirement: The same discount-code mechanism applies online and at the POS till

A product coupon taken at the POS till SHALL reach the till's own sale by the
same single-use Shopify Discount code mechanism as the online checkout. A
re-plan of the same sale SHALL reuse the code already minted for it; where the
coupon's cut has changed, that coupon SHALL be refused on that re-plan rather
than a second code minted, since the till cannot remove one code from a sale.

A counter sale that has closed — paid, run out its hour, or retired by a newer
promise, one whose coupon was claimed elsewhere among them — SHALL take no new
plan, and staff SHALL be told to ring the goods on a new sale rather than to
scan the member's card again, since a fresh scan would leave the deactivated
code on the same cart. A till session lives ten minutes and a sale's hour
outlasts it, so a fresh scan is how staff reach a cart again after the hour:
a plan from a new session on a cart that still carries another sale's reward
code SHALL be refused the same way, since that plan would retire the other
sale and leave its code dead on the cart. Where a reward's code has
left a sale that is still open — cleared off it — the sale SHALL take no reward
again, that coupon or another, and the refusal SHALL name a new sale rather
than repeat the remedy that took the code off. A re-plan that names no reward
SHALL go through, so points still go on that sale.

<!-- trace:scenario id=g10.store-discounts.SC-q23 rev=1 -->
#### Scenario: grade10-site-store-discounts-SC-07 - A product coupon at the till settles by its own code
**Serves:** grade10-site-store-discounts-US-04 - Shop staff spends a member's product coupon at the till

- **GIVEN** a member's product coupon taken at the POS till
- **WHEN** the till sale is tendered
- **THEN** the sale settles by the coupon's own Shopify Discount code, the same as online

<!-- trace:scenario id=g10.store-discounts.SC-3cr rev=1 -->
#### Scenario: grade10-site-store-discounts-SC-14 - A re-planned sale never carries two codes for one coupon
**Serves:** grade10-site-store-discounts-US-04 - Shop staff spends a member's product coupon at the till

- **GIVEN** a till sale carrying a coupon's minted discount code
- **WHEN** staff re-plan the sale with the same coupon still on it
- **THEN** the sale carries exactly one code for that coupon

<!-- trace:scenario id=g10.store-discounts.SC-elk rev=2 -->
#### Scenario: grade10-site-store-discounts-SC-17 - A coupon cleared off a sale cannot go back on it
**Serves:** Two channels - a coupon cleared off a sale cannot go back on it

- **GIVEN** a till sale whose coupon's code was cleared by "Remove every
  discount", or by POS's own 管理折扣 → 全部移除
- **WHEN** staff apply that coupon, or another reward, to the same sale again
- **THEN** they are told a reward has come off this sale and to ring it up on
  a new one, and the coupon stands live in the member's wallet

<!-- trace:scenario id=g10.store-discounts.SC-99a rev=1 -->
#### Scenario: grade10-site-store-discounts-SC-22 - A sale a reward's code has left still takes points
**Serves:** grade10-site-store-discounts-US-04 - Shop staff spends a member's product coupon at the till

- **GIVEN** a till sale whose coupon was cleared by "Remove every discount"
- **WHEN** staff re-plan the sale with points and no reward
- **THEN** the plan goes through and the sale carries the points

<!-- trace:scenario id=g10.store-discounts.SC-0lx rev=1 -->
#### Scenario: grade10-site-store-discounts-SC-24 - A sale whose coupon was claimed elsewhere asks for a new sale
**Serves:** grade10-site-store-discounts-US-04 - Shop staff spends a member's product coupon at the till

- **GIVEN** a till sale carrying a member's coupon, whose member then claimed that coupon at another sale
- **WHEN** staff plan the first sale again
- **THEN** they are told the sale has closed and to ring the goods on a new one
- **AND** the coupon stays on the sale that claimed it

<!-- trace:scenario id=g10.store-discounts.SC-9j2 rev=1 -->
#### Scenario: grade10-site-store-discounts-SC-27 - A fresh scan on a sale that ran out its hour asks for a new sale
**Serves:** grade10-site-store-discounts-US-04 - Shop staff spends a member's product coupon at the till

- **GIVEN** a till sale carrying a member's coupon, left an hour since its last plan, its till session expired
- **WHEN** staff scan the member's card again on that cart and plan it
- **THEN** they are told the sale has closed and to ring the goods on a new one
- **AND** no code is minted onto that cart

<!-- trace:scenario id=g10.store-discounts.SC-6co rev=1 -->
#### Scenario: grade10-site-store-discounts-SC-29 - A paid sale asks for a new sale
**Serves:** grade10-site-store-discounts-US-04 - Shop staff spends a member's product coupon at the till

- **GIVEN** a till sale that was tendered and whose paid order has reached the store, its till session still open
- **WHEN** staff plan that session again
- **THEN** they are told the sale has closed and to ring the goods on a new one
- **AND** the paid sale's order is not rewritten

<!-- trace:scenario id=g10.store-discounts.SC-ou8 rev=1 -->
#### Scenario: grade10-site-store-discounts-SC-18 - A code the sale never honoured stops standing
**Serves:** Two channels - a code the sale never honoured stops standing

- **GIVEN** a paid sale carrying a minted code the landed order does not name
- **WHEN** the sale settles
- **THEN** that code stops standing and is taken off the shop, and nothing
  reports it to the member as money they saved
