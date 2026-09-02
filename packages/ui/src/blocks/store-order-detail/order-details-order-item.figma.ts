// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=5010-6440
// source=packages/ui/src/blocks/store-order-detail/order-details-order-item.tsx
// component=OrderDetailsOrderItem
import figma from "figma";

const instance = figma.selectedInstance;

const status = instance.getBoolean("status", false);

export default {
  example: status
    ? figma.code`<OrderDetailsOrderItem product={product} subtotal={subtotal} quantity={quantity} total={total} lineStatus="refunded" statusLabel={statusLabel} statusMessage={statusMessage} struckThrough imageSrc={imageSrc} imageAlt={imageAlt} />`
    : figma.code`<OrderDetailsOrderItem product={product} subtotal={subtotal} quantity={quantity} total={total} couponCode={couponCode} imageSrc={imageSrc} imageAlt={imageAlt} />`,
  imports: ['import { OrderDetailsOrderItem } from "@grade10/ui"'],
  id: "order-details-order-item",
  metadata: { nestable: true },
};
