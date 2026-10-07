# grade10-site/auction/bidding-history Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-07, tcs-rules r4

## grade10-site-auction-bidding-history-US1: Collector reads their bidding index

**As a** collector,
**I want** every listing I placed a bid on in one private index,
**so that** I can see my standing without hunting through the catalogue.

<!-- trace:case id=g10.auction-bidding-history.TC-xaz rev=1 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz -->
### grade10-site-auction-bidding-history-US1-TC1-1: Repeated activity is grouped under one listing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history.spec.ts`

**Pre-conditions:**

* customer(signed in) set a maximum on one listing, then raised it.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Check that listing in the bidding index.

**Expected Results:**

* That listing appears once at the position of its latest activity.
* Its summary shows the collector's current standing.

<!-- trace:case id=g10.auction-bidding-history.TC-bhz rev=2 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz -->
### grade10-site-auction-bidding-history-US1-TC2-2: A listing whose every bid was refused is not in the index

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history.spec.ts`

**Pre-conditions:**

* customer(signed in, enrolled to bid) has an accepted bid on <listing_a>.
* The customer has never bid on <listing_b> and is on <listing_b url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_a> | An open HKD listing the customer bid on |
| <listing_b> | An open HKD listing with no bid from anyone |
| <opening price> | 35000 minor units (HK$350), <listing_b>'s starting price |
| <refused bid> | HK$100, below <opening price> |

**Steps:**

1. Type <refused bid> into the custom maximum on the bid panel.
2. Confirm the bid.
3. Navigate to <grade10 bids url>.
4. Select **Active**.
5. Select **Completed**.

**Expected Results:**

* Step 2: the bid form names the minimum, <opening price>.
* Step 4 lists <listing_a>.
* Step 5 lists the collector's completed listings.
* Each standing on the index is Leading, Outbid, Won or Canceled.

<!-- trace:case id=g10.auction-bidding-history.TC-c6d rev=1 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz -->
### grade10-site-auction-bidding-history-US1-TC3-1: Active and completed activity separate cleanly

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history.spec.ts`

**Pre-conditions:**
A signed-in collector has activity on one open listing, one closed listing, and one canceled listing.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Select **Active**.
3. Select **Completed**.

**Expected Results:**

* Step 2 shows only the open listing.
* Step 3 shows the closed and canceled listings.

<!-- trace:case id=g10.auction-bidding-history.TC-s3o rev=1 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz -->
### grade10-site-auction-bidding-history-US1-TC4-1: Paging does not repeat or skip a listing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-bidding-history-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history.spec.ts`

**Pre-conditions:**

* customer(signed in) has more Active listings than one page holds.
* No newer activity is added during the pass.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Follow every returned cursor.

**Expected Results:**

* Every active listing appears exactly once in latest-activity order.

<!-- trace:case id=g10.auction-bidding-history.TC-ev8 rev=1 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz -->
### grade10-site-auction-bidding-history-US1-TC5-1: Account with no bidding activity has an empty index

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-01

**Pre-conditions:**

* customer(signed in) has placed no bid.
* Another Grade10 account has bidding activity.
* Another storefront has bidding activity for the same account id.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Check the bidding index.

**Expected Results:**

* The bidding index is empty.
* The page shows this Grade10 account's index.

<!-- trace:case id=g10.auction-bidding-history.TC-wit rev=1 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz,g10.auction-bidding-history.SC-33x,g10.auction-bidding-history.SC-8d3 -->
### grade10-site-auction-bidding-history-US1-TC6-1: Each listing's standing is Leading, Outbid, Won or Canceled

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-bidding-history-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history.spec.ts`

**Pre-conditions:**

* customer A(signed in) placed a bid on <listing>, which is in the row's state.

**Test data:**

| Listing state | Filter | Standing |
| --- | --- | --- |
| Open, customer A leads | **Active** | Leading |
| Open, customer B leads | **Active** | Outbid |
| Closed, customer A won | **Completed** | Won |
| Closed, customer B won | **Completed** | Outbid |
| Called off after customer A's bid | **Completed** | Canceled |

**Steps:**

1. Navigate to <grade10 bids url>.
2. Select the row's filter.
3. Find <listing>.

**Expected Results:**

* <listing> shows once, with the row's standing.
* It shows its current or final price.

<!-- trace:case id=g10.auction-bidding-history.TC-hv4 rev=1 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz,g10.auction-bidding-history.SC-33x,g10.auction-bidding-history.SC-8d3 -->
### grade10-site-auction-bidding-history-US1-TC7-1: A refused bid leaves an Outbid listing in its place

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-bidding-history-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history.spec.ts`

**Pre-conditions:**

* customer A(signed in, enrolled to bid) bid on <listing_c> and <listing_d>, and customer B has since outbid them on <listing_c>.
* customer A's latest activity on <listing_d> is newer than on <listing_c>.
* customer A is on <listing_c url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_c> | An open HKD listing led by customer B |
| <listing_d> | An open HKD listing customer A bid on after their last bid on <listing_c> |
| <current bid> | 530000 minor units (HK$5,300), <listing_c>'s current bid |
| <increment> | 8000 minor units (HK$80), the HK$4,000 tier |
| <next minimum> | <current bid> plus <increment>, 538000 minor units (HK$5,380) |
| <refused bid> | HK$5,300, equal to <current bid>, below <next minimum> |

**Steps:**

1. Type <refused bid> into the custom maximum on the bid panel.
2. Confirm the bid.
3. Navigate to <grade10 bids url>.
4. Read the **Active** list.
5. Expand <listing_c>.

**Expected Results:**

* Step 2: the bid form names the minimum, <next minimum>.
* <listing_c> reads Outbid, priced at <current bid>.
* <listing_c> still sits below <listing_d>.
* <listing_c>'s latest activity time is its last accepted bid's.
* Step 5's history matches that last accepted bid.

<!-- trace:case id=g10.auction-bidding-history.TC-92c rev=1 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz,g10.auction-bidding-history.SC-33x,g10.auction-bidding-history.SC-8d3 -->
### grade10-site-auction-bidding-history-US1-TC8-1: A call-off adds no listing for a collector who never bid on it

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history.spec.ts`

**Pre-conditions:**

* customer A(signed in) placed a bid on <listing_g>.
* customer B(signed in) watches <listing_g> and never bid on it.
* admin(holds `auction:operate`) called <listing_g> off.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_g> | A published HKD listing, called off after customer A's bid |

**Steps:**

1. As customer A, navigate to <grade10 bids url> and select **Completed**.
2. As customer B, navigate to <grade10 bids url> and select **Active**, then **Completed**.

**Expected Results:**

* Step 1 lists <listing_g> with standing Canceled.
* Step 2 lists customer B's accepted listings.

---

## grade10-site-auction-bidding-history-US2: Collector audits every maximum Grade10 accepted

**As a** collector,
**I want** every maximum Grade10 accepts for me kept as a private event,
**so that** I can see what I set or raised, and what was placed automatically, without exposing my maximum to a rival.

<!-- trace:case id=g10.auction-bidding-history.TC-1ao rev=2 covers=g10.auction-bidding-history.SC-vd5,g10.auction-bidding-history.SC-qhu,g10.auction-bidding-history.SC-qvv -->
### grade10-site-auction-bidding-history-US2-TC1-2: An accepted bid is recorded once, as a maximum

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-02

**Pre-conditions:**

* customer(signed in, card linked, no bid on <listing_h>) is on <listing_h url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_h> | An open USD listing with no other bidder, opening price 10000 minor units (USD 100.00) |
| <maximum> | 50000 minor units (USD 500.00) |

**Steps:**

1. Enter <maximum> in the custom maximum on the bid panel and place the bid.
2. Navigate to <grade10 bids url>.
3. Expand <listing_h>.

**Expected Results:**

* Step 3 shows one event, a maximum set at <maximum>, for the signed-in account.

<!-- trace:case id=g10.auction-bidding-history.TC-q0n rev=2 covers=g10.auction-bidding-history.SC-vd5,g10.auction-bidding-history.SC-qhu,g10.auction-bidding-history.SC-qvv -->
### grade10-site-auction-bidding-history-US2-TC2-2: A refused bid adds no event to the collector's history

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history.spec.ts`

**Pre-conditions:**

* customer A(signed in, enrolled to bid) leads <listing_e> with a maximum of <customer A maximum>.
* The entries of <listing_e>'s history on <grade10 bids url>, and the lot's bid count, are noted.
* customer A is on <listing_e url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_e> | An open HKD listing led by customer A |
| <customer A maximum> | 20000 minor units (HK$200) |
| <refused raise> | HK$200, equal to <customer A maximum> |

**Steps:**

1. Type <refused raise> into the custom maximum on the bid panel.
2. Confirm the bid.
3. Navigate to <grade10 bids url>.
4. Expand <listing_e>.
5. Return to <listing_e url> and read the bid count.

**Expected Results:**

* Step 2: the bid form keeps <customer A maximum> as the maximum on file.
* Step 4 shows the noted entries.
* Step 5's bid count is the one noted.

<!-- trace:case id=g10.auction-bidding-history.TC-l6l rev=1 covers=g10.auction-bidding-history.SC-vd5,g10.auction-bidding-history.SC-qhu,g10.auction-bidding-history.SC-qvv -->
### grade10-site-auction-bidding-history-US2-TC3-1: Browser-only validation creates no Auction event

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history.spec.ts`

**Pre-conditions:**

* customer(signed in, card linked) is on <listing_malformed url> and has placed no bid on it.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_malformed> | An open HKD listing |
| <malformed maximum> | 10.50, a decimal the browser refuses to submit |

**Steps:**

1. Note the bidding index on <grade10 bids url>.
2. Open <listing_malformed url>.
3. Type <malformed maximum> into the custom maximum on the bid panel.
4. Read the custom maximum.
5. Return to <grade10 bids url>.

**Expected Results:**

* The custom maximum shows <malformed maximum> is not accepted.
* No bid is submitted.
* The bidding index matches the note from step 1.

<!-- trace:case id=g10.auction-bidding-history.TC-5aw rev=1 covers=g10.auction-bidding-history.SC-vd5,g10.auction-bidding-history.SC-qhu,g10.auction-bidding-history.SC-qvv -->
### grade10-site-auction-bidding-history-US2-TC4-1: Automatic maximum is recorded and stays private

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-02

**Pre-conditions:**

* customer A(signed in, card linked) is on <listing_private_max url> and has placed no bid on it.
* customer B(signed in) can open the same listing.
* No one is signed in on a third session.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_private_max> | An open HKD listing, opening price 24000 minor units (HK$240) |
| <first maximum> | 36000 minor units (HK$360) |
| <raised maximum> | 48000 minor units (HK$480) |

**Steps:**

1. As customer A, enter <first maximum> in the custom maximum and place the bid.
2. Enter <raised maximum> in the custom maximum and place the bid.
3. Navigate to <grade10 bids url> and expand <listing_private_max>.
4. As customer B, navigate to <grade10 bids url> and expand <listing_private_max> if it is listed.
5. Signed out, open <listing_private_max url> and read public recent bids.

**Expected Results:**

* Step 3 records <first maximum> and then <raised maximum>.
* Customer B's bidding index lists customer B's accepted listings.
* Signed-out recent bids show the public price and the listing pseudonym.

<!-- trace:case id=g10.auction-bidding-history.TC-shn rev=1 covers=g10.auction-bidding-history.SC-vd5,g10.auction-bidding-history.SC-qhu,g10.auction-bidding-history.SC-qvv -->
### grade10-site-auction-bidding-history-US2-TC5-1: Engine bid is labeled automatic

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-02

**Pre-conditions:**

* customer A(signed in) leads <listing_engine> with a maximum of <customer A maximum>.
* customer B(signed in, card linked) is on <listing_engine url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_engine> | An open HKD listing, current bid 26000 minor units (HK$260) |
| <customer A maximum> | 64000 minor units (HK$640) |
| <customer B maximum> | 41000 minor units (HK$410), below <customer A maximum> |

**Steps:**

1. As customer B, enter <customer B maximum> in the custom maximum and place the bid.
2. As customer A, navigate to <grade10 bids url>.
3. Expand <listing_engine>.
4. Signed out, open <listing_engine url> and read the new public price.

**Expected Results:**

* Step 3 labels customer A's answering movement as automatic.
* Step 4 shows the listing pseudonym on the new public price.

---

## grade10-site-auction-bidding-history-US3: Collector reads one listing's combined history

**As a** collector,
**I want** one chronology of public price movement and my private standing,
**so that** I can see how I was outbid without seeing anyone's hidden maximum.

<!-- trace:case id=g10.auction-bidding-history.TC-sow rev=1 covers=g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4 -->
### grade10-site-auction-bidding-history-US3-TC1-1: Competing bid shows customer A outbid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history.spec.ts`

**Pre-conditions:**

* customer A(signed in) leads <listing_outbid> at its opening price, with a maximum equal to that price.
* customer B(signed in, card linked) is on <listing_outbid url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_outbid> | An open HKD listing, opening price 32000 minor units (HK$320) |
| <customer B maximum> | 47000 minor units (HK$470) |

**Steps:**

1. As customer B, enter <customer B maximum> in the custom maximum and place the bid.
2. As customer A, navigate to <grade10 bids url>.
3. Expand <listing_outbid>.

**Expected Results:**

* Customer B appears under the listing pseudonym.
* That step shows customer A outbid at the public price.
* The amounts shown are the public price.

<!-- trace:case id=g10.auction-bidding-history.TC-i8u rev=1 covers=g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4 -->
### grade10-site-auction-bidding-history-US3-TC2-1: Automatic response is attributed to customer A

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history.spec.ts`

**Pre-conditions:**

* customer A(signed in) leads <listing_auto> with a maximum above the current bid.
* customer B(signed in, card linked) is on <listing_auto url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_auto> | An open HKD listing, current bid 28000 minor units (HK$280) |
| <customer A maximum> | 61000 minor units (HK$610) |
| <customer B maximum> | 39000 minor units (HK$390) |

**Steps:**

1. As customer B, enter <customer B maximum> in the custom maximum and place the bid.
2. As customer A, navigate to <grade10 bids url>.
3. Expand <listing_auto>.

**Expected Results:**

* Customer B's action comes first when they share a time.
* Customer A's following movement is marked automatic.
* Both records read as one step.

<!-- trace:case id=g10.auction-bidding-history.TC-ybl rev=1 covers=g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4 -->
### grade10-site-auction-bidding-history-US3-TC3-1: Failed attempt sits beside unchanged auction state

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-03

**Pre-conditions:**

* A collector's attempt fails while another bidder remains leading.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Open that listing's combined history.
3. Check the accepted price and leading pseudonym.

**Expected Results:**

* The failed private event appears at its authoritative time with its safe reason.
* The auction's accepted price and leading pseudonym remain unchanged.

<!-- trace:case id=g10.auction-bidding-history.TC-mug rev=1 covers=g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4 -->
### grade10-site-auction-bidding-history-US3-TC4-1: Full retained history remains pageable

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bidding-history-US-03

**Pre-conditions:**
One listing has more public and private events than one page holds. No new event is added during the pass.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Expand that listing's combined history.
3. Follow every returned cursor.

**Expected Results:**

* Every retained event visible to that collector appears exactly once in stable order.

<!-- trace:case id=g10.auction-bidding-history.TC-iuc rev=1 covers=g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4,g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-1rj -->
### grade10-site-auction-bidding-history-US3-TC5-1: A history page never splits one auction decision

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
* **Trace:** grade10-site-auction-bidding-history-US-03

**Pre-conditions:**

* customer A(signed in) has a combined history on <listing_f>.
* One decision on that history wrote customer A's maximum, their accepted price of 30000 USD minor units (USD 300.00), customer B's response at 31000 USD minor units (USD 310.00), and customer A's outbid standing, between an older and a newer rival price.
* No new bid is placed on <listing_f> during the pass.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_f> | An open USD listing customer A and customer B both bid on |
| <split decision> | customer A's accepted price of 30000 USD minor units, customer B's response at 31000 USD minor units, and customer A's outbid standing |

**Steps:**

1. Navigate to <grade10 bids url>.
2. Expand <listing_f>.
3. Follow every cursor at a page size of 1.
4. Read the same history as one page of 50.

**Expected Results:**

* Step 3 returns every record of <split decision> on one page.
* Step 4 reads those records in the same order.

<!-- trace:case id=g10.auction-bidding-history.TC-mq5 rev=1 covers=g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4,g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-1rj -->
### grade10-site-auction-bidding-history-US3-TC6-1: Boundary maxima write the stated history

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
* **Trace:** grade10-site-auction-bidding-history-US-03

**Pre-conditions:**

* Each row starts from the same fixture.
* customer A(signed in) leads <listing_boundary> with an accepted maximum of 1000 minor units (USD 10.00).
* The current public bid is 400 minor units (USD 4.00) and the increment is 100 minor units (USD 1.00).
* customer B(signed in, card linked) has placed no bid on <listing_boundary> and is on <listing_boundary url>.

**Test data:**

| <customer B maximum> | Public history, in order | Leader | B's account history |
| --- | --- | --- | --- |
| 500 minor units (USD 5.00) | B at 500, then A's automatic response at 600, same time | A | retains 500 |
| 700 minor units (USD 7.00) | B at 700, then A's automatic response at 800, same time | A | retains 700 |
| 950 minor units (USD 9.50) | B at 950, then A's automatic response at 1000; A's response does not exceed 1000 | A | — |
| 1000 minor units (USD 10.00) | B first at 1000, then A's automatic response at 1000, same time | A | the maximum stays private |
| 1001 minor units (USD 10.01) | B once at 1001; no new bid record for A | B | retains 1001 |
| 1100 minor units (USD 11.00) | B once at 1100; no intermediate record; no new bid record for A | B | — |
| 1120 minor units (USD 11.20) | B once at 1100, one increment above A's maximum; no new bid record for A | B | retains 1120 |

**Steps:**

1. Enter <customer B maximum> in the custom maximum on the bid panel and place the bid.
2. Read the listing's public recent bids.
3. Navigate to <grade10 bids url> and expand <listing_boundary>.

**Expected Results:**

* Step 2 matches the row's public history, under listing pseudonyms.
* The leader matches the row.
* Where the row names B's account history, step 3 matches it.

---

## grade10-site-auction-bidding-history-US4: Collector's bidding history stays on their storefront account

**As a** collector,
**I want** only my Grade10 account's history,
**so that** another storefront or an unsigned visitor cannot read my maximums or my standing.

<!-- trace:case id=g10.auction-bidding-history.TC-nvt rev=1 covers=g10.auction-bidding-history.SC-onh,g10.auction-bidding-history.SC-2pg,g10.auction-bidding-history.SC-uu5,g10.auction-bidding-history.SC-izn -->
### grade10-site-auction-bidding-history-US4-TC1-1: Storefront account reads its own history

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-04

**Pre-conditions:**
A Grade10 storefront session for account A.

**Steps:**

1. Navigate to <grade10 bids url> as account A.
2. Check the bidding index and combined histories.

**Expected Results:**

* Auction returns only A's Grade10 activity and the public movements that belong in its combined histories.

<!-- trace:case id=g10.auction-bidding-history.TC-0mp rev=1 covers=g10.auction-bidding-history.SC-onh,g10.auction-bidding-history.SC-2pg,g10.auction-bidding-history.SC-uu5,g10.auction-bidding-history.SC-izn -->
### grade10-site-auction-bidding-history-US4-TC2-1: Same account id on another storefront is unrelated

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-04

**Pre-conditions:**
Grade10 and ZZZ each have an account with the same account id. Grade10 holds private bidding events for that id.

**Steps:**

1. Sign in to ZZZ as that account.
2. Read its bidding history.

**Expected Results:**

* The ZZZ history lists that storefront's activity.

<!-- trace:case id=g10.auction-bidding-history.TC-ls6 rev=1 covers=g10.auction-bidding-history.SC-onh,g10.auction-bidding-history.SC-2pg,g10.auction-bidding-history.SC-uu5,g10.auction-bidding-history.SC-izn -->
### grade10-site-auction-bidding-history-US4-TC3-1: Anonymous reader cannot read private history

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bidding-history-US-04

**Pre-conditions:**
No storefront session.

**Steps:**

1. Read the API response for an account bidding index with no storefront session.
2. Read the API response for a public listing.

**Expected Results:**

* Grade10 refuses the account index read.
* The public listing read shows public price movements and listing pseudonyms.

<!-- trace:case id=g10.auction-bidding-history.TC-87o rev=1 covers=g10.auction-bidding-history.SC-onh,g10.auction-bidding-history.SC-2pg,g10.auction-bidding-history.SC-uu5,g10.auction-bidding-history.SC-izn -->
### grade10-site-auction-bidding-history-US4-TC4-1: Reading history is inert

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bidding-history-US-04

**Pre-conditions:**

* customer(signed in) has retained bidding history.
* The bid, maximum, listing standing and auction close of one of its listings are noted.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Read and page the index and that listing's combined history.
3. Check that listing's bid, maximum, listing standing and auction close.

**Expected Results:**

* The noted bid, maximum, listing standing and auction close match the note.

---

## grade10-site-auction-bidding-history-US5: Collector opens their bids at /bids

**As a** collector,
**I want** `/bids` to show my active and completed summaries and expand each
listing's history,
**so that** I can audit standing without leaving the page.

<!-- trace:case id=g10.auction-bidding-history.TC-p6t rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### grade10-site-auction-bidding-history-US5-TC1-1: Signed-in collector opens active bids

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**
A signed-in Grade10 collector with active and completed bidding activity.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Check the page and the site chrome.
3. Switch to **Completed**.

**Expected Results:**

* The page shows the Active summaries inside the existing site chrome.
* Switching to **Completed** stays in that same page.

<!-- trace:case id=g10.auction-bidding-history.TC-04o rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### grade10-site-auction-bidding-history-US5-TC2-1: Outbid summary leads to its explanation and listing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**
An open listing on which the collector is outbid.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Expand that summary.

**Expected Results:**

* The combined history identifies the public movement that outbid **You**.
* The page offers a route to the still-open listing.

<!-- trace:case id=g10.auction-bidding-history.TC-9al rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### grade10-site-auction-bidding-history-US5-TC3-1: Signed-out visitor preserves the destination

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**
The visitor is signed out.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Complete the existing sign-in flow.

**Expected Results:**

* The Grade10 site starts its existing sign-in flow.
* Successful sign-in returns the collector to `/bids`.

<!-- trace:case id=g10.auction-bidding-history.TC-u0u rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### grade10-site-auction-bidding-history-US5-TC4-1: Empty filter is explicit

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**
A signed-in collector with no entries in the selected filter.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Select that filter.
3. Wait until the filter finishes loading.

**Expected Results:**

* The page shows the empty state for the selected filter.
* That empty state is the list's message.

<!-- trace:case id=g10.auction-bidding-history.TC-5h6 rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### grade10-site-auction-bidding-history-US5-TC5-1: Initial loading reserves the bidding list

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**

* customer(signed in) is opening <grade10 bids url>.
* The bidding index is delayed, so the selected page has not answered yet.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Check the page during the delay.

**Expected Results:**

* The page shows a labeled bidding-history loading state inside the site chrome.
* That loading state is the list's message.

<!-- trace:case id=g10.auction-bidding-history.TC-u23 rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### grade10-site-auction-bidding-history-US5-TC6-1: Index failure is retryable

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**

* customer(signed in) is opening <grade10 bids url>.
* The bidding index is mocked to fail for the selected page.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Check the page.

**Expected Results:**

* The page shows a retryable bidding-history error.
* That error is the list's message.

<!-- trace:case id=g10.auction-bidding-history.TC-jy9 rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### grade10-site-auction-bidding-history-US5-TC7-1: Expanding history preserves its summary while loading

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**

* customer(signed in) has a visible bidding summary on <grade10 bids url>.
* That listing's combined history is delayed, so it has not answered yet.

**Steps:**

1. Expand that summary.
2. Check the summary and the history area during the delay.

**Expected Results:**

* That summary stays visible with a labeled history-loading state.
* The history area shows that loading state.

<!-- trace:case id=g10.auction-bidding-history.TC-h9q rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### grade10-site-auction-bidding-history-US5-TC8-1: Loading more preserves entries already shown

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**
A visible index or combined history page with a further cursor.

**Steps:**

1. Activate the next-page control.
2. Activate it again while the next page is still loading.

**Expected Results:**

* The entries already shown remain visible while the next page loads.
* The next-page control takes one request for that page.

<!-- trace:case id=g10.auction-bidding-history.TC-e9b rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### grade10-site-auction-bidding-history-US5-TC9-1: History failure preserves the listing summary

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**

* customer(signed in) can see the bidding index on <grade10 bids url>.
* One listing's combined history is mocked to fail.

**Steps:**

1. Expand that listing.
2. Check that summary and the other summaries.

**Expected Results:**

* That summary remains visible with a retryable history error.
* Other summaries and their histories remain usable.

<!-- trace:case id=g10.auction-bidding-history.TC-nyy rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw -->
### grade10-site-auction-bidding-history-US5-TC10-1: ZZZ receives no bidding-history page

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**
None.

**Steps:**

1. Sign in to <zzz store url>.
2. Look for a bidding-history route or screen.
3. Use ZZZ's authenticated backend against the shared history contract.

**Expected Results:**

* ZZZ's storefront routes match the routes from before this capability.
* A signed-in ZZZ history read returns that storefront's activity.

---

## grade10-site-auction-bidding-history-US6: Collector reviews maximum history on the lot

**As a** signed-in collector,
**I want** to open **Your bidding** on a lot and read every accepted maximum I set or raised there,
**so that** I can see when I raised the ceiling without leaving the lot or opening the full account chronology.

<!-- trace:case id=g10.auction-bidding-history.TC-p4o rev=1 covers=g10.auction-bidding-history.SC-roe -->
### grade10-site-auction-bidding-history-US6-TC1-1: Maximum-only lot opens on Bid placed with empty bids

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-06

**Pre-conditions:**
customer(signed-in bidder with one accepted automatic maximum and no automatic
bid placed for them yet on `<listing_max_only>`) is on that lot's page. **Your
bidding** is visible beside public recent bids.

**Steps:**

1. Activate **Your bidding**.
2. Inspect the dialog title, description, tab order, and the active tab.
3. Activate **Your maximums**.
4. Inspect the maximum rows and whether a sticky current-maximum summary is
   shown.

**Expected Results:**

* The dialog title is **Your bidding**.
* Tabs appear in order **Bid placed**, then **Your maximums**.
* **Bid placed** is active and shows the empty bids state.
* **Your maximums** lists the accepted maximum's amount and time.
* The live maximum stays on the bid panel.

<!-- trace:case id=g10.auction-bidding-history.TC-3hn rev=2 covers=g10.auction-bidding-history.SC-roe -->
### grade10-site-auction-bidding-history-US6-TC2-2: Raised maximums list without refusals on the lot

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-06

**Pre-conditions:**

* customer(signed-in bidder who set a maximum on `<listing_raised_max>`, later raised it, and then had a further raise refused) is on that lot's page.

**Steps:**

1. Activate **Your bidding**.
2. Activate **Your maximums**.
3. Inspect every maximum row.
4. Navigate to <grade10 bids url>.
5. Expand `<listing_raised_max>`.

**Expected Results:**

* **Your maximums** lists the accepted set and raise, newest first, each row an amount and a time.
* Both lot tabs list those accepted amounts.
* Step 5 lists those accepted amounts.

<!-- trace:case id=g10.auction-bidding-history.TC-s22 rev=1 covers=g10.auction-bidding-history.SC-roe -->
### grade10-site-auction-bidding-history-US6-TC3-1: Lot personal bidding stays private and inert

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
* **Trace:** grade10-site-auction-bidding-history-US-06

**Pre-conditions:**

* customer A(signed-in bidder with personal bidding activity) and customer B(rival with a private maximum) both have activity on `<listing_private>`.
* customer A is on that lot's page.
* The public recent bids and customer A's live maximum on the bid panel are noted.

**Steps:**

1. Activate **Your bidding**.
2. Inspect **Bid placed** and **Your maximums**.
3. Dismiss the dialog.
4. Re-check public recent bids, live maximum and listing standing.

**Expected Results:**

* **Bid placed** and **Your maximums** list customer A's amounts and times.
* Public recent bids, the live maximum and the standing match the note.

---

## grade10-site-auction-bidding-history-US7: Collector reviews bids Grade10 placed on the lot

**As a** signed-in collector,
**I want** the lot dialog to separate the bids Grade10 placed for me from my
maximums, open on **Bid placed** by default, and list that tab first,
**so that** I do not read an auto-bid step as my maximum.

<!-- trace:case id=g10.auction-bidding-history.TC-lx1 rev=1 covers=g10.auction-bidding-history.SC-mx5,g10.auction-bidding-history.SC-u76,g10.auction-bidding-history.SC-g01 -->
### grade10-site-auction-bidding-history-US7-TC1-1: Bid placed stays default when both lists have rows

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-07

**Pre-conditions:**
customer(signed-in bidder with at least one automatic bid Grade10 placed for
them and at least one accepted maximum on `<listing_both_lists>`) is on that
lot's page.

**Steps:**

1. Activate **Your bidding**.
2. Inspect the active tab and **Bid placed** rows.
3. Activate **Your maximums**.
4. Inspect maximum rows.

**Expected Results:**

* **Bid placed** is the initial active tab.
* Tab order is **Bid placed**, then **Your maximums**.
* **Bid placed** lists the owner's automatic bid amounts and times.
* **Your maximums** lists every accepted configure or raise for that owner on that listing, newest first, each row an amount and a time.
* The live maximum stays on the bid panel.

<!-- trace:case id=g10.auction-bidding-history.TC-j30 rev=1 covers=g10.auction-bidding-history.SC-mx5,g10.auction-bidding-history.SC-u76,g10.auction-bidding-history.SC-g01 -->
### grade10-site-auction-bidding-history-US7-TC2-1: Empty Bid placed remains the default before any auto-bid

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
* **Trace:** grade10-site-auction-bidding-history-US-07

**Pre-conditions:**
customer(signed-in bidder with one accepted automatic maximum and no automatic
bid placed for them yet on `<listing_max_only>`) is on that lot's page.

**Steps:**

1. Activate **Your bidding**.
2. Inspect the active tab copy.
3. Activate **Your maximums** and return to **Bid placed**.

**Expected Results:**

* **Bid placed** is active on open and shows the empty-bids state.
* **Bid placed** and **Your maximums** stay separate tabs.

<!-- trace:case id=g10.auction-bidding-history.TC-7py rev=1 covers=g10.auction-bidding-history.SC-mx5,g10.auction-bidding-history.SC-u76,g10.auction-bidding-history.SC-g01 -->
### grade10-site-auction-bidding-history-US7-TC3-1: Reading separated lists does not change auction facts

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
* **Trace:** grade10-site-auction-bidding-history-US-07

**Pre-conditions:**
customer(signed-in bidder with both bid-sequence and maximum rows on
`<listing_both_lists>`) is on that lot's page. Note standing, live maximum, and
public recent bids before opening the dialog.

**Steps:**

1. Activate **Your bidding**.
2. Switch between **Bid placed** and **Your maximums**.
3. Dismiss the dialog.
4. Re-check standing, live maximum, and public recent bids.

**Expected Results:**

* Standing, the live maximum and public recent bids match the note.

---

## grade10-site-auction-bidding-history-US8: Collector reads clearer maximum labels on /bids

**As a** signed-in collector,
**I want** configure and raise events on `/bids` named as maximum set or raised,
**so that** the account chronology matches the lot wording without a new account tab.

<!-- trace:case id=g10.auction-bidding-history.TC-qo3 rev=2 covers=g10.auction-bidding-history.SC-9ua -->
### grade10-site-auction-bidding-history-US8-TC1-2: Account chronology names maximum set and raised, and no refusal

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-08

**Pre-conditions:**

* customer(signed in) set an automatic maximum on `<listing_account_labels>`, later raised it, and then had a further raise refused.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Expand `<listing_account_labels>`.
3. Inspect the set and raise events.
4. Read the account navigation.

**Expected Results:**

* Those events read as a maximum set and a maximum raised.
* The chronology lists those accepted amounts.
* Account navigation stays on the bids page.

---

## grade10-site-auction-bidding-history-US9: Collector sees public bid avatars without learning emails

**As a** collector,
**I want** each public bid avatar to show one letter from that bidder's email
without learning their email or name,
**so that** I can tell rivals apart on the public ledger while identity stays
behind the listing pseudonym.

<!-- trace:case id=g10.auction-bidding-history.TC-ava rev=1 -->
### grade10-site-auction-bidding-history-US9-TC1-1: Public ledger avatar matches the email local-part letter

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-09

**Pre-conditions:**

* `<listing_1>` is published with at least one counted public bid from a bidder whose email is `<email_ada>`.

**Test data:**

| Field | Value |
| --- | --- |
| email_ada | `ada@example.com` |
| expected_letter | `A` |

**Steps:**

1. Read the anonymous public listing response for `<listing_1>`.
2. Find the public bid row for that bidder.

**Expected Results:**

* The row's listing pseudonym is of the form Bidder N.
* The row's avatar character is `<expected_letter>`.
* The response body contains neither `<email_ada>` nor a personal display name for that bidder.

<!-- trace:case id=g10.auction-bidding-history.TC-avb rev=1 -->
### grade10-site-auction-bidding-history-US9-TC2-1: Erased or letterless email falls back to B

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-09

**Pre-conditions:**

* `<listing_2>` has a public bid whose bidder email was erased, and a public bid whose email local part has no letter or digit before `@`.

**Steps:**

1. Read the anonymous public listing response for `<listing_2>`.
2. Check each of those two public bid rows.

**Expected Results:**

* Each row's avatar character is `B`.
* Each row still shows a listing pseudonym of the form Bidder N.
* Neither row exposes an email.

## Settled

- A refused bid is not a bid: it adds no listing to `/bids`, no history entry and no standing, and moves no listing; failed-only standing and refusal reasons are gone.
- `/bids` standing is Leading, Outbid, Won or Canceled.
- A lot lost at the close reads Outbid on `/bids` and Didn't win on My Auctions (decisions Q14).

## Reconciliation

**Run:** QA2, 2026-10-03. QA1's blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md`, the linked pages under `docs/prds/`, and the durable suite and the change's domain draft with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read QA1's suites, the delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites on main after `my-auctions-without-bid-holds` was accepted, and grade10 main's bidding, history, erasure and refusal-copy code and tests. It is a statement, not proof.

- **Folded in** - `grade10-site-auction-bidding-history-SC-47` by the Canceled row of `grade10-site-auction-bidding-history-US1-TC6-1`; `grade10-site-auction-bidding-history-SC-48` by `grade10-site-auction-bidding-history-US3-TC5-1`; `grade10-site-auction-bidding-history-SC-49` by `grade10-site-auction-bidding-history-US1-TC2-2`; `grade10-site-auction-bidding-history-SC-50` by `grade10-site-auction-bidding-history-US1-TC7-1` and `grade10-site-auction-bidding-history-US2-TC2-2`; `grade10-site-auction-bidding-history-SC-44` by `grade10-site-auction-bidding-history-US6-TC2-2`; `grade10-site-auction-bidding-history-SC-46` by `grade10-site-auction-bidding-history-US8-TC1-2`; `grade10-site-auction-bidding-history-SC-18` and `grade10-site-auction-bidding-history-SC-45` by `grade10-site-auction-bidding-history-US4-TC4-1` and `grade10-site-auction-bidding-history-US6-TC3-1`; `grade10-site-auction-auction-SC-90`, an Outbid listing keeping its place, by `grade10-site-auction-bidding-history-US1-TC7-1`
- **Covered at domain** - `grade10-site-auction-e2e-US03-TC02-2` walks `grade10-site-auction-bidding-history-SC-29`: a maximum below the next bid is refused and its history gains no event
- **Added by QA2** - `grade10-site-auction-bidding-history-US1-TC8-1` for the other half of `grade10-site-auction-bidding-history-SC-47`: a call-off adds no listing for a collector who only watched. `grade10-site-auction-bidding-history-US2-TC1-2` for `grade10-site-auction-bidding-history-SC-51`: the durable case read an accepted manual bid, which no longer exists; an accepted bid now reads as one maximum set. `grade10-site-auction-bidding-history-US1-TC1-1` restyled: its pre-condition asked for manual bids. The `grade10-site-auction-bidding-history-US7` heading carries the journey's new words, with no case changed
- **Revised** - `grade10-site-auction-bidding-history-US1-TC2-2`, `grade10-site-auction-bidding-history-US2-TC2-2`, `grade10-site-auction-bidding-history-US6-TC2-2` and `grade10-site-auction-bidding-history-US8-TC1-2`: QA1 kept their ids, but each now verifies that a refusal is absent where it was retained, so each moves up a revision. The markers of `grade10-site-auction-bidding-history-US1-TC1-1`, `grade10-site-auction-bidding-history-US1-TC2-2`, `grade10-site-auction-bidding-history-US2-TC1-2` and `grade10-site-auction-bidding-history-US2-TC2-2` drop the retired grade10-site-auction-bidding-history-SC-02 and grade10-site-auction-bidding-history-SC-38, and those of `grade10-site-auction-bidding-history-US2-TC1-2` and `grade10-site-auction-bidding-history-US2-TC2-2` drop grade10-site-auction-bidding-history-SC-37 too. `grade10-site-auction-bidding-history-US4-TC4-1` and `grade10-site-auction-bidding-history-US6-TC3-1` lose the hold from what reading leaves unchanged, a draft restyle with `<v>` kept
- **Corrected** - `grade10-site-auction-bidding-history-US3-TC5-1`, `grade10-site-auction-bidding-history-US6-TC2-2` and `grade10-site-auction-bidding-history-US6-TC3-1` traced Feature set groups; they trace their sections' journeys
- **Deprecated** - `grade10-site-auction-bidding-history-US3-TC3-1`, a failed attempt beside the auction
- **Raised, answered** - Q14: a lot lost at the close reads Outbid on `/bids` and Didn't win on My Auctions, as grade10 runs, recommended; answer in `## Settled`
- **Reworded** - `grade10-site-auction-bidding-history-SC-05`: an empty index is now for an account that has placed no bid, in place of one with no retained maximum attempt or automatic-bid activity; `grade10-site-auction-bidding-history-US1-TC5-1` still asserts it
- **Retired** - grade10-site-auction-bidding-history-SC-02, a failed-only listing, and grade10-site-auction-bidding-history-SC-13, a failed attempt beside the auction, leave their renamed requirements with refused attempts; grade10-site-auction-bidding-history-SC-38, a refused maximum kept as an event, and grade10-site-auction-bidding-history-SC-37, a manual bid request refused, leave "Every accepted maximum action leaves a private event". `grade10-site-auction-bidding-history-SC-51` states the rule that replaces grade10-site-auction-bidding-history-SC-37: every bid is a maximum. No retired id is reissued
- **Contradicted** - none
- **Uncovered anchors** - none

**Run:** QA1 blind pass on frozen Feature set + journeys + proposal/decisions/ui-design + linked PRD sections; denied Requirements, tech-design, and archive. Domain suite: no new domain case — existing cases already assert listing-pseudonym naming; avatar letter is feature-owned on US-09/US-15. QA2 reconciled against Dev scenarios SC-52 and SC-53.

| Case | Disposition |
| --- | --- |
| `grade10-site-auction-bidding-history-US9-TC1-1` | Folded — covered by `grade10-site-auction-bidding-history-SC-52` |
| `grade10-site-auction-bidding-history-US9-TC2-1` | Folded — covered by `grade10-site-auction-bidding-history-SC-53` |
| `grade10-site-auction-bidding-history-SC-52` | Covered by `grade10-site-auction-bidding-history-US9-TC1-1` |
| `grade10-site-auction-bidding-history-SC-53` | Covered by `grade10-site-auction-bidding-history-US9-TC2-1` |
