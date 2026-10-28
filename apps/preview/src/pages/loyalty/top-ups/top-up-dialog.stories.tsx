import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { TopUpDialogPrototype } from "./top-up-dialog-prototype";

const meta = {
  title: "Loyalty/Top Ups/Screens/Top Up Dialog",
  component: TopUpDialogPrototype,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof TopUpDialogPrototype>;

export default meta;
type Story = StoryObj<typeof meta>;

/* The picker and the toasts are overlays, so they render in portals on
 * document.body: plays query the body for them and canvasElement for the
 * stand-in page's trigger. */

/** The packs on sale, the balance, and the way in; nothing picked yet. */
export const Default: Story = {
  args: { state: "default" },
  play: async () => {
    const overlay = within(document.body);
    expect(
      await overlay.findByRole("dialog", { name: "Top Up Points" }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(overlay.getByText("Balance: 1,200 points")).toBeVisible(),
    );
    expect(overlay.getAllByRole("radio")).toHaveLength(8);
    await waitFor(() =>
      expect(
        overlay.getByRole("button", { name: "Continue to payment" }),
      ).toBeDisabled(),
    );
    expect(overlay.getByText("Secure checkout by Stripe")).toBeVisible();
  },
};

/** The 10,000-point pack: the way in unlocks and one line reads the pick. */
export const PackSelected: Story = {
  name: "Pack Selected",
  args: { state: "default" },
  play: async () => {
    const overlay = within(document.body);
    await overlay.findByRole("dialog", { name: "Top Up Points" });
    await userEvent.click(overlay.getByRole("radio", { name: /^10,000/ }));
    await waitFor(() =>
      expect(
        overlay.getByText(
          "10,000 points for HK$9,500. Balance after: 11,200 points",
        ),
      ).toBeVisible(),
    );
    expect(overlay.getByRole("button", { name: "Pay HK$9,500" })).toBeEnabled();
  },
};

/** While Stripe's checkout opens the button shows the wait. */
export const OpeningCheckout: Story = {
  name: "Opening Checkout",
  args: { state: "opening" },
  play: async () => {
    const overlay = within(document.body);
    const button = await overlay.findByRole("button", {
      name: /Opening checkout/,
    });
    await waitFor(() => expect(button).toBeVisible());
    expect(button).toHaveAttribute("aria-disabled", "true");
  },
};

/** Near the daily cap the too-large packs are refused and say why in a tooltip. */
export const LimitAlmostReached: Story = {
  name: "Limit Almost Reached",
  args: { state: "limit-almost-reached" },
  play: async () => {
    const overlay = within(document.body);
    await overlay.findByRole("dialog", { name: "Top Up Points" });
    const refused = overlay.getAllByRole("radio", {
      name: /Over today’s limit/,
    });
    expect(refused).toHaveLength(5);
    for (const radio of refused) {
      expect(radio).toHaveAttribute("aria-disabled", "true");
    }
    expect(overlay.getByRole("radio", { name: /^5,000/ })).not.toHaveAttribute(
      "aria-disabled",
      "true",
    );
  },
};

/** Stripe refused to open checkout: a toast says so, the pick stays. */
export const CheckoutNotOpened: Story = {
  name: "Checkout Not Opened",
  args: { state: "checkout-not-opened" },
  play: async () => {
    const overlay = within(document.body);
    await overlay.findByRole("dialog", { name: "Top Up Points" });
    await userEvent.click(overlay.getByRole("radio", { name: /^10,000/ }));
    await userEvent.click(
      overlay.getByRole("button", { name: "Pay HK$9,500" }),
    );
    await waitFor(() =>
      expect(
        overlay.getAllByText("We couldn’t open checkout").length,
      ).toBeGreaterThanOrEqual(1),
    );
    expect(
      overlay.getByRole("dialog", { name: "Top Up Points" }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(overlay.getByText(/Balance after: 11,200 points/)).toBeVisible(),
    );
  },
};

/** The day is spent: the trigger answers with a toast, the picker never opens. */
export const LimitReached: Story = {
  name: "Limit Reached",
  args: { state: "limit-reached" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const overlay = within(document.body);
    expect(
      overlay.queryByRole("dialog", { name: "Top Up Points" }),
    ).not.toBeInTheDocument();
    await userEvent.click(
      canvas.getByRole("button", { name: "Top Up Points" }),
    );
    await waitFor(() =>
      expect(
        overlay.getAllByText("You’ve reached today’s top-up limit").length,
      ).toBeGreaterThanOrEqual(1),
    );
    expect(
      overlay.queryByRole("dialog", { name: "Top Up Points" }),
    ).not.toBeInTheDocument();
  },
};

/** Top-ups paused on the account: the trigger answers with a toast. */
export const Paused: Story = {
  args: { state: "paused" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const overlay = within(document.body);
    await userEvent.click(
      canvas.getByRole("button", { name: "Top Up Points" }),
    );
    await waitFor(() =>
      expect(
        overlay.getAllByText("Top-ups are paused on your account").length,
      ).toBeGreaterThanOrEqual(1),
    );
    expect(
      overlay.queryByRole("dialog", { name: "Top Up Points" }),
    ).not.toBeInTheDocument();
  },
};

/** Top-ups switched off entirely: the trigger answers with a toast. */
export const Unavailable: Story = {
  args: { state: "unavailable" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const overlay = within(document.body);
    await userEvent.click(
      canvas.getByRole("button", { name: "Top Up Points" }),
    );
    await waitFor(() =>
      expect(
        overlay.getAllByText("Top-ups aren’t available right now").length,
      ).toBeGreaterThanOrEqual(1),
    );
    expect(
      overlay.queryByRole("dialog", { name: "Top Up Points" }),
    ).not.toBeInTheDocument();
  },
};

/** Under 640px the picker is a bottom drawer, not a dialog. */
export const Narrow: Story = {
  args: { state: "default" },
  globals: { viewport: { value: "mobile1" } },
  play: async () => {
    const overlay = within(document.body);
    expect(
      await overlay.findByRole("dialog", { name: "Top Up Points" }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(
        overlay.getByRole("button", { name: "Continue to payment" }),
      ).toBeVisible(),
    );
  },
};
