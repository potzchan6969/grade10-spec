import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { PORTFOLIO_SUMMARY } from "../../vault-content";
import { WalletSummary } from "./wallet-summary";

/**
 * Rewards wallet above the holdings. Rewards accrue daily
 * while items stay in custody; the Withdraw CTA unlocks at the minimum.
 */
const meta = {
  title: "Vault/Portfolio/Parts/WalletSummary",
  component: WalletSummary,
  parameters: { layout: "padded" },
} satisfies Meta<typeof WalletSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  args: {
    dailyIncentiveUsd: PORTFOLIO_SUMMARY.dailyIncentiveUsd,
    availableUsd: PORTFOLIO_SUMMARY.rewardsAvailableUsd,
    earnedAllTimeUsd: PORTFOLIO_SUMMARY.earnedAllTimeUsd,
    inCashOutUsd: PORTFOLIO_SUMMARY.inCashOutUsd,
    cashedOutUsd: PORTFOLIO_SUMMARY.cashedOutUsd,
    openCashOutCount: 2,
    minWithdrawalUsd: PORTFOLIO_SUMMARY.minWithdrawalUsd,
    hasPayoutMethod: PORTFOLIO_SUMMARY.hasPayoutMethod,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Incentives available")).toBeVisible();
    expect(canvas.getByText("Earned all time")).toBeVisible();
    expect(canvas.getByText("In withdrawal")).toBeVisible();
    expect(canvas.getByText("Withdrawn")).toBeVisible();
    expect(canvas.getByText(/daily while your items/)).toBeVisible();
    expect(canvas.getByRole("button", { name: "Withdraw" })).toBeEnabled();
  },
};

/** Balance under the minimum — CTA disabled, the floor named beside it. */
export const BelowMinimum: Story = {
  args: { ...Filled.args, availableUsd: 5 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Withdraw" })).toBeDisabled();
    expect(
      canvas.getByRole("button", { name: "Minimum US$65 to withdraw" }),
    ).toBeVisible();
  },
};

/** No bank account on file — set-up CTA replaces Withdraw. */
export const NoPayoutMethod: Story = {
  args: { ...Filled.args, hasPayoutMethod: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Set Up Payout" })).toBeVisible();
    expect(canvas.queryByRole("button", { name: "Withdraw" })).toBeNull();
  },
};

/** Nothing in withdrawal — the middle segment collapses, no requests link. */
export const NoInCashOut: Story = {
  args: { ...Filled.args, inCashOutUsd: 0, openCashOutCount: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("In withdrawal")).toBeVisible();
    expect(canvas.queryByText(/requests?$/)).toBeNull();
    expect(canvas.getByText("US$0")).toBeVisible();
  },
};

/** Nothing withdrawn yet — the last segment collapses to zero. */
export const NoCashedOut: Story = {
  args: { ...Filled.args, cashedOutUsd: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Withdrawn")).toBeVisible();
    expect(canvas.getByText("US$0")).toBeVisible();
  },
};

/** Below `sm` the cells stack in one column, divided by hairlines. */
export const Narrow: Story = {
  ...Filled,
  globals: { viewport: { value: "mobile1" } },
};
