**Author:** @mason5991 - 2026-08-26

Product context: [Grade10 Auction](../../../docs/prds/auction/auction.md).
Distinct from [`add-grade10-inventory`](../add-grade10-inventory/proposal.md)
(house stock ledger). A **sale** here is an auction **sale event /
campaign** — one catalogue cover that **multiple listings** may belong to —
not a store checkout and not an inventory “sold” state.

## Why

Operators already open draft sales and publish covers from a thin Sales tab,
and the service already lets a listing join a sale. The Grade10 auction admin
still cannot **edit** a sale’s title or copy after open, cannot **call a sale
off** from the console, and the listing editor never offers a sale picker —
so operators leave sales blank or wire them outside the panel. Collectors
then see covers and lots that the house cannot author together from one
place.

**Metric:** share of editable listings that carry a sale id set from the
Grade10 auction admin listing editor, and count of sales whose title/copy
were updated or canceled from the Sales section without leaving the panel.
**Acceptance signal:** an operator opens a sale, creates it, edits its cover
fields, publishes or cancels it from an editor that mirrors the listing
authoring pattern, and on a listing’s editor picks one eligible sale (or
clears it).

## What Changes

- **Admin sale authoring.** Authorized operators create, edit (title and
  copy), publish, and cancel auction **sale events** from the Grade10 auction
  admin Sales section via a dedicated editor (not only an inline title form).
- **Sale status aligns with listing.** A sale is `draft`, `created`,
  `published`, or `canceled` — same stages as a listing. Open persists
  `draft`; create moves `draft → created`; publish moves `created →
  published`; cancel moves an open sale to `canceled`. Spelling matches the
  product: `canceled`.
- **Listing editor sale picker.** While authoring a listing, an operator
  selects at most one sale that is still eligible — **`draft` or `created`
  only** — or clears the sale so the listing stands alone. A `published` or
  `canceled` sale is not offered and attaching one is refused.
- **Backend.** Extend the existing sale event (`auctions` table / tRPC) with
  the `created` status and tightened attach eligibility; complete the admin
  client for update / cancel / get / create / setAuction. No parallel
  “campaign” table.
- **Specs.** New durable capability `grade10-auction/admin-sale` for sale
  CRUD and lifecycle. `grade10-auction/admin-listing` gains editor scenarios
  for selecting and clearing a sale under the draft/created rule.

## Capabilities

### New Capabilities

- `grade10-auction/admin-sale`: Operator create / edit / publish / cancel of
  auction sale events in the Grade10 admin panel, including status rules and
  authorization.

### Modified Capabilities

- `grade10-auction/admin-listing`: Listing editor exposes optional sale
  selection among eligible sales; scenarios for attach, clear, and refusal
  of published or canceled sales from the form.

## Impact

- **grade10** — `packages/grade10-auction/{contracts,backend,admin-frontend}`,
  `apps/admin/grade10` auction Sales and listing editor panels; auction worker
  migration for `created` on `auctions.status` and
  `OPEN_AUCTION_STATES = ["draft", "created"]`.
- **grade10-spec** — new `admin-sale` capability; admin-listing delta; no new
  `@grade10/ui` export expected (compose `@grade10/design-system`).
- **Out of scope / Non-goals:** store checkout “sale”; inventory ledger or
  “sold” stock; sale-level clocks or money (listings keep their own windows
  and prices); requiring a sale to publish a listing; sale hero media or
  campaign scheduling fields; coupling to finance or Shopify; attaching new
  listings to an already `published` sale.

## Non-goals

- Replacing or renaming the existing sale event storage.
- Keeping published sales eligible for new listing attachment (they are not).
- Storefront redesign of public sale covers beyond what admin edits already
  purge/cache today.
- Overlap work owned by `add-grade10-inventory`.
