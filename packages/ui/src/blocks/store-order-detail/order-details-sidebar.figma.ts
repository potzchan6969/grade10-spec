// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=5057-6908
// source=packages/ui/src/blocks/store-order-detail/order-details-sidebar.tsx
// component=OrderDetailsSidebar
import figma from "figma";

export default {
  example: figma.code`<OrderDetailsSidebar copy={copy} summary={summary} payment={payment} shippingAddress={shippingAddress} pickupAddress={pickupAddress} loyaltyPoints={loyaltyPoints} />`,
  imports: ['import { OrderDetailsSidebar } from "@grade10/ui"'],
  id: "order-details-sidebar",
  metadata: { nestable: true },
};
