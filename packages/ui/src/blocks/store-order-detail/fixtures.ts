import {
  FIXTURE_ORDER_PLACED_DAY,
  FIXTURE_ORDER_SHIPPED_DAY,
  FIXTURE_REFUND_MESSAGE,
} from "../../lib/datetime-fixtures";
import type {
  OrderDetailsCopy,
  OrderDetailsDelivery,
  OrderDetailsFulfillmentStatus,
  OrderDetailsLineItem,
  OrderDetailsSummary,
} from "./types";

const IMAGE = new URL("./product.fixture.png", import.meta.url).href;

const STATUS_LABELS: Record<OrderDetailsFulfillmentStatus, string> = {
  completed: "Completed",
  shipped: "Shipped",
  processing: "Processing",
  pickup: "Ready for Pickup",
  canceled: "Canceled",
  refunded: "Refunded",
};

const ORDER_DETAILS_COPY: OrderDetailsCopy = {
  needHelp: "Need help?",
  table: {
    items: "Items",
    subtotal: "Subtotal",
    quantity: "Qty",
    total: "Total",
  },
  sidebar: {
    orderSummary: "Order Summary",
    paymentMethod: "Payment Method",
    shippingAddress: "Shipping Address",
    pickupAddress: "Pickup Address",
    loyaltyPointsToEarn: "Points to Earn",
    loyaltyPointsEarned: "Points Earned",
  },
  delivery: {
    title: "Delivery Status",
    trackOrder: "Track Order",
  },
  status: STATUS_LABELS,
};

const DELIVERY_STEPS: OrderDetailsDelivery["steps"] = [
  {
    label: "Order Placed",
    date: FIXTURE_ORDER_PLACED_DAY,
  },
  {
    label: "Shipped",
    date: FIXTURE_ORDER_SHIPPED_DAY,
  },
  {
    label: "Completed",
  },
];

const PICKUP_STEPS: OrderDetailsDelivery["steps"] = [
  {
    label: "Order Placed",
    date: FIXTURE_ORDER_PLACED_DAY,
  },
  {
    label: "Pickup",
    date: FIXTURE_ORDER_SHIPPED_DAY,
  },
  {
    label: "Completed",
  },
];

const FILLED_DELIVERY: OrderDetailsDelivery = {
  variant: "delivery",
  steps: DELIVERY_STEPS,
  trackOrder: true,
};

const PICKUP_DELIVERY: OrderDetailsDelivery = {
  variant: "pickup",
  steps: PICKUP_STEPS,
  trackOrder: false,
};

/** Line item with an item-level coupon; discounted amounts are on the row only. */
const FILLED_LINES: readonly OrderDetailsLineItem[] = [
  {
    id: "line-1",
    product: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
    subtotal: "HK$94.50",
    quantity: "1",
    total: "HK$94.50",
    couponCode: "SUMMER10",
    imageSrc: IMAGE,
    imageAlt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
  },
  {
    id: "line-2",
    product: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
    subtotal: "HK$105",
    quantity: "1",
    total: "HK$105",
    imageSrc: IMAGE,
    imageAlt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
    lineStatus: "refunded",
    statusMessage: FIXTURE_REFUND_MESSAGE,
    struckThrough: true,
  },
  {
    id: "line-3",
    product: "Pokémon TCG Sealed Booster Box – Ninja Spinner (M4)",
    subtotal: "HK$780",
    quantity: "1",
    total: "HK$780",
    imageSrc: IMAGE,
    imageAlt: "Pokémon TCG Sealed Booster Box – Ninja Spinner (M4)",
  },
  {
    id: "line-4",
    product: "Pokémon TCG Sealed Booster Box – Storm Emeralda (M6)",
    subtotal: "HK$780",
    quantity: "1",
    total: "HK$780",
    imageSrc: IMAGE,
    imageAlt: "Pokémon TCG Sealed Booster Box – Storm Emeralda (M6)",
  },
];

/** Same lines at list price for an order-level discount story. */
const FILLED_LINES_ORDER_DISCOUNT: readonly OrderDetailsLineItem[] = [
  {
    id: "line-1",
    product: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
    subtotal: "HK$105",
    quantity: "1",
    total: "HK$105",
    imageSrc: IMAGE,
    imageAlt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
  },
  ...FILLED_LINES.slice(1),
];

/** Subtotal matches the sum of line totals; item promo is not repeated in discount. */
const FILLED_SUMMARY: OrderDetailsSummary = {
  subtotal: { label: "Subtotal", value: "HK$1,759.50" },
  refund: { label: "Refund", value: "−HK$105" },
  shipping: { label: "Shipping", value: "HK$50" },
  tax: { label: "Tax", value: "HK$0" },
  total: { label: "Total", value: "HK$1,704.50" },
};

/** List-price lines; order promo appears once in the summary with its code. */
const FILLED_SUMMARY_ORDER_DISCOUNT: OrderDetailsSummary = {
  subtotal: { label: "Subtotal", value: "HK$1,770" },
  discount: { label: "Discount (WELCOME10)", value: "−HK$177" },
  refund: { label: "Refund", value: "−HK$105" },
  shipping: { label: "Shipping", value: "HK$50" },
  tax: { label: "Tax", value: "HK$0" },
  total: { label: "Total", value: "HK$1,538" },
};

/**
 * Order promo plus points bill-credit — Points sits after Discount, matching
 * the cart drawer. Label carries the points deducted; value is the money credit.
 */
const FILLED_SUMMARY_WITH_POINTS: OrderDetailsSummary = {
  subtotal: { label: "Subtotal", value: "HK$1,770" },
  discount: { label: "Discount (WELCOME10)", value: "−HK$177" },
  points: { label: "Points (100 pts)", value: "−HK$100" },
  refund: { label: "Refund", value: "−HK$105" },
  shipping: { label: "Shipping", value: "HK$50" },
  tax: { label: "Tax", value: "HK$0" },
  total: { label: "Total", value: "HK$1,438" },
};

const FILLED_PAYMENT = {
  brand: "visa",
  maskedNumber: "···· 0561",
} as const;

const FILLED_ADDRESS = {
  name: "Alex Chen",
  lines: [
    "Flat 12B, Tower 3",
    "Harbour Centre, 25 Harbour Road",
    "Wan Chai, Hong Kong",
  ],
};

const FILLED_PICKUP_ADDRESS = {
  name: "Hong Kong Grade10 Store",
  lines: ["13 Pak Sha Road, Causeway Bay, Hong Kong"],
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=13+Pak+Sha+Road,+Causeway+Bay,+Hong+Kong",
  openingHours: "Open 11am – 9pm",
};

export {
  FILLED_ADDRESS,
  FILLED_DELIVERY,
  FILLED_LINES,
  FILLED_LINES_ORDER_DISCOUNT,
  FILLED_PAYMENT,
  FILLED_PICKUP_ADDRESS,
  FILLED_SUMMARY,
  FILLED_SUMMARY_ORDER_DISCOUNT,
  FILLED_SUMMARY_WITH_POINTS,
  IMAGE,
  ORDER_DETAILS_COPY,
  PICKUP_DELIVERY,
  PICKUP_STEPS,
  STATUS_LABELS,
};
