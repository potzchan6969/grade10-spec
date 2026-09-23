# Design: Inventory product assets in Auction listings

- **Ownership** — Inventory owns reusable product assets; Auction owns
  collector-facing listing media.
- **Snapshot** — an Auction Save copies selected Inventory assets into ordinary
  listing media, so a listing never follows later source-product changes.

## Inventory Admin Media Manager

- **Entry point** — the Inventory product editor adds a **Media** action beside
  its existing fields. The product page owns the one product-scoped dialog's
  open state and unmounts it when closed.
- **Gallery** — the editable product shows up to 8 saved assets and an **Add
  media** control.
- **Preview** — choosing an image or video shows its local preview and file
  name before any upload.
- **Confirm or discard** — **Confirm** uploads the file and replaces the
  chosen position or appends it to the first empty position. **Discard**
  removes the local preview without a write.
- **Saved-item actions** — a saved item offers replace, remove, optional alt
  text, and drag reorder. Reorder remains local until **Done** sends the
  complete ordered set.
- **Refusals** — the dialog states the 8-item limit and shows a recoverable
  inline refusal for unsupported, empty, oversized, ninth, or failed uploads.
  A refusal leaves the saved gallery and local order unchanged.
- **Shared policy** — accepted files, the 100 MiB maximum, dimensions, alt
  treatment, and ordered-gallery behavior reuse Auction's media policy.
- **Separate client** — Inventory owns this dialog and its client. It calls no
  Auction route and exposes no media to the storefront.

## Inventory Source Storage

- **Rows** — Inventory adds `product_media`, one source row per product-gallery
  position. It stores a stable asset id, product id, position,
  content-addressed object key, content type, optional alt, optional image
  dimensions, and audit timestamps.
- **Constraints** — unique `(product_id, position)` preserves one gallery
  order; an object-key index supports reclamation.
- **Bucket** — `INVENTORY_PRODUCT_ASSETS` is a dedicated, private R2 binding.
- **Shared mechanics** — Inventory uses Auction's content-addressed key
  derivation and image measurement patterns.
- **Separate boundary** — Inventory owns its bucket binding, object-store
  area, access policy, public-route decision, and orphan sweep.
- **Write and preview** — bytes are written before the row; an interrupted
  write becomes an orphan for Inventory's sweep. Inventory serves only
  authenticated admin previews through its own byte route, never a public
  original or resized-media route.

## Auction Listing Storage

- **Existing owner** — Auction keeps `auction_listing_media` and
  `AUCTION_LISTING_ASSETS` unchanged.
- **Collector delivery** — those rows remain the complete ordered gallery for
  listing pages, catalogue cards, emails, cache invalidation, named image
  sizes, and Auction's orphan sweep. Direct uploads continue unchanged.
- **Trusted read** — at Save, Auction asks Inventory for selected ids from the
  listing's chosen product through a typed Worker binding. Inventory refuses
  absent, foreign, or duplicate ids and returns current bytes and immutable
  metadata for valid assets.
- **Materialization** — Auction writes returned bytes to
  `AUCTION_LISTING_ASSETS` and inserts ordinary `auction_listing_media` rows
  in the requested mixed order with direct uploads. It stores no Inventory
  asset id or foreign key.
- **Difference** — the services share media rules and content-addressing, but
  never a bucket or a public URL. The same byte may have the same hash-derived
  key in both services, but crosses the boundary as a copy.
- **Result** — source replacement, deletion, reorder, or later access changes
  cannot alter a saved listing. A source that disappears before Save is refused
  and Auction preserves the existing listing gallery.

## Auction Admin Selection

- **Picker** — the existing Auction Media dialog keeps direct upload and adds a
  product-assets picker only after the listing has a selected product.
- **Candidates** — it shows only that product's Inventory assets, never assets
  from another product.
- **Mixed gallery** — chosen candidates and direct uploads share one local
  ordered gallery, one 8-item cap, and one drag-reorder interaction.
- **Save and product change** — Save sends the complete mixed order; changing
  the listing product clears only unsaved product-asset choices.

## Decisions

- **Authorization** — Inventory media management uses the existing inventory-admin access; Auction selection uses the existing listing-edit access. No new permission vocabulary is introduced.
- **Snapshot timing** — product assets become Auction media only on a successful listing Save.
- **Scope** — no Cert-ID media, backfill, source-asset public URLs, or storefront product-media display.
