# grade10-admin/inventory/catalog Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-23, tcs-rules r3.0

## grade10-admin-inventory-catalog-US74: Inventory admin prepares reusable product media

**As an** inventory admin,
**I want** to attach, order, replace, and remove photographs and video on a catalogue product,
**so that** Auction operators can begin a listing with prepared material.

### grade10-admin-inventory-catalog-US74-TC1-1: Product accepts an ordered reusable gallery

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
* **Trace:** grade10-admin-inventory-catalog-US-74

**Pre-conditions:**

* An admin(inventory admin) is editing a product with no media.

**Steps:**

1. Add supported assets, reorder them, and save the product.

**Expected Results:**

* The product retains the selected order and exposes the assets to Auction.

## Settled

- Product-gallery management uses existing inventory-admin authorization; unauthorized requests are refused.

## Reconciliation

**Run:** Blind pass read the inventory outline, journey, decisions, and marked PRD; it was denied requirements and scenarios.

- **Raised, folded into spec:** CRUD, bounds, validation, reuse, and access are covered by `grade10-admin-inventory-catalog-SC-123` through `SC-127`.
