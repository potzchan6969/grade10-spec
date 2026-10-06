## Feature set

- Spending
  - Member's name: the name chosen for the shop, else the account name, else the address before the `@`, sent whole; 會員 when the account service cannot give one

## MODIFIED Requirements

### Requirement: A till session spends for the member and notifies them once it lands

Inside a till session, staff SHALL see the member's name, tier,
redeemable balance, qualifying-window progress, tier renewal and
balance-lapse dates, recent activity, and open coupons — the store's own
and the member's reward coupons alike — and SHALL be able to redeem points
against the current sale and apply a coupon from that list. Undoing a
spend before tender SHALL simply drop the discounts from the sale, since
nothing is debited until the order pays; reversing a completed spend SHALL
stay an operator's action from the console, never the till. Spending SHALL
present a read-back facing the member — points spent, money still due,
balance after, points this sale will earn, computed by the platform —
before it commits.

The member's name SHALL be the one their profile, their pass and the
membership surface show, resolved in this order: the name the member chose
for the shop, else their account name, else the part of their email address
before the `@`. A member with a name chosen for the shop SHALL be named without
the account service. When the account service cannot be reached or gives no
name for a member with none, staff SHALL see 會員 in its place. The
customer-details badge SHALL show the member by the same name. The store SHALL
send the till session and the badge the name whole, uncut; the till lays it
out.

Submitting the same spend twice SHALL cost once and answer the same both
times. Every staff-assisted spend SHALL notify the member once the sale
reaches settlement — the paid order, or the till's trim-to-what-landed
pass — never while it is still Apply's re-plannable claim, since a claim
can still be trimmed or the whole sale walked away from before anything is
held. A spend the trim-to-landed pass reported that the sale then abandons
unpaid SHALL send a correction notice, since the member was already told it
landed; a sale that never reaches that pass SHALL send nothing. The
notification SHALL never carry the code.

<!-- trace:scenario id=g10.store-membership.SC-uae rev=1 -->
#### Scenario: grade10-site-store-membership-SC-77 - A double tap spends once
**Serves:** grade10-site-store-membership-US-02 - Member identifies and spends at the till

- **WHEN** staff submit the same spend twice in quick succession
- **THEN** exactly one redemption is recorded
- **AND** both submissions answer the same

<!-- trace:scenario id=g10.store-membership.SC-soj rev=1 -->
#### Scenario: grade10-site-store-membership-SC-75 - The member's phone is the monitor
**Serves:** grade10-site-store-membership-US-04 - Member is told once a staff-assisted spend or coupon lands at the till

- **WHEN** points are spent or a coupon is applied through a till session
  and the sale reaches settlement (paid, or the till's trim-to-landed pass)
- **THEN** the member is notified with points, amount, and location
- **AND** the notification never contains the code

<!-- trace:scenario id=g10.store-membership.SC-aar rev=1 -->
#### Scenario: grade10-site-store-membership-SC-76 - A landed notice is corrected if the sale never pays
**Serves:** grade10-site-store-membership-US-04 - Member is told once a staff-assisted spend or coupon lands at the till

- **GIVEN** the till's trim-to-landed pass already notified the member a
  spend landed
- **WHEN** the sale is later abandoned rather than paid
- **THEN** the member receives a correction notice

<!-- trace:scenario id=g10.store-membership.SC-a70 rev=1 -->
#### Scenario: grade10-site-store-membership-SC-78 - An unreachable account service shows the member as 會員
**Serves:** grade10-site-store-membership-US-02 - Member identifies and spends at the till

- **GIVEN** a member with no name chosen for the shop
- **WHEN** staff open a till session for them while the account service cannot be reached
- **THEN** staff see 會員 in place of the member's name

<!-- trace:scenario id=g10.store-membership.SC-jjw rev=1 -->
#### Scenario: grade10-site-store-membership-SC-83 - A name chosen for the shop needs no account service
**Serves:** grade10-site-store-membership-US-02 - Member identifies and spends at the till

- **GIVEN** a member who has saved a name on their profile
- **WHEN** staff open a till session for them while the account service cannot be reached
- **THEN** staff see the name the member saved

<!-- trace:scenario id=g10.store-membership.SC-y0k rev=1 -->
#### Scenario: grade10-site-store-membership-SC-84 - The badge names the member as the till does
**Serves:** grade10-site-store-membership-US-02 - Member identifies and spends at the till

- **GIVEN** a paired customer staff found in Shopify's own search
- **WHEN** staff open the customer's details
- **THEN** the badge shows the member by the name a till session shows for them,
  and 會員 where the till would

<!-- trace:scenario id=g10.store-membership.SC-ymg rev=1 -->
#### Scenario: grade10-site-store-membership-SC-85 - A long name reaches the till whole
**Serves:** grade10-site-store-membership-US-02 - Member identifies and spends at the till

- **GIVEN** a member whose name chosen for the shop is 80 characters long
- **WHEN** staff open a till session for them, and when staff open their
  customer's details
- **THEN** the store sends the till session and the badge all 80 characters
  of the name
