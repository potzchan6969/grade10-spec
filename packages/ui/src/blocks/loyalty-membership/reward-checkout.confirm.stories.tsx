import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor } from "storybook/test";
import { REWARDS } from "./fixtures";
import { RewardCheckout, type RewardCheckoutProps } from "./reward-checkout";
import { checkoutMeta, sheet } from "./reward-checkout.story-fixtures";

const [ITEM, COUPON] = REWARDS;

/** The confirm phase: restating the reward, the balance, the redeem call. */
const meta = {
  title: "Loyalty/Rewards/Blocks/RewardCheckout/Confirm",
  component: RewardCheckout,
  ...checkoutMeta,
} satisfies Meta<typeof RewardCheckout>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A good, confirming: the hero image, the deadline badge, the use-at and
 * valid-for rows, and the balance before and after. */
export const ItemConfirm: Story = {
  args: { reward: ITEM },
  play: async ({ args }) => {
    const canvas = sheet();
    expect(canvas.getByText("Halloween Potatoz")).toBeInTheDocument();
    expect(canvas.getByText("Until 31 Dec 2026")).toBeInTheDocument();
    expect(canvas.getByText("Use at")).toBeInTheDocument();
    expect(canvas.getByText("Grade10 store")).toBeInTheDocument();
    expect(canvas.getByText("14 days from redemption")).toBeInTheDocument();
    expect(canvas.getByText("1,150 pts")).toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole("button", { name: "Redeem for 100 pts" }),
    );
    expect(args.onRedeem).toHaveBeenCalled();
  },
};

/** A coupon, confirming: the gift tile hero and the longer validity. */
export const CouponConfirm: Story = {
  args: { reward: COUPON },
  play: async () => {
    const canvas = sheet();
    expect(
      document.body.querySelector('[data-slot="reward-art-coupon"]'),
    ).not.toBeNull();
    expect(canvas.getByText("Online or physical store")).toBeInTheDocument();
    expect(canvas.getByText("90 days from redemption")).toBeInTheDocument();
    expect(canvas.getByText("750 pts")).toBeInTheDocument();
  },
};

/** A short balance names the deficit in the warning tone and refuses whole. */
export const InsufficientBalance: Story = {
  args: { reward: COUPON, balance: 10 },
  play: async () => {
    const canvas = sheet();
    const row = document.body.querySelector(
      '[data-slot="reward-checkout-balance"]',
    );
    expect(row).toHaveAttribute("data-affordable", "false");
    expect(canvas.getByText("Need 490 more pts")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Redeem for 500 pts" }),
    ).toBeDisabled();
  },
};

/** While the redemption settles the button goes busy — a leading spinner,
 * presses ignored — before the surface swaps to the redeemed phase. */
export const Redeeming: Story = {
  args: { reward: COUPON, pending: true },
  play: async () => {
    const canvas = sheet();
    const button = canvas.getByRole("button", { name: "Redeem for 500 pts" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("aria-disabled", "true");
  },
};

/** A refusal means the reward is gone: on Redeem the surface closes itself —
 * the refusal message is raised outside it (the consumer's toast; see the
 * screen-level SoldOut story). */
export const RedemptionFailed: Story = {
  args: { reward: COUPON },
  render: function RefusalCloses(args: RewardCheckoutProps) {
    const [open, setOpen] = useState(true);
    const [failure, setFailure] = useState<string | null>(null);
    return (
      <RewardCheckout
        {...args}
        failure={failure}
        onOpenChange={(next) => {
          setOpen(next);
          args.onOpenChange(next);
        }}
        onRedeem={() => setFailure("This reward has just run out.")}
        open={open}
      />
    );
  },
  play: async ({ args }) => {
    const canvas = sheet();
    await userEvent.click(
      canvas.getByRole("button", { name: "Redeem for 500 pts" }),
    );
    await waitFor(() => expect(args.onOpenChange).toHaveBeenCalledWith(false));
    await waitFor(() =>
      expect(
        document.body.querySelector('[data-slot="reward-checkout"]'),
      ).toBeNull(),
    );
  },
};
