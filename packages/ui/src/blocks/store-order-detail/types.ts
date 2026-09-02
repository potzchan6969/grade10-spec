import type { ReactNode } from "react";
import type { OrderHistoryFulfillmentStatus } from "../store-order-history/types";

/** Figma Product / Order / Order Status axis (`4872:8537`). */
type OrderDetailsFulfillmentStatus = OrderHistoryFulfillmentStatus;

type OrderDetailsDeliveryStepState = "completed" | "current" | "upcoming";

type OrderDetailsDeliveryStep = {
  label: ReactNode;
  /** Omit on upcoming steps. */
  date?: ReactNode;
  state: OrderDetailsDeliveryStepState;
};

type OrderDetailsDelivery = {
  variant: "delivery" | "pickup";
  steps: readonly OrderDetailsDeliveryStep[];
  /** Show Track Order when true and `onTrackOrder` is provided. */
  trackOrder?: boolean;
};

type OrderDetailsLineItem = {
  id: string;
  product: ReactNode;
  subtotal: ReactNode;
  quantity: ReactNode;
  total: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  /** Line-level status (refunded or canceled split rows). */
  lineStatus?: OrderDetailsFulfillmentStatus;
  statusMessage?: ReactNode;
  /** Strike through subtotal and total when flagged. */
  struckThrough?: boolean;
};

type OrderDetailsSummaryRow = {
  label: ReactNode;
  value: ReactNode;
};

type OrderDetailsSummary = {
  subtotal: OrderDetailsSummaryRow;
  discount?: OrderDetailsSummaryRow;
  refund?: OrderDetailsSummaryRow;
  shipping?: OrderDetailsSummaryRow;
  tax?: OrderDetailsSummaryRow;
  total: OrderDetailsSummaryRow;
};

type OrderDetailsPaymentBrand =
  | "visa"
  | "mastercard"
  | "amex"
  | "apple-pay"
  | "google-pay";

type OrderDetailsPayment = {
  brand: OrderDetailsPaymentBrand;
  /** Masked card number (e.g. `···· 0561`). Omit for wallet-only rows. */
  maskedNumber?: ReactNode;
};

type OrderDetailsAddress = {
  name: ReactNode;
  lines: readonly ReactNode[];
};

type OrderDetailsTableCopy = {
  items: string;
  subtotal: string;
  quantity: string;
  total: string;
};

type OrderDetailsSidebarCopy = {
  orderSummary: string;
  paymentMethod: string;
  shippingAddress: string;
  pickupAddress: string;
  loyaltyPoints: string;
};

type OrderDetailsDeliveryCopy = {
  title: string;
  trackOrder: string;
};

type OrderDetailsCopy = {
  needHelp: string;
  table: OrderDetailsTableCopy;
  sidebar: OrderDetailsSidebarCopy;
  delivery: OrderDetailsDeliveryCopy;
  /** Labels keyed by fulfillment status. */
  status: Record<OrderDetailsFulfillmentStatus, string>;
};

export type {
  OrderDetailsAddress,
  OrderDetailsCopy,
  OrderDetailsDelivery,
  OrderDetailsDeliveryCopy,
  OrderDetailsDeliveryStep,
  OrderDetailsDeliveryStepState,
  OrderDetailsFulfillmentStatus,
  OrderDetailsLineItem,
  OrderDetailsPayment,
  OrderDetailsPaymentBrand,
  OrderDetailsSidebarCopy,
  OrderDetailsSummary,
  OrderDetailsSummaryRow,
  OrderDetailsTableCopy,
};
