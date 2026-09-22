# grade10-site/vault/documents-and-signing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

## grade10-site-vault-documents-and-signing-US1: Collector signs their case's papers at the counter

**As a** collector standing at the shop counter,
**I want** to read every page on the iPad, agree to sign electronically and
sign each document once,
**so that** I know exactly what I signed and leave with a copy of it.

### grade10-site-vault-documents-and-signing-US1-TC1-1: Storage-lane packet is read and signed in one ceremony

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

* A collector is on <the vault signing link> for <a case with a storage-lane packet ready to sign>, holding only the custody agreement.

**Steps:**

1. Turn every page of the custody agreement.
2. Tick the e-sign disclosure and the document's own consent.
3. Type <the case's verified legal name> and sign.

**Expected Results:**

* The packet seals in one transaction; a certificate page is appended to the custody agreement.
* The custody agreement prints the case, the verified legal name, the item, the valuation, the named shop and the date, with no other document attached.
* <the vault case page> shows the sealed document with its fingerprint.

### grade10-site-vault-documents-and-signing-US1-TC2-1: Financed packet seals two documents in one ceremony

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

* A collector is on <the vault signing link> for <a financed case, principal 500000 (HKD)>, whose packet carries the custody agreement and the loan agreement.

**Steps:**

1. Turn every page of both documents.
2. Tick the e-sign disclosure once and each document's own consent.
3. Type <the case's verified legal name> and sign both documents.

**Expected Results:**

* Both documents seal in the same transaction, each carrying its own certificate.
* The loan agreement prints the principal, the interest as a percentage for the term in days, the same rate per annum, `Fees: None`, the repayable amount and the borrower's own line that the key terms were explained.
* <the vault case page> shows both sealed documents, each with its own fingerprint.

### grade10-site-vault-documents-and-signing-US1-TC3-1: Signature is refused until every page has been turned

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-documents-and-signing-US-01

**Pre-conditions:**

* A collector is on <the vault signing link> for <a case with a storage-lane packet ready to sign>.

**Steps:**

1. Turn every page but the last.
2. Try to tick the document's own consent with the last page unturned.
3. Turn the last page and tick the document's own consent.

**Expected Results:**

* Step 2 refuses the tick; nothing is signed.
* Step 3 accepts the tick once every page has been turned.

### grade10-site-vault-documents-and-signing-US1-TC4-1: A typed name that does not match the verified legal name is refused

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
* **Trace:** grade10-site-vault-documents-and-signing-US-01

**Pre-conditions:**

* A collector has turned every page and ticked the consents on <the vault signing link> for <a case with a storage-lane packet ready to sign>.

**Steps:**

1. Type <a typed name that does not match the verified legal name>.
2. Try to sign.

**Expected Results:**

* Signing is refused; nothing seals.
* The packet stays ready for the verified legal name to sign.

### grade10-site-vault-documents-and-signing-US1-TC5-1: A signing link already used is refused on a second open

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
* **Trace:** grade10-site-vault-documents-and-signing-US-01

**Pre-conditions:**

* <the vault signing link> for <a case with a storage-lane packet ready to sign> has already sealed the packet.

**Steps:**

1. Open the same signing link again.

**Expected Results:**

* The link is refused as already used.
* No new certificate or seal is produced.

### grade10-site-vault-documents-and-signing-US1-TC6-1: A signing link opened after its 30-minute life is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-documents-and-signing-US-01

**Pre-conditions:**

* <the vault signing link> for <a case with a storage-lane packet ready to sign> was issued more than 30 minutes ago and never opened.

**Steps:**

1. Open the signing link.

**Expected Results:**

* The link is refused as expired.
* Nothing seals; the packet is unchanged.

### grade10-site-vault-documents-and-signing-US1-TC7-1: A signing link opened on a second device is refused

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
* **Trace:** grade10-site-vault-documents-and-signing-US-01

**Pre-conditions:**

* <the vault signing link> for <a case with a storage-lane packet ready to sign> was opened once already on the counter iPad.

**Steps:**

1. Open the same signing link on a second device.

**Expected Results:**

* The second device is refused; the link stays bound to the first.
* Nothing seals from the second device.

### grade10-site-vault-documents-and-signing-US1-TC8-1: Declining withdraws the whole packet and is itself recorded

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-documents-and-signing-US-01

**Pre-conditions:**

* A collector is on <the vault signing link> for <a financed case, principal 500000 (HKD)>, whose packet carries the custody agreement and the loan agreement, with every page turned.

**Steps:**

1. Choose to decline instead of signing.

**Expected Results:**

* Neither document seals; the whole packet withdraws together.
* The decline is itself written on the record, on the case's history.

### grade10-site-vault-documents-and-signing-US1-TC9-1: The sealed set reaches the collector by email

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
* **Trace:** grade10-site-vault-documents-and-signing-US-01

**Pre-conditions:**

* A collector has just sealed <a case with a storage-lane packet ready to sign>.

**Steps:**

1. Open <the collector's registered email>.

**Expected Results:**

* An email has arrived with the sealed PDF attached.

### grade10-site-vault-documents-and-signing-US1-TC10-1: Every sealed document appears on the case page with its fingerprint

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
* **Trace:** grade10-site-vault-documents-and-signing-US-01

**Pre-conditions:**

* A collector has just sealed <a financed case, principal 500000 (HKD)>, whose packet carries the custody agreement and the loan agreement.

**Steps:**

1. Navigate to <the vault case page>.

**Expected Results:**

* Both sealed documents are listed, each with its own fingerprint.
* The public verification address is shown beside them.

### grade10-site-vault-documents-and-signing-US1-TC11-1: Anyone holding a document's digest can verify it belongs to the vault

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-documents-and-signing-US-01

**Pre-conditions:**

* <a sealed document's SHA-256 digest> is known from a sealed case.

**Steps:**

1. Ask <the public document verification page> whether the digest is one of ours.

**Expected Results:**

* The answer confirms the digest belongs to a sealed vault document, computed fresh at the ask.

### grade10-site-vault-documents-and-signing-US1-TC12-1: A digest nobody issued fails verification

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
* **Trace:** grade10-site-vault-documents-and-signing-US-01

**Pre-conditions:**

* <a digest no sealed document carries> is at hand.

**Steps:**

1. Ask <the public document verification page> whether the digest is one of ours.

**Expected Results:**

* The answer says the digest is not one of ours.

---

## grade10-site-vault-documents-and-signing-US3: Operator prepares the papers for the visit in front of them

**As a** member of shop staff,
**I want** the packet to carry exactly the documents this case's lane needs,
naming the shop and the person we checked,
**so that** nothing is handed over to sign that we could not be held to.

### grade10-site-vault-documents-and-signing-US3-TC1-1: A storage-lane packet is prepared naming the shop, custody agreement only

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
* **Trace:** grade10-site-vault-documents-and-signing-US-03

**Pre-conditions:**

* admin(holds vault:operate) is on <a case ready for its visit, naming a shop>, on the storage lane.

**Steps:**

1. Prepare the packet.

**Expected Results:**

* No key-terms dialog opens for the storage lane.
* The packet carries the custody agreement only, naming the shop.

### grade10-site-vault-documents-and-signing-US3-TC2-1: A financed packet is prepared after the key terms are ticked and recorded

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
* **Trace:** grade10-site-vault-documents-and-signing-US-03

**Pre-conditions:**

* admin(holds vault:operate) is on <a case ready for its visit, naming a shop>, on the financed lane.

**Steps:**

1. Open <the key-terms dialog> and tick every term the loan agreement states.
2. Record the key terms as explained.
3. Prepare the packet.

**Expected Results:**

* The key terms recorded are the loan agreement's own list, unchanged from the agreement.
* Prepare documents is offered once the key terms are recorded.
* The packet carries the custody agreement and the loan agreement, naming the shop.

### grade10-site-vault-documents-and-signing-US3-TC3-1: Recording the key terms is refused until every term is ticked

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-documents-and-signing-US-03

**Pre-conditions:**

* admin(holds vault:operate) is on <a case ready for its visit, naming a shop>, on the financed lane, with <the key-terms dialog> open.

**Steps:**

1. Tick every term but one.
2. Try to record.
3. Tick the remaining term and record.

**Expected Results:**

* Step 2 refuses to record; nothing is stored as explained.
* Step 3 records the key terms once every term is ticked.

### grade10-site-vault-documents-and-signing-US3-TC4-1: A loan packet cannot open before the key terms are recorded

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-documents-and-signing-US-03

**Pre-conditions:**

* admin(holds vault:operate) is on <a case ready for its visit, naming a shop>, on the financed lane, with the key terms not yet recorded.

**Steps:**

1. Try to prepare the packet.

**Expected Results:**

* Preparing the packet is refused; the loan agreement is not included.
* The key-terms dialog is offered instead.

### grade10-site-vault-documents-and-signing-US3-TC5-1: A packet that can name no shop is refused at the counter

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-documents-and-signing-US-03

**Pre-conditions:**

* admin(holds vault:operate) is on <a case with no shop the packet can name>.

**Steps:**

1. Try to prepare the packet.

**Expected Results:**

* Preparing the packet is refused, naming that no shop can be held to it.
* No document is produced.

### grade10-site-vault-documents-and-signing-US3-TC6-1: The key terms are recorded with or without a recording reference

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-vault-documents-and-signing-US-03

**Pre-conditions:**

* admin(holds vault:operate) is on <a case ready for its visit, naming a shop>, on the financed lane, with every key term ticked in <the key-terms dialog>.

**Test data:**

| Recording reference | Outcome |
| --- | --- |
| <a recording reference> | Recorded, with the reference stored beside it |
| None | Recorded, with no reference stored |

**Steps:**

1. Enter the row's recording reference, or leave it blank.
2. Record the key terms as explained.

**Expected Results:**

* The key terms are recorded as explained, when · by, matching the row's outcome.

### grade10-site-vault-documents-and-signing-US3-TC7-1: A packet outside its preparation window is refused

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
* **Trace:** grade10-site-vault-documents-and-signing-US-03

**Pre-conditions:**

* admin(holds vault:operate) is on <a case ready for its visit, naming a shop>, whose packet's preparation window has closed.

**Steps:**

1. Try to open the prepared packet for signing.

**Expected Results:**

* The packet is refused as outside its window.
* The packet must be prepared again before it can be signed.

---

## grade10-site-vault-documents-and-signing-US5: Collector downloads every document they ever signed

**As a** collector,
**I want** every sealed document from every case in one download, each with
its fingerprint,
**so that** I hold my own record without opening each case in turn.

### grade10-site-vault-documents-and-signing-US5-TC1-1: Every sealed document across every case downloads in one file

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
* **Trace:** grade10-site-vault-documents-and-signing-US-05

**Pre-conditions:**

* A collector holding <every case whose documents are sealed> is on <the collector's Your data page>.

**Steps:**

1. Click Download all.

**Expected Results:**

* One file downloads, carrying every sealed document the collector holds, each with its own fingerprint.

### grade10-site-vault-documents-and-signing-US5-TC2-1: Download all is absent when nothing has been signed yet

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
* **Trace:** grade10-site-vault-documents-and-signing-US-05

**Pre-conditions:**

* A collector on <a collector account with no signed documents> is on <the collector's Your data page>.

**Steps:**

1. Look for Download all.

**Expected Results:**

* Download all is absent; nothing has been signed yet.

### grade10-site-vault-documents-and-signing-US5-TC3-1: The download shows a pending state while in flight

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
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
* **Status:** draft
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

### grade10-site-vault-documents-and-signing-US5-TC5-1: The bundle is bounded to only the cases the page lists

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-documents-and-signing-US-05

**Pre-conditions:**

* A collector holding <every case whose documents are sealed> is on <the collector's Your data page>.

**Steps:**

1. Click Download all.

**Expected Results:**

* The file carries only documents from cases the page lists; no other collector's case is included.

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

* A collector holding <every case whose documents are sealed> is on <the collector's Your data page>.

**Steps:**

1. Click Download all.

**Expected Results:**

* The audit chain gains an entry naming who downloaded, when, and how many documents.
