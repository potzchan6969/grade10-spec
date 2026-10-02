# grade10-site/auction/bid-payment-method Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-auction-bid-payment-method-US1: Collector bids on the card already linked

**As a** signed-in collector with a linked card,
**I want** my maximum to stand the moment I commit it, with nothing taken from my card,
**so that** I bid in one step and pay only if I win.

<!-- trace:case id=g10.auction-bid-payment-method.TC-x2e rev=2 covers=g10.auction-bid-payment-method.SC-s1o,g10.auction-bid-payment-method.SC-c3a -->
### grade10-site-auction-bid-payment-method-US1-TC1-2: No linked card means no bid, and the bid action opens setup

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
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Pre-conditions:**

* customer(signed in, no linked card) is on <listing_1 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_1> | An open listing taking bids, with no bid from this collector |

**Steps:**

1. Read the amount controls on the bid panel.
2. Click the bid action.
3. Close the setup modal without linking a card.
4. Reload <listing_1 url> and read Highest bid and the bid count.

**Expected Results:**

* Step 1: the quick bids and the custom maximum show, disabled.
* Step 2 opens card-link setup, not a bid.
* Step 4: Highest bid and the bid count are unchanged, and no bid of this collector's is on <listing_1>.

<!-- trace:case id=g10.auction-bid-payment-method.TC-tm1 rev=2 covers=g10.auction-bid-payment-method.SC-s1o,g10.auction-bid-payment-method.SC-c3a,g10.auction-bid-payment-method.SC-mlo -->
### grade10-site-auction-bid-payment-method-US1-TC2-2: Committing a maximum stands at once, with nothing taken from the card

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Pre-conditions:**

* customer(signed in, card linked, no bid on <listing_1>) is on <listing_1 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_1> | An open listing taking bids, with no bid from this collector and no other bidder |
| <maximum> | A maximum above the next valid bid, within the collector's bidding limits |

**Steps:**

1. Enter <maximum> in the custom maximum on the bid panel.
2. Click the bid action.
3. Read the bid panel.
4. Read the linked card's activity at the card provider.

**Expected Results:**

* Step 2: no confirmation or payment-method modal opens.
* Step 3: the bid panel reads Leading with Your maximum <maximum>, in the one answer, with no Authorizing state before it.
* Step 4: nothing is held or charged on the linked card.

### grade10-site-auction-bid-payment-method-US1-TC3-1: A pending or challenged authorization stays on the bid surface

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Pre-conditions:**

* customer(signed in, card linked, no bid on <listing_1>) is on <listing_1 url>.
* The card provider is mocked to answer the authorization with <provider answer>.

**Test data:**

| Provider answer | Shown on the bid surface |
| --- | --- |
| Authentication challenge (SCA) | The provider's challenge |
| Pending | A busy state on the bid action |

| Field | Value |
| --- | --- |
| <listing_1> | An open listing taking bids, with no bid from this collector |
| <maximum> | The next valid bid shown on the bid panel |

**Steps:**

1. Enter <maximum> in the bid panel.
2. Click the bid action.

**Expected Results:**

* The row's state shows on the listing's bid surface.
* The card-linking setup does not open.
* The bid does not show as accepted.

### grade10-site-auction-bid-payment-method-US1-TC4-1: A declined or unusable card is refused near the bid action

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Pre-conditions:**

* customer(signed in, card linked, no bid on <listing_1>) is on <listing_1 url>.
* The card provider is mocked to answer the authorization with <provider answer>.

**Test data:**

| Provider answer |
| --- |
| Declined |
| Payment method unusable |

| Field | Value |
| --- | --- |
| <listing_1> | An open listing taking bids, with no bid from this collector |
| <maximum> | The next valid bid shown on the bid panel |

**Steps:**

1. Enter <maximum> in the bid panel.
2. Click the bid action.
3. Change the linked card from the bid panel.

**Expected Results:**

* Step 2: refusal copy shows near the bid action.
* Step 2: no bid is accepted and no authorization stands.
* Step 3: the card can be changed, as no bid is on <listing_1> yet.

### grade10-site-auction-bid-payment-method-US1-TC5-1: A provider failure has its own copy and leaves nothing held

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Pre-conditions:**

* customer(signed in, card linked, no bid on <listing_1>) is on <listing_1 url>.
* The authorization call is mocked to <failure>.

**Test data:**

| Failure |
| --- |
| Time out |
| Fail at the provider |
| Drop the network connection |

| Field | Value |
| --- | --- |
| <listing_1> | An open listing taking bids, with no bid from this collector |
| <maximum> | The next valid bid shown on the bid panel |

**Steps:**

1. Enter <maximum> in the bid panel.
2. Click the bid action.

**Expected Results:**

* Provider-failure copy shows near the bid action, distinct from the decline copy.
* No bid is accepted and no authorization stands.

<!-- trace:case id=g10.auction-bid-payment-method.TC-d2o rev=2 covers=g10.auction-bid-payment-method.SC-s1o,g10.auction-bid-payment-method.SC-c3a -->
### grade10-site-auction-bid-payment-method-US1-TC6-2: A linked card carries over to a new listing

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
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Pre-conditions:**

* customer(signed in, card linked on an earlier listing, no bid on <listing_2>) is on <listing_2 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_2> | An open listing taking bids, not bid on by this collector |
| <maximum> | The next valid bid shown on the bid panel |

**Steps:**

1. Enter <maximum> in the bid panel.
2. Click the bid action.
3. Read the bid panel's linked card.
4. Read the linked card's activity at the card provider.

**Expected Results:**

* No card choice is asked for, and the bid is accepted.
* Step 3 shows the card linked on the earlier listing, with Change no longer offered.
* Step 4: nothing is held or charged on the card for <listing_2>.

### grade10-site-auction-bid-payment-method-US1-TC7-1: Only the winner pays, through Checkout on the winner order

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
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Pre-conditions:**

* customer A(card linked) leads <listing_8> with maximum <user A maximum>, and is signed in.
* customer B(card linked) holds a lower maximum on <listing_8>.
* <listing_8>'s close is under a minute away, and no further bid will be placed.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_8> | An open HKD listing led by customer A |
| <user A maximum> | 800000 minor units (HKD 8,000.00) |

**Steps:**

1. Wait until <listing_8> is recorded closed with customer A winning.
2. Read customer A's and customer B's card activity at the card provider.
3. As customer A, open <listing_8>'s order from View order on My Auctions.
4. Start paying the invoice by card.

**Expected Results:**

* Step 2: nothing is held or charged on either card, by the bids or by the close.
* Step 4 opens the provider's hosted Checkout for the winner order's invoice.

### grade10-site-auction-bid-payment-method-US1-TC8-1: A bid from an account with no linked card is refused, asking for a card

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
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Pre-conditions:**

* customer(signed in) is on <listing_9 url>, with the bid panel enabled.
* The account holds no linked card when the bid is placed.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_9> | An open listing taking bids, with no bid from this collector |
| <maximum> | The next valid bid shown on the bid panel |

**Steps:**

1. Enter <maximum> in the custom maximum on the bid panel.
2. Click the bid action.
3. Read the bid form.
4. Reload <listing_9 url> and read Highest bid and the bid count.
5. Navigate to <my auctions url> and look for <listing_9>.

**Expected Results:**

* Step 3: the bid form reads "Link a card to bid."
* Step 4: Highest bid and the bid count are unchanged.
* Step 5 shows no row for <listing_9>.

### grade10-site-auction-bid-payment-method-US1-TC9-1: A bid on another card after the first accepted bid is refused as locked

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Pre-conditions:**

* customer(signed in) placed the first accepted bid on <listing_10> with <card A>, and leads it at <prior maximum>.
* customer has also linked <card B>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_10> | An open listing taking bids, led by this collector |
| <card A> | Visa ending 4242, the card <listing_10> is locked to |
| <card B> | Mastercard ending 4444 |
| <prior maximum> | The collector's maximum on <listing_10> |
| <higher maximum> | A maximum above <prior maximum> |

**Steps:**

1. Submit <higher maximum> on <listing_10> with <card B>.
2. Read the API response.
3. Read <listing_10>'s current bid, the leader and the collector's maximum.

**Expected Results:**

* Step 2 refuses the bid as the listing's card being locked, the bid form's words "This listing's card is locked after the first accepted bid."
* Step 3: the current bid and leader are unchanged, and the collector's maximum stays <prior maximum> on <card A>.

### grade10-site-auction-bid-payment-method-US1-TC10-1: A refused first bid leaves the card changeable

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
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Pre-conditions:**

* customer(signed in, card linked, no bid on <listing_11>) is on <listing_11 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_11> | An open HKD listing, current bid 120000 minor units (HKD 1,200.00), minimum next bid 124000 minor units (HKD 1,240.00) |
| <low maximum> | 122000 minor units (HKD 1,220.00), below the minimum next bid |

**Steps:**

1. Enter <low maximum> in the custom maximum on the bid panel.
2. Click the bid action.
3. Read the bid form and the linked card on the bid panel.
4. Click Change on the linked card.

**Expected Results:**

* Step 3: the bid form says Minimum bid is, naming 124000 minor units (HKD 1,240.00), and Change is still offered on the linked card.
* Step 4 opens card-link setup.

---

## grade10-site-auction-bid-payment-method-US2: Collector raises a bid on the same card

**As a** collector who already bid on a listing,
**I want** a higher bid to use the card I already committed to that listing,
**so that** I can raise my maximum without selecting a card again.

<!-- trace:case id=g10.auction-bid-payment-method.TC-x5g rev=2 covers=g10.auction-bid-payment-method.SC-7z5,g10.auction-bid-payment-method.SC-mlo -->
### grade10-site-auction-bid-payment-method-US2-TC1-2: A higher maximum is accepted on the same card, with nothing taken from it

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-02

**Pre-conditions:**

* customer(signed in, leads <listing_3> at <prior maximum>) is on <listing_3 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_3> | An open listing taking bids, led by this collector |
| <prior maximum> | The collector's current maximum on <listing_3> |
| <higher maximum> | A maximum above <prior maximum> |

**Steps:**

1. Enter <higher maximum> in the bid panel.
2. Click the bid action.
3. Read the bid panel.
4. Read the collector's card activity at the card provider.

**Expected Results:**

* Step 2: no card choice is asked for.
* Step 3 reads Your maximum <higher maximum> at once, with no Authorizing state before it.
* Step 4: nothing is held or charged on the card for <listing_3>.

### grade10-site-auction-bid-payment-method-US2-TC2-1: A refused raise keeps the prior maximum and blocks nothing after

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-payment-method-US-02

**Pre-conditions:**

* customer(signed in, leads <listing_3> at <prior maximum>) is on <listing_3 url>.
* The card provider is mocked to refuse raising the existing authorization.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_3> | An open listing taking bids, led by this collector with one active authorization |
| <prior maximum> | The collector's current maximum on <listing_3> |
| <higher maximum> | A maximum above <prior maximum> |

**Steps:**

1. Enter <higher maximum> in the bid panel.
2. Click the bid action.
3. Remove the provider mock, then enter <higher maximum> again.
4. Click the bid action.

**Expected Results:**

* Step 2: the decline refusal copy shows near the bid action.
* Step 2: the maximum stays <prior maximum>; its authorization is unchanged.
* Step 4: the attempt is not blocked by a pending raise.

---

## grade10-site-auction-bid-payment-method-US3: Collector is released when outbid

**As a** collector who has been outbid,
**I want** the hold on my card cancelled,
**so that** money is not held for a listing I cannot win.

### grade10-site-auction-bid-payment-method-US3-TC1-1: Being outbid cancels the hold once, capturing nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** destructive
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-payment-method-US-03

**Pre-conditions:**

* customer A leads <listing_4> with an active authorization.
* customer B(signed in, card linked) is on <listing_4 url> in a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_4> | An open listing taking bids, led by customer A |
| <customer B maximum> | A maximum above customer A's maximum |

**Steps:**

1. As customer B, place <customer B maximum>.
2. Read customer A's authorization for <listing_4> at the card provider.
3. Deliver the same cancellation outcome from the provider again.
4. Read customer A's authorizations, bids and orders for <listing_4>.

**Expected Results:**

* Step 2: customer A's authorization is cancelled; nothing is captured.
* Step 4: one cancellation only; no second hold or accepted bid.

---

## Settled

- Committing or raising a maximum takes nothing from the card and waits on no payment provider, so no case reads an authorization, a provider challenge, a pending state, a declined card at bid time or a provider failure; those cases are deprecated (decisions Q1, Q5).
- Being outbid has nothing to release; US3 is retired with its case (decisions Q13).
- Only the winner pays, through hosted Checkout on the winner order; what the winner order shows after Checkout is `grade10-site/auction/winner-order`'s.
- The durable line on incremental and extended authorization no longer applies: no authorization is taken at bid time.

## Reconciliation

**Run:** QA2, 2026-10-03. QA1's blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md`, the linked pages under `docs/prds/`, and the durable suite and the change's domain draft with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read QA1's suites, the delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites on main after `my-auctions-without-bid-holds` was accepted, and grade10 main's bidding, history, erasure and refusal-copy code and tests. It is a statement, not proof.

- **Folded in** - `grade10-site-auction-bid-payment-method-SC-01` by `grade10-site-auction-bid-payment-method-US1-TC1-2` and `grade10-site-auction-bid-payment-method-US1-TC8-1`; `grade10-site-auction-bid-payment-method-SC-05` by `grade10-site-auction-bid-payment-method-US2-TC1-2`; `grade10-site-auction-bid-payment-method-SC-10` by `grade10-site-auction-bid-payment-method-US1-TC6-2`; `grade10-site-auction-bid-payment-method-SC-18` by `grade10-site-auction-bid-payment-method-US1-TC2-2` and `grade10-site-auction-bid-payment-method-US2-TC1-2`; `grade10-site-auction-bid-payment-method-SC-19` by `grade10-site-auction-bid-payment-method-US1-TC7-1`; `grade10-site-auction-bid-payment-method-SC-20` by `grade10-site-auction-bid-payment-method-US1-TC9-1`
- **Added by QA2** - `grade10-site-auction-bid-payment-method-US1-TC10-1` for `grade10-site-auction-bid-payment-method-SC-21`: a refused first bid locks no card and Change stays offered. No blind case refused a first bid on a linked card
- **Corrected** - `grade10-site-auction-bid-payment-method-US1-TC8-1` and `grade10-site-auction-bid-payment-method-US1-TC9-1` traced the Feature set group Card refusals; they trace their section's journey, `grade10-site-auction-bid-payment-method-US-01`. The markers of the revised cases drop the retired authorization scenarios, and those reading nothing taken from the card cover `grade10-site-auction-bid-payment-method-SC-18`
- **Deprecated** - `grade10-site-auction-bid-payment-method-US1-TC3-1`, `grade10-site-auction-bid-payment-method-US1-TC4-1`, `grade10-site-auction-bid-payment-method-US1-TC5-1`, `grade10-site-auction-bid-payment-method-US2-TC2-1` and `grade10-site-auction-bid-payment-method-US3-TC1-1`, with the authorization requirements and `grade10-site-auction-bid-payment-method-US-03`
- **Settled by the artifacts** - a raise from a stale page that still names the locked card is accepted; only a bid naming another card is refused as locked (the requirement)
- **Raised** - none
- **Contradicted** - none
- **Uncovered anchors** - none
