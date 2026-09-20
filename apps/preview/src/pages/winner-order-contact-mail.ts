export const WINNER_ORDER_SUPPORT_EMAIL = "support@grade10.com" as const;

export const WINNER_ORDER_INVOICE_ID = "INV-202609-LK7P2Q-01" as const;

export type WinnerOrderContactReason =
  | "setup_overdue"
  | "payment_overdue"
  | "partial_payment"
  | "cancelled"
  | "delivered";

export type WinnerOrderContactMail = {
  to: typeof WINNER_ORDER_SUPPORT_EMAIL;
  subject: string;
  body: string;
  mailtoHref: string;
  copyText: string;
};

const STATUS_LABEL: Record<WinnerOrderContactReason, string> = {
  setup_overdue: "Setup overdue",
  payment_overdue: "Payment overdue",
  partial_payment: "Partially paid",
  cancelled: "Cancelled",
  delivered: "Delivered",
};

const SUBJECT_REASON: Record<WinnerOrderContactReason, string> = {
  setup_overdue: "setup overdue",
  payment_overdue: "payment overdue",
  partial_payment: "partial payment",
  cancelled: "cancelled",
  delivered: "delivered",
};

export function contactReasonFor(
  status: string,
): WinnerOrderContactReason | null {
  switch (status) {
    case "awaiting_address_expired":
      return "setup_overdue";
    case "pending_payment_expired":
      return "payment_overdue";
    case "partially_paid":
      return "partial_payment";
    case "cancelled":
      return "cancelled";
    case "delivered":
      return "delivered";
    default:
      return null;
  }
}

export function winnerOrderContactMail({
  reason,
  lotTitle,
  invoiceId,
  receiptIds = [],
}: {
  reason: WinnerOrderContactReason;
  lotTitle: string;
  invoiceId?: string | null;
  receiptIds?: string[];
}): WinnerOrderContactMail {
  const subject =
    reason === "setup_overdue" || !invoiceId
      ? `Auction lot ${lotTitle}: ${SUBJECT_REASON[reason]}`
      : `Auction order ${invoiceId}: ${SUBJECT_REASON[reason]}`;

  const lines = [
    "Hello Grade10,",
    "",
    "I need help with this auction order.",
    "",
  ];
  if (invoiceId && reason !== "setup_overdue") {
    lines.push(`Invoice: ${invoiceId}`);
  }
  lines.push(`Lot: ${lotTitle}`);
  lines.push(`Status: ${STATUS_LABEL[reason]}`);
  if (receiptIds.length > 0) {
    lines.push(`Receipts: ${receiptIds.join(", ")}`);
  }
  lines.push("", "[Write your message here]");

  const body = lines.join("\n");
  const to = WINNER_ORDER_SUPPORT_EMAIL;
  const mailtoHref = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const copyText = `To: ${to}\nSubject: ${subject}\n\n${body}`;

  return { to, subject, body, mailtoHref, copyText };
}
