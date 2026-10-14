# grade10-site/auction/bid-payment-method Test Cases

**Status:** reopened · 5/9
**Reviewed:** 2026-10-05, tcs-rules r4, lapsed 2026-10-14
**Drafts styled:** 2026-10-14, tcs-rules r5

## Walk 1: Collector bids on the card already linked

**Starting state:**

- customer(signed in, no linked card) is on `<listing_2 url>`.
- customer(signed in, `<linked card>` on file, no bid on `<listing_4>`) is on `<listing_4 url>`.
- customer(signed in, `<linked card>` linked on `<listing_6>`, no bid on `<listing_7>`) is on `<listing_7 url>`.
- customer A(card linked) leads `<listing_8>` with maximum `<customer A maximum>`, and is signed in.
- customer B(card linked) holds maximum `<customer B maximum>`, lower than `<customer A maximum>`, on `<listing_8>`.
- `<listing_8>`'s close is under a minute away, and no further bid will be placed.
- customer(signed in) placed the first accepted bid on `<listing_10>` with `<linked card>`, and leads it at `<locked maximum>`.
- customer has also linked `<replacement card>`, different from `<linked card>`.
- customer(signed in, card linked, no bid on `<listing_12>`) is on `<listing_12 url>`.
- The listing has current bid `<current bid>` and minimum next bid `<minimum next bid>`.

**Shared test data:**

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-bid-payment-method.US1-TC1 | listing_2 | An open listing taking bids, with no bid from this collector; bind its identity only |
| g10.auction-bid-payment-method.US1-TC1 | listing_2 url | The URL of `<listing_2>`; bind its URL only |
| g10.auction-bid-payment-method.US1-TC1 | my auctions url | The My Auctions URL; bind its URL only |

| Case | Field | Value | Fixture notes |
| --- | --- | --- | --- |
| g10.auction-bid-payment-method.US1-TC2 | listing_4 | An open listing taking bids, with no bid from this collector and no other bidder; bind its identity only | · |
| g10.auction-bid-payment-method.US1-TC2 | linked card | The seeded linked Visa card; bind its card identity only | 4242 4242 4242 4242. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |
| g10.auction-bid-payment-method.US1-TC2 | maximum | A maximum above the next valid bid, within the collector's bidding limits; bind its amount only | · |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-bid-payment-method.US1-TC2 | listing_4 url | The URL of `<listing_4>`; bind its URL only |

| Case | Field | Value | Fixture notes |
| --- | --- | --- | --- |
| g10.auction-bid-payment-method.US1-TC6 | listing_7 | An open listing taking bids, not bid on by this collector; bind its identity only | · |
| g10.auction-bid-payment-method.US1-TC6 | linked card | The seeded linked Visa card; bind its card identity only | 4242 4242 4242 4242. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |
| g10.auction-bid-payment-method.US1-TC6 | next bid | The next valid bid shown on the bid panel; bind its amount only | · |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-bid-payment-method.US1-TC6 | listing_6 | A different earlier listing where this collector linked `<linked card>`; bind its identity only |
| g10.auction-bid-payment-method.US1-TC6 | listing_7 url | The URL of `<listing_7>`; bind its URL only |

| Case | Field | Value | Fixture notes |
| --- | --- | --- | --- |
| g10.auction-bid-payment-method.US1-TC7 | listing_8 | An open USD listing led by customer A; bind its identity only | · |
| g10.auction-bid-payment-method.US1-TC7 | customer A maximum | USD8,400 | (range: 800000–3999999 minor units) |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-bid-payment-method.US1-TC7 | customer B maximum | The accepted maximum of customer B on `<listing_8>`, below `<customer A maximum>`; bind its amount only |
| g10.auction-bid-payment-method.US1-TC7 | winner_order_1 | The winner order for customer A on `<listing_8>` after the close is recorded; bind its order identity only |

| Case | Field | Value | Fixture notes |
| --- | --- | --- | --- |
| g10.auction-bid-payment-method.US1-TC9 | listing_10 | An open listing taking bids, led by this collector; bind its identity only | · |
| g10.auction-bid-payment-method.US1-TC9 | linked card | The seeded linked Visa card; bind its card identity only | 4242 4242 4242 4242, the card `<listing_10>` is locked to. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |
| g10.auction-bid-payment-method.US1-TC9 | replacement card | The seeded linked card different from `<linked card>`; bind its card identity only | 5555 5555 5555 4444. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |
| g10.auction-bid-payment-method.US1-TC9 | locked maximum | The collector's maximum on `<listing_10>`; bind its amount only | · |
| g10.auction-bid-payment-method.US1-TC9 | replacement maximum | A maximum above `<locked maximum>`; bind its amount only | · |

| Case | Field | Value | Fixture notes |
| --- | --- | --- | --- |
| g10.auction-bid-payment-method.US1-TC10 | listing_12 | An open USD listing, current bid `<current bid>`, minimum next bid `<minimum next bid>`; bind its identity only | · |
| g10.auction-bid-payment-method.US1-TC10 | low maximum | USD282 | (range: 1000–79999 minor units), below the minimum next bid |
| g10.auction-bid-payment-method.US1-TC10 | current bid | USD280 | (range: 1000–79999 minor units) |
| g10.auction-bid-payment-method.US1-TC10 | minimum next bid | USD285 | (range: 1000–79999 minor units) |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-bid-payment-method.US1-TC10 | listing_12 url | The URL of `<listing_12>`; bind its URL only |

### Route

1. Read the amount controls on the bid panel.
   - Step 1: the quick bids and the custom maximum show, disabled. g10.auction-bid-payment-method.US1-TC1
2. Click the bid action.
   - Step 2 opens card-link setup, the bid form asks for a card, and no bid is placed. g10.auction-bid-payment-method.US1-TC1
3. Close the setup modal without linking a card.
4. Reload `<listing_2 url>` and read Highest bid and the bid count.
   - Step 4: Highest bid and the bid count are unchanged, and no bid of this collector's is on `<listing_2>`. g10.auction-bid-payment-method.US1-TC1
5. Navigate to `<my auctions url>` and look for `<listing_2>`.
   - Step 5 shows no row for `<listing_2>`. g10.auction-bid-payment-method.US1-TC1
6. Enter `<maximum>` in the custom maximum on the bid panel.
7. Click the bid action.
   - Step 7: no confirmation or payment-method modal opens. g10.auction-bid-payment-method.US1-TC2
8. Read the bid panel.
   - Step 8: the panel shows the collector leading at `<maximum>`, in the one answer, with no authorizing state before it. g10.auction-bid-payment-method.US1-TC2
9. Read the linked card's activity at the card provider.
   - Step 9: nothing is held or charged on `<linked card>`. g10.auction-bid-payment-method.US1-TC2
10. Enter `<next bid>` in the bid panel.
11. Click the bid action.
12. Read the bid panel's linked card.
   - Step 12 shows `<linked card>`, with Change no longer offered. g10.auction-bid-payment-method.US1-TC6
13. Read the linked card's activity at the card provider.
   - No card choice is asked for, and the bid is accepted. g10.auction-bid-payment-method.US1-TC6
   - Step 13: nothing is held or charged on `<linked card>` for `<listing_7>`. g10.auction-bid-payment-method.US1-TC6
14. Wait until `<listing_8>` is recorded closed with customer A winning.
15. Read customer A's and customer B's card activity at the card provider.
   - Step 15: nothing is held or charged on either card, by the bids or by the close. g10.auction-bid-payment-method.US1-TC7
16. As customer A, open `<winner_order_1>` from View order on My Auctions.
17. Start paying the invoice by card.
   - Step 17 opens the provider's hosted Checkout for `<winner_order_1>`'s invoice. g10.auction-bid-payment-method.US1-TC7
18. Submit `<replacement maximum>` on `<listing_10>` with `<replacement card>`.
19. Read the API response.
   - Step 19 refuses the bid because the listing's card is locked. g10.auction-bid-payment-method.US1-TC9
20. Read `<listing_10>`'s current bid, the leader and the collector's maximum.
   - Step 20: the current bid and leader are unchanged, and the collector's maximum stays `<locked maximum>` on `<linked card>`. g10.auction-bid-payment-method.US1-TC9
21. Enter `<low maximum>` in the custom maximum on the bid panel.
22. Click the bid action.
23. Read the bid form and the linked card on the bid panel.
   - Step 23: the bid form names the minimum next bid `<minimum next bid>`, and Change is still offered on the linked card. g10.auction-bid-payment-method.US1-TC10
24. Click Change on the linked card.
   - Step 24 opens card-link setup. g10.auction-bid-payment-method.US1-TC10

## Walk 2: Collector raises a bid on the same card and adjacent checks

**Starting state:**

- customer(signed in, leads `<listing_22>` at `<current maximum>` on `<linked card>`) is on `<listing_22 url>`.
- customer(signed in, no bid on `<listing_26>`) is on `<listing_26 url>`.
- The bid panel's premium disclosure is rendered for `<listing_28>`, an open listing in `<currency>`.

**Shared test data:**

| Case | Field | Value | Fixture notes |
| --- | --- | --- | --- |
| g10.auction-bid-payment-method.US2-TC1 | listing_22 | An open listing taking bids, led by this collector on `<linked card>`; bind its identity only | · |
| g10.auction-bid-payment-method.US2-TC1 | linked card | The seeded linked Visa card; bind its card identity only | 4242 4242 4242 4242. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |
| g10.auction-bid-payment-method.US2-TC1 | current maximum | The collector's current maximum on `<listing_22>`; bind its amount only | · |
| g10.auction-bid-payment-method.US2-TC1 | raised maximum | A maximum above `<current maximum>`; bind its amount only | · |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-bid-payment-method.US2-TC1 | listing_22 url | The URL of `<listing_22>`; bind its URL only |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-bid-payment-method.US4-TC1 | listing_26 | An open USD listing taking bids; bind its identity only |
| g10.auction-bid-payment-method.US4-TC1 | next bid | The next valid bid shown on the bid panel; bind its amount only |

| Case | Field | Value | Fixture notes |
| --- | --- | --- | --- |
| g10.auction-bid-payment-method.US4-TC1 | premium rate | 20% | (fixed configured rate) |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-bid-payment-method.US4-TC1 | listing_26 url | The URL of `<listing_26>`; bind its URL only |

| Case | `<currency>` | `<premium disclosure>` |
| --- | --- | --- |
| g10.auction-bid-payment-method.US4-TC2 | USD | 20% of the winning bid |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-bid-payment-method.US4-TC2 | listing_28 | An open listing priced in `<currency>`; bind its identity only |

### Route

1. Enter `<raised maximum>` in the bid panel.
2. Click the bid action.
   - Step 2: no card choice is asked for. g10.auction-bid-payment-method.US2-TC1
3. Read the bid panel.
   - Step 3: the panel shows `<raised maximum>` at once, with no authorizing state before it. g10.auction-bid-payment-method.US2-TC1
4. Read the collector's card activity at the card provider.
   - Step 4: nothing is held or charged on `<linked card>` for `<listing_22>`. g10.auction-bid-payment-method.US2-TC1
5. Read the bid panel, under the bid action.
   - Step 5: the buyer's premium reads `<premium rate>` of the winning bid, not behind a tooltip. g10.auction-bid-payment-method.US4-TC1
6. Enter `<next bid>` in the bid panel without placing it.
   - Step 6: no premium amount and no invoice total show. g10.auction-bid-payment-method.US4-TC1
7. Render the premium disclosure for `<currency>`.
   - The premium disclosure reads `<premium disclosure>`. g10.auction-bid-payment-method.US4-TC2
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

* customer(signed in, no linked card) is on `<listing_2 url>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_2 | An open listing taking bids, with no bid from this collector; bind its identity only |
| listing_2 url | The URL of `<listing_2>`; bind its URL only |
| my auctions url | The My Auctions URL; bind its URL only |

**Steps:**

1. Read the amount controls on the bid panel.
2. Click the bid action.
3. Close the setup modal without linking a card.
4. Reload `<listing_2 url>` and read Highest bid and the bid count.
5. Navigate to `<my auctions url>` and look for `<listing_2>`.

**Expected Results:**

* Step 1: the quick bids and the custom maximum show, disabled.
* Step 2 opens card-link setup, the bid form asks for a card, and no bid is placed.
* Step 4: Highest bid and the bid count are unchanged, and no bid of this collector's is on `<listing_2>`.
* Step 5 shows no row for `<listing_2>`.

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

* customer(signed in, `<linked card>` on file, no bid on `<listing_4>`) is on `<listing_4 url>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_4 | An open listing taking bids, with no bid from this collector and no other bidder; bind its identity only | · |
| linked card | The seeded linked Visa card; bind its card identity only | 4242 4242 4242 4242. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |
| maximum | A maximum above the next valid bid, within the collector's bidding limits; bind its amount only | · |

| Field | Value |
| --- | --- |
| listing_4 url | The URL of `<listing_4>`; bind its URL only |

**Steps:**

1. Enter `<maximum>` in the custom maximum on the bid panel.
2. Click the bid action.
3. Read the bid panel.
4. Read the linked card's activity at the card provider.

**Expected Results:**

* Step 2: no confirmation or payment-method modal opens.
* Step 3: the panel shows the collector leading at `<maximum>`, in the one answer, with no authorizing state before it.
* Step 4: nothing is held or charged on `<linked card>`.

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

* customer(signed in, `<linked card>` linked on `<listing_6>`, no bid on `<listing_7>`) is on `<listing_7 url>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_7 | An open listing taking bids, not bid on by this collector; bind its identity only | · |
| linked card | The seeded linked Visa card; bind its card identity only | 4242 4242 4242 4242. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |
| next bid | The next valid bid shown on the bid panel; bind its amount only | · |

| Field | Value |
| --- | --- |
| listing_6 | A different earlier listing where this collector linked `<linked card>`; bind its identity only |
| listing_7 url | The URL of `<listing_7>`; bind its URL only |

**Steps:**

1. Enter `<next bid>` in the bid panel.
2. Click the bid action.
3. Read the bid panel's linked card.
4. Read the linked card's activity at the card provider.

**Expected Results:**

* No card choice is asked for, and the bid is accepted.
* Step 3 shows `<linked card>`, with Change no longer offered.
* Step 4: nothing is held or charged on `<linked card>` for `<listing_7>`.

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

* customer A(card linked) leads `<listing_8>` with maximum `<customer A maximum>`, and is signed in.
* customer B(card linked) holds maximum `<customer B maximum>`, lower than `<customer A maximum>`, on `<listing_8>`.
* `<listing_8>`'s close is under a minute away, and no further bid will be placed.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_8 | An open USD listing led by customer A; bind its identity only | · |
| customer A maximum | USD8,400 | (range: 800000–3999999 minor units) |

| Field | Value |
| --- | --- |
| customer B maximum | The accepted maximum of customer B on `<listing_8>`, below `<customer A maximum>`; bind its amount only |
| winner_order_1 | The winner order for customer A on `<listing_8>` after the close is recorded; bind its order identity only |

**Steps:**

1. Wait until `<listing_8>` is recorded closed with customer A winning.
2. Read customer A's and customer B's card activity at the card provider.
3. As customer A, open `<winner_order_1>` from View order on My Auctions.
4. Start paying the invoice by card.

**Expected Results:**

* Step 2: nothing is held or charged on either card, by the bids or by the close.
* Step 4 opens the provider's hosted Checkout for `<winner_order_1>`'s invoice.

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

* customer(signed in) placed the first accepted bid on `<listing_10>` with `<linked card>`, and leads it at `<locked maximum>`.
* customer has also linked `<replacement card>`, different from `<linked card>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_10 | An open listing taking bids, led by this collector; bind its identity only | · |
| linked card | The seeded linked Visa card; bind its card identity only | 4242 4242 4242 4242, the card `<listing_10>` is locked to. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |
| replacement card | The seeded linked card different from `<linked card>`; bind its card identity only | 5555 5555 5555 4444. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |
| locked maximum | The collector's maximum on `<listing_10>`; bind its amount only | · |
| replacement maximum | A maximum above `<locked maximum>`; bind its amount only | · |

**Steps:**

1. Submit `<replacement maximum>` on `<listing_10>` with `<replacement card>`.
2. Read the API response.
3. Read `<listing_10>`'s current bid, the leader and the collector's maximum.

**Expected Results:**

* Step 2 refuses the bid because the listing's card is locked.
* Step 3: the current bid and leader are unchanged, and the collector's maximum stays `<locked maximum>` on `<linked card>`.

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

* customer(signed in, card linked, no bid on `<listing_12>`) is on `<listing_12 url>`.
* The listing has current bid `<current bid>` and minimum next bid `<minimum next bid>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_12 | An open USD listing, current bid `<current bid>`, minimum next bid `<minimum next bid>`; bind its identity only | · |
| low maximum | USD282 | (range: 1000–79999 minor units), below the minimum next bid |
| current bid | USD280 | (range: 1000–79999 minor units) |
| minimum next bid | USD285 | (range: 1000–79999 minor units) |

| Field | Value |
| --- | --- |
| listing_12 url | The URL of `<listing_12>`; bind its URL only |

**Steps:**

1. Enter `<low maximum>` in the custom maximum on the bid panel.
2. Click the bid action.
3. Read the bid form and the linked card on the bid panel.
4. Click Change on the linked card.

**Expected Results:**

* Step 3: the bid form names the minimum next bid `<minimum next bid>`, and Change is still offered on the linked card.
* Step 4 opens card-link setup.

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

---

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

* customer(signed in, leads `<listing_22>` at `<current maximum>` on `<linked card>`) is on `<listing_22 url>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_22 | An open listing taking bids, led by this collector on `<linked card>`; bind its identity only | · |
| linked card | The seeded linked Visa card; bind its card identity only | 4242 4242 4242 4242. Any future expiry, such as 12/34, any 3-digit CVC, and any postal code |
| current maximum | The collector's current maximum on `<listing_22>`; bind its amount only | · |
| raised maximum | A maximum above `<current maximum>`; bind its amount only | · |

| Field | Value |
| --- | --- |
| listing_22 url | The URL of `<listing_22>`; bind its URL only |

**Steps:**

1. Enter `<raised maximum>` in the bid panel.
2. Click the bid action.
3. Read the bid panel.
4. Read the collector's card activity at the card provider.

**Expected Results:**

* Step 2: no card choice is asked for.
* Step 3: the panel shows `<raised maximum>` at once, with no authorizing state before it.
* Step 4: nothing is held or charged on `<linked card>` for `<listing_22>`.

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

* customer(signed in, no bid on `<listing_26>`) is on `<listing_26 url>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_26 | An open USD listing taking bids; bind its identity only |
| next bid | The next valid bid shown on the bid panel; bind its amount only |

| Field | Value | Fixture notes |
| --- | --- | --- |
| premium rate | 20% | (fixed configured rate) |

| Field | Value |
| --- | --- |
| listing_26 url | The URL of `<listing_26>`; bind its URL only |

**Steps:**

1. Read the bid panel, under the bid action.
2. Enter `<next bid>` in the bid panel without placing it.

**Expected Results:**

* Step 1: the buyer's premium reads `<premium rate>` of the winning bid, not behind a tooltip.
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

* The bid panel's premium disclosure is rendered for `<listing_28>`, an open listing in `<currency>`.

**Test data:**

| `<currency>` | `<premium disclosure>` |
| --- | --- |
| USD | 20% of the winning bid |

| Field | Value |
| --- | --- |
| listing_28 | An open listing priced in `<currency>`; bind its identity only |

**Steps:**

1. Render the premium disclosure for `<currency>`.

**Expected Results:**

* The premium disclosure reads `<premium disclosure>`.
* No currency amount appears in it.

## Settled

- `g10.auction-bid-payment-method.US3` is retired by `refused-bid-is-not-a-bid`; its deprecated case content is removed from the durable suite.
- Retired marker IDs folded here: `g10.auction-bid-payment-method.TC-txz`

## Reconciliation

**Run:** 2026-09-24; scenario and suite readings were reconciled by the author.

- **Uncovered anchors:** none. Provider option flags and the returned authorization deadline are covered by the Stripe adapter and backend verification lanes, not by a customer walk.

**Run:** QA2, 2026-10-03. QA1's blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md`, the linked pages under `docs/prds/`, and the durable suite and the change's domain draft with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read QA1's suites, the delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites on main after `my-auctions-without-bid-holds` was accepted, and grade10 main's bidding, history, erasure and refusal-copy code and tests. It is a statement, not proof.

- **Folded in** - a commit with no linked card by `g10.auction-bid-payment-method.US1-TC1`; a later bid on the same card by `g10.auction-bid-payment-method.US2-TC1`; a linked card on a new listing by `g10.auction-bid-payment-method.US1-TC6`; bidding takes nothing from the card by `g10.auction-bid-payment-method.US1-TC2` and `g10.auction-bid-payment-method.US2-TC1`; a bidder who does not win is never charged by `g10.auction-bid-payment-method.US1-TC7`; another card after the first accepted bid by `g10.auction-bid-payment-method.US1-TC9`
- **Added by QA2** - `g10.auction-bid-payment-method.US1-TC10`: a refused first bid locks no card and Change stays offered. No blind case refused a first bid on a linked card
- **Corrected** - `g10.auction-bid-payment-method.US1-TC8` and `g10.auction-bid-payment-method.US1-TC9` traced the Feature set group Card refusals; they trace their section's journey, `grade10-site-auction-bid-payment-method-US-01`. The markers of the revised cases drop the retired authorization scenarios, and those reading nothing taken from the card cover bidding taking nothing from the card
- **Deprecated** - `g10.auction-bid-payment-method.US1-TC3`, `g10.auction-bid-payment-method.US1-TC4`, `g10.auction-bid-payment-method.US1-TC5`, `g10.auction-bid-payment-method.US2-TC2` and `g10.auction-bid-payment-method.US3-TC1`, with the authorization requirements and `grade10-site-auction-bid-payment-method-US-03`
- **Settled by the artifacts** - a raise from a stale page that still names the locked card is accepted; only a bid naming another card is refused as locked (the requirement)
- **Raised** - none
- **Retired** - the card authorization on commit leaves the renamed requirement on the linked card; the scenarios of the removed requirements retire as their migrations name. No retired id is reissued
- **Contradicted** - none
- **Uncovered anchors** - none

**Run:** Independent QA2, 2026-10-14. This pass read the frozen QA1 bundle, current PRD, decisions, journeys, delta requirements, technical design, tasks, durable baseline and existing cases.

- **Anchors:** The active linked-card journeys US-01 and US-02 retain actual cases. The changed premium-disclosure journey US-04 has two draft cases. Existing deprecated cases remain historical.
- **Coverage:** TC-lbz rev2 fully asserts premium rate disclosure on the bid panel and covers SC-x21. TC-nvs rev2 fully asserts the universal USD rate and covers SC-oeb, including no HKD or JPY rate. Both cases remain draft; no execution or approval is claimed.
- **Settled behavior:** The bid panel shows the fixed 20% rate without a premium amount or invoice total. The examples retain only USD bidding. The linked card funds remain used for bid acceptance as the durable contract says.
- **Blind QA1 and Dev:** QA1 checked the fresh physical input bundle with manifest digest `852597efc39b627e7bfdea8bc3d229a253a91404ac60d030951c862b4e97411b`; all 22 hashes matched and the pass made no edits. Dev found no product-source gap.
