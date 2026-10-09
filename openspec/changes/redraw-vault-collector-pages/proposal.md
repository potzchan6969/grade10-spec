**Author:** @tangconst - 2026-10-09

## Why

The collector's vault screens were taken off the site in `retire-vault-collector-site` and are being drawn again. The first surface to land is the vault portfolio: what a collector holds in the vault, what one item is worth, and what they can do with it — list it, grade it, or ask for it back. Until these ship, a vaulted item is invisible to its owner.

**Metric:** collectors reaching a vault page that answers rather than the not-found surface.

## What Changes

- **Portfolio page** — the collector's vaulted holdings with a summary, an intake alert for submissions in flight, and a card per item.
- **Asset detail page** — one vaulted item, graded or raw: gallery, status, estimated value since intake, value-potential callout for raw items, details (grade, cert with verification, vault storage id, location, condition), custody log, and documents.
- **Actions on an item** — `List for Auction`, `List for Sale`, `Submit for Grading` on raw items, and `Request Retrieval`.
- **Documents** — each document on the item opens or downloads; a grading-institute report opens the institute's own site in a new tab.
- **Storybook first** — the surfaces land in `apps/preview` as `Pages/Vault/*` stories composing design-system primitives; product routes follow when the flow is settled.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-site/vault/portfolio`: the collector's vaulted holdings — the list, one item's detail, and the acts on it (listing, grading submission, retrieval, custody and document reads).

### Modified Capabilities

None. The retired case-flow screens stay retired; their requirements live in the existing vault capabilities unchanged.

## Impact

- `apps/preview` — `Pages/Vault/*` page and block stories, fixtures in `vault-content.ts`.
- `packages/design-system` — existing primitives only (`Badge`, `Card`, `Alert`, `Button`, `Link`, `Tabs`, `Stepper`, `Step`); `Alert` honors a custom icon on any status.
- `packages/ui` — `ListingLotGallery` gains a per-image label rendered beside the counter.
- No product routes, data fetching or backend contract yet — the screens are the design reference for the flow they mount.

## References

- [Portfolio](../../../docs/prds/products/grade10-site/vault/portfolio.md)
- [Portfolio · The item's page](../../../docs/prds/products/grade10-site/vault/portfolio.md#the-item-s-page)

## Follow-on changes

- Wiring the portfolio surfaces to the vault worker's reads and acts.
- The request flow for listing a vaulted item at auction or sale.
