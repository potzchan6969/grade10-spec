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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin holds vault:read alone, with no vault:payout, and reaches <grade10 admin vault money tab url>.

**Steps:**

1. Read the register for the period.

**Expected Results:**

* The register is refused; no row or total is shown.

---

## grade10-admin-vault-money-book-US2: Treasurer reads what the loan book stands at

**As a** treasurer,
**I want** the principal and interest outstanding across every loan on the book at an instant — now, or a month-end I name — in one unit,
**so that** what the business is owed is one figure I can quote and check against the cases behind it, and tie to the month it belongs to.

### grade10-admin-vault-money-book-US2-TC1-1: The position agrees with the case screens behind it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-02

**Pre-conditions:**

* admin(holds vault:payout) is signed in to the console.
* Three live loans are on the book, each in HKD.

**Steps:**

1. Read the position as at now.
2. Read what each of the three cases owes at that instant.

**Expected Results:**

* The position's outstanding is the sum of the three case figures.
* The position counts three loans on the book.

### grade10-admin-vault-money-book-US2-TC2-1: A book holding two currencies is refused, not summed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-02

**Pre-conditions:**

* admin(holds vault:payout) is signed in to the console.
* Live loans are on the book in two currencies.

**Steps:**

1. Read the position as at now.

**Expected Results:**

* The position is refused by name.
* No figure sums the two currencies.

### grade10-admin-vault-money-book-US2-TC3-1: A past instant replays the book as it stood

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-02

**Pre-conditions:**

* admin(holds vault:payout) is signed in to the console.
* One loan was advanced in June, settled in July, and its item released in August.

**Test data:**

| Instant read | The loan reads |
| --- | --- |
| End of June | on the book, its whole term outstanding |
| End of July | on the book, settled |
| Now | not on the book |

**Steps:**

1. Read the position as at the row's instant.

**Expected Results:**

* The position reads the loan as <The loan reads>.

### grade10-admin-vault-money-book-US2-TC4-1: A position as at a future instant is refused

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-02

**Pre-conditions:**

* admin(holds vault:payout) is signed in to the console.

**Steps:**

1. Read the position as at a date after today.

**Expected Results:**

* The position is refused by name.
* No figure is given.

### grade10-admin-vault-money-book-US2-TC5-1: The position is refused without the money grant

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-02

**Pre-conditions:**

* admin holds vault:read alone, with no vault:payout, and is signed in to the console.

**Steps:**

1. Read the position as at now.

**Expected Results:**

* The position is refused by name.
* What the operator's own case owes still reads.

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

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


### grade10-admin-vault-money-book-US3-TC6-1: Each arrears row prints in its loan's own currency

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** `The arrears`

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault overdue tab url>.
* Two loans are in arrears, one in HKD and one in USD.

**Steps:**

1. Read the two rows in the arrears list.

**Expected Results:**

* Each row's outstanding is in its own loan's currency.
* Neither row is read in the book's default currency.

### grade10-admin-vault-money-book-US3-TC7-1: A loan whose advance is taken back leaves the arrears

**Classification:**

* **Severity:** major
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
* A loan in arrears has had its advance taken back by a correction.

**Steps:**

1. Read the arrears list.

**Expected Results:**

* The case is not in the list.
* The tiles above the list do not count it.

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

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
* **Trace:** `The export`

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

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


### grade10-admin-vault-money-book-US4-TC9-1: The export is refused without the money grant

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
* **Trace:** grade10-admin-vault-money-book-US-04

**Pre-conditions:**

* admin holds vault:read alone, with no vault:payout, and asks for the register as a file.

**Steps:**

1. Ask for the register as a file.

**Expected Results:**

* The request is refused by name.
* No file is served.

### grade10-admin-vault-money-book-US4-TC10-1: The net out answers the range as narrowed

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
* The range holds records for two cases.

**Steps:**

1. Narrow the register to one of the two cases.
2. Read the net-out figure.

**Expected Results:**

* The net out covers that case alone, not both.

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

### grade10-admin-vault-money-book-US5-TC3-1: Each row names the case reference, the item, the contact, the notice and the last reminder sent

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

* The row names the case reference and the item held against the loan.
* The row names the phone number and the email address the case holds, and no name.
* The row names the day the notice was sent with the day it gives to pay by, and the day the last reminder was sent.

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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-vault-money-book-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault overdue tab url>.

**Steps:**

1. Scroll to below the arrears list.

**Expected Results:**

* The reminder ladder reads in words under the list.

## Settled

- The arrears sit behind the vault read grant, with the list the figures sum; the money grant guards the register and the position alone.
- The position is untouched by this change: its journey and its scenarios are the durable ones, and this suite is the first to walk them.
- The register and the arrears list page 50 rows at a time, at most 200 a call, decided on the Operator Console page.
- The arrears fold answers every loan the filter in force holds, as the register's totals answer the range; it is not bounded to a page and refuses nothing.

## Reconciliation

**Run:** 2026-09-22. The blind pass read the outline — `## Purpose` and
`## Feature set` — this capability's `user-journeys.md`, `proposal.md`,
`decisions.md` with its `## Raised` table, `ui-design.md` with its state
dispositions stripped, and the PRD sections the proposal links. It was denied
every `## Requirements` section, `openspec/specs/`, `openspec/changes/archive/`
and `tech-design.md`. Nothing verifies that account; it is the run's word.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `US3-TC1-1` | Folded into `spec.md` | The requirement orders the list longest overdue first and no scenario read it — `grade10-admin-vault-money-book-SC-29` |
| `US3-TC2-1` | Folded into `spec.md` | `grade10-admin-vault-money-book-SC-07` pages, but nothing stated two loans sharing one due date — `grade10-admin-vault-money-book-SC-30` |
| `US3-TC5-1` | Folded into `spec.md` | The grant is the requirement's, the refusal nobody's — `grade10-admin-vault-money-book-SC-31`, and the question behind it is `Q35` |
| `US1-TC1-1`, `US1-TC3-1` | Covered | `grade10-admin-vault-money-book-SC-01` |
| `US1-TC2-1` | Covered | The durable `grade10-admin-vault-money-book-SC-03`, which this change leaves as it is |
| `US1-TC4-1` | Covered | `grade10-admin-vault-money-book-SC-27`; a range holding nothing folds to zero by the totals requirement it already reads under |
| `US1-TC6-1` | Covered | The durable `grade10-admin-vault-money-book-SC-09` |
| `US3-TC3-1` | Covered | `grade10-admin-vault-money-book-SC-18` |
| `US4-TC1-1` | Covered | `grade10-admin-vault-money-book-SC-25`, `grade10-admin-vault-money-book-SC-26` |
| `US4-TC2-1` | Covered | `grade10-admin-vault-money-book-SC-13`, `grade10-admin-vault-money-book-SC-14` |
| `US4-TC3-1` | Covered | `grade10-admin-vault-money-book-SC-02` |
| `US4-TC4-1` | Covered | `grade10-admin-vault-money-book-SC-15` |
| `US4-TC5-1` | Covered | `grade10-admin-vault-money-book-SC-20`, `grade10-admin-vault-money-book-SC-21` |
| `US4-TC6-1` | Covered | `grade10-admin-vault-money-book-SC-23` |
| `US4-TC7-1` | Covered | `grade10-admin-vault-money-book-SC-22` |
| `US5-TC1-1` | Covered | `grade10-admin-vault-money-book-SC-16` |
| `US5-TC2-1` | Covered | `grade10-admin-vault-money-book-SC-17` |
| `US5-TC3-1`, `US5-TC4-1` | Covered | `grade10-admin-vault-money-book-SC-28`, `grade10-admin-vault-money-book-SC-16` |
| `US1-TC5-1`, `US3-TC4-1`, `US4-TC8-1` | Kept, no scenario owed | A failed read and a failed export are the panel's own status, not a rule; the design's Loading, Error, Export in flight and Export failed rows close on the panel's colocated test |
| `US5-TC5-1` | Kept, routed | The notice's date and the day it gives to pay by are `grade10-admin-vault-money-book-SC-28`; that no further reminder follows a notice is `grade10-site/vault/collector-notifications`' rule, walked by its own suite |
| `US5-TC6-1` | Kept, routed | The reminder ladder's words are `grade10-site/vault/collector-notifications`', as the design's Ladder row anchors them |
| Raised — which grant opens the arrears view | Raised, answered | The vault read grant, with the list the figures sum: the durable requirement "The book sits behind the money grant, and one case's balance does not" and the Permissions table of the [Operator Console](/p/grade10-site/vault/operator-console#permissions) page. Landed as `Q35`, and `grade10-admin-vault-money-book-SC-31` now states the refusal |
| Raised — whether any journey reads the position | Raised, answered | No screen in this change reads it, and the blind pass wrote no case for it, rightly. Landed as `Q36`: the position is out of this change's scope, the durable journey US-02 keeps its durable scenarios, and this first suite owes them cases — `US2-TC1-1` to `US2-TC5-1` |
| Raised — what page the register and the arrears list page on | Raised, answered | 50 rows a page, at most 200 a call, decided on the [Operator Console](/p/grade10-site/vault/operator-console) page |
| `grade10-admin-vault-money-book-SC-08` | Case added | `US3-TC7-1` |
| `grade10-admin-vault-money-book-SC-12` | Case added | `US3-TC6-1` |
| `grade10-admin-vault-money-book-SC-24` | Case added | `US4-TC9-1` |
| The net out over the range as narrowed | Case added | The rule stands and no scenario reads it; `Q37` records the reading and `US4-TC10-1` walks it |
| Uncovered anchors | None | Every journey carries cases, and every group anchor a scenario serves is traced by a case |

### Manual

No case here waits on a person: every one carries `**Testability:** automation`
and is decided by a test.
