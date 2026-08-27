// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4872-8537
// source=packages/ui/src/blocks/store-order-history/order-history-status.tsx
// component=OrderHistoryStatus
import figma from "figma";

const instance = figma.selectedInstance;

const status = instance.getEnum("status", {
  completed: "completed",
  shipped: "shipped",
  pending: "pending",
  canceled: "canceled",
  refunded: "refunded",
});

export default {
  example: figma.code`<OrderHistoryStatus status="${status}">{label}</OrderHistoryStatus>`,
  imports: ['import { OrderHistoryStatus } from "@grade10/ui"'],
  id: "order-history-status",
  metadata: { nestable: true },
};
