# Tasks: A card is bought where it is read

Every group lands in grade10. Nothing here touches grade10-spec: every
component the buy box needs is already exported, and the page composes them
itself — design.md, *The buy box is composed in the app*.

Group 1 is the whole of the behaviour; group 2 confirms it where a collector
would meet it. There is no shared-interface group, because no contract
changes: `useCart` and `pricedVariant` are what the storefront already
publishes.

## 1. Buying from a card's page (grade10) (owner: @sean)

- [x] 1.1 Make `A card with one thing to buy needs no choice` pass: the card's page carries the grades it lists as one choosable group, opening on the variant it already prices, and a card with one variant for sale needs nothing chosen.
- [x] 1.2 Make `A collector adds the grade they chose` pass: adding builds the cart line from the chosen variant — the same line the grid's tile builds, so one card cannot read two ways in the cart — and reaches `useCart`'s add.
- [x] 1.3 Make `The collector keeps their place` pass: adding leaves the collector on the card's address, and the page says what the cart holds without a count in the served document that the browser would then disagree with.
- [x] 1.4 Make `The same card twice` pass from the page: a second add of the same grade is one line with the quantity gained, which is what `AddToCart` already does — prove it through the page rather than answer it again.
- [x] 1.5 Make `One grade sold, another still for sale` pass: a variant not for sale is rendered unchoosable rather than dropped, and choosing it offers no add.
- [x] 1.6 Make `Nothing on the card is for sale` pass: a card with no variant for sale says so where the buying goes, keeps every price it lists, and offers nothing to press.
- [x] 1.7 Hold the page's serving where it was: the card still answers whole before any script runs, with `serving/prerender.test.tsx` and `serving/hydration.test.tsx` green over the page the buy box is now part of.
- [x] 1.8 Verification: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`.

## 2. Confirm on staging (grade10) (owner: @sean)

- [x] 2.1 Deploy to staging and confirm against the preview: a card with several grades adds the one chosen, a sold-out grade cannot be chosen, a card with nothing for sale offers no add, and the card's document still carries its name, description and every price with scripts disabled.
