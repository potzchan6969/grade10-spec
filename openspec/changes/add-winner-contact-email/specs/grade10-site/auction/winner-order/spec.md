## Feature set

- Contact Us on locked orders
  - Copy-first ready email: Contact Us opens a dialog with To, Subject and Message; Copy Message is first, Open Mail App is second
  - Subject names invoice or lot: the order's current invoice id when one exists; lot title when setup is overdue and no invoice has been issued
  - Address hidden until open: `support@grade10.com` is not on the order page before Contact Us
  - Editable message field: Message is an editable Textarea with order facts prefilled and space for the winner's question; Copy Message stays footer-only
  - Partial payment body: receipt ids may be listed; the remaining balance stays off the mail

## ADDED Requirements

### Requirement: Contact Us opens a copy-first ready email

When Contact Us is offered on a locked Winner Order, the winner reaches
Grade10 through a ready email they can copy into any mail app.

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

- **GIVEN** an auction order whose payment or setup self-service has closed
  and whose overdue or partially paid alert offers Contact Us
- **WHEN** the winner chooses Contact Us
- **THEN** a dialog opens showing To `support@grade10.com`, Subject and
  Message
- **AND** Copy Message is the first footer action
- **AND** Open Mail App is the second footer action
- **AND** no mail client opens as the first action

#### Scenario: winner-order-SC-161 - The support address stays off the order until Contact Us
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** an auction order whose overdue or partially paid alert offers
  Contact Us
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

### Requirement: The ready email names the invoice or the lot and the reason

The ready email's subject and body identify the order so support can open it
without a follow-up.

**Subject** — When the order's current invoice id exists, the subject SHALL be
`Auction order {invoice id}: {reason}`. When no invoice id exists (including
setup overdue before send), the subject SHALL be
`Auction lot {lot title}: {reason}`.

**Reason** — On Winner Order the reason fragment SHALL be one of
`setup overdue`, `payment overdue`, or `partial payment`.

**Body** — Message SHALL greet Grade10, say the winner needs help with this
auction order, name the lot title, name the status label for the reason
(`Setup overdue`, `Payment overdue`, or `Partially paid`), and leave space
for the winner's question. When an invoice id exists and the reason is not
setup overdue, the body SHALL name that invoice id.

**Partial payment** — When the reason is partial payment, the body MAY list
receipt ids and MUST NOT name the remaining balance. When no receipt id
exists yet, the body SHALL list none.

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
  current invoice id `INV-202609-LK7P2Q-01` and lot title
  "Charizard Base Set PSA 10"
- **WHEN** the winner opens Contact Us
- **THEN** Subject is
  `Auction order INV-202609-LK7P2Q-01: payment overdue`
- **AND** Message names that invoice id, that lot title, and status Payment
  overdue

#### Scenario: winner-order-SC-166 - Partial payment may list receipts and never the balance
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** a partially paid auction order with current invoice id
  `INV-202609-LK7P2Q-01`, lot title "Charizard Base Set PSA 10", and receipt
  ids `REC-202609-LK7P2Q-01-P1` and `REC-202609-LK7P2Q-01-P2`
- **WHEN** the winner opens Contact Us
- **THEN** Subject is
  `Auction order INV-202609-LK7P2Q-01: partial payment`
- **AND** Message may list those receipt ids
- **AND** Message names no remaining balance

#### Scenario: winner-order-SC-168 - A reissued invoice uses the current invoice id
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** an auction order whose payment deadline has passed unpaid after a
  reissue, with current invoice id `INV-202609-LK7P2Q-02` and a replaced
  invoice id `INV-202609-LK7P2Q-01`
- **WHEN** the winner opens Contact Us
- **THEN** Subject is
  `Auction order INV-202609-LK7P2Q-02: payment overdue`
- **AND** Subject does not name `INV-202609-LK7P2Q-01`
