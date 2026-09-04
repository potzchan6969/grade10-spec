**Author:** @mason5991 - 2026-09-03

Product context: [Listing Management](../../../docs/prds/products/grade10-admin/auction/listing.md).

## Why

Two related gaps on `main`:

1. **Operators cannot start an independent listing.** Every Create listing
   button lives inside the campaign editor (`CampaignsPanel` →
   `CampaignListingsSection`), which pre-fills the campaign id. `ListingsPanel`
   renders no create control. An operator who wants a one-off lot — a make-good,
   a sandbox rehearsal, a sale that belongs to no cover — has no path that does
   not force a campaign.

2. **The Test panel cannot seed standalone listings.** `TestFixturesPanel`
   shows only a "Campaign" tab. Seeding always creates a campaign and attaches
   listings to it. A developer who wants fixture listings with no campaign to
   test the independent lifecycle has no control. The backend's
   `seedDevListing` already accepts an optional `campaignId`; the gap is
   purely in the panel and the API layer beneath it.

**Metric:** share of new listings persisted with a null `campaign_id`, and
developer time to seed a standalone fixture listing from the Test panel.
**Acceptance signal:** an operator opens Listings, clicks Create listing,
saves, creates, and publishes a listing with no campaign; a developer opens
the Test panel's Listings tab, selects fixtures, seeds them with no campaign,
and sees each row in the Listings section without a campaign.

## What Changes

- **Listings section Create listing control.** `ListingsPanel` gains a Create
  listing icon button (same pattern as `CampaignListingsSection`). It opens
  the existing `ListingEditor` with `defaultCampaignId` unset, leaving the
  Campaign control empty.
- **Independent listing lifecycle.** Draft, create, publish, and public
  slug lookup all work when a listing has no campaign. The spec adds
  scenarios for this path.
- **Test panel Listings tab.** A second tab in `TestFixturesPanel` — beside the
  existing Campaign tab — lets a developer select fixture ids and seed them
  without creating a campaign. The listing gets a product, reservation, and
  media exactly as the Campaign tab does, but `campaignId` stays null. The
  "Add listings" button seeds; a companion "Drop listings" select-and-drop
  removes only the standalone fixture listings.
- **Backend: standalone seed path.** `seedDevListing` (or a new thin sibling)
  accepts a `campaignId: null` option and creates fixture listings with no
  campaign. The `dropDevFixtureCampaign` helper gains a counterpart that
  removes standalone fixture listings by slug pattern.
- **Fixture list and drop RPC.** A `dev.fixtures.listings.list` procedure
  returns existing standalone fixture listing summaries. A
  `dev.fixtures.listings.drop` procedure drops them (releases holds, removes
  rows). The frontend's `DevListingFixturesRepository` and API service grow
  corresponding methods.

## Non-Goals

- Renaming any campaign fields, changing campaign eligibility rules, or
  touching inventory ledger work.
- Seeding a campaign for the standalone listings — they remain campaign-free
  throughout their lifecycle.
- Any change to the Campaigns tab's existing seed or drop behavior.
- A new listing editor, new listing fields, or any UI change to the editor
  itself — the existing editor is reused as-is.
- Production-only code. Standalone seed and drop live behind
  `LOCAL_FIXTURES_ENABLED` / `assertDevEndpointsAllowed`, the same guard as
  today.

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `grade10-admin/auction/listing`: Listings section exposes a Create listing
  control; draft / create / publish / public lookup succeed with no campaign;
  Listings table shows an unattached label for campaign-free rows.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/admin/grade10` | No change — `AuctionPage` already renders `ListingsPanel` and `TestFixturesPanel` |
| `@grade10/auction-admin-frontend` | `ListingsPanel` create control; `TestFixturesPanel` Listings tab; `DevListingFixturesRepository` / API service new methods |
| `@grade10/auction-service` | `seedDevListing` or sibling accepts `campaignId: null`; new drop-standalone helper; new `dev.fixtures.listings.list` and `dev.fixtures.listings.drop` procedures |
| `@grade10/auction-contracts` | No wire change — `campaignId` already `NullOr(String)` |

## Validation

- `openspec validate create-standalone-auction-listings --strict`
- Scenarios cover Listings-section create, null-campaign draft/create/publish,
  unattached list label, authorization refusal, Test-panel Listings tab seed,
  and drop of standalone fixture listings.
