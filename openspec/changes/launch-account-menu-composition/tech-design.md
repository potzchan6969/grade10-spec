## Context

`SiteHeader` (`packages/ui/src/blocks/site-chrome/site-header.tsx`) already
implements this change's whole component contract: `accountEmail` + avatar
with the `copy.accountMenuLabel` fallback, Profile handler-gated and joining
first, My Orders handler-gated ahead of My Auctions, Membership gated on
*both* `onMembership` and `copy.membership` and joining after My Auctions,
and Sign Out last. Its doc comment already states this order correctly. No
component code changes land in this change.

What is missing is narrower: the English `signOut` catalog entry is still
sentence case, no Membership label exists yet in the Grade10 brand catalog,
and `apps/preview`'s two `SiteHeader` fixtures predate `accountEmail` and
still carry the stale casing. Every Storybook story that exists today also
happens to omit `onProfile`, so nothing currently exercises the
Profile-first composition automatically — that is a real coverage gap, even
though the behavior itself is already correct.

## Goals / Non-Goals

**Goals:**
- Close the English `signOut` and Membership label catalog gaps so a
  consuming app has real copy to wire.
- Bring `apps/preview`'s two `SiteHeader` fixtures onto this change's copy
  and `accountEmail` (they already wire `onProfile` correctly).
- Add the one Storybook assertion this change's contract lacks: the
  Profile-first composition, so a future regression there is caught.

**Non-Goals:**
- Any change to `site-header.tsx`'s render logic — Profile, My Orders, and
  Membership gating are already correct.
- Wiring `onMembership` or `accountEmail` in `apps/frontend/grade10`'s
  `SiteShell` — `accountEmail` is this change's own delivery work, tracked
  below; Membership's destination stays unwired until Product settles it
  (`decisions.md` Q3).
- Changing `onProfile` wiring in `apps/frontend/grade10` — it already
  follows the `profile` build gate (`gates.profile`), which is exactly the
  mechanism `decisions.md` Q1 keeps.
- Non-English Sign Out casing — Q5 scopes Title Case to English chrome only;
  ko/zh-Hans/zh-Hant `signOut` values are untouched.

## Decisions

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
- **The Profile-first story is additive, not a fix.** Rather than editing an
  existing story's args (which would change what every other assertion in
  that story exercises), the coverage gap is closed with its own story or
  its own `play` block, keeping the "no optional handlers" and "every
  handler supplied" compositions each testable in isolation.

## Risks / Trade-offs

- **[Risk]** No story today exercises `onProfile` at all, so a regression to
  the Profile-first ordering would ship undetected. **Mitigation:** task 1
  below adds that coverage rather than leaving the guarantee untested.

## Migration Plan

1. Land the `grade10-spec` group's tasks and push `main` there.
2. Bump `external/grade10-spec` in `grade10` to that commit.
3. Land the `grade10` group's tasks against the bumped submodule.

No data migration; no rollback beyond reverting the submodule bump, since
nothing here is stateful.
