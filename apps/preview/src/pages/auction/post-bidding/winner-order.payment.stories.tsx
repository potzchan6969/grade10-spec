import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  winnerOrderContactSheet,
  winnerOrderMeta,
  winnerOrderSettled,
} from "./winner-order.story-shared";
import {
  BANK_TRANSFER_INVOICE_LINES,
  WINNER_ORDER_CONTENTS,
  WINNER_ORDER_HKD_HK_LOCAL_CONTENT,
  WINNER_ORDER_USD_BANK_TRANSFER_CONTENT,
} from "./winner-order-content";
import type { WinnerOrderPage } from "./winner-order-page";
import { PROOF_SUBMITTED_TOAST } from "./winner-order-proof-feedback";

const meta = {
  ...winnerOrderMeta(),
  title: "Auction/Post Bidding/Screens/Winner Order/Payment",
  args: { status: "pending_payment" },
  parameters: {
    ...winnerOrderMeta().parameters,
    docs: {
      description: {
        component:
          "Winner Order payment stages (Pending Payment → Payment Verifying / Partially Paid / Preparing Shipment). Dialog form coverage lives under View Bank Details, Submit Payment Proof and Email Grade10; these stories cover the page shell and CTA outcomes.",
      },
    },
  },
} satisfies Meta<typeof WinnerOrderPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const BANK_PENDING_CONTENT = {
  ...WINNER_ORDER_CONTENTS.pending_payment,
  body: "Your invoice is ready. Pay by bank transfer before the deadline.",
  setupPaymentMethod: "FPS",
  paymentRail: "fps",
  settlementCurrency: "HKD",
  primaryCta: "Submit Payment Proof",
  usdTotal: "US$16,340.00",
  convertedTotal: "HK$128,269.00",
  convertedFee: undefined,
  invoiceLines: BANK_TRANSFER_INVOICE_LINES,
} as const;

/** Invoice sent — pay by card within 7 days of send (not of lot close). */
export const PendingPayment: Story = {
  name: "Pending Payment",
  args: { status: "pending_payment" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await winnerOrderSettled(canvasElement);
    expect(
      canvasElement.querySelector(
        '[data-slot="winner-order-page"][data-status="pending_payment"]',
      ),
    ).not.toBeNull();
    expect(canvas.getByText("Order Progress")).toBeVisible();
    expect(canvas.getByText("Payment")).toBeVisible();
    expect(canvas.getByText("Shipping")).toBeVisible();
    expect(canvas.getByText("Completed")).toBeVisible();
    expect(canvas.getByText("18 Sep 2026")).toBeVisible();
    expect(canvas.getByText("19 Sep 2026")).toBeVisible();
    expect(canvas.getByText("Order summary")).toBeVisible();
    expect(canvas.getAllByText("Order Total")).toHaveLength(2);
    expect(canvas.getByText("US$16,340.00")).toBeVisible();
    expect(canvas.getByText("HK$128,269.00")).toBeVisible();
    expect(canvas.getByText("Shipping & Handling")).toBeVisible();
    expect(canvas.getByText("Insurance")).toBeVisible();
    expect(canvas.getByText("Tax")).toBeVisible();
    expect(canvas.getByText("US$320.00")).toBeVisible();
    expect(canvas.getAllByText("Payment Processing Fee")).toHaveLength(1);
    expect(canvas.getByText("HK$545.00")).toBeVisible();
    const sidebar = within(canvas.getByRole("complementary"));
    expect(
      sidebar.getByRole("button", { name: "Pay with Card" }),
    ).toBeVisible();
    expect(sidebar.getByText("Pay by 26 Sep 2026, 11:00 HKT")).toBeVisible();
    expect(canvas.getByText("Pay by 26 Sep 2026")).toBeVisible();
    expect(sidebar.getByText("Delivery address")).toBeVisible();
    expect(sidebar.getByText("Billing address")).toBeVisible();
    expect(sidebar.queryByText("Payment method")).not.toBeInTheDocument();
    const deliveryAddress = sidebar.getByText("Delivery address").parentElement;
    expect(deliveryAddress).toHaveTextContent(/Wan Chai/);
    expect(deliveryAddress).toHaveTextContent(/Alex Chan/);
    expect(deliveryAddress).toHaveTextContent(/\+852/);
    expect(
      canvas.queryByText(/Locked after invoice send/i),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByText(/Contact Grade10 to change/i),
    ).not.toBeInTheDocument();
    expect(sidebar.getByRole("link", { name: "Invoice PDF" })).toBeVisible();
    expect(
      sidebar.queryByRole("link", { name: "Receipt PDF" }),
    ).not.toBeInTheDocument();
    expect(sidebar.queryByRole("alert")).not.toBeInTheDocument();
  },
};

/** Bank transfer invoice — Pay + View Bank Details under it. */
export const PendingPaymentBankTransfer: Story = {
  name: "Pending Payment — Bank Transfer",
  args: {
    status: "pending_payment",
    content: BANK_PENDING_CONTENT,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await winnerOrderSettled(canvasElement);
    const sidebar = within(canvas.getByRole("complementary"));
    expect(
      sidebar.getByRole("button", { name: "Submit Payment Proof" }),
    ).toBeVisible();
    expect(
      sidebar.getByRole("button", { name: "View Bank Details" }),
    ).toBeVisible();
    expect(
      sidebar.queryByRole("button", { name: "Pay with Card" }),
    ).not.toBeInTheDocument();
    expect(sidebar.queryByText("Payment method")).not.toBeInTheDocument();
    expect(sidebar.getByText("Delivery address")).toBeVisible();
    expect(sidebar.getByText("Billing address")).toBeVisible();
    expect(sidebar.getByText("Payment Processing Fee")).toBeVisible();
    expect(sidebar.getByText("Free")).toBeVisible();
    expect(sidebar.getByText("Tax")).toBeVisible();
    expect(sidebar.getByText("US$320.00")).toBeVisible();
    expect(sidebar.getByText("US$16,340.00")).toBeVisible();
    expect(sidebar.getByText("HK$128,269.00")).toBeVisible();

    await userEvent.click(
      sidebar.getByRole("button", { name: "View Bank Details" }),
    );
    const dialog = await waitFor(() => {
      const found = page.getByRole("dialog", { name: "View Bank Details" });
      expect(found).toBeVisible();
      return within(found);
    });
    expect(dialog.getByText("HK$128,269.00")).toBeVisible();
    expect(dialog.queryByText("HK$16,340.00")).not.toBeInTheDocument();
  },
};

/** HKD invoice — the selected HK Local rail has its own bank details. */
export const PendingPaymentHkdHongKongBankTransfer: Story = {
  name: "Pending Payment - HKD HK Local - winner-order-SC-95",
  args: {
    status: "pending_payment",
    content: WINNER_ORDER_HKD_HK_LOCAL_CONTENT,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await winnerOrderSettled(canvasElement);
    const sidebar = within(canvas.getByRole("complementary"));
    expect(
      sidebar.getByRole("button", { name: "Submit Payment Proof" }),
    ).toBeVisible();
    expect(
      sidebar.getByRole("button", { name: "View Bank Details" }),
    ).toBeVisible();
    expect(
      sidebar.queryByRole("button", { name: "Pay with Card" }),
    ).not.toBeInTheDocument();
    expect(sidebar.getByText("US$16,340.00")).toBeVisible();
    expect(sidebar.getByText("HK$128,269.00")).toBeVisible();

    await userEvent.click(
      sidebar.getByRole("button", { name: "View Bank Details" }),
    );
    const dialog = await waitFor(() => {
      const found = page.getByRole("dialog", { name: "View Bank Details" });
      expect(found).toBeVisible();
      return within(found);
    });
    expect(dialog.getByText("Bank name")).toBeVisible();
    expect(dialog.getByText("Branch code")).toBeVisible();
    expect(dialog.getByText("HK$128,269.00")).toBeVisible();
    expect(dialog.queryByText("HK$16,340.00")).not.toBeInTheDocument();
    expect(dialog.queryByText("FPS ID")).not.toBeInTheDocument();
    expect(dialog.queryByText("SWIFT / BIC")).not.toBeInTheDocument();
    expect(dialog.queryByRole("tab")).not.toBeInTheDocument();
  },
};

/**
 * USD-settled invoice — bank transfer chosen; View Bank Details offers
 * International via SWIFT was selected.
 */
export const PendingPaymentUsdBankTransfer: Story = {
  name: "Pending Payment — USD Bank Transfer",
  args: {
    status: "pending_payment",
    content: WINNER_ORDER_USD_BANK_TRANSFER_CONTENT,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await winnerOrderSettled(canvasElement);
    const sidebar = within(canvas.getByRole("complementary"));
    expect(
      sidebar.getByRole("button", { name: "Submit Payment Proof" }),
    ).toBeVisible();
    expect(
      sidebar.getByRole("button", { name: "View Bank Details" }),
    ).toBeVisible();
    expect(
      sidebar.queryByRole("button", { name: "Pay with Card" }),
    ).not.toBeInTheDocument();
    expect(sidebar.getByText("US$16,340.00")).toBeVisible();

    await userEvent.click(
      sidebar.getByRole("button", { name: "View Bank Details" }),
    );
    const dialog = await waitFor(() => {
      const found = page.getByRole("dialog", { name: "View Bank Details" });
      expect(found).toBeVisible();
      return within(found);
    });
    expect(dialog.getByText("US$16,340.00")).toBeVisible();
    expect(dialog.queryByRole("tab")).not.toBeInTheDocument();
    expect(dialog.getByText("SWIFT / BIC")).toBeVisible();
    expect(dialog.queryByText("Branch code")).not.toBeInTheDocument();
    expect(dialog.queryByText("FPS ID")).not.toBeInTheDocument();
  },
};

/**
 * Submit Payment Proof → fill form → Payment Verifying + toast.
 * Dialog field coverage lives under the Submit Payment Proof folder.
 */
export const SubmitBankPaymentProof: Story = {
  name: "Submit Proof Flow - winner-order-SC-184",
  args: {
    status: "pending_payment",
    content: BANK_PENDING_CONTENT,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await winnerOrderSettled(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Submit Payment Proof" }),
    );
    const modal = await waitFor(() => {
      const found = page.getByRole("dialog", { name: "Submit Payment Proof" });
      expect(found).toBeVisible();
      return within(found);
    });

    // winner-order-SC-184: proof submission does not repeat invoice or rail details.
    expect(
      modal.queryByText(/Amount due|Order Total|Payment reference/i),
    ).not.toBeInTheDocument();
    expect(modal.queryByText(/US\$|HK\$/)).not.toBeInTheDocument();
    expect(
      modal.queryByText(/FPS|HK Local|SWIFT|bank/i),
    ).not.toBeInTheDocument();

    await userEvent.type(modal.getByLabelText("Sender Name"), "Alex Chan");
    const transferDate = modal.getByLabelText("Transfer Date");
    // Native date inputs need a value set — typing is unreliable in play.
    Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )?.set?.call(transferDate, "2026-09-20");
    transferDate.dispatchEvent(new Event("input", { bubbles: true }));
    transferDate.dispatchEvent(new Event("change", { bubbles: true }));
    await userEvent.type(
      modal.getByLabelText("Transaction Reference / ID"),
      "TXN-998877",
    );
    const file = new File(["preview-proof"], "transfer-receipt.pdf", {
      type: "application/pdf",
    });
    const fileInput = modal
      .getByRole("button", { name: "Choose Files" })
      .closest('[data-slot="file-dropzone"]')
      ?.querySelector('input[type="file"]');
    expect(fileInput).toBeTruthy();
    await userEvent.upload(fileInput as HTMLInputElement, file);

    await userEvent.click(
      modal.getByRole("button", { name: "Submit Payment Proof" }),
    );

    await waitFor(() => {
      expect(
        canvasElement.querySelector(
          '[data-slot="winner-order-page"][data-status="payment_verifying"]',
        ),
      ).not.toBeNull();
    });
    await waitFor(() => {
      expect(page.getByText(PROOF_SUBMITTED_TOAST.title)).toBeVisible();
      expect(page.getByText(PROOF_SUBMITTED_TOAST.description)).toBeVisible();
    });
    expect(
      canvas.queryByRole("button", { name: "Submit Payment Proof" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "View Bank Details" }),
    ).not.toBeInTheDocument();
    const verificationAlert = canvas.getByRole("alert");
    expect(verificationAlert).toBeVisible();
    expect(
      within(verificationAlert).getByText(/We’re verifying your transfer/),
    ).toBeVisible();
    expect(canvas.queryByText("Pay by 26 Sep 2026")).not.toBeInTheDocument();
    const sidebar = within(canvas.getByRole("complementary"));
    expect(sidebar.getByText("Payment method")).toBeVisible();
    expect(sidebar.getAllByText("FPS").length).toBeGreaterThan(0);
    expect(
      sidebar.queryByRole("link", { name: "Receipt PDF" }),
    ).not.toBeInTheDocument();
  },
};

/** Simulated card host return → Preparing Shipment + Payment received toast. */
export const PayWithCardCheckout: Story = {
  name: "Pay with Card",
  args: { status: "pending_payment" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await winnerOrderSettled(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Pay with Card" }),
    );

    await waitFor(
      () => {
        expect(
          canvasElement.querySelector(
            '[data-slot="winner-order-page"][data-status="processing"]',
          ),
        ).not.toBeNull();
      },
      { timeout: 3000 },
    );
    await waitFor(() => {
      expect(page.getByText("Payment received")).toBeVisible();
      expect(page.getByText("We’re preparing this lot to ship.")).toBeVisible();
    });
    expect(
      canvas.queryByRole("button", { name: "Pay with Card" }),
    ).not.toBeInTheDocument();
    expect(canvas.getByText(/preparing this lot to ship/i)).toBeVisible();
    const sidebar = within(canvas.getByRole("complementary"));
    expect(sidebar.getByRole("link", { name: "Receipt PDF" })).toBeVisible();
  },
};

/** Proof under check — Payment step current with no pay-by date. */
export const PaymentVerifying: Story = {
  name: "Payment Verifying",
  args: { status: "payment_verifying" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await winnerOrderSettled(canvasElement);
    expect(
      canvasElement.querySelector(
        '[data-slot="winner-order-page"][data-status="payment_verifying"]',
      ),
    ).not.toBeNull();
    expect(canvas.getByText("Order Progress")).toBeVisible();
    expect(canvas.getByText("Payment")).toBeVisible();
    expect(canvas.queryByText("Pay by 26 Sep 2026")).not.toBeInTheDocument();
    const sidebar = within(canvas.getByRole("complementary"));
    expect(
      sidebar.queryByRole("button", { name: "Submit Payment Proof" }),
    ).not.toBeInTheDocument();
    expect(
      sidebar.queryByRole("button", { name: "Pay with Card" }),
    ).not.toBeInTheDocument();
    expect(sidebar.getByText("Delivery address")).toBeVisible();
    expect(sidebar.getByText("Billing address")).toBeVisible();
    expect(sidebar.getByText("Payment method")).toBeVisible();
    expect(sidebar.getAllByText("FPS").length).toBeGreaterThan(0);
    expect(sidebar.getByText("Payment Processing Fee")).toBeVisible();
    expect(sidebar.getByText("Free")).toBeVisible();
    const infoAlert = canvas.getByRole("alert");
    expect(infoAlert).toBeVisible();
    expect(
      within(infoAlert).getByText(/We’re verifying your transfer/),
    ).toBeVisible();
    expect(
      within(infoAlert).getByText(/We’ll email you when payment is confirmed/),
    ).toBeVisible();
    expect(sidebar.getByRole("link", { name: "Invoice PDF" })).toBeVisible();
    expect(
      sidebar.queryByRole("link", { name: "Receipt PDF" }),
    ).not.toBeInTheDocument();
  },
};

/**
 * Operator recorded one or more underpayments — locked page, Contact Us, no
 * running balance, Receipt PDF row lists every payment (P1, P2, …).
 */
export const PartiallyPaid: Story = {
  name: "Partially Paid",
  args: { status: "partially_paid" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await winnerOrderSettled(canvasElement);
    expect(
      canvasElement.querySelector(
        '[data-slot="winner-order-page"][data-status="partially_paid"]',
      ),
    ).not.toBeNull();
    expect(canvas.getByText("Order Progress")).toBeVisible();
    expect(canvas.getByText("Payment")).toBeVisible();
    expect(canvas.queryByText("Pay by 26 Sep 2026")).not.toBeInTheDocument();
    expect(
      canvas.getAllByText(/Only part of this invoice is settled/i).length,
    ).toBeGreaterThanOrEqual(1);
    const sidebar = within(canvas.getByRole("complementary"));
    const alert = sidebar.getByRole("alert");
    expect(alert).toBeVisible();
    expect(alert).toHaveAttribute("data-status", "warning");
    expect(
      within(alert).getByText(/Only part of this invoice is settled/i),
    ).toBeVisible();
    expect(within(alert).getByText(/about what remains/i)).toBeVisible();
    expect(
      within(alert).queryByText(/HK\$|balance|owed|remaining/i),
    ).not.toBeInTheDocument();
    expect(
      within(alert).getByRole("button", { name: "Contact Us" }),
    ).toBeVisible();
    expect(
      sidebar.queryByRole("button", { name: "Pay with Card" }),
    ).not.toBeInTheDocument();
    expect(
      sidebar.queryByRole("button", { name: "Submit Payment Proof" }),
    ).not.toBeInTheDocument();
    expect(sidebar.getByText("Payment method")).toBeVisible();
    expect(sidebar.getAllByText("FPS").length).toBeGreaterThan(0);
    expect(sidebar.getByRole("link", { name: "Invoice PDF" })).toBeVisible();
    expect(
      sidebar.getByRole("link", { name: "Receipt · P1 PDF" }),
    ).toBeVisible();
    expect(
      sidebar.getByRole("link", { name: "Receipt · P2 PDF" }),
    ).toBeVisible();
    expect(sidebar.getByText("Delivery address")).toBeVisible();
    expect(sidebar.getByText("Billing address")).toBeVisible();
    await winnerOrderContactSheet(
      canvasElement,
      "Auction order IN-LK7P2Q01: partial payment",
    );
  },
};

/** Payment deadline passed — no Pay CTA; contact from the overdue alert. */
export const ExpiredInvoice: Story = {
  name: "Expired Invoice",
  args: { status: "pending_payment_expired" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await winnerOrderSettled(canvasElement);
    expect(
      canvasElement.querySelector(
        '[data-slot="winner-order-page"][data-status="pending_payment_expired"]',
      ),
    ).not.toBeNull();
    expect(canvas.getByText("Order Progress")).toBeVisible();
    expect(canvas.getByText("Payment")).toBeVisible();
    const sidebar = within(canvas.getByRole("complementary"));
    const alert = sidebar.getByRole("alert");
    expect(alert).toBeVisible();
    expect(
      within(alert).getByText("Payment deadline passed 26 Sep 2026, 11:00 HKT"),
    ).toBeVisible();
    expect(within(alert).getByText(/payment deadline/i)).toBeVisible();
    expect(
      within(alert).getByRole("button", { name: "Contact Us" }),
    ).toBeVisible();
    expect(
      sidebar.queryByRole("button", { name: "Pay with Card" }),
    ).not.toBeInTheDocument();
    expect(
      sidebar.queryByRole("button", { name: "Submit Payment Proof" }),
    ).not.toBeInTheDocument();
    expect(sidebar.getByText("Delivery address")).toBeVisible();
    expect(sidebar.getByText("Billing address")).toBeVisible();
    expect(canvas.queryByText(/how to reach Grade10/i)).not.toBeInTheDocument();
    expect(sidebar.getByRole("link", { name: "Invoice PDF" })).toBeVisible();
    expect(canvas.getByText("Pending Payment (expired invoice)")).toBeVisible();
    await winnerOrderContactSheet(
      canvasElement,
      "Auction order IN-LK7P2Q01: payment overdue",
    );
  },
};
