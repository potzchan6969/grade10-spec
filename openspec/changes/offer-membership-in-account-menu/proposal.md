**Author:** @seankcw - 2026-10-30

## Why

A signed-in collector on a lane that carries the membership page has no way
to it from the header: the account menu, the one route that stays put on every
surface, offers Profile, My Orders and My Auctions but not Membership, so the
page is reached only by its address. The shared header has drawn Membership
right after Profile since 2026-10-27, while the record still places it after
My Auctions and says a later change offers it. This is that change.

**Metric:** the share of signed-in collectors on a carrying lane who open the
membership page in a week, up from the few who type its address.

## What Changes

- **Membership in the account menu** - signed in, the menu offers Membership
  wherever the site carries the membership page, and it opens that page; a lane
  that withholds the page still offers no Membership -
  [Page Shell · Account Menu](../../../docs/prds/products/grade10-site/site/page-shell.md#account-menu)
- **Its place** - right after Profile and ahead of My Orders, so the menu reads
  Profile, Membership, My Orders, My Auctions, Sign Out, each gated item
  omitted on its own; where the account page is withheld, the menu opens on
  Membership
- **The shared header's order** - `SiteHeader`'s fixed account-menu order names
  the order it already draws -
  [Site Header and Footer · Account Entry](../../../docs/prds/products/shared/ui/site-chrome.md#account-entry)

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/site/page-shell`: the account menu offers Membership right
  after Profile wherever the membership page is carried, and Membership opens
  that page
- `shared/ui/site-chrome`: `SiteHeader`'s fixed account-menu order puts
  Membership right after Profile, ahead of My Orders

## Impact

- **`@grade10/ui` `SiteHeader`** - no export changes. The component and its
  `WithProfile` story have drawn this order since `efc781e5a`; only the
  contract moves.
- **grade10 site** - `SiteShell` supplies `copy.membership` and `onMembership`
  where the build carries the membership page.
- **ZZZ site** - unaffected; it supplies no Membership.
- **Overlap** - `restrict-auctions-by-region` modifies the same `SiteHeader`
  requirement, so this change depends on it.
