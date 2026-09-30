# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

## winner-order-US1: Winner settles a won lot

**As a** winner,
**I want** to tell Grade10 where to ship and how I will pay, then pay the invoice it sends me,
**so that** the lot I won becomes mine inside a deadline I can see, priced for where it is actually going.

### winner-order-US1-TC36-1: Delivery Add Address offers a complete A–Z country catalogue

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.
* The Country/Region picker is closed.

**Steps:**

1. Open the Country/Region picker.
2. Scroll the popup from the first option to the last.

**Expected Results:**

* Step 1 opens a popup listing every country and region A–Z, not a short designated set.
* Step 2 keeps the full catalogue available inside the capped-height popup.

### winner-order-US1-TC37-1: Country/Region field label matches the manual wording

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.

**Steps:**

1. Look at the country or region field label beside the picker.

**Expected Results:**

* The label reads Country/Region.

### winner-order-US1-TC38-1: Closed field shows the selected or default country

**Classification:**

* **Severity:** normal
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

* `customer(winner)` is on Winner Order setup with delivery Add Address open.
* The Country/Region picker is closed with the fixture default Hong Kong selected.

**Steps:**

1. Read the Country/Region field without opening the popup.

**Expected Results:**

* The field shows Hong Kong.
* Country/Region options are not in the tree.

### winner-order-US1-TC39-1: Open catalogue lists every country inside a scrollable popup

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.

**Steps:**

1. Open the Country/Region picker.
2. Scroll within the popup to a mid-alphabet name and to a late-alphabet name.

**Expected Results:**

* Step 1 shows every country and region A–Z in the popup.
* Step 2 scrolls the long list inside a capped height without truncating the catalogue to a short set.

### winner-order-US1-TC40-1: Typing filters the list to matching country names

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.
* The Country/Region picker is open on a long A–Z list.

**Test data:**

| Field | Value |
| --- | --- |
| Typed query | hong |

**Steps:**

1. Focus the open Country/Region picker.
2. Type the query from **Test data**.

**Expected Results:**

* Step 2 shows only country or region names that match the query.
* Names that do not match (for example Australia) are not shown.

### winner-order-US1-TC41-1: Autocomplete filter works in isolation on a long list

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* A design-system Autocomplete is rendered with a long option list taller than its capped popup height.

**Test data:**

| Field | Value |
| --- | --- |
| Typed query | uni |

**Steps:**

1. Open the Autocomplete.
2. Type the query from **Test data**.

**Expected Results:**

* The list shows only options whose labels match the query.
* Non-matching options are not shown.

### winner-order-US1-TC42-1: A query with no match leaves the list empty

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.
* The Country/Region picker is open.

**Test data:**

| Field | Value |
| --- | --- |
| Typed query | zzzz-not-a-country |

**Steps:**

1. Type the query from **Test data**.

**Expected Results:**

* The list shows no country or region options.

### winner-order-US1-TC43-1: Filter matches an early-alphabet name

**Classification:**

* **Severity:** normal
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

* `customer(winner)` is on Winner Order setup with delivery Add Address open.
* The Country/Region picker is open.

**Test data:**

| Field | Value |
| --- | --- |
| Typed query | afg |

**Steps:**

1. Type the query from **Test data**.

**Expected Results:**

* Afghanistan (or the catalogue name that matches) appears in the filtered list.
* Unrelated late-alphabet names are not shown.

### winner-order-US1-TC44-1: Filter matches a late-alphabet name

**Classification:**

* **Severity:** normal
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

* `customer(winner)` is on Winner Order setup with delivery Add Address open.
* The Country/Region picker is open near the start of the A–Z list.

**Test data:**

| Field | Value |
| --- | --- |
| Typed query | zim |

**Steps:**

1. Type the query from **Test data**.

**Expected Results:**

* Zimbabwe (or the catalogue name that matches) appears in the filtered list.
* Unrelated early-alphabet names are not shown.

### winner-order-US1-TC45-1: Choosing a filtered country closes the picker on that selection

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.
* The Country/Region picker is closed on the fixture default.

**Test data:**

| Field | Value |
| --- | --- |
| Typed query | united king |
| Country or region | United Kingdom |

**Steps:**

1. Open the Country/Region picker.
2. Type the query from **Test data**.
3. Select United Kingdom from the filtered matches.

**Expected Results:**

* Step 3 closes the popup.
* The field shows United Kingdom.
* Options are no longer in the tree.

### winner-order-US1-TC46-1: Empty Country/Region is refused beside the field

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `customer(winner)` is on Winner Order setup with delivery Add Address open.
* Country/Region has no value selected.
* Other required address fields that the form needs are filled.

**Steps:**

1. Activate Confirm or Use This Address with Country/Region empty.

**Expected Results:**

* A field refusal appears beside Country/Region.
* The address is not applied with an empty country or region.

### winner-order-US1-TC47-1: Catalogue includes both early and late alphabet partitions

**Classification:**

* **Severity:** normal
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

* `customer(winner)` is on Winner Order setup with delivery Add Address open.

**Steps:**

1. Open the Country/Region picker.
2. Note whether an early-alphabet name and a late-alphabet name both appear in the list.

**Expected Results:**

* The open list includes names from the start of the A–Z range and from near the end.
* The set is not limited to a short designated sample.

---

## winner-order-US11: Winner bills a won lot to a different address

**As a** winner who pays from a different address than the one the lot ships to,
**I want** to give that billing address when I confirm where to ship,
**so that** my invoice and receipt show who is billed as well as where the lot goes.

**Out of scope for this change:** billing Add Address catalogue and searchable field are deferred (Non-Goal / Q1b). No `winner-order-US11-TC*` cases issued here until Product settles whether billing uses the same full list.

## Settled

(none from prior country-region picker runs)

## Reconciliation

**Run:** Blind suite re-read 2026-09-22 for change `full-winner-order-country-region-list` capability `grade10-site/auction/winner-order` after Q4 Autocomplete decision. Prior 2026-09-21 letter-typeahead dispositions superseded for search anchors.

| Finding | Disposition |
| --- | --- |
| Delivery Add Address opens a complete A–Z catalogue | **Folded in:** `winner-order-SC-174` |
| Field label reads Country/Region | **Folded in:** `winner-order-SC-176` |
| Typing filters the list to matching names | **Folded in:** `winner-order-SC-175` |
| A query with no match leaves the list empty | **Folded in:** `winner-order-SC-178` |
| Empty Country/Region refused beside the field | **Folded in:** `winner-order-SC-177` |
| Closed field shows selected/default; options not in tree | **Rejected:** design-system Autocomplete closed state; stated on `ui-design.md` Closed — **Out of suite:** Autocomplete stories / ui-design |
| Open long list inside capped-height scrollport | **Rejected:** presentation already on `ui-design.md` Open, long list; catalogue completeness is `winner-order-SC-174` |
| Early / late alphabet filter partitions | **Rejected:** redundant partitions of `winner-order-SC-174` / `winner-order-SC-175` |
| Choosing a filtered country closes the picker on that value | **Rejected:** design-system Autocomplete selection contract, not a Winner Order product rule |
| Autocomplete filter at unit layer | **Out of suite:** `@grade10/design-system` Autocomplete tests and stories |
| Letter typeahead / repeated same letter on Select | **Superseded:** Q4 Autocomplete; prior SC-175 / SC-178 letter behaviour rewritten |
| Catalogue display locale / script | **Escalated:** ❓ on Post-Bidding Order Setup; Raised row for Product (@tangconst). No scenario |
| Billing Add Address full list / searchable field | **Deferred:** already Q1b / PRD ❓; US11 section carries out-of-scope note; no cases |
| Shippable destinations only | **Deferred:** already PRD ❓; catalogue stays complete; no scenario |

**Uncovered anchors:** none for `winner-order-US-01` under this change's feature set. Context journey `winner-order-US-11` has no new cases until Product settles billing catalogue parity.
