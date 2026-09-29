## Goals

- Let an inventory admin prepare reusable product photographs and video once,
  for Auction listings of that product.
- Let an auction operator build one ordered gallery from product assets and
  listing-only uploads.
- Keep each listing's gallery stable after it has used a product asset.

## Non-Goals

- Cert-ID-specific or other copy-level media.
- Storefront product-media display, product-media APIs for collector surfaces,
  or changes to the site product experience.
- A live link from a listing gallery to its product gallery, including
  propagation of later product-media edits, reorders, or deletion.
- New file formats, size limits, media processing, thumbnails, or gallery
  cardinality rules beyond the existing Auction listing-media contract.
- Automatic migration or backfill of existing listings or product records.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Does reusable media belong to a catalogue product or a Cert ID / physical inventory unit? | Product-level catalogue media - decided by the round | Cert-specific media, which would make shared product presentation depend on an individual copy and widen this change into copy-level asset management |
| Q2 | Can a listing use only product assets, or can it combine them with listing-only uploads? | One combined gallery may contain selected product assets and direct Auction uploads - decided by the round | Product-only selection, which would prevent an operator adding lot-specific evidence or video |
| Q3 | Who controls the order when the gallery has both sources? | The auction operator freely orders every selected and directly uploaded item in one listing gallery - decided by the round | Product-gallery order as a fixed prefix, which would stop the operator choosing the listing card and collector reading order |
| Q4 | Do product assets define a new media policy? | Product assets reuse Auction listing-media's accepted types, 100 MiB maximum file size, and gallery bounds - decided by the round | A separate Inventory policy, which would let an apparently reusable asset fail when an operator selects it for Auction |
| Q5 | What survives after an operator selects a product asset for a listing? | The listing receives an owned snapshot at Save; content-addressed stored bytes may be reused, but later product-asset edit, reorder, or deletion cannot affect the listing - decided by the round | A live product-asset reference, which would rewrite a collector-facing lot after its listing was prepared or published |
| Q6 | Does this introduce product media on collector storefront surfaces? | No storefront product-media use is in scope - decided by the round | Extending the asset catalogue into site product pages, which requires separate collector-facing presentation and ownership decisions |
| Q7 | Does this rewrite existing product records or listings? | Existing records are unchanged; reusable assets apply when an operator adds them to a product and selects them into a listing - decided by the round | Backfilling or inferring media, which could attach unreviewed files to existing collector-facing lots |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
