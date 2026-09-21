**Author:** @seankcw - 2026-09-21

## Why

Every build of the site carries `/membership` and `/join` today, but the
loyalty programme behind them is still mid-build: the wallet card's own PRD
records both issuers' credentials as pending (`docs/prds/products/grade10-site/loyalty/wallet-member-card.md`
- "Issuer account, class and key pending" for Google and Apple alike), the
member-card section itself is written to answer "not switched on" for a
brand with no minter gateway configured yet, expiry reminders are recorded
internally with no channel yet built to tell a member (`add-point-expiry-reminders`),
and the join flow the page links to is a standing removal the code has not
caught up with yet (`docs/prds/products/grade10-site/loyalty/profile.md`,
the `@ecchochan` callout on `/join`). A collector on `grade10.com` reaches a
membership page whose central action may silently do nothing and a join
form the product has already decided to retire.

**Metric:** `/membership` and `/join` requests the public lanes answer with
not-found. Expected to rise from zero the day this ships, and fall back
toward zero once the loyalty programme is ready to open.

## What Changes

- **Membership joins the waiting products.** `/membership` and `/join` are
  carried in development and staging, and on no lane the public reaches -
  the same rule that already withholds the store, the vault and booking a
  visit. **BREAKING**: reverses the carried-surfaces PRD's decision that "the
  loyalty pages stay" - carried everywhere.
- **An uncarried `/membership` or `/join` is not found** - a public lane
  answers the not-found surface and a 404 at either address, the same as any
  other withheld address
- **Nothing else moves.** Neither page is reached from the header, the
  footer, the account menu or the front door today - both are reached only
  by a direct link, a push notification, or the pages' own two links to each
  other - so no chrome, no `SiteHeader` contract and no other surface's
  in-app link needs a change. `/bids` and sign-in are untouched.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `grade10-site/site/carried-surfaces`: membership joins the store, the
  vault, booking and the profile as a fifth product that waits for its own
  launch

## Impact

- **`apps/frontend/grade10`** - `src/surfaces.ts` gains a `membership` gate,
  set on both the `membership` and `join` entries; `src/routes.ts`,
  `react-router.config.ts`, `scripts/check-public-pages.mjs` and every
  exhaustive `Gates` literal in the test suites withhold the pair the same
  way they already withhold the store, the vault and booking
- **`packages/ui`** (`@grade10/ui`) - unaffected; `SiteHeader` names no
  membership or join entry today
- **Staging and development** - unchanged; both pages answer exactly as they
  do today
- **The push notification path** (`src/serving/pushNotification.ts`) that
  addresses a notice at `ROUTES.membership` - see decisions.md Q4

## Follow-on changes

- Open membership: production and preview start carrying it again, once the
  loyalty programme is ready
- Retire `/join` in code, per the standing removal decision already recorded
  on the membership PRD

## References

- [Carried Surfaces](../../../docs/prds/products/grade10-site/site/carried-surfaces.md#what-each-lane-carries)
- [Profile · Member Card](../../../docs/prds/products/grade10-site/loyalty/profile.md#member-card)
- [Wallet Member Card](../../../docs/prds/products/grade10-site/loyalty/wallet-member-card.md)
