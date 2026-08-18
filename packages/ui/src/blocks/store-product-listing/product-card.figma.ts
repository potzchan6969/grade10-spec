// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4200-155
// source=packages/ui/src/blocks/store-product-listing/product-card.tsx
// component=ProductCard
import figma from "figma";

const instance = figma.selectedInstance;

// Both VARIANT axes are boolean gates rather than a cva axis — the same shape
// RadioListItem uses for `isDisabled`. Hover is a CSS pseudo-state on the
// image well, not a prop. `isSoldOut=true, isAddedToCart=true` is not drawn.
const soldOut = instance.getEnum("isSoldOut", {
  false: false,
  true: true,
});

const addedToCart = instance.getEnum("isAddedToCart", {
  false: false,
  true: true,
});

// Discount is a BOOLEAN on the set, not a variant. Presence of `originalPrice`
// (and the nested badge label) is how the code expresses the same gate.
const hasDiscount = instance.getBoolean("hasDiscount");

const category = instance.getString("category");
const productName = instance.getString("productName");
const series = instance.getString("series");
const region = instance.getString("region");
const price = instance.getString("price");
const originalPrice = instance.getString("originalPrice");

export default {
  example: figma.code`<ProductCard tags={["${category}", "${series}", "${region}"]} name="${productName}" price="${price}"${hasDiscount ? figma.code` originalPrice="${originalPrice}" discountLabel="SALE"` : ""}${soldOut ? figma.code` soldOut` : ""}${!soldOut && addedToCart ? figma.code` addedToCart quantity={3}` : ""} />`,
  imports: ['import { ProductCard } from "@grade10/ui"'],
  id: "product-card",
  metadata: { nestable: true },
};
