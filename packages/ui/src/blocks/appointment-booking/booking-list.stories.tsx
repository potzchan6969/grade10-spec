import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { FIXTURE_TIME_ZONE } from "../../lib/datetime-fixtures";
import { BookingList } from "./booking-list";
import {
  CANCELLED_RECORD,
  COMPLETED_RECORD,
  FIXTURE_BOOKING_NOW_MS,
  FIXTURE_TIME_ZONE_LABEL,
  LATER_RECORD,
  LIST_COPY,
  LIVE_RECORD,
} from "./fixtures";

const meta = {
  title: "Appointment Booking/BookingList",
  component: BookingList,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: LIST_COPY,
    records: {
      status: "ready",
      data: [COMPLETED_RECORD, LATER_RECORD, CANCELLED_RECORD, LIVE_RECORD],
    },
    now: FIXTURE_BOOKING_NOW_MS,
    timeZoneLabels: { [FIXTURE_TIME_ZONE]: FIXTURE_TIME_ZONE_LABEL },
    onOpen: fn(),
  },
} satisfies Meta<typeof BookingList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Upcoming visits soonest first, then the past and closed ones latest
 * first, whatever order they arrived in. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const items = canvasElement.querySelectorAll(
      '[data-slot="booking-list-item"]',
    );
    const whens = Array.from(items, (item) =>
      item
        .querySelector('[data-slot="booking-state"]')
        ?.getAttribute("data-state"),
    );
    expect(whens).toEqual(["booked", "booked", "cancelled", "completed"]);
    expect(items[0]?.textContent).toContain("3 Sep 2026");
    expect(items[1]?.textContent).toContain("10 Sep 2026");
    expect(items[2]?.textContent).toContain("5 Sep 2026");
    expect(items[3]?.textContent).toContain("24 Aug 2026");

    await userEvent.click(canvas.getAllByRole("button", { name: "Open" })[0]);
    expect(args.onOpen).toHaveBeenCalledWith("bk_live");
  },
};

export const Empty: Story = {
  args: { records: { status: "ready", data: [] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("No visits yet")).toBeInTheDocument();
  },
};

export const Failed: Story = {
  args: {
    records: {
      status: "error",
      message: "Your visits could not be read.",
      action: { label: "Try again", onAction: fn() },
    },
  },
};
