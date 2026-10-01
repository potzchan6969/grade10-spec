# grade10-admin/vault/operator-queue Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-admin-vault-operator-queue-US3: Operator works one case from its own tabs

**As a** member of shop staff,
**I want** each tab to offer exactly the acts this case's status allows,
**so that** I cannot be shown a button that will only be refused.

### grade10-admin-vault-operator-queue-US3-TC6-1: The Case tab's item section follows the case's status

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
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-03

**Pre-conditions:**

* admin(staff) is signed in to the Grade10 console.
* `<case_8>` is at the status of the row.

**Test data:**

| `<case_8>` status | Item section reads | Edit offered |
| --- | --- | --- |
| Submitted | registration pending | no |
| Under valuation | the register's facts, linking the item | yes |
| Vaulted | the register's facts, linking the item | yes |

**Steps:**

1. Navigate to <grade10 admin vault case page url> for `<case_8>`.
2. Read the item's facts on the Case tab.

**Expected Results:**

* The section and its Edit read as the row says.

---

## grade10-admin-vault-operator-queue-US4: Operator takes an item in and can say where it is

**As a** member of shop staff,
**I want** to name the shop and locker when I take an item in, and to list
everything we hold,
**so that** anybody can be told which vault an item is sitting in.

### grade10-admin-vault-operator-queue-US4-TC9-1: A case that took a known slab vaults that item, not a second

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
* **Trace:** grade10-admin-vault-operator-queue-US-04

**Pre-conditions:**

* admin(staff) is on the Custody tab of <grade10 admin vault case page url> for `<case_9>`.
* `<case_9>` was opened at the walk-in with `<item_1>`, PSA and `AB12345`, owned by its collector; its packet is signed.

**Steps:**

1. Confirm `<case_9>` vaulted with a shop and a locker.
2. Search Items for PSA and `AB12345`.

**Expected Results:**

* `<case_9>` reads vaulted at the shop and locker named.
* Step 2 lists only `<item_1>`, marked by the vault on `<case_9>`.

---

## grade10-admin-vault-operator-queue-US20: Operator takes in a slab the register already knows

**As a** member of shop staff opening a case for a walk-in,
**I want** to type the slab's grader and cert and have the case take the item
the register already knows, its facts filled in,
**so that** one slab never has two records and nobody types its facts twice.

### grade10-admin-vault-operator-queue-US20-TC1-1: A walk-in naming a known slab takes the register's item

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
* **Trace:** grade10-admin-vault-operator-queue-US-20

**Pre-conditions:**

* admin(staff) is on <grade10 admin vault queue url>.
* `<walk-in account>` is an account nobody has signed in to.
* `<item_1>` is live, owned by `<walk-in account>`, no place marks it: trading card, PSA, grade 10, `AB12345`.

**Test data:**

| Grader | Cert typed |
| --- | --- |
| PSA | `AB12345` |
| PSA | ` ab12345 ` |

**Steps:**

1. Open the walk-in dialog from the queue's header.
2. Type `<walk-in account>`'s email.
3. Choose the grader and type the cert from **Test data**.
4. Open the draft.
5. Open the new case's Case tab.

**Expected Results:**

* Step 3 shows `<item_1>`'s category, title, grader, grade and cert, read-only.
* The draft opens under `<walk-in account>`.
* The Case tab reads `<item_1>`'s facts and links `<item_1>`.
* The register holds no second item with PSA and `AB12345`.

### grade10-admin-vault-operator-queue-US20-TC2-1: A slab the register does not know is registered when the valuation starts

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-20

**Pre-conditions:**

* admin(staff) is on <grade10 admin vault queue url>.
* No item carries PSA and `AB99999`.
* `<walk-in email>` belongs to no account anybody has signed in to.

**Steps:**

1. Open the walk-in dialog from the queue's header.
2. Type `<walk-in email>`, the item's facts, PSA and `AB99999`.
3. Open the draft.
4. Have the customer at `<walk-in email>` send the draft from their phone.
5. Start the valuation on the case.
6. Search Items for PSA and `AB99999`.

**Expected Results:**

* Step 2 fills nothing in from the register.
* Before step 5 the register holds no item with PSA and `AB99999`.
* Step 6 finds one item under the account at `<walk-in email>`, carrying PSA and `AB99999`.

### grade10-admin-vault-operator-queue-US20-TC3-1: A known slab owned by someone else is found naming its owner

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
* **Trace:** grade10-admin-vault-operator-queue-US-20

**Pre-conditions:**

* admin(staff) is on <grade10 admin vault queue url>.
* `<item_2>` is live, owned by `<collector B>`, no place marks it, carrying PSA and `AB22222`.
* `<walk-in email>` belongs to no account anybody has signed in to.

**Steps:**

1. Open the walk-in dialog from the queue's header.
2. Type `<walk-in email>`.
3. Choose PSA and type `AB22222`.
4. Open the draft.

**Expected Results:**

* Step 3 shows `<item_2>`'s facts and names `<collector B>` as its owner.
* The draft opens under the account at `<walk-in email>` and takes `<item_2>`.
* `<item_2>` is still owned by `<collector B>`.

### grade10-admin-vault-operator-queue-US20-TC4-1: A known slab another case marks refuses the walk-in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-20

**Pre-conditions:**

* admin(staff) is on <grade10 admin vault queue url>.
* `<item_3>` carries PSA and `AB33333` and is marked by the vault on `<case_3>`.
* `<walk-in email>` belongs to no account anybody has signed in to.

**Steps:**

1. Open the walk-in dialog from the queue's header.
2. Type `<walk-in email>`.
3. Choose PSA and type `AB33333`.
4. Try to open the draft.
5. Click the link in the refusal.

**Expected Results:**

* The dialog refuses, naming `<case_3>`.
* No draft is opened.
* Step 5 opens `<case_3>`.

### grade10-admin-vault-operator-queue-US20-TC5-1: A retired slab reads as retired at the walk-in

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
* **Trace:** grade10-admin-vault-operator-queue-US-20

**Pre-conditions:**

* admin(staff) is on <grade10 admin vault queue url>.
* `<item_4>` carries PSA and `AB44444` and is retired as lost; no live item carries them.
* `<walk-in email>` belongs to no account anybody has signed in to.

**Steps:**

1. Open the walk-in dialog from the queue's header.
2. Type `<walk-in email>`.
3. Choose PSA and type `AB44444`.

**Expected Results:**

* Step 3 shows `<item_4>` reading as retired.

### grade10-admin-vault-operator-queue-US20-TC6-1: The register unreachable at the walk-in keeps what was typed

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-20

**Pre-conditions:**

* admin(staff) is on <grade10 admin vault queue url>.
* `<walk-in email>` belongs to no account anybody has signed in to.
* The register's slab lookup is mocked to fail once, then find `<item_1>`, carrying PSA and `AB12345`.

**Steps:**

1. Open the walk-in dialog from the queue's header.
2. Type `<walk-in email>`, PSA and `AB12345`.
3. Click retry on the error.

**Expected Results:**

* Step 2 shows a pending lookup, then an error with a retry.
* The email, grader and cert typed are still in the form.
* Step 3 shows `<item_1>`'s facts.

---

## grade10-admin-vault-operator-queue-US21: Operator reads and corrects the item's facts on the case

**As a** member of shop staff working a case,
**I want** the Case tab to show the register's category, title, description,
grader, grade and cert, editable once the register has the item, with the
collector's request kept as they sent it, and to show registration pending
until it does,
**so that** the case and the register never tell two stories about one item.

### grade10-admin-vault-operator-queue-US21-TC1-1: The Case tab says registration is pending before the valuation

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
* **Trace:** grade10-admin-vault-operator-queue-US-21

**Pre-conditions:**

* admin(staff) is signed in to the Grade10 console.
* `<case_5>` is submitted, its valuation not started, with no item linked.

**Steps:**

1. Navigate to <grade10 admin vault case page url> for `<case_5>`.
2. Read the item's facts on the Case tab.

**Expected Results:**

* The section says the item is registered when the valuation starts.
* The section offers no Edit and links no item.

### grade10-admin-vault-operator-queue-US21-TC2-1: The Case tab shows and edits the register's facts

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
* **Trace:** grade10-admin-vault-operator-queue-US-21

**Pre-conditions:**

* admin(staff) is on <grade10 admin vault case page url> for `<case_6>`.
* `<case_6>` is under valuation; its item `<item_6>` is registered with the request's facts and no grader.
* `<collector A>` sent `<case_6>`'s request titled `<request title>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<request title>` | Pikachu card, think it's a 9 |
| Title after edit | Pikachu Illustrator |
| Grader after edit | PSA |
| Grade after edit | 9 |
| Cert after edit | `AB66666` |

**Steps:**

1. Read the item's facts on the Case tab.
2. Click Edit in that section.
3. Change the title, grader, grade and cert to the values in **Test data**.
4. Save.
5. Click the link to the item.
6. As `<collector A>`, open `<case_6>` on <grade10 vault url>.

**Expected Results:**

* Step 1 reads the register's category, title, description, grader, grade and cert, linking `<item_6>`.
* Step 4 shows the new facts on the Case tab.
* Step 5 opens `<item_6>`, reading the new facts and this staff member as its last editor.
* Step 6 still reads `<request title>` as the collector sent it.

### grade10-admin-vault-operator-queue-US21-TC3-1: Without the inventory write the Case tab facts read only

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-21

**Pre-conditions:**

* admin(holds `vault:read` and `inventory:read`, not `inventory:write`) is signed in to the Grade10 console.
* `<case_6>` is under valuation with `<item_6>` registered.

**Steps:**

1. Navigate to <grade10 admin vault case page url> for `<case_6>`.
2. Read the item's facts on the Case tab.

**Expected Results:**

* The section reads the register's facts and offers no Edit.

### grade10-admin-vault-operator-queue-US21-TC4-1: The register unreachable fails the facts section alone

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-21

**Pre-conditions:**

* admin(staff) is signed in to the Grade10 console.
* `<case_6>` is under valuation with `<item_6>` registered.
* The register's read of `<item_6>` is mocked to fail once, then answer.

**Steps:**

1. Navigate to <grade10 admin vault case page url> for `<case_6>`.
2. Click retry in the item's facts section.

**Expected Results:**

* Step 1 shows the section's own error with a retry.
* The rest of the Case tab, its acts and timeline, still loads.
* Step 2 shows `<item_6>`'s facts.
