## Goals

- Describe the Cart Drawer as the signed-in member's current cart
- Keep global Cart availability with durable `grade10-site/site/page-shell`
- Keep signed-out Cart access with `require-sign-in-from-nav-cart`

## Non-Goals

- Bringing back a guest browser cart or guest checkout
- Deciding when the Cart control appears on a surface
- Deciding what a signed-out Cart press does
- Editing promo codes in the drawer; an existing checkout code stays selected

## Decisions

The canonical Store and page-shell records settle this reconciliation on
2026-09-18.

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which cart does the drawer read? | The signed-in member's cart; a signed-out session holds no lines | Keeping the guest browser cart from this older delta, which contradicts the Store cart decision |
| Q2 | Which change owns Cart availability? | Durable `grade10-site/site/page-shell` owns absence until Store answers and global Cart after it answers (folded from `auction-first-site-header`); this change owns the drawer | Keeping a Store-only Cart handler in this change, which would contradict the global Cart decision |
| Q3 | Which change owns a signed-out Cart press? | `require-sign-in-from-nav-cart` owns the sign-in dialog and resume; this drawer starts only for a signed-in member | Opening a guest drawer from this change, which would have no cart lines to review |

| Q4 | Does the drawer apply points? | Yes; the user-approved Storybook plan supersedes the read-only points scope. Apply, Use max and Remove share checkout's persisted choice and server quote | Keeping points as display-only context |
| Q5 | What happens to an existing code? | Preserve it when points change and include its accepted discount in the server quote | Resetting the code or adding promo editing |
| Q6 | What happens on an unsuccessful change? | Keep the last accepted choice and total for the same basket; block duplicate actions and Checkout while unresolved, discard stale results, and revalidate changed baskets | Optimistically presenting an unaccepted saving |

| Q7 | What input is accepted? | Apply accepts positive whole numbers; zero uses Remove. Above-ceiling amounts use the server-accepted cap | Persisting malformed amounts or duplicating the removal control |
| Q8 | What if a refresh fails after a successful write? | Do not claim rollback; keep stale totals unavailable and reread authoritative intent before Checkout | Showing the previous choice as though the write failed |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/ui/store-cart | Which cart does the drawer read? | Q1 |

| grade10-site/store/cart-drawer | What happens to invalid or zero input? | Q7 |
| grade10-site/store/cart-drawer | What happens when persistence succeeds but a later refresh fails? | Q8 |
