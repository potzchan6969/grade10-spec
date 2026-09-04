# shared/ui/store-order-history Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-02, tcs-rules r1

## shared-ui-store-order-history-US1: Collector reviews active and past orders

**As a** signed-in collector,
**I want** my active and past orders on one page, with status, lines, and track
when a shipment is underway,
**so that** I can follow a live order or reopen an older one without the
surface inventing which orders belong where.

### shared-ui-store-order-history-US1-TC1-1: Active and past sections both render when non-empty

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-order-history-US-01

**Pre-conditions:**
The consumer supplies a non-empty active list and a non-empty past list.

**Steps:**

1. Render `OrderHistory` with those lists.
2. Check the page sections and cards.

**Expected Results:**

* Both section headings and their order cards appear.
* The empty state does not appear.

### shared-ui-store-order-history-US1-TC2-1: Empty section is omitted

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-ui-store-order-history-US-01

**Pre-conditions:**
The consumer supplies a non-empty active list and an empty past list.

**Steps:**

1. Render `OrderHistory` with those lists.
2. Check the section headings.

**Expected Results:**

* Only the Active Orders section appears.
* The Past Orders heading does not appear.
* The empty state does not appear.

### shared-ui-store-order-history-US1-TC3-1: Track order appears only when enabled

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-order-history-US-01

**Pre-conditions:**
A card header is supplied with `trackOrder` true and Track copy.

**Steps:**

1. Render the card header.
2. Activate the Track Order control.

**Expected Results:**

* The Track Order control appears.
* Activating it reports through the Track callback.

### shared-ui-store-order-history-US1-TC4-1: Track order is hidden when disabled

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-ui-store-order-history-US-01

**Pre-conditions:**
A card header is supplied with `trackOrder` false and a View Details handler.

**Steps:**

1. Render the card header.

**Expected Results:**

* No Track Order control appears.
* View Details still appears.

### shared-ui-store-order-history-US1-TC5-1: Card lists supplied lines with status labels

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-order-history-US-01

**Pre-conditions:**
An order card is supplied with header props, a status label, and one or more line items that include image, product text, and total.

**Steps:**

1. Render `OrderHistoryCard` with those children.
2. Check the header, status, and each line.

**Expected Results:**

* The header and each child line item appear.
* The body uses horizontal overflow with scroll-fade styling.
* Each status displays the supplied label.
* Each line shows image, product text, and total.

### shared-ui-store-order-history-US1-TC6-1: Application imports the surface and reuses a part alone

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-ui-store-order-history-US-01

**Pre-conditions:**
None.

**Steps:**

1. Import each order-history export from the shared UI package's public entry.
2. Render the status, line item, card header, or card without `OrderHistory`.

**Expected Results:**

* Every named import resolves and no other component or type is exported for this surface.
* The part renders as specified, with no missing-context error.

---

## shared-ui-store-order-history-US2: Collector starts shopping when there are no orders

**As a** signed-in collector with no orders,
**I want** an empty state that sends me to the store,
**so that** I know where my first order will appear and can browse.

### shared-ui-store-order-history-US2-TC1-1: Zero orders shows empty state with shop now

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-order-history-US-02

**Pre-conditions:**
The consumer supplies empty active and past lists, empty-state copy, and a Shop Now handler.

**Steps:**

1. Render `OrderHistory` with those lists.
2. Activate Shop Now.

**Expected Results:**

* The empty state appears with the supplied title, description, and Shop Now action.
* Neither Active nor Past section headings appear.
* Activating Shop Now reports through its callback.
