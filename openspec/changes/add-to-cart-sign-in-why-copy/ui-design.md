# UI: add to cart sign-in why copy

Behavior:
[product-listing delta](specs/grade10-site/store/product-listing/spec.md),
[product-page delta](specs/grade10-site/store/product-page/spec.md).
This change does not redraw Login Dialog; it names the title string the
application passes when Add to cart opens the existing dialog.

## Screens

### Product listing — signed-out Add to cart sign-in title

- **Sign-in overlay** —
  [Login Dialog `4666:1488`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4666-1488);
  Storybook `Auth Sign In/SignInCard` → **From add to cart**
- **Capability** — `grade10-site/store/product-listing`

Title string: **Sign in to add to cart**. Layout stays Login Dialog.

### Product details — signed-out Add to cart sign-in title

- **Sign-in overlay** —
  [Login Dialog `4666:1488`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4666-1488);
  Storybook `Auth Sign In/SignInCard` → **From add to cart**
- **Capability** — `grade10-site/store/product-page`

Same title string as the listing.

## Components

| Export | Package | Role |
| --- | --- | --- |
| `SignInCard` | `@grade10/ui` | Existing dialog; consumer passes `copy.title` |
| `SignInEmailForm` | `@grade10/ui` | Existing email step inside the dialog |

No new export, variant, or token. No new Figma component set.

**Missing / flagged for `tasks.md`**

| Missing | Kind | Where |
| --- | --- | --- |
| App passes `copy.title` **Sign in to add to cart** when opening from Add to cart | product | application |
| Grade10 `signIn.titleAddToCart` catalog key (en / zh-Hans / zh-Hant) | product | `@grade10/i18n` |

## States

| Surface state | Spec scenarios |
| --- | --- |
| Listing — Add to cart opens dialog titled Sign in to add to cart | `grade10-site-store-product-listing-SC-47` |
| Product page — Add to cart opens dialog titled Sign in to add to cart | `grade10-site-store-product-page-SC-29` |
