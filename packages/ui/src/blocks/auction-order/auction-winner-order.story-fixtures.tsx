import { getMessages } from "@grade10/i18n";
import { expect, fn, waitFor } from "storybook/test";
import type { AuctionWinnerOrderProps } from "./types";

export const IMAGE = new URL(
  "../store-order-history/product.fixture.png",
  import.meta.url,
).href;

const { auctionOrders } = getMessages("grade10", "en");

export const COPY: AuctionWinnerOrderProps["copy"] = {
  orderProgress: "Order Progress",
  orderSummary: "Order summary",
  invoice: "Invoice",
  invoicePdf: "Invoice PDF",
  paymentMethod: "Payment method",
  refundDetails: "Refund Details",
  winningBid: "Winning bid",
  bank: "Bank",
  bankDetailsClose: auctionOrders.bankDetails.close,
  bankDetailsQrAlt: auctionOrders.bankDetails.qrAlt,
};

export const STEPS: NonNullable<AuctionWinnerOrderProps["progress"]>["steps"] =
  {
    address: { label: "Address", description: "24 Sep 2026, 15:12" },
    invoice: { label: "Invoice", description: "25 Sep 2026, 10:00" },
    payment: { label: "Payment", description: "Pay by 2 Oct 2026" },
    shipping: { label: "Shipping" },
    completed: { label: "Completed" },
  };

export const LINE_TOOLTIPS = {
  buyersPremium: "Grade10’s fee on the winning bid.",
  shipping: "Quoted for your confirmed delivery address.",
  cardFee: "Charged for paying by card. Included in your Order Total.",
};

/**
 * HKD-settled invoice lines keep their original USD amounts: US$12,800.00 +
 * US$2,560.00 + US$180.00 = US$15,540.00, which the Subtotal converts at 7.85
 * to HK$121,989.00. The card fee is computed in HKD on that Subtotal and
 * carries no USD counterpart, so it sits below the Subtotal
 * (g10.shared-auction-order.SC1).
 */
export const INVOICE_LINES = [
  { label: "Winning Bid", value: "US$12,800.00" },
  {
    label: "Buyer’s Premium",
    value: "US$2,560.00",
    tooltip: LINE_TOOLTIPS.buyersPremium,
  },
  {
    label: "Shipping & Handling",
    value: "US$180.00",
    tooltip: LINE_TOOLTIPS.shipping,
  },
];

/**
 * The HKD subtotal `INVOICE_LINES` converts to. The footnote names the USD
 * subtotal of the lines above and the fixed rate — the only place the summary
 * names either (g10.shared-auction-order.SC2).
 */
export const INVOICE_SUBTOTAL: NonNullable<
  AuctionWinnerOrderProps["summary"]["subtotal"]
> = {
  label: "Subtotal",
  value: "HK$121,989.00",
  footnote: "Converted from US$15,540.00 at 1 USD = 7.85 HKD",
};

export const INVOICE_FEE_LINES = [
  {
    label: "Payment Processing Fee",
    value: "HK$4,296.05",
    tooltip: LINE_TOOLTIPS.cardFee,
  },
];

/** HK$121,989.00 + HK$4,296.05, to the cent. */
export const INVOICE_TOTAL: AuctionWinnerOrderProps["summary"]["total"] = {
  label: "Order Total",
  value: "HK$126,285.05",
};

export const DELIVERY = {
  label: "Delivery address",
  value: "Chan Tai Man\nFlat 12A, 88 Queen’s Road Central\nCentral, Hong Kong",
};

export const SETUP_CONFIRM = {
  label: "Complete Order Setup",
  onPress: fn(),
  deadline: "Confirm by 26 Sep 2026, 15:12",
};

export const BANK_TRANSFER_METHOD: AuctionWinnerOrderProps["paymentMethod"] = {
  kind: "bank",
  label: "Bank transfer",
  bankName: "HSBC",
};

export function bankTransferPay(deadline: string) {
  return {
    label: "Submit Payment Proof",
    onPress: fn(),
    secondary: { label: "View Bank Details", onPress: fn() },
    deadline,
  };
}

export const BASE_ARGS: AuctionWinnerOrderProps = {
  copy: COPY,
  title: "Winner Order",
  badge: { label: "Pending Payment", variant: "warning" },
  progress: { current: "payment", steps: STEPS },
  lot: {
    title: "1999 Pokémon Base Set Charizard PSA 9",
    winningBid: "US$12,800",
    imageSrc: IMAGE,
    href: "#lot",
    ariaLabel: "1999 Pokémon Base Set Charizard PSA 9 — open lot details",
  },
  summary: {
    lines: INVOICE_LINES,
    subtotal: INVOICE_SUBTOTAL,
    feeLines: INVOICE_FEE_LINES,
    total: INVOICE_TOTAL,
    invoicePdf: { onOpen: fn() },
    pay: {
      label: "Pay with Card",
      onPress: fn(),
      deadline: "Pay by 2 Oct 2026, 15:00 HKT",
    },
  },
  paymentMethod: { kind: "text", label: "Card" },
  delivery: DELIVERY,
};

export async function settled(canvasElement: HTMLElement) {
  await waitFor(() =>
    expect(
      canvasElement.querySelector('[data-slot="winner-order"]'),
    ).not.toBeNull(),
  );
  await Promise.all(
    canvasElement
      .getAnimations({ subtree: true })
      .filter(
        (animation) =>
          animation.effect?.getComputedTiming().iterations !== Infinity,
      )
      .map((animation) => animation.finished.catch(() => undefined)),
  );
}
