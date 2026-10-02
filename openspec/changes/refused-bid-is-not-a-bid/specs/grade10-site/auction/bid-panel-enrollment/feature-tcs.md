# grade10-site/auction/bid-panel-enrollment Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-auction-bid-panel-enrollment-US2: Collector links a card when none is on file

**As a** signed-in collector with no linked card,
**I want** setup to leave me ready to bid immediately and to move me to
enrolled after my first accepted bid,
**so that** I can bid the moment the card is linked.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-e02 rev=3 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### grade10-site-auction-bid-panel-enrollment-US2-TC5-3: Completing setup unlocks amount controls

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, no linked card) is on <listing_2 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_2> | An open listing taking bids; this collector has no linked card |
| <the successful Visa> | 4242 4242 4242 4242. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |

**Steps:**

1. Click the primary bid action.
2. Enter <the successful Visa> in the provider-hosted field.
3. Check age attestation.
4. Click Link Card.
5. Read the linked-card slot.
6. Read the quick-bid presets and the custom maximum.
7. Read the primary bid action.
8. Read the linked card's activity at the card provider.

**Expected Results:**

* The setup modal closes.
* The linked card is shown, with Change available.
* Quick-bid presets and the custom maximum are enabled at once.
* The primary bid action offers set or raise maximum.
* Step 8: nothing is held or charged on the card by setup.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-av0 rev=2 covers=g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### grade10-site-auction-bid-panel-enrollment-US2-TC8-2: An accepted bid moves directly to enrolled

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, card linked, no bid on <listing_3>) is on <listing_3 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_3> | An open listing taking bids; this collector has a linked card and has not bid on it |
| <maximum> | The next valid bid shown on the bid panel |

**Steps:**

1. Enter <maximum> in the custom maximum.
2. Click the bid action.
3. Read the bid panel after the bid is accepted.

**Expected Results:**

* The panel moves straight to enrolled, with no Authorizing state between the bid and its standing.
* Change is not offered for this listing.

### grade10-site-auction-bid-panel-enrollment-US2-TC15-1: Setup says the card is charged only on a win

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, no linked card) is on <listing_2 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_2> | An open listing taking bids; this collector has no linked card |

**Steps:**

1. Click the primary bid action.
2. Read the setup title.
3. Read the setup description.
4. Read the continue control.

**Expected Results:**

* Step 2 reads "Link a card to bid".
* Step 3 reads "Link a card for bidding. You’re only charged if you win."
* Step 3 names no hold and no authorization.
* Step 4 reads "Link Card".

### grade10-site-auction-bid-panel-enrollment-US2-TC16-1: Committing a maximum answers Leading or Outbid at once

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
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer(signed in, card linked, no bid on <listing_11>) is on <listing_11 url>.
* <listing_11> is in the row's state.

**Test data:**

| <listing_11> state | <maximum> | Standing shown |
| --- | --- | --- |
| Open, no bid, starting price 20000 minor units (HKD 200.00) | 50000 minor units (HKD 500.00) | Leading |
| Open, led by customer B with maximum 80000 minor units (HKD 800.00), current bid 20000 minor units (HKD 200.00) | 50000 minor units (HKD 500.00), below customer B's maximum | Outbid, with the next valid bid |

**Steps:**

1. Enter <maximum> in the custom maximum.
2. Click the bid action.
3. Watch the bid panel until it settles.

**Expected Results:**

* The bid panel shows the row's standing in the one answer.
* No Authorizing or other in-between state shows between the click and the standing.

---

## grade10-site-auction-bid-panel-enrollment-US3: Collector changes the linked card before their first bid

**As a** collector with a linked card on a lot who has not yet bid on it,
**I want** to change or link another card from the panel,
**so that** I can update payment before my first bid without a separate flow.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-iih rev=2 covers=g10.auction-bid-panel-enrollment.SC-beq,g10.auction-bid-panel-enrollment.SC-ofn,g10.auction-bid-panel-enrollment.SC-1sa -->
### grade10-site-auction-bid-panel-enrollment-US3-TC2-2: Change reuses setup copy with prior card shown

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
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-03

**Pre-conditions:**

* customer(signed in, card linked, no bid on <listing_3>) is on <listing_3 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_3> | An open listing taking bids; this collector has a linked card and has not bid on it |

**Steps:**

1. Click Change on the linked card.
2. Read the modal title.
3. Read the modal description.
4. Read the provider field.

**Expected Results:**

* The title reads "Link a card to bid".
* The description says the card is charged only on a win, and names no hold.
* The provider field shows the card already on file.

---

## grade10-site-auction-bid-panel-enrollment-US4: Collector bids after linking a card

**As a** collector who has a linked card on a lot,
**I want** the linked card to lock after my first bid on that lot,
**so that** my committed payment method stays stable while I raise bids.

<!-- trace:case id=g10.auction-bid-panel-enrollment.TC-5vi rev=2 covers=g10.auction-bid-panel-enrollment.SC-ndg,g10.auction-bid-panel-enrollment.SC-y5h -->
### grade10-site-auction-bid-panel-enrollment-US4-TC2-2: First maximum does not reopen setup

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
* **Trace:** grade10-site-auction-bid-panel-enrollment-US-04

**Pre-conditions:**

* customer(signed in, card linked, no bid on <listing_7>) is on <listing_7 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_7> | An open listing taking bids with no other bidder; this collector has a linked card and has not bid on it |
| <maximum> | The next valid bid shown on the bid panel |

**Steps:**

1. Enter <maximum> in the custom maximum.
2. Click the bid action.
3. Check whether the setup modal is open.
4. Read the bid panel.

**Expected Results:**

* Step 3: the setup modal does not open.
* Step 4: the panel shows Leading, with their maximum and the current bid.

---

## Settled

- Setup links a card and takes nothing from it, and a committed maximum answers Leading, Outbid or the refusal with no authorization state between; the cases that read a hold switch, a hold state or hold copy are rewritten or were already deprecated (decisions Q1, Q5).
- The setup description and the Change modal say the card is charged only on a win, in the words the Bidding page decides.
- What the bid form says for a refused bid is `grade10-site/auction/auction`'s US14 and `grade10-site/auction/bid-payment-method`'s card refusals, not this suite's.
- The panel after card linking is `linked-editable`, and the linked-card tooltip scenario keeps its title (decisions Q18).

## Reconciliation

**Run:** QA2, 2026-10-03. QA1's blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md`, the linked pages under `docs/prds/`, and the durable suite and the change's domain draft with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read QA1's suites, the delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites on main after `my-auctions-without-bid-holds` was accepted, and grade10 main's bidding, history, erasure and refusal-copy code and tests. It is a statement, not proof.

- **Folded in** - `grade10-site-auction-bid-panel-enrollment-SC-15` by `grade10-site-auction-bid-panel-enrollment-US2-TC5-3`; `grade10-site-auction-bid-panel-enrollment-SC-16` by `grade10-site-auction-bid-panel-enrollment-US2-TC8-2`; `grade10-site-auction-bid-panel-enrollment-SC-20`'s Leading and Outbid by `grade10-site-auction-bid-panel-enrollment-US2-TC16-1`, and its refusal under the bid action by `grade10-site-auction-auction-US14-TC1-1`; the Setup modal leaf by `grade10-site-auction-bid-panel-enrollment-US2-TC15-1` and `grade10-site-auction-bid-panel-enrollment-US3-TC2-2`
- **Corrected** - `grade10-site-auction-bid-panel-enrollment-US2-TC16-1` traced the Feature set group Bid commit; it traces its section's journey, `grade10-site-auction-bid-panel-enrollment-US-02`
- **Raised, answered** - Q18: the panel state `linked-editable` replaces `authorization-editable`, and `shared-ui-auction-listing-SC-30` keeps its title, recommended; answer in `## Settled`
- **Contradicted** - none
- **Uncovered anchors** - none
