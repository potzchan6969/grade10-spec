import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { WINNER_ORDER_INVOICE_ID } from "./winner-order-contact-mail";
import {
  OUR_NOTE,
  REFERENCE_WARNING,
  WinnerOrderHowToPayDialog,
} from "./winner-order-how-to-pay-dialog";
import { WINNER_ORDER_BANK_DETAILS } from "./winner-order-payment-proof-dialog";

type HowToPayDemoProps = {
  onOpenChange?: (open: boolean) => void;
  invoiceId?: string;
  settlementCurrency?: "USD" | "HKD";
};

function HowToPayDemo({
  onOpenChange = fn(),
  invoiceId = WINNER_ORDER_INVOICE_ID,
  settlementCurrency = "HKD",
}: HowToPayDemoProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-svh w-full flex-col bg-background p-8">
      <VStack className="mx-auto w-full max-w-lg" gap="md" hAlign="start">
        <Text as="h2" className="text-xl font-semibold tracking-tight">
          View Bank Details
        </Text>
        <Text size="sm" tone="secondary">
          Standalone preview of the bank-transfer rails dialog Winner Order
          opens from Order summary → View Bank Details. DialogSubtext is the
          invoice ID; the payment-reference band is the listing code.
        </Text>
        {!open ? (
          <Button onClick={() => setOpen(true)} size="md">
            Open dialog
          </Button>
        ) : null}
      </VStack>

      <WinnerOrderHowToPayDialog
        amountDue={WINNER_ORDER_BANK_DETAILS.totalAmountDue}
        invoiceId={invoiceId}
        onOpenChange={(next) => {
          setOpen(next);
          onOpenChange(next);
        }}
        open={open}
        settlementCurrency={settlementCurrency}
        transferReference={WINNER_ORDER_BANK_DETAILS.transferReference}
      />
    </div>
  );
}

const meta = {
  title: "Auction/Post Bidding/Screens/Winner Order/Payment/View Bank Details",
  component: HowToPayDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Standalone Storybook preview of Winner Order View Bank Details — invoice ID as DialogSubtext, amount due, FPS (QR + manual fields), Hong Kong / International rails, payment reference band (listing code), OUR note on SWIFT; panels scroll inside the dialog.",
      },
    },
  },
  args: {
    invoiceId: WINNER_ORDER_INVOICE_ID,
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

/** HKD invoice — FPS default, QR, reference at bottom; no Copy controls. */
export const HkdFpsRail: Story = {
  name: "HKD — FPS rail",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "View Bank Details");
    const modal = within(dialog);
    expect(
      modal.getByText(`Invoice: ${WINNER_ORDER_INVOICE_ID}`),
    ).toBeVisible();
    expect(
      modal.queryByText("Choose a transfer method and use the details below."),
    ).not.toBeInTheDocument();
    expect(
      modal.getByText(WINNER_ORDER_BANK_DETAILS.totalAmountDue),
    ).toBeVisible();
    expect(
      modal.queryByRole("button", { name: /Copy/i }),
    ).not.toBeInTheDocument();
    expect(
      modal.getByRole("tab", { name: "FPS", selected: true }),
    ).toBeVisible();
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

/** HKD invoice — Hong Kong rail shows branch code. */
export const HkdHongKongRail: Story = {
  name: "HKD — Hong Kong rail",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "View Bank Details");
    const modal = within(dialog);
    await userEvent.click(modal.getByRole("tab", { name: "Hong Kong" }));
    await waitFor(() => {
      expect(modal.getByText("Branch code")).toBeVisible();
      expect(
        modal.getByText(WINNER_ORDER_BANK_DETAILS.transferReference),
      ).toBeVisible();
    });
    expect(modal.getAllByText("Payment reference").length).toBeGreaterThan(0);
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

/** HKD invoice — FPS + Hong Kong, no International rail; FPS first. */
export const HkdRails: Story = {
  name: "HKD — FPS + Hong Kong",
  args: { settlementCurrency: "HKD" },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "View Bank Details");
    const modal = within(dialog);
    expect(
      modal.getByRole("tab", { name: "FPS", selected: true }),
    ).toBeVisible();
    expect(modal.getByRole("tab", { name: "Hong Kong" })).toBeVisible();
    expect(
      modal.queryByRole("tab", { name: "International" }),
    ).not.toBeInTheDocument();
    expect(modal.getByText("FPS ID")).toBeVisible();
  },
};

/** USD invoice — Hong Kong + International (SWIFT), no FPS; Hong Kong first. */
export const UsdRails: Story = {
  name: "USD — Hong Kong + International",
  args: { settlementCurrency: "USD" },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "View Bank Details");
    const modal = within(dialog);
    expect(modal.queryByRole("tab", { name: "FPS" })).not.toBeInTheDocument();
    expect(
      modal.getByRole("tab", { name: "Hong Kong", selected: true }),
    ).toBeVisible();
    expect(modal.getByRole("tab", { name: "International" })).toBeVisible();
    // Hong Kong panel shows by default; SWIFT field coverage lives in SWIFT tab.
    expect(modal.getByText("Branch code")).toBeVisible();
  },
};

/** USD invoice — International rail shows SWIFT fields and the OUR note. */
export const UsdInternationalRail: Story = {
  name: "USD — International rail",
  args: { settlementCurrency: "USD" },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "View Bank Details");
    const modal = within(dialog);
    await userEvent.click(modal.getByRole("tab", { name: "International" }));
    await waitFor(() => {
      expect(modal.getByRole("alert")).toBeVisible();
      expect(
        modal.getByText(WINNER_ORDER_BANK_DETAILS.beneficiaryAddress),
      ).toBeVisible();
      expect(
        modal.getByText(WINNER_ORDER_BANK_DETAILS.transferReference),
      ).toBeVisible();
    });
    expect(modal.getAllByText("Payment reference").length).toBeGreaterThan(0);
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
    expect(
      modal.getByText(WINNER_ORDER_BANK_DETAILS.bankAddress),
    ).toBeVisible();
    expect(
      modal.getByText(WINNER_ORDER_BANK_DETAILS.accountNumber),
    ).toBeVisible();
    expect(modal.getByRole("alert")).toHaveTextContent(OUR_NOTE);
  },
};
