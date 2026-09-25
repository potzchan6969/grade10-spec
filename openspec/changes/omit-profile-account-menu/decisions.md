## Goals

- A signed-in collector on auction launch or once Store answers never sees a
  Profile item in the account menu — there is no Profile page.
- `shared/ui/site-chrome` and `grade10-site/site/page-shell` name the same
  launch compositions the Storybook Auction first and Auction & Store
  account-menu stories lock, with no Profile destination.
- Optional `onProfile` stays on `SiteHeader` so a later page can wire a menu
  item without a component rewrite.

## Non-Goals

- Building, pausing, or renaming a Profile / account page —
  Account, Profile, and `add-account-profile` stay future page work with no
  plan today.
- Removing `onProfile` or `copy.profile` from `SiteHeader` so Profile could
  never appear even for a future caller.
- Renaming `/profile/orders` or changing My Orders gating.
- Settling Membership's destination, Cart, Help, or compact-drawer behavior.
- Changing sign-out on a future account page — that page owns it when it
  exists.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Is Profile absent only while a gate is off, or because there is no Profile page? | Absent because there is no Profile page — on auction launch and once Store answers alike. A page later is possible but unplanned. | Keeping “joins once the `profile` gate opens / once carried” as the lasting rule — rejected: that implies a planned Profile destination Grade10 does not have. |
| Q2 | Remove `onProfile` from the component, or keep it optional? | Keep optional `onProfile` on `SiteHeader`; Grade10 does not supply it. A later change that ships a page may pass the handler. | Deleting the prop and render path so Profile could never return — rejected: rules out a future page without buying clarity for collectors today. |
| Q3 | Does this change touch Account / Profile manual pages or `add-account-profile`? | No. Those stay future work; this change only corrects the account-menu contract. | Extending or superseding `add-account-profile`, or marking Account/Profile pages out of product — rejected: page work is separate from chrome launch composition. |
| Q4 | Does `/profile/orders` imply a Profile page in the menu? | No. My Orders keeps that path; the path name is not a Profile menu destination. | Dropping or renaming My Orders because the path contains `profile` — rejected: order history already answers; the menu item is My Orders. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
