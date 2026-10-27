# Rename MembershipSummary to TierCard and redesign it to the Figma card

**Author:** @tangconst - 2026-10-17

## Why

`MembershipSummary` sat one file away from `MemberCard`, the QR-code card a
till scans, and the two names read as one thing on the membership page — it
becomes `TierCard`. The designer has then redrawn it in Figma
(Grade10-DS-2026, node 7141:2000) as a dark, tier-skinned card — silver,
gold and black — that shows the spendable balance and what it pays at
checkout, the run to keep or upgrade the tier, and the tier's earn rate, and
that opens the Tier & Benefits page whole. The card shipped so far is a
plain card with a points-expiry line that no longer belongs on it: the
balance lapses on one shared inactivity date, never in parts, so a
partial-expiry reminder has nothing to say there.

## What Changes

- `MembershipSummary`, `MembershipSummaryCopy` and `MembershipSummaryProps`
  leave `@grade10/ui`; `TierCard`, `TierCardCopy` and `TierCardProps` take
  their place. **BREAKING** for any consumer importing the old names. The
  `data-slot` attributes move from `membership-summary*` to `tier-card*`,
  and the block story becomes `Loyalty/Profile/Blocks/TierCard`.

- `TierCard` is rebuilt to the Figma card. It takes a `variant` —
  `"silver" | "gold" | "black"` — that sets the skin separately from the
  tier name the consumer words, renders the balance with its formatted
  checkout worth, renders retention progress only where the tier names a
  qualifying threshold (Black is held by invitation and has none), renders
  the earn line and a Benefits affordance, and takes the whole card's link
  through an `href` prop. **BREAKING**: `renewalDate`, `tierValidity` and
  `balanceExpiry` leave the props, and `TierCardCopy` becomes
  `{ balance, points, worthSuffix, qualifying, benefits }`.
- The card carries no expiry line. Expiry wording relocates to the Tier &
  Benefits page.
- `TierCardVariant` joins the exports beside `TierCard`, `TierCardCopy` and
  `TierCardProps`.
- The block story gains `Silver`, `Gold`, `Black`, `ThresholdReached`,
  `NoPoints`, `OpensBenefits` and `Pressed`; the expiry-line stories leave.
- The preview Membership screen draws the gold skin and passes a placeholder
  `href` for the Tier & Benefits page, which has no story yet.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/loyalty/programme`: `The membership surface exports` is
  restated — the block is named `TierCard`, takes the variant axis, the
  worth, the conditional retention block, the earn line and the whole-card
  `href`, and no longer names a balance-expiry line of its own.

## Impact

- **`@grade10/ui`** (this store) — `membership-summary.tsx` becomes
  `tier-card.tsx` rewritten to the card; the barrel also exports
  `TierCardVariant`.
- **`apps/preview`** (this store) — the Membership screen and
  `loyalty-content.ts` pass `variant`, `worth`, `retentionLine`, `earnLine`
  and `href`; the expiry helpers leave.
- **Consumer apps** — any `MembershipSummary` import renames it, and every
  call site moves to the new props: `variant`, `worth`, `retentionLine` and
  `earnLine` in place of `renewalDate`, `tierValidity` and `balanceExpiry`,
  with the whole-card link through `href`. None are known in this store
  beyond the preview.
- **The expiry surface** — the card carries no expiry line; the membership
  surface's one-line rule stays, relocating to the Tier & Benefits page.
