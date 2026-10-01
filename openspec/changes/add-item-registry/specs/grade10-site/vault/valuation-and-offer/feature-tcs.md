# grade10-site/vault/valuation-and-offer Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-vault-valuation-and-offer-US1: Operator prices a loan against an item they have valued

**As a** member of shop staff,
**I want** to record what the item is worth and write terms the brand's own
bounds allow,
**so that** no loan leaves the counter above what the item is worth or outside
what the business lends.

### grade10-site-vault-valuation-and-offer-US1-TC15-1: Recording a valuation never changes the register's slab

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
* **Trace:** grade10-site-vault-valuation-and-offer-US-01

**Pre-conditions:**

* admin(staff) holds `vault:approve`.
* `<case_1>` is under valuation; its item `<item_1>` carries PSA, grade 10 and `AB12345`.

**Steps:**

1. Send a valuation of HKD 25,000.00 for `<case_1>` straight to the vault worker, carrying grade 9 and cert `AB99999`.
2. Read `<item_1>` from the register.

**Expected Results:**

* `<item_1>` still carries PSA, grade 10 and `AB12345`.

---

## grade10-site-vault-valuation-and-offer-US6: Operator values a slab by its grader, grade and cert

**As a** member of shop staff valuing a graded item,
**I want** the item's grader, grade and cert beside the valuation, read from
the item register and corrected there when the slab in my hand says otherwise,
**so that** the figure I record is for the slab in front of me, not one typed
from memory.

### grade10-site-vault-valuation-and-offer-US6-TC1-1: The valuation dialog reads the slab from the register

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
* **Trace:** grade10-site-vault-valuation-and-offer-US-06

**Pre-conditions:**

* admin(staff) is on <grade10 admin vault case page url> for `<case_1>`, under valuation.
* `<case_1>`'s item `<item_1>` carries PSA, grade 10 and `AB12345` in the register.

**Steps:**

1. Open the record-valuation dialog on the Case tab.
2. Read the line above the valued-at field.
3. Record a valuation of HKD 25,000.00.

**Expected Results:**

* Step 2 reads PSA, grade 10 and `AB12345`, as text no field edits.
* The valuation is recorded at HKD 25,000.00.
* `<item_1>` still carries PSA, grade 10 and `AB12345`.

### grade10-site-vault-valuation-and-offer-US6-TC2-1: A correction on the Case tab reaches the valuation dialog

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
* **Trace:** grade10-site-vault-valuation-and-offer-US-06

**Pre-conditions:**

* admin(staff) is on <grade10 admin vault case page url> for `<case_1>`, under valuation.
* `<case_1>`'s item `<item_1>` carries PSA, grade 9 and `AB12345`; the slab in hand reads grade 10.

**Steps:**

1. Click Edit in the item's facts on the Case tab.
2. Change the grade to 10 and save.
3. Open the record-valuation dialog.

**Expected Results:**

* Step 3's line reads PSA, grade 10 and `AB12345`.

### grade10-site-vault-valuation-and-offer-US6-TC3-1: An item with no grader shows no slab line

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-valuation-and-offer-US-06

**Pre-conditions:**

* admin(staff) is on <grade10 admin vault case page url> for `<case_2>`, under valuation.
* `<case_2>`'s item carries no grader.

**Steps:**

1. Open the record-valuation dialog on the Case tab.

**Expected Results:**

* The dialog shows no grader, grade or cert line; valued-at is offered as usual.
