## Feature set

- Queue
  - Two states before an invoice: Awaiting Address waits on the winner, Preparing Invoice waits on an operator and needs action
  - Overdue mark: an order idle 72 hours or more in either stage is marked, so a stalled order is chased rather than forgotten
  - Expired invoices: an order whose invoice has expired reads Pending Payment and is highlighted as needing action
- Quote and send
  - Operator quote: Shipping & Handling, and Insurance when added, are priced by a person for the winner's confirmed address
  - Send opens the window: sending issues the invoice, locks the address, and starts the 7-day deadline
  - Re-quote on request: an address change after send is re-priced and reissued by an operator, who decides what happens to the deadline
- Resolving an unpaid order
  - Manual settlement: a non-card payment is recorded with its method, its reference, and proof of it
  - Cancellation: now also available before an invoice is sent, for an order the operator decides not to pursue
- Audit trail
  - Payment method on the record: every paid entry says how it was paid

## REMOVED Requirements

### Requirement: Manual settlement confirms the address and recalculates

**Reason**: The delivery address now locks when the invoice is sent, and
shipping is quoted by an operator rather than recalculated, so manual
settlement no longer confirms an address or revises an amount. It now records
how the money arrived and proof of it.

**Migration**: Replaced by "Manual settlement records the method and its
proof". An amount change goes through "An operator re-quotes a sent invoice"
first. Its five scenarios retire; "A settled order refuses a second
settlement" and "Manual settlement is available before expiry" carry the same
behaviour under the new requirement.

## ADDED Requirements

### Requirement: The order detail shows how long an order has waited

An auction order in Awaiting Address or Preparing Invoice SHALL show, on its
detail, how long it has waited in that stage.

| Stage | Waiting since |
| --- | --- |
| Awaiting Address | The lot's close |
| Preparing Invoice | The winner's latest address confirmation |

An order that has waited 72 hours or more in its current stage SHALL carry an
**Overdue** mark on its queue row and its detail. The Overdue mark SHALL be
distinct from the needs-action highlight, and the queue SHALL let an operator
filter to overdue orders.

The Overdue mark SHALL change nothing else. Grade10 SHALL NOT expire, cancel,
or suspend on it; the operator decides whether to contact the winner, prepare
the invoice, or cancel the order.

#### Scenario: grade10-admin-auction-post-sale-SC-45 - An order waiting on an address shows time since close
**Serves:** post-sale-US-01 - Operator resolves an unpaid order

- **GIVEN** an auction order in Awaiting Address whose lot closed 30 hours ago
- **WHEN** an operator opens it
- **THEN** the detail shows that it has waited 30 hours since the lot's close
- **AND** it carries no Overdue mark

#### Scenario: grade10-admin-auction-post-sale-SC-46 - An order idle 72 hours is marked Overdue
**Serves:** post-sale-US-01 - Operator resolves an unpaid order

- **GIVEN** one auction order in Awaiting Address whose lot closed 72 hours ago
- **AND** one in Preparing Invoice whose winner confirmed an address 80 hours ago
- **WHEN** an operator reads the queue
- **THEN** both rows carry the Overdue mark
- **AND** filtering to overdue orders shows both

#### Scenario: grade10-admin-auction-post-sale-SC-47 - Overdue changes no status
**Serves:** Queue - overdue changes no status

- **GIVEN** an auction order in Awaiting Address carrying the Overdue mark
- **WHEN** another 30 days pass with no operator action
- **THEN** its derived status is still Awaiting Address
- **AND** the winner's account is not suspended

### Requirement: An operator quotes and sends the invoice

An operator holding payment-processing SHALL prepare and send the invoice for
an auction order in Preparing Invoice:

1. Open the order and read the winner's confirmed delivery address, the
   winning bid, and the buyer's premium.
2. Enter Shipping & Handling for that address, an integer count of minor
   units of zero or more in the lot's currency.
3. Optionally add Insurance for that address, an integer count of minor units
   greater than zero in the lot's currency.
4. Read the order total Grade10 computes from every component.
5. Send the invoice.

On send Grade10 SHALL issue the invoice with invoice status `pending`, record
Sent at, set the payment deadline to 7 calendar days from Sent at, lock the
delivery address, write a sent entry to the invoice log, and send the winner
the invoice-sent letter, per `grade10-site/auction/notifications-order`.

Grade10 SHALL refuse to send an invoice when the winner has confirmed no
delivery address, when Shipping & Handling is missing, or when Insurance is
added at zero. An operator
without payment-processing SHALL see the send control visible and disabled,
and Grade10 SHALL refuse the same action on the server.

#### Scenario: grade10-admin-auction-post-sale-SC-48 - Sending the invoice opens the payment window
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in Preparing Invoice with a winning bid of
  250000 and a buyer's premium of 50000 minor units in HKD
- **AND** an operator holding payment-processing
- **WHEN** they enter Shipping & Handling of 8000 and Insurance of 4000 minor units in
  HKD and send the invoice at 2026-09-12T09:00:00Z
- **THEN** the invoice is `pending` with an order total of 312000 minor units
  in HKD and a payment deadline of 2026-09-19T09:00:00Z
- **AND** the delivery address is locked
- **AND** the order derives as Pending Payment

#### Scenario: grade10-admin-auction-post-sale-SC-49 - No invoice is sent without a confirmed address
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in Awaiting Address
- **WHEN** an operator attempts to send its invoice
- **THEN** Grade10 refuses it
- **AND** the order is still Awaiting Address

#### Scenario: grade10-admin-auction-post-sale-SC-50 - Staff cannot send an invoice
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an operator whose roles are exactly `staff`
- **WHEN** they open an auction order in Preparing Invoice
- **THEN** the send control is visible and disabled
- **AND** Grade10 refuses a send from them on the server

#### Scenario: grade10-admin-auction-post-sale-SC-63 - An invoice sends without insurance
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in Preparing Invoice with a winning bid of
  250000 and a buyer's premium of 50000 minor units in HKD
- **WHEN** an operator enters Shipping & Handling of 0, adds no Insurance, and sends
- **THEN** the invoice is `pending` with an order total of 300000 minor units in HKD

#### Scenario: grade10-admin-auction-post-sale-SC-67 - Insurance added at zero is refused
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an auction order in Preparing Invoice
- **WHEN** an operator adds Insurance of 0 minor units and sends
- **THEN** Grade10 refuses the send
- **AND** no invoice is issued

### Requirement: An operator re-quotes a sent invoice

When a winner asks to change the delivery address after the invoice is sent,
an operator holding payment-processing SHALL be able to re-quote an order in
Pending Payment:

1. Record the delivery address the winner asked for.
2. Enter Shipping & Handling for that address, and optionally add Insurance,
   under the same rules as a first quote.
3. Read the previous and the new order total.
4. Choose to keep the current payment deadline, or to start a fresh 7 days
   from the moment the new invoice is sent.
5. Give a reason. The reason is mandatory.
6. Send the new invoice.

On send Grade10 SHALL supersede the current invoice, issue the new one as
`pending` at the new order total with the deadline the operator chose, lock
the new address, write a re-quoted entry to the invoice log with the deadline
choice, and send the winner the invoice-reissued letter. An order whose
invoice is `expired` is not re-quoted; it is reissued, per "An operator resolves an unpaid order".

#### Scenario: grade10-admin-auction-post-sale-SC-51 - A re-quote keeps the deadline when the operator says so
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an order in Pending Payment at 312000 minor units in HKD with a
  payment deadline of 2026-09-19T09:00:00Z
- **WHEN** an operator re-quotes it to a new address with Shipping & Handling 12000 and
  Insurance 4000 minor units in HKD, keeps the deadline, and sends with a reason
- **THEN** the new invoice's order total is 316000 minor units in HKD
- **AND** the payment deadline is still 2026-09-19T09:00:00Z
- **AND** the operator saw 312000 and 316000 minor units in HKD before sending

#### Scenario: grade10-admin-auction-post-sale-SC-52 - A re-quote resets the deadline when the operator says so
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an order in Pending Payment with a payment deadline of
  2026-09-19T09:00:00Z
- **WHEN** an operator re-quotes it, chooses a fresh 7 days, and sends at
  2026-09-15T10:00:00Z with a reason
- **THEN** the payment deadline is 2026-09-22T10:00:00Z

#### Scenario: grade10-admin-auction-post-sale-SC-53 - A re-quote without a reason is refused
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** an order in Pending Payment
- **WHEN** an operator attempts to send a re-quote without a reason
- **THEN** Grade10 refuses it
- **AND** the current invoice, its amount, and its deadline are unchanged

### Requirement: Manual settlement records the method and its proof

Manual settlement is the operator's backup for money that did not arrive by
the winner's card. An operator holding payment-processing SHALL record it on
an order whose invoice is `pending` or `expired`:

1. Open the order and read the current invoice's order total and the locked
   delivery address.
2. Choose the method: bank transfer, cash, or other. Card SHALL NOT be offered.
3. For other, describe the method, in 1 to 200 characters.
4. Enter the external reference. It is required for a bank transfer and
   optional for cash and other.
5. Attach proof: 1 to 5 files, each a PDF, JPEG, or PNG of at most 10 MB.
6. Commit.

On commit the invoice status SHALL become `paid` at the current invoice's
order total, and Grade10 SHALL write a payment record carrying the method,
any description, the external reference, and the proof files. An amount
different from the current invoice SHALL be reached through a re-quote first,
never at settlement.

Proof files SHALL be readable by any operator who can open the order, SHALL be
retained for the life of the account, and SHALL NOT be deleted or replaced.
They SHALL NOT be shown to the winner. Grade10 SHALL log the operator, the
timestamp, the amount, the method, the external reference, and the proof
files.

#### Scenario: grade10-admin-auction-post-sale-SC-55 - A bank transfer with a slip settles the order
**Serves:** post-sale-US-01 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment at 312000 minor units in HKD
- **AND** an operator holding payment-processing
- **WHEN** they record a bank transfer with an external reference and one PDF
  transfer slip, and commit
- **THEN** the invoice is `paid` at 312000 minor units in HKD
- **AND** the payment record carries bank transfer, the reference, and the slip
- **AND** the order derives as Processing

#### Scenario: grade10-admin-auction-post-sale-SC-56 - Settlement without proof is refused
**Serves:** post-sale-US-01 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment
- **WHEN** an operator records a cash payment with no proof file and commits
- **THEN** Grade10 refuses it
- **AND** the invoice is still `pending`

#### Scenario: grade10-admin-auction-post-sale-SC-57 - Another method needs a description
**Serves:** post-sale-US-01 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment
- **WHEN** an operator chooses other, attaches proof, leaves the description
  empty, and commits
- **THEN** Grade10 refuses it
- **AND** the invoice is still `pending`

#### Scenario: grade10-admin-auction-post-sale-SC-58 - No settlement before an invoice is sent
**Serves:** `post-sale-US-01`, `post-sale-US-05` - settlement waits for the invoice the quote sends

- **GIVEN** an auction order in Preparing Invoice
- **WHEN** an operator attempts to record a manual settlement
- **THEN** Grade10 refuses it
- **AND** the order is still Preparing Invoice

#### Scenario: grade10-admin-auction-post-sale-SC-59 - A settled order refuses a second settlement
**Serves:** post-sale-US-01 - Operator resolves an unpaid order

- **GIVEN** an auction order whose invoice status is `paid`
- **WHEN** an operator attempts to record a second settlement against it
- **THEN** Grade10 refuses it
- **AND** the existing payment record is unchanged

#### Scenario: grade10-admin-auction-post-sale-SC-60 - Manual settlement is available before expiry
**Serves:** post-sale-US-01 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment, three days from its deadline, whose
  winner has arranged payment by bank transfer
- **AND** an operator holding payment-processing
- **WHEN** they record the settlement with its reference and proof
- **THEN** Grade10 accepts it
- **AND** the order derives as Processing without having expired first

#### Scenario: grade10-admin-auction-post-sale-SC-62 - A proof file of the wrong kind is refused
**Serves:** post-sale-US-01 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment
- **WHEN** an operator attaches a 12 MB JPEG, or a file that is not a PDF,
  JPEG, or PNG
- **THEN** Grade10 refuses that file
- **AND** the settlement cannot be committed until at least one valid proof
  file is attached

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

There is no Ending soon outcome: how long bidding has left is read from the
lot's close. Scenario `grade10-admin-auction-post-sale-SC-19` keeps its title
with its id. The title is historical: a lot inside its last hour is Live.

#### Scenario: grade10-admin-auction-post-sale-SC-19 - A lot inside its last hour is Ending soon
**Serves:** Queue - a lot inside its last hour is Ending soon

- **GIVEN** a published lot whose close is 60 minutes or less away and has not
  passed
- **WHEN** an operator reads the queue
- **THEN** that lot's outcome is Live

#### Scenario: grade10-admin-auction-post-sale-SC-20 - A won lot's outcome is its derived order status
**Serves:** Queue - a won lot's outcome is its derived order status

- **GIVEN** a closed lot whose auction order derives as Processing
- **WHEN** an operator reads the queue
- **THEN** that lot's outcome is Processing
- **AND** it is the same value the winner reads on their own order

#### Scenario: grade10-admin-auction-post-sale-SC-21 - Expired and Processing are highlighted as needing action
**Serves:** Queue - expired and Processing are highlighted as needing action

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
**Serves:** post-sale-US-05 - Operator quotes and sends a winner's invoice

- **GIVEN** a queue holding one order in Preparing Invoice and one in Awaiting
  Address, both confirmed or closed less than 72 hours ago
- **WHEN** an operator reads it
- **THEN** the Preparing Invoice row carries the needs-action highlight
- **AND** the Awaiting Address row does not

### Requirement: An operator resolves an unpaid order

An operator holding payment-processing SHALL be able to take these actions on
an auction order that is unpaid.

| Action | Effect | Available |
| --- | --- | --- |
| Reissue invoice | Issues a fresh invoice with a new 7-day payment deadline. Invoice status returns from `expired` to `pending`; the order reads Pending Payment throughout | On an order whose invoice is `expired` |
| Settle manually | Records a non-card payment with its method and proof, per "Manual settlement records the method and its proof". Invoice status becomes `paid`, so the order derives as Processing | On any order whose invoice is `pending` or `expired` |
| Cancel order | Invoice status becomes `cancelled`. The lot returns to available | On an Awaiting Address or Preparing Invoice order, or one whose invoice is `expired` |

Grade10 SHALL make manual settlement available before expiry as well as
after, so a winner settling by bank transfer need not let their deadline
elapse first.

Reissue, manual settlement and cancellation SHALL each record a named
operator and a mandatory reason.

Reissuing an invoice SHALL NOT lift the winner's account suspension, per
`grade10-site/auction/bidder-suspension`. Reinstatement is a separate,
explicit action.

#### Scenario: grade10-admin-auction-post-sale-SC-23 - Reissue returns an expired order to Pending Payment
**Serves:** post-sale-US-01 - Operator resolves an unpaid order

- **GIVEN** an auction order whose invoice is `expired`
- **AND** an operator holding payment-processing
- **WHEN** they reissue the invoice with a reason
- **THEN** the invoice status is `pending` with a new 7-day deadline
- **AND** the derived order status is Pending Payment

#### Scenario: grade10-admin-auction-post-sale-SC-24 - Reissue leaves the suspension standing
**Serves:** post-sale-US-01 - Operator resolves an unpaid order

- **GIVEN** a suspended winner whose expired order an operator reissues
- **WHEN** the reissue is committed
- **THEN** the account is still suspended
- **AND** the operator is not offered reinstatement as part of the reissue

#### Scenario: grade10-admin-auction-post-sale-SC-25 - An operator without the grant is refused
**Serves:** post-sale-US-01 - Operator resolves an unpaid order

- **GIVEN** an operator who does not hold payment-processing
- **WHEN** they open an order whose invoice is `expired`
- **THEN** the reissue, settle and cancel controls are visible and disabled
- **AND** Grade10 refuses those actions on the server if they are attempted

#### Scenario: grade10-admin-auction-post-sale-SC-54 - An overdue order waiting on an address can be cancelled
**Serves:** post-sale-US-01 - Operator resolves an unpaid order

- **GIVEN** an auction order in Awaiting Address carrying the Overdue mark
- **AND** an operator holding payment-processing
- **WHEN** they cancel it with a reason
- **THEN** the order derives as Cancelled and the lot returns to available
- **AND** the winner's account is not suspended

### Requirement: Invoice log history

Every change to an auction order's money SHALL be written as an append-only
invoice log entry, never as a field overwrite. The order's detail SHALL show
these log entries in chronological order.

| Field | Notes |
| --- | --- |
| Log type | Sent, expired, re-quoted, reissued, paid, manually settled, cancelled, refunded, payment attempt failed |
| Timestamp | Stored in UTC, displayed in the operator's own timezone |
| Invoice status after the log entry | |
| Order total at the log entry | Captures amount changes across re-quotes and reissues |
| Amount delta | Where the amount changed from the prior log entry |
| Payment deadline at the log entry | The deadline trail across re-quotes and reissues |
| Deadline choice | Re-quotes only: kept or reset |
| Reissue sequence number | Where the log entry is a reissue |
| Actor | The buyer, the system, or a named operator |
| Payment method | Paid entries: a card with its brand and last four digits, or bank transfer, cash, or other with its description |
| External reference and proof files | Manual settlements only |
| Reason | Mandatory on an operator-initiated log entry |
| Payment-provider reference | Where one applies |

Grade10 SHALL record failed payment attempts in the invoice log. A buyer who tried
three times with a declining card is a different case from one who never
engaged, and the difference SHALL be visible to whoever decides on
reinstatement.

#### Scenario: grade10-admin-auction-post-sale-SC-34 - Failed payment attempts appear in the invoice log
**Serves:** Audit trail - failed payment attempts appear in the invoice log

- **GIVEN** a winner whose card was declined three times before the deadline
  elapsed
- **WHEN** an operator reads the invoice log
- **THEN** it shows three failed payment attempts with their timestamps
- **AND** the buyer is distinguishable from one whose history holds only the
  issued log entry

#### Scenario: grade10-admin-auction-post-sale-SC-35 - An amendment's amount change is on the record
**Serves:** Audit trail - an amendment's amount change is on the record

- **GIVEN** an auction order an operator re-quoted, changing the order total
  from 312000 to 316000 minor units in HKD
- **WHEN** an operator reads the invoice log
- **THEN** it shows the re-quoted entry at 316000 minor units in HKD
- **AND** the delta from the prior entry and the deadline choice

#### Scenario: grade10-admin-auction-post-sale-SC-61 - A paid entry names how it was paid
**Serves:** Audit trail - a paid entry names how it was paid

- **GIVEN** one order the winner paid by a Visa card ending 4242 and one an
  operator settled by cash
- **WHEN** an operator reads each invoice log
- **THEN** the first paid entry names a Visa card ending 4242
- **AND** the second names cash, with its proof files
