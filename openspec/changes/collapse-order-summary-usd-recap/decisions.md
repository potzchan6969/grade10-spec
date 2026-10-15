## Goals

- A paying winner reads the HKD Order Summary like the invoice: one amount
  per line, one total, one currency on screen.
- The lot's USD figures stay one tap away, for the winner who wants them.

## Non-Goals

- Removing the USD figures, or any USD amount from the page; the lot card
  keeps its USD winning bid.
- Persisting the picked view; a reference is asked for on each visit, and the
  block holds no browser storage.
- Changing the invoice, receipt or letters; they already carry HKD only.
- Converting the card fee backwards; it has no USD figure and stays HKD in
  both views.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Where do the lot's USD figures sit? | Behind an HKD \| USD control in the Order Summary heading that swaps every amount, Order Total included, HKD first — decided by @tangconst, 2026-10-15 | USD beneath each HKD line, as `usd-lot-currency-winner-settlement-choice` Q8 drew it, or a collapsed recap; one currency at a time keeps the payable read clean |
| Q2 | Does the USD view show an Order Total? | Yes — the swapped total is the lot's USD figures, the reference total; the "no USD total" rule applies to what the order asks to pay | Showing a USD total beside the HKD one, or no total in the USD view at all |
| Q3 | Which rows swap? | Every row carrying a `subtext` — the lines and the Order Total; a row without one, the HKD card fee, keeps its value in both views | The lines only; the swap covers whatever the app marks with a second amount |
| Q4 | How does the contract take it? | `summary.currencyToggle` (`primary` and `secondary` labels, optional `ariaLabel`); without it a `subtext` still renders under its value | A `subtextToggle` show/hide disclosure or an always-on swap; the app opts in per summary and the current render stays available |
| Q5 | Is a separate ui-design owed? | Waived — the Order Summary stories draw both views, as `usd-lot-currency-winner-settlement-choice` settled its own | Holding the control for a separate design artifact |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/auction/winner-order | Where do the USD figures sit? | Q1 |
| shared/ui/auction-order | How does the contract take it? | Q4 |
