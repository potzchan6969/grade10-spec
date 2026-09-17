---
title: Listing Management
spec: grade10-admin/auction/listing
audience: operator
order: 11
---

Every lot starts as an operator's draft here, is filled with catalogue copy
and a gallery, priced and scheduled, holds its stock, and is published, or
called off.

## Values

| Rule | Value |
| --- | --- |
| Currency | **USD**, **HKD** or **JPY**, one per listing; **HKD** when omitted |
| Bid floor | The currency's [price schedule](/p/grade10-site/auction/bid-increments); no minimum-increment field |
| Title | Required at create; **1 to 200** characters |
| Copy | Optional; at most **4,000** characters |
| Slug | **1 to 64** characters, lower-case words joined by hyphens, unique among every listing |
| Quantity | **1 to 500** units of the chosen product; **1** when a product is picked |
| Extension | **1,800 seconds** when omitted; **0** turns extended bidding off; an optional cap, and a cap below the duration is a hard final deadline |
| Gallery | **1 to 8** images or videos of at most **100 MiB** each, stored as uploaded; a draft may hold none |

## Lifecycle

| Status | Reached when | What can change |
| --- | --- | --- |
| **Draft** | The first save; nothing is required yet | Everything, sandbox included |
| **Created** | Create: a title, a slug, a starting price, a start, a close after both the start and now, at least one media item, and the stock hold the draft took | Catalogue fields, prices and window, slug, Publish at, media |
| **Published** | An operator publishes, or Publish at arrives; a draft never publishes | Catalogue copy, taxonomy and media only |
| **Closed** | The close passes — [Bidding Rules](/p/grade10-site/auction/auction) | Nothing; the sale is settled in the [Post-Sale Queue](/p/grade10-admin/auction/post-sale) |
| **Settled** | The order is done | Nothing |
| **Canceled** | Called off from draft, created or published, or its campaign is cancelled | Nothing; a second call-off is refused |

::image{src="assets/diagrams/auction-listing-status.svg" alt="A listing from Draft to Created, Published, Closed and Settled, with Canceled beneath, reached by calling off a created or published listing"}

## Drafting and Creating

- **Draft first** — the first save mints the auctionable unit and lets the
  operator walk away; a listing can be half-written for a week
- **Explicit Save** — nothing is stored until Save; no field saves itself
- **Checked twice** — create's requirements are checked on the form and again
  at the API, so a script cannot slip past what the form refuses
- **Prices read back** — each price shows as a formatted decimal amount
  before saving, so its decimal placement can be checked
- **Sandbox** — set only while draft: the listing runs on test-mode payment
  credentials, so the house can rehearse a sale
- 🚧 **Inventory unit choice** — creating a listing requires an explicit
  choice of one Cert ID belonging to the selected product, or `No Cert ID`
  when the lot uses an unnumbered unit
- 🚧 **Separate graded lots** — each available Cert ID for one product can
  have its own live listing, and one Cert ID can belong to only one live
  listing

## Stock

- **Product** — the picker lists created products with units available; the
  listing's own product stays pickable while it holds the last units
- **Hold on Save** — saving a draft with a product and a quantity holds that
  stock; a changed quantity moves the hold, and clearing either releases it
- **Changing the product** — a listing that already holds stock warns that
  Save moves the hold to the new product and frees the old one; a refused
  move leaves the old hold and the fields as they were
- **Create needs the hold** — create is refused unless an active hold matches
  the listing's product and quantity
- **Released** — calling off the listing, or its campaign, releases the hold

## Publishing and Calling Off

- **Publish** — a created listing is ready to sell but not yet visible;
  publishing is a separate move, now, or at a Publish at after now that can
  be cleared
- **Call off** — at any point before the close, bids or not; live holds and
  the stock are released, and the slug is freed for another listing while the
  called-off lot stops answering at it
- **Closed is frozen** — once a lot has closed this is no longer the place to
  change it — [Post-Sale Queue](/p/grade10-admin/auction/post-sale)
- **The address** — a published, closed or settled listing answers at
  `/auction/listings/<slug>`; a draft, created or canceled one does not

## Campaign

- **Optional** — a listing starts from the Listings section with no campaign
  and works without one; the picker offers draft and created campaigns only,
  and the Listings table shows `-` for a lot with none —
  [Campaigns](/p/grade10-admin/auction/campaign)

## Operator Actions

- 🚧 **Watchers** — the Listings table shows how many collectors watch each
  lot, across both brands; it is interest, not a count of expected bidders

## Refusals

- **Currency and price** — a currency outside the three, or a starting price
  that is not a positive whole amount
- **Slug** — the wrong shape, or a value another listing holds, closed and
  settled ones included
- **Taxonomy and campaign** — two categories from one taxonomy, or a
  published or canceled campaign
- **Times** — a close not after the start, or a close or Publish at not after
  now at create
- **Media** — a ninth item, an unsupported type, an empty file, one over 100
  MiB, or removing the last item once created
- **Frozen fields** — prices, window, slug or sandbox on a published listing,
  and every write on a closed, settled or canceled one
- **Grants** — a save, create, publish or call-off without its grant

## Grants

- **Catalogue work** — drafting, editing, publishing and calling off sit
  behind `auction:write` and `auction:operate`, which `staff` hold
- **Money** — `auction:settle` alone moves money; neither it nor
  `auction:reserve` is needed to run the catalogue —
  [Roles](/p/shared/auth/roles)
- **The trail** — every elevated move appends to the hash-chained audit trail
  and refuses to run if that record cannot be written — [Audit
  trail](/p/grade10-admin/audit)

::cases{id="grade10-admin/auction/listing"}

:::detail{title="Code map" for="engineer"}
- **Service** — [Auction Service](/platform/auction-service)
- **Test panel** — `LOCAL_FIXTURES_ENABLED`: the Campaign and Listings tabs
  seed and drop fixture listings, local dev only
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
