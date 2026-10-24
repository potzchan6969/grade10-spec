# grade10-site/auction/bid-payment-method Test Cases

**Status:** reopened · 2/6
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* A collector links one card for bidding, under bid panel enrollment; it carries to new listings and locks to a listing at the first accepted bid there. A bid or a raise takes nothing from the card: only the winner pays, through the order's Checkout.
* A card is read at the card provider's test dashboard. Every listing is priced in USD: +USD25 from USD200.

## g10.auction-bid-payment-method.US1: Collector bids on the card already linked

**As a** signed-in collector with a linked card,
**I want** my maximum to stand the moment I commit it, with nothing taken from my card,
**so that** I bid in one step and pay only if I win.

<!-- trace:case id=g10.auction-bid-payment-method.TC-tm1 rev=2 -->
### g10.auction-bid-payment-method.US1-TC2: A committed maximum stands at once, with nothing taken from the card

**Classification:**

* **Severity:** critical
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

* customer(signed in, 4242 4242 4242 4242 on file) has not bid on `<listing>`, which has no other bidder, and is on its page.

**Steps:**

1. Place a maximum of USD1,500.
2. Read the panel, then the card at the provider.

**Expected Results:**

* No confirmation or card modal opens; customer reads Leading in one answer, with no authorizing state; nothing is held or charged.

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

* customer(signed in, card linked) has not bid on `<listing>`, at USD280 set by another customer, and is on its page.

**Steps:**

1. Place a maximum of USD290.
2. Read the bid form and the card slot, then select Change.

**Expected Results:**

* The bid form names Minimum bid USD305 (USD280 plus the USD25 step); Change is still offered and opens card setup.

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
* **Testability:** manual
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Pre-conditions:**

* customer A leads `<listing>` with a maximum of USD8,400 over customer B's lower maximum, both with cards linked; it closes in a minute with no further bid.

**Steps:**

1. Let the close be recorded, and read both cards at the provider.
2. As customer A, open the order from My Auctions and start paying by card.

**Expected Results:**

* Step 1 shows nothing held or charged on either card.
* Step 2 opens the provider's hosted Checkout for the order's invoice.

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

* customer(signed in) leads `<listing>` with a maximum of USD560 on 4242 4242 4242 4242, and is on its page.

**Steps:**

1. Raise the maximum to USD920.
2. Read the panel, then the card at the provider.

**Expected Results:**

* No card is asked for; Your maximum reads USD920 at once, with no authorizing state; nothing is held or charged.

<!-- trace:case id=g10.auction-bid-payment-method.TC-3tv rev=1 -->
### g10.auction-bid-payment-method.US2-TC3: A listing's card stays locked after the account's card changes elsewhere

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-bid-payment-method-US-02

**Pre-conditions:**

* customer leads `<listing>` with a bid placed on 4242 4242 4242 4242, then changed the account's card to 5555 5555 5555 4444 from another listing's setup; customer is on `<listing>`'s page.

**Steps:**

1. Raise the maximum to the next valid bid.
2. Read the bid form and the card slot.

**Expected Results:**

* The bid form says the listing's card is locked, or the raise stands on the Visa; it never stands on the Mastercard.
* The slot shows the Visa, with no Change.

---

## g10.auction-bid-payment-method.US4: Collector understands the buyer-premium rate before bidding

**As a** collector considering a live lot,
**I want** to know the buyer's premium rate before I bid,
**so that** I understand the policy without being shown an invoice amount that
does not exist yet.

<!-- trace:case id=g10.auction-bid-payment-method.TC-lbz rev=2 covers=g10.auction-bid-payment-method.SC-x21 -->
### g10.auction-bid-payment-method.US4-TC1: The bid panel shows the 20% premium rate and no premium amount

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

* customer(signed in) has not bid on open `<listing>` and is on its page.

**Steps:**

1. Read the bid panel under the bid action.
2. Enter the next valid bid without placing it.

**Expected Results:**

* Step 1 reads the buyer's premium as 20% of the winning bid, in plain view, not behind a tooltip.
* Step 2 shows no premium amount and no invoice total.
