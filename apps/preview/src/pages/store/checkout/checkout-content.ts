import type { OrderHistoryCopy, OrderHistoryOrderSummary } from "@grade10/ui";
import { FIXTURE_PLACED_ON } from "../../../../../../packages/ui/src/lib/datetime-fixtures";

const IMAGE = new URL("../../product.fixture.png", import.meta.url).href;

/** Your Orders copy, as the order history block names its own states. */
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

/** The paid order while the store settles it: visible, still polling, no new badge. */
const SETTLING_ORDERS: readonly OrderHistoryOrderSummary[] = [
  {
    id: "ord-settling-1",
    orderId: "Order #G10-10412",
    status: "processing",
    date: FIXTURE_PLACED_ON,
    total: "Total: HK$1,200",
    trackOrder: true,
    lines: [
      {
        id: "settling-1",
        product: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
        total: "HK$1,200",
        imageSrc: IMAGE,
        imageAlt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
      },
    ],
  },
];

/** Draft words for the Shopify step, a stand-in until the Shopify return is drawn. */
const SHOPIFY_CONFIRMATION = {
  title: "Thank you for your order",
  body: "Shopify has your payment. Your order shows in Your Orders while it settles.",
  action: "View Your Orders",
};

/** Draft words for the signed-out prompt; checkout is for members only. */
const SIGN_IN_PROMPT = {
  title: "Sign in to check out",
  body: "Checkout is for members. Sign in and your cart goes on to Shopify.",
  action: "Sign In",
};

export {
  ORDER_HISTORY_COPY,
  SETTLING_ORDERS,
  SHOPIFY_CONFIRMATION,
  SIGN_IN_PROMPT,
};
