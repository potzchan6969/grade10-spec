import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor } from "storybook/test";
import { REWARDS } from "./fixtures";
import { RewardCheckout } from "./reward-checkout";
import { checkoutMeta, sheet } from "./reward-checkout.story-fixtures";

const [ITEM, COUPON] = REWARDS;

/** The redeemed phase: the ticket, the folded scan QR, the out actions. */
const meta = {
  title: "Loyalty/Rewards/Blocks/RewardCheckout/Redeemed",
  component: RewardCheckout,
  ...checkoutMeta,
} satisfies Meta<typeof RewardCheckout>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The redeemed coupon ticket carries the unique code the redemption minted
 * and folds its scan QR behind Use now; no Apply — that belongs to the
 * cart. */
export const RedeemedCoupon: Story = {
  args: {
    reward: COUPON,
    redemption: {
      balanceAfter: 750,
      summary: "500 pts redeemed. 750 pts left",
      deadline: "Use by 28 Oct 2026",
      code: "G10-50-7Q2M",
      qrCode: {
        value: "g10:redeem:reward-voucher-50:7Q2M",
        altText: "Show this code to store staff",
        toggleLabel: "Use now",
      },
    },
  },
  play: async ({ args }) => {
    const canvas = sheet();
    expect(canvas.getByText("Added to your coupons")).toBeInTheDocument();
    expect(
      canvas.getByText("500 pts redeemed. 750 pts left"),
    ).toBeInTheDocument();
    expect(canvas.getByText("G10-50-7Q2M")).toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Apply" }),
    ).not.toBeInTheDocument();

    // The QR stays folded until the member asks.
    const qr = document.body.querySelector('[data-slot="promo-ticket-qr"]');
    expect(qr).not.toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Use now" }));
    await waitFor(() => expect(qr).toBeVisible());

    await userEvent.click(canvas.getByRole("button", { name: "Done" }));
    expect(args.onDone).toHaveBeenCalled();
    expect(
      canvas.getByRole("button", { name: "View Coupons" }),
    ).toHaveAttribute("href", "#coupons");
  },
};

/** The redeemed good's ticket names the collection under a storefront mark
 * — no code — and folds its collection QR behind Use now. */
export const RedeemedItem: Story = {
  args: {
    reward: ITEM,
    redemption: {
      balanceAfter: 1150,
      summary: "100 pts redeemed. 1,150 pts left",
      deadline: "Collect by 5 Nov 2026",
      note: "Collect at any Grade10 store",
      qrCode: {
        value: "g10:collect:reward-halloween-potatoz:7Q2M",
        altText: "Show this code to store staff",
        toggleLabel: "Use now",
      },
    },
  },
  play: async () => {
    const canvas = sheet();
    expect(canvas.getByText("Ready to Collect")).toBeInTheDocument();
    expect(canvas.getByText("Collect by 5 Nov 2026")).toBeInTheDocument();
    expect(
      canvas.getByText("Collect at any Grade10 store"),
    ).toBeInTheDocument();
    expect(canvas.queryByText("G10-50-7Q2M")).not.toBeInTheDocument();

    const qr = document.body.querySelector('[data-slot="promo-ticket-qr"]');
    expect(qr).not.toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Use now" }));
    await waitFor(() => expect(qr).toBeVisible());
  },
};
