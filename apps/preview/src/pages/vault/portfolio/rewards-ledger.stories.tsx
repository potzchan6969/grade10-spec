import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  DAILY_INCENTIVES,
  PAYOUT_REQUESTS,
  type VaultPayoutRequest,
} from "../../vault-content";
import { RewardsLedger } from "./rewards-ledger";
import { WithdrawalDetails } from "./withdrawal-details";

/**
 * Incentive and withdrawal activity — daily incentive sums under Incentives,
 * every request with its approval status under Withdrawal. A withdrawal
 * row's chevron opens its details in a right-side drawer.
 */
const meta = {
  title: "Vault/Portfolio/Parts/RewardsLedger",
  component: RewardsLedger,
  parameters: { layout: "padded" },
} satisfies Meta<typeof RewardsLedger>;

export default meta;
type Story = StoryObj<typeof meta>;

function LedgerWithDetails(args: Story["args"]) {
  const [request, setRequest] = useState<VaultPayoutRequest | null>(null);
  return (
    <>
      <RewardsLedger {...args} onOpenWithdrawal={setRequest} />
      <WithdrawalDetails
        open={request != null}
        request={request}
        onOpenChange={(open) => {
          if (!open) setRequest(null);
        }}
      />
    </>
  );
}

export const All: Story = {
  args: {
    dailyIncentives: DAILY_INCENTIVES,
    payoutRequests: PAYOUT_REQUESTS,
  },
  render: (args) => <LedgerWithDetails {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("Daily Incentives").length).toBe(
      DAILY_INCENTIVES.length,
    );
    expect(canvas.getAllByText("+US$16").length).toBeGreaterThan(0);
    await waitFor(() => expect(canvas.getByText("Pending")).toBeVisible());
  },
};

export const Incentives: Story = {
  ...All,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Incentives" }));
    expect(canvas.getAllByText("Daily Incentives").length).toBe(
      DAILY_INCENTIVES.length,
    );
    expect(canvas.queryByText("Pending")).toBeNull();
  },
};

export const Withdrawal: Story = {
  ...Incentives,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Withdrawal" }));
    await waitFor(() => {
      expect(canvas.getByText("Pending")).toBeVisible();
      expect(canvas.getAllByText("Completed").length).toBeGreaterThan(0);
      expect(canvas.getByText("Declined")).toBeVisible();
    });
    // The whole row is the trigger — clicking it opens the details drawer.
    await userEvent.click(
      canvas.getAllByRole("button", { name: /View withdrawal details/ })[0],
    );
    const page = within(canvasElement.ownerDocument.body);
    await waitFor(() =>
      expect(page.getByText("Processing time")).toBeVisible(),
    );
  },
};

export const Narrow: Story = {
  ...All,
  globals: { viewport: { value: "mobile1" } },
};
