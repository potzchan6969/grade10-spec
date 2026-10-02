# grade10-admin/inventory/catalog Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4
**Out of suite:**

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
* `<product_1>` holds `<cert_a>`, an available Cert record no hold, active or closed, has ever named.
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
* `<admin hold>` holds regular stock of `<product_7>`.
* No Cert record of `<product_7>` reads `<new cert>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<regular available>` | 4 units (any count of at least 1) |
| `<admin hold>` | An admin hold of 1 unit of regular stock, active |
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

* Step 4: the assignment is saved.
* Step 5: the available `No Cert ID` row reads `<count after>`.
* Step 5: the row for `<admin hold>` still reads 1.
* Step 5: a new row reads `<new cert>`, Available, `—`, 1.
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
| `<cert_b>` | `BGS-90000002`, a sold Cert record of `<product_9>` |

| Row | Cert ID | Grade Issuer | Refusal names |
| --- | --- | --- | --- |
| Cert ID missing | none | `BGS` | no unit |
| `No Cert ID` in upper case | `NO CERT ID` | `BGS` | no unit |
| Grade Issuer missing | `BGS-90000001` | none | no unit |
| Grade Issuer `RAW` | `BGS-90000001` | `RAW` | no unit |
| Cert ID used on the product | `BGS-90000002` | `BGS` | `<cert_b>`, Sold |

**Steps:**

1. Click View Cert IDs.
2. Open the assign action on the available `No Cert ID` row.
3. Enter the row's Cert ID and Grade Issuer.
4. Save.
5. Read the rows and the product history.

**Expected Results:**

* Step 4: the assignment is refused.
* Step 4: where the row's Refusal names a unit, the refusal names its Cert ID and status.
* Step 5: the available `No Cert ID` row still reads `<regular available>`.
* Step 5: no new Cert record row is listed.
* Step 5: no `Cert ID change` entry was added.

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-70

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-70

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-71

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-71

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
- **Copy facts in Cert ID details** — not shown; the page shows Cert ID, status, holder and quantity, and the facts a correction keeps and an assignment sets are read in the history entry's snapshot
- **Vaulted regular stock** — not listed, with sold and withdrawn; a vaulted Cert record is listed as Vaulted
- **One regular stock history** — every `No Cert ID` row, available or held, shows the same regular stock history; the Cert ID change that numbered a unit shows there and opens the new record's own history
- **Holder on a hold row** — Auction, Vault or Admin, then the hold's label, else its reference, as the product page reads them
- **A corrected or assigned Cert ID** — the intake rules: required, trimmed and unique on the product, with no pattern, and never `No Cert ID`; an assignment's Grade Issuer is never `RAW`
- **A unit's history** — the columns of the product's history: When, Action, Quantity, Actor, Holder and Remarks

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
- **Rewritten, by QA2** - `grade10-admin-inventory-catalog-US14-TC4-1` for `grade10-admin-inventory-catalog-SC-148`: the available `No Cert ID` row now reads 0 above the hold row where the case read no available row (Q14), and it takes the Cert ID details half of `grade10-admin-inventory-catalog-SC-160`, no assign action and the reason on both rows; `grade10-admin-inventory-catalog-US15-TC1-1` for `grade10-admin-inventory-catalog-SC-154`, `grade10-admin-inventory-catalog-SC-150`, `grade10-admin-inventory-catalog-SC-144` and `grade10-admin-inventory-catalog-SC-146`: an unmoved record in its pre-conditions, the copy facts read at step 5 dropped (Q17), the tagged image read on the product's media, and a row for `grade10-admin-inventory-catalog-SC-169`, a sold record's Cert ID in lower case taken as a different Cert ID (Q13); `grade10-admin-inventory-catalog-US15-TC2-1` for `grade10-admin-inventory-catalog-SC-159`, `grade10-admin-inventory-catalog-SC-151` and `grade10-admin-inventory-catalog-SC-145`: the copy facts read at step 5 dropped (Q17), the new row read as Cert ID, status, holder and quantity, and an Admin hold on regular stock left at 1; `grade10-admin-inventory-catalog-US15-TC3-1` for `grade10-admin-inventory-catalog-SC-155` and `grade10-admin-inventory-catalog-SC-157`: `<cert_b>` sold, the refusal naming the holding unit and its status (Q16), and a `no cert id` row for `grade10-admin-inventory-catalog-SC-168` (Q15); `grade10-admin-inventory-catalog-US15-TC4-1` for `grade10-admin-inventory-catalog-SC-161` and `grade10-admin-inventory-catalog-SC-162`: `<cert_b>` sold, the refusal naming it and Sold (Q16), and a `NO CERT ID` row for `grade10-admin-inventory-catalog-SC-168` (Q15); `grade10-admin-inventory-catalog-US15-TC5-1` for the Cert ID details halves of `grade10-admin-inventory-catalog-SC-156` and `grade10-admin-inventory-catalog-SC-160`: retitled, and a Released Cert record row for `grade10-admin-inventory-catalog-SC-167` (Q6 as revised); `grade10-admin-inventory-catalog-US14-TC1-1` for `grade10-admin-inventory-catalog-SC-147` and the unlisted sold and withdrawn units of `grade10-admin-inventory-catalog-SC-148`: no copy facts on any row (Q17), and the Available and Reserved rows adding up to stock; the pre-conditions of `grade10-admin-inventory-catalog-US4-TC1-1`, `grade10-admin-inventory-catalog-US15-TC6-1` and `grade10-admin-inventory-catalog-US15-TC7-1` now name an unmoved record (Q6 as revised)
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
