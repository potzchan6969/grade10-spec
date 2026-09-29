# grade10-site/auction/bid-payment-method Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-29, tcs-rules r4

## grade10-site-auction-bid-payment-method-US1: Collector authorizes a first bid on commit

**As a** signed-in collector with a linked card,
**I want** my maximum to authorize in the background when I commit,
**so that** I am not asked to confirm a hold in a separate modal.

<!-- trace:case id=g10.auction-bid-payment-method.TC-x2e rev=1 covers=g10.auction-bid-payment-method.SC-61r,g10.auction-bid-payment-method.SC-li6,g10.auction-bid-payment-method.SC-s1o,g10.auction-bid-payment-method.SC-whx,g10.auction-bid-payment-method.SC-joe,g10.auction-bid-payment-method.SC-le7,g10.auction-bid-payment-method.SC-4g4,g10.auction-bid-payment-method.SC-c3a -->
### grade10-site-auction-bid-payment-method-US1-TC1-1: No linked card means no bid and no authorization

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
| <maximum> | The next valid bid shown on the bid panel |

**Steps:**

1. Enter <maximum> in the bid panel.
2. Click the bid action.

**Expected Results:**

* No bid is accepted on <listing_1>.
* No card authorization is created.
* Card linking is offered from the bid panel.

<!-- trace:case id=g10.auction-bid-payment-method.TC-tm1 rev=1 covers=g10.auction-bid-payment-method.SC-61r,g10.auction-bid-payment-method.SC-li6,g10.auction-bid-payment-method.SC-s1o,g10.auction-bid-payment-method.SC-whx,g10.auction-bid-payment-method.SC-joe,g10.auction-bid-payment-method.SC-le7,g10.auction-bid-payment-method.SC-4g4,g10.auction-bid-payment-method.SC-c3a -->
### grade10-site-auction-bid-payment-method-US1-TC2-1: Committing a maximum authorizes it silently, then accepts the bid

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
| <listing_1> | An open listing taking bids, with no bid from this collector |
| <maximum> | A maximum above the next valid bid, within the collector's bidding limits |

**Steps:**

1. Enter <maximum> in the bid panel.
2. Click the bid action.
3. Read the linked card's authorizations at the card provider.

**Expected Results:**

* Step 2: no confirmation or payment-method modal opens.
* Step 2: the bid shows as accepted only once authorization is confirmed.
* Step 3: one authorization for <maximum> stands on the linked card.

<!-- trace:case id=g10.auction-bid-payment-method.TC-heq rev=1 covers=g10.auction-bid-payment-method.SC-61r,g10.auction-bid-payment-method.SC-li6,g10.auction-bid-payment-method.SC-s1o,g10.auction-bid-payment-method.SC-whx,g10.auction-bid-payment-method.SC-joe,g10.auction-bid-payment-method.SC-le7,g10.auction-bid-payment-method.SC-4g4,g10.auction-bid-payment-method.SC-c3a -->
### grade10-site-auction-bid-payment-method-US1-TC3-1: A pending or challenged authorization stays on the bid surface

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
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

<!-- trace:case id=g10.auction-bid-payment-method.TC-h30 rev=1 covers=g10.auction-bid-payment-method.SC-61r,g10.auction-bid-payment-method.SC-li6,g10.auction-bid-payment-method.SC-s1o,g10.auction-bid-payment-method.SC-whx,g10.auction-bid-payment-method.SC-joe,g10.auction-bid-payment-method.SC-le7,g10.auction-bid-payment-method.SC-4g4,g10.auction-bid-payment-method.SC-c3a -->
### grade10-site-auction-bid-payment-method-US1-TC4-1: A declined or unusable card is refused near the bid action

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
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

<!-- trace:case id=g10.auction-bid-payment-method.TC-b9p rev=1 covers=g10.auction-bid-payment-method.SC-61r,g10.auction-bid-payment-method.SC-li6,g10.auction-bid-payment-method.SC-s1o,g10.auction-bid-payment-method.SC-whx,g10.auction-bid-payment-method.SC-joe,g10.auction-bid-payment-method.SC-le7,g10.auction-bid-payment-method.SC-4g4,g10.auction-bid-payment-method.SC-c3a -->
### grade10-site-auction-bid-payment-method-US1-TC5-1: A provider failure has its own copy and leaves nothing held

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
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

<!-- trace:case id=g10.auction-bid-payment-method.TC-d2o rev=1 covers=g10.auction-bid-payment-method.SC-61r,g10.auction-bid-payment-method.SC-li6,g10.auction-bid-payment-method.SC-s1o,g10.auction-bid-payment-method.SC-whx,g10.auction-bid-payment-method.SC-joe,g10.auction-bid-payment-method.SC-le7,g10.auction-bid-payment-method.SC-4g4,g10.auction-bid-payment-method.SC-c3a -->
### grade10-site-auction-bid-payment-method-US1-TC6-1: A linked card carries over to a new listing

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

**Expected Results:**

* No card choice is asked for.
* The authorization is taken on the linked card.

---

## grade10-site-auction-bid-payment-method-US2: Collector raises a bid on the same card

**As a** collector who already bid on a listing,
**I want** a higher bid to use the card I already committed to that listing,
**so that** I can raise my maximum without selecting a card again.

<!-- trace:case id=g10.auction-bid-payment-method.TC-x5g rev=1 covers=g10.auction-bid-payment-method.SC-7z5,g10.auction-bid-payment-method.SC-khw,g10.auction-bid-payment-method.SC-oa0,g10.auction-bid-payment-method.SC-1ff -->
### grade10-site-auction-bid-payment-method-US2-TC1-1: A higher maximum raises the same authorization on the same card

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
| <listing_3> | An open listing taking bids, led by this collector with one active authorization |
| <prior maximum> | The collector's current maximum on <listing_3> |
| <higher maximum> | A maximum above <prior maximum> |

**Steps:**

1. Enter <higher maximum> in the bid panel.
2. Click the bid action.
3. Read the collector's authorizations for <listing_3> at the card provider.

**Expected Results:**

* Step 2: no card choice is asked for.
* Step 2: the raise shows as accepted only once the raised authorization is confirmed.
* Step 3: one active authorization, now for <higher maximum>, on the same card.

<!-- trace:case id=g10.auction-bid-payment-method.TC-hk4 rev=1 covers=g10.auction-bid-payment-method.SC-7z5,g10.auction-bid-payment-method.SC-khw,g10.auction-bid-payment-method.SC-oa0,g10.auction-bid-payment-method.SC-1ff -->
### grade10-site-auction-bid-payment-method-US2-TC2-1: A refused raise keeps the prior maximum and blocks nothing after

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
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

<!-- trace:case id=g10.auction-bid-payment-method.TC-qo3 rev=1 covers=g10.auction-bid-payment-method.SC-lao,g10.auction-bid-payment-method.SC-33r -->
### grade10-site-auction-bid-payment-method-US3-TC1-1: Being outbid cancels the hold once, capturing nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
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
* Step 4: no payment or order exists for customer A.

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
* **Status:** draft
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
| <maximum> | The next valid bid shown on the bid panel |

**Steps:**

1. Read the bid panel, under the bid action.
2. Enter <maximum> in the bid panel without placing it.

**Expected Results:**

* Step 1: the buyer's premium reads 20% of the winning bid, not behind a tooltip.
* Step 2: no premium amount and no invoice total show.

<!-- trace:case id=g10.auction-bid-payment-method.TC-nvs rev=1 covers=g10.auction-bid-payment-method.SC-x21,g10.auction-bid-payment-method.SC-oeb -->
### grade10-site-auction-bid-payment-method-US4-TC2-1: The rate reads 20% in every supported currency

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
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

- Incremental and extended authorization are provider eligibility requests; the provider's returned capture deadline is authoritative for the authorization lifecycle.

## Reconciliation

**Run:** 2026-09-24; scenario and suite readings were reconciled by the author.

- **Uncovered anchors:** none. Provider option flags and the returned authorization deadline are covered by the Stripe adapter and backend verification lanes, not by a customer walk.
