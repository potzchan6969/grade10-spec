import { formatDay } from "@grade10/date";
import type { AuctionWinnerOrderProps } from "@grade10/ui";
import { AUCTION_LOT_DETAILS_HREF } from "../../workbench-story-nav";
import type { WinnerOrderContent } from "./winner-order-content";
import {
  CANCELLED_AT_MS,
  CANCELLED_ZONE,
  hasIssuedInvoice,
  noteFor,
  paymentMethodFor,
  progressFor,
  receiptLinksFor,
  summaryLinesFor,
  WINNER_ORDER_COPY,
  winnerOrderBadgeVariant,
} from "./winner-order-page";

const LOT_IMAGE = new URL("../../product.fixture.png", import.meta.url).href;
const noop = () => undefined;
const CONTACT_ACTION = { label: "Contact Us", onPress: noop };

/**
 * The Winner Order block as the Winner Order screen first draws it for one
 * status, with no dialogs or transitions: a flow step is a still of the screen.
 */
function winnerOrderFlowView(
  content: WinnerOrderContent,
): AuctionWinnerOrderProps {
  const outcomeAlert =
    content.status === "cancelled"
      ? {
          title: `Cancelled on ${formatDay(CANCELLED_AT_MS, { locale: "en", timeZone: CANCELLED_ZONE })}`,
          status: "warning" as const,
          action: CONTACT_ACTION,
        }
      : content.outcomeAlert;
  const payCta =
    content.status === "pending_payment" && !content.overdue
      ? content.setupPaymentMethod === "Bank transfer"
        ? "Submit Payment Proof"
        : "Pay with Card"
      : null;
  const paymentOverdue =
    Boolean(content.overdue) && content.status === "pending_payment_expired";
  const addressOverdue =
    Boolean(content.overdue) &&
    (content.status === "awaiting_address" ||
      content.status === "awaiting_address_expired");
  const settlementContact =
    content.status === "partially_paid"
      ? (content.secondaryNote ??
        "Only part of this invoice is settled. Contact Grade10 about what remains.")
      : null;
  const lines = summaryLinesFor(content);
  const total = lines.find((line) => line.label === "Order Total");

  return {
    copy: WINNER_ORDER_COPY,
    title: content.title,
    badge: {
      label: content.statusLabel,
      variant: winnerOrderBadgeVariant(content.status),
    },
    progress: progressFor(content),
    note: noteFor(content),
    lot: {
      title: content.lotTitle,
      winningBid: content.winningBid,
      imageSrc: LOT_IMAGE,
      href: AUCTION_LOT_DETAILS_HREF,
      ariaLabel: `${content.lotTitle} — open lot details`,
    },
    alerts: outcomeAlert ? [outcomeAlert] : [],
    summary: {
      lines: lines.filter((line) => line !== total),
      total: total ?? null,
      invoicePdf: hasIssuedInvoice(content) ? { onOpen: noop } : undefined,
      refund: content.refund
        ? { title: `Refund ${content.refund.amount}`, onView: noop }
        : undefined,
      alert: paymentOverdue
        ? {
            title: content.deadline ?? "Payment deadline passed",
            status: "warning",
            action: CONTACT_ACTION,
          }
        : settlementContact
          ? {
              title: settlementContact,
              status: "warning",
              action: CONTACT_ACTION,
            }
          : undefined,
      pay:
        payCta && !paymentOverdue && !settlementContact
          ? {
              label: payCta,
              onPress: noop,
              secondary:
                payCta === "Submit Payment Proof"
                  ? { label: "View Bank Details", onPress: noop }
                  : undefined,
              deadline: content.deadline,
            }
          : undefined,
    },
    paymentMethod: paymentMethodFor(content),
    receipts: receiptLinksFor(content).map((receipt) => ({
      label: receipt.label,
      ariaLabel: `${receipt.label} PDF`,
      onOpen: noop,
    })),
    delivery:
      content.status === "cancelled"
        ? undefined
        : {
            label: content.addressLabel,
            value: content.addressValue ?? undefined,
            alert: addressOverdue
              ? {
                  title: content.deadline ?? "Missed setup deadline",
                  status: "warning",
                  action: CONTACT_ACTION,
                }
              : undefined,
            confirm:
              content.status === "awaiting_address" &&
              content.primaryCta === "Complete Order Setup" &&
              !addressOverdue
                ? {
                    label: content.primaryCta,
                    onPress: noop,
                    deadline: content.deadline,
                  }
                : undefined,
          },
    billing: content.billingValue
      ? {
          label: content.billingLabel ?? "Billing address",
          value: content.billingValue,
        }
      : undefined,
  };
}

export { winnerOrderFlowView };
