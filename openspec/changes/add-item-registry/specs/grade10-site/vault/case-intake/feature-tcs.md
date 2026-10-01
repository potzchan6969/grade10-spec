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
* Staff opened `<draft_1>` for the collector at the counter with `<item_1>`, a slab the register holds under this collector: trading card, PSA, grade 10, `AB12345`.

**Steps:**

1. Open `<draft_1>` from the case list.
2. Go back to the Describe step.
3. Try to change the category and the title.
4. Change the description and continue.
5. Add one photograph on the Photograph step.
6. Tick the statement and send it in.

**Expected Results:**

* Step 3 changes neither; both read as the register's, with no field.
* The request is submitted carrying the new description and the added photograph.
* `<item_1>` still reads trading card, PSA, grade 10 and `AB12345` in the register, its description unchanged.

### grade10-site-vault-case-intake-US1-TC24-1: An edit to a linked draft's category or title is refused

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
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) is signed in.
* Staff opened `<draft_1>` for the collector at the counter with `<item_1>`, a slab the register holds under this collector: trading card titled `<title_1>`.

**Steps:**

1. Send an edit of `<draft_1>` changing its category to comic, straight to the vault worker.
2. Send an edit of `<draft_1>` changing its title, straight to the vault worker.
3. Read `<draft_1>`.

**Expected Results:**

* Steps 1 and 2 are each refused by name.
* `<draft_1>` still reads trading card and `<title_1>`.

## Reconciliation

**Run:** QA2, 2026-10-02. QA1's blind pass read the Feature set, the journey, the proposal, `decisions.md` with its empty `## Raised`, `ui-design.md` with its anchors stripped, the Collector Pages and Items PRD pages, and the durable case-intake suite for id continuity with its Reconciliation stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the code. QA2 read QA1's suite and questions, the delta spec, `tech-design.md`, `tasks.md` and the operator-queue delta. It is a statement, not proof.

- **Folded** - `grade10-site-vault-case-intake-US1-TC22-1` into `grade10-site-vault-case-intake-SC-32`; `grade10-site-vault-case-intake-US1-TC23-1` into `grade10-site-vault-case-intake-SC-33`, gaining the register's description left unchanged as Q47
- **Patched, not re-run** - `grade10-site-vault-case-intake-US1-TC23-1` tried the grader, grade and cert on the collector's Describe step, which carries no such field; it now tries the category and the title, the two `grade10-site-vault-case-intake-SC-33` reads from the register
- **Added by QA2** - `grade10-site-vault-case-intake-US1-TC24-1` for `grade10-site-vault-case-intake-SC-34`, the worker's refusal, which the blind case reached only through the interface
- **Raised, answered by the round** - the customer's description edit on a linked draft changes the request alone (Q47, `grade10-site-vault-case-intake-SC-33`)
- **Raised, escalated** - none
- **Round 4** - `grade10-site-vault-case-intake-SC-33` and `grade10-site-vault-case-intake-SC-34` hold only for a slab the register holds under the customer at the counter, the one the walk-in form fills; `grade10-site-vault-case-intake-US1-TC23-1` and `grade10-site-vault-case-intake-US1-TC24-1` now say so
- **Rejected** - none
- **Contradicted** - none
- **Uncovered anchors** - none: US-01 has a case for each of the three scenarios; the modified requirement's other scenarios keep their durable cases
