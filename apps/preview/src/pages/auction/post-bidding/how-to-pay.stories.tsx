import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { WINNER_ORDER_BANK_DETAILS } from "./winner-order-bank-details";
import { WINNER_ORDER_INVOICE_ID } from "./winner-order-contact-mail";
import {
  OUR_NOTE,
  REFERENCE_WARNING,
  WinnerOrderHowToPayDialog,
} from "./winner-order-how-to-pay-dialog";

type HowToPayDemoProps = {
  onOpenChange?: (open: boolean) => void;
  invoiceId?: string;
  settlementCurrency?: "USD" | "HKD";
  paymentRail?: "fps" | "hk_local" | "swift";
};

function HowToPayDemo({
  onOpenChange = fn(),
  invoiceId = WINNER_ORDER_INVOICE_ID,
  settlementCurrency = "HKD",
  paymentRail = "fps",
}: HowToPayDemoProps) {
  const [open, setOpen] = useState(false);

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
        amountDue={
          settlementCurrency === "USD"
            ? WINNER_ORDER_BANK_DETAILS.usdTotalAmountDue
            : WINNER_ORDER_BANK_DETAILS.totalAmountDue
        }
        invoiceId={invoiceId}
        onOpenChange={(next) => {
          setOpen(next);
          onOpenChange(next);
        }}
        open={open}
        paymentRail={paymentRail}
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
          "Standalone Storybook preview of Winner Order View Bank Details. It shows only the rail chosen for the invoice, with the amount due, payment reference and the selected rail's details.",
      },
    },
  },
  args: {
    invoiceId: WINNER_ORDER_INVOICE_ID,
    settlementCurrency: "HKD",
    paymentRail: "fps",
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

async function openBankDetails(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }));
}

/** HKD invoice — FPS default, QR, reference at bottom; no Copy controls. */
export const HkdFpsRail: Story = {
  parameters: {
    verification: { caseId: "vc_1bced522-d071-4dc7-a77c-42496b3e87e2" },
  },
  name: "HKD — FPS rail",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await openBankDetails(canvasElement);
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
    expect(modal.queryByRole("tab")).not.toBeInTheDocument();
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
  parameters: {
    verification: { caseId: "vc_3f64b404-9ddf-45bb-946b-71a430d53364" },
  },
  name: "HKD — Hong Kong rail",
  args: { settlementCurrency: "HKD", paymentRail: "hk_local" },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await openBankDetails(canvasElement);
    const dialog = await findVisibleDialog(page, "View Bank Details");
    const modal = within(dialog);
    expect(modal.queryByRole("tab")).not.toBeInTheDocument();
    expect(
      modal.queryByRole("img", { name: /FPS QR/ }),
    ).not.toBeInTheDocument();
    expect(modal.queryByText("FPS ID")).not.toBeInTheDocument();
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

/** USD invoice — one HK Local bank rail, without FPS or SWIFT details. */
export const UsdRails: Story = {
  parameters: {
    verification: { caseId: "vc_62f395d7-0b83-44e3-87a2-f45e6e069bba" },
  },
  name: "USD — HK Local rail",
  args: { settlementCurrency: "USD", paymentRail: "hk_local" },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await openBankDetails(canvasElement);
    const dialog = await findVisibleDialog(page, "View Bank Details");
    const modal = within(dialog);
    expect(modal.queryByRole("tab")).not.toBeInTheDocument();
    expect(modal.getByText("US$16,340.00")).toBeVisible();
    expect(modal.getByText("Branch code")).toBeVisible();
    expect(modal.queryByText("SWIFT / BIC")).not.toBeInTheDocument();
    expect(modal.queryByText("FPS ID")).not.toBeInTheDocument();
  },
};

/** USD invoice — the selected SWIFT rail shows only international details. */
export const UsdInternationalRail: Story = {
  parameters: {
    verification: { caseId: "vc_7cdc4d54-2f9a-4c8c-a79f-d92b3255c8dc" },
  },
  name: "USD — International rail",
  args: { settlementCurrency: "USD", paymentRail: "swift" },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await openBankDetails(canvasElement);
    const dialog = await findVisibleDialog(page, "View Bank Details");
    const modal = within(dialog);
    expect(modal.queryByRole("tab")).not.toBeInTheDocument();
    expect(modal.getByRole("alert")).toBeVisible();
    expect(
      modal.getByText(WINNER_ORDER_BANK_DETAILS.beneficiaryAddress),
    ).toBeVisible();
    expect(
      modal.getByText(WINNER_ORDER_BANK_DETAILS.transferReference),
    ).toBeVisible();
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
    expect(modal.queryByText("Branch code")).not.toBeInTheDocument();
    expect(modal.queryByText("FPS ID")).not.toBeInTheDocument();
  },
};
