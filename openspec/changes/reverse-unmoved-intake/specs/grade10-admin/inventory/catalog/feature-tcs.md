# grade10-admin/inventory/catalog Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-05, tcs-rules r4

**Out of suite:**

- `grade10-admin-inventory-catalog-SC-193` — the inventory concurrency tests in grade10 (task 4.1): two reductions of regular stock sent at the same moment, which no person can send at one moment; `grade10-admin-inventory-catalog-US16-TC14-1` walks the reduction that lands after another one.

## grade10-admin-inventory-catalog-US4: Reconstruct stock changes

**As an** inventory admin,
**I want** every stock and reservation transition recorded,
**so that** I can explain how the latest snapshot was reached.

<!-- trace:case id=g10adm.inventory-catalog.TC-wx1 rev=1 covers=g10adm.inventory-catalog.SC-68f,g10adm.inventory-catalog.SC-s46,g10adm.inventory-catalog.SC-mci -->
### grade10-admin-inventory-catalog-US4-TC2-1: Reversals lower the ledger and keep every earlier entry

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
* `<product_20>`'s regular stock was intaken by `<regular intake>` and has never moved.
* `<product_20>` holds `<cert_a>`, intaken by `<cert intake>`, and never held, sold, withdrawn or vaulted.

**Test data:**

| Field | Value |
| --- | --- |
| `<regular intake>` | An intake of 6 units with no Cert ID |
| `<cert_a>` | `PSA-20000001` |
| `<cert intake>` | An intake of one unit with Cert ID `<cert_a>` |
| `<reduce by>` | 2 units (any whole number from 1 to 6) |
| `<fall>` | 3 units: `<reduce by>` plus the one Cert record |

**Steps:**

1. Read stock, reserved, sold, withdrawn, vaulted, available and the ledger.
2. Click View Cert IDs.
3. Click `Reduce quantity` on the available `No Cert ID` row.
4. Enter `<reduce by>` as the number of units.
5. Click Confirm.
6. Click `Remove` on `<cert_a>`'s row.
7. Click Confirm.
8. Close Cert ID details.
9. Read stock, reserved, sold, withdrawn, vaulted, available and the ledger.
10. Open the product history.

**Expected Results:**

* Step 9: stock, available and the ledger each read `<fall>` lower than in step 1.
* Step 9: reserved, sold, withdrawn and vaulted read as in step 1.
* Step 10: one new `Intake reversal · No Cert ID` entry, quantity `<reduce by>`.
* Step 10: one new `Intake reversal · <cert_a>` entry, quantity one.
* Step 10: the entries for `<regular intake>` and `<cert intake>` still show.
* Step 10: no intake or withdrawal entry was added.

<!-- trace:case id=g10adm.inventory-catalog.TC-3o0 rev=1 covers=g10adm.inventory-catalog.SC-68f,g10adm.inventory-catalog.SC-s46,g10adm.inventory-catalog.SC-mci -->
### grade10-admin-inventory-catalog-US4-TC3-1: Each reversal shows in the history of the unit it took out

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
* **Trace:** grade10-admin-inventory-catalog-US-04

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_21>`.
* `<product_21>`'s regular stock was intaken by `<first intake>`, then `<admin hold>` reserved 2 units, then `<second intake>` arrived.
* `<product_21>` holds `<cert_a>`, intaken after `<admin hold>` and never moved.
* One unit of `<second intake>` was given `<cert_g>` by Assign Cert ID, and `<cert_g>` has not moved since.

**Test data:**

| Field | Value |
| --- | --- |
| `<first intake>` | An intake of 4 units with no Cert ID |
| `<admin hold>` | An admin hold of 2 units of regular stock, active |
| `<second intake>` | An intake of 4 units with no Cert ID |
| `<cert_a>` | `PSA-21000001`, intaken with its Cert ID |
| `<cert_g>` | `PSA-21000002`, given by Assign Cert ID |
| `<reduce by>` | 1 unit (any whole number from 1 to the 3 units intaken since `<admin hold>` and not numbered) |
| `<reversal time>` | The date and time step 3 is confirmed |

| Row | Action taken | Entry Action | Quantity | In the `No Cert ID` history |
| --- | --- | --- | --- | --- |
| Reduction | `Reduce quantity` on the available `No Cert ID` row, `<reduce by>` units | `Intake reversal · No Cert ID` | `<reduce by>` | yes |
| Intaken Cert record | `Remove` on `<cert_a>`'s row | `Intake reversal · <cert_a>` | 1 | no |
| Numbered Cert record | `Remove` on `<cert_g>`'s row | `Intake reversal · <cert_g>` | 1 | no |

**Steps:**

1. Click View Cert IDs.
2. Take the row's Action taken, keeping the prefilled remarks.
3. Click Confirm.
4. Close Cert ID details.
5. Open the product history.
6. Read the newest entry.
7. Click View Cert IDs.
8. Click the available `No Cert ID` row.
9. Read its history.
10. Click the `No Cert ID` row for `<admin hold>`.
11. Read its history.

**Expected Results:**

* Step 6: Action reads the row's Entry Action; quantity reads the row's Quantity.
* Step 6: When reads `<reversal time>`; the admin is the actor; Remarks read `Entered by mistake`.
* Step 9: the entry shows where the row's In the `No Cert ID` history says yes, and not where it says no.
* Step 9: on the Numbered Cert record row, the `Cert ID change` from `No Cert ID` to `<cert_g>` still shows.
* Step 11: reads the same entries as step 9.

---

## grade10-admin-inventory-catalog-US14: Inventory admin accounts for every unit in Cert ID details

**As an** inventory admin,
**I want** Cert ID details to list the regular stock without a Cert ID beside the Cert records, by state and holder,
**so that** I can see where every unit of the product is without adding up the counts myself.

<!-- trace:case id=g10adm.inventory-catalog.TC-56a rev=1 covers=g10adm.inventory-catalog.SC-oth -->
### grade10-admin-inventory-catalog-US14-TC7-1: A reduction lowers the available row and the rows still add up to stock

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
* **Trace:** grade10-admin-inventory-catalog-US-14

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_24>`.
* `<product_24>`'s regular stock was intaken by `<first intake>`, then `<admin hold>` reserved all of it, then `<second intake>` arrived.
* `<product_24>` holds `<cert_a>`, available.

**Test data:**

| Field | Value |
| --- | --- |
| `<first intake>` | An intake of 2 units with no Cert ID |
| `<admin hold>` | An admin hold of 2 units of regular stock, active |
| `<second intake>` | An intake of 5 units with no Cert ID |
| `<cert_a>` | `PSA-24000001` |

| Row | Units reduced | Available row after |
| --- | --- | --- |
| Part | 2 | 3: 5 minus 2 |
| All | 5 | 0 |

**Steps:**

1. Read the product's stock.
2. Click View Cert IDs.
3. Click `Reduce quantity` on the available `No Cert ID` row.
4. Enter the row's Units reduced.
5. Click Confirm.
6. Read the rows.
7. Click the available `No Cert ID` row.
8. Read its history.
9. Close Cert ID details.
10. Read the product's stock.
11. Click View Cert IDs.
12. Add up the quantities of the Available and Reserved rows.

**Expected Results:**

* Step 6: the available `No Cert ID` row is still listed and reads the row's Available row after.
* Step 6: the row for `<admin hold>` still reads 2; `<cert_a>` still reads Available.
* Step 8: the newest entry reads `Intake reversal · No Cert ID`, quantity the row's Units reduced.
* Step 8: the entries for `<first intake>` and `<second intake>` still show.
* Step 10: stock is the row's Units reduced lower than in step 1.
* Step 12: the sum equals the stock read in step 10.

<!-- trace:case id=g10adm.inventory-catalog.TC-a6u rev=1 covers=g10adm.inventory-catalog.SC-oth -->
### grade10-admin-inventory-catalog-US14-TC8-1: A removed Cert record leaves Cert ID details and the rows still add up

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
* **Trace:** grade10-admin-inventory-catalog-US-14

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of the row's product.
* The row's product holds only what the row names.

**Test data:**

| Field | Value |
| --- | --- |
| `<cert_a>` | `PSA-25000001`, intaken with its Cert ID, never moved |
| `<cert_b>` | `PSA-25000002`, available |
| `<cert_g>` | `PSA-25000003`, given by Assign Cert ID, never moved since |

| Row | Product | Removed | Rows listed after |
| --- | --- | --- | --- |
| Beside other units | `<product_25>`: `<cert_a>`, `<cert_b>` and 3 units of available regular stock | `<cert_a>` | `<cert_b>`, then the available `No Cert ID` row reading 3 |
| Numbered from regular stock | `<product_26>`: 3 units of regular stock intaken, one of them given `<cert_g>` | `<cert_g>` | the available `No Cert ID` row reading 2 |
| Its only unit | `<product_27>`: `<cert_a>` alone, no regular stock ever intaken | `<cert_a>` | none, and one line saying no unit is on hand |

**Steps:**

1. Click View Cert IDs.
2. Click `Remove` on the row's Removed record.
3. Click Confirm.
4. Read the rows.
5. Where an available `No Cert ID` row is listed, click it.
6. Read its history.
7. Close Cert ID details.
8. Read the product's stock.

**Expected Results:**

* Step 4: the rows read as the row's Rows listed after.
* Step 4: no row reads the Removed record's Cert ID.
* Step 6: no `Intake reversal` entry for the Removed record shows.
* Step 6: on the Numbered from regular stock row, the `Cert ID change` from `No Cert ID` to `<cert_g>` still shows.
* Step 8: stock equals the sum of the quantities listed in step 4.

<!-- trace:case id=g10adm.inventory-catalog.TC-dok rev=1 covers=g10adm.inventory-catalog.SC-4lh -->
### grade10-admin-inventory-catalog-US14-TC9-1: An admin without write authority reads but cannot reduce or remove

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

* admin(reads Inventory, no Inventory write authority) is on <inventory product url> of `<product_42>`.
* `<product_42>`'s regular stock was intaken by `<first intake>` and has never moved, and an earlier `<reduction>` took one unit out.
* `<product_42>` holds `<cert_a>`, intaken and never held, sold, withdrawn or vaulted.

**Test data:**

| Field | Value |
| --- | --- |
| `<first intake>` | An intake of 4 units with no Cert ID |
| `<reduction>` | A reduction of 1 unit by an admin with write authority |
| `<cert_a>` | `PSA-42000001` |

**Steps:**

1. Click View Cert IDs.
2. Read the rows and their actions.
3. Click the available `No Cert ID` row.
4. Read its history.
5. Send a reduction of 1 unit under this admin's session, outside the page.
6. Send a removal of `<cert_a>` under this admin's session, outside the page.
7. Read Cert ID details again.
8. Open the product history.

**Expected Results:**

* Step 2: the available `No Cert ID` row reads 3; `<cert_a>` is listed.
* Step 2: no `Reduce quantity` or `Remove` is offered.
* Step 4: the `Intake reversal · No Cert ID` entry for `<reduction>` shows.
* Step 5: the request is refused.
* Step 6: the request is refused.
* Step 7: the rows read as in step 2.
* Step 8: no `Intake reversal` entry was added after `<reduction>`'s.

---

## grade10-admin-inventory-catalog-US13: Operator removes an available copy and its source media

**As an** Inventory operator,
**I want** to remove an available physical unit and its Cert record together,
**so that** the unit is withdrawn and its Cert-scoped source media cannot be reused.

<!-- trace:case id=g10adm.inventory-catalog.TC-x83 rev=3 covers=g10adm.inventory-catalog.SC-gpb,g10adm.inventory-catalog.SC-lvy -->
### grade10-admin-inventory-catalog-US13-TC1-3: Physical removal withdraws the unit and deletes its tagged media

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

* admin(holds Inventory write authority) is on <inventory product url> of `<product_22>`.
* `<cert_a>` belongs to `<product_22>`, reads Available, and no active hold names it.
* `<admin hold>` named `<cert_a>` and was released.
* `<tagged image>` is tagged to `<cert_a>`; `<shared image>` is untagged; `<other image>` is tagged to `<cert_b>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<cert_a>` | `PSA-22000001` |
| `<cert_b>` | `PSA-22000002`, another available Cert record of `<product_22>` |
| `<admin hold>` | An admin hold of `<cert_a>`, released whole |
| `<tagged image>` | One product image tagged to `<cert_a>` |
| `<shared image>` | One product image with no Cert tag |
| `<other image>` | One product image tagged to `<cert_b>` |
| `<reason>` | `Damaged in storage` (any non-empty withdrawal reason) |

**Steps:**

1. Read stock, withdrawn and the ledger.
2. Click View Cert IDs.
3. Select `<cert_a>`'s row.
4. Read its actions.
5. Click Remove physical unit.
6. Read the confirmation.
7. Click Cancel.
8. Read the rows.
9. Click Remove physical unit.
10. Enter `<reason>`.
11. Click Confirm.
12. Read the rows.
13. Close Cert ID details.
14. Read stock, withdrawn and the ledger.
15. Open the product history.
16. Open the product's media.

**Expected Results:**

* Step 4: Remove physical unit is offered; `Remove` is not.
* Step 6: a confirmation names `<cert_a>` and asks for a reason; Confirm is unavailable.
* Step 8: `<cert_a>` is still listed, Available.
* Step 10: Confirm is available.
* Step 12: `<cert_a>` is no longer listed.
* Step 14: stock is one lower; withdrawn is one higher; the ledger reads as in step 1.
* Step 15: one withdrawal entry records `<reason>`; no `Intake reversal` entry was added.
* Step 16: `<tagged image>` is deleted.
* Step 16: `<shared image>` and `<other image>` remain with their tags.

<!-- trace:case id=g10adm.inventory-catalog.TC-dd3 rev=1 covers=g10adm.inventory-catalog.SC-k3v,g10adm.inventory-catalog.SC-lvy -->
### grade10-admin-inventory-catalog-US13-TC4-1: A Cert record that has only been intaken offers Remove, not Remove physical unit

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

* admin(holds Inventory write authority) is on <inventory product url> of `<product_23>`.
* `<product_23>` holds the row's Cert record, and no hold, active or closed, has ever named it.

**Test data:**

| Row | Cert record |
| --- | --- |
| Intaken | `PSA-23000001`, intaken with its Cert ID |
| Numbered from regular stock | `PSA-23000002`, given by Assign Cert ID to an available unit of regular stock |
| Corrected | `PSA-23000003`, corrected from `PSA-23000009` after intake |
| Beside moved regular stock | `PSA-23000004`, intaken with its Cert ID; `<product_23>`'s regular stock has since been sold and held |

**Steps:**

1. Click View Cert IDs.
2. Select the row's Cert record.
3. Read its actions.

**Expected Results:**

* Step 3: `Remove` is offered.
* Step 3: Remove physical unit is not offered.

---

## grade10-admin-inventory-catalog-US16: Inventory admin takes out units intaken by mistake

**As an** inventory admin,
**I want** to take out regular stock or a Cert record that was intaken by mistake and has never moved, from Cert ID details,
**so that** the stock and the ledger count only the units the shop received.

<!-- trace:case id=g10adm.inventory-catalog.TC-tcu rev=1 covers=g10adm.inventory-catalog.SC-w4o,g10adm.inventory-catalog.SC-9lp -->
### grade10-admin-inventory-catalog-US16-TC1-1: Reducing over-intaken regular stock lowers stock and the ledger

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
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_30>`.
* `<product_30>`'s regular stock was intaken by `<first intake>`, then `<earlier sale>`, then `<over-intake>`.
* No hold names `<product_30>`'s regular stock.

**Test data:**

| Field | Value |
| --- | --- |
| `<first intake>` | An intake of 5 units with no Cert ID |
| `<earlier sale>` | 2 units of regular stock sold outside any hold |
| `<over-intake>` | An intake of 10 units with no Cert ID, where 1 was received |
| `<reduce by>` | 9 units (any whole number from 1 to the 10 of `<over-intake>`) |
| `<available after>` | 4 units: 13 available minus `<reduce by>` |
| `<reversal time>` | The date and time step 5 is confirmed |

**Steps:**

1. Read stock, reserved, sold, withdrawn, vaulted, available and the ledger.
2. Click View Cert IDs.
3. Click `Reduce quantity` on the available `No Cert ID` row.
4. Enter `<reduce by>` as the number of units.
5. Click Confirm.
6. Read the available `No Cert ID` row.
7. Click the available `No Cert ID` row.
8. Read its newest history entry.
9. Close Cert ID details.
10. Read stock, reserved, sold, withdrawn, vaulted, available and the ledger.

**Expected Results:**

* Step 6: the row reads `<available after>`.
* Step 8: Action reads `Intake reversal · No Cert ID`; quantity reads `<reduce by>`.
* Step 8: When reads `<reversal time>`; the admin is the actor; Remarks read `Entered by mistake`.
* Step 10: stock, available and the ledger each read `<reduce by>` lower than in step 1.
* Step 10: reserved, sold, withdrawn and vaulted read as in step 1.

<!-- trace:case id=g10adm.inventory-catalog.TC-ltn rev=1 covers=g10adm.inventory-catalog.SC-cbm,g10adm.inventory-catalog.SC-8rx -->
### grade10-admin-inventory-catalog-US16-TC2-1: Removing a Cert record intaken by mistake deletes it and its tagged media

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
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_31>`.
* `<product_31>` holds the row's `<cert_a>`, never held, sold, withdrawn or vaulted since it took its Cert ID.
* `<product_31>` holds `<cert_b>`, available, and `<regular available>` units of available regular stock.
* `<tagged image>` is tagged to `<cert_a>`; `<shared image>` is untagged; `<other image>` is tagged to `<cert_b>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<cert_b>` | `PSA-31000002` |
| `<regular available>` | 3 units (any count of at least 1) |
| `<tagged image>` | One product image tagged to `<cert_a>` |
| `<shared image>` | One product image with no Cert tag |
| `<other image>` | One product image tagged to `<cert_b>` |
| `<reversal time>` | The date and time step 4 is confirmed |

| Row | `<cert_a>` |
| --- | --- |
| Intaken | `PSA-31000001`, intaken with its Cert ID |
| Numbered from regular stock | `PSA-31000003`, given by Assign Cert ID to a unit of regular stock |

**Steps:**

1. Read stock, reserved, sold, withdrawn, vaulted, available and the ledger.
2. Click View Cert IDs.
3. Click `Remove` on `<cert_a>`'s row.
4. Click Confirm.
5. Read the rows.
6. Close Cert ID details.
7. Read stock, reserved, sold, withdrawn, vaulted, available and the ledger.
8. Open the product history.
9. Read the newest entry.
10. Open the product's media.

**Expected Results:**

* Step 5: no row reads `<cert_a>`; `<cert_b>` and the available `No Cert ID` row read as before.
* Step 7: stock, available and the ledger each read one lower than in step 1.
* Step 7: reserved, sold, withdrawn and vaulted read as in step 1.
* Step 9: Action reads `Intake reversal · <cert_a>`, quantity one, When `<reversal time>`, the admin as actor, Remarks `Entered by mistake`.
* Step 10: `<tagged image>` is deleted.
* Step 10: `<shared image>` stays untagged; `<other image>` stays tagged to `<cert_b>`.

<!-- trace:case id=g10adm.inventory-catalog.TC-7el rev=1 covers=g10adm.inventory-catalog.SC-4jy,g10adm.inventory-catalog.SC-grz -->
### grade10-admin-inventory-catalog-US16-TC3-1: Reduce quantity's confirmation opens empty and states the reducible count

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_32>`.
* `<product_32>`'s regular stock was intaken by `<first intake>` and has never moved.

**Test data:**

| Field | Value |
| --- | --- |
| `<first intake>` | An intake of 7 units with no Cert ID |
| `<reducible>` | 7 units: every unit of `<first intake>` |
| `<reduce by>` | 3 units (any whole number from 1 to `<reducible>`) |

**Steps:**

1. Click View Cert IDs.
2. Hover over `Reduce quantity` on the available `No Cert ID` row.
3. Click `Reduce quantity`.
4. Read the confirmation.
5. Enter `<reduce by>` as the number of units.
6. Read the confirmation.

**Expected Results:**

* Step 2: a tooltip says the action takes out units intaken by mistake as if never received, and withdrawn does not move.
* Step 4: the number of units is empty; Confirm is unavailable.
* Step 4: it states `<reducible>` as the most units that can be taken out.
* Step 4: Remarks read `Entered by mistake`.
* Step 6: it says stock and the ledger fall by `<reduce by>`.
* Step 6: Confirm is available.

<!-- trace:case id=g10adm.inventory-catalog.TC-tre rev=1 covers=g10adm.inventory-catalog.SC-9iv,g10adm.inventory-catalog.SC-grz -->
### grade10-admin-inventory-catalog-US16-TC4-1: Remove's confirmation names the Cert ID and says its tagged media go

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_33>`.
* `<product_33>` holds the row's Cert record, intaken and never held, sold, withdrawn or vaulted.

**Test data:**

| Row | Cert record | Media tagged to it |
| --- | --- | --- |
| With tagged media | `PSA-33000001` | one product image and one product video |
| No tagged media | `PSA-33000002` | none |

**Steps:**

1. Click View Cert IDs.
2. Hover over `Remove` on the row's Cert record.
3. Click `Remove`.
4. Read the confirmation.

**Expected Results:**

* Step 2: a tooltip says the action takes out units intaken by mistake as if never received, and withdrawn does not move.
* Step 4: it names the row's Cert record.
* Step 4: it says stock and the ledger fall by one.
* Step 4: it says the record's tagged media are deleted, on both rows.
* Step 4: Remarks read `Entered by mistake`; Confirm is available.

<!-- trace:case id=g10adm.inventory-catalog.TC-te3 rev=1 covers=g10adm.inventory-catalog.SC-4jy -->
### grade10-admin-inventory-catalog-US16-TC5-1: Edited remarks are recorded on the reversal

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
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_34>`.
* `<product_34>`'s regular stock was intaken by `<first intake>` and has never moved.
* `<product_34>` holds `<cert_a>`, intaken and never held, sold, withdrawn or vaulted.

**Test data:**

| Field | Value |
| --- | --- |
| `<first intake>` | An intake of 4 units with no Cert ID |
| `<cert_a>` | `PSA-34000001` |

| Row | Action | Units | Remarks typed | Remarks read |
| --- | --- | --- | --- | --- |
| Reduction | `Reduce quantity` on the available `No Cert ID` row | 1 | `Counted twice at intake` | `Counted twice at intake` |
| Removal | `Remove` on `<cert_a>`'s row | none | `Received, then returned before listing` | `Received, then returned before listing` |
| Padded | `Remove` on `<cert_a>`'s row | none | ` Card never arrived `, a space either side | `Card never arrived` |

**Steps:**

1. Click View Cert IDs.
2. Click the row's Action.
3. Where the row names Units, enter them as the number of units.
4. Clear the remarks.
5. Type the row's Remarks typed.
6. Click Confirm.
7. Close Cert ID details.
8. Open the product history.
9. Read the newest entry.

**Expected Results:**

* Step 6: the reversal is saved.
* Step 9: an `Intake reversal` entry whose Remarks read the row's Remarks read.

<!-- trace:case id=g10adm.inventory-catalog.TC-xzl rev=1 covers=g10adm.inventory-catalog.SC-w4o,g10adm.inventory-catalog.SC-9lp -->
### grade10-admin-inventory-catalog-US16-TC6-1: A reduction at 1 and at the reducible count is accepted

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_35>`.
* `<product_35>`'s regular stock was intaken by `<first intake>`, then `<earlier sale>`, then `<second intake>`.
* No hold names `<product_35>`'s regular stock.

**Test data:**

| Field | Value |
| --- | --- |
| `<first intake>` | An intake of 3 units with no Cert ID |
| `<earlier sale>` | 1 unit of regular stock sold outside any hold |
| `<second intake>` | An intake of 4 units with no Cert ID |
| `<available>` | 6 units: 3 minus 1 plus 4 |
| `<reducible>` | 4 units: the units of `<second intake>` |

| Row | Units entered | Available row after |
| --- | --- | --- |
| One unit | 1 | 5: `<available>` minus 1 |
| At the limit | 4, `<reducible>` | 2: `<available>` minus `<reducible>` |

**Steps:**

1. Click View Cert IDs.
2. Click `Reduce quantity` on the available `No Cert ID` row.
3. Enter the row's Units entered.
4. Click Confirm.
5. Read the available `No Cert ID` row.
6. Click the available `No Cert ID` row.
7. Read its newest history entry.

**Expected Results:**

* Step 4: the reduction is saved.
* Step 5: the row reads the row's Available row after.
* Step 5: on the At the limit row, `Reduce quantity` is not offered, and the row says its units were intaken before regular stock last moved.
* Step 7: one `Intake reversal · No Cert ID` entry, quantity the row's Units entered.

<!-- trace:case id=g10adm.inventory-catalog.TC-y4w rev=1 covers=g10adm.inventory-catalog.SC-zoe,g10adm.inventory-catalog.SC-srm,g10adm.inventory-catalog.SC-9lp,g10adm.inventory-catalog.SC-sm9,g10adm.inventory-catalog.SC-c7i -->
### grade10-admin-inventory-catalog-US16-TC7-1: The reducible count starts after regular stock's latest move

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of the row's product.
* The row's product's stock went through the row's history, in order, and nothing else.

**Test data:**

| Field | Value |
| --- | --- |
| `<cert_a>` | `PSA-36000001`, a Cert record intaken with its Cert ID |
| `<cert_g>` | `PSA-36000002`, given by Assign Cert ID |

Every intake below has no Cert ID unless it names one.

| Row | History | Available row | Reducible count |
| --- | --- | --- | --- |
| Never moved | intake 5, intake 3 | 8 | 8 |
| Assigned, never moved | intake 5, one unit given `<cert_g>` | 4 | 4 |
| Sold since | intake 5, 2 sold outside any hold, intake 10 | 13 | 10 |
| Withdrawn since | intake 5, 1 withdrawn, intake 2 | 6 | 2 |
| Held, hold active | intake 5, admin hold of 2, intake 4 | 7 | 4 |
| Hold released | intake 5, admin hold of 2 released whole, intake 3 | 8 | 3 |
| Sold from a hold | intake 5, Auction hold of 2, 1 sold from it, intake 3 | 6 | 3 |
| Vaulted | intake 5, Vault hold of 1 vaulted, intake 2 | 6 | 2 |
| Assigned since the move | intake 5, 1 sold outside any hold, intake 4, one unit given `<cert_g>` | 7 | 3 |
| Reduced since the move | intake 5, 1 sold outside any hold, intake 4, a reduction of 1 | 7 | 3 |
| Cert record sold | intake 5, intake of `<cert_a>`, `<cert_a>` sold | 5 | 5 |
| Numbered record held | intake 5, one unit given `<cert_g>`, `<cert_g>` under an active admin hold | 4 | 4 |

**Steps:**

1. Click View Cert IDs.
2. Read the available `No Cert ID` row.
3. Click `Reduce quantity` on it.
4. Read the most units the confirmation says can be taken out.

**Expected Results:**

* Step 2: the row reads the row's Available row.
* Step 4: the confirmation states the row's Reducible count.

<!-- trace:case id=g10adm.inventory-catalog.TC-12l rev=1 covers=g10adm.inventory-catalog.SC-i1t -->
### grade10-admin-inventory-catalog-US16-TC8-1: A removed Cert ID can be intaken again as a new record

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

* admin(holds Inventory write authority) is on <inventory product url> of `<product_37>`.
* `<product_37>` holds `<cert_a>`, intaken and never held, sold, withdrawn or vaulted.

**Test data:**

| Field | Value |
| --- | --- |
| `<cert_a>` | `PSA-37000001` |
| `<intake time>` | The date and time step 6 is saved |

**Steps:**

1. Click View Cert IDs.
2. Click `Remove` on `<cert_a>`'s row.
3. Click Confirm.
4. Close Cert ID details.
5. Open intake on `<product_37>`.
6. Intake one unit with Cert ID `<cert_a>`.
7. Click View Cert IDs.
8. Click `<cert_a>`'s row.
9. Read its history.

**Expected Results:**

* Step 6: the intake is saved.
* Step 7: one row reads `<cert_a>`, Available, 1.
* Step 9: one entry only, the intake at `<intake time>`.
* Step 9: no `Intake reversal` entry shows.

<!-- trace:case id=g10adm.inventory-catalog.TC-3ae rev=1 covers=g10adm.inventory-catalog.SC-zu3,g10adm.inventory-catalog.SC-4jy -->
### grade10-admin-inventory-catalog-US16-TC9-1: A number of units outside 1 to the reducible count keeps Confirm unavailable

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

* admin(holds Inventory write authority) is on <inventory product url> of `<product_38>`.
* `<product_38>`'s regular stock was intaken by `<first intake>`, then `<earlier sale>`, then `<second intake>`.
* No hold names `<product_38>`'s regular stock.

**Test data:**

| Field | Value |
| --- | --- |
| `<first intake>` | An intake of 3 units with no Cert ID |
| `<earlier sale>` | 1 unit of regular stock sold outside any hold |
| `<second intake>` | An intake of 4 units with no Cert ID |
| `<available>` | 6 units: 3 minus 1 plus 4 |
| `<reducible>` | 4 units: the units of `<second intake>` |

| Row | Units entered |
| --- | --- |
| Empty | nothing |
| Zero | 0 |
| One above the limit | 5, `<reducible>` plus 1 |
| Every available unit | 6, `<available>` |
| Not whole | 2.5 |
| Below zero | -1 |

**Steps:**

1. Click View Cert IDs.
2. Click `Reduce quantity` on the available `No Cert ID` row.
3. Enter the row's Units entered.
4. Read Confirm.
5. Cancel the confirmation.
6. Read the available `No Cert ID` row.
7. Click the available `No Cert ID` row.
8. Read its history.

**Expected Results:**

* Step 4: Confirm is unavailable.
* Step 6: the row reads `<available>`.
* Step 8: no `Intake reversal` entry shows.

<!-- trace:case id=g10adm.inventory-catalog.TC-r48 rev=1 covers=g10adm.inventory-catalog.SC-7hq -->
### grade10-admin-inventory-catalog-US16-TC10-1: Empty remarks keep Confirm unavailable

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

* admin(holds Inventory write authority) is on <inventory product url> of `<product_39>`.
* `<product_39>`'s regular stock was intaken by `<first intake>` and has never moved.
* `<product_39>` holds `<cert_a>`, intaken and never held, sold, withdrawn or vaulted.

**Test data:**

| Field | Value |
| --- | --- |
| `<first intake>` | An intake of 3 units with no Cert ID |
| `<cert_a>` | `PSA-39000001` |

| Row | Action | Units | Remarks left |
| --- | --- | --- | --- |
| Reduction, cleared | `Reduce quantity` on the available `No Cert ID` row | 1 | nothing |
| Reduction, spaces only | `Reduce quantity` on the available `No Cert ID` row | 1 | three spaces |
| Removal, cleared | `Remove` on `<cert_a>`'s row | none | nothing |
| Removal, spaces only | `Remove` on `<cert_a>`'s row | none | three spaces |

**Steps:**

1. Click View Cert IDs.
2. Click the row's Action.
3. Where the row names Units, enter them as the number of units.
4. Clear the remarks.
5. Type the row's Remarks left.
6. Read Confirm.
7. Cancel the confirmation.
8. Read the rows.

**Expected Results:**

* Step 6: Confirm is unavailable.
* Step 8: the available `No Cert ID` row reads 3; `<cert_a>` is still listed.

<!-- trace:case id=g10adm.inventory-catalog.TC-zld rev=1 covers=g10adm.inventory-catalog.SC-nnc -->
### grade10-admin-inventory-catalog-US16-TC11-1: Regular stock with no reducible unit offers no Reduce quantity

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
* The row's product's regular stock went through the row's history, in order, and nothing else.

**Test data:**

Every intake below has no Cert ID.

| Row | History | Available row |
| --- | --- | --- |
| All held | intake 3, Auction hold of 3, active | 0 |
| All intaken before the latest move | intake 5, 1 sold outside any hold | 4 |
| Hold released | intake 3, admin hold of 1 released whole | 3 |
| Withdrawn | intake 3, 1 withdrawn outside any hold | 2 |
| Hold moved to another product | intake 3, Auction hold of 1 moved to another product | 2 |
| All reduced | intake 3, a reduction of 3 | 0 |
| All numbered | intake 1, the unit given `PSA-40000001` | 0 |

**Steps:**

1. Click View Cert IDs.
2. Read the available `No Cert ID` row.
3. Read its actions.

**Expected Results:**

* Step 2: the row is listed and reads the row's Available row.
* Step 2: where the row reads at least 1, it says its units were intaken before regular stock last moved.
* Step 3: `Reduce quantity` is not offered.

<!-- trace:case id=g10adm.inventory-catalog.TC-ipi rev=1 covers=g10adm.inventory-catalog.SC-lvy,g10adm.inventory-catalog.SC-8m1,g10adm.inventory-catalog.SC-x7l -->
### grade10-admin-inventory-catalog-US16-TC12-1: A Cert record that has moved offers no Remove

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

* admin(holds Inventory write authority) is on <inventory product url> of `<product_41>`.
* `<product_41>` holds the row's Cert record.

**Test data:**

| Row | Cert record | Remove physical unit |
| --- | --- | --- |
| Admin hold, active | `PSA-41000001`, held by an active admin hold | not offered |
| Auction hold, active | `PSA-41000002`, held by a live Auction listing's hold | not offered |
| Admin hold released | `PSA-41000003`, its admin hold released, so it reads Available | offered |
| Unsold listing released | `PSA-41000004`, held by an Auction listing that closed with no winner, its hold released, so it reads Available | offered |
| Hold moved to another product | `PSA-41000005`, once named by an Auction hold since moved to another product, so it reads Available | offered |
| Sold | `PSA-41000006`, sold | not offered |
| Withdrawn | `PSA-41000007`, withdrawn | not offered |
| Vaulted | `PSA-41000008`, vaulted | not offered |

**Steps:**

1. Click View Cert IDs.
2. Select the row's Cert record.
3. Read its actions.

**Expected Results:**

* Step 3: `Remove` is not offered.
* Step 3: Remove physical unit is offered or not as the row's Remove physical unit says.
* Step 3: on the Hold moved to another product row, Change Cert ID is not offered, and the record shows its Cert ID is fixed.

<!-- trace:case id=g10adm.inventory-catalog.TC-78a rev=1 covers=g10adm.inventory-catalog.SC-lvy,g10adm.inventory-catalog.SC-zu3,g10adm.inventory-catalog.SC-8m1,g10adm.inventory-catalog.SC-x7l,g10adm.inventory-catalog.SC-7hq -->
### grade10-admin-inventory-catalog-US16-TC13-1: A reversal sent outside the page is held to the same limits

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* admin(holds Inventory write authority) is signed in to the inventory console.
* `<product_43>`'s regular stock was intaken by `<first intake>`, then `<earlier sale>`, then `<second intake>`, and no hold names it.
* `<product_43>` holds `<cert_released>`, `<cert_sold>`, `<cert_moved>` and `<cert_unmoved>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<first intake>` | An intake of 3 units with no Cert ID |
| `<earlier sale>` | 1 unit of regular stock sold outside any hold |
| `<second intake>` | An intake of 4 units with no Cert ID |
| `<reducible>` | 4 units: the units of `<second intake>` |
| `<cert_released>` | `PSA-43000001`, its admin hold released, so it reads Available |
| `<cert_sold>` | `PSA-43000002`, sold |
| `<cert_moved>` | `PSA-43000003`, once named by an Auction hold since moved to another product, so it reads Available |
| `<cert_unmoved>` | `PSA-43000004`, intaken with its Cert ID, never held, sold, withdrawn or vaulted |

| Row | Request |
| --- | --- |
| One above the limit | A reduction of 5 units, `<reducible>` plus 1 |
| Zero | A reduction of 0 units |
| Not whole | A reduction of 1.5 units |
| Moved Cert record, available | A removal of `<cert_released>` |
| Sold Cert record | A removal of `<cert_sold>` |
| Hold moved to another product | A removal of `<cert_moved>` |
| Hold moved, Cert ID change | A Cert ID change of `<cert_moved>` to `PSA-43000009` |
| Physical removal of an unmoved record | A Remove physical unit of `<cert_unmoved>` |
| Empty remarks | A reduction of 1 unit with remarks of three spaces |

**Steps:**

1. Read `<product_43>`'s stock, withdrawn and the ledger.
2. Send the row's Request under this admin's session, outside the page.
3. Read the response.
4. Read `<product_43>`'s stock, withdrawn and the ledger.
5. Open `<product_43>`'s product history.

**Expected Results:**

* Step 3: the request is refused.
* Step 4: every figure reads as in step 1.
* Step 5: no entry was added.

<!-- trace:case id=g10adm.inventory-catalog.TC-n7h rev=1 covers=g10adm.inventory-catalog.SC-gbg,g10adm.inventory-catalog.SC-y0i -->
### grade10-admin-inventory-catalog-US16-TC14-1: A move or reversal after the confirmation opened refuses the reversal

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

* admin A(holds Inventory write authority) is on <inventory product url> of `<product_44>`.
* admin B(holds Inventory write authority) acts on `<product_44>` in a separate session.
* `<product_44>`'s regular stock was intaken by `<first intake>` and has never moved.
* `<product_44>` holds `<cert_a>`, intaken and never held, sold, withdrawn or vaulted.

**Test data:**

| Field | Value |
| --- | --- |
| `<first intake>` | An intake of 3 units with no Cert ID |
| `<cert_a>` | `PSA-44000001` |

| Row | Admin A opens and fills | Admin B, before admin A confirms |
| --- | --- | --- |
| Regular stock held | `Reduce quantity` on the available `No Cert ID` row, 3 units | Reserves 1 unit, `No Cert ID`, under an admin hold |
| Regular stock reduced | `Reduce quantity` on the available `No Cert ID` row, 3 units | Reduces 1 unit |
| Cert record held | `Remove` on `<cert_a>`'s row | Reserves `<cert_a>` under an admin hold |
| Cert record removed | `Remove` on `<cert_a>`'s row | Removes `<cert_a>` |

**Steps:**

1. As admin A, click View Cert IDs.
2. As admin A, open the row's action and fill it as the row says.
3. As admin B, take the row's step.
4. As admin A, click Confirm.
5. Read Cert ID details.
6. Open the product history.

**Expected Results:**

* Step 4: admin A's reversal is refused.
* Step 5: the rows read as admin B's step left them; admin B's hold, where there is one, is listed and intact.
* Step 6: only admin B's step added an entry; none is admin A's.

<!-- trace:case id=g10adm.inventory-catalog.TC-0ut rev=1 covers=g10adm.inventory-catalog.SC-9iv -->
### grade10-admin-inventory-catalog-US16-TC15-1: Cancelling a confirmation changes nothing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_45>`.
* `<product_45>`'s regular stock was intaken by `<first intake>` and has never moved.
* `<product_45>` holds `<cert_a>`, intaken and never held, sold, withdrawn or vaulted.
* `<tagged image>` is tagged to `<cert_a>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<first intake>` | An intake of 3 units with no Cert ID |
| `<cert_a>` | `PSA-45000001` |
| `<tagged image>` | One product image tagged to `<cert_a>` |

| Row | Action | Filled before cancelling |
| --- | --- | --- |
| Reduction | `Reduce quantity` on the available `No Cert ID` row | 2 units, remarks `Counted twice` |
| Removal | `Remove` on `<cert_a>`'s row | remarks left as prefilled |

**Steps:**

1. Read stock, available, withdrawn and the ledger.
2. Click View Cert IDs.
3. Click the row's Action.
4. Fill the confirmation as the row's Filled before cancelling says.
5. Cancel the confirmation.
6. Read the rows.
7. Close Cert ID details.
8. Read stock, available, withdrawn and the ledger.
9. Open the product history.
10. Open the product's media.

**Expected Results:**

* Step 6: the available `No Cert ID` row reads 3; `<cert_a>` is still listed.
* Step 8: every figure reads as in step 1.
* Step 9: no `Intake reversal` entry was added.
* Step 10: `<tagged image>` is still tagged to `<cert_a>`.

## Settled

- **Regular stock at 0** — the available `No Cert ID` row reading 0 is still listed and offers no `Reduce quantity`: a reduction takes a whole number from 1 to the reducible count, and there is none (Q8)
- **No other ceiling** — a reduction takes any whole number from 1 to the reducible count in one entry, however large (Q8)
- **Regular stock after a move** — the units intaken since regular stock last moved can be reduced, less those given a Cert ID or reduced since, never more than available; units intaken before it cannot. Regular stock that never moved counts from its first intake. Every step of a hold naming no Cert record is a move, its release included, and so is a sale or withdrawal of available regular stock (Q2, Q12)
- **The action names** — `Reduce quantity` on the available `No Cert ID` row and `Remove` on a Cert record that has only been intaken, each with a tooltip saying it takes out units intaken by mistake as if never received and that withdrawn does not move; `Remove physical unit` stays only on a record that has moved (Q14)
- **The number of units** — opens empty; Confirm stays unavailable until a whole number from 1 to the reducible count is entered, and the confirmation states that count (Q15, Q18)
- **Remarks of spaces only** — read as empty, since every remarks field is trimmed; Confirm stays unavailable (Q4)
- **A removed Cert record in the regular stock history** — not shown, a record numbered from regular stock included; a Cert record's removal shows in the product's history (Q7)
- **The media line** — every Cert record's confirmation says its tagged media are deleted, whether or not any are tagged to it (Q11)
- **Which Cert records reverse** — the records whose Cert ID can be corrected: available, and never named by a hold, active or closed, a hold since moved to another product included, nor sold, withdrawn or vaulted (Q5)
- **Remove physical unit's reason** — asked in its own confirmation, which names the Cert ID; Confirm stays unavailable while the reason is blank, and cancelling changes nothing (Q19)
- **One removal per Cert record** — Remove physical unit is offered only on an Available record that has moved and no active hold names; a record that has only been intaken offers the reversal instead (Q3)
- **A Cert record's moves and regular stock** — a sold or held Cert record leaves regular stock reducible, one given its Cert ID from regular stock included, and moved regular stock leaves an unmoved Cert record removable (Q2, Q5, Q13)
- **What falls** — stock, available and the ledger fall by the units taken out; reserved, sold, withdrawn and vaulted stay the same (Q1)
- **A removed Cert ID** — free on the product, so a later intake takes it as a new record whose history starts at that intake (Q6)
- **An inventory workbook import** — an intake: its history entry is an `intake`, the one action the history gives stock received. Regular stock it adds is reducible as any intake's, and a Cert record it creates, available, has only been intaken and offers `Remove` (the history's Action list; the reduction requirement's moves, where an intake is not one)
- **Remove physical unit sent for a record that has only been intaken** — refused from outside the page as on it; stock, withdrawn, the record, its media and the history stay as they were (the Cert record requirement: physical removal needs a record that has moved)
- **An intake reversal's Quantity and Holder** — Quantity reads the units taken out as a positive number, one for a Cert record; Holder reads `—`, since a reversal names no hold (the history fields; the product history's columns)
- **A hold of regular stock moved to another product** — a move of regular stock on both products: the one it left, where it named no Cert record, and the one it joined, where it names none (the reduction requirement's moves)

## Reconciliation

**Run:** QA2, 2026-10-05, in a fresh context, on the restarted planning run; it replaces the first run's reconciliation. QA1's fresh blind pass read the anchors and the scope - the Feature set, `user-journeys.md`, `proposal.md`, `decisions.md`, the Products and Stock page and the first run's `## Settled` - and was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. Inventory has no domain suite. QA2 read both readings, QA1's four raised questions, `decisions.md`, `tech-design.md`, `tasks.md`, the delta and durable specs, the durable suite and the Products and Stock page, and the grade10 implementation only to learn which history action the inventory workbook import writes (`intake`). It is a statement, not proof. No case of this change has been accepted or published, so every draft keeps its `<v>`. QA2 reran on 2026-10-05, in a fresh context, after the acceptance review's fixes: Q8 now reads the reducible count, Q19 gives Remove physical unit its own confirmation, the Cert record requirement and `grade10-admin-inventory-catalog-SC-175` gained that confirmation, and `grade10-admin-inventory-catalog-SC-191` to `grade10-admin-inventory-catalog-SC-193` now serve `grade10-admin-inventory-catalog-US-16`. The rerun read the diff of the delta, `decisions.md`, `tech-design.md` and the Products and Stock page, and the suite; every disposition below stands except where it says the rerun.

- **Agreed** - `grade10-admin-inventory-catalog-US4-TC2-1` with `grade10-admin-inventory-catalog-SC-172`, `grade10-admin-inventory-catalog-SC-173` and `grade10-admin-inventory-catalog-SC-174`; `grade10-admin-inventory-catalog-US4-TC3-1` with `grade10-admin-inventory-catalog-SC-174` and the regular stock history table, its Numbered Cert record row with `grade10-admin-inventory-catalog-SC-184`; `grade10-admin-inventory-catalog-US14-TC9-1` with `grade10-admin-inventory-catalog-SC-190`; `grade10-admin-inventory-catalog-US16-TC1-1` with `grade10-admin-inventory-catalog-SC-177` and `grade10-admin-inventory-catalog-SC-194`; `grade10-admin-inventory-catalog-US16-TC3-1` with `grade10-admin-inventory-catalog-SC-188` and `grade10-admin-inventory-catalog-SC-197`; `grade10-admin-inventory-catalog-US16-TC4-1` with `grade10-admin-inventory-catalog-SC-187` and `grade10-admin-inventory-catalog-SC-197`; `grade10-admin-inventory-catalog-US16-TC5-1` with `grade10-admin-inventory-catalog-SC-188` and the confirmation requirement's trimmed reason, which its Padded row reads; `grade10-admin-inventory-catalog-US16-TC7-1` with `grade10-admin-inventory-catalog-SC-178`, `grade10-admin-inventory-catalog-SC-180`, `grade10-admin-inventory-catalog-SC-194`, `grade10-admin-inventory-catalog-SC-195` and `grade10-admin-inventory-catalog-SC-196`, every row's count checked against the reduction requirement's moves and reducible count; `grade10-admin-inventory-catalog-US16-TC8-1` with `grade10-admin-inventory-catalog-SC-183`; `grade10-admin-inventory-catalog-US16-TC9-1` with `grade10-admin-inventory-catalog-SC-181` and `grade10-admin-inventory-catalog-SC-188`; `grade10-admin-inventory-catalog-US16-TC10-1` with `grade10-admin-inventory-catalog-SC-189`; `grade10-admin-inventory-catalog-US16-TC14-1` with `grade10-admin-inventory-catalog-SC-191`, `grade10-admin-inventory-catalog-SC-192` and the lands-whole requirement, its Cert record removed row with the refusal of a record that does not exist; `grade10-admin-inventory-catalog-US16-TC15-1` with `grade10-admin-inventory-catalog-SC-187` and the confirmation requirement's cancel on either row
- **Adjusted, by QA2** - `grade10-admin-inventory-catalog-US14-TC7-1` reads the `No Cert ID` history after the reduction, for `grade10-admin-inventory-catalog-SC-176`; `grade10-admin-inventory-catalog-US14-TC8-1` reads it after the removal, for the removal `grade10-admin-inventory-catalog-SC-176` leaves out; `grade10-admin-inventory-catalog-US13-TC1-3` and `grade10-admin-inventory-catalog-US13-TC4-1` read Remove physical unit in Cert ID details, where `grade10-admin-inventory-catalog-SC-175` and the Cert record requirement offer it, in place of a record page the blind reading assumed; on the rerun `grade10-admin-inventory-catalog-US13-TC1-3` reads the confirmation Remove physical unit opens, naming the Cert ID and asking for a reason with Confirm unavailable until one is entered, for `grade10-admin-inventory-catalog-SC-175`, a new assertion on the same run, so the draft keeps its `<v>`; `grade10-admin-inventory-catalog-US13-TC1-3` keeps the durable `grade10-admin-inventory-catalog-US13-TC1-2`'s title, so the fold reads it as that case's revision, for `grade10-admin-inventory-catalog-SC-134`; `grade10-admin-inventory-catalog-US16-TC2-1` runs per row and adds a record numbered from regular stock, for `grade10-admin-inventory-catalog-SC-184`; `grade10-admin-inventory-catalog-US16-TC6-1` reads the line on the row at the limit, for the last result of `grade10-admin-inventory-catalog-SC-194`; `grade10-admin-inventory-catalog-US16-TC11-1` adds a released hold, a withdrawal and a hold moved to another product, and reads the line where the row reads at least 1, for `grade10-admin-inventory-catalog-SC-179`, and drops its "no Cert record" pre-condition, which its All numbered row broke; `grade10-admin-inventory-catalog-US16-TC12-1` reads its Hold moved to another product row as offering Remove physical unit and no Change Cert ID, with its Cert ID fixed, where it asserted nothing, for `grade10-admin-inventory-catalog-SC-186`; `grade10-admin-inventory-catalog-US16-TC13-1` adds a quantity of 1.5, a removal and a Cert ID change of a record whose hold moved to another product, and Remove physical unit of a record that has only been intaken, for `grade10-admin-inventory-catalog-SC-181`, `grade10-admin-inventory-catalog-SC-186`, `grade10-admin-inventory-catalog-SC-175` and `grade10-admin-inventory-catalog-SC-135`, and reads no entry added on each
- **Moved, by QA2** - QA1's `grade10-admin-inventory-catalog-US16-TC13-1` is `grade10-admin-inventory-catalog-US14-TC9-1`, since `grade10-admin-inventory-catalog-SC-190` serves `grade10-admin-inventory-catalog-US-14`; QA1's `US16-TC14-1`, `US16-TC15-1` and `US16-TC16-1` take `grade10-admin-inventory-catalog-US16-TC13-1`, `grade10-admin-inventory-catalog-US16-TC14-1` and `grade10-admin-inventory-catalog-US16-TC15-1`. None was ever published
- **Raised, folded into spec** - none: every case reads behaviour a scenario or a requirement states
- **Raised, rejected** - none
- **Raised, settled by the artifacts** - QA1's four questions: the inventory workbook import, settled by the history's Action list and the reduction requirement's moves, and the implementation writes it as `intake`; Remove physical unit sent for a record that has only been intaken, settled by `grade10-admin-inventory-catalog-SC-175` and `grade10-admin-inventory-catalog-SC-135`, now a row of `grade10-admin-inventory-catalog-US16-TC13-1`; an intake reversal's Quantity and Holder, settled by the history fields table and `grade10-admin-inventory-catalog-SC-174`; whose regular stock a moved hold moves, settled by the reduction requirement's moves, now a row of `grade10-admin-inventory-catalog-US16-TC11-1`. Each is in `## Settled`; none goes to `decisions.md`
- **Raised, escalated** - none in this run; the first run's four rows in `decisions.md`'s `## Raised` (Q12 to Q15) stand, each in `## Settled`
- **Partly out of suite** - the before and after snapshots, changed entity and empty reservation of `grade10-admin-inventory-catalog-SC-172` and `grade10-admin-inventory-catalog-SC-173`: decided by the inventory service tests in grade10 (tasks 4.1 and 5.1); a person reads the Action, quantity and remarks. The counts after the reduction in `grade10-admin-inventory-catalog-SC-180`: task 4.1; `grade10-admin-inventory-catalog-US16-TC7-1` walks the count it offers. The reduction sent anyway on a product with nothing intaken since its move in `grade10-admin-inventory-catalog-SC-179`, and the 10 units sent past 9 in `grade10-admin-inventory-catalog-SC-195`: task 4.1; `grade10-admin-inventory-catalog-US16-TC13-1` walks a quantity above the reducible count
- **Out of suite** - `grade10-admin-inventory-catalog-SC-193`, as listed under the title
- **Cancel of Remove physical unit** - `grade10-admin-inventory-catalog-SC-175` gained a cancel step after QA2's rerun found the requirement's cancel unstated; `grade10-admin-inventory-catalog-US13-TC1-3` cancels once before it confirms, at the same `<v>`
- **Contradicted** - none
- **Uncovered anchors** - none: `grade10-admin-inventory-catalog-US-04` has two cases, `grade10-admin-inventory-catalog-US-14` three, `grade10-admin-inventory-catalog-US-13` two and `grade10-admin-inventory-catalog-US-16` fifteen; every scenario from `grade10-admin-inventory-catalog-SC-172` to `grade10-admin-inventory-catalog-SC-197`, and amended `grade10-admin-inventory-catalog-SC-134` and `grade10-admin-inventory-catalog-SC-135`, is reached by a case or listed out of suite; the durable `grade10-admin-inventory-catalog-US13-TC2-1` and `grade10-admin-inventory-catalog-US13-TC3-1` stand for the reserved and not-available records of `grade10-admin-inventory-catalog-SC-135`. `grade10-admin-inventory-catalog-SC-191`, `grade10-admin-inventory-catalog-SC-192` and `grade10-admin-inventory-catalog-SC-193` serve `grade10-admin-inventory-catalog-US-16`; `grade10-admin-inventory-catalog-US16-TC14-1` walks the first two and names them in its marker's `covers`
- **Trace markers** - a `trace:scenario` marker on every scenario a case covers, and a `trace:case` marker on every case, its `covers` naming the scenarios of its own journey that it reaches; `grade10-admin-inventory-catalog-US13-TC1-3` takes a new marker at `rev=3`, since the durable `grade10-admin-inventory-catalog-US13-TC1-2` carries none to move
