import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { PAYOUT_METHOD, PORTFOLIO_SUMMARY } from "../../vault-content";
import { type PayoutMethod, WithdrawalDialog } from "./withdrawal-dialog";

function WithdrawalDialogDemo({
  payoutMethod,
}: {
  payoutMethod?: PayoutMethod;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-svh w-full flex-col bg-background p-8">
      <VStack className="mx-auto w-full max-w-lg" gap="md" hAlign="start">
        <Text as="h2" className="text-xl font-semibold tracking-tight">
          Withdraw
        </Text>
        <Text size="sm" tone="secondary">
          Standalone preview of the withdrawal dialog opened from the wallet
          card on the portfolio.
        </Text>
        {!open ? (
          <Button onClick={() => setOpen(true)} size="md">
            Open dialog
          </Button>
        ) : null}
      </VStack>
      <WithdrawalDialog
        availableUsd={PORTFOLIO_SUMMARY.rewardsAvailableUsd}
        hkdPerUsd={PORTFOLIO_SUMMARY.hkdPerUsd}
        minWithdrawalUsd={PORTFOLIO_SUMMARY.minWithdrawalUsd}
        payoutMethod={payoutMethod}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}

const meta = {
  title: "Vault/Portfolio/Screens/Withdraw Dialog",
  component: WithdrawalDialogDemo,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof WithdrawalDialogDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

const body = (canvasElement: HTMLElement) =>
  within(canvasElement.ownerDocument.body);

async function openDialog(canvasElement: HTMLElement) {
  const page = body(canvasElement);
  const dialog = await waitFor(() => {
    const found = page.getByRole("dialog");
    expect(found).toBeVisible();
    return found;
  });
  return within(dialog);
}

/** Amount entry — the available balance captioned, `Max` fills it. */
export const Amount: Story = {
  args: { payoutMethod: PAYOUT_METHOD },
  play: async ({ canvasElement }) => {
    const dialog = await openDialog(canvasElement);
    expect(dialog.getByText("Withdraw")).toBeVisible();
    expect(dialog.getAllByText(/Available to withdraw/).length).toBeGreaterThan(
      0,
    );
    expect(dialog.getByText(/Minimum US\$65/)).toBeVisible();
    expect(dialog.getByRole("button", { name: "Continue" })).toBeDisabled();
    await userEvent.click(dialog.getByRole("button", { name: "Max" }));
    expect(dialog.getByRole("button", { name: "Continue" })).toBeEnabled();
  },
};

/** First payout — no account on file, so bank details come before review. */
export const FirstPayout: Story = {
  play: async ({ canvasElement }) => {
    const dialog = await openDialog(canvasElement);
    await userEvent.click(dialog.getByRole("button", { name: "Max" }));
    await userEvent.click(dialog.getByRole("button", { name: "Continue" }));
    await waitFor(() =>
      expect(dialog.getByText("Payout Bank Details")).toBeVisible(),
    );
    expect(dialog.getByLabelText("Account holder name")).toBeVisible();
    expect(dialog.getByLabelText("Bank name")).toBeVisible();
    expect(dialog.getByLabelText("Account number")).toBeVisible();
  },
};

/** A saved account — amount, then straight to the review. */
export const Review: Story = {
  args: { payoutMethod: PAYOUT_METHOD },
  play: async ({ canvasElement }) => {
    const dialog = await openDialog(canvasElement);
    await userEvent.click(dialog.getByRole("button", { name: "Max" }));
    await userEvent.click(dialog.getByRole("button", { name: "Continue" }));
    await waitFor(() =>
      expect(dialog.getByText("Review Withdraw")).toBeVisible(),
    );
    expect(dialog.getByText(/HK\$1,242/)).toBeVisible();
    expect(dialog.getByText("HSBC ••• 8304")).toBeVisible();
    expect(dialog.getByText("Chan Tai Man")).toBeVisible();
    expect(dialog.getAllByText(/business days/).length).toBeGreaterThan(0);
    expect(
      dialog.getByRole("button", { name: "Submit Request" }),
    ).toBeVisible();
  },
};

/** Submitted — the request lands as Pending on the portfolio. */
export const Submitted: Story = {
  args: { payoutMethod: PAYOUT_METHOD },
  play: async ({ canvasElement }) => {
    const dialog = await openDialog(canvasElement);
    await userEvent.click(dialog.getByRole("button", { name: "Max" }));
    await userEvent.click(dialog.getByRole("button", { name: "Continue" }));
    await waitFor(() =>
      expect(
        dialog.getByRole("button", { name: "Submit Request" }),
      ).toBeVisible(),
    );
    await userEvent.click(
      dialog.getByRole("button", { name: "Submit Request" }),
    );
    await waitFor(() =>
      expect(dialog.getByText("Request Submitted")).toBeVisible(),
    );
    expect(dialog.getByText("Pending")).toBeVisible();
    expect(dialog.getByRole("button", { name: "Done" })).toBeVisible();
  },
};

/** 390px phone — the amount field and steps keep their full width. */
export const Narrow: Story = {
  args: { payoutMethod: PAYOUT_METHOD },
  globals: { viewport: { value: "mobile1" } },
  play: async ({ canvasElement }) => {
    const dialog = await openDialog(canvasElement);
    expect(dialog.getByText("Withdraw")).toBeVisible();
  },
};
