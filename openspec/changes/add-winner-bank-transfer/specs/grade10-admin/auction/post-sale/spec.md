## Feature set

- Queue
  - Payment Verifying: a row waiting on proof shows the outcome and needs action
  - Search: by listing code, invoice ID or bank reference, a replaced invoice's included
- Quote and send
  - Payment method on the quote: the winner's choice decides how the fee is priced
  - Bank transfer fee: entered on every bank transfer invoice, zero or more, with no cap
- Checking proof
  - Confirm: settles the invoice with the winner's files, and the operator's own if added
  - Return to pending: an external and an internal reason, the time left shown, and not offered once expired
- Resolving an unpaid order
  - One Reissue action: address, payment method, bank transfer fee, shipping, insurance and deadline, always with a reason and at least one change
  - Card invoice paid by transfer: reissued as bank transfer, then settled
  - Operator settlement: proof required, and straight to paid
- Audit trail
  - What a reissue changed: the log names each changed part
  - Internal audit number: on the order and in the log, for operators only

## REMOVED Requirements

### Requirement: An operator re-quotes a sent invoice

**Reason**: A change after send — address, payment method, bank transfer fee,
Shipping & Handling, Insurance or deadline — is now one Reissue action,
available on a `pending` or an `expired` invoice alike.

**Migration**: Replaced by "An operator reissues a sent invoice". Its three
scenarios retire; "A reissue keeps the deadline when the operator says so",
"A reissue restarts the deadline when the operator says so" and "A reissue
without a reason is refused" carry the same behaviour under the new
requirement.

## ADDED Requirements

### Requirement: An operator checks payment proof

An operator holding payment-processing SHALL check the proof on an order
whose invoice is `payment_verifying`:

1. Open the order and read the winner's uploaded files, the invoice ID and
   bank reference, the payment method, and the order total.
2. Choose Confirm or Return.
3. For Confirm, optionally attach 0 to 5 files of their own, each a PDF,
   JPEG or PNG of at most 10 MB (10,485,760 bytes). Commit.
4. For Return, enter an external reason, which the winner reads, and an
   internal reason, which only operators read. Both are required. Read a
   confirmation prompt showing the time left, then commit.

| Outcome | Invoice status | Payment deadline | Record |
| --- | --- | --- | --- |
| Confirm | `paid`, at the current invoice's order total | No longer applies | A payment record: method bank transfer, the winner's files as proof, and any operator files |
| Return | `pending` | The moment of return plus the time left at upload | The external and internal reasons, in the invoice log |

On Confirm Grade10 SHALL send the payment-received letter; on Return it SHALL
send the proof-not-accepted letter with the external reason, per
`grade10-site/auction/notifications-order`. Neither outcome SHALL change the
order total.

Grade10 SHALL refuse a Confirm, and store no file, when any operator file
breaks step 3.

Confirm and Return SHALL be offered only on a `payment_verifying` invoice, and
while it is `payment_verifying` they are the only actions offered. Return
SHALL NOT be offered on an `expired` invoice. That is a guard: the deadline is
stopped while proof is checked, so a checked invoice never expires. An
operator without payment-processing SHALL see both controls visible and
disabled, and Grade10 SHALL refuse both on the server.

The winner's files SHALL be readable by any operator who can open the order,
and never by the winner, per "Manual settlement records the method and its
proof".

#### Scenario: grade10-admin-auction-post-sale-SC-100 - Confirming proof settles the order
**Serves:** post-sale-US-10 - Operator checks a winner's payment proof

- **GIVEN** an order in Payment Verifying whose bank transfer invoice has a subtotal of 312000, a fee of 5000 and an order total of 317000 minor units in HKD, with two files the winner uploaded
- **AND** an operator holding payment-processing
- **WHEN** they confirm the proof
- **THEN** the invoice is `paid` at 317000 minor units in HKD
- **AND** the payment record names bank transfer and carries the winner's two files as proof
- **AND** the order derives as Processing

#### Scenario: grade10-admin-auction-post-sale-SC-101 - The operator may add their own proof on confirm
**Serves:** post-sale-US-10 - Operator checks a winner's payment proof

- **GIVEN** an order in Payment Verifying with one file the winner uploaded
- **WHEN** an operator attaches one PDF bank statement and confirms
- **THEN** the payment record carries both files as proof
- **AND** the operator's file is not shown to the winner

#### Scenario: grade10-admin-auction-post-sale-SC-102 - Returning proof restores the time that was left
**Serves:** post-sale-US-10 - Operator checks a winner's payment proof

- **GIVEN** an order whose invoice had a deadline of 2026-09-19T09:00:00Z and became `payment_verifying` at 2026-09-13T09:00:00Z
- **WHEN** an operator chooses Return at 2026-09-16T09:00:00Z
- **THEN** the confirmation prompt shows 6 days left
- **AND** after commit with both reasons the invoice is `pending` with a deadline of 2026-09-22T09:00:00Z
- **AND** the order derives as Pending Payment

#### Scenario: grade10-admin-auction-post-sale-SC-103 - A return needs both reasons
**Serves:** Checking proof - an external and an internal reason

- **GIVEN** an order in Payment Verifying
- **WHEN** an operator commits a Return with the external reason empty, or with the internal reason empty
- **THEN** Grade10 refuses it
- **AND** the invoice is still `payment_verifying`

#### Scenario: grade10-admin-auction-post-sale-SC-104 - Only the external reason reaches the winner
**Serves:** post-sale-US-10 - Operator checks a winner's payment proof

- **GIVEN** an operator returned proof with the external reason "Amount does not match" and the internal reason "Statement shows 300000"
- **WHEN** the winner opens the order and reads the proof-not-accepted letter
- **THEN** both show "Amount does not match"
- **AND** neither shows "Statement shows 300000"
- **AND** the invoice log shows both reasons

#### Scenario: grade10-admin-auction-post-sale-SC-105 - Confirm and Return are offered only while proof is checked
**Serves:** Checking proof - not offered once expired

- **GIVEN** one order whose invoice is `expired` and one whose invoice is `pending`
- **WHEN** an operator opens each
- **THEN** neither offers Confirm or Return
- **AND** Grade10 refuses a Return attempted on the expired invoice

#### Scenario: grade10-admin-auction-post-sale-SC-106 - Staff cannot check proof
**Serves:** post-sale-US-10 - Operator checks a winner's payment proof

- **GIVEN** an operator whose roles are exactly `staff`
- **WHEN** they open an order in Payment Verifying
- **THEN** Confirm and Return are visible and disabled
- **AND** Grade10 refuses both from them on the server
- **AND** they can read the files the winner uploaded

#### Scenario: grade10-admin-auction-post-sale-SC-128 - A wrong operator file refuses the confirm
**Serves:** Checking proof - the operator's own files if added

- **GIVEN** an order in Payment Verifying
- **WHEN** an operator attaches a PDF and a JPEG of 10,485,761 bytes, or six PDFs, and confirms
- **THEN** Grade10 refuses the confirm and stores no operator file
- **AND** the invoice is still `payment_verifying`

#### Scenario: grade10-admin-auction-post-sale-SC-129 - A return after a confirm is refused
**Serves:** post-sale-US-10 - Operator checks a winner's payment proof

- **GIVEN** an order in Payment Verifying open for two operators holding payment-processing
- **WHEN** the first confirms the proof and the second then commits a Return
- **THEN** Grade10 refuses the Return
- **AND** the invoice is still `paid` and no proof-not-accepted letter is sent

### Requirement: An operator reissues a sent invoice

Reissue is the one way to change an invoice after it is sent. An operator
holding payment-processing SHALL reissue an order whose invoice is `pending`
or `expired`:

1. Choose Reissue on the order.
2. Change what the winner asked for or the operator decided: delivery address,
   payment method, bank transfer fee, Shipping & Handling, Insurance. Each
   starts from the current invoice.
3. For bank transfer, read the bank transfer fee: prefilled from the current
   invoice when it was bank transfer, empty after a switch from card. It
   follows the quote's rules. For card, Grade10 prices the fee at send from the
   payment provider's current fees.
4. Choose the deadline: keep the current one, or a fresh 7 days from the
   moment the new invoice is sent. On an `expired` invoice only a fresh 7 days
   is offered.
5. Read the previous and the new order total.
6. Give a reason. The reason is mandatory.
7. Send the new invoice.

Grade10 SHALL refuse a reissue that changes none of the delivery address,
payment method, bank transfer fee, Shipping & Handling, Insurance or deadline.
A new reason alone is not a change; a fresh 7 days is.

On send Grade10 SHALL replace the current invoice with a new one carrying a new
invoice ID, bank reference and internal audit number, per
`grade10-site/auction/winner-order`, issue it as `pending` with the chosen deadline, lock the
address and method it carries, write a reissued entry to the invoice log
naming each part that changed, and send the winner the invoice-reissued letter.
The replaced invoice SHALL hold no status of its own and SHALL NOT be written
`cancelled`.

Only an operator SHALL change an invoice's payment method after send. Reissue
SHALL NOT be offered, and SHALL be refused, on an invoice that is
`payment_verifying` or `paid`. Grade10 SHALL refuse a reissue under the same
conditions it refuses a first send.

A card invoice whose money arrived any other way — bank transfer, cash or
another method — SHALL be reissued as bank transfer first, then settled
manually at the new invoice's order total. Where the money arrived at the
subtotal, the operator enters a bank transfer fee of 0.

#### Scenario: grade10-admin-auction-post-sale-SC-107 - A reissue keeps the deadline when the operator says so
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose bank transfer invoice totals 312000 minor units in HKD, with a bank transfer fee of 0 and a payment deadline of 2026-09-19T09:00:00Z
- **WHEN** an operator reissues it to a new address with Shipping & Handling 12000 and Insurance 4000 minor units in HKD, keeps the deadline, and sends with a reason
- **THEN** the new invoice's order total is 316000 minor units in HKD
- **AND** the payment deadline is still 2026-09-19T09:00:00Z
- **AND** the operator saw 312000 and 316000 minor units in HKD before sending

#### Scenario: grade10-admin-auction-post-sale-SC-108 - A reissue restarts the deadline when the operator says so
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment with a payment deadline of 2026-09-19T09:00:00Z
- **WHEN** an operator reissues it, chooses a fresh 7 days, and sends at 2026-09-15T10:00:00Z with a reason
- **THEN** the payment deadline is 2026-09-22T10:00:00Z

#### Scenario: grade10-admin-auction-post-sale-SC-109 - A reissue without a reason is refused
**Serves:** Resolving an unpaid order - always with a reason

- **GIVEN** an order in Pending Payment
- **WHEN** an operator attempts to send a reissue without a reason
- **THEN** Grade10 refuses it
- **AND** the current invoice, its amount, and its deadline are unchanged

#### Scenario: grade10-admin-auction-post-sale-SC-110 - A switch from card leaves the bank transfer fee empty
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose card invoice has a subtotal of 312000 and a fee of 11225 minor units in HKD
- **WHEN** an operator reissues it and switches the method to bank transfer
- **THEN** the bank transfer fee is empty
- **AND** Grade10 refuses to send until a fee is entered
- **AND** with a fee of 3000 entered, the new invoice is bank transfer at 315000 minor units in HKD

#### Scenario: grade10-admin-auction-post-sale-SC-111 - The bank transfer fee starts from the current invoice
**Serves:** Resolving an unpaid order - the bank transfer fee starts from the previous invoice

- **GIVEN** an order whose bank transfer invoice carries a bank transfer fee of 5000 minor units in HKD
- **WHEN** an operator opens Reissue on it
- **THEN** the bank transfer fee reads 5000 minor units in HKD

#### Scenario: grade10-admin-auction-post-sale-SC-112 - An expired invoice is reissued with a fresh deadline
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order whose invoice is `expired`
- **WHEN** an operator opens Reissue, then sends it at 2026-09-25T09:00:00Z with a reason
- **THEN** keeping the current deadline is not offered
- **AND** the new invoice is `pending` with a deadline of 2026-10-02T09:00:00Z
- **AND** the order derives as Pending Payment

#### Scenario: grade10-admin-auction-post-sale-SC-113 - No reissue while proof is checked or after payment
**Serves:** Resolving an unpaid order - reissue only on a pending or expired invoice

- **GIVEN** one order whose invoice is `payment_verifying` and one whose invoice is `paid`
- **WHEN** an operator opens each
- **THEN** neither offers Reissue
- **AND** Grade10 refuses a reissue attempted on either

#### Scenario: grade10-admin-auction-post-sale-SC-114 - A card invoice paid by transfer is reissued, then settled
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order whose card invoice has a subtotal of 312000 and a fee of 11225 minor units in HKD, and whose winner transferred 312000 minor units in HKD
- **WHEN** an operator reissues it as bank transfer with a bank transfer fee of 0 and a reason, then settles it manually by bank transfer with a reference and proof
- **THEN** the invoice is `paid` at 312000 minor units in HKD
- **AND** the replaced card invoice holds no status and is not `cancelled`

#### Scenario: grade10-admin-auction-post-sale-SC-115 - A replaced invoice is not cancelled
**Serves:** Resolving an unpaid order - one Reissue action

- **GIVEN** an order in Pending Payment
- **WHEN** an operator reissues its invoice with a reason
- **THEN** the order's invoice status is the new invoice's, `pending`
- **AND** the order does not derive as Cancelled and the lot is not returned to available

#### Scenario: grade10-admin-auction-post-sale-SC-125 - A switch to card prices the fee at send
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose bank transfer invoice has a subtotal of 312000 and a bank transfer fee of 0 minor units in HKD
- **AND** the payment provider reports fees for HKD of 235 minor units and 3.4 per cent
- **WHEN** an operator reissues it as card with a reason and sends
- **THEN** the new invoice is card with a payment processing fee of 11225 and an order total of 323225 minor units in HKD
- **AND** the operator entered no fee

#### Scenario: grade10-admin-auction-post-sale-SC-126 - Unreadable provider fees refuse a card reissue
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose invoice is bank transfer
- **AND** the payment provider's current fees cannot be read
- **WHEN** an operator reissues it as card with a reason and sends
- **THEN** Grade10 refuses the reissue and says the fees could not be read
- **AND** the current invoice is unchanged

#### Scenario: grade10-admin-auction-post-sale-SC-133 - A reissue that changes only the reason is refused
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose invoice `INV-202609-LK7P2Q-01` has a payment deadline of 2026-09-19T09:00:00Z
- **WHEN** an operator opens Reissue, keeps the deadline, changes nothing else, and sends with a reason
- **THEN** Grade10 refuses it as changing nothing
- **AND** the current invoice is still `INV-202609-LK7P2Q-01`, at the same amount and deadline

#### Scenario: grade10-admin-auction-post-sale-SC-134 - A fresh deadline alone is a change
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose invoice has a payment deadline of 2026-09-19T09:00:00Z
- **WHEN** an operator reissues it changing only the deadline to a fresh 7 days, and sends at 2026-09-15T10:00:00Z with a reason
- **THEN** the new invoice is `pending` with a payment deadline of 2026-09-22T10:00:00Z
- **AND** the reissued entry names the deadline as the only changed part

## MODIFIED Requirements

### Requirement: The queue shows one outcome per lot

Each lot SHALL show exactly one outcome. Before a lot has a winner the
outcome describes the lot; once it has one, the outcome SHALL be the derived
order status from `grade10-site/auction/order-status`, taken unchanged.
Grade10 SHALL NOT compute a second status for the operator.

| Outcome | When | Family | Needs action |
| --- | --- | --- | --- |
| Draft | Not yet available for bidding | Before a sale | No |
| Scheduled | Published, the start has not arrived | Before a sale | No |
| Live | Bidding open, until the lot closes | Before a sale | No |
| Unsold | Bidding ended with no winner | Before a sale | No |
| Called off | The lot was withdrawn before a sale | Before a sale | No |
| Awaiting Address | Derived: no invoice sent, no confirmed address | Order | No |
| Preparing Invoice | Derived: no invoice sent, address confirmed | Order | **Yes** |
| Payment Verifying | Derived: invoice `payment_verifying` | Order | **Yes** |
| Pending Payment | Derived: invoice `pending` or `expired` | Order | **Yes** when the invoice is `expired` |
| Processing | Derived: invoice `paid`, not dispatched | Order | **Yes** |
| Shipped | Derived: dispatched, delivery not confirmed | Order | No |
| Delivered | Derived: delivery confirmed | Order | No |
| Cancelled | Derived: invoice `cancelled` | Order | No |
| Refunded | Derived: invoice `refunded` | Order | No |

The queue SHALL let an operator filter to one outcome. Each outcome SHALL use
a visual mark showing this label rather than an internal code, and two
families SHALL NOT share a mark. A row whose outcome needs action SHALL carry
an additional highlight. A Pending Payment row whose invoice is `expired`
SHALL also show the invoice status Expired beside its outcome. A row in
Awaiting Address or Preparing Invoice that
has waited 72 hours or more in that stage SHALL also carry the Overdue mark,
per "The order detail shows how long an order has waited".

The queue SHALL let an operator search by listing code, invoice ID or bank
reference, per `grade10-site/auction/winner-order`. A replaced invoice's
invoice ID or bank reference SHALL find its order, which shows its current
invoice.

There is no Ending soon outcome: how long bidding has left is read from the
lot's close. Scenario `grade10-admin-auction-post-sale-SC-19` keeps its title
with its id. The title is historical: a lot inside its last hour is Live.

#### Scenario: grade10-admin-auction-post-sale-SC-19 - A lot inside its last hour is Ending soon
**Serves:** post-sale-US-01 - Operator works the listing queue by outcome

- **GIVEN** a published lot whose close is 60 minutes or less away and has not
  passed
- **WHEN** an operator reads the queue
- **THEN** that lot's outcome is Live

#### Scenario: grade10-admin-auction-post-sale-SC-20 - A won lot's outcome is its derived order status
**Serves:** post-sale-US-01 - Operator works the listing queue by outcome

- **GIVEN** a closed lot whose auction order derives as Processing
- **WHEN** an operator reads the queue
- **THEN** that lot's outcome is Processing
- **AND** it is the same value the winner reads on their own order

#### Scenario: grade10-admin-auction-post-sale-SC-21 - Expired and Processing are highlighted as needing action
**Serves:** post-sale-US-01 - Operator works the listing queue by outcome

- **GIVEN** a queue holding a Pending Payment order whose invoice is `expired`,
  a Pending Payment order whose invoice is `pending`, a Processing order, and
  a Delivered order
- **WHEN** an operator reads it
- **THEN** the expired-invoice row and the Processing row carry the
  needs-action highlight
- **AND** the expired-invoice row reads Pending Payment with the invoice
  status Expired beside it
- **AND** the other two rows carry no highlight

#### Scenario: grade10-admin-auction-post-sale-SC-44 - An order ready for a quote needs action
**Serves:** post-sale-US-01 - Operator works the listing queue by outcome

- **GIVEN** a queue holding one order in Preparing Invoice and one in Awaiting
  Address, both confirmed or closed less than 72 hours ago
- **WHEN** an operator reads it
- **THEN** the Preparing Invoice row carries the needs-action highlight
- **AND** the Awaiting Address row does not

#### Scenario: grade10-admin-auction-post-sale-SC-116 - Proof waiting for a check needs action
**Serves:** post-sale-US-01 - Operator works the listing queue by outcome

- **GIVEN** a queue holding one order whose invoice is `payment_verifying` and one whose invoice is `pending` inside its deadline
- **WHEN** an operator filters to Payment Verifying
- **THEN** only the first row is shown, reading Payment Verifying
- **AND** it carries the needs-action highlight

#### Scenario: grade10-admin-auction-post-sale-SC-131 - A search finds the order by any of its identifiers
**Serves:** post-sale-US-01 - Operator works the listing queue by outcome

- **GIVEN** an order on listing `LK7P2Q` whose first invoice `INV-202609-LK7P2Q-01` was replaced by `INV-202609-LK7P2Q-02`
- **WHEN** an operator searches the queue in turn by `LK7P2Q`, `INV-202609-LK7P2Q-01`, `LK7P2Q01`, `INV-202609-LK7P2Q-02` and `LK7P2Q02`
- **THEN** each search finds that order
- **AND** the order shows `INV-202609-LK7P2Q-02` as its current invoice

### Requirement: An operator quotes and sends the invoice

An operator holding payment-processing SHALL prepare and send the invoice for
an auction order in Preparing Invoice:

1. Open the order and read the winner's confirmed delivery address, the
   payment method the winner chose, the winning bid, and the buyer's premium.
2. Enter Shipping & Handling for that address, an integer count of minor
   units of zero or more in the lot's currency.
3. Optionally add Insurance for that address, an integer count of minor units
   greater than zero in the lot's currency.
4. For bank transfer, enter the bank transfer fee: an integer count of minor
   units of zero or more in the lot's currency, with no upper limit. A fee of
   zero reads Free to the winner.
5. Read the subtotal, the payment processing fee, and the order total. For
   card, Grade10 computes the fee from the payment provider's current fees;
   for bank transfer, the fee is the amount entered in step 4.
6. Send the invoice.

On send Grade10 SHALL issue the invoice with invoice status `pending`, an
invoice reference, and the payment method, record Sent at, set the payment
deadline to 7 calendar days from Sent at, lock the delivery address and the
payment method, write a sent entry to the invoice log, and send the winner the
invoice-sent letter, per `grade10-site/auction/notifications-order`.

Grade10 SHALL refuse to send an invoice when the winner has confirmed no
delivery address, when Shipping & Handling is missing, when Insurance is
added at zero, when a bank transfer invoice's fee is blank or is not an
integer of zero or more, or when a card invoice's payment provider fees cannot
be read. The refusal for unreadable fees SHALL say so, and SHALL name no stored
fee in its place. A bank transfer invoice SHALL NOT need the provider's fees.
An operator without payment-processing SHALL see the send control visible and
disabled, and Grade10 SHALL refuse the same action on the server.

#### Scenario: grade10-admin-auction-post-sale-SC-48 - Sending the invoice opens the payment window
**Serves:** Quote and send - sending issues the invoice and starts the deadline

- **GIVEN** an auction order in Preparing Invoice for bank transfer with a
  winning bid of 250000 and a buyer's premium of 50000 minor units in HKD
- **AND** an operator holding payment-processing
- **WHEN** they enter Shipping & Handling of 8000, Insurance of 4000 and a bank
  transfer fee of 0 minor units in HKD and send the invoice at
  2026-09-12T09:00:00Z
- **THEN** the invoice is `pending` with an order total of 312000 minor units
  in HKD and a payment deadline of 2026-09-19T09:00:00Z
- **AND** the delivery address and payment method are locked
- **AND** the order derives as Pending Payment

#### Scenario: grade10-admin-auction-post-sale-SC-49 - No invoice is sent without a confirmed address
**Serves:** Quote and send - no invoice without a confirmed address

- **GIVEN** an auction order in Awaiting Address
- **WHEN** an operator attempts to send its invoice
- **THEN** Grade10 refuses it
- **AND** the order is still Awaiting Address

#### Scenario: grade10-admin-auction-post-sale-SC-50 - Staff cannot send an invoice
**Serves:** Quote and send - the send needs payment-processing

- **GIVEN** an operator whose roles are exactly `staff`
- **WHEN** they open an auction order in Preparing Invoice
- **THEN** the send control is visible and disabled
- **AND** Grade10 refuses a send from them on the server

#### Scenario: grade10-admin-auction-post-sale-SC-69 - The operator sees the fee before sending
**Serves:** Quote and send - the card fee read before send

- **GIVEN** an auction order in Preparing Invoice for card whose lines total a
  subtotal of 312000 minor units in HKD
- **AND** the payment provider reports fees for HKD of 235 minor units and 3.4 per cent
- **WHEN** an operator holding payment-processing opens the send step
- **THEN** they read a payment processing fee of 11225 and an order total of
  323225 minor units in HKD

#### Scenario: grade10-admin-auction-post-sale-SC-70 - Unreadable provider fees refuse the send
**Serves:** Quote and send - a card invoice needs the provider's fees

- **GIVEN** an auction order in Preparing Invoice for card
- **AND** the payment provider's current fees cannot be read
- **WHEN** an operator attempts to send its invoice
- **THEN** Grade10 refuses the send and says the fees could not be read
- **AND** no invoice is issued

#### Scenario: grade10-admin-auction-post-sale-SC-63 - An invoice sends without insurance
**Serves:** Quote and send - insurance is optional

- **GIVEN** an auction order in Preparing Invoice for bank transfer with a
  winning bid of 250000 and a buyer's premium of 50000 minor units in HKD
- **WHEN** an operator enters Shipping & Handling of 0 and a bank transfer fee
  of 0, adds no Insurance, and sends
- **THEN** the invoice is `pending` with an order total of 300000 minor units in HKD

#### Scenario: grade10-admin-auction-post-sale-SC-68 - Insurance added at zero is refused
**Serves:** Quote and send - insurance is never zero once added

- **GIVEN** an auction order in Preparing Invoice
- **WHEN** an operator adds Insurance of 0 minor units and sends
- **THEN** Grade10 refuses the send
- **AND** no invoice is issued

#### Scenario: grade10-admin-auction-post-sale-SC-117 - The quote shows the winner's method
**Serves:** Quote and send - the winner's choice decides how the fee is priced

- **GIVEN** an auction order in Preparing Invoice whose winner chose bank transfer
- **WHEN** an operator holding payment-processing opens the quote
- **THEN** the quote names bank transfer
- **AND** asks for a bank transfer fee instead of showing a provider-priced fee

#### Scenario: grade10-admin-auction-post-sale-SC-118 - A blank bank transfer fee refuses the send
**Serves:** Quote and send - the bank transfer fee is required

- **GIVEN** an auction order in Preparing Invoice for bank transfer
- **WHEN** an operator leaves the bank transfer fee blank, or enters -100 minor units, and sends
- **THEN** Grade10 refuses the send
- **AND** no invoice is issued

#### Scenario: grade10-admin-auction-post-sale-SC-119 - A bank transfer fee has no cap and needs no provider fees
**Serves:** Quote and send - zero or more, with no cap

- **GIVEN** an auction order in Preparing Invoice for bank transfer with a subtotal of 312000 minor units in HKD
- **AND** the payment provider's current fees cannot be read
- **WHEN** an operator enters a bank transfer fee of 500000 minor units in HKD and sends
- **THEN** the invoice is `pending` with an order total of 812000 minor units in HKD

### Requirement: Manual settlement records the method and its proof

Manual settlement is the operator's backup for money the winner did not pay by
card or by bank transfer with proof an operator confirmed. An operator holding
payment-processing SHALL record it on an order whose bank transfer invoice is
`pending` or `expired`:

1. Open the order and read the current invoice's order total, which is the
   amount to settle, its payment method, and the locked delivery address.
2. Choose the method: bank transfer, cash, or other. Card SHALL NOT be
   offered.
3. For other, describe the method, in 1 to 200 characters.
4. Enter the external reference. It is required for a bank transfer and
   optional for cash and other.
5. Attach proof: 1 to 5 files, each a PDF, JPEG, or PNG of at most 10 MB
   (10,485,760 bytes). One file that breaks this refuses the commit, and no
   file is stored.
6. Commit.

On commit the invoice status SHALL become `paid` at the current invoice's full
order total, directly and without passing through `payment_verifying`. The
invoice SHALL keep its payment processing fee line unchanged, and Grade10
SHALL write a payment record carrying the method, any description, the
external reference, and the proof files. An amount different from the current
invoice SHALL be reached through a reissue first, never at settlement.

Manual settlement SHALL NOT be offered, and SHALL be refused, on a card
invoice, whatever the method; the operator reissues it as bank transfer
first. It SHALL NOT be offered on a `payment_verifying` invoice; the operator
confirms or returns the proof instead.

Proof files SHALL be readable by any operator who can open the order, SHALL be
retained for the life of the account, and SHALL NOT be deleted or replaced.
They SHALL NOT be shown to the winner. Grade10 SHALL log the operator, the
timestamp, the amount, the method, the external reference, and the proof
files.

#### Scenario: grade10-admin-auction-post-sale-SC-55 - A bank transfer with a slip settles the order
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose bank transfer invoice totals
  312000 minor units in HKD, with a bank transfer fee of 0
- **AND** an operator holding payment-processing
- **WHEN** they record a bank transfer with an external reference and one PDF
  transfer slip, and commit
- **THEN** the invoice is `paid` at 312000 minor units in HKD
- **AND** the payment record carries bank transfer, the reference, and the slip
- **AND** the order derives as Processing

Scenario `grade10-admin-auction-post-sale-SC-67` keeps its title with its id.
The title is historical: manual settlement keeps the payment processing fee.

#### Scenario: grade10-admin-auction-post-sale-SC-67 - Manual settlement drops the processing fee
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose bank transfer invoice has a
  subtotal of 312000 and a payment processing fee of 5000 minor units in HKD
- **WHEN** an operator settles it by bank transfer with a reference and a proof file
- **THEN** the invoice is `paid` at 317000 minor units in HKD
- **AND** the invoice still carries the payment processing fee of 5000 minor units in HKD

#### Scenario: grade10-admin-auction-post-sale-SC-56 - Settlement without proof is refused
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose invoice is bank transfer
- **WHEN** an operator records a cash payment with no proof file and commits
- **THEN** Grade10 refuses it
- **AND** the invoice is still `pending`

#### Scenario: grade10-admin-auction-post-sale-SC-57 - Another method needs a description
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose invoice is bank transfer
- **WHEN** an operator chooses other, attaches proof, leaves the description
  empty, and commits
- **THEN** Grade10 refuses it
- **AND** the invoice is still `pending`

#### Scenario: grade10-admin-auction-post-sale-SC-58 - No settlement before an invoice is sent
**Serves:** post-sale-US-07 - settlement waits for the invoice the quote sends

- **GIVEN** an auction order in Preparing Invoice
- **WHEN** an operator attempts to record a manual settlement
- **THEN** Grade10 refuses it
- **AND** the order is still Preparing Invoice

#### Scenario: grade10-admin-auction-post-sale-SC-59 - A settled order refuses a second settlement
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an auction order whose invoice status is `paid`
- **WHEN** an operator attempts to record a second settlement against it
- **THEN** Grade10 refuses it
- **AND** the existing payment record is unchanged

#### Scenario: grade10-admin-auction-post-sale-SC-60 - Manual settlement is available before expiry
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose invoice is bank transfer, three
  days from its deadline, and whose winner has arranged payment by bank transfer
- **AND** an operator holding payment-processing
- **WHEN** they record the settlement with its reference and proof
- **THEN** Grade10 accepts it
- **AND** the order derives as Processing without having expired first
- **AND** the order never read Payment Verifying

#### Scenario: grade10-admin-auction-post-sale-SC-62 - A proof file of the wrong kind is refused
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose invoice is bank transfer
- **WHEN** an operator attaches a valid PDF with a 12 MB JPEG, or with a file
  that is not a PDF, JPEG, or PNG, and commits
- **THEN** Grade10 refuses the commit and stores no file
- **AND** the invoice is still `pending`

#### Scenario: grade10-admin-auction-post-sale-SC-120 - No manual settlement while proof is checked
**Serves:** Resolving an unpaid order - operator settlement

- **GIVEN** an order in Payment Verifying
- **WHEN** an operator attempts to record a manual settlement
- **THEN** Grade10 refuses it
- **AND** the invoice is still `payment_verifying`

#### Scenario: grade10-admin-auction-post-sale-SC-121 - A card invoice cannot be settled manually
**Serves:** Resolving an unpaid order - card invoice paid by transfer

- **GIVEN** an order in Pending Payment whose invoice was sent for card
- **WHEN** an operator opens the order
- **THEN** manual settlement is not offered
- **AND** Grade10 refuses a bank transfer, cash or other settlement attempted on that invoice

#### Scenario: grade10-admin-auction-post-sale-SC-130 - A settlement at another amount is refused
**Serves:** Resolving an unpaid order - operator settlement

- **GIVEN** an order in Pending Payment whose bank transfer invoice has an order total of 312000 minor units in HKD
- **WHEN** an operator attempts to record a settlement of 311999 or 312001 minor units in HKD with proof
- **THEN** Grade10 refuses each
- **AND** the invoice is still `pending`

### Requirement: An operator resolves an unpaid order

An operator holding payment-processing SHALL be able to take these actions on
an auction order that is unpaid.

| Action | Effect | Available |
| --- | --- | --- |
| Reissue | Replaces the current invoice with a new `pending` one, per "An operator reissues a sent invoice". The order reads Pending Payment | On an order whose invoice is `pending` or `expired` |
| Confirm or return proof | Settles the invoice or returns it to `pending`, per "An operator checks payment proof" | On an order whose invoice is `payment_verifying` |
| Settle manually | Records a payment with its method and proof, per "Manual settlement records the method and its proof". Invoice status becomes `paid`, so the order derives as Processing | On an order whose bank transfer invoice is `pending` or `expired` |
| Cancel order | Invoice status becomes `cancelled`. The lot returns to available | On an Awaiting Address or Preparing Invoice order, or one whose invoice is `expired` |

While an invoice is `payment_verifying`, Grade10 SHALL offer only Confirm and
Return, and SHALL refuse Reissue, manual settlement and Cancel.

Grade10 SHALL make manual settlement available before expiry as well as
after, so money that arrived by another route need not wait for the deadline
to elapse.

Reissue, returning proof, manual settlement and cancellation SHALL each record
a named operator and a mandatory reason.

Reissuing an invoice SHALL NOT lift the winner's account suspension, per
`grade10-site/auction/bidder-suspension`. Reinstatement is a separate,
explicit action.

#### Scenario: grade10-admin-auction-post-sale-SC-23 - Reissue returns an expired order to Pending Payment
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an auction order whose invoice is `expired`
- **AND** an operator holding payment-processing
- **WHEN** they reissue the invoice with a reason
- **THEN** the invoice status is `pending` with a new 7-day deadline
- **AND** the derived order status is Pending Payment

#### Scenario: grade10-admin-auction-post-sale-SC-24 - Reissue leaves the suspension standing
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** a suspended winner whose expired order an operator reissues
- **WHEN** the reissue is committed
- **THEN** the account is still suspended
- **AND** the operator is not offered reinstatement as part of the reissue

#### Scenario: grade10-admin-auction-post-sale-SC-25 - An operator without the grant is refused
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an operator who does not hold payment-processing
- **WHEN** they open an order whose invoice is `expired`
- **THEN** the reissue, settle and cancel controls are visible and disabled
- **AND** Grade10 refuses those actions on the server if they are attempted

#### Scenario: grade10-admin-auction-post-sale-SC-54 - An overdue order waiting on an address can be cancelled
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an auction order in Awaiting Address carrying the Overdue mark
- **AND** an operator holding payment-processing
- **WHEN** they cancel it with a reason
- **THEN** the order derives as Cancelled and the lot returns to available
- **AND** the winner's account is not suspended

#### Scenario: grade10-admin-auction-post-sale-SC-122 - A pending invoice offers reissue and settlement
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order whose invoice is `pending`
- **AND** an operator holding payment-processing
- **WHEN** they open it
- **THEN** Reissue and Settle manually are offered
- **AND** Confirm and Return are not

#### Scenario: grade10-admin-auction-post-sale-SC-127 - Only Confirm and Return while proof is checked
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Payment Verifying
- **AND** an operator holding payment-processing
- **WHEN** they open it, and attempt to cancel it
- **THEN** only Confirm and Return are offered
- **AND** Grade10 refuses the cancel and the invoice is still `payment_verifying`

### Requirement: Invoice log history

Every change to an auction order's money SHALL be written as an append-only
invoice log entry, never as a field overwrite. The order's detail SHALL show
these log entries in chronological order. It SHALL also show operators each
invoice's invoice ID, bank reference and internal audit number, and each
receipt's receipt ID and internal audit number, per
`grade10-site/auction/winner-order`.

| Field | Notes |
| --- | --- |
| Log type | Sent, expired, reissued, proof uploaded, proof confirmed, proof returned, paid, manually settled, cancelled, refunded, payment attempt failed |
| Timestamp | Stored in UTC, displayed in the operator's own timezone |
| Invoice ID | The invoice the entry concerns |
| Internal audit number | Sent, reissued, paid and manually settled entries: the number of the invoice or receipt the entry issued |
| Invoice status after the log entry | |
| Order total at the log entry | Captures amount changes across reissues |
| Amount delta | Where the amount changed from the prior log entry |
| Payment deadline at the log entry | The deadline trail across reissues and returned proof |
| Time left | Proof uploaded and proof returned entries |
| Deadline choice | Reissues only: kept or restarted |
| Changed parts | Reissues only: each of delivery address, payment method, bank transfer fee, Shipping & Handling, Insurance and deadline that changed |
| Reissue sequence number | Where the log entry is a reissue |
| Actor | The buyer, the system, or a named operator |
| Payment method | Paid entries: a card with its brand and last four digits, or bank transfer, cash, or other with its description |
| Proof files | Proof uploaded entries: the winner's files. Proof confirmed and manual settlement entries: every file on the payment record |
| External reference | Manual settlements only |
| Reason | Mandatory on an operator-initiated log entry. A proof returned entry carries both the external and the internal reason |
| Payment-provider reference | Where one applies |

Grade10 SHALL record failed payment attempts in the invoice log. A buyer who tried
three times with a declining card is a different case from one who never
engaged, and the difference SHALL be visible to whoever decides on
reinstatement.

#### Scenario: grade10-admin-auction-post-sale-SC-34 - Failed payment attempts appear in the invoice log
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** a winner whose card was declined three times before the deadline
  elapsed
- **WHEN** an operator reads the invoice log
- **THEN** it shows three failed payment attempts with their timestamps
- **AND** the buyer is distinguishable from one whose history holds only the
  issued log entry

#### Scenario: grade10-admin-auction-post-sale-SC-35 - An amendment's amount change is on the record
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** an auction order an operator reissued, changing the order total
  from 312000 to 316000 minor units in HKD
- **WHEN** an operator reads the invoice log
- **THEN** it shows the reissued entry at 316000 minor units in HKD
- **AND** the delta from the prior entry and the deadline choice

#### Scenario: grade10-admin-auction-post-sale-SC-61 - A paid entry names how it was paid
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** one order the winner paid by a Visa card ending 4242 and one an
  operator settled by cash
- **WHEN** an operator reads each invoice log
- **THEN** the first paid entry names a Visa card ending 4242
- **AND** the second names cash, with its proof files

#### Scenario: grade10-admin-auction-post-sale-SC-123 - A reissue names what it changed
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** an order an operator reissued, switching the method from card to bank transfer and changing Shipping & Handling from 8000 to 12000 minor units in HKD
- **WHEN** an operator reads the invoice log
- **THEN** the reissued entry names payment method, bank transfer fee and Shipping & Handling as changed
- **AND** names no other part as changed

#### Scenario: grade10-admin-auction-post-sale-SC-124 - A proof check is on the record
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** an order whose winner uploaded proof, an operator returned it with an external and an internal reason, and the winner uploaded again, which an operator confirmed
- **WHEN** an operator reads the invoice log
- **THEN** it shows proof uploaded, proof returned with both reasons and the time left, proof uploaded, and proof confirmed, in that order
- **AND** each names its actor and timestamp

#### Scenario: grade10-admin-auction-post-sale-SC-132 - Operators read the internal audit numbers
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** an order whose first invoice holds internal audit number `#00010482`, whose reissued invoice holds `#00010490`, and whose receipt holds `#00010495`
- **WHEN** an operator opens the order and reads its invoice log
- **THEN** the order shows all three numbers against their invoice or receipt
- **AND** the sent entry shows `#00010482`, the reissued entry `#00010490` and the paid entry `#00010495`
