import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, userEvent, within } from "storybook/test";
import { BookingManageCard } from "./booking-manage-card";
import {
  CANCELLED_RECORD,
  FIXTURE_TIME_ZONE_LABEL,
  LIVE_RECORD,
  MANAGE_CARD_COPY,
} from "./fixtures";

const meta = {
  title: "Appointment Booking/BookingManageCard",
  component: BookingManageCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: MANAGE_CARD_COPY,
    record: LIVE_RECORD,
    timeZoneLabel: FIXTURE_TIME_ZONE_LABEL,
    onMove: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof BookingManageCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A cancel is reported once, and only after the dialog confirms it. */
export const Live: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Move the visit" }),
    );
    expect(args.onMove).toHaveBeenCalledTimes(1);

    await userEvent.click(
      canvas.getByRole("button", { name: "Cancel the visit" }),
    );
    expect(args.onCancel).not.toHaveBeenCalled();
    const dialog = await screen.findByRole("dialog", {
      name: "Cancel this visit?",
    });
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Yes, cancel it" }),
    );
    expect(args.onCancel).toHaveBeenCalledTimes(1);
  },
};

export const Closed: Story = {
  args: { record: CANCELLED_RECORD },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Cancelled")).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Move the visit" })).toBeNull();
    expect(
      canvas.queryByRole("button", { name: "Cancel the visit" }),
    ).toBeNull();
  },
};

export const WithError: Story = {
  args: { error: "That time was just taken. Pick another." },
};
