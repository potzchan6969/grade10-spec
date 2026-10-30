import type {
  OrderDetailsCopy,
  OrderDetailsDelivery,
  OrderDetailsLineItem,
  OrderDetailsPayment,
  OrderDetailsSummary,
} from "@grade10/ui";
import {
  FIXTURE_ORDER_PLACED_DAY,
  FIXTURE_ORDER_SHIPPED_DAY,
  FIXTURE_PLACED_ON_WITH_PERIOD,
  FIXTURE_REFUND_MESSAGE,
} from "../../../../../../packages/ui/src/lib/datetime-fixtures";

const IMAGE = new URL("../../product.fixture.png", import.meta.url).href;

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
      date: FIXTURE_ORDER_PLACED_DAY,
    },
    {
      label: "Shipping",
      date: FIXTURE_ORDER_SHIPPED_DAY,
    },
    {
      label: "Completed",
    },
  ],
};

const ORDER_DETAILS_LINES: readonly OrderDetailsLineItem[] = [
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

const ORDER_DETAILS_SUMMARY: OrderDetailsSummary = {
  subtotal: { label: "Subtotal", value: "$1,759.50" },
  refund: { label: "Refund", value: "−$105.00" },
  shipping: { label: "Shipping", value: "$50.00" },
  tax: { label: "Tax", value: "$0" },
  total: { label: "Total", value: "HK$1,704.50" },
};

const ORDER_DETAILS_CONTENT = {
  copy: ORDER_DETAILS_COPY,
  orderId: "Order #G10-10482",
  status: "shipped" as const,
  placedOn: FIXTURE_PLACED_ON_WITH_PERIOD,
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

/** A web order with one line refunded: the paid total stays, the refund shows apart. */
const PARTIAL_REFUND_CONTENT = {
  ...ORDER_DETAILS_CONTENT,
  orderId: "Order #G10-10455",
  status: "completed" as const,
  lines: [
    {
      id: "refund-line-1",
      product: "Pokémon TCG Sealed Booster Box – Ninja Spinner (M4)",
      subtotal: "HK$780",
      quantity: "1",
      total: "HK$780",
      imageSrc: IMAGE,
      imageAlt: "Pokémon TCG Sealed Booster Box – Ninja Spinner (M4)",
    },
    {
      id: "refund-line-2",
      product: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
      subtotal: "HK$105",
      quantity: "1",
      total: "HK$105",
      imageSrc: IMAGE,
      imageAlt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
      lineStatus: "refunded" as const,
      statusMessage: FIXTURE_REFUND_MESSAGE,
      struckThrough: true,
    },
  ] satisfies readonly OrderDetailsLineItem[],
  summary: {
    subtotal: { label: "Subtotal", value: "HK$885.00" },
    refund: { label: "Refund", value: "−HK$105.00" },
    total: { label: "Total", value: "HK$885.00" },
  } satisfies OrderDetailsSummary,
};

/** A web order refunded in full before a parcel left: every line is
 * struck, the steps end at Refunded, the paid total stays and the whole
 * amount reads as its Refund row. An order that will not earn shows no
 * points section — the page passes none. */
const FULL_REFUND_CONTENT = {
  ...ORDER_DETAILS_CONTENT,
  orderId: "Order #G10-10440",
  status: "refunded" as const,
  delivery: {
    variant: "delivery",
    trackOrder: false,
    steps: [
      {
        label: "Order Placed",
        date: FIXTURE_ORDER_PLACED_DAY,
        state: "completed",
      },
      {
        label: "Refunded",
        date: FIXTURE_ORDER_SHIPPED_DAY,
        state: "completed",
      },
    ],
  } satisfies OrderDetailsDelivery,
  lines: [
    {
      id: "refund-line-1",
      product: "Pokémon TCG Sealed Booster Box – Ninja Spinner (M4)",
      subtotal: "HK$780",
      quantity: "1",
      total: "HK$780",
      imageSrc: IMAGE,
      imageAlt: "Pokémon TCG Sealed Booster Box – Ninja Spinner (M4)",
      lineStatus: "refunded" as const,
      statusMessage: FIXTURE_REFUND_MESSAGE,
      struckThrough: true,
    },
    {
      id: "refund-line-2",
      product: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
      subtotal: "HK$105",
      quantity: "1",
      total: "HK$105",
      imageSrc: IMAGE,
      imageAlt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
      lineStatus: "refunded" as const,
      statusMessage: FIXTURE_REFUND_MESSAGE,
      struckThrough: true,
    },
  ] satisfies readonly OrderDetailsLineItem[],
  summary: {
    subtotal: { label: "Subtotal", value: "HK$885.00" },
    refund: { label: "Refund", value: "−HK$885.00" },
    total: { label: "Total", value: "HK$885.00" },
  } satisfies OrderDetailsSummary,
};

/** A point-of-sale order: the paid total only, with no web fields invented. */
const POINT_OF_SALE_CONTENT = {
  copy: ORDER_DETAILS_COPY,
  orderId: "Order #G10-10290",
  status: "completed" as const,
  placedOn: FIXTURE_PLACED_ON_WITH_PERIOD,
  placedOnDateTime: "2026-08-12",
  needHelp: { href: "#" },
  delivery: undefined,
  lines: [] satisfies readonly OrderDetailsLineItem[],
  summary: {
    total: { label: "Total", value: "HK$1,050.00" },
  } satisfies OrderDetailsSummary,
  payment: undefined,
  shippingAddress: undefined,
};

/** A web order paid partly with points: a Points row after the discount names the points used. */
const POINTS_CREDIT_CONTENT = {
  ...ORDER_DETAILS_CONTENT,
  summary: {
    subtotal: { label: "Subtotal", value: "HK$1,759.50" },
    discount: { label: "Discount (SUMMER10)", value: "−HK$175.95" },
    points: { label: "Points (100 pts)", value: "−HK$100.00" },
    shipping: { label: "Shipping", value: "HK$50.00" },
    total: { label: "Total", value: "HK$1,533.55" },
  } satisfies OrderDetailsSummary,
};

/** Draft words for the detail read states, not yet in `@grade10/i18n`. */
const ORDER_DETAILS_READ_COPY = {
  loading: "Loading order",
  notFoundTitle: "We couldn’t find this order",
  notFoundDescription:
    "Check the order number, or find the order in your orders.",
  /** The public link page presumes no account — point at the email. */
  notFoundLinkDescription: "Check the link in your order email.",
  backToOrders: "Back to My Orders",
  backToHome: "Back to Home",
  failed: "We couldn’t load this order.",
  retry: "Retry",
};

/** How long a retried order read takes in the workbench. */
const ORDER_DETAILS_READ_MS = 400;

export {
  FULL_REFUND_CONTENT,
  ORDER_DETAILS_CONTENT,
  ORDER_DETAILS_READ_COPY,
  ORDER_DETAILS_READ_MS,
  PARTIAL_REFUND_CONTENT,
  POINT_OF_SALE_CONTENT,
  POINTS_CREDIT_CONTENT,
};
