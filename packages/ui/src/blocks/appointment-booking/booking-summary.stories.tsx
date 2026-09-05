import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { FIXTURE_TIME_ZONE } from "../../lib/datetime-fixtures";
import { BookingSummary } from "./booking-summary";
import { FIXTURE_TIME_ZONE_LABEL, LIVE_RECORD, SUMMARY_COPY } from "./fixtures";

const meta = {
  title: "Appointment Booking/BookingSummary",
  component: BookingSummary,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: SUMMARY_COPY,
    service: "Card grading",
    location: "Grade10 Central",
    address: "12 Queen’s Road Central, Hong Kong",
    start: LIVE_RECORD.start,
    end: LIVE_RECORD.end,
    timeZone: FIXTURE_TIME_ZONE,
    timeZoneLabel: FIXTURE_TIME_ZONE_LABEL,
  },
} satisfies Meta<typeof BookingSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("3 Sep 2026, 10:15–10:45 (Hong Kong time)"),
    ).toBeInTheDocument();
  },
};

/** Only the picks made so far render. */
export const ServiceOnly: Story = {
  args: {
    location: undefined,
    address: undefined,
    start: undefined,
    end: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Card grading")).toBeInTheDocument();
    expect(canvas.queryByText("Shop")).toBeNull();
  },
};
