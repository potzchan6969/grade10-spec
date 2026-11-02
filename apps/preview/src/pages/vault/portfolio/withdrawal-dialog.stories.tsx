import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { PAYOUT_METHODS, PORTFOLIO_SUMMARY } from "../../vault-content";
import { type WithdrawalMethod, WithdrawalDialog } from "./withdrawal-dialog";

function WithdrawalDialogDemo({
  payoutMethods,
}: {
  payoutMethods?: WithdrawalMethod[];
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
        payoutMethods={payoutMethods}
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

async function enterMaxAndContinue(dialog: ReturnType<typeof within>) {
  await userEvent.click(dialog.getByRole("button", { name: "Max" }));
  await userEvent.click(dialog.getByRole("button", { name: "Continue" }));
}

/** Step 1 — amount entry, `Max` fills it, HK$ is the receive-in default. */
export const Amount: Story = {
  args: { payoutMethods: PAYOUT_METHODS },
  play: async ({ canvasElement }) => {
    const dialog = await openDialog(canvasElement);
    expect(dialog.getByText("Withdraw Rewards")).toBeVisible();
    expect(dialog.getAllByText(/Available to withdraw/).length).toBeGreaterThan(
      0,
    );
    expect(dialog.getByText("Hong Kong dollar")).toBeVisible();
    expect(dialog.getByText(/Not available yet/)).toBeVisible();
    expect(dialog.getByRole("button", { name: "Continue" })).toBeDisabled();
    await userEvent.click(dialog.getByRole("button", { name: "Max" }));
    expect(dialog.getByRole("button", { name: "Continue" })).toBeEnabled();
  },
};

/** Step 2 — saved destinations drawn like the order setup picker. */
export const Destination: Story = {
  args: { payoutMethods: PAYOUT_METHODS },
  play: async ({ canvasElement }) => {
    const dialog = await openDialog(canvasElement);
    await enterMaxAndContinue(dialog);
    await waitFor(() =>
      expect(dialog.getByText("Withdraw To")).toBeVisible(),
    );
    expect(dialog.getByText("HSBC ••• 8304")).toBeVisible();
    expect(dialog.getByText(/FPS · \+852 9123/)).toBeVisible();
    expect(dialog.getByText("Add Hong Kong bank or FPS")).toBeVisible();
    expect(dialog.getByText("US$ or overseas bank")).toBeVisible();
  },
};

/** Add a method — bank form with the verified name prefilled, editable. */
export const AddMethod: Story = {
  args: { payoutMethods: PAYOUT_METHODS },
  play: async ({ canvasElement }) => {
    const dialog = await openDialog(canvasElement);
    await enterMaxAndContinue(dialog);
    await userEvent.click(
      await dialog.findByText("Add Hong Kong bank or FPS"),
    );
    await waitFor(() =>
      expect(dialog.getByText("Add Withdrawal Method")).toBeVisible(),
    );
    expect(dialog.getByLabelText("Bank")).toBeVisible();
    expect(dialog.getByLabelText("Account Number")).toBeVisible();
    expect(dialog.getByLabelText("Account Holder Name")).toHaveValue(
      "Chan Tai Man",
    );
    expect(
      dialog.getByText("Save for future withdrawals"),
    ).toBeVisible();
  },
};

/** First payout — no destination on file, so the form opens from step 1. */
export const FirstPayout: Story = {
  args: { payoutMethods: [] },
  play: async ({ canvasElement }) => {
    const dialog = await openDialog(canvasElement);
    await enterMaxAndContinue(dialog);
    await waitFor(() =>
      expect(dialog.getByText("Add Withdrawal Method")).toBeVisible(),
    );
  },
};

/** Manual request — US$/overseas banks get their own form, no step rail. */
export const ManualRequest: Story = {
  args: { payoutMethods: PAYOUT_METHODS },
  play: async ({ canvasElement }) => {
    const dialog = await openDialog(canvasElement);
    await enterMaxAndContinue(dialog);
    await waitFor(() => expect(dialog.getByText("Withdraw To")).toBeVisible());
    await userEvent.click(dialog.getByText("US$ or overseas bank"));
    await waitFor(() =>
      expect(dialog.getByText("Manual Withdrawal Request")).toBeVisible(),
    );
    expect(dialog.getByLabelText("Amount (US$)")).toHaveValue("160");
    expect(dialog.getByLabelText("Bank country / region")).toBeVisible();
    expect(dialog.getByLabelText("Bank name")).toBeVisible();
    expect(dialog.getByLabelText("SWIFT / BIC")).toBeVisible();
    expect(
      dialog.getByLabelText("Account Holder Name"),
    ).toHaveValue("Chan Tai Man");
    expect(
      dialog.getByRole("button", { name: "Submit Request" }),
    ).toBeDisabled();
    expect(dialog.queryByText(/Step \d of 3/)).toBeNull();
  },
};

/** Step 3 — the review names the converted amount and the destination. */
export const Review: Story = {
  args: { payoutMethods: PAYOUT_METHODS },
  play: async ({ canvasElement }) => {
    const dialog = await openDialog(canvasElement);
    await enterMaxAndContinue(dialog);
    await waitFor(() =>
      expect(dialog.getByText("Withdraw To")).toBeVisible(),
    );
    await userEvent.click(dialog.getByRole("button", { name: "Continue" }));
    await waitFor(() =>
      expect(dialog.getByText("Review Withdrawal")).toBeVisible(),
    );
    expect(dialog.getByText(/HK\$1,241/)).toBeVisible();
    expect(dialog.getByText("HSBC ••• 8304")).toBeVisible();
    expect(dialog.getByText("Chan Tai Man · HK$")).toBeVisible();
    expect(
      dialog.getByRole("button", { name: "Submit Request" }),
    ).toBeVisible();
  },
};

/** Submitted — the request lands as Pending on the portfolio. */
export const Submitted: Story = {
  args: { payoutMethods: PAYOUT_METHODS },
  play: async ({ canvasElement }) => {
    const dialog = await openDialog(canvasElement);
    await enterMaxAndContinue(dialog);
    await userEvent.click(
      await dialog.findByRole("button", { name: "Continue" }),
    );
    await waitFor(() =>
      expect(
        dialog.getByRole("button", { name: "Submit Request" }),
      ).toBeVisible(),
    );
    await userEvent.click(
      dialog.getByRole("button", { name: "Submit Request" }),
    );
    await waitFor(() =>
      expect(
        dialog.getByText(/Withdrawal of US\$160 requested/),
      ).toBeVisible(),
    );
    expect(dialog.getByText("Request submitted")).toBeVisible();
    expect(dialog.getByText("Grade10 review")).toBeVisible();
    expect(dialog.getByText(/Withdrawn to HSBC ••• 8304/)).toBeVisible();
    expect(
      dialog.getByRole("button", { name: "View Withdrawal" }),
    ).toBeVisible();
    expect(dialog.getByRole("button", { name: "Done" })).toBeVisible();
  },
};

/** 390px phone — the amount field and steps keep their full width. */
export const Narrow: Story = {
  args: { payoutMethods: PAYOUT_METHODS },
  globals: { viewport: { value: "mobile1" } },
  play: async ({ canvasElement }) => {
    const dialog = await openDialog(canvasElement);
    expect(dialog.getByText("Withdraw Rewards")).toBeVisible();
  },
};
