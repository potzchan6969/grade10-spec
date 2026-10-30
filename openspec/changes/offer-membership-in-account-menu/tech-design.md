## Context

- **The shared header already draws the order.** `@grade10/ui` `SiteHeader`
  (`packages/ui/src/blocks/site-chrome/site-header.tsx`) renders Membership
  right after Profile whenever `onMembership` and `copy.membership` are both
  supplied, since `efc781e5a`; the `WithProfile` story asserts Profile,
  Membership, My Orders, My Auctions, Sign Out. grade10's pinned
  `external/grade10-spec` (`003f16bd7`) already contains that commit.
- **The site supplies no Membership yet.** grade10's `SiteShell`
  (`apps/frontend/grade10/src/chrome/shell/SiteShell.tsx`) passes
  `onProfile` on `config.gates.profile`, `onMyOrders` on `config.gates.store`
  and `onMyAuctions` on the region's auction availability, and no
  `onMembership`, so the header never shows the item.
- **The membership gate exists.** `@grade10/app-env` `siteGates` carries a
  `membership` gate that the `/membership` surface (`SURFACES.membership`,
  `ROUTES.membership`) and the campaign page wait on. It is open on
  development, staging and staging-2 and shut on uat and production - the same
  lanes as `profile` - so no lane today carries the membership page without
  the account page; that arrangement is reached only by a gate override.
- **The label exists.** The grade10 brand chrome catalog
  (`packages/i18n/messages/grade10/<lang>/chrome.json`) answers `membership`
  in en, zh-Hans and zh-Hant; the ZZZ catalog has no such key and ZZZ supplies
  no Membership.
- **The draft.** grade10 branch `claude/membership-account-menu` holds an
  uncommitted `SiteShell` change and test edits that implement this design;
  the tasks land and verify it.

## Goals / Non-Goals

**Goals:**

- One build gate decides the item and the page it opens, so they appear and
  vanish together.
- No new export, prop, catalog key, read or analytics event.

**Non-Goals:**

- Any change to `SiteHeader`'s rendering or its public types.
- A loyalty programme read in the shell or the header.
- The Submissions item `SiteHeader` also accepts; this change neither uses
  nor removes it.

## Decisions

The [page-shell](specs/grade10-site/site/page-shell/spec.md) delta governs the
order, the gating, the destination and the label; the shared header's own
contract moves to the follow-up site-chrome change (`decisions.md` Q8). These
are the implementation choices under it:

| Decision | Choice | Rejected |
| --- | --- | --- |
| What gates the item | `config.gates.membership`, the gate the `/membership` surface itself waits on, mirroring `onProfile` on `config.gates.profile` | A loyalty programme read or membership status in the shell: a fetch, a pending state and a failure branch in the header for a page that shows its own failure (Q4). A second flag: two answers to whether the page is carried |
| Where it leads | `onNavigate(ROUTES.membership)`, the surface table's address, with locale handling left to `onNavigate` as for Profile | A literal `/membership` in the shell, which could drift from the surface table |
| Its words | `copy.membership: tChrome("membership")`, the brand chrome key every language already answers (Q5) | A key in the membership page's own namespace, which would load that page's catalog into the header; a new key in every language |
| Who orders the items | `SiteHeader` alone; the site supplies handlers and never sorts | An ordered item list from the site, which changes `SiteHeaderProps` |
| The component | No change: it already draws Membership right after Profile, and its stories and written contract follow in the follow-up site-chrome change | Re-drawing the menu, which already matches |


**Where each scenario is proved.**

| Scenarios | Proved by |
| --- | --- |
| `grade10-site-site-page-shell-SC-59`, `-SC-80`, `-SC-81`, `-SC-82`, `-SC-83`, `-SC-84` | grade10 `SiteShell.test.tsx` and `store-shut.test.tsx` in jsdom, with `arrangeGates` for the gate combinations no lane carries |
| `grade10-site-site-page-shell-US-03` end to end | grade10 `e2e/tests/auth/account-menu.spec.ts`, reading the lane's own gates through `laneGates` |

`grade10-site-site-page-shell-SC-83` is proved by rendering the shell with a
loyalty programme client that fails every read and the menu still offering
Membership; it holds because the shell makes no such read, and the test keeps
it that way.

## Risks / Trade-offs

- [A lane opens `membership` while the loyalty service is down] → The item
  and the page share one gate, so the menu leads only to a page the build
  carries; that page owns its failure state, and the header never waits on the
  programme.
- [A lane carries the membership page without the account page] → No lane
  does today. The order is drawn by `SiteHeader` from whichever handlers are
  supplied, so the menu opens on Membership with no site-side branch; a gate
  override in `SiteShell.test.tsx` proves it.
- [The pin falls behind `efc781e5a` on a rebase] → `store-shut.test.tsx` and
  `SiteShell.test.tsx` assert Membership's position, so a pin that draws the
  old order fails them.

## Migration Plan

- grade10's pin already contains the component, so the pin bump carries only
  the accepted specs and suite.
- The menu changes on the next deploy of each lane whose `membership` gate is
  open - development, staging and staging-2 today. uat and production do not
  change until their gate opens.
- Rollback is reverting the `SiteShell` commit; nothing is stored.
