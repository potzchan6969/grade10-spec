# grade10-site/vault/documents-and-signing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-vault-documents-and-signing-US3: Operator prepares the papers for the visit in front of them

**As a** member of shop staff,
**I want** the packet to carry exactly the documents this case's lane needs,
naming the shop and the person we checked,
**so that** nothing is handed over to sign that we could not be held to.

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

## grade10-site-vault-documents-and-signing-US6: Collector signs a custody agreement that names their slab

**As a** collector leaving a graded item in the vault,
**I want** the custody agreement to print its grader, grade and cert as they
stood when the papers were prepared,
**so that** the paper I sign names the exact slab the shop keeps.

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

## Reconciliation

**Run:** QA2, 2026-10-02. QA1's blind pass read the Feature set, the journeys, the proposal, `decisions.md` with its empty `## Raised`, `ui-design.md` with its anchors stripped, the Documents and Signing and Items PRD pages, and the durable documents-and-signing suite for id continuity with its Reconciliation stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the code. QA2 read QA1's suite and questions, the delta spec, `tech-design.md`, `tasks.md` and the case-lifecycle delta. It is a statement, not proof.

- **Folded** - `grade10-site-vault-documents-and-signing-US6-TC1-1` into `grade10-site-vault-documents-and-signing-SC-32` and `grade10-site-vault-documents-and-signing-SC-33`; `grade10-site-vault-documents-and-signing-US6-TC2-1` into `grade10-site-vault-documents-and-signing-SC-35`; `grade10-site-vault-documents-and-signing-US6-TC3-1` into `grade10-site-vault-documents-and-signing-SC-34`
- **Folded where it belongs** - `grade10-site-vault-documents-and-signing-US3-TC8-1`, the worker refusing a packet under another owner, into `grade10-site-vault-case-lifecycle-SC-47`, which owns the refusal; kept here as the worker's half beside `grade10-site-vault-case-lifecycle-US3-TC7-1`'s console walk
- **Raised, escalated** - Q57, whether the loan agreement's collateral and the release receipt's item print the register's facts; Q22 names the custody agreement alone, so no case asserts the other two
- **Rejected** - none
- **Contradicted** - none
- **Uncovered anchors** - none: US-06 has a case for each of its four scenarios; `grade10-site-vault-documents-and-signing-SC-01` to `grade10-site-vault-documents-and-signing-SC-04`, carried unchanged by the modified requirement, keep their durable cases under US-03
