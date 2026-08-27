// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4872-8325
// source=packages/ui/src/blocks/store-order-history/order-history-card.tsx
// component=OrderHistoryCard
import figma from "figma";

const instance = figma.selectedInstance;
const children = instance.getSlot("slot");

export default {
  example: figma.code`<OrderHistoryCard copy={copy} orderId={orderId} status={status} statusLabel={statusLabel} date={date} total={total} trackOrder={trackOrder} onTrackOrder={onTrackOrder} onViewDetails={onViewDetails}>${children}</OrderHistoryCard>`,
  imports: ['import { OrderHistoryCard } from "@grade10/ui"'],
  id: "order-history-card",
  metadata: { nestable: true },
};
