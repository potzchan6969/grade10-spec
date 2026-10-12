## Feature set

- Draft save
  - Incomplete listing: an authorized operator saves without filling every field
  - First save mints a unit: the first draft creates an auctionable unit with no other live listing
- Create and catalogue
  - Required fields at create: title, slug, starting price, window, and media are checked on the form and the API
  - Slug as public key: collectors open a listing by slug; collisions and reuse follow the listing's state
  - Catalogue fields: an operator may write copy and taxonomy before publish
  - Listing code: Grade10 allocates a stable, opaque 5-character code for a
    listing on its first saved draft, and shows that code on the listing's admin
    screen for operators to match against a quoted support, finance or
    reconciliation reference
  - Generated slug: a saved draft starts with a distinct title-and-code address
    that an operator can replace
- Prices and window
  - Writable before publish: starting price, close, extension duration, and cap can change until the listing is live
  - Starting price of 0: a draft and create accept 0 in USD, HKD and JPY; a negative, non-whole or empty price is refused, and empty is never stored as 0
- Publish
  - Now or scheduled: a created listing publishes immediately or at a set time
- Call off
  - Before close: an operator withdraws a listing that has not closed
  - Reusable address: call off releases the original slug for another listing
  - Closed is frozen: a closed listing cannot be rewritten here
- Gallery
  - One to eight uploads: images or videos, stored as uploaded, ordered, first item as the catalogue card
  - Combined sources: selected product assets and listing-only uploads form one ordered gallery
  - Saved snapshot: a selected product asset becomes listing media on Save, unaffected by later product-media edits, reordering, or deletion
- Independent create
  - Listings create: an authorized operator starts a listing from the
    Listings section with no campaign selected
  - Empty campaign through lifecycle: draft, create, and publish all succeed
    with no campaign; public slug lookup returns the listing
  - Listings table unattached label: a row with no campaign shows "-"
- Test fixture standalone seed
  - Listings tab: a developer selects fixture ids and seeds them with no
    campaign, product reserved, media attached
  - Drop standalone fixtures: a developer removes standalone fixture listings
    and releases their inventory holds from the same tab
- Inventory unit
  - Explicit choice: product selection is paired with a Cert ID or `No Cert ID`
  - Unit hold: a selected Cert ID is held as one physical unit
- Listing lifecycle
  - Draft save: validates and preserves the selected unit
  - Create: requires the saved unit choice and matching inventory hold
- Product display
  - Selected identity: public fields resolve through Inventory
  - Unnumbered stock: `No Cert ID` displays no certificate row
- Listings Stats
  - Watchers in Stats: opening Stats shows how many collectors watch the lot, so an operator judges interest beside the bidder count
  - No table column: the Listings table does not show the watch count
- Unsold close
  - Stock released: a listing that closes with no winner releases its inventory hold at the close, with no operator step
  - Released note: an Unsold listing says its stock was released, and when
  - Relist: an Unsold listing's row in the Listings table opens a new draft with the same product, quantity and catalogue copy, once its stock is released, outside a campaign and once per listing
  - Earlier holds freed: holds left by earlier Unsold closes are released once
- Unit-aware source selection
  - For a selected Cert record, the main selector offers the product's untagged source media and media tagged to that record. Every Cert record has a Cert ID.
  - Other media tagged to a printed-Cert record stays outside the main selector; the separately labelled drawer contains only that media, grouped and named by the printed Cert ID, which an explicit Add to listing action names.
  - For `No Cert ID`, the main selector offers only untagged product media.
- Listing-owned gallery snapshot
  - Adding a source item copies its bytes and current alt text into the listing gallery.
  - Listing alt text and order remain editable; later source changes do not change the listing copy.
  - Direct listing uploads and the existing one-to-eight gallery rules remain available.

