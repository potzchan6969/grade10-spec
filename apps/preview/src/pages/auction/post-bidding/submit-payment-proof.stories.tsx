import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { Toast } from "@grade10/design-system/components/overlays/toast";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  PROOF_DIALOG_SUBTEXT,
  WINNER_ORDER_PROOF_FILE_HINT,
  WinnerOrderPaymentProofDialog,
} from "./winner-order-payment-proof-dialog";
import {
  PROOF_NOT_SUBMITTED_TOAST,
  PROOF_SUBMITTED_TOAST,
  toastProofSubmitted,
} from "./winner-order-proof-feedback";

type SubmitPaymentProofDemoProps = {
  onSubmit?: () => void;
  forceFailure?: boolean;
};

function SubmitPaymentProofDemo({
  onSubmit = fn(),
  forceFailure = false,
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
          Standalone preview of the proof dialog Winner Order opens from Submit
          Payment Proof. Rails live under View Bank Details; page wiring lives
          under My Auctions / Winner Order / Payment.
        </Text>
        {!open ? (
          <Button onClick={() => setOpen(true)} size="md">
            Open dialog
          </Button>
        ) : null}
        {submitted ? <Text size="sm">Proof submitted (preview).</Text> : null}
      </VStack>

      <WinnerOrderPaymentProofDialog
        forceFailure={forceFailure}
        onOpenChange={setOpen}
        onSubmit={() => {
          setSubmitted(true);
          toastProofSubmitted();
          onSubmit();
        }}
        open={open}
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
          "Standalone Storybook preview of Winner Order Submit Payment Proof — proof form only (no amount/reference chrome); multi-file dropzone (PDF, PNG, JPG, HEIC); irreversible-submit microcopy; success and failure toasts. Bank rails live under View Bank Details.",
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

async function fillProofForm(modal: ReturnType<typeof within>) {
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
  await waitFor(() => {
    expect(modal.getByText("transfer-receipt.pdf")).toBeVisible();
  });
}

/** Proof fields only — no amount/reference box or Proof of Payment heading. */
export const Form: Story = {
  name: "Form",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Submit Payment Proof");
    const modal = within(dialog);
    expect(modal.getByText(PROOF_DIALOG_SUBTEXT)).toBeVisible();
    expect(modal.queryByText("Total Amount Due")).not.toBeInTheDocument();
    expect(
      modal.queryByText("Required Transfer Reference"),
    ).not.toBeInTheDocument();
    expect(
      modal.queryByText("Proof of Payment", { exact: true }),
    ).not.toBeInTheDocument();
    expect(modal.queryByRole("tab", { name: "FPS" })).not.toBeInTheDocument();
    expect(modal.getByLabelText("Sender Name")).toBeVisible();
    expect(modal.getByLabelText("Transfer Date")).toBeVisible();
    expect(modal.getByLabelText("Transaction Reference / ID")).toBeVisible();
    expect(modal.queryByText("Proof of Payment File")).not.toBeInTheDocument();
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

/** Required fields + one file → submit closes the dialog and toasts success. */
export const SubmitProof: Story = {
  name: "Submit proof",
  args: { onSubmit: fn() },
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body);
    const canvas = within(canvasElement);
    const dialog = await findVisibleDialog(page, "Submit Payment Proof");
    const modal = within(dialog);

    await fillProofForm(modal);

    await userEvent.click(
      modal.getByRole("button", { name: "Submit Payment Proof" }),
    );

    await waitFor(() => {
      expect(page.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(canvas.getByText("Proof submitted (preview).")).toBeVisible();
    await waitFor(() => {
      expect(page.getByText(PROOF_SUBMITTED_TOAST.title)).toBeVisible();
      expect(page.getByText(PROOF_SUBMITTED_TOAST.description)).toBeVisible();
    });
    expect(args.onSubmit).toHaveBeenCalled();
  },
};

/** Forced failure — dialog stays open, draft kept, failure toast. */
export const SubmitFailure: Story = {
  name: "Submit failure",
  args: { forceFailure: true, onSubmit: fn() },
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Submit Payment Proof");
    const modal = within(dialog);

    await fillProofForm(modal);

    await userEvent.click(
      modal.getByRole("button", { name: "Submit Payment Proof" }),
    );

    await waitFor(() => {
      expect(page.getByText(PROOF_NOT_SUBMITTED_TOAST.title)).toBeVisible();
      expect(
        page.getByText(PROOF_NOT_SUBMITTED_TOAST.description),
      ).toBeVisible();
    });
    expect(
      page.getByRole("dialog", { name: "Submit Payment Proof" }),
    ).toBeVisible();
    expect(modal.getByDisplayValue("Alex Chan")).toBeVisible();
    expect(modal.getByText("transfer-receipt.pdf")).toBeVisible();
    expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

/** A dirty, non-busy draft asks before leaving and stays open when declined. */
export const DirtyLeave: Story = {
  name: "Confirm dirty leave",
  args: { onSubmit: fn() },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Submit Payment Proof");
    const modal = within(dialog);
    await userEvent.type(modal.getByLabelText("Sender Name"), "Alex Chan");

    const originalConfirm = window.confirm;
    const confirmationMessages: string[] = [];
    window.confirm = (message?: string) => {
      confirmationMessages.push(message ?? "");
      return confirmationMessages.length > 1;
    };
    try {
      await userEvent.click(modal.getByRole("button", { name: "Cancel" }));
      expect(
        page.getByRole("dialog", { name: "Submit Payment Proof" }),
      ).toBeVisible();
      await userEvent.click(modal.getByRole("button", { name: "Cancel" }));
      await waitFor(() => {
        expect(page.queryByRole("dialog")).not.toBeInTheDocument();
      });
    } finally {
      window.confirm = originalConfirm;
    }

    expect(confirmationMessages).toEqual([
      "Leave without submitting? Your payment proof will not be saved.",
      "Leave without submitting? Your payment proof will not be saved.",
    ]);
  },
};

/** Submitting locks the form and blocks Cancel, Escape and overlay dismiss. */
export const SubmittingBusy: Story = {
  name: "Submitting",
  args: { onSubmit: fn() },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Submit Payment Proof");
    const modal = within(dialog);

    await fillProofForm(modal);
    await userEvent.click(
      modal.getByRole("button", { name: "Submit Payment Proof" }),
    );

    const cancel = modal.getByRole("button", { name: "Cancel" });
    expect(cancel).toBeDisabled();
    expect(modal.getByLabelText("Sender Name")).toBeDisabled();
    await userEvent.keyboard("{Escape}");
    const overlay = canvasElement.ownerDocument.querySelector(
      '[data-slot="dialog-overlay"]',
    );
    expect(overlay).toBeTruthy();
    await userEvent.click(overlay as HTMLElement);
    expect(
      page.getByRole("dialog", { name: "Submit Payment Proof" }),
    ).toBeVisible();
    await waitFor(() => {
      expect(page.queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
};

/** HEIC ingest enters its busy state and blocks leaving while conversion runs. */
export const ConvertingHeic: Story = {
  name: "Converting HEIC",
  args: { onSubmit: fn() },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Submit Payment Proof");
    const modal = within(dialog);
    const heic = new File(["preview-heic"], "transfer-receipt.heic", {
      type: "image/heic",
    });
    const fileInput = modal
      .getByRole("button", { name: "Choose Files" })
      .closest('[data-slot="file-dropzone"]')
      ?.querySelector('input[type="file"]');
    expect(fileInput).toBeTruthy();

    await userEvent.upload(fileInput as HTMLInputElement, heic);
    expect(modal.getByText("Converting HEIC…")).toBeVisible();
    expect(modal.getByRole("button", { name: "Cancel" })).toBeDisabled();
    await userEvent.keyboard("{Escape}");
    const overlay = canvasElement.ownerDocument.querySelector(
      '[data-slot="dialog-overlay"]',
    );
    expect(overlay).toBeTruthy();
    await userEvent.click(overlay as HTMLElement);
    expect(
      page.getByRole("dialog", { name: "Submit Payment Proof" }),
    ).toBeVisible();
    await waitFor(() => {
      expect(modal.queryByText("Converting HEIC…")).not.toBeInTheDocument();
    });
    const originalConfirm = window.confirm;
    window.confirm = () => true;
    try {
      await userEvent.click(modal.getByRole("button", { name: "Cancel" }));
      await waitFor(() => {
        expect(page.queryByRole("dialog")).not.toBeInTheDocument();
      });
    } finally {
      window.confirm = originalConfirm;
    }
  },
};
