# grade10-admin/auction/listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-24, tcs-rules r3.0

## grade10-admin-auction-listing-US11: Operator starts a Cert-specific listing with its usual media

**As an** Auction operator,
**I want** selecting a product and Cert ID to show product-level media and
media tagged to that Cert first,
**so that** I can build the listing gallery from the source most likely to
document the unit I selected.

### grade10-admin-auction-listing-US11-TC1-1: A Cert listing offers only matching source media

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-11

**Pre-conditions:**

* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <product> has untagged source media, media tagged to <selected Cert ID>, and media tagged to <other Cert ID>.
* <selected Cert ID> and <other Cert ID> are printed Cert IDs for <product>.

**Test data:**

| Field | Value |
| --- | --- |
| Product | <product with all three source-media groups> |
| Selected Cert ID | <selected Cert ID> |
| Other Cert ID | <other Cert ID> |

**Steps:**

1. Select <product>.
2. Select <selected Cert ID>.
3. Open the main source media selector.

**Expected Results:**

* The selector offers untagged product media and media tagged to <selected Cert ID>.
* Media tagged to <other Cert ID> is absent from the main selector.

### grade10-admin-auction-listing-US11-TC2-1: A Cert without printed ID gets untagged media

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-11

**Pre-conditions:**

* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <product> has untagged source media and media tagged to <other Cert ID>.
* <selected Cert record> belongs to <product> and has no printed Cert ID; its media remains untagged and shared across the product.
* <other Cert ID> is a printed Cert ID for <product>.

**Test data:**

| Field | Value |
| --- | --- |
| Product | <product with untagged and Cert-tagged media> |
| Selected Cert record | <Cert record without a printed Cert ID> |
| Other Cert ID | <other Cert ID> |
| Untagged media | <shared product media, including media left untagged for the selected record> |

**Steps:**

1. Select <product>.
2. Select <selected Cert record>.
3. Open the main source media selector.

**Expected Results:**

* The selector offers untagged product media, including <untagged media>.
* Media tagged to <other Cert ID> is absent from the main selector.

### grade10-admin-auction-listing-US11-TC3-1: A source from another product is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-11

**Pre-conditions:**

* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <listing product> is selected and <other product source media> belongs to a different product.
* <draft listing> has an existing gallery.

**Steps:**

1. Attempt to add <other product source media> to <draft listing>.

**Expected Results:**

* Grade10 refuses the selection.
* The listing gallery remains unchanged.

---

## grade10-admin-auction-listing-US12: Operator deliberately uses another Cert's media

**As an** Auction operator,
**I want** another Cert's media separated into a labelled drawer and named
before I add it,
**so that** I can make an intentional exception without mistaking it for the
selected unit's normal media.

### grade10-admin-auction-listing-US12-TC1-1: The Other Cert drawer groups media by printed ID

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-12

**Pre-conditions:**

* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <product> has media tagged to <selected Cert ID>, <other Cert ID A>, and <other Cert ID B>.
* <selected Cert ID>, <other Cert ID A>, and <other Cert ID B> are printed Cert IDs for <product>.
* <product> also has untagged source media, including any media from a Cert record without a printed Cert ID.

**Test data:**

| Field | Value |
| --- | --- |
| Product | <product with untagged and Cert-tagged media> |
| Selected Cert ID | <selected Cert ID> |
| Other Cert IDs | <other Cert ID A> and <other Cert ID B> |

**Steps:**

1. Select <product>.
2. Select <selected Cert ID>.
3. Open the Other Cert media drawer.

**Expected Results:**

* The separately labelled drawer groups media tagged to <other Cert ID A> and <other Cert ID B> under their printed Cert IDs.
* Untagged product media is not in the Other Cert drawer.

### grade10-admin-auction-listing-US12-TC2-1: Adding other-Cert media identifies its source Cert

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-12

**Pre-conditions:**

* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <product> is selected with <selected Cert ID>.
* <source media> is tagged to the other printed Cert ID <source Cert ID> for <product>.

**Test data:**

| Field | Value |
| --- | --- |
| Product | <product> |
| Selected Cert ID | <selected Cert ID> |
| Source Cert ID | <source Cert ID> |
| Source media | <media tagged to source Cert ID> |

**Steps:**

1. Open the Other Cert media drawer.
2. Choose <source media> under <source Cert ID>.
3. Select Add to listing for <source Cert ID>.

**Expected Results:**

* The listing gallery includes <source media>.
* The addition identifies <source Cert ID> as the source Cert.

### grade10-admin-auction-listing-US12-TC3-1: Source media additions use existing listing authority

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-12

**Pre-conditions:**

* admin(without existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <source media> is tagged to printed Cert ID <source Cert ID> for <product>.
* <listing> belongs to <product> and has a saved gallery.

**Steps:**

1. Request the Other Cert media drawer for <listing>.
2. Attempt to add <source media> from <source Cert ID> to <listing>.

**Expected Results:**

* Grade10 refuses the drawer read and addition under existing Auction authorization.
* The listing gallery remains unchanged.

---

## grade10-admin-auction-listing-US13: Operator lists an unnumbered unit

**As an** Auction operator,
**I want** No Cert ID to show product-level media without bringing forward
another Cert's media,
**so that** I can start an unnumbered listing without assuming a numbered
copy's photographs apply.

### grade10-admin-auction-listing-US13-TC1-1: A No Cert ID listing offers only untagged media

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-13

**Pre-conditions:**

* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <product> has untagged source media and media tagged to printed Cert IDs.

**Test data:**

| Field | Value |
| --- | --- |
| Product | <product with untagged and Cert-tagged media> |
| Untagged media | <product-level source media> |
| Cert-tagged media | <source media tagged to a printed Cert ID> |

**Steps:**

1. Select <product>.
2. Select No Cert ID.
3. Open the main source media selector.

**Expected Results:**

* The selector offers <untagged media> only.
* Media tagged to a printed Cert ID is absent from the main selector.

---

## grade10-admin-auction-listing-US14: Operator keeps a listing gallery independent of its source

**As an** Auction operator,
**I want** a selected source item's alt text copied into my listing gallery
and then editable with its order,
**so that** the listing records what I chose even if Inventory source media
changes later.

### grade10-admin-auction-listing-US14-TC1-1: Saved source media copies current bytes and alt text

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
* **Trace:** grade10-admin-auction-listing-US-14

**Pre-conditions:**

* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <product> and <selected Cert ID> are selected for a draft listing.
* <source media> is available to the selected listing and has current alt text <source alt text>.

**Test data:**

| Field | Value |
| --- | --- |
| Product | <product> |
| Selected Cert ID | <selected Cert ID> |
| Source media | <source image> |
| Source alt text | <current source alt text> |

**Steps:**

1. Open the main source media selector.
2. Add <source media> to the listing gallery.
3. Save the draft listing.

**Expected Results:**

* The saved listing gallery contains a copy of <source media>'s bytes and <source alt text>.

### grade10-admin-auction-listing-US14-TC2-1: Listing gallery copy supports alt and order edits

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-14

**Pre-conditions:**

* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <draft listing> has a copied source item <listing media> and another gallery item <other listing media>.

**Test data:**

| Field | Value |
| --- | --- |
| Listing media | <copied source item> |
| Other listing media | <another gallery item> |
| Listing alt text | <edited listing alt text> |

**Steps:**

1. Edit <listing media>'s alt text to <listing alt text>.
2. Move <listing media> after <other listing media>.
3. Save the draft listing.

**Expected Results:**

* The saved gallery shows <listing alt text> for <listing media>.
* <listing media> appears after <other listing media>.

### grade10-admin-auction-listing-US14-TC3-1: Later source edits leave the listing snapshot unchanged

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
* **Trace:** grade10-admin-auction-listing-US-14

**Pre-conditions:**

* admin(Inventory operator with existing Inventory media-management authority) is on <grade10 Inventory media manager url>.
* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <saved listing> contains a copy of <source media> with <original alt text> before <other listing media>.
* <source media> and <other source media> belong to <product>.

**Test data:**

| Field | Value |
| --- | --- |
| Source media | <original source image> |
| Replacement bytes | <replacement source image> |
| Original alt text | <original alt text> |
| Replacement alt text | <replacement alt text> |
| Other source media | <another source image> |

**Steps:**

1. Edit <source media> to use <replacement bytes> and <replacement alt text>.
2. Move <source media> after <other source media> in Inventory.
3. Open <saved listing>'s gallery as the Auction operator.

**Expected Results:**

* The listing copy retains its original bytes and <original alt text>.
* The listing copy remains before <other listing media>.

### grade10-admin-auction-listing-US14-TC4-1: Retagging source media preserves the listing snapshot

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
* **Trace:** grade10-admin-auction-listing-US-14

**Pre-conditions:**

* admin(Inventory operator with existing Inventory media-management authority) is on <grade10 Inventory media manager url>.
* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <saved listing> contains a copy of <source media>, which is tagged to <source Cert ID>.
* <other Cert ID> is another printed Cert ID for <product>.

**Test data:**

| Field | Value |
| --- | --- |
| Source media | <media tagged to source Cert ID> |
| Source Cert ID | <source Cert ID> |
| Other Cert ID | <other Cert ID> |
| Saved listing | <listing with a copy of source media> |

**Steps:**

1. Retag <source media> from <source Cert ID> to <other Cert ID>.
2. Open <saved listing>'s gallery as the Auction operator.

**Expected Results:**

* The saved listing copy retains the same bytes and alt text as before the Inventory change.

### grade10-admin-auction-listing-US14-TC5-1: Untagging source media preserves the listing snapshot

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
* **Trace:** grade10-admin-auction-listing-US-14

**Pre-conditions:**

* admin(Inventory operator with existing Inventory media-management authority) is on <grade10 Inventory media manager url>.
* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <saved listing> contains a copy of <source media>, which is tagged to <source Cert ID>.

**Test data:**

| Field | Value |
| --- | --- |
| Source media | <media tagged to source Cert ID> |
| Source Cert ID | <source Cert ID> |
| Saved listing | <listing with a copy of source media> |

**Steps:**

1. Untag <source media> from <source Cert ID>.
2. Open <saved listing>'s gallery as the Auction operator.

**Expected Results:**

* The saved listing copy retains the same bytes and alt text as before the Inventory change.

### grade10-admin-auction-listing-US14-TC6-1: Physical Cert removal deletes the source and preserves the listing snapshot

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-14

**Pre-conditions:**

* admin(Inventory operator with existing Inventory media-management authority) is on <grade10 Inventory Cert record url>.
* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <source Cert record> is available with no active reservation.
* <source media> is tagged to printed Cert ID <source Cert ID> for <product>.
* <saved listing> contains a copy of <source media>.

**Test data:**

| Field | Value |
| --- | --- |
| Product | <product> |
| Source media | <media tagged to source Cert ID> |
| Source Cert ID | <source Cert ID> |
| Saved listing | <listing with a copy of source media> |

**Steps:**

1. Remove the physical unit for <source Cert ID> in Inventory.
2. Open <saved listing>'s gallery as the Auction operator.

**Expected Results:**

* Inventory deletes the Cert record and its tagged source media as part of physical-unit removal.
* The saved listing copy retains the same bytes and alt text as before the Inventory change.

### grade10-admin-auction-listing-US14-TC7-1: Source selection accepts an eighth gallery item

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-14

**Pre-conditions:**

* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <draft listing> has seven gallery items and <source media> is available in its main selector.

**Test data:**

| Field | Value |
| --- | --- |
| Draft listing | <listing with seven gallery items> |
| Source media | <eligible source media> |

**Steps:**

1. Open the main source media selector.
2. Add <source media> to the listing gallery.
3. Save the draft listing.

**Expected Results:**

* The saved listing gallery contains eight items, including <source media>.

### grade10-admin-auction-listing-US14-TC8-1: A ninth source item is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-14

**Pre-conditions:**

* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <draft listing> has eight gallery items and <source media> is available in its main selector.

**Test data:**

| Field | Value |
| --- | --- |
| Draft listing | <listing with eight gallery items> |
| Source media | <eligible source media not already in the gallery> |

**Steps:**

1. Open the main source media selector.
2. Attempt to add <source media> to the listing gallery.
3. Save the draft listing.

**Expected Results:**

* The saved listing gallery still contains eight items.
* <source media> is absent from the saved listing gallery.

### grade10-admin-auction-listing-US14-TC9-1: Source media and direct uploads share one ordered gallery

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-14

**Pre-conditions:**

* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <draft listing> has no media and has <selected source media> available from its selected product.

**Test data:**

| Field | Value |
| --- | --- |
| Direct upload | <supported JPEG> |
| Selected source media | <eligible source video> |

**Steps:**

1. Add <direct upload> to <draft listing>.
2. Add <selected source media> after <direct upload>.
3. Save the draft listing.

**Expected Results:**

* The saved gallery contains both items in the chosen order.
* The saved gallery has no more than eight items.

### grade10-admin-auction-listing-US14-TC10-1: A missing source media item refuses Save

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-14

**Pre-conditions:**

* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <draft listing> has <selected source media> selected, but that source media is absent before Save.

**Steps:**

1. Save <draft listing>.

**Expected Results:**

* Grade10 refuses Save.
* The listing gallery remains unchanged.

## Reconciliation

**Run:** 2026-09-24; the listing blind suite was resumed from its original isolated reading after Q10 was added to the allowed decisions input. The reader saw the outline, journey, proposal, updated decisions and Raised table, linked Listings PRD, config context, and permitted suite material. It was denied Requirements, durable specs, archive, tech-design, and the inventory reading's draft. Its original missing-printed-ID question is settled by Q10; it raised no other genuine product question.

| Diff | Disposition |
| --- | --- |
| The first listing pass asked how a Cert record without a printed ID could be named in the Other Cert drawer and Add to listing action. | Q10 settles that such a record has no Cert tag, contributes only untagged shared media, and is absent from the drawer. TC2-1 covers the selected no-ID record; SC-102 records untagged-only main selection. No fallback label is needed. |
| The outline separates the normal selector from deliberate cross-Cert selection. | TC1-1 and TC2-1 cover the default selector, TC1-1 of US12 covers drawer grouping, and TC2-1 of US12 covers an explicit addition naming its source Cert. SC-101 through SC-105 state those rules. |
| Inventory edits, retagging, untagging, and Cert deletion must not mutate a saved listing copy. | TC1-1 through TC6-1 of US14 cover copying current bytes/alt, listing edits, and later source changes; SC-106 through SC-111 state the snapshot behavior. |
| Existing direct uploads and gallery bounds remain unchanged while source media uses the same ordered gallery. | TC7-1 and TC8-1 cover source additions at the eight-item boundary; TC9-1 covers combined order; TC10-1 covers refusal when the selected source is no longer available at Save. Existing direct-upload type, size, order, and ninth-upload cases remain covered by the durable listing feature suite at `openspec/specs/grade10-admin/auction/listing/feature-tcs.md`. |
| Existing authority governs drawer reads and additions; a source belonging to another product is not eligible. | TC3-1 of US11 and TC3-1 of US12 cover refusal and unchanged gallery. SC-114 and SC-115 state those behaviors; no new grant is introduced. |
