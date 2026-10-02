# grade10-site/vault/documents-and-signing Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-vault-documents-and-signing-US1: Collector signs their case's papers at the counter

**As a** collector standing at the shop counter,
**I want** to read every page on the iPad, agree to sign electronically and
sign each document once,
**so that** I know exactly what I signed and leave with a copy of it.

### grade10-site-vault-documents-and-signing-US1-TC13-1: The collector's own read lists every sealed document with its fingerprint

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

### grade10-site-vault-documents-and-signing-US5-TC2-1: Download all is absent when nothing has been signed yet

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-documents-and-signing-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**

* A collector on <a collector account with no signed documents> is on <the collector's Your data page>.

**Steps:**

1. Look for Download all.

**Expected Results:**

* Download all is absent; nothing has been signed yet.

---

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

---

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

---

### grade10-site-vault-documents-and-signing-US5-TC8-1: The one download holds every sealed document the collector's read lists

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

---

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

---

### grade10-site-vault-documents-and-signing-US5-TC1-1: Every sealed document across every case downloads in one file

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-05

**Pre-conditions:**

* A collector holding <every case whose documents are sealed> is on <the collector's Your data page>.

**Steps:**

1. Click Download all.

**Expected Results:**

* One file downloads, carrying every sealed document the collector holds, each with its own fingerprint.

---

### grade10-site-vault-documents-and-signing-US5-TC5-1: The bundle is bounded to only the cases the page lists

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

---

### grade10-site-vault-documents-and-signing-US5-TC6-1: The bulk download is recorded on the audit chain like a search

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

---

### grade10-site-vault-documents-and-signing-US5-TC7-1: A download past 52,428,800 bytes is refused before anything is read

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

---

### grade10-site-vault-documents-and-signing-US5-TC10-1: A collector who has signed nothing is carried none and downloads an empty file

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

## Settled

- **A collector who signed nothing** - Your data carries no signed document, and the download taken anyway is an empty archive (Q18)

## Reconciliation

**Run:** QA2, 2026-10-02, for change `retire-vault-collector-site`. QA1's blind pass read the Feature set, the journeys, `decisions.md` through Q15, the proposal and the durable suite; it was denied every requirement. QA2 read both suites, this delta, `tech-design.md`, `tasks.md` and the worker they name: `routes/documents.ts` with `documents.test.ts`, and `cases/yourData.ts`. It is a statement, not proof.

- **Raised, folded into spec** - the download refused with no session, from `grade10-site-vault-documents-and-signing-US5-TC9-1`, as `grade10-site-vault-documents-and-signing-SC-38`, cited in task 2.6
- **Raised, escalated** - the empty collector's download, landed as Q18
- **Raised, rejected** - none
- **Revised** - `grade10-site-vault-documents-and-signing-US5-TC5-1`, `grade10-site-vault-documents-and-signing-US5-TC6-1`, `grade10-site-vault-documents-and-signing-US5-TC7-1` take the download through the API, keeping `<v>`
- **Deprecated as duplicates** - `grade10-site-vault-documents-and-signing-US5-TC1-1`; `grade10-site-vault-documents-and-signing-US5-TC8-1` holds its purpose
- **Joined** - `grade10-site-vault-documents-and-signing-SC-17` into `grade10-site-vault-documents-and-signing-US1-TC13-1`; `grade10-site-vault-documents-and-signing-SC-26` into `grade10-site-vault-documents-and-signing-US5-TC8-1`
- **Corrected** - `grade10-site-vault-documents-and-signing-US5-TC8-1` reads Your data, the download's bound, where it read each case
- **Added by QA2** - `grade10-site-vault-documents-and-signing-US5-TC10-1` for `grade10-site-vault-documents-and-signing-SC-27`
- **Contradicted** - none
- **Uncovered anchors** - none
- **Still walking a removed screen** - automated `grade10-site-vault-documents-and-signing-US1-TC1-1`, `-US1-TC2-1`, `-US1-TC10-1`
