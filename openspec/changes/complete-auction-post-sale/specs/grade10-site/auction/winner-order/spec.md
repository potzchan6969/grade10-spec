## Feature set

- Payment method
  - Offered where Grade10 holds bank details: card in every currency, bank transfer only in a currency whose bank details Grade10 holds - a sample HKD account outside production, and in production the account Finance confirms
- Bank transfer
  - Proof judged by its content: a file whose bytes are not a type Grade10 takes is refused, whatever its name
- Card payment
  - No start once closed: no card payment starts on an expired or checked invoice, and one that completes anyway is recorded

## MODIFIED Requirements

### Requirement: The winner chooses a payment method with the address

The winner picks card or bank transfer at the same time as the delivery
address, and the pick locks with it.

**Chosen with the address** - When the winner confirms a delivery address on
an auction order, Winner Order SHALL also ask how they will pay:

1. Choose card or bank transfer.
2. Read the fee range Grade10 sets for each method.
3. Confirm the address and the method together.

**No preselection** - Grade10 SHALL preselect neither method and SHALL record
the chosen method on the order.

**Fee range at the choice** - The fee range for each method SHALL be fixed
text Grade10 sets; its wording is TBC. The bank transfer text SHALL name no
amount, since an operator sets that fee on the invoice.

**Offered where Grade10 holds bank details** - Grade10 SHALL offer card in
every currency, and bank transfer only in a currency whose bank details it
holds:

| Where | Bank details Grade10 holds |
| --- | --- |
| Outside production | A sample HKD account |
| Production | The HKD account Finance confirms; none until then |

**Refused** - Grade10 SHALL refuse a confirmation with no method chosen, and
SHALL refuse bank transfer where it is not offered. A refused confirmation
SHALL record neither the address nor the method.

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

#### Scenario: winner-order-SC-91 - The choice shows a fee range and no bank transfer amount
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order in HKD Awaiting Setup
- **WHEN** the winner reaches the payment method choice
- **THEN** card and bank transfer each show the fee range text Grade10 set
- **AND** the bank transfer text names no amount
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

1. Choose 1 to 3 files (**1** required). Each file SHALL be a PDF, PNG, JPG
   (JPEG), or HEIC/HEIF of at most **5 MB** (5,242,880 bytes). The set SHALL
   total at most **15 MB** (15,728,640 bytes). HEIC/HEIF SHALL be converted to
   JPEG before storage so an operator can open it without a special viewer.
2. Read a confirm step saying nothing can be added after upload.
3. Confirm.

**On confirm** - On confirm Grade10 SHALL store the files against the
invoice, set the invoice status to `payment_verifying`, stop the payment
deadline and record the time left, per `grade10-site/auction/order-status`,
and write a proof-uploaded entry to the invoice log. The order SHALL derive as
Payment Verifying. No letter is sent.

**Payment Verifying** - While the invoice is `payment_verifying`, Winner Order
SHALL show no payment deadline running, SHALL offer no card Pay and no upload,
and SHALL refuse a further upload.

**Refused** - Grade10 SHALL refuse the whole upload and store nothing when any
file breaks step 1. It SHALL judge a file's type by its content, not its name:
a file whose content is not PDF, PNG, JPEG, HEIC or HEIF SHALL be refused and
never relabelled. Grade10 SHALL refuse a confirm with no file, and SHALL refuse an
upload on a card invoice, on any invoice not `pending`, and from anyone but
the order's winner.

**Nothing stored until it succeeds** - Leaving the confirm step without
confirming SHALL store nothing. An upload that fails part-way SHALL store
nothing against the invoice and leave it `pending`, and the winner may upload
again; a file sent before the failure SHALL be deleted after a day. The one
upload counts only once an upload succeeds.

**Who reads the files** - Payment proof files SHALL be readable by any operator
who can open the order, per `grade10-admin/auction/post-sale`, and never by the
winner. Winner Order, the receipt and every letter SHALL show no payment proof
file and no file name, the winner's or an operator's. Only the Payment Verifying
status shows that proof was sent.

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

#### Scenario: winner-order-SC-239 - A file whose content is not a type Grade10 takes is refused
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** a bank transfer invoice that is `pending`
- **WHEN** an upload carries a GIF file named `slip.jpg`
- **THEN** Grade10 refuses the whole upload and stores no file
- **AND** the invoice is still `pending`

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
