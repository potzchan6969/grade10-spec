## Goals

- Present each site-sale × promo outcome one way on the shared cart drawer:
  sale on the lines with no Store sale footer row; stack; refuse including a
  held ticket with no Apply; replace; restore the sale when the code is
  removed and the sale still applies.
- Keep Storybook under Store Cart / CartDrawer / Auto Discount as the layout
  source of truth for those composed canvases.

## Non-Goals

- Changing which Shopify or grade10 combine rule produces refuse, stack, or
  replace — that is pricing / `add-site-wide-discounts`.
- Naming a Store sale as its own footer summary row.
- Points tender, free shipping, or a second order-level promo beside the one
  code slot.
- Admin authoring of site discounts.
- Wiring the Grade10 application drawer to live quote endpoints.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What money basis does the drawer use when a code stacks? | The quote owns the amounts. The drawer presents the discount the quote supplies - decided by the round | Computing the stacked cut of post-sale vs list inside the drawer |
| Q2 | Does product special-sale exclusivity forbid stack or replace in this change? | No. This change presents whatever outcome the quote returns. Exclusivity stays on `add-site-wide-discounts` - decided by the round | Encoding exclusivity in the drawer |
| Q3 | Must staging show a live combine before this presentation contract? | No. The four presentations are the contract. A live combine is follow-on wiring after `add-site-wide-discounts` ships - decided by the round | Holding this change until a staging run has observed refuse, stack, and replace |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
