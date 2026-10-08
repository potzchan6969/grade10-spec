# grade10-admin Cross-Domain E2E Test Cases

**Status:** pending-review · 0/2
**Drafts styled:** 2026-10-05, tcs-rules r4

## grade10-admin-e2e-US1: Operator starts a listing with its Cert's source media

**As an** Auction operator,
**I want** the listing source to include product media and my selected Cert's media,
**so that** I can build a gallery that documents the physical unit I selected.

<!-- trace:case id=g10adm.grade10-admin-product.TC-wpw rev=1 covers=g10adm.inventory-catalog.SC-sbt,g10adm.inventory-catalog.SC-hcz,g10adm.inventory-catalog.SC-ec6,g10adm.inventory-catalog.SC-6tq,g10adm.inventory-catalog.SC-fbv,g10adm.inventory-catalog.SC-hhf,g10adm.auction-listing.SC-vhc,g10adm.auction-listing.SC-lvn,g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
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

* admin(holds existing Inventory media-management authority) is on <grade10 admin inventory media manager url> for <product>.
* admin(holds existing Auction listing-edit authority) can draft a listing for <product> and <selected Cert ID>.

**Test data:**

| Field | Value |
| --- | --- |
| `<product>` | A product with saved source media and two Cert records |
| `<source media>` | One untagged saved source item on `<product>` |
| `<selected Cert ID>` | One Cert record on `<product>` |
| `<other Cert ID>` | Another Cert record on `<product>` |
| `<alt text>` | An alt text different from the one stored on `<source media>` |

**Steps:**

1. Tag <source media> to <selected Cert ID>.
2. Start a draft listing for <product> and <selected Cert ID>.
3. Open the main source selector.
4. Add <source media>.
5. Save the listing gallery.
6. Change the alt text of <source media> to <alt text> in Inventory.
7. Reopen the listing gallery.

**Expected Results:**

* Step 3 offers <source media>.
* Step 3 excludes media tagged to <other Cert ID>.
* The saved gallery holds a copy of <source media>'s bytes.
* That copy keeps the alt text from the moment it was added.
* Step 6 leaves the saved copy's alt text unchanged.

---

## grade10-admin-e2e-US2: Operator removes a Cert after saving its media to a listing

**As an** Inventory operator,
**I want** to remove an available physical unit and its Cert record together,
**so that** its tagged source media is deleted while an Auction listing keeps its saved copy.

<!-- trace:case id=g10adm.grade10-admin-product.TC-8p3 rev=1 covers=g10adm.inventory-catalog.SC-gpb,g10adm.inventory-catalog.SC-k3v,g10adm.auction-listing.SC-xyf,g10adm.auction-listing.SC-01q,g10adm.auction-listing.SC-emr,g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
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

* admin(holds existing Auction listing-edit authority) can draft a listing for <product> and <selected Cert ID>.
* admin(holds existing Inventory write authority) is on <grade10 admin inventory record url> for <product>.

**Test data:**

| Field | Value |
| --- | --- |
| `<product>` | A product with two available Cert records and saved media |
| `<selected Cert ID>` | An available Cert on `<product>`, with no active reservation |
| `<source Cert ID>` | A different available Cert on `<product>`, with no active reservation |
| `<source media>` | Saved source media tagged to `<source Cert ID>` |
| `<shared media>` | Untagged saved media on `<product>` |
| `<withdrawal reason>` | A non-empty reason |

**Steps:**

1. Start a draft listing for <product> and <selected Cert ID>.
2. Open the Other Cert media drawer.
3. Add <source media> by naming <source Cert ID>.
4. Save the listing gallery.
5. Note the saved copy's bytes and alt text.
6. Enter <withdrawal reason>.
7. Remove the physical unit for <source Cert ID>.
8. Confirm the removal.
9. Reopen the product media, the Cert records, and the saved listing gallery.

**Expected Results:**

* The record for <source Cert ID> is gone.
* <source media> tagged to that Cert is gone.
* <shared media> remains, still untagged.
* Stock is one lower, and withdrawn is one higher.
* The ledger is unchanged.
* The withdrawal changelog records <withdrawal reason>.
* The saved gallery still holds the copied bytes and alt text.

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
