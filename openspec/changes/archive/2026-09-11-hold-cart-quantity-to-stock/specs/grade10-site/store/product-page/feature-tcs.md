# grade10-site/store/product-page Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-09, tcs-rules r3.0

## grade10-site-store-product-page-US5: Collector takes the last of a grade from its page

**As a** collector,
**I want** the page to stop me at what the shop has of the grade I chose, and
to say how many that is,
**so that** the quantity I take to the cart is one the shop can fill.

### grade10-site-store-product-page-US5-TC1-1: Nearly out is said and the quantity stops there

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-05

**Pre-conditions:**

* The shop has `<low count>` of `<card_1>`'s `<low grade>` and exposes that count.
* customer is on `<card_1>`'s product page with `<low grade>` chosen.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_1>` | A card with a grade the shop has few of |
| `<low grade>` | The grade of `<card_1>` the shop is nearly out of |
| `<low count>` | `3` |

**Steps:**

1. Read what the page says about how many are left.
2. Raise the quantity past `<low count>`.

**Expected Results:**

* Step 1 says `<low count>` are left.
* The quantity stays at `<low count>`.

### grade10-site-store-product-page-US5-TC2-1: Grade the shop counts nothing for is not capped

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
* **Trace:** grade10-site-store-product-page-US-05

**Pre-conditions:**

* The shop exposes no count for `<card_2>`'s `<uncounted grade>`.
* customer is on `<card_2>`'s product page with `<uncounted grade>` chosen.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_2>` | A card with a grade the shop exposes no count for |
| `<uncounted grade>` | The grade of `<card_2>` the shop exposes no count for |
| `<asked quantity>` | `4` |

**Steps:**

1. Raise the quantity to `<asked quantity>`.

**Expected Results:**

* The quantity rises to `<asked quantity>`.

### grade10-site-store-product-page-US5-TC3-1: Choosing another grade brings that grade's ceiling

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
* **Trace:** grade10-site-store-product-page-US-05

**Pre-conditions:**

* The shop has `<scarce count>` of `<card_3>`'s `<scarce grade>` and `<roomy count>` of its `<roomy grade>`, and exposes both counts.
* customer is on `<card_3>`'s product page with `<scarce grade>` chosen.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_3>` | A card listing two grades the shop has different counts of |
| `<scarce grade>` | The grade of `<card_3>` the shop has fewest of |
| `<roomy grade>` | The grade of `<card_3>` the shop has most of |
| `<scarce count>` | `2` |
| `<roomy count>` | `10` |

**Steps:**

1. Choose `<roomy grade>`.
2. Raise the quantity to `<roomy count>`.

**Expected Results:**

* The quantity rises to `<roomy count>`.

### grade10-site-store-product-page-US5-TC4-1: A well-stocked grade says nothing until every one is asked for

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-05

**Pre-conditions:**

* The shop has `<full count>` of `<card_4>`'s `<full grade>` and exposes that count.
* customer is on `<card_4>`'s product page with `<full grade>` chosen.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_4>` | A card with a grade the shop has many of |
| `<full grade>` | The grade of `<card_4>` the shop has many of |
| `<full count>` | `41` |

**Steps:**

1. Read what the page says about how many are left.
2. Raise the quantity to `<full count>`.
3. Raise the quantity once more.

**Expected Results:**

* Step 1 says nothing about how many are left.
* After step 2 the page says `<full count>` are left.
* The quantity does not rise past `<full count>`.
