import { Badge } from "@grade10/design-system/components/display/badge";
import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { SiteHeader } from "@grade10/ui";
import { useEffect, useState } from "react";
import { AUCTION_SITE_HEADER } from "./auction-lot-details-content";
import { STORE_FOOTER } from "./store-content";
import { WinnerOrderAddressDialog } from "./winner-order-address-dialog";
import {
  WINNER_ORDER_CONTENTS,
  type WinnerOrderContent,
  type WinnerOrderStatus,
} from "./winner-order-content";

const STATUS_BADGE: Record<
  WinnerOrderStatus,
  "default" | "success" | "error" | "warning" | "info" | "outline"
> = {
  awaiting_address: "warning",
  preparing_invoice: "info",
  pending_payment: "warning",
  pending_payment_expired: "error",
  processing: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "default",
  refunded: "default",
};

const PRODUCT_IMAGE = new URL("./product.fixture.png", import.meta.url).href;

type WinnerOrderPageProps = {
  status?: WinnerOrderStatus;
  content?: WinnerOrderContent;
  onPrimaryAction?: () => void;
};

function resolveContent(
  status: WinnerOrderStatus,
  confirmedAddress: string | null,
  content?: WinnerOrderContent,
): WinnerOrderContent {
  if (content) return content;
  const base = WINNER_ORDER_CONTENTS[status];
  if (status === "preparing_invoice" && confirmedAddress) {
    return {
      ...base,
      addressValue: confirmedAddress,
      addressHint: "You can change this until the invoice is sent.",
    };
  }
  return base;
}

function WinnerOrderPage({
  status: statusProp = "awaiting_address",
  content: contentProp,
  onPrimaryAction,
}: WinnerOrderPageProps) {
  const [status, setStatus] = useState(statusProp);
  const [confirmedAddress, setConfirmedAddress] = useState<string | null>(null);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);

  useEffect(() => {
    setStatus(statusProp);
    if (statusProp !== "preparing_invoice") {
      setConfirmedAddress(null);
    }
  }, [statusProp]);

  const content = resolveContent(status, confirmedAddress, contentProp);
  const opensAddressDialog =
    content.status === "awaiting_address" &&
    content.primaryCta === "Confirm delivery address";

  function handlePrimaryAction() {
    if (opensAddressDialog) {
      setAddressDialogOpen(true);
      return;
    }
    onPrimaryAction?.();
  }

  function handleAddressConfirm(addressLines: string) {
    setConfirmedAddress(addressLines);
    setStatus("preparing_invoice");
    onPrimaryAction?.();
  }

  return (
    <div
      className="flex min-h-svh w-full flex-col bg-background"
      data-slot="winner-order-page"
      data-status={content.status}
    >
      <SiteHeader {...AUCTION_SITE_HEADER} />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
        <Breadcrumbs>
          <BreadcrumbItem href="#account">Account</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem href="#my-auctions">My Auctions</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem current>Winner Order</BreadcrumbItem>
        </Breadcrumbs>

        <VStack className="w-full gap-6" gap="lg" hAlign="start">
          <VStack className="w-full gap-3" gap="sm" hAlign="start">
            <HStack className="w-full flex-wrap items-center gap-3">
              <Text as="h2" className="text-2xl font-semibold tracking-tight">
                {content.title}
              </Text>
              <Badge size="sm" variant={STATUS_BADGE[content.status]}>
                {content.statusLabel}
              </Badge>
            </HStack>
            <Text className="max-w-prose text-secondary-foreground" size="sm">
              {content.body}
            </Text>
            {content.deadline ? (
              <Text size="sm" weight="medium">
                {content.deadline}
              </Text>
            ) : null}
          </VStack>

          <section
            aria-label="Lot"
            className="flex w-full flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center"
          >
            <div
              className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-gradient-to-b from-background-subtle to-muted"
              data-slot="winner-order-lot-image"
            >
              <img
                alt={content.lotTitle}
                className="absolute inset-0 size-full object-contain p-0.5"
                src={PRODUCT_IMAGE}
              />
            </div>
            <VStack className="min-w-0 flex-1" gap="xs" hAlign="start">
              <Text className="truncate" size="sm" weight="medium">
                {content.lotTitle}
              </Text>
              <Text size="sm" tone="secondary">
                {content.endedAt}
              </Text>
              <Text className="tabular-nums" size="sm" weight="medium">
                Winning bid · {content.winningBid}
              </Text>
            </VStack>
          </section>

          <section
            aria-label="Delivery address"
            className="w-full rounded-xl border border-border p-4"
          >
            <VStack className="w-full" gap="sm" hAlign="start">
              <Text size="sm" weight="medium">
                {content.addressLabel}
              </Text>
              {content.addressValue ? (
                <Text
                  className="whitespace-pre-line text-secondary-foreground"
                  size="sm"
                >
                  {content.addressValue}
                </Text>
              ) : (
                <Text size="sm" tone="secondary">
                  No address confirmed yet.
                </Text>
              )}
              {content.addressHint ? (
                <Text size="xs" tone="secondary">
                  {content.addressHint}
                </Text>
              ) : null}
            </VStack>
          </section>

          {content.invoiceLines ? (
            <section
              aria-label="Invoice"
              className="w-full rounded-xl border border-border p-4"
            >
              <VStack className="w-full" gap="sm" hAlign="start">
                <Text size="sm" weight="medium">
                  Invoice
                </Text>
                <VStack className="w-full gap-2" gap="xs" hAlign="stretch">
                  {content.invoiceLines.map((line) => (
                    <HStack
                      key={line.label}
                      className="w-full items-baseline justify-between gap-4"
                    >
                      <Text
                        size="sm"
                        tone={
                          line.label === "Order Total" ? "primary" : "secondary"
                        }
                        weight={
                          line.label === "Order Total" ? "medium" : "regular"
                        }
                      >
                        {line.label}
                      </Text>
                      <Text
                        className="tabular-nums"
                        size="sm"
                        weight={
                          line.label === "Order Total" ? "medium" : "regular"
                        }
                      >
                        {line.value}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            </section>
          ) : null}

          {content.secondaryNote ? (
            <Text size="sm" tone="secondary">
              {content.secondaryNote}
            </Text>
          ) : null}

          {content.primaryCta ? (
            <div className="w-full sm:w-auto">
              <Button
                className="w-full sm:w-auto"
                onClick={handlePrimaryAction}
                size="lg"
              >
                {content.primaryCta}
              </Button>
            </div>
          ) : null}
        </VStack>
      </main>
      <Footer {...STORE_FOOTER} />

      <WinnerOrderAddressDialog
        onConfirm={handleAddressConfirm}
        onOpenChange={setAddressDialogOpen}
        open={addressDialogOpen}
      />
    </div>
  );
}

export type { WinnerOrderPageProps };
export { WinnerOrderPage };
