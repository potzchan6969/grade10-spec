# grade10-admin/auction/internal-bid Test Cases

**Status:** pending-review · 0/62
**Drafts styled:** 2026-10-08, tcs-rules r4

## Background

* Every listing below is an HKD listing in no campaign, starting price `<starting price>`, extension duration 1800s (30mins) and no cap, unless its row says otherwise.
* HKD increments follow the Bidding page's schedule: HK$80 (8000 minor units) from HK$4,000 and HK$200 (20000 minor units) from HK$8,000.
* Amounts are integer minor units of the listing's currency; HKD has two decimals, so 400000 minor units read HK$4,000.00. An admin enters an internal bid in whole major units, as the custom maximum takes them.
* customer A and customer B are collectors with a linked card, signed in on separate sessions; a maximum is entered in the custom maximum on the bid panel.
* `<internal bidder>` is an active internal bidder profile in auction admin. Every internal bid below bids as `<internal bidder>`, picked in the Internal bid section before Save, unless its case names another profile.

| Field | Value |
| --- | --- |
| `<starting price>` | 400000 minor units (HK$4,000.00) |
| `<internal bidder>` | An active internal bidder profile: name "QA House One", email label qa-house-one@internal.test |

## grade10-admin-auction-internal-bid-US1: Admin protects a lot with an internal bid at a set time

**As an** auction admin,
**I want** to set a hidden house maximum on a listing, the internal bidder it bids as, and the time Grade10 commits it,
**so that** the lot cannot sell below what the house will accept, without a high starting price putting early bidders off.

<!-- trace:case id=g10adm.auction-internal-bid.TC-d07 rev=1 covers=g10adm.auction-internal-bid.SC-dq6,g10adm.auction-internal-bid.SC-glg,g10.auction-auto-bidding.SC-99a -->
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
2. Pick `<internal bidder>` as the internal bidder.
3. Click Save.
4. Read the Internal bid section.
5. Wait until `<commit time>` passes, taking no action.
6. Reload `<listing_1>`'s editor and read the Internal bid section.
7. As customer B, open the lot page for `<listing_1>` and read Highest bid and Recent bids.

**Expected Results:**

* Step 4 shows `<house maximum>`, `<commit time>` and `<internal bidder>`, not yet committed.
* Step 6 shows the internal bid committed at `<commit time>`, as `<internal bidder>`.
* Step 7: Highest bid reads the row's highest bid; the leader is the row's leader.
* Step 7: every house row in Recent bids carries one listing pseudonym, as a collector's does, and nothing names the house.
* Step 7: no row shows `<internal bidder>`'s name or email label.

<!-- trace:case id=g10adm.auction-internal-bid.TC-5y2 rev=1 covers=g10adm.auction-internal-bid.SC-2s1 -->
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

<!-- trace:case id=g10adm.auction-internal-bid.TC-39a rev=1 covers=g10adm.auction-internal-bid.SC-mxk,g10adm.auction-internal-bid.SC-5x7,g10adm.auction-internal-bid.SC-avn,g10adm.auction-internal-bid.SC-9ve,g10adm.auction-internal-bid.SC-m8q,g10adm.auction-internal-bid.SC-ols -->
### grade10-admin-auction-internal-bid-US1-TC3-1: A value outside the save limits or a missing value is refused

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

| Row | Amount | Commit time | Internal bidder |
| --- | --- | --- | --- |
| Before the start | 600000 minor units | 1 minute before `<start>` | `<internal bidder>` |
| After the scheduled close | 600000 minor units | 1 minute after `<scheduled close>` | `<internal bidder>` |
| Above the ceiling | 8000000100 minor units (HK$80,000,001), one major unit above the HKD ceiling | 30 minutes after `<start>` | `<internal bidder>` |
| Below the starting price | 399900 minor units (HK$3,999), one major unit below `<starting price>` | 30 minutes after `<start>` | `<internal bidder>` |
| Fraction of a major unit | 6000.50 typed (HK$6,000.50), half a major unit above a whole amount | 30 minutes after `<start>` | `<internal bidder>` |
| No time | 600000 minor units | Empty | `<internal bidder>` |
| No amount | Empty | 30 minutes after `<start>` | `<internal bidder>` |
| No internal bidder | 600000 minor units | 30 minutes after `<start>` | None picked |

**Steps:**

1. In the Internal bid section, enter the row's amount and commit time.
2. Pick the row's internal bidder, or leave the pick empty in the No internal bidder row.
3. Click Save.
4. Reload `<listing_3>`'s editor and read the Internal bid section.

**Expected Results:**

* Step 3 is refused, and says which value is wrong.
* Step 4 shows no internal bid on `<listing_3>`.

<!-- trace:case id=g10adm.auction-internal-bid.TC-of0 rev=1 covers=g10adm.auction-internal-bid.SC-dq6,g10.auction-auto-bidding.SC-rh7 -->
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

<!-- trace:case id=g10adm.auction-internal-bid.TC-x4y rev=1 covers=g10adm.auction-internal-bid.SC-urt,g10adm.auction-internal-bid.SC-fti -->
### grade10-admin-auction-internal-bid-US1-TC5-1: An internal bid is refused on a listing it cannot be set on

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
| Draft | A draft holding a starting price, a start an hour away and a close a day later, never created |
| Closed | Closed Unsold after its close |
| Canceled | Called off before its close |
| Past its close | Published, past its scheduled close and in extended bidding after customer A bid in its last minute |

**Steps:**

1. Set an internal bid of `<house maximum>` on `<listing_5>`, with a commit time 10 minutes from now.
2. Read the API response.
3. Read `<listing_5>`'s internal bid.

**Expected Results:**

* Step 2 refuses the write as not editable.
* Step 3: `<listing_5>` holds no internal bid.

<!-- trace:case id=g10adm.auction-internal-bid.TC-88a rev=1 covers=g10adm.auction-internal-bid.SC-5x7 -->
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

<!-- trace:case id=g10adm.auction-internal-bid.TC-jm4 rev=1 covers=g10adm.auction-internal-bid.SC-dq6 -->
### grade10-admin-auction-internal-bid-US1-TC7-1: The amount is entered in whole major units and held in minor units

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-internal-bid-US-01

**Pre-conditions:**

* `<listing_25>` is published in the row's currency, with no internal bid.
* admin(holds auction:reserve) is on `<listing_25>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_25>` | A published listing in the row's currency, starting price 0, scheduled close a day away |
| `<commit time>` | An hour from now |

| Row | Currency | Amount typed | Read back from the API |
| --- | --- | --- | --- |
| HKD | HKD | 6000 | 600000 minor units, HKD |
| USD | USD | 750 | 75000 minor units, USD |
| JPY | JPY | 80000 | 80000 minor units, JPY, no decimals |

**Steps:**

1. In the Internal bid section, type the row's amount and `<commit time>`.
2. Read the amount as the section formats it.
3. Click Save.
4. Read `<listing_25>`'s internal bid from the API.

**Expected Results:**

* Step 2 shows the amount as a formatted decimal in the row's currency.
* Step 3 saves the internal bid.
* Step 4 reads the row's integer minor units with the row's ISO 4217 code.

<!-- trace:case id=g10adm.auction-internal-bid.TC-kyo rev=1 covers=g10adm.auction-internal-bid.SC-glg,g10adm.auction-internal-bid.SC-awq -->
### grade10-admin-auction-internal-bid-US1-TC8-1: An internal bid on a created listing published before its time commits at its time

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
* **Trace:** grade10-admin-auction-internal-bid-US-01

**Pre-conditions:**

* `<listing_26>` is created, not yet published, with no internal bid.
* admin(holds auction:reserve and auction:operate) is on `<listing_26>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_26>` | A created HKD listing, start `<start>` 15 minutes away, scheduled close a day later |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<commit time>` | 10 minutes after `<start>` |

**Steps:**

1. In the Internal bid section, enter `<house maximum>` and `<commit time>`.
2. Click Save.
3. Publish `<listing_26>` now.
4. Wait until `<commit time>` passes, with no collector bid.
5. Reload the editor and read the Internal bid section.
6. As customer B, open the lot page for `<listing_26>` and read Highest bid and Recent bids.

**Expected Results:**

* Step 2 saves the internal bid on the created listing, not yet committed.
* Step 5 shows the internal bid committed at `<commit time>`.
* Step 6: the house leads at `<starting price>`, one bid, under its listing pseudonym.

<!-- trace:case id=g10adm.auction-internal-bid.TC-huh rev=1 covers=g10adm.auction-internal-bid.SC-tbo -->
### grade10-admin-auction-internal-bid-US1-TC9-1: A commit time already past is refused on a lot taking bids

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

* `<listing_27>` is published and taking bids, led by customer A at `<starting price>`, with no internal bid.
* admin(holds auction:reserve) is on `<listing_27>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_27>` | A published HKD listing, started 2 hours ago, scheduled close a day away |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<past time>` | 1 minute ago, after the start and inside the window |

**Steps:**

1. In the Internal bid section, enter `<house maximum>` and `<past time>`.
2. Click Save.
3. Reload the editor and read the Internal bid section.
4. As customer B, read Highest bid and Recent bids on the lot page for `<listing_27>`.

**Expected Results:**

* Step 2 is refused, and says the time has passed.
* Step 3 shows no internal bid.
* Step 4: customer A still leads at `<starting price>`; Recent bids gains no row.

<!-- trace:case id=g10adm.auction-internal-bid.TC-dui rev=1 covers=none -->
### grade10-admin-auction-internal-bid-US1-TC10-1: A created listing's edit clears the internal bid only when it falls outside

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-01

**Pre-conditions:**

* `<listing_28>` is created, not yet published, with an internal bid of the row's amount at `<commit time>`.
* admin(holds auction:reserve and auction:operate) is on `<listing_28>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_28>` | A created HKD listing, start `<start>` a day away, scheduled close `<scheduled close>` two days away |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<commit time>` | 2 hours after `<start>` |
| `<USD ceiling>` | 1000000000 minor units (USD 10,000,000.00), the USD ceiling |

| Row | Internal bid before the edit | Listing edit | Internal bid after Save |
| --- | --- | --- | --- |
| Start past the time | `<house maximum>` | Start moved to 1 minute after `<commit time>` | Cleared |
| Close before the time | `<house maximum>` | Scheduled close moved to 1 minute before `<commit time>` | Cleared |
| Start on the time | `<house maximum>` | Start moved to exactly `<commit time>` | Kept, `<house maximum>` at `<commit time>` |
| Close on the time | `<house maximum>` | Scheduled close moved to exactly `<commit time>` | Kept, `<house maximum>` at `<commit time>` |
| Starting price at the amount | `<house maximum>` | Starting price raised to 600000 minor units, equal to `<house maximum>` | Kept, `<house maximum>` at `<commit time>` |
| Starting price above the amount | `<house maximum>` | Starting price raised to 600100 minor units (HK$6,001), one major unit above `<house maximum>` | Cleared |
| Currency, at the new ceiling | 1000000000 minor units (HK$10,000,000.00) | Currency changed from HKD to USD | Kept, `<USD ceiling>` in USD at `<commit time>` |
| Currency, above the new ceiling | 1000000100 minor units (HK$10,000,001.00), one major unit above `<USD ceiling>` once in USD | Currency changed from HKD to USD | Cleared |
| Currency, not whole in the new currency | `<listing_28>` in JPY, 600050 minor units (JPY 600,050), which reads HK$6,000.50 once in HKD | Currency changed from JPY to HKD | Cleared |

**Steps:**

1. Make the row's listing edit in the listing form.
2. Click Save.
3. Reload the editor and read the Internal bid section.

**Expected Results:**

* Step 2 saves the listing edit; no refusal.
* Step 3 reads the row's internal bid.
* Step 3: in a Cleared row, the section says the listing edit cleared the internal bid.

<!-- trace:case id=g10adm.auction-internal-bid.TC-qzd rev=1 covers=g10adm.auction-internal-bid.SC-i7f -->
### grade10-admin-auction-internal-bid-US1-TC11-1: A second save edits the one internal bid

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

* `<listing_29>` is published and taking bids, with no bids and no internal bid.
* admin(holds auction:reserve) is signed in to the admin.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_29>` | A published HKD listing taking bids, scheduled close a day away |
| `<first amount>` | 600000 minor units (HK$6,000.00) |
| `<first time>` | 10 minutes from now |
| `<second amount>` | 700000 minor units (HK$7,000.00) |
| `<second time>` | 30 minutes from now |

**Steps:**

1. Set an internal bid of `<first amount>` at `<first time>` on `<listing_29>`.
2. Set an internal bid of `<second amount>` at `<second time>` on `<listing_29>`.
3. Read `<listing_29>`'s internal bid from the API.
4. Wait until `<first time>` passes, and read Recent bids on the lot page as customer B.
5. Wait until `<second time>` passes, and read Highest bid and Recent bids again.

**Expected Results:**

* Step 2 is accepted.
* Step 3 reads one internal bid: `<second amount>` at `<second time>`.
* Step 4: Recent bids holds no row.
* Step 5: the house leads at `<starting price>`, one bid.

<!-- trace:case id=g10adm.auction-internal-bid.TC-6a2 rev=1 covers=g10adm.auction-internal-bid.SC-rzl,g10.auction-auto-bidding.SC-7m7 -->
### grade10-admin-auction-internal-bid-US1-TC12-1: One internal bidder serves internal bids on several listings

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

* `<listing_52>` and `<listing_53>` are published and taking bids, with no internal bid.
* On `<listing_52>`, customer A bid first with maximum `<customer A maximum>`, then customer B with maximum `<customer B maximum>`; customer B leads.
* `<listing_53>` has no bids.
* admin(holds auction:reserve) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_52>` | A published HKD listing taking bids, scheduled close a day away |
| `<listing_53>` | A published HKD listing like `<listing_52>` |
| `<customer A maximum>` | 450000 minor units (HK$4,500.00) |
| `<customer B maximum>` | 500000 minor units (HK$5,000.00) |
| `<house maximum>` | 600000 minor units (HK$6,000.00), on both listings |
| `<commit time>` | 10 minutes from now, on both listings |
| `<house bid on listing_52>` | 508000 minor units: `<customer B maximum>` plus its 8000 increment |

**Steps:**

1. Open `<listing_52>`'s editor and enter `<house maximum>` and `<commit time>` in the Internal bid section.
2. Pick `<internal bidder>` and click Save.
3. Open `<listing_53>`'s editor and enter `<house maximum>` and `<commit time>` in the Internal bid section.
4. Pick `<internal bidder>` and click Save.
5. Wait until `<commit time>` passes, taking no action.
6. Reopen each listing's editor and read the Internal bid section and the listing's bids.
7. As customer B, open each lot page and read Highest bid and Recent bids.

**Expected Results:**

* Step 2 and step 4 are both accepted.
* Step 6: each listing's internal bid shows committed as `<internal bidder>`, and its house bid names `<internal bidder>`.
* Step 7: on `<listing_52>` the house leads at `<house bid on listing_52>`; Recent bids reads customer A as Bidder 1, customer B as Bidder 2 and the house as Bidder 3.
* Step 7: on `<listing_53>` the house leads at `<starting price>`, one bid, as Bidder 1.
* Step 7: neither lot page shows `<internal bidder>`'s name or email label, or names the other lot.

<!-- trace:case id=g10adm.auction-internal-bid.TC-akn rev=1 covers=g10adm.auction-internal-bid.SC-dnq,g10adm.auction-internal-bid.SC-i32 -->
### grade10-admin-auction-internal-bid-US1-TC13-1: The internal bidder changes only before the internal bid's time

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
* **Trace:** grade10-admin-auction-internal-bid-US-01

**Pre-conditions:**

* `<listing_54>` is published and taking bids; customer A bid at `<starting price>` with maximum `<customer A maximum>` before the internal bid's time.
* `<listing_54>` has an internal bid of the row's amount as `<bidder P>`, in the row's state.
* `<bidder Q>` is an active internal bidder profile.
* admin(holds auction:reserve) is on `<listing_54>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_54>` | A published HKD listing taking bids, scheduled close a day away |
| `<bidder P>` | An active internal bidder profile: name "QA House P", email label qa-house-p@internal.test |
| `<bidder Q>` | An active internal bidder profile: name "QA House Q", email label qa-house-q@internal.test |
| `<customer A maximum>` | 700000 minor units (HK$7,000.00) |

| Row | Internal bid's state and amount | Save | Internal bidder after Save |
| --- | --- | --- | --- |
| Before its time | Scheduled, 800000 minor units, its time 10 minutes from now | Accepted | `<bidder Q>`; once its time passes, the house's bid names `<bidder Q>` |
| Placed | Placed, 800000 minor units, committed at its time 10 minutes ago; the house leads at 708000 | Refused, saying the internal bidder is fixed | `<bidder P>` |
| Not placed | Not placed, 400000 minor units (`<starting price>`), short of the 408000 minimum next bid at its time 10 minutes ago | Refused, saying the internal bidder is fixed | `<bidder P>` |

**Steps:**

1. As customer B, open the lot page for `<listing_54>` and read Highest bid and Recent bids.
2. In the Internal bid section, pick `<bidder Q>` as the internal bidder, leaving the amount and time as they are.
3. Click Save.
4. Reload the editor and read the Internal bid section.
5. As customer B, reload the lot page and read Highest bid and Recent bids.
6. In the Before its time row, wait until the internal bid's time passes, then reload the editor and read the section and the listing's bids.

**Expected Results:**

* Step 3 reads the row's Save outcome.
* Step 4 shows the row's internal bidder after Save, with the state and amount it had.
* Step 5 reads the same Highest bid and Recent bids as step 1.
* Step 6: the internal bid is Placed and the house's bid names `<bidder Q>`.

<!-- trace:case id=g10adm.auction-internal-bid.TC-h13 rev=1 covers=g10adm.auction-internal-bid.SC-1af -->
### grade10-admin-auction-internal-bid-US1-TC14-1: A save naming a retired internal bidder is refused

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
* **Trace:** grade10-admin-auction-internal-bid-US-01

**Pre-conditions:**

* `<listing_55>` is published and Upcoming, with no internal bid.
* `<bidder R>` is a retired internal bidder profile.
* admin(holds auction:reserve) is signed in to the admin.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_55>` | A published HKD listing, scheduled start an hour away, scheduled close a day later |
| `<bidder R>` | A retired internal bidder profile: name "QA House R", email label qa-house-r@internal.test |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<commit time>` | 30 minutes after the start |

**Steps:**

1. Set an internal bid of `<house maximum>` at `<commit time>` on `<listing_55>`, naming `<bidder R>` as its internal bidder.
2. Read the API response.
3. Read `<listing_55>`'s internal bid.

**Expected Results:**

* Step 2 refuses the write, saying the internal bidder is retired.
* Step 3: `<listing_55>` holds no internal bid.

---

## grade10-admin-auction-internal-bid-US2: Admin changes an internal bid before its time

**As an** auction admin,
**I want** to change or remove the amount and the time until the internal bid is committed,
**so that** I can react to the market before the house has bid at all.

<!-- trace:case id=g10adm.auction-internal-bid.TC-qbl rev=1 covers=g10adm.auction-internal-bid.SC-jtj -->
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

<!-- trace:case id=g10adm.auction-internal-bid.TC-1p0 rev=1 covers=g10adm.auction-internal-bid.SC-1c4 -->
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

<!-- trace:case id=g10adm.auction-internal-bid.TC-kok rev=1 covers=g10adm.auction-internal-bid.SC-mxk,g10adm.auction-internal-bid.SC-m8q -->
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

<!-- trace:case id=g10adm.auction-internal-bid.TC-ul9 rev=1 covers=g10adm.auction-internal-bid.SC-p8p -->
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

<!-- trace:case id=g10adm.auction-internal-bid.TC-gem rev=1 covers=g10adm.auction-internal-bid.SC-lqc -->
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

<!-- trace:case id=g10adm.auction-internal-bid.TC-vk1 rev=1 covers=g10.auction-auto-bidding.SC-ax3 -->
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

<!-- trace:case id=g10adm.auction-internal-bid.TC-ben rev=1 covers=g10adm.auction-internal-bid.SC-6v8 -->
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

<!-- trace:case id=g10adm.auction-internal-bid.TC-t5b rev=1 covers=g10adm.auction-internal-bid.SC-xfi -->
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
4. Remove the internal bid from the Internal bid section.
5. Click Save.
6. Reload the editor and read the Internal bid section.

**Expected Results:**

* Step 2 is refused, and says the time is fixed; it stores no new time.
* Step 3 still shows `<house maximum>` committed at `<commit time>`.
* Step 5 is refused, and says the time is fixed.
* Step 6 still shows `<house maximum>` committed at `<commit time>`.

<!-- trace:case id=g10adm.auction-internal-bid.TC-nrn rev=1 covers=g10adm.auction-internal-bid.SC-hsd -->
### grade10-admin-auction-internal-bid-US3-TC5-1: A raise still short of the next minimum is refused

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
* **Trace:** grade10-admin-auction-internal-bid-US-03

**Pre-conditions:**

* `<listing_30>` is published and taking bids, its internal bid of `<house maximum>` committed.
* customer A leads `<listing_30>` at `<current bid>` with maximum `<customer A maximum>`.
* admin(holds auction:reserve) is on `<listing_30>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_30>` | A published HKD listing taking bids, scheduled close a day away |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<customer A maximum>` | 700000 minor units (HK$7,000.00) |
| `<current bid>` | 608000 minor units: `<house maximum>` plus its 8000 increment |
| `<short raise>` | 615900 minor units (HK$6,159), one major unit below `<current bid>` plus its 8000 increment |

**Steps:**

1. In the Internal bid section, change the amount to `<short raise>`.
2. Click Save.
3. Reload the editor and read the Internal bid section.
4. As customer A, read Highest bid, the standing and Recent bids on the lot page for `<listing_30>`.

**Expected Results:**

* Step 2 is refused, and says the amount is short of the next minimum.
* Step 3 still shows `<house maximum>`, committed.
* Step 4: customer A still leads at `<current bid>`; Recent bids gains no row.

<!-- trace:case id=g10adm.auction-internal-bid.TC-fku rev=1 covers=g10adm.auction-internal-bid.SC-ubh -->
### grade10-admin-auction-internal-bid-US3-TC6-1: A placed internal bid still raises after its internal bidder is retired

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

* `<listing_63>` is published and taking bids, its internal bid of `<house maximum>` committed as `<bidder P>`.
* customer A leads `<listing_63>` at `<current bid>` with maximum `<customer A maximum>`, committed before the house.
* `<bidder P>` has since been retired in auction admin.
* admin(holds auction:reserve) is on `<listing_63>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_63>` | A published HKD listing taking bids, scheduled close a day away |
| `<bidder P>` | A retired internal bidder profile: name "QA House P", email label qa-house-p@internal.test |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<customer A maximum>` | 700000 minor units (HK$7,000.00) |
| `<current bid>` | 608000 minor units: `<house maximum>` plus its 8000 increment |
| `<raised maximum>` | 800000 minor units (HK$8,000.00) |
| `<new highest bid>` | 708000 minor units: `<customer A maximum>` plus its 8000 increment |

**Steps:**

1. In the Internal bid section, change the amount to `<raised maximum>`.
2. Click Save.
3. Reload the editor and read the Internal bid section and the listing's bids.
4. As customer A, open the lot page for `<listing_63>` and read Highest bid and the standing.

**Expected Results:**

* Step 2 is accepted at once.
* Step 3 shows the internal bid Placed at `<raised maximum>`, still as `<bidder P>`.
* Step 3: the house's new bid at `<new highest bid>` reads House with `<bidder P>`'s name.
* Step 4: Highest bid reads `<new highest bid>`, and customer A is outbid.

---

## grade10-admin-auction-internal-bid-US4: Admin lowers a committed internal bid without moving the lead

**As an** auction admin,
**I want** to lower the house maximum when the leader and the current bid stay as they are,
**so that** I can loosen the protection without changing anything a collector has already seen.

<!-- trace:case id=g10adm.auction-internal-bid.TC-pw6 rev=1 covers=g10adm.auction-internal-bid.SC-x8q -->
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

<!-- trace:case id=g10adm.auction-internal-bid.TC-cu7 rev=2 covers=g10adm.auction-internal-bid.SC-eng,g10adm.auction-internal-bid.SC-16a,g10.auction-auto-bidding.SC-q3t -->
### grade10-admin-auction-internal-bid-US4-TC2-2: A lower that would move the lead or the price is refused

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

| Row | Bidding | `<current bid>` | `<house bid>`, the highest bid placed for the house | `<lowered amount>` |
| --- | --- | --- | --- | --- |
| House leads, one unit below the current bid | The house leads over customer A's maximum of 550000 | 558000 | 558000, `<current bid>` | 557900, one major unit below `<current bid>` |
| House leads at its own maximum | The house leads over customer A's maximum of 695000, the price capped at `<house maximum>` | 700000 | 700000, `<current bid>` | 699900, one major unit below |
| House second, setting the price | The house led alone at `<starting price>`, then customer A committed a maximum of 800000 | 708000: `<house maximum>` plus its 8000 increment | 400000, `<starting price>`; customer A's commitment placed no bid for the house | 650000, at or above `<house bid>` |

**Steps:**

1. In the Internal bid section, change the amount to the row's `<lowered amount>`.
2. Click Save.
3. Reload the editor and read the Internal bid section.
4. As customer B, read Highest bid, the leader and Recent bids on the lot page for `<listing_16>`.

**Expected Results:**

* Step 2 is refused in every row.
* Step 2, in both House leads rows: it says the amount is below the house's own bid, names `<house bid>`, and does not say the lower would move the lead or the price.
* Step 2, in the House second row: it says the lower would move the lead or the price.
* Step 3 still shows `<house maximum>`.
* Step 4: Highest bid still reads `<current bid>`; the leader and Recent bids are unchanged.

<!-- trace:case id=g10adm.auction-internal-bid.TC-79d rev=1 covers=g10adm.auction-internal-bid.SC-wmp -->
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

<!-- trace:case id=g10adm.auction-internal-bid.TC-0l0 rev=1 covers=g10adm.auction-internal-bid.SC-spg,g10adm.auction-internal-bid.SC-u2x,g10.auction-auto-bidding.SC-ajh,g10.auction-auto-bidding.SC-ldk -->
### grade10-admin-auction-internal-bid-US4-TC4-1: A lower behind another's lead is held only to the house's own bid

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
* **Trace:** grade10-admin-auction-internal-bid-US-04

**Pre-conditions:**

* `<listing_42>` is published and taking bids, its internal bid of `<house maximum>` committed while customer A led at `<starting price>` with maximum `<customer A maximum>`, so the house's bid stands at `<house bid>`.
* customer C then committed `<customer C maximum>`, and customer B then committed `<customer B maximum>`; customer B leads at `<current bid>`.
* admin(holds auction:reserve) is on `<listing_42>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_42>` | A published HKD listing taking bids, scheduled close a day away |
| `<customer A maximum>` | 420000 minor units (HK$4,200.00) |
| `<house maximum>` | 450000 minor units (HK$4,500.00) |
| `<house bid>` | 428000 minor units: `<customer A maximum>` plus its 8000 increment |
| `<customer C maximum>` | 600000 minor units (HK$6,000.00) |
| `<customer B maximum>` | 700000 minor units (HK$7,000.00) |
| `<current bid>` | 608000 minor units: `<customer C maximum>` plus its 8000 increment |
| `<kept lower>` | 430000 minor units (HK$4,300.00), above `<house bid>` |
| `<refused lower>` | 420000 minor units (HK$4,200.00), below `<house bid>` |

**Steps:**

1. In the Internal bid section, change the amount to `<kept lower>`.
2. Click Save.
3. As customer B, read Highest bid, the standing and Recent bids on the lot page for `<listing_42>`.
4. In the Internal bid section, change the amount to `<refused lower>`.
5. Click Save.
6. Reload the editor and read the Internal bid section.

**Expected Results:**

* Step 2 is accepted.
* Step 3: customer B still leads at `<current bid>`; Recent bids gains no row.
* Step 5 is refused, naming the house's bid of `<house bid>`.
* Step 6 shows `<kept lower>`, committed.

---

## grade10-admin-auction-internal-bid-US5: Admin learns an internal bid came too late

**As an** auction admin,
**I want** to see that an internal bid was not placed because the price had already passed it,
**so that** I can raise it or let the lot sell.

<!-- trace:case id=g10adm.auction-internal-bid.TC-6at rev=1 covers=g10adm.auction-internal-bid.SC-11v,g10adm.auction-internal-bid.SC-otk,g10.auction-auto-bidding.SC-rt4 -->
### grade10-admin-auction-internal-bid-US5-TC1-1: Placed at the next minimum, not placed one major unit below it

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

* `<listing_18>` is published and taking bids, bid on as the row states, with no internal bid.
* admin(holds auction:reserve) is on `<listing_18>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_18>` | A published HKD listing taking bids, scheduled close a day away |
| `<commit time>` | 10 minutes from now |

| Row | Bidding at `<commit time>` | Next minimum | Internal bid | Outcome |
| --- | --- | --- | --- | --- |
| One major unit short | customer A leads at 600000 with maximum 700000 | 608000 | 607900 | Not placed; customer A leads at 600000 |
| At the next minimum | customer A leads at 600000 with maximum 700000 | 608000 | 608000 | Placed; customer A leads at 616000, the internal bid plus its 8000 increment |
| At the starting price | No bids | `<starting price>` | 400000 | Placed; the house leads at `<starting price>` |

**Steps:**

1. In the Internal bid section, enter the row's internal bid and `<commit time>`.
2. Click Save.
3. Wait until `<commit time>` passes.
4. Reload the editor and read the Internal bid section.
5. As customer B, read Highest bid, the leader and Recent bids on the lot page for `<listing_18>`.

**Expected Results:**

* Step 2 is accepted in every row, the short amount included; the section shows it not yet committed.
* Step 4: a placed internal bid shows committed; a short one shows not placed, with the next minimum.
* Step 5 reads the row's outcome.
* Step 5: after a not-placed row, Recent bids gains no row and nothing tells a collector of it.

<!-- trace:case id=g10adm.auction-internal-bid.TC-7rg rev=1 covers=g10adm.auction-internal-bid.SC-quv -->
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

<!-- trace:case id=g10adm.auction-internal-bid.TC-2dl rev=1 covers=g10adm.auction-internal-bid.SC-11v -->
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

<!-- trace:case id=g10adm.auction-internal-bid.TC-kew rev=1 covers=g10adm.auction-internal-bid.SC-ujg -->
### grade10-admin-auction-internal-bid-US5-TC4-1: A not-placed internal bid can be lowered

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
* **Trace:** grade10-admin-auction-internal-bid-US-05

**Pre-conditions:**

* `<listing_31>` is published and taking bids, led by customer A at `<current bid>` with maximum `<customer A maximum>`.
* `<listing_31>`'s internal bid of `<short amount>` was not placed at its time.
* admin(holds auction:reserve) is on `<listing_31>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_31>` | A published HKD listing taking bids, scheduled close a day away |
| `<customer A maximum>` | 700000 minor units (HK$7,000.00) |
| `<current bid>` | 600000 minor units |
| `<short amount>` | 550000 minor units, below `<current bid>` |
| `<lowered amount>` | 500000 minor units, below `<short amount>` |

**Steps:**

1. In the Internal bid section, change the amount to `<lowered amount>`.
2. Click Save.
3. Reload the editor and read the Internal bid section.
4. As customer A, read Highest bid, the standing and Recent bids on the lot page for `<listing_31>`.

**Expected Results:**

* Step 2 is accepted.
* Step 3 shows `<lowered amount>`, still not placed.
* Step 4: customer A still leads at `<current bid>`; Recent bids gains no row.

<!-- trace:case id=g10adm.auction-internal-bid.TC-wf1 rev=1 covers=g10adm.auction-internal-bid.SC-te0 -->
### grade10-admin-auction-internal-bid-US5-TC5-1: A not-placed internal bid can be removed

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
* **Trace:** grade10-admin-auction-internal-bid-US-05

**Pre-conditions:**

* `<listing_32>` is published and taking bids, led by customer A at `<current bid>`.
* `<listing_32>`'s internal bid of `<short amount>` was not placed at its time.
* admin(holds auction:reserve) is on `<listing_32>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_32>` | A published HKD listing taking bids, scheduled close a day away |
| `<current bid>` | 600000 minor units |
| `<short amount>` | 550000 minor units, below `<current bid>` |

**Steps:**

1. Remove the internal bid from the Internal bid section.
2. Click Save.
3. Reload the editor and read the Internal bid section.
4. As customer A, read Highest bid and Recent bids on the lot page for `<listing_32>`.

**Expected Results:**

* Step 2 saves the removal.
* Step 3 shows no internal bid.
* Step 4: customer A still leads at `<current bid>`; Recent bids gains no row.

<!-- trace:case id=g10adm.auction-internal-bid.TC-jzx rev=1 covers=g10adm.auction-internal-bid.SC-qom,g10adm.auction-internal-bid.SC-x95 -->
### grade10-admin-auction-internal-bid-US5-TC6-1: A raise or re-save of a not-placed internal bid still short is refused

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
* **Trace:** grade10-admin-auction-internal-bid-US-05

**Pre-conditions:**

* `<listing_33>` is published and taking bids, led by customer A at `<current bid>` with maximum `<customer A maximum>`.
* `<listing_33>`'s internal bid of `<short amount>` was not placed at its time.
* admin(holds auction:reserve) is on `<listing_33>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_33>` | A published HKD listing taking bids, scheduled close a day away |
| `<customer A maximum>` | 700000 minor units (HK$7,000.00) |
| `<current bid>` | 600000 minor units |
| `<short amount>` | 550000 minor units, below `<current bid>` |
| `<minimum next bid>` | 608000 minor units: `<current bid>` plus its 8000 increment |

| Row | `<saved amount>` |
| --- | --- |
| Short raise | 607900 minor units (HK$6,079), one major unit below `<minimum next bid>` |
| Same amount | `<short amount>`, saved unchanged |

**Steps:**

1. In the Internal bid section, set the amount to the row's `<saved amount>`.
2. Click Save.
3. Reload the editor and read the Internal bid section.
4. As customer A, read Highest bid and Recent bids on the lot page for `<listing_33>`.

**Expected Results:**

* Step 2 is refused, and names `<minimum next bid>` as the next minimum.
* Step 3 still shows `<short amount>`, not placed.
* Step 4: customer A still leads at `<current bid>`; Recent bids gains no row.

<!-- trace:case id=g10adm.auction-internal-bid.TC-ipm rev=1 covers=g10adm.auction-internal-bid.SC-oml,g10adm.auction-internal-bid.SC-r5u,g10adm.auction-internal-bid.SC-tbl,g10.auction-auto-bidding.SC-dym -->
### grade10-admin-auction-internal-bid-US5-TC7-1: An internal bid whose time passes while the listing is created is not placed

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
* **Trace:** grade10-admin-auction-internal-bid-US-05

**Pre-conditions:**

* `<listing_38>` is created, not yet published, with an internal bid of `<house maximum>` at `<commit time>`.
* admin(holds auction:reserve and auction:operate) is on `<listing_38>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_38>` | A created HKD listing, start `<start>` 5 minutes away, scheduled close a day later |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<commit time>` | 10 minutes after `<start>` |
| `<created amount>` | 650000 minor units (HK$6,500.00), saved while `<listing_38>` is still created |

| Row | `<open amount>`, saved once the lot takes bids |
| --- | --- |
| Same amount | 650000 minor units, `<created amount>` |
| Raised | 700000 minor units (HK$7,000.00), above `<created amount>` |
| Lowered, still at or above the minimum next bid | 500000 minor units (HK$5,000.00), below `<created amount>` and above `<starting price>` |

**Steps:**

1. Wait until `<commit time>` passes, leaving `<listing_38>` created.
2. Reload the editor and read the Internal bid section.
3. In the Internal bid section, change the amount to `<created amount>`.
4. Click Save.
5. Publish `<listing_38>` now.
6. As customer B, open the lot page for `<listing_38>` and read Highest bid and Recent bids.
7. In the Internal bid section, change the amount to the row's `<open amount>`.
8. Click Save.
9. As customer B, reload the lot page and read Highest bid and Recent bids.

**Expected Results:**

* Step 2 shows the internal bid not placed.
* Step 4 is accepted; the section still shows the internal bid not placed, at `<created amount>`.
* Step 6: the lot takes bids with No bids yet; Recent bids holds no row.
* Step 8 is accepted, though `<commit time>` has passed; the section shows the internal bid placed.
* Step 9: the house leads at `<starting price>`, one bid, under its listing pseudonym.

<!-- trace:case id=g10adm.auction-internal-bid.TC-54s rev=1 covers=g10adm.auction-internal-bid.SC-r5u -->
### grade10-admin-auction-internal-bid-US5-TC8-1: While the listing is created a not-placed internal bid takes a raise or a lower and stays not placed

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
* **Trace:** grade10-admin-auction-internal-bid-US-05

**Pre-conditions:**

* `<listing_44>` is created, not yet published, and its internal bid of `<house maximum>` was not placed because `<commit time>` passed while it was created.
* admin(holds auction:reserve) is on `<listing_44>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_44>` | A created HKD listing, its start and `<commit time>` already passed, scheduled close a day away |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<commit time>` | 10 minutes after the listing's start |

| Row | `<saved amount>` |
| --- | --- |
| Raised | 700000 minor units (HK$7,000.00) |
| Lowered | 500000 minor units (HK$5,000.00) |
| Lowered to the starting price | 400000 minor units, `<starting price>` |

**Steps:**

1. In the Internal bid section, change the amount to the row's `<saved amount>`.
2. Click Save.
3. Reload the editor and read the Internal bid section.

**Expected Results:**

* Step 2 is accepted.
* Step 3 shows `<saved amount>`, not placed.

---

## grade10-admin-auction-internal-bid-US6: Admin reads a lot the house bought in

**As an** auction admin,
**I want** a lot the house won to read Bought in, with no order and its stock released,
**so that** I can tell it from a sale and from a lot nobody bid on, and decide what to do with the card.

<!-- trace:case id=g10adm.auction-internal-bid.TC-rzs rev=1 covers=g10adm.auction-internal-bid.SC-hat,g10.auction-auction.SC-6am,g10.auction-auction.SC-cqt -->
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

| Row | Leader at the close | Orders after the close | customer A's row on My Auctions |
| --- | --- | --- | --- |
| House wins | The house, at 508000 over customer A's maximum of 500000 | No order for `<listing_21>` in any segment | Didn't win, card not charged |
| Collector beats the house | customer A, at 608000 with maximum 700000 | customer A's order, winning bid 608000 | Won, with View order |
| House alone | The house, at `<starting price>`, with no collector bid | No order for `<listing_21>` in any segment | No row; customer A never bid |

**Steps:**

1. Wait until `<listing_21>`'s close passes.
2. Select All and search for `<listing_21>`'s listing code.
3. As customer A, open `<grade10 my auctions url>` and read `<listing_21>`'s row.

**Expected Results:**

* Step 2 reads the row's Orders outcome.
* Step 3 reads the row's My Auctions outcome.

<!-- trace:case id=g10adm.auction-internal-bid.TC-17a rev=1 covers=g10adm.auction-internal-bid.SC-hat,g10adm.auction-listing.SC-qgd -->
### grade10-admin-auction-internal-bid-US6-TC2-1: The listing's own page and its Listings row read Bought in once the lot closes

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
* **Trace:** grade10-admin-auction-internal-bid-US-06

**Pre-conditions:**

* `<listing_45>` is published in no campaign and is bid on as the row states, its close a few minutes away, no further bid coming.
* admin(holds auction:reserve and auction:operate) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_45>` | A published HKD listing in no campaign |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |

| Row | Bidding | Wait | Listing page and Listings row |
| --- | --- | --- | --- |
| House wins | The house leads at 508000 under its committed internal bid of `<house maximum>`, over customer A's maximum of 500000 | Until the close passes | Both read Bought in |
| House leads, not yet closed | As House wins | None; the lot is still taking bids | Neither reads Bought in |
| Collector beats the house | customer A leads at 608000 with maximum 700000, over the house's committed internal bid of `<house maximum>` | Until the close passes | Neither reads Bought in |
| Nobody bids | No bid and no internal bid | Until the close passes | Neither reads Bought in; the Listings row reads Unsold |

**Steps:**

1. Wait as the row states.
2. Open `<listing_45>` and read its status.
3. Return to the Listings table and read `<listing_45>`'s row.

**Expected Results:**

* Step 2 and step 3 read the row's outcome.

<!-- trace:case id=g10adm.auction-internal-bid.TC-vuc rev=1 covers=g10adm.auction-internal-bid.SC-80a,g10.auction-winner-order.SC-los -->
### grade10-admin-auction-internal-bid-US6-TC3-1: A house win puts nothing in the post-sale queue and sends no order letter

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
* **Trace:** grade10-admin-auction-internal-bid-US-06

**Pre-conditions:**

* The house leads `<listing_46>` at `<final price>` under its committed internal bid, over customer A, its close a few minutes away, no further bid coming.
* customer B leads `<listing_51>`, closing a minute before `<listing_46>`, no further bid coming.
* No other lot closes before step 5.
* admin(holds auction:reserve, auction:operate and auction:payment) is on <grade10 auction admin orders url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_46>` | A published HKD listing in no campaign, protected by a committed internal bid of 600000 minor units |
| `<customer A maximum>` | 500000 minor units (HK$5,000.00) |
| `<final price>` | 508000 minor units: `<customer A maximum>` plus its 8000 increment |
| `<listing_51>` | A published HKD listing in no campaign, no internal bid, led by customer B |

**Steps:**

1. Read the count on each Orders segment: Needs action, Waiting on winner, In transit, Closed and All.
2. Wait until `<listing_46>`'s close passes.
3. Reload Orders and read each segment's count, and the orders All adds.
4. Open <grade10 auction admin listings url> and read `<listing_46>`'s row.
5. Open <grade10 auction send log url>, filter by `<listing_46>` and read the rows from the close.

**Expected Results:**

* Step 3: All holds one order more than at step 1, customer B's for `<listing_51>`; no order is `<listing_46>`'s.
* Step 4: the row offers no Open order.
* Step 5 holds no auction-won letter and no other order letter, to anyone.

---

## grade10-admin-auction-internal-bid-US7: Admin keeps protected lots secret from staff

**As an** auction admin,
**I want** operators without secret-floor access never to see an internal bid's amount or time, or learn that a lot has one before the house bids,
**so that** the house's floor stays known only to those allowed to set it.

<!-- trace:case id=g10adm.auction-internal-bid.TC-hy3 rev=1 covers=g10adm.auction-internal-bid.SC-n08,g10adm.auction-internal-bid.SC-27a,g10adm.auction-internal-bid.SC-d57 -->
### grade10-admin-auction-internal-bid-US7-TC1-1: Before the house bids staff cannot tell a lot is protected

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

* `<listing_22>` is published and taking bids, with an internal bid in the row's state; customer A leads it.
* `<listing_23>` is published and taking bids, with no internal bid; customer A leads it.
* The row's admin, without auction:reserve, is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_22>` | A published HKD listing with an internal bid of the row's amount |
| `<listing_23>` | A published HKD listing like `<listing_22>`, with no internal bid |
| `<customer A maximum>` | 700000 minor units (HK$7,000.00), on both listings |
| `<current bid>` | 600000 minor units, on both listings |

| Row | admin | `<listing_22>`'s internal bid |
| --- | --- | --- |
| Staff, before its time | admin(staff, holds auction:operate) | 800000 minor units, its time an hour ahead |
| Staff, not placed | admin(staff, holds auction:operate) | 550000 minor units, not placed at its time, short of the next minimum |
| Finance, not placed | admin(finance, holds auction:read) | 550000 minor units, not placed at its time, short of the next minimum |

**Steps:**

1. Read `<listing_22>`'s and `<listing_23>`'s rows in the Listings table.
2. Open `<listing_22>` and read it, its bids included.
3. Open `<listing_23>` and read it, its bids included.
4. Open Stats on each listing's row and read the bidder and bid counts.
5. Look through auction admin's navigation for Internal bidders.

**Expected Results:**

* Step 1: the two rows differ in nothing an internal bid would explain.
* Step 2 shows no Internal bid section and no amount, time, state or internal bidder of one.
* Step 2: no bid reads House, and nothing shows `<internal bidder>`'s name or email label.
* Step 2 and step 3 read alike: nothing tells `<listing_22>` is protected.
* Step 4: both listings read the same bidder count and the same bid count.
* Step 5: auction admin offers no Internal bidders page.

<!-- trace:case id=g10adm.auction-internal-bid.TC-kku rev=1 covers=g10adm.auction-internal-bid.SC-w8v -->
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
* `<bidder Q>` is an active internal bidder profile, not `<listing_22>`'s.
* admin(staff, holds auction:operate and auction:write, not auction:reserve) is signed in to the admin.

**Test data:**

| Field | Value |
| --- | --- |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<bidder Q>` | An active internal bidder profile: name "QA House Q", email label qa-house-q@internal.test |

| Row | Call |
| --- | --- |
| Read | Read the internal bid |
| Set | Set an internal bid of 500000 minor units, its time an hour ahead, as `<internal bidder>` |
| Change | Change the amount to 900000 minor units |
| Change bidder | Change the internal bidder to `<bidder Q>` |
| Remove | Remove the internal bid |

**Steps:**

1. Send the row's call for `<listing_22>`.
2. Send the row's call for `<listing_23>`.
3. Read both API responses.
4. As admin(holds auction:reserve), read both listings' internal bids.

**Expected Results:**

* Step 3: both calls are refused for the missing access, with the same answer for both listings.
* Step 4: `<listing_22>` still holds `<house maximum>` at its time, as `<internal bidder>`; `<listing_23>` holds none.

<!-- trace:case id=g10adm.auction-internal-bid.TC-jjr rev=1 covers=g10adm.auction-internal-bid.SC-53a -->
### grade10-admin-auction-internal-bid-US7-TC3-1: The audit trail records each internal bid act, never its amount or time

Runs once per row of **Test data**.

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

* `<listing_24>` is published, with the internal bid the row starts from.
* `<bidder Q>` is an active internal bidder profile.
* admin(holds auction:reserve) is on `<listing_24>`'s editor from <grade10 auction admin listings url>.
* admin(holds audit access, not auction:reserve) is signed in to the admin on a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_24>` | A published HKD listing, scheduled close a day away |
| `<house maximum>` | 612300 minor units (HK$6,123.00), an amount no other entry carries |
| `<commit time>` | 2 hours 17 minutes from now, a time no other entry carries |
| `<changed maximum>` | 645600 minor units (HK$6,456.00), an amount no other entry carries |
| `<bidder Q>` | An active internal bidder profile: name "QA House Q", email label qa-house-q@internal.test |

| Row | Starts from | Act | Entry records |
| --- | --- | --- | --- |
| Set | No internal bid | Enter `<house maximum>` and `<commit time>`, picking `<internal bidder>` | An internal bid was set |
| Change | `<house maximum>` at `<commit time>` | Change the amount to `<changed maximum>` | An internal bid was changed |
| Change bidder | `<house maximum>` at `<commit time>`, as `<internal bidder>` | Pick `<bidder Q>` as the internal bidder | An internal bid was changed |
| Remove | `<house maximum>` at `<commit time>` | Remove the internal bid | An internal bid was removed |

**Steps:**

1. In the Internal bid section, make the row's act.
2. Click Save.
3. As the admin holding audit access, open `<grade10 audit trail url>` and find the newest entry for `<listing_24>`.

**Expected Results:**

* Step 3 shows one entry recording the row's act on `<listing_24>`, by the admin who made it, at Grade10's time.
* Step 3: no entry shows `<house maximum>` or `<changed maximum>` in any form, such as 612300 or 6,123.
* Step 3: no entry shows `<commit time>`.
* Step 3: no entry shows `<internal bidder>`'s or `<bidder Q>`'s name or email label.

<!-- trace:case id=g10adm.auction-internal-bid.TC-rfj rev=1 covers=g10adm.auction-internal-bid.SC-ftu,g10adm.auction-listing.SC-qgd,g10adm.auction-listing.SC-l2y -->
### grade10-admin-auction-internal-bid-US7-TC4-1: After the close staff see Bought in, never the amount or time

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

* `<listing_34>` closed with the house leading under its internal bid of `<house maximum>` at `<commit time>`, over customer A.
* admin(staff, holds auction:operate, not auction:reserve) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_34>` | An HKD listing in no campaign, closed Bought in |
| `<house maximum>` | 612300 minor units (HK$6,123.00), an amount the lot's bids never reached |
| `<commit time>` | The internal bid's set time |

**Steps:**

1. Read `<listing_34>`'s row in the Listings table.
2. Open `<listing_34>` and read it, its bids included.

**Expected Results:**

* Step 1: the row reads Bought in and offers Relist.
* Step 2: the listing's page reads Closed and Bought in, with no order to open.
* Step 2 shows no Internal bid section.
* Step 2: the house's bids read House, each with its own Accepted At, as Recent bids shows it.
* Step 2 shows `<house maximum>` nowhere, and no internal bid time or state.

<!-- trace:case id=g10adm.auction-internal-bid.TC-net rev=2 covers=g10adm.auction-internal-bid.SC-rzd,g10adm.auction-internal-bid.SC-36t,g10adm.auction-internal-bid.SC-wib,g10adm.auction-internal-bid.SC-n08 -->
### grade10-admin-auction-internal-bid-US7-TC5-2: A staff listing edit that clears the internal bid tells staff nothing

Runs once per row of **Test data**.

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

* `<listing_35>` is created, not yet published, with an internal bid of the row's amount at `<commit time>`.
* `<listing_36>` is created, not yet published, with the same window, starting price and currency and no internal bid.
* admin(staff, holds auction:write and auction:operate, not auction:reserve) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_35>` | A created HKD listing, start `<start>` a day away, scheduled close two days away |
| `<listing_36>` | A created HKD listing like `<listing_35>`, with no internal bid |
| `<commit time>` | 2 hours after `<start>` |

| Row | `<listing_35>`'s internal bid | Listing edit on both listings |
| --- | --- | --- |
| Window | 600000 minor units (HK$6,000.00) | Start moved to 1 minute after `<commit time>` |
| Starting price | 600000 minor units (HK$6,000.00) | Starting price raised to 600100 minor units (HK$6,001) |
| Currency | 1000000100 minor units (HK$10,000,001.00), above the USD ceiling once in USD | Currency changed from HKD to USD |

**Steps:**

1. Open `<listing_35>` and make the row's listing edit.
2. Click Save.
3. Open `<listing_36>` and make the row's listing edit.
4. Click Save.
5. Reopen `<listing_35>` and read it.
6. Reopen `<listing_36>` and read it.

**Expected Results:**

* Step 2 and step 4 save alike, and neither mentions an internal bid.
* Step 5 and step 6 read alike, save the listing's own details; neither shows an Internal bid section or says anything was cleared.

<!-- trace:case id=g10adm.auction-internal-bid.TC-r33 rev=1 covers=g10adm.auction-internal-bid.SC-2l8 -->
### grade10-admin-auction-internal-bid-US7-TC6-1: Stats counts the house as a bidder, matching the public count

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-07

**Pre-conditions:**

* `<listing_37>`'s internal bid is committed, and the house leads it over customer A, the only collector who bid.
* admin(staff, holds auction:operate, not auction:reserve) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_37>` | A published HKD listing taking bids, protected by a committed internal bid |
| `<bidder count>` | 2: customer A and the house |

**Steps:**

1. Open Stats on `<listing_37>`'s row and read the bidder and bid counts.
2. As customer B, open the lot page for `<listing_37>` and read its bid count and Recent bids.

**Expected Results:**

* Step 1 counts `<bidder count>` bidders, the house included.
* Step 1's bid count equals step 2's, the house's bids included.

<!-- trace:case id=g10adm.auction-internal-bid.TC-g02 rev=1 covers=g10adm.auction-internal-bid.SC-ftu,g10adm.auction-listing.SC-cvx -->
### grade10-admin-auction-internal-bid-US7-TC7-1: Once the house bids staff see House, never the amount or time

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-07

**Pre-conditions:**

* `<listing_39>` is published and taking bids, its internal bid of `<house maximum>` committed at `<commit time>` as `<internal bidder>`.
* The house leads `<listing_39>` at `<current bid>` over customer A's maximum `<customer A maximum>`.
* The row's admin, without auction:reserve, is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_39>` | A published HKD listing taking bids, scheduled close a day away |
| `<house maximum>` | 612300 minor units (HK$6,123.00), an amount no bid reaches |
| `<commit time>` | The internal bid's set time |
| `<customer A maximum>` | 500000 minor units (HK$5,000.00) |
| `<current bid>` | 508000 minor units: `<customer A maximum>` plus its 8000 increment |

| Row | admin |
| --- | --- |
| Staff | admin(staff, holds auction:operate) |
| Finance | admin(finance, holds auction:read) |

**Steps:**

1. Read `<listing_39>`'s row in the Listings table.
2. Open `<listing_39>` and read it, its bids included.
3. As customer B, open the lot page for `<listing_39>` and read Recent bids.

**Expected Results:**

* Step 1: the row reads as any published listing with a leading bid; nothing reads Bought in, House or an internal bid.
* Step 2: the house's bids read House, with no account and no maximum.
* Step 2: each House bid shows its own Accepted At, the same time Recent bids shows for it.
* Step 2: no bid reads the house's listing pseudonym, or `<internal bidder>`'s name or email label.
* Step 2 shows no Internal bid section, and `<house maximum>` nowhere.
* Step 2 shows no internal bid state, and no time beside a House bid's own Accepted At.
* Step 3: the house's bids read under its listing pseudonym; nothing reads House or `<internal bidder>`'s name or email label.

<!-- trace:case id=g10adm.auction-internal-bid.TC-gnk rev=1 covers=g10adm.auction-internal-bid.SC-ftu,g10adm.auction-internal-bid.SC-27a -->
### grade10-admin-auction-internal-bid-US7-TC8-1: The staff listing read names the house only once it bids

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-internal-bid-US-07

**Pre-conditions:**

* `<listing_40>` is published and taking bids, with an internal bid in the row's state, as `<internal bidder>`.
* `<listing_41>` is published and taking bids, with no internal bid, customer A leading it at 600000 with maximum `<customer A maximum>`.
* admin(staff, holds auction:operate, not auction:reserve) is signed in to the admin.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_40>` | A published HKD listing taking bids, scheduled close a day away, customer A's maximum `<customer A maximum>` |
| `<listing_41>` | A published HKD listing like `<listing_40>`, with no internal bid |
| `<customer A maximum>` | 700000 minor units (HK$7,000.00) |

| Row | `<listing_40>`'s internal bid | Lead on `<listing_40>` |
| --- | --- | --- |
| Before its time | 800000 minor units, its time an hour ahead | customer A at 600000 |
| Not placed | 550000 minor units, not placed at its time | customer A at 600000 |
| Committed | 600000 minor units, committed | customer A at 608000: 600000 plus its 8000 increment, over the house's bid at 600000 |

**Steps:**

1. Read `<listing_40>` and its bids.
2. Read `<listing_41>` and its bids.
3. Read the API responses.

**Expected Results:**

* Step 3: `<listing_40>`'s read carries no internal bid amount, time, state or internal bidder; a House bid carries only its own Accepted At.
* Step 3: in the Before its time and Not placed rows, no bid is labelled House, and both reads carry the same fields.
* Step 3: in the Committed row, each house bid is labelled House, with no account and no maximum.
* Step 3: no house bid carries the house's listing pseudonym, or `<internal bidder>`'s name or email label.

<!-- trace:case id=g10adm.auction-internal-bid.TC-4b4 rev=1 covers=g10adm.auction-internal-bid.SC-fs2 -->
### grade10-admin-auction-internal-bid-US7-TC9-1: Staff see no row for a house raise or lower

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
* **Trace:** grade10-admin-auction-internal-bid-US-07

**Pre-conditions:**

* `<listing_43>` is published and taking bids, its internal bid of `<house maximum>` committed; the house leads at `<current bid>` over customer A's maximum `<customer A maximum>`.
* admin(holds auction:reserve) is on `<listing_43>`'s editor from <grade10 auction admin listings url>.
* admin(staff, holds auction:operate, not auction:reserve) is signed in to the admin on a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_43>` | A published HKD listing taking bids, scheduled close a day away |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<customer A maximum>` | 500000 minor units (HK$5,000.00) |
| `<current bid>` | 508000 minor units: `<customer A maximum>` plus its 8000 increment |
| `<raised maximum>` | 700000 minor units (HK$7,000.00) |
| `<lowered maximum>` | 650000 minor units (HK$6,500.00), above `<current bid>` |

**Steps:**

1. As the admin holding auction:reserve, change the amount to `<raised maximum>` in the Internal bid section.
2. Click Save.
3. Change the amount to `<lowered maximum>`.
4. Click Save.
5. As the staff admin, open `<listing_43>` and read its bids and activity.

**Expected Results:**

* Step 2 and step 4 are accepted.
* Step 5 lists one House bid, at `<current bid>`.
* Step 5: no row shows `<house maximum>`, `<raised maximum>` or `<lowered maximum>`, a raise or a lower.

<!-- trace:case id=g10adm.auction-internal-bid.TC-mnc rev=1 covers=g10adm.auction-internal-bid.SC-epm -->
### grade10-admin-auction-internal-bid-US7-TC10-1: A reserve holder reads which internal bidder bid on each listing

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
* **Trace:** grade10-admin-auction-internal-bid-US-07

**Pre-conditions:**

* `<listing_56>` is published and taking bids, its internal bid committed as `<bidder P>`; the house leads at `<current bid>` over customer A's maximum `<customer A maximum>`.
* `<listing_57>` is published and taking bids, its internal bid committed as `<bidder Q>`; the house leads at `<current bid>` over customer A's maximum `<customer A maximum>`.
* admin(holds auction:reserve) is on <grade10 auction admin listings url>.
* admin(staff, holds auction:operate, not auction:reserve) is signed in to the admin on a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_56>` | A published HKD listing taking bids, scheduled close a day away, internal bid `<house maximum>` |
| `<house maximum>` | 600000 minor units (HK$6,000.00), on both listings |
| `<listing_57>` | A published HKD listing like `<listing_56>`, internal bid `<house maximum>` |
| `<bidder P>` | An active internal bidder profile: name "QA House P", email label qa-house-p@internal.test |
| `<bidder Q>` | An active internal bidder profile: name "QA House Q", email label qa-house-q@internal.test |
| `<customer A maximum>` | 500000 minor units (HK$5,000.00), on both listings |
| `<current bid>` | 508000 minor units: `<customer A maximum>` plus its 8000 increment |

**Steps:**

1. As the reserve holder, open `<listing_56>` and read its bids.
2. As the reserve holder, open `<listing_57>` and read its bids.
3. As the staff admin, open `<listing_56>` and read its bids.
4. As customer B, open the lot page for `<listing_56>` and read Recent bids.

**Expected Results:**

* Step 1: the house's bid at `<current bid>` reads House with `<bidder P>`'s name and email label, and a maximum of `<house maximum>`.
* Step 2: the house's bid at `<current bid>` reads House with `<bidder Q>`'s name and email label.
* Step 3: the house's bid reads House; nothing shows `<bidder P>`'s name or email label, or `<house maximum>`.
* Step 4: the house's bid reads under its listing pseudonym; nothing shows `<bidder P>`'s name or email label.

<!-- trace:case id=g10adm.auction-internal-bid.TC-k1j rev=1 covers=g10adm.auction-internal-bid.SC-s2h -->
### grade10-admin-auction-internal-bid-US7-TC11-1: An internal bidder's email label finds no listing and no bidder

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-07

**Pre-conditions:**

* `<listing_64>` is published and taking bids, its internal bid committed as `<internal bidder>`; the house leads at `<current bid>` over customer A's maximum `<customer A maximum>`.
* The row's admin is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_64>` | A published HKD listing taking bids, scheduled close a day away, internal bid 600000 minor units |
| `<customer A maximum>` | 500000 minor units (HK$5,000.00) |
| `<current bid>` | 508000 minor units: `<customer A maximum>` plus its 8000 increment |

| Row | admin |
| --- | --- |
| Reserve holder | admin(holds auction:reserve) |
| Staff | admin(staff, holds auction:operate, not auction:reserve) |

**Steps:**

1. Search the Listings table by `<internal bidder>`'s email label.
2. Search the Listings table by customer A's email.
3. Open the bidder moderation list at <grade10 auction admin bidders url> and look for `<internal bidder>`'s name and email label.

**Expected Results:**

* Step 1 matches no listing.
* Step 2 matches `<listing_64>`.
* Step 3 lists no row for `<internal bidder>`.

---

## grade10-admin-auction-internal-bid-US8: Admin learns a listing edit cleared the internal bid

**As an** auction admin,
**I want** to see that a change to a listing's window, starting price or currency cleared its internal bid,
**so that** I can set a new one before the lot sells unprotected.

<!-- trace:case id=g10adm.auction-internal-bid.TC-bgs rev=1 covers=g10adm.auction-internal-bid.SC-rzd,g10adm.auction-internal-bid.SC-bjb -->
### grade10-admin-auction-internal-bid-US8-TC1-1: A window change clears the internal bid only when its time falls outside

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
* **Trace:** grade10-admin-auction-internal-bid-US-08

**Pre-conditions:**

* `<listing_28>` is created, not yet published, with an internal bid of `<house maximum>` at `<commit time>`.
* admin(holds auction:reserve and auction:operate) is on `<listing_28>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_28>` | A created HKD listing, start `<start>` a day away, scheduled close `<scheduled close>` two days away |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<commit time>` | 2 hours after `<start>` |

| Row | Listing edit | Internal bid after Save |
| --- | --- | --- |
| Start past the time | Start moved to 1 minute after `<commit time>` | Cleared |
| Close before the time | Scheduled close moved to 1 minute before `<commit time>` | Cleared |
| Start on the time | Start moved to exactly `<commit time>` | Kept, `<house maximum>` at `<commit time>` |
| Close on the time | Scheduled close moved to exactly `<commit time>` | Kept, `<house maximum>` at `<commit time>` |

**Steps:**

1. Make the row's listing edit in the listing form.
2. Click Save.
3. Reload the editor and read the Internal bid section.

**Expected Results:**

* Step 2 saves the listing edit; no refusal.
* Step 3 reads the row's internal bid.
* Step 3: in a Cleared row, the section shows no internal bid and says the listing edit cleared it, with `<house maximum>` and `<commit time>`.
* Step 3: in a Kept row, the section says nothing was cleared.

<!-- trace:case id=g10adm.auction-internal-bid.TC-96e rev=1 covers=g10adm.auction-internal-bid.SC-36t,g10adm.auction-internal-bid.SC-9xf -->
### grade10-admin-auction-internal-bid-US8-TC2-1: A starting-price change clears the internal bid only when the price passes it

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
* **Trace:** grade10-admin-auction-internal-bid-US-08

**Pre-conditions:**

* `<listing_47>` is created, not yet published, with an internal bid of `<house maximum>` at `<commit time>`.
* admin(holds auction:reserve and auction:operate) is on `<listing_47>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_47>` | A created HKD listing, start `<start>` a day away, scheduled close two days away |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<commit time>` | 2 hours after `<start>` |

| Row | Starting price after the edit | Internal bid after Save |
| --- | --- | --- |
| At the amount | 600000 minor units, equal to `<house maximum>` | Kept, `<house maximum>` at `<commit time>` |
| Above the amount | 600100 minor units (HK$6,001), one major unit above `<house maximum>` | Cleared |

**Steps:**

1. Change the starting price to the row's amount in the listing form.
2. Click Save.
3. Reload the editor and read the Internal bid section.

**Expected Results:**

* Step 2 saves the listing edit; no refusal.
* Step 3 reads the row's internal bid.
* Step 3: in the Cleared row, the section shows no internal bid and says the listing edit cleared it, with `<house maximum>` and `<commit time>`.
* Step 3: in the Kept row, the section says nothing was cleared.

<!-- trace:case id=g10adm.auction-internal-bid.TC-qxx rev=1 covers=g10adm.auction-internal-bid.SC-wib,g10adm.auction-internal-bid.SC-qzx,g10adm.auction-internal-bid.SC-ps0 -->
### grade10-admin-auction-internal-bid-US8-TC3-1: A currency change keeps the minor units and clears an amount that no longer fits

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
* **Trace:** grade10-admin-auction-internal-bid-US-08

**Pre-conditions:**

* `<listing_48>` is created, not yet published, in the row's currency, with an internal bid of the row's amount at `<commit time>`.
* admin(holds auction:reserve and auction:operate) is on `<listing_48>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_48>` | A created listing, start `<start>` a day away, scheduled close two days away |
| `<commit time>` | 2 hours after `<start>` |
| `<USD ceiling>` | 1000000000 minor units (USD 10,000,000.00), the USD ceiling |

| Row | Internal bid before the edit | Currency change | Internal bid after Save |
| --- | --- | --- | --- |
| Carried over | 600000 minor units (HK$6,000.00) | HKD to USD | Kept, 600000 minor units (USD 6,000.00) at `<commit time>` |
| At the new ceiling | 1000000000 minor units (HK$10,000,000.00) | HKD to USD | Kept, `<USD ceiling>` at `<commit time>` |
| Above the new ceiling | 1000000100 minor units (HK$10,000,001.00), one major unit above `<USD ceiling>` once in USD | HKD to USD | Cleared |
| Not whole in the new currency | 600050 minor units (JPY 600,050), which reads HK$6,000.50 once in HKD | JPY to HKD | Cleared |

**Steps:**

1. Change the currency as the row states in the listing form.
2. Click Save.
3. Reload the editor and read the Internal bid section.

**Expected Results:**

* Step 2 saves the listing edit; no refusal.
* Step 3 reads the row's internal bid.
* Step 3: in a Cleared row, the section shows no internal bid and says the listing edit cleared it, with the row's amount before the edit and `<commit time>`.
* Step 3: in a Kept row, the section says nothing was cleared.

<!-- trace:case id=g10adm.auction-internal-bid.TC-o5e rev=1 covers=g10adm.auction-internal-bid.SC-rzd -->
### grade10-admin-auction-internal-bid-US8-TC4-1: A reserve holder sees the clearing whoever made the edit

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
* **Trace:** grade10-admin-auction-internal-bid-US-08

**Pre-conditions:**

* `<listing_49>` is created, not yet published, with an internal bid of `<house maximum>` at `<commit time>`, set by the setter, admin(holds auction:reserve).
* The row's editor moved `<listing_49>`'s start to 1 minute after `<commit time>` and saved.
* A second admin(holds auction:reserve), who neither set the internal bid nor made the edit, is signed in to the admin on another session.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_49>` | A created HKD listing, start `<start>` a day away, scheduled close two days away |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<commit time>` | 2 hours after `<start>` |

| Row | Editor |
| --- | --- |
| Reserve holder | The setter |
| Staff | admin(staff, holds auction:write and auction:operate, not auction:reserve) |

**Steps:**

1. As the setter, open `<listing_49>`'s editor and read the Internal bid section.
2. As the second admin, open `<listing_49>`'s editor and read the Internal bid section.

**Expected Results:**

* Step 1 and step 2 each show no internal bid, and say the listing edit cleared it, with `<house maximum>`, `<internal bidder>` and `<commit time>`.

<!-- trace:case id=g10adm.auction-internal-bid.TC-m9d rev=1 covers=g10adm.auction-internal-bid.SC-pzs -->
### grade10-admin-auction-internal-bid-US8-TC5-1: After a clearing the admin sets a new internal bid and it commits

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
* **Trace:** grade10-admin-auction-internal-bid-US-08

**Pre-conditions:**

* `<listing_50>` is created, not yet published, and a starting-price change to `<new starting price>` cleared its internal bid.
* admin(holds auction:reserve and auction:operate) is on `<listing_50>`'s editor from <grade10 auction admin listings url>, the section saying the listing edit cleared the internal bid.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_50>` | A created HKD listing, start `<start>` 10 minutes away, scheduled close a day later |
| `<new starting price>` | 600100 minor units (HK$6,001.00) |
| `<new maximum>` | 700000 minor units (HK$7,000.00), above `<new starting price>` |
| `<commit time>` | 5 minutes after `<start>` |

**Steps:**

1. In the Internal bid section, enter `<new maximum>` and `<commit time>`.
2. Click Save.
3. Publish `<listing_50>` now.
4. Wait until `<commit time>` passes, taking no action.
5. Reload the editor and read the Internal bid section.
6. As customer B, open the lot page for `<listing_50>` and read Highest bid and Recent bids.

**Expected Results:**

* Step 2 is accepted.
* Step 5 shows `<new maximum>` committed at `<commit time>`, and no longer says a listing edit cleared it.
* Step 6: the house leads at `<new starting price>`, one bid, under its listing pseudonym.

---

## grade10-admin-auction-internal-bid-US9: Admin keeps the internal bidders an internal bid can bid as

**As an** auction admin,
**I want** to add, rename and retire internal bidder profiles in auction admin,
**so that** each listing's internal bid can bid as the internal bidder I choose for it.

<!-- trace:case id=g10adm.auction-internal-bid.TC-wkj rev=1 covers=g10adm.auction-internal-bid.SC-piq -->
### grade10-admin-auction-internal-bid-US9-TC1-1: An added internal bidder is offered at Save and has no site account

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
* **Trace:** grade10-admin-auction-internal-bid-US-09

**Pre-conditions:**

* No internal bidder profile and no site account carries `<new label>`.
* `<listing_58>` is published and Upcoming, with no internal bid.
* admin(holds auction:reserve) is on <grade10 auction admin internal bidders url>.
* admin(holds `user:list`) is signed in to the admin on a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<new name>` | "QA House New" |
| `<new label>` | qa-house-new@internal.test, carried by no profile and no account |
| `<listing_58>` | A published HKD listing, scheduled start an hour away, scheduled close a day later |

**Steps:**

1. Add an internal bidder with `<new name>` and `<new label>`.
2. Save the new internal bidder.
3. Read the internal bidders list.
4. Open `<listing_58>`'s editor and open the internal bidder pick in the Internal bid section.
5. As the admin holding `user:list`, open <grade10 admin users url> and search for `<new label>`.

**Expected Results:**

* Step 2 is accepted.
* Step 3 lists `<new name>` with `<new label>`, active.
* Step 4 offers `<new name>`.
* Step 5 finds no account for `<new label>`.

<!-- trace:case id=g10adm.auction-internal-bid.TC-kg8 rev=1 covers=g10adm.auction-internal-bid.SC-h93 -->
### grade10-admin-auction-internal-bid-US9-TC2-1: A new internal bidder without a name or with a label already used is refused

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-auction-internal-bid-US-09

**Pre-conditions:**

* `<bidder P>` is an active internal bidder profile.
* `<bidder R>` is a retired internal bidder profile.
* admin(holds auction:reserve) is on <grade10 auction admin internal bidders url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<bidder P>` | An active internal bidder profile: name "QA House P", email label qa-house-p@internal.test |
| `<bidder R>` | A retired internal bidder profile: name "QA House R", email label qa-house-r@internal.test |

| Row | Name | Email label |
| --- | --- | --- |
| Label in use | "QA House Copy" | qa-house-p@internal.test, `<bidder P>`'s label |
| Label in use, other letter case | "QA House Copy" | QA-House-P@internal.test, `<bidder P>`'s label in other letter case |
| Label of a retired profile | "QA House Copy" | qa-house-r@internal.test, `<bidder R>`'s label |
| Not an email address | "QA House Copy" | qa-house-copy |
| No name | Empty | qa-house-blank@internal.test |
| No label | "QA House No Label" | Empty |

**Steps:**

1. Add an internal bidder with the row's name and email label.
2. Save the new internal bidder.
3. Reload <grade10 auction admin internal bidders url> and read the list.

**Expected Results:**

* Step 2 is refused, and says which value is wrong.
* Step 3 lists no internal bidder from the row; `<bidder P>` and `<bidder R>` are unchanged.

<!-- trace:case id=g10adm.auction-internal-bid.TC-g99 rev=1 covers=g10adm.auction-internal-bid.SC-ec7 -->
### grade10-admin-auction-internal-bid-US9-TC3-1: An internal bidder's name changes at any time

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
* **Trace:** grade10-admin-auction-internal-bid-US-09

**Pre-conditions:**

* `<bidder P>` is an active internal bidder profile, in use as the row states.
* admin(holds auction:reserve) is on <grade10 auction admin internal bidders url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<bidder P>` | An active internal bidder profile: name "QA House P", email label qa-house-p@internal.test |
| `<new name>` | "QA House P Renamed" |
| `<listing_59>` | A published HKD listing taking bids, scheduled close a day away |

| Row | `<bidder P>`'s use |
| --- | --- |
| Never used | Named on no internal bid |
| Scheduled | Named on `<listing_59>`'s internal bid, its time an hour ahead |
| Has bid | Named on `<listing_59>`'s internal bid, committed, the house's bid placed |

**Steps:**

1. Change `<bidder P>`'s name to `<new name>`.
2. Save the change.
3. Reload the list and read `<bidder P>`'s row.
4. Outside the Never used row, open `<listing_59>`'s editor and read the Internal bid section.
5. In the Has bid row, read `<listing_59>`'s bids.

**Expected Results:**

* Step 2 is accepted in every row.
* Step 3 shows `<new name>` with the email label qa-house-p@internal.test, still active.
* Step 4 shows the internal bid as `<new name>`, its amount and time unchanged.
* Step 5: the house's bid reads House with `<new name>`, not "QA House P".

<!-- trace:case id=g10adm.auction-internal-bid.TC-xjb rev=1 covers=g10adm.auction-internal-bid.SC-2x8 -->
### grade10-admin-auction-internal-bid-US9-TC4-1: An internal bidder's email label is fixed once it has bid

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
* **Trace:** grade10-admin-auction-internal-bid-US-09

**Pre-conditions:**

* `<bidder P>` is an active internal bidder profile, in use as the row states.
* admin(holds auction:reserve) is on <grade10 auction admin internal bidders url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<bidder P>` | An active internal bidder profile: name "QA House P", email label qa-house-p@internal.test |
| `<new label>` | qa-house-p2@internal.test, carried by no profile |
| `<bidder Q>` | An active internal bidder profile: name "QA House Q", email label qa-house-q@internal.test |
| `<listing_59>` | A published HKD listing taking bids, scheduled close a day away |

| Row | `<bidder P>`'s use | New label | Save |
| --- | --- | --- | --- |
| Never used | Named on no internal bid | `<new label>` | Accepted; the row shows `<new label>` |
| Scheduled only | Named on `<listing_59>`'s internal bid, its time an hour ahead | `<new label>` | Accepted; the row shows `<new label>` |
| Not placed only | Named on `<listing_59>`'s internal bid, not placed at its time; it never bid | `<new label>` | Accepted; the row shows `<new label>` |
| Has bid | Named on `<listing_59>`'s internal bid, committed, the house's bid placed | `<new label>` | Refused, saying the label is fixed; the row still shows qa-house-p@internal.test |
| Label in use | Named on no internal bid | qa-house-q@internal.test, `<bidder Q>`'s label | Refused, saying the label is in use; the row still shows qa-house-p@internal.test |

**Steps:**

1. Change `<bidder P>`'s email label to the row's new label.
2. Save the change.
3. Reload the list and read `<bidder P>`'s row.
4. In the Scheduled only row, open `<listing_59>`'s editor and read the Internal bid section.

**Expected Results:**

* Step 2 reads the row's Save outcome.
* Step 3 shows the row's label for `<bidder P>`, its name unchanged.
* Step 4 shows the internal bid Scheduled, still as `<bidder P>`.

<!-- trace:case id=g10adm.auction-internal-bid.TC-8at rev=1 covers=g10adm.auction-internal-bid.SC-bio -->
### grade10-admin-auction-internal-bid-US9-TC5-1: A retired internal bidder is no longer offered and keeps its history

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
* **Trace:** grade10-admin-auction-internal-bid-US-09

**Pre-conditions:**

* `<bidder P>` is an active internal bidder profile, in use as the row states.
* `<listing_61>` is published and Upcoming, with no internal bid.
* admin(holds auction:reserve) is on <grade10 auction admin internal bidders url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<bidder P>` | An active internal bidder profile: name "QA House P", email label qa-house-p@internal.test |
| `<listing_60>` | An HKD listing whose internal bid names `<bidder P>`, as the row states |
| `<listing_61>` | A published HKD listing, scheduled start an hour away, scheduled close a day later |

| Row | `<bidder P>`'s use |
| --- | --- |
| Never used | Named on no internal bid; `<listing_60>` unused |
| Placed, lot taking bids | Named only on `<listing_60>`'s internal bid, committed, the house leading at 508000 over customer A's maximum of 500000 |
| Bought in | Named only on `<listing_60>`'s internal bid, the lot closed Bought in at 508000 |

**Steps:**

1. Retire `<bidder P>`.
2. Reload the list and read `<bidder P>`'s row.
3. Open `<listing_61>`'s editor and open the internal bidder pick in the Internal bid section.
4. Outside the Never used row, open `<listing_60>` and read its bids.

**Expected Results:**

* Step 1 is accepted in every row.
* Step 2 shows `<bidder P>` retired, its name and email label kept.
* Step 3 does not offer `<bidder P>`.
* Step 4: the house's bid at 508000 still names `<bidder P>`.

<!-- trace:case id=g10adm.auction-internal-bid.TC-skz rev=1 covers=g10adm.auction-internal-bid.SC-9ng -->
### grade10-admin-auction-internal-bid-US9-TC6-1: An internal bidder named on a Scheduled or Not placed internal bid cannot be retired

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
* **Trace:** grade10-admin-auction-internal-bid-US-09

**Pre-conditions:**

* `<bidder P>` is an active internal bidder profile, named on `<listing_62>`'s internal bid in the row's state.
* admin(holds auction:reserve) is on <grade10 auction admin internal bidders url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<bidder P>` | An active internal bidder profile: name "QA House P", email label qa-house-p@internal.test |
| `<listing_62>` | A published HKD listing taking bids, scheduled close a day away |

| Row | `<listing_62>`'s internal bid |
| --- | --- |
| Scheduled | 600000 minor units, its time an hour ahead |
| Not placed | 550000 minor units, not placed at its time, customer A leading at 600000 |

**Steps:**

1. Retire `<bidder P>`.
2. Reload the list and read `<bidder P>`'s row.
3. Open `<listing_62>`'s editor and read the Internal bid section.

**Expected Results:**

* Step 1 is refused, saying `<bidder P>` is in use and naming `<listing_62>`.
* Step 2 shows `<bidder P>` active.
* Step 3 shows the internal bid in the row's state, as `<bidder P>`.

<!-- trace:case id=g10adm.auction-internal-bid.TC-eo1 rev=1 covers=g10adm.auction-internal-bid.SC-d57 -->
### grade10-admin-auction-internal-bid-US9-TC7-1: Internal bidders cannot be added, renamed or retired without secret-floor access

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
* **Trace:** grade10-admin-auction-internal-bid-US-09

**Pre-conditions:**

* `<bidder P>` is an active internal bidder profile, named on no internal bid.
* admin(staff, holds auction:operate and auction:write, not auction:reserve) is signed in to the admin.

**Test data:**

| Field | Value |
| --- | --- |
| `<bidder P>` | An active internal bidder profile: name "QA House P", email label qa-house-p@internal.test |

| Row | Call |
| --- | --- |
| List | Read the internal bidders list |
| Add | Add an internal bidder named "QA House Staff", email label qa-house-staff@internal.test |
| Rename | Change `<bidder P>`'s name to "QA House P Staff" |
| Change label | Change `<bidder P>`'s email label to qa-house-p-staff@internal.test |
| Retire | Retire `<bidder P>` |

**Steps:**

1. Send the row's call.
2. Read the API response.
3. As admin(holds auction:reserve), read the internal bidders list.

**Expected Results:**

* Step 2 refuses the call for the missing access.
* Step 3 lists `<bidder P>` unchanged and active, and no "QA House Staff".

<!-- trace:case id=g10adm.auction-internal-bid.TC-fnh rev=1 covers=g10adm.auction-internal-bid.SC-d6h -->
### grade10-admin-auction-internal-bid-US9-TC8-1: The audit trail records each internal bidder act, never a listing

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-auction-internal-bid-US-09

**Pre-conditions:**

* `<bidder P>` is an active internal bidder profile, named on `<listing_65>`'s Scheduled internal bid of `<house maximum>`.
* `<bidder S>` is an active internal bidder profile, named on no internal bid.
* admin(holds auction:reserve) is on <grade10 auction admin internal bidders url>.
* admin(holds audit access, not auction:reserve) is signed in to the admin on a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<bidder P>` | An active internal bidder profile: name "QA House P", email label qa-house-p@internal.test |
| `<bidder S>` | An active internal bidder profile: name "QA House S", email label qa-house-s@internal.test |
| `<listing_65>` | A published HKD listing, scheduled close a day away |
| `<house maximum>` | 612300 minor units (HK$6,123.00), an amount no other entry carries |

| Row | Act | Entry records |
| --- | --- | --- |
| Add | Add an internal bidder named "QA House Audit", email label qa-house-audit@internal.test | An internal bidder was added |
| Rename | Change `<bidder P>`'s name to "QA House P Renamed" | An internal bidder was renamed |
| Change label | Change `<bidder P>`'s email label to qa-house-p2@internal.test | An internal bidder's email label was changed |
| Retire | Retire `<bidder S>` | An internal bidder was retired |

**Steps:**

1. Make the row's act and save it.
2. As the admin holding audit access, open <grade10 audit trail url> and find the newest entry for the internal bidder.

**Expected Results:**

* Step 1 is accepted.
* Step 2 shows one entry recording the row's act on that internal bidder, by the admin who made it, at Grade10's time.
* Step 2: the entry names no listing, and shows `<house maximum>` in no form, such as 612300 or 6,123.

## Settled

- An internal bid can be set on a Created or a Published listing, never on a Draft; a window change on a Created listing that leaves its time outside the window clears it, and only a reserve holder sees that (Q10)
- A starting-price or currency change on a Created listing that leaves the internal bid outside its limits saves as usual and clears it; only a reserve holder sees that (Q24)
- After a currency change, a kept internal bid holds the same count of minor units; it clears when that count is above the new ceiling, below the starting price or not a whole major unit of the new currency (Q27)
- Above the ceiling, below the starting price, a fraction of a major unit and a time already past are refused at Save; the minimum next bid is judged at the commit time, not at Save (Q11, Q17)
- A raise still short of the minimum next bid is refused, on a Placed or a Not placed internal bid (Q11)
- A Placed internal bid cannot be removed and its time is fixed; a Scheduled or a Not placed one can be removed (Q4, Q11)
- A time that arrives while the listing is still Created leaves the internal bid Not placed, and publishing does not commit it (Q23)
- A Not placed internal bid saves at any amount the Save rules allow while the listing is Created and stays Not placed; once the lot takes bids, a save at or above the minimum next bid, its own amount included, places it, a lower stays Not placed, and a raise still below the minimum next bid is refused (Q28)
- A save on a listing that has an internal bid changes that one; a listing never carries two (Q18)
- A lower is accepted whoever leads, when the leader and the current bid stay the same and it is not below a bid already placed for the house (Q3)
- A lower that both moves the lead or the current bid and falls below a bid already placed for the house is refused naming only the house's bid (Q30)
- Staff without `auction:reserve` read the house's bids as House, each with its own Accepted At even where it equals the commit time, and Bought in after the close; never the amount, the commit time, or that a lot has an internal bid before the house bids (Q9, Q25, Q26)
- The audit trail records each set, change and removal without the amount or the time; an operator with audit access only may learn from it that a lot has an internal bid (Q6, Q29)
- Once the lot takes bids, a re-save of a Not placed internal bid at its own amount, still below the minimum next bid, is refused naming the minimum next bid; only a lower is accepted below it (Q34)
- A lower of a Not placed internal bid that still reaches the minimum next bid places it at once (Q35)
- A bought-in listing's own page and its Listings table row read Bought in once the lot closes, for every operator (Q32)
- The house is never a lot's winner for orders, order letters or post-sale work: a bought-in lot opens no order and enters no post-sale queue (Q33)
- A reserve holder reads which internal bidder bid on each listing, and the cleared notice names the internal bidder it cleared; other operators read House with no name or email label, and collectors read the listing pseudonym (Q39)
- A Placed or Not placed internal bid keeps its internal bidder once that profile is retired, and a Placed one still raises and lowers as it (Q41)
- An email label is an email address, unique across every profile, Retired ones included, compared ignoring letter case; it may equal a collector's email and is never mailed (Q42)
- A Retired internal bidder is never made Active again; a new profile is added instead (Q43)
- A Listings search by email never matches an internal bidder's email label, for any operator (Q44)
- Every read shows an internal bidder's current name, past bids included; names need not be unique (Q45)
- An operator without `auction:reserve` sees no Internal bidders page and no internal bidder in any read (Q46)
- The audit trail records each add, rename, email label change and retirement of an internal bidder with the operator and the time; no audit row links an internal bidder to a listing (Q47)

## Reconciliation

**Run:** QA2 round 5, 2026-10-12. QA1's round-5 blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md` with `grade10-admin-auction-internal-bid-US-09`, `proposal.md`, `decisions.md` with its `## Raised` table through Q40, the linked pages under `docs/prds/`, this suite with `## Reconciliation` stripped and its `## Settled`, and the change's domain draft above the capability with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. Dev's round-5 reading added `grade10-admin-auction-internal-bid-SC-54` to `grade10-admin-auction-internal-bid-SC-67`, `grade10-site-auction-auto-bidding-SC-47` and the internal bidder requirement without QA1's cases. QA2 read QA1's blocks, the delta specs, `decisions.md` through Q47, `tech-design.md`, `tasks.md`, the durable specs and suites, and the PRD pages; not the archive. The round-4 dispositions below the round-5 bullets stand where not restated. It is a statement, not proof.

- **Round 5, folded in** - `grade10-admin-auction-internal-bid-US1-TC1-1` keeps `grade10-admin-auction-internal-bid-SC-01` and `grade10-admin-auction-internal-bid-SC-08`, its pick and its read of the internal bidder joined to the same run; `grade10-admin-auction-internal-bid-US1-TC3-1` gains its No internal bidder row for `grade10-admin-auction-internal-bid-SC-54`; `grade10-admin-auction-internal-bid-US1-TC12-1` (new) by `grade10-admin-auction-internal-bid-SC-58`; `grade10-admin-auction-internal-bid-US1-TC13-1` (new) by `grade10-admin-auction-internal-bid-SC-56` and `grade10-admin-auction-internal-bid-SC-57`; `grade10-admin-auction-internal-bid-US1-TC14-1` (new) by `grade10-admin-auction-internal-bid-SC-55`; `grade10-admin-auction-internal-bid-US7-TC1-1` by `grade10-admin-auction-internal-bid-SC-18`, `grade10-admin-auction-internal-bid-SC-39` and `grade10-admin-auction-internal-bid-SC-66`; `grade10-admin-auction-internal-bid-US7-TC2-1` gains its Change bidder row for `grade10-admin-auction-internal-bid-SC-19`; `grade10-admin-auction-internal-bid-US7-TC3-1` gains its Change bidder row for `grade10-admin-auction-internal-bid-SC-20`; `grade10-admin-auction-internal-bid-US7-TC7-1` and `grade10-admin-auction-internal-bid-US7-TC8-1` keep their scenarios, reading no internal bidder; `grade10-admin-auction-internal-bid-US7-TC10-1` (new) by `grade10-admin-auction-internal-bid-SC-67`; `grade10-admin-auction-internal-bid-US9-TC1-1` by `grade10-admin-auction-internal-bid-SC-60`; `grade10-admin-auction-internal-bid-US9-TC2-1` by `grade10-admin-auction-internal-bid-SC-61`; `grade10-admin-auction-internal-bid-US9-TC3-1` by `grade10-admin-auction-internal-bid-SC-62`; `grade10-admin-auction-internal-bid-US9-TC4-1` by `grade10-admin-auction-internal-bid-SC-63`; `grade10-admin-auction-internal-bid-US9-TC5-1` by `grade10-admin-auction-internal-bid-SC-65`; `grade10-admin-auction-internal-bid-US9-TC6-1` by `grade10-admin-auction-internal-bid-SC-64`; `grade10-admin-auction-internal-bid-US9-TC7-1` by `grade10-admin-auction-internal-bid-SC-66`
- **Round 5, joined to the run they share** - `grade10-admin-auction-internal-bid-US1-TC12-1` seeds two collectors on the first lot and reads each lot's own pseudonym, for `grade10-site-auction-auto-bidding-SC-47`; `grade10-admin-auction-internal-bid-US1-TC13-1` reads the lot page before and after the save and the internal bid's state, as `grade10-admin-auction-internal-bid-SC-56` and `grade10-admin-auction-internal-bid-SC-57` state; `grade10-admin-auction-internal-bid-US7-TC1-1` looks for Internal bidders in the navigation, for `grade10-admin-auction-internal-bid-SC-66`; `grade10-admin-auction-internal-bid-US7-TC10-1` reads the email label and the maximum beside the name, and staff read no maximum, as `grade10-admin-auction-internal-bid-SC-67` states; `grade10-admin-auction-internal-bid-US9-TC2-1` gains rows for a label in other letter case, a Retired profile's label and a label that is not an email address (Q42, `grade10-admin-auction-internal-bid-SC-61`); `grade10-admin-auction-internal-bid-US9-TC3-1` reads the house's bid under the new name (Q45, `grade10-admin-auction-internal-bid-SC-62`); `grade10-admin-auction-internal-bid-US9-TC4-1` reads the Scheduled internal bid still naming the profile (`grade10-admin-auction-internal-bid-SC-63`); `grade10-admin-auction-internal-bid-US9-TC7-1` gains a List row (`grade10-admin-auction-internal-bid-SC-66`). Every case keeps its version as a draft
- **Round 5, corrected to the requirement** - `grade10-admin-auction-internal-bid-US1-TC13-1` expected a bidder change on a Placed or Not placed internal bid to be refused saying the time has passed; the requirement, under Q37, names it Internal bidder is fixed, and the case now says so. Its Not placed row now starts at `<starting price>`, short of the 408000 minimum next bid, so one pre-condition holds every row. `grade10-admin-auction-internal-bid-US1-TC14-1` said not active and `grade10-admin-auction-internal-bid-US9-TC6-1` said an internal bid still uses the profile; they now read retired, and in use naming the listing, as `grade10-admin-auction-internal-bid-SC-55` and `grade10-admin-auction-internal-bid-SC-64` state. Each reading names the same refusal; none moves an outcome
- **Round 5, settled questions applied** - Q39: `grade10-admin-auction-internal-bid-SC-28` rises to revision 2, naming the internal bidder in the cleared notice, and `grade10-admin-auction-internal-bid-US8-TC4-1` reads it; Q47: `grade10-admin-auction-internal-bid-SC-20` rises to revision 2, the audit row showing no internal bidder, and `grade10-admin-auction-internal-bid-US7-TC3-1` reads none. QA2 added `grade10-admin-auction-internal-bid-SC-68` (Q47, an internal bidder act audited with no listing) with `grade10-admin-auction-internal-bid-US9-TC8-1`, and `grade10-admin-auction-internal-bid-SC-69` (Q44, an email label matches no Listings search or moderation row) with `grade10-admin-auction-internal-bid-US7-TC11-1`; no scenario stated either. All four cases keep or start at version 1 as drafts
- **Round 5, added by QA2** - `grade10-admin-auction-internal-bid-US3-TC6-1`: a Placed internal bid raises as its Retired internal bidder (Q41), for `grade10-admin-auction-internal-bid-SC-59`, which no blind case reached
- **Round 5, anchors** - `grade10-admin-auction-internal-bid-SC-66` serves `grade10-admin-auction-internal-bid-US-07` and `grade10-admin-auction-internal-bid-SC-67` serves `grade10-admin-auction-internal-bid-US-09` and `grade10-site/auction/auto-bidding#grade10-site-auction-auto-bidding-US-04`; QA1 placed the profile refusals under `grade10-admin-auction-internal-bid-US-09` and the reserve holder's read under `grade10-admin-auction-internal-bid-US-07`. `grade10-admin-auction-internal-bid-US9-TC7-1` and `grade10-admin-auction-internal-bid-US7-TC10-1` keep their traces and cover those scenarios, joined on the behaviour, and `grade10-admin-auction-internal-bid-US7-TC1-1` covers the missing Internal bidders page under `grade10-admin-auction-internal-bid-US-07`. `grade10-site-auction-auto-bidding-SC-47` serves the auto-bidding Feature set group `House maximum` and is covered here by `grade10-admin-auction-internal-bid-US1-TC12-1`
- **Round 5, rejected** - none
- **Round 5, raised** - none; QA1's round-5 questions landed as Q39 and Q41 to Q47 before this run
- **Folded in** - `grade10-admin-auction-internal-bid-US1-TC1-1` by `grade10-admin-auction-internal-bid-SC-01`, `grade10-admin-auction-internal-bid-SC-08` and `grade10-site-auction-auto-bidding-SC-33`; `grade10-admin-auction-internal-bid-US1-TC2-1` by `grade10-admin-auction-internal-bid-SC-22`; `grade10-admin-auction-internal-bid-US1-TC3-1` by `grade10-admin-auction-internal-bid-SC-02`, `grade10-admin-auction-internal-bid-SC-04`, `grade10-admin-auction-internal-bid-SC-23`, `grade10-admin-auction-internal-bid-SC-24` and `grade10-admin-auction-internal-bid-SC-41`; `grade10-admin-auction-internal-bid-US1-TC4-1` by `grade10-admin-auction-internal-bid-SC-01` and `grade10-site-auction-auto-bidding-SC-36`; `grade10-admin-auction-internal-bid-US1-TC5-1` by `grade10-admin-auction-internal-bid-SC-25` and `grade10-admin-auction-internal-bid-SC-48`; `grade10-admin-auction-internal-bid-US1-TC6-1` by `grade10-admin-auction-internal-bid-SC-04`; `grade10-admin-auction-internal-bid-US1-TC7-1` by `grade10-admin-auction-internal-bid-SC-01`; `grade10-admin-auction-internal-bid-US1-TC8-1` by `grade10-admin-auction-internal-bid-SC-26` and `grade10-admin-auction-internal-bid-SC-08`; `grade10-admin-auction-internal-bid-US1-TC9-1` by `grade10-admin-auction-internal-bid-SC-03`; `grade10-admin-auction-internal-bid-US1-TC11-1` by `grade10-admin-auction-internal-bid-SC-05`
- **Folded in** - `grade10-admin-auction-internal-bid-US2-TC1-1` by `grade10-admin-auction-internal-bid-SC-06`; `grade10-admin-auction-internal-bid-US2-TC2-1` by `grade10-admin-auction-internal-bid-SC-07`; `grade10-admin-auction-internal-bid-US2-TC3-1` by `grade10-admin-auction-internal-bid-SC-02` and `grade10-admin-auction-internal-bid-SC-41`; `grade10-admin-auction-internal-bid-US2-TC4-1` by `grade10-admin-auction-internal-bid-SC-21`
- **Folded in** - `grade10-admin-auction-internal-bid-US3-TC1-1` by `grade10-admin-auction-internal-bid-SC-13`; `grade10-admin-auction-internal-bid-US3-TC2-1` by `grade10-site-auction-auto-bidding-SC-41`; `grade10-admin-auction-internal-bid-US3-TC3-1` by `grade10-admin-auction-internal-bid-SC-45`; `grade10-admin-auction-internal-bid-US3-TC4-1` by `grade10-admin-auction-internal-bid-SC-12`; `grade10-admin-auction-internal-bid-US3-TC5-1` by `grade10-admin-auction-internal-bid-SC-44`
- **Folded in** - `grade10-admin-auction-internal-bid-US4-TC1-1` by `grade10-admin-auction-internal-bid-SC-47`; `grade10-admin-auction-internal-bid-US4-TC2-2` by `grade10-admin-auction-internal-bid-SC-15`, `grade10-admin-auction-internal-bid-SC-50` and `grade10-site-auction-auto-bidding-SC-43`; `grade10-admin-auction-internal-bid-US4-TC3-1` by `grade10-admin-auction-internal-bid-SC-46`; `grade10-admin-auction-internal-bid-US4-TC4-1` by `grade10-admin-auction-internal-bid-SC-14`, `grade10-admin-auction-internal-bid-SC-16`, `grade10-site-auction-auto-bidding-SC-42` and `grade10-site-auction-auto-bidding-SC-44`
- **Folded in** - `grade10-admin-auction-internal-bid-US5-TC1-1` by `grade10-admin-auction-internal-bid-SC-09`, `grade10-admin-auction-internal-bid-SC-27` and `grade10-site-auction-auto-bidding-SC-38`; `grade10-admin-auction-internal-bid-US5-TC2-1` by `grade10-admin-auction-internal-bid-SC-10`; `grade10-admin-auction-internal-bid-US5-TC3-1` by `grade10-admin-auction-internal-bid-SC-09`; `grade10-admin-auction-internal-bid-US5-TC4-1` by `grade10-admin-auction-internal-bid-SC-30`; `grade10-admin-auction-internal-bid-US5-TC5-1` by `grade10-admin-auction-internal-bid-SC-31`; `grade10-admin-auction-internal-bid-US5-TC6-1` by `grade10-admin-auction-internal-bid-SC-11` and `grade10-admin-auction-internal-bid-SC-52`; `grade10-admin-auction-internal-bid-US5-TC7-1` by `grade10-admin-auction-internal-bid-SC-37`, `grade10-admin-auction-internal-bid-SC-38`, `grade10-admin-auction-internal-bid-SC-53` and `grade10-site-auction-auto-bidding-SC-46`; `grade10-admin-auction-internal-bid-US5-TC8-1` (new, Q28) by `grade10-admin-auction-internal-bid-SC-38`, its Lowered rows further members of the class the requirement's item 2 states
- **Folded in** - `grade10-admin-auction-internal-bid-US6-TC1-1` by `grade10-admin-auction-internal-bid-SC-17`, `grade10-site-auction-auction-SC-104` and `grade10-site-auction-auction-SC-106`; `grade10-admin-auction-internal-bid-US6-TC2-1` (new, Q32) by `grade10-admin-auction-internal-bid-SC-17`, `grade10-admin-auction-listing-SC-158` and `grade10-admin-auction-listing-SC-155`; `grade10-admin-auction-internal-bid-US6-TC3-1` (new, Q33) by `grade10-admin-auction-internal-bid-SC-49` and `winner-order-SC-277`
- **Folded in** - `grade10-admin-auction-internal-bid-US7-TC1-1` by `grade10-admin-auction-internal-bid-SC-18` and `grade10-admin-auction-internal-bid-SC-39`; `grade10-admin-auction-internal-bid-US7-TC2-1` by `grade10-admin-auction-internal-bid-SC-19`; `grade10-admin-auction-internal-bid-US7-TC3-1` by `grade10-admin-auction-internal-bid-SC-20`; `grade10-admin-auction-internal-bid-US7-TC4-1` by `grade10-admin-auction-internal-bid-SC-32`, `grade10-admin-auction-listing-SC-158` and `grade10-admin-auction-listing-SC-155`, its new result that the listing's page reads Bought in joined to the same run (Q32), version kept; `grade10-admin-auction-internal-bid-US7-TC5-2` by `grade10-admin-auction-internal-bid-SC-18`, `grade10-admin-auction-internal-bid-SC-28`, `grade10-admin-auction-internal-bid-SC-34` and `grade10-admin-auction-internal-bid-SC-35`; `grade10-admin-auction-internal-bid-US7-TC6-1` by `grade10-admin-auction-internal-bid-SC-33`; `grade10-admin-auction-internal-bid-US7-TC7-1` by `grade10-admin-auction-internal-bid-SC-32` and `grade10-admin-auction-listing-SC-160`; `grade10-admin-auction-internal-bid-US7-TC8-1` by `grade10-admin-auction-internal-bid-SC-32` and `grade10-admin-auction-internal-bid-SC-39`; `grade10-admin-auction-internal-bid-US7-TC9-1` by `grade10-admin-auction-internal-bid-SC-40`
- **Folded in** - `grade10-admin-auction-internal-bid-US8-TC1-1` by `grade10-admin-auction-internal-bid-SC-28` and `grade10-admin-auction-internal-bid-SC-29`; `grade10-admin-auction-internal-bid-US8-TC2-1` by `grade10-admin-auction-internal-bid-SC-34` and `grade10-admin-auction-internal-bid-SC-36`; `grade10-admin-auction-internal-bid-US8-TC3-1` by `grade10-admin-auction-internal-bid-SC-35`, `grade10-admin-auction-internal-bid-SC-42` and `grade10-admin-auction-internal-bid-SC-43`; `grade10-admin-auction-internal-bid-US8-TC4-1` by `grade10-admin-auction-internal-bid-SC-28`, a clear read by a reserve holder other than the editor; `grade10-admin-auction-internal-bid-US8-TC5-1` by `grade10-admin-auction-internal-bid-SC-51`
- **Deprecated** - `grade10-admin-auction-internal-bid-US1-TC10-1`: QA1 moved its rows to `grade10-admin-auction-internal-bid-US8-TC1-1`, `grade10-admin-auction-internal-bid-US8-TC2-1` and `grade10-admin-auction-internal-bid-US8-TC3-1` once `grade10-admin-auction-internal-bid-SC-28` to `grade10-admin-auction-internal-bid-SC-43` served `grade10-admin-auction-internal-bid-US-08`. It was never accepted, but its id was issued in this change, so it is kept `deprecated` with `covers=none` rather than deleted, and `TC10` is not reissued under US1
- **Revised** - `grade10-admin-auction-internal-bid-US4-TC2-1` to `grade10-admin-auction-internal-bid-US4-TC2-2` (Q30): both House leads rows now also refuse naming the lead or the price; `grade10-admin-auction-internal-bid-US7-TC5-1` to `grade10-admin-auction-internal-bid-US7-TC5-2`: the reserve holder's cleared notice moved to `grade10-admin-auction-internal-bid-US8-TC4-1`, and staff re-open both listings instead
- **Scenarios added from cases** - `grade10-admin-auction-internal-bid-SC-50` from the House leads rows of `grade10-admin-auction-internal-bid-US4-TC2-2`: the requirement names only the house's bid when a lower both moves the price and falls below it (Q30), and no scenario stated it; `grade10-admin-auction-internal-bid-SC-51` from `grade10-admin-auction-internal-bid-US8-TC5-1`: a new save replaces a cleared internal bid and ends the cleared notice, which the states table and the clear requirement state and no scenario did
- **Settled questions applied** - Q34 and Q35, raised by earlier blind passes, landed with no scenario stating either; QA2 added `grade10-admin-auction-internal-bid-SC-52` (a re-save at the same short amount is refused) with a Same amount row on `grade10-admin-auction-internal-bid-US5-TC6-1`, and `grade10-admin-auction-internal-bid-SC-53` (a lower still at or above the minimum next bid places it) with a Lowered row on `grade10-admin-auction-internal-bid-US5-TC7-1`; both cases keep their version as drafts
- **Added by QA2** - a Past its close row on `grade10-admin-auction-internal-bid-US1-TC5-1`, with the refusal named Not editable, for `grade10-admin-auction-internal-bid-SC-48`, which no blind case reached
- **Joined to the run they share** - `grade10-admin-auction-internal-bid-US6-TC3-1` gains a collector-won lot whose order does show, and the bought-in row's missing Open order, so it asserts every THEN of `grade10-admin-auction-internal-bid-SC-49`; `grade10-admin-auction-internal-bid-US7-TC4-1` reads Closed and Bought in with no order to open, as `grade10-admin-auction-listing-SC-155` states; `grade10-admin-auction-internal-bid-US8-TC1-1` to `grade10-admin-auction-internal-bid-US8-TC4-1` read the cleared amount and time beside the notice, and `grade10-admin-auction-internal-bid-US8-TC5-1` reads the notice gone, as `grade10-admin-auction-internal-bid-SC-28` and the clear requirement state
- **Rejected** - the House second row of QA1's `grade10-admin-auction-internal-bid-US4-TC2-2` took `<house maximum>` as a bid placed for the house when customer A outbid it, and so expected the refusal to name the house's bid. The durable two-maximum record rule records only the challenger's bid when it passes the leader's maximum, and the auto-bidding worked example keeps the house's bid at its first amount after step 2. The row now leads with the house's first bid at `<starting price>` and expects the lead-or-price refusal, which `grade10-admin-auction-internal-bid-SC-15` and `grade10-site-auction-auto-bidding-SC-43` state
- **Anchors** - `grade10-admin-auction-internal-bid-SC-21` serves `grade10-admin/auction/listing#grade10-admin-auction-listing-US-05`, and `grade10-admin-auction-internal-bid-US2-TC4-1` keeps its trace to `grade10-admin-auction-internal-bid-US-02`; `grade10-admin-auction-internal-bid-US7-TC5-2` traces `grade10-admin-auction-internal-bid-US-07` and covers `grade10-admin-auction-internal-bid-SC-28`, `grade10-admin-auction-internal-bid-SC-34` and `grade10-admin-auction-internal-bid-SC-35` for the staff answer they state, beside `grade10-admin-auction-internal-bid-SC-18`; cases covering auto-bidding, auction, listing and winner-order scenarios keep their own journey's trace. Joined on the behaviour
- **Covered at domain** - `grade10-admin-auction-e2e-US4-TC1-1` also walks `grade10-admin-auction-internal-bid-SC-01`, `grade10-admin-auction-internal-bid-SC-08` and `grade10-admin-auction-internal-bid-SC-17` into Relist; the feature cases above stay, since that path asserts none of the refusals
- **Out of suite** - none
- **Raised** - none. Q31 changes no case
- **Contradicted** - none
- **Uncovered anchors** - none
