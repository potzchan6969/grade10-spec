# Rename MemberCard to MemberPass and redesign it to the Figma pass

**Author:** @tangconst - 2026-10-17

## Why

The member card is what a member holds up at a till, and the designer has
redrawn it in Figma (Grade10-DS-2026, node 7156:2292, header 7158:2858) as
`Member Pass` — a tier-skinned header carrying the Grade10 mark, the tier
badge and the member's account email, over a white body that gives the QR
square and the short code the room a scanner needs, a divider, a refresh
countdown and a Refresh control. On a phone the pass stands alone on its
own page, so staff can read the code without the page around it. The
shipped `MemberCard` is a plain card with none of that, and its name
collides with the wallet's member card — the thing being held is a pass.

## What Changes

- `MemberCard`, `MemberCardCopy`, `MemberCardProps`, `MemberCardState` and
  `MemberCardUse` leave `@grade10/ui`; `MemberPass`, `MemberPassCopy`,
  `MemberPassProps`, `MemberPassState` and `MemberPassVariant` take their
  place. **BREAKING** for any consumer importing the old names. The
  `data-slot` attributes move from `member-card*` to `member-pass*`, and
  the block story becomes `Loyalty/Membership/Blocks/MemberPass`.
- `MemberPass` is rebuilt to the Figma pass. It takes a `variant` —
  `"silver" | "gold" | "black"` — that sets the header's skin separately
  from the tier name the consumer words, and `email` in place of
  `displayName`, because no name is collected at registration.
  **BREAKING**: `displayName` leaves the props and the copy gains
  `shortCode` and `refreshesIn` in place of `fallbackCode`, `expiresIn`,
  `secondsUnit` and `used`.
- The scannable code and the short code still encode the consumer's token
  verbatim — the pass never mints one. A fresh token dips the square out
  of view — fading and easing down — and settles the fresh pair in rather
  than snapping, so a scanner never loses the square mid-read; under
  `prefers-reduced-motion` it swaps instantly.
- The `live` and `expired` states stay — a lapsing code still says so —
  but the `used` rendering leaves: a code the till takes is answered by
  the pass quietly rotating to the next minted pair, never by freezing
  on a "used" surface. The refusal a replayed code earns — naming where
  and when it first scanned — stays the till's answer; `store/membership`
  SC-09 loses its "the member's own card shows the same" clause.
- `ScanPlate` gains a `flat` variant — the square straight on the pass's
  white body, no plate of its own — and stays an export.
- The membership page keeps the pass in place of the card, and a new
  `Loyalty/Membership/Screens/Member Pass` screen story draws the pass
  alone, counting the code down and holding a screen wake lock while it
  is up so the screen cannot dim mid-scan. A web page cannot raise screen
  brightness — the wake lock is the feasible half of that ask.
- The shared catalog's `membership.card` keys rename to match the copy
  type in every language.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/loyalty/programme`: `The membership surface exports` is
  restated — the block is named `MemberPass`, takes the variant axis and
  the account email, swaps its code area on a fresh token, and joins the
  export list the requirement already names.
- `grade10-site/store/membership`: `A member identifies at the till by a
  dynamic code or their email` is restated — `SC-09` drops the clause
  that mirrors a replay refusal onto the member's own card; the till's
  refusal naming where and when is unchanged.

## Impact

- **`@grade10/ui`** (this store) — `member-card.tsx` becomes
  `member-pass.tsx` rewritten to the pass; `scan-plate.tsx` gains the
  `flat` variant; the barrel exports the `MemberPass*` names and
  `ScanPlateVariant`. An `audit.json` beside them records the class map
  for the nightly design sync.
- **`apps/preview`** (this store) — `loyalty-content.ts` carries the
  `MemberPassCopy` and the member's email; `membership.stories.tsx` draws
  the pass with `variant`; a new `member-pass.stories.tsx` draws the
  standalone screen with the countdown loop and the wake lock.
- **`packages/i18n`** (this store) — `membership.card` gains
  `shortCode` and `refreshesIn`, loses `fallbackCode`, `expiresIn` and
  `secondsUnit`, and `membership.page.card` names the member pass, in
  English, Traditional Chinese, Simplified Chinese and Korean.
- **Consumer apps** — any `MemberCard` import renames it, and every call
  site moves to the new props: `email` and `variant` in place of
  `displayName`, and the renamed copy keys. None are known in this store
  beyond the preview.
- **Brightness** — no standard web API sets or restores screen brightness;
  the standalone page holds a screen wake lock, and a native or webview
  shell that can set brightness is the consumer's bridge, not the shared
  block's.
