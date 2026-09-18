import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, waitFor, within } from "storybook/test";
import {
  WINNER_ORDER_REFUND_CLOSING,
  WINNER_ORDER_REFUND_OVERPAID,
} from "./winner-order-content";
import {
  WinnerOrderRefundDialog,
  type WinnerOrderRefundDetails,
} from "./winner-order-refund-dialog";
import {
  WINNER_ORDER_REFUNDED_STORY_ID,
  storyHref,
} from "./workbench-story-nav";

type RefundDetailsDemoProps = {
  refund?: WinnerOrderRefundDetails;
};

function RefundDetailsDemo({
  refund = WINNER_ORDER_REFUND_CLOSING,
}: RefundDetailsDemoProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-svh w-full flex-col bg-background p-8">
      <VStack className="mx-auto w-full max-w-lg" gap="md" hAlign="start">
        <Text as="h2" className="text-xl font-semibold tracking-tight">
          Refund Details
        </Text>
        <Text size="sm" tone="secondary">
          Standalone preview of the refund dialog Winner Order opens from the
          inline alert below Order Total. Page wiring lives on{" "}
          <Link href={storyHref(WINNER_ORDER_REFUNDED_STORY_ID)} size="sm">
            My Auctions / Winner Order / Closed / Refunded
          </Link>
          .
        </Text>
        {!open ? (
          <Button onClick={() => setOpen(true)} size="md">
            Open dialog
          </Button>
        ) : null}
      </VStack>

      <WinnerOrderRefundDialog
        onOpenChange={setOpen}
        open={open}
        refund={refund}
      />
    </div>
  );
}

const meta = {
  title: "My Auctions/Winner Order/Refund Details",
  component: RefundDetailsDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Standalone Storybook preview of Winner Order Refund Details — amount, reason, note, and refund method. Same dialog the Refunded and overpaid pages open from the inline alert.",
      },
    },
  },
} satisfies Meta<typeof RefundDetailsDemo>;

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

/** Closing refund — full amount returned. */
export const ClosingRefund: Story = {
  name: "Closing Refund",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Refund Details");
    const modal = within(dialog);
    expect(modal.getByText("Amount")).toBeVisible();
    expect(modal.getByText("HK$15,660")).toBeVisible();
    expect(modal.getByText("Reason")).toBeVisible();
    expect(modal.getByText("Not as described")).toBeVisible();
    expect(modal.getByText("Note")).toBeVisible();
    expect(
      modal.getByText(
        "Card condition did not match the listing photos. Full amount returned.",
      ),
    ).toBeVisible();
    expect(modal.getByText("Refund Method")).toBeVisible();
    expect(modal.getByText("Card")).toBeVisible();
    expect(modal.getByRole("button", { name: "Close" })).toBeVisible();
  },
};

/** Overpayment — difference only. */
export const Overpaid: Story = {
  name: "Overpaid",
  args: { refund: WINNER_ORDER_REFUND_OVERPAID },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Refund Details");
    const modal = within(dialog);
    expect(modal.getByText("HK$500")).toBeVisible();
    expect(modal.getByText("Duplicate or overpayment")).toBeVisible();
    expect(modal.getByText("Bank transfer")).toBeVisible();
    expect(modal.getByRole("button", { name: "Close" })).toBeVisible();
  },
};
