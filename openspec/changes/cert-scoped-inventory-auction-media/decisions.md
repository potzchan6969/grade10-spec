## Goals

- Let an Inventory operator identify source media that belongs to one physical
  Cert record without losing product-level shared media.
- Start a specific-Cert listing with the source media that normally belongs to
  the selected unit.
- Make use of another Cert's media deliberate and visible to the operator.
- Preserve a listing gallery as the historical snapshot the operator edits.

## Non-Goals

- Showing Cert-scoped Inventory media on storefront product pages.
- Tagging one source item to more than one Cert, or bulk tagging media.
- Changing how Inventory reserves, sells, or vaults a unit. Guarded Cert-unit
  removal uses the existing withdrawn category.
- Changing direct listing uploads, listing-gallery file limits, or gallery
  ordering.
- Creating a permission, shared component export, or design-system primitive.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What identifies a Cert tag? | The immutable Inventory Cert record id. Every Cert record has one required printed Cert ID; the printed value is display data, while the record id remains the tag identity. | The printed Cert ID string as the stored tag identity. |
| Q2 | Can one source item belong to more than one Cert? | No. A tag is optional and names exactly one same-product Cert record, and every Cert record has a printed Cert ID. Untagged media is product-level shared media. | Multi-Cert tags or a product-independent tag. |
| Q3 | Can an operator correct a tag? | Yes. An authorized Inventory operator can tag or untag saved media. Retagging clears the original association and leaves that source item untagged and shared; assigning it to another Cert requires a separate explicit tag action. | Making tags permanent or transferring an existing source item automatically to another Cert. |
| Q4 | When may a Cert unit be removed, and what happens to its media? | Only an available unit with no active reservation may be removed, and removal requires withdrawal of the physical unit. Decrease stock and increase withdrawn by one, remove its Cert record, and delete source media tagged to it. Other product media and already-saved Auction snapshots stay unchanged. | Detaching an identifier while leaving the unit on hand, removing media for other units, or rewriting an existing listing snapshot. |
| Q5 | Which source media starts in the main selector for a specific Cert listing? | Product-level untagged media plus media tagged to the selected Cert record. A No Cert ID listing is regular inventory without a Cert record and brings forward untagged product media only. | Every source item for the product, which makes another unit's media look equally applicable. |
| Q6 | How does an operator reach another Cert's media? | A separately labelled Other Cert media drawer groups media tagged to other Cert records by their required printed Cert ID. Selecting Add to listing is explicit and names that ID. | Showing it beside normal source media or making it inspection-only. |
| Q7 | What does No Cert ID bring forward? | Product-level untagged media only. No Cert-tagged media is brought forward by default. | Bringing forward every Cert's media, which treats an unnumbered unit as interchangeable with a numbered copy. |
| Q8 | Does selecting source media link the listing to it? | No. Grade10 copies the source bytes and current alt text into the listing gallery. Listing alt text and order stay editable; later source changes do not alter that snapshot. | A live source-media reference, which can rewrite a listing after it is created. |
| Q9 | Does this need a new grant? | No. Existing Inventory media-management authority controls source tags; existing Auction listing-edit authority controls source selection, including the other-Cert drawer. | A new cross-Cert selection permission, which adds a grant for an action already protected by listing edit authority. |
| Q10 | What is an inventory item without a Cert ID? | It is regular product stock, not a Cert record. Its source media stays untagged at product level and cannot be tagged to that item. Only a Cert intake with one Cert ID creates a Cert record. | A Cert record without an ID, or a per-item media tag for regular stock. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-admin/auction/listing | How does the Other Cert media drawer identify a source Cert record whose printed Cert ID is absent, so the group and explicit Add to listing action still identify the source? | Q10 |
