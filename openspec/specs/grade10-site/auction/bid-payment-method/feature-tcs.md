# grade10-site/auction/bid-payment-method Test Cases

**Status:** approved
**Reviewed:** 2026-10-05, tcs-rules r4

## grade10-site-auction-bid-payment-method-US1: Collector bids on the card already linked

**As a** signed-in collector with a linked card,
**I want** my maximum to stand the moment I commit it, with nothing taken from my card,
**so that** I bid in one step and pay only if I win.

<!-- trace:case id=g10.auction-bid-payment-method.TC-x2e rev=2 covers=g10.auction-bid-payment-method.SC-s1o,g10.auction-bid-payment-method.SC-c3a -->
### grade10-site-auction-bid-payment-method-US1-TC1-2: No linked card means no bid, setup opens, and no bid is recorded

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
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
5. Navigate to <my auctions url> and look for <listing_1>.

**Expected Results:**

* Step 1: the quick bids and the custom maximum show, disabled.
* Step 2 opens card-link setup, the bid form asks for a card, and no bid is placed.
* Step 4: Highest bid and the bid count are unchanged, and no bid of this collector's is on <listing_1>.
* Step 5 shows no row for <listing_1>.

<!-- trace:case id=g10.auction-bid-payment-method.TC-tm1 rev=2 covers=g10.auction-bid-payment-method.SC-s1o,g10.auction-bid-payment-method.SC-c3a -->
### grade10-site-auction-bid-payment-method-US1-TC2-2: Committing a maximum stands at once, with nothing taken from the card

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Pre-conditions:**

* customer(signed in, <the successful Visa> on file, no bid on <listing_6>) is on <listing_6 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_6> | An open listing taking bids, with no bid from this collector and no other bidder |
| <the successful Visa> | 4242 4242 4242 4242. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |
| <maximum> | A maximum above the next valid bid, within the collector's bidding limits |

**Steps:**

1. Enter <maximum> in the custom maximum on the bid panel.
2. Click the bid action.
3. Read the bid panel.
4. Read the linked card's activity at the card provider.

**Expected Results:**

* Step 2: no confirmation or payment-method modal opens.
* Step 3: the panel shows the collector leading at <maximum>, in the one answer, with no authorizing state before it.
* Step 4: nothing is held or charged on <the successful Visa>.

<!-- trace:case id=g10.auction-bid-payment-method.TC-heq rev=1 covers=g10.auction-bid-payment-method.SC-s1o,g10.auction-bid-payment-method.SC-c3a -->
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

<!-- trace:case id=g10.auction-bid-payment-method.TC-h30 rev=1 covers=g10.auction-bid-payment-method.SC-s1o,g10.auction-bid-payment-method.SC-c3a -->
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

<!-- trace:case id=g10.auction-bid-payment-method.TC-b9p rev=1 covers=g10.auction-bid-payment-method.SC-s1o,g10.auction-bid-payment-method.SC-c3a -->
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
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Pre-conditions:**

* customer(signed in, <the successful Visa> linked on an earlier listing, no bid on <listing_2>) is on <listing_2 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_2> | An open listing taking bids, not bid on by this collector |
| <the successful Visa> | 4242 4242 4242 4242. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |
| <next bid> | The next valid bid shown on the bid panel |

**Steps:**

1. Enter <next bid> in the bid panel.
2. Click the bid action.
3. Read the bid panel's linked card.
4. Read the linked card's activity at the card provider.

**Expected Results:**

* No card choice is asked for, and the bid is accepted.
* Step 3 shows <the successful Visa>, with Change no longer offered.
* Step 4: nothing is held or charged on <the successful Visa> for <listing_2>.

### grade10-site-auction-bid-payment-method-US1-TC7-1: Only the winner pays, through Checkout on the winner order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
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
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Pre-conditions:**

* customer(signed in) is on <listing_1 url>, with the bid panel enabled.
* The account holds no linked card when the bid is placed.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_1> | An open listing taking bids, with no bid from this collector |
| <next bid> | The next valid bid shown on the bid panel |

**Steps:**

1. Enter <next bid> in the custom maximum on the bid panel.
2. Click the bid action.
3. Read the bid form.
4. Reload <listing_1 url> and read Highest bid and the bid count.
5. Navigate to <my auctions url> and look for <listing_1>.

**Expected Results:**

* Step 3: the bid form asks for a card.
* Step 4: Highest bid and the bid count are unchanged.
* Step 5 shows no row for <listing_1>.

### grade10-site-auction-bid-payment-method-US1-TC9-1: A bid on another card after the first accepted bid is refused as locked

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Pre-conditions:**

* customer(signed in) placed the first accepted bid on <listing_10> with <the successful Visa>, and leads it at <locked maximum>.
* customer has also linked <the other card>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_10> | An open listing taking bids, led by this collector |
| <the successful Visa> | 4242 4242 4242 4242, the card <listing_10> is locked to. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |
| <the other card> | 5555 5555 5555 4444. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |
| <locked maximum> | The collector's maximum on <listing_10> |
| <other-card maximum> | A maximum above <locked maximum> |

**Steps:**

1. Submit <other-card maximum> on <listing_10> with <the other card>.
2. Read the API response.
3. Read <listing_10>'s current bid, the leader and the collector's maximum.

**Expected Results:**

* Step 2 refuses the bid because the listing's card is locked.
* Step 3: the current bid and leader are unchanged, and the collector's maximum stays <locked maximum> on <the successful Visa>.

### grade10-site-auction-bid-payment-method-US1-TC10-1: A refused first bid leaves the card changeable

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
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
| <listing_11> | An open HKD listing, current bid 20000 minor units (HKD 200.00), minimum next bid 21000 minor units (HKD 210.00) |
| <low maximum> | 20500 minor units (HKD 205.00), below the minimum next bid |

**Steps:**

1. Enter <low maximum> in the custom maximum on the bid panel.
2. Click the bid action.
3. Read the bid form and the linked card on the bid panel.
4. Click Change on the linked card.

**Expected Results:**

* Step 3: the bid form names the minimum next bid, 21000 minor units (HKD 210.00), and Change is still offered on the linked card.
* Step 4 opens card-link setup.

---

## grade10-site-auction-bid-payment-method-US2: Collector raises a bid on the same card

**As a** collector who already bid on a listing,
**I want** a higher bid to use the card I already committed to that listing,
**so that** I can raise my maximum without selecting a card again.

<!-- trace:case id=g10.auction-bid-payment-method.TC-x5g rev=2 covers=g10.auction-bid-payment-method.SC-7z5 -->
### grade10-site-auction-bid-payment-method-US2-TC1-2: A higher maximum is accepted on the same card, with nothing taken from it

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-02

**Pre-conditions:**

* customer(signed in, leads <listing_12> at <held maximum> on <the successful Visa>) is on <listing_12 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_12> | An open listing taking bids, led by this collector on <the successful Visa> |
| <the successful Visa> | 4242 4242 4242 4242. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |
| <held maximum> | The collector's current maximum on <listing_12> |
| <raised maximum> | A maximum above <held maximum> |

**Steps:**

1. Enter <raised maximum> in the bid panel.
2. Click the bid action.
3. Read the bid panel.
4. Read the collector's card activity at the card provider.

**Expected Results:**

* Step 2: no card choice is asked for.
* Step 3: the panel shows <raised maximum> at once, with no authorizing state before it.
* Step 4: nothing is held or charged on <the successful Visa> for <listing_12>.

<!-- trace:case id=g10.auction-bid-payment-method.TC-hk4 rev=1 covers=g10.auction-bid-payment-method.SC-7z5 -->
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

## grade10-site-auction-bid-payment-method-US4: Collector understands the buyer-premium rate before bidding

**As a** collector considering a live lot,
**I want** to know the buyer's premium rate before I bid,
**so that** I understand the policy without being shown an invoice amount that
does not exist yet.

<!-- trace:case id=g10.auction-bid-payment-method.TC-lbz rev=1 covers=g10.auction-bid-payment-method.SC-x21,g10.auction-bid-payment-method.SC-oeb -->
### grade10-site-auction-bid-payment-method-US4-TC1-1: The bid panel shows the 20% rate and no premium amount

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-04

**Pre-conditions:**

* customer(signed in, no bid on <listing_5>) is on <listing_5 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_5> | An open HKD listing taking bids |
| <next bid> | The next valid bid shown on the bid panel |

**Steps:**

1. Read the bid panel, under the bid action.
2. Enter <next bid> in the bid panel without placing it.

**Expected Results:**

* Step 1: the buyer's premium reads 20% of the winning bid, not behind a tooltip.
* Step 2: no premium amount and no invoice total show.

<!-- trace:case id=g10.auction-bid-payment-method.TC-nvs rev=1 covers=g10.auction-bid-payment-method.SC-x21,g10.auction-bid-payment-method.SC-oeb -->
### grade10-site-auction-bid-payment-method-US4-TC2-1: The rate reads 20% in every supported currency

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-payment-method-US-04

**Pre-conditions:**

* The bid panel's premium disclosure is rendered for an open listing in <currency>.

**Test data:**

| Currency | Disclosure |
| --- | --- |
| HKD | 20% of the winning bid |
| USD | 20% of the winning bid |
| JPY | 20% of the winning bid |

**Steps:**

1. Render the premium disclosure for <currency>.

**Expected Results:**

* It reads the row's disclosure.
* No currency amount appears in it.

## Settled

- The bid panel shows the fixed 20% rate only; the calculated premium amount is invoice-only.
- `grade10-site-auction-bid-payment-method-US-04-TC1` is `grade10-site-auction-bid-payment-method-US4-TC1`: renamed to the compact id form while still draft.
- `grade10-site-auction-bid-payment-method-US-04-TC2` is `grade10-site-auction-bid-payment-method-US4-TC2`: renamed to the compact id form while still draft.
- Committing or raising a maximum takes nothing from the card and waits on no payment provider, so no case reads an authorization, a provider challenge, a pending state, a declined card at bid time or a provider failure; those cases are deprecated (decisions Q1, Q5).
- Being outbid has nothing to release; US3 is retired with its case (decisions Q13).
- Only the winner pays, by the invoice on their winner order; what the winner order shows after payment is `grade10-site/auction/winner-order`'s.
- `grade10-site-auction-bid-payment-method-US1-TC8-1` joins `grade10-site-auction-bid-payment-method-US1-TC1-2`: one walk with no card, setup still available, and no bid recorded. `US1-TC8-1` is deprecated.

## Reconciliation

**Run:** 2026-09-24; scenario and suite readings were reconciled by the author.

- **Uncovered anchors:** none. Provider option flags and the returned authorization deadline are covered by the Stripe adapter and backend verification lanes, not by a customer walk.

**Run:** QA2, 2026-10-03. QA1's blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md`, the linked pages under `docs/prds/`, and the durable suite and the change's domain draft with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read QA1's suites, the delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites on main after `my-auctions-without-bid-holds` was accepted, and grade10 main's bidding, history, erasure and refusal-copy code and tests. It is a statement, not proof.

- **Folded in** - a commit with no linked card by `grade10-site-auction-bid-payment-method-US1-TC1-2`; a later bid on the same card by `grade10-site-auction-bid-payment-method-US2-TC1-2`; a linked card on a new listing by `grade10-site-auction-bid-payment-method-US1-TC6-2`; bidding takes nothing from the card by `grade10-site-auction-bid-payment-method-US1-TC2-2` and `grade10-site-auction-bid-payment-method-US2-TC1-2`; a bidder who does not win is never charged by `grade10-site-auction-bid-payment-method-US1-TC7-1`; another card after the first accepted bid by `grade10-site-auction-bid-payment-method-US1-TC9-1`
- **Added by QA2** - `grade10-site-auction-bid-payment-method-US1-TC10-1`: a refused first bid locks no card and Change stays offered. No blind case refused a first bid on a linked card
- **Corrected** - `grade10-site-auction-bid-payment-method-US1-TC8-1` and `grade10-site-auction-bid-payment-method-US1-TC9-1` traced the Feature set group Card refusals; they trace their section's journey, `grade10-site-auction-bid-payment-method-US-01`. The markers of the revised cases drop the retired authorization scenarios, and those reading nothing taken from the card cover bidding taking nothing from the card
- **Deprecated** - `grade10-site-auction-bid-payment-method-US1-TC3-1`, `grade10-site-auction-bid-payment-method-US1-TC4-1`, `grade10-site-auction-bid-payment-method-US1-TC5-1`, `grade10-site-auction-bid-payment-method-US2-TC2-1` and `grade10-site-auction-bid-payment-method-US3-TC1-1`, with the authorization requirements and `grade10-site-auction-bid-payment-method-US-03`
- **Settled by the artifacts** - a raise from a stale page that still names the locked card is accepted; only a bid naming another card is refused as locked (the requirement)
- **Raised** - none
- **Retired** - the card authorization on commit leaves the renamed requirement on the linked card; the scenarios of the removed requirements retire as their migrations name. No retired id is reissued
- **Contradicted** - none
- **Uncovered anchors** - none
