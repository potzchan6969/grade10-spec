# grade10-site/store/product-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-11, tcs-rules r3.0

## grade10-site-store-product-listing-US10: Collector finds a card by typing in search

**As a** collector,
**I want** the listing search field to suggest products and filters as I
type, and to commit my words as a chip when I submit them,
**so that** I can jump to a known card or narrow the shop without waiting on
a blind query.

### grade10-site-store-product-listing-US10-TC1-1: Typing offers product and filter hits

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
* **Trace:** grade10-site-store-product-listing-US-10

**Pre-conditions:**

* The catalogue holds more than five products whose names carry `<words>`.
* The catalogue holds `<matching facet>`.
* customer is on <grade10 browse listing url>, unscoped.

**Test data:**

| Field | Value |
| --- | --- |
| `<words>` | Words carried by more than five product names and by `<matching facet>` |
| `<matching facet>` | A world or collectible type whose name carries `<words>` |

**Steps:**

1. Type `<words>` in the listing search field.
2. Read the groups offered under the field.
3. Check the address bar and the cards listed.

**Expected Results:**

* A products group offers matching products and a filters group offers `<matching facet>`.
* Neither group offers more than five hits.
* The address and the listed cards are unchanged.

### grade10-site-store-product-listing-US10-TC2-1: Suggestions stay on the store catalogue

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
* **Trace:** grade10-site-store-product-listing-US-10

**Pre-conditions:**

* The catalogue holds a product whose name carries `<words>`.
* `<matching lot>` is live on the auction.
* customer is on <grade10 browse listing url>, unscoped.

**Test data:**

| Field | Value |
| --- | --- |
| `<words>` | Words carried by a catalogue product name and by `<matching lot>` |
| `<matching lot>` | A live auction lot whose title carries `<words>` |

**Steps:**

1. Type `<words>` in the listing search field.
2. Read every hit offered under the field.

**Expected Results:**

* Every hit is a catalogue product or a listing facet choice.
* `<matching lot>` is not offered.

### grade10-site-store-product-listing-US10-TC3-1: Submitting the words narrows the shop and shows a chip

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-10

**Pre-conditions:**

* The catalogue holds more cards than one page lists, and only `<matching product>` carries `<words>`.
* `<matching product>` is not among the cards listed when the page first loads.
* customer is on <grade10 browse listing url>, unscoped.

**Test data:**

| Field | Value |
| --- | --- |
| `<words>` | Words carried by `<matching product>` alone |
| `<matching product>` | The catalogue's only product whose name carries `<words>` |

**Steps:**

1. Type `<words>` in the listing search field.
2. Submit the field with no suggestion highlighted.
3. Check the cards listed, the narrowings in force, the address bar and the search field.

**Expected Results:**

* `<matching product>` is listed and the address carries `<words>`.
* `<words>` sits among the applied narrowings as a dismissible chip.
* The search field is empty.

### grade10-site-store-product-listing-US10-TC4-1: A product hit opens that product

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
* **Trace:** grade10-site-store-product-listing-US-10

**Pre-conditions:**

* The catalogue holds `<matching product>`.
* customer is on <grade10 browse listing url>, unscoped.

**Test data:**

| Field | Value |
| --- | --- |
| `<words>` | Words carried by `<matching product>` |
| `<matching product>` | A catalogue product whose name carries `<words>` |

**Steps:**

1. Type `<words>` in the listing search field.
2. Open the hit for `<matching product>` under the products group.
3. Return to the listing.

**Expected Results:**

* Step 2 opens `<matching product>`'s own product page.
* The listing address carries no search words.
* The search field is empty.

### grade10-site-store-product-listing-US10-TC5-1: A filter hit applies that facet

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
* **Trace:** grade10-site-store-product-listing-US-10

**Pre-conditions:**

* The catalogue holds `<matching facet>` and at least one card outside it.
* customer is on <grade10 browse listing url>, unscoped.

**Test data:**

| Field | Value |
| --- | --- |
| `<words>` | Words carried by `<matching facet>` |
| `<matching facet>` | A world or collectible type whose name carries `<words>` |

**Steps:**

1. Type `<words>` in the listing search field.
2. Open the hit for `<matching facet>` under the filters group.
3. Check the cards listed, the narrowings in force, the address bar and the search field.

**Expected Results:**

* Only cards under `<matching facet>` are listed, and the address names it.
* `<matching facet>` sits among the applied narrowings, with no chip for `<words>`.
* The search field is empty.

### grade10-site-store-product-listing-US10-TC6-1: Dismissing the search chip clears the words

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
* **Trace:** grade10-site-store-product-listing-US-10

**Pre-conditions:**

* The catalogue holds cards that carry `<words>` and cards that do not.
* customer is on <grade10 browse listing url> with `<words>` in force, shown among the applied narrowings.

**Test data:**

| Field | Value |
| --- | --- |
| `<words>` | Words carried by some catalogue products and not others |

**Steps:**

1. Dismiss the chip for `<words>`.
2. Check the cards listed, the narrowings in force and the address bar.

**Expected Results:**

* Cards that do not carry `<words>` are listed again.
* No chip for `<words>` sits among the applied narrowings.
* The address no longer carries `<words>`.

### grade10-site-store-product-listing-US10-TC7-1: Words nothing matches still commit

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-10

**Pre-conditions:**

* No product name and no facet name in the catalogue carries `<unmatched words>`.
* customer is on <grade10 browse listing url>, unscoped.

**Test data:**

| Field | Value |
| --- | --- |
| `<unmatched words>` | Words no product name and no facet name carries |

**Steps:**

1. Type `<unmatched words>` in the listing search field.
2. Read what the field offers.
3. Submit the field.

**Expected Results:**

* Step 2 shows that nothing matched.
* Step 3 narrows the listing by `<unmatched words>` as free text.
* The address carries `<unmatched words>`.

### grade10-site-store-product-listing-US10-TC8-1: Hits that take time show searching

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-10

**Pre-conditions:**

* Network manipulation delays the suggestion response by 5 seconds.
* The catalogue holds a product whose name carries `<words>`.
* customer is on <grade10 browse listing url>, unscoped.

**Test data:**

| Field | Value |
| --- | --- |
| `<words>` | Words carried by a catalogue product name |

**Steps:**

1. Type `<words>` in the listing search field.
2. Check the field before the hits arrive.
3. Check the address bar and the cards listed.

**Expected Results:**

* Step 2 shows that the field is searching, with no hit offered.
* The address and the listed cards are unchanged.
