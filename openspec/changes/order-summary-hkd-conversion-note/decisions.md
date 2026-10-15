## Goals

- A paying winner reads the HKD Order Summary like the invoice: one amount
  per line, one total, one currency on screen.
- The winner who wants the conversion reads it once, under the total.

## Non-Goals

- A per-line USD recap or a currency switch; both were drawn and rejected.
- Removing USD from the page; the lot card keeps its USD winning bid.
- Changing the invoice, receipt or letters; they carry HKD only and name no
  rate.
- Converting the card fee backwards; it is computed in HKD and has no USD
  figure.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What does an HKD order's summary show? | Every line and the Order Total in HKD, with one note under the total naming the USD figure converted and the fixed rate — decided by @tangconst, 2026-10-15 | USD beneath each HKD line, as `usd-lot-currency-winner-settlement-choice` Q8 drew it, or the HKD \| USD swap `collapse-order-summary-usd-recap` drew next; one currency keeps the payable read clean and the note answers where the total came from |
| Q2 | May the summary name the rate? | Yes, once, in the note — the fixed 7.85 rate is the fact the winner needs to check the conversion; every other page, invoice, receipt and letter still names none | "Grade10 SHALL show the rate on no page, invoice, receipt or letter" holding against the note |
| Q3 | Which USD figure does the note name? | The converted lines' USD total — a card fee computed in HKD adds nothing to it; a bank fee typed in USD counts as a converted line | The order's payable total, or the winning bid alone |
| Q4 | How does the contract take it? | `summary.total.footnote`, the existing muted note under the Order Total row; no new prop, no state in the block | A dedicated `conversionNote` prop, or the `currencyToggle` prop added for the retracted change |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/auction/winner-order | May the summary name the rate? | Q2 |
