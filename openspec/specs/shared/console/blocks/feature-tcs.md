# shared/console/blocks Test Cases

**Status:** pending-review · 0/5
**Drafts styled:** 2026-10-16, tcs-rules r6
**Out of suite (non-GUI):**
- `shared-console-blocks-SC-01` — the console package is the one source the consoles import, held by grade10's build and type check
- `shared-console-blocks-SC-02` — the same build and type check
- `shared-console-blocks-SC-03` — every listed export resolves in grade10's type check of the consoles
- `shared-console-blocks-SC-04` — the shared UI package's export list, held by its own type check and `pnpm run test`

## Background

Every case runs on a console surface built from the console package's blocks; `<queue page>` is a queue page in <grade10 admin url> that reads its rows on load, such as the vault's operator queue.

## shared-console-blocks-US1: Operator distinguishes a failed read from an empty queue

**As an** operator
**I want** a queue that failed to load to say it failed
**so that** I never mistake an outage for having nothing to do.

<!-- trace:case id=g10.shared-blocks.TC-jj1 rev=1 covers=g10.shared-blocks.SC-s7q -->
### shared-console-blocks-US1-TC2-1: A queue whose read fails says it failed rather than empty

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-blocks-US-01

**Pre-conditions:**

* admin(shop staff) is signed in to <grade10 admin url>.
* The read behind `<queue page>` is refused, for example its service is unreachable.

**Steps:**

1. Open `<queue page>`.

**Expected Results:**

* The page says the read failed, in the error tone.
* Nothing on the page says the queue is empty.

<!-- trace:case id=g10.shared-blocks.TC-v63 rev=1 covers=g10.shared-blocks.SC-9o7 -->
### shared-console-blocks-US1-TC4-1: A queue longer than its page can be walked to older rows and back

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-blocks-US-01

**Pre-conditions:**

* admin(shop staff) is signed in to <grade10 admin url>.
* `<queue page>` holds more rows than one page shows.

**Steps:**

1. Open `<queue page>`.
2. Move to the older rows.
3. Move back toward the newest.

**Expected Results:**

* Step 1 offers moving to older rows, not only a note that more exist.
* Step 2 shows the next page of older rows and offers the way back.
* Step 3 returns to the newer rows.

---

## shared-console-blocks-US2: Operator confirms an irreversible move deliberately

**As an** operator
**I want** every irreversible move to pass through a confirmation that names it and can be cancelled
**so that** a slip of the hand never commits something I cannot take back.

<!-- trace:case id=g10.shared-blocks.TC-woe rev=1 covers=g10.shared-blocks.SC-8kz -->
### shared-console-blocks-US2-TC1-1: An irreversible move confirms in a dialog that names it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-blocks-US-02

**Pre-conditions:**

* admin(shop staff) is signed in to <grade10 admin url>.
* A console surface offers an irreversible move, such as banning an account in Users.

**Steps:**

1. Start the irreversible move.

**Expected Results:**

* A dialog the page renders opens, naming the move in the console's words and offering cancel.
* The browser's own confirmation box never appears.

---

## shared-console-blocks-US3: Operator narrows a queue with an announced control

**As an** operator
**I want** panel switches and row filters to announce what is selected
**so that** I can tell where I am and what I am looking at, with or without sight of the toggled styling.

<!-- trace:case id=g10.shared-blocks.TC-io4 rev=1 covers=g10.shared-blocks.SC-5dr -->
### shared-console-blocks-US3-TC1-1: A panel switch is announced as tabs with the visible panel selected

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-blocks-US-03

**Pre-conditions:**

* admin(shop staff) is signed in to <grade10 admin url>.
* A console surface switches panels, such as Roles & Permissions' Roles and Permissions.

**Steps:**

1. Move to the panel-switching control with a screen reader.
2. Switch to the other panel.

**Expected Results:**

* Step 1 announces the group as tabs and the visible panel's control as selected.
* Step 2 announces the newly visible panel's control as selected.

<!-- trace:case id=g10.shared-blocks.TC-tnr rev=1 covers=g10.shared-blocks.SC-bjx -->
### shared-console-blocks-US3-TC2-1: A row filter is announced as one choice with its selected option

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-console-blocks-US-03

**Pre-conditions:**

* admin(shop staff) is signed in to <grade10 admin url>.
* `<queue page>` offers a filter over its rows.

**Steps:**

1. Move to the filter with a screen reader.
2. Choose another option.

**Expected Results:**

* Step 1 announces the options as one choice and the selected option as selected.
* Step 2 announces the chosen option as selected and narrows the rows to it.
