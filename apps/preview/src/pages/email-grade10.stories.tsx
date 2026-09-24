import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, waitFor, within } from "storybook/test";
import { WinnerOrderContactDialog } from "./winner-order-contact-dialog";
import {
  type WinnerOrderContactMail,
  type WinnerOrderContactReason,
  WINNER_ORDER_INVOICE_ID,
  winnerOrderContactMail,
} from "./winner-order-contact-mail";
import {
  storyHref,
  WINNER_ORDER_EXPIRED_INVOICE_STORY_ID,
  WINNER_ORDER_EXPIRED_SETUP_STORY_ID,
  WINNER_ORDER_PARTIALLY_PAID_STORY_ID,
} from "./workbench-story-nav";

const LOT_TITLE = "1999 Pokémon Base Set Charizard PSA 9" as const;

type EmailGrade10DemoProps = {
  reason?: WinnerOrderContactReason;
  invoiceId?: string | null;
  receiptIds?: string[];
};

function mailFor({
  reason = "payment_overdue",
  invoiceId = WINNER_ORDER_INVOICE_ID,
  receiptIds = [],
}: EmailGrade10DemoProps): WinnerOrderContactMail {
  return winnerOrderContactMail({
    reason,
    lotTitle: LOT_TITLE,
    invoiceId: reason === "setup_overdue" ? null : invoiceId,
    receiptIds,
  });
}

function EmailGrade10Demo(props: EmailGrade10DemoProps) {
  const mail = mailFor(props);
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-svh w-full flex-col bg-background p-8">
      <VStack className="mx-auto w-full max-w-lg" gap="md" hAlign="start">
        <Text as="h2" className="text-xl font-semibold tracking-tight">
          Email Grade10
        </Text>
        <Text size="sm" tone="secondary">
          Standalone preview of the copy-first Contact Us dialog Winner Order
          opens from locked states. Page wiring lives on{" "}
          <Link href={storyHref(WINNER_ORDER_EXPIRED_SETUP_STORY_ID)} size="sm">
            Setup / Expired Setup
          </Link>
          ,{" "}
          <Link
            href={storyHref(WINNER_ORDER_EXPIRED_INVOICE_STORY_ID)}
            size="sm"
          >
            Payment / Expired Invoice
          </Link>
          , and{" "}
          <Link
            href={storyHref(WINNER_ORDER_PARTIALLY_PAID_STORY_ID)}
            size="sm"
          >
            Payment / Partially Paid
          </Link>
          .
        </Text>
        {!open ? (
          <Button onClick={() => setOpen(true)} size="md">
            Open dialog
          </Button>
        ) : null}
      </VStack>

      <WinnerOrderContactDialog
        mail={mail}
        onOpenChange={setOpen}
        open={open}
      />
    </div>
  );
}

const meta = {
  title: "My Auctions/Winner Order/Email Grade10",
  component: EmailGrade10Demo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Standalone Storybook preview of Winner Order Email Grade10 — copy-first Contact Us with To, Subject, editable Message, Open Mail App and Copy Message. Same dialog Expired Setup, Expired Invoice and Partially Paid open from Contact Us.",
      },
    },
  },
  args: {
    reason: "payment_overdue",
    invoiceId: WINNER_ORDER_INVOICE_ID,
  },
} satisfies Meta<typeof EmailGrade10Demo>;

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

/** Payment deadline passed — subject and body quote the invoice ID. */
export const PaymentOverdue: Story = {
  name: "Payment Overdue",
  args: { reason: "payment_overdue" },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Email Grade10");
    const modal = within(dialog);
    expect(modal.getByText("support@grade10.com")).toBeVisible();
    expect(
      modal.getByText(`Auction order ${WINNER_ORDER_INVOICE_ID}: payment overdue`),
    ).toBeVisible();
    const message = (modal.getByLabelText("Message") as HTMLTextAreaElement)
      .value;
    expect(message).toContain(`Invoice: ${WINNER_ORDER_INVOICE_ID}`);
    expect(modal.getByRole("button", { name: "Copy Message" })).toBeVisible();
    expect(
      modal.getByRole("button", { name: "Open Mail App" }),
    ).toHaveAttribute(
      "href",
      expect.stringMatching(/^mailto:support@grade10\.com\?subject=/),
    );
  },
};

/** Setup deadline passed — no invoice yet; subject quotes the lot title. */
export const SetupOverdue: Story = {
  name: "Setup Overdue",
  args: { reason: "setup_overdue", invoiceId: null },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Email Grade10");
    const modal = within(dialog);
    expect(
      modal.getByText(`Auction lot ${LOT_TITLE}: setup overdue`),
    ).toBeVisible();
    const message = (modal.getByLabelText("Message") as HTMLTextAreaElement)
      .value;
    expect(message).not.toContain("Invoice:");
    expect(message).toContain(`Lot: ${LOT_TITLE}`);
  },
};

/** Partially paid — invoice ID plus receipt IDs in the message body. */
export const PartialPayment: Story = {
  name: "Partial Payment",
  args: {
    reason: "partial_payment",
    receiptIds: ["REC-202609-LK7P2Q-01-P1", "REC-202609-LK7P2Q-01-P2"],
  },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Email Grade10");
    const modal = within(dialog);
    expect(
      modal.getByText(`Auction order ${WINNER_ORDER_INVOICE_ID}: partial payment`),
    ).toBeVisible();
    const message = (modal.getByLabelText("Message") as HTMLTextAreaElement)
      .value;
    expect(message).toContain(
      "Receipts: REC-202609-LK7P2Q-01-P1, REC-202609-LK7P2Q-01-P2",
    );
  },
};
