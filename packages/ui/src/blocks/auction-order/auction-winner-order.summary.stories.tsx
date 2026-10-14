import { getMessages } from "@grade10/i18n";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";
import { AuctionWinnerOrder } from "./auction-winner-order";
import type { AuctionWinnerOrderLine, AuctionWinnerOrderProps } from "./types";

const IMAGE = new URL(
  "../store-order-history/product.fixture.png",
  import.meta.url,
).href;

const { auctionOrders } = getMessages("grade10", "en");

const COPY: AuctionWinnerOrderProps["copy"] = {
  orderProgress: "Order Progress",
  orderSummary: "Order summary",
  invoice: "Invoice",
  invoicePdf: "Invoice PDF",
  paymentMethod: "Payment method",
  view: "View",
  winningBid: "Winning bid",
  bank: "Bank",
  bankDetailsClose: auctionOrders.bankDetails.close,
  bankDetailsQrAlt: auctionOrders.bankDetails.qrAlt,
};

const STEPS: NonNullable<AuctionWinnerOrderProps["progress"]>["steps"] = {
  address: { label: "Address", description: "12 Oct 2026, 15:12" },
  invoice: { label: "Invoice", description: "13 Oct 2026, 10:00" },
  payment: { label: "Payment", description: "Pay by 20 Oct 2026" },
  shipping: { label: "Shipping" },
  completed: { label: "Completed" },
};

const TOOLTIPS = {
  buyersPremium: "Grade10's fee on the winning bid.",
  shipping: "Quoted for your confirmed delivery address.",
  cardFee: "Charged for paying by card. Included in your Order Total.",
  bankFee:
    "Set by Grade10 for your bank transfer. Included in your Order Total.",
};

/**
 * One lot, three USD lines: US$101.00 + US$20.20 + US$10.01 = US$131.21. Under
 * HKD each line converts at 7.85 and rounds up to a whole HK$, then sums:
 * HK$793.00 + HK$159.00 + HK$79.00 = HK$1,031.00 (winner-order-SC-290).
 */
const USD_LINES: readonly AuctionWinnerOrderLine[] = [
  { label: "Winning Bid", value: "US$101.00" },
  {
    label: "Buyer’s Premium",
    value: "US$20.20",
    tooltip: TOOLTIPS.buyersPremium,
  },
  {
    label: "Shipping & Handling",
    value: "US$10.01",
    tooltip: TOOLTIPS.shipping,
  },
];

const HKD_LINES: readonly AuctionWinnerOrderLine[] = [
  { label: "Winning Bid", value: "HK$793.00", subtext: "US$101.00" },
  {
    label: "Buyer’s Premium",
    value: "HK$159.00",
    subtext: "US$20.20",
    tooltip: TOOLTIPS.buyersPremium,
  },
  {
    label: "Shipping & Handling",
    value: "HK$79.00",
    subtext: "US$10.01",
    tooltip: TOOLTIPS.shipping,
  },
];

const TBD_LINES: readonly AuctionWinnerOrderLine[] = [
  { label: "Winning Bid", value: "TBD", muted: true },
  {
    label: "Buyer’s Premium",
    value: "TBD",
    muted: true,
    tooltip: TOOLTIPS.buyersPremium,
  },
  {
    label: "Shipping & Handling",
    value: "TBD",
    muted: true,
    tooltip: TOOLTIPS.shipping,
  },
  {
    label: "Payment Processing Fee",
    value: "TBD",
    muted: true,
    tooltip: TOOLTIPS.bankFee,
  },
];

const meta = {
  title: "Auction/Post Bidding/Blocks/AuctionWinnerOrder/Order Summary",
  component: AuctionWinnerOrder,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The Order Summary in the winner's settlement currency. Under USD every line and the Order Total read USD. Under HKD each line reads HKD with its USD amount beneath it, the Payment Processing Fee reads HKD alone, and Order Total is one HKD total. The block formats nothing: the application supplies every amount.",
      },
    },
  },
  args: {
    copy: COPY,
    title: "Winner Order",
    badge: { label: "Pending Payment", variant: "warning" },
    progress: { current: "payment", steps: STEPS },
    lot: {
      title: "1999 Pokémon Base Set Charizard PSA 9",
      winningBid: "US$101.00",
      imageSrc: IMAGE,
      href: "#lot",
      ariaLabel: "1999 Pokémon Base Set Charizard PSA 9 — open lot details",
    },
    summary: {
      lines: USD_LINES,
      total: { label: "Order Total", value: "US$131.21" },
      invoicePdf: { onOpen: fn() },
    },
    delivery: {
      label: "Delivery address",
      value:
        "Chan Tai Man\nFlat 12A, 88 Queen’s Road Central\nCentral, Hong Kong",
    },
  },
} satisfies Meta<typeof AuctionWinnerOrder>;

export default meta;
type Story = StoryObj<typeof meta>;

async function settled(canvasElement: HTMLElement) {
  await waitFor(() =>
    expect(
      canvasElement
        .querySelector('[data-slot="winner-order"]')
        ?.getAttribute("data-revealed"),
    ).toBe("true"),
  );
}

function rowFor(canvasElement: HTMLElement, label: string) {
  const row = [
    ...canvasElement.querySelectorAll(
      '[data-slot="winner-order-summary-line"]',
    ),
  ].find((candidate) => candidate.textContent?.startsWith(label));
  if (!row) {
    throw new Error(`No summary row labelled ${label}`);
  }
  return {
    row: row as HTMLElement,
    subtext: row.querySelector('[data-slot="winner-order-summary-subtext"]'),
  };
}

function subtexts(canvasElement: HTMLElement) {
  return [
    ...canvasElement.querySelectorAll(
      '[data-slot="winner-order-summary-subtext"]',
    ),
  ].map((node) => node.textContent);
}

/**
 * USD settlement, bank transfer with no fee: every line and the Order Total
 * read USD, nothing sits beneath a line, and the fee reads Free
 * (winner-order-SC-291).
 */
export const UsdBankTransferFreeFee: Story = {
  args: {
    summary: {
      lines: [
        ...USD_LINES,
        {
          label: "Payment Processing Fee",
          value: "Free",
          tooltip: TOOLTIPS.bankFee,
        },
      ],
      total: { label: "Order Total", value: "US$131.21" },
      invoicePdf: { onOpen: fn() },
      pay: {
        label: "Submit Payment Proof",
        onPress: fn(),
        secondary: { label: "View Bank Details", onPress: fn() },
        deadline: "Pay by 20 Oct 2026, 15:00 HKT",
      },
    },
    paymentMethod: { kind: "bank", label: "International via SWIFT" },
  },
  play: async ({ canvasElement }) => {
    await settled(canvasElement);
    const sidebar = within(within(canvasElement).getByRole("complementary"));
    expect(sidebar.getByText("Order Total")).toBeInTheDocument();
    expect(sidebar.getByText("US$131.21")).toBeInTheDocument();
    expect(sidebar.getByText("Free")).toBeInTheDocument();
    expect(subtexts(canvasElement)).toEqual([]);
    expect(sidebar.queryByText(/HK\$/)).not.toBeInTheDocument();
  },
};

/**
 * USD settlement, bank transfer whose fee the operator typed in USD: the fee
 * is a USD line and the Order Total includes it (winner-order-SC-110).
 */
export const UsdBankTransferWithFee: Story = {
  args: {
    summary: {
      lines: [
        ...USD_LINES,
        {
          label: "Payment Processing Fee",
          value: "US$50.00",
          tooltip: TOOLTIPS.bankFee,
        },
      ],
      total: { label: "Order Total", value: "US$181.21" },
      invoicePdf: { onOpen: fn() },
      pay: {
        label: "Submit Payment Proof",
        onPress: fn(),
        secondary: { label: "View Bank Details", onPress: fn() },
        deadline: "Pay by 20 Oct 2026, 15:00 HKT",
      },
    },
    paymentMethod: { kind: "bank", label: "HK Local" },
  },
  play: async ({ canvasElement }) => {
    await settled(canvasElement);
    const sidebar = within(within(canvasElement).getByRole("complementary"));
    expect(sidebar.getByText("US$50.00")).toBeInTheDocument();
    expect(sidebar.getByText("US$181.21")).toBeInTheDocument();
    expect(subtexts(canvasElement)).toEqual([]);
  },
};

/**
 * HKD settlement, bank transfer with no fee: each line reads HKD with its USD
 * amount beneath it, the fee reads Free, and Order Total is one HKD total
 * with no USD total (winner-order-SC-290, winner-order-SC-111).
 */
export const HkdBankTransferFreeFee: Story = {
  args: {
    summary: {
      lines: [
        ...HKD_LINES,
        {
          label: "Payment Processing Fee",
          value: "Free",
          tooltip: TOOLTIPS.bankFee,
        },
      ],
      total: { label: "Order Total", value: "HK$1,031.00" },
      invoicePdf: { onOpen: fn() },
      pay: {
        label: "Submit Payment Proof",
        onPress: fn(),
        secondary: { label: "View Bank Details", onPress: fn() },
        deadline: "Pay by 20 Oct 2026, 15:00 HKT",
      },
    },
    paymentMethod: { kind: "bank", label: "FPS" },
  },
  play: async ({ canvasElement }) => {
    await settled(canvasElement);
    const sidebar = within(within(canvasElement).getByRole("complementary"));
    expect(subtexts(canvasElement)).toEqual([
      "US$101.00",
      "US$20.20",
      "US$10.01",
    ]);
    expect(rowFor(canvasElement, "Winning Bid").row.textContent).toContain(
      "HK$793.00",
    );
    expect(sidebar.getByText("HK$1,031.00")).toBeInTheDocument();
    expect(sidebar.queryByText("US$131.21")).not.toBeInTheDocument();
    expect(rowFor(canvasElement, "Payment Processing Fee").subtext).toBeNull();
    expect(
      within(canvasElement).getByText("Winning bid: US$101.00"),
    ).toBeInTheDocument();
  },
};

/**
 * HKD settlement, bank transfer whose US$50.00 fee the operator typed in USD:
 * it converts with the other lines, so it reads HK$393.00 with US$50.00
 * beneath it, and the Order Total adds it (winner-order-SC-302).
 */
export const HkdBankTransferWithFee: Story = {
  args: {
    summary: {
      lines: [
        ...HKD_LINES,
        {
          label: "Payment Processing Fee",
          value: "HK$393.00",
          subtext: "US$50.00",
          tooltip: TOOLTIPS.bankFee,
        },
      ],
      total: { label: "Order Total", value: "HK$1,424.00" },
      invoicePdf: { onOpen: fn() },
      pay: {
        label: "Submit Payment Proof",
        onPress: fn(),
        secondary: { label: "View Bank Details", onPress: fn() },
        deadline: "Pay by 20 Oct 2026, 15:00 HKT",
      },
    },
    paymentMethod: { kind: "bank", label: "HK Local" },
  },
  play: async ({ canvasElement }) => {
    await settled(canvasElement);
    expect(subtexts(canvasElement)).toEqual([
      "US$101.00",
      "US$20.20",
      "US$10.01",
      "US$50.00",
    ]);
    expect(within(canvasElement).getByText("HK$1,424.00")).toBeInTheDocument();
  },
};

/**
 * HKD settlement by card: the fee is computed in HKD from the HKD card rule on
 * the HKD subtotal, so it reads HK$38.73 with no USD amount beneath it, and
 * the Order Total of HK$1,069.73 includes it (winner-order-SC-304).
 */
export const HkdCardWithProcessingFee: Story = {
  args: {
    summary: {
      lines: [
        ...HKD_LINES,
        {
          label: "Payment Processing Fee",
          value: "HK$38.73",
          tooltip: TOOLTIPS.cardFee,
        },
      ],
      total: { label: "Order Total", value: "HK$1,069.73" },
      invoicePdf: { onOpen: fn() },
      pay: {
        label: "Pay with Card",
        onPress: fn(),
        deadline: "Pay by 20 Oct 2026, 15:00 HKT",
      },
    },
    paymentMethod: { kind: "text", label: "Card" },
  },
  play: async ({ canvasElement }) => {
    await settled(canvasElement);
    const sidebar = within(within(canvasElement).getByRole("complementary"));
    expect(subtexts(canvasElement)).toEqual([
      "US$101.00",
      "US$20.20",
      "US$10.01",
    ]);
    const fee = rowFor(canvasElement, "Payment Processing Fee");
    expect(fee.row.textContent).toContain("HK$38.73");
    expect(fee.subtext).toBeNull();
    expect(sidebar.getByText("HK$1,069.73")).toBeInTheDocument();
    expect(sidebar.queryByText(/US\$131/)).not.toBeInTheDocument();
  },
};

/**
 * The winner picked HKD but the invoice is not sent: no HKD amount shows, no
 * HKD total and no fee, and the lot card keeps the winning bid in USD
 * (winner-order-SC-292).
 */
export const HkdBeforeInvoiceSent: Story = {
  args: {
    badge: { label: "Preparing Invoice", variant: "default" },
    progress: {
      current: "invoice",
      steps: {
        ...STEPS,
        invoice: { label: "Invoice" },
        payment: { label: "Payment" },
      },
    },
    summary: {
      lines: TBD_LINES,
      total: { label: "Order Total", value: "TBD", muted: true },
    },
    paymentMethod: { kind: "text", label: "Card" },
  },
  play: async ({ canvasElement }) => {
    await settled(canvasElement);
    const sidebar = within(within(canvasElement).getByRole("complementary"));
    expect(sidebar.getAllByText("TBD")).toHaveLength(5);
    expect(sidebar.queryByText(/HK\$/)).not.toBeInTheDocument();
    expect(subtexts(canvasElement)).toEqual([]);
    expect(
      within(canvasElement).getByText("Winning bid: US$101.00"),
    ).toBeInTheDocument();
  },
};

/**
 * The block's two-total props, `summary.convertedTotal` and
 * `summary.convertedFee`, drawn as shared-ui-auction-order-SC-30 states them:
 * a USD total line, the HKD line below it, then the fee row after the
 * separator, in neither total. The winner order page does not use this shape
 * under HKD, which reads one HKD total.
 */
export const ConvertedTotalAndFeeProps: Story = {
  args: {
    summary: {
      lines: USD_LINES,
      total: { label: "Order Total", value: "US$131.21" },
      convertedTotal: { label: "Order Total", value: "HK$1,031.00" },
      convertedFee: { label: "Payment Processing Fee", value: "HK$38.73" },
      invoicePdf: { onOpen: fn() },
    },
    paymentMethod: { kind: "text", label: "Card" },
  },
  play: async ({ canvasElement }) => {
    await settled(canvasElement);
    const sidebar = within(within(canvasElement).getByRole("complementary"));
    const totals = sidebar.getAllByText("Order Total");
    expect(totals).toHaveLength(2);
    expect(sidebar.getByText("US$131.21")).toBeInTheDocument();
    expect(sidebar.getByText("HK$1,031.00")).toBeInTheDocument();
    expect(sidebar.getByText("HK$38.73")).toBeInTheDocument();
    expect(sidebar.getByText("Payment Processing Fee")).toBeInTheDocument();
  },
};
