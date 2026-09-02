**Author:** @mason5991 - 2026-08-26

Product context: [Grade10 Auction](../../../docs/prds/products/grade10-auction/index.md).
Distinct from [`add-grade10-inventory`](../add-grade10-inventory/proposal.md)
(house stock ledger). A **campaign** here is an auction catalogue cover /
event that **multiple listings** may belong to — not a store checkout and not
an inventory “sold” state. Operator language is **Campaign** / **Campaigns**
(replacing the prior **Sale** / **Sales** labels).

## Why

Operators already open draft covers and publish them from a thin Sales tab,
and the service already lets a listing join a cover. The Grade10 auction
admin still cannot **edit** a campaign’s title or copy after open, cannot
**call a campaign off** from the console, and the listing editor never offers
a campaign picker — so operators leave covers blank or wire them outside the
panel. Collectors then see covers and lots that the house cannot author
together from one place. The admin chrome still says **Sales**, which does
not match the product name **Campaigns**.

**Metric:** share of editable listings that carry a campaign id set from the
Grade10 auction admin listing editor, and count of campaigns whose title/copy
were updated or canceled from the Campaigns section without leaving the
panel. **Acceptance signal:** an operator opens a campaign, creates it, edits
its cover fields, publishes or cancels it from an editor that mirrors the
listing authoring pattern, and on a listing’s editor picks one eligible
campaign (or clears it), one eligible inventory product with quantity, clicks
**Save** to reserve stock, then creates the listing — with the auction admin
section labeled Campaigns.

## What Changes

- **Rename Sales → Campaigns in admin — labels and code.** Operator chrome and
  listing-editor copy use **Campaign** / **Campaigns**, not **Sale** / **Sales**.
  Auction admin packages, contracts, and backend helpers for the catalogue-cover
  entity rename **sale** identifiers to **campaign** (for example `adminSale*`
  schemas, `SalesPanel`, `sales` feature modules). Persistence and wire paths
  that already say **auction** stay (`auctions` table, `auctions.*` tRPC,
  listing `auctionId`).
- **Admin campaign authoring.** Authorized operators create, edit (title and
  copy), publish, and cancel auction **campaigns** from the Campaigns section
  via a dedicated editor (not only an inline title form).
- **Campaign status aligns with listing.** A campaign is `draft`, `created`,
  `published`, or `canceled` — same stages as a listing. Open persists
  `draft`; create moves `draft → created`; publish moves `created →
  published`; cancel moves an open campaign to `canceled`. Spelling matches
  the product: `canceled`.
- **Listing editor campaign picker.** While authoring a listing, an operator
  selects at most one campaign that is still eligible — **`draft` or
  `created` only** — or clears the campaign so the listing stands alone. A
  `published` or `canceled` campaign is not offered and attaching one is
  refused.
- **Listing editor inventory product picker and quantity.** The listing's
  catalogue **productId** and **quantity** (1–500; defaults to **1** when a
  product is picked in the form) come from Grade10 inventory. Picker lists
  **`status` `created`** products with **`available > 0`**, plus the listing's
  current product when this listing already holds its last units. Explicit
  **Save** synchronizes an **active** inventory hold; no auto-save on field
  change. **`listings.create`** verifies the hold matches — it does not
  reserve. Changing product after a prior Save prompts confirmation that the
  old hold will release on Save. Consumes
  [`add-grade10-inventory`](../add-grade10-inventory/design.md) holder APIs.
- **Backend.** Extend the existing cover entity (`auctions` table / tRPC)
  with the `created` status and tightened attach eligibility; add listing
  **quantity** column; wire reservation sync on Save, hold verification on
  create, and hold release on cancel; complete the admin client for update /
  cancel / get / create / setAuction.
- **Change id.** This change is `add-admin-auction-campaigns` (renamed from
  `add-admin-auction-sales`) so the planning name matches operator language.
- **Specs.** New durable capability `grade10-admin/auction/campaign` for
  campaign CRUD, lifecycle, and admin rename. `grade10-admin/auction/listing`
  gains editor scenarios for campaign selection and inventory product
  eligibility.

## Capabilities

### New Capabilities

- `grade10-admin/auction/campaign`: Operator create / edit / publish / cancel
  of auction campaigns in the Grade10 admin panel, including status rules,
  authorization, and Campaigns section naming.

### Modified Capabilities

- `grade10-admin/auction/listing`: Listing editor exposes optional campaign
  selection; inventory product picker and **quantity**; explicit Save with
  reservation sync; create verifies hold; product-change confirmation;
  cancel releases hold; scenarios for attach, eligibility, save sync, and
  refusals.

## Impact

| Consumer | Change |
| --- | --- |
| `@grade10/auction-contracts` | `adminSale*` → `adminCampaign*`; `created` status; listing `quantity`; hold sync refusals |
| `@grade10/auction-admin-frontend` | `sales` → `campaigns` modules; campaign editor, listing Save-only editor, product-change dialog, quantity field |
| `@grade10/auction-service` | Catalogue-cover helpers `*Sale*` → `*Campaign*`; `ck_auctions_status` + `created`; listing `quantity`; reservation sync |
| `apps/admin/grade10` | `SalesPanel` → `CampaignsPanel`; listing editor pickers + explicit Save |
| `@grade10/inventory-contracts` | **Consumed** — holder APIs including `changeReservationProduct` |

## Non-goals

- Renaming the `auctions` table, `auctions.*` tRPC router paths, or listing
  `auctionId` wire field — those already use auction vocabulary.
- Renaming post-sale (`postSale`, `PostSalePanel`) or inventory sell/sold
  vocabulary — different domains.
- Keeping published campaigns eligible for new listing attachment (they are
  not).
- Storefront redesign of public campaign covers beyond what admin edits
  already purge/cache today.
- Implementing the inventory ledger — consuming its holder RPCs (see
  `add-grade10-inventory`).
- Auto-save or save-on-blur on the listing editor catalogue fields.
- Store checkout “sale”; inventory intake / vault mutations; campaign clocks
  or money; requiring a campaign to publish a listing; campaign hero media;
  product picker on the campaign cover itself.

## Validation

- `openspec validate add-admin-auction-campaigns --strict`
- Scenarios cover Campaigns rename, campaign lifecycle with `created`, listing
  campaign attach rules, explicit Save reservation sync, create hold verify,
  product-change confirmation, and inventory eligibility refusals.
