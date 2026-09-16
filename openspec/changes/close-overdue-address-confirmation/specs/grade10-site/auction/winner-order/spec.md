## Purpose
What a winner is handed when a lot closes and what they do with it: two
windows that end — 48 hours to confirm where the lot ships, then 7 days from
send to pay the invoice an operator quotes for that address — a single fresh
card charge, and the receipt, tracker and delivery proof the order keeps
afterwards. A window that has closed is reopened by Grade10, never by the
winner.

## Feature set

- Order at lot close
  - Address first: a closed lot opens an order that waits for the winner's delivery address, with no invoice and nothing yet to pay
  - One order per lot: a winner of three lots confirms three addresses and receives three invoices
- Invoice
  - Operator quote: Shipping & Handling, and Insurance when added, are quoted by an operator for the confirmed address, never estimated
  - Order total: names every component a winner is asked to pay, so a total is explicable line by line
  - Invoice PDF: once sent, the winner can view and download the invoice; hidden before send and when Cancelled
- Delivery address
  - Selection and confirmation: a winner chooses a saved address or adds one, then affirms it, which is what lets an invoice be prepared
  - Address window: 48 hours from lot close to confirm one, shown as the datetime the entrance closes
  - One entrance, not two: a closed window refuses a first confirmation and a change to a confirmed address alike
  - Reopening: only an operator reopens the entrance, and a reopen starts a fresh 48 hours
  - Locking at send: the address stops moving once the invoice is sent; a change after that goes through Grade10
- Settlement
  - Card only for the winner while `pending`: the order offers one payment method; every other method is an operator's backup
  - Expired ends self-service Pay: when the invoice is `expired`, card Pay is hidden and Contact Us appears in the overdue alert
  - Hold release: the bid-time authorization verified a bidder and is not the instrument that settles
- Payment deadline
  - Seven days from send: the window opens when the winner has an amount to pay, not before
  - Absolute datetime display: the deadline is shown as a datetime in the winner's zone; no countdown
- Progress presentation
  - Five steps: Address → Invoice → Payment → Shipped → Completed; Cancelled and Refunded show no stepper
- Records the winner keeps
  - Payment receipt: what was paid, itemised, with the method that paid it
  - Shipping tracker and delivery proof: unchanged

## ADDED Requirements

### Requirement: The address entrance closes 48 hours after lot close

Every auction order SHALL carry one address window. It SHALL close 48 hours
after the lot's actual close, counting every extended-bidding extension, and
SHALL NOT be measured from the lot's scheduled close. Grade10 SHALL store the
closing time in UTC and SHALL show it to the winner as an absolute datetime in
their own timezone, per `shared/dates-and-times`. Grade10 SHALL NOT show the
winner a countdown.

The 48 hours SHALL be one Grade10-owned figure, the same for every lot and
every currency. A new figure SHALL apply to lots closing after it is set and
SHALL NOT move the closing time of an order that already has one.

A write SHALL be judged by the moment Grade10 receives it. A delivery address
Grade10 receives at or after the closing time SHALL be refused, however long
the winner spent composing it.

While the window is open, the winner SHALL be able to confirm a delivery
address and to change a confirmed one, per "The delivery address is confirmed
before payment".

Once the window has closed, Grade10 SHALL refuse both writes alike:

| Winner's write | Behaviour once the window has closed |
| --- | --- |
| Confirm a delivery address for the first time | Refused |
| Change an already-confirmed delivery address | Refused |
| Add, edit or archive an address in the account address book | Unaffected |

The account address book is account-wide and shared across storefronts, per
"The account owns a reusable shipping address book". A closed window SHALL
refuse only the write that puts an address on this order.

In place of the address form, Winner Order SHALL show that the entrance has
closed, the datetime it closed, and how to reach Grade10. Grade10 SHALL offer
the winner no way to reopen it. Only an operator SHALL reopen it, per
`grade10-admin/auction/post-sale`; a reopen SHALL set the closing time to 48
hours from the moment of the reopen, and the winner SHALL then write as they
did before. An operator SHALL also be able to record a delivery address on the
order themselves while the window is closed, without reopening it.

A closed address window SHALL change nothing else. It SHALL NOT change the
derived order status, which stays Awaiting Address or Preparing Invoice per
`grade10-site/auction/order-status`. It SHALL NOT restrict the winner from
bidding, per `grade10-site/auction/bidder-suspension`. It SHALL NOT cancel the
order or return the lot to available stock.

Sending the invoice SHALL retire the window. The delivery address locks at
send, per "The delivery address locks when the invoice is sent", so Grade10
SHALL neither show a closing datetime nor refuse on the window afterwards.

#### Scenario: winner-order-SC-70 - The window closes 48 hours after the extended close
**Serves:** winner-order-US-07 - Winner misses the address window

- **GIVEN** a lot whose scheduled close was 2026-09-12T08:45:00Z and whose
  actual close, after extended bidding, was 2026-09-12T09:00:00Z
- **WHEN** the winner opens the order
- **THEN** the order shows the address entrance closing at 2026-09-14T09:00:00Z
- **AND** shows it as an absolute datetime in the winner's own timezone
- **AND** shows no countdown

#### Scenario: winner-order-SC-71 - A confirmation inside the window is accepted
**Serves:** winner-order-US-07 - Winner misses the address window

- **GIVEN** an auction order whose address entrance closes at 2026-09-14T09:00:00Z
- **WHEN** Grade10 receives the winner's delivery address at 2026-09-14T08:59:00Z
- **THEN** Grade10 accepts the confirmation
- **AND** the order's derived status is Preparing Invoice

#### Scenario: winner-order-SC-72 - A first confirmation after the window is refused
**Serves:** winner-order-US-07 - Winner misses the address window

- **GIVEN** an auction order in Awaiting Address whose address entrance closed
  at 2026-09-14T09:00:00Z
- **WHEN** Grade10 receives the winner's delivery address at 2026-09-14T09:01:00Z
- **THEN** Grade10 refuses the confirmation
- **AND** the order has no confirmed delivery address
- **AND** its derived status is still Awaiting Address

#### Scenario: winner-order-SC-73 - A change after the window is refused too
**Serves:** winner-order-US-07 - Winner misses the address window

- **GIVEN** an auction order in Preparing Invoice whose winner confirmed an
  address at 2026-09-13T10:00:00Z and whose address entrance closed at
  2026-09-14T09:00:00Z
- **AND** no invoice has been sent
- **WHEN** the winner attempts to change the confirmed delivery address at
  2026-09-14T09:01:00Z
- **THEN** Grade10 refuses the change
- **AND** the order's delivery address is the one confirmed at
  2026-09-13T10:00:00Z

#### Scenario: winner-order-SC-74 - Contact Us takes the address form's place
**Serves:** winner-order-US-07 - Winner misses the address window

- **GIVEN** an auction order whose address entrance has closed
- **WHEN** the winner opens Winner Order
- **THEN** Grade10 offers no address form
- **AND** the order says the entrance has closed, names the datetime it closed,
  and carries Contact Us

#### Scenario: winner-order-SC-75 - A reopen starts a fresh 48 hours
**Serves:** winner-order-US-07 - Winner misses the address window

- **GIVEN** an auction order whose address entrance closed at 2026-09-14T09:00:00Z
- **WHEN** an operator reopens the entrance at 2026-09-16T14:00:00Z
- **THEN** the order shows the entrance closing at 2026-09-18T14:00:00Z
- **AND** the winner can confirm a delivery address again
- **AND** Grade10 offers the winner no way to reopen it themselves

#### Scenario: winner-order-SC-76 - A closed window suspends nobody and cancels nothing
**Serves:** winner-order-US-07 - Winner misses the address window

- **GIVEN** an auction order whose address entrance closed 30 days ago with no
  address confirmed
- **WHEN** the winner opens the order
- **THEN** its derived status is still Awaiting Address
- **AND** the winner's account is not suspended from bidding
- **AND** the lot has not returned to available stock

#### Scenario: winner-order-SC-77 - Sending the invoice retires the window
**Serves:** Delivery address - sending the invoice retires the window

- **GIVEN** an auction order whose winner confirmed an address and whose
  invoice an operator sent at 2026-09-13T09:00:00Z
- **WHEN** 2026-09-14T09:00:00Z passes
- **THEN** the order shows no address-entrance closing datetime and no closed
  entrance
- **AND** it shows the locked address and how to reach Grade10 to request a
  change

#### Scenario: winner-order-SC-78 - A closed entrance leaves the address book alone
**Serves:** Delivery address - a closed entrance leaves the address book alone

- **GIVEN** an auction order whose address entrance has closed
- **WHEN** the winner edits a saved address in their account address book and
  saves a new one
- **THEN** Grade10 accepts both writes
- **AND** neither reaches that auction order
- **AND** the order still has no confirmed delivery address
