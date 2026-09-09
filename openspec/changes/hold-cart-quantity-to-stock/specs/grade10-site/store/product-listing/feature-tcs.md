# grade10-site/store/product-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-09, tcs-rules r3.0

## grade10-site-store-product-listing-US6: Collector takes the last of a card from the listing

**As a** collector,
**I want** a card's quantity to stop where the shop runs out, and to be told
how many are left when it does,
**so that** I buy the number the shop will actually send me rather than
finding out at the order.

### grade10-site-store-product-listing-US6-TC1-1: Card's quantity stops at the shop's count

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
* **Trace:** grade10-site-store-product-listing-US-06

**Pre-conditions:**

* The shop has `<low count>` of `<card_1>` and exposes that count.
* `<card_1>` is listed at <grade10 browse listing url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_1>` | A card the shop has few of and exposes a count for |
| `<low count>` | `3` |

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Raise `<card_1>`'s quantity past `<low count>`.
3. Open the cart drawer.

**Expected Results:**

* `<card_1>`'s quantity stays at `<low count>`.
* The cart holds `<low count>` of `<card_1>`.

### grade10-site-store-product-listing-US6-TC2-1: Card the shop counts nothing for is not capped

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
* **Trace:** grade10-site-store-product-listing-US-06

**Pre-conditions:**

* The shop exposes no count for `<card_3>`.
* `<card_3>` is listed at <grade10 browse listing url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_3>` | A card whose buyable variant the shop exposes no count for |
| `<asked quantity>` | `4` |

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Raise `<card_3>`'s quantity to `<asked quantity>`.
3. Open the cart drawer.

**Expected Results:**

* `<card_3>`'s quantity rises to `<asked quantity>`.
* The cart holds `<asked quantity>` of `<card_3>`.

### grade10-site-store-product-listing-US6-TC3-1: Nearly out is said, well stocked says nothing

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
* **Trace:** grade10-site-store-product-listing-US-06

**Pre-conditions:**

* The shop has `<low count>` of `<card_1>` and `<full count>` of `<card_2>`, and exposes both counts.
* Both cards are listed at <grade10 browse listing url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_1>` | A card the shop has few of and exposes a count for |
| `<card_2>` | A card the shop has many of and exposes a count for |
| `<low count>` | `3` |
| `<full count>` | `41` |

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Read `<card_1>` and `<card_2>`.

**Expected Results:**

* `<card_1>` says `<low count>` are left.
* `<card_2>` says nothing about what is left.

### grade10-site-store-product-listing-US6-TC4-1: Asking for every one there is answered on the card

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-06

**Pre-conditions:**

* The shop has `<full count>` of `<card_2>` and exposes that count.
* `<card_2>` is listed at <grade10 browse listing url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_2>` | A card the shop has many of and exposes a count for |
| `<full count>` | `41` |

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Raise `<card_2>`'s quantity to `<full count>`.
3. Raise `<card_2>`'s quantity once more.

**Expected Results:**

* `<card_2>` says `<full count>` are left.
* The quantity does not rise past `<full count>`.
