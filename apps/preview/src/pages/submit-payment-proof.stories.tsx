import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { Toast, toast } from "@grade10/design-system/components/overlays/toast";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  WINNER_ORDER_BANK_DETAILS,
  WINNER_ORDER_PROOF_FILE_HINT,
  WinnerOrderPaymentProofDialog,
} from "./winner-order-payment-proof-dialog";

type SubmitPaymentProofDemoProps = {
  onSubmit?: () => void;
};

function SubmitPaymentProofDemo({
  onSubmit = fn(),
}: SubmitPaymentProofDemoProps) {
  const [open, setOpen] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="flex min-h-svh w-full flex-col bg-background p-8">
      <VStack className="mx-auto w-full max-w-lg" gap="md" hAlign="start">
        <Text as="h2" className="text-xl font-semibold tracking-tight">
          Submit Payment Proof
        </Text>
        <Text size="sm" tone="secondary">
          Standalone preview of the bank-transfer proof dialog Winner Order
          opens from Pending Payment. Page wiring and the verifying toast live
          under My Auctions / Winner Order / Payment.
        </Text>
        {!open ? (
          <Button onClick={() => setOpen(true)} size="md">
            Open dialog
          </Button>
        ) : null}
        {submitted ? (
          <Text size="sm">Proof submitted (preview).</Text>
        ) : null}
      </VStack>

      <WinnerOrderPaymentProofDialog
        amountDue={WINNER_ORDER_BANK_DETAILS.totalAmountDue}
        onOpenChange={setOpen}
        onSubmit={() => {
          setSubmitted(true);
          onSubmit();
        }}
        open={open}
        transferReference={WINNER_ORDER_BANK_DETAILS.transferReference}
      />
      <Toast position="bottom-right" />
    </div>
  );
}

const meta = {
  title: "My Auctions/Winner Order/Payment/Submit Payment Proof",
  component: SubmitPaymentProofDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Standalone Storybook preview of Winner Order Submit Payment Proof — bank details with copy for account, amount, and reference; multi-file dropzone (PDF, PNG, JPG, HEIC); and confirm microcopy. Same dialog the Pending Payment (bank) page opens.",
      },
    },
  },
} satisfies Meta<typeof SubmitPaymentProofDemo>;

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

/** Bank details, reference copy, proof fields, confirm microcopy. */
export const Form: Story = {
  name: "Form",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Submit Payment Proof");
    const modal = within(dialog);
    expect(
      modal.getByText("Pay the amount due, then upload your receipt."),
    ).toBeVisible();
    expect(modal.getByText("Bank Details")).toBeVisible();
    expect(modal.getByText("Required Transfer Reference")).toBeVisible();
    expect(
      modal.getByRole("button", { name: "Copy account number" }),
    ).toBeVisible();
    expect(
      modal.getByRole("button", { name: "Copy amount due" }),
    ).toBeVisible();
    expect(
      modal.getByRole("button", { name: "Copy transfer reference" }),
    ).toBeVisible();
    expect(modal.getByLabelText("Sender Name")).toBeVisible();
    expect(modal.getByLabelText("Transfer Date")).toBeVisible();
    expect(modal.getByLabelText("Transaction Reference / ID")).toBeVisible();
    expect(modal.getByText("Proof of Payment File")).toBeVisible();
    expect(modal.getByText(WINNER_ORDER_PROOF_FILE_HINT)).toBeVisible();
    expect(modal.getByRole("button", { name: "Choose Files" })).toBeVisible();
    expect(modal.getByLabelText("Additional Notes (optional)")).toBeVisible();
    expect(
      modal.getByText("You can’t add or change files after you submit."),
    ).toBeVisible();
    expect(
      modal.getByRole("button", { name: "Submit Payment Proof" }),
    ).toBeVisible();
  },
};

/** Copy amount due → success toast + check icon (clipboard mocked for Storybook). */
export const CopyAmountDue: Story = {
  name: "Copy amount due",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    toast.dismiss();

    const writeText = fn(async () => undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    const dialog = await findVisibleDialog(page, "Submit Payment Proof");
    const modal = within(dialog);
    await userEvent.click(
      modal.getByRole("button", { name: "Copy amount due" }),
    );

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(
        WINNER_ORDER_BANK_DETAILS.totalAmountDue,
      );
      expect(page.getByText("Amount due copied")).toBeVisible();
    });
    expect(
      modal.getByRole("button", { name: "Amount due copied" }),
    ).toBeVisible();
  },
};

/** Copy reference → success toast + check icon (clipboard mocked for Storybook). */
export const CopyReference: Story = {
  name: "Copy reference",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    toast.dismiss();

    const writeText = fn(async () => undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    const dialog = await findVisibleDialog(page, "Submit Payment Proof");
    const modal = within(dialog);
    await userEvent.click(
      modal.getByRole("button", { name: "Copy transfer reference" }),
    );

    await waitFor(() => {
      expect(writeText).toHaveBeenCalled();
      expect(page.getByText("Reference copied")).toBeVisible();
    });
    expect(
      modal.getByRole("button", { name: "Reference copied" }),
    ).toBeVisible();
    expect(
      page.queryByText("Copy the reference manually"),
    ).not.toBeInTheDocument();
  },
};

/** Required fields + one file → submit closes the dialog. */
export const SubmitProof: Story = {
  name: "Submit proof",
  args: { onSubmit: fn() },
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body);
    const canvas = within(canvasElement);
    const dialog = await findVisibleDialog(page, "Submit Payment Proof");
    const modal = within(dialog);

    await userEvent.type(modal.getByLabelText("Sender Name"), "Alex Chan");
    const transferDate = modal.getByLabelText("Transfer Date");
    Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )?.set?.call(transferDate, "2026-09-20");
    transferDate.dispatchEvent(new Event("input", { bubbles: true }));
    transferDate.dispatchEvent(new Event("change", { bubbles: true }));
    await userEvent.type(
      modal.getByLabelText("Transaction Reference / ID"),
      "TXN-998877",
    );
    const file = new File(["preview-proof"], "transfer-receipt.pdf", {
      type: "application/pdf",
    });
    const fileInput = modal
      .getByRole("button", { name: "Choose Files" })
      .closest('[data-slot="file-dropzone"]')
      ?.querySelector('input[type="file"]');
    expect(fileInput).toBeTruthy();
    await userEvent.upload(fileInput as HTMLInputElement, file);
    expect(modal.getByText("transfer-receipt.pdf")).toBeVisible();

    await userEvent.click(
      modal.getByRole("button", { name: "Submit Payment Proof" }),
    );

    await waitFor(() => {
      expect(page.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(canvas.getByText("Proof submitted (preview).")).toBeVisible();
    expect(args.onSubmit).toHaveBeenCalled();
  },
};
