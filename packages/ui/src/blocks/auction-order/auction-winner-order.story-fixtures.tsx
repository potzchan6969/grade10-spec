import { getMessages } from "@grade10/i18n";
import { expect, fn, waitFor } from "storybook/test";
import type {
  AuctionPaymentRail,
  AuctionSettlementCurrency,
  AuctionWinnerOrderPaymentChoice,
  AuctionWinnerOrderProps,
} from "./types";

export const IMAGE = new URL(
  "../store-order-history/product.fixture.png",
  import.meta.url,
).href;

const { auctionOrders } = getMessages("grade10", "en");
export const { auctionOrders: traditionalChineseAuctionOrders } = getMessages(
  "grade10",
  "zh-Hant",
);

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

export const CURRENCY_TOGGLE = {
  primary: auctionOrders.setup.currency.hkd,
  secondary: auctionOrders.setup.currency.usd,
  ariaLabel: "Amount currency",
};

export const NON_ENGLISH_COPY = {
  ...COPY,
  bankDetailsClose: traditionalChineseAuctionOrders.bankDetails.close,
  bankDetailsQrAlt: traditionalChineseAuctionOrders.bankDetails.qrAlt,
};

export const CONTROLLED_PAYMENT_CHOICES: Record<
  AuctionSettlementCurrency,
  readonly AuctionWinnerOrderPaymentChoice[]
> = {
  HKD: [
    { value: "card", label: "Card", feeRange: "3.0% + HK$10" },
    { value: "fps", label: "FPS", feeRange: "No fee" },
    { value: "hk_local", label: "HK Local", feeRange: "No fee" },
  ],
  USD: [
    {
      value: "card",
      label: "Card",
      feeRange: "3.0% + US$1",
      unavailable: "Card is not yet available in USD.",
    },
    { value: "hk_local", label: "HK Local", feeRange: "No fee" },
    {
      value: "swift",
      label: "International via SWIFT",
      feeRange: "No fee",
    },
  ],
};

export const CONTROLLED_BANK_DETAILS = {
  rail: "fps" as AuctionPaymentRail,
  title: "View Bank Details",
  rows: [
    { label: "Amount due", value: "HK$128,269.00" },
    { label: "FPS ID", value: "852-1234-5678" },
    { label: "Account name", value: "Grade10 Auctions" },
    { label: "Payment reference", value: "G10-WINNER-1999" },
  ],
  qrSrc: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
  note: "Open your banking app and scan this QR",
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
 * HKD-settled invoice lines: each value is the converted HKD amount and its
 * `subtext` the lot's USD figure, so a summary carrying `currencyToggle` can
 * swap between the two. The card fee is computed in HKD and carries no USD
 * counterpart, so it reads HKD in both views (winner-order-SC-290,
 * winner-order-SC-304).
 */
export const INVOICE_LINES = [
  { label: "Winning Bid", value: "HK$12,800.00", subtext: "US$12,800.00" },
  {
    label: "Buyer’s Premium",
    value: "HK$2,560.00",
    subtext: "US$2,560.00",
    tooltip: LINE_TOOLTIPS.buyersPremium,
  },
  {
    label: "Shipping & Handling",
    value: "HK$180.00",
    subtext: "US$180.00",
    tooltip: LINE_TOOLTIPS.shipping,
  },
  {
    label: "Payment Processing Fee",
    value: "HK$545.00",
    tooltip: LINE_TOOLTIPS.cardFee,
  },
];

/** HKD order total for `INVOICE_LINES`, with its USD counterpart. */
export const INVOICE_TOTAL: AuctionWinnerOrderProps["summary"]["total"] = {
  label: "Order Total",
  value: "HK$16,085.00",
  subtext: "US$15,540.00",
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
    currencyToggle: CURRENCY_TOGGLE,
    lines: INVOICE_LINES,
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
      canvasElement
        .querySelector('[data-slot="winner-order"]')
        ?.getAttribute("data-revealed"),
    ).toBe("true"),
  );
}
