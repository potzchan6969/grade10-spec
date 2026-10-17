## Goals

- The membership figures block is named `TierCard`, clear of `MemberCard`,
  the QR-code card beside it.
- `TierCard` draws the designer's Figma card — the silver, gold and black
  skins — with the balance, its checkout worth, the retention run, the earn
  line and the Benefits affordance.
- The whole card opens the Tier & Benefits page.

## Non-Goals

- No rename of `MemberCard` or the sibling blocks.
- Rewriting archived OpenSpec changes. Past archives keep the name they
  shipped under.
- The Tier & Benefits page itself. It is being designed 🚧; this change only
  takes the `href` to it.
- Any expiry wording on the card. Whether the inactivity date reads on the
  Tier & Benefits page is that page's design, not this change's.
- Token work. The skins draw on the palette the design system already holds;
  `tokens.json` is untouched.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What does `MembershipSummary` become? | `TierCard` — the human's choice | `MembershipStatus`, `MembershipFigures` or `PointsAndStanding` — each clear of `MemberCard` too; the interview settled on `TierCard` |
| Q2 | How does the skin arrive? | A `variant` prop, `"silver" \| "gold" \| "black"`, separate from `tier` | Deriving the skin from the `tier` string — the tier name is consumer-worded copy, not a skin selector |
| Q3 | Where does the balance-expiry line go? | Off the card entirely — `balanceExpiry` leaves the props; ❓ its reading relocates to the Tier & Benefits page 🚧 | Keeping the line on the card — the whole balance lapses on one shared inactivity date, never in parts, so the line had nothing to say there |

## Raised

The inactivity-expiry date's new home is unconfirmed until the Tier &
Benefits page lands.

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/loyalty/programme | ❓ where the expiry date reads — Tier & Benefits page 🚧 | profile PRD ❓ — `docs/prds/products/grade10-site/loyalty/membership.md` |
