import { Card } from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import type { AuctionOrderDetailProps } from "./types";

function DetailFact({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[minmax(8rem,0.7fr)_minmax(0,1fr)] sm:gap-4">
      <dt>
        <Text size="sm" tone="secondary">
          {label}
        </Text>
      </dt>
      <dd>
        <Text size="sm">{value}</Text>
      </dd>
    </div>
  );
}

function AuctionOrderDetail({
  copy,
  orderNumber,
  auction,
  currency,
  date,
  orderStatus,
  invoiceStatus,
  collectionMethod,
  statusTimeline,
  lot,
  invoice,
  className,
}: AuctionOrderDetailProps) {
  const lotContent = (
    <HStack className="w-full" gap="md" vAlign="center">
      <div
        aria-hidden={lot.imageSrc ? undefined : true}
        className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-gradient-to-b from-background-subtle to-muted"
        data-slot="auction-order-detail-lot-image"
      >
        {lot.imageSrc ? (
          <img
            alt={lot.imageAlt ?? ""}
            className="absolute inset-0 size-full object-cover"
            src={lot.imageSrc}
          />
        ) : null}
      </div>
      <VStack className="min-w-0" gap="xs" hAlign="start">
        {lot.href ? (
          <Link href={lot.href} size="sm">
            {lot.title}
          </Link>
        ) : lot.onViewLot ? (
          <Link
            onClick={lot.onViewLot}
            render={<button type="button" />}
            size="sm"
          >
            {lot.title}
          </Link>
        ) : (
          <Text size="sm" weight="medium">
            {lot.title}
          </Text>
        )}
        <Text size="sm" tone="secondary">
          {copy.winningBid}: {lot.winningBid}
        </Text>
      </VStack>
    </HStack>
  );

  return (
    <VStack
      className={cn("w-full", className)}
      data-slot="auction-order-detail"
      gap="md"
      hAlign="stretch"
    >
      <Card data-slot="auction-order-detail-information">
        <Text as="h2" size="lg" weight="medium">
          {copy.orderInformation}
        </Text>
        <dl className="grid gap-3">
          <DetailFact label={copy.orderNumber} value={orderNumber} />
          <DetailFact label={copy.auction} value={auction} />
          <DetailFact label={copy.currency} value={currency} />
          <DetailFact label={copy.date} value={date} />
          <DetailFact label={copy.orderStatus} value={orderStatus} />
          <DetailFact label={copy.invoiceStatus} value={invoiceStatus} />
        </dl>
        {invoice ? (
          <VStack
            className="border-t border-border pt-4"
            data-slot="auction-order-detail-invoice"
            gap="sm"
            hAlign="stretch"
          >
            {invoice.lines.map((line) => (
              <HStack
                className="w-full justify-between gap-4"
                gap="none"
                key={`${String(line.label)}-${String(line.value)}`}
                vAlign="center"
              >
                <Text size="sm" tone="secondary">
                  {line.label}
                </Text>
                <Text size="sm" weight="medium">
                  {line.value}
                </Text>
              </HStack>
            ))}
            {invoice.onPayNow ? (
              <Button onClick={invoice.onPayNow} size="md">
                {copy.payNow}
              </Button>
            ) : null}
            {invoice.onContact ? (
              <Button onClick={invoice.onContact} size="md" variant="outline">
                {copy.contactUs}
              </Button>
            ) : null}
          </VStack>
        ) : null}
      </Card>

      <Card data-slot="auction-order-detail-collection">
        <Text as="h2" size="lg" weight="medium">
          {copy.collectionMethod}
        </Text>
        {collectionMethod ?? null}
      </Card>

      <Card data-slot="auction-order-detail-status">
        <Text as="h2" size="lg" weight="medium">
          {copy.orderStatus}
        </Text>
        <ol className="grid gap-3">
          {statusTimeline.map((item) => (
            <li
              className="grid gap-1 sm:grid-cols-[minmax(8rem,0.7fr)_minmax(0,1fr)] sm:gap-4"
              key={`${String(item.status)}-${String(item.reachedAt)}`}
            >
              <Text size="sm" weight="medium">
                {item.status}
              </Text>
              <Text size="sm" tone="secondary">
                {item.reachedAt}
              </Text>
            </li>
          ))}
        </ol>
      </Card>

      <Card data-slot="auction-order-detail-lots">
        <Text as="h2" size="lg" weight="medium">
          {copy.lots}
        </Text>
        {lotContent}
      </Card>
    </VStack>
  );
}

export type { AuctionOrderDetailCopy, AuctionOrderDetailProps } from "./types";
export { AuctionOrderDetail };
