import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, screen, userEvent } from "storybook/test";
import { CANCEL_PANEL_COPY, REFUND_DUE, REFUND_KEPT } from "./fixtures";
import type { VisitCancelReason } from "./types";
import {
  VisitCancelPanel,
  type VisitCancelPanelProps,
} from "./visit-cancel-panel";

/** The panel with its reason held the way a consumer holds it. */
function Held(props: VisitCancelPanelProps) {
  const [reason, setReason] = useState<VisitCancelReason | null>(props.reason);
  const [more, setMore] = useState(props.more);
  return (
    <VisitCancelPanel
      {...props}
      more={more}
      onMoreChange={setMore}
      onReasonChange={setReason}
      reason={reason}
    />
  );
}

const meta = {
  title: "Appointment/Visit/Blocks/VisitCancelPanel",
  component: VisitCancelPanel,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  render: (args) => <Held {...args} />,
  args: {
    copy: CANCEL_PANEL_COPY,
    reason: null,
    more: "",
    pending: false,
    onReasonChange: fn(),
    onMoreChange: fn(),
    onConfirm: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof VisitCancelPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The reason is optional; Something else asks for the collector's words. */
export const Default: Story = {
  play: async ({ args }) => {
    const canvas = screen;
    expect(
      await canvas.findByRole("dialog", { name: "Cancel your visit?" }),
    ).toBeVisible();
    expect(canvas.queryByLabelText("Tell us more (optional)")).toBeNull();
    await userEvent.click(
      canvas.getByRole("radio", { name: "Something else" }),
    );
    expect(canvas.getByLabelText("Tell us more (optional)")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Cancel visit" }));
    expect(args.onConfirm).toHaveBeenCalledTimes(1);
  },
};

export const Cancelling: Story = {
  args: { reason: "wrong", pending: true },
  play: async () => {
    expect(
      await screen.findByRole("button", { name: "Cancelling…" }),
    ).toBeDisabled();
  },
};

export const Failed: Story = {
  args: { error: "We couldn’t cancel the visit. Try again." },
  play: async () => {
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "We couldn’t cancel the visit. Try again.",
    );
  },
};

/** Paid, a day or more ahead: the deposit goes back to the card. */
export const Refunded: Story = {
  args: { refund: REFUND_DUE },
  play: async () => {
    expect(await screen.findByText("Refunded")).toBeVisible();
  },
};

/** Paid, under a day ahead: the deposit is kept. */
export const NotRefunded: Story = {
  args: { refund: REFUND_KEPT },
  play: async () => {
    expect(await screen.findByText("Not refunded")).toBeVisible();
  },
};
