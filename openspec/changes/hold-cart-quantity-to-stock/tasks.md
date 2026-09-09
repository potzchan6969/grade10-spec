# Tasks

Group 1 is the two shared components, in **grade10-spec**, and reaches the site
through a submodule bump. Group 3 is the store's product model, where the
ceiling and the scarcity rule live once; groups 4 to 6 are the surfaces that
call it, and each needs group 3's landed code as well as group 1's bump.

Most of the ceiling already ships — the product page and the cart drawer cap
today, and only the listing tile does not. Which scenarios are new work and
which are cover over shipped behaviour:
[`tech-design.md`](tech-design.md) — Context.

## 1. The card stops, and both components say what is left (grade10-spec)

- [ ] 1.1 Stop the tile's cart control at a supplied maximum, disabling the increment affordance and exposing it as unavailable at the bound, so *The control stops at the maximum* (`SC-56`), *Below the maximum the control counts on* (`SC-57`), *No maximum supplied* (`SC-58`) and *Decrement still works at the maximum* (`SC-59`) pass — the number reaching `ProductCardCartStepperRow`, which is where the next quantity is computed
- [ ] 1.2 Display a supplied remaining count on the card, suppressed on a sold-out product, so *A remaining count is displayed as supplied* (`SC-60`), *No remaining count supplied* (`SC-61`) and *A sold-out product says nothing about what is left* (`SC-62`) pass, carrying both new fields as optional on `ProductSummary`
- [ ] 1.3 Display a supplied remaining count on a cart line, beside the low-stock warning rather than in place of it, so *A remaining count is displayed as supplied* (`SC-20`) and *No remaining count supplied* (`SC-21`) pass
- [ ] 1.4 Cover the cart line's shipped ceiling, so *The stepper stops at the maximum* (`SC-17`), *No maximum supplied* (`SC-18`) and *Decrement still works at the maximum* (`SC-19`) hold against the `StepperInput` bound they already rely on
- [ ] 1.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run design-sync:check`

## 2. The manual (grade10-spec)

- [ ] 2.1 Say on both shared pages that the components take a ceiling and a count and judge neither — `store-product-listing.md` for the card, `store-cart.md` for the line
- [ ] 2.2 Say on the two site pages that a cart control stops where the shop's count stops and says how many are left when it does, and record in `product-listing.md`'s `Product decisions` block why the cap stays advisory, why one threshold serves every surface, and why a count is said as news rather than as standing pressure
- [ ] 2.3 Verify: `pnpm check:manual`

## 3. The store's product model (grade10)

- [ ] 3.1 Add `sellableQuantity` beside `scarceQuantity` — the finite positive count of a sellable variant, null otherwise — and read `ProductBuyBox`'s ceiling from it rather than inline, holding *The page stops at what the shop has* (`SC-19`), *A shop that counts nothing stops nothing* (`SC-20`) and *Another grade brings its own ceiling* (`SC-21`)
- [ ] 3.2 Add `remainingToSay(variant, asked)` — scarce first, else the count once the asked quantity has reached it — so the "asked for the last one" rule lives once for both surfaces
- [ ] 3.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 4. The browse listing (grade10)

Needs group 1's bump and group 3's model.

- [ ] 4.1 Supply each tile's ceiling from the sellable variant the tile already resolves and discards, so *A card stops at what the shop has* (`SC-18`) and *A shop that counts nothing stops nothing* (`SC-19`) pass
- [ ] 4.2 Supply each tile's remaining count from `remainingToSay`, against the quantity that card holds in the cart, so *Nearly out is said on the card* (`SC-20`) and *Asking for the last one is answered* (`SC-21`) pass
- [ ] 4.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 5. The product page (grade10)

Needs group 3's model.

- [ ] 5.1 Read the page's `onlyLeft` line from `remainingToSay` against the stepper's quantity, so *Asking for the last one is answered* (`SC-23`) passes while *Nearly out is said on the page* (`SC-22`) and *A well-stocked card says nothing* (`SC-24`) go on holding
- [ ] 5.2 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 6. The cart drawer (grade10)

Needs group 1's bump.

- [ ] 6.1 Supply a reviewed line's remaining count from the count the review already returns, so the drawer states the cap it has always enforced — `proposal.md`, Impact
- [ ] 6.2 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`
