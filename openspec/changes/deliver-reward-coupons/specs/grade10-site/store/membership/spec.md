## Feature set

- Till spending
  - One path, no queue: staff apply points or a coupon with no separate
    collection step
  - Notified at once: the member hears about any staff-assisted spend
    immediately

## ADDED Requirements

### Requirement: A till session spends for the member and notifies them at once

Inside a till session, staff SHALL see the member's display name, tier,
redeemable balance, qualifying-window progress, tier renewal and
balance-lapse dates, recent activity, and open coupons — and SHALL be able
to redeem points against the current sale and apply a coupon. Undoing a
spend before tender SHALL simply drop the discounts from the sale, since
nothing is debited until the order pays; reversing a completed spend SHALL
stay an operator's action from the console, never the till. Spending SHALL
present a read-back facing the member — points spent, money still due,
balance after, points this sale will earn, computed by the platform —
before it commits.

Submitting the same spend twice SHALL cost once and answer the same both
times. Every staff-assisted spend SHALL notify the member immediately with
the points, amount, and location, and the notification SHALL never carry
the code.

#### Scenario: grade10-site-store-membership-SC-74 - A double tap spends once

- **WHEN** staff submit the same spend twice in quick succession
- **THEN** exactly one redemption is recorded
- **AND** both submissions answer the same

#### Scenario: grade10-site-store-membership-SC-75 - The member's phone is the monitor

- **WHEN** points are spent or a coupon is applied through a till session
- **THEN** the member is notified immediately with points, amount, and
  location
- **AND** the notification never contains the code

## REMOVED Requirements

### Requirement: A till session reads the member and spends on their behalf

**Reason**: Collection retires with the coupon path, so a till session no
longer confirms one, and the notice that told a member about a collection
broadens to cover any staff-assisted spend.

**Migration**: Replaced by "A till session spends for the member and
notifies them at once" above. Scenario SC-12 continues as SC-74; SC-13
continues under its own id, restored to naming any staff-assisted spend
rather than a collection alone.
