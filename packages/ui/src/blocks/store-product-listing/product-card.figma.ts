// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4200-155
// source=packages/ui/src/blocks/store-product-listing/product-card.tsx
// component=ProductCard
import figma from "figma";

const instance = figma.selectedInstance;

const soldOut = instance.getEnum("soldOut", {
  false: false,
  true: true,
});

const hasDiscount = instance.getBoolean("hasDiscount");

const productName = instance.getString("productName");
const price = instance.getString("price");
const originalPrice = instance.getString("originalPrice");

// Badge instances the consumer dropped into the published slot, in order.
const badges = instance.getSlot("cardProps");

export default {
  example: figma.code`<ProductCard name="${productName}" price="${price}" cartLabel={cartLabel}${hasDiscount ? figma.code` originalPrice="${originalPrice}" saleLabel="SALE"` : ""}${soldOut ? figma.code` soldOut soldOutLabel="SOLD OUT"` : ""}${badges ? figma.code` badges={${badges}}` : ""} />`,
  imports: ['import { ProductCard } from "@grade10/ui"'],
  id: "product-card",
  metadata: { nestable: true },
};
