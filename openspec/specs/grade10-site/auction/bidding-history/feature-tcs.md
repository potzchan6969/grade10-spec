# grade10-site/auction/bidding-history Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-auction-bidding-history-US1: Collector reads their bidding index

**As a** collector,
**I want** every listing I placed a bid on in one private index,
**so that** I can see my standing without hunting through the catalogue.

<!-- trace:case id=g10.auction-bidding-history.TC-xaz rev=1 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz -->
### grade10-site-auction-bidding-history-US1-TC1-1: Repeated activity is grouped under one listing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-01

**Pre-conditions:**

* customer(signed in) set a maximum on one listing, then raised it.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Check that listing in the bidding index.

**Expected Results:**

* That listing appears once at the position of its latest activity.
* Its summary carries the collector's current standing rather than one row per action.

<!-- trace:case id=g10.auction-bidding-history.TC-bhz rev=2 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz -->
### grade10-site-auction-bidding-history-US1-TC2-2: A listing whose every bid was refused is not in the index

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
* **Trace:** grade10-site-auction-bidding-history-US-01

**Pre-conditions:**

* customer(signed in, enrolled to bid) has an accepted bid on <listing_a>.
* The customer has never bid on <listing_b> and is on <listing_b url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_a> | An open HKD listing the customer bid on |
| <listing_b> | An open HKD listing with no bid from anyone |
| <opening price> | 20000 minor units (HK$200), <listing_b>'s starting price |
| <refused bid> | HK$100, below <opening price> |

**Steps:**

1. Type <refused bid> into the custom maximum on the bid panel.
2. Confirm the bid.
3. Navigate to <grade10 bids url>.
4. Select **Active**.
5. Select **Completed**.

**Expected Results:**

* Step 2: the bid form refuses <refused bid> as below the minimum.
* Step 4 lists <listing_a> and not <listing_b>.
* Step 5 does not list <listing_b>.
* No listing reads a failed, refused or pending standing.

<!-- trace:case id=g10.auction-bidding-history.TC-c6d rev=1 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz -->
### grade10-site-auction-bidding-history-US1-TC3-1: Active and completed activity separate cleanly

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-01

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
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bidding-history-US-01

**Pre-conditions:**
A signed-in collector has more bidding listings than one page holds. No newer activity is added during the pass.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Follow every returned cursor.

**Expected Results:**

* Every matching listing appears exactly once in latest-activity order.

<!-- trace:case id=g10.auction-bidding-history.TC-ev8 rev=1 covers=g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz -->
### grade10-site-auction-bidding-history-US1-TC5-1: Account with no bidding activity has an empty index

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-01

**Pre-conditions:**
A signed-in storefront account with no retained bid attempt or automatic-bid activity.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Check the bidding index.

**Expected Results:**

* Grade10 returns an empty result rather than another account's or another storefront's activity.

### grade10-site-auction-bidding-history-US1-TC6-1: Each listing's standing is Leading, Outbid, Won or Canceled

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
* **Trace:** grade10-site-auction-bidding-history-US-01

**Pre-conditions:**

* customer A(signed in) placed a bid on <listing>, which is in the row's state.

**Test data:**

| Listing state | Filter | Standing |
| --- | --- | --- |
| Open, customer A leads | **Active** | Leading |
| Open, customer B leads | **Active** | Outbid |
| Closed, customer A won | **Completed** | Won |
| Called off after customer A's bid | **Completed** | Canceled |

**Steps:**

1. Navigate to <grade10 bids url>.
2. Select the row's filter.
3. Find <listing>.

**Expected Results:**

* <listing> shows once, with the row's standing.
* It shows its current or final price.

### grade10-site-auction-bidding-history-US1-TC7-1: A refused bid leaves an Outbid listing in its place

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
* **Trace:** grade10-site-auction-bidding-history-US-01

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

**Expected Results:**

* Step 2: the bid form refuses <refused bid> as below the minimum.
* <listing_c> reads Outbid, priced at <current bid>.
* <listing_c> still sits below <listing_d>.
* <listing_c>'s latest activity time is its last accepted bid's.

### grade10-site-auction-bidding-history-US1-TC8-1: A call-off adds no listing for a collector who never bid on it

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
* **Trace:** grade10-site-auction-bidding-history-US-01

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
* Step 2 lists <listing_g> under neither filter.

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
* **Status:** draft
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

* Step 3 shows one maximum set at <maximum>, attributed to You.
* No entry reads as a manual bid.

<!-- trace:case id=g10.auction-bidding-history.TC-q0n rev=2 covers=g10.auction-bidding-history.SC-vd5,g10.auction-bidding-history.SC-qhu,g10.auction-bidding-history.SC-qvv -->
### grade10-site-auction-bidding-history-US2-TC2-2: A refused bid adds no event to the collector's history

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
* **Trace:** grade10-site-auction-bidding-history-US-02

**Pre-conditions:**

* customer A(signed in, enrolled to bid) leads <listing_e> with a maximum of <customer A maximum>.
* The entries of <listing_e>'s history on <grade10 bids url>, and the lot's bid count, are noted.
* customer A is on <listing_e url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_e> | An open HKD listing led by customer A |
| <customer A maximum> | 200000 minor units (HK$2,000) |
| <refused raise> | HK$2,000, equal to <customer A maximum> |

**Steps:**

1. Type <refused raise> into the custom maximum on the bid panel.
2. Confirm the bid.
3. Navigate to <grade10 bids url>.
4. Expand <listing_e>.
5. Return to <listing_e url> and read the bid count.

**Expected Results:**

* Step 2: the bid form refuses <refused raise> as not above the maximum on file.
* Step 4 shows the noted entries and no other.
* No entry names the refused amount or a refusal reason.
* Step 5's bid count is the one noted.

<!-- trace:case id=g10.auction-bidding-history.TC-l6l rev=1 covers=g10.auction-bidding-history.SC-vd5,g10.auction-bidding-history.SC-qhu,g10.auction-bidding-history.SC-qvv -->
### grade10-site-auction-bidding-history-US2-TC3-1: Browser-only validation creates no Auction event

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-02

**Pre-conditions:**
A signed-in collector is on <an open listing url>.

**Steps:**

1. Enter a malformed amount that the browser refuses to submit.
2. Navigate to <grade10 bids url>.
3. Open that listing's history.

**Expected Results:**

* That local validation failure is absent from the Auction history.

<!-- trace:case id=g10.auction-bidding-history.TC-5aw rev=1 covers=g10.auction-bidding-history.SC-vd5,g10.auction-bidding-history.SC-qhu,g10.auction-bidding-history.SC-qvv -->
### grade10-site-auction-bidding-history-US2-TC4-1: Automatic maximum is recorded and stays private

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-02

**Pre-conditions:**
A signed-in collector can configure and raise an automatic-bid maximum on <an open listing url>. A rival account also has activity on that listing.

**Steps:**

1. Configure an automatic-bid maximum.
2. Raise that maximum.
3. Open the collector's history for that listing.
4. Open the rival's history and an anonymous read of the listing.

**Expected Results:**

* The collector's private history records both resulting maximums in order.
* Neither maximum appears in any rival's history or anonymous read.

<!-- trace:case id=g10.auction-bidding-history.TC-shn rev=1 covers=g10.auction-bidding-history.SC-vd5,g10.auction-bidding-history.SC-qhu,g10.auction-bidding-history.SC-qvv -->
### grade10-site-auction-bidding-history-US2-TC5-1: Engine bid is labeled automatic

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-02

**Pre-conditions:**
A collector has an active automatic-bid maximum.

**Steps:**

1. Cause the automatic-bidding engine to place a bid for that account.
2. Navigate to <grade10 bids url>.
3. Open that listing's history.
4. Check the accepted public price movement.

**Expected Results:**

* The collector's private history labels the action as automatic.
* The accepted public price movement remains subject to the auction's existing pseudonym rules.

---

## grade10-site-auction-bidding-history-US3: Collector reads one listing's combined history

**As a** collector,
**I want** one chronology of public price movement and my private standing,
**so that** I can see how I was outbid without seeing anyone's hidden maximum.

<!-- trace:case id=g10.auction-bidding-history.TC-sow rev=1 covers=g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4 -->
### grade10-site-auction-bidding-history-US3-TC1-1: Competing bid shows You were outbid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-03

**Pre-conditions:**
The collector is leading a listing.

**Steps:**

1. Let a rival's accepted price movement displace the collector.
2. Navigate to <grade10 bids url>.
3. Expand that listing's combined history.

**Expected Results:**

* The combined history shows that rival under its listing pseudonym.
* The same step marks **You were outbid** at the resulting public price.
* It reveals neither account's private maximum.

<!-- trace:case id=g10.auction-bidding-history.TC-i8u rev=1 covers=g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4 -->
### grade10-site-auction-bidding-history-US3-TC2-1: Automatic response is attributed to You

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-03

**Pre-conditions:**
A rival bid causes the collector's automatic maximum to advance the public price.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Open that listing's combined history.

**Expected Results:**

* The resulting accepted movement is attributed to **You** and marked as automatic.
* The private automatic event is not rendered as a contradictory second accepted bid.

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

* customer A(signed in) has a combined history on <listing_f> longer than one page.
* The last decision that fits on the first page is <answered decision>.
* No new bid is placed on <listing_f> during the pass.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_f> | An open HKD listing customer A and customer B both bid on |
| <answered decision> | customer B's maximum answered by customer A's automatic maximum, which keeps the lead |

**Steps:**

1. Navigate to <grade10 bids url>.
2. Expand <listing_f>.
3. Read the last step on the first page.
4. Load the next page.
5. Load every further page.

**Expected Results:**

* Step 3: <answered decision> reads as one step, attributed to You and marked automatic.
* Step 4's first step is the decision after <answered decision>, not its remainder.
* Across every page, each decision reads once, as one step, in order.

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

* It receives only activity created through the ZZZ-pinned entrypoint.
* No Grade10 private event or maximum is returned.

<!-- trace:case id=g10.auction-bidding-history.TC-ls6 rev=1 covers=g10.auction-bidding-history.SC-onh,g10.auction-bidding-history.SC-2pg,g10.auction-bidding-history.SC-uu5,g10.auction-bidding-history.SC-izn -->
### grade10-site-auction-bidding-history-US4-TC3-1: Anonymous reader cannot read private history

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bidding-history-US-04

**Pre-conditions:**
No storefront session.

**Steps:**

1. Request an account index or combined history without a storefront session.
2. Fetch an anonymous public auction response.

**Expected Results:**

* Grade10 refuses the request.
* The anonymous public auction response gains no private field.

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

* No bid, maximum, listing standing or auction close changes.

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
* The collector can switch to Completed without a document reload.

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

* The page names that the selected bidding history is empty.
* It does not show a loading placeholder or failure message.

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
* It does not claim that the selected filter is empty or failed.

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
* It does not claim that the selected filter is empty.

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
* The page does not show an empty history or failure message.

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

1. Request the next page.
2. Check the entries already shown and the next-page control.

**Expected Results:**

* The entries already shown remain visible while the next page loads.
* The control cannot submit the same next-page request twice.

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

* The ZZZ storefront has no new bidding-history route or screen.
* Its authenticated backend remains compatible with the shared history contract.

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
* **Bid placed** is active and shows that no bids have been placed for them
  yet.
* **Your maximums** lists the accepted maximum amount and time only — no Set
  or Raised status word.
* No sticky current-maximum summary appears in the dialog.

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

* **Your maximums** lists only the accepted set and raise amounts with times, newest first.
* No Set or Raised status word appears on those rows.
* The refused raise is absent from both lot tabs.
* Step 5's history shows the set and the raise, and no refused raise.

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

* Neither tab shows customer B's maximum, identity or payment facts.
* Public recent bids are unchanged.
* No bid, maximum, listing standing or auction close changes from reading the dialog.

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
* **Bid placed** lists the owner's automatic bid amounts and times only — no
  bid-type column.
* **Your maximums** lists every accepted configure or raise for that owner on
  that listing, newest first, amount and time only.
* No sticky current-maximum summary appears.

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

* **Bid placed** is active on open and shows the empty-bids message.
* Switching away and back keeps **Bid placed** available as its own tab —
  maximum rows never appear under **Bid placed**.

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

* Standing, live maximum, and public recent bids are unchanged.
* No bid or maximum is placed by reading either tab.

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
4. Inspect account navigation for a new maximums-only tab or route.

**Expected Results:**

* Those events read as a maximum set and a maximum raised.
* No event reads as a maximum refused, and the refused amount is absent.
* No new account tab or maximums-only route is offered.

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
