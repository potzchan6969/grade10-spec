**Author:** @constancetang - 2026-09-21

## Why

A signed-in collector opening the account menu still meets a contract written
before Membership existed and before the sign-in email had a place above the
items. Auction-first and Store-launch product direction already differs —
auction shows email, My Auctions, and Sign Out; Store adds My Orders,
Membership, and Cart in the bar — so the menu the collector sees and the
specs that name it disagree. Profile itself is unaffected: it stays
handler-gated exactly as today, and simply does not appear while the
`profile` build gate is off.

**Metric:** share of signed-in header sessions whose account-menu item set
matches the active launch composition (auction vs store), against sessions
that still omit the launch items the PRD names.

## What Changes

- **Auction-launch menu** — signed in, the menu shows the sign-in email with
  its small initial avatar above My Auctions and Sign Out. It does not list
  My Orders or Membership, and Cart stays out of the bar until Store answers.
  Profile joins first, ahead of My Orders, wherever `onProfile` is supplied —
  unchanged from today, and off while the `profile` build gate is off.
- **Store-launch menu** — once Store answers, Cart joins the bar; the menu
  lists My Orders, My Auctions, Membership, and Sign Out, with Profile still
  joining first wherever it is carried. Membership's destination remains
  unconfirmed (❓ on the PRD).
- **Sign Out label** — English chrome uses Title Case "Sign Out".
- **`SiteHeader` contract** — gains optional `accountEmail`, `onMembership`,
  and `copy.membership`; `onProfile` keeps working exactly as today, and
  Grade10's launch compositions do not supply it while the `profile` build
  gate is off.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `shared/ui/site-chrome`: `SiteHeader` account-menu export contract matches
  auction and store launch compositions — email and avatar, Membership
  handler-gated like My Orders, Profile unchanged (handler-gated, joins
  first).
- `grade10-site/site/page-shell`: account-menu destinations and order for
  auction vs store launch; Membership listed once Store answers with
  destination still open; Profile's place in the order is unchanged.

## Impact

- `packages/ui` (`@grade10/ui`): `SiteHeader` props, account-menu markup, and
  Storybook under `Site Chrome/SiteHeader/Auction first` (auction launch) and
  `Site Chrome/SiteHeader/Auction & Store` — Account menu, Cart count, and
  Surfaces (store launch with Cart and Membership).
- `apps/frontend/grade10`: `SiteShell` wiring — supply `accountEmail`; supply
  Membership only once Store answers and a destination is chosen. `onProfile`
  wiring is untouched — it already follows the `profile` build gate.
- Grade10 chrome catalogs: `signOut` Title Case; Membership label when the
  store composition ships.

## Open questions

- **Membership destination** — who settles where Membership opens once Store
  answers? Product owns it; recorded as ❓ on the page-shell and site-chrome
  PRDs. Do not wire the item to `/membership` while
  `hide-membership-until-launch` withholds that address.

## References

- [Page Shell · Account Menu](../../../docs/prds/products/grade10-site/site/page-shell.md#account-menu)
- [Site Header and Footer · Account Entry](../../../docs/prds/products/shared/ui/site-chrome.md#account-entry)

## Follow-on changes

- Confirm Membership's destination and wire `onMembership` once that surface
  answers.
- Align `add-my-auction-orders` so entry is My Auctions only, not a second
  account-menu link.
