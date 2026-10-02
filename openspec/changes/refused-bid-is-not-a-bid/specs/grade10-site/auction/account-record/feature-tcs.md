# grade10-site/auction/account-record Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-auction-account-record-US2: See where I stand across every listing I bid on

**As a** bidder,
**I want** one place that says which of my listings I still lead and which I have lost,
**so that** I can act on the ones that still need me before they close.

### grade10-site-auction-account-record-US2-TC6-1: An Outbid bidder's refused bid leaves their row Outbid and in place

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
* **Trace:** grade10-site-auction-account-record-US-02

**Pre-conditions:**

* customer A(signed in, enrolled to bid) bid on <lot_6> and <lot_7>, and customer B has since outbid them on <lot_6>.
* customer A is on <lot_6 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_6> | An open HKD lot led by customer B, closing after <lot_7> |
| <lot_7> | An open HKD lot customer A bid on, closing before <lot_6> |
| <current bid> | 530000 minor units (HK$5,300) |
| <increment> | 8000 minor units (HK$80), the HK$4,000 tier |
| <next minimum> | <current bid> plus <increment>, 538000 minor units (HK$5,380) |
| <refused bid> | HK$5,300, equal to <current bid>, below <next minimum> |

**Steps:**

1. Type <refused bid> into the custom maximum on the bid panel.
2. Confirm the bid.
3. Navigate to <my auctions url>.
4. Find <lot_6>'s row in the Active tab.

**Expected Results:**

* Step 2: the bid form says Minimum bid is <next minimum>.
* Step 4: Your Standing reads Outbid, with the next valid bid <next minimum>.
* Current bid reads <current bid>.
* <lot_6> still sits below <lot_7>, as before step 1.
* No row reads Bid submitted or Bid not accepted.

---

## grade10-site-auction-account-record-US6: A bid bookmarks and toasts alerts once

**As a** bidder,
**I want** my first bid on a lot to bookmark it and tell me once that alerts are on,
**so that** I do not need a separate Watch and I am not reminded on every visit.

### grade10-site-auction-account-record-US6-TC3-1: A refused first bid puts nothing on My Auctions

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
* **Trace:** grade10-site-auction-account-record-US-06

**Pre-conditions:**

* customer(signed in, enrolled to bid, not watching <lot_5>, no bid on <lot_5>) is on <lot_5 url>.
* The account is in the row's state.
* The title count on <my auctions url> is noted.

**Test data:**

| Account state | `<typed bid>` | The bid form says |
| --- | --- | --- |
| Bidding allowed | HK$100, below <opening price> | Minimum bid is <opening price> |
| Bidding suspended by an operator | HK$200, <opening price> | Bidding is suspended on this account. Contact Us to resolve it. |

| Field | Value |
| --- | --- |
| <lot_5> | An open HKD lot with no bid from anyone |
| <opening price> | 20000 minor units (HK$200), the starting price |

**Steps:**

1. Type `<typed bid>` into the custom maximum on the bid panel.
2. Confirm the bid.
3. Reload <lot_5 url>.
4. Navigate to <my auctions url>.

**Expected Results:**

* Step 2: the bid form says the row's words, and no alerts toast shows.
* Step 3: the watch control offers Watch, not locked to watching.
* Step 4: <lot_5> is not listed in any tab.
* Step 4: the title count is the one noted.

---

## Settled

- Your Standing on an open lot is Leading or Outbid; Bid submitted and Bid not accepted are gone, and a refused bid changes no row.

## Reconciliation

**Run:** QA2, 2026-10-03. QA1's blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md`, the linked pages under `docs/prds/`, and the durable suite and the change's domain draft with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read QA1's suites, the delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites on main after `my-auctions-without-bid-holds` was accepted, and grade10 main's bidding, history, erasure and refusal-copy code and tests. It is a statement, not proof.

- **Folded into main** - QA1 wrote against the durable suite before `my-auctions-without-bid-holds` was accepted, and main now holds those rewrites: `grade10-site-auction-account-record-US2-TC1-1` is main's `grade10-site-auction-account-record-US2-TC1-2`, `grade10-site-auction-account-record-US4-TC1-1` is main's `grade10-site-auction-account-record-US4-TC1-2`, `grade10-site-auction-account-record-US8-TC2-1` is main's `grade10-site-auction-account-record-US8-TC2-2`, and `grade10-site-auction-account-record-US10-TC4-1` is already deprecated on main. All four are dropped from this suite
- **Joined** - QA1's leader case, a raise equal to the leader's own maximum, was written as `grade10-site-auction-account-record-US2-TC5-1`, an id main issued for a refused first bid. It joins main's `grade10-site-auction-account-record-US2-TC4-1`, whose Leading row reads the same Standing and price; the bid form's words for a maximum not raised are the domain case `grade10-site-auction-e2e-US04-TC03-2`'s
- **Renumbered** - QA1's Outbid case was written as `grade10-site-auction-account-record-US2-TC4-1`, an id main issued for a refused raise. It is `grade10-site-auction-account-record-US2-TC6-1`: main's case reads the Outbid row's Standing and price, and this one adds that the row keeps its place
- **Folded in** - `grade10-site-auction-account-record-SC-71` by `grade10-site-auction-account-record-US2-TC6-1` and main's `grade10-site-auction-account-record-US2-TC4-1`; `grade10-site-auction-auction-SC-90`, the row in the same place, by `grade10-site-auction-account-record-US2-TC6-1`, recorded in the auction suite too; `grade10-site-auction-account-record-SC-70` and `grade10-site-auction-auction-SC-89` by `grade10-site-auction-account-record-US6-TC3-1`, which adds that a refused first bid sets no watch and shows no alerts toast
- **Corrected** - the cases traced the Feature set group The Bidding page; they trace their sections' journeys, `grade10-site-auction-account-record-US-02` and `grade10-site-auction-account-record-US-06`
- **Raised** - none from this suite; Q15, a lost answer on a first bid showing no alerts toast, reaches `grade10-site-auction-account-record-US-06` and is recorded in the auction suite
- **Contradicted** - none
- **Uncovered anchors** - none. `grade10-site-auction-account-record-SC-14`, `grade10-site-auction-account-record-SC-15`, `grade10-site-auction-account-record-SC-64` and `grade10-site-auction-account-record-SC-65` stand by main's cases; `grade10-site-auction-account-record-SC-69` by main's `grade10-site-auction-account-record-US2-TC4-1`; `grade10-site-auction-account-record-SC-70` by main's `grade10-site-auction-account-record-US2-TC5-1` and `grade10-site-auction-account-record-US6-TC3-1`; the Feature set's card-not-charged leaf by main's `grade10-site-auction-account-record-US4-TC1-2`
