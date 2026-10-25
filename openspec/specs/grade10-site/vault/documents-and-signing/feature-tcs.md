# grade10-site/vault/documents-and-signing Test Cases

**Status:** pending-review · 0/24
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7
**Out of suite (non-GUI):** grade10-site-vault-documents-and-signing-SC-20 - a sealed document's copy reaching the archive

## Background

* Packets are prepared on the console case page's Documents tab by admin(holds `vault:operate`); the collector signs at the counter on a signing link, read on the shop's iPad. A link lives 30 minutes and binds to the first device that opens it.
* A signer turns every page, ticks the e-sign disclosure once and each document's own consent, and types the verified legal name. A sealed document ends on a certificate page; its digest can be verified on the vault's verify page by anyone.
* `<case_1>` carries the reference QC7PEQ; its item the register holds as a trading card titled Charizard 1999 Base Set, PSA 10, cert 12345678, which the collector asked about as "Charizard card".

## Walk 1: Prepare and sign a financed case's papers

Starting state:

- admin(holds `vault:operate`) on `<case_1>`'s Documents tab, financed, terms accepted, a shop named.

Shared test data:

| Field | Value |
| --- | --- |
| case_1 | as in the Background |

### Route

1. Tick every key term, record them, and prepare the packet.
   - The custody agreement and the loan agreement, in that order, naming the shop. `g10.vault-documents-and-signing.US3-TC1`
2. Open each document.
   - Each names QC7PEQ, and the item as the register holds it. `g10.vault-documents-and-signing.US7-TC1`
3. On the signing link, turn every page, tick, type the verified name and sign.
   - Both seal together, each on its certificate; the copies download, arrive by mail and list on the case. `g10.vault-documents-and-signing.US1-TC1`
4. Verify one document's digest on the verify page, signed out.
   - One of ours, its template and case, naming nobody. `g10.vault-documents-and-signing.US4-TC1`

## g10.vault-documents-and-signing.US1: Collector signs their case's papers at the counter

**As a** collector standing at the shop counter,
**I want** to read every page on the iPad, agree to sign electronically and
sign each document once,
**so that** I know exactly what I signed and leave with a copy of it.

<!-- trace:case id=g10.vault-documents-and-signing.TC-nv7 rev=2 covers=g10.vault-documents-and-signing.SC-h1q,g10.vault-documents-and-signing.SC-k3s,g10.vault-documents-and-signing.SC-22x,g10.vault-documents-and-signing.SC-3o8,g10.vault-documents-and-signing.SC-faf,g10.vault-documents-and-signing.SC-leu -->
### g10.vault-documents-and-signing.US1-TC1: A packet signed at the counter seals whole, and the signer keeps a copy three ways

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-01

**Pre-conditions:**

* The collector is on the signing link for a `<lane>` case's packet, holding `<documents>`.

**Test data:**

| `<lane>` | `<documents>` | `<documents print>` |
| --- | --- | --- |
| storage | the custody agreement | the case, the verified legal name, the item, the valuation, the shop and the date |
| financed, HKD5,000.00 | the custody agreement and the loan agreement | as storage, and in the loan agreement the principal, the interest as a percentage for the term in days and per annum, Fees: None, the repayable amount, the term in days from the advance with no due date, and the borrower's line that the key terms were explained |

**Steps:**

1. Turn every page, tick the disclosure and each consent, type the verified name, and sign.
2. Download each document where the ceremony ends.
3. Read the collector's inbox, and their case page.

**Expected Results:**

* Step 1 seals every document at once, each ending on its own certificate; they print `<documents print>`.
* Step 2 downloads each.
* Step 3: a letter carries the sealed set; the case lists each document with its fingerprint.

<!-- trace:case id=g10.vault-documents-and-signing.TC-gjg rev=1 covers=g10.vault-documents-and-signing.SC-h1q,g10.vault-documents-and-signing.SC-k3s,g10.vault-documents-and-signing.SC-22x,g10.vault-documents-and-signing.SC-3o8,g10.vault-documents-and-signing.SC-faf,g10.vault-documents-and-signing.SC-leu -->
### g10.vault-documents-and-signing.US1-TC3: A signature is refused until every page is turned and the typed name is the verified one

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-01

**Pre-conditions:**

* The collector is on the signing link for a storage packet.

**Test data:**

| `<before signing>` | `<refused at>` |
| --- | --- |
| every page turned but the last | the consent's tick |
| every page turned and ticked, a name typed that is not the verified one | the signature |

**Steps:**

1. Do `<before signing>`, and try to sign.

**Expected Results:**

* It is refused at `<refused at>`; nothing seals, and the packet stays ready for the verified signer.

<!-- trace:case id=g10.vault-documents-and-signing.TC-6wd rev=1 covers=g10.vault-documents-and-signing.SC-h1q,g10.vault-documents-and-signing.SC-k3s,g10.vault-documents-and-signing.SC-22x,g10.vault-documents-and-signing.SC-3o8,g10.vault-documents-and-signing.SC-faf,g10.vault-documents-and-signing.SC-leu -->
### g10.vault-documents-and-signing.US1-TC5: A signing link opens on one device, once, within 30 minutes

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
* **Trace:** The ceremony

**Pre-conditions:**

* A storage packet's signing link `<state>`.

**Test data:**

| `<state>` | `<opened>` |
| --- | --- |
| was opened on the counter iPad | on a second device |
| sealed its packet | again, on the device that signed |
| was issued 31 minutes ago, never opened | on the counter iPad |

**Steps:**

1. Open the link `<opened>`.

**Expected Results:**

* It is refused by name, showing no document; nothing seals; staff may issue a new link.

---

## g10.vault-documents-and-signing.US2: Collector refuses to sign electronically

**As a** collector who would rather not sign on a screen,
**I want** to decline on the spot and have nothing at all signed,
**so that** the member of staff with me can take it from there without
anything half-executed in my name.

<!-- trace:case id=g10.vault-documents-and-signing.TC-3p4 rev=1 covers=g10.vault-documents-and-signing.SC-h1q,g10.vault-documents-and-signing.SC-k3s,g10.vault-documents-and-signing.SC-22x,g10.vault-documents-and-signing.SC-3o8,g10.vault-documents-and-signing.SC-faf,g10.vault-documents-and-signing.SC-leu -->
### g10.vault-documents-and-signing.US2-TC1: Declining withdraws the whole packet, and the decline is on the record

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-02

**Pre-conditions:**

* The collector is on the signing link for a financed packet of two documents, every page turned.

**Steps:**

1. Decline instead of signing; reopen the link.
2. As admin(holds `vault:operate`), read the case's history and Documents tab.

**Expected Results:**

* Step 1: neither document seals; the link no longer opens.
* Step 2: the decline is on the history; both documents read withdrawn.

<!-- trace:case id=g10.vault-documents-and-signing.TC-k0h rev=1 -->
### g10.vault-documents-and-signing.US2-TC2: A packet that runs out of its window ends alone, and the case still waits to sign

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-02

**Pre-conditions:**

* A case is signing, its packet past its window.

**Steps:**

1. Run the expiry sweep; read the case and open its link.

**Expected Results:**

* The packet and its link are closed; the case still reads signing, ready for a new packet.

---

## g10.vault-documents-and-signing.US3: Operator prepares the papers for the visit in front of them

**As a** member of shop staff,
**I want** the packet to carry exactly the documents this case's lane needs,
naming the shop and the person we checked,
**so that** nothing is handed over to sign that we could not be held to.

<!-- trace:case id=g10.vault-documents-and-signing.TC-piq rev=1 covers=g10.vault-documents-and-signing.SC-m42,g10.vault-documents-and-signing.SC-1ll,g10.vault-documents-and-signing.SC-l9w,g10.vault-documents-and-signing.SC-iz4,g10.vault-documents-and-signing.SC-h2m,g10.vault-documents-and-signing.SC-z0d,g10.vault-documents-and-signing.SC-i4k,g10.vault-documents-and-signing.SC-kzm -->
### g10.vault-documents-and-signing.US3-TC1: A packet carries the documents its lane needs, the loan agreement only after its key terms are recorded

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
* **Trace:** grade10-site-vault-documents-and-signing-US-03

**Pre-conditions:**

* admin(holds `vault:operate`) is on a `<lane>` case ready for its visit, naming a shop.

**Test data:**

| `<lane>` | `<before>` | `<packet>` |
| --- | --- | --- |
| storage | nothing: no key-terms list is offered | the custody agreement alone |
| financed | open the key terms, which list the loan agreement's own terms in its order; tick every one and record | the custody agreement, then the loan agreement |

**Steps:**

1. Do `<before>`, then prepare the packet.

**Expected Results:**

* It holds `<packet>`, naming the shop; a financed case shows the day the terms were recorded and by whom.

<!-- trace:case id=g10.vault-documents-and-signing.TC-mzb rev=1 covers=g10.vault-documents-and-signing.SC-m42,g10.vault-documents-and-signing.SC-1ll,g10.vault-documents-and-signing.SC-l9w,g10.vault-documents-and-signing.SC-iz4,g10.vault-documents-and-signing.SC-h2m,g10.vault-documents-and-signing.SC-z0d,g10.vault-documents-and-signing.SC-i4k,g10.vault-documents-and-signing.SC-kzm -->
### g10.vault-documents-and-signing.US3-TC3: A packet is refused without its key terms or a shop, and a key-terms record short of the list is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-03

**Pre-conditions:**

* admin(holds `vault:operate`) is on `<case>`.

**Test data:**

| `<case>` | `<attempt>` | `<refusal names>` |
| --- | --- | --- |
| financed, its key terms open, all ticked but one | record the key terms | the unticked term |
| financed, key terms not recorded | prepare the packet | the key terms, offering their dialog |
| with no visit and no shop named | prepare the packet | that no shop can be held to it |

**Steps:**

1. `<attempt>`.

**Expected Results:**

* It is refused, naming `<refusal names>`; nothing is recorded or produced.

<!-- trace:case id=g10.vault-documents-and-signing.TC-0wv rev=1 covers=g10.vault-documents-and-signing.SC-m42,g10.vault-documents-and-signing.SC-1ll,g10.vault-documents-and-signing.SC-l9w,g10.vault-documents-and-signing.SC-iz4,g10.vault-documents-and-signing.SC-h2m,g10.vault-documents-and-signing.SC-z0d,g10.vault-documents-and-signing.SC-i4k,g10.vault-documents-and-signing.SC-kzm -->
### g10.vault-documents-and-signing.US3-TC6: The key terms record with or without a recording reference

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-03

**Pre-conditions:**

* admin(holds `vault:operate`) has every key term ticked on a financed case.

**Test data:**

| `<reference>` | `<recorded>` |
| --- | --- |
| a call recording reference | the terms, when and by whom, with the reference |
| none | the terms, when and by whom |

**Steps:**

1. Enter `<reference>`, and record.

**Expected Results:**

* The case shows `<recorded>`.

<!-- trace:case id=g10.vault-documents-and-signing.TC-scy rev=1 covers=g10.vault-documents-and-signing.SC-m42,g10.vault-documents-and-signing.SC-1ll,g10.vault-documents-and-signing.SC-l9w,g10.vault-documents-and-signing.SC-iz4,g10.vault-documents-and-signing.SC-h2m,g10.vault-documents-and-signing.SC-z0d,g10.vault-documents-and-signing.SC-i4k,g10.vault-documents-and-signing.SC-kzm -->
### g10.vault-documents-and-signing.US3-TC7: A packet stays signable as long as the visit it was prepared for

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Preparing a packet

**Pre-conditions:**

* A packet was prepared on Monday for a visit booked on Friday.

**Steps:**

1. On Friday, issue its signing link and open it.

**Expected Results:**

* The packet opens for signing.

<!-- trace:case id=g10.vault-documents-and-signing.TC-9bm rev=1 -->
### g10.vault-documents-and-signing.US3-TC8: Preparing again withdraws the packet that was out

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-03

**Pre-conditions:**

* admin(holds `vault:operate`) is on a case holding an unsigned packet.

**Steps:**

1. Prepare the packet again; open the first packet's link.

**Expected Results:**

* The case holds one live packet, the new one; the first is withdrawn and its link no longer opens.

<!-- trace:case id=g10.vault-documents-and-signing.TC-fp6 rev=1 -->
### g10.vault-documents-and-signing.US3-TC9: In production a packet is refused while the custodian has no registered name

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** The documents

**Pre-conditions:**

* In production, the custodian has no registered name; admin(holds `vault:operate`) is on an accepted case.

**Steps:**

1. Prepare the packet.

**Expected Results:**

* It is refused, naming the custodian's registered name; nothing is rendered.

---

## g10.vault-documents-and-signing.US4: Auditor proves what a document was when it was signed

**As an** auditor holding one of our documents in a dispute,
**I want** to check its fingerprint against the vault and see the packet
re-derived from what is stored,
**so that** the record can be tested rather than believed.

<!-- trace:case id=g10.vault-documents-and-signing.TC-das rev=1 -->
### g10.vault-documents-and-signing.US4-TC1: A digest answers whether the vault sealed it, naming the document and nobody

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-04

**Pre-conditions:**

* Somebody, signed in or not, is on the verify page.

**Test data:**

| `<digest>` | `<answer>` |
| --- | --- |
| a sealed document's | one the vault sealed, with its template and case, and no person's name |
| one the vault never sealed | not one of ours, naming nobody |

**Steps:**

1. Verify `<digest>`.

**Expected Results:**

* It answers `<answer>`.

<!-- trace:case id=g10.vault-documents-and-signing.TC-yav rev=1 -->
### g10.vault-documents-and-signing.US4-TC2: Each certificate carries the words that were shown, and the document is sealed as it was prepared

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-04

**Pre-conditions:**

* A financed packet was prepared and then signed.

**Steps:**

1. Open each sealed document's certificate.
2. As admin(holds `vault:operate`), compare each document's sealed source digest with the one taken at preparation.

**Expected Results:**

* Step 1 prints the disclosure and that document's consent in full, each above its own digest.
* Step 2: they match; nothing was rendered again.

<!-- trace:case id=g10.vault-documents-and-signing.TC-yg9 rev=1 -->
### g10.vault-documents-and-signing.US4-TC3: A document whose stored bytes changed refuses the seal

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-04

**Pre-conditions:**

* A prepared document's stored bytes no longer match the digest taken at preparation.

**Steps:**

1. The collector signs it.

**Expected Results:**

* The seal is refused by name; nothing is sealed.

<!-- trace:case id=g10.vault-documents-and-signing.TC-p2y rev=1 -->
### g10.vault-documents-and-signing.US4-TC4: A re-check recomputes the packet from what is stored, and a mismatch is reported, never overwritten

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
* **Trace:** grade10-site-vault-documents-and-signing-US-04

**Pre-conditions:**

* admin(holds `vault:operate`) is on a case with a sealed packet, `<stored>`.

**Test data:**

| `<stored>` | `<answer>` |
| --- | --- |
| as sealed | the packet holds, recomputed from the stored bytes and the chain |
| one document's bytes altered | that document reported as not matching its digest, nothing overwritten |

**Steps:**

1. Re-check the packet; read the case's history.

**Expected Results:**

* It answers `<answer>`; the history records the re-check.

---

## g10.vault-documents-and-signing.US5: Collector downloads every document they ever signed

**As a** collector,
**I want** every sealed document from every case in one download, each with
its fingerprint,
**so that** I hold my own record without opening each case in turn.

<!-- trace:case id=g10.vault-documents-and-signing.TC-xju rev=1 -->
### g10.vault-documents-and-signing.US5-TC1: The download holds every sealed document of every case with its digest, and each read is recorded

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-05

**Pre-conditions:**

* customer(collector) holds three sealed documents on two cases, on Your data.

**Steps:**

1. Take the download, and open it.
2. As admin(holds `vault:operate`), read each case's read trail and the audit trail.

**Expected Results:**

* Step 1 holds all three, each with its digest.
* Step 2 records each document as read, and one download entry.

<!-- trace:case id=g10.vault-documents-and-signing.TC-bm2 rev=1 -->
### g10.vault-documents-and-signing.US5-TC2: A collector who has signed nothing reads no signed document

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-05

**Pre-conditions:**

* customer(collector)'s cases hold no sealed document.

**Steps:**

1. Read Your data, and take the download from its address.

**Expected Results:**

* Your data lists no signed document; the download is an empty archive.

<!-- trace:case id=g10.vault-documents-and-signing.TC-rvo rev=1 -->
### g10.vault-documents-and-signing.US5-TC3: The download is refused past its ceiling, or to someone not signed in

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-05

**Pre-conditions:**

* `<who>` asks for the download.

**Test data:**

| `<who>` | `<refusal>` |
| --- | --- |
| a collector whose sealed documents come to over 52,428,800 bytes | refused by name, before any document is read |
| a browser with no session | asked to sign in |

**Steps:**

1. Take the download.

**Expected Results:**

* It is `<refusal>`; nothing is served or recorded.

---

## g10.vault-documents-and-signing.US6: Collector signs a custody agreement that names their slab

**As a** collector leaving a graded item in the vault,
**I want** the custody agreement to print its grader, grade and cert as they
stood when the papers were prepared,
**so that** the paper I sign names the exact slab the shop keeps.

<!-- trace:case id=g10.vault-documents-and-signing.TC-c26 rev=1 covers=g10.vault-documents-and-signing.SC-3r0,g10.vault-documents-and-signing.SC-mvh,g10.vault-documents-and-signing.SC-82h,g10.vault-documents-and-signing.SC-cya,g10.vault-documents-and-signing.SC-ahm,g10.vault-documents-and-signing.SC-3g3 -->
### g10.vault-documents-and-signing.US6-TC1: Every paper names the item as the register holds it, with its grader, grade and cert where it has one

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
* **Trace:** grade10-site-vault-documents-and-signing-US-06

**Pre-conditions:**

* admin(holds `vault:operate`) is on `<case>`'s Documents tab.

**Test data:**

| `<case>` | `<prepare>` | `<paper prints>` |
| --- | --- | --- |
| `<case_1>`, accepted on the storage lane | Prepare documents, then the custody agreement | Charizard 1999 Base Set, a trading card, PSA, 10, certificate 12345678; never "Charizard card" |
| an accepted case whose item is a watch with no grader | Prepare documents, then the custody agreement | the register's category, title and description, and no grader, grade or certificate |
| `<case_1>`, accepted on the financed lane | Prepare documents, then the loan agreement | the collateral as Charizard 1999 Base Set, a trading card, PSA, 10, certificate 12345678 |
| `<case_1>`, vaulted and owing nothing | Prepare release receipt | Charizard 1999 Base Set, a trading card, PSA, 10, certificate 12345678 |

**Steps:**

1. `<prepare>`, and read the paper.

**Expected Results:**

* It prints `<paper prints>`.

<!-- trace:case id=g10.vault-documents-and-signing.TC-id2 rev=1 covers=g10.vault-documents-and-signing.SC-3r0,g10.vault-documents-and-signing.SC-mvh,g10.vault-documents-and-signing.SC-82h,g10.vault-documents-and-signing.SC-cya,g10.vault-documents-and-signing.SC-ahm,g10.vault-documents-and-signing.SC-3g3 -->
### g10.vault-documents-and-signing.US6-TC2: A prepared paper keeps the facts it was prepared with, and preparing again reads the register anew

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-06

**Pre-conditions:**

* A packet was prepared while the register held the item as PSA, grade 9; it is unsigned.

**Steps:**

1. Correct the grade to 10 from the Case tab's Edit; open the prepared custody agreement.
2. Prepare again, and open the new one.

**Expected Results:**

* Step 1 still reads grade 9; step 2 reads grade 10.

---

## g10.vault-documents-and-signing.US7: Collector recognises their case on the signed paper

**As a** collector holding a signed agreement or a release receipt,
**I want** the paper to name my case by the reference my letters carry and I
type at my bank,
**so that** I can tell which case a paper belongs to and quote it at the
counter.

<!-- trace:case id=g10.vault-documents-and-signing.TC-p63 rev=1 covers=g10.vault-documents-and-signing.SC-a2s -->
### g10.vault-documents-and-signing.US7-TC1: Every paper names its own case by reference alone, in its facts and its footer

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
* **Trace:** grade10-site-vault-documents-and-signing-US-07

**Pre-conditions:**

* admin(holds `vault:operate`) is on `<case>`'s Documents tab; the collector also owns a second case, reference VK3TXZ.

**Test data:**

| `<case>` | `<prepare>` |
| --- | --- |
| `<case_1>`, accepted on the storage lane | Prepare documents |
| `<case_1>`, accepted on the financed lane, key terms recorded | Prepare documents |
| `<case_1>`, vaulted and owing nothing | Prepare release receipt |

**Steps:**

1. `<prepare>`; read each paper's case fact and footer.

**Expected Results:**

* Each names QC7PEQ, never VK3TXZ, and nowhere prints the case's id.

<!-- trace:case id=g10.vault-documents-and-signing.TC-fzc rev=1 covers=g10.vault-documents-and-signing.SC-8ct -->
### g10.vault-documents-and-signing.US7-TC3: Every copy of a sealed agreement keeps its reference, its certificate too

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-07

**Pre-conditions:**

* The collector has just signed `<case_1>`'s storage packet.

**Steps:**

1. Read the copy downloaded at the counter, the one mailed, and the one on their case page.

**Expected Results:**

* Each names QC7PEQ in its facts and footer and ends on a certificate reading Case: QC7PEQ, never the case's id.

---

## g10.vault-documents-and-signing.US8: Operator finds the case a signed paper names

**As a** member of shop staff handed a signed document,
**I want** to search the console by the case the paper prints,
**so that** I open that case without asking the collector for anything else.

<!-- trace:case id=g10.vault-documents-and-signing.TC-yvj rev=1 covers=g10.vault-documents-and-signing.SC-08p -->
### g10.vault-documents-and-signing.US8-TC1: The reference on a paper finds its case, and only that case

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-08

**Pre-conditions:**

* admin(holds `vault:read`) is on the vault queue; `<case_1>`'s item was collected, its release receipt printing QC7PEQ.

**Steps:**

1. Search for QC7PEQ, and open the case it returns.

**Expected Results:**

* It returns `<case_1>` alone, which opens at its own address keyed by its id.

<!-- trace:case id=g10.vault-documents-and-signing.TC-z5h rev=1 covers=g10.vault-documents-and-signing.SC-08p -->
### g10.vault-documents-and-signing.US8-TC2: A reference no case holds finds no case

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-documents-and-signing-US-08

**Pre-conditions:**

* admin(holds `vault:read`) is on the vault queue.

**Steps:**

1. Search for six characters of the reference alphabet that no case holds.

**Expected Results:**

* It returns no case.

## Settled

- The seal's short download grant is the durable *Every signer keeps a copy, three ways* requirement's.
- Which bound of the packet's preparation window applies is the durable *A packet is prepared as one set* requirement's — a day, or a day past the visit it belongs to.
- Verifying a digest asks for no sign-in.
- The download refuses past 52,428,800 bytes, before any document is read.
- A collector who signed nothing reads no signed document, and a download taken anyway is an empty archive (Q18).
- A certificate names the case with the handle its packet was prepared with: the reference after the change, the id before it (Q8).
