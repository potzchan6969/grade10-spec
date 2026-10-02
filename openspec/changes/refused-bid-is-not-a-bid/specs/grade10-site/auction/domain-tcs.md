# grade10-site/auction Cross-Feature E2E Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-auction-e2e-US03: Collector links a card and places a first bid

**As a** collector,
**I want** to study the gallery, link my card once, and bid inside the window,
**so that** the card I looked at is the card my bid stands on, with nothing taken from it until I win.

### grade10-site-auction-e2e-US03-TC01-2: Gallery study leads to an accepted first bid

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05, grade10-site-auction-auction-US-02, grade10-site-auction-bid-payment-method-US-01

**Pre-conditions:**

* A user is signed in with <card> saved and is on <listing_5>.
* <listing_5> is live, holds no bids, and its starting price is <starting price>.
* <listing_5> holds more than one gallery image.

**Test data:**

| Field | Value |
| --- | --- |
| `<card>` | Visa ending 4242 |
| `<listing_5>` | A live listing with no bids, several gallery images, in HKD |
| `<starting price>` | 120000 minor units |
| `<bid amount>` | 120000 minor units, equal to <starting price> |

**Steps:**

1. Step through the gallery thumbnails and open one image at zoom size.
2. Enter <bid amount> in the bid field and select **Place Bid**.
3. Read Time left, Highest bid and Recent Bids.
4. Read <card>'s activity at the card provider.

**Expected Results:**

* The gallery walks in order at thumb, detail and zoom sizes.
* The bid is accepted in the one answer, with no Authorizing state before it.
* Highest bid reads <bid amount>, the bid count reads 1, and Recent Bids shows the user's own bid as You.
* Step 4 shows nothing held or charged on <card>.

### grade10-site-auction-e2e-US03-TC02-2: Bid below the next increment is refused on the bid form and recorded nowhere

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
* **Trace:** grade10-site-auction-auction-US-14, grade10-site-auction-bidding-history-US-01, grade10-site-auction-account-record-US-02

**Pre-conditions:**

* A user is signed in with <card> saved and is on <listing_4>.
* <listing_4> is live, its current bid is <current bid> and its increment is <increment>.
* The user holds no bid on <listing_4> and does not watch it.

**Test data:**

| Field | Value |
| --- | --- |
| `<card>` | Visa ending 4242 |
| `<listing_4>` | A live listing with bids from other users, in HKD, bid count <bid count> |
| `<current bid>` | 480000 minor units (HKD 4,800.00) |
| `<increment>` | 8000 minor units (HKD 80.00), the HK$4,000 tier |
| `<bid amount>` | 487900 minor units (HKD 4,879), one major unit below <current bid> plus <increment> |
| `<bid count>` | 2 |

**Steps:**

1. Enter <bid amount> in the bid field and select **Place Bid**.
2. Read the bid form.
3. Reload <listing_4> and read Highest bid, the bid count and Recent Bids.
4. Navigate to <grade10 bids url> and look for <listing_4>.
5. Navigate to <my auctions url> and look for <listing_4>.

**Expected Results:**

* Step 2 reads Minimum bid is, naming <current bid> plus <increment>, and no provider message appears.
* Step 3 reads Highest bid <current bid>, bid count <bid count>, and no row of the user's in Recent Bids.
* Step 4 shows no entry for <listing_4>.
* Step 5 shows no row for <listing_4>.

---

## grade10-site-auction-e2e-US04: Collector commits a maximum and is bid to the lead

**As a** collector,
**I want** to commit one maximum and Grade10 to bid for me,
**so that** I keep the lead without sitting on the page, and nothing is taken
from my card until I win.

### grade10-site-auction-e2e-US04-TC01-1: Two maxima settle at the second-highest plus one increment

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01, grade10-site-auction-auto-bidding-US-03, grade10-site-auction-auction-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/domain.spec.ts`

**Pre-conditions:**

* User A and user B are signed in on separate sessions with <card> saved, both on <listing_5>.
* <listing_5> is live, holds no bids, its starting price is <starting price> and its increment is <increment>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | A live listing with no bids, in HKD |
| `<starting price>` | 120000 minor units |
| `<increment>` | 25000 minor units |
| `<user A maximum>` | 800000 minor units |
| `<user B maximum>` | 505000 minor units, below <user A maximum> |
| `<user B raise>` | 900000 minor units, above <user A maximum> |

**Steps:**

1. As user A, select **Set maximum**, enter <user A maximum> and **Confirm**.
2. As user B, set a maximum of <user B maximum> and **Confirm**.
3. As user A, reload <listing_5> and read Your maximum, Highest bid and standing.
4. As user B, select **Raise**, enter <user B raise> and confirm.

**Expected Results:**

* After step 1 User A leads at <starting price>.
* After step 2 user A still leads and Highest bid reads <user B maximum> plus <increment>.
* User A reads Your maximum, Highest bid and their standing as three separate facts.
* After step 4 user B leads at <user A maximum> plus <increment>, with no bids recorded at the amounts in between.

### grade10-site-auction-e2e-US04-TC02-2: Auto-bid raises the leader on their behalf, with nothing taken from the card

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auto-bidding-US-05, grade10-site-auction-bidding-history-US-02

**Pre-conditions:**

* <listing_6> is live, its current bid is <leader price> and its increment is <increment>.
* User A leads <listing_6> with a committed maximum of <user A maximum>, placed on <card>.
* User B is signed in with a card saved and is on <listing_6>.

**Test data:**

| Field | Value |
| --- | --- |
| `<card>` | Visa ending 4242 |
| `<listing_6>` | A live listing led by user A, in HKD |
| `<leader price>` | 530000 minor units (HKD 5,300.00) |
| `<increment>` | 8000 minor units (HKD 80.00), the HK$4,000 tier at <user B maximum> |
| `<user A maximum>` | 800000 minor units (HKD 8,000.00) |
| `<user B maximum>` | 555000 minor units (HKD 5,550.00), below <user A maximum> |

**Steps:**

1. As user B, set a maximum of <user B maximum> and confirm.
2. As user A, open <listing_6> and read Highest bid, Your maximum and Recent Bids.
3. As user A, navigate to <grade10 bids url> and expand <listing_6>.
4. Read <card>'s activity at the card provider.

**Expected Results:**

* Highest bid reads <user B maximum> plus <increment> and user A still leads, Your maximum <user A maximum>.
* The bid count includes the raise, and the history shows it as placed on user A's behalf rather than as a manual bid.
* Step 4 shows nothing held or charged on <card>.

### grade10-site-auction-e2e-US04-TC03-2: Lowering a maximum is refused on the bid form and the lead holds

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
* **Trace:** grade10-site-auction-auto-bidding-US-01, grade10-site-auction-auto-bidding-US-02, grade10-site-auction-auction-US-14, grade10-site-auction-bidding-history-US-02

**Pre-conditions:**

* <listing_6> is live and its current bid is <leader price>.
* User A leads <listing_6> with a committed maximum of <user A maximum> and is on it.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | A live listing led by user A, in HKD |
| `<leader price>` | 530000 minor units (HKD 5,300.00) |
| `<user A maximum>` | 800000 minor units (HKD 8,000.00) |
| `<lower maximum>` | 300000 minor units (HKD 3,000.00), below <user A maximum> |

**Steps:**

1. Navigate to <grade10 bids url>, expand <listing_6> and count its history lines.
2. Navigate back to <listing_6>.
3. Select **Raise**, enter <lower maximum> and confirm.
4. Read the bid form, Your maximum, Highest bid and the leader.
5. Navigate to <grade10 bids url> and expand <listing_6>.
6. Navigate to <my auctions url> and read <listing_6>'s row.

**Expected Results:**

* Step 4 reads "Your new maximum must be higher than your current one." on the bid form.
* Step 4 reads Your maximum <user A maximum>, Highest bid <leader price>, and user A Leading.
* Step 5 shows the same history lines as step 1, with no line for the refused attempt.
* Step 6's row reads Leading, with Current bid <leader price>.

---

## grade10-site-auction-e2e-US05: Collector learns they were outbid and finds it in their bids

**As a** collector,
**I want** losing the lead to show on the lot and in my bids index,
**so that** I can see I was outbid and what the next bid must clear.

### grade10-site-auction-e2e-US05-TC01-2: Outbid standing reaches the lot page and the bids index

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
* **Trace:** grade10-site-auction-auto-bidding-US-03, grade10-site-auction-auto-bidding-US-02, grade10-site-auction-bidding-history-US-01

**Pre-conditions:**

* <listing_6> is live and its current bid is <leader price>.
* User A leads <listing_6> with a committed maximum of <user A maximum>.
* User B is signed in with a card saved and is on <listing_6>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | A live listing led by user A, in HKD |
| `<leader price>` | 530000 minor units (HKD 5,300.00) |
| `<increment>` | 20000 minor units (HKD 200.00), the HK$8,000 tier at <user A maximum> |
| `<user A maximum>` | 800000 minor units (HKD 8,000.00) |
| `<user B maximum>` | 900000 minor units (HKD 9,000.00), above <user A maximum> |

**Steps:**

1. As user B, set a maximum of <user B maximum> and confirm.
2. As user A, open <listing_6> and read the bid panel.
3. As user A, navigate to <grade10 bids url> and read the Active list.

**Expected Results:**

* User A reads Outbid, with Your maximum still <user A maximum> and Highest bid at <user A maximum> plus <increment>.
* <listing_6> appears once under Active with outbid standing, its price and currency code, and its latest activity time.

---

## grade10-site-auction-e2e-US08: Collector's private bidding facts stay private

**As a** collector,
**I want** my maximum kept to my own account,
**so that** a rival, a signed-out visitor, or another storefront reads none of
it.

### grade10-site-auction-e2e-US08-TC01-2: Rival reads the price but never the leader's maximum

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-02, grade10-site-auction-auction-US-02, grade10-site-auction-bidding-history-US-04

**Pre-conditions:**

* <listing_6> is live and its current bid is <leader price>.
* User A leads <listing_6> with a committed maximum of <user A maximum>.
* User B is signed in, holds no bid on <listing_6>, and is on it.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | A live listing led by user A, in HKD |
| `<leader price>` | 530000 minor units |
| `<user A maximum>` | 800000 minor units |

**Steps:**

1. Read the bid panel and Recent Bids.
2. Read the public listing contract <listing_6>'s page is served from.
3. Sign out and open the same address.

**Expected Results:**

* Highest bid reads <leader price> and <user A maximum> is neither shown nor derivable from any public fact.
* Recent Bids names other users by listing pseudonym only, with no card facts.
* The signed-out reader gets no private history and no maximum.

### grade10-site-auction-e2e-US08-TC03-2: A linked collector's bid stands at once on the card on file

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-02, grade10-site-auction-auto-bidding-US-05, grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer A is signed in with a linked card and is on the lot page for <listing_14>.
* customer B is signed in with a linked card, on a separate session, and can bid on <listing_14>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_14> | An open HKD listing with no bids, starting price <starting price> |
| <starting price> | 20000 minor units (HKD 200.00) |
| <increment> | 1000 minor units (HKD 10.00), the HKD step at <user A maximum> |
| <user A maximum> | 50000 minor units (HKD 500.00) |
| <user B maximum> | 80000 minor units (HKD 800.00), above <user A maximum> |
| <price after A> | <starting price> |
| <price after B> | <user A maximum> plus <increment> |

**Steps:**

1. As customer A, enter <user A maximum> in the custom maximum on the bid panel and confirm the bid.
2. As customer B, enter <user B maximum> in the custom maximum on the same lot and confirm the bid.
3. Read the bid panel.
4. Read both customers' card activity at the card provider.

**Expected Results:**

* Step 1 accepts the bid at <price after A> in the one answer, and Change is unavailable.
* Highest bid reads <price after B>, and customer B leads.
* Step 4 shows nothing held or charged on either card.

---

## grade10-site-auction-e2e-US09: Collector meets a lot that is not there

**As a** collector,
**I want** a dead lot address to say so plainly,
**so that** I am never shown an empty page in place of a lot.

### grade10-site-auction-e2e-US09-TC02-1: Unavailable card capability fails the bid explicitly

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-03, grade10-site-auction-bidding-history-US-02, grade10-site-auction-bidding-history-US-01

**Pre-conditions:**

* <listing_12> is live and its current bid is <current bid>.
* The card authorization capability a bid needs is unavailable for the payment account <listing_12> runs on.
* A user is signed in with <card> saved, holds no accepted bid on <listing_12>, and is on it.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_12>` | A live listing whose payment account has no card authorization capability |
| `<current bid>` | 480000 minor units |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |

**Steps:**

1. Enter <bid amount> and select **Place Bid**.
2. Navigate to <grade10 bids url> and expand <listing_12>.

**Expected Results:**

* The bid fails naming the unavailable capability, with no credentials, card, or address data shown.
* No bid, hold or fixture-backed outcome is created and Highest bid stays <current bid>.
* The attempt appears as a failed event with a safe payment reason, and <listing_12> carries failed-only standing.

### grade10-site-auction-e2e-US09-TC03-1: A repeated card authorization event changes the lot once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-03, grade10-site-auction-bidding-history-US-03

**Pre-conditions:**

* <listing_13> is live and holds one accepted bid of 505000 minor units.
* That bid has exactly one recorded card authorization event.

**Test data:**

| `<event copy>` | `<outcome>` |
| --- | --- |
| The same event with its original provider event id | the recorded outcome is returned without a second state transition |
| The same event with a tampered body and its original signature | the event is rejected on signature |

**Steps:**

1. Deliver <event copy> to the auction.
2. Read <listing_13> and expand it at <grade10 bids url>.

**Expected Results:**

* <outcome>.
* One accepted bid, one hold, and one history entry stand for that bid.
* No bid, hold, release, capture or order state is duplicated.

---

## grade10-site-auction-e2e-US10: Exploratory passes

**As a** tester,
**I want** a time-boxed roam across the auction surfaces,
**so that** what the written cases do not reach is found before a user
finds it.

### grade10-site-auction-e2e-US10-TC02-2: Roam competing maxima and the closing minutes for one hour

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** exploratory
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-auto-bidding-US-03, grade10-site-auction-auction-US-02, grade10-site-auction-bidding-history-US-03

**Pre-conditions:**

* <listing_5> is live, its increment is <increment>, and its extension duration is <extension duration>.
* User A and user B are signed in on separate sessions with <card> saved, both on <listing_5>.
* Network manipulation is available to delay a bid response.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | A live listing with no bids, in HKD |
| `<increment>` | The HKD increment at the amount being beaten |
| `<extension duration>` | 1800 seconds |

**Steps:**

1. Trade maxima - equal, one <increment> apart, far above, far below - including two submitted at the same moment.
2. Delay one user's bid response, then submit the other's before it lands.
3. Push into extended bidding repeatedly, then let one full <extension duration> pass.
4. Read each user's standing and their <grade10 bids url> history after every exchange.

**Expected Results:**

* Highest bid is never above the leader's maximum and is never reached through a ladder of intermediate bids.
* An equal later maximum is accepted, does not take the lead, and is not reported as a refusal.
* A delayed lower bid never becomes the current bid over a higher one.
* Each user reads only their own maximum, and every standing change is explained by an event in their own history.
* A refused attempt shows on the bid form only, never in either user's history.
* Every surprise is written up with the amounts, the order, and the timing that produced it.

---

## grade10-site-auction-e2e-US12: Bidders follow a lot through its close to their record

**As a** bidder,
**I want** the lot page and My Auctions to show one final price and one result once the close is recorded,
**so that** what I read on either is what the auction decided.

### grade10-site-auction-e2e-US12-TC01-1: Winner and losing bidder read one result on the lot and My Auctions

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
* **Trace:** grade10-site-auction-auction-US-11, grade10-site-auction-listing-page-US-14, grade10-site-auction-account-record-US-10, grade10-site-auction-account-record-US-04

**Pre-conditions:**

* customer A leads <listing_15> at <final price> with maximum <user A maximum>.
* customer B committed <user B maximum> on <listing_15> and was outbid.
* customer A and customer B are signed in on separate sessions, both on the lot page for <listing_15>.
* <listing_15>'s recorded close is under a minute away, and no further bid will be placed.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_15> | An HKD listing in extended bidding, led by customer A |
| <final price> | 513000 minor units, <user B maximum> plus its 8000 increment |
| <user A maximum> | 800000 minor units, above <final price> |
| <user B maximum> | 505000 minor units, below <final price> |

**Steps:**

1. Wait through the recorded close on both pages, without reloading.
2. As customer A, read the lot's state.
3. As customer B, read the lot's state.
4. As customer A, navigate to <my auctions url>, select the Ended tab and find <listing_15>'s row.
5. As customer B, navigate to <my auctions url>, select the Ended tab and find <listing_15>'s row.

**Expected Results:**

* Once the close passes, both pages read Closed with no result until the close is recorded.
* Step 2 reads Won and step 3 reads Did not win, with Highest bid <final price> on both.
* Step 4's row reads Won, with Current bid <final price>.
* Step 5's row reads Didn't win, with Current bid <final price>, not <user B maximum>.
* Step 5's row reads "Your card was not charged."

---

## Settled

- No domain case reads a card hold, a card authorization, a payment confirmation or a bid-time hold switch; the cases that did are rewritten or deprecated (decisions Q1, Q5). A case that reads the card reads that nothing is held or charged on it.
- A refused attempt is not a bid: it shows on the bid form that made it and nowhere in the bidder's history, My Auctions or the lot's public record (decisions Q6).
- A losing row on My Auctions reads "Your card was not charged." (decision Q2).
- The rewritten cases that were automated now read manual: each owes its test updated to the new revision, and the flip back with its Decided by line.
- HKD increments follow the Bidding page's schedule: HK$80 from HK$4,000 and HK$200 from HK$8,000.

## Reconciliation

**Run:** QA2, 2026-10-03. Joined the domain cases, composed from the journeys of auction, auto-bidding, bid-payment-method, bidding-history, account-record and listing-page, with this change's delta scenarios. It is a statement, not proof.

- **Revised** - `grade10-site-auction-e2e-US03-TC01-2`, `grade10-site-auction-e2e-US03-TC02-2`, `grade10-site-auction-e2e-US04-TC02-2`, `grade10-site-auction-e2e-US04-TC03-2`, `grade10-site-auction-e2e-US05-TC01-2`, `grade10-site-auction-e2e-US08-TC01-2`, `grade10-site-auction-e2e-US08-TC03-2` and `grade10-site-auction-e2e-US10-TC02-2`: each read a card hold, an authorization or a refused attempt kept in the record, so each moves up a revision and returns to draft. The six that were automated owe their test the new id and the flip back with a Decided by line
- **Deprecated** - `grade10-site-auction-e2e-US09-TC02-1`, a bid failing on an unavailable card capability, and `grade10-site-auction-e2e-US09-TC03-1`, a repeated card authorization event: no bid asks the card
- **Trace changed** - `grade10-site-auction-e2e-US04-TC01-1` traces `grade10-site-auction-auction-US-02` in place of the retired `grade10-site-auction-auction-US-03`; its steps, results and status are unchanged
- **Contradicted** - none
