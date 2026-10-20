import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { CompleteOrderSetupDemo } from "./complete-order-setup-demo";

const meta = {
  title: "Auction/Post Bidding/Parts/CompleteOrderSetupDemo/Payment Method",
  component: CompleteOrderSetupDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Step 2 of Complete Order Setup. USD and Card are preselected; the winner can switch to HKD or pick a bank rail. USD offers Card, HK Local and International via SWIFT; HKD offers Card, FPS and HK Local. A currency switch keeps a rail only when both currencies offer it.",
      },
    },
  },
  args: {
    cardFeePercentages: { USD: 4.4, HKD: 3.4 },
    initialStep: 2,
  },
} satisfies Meta<typeof CompleteOrderSetupDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

async function findVisibleDialog(
  page: ReturnType<typeof within>,
  name: string | RegExp,
) {
  return waitFor(() => {
    const dialog = page.getByRole("dialog", { name });
    expect(dialog).toBeVisible();
    return dialog;
  });
}

/** Step 2 preselects USD and Card; the winner can switch or pick a rail. */
export const PaymentMethod: Story = {
  name: "Payment method",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Payment Method");
    const modal = within(dialog);
    expect(modal.getByText("Step 2 of 3")).toBeVisible();
    expect(modal.getByText("Pay in")).toBeVisible();
    const usd = modal.getByRole("button", { name: "USD" });
    const hkd = modal.getByRole("button", { name: "HKD" });
    expect(usd).toBeVisible();
    expect(hkd).toBeVisible();
    expect(usd).toHaveAttribute("aria-pressed", "true");
    expect(hkd).toHaveAttribute("aria-pressed", "false");
    expect(modal.getByRole("radio", { name: /^Card\b/i })).toBeChecked();
    expect(modal.getByRole("radio", { name: /^HK Local\b/ })).toBeVisible();
    expect(
      modal.getByRole("radio", { name: /^International via SWIFT\b/ }),
    ).toBeVisible();
    expect(
      modal.getByText("Card fee about 4.4% + a fixed amount"),
    ).toBeVisible();
    expect(modal.getByRole("button", { name: "Continue" })).toBeEnabled();

    await userEvent.click(modal.getByRole("radio", { name: /^HK Local\b/ }));
    expect(
      within(modal.getByRole("radio", { name: /^HK Local\b/ })).getByText(
        "Bank fee set on your invoice",
      ),
    ).toBeVisible();
    expect(modal.getByRole("button", { name: "Continue" })).toBeEnabled();
    await userEvent.click(modal.getByRole("radio", { name: /^Card\b/i }));
    expect(modal.getByRole("button", { name: "Continue" })).toBeEnabled();

    await userEvent.click(hkd);
    await waitFor(() => {
      expect(hkd).toHaveAttribute("aria-pressed", "true");
    });
    expect(usd).toHaveAttribute("aria-pressed", "false");
    expect(
      modal.getByText("Card fee about 3.4% + a fixed amount"),
    ).toBeVisible();
    // Card is offered under both currencies, so the winner's pick stays.
    expect(modal.getByRole("radio", { name: /^Card\b/i })).toBeChecked();
    expect(modal.getByRole("button", { name: "Continue" })).toBeEnabled();

    await userEvent.click(usd);
    await waitFor(() => {
      expect(usd).toHaveAttribute("aria-pressed", "true");
    });
    expect(
      modal.getByText("Card fee about 4.4% + a fixed amount"),
    ).toBeVisible();
  },
};

/** USD is the default: Card, HK Local and International via SWIFT offered. */
export const PaymentMethodUsd: Story = {
  name: "Payment method — USD",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Payment Method");
    const modal = within(dialog);
    expect(modal.getByRole("button", { name: "USD" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(modal.getByRole("radio", { name: /^Card\b/i })).toBeChecked();
    expect(modal.getByRole("radio", { name: /^HK Local\b/ })).toBeVisible();
    expect(
      modal.queryByRole("radio", { name: /^International via SWIFT\b/ }),
    ).toBeVisible();
    expect(
      modal.queryByRole("radio", { name: /^FPS\b/ }),
    ).not.toBeInTheDocument();
    expect(modal.getByRole("button", { name: "Continue" })).toBeEnabled();
  },
};

/** HKD offers Card, FPS and HK Local; the Card pick carries over. */
export const PaymentMethodHkd: Story = {
  name: "Payment method — HKD",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Payment Method");
    const modal = within(dialog);
    await userEvent.click(modal.getByRole("button", { name: "HKD" }));
    await waitFor(() => {
      expect(modal.getByRole("button", { name: "HKD" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    });
    expect(modal.getByRole("radio", { name: /^Card\b/i })).toBeChecked();
    expect(modal.getByRole("radio", { name: /^FPS\b/ })).toBeVisible();
    expect(modal.getByRole("radio", { name: /^HK Local\b/ })).toBeVisible();
    expect(
      modal.queryByRole("radio", { name: /^International via SWIFT\b/ }),
    ).not.toBeInTheDocument();
  },
};

/** A shared rail stays selected; a currency-specific rail clears on switch. */
export const CurrencySwitchKeepsOnlyOfferedRail: Story = {
  name: "Currency switch keeps only an offered rail",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Payment Method");
    const modal = within(dialog);
    await userEvent.click(modal.getByRole("button", { name: "HKD" }));
    await userEvent.click(modal.getByRole("radio", { name: /^HK Local\b/ }));
    expect(modal.getByRole("radio", { name: /^HK Local\b/ })).toBeChecked();
    await userEvent.click(modal.getByRole("button", { name: "USD" }));
    await waitFor(() => {
      expect(modal.getByRole("radio", { name: /^HK Local\b/ })).toBeChecked();
    });
    expect(modal.getByRole("button", { name: "Continue" })).toBeEnabled();

    await userEvent.click(
      modal.getByRole("radio", { name: /^International via SWIFT\b/ }),
    );
    expect(
      modal.getByRole("radio", { name: /^International via SWIFT\b/ }),
    ).toBeChecked();
    await userEvent.click(modal.getByRole("button", { name: "HKD" }));
    await waitFor(() => {
      expect(modal.getByRole("radio", { name: /^FPS\b/ })).not.toBeChecked();
    });
    expect(
      modal.queryByRole("radio", { name: /^International via SWIFT\b/ }),
    ).not.toBeInTheDocument();
    expect(modal.getByRole("button", { name: "Continue" })).toBeDisabled();
  },
};

/** One offered currency is fixed; Card is still the preselected method. */
export const UsdOnly: Story = {
  name: "USD only",
  args: { settlementCurrencies: ["USD"] },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Payment Method");
    const modal = within(dialog);
    expect(modal.getByText("Pay in USD")).toBeVisible();
    expect(
      modal.queryByRole("button", { name: "USD" }),
    ).not.toBeInTheDocument();
    expect(
      modal.queryByRole("button", { name: "HKD" }),
    ).not.toBeInTheDocument();
    expect(modal.getByRole("radio", { name: /^Card\b/i })).toBeChecked();
    expect(modal.getByRole("radio", { name: /^HK Local\b/ })).toBeVisible();
    expect(
      modal.getByRole("radio", { name: /^International via SWIFT\b/ }),
    ).toBeVisible();
    expect(modal.getByRole("button", { name: "Continue" })).toBeEnabled();
  },
};

/** A missing USD card fee rule leaves card unavailable; HK Local is preselected. */
export const UsdWithoutCardRule: Story = {
  name: "USD without a card rule",
  args: { cardFeePercentages: { HKD: 3.4 } },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Payment Method");
    const modal = within(dialog);

    const card = await waitFor(() => {
      const choice = modal.getByRole("radio", { name: /^Card\b/i });
      expect(choice).toBeVisible();
      return choice;
    });
    expect(modal.getByRole("button", { name: "USD" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(card).toHaveAttribute("aria-disabled", "true");
    expect(card).not.toBeChecked();
    expect(modal.getByText("Card is not yet available in USD")).toBeVisible();
    expect(modal.getByRole("radio", { name: /^HK Local\b/ })).toBeChecked();
    expect(
      modal.getByRole("radio", { name: /^International via SWIFT\b/ }),
    ).toBeVisible();
    expect(modal.getByRole("button", { name: "Continue" })).toBeEnabled();

    await userEvent.click(modal.getByRole("button", { name: "HKD" }));
    const hkdCard = modal.getByRole("radio", { name: /^Card\b/i });
    await waitFor(() => {
      expect(hkdCard).toBeVisible();
      expect(hkdCard).not.toHaveAttribute("aria-disabled", "true");
    });
    // HK Local is offered under both currencies, so the pick carries over.
    expect(modal.getByRole("radio", { name: /^HK Local\b/ })).toBeChecked();
    await userEvent.click(hkdCard);
    expect(hkdCard).toBeChecked();
    expect(modal.getByRole("button", { name: "Continue" })).toBeEnabled();

    await userEvent.click(modal.getByRole("button", { name: "USD" }));
    await waitFor(() => {
      expect(modal.getByRole("button", { name: "USD" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    });
    expect(modal.getByRole("radio", { name: /^Card\b/i })).not.toBeChecked();
    expect(modal.getByRole("button", { name: "Continue" })).toBeDisabled();

    await userEvent.click(modal.getByRole("radio", { name: /^HK Local\b/ }));
    expect(modal.getByRole("button", { name: "Continue" })).toBeEnabled();
  },
};
