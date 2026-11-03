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
  title: "Vault/Portfolio/Blocks/RewardsLedger",
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

export const Incentives: Story = {
  parameters: {
    verification: { caseId: "vc_b367c00d-7dea-422b-a355-fcfde075f6b5" },
  },
  args: {
    dailyIncentives: DAILY_INCENTIVES,
    payoutRequests: PAYOUT_REQUESTS,
    tab: "incentives",
  },
  render: (args) => <LedgerWithDetails {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("Daily Earnings").length).toBe(
      DAILY_INCENTIVES.filter((entry) => !entry.catchUp).length,
    );
    expect(canvas.getAllByText("Backdated earnings").length).toBeGreaterThan(0);
    expect(canvas.getAllByText("+US$16").length).toBeGreaterThan(0);
    expect(canvas.queryByText("Pending")).toBeNull();
  },
};

export const Withdrawal: Story = {
  ...Incentives,
  parameters: {
    ...Incentives.parameters,
    verification: { caseId: "vc_5c04dd3a-b776-40f8-b14c-46e7d9b8d16a" },
  },
  args: { ...Incentives.args, tab: "withdrawal" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
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
      expect(
        page.getByRole("dialog", { name: "Withdrawal Details" }),
      ).toBeVisible(),
    );
  },
};

export const Narrow: Story = {
  ...Incentives,
  parameters: {
    ...Incentives.parameters,
    verification: { caseId: "vc_27450839-a858-4e96-a0e5-da9cba7d940b" },
  },
  globals: { viewport: { value: "mobile1" } },
};
