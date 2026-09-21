## Goals

- A signed-in collector on auction launch sees only the destinations that
  answer: their email, My Auctions, and Sign Out — no Profile, My Orders,
  Membership, or Cart.
- A signed-in collector once Store answers reaches My Orders, My Auctions,
  and Membership from the same menu, with Cart in the bar and Sign Out last.
- `shared/ui/site-chrome` and `grade10-site/site/page-shell` state the same
  launch compositions the Storybook Auction first and Auction & Store
  account-menu stories lock.

## Non-Goals

- Settling Membership's destination — remains ❓; this change only places the
  item once Store answers and gates it on `onMembership` + copy.
- Opening or changing `/membership` or `/join` lanes —
  `hide-membership-until-launch` owns that gate; this change does not reverse
  it or point the menu at a withheld address.
- Finishing or reopening the profile surface — `add-account-profile` and the
  carried-surfaces gate own that; this change only keeps Profile out of the
  launch menus.
- Changing Cart count badge, Help, language, or compact-drawer behavior.
- Keeping a separate My Auction Orders account-menu entry — winners reach
  their order from My Auctions; `add-my-auction-orders` should follow that
  entrance rather than a second chrome link

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Does Profile stay handler-gated (join when the profile is carried), or stay out of both launch menus? | Out of both auction and store launch menus. Grade10 does not supply `onProfile` for these compositions. `onProfile` may remain on the export for a later reopen. Supersedes the durable reading that Profile joins first whenever its handler is present. | Keeping Profile first once `/profile` is carried again in this same change — rejected: profile is still mid-build and the product ask is launch menus without Profile. |
| Q2 | When does Membership join the menu? | Once Store answers, after My Auctions, handler-gated on `onMembership` and `copy.membership`, same pattern as My Orders. Destination deferred (❓). | Always showing Membership on auction launch — rejected: auction-first has no membership destination answering. Listing it without a handler — rejected: dead control. |
| Q3 | Can Membership open `/membership` while that address is withheld? | No. Do not wire the item to a withheld membership address. Leave destination ❓ until Product settles it and the membership gate reopens or another surface answers. | Wiring to `/membership` now for symmetry with My Orders → `/profile/orders` — rejected: conflicts with `hide-membership-until-launch`. |
| Q4 | How does the menu identify the signed-in collector? | Show `accountEmail` above the items, with the same small (`xs`) initial avatar the bidding panel uses for that address. Fall back to `copy.accountMenuLabel` when no email is supplied. | Keeping a bare "Account" heading with no email — rejected: product direction shows the sign-in email. Inventing a display name — rejected: only the sign-in email is confirmed. |
| Q5 | Sign Out casing? | Title Case "Sign Out" in English chrome and stories. | "Sign out" sentence case — rejected: product direction is Title Case to match other menu labels. |
| Q6 | Extend `hide-profile-until-launch` or `hide-membership-until-launch`? | Neither. Profile gate is archived; membership change only gates `/membership` and `/join` and explicitly left chrome alone. Open a new change for menu composition. | Extending `hide-membership-until-launch` to add a Membership menu item — rejected: that change's non-goals and impact say SiteHeader is unaffected. Reopening the archived profile change — rejected: archive already folded; new outcomes need a new delta. |
| Q7 | Does the account menu offer My Auction Orders (`onOrders`)? | No. A winner opens their order from My Auctions; a second account-menu entry is redundant. Auction-first Storybook drops the "Account menu with auction orders" story. `onOrders` may remain on the export until `add-my-auction-orders` drops its account-menu requirement. | Keeping an optional My Auction Orders menu item beside My Auctions — rejected: the Won path on My Auctions already reaches the order. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| | | |
