// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=5057-6691
// source=packages/ui/src/blocks/store-order-detail/order-details-header.tsx
// component=OrderDetailsHeader
import figma from "figma";

export default {
  example: figma.code`<OrderDetailsHeader orderId={orderId} status={status} statusLabel={statusLabel} placedOn={placedOn} />`,
  imports: ['import { OrderDetailsHeader } from "@grade10/ui"'],
  id: "order-details-header",
  metadata: { nestable: true },
};
