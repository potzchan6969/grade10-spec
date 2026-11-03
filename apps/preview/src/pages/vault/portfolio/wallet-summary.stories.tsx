import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { PORTFOLIO_SUMMARY } from "../../vault-content";
import { WalletSummary } from "./wallet-summary";

/**
 * Earnings wallet above the holdings. Incentives accrue daily
 * while items stay in custody; the Withdraw CTA unlocks at the minimum.
 */
const meta = {
  title: "Vault/Portfolio/Blocks/WalletSummary",
  component: WalletSummary,
  parameters: { layout: "padded" },
} satisfies Meta<typeof WalletSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  parameters: {
    verification: { caseId: "vc_3a316813-ed94-4217-b996-73a2744a2c75" },
  },
  args: {
    dailyIncentiveUsd: PORTFOLIO_SUMMARY.dailyIncentiveUsd,
    availableUsd: PORTFOLIO_SUMMARY.rewardsAvailableUsd,
    earnedAllTimeUsd: PORTFOLIO_SUMMARY.earnedAllTimeUsd,
    inCashOutUsd: PORTFOLIO_SUMMARY.inCashOutUsd,
    cashedOutUsd: PORTFOLIO_SUMMARY.cashedOutUsd,
    openCashOutCount: 2,
    minWithdrawalUsd: PORTFOLIO_SUMMARY.minWithdrawalUsd,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Available earnings")).toBeVisible();
    expect(canvas.getByText("Earned all time")).toBeVisible();
    expect(canvas.getByText("In withdrawal")).toBeVisible();
    expect(canvas.getByText("Withdrawn")).toBeVisible();
    expect(canvas.getByText(/Est. daily earning/)).toBeVisible();
    expect(canvas.getByRole("button", { name: "Withdraw" })).toBeEnabled();
  },
};

/** Balance under the minimum — CTA disabled, the floor named beside it. */
export const BelowMinimum: Story = {
  parameters: {
    verification: { caseId: "vc_2b6811d5-f343-4b5b-9135-6c9f432602ba" },
  },
  args: { ...Filled.args, availableUsd: 5 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Withdraw" })).toBeDisabled();
    expect(
      canvas.getByRole("button", { name: "Minimum US$65 to withdraw" }),
    ).toBeVisible();
  },
};

/** Nothing in withdrawal — the middle segment collapses, no requests link. */
export const NoInCashOut: Story = {
  parameters: {
    verification: { caseId: "vc_857ea1c4-afa2-4f72-b481-7b33934c279c" },
  },
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
  parameters: {
    verification: { caseId: "vc_222828d2-9723-48ef-8175-9e4b9d49a237" },
  },
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
  parameters: {
    ...Filled.parameters,
    verification: { caseId: "vc_00137e7c-e50c-4875-ba45-20333fed205c" },
  },
  globals: { viewport: { value: "mobile1" } },
};
