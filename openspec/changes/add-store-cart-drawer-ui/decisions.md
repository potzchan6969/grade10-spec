## Goals

- Describe the Cart Drawer as the signed-in member's current cart
- Keep global Cart availability with durable `grade10-site/site/page-shell`
- Keep signed-out Cart access with `require-sign-in-from-nav-cart`

## Non-Goals

- Bringing back a guest browser cart or guest checkout
- Deciding when the Cart control appears on a surface
- Deciding what a signed-out Cart press does
- Applying promo codes or points in the drawer

## Decisions

The canonical Store and page-shell records settle this reconciliation on
2026-09-18.

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which cart does the drawer read? | The signed-in member's cart; a signed-out session holds no lines | Keeping the guest browser cart from this older delta, which contradicts the Store cart decision |
| Q2 | Which change owns Cart availability? | Durable `grade10-site/site/page-shell` owns absence until Store answers and global Cart after it answers (folded from `auction-first-site-header`); this change owns the drawer | Keeping a Store-only Cart handler in this change, which would contradict the global Cart decision |
| Q3 | Which change owns a signed-out Cart press? | `require-sign-in-from-nav-cart` owns the sign-in dialog and resume; this drawer starts only for a signed-in member | Opening a guest drawer from this change, which would have no cart lines to review |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
