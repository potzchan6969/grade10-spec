# grade10-site/vault/documents-and-signing Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-07, tcs-rules r4
**Out of suite:** grade10-site-vault-documents-and-signing-SC-42 - the behaviour suite `packages/vault/backend/src/testing/suites/registerPaper.ts` in the application repository; it serves US-04, the auditor's journey, which no customer or admin walks (tasks 2.1, 2.4)

## grade10-site-vault-documents-and-signing-US1: Collector signs their case's papers at the counter

**As a** collector standing at the shop counter,
**I want** to read every page on the iPad, agree to sign electronically and
sign each document once,
**so that** I know exactly what I signed and leave with a copy of it.

<!-- trace:case id=g10.vault-documents-and-signing.TC-nv7 rev=2 covers=g10.vault-documents-and-signing.SC-h1q,g10.vault-documents-and-signing.SC-k3s,g10.vault-documents-and-signing.SC-22x,g10.vault-documents-and-signing.SC-3o8,g10.vault-documents-and-signing.SC-faf,g10.vault-documents-and-signing.SC-leu -->
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

<!-- trace:case id=g10.vault-documents-and-signing.TC-3v2 rev=2 covers=g10.vault-documents-and-signing.SC-h1q,g10.vault-documents-and-signing.SC-k3s,g10.vault-documents-and-signing.SC-22x,g10.vault-documents-and-signing.SC-3o8,g10.vault-documents-and-signing.SC-faf,g10.vault-documents-and-signing.SC-leu -->
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

<!-- trace:case id=g10.vault-documents-and-signing.TC-gjg rev=1 covers=g10.vault-documents-and-signing.SC-h1q,g10.vault-documents-and-signing.SC-k3s,g10.vault-documents-and-signing.SC-22x,g10.vault-documents-and-signing.SC-3o8,g10.vault-documents-and-signing.SC-faf,g10.vault-documents-and-signing.SC-leu -->
### grade10-site-vault-documents-and-signing-US1-TC3-1: Signature is refused until every page has been turned

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-documents-and-signing-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* A collector is on <the vault signing link> for <a case with a storage-lane packet ready to sign>.

**Steps:**

1. Turn every page but the last.
2. Try to tick the document's own consent with the last page unturned.
3. Turn the last page and tick the document's own consent.

**Expected Results:**

* Step 2 refuses the tick; nothing is signed.
* Step 3 accepts the tick once every page has been turned.

<!-- trace:case id=g10.vault-documents-and-signing.TC-u80 rev=1 covers=g10.vault-documents-and-signing.SC-h1q,g10.vault-documents-and-signing.SC-k3s,g10.vault-documents-and-signing.SC-22x,g10.vault-documents-and-signing.SC-3o8,g10.vault-documents-and-signing.SC-faf,g10.vault-documents-and-signing.SC-leu -->
### grade10-site-vault-documents-and-signing-US1-TC4-1: A typed name that does not match the verified legal name is refused

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
* **Trace:** grade10-site-vault-documents-and-signing-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* A collector has turned every page and ticked the consents on <the vault signing link> for <a case with a storage-lane packet ready to sign>.

**Steps:**

1. Type <a typed name that does not match the verified legal name>.
2. Try to sign.

**Expected Results:**

* Signing is refused; nothing seals.
* The packet stays ready for the verified legal name to sign.

<!-- trace:case id=g10.vault-documents-and-signing.TC-6wd rev=1 covers=g10.vault-documents-and-signing.SC-h1q,g10.vault-documents-and-signing.SC-k3s,g10.vault-documents-and-signing.SC-22x,g10.vault-documents-and-signing.SC-3o8,g10.vault-documents-and-signing.SC-faf,g10.vault-documents-and-signing.SC-leu -->
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

1. Open the same signing link again, on the device that signed.

**Expected Results:**

* The link is refused by name, and no document is shown.
* No further signature or seal is taken.

<!-- trace:case id=g10.vault-documents-and-signing.TC-f9a rev=1 covers=g10.vault-documents-and-signing.SC-h1q,g10.vault-documents-and-signing.SC-k3s,g10.vault-documents-and-signing.SC-22x,g10.vault-documents-and-signing.SC-3o8,g10.vault-documents-and-signing.SC-faf,g10.vault-documents-and-signing.SC-leu -->
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

<!-- trace:case id=g10.vault-documents-and-signing.TC-d5e rev=1 covers=g10.vault-documents-and-signing.SC-h1q,g10.vault-documents-and-signing.SC-k3s,g10.vault-documents-and-signing.SC-22x,g10.vault-documents-and-signing.SC-3o8,g10.vault-documents-and-signing.SC-faf,g10.vault-documents-and-signing.SC-leu -->
### grade10-site-vault-documents-and-signing-US1-TC7-1: A signing link opened on a second device is refused

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
* **Trace:** grade10-site-vault-documents-and-signing-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* <the vault signing link> for <a case with a storage-lane packet ready to sign> was opened once already on the counter iPad.

**Steps:**

1. Open the same signing link on a second device.

**Expected Results:**

* The second device is refused; the link stays bound to the first.
* Nothing seals from the second device.

<!-- trace:case id=g10.vault-documents-and-signing.TC-3p4 rev=1 covers=g10.vault-documents-and-signing.SC-h1q,g10.vault-documents-and-signing.SC-k3s,g10.vault-documents-and-signing.SC-22x,g10.vault-documents-and-signing.SC-3o8,g10.vault-documents-and-signing.SC-faf,g10.vault-documents-and-signing.SC-leu -->
### grade10-site-vault-documents-and-signing-US1-TC8-1: Declining withdraws the whole packet and is itself recorded

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-documents-and-signing-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* A collector is on <the vault signing link> for <a financed case, principal 500000 (HKD)>, whose packet carries the custody agreement and the loan agreement, with every page turned.

**Steps:**

1. Choose to decline instead of signing.

**Expected Results:**

* Neither document seals; the whole packet withdraws together.
* The decline is itself written on the record, on the case's history.

<!-- trace:case id=g10.vault-documents-and-signing.TC-qg7 rev=1 covers=g10.vault-documents-and-signing.SC-h1q,g10.vault-documents-and-signing.SC-k3s,g10.vault-documents-and-signing.SC-22x,g10.vault-documents-and-signing.SC-3o8,g10.vault-documents-and-signing.SC-faf,g10.vault-documents-and-signing.SC-leu -->
### grade10-site-vault-documents-and-signing-US1-TC9-1: The sealed set reaches the collector by email

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
* **Trace:** grade10-site-vault-documents-and-signing-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* A collector has just sealed <a case with a storage-lane packet ready to sign>.

**Steps:**

1. Open <the collector's registered email>.

**Expected Results:**

* An email has arrived with the sealed PDF attached.

<!-- trace:case id=g10.vault-documents-and-signing.TC-3zb rev=2 covers=g10.vault-documents-and-signing.SC-h1q,g10.vault-documents-and-signing.SC-k3s,g10.vault-documents-and-signing.SC-22x,g10.vault-documents-and-signing.SC-3o8,g10.vault-documents-and-signing.SC-faf,g10.vault-documents-and-signing.SC-leu -->
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

<!-- trace:case id=g10.vault-documents-and-signing.TC-svw rev=1 covers=g10.vault-documents-and-signing.SC-h1q,g10.vault-documents-and-signing.SC-k3s,g10.vault-documents-and-signing.SC-22x,g10.vault-documents-and-signing.SC-3o8,g10.vault-documents-and-signing.SC-faf,g10.vault-documents-and-signing.SC-leu -->
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
* The asker is not signed in.

**Steps:**

1. Ask <the public document verification page> whether the digest is one of ours.

**Expected Results:**

* The answer says the digest is a document the vault sealed.
* It names the template and when the document was completed.
* It names nobody.

<!-- trace:case id=g10.vault-documents-and-signing.TC-slm rev=1 covers=g10.vault-documents-and-signing.SC-h1q,g10.vault-documents-and-signing.SC-k3s,g10.vault-documents-and-signing.SC-22x,g10.vault-documents-and-signing.SC-3o8,g10.vault-documents-and-signing.SC-faf,g10.vault-documents-and-signing.SC-leu -->
### grade10-site-vault-documents-and-signing-US1-TC12-1: A digest nobody issued fails verification

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-documents-and-signing-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

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

<!-- trace:case id=g10.vault-documents-and-signing.TC-piq rev=1 covers=g10.vault-documents-and-signing.SC-m42,g10.vault-documents-and-signing.SC-1ll,g10.vault-documents-and-signing.SC-l9w,g10.vault-documents-and-signing.SC-iz4,g10.vault-documents-and-signing.SC-h2m,g10.vault-documents-and-signing.SC-z0d,g10.vault-documents-and-signing.SC-i4k,g10.vault-documents-and-signing.SC-kzm -->
### grade10-site-vault-documents-and-signing-US3-TC1-1: A storage-lane packet is prepared naming the shop, custody agreement only

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* admin(holds vault:operate) is on <a case ready for its visit, naming a shop>, on the storage lane.

**Steps:**

1. Prepare the packet.

**Expected Results:**

* No key-terms dialog opens for the storage lane.
* The packet carries the custody agreement only, naming the shop.

<!-- trace:case id=g10.vault-documents-and-signing.TC-v8n rev=1 covers=g10.vault-documents-and-signing.SC-m42,g10.vault-documents-and-signing.SC-1ll,g10.vault-documents-and-signing.SC-l9w,g10.vault-documents-and-signing.SC-iz4,g10.vault-documents-and-signing.SC-h2m,g10.vault-documents-and-signing.SC-z0d,g10.vault-documents-and-signing.SC-i4k,g10.vault-documents-and-signing.SC-kzm -->
### grade10-site-vault-documents-and-signing-US3-TC2-1: A financed packet is prepared after the key terms are ticked and recorded

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

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

<!-- trace:case id=g10.vault-documents-and-signing.TC-mzb rev=1 covers=g10.vault-documents-and-signing.SC-m42,g10.vault-documents-and-signing.SC-1ll,g10.vault-documents-and-signing.SC-l9w,g10.vault-documents-and-signing.SC-iz4,g10.vault-documents-and-signing.SC-h2m,g10.vault-documents-and-signing.SC-z0d,g10.vault-documents-and-signing.SC-i4k,g10.vault-documents-and-signing.SC-kzm -->
### grade10-site-vault-documents-and-signing-US3-TC3-1: Recording the key terms is refused until every term is ticked

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-documents-and-signing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* admin(holds vault:operate) is on <a case ready for its visit, naming a shop>, on the financed lane, with <the key-terms dialog> open.

**Steps:**

1. Tick every term but one.
2. Try to record.
3. Tick the remaining term and record.

**Expected Results:**

* Step 2 refuses to record; nothing is stored as explained.
* Step 3 records the key terms once every term is ticked.

<!-- trace:case id=g10.vault-documents-and-signing.TC-rud rev=1 covers=g10.vault-documents-and-signing.SC-m42,g10.vault-documents-and-signing.SC-1ll,g10.vault-documents-and-signing.SC-l9w,g10.vault-documents-and-signing.SC-iz4,g10.vault-documents-and-signing.SC-h2m,g10.vault-documents-and-signing.SC-z0d,g10.vault-documents-and-signing.SC-i4k,g10.vault-documents-and-signing.SC-kzm -->
### grade10-site-vault-documents-and-signing-US3-TC4-1: A loan packet cannot open before the key terms are recorded

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-documents-and-signing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* admin(holds vault:operate) is on <a case ready for its visit, naming a shop>, on the financed lane, with the key terms not yet recorded.

**Steps:**

1. Try to prepare the packet.

**Expected Results:**

* Preparing the packet is refused; the loan agreement is not included.
* The key-terms dialog is offered instead.

<!-- trace:case id=g10.vault-documents-and-signing.TC-je7 rev=1 covers=g10.vault-documents-and-signing.SC-m42,g10.vault-documents-and-signing.SC-1ll,g10.vault-documents-and-signing.SC-l9w,g10.vault-documents-and-signing.SC-iz4,g10.vault-documents-and-signing.SC-h2m,g10.vault-documents-and-signing.SC-z0d,g10.vault-documents-and-signing.SC-i4k,g10.vault-documents-and-signing.SC-kzm -->
### grade10-site-vault-documents-and-signing-US3-TC5-1: A packet that can name no shop is refused at the counter

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-documents-and-signing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

**Pre-conditions:**

* admin(holds vault:operate) is on <a case with no shop the packet can name>.

**Steps:**

1. Try to prepare the packet.

**Expected Results:**

* Preparing the packet is refused, naming that no shop can be held to it.
* No document is produced.

<!-- trace:case id=g10.vault-documents-and-signing.TC-0wv rev=1 covers=g10.vault-documents-and-signing.SC-m42,g10.vault-documents-and-signing.SC-1ll,g10.vault-documents-and-signing.SC-l9w,g10.vault-documents-and-signing.SC-iz4,g10.vault-documents-and-signing.SC-h2m,g10.vault-documents-and-signing.SC-z0d,g10.vault-documents-and-signing.SC-i4k,g10.vault-documents-and-signing.SC-kzm -->
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
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-documents-and-signing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/visit.spec.ts`

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

<!-- trace:case id=g10.vault-documents-and-signing.TC-scy rev=1 covers=g10.vault-documents-and-signing.SC-m42,g10.vault-documents-and-signing.SC-1ll,g10.vault-documents-and-signing.SC-l9w,g10.vault-documents-and-signing.SC-iz4,g10.vault-documents-and-signing.SC-h2m,g10.vault-documents-and-signing.SC-z0d,g10.vault-documents-and-signing.SC-i4k,g10.vault-documents-and-signing.SC-kzm -->
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

<!-- trace:case id=g10.vault-documents-and-signing.TC-9m6 rev=1 covers=g10.vault-documents-and-signing.SC-m42,g10.vault-documents-and-signing.SC-1ll,g10.vault-documents-and-signing.SC-l9w,g10.vault-documents-and-signing.SC-iz4,g10.vault-documents-and-signing.SC-h2m,g10.vault-documents-and-signing.SC-z0d,g10.vault-documents-and-signing.SC-i4k,g10.vault-documents-and-signing.SC-kzm -->
### grade10-site-vault-documents-and-signing-US3-TC8-1: The worker refuses a packet while the register names another owner

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
* **Trace:** grade10-site-vault-documents-and-signing-US-03

**Pre-conditions:**

* admin(staff) holds `vault:operate`.
* `<case_4>` of `<collector A>` is accepted, ready to prepare; its item `<item_4>` is owned by `<collector B>`.

**Steps:**

1. Send Prepare documents for `<case_4>` straight to the vault worker.
2. Read `<case_4>`.

**Expected Results:**

* Step 1 is refused, naming `<collector B>` as the owner the register shows.
* `<case_4>` stays accepted, with no packet.

---

## grade10-site-vault-documents-and-signing-US5: Collector downloads every document they ever signed

**As a** collector,
**I want** every sealed document from every case in one download, each with
its fingerprint,
**so that** I hold my own record without opening each case in turn.

<!-- trace:case id=g10.vault-documents-and-signing.TC-hn3 rev=2 covers=g10.vault-documents-and-signing.SC-pe0,g10.vault-documents-and-signing.SC-wzw,g10.vault-documents-and-signing.SC-itg,g10.vault-documents-and-signing.SC-03w,g10.vault-documents-and-signing.SC-wpb -->
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

<!-- trace:case id=g10.vault-documents-and-signing.TC-vse rev=2 covers=g10.vault-documents-and-signing.SC-pe0,g10.vault-documents-and-signing.SC-wzw,g10.vault-documents-and-signing.SC-itg,g10.vault-documents-and-signing.SC-03w,g10.vault-documents-and-signing.SC-wpb -->
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

<!-- trace:case id=g10.vault-documents-and-signing.TC-w1x rev=1 covers=g10.vault-documents-and-signing.SC-pe0,g10.vault-documents-and-signing.SC-wzw,g10.vault-documents-and-signing.SC-itg,g10.vault-documents-and-signing.SC-03w,g10.vault-documents-and-signing.SC-wpb -->
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

<!-- trace:case id=g10.vault-documents-and-signing.TC-28a rev=1 covers=g10.vault-documents-and-signing.SC-pe0,g10.vault-documents-and-signing.SC-wzw,g10.vault-documents-and-signing.SC-itg,g10.vault-documents-and-signing.SC-03w,g10.vault-documents-and-signing.SC-wpb -->
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

<!-- trace:case id=g10.vault-documents-and-signing.TC-xvr rev=2 covers=g10.vault-documents-and-signing.SC-pe0,g10.vault-documents-and-signing.SC-wzw,g10.vault-documents-and-signing.SC-itg,g10.vault-documents-and-signing.SC-03w,g10.vault-documents-and-signing.SC-wpb -->
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

<!-- trace:case id=g10.vault-documents-and-signing.TC-3ew rev=2 covers=g10.vault-documents-and-signing.SC-pe0,g10.vault-documents-and-signing.SC-wzw,g10.vault-documents-and-signing.SC-itg,g10.vault-documents-and-signing.SC-03w,g10.vault-documents-and-signing.SC-wpb -->
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

<!-- trace:case id=g10.vault-documents-and-signing.TC-nod rev=2 covers=g10.vault-documents-and-signing.SC-pe0,g10.vault-documents-and-signing.SC-wzw,g10.vault-documents-and-signing.SC-itg,g10.vault-documents-and-signing.SC-03w,g10.vault-documents-and-signing.SC-wpb -->
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

<!-- trace:case id=g10.vault-documents-and-signing.TC-6a7 rev=1 covers=g10.vault-documents-and-signing.SC-pe0,g10.vault-documents-and-signing.SC-wzw,g10.vault-documents-and-signing.SC-itg,g10.vault-documents-and-signing.SC-03w,g10.vault-documents-and-signing.SC-wpb -->
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

## grade10-site-vault-documents-and-signing-US6: Collector signs a custody agreement that names their slab

**As a** collector leaving a graded item in the vault,
**I want** the custody agreement to print its grader, grade and cert as they
stood when the papers were prepared,
**so that** the paper I sign names the exact slab the shop keeps.

<!-- trace:case id=g10.vault-documents-and-signing.TC-c26 rev=1 covers=g10.vault-documents-and-signing.SC-3r0,g10.vault-documents-and-signing.SC-mvh,g10.vault-documents-and-signing.SC-82h,g10.vault-documents-and-signing.SC-cya,g10.vault-documents-and-signing.SC-ahm,g10.vault-documents-and-signing.SC-3g3 -->
### grade10-site-vault-documents-and-signing-US6-TC1-1: The custody agreement prints the register's item and slab

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
* **Trace:** grade10-site-vault-documents-and-signing-US-06

**Pre-conditions:**

* admin(staff) is on the Documents tab of <grade10 admin vault case page url> for `<case_1>`, accepted, ready to prepare.
* `<collector A>` sent `<case_1>`'s request as `<request title>`; its item `<item_1>` reads as **Test data** says in the register, owned by `<collector A>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<request title>` | Charizard, PSA I think |
| Register category | Trading card |
| Register title | Charizard Base Set Holo |
| Register description | Unlimited print |
| Grader, grade, cert | PSA, 10, `AB12345` |

**Steps:**

1. Click Prepare documents.
2. Open the custody agreement in the packet.

**Expected Results:**

* The item reads the register's category, title and description from **Test data**, not `<request title>`.
* Beside it, grader PSA, grade 10 and certificate number `AB12345`.

<!-- trace:case id=g10.vault-documents-and-signing.TC-id2 rev=1 covers=g10.vault-documents-and-signing.SC-3r0,g10.vault-documents-and-signing.SC-mvh,g10.vault-documents-and-signing.SC-82h,g10.vault-documents-and-signing.SC-cya,g10.vault-documents-and-signing.SC-ahm,g10.vault-documents-and-signing.SC-3g3 -->
### grade10-site-vault-documents-and-signing-US6-TC2-1: A prepared agreement keeps the facts it was prepared with

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
* **Trace:** grade10-site-vault-documents-and-signing-US-06

**Pre-conditions:**

* admin(staff) is on <grade10 admin vault case page url> for `<case_2>`, its packet prepared and not signed.
* `<case_2>`'s item `<item_2>` carried PSA, grade 9 and `AB222` when the packet was prepared.

**Steps:**

1. Click Edit in the item's facts on the Case tab and change the grade to 10.
2. Open the custody agreement in the prepared packet.
3. Prepare the documents again.
4. Open the custody agreement in the new packet.

**Expected Results:**

* Step 2 still reads grade 9.
* Step 4 reads grade 10.

<!-- trace:case id=g10.vault-documents-and-signing.TC-o3t rev=1 covers=g10.vault-documents-and-signing.SC-3r0,g10.vault-documents-and-signing.SC-mvh,g10.vault-documents-and-signing.SC-82h,g10.vault-documents-and-signing.SC-cya,g10.vault-documents-and-signing.SC-ahm,g10.vault-documents-and-signing.SC-3g3 -->
### grade10-site-vault-documents-and-signing-US6-TC3-1: An item with no grader prints no slab facts

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-06

**Pre-conditions:**

* admin(staff) is on the Documents tab of <grade10 admin vault case page url> for `<case_3>`, accepted, ready to prepare.
* `<case_3>`'s item is a watch with no grader.

**Steps:**

1. Click Prepare documents.
2. Open the custody agreement in the packet.

**Expected Results:**

* The item reads the register's category, title and description.
* Nothing is printed for grader, grade or certificate number.

<!-- trace:case id=g10.vault-documents-and-signing.TC-dqk rev=1 covers=g10.vault-documents-and-signing.SC-3r0,g10.vault-documents-and-signing.SC-mvh,g10.vault-documents-and-signing.SC-82h,g10.vault-documents-and-signing.SC-cya,g10.vault-documents-and-signing.SC-ahm,g10.vault-documents-and-signing.SC-3g3 -->
### grade10-site-vault-documents-and-signing-US6-TC4-1: The loan agreement's collateral prints the register's item and slab

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
* **Trace:** grade10-site-vault-documents-and-signing-US-06

**Pre-conditions:**

* admin(staff) is on the Documents tab of <grade10 admin vault case page url> for `<case_4>`, a financed case accepted and ready to prepare.
* `<case_4>`'s collector asked about "Charizard card"; the register holds its item as a trading card titled "Charizard 1999 Base Set", PSA, grade 10, cert `<cert_4>`.

**Steps:**

1. Click Prepare documents.
2. Open the loan agreement in the packet.

**Expected Results:**

* The collateral reads "Charizard 1999 Base Set", a trading card, with PSA, grade 10 and certificate number `<cert_4>`.
* "Charizard card" is not printed.

<!-- trace:case id=g10.vault-documents-and-signing.TC-jug rev=1 covers=g10.vault-documents-and-signing.SC-3r0,g10.vault-documents-and-signing.SC-mvh,g10.vault-documents-and-signing.SC-82h,g10.vault-documents-and-signing.SC-cya,g10.vault-documents-and-signing.SC-ahm,g10.vault-documents-and-signing.SC-3g3 -->
### grade10-site-vault-documents-and-signing-US6-TC5-1: The release receipt prints the register's item and slab

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
* **Trace:** grade10-site-vault-documents-and-signing-US-06

**Pre-conditions:**

* admin(staff) is on the Documents tab of <grade10 admin vault case page url> for `<case_5>`, vaulted and owing nothing.
* The register holds `<case_5>`'s item as a trading card titled "Charizard 1999 Base Set", PSA, grade 10, cert `<cert_5>`.

**Steps:**

1. Prepare the release receipt.
2. Open the receipt in its packet.

**Expected Results:**

* The item reads "Charizard 1999 Base Set", a trading card, with PSA, grade 10 and certificate number `<cert_5>`.

---

## grade10-site-vault-documents-and-signing-US7: Collector recognises their case on the signed paper

**As a** collector holding a signed agreement or a release receipt,
**I want** the paper to name my case by the reference my letters carry and I
type at my bank,
**so that** I can tell which case a paper belongs to and quote it at the
counter.

<!-- trace:case id=g10.vault-documents-and-signing.TC-p63 rev=1 covers=g10.vault-documents-and-signing.SC-a2s -->
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

<!-- trace:case id=g10.vault-documents-and-signing.TC-5q0 rev=1 covers=g10.vault-documents-and-signing.SC-keq -->
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

<!-- trace:case id=g10.vault-documents-and-signing.TC-fzc rev=1 covers=g10.vault-documents-and-signing.SC-8ct -->
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
* Steps 4, 5 and 6 each end on a certificate that reads `Case: <reference_1>`.
* None of the three copies prints `<case_1>`'s id.

<!-- trace:case id=g10.vault-documents-and-signing.TC-y1m rev=1 covers=g10.vault-documents-and-signing.SC-a2s -->
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

<!-- trace:case id=g10.vault-documents-and-signing.TC-yvj rev=1 covers=g10.vault-documents-and-signing.SC-08p -->
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

<!-- trace:case id=g10.vault-documents-and-signing.TC-z5h rev=1 covers=g10.vault-documents-and-signing.SC-08p -->
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

---

## Settled

- The seal's short download grant is the durable *Every signer keeps a copy, three ways* requirement's; the blind pass was denied it, and nothing here re-decides it.
- Which bound of the packet's preparation window applies when is the durable *A packet is prepared as one set* requirement's — a day, or a day past the visit the packet belongs to.
- Verifying a digest asks for no sign-in: anyone holding a document's digest may ask whether it is one of ours.
- The download refuses past 52,428,800 bytes, and the refusal comes before any document is read.
- A pending or failed download is the view's own status rather than a rule, so no scenario is owed for it.
- **A collector who signed nothing** - Your data carries no signed document, and the download taken anyway is an empty archive (Q18)
- **The certificate's case** - the certificate the seal appends names the case with the handle its packet was prepared with: the reference on a packet prepared after the change, the id on one prepared before it (Q8)

## Reconciliation

**Run:** the blind pass read the bundle — `spec.md`'s `## Purpose` and
`## Feature set`, this capability's `user-journeys.md`, the change's
`proposal.md` and `decisions.md` (`## Raised` included), `ui-design.md` with its
state dispositions stripped, and the linked sections of
`docs/prds/products/grade10-site/vault/documents-and-signing.md`. It was denied
every `## Requirements` section, `openspec/specs/` beyond the two included
sections, `openspec/changes/archive/` and `tech-design.md`. It wrote 25 cases
over US1, US3 and US5 and raised three questions. The scenario pass issued
`grade10-site-vault-documents-and-signing-SC-22` to `grade10-site-vault-documents-and-signing-SC-29`.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `US1-TC1-1` | Covered | `grade10-site-vault-documents-and-signing-SC-02`, `grade10-site-vault-documents-and-signing-SC-12`, `grade10-site-vault-documents-and-signing-SC-17` — the storage packet, the pages turned, the copies |
| `US1-TC2-1` | Covered | `grade10-site-vault-documents-and-signing-SC-01`, `grade10-site-vault-documents-and-signing-SC-04` — both agreements, the term printed as a term |
| `US1-TC3-1` | Covered | `grade10-site-vault-documents-and-signing-SC-12` |
| `US1-TC4-1` | Covered | `grade10-site-vault-documents-and-signing-SC-13` |
| `US1-TC5-1` | Folded | `grade10-site-vault-documents-and-signing-SC-30`. The durable requirement *The signing link is single-use, short-lived and bound to one device* says the link "SHALL be usable once", and no scenario reached it; the change now opens that requirement in a MODIFIED block and the scenario lands there |
| `US1-TC6-1` | Covered | `grade10-site-vault-documents-and-signing-SC-11` |
| `US1-TC7-1` | Covered | `grade10-site-vault-documents-and-signing-SC-10` |
| `US1-TC8-1` | Covered | `grade10-site-vault-documents-and-signing-SC-14` |
| `US1-TC9-1` | Covered | `grade10-site-vault-documents-and-signing-SC-17` |
| `US1-TC10-1` | Covered | `grade10-site-vault-documents-and-signing-SC-17`; the public verify address beside the documents is the design's Case page row, not a requirement |
| `US1-TC11-1` | Folded | `grade10-site-vault-documents-and-signing-SC-31`. The durable requirement *A document can be verified by anyone holding its digest* states the positive answer, and `grade10-site-vault-documents-and-signing-SC-18` and `grade10-site-vault-documents-and-signing-SC-19` state only the unknown digest and the operator's re-check; the change opens that requirement in a MODIFIED block and the scenario lands there. The draft's "computed fresh at the ask" is the re-check's rule, not the public answer's, and left the case |
| `US1-TC12-1` | Covered | `grade10-site-vault-documents-and-signing-SC-18` |
| `US3-TC1-1` | Covered | `grade10-site-vault-documents-and-signing-SC-25`, `grade10-site-vault-documents-and-signing-SC-02` |
| `US3-TC2-1` | Covered | `grade10-site-vault-documents-and-signing-SC-22`, `grade10-site-vault-documents-and-signing-SC-24`, `grade10-site-vault-documents-and-signing-SC-01` |
| `US3-TC3-1` | Covered | `grade10-site-vault-documents-and-signing-SC-23` |
| `US3-TC4-1` | Covered | `grade10-site-vault-documents-and-signing-SC-06` |
| `US3-TC5-1` | Covered | `grade10-site-vault-documents-and-signing-SC-05` |
| `US3-TC6-1` | Covered | `grade10-site-vault-documents-and-signing-SC-24` for when and by whom; the optional recording reference is the durable *A packet is prepared as one set* requirement's, which this change does not open |
| `US3-TC7-1` | Covered | `grade10-site-vault-documents-and-signing-SC-08`, `grade10-site-vault-documents-and-signing-SC-09`; which bound applies was raised and is landed in `decisions.md` |
| `US5-TC1-1` | Covered | `grade10-site-vault-documents-and-signing-SC-26` |
| `US5-TC2-1` | Covered | `grade10-site-vault-documents-and-signing-SC-27` |
| `US5-TC3-1` | Kept, no scenario | Presentation only: the pending button is the design's `Your data` · Download in flight row, closed there as `**Out of suite:**` the view's colocated test. No requirement states a pending state and none was invented |
| `US5-TC4-1` | Covered | `grade10-site-vault-documents-and-signing-SC-28` for the refusal; the error line and the retry affordance are the design's `Your data` · Download failed row |
| `US5-TC5-1` | Covered | `grade10-site-vault-documents-and-signing-SC-26` |
| `US5-TC6-1` | Covered | `grade10-site-vault-documents-and-signing-SC-29` |
| `grade10-site-vault-documents-and-signing-SC-28` | Case added | `US5-TC7-1` — no blind case drove the size ceiling; `US5-TC4-1` stubs a generic failure and never reaches the bound |
| Raised — the seal's short download grant has no stated duration or surface | Raised, settled | Landed in the change's `decisions.md` `## Raised`; the answer is the durable *Every signer keeps a copy, three ways* requirement, which the blind pass was denied |
| Raised — which bound of the packet's preparation window applies when | Raised, settled | Landed in the change's `decisions.md` `## Raised`; the answer is the durable *A packet is prepared as one set* requirement, which the blind pass was denied |
| Raised — must the asker be signed in to verify a digest | Raised, settled | Landed in the change's `decisions.md` `## Raised`; the answer is the durable *A document can be verified by anyone holding its digest* requirement, which the blind pass was denied |
| Raised — what byte ceiling the download refuses past | Raised, answered | The tech design names none, so the requirement states 52,428,800 bytes and `grade10-site-vault-documents-and-signing-SC-28`'s GIVEN reads it; landed as a Decisions row in the change's `decisions.md` |

**Run:** QA2, 2026-10-02. QA1's blind pass read the Feature set, the journeys, the proposal, `decisions.md` with its empty `## Raised`, `ui-design.md` with its anchors stripped, the Documents and Signing and Items PRD pages, and the durable documents-and-signing suite for id continuity with its Reconciliation stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the code. QA2 read QA1's suite and questions, the delta spec, `tech-design.md`, `tasks.md` and the case-lifecycle delta. It is a statement, not proof.

- **Folded** - `grade10-site-vault-documents-and-signing-US6-TC1-1` into `grade10-site-vault-documents-and-signing-SC-32` and `grade10-site-vault-documents-and-signing-SC-33`; `grade10-site-vault-documents-and-signing-US6-TC2-1` into `grade10-site-vault-documents-and-signing-SC-35`; `grade10-site-vault-documents-and-signing-US6-TC3-1` into `grade10-site-vault-documents-and-signing-SC-34`
- **Folded where it belongs** - `grade10-site-vault-documents-and-signing-US3-TC8-1`, the worker refusing a packet under another owner, into `grade10-site-vault-case-lifecycle-SC-55`, which owns the refusal; kept here as the worker's half beside `grade10-site-vault-case-lifecycle-US3-TC7-1`'s console walk
- **Raised, answered by the owner** - Q57, the loan agreement's collateral and the release receipt's item print the register's facts: `grade10-site-vault-documents-and-signing-SC-36` and `grade10-site-vault-documents-and-signing-SC-37`, walked by `grade10-site-vault-documents-and-signing-US6-TC4-1` and `grade10-site-vault-documents-and-signing-US6-TC5-1`
- **Rejected** - none
- **Contradicted** - none
- **Uncovered anchors** - none: US-06 has a case for each of its six scenarios; `grade10-site-vault-documents-and-signing-SC-01` to `grade10-site-vault-documents-and-signing-SC-04`, carried unchanged by the modified requirement, keep their durable cases under US-03

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

**Run:** QA2, 2026-10-07. QA1's blind pass read the Feature set, both capabilities' journeys, the proposal, `decisions.md` through Q7 with its empty `## Raised`, the Documents and Signing and Collector Pages PRD pages, the durable suites with their Reconciliation stripped, and the change's `domain-tcs.md`; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the code. QA2 read both suites, both deltas, `tech-design.md`, `tasks.md`, the durable `grade10-admin/vault/operator-queue` search requirement and doc-sign's `packets/certificate.ts` at grade10 `origin/main`. It is a statement, not proof.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-site-vault-documents-and-signing-US7-TC1-1` | Covered | `grade10-site-vault-documents-and-signing-SC-39` on the financed row; the storage row is the requirement's custody-agreement row, a value of the same rule |
| `grade10-site-vault-documents-and-signing-US7-TC2-1` | Covered | `grade10-site-vault-documents-and-signing-SC-40` |
| `grade10-site-vault-documents-and-signing-US7-TC3-1` | Raised, decided by the planning lead | Its "none of the three copies prints the id" reads the certificate page, which the requirement exempted and which printed the id; the two readings stated opposite things. Q8 holds the certificate to the rule; the case walks `grade10-site-vault-documents-and-signing-SC-43`, and the sealed-as-prepared rule behind it, `grade10-site-vault-documents-and-signing-SC-42`, is out of suite |
| `grade10-site-vault-documents-and-signing-US7-TC4-1` | Covered | `grade10-site-vault-documents-and-signing-SC-39`: its GIVEN binds the case's own reference. The second case guards a render crossed between cases and adds no rule |
| `grade10-site-vault-documents-and-signing-US8-TC1-1` | Covered | `grade10-site-vault-documents-and-signing-SC-41`; a release receipt and a collected case reach the same search, which matches a reference by prefix over every case |
| `grade10-site-vault-documents-and-signing-US8-TC2-1` | Covered where it belongs | The durable `grade10-admin-vault-operator-queue-SC-26`, a reference nobody holds says so; kept here as US-08's refusal |
| `grade10-site-vault-documents-and-signing-SC-39` | Case | `grade10-site-vault-documents-and-signing-US7-TC1-1`, `grade10-site-vault-documents-and-signing-US7-TC4-1` |
| `grade10-site-vault-documents-and-signing-SC-40` | Case | `grade10-site-vault-documents-and-signing-US7-TC2-1` |
| `grade10-site-vault-documents-and-signing-SC-41` | Case | `grade10-site-vault-documents-and-signing-US8-TC1-1` |
| `grade10-site-vault-documents-and-signing-SC-42` | Out of suite | It serves US-04, the auditor's journey, which no customer or admin walks; verified by the behaviour suite `packages/vault/backend/src/testing/suites/registerPaper.ts` in the application repository (tasks 2.1, 2.4) |
| `grade10-site-vault-documents-and-signing-SC-43` | Case | `grade10-site-vault-documents-and-signing-US7-TC3-1` |

QA1's open points, closed:

| Point | Closed by |
| --- | --- |
| Footer on every page or once | The durable *A case is papered by three documents, each printing its own facts*: each document is one page, so its footer prints once; the certificate names the case on its `Case` line (Q8) |
| Whether the certificate names the reference | Q8, raised and landed |
| File names | Q7: not in this change; a follow-on |
| Papers sealed before this change | Q2: sealed bytes stay as sealed; Q4 for a packet open when the change ships |
| Lower case, spaces, look-alike characters and partial references in search | Out of scope: the durable search rule stands, `grade10-admin/vault/operator-queue`'s *Search is exact on a contact, prefix on a case id, and leaves a trail* |
| Two brands sharing a reference | Q1: the reference is unique for the brand whose entity the paper names; `grade10-site/vault/case-intake`'s *A case carries a six-character reference*, unique and never reused per brand |
| Whether ended cases and drafts are searchable | Out of scope: the durable search rule stands; it matches over every case |
| Whether a search is recorded | Out of scope: the durable search rule stands; every search writes one audit entry without the term |
| Which grant searching needs | Out of scope: the durable search rule stands, and `grade10-admin/vault/operator-queue`'s *Every act sits behind a named grant* puts search under Vault read |
| Whether the case's address takes the reference | `grade10-site/vault/case-intake`'s *The id stays the key*: the address keeps the id |

- **Folded** - none: the one new scenario came from Q8
- **Raised, decided by the planning lead** - on the product owner's delegation, the certificate's case, landed as Q8: `grade10-site-vault-documents-and-signing-SC-43`, cited in tasks 2.1, 2.3 and 3.1
- **Rejected** - none
- **Contradicted** - `grade10-site-vault-documents-and-signing-US7-TC3-1` against the requirement's certificate exemption, settled by Q8
- **Uncovered anchors** - none: US-07 and US-08 each have cases, and SC-42's US-04 is verified out of suite

### Manual

| Manual | Why |
| --- | --- |
| `US1-TC1-1` | The end-to-end walk drives the ceremony, but a person turns the pages on the counter iPad and reads the printed custody agreement's facts off the sealed PDF |
| `US1-TC2-1` | As above, and the loan agreement's printed figures — interest for the term, the same rate per annum, `Fees: None`, the repayable amount — are read off the PDF a person opens |
| `US1-TC6-1` | Needs a signing link past its own 30-minute life; the stack has no clock to move it there |
| `US3-TC1-1` | A person confirms no key-terms dialog opens on the storage lane; the automated walk proves the packet's contents, not what the console withheld |
| `US3-TC2-1` | A person reads the dialog's terms against the loan agreement itself, which is the one thing no assertion can restate without keeping a second list |
| `US5-TC1-1` | The automated walk proves the response; a person opens the downloaded file and checks every document and its fingerprint are in it |
| `US5-TC3-1` | The pending state is a frame between the press and the file; no automated test decides it, and the view's colocated test is what holds the button's states |
