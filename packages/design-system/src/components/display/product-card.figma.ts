// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4200-155
// source=packages/design-system/src/components/display/product-card.tsx
// component=ProductCard
import figma from "figma";

const instance = figma.selectedInstance;

// `isSoldOut` is this set's only VARIANT axis. Both options map to a boolean
// gate rather than a cva axis — the same shape RadioListItem uses for
// `isDisabled`. Hover is a CSS pseudo-state on the image well, not a prop.
const soldOut = instance.getEnum("isSoldOut", {
  false: false,
  true: true,
});

// Discount is a BOOLEAN on the set, not a variant. Presence of `originalPrice`
// (and the nested badge label) is how the code expresses the same gate.
const hasDiscount = instance.getBoolean("hasDiscount");

const category = instance.getString("category");
const productName = instance.getString("productName");
const description = instance.getString("description");
const price = instance.getString("price");
const originalPrice = instance.getString("originalPrice");

export default {
  example: figma.code`<ProductCard category="${category}" name="${productName}" description="${description}" price="${price}"${hasDiscount ? figma.code` originalPrice="${originalPrice}" discountLabel="−15%"` : ""}${soldOut ? figma.code` soldOut` : ""} />`,
  imports: ['import { ProductCard } from "@grade10/design-system"'],
  id: "product-card",
  metadata: { nestable: true },
};
