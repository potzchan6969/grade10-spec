# grade10-site/store/store-locator Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## grade10-site-store-store-locator-US1: Collector finds the Hong Kong shop from chrome

**As a** collector,
**I want** Store Locator in the header or footer to open the Location & Hours
page for the Hong Kong shop,
**so that** I can read the address and hours without hunting for a dead link.

### grade10-site-store-store-locator-US1-TC1-1: Store Locator answers whole before scripts run

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
* **Trace:** grade10-site-store-store-locator-US-01

**Pre-conditions:**

* JavaScript disabled in the browser.
* The site answers the Store Locator address.

**Steps:**

1. Navigate to <grade10 store locator url>.
2. Check the rendered page.
3. Check the page source.

**Expected Results:**

* Location & Hours headline is visible.
* Store name Hong Kong Grade10 Store is visible.
* Street address 13 Pak Sha Road, Causeway Bay, Hong Kong is visible.
* Week hours are visible.
* Page source carries that headline, name, address and hours without scripts.
* URL contains <lang>.

### grade10-site-store-store-locator-US1-TC2-1: One shop detail, not a finder

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
* **Trace:** grade10-site-store-store-locator-US-01

**Pre-conditions:**

* The site answers the Store Locator address.

**Steps:**

1. Navigate to <grade10 store locator url>.
2. Check the page for search, store list, distance, filters and store picker.

**Expected Results:**

* The one Hong Kong shop is shown.
* No search field, store list, distance, filter controls or store picker appears.

### grade10-site-store-store-locator-US1-TC3-1: Store Locator title differs from other public surfaces

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
* **Trace:** grade10-site-store-store-locator-US-01

**Pre-conditions:**

* The site answers Store Locator and Store home.

**Steps:**

1. Fetch <grade10 store locator url> and read title and meta description.
2. Fetch <grade10 store url> and read title and meta description.

**Expected Results:**

* Titles differ.
* Meta descriptions differ.

### grade10-site-store-store-locator-US1-TC4-1: Header Store Locator opens the page

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
* **Trace:** grade10-site-store-store-locator-US-01

**Pre-conditions:**

* The site answers Store Locator.
* Collector is on a surface that shows store chrome.

**Steps:**

1. Activate Store Locator in the header.
2. Check the page and the header current marking.

**Expected Results:**

* Store Locator renders with Location & Hours.
* Store Locator is marked as the current page in the header.

### grade10-site-store-store-locator-US1-TC5-1: Footer Store Locator opens the page

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
* **Trace:** grade10-site-store-store-locator-US-01

**Pre-conditions:**

* The site answers Store Locator.
* Collector is on a surface that shows the store footer.

**Steps:**

1. Activate Store Locator in the footer.
2. Check the page.

**Expected Results:**

* Store Locator renders with Location & Hours.

### grade10-site-store-store-locator-US1-TC6-1: Narrow viewport stays usable

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-store-locator-US-01

**Pre-conditions:**

* Viewport is 375 CSS pixels wide.
* The site answers Store Locator.

**Steps:**

1. Navigate to <grade10 store locator url>.
2. Check layout, map, address, hours and chrome.

**Expected Results:**

* Page scrolls vertically only.
* No content is clipped.
* Map, address, hours and chrome remain reachable.

---

## grade10-site-store-store-locator-US2: Collector opens Google Maps from the page

**As a** collector,
**I want** activating the map to open Google Maps for the shop,
**so that** I get directions without a second control on the page.

### grade10-site-store-store-locator-US2-TC1-1: Map opens Google Maps for the shop

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
* **Trace:** grade10-site-store-store-locator-US-02

**Pre-conditions:**

* The site answers Store Locator.

**Steps:**

1. Navigate to <grade10 store locator url>.
2. Activate the map control.
3. Check the destination.

**Expected Results:**

* Google Maps opens for Hong Kong Grade10 Store at 13 Pak Sha Road, Causeway Bay, Hong Kong.

### grade10-site-store-store-locator-US2-TC2-1: No separate Get directions control

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-store-locator-US-02

**Pre-conditions:**

* The site answers Store Locator.

**Steps:**

1. Navigate to <grade10 store locator url>.
2. Check for a Get directions control beside the map.

**Expected Results:**

* The map is the only control that opens Google Maps.
* No separate Get directions control appears.

---

**Out of suite:** none — every accepted-by scenario above has a case.
