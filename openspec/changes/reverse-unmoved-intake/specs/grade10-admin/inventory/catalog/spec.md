# grade10-admin/inventory/catalog Specification

## Feature set

- Product stock
  - Product record: descriptive identity; lifecycle `draft` | `created`
  - One inventory snapshot per product: stored stock, reserved, vaulted, sold,
    withdrawn; derived available and ledger
  - Intake: stock up the product's inventory
  - Terminal transitions: move available stock to sold or withdrawn; move
    reservation remaining to sold (Auction) or vaulted (Vault)
- Application holds
  - Reservation classified by `holder_kind` (`grade10-auction` | `grade10-vault` |
    `admin`)
  - Remaining quantity and adjustable hold size
  - Partial sell / vault / release against remaining
  - Re-reserve after close with the same kind + reference (holder apps;
    `admin` mints a new reference on each reserve)
  - Conservation: active remaining cannot exceed available
  - Scoped access: expose availability and only the calling kind's holds
- Change history
  - Mutation trace: typed actors, actions, quantities, before/after snapshots
  - Every inventory or reservation quantity change appends one changelog
- Admin console
  - Products list and product page
  - Create/edit products (`draft` → `created`); intake and admin reserve;
    release admin holds from the product page; read-only oversight of Auction
    and Vault holds by `holder_kind`; history
- Product identity
  - Hierarchy: IP, Category, and Item are the complete product identity
  - Universal classification: IP, Item, and Category are required before a product becomes created
  - Product facts: typed attributes replace free-form product metadata
- Product schemas
  - Card template: shared typed facts are assigned to exact tag tuples
  - Exact tuple: one IP, one Item, and one Category select the product schema
  - Reusable attribute keys: stable keys, types, validation rules, localized labels, and select options
  - Schema manifest: validated definitions create draft revisions
  - Draft and publish: publishing validates affected products before a configuration becomes active
  - Compatibility review: admins can find and correct incompatible product attributes before publishing
- Physical units
  - Copy facts: Cert ID, grading, autograph grade, and serial belong to a unit
  - Intake: records identifiers atomically with received stock
- Bulk entry
  - Product upload: product names and schema values enter without stock
  - Inventory upload: physical copies enter against existing products
- Auction presentation
  - Displayed fields: admins control attribute and Cert ID visibility and order
  - Search and filter: universal tags and configured product attributes remain searchable by stable identity
  - Listing attributes: ordered, localized display items belong to one Auction listing and are not searchable
  - Live values: Auction reads the selected unit through Inventory
- Product assets
  - Reusable gallery: inventory admins prepare ordered images and video on a catalogue product for Auction listings
  - Auction eligibility: product assets follow the Auction listing media policy, so an operator can select them into a listing
- Unsold auction stock
  - Released hold: the hold of a listing that closed with no winner reads closed and released on the product page, and available rises by its units
  - Named in history: the release's remarks say an Unsold listing released it, at the close or in the clean-up of an earlier one
  - Holder and remarks: every history entry shows when, with date and time, its holder by listing code and title, and its remarks
- Cert ID details
  - Every unit listed: each Cert record, plus a `No Cert ID` row for available regular stock and one for each active hold on regular stock
  - Correct a Cert ID: an available Cert record takes another Cert ID unused on its product
  - Assign a Cert ID: one available unit of regular stock becomes a Cert record with its Cert ID alone
  - Cert ID history: each change is one history entry naming the Cert ID before and after
  - Reverse a mistaken intake: regular stock never held, sold, withdrawn or vaulted can be reduced by up to its available count, and a Cert record that has only been intaken can be removed with its tagged media; stock and the ledger fall, withdrawn does not
  - Confirm first: each reversal opens a confirmation naming what leaves, with remarks prefilled `Entered by mistake`, editable and never empty; cancelling changes nothing
  - Reversal history: each reversal is one history entry under its own action, apart from intake and withdraw
- Cert-scoped source media
  - A saved source item may be untagged and shared by the product, or tagged to one Cert record owned by that product. Every Cert record has one Cert ID.
  - The tag identifies the immutable Cert record; its Cert ID is display data.
  - An authorized Inventory operator may tag or untag saved source media. Retagging clears the original association and leaves the source item untagged and shared; assigning it to another Cert requires a separate explicit tag action.
  - Inventory without a Cert ID is regular product stock, not a Cert record or a media-tag target; its media remains product-level shared media.
  - Removing a Cert unit that has moved requires physical withdrawal; the operation removes its Cert record and currently tagged source-media rows while preserving unrelated product media. A Cert record that has only been intaken is reversed instead, and offers no physical withdrawal.
