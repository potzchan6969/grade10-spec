# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-23, tcs-rules r3.0

## winner-order-US21: Winner quotes their order

**As a** winner of an auction lot,
**I want** my order to have a clear, stable payment reference I can quote,
**so that** I can reference it when contacting support or making inquiries about my purchase, without a separate order ID to keep track of.

<!-- trace:case id=g10.auction-winner-order.TC-ppj rev=1 covers=g10.auction-winner-order.SC-6pw,g10.auction-winner-order.SC-n8j,g10.auction-winner-order.SC-upc,g10.auction-winner-order.SC-g6f,g10.auction-winner-order.SC-1pz -->
### winner-order-US21-TC1-1: Invoice and payment references appear on both invoice methods

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
* **Trace:** winner-order-US-21

**Pre-conditions:**

* One winning order has a card invoice and another has a bank-transfer invoice.

**Steps:**

1. Open each invoice and its order.
2. Read the invoice ID and payment reference.

**Expected Results:**

* Each order and invoice shows its invoice ID and unchanged payment reference.
* The card invoice and bank-transfer invoice use the same reference rules.
* No receipt breakdown or receipt amount is asserted here.

<!-- trace:case id=g10.auction-winner-order.TC-93n rev=1 covers=g10.auction-winner-order.SC-6pw,g10.auction-winner-order.SC-n8j,g10.auction-winner-order.SC-upc,g10.auction-winner-order.SC-g6f,g10.auction-winner-order.SC-1pz -->
### winner-order-US21-TC2-1: Invoice numbering continues after 99

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
* **Trace:** winner-order-US-21

**Pre-conditions:**

* The latest invoice for payment reference `LK423` is `IN-LK42399`.

**Steps:**

1. Reissue the invoice.
2. Read the new invoice ID.

**Expected Results:**

* The new invoice ID is `IN-LK423100`.
* The payment reference remains `LK423`.

<!-- trace:case id=g10.auction-winner-order.TC-ehf rev=1 covers=g10.auction-winner-order.SC-6pw,g10.auction-winner-order.SC-n8j,g10.auction-winner-order.SC-upc,g10.auction-winner-order.SC-g6f,g10.auction-winner-order.SC-1pz -->
### winner-order-US21-TC3-1: Listing-code allocation retries a projection collision

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-21

**Pre-conditions:**

* A new listing's 5-character candidate collides with an active code or retained reservation.

**Steps:**

1. Create the listing.
2. Read the stored listing/payment reference.

**Expected Results:**

* Allocation retries and stores a distinct valid code.
* The code is not treated as collision-free merely because its source is a UUID or listing ID.

<!-- trace:case id=g10.auction-winner-order.TC-wa2 rev=1 covers=g10.auction-winner-order.SC-6pw,g10.auction-winner-order.SC-n8j,g10.auction-winner-order.SC-upc,g10.auction-winner-order.SC-g6f,g10.auction-winner-order.SC-1pz -->
### winner-order-US21-TC4-1: A stored payment reference survives allocator changes

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
* **Trace:** winner-order-US-21

**Pre-conditions:**

* A listing and its order already store payment reference `LK423`.

**Steps:**

1. Change the allocator implementation.
2. Read the listing and order references.

**Expected Results:**

* Both continue to use `LK423`.
* No new listing receives a retained code.

<!-- trace:case id=g10.auction-winner-order.TC-azi rev=1 covers=g10.auction-winner-order.SC-6pw,g10.auction-winner-order.SC-n8j,g10.auction-winner-order.SC-upc,g10.auction-winner-order.SC-g6f,g10.auction-winner-order.SC-1pz -->
### winner-order-US21-TC5-1: The public listing page withholds the payment reference

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-21

**Pre-conditions:**

* A listing has payment reference `LK423`.

**Steps:**

1. Fetch the public listing page and its shared preview.
2. Inspect server HTML, embedded state and preview metadata.

**Expected Results:**

* The payment reference has no labelled public field and appears only as the lower-case suffix of the canonical address.

## winner-order-US22: Winner reviews invoice and payment details

**As a** winner,
**I want** my invoice and payment receipts to show stable public references built from my payment reference,
**so that** I can contact Grade10, make a payment, and reconcile charges without exposing internal system keys.

<!-- trace:case id=g10.auction-winner-order.TC-urm rev=1 covers=g10.auction-winner-order.SC-r8w,g10.auction-winner-order.SC-k31,g10.auction-winner-order.SC-4mt,g10.auction-winner-order.SC-sjx,g10.auction-winner-order.SC-q9s,g10.auction-winner-order.SC-ly9,g10.auction-winner-order.SC-dsa,g10.auction-winner-order.SC-l1s -->
### winner-order-US22-TC1-1: Reissued invoice IDs still find the order

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
* **Trace:** winner-order-US-22

**Pre-conditions:**

* An order has invoice `IN-LK42301`, then reissued invoice `IN-LK42302`, with payment reference `LK423`.

**Steps:**

1. Look up the order by each invoice ID and by `LK423`.
2. Open both invoice PDFs.

**Expected Results:**

* Each lookup finds the same order.
* The replacement invoice names the replaced invoice and keeps `LK423`.

<!-- trace:case id=g10.auction-winner-order.TC-mr5 rev=1 covers=g10.auction-winner-order.SC-r8w,g10.auction-winner-order.SC-k31,g10.auction-winner-order.SC-4mt,g10.auction-winner-order.SC-sjx,g10.auction-winner-order.SC-q9s,g10.auction-winner-order.SC-ly9,g10.auction-winner-order.SC-dsa,g10.auction-winner-order.SC-l1s -->
### winner-order-US22-TC2-1: A finalized payment receives the new receipt identifier

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
* **Trace:** winner-order-US-22

**Pre-conditions:**

* An invoice is `IN-LK42302` for payment reference `LK423`.
* A full or partial payment for that invoice has finalized.

**Steps:**

1. Open the receipt.
2. Read its identifier.

**Expected Results:**

* The first receipt ID is `RC-LK42302P1`.
* A later finalized payment for that invoice receives `P2`, then `P10` without padding.
* A receipt for another invoice starts at `P1` for that invoice.

<!-- trace:case id=g10.auction-winner-order.TC-gfa rev=1 covers=g10.auction-winner-order.SC-r8w,g10.auction-winner-order.SC-k31,g10.auction-winner-order.SC-4mt,g10.auction-winner-order.SC-sjx,g10.auction-winner-order.SC-q9s,g10.auction-winner-order.SC-ly9,g10.auction-winner-order.SC-dsa,g10.auction-winner-order.SC-l1s -->
### winner-order-US22-TC3-1: Historical receipt identifiers stay unchanged

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
* **Trace:** winner-order-US-22

**Pre-conditions:**

* A historical receipt ID is `REC-202609-LK7P2Q-01-P1`.

**Steps:**

1. Open the historical receipt after the new identifier ships.
2. Record a refund, reversal or void.

**Expected Results:**

* The historical receipt ID remains `REC-202609-LK7P2Q-01-P1`.
* No receipt ID is created for the refund, reversal or void.

<!-- trace:case id=g10.auction-winner-order.TC-gs5 rev=1 covers=g10.auction-winner-order.SC-r8w,g10.auction-winner-order.SC-k31,g10.auction-winner-order.SC-4mt,g10.auction-winner-order.SC-sjx,g10.auction-winner-order.SC-q9s,g10.auction-winner-order.SC-ly9,g10.auction-winner-order.SC-dsa,g10.auction-winner-order.SC-l1s -->
### winner-order-US22-TC4-1: Provider references stay internal

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-22

**Pre-conditions:**

* A card payment has a Grade10 payment reference and a provider reference.

**Steps:**

1. Read Stripe metadata and the winner-facing order and invoice.

**Expected Results:**

* Stripe metadata carries the Grade10 payment reference.
* The provider reference appears on no winner-facing surface.

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Required identifier scenarios SC-114 and SC-122–SC-128 | Preserved in the winner-order spec; cases cover the changed identifier behavior. |
| Existing receipt identifier scenario SC-131 | The winner-facing identifier retains the listing payment reference; this change does not change its existing format or receipt breakdown. |
| UUID/listing-ID projection | A projection may collide; the allocator retries against active codes and retained reservations. |
| Bank-transfer presentation | `add-winner-how-to-pay-rails` owns the detail rows, including its no-Copy rule; this change supplies only the payment-reference value. |
| Admin permission and placement | Settled: existing listing-admin read access shows the code in both the Listings table and detail screen; knowing it cannot grant access or private data. |
| Cached-preview behavior | Settled in Q15: previously cached content may persist without purge or regeneration; current pages and fresh metadata omit the code and private data. |
