// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4274-10074
// source=packages/ui/src/blocks/store-product-listing/product-card-image.tsx
// component=ProductCardImage
import figma from "figma";

const instance = figma.selectedInstance;

const soldOut = instance.getEnum("soldOut", {
  false: false,
  true: true,
});

const inCart = instance.getEnum("inCart", {
  false: false,
  true: true,
});

const sale = instance.getBoolean("sale");

// Hover is a CSS pseudo-state on the image well, not a prop.
instance.getEnum("state", {
  default: false,
  hover: false,
});

export default {
  example: figma.code`<ProductCardImage cartLabel={cartLabel}${sale && !soldOut ? figma.code` saleLabel="SALE"` : ""}${soldOut ? figma.code` soldOut soldOutLabel="SOLD OUT"` : ""}${!soldOut && inCart ? figma.code` inCart cartCount="1"` : ""} />`,
  imports: ['import { ProductCardImage } from "@grade10/ui"'],
  id: "product-card-image",
  metadata: { nestable: true },
};
