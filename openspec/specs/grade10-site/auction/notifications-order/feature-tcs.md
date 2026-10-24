# grade10-site/auction/notifications-order Test Cases

**Status:** pending-review · 0/15
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7
**Out of suite (api):** order-mail-SC-06 - a retried payment webhook, which no screen sends

## Background

* A winner's letters are read in the inbox of their account's registered email; `<send log>` is the auction email send log in the admin. A tester moves the environment's clock to reach a moment.
* Every lot is won in USD. An HKD order converts its USD lines to HKD once, at 7.85, a fraction of a cent rounding up; the buyer's premium is 20% of the winning bid.
* Contact Us in a letter is a `mailto:` to `support@grade10.com` that prefills the same ready email as Contact Us on Winner Order, and the letter body names the address too.

| Field | Value |
| --- | --- |
| `<usd lines>` | Winning Bid USD101.00, Buyer's Premium USD20.20, Shipping & Handling USD10.01: USD131.21 |
| `<hkd subtotal>` | HKD1,030.00 (fixed derived: USD131.21 × 7.85, rounded up) |

## Walk 1: A winner follows one order through its letters

Starting state:

- customer(winner) won `<order>` at USD101; no settlement currency is picked yet.
- admin(holds auction:payment) is on `<order>`'s order page.

Shared test data:

| Field | Value |
| --- | --- |
| order | A USD lot's order, settled in HKD by card with the HKD rule 3.4% plus HKD2.35 |

### Route

1. Read the auction-won letter.
   - It names the USD101.00 winning bid, and no HKD amount or rate. `g10.auction-notifications-order.US1-TC1`
2. Once the winner picks HKD, send the invoice; read the payment reminder.
   - It names `<hkd subtotal>`, no USD winning bid and no rate. `g10.auction-notifications-order.US1-TC2`
3. As the winner, pay by card; read the Payment received letter.
   - It lists `<usd lines>`, then Subtotal `<hkd subtotal>`, fee HKD38.69 and Order Total HKD1,068.69. `g10.auction-notifications-order.US1-TC57`
4. Move the clock to day 3 and day 6 after the invoice.
   - No reminder arrives. `g10.auction-notifications-order.US1-TC5`
5. As admin, dispatch with a carrier and a tracking number and no tracker link; read the shipped letter.
   - Its primary action is View order, and the tracking number is plain text. `g10.auction-notifications-order.US1-TC55`

## Walk 2: An overdue winner reaches support from the letter

Starting state:

- customer(winner, signed in) holds `<order>`, whose HKD invoice of `<hkd subtotal>` is due tomorrow and unpaid.

Shared test data:

| Field | Value |
| --- | --- |
| order | A USD lot's order settled in HKD |

### Route

1. Move the clock to 24 hours before the deadline; read the inbox.
   - One final notice for `<order>`. `g10.auction-notifications-order.US1-TC4`
2. Let the deadline pass; read the payment overdue letter.
   - It names `<hkd subtotal>` outstanding, no USD amount and no rate. `g10.auction-notifications-order.US1-TC59`
3. Read the letter's Contact Us and body.
   - The body names `support@grade10.com`; Contact Us prefills a subject and a body. `g10.auction-notifications-order.US1-TC7`
4. Open `<order>` on Winner Order and click Contact Us.
   - Its Subject and Message match the letter's. `g10.auction-notifications-order.US1-TC11`

## g10.auction-notifications-order.US1: Post-close letters

**As a** customer(winner),
**I want** the letters Grade10 sends about my auction order,
**so that** I know what to do next without guessing.

<!-- trace:case id=g10.auction-notifications-order.TC-8bw rev=3 covers=g10.auction-notifications-order.SC-pyd -->
### g10.auction-notifications-order.US1-TC1: The auction-won letter names the USD winning bid before setup

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Post-close letters

**Pre-conditions:**

* customer has just won a lot at USD101; no settlement currency is picked.

**Steps:**

1. Read the auction-won letter.

**Expected Results:**

* It names the winning bid USD101.00, and no HKD amount or conversion rate.

<!-- trace:case id=g10.auction-notifications-order.TC-5o0 rev=4 covers=g10.auction-notifications-order.SC-tfm,g10.auction-notifications-order.SC-3mo -->
### g10.auction-notifications-order.US1-TC2: The payment reminder sent with the invoice uses the settlement currency

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner) picked `<currency>` for an order won at `<winning bid>`; admin(holds auction:payment) is on the order page.

**Test data:**

| `<currency>` | `<winning bid>` | `<total>` |
| --- | --- | --- |
| USD | USD2,600 | USD3,120 (fixed derived: the bid plus its 20% premium) |
| HKD | USD101 | `<hkd subtotal>`, with Shipping & Handling USD10.01 |

**Steps:**

1. Send the invoice.
2. Read the winner's payment reminder.

**Expected Results:**

* It names `<total>` in `<currency>`, does not repeat the USD winning bid, and under HKD names no rate.

<!-- trace:case id=g10.auction-notifications-order.TC-gnp rev=1 -->
### g10.auction-notifications-order.US1-TC3: A reissue sends the payment reminder only

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner) holds `<order>`, whose invoice is pending or expired; admin(holds auction:payment) is on its order page.

**Steps:**

1. Reissue the invoice.
2. Read the winner's inbox and filter `<send log>` by `<order>`.

**Expected Results:**

* One payment reminder for the new invoice, and no invoice-reissued letter.

<!-- trace:case id=g10.auction-notifications-order.TC-l6s rev=2 covers=g10.auction-notifications-order.SC-0e7 -->
### g10.auction-notifications-order.US1-TC58: A reissue after a currency change sends the reminder in the new currency

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner) holds `<order>`, won at USD101 with Shipping & Handling USD10.01, whose HKD invoice of `<hkd subtotal>` is pending; admin(holds auction:payment) is on its order page.

**Steps:**

1. Change the settlement currency to USD and reissue the invoice.
2. Read the winner's inbox.

**Expected Results:**

* One new payment reminder names USD131.21 and no HKD amount; the earlier reminder still reads `<hkd subtotal>`; no invoice-reissued letter.

<!-- trace:case id=g10.auction-notifications-order.TC-ew9 rev=2 -->
### g10.auction-notifications-order.US1-TC56: Later payment reminders use the settlement currency

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
* **Trace:** Reminder cadence

**Pre-conditions:**

* customer(winner) holds an order in `<currency>` whose invoice of `<total>` was sent and is unpaid.

**Test data:**

| `<currency>` | `<total>` |
| --- | --- |
| USD | USD3,120 |
| HKD | `<hkd subtotal>` |

**Steps:**

1. Move the clock to day 3 after the invoice and read the reminder.

**Expected Results:**

* Every amount reads in `<currency>`; under HKD no USD winning bid shows.

<!-- trace:case id=g10.auction-notifications-order.TC-oqs rev=1 covers=g10.auction-notifications-order.SC-75a,g10.auction-notifications-order.SC-3bl,g10.auction-notifications-order.SC-xae,g10.auction-notifications-order.SC-h6q,g10.auction-notifications-order.SC-1x0,g10.auction-notifications-order.SC-ekh,g10.auction-notifications-order.SC-oc3 -->
### g10.auction-notifications-order.US1-TC4: The final notice comes 24 hours before the payment deadline

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Reminder cadence

**Pre-conditions:**

* customer(winner) holds `<order>`, whose invoice is pending and unpaid.

**Steps:**

1. Move the clock to 24 hours before the payment deadline and read the inbox.

**Expected Results:**

* One final notice for `<order>`.

<!-- trace:case id=g10.auction-notifications-order.TC-tvz rev=1 covers=g10.auction-notifications-order.SC-75a,g10.auction-notifications-order.SC-3bl,g10.auction-notifications-order.SC-xae,g10.auction-notifications-order.SC-h6q,g10.auction-notifications-order.SC-1x0,g10.auction-notifications-order.SC-ekh,g10.auction-notifications-order.SC-oc3 -->
### g10.auction-notifications-order.US1-TC5: Paying early stops the later reminders

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner) paid `<order>`'s invoice on day 2 after it was sent.

**Steps:**

1. Move the clock past day 3, day 6 and the final-notice time, and read the inbox.

**Expected Results:**

* No day-3, day-6 or final-notice reminder for that invoice.

<!-- trace:case id=g10.auction-notifications-order.TC-vxo rev=3 covers=g10.auction-notifications-order.SC-16k,g10.auction-notifications-order.SC-3g9 -->
### g10.auction-notifications-order.US1-TC57: The Payment received letter lists the order's lines and totals in the settlement currency

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner, account language `<language>`) has just paid an order with `<usd lines>` in full by `<method>`.

**Test data:**

| `<language>` | `<method>` | `<subtotal>` | `<fee>` | `<order total>` |
| --- | --- | --- | --- | --- |
| English | Bank transfer confirmed by an operator, fee USD5.00 | USD131.21 | USD5.00 | USD136.21 |
| English | Card, HKD rule 3.4% plus HKD2.35 | `<hkd subtotal>` | HKD38.69 | HKD1,068.69 |
| Traditional Chinese | Card, HKD rule 3.4% plus HKD2.35 | `<hkd subtotal>` | HKD38.69 | HKD1,068.69 |

**Steps:**

1. Open the Payment received letter and read its lines and totals.
2. Open the attached receipt PDF.

**Expected Results:**

* Step 1 lists `<usd lines>` in USD, then Subtotal `<subtotal>`, Payment Processing Fee `<fee>` and Order Total `<order total>`, the amount paid; no rate or conversion note; amounts in English grouping, in `<language>` text.
* Step 2: the receipt is the only attachment and prints the same lines and Order Total.

<!-- trace:case id=g10.auction-notifications-order.TC-xsq rev=3 covers=g10.auction-notifications-order.SC-7qg -->
### g10.auction-notifications-order.US1-TC59: The payment overdue letter names the outstanding amount in the settlement currency

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner) holds `<order>`, won at USD101 with Shipping & Handling USD10.01, whose HKD invoice of `<hkd subtotal>` is pending and unpaid.

**Steps:**

1. Let the payment deadline pass and read the inbox.

**Expected Results:**

* One payment overdue letter for `<order>`, naming `<hkd subtotal>` outstanding, no USD amount and no rate.

<!-- trace:case id=g10.auction-notifications-order.TC-i2x rev=1 covers=g10.auction-notifications-order.SC-bgc -->
### g10.auction-notifications-order.US1-TC55: A shipped letter with no tracker link leads with the order

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner) holds `<order>` in Preparing Shipment; admin(holds auction:payment) is on its order page.

**Steps:**

1. Dispatch `<order>` with a carrier and a tracking number, and no tracker link.
2. Open the shipped letter and click its primary action.

**Expected Results:**

* The primary action is View order and opens `<order>` on Winner Order; the tracking number is plain text; no track-and-trace action shows.

<!-- trace:case id=g10.auction-notifications-order.TC-i7q rev=1 -->
### g10.auction-notifications-order.US1-TC60: An internal bidder's order sends no letter

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Post-close letters

**Pre-conditions:**

* The house leads `<listing>` under a committed internal bid and it closes in a few minutes; admin(auction operator) is on `<send log>`.

**Steps:**

1. Let `<listing>` close.
2. Filter `<send log>` by `<listing>` and read the rows from the close.

**Expected Results:**

* No order letter is listed, to the internal bidder or anyone.

<!-- trace:case id=g10.auction-notifications-order.TC-gv0 rev=1 covers=g10.auction-notifications-order.SC-hhx -->
### g10.auction-notifications-order.US1-TC7: A post-close letter's Contact Us carries the ready email and the body names the address

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner) holds `<order>`, whose `<letter>` has arrived.

**Test data:**

| `<letter>` |
| --- |
| Setup overdue |
| Payment overdue |
| Order cancelled |
| Delivered |

**Steps:**

1. Open `<letter>` and read its body and the Contact Us link.

**Expected Results:**

* The body names `support@grade10.com`; Contact Us opens an email to it with a subject and a body for `<order>`, never a bare address.

<!-- trace:case id=g10.auction-notifications-order.TC-y9r rev=1 covers=g10.auction-notifications-order.SC-xbe -->
### g10.auction-notifications-order.US1-TC11: The overdue letter's ready email matches Winner Order's for the same order

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner, signed in) holds `<order>` in Payment Overdue, its payment overdue letter sent.

**Steps:**

1. Click Contact Us in the payment overdue letter and read the email's subject and body.
2. Open `<order>` on Winner Order, click Contact Us, and read Subject and Message.

**Expected Results:**

* Both subjects read `Auction order <invoice id>: payment overdue`, and the two bodies carry the same order facts.

<!-- trace:case id=g10.auction-notifications-order.TC-emn rev=1 covers=g10.auction-notifications-order.SC-xbe -->
### g10.auction-notifications-order.US1-TC12: The letter still names the address when no mail client opens

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Contact Us destination

**Pre-conditions:**

* customer(winner) opens the payment overdue letter in a webmail that hands no `mailto:` to a mail client.

**Steps:**

1. Read the letter body without clicking Contact Us.

**Expected Results:**

* The body shows `support@grade10.com` to copy by hand.

<!-- trace:case id=g10.auction-notifications-order.TC-dwz rev=1 covers=g10.auction-notifications-order.SC-0sv -->
### g10.auction-notifications-order.US1-TC14: The partial-payment letter's ready email names no balance

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Contact Us destination

**Pre-conditions:**

* An operator recorded a partial payment on customer's `<order>`, and its partial-payment letter has arrived.

**Steps:**

1. Open the letter and click Contact Us.

**Expected Results:**

* The body names `support@grade10.com`; the email's subject reads `Auction order <invoice id>: partial payment`, and its body may list the receipt ids and never names the remaining balance.

<!-- trace:case id=g10.auction-notifications-order.TC-8ag rev=1 covers=g10.auction-notifications-order.SC-fza,g10.auction-notifications-order.SC-kn8 -->
### g10.auction-notifications-order.US1-TC13: Overdue, cancelled and delivered Contact Us are not a bare support mailto

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Contact Us destination

**Retirement:** Same letters, route and check as `g10.auction-notifications-order.US1-TC7`, which holds them.

**Pre-conditions:**

* A post-close letter has arrived.

**Steps:**

1. Read its Contact Us link.

**Expected Results:**

* It carries a subject and a body.

<!-- trace:case id=g10.auction-notifications-order.TC-7nr rev=1 covers=g10.auction-notifications-order.SC-xbe -->
### g10.auction-notifications-order.US1-TC8: Payment overdue letter Contact Us carries the ready mailto and names the address

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Contact Us destination

**Retirement:** A row of `g10.auction-notifications-order.US1-TC7`.

**Pre-conditions:**

* A payment overdue letter has arrived.

**Steps:**

1. Read its Contact Us link.

**Expected Results:**

* It prefills the ready email.

<!-- trace:case id=g10.auction-notifications-order.TC-l79 rev=1 covers=g10.auction-notifications-order.SC-fza -->
### g10.auction-notifications-order.US1-TC9: Cancelled letter Contact Us carries the ready mailto and names the address

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Contact Us destination

**Retirement:** A row of `g10.auction-notifications-order.US1-TC7`.

**Pre-conditions:**

* An order cancelled letter has arrived.

**Steps:**

1. Read its Contact Us link.

**Expected Results:**

* It prefills the ready email.

<!-- trace:case id=g10.auction-notifications-order.TC-wcd rev=1 covers=g10.auction-notifications-order.SC-kn8 -->
### g10.auction-notifications-order.US1-TC10: Delivered letter Contact Us carries the ready mailto and names the address

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Contact Us destination

**Retirement:** A row of `g10.auction-notifications-order.US1-TC7`.

**Pre-conditions:**

* A delivered letter has arrived.

**Steps:**

1. Read its Contact Us link.

**Expected Results:**

* It prefills the ready email.

<!-- trace:case id=g10.auction-notifications-order.TC-xwr rev=1 covers=g10.auction-notifications-order.SC-mcc,g10.auction-notifications-order.SC-d23 -->
### g10.auction-notifications-order.US1-TC6: A retried payment confirmation sends nothing twice

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Delivery discipline

**Retirement:** A retried payment webhook is sent by no screen; `order-mail-SC-06` is out of suite (api).

**Pre-conditions:**

* The Payment received letter for an order has been sent.

**Steps:**

1. Deliver the payment confirmation again.

**Expected Results:**

* No second Payment received letter.

---

## Settled

- Cancelled and delivered subject reasons read `cancelled` and `delivered`; the subject uses the order's current invoice id after a reissue.
- The partial-payment letter's Contact Us is in scope with the same ready email; it lists no lines and keeps the invoice id, receipt id and receipt PDF.
- The delivered letter names the address and time recorded on the order at carrier confirmation.
- One payment reminder per reissue; a reissue parks superseded reminders and starts day 3 and day 6 for the new invoice.
- Muting applies to listing alert mail in `notifications`, never to winner order letters.
- The auction-won letter names the winning bid in USD and no other amount; it is the one letter that keeps a USD amount before the winner picks.
- A letter that names only a total names the HKD Order Total and prints no USD winning bid or rate; the Payment received letter lists the USD lines, then the HKD Subtotal, fee and Order Total for an HKD order.
