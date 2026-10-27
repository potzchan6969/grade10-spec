# Add the Tiers & Benefits surface

**Author:** @tangconst - 2026-10-21

## Why

A member can read their own tier card, but nothing answers the next
questions — what the other tiers are, what they ask, what they pay, and how
points themselves work. The designer has drawn that surface in Figma
(Grade10-DS-2026): a tier info card for every rung (`7227:1069`), a tier
ladder marking the member's climb (`7250:1875` and its invitation-held
variant `7254:384`), and a how-points-work card of the four mechanics
(`7229:7427`), composed into a page (`7250:1607`) that a small viewport
navigates to, on a wide viewport too. It exists in the
workbench on this change's branch; this change records the contract.

## What Changes

- `TierInfoCard`, `TierInfoCardProps`, `TierLadder`, `TierLadderCopy`,
  `TierLadderProps`, `TierLadderRung`, `HowPointsWork`, `HowPointsWorkItem`
  and `HowPointsWorkProps` join the `@grade10/ui` public entry beside
  `TierCard` — **ADDED**, not breaking.
- `TierInfoCard` renders one rung — the tier name, its ask caption and its
  benefits behind checks — and wears the primary border and its tinted
  shadow where `currentTier` marks it the held rung.
- `TierLadder` draws the climb in a card through the design-system Stepper:
  rungs below the held tier read completed, the held rung reads progress,
  unearned rungs read upcoming, and no connector is drawn into an
  invitation-only rung. An invitation-held tier marks nothing beneath it as
  earned — every other rung reads upcoming — and the qualifying pill and
  footnote stay away, however the figures are passed.
- `HowPointsWork` renders the mechanics as icon rows — earn, pending, spend,
  expiry — stacked on a narrow viewport and paired on a wide one. The copy
  is the consumer's; the preview states the programme's own values: a point
  redeems a Hong Kong dollar, points arrive when an order completes, and
  the whole balance lapses after twelve months with no activity.
- The preview Tiers & Benefits screen is its own page — breadcrumbs, the
  semibold title, the ladder, the rung cards, the mechanics card — reached
  from the `TierCard` link on Membership.
- The surface states the lapse rule and draws no member-dated "how many
  points expire and the day they go" line; the Membership page keeps that
  line (Q5).

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/loyalty/programme`: `The membership surface exports` is
  restated — `TierInfoCard`, `TierLadder` and `HowPointsWork` join the
  named components, each with its props contract, the held-rung rules, the
  invitation-held rules and the mechanics rows.

## Impact

- **`@grade10/ui`** (this store) — `tier-info-card.tsx`, `tier-ladder.tsx`
  and `how-points-work.tsx` under `blocks/loyalty-membership/`, their
  stories, and the barrel exports.
- **`apps/preview`** (this store) — the Tiers & Benefits screen, the
  `ladderCaption`/`HOW_POINTS_WORK` content, and the `TierCard` link's
  story target.
- **Consumer apps** — additive only; nothing existing renames or reshapes.
- **The expiry line** — stays on the Membership page, outside the card; this
  surface states the lapse rule alone (Q5).
