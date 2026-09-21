**Author:** @constancetang - 2026-09-21

## Why

A signed-in collector opening the account menu still meets a contract written
for a profile-led shell: durable specs put Profile first, omit Membership,
and say nothing about the sign-in email above the items. Auction-first and
Store-launch product direction already differs — Profile stays out; auction
shows email, My Auctions, and Sign Out; Store adds My Orders, Membership, and
Cart in the bar — so the menu the collector sees and the specs that name it
disagree.

**Metric:** share of signed-in header sessions whose account-menu item set
matches the active launch composition (auction vs store), against sessions
that still expose Profile or omit the launch items the PRD names.

## What Changes

- **Auction-launch menu** — signed in, the menu shows the sign-in email with
  its small initial avatar above My Auctions and Sign Out. It does not list
  Profile, My Orders, or Membership, and Cart stays out of the bar until
  Store answers.
- **Store-launch menu** — once Store answers, Cart joins the bar; the menu
  lists My Orders, My Auctions, Membership, and Sign Out. Profile stays out.
  Membership's destination remains unconfirmed (❓ on the PRD).
- **Sign Out label** — English chrome uses Title Case "Sign Out".
- **`SiteHeader` contract** — gains optional `accountEmail`, `onMembership`,
  and `copy.membership`; keeps `onProfile` optional for a later reopen, but
  Grade10's launch compositions do not supply it. **BREAKING** for readers of
  the durable page-shell and site-chrome requirements that still put Profile
  first whenever its handler is present.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `shared/ui/site-chrome`: `SiteHeader` account-menu export contract matches
  auction and store launch compositions — email and avatar, Membership
  handler-gated like My Orders, Profile not part of either launch set.
- `grade10-site/site/page-shell`: account-menu destinations and order for
  auction vs store launch; Profile omitted; Membership listed once Store
  answers with destination still open.

## Impact

- `packages/ui` (`@grade10/ui`): `SiteHeader` props, account-menu markup, and
  Storybook under `Site Chrome/SiteHeader/Auction first` (auction launch) and
  `Site Chrome/SiteHeader/Auction & Store` — Account menu, Cart count, and
  Surfaces (store launch with Cart and Membership).
- `apps/frontend/grade10`: `SiteShell` wiring — omit `onProfile` for these
  launches; supply `accountEmail`; supply Membership only once Store answers
  and a destination is chosen.
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
- Reopen Profile in the menu only when the profile surface is ready to carry
  again — a separate change, not this one.
- Align `add-my-auction-orders` so entry is My Auctions only, not a second
  account-menu link.
