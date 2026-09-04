## Context

See [proposal.md](./proposal.md) for motivation.

**What already exists on `main`:**

- `auction_listings.campaign_id` is nullable; unique indexes treat null rows
  as distinct (`uq_auction_listings_campaign_id_listing_label` uses a partial
  index comment noting this).
- `@grade10/auction-contracts` carries `campaignId: Schema.NullOr(Schema.String)` on
  every admin listing shape — no wire change needed.
- `ListingEditor` already accepts `defaultCampaignId?: string | null` and
  leaves the Campaign field empty when it is `null`.
- `ListingsPanel` holds `composingNew` state and an `onEnsureDraft` / `onCreate`
  path but never renders a Create listing control.
- `seedDevListing` in `packages/grade10-auction/backend/src/db/seedDevListing.ts`
  passes `campaignId` explicitly to `saveListingDraft` and `createListing`.
  The service calls already accept `campaignId?: string | null`.
- `TestFixturesPanel` renders a single "Campaign" tab. The panel's `seed`
  mutation calls `dev.fixtures.listings.seed`, which today always creates a
  campaign first.
- `AuctionPage` already conditionally renders `TestFixturesPanel` behind
  `LOCAL_FIXTURES_ENABLED` — no page change needed.

**What is missing:**

1. A Create listing control on `ListingsPanel`.
2. A Listings tab on `TestFixturesPanel` with its own seed / drop / list RPCs.
3. Backend: a standalone seed path (listings only, no campaign) and a
   standalone-listing drop helper.
4. Scenarios for the null-campaign lifecycle on the listing spec.

## Goals / Non-Goals

**Goals:**

- Add the Listings create entry point with no new editor fields.
- Add Listings tab in the Test panel backed by `LOCAL_FIXTURES_ENABLED`-gated RPCs.
- Cover null-campaign draft → create → publish → slug lookup in tests.

**Non-Goals:**

- Schema migration — `campaign_id` is already nullable.
- Contract changes — admin listing shapes already carry `campaignId: NullOr`.
- Any change to the Campaign tab or its existing seed/drop RPCs.
- Auto-attaching a hidden campaign behind a "standalone" listing.

## Decisions

### Listings section: reuse ListingEditor with null defaultCampaignId

`ListingsPanel` already wires `onEnsureDraft`, `onSave`, `onCreate`, and all
listing actions. Adding a `setComposingNew(true)` button (the same `Plus`
icon pattern `CampaignListingsSection` uses) opens the editor with no
`defaultCampaignId` prop.

**Rejected:** a separate "standalone editor" component — same fields, double
surface.

### Test panel: a second tab, not a second page

`TestFixturesPanel` already uses `Tabs` / `Tab` / `TabPanel` from
`@grade10/frontend-console`. Adding a "Listings" tab beside "Campaign" keeps
the panel self-contained and matches the existing pattern.

**Rejected:** a new `StandaloneFixturesPanel` component exported separately —
the two tabs share fixture id definitions and instance-count semantics; a
single panel with two tabs avoids duplicating that state management.

### Backend standalone seed: null campaignId branch inside seedDevListing

`seedDevListing` currently opens a campaign before seeding listings.

**Choice:** pass `campaignId: null` as an option that skips `createSeedCampaign`
entirely and feeds `null` to `createFixtureListing`. A fixture listing with
`null` campaign_id uses the same inventory seed, media, draft, create, and
publish path as today — only the campaign step is omitted.

The slug pattern becomes `dev-fixture-standalone-<id>-<n>` so drop and list
queries can distinguish standalone listings from campaign-attached ones.

**Rejected:** a separate `seedDevStandaloneListing` function — the
`createFixtureListing` logic is identical; a branch is simpler and keeps the
fixture count in one place.

### Backend standalone drop: identify by slug pattern + null campaign_id

`dropDevFixtureCampaign` identifies fixtures via the campaign's copy string.
Standalone fixtures have no campaign. The drop helper instead queries:
`listings` where `slug ~ '^dev-fixture-standalone-'` and `campaign_id IS NULL`.
It releases each listing's inventory hold (via `releaseListingInventoryHold`)
and deletes the row.

**Rejected:** a boolean "fixture" column — avoids a migration; the slug
pattern is already how `fixtureInstances` identifies fixtures.

### New RPCs behind assertDevEndpointsAllowed

Two new procedures alongside the existing `dev.fixtures.listings.seed`:

- `dev.fixtures.listings.listStandalone` — returns standalone fixture listing
  summaries (id, title, slug, status).
- `dev.fixtures.listings.dropStandalone` — drops one standalone fixture listing
  by listing id.

The existing `dev.fixtures.campaigns.list` and `dev.fixtures.campaigns.drop`
are unchanged.

## Database Schema

No change. `auction_listings.campaign_id` remains nullable `text` referencing
`auctions.id`.

## Contracts

No wire shape change. Standalone seed result reuses the same `SeededDevListingFixtures`
shape (`added`, optional `campaignId`, `instances`), with `campaignId` absent.

Two new `AuctionAdminDevFixturesClient` methods:

```
listStandaloneFixtureListings(): Promise<Response>  // returns standalone listing summaries
dropStandaloneFixtureListing(listingId: string): Promise<Response>
```

These are internal dev-only, so no version or published contract concerns.

## Risks / Trade-offs

- **[Risk] Standalone slug pattern collides with a future fixture id** →
  Mitigation: prefix is `dev-fixture-standalone-`; existing campaign fixtures
  use `dev-fixture-<id>-`; the two do not overlap.
- **[Risk] Drop removes listings a developer edited manually** →
  Mitigation: drop matches slug pattern AND `campaign_id IS NULL`; a listing
  an operator created from the Listings section has a human-chosen slug and
  would not match.
- **[Trade-off] Two seed code paths (campaign / standalone) share
  `createFixtureListing`** → Accepted; the function is already parameterized
  by `campaignId`; passing `null` adds one branch at the call site.

## Migration Plan

None. Backend RPCs are behind `assertDevEndpointsAllowed`. Frontend controls
are behind `LOCAL_FIXTURES_ENABLED`. Rollback: remove the Listings tab
controls and the new RPC handlers.
