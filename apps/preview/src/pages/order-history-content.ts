import type { OrderHistoryCopy, OrderHistoryOrderSummary } from "@grade10/ui";
import { FIXTURE_PLACED_ON } from "../../../../packages/ui/src/lib/datetime-fixtures";

const IMAGE = new URL("./product.fixture.png", import.meta.url).href;

const ORDER_HISTORY_COPY: OrderHistoryCopy = {
  title: "Your Orders",
  activeHeading: "Active Orders",
  pastHeading: "Past Orders",
  emptyTitle: "No orders yet",
  emptyDescription: "When you place your first order, it will appear here",
  shopNow: "Shop Now",
  cardHeader: {
    trackOrder: "Track Order",
    viewDetails: "View Details",
  },
  status: {
    completed: "Completed",
    shipped: "Shipped",
    processing: "Processing",
    pickup: "Ready for Pickup",
    canceled: "Canceled",
    refunded: "Refunded",
  },
};

const LINE = {
  product: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5) × 2",
  total: "HK$210",
  imageSrc: IMAGE,
  imageAlt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
} as const;

const ACTIVE_ORDERS: readonly OrderHistoryOrderSummary[] = [
  {
    id: "ord-active-1",
    orderId: "Order #G10-10391",
    status: "shipped",
    date: FIXTURE_PLACED_ON,
    total: "Total: HK$1,770",
    trackOrder: true,
    lines: [
      { id: "a1", ...LINE },
      { id: "a2", ...LINE },
      { id: "a3", ...LINE },
    ],
  },
];

const PAST_ORDERS: readonly OrderHistoryOrderSummary[] = [
  {
    id: "ord-past-1",
    orderId: "Order #G10-10391",
    status: "completed",
    date: FIXTURE_PLACED_ON,
    total: "Total: HK$1,770",
    lines: [{ id: "p1", ...LINE }],
  },
  {
    id: "ord-past-2",
    orderId: "Order #G10-10391",
    status: "canceled",
    date: FIXTURE_PLACED_ON,
    total: "Total: HK$1,770",
    lines: [
      { id: "p2a", ...LINE },
      { id: "p2b", ...LINE },
    ],
  },
];

export { ACTIVE_ORDERS, ORDER_HISTORY_COPY, PAST_ORDERS };
