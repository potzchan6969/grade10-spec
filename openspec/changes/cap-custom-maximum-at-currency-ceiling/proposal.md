**Author:** @htonyl - 2026-10-09

## Why

A collector can enter more than the auction accepts and then sees a maximum-bid message instead of a usable amount ([issue 1008](https://github.com/9gag/grade10/issues/1008)). The [owner's decision](https://github.com/9gag/grade10/issues/1008#issuecomment-6076137634) makes the field stop extra digits and fall back to the allowed maximum; success means no maximum-bid message in these flows and a displayed draft within the listing currency's ceiling.

## What Changes

- **BREAKING - Custom maximum** - use the existing currency bid ceiling; additional typed digits above it retain the draft, while oversized replacement or paste becomes that ceiling
- **Silent correction** - remove the maximum-bid message from the collector site, including a defensive service refusal; corrected input is reviewed before another bid attempt
- **Shared field** - set and raise use the same behavior, after existing whole-major cleaning
- **Placeholder alignment** - restore the agreed Storybook placeholder, `{amount} min.`, in the existing catalog key, following the [owner's copy correction](https://github.com/9gag/grade10/issues/1008#issuecomment-6076174107); retain localized minimum wording and existing number formatting

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `shared/ui/auction-listing`: custom maximum entry uses the currency ceiling with input-specific correction
- `grade10-site/auction/auction`: an above-ceiling refusal displays no maximum-bid copy
- `grade10-site/auction/bid-increments`: retain the service ceiling contract unchanged while moving its oversized-bid case from blocked UI entry to direct API verification

## Impact

- **Pages** - [Listing Page Blocks - Custom Maximum](../../../docs/prds/products/shared/ui/auction-listing.md#custom-maximum), [Bidding Rules - Refusals](../../../docs/prds/products/grade10-site/auction/bidding.md#refusals) and [Bidding Rules - Bid Increments](../../../docs/prds/products/grade10-site/auction/bidding.md#bid-increments)
- **Exports and consumers** - `ListingAuctionBidCard` behavior changes for the Grade10 collector site and shared preview; its existing exported view gains a required ceiling in minor units supplied by the consumer alongside currency, with no new component export
- **Repositories** - shared field, helper tests and stories in `9gag/grade10-spec`; collector refusal handling and browser regression in `9gag/grade10`
- **Copy correction** - align the existing customAmountPlaceholder key in all four shared catalog locales with the short minimum treatment already shown by Storybook; this restores agreed copy and adds no durable behavior requirement
- **Previous contract** - supersedes the universal cap and restore-only decisions in [cap-custom-maximum-entry](../archive/2026-10-07-cap-custom-maximum-entry/decisions.md); preserve that archive and its immutable acceptance fingerprint a9274789f83bcf95227ec9634c73ae51f2842232ad76b697937cda76c70b05ed
- **Related work** - local activity-time and gallery-width changes touch distinct requirements on the shared surface; neither owns this ceiling requirement

**No domain impact:** the domain's below-minimum refusal case keeps its message and no-record assertions. The auction service's ceilings, refusal codes, operational logs and bid side effects remain unchanged; only entry and collector presentation change.
**No product impact:** no broader journey or smoke outcome changes beyond the scoped custom-maximum and refusal cases.

## References

- [Listing Page Blocks - Custom Maximum](../../../docs/prds/products/shared/ui/auction-listing.md#custom-maximum)
- [Bidding Rules - Refusals](../../../docs/prds/products/grade10-site/auction/bidding.md#refusals)
- [Bidding Rules - Bid Increments](../../../docs/prds/products/grade10-site/auction/bidding.md#bid-increments)
