import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { PAYOUT_REQUESTS } from "../../vault-content";
import { WithdrawalList } from "./withdrawal-list";

/**
 * Withdrawal requests — the status Grade10's approval
 * sets on each request, from Pending to Completed.
 */
const meta = {
  title: "Vault/Portfolio/Parts/WithdrawalList",
  component: WithdrawalList,
  parameters: { layout: "padded" },
} satisfies Meta<typeof WithdrawalList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  args: { requests: PAYOUT_REQUESTS },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Withdrawal requests")).toBeVisible();
    expect(canvas.getByText("Pending")).toBeVisible();
    expect(canvas.getByText("Processing")).toBeVisible();
    expect(canvas.getAllByText("Completed").length).toBe(2);
  },
};

/** A request Grade10 turned down — struck-through muted amounts. */
export const Declined: Story = {
  args: {
    requests: [
      {
        id: "po-4",
        requestedAt: "28 Oct 2026",
        amountUsd: 150,
        currency: "USD",
        status: "Declined",
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Declined")).toBeVisible();
  },
};

/** Below `sm` the rows keep their shape: icon, destination, amount, chevron. */
export const Narrow: Story = {
  ...Filled,
  globals: { viewport: { value: "mobile1" } },
};
