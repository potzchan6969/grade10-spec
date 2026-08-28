**Author:** @mason5991 - 2026-08-26

Product context: [Grade10 Auction](../../../docs/prds/auction/auction.md).
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
campaign (or clears it) and one eligible inventory product — with the auction
admin section labeled Campaigns.

## What Changes

- **Rename Sales → Campaigns in admin.** The Grade10 auction admin tab,
  section chrome, empty states, and listing-editor field for catalogue covers
  use **Campaign** / **Campaigns**, not **Sale** / **Sales**.
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
- **Listing editor inventory product picker.** The listing's catalogue
  `productId` is chosen from Grade10 inventory products whose **`status` is
  `created`** (not `draft`) and **`available > 0`**. Draft and out-of-stock
  products are omitted from the picker and refused on save/create. Consumes
  [`add-grade10-inventory`](../add-grade10-inventory/design.md) Contracts
  (`AuctionEligibleProduct`, `listEligibleProducts`); fixtures stub until
  inventory ships.
- **Backend.** Extend the existing cover entity (`auctions` table / tRPC)
  with the `created` status and tightened attach eligibility; complete the
  admin client for update / cancel / get / create / setAuction. No parallel
  campaign table — product rename only; persistence keeps the existing store.
- **Change id.** This change is `add-admin-auction-campaigns` (renamed from
  `add-admin-auction-sales`) so the planning name matches operator language.
- **Specs.** New durable capability `grade10-auction/admin-campaign` for
  campaign CRUD, lifecycle, and admin rename. `grade10-auction/admin-listing`
  gains editor scenarios for campaign selection and inventory product
  eligibility.

## Capabilities

### New Capabilities

- `grade10-auction/admin-campaign`: Operator create / edit / publish / cancel
  of auction campaigns in the Grade10 admin panel, including status rules,
  authorization, and Campaigns section naming.

### Modified Capabilities

- `grade10-auction/admin-listing`: Listing editor exposes optional campaign
  selection among eligible campaigns; inventory product picker limited to
  **`status` `created`** with **available > 0**; scenarios for attach, clear,
  refusal of published or canceled campaigns, Campaign field labeling, and
  product eligibility.

## Impact

| Consumer | Change |
| --- | --- |
| `@grade10/auction-contracts` | `adminSaleStatusSchema` adds `created`; listing product eligibility refusals |
| `@grade10/auction-admin-frontend` | Campaign editor, listing campaign + product pickers, fixture eligibility stub |
| `apps/backend/grade10/auction` | `ck_auctions_status` + `created`; `OPEN_AUCTION_STATES`; productId validation via inventory binding |
| `apps/admin/grade10` | Campaigns section (rename from Sales), listing editor pickers |
| `@grade10/inventory-contracts` | **Consumed** — `AuctionEligibleProduct`, `listEligibleProducts` (not implemented here) |

## Non-goals

- Renaming the existing `auctions` table, tRPC paths, or wire field names.
- Keeping published campaigns eligible for new listing attachment (they are
  not).
- Storefront redesign of public campaign covers beyond what admin edits
  already purge/cache today.
- Implementing the inventory ledger — only consuming its eligibility read
  model (see `add-grade10-inventory`).
- Store checkout “sale”; inventory intake / vault mutations; campaign clocks
  or money; requiring a campaign to publish a listing; campaign hero media;
  product picker on the campaign cover itself.

## Validation

- `openspec validate add-admin-auction-campaigns --strict`
- Scenarios cover Campaigns rename, campaign lifecycle with `created`, listing
  campaign attach rules, and inventory product eligibility refusals.
