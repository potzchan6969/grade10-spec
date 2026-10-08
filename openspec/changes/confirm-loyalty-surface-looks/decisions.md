## Goals

- **A true picture** - the Coupons page shows a coupon list that draws no
  code on a reward coupon, which carries none

## Non-Goals

- **Holding the feature changes** - never-lock-a-coupon and
  align-reward-editor-design ship their interims and archive without this
  change
- **Rules** - a reward coupon carrying no code and what the reward editor
  saves are settled
- **The wallet save action** - draw-wallet-save-artwork carries it

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Coupons page: which coupon list story does the page show, now a reward coupon carries no code? | A new story with no code and no copy action, embedded on the page - decided 2026-10-08 by the product manager, as recommended | The masked story, which still draws a code on every row; or no picture until one is drawn |
| Q2 | Reward editor: are the departures from the approved mock the agreed look? | Confirm every departure as written - decided 2026-10-08 by the product manager, as recommended | Overriding named departures, each a new task with its cases run again; or restoring Duplicate and Archive beside the title |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/loyalty/programme | R1 - Coupons page coupon list: a reward coupon carries no code, and the story the page shows draws a code and a Copy code button on every coupon. Options: (a) add a new story, for example Wallet, with no code and no copy action, and embed it; (b) embed the masked story, which still draws a masked code on every row; (c) drop the picture until the designer supplies one. Recommended: (a), since the picture must not imply a code the coupon does not have. Owner: Designer (@tangconst). From: never-lock-a-coupon Q28 | Q1 |
| grade10-site/loyalty/programme | R2 - Reward editor departures from the approved mock, as its design record lists them: among them dark badge text, hints above their control, refusals as a tinted strip, Duplicate and Archive under More at every width, and a note for a reward stored as a retired handover. Options: (a) confirm every departure as written; (b) override named departures, each a new task with its cases run again; (c) confirm all except Duplicate and Archive, restoring them beside the title with a phone layout of their own. Recommended: (a); the dark badge text stands either way, since the mock's status text on its tint reads 3.2:1 and 2.4:1 against the 4.5:1 small text needs. Owner: Designer (@tangconst). From: align-reward-editor-design Q6 | Q2 |
