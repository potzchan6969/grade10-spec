# grade10-admin/vault/money-book Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

## grade10-admin-vault-money-book-US1: Controller ties a month's money to the bank statement

**As a** controller closing a month,
**I want** every advance, repayment and correction written down in that period, in one order, with totals for the whole range,
**so that** I can tie what we recorded to what the bank says without the figures moving as I page.

### grade10-admin-vault-money-book-US1-TC1-1: Register lists every advance, repayment and correction in one order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-01

**Pre-conditions:**

* admin(holds vault:payout) is on <grade10 admin vault money tab url>.
* The selected period holds an advance, two repayments and a correction, recorded in that order.

**Steps:**

1. Read the register for the period.

**Expected Results:**

* The register lists the advance, the two repayments and the correction in the order they were recorded.

### grade10-admin-vault-money-book-US1-TC2-1: Totals for the whole range are read together with the page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-01

**Pre-conditions:**

* admin(holds vault:payout) is on <grade10 admin vault money tab url>.
* The selected period holds more rows than one page.

**Steps:**

1. Read the register for the period.

**Expected Results:**

* The totals cover the whole range, not only the page shown.
* The totals arrive with the same read as the page, not a second one.

### grade10-admin-vault-money-book-US1-TC3-1: A backdated value date does not move a row already paged past

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-01

**Pre-conditions:**

* admin(holds vault:payout) is on <grade10 admin vault money tab url> and has paged partway through the register for the period.
* A repayment recorded after that page was shown carries a value date earlier than a row already shown.

**Steps:**

1. Read the next page of the register.

**Expected Results:**

* The rows already shown keep their place.
* The new repayment appears at the point it was recorded, not reordered to its value date.

### grade10-admin-vault-money-book-US1-TC4-1: Register reads no record in the range

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-01

**Pre-conditions:**

* admin(holds vault:payout) is on <grade10 admin vault money tab url>.
* The selected period holds no advance, repayment or correction.

**Steps:**

1. Read the register for the period.

**Expected Results:**

* The register reads that the range holds no record.
* The totals read zero.

### grade10-admin-vault-money-book-US1-TC5-1: The register read fails and shows the error

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-01

**Pre-conditions:**

* admin(holds vault:payout) is on <grade10 admin vault money tab url>.
* The register read is stubbed to fail.

**Steps:**

1. Read the register for the period.

**Expected Results:**

* The register's status shows the failure message in place of the rows.

### grade10-admin-vault-money-book-US1-TC6-1: The register is refused without the money grant

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-01

**Pre-conditions:**

* admin holds vault:read alone, with no vault:payout, and reaches <grade10 admin vault money tab url>.

**Steps:**

1. Read the register for the period.

**Expected Results:**

* The register is refused; no row or total is shown.

---

## grade10-admin-vault-money-book-US3: Operator works the loans that are running late

**As a** member of shop staff,
**I want** every loan past its due date, longest overdue first and pageable to the end,
**so that** nobody in arrears is hidden behind a page while I chase the rest.

### grade10-admin-vault-money-book-US3-TC1-1: Arrears list orders every live loan longest overdue first

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-03

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault overdue tab url>.
* Several live loans are past their due date by different numbers of days.

**Steps:**

1. Read the arrears list.

**Expected Results:**

* The loans are ordered longest overdue first, judged on each loan's due date.

### grade10-admin-vault-money-book-US3-TC2-1: The arrears list pages to the end through a tie on the due date without hiding or duplicating a loan

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-03

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault overdue tab url>.
* More live loans are past due than fit one page, and two of them share the same due date.

**Steps:**

1. Read the first page of the arrears list.
2. Load the next page on its cursor until the list ends.

**Expected Results:**

* Every overdue loan appears exactly once across the pages.
* The two loans sharing a due date both appear, neither skipped nor repeated.

### grade10-admin-vault-money-book-US3-TC3-1: No live loan is overdue

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-03

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault overdue tab url>.
* No live loan is past its due date.

**Steps:**

1. Read the arrears list.

**Expected Results:**

* The list reads that no loan is late.
* Every tile above the list reads zero.

### grade10-admin-vault-money-book-US3-TC4-1: The arrears read fails and shows the error

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-03

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault overdue tab url>.
* The arrears read is stubbed to fail.

**Steps:**

1. Read the arrears list.

**Expected Results:**

* The list's status shows the failure message in place of the rows.

### grade10-admin-vault-money-book-US3-TC5-1: The arrears list is refused without the read grant

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-03

**Pre-conditions:**

* An actor holding no vault grant reaches <grade10 admin vault overdue tab url>.

**Steps:**

1. Read the arrears list.

**Expected Results:**

* The list is refused; no row or tile is shown.

---

## grade10-admin-vault-money-book-US4: Controller takes the range to a spreadsheet

**As a** controller closing a month,
**I want** the ledger filtered by kind, its net out of the business, and the range as a CSV,
**so that** I tie the period to the statement outside the console.

### grade10-admin-vault-money-book-US4-TC1-1: The kind filter narrows the register, composed with the method filter

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-04

**Pre-conditions:**

* admin(holds vault:payout) is on <grade10 admin vault money tab url>.
* The period holds a payout, a repayment and a correction.

**Test data:**

| Kind selected | Rows shown |
| --- | --- |
| All | the payout, the repayment and the correction |
| Payouts | the payout only |
| Repayments | the repayment only |
| Corrections | the correction only |

**Steps:**

1. Select the row's kind in the kind filter.

**Expected Results:**

* The register narrows to <Rows shown>.
* The method filter still narrows further within it.

### grade10-admin-vault-money-book-US4-TC2-1: Net out of the business folds payouts less repayments, a correction netting the row it took back once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-04

**Pre-conditions:**

* admin(holds vault:payout) is on <grade10 admin vault money tab url>.
* The range holds a payout of HKD 10000000, two repayments of HKD 3000000 each, and a correction reversing the second repayment.

**Steps:**

1. Read the net-out figure for the range.

**Expected Results:**

* The net out reads HKD 7000000 — the payout less the one repayment the correction did not take back.

### grade10-admin-vault-money-book-US4-TC3-1: A correction row names the row it took back

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-04

**Pre-conditions:**

* admin(holds vault:payout) is on <grade10 admin vault money tab url>.
* The range holds a correction reversing a repayment.

**Steps:**

1. Read the correction's row in the register.

**Expected Results:**

* The correction names the repayment row it took back, without a second query.

### grade10-admin-vault-money-book-US4-TC4-1: The net out prints per currency and is never summed across currencies

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-04

**Pre-conditions:**

* admin(holds vault:payout) is on <grade10 admin vault money tab url>.
* The range holds money in two currencies.

**Steps:**

1. Read the net-out figures for the range.

**Expected Results:**

* A net-out figure is shown per currency.
* No combined figure sums the two currencies.

### grade10-admin-vault-money-book-US4-TC5-1: Export CSV downloads the range exactly as filtered

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-04

**Pre-conditions:**

* admin(holds vault:payout) is on <grade10 admin vault money tab url>.
* The kind filter, the method filter and the date range are set.

**Steps:**

1. Click Export CSV.

**Expected Results:**

* The CSV holds the rows the filtered register itself pages, and no row outside it.

### grade10-admin-vault-money-book-US4-TC6-1: The export is recorded on the audit chain without the row data

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-04

**Pre-conditions:**

* admin(holds vault:payout) is on <grade10 admin vault money tab url>.
* The kind filter, the method filter and the date range are set.

**Steps:**

1. Click Export CSV.

**Expected Results:**

* An audit entry records who exported, when, the filter used and how many rows.
* The audit entry does not carry the rows themselves.

### grade10-admin-vault-money-book-US4-TC7-1: Export is disabled while the filtered range holds no row

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-04

**Pre-conditions:**

* admin(holds vault:payout) is on <grade10 admin vault money tab url>.
* The filters narrow the range to no row.

**Steps:**

1. Look at the Export CSV button.

**Expected Results:**

* The button is disabled.

### grade10-admin-vault-money-book-US4-TC8-1: Export failed shows an error beside the button

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-04

**Pre-conditions:**

* admin(holds vault:payout) is on <grade10 admin vault money tab url>.
* The range holds a row.
* The export request is stubbed to fail.

**Steps:**

1. Click Export CSV.

**Expected Results:**

* An error line appears by the button.
* No file downloads.

---

## grade10-admin-vault-money-book-US5: Operator reads the arrears summed before working them

**As a** member of shop staff,
**I want** the loans in arrears summed above the list — what is outstanding across them and how many carry no notice — with each row naming the borrower, their contact, the notice and the last reminder sent,
**so that** I know who to chase first without adding the list up myself.

### grade10-admin-vault-money-book-US5-TC1-1: Tiles above the list sum the arrears the list holds

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-05

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault overdue tab url>.
* Several loans are in arrears, some with a notice sent and some without.

**Steps:**

1. Read the tiles above the arrears list.

**Expected Results:**

* A tile reads the count of loans in arrears, matching the list beneath.
* A tile reads what is outstanding across them.
* A tile reads how many carry no notice.

### grade10-admin-vault-money-book-US5-TC2-1: Outstanding in arrears prints per currency and is never summed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-05

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault overdue tab url>.
* The loans in arrears are in two currencies.

**Steps:**

1. Read the outstanding tile.

**Expected Results:**

* The outstanding figure is shown per currency.
* No combined figure sums the two currencies.

### grade10-admin-vault-money-book-US5-TC3-1: Each row names the borrower, their contact, the notice and the last reminder sent

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-05

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault overdue tab url>.
* A loan is in arrears with a notice already sent.

**Steps:**

1. Read the loan's row in the arrears list.

**Expected Results:**

* The row names the borrower, how to reach them, the notice and the last reminder sent.

### grade10-admin-vault-money-book-US5-TC4-1: A loan with no notice sent reads none yet

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-05

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault overdue tab url>.
* A loan is in arrears with no notice sent.

**Steps:**

1. Read the loan's notice cell.

**Expected Results:**

* The notice cell reads none yet.
* The loan counts toward the without-a-notice tile.

### grade10-admin-vault-money-book-US5-TC5-1: A loan with a notice sent reads its date to pay by and stops its reminders

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-05

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault overdue tab url>.
* A loan in arrears has had its forfeiture notice sent.

**Steps:**

1. Read the loan's notice and last-reminder cells.

**Expected Results:**

* The notice cell reads the date it was sent and the date to pay by.
* The last-reminder cell reads that reminders were stopped by the notice.

### grade10-admin-vault-money-book-US5-TC6-1: The reminder ladder is shown in words under the list

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-05

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault overdue tab url>.

**Steps:**

1. Scroll to below the arrears list.

**Expected Results:**

* The reminder ladder reads in words under the list.
