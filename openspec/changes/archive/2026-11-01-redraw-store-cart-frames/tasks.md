## 1. Hidden price words (grade10-spec)

- [x] 1.1 Add `salePriceLabel` and `listPriceLabel` to the shared store catalogue in every language, and read them visually hidden before each price on the cart line, the product page header and the product tile (`shared-ui-store-cart-SC-67`, `shared-ui-store-product-listing-SC-102`, `grade10-site-store-product-page-SC-39`)
- [x] 1.2 Prove the cart line in `Store/Cart/Blocks/CartItem/Price` Sale Price and Regular Price, and keep the preview copy and story fixtures supplying the words
- [x] 1.3 Verify: `pnpm --filter @grade10/ui run typecheck`, `pnpm --filter @grade10/design-system run typecheck`, the preview typecheck and `biome check` on the changed files

## 2. The Grade10 site (grade10)

- [x] 2.1 Supply the words from `store.salePriceLabel` and `store.listPriceLabel` to the cart drawer, the product page and its rail, the listing tiles and the home tiles

## 3. The walk (owner: @kinisworking)

- [x] 3.1 With a screen reader on the Grade10 site, read a struck price in the cart drawer, on a product tile and on the product page in English and Traditional Chinese, and hear the Sale price and Was words before the right amounts — blocked: needs a person with a screen reader against a running site
