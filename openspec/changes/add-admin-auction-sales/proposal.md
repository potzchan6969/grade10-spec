**Author:** @mason5991 - 2026-08-26

Product context: [Grade10 Auction](../../../docs/prds/auction/auction.md).
Distinct from [`add-grade10-inventory`](../add-grade10-inventory/proposal.md)
(house stock ledger). A **sale** here is an auction **sale event** — the
catalogue cover listings may belong to — not a store checkout and not an
inventory “sold” state.

## Why

Operators already open draft sales and publish covers from a thin Sales tab,
and the service already lets a listing join a draft or published sale. The
Grade10 auction admin still cannot **edit** a sale’s title or copy after open,
cannot **call a sale off** from the console, and the listing editor never
offers a sale picker — so operators leave sales blank or wire them outside
the panel. Collectors then see covers and lots that the house cannot author
together from one place.

**Metric:** share of editable listings that carry a sale id set from the
Grade10 auction admin listing editor, and count of sales whose title/copy
were updated or canceled from the Sales section without leaving the panel.
**Acceptance signal:** an operator opens a sale, edits its cover fields,
publishes or cancels it from an editor that mirrors the listing authoring
pattern, and on a listing’s editor picks one eligible sale (or clears it).

## What Changes

- **Admin sale authoring.** Authorized operators create, edit (title and
  copy), publish, and cancel auction **sale events** from the Grade10 auction
  admin Sales section via a dedicated editor (not only an inline title form).
- **Sale status stays the existing event machine.** A sale is `draft`,
  `published`, or `canceled`. There is **no** `created` status on sales —
  unlike listings, opening a sale has no separate create validation gate.
  Spelling matches the product: `canceled`.
- **Listing editor sale picker.** While authoring a listing, an operator
  selects at most one sale that is still eligible — **`draft` or
  `published`** — or clears the sale so the listing stands alone. A
  `canceled` sale is not offered and attaching one is refused.
- **No new sale persistence model.** The change completes the operator
  surface on the existing sale event (already stored and served). Backend
  work is limited to any gap needed for the admin client to reach create,
  update, publish, cancel, and listing↔sale attachment — not inventing a
  parallel “campaign” entity.
- **Specs.** New durable capability `grade10-auction/admin-sale` for sale
  CRUD and lifecycle. `grade10-auction/admin-listing` gains editor scenarios
  for selecting and clearing a sale (attach rules already live under
  catalogue fields).

## Capabilities

### New Capabilities

- `grade10-auction/admin-sale`: Operator create / edit / publish / cancel of
  auction sale events in the Grade10 admin panel, including status rules and
  authorization.

### Modified Capabilities

- `grade10-auction/admin-listing`: Listing editor exposes optional sale
  selection among eligible sales; scenarios for attach, clear, and refusal
  of a canceled sale from the form (attach eligibility already required).

## Impact

- **grade10** — `packages/grade10-auction/{contracts,backend,admin-frontend}`,
  `apps/admin/grade10` auction Sales and listing editor panels; auction worker
  only if an admin procedure gap appears (create/update/publish/cancel and
  listing sale attachment already exist on the service).
- **grade10-spec** — new `admin-sale` capability; admin-listing delta; no new
  `@grade10/ui` export expected (compose `@grade10/design-system`).
- **Out of scope / Non-goals:** store checkout “sale”; inventory ledger or
  “sold” stock; adding a `created` status to sales; sale-level clocks or
  money (listings keep their own windows and prices); requiring a sale to
  publish a listing; sale hero media or campaign scheduling fields; coupling
  to finance or Shopify.

## Non-goals

- Replacing or renaming the existing sale event storage.
- Making published sales ineligible for new listings (they stay eligible).
- Storefront redesign of public sale covers beyond what admin edits already
  purge/cache today.
- Overlap work owned by `add-grade10-inventory`.
