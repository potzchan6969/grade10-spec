# Technical design: Store product not-found state

## Context

The Grade10 product route already has the correct server-side refusal boundary.
`apps/frontend/grade10/src/routes/store-product.tsx` asks the catalogue for the
handle in its loader and throws a `Response` with status `404` when no product
is returned. Its `ErrorBoundary` currently turns that response into the shared
`NotFoundPage`, so the status is correct but the presentation is the generic
site-wide state.

The route is rendered inside the root `SiteShell`. That shell owns the existing
Store header and footer, while `NotFoundPage` owns the generic not-found copy
and Home recovery action. The route table's catch-all still sends arbitrary
unknown addresses to the generic not-found route. The Storybook
`UnknownProductAddress` story is the visual reference for the product-specific
state: a heading, explanatory text, and a Browse the store action, with no
product detail or add-to-cart content.

## Goals / Non-Goals

### Goals

- Keep the product loader's existing catalogue lookup and thrown `404`
  response, including its server-rendered status.
- Replace only the product route's `404` presentation with the
  Storybook-aligned unknown-product state inside the existing `SiteShell`.
- Keep the existing design-system `Button` as the action owner and point the
  action at the locale-aware Store product listing in the same tab.
- Resolve the product-specific title, description, and action label through
  the existing Grade10 `product` catalog for every supported Grade10 locale.
- Keep the state free of product details, purchase controls, add-to-cart
  controls, and related-product content.
- Leave the generic `NotFoundPage` and the catch-all behavior for unrelated
  unknown addresses unchanged.

### Non-Goals

- Changing product lookup, handle validation, response status, route matching,
  redirects, or the meaning of a missing product.
- Adding a shared `@grade10/ui` export, primitive, token, provider, or a new
  Storybook screen.
- Changing the shared generic not-found copy or its Home recovery action.
- Changing the normal Store shell's existing header/footer behavior. Shell-owned
  controls remain shell-owned; the unknown-product page content must not add
  product or cart controls of its own.

## Decisions

### Preserve the loader and specialize only the 404 boundary

The existing `loader` remains the source of the `404` response. The product
route's `ErrorBoundary` will continue to recognize only a route error with
status `404`, but will render a route-local unknown-product presentation for
that branch. Non-404 errors continue to be rethrown. This keeps status and
server/loader behavior independent from the replacement UI and avoids turning
the state into a successful or redirected response.

### Compose the state below the existing shell

The replacement is page content returned from the product route boundary. It
does not replace `SiteShell`, `SiteHeader`, or `Footer`, and it does not call
the generic `NotFoundPage`. The shell's current global behavior, including any
header affordance it owns for the Store surface, is not reimplemented or
changed; the unknown-product content itself contains no product/cart controls,
product detail, add-to-cart action, or related rail.

### Use existing Button ownership and a listing link

The recovery action uses the existing design-system `Button` and the existing
locale-aware site-address helper for the `storeCollections` surface. It is a
same-tab link with no redirect or new navigation abstraction. This keeps the
destination aligned with the active locale and leaves the button's styling and
accessibility behavior with its current owner.

### Add copy to the existing Grade10 product catalog

The title, description, and browse-action words are added to the existing
Grade10 `product` message catalog for `en`, `zh-Hant`, and `zh-Hans`. The
English values follow the Storybook reference: “We couldn’t find this
product”, “Check the address, or browse the store for what is available.”, and
“Browse the store”. The route reads the messages from the existing product
namespace; it does not embed English fallback copy or reuse the shared generic
`notFound` namespace.

### Keep route scope narrow

The route table and generic catch-all route remain unchanged. A missing handle
under the Store product route gets the product-specific state; an arbitrary
unknown address that is not matched to an owned surface continues to get the
generic site-wide `404` surface.

## Risks / Trade-offs

- **A presentation-only change could accidentally change the response status**
  → Keep the loader's thrown `Response` intact and assert `status === 404` in
  the prerender coverage.
- **The product state could drift from the Storybook contract**
  → Assert the heading, description, listing action, shell header/footer, and
  absence of add-to-cart/product controls in the route-level rendered output.
- **The listing action could lose locale or same-tab behavior**
  → Build its destination with the existing locale-aware `storeCollections`
  address and test the rendered anchor rather than using a redirect callback.
- **The new state could leak into unrelated not-found pages**
  → Preserve the catch-all route and retain a regression assertion for an
  arbitrary unknown address using the generic title and description.
- **One locale could be left without the product-specific words**
  → Add catalog completeness coverage for all supported Grade10 locales before
  adding the route presentation.
