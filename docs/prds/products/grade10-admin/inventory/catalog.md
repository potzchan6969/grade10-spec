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

- **Collectible Cards** — the controlled product type for card stock
- **Required classification** — one reusable IP, Item, and Category tag
- **PriceCharting identity** — a confirmed provider match with its canonical
  link and stable provider id

## Product schemas

- **Exact tuple** — one IP, one Item, and one Category select the product
  schema; one published schema is active for each tuple
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
- **Bulk import** — upload a bounded CSV, review each taxonomy and provider
  match, confirm every row, and commit the batch as one operation
- **Inventory ledger** — track stock, holds, sales, withdrawals, and vaulting
  without losing the arithmetic
