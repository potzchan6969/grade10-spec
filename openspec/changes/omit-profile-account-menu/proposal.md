**Author:** @tangconst - 2026-09-25

## Why

A signed-in collector on auction launch or once Store answers never reaches a
Profile page — there is none — yet the chrome and page-shell contracts still
say Profile joins the account menu once carried. Storybook and specs that
name that destination disagree with the menu the collector actually gets.

**Metric:** share of signed-in account-menu sessions whose item set matches
the launch composition with no Profile item, against sessions or stories that
still list Profile.

## What Changes

- **No Profile in the menu** — auction launch stays My Auctions and Sign Out;
  once Store answers, My Orders, My Auctions, Membership, and Sign Out. The
  menu never offers Profile on either composition.
- **Contract wording** — `shared/ui/site-chrome` and `grade10-site/site/page-shell`
  stop saying Profile joins once carried or once a `profile` gate opens.
  Optional `onProfile` stays on `SiteHeader` for a later page if one ships.
- **Storybook** — the Auction & Store account-menu story that showed Profile
  when `onProfile` was supplied is removed; the open menu story already
  asserts no Profile item.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `shared/ui/site-chrome`: account-menu order and scenarios without Profile as
  a Grade10 launch destination; optional `onProfile` remains for a future
  caller.
- `grade10-site/site/page-shell`: account-menu destinations never include
  Profile while there is no Profile page.

## Impact

- `packages/ui` (`@grade10/ui`): Storybook under
  `Site Chrome/SiteHeader/Auction & Store/Account menu` — drop the with-Profile
  story; Open story remains the SoT.
- `apps/frontend/grade10`: no new wiring — Grade10 already omits `onProfile`
  for launch; this change stops the specs claiming it will return with a gate.
- Manual pages: [Page Shell · Account Menu](../../../docs/prds/products/grade10-site/site/page-shell.md#account-menu)
  and [Site Header and Footer · Account Entry](../../../docs/prds/products/shared/ui/site-chrome.md#account-entry).

## Open questions

None. A Profile page later is unplanned and stays with Account / Profile and
`add-account-profile`, not this change.

## References

- [Page Shell · Account Menu](../../../docs/prds/products/grade10-site/site/page-shell.md#account-menu)
- [Site Header and Footer · Account Entry](../../../docs/prds/products/shared/ui/site-chrome.md#account-entry)

## Follow-on changes

- A Profile page, if Product plans one, can reintroduce a menu item through
  optional `onProfile` without rewriting the header's export shape.
