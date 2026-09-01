---
title: Products and stock
summary: A draft product with stock rows, intake, and holds that say who holds them and how much remains.
spec: grade10-inventory/catalog
order: 1
---

An admin creates a draft product with one inventory row, marks it created, and
intakes quantities as stock physically arrives. From there the ledger answers
the operational questions: every hold is listed with its kind, remarks,
reference and remaining quantity; a hold's quantity can be adjusted; remaining
stock moves between states without losing the arithmetic.

The consumers are explicit. Auction settles a hold by selling; Vault settles
one by vaulting — custody, not a sale — and the ledger records which because
the hold says so itself, never because something guessed from an id. Partial
settlement is the normal case, not the exception: part of a hold sells, part
releases, and the remainder stays held.
