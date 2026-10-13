import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  fillWinnerOrderAddAddress,
  winnerOrderContactSheet,
  winnerOrderMeta,
  winnerOrderSettled,
} from "./winner-order.story-shared";
import { WINNER_ORDER_CONTENTS } from "./winner-order-content";
import type { WinnerOrderPage } from "./winner-order-page";

const meta = {
  ...winnerOrderMeta(),
  title: "Auction/Post Bidding/Screens/Winner Order/Setup",
  args: { status: "awaiting_address" },
  parameters: {
    ...winnerOrderMeta().parameters,
    docs: {
      description: {
        component:
          "Winner Order setup stages (Awaiting Setup → Preparing Invoice). Dialog form coverage lives under Complete Order Setup and Email Grade10; these stories cover the page shell and end-to-end setup flows.",
      },
    },
  },
} satisfies Meta<typeof WinnerOrderPage>;

export default meta;
type Story = StoryObj<typeof meta>;

function deliveryAddressBlock(canvasElement: HTMLElement) {
  const sidebar = within(canvasElement).getByRole("complementary");
  const heading = within(sidebar).getByRole("heading", {
    name: "Delivery address",
  });
  const block = heading.parentElement;
  if (!block) {
    throw new Error("Delivery address heading has no containing block");
  }
  return within(block);
}

/**
 * Pre-invoice — complete order setup within 48 hours of lot close
 * (winner-order-SC-171).
 */
export const AwaitingSetup: Story = {
  name: "Awaiting Setup",
  args: { status: "awaiting_address" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await winnerOrderSettled(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Winner Order" }),
    ).toBeVisible();
    expect(
      canvasElement.querySelector(
        '[data-slot="winner-order-page"][data-status="awaiting_address"]',
      ),
    ).not.toBeNull();
    expect(canvas.getByText("Order Progress")).toBeVisible();
    expect(canvas.getByText("Address")).toBeVisible();
    expect(canvas.getByText("Invoice")).toBeVisible();
    expect(canvas.getByText("Payment")).toBeVisible();
    expect(canvas.getByText("Shipping")).toBeVisible();
    expect(canvas.getByText("Completed")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Complete Order Setup" }),
    ).toBeVisible();
    expect(canvas.getByText("Order summary")).toBeVisible();
    expect(canvas.getByText("Winning Bid")).toBeVisible();
    expect(canvas.getByText("Payment Processing Fee")).toBeVisible();
    expect(canvas.getByText("Insurance")).toBeVisible();
    expect(canvas.getByText("Tax")).toBeVisible();
    expect(canvas.getByText(/^Winning bid:/)).toBeVisible();
    expect(
      canvas.getByRole("link", {
        name: /open lot details/i,
      }),
    ).toBeVisible();
    expect(canvas.getAllByText("TBD").length).toBeGreaterThan(0);
    expect(canvas.getByRole("complementary")).toBeVisible();
    const sidebar = within(canvas.getByRole("complementary"));
    expect(
      sidebar.getByRole("button", {
        name: "Complete Order Setup",
      }),
    ).toBeVisible();
    expect(
      sidebar.getByText("Confirm by 19 Sep 2026, 21:30 HKT"),
    ).toBeVisible();
    expect(canvas.queryByText(/pay with card/i)).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("link", { name: "Invoice PDF" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("link", { name: "Receipt PDF" }),
    ).not.toBeInTheDocument();
  },
};

/** HKD selected before invoice send: the lot stays in USD until invoice creation. */
export const AwaitingSetupHkdBeforeInvoice: Story = {
  name: "Awaiting Setup - HKD before invoice - winner-order-SC-292",
  args: {
    status: "awaiting_address",
    content: {
      ...WINNER_ORDER_CONTENTS.awaiting_address,
      settlementCurrency: "HKD",
      setupPaymentMethod: null,
      paymentRail: undefined,
      convertedTotal: undefined,
      convertedFee: undefined,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await winnerOrderSettled(canvasElement);
    const sidebar = within(canvas.getByRole("complementary"));

    // winner-order-SC-292: before invoice send, HKD has no payable total or fee.
    expect(canvas.getByText(/^Winning bid: US\$12,800$/)).toBeVisible();
    expect(sidebar.getByText("US$12,800.00")).toBeVisible();
    const summaryRows = [
      ...canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="winner-order-summary-line"]',
      ),
    ];
    expect(summaryRows.some((row) => row.textContent?.includes("HK$"))).toBe(
      false,
    );
    expect(canvas.getByRole("radio", { name: "HKD" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  },
};

/**
 * Setup deadline passed (48 hours after lot close) — no Complete CTA;
 * contact from the overdue alert.
 */
export const ExpiredSetup: Story = {
  name: "Expired Setup",
  args: { status: "awaiting_address_expired" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await winnerOrderSettled(canvasElement);
    expect(
      canvasElement.querySelector(
        '[data-slot="winner-order-page"][data-status="awaiting_address_expired"]',
      ),
    ).not.toBeNull();
    expect(canvas.getByText("Order Progress")).toBeVisible();
    expect(canvas.getByText("Address")).toBeVisible();
    const sidebar = within(canvas.getByRole("complementary"));
    const alert = sidebar.getByRole("alert");
    expect(alert).toBeVisible();
    expect(
      within(alert).getByText("Missed setup deadline: 19 Sep 2026"),
    ).toBeVisible();
    expect(
      within(alert).getByRole("button", { name: "Contact Us" }),
    ).toBeVisible();
    expect(
      sidebar.queryByRole("button", { name: "Complete Order Setup" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("link", { name: "Invoice PDF" }),
    ).not.toBeInTheDocument();
    await winnerOrderContactSheet(
      canvasElement,
      "Auction lot 1999 Pokémon Base Set Charizard PSA 9: setup overdue",
    );
  },
};

/**
 * Setup complete — invoice from this destination, email when ready
 * (winner-order-SC-171).
 */
export const PreparingInvoice: Story = {
  name: "Preparing Invoice",
  args: { status: "preparing_invoice" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await winnerOrderSettled(canvasElement);
    expect(
      canvasElement.querySelector(
        '[data-slot="winner-order-page"][data-status="preparing_invoice"]',
      ),
    ).not.toBeNull();
    expect(canvas.getByText("Order Progress")).toBeVisible();
    expect(canvas.getByText("Invoice")).toBeVisible();
    expect(canvas.getByText("18 Sep 2026")).toBeVisible();
    expect(
      deliveryAddressBlock(canvasElement).getByText(/Wan Chai/),
    ).toBeVisible();
    expect(canvas.getByText("Order summary")).toBeVisible();
    expect(canvas.getByText("Insurance")).toBeVisible();
    expect(canvas.getByText("Tax")).toBeVisible();
    expect(canvas.getAllByText("TBD").length).toBeGreaterThan(0);
    expect(canvas.getByRole("complementary")).toBeVisible();
    expect(canvas.getByText("Card (HKD)")).toBeVisible();
    expect(canvas.getByText("Billing address")).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: /complete|pay/i }),
    ).not.toBeInTheDocument();
    const infoAlert = canvas.getByRole("alert");
    expect(infoAlert).toBeVisible();
    expect(
      within(infoAlert).getByText(/We generate your invoice from this setup/),
    ).toBeVisible();
    expect(
      within(infoAlert).getByText(/We email you when it is ready/),
    ).toBeVisible();
    expect(
      canvas.queryByRole("link", { name: "Invoice PDF" }),
    ).not.toBeInTheDocument();
  },
};

/** Stepped setup: delivery → payment → billing (same as delivery) → Preparing Invoice. */
export const CompleteSetupFlow: Story = {
  name: "Complete Setup Flow",
  args: { status: "awaiting_address" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await winnerOrderSettled(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Complete Order Setup" }),
    );

    const dialog = await waitFor(() => {
      const found = page.getByRole("dialog", {
        name: "Delivery Address",
      });
      expect(found).toBeVisible();
      return found;
    });
    const modal = within(dialog);
    expect(modal.getByText("Step 1 of 3")).toBeVisible();
    expect(modal.getAllByText("Alex Chan").length).toBeGreaterThan(0);

    await userEvent.click(modal.getByRole("button", { name: "Continue" }));

    await waitFor(() => {
      expect(modal.getByText("Step 2 of 3")).toBeVisible();
    });
    // The winner chooses the settlement currency and payment method.
    const hkd = modal.getByRole("button", { name: "HKD" });
    const usd = modal.getByRole("button", { name: "USD" });
    expect(usd).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(hkd).toHaveAttribute("aria-pressed", "false");
    expect(modal.queryByRole("radio")).not.toBeInTheDocument();
    // winner-order-SC-279 shared UI scope: no choice keeps setup blocked.
    expect(modal.getByRole("button", { name: "Continue" })).toBeDisabled();

    // winner-order-SC-303: the card fee follows the selected settlement currency.
    await userEvent.click(usd);
    await waitFor(() => {
      expect(
        modal.getByText("Card fee about 4.4% + a fixed amount"),
      ).toBeVisible();
    });
    const hkLocal = await waitFor(() => {
      const found = modal.getByRole("radio", { name: /^HK Local\b/i });
      expect(found).toBeVisible();
      return found;
    });
    await userEvent.click(hkLocal);
    await waitFor(() => {
      expect(
        modal.getByRole("radio", { name: /^HK Local\b/i }),
      ).toBeChecked();
    });

    // winner-order-SC-296: a rail offered by both currencies stays selected.
    await userEvent.click(hkd);
    await waitFor(() => {
      expect(
        modal.getByRole("radio", { name: /^HK Local\b/i }),
      ).toBeChecked();
      expect(
        modal.getByText("Card fee about 3.4% + a fixed amount"),
      ).toBeVisible();
      expect(modal.getByRole("button", { name: "Continue" })).toBeEnabled();
    });
    // winner-order-SC-280 shared UI scope: the chosen HKD rail is callback-controlled;
    // persisted confirmation remains an application-layer requirement.

    const card = await waitFor(() => {
      const found = modal.getByRole("radio", { name: /^Card\b/i });
      expect(found).toBeVisible();
      return found;
    });
    expect(card).not.toBeChecked();
    expect(modal.getByRole("button", { name: "Continue" })).toBeEnabled();
    await userEvent.click(card);
    await waitFor(() => {
      expect(card).toBeChecked();
      expect(modal.getByRole("button", { name: "Continue" })).toBeEnabled();
    });
    await userEvent.click(modal.getByRole("button", { name: "Continue" }));

    await waitFor(() => {
      expect(modal.getByText("Step 3 of 3")).toBeVisible();
    });
    expect(modal.getByText("Same as delivery address")).toBeVisible();
    await userEvent.click(
      modal.getByRole("button", { name: "Complete Order Setup" }),
    );

    await waitFor(() => {
      expect(page.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(
      canvasElement.querySelector(
        '[data-slot="winner-order-page"][data-status="preparing_invoice"]',
      ),
    ).not.toBeNull();
    expect(
      deliveryAddressBlock(canvasElement).getByText(/Harbour Road/),
    ).toBeVisible();
    expect(
      deliveryAddressBlock(canvasElement).getByText(/\+852/),
    ).toBeVisible();
    expect(
      deliveryAddressBlock(canvasElement).getByText(/Alex Chan/),
    ).toBeVisible();
    expect(canvas.getByText("Card (HKD)")).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: "Complete Order Setup" }),
    ).not.toBeInTheDocument();

    await waitFor(
      () => {
        expect(page.getByText("Order setup complete")).toBeVisible();
      },
      { timeout: 3000 },
    );
    expect(page.getByText(/preparing your invoice/i)).toBeVisible();
  },
};

/** Nested add-address on step 1, then finish setup with card. */
export const AddNewAddressSetupFlow: Story = {
  name: "Add New Address Setup Flow",
  args: { status: "awaiting_address" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await winnerOrderSettled(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Complete Order Setup" }),
    );

    const outerDialog = await waitFor(() => {
      const found = page.getByRole("dialog", {
        name: "Delivery Address",
      });
      expect(found).toBeVisible();
      return found;
    });
    await userEvent.click(
      within(outerDialog).getByRole("button", { name: "Add New Address" }),
    );

    const nestedDialog = await waitFor(() => {
      const found = page.getByRole("dialog", { name: "Add Address" });
      expect(found).toBeVisible();
      return found;
    });
    const nested = within(nestedDialog);

    await fillWinnerOrderAddAddress(page, nested, {
      firstName: "Jordan",
      lastName: "Lee",
      street: "88 Queen's Road Central",
      city: "Central",
      postalCode: "000000",
    });

    await userEvent.click(
      nested.getByRole("button", { name: "Use This Address" }),
    );

    await waitFor(() => {
      expect(
        page.queryByRole("dialog", { name: "Add Address" }),
      ).not.toBeInTheDocument();
    });

    const picker = within(
      await waitFor(() => {
        const found = page.getByRole("dialog", {
          name: "Delivery Address",
        });
        expect(found).toBeVisible();
        return found;
      }),
    );
    expect(picker.getByText("Jordan Lee")).toBeVisible();
    expect(picker.getByText(/Queen's Road Central/)).toBeVisible();

    await userEvent.click(picker.getByRole("button", { name: "Continue" }));
    await waitFor(() => {
      expect(picker.getByText("Step 2 of 3")).toBeVisible();
    });
    // The winner chooses the settlement currency and payment method.
    const hkd = picker.getByRole("button", { name: "HKD" });
    expect(picker.getByRole("button", { name: "USD" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(hkd).toHaveAttribute("aria-pressed", "false");
    expect(picker.queryByRole("radio")).not.toBeInTheDocument();
    expect(picker.getByRole("button", { name: "Continue" })).toBeDisabled();

    await userEvent.click(hkd);
    const card = await waitFor(() => {
      const found = picker.getByRole("radio", { name: /^Card\b/i });
      expect(found).toBeVisible();
      return found;
    });
    expect(card).not.toBeChecked();
    expect(picker.getByRole("button", { name: "Continue" })).toBeDisabled();
    await userEvent.click(card);
    await waitFor(() => {
      expect(card).toBeChecked();
      expect(picker.getByRole("button", { name: "Continue" })).toBeEnabled();
    });
    await userEvent.click(picker.getByRole("button", { name: "Continue" }));
    await waitFor(() => {
      expect(picker.getByText("Step 3 of 3")).toBeVisible();
    });
    await userEvent.click(
      picker.getByRole("button", { name: "Complete Order Setup" }),
    );

    await waitFor(() => {
      expect(page.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(
      canvasElement.querySelector(
        '[data-slot="winner-order-page"][data-status="preparing_invoice"]',
      ),
    ).not.toBeNull();
    expect(
      deliveryAddressBlock(canvasElement).getByText(/Queen's Road Central/),
    ).toBeVisible();

    await waitFor(
      () => {
        expect(page.getByText("Order setup complete")).toBeVisible();
      },
      { timeout: 3000 },
    );
  },
};
