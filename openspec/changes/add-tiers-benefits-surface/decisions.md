## Goals

- Every tier's card is inspectable beside the member's own, and the held
  rung is unmistakable on both the ladder and the cards.
- The ladder reads the programme's real rules: earned rungs check off, an
  invitation-held rung earns nobody, and a rung nobody can climb is never
  connected to.
- The mechanics card states the values the programme actually enforces —
  not a draft's.

## Non-Goals

- A Tiers & Benefits section inside the wide Membership page — the
  standalone page is the surface on every viewport (Q6).
- A member-dated expiry line. The surface states the lapse rule alone (Q5).
- Backend behaviour of any kind — the blocks are presentational.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | How does the held rung read? | `currentTier` marks it on both blocks — the card's primary border and tint, the ladder's progress indicator | Deriving held-ness from the first or last rung — the held tier is member state, not layout |
| Q2 | What does an invitation-held tier show? | Every other rung upcoming, no qualifying pill, no footnote — Figma's `blackTier` variant (`7254:384`) | Checking the earned rungs beneath — a check means earned, and an invitation earned nobody |
| Q3 | Whose words do the mechanics speak? | The consumer's — the row titles and bodies arrive through props; the preview states the spec's own values | Hardcoding the Figma draft — it claimed a pending window and a redemption rate the programme does not have |
| Q4 | Where does the ladder's qualifying line live? | Inside the ladder's card as a muted pill, drawn only when both the count and the target arrive | A separate block or a bare text row — the Figma slot puts the pill in the same card as the stepper |
| Q5 | Where does a member's own expiry line read? | Nowhere — the surface states the lapse rule alone, and no member-dated line is drawn — the human's choice | Holding for a designed line — the card already lost it (`redesign-tier-card` Q3) |
| Q6 | Does a wide viewport host Tiers & Benefits as a Membership section? | No — its own page on every viewport — the human's choice | An embedded section, which needs a wide composition design |
| Q7 | Does Tiers & Benefits get its own navigation entry? | No — it is reached from the card only — the human's choice | An entry of its own, which needs a navigation design |

## Raised

Nothing. The blind pass settled everything it was given.
