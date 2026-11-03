import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { Toast } from "@grade10/design-system/components/overlays/toast";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { PAYOUT_METHODS, PORTFOLIO_SUMMARY } from "../../vault-content";
import { WithdrawalDialog, type WithdrawalMethod } from "./withdrawal-dialog";

function WithdrawalDialogDemo({
  initialStep,
  payoutMethods,
  flow,
}: {
  initialStep?: ComponentProps<typeof WithdrawalDialog>["initialStep"];
  payoutMethods?: WithdrawalMethod[];
  flow?: ComponentProps<typeof WithdrawalDialog>["flow"];
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
        initialStep={initialStep}
        flow={flow}
        open={open}
        onOpenChange={setOpen}
      />
      <Toast position="bottom-right" />
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
  await userEvent.click(dialog.getByRole("button", { name: "Continue" }));
}

/** Step 1 — amount entry, `Max` fills it, HK$ is the receive-in default. */
export const Amount: Story = {
  parameters: {
    verification: { caseId: "vc_66568eca-21ec-48a4-a86e-e40cb6a5f8dc" },
  },
  args: { payoutMethods: PAYOUT_METHODS },
  play: async ({ canvasElement }) => {
    const dialog = await openDialog(canvasElement);
    expect(
      dialog.getByRole("heading", { name: "Withdraw Earnings" }),
    ).toBeVisible();
    expect(dialog.getAllByText(/Available: US\$160/).length).toBeGreaterThan(0);
    expect(dialog.getByText("Hong Kong Dollar")).toBeVisible();
    expect(dialog.getByText("US Dollar")).toBeVisible();
    expect(dialog.getByText("Not available now")).toBeVisible();
    expect(dialog.getByLabelText("Withdraw Amount")).toHaveValue(160);
    expect(dialog.getByRole("button", { name: "Continue" })).toBeEnabled();
    const field = dialog.getByLabelText("Withdraw Amount");
    await userEvent.clear(field);
    await userEvent.type(field, "100");
    await userEvent.click(dialog.getByRole("button", { name: "Use max" }));
    expect(field).toHaveValue(160);
  },
};

/** Step 2 — saved destinations drawn like the order setup picker. */
export const Destination: Story = {
  parameters: {
    verification: { caseId: "vc_7d984d02-57e9-4630-bc56-6debd13f968c" },
  },
  args: { payoutMethods: PAYOUT_METHODS },
  play: async ({ canvasElement }) => {
    const dialog = await openDialog(canvasElement);
    await enterMaxAndContinue(dialog);
    await waitFor(() =>
      expect(
        dialog.getByRole("heading", { name: "Withdrawal Destination" }),
      ).toBeVisible(),
    );
    expect(dialog.getByText("HSBC")).toBeVisible();
    expect(dialog.getByText("123 •••• 8304")).toBeVisible();
    expect(dialog.getByText("+852 •••• 4567")).toBeVisible();
    expect(dialog.getByText("Add Hong Kong bank or FPS")).toBeVisible();
    expect(dialog.getByText("Overseas bank")).toBeVisible();
  },
};

/** Add a method — bank form with the verified name prefilled, editable. */
export const AddMethod: Story = {
  parameters: {
    verification: { caseId: "vc_52cd112b-b53e-4157-a9ad-57d9530341f5" },
  },
  args: { payoutMethods: PAYOUT_METHODS },
  play: async ({ canvasElement }) => {
    const dialog = await openDialog(canvasElement);
    await enterMaxAndContinue(dialog);
    await userEvent.click(await dialog.findByText("Add Hong Kong bank or FPS"));
    await waitFor(() =>
      expect(
        dialog.getByRole("heading", { name: "Add Withdrawal Method" }),
      ).toBeVisible(),
    );
    expect(dialog.getByLabelText("Bank")).toBeVisible();
    expect(dialog.getByLabelText("Account Number")).toBeVisible();
    expect(dialog.getByLabelText("Account Holder Name")).toHaveValue("");
    expect(dialog.getByText("Save for future withdrawals")).toBeVisible();
  },
};

/** First payout — no destination on file, so the form opens from step 1. */
export const FirstPayout: Story = {
  parameters: {
    verification: { caseId: "vc_c159aa07-9175-4689-bf60-e08cbfb8d718" },
  },
  args: { payoutMethods: [] },
  play: async ({ canvasElement }) => {
    const dialog = await openDialog(canvasElement);
    await enterMaxAndContinue(dialog);
    await waitFor(() =>
      expect(
        dialog.getByRole("heading", { name: "Add Withdrawal Method" }),
      ).toBeVisible(),
    );
  },
};

/** Manual request — US$/overseas payouts go through an email to Grade10. */
export const ManualRequest: Story = {
  parameters: {
    verification: { caseId: "vc_57fb92b8-3636-4606-af08-e39e67ed663d" },
  },
  args: { payoutMethods: PAYOUT_METHODS },
  play: async ({ canvasElement }) => {
    const dialog = await openDialog(canvasElement);
    await waitFor(() =>
      expect(
        dialog.getByRole("heading", { name: "Withdraw Earnings" }),
      ).toBeVisible(),
    );
    await userEvent.click(dialog.getByRole("button", { name: "Request" }));
    const page = body(canvasElement);
    const contact = await waitFor(() => {
      const found = page.getByRole("dialog", { name: "Email Grade10" });
      expect(found).toBeVisible();
      return within(found);
    });
    expect(contact.getByText("support@grade10.com")).toBeVisible();
    expect(
      contact.getByRole("button", { name: "Open Mail App" }),
    ).toBeVisible();
    expect(contact.getByRole("button", { name: "Copy Message" })).toBeVisible();
  },
};

/** On-file bank — paperwork captured in store: HKD only, no add or overseas. */
export const OnFileBank: Story = {
  parameters: {
    verification: { caseId: "vc_2d2a84d8-c12f-4c05-9f41-3051c7c5d04e" },
  },
  args: { flow: "prelinked", payoutMethods: [PAYOUT_METHODS[0]] },
  play: async ({ canvasElement }) => {
    const dialog = await openDialog(canvasElement);
    await waitFor(() =>
      expect(
        dialog.getByRole("heading", { name: "Withdraw Earnings" }),
      ).toBeVisible(),
    );
    expect(dialog.queryByText("Receive in")).toBeNull();
    expect(dialog.queryByText("US Dollar")).toBeNull();
  },
};

/** Step 3 — the review names the converted amount and the destination. */
export const Review: Story = {
  parameters: {
    verification: { caseId: "vc_46d9b1cd-2e36-40a7-88e6-3ab58a08fc55" },
  },
  args: { payoutMethods: PAYOUT_METHODS },
  play: async ({ canvasElement }) => {
    const dialog = await openDialog(canvasElement);
    await enterMaxAndContinue(dialog);
    await waitFor(() =>
      expect(
        dialog.getByRole("heading", { name: "Withdrawal Destination" }),
      ).toBeVisible(),
    );
    await userEvent.click(dialog.getByRole("button", { name: "Continue" }));
    await waitFor(() =>
      expect(
        dialog.getByRole("heading", { name: "Review Withdrawal" }),
      ).toBeVisible(),
    );
    expect(dialog.getByText(/HK\$1,248/)).toBeVisible();
    expect(dialog.getByText("HSBC")).toBeVisible();
    expect(dialog.getByText("123-456-8304")).toBeVisible();
    expect(
      dialog.getByRole("button", { name: "Submit Request" }),
    ).toBeVisible();
  },
};

/** Submitted — the request lands as Pending on the portfolio. */
export const Submitted: Story = {
  parameters: {
    verification: { caseId: "vc_4526f079-757d-47b2-b8ba-504d72c394bd" },
  },
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
      expect(dialog.getByText("Withdrawal Requested")).toBeVisible(),
    );
    expect(dialog.getByText("Withdrawal requested")).toBeVisible();
    expect(dialog.getByText("Grade10 review")).toBeVisible();
    expect(dialog.getByText("Transfer sent")).toBeVisible();
    expect(
      dialog.getByRole("button", { name: "View Withdrawal" }),
    ).toBeVisible();
    expect(dialog.getByRole("button", { name: "Done" })).toBeVisible();
  },
};

/** 390px phone — the amount field and steps keep their full width. */
export const Narrow: Story = {
  parameters: {
    verification: { caseId: "vc_287b68c3-466b-4565-a0ea-f8797ff0542a" },
  },
  args: { payoutMethods: PAYOUT_METHODS },
  globals: { viewport: { value: "mobile1" } },
  play: async ({ canvasElement }) => {
    const dialog = await openDialog(canvasElement);
    expect(
      dialog.getByRole("heading", { name: "Withdraw Earnings" }),
    ).toBeVisible();
  },
};
