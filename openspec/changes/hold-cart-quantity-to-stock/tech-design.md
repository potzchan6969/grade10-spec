# Tech design

## Context

See `proposal.md` — Why. The requirements are the four deltas beside it.

Most of the ceiling already exists. The change is smaller than the proposal
reads, and an engineer should know which surfaces are new work and which are
regression cover before planning a session:

| Surface | Ceiling today | Remaining count today |
| --- | --- | --- |
| Product page (`ProductBuyBox`) | Caps — `max={maxQuantity}` from `chosen.quantityAvailable` | Says it — `scarceQuantity`, at three or fewer |
| Cart drawer (`CartItem`) | Caps — `maxQuantity` from the reviewed line's `availableQuantity`, through `StepperInput`'s `max` | Nothing |
| Listing tile (`ProductCard`) | Nothing — the stepper row reports `quantity + 1` unconditionally | Nothing |

So the genuinely new work is three things:

- **The listing card gains a ceiling it has never had** — `shared-ui-store-product-listing-SC-56` to `SC-59`, and `grade10-site-store-product-listing-SC-18`, `SC-19`.
- **Two shared components gain a remaining-count display** — `shared-ui-store-product-listing-SC-60` to `SC-62` and `shared-ui-store-cart-SC-20`, `SC-21`.
- **"Asked for the last one" is a new display rule on both site surfaces** — `grade10-site-store-product-listing-SC-21` and `grade10-site-store-product-page-SC-23`. It is the one requirement the existing threshold cannot answer: forty-one of forty-one is not scarce, and is still worth saying.

The rest — `grade10-site-store-product-page-SC-19` to `SC-22` and `SC-24`,
`shared-ui-store-cart-SC-17` to `SC-19` — describes behaviour already shipped.
Those scenarios still need their tests, as the evidence that a refactor of the
ceiling did not lose them.

What the shop already supplies, and where:

- **`ProductVariant.quantityAvailable: number | null`** in `@grade10/shopify-contracts`, selected by every catalogue read. Null where the shop exposes no count.
- **`scarceQuantity(variant)`** in the store's product model, `SCARCE = 3`, returning the count only for a sellable variant with a finite positive count at or below three. This is the store's one definition of nearly out.
- **`sellableVariant(product)`** in the same model — the listing's `tile()` already calls it and discards its count.
- **`onlyLeft`** in the shared `product` catalogue, answered in all four locales. No new message key.

## Goals / Non-Goals

**Goals**

- One ceiling rule and one scarcity threshold, read from the store's product model by every surface
- Both shared components take a maximum and a remaining count, and derive neither
- A capped control never ships without the count that explains it

**Non-Goals**

- Any change to the cart's review clamp or its `adjusted` status — they stay the authority the cap leans on
- Reformatting or relocating the product page's existing `onlyLeft` line
- A remaining count on the front door's merchandised row, which draws no cart

## Decisions

### The maximum is a supplied prop on both components, never a derived one

Both specs forbid the components deriving a maximum. The implementation choice
is where the prop sits and how far it travels.

- **`ProductCardProps.maxCartQuantity?: number`**, threaded through `ProductCardImage` → `ProductCardCartControl` → `ProductCardCartStepperRow`, which stops reporting and disables its increment at the bound. `ProductSummary` gains the matching optional field so the listing's `tile()` supplies it with the rest.
- **Why the stepper row** — it is the only place that computes the next quantity (`report(quantity + 1)`). Capping anywhere higher leaves the arithmetic and the bound in different files.
- **Rejected — clamping in `ProductCardCartControl.report`.** It would silence the increment without disabling it, and `SC-56` requires the affordance be exposed as unavailable, not merely inert.
- **Rejected — passing the whole variant.** The package is forbidden the shop's shapes; a number is the whole contract.
- **The cart line needs nothing.** `CartItemSummary.maxQuantity` exists, `StepperInput` already disables its increment at `atMax` and clamps typed input. `SC-17` to `SC-19` are cover over shipped behaviour.

### The remaining count is a display string the surface computes

Both specs say the component displays what it is given and judges nothing.

- **`ProductCardProps.remainingLabel?: ReactNode`** and **`CartItemSummary.remainingLabel?: ReactNode`**, each rendered where supplied and suppressed on a sold-out product, which is the one judgement the card is asked to make (`SC-62`).
- **Why a string and not a number** — `Only 3 left` needs a locale, a plural rule and the `product` catalogue, three things `@grade10/ui` may not reach. The same reason `price` is already a formatted `ReactNode`.
- **Rejected — the existing `cardProps` badge slot.** It is a pass-through, so the card could not suppress the count on a sold-out product, and `SC-62` is exactly that rule.
- **Rejected — overloading the cart's `lowStockWarning` copy.** `shared-ui-store-cart-SC-20` requires a line to be able to show both: one says what was already changed, the other says what is left.

### Two domain functions, one question each

`scarceQuantity` already answers *is it worth saying*. Add beside it, in
`packages/grade10-store/frontend/.../domain/models/Product.ts`:

- **`sellableQuantity(variant): number | null`** — the ceiling. The finite positive count of a sellable variant, null otherwise.
- **`remainingToSay(variant, asked): number | null`** — `scarceQuantity(variant)` first, else the count when `asked` has reached it. The whole of the "asked for the last one" rule, in one place both surfaces call.
- **Why extract the ceiling** — `ProductBuyBox` inlines it today (`quantityAvailable != null && > 0`). The listing would make that two copies of a rule the spec says lives once.
- **Rejected — extending `scarceQuantity` to return the ceiling too.** One function returning the same number for two different questions leaves a caller unable to tell which it got, and the page shows one while the stepper bounds by the other.
- **Rejected — computing "asked for the last one" inside the shared card.** It would need the asked quantity, the count and the threshold, and the spec forbids the card comparing against a threshold at all.

### Zero available with `availableForSale` true puts no ceiling

The contract already documents this: *only a positive count bounds a cart*, for
a shop that sells without stock on purpose. `scarceQuantity` already requires
`> 0`; `sellableQuantity` follows the same rule.

- **Rejected — capping at zero.** It makes an intentionally oversellable variant unbuyable, which is a worse defect than the one being fixed.

### The count sits under the price, matching the product page

On the tile, the remaining count renders in the card's content column below the
price row, small and in the error tone the product page already uses.

- **Why** — the same fact in the same words in the same place across two surfaces, and the well is already carrying the sale badge, the sold-out badge and the cart control.
- **Rejected — a badge in the photo well.** It is the fourth thing in a corner that holds three, and the sold-out treatment would have to fight it for the same slot.
- **The Figma set defines no such element.** `Product / Product Card` (`4200:155`) publishes `productName`, `price`, `originalPrice`, `hasDiscount`, `soldOut` and the `cardProps` slot, and nothing for a count. This is content, not a variant or size rung, so it does not break the rule in `design-code-sync.md` — but the Code Connect template must not invent a mapping for it. See Risks.

## Risks / Trade-offs

- **A cap read at render is stale by the time it is pressed** → unchanged, and deliberately so. The control is bounded at report time from the product in hand; nothing stores a ceiling in cart state, and `Cart.ts`'s `Math.min(line.quantity, reviewed.availableQuantity)` plus the `adjusted` status stay untouched as the correction path.
- **A capped control with no explanation reads as broken** → the ceiling and the count ship in the same task for each surface, so no group can land one without the other.
- **The listing's count comes from a paged read that may be minutes old** → the tile derives from the same `Product` it draws itself from, so the count and the price are never from different reads. Refresh is the listing's existing refetch, not a new subscription.
- **The card's remaining count has no Figma counterpart** → `pnpm run design-sync:check` runs in the group that adds it and must stay at zero errors. If the set is found to disagree rather than merely lack the element, that is a separate OpenSpec change, not a template patch.
- **`parseCartQuantity` reads the quantity back out of a `ReactNode` `cartCount`** → the maximum does not go near it; it is a plain `number` prop. The existing parse stays as it is.

## Migration Plan

Additive and backward compatible throughout: every new prop is optional, and a
consumer supplying none behaves exactly as today. So the submodule bump is safe
on its own, before any application group is claimed, and needs no coordinated
release.

Rollback is the submodule SHA.

## Open Questions

- **Does design want the tile's count under the price or in the photo well?** Answerable after the first render without changing a requirement, the approach or the task list — the card displays a supplied string either way, and only its placement class moves.
