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
- Changing how Inventory reserves, sells, withdraws, or vaults a unit.
- Changing direct listing uploads, listing-gallery file limits, or gallery
  ordering.
- Creating a permission, shared component export, or design-system primitive.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What identifies a Cert tag? | The immutable Inventory Cert record id. The printed Cert ID stays display data because it can be absent. | The printed Cert ID string, which can be null and is not the record identity. |
| Q2 | Can one source item belong to more than one Cert? | No. A tag is optional and names exactly one same-product Cert record with a printed Cert ID. Untagged means product-level shared media. | Multi-Cert tags, a product-independent tag, or a tag to a Cert record with no printed Cert ID, which blur which physical copy the item documents. |
| Q3 | Can an operator correct a tag? | Yes. An authorized Inventory operator can tag, untag, or retag saved media to another Cert record of the same product. | Making tags permanent, which leaves correction as delete and re-upload. |
| Q4 | What happens when the Cert record is deleted? | The tag is deleted with the Cert record. The uploaded source media remains as untagged product-level media. | Refusing deletion until media is retagged, or deleting the uploaded media, which makes Cert lifecycle depend on a reusable source asset. |
| Q5 | Which source media starts in the main selector for a specific Cert listing? | Product-level untagged media plus media tagged to the selected Cert record when it has a printed Cert ID. A record without one brings forward untagged product media only. | Every source item for the product, which makes another unit's media look equally applicable. |
| Q6 | How does an operator reach another Cert's media? | A separately labelled Other Cert media drawer groups only printed-Cert items by their printed Cert ID. Selecting Add to listing is explicit and names that ID. | Showing it beside normal source media, making it inspection-only, or showing a fallback group for a record with no printed Cert ID. |
| Q7 | What does No Cert ID bring forward? | Product-level untagged media only. No Cert-tagged media is brought forward by default. | Bringing forward every Cert's media, which treats an unnumbered unit as interchangeable with a numbered copy. |
| Q8 | Does selecting source media link the listing to it? | No. Grade10 copies the source bytes and current alt text into the listing gallery. Listing alt text and order stay editable; later source changes do not alter that snapshot. | A live source-media reference, which can rewrite a listing after it is created. |
| Q9 | Does this need a new grant? | No. Existing Inventory media-management authority controls source tags; existing Auction listing-edit authority controls source selection, including the other-Cert drawer. | A new cross-Cert selection permission, which adds a grant for an action already protected by listing edit authority. |
| Q10 | What happens to media for a Cert record without a printed Cert ID? | It stays untagged product-level media, shared across every Cert record of that product. The Other Cert drawer contains no such media. | A fallback drawer label or a Cert-scoped tag with a missing printed ID, which makes an explicit source identity ambiguous. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-admin/auction/listing | How does the Other Cert media drawer identify a source Cert record whose printed Cert ID is absent, so the group and explicit Add to listing action still identify the source? | Q10 |
