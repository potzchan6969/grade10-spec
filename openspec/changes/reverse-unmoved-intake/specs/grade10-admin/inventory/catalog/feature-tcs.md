# grade10-admin/inventory/catalog Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-05, tcs-rules r4

**Out of suite:**

- `grade10-admin-inventory-catalog-SC-193` — the inventory concurrency tests in grade10 (task 4.1): two reductions of regular stock sent at the same moment, which no person can send at one moment; `grade10-admin-inventory-catalog-US16-TC8-1` walks the reduction that follows another one.

## grade10-admin-inventory-catalog-US4: Reconstruct stock changes

**As an** inventory admin,
**I want** every stock and reservation transition recorded,
**so that** I can explain how the latest snapshot was reached.

### grade10-admin-inventory-catalog-US4-TC2-1: History explains a ledger that fell by a reversal

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

* admin(holds Inventory write authority) is on <inventory product url> of `<product_20>`.
* `<product_20>`'s whole history is `<numbered intake>` and `<regular intake>`; nothing has been held, sold, withdrawn or vaulted.

**Test data:**

| Field | Value |
| --- | --- |
| `<numbered intake>` | An intake of 2 units with Cert IDs `<cert_a>` and `<cert_b>` |
| `<cert_a>` | `PSA-20500001` |
| `<cert_b>` | `PSA-20500002` |
| `<regular intake>` | An intake of 6 units with no Cert ID |
| `<reduce count>` | 4 units (any count from 1 to 6) |
| `<stock after>` | 3 units: 2 plus 6, minus `<reduce count>`, minus 1 |

**Steps:**

1. Read stock, reserved, sold, withdrawn, vaulted, available and the ledger.
2. Click View Cert IDs.
3. Reduce the available `No Cert ID` row by `<reduce count>` units with `Reduce quantity`, keeping the remarks.
4. Remove `<cert_a>` with `Remove`, keeping the remarks.
5. Close Cert ID details.
6. Read stock, reserved, sold, withdrawn, vaulted, available and the ledger.
7. Open the product history.

**Expected Results:**

* Step 6: stock, available and the ledger read `<stock after>`.
* Step 6: reserved, sold, withdrawn and vaulted read as in step 1.
* Step 7: an entry reads `Intake reversal · No Cert ID`, quantity `<reduce count>`, Holder `—`, Remarks `Entered by mistake`.
* Step 7: an entry reads `Intake reversal · <cert_a>`, quantity 1, Remarks `Entered by mistake`.
* Step 7: both show the admin as actor; neither reads intake or withdraw.
* Step 7: intake quantities minus the two entries' quantities equal the ledger.
* Step 7: no withdrawal entry was added.

---

## grade10-admin-inventory-catalog-US14: Inventory admin accounts for every unit in Cert ID details

**As an** inventory admin,
**I want** Cert ID details to list the regular stock without a Cert ID beside the Cert records, by state and holder,
**so that** I can see where every unit of the product is without adding up the counts myself.

### grade10-admin-inventory-catalog-US14-TC7-1: Regular stock reduced to none still reads Available 0

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

* admin(holds Inventory write authority) is on <inventory product url> of `<product_23>`.
* `<product_23>`'s regular stock has only been intaken, in one intake of `<regular available>` units with no Cert ID; never held, sold, withdrawn or vaulted.
* `<product_23>` holds `<cert_avail>`, `<cert_gone>` and `<cert_sold>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<regular available>` | 3 units (any count of at least 1) |
| `<cert_avail>` | `PSA-23000001`, available, no hold has ever named it |
| `<cert_gone>` | `PSA-23000003`, available, only intaken |
| `<cert_sold>` | `PSA-23000002`, sold |
| `<stock after>` | 1 unit: `<regular available>` plus 2, minus `<regular available>`, minus 1 |

**Steps:**

1. Click View Cert IDs.
2. Reduce the available `No Cert ID` row by `<regular available>` units with `Reduce quantity`, keeping the remarks.
3. Remove `<cert_gone>` with `Remove`, keeping the remarks.
4. Read the rows and the available `No Cert ID` row's actions.
5. Click the available `No Cert ID` row and read its history.
6. Close Cert ID details.
7. Read the product's stock.
8. Click View Cert IDs.
9. Add up the quantities of the Available and Reserved rows.

**Expected Results:**

* Step 4: the available `No Cert ID` row is still listed, reading 0.
* Step 4: that row offers no `Reduce quantity`.
* Step 4: no row reads `<cert_gone>`; `<cert_avail>` and `<cert_sold>` read as before.
* Step 5: newest first, an `Intake reversal · No Cert ID` of `<regular available>`, then the intake.
* Step 5: no entry reads `Intake reversal · <cert_gone>`.
* Step 7: stock reads `<stock after>`.
* Step 9: the sum equals `<stock after>`.

### grade10-admin-inventory-catalog-US14-TC8-1: A removed Cert record leaves Cert ID details

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

* admin(holds Inventory write authority) is on <inventory product url> of the row's product.
* The row's product holds only what the row names.
* No hold, active or closed, has ever named `<cert_a>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<cert_a>` | `PSA-24000001` |
| `<cert_b>` | `PSA-24000002`, available |

| Row | Product | Rows listed after |
| --- | --- | --- |
| With other units | `<product_24>`: `<cert_a>`, `<cert_b>` and 2 units of regular stock, only intaken | `<cert_b>`, then the available `No Cert ID` row reading 2 |
| Its only unit | `<product_25>`: `<cert_a>` alone, no regular stock | none, and one line saying no unit is on hand |

**Steps:**

1. Click View Cert IDs.
2. Remove `<cert_a>` with `Remove`, keeping the remarks.
3. Read the rows.

**Expected Results:**

* Step 3: no row reads `<cert_a>`.
* Step 3: the rows read as the row's Rows listed after.

### grade10-admin-inventory-catalog-US14-TC9-1: An admin without write authority reads but cannot reverse

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
* **Trace:** grade10-admin-inventory-catalog-US-14

**Pre-conditions:**

* admin(reads Inventory, no Inventory write authority) is on <inventory product url> of `<product_40>`.
* `<product_40>`'s regular stock has only been intaken: `<regular available>` units, never held, sold, withdrawn or vaulted.
* `<product_40>` holds `<cert_a>`; no hold, active or closed, has ever named it, and it was never sold, withdrawn or vaulted.

**Test data:**

| Field | Value |
| --- | --- |
| `<regular available>` | 3 units (any count of at least 1) |
| `<cert_a>` | `PSA-40000001` |

**Steps:**

1. Read stock, available and the ledger.
2. Click View Cert IDs.
3. Read the rows and their actions.
4. Click the available `No Cert ID` row and read its history.
5. Send a reduction of 1 unit of regular stock under this admin's session, outside the page.
6. Send a removal of `<cert_a>` under this admin's session, outside the page.
7. Read Cert ID details, the counts and the product history again.

**Expected Results:**

* Step 3: `<cert_a>` and the available `No Cert ID` row are listed.
* Step 3: neither `Reduce quantity` nor `Remove` is offered.
* Step 4: the history shows.
* Step 5: the request is refused.
* Step 6: the request is refused.
* Step 7: everything reads as in steps 1 and 3; no entry was added.

---

## grade10-admin-inventory-catalog-US13: Operator removes an available copy and its source media

**As an** Inventory operator,
**I want** to remove an available physical unit and its Cert record together,
**so that** the unit is withdrawn and its Cert-scoped source media cannot be reused.

### grade10-admin-inventory-catalog-US13-TC1-3: Physical removal of a moved unit withdraws it and deletes its tagged media

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-inventory-catalog-US-13

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<inventory product>`.
* `<cert record>` belongs to `<inventory product>` and reads available with no active hold.
* `<released hold>` once held `<cert record>` and is released.
* `<tagged media>` is tagged to `<cert record>`; `<shared media>` is untagged; `<other media>` is tagged to another Cert record.

**Test data:**

| Field | Value |
| --- | --- |
| `<cert record>` | `PSA-21000001`, a Cert record of `<inventory product>` |
| `<released hold>` | An admin hold of `<cert record>`, released |
| `<withdrawal reason>` | `Card damaged in storage` (any non-empty text) |

**Steps:**

1. Read stock, withdrawn and the ledger.
2. Click View Cert IDs.
3. Select `<cert record>` and read its actions.
4. Click `Remove physical unit`.
5. Enter `<withdrawal reason>`.
6. Confirm the removal.
7. Close Cert ID details.
8. Read stock, withdrawn and the ledger.
9. Open the product history.
10. Open the product's media.

**Expected Results:**

* Step 3: `Remove physical unit` is offered; `Remove` is not.
* Step 6: `<cert record>` is no longer listed.
* Step 8: stock falls by one; withdrawn rises by one.
* Step 8: the ledger reads as in step 1.
* Step 9: a withdrawal entry records `<withdrawal reason>`.
* Step 10: `<tagged media>` is deleted.
* Step 10: `<shared media>` and `<other media>` remain with their tags.

### grade10-admin-inventory-catalog-US13-TC4-1: A Cert record that has only been intaken offers no physical removal

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
* **Trace:** grade10-admin-inventory-catalog-US-13

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_22>`.
* `<product_22>` holds the row's Cert record; no hold, active or closed, has ever named it, and it was never sold, withdrawn or vaulted.

**Test data:**

| Row | Cert record |
| --- | --- |
| Intaken | `PSA-22000001`, intaken from the product page |
| Assigned | `PSA-22000002`, given by Assign Cert ID to a unit of regular stock |
| Corrected | `PSA-22000004`, intaken as `PSA-22000003` and corrected |

**Steps:**

1. Click View Cert IDs.
2. Select the row's Cert record.
3. Read its actions.

**Expected Results:**

* Step 3: `Remove physical unit` is not offered.
* Step 3: `Remove` is offered.

---

## grade10-admin-inventory-catalog-US16: Inventory admin takes out units intaken by mistake

**As an** inventory admin,
**I want** to take out regular stock or a Cert record that was intaken by mistake and has never moved, from Cert ID details,
**so that** the stock and the ledger count only the units the shop received.

### grade10-admin-inventory-catalog-US16-TC1-1: Reducing regular stock that never moved takes units out of stock and the ledger

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_26>`.
* `<product_26>`'s regular stock has only been intaken, `<regular intake>`, and assigned as the row says; never held, sold, withdrawn or vaulted.

**Test data:**

| Field | Value |
| --- | --- |
| `<regular intake>` | An intake of 5 units with no Cert ID |
| `<assigned cert>` | `PSA-26000001`, given by Assign Cert ID |
| `<reduce time>` | The date and time step 9 is confirmed |

| Row | Assigned since intake | Available before | Reduce by | Remarks entered | Remarks read | Available after |
| --- | --- | --- | --- | --- | --- | --- |
| One unit | none | 5 | 1 | kept | `Entered by mistake` | 4 |
| Every unit | none | 5 | 5 | kept | `Entered by mistake` | 0 |
| After an assignment | one unit, `<assigned cert>` | 4 | 2 | `Counted twice at intake` | `Counted twice at intake` | 2 |

**Steps:**

1. Read stock, reserved, sold, withdrawn, vaulted, available and the ledger.
2. Click View Cert IDs.
3. Hover over `Reduce quantity` on the available `No Cert ID` row and read its tooltip.
4. Click `Reduce quantity`.
5. Read the confirmation.
6. Enter the row's Reduce by.
7. Read the confirmation.
8. Enter the row's Remarks entered.
9. Confirm.
10. Read the available `No Cert ID` row.
11. Click the available `No Cert ID` row and read its history.
12. Close Cert ID details.
13. Read stock, reserved, sold, withdrawn, vaulted, available and the ledger.
14. Open the product history.

**Expected Results:**

* Step 3: it says the action takes out units intaken by mistake as if they were never received, and that withdrawn does not move.
* Step 5: the number of units is empty and Confirm is unavailable.
* Step 5: it says at most the row's Available before units can be reduced.
* Step 5: Remarks read `Entered by mistake`.
* Step 7: it names the row's Reduce by in `No Cert ID` units.
* Step 7: it says stock and the ledger fall by that number.
* Step 10: it reads the row's Available after.
* Step 10: where the row assigned one, `<assigned cert>` is still listed Available.
* Step 11: one new entry, quantity the row's Reduce by, the row's Remarks read.
* Step 13: stock, available and the ledger each fall by the row's Reduce by.
* Step 13: reserved, sold, withdrawn and vaulted read as in step 1.
* Step 14: the same entry reads `Intake reversal · No Cert ID`, `<reduce time>`, the admin as actor.

### grade10-admin-inventory-catalog-US16-TC2-1: Removing an unmoved Cert record deletes it and its tagged media

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_27>`.
* `<product_27>` holds `<cert_a>`, reached as the row says; no hold, active or closed, has ever named it, and it was never sold, withdrawn or vaulted.
* `<product_27>` holds 3 units of available regular stock outside every hold.
* `<tagged media>` is tagged to `<cert_a>`; `<shared media>` is untagged; `<other media>` is tagged to `<cert_b>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<cert_a>` | `PSA-27000001` |
| `<cert_b>` | `PSA-27000002`, an available Cert record of `<product_27>` |
| `<remove time>` | The date and time step 7 is confirmed |

| Row | How `<cert_a>` came to be | Remarks entered | Remarks read |
| --- | --- | --- | --- |
| Intaken | Intaken from the product page | kept | `Entered by mistake` |
| Imported | Entered by the inventory workbook import, with grade and serial | kept | `Entered by mistake` |
| Assigned | Given by Assign Cert ID to a unit of regular stock | `Card left before it was listed` | `Card left before it was listed` |
| Corrected | Intaken as `PSA-27000009`, then corrected to `<cert_a>` | kept | `Entered by mistake` |

**Steps:**

1. Read stock, reserved, sold, withdrawn, vaulted, available and the ledger.
2. Click View Cert IDs.
3. Hover over `Remove` on `<cert_a>`'s row and read its tooltip.
4. Click `Remove`.
5. Read the confirmation.
6. Enter the row's Remarks entered.
7. Confirm.
8. Read the rows.
9. Close Cert ID details.
10. Read stock, reserved, sold, withdrawn, vaulted, available and the ledger.
11. Open the product history.
12. Open the product's media.

**Expected Results:**

* Step 3: it says the action takes out a unit intaken by mistake as if it was never received, and that withdrawn does not move.
* Step 5: it names `<cert_a>`, says stock and the ledger fall by one, and says its tagged media are deleted.
* Step 5: Remarks read `Entered by mistake`.
* Step 8: no row reads `<cert_a>`; `<cert_b>` and the available `No Cert ID` row (3) read as before.
* Step 10: stock, available and the ledger each fall by one.
* Step 10: reserved, sold, withdrawn and vaulted read as in step 1.
* Step 11: one new entry reads `Intake reversal · <cert_a>`, quantity one, `<remove time>`, the admin as actor, the row's Remarks read.
* Step 11: its action is neither intake nor withdraw.
* Step 12: `<tagged media>` is deleted; `<shared media>` and `<other media>` remain with their tags.

### grade10-admin-inventory-catalog-US16-TC3-1: Cancelling the confirmation changes nothing

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
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_28>`.
* `<product_28>`'s regular stock has only been intaken: `<regular available>` units, never held, sold, withdrawn or vaulted.
* `<product_28>` holds `<cert_a>`; no hold, active or closed, has ever named it, and it was never sold, withdrawn or vaulted.
* `<tagged media>` is tagged to `<cert_a>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<regular available>` | 4 units (any count of at least 2) |
| `<cert_a>` | `PSA-28000001` |

| Row | Action opened | Entered before cancelling |
| --- | --- | --- |
| Reduction | `Reduce quantity` on the available `No Cert ID` row | Reduce by 2, remarks `Typed then cancelled` |
| Removal | `Remove` on `<cert_a>`'s row | Remarks `Typed then cancelled` |

**Steps:**

1. Read stock, available and the ledger.
2. Click View Cert IDs.
3. Open the row's action.
4. Enter the row's values.
5. Cancel the confirmation.
6. Read the rows.
7. Close Cert ID details.
8. Read stock, available and the ledger.
9. Open the product history.
10. Open the product's media.

**Expected Results:**

* Step 6: `<cert_a>` is listed; the available `No Cert ID` row reads `<regular available>`.
* Step 8: every figure reads as in step 1.
* Step 9: no entry was added.
* Step 10: `<tagged media>` is still tagged to `<cert_a>`.

### grade10-admin-inventory-catalog-US16-TC4-1: Emptied remarks cannot be confirmed

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_29>`.
* `<product_29>`'s regular stock has only been intaken: `<regular available>` units, never held, sold, withdrawn or vaulted.
* `<product_29>` holds `<cert_a>`; no hold, active or closed, has ever named it, and it was never sold, withdrawn or vaulted.

**Test data:**

| Field | Value |
| --- | --- |
| `<regular available>` | 3 units (any count of at least 1) |
| `<cert_a>` | `PSA-29000001` |

| Row | Action opened | Reduce by | Remarks left |
| --- | --- | --- | --- |
| Reduction, cleared | `Reduce quantity` on the available `No Cert ID` row | 1 | nothing |
| Reduction, spaces | `Reduce quantity` on the available `No Cert ID` row | 1 | three spaces |
| Removal, cleared | `Remove` on `<cert_a>`'s row | — | nothing |
| Removal, spaces | `Remove` on `<cert_a>`'s row | — | three spaces |

**Steps:**

1. Click View Cert IDs.
2. Open the row's action.
3. Enter the row's Reduce by, where it has one.
4. Replace the remarks with the row's Remarks left.
5. Try to confirm.
6. Read the rows and the product history.

**Expected Results:**

* Step 5: Confirm is unavailable; nothing is reversed.
* Step 6: `<cert_a>` is listed; the available `No Cert ID` row reads `<regular available>`.
* Step 6: no entry was added.

### grade10-admin-inventory-catalog-US16-TC5-1: A reduction outside one to the reducible count cannot be confirmed

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
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_30>`.
* `<product_30>`'s regular stock has only been intaken: `<regular available>` units, never held, sold, withdrawn or vaulted.

**Test data:**

| Field | Value |
| --- | --- |
| `<regular available>` | 5 units |

| Row | Reduce by entered |
| --- | --- |
| Zero | 0 |
| One above available | 6 |
| Negative | -1 |
| Not whole | 1.5 |
| Empty | nothing |

**Steps:**

1. Read stock, available and the ledger.
2. Click View Cert IDs.
3. Click `Reduce quantity` on the available `No Cert ID` row.
4. Enter the row's Reduce by.
5. Try to confirm.
6. Read the available `No Cert ID` row.
7. Close Cert ID details.
8. Read stock, available and the ledger, and the product history.

**Expected Results:**

* Step 5: Confirm is unavailable; nothing is reduced.
* Step 6: it reads `<regular available>`.
* Step 8: every figure reads as in step 1; no entry was added.

### grade10-admin-inventory-catalog-US16-TC6-1: Cert records that have ever moved offer no removal

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
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of the row's product.
* `<product_31>` holds the row's Cert record.

**Test data:**

| Row | Product | Unit and its move | Row read |
| --- | --- | --- | --- |
| Cert record, Auction hold | `<product_31>` | `PSA-31000001`, held by an Auction listing's active hold | its row |
| Cert record, admin hold | `<product_31>` | `PSA-31000002`, held by an active admin hold | its row |
| Cert record, released | `<product_31>` | `PSA-31000003`, held by an Auction listing that closed Unsold, released, reading Available | its row |
| Cert record, sold | `<product_31>` | `PSA-31000004`, sold | its row |
| Cert record, withdrawn | `<product_31>` | `PSA-31000005`, withdrawn | its row |
| Cert record, vaulted | `<product_31>` | `PSA-31000006`, vaulted | its row |
| Cert record, hold moved | `<product_31>` | `PSA-31000007`, held by an Auction listing whose hold moved to another product, reading Available | its row |

**Steps:**

1. Click View Cert IDs.
2. Find the row's Row read.
3. Read its actions.

**Expected Results:**

* Step 3: `Remove` is not offered.
* Step 3: a Cert record reading Available offers `Remove physical unit` and no Cert ID change.

### grade10-admin-inventory-catalog-US16-TC7-1: Regular stock and each Cert record are judged apart

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of the row's product.
* The row's product holds only what the row names.

**Test data:**

| Row | Product | Moved | Never moved | Offered |
| --- | --- | --- | --- | --- |
| Cert record moved | `<product_37>` | `PSA-37000001`, sold | 3 units of regular stock, only intaken; `PSA-37000002`, only intaken | `Reduce quantity` on the available `No Cert ID` row, at most 3; `Remove` on `PSA-37000002` |
| Assigned record moved | `<product_44>` | `PSA-44000001`, given by Assign Cert ID to a unit of regular stock, then held by an active admin hold | the other 2 of 3 units of regular stock, only intaken | `Reduce quantity` on the available `No Cert ID` row, at most 2 |
| Regular stock moved | `<product_38>` | 3 units of regular stock, 1 sold, nothing intaken since | `PSA-38000001`, only intaken | `Remove` on `PSA-38000001` |

**Steps:**

1. Click View Cert IDs.
2. Read each row's actions.
3. Where `Reduce quantity` is offered, click it and read the confirmation; cancel it.

**Expected Results:**

* Step 2: the row's Offered actions are offered.
* Step 2: neither `Reduce quantity` nor `Remove` is offered on what the row's Moved names.
* Step 3: it says at most the number the row's Offered gives can be reduced.

### grade10-admin-inventory-catalog-US16-TC8-1: A move landing after the confirmation opens is refused at confirm

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
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* admin A(holds Inventory write authority) is on <inventory product url> of `<product_39>`.
* admin B(holds Inventory write authority) acts on `<product_39>` in a separate session.
* `<product_39>`'s regular stock has only been intaken: `<regular available>` units, never held, sold, withdrawn or vaulted.
* `<product_39>` holds `<cert_a>`; no hold, active or closed, has ever named it, and it was never sold, withdrawn or vaulted.
* `<tagged media>` is tagged to `<cert_a>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<regular available>` | 3 units |
| `<cert_a>` | `PSA-39000001` |

| Row | Admin A opens and enters | Admin B, before admin A confirms |
| --- | --- | --- |
| Cert record held | `Remove` on `<cert_a>`'s row | Reserves `<cert_a>` under an admin hold |
| Cert record removed | `Remove` on `<cert_a>`'s row | Removes `<cert_a>` with `Remove` from Cert ID details |
| Regular stock held | `Reduce quantity` on the available `No Cert ID` row, Reduce by 1 | Reserves 1 unit, `No Cert ID`, under an admin hold |
| Count fell below | `Reduce quantity` on the available `No Cert ID` row, Reduce by 3 | Reduces the available `No Cert ID` row by 1 |

**Steps:**

1. As admin A, click View Cert IDs.
2. As admin A, open and fill the row's action.
3. As admin B, take the row's step.
4. As admin A, confirm.
5. Read Cert ID details, the counts and the product history.

**Expected Results:**

* Step 4: admin A's reversal is refused.
* Step 5: only admin B's step shows in the rows, the counts and the history.
* Step 5: no entry from admin A was added.
* Step 5: where admin B held `<cert_a>`, `<tagged media>` is still tagged to it.

### grade10-admin-inventory-catalog-US16-TC9-1: A removed Cert record's Cert ID can be intaken again

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
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_41>`.
* `<product_41>` holds `<cert_a>`; no hold, active or closed, has ever named it, and it was never sold, withdrawn or vaulted.

**Test data:**

| Field | Value |
| --- | --- |
| `<cert_a>` | `PSA-41000001` |

**Steps:**

1. Click View Cert IDs.
2. Remove `<cert_a>` with `Remove`, keeping the remarks.
3. Close Cert ID details.
4. Intake quantity one with Cert ID `<cert_a>`.
5. Click View Cert IDs.
6. Click `<cert_a>`'s row and read its history.

**Expected Results:**

* Step 4: the intake is saved.
* Step 5: one row reads `<cert_a>`, Available.
* Step 6: the history starts at the new intake.

### grade10-admin-inventory-catalog-US16-TC10-1: Regular stock intaken since its last move can be reduced, earlier units cannot

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
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of the row's product.
* The row's product holds no Cert record but one the row's After names; its regular stock was intaken as 4 units, then took the row's Move, then `<later intake>`, then the row's After.

**Test data:**

| Field | Value |
| --- | --- |
| `<later intake>` | An intake of 2 units with no Cert ID |

| Row | Product | Move | After | Available | At most |
| --- | --- | --- | --- | --- | --- |
| Held | `<product_32>` | an admin hold of 1, active | nothing | 5 | 2 |
| Released | `<product_33>` | an admin hold of 1, released | nothing | 6 | 2 |
| Sold | `<product_34>` | 1 sold from available stock | nothing | 5 | 2 |
| Withdrawn | `<product_35>` | 1 withdrawn from available stock | nothing | 5 | 2 |
| Vaulted | `<product_36>` | 1 vaulted from a Vault hold | nothing | 5 | 2 |
| Hold moved | `<product_42>` | an Auction hold of 1 moved to another product | nothing | 5 | 2 |
| Assigned since | `<product_43>` | 1 sold from available stock | 1 unit given `PSA-43000001` by Assign Cert ID | 4 | 1 |
| Moved since | `<product_45>` | nothing | an admin hold of 1, active | 5 | 0 |

**Steps:**

1. Click View Cert IDs.
2. Read the available `No Cert ID` row and its actions.
3. Where `Reduce quantity` is offered, click it and read the confirmation.
4. Enter the row's At most plus 1.
5. Try to confirm.
6. Enter the row's At most, keep the remarks, and confirm.
7. Read the available `No Cert ID` row and its actions.

**Expected Results:**

* Step 2: it reads the row's Available.
* Step 2: where At most is 0, `Reduce quantity` is not offered, and the row says its units were intaken before regular stock last moved; steps 3 to 7 do not apply.
* Step 2: elsewhere, `Reduce quantity` is offered.
* Step 3: it says at most the row's At most units can be reduced.
* Step 5: Confirm is unavailable; nothing is reduced.
* Step 7: it reads the row's Available minus its At most.
* Step 7: `Reduce quantity` is not offered, and the row says its units were intaken before regular stock last moved.

## Settled

- **Regular stock at 0** — the available `No Cert ID` row reading 0 is still listed and offers no `Reduce quantity`: a reduction takes a whole number from 1 to the reducible count, and there is none (Q8)
- **No other ceiling** — a reduction takes any whole number from 1 to the reducible count in one entry, however large (Q8)
- **Regular stock after a move** — the units intaken since regular stock last moved can be reduced, less those given a Cert ID or reduced since, never more than available; units intaken before it cannot. Regular stock that never moved counts from its first intake. Every step of a hold naming no Cert record is a move, its release included, and so is a sale or withdrawal of available regular stock (Q2, Q12)
- **The action names** — `Reduce quantity` on the available `No Cert ID` row and `Remove` on a Cert record that has only been intaken, each with a tooltip saying it takes out units intaken by mistake as if never received and that withdrawn does not move; `Remove physical unit` stays only on a record that has moved (Q14)
- **The number of units** — opens empty; Confirm stays unavailable until a whole number from 1 to the reducible count is entered, and the confirmation states that count (Q15)
- **Remarks of spaces only** — read as empty, since every remarks field is trimmed; Confirm stays unavailable (Q4)
- **A removed Cert record in the regular stock history** — not shown, a record numbered from regular stock included; a Cert record's removal shows in the product's history (Q7)
- **The media line** — every Cert record's confirmation says its tagged media are deleted, whether or not any are tagged to it (Q11)
- **Which Cert records reverse** — the records whose Cert ID can be corrected: available, and never named by a hold, active or closed, a hold since moved to another product included, nor sold, withdrawn or vaulted (Q5)
- **One removal per Cert record** — Remove physical unit is offered only on an Available record that has moved and no active hold names; a record that has only been intaken offers the reversal instead (Q3)
- **A Cert record's moves and regular stock** — a sold or held Cert record leaves regular stock reducible, one given its Cert ID from regular stock included, and moved regular stock leaves an unmoved Cert record removable (Q2, Q5, Q13)
- **What falls** — stock, available and the ledger fall by the units taken out; reserved, sold, withdrawn and vaulted stay the same (Q1)
- **A removed Cert ID** — free on the product, so a later intake takes it as a new record whose history starts at that intake (Q6)

## Reconciliation

**Run:** QA2, 2026-10-05, in a fresh context. QA1's blind pass read the Feature set, `user-journeys.md`, `proposal.md`, `decisions.md` with its `## Raised` table empty, the Products and Stock page, the store context and the durable suite with its `## Settled` and without its `## Reconciliation`; it was denied every `## Requirements` section, `openspec/specs/` beyond those, `openspec/changes/archive/`, `tech-design.md` and `tasks.md`. Inventory has no domain suite. QA2 read both readings, QA1's raised questions, `decisions.md`, `tech-design.md`, `tasks.md`, the delta and durable specs, the durable suite and the Products and Stock page. It is a statement, not proof. No case of this change has been accepted or published, so every rewritten draft keeps its `<v>`.

- **Agreed** - `grade10-admin-inventory-catalog-US14-TC8-1` with `grade10-admin-inventory-catalog-SC-182` and the durable row table's line for a product with nothing on hand; `grade10-admin-inventory-catalog-US16-TC2-1` with `grade10-admin-inventory-catalog-SC-182`, `grade10-admin-inventory-catalog-SC-184` (its Assigned row), `grade10-admin-inventory-catalog-SC-187`, `grade10-admin-inventory-catalog-SC-173` and `grade10-admin-inventory-catalog-SC-174`, its Imported and Corrected rows with the unmoved rule of the removal requirement; `grade10-admin-inventory-catalog-US16-TC3-1` with `grade10-admin-inventory-catalog-SC-187` and the confirmation requirement's cancel on either row; `grade10-admin-inventory-catalog-US16-TC7-1` with `grade10-admin-inventory-catalog-SC-180` and the reduction requirement's "nothing done to a Cert record moves it"; `grade10-admin-inventory-catalog-US16-TC8-1` with `grade10-admin-inventory-catalog-SC-191`, `grade10-admin-inventory-catalog-SC-192` and the lands-whole requirement, its Cert record removed row with the refusal of a record that does not exist and its Count fell below row with the refusal above available regular stock
- **Rewritten, by QA2** - `grade10-admin-inventory-catalog-US4-TC2-1` for `grade10-admin-inventory-catalog-SC-172`, `grade10-admin-inventory-catalog-SC-173` and `grade10-admin-inventory-catalog-SC-174`: step 7 reads the Action `Intake reversal · No Cert ID` and `Intake reversal · <cert_a>`, Holder `—` and the remarks, where it read one shared action; `grade10-admin-inventory-catalog-US14-TC7-1` for `grade10-admin-inventory-catalog-SC-178` and `grade10-admin-inventory-catalog-SC-176`: its stock read 2 where its data gives 1, a misreading of the arithmetic; it now also reverses an unmoved Cert record, reads the `No Cert ID` history without that removal, and reads no reversal offered at 0 (Q8); `grade10-admin-inventory-catalog-US13-TC1-3` for `grade10-admin-inventory-catalog-SC-134` and the moved half of `grade10-admin-inventory-catalog-SC-175`: reached through Cert ID details, where the record's actions live, and reads no reversal beside Remove physical unit; it replaces the durable `grade10-admin-inventory-catalog-US13-TC1-2`, whose record had never moved; `grade10-admin-inventory-catalog-US13-TC4-1` for the unmoved half of `grade10-admin-inventory-catalog-SC-175`, `grade10-admin-inventory-catalog-SC-135` and `grade10-admin-inventory-catalog-SC-184`: reads both actions in Cert ID details, where it read the product page first; `grade10-admin-inventory-catalog-US16-TC1-1` for `grade10-admin-inventory-catalog-SC-177`, `grade10-admin-inventory-catalog-SC-178`, `grade10-admin-inventory-catalog-SC-188`, `grade10-admin-inventory-catalog-SC-176` and `grade10-admin-inventory-catalog-SC-174`: its After an assignment row edits the remarks, and reads the assigned record still Available; `grade10-admin-inventory-catalog-US16-TC4-1` for `grade10-admin-inventory-catalog-SC-189`: rows of three spaces beside the cleared ones, and Confirm unavailable, where it read the reversal not made; `grade10-admin-inventory-catalog-US16-TC5-1` for `grade10-admin-inventory-catalog-SC-181`: Confirm unavailable, where it read the reduction refused; `grade10-admin-inventory-catalog-US16-TC6-1` for `grade10-admin-inventory-catalog-SC-179`, `grade10-admin-inventory-catalog-SC-185` and `grade10-admin-inventory-catalog-SC-186`: a row each for a Cert record and for regular stock whose hold moved to another product, the line on a moved `No Cert ID` row, and Remove physical unit with no Cert ID change on a moved Available record; across the suite, the reduce action and the remove action are read as the one reverse action the requirements give both rows
- **Moved, by QA2** - QA1's `grade10-admin-inventory-catalog-US16-TC9-1` is `grade10-admin-inventory-catalog-US14-TC9-1`, for `grade10-admin-inventory-catalog-SC-190`, which serves `grade10-admin-inventory-catalog-US-14`: a reader accounts for units and takes none out; QA1's `grade10-admin-inventory-catalog-US16-TC10-1` takes the freed number, `grade10-admin-inventory-catalog-US16-TC9-1`, for `grade10-admin-inventory-catalog-SC-183`, its result sharpened to a history that starts at the new intake. Neither id was ever published
- **Added, by QA2** - none; Dev added `grade10-admin-inventory-catalog-US16-TC10-1` after the answers, as above
- **Raised, folded into spec** - none: every case reads behaviour a scenario or a requirement states
- **Raised, rejected** - none: no case tests a non-goal or misreads the input beyond the arithmetic rewritten above
- **Raised, escalated** - four rows in `decisions.md`'s `## Raised`, all landed by the author: regular stock judged as a whole after a later intake, merging QA1's first question and Dev's (Q12); whether an assigned record's later move moves regular stock, QA1's second (Q13); the action's label on both rows, Dev's (Q14); and the reduction's starting quantity, Dev's (Q15). Each is in `## Settled`
- **Amended after the answers, by Dev** - `grade10-admin-inventory-catalog-US16-TC6-1` keeps its Cert record rows; its regular stock rows move to the new `grade10-admin-inventory-catalog-US16-TC10-1`, which intakes after each move and reads the units intaken since reducible and the earlier ones not, for `grade10-admin-inventory-catalog-SC-179`, `grade10-admin-inventory-catalog-SC-181`, `grade10-admin-inventory-catalog-SC-194`, `grade10-admin-inventory-catalog-SC-195` and `grade10-admin-inventory-catalog-SC-196`; `grade10-admin-inventory-catalog-US16-TC7-1` gains an Assigned record moved row and reads the most units the confirmation states, for `grade10-admin-inventory-catalog-SC-180` (Q13); `grade10-admin-inventory-catalog-US16-TC1-1` reads the tooltip, the empty number, the unavailable Confirm and the stated limit on opening, for `grade10-admin-inventory-catalog-SC-188` and `grade10-admin-inventory-catalog-SC-197`; `grade10-admin-inventory-catalog-US16-TC2-1` reads the `Remove` tooltip, for `grade10-admin-inventory-catalog-SC-197`; across the suite the actions are read by their labels, `Reduce quantity`, `Remove` and `Remove physical unit`, where the suite read one reverse action (Q14)
- **Settled by the artifacts, not raised** - QA1's questions on the action at 0 (Q8), remarks of spaces (Q4, every remarks field trimmed), an assigned record's removal in the `No Cert ID` history (Q7) and the media line on a record with none (Q11); Dev's question on a 500 ceiling (Q8); each is in `## Settled`
- **Partly out of suite** - the request sent anyway in `grade10-admin-inventory-catalog-SC-135`, `grade10-admin-inventory-catalog-SC-175`, `grade10-admin-inventory-catalog-SC-179`, `grade10-admin-inventory-catalog-SC-181`, `grade10-admin-inventory-catalog-SC-185`, `grade10-admin-inventory-catalog-SC-186` and `grade10-admin-inventory-catalog-SC-189`, and in `grade10-admin-inventory-catalog-SC-194` and `grade10-admin-inventory-catalog-SC-195`, for a moved unit, a quantity out of range and blank remarks: decided by the inventory service and router tests in grade10 (tasks 3.1, 4.1 and 5.1); a reader's request sent outside the page is walked by `grade10-admin-inventory-catalog-US14-TC9-1`. The before and after snapshots, changed entity and empty reservation of `grade10-admin-inventory-catalog-SC-172` and `grade10-admin-inventory-catalog-SC-173`: decided by the same tests; a person reads the Action, quantity and remarks. The counts after the reduction in `grade10-admin-inventory-catalog-SC-180`: decided by task 4.1; `grade10-admin-inventory-catalog-US16-TC7-1` walks the offer, and `grade10-admin-inventory-catalog-US16-TC1-1` the counts of a reduction
- **Out of suite** - `grade10-admin-inventory-catalog-SC-193`, as listed under the title
- **Contradicted** - none
- **Uncovered anchors** - none: `grade10-admin-inventory-catalog-US-04` has one case, `grade10-admin-inventory-catalog-US-14` three, `grade10-admin-inventory-catalog-US-13` two and `grade10-admin-inventory-catalog-US-16` ten; every scenario from `grade10-admin-inventory-catalog-SC-172` to `grade10-admin-inventory-catalog-SC-197`, and amended `grade10-admin-inventory-catalog-SC-134` and `grade10-admin-inventory-catalog-SC-135`, is reached by a case or listed out of suite; the durable `grade10-admin-inventory-catalog-US13-TC2-1` and `grade10-admin-inventory-catalog-US13-TC3-1` stand for the rest of `grade10-admin-inventory-catalog-SC-135`, whose reserved and not-available records have moved; the group `Cert ID details` is walked by every `grade10-admin-inventory-catalog-US-16` case
