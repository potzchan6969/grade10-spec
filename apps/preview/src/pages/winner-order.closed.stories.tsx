import { formatLocalDay } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  winnerOrderMeta,
  winnerOrderSettled,
} from "./winner-order.story-shared";
import { winnerOrderContactMail } from "./winner-order-contact-mail";
import { CANCELLED_AT_MS, type WinnerOrderPage } from "./winner-order-page";

const meta = {
  ...winnerOrderMeta(),
  title: "My Auctions/Winner Order/Closed",
  args: { status: "cancelled" },
  parameters: {
    ...winnerOrderMeta().parameters,
    docs: {
      description: {
        component:
          "Winner Order closed outcomes (Cancelled, Refunded). No progress stepper. Refunded keeps Invoice and Receipt; an inline alert below Order Total shows the refund amount. Dialog coverage lives under My Auctions / Winner Order / Refund Details.",
      },
    },
  },
} satisfies Meta<typeof WinnerOrderPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Operator cancelled an unpaid order - retained facts stay visible. */
export const Cancelled: Story = {
  name: "Cancelled",
  args: { status: "cancelled" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await winnerOrderSettled(canvasElement);
    expect(
      canvasElement.querySelector(
        '[data-slot="winner-order-page"][data-status="cancelled"]',
      ),
    ).not.toBeNull();
    expect(canvas.getByRole("complementary")).toBeVisible();
    expect(canvas.getByText("Order summary")).toBeVisible();
    expect(canvas.queryByText("Order Progress")).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("link", { name: "Invoice PDF" }),
    ).not.toBeInTheDocument();
    const lot = canvasElement.querySelector('[data-slot="winner-order-lot"]');
    expect(lot).not.toBeNull();
    expect(
      canvas.getByText("1999 Pokémon Base Set Charizard PSA 9"),
    ).toBeVisible();
    expect(canvasElement.textContent).toContain("12,800");
    const cancelledOn = formatLocalDay(CANCELLED_AT_MS, {
      locale: "en",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    const alert = canvas.getByText(`Cancelled on ${cancelledOn}`);
    expect(alert).toBeVisible();
    expect(lot?.compareDocumentPosition(alert)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(canvas.getByRole("button", { name: "Contact Us" })).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: /Pay/ }),
    ).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Contact Us" }));
    const dialog = await waitFor(() => {
      const found = within(canvasElement.ownerDocument.body).getByRole(
        "dialog",
        { name: "Email Grade10" },
      );
      expect(found).toBeVisible();
      return found;
    });
    const modal = within(dialog);
    expect(
      modal.getByText(
        "Auction lot 1999 Pokémon Base Set Charizard PSA 9: order cancelled",
      ),
    ).toBeVisible();
    const message = modal.getByLabelText("Message") as HTMLTextAreaElement;
    expect(message.value).toContain("Status: Cancelled");
    expect(message.value).not.toContain("Non-payment");

    const invoicedMail = winnerOrderContactMail({
      reason: "cancelled",
      lotTitle: "1999 Pokémon Base Set Charizard PSA 9",
      invoiceId: "IN-LK7P2Q01",
    });
    expect(invoicedMail.subject).toBe(
      "Auction lot 1999 Pokémon Base Set Charizard PSA 9: order cancelled",
    );
    expect(invoicedMail.body).toContain("Invoice: IN-LK7P2Q01");
    expect(invoicedMail.body).toContain("Status: Cancelled");
  },
};

/**
 * Paid invoice later refunded (order-status `paid` → `refunded`).
 * Not a non-payment outcome — fail-to-pay stays Pending Payment / Cancelled.
 */
export const Refunded: Story = {
  name: "Refunded",
  args: { status: "refunded" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await winnerOrderSettled(canvasElement);
    expect(
      canvasElement.querySelector(
        '[data-slot="winner-order-page"][data-status="refunded"]',
      ),
    ).not.toBeNull();
    expect(canvas.getByRole("complementary")).toBeVisible();
    expect(canvas.getByText("Refunded")).toBeVisible();
    expect(canvas.queryByText("Order Progress")).not.toBeInTheDocument();
    expect(canvas.getByRole("link", { name: "Invoice PDF" })).toBeVisible();
    expect(canvas.getByRole("link", { name: "Receipt PDF" })).toBeVisible();
    expect(canvas.getByText("Order Total")).toBeVisible();
    expect(canvas.getByText("HK$16,460.00")).toBeVisible();
    expect(canvas.getByText("Refund HK$16,460")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "View" }));
    const page = within(canvasElement.ownerDocument.body);
    const dialogElement = await waitFor(() => {
      const found = page.getByRole("dialog", { name: "Refund Details" });
      expect(found).toBeVisible();
      return found;
    });
    const dialog = within(dialogElement);
    expect(dialog.getByText("Not as described")).toBeVisible();
    expect(
      dialog.getByText(
        "Card condition did not match the listing photos. Full amount returned.",
      ),
    ).toBeVisible();
    expect(dialog.getByText("Transfer to")).toBeVisible();
    expect(dialog.getByLabelText("Visa")).toBeVisible();
    expect(dialog.getByText("···· 4242")).toBeVisible();
    expect(dialog.queryByText("Reference")).not.toBeInTheDocument();
    expect(
      canvas.queryByText("Order refunded. Payment on this order was returned."),
    ).not.toBeInTheDocument();
  },
};
