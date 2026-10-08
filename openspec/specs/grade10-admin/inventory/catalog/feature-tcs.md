# grade10-admin/inventory/catalog Test Cases

**Status:** pending-review · 0/73
**Drafts styled:** 2026-10-05, tcs-rules r4
**Out of suite:**

## grade10-admin-inventory-catalog-US4: Reconstruct stock changes

**As an** inventory admin,
**I want** every stock and reservation transition recorded,
**so that** I can explain how the latest snapshot was reached.

<!-- trace:case id=g10adm.inventory-catalog.TC-p4i rev=2 covers=g10adm.inventory-catalog.SC-l3a,g10adm.inventory-catalog.SC-y6f,g10adm.inventory-catalog.SC-1i4,g10adm.inventory-catalog.SC-k0a,g10adm.inventory-catalog.SC-vgc,g10adm.inventory-catalog.SC-cyf,g10adm.inventory-catalog.SC-ses,g10adm.inventory-catalog.SC-7oz,g10adm.inventory-catalog.SC-txu,g10adm.inventory-catalog.SC-pgg,g10adm.inventory-catalog.SC-6lr,g10adm.inventory-catalog.SC-pi4,g10adm.inventory-catalog.SC-tbn,g10adm.inventory-catalog.SC-6zh,g10adm.inventory-catalog.SC-k28,g10adm.inventory-catalog.SC-76r,g10adm.inventory-catalog.SC-z64,g10adm.inventory-catalog.SC-59i,g10adm.inventory-catalog.SC-kdh -->
### grade10-admin-inventory-catalog-US4-TC1-2: Cert ID changes leave the ledger totals unmoved

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
* `<product_1>` holds `<cert_a>`, an available Cert record no hold, active or closed, has ever named.
* `<product_1>` holds `<regular available>` units of available regular stock outside every hold.

**Test data:**

| Field | Value |
| --- | --- |
| `<cert_a>` | `PSA-10000001`, a Cert record of `<product_1>` |
| `<cert_b>` | `PSA-10000002`, unused on `<product_1>` |
| `<cert_c>` | `PSA-10000003`, unused on `<product_1>` |
| `<regular available>` | 3 units (any count of at least 1) |

**Steps:**

1. Read stock, reserved, sold, withdrawn, vaulted and available.
2. Click View Cert IDs.
3. Change `<cert_a>` to `<cert_b>`.
4. Assign `<cert_c>` to one unit of the `No Cert ID` available row.
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

## grade10-admin-inventory-catalog-US9: Inventory admin sees unsold auction stock come back

**As an** inventory admin,
**I want** the stock of an auction that closed with no winner to show as available, with the hold closed and the listing named on the product page and in the history,
**so that** I can trust the count and see why it moved.

<!-- trace:case id=g10adm.inventory-catalog.TC-bzc rev=2 covers=g10adm.inventory-catalog.SC-fac,g10adm.inventory-catalog.SC-74t,g10adm.inventory-catalog.SC-h6i,g10adm.inventory-catalog.SC-evn,g10adm.inventory-catalog.SC-j3i -->
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

<!-- trace:case id=g10adm.inventory-catalog.TC-8k0 rev=2 covers=g10adm.inventory-catalog.SC-fac,g10adm.inventory-catalog.SC-74t,g10adm.inventory-catalog.SC-h6i,g10adm.inventory-catalog.SC-evn,g10adm.inventory-catalog.SC-j3i -->
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

<!-- trace:case id=g10adm.inventory-catalog.TC-iit rev=2 covers=g10adm.inventory-catalog.SC-fac,g10adm.inventory-catalog.SC-74t,g10adm.inventory-catalog.SC-h6i,g10adm.inventory-catalog.SC-evn,g10adm.inventory-catalog.SC-j3i -->
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

<!-- trace:case id=g10adm.inventory-catalog.TC-2wi rev=2 covers=g10adm.inventory-catalog.SC-fac,g10adm.inventory-catalog.SC-74t,g10adm.inventory-catalog.SC-h6i,g10adm.inventory-catalog.SC-evn,g10adm.inventory-catalog.SC-j3i -->
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

<!-- trace:case id=g10adm.inventory-catalog.TC-izt rev=1 covers=g10adm.inventory-catalog.SC-fac,g10adm.inventory-catalog.SC-74t,g10adm.inventory-catalog.SC-h6i,g10adm.inventory-catalog.SC-evn,g10adm.inventory-catalog.SC-j3i -->
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

---

## grade10-admin-inventory-catalog-US12: Operator classifies source media for one copy

**As an** Inventory operator,
**I want** to tag, untag, or retag saved product media for one Cert record,
**so that** a listing for that physical copy can begin with the photographs
that document it while shared product media stays available to every copy.

<!-- trace:case id=g10adm.inventory-catalog.TC-9q6 rev=1 covers=g10adm.inventory-catalog.SC-sbt,g10adm.inventory-catalog.SC-hcz,g10adm.inventory-catalog.SC-ec6,g10adm.inventory-catalog.SC-6tq,g10adm.inventory-catalog.SC-fbv,g10adm.inventory-catalog.SC-hhf -->
### grade10-admin-inventory-catalog-US12-TC1-1: Tag saved media to one Cert record

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-inventory-catalog-US-12

**Pre-conditions:**

* admin(holds existing Inventory media-management authority) is on <grade10 admin inventory media manager url>.
* One saved, untagged <media type> belongs to <inventory product>.
* One Cert record with a printed Cert ID belongs to <inventory product>.

**Test data:**

| Field | Value |
| --- | --- |
| Media type | Product image |
| Media type | Product video |

**Steps:**

1. Open the saved <media type> for <inventory product>.
2. Select the Cert record for <inventory product>.
3. Save the tag.

**Expected Results:**

* The source media item is tagged to the selected Cert record of the same product.

<!-- trace:case id=g10adm.inventory-catalog.TC-7fg rev=2 covers=g10adm.inventory-catalog.SC-sbt,g10adm.inventory-catalog.SC-hcz,g10adm.inventory-catalog.SC-ec6,g10adm.inventory-catalog.SC-6tq,g10adm.inventory-catalog.SC-fbv,g10adm.inventory-catalog.SC-hhf -->
### grade10-admin-inventory-catalog-US12-TC2-2: Media for a Cert record without a printed ID stays shared

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-inventory-catalog-US-12

**Pre-conditions:**

* admin(holds existing Inventory media-management authority) is on <grade10 admin inventory media manager url>.
* One saved, untagged source media item belongs to <inventory product>.
* One Cert record belongs to <inventory product> and has no printed Cert ID.

**Steps:**

1. Open the saved source media item for <inventory product>.
2. Attempt to tag the media to the Cert record without a printed Cert ID.

**Expected Results:**

* Grade10 refuses the tag write.
* The source media remains untagged and shared at product level.

<!-- trace:case id=g10adm.inventory-catalog.TC-tzo rev=1 covers=g10adm.inventory-catalog.SC-sbt,g10adm.inventory-catalog.SC-hcz,g10adm.inventory-catalog.SC-ec6,g10adm.inventory-catalog.SC-6tq,g10adm.inventory-catalog.SC-fbv,g10adm.inventory-catalog.SC-hhf -->
### grade10-admin-inventory-catalog-US12-TC3-1: Untag saved media for product-level sharing

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-inventory-catalog-US-12

**Pre-conditions:**

* admin(holds existing Inventory media-management authority) is on <grade10 admin inventory media manager url>.
* One saved source media item for <inventory product> is tagged to a Cert record of that product with a printed Cert ID.

**Steps:**

1. Open the tagged source media item for <inventory product>.
2. Clear its Cert tag.
3. Save the tag change.

**Expected Results:**

* The source media item has no Cert tag.
* The uploaded media remains available as product-level media.

<!-- trace:case id=g10adm.inventory-catalog.TC-hik rev=2 covers=g10adm.inventory-catalog.SC-sbt,g10adm.inventory-catalog.SC-hcz,g10adm.inventory-catalog.SC-ec6,g10adm.inventory-catalog.SC-6tq,g10adm.inventory-catalog.SC-fbv,g10adm.inventory-catalog.SC-hhf -->
### grade10-admin-inventory-catalog-US12-TC4-2: Retagging leaves the original media item untagged

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-inventory-catalog-US-12

**Pre-conditions:**

* admin(holds existing Inventory media-management authority) is on <grade10 admin inventory media manager url>.
* One saved source media item for <inventory product> is tagged to <source cert record>.
* <target cert record> belongs to <inventory product>, has a printed Cert ID, and differs from <source cert record>.

**Steps:**

1. Open the tagged source media item for <inventory product>.
2. Retag the item from <source cert record> to <target cert record>.
3. Save the tag change.

**Expected Results:**

* The source media item remains on <inventory product> with no Cert tag and is shared at product level.
* Grade10 does not automatically transfer the existing source media item to <target cert record>.
* A later tag assignment to <target cert record> is a separate explicit action.

<!-- trace:case id=g10adm.inventory-catalog.TC-p5b rev=1 covers=g10adm.inventory-catalog.SC-sbt,g10adm.inventory-catalog.SC-hcz,g10adm.inventory-catalog.SC-ec6,g10adm.inventory-catalog.SC-6tq,g10adm.inventory-catalog.SC-fbv,g10adm.inventory-catalog.SC-hhf -->
### grade10-admin-inventory-catalog-US12-TC5-1: Invalid retag targets preserve the current tag

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-inventory-catalog-US-12

**Pre-conditions:**

* admin(holds existing Inventory media-management authority) is on <grade10 admin inventory media manager url>.
* One saved source media item for <inventory product> is tagged to <current cert record>.

Runs once per row of **Test data**.

**Test data:**

| Target | Value |
| --- | --- |
| Record target | Missing Cert record |
| Record target | Cert record owned by another product |

**Steps:**

1. Open the tagged source media item for <inventory product>.
2. Attempt to retag it to <record target>.

**Expected Results:**

* Grade10 refuses the tag write.
* The source media item's current tag and media remain unchanged.

<!-- trace:case id=g10adm.inventory-catalog.TC-odt rev=1 covers=g10adm.inventory-catalog.SC-sbt,g10adm.inventory-catalog.SC-hcz,g10adm.inventory-catalog.SC-ec6,g10adm.inventory-catalog.SC-6tq,g10adm.inventory-catalog.SC-fbv,g10adm.inventory-catalog.SC-hhf -->
### grade10-admin-inventory-catalog-US12-TC6-1: Unauthorized tag changes are refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-inventory-catalog-US-12

**Pre-conditions:**

* admin(without existing Inventory media-management authority) is on <grade10 admin inventory media manager url>.
* One saved source media item for <inventory product> has a Cert tag.

**Steps:**

1. Attempt to change the source media item's Cert tag.

**Expected Results:**

* Grade10 refuses the write under existing Inventory authorization.
* The tag and source media remain unchanged.

<!-- trace:case id=g10adm.inventory-catalog.TC-j5n rev=1 covers=g10adm.inventory-catalog.SC-sbt,g10adm.inventory-catalog.SC-hcz,g10adm.inventory-catalog.SC-ec6,g10adm.inventory-catalog.SC-6tq,g10adm.inventory-catalog.SC-fbv,g10adm.inventory-catalog.SC-hhf -->
### grade10-admin-inventory-catalog-US12-TC7-1: Regular stock is not a Cert media tag target

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-inventory-catalog-US-12

**Pre-conditions:**

* admin(holds existing Inventory media-management authority) is on <grade10 admin inventory media manager url>.
* <inventory product> has regular stock without a Cert record and one Cert record with a Cert ID.
* One saved, untagged source media item belongs to <inventory product>.

**Steps:**

1. Open the saved source media item for <inventory product>.
2. Inspect the Cert tag choices.

**Expected Results:**

* The Cert record with a Cert ID is offered as a tag target.
* Regular stock without a Cert record is not offered as a tag target.
* The source media item remains untagged and available as product-level media.

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

<!-- trace:case id=g10adm.inventory-catalog.TC-ktu rev=1 covers=g10adm.inventory-catalog.SC-gpb,g10adm.inventory-catalog.SC-k3v -->
### grade10-admin-inventory-catalog-US13-TC2-1: An actively reserved Cert unit cannot be removed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-inventory-catalog-US-13

**Pre-conditions:**

* admin(holds existing Inventory write authority) is on <grade10 admin inventory record url>.
* <cert record> has an active reservation and one source media item is tagged to it.

**Steps:**

1. Attempt to remove the physical unit for <cert record>.

**Expected Results:**

* Grade10 refuses the removal while the active reservation exists.
* The reservation, stock, withdrawn count, inventory ledger, Cert record, and tagged source media remain unchanged.

<!-- trace:case id=g10adm.inventory-catalog.TC-f95 rev=1 covers=g10adm.inventory-catalog.SC-gpb,g10adm.inventory-catalog.SC-k3v -->
### grade10-admin-inventory-catalog-US13-TC3-1: A non-available Cert unit cannot be removed

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
* **Testability:** automation
* **Trace:** grade10-admin-inventory-catalog-US-13

**Pre-conditions:**

* admin(holds existing Inventory write authority) is on <grade10 admin inventory record url>.
* <cert record> has no active reservation and has a status other than available.
* One source media item is tagged to <cert record>.

**Test data:**

| Status | Value |
| --- | --- |
| Cert status | Sold |
| Cert status | Withdrawn |
| Cert status | Vaulted |

**Steps:**

1. Attempt to remove the physical unit for <cert record>.

**Expected Results:**

* Grade10 refuses removal because <cert record> is not available.
* Stock, withdrawn count, inventory ledger, Cert record, and tagged source media remain unchanged.

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

## grade10-admin-inventory-catalog-US14: Inventory admin accounts for every unit in Cert ID details

**As an** inventory admin,
**I want** Cert ID details to list the regular stock without a Cert ID beside the Cert records, by state and holder,
**so that** I can see where every unit of the product is without adding up the counts myself.

<!-- trace:case id=g10adm.inventory-catalog.TC-ebs rev=1 covers=g10adm.inventory-catalog.SC-4o8,g10adm.inventory-catalog.SC-2h0,g10adm.inventory-catalog.SC-nf2,g10adm.inventory-catalog.SC-ji2,g10adm.inventory-catalog.SC-ekd,g10adm.inventory-catalog.SC-pwt -->
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
* `<product_3>` holds the Cert records and regular stock in **Test data**, and no other unit.

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

1. Read the product's stock.
2. Click View Cert IDs.
3. Read the Cert record rows.
4. Read the `No Cert ID` rows.
5. Read the order of the rows.
6. Add up the quantities of the Available and Reserved rows.

**Expected Results:**

* Step 2: Cert ID details opens.
* Step 3: one row each for `<cert_avail>`, `<cert_held>` and `<cert_sold>`, each with its state.
* Step 3: `<cert_held>`'s row names `<listing_1>` as its holder.
* Step 3: no row shows a Grade Issuer, Grade, Autograph Grade or Serial.
* Step 4: one available `No Cert ID` row reads `<regular available>`.
* Step 4: one Reserved row for `<admin hold>`: Admin, its reference and 2.
* Step 4: one Reserved row for `<auction hold>`: Auction, `<listing_2>` and 2.
* Step 4: no row for `<released hold>`, `<regular sold>` or `<regular withdrawn>`.
* Step 5: the Cert record rows come first, by Cert ID, then the available `No Cert ID` row, then the hold rows.
* Step 6: the sum equals the stock read in step 1.

<!-- trace:case id=g10adm.inventory-catalog.TC-b0u rev=1 covers=g10adm.inventory-catalog.SC-4o8,g10adm.inventory-catalog.SC-2h0,g10adm.inventory-catalog.SC-nf2,g10adm.inventory-catalog.SC-ji2,g10adm.inventory-catalog.SC-ekd,g10adm.inventory-catalog.SC-pwt -->
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

<!-- trace:case id=g10adm.inventory-catalog.TC-ei7 rev=2 covers=g10adm.inventory-catalog.SC-4o8,g10adm.inventory-catalog.SC-2h0,g10adm.inventory-catalog.SC-nf2,g10adm.inventory-catalog.SC-ji2,g10adm.inventory-catalog.SC-ekd,g10adm.inventory-catalog.SC-pwt -->
### grade10-admin-inventory-catalog-US14-TC3-2: Selecting a No Cert ID row shows the regular stock's history

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
| `<cert_g>` | `PSA-50000003`, given by Assign Cert ID |

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

<!-- trace:case id=g10adm.inventory-catalog.TC-9ow rev=1 covers=g10adm.inventory-catalog.SC-4o8,g10adm.inventory-catalog.SC-2h0,g10adm.inventory-catalog.SC-nf2,g10adm.inventory-catalog.SC-ji2,g10adm.inventory-catalog.SC-ekd,g10adm.inventory-catalog.SC-pwt -->
### grade10-admin-inventory-catalog-US14-TC4-1: Regular stock that is all held reads Available 0

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
3. Read each row's actions.

**Expected Results:**

* Step 2: two rows, in order: `No Cert ID`, Available, `—`, 0; then `No Cert ID`, Reserved, Auction, `<code_14> · <title_14>`, 2.
* Step 2: no row lists `<regular sold>` or `<regular withdrawn>`.
* Step 3: neither row offers the assign action.
* Step 3: the rows say no free unit of regular stock can take a Cert ID.

<!-- trace:case id=g10adm.inventory-catalog.TC-v6a rev=1 covers=g10adm.inventory-catalog.SC-4o8,g10adm.inventory-catalog.SC-2h0,g10adm.inventory-catalog.SC-nf2,g10adm.inventory-catalog.SC-ji2,g10adm.inventory-catalog.SC-ekd,g10adm.inventory-catalog.SC-pwt -->
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

<!-- trace:case id=g10adm.inventory-catalog.TC-6o7 rev=1 covers=g10adm.inventory-catalog.SC-4o8,g10adm.inventory-catalog.SC-2h0,g10adm.inventory-catalog.SC-nf2,g10adm.inventory-catalog.SC-ji2,g10adm.inventory-catalog.SC-ekd,g10adm.inventory-catalog.SC-pwt -->
### grade10-admin-inventory-catalog-US14-TC6-1: A product whose regular stock has no history lists no No Cert ID row

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
* The row's product is created and holds only what the row names.

**Test data:**

| Field | Value |
| --- | --- |
| `<cert_a>` | `PSA-17000001` |

| Row | Product | Rows listed |
| --- | --- | --- |
| Cert records only | `<product_17>`, which intook one unit with Cert ID `<cert_a>` and no regular stock | `<cert_a>` alone |
| Nothing intaken | `<product_18>`, which never intook stock | none, and one line saying no unit is on hand |

**Steps:**

1. Click View Cert IDs.
2. Read the rows.

**Expected Results:**

* Step 2: the rows read as the row's Rows listed.
* Step 2: no `No Cert ID` row is listed.

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

## grade10-admin-inventory-catalog-US15: Inventory admin corrects or assigns a unit's Cert ID

**As an** inventory admin,
**I want** to change a wrong Cert ID on an available unit, or give an available unit of regular stock its Cert ID, from Cert ID details,
**so that** the record matches the card on the shelf without removing the unit and losing its history.

<!-- trace:case id=g10adm.inventory-catalog.TC-77a rev=1 covers=g10adm.inventory-catalog.SC-u13,g10adm.inventory-catalog.SC-9io,g10adm.inventory-catalog.SC-auy,g10adm.inventory-catalog.SC-blo,g10adm.inventory-catalog.SC-d8o,g10adm.inventory-catalog.SC-sky,g10adm.inventory-catalog.SC-tl1,g10adm.inventory-catalog.SC-e5t,g10adm.inventory-catalog.SC-nlh,g10adm.inventory-catalog.SC-myo,g10adm.inventory-catalog.SC-sbe,g10adm.inventory-catalog.SC-zu9 -->
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
* `<product_6>` holds `<cert_a>`, an available Cert record no hold, active or closed, has ever named.
* `<product_6>` holds `<cert_sold>`.
* `<tagged image>` is tagged to `<cert_a>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<cert_a>` | `PSA-60000001` |
| `<cert_sold>` | `PSA-60000004`, a sold Cert record of `<product_6>` |
| `<tagged image>` | One product image tagged to `<cert_a>` |
| `<other product>` | Another product holding a Cert record `PSA-60000003` |
| `<change time>` | The date and time step 4 is saved |

| Row | New Cert ID | Remarks typed | Remarks read |
| --- | --- | --- | --- |
| Unused anywhere | `PSA-60000002` | `Digit misread at intake` | `Digit misread at intake` |
| Used on `<other product>` only | `PSA-60000003` | none | `—` |
| `<cert_sold>` in lower case | `psa-60000004` | none | `—` |

**Steps:**

1. Click View Cert IDs.
2. Open the correct action on `<cert_a>`'s row.
3. Enter the row's new Cert ID and remarks.
4. Save.
5. Read the Cert record rows.
6. Click the new Cert ID's row.
7. Read its history.
8. Open the product history.
9. Open the product's media and read `<tagged image>`'s Cert tag.

**Expected Results:**

* Step 5: the row reads the new Cert ID exactly as entered; no row reads `<cert_a>`.
* Step 5: it is still available.
* Step 5: `<cert_sold>` still reads `PSA-60000004`, Sold.
* Step 7: the `<cert_a>` intake entry still shows, below the `Cert ID change`.
* Step 7: a `Cert ID change` entry, quantity one, `<cert_a>` before, the new Cert ID after.
* Step 7: it shows `<change time>`, the admin as actor and the row's remarks read.
* Step 8: the same entry shows in the product history.
* Step 9: `<tagged image>` is tagged to the new Cert ID.

<!-- trace:case id=g10adm.inventory-catalog.TC-ytb rev=2 covers=g10adm.inventory-catalog.SC-u13,g10adm.inventory-catalog.SC-9io,g10adm.inventory-catalog.SC-auy,g10adm.inventory-catalog.SC-blo,g10adm.inventory-catalog.SC-d8o,g10adm.inventory-catalog.SC-sky,g10adm.inventory-catalog.SC-tl1,g10adm.inventory-catalog.SC-e5t,g10adm.inventory-catalog.SC-nlh,g10adm.inventory-catalog.SC-myo,g10adm.inventory-catalog.SC-sbe,g10adm.inventory-catalog.SC-zu9 -->
### grade10-admin-inventory-catalog-US15-TC2-2: Assigning a Cert ID alone turns one regular unit into a Cert record

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
* `<admin hold>` holds regular stock of `<product_7>`.
* No Cert record of `<product_7>` reads `<new cert>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<regular available>` | 4 units (any count of at least 1) |
| `<admin hold>` | An admin hold of 1 unit of regular stock, active |
| `<count after>` | 3 units: `<regular available>` minus 1 |
| `<new cert>` | `CGC-70000001` |
| `<change time>` | The date and time step 5 is saved |

| Row | Cert ID entered | Remarks typed | Remarks read |
| --- | --- | --- | --- |
| With remarks | `CGC-70000001` | `Numbered after grading returned` | `Numbered after grading returned` |
| No remarks | `CGC-70000001` | none | `—` |
| Padded | ` CGC-70000001 `, a space either side | none | `—` |

**Steps:**

1. Click View Cert IDs.
2. Open the assign action on the available `No Cert ID` row.
3. Read the form's fields.
4. Enter the row's Cert ID and remarks.
5. Save.
6. Read the rows.
7. Click `<new cert>`'s row.
8. Read its history.

**Expected Results:**

* Step 3: the form asks for the Cert ID and remarks only.
* Step 3: no Grade Issuer, Grade, Autograph Grade or Serial field shows.
* Step 5: the assignment is saved.
* Step 6: the available `No Cert ID` row reads `<count after>`.
* Step 6: the row for `<admin hold>` still reads 1.
* Step 6: a new row reads `<new cert>`, Available, `—`, 1.
* Step 8: one entry only: `Cert ID change`, quantity one.
* Step 8: it reads `No Cert ID` before and `<new cert>` after.
* Step 8: it shows `<change time>`, the admin as actor and the row's remarks read.

<!-- trace:case id=g10adm.inventory-catalog.TC-l2h rev=1 covers=g10adm.inventory-catalog.SC-u13,g10adm.inventory-catalog.SC-9io,g10adm.inventory-catalog.SC-auy,g10adm.inventory-catalog.SC-blo,g10adm.inventory-catalog.SC-d8o,g10adm.inventory-catalog.SC-sky,g10adm.inventory-catalog.SC-tl1,g10adm.inventory-catalog.SC-e5t,g10adm.inventory-catalog.SC-nlh,g10adm.inventory-catalog.SC-myo,g10adm.inventory-catalog.SC-sbe,g10adm.inventory-catalog.SC-zu9 -->
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
* `<product_8>` holds `<cert_a>`, an available Cert record no hold, active or closed, has ever named, and `<cert_b>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<cert_a>` | `PSA-80000001` |
| `<cert_b>` | `PSA-80000002`, a sold Cert record of `<product_8>` |

| Row | New Cert ID entered | Refusal names |
| --- | --- | --- |
| Empty | nothing | no unit |
| Spaces only | three spaces | no unit |
| `No Cert ID` in lower case | `no cert id` | no unit |
| Used on the product | `PSA-80000002` | `<cert_b>`, Sold |
| Used on the product, padded | ` PSA-80000002 `, a space either side | `<cert_b>`, Sold |
| Its own Cert ID | `PSA-80000001` | `<cert_a>`, Available |

**Steps:**

1. Click View Cert IDs.
2. Open the correct action on `<cert_a>`'s row.
3. Enter the row's new Cert ID.
4. Save.
5. Read the Cert record rows and the product history.

**Expected Results:**

* Step 4: the change is refused.
* Step 4: where the row's Refusal names a unit, the refusal names its Cert ID and status.
* Step 5: `<cert_a>` and `<cert_b>` read as before.
* Step 5: no `Cert ID change` entry was added.

<!-- trace:case id=g10adm.inventory-catalog.TC-73h rev=2 covers=g10adm.inventory-catalog.SC-u13,g10adm.inventory-catalog.SC-9io,g10adm.inventory-catalog.SC-auy,g10adm.inventory-catalog.SC-blo,g10adm.inventory-catalog.SC-d8o,g10adm.inventory-catalog.SC-sky,g10adm.inventory-catalog.SC-tl1,g10adm.inventory-catalog.SC-e5t,g10adm.inventory-catalog.SC-nlh,g10adm.inventory-catalog.SC-myo,g10adm.inventory-catalog.SC-sbe,g10adm.inventory-catalog.SC-zu9 -->
### grade10-admin-inventory-catalog-US15-TC4-2: An unusable Cert ID leaves the regular stock unchanged

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
| `<cert_b>` | `BGS-90000002`, a sold Cert record of `<product_9>` |

| Row | Cert ID entered | Refusal names |
| --- | --- | --- |
| Cert ID missing | nothing | no unit |
| Spaces only | three spaces | no unit |
| `No Cert ID` in upper case | `NO CERT ID` | no unit |
| Cert ID used on the product | `BGS-90000002` | `<cert_b>`, Sold |

**Steps:**

1. Click View Cert IDs.
2. Open the assign action on the available `No Cert ID` row.
3. Enter the row's Cert ID.
4. Save.
5. Read the rows and the product history.

**Expected Results:**

* Step 4: the assignment is refused.
* Step 4: where the row's Refusal names a unit, the refusal names its Cert ID and status.
* Step 5: the available `No Cert ID` row still reads `<regular available>`.
* Step 5: no new Cert record row is listed.
* Step 5: no `Cert ID change` entry was added.

<!-- trace:case id=g10adm.inventory-catalog.TC-d3n rev=1 covers=g10adm.inventory-catalog.SC-u13,g10adm.inventory-catalog.SC-9io,g10adm.inventory-catalog.SC-auy,g10adm.inventory-catalog.SC-blo,g10adm.inventory-catalog.SC-d8o,g10adm.inventory-catalog.SC-sky,g10adm.inventory-catalog.SC-tl1,g10adm.inventory-catalog.SC-e5t,g10adm.inventory-catalog.SC-nlh,g10adm.inventory-catalog.SC-myo,g10adm.inventory-catalog.SC-sbe,g10adm.inventory-catalog.SC-zu9 -->
### grade10-admin-inventory-catalog-US15-TC5-1: A unit that is held or has moved offers no Cert ID change

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
| Released Cert record | `PSA-10100006`, held by an Auction listing that closed with no winner, its hold released, so it reads Available |
| Held regular stock | The `No Cert ID` row of an active admin hold on regular stock |

**Steps:**

1. Click View Cert IDs.
2. Find the row's unit.
3. Read its actions.

**Expected Results:**

* Step 3: no correct or assign action is offered on it.
* Step 3: the row says why its Cert ID cannot change.

<!-- trace:case id=g10adm.inventory-catalog.TC-p63 rev=1 covers=g10adm.inventory-catalog.SC-u13,g10adm.inventory-catalog.SC-9io,g10adm.inventory-catalog.SC-auy,g10adm.inventory-catalog.SC-blo,g10adm.inventory-catalog.SC-d8o,g10adm.inventory-catalog.SC-sky,g10adm.inventory-catalog.SC-tl1,g10adm.inventory-catalog.SC-e5t,g10adm.inventory-catalog.SC-nlh,g10adm.inventory-catalog.SC-myo,g10adm.inventory-catalog.SC-sbe,g10adm.inventory-catalog.SC-zu9 -->
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
* `<product_11>` holds `<cert_a>`, an available Cert record no hold, active or closed, has ever named, and exactly 1 unit of available regular stock outside every hold.

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
3. As admin A, enter `<new cert>`.
4. As admin B, take the row's step.
5. As admin A, save.
6. Read Cert ID details and the product history.

**Expected Results:**

* Step 5: the change is refused.
* Step 6: no row reads `<new cert>`; `<cert_a>` is unchanged.
* Step 6: admin B's hold is listed and intact.
* Step 6: no `Cert ID change` entry was added.

<!-- trace:case id=g10adm.inventory-catalog.TC-qwg rev=1 covers=g10adm.inventory-catalog.SC-u13,g10adm.inventory-catalog.SC-9io,g10adm.inventory-catalog.SC-auy,g10adm.inventory-catalog.SC-blo,g10adm.inventory-catalog.SC-d8o,g10adm.inventory-catalog.SC-sky,g10adm.inventory-catalog.SC-tl1,g10adm.inventory-catalog.SC-e5t,g10adm.inventory-catalog.SC-nlh,g10adm.inventory-catalog.SC-myo,g10adm.inventory-catalog.SC-sbe,g10adm.inventory-catalog.SC-zu9 -->
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
* `<product_12>` holds `<cert_a>`, an available Cert record no hold, active or closed, has ever named, and available regular stock outside every hold.

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
6. Send an assignment of `<new cert>` under this admin's session, outside the page.
7. Read Cert ID details again.

**Expected Results:**

* Step 2: the Cert record and `No Cert ID` rows are listed.
* Step 2: no correct or assign action is offered.
* Step 4: the history shows.
* Step 5: the request is refused.
* Step 6: the request is refused.
* Step 7: `<cert_a>` is unchanged; no row reads `<new cert>`.
* Step 7: the available `No Cert ID` row reads as in step 2.

<!-- trace:case id=g10adm.inventory-catalog.TC-ej3 rev=1 covers=g10adm.inventory-catalog.SC-u13,g10adm.inventory-catalog.SC-9io,g10adm.inventory-catalog.SC-auy,g10adm.inventory-catalog.SC-blo,g10adm.inventory-catalog.SC-d8o,g10adm.inventory-catalog.SC-sky,g10adm.inventory-catalog.SC-tl1,g10adm.inventory-catalog.SC-e5t,g10adm.inventory-catalog.SC-nlh,g10adm.inventory-catalog.SC-myo,g10adm.inventory-catalog.SC-sbe,g10adm.inventory-catalog.SC-zu9 -->
### grade10-admin-inventory-catalog-US15-TC8-1: An ended Unsold listing shows the corrected Cert ID

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
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

<!-- trace:case id=g10adm.inventory-catalog.TC-ouv rev=1 covers=g10adm.inventory-catalog.SC-u13,g10adm.inventory-catalog.SC-9io,g10adm.inventory-catalog.SC-auy,g10adm.inventory-catalog.SC-blo,g10adm.inventory-catalog.SC-d8o,g10adm.inventory-catalog.SC-sky,g10adm.inventory-catalog.SC-tl1,g10adm.inventory-catalog.SC-e5t,g10adm.inventory-catalog.SC-nlh,g10adm.inventory-catalog.SC-myo,g10adm.inventory-catalog.SC-sbe,g10adm.inventory-catalog.SC-zu9 -->
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
| `<new cert>` | `BGS-16000001`, given by Assign Cert ID |

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

<!-- trace:case id=g10adm.inventory-catalog.TC-twb rev=1 covers=g10adm.inventory-catalog.SC-u13,g10adm.inventory-catalog.SC-9io,g10adm.inventory-catalog.SC-auy,g10adm.inventory-catalog.SC-blo,g10adm.inventory-catalog.SC-d8o,g10adm.inventory-catalog.SC-sky,g10adm.inventory-catalog.SC-tl1,g10adm.inventory-catalog.SC-e5t,g10adm.inventory-catalog.SC-nlh,g10adm.inventory-catalog.SC-myo,g10adm.inventory-catalog.SC-sbe,g10adm.inventory-catalog.SC-zu9 -->
### grade10-admin-inventory-catalog-US15-TC10-1: Copy facts sent with an assignment are ignored

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
* **Testability:** automation
* **Trace:** grade10-admin-inventory-catalog-US-15

**Pre-conditions:**

* admin(holds Inventory write authority) is on <inventory product url> of `<product_19>`.
* `<product_19>` holds `<regular available>` units of available regular stock outside every hold.
* No Cert record of `<product_19>` reads `<new cert>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<regular available>` | 2 units (any count of at least 1) |
| `<count after>` | 1 unit: `<regular available>` minus 1 |
| `<new cert>` | `CGC-19000001` |

| Row | Grade Issuer | Grade | Autograph Grade | Serial |
| --- | --- | --- | --- | --- |
| Every fact | `CGC` | `9.8` | `10` | `12/50` |
| Grade Issuer `RAW` | `RAW` | none | none | none |
| Facts not checked | none | 300 characters of `9` | none | the number `50`, not text |

**Steps:**

1. Send an assignment of `<new cert>` with the row's facts under this admin's session, outside the page.
2. Read the response.
3. Click View Cert IDs.
4. Read the rows.
5. Click `<new cert>`'s row.
6. Read its history.

**Expected Results:**

* Step 2: the assignment is saved.
* Step 4: the available `No Cert ID` row reads `<count after>`.
* Step 4: a new row reads `<new cert>`, Available, `—`, 1.
* Step 6: one `Cert ID change` entry, `No Cert ID` before and `<new cert>` after.

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

---

## grade10-admin-inventory-catalog-US69: Operator records a received graded unit

**As an** inventory admin,
**I want** to record optional Cert IDs when I intake stock,
**so that** each numbered graded unit can be traced without preventing
unnumbered stock from entering inventory.

<!-- trace:case id=g10adm.inventory-catalog.TC-50a rev=1 covers=g10adm.inventory-catalog.SC-fq8,g10adm.inventory-catalog.SC-irv,g10adm.inventory-catalog.SC-a57,g10adm.inventory-catalog.SC-skp,g10adm.inventory-catalog.SC-ah9,g10adm.inventory-catalog.SC-0ac -->
### grade10-admin-inventory-catalog-US69-TC1-1: Intake records numbered and unnumbered stock

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
* **Trace:** grade10-admin-inventory-catalog-US-69

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A created product has an inventory with stock two.

**Test data:**

| Field | Value |
| --- | --- |
| `<numbered intake>` | Quantity two with `PSA-123` and `BGS-456` |
| `<unnumbered intake>` | Quantity three with no Cert IDs |

**Steps:**

1. Navigate to <inventory product url>.
2. Intake <numbered intake>.
3. Intake <unnumbered intake>.
4. Read the product inventory and its history.

**Expected Results:**

* Stock increases by five.
* `PSA-123` and `BGS-456` are owned by the product inventory.
* The unnumbered intake creates no Cert ID record.
* One intake history entry records the numbered identifiers.

<!-- trace:case id=g10adm.inventory-catalog.TC-gvc rev=1 covers=g10adm.inventory-catalog.SC-fq8,g10adm.inventory-catalog.SC-irv,g10adm.inventory-catalog.SC-a57,g10adm.inventory-catalog.SC-skp,g10adm.inventory-catalog.SC-ah9,g10adm.inventory-catalog.SC-0ac -->
### grade10-admin-inventory-catalog-US69-TC2-1: Invalid Cert ID intake preserves inventory

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
* **Trace:** grade10-admin-inventory-catalog-US-69

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* The product inventory already owns `PSA-123` and stock is two.

**Steps:**

1. Navigate to <inventory product url>.
2. Try to intake quantity one with duplicate `PSA-123`.
3. Try to intake quantity one with two Cert IDs.
4. Read the inventory and its history.

**Expected Results:**

* Both intakes are refused.
* Stock and Cert ID records are unchanged.
* No refused intake adds a history entry.

<!-- trace:case id=g10adm.inventory-catalog.TC-if9 rev=1 covers=g10adm.inventory-catalog.SC-fq8,g10adm.inventory-catalog.SC-irv,g10adm.inventory-catalog.SC-a57,g10adm.inventory-catalog.SC-skp,g10adm.inventory-catalog.SC-ah9,g10adm.inventory-catalog.SC-0ac -->
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

## grade10-admin-inventory-catalog-US70: Operator configures the product identity and display

**As an** inventory admin,
**I want** products to use IP, Category, and Item while choosing whether Cert
ID appears in displayed attributes,
**so that** product facts stay structured and each Auction presentation shows
only the fields I choose.

<!-- trace:case id=g10adm.inventory-catalog.TC-tzz rev=1 covers=g10adm.inventory-catalog.SC-sls,g10adm.inventory-catalog.SC-ux1,g10adm.inventory-catalog.SC-q36,g10adm.inventory-catalog.SC-u9i,g10adm.inventory-catalog.SC-6vy,g10adm.inventory-catalog.SC-rn5 -->
### grade10-admin-inventory-catalog-US70-TC1-1: Product display offers the hierarchy and Cert ID field

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-70

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/inventory/catalog.spec.ts`

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A product schema exists for one IP, Category, and Item tuple.

**Steps:**

1. Navigate to <inventory product url>.
2. Inspect the product identity fields.
3. Navigate to <inventory product schemas url>.
4. Add Cert ID to the displayed fields and place it first.
5. Read a listing for a product with Cert ID `PSA-123`.

**Expected Results:**

* The product form shows IP, Category, and Item.
* Collectible type and product metadata are absent.
* Cert ID is available without creating an ordinary attribute key.
* The listing shows `PSA-123` first in its configured product fields.

<!-- trace:case id=g10adm.inventory-catalog.TC-peb rev=1 covers=g10adm.inventory-catalog.SC-sls,g10adm.inventory-catalog.SC-ux1,g10adm.inventory-catalog.SC-q36,g10adm.inventory-catalog.SC-u9i,g10adm.inventory-catalog.SC-6vy,g10adm.inventory-catalog.SC-rn5 -->
### grade10-admin-inventory-catalog-US70-TC2-1: Hiding Cert ID preserves typed attributes

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-70

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/inventory/catalog.spec.ts`

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A published schema displays Cert ID and two typed attributes.
* A listing explicitly selected `No Cert ID`.

**Steps:**

1. Navigate to <inventory product schemas url>.
2. Remove Cert ID from the displayed fields.
3. Read the schema and the listing.

**Expected Results:**

* The two typed attributes remain in their prior order.
* Cert ID is not returned as a displayed field.
* The listing shows no Cert ID row and no product metadata fallback.

---

## grade10-admin-inventory-catalog-US71: Holder reserves a specific inventory unit

**As an** inventory holder,
**I want** to choose a specific Cert ID or explicitly choose `No Cert ID` when
I reserve stock,
**so that** every reservation identifies whether it owns a physical numbered
unit or only aggregate stock.

<!-- trace:case id=g10adm.inventory-catalog.TC-q7e rev=1 covers=g10adm.inventory-catalog.SC-bck,g10adm.inventory-catalog.SC-63a,g10adm.inventory-catalog.SC-ol8 -->
### grade10-admin-inventory-catalog-US71-TC1-1: Reservation records the selected unit

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-71

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/inventory/catalog.spec.ts`

**Pre-conditions:**

* An authorized holder can reserve inventory.
* A created product has available Cert IDs `PSA-123` and `BGS-456`.

**Steps:**

1. Open the holder reservation flow for the product.
2. Select Cert ID `PSA-123`.
3. Save the reservation.
4. Inspect the reservation and available unit choices.

**Expected Results:**

* The reservation stores the selected opaque Cert ID record.
* The reservation quantity is one.
* `PSA-123` is unavailable to another active reservation.

<!-- trace:case id=g10adm.inventory-catalog.TC-tq8 rev=1 covers=g10adm.inventory-catalog.SC-bck,g10adm.inventory-catalog.SC-63a,g10adm.inventory-catalog.SC-ol8 -->
### grade10-admin-inventory-catalog-US71-TC2-1: Reservation requires an explicit unit choice

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-71

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/inventory/catalog.spec.ts`

**Pre-conditions:**

* An authorized holder can reserve inventory.
* A created product has available stock and no intended numbered unit.

**Steps:**

1. Open the holder reservation flow for the product.
2. Try to save without choosing a Cert ID or `No Cert ID`.
3. Choose `No Cert ID` and quantity three.
4. Save and inspect the reservation.

**Expected Results:**

* The missing-choice request is refused without changing inventory.
* The explicit `No Cert ID` request succeeds through product-level quantity.
* No Cert ID record is allocated.

---

## grade10-admin-inventory-catalog-US72: Operator configures card schemas and imports products

**As an** inventory admin,
**I want** to define card schemas from one shared template and upload
product rows separately from stock, then mark valid products created,
**so that** every product has a mapped identity and valid structured facts before inventory is added.

<!-- trace:case id=g10adm.inventory-catalog.TC-lzo rev=2 covers=g10adm.inventory-catalog.SC-ml0,g10adm.inventory-catalog.SC-p05,g10adm.inventory-catalog.SC-30a,g10adm.inventory-catalog.SC-ikp,g10adm.inventory-catalog.SC-hqo,g10adm.inventory-catalog.SC-1d9,g10adm.inventory-catalog.SC-3c8,g10adm.inventory-catalog.SC-t1v -->
### grade10-admin-inventory-catalog-US72-TC1-2: Card schema uses one shared template

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-72

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* Existing IP, Item, and Category tags are available for selection.

**Test data:**

| Field | Value |
| --- | --- |
| `<source rows>` | Rows with broad Category `TCG` and Set values `Pokémon`, `Lorcana`, and `One Piece` |
| `<product name>` | The workbook Item cell |
| `<card schema>` | Required Year number, Set text, Subject text; optional Card Number and Variety text |

**Steps:**

1. Navigate to <inventory product schemas url>.
2. Map each sufficiently specific source key, including Category and Set, to one existing IP, Item, and Category tuple.
3. Try to map Category `TCG` alone to those multiple tuples.
4. Create a product schema from `<card schema>`.
5. Inspect the schema fields and product identity mapping.

**Expected Results:**

* Year is a required number; Set and Subject are required text.
* Card Number and Variety are optional text.
* `<product name>` is the product name, not the Grade10 Item tag.
* Serial, Cert ID, Grade Issuer, Grade, and Autograph Grade are not product attributes.
* The Category-only `TCG` mapping is refused because its source rows resolve to multiple tuples.
* The mapping uses existing tags and creates no taxonomy values.

<!-- trace:case id=g10adm.inventory-catalog.TC-7vt rev=2 covers=g10adm.inventory-catalog.SC-ml0,g10adm.inventory-catalog.SC-p05,g10adm.inventory-catalog.SC-30a,g10adm.inventory-catalog.SC-ikp,g10adm.inventory-catalog.SC-hqo,g10adm.inventory-catalog.SC-1d9,g10adm.inventory-catalog.SC-3c8,g10adm.inventory-catalog.SC-t1v -->
### grade10-admin-inventory-catalog-US72-TC2-2: Manifest import creates drafts only

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-72

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A published product schema exists for the selected existing IP, Item, and Category tuple.

**Test data:**

| Field | Value |
| --- | --- |
| `<schema manifest>` | Valid attribute definitions from the shared card template |
| `<source classification key>` | A sufficiently specific key, such as Category `TCG` plus Set `Pokémon`, mapped to the selected tuple |

**Steps:**

1. Navigate to <inventory product schemas url>.
2. Upload `<schema manifest>` and map `<source classification key>` to the existing tuple.
3. Review the preview and import the manifest.
4. Read the schema revisions and active schema.

**Expected Results:**

* The imported schema revision is a draft.
* The current published schema remains active.
* The imported revision is not published until the admin uses the publish flow.

<!-- trace:case id=g10adm.inventory-catalog.TC-01d rev=2 covers=g10adm.inventory-catalog.SC-ml0,g10adm.inventory-catalog.SC-p05,g10adm.inventory-catalog.SC-30a,g10adm.inventory-catalog.SC-ikp,g10adm.inventory-catalog.SC-hqo,g10adm.inventory-catalog.SC-1d9,g10adm.inventory-catalog.SC-3c8,g10adm.inventory-catalog.SC-t1v -->
### grade10-admin-inventory-catalog-US72-TC3-2: Invalid manifest leaves schemas unchanged

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-72

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* One broad Category-only mapping is ambiguous because its rows target multiple tuples.

**Test data:**

| Field | Value |
| --- | --- |
| `<schema manifest>` | One valid schema row and one row with an invalid attribute definition |
| `<source classification key>` | A broad `TCG` Category-only key that maps to multiple tuples |

**Steps:**

1. Navigate to <inventory product schemas url>.
2. Upload `<schema manifest>` with the ambiguous Category-only key unmapped.
3. Review validation and attempt to import the manifest.
4. Read the affected schema revisions and published schemas.

**Expected Results:**

* Validation identifies the affected rows and reasons.
* No schema revision from the manifest is created.
* Existing published schemas remain active.

<!-- trace:case id=g10adm.inventory-catalog.TC-arw rev=2 covers=g10adm.inventory-catalog.SC-ml0,g10adm.inventory-catalog.SC-p05,g10adm.inventory-catalog.SC-30a,g10adm.inventory-catalog.SC-ikp,g10adm.inventory-catalog.SC-hqo,g10adm.inventory-catalog.SC-1d9,g10adm.inventory-catalog.SC-3c8,g10adm.inventory-catalog.SC-t1v -->
### grade10-admin-inventory-catalog-US72-TC4-2: Product upload separates products from stock

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
* **Trace:** grade10-admin-inventory-catalog-US-72

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A published product schema exists for the mapped tuple.

**Test data:**

| Field | Value |
| --- | --- |
| `<product workbook>` | Two sheets with repeated identical product rows and one different identity |
| `<source classification mapping>` | Category plus a distinguishing source field mapped to one existing IP, Item, and Category tuple |

**Steps:**

1. Navigate to <inventory products url>.
2. Upload `<product workbook>` and apply `<source classification mapping>`.
3. Review the product matches and row validation.
4. Confirm the product upload and read the created draft products.
5. Mark each valid imported draft `created` through the existing product status flow.
6. Read the product status and inventories.

**Expected Results:**

* Each distinct product name, exact tuple, and schema-value set has one product.
* Repeated identical rows resolve to one product.
* Newly created products use draft status until the admin marks each valid product `created`.
* No inventory quantity, unit record, or Cert ID is created.

<!-- trace:case id=g10adm.inventory-catalog.TC-ii9 rev=2 covers=g10adm.inventory-catalog.SC-ml0,g10adm.inventory-catalog.SC-p05,g10adm.inventory-catalog.SC-30a,g10adm.inventory-catalog.SC-ikp,g10adm.inventory-catalog.SC-hqo,g10adm.inventory-catalog.SC-1d9,g10adm.inventory-catalog.SC-3c8,g10adm.inventory-catalog.SC-t1v -->
### grade10-admin-inventory-catalog-US72-TC5-2: Incomplete product rows block every create

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
* **Trace:** grade10-admin-inventory-catalog-US-72

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A published product schema exists for one target tuple.

**Test data:**

| Field | Value |
| --- | --- |
| `<product workbook>` | One valid row and one row with a missing required value or invalid value |
| `<source classification mapping>` | A broad `TCG` Category-only key with no tuple mapping |

**Steps:**

1. Navigate to <inventory products url>.
2. Upload `<product workbook>` without applying `<source classification mapping>`.
3. Review row validation and attempt to commit.
4. Read the product list.

**Expected Results:**

* Validation identifies the unmapped label and invalid product row.
* No product from the upload is created or changed.

<!-- trace:case id=g10adm.inventory-catalog.TC-bdu rev=2 covers=g10adm.inventory-catalog.SC-ml0,g10adm.inventory-catalog.SC-p05,g10adm.inventory-catalog.SC-30a,g10adm.inventory-catalog.SC-ikp,g10adm.inventory-catalog.SC-hqo,g10adm.inventory-catalog.SC-1d9,g10adm.inventory-catalog.SC-3c8,g10adm.inventory-catalog.SC-t1v -->
### grade10-admin-inventory-catalog-US72-TC6-2: Same product name keeps distinct card identities

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
* **Trace:** grade10-admin-inventory-catalog-US-72

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A published card schema exists for the mapped tuple.
* No product matches the uploaded rows' schema values.

**Test data:**

| Field | Value |
| --- | --- |
| `<product rows>` | Same Item display name and exact tuple; one pair differs by Card Number, and another pair differs by Set |
| `<source classification mapping>` | Category plus a distinguishing source field mapped to one existing IP, Item, and Category tuple |

**Steps:**

1. Navigate to <inventory products url>.
2. Upload `<product rows>` and apply `<source classification mapping>`.
3. Review the product matches and confirm the upload.
4. Read the created products and their schema values.

**Expected Results:**

* Products with the same display name and tuple but different Card Number or Set remain separate.
* Each distinct schema-value set creates one draft product.
* Product name alone neither merges rows nor blocks the upload.
* No inventory quantity, unit record, or Cert ID is created.

---

<!-- trace:case id=g10adm.inventory-catalog.TC-vud rev=1 covers=g10adm.inventory-catalog.SC-ml0,g10adm.inventory-catalog.SC-p05,g10adm.inventory-catalog.SC-30a,g10adm.inventory-catalog.SC-ikp,g10adm.inventory-catalog.SC-hqo,g10adm.inventory-catalog.SC-1d9,g10adm.inventory-catalog.SC-3c8,g10adm.inventory-catalog.SC-t1v -->
### grade10-admin-inventory-catalog-US72-TC7-1: Mapped values trim and omit blank placeholders

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-72

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A published card schema exists for the mapped tuple.

**Test data:**

| Field | Value |
| --- | --- |
| `<product workbook>` | One row with padded Year, Set, and Subject values, optional Card Number `-`, and blank Variety; a second row with required Set `-` |
| `<source classification mapping>` | A sufficiently specific key mapped to one existing IP, Item, and Category tuple |

**Steps:**

1. Navigate to <inventory products url>.
2. Upload `<product workbook>` and apply `<source classification mapping>`.
3. Review the normalized preview and source workbook.

**Expected Results:**

* Surrounding whitespace is removed from the mapped Year, Set, and Subject values.
* Blank and standalone `-` optional values are shown as absent; the required Set `-` is reported as missing.
* The upload is not committed while the required value is missing.
* The uploaded workbook remains unchanged.

---

## grade10-admin-inventory-catalog-US73: Operator bulk imports matched inventory units

**As an** inventory admin,
**I want** to upload physical copy rows against existing products,
**so that** inventory counts and copy-level facts are recorded together after I review the matches.

<!-- trace:case id=g10adm.inventory-catalog.TC-4u2 rev=2 covers=g10adm.inventory-catalog.SC-3ab,g10adm.inventory-catalog.SC-1c7,g10adm.inventory-catalog.SC-crr,g10adm.inventory-catalog.SC-dc8,g10adm.inventory-catalog.SC-bc7,g10adm.inventory-catalog.SC-4hn,g10adm.inventory-catalog.SC-sfn -->
### grade10-admin-inventory-catalog-US73-TC1-2: Inventory preview shows matched copy facts

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
* **Trace:** grade10-admin-inventory-catalog-US-73

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* Each uploaded row matches one existing `created` product.

**Test data:**

| Field | Value |
| --- | --- |
| `<inventory workbook>` | One row per physical copy with Cert ID, Grade Issuer, Grade, Autograph Grade, and Serial columns |
| `<source classification mapping>` | Each sufficiently specific source key maps to one existing IP, Item, and Category tuple |

**Steps:**

1. Navigate to <inventory bulk upload url>.
2. Upload `<inventory workbook>` and apply `<source classification mapping>`.
3. Review the resolved products and copy-level facts.
4. Confirm the upload and read inventory counts, unit records, and history.

**Expected Results:**

* Each row resolves to one existing product and one physical unit.
* Cert ID, Grade Issuer, Grade, Autograph Grade, and Serial are stored on the unit.
* Inventory counts increase by the number of included rows.
* The batch's inventory changes and history are committed together.

<!-- trace:case id=g10adm.inventory-catalog.TC-i75 rev=2 covers=g10adm.inventory-catalog.SC-3ab,g10adm.inventory-catalog.SC-1c7,g10adm.inventory-catalog.SC-crr,g10adm.inventory-catalog.SC-dc8,g10adm.inventory-catalog.SC-bc7,g10adm.inventory-catalog.SC-4hn,g10adm.inventory-catalog.SC-sfn -->
### grade10-admin-inventory-catalog-US73-TC2-2: Blank status choices apply per row

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-73

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* Created products match both blank-status rows.

**Test data:**

| Field | Value |
| --- | --- |
| `<inventory workbook>` | Two blank Item Status rows: one `RAW` row without Cert ID and one graded row with Cert ID |

**Steps:**

1. Navigate to <inventory bulk upload url>.
2. Upload `<inventory workbook>` and try to continue without choosing how to handle blank Item Status rows.
3. Choose to include the RAW row and exclude the graded row.
4. Confirm the import and read inventory counts and unit records.

**Expected Results:**

* Grade10 requires a separate include or exclude choice for each blank-status row; there is no batch-wide default.
* The included RAW unit is accepted without Cert ID.
* The excluded graded unit adds no unit or stock.

<!-- trace:case id=g10adm.inventory-catalog.TC-rr6 rev=2 covers=g10adm.inventory-catalog.SC-3ab,g10adm.inventory-catalog.SC-1c7,g10adm.inventory-catalog.SC-crr,g10adm.inventory-catalog.SC-dc8,g10adm.inventory-catalog.SC-bc7,g10adm.inventory-catalog.SC-4hn,g10adm.inventory-catalog.SC-sfn -->
### grade10-admin-inventory-catalog-US73-TC3-2: Unmatched products block inventory import

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
* **Trace:** grade10-admin-inventory-catalog-US-73

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* The product catalogue has no match for one uploaded row and multiple matches for another.

**Steps:**

1. Navigate to <inventory bulk upload url>.
2. Upload rows for the unmatched and ambiguous products.
3. Review matches and attempt to commit the batch.
4. Read inventory counts, unit records, and history.

**Expected Results:**

* Validation identifies both the unmatched and ambiguous rows.
* No inventory, unit, or history change from the upload is committed.

<!-- trace:case id=g10adm.inventory-catalog.TC-9ou rev=1 covers=g10adm.inventory-catalog.SC-3ab,g10adm.inventory-catalog.SC-1c7,g10adm.inventory-catalog.SC-crr,g10adm.inventory-catalog.SC-dc8,g10adm.inventory-catalog.SC-bc7,g10adm.inventory-catalog.SC-4hn,g10adm.inventory-catalog.SC-sfn -->
### grade10-admin-inventory-catalog-US73-TC4-1: Duplicate Cert IDs block every unit

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
* **Trace:** grade10-admin-inventory-catalog-US-73

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A created product inventory already owns Cert ID `PSA-123`.

**Test data:**

| Field | Value |
| --- | --- |
| `<inventory workbook>` | One valid row and one row with Cert ID ` PSA-123 ` |

**Steps:**

1. Navigate to <inventory bulk upload url>.
2. Upload `<inventory workbook>`.
3. Review validation and attempt to commit.
4. Read inventory counts, unit records, and history.

**Expected Results:**

* Grade10 trims surrounding whitespace and reports the duplicate Cert ID.
* The valid row is not committed with the duplicate row.
* Inventory counts, unit records, and history remain unchanged.

<!-- trace:case id=g10adm.inventory-catalog.TC-5r1 rev=1 covers=g10adm.inventory-catalog.SC-3ab,g10adm.inventory-catalog.SC-1c7,g10adm.inventory-catalog.SC-crr,g10adm.inventory-catalog.SC-dc8,g10adm.inventory-catalog.SC-bc7,g10adm.inventory-catalog.SC-4hn,g10adm.inventory-catalog.SC-sfn -->
### grade10-admin-inventory-catalog-US73-TC5-1: Invalid inventory values block the batch

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
* **Trace:** grade10-admin-inventory-catalog-US-73

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A created product has the required card schema.

**Test data:**

| Field | Value |
| --- | --- |
| `<inventory workbook>` | One valid row and one row whose Year value is not a number |

**Steps:**

1. Navigate to <inventory bulk upload url>.
2. Upload `<inventory workbook>` and apply a sufficiently specific source classification mapping.
3. Review validation and attempt to commit.
4. Read inventory counts, unit records, and history.

**Expected Results:**

* Validation identifies the invalid Year value.
* No row from the upload changes inventory counts, unit facts, or history.

<!-- trace:case id=g10adm.inventory-catalog.TC-4v4 rev=1 covers=g10adm.inventory-catalog.SC-3ab,g10adm.inventory-catalog.SC-1c7,g10adm.inventory-catalog.SC-crr,g10adm.inventory-catalog.SC-dc8,g10adm.inventory-catalog.SC-bc7,g10adm.inventory-catalog.SC-4hn,g10adm.inventory-catalog.SC-sfn -->
### grade10-admin-inventory-catalog-US73-TC6-1: Inventory import normalizes copy facts

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-73

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A created product matches the uploaded `RAW` row.

**Test data:**

| Field | Value |
| --- | --- |
| `<inventory workbook>` | One `RAW` row with blank Cert ID, Grade `-`, Autograph Grade `-`, and Serial `-` |

**Steps:**

1. Navigate to <inventory bulk upload url>.
2. Upload `<inventory workbook>` and review the copy facts.
3. Confirm the upload and inspect the unit record and source workbook.

**Expected Results:**

* Blank Cert ID remains absent for the `RAW` unit.
* Blank and standalone `-` optional copy facts are absent rather than stored as text.
* One unit is committed and the uploaded workbook remains unchanged.

<!-- trace:case id=g10adm.inventory-catalog.TC-wz7 rev=1 covers=g10adm.inventory-catalog.SC-3ab,g10adm.inventory-catalog.SC-1c7,g10adm.inventory-catalog.SC-crr,g10adm.inventory-catalog.SC-dc8,g10adm.inventory-catalog.SC-bc7,g10adm.inventory-catalog.SC-4hn,g10adm.inventory-catalog.SC-sfn -->
### grade10-admin-inventory-catalog-US73-TC7-1: Cert ID requirements follow grading status

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
* **Trace:** grade10-admin-inventory-catalog-US-73

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* Created products match both uploaded rows.

**Test data:**

| Field | Value |
| --- | --- |
| `<inventory workbook>` | One `RAW` row with Cert ID `RAW-001` and one graded row with issuer `PSA` and no Cert ID |

**Steps:**

1. Navigate to <inventory bulk upload url>.
2. Upload `<inventory workbook>` and review row validation.
3. Attempt to confirm the upload and inspect inventory counts, unit records, and history.

**Expected Results:**

* Validation rejects the RAW row because it has a Cert ID.
* Validation rejects the graded row because it has no Cert ID.
* Neither row changes inventory counts, unit facts, or history.

---

## grade10-admin-inventory-catalog-US74: Inventory admin prepares reusable product media

**As an** inventory admin,
**I want** to attach, order, replace, and remove photographs and video on a catalogue product,
**so that** Auction operators can begin a listing with prepared material.

<!-- trace:case id=g10adm.inventory-catalog.TC-tf3 rev=1 covers=g10adm.inventory-catalog.SC-nmq,g10adm.inventory-catalog.SC-w9x,g10adm.inventory-catalog.SC-hwk,g10adm.inventory-catalog.SC-vz9,g10adm.inventory-catalog.SC-qs1 -->
### grade10-admin-inventory-catalog-US74-TC1-1: Product accepts an ordered reusable gallery

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
* **Trace:** grade10-admin-inventory-catalog-US-74

**Pre-conditions:**

* An admin(inventory admin) is editing a product with no media.

**Steps:**

1. Add supported assets, reorder them, and save the product.

**Expected Results:**

* The product retains the selected order and exposes the assets to Auction.

## Settled

- Product-gallery management uses existing inventory-admin authorization; unauthorized requests are refused.
- **Remarks on a reserve** - Remarks is the entry's own reason, so an admin hold's reserve entry reads `—` (Q17)
- **Holder kind** - read as Auction, Vault or Admin; the stored kind and reference are unchanged (Q16)
- **A corrected-away Cert ID** — once a record is corrected, no record holds its old Cert ID, so the product may give it again; uniqueness reads the Cert IDs records hold now
- **The record's own Cert ID** — refused like any Cert ID a record of the product holds; the record itself counts
- **A Cert ID a sold, withdrawn or vaulted record holds** — refused on a correction and an assignment like any other, and the refusal names that unit and its status; a card that comes back goes through intake, which brings back its record and its history
- **Letter case** — Cert IDs are compared exactly after trimming, so `psa-1243` and `PSA-1243` are different Cert IDs
- **`No Cert ID` as a Cert ID** — refused in any letter case after trimming, on a correction and an assignment
- **Which Cert records change** — only one that is available and that no hold, active or closed, has ever named; a record once held, listed, sold, withdrawn or vaulted keeps its Cert ID, even when it is available again
- **An Auction listing after a correction** — no listing shows a changed Cert ID, since a record that was ever listed or reserved cannot change
- **The available `No Cert ID` row** — shown whenever regular stock has any history, reading 0 when no unit is free; not shown when regular stock has none; a product with no row shows one line saying no unit is on hand
- **Copy facts in Cert ID details** — not shown; the page shows Cert ID, status, holder and quantity; a correction keeps the record's facts, read in the history entry's snapshot, and an assigned record carries none
- **Vaulted regular stock** — not listed, with sold and withdrawn; a vaulted Cert record is listed as Vaulted
- **One regular stock history** — every `No Cert ID` row, available or held, shows the same regular stock history; the Cert ID change that numbered a unit shows there and opens the new record's own history
- **Holder on a hold row** — Auction, Vault or Admin, then the hold's label, else its reference, as the product page reads them
- **A corrected or assigned Cert ID** — the intake rules: required, trimmed and unique on the product, with no pattern, and never `No Cert ID`
- **Copy facts sent with an assignment** — a Grade Issuer, Grade, Autograph Grade or Serial sent from outside the page is ignored, whatever its value, a `RAW` Grade Issuer, a Serial that is not text and an over-long Grade included; the record is created with none and the assignment is not refused for them
- **A unit's history** — the columns of the product's history: When, Action, Quantity, Actor, Holder and Remarks
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

**Run:** Blind pass read the inventory outline, journey, decisions, and marked PRD; it was denied requirements and scenarios.

- **Raised, folded into spec:** CRUD, bounds, validation, reuse, and access for product assets are covered.

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

**Run:** QA2 rerun, 2026-10-02, in a fresh context, after the product manager answered Q13 to Q17, revised Q6 and retired Q10, and Dev revised the scenarios. QA1's blind pass read the Feature set, `user-journeys.md`, `proposal.md`, `decisions.md` with its `## Raised` table empty, the Products and Stock page, the store context and the durable suite with its `## Settled` and without its `## Reconciliation`; it was denied every `## Requirements` section, `openspec/specs/` beyond those, `openspec/changes/archive/`, `tech-design.md` and `tasks.md`. Inventory has no domain suite. QA2 read both readings, `decisions.md` with its answers, `tech-design.md`, `tasks.md`, the durable spec and the Products and Stock page. It is a statement, not proof. No case has been accepted or published, so every rewritten draft keeps `<v>` 1.

- **Agreed** - `grade10-admin-inventory-catalog-US4-TC1-1` with `grade10-admin-inventory-catalog-SC-144`, `grade10-admin-inventory-catalog-SC-145` and `grade10-admin-inventory-catalog-SC-146`, and the unchanged totals of `grade10-admin-inventory-catalog-SC-154` and `grade10-admin-inventory-catalog-SC-159`; `grade10-admin-inventory-catalog-US69-TC3-1` with the durable refusal of a Cert ID the product already owns at intake, `grade10-admin-inventory-catalog-SC-97`, guarding that intake reads the Cert ID a change wrote; `grade10-admin-inventory-catalog-US14-TC2-1` with the requirement's row table, a product with no Cert record whose regular stock has history; `grade10-admin-inventory-catalog-US14-TC3-1` with `grade10-admin-inventory-catalog-SC-152`; `grade10-admin-inventory-catalog-US14-TC5-1` with `grade10-admin-inventory-catalog-SC-149`; `grade10-admin-inventory-catalog-US15-TC6-1` with `grade10-admin-inventory-catalog-SC-165`, its assignment row with the refusal at 0 available regular stock under the lands-whole requirement; `grade10-admin-inventory-catalog-US15-TC7-1` with `grade10-admin-inventory-catalog-SC-164`; `grade10-admin-inventory-catalog-US15-TC9-1` with `grade10-admin-inventory-catalog-SC-163`
- **Rewritten, by QA2** - `grade10-admin-inventory-catalog-US14-TC4-1` for `grade10-admin-inventory-catalog-SC-148`: the available `No Cert ID` row now reads 0 above the hold row where the case read no available row (Q14), and it takes the Cert ID details half of `grade10-admin-inventory-catalog-SC-160`, no assign action and the reason on both rows; `grade10-admin-inventory-catalog-US15-TC1-1` for `grade10-admin-inventory-catalog-SC-154`, `grade10-admin-inventory-catalog-SC-150`, `grade10-admin-inventory-catalog-SC-144` and `grade10-admin-inventory-catalog-SC-146`: an unmoved record in its pre-conditions, the copy facts read at step 5 dropped (Q17), the tagged image read on the product's media, and a row for `grade10-admin-inventory-catalog-SC-169`, a sold record's Cert ID in lower case taken as a different Cert ID (Q13); `grade10-admin-inventory-catalog-US15-TC2-1` for `grade10-admin-inventory-catalog-SC-159`, `grade10-admin-inventory-catalog-SC-151` and `grade10-admin-inventory-catalog-SC-145`: the copy facts read at step 5 dropped (Q17), the new row read as Cert ID, status, holder and quantity, and an Admin hold on regular stock left at 1; `grade10-admin-inventory-catalog-US15-TC3-1` for `grade10-admin-inventory-catalog-SC-155` and `grade10-admin-inventory-catalog-SC-157`: `<cert_b>` sold, the refusal naming the holding unit and its status (Q16), and a `no cert id` row for `grade10-admin-inventory-catalog-SC-168` (Q15); `grade10-admin-inventory-catalog-US15-TC4-1` for the Grade Issuer refusal, since retired, and `grade10-admin-inventory-catalog-SC-162`: `<cert_b>` sold, the refusal naming it and Sold (Q16), and a `NO CERT ID` row for `grade10-admin-inventory-catalog-SC-168` (Q15); `grade10-admin-inventory-catalog-US15-TC5-1` for the Cert ID details halves of `grade10-admin-inventory-catalog-SC-156` and `grade10-admin-inventory-catalog-SC-160`: retitled, and a Released Cert record row for `grade10-admin-inventory-catalog-SC-167` (Q6 as revised); `grade10-admin-inventory-catalog-US14-TC1-1` for `grade10-admin-inventory-catalog-SC-147` and the unlisted sold and withdrawn units of `grade10-admin-inventory-catalog-SC-148`: no copy facts on any row (Q17), and the Available and Reserved rows adding up to stock; the pre-conditions of `grade10-admin-inventory-catalog-US4-TC1-1`, `grade10-admin-inventory-catalog-US15-TC6-1` and `grade10-admin-inventory-catalog-US15-TC7-1` now name an unmoved record (Q6 as revised)
- **Added, by QA2** - `grade10-admin-inventory-catalog-US14-TC6-1` for `grade10-admin-inventory-catalog-SC-170`: a product with Cert records and no regular stock history lists no `No Cert ID` row, and one that never intook stock shows the line saying no unit is on hand (Q14)
- **Deprecated** - `grade10-admin-inventory-catalog-US15-TC8-1`: an ended Unsold listing showing a corrected Cert ID; the rule is gone, since a record once listed or reserved can no longer change (Q6 as revised, Q10 retired), and its released-record set-up is now the Released Cert record row of `grade10-admin-inventory-catalog-US15-TC5-1`
- **Raised, folded into spec** - none: every case reads behaviour a scenario or a requirement table states
- **Raised, rejected** - none
- **Raised, escalated** - the five rows in `decisions.md`'s `## Raised`, each now landed by the product manager: letter case (Q13), the available row at 0 and a product with nothing on hand (Q14), `No Cert ID` as a Cert ID (Q15), a Cert ID a sold, withdrawn or vaulted record holds (Q16), and copy facts in Cert ID details (Q17); each answer is in `## Settled` and in the cases above. No new question
- **Settled by the artifacts, not raised** - the lines in `## Settled` that name no Q
- **Partly out of suite** - the request sent anyway in `grade10-admin-inventory-catalog-SC-156`, `grade10-admin-inventory-catalog-SC-160` and `grade10-admin-inventory-catalog-SC-167`, for a held, sold, released or wholly held unit: decided by the inventory service tests in grade10 (tasks 3.1 and 4.1); a reader's refusal sent outside the page is walked by `grade10-admin-inventory-catalog-US15-TC7-1`. The before and after snapshots of `grade10-admin-inventory-catalog-SC-144` and `grade10-admin-inventory-catalog-SC-145`, and the copy facts a correction keeps in `grade10-admin-inventory-catalog-SC-154` and an assignment sets in `grade10-admin-inventory-catalog-SC-159`: decided by the same tests, which read them in the entry's snapshot; a person sees the Action text and the new row
- **Out of suite** - `grade10-admin-inventory-catalog-SC-153` and `grade10-admin-inventory-catalog-SC-166`, as listed under the title
- **Contradicted** - none
- **Uncovered anchors** - none: `grade10-admin-inventory-catalog-US-04` has one case, `grade10-admin-inventory-catalog-US-69` one, `grade10-admin-inventory-catalog-US-14` six and `grade10-admin-inventory-catalog-US-15` eight live and one deprecated; every scenario from `grade10-admin-inventory-catalog-SC-144` to `grade10-admin-inventory-catalog-SC-170` is reached by a case or listed out of suite; the group `Cert ID details` is walked by every `grade10-admin-inventory-catalog-US-14` and `grade10-admin-inventory-catalog-US-15` case; `Auction presentation`, which `grade10-admin-inventory-catalog-US15-TC8-1` walked, is no longer reached, since no listing shows a changed Cert ID

**Run:** 2026-09-24; the blind inventory suite was reconciled with the independent requirement reading. The suite pass read the outline, journey, proposal, then-current decisions and Raised table, linked Intake PRD, config context, and prior suite for ID continuity. It was denied requirements, durable specs, archive, tech-design, and the other reading's draft. Q10 was settled after the original blind read and is applied here without rerunning it.

| Diff | Disposition |
| --- | --- |
| The original TC2 and its predecessor assumed a Cert record could lack an ID. | Q10 settles that only certified units create Cert records and every Cert has an ID. TC2-2 is deprecated; TC7-1 and SC-129 cover regular stock not being offered as a Cert tag target. |
| The blind pass asked whether a cross-product Cert target is refused or merely hidden. | Q2 limits a tag to a same-product Cert record. SC-130 and TC5 cover refusal and preservation of the current tag; no product question remains. |
| The requirements add an explicit existing-authority refusal and distinguish missing targets from valid retags. | TC5 and TC6 cover the invalid-target and authorization scenarios SC-130 and SC-133. |
| Physical-unit removal is part of the Cert lifecycle. | TC1 v2 covers SC-134's guarded withdrawal and tagged-media deletion; TC2 covers the active-reservation refusal in SC-135. |

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
