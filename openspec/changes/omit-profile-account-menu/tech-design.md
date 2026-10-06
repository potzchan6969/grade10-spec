## Context

- **Account menu wiring** - grade10 `apps/frontend/grade10/src/chrome/SiteShell.tsx:156-162`
  supplies `onProfile` on `config.gates.profile`, `onMyOrders` on
  `config.gates.store` and `onMyAuctions` always. It supplies no
  `onMembership` and no `copy.membership`, so Membership never renders
- **Gates** - `src/surfaces.ts:343-399` `GATES`: development, staging and
  staging-2 carry `store`, `profile` and `membership`; uat and production
  carry `auction` alone
- **Signed-in email** - `src/root.tsx:367-368` derives `signedIn` and
  `accountEmail` from one session user, whose email is required
  (`packages/grade10-auth/backend/src/db/schema/index.ts:20`), so a signed-in
  collector always has one
- **Header** - `packages/ui/src/blocks/site-chrome/site-header.tsx:150-204`
  renders Profile, My Orders and Membership each only when supplied, in the
  fixed order; Membership also needs its copy. A sixth item follows
  Membership when `onOrders` and `copy.orders` are supplied (`:44-45`,
  `:81-82`, `:195-197`); no consumer supplies them since grade10 `05cb3fefa4`
- **My Auction Orders** - `SiteShell.tsx:155-171` supplies no orders item, and
  each Won row opens its own order (`src/pages/auctions/AccountAuctionRecordPage.tsx:449-453`)
- **Account page** - `src/routes/profile.tsx:38` passes `onSignOut` to
  `ProfilePage`, which renders Sign Out (`src/pages/profile/ProfilePage.tsx:107`)

Every settled page line already runs except the header's closed set. The
app's account-menu tests still assert Profile on every Store build and cite
scenarios this change rewrites.

## Goals / Non-Goals

**Goals:**

- Each account-menu test in grade10 asserts one scenario and drives its
  gate from the build's own gate set
- `SiteHeader` offers no item beyond its five
- One walk proves the menu on a Store lane and on the auction-launch lane

**Non-Goals:**

- Wiring Membership - Q5 decides it, and a later change supplies
  `onMembership` from `config.gates.membership`
- Any `SiteHeader` export but the second orders item: optional `onProfile`
  and required `copy.profile` stay

## Decisions

### The Settled Delta Needs No Application Code

[page-shell](specs/grade10-site/site/page-shell/spec.md) governs the menu's
composition and [site-chrome](specs/shared/ui/site-chrome/spec.md) the
header's gating. grade10 already meets both, so its settled work is tests
that pass on arrival and guard the wiring from here on. Only Q1's answer can
add a code line (below).

**Rejected:** a menu table in `SiteShell` mapping each item to its gate.
Three props with one ternary each say the same thing with no indirection.

### One Rule for Withheld Pages

The app keeps one mechanism for My Orders, Profile and Membership: a handler
is supplied only from its page's gate. `grade10-site-site-page-shell-SC-60`
pins the auction-launch menu exactly, since there every one of those pages is
withheld whatever Q1 and Q5 decide. On a Store build the scenarios assert
order relative to My Auctions and Sign Out, never a full list, so neither
open question moves them.

### The Menu Requirement Is Replaced

The OpenSpec CLI refuses a MODIFIED requirement that drops a scenario, and an
issued id is never reused, so the menu requirement is removed and added as
`Signed-in collectors open what the build carries from the account menu`,
with new scenario numbers. Each scenario the table carries keeps its trace
marker, at revision 2 where its meaning moved and at revision 1 where the
table calls it unchanged. The app's citations move with them (task 2.1 to 2.4).

| Retired | Becomes |
| --- | --- |
| `grade10-site-site-page-shell-SC-17` | `grade10-site-site-page-shell-SC-56`: My Orders before My Auctions, Sign Out last, no KYC or My Auction Orders; no Profile, no full list |
| `grade10-site-site-page-shell-SC-18` | `grade10-site-site-page-shell-SC-57`, without the account-page line, which `grade10-site-site-page-shell-SC-08` holds |
| `grade10-site-site-page-shell-SC-27` | `grade10-site-site-page-shell-SC-58`, without Profile |
| `grade10-site-site-page-shell-SC-28` | `grade10-site-site-page-shell-SC-59`, on the account page being withheld |
| `grade10-site-site-page-shell-SC-29` | `grade10-site-site-page-shell-SC-60`, the exact auction-launch menu |
| `grade10-site-site-page-shell-SC-30`, `grade10-site-site-page-shell-SC-33` | `grade10-site-site-page-shell-SC-61`, `grade10-site-site-page-shell-SC-62`, unchanged in meaning |
| `grade10-site-site-page-shell-SC-31` | Nothing: the site always has the email (Context), so the label fallback is `SiteHeader`'s alone, held by `shared-ui-site-chrome-SC-35` |
| `grade10-site-site-page-shell-SC-32`, `grade10-site-site-page-shell-SC-34` | Nothing: Membership's place is ❓ (Q5) and the app never offered it; `grade10-site-site-page-shell-SC-63` keeps the settled half, no Membership where its page is withheld |
| None | `grade10-site-site-page-shell-SC-64` and `grade10-site-site-page-shell-SC-65`, the My Orders and My Auctions destinations the old requirement stated without a scenario |

Account-page Sign Out lives only in `The account control leads where the
collector can go` (`grade10-site-site-page-shell-SC-08`); the new menu
requirement has no **Profile sign-out** clause.

### SiteHeader Drops Its Second Orders Item

`onOrders` and `copy.orders` come off `SiteHeaderProps` and `SiteHeaderCopy`
with their render path and docstring, so the five items are the whole set
(`shared-ui-site-chrome-SC-17`). A type test holds the props closed
(`shared-ui-site-chrome-SC-42`), so a later re-addition fails `typecheck`
rather than waiting on a story. No consumer adapts: grade10 supplies
neither, and zzz renders its own header.

`shared-ui-site-chrome-SC-39` drops its withheld-address line: `SiteHeader`
never routes, which **No application state** already requires.

**Rejected:** naming a sixth item in the fixed order. It keeps a prop for a
destination no product offers.

### My Auction Orders Leaves the Menu Contract

The `grade10-site/auction/auction-orders` delta drops the account-menu
sentence from `The list holds one row per won order`; its four scenarios
carry over with their trace markers. The app offers no such item, so this is
contract only.

### Profile Follows Q1

Acceptance waits on Q1. Either answer adds a clause and a scenario to the
page-shell delta; group 3 carries the matching row.

| Q1 answer | page-shell delta adds | grade10 |
| --- | --- | --- |
| **Wherever carried** | **The menu**: "Where the site carries the account page, Profile SHALL join first"; **Each item**: "Activating Profile SHALL take them to the account page"; a scenario for each | No code; tests assert Profile first with `profile` open and keep the `ROUTES.profile` destination assertion |
| **Never** | **Withheld pages** becomes "The menu SHALL NOT offer Profile"; `grade10-site-site-page-shell-SC-59` widens to every build | Delete `onProfile` at `SiteShell.tsx:156-158`; tests assert no Profile with `profile` open |

## Risks / Trade-offs

- **[Risk] Tests that pass on arrival prove nothing about a regression** →
  Mitigation: each withheld-page test drives its gate through
  `withGateOverride`, so supplying a handler outside its gate fails it
- **[Risk] A later change supplies `onMembership` on every build** →
  Mitigation: the `grade10-site-site-page-shell-SC-63` test runs with
  `membership` shut and `store` open
- **[Risk] The walk breaks when Q5 adds Membership on a Store lane** →
  Mitigation: the walk reads the lane's gates from `gatesFor`, asserts order
  relative to My Auctions and Sign Out on a Store lane, and asserts the full
  list only where every account page is withheld

## Migration Plan

`packages/ui` loses the second orders item; grade10 takes it with its next
submodule bump, in any order, because it supplies neither prop. Q1's "never"
row is one deleted prop, rolled back by redeploying the previous build.
