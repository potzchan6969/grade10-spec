import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { AuctionWinnerOrder } from "./auction-winner-order";
import {
  BANK_TRANSFER_METHOD,
  BASE_ARGS,
  bankTransferPay,
  INVOICE_FEE_LINES,
  INVOICE_LINES,
  INVOICE_SUBTOTAL,
  INVOICE_TOTAL,
  settled,
} from "./auction-winner-order.story-fixtures";

const meta = {
  title: "Auction/Post Bidding/Blocks/AuctionWinnerOrder/Payment",
  component: AuctionWinnerOrder,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: BASE_ARGS,
} satisfies Meta<typeof AuctionWinnerOrder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PendingPayment: Story = {
  parameters: {
    verification: { caseId: "vc_7efc9f9c-da08-4ed0-8121-bd71629aa67d" },
  },
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
    expect(
      canvas.getByText("Converted from US$15,540.00 at 1 USD = 7.85 HKD"),
    ).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("link", { name: "Invoice PDF" }));
    expect(args.summary.invoicePdf?.onOpen).toHaveBeenCalledTimes(1);
  },
};

export const BankTransferDue: Story = {
  parameters: {
    verification: { caseId: "vc_e838f66f-048e-43e9-947e-bac4723a3ab8" },
  },
  args: {
    summary: {
      lines: INVOICE_LINES,
      subtotal: INVOICE_SUBTOTAL,
      feeLines: INVOICE_FEE_LINES,
      total: INVOICE_TOTAL,
      pay: bankTransferPay("Pay by 2 Oct 2026, 15:00 HKT"),
    },
    paymentMethod: BANK_TRANSFER_METHOD,
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
  parameters: {
    verification: { caseId: "vc_4d533ef9-a934-4616-9813-8881c076f644" },
  },
  args: {
    summary: {
      lines: INVOICE_LINES,
      subtotal: INVOICE_SUBTOTAL,
      feeLines: INVOICE_FEE_LINES,
      total: INVOICE_TOTAL,
      pay: { label: "Redirecting…", onPress: fn(), loading: true },
    },
  },
  play: async ({ args, canvasElement }) => {
    await settled(canvasElement);
    const pay = within(canvasElement).getByRole("button", {
      name: "Redirecting…",
    });
    expect(pay).toHaveAttribute("aria-busy", "true");
    pay.focus();
    expect(pay).toHaveFocus();
    pay.click();
    expect(args.summary.pay?.onPress).not.toHaveBeenCalled();
  },
};

export const PaymentVerifying: Story = {
  parameters: {
    verification: { caseId: "vc_ba468fda-283f-4e0c-8da7-cad7c08e522d" },
  },
  args: {
    badge: { label: "Payment Verifying", variant: "default" },
    note: {
      title:
        "We’re verifying your transfer. We’ll email you when payment is confirmed.",
      icon: "hourglass",
    },
    summary: {
      lines: INVOICE_LINES,
      subtotal: INVOICE_SUBTOTAL,
      feeLines: INVOICE_FEE_LINES,
      total: INVOICE_TOTAL,
    },
    paymentMethod: BANK_TRANSFER_METHOD,
  },
  play: async ({ canvasElement }) => {
    await settled(canvasElement);
    expect(within(canvasElement).getByRole("alert")).toHaveTextContent(
      "We’re verifying your transfer",
    );
  },
};

export const ProofReturned: Story = {
  parameters: {
    verification: { caseId: "vc_e537a4a9-d9ff-46f1-896f-da82ee71c6da" },
  },
  args: {
    summary: {
      lines: INVOICE_LINES,
      subtotal: INVOICE_SUBTOTAL,
      feeLines: INVOICE_FEE_LINES,
      total: INVOICE_TOTAL,
      pay: bankTransferPay("Pay by 9 Oct 2026, 15:00 HKT"),
    },
    paymentMethod: BANK_TRANSFER_METHOD,
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
  parameters: {
    verification: { caseId: "vc_54a85a58-102f-4dd0-86a4-715a509d9b4e" },
  },
  args: {
    badge: { label: "Partially Paid", variant: "warning" },
    summary: {
      lines: INVOICE_LINES,
      subtotal: INVOICE_SUBTOTAL,
      feeLines: INVOICE_FEE_LINES,
      total: INVOICE_TOTAL,
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
