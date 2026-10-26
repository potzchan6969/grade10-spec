# grade10-admin Cross-Domain E2E Test Cases

**Status:** pending-review · 0/2
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Walk 1: Tag a Cert's media, list it, then remove another Cert

Starting state:

- admin(holds Inventory media-management and write authority, and Auction listing-edit authority) is signed in at `<g10adm url>`.
- `<product>` has `<selected Cert ID>`, `<other Cert ID>` and `<source Cert ID>`, each available with no active reservation.
- `<source Cert ID>` has moved since intake: it was reserved once and that reservation was released.
- `<untagged media>` and `<shared media>` are saved on `<product>` and untagged; `<other Cert media>` is tagged to `<other Cert ID>`; `<source Cert media>` is tagged to `<source Cert ID>`.

Shared test data:

| Field | Value |
| --- | --- |
| product | A product with three Cert records and saved source media |
| selected Cert ID | One Cert record on `<product>` |
| other Cert ID | A second Cert record on `<product>` |
| source Cert ID | A third Cert record on `<product>` |
| untagged media | One untagged saved source item on `<product>` |
| shared media | Another untagged saved source item on `<product>` |
| other Cert media | Saved source media tagged to `<other Cert ID>` |
| source Cert media | Saved source media tagged to `<source Cert ID>` |
| alt text | An alt text different from the one stored on `<untagged media>` |
| withdrawal reason | Any non-empty reason |

### Route

1. In Inventory, open `<product>`'s media and tag `<untagged media>` to `<selected Cert ID>`.
2. In Auction, start a draft listing for `<product>` and `<selected Cert ID>`, and open the main source selector.
   - It offers `<untagged media>`. `g10adm-pdt.US1-TC1`
   - It leaves out `<other Cert media>`. `g10adm-pdt.US1-TC1`
3. Add `<untagged media>`, open the Other Cert media drawer, add `<source Cert media>` by naming `<source Cert ID>`, and save the listing gallery.
   - The saved gallery holds a copy of `<untagged media>`'s bytes, with the alt text it had when it was added. `g10adm-pdt.US1-TC1`
4. In Inventory, change `<untagged media>`'s alt text to `<alt text>`, then reopen the listing gallery.
   - The saved copy's alt text is unchanged. `g10adm-pdt.US1-TC1`
5. In Inventory, open `<source Cert ID>`, select Remove physical unit, enter `<withdrawal reason>` and confirm.
   - The record for `<source Cert ID>` and `<source Cert media>` are gone. `g10adm-pdt.US2-TC1`
   - `<shared media>` remains, still untagged. `g10adm-pdt.US2-TC1`
   - Stock is one lower, withdrawn is one higher, and the ledger is unchanged. `g10adm-pdt.US2-TC1`
   - The withdrawal's history entry records `<withdrawal reason>`. `g10adm-pdt.US2-TC1`
6. Reopen the saved listing gallery.
   - It still holds the copy of `<source Cert media>`, with its bytes and alt text. `g10adm-pdt.US2-TC1`

## g10adm-pdt.US1: Operator starts a listing with its Cert's source media

**As an** Auction operator,
**I want** the listing source to include product media and my selected Cert's media,
**so that** I can build a gallery that documents the physical unit I selected.

<!-- trace:case id=g10adm.grade10-admin-product.TC-wpw rev=1 covers=g10adm.inventory-catalog.SC-sbt,g10adm.inventory-catalog.SC-hcz,g10adm.inventory-catalog.SC-ec6,g10adm.inventory-catalog.SC-6tq,g10adm.inventory-catalog.SC-fbv,g10adm.inventory-catalog.SC-hhf,g10adm.auction-listing.SC-vhc,g10adm.auction-listing.SC-lvn,g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
### g10adm-pdt.US1-TC1: A Cert-tagged source becomes an independent listing copy

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-inventory-catalog-US-12, grade10-admin-auction-listing-US-11, grade10-admin-auction-listing-US-14

**Pre-conditions:**

* admin(holds Inventory media-management authority and Auction listing-edit authority) is signed in at `<g10adm url>`.
* `<product>` has `<selected Cert ID>` and `<other Cert ID>`; `<source media>` is saved on it and untagged; `<other Cert media>` is tagged to `<other Cert ID>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<product>` | A product with saved source media and two Cert records |
| `<selected Cert ID>` | One Cert record on `<product>` |
| `<other Cert ID>` | Another Cert record on `<product>` |
| `<source media>` | One untagged saved source item on `<product>` |
| `<other Cert media>` | Saved source media tagged to `<other Cert ID>` |
| `<alt text>` | An alt text different from the one stored on `<source media>` |

**Steps:**

1. In Inventory, open `<product>`'s media and tag `<source media>` to `<selected Cert ID>`.
2. In Auction, start a draft listing for `<product>` and `<selected Cert ID>`.
3. Open the main source selector.
4. Add `<source media>` and save the listing gallery.
5. In Inventory, change `<source media>`'s alt text to `<alt text>`.
6. Reopen the listing gallery.

**Expected Results:**

* Step 3 offers `<source media>` and leaves out `<other Cert media>`.
* Step 4 saves a copy of `<source media>`'s bytes, with the alt text it had when it was added.
* Step 6 shows the copy's alt text unchanged by step 5.

---

## g10adm-pdt.US2: Operator removes a Cert after saving its media to a listing

**As an** Inventory operator,
**I want** to remove an available physical unit and its Cert record together,
**so that** its tagged source media is deleted while an Auction listing keeps its saved copy.

<!-- trace:case id=g10adm.grade10-admin-product.TC-8p3 rev=1 covers=g10adm.inventory-catalog.SC-gpb,g10adm.inventory-catalog.SC-k3v,g10adm.auction-listing.SC-xyf,g10adm.auction-listing.SC-01q,g10adm.auction-listing.SC-emr,g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
### g10adm-pdt.US2-TC1: Removing a physical unit deletes its tagged media but keeps the listing copy

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** smoke
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-inventory-catalog-US-13, grade10-admin-auction-listing-US-12, grade10-admin-auction-listing-US-14

**Pre-conditions:**

* admin(holds Inventory write authority and Auction listing-edit authority) is signed in at `<g10adm url>`.
* `<product>` has `<selected Cert ID>` and `<source Cert ID>`, both available with no active reservation.
* `<source Cert ID>` has moved since intake: it was reserved once and that reservation was released.
* `<source media>` is tagged to `<source Cert ID>`; `<shared media>` is saved on `<product>` and untagged.

**Test data:**

| Field | Value |
| --- | --- |
| `<product>` | A product with two available Cert records and saved media |
| `<selected Cert ID>` | An available Cert on `<product>` |
| `<source Cert ID>` | A different available Cert on `<product>` that has moved since intake |
| `<source media>` | Saved source media tagged to `<source Cert ID>` |
| `<shared media>` | Untagged saved media on `<product>` |
| `<withdrawal reason>` | Any non-empty reason |

**Steps:**

1. In Auction, start a draft listing for `<product>` and `<selected Cert ID>`.
2. Open the Other Cert media drawer and add `<source media>` by naming `<source Cert ID>`.
3. Save the listing gallery and note the saved copy's bytes and alt text.
4. In Inventory, open `<source Cert ID>` and select Remove physical unit.
5. Enter `<withdrawal reason>` and confirm.
6. Reopen the product's media, its Cert records and the saved listing gallery.

**Expected Results:**

* The record for `<source Cert ID>` is gone, and so is `<source media>`.
* `<shared media>` remains, still untagged.
* Stock is one lower, withdrawn is one higher, and the ledger is unchanged.
* The withdrawal's history entry records `<withdrawal reason>`.
* The saved gallery still holds the bytes and alt text noted at step 3.

## Settled

- Physical-unit removal requires an available Cert record without an active reservation; its tagged source media is deleted while the Auction snapshot remains independent.
- Removing a media tag or retagging leaves the original source item untagged and available as product-level media.
- Removing a physical Cert unit deletes that Cert record and its currently tagged source media; it does not rewrite a saved Auction listing snapshot.
- No Cert ID stock is regular inventory without a Cert record; it can use untagged product media but is not a Cert media tag target.
