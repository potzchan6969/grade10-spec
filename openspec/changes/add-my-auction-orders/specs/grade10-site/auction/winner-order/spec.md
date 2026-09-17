## Feature set

- **Order page**
  - Sections: Order Information, Collection Method, Order Status timeline, Lots.
  - By status: address form, invoice with Pay Now, or read-only detail.
- **Delivery address**
  - Address form: required and optional fields, errors on empty required fields.
- **Card payment**
  - Unfinished session: says so and leaves the invoice payable.
  - Confirming: a completed session reads Confirming payment until paid.

## ADDED Requirements

### Requirement: The auction order page shows its sections by status

The auction order page SHALL show these sections, in this order.

| Section | Carries |
| --- | --- |
| Order Information | Order No., Auction, Currency, Date (the lot's close), Order Status, Invoice Status |
| Collection Method | Delivery Method (always Delivery), Name, Contact Tel, Email (the account's), Address |
| Order Status | Each order status the order has reached, in the order reached, each with the date and time it was reached |
| Lots | Key image, title and winning bid of the order's lot |

Invoice Status SHALL read one of these labels. The label **Paid Status** SHALL
NOT appear.

| Invoice status | Label |
| --- | --- |
| `not_issued` | Not issued |
| `pending` | Pending |
| `paid` | Paid |
| `expired` | Expired |
| `cancelled` | Cancelled |
| `refunded` | Refunded |

What the page offers SHALL follow the order status.

| Order status | The page offers |
| --- | --- |
| Awaiting Setup | The address form in Collection Method, per "The address form refuses empty required fields" |
| Preparing Invoice | The confirmed address, per "The delivery address is confirmed before payment"; no invoice and no way to pay |
| Pending Payment | The full invoice with every line, per "Invoice fields", and **Pay Now**; the confirmed address |
| Processing, Shipped, Delivered, Cancelled, Refunded | Read-only detail, with the records per "Records the winner keeps" |

An invoice whose status is `expired` SHALL still be presented under the
derived Pending Payment order status, per `revise-auction-winner-invoicing`,
with its full invoice and **Pay Now**. The page SHALL not derive a second
Expired order status.

#### Scenario: winner-order-SC-72 - The page shows its four sections
**Serves:** winner-order-US-07 - Winner confirms where a won lot ships

- **GIVEN** an auction order in any status
- **WHEN** the winner opens it
- **THEN** the page shows Order Information, Collection Method, Order Status
  and Lots, in that order

#### Scenario: winner-order-SC-73 - Invoice Status replaces Paid Status
**Serves:** winner-order-US-04 - Winner pays an invoice by card

- **GIVEN** an auction order whose invoice status is `paid`
- **WHEN** the winner reads Order Information
- **THEN** it shows Invoice Status as Paid
- **AND** no Paid Status label appears

#### Scenario: winner-order-SC-74 - Each status step carries its time
**Serves:** winner-order-US-07 - Winner confirms where a won lot ships

- **GIVEN** an auction order that reached Awaiting Setup, Preparing Invoice,
  Pending Payment and Processing
- **WHEN** the winner reads Order Status
- **THEN** it lists those four statuses in the order reached
- **AND** each carries the date and time it was reached

The Order Status timeline SHALL be supplied by the authenticated auction-order
read model. Each item SHALL contain the derived order status and the
authoritative time that status was reached; the page SHALL NOT reconstruct
timestamps in the browser from the current invoice, fulfilment or payment
session state.

#### Scenario: winner-order-SC-53 - The timeline uses authoritative status times
**Serves:** winner-order-US-07 - Winner confirms where a won lot ships

- **GIVEN** the auction-order read model returns the order statuses reached
  and a recorded timestamp for each
- **WHEN** the winner reads Order Status
- **THEN** the page shows each returned timestamp for its matching status
- **AND** it does not replace a returned timestamp with the page-load time

#### Scenario: winner-order-SC-44 - An unpaid order shows the invoice and Pay Now
**Serves:** winner-order-US-04 - Winner pays an invoice by card

- **GIVEN** an auction order whose status is Pending Payment
- **WHEN** the winner opens it
- **THEN** the page shows every invoice line and Pay Now
- **AND** the confirmed delivery address and the lot

#### Scenario: winner-order-SC-45 - An order preparing its invoice offers no payment
**Serves:** winner-order-US-07 - Winner confirms where a won lot ships

- **GIVEN** an auction order whose status is Preparing Invoice
- **WHEN** the winner opens it
- **THEN** the page shows the confirmed address
- **AND** offers no invoice and no Pay Now

### Requirement: The address form refuses empty required fields

In Awaiting Setup the winner SHALL confirm a delivery address with these
fields.

| Field | Required |
| --- | --- |
| First Name | Yes |
| Last Name | Yes |
| Phone (country code and number) | Yes |
| Company Name | No |
| Country/Region | Yes |
| Town/City | Yes |
| Address Line 1 | Yes |
| Address Line 2 | No |
| Apt./Suite/Building | No |
| State/Province/Region | Yes |
| Postal Code | Yes |

Confirming with any required field empty SHALL be refused, SHALL show an error
on each empty required field, and SHALL keep the order in Awaiting Setup.
Grade10 SHALL NOT check the phone number's format. The form SHALL NOT offer a
billing address. Cancel SHALL leave the order in Awaiting Setup with no
address confirmed.

#### Scenario: winner-order-SC-46 - An empty required field is refused
**Serves:** winner-order-US-07 - Winner confirms where a won lot ships

- **GIVEN** a winner on the address form with Town/City and Postal Code empty
- **WHEN** they confirm the address
- **THEN** Grade10 refuses it
- **AND** an error shows on Town/City and on Postal Code
- **AND** the order's status is still Awaiting Setup

#### Scenario: winner-order-SC-47 - Optional fields may stay empty
**Serves:** winner-order-US-07 - Winner confirms where a won lot ships

- **GIVEN** a winner who fills every required field and leaves Company Name,
  Address Line 2 and Apt./Suite/Building empty
- **WHEN** they confirm the address
- **THEN** Grade10 accepts it
- **AND** the order's status is Preparing Invoice

#### Scenario: winner-order-SC-48 - Any phone number is accepted
**Serves:** winner-order-US-07 - Winner confirms where a won lot ships

- **GIVEN** a winner who enters a phone number of any length or format
- **WHEN** they confirm an otherwise complete address
- **THEN** Grade10 accepts the phone number

### Requirement: An unfinished card payment leaves the invoice payable

Pay Now SHALL start a hosted card payment session for the current invoice. Its
outcome SHALL read as follows.

| Session outcome | The winner sees | Order |
| --- | --- | --- |
| Completed | **Confirming payment** until Grade10 records the invoice `paid` | Processing once paid |
| Timed out | Payment was not completed; Pay Now is available again | Stays Pending Payment |
| Abandoned or cancelled by the winner | Payment was not completed; Pay Now is available again | Stays Pending Payment |
| Declined | The refusal, per "The bid-time hold is released, never captured" | Stays Pending Payment |

Pay Now after an unfinished session SHALL start a fresh session. An unfinished
session SHALL NOT change the invoice, its amount or its deadline. Grade10 SHALL
NOT show the order as paid before it records the invoice `paid`.

#### Scenario: winner-order-SC-49 - A timed-out payment session stays payable
**Serves:** winner-order-US-04 - Winner pays an invoice by card

- **GIVEN** a winner whose payment session for a Pending Payment order timed out
- **WHEN** they return to the order
- **THEN** the page says payment was not completed
- **AND** the order is still Pending Payment with Pay Now available

#### Scenario: winner-order-SC-50 - Pay Now after an unfinished session starts fresh
**Serves:** winner-order-US-04 - Winner pays an invoice by card

- **GIVEN** a Pending Payment order whose last payment session was abandoned
- **WHEN** the winner selects Pay Now
- **THEN** a new payment session starts for the same invoice amount

#### Scenario: winner-order-SC-51 - A completed session confirms before reading Processing
**Serves:** winner-order-US-04 - Winner pays an invoice by card

- **GIVEN** a winner whose hosted card session completed but whose
  authenticated auction-order read model has not yet recorded invoice status
  `paid`
- **WHEN** they return to the order
- **THEN** the page shows Confirming payment
- **AND** the order does not yet read Processing

#### Scenario: winner-order-SC-52 - A recorded payment reads Processing
**Serves:** winner-order-US-04 - Winner pays an invoice by card

- **GIVEN** an order whose authenticated auction-order read model returns
  invoice status `paid` and fulfilment status `unfulfilled`
- **WHEN** the winner opens it
- **THEN** its status is Processing
