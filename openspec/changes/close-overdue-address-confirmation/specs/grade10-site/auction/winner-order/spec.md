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
  - Address confirm window: 48 hours from lot close; when it passes, Confirm is hidden and Contact Us appears — status stays Awaiting Address
  - One order per lot: a winner of three lots confirms three addresses and receives three invoices
- Invoice
  - Operator quote: Shipping & Handling, and Insurance when added, are quoted by an operator for the confirmed address, never estimated
  - Order total: names every component a winner is asked to pay, so a total is explicable line by line
  - Fee tooltips: Buyer’s Premium, Shipping & Handling, and Payment Processing Fee carry brief info tooltips on the order summary
  - Invoice PDF: once sent, the winner can view and download the invoice; hidden before send and when Cancelled
- Delivery address
  - Selection and confirmation: a winner chooses a saved address or adds one, then affirms it, which is what lets an invoice be prepared
  - Missed deadline closes the form: after the address deadline the winner can neither confirm an address nor change a confirmed one
  - Reopening: only an operator reopens the address form, which gives a fresh 48 hours, or records an address the winner gives by phone
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
  - Day-only step dates: Address while awaiting reads Confirm by …; Payment while due reads Pay by …; long copy wraps
- Records the winner keeps
  - Payment receipt: what was paid, itemised, with the method that paid it
  - Receipt PDF: after payment, view and download beside the invoice PDF
  - Shipping tracker and delivery proof: unchanged

## ADDED Requirements

### Requirement: A missed address deadline closes the whole address form

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
| Confirm a delivery address for the first time | Refused |
| Change an already-confirmed delivery address | Refused, and the change control is hidden as Confirm is |
| Add, edit or archive an address in the account address book | Unaffected |

The account address book is account-wide and shared across storefronts, per
"The account owns a reusable shipping address book". Only the write that puts
an address on this order SHALL be refused.

Grade10 SHALL offer the winner no way to reopen the address form. Only an
operator SHALL reopen it, per `grade10-admin/auction/post-sale`; a reopen SHALL
set the address deadline to 48 hours from the moment of the reopen, and the
winner SHALL then confirm or change the address as before. Grade10 SHALL send
the winner no letter when the form is reopened; the operator tells them
directly. An operator SHALL
also be able to record a delivery address on the order themselves after the
deadline, without reopening the form.

Sending the invoice SHALL retire the address deadline. The delivery address
locks at send, per "The delivery address locks when the invoice is sent", so
Grade10 SHALL neither show the address deadline nor refuse on it afterwards.

#### Scenario: winner-order-SC-79 - The address deadline counts from the extended close
**Serves:** winner-order-US-08 - Winner gets the address form back

- **GIVEN** a lot whose scheduled close was 2026-09-12T08:45:00Z and whose
  actual close, after extended bidding, was 2026-09-12T09:00:00Z
- **WHEN** the winner opens the order
- **THEN** the address deadline shown is 2026-09-14T09:00:00Z

#### Scenario: winner-order-SC-80 - An address received just inside the deadline is accepted
**Serves:** winner-order-US-08 - Winner gets the address form back

- **GIVEN** an auction order whose address deadline is 2026-09-14T09:00:00Z
- **WHEN** Grade10 receives the winner's delivery address at 2026-09-14T08:59:00Z
- **THEN** Grade10 accepts the confirmation
- **AND** the order's derived status is Preparing Invoice

#### Scenario: winner-order-SC-72 - An address received after the deadline is refused
**Serves:** winner-order-US-08 - Winner gets the address form back

- **GIVEN** an auction order in Awaiting Address whose address deadline was
  2026-09-14T09:00:00Z
- **WHEN** Grade10 receives the winner's delivery address at 2026-09-14T09:01:00Z
- **THEN** Grade10 refuses the confirmation
- **AND** the order has no confirmed delivery address
- **AND** its derived status is still Awaiting Address

#### Scenario: winner-order-SC-73 - A confirmed address cannot be changed after the deadline
**Serves:** winner-order-US-08 - Winner gets the address form back

- **GIVEN** an auction order in Preparing Invoice whose winner confirmed an
  address at 2026-09-13T10:00:00Z and whose address deadline was
  2026-09-14T09:00:00Z
- **AND** no invoice has been sent
- **WHEN** the winner attempts to change the confirmed delivery address at
  2026-09-14T09:01:00Z
- **THEN** Grade10 refuses the change
- **AND** the order's delivery address is the one confirmed at
  2026-09-13T10:00:00Z
- **AND** the order carries Contact Us and no change control

#### Scenario: winner-order-SC-75 - A reopen gives the winner a fresh 48 hours
**Serves:** winner-order-US-08 - Winner gets the address form back

- **GIVEN** an auction order whose address deadline was 2026-09-14T09:00:00Z
- **WHEN** an operator reopens the address form at 2026-09-16T14:00:00Z
- **THEN** the order shows Confirm delivery address with the deadline
  2026-09-18T14:00:00Z
- **AND** the winner can confirm a delivery address again
- **AND** Grade10 offers the winner no way to reopen it themselves

#### Scenario: winner-order-SC-81 - A reopen sends the winner no letter
**Serves:** winner-order-US-08 - Winner gets the address form back

- **GIVEN** an auction order whose address deadline has passed
- **WHEN** an operator reopens the address form
- **THEN** the order offers Confirm delivery address again
- **AND** Grade10 sends the winner no letter about the reopen

#### Scenario: winner-order-SC-77 - Sending the invoice retires the address deadline
**Serves:** Delivery address - sending the invoice retires the address deadline

- **GIVEN** an auction order whose winner confirmed an address and whose
  invoice an operator sent at 2026-09-13T09:00:00Z
- **WHEN** 2026-09-14T09:00:00Z passes
- **THEN** the order shows no address deadline and no missed-deadline alert
- **AND** it shows the locked address and how to reach Grade10 to request a
  change

#### Scenario: winner-order-SC-78 - A missed address deadline leaves the address book alone
**Serves:** Delivery address - a missed address deadline leaves the address book alone

- **GIVEN** an auction order whose address deadline has passed
- **WHEN** the winner edits a saved address in their account address book and
  saves a new one
- **THEN** Grade10 accepts both writes
- **AND** neither reaches that auction order
- **AND** the order still has no confirmed delivery address
