import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  FIXTURE_BALANCE_EXPIRY_DAY,
  FIXTURE_BALANCE_EXPIRY_SOON_DAY,
  FIXTURE_TIER_RENEWAL_DAY,
} from "../../lib/datetime-fixtures";
import { MembershipSummary } from "./membership-summary";

/* The card prints the balance as the programme counts it, so the expiry line
   spells the same figure the same way. */
const BALANCE = 1250;

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
    },
    tier: "Gold",
    balance: BALANCE,
    qualifyingPoints: 3200,
    qualifyingThreshold: 5000,
    renewalDate: FIXTURE_TIER_RENEWAL_DAY,
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

/** More than thirty days out: one line, the day, and no urgency. */
export const ExpiresLater: Story = {
  args: {
    balanceExpiry: {
      line: `${BALANCE} points expire on ${FIXTURE_BALANCE_EXPIRY_DAY}`,
      tone: "normal",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const line = canvas.getByText(
      `${BALANCE} points expire on ${FIXTURE_BALANCE_EXPIRY_DAY}`,
    );
    expect(line).toBeInTheDocument();
    expect(line.className).not.toContain("text-warning");
  },
};

/** Inside the last thirty days: the same line, said in the warning tone. */
export const ExpiresSoon: Story = {
  args: {
    balanceExpiry: {
      line: `${BALANCE} points expire on ${FIXTURE_BALANCE_EXPIRY_SOON_DAY}. Buy or redeem before then to keep them.`,
      tone: "warning",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const line = canvas.getByText(/expire on/);
    expect(line).toHaveTextContent("Buy or redeem before then to keep them.");
    expect(line.className).toContain("text-warning");
  },
};

/** The day itself: no date to read, only what is left of it. */
export const ExpiresToday: Story = {
  args: {
    balanceExpiry: {
      line: `${BALANCE} points expire today. Buy or redeem today to keep them.`,
      tone: "warning",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const line = canvas.getByText(/expire today/);
    expect(line.className).toContain("text-warning");
  },
};

/** A member holding nothing is told nothing: the line is absent, not empty. */
export const NoPoints: Story = {
  args: { balance: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("0")).toBeInTheDocument();
    expect(canvas.queryByText(/expire/)).not.toBeInTheDocument();
  },
};
