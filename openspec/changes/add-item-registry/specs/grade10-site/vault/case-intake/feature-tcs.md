# grade10-site/vault/case-intake Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-vault-case-intake-US1: Collector sends in a card they want cash against

**As a** collector,
**I want** to describe and photograph one card and say how much I want to
borrow against it,
**so that** the shop can value it and offer me terms before I carry it in.

### grade10-site-vault-case-intake-US1-TC22-1: The wizard offers the register's ten categories in each language

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) is signed in on <grade10 vault url> in the language of the row, with no unsent draft.

**Test data:**

| Language |
| --- |
| English |
| Traditional Chinese |
| Simplified Chinese |
| Korean |

**Steps:**

1. Start a new request.
2. Open the category choice on the Describe step.
3. Choose comic and fill in a title and a description.
4. Click Continue.

**Expected Results:**

* Step 2 offers ten categories: trading card, comic, coin, banknote, stamp, bullion, watch, jewellery, memorabilia and other.
* Every category reads in the row's language, none as a raw key.
* Step 4 moves to the Photograph step with comic kept as the category.

### grade10-site-vault-case-intake-US1-TC23-1: A draft staff opened with a known slab takes only photo and description edits

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
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) is signed in on <grade10 vault url>.
* Staff opened `<draft_1>` for the collector at the counter with `<item_1>`, a slab the register knows: trading card, PSA, grade 10, `AB12345`.

**Steps:**

1. Open `<draft_1>` from the case list.
2. Go back to the Describe step.
3. Try to change the category, the title, the grader, the grade and the cert.
4. Change the description and continue.
5. Add one photograph on the Photograph step.
6. Tick the statement and send it in.

**Expected Results:**

* Step 3 changes none of category, title, grader, grade or cert; they read as the register's.
* The request is submitted carrying the new description and the added photograph.
* `<item_1>` still reads trading card, PSA, grade 10 and `AB12345` in the register.
