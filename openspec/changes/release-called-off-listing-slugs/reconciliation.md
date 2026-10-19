# Called-off Listing Slugs and Shipping Progress Reconciliation

## Ownership

| Requirement | Owner | Other Change's Scope |
| --- | --- | --- |
| `grade10-site/auction/lot-status`: Every visible lot has one external lot status | `clarify-auction-shipping-progress-copy` owns the external-status mapping | `release-called-off-listing-slugs` changes only the reference from `Collectors never see hidden lots` to `Hidden lots have no public address`. All mapping rules, scenario headings, trace identities and scenario bodies stay the same |
| `grade10-site/auction/lot-status`: Hidden lots have no public address | `release-called-off-listing-slugs` owns the successor to Collectors never see hidden lots | The shipping change does not change hidden-lot visibility or released-address lookup |

## Decisions

- **Settled Outcome** - The [owner's decision](decisions.md#decisions) releases a called-off listing's former slug. The successor requirement keeps browse removal and bidder history while removing permanent direct access.
- **Reference Repair** - The shared external-status requirement must refer to the successor. This source repair adds no status, mapping or collector outcome.
- **Historical Records** - The shipping change is already accepted and claimed. Preserve its sources, acceptance and implementation records. Keep this later reconciliation beside the dependent change, as the owner authorized.
- **Open Questions** - None. The product decisions and the two source owners are settled.

## Acceptance Order

1. `clarify-auction-shipping-progress-copy` is first. Its existing acceptance remains historical provenance.
2. `release-called-off-listing-slugs` is afterward. Its `depends_on` edge records this order and permits the narrow shared-requirement refinement.

Each change keeps its own scope and acceptance. Shipping retains the status mapping. This change preserves that mapping and supplies the valid hidden-lot reference.

- **Scenario Migration** - Both successor requirements use `RENAMED Requirements` with FROM/TO and complete target blocks, as the native acceptance fold requires. This transfers existing scenario identities instead of issuing them again under ADDED. All retained scenarios keep their headings and markers. The listing-page target omits only SC28, as the owner decided; the hidden-lot target revises SC13 under its existing marker. This representation changes no behavior or QA assertion.
