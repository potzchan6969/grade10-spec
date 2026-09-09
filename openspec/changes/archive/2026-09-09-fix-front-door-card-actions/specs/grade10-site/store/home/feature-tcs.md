# grade10-site/store/home Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-08, tcs-rules r2

Additions to the capability's approved suite, not a replacement: US1, US2, US4
and US5 are unchanged, and US3 keeps every case it already carries. At archive
these are merged into `openspec/specs/grade10-site/store/home/feature-tcs.md`
rather than written over it.

## grade10-site-store-home-US3: Collector browses the merchandised collection

**As a** collector,
**I want** a row of cards from the first collection the catalogue lists,
**so that** I can open a card's page or the rest of that collection from the
front door.

### grade10-site-store-home-US3-TC6-1: Row offers no way into the cart

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
* **Trace:** grade10-site-store-home-US-03

**Pre-conditions:**
The catalogue lists a collection holding cards the shop has stock of.

**Steps:**

1. Navigate to <grade10 store url>.
2. Hover each card in the merchandised row, then move keyboard focus onto it.
3. Activate a card.

**Expected Results:**

* No cart control appears on any card, at hover or on focus.
* Step 3 opens that product's own page.

---

## grade10-site-store-home-US6: Collector reads a card's standing before opening it

**As a** collector scanning the front door,
**I want** a card to say whether it is sold out and whether it is marked down,
**so that** I open the ones worth opening rather than finding out on the page.

### grade10-site-store-home-US6-TC1-1: Card the shop has sold out

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
* **Trace:** grade10-site-store-home-US-06

**Pre-conditions:**
The merchandised collection leads with <a card> nothing is left to buy of.

**Steps:**

1. Navigate to <grade10 store url>.
2. Check how <that card> is drawn against the rest of the row.
3. Hover it and move keyboard focus onto it.

**Expected Results:**

* Card is shown sold out, the way the browse listing shows one.
* No cart control appears on it at either moment.

### grade10-site-store-home-US6-TC2-1: Card the shop has marked down

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
* **Trace:** grade10-site-store-home-US-06

**Pre-conditions:**

* The merchandised collection holds <a marked-down card>, priced below what
  the shop compares it at.
* It also holds <a full-price card>, which the shop compares at nothing.

**Steps:**

1. Navigate to <grade10 store url>.
2. Read both cards' prices.

**Expected Results:**

* <a marked-down card> shows what it costs now and what it used to cost.
* <a full-price card> shows one price and nothing struck through.
