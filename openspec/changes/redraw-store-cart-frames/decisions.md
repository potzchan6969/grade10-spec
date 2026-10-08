## Goals

- **Which price is charged** - a screen reader says which of a struck list
  price and the price charged is which, wherever a price is struck

## Non-Goals

- **Holding the feature changes** - cart-drawer-empty-state and
  present-cart-site-sale-promo-outcomes ship their interims and archive
  without this change
- **What shows on screen** - the strike and both prices stay as they are

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Empty cart frames: what happens to the four frames that still draw Cart Item Slot? | Nothing: the Empty State story is the agreed look, and the frames stay as history. Storybook on `main` is the agreed look, not Figma - decided 2026-10-08 | Retiring Cart Item Slot and redrawing the frames |
| Q2 | Drawer body: what does it show when the first cart read fails and no lines are known? | The loading treatment, never the empty state, beside the application's Retry - decided 2026-10-08 by the product manager, as recommended | A body of its own for this state, drawn in a change of its own |
| Q3 | Cart line price: how does a screen reader tell the struck list price from the price charged? | Visually hidden labels such as Sale price and Was, supplied by the application as copy, in this change, for every struck price. The options look the same on screen, so it is not the designer's - decided 2026-10-08 | A strike element with no new words, which does not say reliably which price is charged |
| Q4 | Promo sheet: where does a picked ticket sit once the price check refuses its code? | Apart, muted, with the refusal as its reason and no Apply - decided 2026-10-08 by the product manager, as recommended | Keeping it in place with Apply, which offers an Apply that fails again; or leaving each application to choose |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/ui/store-cart | R1 - Empty cart frames 4674-3831, 4735-6493, 4799-6807 and 4799-6810: they still draw Cart Item Slot, which the drawer no longer has. Options: (a) retire Cart Item Slot and redraw the empty frames to match the Empty State story; (b) label the frames historical in Figma and leave them. Recommended: (a), since the stories are the agreed look and a frame showing a removed component misleads anyone who opens Figma first. Owner: Designer (@tangconst). From: cart-drawer-empty-state Q15 | Q1 |
| shared/ui/store-cart | R2 - Drawer body after a failed first read: no lines are known yet. Options: (a) the loading treatment: a blank body, a skeleton for the title's count, no footer and never the empty state, beside the application's Retry that names no line; (b) a body of its own for this state, added in a separate change. Recommended: (a), since the block already draws it, the host already shows it when only the cart read fails, and the shopper never sees a false empty cart. Owner: Designer (@tangconst). From: cart-drawer-empty-state Q14 | Q2 |
| shared/ui/store-cart | R3 - Cart line price read aloud: a screen reader cannot tell the struck list price from the price charged. Options: (a) visually hidden labels such as Sale price and Was, supplied by the application as copy; (b) a strike element with no new words; (c) one follow-on change that settles it for every struck price: tile, product page, order line and cart. Recommended: (a), delivered through (c), since only words say reliably which price is charged, and the copy and each application's wiring land once. Owner: Designer (@tangconst). From: present-cart-site-sale-promo-outcomes Q9 | Q3 |
| shared/ui/store-cart | R4 - Promo sheet: the price check refuses a code the shopper picked from the ones that can apply. Options: (a) the ticket stays among the ones that can apply, keeps Apply, and the refusal shows only as the promo field's error; (b) the ticket moves apart, muted, with the refusal as its reason and no Apply; (c) the drawer decides nothing and each application chooses. Recommended: (b), since the shopper is never offered an Apply that fails again, it matches how a code known not to apply is listed, and the block needs no change. Owner: Designer (@tangconst). From: present-cart-site-sale-promo-outcomes Q8 | Q4 |
