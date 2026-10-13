# grade10-site/auction/bid-payment-method Test Cases

**Status:** pending-review · 5/9
**Reviewed:** 2026-10-05, tcs-rules r4, lapsed 2026-10-14
**Drafts styled:** 2026-10-14, tcs-rules r5

## Walk 1: Collector bids on the card already linked

**Starting state:**

- customer(signed in, no linked card) is on <listing_1 url>.
- customer(signed in, <the successful Visa> on file, no bid on <listing_6>) is on <listing_6 url>.
- customer(signed in, <the successful Visa> linked on an earlier listing, no bid on <listing_2>) is on <listing_2 url>.
- customer A(card linked) leads <listing_8> with maximum <user A maximum>, and is signed in.
- customer B(card linked) holds a lower maximum on <listing_8>.
- <listing_8>'s close is under a minute away, and no further bid will be placed.
- customer A and customer B each open `<listing_8 url>` and wait there for the lot to close.
- customer(signed in) placed the first accepted bid on <listing_10> with <the successful Visa>, and leads it at <locked maximum>.
- customer has also linked <the other card>.
- customer(signed in, card linked, no bid on <listing_11>) is on <listing_11 url>.

**Shared test data:**

| Item | Value |
| --- | --- |
| <listing_1> | An open listing taking bids, with no bid from this collector |
| <listing_6> | An open listing taking bids, with no bid from this collector and no other bidder |
| <the successful Visa> | 4242 4242 4242 4242. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |
| <maximum> | A maximum above the next valid bid, within the collector's bidding limits |
| <listing_2> | An open listing taking bids, not bid on by this collector |
| <next bid> | The next valid bid shown on the bid panel |
| <listing_8> | An open USD listing led by customer A |
| <user A maximum> | USD8,400 (range: 800000–3999999 minor units) |
| <listing_10> | An open listing taking bids, led by this collector |
| <the successful Visa> | 4242 4242 4242 4242, the card <listing_10> is locked to. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |
| <the other card> | 5555 5555 5555 4444. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |
| <locked maximum> | The collector's maximum on <listing_10> |
| <other-card maximum> | A maximum above <locked maximum> |
| <listing_11> | An open USD listing, current bid USD280 (range: 1000–79999 minor units), minimum next bid USD285 (range: 1000–79999 minor units) |
| <low maximum> | USD282 (range: 1000–79999 minor units), below the minimum next bid |

### Route

1. Read the amount controls on the bid panel.
   - the quick bids and the custom maximum show, disabled. g10.auction-bid-payment-method.US1-TC1
2. Click the bid action.
   - opens card-link setup, the bid form asks for a card, and no bid is placed. g10.auction-bid-payment-method.US1-TC1
3. Close the setup modal without linking a card.
4. Reload <listing_1 url> and read Highest bid and the bid count.
   - Highest bid and the bid count are unchanged, and no bid of this collector's is on <listing_1>. g10.auction-bid-payment-method.US1-TC1
5. Navigate to <my auctions url> and look for <listing_1>.
   - shows no row for <listing_1>. g10.auction-bid-payment-method.US1-TC1
6. Enter <maximum> in the custom maximum on the bid panel.
7. Click the bid action.
   - no confirmation or payment-method modal opens. g10.auction-bid-payment-method.US1-TC2
8. Read the bid panel.
   - the panel shows the collector leading at <maximum>, in the one answer, with no authorizing state before it. g10.auction-bid-payment-method.US1-TC2
9. Read the linked card's activity at the card provider.
   - nothing is held or charged on <the successful Visa>. g10.auction-bid-payment-method.US1-TC2
10. Enter <next bid> in the bid panel.
11. Click the bid action.
12. Read the bid panel's linked card.
   - shows <the successful Visa>, with Change no longer offered. g10.auction-bid-payment-method.US1-TC6
13. Read the linked card's activity at the card provider.
   - No card choice is asked for, and the bid is accepted. g10.auction-bid-payment-method.US1-TC6
   - nothing is held or charged on <the successful Visa> for <listing_2>. g10.auction-bid-payment-method.US1-TC6
14. Wait until <listing_8> is recorded closed with customer A winning.
15. Read customer A's and customer B's card activity at the card provider.
   - nothing is held or charged on either card, by the bids or by the close. g10.auction-bid-payment-method.US1-TC7
16. As customer A, open <listing_8>'s order from View order on My Auctions.
17. Start paying the invoice by card.
   - opens the provider's hosted Checkout for the winner order's invoice. g10.auction-bid-payment-method.US1-TC7
18. Submit <other-card maximum> on <listing_10> with <the other card>.
19. Read the API response.
   - refuses the bid because the listing's card is locked. g10.auction-bid-payment-method.US1-TC9
20. Read <listing_10>'s current bid, the leader and the collector's maximum.
   - the current bid and leader are unchanged, and the collector's maximum stays <locked maximum> on <the successful Visa>. g10.auction-bid-payment-method.US1-TC9
21. Enter <low maximum> in the custom maximum on the bid panel.
22. Click the bid action.
23. Read the bid form and the linked card on the bid panel.
   - the bid form names the minimum next bid, USD285, and Change is still offered on the linked card. g10.auction-bid-payment-method.US1-TC10
24. Click Change on the linked card.
   - opens card-link setup. g10.auction-bid-payment-method.US1-TC10

## Walk 2: Collector raises a bid on the same card and adjacent checks

**Starting state:**

- customer(signed in, leads <listing_12> at <held maximum> on <the successful Visa>) is on <listing_12 url>.
- customer(signed in, no bid on <listing_5>) is on <listing_5 url>.
- The bid panel's premium disclosure is rendered for an open listing in <currency>.

**Shared test data:**

| Item | Value |
| --- | --- |
| <listing_12> | An open listing taking bids, led by this collector on <the successful Visa> |
| <the successful Visa> | 4242 4242 4242 4242. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |
| <held maximum> | The collector's current maximum on <listing_12> |
| <raised maximum> | A maximum above <held maximum> |
| <listing_5> | An open USD listing taking bids |
| <next bid> | The next valid bid shown on the bid panel |
| USD | 20% of the winning bid |
| USD | 20% of the winning bid |


### Route

1. Enter <raised maximum> in the bid panel.
2. Click the bid action.
   - no card choice is asked for. g10.auction-bid-payment-method.US2-TC1
3. Read the bid panel.
   - the panel shows <raised maximum> at once, with no authorizing state before it. g10.auction-bid-payment-method.US2-TC1
4. Read the collector's card activity at the card provider.
   - nothing is held or charged on <the successful Visa> for <listing_12>. g10.auction-bid-payment-method.US2-TC1
5. Read the bid panel, under the bid action.
   - the buyer's premium reads 20% of the winning bid, not behind a tooltip. g10.auction-bid-payment-method.US4-TC1
6. Enter <next bid> in the bid panel without placing it.
   - no premium amount and no invoice total show. g10.auction-bid-payment-method.US4-TC1
7. Render the premium disclosure for <currency>.
   - It reads the row's disclosure. g10.auction-bid-payment-method.US4-TC2
   - No currency amount appears in it. g10.auction-bid-payment-method.US4-TC2

## g10.auction-bid-payment-method.US1: Collector bids on the card already linked

**As a** signed-in collector with a linked card,
**I want** my maximum to stand the moment I commit it, with nothing taken from my card,
**so that** I bid in one step and pay only if I win.

### g10.auction-bid-payment-method.US1-TC1: No linked card means no bid, setup opens, and no bid is recorded

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-payment-method.spec.ts`

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

<!-- trace:case id=g10.auction-bid-payment-method.TC-tm1 rev=2 -->
### g10.auction-bid-payment-method.US1-TC2: Committing a maximum stands at once, with nothing taken from the card

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-payment-method.spec.ts`

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

<!-- trace:case id=g10.auction-bid-payment-method.TC-heq rev=1 -->
### g10.auction-bid-payment-method.US1-TC3: A pending or challenged authorization stays on the bid surface

Runs once for the sole supported bid currency.

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

<!-- trace:case id=g10.auction-bid-payment-method.TC-h30 rev=1 -->
### g10.auction-bid-payment-method.US1-TC4: A declined or unusable card is refused near the bid action

Runs once for the sole supported bid currency.

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

<!-- trace:case id=g10.auction-bid-payment-method.TC-b9p rev=1 -->
### g10.auction-bid-payment-method.US1-TC5: A provider failure has its own copy and leaves nothing held

Runs once for the sole supported bid currency.

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

<!-- trace:case id=g10.auction-bid-payment-method.TC-d2o rev=2 -->
### g10.auction-bid-payment-method.US1-TC6: A linked card carries over to a new listing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-payment-method.spec.ts`

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

<!-- trace:case id=g10.auction-bid-payment-method.TC-rg2 rev=2 -->
### g10.auction-bid-payment-method.US1-TC7: Only the winner pays, through Checkout on the winner order

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
| <listing_8> | An open USD listing led by customer A |
| <user A maximum> | USD8,400 (range: 800000–3999999 minor units) |

**Steps:**

1. Wait until <listing_8> is recorded closed with customer A winning.
2. Read customer A's and customer B's card activity at the card provider.
3. As customer A, open <listing_8>'s order from View order on My Auctions.
4. Start paying the invoice by card.

**Expected Results:**

* Step 2: nothing is held or charged on either card, by the bids or by the close.
* Step 4 opens the provider's hosted Checkout for the winner order's invoice.

<!-- trace:case id=g10.auction-bid-payment-method.TC-hgh rev=1 -->
### g10.auction-bid-payment-method.US1-TC8: A bid from an account with no linked card is refused, asking for a card

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

<!-- trace:case id=g10.auction-bid-payment-method.TC-ilh rev=1 -->
### g10.auction-bid-payment-method.US1-TC9: A bid on another card after the first accepted bid is refused as locked

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-payment-method-US-01

**Decided by:** `grade10:apps/backend/grade10/auction/test/db/bidding/placeBid.spec.ts`

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

<!-- trace:case id=g10.auction-bid-payment-method.TC-l7t rev=2 -->
### g10.auction-bid-payment-method.US1-TC10: A refused first bid leaves the card changeable

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
| <listing_11> | An open USD listing, current bid USD280 (range: 1000–79999 minor units), minimum next bid USD285 (range: 1000–79999 minor units) |
| <low maximum> | USD282 (range: 1000–79999 minor units), below the minimum next bid |

**Steps:**

1. Enter <low maximum> in the custom maximum on the bid panel.
2. Click the bid action.
3. Read the bid form and the linked card on the bid panel.
4. Click Change on the linked card.

**Expected Results:**

* Step 3: the bid form names the minimum next bid, USD285, and Change is still offered on the linked card.
* Step 4 opens card-link setup.

## g10.auction-bid-payment-method.US2: Collector raises a bid on the same card

**As a** collector who already bid on a listing,
**I want** a higher bid to use the card I already committed to that listing,
**so that** I can raise my maximum without selecting a card again.

<!-- trace:case id=g10.auction-bid-payment-method.TC-x5g rev=2 -->
### g10.auction-bid-payment-method.US2-TC1: A higher maximum is accepted on the same card, with nothing taken from it

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-payment-method-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-payment-method.spec.ts`

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

<!-- trace:case id=g10.auction-bid-payment-method.TC-hk4 rev=1 -->
### g10.auction-bid-payment-method.US2-TC2: A refused raise keeps the prior maximum and blocks nothing after

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

## Settled

- `g10.auction-bid-payment-method.US3` is retired by `refused-bid-is-not-a-bid`; its deprecated case content is removed from the durable suite.
- Retired marker IDs folded here: `g10.auction-bid-payment-method.TC-txz`

## g10.auction-bid-payment-method.US4: Collector understands the buyer-premium rate before bidding

**As a** collector considering a live lot,
**I want** to know the buyer's premium rate before I bid,
**so that** I understand the policy without being shown an invoice amount that
does not exist yet.

<!-- trace:case id=g10.auction-bid-payment-method.TC-lbz rev=2 covers=g10.auction-bid-payment-method.SC-x21 -->
### g10.auction-bid-payment-method.US4-TC1: The bid panel shows the 20% rate and no premium amount

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
| <listing_5> | An open USD listing taking bids |
| <next bid> | The next valid bid shown on the bid panel |

**Steps:**

1. Read the bid panel, under the bid action.
2. Enter <next bid> in the bid panel without placing it.

**Expected Results:**

* Step 1: the buyer's premium reads 20% of the winning bid, not behind a tooltip.
* Step 2: no premium amount and no invoice total show.

<!-- trace:case id=g10.auction-bid-payment-method.TC-nvs rev=2 covers=g10.auction-bid-payment-method.SC-oeb -->
### g10.auction-bid-payment-method.US4-TC2: The rate reads 20% for the universal USD bid currency

Runs once for the sole supported bid currency.

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
| USD | 20% of the winning bid |

**Steps:**

1. Render the premium disclosure for <currency>.

**Expected Results:**

* It reads the row's disclosure.
* No currency amount appears in it.

## Settled

- The bid panel shows the fixed 20% rate only; the calculated premium amount is invoice-only.
- `grade10-site-auction-bid-payment-method-US-04-TC1` is `g10.auction-bid-payment-method.US4-TC1`: renamed to the compact id form while still draft.
- `grade10-site-auction-bid-payment-method-US-04-TC2` is `g10.auction-bid-payment-method.US4-TC2`: renamed to the compact id form while still draft.
- Committing or raising a maximum takes nothing from the card and waits on no payment provider, so no case reads an authorization, a provider challenge, a pending state, a declined card at bid time or a provider failure; those cases are deprecated (decisions Q1, Q5).
- Being outbid has nothing to release; US3 is retired with its case (decisions Q13).
- Only the winner pays, by the invoice on their winner order; what the winner order shows after payment is `grade10-site/auction/winner-order`'s.
- `g10.auction-bid-payment-method.US1-TC8` joins `g10.auction-bid-payment-method.US1-TC1`: one walk with no card, setup still available, and no bid recorded. `US1-TC8-1` is deprecated.

### Archived fold records

- Archived suites are reconciliation evidence only; they are not regeneration input.
- **2026-09-24-fix-auction-payment-hold-increment** — `grade10-site-auction-bid-payment-method-US1-TC1-1` → `g10.auction-bid-payment-method.US1-TC1`; `grade10-site-auction-bid-payment-method-US1-TC2-1` → `g10.auction-bid-payment-method.US1-TC2`; `grade10-site-auction-bid-payment-method-US1-TC3-1` → `g10.auction-bid-payment-method.US1-TC3`; `grade10-site-auction-bid-payment-method-US1-TC4-1` → `g10.auction-bid-payment-method.US1-TC4`; `grade10-site-auction-bid-payment-method-US1-TC5-1` → `g10.auction-bid-payment-method.US1-TC5`; `grade10-site-auction-bid-payment-method-US1-TC6-1` → `g10.auction-bid-payment-method.US1-TC6`; `grade10-site-auction-bid-payment-method-US2-TC1-1` → `g10.auction-bid-payment-method.US2-TC1`; `grade10-site-auction-bid-payment-method-US2-TC2-1` → `g10.auction-bid-payment-method.US2-TC2`; `grade10-site-auction-bid-payment-method-US3-TC1-1` → `g10.auction-bid-payment-method.US3-TC1`
- **2026-10-03-refused-bid-is-not-a-bid** — `grade10-site-auction-bid-payment-method-US1-TC1-2` → `g10.auction-bid-payment-method.US1-TC1`; `grade10-site-auction-bid-payment-method-US1-TC2-2` → `g10.auction-bid-payment-method.US1-TC2`; `grade10-site-auction-bid-payment-method-US1-TC3-1` → `g10.auction-bid-payment-method.US1-TC3`; `grade10-site-auction-bid-payment-method-US1-TC4-1` → `g10.auction-bid-payment-method.US1-TC4`; `grade10-site-auction-bid-payment-method-US1-TC5-1` → `g10.auction-bid-payment-method.US1-TC5`; `grade10-site-auction-bid-payment-method-US1-TC6-2` → `g10.auction-bid-payment-method.US1-TC6`; `grade10-site-auction-bid-payment-method-US1-TC7-1` → `g10.auction-bid-payment-method.US1-TC7`; `grade10-site-auction-bid-payment-method-US1-TC8-1` → `g10.auction-bid-payment-method.US1-TC8`; `grade10-site-auction-bid-payment-method-US1-TC9-1` → `g10.auction-bid-payment-method.US1-TC9`; `grade10-site-auction-bid-payment-method-US1-TC10-1` → `g10.auction-bid-payment-method.US1-TC10`; `grade10-site-auction-bid-payment-method-US2-TC1-2` → `g10.auction-bid-payment-method.US2-TC1`; `grade10-site-auction-bid-payment-method-US2-TC2-1` → `g10.auction-bid-payment-method.US2-TC2`; `grade10-site-auction-bid-payment-method-US3-TC1-1` → `g10.auction-bid-payment-method.US3-TC1`

## Reconciliation

**Run:** Independent QA2, 2026-10-14. This pass read the frozen QA1 bundle, current PRD, decisions, journeys, delta requirements, technical design, tasks, durable baseline and existing cases.

- **Anchors:** The active linked-card journeys US-01 and US-02 retain actual cases. The changed premium-disclosure journey US-04 has two draft cases. Existing deprecated cases remain historical.
- **Coverage:** TC-lbz rev2 fully asserts premium rate disclosure on the bid panel and covers SC-x21. TC-nvs rev2 fully asserts the universal USD rate and covers SC-oeb, including no HKD or JPY rate. Both cases remain draft; no execution or approval is claimed.
- **Settled behavior:** The bid panel shows the fixed 20% rate without a premium amount or invoice total. The examples retain only USD bidding. The linked card funds remain used for bid acceptance as the durable contract says.
- **Blind QA1 and Dev:** QA1 checked the fresh physical input bundle with manifest digest `852597efc39b627e7bfdea8bc3d229a253a91404ac60d030951c862b4e97411b`; all 22 hashes matched and the pass made no edits. Dev found no product-source gap.
