---
title: Listing Management
spec: grade10-auction/admin-listing
audience: operator
order: 11
---

Every lot starts as an operator's draft. The first save mints the auctionable
unit behind it and lets the operator walk away — nothing is required yet, so a
listing can be half-written for a week. When they come back they add the
catalogue copy and taxonomy, attach the gallery, and set a starting price and a
window.

Creating the listing is the moment the rules bite: a title, a slug, a starting
price, a window and at least one media item are all checked on the form and
again at the API, so a script cannot slip past what the form refuses. After
that the listing is ready to sell but not yet visible; publishing is a separate
move, either immediately or at a future time the operator sets.

The slug is the key a collector opens the lot by, which is why its rules read
oddly at first: two live listings can never share one, but a called-off
listing gives its slug back, while a closed one keeps it forever.

An operator can withdraw a listing at any point before it closes — draft,
created, or published with live bids on it. Once a lot has closed, this is no
longer the place to change it; the sale is settled and fulfilled elsewhere.

## What an operator does

::journeys{id="grade10-auction/admin-listing"}

:::detail{title="Grants and the trail" for="operator"}
Catalogue work — drafting, editing, publishing, calling off — sits behind
`auction:catalog` and `auction:operate`, which `staff` hold. `auction:reserve`
is the only grant that exposes a seller's secret floor and `auction:settle` is
the only one that moves money; neither is needed to run the catalogue. Every
elevated move appends to a hash-chained trail and refuses to run at all if that
record cannot be written.
:::
