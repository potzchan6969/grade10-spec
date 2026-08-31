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
    loyaltyPoints: "Loyalty Points",
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
    date: "Aug 26, 2026",
    state: "completed",
  },
  {
    label: "Shipped",
    date: "Aug 27, 2026",
    state: "current",
  },
  {
    label: "Completed",
    state: "upcoming",
  },
];

const PICKUP_STEPS: OrderDetailsDelivery["steps"] = [
  {
    label: "Order Placed",
    date: "Aug 26, 2026",
    state: "completed",
  },
  {
    label: "Ready for Pickup",
    date: "Aug 27, 2026",
    state: "current",
  },
  {
    label: "Completed",
    state: "upcoming",
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

const FILLED_LINES: readonly OrderDetailsLineItem[] = [
  {
    id: "line-1",
    product: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
    subtotal: "HK$105",
    quantity: "1",
    total: "HK$105",
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
    statusMessage: "Out of stock. Refund issued on Aug 28",
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

const FILLED_SUMMARY: OrderDetailsSummary = {
  subtotal: { label: "Subtotal", value: "HK$1,770" },
  discount: { label: "Discount", value: "−HK$177" },
  refund: { label: "Refund", value: "−HK$105" },
  shipping: { label: "Shipping", value: "HK$50" },
  tax: { label: "Tax", value: "HK$0" },
  total: { label: "Total", value: "HK$1,538" },
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

export {
  FILLED_ADDRESS,
  FILLED_DELIVERY,
  FILLED_LINES,
  FILLED_PAYMENT,
  FILLED_SUMMARY,
  IMAGE,
  ORDER_DETAILS_COPY,
  PICKUP_DELIVERY,
  PICKUP_STEPS,
  STATUS_LABELS,
};
