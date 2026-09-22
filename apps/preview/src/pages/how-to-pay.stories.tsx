import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  OUR_NOTE,
  REFERENCE_WARNING,
  WinnerOrderHowToPayDialog,
} from "./winner-order-how-to-pay-dialog";
import { WINNER_ORDER_BANK_DETAILS } from "./winner-order-payment-proof-dialog";

type HowToPayDemoProps = {
  onOpenChange?: (open: boolean) => void;
};

function HowToPayDemo({ onOpenChange = fn() }: HowToPayDemoProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-svh w-full flex-col bg-background p-8">
      <VStack className="mx-auto w-full max-w-lg" gap="md" hAlign="start">
        <Text as="h2" className="text-xl font-semibold tracking-tight">
          View Bank Details
        </Text>
        <Text size="sm" tone="secondary">
          Standalone preview of the bank-transfer rails dialog Winner Order
          opens from Order summary → View Bank Details.
        </Text>
        {!open ? (
          <Button onClick={() => setOpen(true)} size="md">
            Open dialog
          </Button>
        ) : null}
      </VStack>

      <WinnerOrderHowToPayDialog
        amountDue={WINNER_ORDER_BANK_DETAILS.totalAmountDue}
        onOpenChange={(next) => {
          setOpen(next);
          onOpenChange(next);
        }}
        open={open}
        transferReference={WINNER_ORDER_BANK_DETAILS.transferReference}
      />
    </div>
  );
}

const meta = {
  title: "My Auctions/Winner Order/Payment/View Bank Details",
  component: HowToPayDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Standalone Storybook preview of Winner Order View Bank Details — amount due, FPS (QR + manual fields), HK Local / International rails, payment reference band, OUR note on SWIFT; panels scroll inside the dialog.",
      },
    },
  },
} satisfies Meta<typeof HowToPayDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

async function findVisibleDialog(
  page: ReturnType<typeof within>,
  name: string | RegExp,
) {
  return waitFor(() => {
    const dialog = page.getByRole("dialog", { name });
    expect(dialog).toBeVisible();
    return dialog;
  });
}

/** Amount, FPS default, QR, reference at bottom — no Copy controls. */
export const Form: Story = {
  name: "Form",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "View Bank Details");
    const modal = within(dialog);
    expect(modal.getByText(WINNER_ORDER_BANK_DETAILS.totalAmountDue)).toBeVisible();
    expect(modal.queryByRole("button", { name: /Copy/i })).not.toBeInTheDocument();
    expect(modal.getByRole("tab", { name: "FPS", selected: true })).toBeVisible();
    expect(
      modal.getByRole("img", { name: "FPS QR code for Grade10" }),
    ).toBeVisible();
    expect(modal.getByText("FPS ID")).toBeVisible();
    expect(
      modal.getByText("Open your banking app and scan this QR"),
    ).toBeVisible();
    expect(modal.queryByText("Scan to pay")).not.toBeInTheDocument();
    expect(modal.queryByText("Or enter manually")).not.toBeInTheDocument();
    expect(
      modal.getByText(WINNER_ORDER_BANK_DETAILS.transferReference),
    ).toBeVisible();
    expect(modal.getByText(REFERENCE_WARNING)).toBeVisible();
    expect(modal.getByRole("button", { name: "Done" })).toBeVisible();
  },
};

/** HK Local shows branch code. */
export const HkLocalTab: Story = {
  name: "HK Local tab",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "View Bank Details");
    const modal = within(dialog);
    await userEvent.click(modal.getByRole("tab", { name: "HK Local" }));
    expect(modal.getByText("Payment reference")).toBeVisible();
    expect(
      modal.getByText(WINNER_ORDER_BANK_DETAILS.transferReference),
    ).toBeVisible();
    expect(modal.getByText("Bank code")).toBeVisible();
    expect(modal.getByText(WINNER_ORDER_BANK_DETAILS.bankCode)).toBeVisible();
    expect(modal.getByText("Branch code")).toBeVisible();
    expect(modal.getByText(WINNER_ORDER_BANK_DETAILS.branchCode)).toBeVisible();
    expect(modal.getByText("Account number")).toBeVisible();
    expect(
      modal.getByText(WINNER_ORDER_BANK_DETAILS.accountNumber),
    ).toBeVisible();
    expect(modal.getByText(WINNER_ORDER_BANK_DETAILS.bankName)).toBeVisible();
  },
};

/** SWIFT shows OUR note. */
export const SwiftTab: Story = {
  name: "SWIFT tab",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "View Bank Details");
    const modal = within(dialog);
    await userEvent.click(modal.getByRole("tab", { name: "International" }));
    expect(modal.getByText("Payment reference")).toBeVisible();
    expect(
      modal.getByText(WINNER_ORDER_BANK_DETAILS.transferReference),
    ).toBeVisible();
    expect(modal.getByText("Beneficiary address")).toBeVisible();
    expect(
      modal.getByText(WINNER_ORDER_BANK_DETAILS.beneficiaryAddress),
    ).toBeVisible();
    expect(modal.getByText("Bank name")).toBeVisible();
    expect(modal.getByText(WINNER_ORDER_BANK_DETAILS.bankName)).toBeVisible();
    expect(modal.getByText("Bank address")).toBeVisible();
    expect(modal.getByText(WINNER_ORDER_BANK_DETAILS.bankAddress)).toBeVisible();
    expect(
      modal.getByText(WINNER_ORDER_BANK_DETAILS.accountNumber),
    ).toBeVisible();
    expect(modal.getByRole("alert")).toHaveTextContent(OUR_NOTE);
  },
};
