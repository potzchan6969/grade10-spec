// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4901-3026
// source=packages/ui/src/blocks/store-order-history/order-history-line-item.tsx
// component=OrderHistoryLineItem
import figma from "figma";

const instance = figma.selectedInstance;

const product = instance.getString("product");
const total = instance.getString("total");

export default {
  example: figma.code`<OrderHistoryLineItem product="${product}" total="${total}" imageSrc={imageSrc} imageAlt={imageAlt} />`,
  imports: ['import { OrderHistoryLineItem } from "@grade10/ui"'],
  id: "order-history-line-item",
  metadata: { nestable: true },
};
