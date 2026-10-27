import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { TopUpDialogPrototype } from "./top-up-dialog-prototype";

const meta = {
  title: "Loyalty/Top Ups/Prototypes/Top Up Dialog",
  component: TopUpDialogPrototype,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof TopUpDialogPrototype>;

export default meta;
type Story = StoryObj<typeof meta>;

/* The picker is an overlay, so it renders in a portal on document.body —
 * plays query the body, not canvasElement. */

/** The packs on sale, the balance, the terms and the way in. */
export const Default: Story = {
  args: { state: "default" },
  play: async () => {
    const overlay = within(document.body);
    expect(
      await overlay.findByRole("dialog", { name: "Top Up Points" }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(overlay.getByText("Your balance: 1,200 points")).toBeVisible(),
    );
    expect(overlay.getByRole("radio", { name: /^1,000/ })).toBeInTheDocument();
    await waitFor(() =>
      expect(
        overlay.getByRole("button", { name: "Continue to payment" }),
      ).toBeVisible(),
    );
  },
};

/** The 10,000-point pack: one line reads what the member pays and lands. */
export const PackSelected: Story = {
  name: "Pack Selected",
  args: { state: "default" },
  play: async () => {
    const overlay = within(document.body);
    await overlay.findByRole("dialog", { name: "Top Up Points" });
    await userEvent.click(overlay.getByRole("radio", { name: /^10,000/ }));
    await waitFor(() =>
      expect(overlay.getByText(/Balance after: 11,200 points/)).toBeVisible(),
    );
  },
};

/** Above the review threshold a quiet note says the pack is held for review. */
export const ReviewedPack: Story = {
  name: "Reviewed Pack",
  args: { state: "default" },
  play: async () => {
    const overlay = within(document.body);
    await overlay.findByRole("dialog", { name: "Top Up Points" });
    await userEvent.click(overlay.getByRole("radio", { name: /^50,000/ }));
    await waitFor(() =>
      expect(
        overlay.getByText(/reviewed before the points arrive/),
      ).toBeVisible(),
    );
  },
};

/** Continuing without a pack names the miss beside the pack grid. */
export const ChooseAPack: Story = {
  name: "Choose A Pack",
  args: { state: "default" },
  play: async () => {
    const overlay = within(document.body);
    await overlay.findByRole("dialog", { name: "Top Up Points" });
    await userEvent.click(
      overlay.getByRole("button", { name: "Continue to payment" }),
    );
    await waitFor(() =>
      expect(overlay.getByText("Choose a pack to continue.")).toBeVisible(),
    );
    expect(overlay.getByRole("radiogroup")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  },
};

/** A pack without the terms accepted names the miss under the checkbox. */
export const TermsNotAccepted: Story = {
  name: "Terms Not Accepted",
  args: { state: "default" },
  play: async () => {
    const overlay = within(document.body);
    await overlay.findByRole("dialog", { name: "Top Up Points" });
    await userEvent.click(overlay.getByRole("radio", { name: /^10,000/ }));
    await userEvent.click(
      overlay.getByRole("button", { name: "Continue to payment" }),
    );
    await waitFor(() =>
      expect(
        overlay.getByText("Agree to the terms to continue."),
      ).toBeVisible(),
    );
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

/** Near the daily cap the too-large packs are refused and say what is left. */
export const LimitAlmostReached: Story = {
  name: "Limit Almost Reached",
  args: { state: "limit-almost-reached" },
  play: async () => {
    const overlay = within(document.body);
    await overlay.findByRole("dialog", { name: "Top Up Points" });
    await waitFor(() =>
      expect(overlay.getByText("8,000 points left today")).toBeVisible(),
    );
    for (const name of [/^10,000/, /^50,000/]) {
      expect(overlay.getByRole("radio", { name })).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    }
    expect(overlay.getByRole("radio", { name: /^5,000/ })).not.toHaveAttribute(
      "aria-disabled",
      "true",
    );
  },
};

/** The day is spent: every pack is refused, with the quiet reason on top. */
export const LimitReached: Story = {
  name: "Limit Reached",
  args: { state: "limit-reached" },
  play: async () => {
    const overlay = within(document.body);
    await overlay.findByRole("dialog", { name: "Top Up Points" });
    await waitFor(() =>
      expect(
        overlay.getByText("You’ve reached today’s top-up limit"),
      ).toBeVisible(),
    );
    for (const name of [/^1,000/, /^5,000/, /^10,000/, /^50,000/]) {
      expect(overlay.getByRole("radio", { name })).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    }
    await userEvent.click(
      overlay.getByRole("button", { name: "Continue to payment" }),
    );
    await waitFor(() =>
      expect(overlay.getByText("Choose a pack to continue.")).toBeVisible(),
    );
  },
};

/** A pack that left sale between the list and checkout is gone, with the reason. */
export const PackOffSale: Story = {
  name: "Pack Off Sale",
  args: { state: "off-sale" },
  play: async () => {
    const overlay = within(document.body);
    await overlay.findByRole("dialog", { name: "Top Up Points" });
    await waitFor(() =>
      expect(
        overlay.getByText("That pack is no longer available"),
      ).toBeVisible(),
    );
    expect(
      overlay.queryByRole("radio", { name: /^10,000/ }),
    ).not.toBeInTheDocument();
  },
};

/** Stripe refused to open checkout; the pick and the terms are kept for retry. */
export const CheckoutNotOpened: Story = {
  name: "Checkout Not Opened",
  args: { state: "checkout-not-opened" },
  play: async () => {
    const overlay = within(document.body);
    await overlay.findByRole("dialog", { name: "Top Up Points" });
    await waitFor(() =>
      expect(overlay.getByText("We couldn’t open checkout")).toBeVisible(),
    );
    await waitFor(() =>
      expect(overlay.getByText(/Balance after: 11,200 points/)).toBeVisible(),
    );
    await waitFor(() =>
      expect(
        overlay.getByRole("button", { name: "Continue to payment" }),
      ).toBeVisible(),
    );
  },
};

/** Top-ups paused on the account: the packs go, the way to ask stays. */
export const Paused: Story = {
  args: { state: "paused" },
  play: async () => {
    const overlay = within(document.body);
    await overlay.findByRole("dialog", { name: "Top Up Points" });
    await waitFor(() =>
      expect(
        overlay.getByText("Top-ups are paused on your account"),
      ).toBeVisible(),
    );
    expect(
      overlay.getByRole("button", { name: "Contact us" }),
    ).toBeInTheDocument();
    expect(overlay.queryByRole("radio")).not.toBeInTheDocument();
  },
};

/** Top-ups switched off entirely: back to Membership. */
export const Unavailable: Story = {
  args: { state: "unavailable" },
  play: async () => {
    const overlay = within(document.body);
    await overlay.findByRole("dialog", { name: "Top Up Points" });
    await waitFor(() =>
      expect(
        overlay.getByText("Top-ups aren’t available right now"),
      ).toBeVisible(),
    );
    expect(overlay.getByRole("button", { name: "Close" })).toBeInTheDocument();
  },
};

/** Under 640px the picker is a bottom drawer, not a dialog. */
export const Narrow: Story = {
  args: { state: "default" },
  globals: { viewport: { value: "mobile1" } },
  play: async () => {
    await waitFor(() =>
      expect(
        document.body.querySelector('[data-slot="drawer-popup"]'),
      ).not.toBeNull(),
    );
    expect(
      document.body.querySelector('[data-slot="dialog-content"]'),
    ).toBeNull();
    const overlay = within(document.body);
    expect(overlay.getByRole("radio", { name: /^1,000/ })).toBeInTheDocument();
  },
};
