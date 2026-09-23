# grade10-admin/inventory/catalog Specification

## Purpose
Lets an authorized Inventory operator keep source media shared at product
level or associate it with one physical Cert record.

## Feature set

- Cert-scoped source media
  - A saved source item may be untagged and shared by the product, or tagged to one Cert record owned by that product.
  - The tag identifies the immutable Cert record; its printed Cert ID is display data and may be absent.
  - An authorized Inventory operator may tag, untag, and retag saved source media.
  - Removing a Cert record clears its source-media tags and preserves the uploaded media as untagged product media.
