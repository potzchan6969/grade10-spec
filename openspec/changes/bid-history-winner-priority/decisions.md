## Goals

- Mark the winning public Recent bids row with a primary crown after the
  amount once the lot closes sold.
- Explain equal-max priority on the non-leading same-price row with an Info
  tip in the amount tone.
- Keep live lots without a winner crown; leading stays first-row treatment
  only.

## Non-Goals

- Changing auction-service tie resolution (earlier max already leads).
- A footnote under the Recent bids list — tip stays on the row Info control.
- Renaming personal Your bidding dialog priority copy in this change.
- New Badge sizes, variants, or Figma-owned chrome.
- Application repository wiring beyond the shared contract and preview.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | When does public Recent bids mark the winner? | Only when the lot is closed and sold; consumer sets `isWinner` on the winning row | Winner mark on live high bidder |
| Q2 | How is equal-max priority explained? | Info tooltip on `samePricePriority` rows; icon matches amount tone; tip says when maximums match, the earlier one leads | Footnote under the list; badge on the non-leader |
| Q3 | How is the winner marked? | Small filled crown in primary color after the amount, before You | Winner text badge |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `shared/ui/auction-listing` | Winner while live vs closed only? | Q1 |
| `shared/ui/auction-listing` | Footnote vs tooltip for equal-max? | Q2 |
| `shared/ui/auction-listing` | Badge vs crown for the winner? | Q3 |
