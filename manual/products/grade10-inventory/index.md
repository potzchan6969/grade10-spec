---
title: Inventory
summary: The house-owned stock ledger behind Auction, Vault and whatever sells physical stock next.
---

Grade10 holds physical stock that more than one application wants to consume,
and today no ledger says who may. A listing and a sale sit on Auction alone;
Vault settles by taking custody, not by selling; nothing central records how
much of a product is available, reserved, vaulted, sold or withdrawn — so two
applications can believe they may consume the same stock, and operations
cannot reconcile any of it.

Inventory is that ledger. Products with stock rows, intake, and holds that
name their consumer explicitly — a reservation carries a `holder_kind` of
`grade10-auction` or `grade10-vault` rather than inferring it from ids — with
partial sell, partial vault, partial release and quantity adjust all
first-class, because settling is not one shape.

This is an operator product: everything here happens in the admin console, and
the number that matters is whether stock reconciles — available plus every
hold, grouped by who holds it, equal to what the house actually has.
