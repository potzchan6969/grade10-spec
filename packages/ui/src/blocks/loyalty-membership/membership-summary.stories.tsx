import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  FIXTURE_POINTS_ACTIVE_UNTIL,
  FIXTURE_TIER_RENEWAL_DAY,
} from "../../lib/datetime-fixtures";
import { MembershipSummary } from "./membership-summary";

const meta = {
  title: "Loyalty Membership/MembershipSummary",
  component: MembershipSummary,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: {
      title: "My membership",
      tier: "Tier",
      balance: "Points to spend",
      qualifying: "Progress to keep your tier",
      renewal: "Tier renews",
      pointsActiveUntil: "Points active until",
    },
    tier: "Gold",
    balance: 1250,
    qualifyingPoints: 3200,
    qualifyingThreshold: 5000,
    renewalDate: FIXTURE_TIER_RENEWAL_DAY,
    pointsActiveUntil: FIXTURE_POINTS_ACTIVE_UNTIL,
  },
} satisfies Meta<typeof MembershipSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The two counts are two counts — spendable and qualifying, never summed. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("1250")).toBeInTheDocument();
    expect(canvas.getByText("3200 / 5000")).toBeInTheDocument();
    expect(canvas.queryByText("4450")).not.toBeInTheDocument();
    const progress = canvas.getByRole("progressbar", {
      name: "Progress to keep your tier",
    });
    expect(progress).toHaveAttribute("aria-valuenow", "3200");
    expect(progress).toHaveAttribute("aria-valuemax", "5000");
  },
};

/** Past the threshold the bar caps at the threshold instead of overflowing. */
export const ThresholdReached: Story = {
  args: { qualifyingPoints: 6100 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const progress = canvas.getByRole("progressbar", {
      name: "Progress to keep your tier",
    });
    expect(progress).toHaveAttribute("aria-valuenow", "5000");
    expect(canvas.getByText("6100 / 5000")).toBeInTheDocument();
  },
};
