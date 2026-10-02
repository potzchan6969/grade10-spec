# grade10-site/vault/documents-and-signing Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-vault-documents-and-signing-US1: Collector signs their case's papers at the counter

**As a** collector standing at the shop counter,
**I want** to read every page on the iPad, agree to sign electronically and
sign each document once,
**so that** I know exactly what I signed and leave with a copy of it.

### grade10-site-vault-documents-and-signing-US1-TC1-2: Storage-lane packet is read and signed in one ceremony

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-01

**Pre-conditions:**

* A collector is on `<the vault signing link>` for `<a case with a storage-lane packet ready to sign>`, holding only the custody agreement.
* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.

**Steps:**

1. Turn every page of the custody agreement.
2. Tick the e-sign disclosure and the document's own consent.
3. Type `<the case's verified legal name>` and sign.
4. Ask for the collector's own read of the case.

**Expected Results:**

* The packet seals in one transaction; a certificate page is appended to the custody agreement.
* The custody agreement prints the case, the verified legal name, the item, the valuation, the named shop and the date, with no other document attached.
* Step 4 lists the sealed document with its fingerprint.

### grade10-site-vault-documents-and-signing-US1-TC2-2: Financed packet seals two documents in one ceremony

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-01

**Pre-conditions:**

* A collector is on `<the vault signing link>` for `<a financed case, principal 500000 (HKD)>`, whose packet carries the custody agreement and the loan agreement.
* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.

**Steps:**

1. Turn every page of both documents.
2. Tick the e-sign disclosure once and each document's own consent.
3. Type `<the case's verified legal name>` and sign both documents.
4. Ask for the collector's own read of the case.

**Expected Results:**

* Both documents seal in the same transaction, each carrying its own certificate.
* The loan agreement prints the principal, the interest as a percentage for the term in days, the same rate per annum, `Fees: None`, the repayable amount and the borrower's own line that the key terms were explained.
* Step 4 lists both sealed documents, each with its own fingerprint.

### grade10-site-vault-documents-and-signing-US1-TC10-2: The collector's own read lists every sealed document with its fingerprint

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
* **Trace:** grade10-site-vault-documents-and-signing-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's financed case; its packet is sealed, holding the custody agreement and the loan agreement.

**Steps:**

1. Ask for the collector's own read of `<case_1>`.
2. Take each sealed document the API response lists.
3. Compute each taken document's digest.

**Expected Results:**

* Step 1 lists the custody agreement and the loan agreement, each with its fingerprint, and the packet with its own.
* Step 2 serves both documents.
* Each step 3 digest equals the fingerprint step 1 listed for it.

---

## grade10-site-vault-documents-and-signing-US5: Collector downloads every document they ever signed

**As a** collector,
**I want** every sealed document from every case in one download, each with
its fingerprint,
**so that** I hold my own record without opening each case in turn.

### grade10-site-vault-documents-and-signing-US5-TC1-2: The one download holds every sealed document the collector's read lists

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
* **Trace:** grade10-site-vault-documents-and-signing-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector holds sealed documents on two closed cases, `<case_1>` and `<case_2>`.
* customer B, another collector, holds sealed documents of their own.

**Steps:**

1. Ask for Your data.
2. Take the one download of every document.
3. Open the bundle.

**Expected Results:**

* Step 1 carries the sealed documents of `<case_1>` and `<case_2>`.
* Step 3 holds every sealed document step 1 lists, each with its fingerprint.
* Step 3 holds nothing step 1 does not list, and none of customer B's documents.

### grade10-site-vault-documents-and-signing-US5-TC2-2: A collector who has signed nothing is carried none and downloads an empty file

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
* **Trace:** grade10-site-vault-documents-and-signing-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector's cases hold no sealed document.

**Steps:**

1. Ask for Your data.
2. Take the download anyway.

**Expected Results:**

* Step 1 carries no signed document.
* Step 2 serves an empty archive.

### grade10-site-vault-documents-and-signing-US5-TC3-1: The download shows a pending state while in flight

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-vault-documents-and-signing-US-05

**Pre-conditions:**

* A collector holding <every case whose documents are sealed> is on <the collector's Your data page>.

**Steps:**

1. Click Download all.

**Expected Results:**

* Download all shows pending while the file is being built.

### grade10-site-vault-documents-and-signing-US5-TC4-1: A failed download surfaces its error and can be retried

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-documents-and-signing-US-05

**Pre-conditions:**

* A collector holding <every case whose documents are sealed> is on <the collector's Your data page>, with the download stubbed to fail.

**Steps:**

1. Click Download all.

**Expected Results:**

* An error line appears under the button; no file downloads.
* Download all is available again to retry.

### grade10-site-vault-documents-and-signing-US5-TC5-2: The bundle is bounded to only the cases the page lists

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-documents-and-signing-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector holds sealed documents on more cases than one page of Your data answers for.

**Steps:**

1. Ask for the first page of Your data.
2. Take the download, naming the cursor step 1 was read at.

**Expected Results:**

* The file carries only documents from cases step 1 lists; no other collector's case is included.

### grade10-site-vault-documents-and-signing-US5-TC6-2: The bulk download is recorded on the audit chain like a search

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-documents-and-signing-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector holds sealed documents on their own cases.

**Steps:**

1. Take the download.

**Expected Results:**

* The audit chain gains an entry naming who downloaded, when, and how many documents.

### grade10-site-vault-documents-and-signing-US5-TC7-2: A download past 52,428,800 bytes is refused before anything is read

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-documents-and-signing-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector's sealed documents come to more than 52,428,800 bytes together.

**Steps:**

1. Take the download.

**Expected Results:**

* The download is refused by name, before any document is read.
* No file is sent, and no document is recorded as read.

### grade10-site-vault-documents-and-signing-US5-TC9-1: The one download is refused without a session

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
* **Trace:** grade10-site-vault-documents-and-signing-US-05

**Pre-conditions:**

* The tester holds no session on <grade10 site url>.
* Collectors hold sealed documents in the vault.

**Steps:**

1. Ask for the one download of every document, with no session.

**Expected Results:**

* Step 1 is refused.
* No document is served.

## Settled

- **A collector who signed nothing** - Your data carries no signed document, and the download taken anyway is an empty archive (Q18)

## Reconciliation

**Run:** QA2, 2026-10-02, for change `retire-vault-collector-site`. QA1's blind pass read the Feature set, the journeys, `decisions.md` through Q15, the proposal and the durable suite; it was denied every requirement. QA2 read both suites, this delta, `tech-design.md`, `tasks.md` and the worker they name: `routes/documents.ts` with `documents.test.ts`, and `cases/yourData.ts`. It is a statement, not proof.

- **Raised, folded into spec** - the download refused with no session, from `grade10-site-vault-documents-and-signing-US5-TC9-1`, as `grade10-site-vault-documents-and-signing-SC-38`, cited in task 2.6
- **Raised, escalated** - the empty collector's download, landed as Q18
- **Raised, rejected** - none
- **Re-versioned to the API** - every case whose behaviour the worker keeps and whose run read the case page or Your data: `grade10-site-vault-documents-and-signing-US1-TC1-2`, `grade10-site-vault-documents-and-signing-US1-TC2-2`, `grade10-site-vault-documents-and-signing-US1-TC10-2`, `grade10-site-vault-documents-and-signing-US5-TC1-2`, `grade10-site-vault-documents-and-signing-US5-TC2-2`, `grade10-site-vault-documents-and-signing-US5-TC5-2`, `grade10-site-vault-documents-and-signing-US5-TC6-2`, `grade10-site-vault-documents-and-signing-US5-TC7-2`; `grade10-site-vault-documents-and-signing-US1-TC1-2` and `grade10-site-vault-documents-and-signing-US1-TC2-2` still sign at the ceremony and read the sealed documents back through the API
- **Deprecated** - the cases whose subject is a removed screen: `grade10-site-vault-documents-and-signing-US5-TC3-1` and `grade10-site-vault-documents-and-signing-US5-TC4-1`, the download's pending and failed states
- **Carried into a bump** - QA1's new ids that re-covered an earlier case leave the delta: `US1-TC13-1` into `grade10-site-vault-documents-and-signing-US1-TC10-2`; `US5-TC8-1` into `grade10-site-vault-documents-and-signing-US5-TC1-2`; `US5-TC10-1` into `grade10-site-vault-documents-and-signing-US5-TC2-2`
- **New ids kept** - `grade10-site-vault-documents-and-signing-US5-TC9-1`, the download with no session
- **Joined** - `grade10-site-vault-documents-and-signing-SC-17` into `grade10-site-vault-documents-and-signing-US1-TC10-2`; `-SC-26` into `grade10-site-vault-documents-and-signing-US5-TC1-2`; `-SC-27` into `grade10-site-vault-documents-and-signing-US5-TC2-2`
- **Contradicted** - none
- **Uncovered anchors** - none
- **Automated cases re-versioned** - `grade10-site-vault-documents-and-signing-US1-TC1-2`, `grade10-site-vault-documents-and-signing-US1-TC2-2`, `grade10-site-vault-documents-and-signing-US1-TC10-2` were decided by `visit.spec.ts`, and `grade10-site-vault-documents-and-signing-US5-TC2-2` by `your-data.spec.ts`, at `-1`; each is `manual` until task 4.4 retitles its walk and flips it
