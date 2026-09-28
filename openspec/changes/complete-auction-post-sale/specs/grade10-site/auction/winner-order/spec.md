## Feature set

- Payment method
  - Chosen with the address: card or bank transfer, confirmed with the delivery and billing addresses from one review
  - Fee rule at the choice: each method shows the rule its fee is quoted from - `3.4% + HK$2.35 processing fee`, `Free` when both parts are zero, `Set on your invoice` with no rule - and never an amount
  - Offered where Grade10 holds bank details: card in every currency, bank transfer only in a currency whose bank details Grade10 holds - a sample HKD account outside production, and in production the account Finance confirms
  - Review before confirming: setup ends on one review of the three choices, which says they lock; leaving it records none
  - Locked on confirmation: once the winner confirms, they change neither the addresses nor the method; an operator edits them before send and reissues after
- Next step
  - One panel first in every status: what Grade10 is doing, the deadline where one applies, what the winner does next, and Contact Us
  - Waiting on the invoice: the 7 days to pay start when the invoice arrives, and no time is promised for the invoice
  - Nothing private: no balance, no payment proof file and no internal note
  - Overdue in the panel: a missed setup or payment deadline and Contact Us sit in the panel, with no separate alert
- Bank transfer
  - Payment proof: one upload of 1 to 3 PDF, PNG or JPEG files with an optional transaction reference, behind a confirm step; a phone's HEIC photo is converted on the device, and HEIC sent as it is is refused
- Card payment
  - Confirmed on return: coming back from a completed card payment records it then, once, without waiting for the provider's notice
  - No start once closed: no card payment starts on an expired or checked invoice, and one that completes anyway is recorded
- Contact Us on locked orders
  - Reason is the order status: the subject and body name the order's status, whichever it is

## MODIFIED Requirements

### Requirement: The winner chooses a payment method with the address

The winner picks card or bank transfer during setup, reads the fee rule for
each, and the pick locks with the addresses.

**Chosen with the address** - When the winner sets up an auction order,
Winner Order SHALL also ask how they will pay, per "Setup ends on a review
that locks it":

1. Choose card or bank transfer.
2. Read the fee rule beside each method.
3. Confirm the method with the delivery and billing addresses, from the
   review.

**No preselection** - Grade10 SHALL preselect neither method and SHALL record
the chosen method on the order.

**Fee rule at the choice** - Each method SHALL show the rule the fee schedule
in `grade10-admin/auction/payment-settings` holds for the order's currency and
that method, with money per `shared/money-amounts`:

| The rule | Reads |
| --- | --- |
| A percentage and a fixed amount | `3.4% + HK$2.35 processing fee` |
| A percentage, the fixed amount zero | `3.4% processing fee` |
| A fixed amount, the percentage zero | `HK$50.00 processing fee` |
| Both parts zero | `Free` |
| No rule | `Set on your invoice` |

The percentage SHALL show at most two decimal places, trailing zeros dropped.
The choice SHALL show no fee amount; the amount first shows on the sent
invoice.

**From Grade10** - The methods offered and each method's rule SHALL come to
Winner Order from Grade10 with the order, so a change to the fee schedule or
to the bank details Grade10 holds reaches the choice without a site release.

**Offered where Grade10 holds bank details** - Grade10 SHALL offer card in
every currency, and bank transfer only in a currency whose bank details it
holds:

| Where | Bank details Grade10 holds |
| --- | --- |
| Outside production | A sample HKD account |
| Production | The HKD account Finance confirms; none until then |

**Refused** - Grade10 SHALL refuse a confirmation with no method chosen, and
SHALL refuse bank transfer where it is not offered. A refused confirmation
SHALL record none of the setup choices.

**Locked on confirmation** - Until the winner confirms, they SHALL be able to
change the method freely. Once they confirm, the method locks for the winner,
per "The delivery address locks when the invoice is sent".

#### Scenario: winner-order-SC-90 - The method is recorded with the address
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order in HKD Awaiting Setup, where Grade10 holds HKD
  bank details
- **WHEN** the winner confirms a delivery address and chooses bank transfer
- **THEN** the order records bank transfer as its payment method
- **AND** the order derives as Preparing Invoice

Scenario `winner-order-SC-91` keeps its title with its id. The title is
historical: each method shows the fee rule it is quoted from.

#### Scenario: winner-order-SC-91 - The choice shows a fee range and no bank transfer amount
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order in HKD Awaiting Setup, where Grade10 holds HKD
  bank details
- **AND** the fee schedule's HKD card rule is 3.4 per cent and 235 minor units,
  and its HKD bank transfer rule is 0 per cent and 0 minor units
- **WHEN** the winner reaches the payment method choice
- **THEN** card reads `3.4% + HK$2.35 processing fee`
- **AND** bank transfer reads `Free`
- **AND** neither method is selected

#### Scenario: winner-order-SC-92 - A currency with no bank details offers card only
**Serves:** Payment method - bank transfer only where bank details are set up

- **GIVEN** an auction order in USD Awaiting Setup
- **WHEN** the winner reaches the payment method choice
- **THEN** only card is offered
- **AND** a confirmation carrying bank transfer for that order is refused

#### Scenario: winner-order-SC-93 - The method can change until the winner confirms
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order in HKD Awaiting Setup, where Grade10 holds HKD
  bank details, on which the winner has chosen card and not yet confirmed
- **WHEN** the winner changes the choice to bank transfer and confirms the address
- **THEN** the order records bank transfer
- **AND** the order derives as Preparing Invoice

#### Scenario: winner-order-SC-94 - A confirmation with no method is refused
**Serves:** Payment method - card or bank transfer recorded with the address

- **GIVEN** an auction order in HKD Awaiting Setup
- **WHEN** the winner confirms a delivery address without choosing a method
- **THEN** Grade10 refuses the confirmation
- **AND** the order is still Awaiting Setup

#### Scenario: winner-order-SC-224 - A method with no rule reads Set on your invoice
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order in USD Awaiting Setup
- **AND** the fee schedule holds no USD card rule
- **WHEN** the winner reaches the payment method choice
- **THEN** card reads `Set on your invoice`

#### Scenario: winner-order-SC-225 - A rule with one part zero leaves that part out
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order in HKD Awaiting Setup, where Grade10 holds HKD
  bank details
- **AND** the fee schedule's HKD card rule is 3.4 per cent and 0 minor units,
  and its HKD bank transfer rule is 0 per cent and 5000 minor units
- **WHEN** the winner reaches the payment method choice
- **THEN** card reads `3.4% processing fee`
- **AND** bank transfer reads `HK$50.00 processing fee`

#### Scenario: winner-order-SC-226 - Production offers card only until Finance confirms the account
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order in HKD Awaiting Setup in production, where
  Grade10 holds no HKD bank details
- **WHEN** the winner reaches the payment method choice
- **THEN** only card is offered
- **AND** a confirmation carrying the home address and bank transfer is refused
- **AND** the order holds no delivery address and no method

### Requirement: The winner uploads payment proof once

The winner sends proof of a bank transfer in one upload, and Grade10 holds the
invoice while an operator checks it.

**Payment proof** - On an invoice sent for bank transfer whose status is
`pending`, the winner SHALL be able to send Grade10 proof of payment once:

1. Choose 1 to 3 files (**1** required). Each file SHALL be a PDF, PNG or JPG
   (JPEG) of at most **5 MB** (5,242,880 bytes), and the set SHALL total at
   most **15 MB** (15,728,640 bytes). A HEIC or HEIF photo SHALL be converted
   to JPEG on the winner's device before it is sent, so an operator can open
   it without a special viewer.
2. Optionally enter the transaction reference the winner's bank gave the
   transfer.
3. Read a confirm step saying nothing can be added after upload.
4. Confirm.

**On confirm** - On confirm Grade10 SHALL store the files and the transaction
reference against the invoice, set the invoice status to `payment_verifying`,
stop the payment deadline and record the time left, per
`grade10-site/auction/order-status`, and write a proof-uploaded entry to the
invoice log. The order SHALL derive as Payment Verifying. No letter is sent.

**Payment Verifying** - While the invoice is `payment_verifying`, Winner Order
SHALL show no payment deadline running, SHALL offer no card Pay and no upload,
and SHALL refuse a further upload.

**Refused** - Grade10 SHALL refuse the whole upload and store nothing when any
file breaks step 1. It SHALL judge a file's type by its content, not its name:
a file whose content is HEIC, HEIF or any type but PDF, PNG and JPEG SHALL be
refused with a message naming the types Grade10 takes, and SHALL never be
relabelled. Grade10 SHALL refuse a confirm with no file, and SHALL refuse an
upload on a card invoice, on any invoice not `pending`, and from anyone but
the order's winner.

**Nothing stored until it succeeds** - Leaving the confirm step without
confirming SHALL store nothing. An upload that fails part-way SHALL store
nothing against the invoice and leave it `pending`, and the winner may upload
again; a file sent before the failure SHALL be deleted after a day. The one
upload counts only once an upload succeeds.

**Who reads the files** - Payment proof files and the transaction reference
SHALL be readable by any operator who can open the order, per
`grade10-admin/auction/post-sale`, and never by the winner. Winner Order, the
receipt and every letter SHALL show no payment proof file or its name, the
winner's or an operator's, and no transaction reference. Only the Payment
Verifying status shows that proof was sent.

#### Scenario: winner-order-SC-99 - Uploading proof stops the deadline
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** a bank transfer invoice, `pending`, with a payment deadline of 2026-09-19T09:00:00Z
- **WHEN** the winner uploads two PDF files and confirms at 2026-09-13T09:00:00Z
- **THEN** the invoice is `payment_verifying` and the order derives as Payment Verifying
- **AND** the time left recorded is 6 days
- **AND** Winner Order offers no card Pay and no further upload

#### Scenario: winner-order-SC-100 - Files outside the limits are refused
**Serves:** Bank transfer - one upload of 1 to 3 files

- **GIVEN** a bank transfer invoice that is `pending`
- **WHEN** the winner confirms four files, or a PNG with a JPEG of 5,242,881 bytes, or a PDF with a GIF, or a set over 15 MB
- **THEN** Grade10 refuses each whole upload
- **AND** stores no file
- **AND** the invoice is still `pending`

#### Scenario: winner-order-SC-101 - A second upload is refused
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an invoice that is `payment_verifying`
- **WHEN** an upload is attempted against it
- **THEN** Grade10 refuses it
- **AND** the files already stored are unchanged

#### Scenario: winner-order-SC-102 - Leaving the confirm step uploads nothing
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** a bank transfer invoice that is `pending`
- **WHEN** the winner chooses one PNG, reads the confirm step, and leaves without confirming
- **THEN** no file is stored
- **AND** the invoice is still `pending` and the winner can upload

#### Scenario: winner-order-SC-103 - No upload on an expired or card invoice
**Serves:** Bank transfer - proof is uploaded only on a pending bank transfer invoice

- **GIVEN** one bank transfer invoice that is `expired` and one card invoice that is `pending`
- **WHEN** an upload is attempted against each
- **THEN** Grade10 refuses both
- **AND** neither invoice changes status

#### Scenario: winner-order-SC-115 - The winner never sees proof files
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order whose winner uploaded "transfer-slip.pdf", which an operator confirmed after adding a bank statement
- **WHEN** the winner opens Winner Order and the receipt, and requests either stored file
- **THEN** neither file nor its name is shown
- **AND** Grade10 refuses both requests

#### Scenario: winner-order-SC-116 - A file of exactly 5 MB is accepted
**Serves:** Bank transfer - one upload of 1 to 3 files

- **GIVEN** a bank transfer invoice that is `pending`
- **WHEN** the winner uploads one PDF of 5,242,880 bytes and confirms
- **THEN** the invoice is `payment_verifying`

#### Scenario: winner-order-SC-117 - A card payment while proof is checked is refused
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an invoice that is `payment_verifying`
- **WHEN** the winner tries to start a card payment for it
- **THEN** Grade10 starts none and makes no charge
- **AND** the invoice is still `payment_verifying`

#### Scenario: winner-order-SC-118 - No upload before send or after payment
**Serves:** Bank transfer - proof is uploaded only on a pending bank transfer invoice

- **GIVEN** one order in Preparing Invoice with bank transfer chosen, and one whose bank transfer invoice is `paid`
- **WHEN** the winner opens each, and an upload is attempted against each
- **THEN** neither offers an upload
- **AND** Grade10 refuses both attempts

#### Scenario: winner-order-SC-119 - An upload that fails part-way stores nothing
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** a bank transfer invoice that is `pending`
- **WHEN** the winner confirms three files and the upload fails before it completes
- **THEN** no file is stored and the invoice is still `pending`
- **AND** the winner can upload again

#### Scenario: winner-order-SC-121 - Another collector cannot upload proof
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order whose bank transfer invoice is `pending`, won by another collector
- **WHEN** a signed-in collector who is not its winner attempts an upload against it
- **THEN** Grade10 refuses it
- **AND** the invoice is still `pending`

#### Scenario: winner-order-SC-227 - A HEIC photo is sent as a JPEG
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** a bank transfer invoice that is `pending`
- **WHEN** the winner chooses a HEIC photo from their phone and confirms
- **THEN** the file Grade10 stores is a JPEG
- **AND** the invoice is `payment_verifying`

#### Scenario: winner-order-SC-228 - HEIC sent as it is is refused
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** a bank transfer invoice that is `pending`
- **WHEN** an upload carries an unconverted HEIC photo named `slip.jpg`
- **THEN** Grade10 refuses it, naming PDF, PNG and JPEG as the types it takes
- **AND** stores no file
- **AND** the invoice is still `pending`

#### Scenario: winner-order-SC-229 - The transaction reference reaches the operator only
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** a bank transfer invoice that is `pending`
- **WHEN** the winner uploads one PDF with the transaction reference
  `FT26091300042` and confirms
- **THEN** the invoice is `payment_verifying`
- **AND** an operator checking the proof reads `FT26091300042` with the file
- **AND** Winner Order shows no transaction reference

### Requirement: The ready email names the invoice or the lot and the reason

The ready email's subject and body identify the order and its status so
support can open it without a follow-up.

**Subject** — When the order has a current invoice id, the subject SHALL be
`Auction order {invoice id}: {reason}`. Before an invoice is sent, the subject
SHALL be `Auction lot {lot title}: {reason}`.

**Reason** — The reason SHALL be the order's status as Winner Order shows it,
per `grade10-site/auction/order-status`, in lower case - for example
`preparing invoice`, `payment overdue` or `partially paid`.

**Body** — Message SHALL greet Grade10, say the winner needs help with this
auction order, name the lot title and the order's status, and leave space for
the winner's question. When the order has a current invoice id, the body SHALL
name it.

**Partial payment** — When the order is Partially Paid, the body MAY list
receipt ids and MUST NOT name the remaining balance. When no receipt id exists
yet, the body SHALL list none.

#### Scenario: winner-order-SC-164 - Setup overdue names the lot, not an invoice
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** an auction order whose setup deadline has passed with no invoice
  issued, for lot title "Charizard Base Set PSA 10"
- **WHEN** the winner opens Contact Us
- **THEN** Subject is `Auction lot Charizard Base Set PSA 10: setup overdue`
- **AND** Message names that lot title and status Setup overdue
- **AND** Message names no invoice id

#### Scenario: winner-order-SC-165 - Payment overdue names the invoice
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** an auction order whose payment deadline has passed unpaid, with
  current invoice id `IN-LK42301` and lot title "Charizard Base Set PSA 10"
- **WHEN** the winner opens Contact Us
- **THEN** Subject is `Auction order IN-LK42301: payment overdue`
- **AND** Message names that invoice id, that lot title, and status Payment
  overdue

#### Scenario: winner-order-SC-166 - Partial payment may list receipts and never the balance
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** a partially paid auction order with current invoice id
  `IN-LK42301`, lot title "Charizard Base Set PSA 10", and two receipts
- **WHEN** the winner opens Contact Us
- **THEN** Subject is `Auction order IN-LK42301: partially paid`
- **AND** Message may list their receipt ids
- **AND** Message names no remaining balance

#### Scenario: winner-order-SC-168 - A reissued invoice uses the current invoice id
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** an auction order whose payment deadline has passed unpaid after a
  reissue, with current invoice id `IN-LK42302` and a replaced invoice id
  `IN-LK42301`
- **WHEN** the winner opens Contact Us
- **THEN** Subject is `Auction order IN-LK42302: payment overdue`
- **AND** Subject does not name `IN-LK42301`

#### Scenario: winner-order-SC-230 - Payment Verifying names its status
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** an auction order in Payment Verifying, with current invoice id
  `IN-LK42301` and lot title "Charizard Base Set PSA 10"
- **WHEN** the winner opens Contact Us
- **THEN** Subject is `Auction order IN-LK42301: payment verifying`
- **AND** Message names that invoice id, that lot title, and status Payment
  Verifying

### Requirement: The bid-time hold is released, never captured

When a bid-time authorization exists, Grade10 SHALL release it on every bidder
of a closing lot, winner and losing bidders alike, and SHALL NOT leave a losing
bidder's authorization to expire on its own.

Grade10 SHALL NOT capture or increment a bid-time authorization as any part
of settlement. The winner SHALL pay by the method the invoice was sent for:

| Invoice method | How the winner pays |
| --- | --- |
| Card | A single new card transaction for the order total, against a stored card or another card they enter |
| Bank transfer | A transfer they make themselves, then proof uploaded per "The winner uploads payment proof once" |

Cash and every other method are recorded by an operator alone, per
`grade10-admin/auction/post-sale`.

Releasing an authorization that has already expired SHALL succeed as a
no-op. Grade10 SHALL NOT treat an expired authorization as a failure.

A refused or failed card payment SHALL NOT void the invoice. While a card
invoice's status is `pending`, it SHALL remain payable by card and the winner
SHALL be able to retry with the same or a different card. The primary pay
control SHALL read **Pay with Card**. When the invoice status is `expired` or
`payment_verifying`, Grade10 SHALL NOT offer or start winner card payment; one
that completes anyway is recorded per "Money that lands is always recorded" in
`grade10-admin/auction/post-sale`.

#### Scenario: winner-order-SC-12 - The winning hold is released and the invoice is a fresh charge
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a winner holding an open bid-time authorization on the closing lot
- **WHEN** the lot closes
- **THEN** Grade10 releases that authorization at close without capturing it
- **AND** after an operator later sends a card invoice, the winner's payment is a
  single new transaction for the order total

#### Scenario: winner-order-SC-13 - An expired hold releases as a no-op
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a winner whose bid-time authorization expired before the lot closed
- **WHEN** the lot closes
- **THEN** Grade10 records the release as successful
- **AND** creates the auction order as normal

#### Scenario: winner-order-SC-14 - A losing bidder's hold is released at close
**Serves:** winner-order-US-01 - the lot close that opens the winner's order also frees every losing hold

- **GIVEN** a lot closing with one winner and three losing bidders holding
  open authorizations
- **WHEN** the lot closes
- **THEN** Grade10 releases all three losing authorizations
- **AND** does not wait for them to expire

#### Scenario: winner-order-SC-15 - A declined payment leaves the invoice payable
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an unpaid card invoice inside its payment deadline
- **WHEN** the winner's payment is declined
- **THEN** the invoice status remains `pending`
- **AND** the winner can retry with the same or a different card

#### Scenario: winner-order-SC-35 - The winner is offered card payment only
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice was sent for card and is `pending`
- **WHEN** the winner opens the order to pay
- **THEN** Grade10 offers Pay with Card
- **AND** shows no bank transfer details, no proof upload, and no cash or other method

### Requirement: The payment deadline is fixed when the invoice is sent

The payment deadline SHALL be 7 calendar days from the moment an operator
sends the invoice. Grade10 SHALL fix it at send, store it in UTC, and display
it in the winner's own timezone on both the invoice and the auction order, per
`shared/dates-and-times`.

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
invoice status to `expired`, per `grade10-site/auction/order-status`. The
order reads Payment Overdue. The winner SHALL NOT be offered card payment or
proof upload while the invoice is `expired`; the Next step panel SHALL say the
payment deadline has passed and offer Contact Us, per "Winner Order leads with
the next step". An operator SHALL restore self-service payment only by
reissuing the invoice to `pending`, or SHALL settle manually or cancel, per
`grade10-admin/auction/post-sale`.

#### Scenario: winner-order-SC-31 - The deadline is seven days from send
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice an operator sent at
  2026-09-12T09:00:00Z
- **WHEN** the winner reads the invoice
- **THEN** the payment deadline is 2026-09-19T09:00:00Z
- **AND** it is displayed in the winner's own timezone as an absolute datetime
- **AND** no countdown is shown

#### Scenario: winner-order-SC-33 - A declined payment does not move the deadline
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose sent invoice has a payment deadline of
  2026-09-19T09:00:00Z
- **WHEN** the winner's card is declined twice
- **THEN** the payment deadline is still 2026-09-19T09:00:00Z

#### Scenario: winner-order-SC-37 - An expired invoice refuses card payment
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice status is `expired`
- **WHEN** the winner opens the order
- **THEN** Grade10 offers no card Pay control
- **AND** the Next step panel says the payment deadline has passed and offers
  Contact Us
- **AND** a card payment the winner tries to start for it does not start

#### Scenario: winner-order-SC-107 - A deadline that passes while proof is checked expires nothing
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an invoice that became `payment_verifying` at 2026-09-13T09:00:00Z with a deadline of 2026-09-19T09:00:00Z
- **WHEN** 2026-09-20T09:00:00Z arrives with no operator action
- **THEN** the invoice is still `payment_verifying`
- **AND** the order derives as Payment Verifying

### Requirement: The address confirm window is 48 hours from lot close

The winner SHALL have 48 hours from lot close to confirm a delivery address on
the auction order. Grade10 SHALL show the absolute datetime under Confirm
delivery address while the window is open (`Confirm by …` in the winner's
zone). Progress Address subtext SHALL use the day-only form (`Confirm by …`
without time).

When the window passes without a confirmed address, Winner Order SHALL hide
Confirm delivery address, and its Next step panel SHALL read `Missed address
deadline: {date}` (day-only, no middle-dot separator) and offer Contact Us, per
"Winner Order leads with the next step".
Derived order status SHALL be Setup Overdue. Invoice status SHALL remain
`not_issued` and SHALL NOT become `expired`. Grade10 SHALL NOT cancel the order
or suspend bidding solely because the address window passed; an operator
follows up per `grade10-admin/auction/post-sale`.

#### Scenario: winner-order-SC-32 - An unpaid address wait never expires the invoice
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose winner has confirmed no delivery address
  30 days after its lot closed
- **WHEN** its derived status is read
- **THEN** it is Setup Overdue
- **AND** its invoice status is `not_issued`, never `expired`

#### Scenario: winner-order-SC-70 - Address confirm is due 48 hours after lot close
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a lot that closed at 2026-09-17T13:30:00Z
- **AND** its auction order is Awaiting Setup inside the confirm window
- **WHEN** the winner opens Winner Order
- **THEN** Confirm delivery address is offered
- **AND** the confirm deadline shown under the control is 2026-09-19T13:30:00Z
  displayed in the winner's zone as an absolute datetime
- **AND** no countdown is shown

#### Scenario: winner-order-SC-71 - A missed address deadline hides Confirm
**Serves:** winner-order-US-07 - Winner misses the address deadline

- **GIVEN** an auction order still Awaiting Setup whose address confirm
  window has passed
- **WHEN** the winner opens Winner Order
- **THEN** Grade10 offers no Confirm delivery address control
- **AND** the Next step panel reads Missed address deadline with the day-only
  date and offers Contact Us
- **AND** derived status is Setup Overdue
- **AND** invoice status remains `not_issued`

### Requirement: Returned proof reopens the invoice

When an operator sends proof back, the winner reads why, the deadline runs
again, and they upload again.

**Proof not accepted** - When an operator returns a `payment_verifying`
invoice to `pending`, per `grade10-admin/auction/post-sale`, Winner Order
SHALL show the operator's latest external reason and the new payment deadline,
which is the moment of return plus the time left at upload. No grace is added,
however little time was left.

**Upload again** - The winner SHALL then be able to upload proof again, under
the same rules as the first upload.

**Internal reason** - The operator's internal reason SHALL NOT be shown to the
winner.

**Latest reason only** - After a second return Winner Order SHALL show only
the latest external reason; the invoice log keeps every reason, per
`grade10-admin/auction/post-sale`.

#### Scenario: winner-order-SC-104 - A returned invoice shows the reason and the time that was left
**Serves:** winner-order-US-10 - Winner's payment proof is not accepted

- **GIVEN** a bank transfer invoice the winner uploaded proof for at 2026-09-13T09:00:00Z, with a deadline of 2026-09-19T09:00:00Z
- **WHEN** an operator returns it at 2026-09-16T09:00:00Z with the external reason "Amount does not match" and an internal reason
- **THEN** the invoice is `pending` with a payment deadline of 2026-09-22T09:00:00Z
- **AND** Winner Order shows "Amount does not match"
- **AND** Winner Order does not show the internal reason

#### Scenario: winner-order-SC-105 - A returned invoice accepts a new upload
**Serves:** winner-order-US-10 - Winner's payment proof is not accepted

- **GIVEN** a bank transfer invoice an operator returned to `pending`
- **WHEN** the winner uploads one PDF and confirms
- **THEN** the invoice is `payment_verifying`
- **AND** the deadline stops again with the time left recorded

#### Scenario: winner-order-SC-120 - A return adds no grace
**Serves:** winner-order-US-10 - Winner's payment proof is not accepted

- **GIVEN** a bank transfer invoice that became `payment_verifying` with 1 minute left
- **WHEN** an operator returns it at 2026-09-16T09:00:00Z and 2026-09-16T09:01:00Z passes unpaid
- **THEN** the invoice is `expired` and the order reads Payment Overdue
- **AND** Winner Order offers no upload, and its Next step panel says the payment deadline has passed and offers Contact Us

#### Scenario: winner-order-SC-134 - Only the latest return reason is shown
**Serves:** winner-order-US-10 - Winner's payment proof is not accepted

- **GIVEN** a bank transfer invoice an operator returned with the external reason "Amount does not match", then returned again with "Reference missing" after a second upload
- **WHEN** the winner opens Winner Order
- **THEN** it shows "Reference missing"
- **AND** it does not show "Amount does not match"
- **AND** the invoice log holds both reasons

### Requirement: Contact Us opens a copy-first ready email

When the winner chooses Contact Us on Winner Order, they reach Grade10
through a ready email they can copy into any mail app.

**Opens** — Contact Us SHALL open a dialog. It SHALL NOT open a mail client
as the first action, and SHALL NOT show only a toast that names the address.

**Hidden until open** — `support@grade10.com` SHALL NOT appear on the order
page before Contact Us opens the dialog.

**Ready email** — The open dialog SHALL show, in order:

1. To — `support@grade10.com`, not editable by the winner, with copy in place
2. Subject — the ready subject for this order and reason, not editable by the
   winner, with copy in place
3. Message — an editable `Textarea` prefilled with the ready body and space
   for the winner's question. No copy control SHALL sit beside the Message
   field; Copy Message stays footer-only

**Footer** — The dialog footer SHALL offer, in order:

1. Copy Message first — copies the full ready email (To, Subject and
   Message) for pasting into any mail app
2. Open Mail App second — optional; opens a `mailto:` to
   `support@grade10.com` carrying the current Subject and Message

**Export** — The design system SHALL export `Textarea` as a labelled
multi-line field that shares TextInput's label, status and message contract.

#### Scenario: winner-order-SC-160 - Contact Us opens the copy-first dialog
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** an auction order whose payment or setup self-service has closed,
  with Contact Us in its Next step panel
- **WHEN** the winner chooses Contact Us
- **THEN** a dialog opens showing To `support@grade10.com`, Subject and
  Message
- **AND** Copy Message is the first footer action
- **AND** Open Mail App is the second footer action
- **AND** no mail client opens as the first action

#### Scenario: winner-order-SC-161 - The support address stays off the order until Contact Us
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** an auction order with Contact Us in its Next step panel
- **WHEN** the winner reads Winner Order before choosing Contact Us
- **THEN** `support@grade10.com` does not appear on the order page
- **AND** after Contact Us opens the dialog, To shows `support@grade10.com`

#### Scenario: winner-order-SC-162 - Message is an editable Textarea and Copy Message stays footer-only
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** the Contact Us dialog is open on a locked Winner Order
- **WHEN** the winner edits Message and chooses Copy Message
- **THEN** Message is an editable `Textarea`
- **AND** no copy control sits beside the Message field
- **AND** Copy Message copies To, Subject and the current Message together

#### Scenario: winner-order-SC-163 - Open Mail App carries the current subject and body
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** the Contact Us dialog is open with Subject and Message filled
- **WHEN** the winner chooses Open Mail App
- **THEN** a `mailto:` to `support@grade10.com` opens with that Subject and
  Message

#### Scenario: winner-order-SC-167 - To and Subject copy in place and stay fixed
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** the Contact Us dialog is open on a locked Winner Order
- **WHEN** the winner uses the To and Subject copy controls
- **THEN** each control copies only that field's value
- **AND** the winner cannot edit To or Subject
- **AND** Copy Message remains the footer control for the full ready email

## ADDED Requirements

### Requirement: Setup ends on a review that locks it

Setup is one flow that ends on a review, and confirming records every choice
together.

**Flow** - While an auction order is Awaiting Setup, Winner Order SHALL take
the winner through setup in this order:

1. Choose a delivery address, per "The delivery address is confirmed before
   payment".
2. Choose card or bank transfer, per "The winner chooses a payment method with
   the address".
3. Choose a billing address - the delivery address unless the winner chooses
   another, per "The address form refuses empty required fields".
4. Review the three choices, each with a way back to change it. The review
   SHALL say they lock once confirmed and only Grade10 can change them after.
5. Confirm.

**Together** - Confirming SHALL record the delivery address, the billing
address and the payment method together, and the order derives as Preparing
Invoice. Leaving setup before confirming, from any step, SHALL record none of
them; closing it with a choice made SHALL ask the winner first.

**Locked after** - Once confirmed, Winner Order SHALL show the three choices
with Contact Us and no control to change them, per "The delivery address
locks when the invoice is sent".

#### Scenario: winner-order-SC-231 - The review shows the three choices and says they lock
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order in HKD Awaiting Setup on which the winner has
  chosen the home address, bank transfer, and billing the same as delivery
- **WHEN** the winner reaches the review
- **THEN** it shows the home address for delivery and for billing, and bank
  transfer
- **AND** it says they lock once confirmed and only Grade10 can change them
  after
- **AND** the order is still Awaiting Setup

#### Scenario: winner-order-SC-232 - Leaving setup records none of the choices
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order in HKD Awaiting Setup on which the winner has
  chosen the home address and bank transfer, and reached the review
- **WHEN** the winner closes setup without confirming
- **THEN** Winner Order asks before closing
- **AND** once they leave, the order is still Awaiting Setup with no delivery
  address, billing address or method recorded

### Requirement: Winner Order leads with the next step

Every auction order opens on one panel that says what happens next.

**Where** - Winner Order SHALL open on a Next step panel in every order
status, above the Order Summary. Pay with Card, and the bank transfer
controls "A bank transfer invoice shows how to pay" places, SHALL stay in the
Order Summary, never in the panel. The progress steps, per "Winner Order shows
five progress steps", and the order's other sections follow.

**What it says** - The panel SHALL say what Grade10 is doing, the deadline the
winner is held to where one applies, and what the winner does next, with
dates per `shared/dates-and-times`. It SHALL offer Contact Us, per "Contact Us
opens a copy-first ready email", in every status.

| Order status | The panel says |
| --- | --- |
| Awaiting Setup | Choose the delivery address, payment method and billing address, by the setup deadline |
| Setup Overdue | The missed deadline, per "The address confirm window is 48 hours from lot close" |
| Preparing Invoice | Grade10 is preparing the invoice, and the 7 days to pay start when it arrives |
| Pending Payment, card | Pay the order total by card, by the payment deadline |
| Pending Payment, bank transfer | Transfer the order total quoting the bank reference, then send proof, by the payment deadline |
| Pending Payment, proof returned | The reason Grade10 gave and the new payment deadline, per "Returned proof reopens the invoice" |
| Payment Verifying | Grade10 is checking the transfer, and the deadline is paused |
| Payment Overdue | The payment deadline has passed, per "The payment deadline is fixed when the invoice is sent" |
| Partially Paid | Part of the order is paid, and Grade10 will contact the winner about the rest |
| Processing | Grade10 is preparing the shipment |
| Shipped | The carrier and the tracking number |
| Delivered | The day it was delivered |
| Cancelled | The day it was cancelled |
| Refunded | The order was refunded |

**Its controls** - Beside Contact Us, the panel SHALL hold only Complete Order
Setup while Awaiting Setup, per "The address confirm window is 48 hours from
lot close", Track shipment while Shipped, and View refund details while
Refunded, per "Winner Order renders a refunded order as a retained record".

**Waiting on the invoice** - In Preparing Invoice the panel SHALL name no date
or time for the invoice.

**Overdue** - In Setup Overdue and Payment Overdue the panel SHALL carry the
overdue message and Contact Us, and the order SHALL show no separate overdue
alert.

**Never shown** - The panel SHALL name no balance, no payment proof file and
no internal note, and Partially Paid SHALL name no amount and no deadline. A
suspension keeps its own notice, per `grade10-site/auction/bidder-suspension`.

**Announced** - The panel SHALL be a labelled section whose changes are
announced politely, never as an alert.

#### Scenario: winner-order-SC-233 - Preparing Invoice promises no time for the invoice
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order in Preparing Invoice
- **WHEN** the winner opens it
- **THEN** the Next step panel sits above the Order Summary
- **AND** it says Grade10 is preparing the invoice and the 7 days to pay start
  when it arrives
- **AND** it names no date or time for the invoice
- **AND** it offers Contact Us

#### Scenario: winner-order-SC-234 - Pending Payment names the total and the deadline
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order in Pending Payment whose card invoice has an order
  total of 323225 minor units in HKD and a payment deadline of
  2026-10-06T10:00:00Z
- **AND** the winner's zone is Hong Kong
- **WHEN** the winner opens it
- **THEN** the Next step panel says to pay HK$3,232.25 by card by 6 October
  2026, 18:00 Hong Kong time
- **AND** Pay with Card sits in the Order Summary, not in the panel

#### Scenario: winner-order-SC-235 - Every status opens on the panel with Contact Us
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** one auction order in each order status
- **WHEN** the winner opens each
- **THEN** each opens on the Next step panel, above the Order Summary
- **AND** each panel offers Contact Us
- **AND** no panel names a balance, a payment proof file or an internal note

### Requirement: Returning from a card payment confirms it

A winner back from a completed card payment reads the result at once.

**On return** - When the winner returns to Winner Order from a completed
hosted card payment, Grade10 SHALL check that payment with the payment
provider and record it then, without waiting for the provider's notice.
Winner Order SHALL read Confirming payment while it checks, then the order's
status. It SHALL check once per return and SHALL NOT poll.

**Recorded once** - A payment recorded on return and again on the provider's
notice SHALL be recorded once, with one receipt.

**The winner's own order** - A return naming a payment made for an order the
signed-in winner does not hold SHALL be refused as if that order did not
exist, and SHALL record nothing.

#### Scenario: winner-order-SC-236 - A completed card payment is recorded on return
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order in Pending Payment whose card invoice has an order
  total of 323225 minor units in HKD
- **WHEN** the winner completes the hosted card payment and returns before
  Grade10 has the provider's notice
- **THEN** Winner Order reads Confirming payment while Grade10 checks the
  payment
- **AND** the order then reads Processing, with a receipt for 323225 minor
  units in HKD

#### Scenario: winner-order-SC-237 - The provider's later notice records nothing twice
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a card payment Grade10 recorded when the winner returned
- **WHEN** the provider's notice for the same payment arrives
- **THEN** the order holds one payment and one receipt
- **AND** it still reads Processing

#### Scenario: winner-order-SC-238 - A return naming another order's payment is refused
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a signed-in winner, and a completed card payment made for an order
  another collector holds
- **WHEN** the winner's return names that payment
- **THEN** Grade10 refuses it as if that order did not exist
- **AND** records nothing on either order
