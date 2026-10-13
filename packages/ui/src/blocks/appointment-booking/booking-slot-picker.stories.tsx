import { getMessages } from "@grade10/i18n";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { FIXTURE_TIME_ZONE } from "../../lib/datetime-fixtures";
import { VisitFullDay } from "../appointment-visit/visit-full-day";
import { BookingNotice } from "./booking-notice";
import { BookingSlotPicker } from "./booking-slot-picker";
import {
  BOARD_MONTH,
  BOARD_TODAY,
  OCTOBER_DAYS,
  SLOT_PICKER_COPY,
  THURSDAY_SLOTS,
  TODAY_SLOTS,
} from "./fixtures";

const { common } = getMessages("grade10", "en");

const meta = {
  title: "Appointment/Booking/Blocks/BookingSlotPicker",
  component: BookingSlotPicker,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: SLOT_PICKER_COPY,
    month: BOARD_MONTH,
    minMonth: BOARD_MONTH,
    maxMonth: "2026-12",
    today: BOARD_TODAY,
    days: { status: "ready", data: OCTOBER_DAYS },
    selectedDate: "2026-10-22",
    slots: { status: "ready", data: THURSDAY_SLOTS },
    timeZone: FIXTURE_TIME_ZONE,
    earliest: {
      label: "Earliest: today, 16:30",
      pressed: false,
      onPick: fn(),
    },
    footer: "Book at least 2 hours ahead, up to 60 days ahead.",
    onMonthChange: fn(),
    onSelectDay: fn(),
    onSelectSlot: fn(),
  },
} satisfies Meta<typeof BookingSlotPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The month beside the picked day's times, grouped by part of the day, all
 * in the shop's zone. Past days are out of reach; a full day still picks. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 2, name: "Pick a time" }),
    ).toBeVisible();
    expect(canvas.getByRole("status")).toHaveTextContent("October 2026");
    expect(canvas.getByText("Times in HKT")).toBeVisible();
    expect(canvas.getByText("Thu 22 Oct")).toBeVisible();
    expect(canvas.getByRole("group", { name: "Morning" })).toBeVisible();
    expect(canvas.getByRole("group", { name: "Evening" })).toBeVisible();
    expect(canvas.getByRole("button", { name: "Wed 14 Oct" })).toBeDisabled();
    const full = canvas.getByRole("button", { name: "Sat 17 Oct, Full" });
    expect(full).toBeEnabled();
    await userEvent.click(full);
    expect(args.onSelectDay).toHaveBeenCalledWith("2026-10-17");
    await userEvent.click(canvas.getByRole("button", { name: "15:00" }));
    expect(args.onSelectSlot).toHaveBeenCalledWith(THURSDAY_SLOTS[4]);
    await userEvent.click(
      canvas.getByRole("button", { name: /Earliest: today, 16:30/ }),
    );
    expect(args.earliest?.onPick).toHaveBeenCalledTimes(1);
  },
};

/** Today: the header says so and the earliest press is on. */
export const Today: Story = {
  args: {
    selectedDate: "2026-10-15",
    selectedStart: TODAY_SLOTS[0]?.start,
    slots: { status: "ready", data: TODAY_SLOTS },
    earliest: { label: "Earliest: today, 16:30", pressed: true, onPick: fn() },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Today, Thu 15 Oct")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: /Earliest: today, 16:30/ }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(canvas.getByRole("button", { name: "16:30" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  },
};

/** No day picked yet: the times column asks for one. */
export const NoDay: Story = {
  args: { selectedDate: undefined, earliest: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Pick a day to see its free times.")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Previous month" }),
    ).toBeDisabled();
  },
};

/** A card show changes the day's hours: the line sits over its times. */
export const SpecialHours: Story = {
  args: {
    selectedDate: "2026-10-24",
    note: "Open 12:00 to 18:00 · Card show at the convention centre",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText(
        "Open 12:00 to 18:00 · Card show at the convention centre",
      ),
    ).toBeVisible();
  },
};

/** A full day: the panel replaces its times and points at each shop's earliest. */
export const FullDay: Story = {
  args: {
    selectedDate: "2026-10-17",
    dayPanel: (
      <VisitFullDay
        copy={{
          title: "Sat 17 Oct is full at Central.",
          earliestEach: "Earliest at each shop",
          noFreeYet: "No free times yet",
        }}
        onPick={fn()}
        shops={[
          { id: "loc_central", name: "Central", earliest: "Today, 16:30" },
          {
            id: "loc_causeway_bay",
            name: "Causeway Bay",
            earliest: "Fri 16 Oct, 11:00",
          },
        ]}
      />
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Sat 17 Oct is full at Central.")).toBeVisible();
    expect(canvas.queryByRole("group", { name: "Morning" })).toBeNull();
  },
};

/** A time taken under the collector: the warning leads the step. */
export const TimeJustTaken: Story = {
  args: {
    selectedStart: undefined,
    notice: (
      <BookingNotice
        body="Pick another time. We kept your details."
        title="15:00 on Thu 22 Oct was just taken."
      />
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("alert")).toHaveTextContent(
      "15:00 on Thu 22 Oct was just taken.",
    );
  },
};

/** A phone reads a 14-day strip from today instead of the month. */
export const Strip: Story = {
  args: { layout: "strip", selectedDate: "2026-10-22" },
  globals: { viewport: { value: "mobile1" } },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("15 Oct to 28 Oct")).toBeVisible();
    expect(canvas.queryByRole("grid")).toBeNull();
    expect(canvas.getByRole("button", { name: "Earlier days" })).toBeDisabled();
    await userEvent.click(
      canvas.getByRole("button", { name: "Today, Thu 15 Oct" }),
    );
    expect(args.onSelectDay).toHaveBeenCalledWith("2026-10-15");
    await userEvent.click(canvas.getByRole("button", { name: "Later days" }));
    expect(canvas.getByText("29 Oct to 31 Oct")).toBeVisible();
  },
};

/** Stepping forward reports the next month; at the bound the step is gone. */
export const MonthBounds: Story = {
  args: { month: "2026-12", minMonth: BOARD_MONTH, selectedDate: undefined },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Next month" })).toBeDisabled();
    await userEvent.click(
      canvas.getByRole("button", { name: "Previous month" }),
    );
    expect(args.onMonthChange).toHaveBeenCalledWith("2026-11");
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
      action: { label: common.retry, onAction: fn() },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("The times could not be read.")).toBeVisible();
    expect(canvas.getByRole("button", { name: common.retry })).toBeVisible();
    expect(
      canvas.queryByText("Nothing is free on this day any more."),
    ).toBeNull();
  },
};

/** A label the consumer passes replaces the zone's short name, as the drop-off page does. */
export const LabelFromTheConsumer: Story = {
  args: { timeZoneLabel: "Hong Kong Standard Time" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("Times in Hong Kong Standard Time"),
    ).toBeInTheDocument();
    expect(canvas.queryByText("Times in HKT")).not.toBeInTheDocument();
  },
};
