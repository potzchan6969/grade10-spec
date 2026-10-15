import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { AuctionWinnerOrder } from "./auction-winner-order";
import {
  BASE_ARGS,
  CURRENCY_TOGGLE,
  INVOICE_LINES,
  INVOICE_TOTAL,
  STEPS,
  settled,
} from "./auction-winner-order.story-fixtures";

const meta = {
  title: "Auction/Post Bidding/Blocks/AuctionWinnerOrder/Fulfilment",
  component: AuctionWinnerOrder,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: BASE_ARGS,
} satisfies Meta<typeof AuctionWinnerOrder>;

export default meta;
type Story = StoryObj<typeof meta>;

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
      currencyToggle: CURRENCY_TOGGLE,
      lines: INVOICE_LINES,
      total: INVOICE_TOTAL,
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
      currencyToggle: CURRENCY_TOGGLE,
      lines: INVOICE_LINES,
      total: INVOICE_TOTAL,
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
      currencyToggle: CURRENCY_TOGGLE,
      lines: INVOICE_LINES,
      total: INVOICE_TOTAL,
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
