# grade10-admin/auction/internal-bid Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-07, tcs-rules r4

## Background

* Every listing below is an HKD listing in no campaign, starting price `<starting price>`, extension duration 1800s (30mins) and no cap, unless its row says otherwise.
* HKD increments follow the Bidding page's schedule: HK$80 (8000 minor units) from HK$4,000 and HK$200 (20000 minor units) from HK$8,000.
* Amounts are integer minor units of the listing's currency; HKD has two decimals, so 400000 minor units read HK$4,000.00.
* customer A and customer B are collectors with a linked card, signed in on separate sessions; a maximum is entered in the custom maximum on the bid panel.

| Field | Value |
| --- | --- |
| `<starting price>` | 400000 minor units (HK$4,000.00) |

## grade10-admin-auction-internal-bid-US1: Admin protects a lot with an internal bid at a set time

**As an** auction admin,
**I want** to set a hidden house maximum on a listing and the time Grade10 commits it,
**so that** the lot cannot sell below what the house will accept, without a high starting price putting early bidders off.

### grade10-admin-auction-internal-bid-US1-TC1-1: At its time the internal bid is committed and resolved like a maximum

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
* **Trace:** grade10-admin-auction-internal-bid-US-01

**Pre-conditions:**

* `<listing_1>` is published and taking bids, its scheduled close more than an hour away.
* The bidding on `<listing_1>` is as the row states.
* admin(holds auction:reserve) is on `<listing_1>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A published HKD listing taking bids, with no internal bid |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<commit time>` | 10 minutes from now (any time after now and before the scheduled close) |

| Row | Bidding before `<commit time>` | Leader after `<commit time>` | Highest bid after `<commit time>` |
| --- | --- | --- | --- |
| No bids | None | The house | `<starting price>`, the first maximum standing on the starting price |
| House higher | customer A leads at `<starting price>` with maximum 500000 | The house | 508000: customer A's maximum plus its 8000 increment |
| Collector higher | customer A leads at `<starting price>` with maximum 700000 | customer A | 608000: `<house maximum>` plus its 8000 increment |

**Steps:**

1. In the Internal bid section, enter `<house maximum>` and `<commit time>`.
2. Click Save.
3. Read the Internal bid section.
4. Wait until `<commit time>` passes, taking no action.
5. Reload `<listing_1>`'s editor and read the Internal bid section.
6. As customer B, open the lot page for `<listing_1>` and read Highest bid and Recent bids.

**Expected Results:**

* Step 3 shows `<house maximum>` and `<commit time>`, not yet committed.
* Step 5 shows the internal bid committed at `<commit time>`.
* Step 6: Highest bid reads the row's highest bid; the leader is the row's leader.
* Step 6: every house row in Recent bids carries one listing pseudonym, as a collector's does, and nothing names the house.

### grade10-admin-auction-internal-bid-US1-TC2-1: Commit time at the limits of the window is accepted

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-auction-internal-bid-US-01

**Pre-conditions:**

* `<listing_2>` is published as the row states, with no internal bid.
* admin(holds auction:reserve) is on `<listing_2>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | A published HKD listing, scheduled start `<start>` and scheduled close `<scheduled close>` |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<extension duration>` | 1800s (30mins) |

| Row | `<listing_2>` before the commit | `<commit time>` | After the commit |
| --- | --- | --- | --- |
| At the start | Upcoming, `<start>` 15 minutes away, no bids | Exactly `<start>` | The house leads at `<starting price>` from `<start>` |
| At the scheduled close | Taking bids, customer A leads at `<starting price>` with maximum 500000, `<scheduled close>` 15 minutes away | Exactly `<scheduled close>` | The house leads at 508000, and the lot is in extended bidding with its close `<extension duration>` after `<scheduled close>` |

**Steps:**

1. In the Internal bid section, enter `<house maximum>` and the row's `<commit time>`.
2. Click Save.
3. Wait until the row's `<commit time>` passes.
4. Read the Internal bid section.
5. As customer B, open the lot page for `<listing_2>` and read Highest bid and Time left.

**Expected Results:**

* Step 2 saves the internal bid; no refusal.
* Step 4 shows the internal bid committed at the row's `<commit time>`.
* Step 5 reads the row's outcome.

### grade10-admin-auction-internal-bid-US1-TC3-1: A commit time outside the window or a missing value is refused

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
* **Trace:** grade10-admin-auction-internal-bid-US-01

**Pre-conditions:**

* `<listing_3>` is published and Upcoming, with no internal bid.
* admin(holds auction:reserve) is on `<listing_3>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | A published HKD listing, scheduled start `<start>` an hour away, scheduled close `<scheduled close>` a day later |

| Row | Amount | Commit time |
| --- | --- | --- |
| Before the start | 600000 minor units | 1 minute before `<start>` |
| After the scheduled close | 600000 minor units | 1 minute after `<scheduled close>` |
| No time | 600000 minor units | Empty |
| No amount | Empty | 30 minutes after `<start>` |

**Steps:**

1. In the Internal bid section, enter the row's amount and commit time.
2. Click Save.
3. Reload `<listing_3>`'s editor and read the Internal bid section.

**Expected Results:**

* Step 2 is refused, and says which value is wrong.
* Step 3 shows no internal bid on `<listing_3>`.

### grade10-admin-auction-internal-bid-US1-TC4-1: Before its time the house is not in the bidding

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
* **Trace:** grade10-admin-auction-internal-bid-US-01

**Pre-conditions:**

* `<listing_4>` is published, taking bids, with no bids yet.
* `<listing_4>` has an internal bid of `<house maximum>` whose `<commit time>` is still ahead.
* customer A is on the lot page for `<listing_4>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | A published HKD listing taking bids, scheduled close a day away |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<commit time>` | 2 hours from now |
| `<customer A maximum>` | 450000 minor units, below `<house maximum>` |

**Steps:**

1. As customer A, read Highest bid and the next minimum on the bid panel.
2. As customer A, commit `<customer A maximum>`.
3. Read Highest bid, the leader and Recent bids.

**Expected Results:**

* Step 1 shows `<starting price>` as the next minimum, with No bids yet.
* Step 2 is accepted; customer A reads Leading.
* Step 3: Highest bid reads `<starting price>`, the first maximum on the starting price.
* Step 3: Recent bids holds customer A's row only.

### grade10-admin-auction-internal-bid-US1-TC5-1: An internal bid is refused on a closed or called-off listing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-internal-bid-US-01

**Pre-conditions:**

* `<listing_5>` is in the row's state, with no internal bid.
* admin(holds auction:reserve) is signed in to the admin.

**Test data:**

| Field | Value |
| --- | --- |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |

| Row | `<listing_5>` |
| --- | --- |
| Closed | Closed Unsold after its close |
| Canceled | Called off before its close |

**Steps:**

1. Set an internal bid of `<house maximum>` on `<listing_5>`, with a commit time 10 minutes from now.
2. Read the API response.
3. Read `<listing_5>`'s internal bid.

**Expected Results:**

* Step 2 refuses the write.
* Step 3: `<listing_5>` holds no internal bid.

### grade10-admin-auction-internal-bid-US1-TC6-1: An internal bid at the currency ceiling is committed

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
* **Trace:** grade10-admin-auction-internal-bid-US-01

**Pre-conditions:**

* `<listing_6>` is published, taking bids, led by customer A at `<starting price>` with maximum `<customer A maximum>`.
* admin(holds auction:reserve) is on `<listing_6>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | A published HKD listing taking bids, scheduled close a day away |
| `<ceiling>` | 8000000000 minor units (HKD 80,000,000.00), the HKD ceiling |
| `<customer A maximum>` | 500000 minor units (HK$5,000.00) |
| `<commit time>` | 10 minutes from now |

**Steps:**

1. In the Internal bid section, enter `<ceiling>` and `<commit time>`.
2. Click Save.
3. Wait until `<commit time>` passes.
4. As customer B, open the lot page for `<listing_6>` and read Highest bid.
5. As customer B, enter one major unit above `<ceiling>` in the custom maximum and confirm.

**Expected Results:**

* Step 2 saves the internal bid.
* Step 4: the house leads at `<customer A maximum>` plus its increment, 508000 minor units.
* Step 5 is refused at the ceiling; the house still leads.

### grade10-admin-auction-internal-bid-US1-TC7-1: The amount is held in minor units of the listing's currency

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-internal-bid-US-01

**Pre-conditions:**

* `<listing_25>` is published in the row's currency, with no internal bid.
* admin(holds auction:reserve) is signed in to the admin.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_25>` | A published listing in the row's currency, scheduled close a day away |

| Row | Currency | Amount entered | Read back |
| --- | --- | --- | --- |
| HKD | HKD | HK$6,000.00 | 600000 minor units, HKD |
| USD | USD | $750.00 | 75000 minor units, USD |
| JPY | JPY | ¥80,000 | 80000 minor units, JPY, no decimals |

**Steps:**

1. Set an internal bid of the row's amount on `<listing_25>`, its time an hour ahead.
2. Read `<listing_25>`'s internal bid from the API.
3. Open `<listing_25>`'s editor and read the Internal bid section.

**Expected Results:**

* Step 2 reads the row's integer minor units with the row's ISO 4217 code.
* Step 3 shows the amount as a formatted decimal in the row's currency.

---

## grade10-admin-auction-internal-bid-US2: Admin changes an internal bid before its time

**As an** auction admin,
**I want** to change or remove the amount and the time until the internal bid is committed,
**so that** I can react to the market before the house has bid at all.

### grade10-admin-auction-internal-bid-US2-TC1-1: A changed amount and time commit as changed

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
* **Trace:** grade10-admin-auction-internal-bid-US-02

**Pre-conditions:**

* `<listing_7>` is published, taking bids, led by customer A at `<starting price>` with maximum `<customer A maximum>`.
* `<listing_7>` has an internal bid of `<first amount>` at `<first time>`, still ahead.
* admin(holds auction:reserve) is on `<listing_7>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_7>` | A published HKD listing taking bids, scheduled close a day away |
| `<customer A maximum>` | 500000 minor units (HK$5,000.00) |
| `<first amount>` | 700000 minor units (HK$7,000.00) |
| `<first time>` | 10 minutes from now |
| `<second amount>` | 550000 minor units (HK$5,500.00), lower than `<first amount>` |
| `<second time>` | 30 minutes from now |
| `<price after commit>` | 508000 minor units: `<customer A maximum>` plus its 8000 increment |

**Steps:**

1. In the Internal bid section, change the amount to `<second amount>` and the time to `<second time>`.
2. Click Save.
3. Wait until `<first time>` passes and read the lot page for `<listing_7>` as customer B.
4. Wait until `<second time>` passes and read the lot page again.
5. Read the Internal bid section.

**Expected Results:**

* Step 2 saves both changes.
* Step 3: customer A still leads at `<starting price>`; Recent bids holds no new row.
* Step 4: the house leads at `<price after commit>`.
* Step 5 shows `<second amount>` committed at `<second time>`.

### grade10-admin-auction-internal-bid-US2-TC2-1: A removed internal bid never commits

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-02

**Pre-conditions:**

* `<listing_8>` is published, taking bids, led by customer A at `<starting price>`.
* `<listing_8>` has an internal bid of `<house maximum>` at `<commit time>`, still ahead.
* admin(holds auction:reserve) is on `<listing_8>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | A published HKD listing taking bids, scheduled close a day away |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<commit time>` | 10 minutes from now |

**Steps:**

1. Remove the internal bid from the Internal bid section.
2. Click Save.
3. Wait until `<commit time>` passes.
4. Reload the editor and read the Internal bid section.
5. As customer B, read Highest bid and Recent bids on the lot page for `<listing_8>`.

**Expected Results:**

* Step 2 saves the removal.
* Step 4 shows no internal bid.
* Step 5: customer A still leads at `<starting price>`; Recent bids holds no new row.

### grade10-admin-auction-internal-bid-US2-TC3-1: A changed time outside the window is refused

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
* **Trace:** grade10-admin-auction-internal-bid-US-02

**Pre-conditions:**

* `<listing_9>` is published and Upcoming, with an internal bid of `<house maximum>` at `<commit time>`.
* admin(holds auction:reserve) is on `<listing_9>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_9>` | A published HKD listing, scheduled start `<start>` an hour away, scheduled close `<scheduled close>` a day later |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<commit time>` | 30 minutes after `<start>` |

| Row | New commit time |
| --- | --- |
| Before the start | 1 minute before `<start>` |
| After the scheduled close | 1 minute after `<scheduled close>` |
| Cleared | Empty, amount kept |

**Steps:**

1. In the Internal bid section, change the time to the row's new commit time.
2. Click Save.
3. Reload the editor and read the Internal bid section.

**Expected Results:**

* Step 2 is refused, and says the time is wrong.
* Step 3 still shows `<house maximum>` at `<commit time>`.

### grade10-admin-auction-internal-bid-US2-TC4-1: Calling off the listing drops its internal bid

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
* **Trace:** grade10-admin-auction-internal-bid-US-02

**Pre-conditions:**

* `<listing_10>` is published, taking bids, led by customer A at `<starting price>`.
* `<listing_10>` has an internal bid of `<house maximum>` at `<commit time>`, still ahead.
* admin(holds auction:reserve) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_10>` | A published HKD listing taking bids, in no campaign |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<commit time>` | 10 minutes from now |

**Steps:**

1. Call off `<listing_10>`.
2. Wait until `<commit time>` passes.
3. Open `<listing_10>` and read the Internal bid section.

**Expected Results:**

* Step 1: `<listing_10>` reads Canceled.
* Step 3: no house bid was placed at `<commit time>`, and no internal bid is held for `<listing_10>`.

---

## grade10-admin-auction-internal-bid-US3: Admin raises a committed internal bid

**As an** auction admin,
**I want** to raise the house maximum any time the lot still takes a bid,
**so that** I can keep protecting a lot that is running hotter than expected.

### grade10-admin-auction-internal-bid-US3-TC1-1: A raise while outbid resolves as a new commitment

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-03

**Pre-conditions:**

* `<listing_11>` is published and taking bids, its internal bid of `<house maximum>` committed.
* customer A leads `<listing_11>` at `<current bid>` with maximum `<customer A maximum>`, committed before the house.
* admin(holds auction:reserve) is on `<listing_11>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_11>` | A published HKD listing taking bids, scheduled close a day away |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<customer A maximum>` | 700000 minor units (HK$7,000.00) |
| `<current bid>` | 608000 minor units: `<house maximum>` plus its 8000 increment |
| `<next minimum>` | 616000 minor units: `<current bid>` plus its 8000 increment |

| Row | New amount | Leader | Highest bid |
| --- | --- | --- | --- |
| At the next minimum | `<next minimum>`, 616000 | customer A | 624000: the new amount plus its 8000 increment |
| Equal to customer A | 700000, `<customer A maximum>` | customer A, the earlier maximum | 700000 |
| Above customer A | 750000 | The house | 708000: `<customer A maximum>` plus its 8000 increment |
| At the ceiling | 8000000000 (HKD 80,000,000.00) | The house | 708000: `<customer A maximum>` plus its 8000 increment |

**Steps:**

1. In the Internal bid section, change the amount to the row's new amount.
2. Click Save.
3. As customer A, read Highest bid, the standing and Recent bids on the lot page for `<listing_11>`.

**Expected Results:**

* Step 2 is accepted at once.
* Step 3: Highest bid and the leader read the row's values.
* Step 3: Recent bids gains the house's new bid under its listing pseudonym.

### grade10-admin-auction-internal-bid-US3-TC2-1: A raise while leading moves neither the price nor the leader

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
* **Trace:** grade10-admin-auction-internal-bid-US-03

**Pre-conditions:**

* `<listing_12>` is published and taking bids, its internal bid of `<house maximum>` committed.
* The house leads `<listing_12>` at `<current bid>`; customer A's maximum is `<customer A maximum>`.
* admin(holds auction:reserve) is on `<listing_12>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_12>` | A published HKD listing taking bids, scheduled close a day away |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<customer A maximum>` | 500000 minor units (HK$5,000.00) |
| `<current bid>` | 508000 minor units: `<customer A maximum>` plus its 8000 increment |
| `<raised maximum>` | 750000 minor units (HK$7,500.00) |
| `<customer B maximum>` | 700000 minor units, above `<house maximum>` and below `<raised maximum>` |
| `<price after customer B>` | 708000 minor units: `<customer B maximum>` plus its 8000 increment |

**Steps:**

1. In the Internal bid section, change the amount to `<raised maximum>`.
2. Click Save.
3. As customer A, read Highest bid and Recent bids on the lot page for `<listing_12>`.
4. As customer B, commit `<customer B maximum>`.
5. Read Highest bid and the leader.

**Expected Results:**

* Step 2 is accepted.
* Step 3: Highest bid still reads `<current bid>`; Recent bids gains no row.
* Step 5: the house still leads, at `<price after customer B>`.

### grade10-admin-auction-internal-bid-US3-TC3-1: A raise at or after the close is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-internal-bid-US-03

**Pre-conditions:**

* `<listing_13>` had its internal bid of `<house maximum>` committed, and customer A led it with maximum `<customer A maximum>`.
* admin(holds auction:reserve) is signed in to the admin.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_13>` | An HKD listing in extended bidding, its recorded close `<effective close>` |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<customer A maximum>` | 700000 minor units (HK$7,000.00) |
| `<raised maximum>` | 900000 minor units (HK$9,000.00) |

| Row | Raise sent at |
| --- | --- |
| At the close | Exactly `<effective close>` |
| After the close | 1 minute after `<effective close>` |

**Steps:**

1. Raise `<listing_13>`'s internal bid to `<raised maximum>`, sent at the row's time.
2. Read the API response.
3. Read `<listing_13>`'s result and the internal bid.

**Expected Results:**

* Step 2 refuses the raise.
* Step 3: customer A won `<listing_13>`, and the internal bid still reads `<house maximum>`.

### grade10-admin-auction-internal-bid-US3-TC4-1: The commit time is fixed once committed

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
* **Trace:** grade10-admin-auction-internal-bid-US-03

**Pre-conditions:**

* `<listing_14>` is published and taking bids, its internal bid of `<house maximum>` committed at `<commit time>`.
* admin(holds auction:reserve) is on `<listing_14>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_14>` | A published HKD listing taking bids, scheduled close a day away |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<commit time>` | 10 minutes ago |
| `<new time>` | 2 hours from now, inside the window |

**Steps:**

1. In the Internal bid section, change the time to `<new time>`.
2. Click Save.
3. Reload the editor and read the Internal bid section.

**Expected Results:**

* Step 2 stores no new time.
* Step 3 still shows `<house maximum>` committed at `<commit time>`.

---

## grade10-admin-auction-internal-bid-US4: Admin lowers a committed internal bid without moving the lead

**As an** auction admin,
**I want** to lower the house maximum when the leader and the current bid stay as they are,
**so that** I can loosen the protection without changing anything a collector has already seen.

### grade10-admin-auction-internal-bid-US4-TC1-1: A lower that keeps the leader and the current bid is accepted

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-04

**Pre-conditions:**

* `<listing_15>` is published and taking bids, its internal bid of `<house maximum>` committed.
* The house leads `<listing_15>` at `<current bid>`, over customer A's maximum `<customer A maximum>`.
* admin(holds auction:reserve) is on `<listing_15>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_15>` | A published HKD listing taking bids, scheduled close a day away |
| `<house maximum>` | 700000 minor units (HK$7,000.00) |
| `<customer A maximum>` | 550000 minor units (HK$5,500.00) |
| `<current bid>` | 558000 minor units: `<customer A maximum>` plus its 8000 increment, the house's own placed bid |
| `<probe maximum>` | 650000 minor units, above every row's lowered amount and below `<house maximum>` |

| Row | `<lowered amount>` | Customer B after `<probe maximum>` |
| --- | --- | --- |
| Between | 600000 minor units | Leads at 608000: `<lowered amount>` plus its 8000 increment |
| Exactly the current bid | 558000 minor units, `<current bid>` | Leads at 566000: `<lowered amount>` plus its 8000 increment |

**Steps:**

1. In the Internal bid section, change the amount to the row's `<lowered amount>`.
2. Click Save.
3. As customer A, read Highest bid, the standing and Recent bids on the lot page for `<listing_15>`.
4. As customer B, commit `<probe maximum>`.
5. Read Highest bid and the leader.

**Expected Results:**

* Step 2 is accepted.
* Step 3: Highest bid still reads `<current bid>`; customer A still reads Outbid; Recent bids gains no row.
* Step 5 reads the row's outcome for customer B.

### grade10-admin-auction-internal-bid-US4-TC2-1: A lower that would move the lead or the price is refused

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
* **Trace:** grade10-admin-auction-internal-bid-US-04

**Pre-conditions:**

* `<listing_16>` is published and taking bids, its internal bid of `<house maximum>` committed.
* The bidding on `<listing_16>` is as the row states.
* admin(holds auction:reserve) is on `<listing_16>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_16>` | A published HKD listing taking bids, scheduled close a day away |
| `<house maximum>` | 700000 minor units (HK$7,000.00) |

| Row | Bidding | `<current bid>` | `<lowered amount>` |
| --- | --- | --- | --- |
| House leads, one unit below the current bid | The house leads over customer A's maximum of 550000 | 558000 | 557900, one major unit below `<current bid>` |
| House leads at its own maximum | The house leads over customer A's maximum of 695000, the price capped at `<house maximum>` | 700000 | 699900, one major unit below |
| House second, setting the price | customer A leads with maximum 800000 | 708000: `<house maximum>` plus its 8000 increment | 650000 |
| House third | customer A leads with maximum 900000; customer B's maximum is 800000 | 820000: customer B's maximum plus its 20000 increment | 650000 |

**Steps:**

1. In the Internal bid section, change the amount to the row's `<lowered amount>`.
2. Click Save.
3. Reload the editor and read the Internal bid section.
4. As customer B, read Highest bid, the leader and Recent bids on the lot page for `<listing_16>`.

**Expected Results:**

* Step 2 is refused, and says the lower would move the lead or the price.
* Step 3 still shows `<house maximum>`.
* Step 4: Highest bid still reads `<current bid>`; the leader and Recent bids are unchanged.

### grade10-admin-auction-internal-bid-US4-TC3-1: A lower at or after the close is refused

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
* **Trace:** grade10-admin-auction-internal-bid-US-04

**Pre-conditions:**

* `<listing_17>` closed with the house leading at `<current bid>` under its internal bid of `<house maximum>`.
* admin(holds auction:reserve) is signed in to the admin.

**Test data:**

| Field | Value |
| --- | --- |
| `<house maximum>` | 700000 minor units (HK$7,000.00) |
| `<current bid>` | 558000 minor units |
| `<lowered amount>` | 600000 minor units, above `<current bid>` |

**Steps:**

1. Lower `<listing_17>`'s internal bid to `<lowered amount>`.
2. Read the API response.
3. Read `<listing_17>`'s internal bid.

**Expected Results:**

* Step 2 refuses the lower.
* Step 3 still reads `<house maximum>`.

---

## grade10-admin-auction-internal-bid-US5: Admin learns an internal bid came too late

**As an** auction admin,
**I want** to see that an internal bid was not placed because the price had already passed it,
**so that** I can raise it or let the lot sell.

### grade10-admin-auction-internal-bid-US5-TC1-1: Placed at the next minimum, not placed one unit below it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-05

**Pre-conditions:**

* `<listing_18>` is published and taking bids, bid on as the row states.
* `<listing_18>` has an internal bid of the row's amount at `<commit time>`, still ahead.
* admin(holds auction:reserve) is on `<listing_18>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_18>` | A published HKD listing taking bids, scheduled close a day away |
| `<commit time>` | 10 minutes from now |

| Row | Bidding at `<commit time>` | Next minimum | Internal bid | Outcome |
| --- | --- | --- | --- | --- |
| One unit short | customer A leads at 600000 with maximum 700000 | 608000 | 607900 | Not placed; customer A leads at 600000 |
| At the next minimum | customer A leads at 600000 with maximum 700000 | 608000 | 608000 | Placed; customer A leads at 616000, the internal bid plus its 8000 increment |
| Below the starting price | No bids | `<starting price>` | 399900 | Not placed; no bids |
| At the starting price | No bids | `<starting price>` | 400000 | Placed; the house leads at `<starting price>` |

**Steps:**

1. Wait until `<commit time>` passes.
2. Reload the editor and read the Internal bid section.
3. As customer B, read Highest bid, the leader and Recent bids on the lot page for `<listing_18>`.

**Expected Results:**

* Step 2: a placed internal bid shows committed; a short one shows not placed.
* Step 3 reads the row's outcome.
* Step 3: after a not-placed row, Recent bids gains no row and nothing tells a collector of it.

### grade10-admin-auction-internal-bid-US5-TC2-1: Raising a not-placed internal bid places it at once

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
* **Trace:** grade10-admin-auction-internal-bid-US-05

**Pre-conditions:**

* `<listing_19>` is published and taking bids, led by customer A at `<current bid>` with maximum `<customer A maximum>`.
* `<listing_19>`'s internal bid of `<short amount>` was not placed at its time.
* admin(holds auction:reserve) is on `<listing_19>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_19>` | A published HKD listing taking bids, scheduled close a day away |
| `<customer A maximum>` | 700000 minor units (HK$7,000.00) |
| `<current bid>` | 600000 minor units |
| `<short amount>` | 550000 minor units, below `<current bid>` |
| `<raised amount>` | 800000 minor units, above `<customer A maximum>` |
| `<price after raise>` | 708000 minor units: `<customer A maximum>` plus its 8000 increment |

**Steps:**

1. In the Internal bid section, change the amount to `<raised amount>`.
2. Click Save.
3. Read the Internal bid section.
4. As customer A, read Highest bid and the standing on the lot page for `<listing_19>`.

**Expected Results:**

* Step 2 is accepted, though the commit time has passed.
* Step 3 shows the internal bid placed.
* Step 4: the house leads at `<price after raise>`; customer A reads Outbid.

### grade10-admin-auction-internal-bid-US5-TC3-1: A not-placed internal bid lets the lot sell to the collector

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
* **Trace:** grade10-admin-auction-internal-bid-US-05

**Pre-conditions:**

* `<listing_20>` is led by customer A at `<final price>`, its close a few minutes away, no further bid coming.
* `<listing_20>`'s internal bid of `<short amount>` was not placed at its time and was never raised.
* admin(holds auction:reserve) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_20>` | A published HKD listing in no campaign |
| `<final price>` | 600000 minor units |
| `<short amount>` | 550000 minor units, below `<final price>` |

**Steps:**

1. Wait until `<listing_20>`'s close passes.
2. Read `<listing_20>`'s row in the Listings table.
3. Open Orders and search for `<listing_20>`'s listing code.

**Expected Results:**

* Step 2: the row does not read Bought in and offers no Relist.
* Step 3 finds customer A's order for `<listing_20>`, at winning bid `<final price>`.

---

## grade10-admin-auction-internal-bid-US6: Admin reads a lot the house bought in

**As an** auction admin,
**I want** a lot the house won to read Bought in, with no order and its stock released,
**so that** I can tell it from a sale and from a lot nobody bid on, and decide what to do with the card.

### grade10-admin-auction-internal-bid-US6-TC1-1: A house win opens no order, a collector win over the house does

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-06

**Pre-conditions:**

* `<listing_21>`'s internal bid of `<house maximum>` is committed, and the bidding is as the row states, its close a few minutes away, no further bid coming.
* admin(holds auction:reserve and auction:payment) is on `<grade10 auction admin orders url>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_21>` | A published HKD listing in no campaign |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |

| Row | Leader at the close | Orders after the close |
| --- | --- | --- |
| House wins | The house, at 508000 over customer A's maximum of 500000 | No order for `<listing_21>` in any segment |
| Collector beats the house | customer A, at 608000 with maximum 700000 | customer A's order, winning bid 608000 |

**Steps:**

1. Wait until `<listing_21>`'s close passes.
2. Select All and search for `<listing_21>`'s listing code.
3. As customer A, open `<grade10 my auctions url>` and read `<listing_21>`'s row.

**Expected Results:**

* Step 2 reads the row's Orders outcome.
* Step 3: in the House wins row, customer A reads Didn't win, card not charged; in the other, Won with View order.

---

## grade10-admin-auction-internal-bid-US7: Admin keeps protected lots secret from staff

**As an** auction admin,
**I want** operators without secret-floor access never to see an internal bid or learn that a lot has one,
**so that** the house's floor stays known only to those allowed to set it.

### grade10-admin-auction-internal-bid-US7-TC1-1: Staff without secret-floor access see no internal bid

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-07

**Pre-conditions:**

* `<listing_22>` is published and taking bids, with an internal bid in the row's state.
* `<listing_23>` is published and taking bids, with no internal bid.
* The row's admin, without auction:reserve, is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_22>` | A published HKD listing with an internal bid of 600000 minor units |
| `<listing_23>` | A published HKD listing like `<listing_22>`, with no internal bid |

| Row | admin | `<listing_22>`'s internal bid |
| --- | --- | --- |
| Staff, before its time | admin(staff, holds auction:operate) | Set, its time ahead |
| Staff, committed | admin(staff, holds auction:operate) | Committed, the house leading |
| Finance, committed | admin(finance, holds auction:read) | Committed, the house leading |

**Steps:**

1. Read `<listing_22>`'s and `<listing_23>`'s rows in the Listings table.
2. Open `<listing_22>`.
3. Open `<listing_23>`.

**Expected Results:**

* Step 1: the two rows differ in nothing an internal bid would explain.
* Step 2 shows no Internal bid section and no amount, time or state of one.
* Step 2 and step 3 read alike: nothing tells `<listing_22>` is protected.

### grade10-admin-auction-internal-bid-US7-TC2-1: The API refuses every internal bid read and write without secret-floor access

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
* **Trace:** grade10-admin-auction-internal-bid-US-07

**Pre-conditions:**

* `<listing_22>` is published, with an internal bid of `<house maximum>` at a time still ahead.
* `<listing_23>` is published, with no internal bid.
* admin(staff, holds auction:operate and auction:write, not auction:reserve) is signed in to the admin.

**Test data:**

| Field | Value |
| --- | --- |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |

| Row | Call |
| --- | --- |
| Read | Read the internal bid |
| Set | Set an internal bid of 500000 minor units, its time an hour ahead |
| Change | Change the amount to 900000 minor units |
| Remove | Remove the internal bid |

**Steps:**

1. Send the row's call for `<listing_22>`.
2. Send the row's call for `<listing_23>`.
3. Read both API responses.
4. As admin(holds auction:reserve), read both listings' internal bids.

**Expected Results:**

* Step 3: both calls are refused for the missing access, with the same answer for both listings.
* Step 4: `<listing_22>` still holds `<house maximum>` at its time; `<listing_23>` holds none.

### grade10-admin-auction-internal-bid-US7-TC3-1: The audit trail records an internal bid set, never its amount

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-07

**Pre-conditions:**

* `<listing_24>` is published, with no internal bid.
* admin(holds auction:reserve) is on `<listing_24>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_24>` | A published HKD listing, scheduled close a day away |
| `<house maximum>` | 612300 minor units (HK$6,123.00), an amount no other entry carries |
| `<commit time>` | 2 hours from now |

**Steps:**

1. In the Internal bid section, enter `<house maximum>` and `<commit time>`.
2. Click Save.
3. Open `<grade10 audit trail url>` and find the newest entry for `<listing_24>`.

**Expected Results:**

* Step 3 shows one entry recording that an internal bid was set on `<listing_24>`, by the admin, at Grade10's time.
* Step 3: no entry shows `<house maximum>` in any form, 612300 or 6,123.
