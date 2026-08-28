// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4835-1654
// source=packages/ui/src/blocks/store-order-detail/order-details.tsx
// component=OrderDetails
import figma from "figma";

export default {
  example: figma.code`<OrderDetails copy={copy} orderId={orderId} status={status} placedOn={placedOn} lines={lines} summary={summary} payment={payment} />`,
  imports: ['import { OrderDetails } from "@grade10/ui"'],
  id: "order-details",
};
