import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { TopUpPicker } from "./top-up-picker";

const meta = {
  title: "Loyalty/Top Ups/Blocks/TopUpPicker",
  component: TopUpPicker,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    open: true,
    onOpenChange: fn(),
    onPay: fn(),
    balanceLabel: "1,200 pt",
    copy: {
      title: "Top Up Points",
      subtitle:
        "1 point equals HK$1 off at checkout, or swap them for rewards and coupons.",
      packsLegend: "Choose a pack",
      unit: "pt",
      balance: "Balance",
      balanceAfter: "Balance after top-up",
      balanceTo: "to",
      continue: "Pay Now",
      opening: "Redirecting…",
      secured: "Secured by Stripe",
    },
    packs: [
      {
        id: "pack-1k",
        pointsLabel: "1,000",
        priceLabel: "HK$1,000",
        payLabel: "Pay HK$1,000",
        balanceAfterLabel: "2,200 pt",
      },
      {
        id: "pack-5k",
        pointsLabel: "5,000",
        priceLabel: "HK$4,850",
        paidPointsLabel: "4,850",
        bonusLabel: "150",
        payLabel: "Pay HK$4,850",
        balanceAfterLabel: "6,200 pt",
      },
      {
        id: "pack-10k",
        pointsLabel: "10,000",
        priceLabel: "HK$9,500",
        paidPointsLabel: "9,500",
        bonusLabel: "500",
        unavailable: "Over today’s limit",
        payLabel: "Pay HK$9,500",
        balanceAfterLabel: "11,200 pt",
      },
    ],
  },
} satisfies Meta<typeof TopUpPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nothing picked: the balance as it stands, and Pay Now waits for a pack. */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_8fa7ab39-29f9-4eb7-add6-5fe7f1cbc6c7" },
  },
  play: async ({ args }) => {
    const overlay = within(document.body);
    const dialog = await overlay.findByRole("dialog", {
      name: "Top Up Points",
    });
    const pay = within(dialog).getByRole("button", { name: "Pay Now" });
    expect(pay).toBeDisabled();
    await userEvent.click(within(dialog).getByRole("radio", { name: /5,000/ }));
    await waitFor(() =>
      expect(
        within(dialog).getByRole("button", { name: "Pay HK$4,850" }),
      ).toBeEnabled(),
    );
    await waitFor(() =>
      expect(within(dialog).getByText("6,200 pt")).toBeVisible(),
    );
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Pay HK$4,850" }),
    );
    expect(args.onPay).toHaveBeenCalledWith("pack-5k");
  },
};

/** Checkout is opening: the button waits and refuses a second press. */
export const Opening: Story = {
  parameters: {
    verification: { caseId: "vc_304ebfd4-c390-4e03-8bc0-524e8dd7c254" },
  },
  args: { busy: true, defaultPackId: "pack-5k" },
  play: async ({ args }) => {
    const overlay = within(document.body);
    const dialog = await overlay.findByRole("dialog", {
      name: "Top Up Points",
    });
    const pay = within(dialog).getByRole("button", { name: /Redirecting/ });
    await userEvent.click(pay, { pointerEventsCheck: 0 });
    expect(args.onPay).not.toHaveBeenCalled();
  },
};

/** A phone: the same packs in a drawer. */
export const Narrow: Story = {
  parameters: {
    verification: { caseId: "vc_9767813b-8daf-4111-82fc-d1f232463936" },
  },
  globals: { viewport: { value: "mobile1" } },
  play: async () => {
    const overlay = within(document.body);
    expect(
      await overlay.findByRole("dialog", { name: "Top Up Points" }),
    ).toBeInTheDocument();
    expect(overlay.getByRole("button", { name: "Pay Now" })).toBeDisabled();
  },
};
