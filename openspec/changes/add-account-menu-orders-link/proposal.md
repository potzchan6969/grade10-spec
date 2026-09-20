**Author:** @seankcw - 2026-09-18

## Why

A signed-in collector can complete a Store purchase and see it at
`/profile/orders`, but the header does not say so: the account menu still
lists only Profile, My Auctions, and Sign out — the set fixed when Grade10 had
no Store checkout to point anyone toward. A collector who does not already
know the address has no way to reach their orders except a direct link or a
support conversation.

**Metric:** share of `/profile/orders` sessions that arrive through the
account menu, against sessions arriving by a direct or support-supplied link.

## What Changes

- Add a My Orders entry to the account menu, between Profile and My Auctions,
  shown only to a signed-in collector once Store answers — `/profile/orders`
  is itself gated on Store, so the entry follows the same gate. Activating it
  opens `/profile/orders`, the Your Orders surface
  `add-grade10-customer-order-pages` already ships.
- Widen `SiteHeader`'s account-menu contract with a My Orders handler, gated
  the same way as Cart and search, and a copy slot; drop the "SHALL NOT
  include Orders" wording `shared/ui/site-chrome` carries from the
  auction-first launch scoping decision — that exclusion predates Store's
  order history and no longer states what the product should do.
- Update `grade10-site/site/page-shell`'s account-menu requirement the same
  way: activating My Orders SHALL take a signed-in collector to
  `/profile/orders`. KYC stays excluded from the menu; only the Orders part of
  that exclusion is lifted.
- Add My Orders copy to the Grade10 `en`, `zh-Hant`, and `zh-Hans` chrome
  catalogs.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `shared/ui/site-chrome`: `SiteHeader`'s account-menu export contract gains a
  My Orders handler and copy slot; the signed-in menu order becomes Profile,
  My Orders, My Auctions, Sign out; the requirement no longer excludes Orders.
- `grade10-site/site/page-shell`: the account menu's wired destinations gain
  My Orders → `/profile/orders`, alongside the existing Profile and My
  Auctions entries. KYC stays excluded.

## Impact

- `packages/ui` (`@grade10/ui`): `SiteHeader`'s account-menu markup, props,
  and stories.
- `apps/frontend/grade10`: `SiteShell.tsx` wiring a My Orders handler to the
  existing `/profile/orders` route; chrome copy keys.
- Grade10 catalogs in this store: a `myOrders` label in the `chrome`
  namespace for `en`, `zh-Hant`, and `zh-Hans`.

## References

- [Site Header and Footer · Account Entry](../../../docs/prds/products/shared/ui/site-chrome.md#account-entry)
- [Page Shell · Account Menu](../../../docs/prds/products/grade10-site/site/page-shell.md#account-menu)

## Follow-on changes

- `add-my-auction-orders` still owes its own delta on `shared/ui/site-chrome`
  and `grade10-site/site/page-shell` for its "My Auction Orders" entry;
  whichever change lands second should read this change's menu order and
  copy rather than re-deciding them.
- KYC remains outside the account menu until a KYC surface is in scope for
  the header.
