# grade10-admin/inventory/catalog Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-02, tcs-rules r4

**Out of suite:**

- `grade10-admin-inventory-catalog-SC-153` — the inventory repository and router tests in grade10 (task 5.1): a unit's history paged past 150 entries to its intake.
- `grade10-admin-inventory-catalog-SC-166` — the inventory concurrency tests in grade10 (task 4.1): two assignments racing for the last unit of regular stock, which no person can send at one moment.

## grade10-admin-inventory-catalog-US4: Reconstruct stock changes

**As an** inventory admin,
**I want** every stock and reservation transition recorded,
**so that** I can explain how the latest snapshot was reached.

### grade10-admin-inventory-catalog-US4-TC1-1: Cert ID changes leave the ledger totals unmoved

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
* **Trace:** grade10-admin-inventory-catalog-US-04

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_1>`.
* `<product_1>` holds `<cert_a>`, an available Cert record with no active hold.
* `<product_1>` holds `<regular available>` units of available regular stock outside every hold.

**Test data:**

| Field | Value |
| --- | --- |
| `<cert_a>` | `PSA-10000001`, a Cert record of `<product_1>` |
| `<cert_b>` | `PSA-10000002`, unused on `<product_1>` |
| `<cert_c>` | `PSA-10000003`, unused on `<product_1>` |
| `<grade issuer>` | `PSA` (any issuer but `RAW`) |
| `<regular available>` | 3 units (any count of at least 1) |

**Steps:**

1. Read stock, reserved, sold, withdrawn, vaulted and available.
2. Click View Cert IDs.
3. Change `<cert_a>` to `<cert_b>`.
4. Assign `<cert_c>` with `<grade issuer>` to one unit of the `No Cert ID` available row.
5. Close Cert ID details.
6. Read stock, reserved, sold, withdrawn, vaulted and available.
7. Open the product history.

**Expected Results:**

* Step 6: every figure reads as in step 1.
* Step 7: two new `Cert ID change` entries, quantity one each.
* Step 7: one Action reads `Cert ID change · <cert_a> → <cert_b>`.
* Step 7: the other Action reads `Cert ID change · No Cert ID → <cert_c>`.
* Step 7: each of the two reads Holder `—` and Remarks `—`.
* Step 7: no intake or withdrawal entry was added.

---

## grade10-admin-inventory-catalog-US69: Operator records a received graded unit

**As an** inventory admin,
**I want** to record optional Cert IDs when I intake stock,
**so that** each numbered graded unit can be traced without preventing
unnumbered stock from entering inventory.

### grade10-admin-inventory-catalog-US69-TC3-1: Intake refuses a Cert ID a change already gave

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-69

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_2>`.
* `<product_2>` holds `<given cert>`, given by the row's Cert ID change.

**Test data:**

| Field | Value |
| --- | --- |
| `<cert_a>` | `PSA-20000001` |
| `<cert_b>` | `PSA-20000002` |

| Row | Cert ID change | `<given cert>` |
| --- | --- | --- |
| Correction | `<cert_a>` changed to `<cert_b>` | `<cert_b>` |
| Assignment | A unit of regular stock assigned `<cert_b>` | `<cert_b>` |

**Steps:**

1. Read stock and Cert ID details.
2. Intake quantity one with Cert ID `<given cert>`.
3. Read stock, Cert ID details and the product history.

**Expected Results:**

* Step 2: the intake is refused.
* Step 3: stock and the Cert records read as in step 1.
* Step 3: the refused intake added no history entry.

---

## grade10-admin-inventory-catalog-US14: Inventory admin accounts for every unit in Cert ID details

**As an** inventory admin,
**I want** Cert ID details to list the regular stock without a Cert ID beside the Cert records, by state and holder,
**so that** I can see where every unit of the product is without adding up the counts myself.

### grade10-admin-inventory-catalog-US14-TC1-1: Cert ID details lists every tracked unit by state and holder

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-14

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_3>`.
* `<product_3>` holds the Cert records and regular stock in **Test data**.

**Test data:**

| Field | Value |
| --- | --- |
| `<cert_avail>` | `PSA-30000001`, available, no active hold |
| `<cert_held>` | `PSA-30000002`, held by `<listing_1>` |
| `<cert_sold>` | `PSA-30000003`, sold |
| `<regular available>` | 500 units of regular stock outside every hold (any count of at least 2; a bulk count still reads one row) |
| `<listing_1>` | An Auction listing of `<product_3>`, code `<code_1>`, title `<title_1>` |
| `<admin hold>` | An admin hold on regular stock, 2 units, active |
| `<auction hold>` | `<listing_2>`'s hold on regular stock, 3 units, 1 sold from it, so 2 remaining |
| `<released hold>` | An admin hold on regular stock, released, 0 remaining |
| `<regular sold>` | 4 units of regular stock sold outside any hold |
| `<regular withdrawn>` | 1 unit of regular stock withdrawn |

**Steps:**

1. Click View Cert IDs.
2. Read the Cert record rows.
3. Read the `No Cert ID` rows.
4. Read the order of the rows.

**Expected Results:**

* Step 1: Cert ID details opens.
* Step 2: one row each for `<cert_avail>`, `<cert_held>` and `<cert_sold>`, each with its state.
* Step 2: `<cert_held>`'s row names `<listing_1>` as its holder.
* Step 3: one available `No Cert ID` row reads `<regular available>`.
* Step 3: one Reserved row for `<admin hold>`: Admin, its reference and 2.
* Step 3: one Reserved row for `<auction hold>`: Auction, `<listing_2>` and 2.
* Step 3: no row for `<released hold>`, `<regular sold>` or `<regular withdrawn>`.
* Step 4: the Cert record rows come first, by Cert ID, then the available `No Cert ID` row, then the hold rows.

### grade10-admin-inventory-catalog-US14-TC2-1: A product without Cert records lists its regular stock

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
* **Trace:** grade10-admin-inventory-catalog-US-14

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_4>`.
* `<product_4>` has no Cert record.
* `<product_4>` holds `<regular available>` units of available regular stock outside every hold.

**Test data:**

| Field | Value |
| --- | --- |
| `<regular available>` | 6 units (any count of at least 1) |

**Steps:**

1. Click View Cert IDs.
2. Read the rows.

**Expected Results:**

* Step 1: Cert ID details opens.
* Step 2: one `No Cert ID` row reads available and `<regular available>`.
* Step 2: no other row is listed.

### grade10-admin-inventory-catalog-US14-TC3-1: Selecting a No Cert ID row shows the regular stock's history

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
* **Trace:** grade10-admin-inventory-catalog-US-14

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_5>`.
* `<product_5>`'s regular stock was intaken by `<regular intake>`, and `<admin hold>` reserved part of it.
* `<product_5>` holds `<cert_a>`, whose Cert ID was corrected from `<cert_x>`, and `<cert hold>` now holds it.
* One unit of `<product_5>`'s regular stock was given `<cert_g>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<regular intake>` | An intake of 5 units with no Cert ID |
| `<admin hold>` | An admin hold of 2 units of regular stock, active |
| `<cert_x>` | `PSA-50000001` |
| `<cert_a>` | `PSA-50000002` |
| `<cert hold>` | An admin hold of `<cert_a>`, active |
| `<cert_g>` | `PSA-50000003`, given with Grade Issuer `PSA` |

| Row | `No Cert ID` row selected |
| --- | --- |
| Available | The available row, 2 units |
| Held | The row for `<admin hold>`, 2 remaining |

**Steps:**

1. Click View Cert IDs.
2. Click the `No Cert ID` row the row names.
3. Read its history.

**Expected Results:**

* Step 3: the entry for `<regular intake>` shows.
* Step 3: the reserve entry for `<admin hold>` shows.
* Step 3: the `Cert ID change` from `No Cert ID` to `<cert_g>` shows.
* Step 3: the `Cert ID change` from `<cert_x>` to `<cert_a>` does not show.
* Step 3: the reserve entry for `<cert hold>` does not show.

### grade10-admin-inventory-catalog-US14-TC4-1: Regular stock that is all held shows only its hold's row

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
* **Trace:** grade10-admin-inventory-catalog-US-14

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_14>`.
* `<product_14>` has no Cert record.
* `<product_14>` has `<regular sold>` and `<regular withdrawn>`, and `<auction hold>` holds every unit on hand.

**Test data:**

| Field | Value |
| --- | --- |
| `<regular sold>` | 3 units of regular stock sold outside any hold |
| `<regular withdrawn>` | 1 unit of regular stock withdrawn |
| `<listing_14>` | An Auction listing of `<product_14>`, code `<code_14>`, title `<title_14>` |
| `<auction hold>` | `<listing_14>`'s hold on regular stock, 2 units, active |

**Steps:**

1. Click View Cert IDs.
2. Read the rows.

**Expected Results:**

* Step 2: one row only: `No Cert ID`, Reserved, Auction, `<code_14> · <title_14>` and 2.
* Step 2: no available `No Cert ID` row is listed.
* Step 2: no row lists `<regular sold>` or `<regular withdrawn>`.

### grade10-admin-inventory-catalog-US14-TC5-1: A released hold's units return to the available row

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
* **Trace:** grade10-admin-inventory-catalog-US-14

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_15>`.
* `<product_15>` holds `<regular available>` units of available regular stock outside every hold.
* `<admin hold>` holds regular stock of `<product_15>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<regular available>` | 1 unit |
| `<admin hold>` | An admin hold of 2 units of regular stock, active |
| `<count after>` | 3 units: `<regular available>` plus `<admin hold>`'s 2 |

**Steps:**

1. Click View Cert IDs.
2. Read the `No Cert ID` rows.
3. Close Cert ID details.
4. Release `<admin hold>` whole from the product page.
5. Click View Cert IDs.
6. Read the `No Cert ID` rows.

**Expected Results:**

* Step 2: the available row reads `<regular available>`; the row for `<admin hold>` reads 2.
* Step 6: the available row reads `<count after>`.
* Step 6: no row for `<admin hold>` is listed.

---

## grade10-admin-inventory-catalog-US15: Inventory admin corrects or assigns a unit's Cert ID

**As an** inventory admin,
**I want** to change a wrong Cert ID on an available unit, or give an available unit of regular stock its Cert ID, from Cert ID details,
**so that** the record matches the card on the shelf without removing the unit and losing its history.

### grade10-admin-inventory-catalog-US15-TC1-1: Correcting a Cert ID keeps the record and records the change

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-15

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_6>`.
* `<product_6>` holds `<cert_a>`, an available Cert record with no active hold.
* `<cert_a>` was intaken with `<copy facts>`, and `<tagged image>` is tagged to it.

**Test data:**

| Field | Value |
| --- | --- |
| `<cert_a>` | `PSA-60000001` |
| `<copy facts>` | Grade Issuer `PSA`, Grade `10`, Autograph Grade `10`, Serial `07/25` |
| `<tagged image>` | One product image tagged to `<cert_a>` |
| `<other product>` | Another product holding a Cert record `PSA-60000003` |
| `<change time>` | The date and time step 4 is saved |

| Row | New Cert ID | Remarks typed | Remarks read |
| --- | --- | --- | --- |
| Unused anywhere | `PSA-60000002` | `Digit misread at intake` | `Digit misread at intake` |
| Used on `<other product>` only | `PSA-60000003` | none | `—` |

**Steps:**

1. Click View Cert IDs.
2. Open the correct action on `<cert_a>`'s row.
3. Enter the row's new Cert ID and remarks.
4. Save.
5. Read the Cert record rows.
6. Click the new Cert ID's row.
7. Read its history.
8. Open the product history.

**Expected Results:**

* Step 5: the row reads the new Cert ID; no row reads `<cert_a>`.
* Step 5: it is still available, with `<copy facts>`.
* Step 5: `<tagged image>` is still tagged to it.
* Step 7: the `<cert_a>` intake entry still shows, below the `Cert ID change`.
* Step 7: a `Cert ID change` entry, quantity one, `<cert_a>` before, the new Cert ID after.
* Step 7: it shows `<change time>`, the admin as actor and the row's remarks read.
* Step 8: the same entry shows in the product history.

### grade10-admin-inventory-catalog-US15-TC2-1: Assigning a Cert ID turns one regular unit into a Cert record

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-15

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_7>`.
* `<product_7>` holds `<regular available>` units of available regular stock outside every hold.
* No Cert record of `<product_7>` reads `<new cert>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<regular available>` | 4 units (any count of at least 1) |
| `<count after>` | 3 units: `<regular available>` minus 1 |
| `<new cert>` | `CGC-70000001` |
| `<change time>` | The date and time step 4 is saved |

| Row | Grade Issuer | Grade | Autograph Grade | Serial |
| --- | --- | --- | --- | --- |
| Every fact | `CGC` | `9.8` | `10` | `12/50` |
| Required only | `CGC` | none | none | none |
| Dashes | `CGC` | `-` | `-` | `-` |

**Steps:**

1. Click View Cert IDs.
2. Open the assign action on the available `No Cert ID` row.
3. Enter `<new cert>` and the row's facts.
4. Save.
5. Read the rows.
6. Click `<new cert>`'s row.
7. Read its history.

**Expected Results:**

* Step 5: the available `No Cert ID` row reads `<count after>`.
* Step 5: a new available row reads `<new cert>` with the row's facts.
* Step 5: facts the row leaves out or gives as `-` read empty.
* Step 7: one entry only: `Cert ID change`, quantity one.
* Step 7: it reads `No Cert ID` before and `<new cert>` after.
* Step 7: it shows `<change time>` and the admin as actor.

### grade10-admin-inventory-catalog-US15-TC3-1: An unusable new Cert ID leaves the record unchanged

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-inventory-catalog-US-15

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_8>`.
* `<product_8>` holds `<cert_a>`, available with no active hold, and `<cert_b>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<cert_a>` | `PSA-80000001` |
| `<cert_b>` | `PSA-80000002`, another Cert record of `<product_8>` in any state |

| Row | New Cert ID entered |
| --- | --- |
| Empty | nothing |
| Spaces only | three spaces |
| Used on the product | `PSA-80000002` |
| Used on the product, padded | ` PSA-80000002 `, a space either side |
| Its own Cert ID | `PSA-80000001` |

**Steps:**

1. Click View Cert IDs.
2. Open the correct action on `<cert_a>`'s row.
3. Enter the row's new Cert ID.
4. Save.
5. Read the Cert record rows and the product history.

**Expected Results:**

* Step 4: the change is refused.
* Step 5: `<cert_a>` and `<cert_b>` read as before.
* Step 5: no `Cert ID change` entry was added.

### grade10-admin-inventory-catalog-US15-TC4-1: An incomplete assignment leaves the regular stock unchanged

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-inventory-catalog-US-15

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_9>`.
* `<product_9>` holds `<regular available>` units of available regular stock outside every hold.
* `<product_9>` holds the Cert record `<cert_b>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<regular available>` | 2 units (any count of at least 1) |
| `<cert_b>` | `BGS-90000002` |

| Row | Cert ID | Grade Issuer |
| --- | --- | --- |
| Cert ID missing | none | `BGS` |
| Grade Issuer missing | `BGS-90000001` | none |
| Grade Issuer `RAW` | `BGS-90000001` | `RAW` |
| Cert ID used on the product | `BGS-90000002` | `BGS` |

**Steps:**

1. Click View Cert IDs.
2. Open the assign action on the available `No Cert ID` row.
3. Enter the row's Cert ID and Grade Issuer.
4. Save.
5. Read the rows and the product history.

**Expected Results:**

* Step 4: the assignment is refused.
* Step 5: the available `No Cert ID` row still reads `<regular available>`.
* Step 5: no new Cert record row is listed.
* Step 5: no `Cert ID change` entry was added.

### grade10-admin-inventory-catalog-US15-TC5-1: A unit that is not available offers no Cert ID change

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-inventory-catalog-US-15

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_10>`.
* `<product_10>` holds every unit in the rows below.

**Test data:**

| Row | Unit |
| --- | --- |
| Reserved Cert record | `PSA-10100001`, held by an Auction listing's active hold |
| Admin-held Cert record | `PSA-10100002`, held by an active admin hold |
| Sold Cert record | `PSA-10100003`, sold |
| Withdrawn Cert record | `PSA-10100004`, withdrawn |
| Vaulted Cert record | `PSA-10100005`, vaulted |
| Held regular stock | The `No Cert ID` row of an active admin hold on regular stock |

**Steps:**

1. Click View Cert IDs.
2. Find the row's unit.
3. Read its actions.

**Expected Results:**

* Step 3: no correct or assign action is offered on it.
* Step 3: the row says why its Cert ID cannot change.

### grade10-admin-inventory-catalog-US15-TC6-1: A unit held after the form opened is refused at save

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-inventory-catalog-US-15

**Pre-conditions:**

* admin A(holds Inventory write authority) is on <inventory product url> of `<product_11>`.
* admin B(holds Inventory write authority) acts on `<product_11>` in a separate session.
* `<product_11>` holds `<cert_a>`, available with no active hold, and exactly 1 unit of available regular stock outside every hold.

**Test data:**

| Field | Value |
| --- | --- |
| `<cert_a>` | `PSA-11000001` |
| `<new cert>` | `PSA-11000002`, unused on `<product_11>` |

| Row | Admin A opens | Admin B, before admin A saves |
| --- | --- | --- |
| Correction | The correct action on `<cert_a>`'s row | Reserves `<cert_a>` under an admin hold |
| Assignment | The assign action on the available `No Cert ID` row | Reserves the last regular unit, `No Cert ID`, under an admin hold |

**Steps:**

1. As admin A, click View Cert IDs.
2. As admin A, open the row's action.
3. As admin A, enter `<new cert>`, with Grade Issuer `PSA` on an assignment.
4. As admin B, take the row's step.
5. As admin A, save.
6. Read Cert ID details and the product history.

**Expected Results:**

* Step 5: the change is refused.
* Step 6: no row reads `<new cert>`; `<cert_a>` is unchanged.
* Step 6: admin B's hold is listed and intact.
* Step 6: no `Cert ID change` entry was added.

### grade10-admin-inventory-catalog-US15-TC7-1: An admin without write authority reads but cannot change

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-15

**Pre-conditions:**

* admin(reads Inventory, no Inventory write authority) is on <inventory product url> of `<product_12>`.
* `<product_12>` holds `<cert_a>`, available with no active hold, and available regular stock outside every hold.

**Test data:**

| Field | Value |
| --- | --- |
| `<cert_a>` | `PSA-12000001` |
| `<new cert>` | `PSA-12000002`, unused on `<product_12>` |

**Steps:**

1. Click View Cert IDs.
2. Read the rows and their actions.
3. Click `<cert_a>`'s row.
4. Read its history.
5. Send a Cert ID change of `<cert_a>` to `<new cert>` under this admin's session, outside the page.
6. Send an assignment of `<new cert>` with Grade Issuer `PSA` under this admin's session, outside the page.
7. Read Cert ID details again.

**Expected Results:**

* Step 2: the Cert record and `No Cert ID` rows are listed.
* Step 2: no correct or assign action is offered.
* Step 4: the history shows.
* Step 5: the request is refused.
* Step 6: the request is refused.
* Step 7: `<cert_a>` is unchanged; no row reads `<new cert>`.
* Step 7: the available `No Cert ID` row reads as in step 2.

### grade10-admin-inventory-catalog-US15-TC8-1: An ended Unsold listing shows the corrected Cert ID

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-15

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_13>`.
* `<listing_13>` held `<cert_a>` of `<product_13>` and closed Unsold.
* `<cert_a>`'s hold was released; it reads available with no active hold.
* `<product_13>`'s displayed fields show Cert ID on Auction.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_13>` | An Auction listing of `<product_13>`, code `<code_13>`, title `<title_13>`, closed Unsold |
| `<cert_a>` | `PSA-13000001` |
| `<cert_b>` | `PSA-13000002`, unused on `<product_13>` |

**Steps:**

1. Click View Cert IDs.
2. Change `<cert_a>` to `<cert_b>`.
3. Navigate to <auction admin listing url> of `<listing_13>`.
4. Read its Cert ID.

**Expected Results:**

* Step 2: the change is saved.
* Step 4: the listing reads `<cert_b>`, not `<cert_a>`.

### grade10-admin-inventory-catalog-US15-TC9-1: An assigned unit can be held by its new Cert ID

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
* **Trace:** grade10-admin-inventory-catalog-US-15

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_16>`.
* `<product_16>` holds `<regular available>` units of available regular stock outside every hold.
* A unit of `<product_16>`'s regular stock was given `<new cert>`, which reads available with no active hold.

**Test data:**

| Field | Value |
| --- | --- |
| `<regular available>` | 2 units (any count of at least 1) |
| `<new cert>` | `BGS-16000001`, given with Grade Issuer `BGS` |

**Steps:**

1. Click View Cert IDs.
2. Read the available `No Cert ID` row.
3. Close Cert ID details.
4. Reserve quantity one under an admin hold, choosing `<new cert>`.
5. Click View Cert IDs.
6. Read the rows.

**Expected Results:**

* Step 4: the hold is saved with quantity one, naming `<new cert>`.
* Step 6: `<new cert>`'s row reads Reserved, with Admin and the hold's reference.
* Step 6: the available `No Cert ID` row reads as in step 2.

## Settled

- **A corrected-away Cert ID** — once a record is corrected, no record holds its old Cert ID, so the product may give it again; uniqueness reads the Cert IDs records hold now
- **The record's own Cert ID** — refused like any Cert ID a record of the product holds; the record itself counts
- **Vaulted regular stock** — not listed, with sold and withdrawn; a vaulted Cert record is listed as Vaulted
- **One regular stock history** — every `No Cert ID` row, available or held, shows the same regular stock history; the Cert ID change that numbered a unit shows there and opens the new record's own history
- **Holder on a hold row** — Auction, Vault or Admin, then the hold's label, else its reference, as the product page reads them
- **A corrected or assigned Cert ID** — the intake rules: required, trimmed and unique on the product, with no pattern; an assignment's Grade Issuer is never `RAW`
- **A unit's history** — the columns of the product's history: When, Action, Quantity, Actor, Holder and Remarks

## Reconciliation

**Run:** QA2, 2026-10-02. QA1's blind pass read the Feature set, `user-journeys.md`, `proposal.md`, `decisions.md` with its `## Raised` table empty, the Products and Stock page, the store context and the durable suite with its `## Settled` and without its `## Reconciliation`; it was denied every `## Requirements` section, `openspec/specs/` beyond those, `openspec/changes/archive/`, `tech-design.md` and `tasks.md`. Inventory has no domain suite. QA2 read both readings, `tech-design.md`, `tasks.md`, the durable spec and the Products and Stock page. It is a statement, not proof.

- **Agreed** - `grade10-admin-inventory-catalog-US4-TC1-1` with `grade10-admin-inventory-catalog-SC-144`, `grade10-admin-inventory-catalog-SC-145` and `grade10-admin-inventory-catalog-SC-146`; `grade10-admin-inventory-catalog-US69-TC3-1` with the durable refusal of a Cert ID the product already owns at intake, `grade10-admin-inventory-catalog-SC-97`, guarding that intake reads the Cert ID a change wrote; `grade10-admin-inventory-catalog-US14-TC1-1` with `grade10-admin-inventory-catalog-SC-147` and the unlisted sold and withdrawn units of `grade10-admin-inventory-catalog-SC-148`; `grade10-admin-inventory-catalog-US14-TC2-1` with the requirement's row table, a product with no Cert record; `grade10-admin-inventory-catalog-US14-TC3-1` with `grade10-admin-inventory-catalog-SC-152`; `grade10-admin-inventory-catalog-US15-TC1-1` with `grade10-admin-inventory-catalog-SC-154`, `grade10-admin-inventory-catalog-SC-150`, `grade10-admin-inventory-catalog-SC-144` and `grade10-admin-inventory-catalog-SC-146`; `grade10-admin-inventory-catalog-US15-TC2-1` with `grade10-admin-inventory-catalog-SC-159`, `grade10-admin-inventory-catalog-SC-151` and `grade10-admin-inventory-catalog-SC-145`; `grade10-admin-inventory-catalog-US15-TC3-1` with `grade10-admin-inventory-catalog-SC-155` and `grade10-admin-inventory-catalog-SC-157`; `grade10-admin-inventory-catalog-US15-TC4-1` with `grade10-admin-inventory-catalog-SC-161` and `grade10-admin-inventory-catalog-SC-162`; `grade10-admin-inventory-catalog-US15-TC5-1` with the Cert ID details halves of `grade10-admin-inventory-catalog-SC-156` and `grade10-admin-inventory-catalog-SC-160`; `grade10-admin-inventory-catalog-US15-TC6-1` with `grade10-admin-inventory-catalog-SC-165`, its assignment row with the refusal at 0 available regular stock under the lands-whole requirement; `grade10-admin-inventory-catalog-US15-TC7-1` with `grade10-admin-inventory-catalog-SC-164`; `grade10-admin-inventory-catalog-US15-TC8-1` with `grade10-admin-inventory-catalog-SC-158`
- **Joined, by QA2** - into `grade10-admin-inventory-catalog-US4-TC1-1`, the Action text, Holder and Remarks of `grade10-admin-inventory-catalog-SC-146`; into `grade10-admin-inventory-catalog-US14-TC1-1`, the row order and the Reserved holder cells of `grade10-admin-inventory-catalog-SC-147`; into `grade10-admin-inventory-catalog-US14-TC3-1`, the assignment shown and the hold on a Cert record left out, from `grade10-admin-inventory-catalog-SC-152`; into `grade10-admin-inventory-catalog-US15-TC1-1`, newest first, from `grade10-admin-inventory-catalog-SC-150`; into `grade10-admin-inventory-catalog-US15-TC2-1`, a Dashes row, from the assignment's `-`-as-absent rule; into `grade10-admin-inventory-catalog-US15-TC3-1`, an Its own Cert ID row, from `grade10-admin-inventory-catalog-SC-155`; into `grade10-admin-inventory-catalog-US15-TC7-1`, an assignment sent outside the page, from `grade10-admin-inventory-catalog-SC-164`. Every case keeps `<v>` 1
- **Added, by QA2** - `grade10-admin-inventory-catalog-US14-TC4-1` for `grade10-admin-inventory-catalog-SC-148`; `grade10-admin-inventory-catalog-US14-TC5-1` for `grade10-admin-inventory-catalog-SC-149`; `grade10-admin-inventory-catalog-US15-TC9-1` for `grade10-admin-inventory-catalog-SC-163`, the hold taken as an admin hold where the scenario names Auction, since both take one unit by explicit choice
- **Raised, folded into spec** - none: every case reads behaviour a scenario or a requirement table already states
- **Raised, rejected** - none
- **Raised, escalated** - five rows in `decisions.md`'s `## Raised`, each awaiting the product manager: whether Cert ID uniqueness ignores letter case; the available `No Cert ID` row at 0 and Cert ID details for a product with nothing on hand; the literal `No Cert ID` entered as a Cert ID; a Cert ID a sold, withdrawn or vaulted record holds, refused here while intake revives that record; where Cert ID details shows a unit's copy facts, which `grade10-admin-inventory-catalog-US15-TC1-1` and `grade10-admin-inventory-catalog-US15-TC2-1` read at step 5 and no column carries
- **Settled by the artifacts, not raised** - the seven lines in `## Settled`
- **Partly out of suite** - the request sent anyway in `grade10-admin-inventory-catalog-SC-156` and `grade10-admin-inventory-catalog-SC-160`, for a sold or held unit: decided by the inventory service tests in grade10 (tasks 3.1 and 4.1); a reader's refusal sent outside the page is walked by `grade10-admin-inventory-catalog-US15-TC7-1`. The before and after snapshots of `grade10-admin-inventory-catalog-SC-144` and `grade10-admin-inventory-catalog-SC-145`: decided by the same tests, and seen by a person as the Action text
- **Contradicted** - none
- **Uncovered anchors** - none: `grade10-admin-inventory-catalog-US-04` has one case, `grade10-admin-inventory-catalog-US-69` one, `grade10-admin-inventory-catalog-US-14` five and `grade10-admin-inventory-catalog-US-15` nine; the groups `Auction presentation` and `Cert ID details` are walked by `grade10-admin-inventory-catalog-US15-TC8-1` and `grade10-admin-inventory-catalog-US15-TC6-1`
