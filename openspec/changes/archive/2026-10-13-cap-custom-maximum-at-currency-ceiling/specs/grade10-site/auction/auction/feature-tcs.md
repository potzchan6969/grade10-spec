# grade10-site/auction/auction Test Cases

**Status:** pending-review · 0/2
**Drafts styled:** 2026-10-09, tcs-rules r4

## grade10-site-auction-auction-US14: Bidder reads why a bid was refused, and nothing else moves

**As a** bidder,
**I want** above-ceiling attempts to show no maximum-bid message and other refusals to say why on the bid form, with no trace of a refused bid anywhere else,
**so that** an oversized entry does not interrupt my review and I never read a bid I did not place as one I did.

<!-- trace:case id=g10.auction-auction.TC-r0p rev=2 covers=g10.auction-auction.SC-rl3,g10.auction-auction.SC-lu0,g10.auction-auction.SC-fnt,g10.auction-auction.SC-nh5,g10.auction-auction.SC-ulv,g10.auction-auction.SC-cfg -->
### grade10-site-auction-auction-US14-TC1-2: A refused bid says why on the bid form and places nothing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-14

**Pre-conditions:**

* customer(card linked, account in the row's state) is signed in and on the lot page for `<listing_29>`.
* customer holds no bid on `<listing_29>` and does not watch it.
* `<listing_29>` is in the row's lot state.

**Test data:**

| Refused when | Account state | Lot state | Amount entered | The bid form says |
| --- | --- | --- | --- | --- |
| Below the next minimum | In good standing | Open, minimum next bid `<next minimum>` | 512900 minor units (HKD 5,129), one major unit below `<next minimum>` | Minimum bid is, naming `<next minimum>` |
| Bidding suspended on the account | Bidding suspended | Open | `<next minimum>` | Bidding is suspended on this account. Contact Us to resolve it. |
| Account banned from bidding | Banned from bidding | Open | `<next minimum>` | This account cannot bid. |
| After the close | In good standing | Past its effective close, its close not yet recorded, the page's live updates held back | `<next minimum>` | Your bid did not go through. |

| Field | Value |
| --- | --- |
| `<listing_29>` | An HKD listing led by customer B at `<current bid>`, bid count `<bid count>` |
| `<current bid>` | 505000 minor units (HKD 5,050.00) |
| `<next minimum>` | 513000 minor units (HKD 5,130.00), `<current bid>` plus its 8000 increment |
| `<bid count>` | 3 |

**Steps:**

1. Enter the row's amount entered in the custom maximum on the bid panel.
2. Place the bid.
3. Read the bid form.
4. Reload the lot page and read Highest bid, the bid count, Recent Bids and the bid panel's standing.
5. Navigate to `<my auctions url>` and look for `<listing_29>`.
6. Navigate to `<grade10 bids url>` and look for `<listing_29>`.

**Expected Results:**

* Step 3 shows the row's words on the bid form.
* Step 4 reads Highest bid `<current bid>`, bid count `<bid count>`, and Recent Bids as before, with no row for the customer.
* Step 4 shows no Leading or Outbid standing for the customer.
* Step 5 shows no row for `<listing_29>`.
* Step 6 shows no entry for `<listing_29>`.

<!-- trace:case id=g10.auction-auction.TC-55k rev=1 covers=g10.auction-auction.SC-rl3,g10.auction-auction.SC-lu0,g10.auction-auction.SC-fnt,g10.auction-auction.SC-nh5,g10.auction-auction.SC-ulv,g10.auction-auction.SC-cfg -->
### grade10-site-auction-auction-US14-TC4-1: Defensive ceiling refusal shows no message or retry

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/custom-maximum-ceiling.spec.ts`

**Pre-conditions:**

* customer(card linked, account in good standing) is signed in on `<listing_29>`.
* customer holds no bid on `<listing_29>` and does not watch it.
* The next bid answer is mocked as `AMOUNT_TOO_HIGH`, with the row's ceiling and server-message fields.
* The custom maximum draft equals `<valid draft>`.

**Test data:**

| Ceiling field | Server-message field |
| --- | --- |
| `<ceiling>` | A distinct server-message marker |
| Absent | A distinct server-message marker |
| `<ceiling>` | Absent |
| Absent | Absent |

| Field | Value |
| --- | --- |
| listing_29 | An open HKD listing led by customer B, current bid 505000 minor units and bid count 3 |
| valid draft | 5130 whole major units, the listing's next minimum |
| ceiling | 8000000000 minor units (HKD 80,000,000) |

**Steps:**

1. Place the bid.
2. Wait for the mocked refusal answer.
3. Read the bid form and custom maximum field.
4. Read the number of bid attempts sent.
5. Reload the listing and read its public bids and standing.
6. Read My Auctions and Bidding History for `<listing_29>`.

**Expected Results:**

* Step 3: no maximum-bid or generic refusal message appears.
* Step 3: no server message or toast appears.
* Step 3: pending bid status ends and the action is usable.
* Step 3: the displayed draft remains `<valid draft>`.
* Step 4: exactly one attempt is sent, without automatic retry.
* Step 5: the price, leader, bid count and public bids remain unchanged.
* Step 5: customer has no Leading or Outbid standing.
* Step 6: neither surface records the refused attempt.

## Settled

- An above-ceiling answer shows no maximum-bid message, resets no draft and triggers no automatic retry (Q3).

- The identity bar is enforced by the storefront before the auction receives a bid.
- A brand without an identity store has no identity bar.
- The first-bid minimum on a listing with no accepted bid is its opening price: the starting price, or the lowest increment on a 0 start; one increment above the current bid applies from the second bid (decisions Q19, Q27).
- A first bid of 0, or of one minor unit, on a 0 start is a non-goal; no case asserts either.
- The price a lone maximum stands at on a 0 start is auto-bidding's case, not this suite's.
- A valid bid in an extension case is placed by a bidder who does not lead, so it moves the price and restarts the timer; a leader raising their own maximum moves nothing, and is US12's case (decision Q5).
- Between the effective close and the recorded close, a lot takes no bid and names no result; the public status stays Active until the close is recorded (decision Q3).
- A bid at exactly the scheduled close counts on every listing, extension on or off; with no extension reach the effective close is one millisecond after the scheduled close (decision Q34).
- Between the effective close and the recorded close, a public read and a live update give the minimum next bid the lot had before its close: the opening price on a lot with no bid, else the current bid plus its tier increment. No bid at it counts, and no page offers it (decision Q3, `grade10-site/auction/bid-increments`).
- Progress advances by the progress control; on a small viewport stage previous/next and horizontal swipe also advance. CarouselProgress auto-play is allowed presentation, not a separate product rule for this change
- One Featured slide need not offer multi-dot advance or stage previous/next; progress may be absent or a single item
- A Featured lot that is no longer Active or Upcoming leaves the public Featured band at read time; the admin slot remains until cleared or replaced
- One lot may not occupy two Featured slots
- Signed-out watch on catalogue cards is owned by `grade10-site/auction/watchlist` (offer sign-in)
- An operator may replace a filled slot in place; clearing first is not required
- A slot missing lot or front page image is incomplete, may be saved in admin, and is not shown on `/auction`
- Nothing is held or charged on a card when a collector bids; no case reads a card authorization, a payment confirmation, an Authorizing state or a bid-time hold switch, and every case that did is deprecated or rewritten here (decisions Q1, Q3, Q5).
- A refused high-value bid creates no auction bid, no My Auctions row and no Bidding History entry.
- A refused attempt writes nothing the bidder reads beyond the bid form; its operational log is the operators' record, has no customer surface, and takes no case in this suite (decisions Q6, Q7).
- The refusal words for no linked card and for another card after the first accepted bid are `grade10-site/auction/bid-payment-method`'s cases; the bar's refusal is US4's; a maximum not above the bidder's own is the domain suite's `grade10-site-auction-e2e-US04-TC03-2`.
- An erasure is run by the account-erasure procedure, which has no console surface, so the erased-leader cases run at the API layer.
- Concurrent bids keep their case under US2, now that US3 is retired: the lot's lock judges each bid against what the one before it committed.
- A first bid whose answer is lost still bookmarks the lot and shows no alerts toast; the retry follow-on change brings the toast back (decisions Q15).
- Re-standing a lot after an erasure writes no letter to its new leader (decisions Q16).

## Reconciliation

**Run:** QA1 read only `/private/tmp/issue-1008-01a11f70-1791528937777/qa1-input`: frozen outline and journey, proposal, decisions, UI states, linked PRDs, configuration, continuity cases and the auction domain suite. Requirements, scenario markers and coverage, technical design, tasks, reconciliation and archives were excluded. QA2 reconciled that blind output with independent Dev output and durable continuity markers at checkpoint `7e827ba031b8083adb5d16105a7bae40e689d3e2`, against fetched main `68548f870`.

| Case or scenario | Disposition |
| --- | --- |
| US14-TC1-2 | **Folded in** - removes the impossible oversized UI row; retains below-minimum, suspended, banned and closed-listing messages and no-record checks. SC-89 and ordinary SC-91 refusal branches remain covered |
| US14-TC4-1 | **Folded in** - SC-103 and the silent SC-91 branch. Tests with/without ceiling and server-message fields, no generic copy or toast, unchanged draft and exactly one request |
| SC-90 | **Out of suite** - unchanged Outbid-row refusal is walked by `grade10-site-auction-account-record-US2-TC6-1` and `grade10-site-auction-bidding-history-US1-TC7-1` |
| SC-91, remaining refusal rows | **Out of suite** - existing card-refusal cases `grade10-site-auction-bid-payment-method-US1-TC8-1` and `grade10-site-auction-bid-payment-method-US1-TC9-1`; identity refusal `grade10-site-auction-auction-US4-TC2-2`; lowering refusal `grade10-site-auction-e2e-US04-TC03-2`. Invalid local input and refusal ordering remain mapper/usePlaceBid tests |
| SC-92 | **Out of suite** - grade10's `bidRefusalCopy.test.ts` and ListingView regressions in tasks 2.1 and 2.3 retain generic ordinary unknown-code handling and prevent rendering server words. Revision 2 excludes AMOUNT_TOO_HIGH, including a response with a server message, as Q3 settles. TC4 fully asserts that silent exception through SC-103. This clarification changes no frozen anchor or ordinary refusal outcome |
| SC-93 | **Out of suite** - unchanged backend refusal-log tests verify the operator-only entry; no customer surface exposes it |
| US14-TC2-1 and US14-TC3-1 | **Retained** - rival refusal and lost-answer behavior are unchanged; they remain durable and are retained by the fold without copying them into the active suite |

- **Settled presentation** - Q3 rejects a response-driven reset or retry. Field correction is separate; the defensive answer ends pending status silently and leaves the reviewed draft unchanged. It neither accepts a bid nor alters backend validation or logs.
- **Continuity** - Unchanged cases remain in the durable suite with their issued IDs, revisions, covers, classifications and behavior; the acceptance fold retains them without copying them into this narrow active suite. TC1 is draft at revision 2; new TC4 is draft at revision 1. No broader case is dropped or reclassified.
- **Domain** - `grade10-site-auction-e2e-US03-TC02-2` keeps its below-minimum message and no-record assertions. No domain suite changes are needed.
- **Tasks** - Tasks 2.1 to 2.3 verify adapter, mapper and view behavior; task 4.2 walks defensive and ordinary refusals. Tasks 4.3 and 4.4 record execution evidence after implementation. Planning does not classify draft cases as automated or passed.
- **Questions** - None. Frozen Q3/Q4 settle the defensive exception and preserve other refusal mappings.
