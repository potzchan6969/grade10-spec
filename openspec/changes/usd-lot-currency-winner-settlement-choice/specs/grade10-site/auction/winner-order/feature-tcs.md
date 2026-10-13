# grade10-site/auction/winner-order Test Cases

**Status:** pending-review · 0/38
**Drafts styled:** 2026-10-13, tcs-rules r5
**Out of suite:** winner-order-SC-04, winner-order-SC-05, winner-order-SC-38, winner-order-SC-39, winner-order-SC-62, winner-order-SC-63, winner-order-SC-69, winner-order-SC-94, winner-order-SC-96, winner-order-SC-110, winner-order-SC-111, winner-order-SC-180, winner-order-SC-184, winner-order-SC-214, winner-order-SC-215, winner-order-SC-216, winner-order-SC-249, winner-order-SC-257, winner-order-SC-287, winner-order-SC-26, winner-order-SC-27, winner-order-SC-28

## g10.auction-winner-order.US8: Winner pays an invoice with a policy premium

**As a** winner of an auction lot,
**I want** my invoice to calculate the stated buyer premium correctly using the current currency minimum,
**so that** the amount I pay is explainable and collectible.

<!-- trace:case id=g10.auction-winner-order.TC-n3p rev=2 covers=g10.auction-winner-order.SC-zhu,g10.auction-winner-order.SC-30s -->
### g10.auction-winner-order.US8-TC1: The invoice charges 20% of the winning bid as premium

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-08

**Pre-conditions:**

* The USD premium minimum is 0.
* An invoice is created for `<order_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_1>` | A USD order won at `<winning bid>` |
| `<winning bid>` | USD150 (range: 8000-399999 minor units) |
| `<premium>` | USD30.00: 20% of `<winning bid>` |

**Steps:**

1. Read the API response for `<order_1>`'s invoice.

**Expected Results:**

* Buyer's premium is `<premium>`.
* The total includes `<premium>`.
* The premium is read in USD, with no other currency.

<!-- trace:case id=g10.auction-winner-order.TC-zt4 rev=2 covers=g10.auction-winner-order.SC-b16 -->
### g10.auction-winner-order.US8-TC2: The one USD minimum above 20% becomes the premium

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-08

**Pre-conditions:**

* The USD premium minimum is `<minimum>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<minimum>` | USD20 (fixed configured value) |
| `<winning bid>` | USD7 (fixed fixture) |
| 20% of `<winning bid>` | USD1.40 (fixed derived value) |

**Steps:**

1. Compute the premium for `<winning bid>`.

**Expected Results:**

* The premium is `<minimum>`, not 20% of `<winning bid>`.

<!-- trace:case id=g10.auction-winner-order.TC-dd3 rev=2 covers=g10.auction-winner-order.SC-2mz -->
### g10.auction-winner-order.US8-TC3: With a zero minimum, 20% is rounded half up

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-08

**Pre-conditions:**

* The USD premium minimum is 0.

**Test data:**

| Field | Value |
| --- | --- |
| `<winning bid>` | USD10.03 (fixed boundary: 20% is a half minor unit away from a whole one) |
| `<premium>` | USD2.01: 20% is 200.6 minor units, rounded half up |

**Steps:**

1. Compute the premium for `<winning bid>`.

**Expected Results:**

* The premium is `<premium>`.

<!-- trace:case id=g10.auction-winner-order.TC-i06 rev=2 covers=g10.auction-winner-order.SC-ip8 -->
### g10.auction-winner-order.US8-TC4: A sent invoice keeps its premium when the minimum changes

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-08

**Pre-conditions:**

* `<order_2>`'s invoice was sent while the USD minimum was 0.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_2>` | A USD order won at USD7, invoice sent with premium `<sent premium>` |
| `<sent premium>` | USD1.40: 20% of USD7 |
| `<new minimum>` | USD20 (fixed configured value) |

**Steps:**

1. Set the USD premium minimum to `<new minimum>`.
2. Read the API response for `<order_2>`'s sent invoice.
3. Reissue `<order_2>`'s invoice.
4. Read the API response for the reissued invoice.

**Expected Results:**

* Step 2: the premium is still `<sent premium>`.
* Step 4: the premium is `<new minimum>`.

<!-- trace:case id=g10.auction-winner-order.TC-xji rev=1 -->
### g10.auction-winner-order.US8-TC5: An HKD order converts the premium, minimum included, with the premium

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
* **Trace:** winner-order-US-08

**Pre-conditions:**

* The USD premium minimum is `<minimum>` at send.
* customer(winner) holds `<order_hkd_min>`, settled in HKD, with its invoice sent.
* customer is on `<the winner's auction order url>` for `<order_hkd_min>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_hkd_min>` | An order won at USD5 (fixed fixture), 20% is USD1.00, settled in HKD |
| `<minimum>` | USD12.50 (fixed configured value) |
| `<premium USD>` | USD12.50: the minimum, higher than 20% |
| `<premium HKD>` | HK$99: USD12.50 x 7.85 is 98.125, rounded up |

**Steps:**

1. Read the invoice's Buyer's Premium.
2. Read Order Summary's Buyer's Premium line.

**Expected Results:**

* Step 1: Buyer's Premium reads `<premium HKD>`.
* Step 2: the line reads `<premium USD>`.
* The premium is not 20% of the winning bid: the minimum applies, then converts.

## g10.auction-winner-order.US9: Winner pays an invoice by bank transfer

**As a** winner who would rather not pay a card fee,
**I want** to choose bank transfer, see where to send the money and what reference to quote, and send Grade10 proof,
**so that** Grade10 can match my payment and my deadline stops while it is checked.

<!-- trace:case id=g10.auction-winner-order.TC-w18 rev=2 covers=g10.auction-winner-order.SC-bmm -->
### g10.auction-winner-order.US9-TC1: A bank-transfer invoice shows the picked rail and the reference

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Blocked:** Finance - the account details for each way are still open; Product - does the invoice PDF carry them?

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<order_bt>`.

**Test data:**

| Field | Value | Rail picked |
| --- | --- | --- |
| `<order_bt>` | An HKD order with a sent bank-transfer invoice, reading Pending Payment | FPS |
| `<order_bt>` | An HKD order with a sent bank-transfer invoice, reading Pending Payment | HK Local |
| `<order_bt>` | A USD order with a sent bank-transfer invoice, reading Pending Payment | International via SWIFT |

**Steps:**

1. Open the payment area.
2. Read the payment instructions.

**Expected Results:**

* The bank details of the row's rail show.
* No other rail's details show.
* The bank reference shows, with a copy control and a request to quote it.
* No card Pay is offered.

<!-- trace:case id=g10.auction-winner-order.TC-eu8 rev=2 covers=g10.auction-winner-order.SC-v59 -->
### g10.auction-winner-order.US9-TC22: The picked rail is recorded with the address where Grade10 holds bank details

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* Grade10 holds the sample bank details for each rail outside production, and Payment Settings holds a card fee rule in the row's currency.
* customer(winner) holds an auction order in the row's currency in Awaiting Setup.

**Test data:**

| Settlement currency | Rail |
| --- | --- |
| HKD | FPS |
| HKD | HK Local |
| USD | International via SWIFT |

**Steps:**

1. Choose the row's settlement currency.
2. Confirm a delivery address with the row's rail.
3. Reload the order.

**Expected Results:**

* Card and the row's rails were offered, none selected.
* The order records the row's rail, not a single bank transfer choice, and reads Preparing Invoice.

<!-- trace:case id=g10.auction-winner-order.TC-9v4 rev=3 covers=g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii -->
### g10.auction-winner-order.US9-TC24: HK Local and SWIFT details show their expanded fields

Runs once per row of **Test data**.

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) has View Bank Details open for `<pending_bank_transfer_order>`, whose picked rail is the row's rail.

**Test data:**

| Field | Value |
| --- | --- |
| `<pending_bank_transfer_order>` | An auction order whose invoice was sent for the row's rail and is pending |
| Row 1 | HKD order, HK Local |
| Row 2 | USD order, International via SWIFT |

**Steps:**

1. Read the bank details.

**Expected Results:**

* HK Local shows bank name, bank code, branch code, full account number including bank and branch code, then payment reference.
* SWIFT shows beneficiary name, beneficiary address, bank name, bank address, SWIFT/BIC, full account or IBAN, then payment reference, then the OUR charges note after the reference.
* Only the row's rail shows.

<!-- trace:case id=g10.auction-winner-order.TC-vvf rev=2 covers=g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-i03 -->
### g10.auction-winner-order.US9-TC32: View Bank Details opens on FPS with QR

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is signed in on `<the winner's auction order url>` for `<pending_bank_transfer_order>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<pending_bank_transfer_order>` | An HKD auction order whose invoice was sent for FPS and is pending |

**Steps:**

1. Open View Bank Details from Order summary.

**Expected Results:**

* FPS ID, account name and an FPS QR are shown.
* Amount due is shown without Copy.
* The bank reference is shown as a detail row without Copy at the bottom.
* No HK Local or SWIFT details are shown.

## g10.auction-winner-order.US3: Winner checks the buyer's premium on an invoice

**As a** winner,
**I want** the buyer's premium on my invoice to follow one published rule,
**so that** I can check what I am charged on top of my winning bid.

<!-- trace:case id=g10.auction-winner-order.TC-x85 rev=2 covers=g10.auction-winner-order.SC-2mz,g10.auction-winner-order.SC-ml2 -->
### g10.auction-winner-order.US3-TC5: The invoice's Buyer's Premium follows the published rule

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
* **Trace:** winner-order-US-03

**Pre-conditions:**

* customer(winner) won a lot at `<winning bid>`, settled in USD, and its invoice was sent.
* The USD premium minimum in Auction Payment settings is `<minimum>` at send.
* customer is on the order's Winner Order page.

**Test data:**

| Winning bid | Minimum | Buyer's Premium | Rule |
| --- | --- | --- | --- |
| USD1,350 (range: 80000-399999 minor units) | USD0 | USD270.00 | 20% of the winning bid |
| USD10.03 (fixed boundary) | USD0 | USD2.01 | 20% is 200.6 minor units, rounded half up |
| USD10.02 (fixed boundary) | USD0 | USD2.00 | 20% is 200.4 minor units, rounded half up |
| USD50 (fixed fixture) | USD20 (fixed configured value) | USD20.00 | The minimum, higher than 20% (USD10) |

**Steps:**

1. Read Order Summary.
2. Hover the Buyer's Premium info tooltip.

**Expected Results:**

* Step 1: the winning bid line reads `<winning bid>`.
* Step 1: Buyer's Premium reads the row's value.
* Step 1: the total equals the sum of the lines shown.
* Step 2: a brief tooltip explains Buyer's Premium.

## g10.auction-winner-order.US1: Winner settles a won lot

**As a** winner,
**I want** to tell Grade10 where to ship and how I will pay, then pay the invoice it sends me,
**so that** the lot I won becomes mine inside a deadline I can see, priced for where it is actually going.

<!-- trace:case id=g10.auction-winner-order.TC-4dz rev=2 covers=g10.auction-winner-order.SC-pt5 -->
### g10.auction-winner-order.US1-TC50: The method can change until the winner confirms

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds a card fee rule in USD and in HKD.
* customer(winner) holds an auction order in HKD in Awaiting Setup, with card chosen and not yet confirmed.

**Steps:**

1. Change the choice to FPS.
2. Confirm the home address.
3. Reload the order.

**Expected Results:**

* The order records FPS, not card.
* The order reads Preparing Invoice.

<!-- trace:case id=g10.auction-winner-order.TC-csb rev=2 covers=g10.auction-winner-order.SC-7y2,g10.auction-winner-order.SC-vbp -->
### g10.auction-winner-order.US1-TC52: A currency with no card fee rule reads card as not yet available

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds no card fee rule in the row's currency.
* customer(winner) holds an auction order in the row's currency in Awaiting Setup.

**Test data:**

| Settlement currency | Rails offered |
| --- | --- |
| HKD | FPS, HK Local |
| USD | HK Local, International via SWIFT |

**Steps:**

1. Choose the home address and the row's settlement currency, and reach the payment method choice.
2. Try to choose card.
3. Send Grade10 a setup confirmation carrying the home address and card.
4. Reload the order.

**Expected Results:**

* Card reads that it is not yet available in the row's currency, and cannot be chosen.
* The row's rails are offered.
* Grade10 refuses the confirmation.
* The order holds no delivery address and no method.

---

## g10.auction-winner-order.US24: Winner chooses the currency they pay in

**As a** winner of a lot bid in USD,
**I want** to settle in USD or HKD when I set the order up,
**so that** I pay in the currency my money is already in.

<!-- trace:case id=g10.auction-winner-order.TC-ayp rev=1 covers=g10.auction-winner-order.SC-o92 -->
### g10.auction-winner-order.US24-TC1: Order setup offers USD and HKD with neither chosen

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-24

**Pre-conditions:**

* customer(winner) holds `<order_1>` in Awaiting Setup with a saved home address.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_1>` | An order won in USD, in Awaiting Setup |

**Steps:**

1. Open `<the winner's auction order url>` for `<order_1>`.
2. Start setup and choose the home address.
3. Read the settlement currency choice.

**Expected Results:**

* USD and HKD are offered.
* No other currency is offered.
* Neither is selected.

<!-- trace:case id=g10.auction-winner-order.TC-79a rev=1 covers=g10.auction-winner-order.SC-8c6 -->
### g10.auction-winner-order.US24-TC2: The picked currency is the currency of the invoice

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
* **Trace:** winner-order-US-24

**Pre-conditions:**

* Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds a card fee rule in USD and in HKD.
* customer(winner) holds `<order_1>` in Awaiting Setup with a saved home address.
* admin(operator with payment processing) can send `<order_1>`'s invoice.

**Test data:**

| Settlement currency | Rail |
| --- | --- |
| USD | HK Local |
| HKD | FPS |

**Steps:**

1. Choose the row's settlement currency and the row's rail, and confirm the home address.
2. As the admin, send the invoice.
3. As the winner, read the order's invoice and total.

**Expected Results:**

* The order records the row's currency.
* The invoice, its lines and its total read in the row's currency.
* On the USD row no HKD amount appears.

<!-- trace:case id=g10.auction-winner-order.TC-8ea rev=1 covers=g10.auction-winner-order.SC-k63 -->
### g10.auction-winner-order.US24-TC3: The currency cannot change once the invoice is sent

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
* **Trace:** winner-order-US-24

**Pre-conditions:**

* `<order_3>` is settled in USD and its invoice was sent.
* customer(winner) holds `<order_3>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_3>` | An order settled in USD with a sent invoice |

**Steps:**

1. Open `<the winner's auction order url>` for `<order_3>`.
2. Look for a control to change the settlement currency.
3. Send Grade10 a request to change the order to HKD.
4. Read the order.

**Expected Results:**

* Step 2: no control to change the currency is offered.
* Step 3: the request is refused.
* Step 4: the order and its invoice still read USD.

<!-- trace:case id=g10.auction-winner-order.TC-a61 rev=1 covers=g10.auction-winner-order.SC-j1l -->
### g10.auction-winner-order.US24-TC4: A confirmation with no currency is refused

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
* **Trace:** winner-order-US-24

**Pre-conditions:**

* Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds a card fee rule in USD and in HKD.
* customer(winner) holds `<order_4>` in Awaiting Setup with a saved home address.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_4>` | An order won in USD, in Awaiting Setup |

**Steps:**

1. Choose the home address as the delivery address and as the billing address, and choose no settlement currency.
2. Send Grade10 a setup confirmation carrying both addresses and no currency.
3. Reload `<order_4>`.

**Expected Results:**

* Step 2 is refused.
* Step 3 reads the order in Awaiting Setup, holding no delivery address, no currency and no method.

<!-- trace:case id=g10.auction-winner-order.TC-x0r rev=1 covers=g10.auction-winner-order.SC-lq9 -->
### g10.auction-winner-order.US24-TC5: Confirming with HKD records HKD and the order reads Preparing Invoice

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
* **Trace:** winner-order-US-24

**Pre-conditions:**

* Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds a card fee rule in USD and in HKD.
* customer(winner) holds `<order_5>` in Awaiting Setup with a saved home address.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_5>` | An order won in USD, in Awaiting Setup |
| Currency | HKD |
| Method | FPS |

**Steps:**

1. Open `<the winner's auction order url>` for `<order_5>`.
2. Choose the home address, choose HKD and choose FPS.
3. Confirm the home address.
4. Reload `<order_5>`.

**Expected Results:**

* Step 3 is accepted.
* Step 4 reads HKD as the order's settlement currency.
* Step 4 reads the order as Preparing Invoice.

<!-- trace:case id=g10.auction-winner-order.TC-flb rev=1 covers=g10.auction-winner-order.SC-rau -->
### g10.auction-winner-order.US24-TC6: An operator corrects the currency before send, and the winner still cannot write it
**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-24

**Pre-conditions:**

* admin(operator with payment-processing) holds `<order_6>` in Preparing Invoice, whose winner confirmed HKD and bank transfer on HK Local.
* customer(winner) holds `<order_6>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_6>` | An order in Preparing Invoice, settled in HKD by bank transfer on HK Local |

**Steps:**

1. As the operator, change the settlement currency to USD with the reason `Winner picked the wrong currency`.
2. As the winner, open `<the winner's auction order url>` for `<order_6>` and read the order.
3. As the winner, send Grade10 a request to change the currency to HKD.
4. Read the order again.

**Expected Results:**

* Step 1: the order records USD and still reads Preparing Invoice.
* Step 2: Winner Order reads in USD and offers no control to change the currency.
* Step 3: the request is refused.
* Step 4: the order still reads USD.

<!-- trace:case id=g10.auction-winner-order.TC-r4x rev=1 covers=g10.auction-winner-order.SC-d84 -->
### g10.auction-winner-order.US24-TC7: A reissue in the other currency prices the new invoice from the USD amounts and leaves the replaced one
**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-24

**Pre-conditions:**

* admin(operator with payment-processing) holds `<order_7>`, whose pending invoice was sent in HKD for bank transfer on HK Local.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_7>` | An order won at `<winning bid>`, with a pending HKD invoice |
| `<winning bid>` | USD100.00 (fixed derived value), 10000 minor units |
| `<winning bid HKD>` | HKD785.00 (fixed derived value), 78500 minor units |

**Steps:**

1. Reissue the invoice in USD, keeping HK Local, with a reason.
2. Read the new invoice's Winning Bid.
3. Read the replaced invoice in the order's invoice history.

**Expected Results:**

* The new invoice's Winning Bid reads `<winning bid>` in USD, with no conversion.
* The replaced invoice still reads its Winning Bid in HKD, `<winning bid HKD>`.

---

## g10.auction-winner-order.US25: Winner picks a payment method their currency offers

**As a** winner who has picked a settlement currency,
**I want** to see only the payment methods that currency offers, with each Hong Kong and overseas bank rail named,
**so that** I choose a way to pay that works for the account I will send it from.

<!-- trace:case id=g10.auction-winner-order.TC-52z rev=1 covers=g10.auction-winner-order.SC-oyi,g10.auction-winner-order.SC-crs -->
### g10.auction-winner-order.US25-TC1: Each currency offers its own methods and each rail is its own choice

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-25

**Pre-conditions:**

* Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds a card fee rule in USD and in HKD.
* customer(winner) holds an auction order in Awaiting Setup with a saved home address.

**Test data:**

| Settlement currency | Methods offered |
| --- | --- |
| HKD | Card, FPS, HK Local |
| USD | Card, HK Local, International via SWIFT |

**Steps:**

1. Choose the home address and the row's settlement currency.
2. Read the payment method choice.

**Expected Results:**

* Exactly the row's methods are offered.
* No choice reads bank transfer as one method.
* No method is selected.

<!-- trace:case id=g10.auction-winner-order.TC-7j7 rev=1 covers=g10.auction-winner-order.SC-4lj -->
### g10.auction-winner-order.US25-TC2: Switching currency clears a method the new currency does not offer

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-25

**Pre-conditions:**

* Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds a card fee rule in USD and in HKD.
* customer(winner) holds an auction order in Awaiting Setup with a saved home address.

**Test data:**

| First currency | Method | Second currency |
| --- | --- | --- |
| HKD | FPS | USD |
| USD | International via SWIFT | HKD |

**Steps:**

1. Choose the row's first currency and its method.
2. Change the settlement currency to the row's second currency.
3. Read the payment method choice.

**Expected Results:**

* The method chosen before the switch is no longer selected.
* The second currency's methods are offered.

<!-- trace:case id=g10.auction-winner-order.TC-vje rev=1 covers=g10.auction-winner-order.SC-4lj -->
### g10.auction-winner-order.US25-TC3: A confirmation after a switch that cleared the method is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-25

**Pre-conditions:**

* Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds a card fee rule in USD and in HKD.
* customer(winner) holds `<order_6>` in Awaiting Setup with a saved home address.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_6>` | An order won in USD, in Awaiting Setup |

**Steps:**

1. Choose the home address, choose USD and choose International via SWIFT.
2. Change the settlement currency to HKD.
3. Read the payment method choice.
4. Confirm the home address without choosing a method.
5. Reload `<order_6>`.

**Expected Results:**

* Step 3: no method is selected.
* Step 4 is refused.
* Step 5 reads the order in Awaiting Setup, holding no delivery address, no currency and no method.

<!-- trace:case id=g10.auction-winner-order.TC-rwy rev=1 covers=g10.auction-winner-order.SC-6un -->
### g10.auction-winner-order.US25-TC4: A method both currencies offer stays selected after a switch

Runs once per row of **Test data**.

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
* **Trace:** winner-order-US-25

**Pre-conditions:**

* Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds a card fee rule in USD and in HKD.
* customer(winner) holds `<order_7>` in Awaiting Setup with a saved home address.

**Test data:**

| First currency | Method | Second currency |
| --- | --- | --- |
| USD | HK Local | HKD |
| HKD | HK Local | USD |

**Steps:**

1. Choose the home address, the row's first currency and the row's method.
2. Change the settlement currency to the row's second currency.
3. Read the payment method choice.

**Expected Results:**

* HK Local is still selected.
* The second currency's methods are offered.

<!-- trace:case id=g10.auction-winner-order.TC-2ac rev=1 covers=g10.auction-winner-order.SC-rge -->
### g10.auction-winner-order.US25-TC5: A confirmation carrying a method the currency does not offer is refused

Runs once per row of **Test data**.

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
* **Trace:** winner-order-US-25

**Pre-conditions:**

* Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds a card fee rule in USD and in HKD.
* customer(winner) holds `<order_8>` in Awaiting Setup with a saved home address.

**Test data:**

| Settlement currency | Rail sent | Why this row |
| --- | --- | --- |
| USD | FPS | FPS is offered in HKD only |
| HKD | International via SWIFT | SWIFT is offered in USD only |

**Steps:**

1. Choose the home address and the row's settlement currency.
2. Send Grade10 a setup confirmation carrying the home address and the row's rail.
3. Reload `<order_8>`.

**Expected Results:**

* Step 2 is refused.
* Step 3 reads the order in Awaiting Setup, holding no delivery address, no currency and no method.

<!-- trace:case id=g10.auction-winner-order.TC-jfi rev=1 covers=g10.auction-winner-order.SC-8dl -->
### g10.auction-winner-order.US25-TC6: Each HKD method reads its fee wording and none is selected

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
* **Trace:** winner-order-US-25

**Pre-conditions:**

* Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds a card fee rule in HKD.
* customer(winner) holds `<order_9>` in Awaiting Setup with a saved home address.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_9>` | An order won in USD, in Awaiting Setup |

**Steps:**

1. Choose the home address and HKD.
2. Read each method in the payment method choice.

**Expected Results:**

* Card reads `Card fee about 3.4% + a fixed amount`.
* FPS and HK Local each read `Bank fee set on your invoice`, naming no amount.
* No method is selected.

<!-- trace:case id=g10.auction-winner-order.TC-pes rev=1 covers=g10.auction-winner-order.SC-1aa,g10.auction-winner-order.SC-er5 -->
### g10.auction-winner-order.US25-TC7: A bank rail is offered only where Grade10 holds its bank details

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-25

**Pre-conditions:**

* Payment Settings holds a card fee rule in HKD.
* customer(winner) holds `<order_10>` in Awaiting Setup with a saved home address.

**Test data:**

| Where | Bank details Grade10 holds | Methods offered | Rail sent |
| --- | --- | --- | --- |
| Outside production | HK Local only | Card, HK Local | FPS |
| Production, before Finance confirms an account | None | Card | FPS |

**Steps:**

1. Choose the home address and HKD, and read the payment method choice.
2. Send Grade10 a setup confirmation carrying the home address and the row's rail.
3. Reload `<order_10>`.

**Expected Results:**

* Step 1 offers exactly the row's methods.
* FPS is not offered.
* Step 2 is refused.
* Step 3 reads the order holding no delivery address and no method.

<!-- trace:case id=g10.auction-winner-order.TC-a8g rev=1 covers=g10.auction-winner-order.SC-o4y -->
### g10.auction-winner-order.US25-TC8: The card fee range reads the percentage of the currency picked
**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-25

**Pre-conditions:**

* Payment Settings holds a USD card fee rule of `<usd rate>` and an HKD card fee rule of `<hkd rate>`.
* customer(winner) holds `<order_8>` in Awaiting Setup with a saved home address.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_8>` | An order won in USD, in Awaiting Setup |
| `<usd rate>` | 4.4% and a fixed amount (fixed configured value) |
| `<hkd rate>` | 3.4% and a fixed amount (fixed configured value) |

**Steps:**

1. Choose USD and read the card choice.
2. Switch to HKD and read the card choice.

**Expected Results:**

* Step 1: card reads `Card fee about 4.4% + a fixed amount`.
* Step 2: card reads `Card fee about 3.4% + a fixed amount`.

---

## g10.auction-winner-order.US26: Winner who settles in HKD reads the invoice and receipt in HKD

**As a** winner who picked HKD,
**I want** every amount on my invoice, receipt and order letters in HKD,
**so that** I pay and keep records in one currency without working out a rate.

<!-- trace:case id=g10.auction-winner-order.TC-ac5 rev=1 covers=g10.auction-winner-order.SC-buj,g10.auction-winner-order.SC-ekn,g10.auction-winner-order.SC-tmf -->
### g10.auction-winner-order.US26-TC1: An HKD invoice reads every amount in HKD, each line rounded up then summed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-26

**Pre-conditions:**

* The USD premium minimum is USD0.
* customer(winner) is on `<the winner's auction order url>` for `<order_hkd>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_hkd>` | A lot won at `<winning bid>`, settled in HKD by FPS, with Shipping & Handling `<shipping>`, invoice sent |
| `<winning bid>` | USD250 (fixed fixture): USD250 x 7.85 is 1962.5, rounded up to HK$1,963 |
| `<premium>` | USD50 (fixed derived value): 20% of `<winning bid>`, premium minimum USD0; HK$393 after rounding up 392.5 |
| `<shipping>` | USD12 (fixed fixture): HK$95 after rounding up 94.2 |
| `<total HKD>` | HK$2,451: 1,963 + 393 + 95, each line rounded up, then summed |
| Whole-total value | HK$2,450: USD312 x 7.85 is 2449.2, rounded up (the wrong total) |

**Steps:**

1. Open the invoice.
2. Read Buyer's Premium, Shipping & Handling and the total.

**Expected Results:**

* Buyer's Premium reads HK$393 and Shipping & Handling reads HK$95.
* The total reads `<total HKD>`, not the whole-total value.
* Every amount reads in HKD, and no USD amount appears.
* No USD winning bid is printed.

<!-- trace:case id=g10.auction-winner-order.TC-nf6 rev=1 covers=g10.auction-winner-order.SC-vvm -->
### g10.auction-winner-order.US26-TC2: An HKD receipt reads in HKD and prints no USD winning bid

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
* **Trace:** winner-order-US-26

**Pre-conditions:**

* customer(winner) is on `<the winner's auction order url>` for `<order_hkd_paid>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_hkd_paid>` | An order settled in HKD whose invoice of `<total HKD>` was paid in full |
| `<total HKD>` | HK$2,451 (fixed derived value) |

**Steps:**

1. Open the receipt for the payment.
2. Read the receipt's amounts.

**Expected Results:**

* Every amount reads in HKD.
* The amount paid reads `<total HKD>` and the amount left reads zero.
* No USD winning bid is printed.

<!-- trace:case id=g10.auction-winner-order.TC-9dm rev=1 covers=g10.auction-winner-order.SC-vvm -->
### g10.auction-winner-order.US26-TC3: Order letters of an HKD order carry HKD amounts

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
* **Trace:** winner-order-US-26

**Pre-conditions:**

* Grade10 sent letters about `<order_hkd>`, which is settled in HKD and has a sent invoice.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_hkd>` | An order settled in HKD with a sent invoice of HK$2,451 |

**Steps:**

1. Read each letter Grade10 sent for `<order_hkd>`.

**Expected Results:**

* Every amount in every letter sent after the winner picked HKD reads in HKD.
* No letter sent after the winner picked HKD prints a USD winning bid or a conversion rate.
* The won-lot letter, sent at the close before any currency was picked, names the winning bid in US$.

<!-- trace:case id=g10.auction-winner-order.TC-q56 rev=1 -->
### g10.auction-winner-order.US26-TC4: A refund on an HKD order reads in HKD

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
* **Trace:** winner-order-US-26

**Pre-conditions:**

* customer(winner) is on `<the winner's auction order url>` for `<order_hkd_refunded>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_hkd_refunded>` | An order settled in HKD, paid in full, with a part refund `<refund>` |
| `<refund>` | HK$100 (any whole HK$ amount below the amount paid) |

**Steps:**

1. Read the order's refund.

**Expected Results:**

* The refund reads `<refund>` in HKD.
* No USD amount appears beside it.

<!-- trace:case id=g10.auction-winner-order.TC-3ly rev=1 covers=g10.auction-winner-order.SC-qtr -->
### g10.auction-winner-order.US26-TC5: The card fee of an HKD order comes from the HKD rule

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
* **Trace:** winner-order-US-26

**Pre-conditions:**

* Payment Settings holds a USD card fee rule of 4.4% and USD0.30, and an HKD card fee rule of 3.4% and HK$2.35.
* `<order_card>` is settled in HKD by card, with its invoice sent.
* customer(winner) is on `<the winner's auction order url>` for `<order_card>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_card>` | A lot won at USD100 (fixed fixture), settled in HKD by card, premium minimum USD0, no other lines |
| HKD Subtotal | HK$942 (fixed derived value): HK$785 bid + HK$157 premium, no rounding needed |

**Steps:**

1. Open the invoice.
2. Read the card fee and the total.

**Expected Results:**

* The card fee is the HKD rule's fee on the invoice's HKD Subtotal.
* The fee and the total read in HKD.
* The USD rule is not applied.

<!-- trace:case id=g10.auction-winner-order.TC-uz6 rev=1 covers=g10.auction-winner-order.SC-gc6,g10.auction-winner-order.SC-buj -->
### g10.auction-winner-order.US26-TC6: A USD amount converts to HKD rounded up to a whole HK$

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-26

**Pre-conditions:**

* None.

**Test data:**

| `<usd amount>` | `<hkd amount>` | Why this row |
| --- | --- | --- |
| USD100.00 (fixed boundary) | HK$785 | Exact: 785.00, nothing to round |
| USD100.01 (fixed boundary) | HK$786 | 785.0785 rounds up, not to nearest |
| USD0.01 (fixed boundary) | HK$1 | 0.0785 rounds up to one whole HK$ |

**Steps:**

1. Convert `<usd amount>` to HKD.

**Expected Results:**

* The result is `<hkd amount>`.

<!-- trace:case id=g10.auction-winner-order.TC-k5y rev=1 covers=g10.auction-winner-order.SC-tmf,g10.auction-winner-order.SC-vvm -->
### g10.auction-winner-order.US26-TC7: No page, invoice, receipt or letter names the conversion rate

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-26

**Pre-conditions:**

* `<order_hkd_paid>` is settled in HKD and paid in full, and Grade10 sent letters about it.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_hkd_paid>` | An order settled in HKD whose invoice of HK$2,451 was paid in full |

**Steps:**

1. Read the settlement currency choice before picking HKD on a new order.
2. Read Order Summary on `<order_hkd_paid>`.
3. Read its invoice.
4. Read its receipt.
5. Read each letter sent for it.

**Expected Results:**

* No surface names a rate, an exchange rate or 7.85.

<!-- trace:case id=g10.auction-winner-order.TC-one rev=1 -->
### g10.auction-winner-order.US26-TC8: A bank transfer fee typed in USD converts and rounds up with the other lines
**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-26

**Pre-conditions:**

* customer(winner) is on `<the winner's auction order url>` for `<order_fee>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_fee>` | An order settled in HKD by bank transfer on HK Local whose invoice lines total HKD1,031.00, with a bank transfer fee typed in USD |
| `<bank transfer fee>` | USD50.00 (fixed boundary or equality), 5000 minor units, which converts to HKD392.50 before rounding |
| `<fee HKD>` | HKD393.00 (fixed derived value), 39300 minor units |
| `<total HKD>` | HKD1,424.00 (fixed derived value), 142400 minor units |

**Steps:**

1. Open the invoice.
2. Read the Payment Processing Fee and the total.

**Expected Results:**

* The Payment Processing Fee reads `<fee HKD>`, the typed amount converted and rounded up to the whole HK$.
* The total reads `<total HKD>`, the sum of the rounded lines and the fee.
* Every amount reads in HKD.

---

## g10.auction-winner-order.US27: Winner who settles in HKD reads the order total in both currencies

**As a** winner who picked HKD,
**I want** my Order Summary to keep the lot's USD amounts and show a USD total then the HKD total I will pay,
**so that** I see what I won and what it costs me in HKD.

<!-- trace:case id=g10.auction-winner-order.TC-vwm rev=1 covers=g10.auction-winner-order.SC-kdr -->
### g10.auction-winner-order.US27-TC1: Order Summary under HKD keeps USD lines and reads two totals

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-27

**Pre-conditions:**

* customer(winner) is on `<the winner's auction order url>` for `<order_hkd>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_hkd>` | A lot won at USD250 (fixed fixture), settled in HKD, premium USD50, Shipping & Handling USD12, invoice sent |
| USD total | USD312 (fixed derived value): 250 + 50 + 12 |
| `<total HKD>` | HK$2,451 (fixed derived value): lines rounded up one by one, then summed |

**Steps:**

1. Read Order Summary.
2. Read Order Total.

**Expected Results:**

* Step 1: the lines read in USD: the winning bid, Buyer's Premium and Shipping & Handling from the row.
* Step 2: Order Total reads the USD total, then the HKD total.
* The HKD total reads `<total HKD>`.

<!-- trace:case id=g10.auction-winner-order.TC-7qs rev=1 covers=g10.auction-winner-order.SC-59h -->
### g10.auction-winner-order.US27-TC2: Order Summary under USD reads one total in USD

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
* **Trace:** winner-order-US-27

**Pre-conditions:**

* customer(winner) is on `<the winner's auction order url>` for `<order_usd>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_usd>` | A lot won at USD250 (fixed fixture), settled in USD, premium USD50, Shipping & Handling USD12, invoice sent |

**Steps:**

1. Read Order Summary.
2. Read Order Total.

**Expected Results:**

* The lines read in USD.
* Order Total reads one total, in USD.
* No HKD total appears.

<!-- trace:case id=g10.auction-winner-order.TC-17a rev=1 covers=g10.auction-winner-order.SC-ug0 -->
### g10.auction-winner-order.US27-TC3: The HKD total waits for the invoice

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-27

**Pre-conditions:**

* customer(winner) is on `<the winner's auction order url>` for `<order_hkd_unsent>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_hkd_unsent>` | A lot won at USD250 (fixed fixture), settled in HKD, setup confirmed, invoice not sent |

**Steps:**

1. Read Order Summary.
2. Read the lot card.

**Expected Results:**

* Step 1: no HKD total shows.
* Step 2: the winning bid reads USD250.00, in USD.

## Settled

- An operator may change the settlement currency after the winner confirms: before the invoice is sent by an edit, and after it by a reissue, with a reason in both.
- The operator types the bank transfer fee in USD and it converts with the other lines.
- Only the won-lot letter keeps the USD winning bid; every later letter reads the settlement currency only.
- The card fee range reads the percentage of the rule of the currency picked.

## Reconciliation

**Run:** QA2 reconciliation 2026-10-13, re-run 2026-10-14 against Dev's patch, for change `usd-lot-currency-winner-settlement-choice`, joining QA1's blind cases with Dev's delta scenarios on `winner-order-US-24`, `winner-order-US-25`, `winner-order-US-26` and `winner-order-US-27`, and the restated `winner-order-US-01`, `winner-order-US-03`, `winner-order-US-08` and `winner-order-US-09`. Read the change's `proposal.md`, `decisions.md` (Q1 to Q27 and `## Raised`), `tech-design.md`, `tasks.md`, this delta `spec.md` and `user-journeys.md`, the durable `spec.md` and suite, and the PRD pages the proposal links. QA1 had read the frozen anchors, `decisions.md` and the PRD only, and no `## Requirements`. Links are post-hoc: a case is linked to a scenario only where its route and Expected Results assert the scenario's THEN; a link that two cases share between them says so.

| Finding | Disposition |
| --- | --- |
| Order setup offers USD and HKD, neither selected | **Folded in:** `winner-order-SC-278`, asserted by `g10.auction-winner-order.US24-TC1` |
| A confirmation with no currency is refused, and the order records nothing | **Added:** `g10.auction-winner-order.US24-TC4` asserts `winner-order-SC-279`; QA1 read the choice and not its refusal |
| A confirmed HKD choice is recorded and the order reads Preparing Invoice | **Added:** `g10.auction-winner-order.US24-TC5` asserts `winner-order-SC-280`. `US9-TC22` reads the rail and the status and not the currency, and `US24-TC2` reads the currency and not the status |
| A USD order is priced with no conversion | **Folded in:** `winner-order-SC-281`, asserted by the USD row of `g10.auction-winner-order.US24-TC2`. That case reads no HKD amount and the lines in USD; the winning bid equal to the hammer price and the premium at 20% are read by `US8-TC1` |
| A sent invoice keeps its currency | **Folded in:** `winner-order-SC-282`, asserted by `g10.auction-winner-order.US24-TC3`, which tries the other direction (USD order, request for HKD); the rule is symmetric |
| USD converts at 7.85, a fraction rounds up to the whole HK$, and the HKD total is the sum of the rounded lines | **Folded in:** `winner-order-SC-283` and `winner-order-SC-284` by `g10.auction-winner-order.US26-TC6` (the 100.00, 100.01 and 0.01 rows); `winner-order-SC-284` and `winner-order-SC-285` by `g10.auction-winner-order.US26-TC1`, which reads the lines and the total against the whole-total value |
| A card fee on an HKD order comes from the HKD rule, on the HKD subtotal | **Folded in:** `winner-order-SC-286`, asserted by `g10.auction-winner-order.US26-TC5`, which reads the rule applied and the USD rule not applied rather than the 3873 figure |
| A sent HKD invoice does not re-price when the conversion figure changes, and a reissue prices at the new figure | **Out of suite:** `winner-order-SC-287` - the figure is one constant with no operator control, so only a code change can move it. Verified by the pricing test of task 6.1 in `grade10` that sends, changes the constant and reads the invoice (`tech-design.md`, Risks) |
| An HKD invoice, receipt and letter print every amount in HKD, no USD winning bid and no rate | **Folded in, jointly:** `winner-order-SC-288` by `g10.auction-winner-order.US26-TC1` (amounts and no USD winning bid) and `US26-TC7` (no rate); `winner-order-SC-289` by `US26-TC2` (receipt), `US26-TC3` (letters) and `US26-TC7`. No one case reads receipt, letter and rate together |
| US26-TC3 reads every letter of an HKD order and expects no USD winning bid | **Resolved by Q18, case reworded:** only the won-lot letter keeps the USD winning bid, sent before a currency is picked; the case now reads the letters sent after the pick and expects the won-lot letter at US$. The earlier stop is lifted |
| US26-TC7 reads that no page, summary, invoice, receipt or letter names the rate | **Fold candidate:** the requirement says the rate is shown on no page, and the scenarios state it for the invoice, receipt and letter only. The Order Summary and the setup choice that the case reads have no scenario |
| US26-TC4 reads a refund on an HKD order in HKD | **Fold candidate:** the requirement carries each refund in the settlement currency and no scenario writes it. Left unlinked |
| US8-TC5 converts the premium, the USD minimum included, with the premium | **Fold candidate:** the requirement says there is no second minimum in HKD and no scenario shows a minimum converting. Left unlinked |
| The Order Summary keeps USD lines and reads a USD total then an HKD total under HKD; one total under USD; no HKD total before send | **Folded in:** `winner-order-SC-290` by `g10.auction-winner-order.US27-TC1`, `winner-order-SC-291` by `US27-TC2`, `winner-order-SC-292` by `US27-TC3`, which QA2 added. The lot card clause of `winner-order-SC-290` is read before send only, by `US27-TC3` |
| The premium is 20% of the hammer price, the one USD minimum when higher, rounded half up, kept on a sent invoice | **Folded in:** `winner-order-SC-40` and `grade10-site-auction-winner-order-SC-46` by `g10.auction-winner-order.US8-TC1`, `winner-order-SC-41` by `US8-TC2`, `winner-order-SC-42` by `US8-TC3` and `US3-TC5`, `winner-order-SC-43` by `US8-TC4`, `grade10-site-auction-winner-order-SC-47` by `US3-TC5`. The clause of `winner-order-SC-40` that no operator was asked to enter it is not read |
| HKD offers Card, FPS and HK Local; USD offers Card, HK Local and SWIFT; each rail is its own choice | **Folded in:** `winner-order-SC-293` and `winner-order-SC-294`, asserted by the two rows of `g10.auction-winner-order.US25-TC1` |
| Switching currency clears a method the new currency does not offer, keeps one both offer, and a confirmation without a new choice is refused | **Folded in:** `winner-order-SC-295` by `g10.auction-winner-order.US25-TC2` (the clearing) and `US25-TC3` (the refusal, added), `winner-order-SC-296` by `US25-TC4` (added) |
| A method the currency does not offer is refused, and nothing is recorded | **Added:** `g10.auction-winner-order.US25-TC5` asserts `winner-order-SC-298` |
| Card is not offered where no rule exists, in either currency, and the rails are | **Folded in:** `winner-order-SC-297` and `winner-order-SC-248` by the two rows of `g10.auction-winner-order.US1-TC52` |
| The rail picked is recorded with the address, and a method can change until confirm | **Folded in:** `winner-order-SC-90` by `g10.auction-winner-order.US9-TC22`; `winner-order-SC-93` by `US1-TC50`, whose rail is FPS where the scenario names HK Local, the same class. The durable marker of `US1-TC50` named `g10.auction-winner-order.SC-1aa` (`winner-order-SC-92`), which it does not assert; the link moves to `winner-order-SC-93` |
| The choice shows each method's fee wording by rail, none selected | **Added:** `g10.auction-winner-order.US25-TC6` asserts `winner-order-SC-91`. The durable `g10.auction-winner-order.TC-bmd` (`US9-TC23`) still reads "Bank transfer reads Bank fee set on your invoice" as one method; it needs a rail rewording at review |
| A rail is offered only where Grade10 holds its bank details, in production too | **Added:** `g10.auction-winner-order.US25-TC7` asserts `winner-order-SC-92` and `winner-order-SC-226`, one row each. The durable `g10.auction-winner-order.TC-n0y` (`US1-TC48`) still sends "bank transfer" as one choice |
| A confirmation with no method is refused; neither method offered reads not yet available; the setup deadline still runs | **Out of suite:** `winner-order-SC-94`, `winner-order-SC-249` and `winner-order-SC-257` - the durable `g10.auction-winner-order.TC-miy`, `TC-z2f` and `TC-s5e` hold them. `TC-z2f` still names "bank transfer" where the scenario names HK Local and SWIFT; the outcome is the same |
| View Bank Details shows the one rail picked: FPS with QR, HK Local fields, SWIFT fields with the OUR note; the rail picked at setup is the rail shown | **Folded in:** `winner-order-SC-181` and `winner-order-SC-299` by `g10.auction-winner-order.US9-TC32`, `winner-order-SC-182` and `winner-order-SC-183` by `US9-TC24`, `winner-order-SC-95` by `US9-TC1`. `winner-order-SC-299` starts from a sent invoice in the case, not from setup; the walk of task 9.2 runs the whole route. The memo warning of `winner-order-SC-183` is not named in `US9-TC24` |
| `g10.auction-winner-order.US9-TC1` expects the bank reference with a copy control | **Stop and ask the author:** the requirement and `g10.auction-winner-order.US9-TC32` read the reference as a detail row without a copy control. The durable `g10.auction-winner-order.TC-ypl` (`US9-TC20`, the copy control) is stale for the same reason. The case also carries a `**Blocked:**` line from QA1 that this run leaves |
| A card payment on a bank transfer invoice is refused; the summary offers Submit Payment Proof and View Bank Details; Submit Payment Proof is proof-only | **Out of suite:** `winner-order-SC-96`, `winner-order-SC-180` and `winner-order-SC-184` - the durable `g10.auction-winner-order.TC-e6w`, `TC-6nc` and `TC-xmr` hold them, unchanged |
| Invoice field scenarios the modified block restates: `winner-order-SC-04`, `-SC-05`, `-SC-38`, `-SC-39`, `-SC-62`, `-SC-63`, `-SC-69`, `-SC-110`, `-SC-111`, `-SC-214`, `-SC-215`, `-SC-216` | **Out of suite:** the durable invoice-line cases (`g10.auction-winner-order.TC-apy`, `TC-aq5`, `TC-7cb`, `TC-ujy`, `TC-m21`, `TC-nvv`, `TC-dvc`), which this change does not alter; their example amounts are HKD. The bank transfer fee question that `winner-order-SC-63`, `winner-order-SC-110` and `winner-order-SC-111` carried is settled by Q16: the fee is typed in USD, so `winner-order-SC-110` reads a USD invoice in USD and `winner-order-SC-111` types its zero in USD |
| An operator changes the settlement currency after the winner confirmed and before the invoice is sent, and the winner's own write is still refused | **Added:** `g10.auction-winner-order.US24-TC6` asserts `winner-order-SC-300`. QA1 had no case for the operator's window; Q15 settled it. The operator side, its reason and its log entry are read by `g10adm.auction-post-sale.US5-TC21` |
| A reissue in the other currency carries the currency the operator chose and leaves the replaced invoice in its own | **Added:** `g10.auction-winner-order.US24-TC7` asserts `winner-order-SC-301`; the same route is read from the operator's side by `g10adm.auction-post-sale.US5-TC22` |
| The card fee range reads the percentage of the rule of the currency picked, and changes when the currency changes | **Added:** `g10.auction-winner-order.US25-TC8` asserts `winner-order-SC-303`. `g10.auction-winner-order.US25-TC6` reads the HKD wording only, so no case read the USD percentage or the switch |
| An HKD order converts a bank transfer fee typed in USD, rounded up to the whole HK$, and adds it to the total | **Stop and ask the author:** `winner-order-SC-302` reads a fee of 5000 minor units in USD as 39250 minor units in HKD and an order total of 142350. 5000 x 7.85 is 392.5 HK$, which "An HKD order converts each USD line at a fixed rate and rounds it up" rounds to 39300, a multiple of 100, so the total reads 142400; the case `g10.auction-winner-order.US26-TC8` reads 39300 and 142400 and is left unlinked. The same requirement's table and `winner-order-SC-284` round a fraction up. Raised in `decisions.md` |
| A lot an internal bidder wins opens its order with the internal bidder's address and no letter; the order's settlement currency and rail are left to the operator | **Held:** `winner-order-SC-277` is not linked. The first three clauses are the durable `g10.auction-winner-order.TC-srq`, with an HKD fixture there; the clause that currency and rail stay with the operator is the question raised against `grade10-admin/auction/post-sale` and `decisions.md` Q20 |
| A lot close asks for an address and not payment, a repeated close creates nothing twice, and confirming an address readies the order | **Out of suite:** `winner-order-SC-26`, `winner-order-SC-27` and `winner-order-SC-28`, restated unchanged by the modified block - the durable US1 cases (`g10.auction-winner-order.TC-qaq` and its siblings, whose legacy markers bundle them) hold them |
| The PRD page `post-bidding.md` still states the earlier model in places: the premium row (0 in USD, HKD and JPY), "in USD and JPY until Finance sets one", the invoice "Bank details" bullet (every enabled rail), the View Bank Details tab lines and the rail tab width line, and the Buyer's premium, Bank details and Card in USD and JPY decision rows | **Stop and ask the author:** the PRD owner. Task 3.1 names some of these lines. No case in this suite follows them; they contradict `decisions.md` Q4, Q10 and Q11 and the requirements above |

**Uncovered anchors:** none for `winner-order-US-24`, `winner-order-US-25`, `winner-order-US-26` or `winner-order-US-27`.

**Uncovered scenarios:** `winner-order-SC-302` (contradiction, held) and `winner-order-SC-277` (held for the PM with Q20). No scenario is left uncovered without a named reason.

**Cases left unlinked on purpose:** `g10.auction-winner-order.US8-TC5`, `g10.auction-winner-order.US26-TC4`, `g10.auction-winner-order.US26-TC8` and the fold candidates above, kept `draft`. None is marked approved or actual.

**Over-claimed cases:** `g10.auction-winner-order.US26-TC7` reads that no page names the rate, including the Order Summary and the setup choice, while the scenarios it is linked to state the invoice, receipt and letter only; the page clause stands on the requirement.

**Contradictions:** `winner-order-SC-302` against the requirement's own rounding rule and table, `spec.md` of this delta at `winner-order-SC-302` (39250 and 142350 against 39300 and 142400). `winner-order-SC-95` keeps the title "shows three ways" over a THEN that shows one rail. `winner-order-SC-111` carries rev 1 with restated text. `g10.auction-winner-order.US9-TC1` still expects a copy control, as before.