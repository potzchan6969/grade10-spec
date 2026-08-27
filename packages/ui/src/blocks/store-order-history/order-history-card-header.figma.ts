// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4863-8260
// source=packages/ui/src/blocks/store-order-history/order-history-card-header.tsx
// component=OrderHistoryCardHeader
import figma from "figma";

const instance = figma.selectedInstance;

const orderId = instance.getString("orderId");
const date = instance.getString("date");
const total = instance.getString("total");
const trackOrder = instance.getBoolean("trackOrder");

export default {
  example: figma.code`<OrderHistoryCardHeader copy={copy} orderId="${orderId}" status={status} statusLabel={statusLabel} date="${date}" total="${total}"${trackOrder ? figma.code` trackOrder onTrackOrder={onTrackOrder}` : ""} onViewDetails={onViewDetails} />`,
  imports: ['import { OrderHistoryCardHeader } from "@grade10/ui"'],
  id: "order-history-card-header",
  metadata: { nestable: true },
};
