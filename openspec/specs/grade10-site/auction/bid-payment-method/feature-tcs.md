# grade10-site/auction/bid-payment-method Test Cases

**Status:** reopened · 4/8
**Reviewed:** 2026-10-05, tcs-rules r4, lapsed 2026-10-14
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* A listing's page on the Grade10 site of the environment under test carries the bid panel and its linked-card slot; `<my auctions url>` is the signed-in account's My Auctions page.
* The linked card is the provider's test Visa 4242 4242 4242 4242, with any future expiry, any 3-digit CVC and any postal code; a card's activity is read at the card provider's test dashboard. Every listing is priced in USD.

## Walk 1: Commit, raise and win on one linked card

Starting state:

- customer A(signed in, `<linked card>` on file) has not bid on `<listing_8>` and is on its page.
- customer B(signed in, card linked) is on the same page in a separate session; nobody else bids, and the close is a few minutes away.

Shared test data:

| Field | Value |
| --- | --- |
| linked card | 4242 4242 4242 4242 |
| listing_8 | An open USD listing with no bids, starting at USD280 |
| first maximum | USD560 |
| customer B maximum | USD840 |
| raised maximum | USD1,500 |

### Route

1. As customer A, read the bid panel under the bid action.
   - The buyer's premium reads 20% of the winning bid, in plain view, with no premium amount or invoice total. `g10.auction-bid-payment-method.US4-TC1`
2. As customer A, enter `<first maximum>` and select the bid action, then read `<linked card>` at the card provider.
   - No confirmation or card modal opens; the panel shows customer A Leading in the one answer, with no authorizing state. `g10.auction-bid-payment-method.US1-TC2`
   - Nothing is held or charged on `<linked card>`. `g10.auction-bid-payment-method.US1-TC2`
3. As customer B, set a maximum of `<customer B maximum>`; as customer A, enter `<raised maximum>` and select the bid action.
   - No card choice is asked for, the panel shows `<raised maximum>` at once, and nothing is held or charged. `g10.auction-bid-payment-method.US2-TC1`
4. Wait until the close is recorded with customer A winning, then read both cards at the card provider.
   - Nothing is held or charged on either card. `g10.auction-bid-payment-method.US1-TC7`
5. As customer A, open the order from View order on My Auctions and start paying by card.
   - The provider's hosted Checkout opens for the order's invoice. `g10.auction-bid-payment-method.US1-TC7`

## g10.auction-bid-payment-method.US1: Collector bids on the card already linked

**As a** signed-in collector with a linked card,
**I want** my maximum to stand the moment I commit it, with nothing taken from my card,
**so that** I bid in one step and pay only if I win.

### g10.auction-bid-payment-method.US1-TC1: With no linked card, the bid action opens setup and records nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-payment-method.spec.ts`

**Pre-conditions:**

* customer(signed in, no linked card) has not bid on `<listing_2>` and is on its page.

**Steps:**

1. Read the amount controls, then select the bid action.
2. Close setup without linking a card.
3. Reload and read Highest bid and the bid count, then open `<my auctions url>`.

**Expected Results:**

* Step 1 shows the quick bids and the custom maximum disabled, then opens setup asking for a card, placing no bid.
* Step 3 shows Highest bid and the bid count unchanged, and no row for `<listing_2>`.

<!-- trace:case id=g10.auction-bid-payment-method.TC-tm1 rev=2 -->
### g10.auction-bid-payment-method.US1-TC2: A committed maximum stands at once, with nothing taken from the card

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-payment-method.spec.ts`

**Pre-conditions:**

* customer(signed in, `<linked card>` on file) has not bid on `<listing_4>`, which has no other bidder, and is on its page.

**Test data:**

| Field | Value |
| --- | --- |
| `<linked card>` | 4242 4242 4242 4242 |
| `<maximum>` | USD1,500 (range: above the next valid bid) |

**Steps:**

1. Enter `<maximum>` in the custom maximum and select the bid action.
2. Read the panel, then `<linked card>` at the card provider.

**Expected Results:**

* Step 1 opens no confirmation or card modal.
* Step 2 shows customer Leading in the one answer, with no authorizing state, and nothing held or charged.

<!-- trace:case id=g10.auction-bid-payment-method.TC-d2o rev=2 -->
### g10.auction-bid-payment-method.US1-TC6: A linked card carries over to a new listing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-payment-method.spec.ts`

**Pre-conditions:**

* customer(signed in) linked `<linked card>` on `<listing_6>`, has not bid on `<listing_7>`, and is on its page.

**Test data:**

| Field | Value |
| --- | --- |
| `<linked card>` | 4242 4242 4242 4242 |

**Steps:**

1. Enter the next valid bid and select the bid action.
2. Read the linked-card slot, then `<linked card>` at the card provider.

**Expected Results:**

* Step 1 asks for no card and accepts the bid.
* Step 2 shows `<linked card>` with no Change, and nothing held or charged for `<listing_7>`.

<!-- trace:case id=g10.auction-bid-payment-method.TC-rg2 rev=2 -->
### g10.auction-bid-payment-method.US1-TC7: Only the winner pays, through Checkout on the order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Pre-conditions:**

* customer A(card linked) leads `<listing_8>` with a maximum of `<customer A maximum>`, over customer B(card linked)'s lower maximum; its close is under a minute away, and nobody bids again.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | An open USD listing |
| `<customer A maximum>` | USD8,400 (range: 800000–3999999 minor units) |

**Steps:**

1. Wait until the close is recorded with customer A winning.
2. Read both cards at the card provider.
3. As customer A, open the order from View order on My Auctions and start paying by card.

**Expected Results:**

* Step 2 shows nothing held or charged on either card.
* Step 3 opens the provider's hosted Checkout for the order's invoice.

<!-- trace:case id=g10.auction-bid-payment-method.TC-l7t rev=2 -->
### g10.auction-bid-payment-method.US1-TC10: A refused first bid leaves the card changeable

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Pre-conditions:**

* customer(signed in, card linked) has not bid on `<listing_12>` and is on its page; its current bid is `<current bid>`, set by another customer.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_12>` | An open USD listing |
| `<current bid>` | USD280 (range: 20000–49999 minor units) |
| `<minimum next>` | USD305 (fixed derived): `<current bid>` plus the USD25 step |
| `<low maximum>` | USD290 (range: above `<current bid>`, below `<minimum next>`) |

**Steps:**

1. Enter `<low maximum>` in the custom maximum and select the bid action.
2. Read the bid form and the linked-card slot, then select Change.

**Expected Results:**

* Step 2: the bid form names `<minimum next>`, Change is still offered, and selecting it opens card setup.

<!-- trace:case id=g10.auction-bid-payment-method.TC-heq rev=1 -->
### g10.auction-bid-payment-method.US1-TC3: A pending or challenged authorization stays on the bid surface

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Retirement:** A bid takes nothing from the card, so no authorization is pending or challenged at bid time; removed behaviour.

**Pre-conditions:**

* The card provider answers the authorization with a challenge or pending.

**Steps:**

1. Place a bid.

**Expected Results:**

* The provider's state shows on the bid surface.

<!-- trace:case id=g10.auction-bid-payment-method.TC-h30 rev=1 -->
### g10.auction-bid-payment-method.US1-TC4: A declined or unusable card is refused near the bid action

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Retirement:** A bid takes nothing from the card, so no provider declines it at bid time; removed behaviour.

**Pre-conditions:**

* The card provider declines the authorization.

**Steps:**

1. Place a bid.

**Expected Results:**

* Refusal copy shows near the bid action.

<!-- trace:case id=g10.auction-bid-payment-method.TC-b9p rev=1 -->
### g10.auction-bid-payment-method.US1-TC5: A provider failure has its own copy and leaves nothing held

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Retirement:** A bid waits on no payment provider, so no provider failure reaches it; removed behaviour.

**Pre-conditions:**

* The authorization call fails.

**Steps:**

1. Place a bid.

**Expected Results:**

* Provider-failure copy shows near the bid action.

<!-- trace:case id=g10.auction-bid-payment-method.TC-hgh rev=1 -->
### g10.auction-bid-payment-method.US1-TC8: A bid from an account with no linked card is refused, asking for a card

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Retirement:** The same refusal as `g10.auction-bid-payment-method.US1-TC1`; replaced by `g10.auction-bid-payment-method.US1-TC1`

**Pre-conditions:**

* The account holds no linked card when the bid is placed.

**Steps:**

1. Place the next valid bid.

**Expected Results:**

* The bid form asks for a card.

---

## g10.auction-bid-payment-method.US2: Collector raises a bid on the same card

**As a** collector who already bid on a listing,
**I want** a higher bid to use the card I already committed to that listing,
**so that** I can raise my maximum without selecting a card again.

<!-- trace:case id=g10.auction-bid-payment-method.TC-x5g rev=2 -->
### g10.auction-bid-payment-method.US2-TC1: A raise uses the same card, with nothing taken from it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-payment-method.spec.ts`

**Pre-conditions:**

* customer(signed in) leads `<listing_22>` with a maximum of `<current maximum>` on `<linked card>`, and is on its page.

**Test data:**

| Field | Value |
| --- | --- |
| `<linked card>` | 4242 4242 4242 4242 |
| `<current maximum>` | USD560 (range: any accepted maximum) |
| `<raised maximum>` | USD920 (range: above `<current maximum>`) |

**Steps:**

1. Enter `<raised maximum>` and select the bid action.
2. Read the panel, then `<linked card>` at the card provider.

**Expected Results:**

* Step 1 asks for no card.
* Step 2 shows `<raised maximum>` at once, with no authorizing state, and nothing held or charged.

<!-- trace:case id=g10.auction-bid-payment-method.TC-3tv rev=1 -->
### g10.auction-bid-payment-method.US2-TC3: A bid on another card after the first is refused as the listing's card is locked

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-02

**Pre-conditions:**

* customer(signed in) placed an accepted bid on `<listing_24>` with `<first card>`, and has since changed the account's card to `<second card>` from another listing's setup.
* customer is on `<listing_24>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_24>` | An open USD listing the customer leads |
| `<first card>` | 4242 4242 4242 4242 |
| `<second card>` | 5555 5555 5555 4444 |

**Steps:**

1. Raise the maximum to the next valid bid and select the bid action.
2. Read the bid form and the linked-card slot.

**Expected Results:**

* Step 2: the bid form says the listing's card is locked, or the raise goes through on `<first card>`; it never stands on `<second card>`.
* The slot shows `<first card>`, with no Change.

<!-- trace:case id=g10.auction-bid-payment-method.TC-hk4 rev=1 -->
### g10.auction-bid-payment-method.US2-TC2: A refused raise keeps the prior maximum and blocks nothing after

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-02

**Retirement:** A raise takes nothing from the card, so no provider refuses it; removed behaviour.

**Pre-conditions:**

* The card provider refuses raising the existing authorization.

**Steps:**

1. Raise the maximum.

**Expected Results:**

* The decline copy shows near the bid action.

---

## g10.auction-bid-payment-method.US4: Collector understands the buyer-premium rate before bidding

**As a** collector considering a live lot,
**I want** to know the buyer's premium rate before I bid,
**so that** I understand the policy without being shown an invoice amount that
does not exist yet.

<!-- trace:case id=g10.auction-bid-payment-method.TC-lbz rev=2 covers=g10.auction-bid-payment-method.SC-x21 -->
### g10.auction-bid-payment-method.US4-TC1: The bid panel shows the 20% rate and no premium amount

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-04

**Pre-conditions:**

* customer(signed in) has not bid on `<listing_26>` and is on its page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_26>` | An open USD listing |
| `<premium rate>` | 20% (fixed configured rate) |

**Steps:**

1. Read the bid panel under the bid action.
2. Enter the next valid bid without placing it.

**Expected Results:**

* Step 1 reads the buyer's premium as `<premium rate>` of the winning bid, in plain view, not behind a tooltip.
* Step 2 shows no premium amount and no invoice total.
