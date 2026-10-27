## Goals

- The membership figures block is named `TierCard`, clear of `MemberCard`,
  the QR-code card beside it.
- `TierCard` draws the designer's Figma card — the silver, gold and black
  skins — with the balance, its checkout worth, the retention run, the earn
  line and the Benefits affordance.
- The whole card opens the Tiers & Benefits page.

## Non-Goals

- No rename of `MemberCard` or the sibling blocks.
- Rewriting archived OpenSpec changes. Past archives keep the name they
  shipped under.
- The Tiers & Benefits page itself. This change only takes the `href` to it.
- Any expiry wording on the card. The inactivity date reads on the Tiers &
  Benefits page (Q3); drawing that line is that page's design, not this
  change's.
- Token work. The skins draw on the palette the design system already holds;
  `tokens.json` is untouched.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What does `MembershipSummary` become? | `TierCard` — the human's choice | `MembershipStatus`, `MembershipFigures` or `PointsAndStanding` — each clear of `MemberCard` too; the interview settled on `TierCard` |
| Q2 | How does the skin arrive? | A `variant` prop, `"silver" \| "gold" \| "black"`, separate from `tier` | Deriving the skin from the `tier` string — the tier name is consumer-worded copy, not a skin selector |
| Q3 | Where does the balance-expiry line go? | Off the card entirely — `balanceExpiry` leaves the props; its reading relocates to the Tiers & Benefits page — the human's choice | Keeping the line on the card — the whole balance lapses on one shared inactivity date, never in parts, so the line had nothing to say there |
| Q4 | Does the whole card open Tiers & Benefits (SC-257)? | Yes — the human's choice | A Benefits link alone, leaving the rest of the card inert |
| Q5 | Are "Points to spend" and the tier-progress labels the launch names? | Yes — the human's choice | Leaving them unconfirmed until the copy review |

## Raised

Nothing. The blind pass settled everything it was given.
