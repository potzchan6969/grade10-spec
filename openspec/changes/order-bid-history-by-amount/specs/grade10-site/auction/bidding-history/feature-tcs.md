# grade10-site/auction/bidding-history Test Cases

**Status:** pending-review · 0/3
**Drafts styled:** 2026-10-24, tcs-rules r7

## Background

* `<bids url>` is `<g10url>/bids`, the signed-in account's Bids page, where a listing's summary expands into its history.
* Bids and maximums are whole units. The step is chosen by the amount being beaten: 1 from 0, 2 from 10, 25 from 200, 100 from 1,000, 500 from 5,000.
* Collectors are signed in with a card linked, on separate sessions.

## g10.auction-bidding-history.US3: Collector reads one listing's combined history

**As a** collector,
**I want** one history of public price movement and my private standing,
**so that** I can see how I was outbid without seeing anyone's hidden maximum.

<!-- trace:case id=g10.auction-bidding-history.TC-sow rev=2 covers=g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4,g10.auction-bidding-history.SC-m9q -->
### g10.auction-bidding-history.US3-TC1: History interleaves public movement with the collector's own, highest amount on top

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
* **Trace:** grade10-site-auction-bidding-history-US-03

**Pre-conditions:**

* `<listing>` opens at 300 with no bid; customer A set a maximum of `<A maximum>` on it, so leads at 300; customer B is on its page.

**Test data:**

| `<A maximum>` | `<B maximum>` | `<history after>` |
| --- | --- | --- |
| 300 (fixed: equal to the price) | 520 | customer B's bid at 325 marking You were outbid, as one step; then your bid at 300; then your maximum set at 300; never 520 |
| 650 (above the price) | 410 | your automatic bid at 435, as one step; then customer B's bid at 410; then your bid at 300; then your maximum set at 650, last though the higher amount |

**Steps:**

1. As customer B, place `<B maximum>`.
2. As customer A, expand `<listing>` on `<bids url>`.

**Expected Results:**

* Read from the top, the history reads `<history after>`, in the public price, never a rival's maximum.

<!-- trace:case id=g10.auction-bidding-history.TC-mq5 rev=2 covers=g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4,g10.auction-bidding-history.SC-1rj,g10.auction-bidding-history.SC-m9q,g10.auction-bidding-history.SC-d6n -->
### g10.auction-bidding-history.US3-TC6: A rival maximum against a leader's writes the stated public history

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
* **Trace:** grade10-site-auction-bidding-history-US-03

**Pre-conditions:**

* `<listing>` opens at 4 with no bid; customer A set a maximum of 10 on it, so leads at 4; customer B has not bid on it.

**Test data:**

| `<B maximum>` | `<recent bids>` | `<B history>` |
| --- | --- | --- |
| 5 | customer B at 5, then customer A's automatic 6 | customer A's automatic 6; then You at 5; then your maximum set at `<B maximum>`; then customer A's bid at 4 |
| 9 | customer B at 9, then customer A's automatic 10 | customer A's automatic 10; then You at 9; then your maximum set at `<B maximum>`; then customer A's bid at 4 |
| 10 (fixed: tie) | customer B at 10, then customer A's automatic 10, customer A leading as the earlier maximum | customer A's automatic 10, above You at 10, the same amount; then your maximum set at `<B maximum>`; then customer A's bid at 4 |
| 11 | customer B at 11 once (10 plus the 2 step, capped), no new row for customer A | You at 11; then your maximum set at `<B maximum>`; then customer A's bid at 4 |
| 13 | customer B at 12 once (10 plus the 2 step), no new row for customer A | You at 12; then your maximum set at `<B maximum>`, below the bid though the higher amount; then customer A's bid at 4 |

**Steps:**

1. As customer B, place `<B maximum>`.
2. Read Recent bids.
3. Open `<bids url>` and expand `<listing>`.

**Expected Results:**

* Step 2: Recent bids reads `<recent bids>` under listing pseudonyms.
* Step 3: read from the top, customer B's history reads `<B history>`, with a maximum set at `<B maximum>`, and customer A only under the listing pseudonym.

<!-- trace:case id=g10.auction-bidding-history.TC-c8f rev=1 covers=g10.auction-bidding-history.SC-y3v -->
### g10.auction-bidding-history.US3-TC7: A maximum raise that causes no bid reads by its time, newer above older

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
* **Trace:** grade10-site-auction-bidding-history-US-03

**Pre-conditions:**

* `<listing>` opens at 280 with no bid; customer A has not bid on it; customer B can open its page.

**Test data:**

| `<then B places>` | `<A history>` |
| --- | --- |
| nothing | your maximum raised to 560, caused no bid; then your bid at 280; then your maximum set at 420, below the bid though the higher amount |
| a maximum of 700 | customer B's bid at 585 marking You were outbid, as one step; then your maximum raised to 560; then your bid at 280; then your maximum set at 420 |
| a maximum of 500 | your automatic response at 525 and customer B's bid at 500, as one step, both newer than the raise and so above it though lower; then your maximum raised to 560; then your bid at 280; then your maximum set at 420 |

**Steps:**

1. As customer A, place a maximum of 420, then raise it to 560.
2. As customer B, place `<then B places>`, unless it says nothing.
3. As customer A, open `<bids url>` and expand `<listing>`.

**Expected Results:**

* Read from the top, the history reads `<A history>`, in the public price, never customer B's maximum.

---

## Settled

- Public recent bids keep their order; only the account's combined history on My bids changes.
- The admin Bids tab keeps its own order.
- A maximum set sorts with the bid it causes, so it reads below that bid even where its amount is higher.
- A maximum raise that causes no bid has none to follow: it reads by its own time among the other records, newer above older.
- An automatic response reads above the bid that caused it, equal maximums included, whoever reads: the earlier leader keeps the lead and both records show the same amount.

## Reconciliation

**Run:** QA1 blind rerun, 2026-10-24. Read: the change's proposal, decisions and journeys, the Feature set, the Bidding History PRD section, the durable suite and the auction domain suite, and the bid-increment tiers for fixtures. QA1's extract of the spec ran wider than the Feature set and also showed its requirement and scenario text; QA1 states no case was shaped from it, and nothing verifies that. QA2 joined the readings on 2026-10-24 with the scenarios and the requirement in hand.

**Case dispositions**

- **US3-TC1** (`rev` 2) - kept, revised from the durable case, `draft` and `manual` (the durable case was `actual` and `automated`; what it verifies changed). It asserts the new order in both rows. Row 2 reads the collector's own automatic bid at its resolved amount above the rival's, attributed to You, marked automatic and as one step: that is the response-above-the-rival outcome and its attribution. Its two rows also read a maximum set below its bid even where the maximum is higher, and a higher amount above a lower across timestamps. Links: the durable links kept, plus `SC-m9q`.
- **US3-TC6** (`rev` 1 to 2, bumped by QA2: QA1 changed what the case verifies and left the `rev`) - kept, `draft` and `manual`. Its `Expected Results` now read the challenger's own history: a rival's automatic response above You in the three response rows including the equal-maximum tie, and the maximum set below the bid in the rows for 11 and 13, the last with the higher amount. Links: the durable links kept, plus `SC-m9q` (the 13 row) and `SC-55` (the rows for 5, 9 and 10, the tie among them).
- **US3-TC7** (new, `rev` 1) - added by QA2 for the raise that causes no bid, which no blind case reached: A sets then raises a maximum; the raise reads on top (newer, no bid), and in the second row below a rival's newer bid. `draft` and `manual`. It is a new case on a journey whose durable suite has live cases, and it is not an extension: no live case asserts the order of a raise against its own set. Links: `SC-56`.
- **US2-TC4** - not changed here, and flagged. Its "records one maximum set at 420, then one raised to 560" now has one defensible top-down reading wrong: the raise, being newer and causing no bid, reads first. Revising it needs the US-02 journey in this delta, which is the product manager's file and which this change does not otherwise touch, so QA2 did not. It is `actual` and decided by the end-to-end test, which may assert the old order: task 2.1 must check it, and `/tcs-review` restates the wording after deployment.
- **US3-TC4** - not a delta. Its expectation is "every entry shows once, in order" and that the bid, the response and the outbid standing show together; it asserts no direction, so the new order leaves it true. There is no US3-TC5 in the durable suite; the whole-decision outcome is walked by TC4 and TC6.
- **Walk 1, step 2** - not a delta. "A maximum set, then a maximum raised" narrates the order the owner acted in, and the case it points at asserts only that both appear with no refusal; it asserts no top-down order. A tester who reads it top-down finds the raise first; the next regeneration of the walk should say "a maximum set and a maximum raised" so it cannot be read both ways.
- **US8-TC1** - not a delta, order-neutral for the same reason.
- **US3-TC4 pre-condition** - pre-existing, not this change's: customer A "raised to 320" and customer B "answered at 330" do not follow the tier step (25 from 200). It belongs to a later regeneration of the durable case and is not repaired here.

- **New, not an extension** - g10.auction-bidding-history.US3-TC7 - no live case asserts where a raise that causes no bid reads against its own set and bid or against a rival's newer bid, so no row or revision of a live case can carry it without mixing purposes.

**Scenarios**

- `SC-pbt` - TC1 row 1 and the durable links.
- `SC-9ii` - TC1 row 2, fully: the collector's automatic movement above the rival's accepted action, attributed to You, marked automatic, one step.
- `SC-m9q` - TC1 row 2 and the TC6 row for 13, fully: the bid above the maximum set though the maximum is higher, and a higher amount above a lower across timestamps.
- `SC-55` - TC6, fully; **new, folded by QA2**: the history order of an equal maximum and the response above the challenger as the challenger reads it were behaviour the cases carried and no scenario stated, and the requirement and the Feature set name both.
- `SC-56` - US3-TC7, fully; **new, folded by QA2** from the raised question below.
- `SC-k4s` and `SC-1rj` - restated unchanged inside the modified requirement and not changed by this change. The durable links stay on TC1 and TC6; the paging walk itself is US3-TC4, and TC6 does not page, so its `SC-1rj` link is carried from the durable suite and is not widened here.
- Out of suite: none. Every Feature set leaf this change touches - History order, Tie outcome, Automatic response, Whole decisions per page - has a case above.

**Raised, answered** - one row, in `decisions.md` `## Raised` and as Q8: where a maximum raise that causes no bid sorts. It changes what an owner reads (the raise against its own set and bid), so the rule is in the requirement and in `## Settled`, not left to the implementation. Recommended option taken: its own time, newer above older. The held test does not hold it: it follows Q3, no product choice is irreversible, and the PRD line says nothing against it.

**Contradictions between the readings** - none.

**Product page** - `docs/prds/products/grade10-site/auction/bidding.md`, the Bidding History line, carries the raise clause: a raise that causes no bid reads by its time, newer above older.
