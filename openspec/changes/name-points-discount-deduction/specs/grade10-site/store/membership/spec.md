## MODIFIED Requirements

### Requirement: Points come off as one order-level discount either channel accepts

Redeeming points for money off SHALL promise a single order-level discount
titled "Deduction from Points", for a fixed amount, on the member's own draft
order online or their cart at the till — never as a minted code. Wherever a
discount is read, the title "Deduction from Points" or "Points", ignoring
letter case and surrounding spaces, SHALL count as that discount, since paid
orders keep the title they were paid with. The promise SHALL sit
outside the order's own one-coupon limit, so a reward coupon and a points
discount can both apply to the same order. Nothing SHALL be deducted or
held when the promise is made; the balance SHALL be debited once, when the
order is paid, for what the provider actually applied — never more than
promised, and scaled down where the provider applied less or the balance
fell short meanwhile. An order abandoned, replaced, or undone before
payment SHALL debit nothing. A promise larger than the order can carry
SHALL be trimmed to what the order shows rather than refused.

#### Scenario: grade10-site-store-membership-SC-16 - A promise larger than the cart is trimmed, not refused
**Serves:** grade10-site-store-membership-US-02 - Member identifies and spends at the till

- **WHEN** the promised points amount is more than the order carries
- **THEN** it is trimmed to what the order shows
- **AND** the purchase completes at the trimmed amount

#### Scenario: grade10-site-store-membership-SC-72 - A points discount and a reward coupon apply together
**Serves:** grade10-site-store-membership-US-02 - Member identifies and spends at the till

- **WHEN** an order carries both a reward coupon and a points discount
- **THEN** both apply
- **AND** neither is refused for the other's presence

#### Scenario: grade10-site-store-membership-SC-73 - The balance moves once, when the order is paid
**Serves:** grade10-site-store-membership-US-02 - Member identifies and spends at the till

- **WHEN** a points promise's order is paid
- **THEN** the balance is debited once, for what the provider actually
  applied
- **AND** an abandoned or undone promise debits nothing

#### Scenario: grade10-site-store-membership-SC-81 - A points promise reads "Deduction from Points"
**Serves:** grade10-site-store-membership-US-02 - Member identifies and spends at the till

- **WHEN** a member spends points online or at the till
- **THEN** the order's discount is titled "Deduction from Points"
- **AND** the paid order carries that title

#### Scenario: grade10-site-store-membership-SC-82 - A discount titled "Points" still counts as the member's points
**Serves:** grade10-site-store-membership-US-02 - Member identifies and spends at the till

- **GIVEN** a till sale carrying the store's order id and the member's points
  as a discount titled "points"
- **WHEN** staff take the benefits off
- **THEN** the till removes that discount with the rest, as it removes
  "Deduction from Points"
- **AND** a paid order carrying a discount titled "Points" debits the balance
  for what that discount took off
