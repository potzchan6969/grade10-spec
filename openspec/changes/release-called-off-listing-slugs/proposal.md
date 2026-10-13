**Author:** @htonyl - 2026-10-12

## Why

A called-off lot's address currently has two conflicting promises: another listing can take it, and the same withdrawn lot remains permanently reachable there. The owner selected reuse in [issue 956](https://github.com/9gag/grade10/issues/956#issuecomment-6119982504), so operators and collectors need one consistent outcome.

**Metric:** every operator and campaign call-off walk releases the original slug; every subsequent lookup answers the eligible current holder or Page not found. Target: 100% of the planned cancellation and reuse walks.

## What Changes

- **BREAKING - Called-off address** - Release the original slug for another listing. A called-off lot no longer remains reachable through its former address.
- **Current holder** - An unused former address shows Page not found. Once another public lot holds it, that address opens the new lot under the existing lookup rules.
- **Consistent cancellation** - Operator call off and campaign cancellation select the same address outcome.
- **Hidden lots** - Remove the permanent direct-address exception while preserving browse removal and the bidder's My Auctions record.
- **Identifier boundary** - Keep the listing code reserved and keep code-only public routes refused.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-admin/auction/listing` - Reconcile slug reuse and cancellation with release of the original slug.
- `grade10-site/auction/listing-page` - Remove permanent direct access to the called-off listing and use the current slug holder for public lookup.
- `grade10-site/auction/lot-status` - Remove the called-off canonical-address exception from hidden-lot behavior.

## Impact

- **Product pages** - [Auction Management - Listings](../../../docs/prds/products/grade10-admin/auction/management.md#listings), [Auction Display - Auction Details](../../../docs/prds/products/grade10-site/auction/display.md#auction-details), and [Lot Status](../../../docs/prds/products/grade10-site/auction/display.md#lot-status).
- **Application** - Grade10 auction cancellation, slug availability and public lookup, including served and client-fetched listing pages. Existing canceled rows need technical investigation before delivery scope is complete.
- **Exports** - No shared component export or token change. Existing Page not found and public lot pages supply the outcomes.
- **History** - This changes the canonical-retention choice in the archived identifier change. Historical snapshots remain intact. The active shipping-progress-copy delta changes other lot-status requirements and must retain ownership of those requirements.
- **Domain walks** - QA1 reviews the admin campaign-cancellation walk and the site hidden-lot/not-found walk at domain level before writing feature suites. The changed journeys intersect both auction domain suites.

No product impact: the existing admin product suite does not trace the affected journeys; no site product suite is present.

No platform impact: no platform suite is present, and this change remains within the Grade10 auction domain.

## References

- [Auction Management - Listings](../../../docs/prds/products/grade10-admin/auction/management.md#listings)
- [Auction Display - Auction Details](../../../docs/prds/products/grade10-site/auction/display.md#auction-details)
- [Auction Display - Lot Status](../../../docs/prds/products/grade10-site/auction/display.md#lot-status)

