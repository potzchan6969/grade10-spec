import { Alert } from "@grade10/design-system/components/display/alert";
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
import { Link } from "@grade10/design-system/components/forms/link";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { Toast, toast } from "@grade10/design-system/components/overlays/toast";
import { cn } from "@grade10/design-system/lib/utils";
import { SiteHeader } from "@grade10/ui";
import { ArrowUpRight } from "@phosphor-icons/react";
import { type ReactNode, useEffect, useState } from "react";
import {
  REVEAL_HIDDEN_CLASS,
  REVEAL_REDUCED_MOTION_CLASS,
  REVEAL_TRANSITION_CLASS,
  REVEAL_VISIBLE_CLASS,
  revealStaggerDelayMs,
  useFirstPaintReveal,
} from "../../../../packages/ui/src/blocks/shared/use-first-paint-reveal";
import { AUCTION_SITE_HEADER } from "./auction-lot-details-content";
import { STORE_FOOTER } from "./store-content";
import { WinnerOrderAddressDialog } from "./winner-order-address-dialog";
import {
  WINNER_ORDER_CONTENTS,
  type WinnerOrderContent,
  type WinnerOrderInvoiceLine,
  type WinnerOrderStatus,
} from "./winner-order-content";
import { AUCTION_LOT_DETAILS_HREF, MY_AUCTIONS_PAGE_HREF } from "./workbench-story-nav";

const ADDRESS_CONFIRMED_TOAST = {
  title: "Address confirmed",
  description: "Grade10 is preparing your invoice for this destination.",
} as const;

function RevealGroup({
  children,
  className,
  revealed,
  staggerIndex,
}: {
  children: ReactNode;
  className?: string;
  revealed: boolean;
  staggerIndex: number;
}) {
  return (
    <div
      className={cn(
        REVEAL_HIDDEN_CLASS,
        REVEAL_TRANSITION_CLASS,
        REVEAL_REDUCED_MOTION_CLASS,
        revealed && REVEAL_VISIBLE_CLASS,
        className,
      )}
      data-slot="winner-order-reveal"
      style={{
        transitionDelay: revealStaggerDelayMs(staggerIndex, revealed),
      }}
    >
      {children}
    </div>
  );
}

/**
 * Minimal placeholder PDF for Storybook — not a real invoice pipeline.
 * Opens in a new tab so the winner can view or save from the browser.
 */
const PLACEHOLDER_INVOICE_PDF = `%PDF-1.4
1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj
2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj
3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources<< /Font<< /F1 5 0 R >> >> >>endobj
4 0 obj<< /Length 64 >>stream
BT /F1 18 Tf 72 720 Td (Grade10 Winner Invoice Placeholder) Tj ET
endstream endobj
5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj
trailer<< /Root 1 0 R >>
%%EOF
`;

function openPlaceholderInvoicePdf() {
  const blob = new Blob([PLACEHOLDER_INVOICE_PDF], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "grade10-winner-invoice.pdf";
    anchor.rel = "noopener";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
  }
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/** Invoice exists from Pending Payment onward (incl. paid / delivery / refunded). */
function hasIssuedInvoice(content: WinnerOrderContent): boolean {
  return Boolean(content.invoiceLines?.length);
}

const PRODUCT_IMAGE = new URL("./product.fixture.png", import.meta.url).href;

type WinnerOrderPageProps = {
  status?: WinnerOrderStatus;
  content?: WinnerOrderContent;
  onPrimaryAction?: () => void;
  /** Opens lot details — preview defaults to the closed-won lot story. */
  lotHref?: string;
  onLotClick?: () => void;
};

type WinnerProgressStep = {
  label: string;
  description?: string;
  state: "completed" | "current" | "upcoming";
};

/** Happy-path winner stages — not Cancelled / Refunded. */
function showWinnerProgress(status: WinnerOrderStatus): boolean {
  return (
    status === "awaiting_address" ||
    status === "preparing_invoice" ||
    status === "pending_payment" ||
    status === "pending_payment_expired" ||
    status === "processing" ||
    status === "shipped" ||
    status === "delivered"
  );
}

/**
 * Post-auction winner progress — designer-required five steps.
 * Address → Invoice → Payment → Shipped → Completed.
 * Cancelled / Refunded omit the stepper.
 */
function winnerProgressStepsFor(
  status: WinnerOrderStatus,
  content: WinnerOrderContent,
): WinnerProgressStep[] {
  const address: WinnerProgressStep = { label: "Address", state: "upcoming" };
  const invoice: WinnerProgressStep = { label: "Invoice", state: "upcoming" };
  const payment: WinnerProgressStep = { label: "Payment", state: "upcoming" };
  const shipped: WinnerProgressStep = { label: "Shipped", state: "upcoming" };
  const completed: WinnerProgressStep = {
    label: "Completed",
    state: "upcoming",
  };

  switch (status) {
    case "awaiting_address":
      return [
        { ...address, state: "current" },
        invoice,
        payment,
        shipped,
        completed,
      ];
    case "preparing_invoice":
      return [
        { ...address, state: "completed" },
        { ...invoice, state: "current" },
        payment,
        shipped,
        completed,
      ];
    case "pending_payment":
      return [
        { ...address, state: "completed" },
        { ...invoice, state: "completed" },
        { ...payment, state: "current" },
        shipped,
        completed,
      ];
    case "pending_payment_expired":
      return [
        { ...address, state: "completed" },
        { ...invoice, state: "completed" },
        { ...payment, state: "current" },
        shipped,
        completed,
      ];
    case "processing":
    case "shipped":
      return [
        { ...address, state: "completed" },
        { ...invoice, state: "completed" },
        { ...payment, state: "completed" },
        {
          ...shipped,
          description:
            status === "shipped"
              ? (content.secondaryNote ?? "In transit")
              : undefined,
          state: "current",
        },
        completed,
      ];
    case "delivered":
      return [
        { ...address, state: "completed" },
        { ...invoice, state: "completed" },
        { ...payment, state: "completed" },
        { ...shipped, state: "completed" },
        {
          ...completed,
          description: content.secondaryNote ?? "Delivered",
          state: "completed",
        },
      ];
    default:
      return [address, invoice, payment, shipped, completed];
  }
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
    { label: "Buyer’s Premium", value: "TBD", muted: true },
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

function LotCard({
  content,
  href,
  onClick,
}: {
  content: WinnerOrderContent;
  href?: string;
  onClick?: () => void;
}) {
  const className = cn(
    "flex w-full flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center",
    "transition-[background-color,border-color] duration-200 ease-out",
    "hover:bg-muted/25 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
    "motion-reduce:transition-none",
  );

  const body = (
    <>
      <div
        className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-gradient-to-b from-background-subtle to-muted"
        data-slot="winner-order-lot-image"
      >
        <img
          alt=""
          className="absolute inset-0 size-full object-contain p-0.5"
          src={PRODUCT_IMAGE}
        />
      </div>
      <VStack className="min-w-0 flex-1" gap="xs" hAlign="start">
        <Text className="truncate" size="sm" weight="medium">
          {content.lotTitle}
        </Text>
        <Text className="tabular-nums" size="sm" weight="medium">
          Winning bid: {content.winningBid}
        </Text>
        <p className="text-sm leading-5 text-secondary-foreground">
          {content.endedAt}
        </p>
      </VStack>
    </>
  );

  if (href) {
    return (
      <a
        aria-label={`${content.lotTitle} — open lot details`}
        className={className}
        data-slot="winner-order-lot"
        href={href}
        onClick={onClick}
      >
        {body}
      </a>
    );
  }

  return (
    <section
      aria-label="Lot"
      className={className}
      data-slot="winner-order-lot"
    >
      {body}
    </section>
  );
}

function AddressBlock({
  content,
  confirmCta,
  onConfirmAddress,
}: {
  content: WinnerOrderContent;
  confirmCta?: string | null;
  onConfirmAddress?: () => void;
}) {
  return (
    <VStack className="w-full" gap="sm" hAlign="start">
      <h3 className="w-full text-sm leading-5 font-medium text-secondary-foreground">
        {content.addressLabel}
      </h3>
      {content.addressValue ? (
        <Text className="whitespace-pre-line text-foreground" size="sm">
          {content.addressValue}
        </Text>
      ) : null}
      {confirmCta && onConfirmAddress ? (
        <Button className="w-full" onClick={onConfirmAddress} size="md">
          {confirmCta}
        </Button>
      ) : null}
    </VStack>
  );
}

function OrderSummary({
  lines,
  payCta,
  deadline,
  overdue = false,
  onPay,
  onViewInvoicePdf,
}: {
  lines: WinnerOrderInvoiceLine[];
  payCta?: string | null;
  deadline?: string | null;
  overdue?: boolean;
  onPay?: () => void;
  onViewInvoicePdf?: () => void;
}) {
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
          <VStack className="w-full" gap="sm" hAlign="stretch">
            <SummaryRow
              emphasize
              label={total.label}
              muted={total.muted || total.value === "TBD"}
              value={total.value}
            />
            {onViewInvoicePdf ? (
              <Link
                className="self-start"
                href="#view-invoice-pdf"
                onClick={(event) => {
                  event.preventDefault();
                  onViewInvoicePdf();
                }}
                size="sm"
                variant="secondary"
              >
                View invoice PDF
              </Link>
            ) : null}
          </VStack>
        </>
      ) : onViewInvoicePdf ? (
        <Link
          className="self-start"
          href="#view-invoice-pdf"
          onClick={(event) => {
            event.preventDefault();
            onViewInvoicePdf();
          }}
          size="sm"
          variant="secondary"
        >
          View invoice PDF
        </Link>
      ) : null}

      {overdue ? (
        <Alert
          actions={
            <Button
              onClick={() => {
                toast.info("Contact Grade10", {
                  description: "support@grade10.com",
                });
              }}
              size="sm"
              variant="outline"
            >
              Contact Us
            </Button>
          }
          dismissible={false}
          layout="inline"
          status="warning"
          title={deadline ?? "Payment deadline passed"}
        />
      ) : null}

      {payCta && onPay && !overdue ? (
        <VStack className="w-full" gap="sm" hAlign="stretch">
          <Button className="w-full" onClick={onPay} size="md">
            {payCta}
          </Button>
          {deadline ? (
            <p className="w-full text-center text-sm leading-5 text-secondary-foreground">
              {deadline}
            </p>
          ) : null}
        </VStack>
      ) : null}
    </VStack>
  );
}

function WinnerProgressCard({
  steps,
  trackLabel,
  onTrack,
}: {
  steps: WinnerProgressStep[];
  trackLabel?: string | null;
  onTrack?: () => void;
}) {
  return (
    <div className="w-full" data-slot="winner-order-progress">
      <Card className="gap-0 overflow-hidden p-0" padding={false}>
        <HStack
          className="w-full justify-between border-b border-border bg-muted px-6 py-4"
          gap="none"
          vAlign="center"
        >
          <h3 className="text-base leading-6 font-medium text-foreground">
            Order progress
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
        <div className="w-full overflow-x-auto px-0 py-4">
          <Stepper>
            {steps.map((step, index) => (
              <Step
                description={step.description}
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
function OrderSidebar({
  content,
  confirmAddressCta,
  onConfirmAddress,
  payCta,
  onPay,
  onViewInvoicePdf,
}: {
  content: WinnerOrderContent;
  confirmAddressCta?: string | null;
  onConfirmAddress?: () => void;
  payCta?: string | null;
  onPay?: () => void;
  onViewInvoicePdf?: () => void;
}) {
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
          <OrderSummary
            deadline={content.deadline}
            lines={lines}
            onPay={onPay}
            onViewInvoicePdf={onViewInvoicePdf}
            overdue={Boolean(content.overdue)}
            payCta={payCta}
          />
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
            {showAddress ? (
              <AddressBlock
                confirmCta={confirmAddressCta}
                content={content}
                onConfirmAddress={onConfirmAddress}
              />
            ) : null}
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
 *
 * First paint: title, progress (when present), lot, and sidebar stagger in
 * (opacity + translateY, 280ms) via `useFirstPaintReveal` — same pattern as
 * Order Details. Settles immediately under reduced motion.
 */
function WinnerOrderPage({
  status: statusProp = "awaiting_address",
  content: contentProp,
  onPrimaryAction,
  lotHref = AUCTION_LOT_DETAILS_HREF,
  onLotClick,
}: WinnerOrderPageProps) {
  const [status, setStatus] = useState(statusProp);
  const [confirmedAddress, setConfirmedAddress] = useState<string | null>(null);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const revealed = useFirstPaintReveal();

  useEffect(() => {
    setStatus(statusProp);
    if (statusProp !== "preparing_invoice") {
      setConfirmedAddress(null);
    }
  }, [statusProp]);

  const content = resolveContent(status, confirmedAddress, contentProp);
  const confirmAddressCta =
    content.status === "awaiting_address" &&
    content.primaryCta === "Confirm delivery address"
      ? content.primaryCta
      : null;
  const payCta =
    content.primaryCta === "Pay with card" ? content.primaryCta : null;
  const progress = showWinnerProgress(content.status)
    ? winnerProgressStepsFor(content.status, content)
    : null;
  const mainStaggerIndex = progress ? 1 : 0;
  const lotStaggerIndex = progress ? 2 : 1;
  const sidebarStaggerIndex = progress ? 3 : 2;

  function handlePrimaryAction() {
    onPrimaryAction?.();
  }

  function handleConfirmAddressClick() {
    setAddressDialogOpen(true);
  }

  function handleAddressConfirm(addressLines: string) {
    setConfirmedAddress(addressLines);
    setStatus("preparing_invoice");
    toast.success(ADDRESS_CONFIRMED_TOAST.title, {
      description: ADDRESS_CONFIRMED_TOAST.description,
    });
    onPrimaryAction?.();
  }

  return (
    <div
      className="flex min-h-svh w-full flex-col bg-background"
      data-revealed={revealed || undefined}
      data-slot="winner-order-page"
      data-status={content.status}
    >
      <SiteHeader {...AUCTION_SITE_HEADER} />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-4 pt-8 pb-16 sm:px-8">
        <Breadcrumbs>
          <BreadcrumbItem href="#account">Account</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem href={MY_AUCTIONS_PAGE_HREF}>My Auctions</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem current>Winner Order</BreadcrumbItem>
        </Breadcrumbs>

        <RevealGroup revealed={revealed} staggerIndex={0}>
          <h1 className="text-3xl leading-9 font-semibold text-foreground">
            {content.title}
          </h1>
        </RevealGroup>

        <div className="grid w-full items-start gap-8 grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-12">
          <VStack className="min-w-0 w-full" gap="lg" hAlign="stretch">
            {progress ? (
              <RevealGroup revealed={revealed} staggerIndex={mainStaggerIndex}>
                <WinnerProgressCard
                  onTrack={
                    content.primaryCta === "Track shipment"
                      ? handlePrimaryAction
                      : undefined
                  }
                  steps={progress}
                  trackLabel={
                    content.primaryCta === "Track shipment"
                      ? content.primaryCta
                      : null
                  }
                />
              </RevealGroup>
            ) : null}

            <RevealGroup revealed={revealed} staggerIndex={lotStaggerIndex}>
              <VStack className="w-full" gap="lg" hAlign="stretch">
                <LotCard
                  content={content}
                  href={lotHref}
                  onClick={onLotClick}
                />

                {content.status === "preparing_invoice" &&
                content.secondaryNote ? (
                  <Alert
                    dismissible={false}
                    layout="inline"
                    status="default"
                    title={content.secondaryNote}
                  />
                ) : content.secondaryNote &&
                  content.status !== "shipped" &&
                  content.status !== "delivered" ? (
                  <Text size="sm" tone="secondary">
                    {content.secondaryNote}
                  </Text>
                ) : null}
              </VStack>
            </RevealGroup>
          </VStack>

          <RevealGroup
            className="min-w-0 w-full"
            revealed={revealed}
            staggerIndex={sidebarStaggerIndex}
          >
            <OrderSidebar
              confirmAddressCta={confirmAddressCta}
              content={content}
              onConfirmAddress={handleConfirmAddressClick}
              onPay={payCta ? handlePrimaryAction : undefined}
              onViewInvoicePdf={
                hasIssuedInvoice(content)
                  ? openPlaceholderInvoicePdf
                  : undefined
              }
              payCta={payCta}
            />
          </RevealGroup>
        </div>
      </main>
      <Footer {...STORE_FOOTER} />
      <Toast position="bottom-right" />

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
