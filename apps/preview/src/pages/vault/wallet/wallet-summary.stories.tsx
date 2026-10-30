import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { PORTFOLIO_SUMMARY } from "../../vault-content";
import { WalletSummary } from "./wallet-summary";

/**
 * Rewards wallet above the holdings. Rewards accrue daily
 * while items stay in custody; the Cash out CTA unlocks at the minimum.
 */
const meta = {
  title: "Vault/Wallet/Parts/WalletSummary",
  component: WalletSummary,
  parameters: { layout: "padded" },
} satisfies Meta<typeof WalletSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  args: {
    rewardsAvailableHkd: PORTFOLIO_SUMMARY.rewardsAvailableHkd,
    earnedAllTimeHkd: PORTFOLIO_SUMMARY.earnedAllTimeHkd,
    totalEstimateHkd: PORTFOLIO_SUMMARY.totalEstimateHkd,
    withdrawnHkd: PORTFOLIO_SUMMARY.withdrawnHkd,
    minWithdrawalHkd: PORTFOLIO_SUMMARY.minWithdrawalHkd,
    hasPayoutMethod: PORTFOLIO_SUMMARY.hasPayoutMethod,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Rewards available")).toBeVisible();
    expect(canvas.getByText("Earned all-time")).toBeVisible();
    expect(canvas.getByText("Total estimated value")).toBeVisible();
    expect(canvas.getByText("Withdrawn to date")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Cash out" }),
    ).toBeEnabled();
  },
};

/** Balance under the minimum — CTA disabled, the floor named beside it. */
export const BelowMinimum: Story = {
  args: { ...Filled.args, rewardsAvailableHkd: 38 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Cash out" }),
    ).toBeDisabled();
    expect(canvas.getByText("Minimum HK$500 to cash out")).toBeVisible();
  },
};

/** No bank account on file — set-up CTA replaces Cash out. */
export const NoPayoutMethod: Story = {
  args: { ...Filled.args, hasPayoutMethod: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Set up payout" }),
    ).toBeVisible();
    expect(canvas.queryByRole("button", { name: "Cash out" })).toBeNull();
  },
};

/** Below `sm` the cells stack in one column, divided by hairlines. */
export const Narrow: Story = {
  ...Filled,
  globals: { viewport: { value: "mobile1" } },
};
