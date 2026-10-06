**Author:** @tangconst - 2026-09-25

## Why

The account page at `/profile` is carried in development and staging behind
its own gate, and the app offers Profile first in the account menu there. The
pages proposed never offering Profile on the premise that no such page
exists. Product now settles one Profile rule (Q1), and the pages, the
contracts, the app and the stories follow it.

**Metric:** None - a fixed composition, held by the account-menu stories and
a page-shell case.

## What Changes

- **Profile in the menu** - auction launch stays My Auctions and Sign Out;
  once Store answers, My Orders, My Auctions and Sign Out. As proposed,
  the menu never offers Profile, even where the account page is carried. If
  Q1 keeps Profile wherever the account page is carried, the change still
  lands the rest: no item whose page the site withholds, Membership out of
  the requirements until Q5, and the account page's Sign Out stated once.
- **Contract wording** - `grade10-site/site/page-shell` drops "where the
  profile is carried, Profile joins first" and keeps the account page's own
  Sign Out. `shared/ui/site-chrome` keeps optional `onProfile`; its feature
  set lists the account menu's items in their fixed order, and its
  handler-gated line names search, account, cart, Profile, My Orders and
  Membership.
- **Second orders item** - `SiteHeader` drops `onOrders` and `copy.orders`,
  and `grade10-site/auction/auction-orders` drops its account-menu link: the
  menu entry was decided away, and no consumer supplies it (Q10, Q11).
- **Storybook** - the Auction & Store account-menu story that showed Profile
  was dropped in b7c281e81; Q7 asks which items the story shows once Q1 and
  Q5 are answered.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/site/page-shell`: the account menu offers no item whose page
  the site withholds, and Profile follows Q1; the account page keeps its Sign
  Out.
- `shared/ui/site-chrome`: the account menu offers no item beyond its five;
  the requirement stays handler-gated.
- `grade10-site/auction/auction-orders`: the list's requirement drops the
  account-menu link; its scenarios carry over unchanged.

## Impact

- `apps/frontend/grade10`: `src/chrome/SiteShell.tsx:156-157` stops supplying
  `onProfile`; `src/chrome/SiteShell.test.tsx:499-560` and
  `src/store-shut.test.tsx:121` stop asserting Profile. The zzz app has its
  own header and supplies no `onProfile`, so it is unaffected.
- `packages/ui` (`@grade10/ui`): `SiteHeaderProps` loses `onOrders` and
  `SiteHeaderCopy` loses `orders`, with their render path. Grade10 supplies
  neither since `05cb3fefa4`, and zzz renders its own header, so no consumer
  adapts.
- Manual pages: [Page Shell · Account Menu](../../../docs/prds/products/grade10-site/site/page-shell.md#account-menu),
  [Site Header and Footer · Account Entry](../../../docs/prds/products/shared/ui/site-chrome.md#account-entry)
  and [Post-Bidding · My Auction Orders](../../../docs/prds/products/grade10-site/auction/post-bidding.md#my-auction-orders).
- `nav-cart-count-badge`: its deltas keep only the feature-set lines they
  change (Q12).

## Open questions

- **Q1** - Profile wherever the account page is carried, or never. Owed by
  Product; acceptance waits on it.
- **Q5** - Membership by the same rule. Owed by Product.
- **Q6** - the account label without an avatar when no email is supplied.
  Owed by the designer (@tangconst).
- **Q7** - which items the Auction & Store account-menu story shows once Q1
  and Q5 are answered. Owed by the designer (@tangconst).
- **Q13** - whether My Auctions links to My Auction Orders. Owed by Product.

## References

- [Page Shell · Account Menu](../../../docs/prds/products/grade10-site/site/page-shell.md#account-menu)
- [Site Header and Footer · Account Entry](../../../docs/prds/products/shared/ui/site-chrome.md#account-entry)
- [Post-Bidding · My Auction Orders](../../../docs/prds/products/grade10-site/auction/post-bidding.md#my-auction-orders)
- [Carried Surfaces](../../../docs/prds/products/grade10-site/site/carried-surfaces.md)
- `openspec/changes/archive/2026-09-21-hide-profile-until-launch/decisions.md`, Q5 - the handler-gated Profile rule this change would reverse
- `openspec/changes/archive/2026-09-22-launch-account-menu-composition/decisions.md`, Q7 - no My Auction Orders item in the account menu

## Follow-on changes

- `add-account-profile` - opens the account page on the public lanes.
