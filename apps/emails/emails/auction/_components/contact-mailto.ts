/** Shared mailto builder for auction letter Contact Us CTAs. */

export const SUPPORT_EMAIL = "support@grade10.com" as const;

export const PREVIEW_INVOICE_ID = "INV-202609-LK7P2Q-01" as const;

export function supportMailto(subject: string, body: string): string {
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function setupOverdueMailto(lotTitle: string): string {
  const subject = `Auction lot ${lotTitle}: setup overdue`;
  const body = [
    "Hello Grade10,",
    "",
    "I need help with this auction order.",
    "",
    `Lot: ${lotTitle}`,
    "Status: Setup overdue",
    "",
    "[Write your message here]",
  ].join("\n");
  return supportMailto(subject, body);
}

export function paymentOverdueMailto(
  lotTitle: string,
  invoiceId: string,
): string {
  const subject = `Auction order ${invoiceId}: payment overdue`;
  const body = [
    "Hello Grade10,",
    "",
    "I need help with this auction order.",
    "",
    `Invoice: ${invoiceId}`,
    `Lot: ${lotTitle}`,
    "Status: Payment overdue",
    "",
    "[Write your message here]",
  ].join("\n");
  return supportMailto(subject, body);
}

export function partialPaymentMailto(
  lotTitle: string,
  invoiceId: string,
  receiptIds: string[] = [],
): string {
  const subject = `Auction order ${invoiceId}: partial payment`;
  const lines = [
    "Hello Grade10,",
    "",
    "I need help with this auction order.",
    "",
    `Invoice: ${invoiceId}`,
    `Lot: ${lotTitle}`,
    "Status: Partially paid",
  ];
  if (receiptIds.length > 0) {
    lines.push(`Receipts: ${receiptIds.join(", ")}`);
  }
  lines.push("", "[Write your message here]");
  return supportMailto(subject, lines.join("\n"));
}

export function cancelledMailto(lotTitle: string, invoiceId: string): string {
  const subject = `Auction order ${invoiceId}: cancelled`;
  const body = [
    "Hello Grade10,",
    "",
    "I need help with this auction order.",
    "",
    `Invoice: ${invoiceId}`,
    `Lot: ${lotTitle}`,
    "Status: Cancelled",
    "",
    "[Write your message here]",
  ].join("\n");
  return supportMailto(subject, body);
}

export function deliveredMailto(lotTitle: string, invoiceId: string): string {
  const subject = `Auction order ${invoiceId}: delivered`;
  const body = [
    "Hello Grade10,",
    "",
    "I need help with this auction order.",
    "",
    `Invoice: ${invoiceId}`,
    `Lot: ${lotTitle}`,
    "Status: Delivered",
    "",
    "[Write your message here]",
  ].join("\n");
  return supportMailto(subject, body);
}
