# Tasks: align product listing tiles

Group 1 lands first; groups 2 and 3 need those primitives. Group 4 depends on
groups 2 and 3. No application-repo group: nothing in grade10 imports these
exports yet.

## 1. Design-system primitives

- [x] 1.1 Make `An in-cart count is displayed as supplied` possible by adding
      `StatusIndicator` under `packages/design-system/src/components/display/`
      with Figma axes `type` (`dot`, `count`) and `variant` (`default`,
      `error`), colocated `.tsx`, `.figma.ts`, and `.stories.tsx`, and an
      export from the package entry.
- [x] 1.2 Cover every `type` × `variant` rung in stories, including a `count`
      rung whose label is consumer-supplied rather than hardcoded.
- [x] 1.3 Add Figma-defined `IconButton` rungs `variant="secondary"` and
      `size="md"` so the cart control can use them, keep `ghost` / `xs`, and
      extend the Icon Button stories and Code Connect template to the new
      rungs.
- [x] 1.4 Run `pnpm run typecheck` and `pnpm run lint` (pass).
      `pnpm run check:design-system` is blocked on `FIGMA_TOKEN` (or
      `FIGMA_DUMP`); the known `xs` vs Figma `md` / `sm` mismatch is recorded
      in design.md.

## 2. Product card image

Depends on group 1.

- [x] 2.1 Make `An application imports the surface` and `A part is reused
      alone` pass for `ProductCardImage` and `ProductCardImageProps` exported
      from the package entry.
- [x] 2.2 Make `No image source`, `A sale label is displayed as supplied`, and
      `A sold-out product` pass on `ProductCardImage` — clipped square well,
      consumer-supplied sale and sold-out labels, no fallback photo, no
      built-in copy.
- [x] 2.3 Make `An in-cart count is displayed as supplied`, `A cart action is
      reported, not performed`, and `Keyboard reveals the cart control` pass
      by composing `IconButton` and `StatusIndicator`, keeping the cart
      control outside the tile-activation target.
- [x] 2.4 Make `The image is reused alone` pass with colocated stories for
      default, sale, sold-out, in-cart, no-image, and a keyboard play
      interaction, then run this repository's UI story checks.

## 3. Product card and product list

Depends on group 2.

- [x] 3.1 Make `Prices are displayed as supplied`, `Badges are displayed as
      supplied`, `No original price`, and `A sold-out product` pass on
      `ProductCard` — image, badge slot, name, prices; no category,
      description, Add, wishlist, or quantity stepper.
- [x] 3.2 Make `The product list displays product tiles and delegates every
      product action` pass by reshaping `ProductSummary` to the fields in
      design.md and mapping them through `ProductList`, reporting tile
      activation and the cart action only.
- [x] 3.3 Make `A cart action is reported, not performed` pass on `ProductList`
      without an `Add` button, and drop `onProductWishlistClick` and
      `onProductQuantityChange` from `ProductBrowse` so the browse root still
      typechecks.
- [x] 3.4 Rewrite `product-card.figma.ts` to the published card properties
      (`productName`, `price`, `originalPrice`, `hasDiscount`, `cardProps`,
      `soldOut`) and add `product-card-image.figma.ts` for the image set.
- [x] 3.5 Update the card, list, and browse stories and fixtures, then run
      `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test:stories:ui`.

## 4. Preview assembly

Depends on group 3.

- [x] 4.1 Make the preview listing page compile against the new `ProductSummary`
      and browse callbacks, with no leftover Add, wishlist, or stepper
      fixtures.
- [x] 4.2 Run `pnpm run typecheck` and `pnpm run test:stories:app`.

## 5. Delivery and review

- [x] 5.1 Verify every scenario in the delta, then run
      `openspec validate align-product-listing-tiles` and
      `openspec validate --specs`.
- [x] 5.2 Review the branch for convention drift and for delta coverage
      separately: requirements missing, partial, or implemented differently
      than specified.
- [ ] 5.3 After rollout is confirmed, fold the accepted delta into
      `openspec/specs/` and archive this change.
