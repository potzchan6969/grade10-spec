# grade10-admin/auction/listing Specification

## Purpose
Lets an authorized Auction operator choose source media for the physical unit
selected for a listing, make cross-Cert additions deliberately, and edit a
listing-owned gallery snapshot.

## Feature set

- Unit-aware source selection
  - For a selected Cert record, the main selector offers the product's untagged source media and media tagged to that record.
  - Other Cert-tagged media stays outside the main selector; the separately labelled drawer groups it by Cert ID and names the source Cert when an item is added.
  - For `No Cert ID`, the main selector offers only untagged product media.
- Listing-owned gallery snapshot
  - Adding a source item copies its bytes and current alt text into the listing gallery.
  - Listing alt text and order remain editable; later source changes do not change the listing copy.
  - Direct listing uploads and the existing one-to-eight gallery rules remain available.
