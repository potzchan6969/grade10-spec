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

* Step 2: the bid form says Minimum bid is <opening price>.
* Step 4 lists <listing_a> and not <listing_b>.
* Step 5 does not list <listing_b>.
* No listing reads a failed, refused or pending standing.

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

* Step 2: the bid form says Minimum bid is <next minimum>.
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

* Step 2: the bid form says Your new maximum must be higher than your current one.
* Step 4 shows the noted entries and no other.
* No entry names the refused amount or a refusal reason.
* Step 5's bid count is the one noted.

---

## grade10-site-auction-bidding-history-US3: Collector reads one listing's combined history

**As a** collector,
**I want** one chronology of public price movement and my private standing,
**so that** I can see how I was outbid without seeing anyone's hidden maximum.

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

## grade10-site-auction-bidding-history-US6: Collector reviews maximum history on the lot

**As a** signed-in collector,
**I want** to open **Your bidding** on a lot and read every accepted maximum I set or raised there,
**so that** I can see when I raised the ceiling without leaving the lot or opening the full account chronology.

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

---

## grade10-site-auction-bidding-history-US8: Collector reads clearer maximum labels on /bids

**As a** signed-in collector,
**I want** configure and raise events on `/bids` named as maximum set or raised,
**so that** the account chronology matches the lot wording without a new account tab.

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

---

## Settled

- A refused bid is not a bid: it adds no listing to `/bids`, no history entry and no standing, and moves no listing; failed-only standing and refusal reasons are gone.
- `/bids` standing is Leading, Outbid, Won or Canceled.
- A lot lost at the close reads Outbid on `/bids` and Didn't win on My Auctions (decisions Q14).

## Reconciliation

**Run:** QA2, 2026-10-03. QA1's blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md`, the linked pages under `docs/prds/`, and the durable suite and the change's domain draft with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read QA1's suites, the delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites on main after `my-auctions-without-bid-holds` was accepted, and grade10 main's bidding, history, erasure and refusal-copy code and tests. It is a statement, not proof.

- **Folded in** - `grade10-site-auction-bidding-history-SC-47` by the Canceled row of `grade10-site-auction-bidding-history-US1-TC6-1`; `grade10-site-auction-bidding-history-SC-48` by `grade10-site-auction-bidding-history-US3-TC5-1`; `grade10-site-auction-bidding-history-SC-49` by `grade10-site-auction-bidding-history-US1-TC2-2`; `grade10-site-auction-bidding-history-SC-50` by `grade10-site-auction-bidding-history-US1-TC7-1` and `grade10-site-auction-bidding-history-US2-TC2-2`; `grade10-site-auction-bidding-history-SC-44` by `grade10-site-auction-bidding-history-US6-TC2-2`; `grade10-site-auction-bidding-history-SC-46` by `grade10-site-auction-bidding-history-US8-TC1-2`; `grade10-site-auction-bidding-history-SC-18` and `grade10-site-auction-bidding-history-SC-45` by `grade10-site-auction-bidding-history-US4-TC4-1` and `grade10-site-auction-bidding-history-US6-TC3-1`; `grade10-site-auction-auction-SC-90`, an Outbid listing keeping its place, by `grade10-site-auction-bidding-history-US1-TC7-1`
- **Covered at domain** - `grade10-site-auction-e2e-US03-TC02-2` walks `grade10-site-auction-bidding-history-SC-29`: a maximum below the next bid is refused and its history gains no event
- **Added by QA2** - `grade10-site-auction-bidding-history-US1-TC8-1` for the other half of `grade10-site-auction-bidding-history-SC-47`: a call-off adds no listing for a collector who only watched. `grade10-site-auction-bidding-history-US2-TC1-2` for `grade10-site-auction-bidding-history-SC-51`: the durable case read an accepted manual bid, which no longer exists; an accepted bid now reads as one maximum set. `grade10-site-auction-bidding-history-US1-TC1-1` restyled: its pre-condition asked for manual bids. The `grade10-site-auction-bidding-history-US7` heading carries the journey's new words, with no case changed
- **Revised** - `grade10-site-auction-bidding-history-US1-TC2-2`, `grade10-site-auction-bidding-history-US2-TC2-2`, `grade10-site-auction-bidding-history-US6-TC2-2` and `grade10-site-auction-bidding-history-US8-TC1-2`: QA1 kept their ids, but each now verifies that a refusal is absent where it was retained, so each moves up a revision. The markers of `grade10-site-auction-bidding-history-US1-TC1-1`, `grade10-site-auction-bidding-history-US1-TC2-2`, `grade10-site-auction-bidding-history-US2-TC1-2` and `grade10-site-auction-bidding-history-US2-TC2-2` drop the retired `grade10-site-auction-bidding-history-SC-02` and `grade10-site-auction-bidding-history-SC-38`, and those of `grade10-site-auction-bidding-history-US2-TC1-2` and `grade10-site-auction-bidding-history-US2-TC2-2` drop `grade10-site-auction-bidding-history-SC-37` too. `grade10-site-auction-bidding-history-US4-TC4-1` and `grade10-site-auction-bidding-history-US6-TC3-1` lose the hold from what reading leaves unchanged, a draft restyle with `<v>` kept
- **Corrected** - `grade10-site-auction-bidding-history-US3-TC5-1`, `grade10-site-auction-bidding-history-US6-TC2-2` and `grade10-site-auction-bidding-history-US6-TC3-1` traced Feature set groups; they trace their sections' journeys
- **Deprecated** - `grade10-site-auction-bidding-history-US3-TC3-1`, a failed attempt beside the auction
- **Raised, answered** - Q14: a lot lost at the close reads Outbid on `/bids` and Didn't win on My Auctions, as grade10 runs, recommended; answer in `## Settled`
- **Reworded** - `grade10-site-auction-bidding-history-SC-05`: an empty index is now for an account that has placed no bid, in place of one with no retained maximum attempt or automatic-bid activity; `grade10-site-auction-bidding-history-US1-TC5-1` still asserts it
- **Retired** - `grade10-site-auction-bidding-history-SC-02`, a failed-only listing, and `grade10-site-auction-bidding-history-SC-13`, a failed attempt beside the auction, leave their renamed requirements with refused attempts; `grade10-site-auction-bidding-history-SC-38`, a refused maximum kept as an event, and `grade10-site-auction-bidding-history-SC-37`, a manual bid request refused, leave "Every accepted maximum action leaves a private event". `grade10-site-auction-bidding-history-SC-51` states the rule that replaces `grade10-site-auction-bidding-history-SC-37`: every bid is a maximum. No retired id is reissued
- **Contradicted** - none
- **Uncovered anchors** - none
