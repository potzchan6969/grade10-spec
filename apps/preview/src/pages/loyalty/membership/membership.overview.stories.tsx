import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { MEMBERSHIP_STATE_VIEWS, MEMBERSHIP_VIEW } from "../loyalty-content";
import { MembershipPage } from "./membership-page";

const meta = {
  title: "Loyalty/Membership/Screens/Membership/Overview",
  component: MembershipPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { view: MEMBERSHIP_VIEW, tab: "overview" },
} satisfies Meta<typeof MembershipPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Past the threshold the bar caps at the threshold, and the count still reads true. */
export const ThresholdReached: Story = {
  args: { view: MEMBERSHIP_STATE_VIEWS.thresholdReached },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("620 / 500 pts")).toBeInTheDocument();
    expect(
      canvas.getByRole("progressbar", { name: "Keep Gold" }),
    ).toHaveAttribute("aria-valuenow", "500");
  },
};
