# grade10-site/auction/account-record Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-01, tcs-rules r4

## grade10-site-auction-account-record-US10: Bidder reads each lot's price and result on My Auctions

**As a** bidder,
**I want** each lot I bid on to show the auction's current or final price and, once it closes, whether I won,
**so that** I know what a lot sold for and whether I lost it without opening the lot.

### grade10-site-auction-account-record-US10-TC1-1: Ended row shows the final price and the recorded result

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-10

**Pre-conditions:**

* `<lot_1>` closed, its close recorded, customer A winning at `<final price>`.
* customer B's last bid on `<lot_1>` was `<customer B bid>`.
* `<viewer>` is signed in.

**Test data:**

| `<viewer>` | `<own last bid>` | `<standing>` |
| --- | --- | --- |
| customer A | `<customer A maximum>` | Won |
| customer B | `<customer B bid>` | Didn't win |

| Field | Value |
| --- | --- |
| `<lot_1>` | A closed HKD lot both customers bid on |
| `<final price>` | 513000 minor units, `<customer B bid>` plus its 8000 increment |
| `<customer A maximum>` | 800000 minor units, above `<final price>` |
| `<customer B bid>` | 505000 minor units, customer B's maximum, below `<final price>` |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Select the Ended tab.
3. Find `<lot_1>`'s row.

**Expected Results:**

* Current bid reads `<final price>`, not `<own last bid>`.
* Your Standing reads `<standing>`.

### grade10-site-auction-account-record-US10-TC2-1: Row shows no result before the close is recorded

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
* **Trace:** grade10-site-auction-account-record-US-10

**Pre-conditions:**

* customer A(signed in) leads `<lot_2>`.
* `<lot_2>`'s close has passed, and recording it is held back.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_2>` | An HKD lot led by customer A, its close passed and not yet recorded |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Find `<lot_2>`'s row and read its tab and Your Standing.
3. Let recording the close resume.
4. Reload `<my auctions url>`.
5. Find `<lot_2>`'s row and read Your Standing.

**Expected Results:**

* At step 2 the row is in the Active tab, and Your Standing reads Leading with no next valid bid, neither Won nor Didn't win.
* At step 5 the row is in the Ended tab and Your Standing reads Won.

### grade10-site-auction-account-record-US10-TC3-1: Open row shows the auction's current price, not the collector's bid

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
* **Trace:** grade10-site-auction-account-record-US-10

**Pre-conditions:**

* customer B(signed in) bid `<customer B bid>` on `<lot_3>`.
* customer A has since raised `<lot_3>`'s current bid to `<current bid>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_3>` | An open HKD lot, its close more than an hour away |
| `<customer B bid>` | 100000 minor units |
| `<current bid>` | 120000 minor units, above `<customer B bid>` |

**Steps:**

1. As customer B, navigate to `<my auctions url>`.
2. Find `<lot_3>`'s row in the Active tab.

**Expected Results:**

* Current bid reads `<current bid>`, not `<customer B bid>`.
* Your Standing reads Outbid, with the next valid bid.

### grade10-site-auction-account-record-US10-TC4-1: Lone first bid confirming after the close reads Didn't win on an unsold lot

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-account-record-US-10

**Blocked:** Product owner - what Current bid reads on the row of a lot that closed unsold (Q32).

**Pre-conditions:**

* Bid-time card holds are on.
* `<lot_4>` has no bid, and its scheduled close is under a minute away.
* customer B(signed in) placed `<first bid>` on `<lot_4>`, and its payment confirmation is held back.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_4>` | An HKD lot with a starting price of 20000 minor units and no bid |
| `<first bid>` | 20000 minor units, the opening price |

**Steps:**

1. Wait until `<lot_4>`'s scheduled close has passed and its close is recorded.
2. Let the payment confirmation resume.
3. Navigate to `<my auctions url>`.
4. Select the Ended tab and find `<lot_4>`'s row.

**Expected Results:**

* The row is in the Ended tab, and Your Standing reads Didn't win.
* The row says the card hold is releasing or released, never charged.
* Current bid reads the zero amount a lot with no bid shows, not `<first bid>`.


## Reconciliation

**Run:** QA2 rerun, 2026-10-01. QA1's blind pass read the frozen Purpose and Feature set, the change's journeys, `proposal.md`, `decisions.md` with its `## Raised`, the linked pages under `docs/prds/`, `openspec/config.yaml`'s context, the durable suite and the change's domain draft with their `## Reconciliation` stripped; it was denied every `## Requirements` section, `openspec/specs/` beyond those, and the archive. QA2 read both readings, the delta, `tech-design.md`, `tasks.md`, and the built My Auctions row mapping in grade10 for reference. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| Ended row shows the final price, not the viewer's own bid, with Won or Didn't win (`grade10-site-auction-account-record-US10-TC1-1`, deprecated by QA1 for the domain walk) | **Rejected:** a second walk of the domain case below |
| Before the close is recorded the row reads no result; after it, Won (`grade10-site-auction-account-record-US10-TC2-1`) | **Folded in:** `grade10-site-auction-account-record-SC-65`, `grade10-site-auction-account-record-SC-67` |
| QA1 raised: which tab holds the row between the effective and the recorded close, and what Your Standing reads | **Settled by the artifacts:** the open-standing requirement and `grade10-site-auction-account-record-SC-65` - Active tab, the open Status kept, no minimum next valid bid, never Ending soon. TC2-1 patched to assert it; `<v>` kept, the case still draft |
| Open row shows the auction's current price, not the collector's bid (`grade10-site-auction-account-record-US10-TC3-1`) | **Folded in:** `grade10-site-auction-account-record-SC-64` |
| QA1 raised: a lone first bid confirming after the scheduled close - the row's standing | **Settled by the artifacts:** after the close the row reads exactly Won or Didn't win from the recorded result; nobody won, so Didn't win, with the durable hold-release detail. New case `grade10-site-auction-account-record-US10-TC4-1` |
| QA1 raised: the same row's Current bid on a lot that closed unsold | **Escalated:** Q32 - recommended: the zero amount every no-bid row shows today, no new copy. TC4-1 stays draft, **Blocked:** product owner |
| Outbid row past the effective close, before the close is recorded | **Rejected as a scenario:** the requirement already states it (open Status kept, no minimum next valid bid); no blind case asserts it apart from Leading |
| Open-window statuses Leading, Outbid, Bid submitted, Bid not accepted, and Won or Didn't win after the close | **Out of suite:** `grade10-site-auction-account-record-SC-14` to `grade10-site-auction-account-record-SC-19` serve the context journey `grade10-site-auction-account-record-US-02`, unchanged by this delta; the durable suite's `grade10-site-auction-account-record-US2-TC1-1`, `grade10-site-auction-account-record-US2-TC2-1` and `grade10-site-auction-account-record-US4-TC1-1` assert them |

- **Covered at domain** - `grade10-site-auction-e2e-US12-TC01-1` walks `grade10-site-auction-account-record-SC-66`, `grade10-site-auction-account-record-SC-18` and `grade10-site-auction-account-record-SC-19`: winner and losing bidder read one final price, Won and Didn't win, on My Auctions

**Uncovered anchors:** none. `grade10-site-auction-account-record-US-10` has TC2-1, TC3-1 and TC4-1, and the domain case for the final price on both rows.
