**Author:** @tangconst - 2026-09-25

## Why

The account page at `/profile` is carried behind its own gate on the lanes
[Carried Surfaces](../../../docs/prds/products/grade10-site/site/carried-surfaces.md)
lists, and the app offers Profile first in the account menu there. The
pages proposed never offering Profile on the premise that no such page
exists. Product settles that Profile joins first wherever the account page is
carried (Q1), and the pages, the contracts, the app's tests and the stories
follow it.

**Metric:** None - a fixed composition, held by the account-menu stories and
a page-shell case.

## What Changes

- **Profile in the menu** - first wherever the account page is carried (Q1).
- **Account menu** - auction launch stays My Auctions and Sign Out; once
  Store answers, My Orders joins before My Auctions. The menu offers no item
  whose page the site withholds. Membership follows its page by Profile's
  rule (Q5); a later change offers it, so the page-shell requirement keeps
  only its withheld-page rule. The account page's Sign Out is stated once.
- **Contract wording** - `grade10-site/site/page-shell` replaces its menu
  requirement: Profile joins first wherever the account page is carried, and
  the account page's own Sign Out stays with the account control. Its
  current-surface scenario says "the account page", as Page Shell does.
  `shared/ui/site-chrome` keeps optional `onProfile` and states the avatar
  above the email, and the label alone with no avatar when no email is
  supplied (Q6); its feature set lists
  the account menu's items in their fixed order, and its handler-gated line
  names search, account, cart, Profile, My Orders and Membership, and the
  account and cart slots.
- **Second orders item** - `SiteHeader` drops `onOrders` and `copy.orders`,
  and `grade10-site/auction/auction-orders` drops its account-menu link: the
  menu entry was decided away, and no consumer supplies it (Q10, Q11).
- **Storybook** - the Auction & Store `WithProfile` story, dropped in
  b7c281e81, returns with every handler supplied and shows the full order;
  `Open` supplies no Membership (Q7).

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/site/page-shell`: the account menu offers no item whose page
  the site withholds, and Profile joins first wherever the account page is
  carried; the account page keeps its Sign Out. The current-surface scenario
  names the account page.
- `shared/ui/site-chrome`: the account menu offers no item beyond its five;
  the requirement stays handler-gated.
- `grade10-site/auction/auction-orders`: the list's requirement drops the
  account-menu link; its scenarios carry over unchanged.

## Impact

- `apps/frontend/grade10`: tests alone; `src/chrome/SiteShell.tsx:156-158`
  already supplies `onProfile` from the profile gate. The Profile assertions
  in `src/chrome/SiteShell.test.tsx:499-560` and `src/store-shut.test.tsx:121`
  move to the Profile scenarios. The zzz app has its own header and
  supplies no `onProfile`, so it is unaffected.
- `packages/ui` (`@grade10/ui`): `SiteHeaderProps` loses `onOrders` and
  `SiteHeaderCopy` loses `orders`, with their render path. Grade10 supplies
  neither since `05cb3fefa4`, and zzz renders its own header, so no consumer
  adapts. The Auction & Store account-menu stories gain `WithProfile` and
  drop Membership from `Open`.
- Manual pages: [Page Shell · Account Menu](../../../docs/prds/products/grade10-site/site/page-shell.md#account-menu),
  [Site Header and Footer · Account Entry](../../../docs/prds/products/shared/ui/site-chrome.md#account-entry)
  and [Post-Bidding · My Auction Orders](../../../docs/prds/products/grade10-site/auction/post-bidding.md#my-auction-orders).
- Durable suites: acceptance strikes by hand the `## Settled` lines this
  change makes false, because the fold has no rule that removes a Settled
  line. In `grade10-site/site/page-shell`, the line that reads "plus Profile
  once carried, My Orders and Membership once Store answers", and the line
  that opens "The account menu's item order under every combination of
  {Profile carried, Store answers}"; this change's own Settled line on the
  menu holds neither. In `shared/ui/site-chrome`: "`onOrders` ("My Auction
  Orders") keeps its existing export contract ..." and "The small initial
  avatar sits above the account label, never beside it." Each suite's
  Reconciliation quotes its lines.
- `nav-cart-count-badge`: accepted before this change (`depends_on`), so
  its 'A control renders only when it can act' carries the cart slot this
  Handler-gated line names. Its own Handler-gated line names both slots, and
  this change's folds over it; neither change restates the other's other
  lines (Q12).

## Open questions

None.

## References

- [Page Shell · Account Menu](../../../docs/prds/products/grade10-site/site/page-shell.md#account-menu)
- [Site Header and Footer · Account Entry](../../../docs/prds/products/shared/ui/site-chrome.md#account-entry)
- [Post-Bidding · My Auction Orders](../../../docs/prds/products/grade10-site/auction/post-bidding.md#my-auction-orders)
- [Carried Surfaces](../../../docs/prds/products/grade10-site/site/carried-surfaces.md)
- `openspec/changes/archive/2026-09-21-hide-profile-until-launch/decisions.md`, Q5 - the handler-gated Profile rule this change keeps
- `openspec/changes/archive/2026-09-22-launch-account-menu-composition/decisions.md`, Q7 - no My Auction Orders item in the account menu

## Follow-on changes

- `add-account-profile` - opens the account page on the public lanes.
- draw-account-menu-and-profile - the designer confirms or redraws the
  no-email look and the account-menu stories (Q6, Q7).
- A change that supplies `onMembership` from the membership gate (Q5).
- A change that links My Auctions to My Auction Orders (Q13).
