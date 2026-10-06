## Feature set

- Presentation-only contract
  - Hong Kong dates: every date renders as GMT+8

## MODIFIED Requirements

### Requirement: Dates render in Hong Kong as GMT+8

Every document date uses Asia/Hong_Kong, matching emails and terms, and names
the offset **GMT+8**.

**Given** — InvoicePdf and ReceiptPdf SHALL render every date as the Hong Kong
calendar date and clock time, followed by `GMT+8`, regardless of the machine's
zone.

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-57a rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-43 - A date renders in Hong Kong as GMT+8

**Serves:** Presentation-only contract - every date renders in Hong Kong as GMT+8

- **GIVEN** a `Date` value and a machine clock not set to Hong Kong time
- **WHEN** InvoicePdf renders it as a meta row
- **THEN** the row shows that instant's Hong Kong calendar date and clock time
- **AND** the row ends in `GMT+8`
- **AND** the row does not contain `HKT`
