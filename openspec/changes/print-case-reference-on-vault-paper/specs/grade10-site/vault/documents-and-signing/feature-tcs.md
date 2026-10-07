# grade10-site/vault/documents-and-signing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-07, tcs-rules r4

## grade10-site-vault-documents-and-signing-US7: Collector recognises their case on the signed paper

**As a** collector holding a signed agreement or a release receipt,
**I want** the paper to name my case by the reference my letters carry and I
type at my bank,
**so that** I can tell which case a paper belongs to and quote it at the
counter.

### grade10-site-vault-documents-and-signing-US7-TC1-1: Each document in a prepared packet names the case by its reference alone

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-07

**Pre-conditions:**

* admin(staff) is on the Documents tab of <grade10 admin vault case page url> for `<case_1>`, accepted, ready to prepare, on the row's lane.
* `<case_1>` carries `<reference_1>`, as the collector's own read of it names.
* On the financed row, the key terms are recorded as explained.

**Test data:**

| Lane | Documents in the packet |
| --- | --- |
| storage | custody agreement |
| financed | custody agreement, loan agreement |

**Steps:**

1. Click Prepare documents.
2. Open each document in the packet.
3. Read the case each document names in its facts.
4. Read each document's footer.

**Expected Results:**

* Step 1 prepares the row's documents.
* Step 3 reads `<reference_1>` on each document.
* Step 4 reads `<reference_1>` on each document.
* No document prints `<case_1>`'s id.

### grade10-site-vault-documents-and-signing-US7-TC2-1: The release receipt names the case by its reference alone

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-07

**Pre-conditions:**

* admin(staff) is on the Documents tab of <grade10 admin vault case page url> for `<case_5>`, vaulted and owing nothing.
* `<case_5>` carries `<reference_5>`, as the collector's own read of it names.

**Steps:**

1. Prepare the release receipt.
2. Open the receipt in its packet.
3. Read the case the receipt names in its facts.
4. Read the receipt's footer.

**Expected Results:**

* Step 3 reads `<reference_5>`.
* Step 4 reads `<reference_5>`.
* The receipt prints `<case_5>`'s id nowhere.

### grade10-site-vault-documents-and-signing-US7-TC3-1: Every copy of a sealed agreement keeps the reference it was prepared with

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-07

**Pre-conditions:**

* A collector is on `<the vault signing link>` for `<case_1>`'s storage-lane packet, holding only the custody agreement.
* `<case_1>` carries `<reference_1>`, as the collector's own read of it names.
* `<collector email>` is the collector's mailbox, which the tester reads.

**Steps:**

1. Turn every page of the custody agreement.
2. Tick the e-sign disclosure and the document's own consent.
3. Type `<the case's verified legal name>` and sign.
4. Download the sealed custody agreement where the ceremony ends.
5. Open the custody agreement the mail to `<collector email>` carries.
6. As the collector, take the sealed custody agreement from their own read of `<case_1>`.

**Expected Results:**

* Steps 4, 5 and 6 each name the case as `<reference_1>` in the facts and the footer.
* None of the three copies prints `<case_1>`'s id.

### grade10-site-vault-documents-and-signing-US7-TC4-1: Two cases of one collector each print their own reference

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-07

**Pre-conditions:**

* `<collector A>` owns `<case_1>`, carrying `<reference_1>`, and `<case_2>`, carrying `<reference_2>`.
* Both cases are on the storage lane, accepted and ready to prepare.
* admin(staff) is on the Documents tab of <grade10 admin vault case page url> for `<case_1>`.

**Steps:**

1. Click Prepare documents.
2. Open the custody agreement in the packet.
3. Navigate to the Documents tab of <grade10 admin vault case page url> for `<case_2>`.
4. Click Prepare documents.
5. Open the custody agreement in the packet.

**Expected Results:**

* Step 2 names `<reference_1>` and never `<reference_2>`.
* Step 5 names `<reference_2>` and never `<reference_1>`.

---

## grade10-site-vault-documents-and-signing-US8: Operator finds the case a signed paper names

**As a** member of shop staff handed a signed document,
**I want** to search the console by the case the paper prints,
**so that** I open that case without asking the collector for anything else.

### grade10-site-vault-documents-and-signing-US8-TC1-1: A release receipt's reference finds the collected case

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-08

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault queue url>.
* `<case_5>`'s item has been collected; its sealed release receipt prints `<reference_5>`.

**Steps:**

1. Type `<reference_5>` into the search.
2. Submit the search.
3. Click the case the search returns.

**Expected Results:**

* Step 2 returns `<case_5>` alone.
* Step 3 opens `<case_5>`'s page, its address keyed by the case id.

### grade10-site-vault-documents-and-signing-US8-TC2-1: A reference no case holds finds no case

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-08

**Pre-conditions:**

* admin(holds vault:read) is on <grade10 admin vault queue url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<unissued reference>` | Six characters of the reference alphabet that no Grade10 case holds |

**Steps:**

1. Type `<unissued reference>` into the search.
2. Submit the search.

**Expected Results:**

* Step 2 returns no case.
* No case page opens.
