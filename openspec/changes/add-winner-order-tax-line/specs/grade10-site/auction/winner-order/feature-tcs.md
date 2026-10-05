# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-25, tcs-rules r4

**Out of suite:** none for this change's scenarios. The durable suite keeps the unchanged parts of the journey.

## winner-order-US1: Winner settles a won lot

**As a** winner,
**I want** to tell Grade10 where to ship and how I will pay, then pay the invoice it sends me,
**so that** the lot I won becomes mine inside a deadline I can see, priced for where it is actually going.

<!-- trace:case id=g10.auction-winner-order.TC-ujy rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### winner-order-US1-TC30-1: Tax is pending before the invoice is sent

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) holds an auction order whose invoice has not been sent.

**Steps:**

1. Open Winner Order.
2. Read Tax in Order Summary and open its info tip.

**Expected Results:**

* Tax reads TBD with the other fee rows.
* No calculated Tax amount is shown.
* The tip reads `Set by Grade10 for where your order ships. Some orders have none.`

<!-- trace:case id=g10.auction-winner-order.TC-m21 rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### winner-order-US1-TC31-1: Sent tax is itemised throughout the order record

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) holds a paid auction order whose invoice includes Tax of 6000 minor units in HKD.

**Steps:**

1. Open Winner Order and read Order Summary.
2. Open the invoice PDF.
3. Open the receipt PDF.

**Expected Results:**

* Order Summary shows Tax of 6000 minor units in HKD between Insurance and Payment Processing Fee.
* Order Summary offers the Tax info tip with the stated copy.
* The invoice PDF and the receipt PDF each show Tax of 6000 minor units in HKD between Insurance and Subtotal.
* Each PDF's Subtotal includes the 6000 minor units in HKD.

<!-- trace:case id=g10.auction-winner-order.TC-nvv rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### winner-order-US1-TC32-1: An untaxed invoice leaves Tax out

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) holds a paid auction order whose operator added no Tax.

**Steps:**

1. Open Winner Order and read Order Summary.
2. Open the invoice PDF.
3. Open the receipt PDF.

**Expected Results:**

* No surface shows a Tax line.
* Order Summary offers no Tax info tip.

<!-- trace:case id=g10.auction-winner-order.TC-dvc rev=1 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-aky,g10.auction-winner-order.SC-tg2,g10.auction-winner-order.SC-ai3,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### winner-order-US1-TC33-1: Card fee is grossed up on tax

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* admin(operator with payment-processing) is on a card order in Preparing Invoice.
* The order's lines before Tax total 312000 minor units in HKD.

**Steps:**

1. Add Tax of 6000 minor units in HKD.
2. Send the invoice.
3. Read its Subtotal and payment processing fee inputs.

**Expected Results:**

* The Subtotal is 318000 minor units in HKD.
* Grade10 computes the payment processing fee from that Subtotal.

## Reconciliation

**Run:** The blind pass read the Purpose, Feature set, `winner-order-US-01`, the proposal, decisions, UI design without scenario dispositions, and the linked PRD. It did not read durable or change requirements.

**Run:** 2026-10-06, QA2 rerun after accept-review, not blind: the delta's requirements and scenarios, `ui-design.md`, the durable suite and the cases above. It split `winner-order-US1-TC31-1`'s expectations by surface, since the page places Tax before Payment Processing Fee and the PDFs before Subtotal.

### Folded

- `winner-order-US1-TC30-1`, Tax reads TBD with its tip before send -> `winner-order-SC-213`
- `winner-order-US1-TC31-1`, sent Tax on the page with its tip and on both PDFs inside the Subtotal -> `winner-order-SC-217`, `winner-order-SC-214`, `winner-order-SC-04`, `winner-order-SC-18`
- `winner-order-US1-TC32-1`, an untaxed invoice shows no Tax line and no tip anywhere -> `winner-order-SC-215`, `winner-order-SC-212`
- `winner-order-US1-TC33-1`, the card fee priced from a Subtotal that includes Tax -> `winner-order-SC-216`

### Rejected

- No blind case was dropped.

### Escalated

- None. The blind pass's itemisation reading matched `winner-order-SC-214`; it asked nothing the input left open.

### Carried Unchanged

- **Invoice fields** - `winner-order-SC-05`, `winner-order-SC-38`, `winner-order-SC-39`, `winner-order-SC-62`, `winner-order-SC-63`, `winner-order-SC-69`, `winner-order-SC-110`, `winner-order-SC-111` keep their meaning and their durable coverage. `winner-order-SC-04` changed meaning to a taxed total and is reached above by `winner-order-US1-TC31-1`
- **Records the winner keeps** - `winner-order-SC-19`, `winner-order-SC-20`, `winner-order-SC-21`, `winner-order-SC-36`, `winner-order-SC-112`, `winner-order-SC-113`, `winner-order-SC-131`, `winner-order-SC-132`, `winner-order-SC-133`, `winner-order-SC-135` keep their meaning and their durable coverage. `winner-order-SC-18` changed meaning to Tax when added and is reached above by `winner-order-US1-TC31-1` and `winner-order-US1-TC32-1`, beside durable `winner-order-US2-TC1-1`

**Out of suite:** none.
