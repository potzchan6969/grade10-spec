# grade10-site/auction/winner-order Specification

## Feature set

- Delivery address
  - Missed deadline closes the form: after the address deadline, counted from the lot's actual close and judged by when Grade10 receives the write, the winner cannot put an address on the order; the account address book stays open
  - Reopened by an operator: the winner has no way to reopen the form; an operator reopens it or records the address, and the winner then confirms as before
  - Retired at send: sending the invoice retires the address deadline

## ADDED Requirements

### Requirement: A missed address deadline closes the address form

This requirement builds on "The address confirm window is 48 hours from lot
close", which sets the address deadline, hides Confirm once it passes, and
shows Contact Us. It adds what that closing means and how the form comes back.

The address deadline SHALL be measured from the lot's actual close, counting
every extended-bidding extension, and SHALL NOT be measured from its scheduled
close. The 48 hours SHALL be one Grade10-owned figure, the same for every lot.
A new figure SHALL apply to lots closing after it is set and SHALL NOT move the
deadline of an order that already has one.

A write SHALL be judged by the moment Grade10 receives it. A delivery address
Grade10 receives at or after the address deadline SHALL be refused, however
long the winner spent composing it.

Once the address deadline has passed and no invoice has been sent, Grade10
SHALL refuse the winner's address writes on the order:

| Winner's write | Behaviour after the address deadline |
| --- | --- |
| Confirm a delivery address | Refused |
| Add, edit or archive an address in the account address book | Unaffected |

The account address book is account-wide and shared across storefronts, per
"The account owns a reusable shipping address book". Only the write that puts
an address on this order SHALL be refused.

Grade10 SHALL offer the winner no way to reopen the address form. Only an
operator reopens it or records the address, per
"An operator reopens the address form" in `grade10-admin/auction/post-sale`;
after a reopen the winner SHALL confirm the address as before. A confirmed
address stays locked, per "The delivery address locks when the invoice is
sent". Grade10 SHALL send the winner no letter when the form is reopened; the
operator tells them directly.

Sending the invoice SHALL retire the address deadline. An invoice is sent only
on a confirmed address, which locks on confirm, per "The delivery address
locks when the invoice is sent", so Grade10 SHALL neither show the address
deadline nor refuse on it afterwards.

<!-- trace:scenario id=g10.auction-winner-order.SC-oos rev=1 -->
#### Scenario: winner-order-SC-144 - The address deadline counts from the extended close
**Serves:** winner-order-US-23 - Winner gets the address form back

- **GIVEN** a lot whose scheduled close was 2026-09-12T08:45:00Z and whose
  actual close, after extended bidding, was 2026-09-12T09:00:00Z
- **WHEN** the winner opens the order
- **THEN** the address deadline shown is 2026-09-14T09:00:00Z

<!-- trace:scenario id=g10.auction-winner-order.SC-r6m rev=1 -->
#### Scenario: winner-order-SC-145 - An address received just inside the deadline is accepted
**Serves:** winner-order-US-23 - Winner gets the address form back

- **GIVEN** an auction order whose address deadline is 2026-09-14T09:00:00Z
- **WHEN** Grade10 receives the winner's delivery address at 2026-09-14T08:59:00Z
- **THEN** Grade10 accepts the confirmation
- **AND** the order's derived status is Preparing Invoice

<!-- trace:scenario id=g10.auction-winner-order.SC-kz8 rev=1 -->
#### Scenario: winner-order-SC-146 - An address received after the deadline is refused
**Serves:** winner-order-US-23 - Winner gets the address form back

- **GIVEN** an auction order in Setup Overdue whose address deadline was
  2026-09-14T09:00:00Z
- **WHEN** Grade10 receives the winner's delivery address at 2026-09-14T09:01:00Z
- **THEN** Grade10 refuses the confirmation
- **AND** the order has no confirmed delivery address
- **AND** its derived status is still Setup Overdue

<!-- trace:scenario id=g10.auction-winner-order.SC-6ax rev=1 -->
#### Scenario: winner-order-SC-148 - A reopen gives the winner a fresh 48 hours
**Serves:** winner-order-US-23 - Winner gets the address form back

- **GIVEN** an unconfirmed auction order in Setup Overdue with invoice status
  `not_issued` whose address deadline was 2026-09-14T09:00:00Z
- **WHEN** an operator reopens the address form at 2026-09-16T14:00:00Z
- **THEN** the order shows Confirm delivery address with the deadline
  2026-09-18T14:00:00Z
- **AND** the winner can confirm a delivery address again
- **AND** Grade10 offers the winner no way to reopen it themselves

<!-- trace:scenario id=g10.auction-winner-order.SC-90v rev=1 -->
#### Scenario: winner-order-SC-149 - A reopen sends the winner no letter
**Serves:** winner-order-US-23 - Winner gets the address form back

- **GIVEN** an unconfirmed auction order in Setup Overdue with invoice status
  `not_issued` whose address deadline has passed
- **WHEN** an operator reopens the address form
- **THEN** the order offers Confirm delivery address again
- **AND** Grade10 sends the winner no letter about the reopen

<!-- trace:scenario id=g10.auction-winner-order.SC-js5 rev=1 -->
#### Scenario: winner-order-SC-150 - Sending the invoice retires the address deadline
**Serves:** Delivery address - retired at send

- **GIVEN** an auction order whose winner confirmed an address and whose
  invoice an operator sent at 2026-09-13T09:00:00Z
- **WHEN** 2026-09-14T09:00:00Z passes
- **THEN** the order shows no address deadline and no missed-deadline alert
- **AND** it shows the locked address and how to reach Grade10 to request a
  change

<!-- trace:scenario id=g10.auction-winner-order.SC-byg rev=1 -->
#### Scenario: winner-order-SC-151 - A missed address deadline leaves the address book alone
**Serves:** Delivery address - missed deadline closes the form

- **GIVEN** an auction order whose address deadline has passed
- **WHEN** the winner edits a saved address in their account address book and
  saves a new one
- **THEN** Grade10 accepts both writes
- **AND** neither reaches that auction order
- **AND** the order still has no confirmed delivery address

## MODIFIED Requirements

### Requirement: The payment deadline is fixed when the invoice is sent

The payment deadline SHALL be 7 calendar days from the moment an operator
sends the invoice. Grade10 SHALL fix it at send and store it in UTC. Winner
Order SHALL display it in the viewer's local zone. The invoice PDF SHALL
display it in `Asia/Hong_Kong`, labelled `GMT+8`, per `shared/dates-and-times`.

Nothing the winner does SHALL move the deadline — not a failed payment, and
not leaving the order untouched — except uploading payment proof, which stops
it, per "The winner uploads payment proof once". While the invoice is
`payment_verifying` the deadline SHALL NOT run. When an operator returns the
proof, the deadline SHALL be the moment of return plus the time left at
upload. Otherwise only an operator SHALL set a new deadline, by reissuing the
invoice, per `grade10-admin/auction/post-sale`.

An auction order with no sent invoice SHALL have no payment deadline, and its
invoice status SHALL never become `expired`. The winner-facing address confirm
window is separate and does not write `expired` on the invoice.

When the deadline passes with the invoice `pending`, Grade10 SHALL set the
invoice status to `expired`, per `grade10-site/auction/order-status`, unless a
card payment Grade10 received before the deadline is still awaiting its
outcome. While that outcome is awaited the invoice stays `pending`, the order
reads Pending Payment and Winner Order offers no Pay Now, per
`grade10-admin/auction/post-sale`. A card session that ends unpaid after the
deadline - declined, timed out or abandoned - SHALL count as a failed outcome:
Grade10 SHALL write `expired` when the session ends, and the invoice SHALL NOT
stay `pending` past it. That replaces the timed-out and abandoned outcomes of
"An unfinished card payment leaves the invoice payable", which hold only
before the deadline. Otherwise the order reads Payment Overdue. The winner
SHALL NOT be offered card payment or proof upload while the invoice is
`expired`, and Pay Now stays closed; the order SHALL show Contact Us in its
overdue alert. An operator SHALL restore self-service payment only by
reissuing the invoice to `pending`, or SHALL settle manually or cancel, per
`grade10-admin/auction/post-sale`.

<!-- trace:scenario id=g10.auction-winner-order.SC-9nm rev=1 -->
#### Scenario: winner-order-SC-31 - The deadline is seven days from send
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice an operator sent at
  2026-09-12T09:00:00Z
- **AND** the winner opens Winner Order in a browser set to `America/New_York`
- **WHEN** the winner reads the order and its invoice PDF
- **THEN** the payment deadline is 2026-09-19T09:00:00Z
- **AND** Winner Order shows it as an absolute datetime at 05:00 `EDT`
- **AND** the invoice PDF shows it at 17:00 `GMT+8`
- **AND** no countdown is shown

<!-- trace:scenario id=g10.auction-winner-order.SC-9ea rev=1 -->
#### Scenario: winner-order-SC-33 - A declined payment does not move the deadline
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose sent invoice has a payment deadline of
  2026-09-19T09:00:00Z
- **WHEN** the winner's card is declined twice
- **THEN** the payment deadline is still 2026-09-19T09:00:00Z

<!-- trace:scenario id=g10.auction-winner-order.SC-1d9 rev=1 -->
#### Scenario: winner-order-SC-37 - An expired invoice refuses card payment
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice status is `expired`
- **WHEN** the winner opens the order
- **THEN** Grade10 offers no card Pay control
- **AND** the overdue alert carries Contact Us
- **AND** a card payment attempt for that invoice is refused

<!-- trace:scenario id=g10.auction-winner-order.SC-6v5 rev=1 -->
#### Scenario: winner-order-SC-107 - A deadline that passes while proof is checked expires nothing
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an invoice that became `payment_verifying` at 2026-09-13T09:00:00Z with a deadline of 2026-09-19T09:00:00Z
- **WHEN** 2026-09-20T09:00:00Z arrives with no operator action
- **THEN** the invoice is still `payment_verifying`
- **AND** the order derives as Payment Verifying
