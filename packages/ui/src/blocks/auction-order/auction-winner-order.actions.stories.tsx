import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { AuctionWinnerOrder } from "./auction-winner-order";
import { BASE_ARGS, settled } from "./auction-winner-order.story-fixtures";

const meta = {
  title: "Auction/Post Bidding/Blocks/AuctionWinnerOrder/Actions",
  component: AuctionWinnerOrder,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: BASE_ARGS,
} satisfies Meta<typeof AuctionWinnerOrder>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A returned payment proof explains itself in the alert's description. */
export const AlertActionRefused: Story = {
  args: {
    alerts: [
      {
        title: "Payment proof returned",
        description: "The upload didn't go through. Try again.",
        status: "warning",
        role: "status",
        layout: "inline",
        action: {
          label: "Upload",
          onPress: fn(),
        },
      },
    ],
  },
  play: async ({ args, canvasElement }) => {
    await settled(canvasElement);
    const canvas = within(canvasElement);
    expect(canvas.getByRole("status")).toHaveTextContent(
      "The upload didn't go through. Try again.",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Upload" }));
    expect(args.alerts?.[0]?.action?.onPress).toHaveBeenCalledTimes(1);
  },
};

export const AlertActionPending: Story = {
  args: {
    alerts: [
      {
        title: "Payment proof returned",
        status: "warning",
        role: "status",
        action: { label: "Upload", onPress: fn(), pending: true },
      },
    ],
  },
  play: async ({ args, canvasElement }) => {
    await settled(canvasElement);
    const action = within(canvasElement).getByRole("button", {
      name: "Upload",
    });
    expect(action).toHaveAttribute("aria-busy", "true");
    action.click();
    expect(args.alerts?.[0]?.action?.onPress).not.toHaveBeenCalled();
  },
};

/** The invoice link stays focusable while its PDF opens, and says when it can't. */
export const InvoicePdfPending: Story = {
  args: {
    summary: {
      ...BASE_ARGS.summary,
      invoicePdf: { onOpen: fn(), pending: true },
    },
  },
  play: async ({ args, canvasElement }) => {
    await settled(canvasElement);
    const link = within(canvasElement).getByRole("link", {
      name: "Invoice PDF",
    });
    expect(link).toHaveAttribute("aria-busy", "true");
    link.focus();
    expect(link).toHaveFocus();
    await userEvent.click(link);
    expect(args.summary.invoicePdf?.onOpen).not.toHaveBeenCalled();
  },
};

export const InvoicePdfRefused: Story = {
  args: {
    summary: {
      ...BASE_ARGS.summary,
      invoicePdf: {
        onOpen: fn(),
        failed: "The invoice couldn't open. Try again.",
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    await settled(canvasElement);
    const canvas = within(canvasElement);
    expect(canvas.getByRole("alert")).toHaveTextContent(
      "The invoice couldn't open. Try again.",
    );
    await userEvent.click(canvas.getByRole("link", { name: "Invoice PDF" }));
    expect(args.summary.invoicePdf?.onOpen).toHaveBeenCalledTimes(1);
  },
};
