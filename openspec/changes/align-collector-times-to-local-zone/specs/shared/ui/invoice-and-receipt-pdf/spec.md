# shared/ui/invoice-and-receipt-pdf Specification

## Feature set

- Presentation-only contract

## MODIFIED Requirements

### Requirement: Dates render in Hong Kong as GMT+8

Every document date uses Asia/Hong_Kong, matching emails and terms, and names
the offset **GMT+8**.

**Given** - InvoicePdf and ReceiptPdf SHALL render every date as the Hong Kong
calendar date and clock time, followed by `GMT+8`, regardless of the machine's
zone. The date's words are English and `GMT+8` prints as written, whatever the
language of the `copy` argument: both are part of the date, not labels read
from `copy`.

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-i53 rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-43 - A date renders in Hong Kong as GMT+8

**Serves:** Presentation-only contract - every date renders in Hong Kong as GMT+8

- **GIVEN** a `Date` value and a machine clock not set to Hong Kong time
- **WHEN** InvoicePdf renders it as a meta row
- **THEN** the row shows that instant's Hong Kong calendar date and clock
  time, followed by `GMT+8`
- **AND** the row does not contain `HKT`

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-2d5 rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-54 - A receipt's date paid renders in Hong Kong as GMT+8

**Serves:** Presentation-only contract - every date renders in Hong Kong as GMT+8

- **GIVEN** a `Date` value and a machine clock not set to Hong Kong time
- **WHEN** ReceiptPdf renders it as the date paid
- **THEN** the row shows that instant's Hong Kong calendar date and clock
  time, followed by `GMT+8`
- **AND** the row does not contain `HKT`

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-1sf rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-55 - A document date reads the same under any copy language

**Serves:** Presentation-only contract - every date renders in Hong Kong as GMT+8

- **GIVEN** a `Date` value and a `copy` argument in Traditional Chinese
- **WHEN** InvoicePdf and ReceiptPdf render it as a date row
- **THEN** each row shows that instant's Hong Kong calendar date and clock
  time, followed by `GMT+8`
- **AND** the date's words are English, as under every other language
