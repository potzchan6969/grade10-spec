# grade10-admin/inventory/catalog Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-30, tcs-rules r4

## grade10-admin-inventory-catalog-US9: Inventory admin sees unsold auction stock come back

**As an** inventory admin,
**I want** the stock of an auction that closed with no winner to show as available, with the hold closed and the listing named on the product page and in the history,
**so that** I can trust the count and see why it moved.

### grade10-admin-inventory-catalog-US9-TC1-2: Unsold close returns the hold and names the listing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-09

**Pre-conditions:**

* admin(holds the inventory catalogue grant, no Auction grant) is on <inventory product url> of `<product_1>`.
* `<product_1>` has stored stock `<stock>` and no hold but `<listing_1>`'s.
* `<listing_1>` holds `<held quantity>` units and has just closed with no winner.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | An Auction listing of `<product_1>`, code `<code_1>`, title `<title_1>`, quantity `<held quantity>`, no bids |
| `<stock>` | 10 units (any count of at least `<held quantity>`) |
| `<held quantity>` | 4 units (any quantity from 1 to 500; more than 1, so a rise of one unit is told apart) |
| `<available before>` | 6 units: `<stock>` minus `<held quantity>` |
| `<available after>` | 10 units: `<available before>` plus `<held quantity>` |
| `<close time>` | The date and time `<listing_1>`'s close passed |

**Steps:**

1. Read stock, reserved and available.
2. Read `<listing_1>`'s Auction hold.
3. Open the product history.
4. Read the newest entry.

**Expected Results:**

* Step 1: available reads `<available after>`, up by `<held quantity>`; reserved reads 0.
* Step 2: the hold reads closed and released, remaining 0.
* Step 2: the hold names `<code_1>` and `<title_1>`.
* Step 4: one release entry of `<held quantity>` units.
* Step 4: When reads the date and time, at `<close time>`.
* Step 4: it shows its action, quantity and an actor.
* Step 4: Holder reads `<code_1>` and `<title_1>`.
* Step 4: Remarks read `Released by unsold listing`.
* Step 4: no admin step appears between the close and the entry.

### grade10-admin-inventory-catalog-US9-TC2-2: Sold close moves the hold to sold, not available

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
* **Trace:** grade10-admin-inventory-catalog-US-09

**Pre-conditions:**

* admin(holds the inventory catalogue grant) is on <inventory product url> of `<product_2>`.
* `<product_2>` has stored stock `<stock>` and an Auction hold of `<held quantity>` for `<listing_2>`, which closed with a winner whose sale is recorded.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | An Auction listing of `<product_2>`, code `<code_2>`, title `<title_2>`, closed sold |
| `<stock>` | 10 units (any count of at least `<held quantity>`) |
| `<held quantity>` | 3 units (any quantity from 1 to 500) |
| `<expected available>` | 7 units: `<stock>` minus `<held quantity>`, unchanged by the close |

**Steps:**

1. Read stock, sold and available.
2. Read `<listing_2>`'s Auction hold.
3. Open the product history.
4. Read the entries for `<listing_2>`.

**Expected Results:**

* Step 1: available reads `<expected available>`; sold is up by `<held quantity>`.
* Step 2: the hold reads sold, not released.
* Step 4: the sale entry's Holder reads `<code_2>` and `<title_2>`.
* Step 4: no entry reads `Released by unsold listing`.

### grade10-admin-inventory-catalog-US9-TC3-2: Called-off release carries no remarks

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-09

**Pre-conditions:**

* admin(holds the inventory catalogue grant) is on <inventory product url> of `<product_3>`.
* `<product_3>` had an Auction hold of `<held quantity>` for `<listing_3>`, which an operator called off before its close.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | An Auction listing of `<product_3>`, code `<code_3>`, title `<title_3>`, called off |
| `<held quantity>` | 2 units (any quantity from 1 to 500) |

**Steps:**

1. Read `<listing_3>`'s Auction hold.
2. Open the product history.
3. Read the release entries for `<listing_3>`.

**Expected Results:**

* Step 1: the hold reads released, remaining 0.
* Step 3: one release entry of `<held quantity>` units.
* Step 3: its Holder reads `<code_3>` and `<title_3>`.
* Step 3: its Remarks read `—`.

### grade10-admin-inventory-catalog-US9-TC4-2: Clean-up release reads as the clean-up's

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
* **Trace:** grade10-admin-inventory-catalog-US-09

**Pre-conditions:**

* Seeded before this change shipped: `<listing_4>`, `<listing_5>` and `<listing_6>` closed Unsold, each still holding its stock of its own product.
* `<product_7>`'s Auction hold belongs to `<listing_7>`, which is live.
* The one-time clean-up has not yet run.
* admin(holds the inventory catalogue grant) is signed in to the inventory console.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | Closed Unsold, code `<code_4>`, title `<title_4>`, holding 5 units of `<product_4>` |
| `<listing_5>` | Closed Unsold, code `<code_5>`, title `<title_5>`, holding 1 unit of `<product_5>` |
| `<listing_6>` | Closed Unsold, code `<code_6>`, title `<title_6>`, holding 2 units of `<product_6>` |
| `<listing_7>` | Published, its close still ahead, holding 1 unit of `<product_7>` |
| `<clean-up time>` | The date and time the clean-up runs |

**Steps:**

1. Run the one-off clean-up of held Unsold stock.
2. Navigate to <inventory product url> of `<product_4>`.
3. Read available and `<listing_4>`'s hold.
4. Open the product history.
5. Read the newest entry.
6. Repeat steps 2 to 5 for `<product_5>` and `<product_6>`.
7. Navigate to <inventory product url> of `<product_7>`.
8. Read `<listing_7>`'s hold.

**Expected Results:**

* Step 3: available rose by the listing's held units; the hold reads closed and released and names the listing's code and title.
* Step 5: one release entry of the held units, When at `<clean-up time>`.
* Step 5: Holder reads the listing's code and title.
* Step 5: Remarks read `Released by unsold listing (clean-up)`.
* Step 6 finds the same for `<listing_5>` and `<listing_6>`.
* Step 8: `<listing_7>`'s hold is unchanged, still active.

### grade10-admin-inventory-catalog-US9-TC5-1: Every history entry shows its holder and remarks

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
* **Trace:** grade10-admin-inventory-catalog-US-09

**Pre-conditions:**

* admin(holds the inventory catalogue grant) is on <inventory product url> of `<product_8>`.
* `<product_8>`'s history holds the row's entry.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | An Auction listing of `<product_8>`, code `<code_8>`, title `<title_8>` |
| `<admin reference>` | The holder reference an admin reserve on `<product_8>` minted |
| `<vault reference>` | The holder reference of a Vault hold on `<product_8>` |
| `<admin remarks>` | `Held for a trade show` (any remarks the admin typed) |

| Row | Entry | Holder | Remarks |
| --- | --- | --- | --- |
| Auction hold | `<listing_8>` reserves 1 unit | `Auction`, `<code_8>` and `<title_8>` | Not asserted |
| Admin hold | An admin reserves 1 unit, typing `<admin remarks>` | `Admin` and `<admin reference>` | `—` |
| Vault hold | Vault reserves 1 unit | `Vault` and `<vault reference>` | Not asserted |
| Product edit | An admin renames `<product_8>` | `—` | `—` |

**Steps:**

1. Open the product history.
2. Read the row's entry.

**Expected Results:**

* Step 2: When reads a date and a time.
* Step 2: the entry shows its action, quantity and actor.
* Step 2: Holder reads the row's holder.
* Step 2: Remarks read the row's remarks, where the row asserts them.

## Settled

- **Remarks on a reserve** - Remarks is the entry's own reason, so an admin hold's reserve entry reads `—` (Q17)
- **Holder kind** - read as Auction, Vault or Admin; the stored kind and reference are unchanged (Q16)

## Reconciliation

**Run:** QA2, 2026-09-30, after the anchors moved on Q10, Q13 and Q14. QA1's blind pass read the Feature set, the journeys, `decisions.md`, the proposal, the linked PRD sections, the durable suite and the domain suite with their Reconciliation stripped, and the two rulebooks; it was denied every `## Requirements` section, `openspec/specs/` beyond those, and the archive. QA2 read both suites, both deltas, `tech-design.md` and `tasks.md`. It is a statement, not proof.

- **Raised, folded into spec** - the holder label on each Auction write, as `grade10-admin-inventory-catalog-SC-140`; the Holder and Remarks columns, as `grade10-admin-inventory-catalog-SC-141`, `grade10-admin-inventory-catalog-SC-142` and `grade10-admin-inventory-catalog-SC-143`; the two remarks texts, as `grade10-admin-inventory-catalog-SC-136` and `grade10-admin-inventory-catalog-SC-137`
- **Raised, escalated** - whether Remarks shows an admin hold's typed remarks on its reserve entry (see Contradicted), and how the holder kind reads in the Holder column, landed as Q17 and Q16
- **Raised, rejected** - none this run
- **Joined** - `grade10-admin-inventory-catalog-SC-136`, `grade10-admin-inventory-catalog-SC-139` and `grade10-admin-inventory-catalog-SC-141` into `grade10-admin-inventory-catalog-US9-TC1-2`; `grade10-admin-inventory-catalog-SC-137` into `grade10-admin-inventory-catalog-US9-TC4-2`; `grade10-admin-inventory-catalog-SC-138` into `grade10-admin-inventory-catalog-US9-TC3-2`; `grade10-admin-inventory-catalog-SC-142` into `grade10-admin-inventory-catalog-US9-TC5-1` as its Product edit row, added by QA2; `grade10-admin-inventory-catalog-SC-143`'s history Holder into `grade10-admin-inventory-catalog-US9-TC5-1`'s Vault row
- **Out of suite** - `grade10-admin-inventory-catalog-SC-140`, a label replaced by a later write and kept by one that sends none: decided by the inventory service tests in grade10 (task 2.1); `grade10-admin-inventory-catalog-SC-143`'s Reference cell reading the holder reference: decided by the product page's component tests in grade10 (task 6.1)
- **Patched, not re-run** - `grade10-admin-inventory-catalog-US9-TC2-2` now records the sale, since a hold stays active after a winning close until the sale moves it to sold; `grade10-admin-inventory-catalog-US9-TC3-2` reads Remarks as `—`, the value the Remarks column shows for an entry with none; `grade10-admin-inventory-catalog-US9-TC4-2` says "before this change shipped" where it said "before the release". All keep `<v>`
- **Settled by the artifacts, not raised** - what Holder reads on an entry with no hold (`—`, the Holder column's rule); the When of a retried release (the successful release, since an entry's time is the server time of the mutation that succeeded)
- **Trimmed by the simpler reading** - cases that repeat another case or a durable rule
- **Contradicted** - `grade10-admin-inventory-catalog-US9-TC5-1`'s Admin hold row expects the admin's typed remarks in the reserve entry's Remarks; the Change history fields requirement makes Remarks the entry's reason, which is null on a reserve, so the column would read `—`. settled by Q17: Remarks is the entry's own reason, so the row now reads `—`
- **Uncovered anchors** - none: `grade10-admin-inventory-catalog-US-09` has five cases; the group anchor `Unsold auction stock` is walked by the same cases
