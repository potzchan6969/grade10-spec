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
} from "./winner-order-content";
import type { WinnerOrderPage } from "./winner-order-page";

const meta = {
  ...winnerOrderMeta(),
  title: "My Auctions/Winner Order/Payment",
  args: { status: "pending_payment" },
  parameters: {
    ...winnerOrderMeta().parameters,
    docs: {
      description: {
        component:
          "Winner Order payment stages (Pending Payment → Payment Verifying / Partially Paid / Processing). Dialog form coverage lives under My Auctions / Winner Order / Payment / Submit Payment Proof; these stories cover the page shell and CTA outcomes.",
      },
    },
  },
} satisfies Meta<typeof WinnerOrderPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const BANK_PENDING_CONTENT = {
  ...WINNER_ORDER_CONTENTS.pending_payment,
  body: "Your invoice is ready. Pay by bank transfer before the deadline.",
  setupPaymentMethod: "Bank transfer",
  primaryCta: "Pay by Bank Transfer",
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
    expect(canvas.getByText("Order progress")).toBeVisible();
    expect(canvas.getByText("Payment")).toBeVisible();
    expect(canvas.getByText("Shipped")).toBeVisible();
    expect(canvas.getByText("Completed")).toBeVisible();
    expect(canvas.getByText("18 Sep 2026")).toBeVisible();
    expect(canvas.getByText("19 Sep 2026")).toBeVisible();
    expect(canvas.getByText("Order summary")).toBeVisible();
    expect(canvas.getByText("Order Total")).toBeVisible();
    expect(canvas.getByText("HK$16,140")).toBeVisible();
    expect(canvas.getByText("Shipping & Handling")).toBeVisible();
    expect(canvas.getByText("Insurance")).toBeVisible();
    expect(canvas.getByText("Payment Processing Fee")).toBeVisible();
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

/** Bank transfer invoice — CTA is Pay by Bank Transfer, not card pay. */
export const PendingPaymentBankTransfer: Story = {
  name: "Pending Payment Bank Transfer",
  args: {
    status: "pending_payment",
    content: BANK_PENDING_CONTENT,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await winnerOrderSettled(canvasElement);
    const sidebar = within(canvas.getByRole("complementary"));
    expect(
      sidebar.getByRole("button", { name: "Pay by Bank Transfer" }),
    ).toBeVisible();
    expect(
      sidebar.queryByRole("button", { name: "Pay with Card" }),
    ).not.toBeInTheDocument();
    expect(sidebar.queryByText("Payment method")).not.toBeInTheDocument();
    expect(sidebar.getByText("Delivery address")).toBeVisible();
    expect(sidebar.getByText("Billing address")).toBeVisible();
    expect(sidebar.getByText("Payment Processing Fee")).toBeVisible();
    expect(sidebar.getByText("Free")).toBeVisible();
    expect(sidebar.getByText("HK$16,020")).toBeVisible();
  },
};

/**
 * Opens Pay by Bank Transfer, fills required fields, submits → Payment
 * Verifying + toast.
 */
export const SubmitBankPaymentProof: Story = {
  name: "Submit Bank Payment Proof",
  args: {
    status: "pending_payment",
    content: BANK_PENDING_CONTENT,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await winnerOrderSettled(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Pay by Bank Transfer" }),
    );
    const modal = await waitFor(() => {
      const found = page.getByRole("dialog", { name: "Pay by Bank Transfer" });
      expect(found).toBeVisible();
      return within(found);
    });

    expect(modal.getByText("Bank Details")).toBeVisible();
    expect(modal.getByText("Required Transfer Reference")).toBeVisible();
    expect(
      modal.getByRole("button", { name: "Copy transfer reference" }),
    ).toBeVisible();
    expect(
      modal.getByText(
        "Copy the bank details, pay the amount due, then upload your receipt.",
      ),
    ).toBeVisible();

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
    expect(modal.getByText("transfer-receipt.pdf")).toBeVisible();
    expect(
      modal.getByText("You can’t add or change files after you submit."),
    ).toBeVisible();

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
      expect(page.getByText("Proof submitted")).toBeVisible();
      expect(
        page.getByText("We’ll verify your payment shortly."),
      ).toBeVisible();
    });
    expect(
      canvas.queryByRole("button", { name: "Pay by Bank Transfer" }),
    ).not.toBeInTheDocument();
    const verificationAlert = canvas.getByRole("alert");
    expect(verificationAlert).toBeVisible();
    expect(
      within(verificationAlert).getByText(/We’re verifying your transfer/),
    ).toBeVisible();
    expect(canvas.queryByText("Pay by 26 Sep 2026")).not.toBeInTheDocument();
    const sidebar = within(canvas.getByRole("complementary"));
    expect(sidebar.getByText("Payment method")).toBeVisible();
    expect(sidebar.getByText("Bank transfer")).toBeVisible();
    expect(
      sidebar.queryByRole("link", { name: "Receipt PDF" }),
    ).not.toBeInTheDocument();
  },
};

/** Simulated card host return → Processing + Payment received toast. */
export const PayWithCardCheckout: Story = {
  name: "Pay with Card Checkout",
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
    expect(canvas.getByText("Order progress")).toBeVisible();
    expect(canvas.getByText("Payment")).toBeVisible();
    expect(canvas.queryByText("Pay by 26 Sep 2026")).not.toBeInTheDocument();
    const sidebar = within(canvas.getByRole("complementary"));
    expect(
      sidebar.queryByRole("button", { name: "Pay by Bank Transfer" }),
    ).not.toBeInTheDocument();
    expect(
      sidebar.queryByRole("button", { name: "Pay with Card" }),
    ).not.toBeInTheDocument();
    expect(sidebar.getByText("Delivery address")).toBeVisible();
    expect(sidebar.getByText("Billing address")).toBeVisible();
    expect(sidebar.getByText("Payment method")).toBeVisible();
    expect(sidebar.getByText("Bank transfer")).toBeVisible();
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
    expect(canvas.getByText("Order progress")).toBeVisible();
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
      sidebar.queryByRole("button", { name: "Pay by Bank Transfer" }),
    ).not.toBeInTheDocument();
    expect(sidebar.getByText("Payment method")).toBeVisible();
    expect(sidebar.getByText("Bank transfer")).toBeVisible();
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
      "Auction order INV-202609-LK7P2Q-01: partial payment",
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
    expect(canvas.getByText("Order progress")).toBeVisible();
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
      sidebar.queryByRole("button", { name: "Pay by Bank Transfer" }),
    ).not.toBeInTheDocument();
    expect(sidebar.getByText("Delivery address")).toBeVisible();
    expect(sidebar.getByText("Billing address")).toBeVisible();
    expect(canvas.queryByText(/how to reach Grade10/i)).not.toBeInTheDocument();
    expect(sidebar.getByRole("link", { name: "Invoice PDF" })).toBeVisible();
    expect(canvas.getByText("Pending Payment (expired invoice)")).toBeVisible();
    await winnerOrderContactSheet(
      canvasElement,
      "Auction order INV-202609-LK7P2Q-01: payment overdue",
    );
  },
};
