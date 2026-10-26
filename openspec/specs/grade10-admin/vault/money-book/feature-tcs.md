# grade10-admin/vault/money-book Test Cases

**Status:** pending-review · 0/23
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* The vault console's Money tab holds the register, its totals, net out of the business and Export CSV, and the position; the Overdue tab holds the arrears list and its tiles. The register and the arrears page 50 rows at a time.
* The Money tab is read by a treasurer, admin(holds `vault:payout`); the Overdue tab by staff, admin(holds `vault:read`), unless a case says otherwise. Amounts are HKD unless a row names USD.

## Walk 1: Close a month on the Money tab

Starting state:

- admin(holds `vault:payout`) on the Money tab, September holding advances, repayments and a correction over three pages.

Shared test data:

| Field | Value |
| --- | --- |
| range | 1 to 30 September |

### Route

1. Read the register for `<range>`, paging to the end.
   - Every record in the order it was written, the same totals on each page. `g10adm.vault-money-book.US1-TC2`
2. Narrow it to repayments by transfer.
   - Only those rows. `g10adm.vault-money-book.US4-TC1`
3. Read net out of the business.
   - Advances less the repayments no correction took back. `g10adm.vault-money-book.US4-TC2`
4. Select Export CSV.
   - A file holding the rows as narrowed. `g10adm.vault-money-book.US4-TC5`

## g10adm.vault-money-book.US1: Controller ties a month's money to the bank statement

**As a** controller closing a month,
**I want** every advance, repayment and correction written down in that
period, in one order, with totals for the whole range,
**so that** I can tie what we recorded to what the bank says without the
figures moving as I page.

<!-- trace:case id=g10adm.vault-money-book.TC-imi rev=1 covers=g10adm.vault-money-book.SC-wbb,g10adm.vault-money-book.SC-n97,g10adm.vault-money-book.SC-uzx,g10adm.vault-money-book.SC-l0b,g10adm.vault-money-book.SC-2gi -->
### g10adm.vault-money-book.US1-TC1: The register lists every record in the order it was written, a correction naming the record it takes back

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-money-book-US-01

**Pre-conditions:**

* The range holds an advance, two repayments and a correction reversing the second repayment, written in that order.

**Steps:**

1. Read the register for the range.

**Expected Results:**

* It lists the four in the order written; the correction names the repayment it takes back.

<!-- trace:case id=g10adm.vault-money-book.TC-8lj rev=1 covers=g10adm.vault-money-book.SC-wbb,g10adm.vault-money-book.SC-n97,g10adm.vault-money-book.SC-uzx,g10adm.vault-money-book.SC-l0b,g10adm.vault-money-book.SC-2gi -->
### g10adm.vault-money-book.US1-TC3: A record written today against last week's value date sits at today's place, moving nothing already shown

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-money-book-US-01

**Pre-conditions:**

* The treasurer has paged partway through today's register; a repayment is then written today, valued last week.

**Steps:**

1. Read the next page, and reread the pages already shown.

**Expected Results:**

* The new row sits where it was written, not at its value date; the rows already shown keep their places.

<!-- trace:case id=g10adm.vault-money-book.TC-4j7 rev=1 covers=g10adm.vault-money-book.SC-wbb,g10adm.vault-money-book.SC-n97,g10adm.vault-money-book.SC-uzx,g10adm.vault-money-book.SC-l0b,g10adm.vault-money-book.SC-2gi -->
### g10adm.vault-money-book.US1-TC2: The totals cover the whole range, the same on every page and in each currency

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-money-book-US-01

**Pre-conditions:**

* The range holds `<records>` over three pages.

**Test data:**

| `<records>` | `<totals>` |
| --- | --- |
| HKD records only | one set of totals for the range |
| HKD and USD records | a set in each currency, each in its own unit, none combined |

**Steps:**

1. Read the register, paging to the end.

**Expected Results:**

* Every page shows `<totals>`, the same on each.

<!-- trace:case id=g10adm.vault-money-book.TC-khw rev=1 covers=g10adm.vault-money-book.SC-wbb,g10adm.vault-money-book.SC-n97,g10adm.vault-money-book.SC-uzx,g10adm.vault-money-book.SC-l0b,g10adm.vault-money-book.SC-2gi -->
### g10adm.vault-money-book.US1-TC4: A range with nothing written in it says so

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-money-book-US-01

**Pre-conditions:**

* Nothing was written in the range.

**Steps:**

1. Read the register for the range.

**Expected Results:**

* It lists no row, reads that the range holds no record, totals zero, and offers no next page.

<!-- trace:case id=g10adm.vault-money-book.TC-8c8 rev=1 covers=g10adm.vault-money-book.SC-wbb,g10adm.vault-money-book.SC-n97,g10adm.vault-money-book.SC-uzx,g10adm.vault-money-book.SC-l0b,g10adm.vault-money-book.SC-2gi -->
### g10adm.vault-money-book.US1-TC6: The register is refused without the money grant

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-money-book-US-01

**Pre-conditions:**

* admin(holds `vault:read`, not `vault:payout`) reaches the Money tab.

**Steps:**

1. Read the register.

**Expected Results:**

* It is refused by name; no row or total shows.

---

## g10adm.vault-money-book.US2: Treasurer reads what the loan book stands at

**As a** treasurer,
**I want** the principal and interest outstanding across every loan on the
book at an instant — now, or a month-end I name — in one unit,
**so that** what the business is owed is one figure I can quote and check
against the cases behind it, and tie to the month it belongs to.

<!-- trace:case id=g10adm.vault-money-book.TC-31e rev=1 -->
### g10adm.vault-money-book.US2-TC1: The position now is the sum of what each live loan's own case says it owes

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-money-book-US-02

**Pre-conditions:**

* Three live HKD loans stand; a treasurer is on the Money tab.

**Steps:**

1. Read the position now.
2. Open each loan's case, and read what it owes.

**Expected Results:**

* Step 1's principal and interest outstanding equal the sum of step 2's three figures.

<!-- trace:case id=g10adm.vault-money-book.TC-jwo rev=1 -->
### g10adm.vault-money-book.US2-TC2: A month-end named replays the book as it stood

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-money-book-US-02

**Pre-conditions:**

* A loan was advanced in June, settled in July, and its item released in August.

**Test data:**

| `<as at>` | `<position carries>` |
| --- | --- |
| 30 June | the loan, its whole term outstanding |
| 31 July | the loan, owing nothing |
| now | no such loan |

**Steps:**

1. Read the position as at `<as at>`.

**Expected Results:**

* It carries `<position carries>`.

<!-- trace:case id=g10adm.vault-money-book.TC-2zb rev=1 -->
### g10adm.vault-money-book.US2-TC3: A book with live loans in two currencies refuses one position rather than sum them

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-money-book-US-02

**Pre-conditions:**

* Live loans stand in HKD and in USD.

**Steps:**

1. Read the position.

**Expected Results:**

* It is refused by name, naming the two currencies; no figure shows.

---

## g10adm.vault-money-book.US3: Operator works the loans that are running late

**As a** member of shop staff,
**I want** every loan past its due date, longest overdue first and pageable to
the end,
**so that** nobody in arrears is hidden behind a page while I chase the rest.

<!-- trace:case id=g10adm.vault-money-book.TC-x05 rev=1 covers=g10adm.vault-money-book.SC-2p3,g10adm.vault-money-book.SC-shu,g10adm.vault-money-book.SC-lzq,g10adm.vault-money-book.SC-zp0,g10adm.vault-money-book.SC-ucd,g10adm.vault-money-book.SC-h9j,g10adm.vault-money-book.SC-xz0 -->
### g10adm.vault-money-book.US3-TC1: The arrears list every late loan once, longest overdue first, to the end of the last page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-money-book-US-03

**Pre-conditions:**

* 52 live loans are past their due dates by different numbers of days; two share a due date across the first page's end.

**Steps:**

1. Read the arrears, and load each next page until the list ends.

**Expected Results:**

* They read longest overdue first, by each loan's due date; every loan appears once, both sharing a date included; the last page says nothing is behind it.

<!-- trace:case id=g10adm.vault-money-book.TC-svs rev=1 covers=g10adm.vault-money-book.SC-2p3,g10adm.vault-money-book.SC-shu,g10adm.vault-money-book.SC-lzq,g10adm.vault-money-book.SC-zp0,g10adm.vault-money-book.SC-ucd,g10adm.vault-money-book.SC-h9j,g10adm.vault-money-book.SC-xz0 -->
### g10adm.vault-money-book.US3-TC3: With nothing late the arrears read zero

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-money-book-US-03

**Pre-conditions:**

* No live loan is past its due date.

**Steps:**

1. Read the arrears.

**Expected Results:**

* It reads that no loan is late; every tile reads zero.

<!-- trace:case id=g10adm.vault-money-book.TC-1av rev=1 covers=g10adm.vault-money-book.SC-2p3,g10adm.vault-money-book.SC-shu,g10adm.vault-money-book.SC-lzq,g10adm.vault-money-book.SC-zp0,g10adm.vault-money-book.SC-ucd,g10adm.vault-money-book.SC-h9j,g10adm.vault-money-book.SC-xz0 -->
### g10adm.vault-money-book.US3-TC5: The arrears need a vault grant, and the register the money grant

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-money-book-US-03

**Pre-conditions:**

* `<operator>` is signed in to the console.

**Test data:**

| `<operator>` | `<opens>` | `<shown>` |
| --- | --- | --- |
| admin holding no vault grant | the arrears | refused by name; no row or tile |
| staff, holding `vault:read` | a case, then the register | the case's balance; the register refused by name |

**Steps:**

1. Open `<opens>`.

**Expected Results:**

* It shows `<shown>`.

<!-- trace:case id=g10adm.vault-money-book.TC-c8z rev=1 covers=g10adm.vault-money-book.SC-2p3,g10adm.vault-money-book.SC-shu,g10adm.vault-money-book.SC-lzq,g10adm.vault-money-book.SC-zp0,g10adm.vault-money-book.SC-ucd,g10adm.vault-money-book.SC-h9j,g10adm.vault-money-book.SC-xz0 -->
### g10adm.vault-money-book.US3-TC7: A late loan whose advance is taken back leaves the arrears

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-money-book-US-03

**Pre-conditions:**

* A loan in arrears had its advance taken back.

**Steps:**

1. Read the arrears and its tiles.

**Expected Results:**

* The case is not listed, and no tile counts it.

<!-- trace:case id=g10adm.vault-money-book.TC-vnd rev=1 covers=g10adm.vault-money-book.SC-k1b -->
### g10adm.vault-money-book.US3-TC6: Each arrears row reads in its own loan's currency

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** The arrears

**Pre-conditions:**

* Two loans are in arrears, one in HKD and one in USD.

**Steps:**

1. Read both rows.

**Expected Results:**

* Each reads its outstanding in its own currency, neither in the book's default.

---

## g10adm.vault-money-book.US4: Controller takes the range to a spreadsheet

**As a** controller closing a month,
**I want** the ledger filtered by kind, its net out of the business, and the
range as a CSV,
**so that** I tie the period to the statement outside the console.

<!-- trace:case id=g10adm.vault-money-book.TC-rad rev=1 covers=g10adm.vault-money-book.SC-h86,g10adm.vault-money-book.SC-wgs,g10adm.vault-money-book.SC-ykd,g10adm.vault-money-book.SC-8ea,g10adm.vault-money-book.SC-jz6,g10adm.vault-money-book.SC-wco,g10adm.vault-money-book.SC-1d0,g10adm.vault-money-book.SC-tck,g10adm.vault-money-book.SC-4kg -->
### g10adm.vault-money-book.US4-TC1: The kind and method filters narrow the register together

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-money-book-US-04

**Pre-conditions:**

* The range holds an advance, repayments by transfer and in cash, and a correction.

**Test data:**

| `<kind>` | `<method>` | `<rows>` |
| --- | --- | --- |
| All | any | every record |
| Advances | any | the advance only |
| Repayments | any | both repayments |
| Corrections | any | the correction only |
| Repayments | Transfer | the transfer repayment only |

**Steps:**

1. Choose `<kind>` and `<method>`.

**Expected Results:**

* The register lists `<rows>`.

<!-- trace:case id=g10adm.vault-money-book.TC-l8j rev=1 covers=g10adm.vault-money-book.SC-h86,g10adm.vault-money-book.SC-wgs,g10adm.vault-money-book.SC-ykd,g10adm.vault-money-book.SC-8ea,g10adm.vault-money-book.SC-jz6,g10adm.vault-money-book.SC-wco,g10adm.vault-money-book.SC-1d0,g10adm.vault-money-book.SC-tck,g10adm.vault-money-book.SC-4kg -->
### g10adm.vault-money-book.US4-TC2: Net out of the business is advances less repayments, a correction netting what it took back

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-money-book-US-04

**Pre-conditions:**

* The range holds an advance of HKD100,000.00, two repayments of HKD30,000.00, and a correction reversing the second.

**Steps:**

1. Read net out of the business.

**Expected Results:**

* It reads HKD70,000.00.

<!-- trace:case id=g10adm.vault-money-book.TC-f2e rev=1 covers=g10adm.vault-money-book.SC-h86,g10adm.vault-money-book.SC-wgs,g10adm.vault-money-book.SC-ykd,g10adm.vault-money-book.SC-8ea,g10adm.vault-money-book.SC-jz6,g10adm.vault-money-book.SC-wco,g10adm.vault-money-book.SC-1d0,g10adm.vault-money-book.SC-tck,g10adm.vault-money-book.SC-4kg -->
### g10adm.vault-money-book.US4-TC4: Net out answers the range as narrowed, one figure per currency

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-money-book-US-04

**Pre-conditions:**

* The range holds `<records>`.

**Test data:**

| `<records>` | `<narrowed to>` | `<net out>` |
| --- | --- | --- |
| an advance of HKD5,000.00 and its correction | nothing | HKD0.00 |
| an advance of HKD5,000.00 and repayments of HKD2,000.00 | nothing | HKD3,000.00 out of the business |
| records for two cases | one case | that case's alone |
| HKD and USD records | nothing | one figure per currency, none combined |

**Steps:**

1. Narrow to `<narrowed to>`, and read net out.

**Expected Results:**

* It reads `<net out>`.

<!-- trace:case id=g10adm.vault-money-book.TC-b8h rev=1 covers=g10adm.vault-money-book.SC-h86,g10adm.vault-money-book.SC-wgs,g10adm.vault-money-book.SC-ykd,g10adm.vault-money-book.SC-8ea,g10adm.vault-money-book.SC-jz6,g10adm.vault-money-book.SC-wco,g10adm.vault-money-book.SC-1d0,g10adm.vault-money-book.SC-tck,g10adm.vault-money-book.SC-4kg -->
### g10adm.vault-money-book.US4-TC5: Export CSV takes the range exactly as narrowed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-money-book-US-04

**Pre-conditions:**

* The register is narrowed to repayments in September.

**Steps:**

1. Select Export CSV, and open the file.

**Expected Results:**

* It holds the rows the narrowed register pages, and no advance or correction.

<!-- trace:case id=g10adm.vault-money-book.TC-hgu rev=1 covers=g10adm.vault-money-book.SC-h86,g10adm.vault-money-book.SC-wgs,g10adm.vault-money-book.SC-ykd,g10adm.vault-money-book.SC-8ea,g10adm.vault-money-book.SC-jz6,g10adm.vault-money-book.SC-wco,g10adm.vault-money-book.SC-1d0,g10adm.vault-money-book.SC-tck,g10adm.vault-money-book.SC-4kg -->
### g10adm.vault-money-book.US4-TC7: A narrowed range holding nothing offers no file

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-money-book-US-04

**Pre-conditions:**

* The filters narrow the range to no row.

**Steps:**

1. Look at Export CSV.

**Expected Results:**

* It is disabled.

<!-- trace:case id=g10adm.vault-money-book.TC-7i4 rev=1 covers=g10adm.vault-money-book.SC-h86,g10adm.vault-money-book.SC-wgs,g10adm.vault-money-book.SC-ykd,g10adm.vault-money-book.SC-8ea,g10adm.vault-money-book.SC-jz6,g10adm.vault-money-book.SC-wco,g10adm.vault-money-book.SC-1d0,g10adm.vault-money-book.SC-tck,g10adm.vault-money-book.SC-4kg -->
### g10adm.vault-money-book.US4-TC9: A file is refused to staff, or past what the register pages in one

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-money-book-US-04

**Pre-conditions:**

* `<operator>` asks for `<file>`.

**Test data:**

| `<operator>` | `<file>` |
| --- | --- |
| admin(holds `vault:read`, not `vault:payout`) | the register as a file |
| a treasurer | more records in one file than one register call allows |

**Steps:**

1. Ask for the file.

**Expected Results:**

* It is refused by name; no file is served.

<!-- trace:case id=g10adm.vault-money-book.TC-5af rev=1 covers=g10adm.vault-money-book.SC-xv3 -->
### g10adm.vault-money-book.US4-TC6: Taking the range out is recorded like a search, without its rows

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** The export

**Pre-conditions:**

* A treasurer has the register narrowed by kind, method and dates.

**Steps:**

1. Select Export CSV; read the audit trail.

**Expected Results:**

* One entry names who took it, when, the narrowing and how many rows, and carries no row.

---

## g10adm.vault-money-book.US5: Operator reads the arrears summed before working them

**As a** member of shop staff,
**I want** the loans in arrears summed above the list — what is outstanding
across them and how many carry no notice — with each row naming the borrower,
their contact, the notice and the last reminder sent,
**so that** I know who to chase first without adding the list up myself.

<!-- trace:case id=g10adm.vault-money-book.TC-xlv rev=1 covers=g10adm.vault-money-book.SC-dgv,g10adm.vault-money-book.SC-fao,g10adm.vault-money-book.SC-lzi -->
### g10adm.vault-money-book.US5-TC1: The tiles count and sum the arrears the list holds, outstanding per currency

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-money-book-US-05

**Pre-conditions:**

* `<arrears>`.

**Test data:**

| `<arrears>` | `<tiles read>` |
| --- | --- |
| four HKD loans past due, one carrying a notice | 4 in arrears, their outstanding summed, 3 without a notice |
| two loans past due, one HKD and one USD | 2 in arrears, outstanding per currency and never combined |

**Steps:**

1. Read the tiles above the arrears.

**Expected Results:**

* They read `<tiles read>`, matching the list beneath.

<!-- trace:case id=g10adm.vault-money-book.TC-jb1 rev=1 covers=g10adm.vault-money-book.SC-dgv,g10adm.vault-money-book.SC-fao,g10adm.vault-money-book.SC-lzi -->
### g10adm.vault-money-book.US5-TC3: Each row names what it takes to chase the borrower, the notice and the last reminder

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-money-book-US-05

**Pre-conditions:**

* A loan is in arrears, `<state>`.

**Test data:**

| `<state>` | `<notice cell>` | `<reminder cell>` |
| --- | --- | --- |
| reminded twice, no notice | none yet, counted in the without-a-notice tile | the day the last reminder was sent |
| reminded twice, then sent a notice | the day it was sent and the date to pay by | that the notice stopped the reminders |

**Steps:**

1. Read its row.

**Expected Results:**

* It names the case reference, the item, the phone and email the case holds and no name; the notice reads `<notice cell>`, the last reminder `<reminder cell>`.

<!-- trace:case id=g10adm.vault-money-book.TC-j7r rev=1 covers=g10adm.vault-money-book.SC-dgv,g10adm.vault-money-book.SC-fao,g10adm.vault-money-book.SC-lzi -->
### g10adm.vault-money-book.US5-TC6: The reminder ladder reads in words under the list

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-money-book-US-05

**Pre-conditions:**

* Staff is on the Overdue tab.

**Steps:**

1. Read below the arrears.

**Expected Results:**

* The reminder ladder reads in words.

## Settled

- The arrears sit behind the vault read grant; the money grant guards the register and the position alone.
- The register and the arrears page 50 rows at a time, at most 200 a call.
- The arrears tiles answer every loan the filter holds, not a page, and refuse nothing.
