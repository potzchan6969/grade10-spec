import { describe, expect, it } from "vitest";
import type {
  OrderDetailsAddress,
  OrderDetailsDelivery,
  OrderDetailsDeliveryStatusProps,
  OrderDetailsDeliveryStep,
  OrderDetailsFulfillmentStatus,
  OrderDetailsHeaderProps,
  OrderDetailsLineItem,
  OrderDetailsOrderItemProps,
  OrderDetailsOrderTableProps,
  OrderDetailsPayment,
  OrderDetailsPaymentBrand,
  OrderDetailsPaymentLogoProps,
  OrderDetailsProps,
  OrderDetailsSidebarProps,
  OrderDetailsSummary,
  PaymentMethodCardProps,
} from "../../index";
import {
  OrderDetails,
  OrderDetailsDeliveryStatus,
  OrderDetailsHeader,
  OrderDetailsOrderItem,
  OrderDetailsOrderTable,
  OrderDetailsPaymentLogo,
  OrderDetailsSidebar,
  PaymentMethodCard,
} from "../../index";

type PublicOrderDetailsTypes = [
  OrderDetailsAddress,
  OrderDetailsDelivery,
  OrderDetailsDeliveryStep,
  OrderDetailsFulfillmentStatus,
  OrderDetailsLineItem,
  OrderDetailsPayment,
  OrderDetailsPaymentBrand,
  OrderDetailsSummary,
  OrderDetailsDeliveryStatusProps,
  OrderDetailsHeaderProps,
  OrderDetailsOrderItemProps,
  OrderDetailsOrderTableProps,
  OrderDetailsPaymentLogoProps,
  OrderDetailsProps,
  OrderDetailsSidebarProps,
  PaymentMethodCardProps,
];

const publicOrderDetailsTypes: PublicOrderDetailsTypes | undefined = undefined;
void publicOrderDetailsTypes;

describe("Order Details public entry", () => {
  it("exports every named Order Details component", () => {
    expect([
      OrderDetails,
      OrderDetailsDeliveryStatus,
      OrderDetailsHeader,
      OrderDetailsOrderTable,
      OrderDetailsOrderItem,
      OrderDetailsSidebar,
      OrderDetailsPaymentLogo,
      PaymentMethodCard,
    ]).toEqual([
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
    ]);
  });
});
