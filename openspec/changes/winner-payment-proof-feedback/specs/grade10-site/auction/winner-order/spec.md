## Feature set

- Bank transfer
  - Payment proof: one upload of 1 to 3 files (1 required) in Submit Payment Proof, behind inline irreversible microcopy; on success toast **Proof submitted** / **We'll verify your payment shortly.** and Payment Verifying; on a failed upload the dialog stays open with the draft and toast **Proof not submitted** / **Nothing was saved. Try again.**; while submitting or converting HEIC the form locks and leave is blocked
  - Payment Verifying: the deadline stops, Submit Payment Proof, View Bank Details and further uploads are hidden

## MODIFIED Requirements

### Requirement: The winner uploads payment proof once

The winner sends proof of a bank transfer in one upload, and Grade10 holds the
invoice while an operator checks it.

**Payment proof** - On an invoice sent for bank transfer whose status is
`pending`, the winner SHALL be able to send Grade10 proof of payment once:

1. Choose 1 to 3 files (**1** required). Each file SHALL be a PDF, PNG, JPG
   (JPEG), or HEIC/HEIF of at most **5 MB** (5,242,880 bytes). The set SHALL
   total at most **15 MB** (15,728,640 bytes). HEIC/HEIF SHALL be converted to
   JPEG before storage so an operator can open it without a special viewer.
2. Read irreversible microcopy saying nothing can be added or changed after
   submit (inline in Submit Payment Proof — no second confirm screen).
3. Confirm submit.

**On confirm** - On a successful confirm Grade10 SHALL store the files against
the invoice, set the invoice status to `payment_verifying`, stop the payment
deadline and record the time left, per `grade10-site/auction/order-status`,
and write a proof-uploaded entry to the invoice log. The order SHALL derive as
Payment Verifying. Winner Order SHALL show a success toast titled **Proof
submitted** with description **We'll verify your payment shortly.** No letter
is sent.

**Payment Verifying** - While the invoice is `payment_verifying`, Winner Order
SHALL show no payment deadline running, SHALL offer no card Pay and no upload,
SHALL hide Submit Payment Proof and View Bank Details, and SHALL refuse a
further upload.

**Busy** - While the upload is submitting, or while HEIC/HEIF is converting,
Submit Payment Proof SHALL lock the whole form and SHALL block leave (Cancel,
Escape and overlay dismiss do nothing) until that beat finishes.

**Refused** - Grade10 SHALL refuse the whole upload and store nothing when any
file breaks step 1. It SHALL judge a file's type by its content, not its name:
a file whose content is not PDF, PNG, JPEG, HEIC or HEIF SHALL be refused and
never relabelled. Grade10 SHALL refuse a confirm with no file, and SHALL refuse an
upload on a card invoice, on any invoice not `pending`, and from anyone but
the order's winner.

**Nothing stored until it succeeds** - Leaving Submit Payment Proof without a
successful confirm SHALL store nothing. An upload that fails part-way SHALL
store nothing, leave the invoice `pending`, keep Submit Payment Proof open with
the draft the winner had entered, and show an error toast titled **Proof not
submitted** with description **Nothing was saved. Try again.**; the winner may
upload again; a file sent before the failure SHALL be deleted after a day. The
one upload counts only once an upload succeeds.

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
- **AND** Submit Payment Proof and View Bank Details are hidden

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
- **WHEN** the winner chooses one PNG, reads the irreversible microcopy, and leaves without confirming
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

- **GIVEN** a bank transfer invoice that is `pending` and Submit Payment Proof open with a filled draft
- **WHEN** the winner confirms three files and the upload fails before it completes
- **THEN** no file is stored and the invoice is still `pending`
- **AND** Submit Payment Proof stays open with the draft
- **AND** an error toast reads **Proof not submitted** / **Nothing was saved. Try again.**
- **AND** the winner can upload again

#### Scenario: winner-order-SC-121 - Another collector cannot upload proof
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order whose bank transfer invoice is `pending`, won by another collector
- **WHEN** a signed-in collector who is not its winner attempts an upload against it
- **THEN** Grade10 refuses it
- **AND** the invoice is still `pending`

#### Scenario: winner-order-SC-218 - Successful proof submit shows the success toast
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** a bank transfer invoice that is `pending`
- **WHEN** the winner confirms a valid proof upload
- **THEN** the invoice is `payment_verifying` and the order derives as Payment Verifying
- **AND** a success toast reads **Proof submitted** / **We'll verify your payment shortly.**

#### Scenario: winner-order-SC-219 - Leave is blocked while submitting or converting
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** Submit Payment Proof is open and either the upload is submitting or HEIC conversion is running
- **WHEN** the winner tries Cancel, Escape or overlay dismiss
- **THEN** the dialog stays open
- **AND** the form stays locked until that beat finishes

#### Scenario: winner-order-SC-220 - Confirm stays inline microcopy
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** a bank transfer invoice that is `pending`
- **WHEN** the winner opens Submit Payment Proof
- **THEN** irreversible microcopy says nothing can be added or changed after submit
- **AND** no second confirm screen is shown

#### Scenario: winner-order-SC-239 - A file whose content is not a type Grade10 takes is refused
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** a bank transfer invoice that is `pending`
- **WHEN** an upload carries a GIF file named `slip.jpg`
- **THEN** Grade10 refuses the whole upload and stores no file
- **AND** the invoice is still `pending`

