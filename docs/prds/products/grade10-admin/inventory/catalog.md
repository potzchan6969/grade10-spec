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

::journeys{id="grade10-admin/inventory/card-price-reference"}
::cases{id="grade10-admin/inventory/card-price-reference"}
