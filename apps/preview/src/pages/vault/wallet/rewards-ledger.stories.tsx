import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { DAILY_INCENTIVES, PAYOUT_REQUESTS } from "../../vault-content";
import { RewardsLedger } from "./rewards-ledger";

/**
 * Rewards and cash-out activity — daily incentive sums under Rewards, every
 * request with its approval status under Cash-out.
 */
const meta = {
  title: "Vault/Wallet/Parts/RewardsLedger",
  component: RewardsLedger,
  parameters: { layout: "padded" },
} satisfies Meta<typeof RewardsLedger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = {
  args: {
    dailyIncentives: DAILY_INCENTIVES,
    payoutRequests: PAYOUT_REQUESTS,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("Daily incentive").length).toBe(
      DAILY_INCENTIVES.length,
    );
    expect(canvas.getByText("+US$16")).toBeVisible();
    expect(canvas.getByText("Pending review")).toBeVisible();
  },
};

export const Rewards: Story = {
  ...All,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("tab", { name: "Rewards" }));
    expect(canvas.getAllByText("Daily incentive").length).toBe(
      DAILY_INCENTIVES.length,
    );
    expect(canvas.queryByText("Pending review")).toBeNull();
  },
};

export const CashOut: Story = {
  ...Rewards,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("tab", { name: "Cash-out" }));
    expect(canvas.getByText("Pending review")).toBeVisible();
    expect(canvas.getByText("Paid")).toBeVisible();
  },
};

export const Narrow: Story = {
  ...All,
  globals: { viewport: { value: "mobile1" } },
};
