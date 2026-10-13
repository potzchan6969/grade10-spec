import { getMessages } from "@grade10/i18n";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { AuctionWinnerOrder } from "./auction-winner-order";
import type {
  AuctionPaymentRail,
  AuctionSettlementCurrency,
  AuctionWinnerOrderPaymentChoice,
  AuctionWinnerOrderProps,
} from "./types";

const IMAGE = new URL(
  "../store-order-history/product.fixture.png",
  import.meta.url,
).href;

const { auctionOrders } = getMessages("grade10", "en");
const { auctionOrders: traditionalChineseAuctionOrders } = getMessages(
  "grade10",
  "zh-Hant",
);

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

const CONTROLLED_PAYMENT_CHOICES: Record<
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

const NON_ENGLISH_COPY = {
  ...COPY,
  bankDetailsClose: traditionalChineseAuctionOrders.bankDetails.close,
  bankDetailsQrAlt: traditionalChineseAuctionOrders.bankDetails.qrAlt,
};

const CONTROLLED_BANK_DETAILS = {
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

const STEPS: NonNullable<AuctionWinnerOrderProps["progress"]>["steps"] = {
  address: { label: "Address", description: "24 Sep 2026, 15:12" },
  invoice: { label: "Invoice", description: "25 Sep 2026, 10:00" },
  payment: { label: "Payment", description: "Pay by 2 Oct 2026" },
  shipping: { label: "Shipping" },
  completed: { label: "Completed" },
};

const INVOICE_LINES = [
  { label: "Winning Bid", value: "HK$12,800.00" },
  { label: "Buyer’s Premium", value: "HK$2,560.00" },
  { label: "Shipping & Handling", value: "HK$180.00" },
  { label: "Payment Processing Fee", value: "HK$545.00" },
];

const DELIVERY = {
  label: "Delivery address",
  value: "Chan Tai Man\nFlat 12A, 88 Queen’s Road Central\nCentral, Hong Kong",
};

const meta = {
  title: "Auction/Post Bidding/Blocks/AuctionWinnerOrder",
  component: AuctionWinnerOrder,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
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
      total: { label: "Order Total", value: "HK$16,085.00" },
      invoicePdf: { onOpen: fn() },
      pay: {
        label: "Pay with Card",
        onPress: fn(),
        deadline: "Pay by 2 Oct 2026, 15:00 HKT",
      },
    },
    paymentMethod: { kind: "text", label: "Card" },
    delivery: DELIVERY,
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

function ControlledSettlementStory({
  base,
}: {
  base: AuctionWinnerOrderProps;
}) {
  const [currency, setCurrency] = useState<AuctionSettlementCurrency | null>(
    null,
  );
  const [payment, setPayment] = useState<
    AuctionWinnerOrderPaymentChoice["value"] | null
  >(null);

  function handleCurrencyChange(value: AuctionSettlementCurrency) {
    setCurrency(value);
    setPayment(null);
  }

  return (
    <AuctionWinnerOrder
      {...base}
      copy={NON_ENGLISH_COPY}
      bankDetails={payment === "fps" ? CONTROLLED_BANK_DETAILS : undefined}
      paymentChoices={{
        label: "Payment method",
        byCurrency: CONTROLLED_PAYMENT_CHOICES,
        value: payment,
        onChange: setPayment,
      }}
      settlementCurrency={{
        label: "Settlement currency",
        options: [
          { value: "USD", label: "USD" },
          { value: "HKD", label: "HKD" },
        ],
        value: currency,
        onChange: handleCurrencyChange,
      }}
      summary={{
        ...base.summary,
        pay: {
          label: "Submit Payment Proof",
          onPress: fn(),
          secondary: { label: "View Bank Details", onPress: fn() },
        },
      }}
    />
  );
}

/**
 * The shared block owns the rendered settlement controls and bank dialog. The
 * consumer controls both selections, including clearing a rail on a currency
 * change, and supplies every word in the non-English dialog.
 */
export const ControlledSettlementControlsAndBankDialog: Story = {
  render: (args) => <ControlledSettlementStory base={args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const currencyList = canvas.getByRole("radiogroup");
    const usd = within(currencyList).getByRole("radio", { name: "USD" });
    const hkd = within(currencyList).getByRole("radio", { name: "HKD" });
    expect(usd).not.toBeChecked();
    expect(hkd).not.toBeChecked();
    expect(
      canvas.queryByRole("radio", { name: "FPS" }),
    ).not.toBeInTheDocument();

    usd.focus();
    await userEvent.keyboard(" ");
    await waitFor(() => expect(usd).toBeChecked());
    const card = canvas.getByRole("radio", { name: /^Card/ });
    expect(card).toHaveAttribute("aria-disabled", "true");
    expect(card).toHaveAccessibleName(/Card is not yet available in USD/);
    await userEvent.click(card);
    expect(card).not.toBeChecked();

    hkd.focus();
    await userEvent.keyboard(" ");
    const fps = await waitFor(() =>
      canvas.getByRole("radio", { name: /^FPS/ }),
    );
    fps.focus();
    await userEvent.keyboard(" ");
    await waitFor(() => expect(fps).toBeChecked());

    const trigger = canvas.getByRole("button", { name: "View Bank Details" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    const dialog = await waitFor(() =>
      body.getByRole("dialog", { name: "View Bank Details" }),
    );
    expect(dialog).toBeVisible();
    expect(
      body.getByRole("img", {
        name: traditionalChineseAuctionOrders.bankDetails.qrAlt,
      }),
    ).toBeVisible();
    expect(
      body.getByRole("button", {
        name: traditionalChineseAuctionOrders.bankDetails.close,
      }),
    ).toBeVisible();
    for (let index = 0; index < 4; index += 1) {
      await userEvent.tab();
      const active = document.activeElement;
      expect(
        dialog.contains(active) ||
          active?.hasAttribute("data-base-ui-focus-guard"),
      ).toBe(true);
    }

    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(body.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(body.getByRole("dialog")).toBeVisible());
    await userEvent.click(
      body.getByRole("button", {
        name: traditionalChineseAuctionOrders.bankDetails.close,
      }),
    );
    await waitFor(() =>
      expect(body.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveFocus();
  },
};

export const PendingPayment: Story = {
  play: async ({ args, canvasElement }) => {
    await settled(canvasElement);
    const canvas = within(canvasElement);
    const states = [
      ...canvasElement.querySelectorAll('[data-slot="step"]'),
    ].map((step) => step.getAttribute("data-state"));
    expect(states).toEqual([
      "completed",
      "completed",
      "progress",
      "upcoming",
      "upcoming",
    ]);
    await userEvent.click(
      canvas.getByRole("button", { name: "Pay with Card" }),
    );
    expect(args.summary.pay?.onPress).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole("link", { name: "Invoice PDF" }));
    expect(args.summary.invoicePdf?.onOpen).toHaveBeenCalledTimes(1);
  },
};

export const AwaitingSetup: Story = {
  args: {
    badge: { label: "Awaiting Setup", variant: "warning" },
    progress: {
      current: "address",
      steps: {
        ...STEPS,
        address: { label: "Address", description: "Confirm by 26 Sep 2026" },
        invoice: { label: "Invoice" },
        payment: { label: "Payment" },
      },
    },
    summary: {
      lines: [
        { label: "Winning Bid", value: "HK$12,800.00" },
        { label: "Shipping & Handling", value: "TBD", muted: true },
      ],
      total: { label: "Order Total", value: "TBD", muted: true },
    },
    paymentMethod: undefined,
    delivery: {
      label: "Delivery address",
      confirm: {
        label: "Complete Order Setup",
        onPress: fn(),
        deadline: "Confirm by 26 Sep 2026, 15:12",
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    await settled(canvasElement);
    const sidebar = within(within(canvasElement).getByRole("complementary"));
    await userEvent.click(
      sidebar.getByRole("button", { name: "Complete Order Setup" }),
    );
    expect(args.delivery?.confirm?.onPress).toHaveBeenCalledTimes(1);
  },
};

export const PaymentVerifying: Story = {
  args: {
    badge: { label: "Payment Verifying", variant: "default" },
    note: {
      title:
        "We’re verifying your transfer. We’ll email you when payment is confirmed.",
      icon: "hourglass",
    },
    summary: {
      lines: INVOICE_LINES,
      total: { label: "Order Total", value: "HK$16,085.00" },
    },
    paymentMethod: { kind: "text", label: "Bank transfer" },
  },
  play: async ({ canvasElement }) => {
    await settled(canvasElement);
    expect(within(canvasElement).getByRole("alert")).toHaveTextContent(
      "We’re verifying your transfer",
    );
  },
};

export const BankTransferDue: Story = {
  args: {
    summary: {
      lines: INVOICE_LINES,
      total: { label: "Order Total", value: "HK$16,085.00" },
      pay: {
        label: "Submit Payment Proof",
        onPress: fn(),
        secondary: { label: "View Bank Details", onPress: fn() },
        deadline: "Pay by 2 Oct 2026, 15:00 HKT",
      },
    },
    paymentMethod: { kind: "bank", label: "Bank transfer", bankName: "HSBC" },
  },
  play: async ({ args, canvasElement }) => {
    await settled(canvasElement);
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "View Bank Details" }),
    );
    expect(args.summary.pay?.secondary?.onPress).toHaveBeenCalledTimes(1);
  },
};

export const CardRedirecting: Story = {
  args: {
    summary: {
      lines: INVOICE_LINES,
      total: { label: "Order Total", value: "HK$16,085.00" },
      pay: { label: "Redirecting…", onPress: fn(), loading: true },
    },
  },
  play: async ({ canvasElement }) => {
    await settled(canvasElement);
    const pay = within(canvasElement).getByRole("button", {
      name: "Redirecting…",
    });
    expect(pay).toBeDisabled();
    expect(pay).toHaveAttribute("aria-busy", "true");
  },
};

export const ProofReturned: Story = {
  args: {
    alerts: [
      {
        title: "Payment proof returned",
        description:
          "Reason: The transfer receipt is unreadable.\nPayment deadline restarted: 9 Oct 2026, 15:00 HKT",
        status: "warning",
      },
    ],
  },
  play: async ({ canvasElement }) => {
    await settled(canvasElement);
    expect(within(canvasElement).getByRole("alert")).toHaveTextContent(
      "Reason: The transfer receipt is unreadable.",
    );
  },
};

export const PartiallyPaid: Story = {
  args: {
    badge: { label: "Partially Paid", variant: "warning" },
    summary: {
      lines: INVOICE_LINES,
      total: { label: "Order Total", value: "HK$16,085.00" },
      alert: {
        title: "Payment received in part",
        status: "warning",
        action: { label: "Contact Us", onPress: fn() },
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    await settled(canvasElement);
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Contact Us" }),
    );
    expect(args.summary.alert?.action?.onPress).toHaveBeenCalledTimes(1);
  },
};

export const SetupOverdue: Story = {
  args: {
    badge: { label: "Setup Overdue", variant: "error" },
    progress: {
      current: "address",
      steps: {
        ...STEPS,
        address: { label: "Address", description: "26 Sep 2026" },
        invoice: { label: "Invoice" },
        payment: { label: "Payment" },
      },
    },
    summary: {
      lines: [{ label: "Winning Bid", value: "HK$12,800.00" }],
      total: { label: "Order Total", value: "TBD", muted: true },
    },
    paymentMethod: undefined,
    delivery: {
      label: "Delivery address",
      alert: {
        title: "Missed setup deadline: 26 Sep 2026",
        status: "warning",
        action: { label: "Contact Us", onPress: fn() },
      },
    },
  },
};

export const Delivered: Story = {
  args: {
    badge: { label: "Delivered", variant: "outline" },
    progress: {
      current: "done",
      steps: {
        ...STEPS,
        payment: { label: "Payment", description: "27 Sep 2026" },
        shipping: { label: "Shipping", description: "29 Sep 2026" },
        completed: { label: "Completed", description: "1 Oct 2026" },
      },
    },
    summary: {
      lines: INVOICE_LINES,
      total: { label: "Order Total", value: "HK$16,085.00" },
    },
    paymentMethod: { kind: "card", brand: "visa", masked: "•••• 4242" },
    receipts: [{ label: "Receipt", href: "#receipt.pdf" }],
  },
  play: async ({ canvasElement }) => {
    await settled(canvasElement);
    const states = [
      ...canvasElement.querySelectorAll('[data-slot="step"]'),
    ].map((step) => step.getAttribute("data-state"));
    expect(new Set(states)).toEqual(new Set(["completed"]));
  },
};

export const Shipped: Story = {
  args: {
    badge: { label: "Shipped", variant: "default" },
    progress: {
      current: "shipping",
      steps: {
        ...STEPS,
        payment: { label: "Payment", description: "27 Sep 2026" },
        shipping: { label: "Shipping", description: "29 Sep 2026" },
      },
      tracking: { code: "SF1234567890", href: "https://www.sf-express.com/" },
    },
    summary: {
      lines: INVOICE_LINES,
      total: { label: "Order Total", value: "HK$16,085.00" },
      invoicePdf: { onOpen: fn() },
    },
    paymentMethod: { kind: "card", brand: "visa", masked: "•••• 4242" },
    receipts: [{ label: "Receipt", href: "#receipt.pdf" }],
  },
  play: async ({ canvasElement }) => {
    await settled(canvasElement);
    const link = within(canvasElement).getByRole("link", {
      name: "SF1234567890",
    });
    expect(link).toHaveAttribute("href", "https://www.sf-express.com/");
    expect(link).toHaveAttribute("target", "_blank");
  },
};

export const Cancelled: Story = {
  args: {
    badge: { label: "Cancelled", variant: "outline" },
    progress: null,
    alerts: [
      {
        title: "Order cancelled. The lot returned to available stock.",
        status: "default",
        action: { label: "Contact Us", onPress: fn() },
      },
    ],
    summary: {
      lines: [{ label: "Winning Bid", value: "HK$12,800.00" }],
      total: { label: "Order Total", value: "—" },
    },
    paymentMethod: undefined,
    delivery: undefined,
  },
  play: async ({ canvasElement }) => {
    await settled(canvasElement);
    expect(
      canvasElement.querySelector('[data-slot="winner-order-progress"]'),
    ).toBeNull();
  },
};

export const Refunded: Story = {
  args: {
    badge: { label: "Refunded", variant: "outline" },
    progress: null,
    summary: {
      lines: INVOICE_LINES,
      total: { label: "Order Total", value: "HK$16,085.00" },
      invoicePdf: { onOpen: fn() },
      refund: { title: "Refund HK$16,085", onView: fn() },
    },
    paymentMethod: { kind: "card", brand: "mastercard", masked: "•••• 5454" },
    receipts: [{ label: "Receipt", href: "#receipt.pdf" }],
  },
  play: async ({ args, canvasElement }) => {
    await settled(canvasElement);
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "View" }),
    );
    expect(args.summary.refund?.onView).toHaveBeenCalledTimes(1);
  },
};
