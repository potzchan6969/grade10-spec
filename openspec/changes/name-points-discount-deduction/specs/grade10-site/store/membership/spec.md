# grade10-site/store/membership Specification

## Feature set

- Spending
  - Points discount: titled "Deduction from Points"; a "Points" discount still counts as the member's points, online and at the till

## MODIFIED Requirements

### Requirement: Points come off as one order-level discount either channel accepts

Redeeming points for money off SHALL promise a single order-level discount
titled "Deduction from Points", for a fixed amount, on the member's own
draft order online or their cart at the till — never as a minted code.
Wherever a discount is read, the title "Deduction from Points" or "Points",
ignoring letter case and surrounding spaces, SHALL count as that discount,
since paid orders keep the title they were paid with; a discount under any
other title SHALL never count as points. At the till, a discount under
either title SHALL be the member's only on a sale carrying the store's order
id; on a sale without one it is somebody else's discount, and Apply SHALL
be refused until staff remove it, a coupon-only Apply included, since the
order id Apply writes would make it read as the member's. Applying points
again SHALL write
the title "Deduction from Points", whatever title the sale carried before.
The promise SHALL sit outside the order's own one-coupon limit, so a reward
coupon and a points discount can both apply to the same order. Nothing SHALL
be deducted or held when the promise is made; the balance SHALL be debited
once, when the order is paid, for what the provider actually applied — never
more than promised, and scaled down where the provider applied less or the
balance fell short meanwhile. An order abandoned, replaced, or undone before
payment SHALL debit nothing. A promise larger than the order can carry SHALL
be trimmed to what the order shows rather than refused.

<!-- trace:scenario id=g10.store-membership.SC-qr3 rev=1 -->
#### Scenario: grade10-site-store-membership-SC-16 - A promise larger than the cart is trimmed, not refused
**Serves:** grade10-site-store-membership-US-02 - Member identifies and spends at the till

- **WHEN** the promised points amount is more than the order carries
- **THEN** it is trimmed to what the order shows
- **AND** the purchase completes at the trimmed amount

<!-- trace:scenario id=g10.store-membership.SC-r53 rev=1 -->
#### Scenario: grade10-site-store-membership-SC-72 - A points discount and a reward coupon apply together
**Serves:** grade10-site-store-membership-US-02 - Member identifies and spends at the till

- **WHEN** an order carries both a reward coupon and a points discount
- **THEN** both apply
- **AND** neither is refused for the other's presence

<!-- trace:scenario id=g10.store-membership.SC-stn rev=1 -->
#### Scenario: grade10-site-store-membership-SC-73 - The balance moves once, when the order is paid
**Serves:** grade10-site-store-membership-US-02 - Member identifies and spends at the till

- **WHEN** a points promise's order is paid
- **THEN** the balance is debited once, for what the provider actually
  applied
- **AND** an abandoned or undone promise debits nothing

<!-- trace:scenario id=g10.store-membership.SC-gga rev=1 -->
#### Scenario: grade10-site-store-membership-SC-81 - A points promise reads "Deduction from Points"
**Serves:** grade10-site-store-membership-US-02 - Member identifies and spends at the till

- **WHEN** a member spends points online or at the till
- **THEN** the order's discount is titled "Deduction from Points"
- **AND** the title reads the same whatever language the site is read in
- **AND** the paid order carries that title

<!-- trace:scenario id=g10.store-membership.SC-ke5 rev=2 -->
#### Scenario: grade10-site-store-membership-SC-82 - The till holds and strips a "Points" discount as the member's points
**Serves:** grade10-site-store-membership-US-02 - Member identifies and spends at the till

- **GIVEN** a till sale carrying the store's order id and a fixed order
  discount titled "points"
- **WHEN** the till reads the sale
- **THEN** it counts that discount as the member's points still on the sale
- **AND** when staff take the benefits off, it removes that discount before
  the order id, as it removes "Deduction from Points"

<!-- trace:scenario id=g10.store-membership.SC-xhs rev=1 -->
#### Scenario: grade10-site-store-membership-SC-83 - A paid order settles its points under either title
**Serves:** grade10-site-store-membership-US-02 - Member identifies and spends at the till

- **GIVEN** a points promise whose paid order names its points discount
  "Points", or " deduction FROM points "
- **WHEN** the paid order lands
- **THEN** the balance is debited once, for what that discount took off

<!-- trace:scenario id=g10.store-membership.SC-if2 rev=1 -->
#### Scenario: grade10-site-store-membership-SC-84 - A discount under any other title is never read as points
**Serves:** grade10-site-store-membership-US-02 - Member identifies and spends at the till

- **GIVEN** a points promise whose paid order carries an order discount
  titled "Points off" or "Deduction", and none under either points title
- **WHEN** the paid order lands
- **THEN** no points are debited

<!-- trace:scenario id=g10.store-membership.SC-8a9 rev=1 -->
#### Scenario: grade10-site-store-membership-SC-85 - A points title keyed on a sale the till never marked refuses Apply
**Serves:** grade10-site-store-membership-US-02 - Member identifies and spends at the till

- **GIVEN** a till sale carrying no store order id and a fixed order
  discount staff keyed as "Deduction from Points" or "Points"
- **WHEN** staff apply points, or a coupon alone
- **THEN** Apply is refused, telling staff to remove the other discount
  first
- **AND** the keyed discount stays on the sale

<!-- trace:scenario id=g10.store-membership.SC-vo6 rev=1 -->
#### Scenario: grade10-site-store-membership-SC-86 - A resumed "Points" sale applied again takes the new title
**Serves:** grade10-site-store-membership-US-02 - Member identifies and spends at the till

- **GIVEN** a parked till sale carrying the store's order id and a points
  discount titled "Points"
- **WHEN** staff resume it and apply points again
- **THEN** the sale carries one points discount, titled "Deduction from
  Points"
- **AND** no discount titled "Points" stays on it
