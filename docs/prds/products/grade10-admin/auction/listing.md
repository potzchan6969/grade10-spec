---
title: Listing Management
spec: grade10-admin/auction/listing
audience: operator
order: 11
---

Every lot starts as an operator's draft here, is filled with catalogue copy
and a gallery, priced and scheduled, and published, or called off.

## Values

| Rule | Value |
| --- | --- |
| Currency | **USD**, **HKD** or **JPY**, one per listing |
| Bid floor | The selected currency's [price schedule](/p/grade10-site/auction/bid-increments); no minimum-increment field |
| Gallery | **1 to 8** images or videos, stored as uploaded, the first item as the catalogue card |
| Extension | An extension duration and an optional cap, set before publish |

## Drafting and Creating

- **Draft first** — the first save mints the auctionable unit behind the lot
  and lets the operator walk away; nothing is required yet, so a listing can
  be half-written for a week
- **Catalogue fields** — copy and taxonomy may be written before publish
- **Create** — a title, a slug, a starting price, scheduled times and at
  least one media item are checked on the form and again at the API, so a
  script cannot slip past what the form refuses
- **Writable before publish** — the starting price, the close, the extension
  duration and the cap can change until the listing is live
- **Slug** — the key a collector opens the lot by: two live listings never
  share one, a called-off listing gives its slug back, and a closed one keeps
  it forever
- 🚧 **Inventory unit choice** — creating a listing requires an explicit
  choice of one Cert ID belonging to the selected product, or `No Cert ID`
  when the lot uses an unnumbered unit
- 🚧 **Separate graded lots** — each available Cert ID for one product can
  have its own live listing, and one Cert ID can belong to only one live
  listing

## Publishing and Calling Off

- **Publish** — a created listing is ready to sell but not yet visible;
  publishing is a separate move, immediately or at a future time the
  operator sets
- **Call off** — at any point before the close: draft, created, or published
  with live bids on it
- **Closed is frozen** — once a lot has closed this is no longer the place to
  change it; the sale is settled and fulfilled in the [Post-Sale
  Queue](/p/grade10-admin/auction/post-sale)

## Campaign

A campaign is a cover a lot may sit under, never a thing it needs.

- **Optional** — an operator starts a listing from the Listings section and
  leaves the Campaign field empty; draft, create, publish and the collector's
  slug all work with no campaign attached, and the Listings table shows `-`
  for such a row
- **A set together** — campaigns remain the way to sell a set together; a
  make-good, a rehearsal, or a single lot arriving on its own asks for no
  cover — [Campaigns](/p/grade10-admin/auction/campaign)

## Operator Actions

- 🚧 **Watchers** — the Listings table shows how many collectors watch each
  lot, across both brands; it is interest, not a count of expected bidders

## Grants

- **Catalogue work** — drafting, editing, publishing and calling off sit
  behind `auction:write` and `auction:operate`, which `staff` hold
- **Money and the floor** — `auction:reserve` is the only grant that exposes
  a seller's secret floor and `auction:settle` the only one that moves money;
  neither is needed to run the catalogue
- **The trail** — every elevated move appends to a hash-chained trail and
  refuses to run at all if that record cannot be written — [Audit
  trail](/p/grade10-admin/audit)

::cases{id="grade10-admin/auction/listing"}

:::detail{title="Code map" for="engineer"}
- **Test panel** — local dev only: the **Campaign** tab seeds fixtures under
  a campaign, the **Listings** tab seeds the same fixtures with no campaign,
  each with a reserved inventory product and a media item; its Drop listing
  control removes one standalone fixture and releases its hold, and reaches
  only listings the seed created
- **Service** — [Auction Service](/platform/auction-service)
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
| Watch count placement | Decided | A Watchers column on the Listings table, not the listing's own page. | Design |
:::
