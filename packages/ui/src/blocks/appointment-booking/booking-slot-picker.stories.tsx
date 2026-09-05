import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { FIXTURE_TIME_ZONE } from "../../lib/datetime-fixtures";
import { BookingSlotPicker } from "./booking-slot-picker";
import {
  FIXTURE_MONTH,
  FIXTURE_TIME_ZONE_LABEL,
  SEPTEMBER_3_SLOTS,
  SEPTEMBER_DAYS,
  SLOT_PICKER_COPY,
} from "./fixtures";

const meta = {
  title: "Appointment Booking/BookingSlotPicker",
  component: BookingSlotPicker,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: SLOT_PICKER_COPY,
    month: FIXTURE_MONTH,
    minMonth: FIXTURE_MONTH,
    maxMonth: "2026-10",
    days: { status: "ready", data: SEPTEMBER_DAYS },
    selectedDate: "2026-09-03",
    slots: { status: "ready", data: SEPTEMBER_3_SLOTS },
    timeZone: FIXTURE_TIME_ZONE,
    timeZoneLabel: FIXTURE_TIME_ZONE_LABEL,
    onMonthChange: fn(),
    onSelectDay: fn(),
    onSelectSlot: fn(),
  },
} satisfies Meta<typeof BookingSlotPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A closed Sunday cannot be picked; a listed time reports its slot; every
 * time reads in the shop's zone with the zone named. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Times in Hong Kong time")).toBeInTheDocument();
    expect(canvas.getByText("September 2026")).toBeInTheDocument();

    const sunday = canvas.getByRole("button", { name: "6" });
    expect(sunday).toBeDisabled();
    expect(sunday).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(canvas.getByRole("button", { name: "4" }));
    expect(args.onSelectDay).toHaveBeenCalledWith("2026-09-04");

    expect(canvas.queryByRole("button", { name: "11:00" })).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "10:15" }));
    expect(args.onSelectSlot).toHaveBeenCalledWith(SEPTEMBER_3_SLOTS[1]);
  },
};

/** Stepping forward reports the next month; at the bound the step is gone. */
export const MonthBounds: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Previous month" }),
    ).toBeDisabled();
    await userEvent.click(canvas.getByRole("button", { name: "Next month" }));
    expect(args.onMonthChange).toHaveBeenCalledWith("2026-10");
  },
};

export const LastMonth: Story = {
  args: { month: "2026-10", selectedDate: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Next month" })).toBeDisabled();
    expect(
      canvas.getByText("Pick a day to see its times."),
    ).toBeInTheDocument();
  },
};

export const Loading: Story = {
  args: { days: { status: "loading" }, slots: { status: "loading" } },
};

/** A failed read of the times is an error with a way to retry, never a day
 * with nothing free. */
export const Failed: Story = {
  args: {
    slots: {
      status: "error",
      message: "The times could not be read.",
      action: { label: "Try again", onAction: fn() },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("The times could not be read.")).toBeVisible();
    expect(canvas.getByRole("button", { name: "Try again" })).toBeVisible();
    expect(
      canvas.queryByText("Nothing is free on this day any more."),
    ).toBeNull();
  },
};
