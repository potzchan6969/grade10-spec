# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-21, tcs-rules r3.0

## winner-order-US1: Winner settles a won lot

**As a** winner,
**I want** to tell Grade10 where to ship and how I will pay, then pay the invoice it sends me,
**so that** the lot I won becomes mine inside a deadline I can see, priced for where it is actually going.

### winner-order-US1-TC12-1: Delivery Add Address offers a complete A–Z country catalogue

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

### winner-order-US1-TC13-1: Country/Region field label matches the manual wording

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

### winner-order-US1-TC14-1: Closed trigger shows the selected or default country

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

1. Read the Country/Region trigger without opening the popup.

**Expected Results:**

* The trigger shows Hong Kong.
* Country/Region options are not in the tree.

### winner-order-US1-TC15-1: Open catalogue lists every country inside a scrollable popup

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

### winner-order-US1-TC16-1: Typed letter highlights the next matching name and scrolls it into view

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
| Typed letter | U |

**Steps:**

1. Focus the open Country/Region picker.
2. Type the letter from **Test data**.

**Expected Results:**

* Step 2 moves the highlight to the next country or region name that starts with that letter.
* The highlighted option is inside the popup's visible scrollport.

### winner-order-US1-TC17-1: Select typeahead scroll-into-view works in isolation

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

* A design-system Select is rendered with a long option list taller than its capped popup height.

**Test data:**

| Field | Value |
| --- | --- |
| Typed letter | M |

**Steps:**

1. Open the Select.
2. Type the letter from **Test data**.

**Expected Results:**

* The next matching option is highlighted.
* The highlighted option is scrolled into the popup's visible scrollport.

### winner-order-US1-TC18-1: Repeated same letter advances highlight to the next match

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
* At least two catalogue names start with the same letter.

**Test data:**

| Field | Value |
| --- | --- |
| Typed letter | S |

**Steps:**

1. Type the letter from **Test data** once.
2. Type the same letter again.

**Expected Results:**

* Step 1 highlights the first matching name and scrolls it into view.
* Step 2 moves the highlight to the next matching name and scrolls that name into view.

### winner-order-US1-TC19-1: Typeahead at the first letter of the alphabet

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
* The Country/Region picker is open with the highlight away from names starting with A.

**Test data:**

| Field | Value |
| --- | --- |
| Typed letter | A |

**Steps:**

1. Type the letter from **Test data**.

**Expected Results:**

* The highlight moves to the next name that starts with A.
* That option is inside the popup's visible scrollport.

### winner-order-US1-TC20-1: Typeahead at a late alphabet letter

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
| Typed letter | Z |

**Steps:**

1. Type the letter from **Test data**.

**Expected Results:**

* The highlight moves to the next name that starts with Z.
* That option is scrolled into the popup's visible scrollport.

### winner-order-US1-TC21-1: Choosing a mid-list country closes the picker on that selection

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
| Country or region | United Kingdom |

**Steps:**

1. Open the Country/Region picker.
2. Type U.
3. Select United Kingdom from the highlighted matches.

**Expected Results:**

* Step 3 closes the popup.
* The trigger shows United Kingdom.
* Options are no longer in the tree.

### winner-order-US1-TC22-1: Empty Country/Region is refused beside the field

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

### winner-order-US1-TC23-1: Catalogue includes both early and late alphabet partitions

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

**Out of scope for this change:** billing Add Address catalogue and typeahead are deferred (Non-Goal / Q1b). No `winner-order-US11-TC*` cases issued here until Product settles whether billing uses the same full list.

## Settled

(none from prior country-region picker runs)

## Reconciliation

**Run:** Blind suite reading 2026-09-21 for change `full-winner-order-country-region-list` capability `grade10-site/auction/winner-order`. Read isolated bundle under `/tmp/full-winner-country-blind/` (`proposal.md`, `decisions.md`, `ui-design.md`, `prd-order-setup-excerpt.md`, `winner-order/outline.md`, `winner-order/user-journeys.md`, `winner-order/feature-tcs-existing.md`, `specs-to-test-cases.md`, `spec-to-tcs-SKILL.md`). Denied: every `## Requirements` section; durable `openspec/specs/**` beyond the isolated Purpose/Feature set; `openspec/changes/archive/`; `/tmp/full-winner-country-scenarios/` and any scenario draft.

| Finding | Disposition |
| --- | --- |
| Delivery Add Address opens a complete A–Z catalogue | **Folded in:** `winner-order-SC-174` |
| Field label reads Country/Region | **Folded in:** `winner-order-SC-176` |
| Typed letter highlights next match and scrolls into view | **Folded in:** `winner-order-SC-175` |
| Repeated same letter advances to the next match | **Folded in:** `winner-order-SC-178` |
| Empty Country/Region refused beside the field | **Folded in:** `winner-order-SC-177` |
| Closed trigger shows selected/default; options not in tree | **Rejected:** design-system Select closed state; stated on `ui-design.md` Closed — **Out of suite:** Select stories / ui-design |
| Open long list inside capped-height scrollport | **Rejected:** presentation already on `ui-design.md` Open, long list; catalogue completeness is `winner-order-SC-174` |
| A / Z letter boundaries and early/late alphabet partitions | **Rejected:** redundant partitions of `winner-order-SC-174` / `winner-order-SC-175` |
| Choosing a mid-list country closes the picker on that value | **Rejected:** design-system Select selection contract, not a Winner Order product rule |
| Select typeahead scroll-into-view at unit layer | **Out of suite:** `@grade10/design-system` Select tests and stories |
| No-match letter, wrap after last same-letter match, case folding, diacritic / non-Latin leading match | **Rejected:** design-system Select typeahead defaults; not stated in this change's goals |
| Catalogue display locale / script | **Escalated:** ❓ on Post-Bidding Order Setup; Raised row for Product (@tangconst). No scenario |
| Billing Add Address full list / typeahead | **Deferred:** already Q1b / PRD ❓; US11 section carries out-of-scope note; no cases |
| Shippable destinations only | **Deferred:** already PRD ❓; catalogue stays complete; no scenario |

**Uncovered anchors:** none for `winner-order-US-01` under this change's feature set. Context journey `winner-order-US-11` has no new cases until Product settles billing catalogue parity.
