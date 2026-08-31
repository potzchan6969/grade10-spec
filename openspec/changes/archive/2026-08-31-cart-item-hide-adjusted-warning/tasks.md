## 1. CartItem adjusted warning (grade10-spec)

- [x] 1.1 Hide `lowStockWarning` after stepper quantity change while status stays `adjusted`; reset when status re-enters `adjusted` (*Adjusted line shows the low-stock warning*, *Quantity change hides the warning*, *New adjusted status shows the warning again*)
- [x] 1.2 Cover the post-cap path in the single `QuantityAdjusted` story (qty 2 / max 2 / adjusted, increment disabled, dismiss on decrease, remove-at-min at qty 1)
- [x] 1.3 Verify with `pnpm run typecheck` for the affected package
