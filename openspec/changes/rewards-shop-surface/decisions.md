# Decisions

## Goals

- The reward shop draws the designer's cards — item card with art and
  deadline, coupon card with the gift tile — and a press opens the checkout
  surface.
- The checkout surface confirms the cost against the balance, then draws the
  redeemed state in place — sheet under 640px, dialog from 640px up.
- A redeemed discount coupon shows its unique per-redemption code; a
  redeemed good shows its collect-by and the collect-in-store line in the
  code's place — every redemption mints a code and the scan QR is
  generated from it.

## Non-Goals

- The coupons page and its per-coupon QR. Settled as later scope; the
  redeemed ticket's own QR landed — folded behind a Use now control, and
  gone once spent.
- The cart's Apply affordance. Apply lives in the cart context only — never
  on the rewards surface or the coupons page.
- Quantity. A redemption is always one unit; the per-unit reward mechanics
  stay backend rules the surface never reaches.
- The physical reward's online order (HK$0 plus shipping or collection
  only) — the PRD's open call, unchanged.
- Token work. Everything drawn binds to values the theme already holds.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What does the code on the ticket carry? | A code unique to each redemption, member-bound, good online and at the till | A shared public code like `WELCOME50` — shareable to anyone, so it would hand the discount to non-members; and no code at all — `never-lock-a-coupon`'s settled line, which the designer's flow revises |
| Q2 | Where does Apply live? | In the cart context only — the redeemed ticket shows the code, no Apply anywhere on the rewards surface or the coupons page | An Apply button on the ticket — the designer confirmed it belongs to the cart's apply-rewards flow |
| Q3 | How does a good settle? | Collect in store: the ticket names collect-by and the store line in the code's place — the redemption still mints a code and the QR is drawn from it | An Apply that writes a HK$0 online order — that order's shipping or collection rule is the PRD's open ❓, undecided here |
| Q4 | Does quantity survive? | No — one redemption is one unit, confirmed by the designer; the stepper leaves the contract | A stepper inside the checkout sheet — nothing in the flow draws one, and the Figma button's "total points calculated by qty" annotation is stale |
| Q5 | Where does the sheet/dialog line sit? | 640px (`sm`), the breakpoint the order-details and auction blocks already read | `md` — no surface reads it for this choice |
| Q6 | Is `RewardMenu` a new export? | No — the export keeps its name and is redesigned under it, as `TierCard` was | A new `RewardList`/`RewardCard` export beside a deprecated menu — two exports for one shop |
| Q7 | Does the redeemed ticket itself open a QR? | Yes, folded behind a Use now control on till-facing surfaces, generated from the redemption's code and dropped once spent; the coupons-page QR is settled later scope | Leaving every QR to the coupons page, so a ticket facing the till opens none |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/loyalty/programme | whether the redeemed ticket itself opens a QR — decided: folded behind a Use now control on till-facing surfaces, generated from the redemption's code, dropped once spent; the coupons-page QR is settled later scope | Q7 |
