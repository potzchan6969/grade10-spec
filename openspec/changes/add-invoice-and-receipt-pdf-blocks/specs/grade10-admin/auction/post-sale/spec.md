# grade10-admin/auction/post-sale Specification

## Feature set

- Phone setup
  - The operator records the winner's stated IANA time zone with the address
- Invoice issue
  - Send requires a stored winner zone and freezes it on each invoice revision
- Documents
  - The revision's zone governs its invoice and receipt dates

## ADDED Requirements

### Requirement: Phone setup records the winner's stated time zone

When an operator with payment-processing records overdue setup by phone under the existing phone-record rules, Grade10 SHALL require the winner's stated IANA time zone alongside the delivery and billing addresses. The operator SHALL enter that zone explicitly; Grade10 SHALL refuse a missing or invalid zone and SHALL NOT infer one from address, phone country or the operator's machine. On success Grade10 SHALL store the zone on the auction order.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-phone-zone rev=1 -->
#### Scenario: post-sale-SC-300 - Phone setup stores the winner's stated zone
**Serves:** post-sale-US-19 - Operator records the winner's zone by phone

- **GIVEN** an unconfirmed Setup Overdue order with invoice `not_issued`
- **AND** an operator holding payment-processing hears the winner state `America/Los_Angeles` by phone
- **WHEN** the operator records the addresses and that zone
- **THEN** the order stores `America/Los_Angeles` as the winner's zone
- **AND** the existing phone-record restrictions and log entry still apply

<!-- trace:scenario id=g10adm.auction-post-sale.SC-phone-zone-refusal rev=1 -->
#### Scenario: post-sale-SC-301 - Phone setup refuses an absent or invalid zone
**Serves:** post-sale-US-19 - Operator records the winner's zone by phone

- **GIVEN** an operator recording an otherwise valid phone setup
- **WHEN** the zone is absent or is not an IANA time zone
- **THEN** Grade10 refuses the phone record and names the zone problem
- **AND** no address or zone is confirmed on the order

### Requirement: Invoice issue freezes the winner's time zone per revision

Grade10 SHALL refuse first send or reissue when the auction order has no stored valid IANA winner zone. On each successful send it SHALL copy that zone onto the new invoice revision. The invoice PDF and every receipt issued against that revision SHALL render their dates in that immutable zone and name it. A later browser zone SHALL NOT change the revision's PDFs. Archived PDF bytes SHALL remain unchanged.

For an existing order with no stored zone, an operator holding payment-processing SHALL be able to record the winner's stated IANA zone with a required reason before first send or reissue. Grade10 SHALL refuse an invalid zone or missing reason and write the operator, old and new values and reason to the invoice log on success. This action SHALL NOT alter any already issued invoice revision or its archived documents. It SHALL NOT replace or change a zone already confirmed on the order.

For a historical invoice revision that has no zone snapshot, Grade10 SHALL render an unarchived invoice or receipt in `Asia/Hong_Kong`, labelled Hong Kong time, and SHALL NOT infer a zone from the current reader. This fallback SHALL NOT permit a new invoice revision to be issued without a winner zone.

<!-- trace:scenario id=g10adm.auction-post-sale.SC-issue-zone-refusal rev=1 -->
#### Scenario: post-sale-SC-302 - Issue refuses an order with no winner zone
**Serves:** post-sale-US-20 - Operator issues an invoice in the winner's zone

- **GIVEN** an order with a confirmed address but no stored winner zone
- **WHEN** an operator tries to send its first invoice or a reissue
- **THEN** Grade10 refuses send and names the missing winner zone
- **AND** no new invoice revision or invoice-sent letter is created

<!-- trace:scenario id=g10adm.auction-post-sale.SC-issue-zone-snapshot rev=1 -->
#### Scenario: post-sale-SC-303 - Send snapshots the order zone
**Serves:** post-sale-US-20 - Operator issues an invoice in the winner's zone

- **GIVEN** an order whose winner zone is `America/New_York`
- **WHEN** an operator sends its invoice
- **THEN** the new invoice revision stores `America/New_York`
- **AND** its PDF dates and any receipt for a payment against it use that zone

<!-- trace:scenario id=g10adm.auction-post-sale.SC-reissue-zone-snapshot rev=1 -->
#### Scenario: post-sale-SC-304 - Reissue copies the order zone without changing the old revision
**Serves:** post-sale-US-20 - Operator issues an invoice in the winner's zone

- **GIVEN** a sent invoice revision storing `America/New_York`
- **WHEN** an operator reissues the invoice with a valid quote change
- **THEN** the new revision also stores `America/New_York`
- **AND** the old invoice and its receipts remain unchanged

<!-- trace:scenario id=g10adm.auction-post-sale.SC-legacy-zone rev=1 -->
#### Scenario: post-sale-SC-305 - Historical revisions use labelled Hong Kong time
**Serves:** post-sale-US-20 - Operator issues an invoice in the winner's zone

- **GIVEN** a historical invoice revision with no zone snapshot
- **WHEN** an unarchived invoice or receipt is rendered for that revision
- **THEN** its dates use `Asia/Hong_Kong` and are labelled Hong Kong time
- **AND** any already archived PDF bytes remain unchanged

<!-- trace:scenario id=g10adm.auction-post-sale.SC-legacy-zone-record rev=1 -->
#### Scenario: post-sale-SC-306 - Operator records the winner's zone for an older order
**Serves:** post-sale-US-20 - Operator issues an invoice in the winner's zone

- **GIVEN** an existing confirmed order with no stored zone
- **AND** the winner states `Europe/London` to an operator holding payment-processing
- **WHEN** the operator records that zone with a reason
- **THEN** the order stores `Europe/London`
- **AND** the invoice log names the operator, the zone and reason
- **AND** any earlier invoice revision and archived PDF stay unchanged
