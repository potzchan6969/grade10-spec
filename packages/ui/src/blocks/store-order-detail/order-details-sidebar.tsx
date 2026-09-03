import { Card } from "@grade10/design-system/components/display/card";
import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import { loyaltyPointsHeading } from "./loyalty-points-heading";
import { OrderDetailsPaymentLogo } from "./order-details-payment-logo";
import type {
  OrderDetailsAddress,
  OrderDetailsFulfillmentStatus,
  OrderDetailsPayment,
  OrderDetailsSidebarCopy,
  OrderDetailsSummary,
} from "./types";

type OrderDetailsSidebarProps = {
  copy: OrderDetailsSidebarCopy;
  summary: OrderDetailsSummary;
  payment: OrderDetailsPayment;
  status: OrderDetailsFulfillmentStatus;
  shippingAddress?: OrderDetailsAddress;
  pickupAddress?: OrderDetailsAddress;
  loyaltyPoints?: ReactNode;
  className?: string;
};

function SummaryRow({
  label,
  value,
  valueClassName,
}: {
  label: ReactNode;
  value: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
      <span className="text-sm leading-5 text-foreground">{label}</span>
      <span
        className={cn(
          "text-right text-sm leading-5 whitespace-nowrap text-foreground tabular-nums",
          valueClassName,
        )}
      >
        {value}
      </span>
    </div>
  );
}

function AddressSection({
  heading,
  address,
}: {
  heading: ReactNode;
  address: OrderDetailsAddress;
}) {
  return (
    <VStack className="w-full" gap="sm" hAlign="stretch">
      <h3 className="w-full text-sm leading-5 font-medium text-secondary-foreground">
        {heading}
      </h3>
      <VStack className="w-full text-sm leading-5" gap="xs">
        <p className="font-medium text-foreground">{address.name}</p>
        {address.lines.map((line) =>
          address.mapsHref ? (
            <Link
              href={address.mapsHref}
              key={String(line)}
              rel="noopener noreferrer"
              size="sm"
              target="_blank"
            >
              {line}
            </Link>
          ) : (
            <p className="text-foreground" key={String(line)}>
              {line}
            </p>
          ),
        )}
        {address.openingHours != null ? (
          <p className="text-secondary-foreground">{address.openingHours}</p>
        ) : null}
      </VStack>
    </VStack>
  );
}

/**
 * Order details sidebar displaying order summary, payment method, shipping or
 * pickup address, and loyalty points to earn or earned by status.
 *
 * Figma set `Product / Order / Order Details Sidebar` (`5057:6908`). Summary
 * rows are conditional: discount when present, refund when issued, shipping
 * hidden for pickup/in-store, tax optional, shipping address hidden offline,
 * loyalty points for logged-in users only. Amounts are consumer-formatted
 * (up to two decimal places, no trailing zeros). Payment row shows a brand
 * logo at `text-sm` line height beside an optional masked number.
 */
function OrderDetailsSidebar({
  copy,
  summary,
  payment,
  status,
  shippingAddress,
  pickupAddress,
  loyaltyPoints,
  className,
}: OrderDetailsSidebarProps) {
  const loyaltyHeading =
    loyaltyPoints != null ? loyaltyPointsHeading(copy, status) : null;

  return (
    <div
      className={cn("w-full bg-background", className)}
      data-slot="order-details-sidebar"
    >
      <Card className="gap-0 overflow-hidden p-0" padding={false}>
        <VStack
          className="w-full border-b border-border bg-background-subtle p-6"
          gap="md"
          hAlign="stretch"
        >
          <h3 className="w-full text-sm leading-5 font-medium text-secondary-foreground">
            {copy.orderSummary}
          </h3>
          <VStack className="w-full" gap="sm" hAlign="stretch">
            <SummaryRow
              label={summary.subtotal.label}
              value={summary.subtotal.value}
            />
            {summary.discount ? (
              <SummaryRow
                label={summary.discount.label}
                value={summary.discount.value}
                valueClassName="text-success"
              />
            ) : null}
            {summary.refund ? (
              <SummaryRow
                label={summary.refund.label}
                value={summary.refund.value}
                valueClassName="text-secondary-foreground"
              />
            ) : null}
            {summary.shipping ? (
              <SummaryRow
                label={summary.shipping.label}
                value={summary.shipping.value}
              />
            ) : null}
            {summary.tax ? (
              <SummaryRow label={summary.tax.label} value={summary.tax.value} />
            ) : null}
          </VStack>
          <hr className="w-full border-border" />
          <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <span className="text-base leading-6 font-semibold text-foreground">
              {summary.total.label}
            </span>
            <span className="text-right text-base leading-6 font-semibold whitespace-nowrap text-foreground tabular-nums">
              {summary.total.value}
            </span>
          </div>
        </VStack>
        <VStack className="w-full p-6" gap="lg" hAlign="stretch">
          <VStack className="w-full" gap="sm" hAlign="stretch">
            <h3 className="w-full text-sm leading-5 font-medium text-secondary-foreground">
              {copy.paymentMethod}
            </h3>
            <Card className="gap-0 p-3" padding={false}>
              <HStack className="w-full" gap="sm" vAlign="center">
                <OrderDetailsPaymentLogo brand={payment.brand} />
                {payment.maskedNumber != null ? (
                  <>
                    <span aria-hidden className="h-5 w-px shrink-0 bg-border" />
                    <span className="text-sm leading-5 font-medium text-foreground">
                      {payment.maskedNumber}
                    </span>
                  </>
                ) : null}
              </HStack>
            </Card>
          </VStack>
          {pickupAddress ? (
            <AddressSection
              address={pickupAddress}
              heading={copy.pickupAddress}
            />
          ) : shippingAddress ? (
            <AddressSection
              address={shippingAddress}
              heading={copy.shippingAddress}
            />
          ) : null}
          {loyaltyHeading != null ? (
            <Card
              className="gap-1 border-border bg-gradient-to-r from-background-subtle to-muted p-3"
              padding={false}
            >
              <VStack className="w-full" gap="xs" hAlign="stretch">
                <p className="text-sm leading-5 font-medium text-secondary-foreground">
                  {loyaltyHeading}
                </p>
                <div className="text-base leading-6 font-semibold text-foreground">
                  {loyaltyPoints}
                </div>
              </VStack>
            </Card>
          ) : null}
        </VStack>
      </Card>
    </div>
  );
}

export type { OrderDetailsSidebarProps };
export { OrderDetailsSidebar };
