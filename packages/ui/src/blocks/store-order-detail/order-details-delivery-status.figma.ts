// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=5010-6234
// source=packages/ui/src/blocks/store-order-detail/order-details-delivery-status.tsx
// component=OrderDetailsDeliveryStatus
import figma from "figma";

export default {
  example: figma.code`<OrderDetailsDeliveryStatus copy={copy} steps={steps} trackOrder={trackOrder} onTrackOrder={onTrackOrder} />`,
  imports: ['import { OrderDetailsDeliveryStatus } from "@grade10/ui"'],
  id: "order-details-delivery-status",
  metadata: { nestable: true },
};
