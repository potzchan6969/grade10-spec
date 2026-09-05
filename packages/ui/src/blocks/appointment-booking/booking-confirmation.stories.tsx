import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { BookingConfirmation } from "./booking-confirmation";
import {
  CONFIRMATION_COPY,
  FIXTURE_TIME_ZONE_LABEL,
  LIVE_RECORD,
} from "./fixtures";

const meta = {
  title: "Appointment Booking/BookingConfirmation",
  component: BookingConfirmation,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: CONFIRMATION_COPY,
    record: LIVE_RECORD,
    manageHref: "#/book/manage",
    calendarHref: "#/book/bk_live.ics",
    timeZoneLabel: FIXTURE_TIME_ZONE_LABEL,
  },
} satisfies Meta<typeof BookingConfirmation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("link", { name: "Move or cancel this visit" }),
    ).toHaveAttribute("href", "#/book/manage");
    expect(
      canvas.getByRole("link", { name: "Add to calendar" }),
    ).toHaveAttribute("href", "#/book/bk_live.ics");
  },
};

export const WithoutCalendarFile: Story = {
  args: { calendarHref: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("link", { name: "Add to calendar" })).toBeNull();
  },
};
