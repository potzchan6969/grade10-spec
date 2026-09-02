# shared/console/visual-standard Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-02, tcs-rules r1

## visual-standard-US1: Operator moves between consoles in one shift

**As an** operator,
**I want** every console I open to arrange the same kinds of fact the same way,
**so that** moving between nine of them costs me no re-reading.

### visual-standard-US1-TC1-1: Two consoles render the same control the same way

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** visual-standard-US-01

**Pre-conditions:**
Signed in as an operator who can open <grade10 admin console url> and <a second admin console url>.

**Steps:**

1. Navigate to <grade10 admin console url> and note how <a shared control kind> is arranged.
2. Navigate to <a second admin console url> and check the same kind of control.

**Expected Results:**

* Both consoles render that control from the same vocabulary.
* No admin surface mixes a second vocabulary for it.

### visual-standard-US1-TC2-1: Shared customer component matches the console around it

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** visual-standard-US-01

**Pre-conditions:**
An admin console renders a component that customer surfaces also render.

**Steps:**

1. Navigate to <grade10 admin console url> on a surface that shows <a shared customer component>.
2. Check that component against the console around it.

**Expected Results:**

* One definition serves the admin and customer surfaces.
* The admin rendering is not visibly foreign to the console around it.

### visual-standard-US1-TC3-1: Refused read stays distinguishable after the swap

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** visual-standard-US-01

**Pre-conditions:**
<The console read endpoint> is mocked to refuse the request.

**Steps:**

1. Navigate to <grade10 admin console url> on a surface that reads that endpoint.
2. Check the loading, refused, and empty presentations.

**Expected Results:**

* The refused read renders in the error tone, distinct from empty.
* Loading, refused, and empty remain three distinguishable answers.

---

## visual-standard-US2: Operator recognises which brand they are administering

**As an** operator who administers both brands,
**I want** each console to look like the brand it belongs to,
**so that** I never act on one brand's data believing it is the other's.

### visual-standard-US2-TC1-1: Two brands differ only by the brand mechanism

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** visual-standard-US-02

**Pre-conditions:**
Signed in as an operator who can open both brands' admin consoles.

**Steps:**

1. Navigate to <grade10 admin console url> and note visual identity.
2. Navigate to <zzz admin console url> on the same console surface and note visual identity.

**Expected Results:**

* Every visual difference between the two comes from the brand mechanism.
* Neither rendering carries a brand value written into a block.

### visual-standard-US2-TC2-1: A brand visual value has one source

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** visual-standard-US-02

**Pre-conditions:**
Signed in as an operator on <grade10 admin console url>.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Check which mechanism sets <a brand visual value>.

**Expected Results:**

* Exactly one mechanism sets that value.
* No second mechanism sets the same value to a different result.
