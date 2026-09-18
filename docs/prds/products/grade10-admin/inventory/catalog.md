---
title: Products and Stock
spec: grade10-admin/inventory/catalog
order: 1
---

An admin creates and classifies products, then records the stock physically
received. The catalogue keeps card identity, operational inventory, and a
traceable current market reference together without turning the reference into
product history.

## Product identity

- **Product hierarchy** — IP, Category, and Item are the complete product identity
- **Product entry identity** — product names may repeat; import resolution
  uses the name, exact taxonomy tuple, and typed product values
- **Required classification** — one reusable IP, Item, and Category tag
- **PriceCharting identity** — a confirmed provider match with its canonical
  link and stable provider id

## Product schemas

- **Exact tuple** — one IP, one Item, and one Category select the product
  schema; one published schema is active for each tuple
- **Workbook card template** — one shared collectible-card template covers
  the workbook's categories. Year, Set, and Subject describe the product, with
  numeric Year and all three required; Card Number and Variety are optional.
  Serial, certificate, and grading facts describe an individual copy.
- **Schema import** — admins can load attribute definitions into a draft,
  review validation results, then publish the schema through the existing
  draft-and-publish lifecycle
- ❓ **Workbook taxonomy mapping** — each distinct source product family needs
  an explicit mapping to the exact Grade10 IP, Item, and Category tags. A broad
  workbook Category such as TCG Cards must not collapse Pokémon, Lorcana, and
  One Piece into the same taxonomy tuple. The workbook's Item column is the
  product display name, not the Grade10 Item tag.
- **Reusable attribute key** — a stable key, a type, validation rules, and
  displayed labels and option values for English, Traditional Chinese, and
  Simplified Chinese
- **Draft and publish** — an admin edits a draft; publishing checks every
  matching product before the new configuration becomes active
- **Translation warning** — missing non-English copy is reported and uses the
  English value when displayed; it does not block publishing

## Product attributes

- **Universal classification** — IP, Item, and Category remain required for a
  product to become created
- **Typed value** — text, number, boolean, single-select, or multi-select;
  supplied values satisfy the assigned attribute's rules
- **Required value** — every required attribute has a valid value before a
  draft product becomes created; an optional value may remain absent
- **Product status** — a product without a matching published schema remains a
  draft and cannot enter Auction or reserve stock

## Auction presentation

- **Product fields** — an admin selects and orders the fields Auction shows for
  each product schema; selected values remain live and searchable by their
  stable identity
- **Cert ID field** — Cert ID is always available to choose as a displayed
  field, but an admin decides whether it appears and where it sits
- **Listing attribute** — an ordered display item belongs to one Auction
  listing, may carry localized labels and values, and is not searchable or
  filterable
- **Locale fallback** — a missing requested translation uses English, then
  the supplied value for a listing attribute

## Current reference

- **PSA-oriented prices** — the supplied ungraded baseline and numeric grades
- **Freshness** — source, successful update time, and fresh, stale, or
  unavailable state
- **Retention** — the replaceable current cache only; no history chart,
  population report, certificate facts, or other grading data

## Intake

- **Single product** — create or edit the card identity before stock arrives
- **Cert ID per graded copy** — intake requires the certificate identifier
  for each graded copy; RAW copies have no Cert ID
- **Copy-level facts** — each inventory copy carries its Cert ID, issuer,
  grade, autograph grade, and serial; grade remains source text. Graded copies
  require a Cert ID, while RAW copies have none.
- **Explicit reservation unit** — every reservation selects one Cert ID or
  explicitly selects `No Cert ID`; a numbered reservation is one unit
- **Product bulk import** — upload product names and typed schema attributes
  separately from physical inventory, then review taxonomy mappings and row
  validation before committing. Trim surrounding whitespace from mapped text
  values and treat blank or standalone `-` cells as absent.
- **Inventory bulk import** — upload individual copies against existing
  products, review Cert IDs and copy-level facts, and explicitly include or
  exclude each row whose Item Status is blank before committing. Trim
  surrounding whitespace from mapped copy facts and treat blank or standalone
  `-` cells as absent.
- **Provider product import** — upload a bounded CSV, review taxonomy and
  provider matches, confirm each row, and commit the batch as one operation
- **Inventory ledger** — track stock, holds, sales, withdrawals, and vaulting
  without losing the arithmetic
