import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { MEMBERSHIP_STATE_VIEWS, MEMBERSHIP_VIEW } from "../loyalty-content";
import { MembershipPage } from "./membership-page";

const meta = {
  title: "Loyalty/Membership/Screens/Membership/Rewards",
  component: MembershipPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { view: MEMBERSHIP_VIEW, tab: "rewards" },
} satisfies Meta<typeof MembershipPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RedeemCoupon: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const overlay = within(document.body);
    await userEvent.click(
      canvas.getByRole("button", { name: /HK\$50 off coupon/ }),
    );
    await userEvent.click(
      await overlay.findByRole("button", { name: "Redeem for 500 pts" }),
    );
    expect(
      await overlay.findByText("Added to your coupons"),
    ).toBeInTheDocument();
    await userEvent.click(overlay.getByRole("button", { name: "Done" }));
    await userEvent.click(
      within(canvas.getByRole("navigation", { name: "Membership" })).getByRole(
        "button",
        { name: "Overview" },
      ),
    );
    expect(canvas.getByText("750")).toBeInTheDocument();
  },
};

/** The rewards section holds its place while the catalog is read. */
export const RewardsLoading: Story = {
  args: { view: MEMBERSHIP_STATE_VIEWS.rewardsLoading },
  play: async ({ canvasElement }) => {
    expect(
      canvasElement.querySelector('[data-slot="reward-menu-loading"]'),
    ).not.toBeNull();
  },
};
