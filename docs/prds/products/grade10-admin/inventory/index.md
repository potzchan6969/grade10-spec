---
title: Inventory
icon: package
---

Inventory is the house ledger for physical stock more than one application
consumes. One snapshot per catalogue product answers how much Grade10 holds
and where every unit stands — available, reserved, vaulted, sold, withdrawn —
and every hold names its consumer explicitly: a reservation carries a
`holder_kind` of `grade10-auction` or `grade10-vault`, never an inference
from ids. Each application reads availability and its own holds, and no other
application's.

Settling is not one shape, so partial moves are first-class: part of a hold
sells, part releases, the remainder stays held. The auction settles a hold by
selling; the vault settles one by taking custody, not by a sale. Every
quantity change appends one changelog entry — who, what, and the counts
before and after — so the arithmetic is never lost.

This is an operator product: everything here happens in the admin console,
and the number that matters is whether stock reconciles — available plus
every hold, grouped by who holds it, equal to what the house actually has.

## Product Assets

| Rule | Value |
| --- | --- |
| Files | JPEG, PNG, WebP, AVIF, MP4, WebM or QuickTime |
| File size | At most **100 MiB** each |
| Gallery | **0 to 8** images or videos, in the inventory admin's order |

- **Reusable product media** — an inventory admin keeps photographs and
  video on the catalogue product, not on an individual Cert ID. The gallery
  can be added to, replaced, reordered, or cleared while the product record
  remains editable. It prepares material for Auction; it does not appear on a
  storefront product page.
- **Stable auction selection** — when an auction operator selects a product
  asset for a listing and saves, that listing keeps its own copy of the
  selected media. Changing, reordering, or removing the product gallery later
  does not change the listing.

:::detail{title="Product decisions" for="pm"}
Reusable media belongs on the catalogue product so Auction listings of that
product can start from material already checked once. Listing galleries keep
their own copy at Save; later product-gallery edits do not rewrite a lot.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Media owner | Decided | Catalogue product, not a Cert ID or physical unit. Cert-tagged source media is a later change. | Product |
| Media policy | Decided | Same accepted types, 100 MiB maximum, and gallery bounds as Auction listing media. | Product |
| Storefront product media | Decided | Out of scope; product assets prepare Auction material only. | Product |
| Backfill | Decided | Existing products and listings stay unchanged until an operator adds assets. | Product |
:::
