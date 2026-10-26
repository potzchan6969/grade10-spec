# Loyalty — delta

## Feature set

- Member surface
  - Coupon tickets: the wallet draws each issued coupon as a promo ticket —
    its purpose, its expiry where it is open or expired, the line a closed
    coupon says, and the stub's code or amount — and a scoped coupon names
    its scope and never draws a scan
  - Scan surface: an open coupon's Use now opens the staff-facing QR on a
    bottom sheet under 640px and a dialog from it up, the coupon's ticket
    above an unfolded scan card
  - Wallet halves: the consumer parts the wallet into what can still be
    spent — nearest expiry first — and what is spent, void or expired —
    newest first; refresh on the member's return is the settled way a
    spent coupon moves halves
  - Upsell: a consumer-owned promo can sit under a resolved wallet — the
    Rewards nudge on the Coupons surface — never drawn over loading, empty
    or error

## ADDED Requirements

### Requirement: The coupon wallet draws a ticket per coupon and a scan surface on demand

`CouponList` SHALL render each issued coupon as a promo ticket — what the
coupon is for, its expiry where it is open or expired, the one line a
closed coupon says, and a stub reading the code where the consumer passes
one, else the amount. A spent or void coupon SHALL mute and name its
state; an expired coupon SHALL read its expiry, which already says so.
None of them SHALL draw a scan or an action.

An open coupon the consumer flags `expiringSoon` — at Grade10, inside its
last 14 days — SHALL read its expiry line emphasised; the list SHALL NOT
count days itself, and SHALL NOT read the flag on a closed coupon.

A coupon whose scope the till cannot match SHALL carry a `scopeLabel`
naming where it is spendable and SHALL draw no Use now and no scan,
whatever `qrCode` it is passed, so a member never holds out a code the
sale refuses.

Where an open coupon carries `qrCode`, the ticket SHALL offer a Use now
control whose press opens a surface — a bottom sheet under 640px, a dialog
from it up — drawing the coupon's own ticket above an unfolded scan card.
The surface SHALL name the coupon for assistive tech alone and SHALL
offer no Use now of its own. `CouponList` SHALL report the surface's open
and close with the coupon through `onScanOpenChange`, so a consumer may
refresh the wallet on return.

While the wallet resolves it SHALL draw skeletons in a ticket's shape;
its empty rung SHALL name the wallet, explain it where the consumer
describes one, and offer the consumer's action where one is given. Where
the consumer supplies a `promo`, the list SHALL draw it under a resolved
list and nowhere else — loading, empty and error keep their own surfaces.

#### Scenario: grade10-site-loyalty-programme-SC-275 - The wallet's upsell shows only under a resolved list

**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a `CouponList` whose consumer supplies a promo
- **WHEN** the list is loading, empty, or in error
- **THEN** no promo is drawn

#### Scenario: grade10-site-loyalty-programme-SC-272 - Presenting a coupon opens its scan card unfolded

**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** an open coupon whose consumer supplies a scan code
- **WHEN** the member presses Use now
- **THEN** a surface opens — a bottom sheet under 640px, a dialog from it
  up — drawing the coupon's ticket above an unfolded QR card, with no Use
  now offered inside it

#### Scenario: grade10-site-loyalty-programme-SC-273 - A coupon the till cannot take offers nothing to scan

**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** an open coupon carrying a scope the till cannot match, with a
  scan code supplied
- **WHEN** `CouponList` renders it
- **THEN** it names the scope, and draws neither a Use now control nor a
  scan surface

#### Scenario: grade10-site-loyalty-programme-SC-274 - A closed coupon names its state and offers nothing

**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a spent, void and expired coupon
- **WHEN** `CouponList` renders them
- **THEN** each mutes and names its state — the spent and void coupons
  their one line, the expired one its expiry — and none draws a scan
  control or an action

#### Scenario: grade10-site-loyalty-programme-SC-275 - A coupon running out reads its expiry emphasised

**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** an open coupon the consumer flags expiring soon
- **WHEN** `CouponList` renders it
- **THEN** its expiry line is rendered emphasised, where a coupon the
  consumer does not flag renders it plainly
