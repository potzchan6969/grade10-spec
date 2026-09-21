## Context

`SiteHeader` (`packages/ui/src/blocks/site-chrome/site-header.tsx`) already carries
most of this change's shape: `accountEmail`, `onMembership` / `copy.membership`,
and the fixed My Orders → My Auctions → Membership → Sign Out ordering are
implemented, and Storybook (`site-header.story-shared.tsx`,
`site-header.auction-store.story-shared.tsx`) already fixtures the new
copy (`myAuctions`, `membership`, Title Case `signOut`) and never supplies
`onProfile`. That is why every current story passes today without any of this
change's spec deltas landing — the stories simply never exercise the path the
deltas close off.

**One real gap survives:** `site-header.tsx` still renders a Profile
`DropdownMenuItem` whenever `onProfile != null` (lines 179–181). No shipped
consumer currently supplies `onProfile`, so the gap is latent, not visible —
but `shared-ui-site-chrome-SC-32` requires Profile to stay off the menu
**even when `onProfile` is supplied**, which is a stronger, structural
guarantee than "nobody happens to pass it." Fixing the component, not just
the callers, is what the spec asks for.

## Goals / Non-Goals

**Goals:**
- Make `SiteHeader` structurally incapable of rendering Profile, independent
  of whether `onProfile` is supplied.
- Close the English `signOut` and Membership label catalog gaps so a
  consuming app has real copy to wire.
- Bring `apps/preview`'s two `SiteHeader` fixtures off the durable contract
  and onto this one, so the workbench keeps demonstrating what ships.

**Non-Goals:**
- Wiring `onMembership` or `accountEmail` in `apps/frontend/grade10`'s
  `SiteShell` — that is this change's own delivery work, tracked below, but
  choosing Membership's destination is not: it stays unwired until Product
  settles it (see `decisions.md` Q3).
- Removing `onProfile` or `onOrders` from `SiteHeaderProps` — both stay on
  the export per `decisions.md` Q1 and Q7, for a reopen neither is this
  change's job to schedule.
- Non-English Sign Out casing — Q5 scopes Title Case to English chrome only;
  ko/zh-Hans/zh-Hant `signOut` values are untouched.

## Decisions

- **Delete the Profile branch rather than gate it further.** The spec
  (`grade10-site-site-page-shell` and `shared/ui/site-chrome` requirements)
  already state Profile is never offered by this menu. Keeping the
  `onProfile != null` render branch and simply never calling it from
  Grade10 would satisfy every current story but not the contract: a future
  caller supplying `onProfile` would silently reopen Profile with no test
  catching it. Removing the JSX (`onProfile` stays a typed, accepted, unused
  prop) makes the guarantee structural instead of a convention nobody
  enforces.
- **`accountEmail` in `apps/preview` reuses the bidding-panel address.**
  `auction-lot-details-content.ts` already threads `VIEWER_INITIALS =
  "john@example.com"` into the bidding panel's avatar; the header fixture
  reuses the same constant rather than inventing a second fixture address,
  matching decisions.md Q4's "same small (`xs`) initial avatar the bidding
  panel uses for that address."
- **Membership's label lives in the Grade10 brand catalog, not `shared/`.**
  `myOrders` already sits in `packages/i18n/messages/grade10/<locale>/chrome.json`
  rather than `shared/`, because "My Orders" names a Grade10-specific surface.
  Membership's label follows the same placement for the same reason;
  `signOut` stays in `shared/en/common.json` since it is a platform-wide verb,
  unaffected by this change's placement, only its English casing.
- **No `apps/preview` change offers Membership or My Orders.** Both preview
  fixtures predate this change without wiring either handler, and neither
  capability's delta requires the workbench to demonstrate every launch
  composition. Rewiring that is a `preview-design` decision, not a
  consequence of this delta, and is left alone to keep this change's diff to
  what its scenarios require.

## Risks / Trade-offs

- **[Risk]** Removing the Profile branch is a breaking change for any other
  future caller that still expects `onProfile` to render an item.
  **Mitigation:** the proposal already marks the contract **BREAKING** for
  readers of the durable requirement; `onProfile` staying on the type (typed,
  documented as inert here) is the signal a future reopen needs, rather than
  a silent behavior change on an unchanged prop shape.
- **[Risk]** No story currently exercises "`onProfile` supplied, Profile
  still absent," so a regression reintroducing the branch would ship
  undetected. **Mitigation:** task 1 below adds that assertion to
  `site-header.auction-store.account.stories.tsx`'s `Open` story rather than
  leaving the guarantee untested.

## Migration Plan

1. Land the `grade10-spec` group's tasks and push `main` there.
2. Bump `external/grade10-spec` in `grade10` to that commit.
3. Land the `grade10` group's tasks against the bumped submodule.

No data migration; no rollback beyond reverting the submodule bump, since
nothing here is stateful.
