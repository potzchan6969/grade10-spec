// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4274-10074
// source=packages/ui/src/blocks/store-product-listing/product-card-image.tsx
// component=ProductCardImage
import figma from "figma";

const instance = figma.selectedInstance;

const soldOut = instance.getEnum("soldOut", {
  false: false,
  true: true,
});

// The set has no `inCart` property — its axes are `state` and `soldOut`, plus
// the BOOLEAN `sale`. In-cart chrome is an annotation on the set, not a rung,
// so it stays a code-only prop, as it does on `ProductCard`.

const sale = instance.getBoolean("sale");

// Hover is a CSS pseudo-state on the image well, not a prop.
instance.getEnum("state", {
  default: false,
  hover: false,
});

export default {
  // The badge words are the same on every tile, so they arrive in `copy`
  // rather than per instance; the variant decides only which badge is drawn.
  example: figma.code`<ProductCardImage copy={copy}${sale && !soldOut ? figma.code` discounted` : ""}${soldOut ? figma.code` soldOut` : ""} />`,
  imports: ['import { ProductCardImage } from "@grade10/ui"'],
  id: "product-card-image",
  metadata: { nestable: true },
};
