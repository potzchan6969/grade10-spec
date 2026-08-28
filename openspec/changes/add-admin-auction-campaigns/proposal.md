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
campaign (or clears it) — with the auction admin section labeled Campaigns.

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
- **Backend.** Extend the existing cover entity (`auctions` table / tRPC)
  with the `created` status and tightened attach eligibility; complete the
  admin client for update / cancel / get / create / setAuction. No parallel
  campaign table — product rename only; persistence keeps the existing store.
- **Change id.** This change is `add-admin-auction-campaigns` (renamed from
  `add-admin-auction-sales`) so the planning name matches operator language.
- **Specs.** New durable capability `grade10-auction/admin-campaign` for
  campaign CRUD, lifecycle, and admin rename. `grade10-auction/admin-listing`
  gains editor scenarios for selecting and clearing a campaign under the
  draft/created rule.

## Capabilities

### New Capabilities

- `grade10-auction/admin-campaign`: Operator create / edit / publish / cancel
  of auction campaigns in the Grade10 admin panel, including status rules,
  authorization, and Campaigns section naming.

### Modified Capabilities

- `grade10-auction/admin-listing`: Listing editor exposes optional campaign
  selection among eligible campaigns; scenarios for attach, clear, refusal of
  published or canceled campaigns, and Campaign field labeling.

## Impact

- **grade10** — `packages/grade10-auction/{contracts,backend,admin-frontend}`,
  `apps/admin/grade10` auction Campaigns and listing editor panels (rename
  from Sales); auction worker migration for `created` on `auctions.status` and
  `OPEN_AUCTION_STATES = ["draft", "created"]`.
- **grade10-spec** — new `admin-campaign` capability; admin-listing delta; no
  new `@grade10/ui` export expected (compose `@grade10/design-system`).
- **Out of scope / Non-goals:** store checkout “sale”; inventory ledger or
  “sold” stock; campaign-level clocks or money (listings keep their own
  windows and prices); requiring a campaign to publish a listing; campaign
  hero media or scheduling fields; coupling to finance or Shopify; attaching
  new listings to an already `published` campaign; renaming the `auctions`
  persistence / wire identifiers.

## Non-goals

- Renaming the existing `auctions` table, tRPC paths, or wire field names.
- Keeping published campaigns eligible for new listing attachment (they are
  not).
- Storefront redesign of public campaign covers beyond what admin edits
  already purge/cache today.
- Overlap work owned by `add-grade10-inventory`.
