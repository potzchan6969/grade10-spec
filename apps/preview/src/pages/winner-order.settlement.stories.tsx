import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { winnerOrderMeta } from "./winner-order.story-shared";
import type { WinnerOrderPage } from "./winner-order-page";

const meta = {
  ...winnerOrderMeta(),
  title: "My Auctions/Winner Order/Settlement",
  args: { status: "awaiting_address" },
} satisfies Meta<typeof WinnerOrderPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pre-invoice — confirm delivery address before quote. */
export const AwaitingAddress: Story = {
  name: "Awaiting Address",
  args: { status: "awaiting_address" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Winner Order" }),
    ).toBeVisible();
    expect(
      canvasElement.querySelector(
        '[data-slot="winner-order-page"][data-status="awaiting_address"]',
      ),
    ).not.toBeNull();
    expect(canvas.getByText("Order progress")).toBeVisible();
    expect(canvas.getByText("Address")).toBeVisible();
    expect(canvas.getByText("Invoice")).toBeVisible();
    expect(canvas.getByText("Payment")).toBeVisible();
    expect(canvas.getByText("Shipped")).toBeVisible();
    expect(canvas.getByText("Completed")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Confirm delivery address" }),
    ).toBeVisible();
    expect(canvas.getByText("Delivery address")).toBeVisible();
    expect(canvas.queryByText(/No address confirmed/i)).not.toBeInTheDocument();
    expect(
      canvas.queryByText(/choose a saved address/i),
    ).not.toBeInTheDocument();
    expect(canvas.getByText("Order summary")).toBeVisible();
    expect(canvas.getByText("Winning Bid")).toBeVisible();
    expect(canvas.getByText(/^Winning bid:/)).toBeVisible();
    expect(
      canvas.getByRole("link", {
        name: /open lot details/i,
      }),
    ).toBeVisible();
    expect(canvas.getAllByText("TBD").length).toBeGreaterThan(0);
    expect(canvas.getByRole("complementary")).toBeVisible();
    expect(
      within(canvas.getByRole("complementary")).getByRole("button", {
        name: "Confirm delivery address",
      }),
    ).toBeVisible();
    expect(canvas.queryByText(/pay with card/i)).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("link", { name: "View invoice PDF" }),
    ).not.toBeInTheDocument();
  },
};

/** Address confirmed — invoice from this destination, email when ready. */
export const PreparingInvoice: Story = {
  name: "Preparing Invoice",
  args: { status: "preparing_invoice" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvasElement.querySelector(
        '[data-slot="winner-order-page"][data-status="preparing_invoice"]',
      ),
    ).not.toBeNull();
    expect(canvas.getByText("Order progress")).toBeVisible();
    expect(canvas.getByText("Invoice")).toBeVisible();
    expect(canvas.getByText(/Wan Chai/)).toBeVisible();
    expect(canvas.getByText("Order summary")).toBeVisible();
    expect(canvas.getAllByText("TBD").length).toBeGreaterThan(0);
    expect(canvas.getByRole("complementary")).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: /confirm|pay/i }),
    ).not.toBeInTheDocument();
    const infoAlert = canvas.getByRole("alert");
    expect(infoAlert).toBeVisible();
    expect(
      within(infoAlert).getByText(
        /We generate your invoice from this shipping address/,
      ),
    ).toBeVisible();
    expect(
      within(infoAlert).getByText(/We email you when it is ready/),
    ).toBeVisible();
    expect(canvas.queryByText(/No payment yet/i)).not.toBeInTheDocument();
    expect(canvas.queryByText(/operator quote/i)).not.toBeInTheDocument();
    expect(
      canvas.queryByText(/You can change this until the invoice is sent/i),
    ).not.toBeInTheDocument();
    expect(canvas.queryByText(/Address confirmed/i)).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("link", { name: "View invoice PDF" }),
    ).not.toBeInTheDocument();
  },
};

/** Opens the address dialog, confirms a saved address, lands on Preparing Invoice. */
export const ConfirmAddressFlow: Story = {
  name: "Confirm Address Flow",
  args: { status: "awaiting_address" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);

    await userEvent.click(
      canvas.getByRole("button", { name: "Confirm delivery address" }),
    );

    const dialog = await waitFor(() => {
      const found = page.getByRole("dialog", {
        name: "Confirm Delivery Address",
      });
      expect(found).toBeVisible();
      return found;
    });
    const modal = within(dialog);
    await waitFor(() => {
      expect(
        modal.getByRole("heading", { name: "Confirm Delivery Address" }),
      ).toBeVisible();
    });
    expect(
      modal.getByText(/ship this lot here and use the address to calculate/i),
    ).toBeVisible();
    expect(modal.getAllByText("Alex Chan").length).toBeGreaterThan(0);
    expect(
      modal.getAllByRole("button", { name: "Remove Alex Chan" }).length,
    ).toBeGreaterThan(0);
    expect(
      modal.getByRole("button", { name: "Add new address" }),
    ).toBeVisible();

    await userEvent.click(
      modal.getByRole("button", { name: "Confirm address" }),
    );

    await waitFor(() => {
      expect(page.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(
      canvasElement.querySelector(
        '[data-slot="winner-order-page"][data-status="preparing_invoice"]',
      ),
    ).not.toBeNull();
    expect(canvas.getByText(/Harbour Road/)).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: "Confirm delivery address" }),
    ).not.toBeInTheDocument();

    await waitFor(
      () => {
        expect(page.getByText("Address confirmed")).toBeVisible();
      },
      { timeout: 3000 },
    );
    expect(page.getByText(/preparing your invoice/i)).toBeVisible();
  },
};

/** Nested add-address form → Use this address → confirm → Preparing Invoice. */
export const AddNewAddressFlow: Story = {
  name: "Add New Address Flow",
  args: { status: "awaiting_address" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);

    await userEvent.click(
      canvas.getByRole("button", { name: "Confirm delivery address" }),
    );

    const outerDialog = await waitFor(() => {
      const found = page.getByRole("dialog", {
        name: "Confirm Delivery Address",
      });
      expect(found).toBeVisible();
      return found;
    });
    await userEvent.click(
      within(outerDialog).getByRole("button", { name: "Add new address" }),
    );

    const nestedDialog = await waitFor(() => {
      const found = page.getByRole("dialog", { name: "Add Delivery Address" });
      expect(found).toBeVisible();
      return found;
    });
    const nested = within(nestedDialog);

    await userEvent.type(nested.getByLabelText("First name"), "Jordan");
    await userEvent.type(nested.getByLabelText("Last name"), "Lee");
    await userEvent.type(
      nested.getByLabelText("Street address"),
      "88 Queen's Road Central",
    );
    await userEvent.type(nested.getByLabelText("City"), "Central");
    await userEvent.type(nested.getByLabelText("Postal code"), "000000");

    await userEvent.click(
      nested.getByRole("button", { name: "Use this address" }),
    );

    await waitFor(() => {
      expect(
        page.queryByRole("dialog", { name: "Add Delivery Address" }),
      ).not.toBeInTheDocument();
    });

    const picker = within(
      await waitFor(() => {
        const found = page.getByRole("dialog", {
          name: "Confirm Delivery Address",
        });
        expect(found).toBeVisible();
        return found;
      }),
    );
    expect(picker.getByText("Jordan Lee")).toBeVisible();
    expect(picker.getByText(/Queen's Road Central/)).toBeVisible();

    await userEvent.click(
      picker.getByRole("button", { name: "Confirm address" }),
    );

    await waitFor(() => {
      expect(page.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(
      canvasElement.querySelector(
        '[data-slot="winner-order-page"][data-status="preparing_invoice"]',
      ),
    ).not.toBeNull();
    expect(canvas.getByText(/Queen's Road Central/)).toBeVisible();

    await waitFor(
      () => {
        expect(page.getByText("Address confirmed")).toBeVisible();
      },
      { timeout: 3000 },
    );
  },
};
