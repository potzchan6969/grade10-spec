# grade10-admin Cross-Domain E2E Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-24, tcs-rules r3.0

## grade10-admin-e2e-US1: Operator starts a listing with its Cert's source media

**As an** Auction operator,
**I want** the listing source to include product media and my selected Cert's media,
**so that** I can build a gallery that documents the physical unit I selected.

### grade10-admin-e2e-US1-TC1-1: Tagged source becomes an independent listing snapshot

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-inventory-catalog-US-12, grade10-admin-auction-listing-US-11, grade10-admin-auction-listing-US-14

**Pre-conditions:**

* admin(Inventory media-management authority) can manage saved product media for <product>.
* admin(Auction listing-edit authority) can draft a listing for <product>.
* <product> has one untagged saved source media item, one Cert record with Cert ID <selected Cert ID>, and one other Cert record with Cert ID <other Cert ID>.

**Steps:**

1. Tag <source media> to <selected Cert ID> in Inventory.
2. Start a draft listing for <product> and <selected Cert ID> in Auction.
3. Add <source media> from the main source selector and save the listing gallery.
4. Change <source media>'s alt text in Inventory.
5. Reopen the listing gallery.

**Expected Results:**

* The main source selector offers <source media> and excludes media tagged to <other Cert ID>.
* The listing gallery contains a copy of <source media>'s bytes and its alt text as it was when added.
* Changing the Inventory source alt text does not change the saved listing copy.

---

## grade10-admin-e2e-US2: Operator removes a Cert after saving its media to a listing

**As an** Inventory operator,
**I want** to remove an available physical unit and its Cert record together,
**so that** its tagged source media is deleted while an Auction listing keeps its saved copy.

### grade10-admin-e2e-US2-TC1-1: Physical removal deletes tagged source media but keeps the listing snapshot

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** integration
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-inventory-catalog-US-13, grade10-admin-auction-listing-US-12, grade10-admin-auction-listing-US-14

**Pre-conditions:**

* admin(Auction listing-edit authority) can draft a listing for <product> and <selected Cert ID>.
* admin(Inventory write authority) can manage the product's Cert records and saved media.
* <product> has available Cert records <selected Cert ID> and <source Cert ID>, each with no active reservation.
* <source Cert ID> differs from <selected Cert ID> and has <source media> tagged to it; <shared media> is untagged.

**Steps:**

1. Start a draft listing for <product> and <selected Cert ID>.
2. Open the Other Cert media drawer and add <source media> by naming <source Cert ID>.
3. Save the listing gallery and record the saved copy's bytes and alt text.
4. Enter a non-empty withdrawal reason, then remove the physical unit for <source Cert ID> in Inventory and confirm.
5. Reopen the product media, Cert records, and saved listing gallery.

**Expected Results:**

* The <source Cert ID> record and its tagged <source media> are removed; <shared media> remains untagged.
* Inventory stock decreases by one and withdrawn increases by one, with the ledger unchanged.
* The withdrawal changelog records the supplied reason.
* The saved listing gallery retains its copied bytes and alt text after source deletion.

## Settled

- Physical-unit removal requires an available Cert record without an active reservation; its tagged source media is deleted while the Auction snapshot remains independent.
- Removing a media tag or retagging leaves the original source item untagged and available as product-level media.
- Removing a physical Cert unit deletes that Cert record and its currently tagged source media; it does not rewrite a saved Auction listing snapshot.
- No Cert ID stock is regular inventory without a Cert record; it can use untagged product media but is not a Cert media tag target.

## Reconciliation

**Run:** 2026-09-24; derived from the Grade10 Admin Inventory, Auction, console, vault, and appointment user journeys and their PRD pages. The two smoke paths compose Inventory catalog with Auction listing; single-domain boundaries remain in feature suites.

| Diff | Disposition |
| --- | --- |
| The Grade10 Admin product smoke suite did not exist. | Added the two curated cross-domain paths required by this change; feature suites retain their individual refusal and boundary cases. |

**Run:** 2026-09-24; the product paths were derived from both domain journeys and their PRDs. The two independent product readings proposed conflicting outcomes for source media after physical Cert removal; the user's clarification settles that removal deletes the tagged source media, while the Auction snapshot remains independent. Both cases remain draft for product-suite review.

| Diff | Disposition |
| --- | --- |
| An earlier cross-domain read expected physical Cert removal to leave the source item untagged and reusable. | The user clarified that physical-unit removal deletes source media tagged to that Cert. US2-TC1-1 now expects source deletion and preservation of the already-saved listing snapshot. |
| Another read raised the stock and listing outcome for guarded Cert removal. | Q4 records the available/no-active-reservation guard and withdrawn accounting. The composed test selects a different Cert for its listing so the source Cert removal does not target the selected listing unit. |
