import type {
  OrderDetailsCopy,
  OrderDetailsDelivery,
  OrderDetailsLineItem,
  OrderDetailsPayment,
  OrderDetailsSummary,
} from "@grade10/ui";

const IMAGE = new URL("./product.fixture.png", import.meta.url).href;

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
  status: {
    completed: "Completed",
    shipped: "Shipped",
    processing: "Processing",
    pickup: "Ready for Pickup",
    canceled: "Canceled",
    refunded: "Refunded",
  },
};

const ORDER_DETAILS_DELIVERY: OrderDetailsDelivery = {
  variant: "delivery",
  trackOrder: true,
  steps: [
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
  ],
};

const ORDER_DETAILS_LINES: readonly OrderDetailsLineItem[] = [
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

const ORDER_DETAILS_SUMMARY: OrderDetailsSummary = {
  subtotal: { label: "Subtotal", value: "HK$1,770" },
  discount: { label: "Discount", value: "−HK$177" },
  refund: { label: "Refund", value: "−HK$105" },
  shipping: { label: "Shipping", value: "HK$50" },
  tax: { label: "Tax", value: "HK$0" },
  total: { label: "Total", value: "HK$1,538" },
};

const ORDER_DETAILS_CONTENT = {
  copy: ORDER_DETAILS_COPY,
  orderId: "Order #G10-10482",
  status: "shipped" as const,
  placedOn: "Placed on Aug 26, 2026.",
  placedOnDateTime: "2026-08-26",
  needHelp: { href: "#" },
  delivery: ORDER_DETAILS_DELIVERY,
  lines: ORDER_DETAILS_LINES,
  summary: ORDER_DETAILS_SUMMARY,
  payment: {
    brand: "visa",
    maskedNumber: "···· 0561",
  } satisfies OrderDetailsPayment,
  shippingAddress: {
    name: "Alex Chen",
    lines: [
      "Flat 12B, Tower 3",
      "Harbour Centre, 25 Harbour Road",
      "Wan Chai, Hong Kong",
    ],
  },
};

export { ORDER_DETAILS_CONTENT };
