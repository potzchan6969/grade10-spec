# grade10-admin Cross-Domain E2E Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-24, tcs-rules r3.0

## grade10-admin-e2e-US1: Operator uses matching Cert media in a listing

**As an** admin,
**I want** to classify a copy's source media and use it in its matching listing,
**so that** the listing begins with evidence for the selected physical unit.

### grade10-admin-e2e-US1-TC1-1: Matching Cert media becomes a listing snapshot

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-12, grade10-admin-auction-listing-US-11, grade10-admin-auction-listing-US-14

**Pre-conditions:**

* admin(holds Inventory media-management and Auction listing-edit authority) is on <grade10 admin inventory media manager url>.
* <product> has <selected Cert> and <other Cert>, both with printed Cert IDs.
* <listing> is a draft for <product> and <selected Cert>.
* <matching media> and <shared media> are untagged on <product>; <other media> is tagged to <other Cert>.

**Test data:**

| Field | Value |
| --- | --- |
| <selected Cert> | Printed Cert ID PSA-001 |
| <other Cert> | Printed Cert ID PSA-002 |
| <matching media> | A saved image with alt text Front label |
| <other media> | A saved image tagged to <other Cert> |

**Steps:**

1. Tag <matching media> to <selected Cert> in Inventory.
2. Open <listing>'s media selector in Auction.
3. Add <matching media> and save <listing>.

**Expected Results:**

* Inventory shows <matching media> tagged to <selected Cert>.
* The main selector offers untagged and <selected Cert> media; <other media> is absent.
* <listing>'s gallery contains <matching media> with its current alt text.

---

## grade10-admin-e2e-US2: Operator keeps an Auction snapshot after physical withdrawal

**As an** admin,
**I want** to select another Cert's media deliberately and remove its unit afterward,
**so that** the listing keeps its chosen image when Inventory removes the source.

### grade10-admin-e2e-US2-TC1-1: Other Cert snapshot survives physical withdrawal

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** integration
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-13, grade10-admin-auction-listing-US-12, grade10-admin-auction-listing-US-14

**Pre-conditions:**

* admin(holds Inventory media-management and Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <product> has <selected Cert>, an available <other Cert> with no active reservation, and <unaffected Cert>.
* <listing> is a draft for <product> and <selected Cert>.
* <other media> is tagged to <other Cert>; <unaffected media> is tagged to <unaffected Cert>; <shared media> is untagged.

**Test data:**

| Field | Value |
| --- | --- |
| <selected Cert> | Printed Cert ID PSA-001 |
| <other Cert> | Printed Cert ID PSA-002 |
| <unaffected Cert> | Printed Cert ID PSA-003 |
| <other media> | A saved image tagged to <other Cert>, alt text Back label |

**Steps:**

1. Open <listing>'s Other Cert drawer and add <other media>.
2. Save <listing>.
3. Remove the physical unit for <other Cert> from Inventory.
4. Reopen <listing> and inspect its gallery.

**Expected Results:**

* The drawer identifies <other media> by <other Cert> and adds it only through the explicit action.
* Inventory counts the unit as withdrawn and removes <other media>; <shared media> and <unaffected media> remain.
* <listing>'s gallery still shows its saved copy of <other media> with alt text Back label.

## Settled

- Physical-unit removal requires an available Cert record without an active reservation; its tagged source media is deleted while the Auction snapshot remains independent.

## Reconciliation

**Run:** 2026-09-24; derived from the Grade10 Admin Inventory, Auction, console, vault, and appointment user journeys and their PRD pages. The two smoke paths compose Inventory catalog with Auction listing; single-domain boundaries remain in feature suites.

| Diff | Disposition |
| --- | --- |
| The Grade10 Admin product smoke suite did not exist. | Added the two curated cross-domain paths required by this change; feature suites retain their individual refusal and boundary cases. |