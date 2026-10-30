## Goals

- Give a missing product handle the Store-specific not-found treatment shown in the supplied Product Detail story.
- Preserve the product route's 404 response and give the collector a direct way back to the product listing.
- Keep unrelated unknown addresses on the generic site-wide not-found surface.

## Non-Goals

- Changing the generic site-wide not-found copy, layout, status handling or Back to Home action.
- Changing the product handle format, catalogue lookup, provider response or the meaning of a product 404.
- Adding a new shared `@grade10/ui` not-found block, design-system primitive, token or Figma frame.
- Adding product recommendations, a redirect to the Store home, or a product/cart control to the missing-product state.
- Changing not-found behavior for orders, auctions or any route other than the Store product route.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which failed addresses receive the Store-specific treatment? | Only a known Store product route whose catalogue lookup returns no product; addresses under no owned surface continue using the generic site not-found surface - decided by the round | Applying the product copy to every 404, which would blur route ownership and change the settled site navigation contract |
| Q2 | What happens to the HTTP and navigation contract? | The product URL remains a 404, stays inside the existing Store shell, and offers a same-tab action to the product listing without redirecting automatically - decided by the round | Returning 200 for an empty product page, redirecting to Home, or treating the missing handle as a generic route miss |
| Q3 | Which visible copy and recovery action define the state? | Match Storybook `UnknownProductAddress`: “We couldn’t find this product”, “Check the address, or browse the store for what is available.”, and “Browse the store” to the product listing - decided by the supplied design reference | Reusing “Nothing is here”, “The link may be wrong, or the page may have moved.”, and “Back to Home”, which are for an address under no surface |
| Q4 | Where does the state live? | Keep the state as a Grade10 product-page assembly that reuses the existing shell and `Button`; add no new shared `@grade10/ui` export - decided by the existing Storybook composition and component ownership rules | Replacing or widening the global `NotFoundPage`, which would make unrelated routes inherit Store-specific language |
| Q5 | How is the copy delivered? | Add the product-specific words to the Grade10 message catalogs for every supported Grade10 locale, with the Storybook English words as the reference copy - decided by the repository localization contract | Keeping production copy inline in the route or changing the shared generic `notFound` catalog |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
