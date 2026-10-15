import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { AuctionWinnerOrder } from "./auction-winner-order";
import {
  BASE_ARGS,
  CONTROLLED_BANK_DETAILS,
  CONTROLLED_PAYMENT_CHOICES,
  INVOICE_LINES,
  NON_ENGLISH_COPY,
  settled,
  traditionalChineseAuctionOrders,
} from "./auction-winner-order.story-fixtures";
import type {
  AuctionSettlementCurrency,
  AuctionWinnerOrderPaymentChoice,
  AuctionWinnerOrderProps,
} from "./types";

const meta = {
  title: "Auction/Post Bidding/Blocks/AuctionWinnerOrder/Payment",
  component: AuctionWinnerOrder,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: BASE_ARGS,
} satisfies Meta<typeof AuctionWinnerOrder>;

export default meta;
type Story = StoryObj<typeof meta>;

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
    const currencyList = canvas.getByRole("radiogroup", {
      name: "Settlement currency",
    });
    expect(currencyList).toHaveAccessibleName("Settlement currency");
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
    const paymentList = canvas.getByRole("radiogroup", {
      name: "Payment method",
    });
    expect(paymentList).toHaveAccessibleName("Payment method");
    const card = within(paymentList).getByRole("radio", { name: /^Card/ });
    expect(card).toHaveAttribute("aria-disabled", "true");
    expect(card).toHaveAccessibleName(/Card is not yet available in USD/);
    await userEvent.click(card);
    expect(card).not.toBeChecked();

    hkd.focus();
    await userEvent.keyboard(" ");
    const paymentListAfterCurrencyChange = await waitFor(() =>
      canvas.getByRole("radiogroup", { name: "Payment method" }),
    );
    expect(paymentListAfterCurrencyChange).toHaveAccessibleName(
      "Payment method",
    );
    const fps = await waitFor(() =>
      within(paymentListAfterCurrencyChange).getByRole("radio", {
        name: /^FPS/,
      }),
    );
    fps.focus();
    await userEvent.keyboard(" ");
    await waitFor(() => expect(fps).toBeChecked());

    const trigger = canvas.getByRole("button", { name: "View Bank Details" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    const dialog = await waitFor(() => {
      const opened = body.getByRole("dialog", {
        name: "View Bank Details",
      });
      expect(opened).toBeVisible();
      return opened;
    });
    const closeButton = body.getByRole("button", {
      name: traditionalChineseAuctionOrders.bankDetails.close,
    });
    expect(
      body.getByRole("img", {
        name: traditionalChineseAuctionOrders.bankDetails.qrAlt,
      }),
    ).toBeVisible();
    expect(closeButton).toBeVisible();
    await waitFor(() => expect(closeButton).toHaveFocus());
    for (let index = 0; index < 4; index += 1) {
      await userEvent.tab();
      await waitFor(() =>
        expect(dialog.contains(canvasElement.ownerDocument.activeElement)).toBe(
          true,
        ),
      );
    }

    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(body.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());

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
    await waitFor(() => expect(trigger).toHaveFocus());
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
