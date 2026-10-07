# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-29, tcs-rules r4

**Out of suite:** none.

## winner-order-US1: Winner settles a won lot

**As a** winner,
**I want** to tell Grade10 where to ship and how I will pay, then pay the invoice it sends me,
**so that** the lot I won becomes mine inside a deadline I can see, priced for where it is actually going.

<!-- trace:case id=g10.auction-winner-order.TC-n0y rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### winner-order-US1-TC48-1: Production offers card only until Finance confirms the account

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* Grade10 holds no HKD bank details, as in production.
* customer(winner) holds an auction order in HKD in Awaiting Setup.

**Steps:**

1. Start setup, choose the home address and reach the payment method choice.
2. Send Grade10 a setup confirmation carrying the home address and bank transfer.
3. Reload the order.

**Expected Results:**

* Only card is offered.
* Grade10 refuses the confirmation.
* The order is still Awaiting Setup, with no delivery address and no method recorded.

### winner-order-US1-TC49-1: A currency with no bank details offers card only

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* Payment Settings holds a USD card fee rule, and Grade10 holds no USD bank details.
* customer(winner) holds an auction order in USD in Awaiting Setup.

**Steps:**

1. Choose the home address and reach the payment method choice.
2. Send Grade10 a setup confirmation carrying the home address and bank transfer.
3. Reload the order.

**Expected Results:**

* Only card is offered.
* Grade10 refuses the confirmation.
* The order is still Awaiting Setup, with no delivery address and no method recorded.

### winner-order-US1-TC50-1: The method can change until the winner confirms

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

* Grade10 holds HKD bank details, and Payment Settings holds an HKD card fee rule.
* customer(winner) holds an auction order in HKD in Awaiting Setup, with card chosen and not yet confirmed.

**Steps:**

1. Change the choice to bank transfer.
2. Confirm the home address.
3. Reload the order.

**Expected Results:**

* The order records bank transfer, not card.
* The order reads Preparing Invoice.

### winner-order-US1-TC51-1: A confirmation with no method is refused

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* Grade10 holds HKD bank details, and Payment Settings holds an HKD card fee rule.
* customer(winner) holds an auction order in HKD in Awaiting Setup.

**Steps:**

1. Choose the home address, choose no payment method, and confirm.
2. Reload the order.

**Expected Results:**

* Grade10 refuses the confirmation.
* The order is still Awaiting Setup.

### winner-order-US1-TC52-1: A currency with no card fee rule reads card as not yet available

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

* Outside production, Grade10 holds the sample HKD bank details, and Payment Settings holds no HKD card fee rule.
* customer(winner) holds an auction order in HKD in Awaiting Setup.

**Steps:**

1. Choose the home address and reach the payment method choice.
2. Try to choose card.
3. Send Grade10 a setup confirmation carrying the home address and card.
4. Reload the order.

**Expected Results:**

* Card reads that it is not yet available in HKD, and cannot be chosen.
* Bank transfer is offered.
* Grade10 refuses the confirmation.
* The order holds no delivery address and no method.

### winner-order-US1-TC53-1: With neither method the winner reads payment is not yet available

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

* Payment Settings holds no USD card fee rule, and Grade10 holds no USD bank details.
* customer(winner) holds an auction order in USD in Awaiting Setup.

**Steps:**

1. Choose the home address and reach the payment method choice.
2. Try to choose card, then bank transfer, then confirm.
3. Reload the order.

**Expected Results:**

* The page says payment is not yet available in USD and offers Contact Us.
* Neither method can be chosen, and Grade10 refuses the confirmation.
* The order is still Awaiting Setup, holding no delivery address and no method.

### winner-order-US1-TC56-1: A Traditional Chinese account reads and searches Country/Region in Traditional Chinese

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) whose account language is Traditional Chinese is on delivery Add Address of an auction order in Awaiting Setup.

**Steps:**

1. Open the Country/Region picker and read the names.
2. Type `日本`.

**Expected Results:**

* The names read in Traditional Chinese.
* The list narrows to `日本`.

---

## winner-order-US7: Winner misses the address deadline

**As a** winner who did not confirm a delivery address within 48 hours of lot close,
**I want** Winner Order to read Setup Overdue with Contact Us and no Confirm,
**so that** I know self-service setup has stopped and how to reach Grade10.

### winner-order-US7-TC5-1: The setup deadline still runs where no method is offered

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-07

**Pre-conditions:**

* Payment Settings holds no USD card fee rule, and Grade10 holds no USD bank details.
* customer(winner) holds an auction order in USD in Awaiting Setup, whose lot closed 48 hours ago, with setup not confirmed.
* admin(operator with payment processing).

**Steps:**

1. As the winner, open the order.
2. As the operator, open the order and read what it offers.

**Expected Results:**

* The winner's order reads Setup Overdue.
* The operator can reopen or record its setup.

### winner-order-US7-TC6-1: The one-time address is gone once the setup deadline passes

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-07

**Pre-conditions:**

* customer(winner) added a one-time delivery address to an auction order without saving it and did not confirm before the setup deadline.
* admin(operator with payment processing) reopened its setup after the deadline passed.

**Steps:**

1. As the winner, open the order and read the address picker.

**Expected Results:**

* The picker does not offer the one-time address.

---

## winner-order-US9: Winner pays an invoice by bank transfer

**As a** winner who would rather not pay a card fee,
**I want** to choose bank transfer, see where to send the money and what reference to quote, and send Grade10 proof,
**so that** Grade10 can match my payment and my deadline stops while it is checked.

<!-- trace:case id=g10.auction-winner-order.TC-eu8 rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### winner-order-US9-TC22-1: Bank transfer is recorded with the address where Grade10 holds bank details

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

* Grade10 holds HKD bank details, as outside production.
* customer(winner) holds an auction order in HKD in Awaiting Setup.

**Steps:**

1. Confirm a delivery address with bank transfer.
2. Reload the order.

**Expected Results:**

* Card and bank transfer were both offered, neither selected.
* The order records bank transfer and reads Preparing Invoice.

### winner-order-US9-TC23-1: The choice shows each method's fee wording, neither selected

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

* Grade10 holds HKD bank details, and Payment Settings holds an HKD card fee rule.
* customer(winner) holds an auction order in HKD in Awaiting Setup.

**Steps:**

1. Choose the home address and reach the payment method choice.
2. Read each method.

**Expected Results:**

* Card reads `Card fee about 3.4% + a fixed amount`.
* Bank transfer reads `Bank fee set on your invoice`, naming no amount.
* Neither method is selected.

---

## winner-order-US11: Winner bills a won lot to a different address

**As a** winner who pays from a different address than the one the lot ships to,
**I want** to give that billing address when I confirm where to ship,
**so that** my invoice and receipt show who is billed as well as where the lot goes.

### winner-order-US11-TC5-1: Billing Add Address lists and filters the delivery Country/Region catalogue

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
* **Trace:** winner-order-US-11

**Pre-conditions:**

* customer(winner) is on billing Add Address of an auction order in Awaiting Setup, after unticking Same as delivery address.

**Steps:**

1. Open the Country/Region picker and read the list.
2. Open delivery Add Address's picker and read its list.
3. Back on billing, type `Jap`.

**Expected Results:**

* The billing list holds every country and region in A-Z order, the same list as delivery.
* Typing leaves only the names that match `Jap`, Japan among them.

### winner-order-US11-TC6-1: An unsaved one-time billing address is there on return

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
* **Trace:** winner-order-US-11

**Pre-conditions:**

* customer(winner) holds an auction order in Awaiting Setup, its setup deadline not passed.
* On it, after unticking Same as delivery address, they added a one-time billing address without saving it, and have not confirmed.

**Steps:**

1. Leave the order for another page, then return to it.
2. Read the billing addresses offered.
3. Open the account address book.

**Expected Results:**

* The one-time billing address is still offered for billing.
* The address book does not hold the one-time billing address.

---

## winner-order-US12: Winner confirms delivery when five addresses are already saved

**As a** winner with five saved shipping addresses,
**I want** to confirm a different address for this order without saving a sixth,
**so that** a full address book does not block settlement before the address deadline.

### winner-order-US12-TC12-1: An unsaved one-time delivery address is there on return

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
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner) holds an auction order in Awaiting Setup, its setup deadline not passed.
* On it, they added a one-time delivery address without saving it, and have not confirmed.

**Steps:**

1. Leave the order for another page, then return to it.
2. Read the delivery address picker.
3. Open the account address book.
4. Back on the order, select the one-time delivery address, a payment method, and confirm.

**Expected Results:**

* The delivery picker lists the one-time address ahead of the saved addresses.
* The address book does not hold the one-time address.
* The confirmation is accepted with the one-time delivery address.

---

## winner-order-US16: Winner emails Grade10 from a locked order

**As a** winner whose payment access has closed,
**I want** a ready email with this order's details that I can copy into any mail app,
**so that** I can reach Grade10 without a system mail client, and support can find the order.

<!-- trace:case id=g10.auction-winner-order.TC-nat rev=1 covers=g10.auction-winner-order.SC-i2y -->
### winner-order-US16-TC15-1: Contact Us on an order with no method asks about setup

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
* **Trace:** winner-order-US-16

**Pre-conditions:**

* Payment Settings holds no USD card fee rule, and Grade10 holds no USD bank details.
* customer(winner) holds an auction order in USD in Awaiting Setup.

**Steps:**

1. Open the order and choose Contact Us.
2. Read the Subject and the Message.
3. Read the order status.

**Expected Results:**

* The Subject and Message are those of the `setup overdue` reason.
* The order status still reads Awaiting Setup.

### winner-order-US16-TC16-1: Copy Message confirms through its own state on a locked order

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
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) holds an auction order in Setup Overdue, whose payment access is closed.
* The browser may use the clipboard.

**Steps:**

1. Open the order and choose Contact Us.
2. Choose Copy Message.
3. Watch the button and the page for a few seconds.

**Expected Results:**

* The button reads Copied for a moment, then Copy Message again.
* No toast appears.
* The To and Subject controls are unchanged.

## Settled

- Bank details are held per currency on each lane: the sample account outside production, and none in production until Finance confirms Grade10's account.

## Reconciliation

**Run:** The same agent wrote the blind cases and the scenarios, so the two readings are not independent. The cases were written from the Feature set, the journeys, the proposal, the decisions and the linked PRD sections, then joined to the scenarios on their anchors.

**Run:** 2026-10-06, QA2. A fresh reader joined every scenario and every case in this suite on their anchors, against the durable suite the fold lands on. "Kept with the durable suite" held for the restated Pay Now, Contact Us and card scenarios, not for the method choice: no durable case walks `SC-93`.

| Spec scenario | Disposition |
| --- | --- |
| `winner-order-SC-90` | Covered by `US9-TC22-1` |
| `winner-order-SC-91` | Was uncovered; added `US9-TC23-1` |
| `winner-order-SC-92` | Was uncovered; added `US1-TC49-1` |
| `winner-order-SC-93` | Was uncovered: no durable case walks a changed choice; added `US1-TC50-1` |
| `winner-order-SC-94` | Was uncovered; added `US1-TC51-1` |
| `winner-order-SC-226` | Covered by `US1-TC48-1` |
| `winner-order-SC-248` | Was uncovered; added `US1-TC52-1` |
| `winner-order-SC-249` | Was uncovered; added `US1-TC53-1` |
| `winner-order-SC-250` | Was uncovered; added `US16-TC16-1` |
| `winner-order-SC-257` | Was uncovered; added `US7-TC5-1` |
| `winner-order-SC-49` | Covered by the durable `winner-order-US4-TC3-1` |
| `winner-order-SC-50` | Covered by the durable `winner-order-US4-TC4-1` |
| `winner-order-SC-51` | Covered by the durable `winner-order-US4-TC5-1` |
| `winner-order-SC-52` | Covered by the durable `winner-order-US4-TC6-1` |
| `winner-order-SC-160` | Covered by the durable `winner-order-US16-TC1-1` and `winner-order-US16-TC8-1` |
| `winner-order-SC-161` | Covered by the durable `winner-order-US16-TC7-1` |
| `winner-order-SC-162` | Covered by the durable `winner-order-US16-TC9-1` and `winner-order-US16-TC10-1` |
| `winner-order-SC-163` | Covered by the durable `winner-order-US16-TC11-1` |
| `winner-order-SC-167` | Covered by the durable `winner-order-US16-TC12-1` |
| `winner-order-SC-15` | Covered by the durable `winner-order-US1-TC6-1` |
| `winner-order-SC-35` | Covered by the durable `winner-order-US4-TC1-2` and `winner-order-US9-TC11-1` |
| `winner-order-SC-259`, `SC-260` | Were uncovered; added `US11-TC5-1` |
| `winner-order-SC-261` | Was uncovered; added `US1-TC56-1` |
| `winner-order-SC-254` | Was uncovered; added `US12-TC12-1` |
| `winner-order-SC-255` | Was uncovered; added `US11-TC6-1` |
| `winner-order-SC-256` | Was uncovered; added `US7-TC6-1` |
| `winner-order-SC-262` | Covered by `US16-TC15-1` |
| Contradicted readings | None |

- **Folded:** Q25 as `winner-order-SC-226`.
- **Renumbered** - `winner-order-US1-TC43-1` became `US1-TC48-1`: the durable `winner-order-US1-TC43-1` is a Country/Region filter case, which the fold would have overwritten.
- **Placed under their journeys** - this change's `user-journeys.md` carries `winner-order-US-07`, `-US-11`, `-US-12` and `-US-16` verbatim from the durable file as context journeys. The new cases sit under the journey their scenario serves: `US7-TC5-1` and `US7-TC6-1`, `US11-TC5-1` and `US11-TC6-1`, `US12-TC12-1`, `US16-TC15-1` and `US16-TC16-1`. `US1-TC52-1`, `US1-TC53-1` and `US1-TC56-1` stay under `winner-order-US1`, which their scenarios serve or which is the setup they walk.
- **Split** - the one-time delivery and billing cases became `US12-TC12-1` and `US11-TC6-1`, and the Copy Message check left `US1-TC53-1` for `US16-TC16-1`, so each case walks one journey.
- **Copy Message route** - `winner-order-SC-250` places Copy Message on a locked order, so `US16-TC16-1` starts from a Setup Overdue order. The route this change adds, an order with no method offered, is `US16-TC15-1`, which reads the `setup overdue` reason.
- **Out of suite:** none.
