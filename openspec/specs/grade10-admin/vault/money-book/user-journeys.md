## User journeys

### grade10-admin-vault-money-book-US-01: Controller ties a month's money to the bank statement

**As a** controller closing a month,
**I want** every advance, repayment and correction written down in that
period, in one order, with totals for the whole range,
**so that** I can tie what we recorded to what the bank says without the
figures moving as I page.

**Accepted by:**

- `grade10-admin-vault-money-book-SC-01` — The register is ordered by when it was written
- `grade10-admin-vault-money-book-SC-02` — A correction names the record it takes back
- `grade10-admin-vault-money-book-SC-03` — Totals do not move as the reader pages
- `grade10-admin-vault-money-book-SC-04` — A book in two currencies totals in each

### grade10-admin-vault-money-book-US-02: Treasurer reads what the loan book stands at

**As a** treasurer,
**I want** the principal and interest outstanding across every live loan at an
instant, in one unit,
**so that** what the business is owed is one figure I can quote and check
against the cases behind it.

**Accepted by:**

- `grade10-admin-vault-money-book-SC-05` — The position agrees with the case screens
- `grade10-admin-vault-money-book-SC-06` — A second currency is refused, not summed
- `grade10-admin-vault-money-book-SC-10` — A treasurer reads the book

### grade10-admin-vault-money-book-US-03: Operator works the loans that are running late

**As a** member of shop staff,
**I want** every loan past its due date, longest overdue first and pageable to
the end,
**so that** nobody in arrears is hidden behind a page while I chase the rest.

**Accepted by:**

- `grade10-admin-vault-money-book-SC-07` — The arrears resume after the row the last page stopped at
- `grade10-admin-vault-money-book-SC-08` — A corrected advance leaves the arrears
- `grade10-admin-vault-money-book-SC-09` — A staff operator reads the case but not the book
