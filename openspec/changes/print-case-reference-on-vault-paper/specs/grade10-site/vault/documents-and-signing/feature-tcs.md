# grade10-site/vault/documents-and-signing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-07, tcs-rules r4

## grade10-site-vault-documents-and-signing-US7: Collector recognises their case on the signed paper

**As a** collector holding a signed agreement or a release receipt,
**I want** the paper to name my case by the reference my letters carry and I
type at my bank,
**so that** I can tell which case a paper belongs to and quote it at the
counter.

<!-- trace:case id=g10.vault-documents-and-signing.TC-p63 rev=1 covers=g10.vault-documents-and-signing.SC-a2s,g10.vault-documents-and-signing.SC-keq,g10.vault-documents-and-signing.SC-8ct -->
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

<!-- trace:case id=g10.vault-documents-and-signing.TC-5q0 rev=1 covers=g10.vault-documents-and-signing.SC-a2s,g10.vault-documents-and-signing.SC-keq,g10.vault-documents-and-signing.SC-8ct -->
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

<!-- trace:case id=g10.vault-documents-and-signing.TC-fzc rev=1 covers=g10.vault-documents-and-signing.SC-a2s,g10.vault-documents-and-signing.SC-keq,g10.vault-documents-and-signing.SC-8ct -->
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

<!-- trace:case id=g10.vault-documents-and-signing.TC-y1m rev=1 covers=g10.vault-documents-and-signing.SC-a2s,g10.vault-documents-and-signing.SC-keq,g10.vault-documents-and-signing.SC-8ct -->
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

## Settled

- **The certificate's case** - the certificate the seal appends names the case with the handle its packet was prepared with: the reference on a packet prepared after the change, the id on one prepared before it (Q8)

## Reconciliation

**Run:** QA2, 2026-10-07. QA1's blind pass read the Feature set, both capabilities' journeys, the proposal, `decisions.md` through Q7 with its empty `## Raised`, the Documents and Signing and Collector Pages PRD pages, the durable suites with their Reconciliation stripped, and the change's `domain-tcs.md`; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the code. QA2 read both suites, both deltas, `tech-design.md`, `tasks.md`, the durable `grade10-admin/vault/operator-queue` search requirement and doc-sign's `packets/certificate.ts` at grade10 `origin/main`. It is a statement, not proof.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-site-vault-documents-and-signing-US7-TC1-1` | Covered | `grade10-site-vault-documents-and-signing-SC-39` on the financed row; the storage row is the requirement's custody-agreement row, a value of the same rule |
| `grade10-site-vault-documents-and-signing-US7-TC2-1` | Covered | `grade10-site-vault-documents-and-signing-SC-40` |
| `grade10-site-vault-documents-and-signing-US7-TC3-1` | Raised, answered by the owner | Its "none of the three copies prints the id" reads the certificate page, which the requirement exempted and which printed the id; the two readings stated opposite things. Q8 holds the certificate to the rule, and the case is walked by `grade10-site-vault-documents-and-signing-SC-43` and `grade10-site-vault-documents-and-signing-SC-42` |
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
- **Raised, answered by the owner** - the certificate's case, landed as Q8: `grade10-site-vault-documents-and-signing-SC-43`, cited in tasks 2.1, 2.3 and 3.1
- **Rejected** - none
- **Contradicted** - `grade10-site-vault-documents-and-signing-US7-TC3-1` against the requirement's certificate exemption, settled by Q8
- **Uncovered anchors** - none: US-07 and US-08 each have cases, and SC-42's US-04 is verified out of suite
