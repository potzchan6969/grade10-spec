import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { BALANCE, REWARDS } from "./fixtures";
import { RewardCheckout } from "./reward-checkout";

const [ITEM, COUPON] = REWARDS;

const meta = {
  title: "Loyalty/Rewards/Blocks/RewardCheckout",
  component: RewardCheckout,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    copy: {
      useAt: "Use at",
      validFor: "Valid for",
      pointBalance: "Point Balance",
      points: "pts",
      pointCount: (points: number) => points.toLocaleString("en-HK"),
      pointsNeeded: (missing: number) =>
        `Need ${missing.toLocaleString("en-HK")} more pts`,
      redeemFor: (cost: number) => `Redeem for ${cost} pts`,
      redeemedCouponTitle: "Added to your coupons",
      redeemedItemTitle: "Ready to Collect",
      done: "Done",
      viewCoupons: "View Coupons",
    },
    balance: BALANCE,
    open: true,
    onOpenChange: fn(),
    onRedeem: fn(),
    onDone: fn(),
    viewCouponsHref: "#coupons",
  },
} satisfies Meta<typeof RewardCheckout>;

export default meta;
type Story = StoryObj<typeof meta>;

/* The surface renders in a portal; query the document, not the canvas root. */
const sheet = () => within(document.body);

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

/** The settling redemption draws the button busy; the refusal reads under it. */
export const RedemptionFailed: Story = {
  args: {
    reward: COUPON,
    failure: "This reward has just run out.",
  },
  play: async () => {
    const canvas = sheet();
    expect(canvas.getByRole("alert")).toHaveTextContent(
      "This reward has just run out.",
    );
    expect(
      canvas.getByRole("button", { name: "Redeem for 500 pts" }),
    ).toBeEnabled();
  },
};

/** The redeemed coupon ticket carries the unique code the redemption minted;
 * no Apply — that belongs to the cart. */
export const RedeemedCoupon: Story = {
  args: {
    reward: COUPON,
    redemption: {
      balanceAfter: 750,
      summary: "500 pts redeemed. 750 pts left",
      deadline: "Use by 28 Oct 2026",
      code: "G10-50-7Q2M",
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

    await userEvent.click(canvas.getByRole("button", { name: "Done" }));
    expect(args.onDone).toHaveBeenCalled();
    expect(
      canvas.getByRole("button", { name: "View Coupons" }),
    ).toHaveAttribute("href", "#coupons");
  },
};

/** The redeemed good's ticket names the collection and no code. */
export const RedeemedItem: Story = {
  args: {
    reward: ITEM,
    redemption: {
      balanceAfter: 1150,
      summary: "100 pts redeemed. 1,150 pts left",
      deadline: "Collect by 5 Nov 2026",
      note: "Collect at any Grade10 store",
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
  },
};

/** Under 640px the surface is a bottom sheet. */
export const NarrowIsSheet: Story = {
  globals: { viewport: { value: "mobile1" } },
  args: { reward: ITEM },
  play: async () => {
    await waitFor(() =>
      expect(
        document.body.querySelector('[data-slot="drawer-popup"]'),
      ).not.toBeNull(),
    );
    expect(
      document.body.querySelector('[data-slot="dialog-content"]'),
    ).toBeNull();
  },
};

/** From 640px up the surface is a dialog. */
export const WideIsDialog: Story = {
  globals: { viewport: { value: "desktop" } },
  args: { reward: ITEM },
  play: async () => {
    await waitFor(() =>
      expect(
        document.body.querySelector('[data-slot="dialog-content"]'),
      ).not.toBeNull(),
    );
    expect(
      document.body.querySelector('[data-slot="drawer-popup"]'),
    ).toBeNull();
  },
};
