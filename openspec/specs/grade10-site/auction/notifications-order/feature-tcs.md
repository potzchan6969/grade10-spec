# grade10-site/auction/notifications-order Test Cases

**Status:** pending-review · 0/17
**Drafts styled:** 2026-10-13, tcs-rules r5

## Walk 1: Winner reads payment reminders

**Starting state:**

**Steps 1–1 setup:**

- A collector wins a USD listing. No settlement currency is selected yet.

**Steps 2–2 setup:**

- A winner has chosen `<settlement_currency>` for an order won at `<winning_bid>`, and an operator is ready to send its invoice.

**Steps 3–4 setup:**

- customer(winner, holds `<winner_order_1>`) has a pending or expired invoice.

**Steps 5–6 setup:**

- customer(winner, holds `<winner_order_2>`) has a pending unpaid invoice.

**Steps 7–8 setup:**

- customer(winner, holds `<winner_order_3>`) pays on day 2 after the invoice was issued.

**Steps 9–10 setup:**

- The payment-received letter for `<winner_order_4>` has already been sent.

**Shared test data:**

**Steps 1–1 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winning bid | USD101.00 | (10100 minor units) |

**Steps 2–2 data:**

| `<settlement_currency>` | `<winning_bid>` | `<payment_reminder_total>` | Fixture notes |
| --- | --- | --- | --- |
| USD | USD2,600 | USD3,120 | USD winning bid is representative; any positive USD winning bid with this invoice fixture remains in the same partition; `<payment_reminder_total>`: 312000 minor units in USD |
| HKD | USD101 | HKD1,031 | Fixed source fixture; `<winning_bid>`: 10100 minor units in USD; `<payment_reminder_total>`: 103100 minor units in HKD |

**Steps 3–4 data:**

| Field | Value |
| --- | --- |
| winner_order_1 | An auction order whose invoice an operator can reissue |

**Steps 5–6 data:**

| Field | Value |
| --- | --- |
| winner_order_2 | An auction order with a pending invoice and a known payment deadline |

**Steps 7–8 data:**

| Field | Value |
| --- | --- |
| winner_order_3 | An auction order whose invoice was issued two days ago and is now paid |

**Steps 9–10 data:**

| Field | Value |
| --- | --- |
| winner_order_4 | An auction order whose payment-received letter was sent |

### Route

1. Read the auction-won letter.
   - The letter names `<winning bid>` in USD. `g10.auction-notifications-order.US1-TC1`
   - It names no HKD amount and no conversion rate. `g10.auction-notifications-order.US1-TC1`
2. Send the invoice and read the payment-reminder letter.
   - The reminder amount is `<payment_reminder_total>` and uses `<settlement_currency>`. `g10.auction-notifications-order.US1-TC2`
   - The letter does not repeat the USD winning bid. `g10.auction-notifications-order.US1-TC2`
   - Under HKD settlement, the letter names no conversion rate. `g10.auction-notifications-order.US1-TC2`
3. admin(operator) reissues the invoice on `<winner_order_1>`.
4. Open the winner's inbox and the send log.
   - One payment-reminder letter for the new invoice. `g10.auction-notifications-order.US1-TC3`
   - No invoice-reissued letter. `g10.auction-notifications-order.US1-TC3`
5. Wait until 24 hours before the payment deadline.
6. Open the winner's inbox.
   - One final-notice letter for `<winner_order_2>`. `g10.auction-notifications-order.US1-TC4`
   - No letter waits until the deadline transition itself. `g10.auction-notifications-order.US1-TC4`
7. Wait until day 3 after invoice issue.
8. Open the winner's inbox for reminder kinds.
   - No day-3, day-6, or final-notice payment reminder for that invoice. `g10.auction-notifications-order.US1-TC5`
9. Deliver the payment confirmation webhook again.
10. Open the winner's inbox and the send log.
   - No second payment-received letter. `g10.auction-notifications-order.US1-TC6`

## Walk 2: Winner contacts support from a post-close letter

**Starting state:**

**Steps 1–3 setup:**

- customer(winner, holds `<winner_order_5>`) has a registered email and `<letter_kind>` is due for `<winner_order_5>`.

**Steps 4–6 setup:**

- customer(winner, holds `<winner_order_6>`) has a registered email and can open `<the winner's auction order url>` for the same payment-overdue order.

**Steps 7–8 setup:**

- customer(winner, holds `<winner_order_7>`) opens a payment overdue letter in a browser mail surface that does not hand off to a system mail client.

**Steps 9–10 setup:**

- customer(winner, holds `<winner_order_8>`) has a registered email and `<letter_kind>` is the latest letter for `<winner_order_8>`.

**Steps 11–13 setup:**

- customer(winner) has a registered email.
- An operator has recorded a partial payment on `<winner_order_9>` and the partial-payment letter is due.

**Shared test data:**

**Steps 1–3 data:**

| `<letter_kind>` | `<winner_order_5>` |
| --- | --- |
| Setup overdue | An auction order whose setup overdue letter is due |
| Payment overdue | An auction order whose payment overdue letter is due |
| Order cancelled | An auction order whose order cancelled letter is due |
| Delivered | An auction order whose delivered letter is due |

**Steps 4–6 data:**

| Field | Value |
| --- | --- |
| winner_order_6 | An auction order in Payment Overdue with a payment overdue letter already sent |
| invoice_id | The issued invoice id on that order |

| Field | Value |
| --- | --- |
| the winner's auction order url | The winner order URL for the seeded order in this case; bind its URL only |

**Steps 7–8 data:**

| Field | Value |
| --- | --- |
| winner_order_7 | An auction order whose payment overdue letter is open |

**Steps 9–10 data:**

| `<letter_kind>` | `<winner_order_8>` |
| --- | --- |
| Setup overdue | An auction order whose setup overdue letter is open |
| Payment overdue | An auction order whose payment overdue letter is open |
| Order cancelled | An auction order whose order cancelled letter is open |
| Delivered | An auction order whose delivered letter is open |

**Steps 11–13 data:**

| Field | Value |
| --- | --- |
| winner_order_9 | An auction order whose partial-payment letter is due |
| invoice_id | The current invoice id on that order |
| receipt_ids | Receipt ids recorded so far |

### Route

1. Wait for the letter of type `<letter_kind>` for `<winner_order_5>`.
2. Open the letter.
3. Read the letter body and the Contact Us link.
   - The letter body names `support@grade10.com`. `g10.auction-notifications-order.US1-TC7`
   - Contact Us is a `mailto:` to `support@grade10.com` with subject and body prefilling the ready email for that order. `g10.auction-notifications-order.US1-TC7`
   - The mailto is not a bare `mailto:support@grade10.com` without subject and body. `g10.auction-notifications-order.US1-TC7`
4. Open the payment overdue letter for `<winner_order_6>` and read the Contact Us `mailto:` subject and body.
5. Open `<the winner's auction order url>` for that order.
6. Click Contact Us and read Subject and Message.
   - Letter mailto subject equals the dialog Subject `Auction order `<invoice_id>`: payment overdue`. `g10.auction-notifications-order.US1-TC11`
   - Letter mailto body matches the dialog Message order facts. `g10.auction-notifications-order.US1-TC11`
7. Open the payment overdue letter for `<winner_order_7>`.
8. Read the letter body without activating Contact Us.
   - The letter body still shows `support@grade10.com` for the collector to copy by hand. `g10.auction-notifications-order.US1-TC12`
9. Open the letter of type `<letter_kind>` for `<winner_order_8>`.
10. Inspect the Contact Us href.
   - The href includes a subject query. `g10.auction-notifications-order.US1-TC13`
   - The href includes a body query. `g10.auction-notifications-order.US1-TC13`
   - The href is not only `mailto:support@grade10.com`. `g10.auction-notifications-order.US1-TC13`
11. Wait for the partial-payment letter for `<winner_order_9>`.
12. Open the letter.
13. Read the letter body and the Contact Us link.
   - The letter body names `support@grade10.com`. `g10.auction-notifications-order.US1-TC14`
   - Contact Us is a `mailto:` to `support@grade10.com`. `g10.auction-notifications-order.US1-TC14`
   - The mailto subject is `Auction order `<invoice_id>`: partial payment`. `g10.auction-notifications-order.US1-TC14`
   - The mailto body may list `<receipt_ids>` and does not name the remaining balance. `g10.auction-notifications-order.US1-TC14`

## Walk 3: Winner reads shipment and settlement-currency letters

**Starting state:**

**Steps 1–2 setup:**

- customer(winner) has a registered email.
- `<winner_order_10>` reads Preparing Shipment.

**Steps 3–3 setup:**

- A sent invoice remains unpaid; its order uses `<settlement_currency>` and has invoice total `<reminder_amount>`.

**Steps 4–4 setup:**

- A winner has an order using `<settlement_currency>` with a recorded payment of `<amount_received>`.

**Steps 5–6 setup:**

- customer(winner) has a pending invoice in HKD.
- admin(operator) can reissue the invoice on `<winner_order_11>`.

**Steps 7–8 setup:**

- customer(winner, holds `<winner_order_12>`) has a registered email and a pending unpaid invoice in HKD, for a USD listing won at `<winning bid>`.

**Steps 9–9 setup:**

- An internal bidder wins and its order is created automatically at listing close.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| winner_order_10 | An auction order in Preparing Shipment, belonging to the winner; bind the order identifier only |

**Steps 3–3 data:**

| `<settlement_currency>` | `<reminder_amount>` | Fixture notes |
| --- | --- | --- |
| USD | USD3,120 | Representative USD amount; any positive USD amount remains in the same partition; `<reminder_amount>`: 312000 minor units in USD |
| HKD | HKD1,031 | Fixed source fixture; `<reminder_amount>`: 103100 minor units in HKD |

**Steps 4–4 data:**

| `<settlement_currency>` | `<amount_received>` | Fixture notes |
| --- | --- | --- |
| USD | USD3,120 | `<amount_received>`: 312000 minor units in USD |
| HKD | HKD1,031 | `<amount_received>`: 103100 minor units in HKD |

**Steps 5–6 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_11 | An auction order with a pending HKD invoice, for a USD listing won at `<winning bid>` | · |
| winning bid | USD2,400 | (range: >0 minor units) |
| new invoice total | USD131.21 | (13121 minor units) |

**Steps 7–8 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_12 | An auction order with a pending HKD invoice and a known payment deadline | · |
| winning bid | USD2,400 | (range: >0 minor units) |
| invoice total | HKD1,031.00 | (103100 minor units) |

### Route

1. Dispatch `<winner_order_10>` with a carrier and a tracking number, and no tracker link.
2. Open the winner's inbox and read the shipped letter.
   - The primary action is View order, and it opens `<winner_order_10>`'s Winner Order. `g10.auction-notifications-order.US1-TC55`
   - The tracking number reads as plain text, not a link. `g10.auction-notifications-order.US1-TC55`
   - The letter offers no track-and-trace action. `g10.auction-notifications-order.US1-TC55`
3. Read a later payment reminder.
   - Any amount in the reminder uses `<settlement_currency>`. `g10.auction-notifications-order.US1-TC56`
   - The reminder includes no USD winning bid under HKD settlement. `g10.auction-notifications-order.US1-TC56`
4. Read the payment-received letter and receipt.
   - The received amount and receipt use `<settlement_currency>`. `g10.auction-notifications-order.US1-TC57`
   - Under HKD settlement, neither prints the USD winning bid or a conversion rate. `g10.auction-notifications-order.US1-TC57`
5. admin(operator) changes the settlement currency of `<winner_order_11>` to USD and reissues the invoice.
6. Open the winner's inbox and the send log.
   - One payment-reminder letter exists for the new invoice and names `<new invoice total>` in USD. `g10.auction-notifications-order.US1-TC58`
   - No amount in it reads in HKD. `g10.auction-notifications-order.US1-TC58`
   - The HKD invoice's earlier payment-reminder letter still reads its HKD amounts. `g10.auction-notifications-order.US1-TC58`
   - No invoice-reissued letter exists. `g10.auction-notifications-order.US1-TC58`
7. Let the invoice's payment deadline pass so Grade10 sets it to `expired`.
8. Open the winner's inbox and read the letter.
   - One payment overdue letter exists for `<winner_order_12>`. `g10.auction-notifications-order.US1-TC59`
   - It names `<invoice total>` as the outstanding amount in HKD. `g10.auction-notifications-order.US1-TC59`
   - It names no USD amount and no conversion rate. `g10.auction-notifications-order.US1-TC59`
9. Read the internal bidder's order letter history after close.
   - No order letters are sent to the internal bidder. `g10.auction-notifications-order.US1-TC60`

## g10.auction-notifications-order.US1: Post-close letters

**As a** customer(winner),
**I want** the letters Grade10 sends about my auction order,
**so that** I know what to do next without guessing.

<!-- trace:case id=g10.auction-notifications-order.TC-8bw rev=3 covers=g10.auction-notifications-order.SC-pyd -->
### g10.auction-notifications-order.US1-TC1: Auction-won letter names the USD winning bid before setup

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Post-close letters

**Pre-conditions:**

* A collector wins a USD listing. No settlement currency is selected yet.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winning bid | USD101.00 | (10100 minor units) |

**Steps:**

1. Read the auction-won letter.

**Expected Results:**

* The letter names `<winning bid>` in USD.
* It names no HKD amount and no conversion rate.

<!-- trace:case id=g10.auction-notifications-order.TC-5o0 rev=4 covers=g10.auction-notifications-order.SC-tfm,g10.auction-notifications-order.SC-3mo -->
### g10.auction-notifications-order.US1-TC2: Payment reminder uses the chosen settlement currency

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Post-close letters

**Pre-conditions:**

* A winner has chosen `<settlement_currency>` for an order won at `<winning_bid>`, and an operator is ready to send its invoice.

**Test data:**

| `<settlement_currency>` | `<winning_bid>` | `<payment_reminder_total>` | Fixture notes |
| --- | --- | --- | --- |
| USD | USD2,600 | USD3,120 | USD winning bid is representative; any positive USD winning bid with this invoice fixture remains in the same partition; `<payment_reminder_total>`: 312000 minor units in USD |
| HKD | USD101 | HKD1,030.00 | Fixed source fixture; `<winning_bid>`: 10100 minor units in USD; `<payment_reminder_total>`: 103000 minor units in HKD |

**Steps:**

1. Send the invoice and read the payment-reminder letter.

**Expected Results:**

* The reminder amount is `<payment_reminder_total>` and uses `<settlement_currency>`.
* The letter does not repeat the USD winning bid.
* Under HKD settlement, the letter names no conversion rate.

<!-- trace:case id=g10.auction-notifications-order.TC-5o0 rev=1 covers=g10.auction-notifications-order.SC-2d0,g10.auction-notifications-order.SC-kkg,g10.auction-notifications-order.SC-s24,g10.auction-notifications-order.SC-dv3,g10.auction-notifications-order.SC-nrz,g10.auction-notifications-order.SC-7jz,g10.auction-notifications-order.SC-pnf,g10.auction-notifications-order.SC-wmw,g10.auction-notifications-order.SC-y5o,g10.auction-notifications-order.SC-3di,g10.auction-notifications-order.SC-18a,g10.auction-notifications-order.SC-4u6,g10.auction-notifications-order.SC-jw9,g10.auction-notifications-order.SC-qsh,g10.auction-notifications-order.SC-qmq,g10.auction-notifications-order.SC-pqi,g10.auction-notifications-order.SC-gec,g10.auction-notifications-order.SC-kas,g10.auction-notifications-order.SC-mva,g10.auction-notifications-order.SC-7pc,g10.auction-notifications-order.SC-ek4,g10.auction-notifications-order.SC-q85,g10.auction-notifications-order.SC-n3n,g10.auction-notifications-order.SC-dnr -->
### g10.auction-notifications-order.US1-TC3: Reissue sends payment reminder only

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner, holds `<winner_order_1>`) has a pending or expired invoice.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_1 | An auction order whose invoice an operator can reissue |

**Steps:**

1. admin(operator) reissues the invoice on `<winner_order_1>`.
2. Open the winner's inbox and the send log.

**Expected Results:**

* One payment-reminder letter for the new invoice.
* No invoice-reissued letter.

<!-- trace:case id=g10.auction-notifications-order.TC-oqs rev=1 covers=g10.auction-notifications-order.SC-75a,g10.auction-notifications-order.SC-3bl,g10.auction-notifications-order.SC-xae,g10.auction-notifications-order.SC-h6q,g10.auction-notifications-order.SC-1x0,g10.auction-notifications-order.SC-ekh,g10.auction-notifications-order.SC-oc3 -->
### g10.auction-notifications-order.US1-TC4: Final notice is 24 hours before the payment deadline

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Reminder cadence

**Pre-conditions:**

* customer(winner, holds `<winner_order_2>`) has a pending unpaid invoice.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_2 | An auction order with a pending invoice and a known payment deadline |

**Steps:**

1. Wait until 24 hours before the payment deadline.
2. Open the winner's inbox.

**Expected Results:**

* One final-notice letter for `<winner_order_2>`.
* No letter waits until the deadline transition itself.

<!-- trace:case id=g10.auction-notifications-order.TC-tvz rev=1 covers=g10.auction-notifications-order.SC-75a,g10.auction-notifications-order.SC-3bl,g10.auction-notifications-order.SC-xae,g10.auction-notifications-order.SC-h6q,g10.auction-notifications-order.SC-1x0,g10.auction-notifications-order.SC-ekh,g10.auction-notifications-order.SC-oc3 -->
### g10.auction-notifications-order.US1-TC5: Paying early cancels later reminders

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Reminder cadence

**Pre-conditions:**

* customer(winner, holds `<winner_order_3>`) pays on day 2 after the invoice was issued.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_3 | An auction order whose invoice was issued two days ago and is now paid |

**Steps:**

1. Wait until day 3 after invoice issue.
2. Open the winner's inbox for reminder kinds.

**Expected Results:**

* No day-3, day-6, or final-notice payment reminder for that invoice.

<!-- trace:case id=g10.auction-notifications-order.TC-xwr rev=1 covers=g10.auction-notifications-order.SC-mcc,g10.auction-notifications-order.SC-d23 -->
### g10.auction-notifications-order.US1-TC6: A retried payment confirmation sends nothing twice

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Delivery discipline

**Pre-conditions:**

* The payment-received letter for `<winner_order_4>` has already been sent.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_4 | An auction order whose payment-received letter was sent |

**Steps:**

1. Deliver the payment confirmation webhook again.
2. Open the winner's inbox and the send log.

**Expected Results:**

* No second payment-received letter.

<!-- trace:case id=g10.auction-notifications-order.TC-gv0 rev=1 covers=g10.auction-notifications-order.SC-hhx -->
### g10.auction-notifications-order.US1-TC7: A post-close letter Contact Us link carries the ready mailto

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner, holds `<winner_order_5>`) has a registered email and `<letter_kind>` is due for `<winner_order_5>`.

**Test data:**

| `<letter_kind>` | `<winner_order_5>` |
| --- | --- |
| Setup overdue | An auction order whose setup overdue letter is due |
| Payment overdue | An auction order whose payment overdue letter is due |
| Order cancelled | An auction order whose order cancelled letter is due |
| Delivered | An auction order whose delivered letter is due |

**Steps:**

1. Wait for the letter of type `<letter_kind>` for `<winner_order_5>`.
2. Open the letter.
3. Read the letter body and the Contact Us link.

**Expected Results:**

* The letter body names `support@grade10.com`.
* Contact Us is a `mailto:` to `support@grade10.com` with subject and body prefilling the ready email for that order.
* The mailto is not a bare `mailto:support@grade10.com` without subject and body.

<!-- trace:case id=g10.auction-notifications-order.TC-y9r rev=1 covers=g10.auction-notifications-order.SC-xbe -->
### g10.auction-notifications-order.US1-TC11: Overdue letter mailto matches Winner Order subject and body for the same order

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
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner, holds `<winner_order_6>`) has a registered email and can open `<the winner's auction order url>` for the same payment-overdue order.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_6 | An auction order in Payment Overdue with a payment overdue letter already sent |
| invoice_id | The issued invoice id on that order |

| Field | Value |
| --- | --- |
| the winner's auction order url | The winner order URL for the seeded order in this case; bind its URL only |

**Steps:**

1. Open the payment overdue letter for `<winner_order_6>` and read the Contact Us `mailto:` subject and body.
2. Open `<the winner's auction order url>` for that order.
3. Click Contact Us and read Subject and Message.

**Expected Results:**

* Letter mailto subject equals the dialog Subject `Auction order `<invoice_id>`: payment overdue`.
* Letter mailto body matches the dialog Message order facts.

<!-- trace:case id=g10.auction-notifications-order.TC-emn rev=1 covers=g10.auction-notifications-order.SC-xbe -->
### g10.auction-notifications-order.US1-TC12: Letter Contact Us still names the address when no mail client will open

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner, holds `<winner_order_7>`) opens a payment overdue letter in a browser mail surface that does not hand off to a system mail client.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_7 | An auction order whose payment overdue letter is open |

**Steps:**

1. Open the payment overdue letter for `<winner_order_7>`.
2. Read the letter body without activating Contact Us.

**Expected Results:**

* The letter body still shows `support@grade10.com` for the collector to copy by hand.

<!-- trace:case id=g10.auction-notifications-order.TC-8ag rev=1 covers=g10.auction-notifications-order.SC-fza,g10.auction-notifications-order.SC-kn8 -->
### g10.auction-notifications-order.US1-TC13: Overdue cancelled and delivered Contact Us are not a bare support mailto

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner, holds `<winner_order_8>`) has a registered email and `<letter_kind>` is the latest letter for `<winner_order_8>`.

**Test data:**

| `<letter_kind>` | `<winner_order_8>` |
| --- | --- |
| Setup overdue | An auction order whose setup overdue letter is open |
| Payment overdue | An auction order whose payment overdue letter is open |
| Order cancelled | An auction order whose order cancelled letter is open |
| Delivered | An auction order whose delivered letter is open |

**Steps:**

1. Open the letter of type `<letter_kind>` for `<winner_order_8>`.
2. Inspect the Contact Us href.

**Expected Results:**

* The href includes a subject query.
* The href includes a body query.
* The href is not only `mailto:support@grade10.com`.

<!-- trace:case id=g10.auction-notifications-order.TC-dwz rev=1 covers=g10.auction-notifications-order.SC-0sv -->
### g10.auction-notifications-order.US1-TC14: Partial-payment letter Contact Us carries the ready mailto without the balance

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner) has a registered email.
* An operator has recorded a partial payment on `<winner_order_9>` and the partial-payment letter is due.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_9 | An auction order whose partial-payment letter is due |
| invoice_id | The current invoice id on that order |
| receipt_ids | Receipt ids recorded so far |

**Steps:**

1. Wait for the partial-payment letter for `<winner_order_9>`.
2. Open the letter.
3. Read the letter body and the Contact Us link.

**Expected Results:**

* The letter body names `support@grade10.com`.
* Contact Us is a `mailto:` to `support@grade10.com`.
* The mailto subject is `Auction order `<invoice_id>`: partial payment`.
* The mailto body may list `<receipt_ids>` and does not name the remaining balance.

<!-- trace:case id=g10.auction-notifications-order.TC-i2x rev=1 covers=g10.auction-notifications-order.SC-bgc -->
### g10.auction-notifications-order.US1-TC55: A shipped letter with no tracker link leads with the order

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
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner) has a registered email.
* `<winner_order_10>` reads Preparing Shipment.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_10 | An auction order in Preparing Shipment, belonging to the winner; bind the order identifier only |

**Steps:**

1. Dispatch `<winner_order_10>` with a carrier and a tracking number, and no tracker link.
2. Open the winner's inbox and read the shipped letter.

**Expected Results:**

* The primary action is View order, and it opens `<winner_order_10>`'s Winner Order.
* The tracking number reads as plain text, not a link.
* The letter offers no track-and-trace action.

<!-- trace:case id=g10.auction-notifications-order.TC-ew9 rev=2 -->
### g10.auction-notifications-order.US1-TC56: Later payment reminder uses the settlement currency

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
* **Trace:** Post-close letters

**Pre-conditions:**

* A sent invoice remains unpaid; its order uses `<settlement_currency>` and has invoice total `<reminder_amount>`.

**Test data:**

| `<settlement_currency>` | `<reminder_amount>` | Fixture notes |
| --- | --- | --- |
| USD | USD3,120 | Representative USD amount; any positive USD amount remains in the same partition; `<reminder_amount>`: 312000 minor units in USD |
| HKD | HKD1,030.00 | Fixed source fixture; `<reminder_amount>`: 103000 minor units in HKD |

**Steps:**

1. Read a later payment reminder.

**Expected Results:**

* Any amount in the reminder uses `<settlement_currency>`.
* The reminder includes no USD winning bid under HKD settlement.

<!-- trace:case id=g10.auction-notifications-order.TC-vxo rev=3 covers=g10.auction-notifications-order.SC-16k,g10.auction-notifications-order.SC-3g9 -->
### g10.auction-notifications-order.US1-TC57: Payment received letter lists the order's lines and totals in the settlement currency

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
* **Testability:** manual
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner settled in `<settlement_currency>`, account language `<letter_language>`) has just paid `<order_n>` in full by `<method>`.
* The winner can open the Payment received letter in `<winner_mailbox>`.

**Test data:**

| Field | Value |
| --- | --- |
| order_n | The order of the row, paid with the method and rule of the row; bind its identity only |
| winner_mailbox | The inbox of the winner's registered email address |

| Row | `<settlement_currency>` | `<letter_language>` | `<method>` | `<usd_lines>` | `<subtotal>` | `<fee>` | `<order_total>` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| USD order | USD | English | Bank transfer, confirmed by an operator, bank transfer fee USD5.00 | Winning Bid USD101.00, Buyer's Premium USD20.20, Shipping & Handling USD10.01 | USD131.21 | USD5.00 | USD136.21 |
| HKD order | HKD | English | Card, HKD rule 3.4% plus HKD2.35 | Winning Bid USD101.00, Buyer's Premium USD20.20, Shipping & Handling USD10.01 | HKD1,030.00 | HKD38.69 | HKD1,068.69 |
| HKD order in Chinese | HKD | Traditional Chinese | Card, HKD rule 3.4% plus HKD2.35 | Winning Bid USD101.00, Buyer's Premium USD20.20, Shipping & Handling USD10.01 | HKD1,030.00 | HKD38.69 | HKD1,068.69 |

**Steps:**

1. Open the Payment received letter in `<winner_mailbox>`.
2. Read the letter's lines, Subtotal, Payment Processing Fee and Order Total.
3. Open the attached receipt PDF.

**Expected Results:**

* The letter lists `<usd_lines>` in USD, in `<letter_language>`.
* It then shows Subtotal `<subtotal>`, Payment Processing Fee `<fee>` and Order Total `<order_total>`, in HKD with two decimals for an HKD order and in USD for a USD order, which shows no HKD amount.
* The letter names `<order_total>` as the amount paid.
* The letter names no rate and shows no conversion note.
* Amounts use English grouping and punctuation whatever the language.
* The receipt PDF is the only attachment and prints the same lines and Order Total.

<!-- trace:case id=g10.auction-notifications-order.TC-l6s rev=2 covers=g10.auction-notifications-order.SC-0e7 -->
### g10.auction-notifications-order.US1-TC58: A reissue after a currency change sends the reminder in the new currency

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
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner) has a pending invoice in HKD.
* admin(operator) can reissue the invoice on `<winner_order_11>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_11 | An auction order with a pending HKD invoice, for a USD listing won at `<winning bid>` | · |
| winning bid | USD2,400 | (range: >0 minor units) |
| new invoice total | USD131.21 | (13121 minor units) |

**Steps:**

1. admin(operator) changes the settlement currency of `<winner_order_11>` to USD and reissues the invoice.
2. Open the winner's inbox and the send log.

**Expected Results:**

* One payment-reminder letter exists for the new invoice and names `<new invoice total>` in USD.
* No amount in it reads in HKD.
* The HKD invoice's earlier payment-reminder letter still reads its HKD amounts.
* No invoice-reissued letter exists.

<!-- trace:case id=g10.auction-notifications-order.TC-xsq rev=3 covers=g10.auction-notifications-order.SC-7qg -->
### g10.auction-notifications-order.US1-TC59: The payment overdue letter names the outstanding amount in the settlement currency

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
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner, holds `<winner_order_12>`) has a registered email and a pending unpaid invoice in HKD, for a USD listing won at `<winning bid>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_12 | An auction order with a pending HKD invoice and a known payment deadline | · |
| winning bid | USD2,400 | (range: >0 minor units) |
| invoice total | HKD1,030.00 | (103000 minor units) |

**Steps:**

1. Let the invoice's payment deadline pass so Grade10 sets it to `expired`.
2. Open the winner's inbox and read the letter.

**Expected Results:**

* One payment overdue letter exists for `<winner_order_12>`.
* It names `<invoice total>` as the outstanding amount in HKD.
* It names no USD amount and no conversion rate.

<!-- trace:case id=g10.auction-notifications-order.TC-i7q rev=1 -->
### g10.auction-notifications-order.US1-TC60: Internal bidder receives no order letters

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
* **Trace:** Post-close letters

**Pre-conditions:**

* An internal bidder wins and its order is created automatically at listing close.

**Steps:**

1. Read the internal bidder's order letter history after close.

**Expected Results:**

* No order letters are sent to the internal bidder.

<!-- trace:case id=g10.auction-notifications-order.TC-7nr rev=1 covers=g10.auction-notifications-order.SC-xbe -->
### g10.auction-notifications-order.US1-TC8: Payment overdue letter Contact Us carries the ready mailto and names the address (folded into g10.auction-notifications-order.US1-TC7)

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner of `<lot_1>`) has a registered email.
* The payment deadline for `<lot_1>` has just passed unpaid.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A won lot whose payment overdue letter is due |
| `<invoice_id>` | The issued invoice id on that order |

**Steps:**

1. Wait for the payment overdue letter for `<lot_1>`.
2. Open the letter.
3. Read the letter body and the Contact Us link.

**Expected Results:**

* The letter body names `support@grade10.com`.
* Contact Us is a `mailto:` to `support@grade10.com`.
* The mailto subject is `Auction order `<invoice_id>`: payment overdue`.
* The mailto includes a body with the matching order facts.

<!-- trace:case id=g10.auction-notifications-order.TC-l79 rev=1 covers=g10.auction-notifications-order.SC-fza -->
### g10.auction-notifications-order.US1-TC9: Cancelled letter Contact Us carries the ready mailto and names the address (folded into g10.auction-notifications-order.US1-TC7)

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner of `<lot_1>`) has a registered email.
* admin(operator) has cancelled the unpaid order for `<lot_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A won lot whose order cancelled letter is due |

**Steps:**

1. Wait for the order cancelled letter for `<lot_1>`.
2. Open the letter.
3. Read the letter body and the Contact Us link.

**Expected Results:**

* The letter body names `support@grade10.com`.
* Contact Us is a `mailto:` to `support@grade10.com` with subject and body prefilling the same ready email as Winner Order Contact Us for that order.
* The mailto is not a bare `mailto:support@grade10.com` without subject and body.

<!-- trace:case id=g10.auction-notifications-order.TC-wcd rev=1 covers=g10.auction-notifications-order.SC-kn8 -->
### g10.auction-notifications-order.US1-TC10: Delivered letter Contact Us carries the ready mailto and names the address (folded into g10.auction-notifications-order.US1-TC7)

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner of `<lot_1>`) has a registered email.
* The carrier has confirmed delivery for `<lot_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A won lot whose delivered letter is due |
| `<invoice_id>` | The paid invoice id on that order |

**Steps:**

1. Wait for the delivered letter for `<lot_1>`.
2. Open the letter.
3. Read the letter body and the Contact Us link.

**Expected Results:**

* The letter body names `support@grade10.com`.
* Contact Us is a `mailto:` to `support@grade10.com` with subject and body prefilling the same ready email as Winner Order Contact Us for that order.
* The mailto is not a bare `mailto:support@grade10.com` without subject and body.

## Settled

- Cancelled and delivered subject reason fragments are `cancelled` and `delivered`
- Partial-payment letter Contact Us is in scope with the same ready mailto
- Subject uses the order's current invoice id after a reissue
- Delivered letter names the address and time recorded on the order at carrier confirmation
- One payment reminder per reissue; a repeated confirmation of the same reissue sends nothing twice
- Reissue parks superseded reminders and starts the day-3 / day-6 sequence for the new invoice — durable Reminder cadence; not restated as a new root here
- Mute applies to listing alert mail in `notifications`, not to winner order letters
- Contact Us uses the same ready email as Winner Order: letters prefill
`mailto:support@grade10.com` and name that address in the body
- **Archived fold records — 2026-10-12 suite rewrite** —
  - **2026-09-18-add-winner-setup-overdue-mail** — `order-mail-US1-TC1-1` → `g10.auction-notifications-order.US1-TC1`; `order-mail-US1-TC2-1` → `g10.auction-notifications-order.US1-TC2`; `order-mail-US1-TC50-1` → current journey cases are the replacement record; `order-mail-US1-TC54-1` → current journey cases are the replacement record; `order-mail-US1-TC51-1` → current journey cases are the replacement record.
  - **2026-09-18-email-trigger-revision** — `order-mail-US1-TC13-1` → `g10.auction-notifications-order.US1-TC13`; `order-mail-US1-TC14-1` → `g10.auction-notifications-order.US1-TC14`; `order-mail-US1-TC15-1` → current journey cases are the replacement record; `order-mail-US1-TC16-1` → current journey cases are the replacement record; `order-mail-US1-TC17-1` → current journey cases are the replacement record; `order-mail-US1-TC18-1` → current journey cases are the replacement record; `order-mail-US1-TC19-1` → current journey cases are the replacement record.
- `g10.auction-notifications-order.US1-TC8`, `g10.auction-notifications-order.US1-TC9` and `g10.auction-notifications-order.US1-TC10` fold into `g10.auction-notifications-order.US1-TC7`; the surviving case runs each post-close letter row.
- **Archived replacement records — 2026-10-12 suite rewrite** — `order-mail-US1-TC3-1` → `g10.auction-notifications-order.US1-TC3`; `order-mail-US1-TC4-1` → `g10.auction-notifications-order.US1-TC4`; `order-mail-US1-TC5-1` → `g10.auction-notifications-order.US1-TC5`; `order-mail-US1-TC6-1` → `g10.auction-notifications-order.US1-TC6`; `order-mail-US1-TC7-1` → `g10.auction-notifications-order.US1-TC7`; `order-mail-US1-TC8-1` → `g10.auction-notifications-order.US1-TC7`; `order-mail-US1-TC9-1` → `g10.auction-notifications-order.US1-TC7`; `order-mail-US1-TC10-1` → `g10.auction-notifications-order.US1-TC7`; `order-mail-US1-TC11-1` → `g10.auction-notifications-order.US1-TC11`; `order-mail-US1-TC12-1` → `g10.auction-notifications-order.US1-TC12`.
- None this run. The blind reading's question, which letters keep a USD amount, was answered by the PM as Q18 and the capability's delta as Q24; it needs no entry here.
- The auction-won letter names the winning bid in US$ and no other amount; it is the one letter that keeps a USD amount before the winner picks (decisions Q25).
- The Partial payment received letter lists no lines; it keeps the invoice ID, Receipt ID and receipt PDF (decisions Q24).
- A letter that names only a total names the HKD Order Total and prints no USD winning bid or rate; the payment received letter lists the order's lines, in USD for a USD order and, for an HKD order, the USD lines, then the HKD Subtotal, fee and Order Total (decisions Q9).

## Reconciliation

**Cases** - All seven cases remain drafts. `TC-8bw@3` covers SC-pyd; `TC-5o0@3` covers SC-tfm and SC-3mo; `TC-ew9@1` remains unlinked; `TC-vxo@2` covers SC-16k; `TC-l6s@2` SC-0e7; `TC-xsq@2` SC-7qg; and `TC-i7q@1` remains unlinked. Rows use the USD schedule and winning-bid fixtures, with exact converted HKD values where required. The reissue case preserves the prior letter and asserts the payment-reminder letter.

**Scenario coverage** - All six current delta scenarios are covered: SC-pyd, SC-tfm, SC-3mo, SC-16k, SC-0e7 and SC-7qg. Later reminders and the internal bidder no-letter case have no delta scenarios and remain unlinked. At invoice send and reissue, the active post-sale delta names the payment-reminder letter. The separate invoice-reissued letter was removed by product decision; the feature-set term “invoice” means the payment reminder sent with the invoice.

**Run:** QA1, blind pass for `convert-hkd-order-at-subtotal`, 2026-10-22. The first blind pass read a bundle whose existing suites were empty and whose PRD pages lacked the product manager's edits, both packaging defects of the coordinator. It was resumed against a corrected bundle, with the real suites and the current PRD, and revised. It read no `## Requirements`, no scenario, no `tech-design.md`, no `tasks.md`, no archive and no code. It is the run's own statement, not proof.

**Run:** QA1, second blind pass, 2026-10-22. It extended its cases for the operator's order page and the house order and left this capability's case as it was. Its files started from the blind state, without the dispositions below. It is the run's own statement, not proof.

**Run:** QA2, second reconciliation pass, 2026-10-22, in a fresh context. It read the repaired deltas of the five capabilities, `tasks.md`, `tech-design.md`, `proposal.md`, the journeys and `decisions.md` through Q31, the PRD sections they cite, and both QA1 passes. It recomputed every minor-unit figure and wrote no case from a scenario. A case is linked to a scenario when its results assert every outcome the scenario's THEN and ANDs state, from a starting state of the same class and with values from the same partition. It is a statement, not proof.

**Blind case**

| Case | Disposition |
| --- | --- |
| `US1-TC61` (`TC-cm0`) | Regrouped into `US1-TC57` (`TC-vxo`): the Payment received letter and its receipt PDF are one surface, one starting state and one route. Its English and Traditional Chinese rows, the English grouping result and the attachment result are now rows and results of `TC57`. Dropped; it was never published |

**Existing durable cases**

| Durable case | Verdict | Action |
| --- | --- | --- |
| `US1-TC1` (`TC-8bw`) | Not moved: the won-lot letter keeps the US$ winning bid (decisions Q25) | Left `draft` |
| `US1-TC2` (`TC-5o0@3`) | Contradicted in its HKD row: 103,100 | Rewritten at `@4`; the HKD row reads 103,000 and keeps its links |
| `US1-TC56` (`TC-ew9@1`) | Contradicted in its HKD row: 103,100 | Rewritten at `@2` |
| `US1-TC57` (`TC-vxo@2`) | Contradicted: "neither prints the USD winning bid" fails for a letter that lists the USD lines | Rewritten at `@3` with `TC61` folded in; its USD row now follows SC2 (a bank transfer, a Subtotal, a fee of US$5.00, a total of US$136.21); links SC-66 and SC2 |
| `US1-TC58` (`TC-l6s`) | Not moved: the reissue letter in USD and the earlier HKD letter | Left `draft` |
| `US1-TC59` (`TC-xsq@2`) | Contradicted: outstanding amount 103,100 | Rewritten at `@3` |

`TC-5o0` is also the marker id of `US1-TC3` in the durable suite, a collision that predates this change. A change copy may not re-key a marker, since a marker id never changes, so the owner of the durable suite re-keys `US1-TC3`; `accept:preflight` folds without it.

Walk text that repeats these results stays stale until `/tcs-review` refreshes the walks: Walk 1 steps 3 to 4 (durable lines 79 to 81) and Walk 3 steps 3, 4, 7 and 8 (durable lines 272 to 287 and their data blocks).

**Scenario coverage**

| Scenario | Covered by |
| --- | --- |
| `order-mail-SC-63` | `US1-TC1`, unchanged |
| `order-mail-SC-64`, `order-mail-SC-65` | `US1-TC2`, one row each |
| `order-mail-SC-66` | `US1-TC57`, HKD row; its fixture is the scenario's |
| `g10.auction-notifications-order.SC2` | `US1-TC57`, USD row |
| `order-mail-SC-67` | `US1-TC59` |
| `order-mail-SC-68` | `US1-TC58`, unchanged |

**Out of suite:** g10.auction-notifications-order.SC1

SC1 is a free charge in the Payment received letter: Shipping & Handling Free, no Insurance or Tax line and a Free fee. The letter preview test of task 4.2 in this store (`apps/emails/emails/auction/order/payment-received.test.mjs`) and the letter test of task 7.1 in the application repository (`emailPort.test.ts`) verify it.

**Uncovered**

- None

**Over-claimed**

- `US1-TC57` step 3 and its last result open the receipt PDF attached to the letter. The attachment is a gap that predates this change; task 7.3 leaves it to a bug fix, and the spec states only that an attached receipt reads the same currency. The step cannot pass until the fix lands

**Contradictions between the readings**

- None

**Anchor coverage**

| Anchor | Cases | Scenarios |
| --- | --- | --- |
| Root group Post-close letters | `US1-TC2`, `TC56`, `TC57`, `TC59`, and the unchanged `TC1`, `TC58` | SC-63 to SC-68 and SC2 covered; SC1 out of suite |

**Raised**

Q24 and Q25 close the two notifications-order rows; the answers sit in `## Settled`.
