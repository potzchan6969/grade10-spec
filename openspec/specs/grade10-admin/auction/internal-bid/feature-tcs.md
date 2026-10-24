# grade10-admin/auction/internal-bid Test Cases

**Status:** pending-review · 0/38
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* Every listing is a USD listing in no campaign, starting price `<starting price>`, extension 30 minutes and no cap, unless its case says otherwise. Bids and internal bids are whole dollars.
* The step is chosen by the amount being beaten: +USD250 from USD2,500, +USD500 from USD5,000. The ceiling is USD10,000,000.
* customer A, customer B and customer C are collectors with a linked card, signed in on separate sessions; a maximum is entered in the custom maximum on the bid panel.
* An admin sets an internal bid in the Internal bid section of a listing's editor, opened from Listings. Every internal bid bids as `<internal bidder>`, picked before Save, unless its case names another profile.
* A staff admin holds `auction:operate` and not `auction:reserve`; a reserve holder holds `auction:reserve`.

| Field | Value |
| --- | --- |
| `<starting price>` | USD4,000 |
| `<internal bidder>` | An active internal bidder profile: name "QA House One", email label qa-house-one@internal.test, billing address `<house billing address>` |
| `<house billing address>` | Grade10 Stock Room, 1 Test Road, Central, Hong Kong, with every required field |

## Walk 1: Admin protects a lot, and staff never learn the floor

Starting state:

- `<listing>` is published and taking bids; customer A leads at `<starting price>` with a maximum of USD5,000.
- admin(holds auction:reserve) is on `<listing>`'s editor; a staff admin is signed in on another session.

Shared test data:

| Field | Value |
| --- | --- |
| listing | A published USD listing, scheduled close a day away |
| house maximum | USD6,000 |
| commit time | 10 minutes from now |

### Route

1. As the reserve holder, enter `<house maximum>` and `<commit time>`, pick `<internal bidder>` and Save.
   - The section shows the internal bid, not yet committed; the lot page shows no new bid. `g10adm.auction-internal-bid.US1-TC1`
2. As the staff admin, open `<listing>` from Listings.
   - No Internal bid section, amount, time or internal bidder shows. `g10adm.auction-internal-bid.US7-TC1`
3. Wait until `<commit time>` passes; as customer B, read the lot page.
   - The house leads at USD5,500 under a listing pseudonym, with nothing naming the house. `g10adm.auction-internal-bid.US1-TC1`
4. As the staff admin, reopen `<listing>`.
   - The house's bid reads House, with no amount, time or internal bidder. `g10adm.auction-internal-bid.US7-TC7`
5. As the reserve holder, raise the internal bid to USD7,000 and Save, then lower it to USD6,500 and Save.
   - Both save; the lot page's Highest bid stays USD5,500 and gains no row. `g10adm.auction-internal-bid.US3-TC1`
6. As the staff admin, reread `<listing>`'s bids.
   - One House bid shows, at USD5,500, and no raise or lower. `g10adm.auction-internal-bid.US7-TC7`

## Walk 2: A house win is settled by hand

Starting state:

- The house leads `<listing>` at USD5,500 under its committed internal bid as `<internal bidder>`, over customer A's maximum of USD5,000; it closes in a few minutes.
- admin(holds auction:reserve and auction:payment) is on Orders.

Shared test data:

| Field | Value |
| --- | --- |
| listing | A published USD listing in no campaign, holding 1 unit of a product |

### Route

1. Wait until the close passes; select All and search for `<listing>`'s listing code.
   - One order shows, flagged internal, buyer House with `<internal bidder>`, HKD settlement on FPS. `g10adm.auction-internal-bid.US6-TC1`
2. Open the order.
   - It reads Preparing Invoice, delivery and billing address `<house billing address>`. `g10adm.auction-internal-bid.US6-TC4`
3. Send the invoice with Shipping & Handling USD0 and a bank transfer fee of 0.
   - The order reads Pending Payment, the HKD total the Subtotal, the deadline 7 days away. `g10adm.auction-internal-bid.US6-TC5`
4. Move the clock past the deadline and reload the order.
   - It reads Payment Overdue; nothing cancels it. `g10adm.auction-internal-bid.US6-TC4`
5. Cancel the order for Non-payment.
   - The order reads Cancelled and the unit returns to the product's available count. `g10adm.auction-internal-bid.US6-TC7`
6. Open the send log, filtered by `<listing>`.
   - No letter went out from the close to the cancel. `g10adm.auction-internal-bid.US6-TC1`

## g10adm.auction-internal-bid.US1: Admin protects a lot with an internal bid at a set time

**As an** auction admin,
**I want** to set a hidden house maximum on a listing, the internal bidder it bids as, and the time Grade10 commits it,
**so that** the lot cannot sell below what the house will accept, without a high starting price putting early bidders off.

<!-- trace:case id=g10adm.auction-internal-bid.TC-d07 rev=4 covers=g10adm.auction-internal-bid.SC-dq6,g10adm.auction-internal-bid.SC-glg -->
### g10adm.auction-internal-bid.US1-TC1: At its time the internal bid commits as a maximum and resolves like any other

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-01

**Pre-conditions:**

* `<listing>` is `<state>`, starting at USD4,000, with no internal bid; admin(holds auction:reserve and auction:operate) is on its editor; customer B can open its page.

**Test data:**

| `<state>` | `<amount>` | `<commit time>` | `<after>` |
| --- | --- | --- | --- |
| taking bids, no bids | USD6,000 | 10 minutes from now | the house leads at USD4,000 |
| taking bids, customer A leading at USD4,000 with a maximum of USD5,000 | USD6,000 | 10 minutes from now | the house leads at USD5,500 (USD5,000 plus the USD500 step) |
| taking bids, customer A leading at USD4,000 with a maximum of USD7,000 | USD6,000 | 10 minutes from now | customer A leads at USD6,500 |
| Upcoming, its start 15 minutes away | USD6,000 | exactly the start | the house leads at USD4,000 from the start |
| taking bids, customer A leading at USD4,000 with a maximum of USD5,000, its close 15 minutes away | USD6,000 | exactly the scheduled close | the house leads at USD5,500, and the close moves out 30 minutes |
| taking bids, customer A leading at USD4,000 with a maximum of USD5,000 | USD10,000,000, the ceiling | 10 minutes from now | the house leads at USD5,500; a bid of USD10,000,001 is refused at the ceiling |
| created, start 15 minutes away, published at once after Save | USD6,000 | 10 minutes after the start | the house leads at USD4,000, one bid |

**Steps:**

1. Type `<amount>` and `<commit time>` in the Internal bid section, pick `<internal bidder>` and Save; read the section and the listing's public facts.
2. Let `<commit time>` pass; reload the editor, and as customer B read Highest bid and Recent bids.

**Expected Results:**

* Step 1 shows the amount in USD with no currency choice, Scheduled at `<commit time>` as `<internal bidder>`, and no bid or price change.
* Step 2 shows it committed at `<commit time>` as `<internal bidder>`, and `<after>`; every house row carries one listing pseudonym and names neither the house nor `<internal bidder>`.

<!-- trace:case id=g10adm.auction-internal-bid.TC-39a rev=2 covers=g10adm.auction-internal-bid.SC-mxk,g10adm.auction-internal-bid.SC-5x7,g10adm.auction-internal-bid.SC-avn,g10adm.auction-internal-bid.SC-9ve,g10adm.auction-internal-bid.SC-m8q,g10adm.auction-internal-bid.SC-ols -->
### g10adm.auction-internal-bid.US1-TC3: A value outside the save limits, a missing value or a time already past is refused at Save

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-01

**Pre-conditions:**

* `<listing>` is published, `<state>`, with no internal bid, starting at USD4,000; admin(holds auction:reserve) is on its editor.

**Test data:**

| `<state>` | `<amount>` | `<commit time>` | `<internal bidder>` |
| --- | --- | --- | --- |
| Upcoming, start an hour away | USD6,000 | 1 minute before the start | picked |
| Upcoming, start an hour away | USD6,000 | 1 minute after the scheduled close | picked |
| Upcoming, start an hour away | USD10,000,001, a dollar over the ceiling | 30 minutes after the start | picked |
| Upcoming, start an hour away | USD3,999, a dollar under the starting price | 30 minutes after the start | picked |
| Upcoming, start an hour away | 6000.50 | 30 minutes after the start | picked |
| Upcoming, start an hour away | USD6,000 | empty | picked |
| Upcoming, start an hour away | empty | 30 minutes after the start | picked |
| Upcoming, start an hour away | USD6,000 | 30 minutes after the start | none |
| taking bids, customer A leading at USD4,000 | USD6,000 | 1 minute ago | picked |

**Steps:**

1. Enter the row's values and Save.
2. Reload the editor, and read customer B's view of the listing.

**Expected Results:**

* Step 1 is refused, saying which value is wrong.
* Step 2 shows no internal bid, and the listing's price and Recent bids unchanged.

<!-- trace:case id=g10adm.auction-internal-bid.TC-of0 rev=2 covers=none -->
### g10adm.auction-internal-bid.US1-TC4: Before its time the house is not in the bidding

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
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
| `<listing_4>` | A published USD listing taking bids, scheduled close a day away |
| `<house maximum>` | USD6,000 |
| `<commit time>` | 2 hours from now |
| `<customer A maximum>` | USD4,500, below `<house maximum>` |

**Steps:**

1. As customer A, read Highest bid and the next minimum on the bid panel.
2. As customer A, commit `<customer A maximum>`.
3. Read Highest bid, the leader and Recent bids.

**Expected Results:**

* Step 1 shows `<starting price>` as the next minimum, with No bids yet.
* Step 2 is accepted; customer A reads Leading.
* Step 3: Highest bid reads `<starting price>`, the first maximum on the starting price.
* Step 3: Recent bids holds customer A's row only.

<!-- trace:case id=g10adm.auction-internal-bid.TC-6a2 rev=3 covers=g10adm.auction-internal-bid.SC-rzl -->
### g10adm.auction-internal-bid.US1-TC12: One internal bidder serves internal bids on several listings

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-01

**Pre-conditions:**

* `<listing_52>` and `<listing_53>` are published and taking bids, with no internal bid.
* On `<listing_52>`, customer A bid first with maximum `<customer A maximum>`, then customer B with maximum `<customer B maximum>`; customer B leads.
* `<listing_53>` has no bids.
* admin(holds auction:reserve) is on Listings.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_52>` | A published USD listing taking bids, scheduled close a day away |
| `<listing_53>` | A published USD listing like `<listing_52>` |
| `<customer A maximum>` | USD4,500 |
| `<customer B maximum>` | USD5,000 |
| `<house maximum>` | USD6,000, on both listings |
| `<commit time>` | 10 minutes from now, on both listings |
| `<house bid on listing_52>` | USD5,500: `<customer B maximum>` plus its USD500 step |

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

<!-- trace:case id=g10adm.auction-internal-bid.TC-akn rev=3 covers=g10adm.auction-internal-bid.SC-dnq,g10adm.auction-internal-bid.SC-i32 -->
### g10adm.auction-internal-bid.US1-TC13: The internal bidder changes only before the internal bid's time

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-01

**Pre-conditions:**

* `<listing_54>` is published and taking bids; customer A bid at `<starting price>` with maximum `<customer A maximum>` before the internal bid's time.
* `<listing_54>` has an internal bid of the row's amount as `<bidder P>`, in the row's state.
* `<bidder Q>` is an active internal bidder profile.
* admin(holds auction:reserve) is on `<listing_54>`'s editor.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_54>` | A published USD listing taking bids, scheduled close a day away |
| `<bidder P>` | An active internal bidder profile: name "QA House P", email label qa-house-p@internal.test |
| `<bidder Q>` | An active internal bidder profile: name "QA House Q", email label qa-house-q@internal.test |
| `<customer A maximum>` | USD7,000 |

| Row | Internal bid's state and amount | Save | Internal bidder after Save |
| --- | --- | --- | --- |
| Before its time | Scheduled, USD8,000, its time 10 minutes from now | Accepted | `<bidder Q>`; once its time passes, the house's bid names `<bidder Q>` |
| Placed | Placed, USD8,000, committed at its time 10 minutes ago; the house leads at USD7,500 | Refused, saying the internal bidder is fixed | `<bidder P>` |
| Not placed | Not placed, USD4,000 (`<starting price>`), short of the USD4,250 minimum next bid at its time 10 minutes ago | Refused, saying the internal bidder is fixed | `<bidder P>` |

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

---

## g10adm.auction-internal-bid.US2: Admin changes an internal bid before its time

**As an** auction admin,
**I want** to change or remove the amount and the time until the internal bid is committed,
**so that** I can react to the market before the house has bid at all.

<!-- trace:case id=g10adm.auction-internal-bid.TC-qbl rev=3 covers=g10adm.auction-internal-bid.SC-jtj -->
### g10adm.auction-internal-bid.US2-TC1: Before its time an internal bid changes or goes freely, and commits only as it stands

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-02

**Pre-conditions:**

* `<listing>` is taking bids, customer A leading at USD4,000 with a maximum of USD5,000; its internal bid of USD7,000 commits in 10 minutes; admin(holds auction:reserve) is on its editor.

**Test data:**

| `<change>` | `<after both times>` |
| --- | --- |
| Change it to USD5,500, committing in 30 minutes | after 10 minutes nothing moves; after 30 the house leads at USD5,500 (USD5,000 plus the USD500 step) |
| Remove it | nothing moves; the section shows no internal bid |

**Steps:**

1. Make `<change>` and Save.
2. Let 10, then 30 minutes pass, reading customer B's view each time, and the section.

**Expected Results:**

* Step 1 is accepted; step 2 reads `<after both times>`.

<!-- trace:case id=g10adm.auction-internal-bid.TC-kok rev=2 covers=none -->
### g10adm.auction-internal-bid.US2-TC3: A changed time outside the window is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-02

**Pre-conditions:**

* `<listing_9>` is published and Upcoming, with an internal bid of `<house maximum>` at `<commit time>`.
* admin(holds auction:reserve) is on `<listing_9>`'s editor.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_9>` | A published USD listing, scheduled start `<start>` an hour away, scheduled close `<scheduled close>` a day later |
| `<house maximum>` | USD6,000 |
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

<!-- trace:case id=g10adm.auction-internal-bid.TC-ul9 rev=2 covers=none -->
### g10adm.auction-internal-bid.US2-TC4: Calling off the listing drops its internal bid

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-02

**Pre-conditions:**

* `<listing_10>` is published, taking bids, led by customer A at `<starting price>`.
* `<listing_10>` has an internal bid of `<house maximum>` at `<commit time>`, still ahead.
* admin(holds auction:reserve) is on Listings.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_10>` | A published USD listing taking bids, in no campaign |
| `<house maximum>` | USD6,000 |
| `<commit time>` | 10 minutes from now |

**Steps:**

1. Call off `<listing_10>`.
2. Wait until `<commit time>` passes.
3. Open `<listing_10>` and read the Internal bid section.

**Expected Results:**

* Step 1: `<listing_10>` reads Canceled.
* Step 3: no house bid was placed at `<commit time>`, and no internal bid is held for `<listing_10>`.

---

## g10adm.auction-internal-bid.US3: Admin raises a committed internal bid

**As an** auction admin,
**I want** to raise the house maximum any time the lot still takes a bid,
**so that** I can keep protecting a lot that is running hotter than expected.

<!-- trace:case id=g10adm.auction-internal-bid.TC-gem rev=3 covers=g10adm.auction-internal-bid.SC-lqc -->
### g10adm.auction-internal-bid.US3-TC1: A committed internal bid raises at once, as a new commitment, whatever the standing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-03

**Pre-conditions:**

* `<listing>` is taking bids, its internal bid committed as `<bidder>`; `<standing>`; admin(holds auction:reserve) is on its editor.

**Test data:**

| `<bidder>` | `<standing>` | `<raise to>` | `<after>` |
| --- | --- | --- | --- |
| `<internal bidder>` | customer A leads at USD5,500 with a maximum of USD7,000 over a house maximum of USD5,000 | USD6,000, the next minimum | customer A leads at USD6,500 |
| `<internal bidder>` | the same | USD7,000, equal to customer A's | customer A leads at USD7,000, the earlier maximum |
| `<internal bidder>` | the same | USD8,000 | the house leads at USD7,500 |
| `<internal bidder>` | the same | USD10,000,000, the ceiling | the house leads at USD7,500 |
| `<internal bidder>` | the house leads at USD5,500 with USD6,000 over customer A's USD5,000 | USD7,500 | the house still leads at USD5,500; then customer B's maximum of USD7,000 is answered at USD7,500 |
| `<bidder P>`, since retired | customer A leads at USD6,500 with USD7,000 over a house maximum of USD6,000 | USD8,000 | the house leads at USD7,500, its bid naming `<bidder P>` |

**Steps:**

1. Change the amount to `<raise to>` and Save.
2. Read customer A's view, and the section and the listing's bids.

**Expected Results:**

* Step 1 is accepted at once; step 2 reads `<after>`, any new house bid under its listing pseudonym on the site.

<!-- trace:case id=g10adm.auction-internal-bid.TC-t5b rev=2 covers=g10adm.auction-internal-bid.SC-xfi -->
### g10adm.auction-internal-bid.US3-TC4: The commit time is fixed once committed

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-03

**Pre-conditions:**

* `<listing_14>` is published and taking bids, its internal bid of `<house maximum>` committed at `<commit time>`.
* admin(holds auction:reserve) is on `<listing_14>`'s editor.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_14>` | A published USD listing taking bids, scheduled close a day away |
| `<house maximum>` | USD6,000 |
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

<!-- trace:case id=g10adm.auction-internal-bid.TC-nrn rev=3 covers=g10adm.auction-internal-bid.SC-hsd -->
### g10adm.auction-internal-bid.US3-TC5: A raise still short of the next minimum is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-03

**Pre-conditions:**

* `<listing_30>` is published and taking bids, its internal bid of `<house maximum>` committed.
* customer A leads `<listing_30>` at `<current bid>` with maximum `<customer A maximum>`.
* admin(holds auction:reserve) is on `<listing_30>`'s editor.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_30>` | A published USD listing taking bids, scheduled close a day away |
| `<house maximum>` | USD6,000 |
| `<customer A maximum>` | USD7,000 |
| `<current bid>` | USD6,500: `<house maximum>` plus its USD500 step |
| `<short raise>` | USD6,999, one dollar below `<current bid>` plus its USD500 step |

**Steps:**

1. In the Internal bid section, change the amount to `<short raise>`.
2. Click Save.
3. Reload the editor and read the Internal bid section.
4. As customer A, read Highest bid, the standing and Recent bids on the lot page for `<listing_30>`.

**Expected Results:**

* Step 2 is refused, and says the amount is short of the next minimum.
* Step 3 still shows `<house maximum>`, committed.
* Step 4: customer A still leads at `<current bid>`; Recent bids gains no row.

---

## g10adm.auction-internal-bid.US4: Admin lowers a committed internal bid without moving the lead

**As an** auction admin,
**I want** to lower the house maximum when the leader and the current bid stay as they are,
**so that** I can loosen the protection without changing anything a collector has already seen.

<!-- trace:case id=g10adm.auction-internal-bid.TC-pw6 rev=3 covers=g10adm.auction-internal-bid.SC-x8q -->
### g10adm.auction-internal-bid.US4-TC1: A lower that keeps the leader and the current bid is accepted

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-04

**Pre-conditions:**

* `<listing>` is taking bids, its internal bid of `<house maximum>` committed; `<standing>`; admin(holds auction:reserve) is on its editor.

**Test data:**

| `<house maximum>` | `<standing>` | `<lower to>` | `<then>` |
| --- | --- | --- | --- |
| USD7,000 | the house leads at USD6,000 over customer A's USD5,500 | USD6,250 | customer B's maximum of USD6,900 leads at USD6,750 (USD6,250 plus the USD500 step) |
| USD7,000 | the same | USD6,000, the current bid | customer B's USD6,900 leads at USD6,500 |
| USD4,500 | customer B leads at USD6,500, the house's own bid USD4,350 | USD4,400 | nothing moves |

**Steps:**

1. Change the amount to `<lower to>` and Save.
2. Read customer A's view, then let customer B place `<then>`'s maximum, if any.

**Expected Results:**

* Step 1 is accepted; step 2 shows the price, leader and Recent bids unchanged, then `<then>`.

<!-- trace:case id=g10adm.auction-internal-bid.TC-cu7 rev=4 covers=g10adm.auction-internal-bid.SC-eng,g10adm.auction-internal-bid.SC-16a -->
### g10adm.auction-internal-bid.US4-TC2: A lower that would move the lead or the price, or fall below the house's own bid, is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-04

**Pre-conditions:**

* `<listing>` is taking bids, its internal bid of `<house maximum>` committed; `<standing>`; admin(holds auction:reserve) is on its editor.

**Test data:**

| `<house maximum>` | `<standing>` | `<lower to>` | `<refusal names>` |
| --- | --- | --- | --- |
| USD7,000 | the house leads at USD6,000 over customer A's USD5,500 | USD5,999 | the house's bid of USD6,000 |
| USD7,000 | the house leads at USD7,000 over customer A's USD6,950 | USD6,999 | the house's bid of USD7,000 |
| USD7,000 | customer A leads at USD7,500 with USD8,000, the house's own bid USD4,000 | USD6,500 | that the lower would move the lead or the price |
| USD4,500 | customer B leads at USD6,500, the house's own bid USD4,350 | USD4,100 | the house's bid of USD4,350 |

**Steps:**

1. Change the amount to `<lower to>` and Save.
2. Reload the editor, and read customer B's view.

**Expected Results:**

* Step 1 is refused, naming `<refusal names>`.
* Step 2 still shows `<house maximum>`, and the price, leader and Recent bids unchanged.

---

## g10adm.auction-internal-bid.US5: Admin learns an internal bid came too late

**As an** auction admin,
**I want** to see that an internal bid was not placed because the price had already passed it,
**so that** I can raise it or let the lot sell.

<!-- trace:case id=g10adm.auction-internal-bid.TC-6at rev=3 covers=g10adm.auction-internal-bid.SC-11v,g10adm.auction-internal-bid.SC-otk -->
### g10adm.auction-internal-bid.US5-TC1: Placed at the next minimum, not placed one dollar below it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-05

**Pre-conditions:**

* `<listing_18>` is published and taking bids, bid on as the row states, with no internal bid.
* admin(holds auction:reserve) is on `<listing_18>`'s editor.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_18>` | A published USD listing taking bids, scheduled close a day away |
| `<commit time>` | 10 minutes from now |

| Row | Bidding at `<commit time>` | Next minimum | Internal bid | Outcome |
| --- | --- | --- | --- | --- |
| One dollar short | customer A leads at USD6,000 with maximum USD7,000 | USD6,500 | USD6,499 | Not placed; customer A leads at USD6,000 |
| At the next minimum | customer A leads at USD6,000 with maximum USD7,000 | USD6,500 | USD6,500 | Placed; customer A leads at USD7,000, the internal bid plus its USD500 step |
| At the starting price | No bids | `<starting price>` | USD4,000 | Placed; the house leads at `<starting price>` |

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

<!-- trace:case id=g10adm.auction-internal-bid.TC-7rg rev=3 covers=g10adm.auction-internal-bid.SC-quv -->
### g10adm.auction-internal-bid.US5-TC2: A Not placed internal bid raises into a bid, lowers or goes, while the lot takes bids

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-05

**Pre-conditions:**

* `<listing>` is taking bids, customer A leading at USD6,000 with a maximum of USD7,000; its internal bid of USD5,500 was Not placed; admin(holds auction:reserve) is on its editor.

**Test data:**

| `<change>` | `<section after>` | `<site after>` |
| --- | --- | --- |
| Raise to USD8,000 | Placed | the house leads at USD7,500, customer A Outbid |
| Lower to USD5,000 | USD5,000, Not placed | unchanged |
| Remove it | no internal bid | unchanged |

**Steps:**

1. Make `<change>` and Save.
2. Reload the editor, and read customer A's view.

**Expected Results:**

* Step 1 is accepted though the time has passed; step 2 reads `<section after>` and `<site after>`.

<!-- trace:case id=g10adm.auction-internal-bid.TC-2dl rev=3 covers=g10adm.auction-internal-bid.SC-11v -->
### g10adm.auction-internal-bid.US5-TC3: A not-placed internal bid lets the lot sell to the collector

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-05

**Pre-conditions:**

* `<listing_20>` is led by customer A at `<final price>`, its close a few minutes away, no further bid coming.
* `<listing_20>`'s internal bid of `<short amount>` was not placed at its time and was never raised.
* admin(holds auction:reserve and auction:payment) is on Listings.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_20>` | A published USD listing in no campaign |
| `<final price>` | USD6,000 |
| `<short amount>` | USD5,500, below `<final price>` |

**Steps:**

1. Wait until `<listing_20>`'s close passes.
2. Open `<listing_20>` and read it.
3. Open Orders, select All and search for `<listing_20>`'s listing code.
4. Open the order and read its buyer and flags.

**Expected Results:**

* Step 2: the listing is not flagged as won by an internal bidder.
* Step 3 finds one order for `<listing_20>`, at winning bid `<final price>`.
* Step 4: the buyer is customer A; the order is not flagged internal and names no internal bidder.

<!-- trace:case id=g10adm.auction-internal-bid.TC-jzx rev=3 covers=g10adm.auction-internal-bid.SC-qom,g10adm.auction-internal-bid.SC-x95 -->
### g10adm.auction-internal-bid.US5-TC6: A raise or re-save of a not-placed internal bid still short is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-05

**Pre-conditions:**

* `<listing_33>` is published and taking bids, led by customer A at `<current bid>` with maximum `<customer A maximum>`.
* `<listing_33>`'s internal bid of `<short amount>` was not placed at its time.
* admin(holds auction:reserve) is on `<listing_33>`'s editor.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_33>` | A published USD listing taking bids, scheduled close a day away |
| `<customer A maximum>` | USD7,000 |
| `<current bid>` | USD6,000 |
| `<short amount>` | USD5,500, below `<current bid>` |
| `<minimum next bid>` | USD6,500: `<current bid>` plus its USD500 step |

| Row | `<saved amount>` |
| --- | --- |
| Short raise | USD6,499, one dollar below `<minimum next bid>` |
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

<!-- trace:case id=g10adm.auction-internal-bid.TC-ipm rev=2 covers=g10adm.auction-internal-bid.SC-oml,g10adm.auction-internal-bid.SC-r5u,g10adm.auction-internal-bid.SC-tbl -->
### g10adm.auction-internal-bid.US5-TC7: An internal bid whose time passes while the listing is created stays Not placed until the lot takes bids

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-05

**Pre-conditions:**

* `<listing>` is created, starting at USD4,000, with an internal bid of USD6,000 whose time has passed while it was created; admin(holds auction:reserve and auction:operate) is on its editor.

**Test data:**

| `<created save>` | `<open save>` |
| --- | --- |
| USD6,500 | USD6,500, its own amount |
| USD7,000 | USD7,000 |
| USD5,000 | USD5,000, still at or above the minimum |
| USD4,000, the starting price | USD4,000 |

**Steps:**

1. Read the section, then save `<created save>`.
2. Publish the listing now, and read customer B's view.
3. Save `<open save>`, and read customer B's view again.

**Expected Results:**

* Step 1 reads Not placed before and after the save.
* Step 2: the lot takes bids with No bids yet.
* Step 3 is accepted, the section reads Placed, and the house leads at USD4,000, one bid, under its listing pseudonym.

---

## g10adm.auction-internal-bid.US6: Admin settles the order of a lot an internal bidder won

**As an** auction admin,
**I want** a house win to open an order with HKD settlement and bank transfer on FPS already set,
**so that** the operator can quote and send its invoice, let it expire, and cancel it without a winner or operator choosing the currency or rail.

<!-- trace:case id=g10adm.auction-internal-bid.TC-rzs rev=5 covers=none -->
### g10adm.auction-internal-bid.US6-TC1: A house win opens one order for its internal bidder, flagged internal, in Orders, with no letter

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-06

**Pre-conditions:**

* `<listing>`'s internal bid of USD6,000 is committed as `<internal bidder>`; `<bidding>`; it closes in a few minutes with no further bid; customer B leads another listing closing a minute earlier.
* admin(holds auction:reserve, auction:operate and auction:payment) is on Orders, its segment counts noted.

**Test data:**

| `<bidding>` | `<order>` | `<customer A reads>` |
| --- | --- | --- |
| the house leads at USD5,500 over customer A's USD5,000 | one, flagged internal, buyer House with `<internal bidder>`, winning bid USD5,500 | Didn't win, card not charged |
| the house leads alone at USD4,000 | one, flagged internal, buyer House with `<internal bidder>`, winning bid USD4,000 | no row |
| customer A leads at USD6,500 with USD7,000 | one, customer A's, not flagged internal | Won, with View order |

**Steps:**

1. Let the close pass; select All and search for `<listing>`'s code, and read the segment counts.
2. As the reserve holder, then as an operator whose roles are exactly staff, search Orders by `<internal bidder>`'s email label.
3. As customer A, read My Auctions; open the send log filtered by `<listing>` from the close.

**Expected Results:**

* Step 1 lists `<order>`; a house order holds HKD settlement and FPS when it opens; All grew by two with customer B's order, and the segments still add up.
* Step 2 finds no order for either operator.
* Step 3 reads `<customer A reads>`, and the send log holds no won or other order letter for a house order, to anyone.

<!-- trace:case id=g10adm.auction-internal-bid.TC-17a rev=4 covers=g10adm.auction-internal-bid.SC-u1p -->
### g10adm.auction-internal-bid.US6-TC2: Only a reserve holder reads the listing flagged as its internal bidder's win

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-06

**Pre-conditions:**

* `<listing_45>` is published in no campaign and is bid on as the row states, its close a few minutes away, no further bid coming.
* The row's admin is on Listings.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_45>` | A published USD listing in no campaign |
| `<house maximum>` | USD6,000 |

| Row | admin | Bidding | Wait | `<listing_45>`'s Listings row and page |
| --- | --- | --- | --- | --- |
| House wins, reserve holder | admin(holds auction:reserve and auction:operate) | The house leads at USD5,500 under its committed internal bid of `<house maximum>` as `<internal bidder>`, over customer A's maximum of USD5,000 | Until the close passes | Flagged as won by its internal bidder, naming `<internal bidder>` |
| House wins, staff | admin(staff, holds auction:operate, not auction:reserve) | As House wins, reserve holder | Until the close passes | Not flagged; reads as any won lot, offering Open order |
| House leads, not yet closed | admin(holds auction:reserve and auction:operate) | As House wins, reserve holder | None; the lot is still taking bids | Not flagged |
| Collector beats the house | admin(holds auction:reserve and auction:operate) | customer A leads at USD6,500 with maximum USD7,000, over the house's committed internal bid of `<house maximum>` | Until the close passes | Not flagged; reads as any won lot, offering Open order |
| Nobody bids | admin(holds auction:reserve and auction:operate) | No bid and no internal bid | Until the close passes | Not flagged; reads Unsold |

**Steps:**

1. Wait as the row states.
2. Reload Listings and read `<listing_45>`'s row.
3. Open `<listing_45>` and read its status and flags.

**Expected Results:**

* Steps 2 and 3 each read the row's outcome.
* Steps 2 and 3 read Bought in in no row.

<!-- trace:case id=g10adm.auction-internal-bid.TC-cww rev=4 covers=none -->
### g10adm.auction-internal-bid.US6-TC4: An internal order waits on the operator through every deadline, with no letter

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-admin-auction-internal-bid-US-06

**Pre-conditions:**

* The house won `<listing>` at USD5,500 as `<internal bidder>`, holding `<house billing address>`; the environment's clock can move; admin(holds auction:reserve and auction:payment) is on its order.

**Steps:**

1. Read the order's status, addresses, settlement and actions.
2. Move the clock 48 hours past the close, and reload.
3. Send the invoice, move the clock past its 7-day deadline, then one more day, reloading each time.
4. Open the send log filtered by `<listing>` from the close.

**Expected Results:**

* Step 1: Preparing Invoice with Send invoice offered; delivery and billing addresses both `<house billing address>`; HKD settlement by bank transfer on FPS, which nobody chose.
* Step 2 still reads Preparing Invoice, never Setup Overdue, the invoice Not issued.
* Step 3 reads Payment Overdue, the invoice Expired, and still Payment Overdue a day later; nothing cancels it.
* Step 4 holds no setup, reminder, final notice, overdue or other letter.

<!-- trace:case id=g10adm.auction-internal-bid.TC-dqh rev=5 covers=g10adm.auction-internal-bid.SC-6fc -->
### g10adm.auction-internal-bid.US6-TC5: An operator sends the internal order's invoice by hand, reading it as any HKD quote, and no invoice letter goes out

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-06

**Pre-conditions:**

* `<listing_71>` closed with the house winning at `<final price>` as `<internal bidder>`; its order, flagged internal, holds HKD settlement and FPS and has no invoice sent.
* admin(holds auction:reserve and auction:payment) is on `<listing_71>`'s order page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_71>` | A USD listing in no campaign, closed with the house winning at `<final price>` |

| Row | `<final price>` | `<premium>` | `<shipping>` | `<transfer fee>` | `<usd sum>` | `<house subtotal>` | `<fee in HKD>` | `<house total>` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Zero fee | USD5,500 | USD1,100, 20% of `<final price>` | USD0, Shipping & Handling | USD0, bank transfer fee | USD6,600 | HKD51,810, `<usd sum>` times 7.85 converted once | Free | HKD51,810 |
| Typed fee | USD101 | USD20.20, 20% of `<final price>` | USD10.01, Shipping & Handling | USD25.04, bank transfer fee | USD131.21 | HKD1,030, `<usd sum>` times 7.85 converted once | HKD196.57, `<transfer fee>` times 7.85 rounded up | HKD1,226.57 |

**Steps:**

1. Open Send invoice and read the quote.
2. Enter `<shipping>` as Shipping & Handling and `<transfer fee>` as the bank transfer fee, leaving Insurance and Tax empty.
3. Read the quote preview.
4. Send the invoice.
5. Read the order's status, its invoice lines and the payment deadline.
6. Open the send log, filter by `<listing_71>` and read the rows from the send.

**Expected Results:**

* Step 1: the quote shows winning bid `<final price>`, billing address `<house billing address>`, HKD settlement and FPS. Quote amounts take USD.
* Step 3: the preview lists the winning bid, `<premium>` and `<shipping>` in USD, then one HKD Subtotal of `<house subtotal>`.
* Step 3: the bank transfer fee adds nothing to the Subtotal; below it the fee reads `<fee in HKD>` and the total reads `<house total>`.
* Step 3: no per-line HKD amount and no rate shows.
* Step 5: the order reads Pending Payment, the invoice Pending.
* Step 5: the order page lists the same USD lines, then the HKD Subtotal `<house subtotal>`, the Payment Processing Fee `<fee in HKD>`, Free where zero, and the Total `<house total>`.
* Step 5: the deadline is 7 calendar days after the send.
* Step 6 holds no invoice-sent letter and no payment reminder, to anyone.

<!-- trace:case id=g10adm.auction-internal-bid.TC-2d2 rev=4 covers=none -->
### g10adm.auction-internal-bid.US6-TC7: An operator cancels the internal order by hand and the lot goes back to stock

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-06

**Pre-conditions:**

* `<listing_74>` held `<held quantity>` units of `<product_74>` and closed with the house winning as `<internal bidder>`; its order, flagged internal, holds HKD settlement and FPS and is in the row's state.
* admin(holds auction:reserve and auction:payment) is on `<listing_74>`'s order page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_74>` | A USD listing in no campaign, closed with the house winning at USD5,500 |
| `<product_74>` | A product with `<available before>` units available beside the hold |
| `<held quantity>` | 1 unit (any quantity from 1 to 500) |
| `<available before>` | 3 units (any count) |
| `<note>` | "QA internal order, house win" |

| Row | Order state |
| --- | --- |
| Expired | Payment Overdue: the invoice was sent and its 7 days passed unpaid |
| Never sent | The invoice was never sent |

**Steps:**

1. Read `<product_74>`'s available count on its product page.
2. On the order page, open Cancel.
3. Pick Non-payment and enter `<note>`.
4. Confirm the cancel.
5. Read the order's status and invoice.
6. Read `<product_74>`'s available count again.
7. Open the send log, filter by `<listing_74>` and read the rows from the cancel.

**Expected Results:**

* Step 1 reads `<available before>`.
* Step 2: the confirmation says no letter is sent.
* Step 4 is accepted.
* Step 5: the order reads Cancelled, the invoice Cancelled.
* Step 6 reads `<available before>` plus `<held quantity>`.
* Step 7 holds no cancellation letter or other order letter, to anyone.

---

## g10adm.auction-internal-bid.US7: Admin keeps protected lots secret from staff

**As an** auction admin,
**I want** operators without secret-floor access never to see an internal bid's amount or time, or learn that a lot has one before the house bids,
**so that** the house's floor stays known only to those allowed to set it.

<!-- trace:case id=g10adm.auction-internal-bid.TC-hy3 rev=2 covers=g10adm.auction-internal-bid.SC-n08,g10adm.auction-internal-bid.SC-27a,g10adm.auction-internal-bid.SC-d57 -->
### g10adm.auction-internal-bid.US7-TC1: Before the house bids, staff cannot tell a lot is protected

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-07

**Pre-conditions:**

* `<listing P>` and `<listing Q>` are alike, customer A leading each at USD6,000 with a maximum of USD7,000; only `<listing P>` has an internal bid, `<internal bid>`; `<operator>` is on Listings.

**Test data:**

| `<operator>` | `<internal bid>` |
| --- | --- |
| admin(staff, holds auction:operate) | USD8,000, its time an hour ahead |
| admin(staff, holds auction:operate) | USD5,500, Not placed |
| admin(finance, holds auction:read) | USD5,500, Not placed |
| admin(staff, holds auction:write and auction:operate), on created twins | USD6,000; then the staff admin moves both starts past its time and saves |

**Steps:**

1. Read both rows, open both listings with their bids, and open Stats on each.
2. Look for Internal bidders in auction admin's navigation.

**Expected Results:**

* Step 1: the two read alike - no Internal bid section, amount, time, state, internal bidder, House bid or cleared notice, and the same bidder and bid counts; a staff edit saves with no mention of an internal bid.
* Step 2 offers no Internal bidders page.

<!-- trace:case id=g10adm.auction-internal-bid.TC-jjr rev=2 covers=g10adm.auction-internal-bid.SC-53a -->
### g10adm.auction-internal-bid.US7-TC3: The audit trail records each internal bid act, never its amount or time

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-07

**Pre-conditions:**

* `<listing_24>` is published, with the internal bid the row starts from.
* `<bidder Q>` is an active internal bidder profile.
* admin(holds auction:reserve) is on `<listing_24>`'s editor.
* admin(holds audit access, not auction:reserve) is signed in to the admin on a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_24>` | A published USD listing, scheduled close a day away |
| `<house maximum>` | USD6,123, an amount no other entry carries |
| `<commit time>` | 2 hours 17 minutes from now, a time no other entry carries |
| `<changed maximum>` | USD6,456, an amount no other entry carries |
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
3. As the admin holding audit access, open the audit trail and find the newest entry for `<listing_24>`.

**Expected Results:**

* Step 3 shows one entry recording the row's act on `<listing_24>`, by the admin who made it, at Grade10's time.
* Step 3: no entry shows `<house maximum>` or `<changed maximum>` in any form, such as 6,123 or 6123.
* Step 3: no entry shows `<commit time>`.
* Step 3: no entry shows `<internal bidder>`'s or `<bidder Q>`'s name or email label.

<!-- trace:case id=g10adm.auction-internal-bid.TC-g02 rev=3 covers=g10adm.auction-internal-bid.SC-ftu -->
### g10adm.auction-internal-bid.US7-TC7: Once the house bids, staff read House and nothing more, through the close

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-07

**Pre-conditions:**

* `<listing>`'s internal bid of USD6,123 is committed as `<internal bidder>`; the house leads at USD5,500 over customer A's USD5,000; `<operator>` is on Listings; a reserve holder is on its editor in another session.

**Test data:**

| `<operator>` | `<then>` |
| --- | --- |
| admin(staff, holds auction:operate) | the reserve holder raises the internal bid to USD7,000, then lowers it to USD6,500 |
| admin(finance, holds auction:read) | nothing |
| admin(staff, holds auction:operate) | the listing closes with the house winning |

**Steps:**

1. Let `<then>` happen.
2. Read `<listing>`'s row, open it with its bids and activity, and open Stats; open its order from Orders when one exists.
3. As customer B, read Recent bids.

**Expected Results:**

* Step 2: one House bid at USD5,500, with no account or maximum and its own Accepted At, no row for a raise or a lower, and no Internal bid section, state, time, USD6,123 or name or label of `<internal bidder>`; Stats counts two bidders, the house included, and the site's bid count; after the close the row reads as any won lot with Open order, and the order's buyer reads House, flagged internal.
* Step 3 shows the house's bids under its listing pseudonym, never House.

<!-- trace:case id=g10adm.auction-internal-bid.TC-mnc rev=3 covers=g10adm.auction-internal-bid.SC-epm -->
### g10adm.auction-internal-bid.US7-TC10: A reserve holder reads which internal bidder bid on each listing

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-07

**Pre-conditions:**

* `<listing_56>` is published and taking bids, its internal bid committed as `<bidder P>`; the house leads at `<current bid>` over customer A's maximum `<customer A maximum>`.
* `<listing_57>` is published and taking bids, its internal bid committed as `<bidder Q>`; the house leads at `<current bid>` over customer A's maximum `<customer A maximum>`.
* admin(holds auction:reserve) is on Listings.
* admin(staff, holds auction:operate, not auction:reserve) is signed in to the admin on a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_56>` | A published USD listing taking bids, scheduled close a day away, internal bid `<house maximum>` |
| `<house maximum>` | USD6,000, on both listings |
| `<listing_57>` | A published USD listing like `<listing_56>`, internal bid `<house maximum>` |
| `<bidder P>` | An active internal bidder profile: name "QA House P", email label qa-house-p@internal.test |
| `<bidder Q>` | An active internal bidder profile: name "QA House Q", email label qa-house-q@internal.test |
| `<customer A maximum>` | USD5,000, on both listings |
| `<current bid>` | USD5,500: `<customer A maximum>` plus its USD500 step |

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

<!-- trace:case id=g10adm.auction-internal-bid.TC-k1j rev=3 covers=g10adm.auction-internal-bid.SC-s2h -->
### g10adm.auction-internal-bid.US7-TC11: An internal bidder's email label finds no listing and no bidder

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-07

**Pre-conditions:**

* `<listing_64>` is published and taking bids, its internal bid committed as `<internal bidder>`; the house leads at `<current bid>` over customer A's maximum `<customer A maximum>`.
* The row's admin is on Listings.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_64>` | A published USD listing taking bids, scheduled close a day away, internal bid USD6,000 |
| `<customer A maximum>` | USD5,000 |
| `<current bid>` | USD5,500: `<customer A maximum>` plus its USD500 step |

| Row | admin |
| --- | --- |
| Reserve holder | admin(holds auction:reserve) |
| Staff | admin(staff, holds auction:operate, not auction:reserve) |

**Steps:**

1. Search the Listings table by `<internal bidder>`'s email label.
2. Search the Listings table by customer A's email.
3. Open the bidder moderation list on Bidders and look for `<internal bidder>`'s name and email label.

**Expected Results:**

* Step 1 matches no listing.
* Step 2 matches `<listing_64>`.
* Step 3 lists no row for `<internal bidder>`.

---

## g10adm.auction-internal-bid.US8: Admin learns a listing edit cleared the internal bid

**As an** auction admin,
**I want** to see that a change to a listing's window, starting price or currency cleared its internal bid,
**so that** I can set a new one before the lot sells unprotected.

<!-- trace:case id=g10adm.auction-internal-bid.TC-bgs rev=2 covers=g10adm.auction-internal-bid.SC-rzd,g10adm.auction-internal-bid.SC-bjb -->
### g10adm.auction-internal-bid.US8-TC1: A created listing's edit clears its internal bid only when the bid falls outside, and says so

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-08

**Pre-conditions:**

* `<listing>` is created, start a day away and close two days away, starting at USD4,000, with an internal bid of USD6,000 committing 2 hours after the start; admin(holds auction:reserve and auction:operate) is on its editor.

**Test data:**

| `<edit>` | `<internal bid>` |
| --- | --- |
| start moved to 1 minute after the commit time | cleared |
| close moved to 1 minute before the commit time | cleared |
| start moved to exactly the commit time | kept |
| close moved to exactly the commit time | kept |
| starting price raised to USD6,000, the amount | kept |
| starting price raised to USD6,001 | cleared |

**Steps:**

1. Make `<edit>` and Save.
2. Reload and read the Internal bid section.

**Expected Results:**

* Step 1 saves with no refusal.
* Step 2: a kept bid reads USD6,000 at its time, saying nothing was cleared; a cleared one shows no internal bid and says the listing edit cleared USD6,000 at its time.

<!-- trace:case id=g10adm.auction-internal-bid.TC-o5e rev=2 covers=g10adm.auction-internal-bid.SC-rzd -->
### g10adm.auction-internal-bid.US8-TC4: A reserve holder sees the clearing whoever made the edit

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
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
| `<listing_49>` | A created USD listing, start `<start>` a day away, scheduled close two days away |
| `<house maximum>` | USD6,000 |
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

<!-- trace:case id=g10adm.auction-internal-bid.TC-m9d rev=2 covers=g10adm.auction-internal-bid.SC-pzs -->
### g10adm.auction-internal-bid.US8-TC5: After a clearing the admin sets a new internal bid and it commits

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-08

**Pre-conditions:**

* `<listing_50>` is created, not yet published, and a starting-price change to `<new starting price>` cleared its internal bid.
* admin(holds auction:reserve and auction:operate) is on `<listing_50>`'s editor, the section saying the listing edit cleared the internal bid.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_50>` | A created USD listing, start `<start>` 10 minutes away, scheduled close a day later |
| `<new starting price>` | USD6,001 |
| `<new maximum>` | USD7,000, above `<new starting price>` |
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

## g10adm.auction-internal-bid.US9: Admin keeps the internal bidders an internal bid can bid as

**As an** auction admin,
**I want** to add, rename and retire internal bidder profiles in auction admin,
**so that** each listing's internal bid can bid as the internal bidder I choose for it.

<!-- trace:case id=g10adm.auction-internal-bid.TC-wkj rev=3 covers=g10adm.auction-internal-bid.SC-piq -->
### g10adm.auction-internal-bid.US9-TC1: An added internal bidder keeps its billing address, is offered at Save and has no site account

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-09

**Pre-conditions:**

* No internal bidder profile and no site account carries `<new label>`.
* `<listing_58>` is published and Upcoming, with no internal bid.
* admin(holds auction:reserve) is on Internal bidders.
* admin(holds `user:list`) is signed in to the admin on a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<new name>` | "QA House New" |
| `<new label>` | qa-house-new@internal.test, carried by no profile and no account |
| `<new billing address>` | A Hong Kong address with every required field: name "QA House New", 2 Test Road, Central, Hong Kong |
| `<listing_58>` | A published USD listing, scheduled start an hour away, scheduled close a day later |

**Steps:**

1. Add an internal bidder with `<new name>`, `<new label>` and `<new billing address>`.
2. Save the new internal bidder.
3. Read the internal bidders list.
4. Open the new internal bidder and read its billing address.
5. Open `<listing_58>`'s editor and open the internal bidder pick in the Internal bid section.
6. As the admin holding `user:list`, open Users and search for `<new label>`.

**Expected Results:**

* Step 2 is accepted.
* Step 3 lists `<new name>` with `<new label>`, active.
* Step 4 reads `<new billing address>`.
* Step 5 offers `<new name>`.
* Step 6 finds no account for `<new label>`.

<!-- trace:case id=g10adm.auction-internal-bid.TC-kg8 rev=3 covers=g10adm.auction-internal-bid.SC-h93,g10adm.auction-internal-bid.SC-tj3 -->
### g10adm.auction-internal-bid.US9-TC2: A new internal bidder without a name or with a label already used is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-09

**Pre-conditions:**

* `<bidder P>` is an active internal bidder profile.
* `<bidder R>` is a retired internal bidder profile.
* admin(holds auction:reserve) is on Internal bidders.

**Test data:**

| Field | Value |
| --- | --- |
| `<bidder P>` | An active internal bidder profile: name "QA House P", email label qa-house-p@internal.test |
| `<bidder R>` | A retired internal bidder profile: name "QA House R", email label qa-house-r@internal.test |
| `<copy address>` | A Hong Kong address with every required field: name "QA House Copy", 3 Test Road, Central, Hong Kong |

| Row | Name | Email label | Billing address |
| --- | --- | --- | --- |
| Label in use | "QA House Copy" | qa-house-p@internal.test, `<bidder P>`'s label | `<copy address>` |
| Label in use, other letter case | "QA House Copy" | QA-House-P@internal.test, `<bidder P>`'s label in other letter case | `<copy address>` |
| Label of a retired profile | "QA House Copy" | qa-house-r@internal.test, `<bidder R>`'s label | `<copy address>` |
| Not an email address | "QA House Copy" | qa-house-copy | `<copy address>` |
| No name | Empty | qa-house-blank@internal.test | `<copy address>` |
| No label | "QA House No Label" | Empty | `<copy address>` |
| No billing address | "QA House No Address" | qa-house-no-address@internal.test | Empty |

**Steps:**

1. Add an internal bidder with the row's name, email label and billing address.
2. Save the new internal bidder.
3. Reload Internal bidders and read the list.

**Expected Results:**

* Step 2 is refused, and says which value is wrong.
* Step 3 lists no internal bidder from the row; `<bidder P>` and `<bidder R>` are unchanged.

<!-- trace:case id=g10adm.auction-internal-bid.TC-xjb rev=2 covers=g10adm.auction-internal-bid.SC-2x8 -->
### g10adm.auction-internal-bid.US9-TC4: A profile's name changes any time; its email label only until it has bid

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-09

**Pre-conditions:**

* `<bidder P>`, labelled qa-house-p@internal.test, is `<use>`; admin(holds auction:reserve) is on Internal bidders.

**Test data:**

| `<use>` | `<change>` | `<save>` |
| --- | --- | --- |
| named on no internal bid | the name to QA House P Renamed | accepted; bids and the section read the new name |
| on a listing's committed internal bid, its bid placed | the name to QA House P Renamed | accepted; the house's bid reads House with the new name |
| named on no internal bid | the label to qa-house-p2@internal.test | accepted |
| on a Scheduled internal bid only | the label to qa-house-p2@internal.test | accepted; the bid stays Scheduled as `<bidder P>` |
| on a Not placed internal bid only | the label to qa-house-p2@internal.test | accepted |
| on a committed internal bid, its bid placed | the label to qa-house-p2@internal.test | refused, saying the label is fixed |
| named on no internal bid | the label to another profile's | refused, saying the label is in use |

**Steps:**

1. Make `<change>`, Save, and reload the list.

**Expected Results:**

* The save is `<save>`, and the row shows the result, the other field unchanged.

<!-- trace:case id=g10adm.auction-internal-bid.TC-8at rev=4 covers=g10adm.auction-internal-bid.SC-bio -->
### g10adm.auction-internal-bid.US9-TC5: A profile no live internal bid needs can be retired, keeping its history

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-09

**Pre-conditions:**

* `<bidder P>` is active and `<use>`; admin(holds auction:reserve and auction:payment) is on Internal bidders.

**Test data:**

| `<use>` |
| --- |
| named on no internal bid |
| named only on a placed internal bid, the house leading at USD5,500 |
| named only on a won listing's internal bid, its order open |
| named only on a Not placed internal bid on a listing that has closed |

**Steps:**

1. Retire `<bidder P>`, and reload the list.
2. Open a new listing's internal bidder pick, and any listing or order that names `<bidder P>`.

**Expected Results:**

* Step 1 is accepted; the row reads retired, its name and label kept.
* Step 2 does not offer `<bidder P>`; a placed bid, a won order and a Not placed bid still name `<bidder P>`.

<!-- trace:case id=g10adm.auction-internal-bid.TC-skz rev=2 covers=g10adm.auction-internal-bid.SC-9ng -->
### g10adm.auction-internal-bid.US9-TC6: An internal bidder named on a Scheduled or Not placed internal bid cannot be retired

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-09

**Pre-conditions:**

* `<bidder P>` is an active internal bidder profile, named on `<listing_62>`'s internal bid in the row's state.
* admin(holds auction:reserve) is on Internal bidders.

**Test data:**

| Field | Value |
| --- | --- |
| `<bidder P>` | An active internal bidder profile: name "QA House P", email label qa-house-p@internal.test |
| `<listing_62>` | A published USD listing taking bids, scheduled close a day away |

| Row | `<listing_62>`'s internal bid |
| --- | --- |
| Scheduled | USD6,000, its time an hour ahead |
| Not placed | USD5,500, not placed at its time, customer A leading at USD6,000 |

**Steps:**

1. Retire `<bidder P>`.
2. Reload the list and read `<bidder P>`'s row.
3. Open `<listing_62>`'s editor and read the Internal bid section.

**Expected Results:**

* Step 1 is refused, saying `<bidder P>` is in use and naming `<listing_62>`.
* Step 2 shows `<bidder P>` active.
* Step 3 shows the internal bid in the row's state, as `<bidder P>`.

<!-- trace:case id=g10adm.auction-internal-bid.TC-fnh rev=2 covers=g10adm.auction-internal-bid.SC-d6h -->
### g10adm.auction-internal-bid.US9-TC8: The audit trail records each internal bidder act, never a listing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-09

**Pre-conditions:**

* `<bidder P>` is an active internal bidder profile, named on `<listing_65>`'s Scheduled internal bid of `<house maximum>`.
* `<bidder S>` is an active internal bidder profile, named on no internal bid.
* admin(holds auction:reserve) is on Internal bidders.
* admin(holds audit access, not auction:reserve) is signed in to the admin on a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<bidder P>` | An active internal bidder profile: name "QA House P", email label qa-house-p@internal.test |
| `<bidder S>` | An active internal bidder profile: name "QA House S", email label qa-house-s@internal.test |
| `<listing_65>` | A published USD listing, scheduled close a day away |
| `<house maximum>` | USD6,123, an amount no other entry carries |
| `<audit address>` | A Hong Kong address with every required field: name "QA House Audit", 77 Audit Road, Central, Hong Kong |

| Row | Act | Entry records |
| --- | --- | --- |
| Add | Add an internal bidder named "QA House Audit", email label qa-house-audit@internal.test, with `<audit address>` | An internal bidder was added |
| Rename | Change `<bidder P>`'s name to "QA House P Renamed" | An internal bidder was renamed |
| Change label | Change `<bidder P>`'s email label to qa-house-p2@internal.test | An internal bidder's email label was changed |
| Change address | Change `<bidder S>`'s billing address to `<audit address>` | An internal bidder's billing address was changed |
| Retire | Retire `<bidder S>` | An internal bidder was retired |

**Steps:**

1. Make the row's act and save it.
2. As the admin holding audit access, open the audit trail and find the newest entry for the internal bidder.

**Expected Results:**

* Step 1 is accepted.
* Step 2 shows one entry recording the row's act on that internal bidder, by the admin who made it, at Grade10's time.
* Step 2: the entry names no listing, and shows `<house maximum>` in no form, such as 6,123 or 6123.
* Step 2: the entry shows no part of `<audit address>`.

<!-- trace:case id=g10adm.auction-internal-bid.TC-2nf rev=3 covers=g10adm.auction-internal-bid.SC-l6i -->
### g10adm.auction-internal-bid.US9-TC10: A billing address change after a win leaves the internal order's address as it was

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-09

**Pre-conditions:**

* `<listing_75>` closed with the house winning at USD5,500 as `<internal bidder>`, which held `<house billing address>` at the close; its order, flagged internal, has no invoice sent.
* admin(holds auction:reserve and auction:payment) is on Internal bidders.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_75>` | A USD listing in no campaign, closed with the house winning |
| `<changed address>` | A Hong Kong address with every required field: name "Grade10 Stock Room", 9 Moved Road, Wan Chai, Hong Kong |

**Steps:**

1. Open `<internal bidder>`, change its billing address to `<changed address>` and save.
2. Reload Internal bidders and read `<internal bidder>`'s billing address.
3. Open `<listing_75>`'s order from Orders and read its delivery and billing address.

**Expected Results:**

* Step 1 is accepted.
* Step 2 reads `<changed address>`.
* Step 3: the delivery address and the billing address each still read `<house billing address>`.

## Settled

- An internal bid can be set on a Created or a Published listing, never on a Draft; a window change on a Created listing that leaves its time outside the window clears it, and only a reserve holder sees that.
- A starting-price change on a Created listing that leaves the internal bid outside its limits saves as usual and clears it; only a reserve holder sees that.
- Above the ceiling, below the starting price, a fraction of a dollar and a time already past are refused at Save; the minimum next bid is judged at the commit time, not at Save.
- A raise still short of the minimum next bid is refused, on a Placed or a Not placed internal bid.
- A Placed internal bid cannot be removed and its time is fixed; a Scheduled or a Not placed one can be removed.
- A time that arrives while the listing is still Created leaves the internal bid Not placed, and publishing does not commit it.
- A Not placed internal bid saves at any amount the Save rules allow while the listing is Created and stays Not placed; once the lot takes bids, a save at or above the minimum next bid, its own amount included, places it, a lower stays Not placed, and a raise still below the minimum next bid is refused.
- A save on a listing that has an internal bid changes that one; a listing never carries two.
- A lower is accepted whoever leads, when the leader and the current bid stay the same and it is not below a bid already placed for the house; a lower that does both is refused naming only the house's bid.
- Once the lot takes bids, a re-save of a Not placed internal bid at its own amount, still below the minimum next bid, is refused naming the minimum next bid; a lower that still reaches it places it at once.
- Staff without `auction:reserve` read the house's bids as House, each with its own Accepted At, and after the close a won lot whose order reads buyer House, flagged internal; never the amount, the commit time, the internal bidder, or that a lot has an internal bid before the house bids.
- The audit trail records each set, change and removal without the amount or the time; an operator with audit access only may learn from it that a lot has an internal bid.
- Only a reserve holder reads a closed listing flagged as won by its internal bidder, on its own page and its Listings row; other operators read it as any won lot, with Open order. No listing reads Bought in.
- The internal bidder is the winner of a lot the house leads at its close: the close opens its one order, flagged internal, and no letter goes to it.
- A reserve holder reads which internal bidder bid on each listing, and the cleared notice names it; other operators read House, and collectors read the listing pseudonym.
- A Placed or Not placed internal bid keeps its internal bidder once that profile is retired, and a Placed one still raises and lowers as it.
- An email label is an email address, unique across every profile, Retired ones included, compared ignoring letter case; it may equal a collector's email and is never mailed.
- A Retired internal bidder is never made Active again; a new profile is added instead.
- A Listings or Orders search by email never matches an internal bidder's email label, for any operator.
- Every read shows an internal bidder's current name, past bids included; names need not be unique.
- An operator without `auction:reserve` sees no Internal bidders page and no internal bidder in any read.
- The audit trail records each add, rename, email label change, address change and retirement of an internal bidder with the operator and the time, never a listing or the address.
- An internal bidder is retired only when no Scheduled internal bid, and no Not placed internal bid on a listing before its effective close, names it.
- Operators send the internal order's invoice, let it expire after its 7 days and cancel the order by hand; Grade10 takes none of these steps on its own.
- At the close the internal order reads Preparing Invoice, HKD settlement by bank transfer on FPS, its delivery and billing address both the internal bidder's billing address as it stood then; it never reads Awaiting Setup or Setup Overdue.
- No won, address, invoice, reminder, overdue, expiry or cancelled letter goes out for the internal order; the operator enters the bank transfer fee at send and may enter 0.
- The internal order's expiry suspends no account; its cancel confirmation says no letter is sent, and the cancel returns the stock as any cancel does.
- The house order's quote reads like any HKD quote: the USD lines, then one HKD Subtotal and total, one conversion of those lines.

## Reconciliation

- **Covered at domain** - `g10adm.auction-dmn.US4-TC2` walks `grade10-admin-auction-internal-bid-SC-01`, `grade10-admin-auction-internal-bid-SC-71`, `grade10-admin-auction-internal-bid-SC-73`, `grade10-admin-auction-internal-bid-SC-74` and `grade10-admin-auction-internal-bid-SC-75` from the set to the cancel
