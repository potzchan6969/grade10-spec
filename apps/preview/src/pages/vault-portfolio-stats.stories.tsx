import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { PORTFOLIO_SUMMARY } from "./vault-content";
import { VaultPortfolioStats } from "./vault-portfolio-stats";

/**
 * Headline figures above the Vault Portfolio holdings — Figma `7102:1514`.
 * Provisional: the stats treatment is still being designed.
 */
const meta = {
  title: "Vault/Portfolio Stats",
  component: VaultPortfolioStats,
  parameters: { layout: "padded" },
} satisfies Meta<typeof VaultPortfolioStats>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  args: {
    totalEstimateHkd: PORTFOLIO_SUMMARY.totalEstimateHkd,
    feeLabel: PORTFOLIO_SUMMARY.feeLabel,
    feeHint: PORTFOLIO_SUMMARY.feeHint,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Total estimated value")).toBeVisible();
    expect(canvas.getByText("Storage fees")).toBeVisible();
    expect(canvas.getByText("Complimentary")).toBeVisible();
  },
};

/** Below `sm` the three figures stack in one column, divided by hairlines. */
export const Narrow: Story = {
  ...Filled,
  globals: { viewport: { value: "mobile1" } },
};
