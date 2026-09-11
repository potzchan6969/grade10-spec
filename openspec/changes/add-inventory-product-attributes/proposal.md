**Author:** @htonyl - 2026-09-10

## Why

Collectors and operators need different facts to identify different products,
but the inventory catalogue cannot currently validate those facts or control
which ones Auction shows. A product can carry the universal IP, Item, and
Category classification, yet a Pokémon TCG card and a One Piece card have no
structured place for their card number, language, set, or grading requirements.

**Metric:** share of Auction-eligible products whose active product schema
validation passes, with a reduction in listing corrections caused by missing or
invalid product facts.

## What Changes

- **Universal classification** — keeps IP, Item, and Category required on every
  product and available to search and filter.
- **Product schemas** — lets an inventory admin configure one exact IP + Item +
  Category schema with reusable attribute keys, displayed labels, data types,
  requiredness, allowed values, validation rules, and translations for
  English, Traditional Chinese, and Simplified Chinese, with room for future
  locales.
- **Structured product facts** — validates field values when products are
  created or edited; drafts may be incomplete, while products entering the
  `created` state must have a matching product schema and valid required values.
- **Auction listing attributes** — supports listing-specific values such as
  vaulted status, PSA certification number, or shipping origin. They belong to
  an Auction listing, not its product. Auction stores an unvalidated ordered
  display document with any supplied labels and localized values; they are
  displayed but not searchable or filterable.
- **Auction presentation** — lets an admin choose and order the fields shown
  for each IP + Item + Category product schema, independently from the attributes stored and
  searchable. A field keeps its own human-readable displayed label and
  localized displayed values, separate from its stable key; English is
  required and other supported locale translations are optional with English
  fallback.
- **Auction display compatibility** — Auction reads selected product fields
  through an Inventory display contract. Product-schema publication keeps that
  contract valid, so Inventory changes can update an Auction display without
  breaking it.
- **Configuration publishing** — validates a draft configuration against
  existing products before publishing it; a failed validation leaves the
  current published configuration active.
- **Compatibility review** — returns the incompatible product attributes after
  an admin saves an attribute-key update or product-schema draft, so the admin
  can correct each product before publishing.

### Examples

| Field | Product A — Pokémon single card | Product B — One Piece single card | Notes |
| --- | --- | --- | --- |
| IP | `Pokémon` | `One Piece` | Different IPs select separate product schemas |
| Item | `Single card` | `Single card` | Same Item |
| Category | `TCG` | `TCG` | Same Category |
| Card number (required) | `SV04 123/190` (displayed) | `OP01-001` (displayed) | Displayed for both products |
| Character (required) | — | `Monkey D. Luffy` (displayed) | One Piece-specific field; another valid value is `Chopper` |
| Language (required) | `English` (displayed) | `Japanese` (hidden) | Required for validation; display is configured per product schema |
| Card set (required) | `Paradox Rift` (hidden) | `Romance Dawn` (hidden) | Required for validation, but omitted from both listings |
| Grading (required) | `PSA 10` (hidden) | `BGS 10` (displayed) | Stored and searchable for both; One Piece always shows grading |
| Rarity (required) | — | `Super Rare` (hidden) | One Piece-specific field |
| PSA population (optional) | `123` (hidden) | — | Optional fields can be IP-specific |
| PSA cert number (listing attribute) | `0001234567` (displayed) | `0007654321` (displayed) | An Auction listing value; another listing of Product A can use a different cert number |

## Non-Goals

- Supporting an app other than Auction in this change
- Changing the existing IP, Item, and Category taxonomy or adding a second
  universal classification model
- Automatically inferring card facts from images, provider pages, or external
  data
- Defining PSA population data, certificate verification, or grading-provider
  integrations
- Adding historical versions of product field values or configuration
- Replacing the inventory stock ledger, reservation model, or Auction listing
  lifecycle

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-admin/inventory/catalog`: adds CMS-managed IP + Item + Category
  product schemas, validated product attributes and their reusable attribute
  keys, listing attributes,
  search and filter behavior, and per-product-schema Auction presentation.

## Impact

- Extends the inventory admin product and configuration surfaces
- Extends inventory product data and validation contracts
- Extends the Auction product read, display, and filter surfaces
- Requires the universal IP, Item, and Category classification supplied by the
  inventory card taxonomy capability

## Follow-on changes

- Store-specific field presentation can be configured when the Store becomes a
  supported consuming app.
