# UI: require sign-in to add to cart

Behavior:
[product-listing delta](specs/grade10-site/store/product-listing/spec.md),
[product-page delta](specs/grade10-site/store/product-page/spec.md).
This change does not redraw the listing or the product page; it opens the
existing sign-in dialog when a signed-out collector activates Add to cart.
How the session check and resume wire is
[tech-design.md](tech-design.md) once written.

## Screens

### Product listing — signed-out Add to cart

- **Listing layout** —
  [Product Listing — the browse page `4098:1868`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4098-1868)
  and [Product Card `4200:155`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4200-155);
  Storybook `pages-product-list-page--default` /
  `Store Product Listing/ProductCardImage`
- **Sign-in overlay** —
  [Login Dialog `4666:1488`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4666-1488);
  Storybook `Auth Sign In/SignInCard`
- **Capability** — `grade10-site/store/product-listing`

The listing chrome and cart control stay as
`show-listing-cart-on-touch` and sibling listing changes draw them. This
change only summons sign-in over that surface.

### Product details — signed-out Add to cart

- **Page layout** —
  [Product Detail `4098:2423`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4098-2423);
  Storybook `pages-product-detail-page--docs` (and redesign SoT in
  `redesign-store-product-detail-page`)
- **Sign-in overlay** —
  [Login Dialog `4666:1488`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4666-1488);
  Storybook `Auth Sign In/SignInCard`
- **Capability** — `grade10-site/store/product-page`

The buy rail and Add to cart control stay as the product-page redesign draws
them. This change only summons sign-in over that surface.

## Components

| Export | Package | Role |
| --- | --- | --- |
| `SignInCard` | `@grade10/ui` | Existing modal dialog over a scrim; consumer owns `open` / `onOpenChange` |
| `SignInEmailForm` | `@grade10/ui` | Existing email step inside the dialog |
| `ProductCard` / `ProductCardImage` | `@grade10/ui` | Existing listing tile and cart control; still report quantity to the consumer |
| `Button` | `@grade10/design-system` | Existing product-page Add to cart control (redesign composition) |
| `Stepper` | `@grade10/design-system` | Existing product-page quantity control |

No new `@grade10/ui` or `@grade10/design-system` export, variant, or token.
No new Figma component set — Login Dialog and Product Card / Product Detail
frames already exist.

**Missing / flagged for `tasks.md`**

| Missing | Kind | Where |
| --- | --- | --- |
| App opens `SignInCard` from signed-out listing Add to cart and resumes the add after success | product | application |
| App opens `SignInCard` from signed-out product-page Add to cart and resumes the add after success | product | application |

## States

| Surface state | Spec scenarios |
| --- | --- |
| Listing — signed-out Add to cart opens Login Dialog; no line added | `grade10-site-store-product-listing-SC-44` |
| Listing — dismiss dialog; still signed out; cart unchanged | `grade10-site-store-product-listing-SC-45` |
| Listing — sign-in succeeds on the listing; dialog closes; member cart holds the add | `grade10-site-store-product-listing-SC-46` |
| Product page — signed-out Add to cart opens Login Dialog; no line added | `grade10-site-store-product-page-SC-26` |
| Product page — dismiss dialog; still signed out; cart unchanged | `grade10-site-store-product-page-SC-27` |
| Product page — sign-in succeeds on the page; dialog closes; member cart holds the add | `grade10-site-store-product-page-SC-28` |
