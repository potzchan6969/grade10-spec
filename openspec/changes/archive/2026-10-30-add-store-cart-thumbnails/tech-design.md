## Current Product Picture Delivery

The [cart drawer requirements](specs/grade10-site/store/cart-drawer/spec.md) own the reviewed picture outcome. The [shared cart requirements](specs/shared/ui/store-cart/spec.md) own presentation of supplied picture props. The existing cart review remains the source of current display facts; the cart intent remains image-free.

- **Catalogue read** - Add `product { id handle title images(first: 1) { nodes { url altText width height } } }` to the existing `GET_VARIANTS` selection. Extend its codec and `toCatalogVariant` with the existing image codec and `ProductImage` mapper. A returned product must include the requested image connection; no pictures becomes `images: []`. Keep null nodes, non-variant nodes and malformed-identity refusal as they work now. `FixtureCatalog.getVariants` returns the product's first image through the same normalized shape. This remains one batched variant read.
- **Reviewed facts** - Add optional `imageSrc` and `imageAlt` strings to `reviewedLineSchema`. After `toReviewedLine` classifies each intent in `reviewCatalogLines`, copy the matching live variant's first product image URL unchanged and its non-empty alt text. Omit both fields without a live variant or image. `toReviewedLineWire` already removes only its internal `live` field, so member and guest review, basket quote and checkout result adapters retain the additive fields. Do not put them on `cartLineSchema`, cart rows, browser intent, add/set/merge inputs or `applyReview`.
- **Drawer join** - Extend only `ReviewedCartLine` with the optional picture fields. `reviewedLines` copies them in its confirmed branch, which already joins by variant ID and checks requested quantity. Its unreviewed branch supplies no picture; removed lines are absent. `toCartItemSummary` forwards the optional fields to the shared `CartItemSummary`. Existing scope and refetch rules discard old review facts; `CartDrawerHost` adds no image request or cache.
- **Shared presentation** - `CartItemSummary` already accepts `imageSrc?: string` and `imageAlt?: string`. The shared `CartItem` already renders an image for a truthy source, uses `imageAlt || item.name`, and renders the placeholder for an omitted or empty source. This keeps non-empty whitespace-only alt text unchanged. The thumbnail remains an `aria-hidden` button outside the tab order; the adjacent name button is the accessible product action. Add deterministic served image assets and stories, not a new component variant or visual treatment.
- **Fixtures** - Keep raw Shopify query fixtures, hand-built `CatalogVariant` values, `FixtureCatalog`, and the frontend procedure fixture aligned with the selected first product image. The frontend fixture's reviewed result gets picture fields from its matching product after classification. Use a controlled asset for browser loading assertions instead of depending on a live CDN.

## Service Interfaces

| Boundary | Input | Success | Failure And Side Effects |
| --- | --- | --- | --- |
| Shopify variant batch | Existing variant IDs | Normalized variants with at most the first product image | Existing catalogue fault; no extra request or write |
| Cart review | Existing image-free intents | Existing classified lines plus optional picture fields from their live variants | Existing catalogue and currency outcomes; no image persistence |
| Reviewed-line wire | Internal reviewed line | Optional `imageSrc` and `imageAlt`; excludes `live` | Member and guest review, basket quote and checkout result use the shared serializer |
| Frontend join | Current cart and decoded review | Confirmed matching lines forward picture props to shared UI | Existing unreviewed, quantity and scope guards |

For variant `gid://shopify/ProductVariant/41`, a first product image URL `https://cdn.example.test/card.jpg?v=7` and alt `Card front` reaches that variant's reviewed line and shared item unchanged. A different variant in the batch does not receive it. An unavailable variant or a product with no image omits both fields.

## API Compatibility

| Reviewed-line field | Shape | Absence |
| --- | --- | --- |
| `imageSrc` | Optional string | No image or live variant |
| `imageAlt` | Optional string | No non-empty catalogue alt text |

Legacy reviewed-line responses remain valid for the new production decoder. Enriched responses remain valid for the previous production decoder, which may discard unknown fields. Tests use the actual previous schema and each current response path, including guest `quote.reviewItems`, member `cart.review`, basket quote and checkout results. A supplied `null` or non-string picture field fails current decoding. Regenerate affected API references through the existing generator.

## Risks And Verification

- **Wrong picture** - A reordered review, removed line or unconfirmed current line must not borrow another variant's image. Assert the ID join and quantity guard with those inputs.
- **Hidden wire loss** - Assert the query selection, raw response decoding, normalized variant, serializer and production response decoding separately; fixtures alone cannot prove the live path.
- **Changed cart facts** - Compare statuses, quantities, prices, totals, badge count and checkout readiness with and without images. Assert that review and quantity edits leave stored member and guest intent and write inputs image-free.
- **Image resource failure** - A browser image load can fail after review succeeds. Keep the current browser presentation and accepted cart facts; do not turn it into a catalogue-review error. Browser evidence checks loaded bytes for the controlled success path.
- **Shared pin** - Land and verify the shared stories in grade10-spec before selecting its published main SHA in grade10. Recheck the app after moving the gitlink while preserving unrelated nested work.

## Delivery And Reversal

1. Land controlled shared stories and assets in grade10-spec. Catalogue, contract and backend review work in grade10 can proceed independently.
2. Add the optional backend fields, then the frontend join and shared pin. Decoder compatibility allows old and enriched responses during rollout in either order once both production schemas are tested.
3. Walk a restored image-free member cart, a pictured and a pictureless product, sold-out treatment, alt fallback and failed review at narrow and wide widths. Check batch count, malformed fields and persistence in runtime tests.
4. Reverting either application side returns to placeholder pictures without a data migration or storage clearing. No production operation is part of this plan.
