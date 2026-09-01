import type {
  OrderHistoryFulfillmentStatus,
  OrderHistoryLineSummary,
  OrderHistoryOrderSummary,
} from "./types";
import { FIXTURE_PLACED_ON } from "../../lib/datetime-fixtures";

const IMAGE = new URL("./product.fixture.png", import.meta.url).href;

const STATUS_LABELS: Record<OrderHistoryFulfillmentStatus, string> = {
  completed: "Completed",
  shipped: "Shipped",
  processing: "Processing",
  pickup: "Ready for Pickup",
  canceled: "Canceled",
  refunded: "Refunded",
};

const LINE_A: OrderHistoryLineSummary = {
  id: "line-1",
  product: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5) × 2",
  total: "HK$210",
  imageSrc: IMAGE,
  imageAlt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
};

const LINE_B: OrderHistoryLineSummary = {
  id: "line-2",
  product: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5) × 2",
  total: "HK$210",
  imageSrc: IMAGE,
  imageAlt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
};

const LINE_C: OrderHistoryLineSummary = {
  id: "line-3",
  product: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5) × 2",
  total: "HK$210",
  imageSrc: IMAGE,
  imageAlt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
};

const ACTIVE_ORDER: OrderHistoryOrderSummary = {
  id: "ord-active-1",
  orderId: "Order #G10-10391",
  status: "shipped",
  date: FIXTURE_PLACED_ON,
  total: "Total: HK$1,770",
  trackOrder: true,
  lines: [LINE_A, LINE_B, LINE_C],
};

const PAST_COMPLETED: OrderHistoryOrderSummary = {
  id: "ord-past-1",
  orderId: "Order #G10-10391",
  status: "completed",
  date: FIXTURE_PLACED_ON,
  total: "Total: HK$1,770",
  lines: [LINE_A],
};

const PAST_CANCELED: OrderHistoryOrderSummary = {
  id: "ord-past-2",
  orderId: "Order #G10-10391",
  status: "canceled",
  date: FIXTURE_PLACED_ON,
  total: "Total: HK$1,770",
  lines: [LINE_A, LINE_B],
};

const ORDER_HISTORY_COPY = {
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
  status: STATUS_LABELS,
};

export {
  ACTIVE_ORDER,
  IMAGE,
  ORDER_HISTORY_COPY,
  PAST_CANCELED,
  PAST_COMPLETED,
  STATUS_LABELS,
};
