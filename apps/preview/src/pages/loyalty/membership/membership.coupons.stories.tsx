import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { MEMBERSHIP_STATE_VIEWS, MEMBERSHIP_VIEW } from "../loyalty-content";
import { MembershipPage } from "./membership-page";

const meta = {
  title: "Loyalty/Membership/Screens/Membership/Coupons",
  component: MembershipPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { view: MEMBERSHIP_VIEW, tab: "coupons" },
} satisfies Meta<typeof MembershipPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** No coupon yet: the section says so and the rest of the page still reads. */
export const NoCoupons: Story = {
  args: { view: MEMBERSHIP_STATE_VIEWS.noCoupons },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("You have no coupons yet. Redeem a reward to get one."),
    ).toBeInTheDocument();
  },
};
