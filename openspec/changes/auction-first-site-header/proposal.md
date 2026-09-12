**Author:** @tangconst - 2026-09-11

## Why

Collectors land on a site that mixes auction and (later) store, and the header
must say clearly how to sign in, how to reach their auction account, and which
language they are reading — without implying a currency switch or a Store cart
before Store exists.

The early chrome still showed HKD/KRW and treated the account entry as a single
icon with no menu. Auction launches first; Store is not yet an entrance.

## What Changes

- **Language switch** — the locale control switches English, Traditional
  Chinese, and Simplified Chinese; it does not switch currency
- **`SiteHeader`** — a compound header composing design-system `Nav` with
  session-aware account entry
- **Signed out** — a primary Sign In button, not the account icon
- **Signed in** — account icon opens Profile, My Auctions, and Sign out
- **Auction-first nav** — primary nav lists surfaces that answer; Store and
  cart stay absent until those surfaces exist
- **Compact menu** — below the wide breakpoint, a leading hamburger opens a
  left inset drawer (primary nav, then utilities in the same link style,
  language via a nested drawer); Account / Sign In and Cart stay on the
  trailing edge; search moves into the drawer
- **Sign-out** — also from the account menu (still available on the profile)

## Non-Goals

- **Orders in the account menu** — waits on Store
- **KYC under the account entry** — not for this launch
- **Profile field content** — destinations only; what the profile page holds is
  separate
- **Figma as layout source of truth** — Storybook is SoT; Figma remains a
  reference
- **ZZZ chrome changes** beyond what the shared `Nav` / `SiteHeader` APIs
  already allow

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `shared/ui/site-chrome`: language locale control; `SiteHeader` export and
  account presentations; compact left menu drawer with nested language drawer
- `grade10-site/site/page-shell`: session-aware Sign In vs account menu; cart
  and Store only when those surfaces answer; sign-out from the account menu;
  compact menu reaches nav and language

## Impact

- **`@grade10/design-system`** — `Nav` gains `accountPresentation`,
  `accountSlot`, language (not currency) locale chrome, and a compact left
  menu drawer
- **`@grade10/ui`** — new `SiteHeader` under `site-chrome`
- **`apps/preview`** — auction page shell uses `SiteHeader`
- **Consumers** — grade10-site wires `SiteHeader`; Store cart handler only on
  Store / checkout
- **Absorbs** — `add-store-cart-drawer-ui`'s page-shell Cart gating
  (`SC-09` / `SC-16`) so two changes do not fold the same requirement

## Follow-on changes

- Account menu gains Orders when Store launches
- Profile page content behind the Profile destination

## Open questions

- none

## References

- [Site Header and Footer](../../../docs/prds/products/shared/ui/site-chrome.md)
- [Page Shell](../../../docs/prds/products/grade10-site/site/page-shell.md)
- [Sign-Out](../../../docs/prds/products/shared/auth/sign-out.md)
