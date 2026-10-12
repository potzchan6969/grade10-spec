## Goals

- **Reusable address** - Another listing can take the original slug of a called-off listing.
- **Clear lookup** - Collectors receive the eligible current lot at an address, or Page not found when no eligible lot holds it.
- **Consistent cancellation** - The same outcome applies to operator call off and campaign cancellation.

## Non-Goals

- **Hard deletion** - Add no delete operation or page-retention promise after hard deletion.
- **Alternate routes** - Add no redirects, aliases, tombstone route or code-only public route.
- **Identifier policy** - Do not change permanent listing-code reservation or retention of closed and settled listing slugs.
- **Other outcomes** - Keep inventory release, no-charge results, browse removal and bidder history under their existing owners.
- **Presentation** - Add no shared component export, visual variant or new page state.

## Decisions

The owner settled the product direction in [issue 956](https://github.com/9gag/grade10/issues/956#issuecomment-6119982504) and explicitly requested preparation of this specification change. These answers are carried forward; they are not reopened.

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Can another listing take a called-off listing's slug? | Yes. The original slug becomes available for reuse - confirmed by @htonyl in issue 956. | Permanent reservation of the original slug, which prevents the selected reuse. |
| Q2 | Does the called-off listing keep a permanent direct route through that original address? | No. Remove the called-off canonical-retention scenario and reconcile the clauses that promise it - confirmed by @htonyl in issue 956. | Retaining the same listing at the old address while allowing another listing to take that address. |
| Q3 | What does a collector receive at a released address? | The eligible current holder, or Page not found when none holds it - carried forward from the existing public lookup and not-found contracts. | An alias or special canceled page, which would introduce a new public route outside the selected scope. |
| Q4 | Does reuse change the listing code or bidder history? | No - scoped to the address decision. Preserve permanent code reservation, no code-only route and the existing bidder exception. | Changing unrelated identifier and account records without an owner request. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |

