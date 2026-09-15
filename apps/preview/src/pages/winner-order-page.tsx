import { Badge } from "@grade10/design-system/components/display/badge";
import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Card } from "@grade10/design-system/components/display/card";
import { Step } from "@grade10/design-system/components/display/step";
import { Stepper } from "@grade10/design-system/components/display/stepper";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { SiteHeader } from "@grade10/ui";
import { ArrowUpRight } from "@phosphor-icons/react";
import { type ReactNode, useEffect, useState } from "react";
import { AUCTION_SITE_HEADER } from "./auction-lot-details-content";
import { STORE_FOOTER } from "./store-content";
import { WinnerOrderAddressDialog } from "./winner-order-address-dialog";
import {
  WINNER_ORDER_CONTENTS,
  type WinnerOrderContent,
  type WinnerOrderInvoiceLine,
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

type FulfilmentStep = {
  label: string;
  date?: string;
  state: "completed" | "current" | "upcoming";
};

function showFulfilmentStepper(status: WinnerOrderStatus): boolean {
  return (
    status === "processing" || status === "shipped" || status === "delivered"
  );
}

function fulfilmentStepsFor(
  status: WinnerOrderStatus,
  content: WinnerOrderContent,
): FulfilmentStep[] {
  if (status === "delivered") {
    return [
      { label: "Paid", date: content.endedAt, state: "completed" },
      { label: "Shipped", date: "Dispatched", state: "completed" },
      {
        label: "Delivered",
        date: content.secondaryNote ?? "Delivered",
        state: "completed",
      },
    ];
  }
  if (status === "shipped") {
    return [
      { label: "Paid", date: content.endedAt, state: "completed" },
      {
        label: "Shipped",
        date: content.secondaryNote ?? "In transit",
        state: "current",
      },
      { label: "Delivered", state: "upcoming" },
    ];
  }
  return [
    { label: "Paid", date: content.endedAt, state: "completed" },
    { label: "Shipped", state: "upcoming" },
    { label: "Delivered", state: "upcoming" },
  ];
}

/** Sidebar money rows — full invoice when issued; otherwise winning bid + TBD fees. */
function summaryLinesFor(
  content: WinnerOrderContent,
): WinnerOrderInvoiceLine[] {
  if (content.invoiceLines?.length) {
    return [...content.invoiceLines];
  }
  if (content.status === "cancelled") {
    return [
      { label: "Winning Bid", value: content.winningBid },
      { label: "Order Total", value: "—" },
    ];
  }
  return [
    { label: "Winning Bid", value: content.winningBid },
    { label: "Buyer's Premium", value: "TBD", muted: true },
    { label: "Shipping & Handling", value: "TBD", muted: true },
    { label: "Insurance", value: "TBD", muted: true },
    { label: "Order Total", value: "TBD", muted: true },
  ];
}

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

function SummaryRow({
  label,
  value,
  emphasize = false,
  muted = false,
}: {
  label: ReactNode;
  value: ReactNode;
  emphasize?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
      <span
        className={cn(
          "text-sm leading-5 text-foreground",
          emphasize && "text-base font-semibold",
          muted && !emphasize && "text-secondary-foreground",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "text-right text-sm leading-5 whitespace-nowrap tabular-nums text-foreground",
          emphasize && "text-base font-semibold",
          muted && "text-secondary-foreground",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function LotCard({ content }: { content: WinnerOrderContent }) {
  return (
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
  );
}

function AddressBlock({ content }: { content: WinnerOrderContent }) {
  return (
    <VStack className="w-full" gap="sm" hAlign="start">
      <h3 className="w-full text-sm leading-5 font-medium text-secondary-foreground">
        {content.addressLabel}
      </h3>
      {content.addressValue ? (
        <Text className="whitespace-pre-line text-foreground" size="sm">
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
  );
}

function OrderSummary({ lines }: { lines: WinnerOrderInvoiceLine[] }) {
  const total = lines.find((line) => line.label === "Order Total");
  const rest = lines.filter((line) => line.label !== "Order Total");
  return (
    <VStack className="w-full" gap="md" hAlign="stretch">
      <h3 className="w-full text-sm leading-5 font-medium text-secondary-foreground">
        Order summary
      </h3>
      <VStack className="w-full" gap="sm" hAlign="stretch">
        {rest.map((line) => (
          <SummaryRow
            key={line.label}
            label={line.label}
            muted={line.muted || line.value === "TBD"}
            value={line.value}
          />
        ))}
      </VStack>
      {total ? (
        <>
          <hr className="w-full border-border" />
          <SummaryRow
            emphasize
            label={total.label}
            muted={total.muted || total.value === "TBD"}
            value={total.value}
          />
        </>
      ) : null}
    </VStack>
  );
}

function FulfilmentStatusCard({
  steps,
  trackLabel,
  onTrack,
}: {
  steps: FulfilmentStep[];
  trackLabel?: string | null;
  onTrack?: () => void;
}) {
  return (
    <div className="w-full" data-slot="winner-order-fulfilment">
      <Card className="gap-0 overflow-hidden p-0" padding={false}>
        <HStack
          className="w-full justify-between border-b border-border bg-muted px-6 py-4"
          gap="none"
          vAlign="center"
        >
          <h3 className="text-base leading-6 font-medium text-foreground">
            Delivery status
          </h3>
          {trackLabel && onTrack ? (
            <Button
              onClick={onTrack}
              size="md"
              trailing={<ArrowUpRight aria-hidden size={14} weight="bold" />}
              variant="outline"
            >
              {trackLabel}
            </Button>
          ) : null}
        </HStack>
        <div className="w-full px-0 py-4">
          <Stepper>
            {steps.map((step, index) => (
              <Step
                description={step.date}
                key={step.label}
                label={step.label}
                showLeadingConnector={index > 0}
                showTrailingConnector={index < steps.length - 1}
                state={
                  step.state === "current"
                    ? "progress"
                    : step.state === "completed"
                      ? "completed"
                      : "upcoming"
                }
              />
            ))}
          </Stepper>
        </div>
      </Card>
    </div>
  );
}

/**
 * Right sidebar — same shell as Order Details: summary, optional payment,
 * delivery address. Pre-invoice rows use TBD for unquoted fees.
 */
function OrderSidebar({ content }: { content: WinnerOrderContent }) {
  const lines = summaryLinesFor(content);
  const showPayment = Boolean(content.paymentMethod);
  const showAddress = content.status !== "cancelled";

  return (
    <aside
      className="w-full bg-background lg:sticky lg:top-8"
      data-slot="winner-order-sidebar"
    >
      <Card className="gap-0 overflow-hidden p-0" padding={false}>
        <VStack
          className={cn(
            "w-full bg-background-subtle p-6",
            (showPayment || showAddress) && "border-b border-border",
          )}
          gap="md"
          hAlign="stretch"
        >
          <OrderSummary lines={lines} />
        </VStack>
        {showPayment || showAddress ? (
          <VStack className="w-full p-6" gap="lg" hAlign="stretch">
            {showPayment ? (
              <VStack className="w-full" gap="sm" hAlign="stretch">
                <h3 className="w-full text-sm leading-5 font-medium text-secondary-foreground">
                  Payment method
                </h3>
                <Card className="gap-0 p-3" padding={false}>
                  <HStack className="w-full" gap="sm" vAlign="center">
                    <span className="text-sm leading-5 font-medium text-foreground">
                      {content.paymentMethod}
                    </span>
                    {content.paymentMasked ? (
                      <>
                        <span
                          aria-hidden
                          className="h-5 w-px shrink-0 bg-border"
                        />
                        <span className="text-sm leading-5 font-medium text-foreground">
                          {content.paymentMasked}
                        </span>
                      </>
                    ) : null}
                  </HStack>
                </Card>
              </VStack>
            ) : null}
            {showAddress ? <AddressBlock content={content} /> : null}
          </VStack>
        ) : null}
      </Card>
    </aside>
  );
}

/**
 * Preview-only Winner Order page. Always uses the Order Details 2-column shell
 * (main + sticky summary sidebar). Storybook-first — not a published
 * `@grade10/ui` export and not the store Order Details contract.
 */
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
  const fulfilment = showFulfilmentStepper(content.status)
    ? fulfilmentStepsFor(content.status, content)
    : null;

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
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-4 pt-8 pb-16 sm:px-8">
        <Breadcrumbs>
          <BreadcrumbItem href="#account">Account</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem href="#my-auctions">My Auctions</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem current>Winner Order</BreadcrumbItem>
        </Breadcrumbs>

        <VStack className="w-full gap-3" gap="sm" hAlign="stretch">
          <HStack className="w-full flex-wrap items-center gap-3">
            <h1 className="shrink-0 text-3xl leading-9 font-semibold text-foreground">
              {content.title}
            </h1>
            <Badge size="sm" variant={STATUS_BADGE[content.status]}>
              {content.statusLabel}
            </Badge>
          </HStack>
          <Text className="text-sm leading-5 text-secondary-foreground">
            {content.endedAt}
          </Text>
        </VStack>

        <div className="grid w-full items-start gap-8 grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-12">
          <VStack className="min-w-0 w-full" gap="lg" hAlign="stretch">
            {fulfilment ? (
              <FulfilmentStatusCard
                onTrack={
                  content.primaryCta === "Track shipment"
                    ? handlePrimaryAction
                    : undefined
                }
                steps={fulfilment}
                trackLabel={
                  content.primaryCta === "Track shipment"
                    ? content.primaryCta
                    : null
                }
              />
            ) : null}

            <Text className="max-w-prose text-secondary-foreground" size="sm">
              {content.body}
            </Text>
            {content.deadline ? (
              <Text size="sm" weight="medium">
                {content.deadline}
              </Text>
            ) : null}

            <LotCard content={content} />

            {content.secondaryNote &&
            content.status !== "shipped" &&
            content.status !== "delivered" ? (
              <Text size="sm" tone="secondary">
                {content.secondaryNote}
              </Text>
            ) : null}

            {content.primaryCta && content.primaryCta !== "Track shipment" ? (
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

          <OrderSidebar content={content} />
        </div>
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
