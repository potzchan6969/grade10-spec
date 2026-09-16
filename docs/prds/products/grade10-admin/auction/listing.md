---
title: Listing Management
spec: grade10-admin/auction/listing
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

A campaign is a cover a lot may sit under, never a thing it needs. An operator
starts a listing from the Listings section itself and leaves the Campaign
field empty; draft, create, publish and the collector's slug all work with no
campaign attached, and the Listings table shows "-" for such a row.
Campaigns remain the way to sell a set together — a make-good, a rehearsal, or
a single lot arriving on its own asks for no cover to be invented for it.

An operator can withdraw a listing at any point before it closes — draft,
created, or published with live bids on it. Once a lot has closed, this is no
longer the place to change it; the sale is settled and fulfilled elsewhere.

The listing form offers USD, HKD, and JPY. The bid floor follows the selected
currency's [price-tier schedule](/p/grade10-site/auction/bid-increments); there
is no minimum-increment field for an operator to set.

🚧 **Inventory unit choice** — creating a listing requires an explicit choice
of one Cert ID belonging to the selected product, or `No Cert ID` when the lot
uses an unnumbered unit.

🚧 **Separate graded lots** — each available Cert ID for one product can have
its own live listing, and one Cert ID can belong to only one live listing.

## Operator actions

:::detail{title="Grants and the trail" for="operator"}
Catalogue work — drafting, editing, publishing, calling off — sits behind
`auction:write` and `auction:operate`, which `staff` hold. `auction:reserve`
is the only grant that exposes a seller's secret floor and `auction:settle` is
the only one that moves money; neither is needed to run the catalogue. Every
elevated move appends to a hash-chained trail and refuses to run at all if that
record cannot be written.
:::

:::detail{title="Seeding lots locally" for="engineer"}
The Test panel — local dev only — seeds fixtures from two tabs. **Campaign**
opens a campaign and attaches the chosen fixtures to it. **Listings** seeds the
same fixtures with no campaign at all: each still gets a reserved inventory
product and a media item, so the campaign-free lifecycle can be exercised
end to end. Its Drop listing control removes one standalone fixture and
releases the hold it kept, and it reaches only listings the seed created —
a lot an operator authored carries a slug the pattern does not match.
:::

:::detail{title="Product decisions" for="pm"}
An operator chooses the auction currency, but not the increments that shape
its bidding. One schedule keeps a lot's opening price accessible and its later
competition proportionate without asking an operator to predict the close.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Supported currencies | Decided | Listing currency is USD, HKD, or JPY only. | Product |
| Minimum increment | Decided | No listing-level override; the selected currency's shared schedule supplies the floor. | Product |
| Operator schedule editing | Decided | Not available; changing the policy is separate work. | Product |
:::
