# grade10-site/auction/winner-order Test Cases

**Status:** pending-review · 0/27
**Drafts styled:** 2026-10-14, tcs-rules r5
**Out of suite (api):** winner-order-SC-27

## g10.auction-winner-order.US8: Winner pays an invoice with a policy premium

**As a** winner of an auction lot,
**I want** my invoice to calculate the stated buyer premium correctly using the current currency minimum,
**so that** the amount I pay is explainable and collectible.

## g10.auction-winner-order.US9: Winner pays an invoice by bank transfer

**As a** winner who would rather not pay a card fee,
**I want** to choose bank transfer, see where to send the money and what reference to quote, and send Grade10 proof,
**so that** Grade10 can match my payment and my deadline stops while it is checked.

<!-- trace:case id=g10.auction-winner-order.TC-w18 rev=4 covers=g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-i03 -->
### g10.auction-winner-order.US9-TC1: Bank invoice shows the chosen rail and reference

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* Outside production, Grade10 holds FPS bank details and Payment Settings holds an HKD card fee rule.
* customer(winner) holds an HKD auction order in Awaiting Setup with a saved home address.

**Steps:**

1. Choose HKD and FPS, then confirm the home address.
2. As the operator, send the invoice for bank transfer on FPS.
3. As the winner, open View Bank Details.
4. Read the dialog and payment reference.

**Expected Results:**

* The invoice names the selected FPS rail and its reference.
* The dialog shows FPS ID, account name and an FPS QR only, without rail tabs or copy controls.
* No HK Local or SWIFT details show.

<!-- trace:case id=g10.auction-winner-order.TC-eu8 rev=3 covers=g10.auction-winner-order.SC-v59 -->
### g10.auction-winner-order.US9-TC22:

Runs once per row of **Test data**. The picked rail is recorded with the address where Grade10 holds bank details

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* Grade10 holds the sample bank details for each rail outside production, and Payment Settings holds a card fee rule in the row's currency.
* customer(winner) holds an order won in USD in Awaiting Setup with a saved home address.

**Test data:**

| Settlement currency | Rail |
| --- | --- |
| HKD | FPS |
| HKD | HK Local |
| USD | International via SWIFT |

**Steps:**

1. Choose the row's settlement currency and read the method choices.
2. Confirm the delivery address with the row's rail.
3. Reload the order.

**Expected Results:**

* Step 1: Card and the row's rails are offered, none selected.
* Step 3: the order records bank transfer on the row's rail and reads Preparing Invoice.

<!-- trace:case id=g10.auction-winner-order.TC-9v4 rev=5 covers=g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii -->
### g10.auction-winner-order.US9-TC24: HK Local and SWIFT details show their expanded fields

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/winner-order/keep-proof.spec.ts`

**Pre-conditions:**

* customer(winner) is on Winner Order for `<pending_bank_transfer_order>`, whose invoice is pending and picked rail is the row's rail.

**Test data:**

| Field | Value |
| --- | --- |
| `<pending_bank_transfer_order>` | An auction order whose invoice was sent for the row's rail and is pending |
| Row 1 | HKD order, HK Local |
| Row 2 | USD order, International via SWIFT |

**Steps:**

1. Read the invoice actions and open View Bank Details.
2. Read the bank details.

**Expected Results:**

* No card Pay control is offered on the bank transfer invoice.
* No rail tabs show, and only the row's rail shows.
* No bank-detail row has a copy control.
* HK Local shows bank name, bank code, branch code, full account number including bank and branch code, then payment reference.
* SWIFT shows beneficiary name, beneficiary address, bank name, bank address, SWIFT/BIC, full account or IBAN, then payment reference and memo warning, then the OUR charges note after the reference.
* Only the row's rail shows.

<!-- trace:case id=g10.auction-winner-order.TC-vvf rev=2 -->
### g10.auction-winner-order.US9-TC32: View Bank Details opens on FPS with QR

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
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

<!-- trace:case id=g10.auction-winner-order.TC-x85 rev=3 covers=g10.auction-winner-order.SC-zhu,g10.auction-winner-order.SC-b16,g10.auction-winner-order.SC-2mz -->
### g10.auction-winner-order.US3-TC5: The invoice's Buyer's Premium follows the published rule

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
* **Trace:** winner-order-US-03

**Pre-conditions:**

* admin(operator with payment-processing) holds a USD order in Preparing Invoice; it has no other invoice lines.
* Auction Payment settings holds the row's USD premium minimum.

**Test data:**

| Winning bid | Minimum | Buyer's Premium | Final amount | Rule |
| --- | --- | --- | --- | --- |
| USD1,350 (range: 80000-399999 minor units) | USD0 | USD270.00 | USD1,620.00 | 20% of the winning bid |
| USD10.03 (fixed boundary) | USD0 | USD2.01 | USD12.04 | 20% is 200.6 minor units, rounded half up |
| USD10.02 (fixed boundary) | USD0 | USD2.00 | USD12.02 | 20% is 200.4 minor units, rounded half up |
| USD50 (fixed fixture) | USD20 (fixed configured value) | USD20.00 | USD70.00 | The minimum, higher than 20% (USD10) |
| USD2,500 (fixed scenario fixture) | USD200.00 (fixed configured value) | USD500.00 | USD3,000.00 | 20% of the winning bid; operator does not enter it |

**Steps:**

1. As the operator, open Send Invoice and read the quote fields.
2. Send the invoice without entering a buyer's premium.
3. As the winner, read Order Summary.
4. Hover the Buyer's Premium info tooltip.

**Expected Results:**

* Step 1: no buyer's premium input is shown or requested from the operator.
* Step 2: the invoice is sent with the row's buyer's premium computed by the USD rule.
* Step 3: the winning bid line reads the row's winning bid and Buyer's Premium reads the row's value.
* Step 3: the total equals the row's final amount, including the premium.
* Step 4: a brief tooltip explains Buyer's Premium.

## g10.auction-winner-order.US1: Winner settles a won lot

**As a** winner,
**I want** to tell Grade10 where to ship and how I will pay, then pay the invoice it sends me,
**so that** the lot I won becomes mine inside a deadline I can see, priced for where it is actually going.

<!-- trace:case id=g10.auction-winner-order.TC-4dz rev=3 covers=g10.auction-winner-order.SC-pt5 -->
### g10.auction-winner-order.US1-TC50:

Runs once per row of **Test data**. The method can change until the winner confirms

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds a card fee rule in USD and in HKD.
* customer(winner) holds an auction order in HKD in Awaiting Setup, with card chosen and not yet confirmed.

**Test data:**

| New rail | Expected recorded method |
| --- | --- |
| FPS | bank transfer on FPS |
| HK Local | bank transfer on HK Local |

**Steps:**

1. Change the choice to the row's rail.
2. Confirm the home address.
3. Reload the order.

**Expected Results:**

* The order records the row's bank transfer rail, not card.
* The order reads Preparing Invoice.

<!-- trace:case id=g10.auction-winner-order.TC-csb rev=2 covers=g10.auction-winner-order.SC-vbp,g10.auction-winner-order.SC-7y2 -->
### g10.auction-winner-order.US1-TC52: A currency with no card fee rule reads card as not yet available

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* Outside production, Grade10 holds the sample bank details for each rail, and Payment Settings holds no card fee rule in the row's currency.
* customer(winner) holds an order won in USD in Awaiting Setup with a saved home address.

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

<!-- trace:case id=g10.auction-winner-order.TC-ayp rev=2 covers=g10.auction-winner-order.SC-o92,g10.auction-winner-order.SC-zk3,g10.auction-winner-order.SC-mw8 -->
### g10.auction-winner-order.US24-TC1: Setup opens on the first currency offered and its first method a currency can take

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-24

**Pre-conditions:**

* customer(winner) holds `<order>`, won in USD, in Awaiting Setup with a saved Home address; Grade10 offers `<currencies>`, with `<card rule>`.

**Test data:**

| `<currencies>` | `<card rule>` | `<opens>` | `<selected method>` |
| --- | --- | --- | --- |
| USD and HKD | an HKD card fee rule | a currency picker, USD selected | Card |
| HKD only | an HKD card fee rule | Pay in HKD, with no picker | Card |
| HKD only | no card fee rule | Pay in HKD, with no picker | FPS, card not selectable |

**Steps:**

1. Read the settlement currency and the payment methods.
2. Where both currencies are offered, choose another method and confirm.

**Expected Results:**

* Step 1 reads `<opens>`, `<selected method>` selected; the order stays Awaiting Setup.
* Step 2 records the method chosen, and the order reads Preparing Invoice.

<!-- trace:case id=g10.auction-winner-order.TC-79a rev=2 covers=g10.auction-winner-order.SC-8c6 -->
### g10.auction-winner-order.US24-TC2: Chosen settlement currency prices the invoice

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-24

**Pre-conditions:**

* A winner is on order setup with an address and billing address ready.

**Test data:**

| Settlement currency | Hammer price in USD minor units | Premium in USD minor units | Expected invoice amounts |
| --- | ---: | ---: | --- |
| USD | 250000 | 50000 | Winning Bid 250000 USD; Buyer's Premium 50000 USD; total 300000 USD |
| HKD | 250000 | 50000 | Winning Bid 1962500 HKD; Buyer's Premium 392500 HKD; total 2356500 HKD |

**Steps:**

1. Choose the row's settlement currency.
2. Choose a payment method offered for it.
3. Confirm the order setup.
4. Read the invoice currency and order total.

**Expected Results:**

* The invoice shows the row's winning bid, premium and total in the row's currency, with no conversion for USD.
* When the row is HKD, its converted lines use 7.85 and round up to whole HKD; no USD amount is printed.

<!-- trace:case id=g10.auction-winner-order.TC-x0r rev=1 covers=g10.auction-winner-order.SC-lq9 -->
### g10.auction-winner-order.US24-TC5: Confirming with HKD records HKD and the order reads Preparing Invoice

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-24

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/usd-settlement-choice.spec.ts`

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
### g10.auction-winner-order.US25-TC1: Each currency offers its payment methods and rails

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-25

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/winner-order/keep-us1.spec.ts`

**Pre-conditions:**

* A winner is on order setup with USD and HKD settlement choices.

**Test data:**

| Currency | Offered methods |
| --- | --- |
| USD | Card, HK Local, International via SWIFT |
| HKD | Card, FPS, HK Local |

**Steps:**

1. Choose the row's currency.
2. Read all payment method choices.

**Expected Results:**

* Exactly the methods in the row are offered.
* Each bank rail is a separate choice.
* No method from the other currency is offered.

<!-- trace:case id=g10.auction-winner-order.TC-7j7 rev=1 -->
### g10.auction-winner-order.US25-TC2: Switching currency clears an unavailable method

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-25

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/usd-settlement-choice.spec.ts`

**Pre-conditions:**

* A USD winner selected an International via SWIFT method before confirming setup.

**Steps:**

1. Switch settlement currency to HKD.
2. Read the selected method and available choices.

**Expected Results:**

* International via SWIFT is no longer selected or offered.
* The available HKD choices appear, with none selected.

<!-- trace:case id=g10.auction-winner-order.TC-vje rev=1 covers=g10.auction-winner-order.SC-4lj -->
### g10.auction-winner-order.US25-TC3: A confirmation after a switch that cleared the method is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-25

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/usd-settlement-choice.spec.ts`

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

<!-- trace:case id=g10.auction-winner-order.TC-rwy rev=2 covers=g10.auction-winner-order.SC-6un -->
### g10.auction-winner-order.US25-TC4: Switching currency keeps a still-offered method
Runs once per row of **Test data**.
**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-25

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/usd-settlement-choice.spec.ts`

**Pre-conditions:**

* A winner selected the row's method for USD, and that method is offered for HKD.

**Test data:**

| Selected method | Expected after switch |
| --- | --- |
| Card | Card remains selected |
| HK Local | HK Local remains selected |

**Steps:**

1. Select the row's method for USD.
2. Switch settlement currency to HKD.
3. Read the selected payment method.

**Expected Results:**

* The row's method remains selected because HKD still offers it.

<!-- trace:case id=g10.auction-winner-order.TC-jfi rev=1 covers=g10.auction-winner-order.SC-8dl -->
### g10.auction-winner-order.US25-TC6: Each HKD method reads its fee wording and none is selected

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-25

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/usd-settlement-choice.spec.ts`

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

<!-- trace:case id=g10.auction-winner-order.TC-ac5 rev=3 covers=g10.auction-winner-order.SC-gc6,g10.auction-winner-order.SC-buj,g10.auction-winner-order.SC-ekn,g10.auction-winner-order.SC-tmf -->
### g10.auction-winner-order.US26-TC1: An HKD invoice reads every amount in HKD, each line rounded up then summed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
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
| `<order_hkd_exact>` | A lot won at USD100.00, settled in HKD by FPS, invoice sent |
| `<order_hkd_fraction>` | A lot won at USD101.00, settled in HKD by FPS, invoice sent |
| `<order_hkd_lines>` | A lot won at USD101.00, settled in HKD by bank transfer, invoice sent with 0 USD bank transfer fee |
| `<winning bid HKD exact>` | HK$793.00 (fixed derived value), 79,300 minor units |
| `<premium HKD exact>` | HK$159.00 (fixed derived value), 15,900 minor units |
| `<shipping HKD exact>` | HK$79.00 (fixed derived value), 7,900 minor units |
| `<subtotal HKD exact>` | HK$1,031.00 (fixed derived value), 103,100 minor units |
| `<winning bid>` | USD250 (fixed fixture): USD250 x 7.85 is 1962.5, rounded up to HK$1,963 |
| `<premium>` | USD50 (fixed derived value): 20% of `<winning bid>`, premium minimum USD0; HK$393 after rounding up 392.5 |
| `<shipping>` | USD12 (fixed fixture): HK$95 after rounding up 94.2 |
| `<total HKD>` | HK$2,451: 1,963 + 393 + 95, each line rounded up, then summed |
| Whole-total value | HK$2,450: USD312 x 7.85 is 2449.2, rounded up (the wrong total) |

**Steps:**

1. Open `<order_hkd>`'s invoice.
2. Read Buyer's Premium, Shipping & Handling and the total.
3. Open `<order_hkd_exact>`'s invoice and read its Winning Bid.
4. Open `<order_hkd_fraction>`'s invoice and read its Winning Bid.
5. Open `<order_hkd>`'s invoice PDF.
6. Open `<order_hkd_lines>`'s invoice and read its lines and total.

**Expected Results:**

* Buyer's Premium reads HK$393 and Shipping & Handling reads HK$95.
* The total reads `<total HKD>`, not the whole-total value.
* Every amount reads in HKD, and no USD amount appears.
* No USD winning bid is printed.
* `<order_hkd_exact>`'s Winning Bid is 78,500 minor units in HKD.
* `<order_hkd_fraction>`'s Winning Bid is 79,300 minor units in HKD, not 79,285.
* Step 5: every amount in the invoice PDF reads in HKD, the Winning Bid is 78,500 minor units, and no USD amount or conversion rate appears.
* Step 6: Winning Bid is `<winning bid HKD exact>`, Buyer's Premium is `<premium HKD exact>`, Shipping & Handling is `<shipping HKD exact>`, and the total is `<subtotal HKD exact>`, the sum of the rounded lines.

<!-- trace:case id=g10.auction-winner-order.TC-nf6 rev=3 covers=g10.auction-winner-order.SC-vvm -->
### g10.auction-winner-order.US26-TC2: HKD receipt omits the USD winning bid

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-26

**Pre-conditions:**

* A winner paid in full an HKD invoice whose total is 103100 minor units in HKD, for a lot bid in USD.

**Steps:**

1. Read the receipt and payment confirmed letter.

**Expected Results:**

* The order total and payment each read 103100 minor units in HKD.
* Neither document prints the USD winning bid or conversion rate.

<!-- trace:case id=g10.auction-winner-order.TC-9dm rev=1 -->
### g10.auction-winner-order.US26-TC3: Order letters of an HKD order carry HKD amounts

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
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

<!-- trace:case id=g10.auction-winner-order.TC-3ly rev=2 covers=g10.auction-winner-order.SC-qtr -->
### g10.auction-winner-order.US26-TC5: The card fee of an HKD order comes from the HKD rule

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
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
| `<order_card>` | A lot won at USD101.00, with a USD20.20 premium and USD10.01 Shipping & Handling, settled in HKD by card |
| HKD Subtotal | HK$1,031.00 (fixed derived value): HK$793 bid + HK$159 premium + HK$79 Shipping & Handling |

**Steps:**

1. Open the invoice.
2. Read the card fee and the total.

**Expected Results:**

* The card fee is 3,873 minor units in HKD, the HKD rule's gross-up fee on the HKD Subtotal.
* The total is 106,973 minor units in HKD.
* The USD rule is not applied.

<!-- trace:case id=g10.auction-winner-order.TC-k5y rev=1 -->
### g10.auction-winner-order.US26-TC7: No page, invoice, receipt or letter names the conversion rate

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
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

<!-- trace:case id=g10.auction-winner-order.TC-one rev=1 covers=g10.auction-winner-order.SC-8gv -->
### g10.auction-winner-order.US26-TC8: A bank transfer fee typed in USD converts and rounds up with the other lines
**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
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

## g10.auction-winner-order.US27: Winner who settles in HKD reads the Order Summary in HKD

**As a** winner who picked HKD,
**I want** my Order Summary in HKD, with each line's USD amount beneath it and one HKD total I will pay,
**so that** I see what I won and what it costs me in HKD.

<!-- trace:case id=g10.auction-winner-order.TC-vwm rev=4 covers=g10.auction-winner-order.SC-kdr,g10.auction-winner-order.SC-fq4 -->
### g10.auction-winner-order.US27-TC1: HKD summary reads HKD lines with USD beneath

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-27

**Pre-conditions:**

* The winner selected HKD and two pending invoices have USD bid, premium and Shipping & Handling lines: one bank-transfer order and one card order.

**Test data:**

| Payment method | USD line | HKD line |
| --- | --- | ---: |
| Bank transfer | Winning Bid 10,100; Buyer's Premium 2,020; Shipping & Handling 1,001 minor | 79,300; 15,900; 7,900 minor; subtotal 103,100 minor |
| Card | Winning Bid 10,100; Buyer's Premium 2,020; Shipping & Handling 1,001 minor | 79,300; 15,900; 7,900 minor; subtotal 103,100 minor |
| HKD card rule | 3.4% + 235 minor | Card fee 3,873 minor; payable total 106,973 minor |

**Steps:**

1. Read each row's Order Summary lines.
2. Read each row's Order Total.

**Expected Results:**

* Both rows list the bid, premium and Shipping & Handling lines as 79,300, 15,900 and 7,900 minor units in HKD, each with its USD amount of 10,100, 2,020 and 1,001 minor units beneath it.
* The bank-transfer row has no card fee and its Order Total reads 103,100 minor units in HKD.
* The card row shows the Payment Processing Fee of 3,873 minor units in HKD, with no USD amount beneath it; its Order Total reads 106,973 minor units in HKD and includes the fee.
* Neither row shows a USD total.

<!-- trace:case id=g10.auction-winner-order.TC-7qs rev=1 covers=g10.auction-winner-order.SC-59h -->
### g10.auction-winner-order.US27-TC2: USD summary shows one USD total

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-27

**Pre-conditions:**

* The winner selected USD and the invoice has no converted HKD total.

**Steps:**

1. Read the Order Summary totals.

**Expected Results:**

* The summary shows one USD total.
* It shows no HKD subtotal or fee.

<!-- trace:case id=g10.auction-winner-order.TC-17a rev=1 covers=g10.auction-winner-order.SC-ug0 -->
### g10.auction-winner-order.US27-TC3: The HKD total waits for the invoice

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
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

- Q20 settles the internal order at lot close as HKD/FPS automatically, without setup or a winner/operator selection step; no invoice is issued at close.
- Q31 counts a payment-choice change, including a rail-only change, as a reissue change.
- Q16 types bank-transfer fees in USD and converts each fee line to HKD rounded up.
- Q18 preserves USD only in the won-lot letter sent before currency selection; later order letters use settlement currency.
- Q19 shows the percentage from the card rule for the currency selected.
- SC-95 retains its historical title; its active body requires only the picked HK Local rail, with no tabs or other rail details.
- SC-302 uses the rounded fee of 39,300 minor HKD and total 142,400 minor HKD.

## Reconciliation

**Run:** QA2 2026-10-14, independent reconciliation of the blind QA1 cases against the current Dev scenarios and original journey anchors. Read proposal, decisions and `## Raised`, relevant revised PRDs, journeys, tech design, current and durable winner-order specs and suites, and `docs/governance/specs-to-test-cases.md`; QA1's report and pre-QA2 READY receipt were read as review inputs. The revised cases were not derived from scenarios. Case dispositions are recorded before the post-hoc links below.

| Scenario | Disposition and evidence |
| --- | --- |
| SC-278 | Covered by `TC-ayp`; both currencies offered, neither selected. |
| SC-279 | Covered by `TC-a61`; no-currency confirmation refused and state unchanged. |
| SC-280 | Covered by `TC-x0r`; confirmed HKD and Preparing Invoice. |
| SC-281 | Covered by USD row in `TC-79a`; no conversion and USD lines/total. |
| SC-282 | Covered by `TC-8ea`; the HKD-sent invoice refuses a USD write and remains HKD. |
| SC-300, SC-301 | Covered by `TC-flb` and `TC-r4x`; operator pre-send correction and cross-currency reissue. |
| SC-283, SC-284, SC-285 | Covered by repaired `TC-ac5`; exact 100.00, 101.00 and 101.00/20.20/10.01 USD bank-transfer fixtures with converted lines and rounded sum. |
| SC-286 | Covered by `TC-3ly`; exact 103,100 minor HKD subtotal, 3,873 fee, 106,973 total, HKD rule selected. |
| SC-287 | Out of suite: pricing module change test planned in task 6.1; the fixed rate is a code constant, not an operator-editable value. |
| SC-288 | Covered by repaired `TC-ac5`; exact USD100 / HKD78,500 invoice and PDF, no USD amount or rate. |
| SC-289 | Covered by repaired `TC-nf6`; exact HKD103,100 receipt and payment-confirmed letter, no USD winning bid or rate. |
| SC-290, SC-304 | Covered by `TC-vwm`; exact HKD lines with USD beneath, HKD card-fee gross-up and the one HKD Order Total. |
| SC-291 | Covered by `TC-7qs`; one USD total only. |
| SC-292 | Covered by `TC-17a`; no HKD total before invoice send and USD bid on lot card. |
| SC-40 | Covered by repaired `TC-x85`; the operator quote has no premium input, then the invoice carries the exact USD500 premium for a USD2,500 bid and USD200 minimum. |
| SC-41, SC-42 | Covered by `TC-x85`; exact min-higher and half-up invoice rows. |
| SC-43 | Covered by `TC-i06`; sent premium stays and reissue uses new minimum. |
| SC-46, SC-47 | Covered by repaired `TC-n3p`; exact USD2,500/500 premium with final amount inclusion, and USD1.01/0.20 integer-minor boundary. |
| SC-293, SC-294 | Covered by `TC-52z`; exact offered method/rail sets for HKD and USD. |
| SC-295 | Covered by `TC-vje`; switch clears selection and confirmation without new choice is refused. `TC-7j7` asserts only the clearing sub-outcome. |
| SC-296 | Covered by repaired `TC-rwy`; its HK Local row stays selected when switching to HKD. |
| SC-297, SC-248 | Covered by `TC-csb`; no-card-rule outcome and available rails. |
| SC-298 | Covered by `TC-2ac`; unsupported method refused and setup facts unchanged. |
| SC-90 | Covered by repaired `TC-eu8`; its HKD/FPS row records bank transfer on FPS and Preparing Invoice after confirmation. |
| SC-91 | Covered by `TC-jfi`; exact HKD card/bank-fee wording and no selection. |
| SC-303 | Covered by `TC-a8g`; USD 4.4% to HKD 3.4% choice wording. |
| SC-92, SC-226 | Covered by `TC-pes`; outside-production HK Local-only and production no-bank-detail partitions, including FPS refusal. |
| SC-93 | Covered by repaired `TC-4dz`; its HK Local row changes Card to HK Local and confirms the address. |
| SC-94, SC-249, SC-257 | Out of suite: existing durable cases `TC-miy`, `TC-z2f`, `TC-s5e`; SC-249 has the same no-method refusal path, and SC-257 is setup-deadline behavior. |
| SC-95 | Covered by `TC-9v4` for HK Local details and no card Pay. The title is explicitly historical and does not assert three rails. |
| SC-181 | Covered by repaired `TC-w18`; it walks setup, send and the FPS dialog and checks FPS ID, account name, QR and no other rails. `TC-vvf` remains a duplicate candidate. |
| SC-182, SC-183 | Covered by repaired `TC-9v4`; local and SWIFT fields, reference/memo warning, and OUR note order. |
| SC-299 | Covered by repaired `TC-w18`; it walks HKD/FPS setup, invoice send and the FPS detail view. |
| SC-277 | Covered at domain; see the full case link below. |
| SC-302 | Covered by `TC-one`; Q16's USD-typed fee is converted per line to 39,300 HKD and total 142,400. |
| SC-04, SC-05, SC-38, SC-39, SC-62, SC-63, SC-69, SC-110, SC-111, SC-214, SC-215, SC-216 | Out of suite: unchanged invoice-field scenarios remain with existing durable invoice cases; current winner-order changes do not alter those unchanged routes. |
| SC-26, SC-27, SC-28 | Out of suite: unchanged close/duplicate-close/address-ready routes remain with durable winner-order lot-close cases. |

**Anchor coverage:** All eight declared journeys have at least one case: US1, US3, US8, US9, US24, US25, US26 and US27. No journey anchor is uncovered. US26 has uncovered scenario holes recorded above.

- **Covered at domain** - SC-277 is fully asserted by `grade10-admin-auction-e2e-US4-TC2-5` in [domain-tcs.md](../../../grade10-admin/auction/domain-tcs.md#L253). Its expected results cover exactly one internal order, `not_issued`, HKD/FPS, the internal bidder's address, Preparing Invoice, no setup, no invoice at close, and no won, address, invoice, payment or other order letters to any recipient. The case and scenario use the same USD winning bid of 10,100 minor units.

**Other uncovered behavior:** US26 refund-in-HKD case `TC-q56` is required by the anchor/requirement, but no current scenario states that output; case remains unlinked. `TC-xji` also remains unlinked because no scenario states conversion of the one USD premium minimum together with the premium. `TC-9dm` asserts post-pick letters and the pre-pick won-lot exception across all letters; no single scenario asserts that full set.

**Overclaims and duplicates:** `TC-k5y` reads the setup choice and Order Summary as well as invoice, receipt and letters; its no-rate expectation is supported by the broad requirement that no page names the rate, but its scope exceeds the named document scenarios. `TC-w18` and `TC-vvf` overlap on FPS detail presentation; `TC-w18` owns SC-181 and SC-299 after route repair, while TC-vvf remains unlinked. `TC-7j7` and `TC-vje` overlap on switch-clearing; only `TC-vje` also asserts refusal.

**Contradictions:** None found in current winner-order sources. SC-95's historical title is explicitly retained in its active spec and the body requires one picked rail. SC-302's current scenario and TC-one agree at 39,300 minor HKD fee and 142,400 minor HKD total. SC-277 and Q20 agree on automatic HKD/FPS at close without setup.

**Case lifecycle:** All new or changed cases remain `draft`; case IDs are preserved. Ten cases were revised within their existing anchors: TC-n3p, TC-w18, TC-eu8, TC-9v4, TC-4dz, TC-rwy, TC-x85, TC-ac5, TC-nf6 and TC-vwm.

### Blind-case dispositions

| Case | Disposition |
| --- | --- |
| `TC-n3p` | Repair in US8 anchor: vary the USD minimum by row and assert exact USD2,500/200/500/3,000 and USD1.01/0/0.20/1.21 outcomes; rev 3. |
| `TC-zt4` | Retain; the USD1 minimum example remains within US8 and has no exact matching scenario fixture. |
| `TC-dd3` | Retain; calculation boundary case remains a draft. It does not assert invoice-send route. |
| `TC-i06` | Retain; fully checks the sent and reissued premium transition. |
| `TC-xji` | Retain; the HKD conversion of premium and USD minimum is required by US8, but no scenario states this combined outcome. |
| `TC-w18` | Repair within US9: drive HKD/FPS setup, invoice send, then the FPS details dialog; it covers SC-181 and SC-299. It remains a duplicate candidate with TC-vvf; rev 4. |
| `TC-eu8` | Repair within US9: start from a USD-won order, choose currency and rail, inspect offered choices before confirm, then assert the persisted bank-transfer rail and Preparing Invoice; covers SC-90 for HKD/FPS. Rev 3. |
| `TC-9v4` | Repair US9 assertion to include SWIFT memo warning and no copy controls on bank detail rows; rev 5. Covers SC-95, SC-182 and SC-183. |
| `TC-vvf` | Retain; precise FPS dialog case is a duplicate candidate after TC-w18 was repaired; no cover link assigned. |
| `TC-x85` | Repair within US3: add the exact SC-40 operator quote/send route and no-premium-input assertion while retaining SC-41/42 rows; rev 3. |
| `TC-4dz` | Repair within US1: retain the FPS row and add the HK Local row for Card-to-rail change, confirming each recorded rail; rev 3, covers SC-93. |
| `TC-csb` | Retain; covers no-card-rule outcomes for HKD and USD, including the HKD rail choices. |
| `TC-ayp` | Retain; setup choices are unselected and fully assert SC-278. |
| `TC-79a` | Retain; USD/HKD invoice rows verify the selected settlement-currency pricing and line conversions for SC-281. |
| `TC-8ea` | Retain; HKD-sent invoice write to USD is refused and HKD remains, matching SC-282. |
| `TC-a61` | Retain; missing-currency confirmation and unchanged order match SC-279. |
| `TC-x0r` | Retain; confirms HKD and Preparing Invoice, matching SC-280. |
| `TC-flb` | Retain; operator pre-send currency correction and winner write refusal match SC-300. |
| `TC-r4x` | Retain; invoice reissue in USD preserves replaced HKD invoice, matching SC-301. |
| `TC-52z` | Retain; exact USD and HKD method sets match SC-293 and SC-294. |
| `TC-7j7` | Retain; asserts clearing only, not refusal of confirmation, so no SC-295 link. |
| `TC-vje` | Retain; full switch-clear-and-refuse path matches SC-295. |
| `TC-rwy` | Repair within US25: retain the Card row and add HK Local as a second still-offered method, covering SC-296; rev 2. |
| `TC-2ac` | Retain; invalid method confirmation refusal and no persisted setup state match SC-298. |
| `TC-jfi` | Retain; HKD fee wording and no-selection assertions match SC-91. |
| `TC-pes` | Retain; details-availability rows match SC-92 and SC-226. |
| `TC-a8g` | Retain; currency-specific fee ranges match SC-303. |
| `TC-ac5` | Repair within US26: assert exact SC-283/284/285 fixtures and invoice PDF disclosure for SC-288; rev 3. |
| `TC-nf6` | Repair within US26: set SC-289 total/payment fixture and assert receipt plus payment-confirmed letter outputs; rev 3. |
| `TC-9dm` | Retain; post-selection letters assert settlement-currency amounts and the pre-selection won-lot exception; no single scenario covers this full set. |
| `TC-q56` | Retain; refund currency is required by the anchor but no scenario covers it. |
| `TC-3ly` | Retain; exact HKD card-fee rule, fee and payable total match SC-286. |
| `TC-uz6` | Retain; unit conversion cases cover SC-283/284 values but scenario links go to invoice route case TC-ac5; keep unit test unlinked. |
| `TC-k5y` | Retain; no-rate assertions exceed scenario-specific surfaces but the anchor and requirement prohibit rate disclosure anywhere. It has no full scenario THEN match. |
| `TC-one` | Retain; USD-typed bank transfer fee conversion and sum match SC-302. |
| `TC-vwm` | Repair within US27: retain exact card row and add bank-transfer row for the same source amounts, asserting its HKD subtotal without a card fee; rev 3, covers SC-290 and SC-304; rev 4 reads HKD lines with USD beneath and one HKD Order Total. |
| `TC-7qs` | Retain; USD-only total and absence of HKD subtotal/fee match SC-291. |
| `TC-17a` | Retain; pre-send absence of HKD total plus USD lot-card bid match SC-292. |
