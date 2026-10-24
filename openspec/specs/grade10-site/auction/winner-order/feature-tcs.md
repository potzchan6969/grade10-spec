# grade10-site/auction/winner-order Test Cases

**Status:** pending-review · 0/93
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7
**Out of suite (api):** winner-order-SC-27

## Background

* Winner Order is the order page a winner opens from My Auctions or from a letter; `<order>` is the order a case reads. The Invoice link beside the Order summary heading opens the invoice page; the invoice and receipt PDFs download from their rows. A winner's letters are read in the inbox of the account's email, and `<send log>` is the admin auction email send log. A tester moves the environment's clock to reach a moment.
* Every listing is won in USD, with a buyer's premium of 20% of the winning bid, at least the USD premium minimum, USD0 unless a case says otherwise. An HKD order lists its lines in USD and converts their sum once at 7.85 to the HKD Subtotal, a fraction of a cent rounding up; a bank transfer fee typed in USD converts alone, below the Subtotal.
* Unless a case says otherwise: Payment Settings holds a USD card fee rule of 4.4% plus USD0.30 and an HKD rule of 3.4% plus HKD2.35; outside production Grade10 holds sample bank details for FPS and HK Local in HKD, and HK Local and International via SWIFT in USD; customer(winner) is signed in, with a saved Home address; an operator is admin(holds payment-processing).
* The address deadline is 48 hours after the listing's actual close, and the payment deadline 7 days after the invoice is sent. Contact Us opens the ready email to support@grade10.com.

## Walk 1: Settle a won listing by card, through to delivery

Starting state:

- customer(winner) leads `<listing>`, which closes within a minute; the account holds Home as its default shipping address.

Shared test data:

| Field | Value |
| --- | --- |
| listing | A USD listing that admin will invoice with Shipping & Handling |

### Route

1. Let `<listing>` close, and open its order from My Auctions; try to pay.
   - One order, Home pre-filled, its charges TBD; paying is refused until the address is confirmed. `g10.auction-winner-order.US1-TC1`
2. Choose Home, USD and card, and confirm.
   - Preparing Invoice, the address shown, nothing to pay. `g10.auction-winner-order.US19-TC2`
3. As admin, send the invoice; as the winner, open the order.
   - Every invoice line, Pay with Card, the address and the listing. `g10.auction-winner-order.US4-TC1`
4. Pay by card; return before it is recorded, then reload once it is.
   - Confirming payment, then Preparing Shipment. `g10.auction-winner-order.US4-TC5`
5. As admin, dispatch with a tracking number and a tracker link; as the winner, read Order Progress and select the number.
   - Shipped, Shipping current, the number opening the carrier's tracker. `g10.auction-winner-order.US2-TC2`
6. Open the receipt.
   - Previous Payments 0, Current Payment Received the total, Remaining Balance Due 0. `g10.auction-winner-order.US2-TC4`

## Walk 2: Settle in HKD by bank transfer, proof returned once

Starting state:

- customer(winner) holds `<order>` in Awaiting Setup, won at USD101.00.

Shared test data:

| Field | Value |
| --- | --- |
| order | An order admin will invoice with Shipping & Handling USD10.01 and no fee |

### Route

1. Choose Home, HKD and FPS, and confirm.
   - Bank transfer on FPS recorded; Preparing Invoice. `g10.auction-winner-order.US9-TC22`
2. As admin, send the invoice; as the winner, read Order Summary.
   - USD101.00, USD20.20 and USD10.01, Subtotal HKD1,030.00 with its note, fee Free. `g10.auction-winner-order.US27-TC1`
3. Open View Bank Details.
   - FPS ID, account name, an FPS QR, the amount and the reference, nothing else. `g10.auction-winner-order.US9-TC1`
4. Submit one PDF as proof.
   - Payment Verifying, the deadline stopped. `g10.auction-winner-order.US9-TC2`
5. As admin, return it with Amount does not match; as the winner, read the order.
   - The reason shows and the deadline runs again. `g10.auction-winner-order.US10-TC8`
6. Submit new proof; as admin, confirm it; as the winner, open the receipt.
   - The USD lines, HKD1,030.00 with its note, and HKD1,030.00 received. `g10.auction-winner-order.US26-TC2`

## Walk 3: Miss the address deadline and reach Grade10

Starting state:

- customer(winner) holds `<order>` in Awaiting Setup, its address deadline an hour away.

Shared test data:

| Field | Value |
| --- | --- |
| order | An order with no confirmed address and no invoice |

### Route

1. Let the deadline pass, and read the order.
   - Setup Overdue, Contact Us, no Confirm. `g10.auction-winner-order.US7-TC1`
2. Select Contact Us.
   - A dialog to support@grade10.com, Copy Message first. `g10.auction-winner-order.US16-TC1`
3. Read Subject and Message.
   - Auction lot `<listing title>`: setup overdue, and no invoice id. `g10.auction-winner-order.US16-TC3`
4. Open the setup overdue letter and select its Contact Us.
   - The same subject and body as the dialog. `g10.auction-winner-order.US16-TC17`
5. As admin, reopen the address form; as the winner, read the inbox and the order, and confirm Home.
   - No letter; a fresh 48 hours; Preparing Invoice. `g10.auction-winner-order.US23-TC4`

## Walk 4: Confirm a one-time address with a full address book

Starting state:

- customer(winner, five saved shipping addresses) holds `<order>` in Awaiting Setup.

Shared test data:

| Field | Value |
| --- | --- |
| order | An order inside its address deadline |

### Route

1. Open the delivery picker and select Add new address.
   - The form opens, Personal selected, no phone country. `g10.auction-winner-order.US12-TC1`
2. Enter a complete address, and select Save this address for future orders.
   - The checkbox stays unticked; its tip says the book is full. `g10.auction-winner-order.US12-TC7`
3. Leave for another page and come back.
   - The one-time address waits at the top of the picker. `g10.auction-winner-order.US12-TC12`
4. Confirm it for this order, and open the address book.
   - The order takes it; the book still holds five. `g10.auction-winner-order.US12-TC2`

## g10.auction-winner-order.US1: Winner settles a won listing

**As a** winner,
**I want** to tell Grade10 where to ship and how I will pay, then pay the invoice it sends me,
**so that** the listing I won becomes mine inside a deadline I can see, priced for where it is actually going.

<!-- trace:case id=g10.auction-winner-order.TC-8q4 rev=2 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC1: A won listing opens one order whose charges read TBD, payable only after the address is confirmed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer leads `<listing>`, which closes within a minute; the account holds `<default>` as its default shipping address.

**Test data:**

| Field | Value |
| --- | --- |
| default | A saved personal address named Home |

**Steps:**

1. Let `<listing>` close, and open its order from My Auctions.
2. Read Order Summary, then hover the Insurance and Tax info tips.
3. Try to pay without confirming the delivery address.

**Expected Results:**

* Step 1: one order exists for `<listing>`, its delivery address pre-filled with `<default>`.
* Step 2: the winning bid and Buyer's Premium show; Shipping & Handling, Insurance and Tax read TBD, none marked as an estimate. The Insurance tip reads `0.9% of the order value during transit.` and the Tax tip `Set by Grade10 for where your order ships. Some orders have none.`
* Step 3 is refused; the order asks the winner to confirm the delivery address.

<!-- trace:case id=g10.auction-winner-order.TC-yuw rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC4: Changing the address shows the old and new totals before paying

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on Winner Order for `<order>`, an unpaid HKD order totalling HKD3,280; `<far>` is saved on the account.

**Test data:**

| Field | Value |
| --- | --- |
| far | A saved address whose shipping and insurance cost HKD50 more |

**Steps:**

1. Change the delivery address to `<far>`.
2. Read the totals before paying.

**Expected Results:**

* Both HKD3,280.00 and the new total HKD3,330.00 show before payment, and no separate HKD50 charge is raised.

<!-- trace:case id=g10.auction-winner-order.TC-h5e rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC8: Every saved address is offered under its name, the default pre-filled

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer holds no saved shipping address and will win `<order>` after step 2.

**Steps:**

1. In the address book, save Home and Work, then set Work as the default.
2. Win a listing and open `<order>`; open the delivery address picker.

**Expected Results:**

* Step 1: both are listed under their names, only Work marked default.
* Step 2: the delivery address is pre-filled with Work, and the picker offers Home and Work.

<!-- trace:case id=g10.auction-winner-order.TC-jje rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC10: An order keeps its copy of an address the book later edits or archives

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) confirmed Home on `<order>`, which reads `<state>`.

**Test data:**

| `<state>` | `<book change>` |
| --- | --- |
| Pending Payment | edit Home's address line 1 to 22 New Street |
| Preparing Invoice | archive Home |

**Steps:**

1. Make `<book change>` in the address book.
2. Open `<order>` and read its delivery address.

**Expected Results:**

* Step 1 is saved in the book.
* Step 2 still shows Home as confirmed, with its original address line 1.

<!-- trace:case id=g10.auction-winner-order.TC-5jc rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC11: An address an unpaid order is still choosing cannot be archived

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) holds `<order>` in Awaiting Setup, with Work selected as its delivery address.

**Steps:**

1. Archive Work in the address book.

**Expected Results:**

* The winner is asked to choose another address for `<order>` first, and Work stays available.

<!-- trace:case id=g10.auction-winner-order.TC-nsg rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC12: Add Address opens on Personal, with a phone field that has no country chosen

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on Complete Order Setup for `<order>`, in Awaiting Setup.

**Steps:**

1. Open Add Address for delivery and read every field.
2. Select Company.

**Expected Results:**

* Step 1: Personal is selected and Company Name is hidden; Phone shows a globe only, no flag or calling code, with the placeholder `+852 12345678`; the country field is labelled Country/Region; Address line 2 is the optional second line, and there is no Apt., Suite or Building field.
* Step 2 shows Company Name, marked required.

<!-- trace:case id=g10.auction-winner-order.TC-51d rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok,g10.auction-winner-order.SC-cu4,g10.auction-winner-order.SC-apq -->
### g10.auction-winner-order.US1-TC16: A delivery address missing a required field is refused beside that field

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address for `<order>`, in Awaiting Setup, every field filled for Alex Chen, 100 Market St, San Francisco 94105, United States, phone United States 4155550100, except `<missing>`.

**Test data:**

| `<kind>` | `<missing>` |
| --- | --- |
| Company | Company Name |
| Personal | the phone digits |
| Personal | the phone country |
| Personal | Country/Region |
| Personal | Town/City and Postal Code |

**Steps:**

1. Select `<kind>`, leave `<missing>` empty, and confirm.

**Expected Results:**

* The confirm is refused with a message beside each field in `<missing>`; nothing is saved or applied to the order, which still reads Awaiting Setup.

<!-- trace:case id=g10.auction-winner-order.TC-qwo rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-cu4,g10.auction-winner-order.SC-apq -->
### g10.auction-winner-order.US1-TC18: A complete delivery address confirms onto the order, its phone kept as entered or in international form

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address for `<order>`, in Awaiting Setup, with Same as delivery address ticked for billing.

**Test data:**

| `<address>` | `<phone entered>` | `<phone reads>` |
| --- | --- | --- |
| Personal, Alex Chen, 10 Downing St, London SW1A 2AA, United Kingdom | United Kingdom, +44 (0)20 7946 0958 | +44 (0)20 7946 0958 |
| Personal, Alex Chen, 100 Market St, San Francisco 94105, United States, no line 2 and no state | United States, (415) 555-0100 | +14155550100 |
| Company Northwind Collectibles, Alex Chen, 100 Market St, San Francisco 94105, United States | United States, 4155550100 | +14155550100 |

**Steps:**

1. Fill `<address>` and `<phone entered>`, and confirm.
2. Read Delivery and Billing on Order Summary.

**Expected Results:**

* Step 1 is accepted with no phone-format refusal.
* Step 2: Delivery shows the company where there is one, the recipient, `<phone reads>`, the street, town and postal code and the country, line 2 and state empty where none was given; Billing shows the same.

<!-- trace:case id=g10.auction-winner-order.TC-4zr rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC22: An address card is titled by its kind and shows no postal code or phone

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) has `<address>` saved and is on Complete Order Setup for `<order>`.

**Test data:**

| `<address>` | `<title>` |
| --- | --- |
| Personal, Alex Chen, with phone and postal code | Alex Chen |
| Company Northwind Collectibles, recipient Alex Chen, with phone and postal code | Northwind Collectibles |

**Steps:**

1. Open the delivery address picker and read `<address>`'s card.

**Expected Results:**

* The title reads `<title>`; the body shows street, city or region and country, and no postal code or phone.

<!-- trace:case id=g10.auction-winner-order.TC-apy rev=2 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC26: A sent invoice shows Insurance and Tax only when added, the same on the page and both PDFs

Runs once per row of **Test data**.

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

* customer(winner) holds `<order>`, paid, whose sent invoice carries `<extras>`.

**Test data:**

| `<order>` | `<extras>` | `<rows read>` |
| --- | --- | --- |
| a USD order | Insurance USD40.00 and Tax USD70.00 | Insurance USD40.00 and Tax USD70.00 |
| an HKD order | Insurance USD40.00 and Tax USD60.00, typed in USD | Insurance US$40.00 and Tax US$60.00, no HKD amount beside either |
| a USD order | neither | neither row |

**Steps:**

1. Read Order Summary, and hover each info tip.
2. Open the invoice PDF and the receipt PDF.

**Expected Results:**

* Step 1 shows `<rows read>`, Tax between Insurance and Payment Processing Fee, each with its tip; a row that is not added shows neither row nor tip.
* Step 2: each PDF shows `<rows read>` between Shipping & Handling and Subtotal, and its Subtotal includes them.

<!-- trace:case id=g10.auction-winner-order.TC-6vp rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC34: The winner sees an operator's change before send, and cannot undo it

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) confirmed Home and card on `<order>`, an HKD order in Preparing Invoice; an operator changed it to Work and bank transfer.

**Steps:**

1. Reload Winner Order.
2. Look for controls to change the address or the payment method.

**Expected Results:**

* Step 1 shows Work and bank transfer, still Preparing Invoice.
* Step 2 finds no such control.

<!-- trace:case id=g10.auction-winner-order.TC-nxn rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok,g10.auction-winner-order.SC-05o -->
### g10.auction-winner-order.US1-TC36: Country/Region offers every country A–Z and narrows to the names typed

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner), account language `<language>`, is on delivery Add Address for `<order>`.

**Test data:**

| `<language>` | `<typed>` | `<list shows>` |
| --- | --- | --- |
| English | hong | Hong Kong, and no unrelated name such as Australia |
| English | afg | Afghanistan |
| English | zim | Zimbabwe |
| English | zzzz-not-a-country | no option |
| Traditional Chinese | 日本 | 日本, every name in Traditional Chinese |

**Steps:**

1. Open the Country/Region picker and scroll from the first name to the last.
2. Type `<typed>`.
3. Clear it, type united king, and choose United Kingdom.

**Expected Results:**

* Step 1 lists every country and region A–Z, not a short set.
* Step 2 lists `<list shows>`.
* Step 3 closes the picker, and the field reads United Kingdom.

---

## g10.auction-winner-order.US2: Winner follows a settled listing to delivery

**As a** winner who has paid,
**I want** a receipt PDF that says how I paid, what was paid before it and what is still owed, a tracker, and proof of what was handed over,
**so that** I can account for a high-value purchase without asking Grade10 for records.

<!-- trace:case id=g10.auction-winner-order.TC-h7f rev=3 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### g10.auction-winner-order.US2-TC1: The receipt itemises what was paid and sums to the total

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on Winner Order for `<order>`, an HKD order with Insurance and Tax, paid in full by card.

**Steps:**

1. Download the receipt PDF and read its lines.

**Expected Results:**

* Winning Bid, Buyer's Premium, Shipping & Handling, Insurance and Tax read in USD, then the Subtotal, the Payment Processing Fee and the Order Total in HKD.
* The Subtotal and the fee add up to the Order Total, and the receipt names card as how it was paid.

<!-- trace:case id=g10.auction-winner-order.TC-qvc rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0,g10.auction-winner-order.SC-h7d,g10.auction-winner-order.SC-k4r -->
### g10.auction-winner-order.US2-TC4: Each receipt reads what was paid before it and what is left, never below zero

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) holds `<order>`, an HKD order whose invoice totals HKD1,080.00, paid by `<payments>`.

**Test data:**

| `<payments>` | `<receipt>` | `<previous>` | `<current>` | `<left>` |
| --- | --- | --- | --- | --- |
| one payment of HKD1,080.00 | the only one | 0 | HKD1,080.00 | 0 |
| HKD420.00, then HKD310.00 | the first | 0 | HKD420.00 | HKD660.00 |
| HKD420.00, then HKD310.00 | the second | HKD420.00 | HKD310.00 | HKD350.00 |
| HKD960.00, then HKD60.00 that an operator records as closing it within tolerance | the second | HKD960.00 | HKD60.00 | 0 |
| one payment of HKD1,190.00, confirmed by an operator | the only one | 0 | HKD1,190.00 | 0 |

**Steps:**

1. Open the Receipt row on Winner Order, then `<receipt>`.

**Expected Results:**

* The Receipt row lists every receipt on one row, oldest first.
* `<receipt>` reads Original Invoice Total HKD1,080.00, Previous Payments `<previous>`, Current Payment Received `<current>` and Remaining Balance Due `<left>`, with no shortfall, write-off, credit or negative line.

<!-- trace:case id=g10.auction-winner-order.TC-vmr rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### g10.auction-winner-order.US2-TC8: A later refund leaves every issued receipt as it was

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) holds `<order>`, totalling HKD1,080.00, paid HKD220.00, HKD310.00 and HKD140.00, one receipt each; an operator then refunded the second payment.

**Steps:**

1. Open each receipt in turn.

**Expected Results:**

* They read Previous Payments 0, HKD220.00 and HKD530.00, Current Payment Received HKD220.00, HKD310.00 and HKD140.00, and Remaining Balance Due HKD860.00, HKD550.00 and HKD410.00, as issued; no receipt is reissued.

<!-- trace:case id=g10.auction-winner-order.TC-b6h rev=1 covers=g10.auction-winner-order.SC-n5y,g10.auction-winner-order.SC-d8z -->
### g10.auction-winner-order.US2-TC57: The receipt link names its ID and issue date, or reads Receipt

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on Winner Order for `<order>`, paid, whose receipt has `<recorded>`.

**Test data:**

| `<recorded>` | `<link reads>` |
| --- | --- |
| ID RC-LK7P2Q01P1, issued 22 Sep 2026 | Receipt #RC-LK7P2Q01P1 (22 Sep 2026) |
| no ID | Receipt, with no #, date or separator |

**Steps:**

1. Read the receipt link.

**Expected Results:**

* It reads `<link reads>`.

<!-- trace:case id=g10.auction-winner-order.TC-nmg rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0,g10.auction-winner-order.SC-h7d,g10.auction-winner-order.SC-k4r,g10.auction-winner-order.SC-lk0 -->
### g10.auction-winner-order.US2-TC55: Between payment and delivery, Shipping is the current step and the badge says where the order is

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on Winner Order for `<order>`, paid, `<fulfilment>`.

**Test data:**

| `<fulfilment>` | `<badge>` | `<shipping reads>` |
| --- | --- | --- |
| not yet dispatched | Preparing Shipment | Preparing to ship |
| dispatched on 22 Sep 2026 | Shipped | 22 Sep 2026, day only |

**Steps:**

1. Read the status badge and Order Progress.

**Expected Results:**

* The badge reads `<badge>` in the default style.
* Shipping is the current step, its subtext `<shipping reads>`, and no step is labelled Preparing Shipment.

<!-- trace:case id=g10.auction-winner-order.TC-4zy rev=3 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0,g10.auction-winner-order.SC-k4r,g10.auction-winner-order.SC-tgb,g10.auction-winner-order.SC-lk0 -->
### g10.auction-winner-order.US2-TC2: The tracking number links to the carrier's tracker only where one was recorded

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
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on Winner Order for `<order>`, `<state>`, with a tracking number and `<tracker>`.

**Test data:**

| `<state>` | `<tracker>` | `<number reads>` |
| --- | --- | --- |
| Shipped | a tracker link | a link with an arrow icon, opening the carrier's tracking page in a new tab |
| Delivered | a tracker link | a link with an arrow icon, opening the carrier's tracking page in a new tab |
| Shipped | no tracker link | plain text that opens nothing |

**Steps:**

1. Read Order Progress, then select the tracking number.

**Expected Results:**

* The number reads `<number reads>`; no carrier name and no Track shipment control show.

<!-- trace:case id=g10.auction-winner-order.TC-l8v rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### g10.auction-winner-order.US2-TC3: Delivery proof keeps the carrier's handover time and signature

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* `<order>` is dispatched; the carrier reports its delivery with a handover time and a signature image.

**Steps:**

1. Once the report is in, open `<order>` on Winner Order and open the delivery proof.

**Expected Results:**

* The handover time and the signature show, not only a delivered mark.

<!-- trace:case id=g10.auction-winner-order.TC-v9i rev=1 -->
### g10.auction-winner-order.US2-TC59: The shipped letter leads with the order, and links the tracker only where one was recorded

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) holds `<order>` in Preparing Shipment; admin is on its order page.

**Test data:**

| `<tracker>` | `<number reads>` |
| --- | --- |
| a tracker link | a link to the carrier's tracking page |
| none | plain text, with no track-and-trace action |

**Steps:**

1. Dispatch `<order>` with a carrier, a tracking number and `<tracker>`.
2. Open the shipped letter and select its primary action.

**Expected Results:**

* The tracking number reads `<number reads>`.
* The primary action is View order, opening `<order>` on Winner Order.

---

## g10.auction-winner-order.US3: Winner checks the buyer's premium on an invoice

**As a** winner,
**I want** the buyer's premium on my invoice to follow one published rule,
**so that** I can check what I am charged on top of my winning bid.

<!-- trace:case id=g10.auction-winner-order.TC-x85 rev=3 covers=g10.auction-winner-order.SC-zhu,g10.auction-winner-order.SC-b16,g10.auction-winner-order.SC-2mz,g10.auction-winner-order.SC-30s,g10.auction-winner-order.SC-ml2 -->
### g10.auction-winner-order.US3-TC5: The invoice's Buyer's Premium is the greater of 20% of the bid and the minimum, with no operator input

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

* admin is on the order page of `<order>`, a USD order in Preparing Invoice won at `<bid>` with no other lines; the USD premium minimum is `<minimum>`.

**Test data:**

| `<bid>` | `<minimum>` | `<premium>` | `<total>` |
| --- | --- | --- | --- |
| USD1,350 | USD0 | USD270.00 | USD1,620.00 |
| USD10.03 | USD0 | USD2.01, 200.6 cents rounded half up | USD12.04 |
| USD10.02 | USD0 | USD2.00, 200.4 cents rounded half up | USD12.02 |
| USD50 | USD20 | USD20.00, the minimum | USD70.00 |

**Steps:**

1. Open Send Invoice and read its fields.
2. Send the invoice.
3. As the winner, read Order Summary and hover the Buyer's Premium tip.

**Expected Results:**

* Step 1 asks for no buyer's premium.
* Step 3: Winning Bid reads `<bid>`, Buyer's Premium `<premium>` and the total `<total>`; the tip explains the premium.

---

## g10.auction-winner-order.US4: Winner pays an invoice by card

**As a** winner
**I want** to see the full invoice and pay it by card, even if a first attempt does not finish
**so that** the listing moves to Preparing Shipment without contacting Grade10.

<!-- trace:case id=g10.auction-winner-order.TC-9gh rev=2 covers=g10.auction-winner-order.SC-bbg,g10.auction-winner-order.SC-7ra,g10.auction-winner-order.SC-u5t,g10.auction-winner-order.SC-49w,g10.auction-winner-order.SC-1yn,g10.auction-winner-order.SC-y2j -->
### g10.auction-winner-order.US4-TC1: An unpaid card invoice shows every line, Pay with Card, the address and the listing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-04

**Pre-conditions:**

* customer(winner) holds `<order>` in Pending Payment, its card invoice sent.

**Steps:**

1. Open `<order>` on Winner Order.

**Expected Results:**

* Order Summary shows every invoice line and Pay with Card; the confirmed delivery address and the listing show.

<!-- trace:case id=g10.auction-winner-order.TC-3ie rev=1 covers=g10.auction-winner-order.SC-bbg,g10.auction-winner-order.SC-7ra,g10.auction-winner-order.SC-u5t,g10.auction-winner-order.SC-49w,g10.auction-winner-order.SC-1yn,g10.auction-winner-order.SC-y2j,g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US4-TC3: A card payment that does not finish leaves the invoice payable, and Pay Now starts afresh

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-04

**Pre-conditions:**

* customer(winner) holds `<order>` in Pending Payment, inside its deadline.

**Test data:**

| `<attempt>` |
| --- |
| pay with a card the provider declines |
| open the payment session and let it time out |
| open the payment session and abandon it |

**Steps:**

1. On Winner Order, `<attempt>`, then return to `<order>`.
2. Select Pay Now, and pay with a card the provider accepts.

**Expected Results:**

* Step 1 says payment was not completed; the order still reads Pending Payment, and Pay Now is offered.
* Step 2 opens a new session charging the same amount, and the payment is accepted.

<!-- trace:case id=g10.auction-winner-order.TC-w3e rev=1 covers=g10.auction-winner-order.SC-bbg,g10.auction-winner-order.SC-7ra,g10.auction-winner-order.SC-u5t,g10.auction-winner-order.SC-49w,g10.auction-winner-order.SC-1yn,g10.auction-winner-order.SC-y2j -->
### g10.auction-winner-order.US4-TC5: A finished card payment reads Confirming payment until it is recorded, then Preparing Shipment

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-04

**Pre-conditions:**

* customer(winner) holds `<order>` in Pending Payment.

**Steps:**

1. Pay by card and return to Winner Order before the payment is recorded.
2. Reload once it is recorded.

**Expected Results:**

* Step 1 reads Confirming payment, not Preparing Shipment.
* Step 2 reads Preparing Shipment.

<!-- trace:case id=g10.auction-winner-order.TC-td7 rev=1 covers=g10.auction-winner-order.SC-1yn -->
### g10.auction-winner-order.US4-TC7: A suspended winner reads the suspension under the listing, and can still pay

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-04

**Pre-conditions:**

* customer(winner) is suspended from bidding and holds `<order>`, its invoice pending.

**Steps:**

1. Open `<order>` and read the alerts under the listing.
2. Choose Pay what is owed.

**Expected Results:**

* Step 1: an alert says bidding is suspended and paying does not lift it.
* Step 2 brings Order Summary's pay control into view.

---

## g10.auction-winner-order.US5: Winner misses the payment deadline

**As a** winner whose invoice deadline has passed unpaid,
**I want** Winner Order to read Payment Overdue with Contact Us and no card Pay,
**so that** I know self-service payment has stopped and how to reach Grade10.

<!-- trace:case id=g10.auction-winner-order.TC-uup rev=1 covers=g10.auction-winner-order.SC-9vf,g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi,g10.auction-winner-order.SC-xdj,g10.auction-winner-order.SC-o2b,g10.auction-winner-order.SC-adl,g10.auction-winner-order.SC-tt1,g10.auction-winner-order.SC-h7y -->
### g10.auction-winner-order.US5-TC1: Past the payment deadline the order reads Payment Overdue, with Contact Us and nothing to pay or upload

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
* **Trace:** winner-order-US-05

**Pre-conditions:**

* customer(winner) is on Winner Order for `<order>`, `<state>`.

**Test data:**

| `<state>` |
| --- |
| its card invoice unpaid, the deadline passed |
| its bank-transfer invoice unpaid, the deadline passed |
| its proof returned with 60 seconds left, that minute since passed |

**Steps:**

1. Read the status and the inline alert.
2. Look for payment, proof upload and address controls.

**Expected Results:**

* Step 1 reads Payment Overdue, with Contact Us.
* Step 2 finds no card Pay, no Submit Payment Proof, no address form and no payment deadline.

<!-- trace:case id=g10.auction-winner-order.TC-nlq rev=1 -->
### g10.auction-winner-order.US5-TC3: Payment reminders come with the invoice and 24 hours before the deadline, one per reissue

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-05

**Pre-conditions:**

* customer(winner) holds `<order>`, its setup confirmed; admin is on its order page.

**Test data:**

| `<event>` | `<inbox>` |
| --- | --- |
| send the invoice | one payment reminder for the invoice |
| send the invoice, then move the clock to 24 hours before the payment deadline | one final notice for `<order>` |
| send the invoice, then reissue it | one payment reminder for the new invoice, and no invoice-reissued letter |

**Steps:**

1. `<event>`.
2. Read the winner's inbox, and filter `<send log>` by `<order>`.

**Expected Results:**

* Both read `<inbox>`.

<!-- trace:case id=g10.auction-winner-order.TC-9nr rev=1 -->
### g10.auction-winner-order.US5-TC4: Paying early stops the later reminders

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-05

**Pre-conditions:**

* customer(winner) paid `<order>`'s invoice on day 2 after it was sent.

**Steps:**

1. Move the clock past day 3, day 6 and the final-notice time, and read the inbox.

**Expected Results:**

* No day-3, day-6 or final reminder arrives for that invoice.

---

## g10.auction-winner-order.US7: Winner misses the address deadline

**As a** winner who did not confirm a delivery address within 48 hours of listing close,
**I want** Winner Order to read Setup Overdue with Contact Us and no Confirm,
**so that** I know self-service setup has stopped and how to reach Grade10.

<!-- trace:case id=g10.auction-winner-order.TC-2in rev=1 covers=g10.auction-winner-order.SC-36a,g10.auction-winner-order.SC-k2b,g10.auction-winner-order.SC-ii6 -->
### g10.auction-winner-order.US7-TC1: Past the address deadline the order reads Setup Overdue, with Contact Us and no Confirm

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
* **Trace:** winner-order-US-07

**Pre-conditions:**

* customer(winner) holds `<order>`, whose listing closed 48 hours ago with setup not confirmed, `<offer>`.

**Test data:**

| `<offer>` |
| --- |
| card and bank transfer offered in USD |
| no method offered: no USD card fee rule and no USD bank details |

**Steps:**

1. As the winner, read the status, the inline alert and the setup area.
2. As admin, open the order and read its actions.

**Expected Results:**

* Step 1 reads Setup Overdue, with Contact Us; no Confirm and no address editing.
* Step 2 offers to reopen or record the setup.

<!-- trace:case id=g10.auction-winner-order.TC-zwj rev=1 covers=g10.auction-winner-order.SC-m55 -->
### g10.auction-winner-order.US7-TC6: A one-time address left unconfirmed is gone once the address deadline passes

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-07

**Pre-conditions:**

* customer(winner) added a one-time delivery address to `<order>` without saving it and did not confirm before the address deadline; an operator then reopened the setup.

**Steps:**

1. Open `<order>` and read the address picker.

**Expected Results:**

* The picker does not offer the one-time address.

---

## g10.auction-winner-order.US8: Winner pays an invoice with a policy premium

**As a** winner of an auction listing,
**I want** my invoice to calculate the stated buyer premium correctly using the current currency minimum,
**so that** the amount I pay is explainable and collectible.

<!-- trace:case id=g10.auction-winner-order.TC-67a rev=1 -->
### g10.auction-winner-order.US8-TC5: An invoice's premium is 20% of the winning bid in whole cents, counted in the amount paid

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
* **Trace:** winner-order-US-08

**Pre-conditions:**

* admin is on the order page of `<order>`, a USD order in Preparing Invoice won at `<bid>` with no other lines; the USD premium minimum is `<minimum>`.

**Test data:**

| `<bid>` | `<minimum>` | `<premium>` | `<total>` |
| --- | --- | --- | --- |
| USD2,500.00 | USD200 | USD500.00 | USD3,000.00 |
| USD1.01 | USD0 | USD0.20, a whole cent | USD1.21 |

**Steps:**

1. Send the invoice.
2. As the winner, read Order Summary, and pay by card.

**Expected Results:**

* Buyer's Premium reads `<premium>` and the total `<total>`; the card is charged `<total>` plus its fee.

---

## g10.auction-winner-order.US9: Winner pays an invoice by bank transfer

**As a** winner who would rather not pay a card fee,
**I want** to choose bank transfer, see where to send the money and what reference to quote, and send Grade10 proof,
**so that** Grade10 can match my payment and my deadline stops while it is checked.

<!-- trace:case id=g10.auction-winner-order.TC-eu8 rev=4 covers=g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-pt5 -->
### g10.auction-winner-order.US9-TC22: The bank rail picked before confirming is recorded with the address

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) holds `<order>`, won in USD, in Awaiting Setup with a saved Home address.

**Test data:**

| `<currency>` | `<rail>` |
| --- | --- |
| HKD | FPS |
| HKD | HK Local |
| USD | International via SWIFT |

**Steps:**

1. Choose Home and `<currency>`, and read the method choices.
2. Choose `<rail>` in place of the selected card, then choose another rail and back to `<rail>`, and confirm.
3. Reload the order.

**Expected Results:**

* Step 1 offers card and `<rail>`, card selected.
* Step 3 records bank transfer on `<rail>` and reads Preparing Invoice.

<!-- trace:case id=g10.auction-winner-order.TC-w18 rev=4 covers=g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-i03,g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### g10.auction-winner-order.US9-TC1: A bank-transfer invoice shows the picked rail's details and reference only, and proof is sent apart

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) holds `<order>` in `<currency>`, whose invoice was sent for bank transfer on `<rail>` and is pending.

**Test data:**

| `<currency>` | `<rail>` | `<details>` |
| --- | --- | --- |
| HKD | FPS | FPS ID, account name and an FPS QR |
| HKD | HK Local | bank name, bank code, branch code and the full account number with bank and branch code |
| USD | International via SWIFT | beneficiary name and address, bank name and address, SWIFT/BIC and the full account or IBAN, then the memo warning and, after the reference, the OUR charges note |

**Steps:**

1. Read Order Summary's actions.
2. Select View Bank Details and read it; close it.
3. Select Submit Payment Proof and read it.

**Expected Results:**

* Step 1 offers Submit Payment Proof with View Bank Details under it, and no card Pay.
* Step 2 shows `<details>`, the amount due and the payment reference as rows, with no rail tabs, no other rail and no copy control.
* Step 3 opens Submit Payment Proof, with no amount, reference or rail tabs.

<!-- trace:case id=g10.auction-winner-order.TC-isg rev=2 covers=g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### g10.auction-winner-order.US9-TC2: Accepted proof stops the deadline and reads Payment Verifying

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on Winner Order for `<order>`, an HKD order with a sent bank-transfer invoice, Pending Payment with 2 days 6 hours left.

**Test data:**

| `<proof>` |
| --- |
| 1 JPEG |
| 1 PNG |
| 1 HEIC |
| 1 PDF of exactly 5 MB (5,242,880 bytes) |
| 3 files mixing PDF, JPEG and PNG |

**Steps:**

1. Select Submit Payment Proof and choose `<proof>`.
2. Submit, and accept the confirm step.
3. Read the order, Order Progress and the payment area.

**Expected Results:**

* Step 2: a toast reads Proof submitted and We'll verify your payment shortly.
* Step 3 reads Payment Verifying, the deadline stopped with 2 days 6 hours kept and no date under the Payment step; an alert says Grade10 is verifying the transfer and will email when payment is confirmed; card Pay, Submit Payment Proof and View Bank Details are hidden, and no file or file name shows.

<!-- trace:case id=g10.auction-winner-order.TC-nhm rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### g10.auction-winner-order.US9-TC4: Proof outside the count, type or size limits is refused whole

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on Winner Order for `<order>`, an HKD order with a sent bank-transfer invoice, Pending Payment.

**Test data:**

| `<proof>` | `<refusal names>` |
| --- | --- |
| no file | the count |
| 4 allowed files under 5 MB | the count |
| a GIF image | the allowed types |
| a Word document | the allowed types |
| four PDFs and one HEIC image | the count |
| a PDF of 5,242,881 bytes with two small PNGs | the 5 MB limit |

**Steps:**

1. Select Submit Payment Proof, choose `<proof>` and submit.

**Expected Results:**

* The upload is refused, naming `<refusal names>`; nothing is stored, the order still reads Pending Payment and the deadline runs.

<!-- trace:case id=g10.auction-winner-order.TC-8kk rev=2 covers=g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-uxu -->
### g10.auction-winner-order.US9-TC7: Proof that is not submitted whole stores nothing and can be sent again

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on Winner Order for `<order>`, an HKD order with a sent bank-transfer invoice, Pending Payment.

**Test data:**

| `<interruption>` | `<form after>` |
| --- | --- |
| read the warning that files cannot be changed after submission, then cancel | closed, with no second confirm screen |
| the connection drops during the upload | open with the files selected, and a toast reading Proof not submitted and Nothing was saved. Try again. |

**Steps:**

1. Select Submit Payment Proof and choose three allowed files.
2. Submit, and `<interruption>`.
3. Submit the same files again, the connection restored.

**Expected Results:**

* Step 2: Submit Payment Proof is `<form after>`; nothing is stored, the order reads Pending Payment and the deadline runs.
* Step 3 is accepted.

<!-- trace:case id=g10.auction-winner-order.TC-xl5 rev=2 covers=g10.auction-winner-order.SC-bb1 -->
### g10.auction-winner-order.US9-TC30: A busy proof form cannot be left until its work finishes

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) has Submit Payment Proof open on `<order>`.

**Test data:**

| `<busy work>` | `<leave by>` |
| --- | --- |
| a proof submission | Cancel |
| an HEIC conversion | Escape |
| a proof submission | selecting outside the dialog |

**Steps:**

1. Start `<busy work>`, then `<leave by>`.

**Expected Results:**

* Submit Payment Proof stays open and locked until `<busy work>` finishes.

<!-- trace:case id=g10.auction-winner-order.TC-3c9 rev=1 covers=g10.auction-winner-order.SC-c6t,g10.auction-winner-order.SC-6v5,g10.auction-winner-order.SC-sd5,g10.auction-winner-order.SC-v59,g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-bmm,g10.auction-winner-order.SC-bsl,g10.auction-winner-order.SC-fgj,g10.auction-winner-order.SC-7jw,g10.auction-winner-order.SC-ymi,g10.auction-winner-order.SC-67v,g10.auction-winner-order.SC-uxu,g10.auction-winner-order.SC-7nh,g10.auction-winner-order.SC-zbt,g10.auction-winner-order.SC-zx9,g10.auction-winner-order.SC-tf6,g10.auction-winner-order.SC-oii,g10.auction-winner-order.SC-fm9,g10.auction-winner-order.SC-8q1,g10.auction-winner-order.SC-bb1,g10.auction-winner-order.SC-8uw,g10.auction-winner-order.SC-ddi -->
### g10.auction-winner-order.US9-TC11: Proof upload is offered only on a pending bank-transfer invoice

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-09

**Pre-conditions:**

* customer(winner) is on Winner Order for `<order>`, `<state>`.

**Test data:**

| `<state>` |
| --- |
| Preparing Invoice, bank transfer chosen |
| its card invoice sent, unpaid |
| its bank-transfer invoice paid |

**Steps:**

1. Read the payment area.

**Expected Results:**

* No proof upload is offered.

---

## g10.auction-winner-order.US10: Winner's payment proof is not accepted

**As a** winner whose payment proof Grade10 could not match,
**I want** to read why and how long I have left,
**so that** I can send the right proof or pay again before the deadline.

<!-- trace:case id=g10.auction-winner-order.TC-1ys rev=1 covers=g10.auction-winner-order.SC-xdj,g10.auction-winner-order.SC-o2b,g10.auction-winner-order.SC-adl,g10.auction-winner-order.SC-tt1 -->
### g10.auction-winner-order.US10-TC8: Returned proof shows the latest reason to the winner, and the deadline resumes

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-10

**Pre-conditions:**

* customer(winner) uploaded proof for `<order>` with 2 days left; 18 hours later an operator returned it with the reason Amount does not match and an internal note.

**Steps:**

1. Read the status, the alert and the payment deadline on Winner Order, and download the invoice PDF.
2. Upload proof again; have an operator return it with Reference missing from the transfer; read the page.

**Expected Results:**

* Step 1 no longer reads Payment Verifying; it shows Amount does not match, Pay by reads the return time plus 2 days, and Submit Payment Proof and View Bank Details are offered again; neither the page nor the PDF shows the internal note.
* Step 2 shows Reference missing from the transfer and not the first reason, and no proof file or file name.

<!-- trace:case id=g10.auction-winner-order.TC-bij rev=1 covers=g10.auction-winner-order.SC-xdj,g10.auction-winner-order.SC-o2b,g10.auction-winner-order.SC-adl,g10.auction-winner-order.SC-tt1 -->
### g10.auction-winner-order.US10-TC3: After a return the winner can send proof again, and the deadline stops again

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-10

**Pre-conditions:**

* customer(winner) is on Winner Order for `<order>`, whose proof was returned, inside its deadline.

**Steps:**

1. Select Submit Payment Proof, choose one new PDF under 5 MB, submit and accept the confirm step.

**Expected Results:**

* The order reads Payment Verifying again, the deadline stopped with the time then left.

---

## g10.auction-winner-order.US11: Winner bills a won listing to a different address

**As a** winner who pays from a different address than the one the listing ships to,
**I want** to give that billing address when I confirm where to ship,
**so that** my invoice and receipt show who is billed as well as where the listing goes.

<!-- trace:case id=g10.auction-winner-order.TC-qlk rev=1 covers=g10.auction-winner-order.SC-nle,g10.auction-winner-order.SC-qnq,g10.auction-winner-order.SC-14a,g10.auction-winner-order.SC-l8x,g10.auction-winner-order.SC-rlh,g10.auction-winner-order.SC-1i2 -->
### g10.auction-winner-order.US11-TC1: Billing Add Address has the delivery form's kind, phone and country list

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-11

**Pre-conditions:**

* customer(winner) is on Complete Order Setup for `<order>`, in Awaiting Setup.

**Steps:**

1. Untick Same as delivery address, and open Add Address for billing.
2. Open its Country/Region picker and compare it with delivery's.
3. Type Jap.

**Expected Results:**

* Step 1: Personal / Company shows above the fields, Personal selected, Company Name hidden; Phone shows a country selector starting empty with a globe only.
* Step 2 lists every country and region A–Z, the same list as delivery.
* Step 3 leaves only names matching Jap, Japan among them.

<!-- trace:case id=g10.auction-winner-order.TC-9ch rev=1 covers=g10.auction-winner-order.SC-nle,g10.auction-winner-order.SC-qnq,g10.auction-winner-order.SC-14a,g10.auction-winner-order.SC-l8x -->
### g10.auction-winner-order.US11-TC2: A billing address missing a required field is refused beside that field

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-11

**Pre-conditions:**

* customer(winner) is on billing Add Address for `<order>`, every field filled for Alex Chen, 1 Front St, Toronto M5E 1B2, Canada, phone Canada 4165550100, except `<missing>`.

**Test data:**

| `<kind>` | `<missing>` |
| --- | --- |
| Personal | the phone digits |
| Company | Company Name |

**Steps:**

1. Select `<kind>`, leave `<missing>` empty, and confirm.

**Expected Results:**

* The confirm is refused with a message beside `<missing>`, and the order's billing address is unchanged.

<!-- trace:case id=g10.auction-winner-order.TC-7ax rev=1 covers=g10.auction-winner-order.SC-nle,g10.auction-winner-order.SC-qnq,g10.auction-winner-order.SC-14a,g10.auction-winner-order.SC-l8x -->
### g10.auction-winner-order.US11-TC4: A company billing address applies apart from the delivery address

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-11

**Pre-conditions:**

* customer(winner) is on Complete Order Setup for `<order>`, delivery confirmed to Alex Chen, 100 Market St, San Francisco.

**Steps:**

1. Untick Same as delivery address, and add a Company billing address: Northwind Billing Ltd, Alex Chen, 1 Front St, Toronto M5E 1B2, Canada, phone Canada 4165550199.
2. Confirm.

**Expected Results:**

* Delivery still reads 100 Market St, San Francisco; Billing reads Northwind Billing Ltd, Toronto, with the phone.

<!-- trace:case id=g10.auction-winner-order.TC-bwi rev=1 covers=g10.auction-winner-order.SC-z4a -->
### g10.auction-winner-order.US11-TC6: An unsaved one-time billing address is still offered on return, and never joins the book

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-11

**Pre-conditions:**

* customer(winner) holds `<order>` in Awaiting Setup; with Same as delivery address unticked, they added a one-time billing address without saving it and have not confirmed.

**Steps:**

1. Leave the order for another page and come back; read the billing addresses.
2. Open the account address book.

**Expected Results:**

* Step 1 still offers the one-time billing address.
* Step 2 does not hold it.

---

## g10.auction-winner-order.US12: Winner confirms delivery when five addresses are already saved

**As a** winner with five saved shipping addresses,
**I want** to confirm a different address for this order without saving a sixth,
**so that** a full address book does not block settlement before the address deadline.

<!-- trace:case id=g10.auction-winner-order.TC-mv4 rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### g10.auction-winner-order.US12-TC1: At five saved addresses, Add new address still opens with phone and kind

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner, five saved shipping addresses) is on Winner Order for `<order>`, in Awaiting Setup.

**Steps:**

1. Open the delivery address picker and select Add new address.

**Expected Results:**

* The form opens with no message blocking it: Personal selected, Company Name hidden, and Phone with a country selector and a number input, no country chosen.

<!-- trace:case id=g10.auction-winner-order.TC-yzv rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### g10.auction-winner-order.US12-TC2: At five saved addresses a one-time address confirms onto the order and saves nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner, five saved shipping addresses) is on Winner Order for `<order>`, in Awaiting Setup.

**Steps:**

1. Select Add new address and enter Jordan Lee, 350 5th Ave, New York 10118, United States, phone United States 2125550147, with Save this address for future orders unticked.
2. Confirm it for this order, then open the address book.

**Expected Results:**

* The order's delivery address is the one entered, with its phone; the book still holds five addresses.

<!-- trace:case id=g10.auction-winner-order.TC-kp5 rev=1 covers=g10.auction-winner-order.SC-zyl,g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### g10.auction-winner-order.US12-TC12: An unsaved one-time delivery address waits at the top of the picker until confirmed

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner) holds `<order>` in Awaiting Setup; they added a one-time delivery address without saving it and have not confirmed.

**Steps:**

1. Leave the order for another page and come back; read the delivery address picker.
2. Open the address book.
3. Back on the order, select the one-time address and a payment method, and confirm.

**Expected Results:**

* Step 1 lists the one-time address as a draft above the saved addresses.
* Step 2 does not hold it.
* Step 3 is accepted with the one-time address.

<!-- trace:case id=g10.auction-winner-order.TC-j6u rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### g10.auction-winner-order.US12-TC7: A full address book refuses one more saved address, and says why

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner) holds `<saved>` saved shipping addresses and is on Add new address for `<order>`, a complete address entered.

**Test data:**

| `<saved>` |
| --- |
| five |
| six, saved before the cap |

**Steps:**

1. Open the address book in another tab.
2. Select Save this address for future orders, and hover the info icon beside it.

**Expected Results:**

* Step 1 lists all `<saved>`.
* Step 2: the checkbox is disabled and stays unticked; the tip says the book is full.

<!-- trace:case id=g10.auction-winner-order.TC-go0 rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### g10.auction-winner-order.US12-TC8: Below five saved addresses a new one saves to the book

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner) holds `<saved>` and is on Winner Order for `<order>`, in Awaiting Setup.

**Test data:**

| `<saved>` | `<book holds>` |
| --- | --- |
| four saved addresses | five |
| five saved addresses, then Home removed from the book | five |

**Steps:**

1. Select Add new address, enter a complete new address and tick Save this address for future orders.
2. Confirm it for this order, then open the address book.

**Expected Results:**

* Step 1 ticks; step 2 holds `<book holds>`, the new address among them.

<!-- trace:case id=g10.auction-winner-order.TC-s5g rev=1 covers=g10.auction-winner-order.SC-v7i,g10.auction-winner-order.SC-0n0,g10.auction-winner-order.SC-2hb,g10.auction-winner-order.SC-zbm,g10.auction-winner-order.SC-esr,g10.auction-winner-order.SC-5xy,g10.auction-winner-order.SC-bre,g10.auction-winner-order.SC-2ve,g10.auction-winner-order.SC-y14 -->
### g10.auction-winner-order.US12-TC10: Editing a saved address in a full book takes no extra place

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer holds five saved shipping addresses, Home among them, and is on the address book.

**Steps:**

1. Change Home's address line 1 to 22 New Street and save.

**Expected Results:**

* The book still holds five, Home once, with 22 New Street.

---

## g10.auction-winner-order.US13: Winner learns their order was cancelled

**As a** winner whose order an operator cancelled,
**I want** Winner Order to say it was cancelled and when, with the listing I won and a way to contact Grade10,
**so that** I know the order is closed and who to ask about it.

<!-- trace:case id=g10.auction-winner-order.TC-3x8 rev=2 covers=g10.auction-winner-order.SC-1fb,g10.auction-winner-order.SC-9vf -->
### g10.auction-winner-order.US13-TC1: A cancelled order keeps the listing and winning bid, with Contact Us only

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-13

**Pre-conditions:**

* customer(winner) is on Winner Order for `<order>`, unpaid, which an operator cancelled with a reason.

**Steps:**

1. Read the status, listing, winning bid and actions.

**Expected Results:**

* It reads Cancelled on the cancellation day, a day-only date in the winner's zone, with no reason.
* The listing and winning bid show; Contact Us is the only action; no progress stepper and no invoice PDF show.

---

## g10.auction-winner-order.US14: Winner sees a refunded order as Refunded

**As a** winner whose order Grade10 refunded because they were not happy with the item,
**I want** Winner Order to read Refunded, with the amount returned below the invoice total and a way to see Amount, Transfer to, Reason and Note — brand and last four for a card, or masked destination with the bank name under it for a transfer — whether I had paid in full or in part and wherever the card is, and my invoice and receipts still there,
**so that** I know the order is closed and still hold the record of what I paid.

<!-- trace:case id=g10.auction-winner-order.TC-xfb rev=1 covers=g10.auction-winner-order.SC-zfp,g10.auction-winner-order.SC-yhv -->
### g10.auction-winner-order.US14-TC1: A card-refunded order reads Refunded and keeps its records

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-14

**Pre-conditions:**

* customer(winner) is on Winner Order for `<order>`, paid and refunded to the card with an operator note.

**Steps:**

1. Read the status, the actions and the receipt links.
2. Read below Order Total, then open the refund details from the alert.

**Expected Results:**

* Step 1 reads Refunded, with no stepper, Pay, address or shipment action; the invoice and every receipt still download.
* Step 2 shows the amount returned below Order Total; the details read Amount, Transfer to, Reason, then Note, Transfer to the card brand and last four only, with no Reference.

---

## g10.auction-winner-order.US15: Winner sees an overpayment returned

**As a** winner who paid more than the order,
**I want** only the difference returned below the invoice total, while the listing, the shipping and the amount I should have paid stay, with a way to see why,
**so that** I know the sale still stands.

<!-- trace:case id=g10.auction-winner-order.TC-pca rev=1 covers=g10.auction-winner-order.SC-7m4 -->
### g10.auction-winner-order.US15-TC1: A returned overpayment leaves the order and invoice standing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-15

**Pre-conditions:**

* customer(winner) is on Winner Order for `<order>`, paid, with the difference over the total returned.

**Steps:**

1. Read the status and invoice lines, then below Order Total.
2. Open the refund details.

**Expected Results:**

* Step 1: status and lines are unchanged, not Refunded; only the difference shows as returned.
* Step 2 opens with no proof and no provider reference.

---

## g10.auction-winner-order.US17: Winner matches a bank refund against their own statement

**As a** winner whose refund was sent by bank transfer,
**I want** the reference the operator sent it under, beside the amount and where it went,
**so that** I can find the credit on my statement without asking Customer Service.

<!-- trace:case id=g10.auction-winner-order.TC-3s7 rev=1 covers=g10.auction-winner-order.SC-u8s -->
### g10.auction-winner-order.US17-TC1: A bank refund shows the masked destination and its reference

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-17

**Pre-conditions:**

* customer(winner) is on Winner Order for `<order>`, paid and refunded by bank transfer under a provider reference, with no operator note.

**Steps:**

1. Open the refund details from the alert.

**Expected Results:**

* They read Amount, Transfer to, Reference, then Reason, with no Note.
* Transfer to shows a bank icon and the masked destination with the bank name beneath; Reference reads the provider reference; no proof or full account number shows.

---

## g10.auction-winner-order.US16: Winner emails Grade10 from a locked order

**As a** winner whose payment access has closed,
**I want** a ready email with this order's details that I can copy into any mail app,
**so that** I can reach Grade10 without a system mail client, and support can find the order.

<!-- trace:case id=g10.auction-winner-order.TC-iro rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5 -->
### g10.auction-winner-order.US16-TC1: Contact Us opens a copy-first email to support, its message editable

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on Winner Order for `<order>`, in Payment Overdue.

**Steps:**

1. Search the page for support@grade10.com.
2. Select Contact Us on the alert, and read the dialog.
3. Type a short question into Message, below the prefilled facts.

**Expected Results:**

* Step 1 finds no address on the page.
* Step 2 opens a dialog, not a mail app or a toast: To reads support@grade10.com and Subject the order's subject, each with its own copy control; Message is a multi-line field with the order facts, with no copy control; the footer offers Copy Message first and Open Mail App second.
* Step 3: Message keeps the question.

<!-- trace:case id=g10.auction-winner-order.TC-ta0 rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5,g10.auction-winner-order.SC-e1w,g10.auction-winner-order.SC-i2y -->
### g10.auction-winner-order.US16-TC3: The ready email's Subject and Message name the order and the reason it is locked

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on Winner Order for `<order>`, `<state>`.

**Test data:**

| `<state>` | `<subject>` | `<message names>` |
| --- | --- | --- |
| past its address deadline, no invoice | Auction lot `<listing title>`: setup overdue | the listing, and no invoice id |
| in Awaiting Setup, no method offered in USD | Auction lot `<listing title>`: setup overdue | the listing, and no invoice id; the status still reads Awaiting Setup |
| in Payment Overdue | Auction order `<invoice id>`: payment overdue | the invoice |
| in Payment Overdue after a reissue | Auction order `<current invoice id>`: payment overdue | the current invoice, never the replaced one |
| Partially Paid, with one receipt | Auction order `<invoice id>`: partial payment | the receipt id, and no remaining balance |
| Partially Paid, with three receipts | Auction order `<invoice id>`: partial payment | every receipt id oldest first, and no remaining balance |
| cancelled by an operator with a category and a note | Auction lot `<listing title>`: order cancelled | the listing, the invoice and status Cancelled, never the category or note |

**Steps:**

1. Select Contact Us, and read Subject and Message.

**Expected Results:**

* Subject reads `<subject>`; Message names `<message names>`.

<!-- trace:case id=g10.auction-winner-order.TC-vdc rev=1 covers=g10.auction-winner-order.SC-nlr,g10.auction-winner-order.SC-fu8,g10.auction-winner-order.SC-lh0,g10.auction-winner-order.SC-fnc,g10.auction-winner-order.SC-sfn,g10.auction-winner-order.SC-g9z,g10.auction-winner-order.SC-30l,g10.auction-winner-order.SC-kjq,g10.auction-winner-order.SC-hx5,g10.auction-winner-order.SC-81q -->
### g10.auction-winner-order.US16-TC10: Copy Message and Open Mail App carry the email as edited; the field controls copy only their field

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on Winner Order for `<order>`, in Payment Overdue; the browser may use the clipboard.

**Steps:**

1. Select Contact Us and type a short question into Message.
2. Select Copy Message, watch it for a few seconds, then paste into a plain-text field.
3. Read Open Mail App's link target.
4. Select the copy control beside To and paste; do the same beside Subject.

**Expected Results:**

* Step 2: the button reads Copied for a moment, then Copy Message, with no toast; the paste holds To, Subject and the edited Message.
* Step 3 is a mailto: to support@grade10.com carrying the Subject and the edited Message.
* Step 4 pastes only the address, then only the Subject.

<!-- trace:case id=g10.auction-winner-order.TC-kal rev=1 -->
### g10.auction-winner-order.US16-TC17: A post-close letter's Contact Us carries the same ready email as Winner Order

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) holds `<order>`, whose `<letter>` has arrived.

**Test data:**

| `<letter>` |
| --- |
| Setup overdue |
| Payment overdue |
| Partial payment |
| Order cancelled |
| Delivered |

**Steps:**

1. Open `<letter>` and read its body without selecting anything.
2. Select its Contact Us, and read the email it opens.
3. Open `<order>` on Winner Order, select Contact Us, and compare.

**Expected Results:**

* Step 1: the body names support@grade10.com, to copy where no mail app opens.
* Step 2 opens an email to it with a subject and a body for `<order>`, never a bare address; the partial-payment email names no remaining balance.
* Step 3: Subject and Message match the letter's email.

---

## g10.auction-winner-order.US19: Winner confirms where a won listing ships

**As a** winner
**I want** to fill in and confirm a delivery address on the order
**so that** Grade10 can quote shipping to the right place.

<!-- trace:case id=g10.auction-winner-order.TC-clp rev=2 covers=g10.auction-winner-order.SC-cu4 -->
### g10.auction-winner-order.US19-TC1: Winner Order shows the listing once, with Address the current step

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-19

**Pre-conditions:**

* customer(winner) holds `<order>` in Awaiting Setup.

**Steps:**

1. Open `<order>` and read it from the header to the sidebar.

**Expected Results:**

* The header shows Winner Order and the status badge; Order Progress shows Address current, then Invoice, Payment, Shipping and Completed.
* The listing's title shows in the listing card only; no Order Information, Collection Method, Order Status list or Lots section shows.

<!-- trace:case id=g10.auction-winner-order.TC-grt rev=1 covers=g10.auction-winner-order.SC-cu4,g10.auction-winner-order.SC-apq -->
### g10.auction-winner-order.US19-TC2: Once the address is confirmed the order reads Preparing Invoice, with nothing to pay

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-19

**Pre-conditions:**

* customer(winner) holds `<order>` in Preparing Invoice.

**Steps:**

1. Open `<order>`.

**Expected Results:**

* The confirmed address shows; no invoice and no Pay Now show.

---

## g10.auction-winner-order.US20: Winner waits out a partial payment an operator is collecting

**As a** winner whose invoice an operator has started collecting in parts,
**I want** a locked order with Contact Us and a receipt for every payment made so far,
**so that** I always have proof of what I have paid, without needing to track a running balance myself.

<!-- trace:case id=g10.auction-winner-order.TC-sv8 rev=1 covers=g10.auction-winner-order.SC-34b -->
### g10.auction-winner-order.US20-TC1: A partially paid order is locked, with a receipt for every payment

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-20

**Pre-conditions:**

* customer(winner) is on Winner Order for `<order>`, on which an operator recorded two part payments.

**Steps:**

1. Read the payment step, the alert and the receipt area.

**Expected Results:**

* It reads Partially Paid, with Contact Us; no Pay, Submit Payment Proof, View Bank Details or payment deadline.
* It shows the full invoice amount and no remaining balance; each payment has its own receipt link, oldest first.

---

## g10.auction-winner-order.US21: Winner quotes their order

**As a** winner of an auction listing,
**I want** my order to have a clear, stable payment reference I can quote,
**so that** I can reference it when contacting support or making inquiries about my purchase, without a separate order ID.

<!-- trace:case id=g10.auction-winner-order.TC-ppj rev=1 covers=g10.auction-winner-order.SC-6pw,g10.auction-winner-order.SC-n8j,g10.auction-winner-order.SC-upc,g10.auction-winner-order.SC-1pz -->
### g10.auction-winner-order.US21-TC1: Every invoice and its order show the invoice ID and the same payment reference, whatever the method

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-21

**Pre-conditions:**

* customer(winner) holds `<order>`, whose `<method>` invoice is sent.

**Test data:**

| `<method>` |
| --- |
| card |
| bank transfer |

**Steps:**

1. Open the invoice and the order, and read the invoice ID and payment reference.

**Expected Results:**

* Both show the invoice ID and the order's payment reference, unchanged.

<!-- trace:case id=g10.auction-winner-order.TC-93n rev=1 covers=g10.auction-winner-order.SC-6pw,g10.auction-winner-order.SC-n8j,g10.auction-winner-order.SC-upc,g10.auction-winner-order.SC-1pz -->
### g10.auction-winner-order.US21-TC2: A reissue after the 99th invoice keeps counting, under the same reference

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-21

**Pre-conditions:**

* admin is on the order page of `<order>`, payment reference LK423, whose current invoice is IN-LK42399.

**Steps:**

1. Reissue the invoice, and read the new invoice ID.

**Expected Results:**

* It reads IN-LK423100; the payment reference stays LK423.

<!-- trace:case id=g10.auction-winner-order.TC-azi rev=1 covers=g10.auction-winner-order.SC-6pw,g10.auction-winner-order.SC-n8j,g10.auction-winner-order.SC-upc,g10.auction-winner-order.SC-1pz -->
### g10.auction-winner-order.US21-TC5: The public listing page shows the payment reference only in its address

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-21

**Pre-conditions:**

* A published listing has payment reference LK423.

**Steps:**

1. Open the listing page, and paste its address into a chat app that unfurls links.

**Expected Results:**

* No field names LK423; it appears only as the lower-case end of the address.

---

## g10.auction-winner-order.US22: Winner reviews invoice and payment details

**As a** winner,
**I want** my invoice and payment receipts to show stable public references built from my payment reference,
**so that** I can contact Grade10, make a payment, and reconcile charges without exposing internal system keys.

<!-- trace:case id=g10.auction-winner-order.TC-urm rev=1 covers=g10.auction-winner-order.SC-r8w,g10.auction-winner-order.SC-k31,g10.auction-winner-order.SC-4mt,g10.auction-winner-order.SC-sjx,g10.auction-winner-order.SC-q9s,g10.auction-winner-order.SC-ly9,g10.auction-winner-order.SC-dsa,g10.auction-winner-order.SC-l1s -->
### g10.auction-winner-order.US22-TC1: Every invoice ID of a reissued order still finds it, and the new invoice names the one it replaces

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-22

**Pre-conditions:**

* `<order>`, payment reference LK423, was invoiced as IN-LK42301, then reissued as IN-LK42302.

**Steps:**

1. As admin, search orders by IN-LK42301, by IN-LK42302 and by LK423.
2. Open both invoice PDFs.

**Expected Results:**

* Each search finds `<order>`.
* IN-LK42302 names IN-LK42301 as replaced and keeps LK423.

<!-- trace:case id=g10.auction-winner-order.TC-mr5 rev=1 covers=g10.auction-winner-order.SC-r8w,g10.auction-winner-order.SC-k31,g10.auction-winner-order.SC-4mt,g10.auction-winner-order.SC-sjx,g10.auction-winner-order.SC-q9s,g10.auction-winner-order.SC-ly9,g10.auction-winner-order.SC-dsa,g10.auction-winner-order.SC-l1s -->
### g10.auction-winner-order.US22-TC2: Each recorded payment's receipt is numbered from its invoice, unpadded

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-22

**Pre-conditions:**

* `<order>`'s current invoice is IN-LK42302; admin records ten part payments against it, then reissues the invoice and records one more.

**Steps:**

1. As the winner, read each receipt ID.

**Expected Results:**

* They read RC-LK42302P1, RC-LK42302P2 and on to RC-LK42302P10, unpadded; the payment against the new invoice reads its own P1.

<!-- trace:case id=g10.auction-winner-order.TC-gfa rev=1 covers=g10.auction-winner-order.SC-r8w,g10.auction-winner-order.SC-k31,g10.auction-winner-order.SC-4mt,g10.auction-winner-order.SC-sjx,g10.auction-winner-order.SC-q9s,g10.auction-winner-order.SC-ly9,g10.auction-winner-order.SC-dsa,g10.auction-winner-order.SC-l1s -->
### g10.auction-winner-order.US22-TC3: An older receipt keeps its ID, and a refund issues none

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-22

**Pre-conditions:**

* customer(winner) holds `<order>`, whose receipt REC-202609-LK7P2Q-01-P1 was issued before the current IDs.

**Steps:**

1. Open the receipt.
2. As admin, record a refund on `<order>`; read its receipts again.

**Expected Results:**

* The receipt still reads REC-202609-LK7P2Q-01-P1, and the refund adds no receipt.

<!-- trace:case id=g10.auction-winner-order.TC-wwq rev=1 -->
### g10.auction-winner-order.US22-TC4: The invoice page states its payment deadline in GMT+8 for every viewer

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-22

**Pre-conditions:**

* `<order>`'s invoice is sent, its payment deadline 2026-09-19T09:00:00Z; customer(winner) opens the invoice page in a browser set to `<viewer zone>`.

**Test data:**

| `<viewer zone>` |
| --- |
| Asia/Hong_Kong |
| America/New_York |

**Steps:**

1. Read the payment deadline on the invoice page.

**Expected Results:**

* It reads 17:00 and ends in GMT+8, with neither HKT nor EDT, the same text in both zones.

---

## g10.auction-winner-order.US23: Winner gets the address form back

**As a** winner who missed the 48-hour address deadline,
**I want** Grade10 to reopen the address form when I get in touch, and nothing about my saved addresses to be blocked meanwhile,
**so that** I can still settle the listing I won once I have told Grade10 where to ship it.

<!-- trace:case id=g10.auction-winner-order.TC-9uu rev=1 covers=g10.auction-winner-order.SC-r6m,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-oos -->
### g10.auction-winner-order.US23-TC1: Each order's address deadline is 48 hours after its listing's actual close, and a confirmation before it is accepted

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
* **Trace:** winner-order-US-23

**Pre-conditions:**

* customer(winner) won `<listing>`, which closed at `<close>`; its order holds no confirmed address.

**Test data:**

| `<listing>` | `<close>` | `<deadline>` | `<confirm at>` |
| --- | --- | --- | --- |
| the first of three won together | 2026-09-03T12:00:00Z | 2026-09-05T12:00:00Z | 2026-09-05T11:59:00Z |
| the second of three | 2026-09-03T18:30:00Z | 2026-09-05T18:30:00Z | 2026-09-04T09:00:00Z |
| the third of three | 2026-09-04T09:15:00Z | 2026-09-06T09:15:00Z | 2026-09-05T09:00:00Z |
| one scheduled for 2026-09-12T08:45:00Z, extended by a late bid | 2026-09-12T09:00:00Z | 2026-09-14T09:00:00Z | 2026-09-14T08:50:00Z |

**Steps:**

1. Open the listing's order and read the deadline under Confirm delivery address.
2. At `<confirm at>`, confirm a saved address different from the other orders'.

**Expected Results:**

* Step 1 reads `<deadline>`; each listing has its own order.
* Step 2 is accepted; the order keeps that address and reads Preparing Invoice, with no invoice yet.

<!-- trace:case id=g10.auction-winner-order.TC-io3 rev=1 covers=g10.auction-winner-order.SC-kz8 -->
### g10.auction-winner-order.US23-TC2: A first confirmation at the 48-hour mark is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-23

**Pre-conditions:**

* customer(winner)'s listing closed at 2026-09-03T12:00:00Z; its order holds no confirmed address; it is 2026-09-05T12:00:00Z.

**Steps:**

1. Try to confirm the saved Home address, then read the order.

**Expected Results:**

* The confirmation is refused; the order holds no confirmed address and reads Setup Overdue.

<!-- trace:case id=g10.auction-winner-order.TC-w89 rev=1 covers=g10.auction-winner-order.SC-6ax,g10.auction-winner-order.SC-90v -->
### g10.auction-winner-order.US23-TC4: A reopened address form runs a fresh 48 hours, and sends the winner no letter

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-23

**Pre-conditions:**

* `<order>`'s address deadline passed on 2026-09-05T12:00:00Z with no address confirmed and no invoice.

**Steps:**

1. As admin, reopen the address form with a reason at 2026-09-07T09:00:00Z.
2. As the winner, read the inbox, then the order's delivery address area.
3. Confirm the saved Home address.

**Expected Results:**

* Step 2: no letter about the reopen; the deadline reads 2026-09-09T09:00:00Z.
* Step 3 is accepted, and the order reads Preparing Invoice.

<!-- trace:case id=g10.auction-winner-order.TC-aui rev=1 covers=g10.auction-winner-order.SC-js5,g10.auction-winner-order.SC-h7y -->
### g10.auction-winner-order.US23-TC7: Once the invoice is sent the winner cannot change the address, even inside 48 hours

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Delivery address

**Pre-conditions:**

* `<order>` has a confirmed address and an invoice sent at 2026-09-05T09:00:00Z, inside the address window.

**Steps:**

1. As the winner, try to change the delivery address to Work, then read the address area.

**Expected Results:**

* The change is refused; the order still shows the address the invoice was quoted for, and points the winner to Grade10 for a change.

<!-- trace:case id=g10.auction-winner-order.TC-euy rev=1 covers=g10.auction-winner-order.SC-byg -->
### g10.auction-winner-order.US23-TC9: A missed address deadline leaves the address book free

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Delivery address

**Pre-conditions:**

* `<order>`'s address deadline has passed with no address confirmed.

**Steps:**

1. In the address book, edit Home and save a new address Work 2.
2. Return to `<order>`.

**Expected Results:**

* Step 1 saves both.
* Step 2: the order still holds no confirmed address and offers no address form.

---

## g10.auction-winner-order.US24: Winner chooses the currency they pay in

**As a** winner of a listing bid in USD,
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
* **Suites:** regression
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

<!-- trace:case id=g10.auction-winner-order.TC-79a rev=3 covers=g10.auction-winner-order.SC-8c6,g10.auction-winner-order.SC-lq9 -->
### g10.auction-winner-order.US24-TC2: The confirmed currency is recorded and prices the invoice

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
* **Trace:** winner-order-US-24

**Pre-conditions:**

* customer(winner) holds `<order>`, won at USD2,500 with a USD500 premium, in Awaiting Setup with a saved Home address.

**Test data:**

| `<currency>` | `<method>` | `<invoice reads>` |
| --- | --- | --- |
| USD | card | Winning Bid USD2,500.00, Buyer's Premium USD500.00 and a USD total, with no conversion |
| HKD | FPS | the same USD lines, then Subtotal HKD23,550.00, with no HKD amount on a line |

**Steps:**

1. Choose Home, `<currency>` and `<method>`, and confirm; reload the order.
2. As admin, send the invoice; as the winner, read it.

**Expected Results:**

* Step 1 records `<currency>` and reads Preparing Invoice.
* Step 2 reads `<invoice reads>`.

<!-- trace:case id=g10.auction-winner-order.TC-flb rev=1 covers=g10.auction-winner-order.SC-rau -->
### g10.auction-winner-order.US24-TC6: An operator corrects the currency before send, and the winner still cannot change it

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-24

**Pre-conditions:**

* customer(winner) confirmed HKD and HK Local on `<order>`, in Preparing Invoice.

**Steps:**

1. As admin, change the settlement currency to USD with the reason Winner picked the wrong currency.
2. As the winner, open `<order>`, and look for a way to change the currency.

**Expected Results:**

* Step 1 records USD; the order still reads Preparing Invoice.
* Step 2 reads in USD and offers no currency control.

<!-- trace:case id=g10.auction-winner-order.TC-r4x rev=2 covers=g10.auction-winner-order.SC-d84 -->
### g10.auction-winner-order.US24-TC7: A reissue in the other currency prices the new invoice from the USD amounts and leaves the replaced one

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-24

**Pre-conditions:**

* admin is on the order page of `<order>`, won at USD100.00 with a USD20.00 premium, whose pending invoice was sent in HKD for HK Local, Subtotal HKD942.00.

**Steps:**

1. Reissue the invoice in USD, keeping HK Local, with a reason.
2. Read the new invoice, then the replaced one, marked Replaced.

**Expected Results:**

* The new invoice's Winning Bid reads USD100.00, with no conversion.
* The replaced invoice still reads Winning Bid USD100.00 and Subtotal HKD942.00.

---

## g10.auction-winner-order.US25: Winner picks a payment method their currency offers

**As a** winner who has picked a settlement currency,
**I want** to see only the payment methods that currency offers, with each Hong Kong and overseas bank rail named,
**so that** I choose a way to pay that works for the account I will send it from.

<!-- trace:case id=g10.auction-winner-order.TC-52z rev=1 covers=g10.auction-winner-order.SC-oyi,g10.auction-winner-order.SC-crs -->
### g10.auction-winner-order.US25-TC1: Each currency offers its own methods, each bank rail a choice of its own

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
* **Trace:** winner-order-US-25

**Pre-conditions:**

* customer(winner) is on setup for `<order>`, in Awaiting Setup.

**Test data:**

| `<currency>` | `<offered>` |
| --- | --- |
| USD | Card, HK Local, International via SWIFT |
| HKD | Card, FPS, HK Local |

**Steps:**

1. Choose `<currency>` and read every method.

**Expected Results:**

* Exactly `<offered>` show, each rail a separate choice, none from the other currency.

<!-- trace:case id=g10.auction-winner-order.TC-jfi rev=2 covers=g10.auction-winner-order.SC-8dl,g10.auction-winner-order.SC-o4y -->
### g10.auction-winner-order.US25-TC6: Card names its fee as the picked currency's percentage; a bank rail names none

Runs once per row of **Test data**.

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

* customer(winner) is on setup for `<order>`, in Awaiting Setup; the USD card fee rule is 4.4% and the HKD rule 3.4%, each plus a fixed amount.

**Test data:**

| `<currency>` | `<card reads>` |
| --- | --- |
| USD | Card fee about 4.4% + a fixed amount |
| HKD | Card fee about 3.4% + a fixed amount |

**Steps:**

1. Choose `<currency>`, and read each method.

**Expected Results:**

* Card reads `<card reads>` and is selected; each bank rail shows no fee line.

<!-- trace:case id=g10.auction-winner-order.TC-vje rev=1 covers=g10.auction-winner-order.SC-4lj,g10.auction-winner-order.SC-wn1 -->
### g10.auction-winner-order.US25-TC3: A currency switch that drops the chosen method clears it, and a confirmation without one is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-25

**Pre-conditions:**

* customer(winner) holds `<order>`, won in USD, in Awaiting Setup with a saved Home address.

**Steps:**

1. Choose Home, USD and International via SWIFT.
2. Switch to HKD, and read the methods.
3. Confirm without choosing a method; reload the order.

**Expected Results:**

* Step 2: International via SWIFT is neither selected nor offered; the HKD methods show, none selected.
* Step 3 is refused; the order reads Awaiting Setup, holding no address, currency or method.

<!-- trace:case id=g10.auction-winner-order.TC-rwy rev=2 covers=g10.auction-winner-order.SC-6un -->
### g10.auction-winner-order.US25-TC4: A currency switch keeps a method the new currency still offers

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-25

**Pre-conditions:**

* customer(winner) is on setup for `<order>`, USD chosen.

**Test data:**

| `<method>` |
| --- |
| Card |
| HK Local |

**Steps:**

1. Choose `<method>`, switch to HKD, and read the selection.

**Expected Results:**

* `<method>` is still selected.

<!-- trace:case id=g10.auction-winner-order.TC-pes rev=1 covers=g10.auction-winner-order.SC-1aa,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok,g10.auction-winner-order.SC-vbp,g10.auction-winner-order.SC-7y2,g10.auction-winner-order.SC-cz1 -->
### g10.auction-winner-order.US25-TC7: A method shows only where Grade10 can take it, and a confirmation naming another is refused

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

* customer(winner) holds `<order>` in Awaiting Setup with a saved Home address, `<currency>` chosen; `<held>`.

**Test data:**

| `<currency>` | `<held>` | `<offered>` | `<sent>` |
| --- | --- | --- | --- |
| HKD | outside production, HK Local details only, and an HKD card fee rule | Card, HK Local | FPS |
| HKD | production, before Finance confirms an account: no bank details, and an HKD card fee rule | Card | FPS |
| USD | a USD card fee rule and no USD bank details | Card | bank transfer |
| HKD | no HKD card fee rule, and FPS and HK Local details | FPS, HK Local; card reads not yet available in HKD | card |
| USD | no USD card fee rule, and HK Local and SWIFT details | HK Local, International via SWIFT; card reads not yet available in USD | card |
| USD | no card fee rule and no bank details in either currency | none; the page says payment is not yet available in USD and offers Contact Us | card |

**Steps:**

1. Choose Home, and read the methods.
2. Send Grade10 a setup confirmation carrying Home and `<sent>`; reload the order.

**Expected Results:**

* Step 1 offers exactly `<offered>`.
* Step 2 is refused; the order reads Awaiting Setup, holding no address and no method.

---

## g10.auction-winner-order.US26: Winner who settles in HKD reads the invoice and receipt with USD lines and an HKD total

**As a** winner who picked HKD,
**I want** my invoice, receipt and receipt letter to list the same USD lines and end in the same HKD Subtotal, fee and Order Total as my Order Summary,
**so that** every document I keep shows what the lot cost in USD and what I paid in HKD.

<!-- trace:case id=g10.auction-winner-order.TC-ac5 rev=4 covers=g10.auction-winner-order.SC-gc6,g10.auction-winner-order.SC-buj,g10.auction-winner-order.SC-ekn,g10.auction-winner-order.SC-bk7,g10.auction-winner-order.SC-tmc,g10.auction-winner-order.SC-qtr,g10.auction-winner-order.SC-8gv,g10.auction-winner-order.SC-rsv,g10.auction-winner-order.SC-7q5 -->
### g10.auction-winner-order.US26-TC1: An HKD invoice lists USD lines, converts their sum once to the Subtotal, and converts a fee alone

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
* **Trace:** winner-order-US-26

**Pre-conditions:**

* customer(winner) holds `<order>`, settled in HKD by `<method>`, its invoice sent and Pending Payment.

**Test data:**

| `<method>` | `<usd lines>` | `<subtotal>` | `<fee>` | `<order total>` | `<not this>` |
| --- | --- | --- | --- | --- | --- |
| FPS, no fee | USD100.00, USD20.00, Shipping & Handling Free | HKD942.00 | Free | HKD942.00 | HKD942, without decimals |
| FPS, no fee | USD101.00, USD20.20, USD10.01 | HKD1,030.00 | Free | HKD1,030.00 | HKD1,029.99 or HKD1,031.00 |
| FPS, no fee | USD150.00, USD30.00, USD49.00, USD20.00, USD2.00 | HKD1,970.35 | Free | HKD1,970.35 | HKD1,972.00 |
| FPS, fee USD2.57 | USD101.00, USD20.20, USD9.92 | HKD1,029.30 | HKD20.18 | HKD1,049.48 | HKD1,049.47 |
| HK Local, fee USD50.00 | USD101.00, USD20.20, USD10.01 | HKD1,030.00 | HKD392.50 | HKD1,422.50 | a Subtotal counting the fee |
| card, HKD rule 3.4% plus HKD2.35 | USD101.00, USD20.20, USD10.01 | HKD1,030.00 | HKD38.69 | HKD1,068.69 | a fee from the USD rule |
| card, HKD rule 3.4% plus HKD2.35 | USD150.00, USD30.00, USD49.00, Insurance USD20.00, Tax USD2.00 | HKD1,970.35 | HKD71.79 | HKD2,042.14 | HKD71.85 |

**Steps:**

1. Select the Invoice link beside the Order summary heading, and read the invoice page.
2. Open the invoice PDF, and read it.

**Expected Results:**

* Both list `<usd lines>` in USD with two decimals, a zero line reading Free and no line for an absent Insurance or Tax, then Subtotal `<subtotal>`, Payment Processing Fee `<fee>` below it, and Order Total `<order total>`, all in HKD with two decimals.
* No figure reads `<not this>`; every figure equals Order Summary.

<!-- trace:case id=g10.auction-winner-order.TC-nf6 rev=5 covers=g10.auction-winner-order.SC-81v,g10.auction-winner-order.SC-g3i,g10.auction-winner-order.SC-dfs -->
### g10.auction-winner-order.US26-TC2: An HKD receipt lists the USD lines, the HKD totals and the payment, with the note under the Subtotal

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
* **Trace:** winner-order-US-26

**Pre-conditions:**

* customer(winner) is on Winner Order for `<order>`, settled in HKD by `<method>`, with `<payment>` recorded.

**Test data:**

| `<method>` | `<usd lines>` | `<note>` | `<subtotal>` | `<fee>` | `<order total>` | `<payment>` | `<left>` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FPS, no fee | USD101.00, USD20.20, USD10.01 | Converted from US$131.21 at 1 USD = 7.85 HKD | HKD1,030.00 | Free | HKD1,030.00 | HKD1,030.00 | HKD0.00 |
| card, HKD rule | USD150.00, USD30.00, USD49.00, Insurance USD20.00, Tax USD2.00 | Converted from US$251.00 at 1 USD = 7.85 HKD | HKD1,970.35 | HKD71.79 | HKD2,042.14 | HKD2,042.14 | HKD0.00 |
| FPS, no fee | USD101.00, USD20.20, USD10.01 | Converted from US$131.21 at 1 USD = 7.85 HKD | HKD1,030.00 | Free | HKD1,030.00 | a first part payment of HKD300.00 | HKD730.00 |
| FPS, fee USD2.57 | USD101.00, USD20.20, USD10.01 | Converted from US$131.21 at 1 USD = 7.85 HKD | HKD1,030.00 | HKD20.18 | HKD1,050.18 | HKD1,050.18 | HKD0.00 |

**Steps:**

1. Open the receipt for `<payment>`.

**Expected Results:**

* It lists `<usd lines>` in USD with two decimals, Tax between Insurance and the Subtotal; then Subtotal `<subtotal>`, Payment Processing Fee `<fee>` and Order Total `<order total>` in HKD.
* Directly under the Subtotal, above the fee, the note reads `<note>` in the muted style; the payment breakdown carries no note.
* Original Invoice Total reads `<order total>`, Previous Payments HKD0.00, Current Payment Received `<payment>` and Remaining Balance Due `<left>`; every figure equals the invoice and Order Summary.

<!-- trace:case id=g10.auction-winner-order.TC-9dm rev=2 -->
### g10.auction-winner-order.US26-TC3: Each order letter names its amounts in the settlement currency, the won letter alone in USD

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
* **Trace:** winner-order-US-26

**Pre-conditions:**

* customer(winner), account language `<language>`, won `<order>` at USD101.00 with Shipping & Handling USD10.01 to come; admin is on its order page.

**Test data:**

| `<language>` | `<when>` | `<letter>` | `<reads>` |
| --- | --- | --- | --- |
| English | at the close, before any currency is picked | auction won | the winning bid USD101.00, and no HKD amount or rate |
| English | HKD picked, the invoice sent | payment reminder | HKD1,030.00, and no USD winning bid or rate |
| English | USD picked, the invoice sent | payment reminder | USD131.21 |
| English | HKD invoice pending, the currency changed to USD and the invoice reissued | payment reminder | USD131.21 and no HKD; the earlier reminder still reads HKD1,030.00 |
| English | HKD invoice unpaid at day 3 | payment reminder | HKD1,030.00, and no USD winning bid |
| English | HKD invoice unpaid past its deadline | payment overdue | HKD1,030.00 outstanding, and no USD amount or rate |
| English | paid by bank transfer in USD, fee USD5.00, confirmed by an operator | payment received | the USD lines, then Subtotal USD131.21, fee USD5.00 and Order Total USD136.21 |
| English | paid in HKD by card, HKD rule | payment received | the USD lines, then Subtotal HKD1,030.00, fee HKD38.69 and Order Total HKD1,068.69, and no rate |
| Traditional Chinese | paid in HKD by card, HKD rule | payment received | the same figures in English grouping, in Traditional Chinese text |

**Steps:**

1. Bring `<order>` to `<when>`, and open the `<letter>` letter.

**Expected Results:**

* It names `<reads>`.
* A payment received letter carries the receipt PDF as its only attachment, printing the same lines and Order Total.

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

* customer(winner) is on Winner Order for `<order>`, settled in HKD, paid in full, with a part refund of HK$100.

**Steps:**

1. Read the refund.

**Expected Results:**

* It reads HK$100 in HKD, with no USD amount beside it.

<!-- trace:case id=g10.auction-winner-order.TC-k5y rev=3 covers=g10.auction-winner-order.SC-ida,g10.auction-winner-order.SC-63n -->
### g10.auction-winner-order.US26-TC7: Only Order Summary and the two PDFs name the conversion rate

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-26

**Pre-conditions:**

* `<order>` is settled in HKD by FPS with lines summing to USD131.21 and an invoice of HK$1,030.00, its payment confirmed and its letters sent.

**Steps:**

1. Read the settlement currency choice on a new order before picking HKD.
2. On `<order>`, read Order Summary, the invoice page, the invoice PDF and the receipt PDF.
3. Read every letter sent for `<order>`.

**Expected Results:**

* Order Summary, the invoice PDF and the receipt PDF name US$131.21 and 1 USD = 7.85 HKD in the note under the Subtotal.
* The currency choice, the invoice page and every letter name no rate, exchange rate or 7.85.

<!-- trace:case id=g10.auction-winner-order.TC-q8e rev=1 covers=g10.auction-winner-order.SC-o3a -->
### g10.auction-winner-order.US26-TC13: A reissued HKD invoice is priced once afresh, and the replaced one keeps its amounts

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

* customer(winner) holds `<order>`, settled in HKD by card under the HKD rule, its invoice sent with USD150.00, USD30.00, Shipping & Handling USD49.00, Insurance USD20.00 and Tax USD2.00: Subtotal HKD1,970.35, fee HKD71.79, Order Total HKD2,042.14.

**Steps:**

1. As admin, reissue the invoice with Shipping & Handling USD16.04.
2. As the winner, read Order Summary and its note, then the new invoice.
3. As admin, open the replaced invoice, marked Replaced.

**Expected Results:**

* Step 2 reads Subtotal HKD1,711.62, not HKD1,711.61, fee HKD62.68 and Order Total HKD1,774.30; the note names US$218.04; the new invoice names the one it replaces and prints the same figures.
* Step 3 still reads HKD1,970.35, HKD71.79 and HKD2,042.14.

---

## g10.auction-winner-order.US27: Winner who settles in HKD reads the Order Summary with USD lines and an HKD total

**As a** winner who picked HKD,
**I want** my Order Summary to list what I won in USD, then one HKD Subtotal converted from their sum, the fee, and the Order Total I will pay,
**so that** I see what the lot cost and check what I pay against the one rate the note names.

<!-- trace:case id=g10.auction-winner-order.TC-vwm rev=6 covers=g10.auction-winner-order.SC-kdr,g10.auction-winner-order.SC-fq4,g10.auction-winner-order.SC-lfi,g10.auction-winner-order.SC-hcb,g10.auction-winner-order.SC-8t1,g10.auction-winner-order.SC-16z -->
### g10.auction-winner-order.US27-TC1: An HKD Order Summary lists the USD lines, one Subtotal rounded up to the cent with its note, the fee and the Order Total

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
* **Trace:** winner-order-US-27

**Pre-conditions:**

* customer(winner) is on Winner Order for `<order>`, settled in HKD by `<method>`, its invoice sent.

**Test data:**

| `<method>` | `<usd lines>` | `<usd sum>` | `<subtotal>` | `<fee>` | `<order total>` | `<not this>` |
| --- | --- | --- | --- | --- | --- | --- |
| FPS, no fee | USD150.00, USD30.00, USD71.00 | USD251.00 | HKD1,970.35 | Free | HKD1,970.35 | none |
| FPS, no fee | USD70.00, USD14.00, USD16.04 | USD100.04 | HKD785.32 | Free | HKD785.32 | HKD785.31 |
| FPS, no fee | USD101.00, USD20.20, USD10.01 | USD131.21 | HKD1,030.00 | Free | HKD1,030.00 | HKD1,029.99 or HKD1,031.00 |
| FPS, no fee | USD80.00, USD16.00, USD4.13 | USD100.13 | HKD786.03 | Free | HKD786.03 | HKD786.02 |
| FPS, no fee | USD100.00, USD20.00, Shipping & Handling Free | USD120.00 | HKD942.00 | Free | HKD942.00 | a hidden Subtotal or fee |
| card, HKD rule | USD101.00, USD20.20, USD10.01 | USD131.21 | HKD1,030.00 | HKD38.69 | HKD1,068.69 | HKD38.73 |
| card, HKD rule | USD150.00, USD30.00, USD49.00, Insurance USD20.00, Tax USD2.00 | USD251.00 | HKD1,970.35 | HKD71.79 | HKD2,042.14 | HKD1,972.00 or HKD71.85 |
| FPS, fee USD2.57 | USD150.00, USD30.00, USD49.00, Insurance USD20.00, Tax USD2.00 | USD251.00 | HKD1,970.35 | HKD20.18 | HKD1,990.53 | a note naming USD253.57 |
| FPS, fee USD25.04 | USD150.00, USD30.00, USD49.00, Insurance USD20.00, Tax USD2.00 | USD251.00 | HKD1,970.35 | HKD196.57 | HKD2,166.92 | HKD196.56 |

**Steps:**

1. Read Order Summary from the top down, and the note under the Subtotal.
2. Where the method is FPS, open View Bank Details and read the amount due.

**Expected Results:**

* The lines read `<usd lines>`, each with the US$ mark and two decimals and no HKD amount, a zero line reading Free and no row for an absent Insurance or Tax.
* One Subtotal row reads `<subtotal>`; the note under it names `<usd sum>` and 1 USD = 7.85 HKD, never counting a fee; Payment Processing Fee `<fee>` sits below it, in HKD only; Order Total reads `<order total>`, with no USD total; no figure reads `<not this>`.
* The listing card still shows the winning bid in USD; step 2 reads `<order total>`.

<!-- trace:case id=g10.auction-winner-order.TC-7qs rev=2 covers=g10.auction-winner-order.SC-59h,g10.auction-winner-order.SC-ug0 -->
### g10.auction-winner-order.US27-TC2: Without an HKD invoice, Order Summary shows no Subtotal, note or HKD amount

Runs once per row of **Test data**.

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

* customer(winner) is on Winner Order for `<order>`, won at USD250, `<state>`.

**Test data:**

| `<state>` | `<total reads>` |
| --- | --- |
| settled in USD, its invoice sent | one USD total |
| settled in HKD, setup confirmed, its invoice not sent | no total |

**Steps:**

1. Read Order Summary and the listing card.

**Expected Results:**

* Order Summary shows `<total reads>`, and no HKD amount, Subtotal row or conversion note; the listing card reads USD250.00.

<!-- trace:case id=g10.auction-winner-order.TC-qf9 rev=1 -->
### g10.auction-winner-order.US27-TC9: In Chinese, Order Summary keeps its US$ marks and the same HKD figures

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-27

**Pre-conditions:**

* customer(winner) holds `<order>`, settled in HKD by card under the HKD rule, its invoice sent: lines USD150.00, USD30.00, USD49.00, USD20.00 and USD2.00.

**Test data:**

| `<prefix>` |
| --- |
| /tc |
| /sc |

**Steps:**

1. Open `<order>` under `<prefix>`, and read Order Summary and the note.

**Expected Results:**

* Labels and the note read in the page language; the lines keep the US$ mark; Subtotal reads HKD1,970.35 and Order Total HKD2,042.14, as in English; the note names USD251 and 1 USD = 7.85 HKD.

<!-- trace:case id=g10.auction-winner-order.TC-kkw rev=1 -->
### g10.auction-winner-order.US27-TC10: A mixed-currency Order Summary and its note fit a phone screen

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-27

**Pre-conditions:**

* customer(winner) is on Winner Order for an HKD order with five lines, its invoice sent, in a 360 px wide browser.

**Steps:**

1. Read Order Summary from the Winning Bid to the Order Total, and try to scroll sideways.

**Expected Results:**

* Every amount and label is whole, none clipped or overlapping; the note wraps inside the summary; the page does not scroll sideways.

<!-- trace:case id=g10.auction-winner-order.TC-ewl rev=1 covers=g10.auction-winner-order.SC-ygl -->
### g10.auction-winner-order.US27-TC11: An HKD invoice sent before this layout keeps its stored total and reads in the new layout

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-27

**Pre-conditions:**

* customer(winner) holds `<order>`, whose HKD invoice was sent before this layout by FPS with no fee, storing USD101.00, USD20.20 and USD10.01 with whole-HK$ amounts HK$793, HK$159 and HK$79.

**Steps:**

1. Read Order Summary from the top down, and the note.

**Expected Results:**

* The three lines read in USD with two decimals and no HKD figure; the Subtotal reads HKD1,031.00, not HKD1,030.00; the note names US$131.21 and the rate; the fee reads Free and Order Total HKD1,031.00. The invoice is not re-priced.

---

## Settled

- A deadline reads as an absolute date and time, never a countdown. The address window is 48 hours from the listing's actual close; once it passes, Confirm is hidden and Contact Us shows. Past the payment deadline self-service card pay ends.
- A bid holds nothing on the card, so the close captures nothing: the winner pays the invoice on the order.
- The buyer's premium is worked out when the invoice is created; the bid panel shows only the rate.
- Insurance is optional and separate from the Payment Processing Fee. Buyer's Premium, Shipping & Handling, Insurance and Payment Processing Fee each carry a short tip; Insurance's reads `0.9% of the order value during transit.`
- After payment the Receipt row sits beside the Invoice row. Winner Order shows no live balance, only what each receipt reads; a receipt after a close within tolerance or a confirmed overpayment reads Remaining Balance Due 0, and a refund or reversal leaves issued receipts as they were.
- A phone that parses is stored in international form; one that does not is kept as entered. A missing phone country or missing digits get one refusal beside Phone. Switching back to Personal drops the Company Name requirement.
- Country/Region's closed state, scrolling and selection belong to the design system's autocomplete; the language the catalogue reads in and a list of shippable destinations only stay open PRD questions.
- Bank details are held per currency on each environment: the sample account outside production, and none in production until Finance confirms Grade10's account.
- A close with the house leading opens one internal order, Preparing Invoice, in HKD by FPS, with the internal bidder's billing address as both addresses; it issues no invoice and sends no letter to anyone.
- Every USD line reads US$ with two decimals, and a zero Shipping & Handling reads Free. The invoice page and the invoice PDF are two surfaces, each listing the USD lines, then the HKD Subtotal, fee and Order Total. Before the invoice is sent an HKD order shows no Subtotal, HKD amount or note.
- Order Summary and the PDFs of an HKD order carry the note under the Subtotal, drawn muted, its USD figure the sum of the lines and never a fee; the invoice page and every letter name no rate, and a USD order's PDFs carry no note.
- Only the won-listing letter names the winning bid in USD before the winner picks a currency; after it every letter that names only a total names it in the settlement currency, and the payment received letter lists the USD lines, then the Subtotal, fee and Order Total.
- One payment reminder goes per invoice sent or reissued; a reissue parks the superseded reminders and starts day 3 and day 6 afresh. Muting covers listing alert mail, never a winner's order letters.
- A ready email's Subject names the current invoice after a reissue; cancelled and delivered reasons read `cancelled` and `delivered`. The partial-payment letter lists no lines and keeps the invoice id, receipt id and receipt PDF. The delivered letter names the address and time recorded at the carrier's confirmation.

## Reconciliation

- **Covered at domain** - `g10.auction-dmn.US12-TC3` walks a winner paying the total shown in USD and in HKD by card, the invoice PDF, receipt PDF and payment received letter agreeing; `g10adm.auction-dmn.US4-TC2` walks a close with the house leading to its internal order, with no order letter to anyone
