# grade10-site/store/product-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-09, tcs-rules r3.0

## grade10-site-store-product-listing-US7: Collector reads past the first page of the listing

**As a** collector,
**I want** the listing to keep giving me cards as I reach the end of the ones
shown, without a page to pick,
**so that** I can look through the whole catalogue in one run and come back to
where a narrowing left off rather than to a page number.

### grade10-site-store-product-listing-US7-TC1-1: More cards arrive at the end of the list

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-07

**Pre-conditions:**

* The catalogue in <test environment> holds more cards than one page of the browse listing lists.
* The collector is on <grade10 browse listing url> with no narrowing applied.

**Steps:**

1. Note the cards listed and the order they are in.
2. Scroll to the end of the listed cards.
3. Check the grid and the area around it.

**Expected Results:**

* Further cards are listed below the ones noted at step 1.
* The cards noted at step 1 are still listed, in the same order.
* No page number, next control or load-more button is on the surface.

### grade10-site-store-product-listing-US7-TC2-1: The end of the catalogue passes quietly

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
* **Trace:** grade10-site-store-product-listing-US-07

**Test data:**

| Field | Value |
| --- | --- |
| \<small world\> | A world the catalogue holds fewer cards in than one page lists |

**Pre-conditions:**

* The catalogue in <test environment> holds cards in <small world>, fewer than one page of the browse listing lists.
* The collector is on <grade10 browse listing url> with no narrowing applied.

**Steps:**

1. Select <small world> in the world filter.
2. Scroll to the end of the listed cards.
3. Check the area below the last card.

**Expected Results:**

* Every card of <small world> is listed.
* No loading treatment appears below the last card.
* Nothing is shown in place of further cards — no message, no control.

### grade10-site-store-product-listing-US7-TC3-1: A new narrowing lists its own first page

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
* **Trace:** grade10-site-store-product-listing-US-07

**Test data:**

| Field | Value |
| --- | --- |
| \<stocked world\> | A world the catalogue holds cards in, and not the only one |

**Pre-conditions:**

* The catalogue in <test environment> holds more cards than three pages of the browse listing list.
* The collector is on <grade10 browse listing url> with no narrowing applied.

**Steps:**

1. Scroll to the end of the listed cards three times.
2. Note the cards now listed.
3. Select <stocked world> in the world filter.
4. Check the listed cards.

**Expected Results:**

* One page of cards is listed, not the three read at step 1.
* Every card listed is in <stocked world>.

### grade10-site-store-product-listing-US7-TC4-1: A shared address opens at the first page

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
* **Trace:** grade10-site-store-product-listing-US-07

**Test data:**

| Field | Value |
| --- | --- |
| \<stocked world\> | A world the catalogue holds more cards in than three pages list |

**Pre-conditions:**

* The catalogue in <test environment> holds more cards in <stocked world> than three pages of the browse listing list.
* The collector is on <grade10 browse listing url> with no narrowing applied.

**Steps:**

1. Select <stocked world> in the world filter.
2. Scroll to the end of the listed cards three times.
3. Copy the address and open it in a new tab.
4. Return to the first tab and click the browser's Back button.

**Expected Results:**

* Step 3 lists one page of the same narrowing.
* Step 4 lists the catalogue unnarrowed, not an earlier page of <stocked world>.

### grade10-site-store-product-listing-US7-TC5-1: A page that fails keeps the cards already read

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
* **Trace:** grade10-site-store-product-listing-US-07

**Pre-conditions:**

* The catalogue in <test environment> holds more cards than three pages of the browse listing list.
* <the catalogue endpoint> is mocked to return a `500 Internal Server Error` for the third page and no other.
* The collector is on <grade10 browse listing url> with no narrowing applied.

**Steps:**

1. Scroll to the end of the listed cards twice, and note the cards listed.
2. Scroll to the end again and wait for the catalogue to fail.
3. Check the grid.
4. Remove the mock and scroll to the end again.

**Expected Results:**

* The cards noted at step 1 are still listed after the failure.
* No error message stands in place of the grid, and the filters are still usable.
* Step 4 lists further cards below them.

---

## grade10-site-store-product-listing-US8: Collector sees how large their narrowing is

**As a** collector,
**I want** to be told how many cards my narrowing found, not how many I have
scrolled past,
**so that** I can tell whether it is worth reading on before I have read to the
end.

### grade10-site-store-product-listing-US8-TC1-1: The count holds still while the collector scrolls

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-08

**Test data:**

| Field | Value |
| --- | --- |
| \<stocked world\> | A world the catalogue holds 100 cards in |

**Pre-conditions:**

* The catalogue in <test environment> holds 100 cards in <stocked world>, and the browse listing lists fewer than 100 at a time.
* The collector is on <grade10 browse listing url> with no narrowing applied.

**Steps:**

1. Select <stocked world> in the world filter.
2. Note the count above the grid.
3. Scroll to the end of the listed cards twice.
4. Note the count again.

**Expected Results:**

* Step 2 reads 100 products.
* Step 4 reads 100 products, though more cards are now listed.

### grade10-site-store-product-listing-US8-TC2-1: The count follows the narrowing

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
* **Trace:** grade10-site-store-product-listing-US-08

**Test data:**

| Field | Value |
| --- | --- |
| \<stocked world\> | A world the catalogue holds 12 of its 100 cards in |

**Pre-conditions:**

* The catalogue in <test environment> holds 100 cards, 12 of them in <stocked world>.
* The collector is on <grade10 browse listing url> with no narrowing applied.

**Steps:**

1. Note the count above the grid.
2. Select <stocked world> in the world filter.
3. Note the count again, without scrolling.

**Expected Results:**

* Step 1 reads 100 products.
* Step 3 reads 12 products.

### grade10-site-store-product-listing-US8-TC3-1: A world's count in the panel is the listing it opens

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
* **Trace:** grade10-site-store-product-listing-US-08

**Test data:**

| Field | Value |
| --- | --- |
| \<searched word\> | A word the catalogue holds cards for |
| \<stocked world\> | A world holding 12 of the cards that word finds |

**Pre-conditions:**

* The catalogue in <test environment> holds cards whose titles carry <searched word>, 12 of them in <stocked world>.
* The collector is on <grade10 browse listing url> with no narrowing applied.

**Steps:**

1. Search for <searched word>.
2. Note the count the world filter shows beside <stocked world>.
3. Select <stocked world>.
4. Note the count above the grid.
5. Scroll to the end of the listed cards and count them.

**Expected Results:**

* Step 2 reads 12 beside <stocked world>.
* Step 4 reads 12 products.
* Step 5 counts 12 cards.
